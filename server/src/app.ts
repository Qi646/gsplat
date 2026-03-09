import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';

export interface AppOptions {
  clientBuildDir: string;
  clientIndexPath: string;
  corsOrigin: string;
  serveClientBuild: boolean;
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
  const serveClientBuild = options.serveClientBuild ?? existsSync(clientIndexPath);

  app.use(applyCrossOriginIsolationHeaders);
  app.use(cors({ origin: corsOrigin }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
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
