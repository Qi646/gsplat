import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CROSS_ORIGIN_ISOLATION_HEADERS, createApp, type PresetService } from '../src/app.js';
import { ExportServiceError, type ExportService } from '../src/exportService.js';
import {
  PathGenerationError,
  type PathGenerationPlanner,
  type PathGenerationPlannerStatus,
} from '../src/pathGeneration.js';

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

  function createPathPlanner(overrides: Partial<PathGenerationPlanner> = {}): PathGenerationPlanner {
    return {
      generatePathPlan: overrides.generatePathPlan ?? vi.fn(async () => ({
        shotSpec: {
          fullOrbit: false,
          orientationMode: 'look-at-subject',
          pathType: 'orbit',
        },
        subjectLocalizations: [
          { captureId: 'capture-current', confidence: 0.96, pixelX: 320, pixelY: 240 },
          { captureId: 'capture-scout-1', confidence: 0.92, pixelX: 300, pixelY: 220 },
        ],
      })),
      getStatus: overrides.getStatus ?? vi.fn<PathGenerationPlannerStatus>(() => ({
        available: true,
        model: 'gpt-4.1-mini',
        reason: null,
      })),
    };
  }

  function createTestApp(options: {
    exportService?: ExportService;
    pathPlanner?: PathGenerationPlanner;
    presetService?: PresetService;
    serveClientBuild?: boolean;
  } = {}) {
    return createApp({
      exportService: options.exportService ?? createExportService(),
      pathPlanner: options.pathPlanner ?? createPathPlanner(),
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
        hasPreset: vi.fn((presetId, extension) => presetId === 'garden' && extension === 'ksplat'),
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

  it('serves a cached ply preset route with cross-origin isolation headers', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-app-'));
    const presetPath = path.join(tempDir, 'luigi.ply');
    await writeFile(presetPath, Buffer.from('luigi-preset'));

    const app = createTestApp({
      presetService: createPresetService({
        getPresetFilePath: vi.fn(async () => presetPath),
        hasPreset: vi.fn((presetId, extension) => presetId === 'luigi' && extension === 'ply'),
      }),
    });

    const response = await request(app).get('/api/presets/luigi.ply');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(Buffer.from('luigi-preset'));
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
    expect(response.body).toEqual({ error: 'Unknown preset: unknown.ksplat' });
  });

  it('returns 404 for known preset ids requested with the wrong extension', async () => {
    const app = createTestApp({
      presetService: createPresetService({
        hasPreset: vi.fn((presetId, extension) => presetId === 'truck' && extension === 'ksplat'),
      }),
    });

    const response = await request(app).get('/api/presets/truck.ply');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Unknown preset: truck.ply' });
  });

  it('returns 502 when preset extraction fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const app = createTestApp({
      presetService: createPresetService({
        getPresetFilePath: vi.fn(async () => {
          throw new Error('boom');
        }),
        hasPreset: vi.fn((presetId, extension) => presetId === 'garden' && extension === 'ksplat'),
      }),
    });

    const response = await request(app).get('/api/presets/garden.ksplat');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Could not load preset: garden.ksplat' });
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

  it('returns a generated path plan from the planner route', async () => {
    const pathPlanner = createPathPlanner({
      generatePathPlan: vi.fn(async requestBody => {
        expect(requestBody).toMatchObject({
          prompt: 'Orbit the truck and keep the camera on it.',
        });

        return {
          shotSpec: {
            fullOrbit: true,
            orientationMode: 'look-at-subject',
            pathType: 'orbit',
          },
          subjectLocalizations: [
            { captureId: 'capture-current', confidence: 0.96, pixelX: 320, pixelY: 240 },
            { captureId: 'capture-scout-1', confidence: 0.91, pixelX: 300, pixelY: 220 },
          ],
        };
      }),
    });
    const app = createTestApp({ pathPlanner });

    const response = await request(app)
      .post('/api/path/generate')
      .send(createPathGenerationRequest());

    expect(response.status).toBe(200);
    expect(response.body.shotSpec).toEqual({
      fullOrbit: true,
      orientationMode: 'look-at-subject',
      pathType: 'orbit',
    });
  });

  it('returns planner availability from the path status route', async () => {
    const app = createTestApp({
      pathPlanner: createPathPlanner({
        getStatus: vi.fn(() => ({
          available: false,
          model: 'gpt-4.1-mini',
          reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
        })),
      }),
    });

    const response = await request(app).get('/api/path/status');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      available: false,
      model: 'gpt-4.1-mini',
      reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
    });
  });

  it('returns path-generation planner errors as route errors', async () => {
    const app = createTestApp({
      pathPlanner: createPathPlanner({
        generatePathPlan: vi.fn(async () => {
          throw new PathGenerationError(400, 'The planner could not localize the truck.');
        }),
      }),
    });

    const response = await request(app)
      .post('/api/path/generate')
      .send(createPathGenerationRequest());

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'The planner could not localize the truck.' });
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

function createPathGenerationRequest() {
  return {
    captures: [
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 4, y: 1, z: 0 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        height: 360,
        id: 'capture-current',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        role: 'current',
        width: 640,
      },
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 0, y: 1, z: 4 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        height: 360,
        id: 'capture-scout-1',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        role: 'scout',
        width: 640,
      },
    ],
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    pathTail: null,
    prompt: 'Orbit the truck and keep the camera on it.',
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
  };
}
