import * as THREE from 'three';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AgenticPathGenerator,
  buildRequestedCapturePose,
  buildOrbitKeyframes,
  triangulateSubjectAnchor,
  type AgenticPathCapture,
  type AgenticPlannerCaptureRequest,
  type AgenticShotSpec,
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
    role: 'requested',
    width: 1600,
  };
}

function createShotSpec(overrides: Partial<AgenticShotSpec> = {}): AgenticShotSpec {
  return {
    fullOrbit: false,
    orientationMode: 'look-at-subject',
    pathType: 'orbit',
    ...overrides,
  };
}

function getForwardVector(quaternion: { w: number; x: number; y: number; z: number }): THREE.Vector3 {
  return new THREE.Vector3(0, 0, -1).applyQuaternion(
    new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w),
  ).normalize();
}

function projectPoint(
  point: THREE.Vector3,
  capture: AgenticPathCapture,
): AgenticSubjectLocalization {
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

function createMockViewer(options: {
  captureFrame?: () => Promise<Blob>;
  initialCamera?: THREE.PerspectiveCamera;
} = {}): {
  camera: THREE.PerspectiveCamera;
  viewer: ViewerAdapter;
} {
  const bounds = new THREE.Box3(
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

type PlannerLoopRequest = {
  captures: AgenticPathCapture[];
  plannerHistory: Array<{ message: string; requestedCaptures: AgenticPlannerCaptureRequest[] }>;
};

function createPlannerResponse(captures: AgenticPathCapture[]): Response {
  const subject = new THREE.Vector3(0, 0.5, 0);
  return new Response(JSON.stringify({
    status: 'complete',
    shotSpec: createShotSpec(),
    subjectLocalizations: captures.map(capture => projectPoint(subject, capture)),
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

function createCaptureRequestResponse(
  requests: AgenticPlannerCaptureRequest[],
  message = 'Need a nearby follow-up capture for triangulation.',
): Response {
  return new Response(JSON.stringify({
    message,
    requestedCaptures: requests,
    status: 'needs-captures',
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
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

describe('triangulateSubjectAnchor', () => {
  it('reconstructs a subject anchor from multiple localized captures', () => {
    const subject = new THREE.Vector3(1.5, 0.75, -0.5);
    const captureA = createCapture('capture-a', createCamera(new THREE.Vector3(6, 2, 3), subject));
    const captureB = createCapture('capture-b', createCamera(new THREE.Vector3(-5, 1.5, 2), subject));
    const sceneBounds = new THREE.Box3(
      new THREE.Vector3(-10, -3, -10),
      new THREE.Vector3(10, 6, 10),
    );

    const solved = triangulateSubjectAnchor(
      [projectPoint(subject, captureA), projectPoint(subject, captureB)],
      [captureA, captureB],
      sceneBounds,
    );

    expect(solved.distanceTo(subject)).toBeLessThan(0.05);
  });
});

describe('buildRequestedCapturePose', () => {
  it('applies planner follow-up offsets in the reference camera basis', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -4, -6),
      new THREE.Vector3(4, 4, 6),
    );
    const center = bounds.getCenter(new THREE.Vector3());
    const referenceCamera = createCamera(new THREE.Vector3(5, 1, 0), center);
    const referenceCapture = createCapture('capture-current', referenceCamera);
    const sceneDiagonal = bounds.getSize(new THREE.Vector3()).length();
    const pose = buildRequestedCapturePose(referenceCapture, {
      captureId: 'capture-follow-up-1',
      forwardOffsetScale: -0.1,
      lateralOffsetScale: 0.12,
      reason: 'Shift right and pull back for more parallax.',
      referenceCaptureId: 'capture-current',
      verticalOffsetScale: 0.05,
    }, bounds);
    const delta = pose.position.clone().sub(referenceCamera.position);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(referenceCamera.quaternion).normalize();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(referenceCamera.quaternion).normalize();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(referenceCamera.quaternion).normalize();

    expect(delta.dot(right)).toBeCloseTo(sceneDiagonal * 0.12, 5);
    expect(delta.dot(up)).toBeCloseTo(sceneDiagonal * 0.05, 5);
    expect(delta.dot(forward)).toBeCloseTo(sceneDiagonal * -0.1, 5);
    expect(pose.quaternion.angleTo(referenceCamera.quaternion)).toBeLessThan(1e-6);
  });

  it('preserves the rolled camera basis for non-Y-up follow-up captures', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -4, -6),
      new THREE.Vector3(4, 4, 6),
    );
    const center = bounds.getCenter(new THREE.Vector3());
    const sceneUp = new THREE.Vector3(0, 0, 1);
    const referenceCamera = createCamera(new THREE.Vector3(6, 0, 3), center, 16 / 9, sceneUp);
    const referenceCapture = createCapture('capture-current', referenceCamera);
    const referenceUp = new THREE.Vector3(0, 1, 0).applyQuaternion(referenceCamera.quaternion).normalize();
    const pose = buildRequestedCapturePose(referenceCapture, {
      captureId: 'capture-follow-up-1',
      pitchDegrees: -6,
      reason: 'Lift slightly and look down the truck body.',
      referenceCaptureId: 'capture-current',
      verticalOffsetScale: 0.08,
      yawDegrees: 12,
    }, bounds);
    const delta = pose.position.clone().sub(referenceCamera.position);
    const poseUp = new THREE.Vector3(0, 1, 0).applyQuaternion(pose.quaternion).normalize();
    const poseForward = new THREE.Vector3(0, 0, -1).applyQuaternion(pose.quaternion).normalize();
    const referenceForward = new THREE.Vector3(0, 0, -1).applyQuaternion(referenceCamera.quaternion).normalize();

    expect(delta.dot(referenceUp)).toBeGreaterThan(0);
    expect(poseUp.dot(referenceUp)).toBeGreaterThan(0.95);
    expect(poseForward.dot(referenceForward)).toBeLessThan(0.995);
  });
});

describe('buildOrbitKeyframes', () => {
  it('orients generated keyframes toward the subject when requested', () => {
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const baseCamera = createCamera(new THREE.Vector3(5, 1, 0), anchor);

    const keyframes = buildOrbitKeyframes({
      anchor,
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      shotSpec: createShotSpec(),
      startTime: 0,
    });

    const firstPosition = new THREE.Vector3(
      keyframes[0]!.position.x,
      keyframes[0]!.position.y,
      keyframes[0]!.position.z,
    );
    const forward = getForwardVector(keyframes[0]!.quaternion);
    const toAnchor = anchor.clone().sub(firstPosition).normalize();

    expect(keyframes).toHaveLength(8);
    expect(forward.dot(toAnchor)).toBeGreaterThan(0.999);
  });

  it('faces forward along the orbit tangent when requested', () => {
    const anchor = new THREE.Vector3(0, 0, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const baseCamera = createCamera(new THREE.Vector3(5, 1, 0), anchor);

    const keyframes = buildOrbitKeyframes({
      anchor,
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      shotSpec: createShotSpec({ orientationMode: 'look-forward' }),
      startTime: 0,
    });

    const firstPosition = new THREE.Vector3(
      keyframes[0]!.position.x,
      keyframes[0]!.position.y,
      keyframes[0]!.position.z,
    );
    const secondPosition = new THREE.Vector3(
      keyframes[1]!.position.x,
      keyframes[1]!.position.y,
      keyframes[1]!.position.z,
    );
    const tangent = secondPosition.clone().sub(firstPosition).setY(0).normalize();
    const forward = getForwardVector(keyframes[0]!.quaternion).setY(0).normalize();

    expect(forward.dot(tangent)).toBeGreaterThan(0.98);
  });

  it('starts the orbit from the live pose for non-Y-up scenes', () => {
    const anchor = new THREE.Vector3(0, 0, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -4, -6),
      new THREE.Vector3(4, 4, 6),
    );
    const sceneUp = new THREE.Vector3(0, 0, 1);
    const baseCamera = createCamera(new THREE.Vector3(5, 0, 3), anchor, 16 / 9, sceneUp);
    const baseCameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(baseCamera.quaternion).normalize();

    const keyframes = buildOrbitKeyframes({
      anchor,
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      shotSpec: createShotSpec(),
      startTime: 0,
    });

    const firstPosition = new THREE.Vector3(
      keyframes[0]!.position.x,
      keyframes[0]!.position.y,
      keyframes[0]!.position.z,
    );
    const firstUp = getForwardVector({
      w: keyframes[0]!.quaternion.w,
      x: keyframes[0]!.quaternion.x,
      y: keyframes[0]!.quaternion.y,
      z: keyframes[0]!.quaternion.z,
    });
    const upVector = new THREE.Vector3(0, 1, 0).applyQuaternion(
      new THREE.Quaternion(
        keyframes[0]!.quaternion.x,
        keyframes[0]!.quaternion.y,
        keyframes[0]!.quaternion.z,
        keyframes[0]!.quaternion.w,
      ),
    ).normalize();
    const toAnchor = anchor.clone().sub(firstPosition).normalize();

    expect(firstPosition.distanceTo(baseCamera.position)).toBeLessThan(1e-5);
    expect(firstUp.dot(toAnchor)).toBeGreaterThan(0.999);
    expect(upVector.dot(baseCameraUp)).toBeGreaterThan(0.999);
  });
});

describe('AgenticPathGenerator', () => {
  it('reports staged progress throughout generation', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const progressStages: string[] = [];
    const progressLabels: string[] = [];
    const { viewer } = createMockViewer();
    let requestCount = 0;
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      requestCount += 1;
      const request = JSON.parse(String(init?.body ?? '{}')) as {
        captures: AgenticPathCapture[];
        plannerHistory: Array<{ requestedCaptures: AgenticPlannerCaptureRequest[] }>;
      };
      if (requestCount === 1) {
        expect(request.captures).toHaveLength(1);
        return createCaptureRequestResponse([
          {
            captureId: 'capture-follow-up-1',
            lateralOffsetScale: 0.12,
            reason: 'Shift right for parallax.',
            referenceCaptureId: 'capture-current',
          },
          {
            captureId: 'capture-follow-up-2',
            lateralOffsetScale: -0.12,
            reason: 'Shift left for parallax.',
            referenceCaptureId: 'capture-current',
          },
        ]);
      }

      expect(request.plannerHistory).toHaveLength(1);
      expect(request.plannerHistory[0]?.requestedCaptures).toHaveLength(2);
      return createPlannerResponse(request.captures);
    }) as unknown as typeof fetch;

    const generator = new AgenticPathGenerator({
      fetchImpl,
      onProgress: progress => {
        progressStages.push(progress.stage);
        progressLabels.push(progress.buttonLabel);
      },
      viewer,
    });

    const keyframes = await generator.generatePath({
      existingKeyframes: [],
      prompt: 'Do a cinematic orbit around the subject.',
    });

    expect(keyframes.length).toBeGreaterThan(0);
    expect(progressStages).toEqual([
      'capturing-current',
      'planning',
      'capturing-requested',
      'capturing-requested',
      'planning',
      'triangulating',
      'building',
    ]);
    expect(progressLabels).toEqual([
      'Capturing 1/1…',
      'Planning…',
      'Capturing 1/2…',
      'Capturing 2/2…',
      'Planning 2/4…',
      'Triangulating…',
      'Building path…',
    ]);
  });

  it('feeds planner-requested follow-up captures back into the next planning step', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const progressMessages: string[] = [];
    const { viewer } = createMockViewer();
    let secondRequest: PlannerLoopRequest | null = null;
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const request = JSON.parse(String(init?.body ?? '{}')) as PlannerLoopRequest;
      if (request.captures.length === 1) {
        return createCaptureRequestResponse([
          {
            captureId: 'capture-follow-up-1',
            forwardOffsetScale: -0.08,
            lateralOffsetScale: 0.1,
            reason: 'Back up slightly and shift right to uncover the truck nose.',
            referenceCaptureId: 'capture-current',
          },
        ], 'The truck needs one targeted follow-up capture.');
      }

      secondRequest = request;
      return createPlannerResponse(request.captures);
    }) as unknown as typeof fetch;

    const generator = new AgenticPathGenerator({
      fetchImpl,
      onProgress: progress => {
        progressMessages.push(progress.message);
      },
      viewer,
    });

    const keyframes = await generator.generatePath({
      existingKeyframes: [],
      prompt: 'Do a cinematic orbit around the subject.',
    });

    expect(keyframes.length).toBeGreaterThan(0);
    expect(secondRequest).not.toBeNull();
    expect(secondRequest!.captures.map(capture => capture.id)).toEqual([
      'capture-current',
      'capture-follow-up-1',
    ]);
    expect(secondRequest!.plannerHistory).toEqual([
      {
        message: 'The truck needs one targeted follow-up capture.',
        requestedCaptures: [
          {
            captureId: 'capture-follow-up-1',
            forwardOffsetScale: -0.08,
            lateralOffsetScale: 0.1,
            reason: 'Back up slightly and shift right to uncover the truck nose.',
            referenceCaptureId: 'capture-current',
          },
        ],
      },
    ]);
    expect(progressMessages.some(message => /follow-up capture/i.test(message))).toBe(true);
  });

  it('times out stalled generation and restores the live camera pose', async () => {
    installCapturePipelineStubs();
    vi.useFakeTimers();
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

    const generator = new AgenticPathGenerator({
      fetchImpl: vi.fn(async () => createCaptureRequestResponse([
        {
          captureId: 'capture-follow-up-1',
          lateralOffsetScale: 0.1,
          reason: 'Shift right for one more targeted view.',
          referenceCaptureId: 'capture-current',
        },
      ])) as unknown as typeof fetch,
      timeoutMs: 25,
      viewer,
    });

    const generationPromise = generator.generatePath({
      existingKeyframes: [],
      prompt: 'Do a cinematic orbit around the subject.',
    });
    const rejection = expect(generationPromise).rejects.toThrow(/timed out/i);

    await vi.advanceTimersByTimeAsync(25);

    await rejection;
    expect(generator.isGenerating()).toBe(false);
    expect(camera.position.distanceTo(initialPosition)).toBeLessThan(1e-6);
    expect(camera.quaternion.angleTo(initialQuaternion)).toBeLessThan(1e-6);
  });

  it('cancels stalled generation and restores the live camera pose', async () => {
    installCapturePipelineStubs();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    let captureCount = 0;
    const progressStages: string[] = [];
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

    const generator = new AgenticPathGenerator({
      fetchImpl: vi.fn(async () => createCaptureRequestResponse([
        {
          captureId: 'capture-follow-up-1',
          lateralOffsetScale: 0.1,
          reason: 'Shift right for one more targeted view.',
          referenceCaptureId: 'capture-current',
        },
      ])) as unknown as typeof fetch,
      onProgress: progress => {
        progressStages.push(progress.stage);
      },
      viewer,
    });

    const generationPromise = generator.generatePath({
      existingKeyframes: [],
      prompt: 'Do a cinematic orbit around the subject.',
    });
    const rejection = expect(generationPromise).rejects.toThrow(/canceled/i);

    expect(generator.cancelGeneration()).toBe(true);
    await rejection;
    expect(generator.isGenerating()).toBe(false);
    expect(progressStages.at(-1)).toBe('cancelling');
    expect(camera.position.distanceTo(initialPosition)).toBeLessThan(1e-6);
    expect(camera.quaternion.angleTo(initialQuaternion)).toBeLessThan(1e-6);
  });
});
