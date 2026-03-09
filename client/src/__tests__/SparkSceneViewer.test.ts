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

vi.mock('three/examples/jsm/controls/OrbitControls.js', async () => {
  const THREE = await import('three');

  class MockOrbitControls {
    target = new THREE.Vector3();
    enableDamping = false;
    enabled = true;

    constructor(
      _camera: THREE.PerspectiveCamera,
      _domElement: HTMLCanvasElement,
    ) {}

    dispose(): void {}

    update(): void {}
  }

  return { OrbitControls: MockOrbitControls };
});

vi.mock('@sparkjsdev/spark', async () => {
  const THREE = await import('three');

  const state = {
    boundsMax: [1, 1, 1] as [number, number, number],
    boundsMin: [-1, -1, -1] as [number, number, number],
    fileType: null as string | null,
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
      return new MockSplatMesh();
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

  it('disables orbit controls for walk mode and re-syncs the orbit target from the camera view', async () => {
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

    controls.target.set(1, 2, -2);
    viewer.getCamera()?.position.set(1, 2, 3);
    viewer.getCamera()?.lookAt(new THREE.Vector3(6, 2, 3));

    viewer.setNavigationMode('walk');
    expect(controls.enabled).toBe(false);

    viewer.syncOrbitTargetFromCamera();
    expect(controls.target.x).toBeCloseTo(6);
    expect(controls.target.y).toBeCloseTo(2);
    expect(controls.target.z).toBeCloseTo(3);

    viewer.setNavigationMode('orbit');
    expect(controls.enabled).toBe(true);
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
