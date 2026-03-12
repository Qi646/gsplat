import * as THREE from 'three';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StepwiseAgentOrchestrator } from '../path/stepwiseAgent';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';

function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);
  camera.position.set(0, 1.5, 6);
  camera.lookAt(new THREE.Vector3(0, 1.5, 0));
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
}

function createViewer(): { camera: THREE.PerspectiveCamera; viewer: ViewerAdapter } {
  const camera = createCamera();
  const bounds = new THREE.Box3(new THREE.Vector3(-8, 0, -8), new THREE.Vector3(8, 6, 8));
  const viewer = {
    applyCameraPose: (pose: { fov: number; position: THREE.Vector3; quaternion: THREE.Quaternion }) => {
      camera.position.copy(pose.position);
      camera.quaternion.copy(pose.quaternion);
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
    },
    captureFrame: async () => new Blob(['frame'], { type: 'image/png' }),
    getCamera: () => camera,
    getSceneBounds: () => bounds.clone(),
    isSceneLoaded: () => true,
    renderNow: () => {},
  } as unknown as ViewerAdapter;

  return { camera, viewer };
}

function sceneScale(): number {
  return new THREE.Vector3(16, 6, 16).length();
}

function installCaptureStubs(): void {
  vi.stubGlobal('createImageBitmap', vi.fn(async () => ({
    close: vi.fn(),
    height: 480,
    width: 640,
  })));
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({
      getContext: vi.fn(() => ({
        drawImage: vi.fn(),
      })),
      height: 0,
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,AA=='),
      width: 0,
    })),
  } as unknown as Document);
  vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('StepwiseAgentOrchestrator', () => {
  it('binds ambient browser fetch to globalThis before calling the stepwise planner', async () => {
    installCaptureStubs();
    const { viewer } = createViewer();
    const originalFetch = globalThis.fetch;
    const fetchCalls: string[] = [];
    let responseIndex = 0;
    const responses = [
      {
        action: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the opening view.',
      },
      {
        action: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the ending view.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested move is represented.',
      },
    ];

    const globalFetch = vi.fn(function (this: typeof globalThis, input: RequestInfo | URL) {
      if (this !== globalThis) {
        throw new Error("'fetch' called on an object that does not implement interface Window.");
      }

      const url = String(input);
      fetchCalls.push(url);
      const body = responses[responseIndex] ?? responses.at(-1);
      responseIndex += 1;
      return Promise.resolve(new Response(JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }));
    }) as typeof fetch;

    globalThis.fetch = globalFetch;

    try {
      const orchestrator = new StepwiseAgentOrchestrator({ viewer });
      const draft = await orchestrator.generateDraft({
        controls: {
          holdPreference: 'auto',
          requestedDurationSeconds: 8,
        },
        existingKeyframes: [],
        prompt: 'Create a short continuous move around this subject.',
      });

      expect(draft.keyframes).toHaveLength(2);
      expect(globalFetch).toHaveBeenCalledTimes(3);
      expect(fetchCalls).toEqual(['/api/path/step', '/api/path/step', '/api/path/step']);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('builds a draft from capture, memory, move, and keyframe actions', async () => {
    installCaptureStubs();
    const { viewer } = createViewer();
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        localIntent: {
          kind: 'preserve-opening-view',
          successCriteria: ['store the current pose'],
        },
        pathMode: 'subject-centric',
        reason: 'Store the opening view.',
      },
      {
        chosenAction: { type: 'capture-image' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Remember this subject framing for later.',
      },
      {
        candidateAssessment: [
          {
            action: { primitive: 'yaw-left-small', type: 'rotate' },
            assessment: 'A small re-aim starts the orbit without changing position.',
            score: 0.64,
          },
        ],
        chosenAction: { primitive: 'yaw-left-small', type: 'rotate' },
        complete: false,
        localIntent: {
          kind: 'change-viewpoint-around-subject',
          successCriteria: ['begin changing the view while keeping the subject readable'],
        },
        pathMode: 'subject-centric',
        reason: 'Rotate slightly around the subject.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the rotated composition.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested motion is represented.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'auto',
        requestedDurationSeconds: 12,
      },
      existingKeyframes: [],
      prompt: 'Create one continuous cinematic move around this truck.',
    });

    expect(fetchImpl).toHaveBeenCalledTimes(5);
    expect(draft.keyframes).toHaveLength(2);
    expect(draft.summary).toContain('stepwise draft');
  });

  it('rejects an unsafe step until the planner creates enough keyframes', async () => {
    installCaptureStubs();
    const { camera, viewer } = createViewer();
    camera.position.set(7.8, 0.25, 7.8);
    camera.lookAt(new THREE.Vector3(0, 1.5, 0));
    camera.updateMatrixWorld(true);
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'route-following',
        reason: 'Store the opening route view.',
      },
      {
        chosenAction: { primitive: 'forward-medium', type: 'move' },
        complete: false,
        pathMode: 'route-following',
        reason: 'Move forward along the corridor.',
      },
      {
        chosenAction: { primitive: 'yaw-left-medium', type: 'rotate' },
        complete: false,
        pathMode: 'route-following',
        reason: 'Turn back into the route direction.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'route-following',
        reason: 'Store the corrected route view.',
      },
      {
        complete: true,
        pathMode: 'route-following',
        reason: 'The route draft now has enough coverage.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'none',
        requestedDurationSeconds: 8,
      },
      existingKeyframes: [],
      prompt: 'Follow one continuous route through the corridor.',
    });

    expect(fetchImpl).toHaveBeenCalledTimes(5);
    expect(draft.keyframes).toHaveLength(2);
  });

  it('allows in-place subject rotations when a small subject is framed from outside tight scene bounds', async () => {
    installCaptureStubs();
    const { camera, viewer } = createViewer();
    camera.position.set(0, 1.5, 10.5);
    camera.lookAt(new THREE.Vector3(0, 1.5, 0));
    camera.updateMatrixWorld(true);
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the opening composition.',
      },
      {
        chosenAction: { primitive: 'yaw-right-small', type: 'rotate' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Rotate slightly to face the subject front.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the corrected front-facing composition.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested front-facing move is represented.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const startingPosition = camera.position.clone();
    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'none',
        requestedDurationSeconds: 6,
      },
      existingKeyframes: [],
      prompt: 'Face the front of Luigi while keeping him centered.',
    });

    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(draft.keyframes).toHaveLength(2);
    expect(draft.keyframes[1]?.position).toEqual({
      x: startingPosition.x,
      y: startingPosition.y,
      z: startingPosition.z,
    });
    expect(draft.keyframes[1]?.quaternion).not.toEqual(draft.keyframes[0]?.quaternion);
  });

  it('does not send remembered images back to the planner on later steps', async () => {
    installCaptureStubs();
    const { viewer } = createViewer();
    const requestBodies: Array<Record<string, unknown>> = [];
    const responses = [
      {
        chosenAction: { type: 'capture-image' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Remember the opening subject framing.',
      },
      {
        chosenAction: { primitive: 'yaw-left-small', type: 'rotate' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Start orbiting the subject.',
      },
      {
        chosenAction: { type: 'capture-image' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Remember the improved front-quarter view.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store this stronger composition.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the ending view.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested move is represented.',
      },
    ];
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body) {
        requestBodies.push(JSON.parse(String(init.body)) as Record<string, unknown>);
      }
      return new Response(JSON.stringify(responses.shift()), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    });

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'brief',
        requestedDurationSeconds: 10,
      },
      existingKeyframes: [],
      prompt: 'Create one cinematic move around this truck and hold on the front.',
    });

    expect(draft.keyframes).toHaveLength(2);
    expect(requestBodies).toHaveLength(6);
    expect(requestBodies[0]?.memoryCaptures).toEqual([]);
    expect(requestBodies[1]?.memoryCaptures).toEqual([]);
    expect(requestBodies[2]?.memoryCaptures).toEqual([]);
    expect(requestBodies[3]?.memoryCaptures).toEqual([]);
    expect(requestBodies[4]?.memoryCaptures).toEqual([]);
    const candidateActions = requestBodies[0]?.candidateActions;
    expect(Array.isArray(candidateActions)).toBe(true);
    expect(candidateActions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        action: { type: 'create-keyframe' },
        predictedOutcome: expect.objectContaining({
          effectKind: 'preserve',
        }),
      }),
      expect.objectContaining({
        action: { primitive: 'yaw-right-small', type: 'rotate' },
        predictedOutcome: expect.objectContaining({
          effectKind: 'rotate',
          rotationDegrees: expect.objectContaining({
            pitch: 0,
            yaw: expect.closeTo(-6, 5),
          }),
        }),
      }),
      expect.objectContaining({
        action: { primitive: 'strafe-left-short', type: 'move' },
        predictedOutcome: expect.objectContaining({
          effectKind: 'translate',
          translationLocal: { forward: 0, right: -0.07, up: 0 },
        }),
      }),
    ]));
  });

  it('yaws around camera-local up for rolled cameras', async () => {
    installCaptureStubs();
    const { camera, viewer } = createViewer();
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    camera.updateMatrixWorld(true);
    const startingQuaternion = camera.quaternion.clone();
    const startingUp = new THREE.Vector3(0, 1, 0).applyQuaternion(startingQuaternion).normalize();
    const expectedQuaternion = startingQuaternion.clone()
      .premultiply(new THREE.Quaternion().setFromAxisAngle(startingUp, THREE.MathUtils.degToRad(6)))
      .normalize();
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the opening composition.',
      },
      {
        chosenAction: { primitive: 'yaw-left-small', type: 'rotate' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Yaw left to re-center the subject.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the updated composition.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested move is represented.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'none',
        requestedDurationSeconds: 6,
      },
      existingKeyframes: [],
      prompt: 'Turn slightly left while staying on this framing.',
    });

    const rotatedQuaternion = draft.keyframes[1]?.quaternion;
    expect(rotatedQuaternion).toBeDefined();
    expect(rotatedQuaternion?.x).toBeCloseTo(expectedQuaternion.x, 6);
    expect(rotatedQuaternion?.y).toBeCloseTo(expectedQuaternion.y, 6);
    expect(rotatedQuaternion?.z).toBeCloseTo(expectedQuaternion.z, 6);
    expect(rotatedQuaternion?.w).toBeCloseTo(expectedQuaternion.w, 6);
  });

  it('moves rise and lower along camera-local up for rolled cameras', async () => {
    installCaptureStubs();
    const { camera, viewer } = createViewer();
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    camera.updateMatrixWorld(true);
    const startingPosition = camera.position.clone();
    const expectedOffset = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(sceneScale() * 0.06);
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the opening composition.',
      },
      {
        chosenAction: { primitive: 'rise-short', type: 'move' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Move upward while keeping the view orientation.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the raised composition.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested move is represented.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'none',
        requestedDurationSeconds: 6,
      },
      existingKeyframes: [],
      prompt: 'Rise slightly without changing the framing direction.',
    });

    expect(draft.keyframes[1]?.position.x).toBeCloseTo(startingPosition.x + expectedOffset.x, 6);
    expect(draft.keyframes[1]?.position.y).toBeCloseTo(startingPosition.y + expectedOffset.y, 6);
    expect(draft.keyframes[1]?.position.z).toBeCloseTo(startingPosition.z + expectedOffset.z, 6);
  });

  it('moves forward along camera-local forward for upside-down cameras', async () => {
    installCaptureStubs();
    const { camera, viewer } = createViewer();
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    camera.updateMatrixWorld(true);
    const startingPosition = camera.position.clone();
    const expectedOffset = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(sceneScale() * 0.09);
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the opening composition.',
      },
      {
        chosenAction: { primitive: 'forward-short', type: 'move' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Move forward along the current view direction.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the advanced composition.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested move is represented.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'none',
        requestedDurationSeconds: 6,
      },
      existingKeyframes: [],
      prompt: 'Move slightly forward while staying upside down.',
    });

    expect(draft.keyframes[1]?.position.x).toBeCloseTo(startingPosition.x + expectedOffset.x, 6);
    expect(draft.keyframes[1]?.position.y).toBeCloseTo(startingPosition.y + expectedOffset.y, 6);
    expect(draft.keyframes[1]?.position.z).toBeCloseTo(startingPosition.z + expectedOffset.z, 6);
  });

  it('pitches around camera-local right for upside-down cameras', async () => {
    installCaptureStubs();
    const { camera, viewer } = createViewer();
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    camera.updateMatrixWorld(true);
    const startingQuaternion = camera.quaternion.clone();
    const startingRight = new THREE.Vector3(1, 0, 0).applyQuaternion(startingQuaternion).normalize();
    const expectedQuaternion = startingQuaternion.clone()
      .premultiply(new THREE.Quaternion().setFromAxisAngle(startingRight, THREE.MathUtils.degToRad(-6)))
      .normalize();
    const responses = [
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the opening composition.',
      },
      {
        chosenAction: { primitive: 'pitch-down-small', type: 'rotate' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Tilt downward slightly.',
      },
      {
        chosenAction: { type: 'create-keyframe' },
        complete: false,
        pathMode: 'subject-centric',
        reason: 'Store the pitched composition.',
      },
      {
        complete: true,
        pathMode: 'subject-centric',
        reason: 'The requested move is represented.',
      },
    ];
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(responses.shift()), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }));

    const orchestrator = new StepwiseAgentOrchestrator({ fetchImpl, viewer });
    const draft = await orchestrator.generateDraft({
      controls: {
        holdPreference: 'none',
        requestedDurationSeconds: 6,
      },
      existingKeyframes: [],
      prompt: 'Tilt slightly downward while upside down.',
    });

    const rotatedQuaternion = draft.keyframes[1]?.quaternion;
    expect(rotatedQuaternion).toBeDefined();
    expect(rotatedQuaternion?.x).toBeCloseTo(expectedQuaternion.x, 6);
    expect(rotatedQuaternion?.y).toBeCloseTo(expectedQuaternion.y, 6);
    expect(rotatedQuaternion?.z).toBeCloseTo(expectedQuaternion.z, 6);
    expect(rotatedQuaternion?.w).toBeCloseTo(expectedQuaternion.w, 6);
  });
});
