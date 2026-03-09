/**
 * server/src/index.ts
 * Express server — serves static client build, handles export API.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { exportRouter } from './routes/export.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '20mb' }));  // Frames can be large

// Serve export files
app.use('/exports', express.static(path.join(__dirname, '../../exports')));

// Export API
app.use('/api/export', exportRouter);

// Serve client build (for production)
const clientBuild = path.join(__dirname, '../../public');
app.use(express.static(clientBuild));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎬 Gaussian Splat Server`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/export\n`);
});
