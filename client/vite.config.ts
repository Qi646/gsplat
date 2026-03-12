/// <reference types="vitest/config" />

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const viteHost = normalizeOptionalEnv(env['VITE_HOST']);
  const vitePort = parsePort(env['VITE_PORT'], 5173);
  const apiProxyTarget =
    normalizeOptionalEnv(env['VITE_API_PROXY_TARGET']) ?? 'http://127.0.0.1:3001';

  return {
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      host: viteHost,
      port: vitePort,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      host: viteHost,
    },
    optimizeDeps: {
      exclude: ['@mkkellogg/gaussian-splats-3d', '@sparkjsdev/spark'],
    },
    build: {
      outDir: '../server/public',
      emptyOutDir: true,
    },
    test: {
      environment: 'node',
      include: ['src/__tests__/**/*.test.ts'],
    },
  };
});

function normalizeOptionalEnv(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
