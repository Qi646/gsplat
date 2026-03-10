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
  | 'cancelling'
  | 'cancelled'
  | 'complete';

export interface ExportProgress {
  completedFrames: number;
  currentFileName: string;
  currentJobIndex: number;
  message: string;
  percent: number;
  stage: ExportProgressStage;
  totalFrames: number;
  totalJobs: number;
}

export interface ExportResult {
  blob: Blob;
  fileName: string;
  settings: ExportSettings;
  totalFrames: number;
}

export interface ExportBatchResult {
  results: ExportResult[];
  totalJobs: number;
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

export interface ExportBatchOptions {
  onProgress?: (progress: ExportProgress) => void;
  settingsList: Array<Partial<ExportSettings>>;
}

interface ActiveExport {
  cancelRequested: boolean;
  currentJobId: string | null;
  currentRequestAbortController: AbortController | null;
  currentRequestKind: 'create' | 'frame' | 'finalize' | null;
  lastProgress: ExportProgress | null;
  reportProgress: (progress: ExportProgress) => void;
}

interface ExportJobRunOptions {
  activeExport: ActiveExport;
  completedUnitsBeforeJob: number;
  frameTimes: number[];
  interpolator: PathInterpolator;
  settings: ExportSettings;
  totalJobs: number;
  totalOverallUnits: number;
  jobIndex: number;
}

export class ExportCancelledError extends Error {
  constructor(message = 'Export cancelled.') {
    super(message);
    this.name = 'ExportCancelledError';
  }
}

export class ExportManager {
  private readonly fetchImpl: typeof fetch;
  private readonly viewer: ViewerAdapter;
  private activeExport: ActiveExport | null = null;

  constructor(options: ExportManagerOptions) {
    this.viewer = options.viewer;
    this.fetchImpl = resolveFetchImpl(options.fetchImpl);
  }

  isExporting(): boolean {
    return this.activeExport !== null;
  }

  isCancelling(): boolean {
    return Boolean(this.activeExport?.cancelRequested);
  }

  cancelExport(): boolean {
    if (!this.activeExport || this.activeExport.cancelRequested) {
      return false;
    }

    this.activeExport.cancelRequested = true;
    const progress = this.activeExport.lastProgress;
    this.activeExport.reportProgress({
      completedFrames: progress?.completedFrames ?? 0,
      currentFileName: progress?.currentFileName ?? DEFAULT_EXPORT_SETTINGS.fileName,
      currentJobIndex: progress?.currentJobIndex ?? 1,
      message: 'Cancelling export…',
      percent: progress?.percent ?? 0,
      stage: 'cancelling',
      totalFrames: progress?.totalFrames ?? 0,
      totalJobs: progress?.totalJobs ?? 1,
    });

    if (
      this.activeExport.currentJobId &&
      this.activeExport.currentRequestAbortController &&
      this.activeExport.currentRequestKind !== 'create'
    ) {
      this.activeExport.currentRequestAbortController.abort();
    }

    return true;
  }

  async exportPath(keyframes: Keyframe[], options: ExportPathOptions = {}): Promise<ExportResult> {
    const batchResult = await this.exportBatch(keyframes, {
      onProgress: options.onProgress,
      settingsList: [options.settings ?? {}],
    });

    const [result] = batchResult.results;
    if (!result) {
      throw new Error('Export did not produce any MP4 output.');
    }

    return result;
  }

  async exportBatch(keyframes: Keyframe[], options: ExportBatchOptions): Promise<ExportBatchResult> {
    if (this.activeExport) {
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

    const settingsList = options.settingsList.map(settings => resolveExportSettings(settings));
    if (settingsList.length === 0) {
      throw new Error('Add at least one export target before exporting.');
    }

    const interpolator = new PathInterpolator();
    interpolator.setKeyframes(keyframes);

    const totalDuration = interpolator.getTotalDuration();
    if (totalDuration <= 0) {
      throw new Error('Camera path must have a positive duration before export.');
    }

    const frameTimesList = settingsList.map(settings => buildExportFrameTimes(totalDuration, settings.fps));
    const totalOverallUnits = frameTimesList.reduce(
      (sum, frameTimes) => sum + frameTimes.length * 2 + 1,
      0,
    );

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

    const activeExport: ActiveExport = {
      cancelRequested: false,
      currentJobId: null,
      currentRequestAbortController: null,
      currentRequestKind: null,
      lastProgress: null,
      reportProgress: createProgressReporter(options.onProgress),
    };
    this.activeExport = activeExport;

    try {
      this.viewer.setRenderBudget(null);
      const results: ExportResult[] = [];
      let completedUnitsBeforeJob = 0;

      for (const [index, settings] of settingsList.entries()) {
        this.throwIfCancellationRequested(activeExport);
        const frameTimes = frameTimesList[index] ?? [];
        const result = await this.exportSingleJob({
          activeExport,
          completedUnitsBeforeJob,
          frameTimes,
          interpolator,
          settings,
          totalJobs: settingsList.length,
          totalOverallUnits,
          jobIndex: index,
        });
        results.push(result);
        completedUnitsBeforeJob += frameTimes.length * 2 + 1;
      }

      return {
        results,
        totalJobs: results.length,
      };
    } catch (error) {
      if (error instanceof ExportCancelledError) {
        const progress = activeExport.lastProgress;
        activeExport.reportProgress({
          completedFrames: progress?.completedFrames ?? 0,
          currentFileName: progress?.currentFileName ?? settingsList[0]?.fileName ?? DEFAULT_EXPORT_SETTINGS.fileName,
          currentJobIndex: progress?.currentJobIndex ?? 1,
          message: error.message,
          percent: progress?.percent ?? 0,
          stage: 'cancelled',
          totalFrames: progress?.totalFrames ?? 0,
          totalJobs: progress?.totalJobs ?? settingsList.length,
        });
      }
      throw error;
    } finally {
      this.viewer.resize(previousSize.width, previousSize.height);
      this.viewer.applyCameraPose(previousPose);
      this.viewer.setRenderBudget(previousRenderBudget);
      this.viewer.renderNow();
      this.activeExport = null;
    }
  }

  private async exportSingleJob(options: ExportJobRunOptions): Promise<ExportResult> {
    const {
      activeExport,
      completedUnitsBeforeJob,
      frameTimes,
      interpolator,
      settings,
      totalJobs,
      totalOverallUnits,
      jobIndex,
    } = options;
    const jobNumber = jobIndex + 1;
    const totalFrames = frameTimes.length;
    const totalUnitsForJob = totalFrames * 2 + 1;
    let completedUnitsForJob = 0;
    let jobId: string | null = null;

    const reportProgress = (
      stage: ExportProgressStage,
      message: string,
      completedFrames: number,
    ) => {
      const progress = buildJobProgress({
        completedFrames,
        completedUnitsBeforeJob,
        completedUnitsForJob,
        currentFileName: settings.fileName,
        jobIndex,
        message,
        stage,
        totalFrames,
        totalJobs,
        totalOverallUnits,
      });
      activeExport.reportProgress(progress);
    };

    reportProgress(
      'starting',
      formatProgressMessage(
        totalJobs,
        jobNumber,
        settings.fileName,
        `Starting export at ${settings.width}x${settings.height} @ ${settings.fps} FPS…`,
      ),
      0,
    );

    try {
      this.throwIfCancellationRequested(activeExport);
      jobId = await this.createJob(settings, activeExport);
      activeExport.currentJobId = jobId;
      this.throwIfCancellationRequested(activeExport);

      this.viewer.resize(settings.width, settings.height);
      this.viewer.renderNow();

      for (const [frameIndex, timeSeconds] of frameTimes.entries()) {
        this.throwIfCancellationRequested(activeExport);

        const pose = interpolator.evaluate(timeSeconds);
        if (!pose) {
          throw new Error(`Could not evaluate camera pose for frame ${frameIndex + 1}.`);
        }

        this.viewer.applyCameraPose(pose);
        this.viewer.renderNow();

        reportProgress(
          'rendering',
          formatProgressMessage(
            totalJobs,
            jobNumber,
            settings.fileName,
            `Rendering frame ${frameIndex + 1}/${totalFrames}…`,
          ),
          frameIndex,
        );

        const frame = await this.viewer.captureFrame();
        completedUnitsForJob += 1;
        this.throwIfCancellationRequested(activeExport);

        reportProgress(
          'uploading',
          formatProgressMessage(
            totalJobs,
            jobNumber,
            settings.fileName,
            `Uploading frame ${frameIndex + 1}/${totalFrames}…`,
          ),
          frameIndex + 1,
        );

        await this.appendFrame(jobId, frame, activeExport);
        completedUnitsForJob += 1;
      }

      this.throwIfCancellationRequested(activeExport);
      reportProgress(
        'encoding',
        formatProgressMessage(totalJobs, jobNumber, settings.fileName, 'Encoding MP4 with FFmpeg…'),
        totalFrames,
      );

      const blob = await this.finalizeJob(jobId, activeExport);
      jobId = null;
      activeExport.currentJobId = null;
      completedUnitsForJob = totalUnitsForJob;

      reportProgress(
        'complete',
        formatProgressMessage(totalJobs, jobNumber, settings.fileName, `${settings.fileName} is ready.`),
        totalFrames,
      );

      return {
        blob,
        fileName: settings.fileName,
        settings,
        totalFrames,
      };
    } catch (error) {
      const normalizedError = normalizeExportError(error, activeExport.cancelRequested);
      if (jobId) {
        await this.cancelJob(jobId);
        activeExport.currentJobId = null;
      }
      throw normalizedError;
    }
  }

  private throwIfCancellationRequested(activeExport: ActiveExport): void {
    if (activeExport.cancelRequested) {
      throw new ExportCancelledError();
    }
  }

  private async createJob(settings: ExportSettings, activeExport: ActiveExport): Promise<string> {
    const response = await this.fetchWithTracking(
      '/api/export/jobs',
      {
        body: JSON.stringify({
          fps: settings.fps,
          height: settings.height,
          width: settings.width,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      activeExport,
      'create',
      false,
    );

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Could not start export.'));
    }

    const payload = (await response.json()) as CreateJobResponse;
    if (!payload.jobId) {
      throw new Error('Export server returned an invalid job id.');
    }

    return payload.jobId;
  }

  private async appendFrame(jobId: string, frame: Blob, activeExport: ActiveExport): Promise<void> {
    const response = await this.fetchWithTracking(
      `/api/export/jobs/${jobId}/frame`,
      {
        body: frame,
        headers: {
          'Content-Type': 'image/png',
        },
        method: 'POST',
      },
      activeExport,
      'frame',
    );

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Could not upload export frame.'));
    }
  }

  private async finalizeJob(jobId: string, activeExport: ActiveExport): Promise<Blob> {
    const response = await this.fetchWithTracking(
      `/api/export/jobs/${jobId}/finalize`,
      {
        method: 'POST',
      },
      activeExport,
      'finalize',
    );

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

  private async fetchWithTracking(
    input: RequestInfo | URL,
    init: RequestInit,
    activeExport: ActiveExport,
    requestKind: ActiveExport['currentRequestKind'],
    allowAbort = true,
  ): Promise<Response> {
    const abortController = allowAbort ? new AbortController() : null;
    activeExport.currentRequestAbortController = abortController;
    activeExport.currentRequestKind = requestKind;

    try {
      return await this.fetchImpl(input, {
        ...init,
        ...(abortController ? { signal: abortController.signal } : {}),
      });
    } catch (error) {
      throw normalizeExportError(error, activeExport.cancelRequested);
    } finally {
      if (activeExport.currentRequestAbortController === abortController) {
        activeExport.currentRequestAbortController = null;
        activeExport.currentRequestKind = null;
      }
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

export function resolveExportSettings(overrides: Partial<ExportSettings> | undefined): ExportSettings {
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
  settings.fileName = settings.fileName.trim();

  if (!settings.fileName) {
    throw new Error('Export file name must not be empty.');
  }

  return settings;
}

function buildJobProgress(options: {
  completedFrames: number;
  completedUnitsBeforeJob: number;
  completedUnitsForJob: number;
  currentFileName: string;
  jobIndex: number;
  message: string;
  stage: ExportProgressStage;
  totalFrames: number;
  totalJobs: number;
  totalOverallUnits: number;
}): ExportProgress {
  const percent = options.totalOverallUnits > 0
    ? ((options.completedUnitsBeforeJob + options.completedUnitsForJob) / options.totalOverallUnits) * 100
    : 0;

  return {
    completedFrames: options.completedFrames,
    currentFileName: options.currentFileName,
    currentJobIndex: options.jobIndex + 1,
    message: options.message,
    percent,
    stage: options.stage,
    totalFrames: options.totalFrames,
    totalJobs: options.totalJobs,
  };
}

function createProgressReporter(
  onProgress: ((progress: ExportProgress) => void) | undefined,
): (progress: ExportProgress) => void {
  return progress => {
    onProgress?.({
      ...progress,
      percent: Math.max(0, Math.min(progress.percent, 100)),
    });
  };
}

function formatProgressMessage(
  totalJobs: number,
  jobNumber: number,
  fileName: string,
  message: string,
): string {
  if (totalJobs <= 1) {
    return message;
  }

  return `[${jobNumber}/${totalJobs}] ${fileName} · ${message}`;
}

function normalizeExportError(error: unknown, cancelRequested: boolean): Error {
  if (error instanceof ExportCancelledError) {
    return error;
  }

  if (cancelRequested && isAbortError(error)) {
    return new ExportCancelledError();
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Export failed.');
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : Boolean(error && typeof error === 'object' && 'name' in error && (error as { name?: string }).name === 'AbortError');
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
