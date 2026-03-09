import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@mkkellogg/gaussian-splats-3d', async () => {
  const THREE = await import('three');

  const state = {
    viewerOptions: null as Record<string, unknown> | null,
    addSceneCalls: [] as Array<{ url: string; options: Record<string, unknown> }>,
    removeSceneCalls: [] as Array<{ indexes: number[]; showLoadingUI?: boolean }>,
    sceneCount: 0,
    splatCount: 0,
    boundsMin: [-1, -1, -1] as [number, number, number],
    boundsMax: [1, 1, 1] as [number, number, number],
  };

  class MockSplatMesh {
    getSplatCount(): number {
      return state.splatCount;
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
      domElement: { requestPointerLock() {} },
      setPixelRatio() {},
      setSize() {},
    } as unknown as THREE.WebGLRenderer;
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    controls = {
      target: new THREE.Vector3(),
      update() {},
    };

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

    render(): void {}

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
    sceneCount: number;
    splatCount: number;
    boundsMin: [number, number, number];
    boundsMax: [number, number, number];
  };
};

describe('SceneViewer', () => {
  const mockModule = GaussianSplats3D as MockModule;
  const originalWindow = globalThis.window;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  let startRenderLoopSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockModule.__mockState.viewerOptions = null;
    mockModule.__mockState.addSceneCalls = [];
    mockModule.__mockState.removeSceneCalls = [];
    mockModule.__mockState.sceneCount = 0;
    mockModule.__mockState.splatCount = 1024;
    mockModule.__mockState.boundsMin = [-2, -1, -3];
    mockModule.__mockState.boundsMax = [4, 5, 6];

    Object.defineProperty(globalThis, 'window', {
      value: {
        crossOriginIsolated: true,
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

    startRenderLoopSpy = vi.spyOn(SceneViewer.prototype as never, 'startRenderLoop').mockImplementation(() => {});
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

  it('initializes the viewer with the host element and exposes the renderer canvas', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });

    await viewer.init();

    expect(mockModule.__mockState.viewerOptions?.['rootElement']).toBe(hostElement);
    expect(mockModule.__mockState.viewerOptions?.['canvas']).toBeUndefined();
    expect(viewer.getInteractionSurface()).toEqual(
      (viewer as unknown as { renderer: { domElement: unknown } }).renderer.domElement,
    );
  });

  it('loads a scene, disables the package loading UI, and emits scene:loaded when bounds are valid', async () => {
    const events = new AppEvents();
    const hostElement = {} as HTMLDivElement;
    const viewer = new SceneViewer({ hostElement, events });
    const onLoaded = vi.fn();
    events.on('scene:loaded', onLoaded);

    await viewer.init();
    await viewer.loadScene('https://example.com/room.splat');

    expect(mockModule.__mockState.addSceneCalls).toHaveLength(1);
    expect(mockModule.__mockState.addSceneCalls[0]?.options['showLoadingUI']).toBe(false);
    expect(viewer.isSceneLoaded()).toBe(true);
    expect(onLoaded).toHaveBeenCalledWith({ splatCount: 1024 });

    const sceneBounds = (viewer as unknown as { sceneBounds: THREE.Box3 }).sceneBounds;
    expect(sceneBounds.min.toArray()).toEqual([-2, -1, -3]);
    expect(sceneBounds.max.toArray()).toEqual([4, 5, 6]);
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
