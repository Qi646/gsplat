import type { Keyframe } from '../types';
import { PathInterpolator } from '../path/PathInterpolator';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';

export interface ExportSettings {
  width: number;
  height: number;
  fps: number;
  fileName: string;
}

export type ExportProgressStage =
  | 'starting'
  | 'rendering'
  | 'uploading'
  | 'encoding'
  | 'complete';

export interface ExportProgress {
  completedFrames: number;
  message: string;
  percent: number;
  stage: ExportProgressStage;
  totalFrames: number;
}

export interface ExportResult {
  blob: Blob;
  fileName: string;
  settings: ExportSettings;
  totalFrames: number;
}

export interface ExportManagerOptions {
  fetchImpl?: typeof fetch;
  viewer: ViewerAdapter;
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  width: 1280,
  height: 720,
  fps: 30,
  fileName: 'output.mp4',
};

interface CreateJobResponse {
  jobId: string;
}

interface ExportPathOptions {
  onProgress?: (progress: ExportProgress) => void;
  settings?: Partial<ExportSettings>;
}

export class ExportManager {
  private readonly fetchImpl: typeof fetch;
  private readonly viewer: ViewerAdapter;
  private exporting = false;

  constructor(options: ExportManagerOptions) {
    this.viewer = options.viewer;
    this.fetchImpl = resolveFetchImpl(options.fetchImpl);
  }

  isExporting(): boolean {
    return this.exporting;
  }

  async exportPath(keyframes: Keyframe[], options: ExportPathOptions = {}): Promise<ExportResult> {
    if (this.exporting) {
      throw new Error('An export is already in progress.');
    }

    if (!this.viewer.isSceneLoaded()) {
      throw new Error('Load a scene before exporting an MP4.');
    }

    if (keyframes.length < 2) {
      throw new Error('Add at least two keyframes before exporting an MP4.');
    }

    const camera = this.viewer.getCamera();
    const interactionSurface = this.viewer.getInteractionSurface();
    if (!camera || !interactionSurface) {
      throw new Error('Viewer camera or capture surface is unavailable.');
    }

    const settings = resolveExportSettings(options.settings);
    const interpolator = new PathInterpolator();
    interpolator.setKeyframes(keyframes);

    const totalDuration = interpolator.getTotalDuration();
    if (totalDuration <= 0) {
      throw new Error('Camera path must have a positive duration before export.');
    }

    const frameTimes = buildExportFrameTimes(totalDuration, settings.fps);
    const previousPose = {
      fov: camera.fov,
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
    };
    const previousRenderBudget = this.viewer.getRenderBudget();
    const previousSize = {
      height: Math.max(interactionSurface.clientHeight || interactionSurface.height || 0, 1),
      width: Math.max(interactionSurface.clientWidth || interactionSurface.width || 0, 1),
    };

    const reportProgress = createProgressReporter(options.onProgress, frameTimes.length);
    const totalUnits = frameTimes.length * 2 + 1;
    let completedUnits = 0;
    let jobId: string | null = null;

    this.exporting = true;
    reportProgress({
      completedFrames: 0,
      message: `Starting export at ${settings.width}x${settings.height} @ ${settings.fps} FPS…`,
      percent: 0,
      stage: 'starting',
      totalFrames: frameTimes.length,
    });

    try {
      this.viewer.setRenderBudget(null);
      jobId = await this.createJob(settings);
      this.viewer.resize(settings.width, settings.height);
      this.viewer.renderNow();

      for (const [frameIndex, timeSeconds] of frameTimes.entries()) {
        const pose = interpolator.evaluate(timeSeconds);
        if (!pose) {
          throw new Error(`Could not evaluate camera pose for frame ${frameIndex + 1}.`);
        }

        this.viewer.applyCameraPose(pose);
        this.viewer.renderNow();

        reportProgress({
          completedFrames: frameIndex,
          message: `Rendering frame ${frameIndex + 1}/${frameTimes.length}…`,
          percent: (completedUnits / totalUnits) * 100,
          stage: 'rendering',
          totalFrames: frameTimes.length,
        });

        const frame = await this.viewer.captureFrame();
        completedUnits += 1;

        reportProgress({
          completedFrames: frameIndex + 1,
          message: `Uploading frame ${frameIndex + 1}/${frameTimes.length}…`,
          percent: (completedUnits / totalUnits) * 100,
          stage: 'uploading',
          totalFrames: frameTimes.length,
        });

        await this.appendFrame(jobId, frame);
        completedUnits += 1;
      }

      reportProgress({
        completedFrames: frameTimes.length,
        message: 'Encoding MP4 with FFmpeg…',
        percent: (completedUnits / totalUnits) * 100,
        stage: 'encoding',
        totalFrames: frameTimes.length,
      });

      const blob = await this.finalizeJob(jobId);
      reportProgress({
        completedFrames: frameTimes.length,
        message: `${settings.fileName} is ready.`,
        percent: 100,
        stage: 'complete',
        totalFrames: frameTimes.length,
      });

      jobId = null;
      return {
        blob,
        fileName: settings.fileName,
        settings,
        totalFrames: frameTimes.length,
      };
    } catch (error) {
      if (jobId) {
        await this.cancelJob(jobId);
      }
      throw error;
    } finally {
      this.viewer.resize(previousSize.width, previousSize.height);
      this.viewer.applyCameraPose(previousPose);
      this.viewer.setRenderBudget(previousRenderBudget);
      this.viewer.renderNow();
      this.exporting = false;
    }
  }

  private async createJob(settings: ExportSettings): Promise<string> {
    const response = await this.fetchImpl('/api/export/jobs', {
      body: JSON.stringify({
        fps: settings.fps,
        height: settings.height,
        width: settings.width,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Could not start export.'));
    }

    const payload = (await response.json()) as CreateJobResponse;
    if (!payload.jobId) {
      throw new Error('Export server returned an invalid job id.');
    }

    return payload.jobId;
  }

  private async appendFrame(jobId: string, frame: Blob): Promise<void> {
    const response = await this.fetchImpl(`/api/export/jobs/${jobId}/frame`, {
      body: frame,
      headers: {
        'Content-Type': 'image/png',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Could not upload export frame.'));
    }
  }

  private async finalizeJob(jobId: string): Promise<Blob> {
    const response = await this.fetchImpl(`/api/export/jobs/${jobId}/finalize`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Could not finalize export.'));
    }

    return response.blob();
  }

  private async cancelJob(jobId: string): Promise<void> {
    try {
      await this.fetchImpl(`/api/export/jobs/${jobId}`, {
        method: 'DELETE',
      });
    } catch {
      // Best-effort cleanup only.
    }
  }
}

function resolveFetchImpl(fetchImpl?: typeof fetch): typeof fetch {
  const resolvedFetch = fetchImpl ?? globalThis.fetch;

  if (resolvedFetch === globalThis.fetch) {
    return globalThis.fetch.bind(globalThis);
  }

  return resolvedFetch;
}

export function buildExportFrameTimes(durationSeconds: number, fps: number): number[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error('Export duration must be greater than zero.');
  }

  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error('Export FPS must be greater than zero.');
  }

  const safeFps = Math.floor(fps);
  const times = Array.from(
    { length: Math.floor(durationSeconds * safeFps) + 1 },
    (_, index) => index / safeFps,
  );
  const lastTime = times[times.length - 1] ?? 0;

  if (Math.abs(lastTime - durationSeconds) > 1e-6) {
    times.push(durationSeconds);
  }

  return times;
}

function resolveExportSettings(overrides: Partial<ExportSettings> | undefined): ExportSettings {
  const settings: ExportSettings = {
    ...DEFAULT_EXPORT_SETTINGS,
    ...overrides,
  };

  for (const [label, value] of [
    ['width', settings.width],
    ['height', settings.height],
    ['fps', settings.fps],
  ] as const) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Export ${label} must be a positive number.`);
    }
  }

  settings.width = Math.floor(settings.width);
  settings.height = Math.floor(settings.height);
  settings.fps = Math.floor(settings.fps);

  if (!settings.fileName) {
    throw new Error('Export file name must not be empty.');
  }

  return settings;
}

function createProgressReporter(
  onProgress: ExportPathOptions['onProgress'],
  totalFrames: number,
): (progress: ExportProgress) => void {
  return progress => {
    onProgress?.({
      ...progress,
      percent: Math.max(0, Math.min(progress.percent, 100)),
      totalFrames,
    });
  };
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    if (payload?.error) {
      return payload.error;
    }
  }

  const text = await response.text().catch(() => '');
  return text || fallback;
}
