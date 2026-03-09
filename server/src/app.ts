import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PresetArchiveService } from './presetArchive.js';

export interface AppOptions {
  clientBuildDir: string;
  clientIndexPath: string;
  corsOrigin: string;
  presetService: PresetService;
  serveClientBuild: boolean;
}

export interface PresetService {
  getPresetFilePath: (presetId: string) => Promise<string>;
  hasPreset: (presetId: string) => boolean;
}

export const CROSS_ORIGIN_ISOLATION_HEADERS = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
} as const;

export function applyCrossOriginIsolationHeaders(
  _request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void {
  response.set(CROSS_ORIGIN_ISOLATION_HEADERS);
  next();
}

export function createApp(options: Partial<AppOptions> = {}): express.Express {
  const app = express();
  const clientBuildDir = options.clientBuildDir ?? path.join(process.cwd(), 'public');
  const clientIndexPath = options.clientIndexPath ?? path.join(clientBuildDir, 'index.html');
  const corsOrigin = options.corsOrigin ?? 'http://localhost:5173';
  const presetService = options.presetService ?? new PresetArchiveService();
  const serveClientBuild = options.serveClientBuild ?? existsSync(clientIndexPath);

  app.use(applyCrossOriginIsolationHeaders);
  app.use(cors({ origin: corsOrigin }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.get('/api/presets/:presetId.ksplat', async (request, response) => {
    const presetId = request.params['presetId'] ?? '';

    if (!presetService.hasPreset(presetId)) {
      response.status(404).json({ error: `Unknown preset: ${presetId}` });
      return;
    }

    try {
      const presetPath = await presetService.getPresetFilePath(presetId);
      const presetData = await readFile(presetPath);
      response
        .set('Cache-Control', 'public, max-age=3600')
        .type('application/octet-stream')
        .send(presetData);
    } catch (error) {
      console.error(`Failed to serve preset "${presetId}"`, error);
      response.status(502).json({ error: `Could not load preset: ${presetId}` });
    }
  });

  if (serveClientBuild) {
    app.use(express.static(clientBuildDir));

    app.get('*', (_request, response) => {
      response.sendFile(clientIndexPath);
    });
  } else {
    app.get('/', (_request, response) => {
      response.type('text/plain').send('Client build not found. Run `npm run dev` or `npm run build`.');
    });
  }

  return app;
}
