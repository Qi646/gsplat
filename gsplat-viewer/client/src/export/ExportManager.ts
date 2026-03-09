/**
 * ExportManager.ts
 * Drives the frame-by-frame render loop and streams PNG frames to
 * the Node server for FFmpeg encoding.
 */

import type { ExportSettings, AppEvents } from '../types';
import type { SceneViewer } from '../viewer/SceneViewer';
import type { KeyframeManager } from '../path/KeyframeManager';

export interface ExportManagerOptions {
  viewer: SceneViewer;
  keyframeManager: KeyframeManager;
  events: AppEvents;
  offscreenCanvas?: OffscreenCanvas;
}

export class ExportManager {
  private viewer: SceneViewer;
  private kfManager: KeyframeManager;
  private events: AppEvents;

  private abortController: AbortController | null = null;
  private running = false;

  constructor(options: ExportManagerOptions) {
    this.viewer = options.viewer;
    this.kfManager = options.kfManager;
    this.events = options.events;
  }

  isRunning(): boolean { return this.running; }

  cancel(): void {
    this.abortController?.abort();
  }

  async export(settings: ExportSettings): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const [width, height] = settings.resolution.split('x').map(Number);
    const totalFrames = Math.ceil(settings.duration * settings.fps);

    this.events.emit('export:start', settings);

    try {
      // 1. Tell server to start a session
      const startResp = await fetch('/api/export/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          width, height,
          fps: settings.fps,
          frameCount: totalFrames,
          quality: settings.quality,
        }),
        signal,
      });
      if (!startResp.ok) throw new Error(`Server error: ${startResp.status}`);
      const { sessionId } = await startResp.json() as { sessionId: string };

      // 2. Switch renderer to export size
      const renderer = this.viewer.getRenderer();
      const originalSize = new (await import('three')).Vector2();
      renderer?.getSize(originalSize);
      renderer?.setSize(width, height);

      // Enter deterministic render mode
      this.viewer.enterExportMode();

      // Get the canvas to read pixels from
      const canvas = renderer?.domElement;
      if (!canvas) throw new Error('No renderer canvas');

      const interpolator = this.kfManager.getInterpolator();
      const totalDuration = this.kfManager.getTotalDuration();

      // 3. Render each frame
      for (let i = 0; i < totalFrames; i++) {
        if (signal.aborted) {
          await fetch(`/api/export/cancel/${sessionId}`, { method: 'POST' });
          this.events.emit('export:cancelled', undefined);
          return;
        }

        const t = (i / (totalFrames - 1)) * totalDuration;
        const pose = interpolator.evaluate(t);

        if (!pose) continue;

        // Render the frame
        this.viewer.renderFrame(pose.position, pose.quaternion, pose.fov);

        // Wait for rendering to settle (splat sort needs one rAF)
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

        // Grab frame as PNG blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(b => {
            if (b) resolve(b);
            else reject(new Error('toBlob failed'));
          }, 'image/png');
        });

        const base64 = await this.blobToBase64(blob);

        // POST frame to server
        const frameResp = await fetch('/api/export/frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, frameIndex: i, data: base64 }),
          signal,
        });
        if (!frameResp.ok) throw new Error(`Frame POST error: ${frameResp.status}`);

        this.events.emit('export:progress', { frame: i + 1, total: totalFrames });
      }

      // 4. Finish — server flushes FFmpeg
      const finishResp = await fetch(`/api/export/finish/${sessionId}`, {
        method: 'POST',
        signal,
      });
      if (!finishResp.ok) throw new Error(`Finish error: ${finishResp.status}`);

      // 5. Trigger download
      const downloadUrl = `/api/export/download/${sessionId}`;
      this.events.emit('export:complete', { downloadUrl });
      this.triggerDownload(downloadUrl, 'output.mp4');

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        this.events.emit('export:cancelled', undefined);
      } else {
        this.events.emit('export:error', { message: (err as Error).message });
      }
    } finally {
      // Restore renderer
      const renderer = this.viewer.getRenderer();
      if (renderer) {
        const { Vector2 } = await import('three');
        const size = new Vector2();
        renderer.getSize(size);
        // Restore to canvas container size
        const container = renderer.domElement.parentElement;
        if (container) {
          renderer.setSize(container.clientWidth, container.clientHeight);
        }
      }
      this.viewer.exitExportMode();
      this.running = false;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip the data:image/png;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.readAsDataURL(blob);
    });
  }

  private triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
