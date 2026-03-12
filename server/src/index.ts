import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDir = path.join(__dirname, '../public');
const clientIndexPath = path.join(clientBuildDir, 'index.html');
const host = normalizeOptionalEnv(process.env['HOST']);
const port = Number.parseInt(process.env['PORT'] ?? '3001', 10);

const app = createApp({
  clientBuildDir,
  clientIndexPath,
});

if (host) {
  app.listen(port, host, () => {
    console.log(`Gaussian Splat Server listening on http://${host}:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Gaussian Splat Server listening on port ${port} (all interfaces).`);
  });
}

function normalizeOptionalEnv(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}
