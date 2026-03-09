import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { CROSS_ORIGIN_ISOLATION_HEADERS, createApp } from '../src/app.js';

describe('createApp', () => {
  const app = createApp({ serveClientBuild: false });

  it('returns cross-origin isolation headers on the root route', async () => {
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
});
