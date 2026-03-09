/**
 * server/src/routes/export.ts
 * Handles the full export lifecycle:
 *   POST /start   → spawn FFmpeg session, return sessionId
 *   POST /frame   → receive base64 PNG, write to FFmpeg stdin
 *   POST /finish/:id → close FFmpeg stdin, wait for completion
 *   POST /cancel/:id → kill FFmpeg process
 *   GET  /download/:id → stream the output MP4
 */

import { Router, Request, Response } from 'express';
import { spawn, ChildProcess } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORTS_DIR = path.join(__dirname, '../../../exports');

// Ensure exports directory exists
fs.mkdirSync(EXPORTS_DIR, { recursive: true });

// ─── Types ────────────────────────────────────────────────────────────────────

type Quality = 'draft' | 'med' | 'high';

interface ExportSession {
  id: string;
  ffmpegProcess: ChildProcess;
  outputPath: string;
  totalFrames: number;
  framesReceived: number;
  status: 'running' | 'complete' | 'cancelled' | 'error';
  finishPromise?: Promise<void>;
  finishResolve?: () => void;
  finishReject?: (err: Error) => void;
  error?: string;
}

// In-memory session store (replace with Redis for production)
const sessions = new Map<string, ExportSession>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCRF(quality: Quality): number {
  const map: Record<Quality, number> = { high: 18, med: 23, draft: 30 };
  return map[quality] ?? 23;
}

function spawnFFmpeg(outputPath: string, width: number, height: number, fps: number, crf: number): ChildProcess {
  // Ensure even dimensions (H.264 requirement)
  const w = width % 2 === 0 ? width : width - 1;
  const h = height % 2 === 0 ? height : height - 1;

  const args = [
    '-y',                          // overwrite output
    '-f', 'image2pipe',            // input from pipe
    '-vcodec', 'png',              // input frames are PNG
    '-r', String(fps),             // input framerate
    '-i', 'pipe:0',                // stdin

    '-vf', `scale=${w}:${h}`,      // ensure even dimensions
    '-vcodec', 'libx264',          // H.264 output
    '-pix_fmt', 'yuv420p',         // QuickTime/VLC compatible
    '-crf', String(crf),           // quality
    '-preset', 'medium',           // encoding speed/quality tradeoff
    '-movflags', '+faststart',     // moov atom at front for streaming
    '-an',                         // no audio

    outputPath,
  ];

  const proc = spawn('ffmpeg', args, {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // Log FFmpeg stderr in debug mode
  proc.stderr?.on('data', (chunk: Buffer) => {
    if (process.env['DEBUG_FFMPEG']) {
      process.stderr.write(`[ffmpeg] ${chunk.toString()}`);
    }
  });

  proc.on('error', (err) => {
    console.error(`[ffmpeg] spawn error: ${err.message}`);
    console.error('Make sure FFmpeg is installed: brew install ffmpeg / apt install ffmpeg');
  });

  return proc;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export const exportRouter = Router();

/**
 * POST /api/export/start
 * Body: { width, height, fps, frameCount, quality }
 * Returns: { sessionId }
 */
exportRouter.post('/start', (req: Request, res: Response) => {
  const { width, height, fps, frameCount, quality } = req.body as {
    width: number;
    height: number;
    fps: number;
    frameCount: number;
    quality: Quality;
  };

  if (!width || !height || !fps || !frameCount) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const sessionId = uuidv4();
  const outputPath = path.join(EXPORTS_DIR, `${sessionId}.mp4`);
  const crf = getCRF(quality);

  let proc: ChildProcess;
  try {
    proc = spawnFFmpeg(outputPath, width, height, fps, crf);
  } catch (err) {
    res.status(500).json({ error: `Failed to spawn FFmpeg: ${(err as Error).message}` });
    return;
  }

  // Set up finish promise so POST /finish can await FFmpeg completion
  let finishResolve: () => void;
  let finishReject: (err: Error) => void;
  const finishPromise = new Promise<void>((res, rej) => {
    finishResolve = res;
    finishReject = rej;
  });

  proc.on('close', (code) => {
    const session = sessions.get(sessionId);
    if (!session) return;
    if (code === 0) {
      session.status = 'complete';
      finishResolve!();
    } else if (session.status !== 'cancelled') {
      session.status = 'error';
      session.error = `FFmpeg exited with code ${code}`;
      finishReject!(new Error(session.error));
    }
  });

  const session: ExportSession = {
    id: sessionId,
    ffmpegProcess: proc,
    outputPath,
    totalFrames: frameCount,
    framesReceived: 0,
    status: 'running',
    finishPromise,
    finishResolve: finishResolve!,
    finishReject: finishReject!,
  };
  sessions.set(sessionId, session);

  console.log(`[export] Session ${sessionId} started (${width}×${height} @ ${fps}fps, ${frameCount} frames, CRF ${crf})`);
  res.json({ sessionId });
});

/**
 * POST /api/export/frame
 * Body: { sessionId, frameIndex, data: base64PNG }
 */
exportRouter.post('/frame', (req: Request, res: Response) => {
  const { sessionId, frameIndex, data } = req.body as {
    sessionId: string;
    frameIndex: number;
    data: string;
  };

  const session = sessions.get(sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  if (session.status !== 'running') {
    res.status(409).json({ error: `Session is ${session.status}` });
    return;
  }

  const buffer = Buffer.from(data, 'base64');
  const stdin = session.ffmpegProcess.stdin;

  if (!stdin || stdin.destroyed) {
    res.status(500).json({ error: 'FFmpeg stdin not available' });
    return;
  }

  // Write PNG buffer to FFmpeg stdin
  const canWrite = stdin.write(buffer);
  session.framesReceived++;

  if (!canWrite) {
    // Backpressure — wait for drain before responding
    stdin.once('drain', () => {
      res.json({ ok: true, frame: frameIndex });
    });
  } else {
    res.json({ ok: true, frame: frameIndex });
  }
});

/**
 * POST /api/export/finish/:id
 * Close FFmpeg stdin, wait for process to complete, return success.
 */
exportRouter.post('/finish/:id', async (req: Request, res: Response) => {
  const session = sessions.get(req.params['id']!);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  console.log(`[export] Finishing session ${session.id} (${session.framesReceived}/${session.totalFrames} frames)`);

  // Close stdin — signals FFmpeg that no more frames are coming
  session.ffmpegProcess.stdin?.end();

  try {
    await session.finishPromise;
    const stat = fs.statSync(session.outputPath);
    console.log(`[export] Complete: ${session.outputPath} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
    res.json({ ok: true, size: stat.size });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/export/cancel/:id
 */
exportRouter.post('/cancel/:id', (req: Request, res: Response) => {
  const session = sessions.get(req.params['id']!);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  session.status = 'cancelled';
  session.ffmpegProcess.stdin?.end();
  session.ffmpegProcess.kill('SIGTERM');

  // Clean up partial output file
  try {
    if (fs.existsSync(session.outputPath)) {
      fs.unlinkSync(session.outputPath);
    }
  } catch { /* ignore */ }

  console.log(`[export] Cancelled session ${session.id}`);
  res.json({ ok: true });
});

/**
 * GET /api/export/download/:id
 * Stream the completed MP4 file.
 */
exportRouter.get('/download/:id', (req: Request, res: Response) => {
  const session = sessions.get(req.params['id']!);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  if (session.status !== 'complete') {
    res.status(409).json({ error: `Export not complete (status: ${session.status})` });
    return;
  }
  if (!fs.existsSync(session.outputPath)) {
    res.status(404).json({ error: 'Output file not found' });
    return;
  }

  const stat = fs.statSync(session.outputPath);
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `attachment; filename="output.mp4"`);

  const stream = fs.createReadStream(session.outputPath);
  stream.pipe(res);

  // Schedule cleanup after download
  stream.on('end', () => {
    setTimeout(() => {
      try {
        fs.unlinkSync(session.outputPath);
        sessions.delete(session.id);
      } catch { /* ignore */ }
    }, 60_000); // Keep for 60s after download
  });
});

/**
 * GET /api/export/status/:id
 * Poll export status.
 */
exportRouter.get('/status/:id', (req: Request, res: Response) => {
  const session = sessions.get(req.params['id']!);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json({
    id: session.id,
    status: session.status,
    framesReceived: session.framesReceived,
    totalFrames: session.totalFrames,
    error: session.error,
  });
});
