import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDir = path.join(__dirname, '../public');
const clientIndexPath = path.join(clientBuildDir, 'index.html');
const port = Number.parseInt(process.env['PORT'] ?? '3001', 10);

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

if (existsSync(clientIndexPath)) {
  app.use(express.static(clientBuildDir));

  app.get('*', (_request, response) => {
    response.sendFile(clientIndexPath);
  });
} else {
  app.get('/', (_request, response) => {
    response.type('text/plain').send('Client build not found. Run `npm run dev` or `npm run build`.');
  });
}

app.listen(port, () => {
  console.log(`Gaussian Splat Server listening on http://localhost:${port}`);
});
