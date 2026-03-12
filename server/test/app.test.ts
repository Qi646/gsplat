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
    vi.unstubAllEnvs();

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
      composePathPlan: overrides.composePathPlan ?? vi.fn(async () => ({
        segments: [
          {
            durationSeconds: 4,
            lookMode: 'look-at-subject',
            segmentType: 'arc',
            sweepDegrees: 120,
          },
        ],
        summary: 'Arc around the truck.',
      })),
      getStatus: overrides.getStatus ?? vi.fn<PathGenerationPlannerStatus>(() => ({
        available: true,
        capabilities: {
          includesActiveVerificationProbes: true,
          includesPlannerVerification: true,
          maxCaptureRounds: 2,
          maxSegments: 4,
          maxVerificationCaptures: 8,
          segmentTypes: ['hold', 'arc', 'dolly', 'pedestal', 'traverse'],
          supportedPathModes: ['subject-centric', 'route-following'],
          unsupportedPathModes: ['multi-subject', 'ambiguous'],
        },
        model: 'gpt-5-mini',
        plannerVersion: 'multistep-v2',
        reason: null,
      })),
      groundPathIntent: overrides.groundPathIntent ?? vi.fn(async () => ({
        intent: {
          continuousPath: true,
          orientationPreference: 'look-at-subject',
          pathMode: 'subject-centric',
          requestedMoveTypes: ['arc'],
          subjectHint: 'truck',
          targetDurationSeconds: 10,
          tone: 'cinematic',
        },
        pathMode: 'subject-centric',
        subjectLocalizations: [
          { captureId: 'capture-current', confidence: 0.96, pixelX: 320, pixelY: 240 },
          { captureId: 'capture-scout-1', confidence: 0.92, pixelX: 300, pixelY: 220 },
        ],
      })),
      verifyPathPlan: overrides.verifyPathPlan ?? vi.fn(async () => ({
        approved: true,
        issues: [],
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

  it('reflects arbitrary LAN origins by default outside production', async () => {
    const app = createTestApp();
    const lanOrigin = 'http://192.168.1.24:5173';

    const response = await request(app)
      .get('/api/health')
      .set('Origin', lanOrigin);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(lanOrigin);
    expect(response.headers.vary).toContain('Origin');
  });

  it('supports wildcard development CORS through CORS_ORIGIN=*', async () => {
    vi.stubEnv('CORS_ORIGIN', '*');
    const app = createTestApp();
    const lanOrigin = 'http://192.168.1.77:5173';

    const response = await request(app)
      .get('/api/health')
      .set('Origin', lanOrigin);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(lanOrigin);
  });

  it('supports comma-delimited CORS origin allowlists', async () => {
    vi.stubEnv('CORS_ORIGIN', 'http://localhost:5173, http://192.168.1.24:5173');
    const app = createTestApp();

    const allowedResponse = await request(app)
      .get('/api/health')
      .set('Origin', 'http://192.168.1.24:5173');

    expect(allowedResponse.status).toBe(200);
    expect(allowedResponse.headers['access-control-allow-origin']).toBe(
      'http://192.168.1.24:5173'
    );

    const deniedResponse = await request(app)
      .get('/api/health')
      .set('Origin', 'http://10.0.0.8:5173');

    expect(deniedResponse.status).toBe(200);
    expect(deniedResponse.headers['access-control-allow-origin']).toBeUndefined();
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

  it('returns a grounded path intent from the ground route', async () => {
    const pathPlanner = createPathPlanner({
      groundPathIntent: vi.fn(async requestBody => {
        expect(requestBody).toMatchObject({
          prompt: 'Orbit the truck and keep the camera on it.',
        });

        return {
          intent: {
            continuousPath: true,
            orientationPreference: 'look-at-subject',
            pathMode: 'subject-centric',
            requestedMoveTypes: ['arc', 'hold'],
            subjectHint: 'truck',
            targetDurationSeconds: 10,
            tone: 'cinematic',
          },
          pathMode: 'subject-centric',
          subjectLocalizations: [
            { captureId: 'capture-current', confidence: 0.96, pixelX: 320, pixelY: 240 },
            { captureId: 'capture-scout-1', confidence: 0.91, pixelX: 300, pixelY: 220 },
          ],
        };
      }),
    });
    const app = createTestApp({ pathPlanner });

    const response = await request(app)
      .post('/api/path/ground')
      .send(createPathGenerationGroundRequest());

    expect(response.status).toBe(200);
    expect(response.body.intent).toEqual({
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode: 'subject-centric',
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 10,
      tone: 'cinematic',
    });
  });

  it('returns a composed segment plan from the compose route', async () => {
    const pathPlanner = createPathPlanner({
      composePathPlan: vi.fn(async requestBody => {
        expect(requestBody).toMatchObject({
          intent: {
            pathMode: 'subject-centric',
          },
        });

        return {
          segments: [
            {
              durationSeconds: 4,
              lookMode: 'look-at-subject',
              segmentType: 'arc',
              sweepDegrees: 120,
            },
            {
              durationSeconds: 2,
              lookMode: 'look-at-subject',
              segmentType: 'hold',
            },
          ],
          summary: 'Arc around the truck, then hold.',
        };
      }),
    });
    const app = createTestApp({ pathPlanner });

    const response = await request(app)
      .post('/api/path/compose')
      .send(createPathGenerationComposeRequest());

    expect(response.status).toBe(200);
    expect(response.body.summary).toBe('Arc around the truck, then hold.');
    expect(response.body.segments).toHaveLength(2);
  });

  it('returns a planner verification response from the verify route', async () => {
    const pathPlanner = createPathPlanner({
      verifyPathPlan: vi.fn(async requestBody => {
        expect(requestBody).toMatchObject({
          draftControls: {
            holdPreference: 'linger',
            requestedDurationSeconds: 12,
          },
          prompt: 'Orbit the truck and end on a lingering hold.',
        });

        return {
          approved: false,
          issues: ['The ending hold is too short.'],
        };
      }),
    });
    const app = createTestApp({ pathPlanner });

    const response = await request(app)
      .post('/api/path/verify')
      .send(createPathGenerationVerifyRequest());

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      approved: false,
      issues: ['The ending hold is too short.'],
    });
  });

  it('returns planner availability from the path status route', async () => {
    const app = createTestApp({
      pathPlanner: createPathPlanner({
        getStatus: vi.fn(() => ({
          available: false,
          capabilities: {
            includesActiveVerificationProbes: true,
            includesPlannerVerification: true,
            maxCaptureRounds: 2,
            maxSegments: 4,
            maxVerificationCaptures: 8,
            segmentTypes: ['hold', 'arc', 'dolly', 'pedestal'],
            supportedPathModes: ['subject-centric'],
            unsupportedPathModes: ['route-following', 'multi-subject', 'ambiguous'],
          },
          model: 'gpt-5-mini',
          plannerVersion: 'multistep-v1',
          reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
        })),
      }),
    });

    const response = await request(app).get('/api/path/status');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      available: false,
      capabilities: {
        includesActiveVerificationProbes: true,
        includesPlannerVerification: true,
        maxCaptureRounds: 2,
        maxSegments: 4,
        maxVerificationCaptures: 8,
        segmentTypes: ['hold', 'arc', 'dolly', 'pedestal'],
        supportedPathModes: ['subject-centric'],
        unsupportedPathModes: ['route-following', 'multi-subject', 'ambiguous'],
      },
      model: 'gpt-5-mini',
      plannerVersion: 'multistep-v1',
      reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
    });
  });

  it('returns path-generation planner errors as ground-route errors', async () => {
    const app = createTestApp({
      pathPlanner: createPathPlanner({
        groundPathIntent: vi.fn(async () => {
          throw new PathGenerationError(400, 'The planner could not localize the truck.');
        }),
      }),
    });

    const response = await request(app)
      .post('/api/path/ground')
      .send(createPathGenerationGroundRequest());

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'The planner could not localize the truck.' });
  });

  it('returns path-generation planner errors as compose-route errors', async () => {
    const app = createTestApp({
      pathPlanner: createPathPlanner({
        composePathPlan: vi.fn(async () => {
          throw new PathGenerationError(400, 'Route-following prompts are not supported in v1.');
        }),
      }),
    });

    const response = await request(app)
      .post('/api/path/compose')
      .send(createPathGenerationComposeRequest());

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Route-following prompts are not supported in v1.' });
  });

  it('returns path-generation planner errors as verify-route errors', async () => {
    const app = createTestApp({
      pathPlanner: createPathPlanner({
        verifyPathPlan: vi.fn(async () => {
          throw new PathGenerationError(400, 'The draft dipped below the scene floor.');
        }),
      }),
    });

    const response = await request(app)
      .post('/api/path/verify')
      .send(createPathGenerationVerifyRequest());

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'The draft dipped below the scene floor.' });
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

function createPathGenerationGroundRequest() {
  return {
    captureRound: 1,
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

function createPathGenerationComposeRequest() {
  return {
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    groundedSubject: {
      anchor: { x: 0, y: 0.5, z: 0 },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 4,
      confidence: 0.84,
      meanResidual: 0.08,
      sceneScale: 8,
    },
    intent: {
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode: 'subject-centric',
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 10,
      tone: 'cinematic',
    },
    draftControls: {
      holdPreference: 'brief',
      requestedDurationSeconds: 10,
    },
    pathTail: null,
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
    validationFeedback: [],
  };
}

function createPathGenerationVerifyRequest() {
  return {
    captures: [
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 4, y: 1, z: 0 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        captureKind: 'draft-sample',
        height: 360,
        id: 'verify-sample-1',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        probeReason: 'overview',
        projectedSubject: {
          ndcX: 0.02,
          ndcY: -0.04,
          visible: true,
        },
        timeSeconds: 8,
        width: 640,
      },
    ],
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    draftControls: {
      holdPreference: 'linger',
      requestedDurationSeconds: 12,
    },
    groundedSubject: {
      anchor: { x: 0, y: 0.5, z: 0 },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 4,
      confidence: 0.84,
      meanResidual: 0.08,
      sceneScale: 8,
    },
    intent: {
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode: 'subject-centric',
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 12,
      tone: 'cinematic',
    },
    prompt: 'Orbit the truck and end on a lingering hold.',
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
    segments: [
      {
        direction: 'counterclockwise',
        durationSeconds: 8,
        lookMode: 'look-at-subject',
        segmentType: 'arc',
        sweepDegrees: 120,
      },
      {
        durationSeconds: 4,
        lookMode: 'look-at-subject',
        segmentType: 'hold',
      },
    ],
    summary: 'Orbit around the truck, then linger on the front badge.',
  };
}
