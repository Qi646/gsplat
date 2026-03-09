import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three');

  class MockWebGLRenderer {
    domElement = {
      clientHeight: 0,
      clientWidth: 0,
      height: 0,
      toBlob(callback: BlobCallback) {
        callback(new Blob(['spark-frame'], { type: 'image/png' }));
      },
      width: 0,
    } as unknown as HTMLCanvasElement & {
      clientHeight: number;
      clientWidth: number;
      height: number;
      toBlob: (callback: BlobCallback) => void;
      width: number;
    };
    renderCount = 0;

    dispose(): void {}

    getContext() {
      return {
        RENDERER: 'RENDERER',
        SHADING_LANGUAGE_VERSION: 'SHADING_LANGUAGE_VERSION',
        VENDOR: 'VENDOR',
        VERSION: 'VERSION',
        getParameter(parameter: string) {
          return parameter;
        },
      };
    }

    render(): void {
      this.renderCount += 1;
    }

    setClearColor(): void {}

    setPixelRatio(): void {}

    setSize(width: number, height: number): void {
      this.domElement.width = width;
      this.domElement.height = height;
      this.domElement.clientWidth = width;
      this.domElement.clientHeight = height;
    }
  }

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});

vi.mock('three/examples/jsm/controls/TrackballControls.js', async () => {
  const THREE = await import('three');

  class MockTrackballControls {
    target = new THREE.Vector3();
    dynamicDampingFactor = 0;
    enabled = true;
    camera: THREE.PerspectiveCamera;
    handleResizeCount = 0;
    updateCount = 0;

    constructor(
      camera: THREE.PerspectiveCamera,
      _domElement: HTMLCanvasElement,
    ) {
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

vi.mock('@sparkjsdev/spark', async () => {
  const THREE = await import('three');

  const state = {
    boundsMax: [1, 1, 1] as [number, number, number],
    boundsMin: [-1, -1, -1] as [number, number, number],
    fileType: null as string | null,
    lastParsedMesh: null as MockSplatMesh | null,
    loadCalls: [] as string[],
    samples: [] as Array<{ center: [number, number, number]; opacity: number }>,
    sparkRendererOptions: null as Record<string, unknown> | null,
    splatCount: 0,
  };

  class MockSparkRenderer extends THREE.Object3D {
    defaultView = {};

    constructor(options: Record<string, unknown>) {
      super();
      state.sparkRendererOptions = options;
    }
  }

  class MockSplatMesh extends THREE.Object3D {
    initialized = Promise.resolve(this);
    packedSplats = { numSplats: state.splatCount };

    dispose(): void {}

    forEachSplat(
      callback: (
        index: number,
        center: THREE.Vector3,
        scales: THREE.Vector3,
        quaternion: THREE.Quaternion,
        opacity: number,
        color: THREE.Color,
      ) => void,
    ): void {
      state.samples.forEach((sample, index) => {
        callback(
          index,
          new THREE.Vector3(...sample.center),
          new THREE.Vector3(1, 1, 1),
          new THREE.Quaternion(),
          sample.opacity,
          new THREE.Color(1, 1, 1),
        );
      });
    }

    getBoundingBox(): THREE.Box3 {
      return new THREE.Box3(
        new THREE.Vector3(...state.boundsMin),
        new THREE.Vector3(...state.boundsMax),
      );
    }
  }

  class MockSplatLoader {
    fileType?: string;

    async loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<{ numSplats: number }> {
      state.loadCalls.push(url);
      state.fileType = this.fileType ?? null;
      onProgress?.({ lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent);
      return { numSplats: state.splatCount };
    }

    parse(): MockSplatMesh {
      const mesh = new MockSplatMesh();
      state.lastParsedMesh = mesh;
      return mesh;
    }
  }

  return {
    SparkRenderer: MockSparkRenderer,
    SplatFileType: {
      KSPLAT: 'ksplat',
      PLY: 'ply',
      SPLAT: 'splat',
    },
    SplatLoader: MockSplatLoader,
    __mockState: state,
  };
});

import * as THREE from 'three';
import * as Spark from '@sparkjsdev/spark';
import { AppEvents } from '../types';
import { SparkSceneViewer } from '../viewer/SparkSceneViewer';

type MockSparkModule = typeof Spark & {
  __mockState: {
    boundsMax: [number, number, number];
    boundsMin: [number, number, number];
    fileType: string | null;
    lastParsedMesh: THREE.Object3D | null;
    loadCalls: string[];
    samples: Array<{ center: [number, number, number]; opacity: number }>;
    sparkRendererOptions: Record<string, unknown> | null;
    splatCount: number;
  };
};

describe('SparkSceneViewer', () => {
  const mockModule = Spark as MockSparkModule;
  const originalWindow = globalThis.window;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  let startRenderLoopSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockModule.__mockState.boundsMin = [-2, -1, -3];
    mockModule.__mockState.boundsMax = [4, 5, 6];
    mockModule.__mockState.fileType = null;
    mockModule.__mockState.lastParsedMesh = null;
    mockModule.__mockState.loadCalls = [];
    mockModule.__mockState.sparkRendererOptions = null;
    mockModule.__mockState.splatCount = 128;
    mockModule.__mockState.samples = Array.from({ length: 128 }, (_, index) => ({
      center: [index / 20, index % 4, -2 + (index % 6)] as [number, number, number],
      opacity: 1,
    }));

    Object.defineProperty(globalThis, 'window', {
      value: {
        devicePixelRatio: 1,
      },
      configurable: true,
      writable: true,
    });

    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;

    startRenderLoopSpy = vi
      .spyOn(SparkSceneViewer.prototype as never, 'startRenderLoop')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    startRenderLoopSpy.mockRestore();

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
      writable: true,
    });

    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it('initializes the Spark renderer path and exposes the canvas', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();

    expect(viewer.getRendererId()).toBe('spark');
    expect(hostElement.replaceChildren).toHaveBeenCalledTimes(1);
    expect(mockModule.__mockState.sparkRendererOptions).toMatchObject({
      view: {
        sort32: true,
        sortRadial: false,
        stochastic: false,
      },
    });
    expect(viewer.getInteractionSurface()).toBeTruthy();
  });

  it('renders immediately and captures PNG frames from the Spark canvas', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();
    viewer.renderNow();
    const frame = await viewer.captureFrame();

    expect(
      (
        viewer as unknown as {
          renderer: { renderCount: number };
        }
      ).renderer.renderCount,
    ).toBe(1);
    await expect(frame.text()).resolves.toBe('spark-frame');
  });

  it('resumes camera controls from an inverted walk pose without changing the camera', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

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
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

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

  it('loads scenes through Spark with renderer-aware debug info', async () => {
    const events = new AppEvents();
    const loadedSpy = vi.fn();
    events.on('scene:loaded', loadedSpy);
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/truck.ksplat');

    expect(mockModule.__mockState.loadCalls).toEqual(['/api/presets/truck.ksplat']);
    expect(mockModule.__mockState.fileType).toBe('ksplat');
    expect(loadedSpy).toHaveBeenCalledWith({ splatCount: 128 });
    expect(viewer.isSceneLoaded()).toBe(true);
    expect(viewer.getDebugSnapshot()).toMatchObject({
      rendererId: 'spark',
      camera: {
        near: 0.1,
      },
      runtime: {
        compatibilityMode: false,
        viewerOptions: null,
      },
      splatCount: 128,
    });
    expect(viewer.getCamera()?.far).toBeGreaterThan(10);
  });

  it('returns a cloned scene bounds box only after a successful scene load', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();
    expect(viewer.getSceneBounds()).toBeNull();

    await viewer.loadScene('/api/presets/truck.ksplat');

    const bounds = viewer.getSceneBounds();
    const internalBounds = (viewer as unknown as { sceneBounds: THREE.Box3 }).sceneBounds;
    const originalMin = internalBounds.min.clone();
    const originalMax = internalBounds.max.clone();
    expect(bounds).not.toBeNull();
    expect(bounds).not.toBe(internalBounds);
    expect(bounds?.min.toArray()).toEqual(internalBounds.min.toArray());
    expect(bounds?.max.toArray()).toEqual(internalBounds.max.toArray());

    bounds?.expandByScalar(10);
    expect(internalBounds.min.toArray()).toEqual(originalMin.toArray());
    expect(internalBounds.max.toArray()).toEqual(originalMax.toArray());
  });

  it('loads scenes without forcing a spark mesh rotation override', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/truck.ksplat');

    expect(mockModule.__mockState.lastParsedMesh?.quaternion.toArray()).toEqual([0, 0, 0, 1]);
  });

  it('maps cached ply presets to the Spark ply file type', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/luigi.ply');

    expect(mockModule.__mockState.loadCalls).toEqual(['/api/presets/luigi.ply']);
    expect(mockModule.__mockState.fileType).toBe('ply');
  });

  it('applies inverted camera poses without snapping them upright', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

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

  it('tightens the Spark camera near plane for close inspection poses', async () => {
    const events = new AppEvents();
    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();
    await viewer.loadScene('/api/presets/truck.ksplat');

    const sceneBounds = (viewer as unknown as { sceneBounds: THREE.Box3 }).sceneBounds;
    const closePosition = sceneBounds.getCenter(new THREE.Vector3());

    viewer.applyCameraPose({
      position: closePosition,
      quaternion: new THREE.Quaternion(),
      fov: 60,
    });

    expect(viewer.getCamera()?.near).toBeLessThan(0.1);
    expect(viewer.getCamera()?.near).toBeGreaterThanOrEqual(0.01);
    expect(viewer.getCamera()?.far).toBeGreaterThan((viewer.getCamera()?.near ?? 0) + 10);
  });

  it('fails scene loads that resolve with zero splats', async () => {
    const events = new AppEvents();
    const errorSpy = vi.fn();
    events.on('scene:error', errorSpy);
    mockModule.__mockState.splatCount = 0;
    mockModule.__mockState.samples = [];

    const hostElement = {
      clientHeight: 600,
      clientWidth: 800,
      replaceChildren: vi.fn(),
    } as unknown as HTMLDivElement;
    const viewer = new SparkSceneViewer({ hostElement, events });

    await viewer.init();

    await expect(viewer.loadScene('/test-assets/smoke-grid.ply')).rejects.toThrow(
      'Loaded scene contains no splats.',
    );
    expect(errorSpy).toHaveBeenCalledWith({ message: 'Loaded scene contains no splats.' });
    expect(viewer.isSceneLoaded()).toBe(false);
  });
});
