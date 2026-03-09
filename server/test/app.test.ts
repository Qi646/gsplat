import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CROSS_ORIGIN_ISOLATION_HEADERS, createApp, type PresetService } from '../src/app.js';
import { ExportServiceError, type ExportService } from '../src/exportService.js';

describe('createApp', () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    vi.restoreAllMocks();

    if (tempDir) {
      await rm(tempDir, { force: true, recursive: true });
      tempDir = null;
    }
  });

  function createPresetService(overrides: Partial<PresetService> = {}): PresetService {
    return {
      getPresetFilePath: overrides.getPresetFilePath ?? vi.fn(async () => ''),
      hasPreset: overrides.hasPreset ?? vi.fn(() => false),
    };
  }

  function createExportService(overrides: Partial<ExportService> = {}): ExportService {
    return {
      appendFrame: overrides.appendFrame ?? vi.fn(async () => {}),
      cancelJob: overrides.cancelJob ?? vi.fn(async () => {}),
      createJob: overrides.createJob ?? vi.fn(async () => ({ jobId: 'job-1' })),
      finalizeJob: overrides.finalizeJob ?? vi.fn(async () => Buffer.from('output-mp4')),
    };
  }

  function createTestApp(options: {
    exportService?: ExportService;
    presetService?: PresetService;
    serveClientBuild?: boolean;
  } = {}) {
    return createApp({
      exportService: options.exportService ?? createExportService(),
      presetService: options.presetService ?? createPresetService(),
      serveClientBuild: options.serveClientBuild ?? false,
    });
  }

  it('returns cross-origin isolation headers on the root route', async () => {
    const app = createTestApp();
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['cross-origin-embedder-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Embedder-Policy']
    );
    expect(response.headers['cross-origin-opener-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Opener-Policy']
    );
  });

  it('returns cross-origin isolation headers on the health route', async () => {
    const app = createTestApp();
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(response.headers['cross-origin-embedder-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Embedder-Policy']
    );
    expect(response.headers['cross-origin-opener-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Opener-Policy']
    );
  });

  it('serves a verified preset route with cross-origin isolation headers', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-app-'));
    const presetPath = path.join(tempDir, 'garden.ksplat');
    await writeFile(presetPath, Buffer.from('verified-preset'));

    const app = createTestApp({
      presetService: createPresetService({
        getPresetFilePath: vi.fn(async () => presetPath),
        hasPreset: vi.fn(presetId => presetId === 'garden'),
      }),
    });

    const response = await request(app).get('/api/presets/garden.ksplat');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(Buffer.from('verified-preset'));
    expect(response.headers['cross-origin-embedder-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Embedder-Policy']
    );
    expect(response.headers['cross-origin-opener-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Opener-Policy']
    );
  });

  it('returns 404 for unknown presets', async () => {
    const app = createTestApp();

    const response = await request(app).get('/api/presets/unknown.ksplat');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Unknown preset: unknown' });
  });

  it('returns 502 when preset extraction fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const app = createTestApp({
      presetService: createPresetService({
        getPresetFilePath: vi.fn(async () => {
          throw new Error('boom');
        }),
        hasPreset: vi.fn(() => true),
      }),
    });

    const response = await request(app).get('/api/presets/garden.ksplat');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Could not load preset: garden' });
  });

  it('creates an export job from JSON settings', async () => {
    const exportService = createExportService({
      createJob: vi.fn(async settings => {
        expect(settings).toEqual({ fps: 30, height: 720, width: 1280 });
        return { jobId: 'job-42' };
      }),
    });
    const app = createTestApp({ exportService });

    const response = await request(app)
      .post('/api/export/jobs')
      .send({ fps: 30, height: 720, width: 1280 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ jobId: 'job-42' });
    expect(response.headers['cross-origin-embedder-policy']).toBe(
      CROSS_ORIGIN_ISOLATION_HEADERS['Cross-Origin-Embedder-Policy']
    );
  });

  it('accepts PNG frame uploads for an active export job', async () => {
    const exportService = createExportService();
    const app = createTestApp({ exportService });
    const pngFrame = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

    const response = await request(app)
      .post('/api/export/jobs/job-1/frame')
      .set('Content-Type', 'image/png')
      .send(pngFrame);

    expect(response.status).toBe(204);
    expect(exportService.appendFrame).toHaveBeenCalledWith('job-1', pngFrame);
  });

  it('returns mp4 bytes when finalizing an export job', async () => {
    const exportService = createExportService({
      finalizeJob: vi.fn(async () => Buffer.from('encoded-mp4')),
    });
    const app = createTestApp({ exportService });

    const response = await request(app)
      .post('/api/export/jobs/job-9/finalize')
      .buffer(true)
      .parse(binaryParser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(Buffer.from('encoded-mp4'));
    expect(response.headers['content-type']).toContain('video/mp4');
    expect(response.headers['content-disposition']).toContain('output.mp4');
  });

  it('returns export service errors from export routes', async () => {
    const exportService = createExportService({
      cancelJob: vi.fn(async () => {
        throw new ExportServiceError(404, 'Unknown export job: missing');
      }),
    });
    const app = createTestApp({ exportService });

    const response = await request(app).delete('/api/export/jobs/missing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Unknown export job: missing' });
  });
});

function binaryParser(
  response: NodeJS.ReadableStream,
  callback: (error: Error | null, body?: Buffer) => void,
): void {
  response.setEncoding('binary');
  let data = '';
  response.on('data', chunk => {
    data += chunk;
  });
  response.on('end', () => {
    callback(null, Buffer.from(data, 'binary'));
  });
}
