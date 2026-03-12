import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  ExportServiceError,
  FfmpegExportService,
  type ExportJobSettings,
  type ExportService,
} from './exportService.js';
import {
  OpenAIVisionPathPlanner,
  PathGenerationError,
  type PathGenerationPlanner,
} from './pathGeneration.js';
import { PresetArchiveService, formatPresetRequestId } from './presetArchive.js';

export interface AppOptions {
  clientBuildDir: string;
  clientIndexPath: string;
  corsOrigin: string;
  exportService: ExportService;
  pathPlanner: PathGenerationPlanner;
  presetService: PresetService;
  serveClientBuild: boolean;
}

export interface PresetService {
  getPresetFilePath: (presetId: string, extension: string) => Promise<string>;
  hasPreset: (presetId: string, extension: string) => boolean;
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
  const exportService = options.exportService ?? new FfmpegExportService();
  const pathPlanner = options.pathPlanner ?? new OpenAIVisionPathPlanner();
  const presetService = options.presetService ?? new PresetArchiveService();
  const serveClientBuild = options.serveClientBuild ?? existsSync(clientIndexPath);

  app.use(applyCrossOriginIsolationHeaders);
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '12mb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.get('/api/path/status', (_request, response) => {
    response.json(pathPlanner.getStatus());
  });

  app.get('/api/presets/:presetId.:extension', async (request, response) => {
    const presetId = request.params['presetId'] ?? '';
    const extension = request.params['extension'] ?? '';
    const presetRequestId = formatPresetRequestId(presetId, extension);

    if (!presetService.hasPreset(presetId, extension)) {
      response.status(404).json({ error: `Unknown preset: ${presetRequestId}` });
      return;
    }

    try {
      const presetPath = await presetService.getPresetFilePath(presetId, extension);
      const presetData = await readFile(presetPath);
      response
        .set('Cache-Control', 'public, max-age=3600')
        .type('application/octet-stream')
        .send(presetData);
    } catch (error) {
      console.error(`Failed to serve preset "${presetRequestId}"`, error);
      response.status(502).json({ error: `Could not load preset: ${presetRequestId}` });
    }
  });

  app.post('/api/path/ground', async (request, response) => {
    try {
      const groundResponse = await pathPlanner.groundPathIntent(request.body);
      response.status(200).json(groundResponse);
    } catch (error) {
      sendPathGenerationError(response, error, 'Could not ground camera path intent.');
    }
  });

  app.post('/api/path/compose', async (request, response) => {
    try {
      const composeResponse = await pathPlanner.composePathPlan(request.body);
      response.status(200).json(composeResponse);
    } catch (error) {
      sendPathGenerationError(response, error, 'Could not compose camera path.');
    }
  });

  app.post('/api/path/verify', async (request, response) => {
    try {
      const verifyResponse = await pathPlanner.verifyPathPlan(request.body);
      response.status(200).json(verifyResponse);
    } catch (error) {
      sendPathGenerationError(response, error, 'Could not verify camera path.');
    }
  });

  app.post('/api/export/jobs', async (request, response) => {
    try {
      const settings = request.body as Partial<ExportJobSettings> | undefined;
      const job = await exportService.createJob({
        fps: Number(settings?.fps),
        height: Number(settings?.height),
        width: Number(settings?.width),
      });
      response.status(201).json(job);
    } catch (error) {
      sendExportError(response, error, 'Could not start export job.');
    }
  });

  app.post(
    '/api/export/jobs/:jobId/frame',
    express.raw({ limit: '20mb', type: 'image/png' }),
    async (request, response) => {
      const { jobId = '' } = request.params;
      if (!Buffer.isBuffer(request.body)) {
        response.status(400).json({ error: 'Export frame body must be PNG image bytes.' });
        return;
      }

      try {
        await exportService.appendFrame(jobId, request.body);
        response.status(204).end();
      } catch (error) {
        sendExportError(response, error, 'Could not append export frame.');
      }
    },
  );

  app.post('/api/export/jobs/:jobId/finalize', async (request, response) => {
    const { jobId = '' } = request.params;

    try {
      const video = await exportService.finalizeJob(jobId);
      response
        .set('Cache-Control', 'no-store')
        .set('Content-Disposition', 'attachment; filename="output.mp4"')
        .type('video/mp4')
        .send(video);
    } catch (error) {
      sendExportError(response, error, 'Could not finalize export.');
    }
  });

  app.delete('/api/export/jobs/:jobId', async (request, response) => {
    const { jobId = '' } = request.params;

    try {
      await exportService.cancelJob(jobId);
      response.status(204).end();
    } catch (error) {
      sendExportError(response, error, 'Could not cancel export.');
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

function sendExportError(
  response: express.Response,
  error: unknown,
  fallbackMessage: string,
): void {
  if (error instanceof ExportServiceError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error(fallbackMessage, error);
  response.status(502).json({ error: fallbackMessage });
}

function sendPathGenerationError(
  response: express.Response,
  error: unknown,
  fallbackMessage: string,
): void {
  if (error instanceof PathGenerationError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error(fallbackMessage, error);
  response.status(502).json({ error: fallbackMessage });
}
