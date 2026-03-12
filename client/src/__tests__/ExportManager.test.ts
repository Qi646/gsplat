import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import {
  ExportCancelledError,
  ExportManager,
  buildExportFrameTimes,
} from '../export/ExportManager';
import type { SceneLoadInput } from '../lib/sceneSource';
import type { Keyframe, ViewerDebugSnapshot } from '../types';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';

class FakeViewer implements ViewerAdapter {
  readonly camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  private readonly surface = {
    clientHeight: 360,
    clientWidth: 640,
    height: 360,
    toBlob(callback: BlobCallback) {
      callback(new Blob(['png-frame'], { type: 'image/png' }));
    },
    width: 640,
  } as HTMLCanvasElement;
  readonly appliedFovs: number[] = [];
  readonly renderBudgetHistory: Array<number | null> = [];
  readonly renderBudgetAtRender: Array<number | null> = [];
  readonly resizeCalls: Array<{ height: number; width: number }> = [];
  renderCount = 0;
  renderBudget: number | null = null;
  sceneLoaded = true;

  constructor() {
    this.camera.position.set(5, 6, 7);
    this.camera.quaternion.set(0, 0, 0, 1);
    this.camera.fov = 42;
  }

  async captureFrame(): Promise<Blob> {
    return new Blob(['png-frame'], { type: 'image/png' });
  }

  sampleScenePoints() {
    return [];
  }

  dispose(): void {}

  frameScene(): boolean {
    return true;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getSceneBounds(): THREE.Box3 | null {
    return new THREE.Box3(
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(1, 1, 1),
    );
  }

  getCompatibilityStatusMessage(): string | null {
    return null;
  }

  getDebugSnapshot(): ViewerDebugSnapshot {
    return {
      camera: {
        far: this.camera.far,
        near: this.camera.near,
      },
      canvasSize: {
        clientHeight: 360,
        clientWidth: 640,
        height: 360,
        width: 640,
      },
      lastSortTime: null,
      rendererId: 'mkkellogg',
      rendererInfo: {
        renderer: null,
        shadingLanguageVersion: null,
        vendor: null,
        version: null,
      },
      runtime: {
        compatibilityMode: false,
        compatibilityStatusMessage: null,
        viewerOptions: null,
      },
      sceneCount: 1,
      sceneLoaded: this.sceneLoaded,
      splatCount: 123,
      splatRenderCount: 123,
    };
  }

  getFPS(): number {
    return 60;
  }

  getRenderBudget(): number | null {
    return this.renderBudget;
  }

  getInteractionSurface(): HTMLCanvasElement {
    return this.surface;
  }

  getRendererId(): 'mkkellogg' {
    return 'mkkellogg';
  }

  getSplatCount(): number {
    return 123;
  }

  getRenderedSplatCount(): number {
    return this.renderBudget === null ? 123 : Math.min(123, this.renderBudget);
  }

  init(): Promise<void> {
    return Promise.resolve();
  }

  isSceneLoaded(): boolean {
    return this.sceneLoaded;
  }

  loadScene(_source: SceneLoadInput): Promise<void> {
    return Promise.resolve();
  }

  renderNow(): void {
    this.renderCount += 1;
    this.renderBudgetAtRender.push(this.renderBudget);
  }

  resetView(): void {}

  resize(width: number, height: number): void {
    this.resizeCalls.push({ height, width });
  }

  setFrameHook(): void {}

  setRenderBudget(maxRenderCount: number | null): void {
    this.renderBudget = maxRenderCount;
    this.renderBudgetHistory.push(maxRenderCount);
  }

  setNavigationMode(): void {}

  resumeOrbitFromCamera(): void {}

  applyCameraPose(pose: { position: THREE.Vector3; quaternion: THREE.Quaternion; fov: number }): void {
    this.camera.position.copy(pose.position);
    this.camera.quaternion.copy(pose.quaternion);
    this.camera.fov = pose.fov;
    this.appliedFovs.push(pose.fov);
  }
}

function createKeyframes(): Keyframe[] {
  return [
    {
      fov: 50,
      id: 'kf-1',
      position: { x: 0, y: 0, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      time: 0,
    },
    {
      fov: 60,
      id: 'kf-2',
      position: { x: 3, y: 0, z: -2 },
      quaternion: { x: 0, y: 0.25, z: 0, w: 0.9682458366 },
      time: 1.25,
    },
  ];
}

describe('buildExportFrameTimes', () => {
  it('includes the exact final duration when it does not land on an FPS boundary', () => {
    expect(buildExportFrameTimes(1.25, 2)).toEqual([0, 0.5, 1, 1.25]);
  });
});

describe('ExportManager', () => {
  it('binds global fetch to the global receiver for ambient and explicitly injected browser fetch usage', async () => {
    const originalFetch = globalThis.fetch;
    const viewer = new FakeViewer();

    try {
      const globalFetch = vi.fn(function (this: typeof globalThis, input: RequestInfo | URL) {
        expect(this).toBe(globalThis);

        const url = String(input);
        if (url === '/api/export/jobs') {
          return Promise.resolve(
            new Response(JSON.stringify({ jobId: 'job-bound' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200,
            }),
          );
        }

        if (url === '/api/export/jobs/job-bound/frame') {
          return Promise.resolve(new Response(null, { status: 204 }));
        }

        if (url === '/api/export/jobs/job-bound/finalize') {
          return Promise.resolve(
            new Response(new Blob(['mp4-bytes'], { type: 'video/mp4' }), {
              headers: { 'Content-Type': 'video/mp4' },
              status: 200,
            }),
          );
        }

        throw new Error(`Unexpected fetch call: ${url}`);
      }) as typeof fetch;

      globalThis.fetch = globalFetch;

      const managers = [new ExportManager({ viewer }), new ExportManager({ fetchImpl: globalThis.fetch, viewer })];

      for (const manager of managers) {
        const result = await manager.exportPath(createKeyframes(), {
          settings: { fps: 1, height: 720, width: 1280 },
        });

        await expect(result.blob.text()).resolves.toBe('mp4-bytes');
      }

      expect(globalFetch).toHaveBeenCalledTimes(10);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('renders, uploads, finalizes, and restores the prior camera pose and size', async () => {
    const viewer = new FakeViewer();
    viewer.setRenderBudget(77);
    const fetchImpl = vi.fn<typeof fetch>(async (input, init) => {
      const url = String(input);
      if (url === '/api/export/jobs') {
        return new Response(JSON.stringify({ jobId: 'job-1' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url === '/api/export/jobs/job-1/frame') {
        expect(init?.body).toBeInstanceOf(Blob);
        return new Response(null, { status: 204 });
      }

      if (url === '/api/export/jobs/job-1/finalize') {
        return new Response(new Blob(['mp4-bytes'], { type: 'video/mp4' }), {
          headers: { 'Content-Type': 'video/mp4' },
          status: 200,
        });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });
    const progressMessages: string[] = [];
    const manager = new ExportManager({ fetchImpl, viewer });

    const result = await manager.exportPath(createKeyframes(), {
      onProgress: progress => progressMessages.push(progress.message),
      settings: { fps: 2, height: 720, width: 1280 },
    });

    expect(fetchImpl).toHaveBeenCalledTimes(6);
    expect(result.fileName).toBe('output.mp4');
    await expect(result.blob.text()).resolves.toBe('mp4-bytes');
    expect(result.totalFrames).toBe(4);
    expect(progressMessages).toContain('Encoding MP4 with FFmpeg…');
    expect(progressMessages.at(-1)).toBe('output.mp4 is ready.');
    expect(viewer.resizeCalls).toEqual([
      { height: 720, width: 1280 },
      { height: 360, width: 640 },
    ]);
    expect(viewer.renderBudgetHistory.slice(-2)).toEqual([null, 77]);
    expect(viewer.renderBudgetAtRender.slice(0, -1).every(budget => budget === null)).toBe(true);
    expect(viewer.renderBudgetAtRender.at(-1)).toBe(77);
    expect(viewer.getRenderBudget()).toBe(77);
    expect(viewer.camera.position.toArray()).toEqual([5, 6, 7]);
    expect(viewer.camera.fov).toBe(42);
    expect(manager.isExporting()).toBe(false);
  });

  it('exports multiple MP4 targets sequentially with aggregate progress', async () => {
    const viewer = new FakeViewer();
    let createdJobCount = 0;
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);

      if (url === '/api/export/jobs') {
        createdJobCount += 1;
        return new Response(JSON.stringify({ jobId: `job-${createdJobCount}` }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url === '/api/export/jobs/job-1/frame' || url === '/api/export/jobs/job-2/frame') {
        return new Response(null, { status: 204 });
      }

      if (url === '/api/export/jobs/job-1/finalize') {
        return new Response(new Blob(['mp4-720p'], { type: 'video/mp4' }), {
          headers: { 'Content-Type': 'video/mp4' },
          status: 200,
        });
      }

      if (url === '/api/export/jobs/job-2/finalize') {
        return new Response(new Blob(['mp4-1080p'], { type: 'video/mp4' }), {
          headers: { 'Content-Type': 'video/mp4' },
          status: 200,
        });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });
    const manager = new ExportManager({ fetchImpl, viewer });
    const progressMessages: string[] = [];

    const result = await manager.exportBatch(createKeyframes(), {
      onProgress: progress => progressMessages.push(progress.message),
      settingsList: [
        { fileName: 'output-720p.mp4', fps: 1, height: 720, width: 1280 },
        { fileName: 'output-1080p.mp4', fps: 1, height: 1080, width: 1920 },
      ],
    });

    expect(result.totalJobs).toBe(2);
    expect(result.results).toHaveLength(2);
    await expect(result.results[0]?.blob.text()).resolves.toBe('mp4-720p');
    await expect(result.results[1]?.blob.text()).resolves.toBe('mp4-1080p');
    expect(progressMessages).toContain('[1/2] output-720p.mp4 · Encoding MP4 with FFmpeg…');
    expect(progressMessages.at(-1)).toBe('[2/2] output-1080p.mp4 · output-1080p.mp4 is ready.');
    expect(viewer.resizeCalls).toEqual([
      { height: 720, width: 1280 },
      { height: 1080, width: 1920 },
      { height: 360, width: 640 },
    ]);
    expect(manager.isExporting()).toBe(false);
  });

  it('cancels the server job and restores local state when frame upload fails', async () => {
    const viewer = new FakeViewer();
    viewer.setRenderBudget(55);
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url === '/api/export/jobs') {
        return new Response(JSON.stringify({ jobId: 'job-2' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      if (url === '/api/export/jobs/job-2/frame') {
        return new Response(JSON.stringify({ error: 'frame upload failed' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 502,
        });
      }

      if (url === '/api/export/jobs/job-2') {
        return new Response(null, { status: 204 });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });
    const manager = new ExportManager({ fetchImpl, viewer });

    await expect(
      manager.exportPath(createKeyframes(), {
        settings: { fps: 1, height: 720, width: 1280 },
      }),
    ).rejects.toThrow('frame upload failed');

    expect(fetchImpl).toHaveBeenCalledWith('/api/export/jobs/job-2', { method: 'DELETE' });
    expect(viewer.resizeCalls).toEqual([
      { height: 720, width: 1280 },
      { height: 360, width: 640 },
    ]);
    expect(viewer.renderBudgetHistory.slice(-2)).toEqual([null, 55]);
    expect(viewer.renderBudgetAtRender.slice(0, -1).every(budget => budget === null)).toBe(true);
    expect(viewer.renderBudgetAtRender.at(-1)).toBe(55);
    expect(viewer.getRenderBudget()).toBe(55);
    expect(viewer.camera.position.toArray()).toEqual([5, 6, 7]);
    expect(manager.isExporting()).toBe(false);
  });

  it('aborts the active upload and cancels the export job when the user cancels', async () => {
    const viewer = new FakeViewer();
    let resolveFrameUploadStarted: (() => void) | null = null;
    const frameUploadStarted = new Promise<void>(resolve => {
      resolveFrameUploadStarted = resolve;
    });
    const fetchImpl = vi.fn<typeof fetch>((input, init) => {
      const url = String(input);

      if (url === '/api/export/jobs') {
        return Promise.resolve(
          new Response(JSON.stringify({ jobId: 'job-cancel' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          }),
        );
      }

      if (url === '/api/export/jobs/job-cancel/frame') {
        resolveFrameUploadStarted?.();
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        });
      }

      if (url === '/api/export/jobs/job-cancel') {
        return Promise.resolve(new Response(null, { status: 204 }));
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });
    const manager = new ExportManager({ fetchImpl, viewer });

    const exportPromise = manager.exportPath(createKeyframes(), {
      settings: { fps: 1, height: 720, width: 1280 },
    });

    await frameUploadStarted;
    expect(manager.isExporting()).toBe(true);
    expect(manager.isCancelling()).toBe(false);

    manager.cancelExport();
    expect(manager.isCancelling()).toBe(true);

    await expect(exportPromise).rejects.toBeInstanceOf(ExportCancelledError);
    expect(fetchImpl).toHaveBeenCalledWith('/api/export/jobs/job-cancel', { method: 'DELETE' });
    expect(manager.isExporting()).toBe(false);
    expect(manager.isCancelling()).toBe(false);
  });

  it('rejects export requests until a scene is loaded and a path exists', async () => {
    const viewer = new FakeViewer();
    viewer.sceneLoaded = false;
    const manager = new ExportManager({ viewer });

    await expect(manager.exportPath(createKeyframes())).rejects.toThrow(
      'Load a scene before exporting an MP4.',
    );

    viewer.sceneLoaded = true;

    await expect(manager.exportPath(createKeyframes().slice(0, 1))).rejects.toThrow(
      'Add at least two keyframes before exporting an MP4.',
    );
  });
});
