import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CROSS_ORIGIN_ISOLATION_HEADERS, createApp, type PresetService } from '../src/app.js';

describe('createApp', () => {
  let tempDir: string | null = null;

  afterEach(async () => {
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

  it('returns cross-origin isolation headers on the root route', async () => {
    const app = createApp({ presetService: createPresetService(), serveClientBuild: false });
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
    const app = createApp({ presetService: createPresetService(), serveClientBuild: false });
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

    const app = createApp({
      presetService: createPresetService({
        getPresetFilePath: vi.fn(async () => presetPath),
        hasPreset: vi.fn(presetId => presetId === 'garden'),
      }),
      serveClientBuild: false,
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
    const app = createApp({
      presetService: createPresetService(),
      serveClientBuild: false,
    });

    const response = await request(app).get('/api/presets/unknown.ksplat');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Unknown preset: unknown' });
  });

  it('returns 502 when preset extraction fails', async () => {
    const app = createApp({
      presetService: createPresetService({
        getPresetFilePath: vi.fn(async () => {
          throw new Error('boom');
        }),
        hasPreset: vi.fn(() => true),
      }),
      serveClientBuild: false,
    });

    const response = await request(app).get('/api/presets/garden.ksplat');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Could not load preset: garden' });
  });
});
