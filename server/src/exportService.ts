import { randomUUID } from 'node:crypto';
import type { ChildProcessByStdio } from 'node:child_process';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Readable, Writable } from 'node:stream';

export interface ExportJobSettings {
  fps: number;
  height: number;
  width: number;
}

export interface ExportJobHandle {
  jobId: string;
}

export interface ExportService {
  appendFrame(jobId: string, frameData: Buffer): Promise<void>;
  cancelJob(jobId: string): Promise<void>;
  createJob(settings: ExportJobSettings): Promise<ExportJobHandle>;
  finalizeJob(jobId: string): Promise<Buffer>;
}

export class ExportServiceError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ExportServiceError';
    this.statusCode = statusCode;
  }
}

export interface FfmpegExportServiceOptions {
  ffmpegPath?: string;
  spawnProcess?: SpawnProcess;
  tempRootDir?: string;
}

type ExitResult = {
  code: number | null;
  signal: NodeJS.Signals | null;
};

type SpawnProcess = (
  command: string,
  args: string[],
) => SpawnedFfmpegProcess;

type SpawnedFfmpegProcess = ChildProcessByStdio<Writable, null, Readable>;

interface ExportJob {
  child: SpawnedFfmpegProcess;
  exitPromise: Promise<ExitResult>;
  exitResult: ExitResult | null;
  finalized: boolean;
  outputPath: string;
  processError: Error | null;
  stderrChunks: string[];
  stdinClosed: boolean;
  tempDir: string;
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export class FfmpegExportService implements ExportService {
  private readonly ffmpegPath: string;
  private readonly jobs = new Map<string, ExportJob>();
  private readonly spawnProcess: SpawnProcess;
  private readonly tempRootDir: string;

  constructor(options: FfmpegExportServiceOptions = {}) {
    this.ffmpegPath = options.ffmpegPath ?? 'ffmpeg';
    this.spawnProcess =
      options.spawnProcess ??
      ((command, args) =>
        spawn(command, args, {
          stdio: ['pipe', 'ignore', 'pipe'],
        }));
    this.tempRootDir = options.tempRootDir ?? tmpdir();
  }

  async createJob(settings: ExportJobSettings): Promise<ExportJobHandle> {
    validateExportSettings(settings);

    const tempDir = await mkdtemp(path.join(this.tempRootDir, 'gsplat-export-'));
    const outputPath = path.join(tempDir, 'output.mp4');
    const child = this.spawnProcess(this.ffmpegPath, buildFfmpegArgs(settings, outputPath));
    const exitPromise = createExitPromise(child);
    const job: ExportJob = {
      child,
      exitPromise,
      exitResult: null,
      finalized: false,
      outputPath,
      processError: null,
      stderrChunks: [],
      stdinClosed: false,
      tempDir,
    };

    child.stderr.on('data', chunk => {
      const text = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
      job.stderrChunks.push(text);
      if (job.stderrChunks.join('').length > 4000) {
        job.stderrChunks.splice(0, job.stderrChunks.length - 8);
      }
    });

    child.on('error', error => {
      job.processError = error;
    });

    exitPromise.then(exitResult => {
      job.exitResult = exitResult;
    });

    try {
      await waitForSpawn(child);
    } catch (error) {
      child.kill('SIGKILL');
      await rm(tempDir, { force: true, recursive: true });
      throw new ExportServiceError(
        503,
        `Could not start FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    const jobId = randomUUID();
    this.jobs.set(jobId, job);
    return { jobId };
  }

  async appendFrame(jobId: string, frameData: Buffer): Promise<void> {
    const job = this.requireJob(jobId);
    if (!isPngBuffer(frameData)) {
      throw new ExportServiceError(400, 'Export frames must be PNG images.');
    }

    this.throwIfJobUnavailable(job);

    try {
      const didWrite = job.child.stdin.write(frameData);
      if (!didWrite) {
        await Promise.race([
          once(job.child.stdin, 'drain'),
          job.exitPromise.then(() => {
            throw new Error('FFmpeg exited before accepting the next frame.');
          }),
        ]);
      }
    } catch (error) {
      this.throwIfJobUnavailable(job);
      throw new ExportServiceError(
        502,
        `Could not write frame to FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    this.throwIfJobUnavailable(job);
  }

  async finalizeJob(jobId: string): Promise<Buffer> {
    const job = this.requireJob(jobId);
    if (job.finalized) {
      throw new ExportServiceError(400, 'Export job has already been finalized.');
    }

    this.throwIfJobUnavailable(job);
    job.finalized = true;

    if (!job.stdinClosed) {
      job.child.stdin.end();
      job.stdinClosed = true;
    }

    const exitResult = await job.exitPromise;
    job.exitResult = exitResult;

    try {
      if (job.processError) {
        throw new ExportServiceError(503, `FFmpeg is unavailable: ${job.processError.message}`);
      }

      if (exitResult.code !== 0 || exitResult.signal) {
        throw new ExportServiceError(502, buildFailureMessage(job));
      }

      return await readFile(job.outputPath);
    } catch (error) {
      if (error instanceof ExportServiceError) {
        throw error;
      }

      throw new ExportServiceError(
        502,
        `FFmpeg did not produce output.mp4: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      await this.cleanupJob(jobId);
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = this.requireJob(jobId);

    if (!job.stdinClosed) {
      job.child.stdin.destroy();
      job.stdinClosed = true;
    }

    job.child.kill('SIGKILL');
    await job.exitPromise.catch(() => undefined);
    await this.cleanupJob(jobId);
  }

  private requireJob(jobId: string): ExportJob {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new ExportServiceError(404, `Unknown export job: ${jobId}`);
    }

    return job;
  }

  private async cleanupJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }

    this.jobs.delete(jobId);
    await rm(job.tempDir, { force: true, recursive: true });
  }

  private throwIfJobUnavailable(job: ExportJob): void {
    if (job.processError) {
      throw new ExportServiceError(503, `FFmpeg is unavailable: ${job.processError.message}`);
    }

    if (!job.exitResult) {
      return;
    }

    if (job.exitResult.code === 0 && !job.exitResult.signal) {
      throw new ExportServiceError(400, 'Export job is already complete.');
    }

    throw new ExportServiceError(502, buildFailureMessage(job));
  }
}

export function buildFfmpegArgs(settings: ExportJobSettings, outputPath: string): string[] {
  return [
    '-y',
    '-loglevel',
    'error',
    '-f',
    'image2pipe',
    '-vcodec',
    'png',
    '-framerate',
    String(settings.fps),
    '-i',
    'pipe:0',
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    outputPath,
  ];
}

function validateExportSettings(settings: ExportJobSettings): void {
  for (const [label, value] of Object.entries(settings)) {
    if (!Number.isFinite(value) || value <= 0 || !Number.isInteger(value)) {
      throw new ExportServiceError(400, `Export ${label} must be a positive integer.`);
    }
  }
}

function waitForSpawn(child: SpawnedFfmpegProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    const handleSpawn = () => {
      cleanup();
      resolve();
    };
    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      child.off('spawn', handleSpawn);
      child.off('error', handleError);
    };

    child.once('spawn', handleSpawn);
    child.once('error', handleError);
  });
}

function createExitPromise(child: SpawnedFfmpegProcess): Promise<ExitResult> {
  return new Promise(resolve => {
    child.once('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

function isPngBuffer(buffer: Buffer): boolean {
  return buffer.length >= PNG_SIGNATURE.length && buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
}

function buildFailureMessage(job: ExportJob): string {
  const stderr = job.stderrChunks.join('').trim();
  const detail = stderr ? ` ${stderr.slice(-400)}` : '';

  if (job.exitResult?.signal) {
    return `FFmpeg was terminated by signal ${job.exitResult.signal}.${detail}`.trim();
  }

  return `FFmpeg exited with code ${job.exitResult?.code ?? 'unknown'}.${detail}`.trim();
}
