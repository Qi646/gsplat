/**
 * main.ts — Application entry point
 * Instantiates all subsystems and wires them together.
 */

import { AppEvents } from './types';
import { SceneViewer } from './viewer/SceneViewer';
import { WalkControls } from './controls/WalkControls';
import { KeyframeManager } from './path/KeyframeManager';
import { ExportManager } from './export/ExportManager';
import { UIController } from './ui/UIController';

async function main() {
  const canvas = document.getElementById('splat-canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas not found');

  // Resize canvas to container
  function resizeCanvas() {
    const container = canvas.parentElement!;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ── Create core systems ──────────────────────────────────────────────────
  const events = new AppEvents();

  const viewer = new SceneViewer({ canvas, events });
  await viewer.init();

  const camera = viewer.getCamera();
  if (!camera) throw new Error('Camera not available after viewer init');

  const walkControls = new WalkControls({ camera, canvas });
  const kfManager = new KeyframeManager(viewer, events);
  const exportMgr = new ExportManager({ viewer, keyframeManager: kfManager, events });

  // ── Wire walk controls into render loop ───────────────────────────────────
  // The viewer drives its own rAF; we inject walk control update via a hook
  // Override viewer's render loop tick to also update walk controls
  const origUpdate = viewer['startRenderLoop'].bind(viewer);
  // Actually: inject update into each frame via a simple setInterval fallback
  // Better: use a shared requestAnimationFrame
  let walkRafId: number;
  const walkTick = () => {
    if (walkControls.isActive()) {
      walkControls.update();
    }
    walkRafId = requestAnimationFrame(walkTick);
  };
  walkRafId = requestAnimationFrame(walkTick);

  // ── UI ────────────────────────────────────────────────────────────────────
  const ui = new UIController(events, viewer, kfManager, exportMgr, walkControls);
  ui.init();

  // Keyboard shortcut: K = add keyframe
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    if (e.code === 'KeyK' && !walkControls.isActive()) {
      kfManager.addKeyframe();
    }
    if (e.code === 'Space' && !walkControls.isActive()) {
      e.preventDefault();
      const btn = document.getElementById('btn-preview') as HTMLButtonElement;
      if (!btn.disabled) btn.click();
    }
  });

  console.log('✓ Gaussian Splat Viewer initialized');
}

main().catch(err => {
  console.error('Initialization failed:', err);
  const label = document.getElementById('progress-label');
  if (label) label.textContent = `Init error: ${err.message}`;
});
