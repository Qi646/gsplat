import { existsSync, writeFileSync } from 'node:fs';
import type { ChildProcessByStdio } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it } from 'vitest';
import {
  ExportServiceError,
  FfmpegExportService,
  buildFfmpegArgs,
  type ExportJobSettings,
} from '../src/exportService.js';

class FakeChildProcess extends EventEmitter {
  readonly stdin = new PassThrough();
  readonly stderr = new PassThrough();
  killSignal: NodeJS.Signals | number | null = null;

  kill(signal?: NodeJS.Signals | number): boolean {
    this.killSignal = signal ?? 'SIGTERM';
    queueMicrotask(() => {
      this.emit('exit', null, this.killSignal);
    });
    return true;
  }
}

describe('exportService', () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { force: true, recursive: true });
      tempDir = null;
    }
  });

  it('builds FFmpeg args for PNG image2pipe encoding', () => {
    expect(buildFfmpegArgs({ fps: 30, height: 720, width: 1280 }, '/tmp/output.mp4')).toEqual([
      '-y',
      '-loglevel',
      'error',
      '-f',
      'image2pipe',
      '-vcodec',
      'png',
      '-framerate',
      '30',
      '-i',
      'pipe:0',
      '-an',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '/tmp/output.mp4',
    ]);
  });

  it('returns 503 when FFmpeg cannot be started', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-export-test-'));
    const service = new FfmpegExportService({
      spawnProcess: () => {
        const child = new FakeChildProcess();
        queueMicrotask(() => {
          child.emit('error', new Error('spawn ENOENT'));
        });
        return asChildProcess(child);
      },
      tempRootDir: tempDir,
    });

    await expect(service.createJob({ fps: 30, height: 720, width: 1280 })).rejects.toThrow(
      'Could not start FFmpeg: spawn ENOENT',
    );
  });

  it('encodes a finalized job into output.mp4 and cleans the temp directory', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-export-test-'));
    let outputPath = '';
    const service = new FfmpegExportService({
      spawnProcess: (_command, args) => {
        outputPath = args.at(-1) ?? '';
        const child = new FakeChildProcess();
        child.stdin.on('finish', () => {
          writeFileSync(outputPath, Buffer.from('mp4-output'));
          child.emit('exit', 0, null);
        });
        queueMicrotask(() => {
          child.emit('spawn');
        });
        return asChildProcess(child);
      },
      tempRootDir: tempDir,
    });
    const pngFrame = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

    const { jobId } = await service.createJob({ fps: 30, height: 720, width: 1280 });
    await service.appendFrame(jobId, pngFrame);
    const video = await service.finalizeJob(jobId);

    expect(video).toEqual(Buffer.from('mp4-output'));
    expect(existsSync(path.dirname(outputPath))).toBe(false);
  });

  it('rejects non-PNG frame uploads with 400', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-export-test-'));
    const service = createStartedService(tempDir);
    const { jobId } = await service.createJob({ fps: 24, height: 720, width: 1280 });

    await expect(service.appendFrame(jobId, Buffer.from('not-a-png'))).rejects.toMatchObject({
      message: 'Export frames must be PNG images.',
      statusCode: 400,
    });
  });

  it('returns 502 when FFmpeg exits non-zero during finalize', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-export-test-'));
    const service = new FfmpegExportService({
      spawnProcess: (_command, args) => {
        const outputPath = args.at(-1) ?? '';
        const child = new FakeChildProcess();
        child.stdin.on('finish', () => {
          writeFileSync(outputPath, Buffer.from('partial-output'));
          child.stderr.write('encode failed');
          child.emit('exit', 1, null);
        });
        queueMicrotask(() => {
          child.emit('spawn');
        });
        return asChildProcess(child);
      },
      tempRootDir: tempDir,
    });
    const { jobId } = await service.createJob({ fps: 24, height: 720, width: 1280 });
    const pngFrame = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    await service.appendFrame(jobId, pngFrame);

    await expect(service.finalizeJob(jobId)).rejects.toMatchObject<Partial<ExportServiceError>>({
      message: 'FFmpeg exited with code 1. encode failed',
      statusCode: 502,
    });
  });
});

function createStartedService(tempRootDir: string): FfmpegExportService {
  return new FfmpegExportService({
    spawnProcess: (_command, args) => {
      const outputPath = args.at(-1) ?? '';
      const child = new FakeChildProcess();
      child.stdin.on('finish', () => {
        writeFileSync(outputPath, Buffer.from('mp4-output'));
        child.emit('exit', 0, null);
      });
      queueMicrotask(() => {
        child.emit('spawn');
      });
      return asChildProcess(child);
    },
    tempRootDir,
  });
}

function asChildProcess(
  child: FakeChildProcess,
): ChildProcessByStdio<PassThrough, null, PassThrough> {
  return child as unknown as ChildProcessByStdio<PassThrough, null, PassThrough>;
}
