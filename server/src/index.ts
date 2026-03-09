import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDir = path.join(__dirname, '../public');
const clientIndexPath = path.join(clientBuildDir, 'index.html');
const port = Number.parseInt(process.env['PORT'] ?? '3001', 10);

const app = createApp({
  clientBuildDir,
  clientIndexPath,
});

app.listen(port, () => {
  console.log(`Gaussian Splat Server listening on http://localhost:${port}`);
});
