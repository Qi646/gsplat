import * as THREE from 'three';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AgenticPathOrchestrator,
  buildDraftPath,
  buildScoutCameraPoses,
  buildTargetedRescanPoses,
  groundSubjectFromLocalizations,
  validateDraftPath,
  type AgenticDraftControls,
  type AgenticGroundResponse,
  type AgenticPathCapture,
  type AgenticPathSegmentPlan,
  type AgenticSubjectLocalization,
} from '../path/agenticPath';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';

function createCamera(
  position: THREE.Vector3,
  target: THREE.Vector3,
  aspect = 16 / 9,
  up = new THREE.Vector3(0, 1, 0),
): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.copy(position);
  camera.up.copy(up).normalize();
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
}

function createCapture(id: string, camera: THREE.PerspectiveCamera): AgenticPathCapture {
  return {
    camera: {
      aspect: camera.aspect,
      fov: camera.fov,
      position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
      quaternion: {
        w: camera.quaternion.w,
        x: camera.quaternion.x,
        y: camera.quaternion.y,
        z: camera.quaternion.z,
      },
    },
    height: 900,
    id,
    imageDataUrl: 'data:image/jpeg;base64,AA==',
    role: 'scout',
    width: 1600,
  };
}

function projectPoint(point: THREE.Vector3, capture: AgenticPathCapture): AgenticSubjectLocalization {
  const camera = createCamera(
    new THREE.Vector3(
      capture.camera.position.x,
      capture.camera.position.y,
      capture.camera.position.z,
    ),
    point,
    capture.camera.aspect,
  );
  camera.quaternion.set(
    capture.camera.quaternion.x,
    capture.camera.quaternion.y,
    capture.camera.quaternion.z,
    capture.camera.quaternion.w,
  );
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const projected = point.clone().project(camera);
  return {
    captureId: capture.id,
    confidence: 0.98,
    pixelX: ((projected.x + 1) / 2) * capture.width,
    pixelY: ((1 - projected.y) / 2) * capture.height,
  };
}

function createGroundResponse(
  pathMode: AgenticGroundResponse['pathMode'],
  localizations: AgenticSubjectLocalization[],
): AgenticGroundResponse {
  return {
    intent: {
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode,
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 10,
      tone: 'cinematic',
    },
    pathMode,
    subjectLocalizations: localizations,
    unsupportedReason: pathMode === 'subject-centric' ? undefined : 'Unsupported prompt class.',
  };
}

function createSegmentPlan(overrides: Partial<AgenticPathSegmentPlan> = {}): AgenticPathSegmentPlan {
  return {
    durationSeconds: 4,
    lookMode: 'look-at-subject',
    segmentType: 'arc',
    sweepDegrees: 120,
    ...overrides,
  } as AgenticPathSegmentPlan;
}

function createDraftControls(overrides: Partial<AgenticDraftControls> = {}): AgenticDraftControls {
  return {
    holdPreference: 'auto',
    requestedDurationSeconds: null,
    ...overrides,
  };
}

function createMockViewer(options: {
  bounds?: THREE.Box3;
  captureFrame?: () => Promise<Blob>;
  initialCamera?: THREE.PerspectiveCamera;
} = {}): {
  camera: THREE.PerspectiveCamera;
  viewer: ViewerAdapter;
} {
  const bounds = options.bounds ?? new THREE.Box3(
    new THREE.Vector3(-4, -2, -4),
    new THREE.Vector3(4, 4, 4),
  );
  const camera = options.initialCamera ?? createCamera(new THREE.Vector3(5, 1, 0), bounds.getCenter(new THREE.Vector3()));

  const viewer = {
    applyCameraPose: (pose: { fov: number; position: THREE.Vector3; quaternion: THREE.Quaternion }) => {
      camera.position.copy(pose.position);
      camera.quaternion.copy(pose.quaternion);
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
    },
    captureFrame: options.captureFrame ?? (async () => new Blob(['frame'], { type: 'image/png' })),
    getCamera: () => camera,
    getSceneBounds: () => bounds.clone(),
    isSceneLoaded: () => true,
    renderNow: () => {},
  } as unknown as ViewerAdapter;

  return { camera, viewer };
}

function installCapturePipelineStubs(): void {
  vi.stubGlobal('createImageBitmap', vi.fn(async () => ({
    close: vi.fn(),
    height: 600,
    width: 800,
  })));
  vi.stubGlobal('document', {
    createElement: vi.fn((tagName: string) => {
      if (tagName.toLowerCase() !== 'canvas') {
        throw new Error(`Unexpected element request in test stub: ${tagName}`);
      }

      return {
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
        })),
        height: 0,
        toDataURL: vi.fn(() => 'data:image/jpeg;base64,AA=='),
        width: 0,
      } as unknown as HTMLCanvasElement;
    }),
  } as unknown as Document);
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('buildScoutCameraPoses', () => {
  it('creates six deterministic scout poses around the current view', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-2, -1, -2),
      new THREE.Vector3(2, 3, 2),
    );
    const camera = createCamera(new THREE.Vector3(5, 2, 0), bounds.getCenter(new THREE.Vector3()));
    const currentDistance = camera.position.distanceTo(bounds.getCenter(new THREE.Vector3()));

    const poses = buildScoutCameraPoses(bounds, camera);

    expect(poses).toHaveLength(6);
    poses.forEach(pose => {
      expect(pose.position.distanceTo(camera.position)).toBeGreaterThan(0.2);
      expect(pose.position.distanceTo(camera.position)).toBeLessThan(currentDistance * 0.6);
    });
  });

  it('preserves the live camera orbit axis for non-Y-up views', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -4, -6),
      new THREE.Vector3(4, 4, 6),
    );
    const center = bounds.getCenter(new THREE.Vector3());
    const sceneUp = new THREE.Vector3(0, 0, 1);
    const camera = createCamera(new THREE.Vector3(6, 0, 3), center, 16 / 9, sceneUp);
    const baseCameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();

    const poses = buildScoutCameraPoses(bounds, camera);

    expect(poses).toHaveLength(6);
    poses.forEach(pose => {
      const poseUp = new THREE.Vector3(0, 1, 0).applyQuaternion(pose.quaternion).normalize();
      expect(poseUp.dot(baseCameraUp)).toBeGreaterThan(0.98);
    });
  });
});

describe('buildTargetedRescanPoses', () => {
  it('creates four tighter rescans around the provisional anchor', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -4, -6),
      new THREE.Vector3(4, 4, 6),
    );
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const camera = createCamera(new THREE.Vector3(5, 1, 3), anchor);

    const poses = buildTargetedRescanPoses(anchor, bounds, camera);

    expect(poses).toHaveLength(4);
    poses.forEach(pose => {
      expect(pose.position.distanceTo(anchor)).toBeLessThan(camera.position.distanceTo(anchor) * 1.1);
    });
  });
});

describe('groundSubjectFromLocalizations', () => {
  it('reconstructs a grounded subject with confidence and residual data', () => {
    const subject = new THREE.Vector3(1.5, 0.75, -0.5);
    const captureA = createCapture('capture-a', createCamera(new THREE.Vector3(6, 2, 3), subject));
    const captureB = createCapture('capture-b', createCamera(new THREE.Vector3(-5, 1.5, 2), subject));
    const sceneBounds = new THREE.Box3(
      new THREE.Vector3(-10, -3, -10),
      new THREE.Vector3(10, 6, 10),
    );
    const basePose = {
      fov: 60,
      position: new THREE.Vector3(5, 1, 0),
      quaternion: createCamera(new THREE.Vector3(5, 1, 0), subject).quaternion.clone(),
    };

    const grounded = groundSubjectFromLocalizations(
      [projectPoint(subject, captureA), projectPoint(subject, captureB)],
      [captureA, captureB],
      sceneBounds,
      basePose,
    );

    const solvedAnchor = new THREE.Vector3(
      grounded.anchor.x,
      grounded.anchor.y,
      grounded.anchor.z,
    );
    expect(solvedAnchor.distanceTo(subject)).toBeLessThan(0.05);
    expect(grounded.confidence).toBeGreaterThan(0.5);
    expect(grounded.meanResidual).toBeLessThan(0.05);
  });
});

describe('buildDraftPath and validateDraftPath', () => {
  it('builds a multi-segment draft that validates successfully', () => {
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const baseCamera = createCamera(new THREE.Vector3(5, 1, 0), anchor);

    const builtDraft = buildDraftPath({
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      groundedSubject: {
        anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
        basisForward: { x: 0, y: 0, z: -1 },
        basisUp: { x: 0, y: 1, z: 0 },
        captureCount: 4,
        confidence: 0.88,
        meanResidual: 0.05,
        sceneScale: bounds.getSize(new THREE.Vector3()).length(),
      },
      segments: [
        createSegmentPlan({ segmentType: 'arc', sweepDegrees: 90 }),
        createSegmentPlan({ durationSeconds: 2, segmentType: 'hold' }),
      ],
      startTime: 0,
    });

    const validation = validateDraftPath(builtDraft, bounds, {
      anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 4,
      confidence: 0.88,
      meanResidual: 0.05,
      sceneScale: bounds.getSize(new THREE.Vector3()).length(),
    });

    expect(builtDraft.keyframes.length).toBeGreaterThan(3);
    expect(validation.valid).toBe(true);
  });

  it('reframes an overly close starting pose before validating the draft', () => {
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const builtDraft = buildDraftPath({
      basePose: {
        fov: 60,
        position: new THREE.Vector3(0.12, 0.55, 0.06),
        quaternion: createCamera(new THREE.Vector3(0.12, 0.55, 0.06), anchor).quaternion.clone(),
      },
      bounds,
      groundedSubject: {
        anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
        basisForward: { x: 0, y: 0, z: -1 },
        basisUp: { x: 0, y: 1, z: 0 },
        captureCount: 3,
        confidence: 0.82,
        meanResidual: 0.08,
        sceneScale: bounds.getSize(new THREE.Vector3()).length(),
      },
      segments: [
        createSegmentPlan({ durationSeconds: 6, segmentType: 'hold' }),
      ],
      startTime: 0,
    });

    const firstKeyframe = builtDraft.keyframes[0];
    const firstPosition = new THREE.Vector3(
      firstKeyframe?.position.x ?? 0,
      firstKeyframe?.position.y ?? 0,
      firstKeyframe?.position.z ?? 0,
    );

    expect(firstPosition.distanceTo(anchor)).toBeGreaterThanOrEqual(
      Math.max(0.7, bounds.getSize(new THREE.Vector3()).length() * 0.18) - 1e-6,
    );

    const validation = validateDraftPath(builtDraft, bounds, {
      anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 3,
      confidence: 0.82,
      meanResidual: 0.08,
      sceneScale: bounds.getSize(new THREE.Vector3()).length(),
    });

    expect(validation.valid).toBe(true);
  });

  it('flags invalid drafts when the subject leaves the frame', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-2, -2, -2),
      new THREE.Vector3(2, 2, 2),
    );
    const builtDraft = buildDraftPath({
      basePose: {
        fov: 60,
        position: new THREE.Vector3(5, 0, 0),
        quaternion: new THREE.Quaternion(),
      },
      bounds,
      groundedSubject: {
        anchor: { x: 0, y: 0, z: 0 },
        basisForward: { x: 0, y: 0, z: -1 },
        basisUp: { x: 0, y: 1, z: 0 },
        captureCount: 2,
        confidence: 0.5,
        meanResidual: 0.1,
        sceneScale: bounds.getSize(new THREE.Vector3()).length(),
      },
      segments: [
        createSegmentPlan({
          durationSeconds: 6,
          lookMode: 'look-forward',
          segmentType: 'pedestal',
          travelDirection: 'up',
        }),
      ],
      startTime: 0,
    });

    const validation = validateDraftPath(builtDraft, bounds, {
      anchor: { x: 0, y: 0, z: 0 },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 2,
      confidence: 0.5,
      meanResidual: 0.1,
      sceneScale: bounds.getSize(new THREE.Vector3()).length(),
    });

    expect(validation.valid).toBe(false);
    expect(validation.feedback.join(' ')).toMatch(/subject|frame|camera/i);
  });

  it('requires an explicit ending hold when lingering hold is requested', () => {
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const baseCamera = createCamera(new THREE.Vector3(5, 1, 0), anchor);
    const segments = [
      createSegmentPlan({ durationSeconds: 8, segmentType: 'arc', sweepDegrees: 90 }),
    ];

    const builtDraft = buildDraftPath({
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      groundedSubject: {
        anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
        basisForward: { x: 0, y: 0, z: -1 },
        basisUp: { x: 0, y: 1, z: 0 },
        captureCount: 4,
        confidence: 0.88,
        meanResidual: 0.05,
        sceneScale: bounds.getSize(new THREE.Vector3()).length(),
      },
      segments,
      startTime: 0,
    });

    const validation = validateDraftPath(
      builtDraft,
      bounds,
      {
        anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
        basisForward: { x: 0, y: 0, z: -1 },
        basisUp: { x: 0, y: 1, z: 0 },
        captureCount: 4,
        confidence: 0.88,
        meanResidual: 0.05,
        sceneScale: bounds.getSize(new THREE.Vector3()).length(),
      },
      createDraftControls({ holdPreference: 'linger', requestedDurationSeconds: 8 }),
      segments,
    );

    expect(validation.valid).toBe(false);
    expect(validation.feedback).toContain('The requested lingering ending hold was missing or too short.');
  });

  it('keeps downward pedestal drafts above the scene floor', () => {
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const builtDraft = buildDraftPath({
      basePose: {
        fov: 60,
        position: new THREE.Vector3(5, -1.6, 0),
        quaternion: createCamera(new THREE.Vector3(5, -1.6, 0), anchor).quaternion.clone(),
      },
      bounds,
      groundedSubject: {
        anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
        basisForward: { x: 0, y: 0, z: -1 },
        basisUp: { x: 0, y: 1, z: 0 },
        captureCount: 4,
        confidence: 0.88,
        meanResidual: 0.05,
        sceneScale: bounds.getSize(new THREE.Vector3()).length(),
      },
      segments: [
        createSegmentPlan({
          durationSeconds: 6,
          lookMode: 'look-at-subject',
          segmentType: 'pedestal',
          travelDirection: 'down',
        }),
      ],
      startTime: 0,
    });

    const floorThreshold = bounds.min.y + Math.max(bounds.getSize(new THREE.Vector3()).length() * 0.04, 0.2) - 1e-6;
    builtDraft.keyframes.forEach(keyframe => {
      expect(keyframe.position.y).toBeGreaterThanOrEqual(floorThreshold);
    });
  });
});

describe('AgenticPathOrchestrator', () => {
  it('runs the full draft-generation pipeline with a repair pass', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const progressStages: string[] = [];
    const { viewer } = createMockViewer();
    const groundResponses: AgenticGroundResponse[] = [];
    const composeResponses = [
      {
        segments: [
          createSegmentPlan({
            durationSeconds: 4,
            lookMode: 'look-forward',
            segmentType: 'pedestal',
            travelDirection: 'up',
          }),
        ],
        summary: 'Bad first draft.',
      },
      {
        segments: [
          {
            direction: 'right',
            durationSeconds: 4,
            lookMode: 'look-at-subject',
            segmentType: 'arc',
            sweepDegrees: 90,
            verticalBias: 0.15,
          },
          createSegmentPlan({ durationSeconds: 2, segmentType: 'hold' }),
        ],
        summary: 'Repaired draft.',
      },
    ];
    const verifyResponses = [
      {
        approved: true,
        issues: [],
      },
    ];

    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/path/ground')) {
        const request = JSON.parse(String(init?.body ?? '{}')) as { captures: AgenticPathCapture[] };
        const subject = new THREE.Vector3(0, 0.5, 0);
        const response = createGroundResponse(
          'subject-centric',
          request.captures.map(capture => projectPoint(subject, capture)),
        );
        groundResponses.push(response);
        return new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url.endsWith('/api/path/verify')) {
        return new Response(JSON.stringify(verifyResponses.shift()), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify(composeResponses.shift()), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;

    const orchestrator = new AgenticPathOrchestrator({
      fetchImpl,
      onProgress: progress => {
        progressStages.push(progress.stage);
      },
      viewer,
    });

    const draft = await orchestrator.generateDraft({
      controls: createDraftControls(),
      existingKeyframes: [],
      prompt: 'Create a cinematic arc around the truck and then hold.',
    });

    expect(draft.summary).toBe('Repaired draft.');
    expect(draft.keyframes.length).toBeGreaterThan(3);
    expect(groundResponses).toHaveLength(1);
    expect(progressStages.slice(0, 12)).toEqual([
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'grounding',
      'composing',
      'validating',
      'repairing',
      'validating',
    ]);
    expect(progressStages.filter(stage => stage === 'verifying').length).toBeGreaterThanOrEqual(5);
  });

  it('uses the rescue round when only the current view localizes the subject initially', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const progressStages: string[] = [];
    const { viewer } = createMockViewer();
    let groundCallCount = 0;
    const verifyResponses = [{ approved: true, issues: [] }];
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/path/ground')) {
        groundCallCount += 1;
        const request = JSON.parse(String(init?.body ?? '{}')) as { captures: AgenticPathCapture[] };
        const subject = new THREE.Vector3(0, 0.5, 0);
        const captures = groundCallCount === 1 ? request.captures.slice(0, 1) : request.captures;
        return new Response(JSON.stringify(createGroundResponse(
          'subject-centric',
          captures.map(capture => projectPoint(subject, capture)),
        )), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url.endsWith('/api/path/verify')) {
        return new Response(JSON.stringify(verifyResponses.shift()), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify({
        segments: [
          createSegmentPlan({ segmentType: 'arc', sweepDegrees: 90 }),
          createSegmentPlan({ durationSeconds: 2, segmentType: 'hold' }),
        ],
        summary: 'Recovered draft.',
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;

    const orchestrator = new AgenticPathOrchestrator({
      fetchImpl,
      onProgress: progress => {
        progressStages.push(progress.stage);
      },
      viewer,
    });

    const draft = await orchestrator.generateDraft({
      controls: createDraftControls(),
      existingKeyframes: [],
      prompt: 'Create a cinematic arc around the truck and then hold.',
    });

    expect(draft.summary).toBe('Recovered draft.');
    expect(groundCallCount).toBe(2);
    expect(progressStages).toContain('capture-round-2');
    expect(progressStages.filter(stage => stage === 'grounding')).toHaveLength(2);
    expect(progressStages).toContain('verifying');
  });

  it('repairs a draft when planner verification rejects the first version', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const progressStages: string[] = [];
    const { viewer } = createMockViewer();
    const composeResponses = [
      {
        segments: [
          createSegmentPlan({ durationSeconds: 8, segmentType: 'arc', sweepDegrees: 100 }),
        ],
        summary: 'Initial draft.',
      },
      {
        segments: [
          createSegmentPlan({ durationSeconds: 6, segmentType: 'arc', sweepDegrees: 90 }),
          createSegmentPlan({ durationSeconds: 3, segmentType: 'hold' }),
        ],
        summary: 'Verified repair.',
      },
    ];
    const verifyResponses = [
      {
        approved: false,
        issues: ['The path feels too low and partially loses the truck near the end.'],
      },
      {
        approved: true,
        issues: [],
      },
    ];

    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/path/ground')) {
        const request = JSON.parse(String(init?.body ?? '{}')) as { captures: AgenticPathCapture[] };
        const subject = new THREE.Vector3(0, 0.5, 0);
        return new Response(JSON.stringify(createGroundResponse(
          'subject-centric',
          request.captures.map(capture => projectPoint(subject, capture)),
        )), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url.endsWith('/api/path/verify')) {
        return new Response(JSON.stringify(verifyResponses.shift()), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify(composeResponses.shift()), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;

    const orchestrator = new AgenticPathOrchestrator({
      fetchImpl,
      onProgress: progress => {
        progressStages.push(progress.stage);
      },
      viewer,
    });

    const draft = await orchestrator.generateDraft({
      controls: createDraftControls({ requestedDurationSeconds: 9 }),
      existingKeyframes: [],
      prompt: 'Create a cinematic arc around the truck and keep the framing clean.',
    });

    expect(draft.summary).toBe('Verified repair.');
    expect(progressStages.slice(0, 10)).toEqual([
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'capture-round-1',
      'grounding',
      'composing',
      'validating',
    ]);
    expect(progressStages.filter(stage => stage === 'repairing')).toHaveLength(1);
    expect(progressStages.filter(stage => stage === 'verifying').length).toBeGreaterThanOrEqual(10);
  });

  it('adds active verification probes for longer drafts', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const { viewer } = createMockViewer({
      bounds: new THREE.Box3(
        new THREE.Vector3(-10, -4, -10),
        new THREE.Vector3(10, 8, 10),
      ),
      initialCamera: createCamera(new THREE.Vector3(5, 1, 0), new THREE.Vector3(0, 0.5, 0)),
    });
    const verifyRequests: Array<{
      captures: Array<{
        captureKind: string;
        id: string;
        probeReason: string;
      }>;
    }> = [];

    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/path/ground')) {
        const request = JSON.parse(String(init?.body ?? '{}')) as { captures: AgenticPathCapture[] };
        const subject = new THREE.Vector3(0, 0.5, 0);
        return new Response(JSON.stringify(createGroundResponse(
          'subject-centric',
          request.captures.map(capture => projectPoint(subject, capture)),
        )), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url.endsWith('/api/path/verify')) {
        verifyRequests.push(JSON.parse(String(init?.body ?? '{}')) as {
          captures: Array<{
            captureKind: string;
            id: string;
            probeReason: string;
          }>;
        });
        return new Response(JSON.stringify({
          approved: true,
          issues: [],
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify({
        segments: [
          createSegmentPlan({ durationSeconds: 14, segmentType: 'hold' }),
        ],
        summary: 'Long draft with a final hold.',
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;

    const orchestrator = new AgenticPathOrchestrator({
      fetchImpl,
      viewer,
    });

    const draft = await orchestrator.generateDraft({
      controls: createDraftControls({ holdPreference: 'linger', requestedDurationSeconds: 14 }),
      existingKeyframes: [],
      prompt: 'Create a longer cinematic move around the truck and then linger.',
    });

    expect(draft.summary).toBe('Long draft with a final hold.');
    expect(verifyRequests).toHaveLength(1);
    expect(verifyRequests[0]?.captures.length).toBeGreaterThan(4);
    expect(verifyRequests[0]?.captures.some(capture => capture.captureKind === 'draft-sample')).toBe(true);
    expect(verifyRequests[0]?.captures.some(capture => capture.captureKind === 'active-probe')).toBe(true);
    expect(verifyRequests[0]?.captures.some(capture =>
      capture.captureKind === 'active-probe'
      && (capture.probeReason === 'long-path-lookahead' || capture.probeReason === 'hold-read')
    )).toBe(true);
  });

  it('stops on unsupported route-following prompts', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const { viewer } = createMockViewer();
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/api/path/ground')) {
        return new Response(JSON.stringify(createGroundResponse('route-following', [])), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      throw new Error('compose should not be called for unsupported prompts');
    }) as unknown as typeof fetch;

    const orchestrator = new AgenticPathOrchestrator({ fetchImpl, viewer });

    await expect(orchestrator.generateDraft({
      controls: createDraftControls(),
      existingKeyframes: [],
      prompt: 'Weave through these trees.',
    })).rejects.toThrow(/unsupported/i);
  });

  it('cancels stalled generation and restores the live camera pose', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    let captureCount = 0;
    const initialCamera = createCamera(new THREE.Vector3(5, 1, 0), new THREE.Vector3(0, 0.5, 0));
    const initialPosition = initialCamera.position.clone();
    const initialQuaternion = initialCamera.quaternion.clone();
    const { camera, viewer } = createMockViewer({
      captureFrame: () => {
        captureCount += 1;
        if (captureCount === 1) {
          return Promise.resolve(new Blob(['frame'], { type: 'image/png' }));
        }

        return new Promise<Blob>(() => {});
      },
      initialCamera,
    });

    const orchestrator = new AgenticPathOrchestrator({
      fetchImpl: vi.fn() as unknown as typeof fetch,
      viewer,
    });

    const generationPromise = orchestrator.generateDraft({
      controls: createDraftControls(),
      existingKeyframes: [],
      prompt: 'Create a cinematic arc around the truck.',
    });
    const rejection = expect(generationPromise).rejects.toThrow(/canceled/i);

    expect(orchestrator.cancelGeneration()).toBe(true);
    await rejection;
    expect(orchestrator.isGenerating()).toBe(false);
    expect(camera.position.distanceTo(initialPosition)).toBeLessThan(1e-6);
    expect(camera.quaternion.angleTo(initialQuaternion)).toBeLessThan(1e-6);
  });
});
