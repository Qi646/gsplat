import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('three/examples/jsm/controls/OrbitControls.js', async () => {
  const THREE = await import('three');

  class MockOrbitControls {
    target = new THREE.Vector3();
    enableDamping = false;
    dampingFactor = 0;
    rotateSpeed = 1;
    enabled = true;
    camera: THREE.PerspectiveCamera;
    updateCount = 0;

    constructor(camera: THREE.PerspectiveCamera, _domElement: HTMLCanvasElement) {
      this.camera = camera;
    }

    dispose(): void {}

    update(): void {
      this.updateCount += 1;
      this.camera.lookAt(this.target);
    }
  }

  return { OrbitControls: MockOrbitControls };
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
    boundsMin: [-1, -1, -1] as [number, number, number],
    boundsMax: [1, 1, 1] as [number, number, number],
    sampleCenters: [] as Array<[number, number, number]>,
    sampleColors: [] as Array<[number, number, number, number]>,
  };

  class MockSplatMesh {
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

    update(): void {}

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

  it('resumes orbit from the live walk pose without changing the camera', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();

    const controls = (viewer as unknown as {
      camera: THREE.PerspectiveCamera;
      controls: { enabled: boolean; target: THREE.Vector3 };
    }).controls;

    controls.target.set(1, 2, -2);
    viewer.getCamera()?.position.set(1, 2, 3);
    viewer.getCamera()?.lookAt(new THREE.Vector3(6, 2, 3));
    const beforePosition = viewer.getCamera()?.position.clone();
    const before = viewer.getCamera()?.quaternion.clone();

    viewer.setNavigationMode('walk');
    expect(controls.enabled).toBe(false);

    viewer.resumeOrbitFromCamera();
    expect(controls.enabled).toBe(true);
    expect(viewer.getCamera()?.position.toArray()).toEqual(beforePosition?.toArray());
    expect(viewer.getCamera()?.quaternion.x).toBeCloseTo(before?.x ?? 0);
    expect(viewer.getCamera()?.quaternion.y).toBeCloseTo(before?.y ?? 0);
    expect(viewer.getCamera()?.quaternion.z).toBeCloseTo(before?.z ?? 0);
    expect(viewer.getCamera()?.quaternion.w).toBeCloseTo(before?.w ?? 1);
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

  it('loads a scene with the default rotation, disables the package loading UI, and emits scene:loaded when bounds are valid', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });
    const onLoaded = vi.fn();
    events.on('scene:loaded', onLoaded);

    await viewer.init();
    await viewer.loadScene('https://example.com/room.splat');

    expect(mockModule.__mockState.addSceneCalls).toHaveLength(1);
    expect(mockModule.__mockState.addSceneCalls[0]?.options['showLoadingUI']).toBe(false);
    expect(mockModule.__mockState.addSceneCalls[0]?.options['rotation']).toEqual([1, 0, 0, 0]);
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
