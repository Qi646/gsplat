import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('three/examples/jsm/controls/TrackballControls.js', async () => {
  const THREE = await import('three');

  class MockTrackballControls {
    target = new THREE.Vector3();
    dynamicDampingFactor = 0;
    enabled = true;
    camera: THREE.PerspectiveCamera;
    handleResizeCount = 0;
    updateCount = 0;

    constructor(camera: THREE.PerspectiveCamera, _domElement: HTMLCanvasElement) {
      this.camera = camera;
    }

    dispose(): void {}

    handleResize(): void {
      this.handleResizeCount += 1;
    }

    update(): void {
      this.updateCount += 1;
      this.camera.lookAt(this.target);
    }
  }

  return { TrackballControls: MockTrackballControls };
});

vi.mock('@mkkellogg/gaussian-splats-3d', async () => {
  const THREE = await import('three');

  const state = {
    viewerOptions: null as Record<string, unknown> | null,
    addSceneCalls: [] as Array<{ url: string; options: Record<string, unknown> }>,
    removeSceneCalls: [] as Array<{ indexes: number[]; showLoadingUI?: boolean }>,
    renderCalls: 0,
    sceneCount: 0,
    splatCount: 0,
    availableRenderCount: 0,
    geometryInstanceCount: 0,
    lastDrawRange: null as { count: number; start: number } | null,
    renderIndexes: new Uint32Array(0),
    sortedRenderIndexes: new Uint32Array(0),
    splatIndexNeedsUpdate: false,
    splatIndexUpdateRange: { count: 0, offset: 0 },
    boundsMin: [-1, -1, -1] as [number, number, number],
    boundsMax: [1, 1, 1] as [number, number, number],
    sampleCenters: [] as Array<[number, number, number]>,
    sampleColors: [] as Array<[number, number, number, number]>,
  };

  class MockSplatMesh {
    geometry = {
      attributes: {
        splatIndex: {
          array: state.renderIndexes,
          get needsUpdate(): boolean {
            return state.splatIndexNeedsUpdate;
          },
          set needsUpdate(value: boolean) {
            state.splatIndexNeedsUpdate = value;
          },
          updateRange: state.splatIndexUpdateRange,
        },
      },
      get instanceCount(): number {
        return state.geometryInstanceCount;
      },
      set instanceCount(value: number) {
        state.geometryInstanceCount = value;
      },
      setDrawRange(start: number, count: number): void {
        state.lastDrawRange = { count, start };
      },
    };

    getSplatCount(): number {
      return state.splatCount;
    }

    getSplatCenter(globalSplatIndex: number, outCenter: THREE.Vector3): void {
      const sample = state.sampleCenters[globalSplatIndex % Math.max(state.sampleCenters.length, 1)];
      if (!sample) {
        outCenter.set(0, 0, 0);
        return;
      }

      outCenter.set(sample[0], sample[1], sample[2]);
    }

    getSplatColor(globalSplatIndex: number, outColor: THREE.Vector4): void {
      const sample = state.sampleColors[globalSplatIndex % Math.max(state.sampleColors.length, 1)];
      if (!sample) {
        outColor.set(0, 0, 0, 0);
        return;
      }

      outColor.set(sample[0], sample[1], sample[2], sample[3]);
    }

    computeBoundingBox(): THREE.Box3 {
      return new THREE.Box3(
        new THREE.Vector3(...state.boundsMin),
        new THREE.Vector3(...state.boundsMax),
      );
    }
  }

  class MockViewer {
    splatRenderCount = state.availableRenderCount;
    renderer = {
      domElement: {
        requestPointerLock() {},
        toBlob(callback: BlobCallback) {
          callback(new Blob(['scene-frame'], { type: 'image/png' }));
        },
      },
      setPixelRatio() {},
      setSize() {},
    } as unknown as THREE.WebGLRenderer;
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    constructor(options: Record<string, unknown>) {
      state.viewerOptions = options;
    }

    async init(): Promise<void> {}

    async addSplatScene(url: string, options: Record<string, unknown>): Promise<void> {
      state.addSceneCalls.push({ url, options });
      state.sceneCount = 1;
    }

    getSplatMesh(): MockSplatMesh {
      return new MockSplatMesh();
    }

    getSceneCount(): number {
      return state.sceneCount;
    }

    async removeSplatScenes(indexes: number[], showLoadingUI?: boolean): Promise<void> {
      state.removeSceneCalls.push({ indexes, showLoadingUI });
      state.sceneCount = 0;
    }

    update(): void {
      this.splatRenderCount = state.availableRenderCount;
      state.renderIndexes.set(state.sortedRenderIndexes);
    }

    render(): void {
      state.renderCalls += 1;
    }

    dispose(): void {}
  }

  return {
    Viewer: MockViewer,
    SceneFormat: {
      Ply: 0,
      Splat: 1,
      KSplat: 2,
    },
    __mockState: state,
  };
});

import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { AppEvents } from '../types';
import { SceneViewer } from '../viewer/SceneViewer';

type MockModule = typeof GaussianSplats3D & {
  __mockState: {
    viewerOptions: Record<string, unknown> | null;
    addSceneCalls: Array<{ url: string; options: Record<string, unknown> }>;
    removeSceneCalls: Array<{ indexes: number[]; showLoadingUI?: boolean }>;
    renderCalls: number;
    sceneCount: number;
    splatCount: number;
    availableRenderCount: number;
    geometryInstanceCount: number;
    lastDrawRange: { count: number; start: number } | null;
    renderIndexes: Uint32Array;
    sortedRenderIndexes: Uint32Array;
    splatIndexNeedsUpdate: boolean;
    splatIndexUpdateRange: { count: number; offset: number };
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
    sampleCenters: Array<[number, number, number]>;
    sampleColors: Array<[number, number, number, number]>;
  };
};

describe('SceneViewer', () => {
  const mockModule = GaussianSplats3D as MockModule;
  const originalWindow = globalThis.window;
  const originalNavigator = globalThis.navigator;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  let startRenderLoopSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockModule.__mockState.viewerOptions = null;
    mockModule.__mockState.addSceneCalls = [];
    mockModule.__mockState.removeSceneCalls = [];
    mockModule.__mockState.renderCalls = 0;
    mockModule.__mockState.sceneCount = 0;
    mockModule.__mockState.splatCount = 1024;
    mockModule.__mockState.availableRenderCount = 1024;
    mockModule.__mockState.geometryInstanceCount = 1024;
    mockModule.__mockState.lastDrawRange = null;
    mockModule.__mockState.renderIndexes = Uint32Array.from({ length: 1024 }, (_, index) => index);
    mockModule.__mockState.sortedRenderIndexes = Uint32Array.from({ length: 1024 }, (_, index) => index);
    mockModule.__mockState.splatIndexNeedsUpdate = false;
    mockModule.__mockState.splatIndexUpdateRange = { count: 0, offset: 0 };
    mockModule.__mockState.boundsMin = [-2, -1, -3];
    mockModule.__mockState.boundsMax = [4, 5, 6];
    mockModule.__mockState.sampleCenters = [];
    mockModule.__mockState.sampleColors = [];

    Object.defineProperty(globalThis, 'window', {
      value: {
        crossOriginIsolated: true,
        devicePixelRatio: 1,
      },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
      },
      configurable: true,
      writable: true,
    });

    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;

    startRenderLoopSpy = vi.spyOn(SceneViewer.prototype as never, 'startRenderLoop').mockImplementation(() => {});
  });

  afterEach(() => {
    startRenderLoopSpy.mockRestore();

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });

    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it('initializes the viewer in compatibility mode by default and exposes the renderer canvas', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();

    expect(mockModule.__mockState.viewerOptions?.['rootElement']).toBe(hostElement);
    expect(mockModule.__mockState.viewerOptions?.['canvas']).toBeUndefined();
    expect(mockModule.__mockState.viewerOptions?.['useBuiltInControls']).toBe(false);
    expect(mockModule.__mockState.viewerOptions?.['gpuAcceleratedSort']).toBe(false);
    expect(mockModule.__mockState.viewerOptions?.['sharedMemoryForWorkers']).toBe(false);
    expect(mockModule.__mockState.viewerOptions?.['integerBasedSort']).toBe(false);
    expect(mockModule.__mockState.viewerOptions?.['splatSortDistanceMapPrecision']).toBe(20);
    expect(viewer.getRendererId()).toBe('mkkellogg');
    expect(viewer.getInteractionSurface()).toEqual(
      (viewer as unknown as { renderer: { domElement: unknown } }).renderer.domElement,
    );
  });

  it('renders immediately and captures PNG frames from the renderer canvas', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();
    viewer.renderNow();
    const frame = await viewer.captureFrame();

    expect(mockModule.__mockState.renderCalls).toBe(1);
    await expect(frame.text()).resolves.toBe('scene-frame');
  });

  it('applies and restores render budgets against the current visible splat count', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/truck.ksplat');

    mockModule.__mockState.availableRenderCount = 900;
    mockModule.__mockState.sortedRenderIndexes = Uint32Array.from(
      { length: 1024 },
      (_, index) => 10_000 + index,
    );
    viewer.setRenderBudget(400);
    viewer.renderNow();

    expect(viewer.getRenderedSplatCount()).toBe(400);
    expect(mockModule.__mockState.geometryInstanceCount).toBe(400);
    expect(mockModule.__mockState.lastDrawRange).toEqual({ count: 400, start: 0 });
    expect(Array.from(mockModule.__mockState.renderIndexes.slice(0, 3))).toEqual([10_500, 10_501, 10_502]);
    expect(Array.from(mockModule.__mockState.renderIndexes.slice(397, 400))).toEqual([10_897, 10_898, 10_899]);
    expect(mockModule.__mockState.splatIndexNeedsUpdate).toBe(true);
    expect(mockModule.__mockState.splatIndexUpdateRange).toEqual({ count: 400, offset: 0 });
    expect(viewer.getDebugSnapshot().splatRenderCount).toBe(400);

    viewer.setRenderBudget(null);
    viewer.renderNow();

    expect(viewer.getRenderedSplatCount()).toBe(900);
    expect(mockModule.__mockState.geometryInstanceCount).toBe(900);
    expect(mockModule.__mockState.lastDrawRange).toEqual({ count: 900, start: 0 });
    expect(Array.from(mockModule.__mockState.renderIndexes.slice(0, 3))).toEqual([10_000, 10_001, 10_002]);
    expect(viewer.getDebugSnapshot().splatRenderCount).toBe(900);
  });

  it('resumes camera controls from an inverted walk pose without changing the camera', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();

    const controls = (viewer as unknown as {
      camera: THREE.PerspectiveCamera;
      controls: { enabled: boolean; target: THREE.Vector3 };
    }).controls;

    const liveCamera = viewer.getCamera();
    const walkPoseCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    walkPoseCamera.position.set(1, 2, 3);
    walkPoseCamera.up.set(0, -1, 0);
    walkPoseCamera.lookAt(new THREE.Vector3(6, 2, 3));

    controls.target.set(1, 2, -2);
    liveCamera?.position.copy(walkPoseCamera.position);
    liveCamera?.quaternion.copy(walkPoseCamera.quaternion);
    liveCamera?.up.set(0, 1, 0);
    const beforePosition = viewer.getCamera()?.position.clone();
    const before = viewer.getCamera()?.quaternion.clone();
    const beforeUp = walkPoseCamera.up.clone();

    viewer.setNavigationMode('walk');
    expect(controls.enabled).toBe(false);

    viewer.resumeOrbitFromCamera();
    expect(controls.enabled).toBe(true);
    expect(viewer.getCamera()?.position.toArray()).toEqual(beforePosition?.toArray());
    expect(viewer.getCamera()?.quaternion.x).toBeCloseTo(before?.x ?? 0);
    expect(viewer.getCamera()?.quaternion.y).toBeCloseTo(before?.y ?? 0);
    expect(viewer.getCamera()?.quaternion.z).toBeCloseTo(before?.z ?? 0);
    expect(viewer.getCamera()?.quaternion.w).toBeCloseTo(before?.w ?? 1);
    expect(viewer.getCamera()?.up.toArray()).toEqual(beforeUp.toArray());
    expect(controls.target.x).toBeCloseTo(6);
    expect(controls.target.y).toBeCloseTo(2);
    expect(controls.target.z).toBeCloseTo(3);
  });

  it('preserves the camera heading during walk-mode renders', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();

    const camera = viewer.getCamera();
    const controls = (viewer as unknown as {
      controls: { target: THREE.Vector3; updateCount: number };
    }).controls;

    controls.target.set(0, 0, 0);
    camera?.position.set(1, 2, 3);
    camera?.lookAt(new THREE.Vector3(6, 2, 3));
    const before = camera?.quaternion.clone();

    viewer.setNavigationMode('walk');
    viewer.renderNow();

    expect(controls.updateCount).toBe(1);
    expect(camera?.quaternion.x).toBeCloseTo(before?.x ?? 0);
    expect(camera?.quaternion.y).toBeCloseTo(before?.y ?? 0);
    expect(camera?.quaternion.z).toBeCloseTo(before?.z ?? 0);
    expect(camera?.quaternion.w).toBeCloseTo(before?.w ?? 1);
  });

  it('surfaces the active runtime viewer options in the debug snapshot', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({
      hostElement,
      events,
      runtimeOverrides: { viewerMode: 'default' },
    });

    await viewer.init();

    expect(viewer.getDebugSnapshot()).toMatchObject({
      rendererId: 'mkkellogg',
      runtime: {
        viewerOptions: {
          gpuAcceleratedSort: true,
          sharedMemoryForWorkers: true,
          integerBasedSort: false,
          splatSortDistanceMapPrecision: 20,
        },
      },
    });
  });

  it('keeps Firefox on the fast runtime when isolation is available', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 Gecko/20100101 Firefox/136.0',
      },
      configurable: true,
      writable: true,
    });

    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({
      hostElement,
      events,
      runtimeOverrides: { viewerMode: 'default' },
    });

    await viewer.init();

    expect(warnSpy).not.toHaveBeenCalled();
    expect(mockModule.__mockState.viewerOptions).toMatchObject({
      gpuAcceleratedSort: true,
      sharedMemoryForWorkers: true,
      integerBasedSort: false,
      splatSortDistanceMapPrecision: 20,
    });
    expect(viewer.getDebugSnapshot().rendererId).toBe('mkkellogg');
    expect(viewer.getDebugSnapshot().runtime).toMatchObject({
      compatibilityMode: false,
      compatibilityStatusMessage: null,
    });

    warnSpy.mockRestore();
  });

  it('loads a scene without forcing a rotation override, disables the package loading UI, and emits scene:loaded when bounds are valid', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });
    const onLoaded = vi.fn();
    events.on('scene:loaded', onLoaded);

    await viewer.init();
    await viewer.loadScene('https://example.com/room.splat');

    expect(mockModule.__mockState.addSceneCalls).toHaveLength(1);
    expect(mockModule.__mockState.addSceneCalls[0]?.options['showLoadingUI']).toBe(false);
    expect(mockModule.__mockState.addSceneCalls[0]?.options['rotation']).toBeUndefined();
    expect(viewer.isSceneLoaded()).toBe(true);
    expect(onLoaded).toHaveBeenCalledWith({ splatCount: 1024 });
    expect(viewer.getCamera()?.near).toBeCloseTo(0.1);
    expect(viewer.getCamera()?.far).toBeGreaterThan(20);
    expect(viewer.getDebugSnapshot().camera).toEqual({
      near: viewer.getCamera()?.near ?? 0,
      far: viewer.getCamera()?.far ?? 0,
    });

    const sceneBounds = (viewer as unknown as { sceneBounds: THREE.Box3 }).sceneBounds;
    expect(sceneBounds.min.toArray()).toEqual([-2, -1, -3]);
    expect(sceneBounds.max.toArray()).toEqual([4, 5, 6]);
  });

  it('returns a cloned scene bounds box only after a successful scene load', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();
    expect(viewer.getSceneBounds()).toBeNull();

    await viewer.loadScene('/api/presets/truck.ksplat');

    const bounds = viewer.getSceneBounds();
    const internalBounds = (viewer as unknown as { sceneBounds: THREE.Box3 }).sceneBounds;
    expect(bounds).not.toBeNull();
    expect(bounds).not.toBe(internalBounds);
    expect(bounds?.min.toArray()).toEqual(internalBounds.min.toArray());
    expect(bounds?.max.toArray()).toEqual(internalBounds.max.toArray());

    bounds?.expandByScalar(10);
    expect(internalBounds.min.toArray()).toEqual([-2, -1, -3]);
    expect(internalBounds.max.toArray()).toEqual([4, 5, 6]);
  });

  it('maps cached ply presets to the library ply scene format', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/luigi.ply');

    expect(mockModule.__mockState.addSceneCalls[0]?.url).toBe('/api/presets/luigi.ply');
    expect(mockModule.__mockState.addSceneCalls[0]?.options['format']).toBe(
      GaussianSplats3D.SceneFormat.Ply,
    );
  });

  it('uses explicit scene formats for local blob-backed loads', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene({
      url: 'blob:https://example.com/local-scene',
      format: 'ksplat',
    });

    expect(mockModule.__mockState.addSceneCalls[0]?.url).toBe('blob:https://example.com/local-scene');
    expect(mockModule.__mockState.addSceneCalls[0]?.options['format']).toBe(
      GaussianSplats3D.SceneFormat.KSplat,
    );
  });

  it('applies inverted camera poses without snapping them upright', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();

    const poseCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    poseCamera.position.set(-3, 1, 4);
    poseCamera.up.set(0, -1, 0);
    poseCamera.lookAt(new THREE.Vector3(-1, 1, 4));

    viewer.applyCameraPose({
      position: poseCamera.position.clone(),
      quaternion: poseCamera.quaternion.clone(),
      fov: 45,
    });

    expect(viewer.getCamera()?.quaternion.x).toBeCloseTo(poseCamera.quaternion.x);
    expect(viewer.getCamera()?.quaternion.y).toBeCloseTo(poseCamera.quaternion.y);
    expect(viewer.getCamera()?.quaternion.z).toBeCloseTo(poseCamera.quaternion.z);
    expect(viewer.getCamera()?.quaternion.w).toBeCloseTo(poseCamera.quaternion.w);
    expect(viewer.getCamera()?.up.toArray()).toEqual(poseCamera.up.toArray());
  });

  it('tightens the camera near plane for close inspection poses', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/truck.ksplat');

    viewer.applyCameraPose({
      position: new THREE.Vector3(1, 2, 2),
      quaternion: new THREE.Quaternion(),
      fov: 60,
    });

    expect(viewer.getCamera()?.near).toBeLessThan(0.1);
    expect(viewer.getCamera()?.near).toBeGreaterThanOrEqual(0.01);
    expect(viewer.getCamera()?.far).toBeGreaterThan((viewer.getCamera()?.near ?? 0) + 10);
  });

  it('uses robust sampled bounds to ignore splat outliers when framing a scene', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    mockModule.__mockState.splatCount = 200;
    mockModule.__mockState.boundsMin = [-100, -50, -100];
    mockModule.__mockState.boundsMax = [120, 60, 100];
    mockModule.__mockState.sampleCenters = [
      [-100, 0, 0],
      [120, 0, 0],
      ...Array.from({ length: 198 }, (_, index) => [index / 10, 1 + (index % 5), -5 + (index % 10)] as [number, number, number]),
    ];
    mockModule.__mockState.sampleColors = mockModule.__mockState.sampleCenters.map(() => [255, 255, 255, 255]);

    await viewer.init();
    await viewer.loadScene('/api/presets/garden.ksplat');

    const sceneBounds = (viewer as unknown as { sceneBounds: THREE.Box3 }).sceneBounds;
    expect(sceneBounds.min.x).toBeGreaterThan(-10);
    expect(sceneBounds.max.x).toBeLessThan(30);
    expect(sceneBounds.max.z).toBeLessThan(10);
  });

  it('emits scene:error and rejects the load when the scene contains no splats', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });
    const onError = vi.fn();
    events.on('scene:error', onError);
    mockModule.__mockState.splatCount = 0;

    await viewer.init();

    await expect(viewer.loadScene('https://example.com/empty.splat')).rejects.toThrow(
      'Loaded scene contains no splats.',
    );

    expect(viewer.isSceneLoaded()).toBe(false);
    expect(onError).toHaveBeenCalledWith({ message: 'Loaded scene contains no splats.' });
  });

  it('emits scene:error and rejects the load when the scene bounds are invalid', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });
    const onError = vi.fn();
    events.on('scene:error', onError);
    mockModule.__mockState.boundsMin = [Number.NaN, -1, -1];

    await viewer.init();

    await expect(viewer.loadScene('https://example.com/invalid.splat')).rejects.toThrow(
      'Loaded scene bounds are invalid.',
    );

    expect(viewer.isSceneLoaded()).toBe(false);
    expect(onError).toHaveBeenCalledWith({ message: 'Loaded scene bounds are invalid.' });
  });
});
