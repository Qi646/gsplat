/**
 * UIController.ts
 * Wires all DOM buttons, inputs, and displays to the underlying managers.
 * This is the "glue" layer — no business logic here, just event binding.
 */

import type { AppEvents, ExportSettings, CameraPath, ScenePreset } from '../types';
import { SCENE_PRESETS } from '../types';
import type { SceneViewer } from '../viewer/SceneViewer';
import type { KeyframeManager } from '../path/KeyframeManager';
import type { ExportManager } from '../export/ExportManager';
import type { WalkControls } from '../controls/WalkControls';

export class UIController {
  private events: AppEvents;
  private viewer: SceneViewer;
  private kfManager: KeyframeManager;
  private exportMgr: ExportManager;
  private walkControls: WalkControls;

  private fpsInterval: ReturnType<typeof setInterval> | null = null;
  private previewBtnPreviewing = false;

  constructor(
    events: AppEvents,
    viewer: SceneViewer,
    kfManager: KeyframeManager,
    exportMgr: ExportManager,
    walkControls: WalkControls
  ) {
    this.events = events;
    this.viewer = viewer;
    this.kfManager = kfManager;
    this.exportMgr = exportMgr;
    this.walkControls = walkControls;
  }

  init(): void {
    this.bindSceneSource();
    this.bindTopBar();
    this.bindKeyframeButtons();
    this.bindCinematicPresets();
    this.bindTimeline();
    this.bindExport();
    this.bindEvents();
    this.buildPresetGrid();
    this.startFPSDisplay();
  }

  // ── Scene Source ──────────────────────────────────────────────────────────

  private bindSceneSource(): void {
    // Tab toggle
    document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.source-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.dataset['tab'];
        this.$('#tab-url')!.style.display = which === 'url' ? 'block' : 'none';
        this.$('#tab-presets')!.style.display = which === 'presets' ? 'block' : 'none';
      });
    });

    // Load button
    this.$<HTMLButtonElement>('#btn-load-scene')!.addEventListener('click', () => {
      const url = this.$<HTMLInputElement>('#scene-url-input')!.value.trim();
      if (url) this.loadScene(url);
    });

    // Enter key in URL field
    this.$<HTMLInputElement>('#scene-url-input')!.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.$<HTMLButtonElement>('#btn-load-scene')!.click();
    });
  }

  private buildPresetGrid(): void {
    const grid = this.$('#preset-grid')!;
    grid.innerHTML = '';
    SCENE_PRESETS.forEach((preset: ScenePreset) => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.innerHTML = `<span class="preset-name">${preset.name}</span><span class="preset-size">~${preset.sizeMB}MB</span>`;
      btn.title = preset.description;
      btn.addEventListener('click', () => {
        this.$<HTMLInputElement>('#scene-url-input')!.value = preset.url;
        // Switch to URL tab and load
        document.querySelector<HTMLButtonElement>('[data-tab="url"]')!.click();
        this.loadScene(preset.url);
      });
      grid.appendChild(btn);
    });
  }

  private async loadScene(url: string): Promise<void> {
    const loadingOverlay = this.$<HTMLDivElement>('#loading-overlay')!;
    loadingOverlay.classList.remove('hidden');
    this.$('#progress-fill')!.style.width = '0%';
    this.$('#progress-label')!.textContent = 'Starting…';

    this.setSceneButtonsEnabled(false);

    try {
      await this.viewer.loadScene(url);
    } catch (err) {
      this.$('#progress-label')!.textContent = `Error: ${(err as Error).message}`;
    }
  }

  // ── Top Bar ───────────────────────────────────────────────────────────────

  private bindTopBar(): void {
    this.$<HTMLButtonElement>('#btn-frame-scene')!.addEventListener('click', () => {
      this.viewer.frameScene();
    });
    this.$<HTMLButtonElement>('#btn-reset-view')!.addEventListener('click', () => {
      this.viewer.resetView();
    });
    this.$<HTMLButtonElement>('#btn-walk-mode')!.addEventListener('click', () => {
      if (this.walkControls.isActive()) {
        this.walkControls.disable();
        this.setWalkModeUI(false);
      } else {
        this.walkControls.enable();
        this.setWalkModeUI(true);
      }
    });

    // Walk mode ESC exit
    document.addEventListener('walkmode:exit', () => {
      this.setWalkModeUI(false);
    });
  }

  private setWalkModeUI(active: boolean): void {
    this.$<HTMLButtonElement>('#btn-walk-mode')!.classList.toggle('active', active);
    this.$('#walkmode-hud')!.classList.toggle('visible', active);
  }

  private setSceneButtonsEnabled(enabled: boolean): void {
    ['#btn-frame-scene', '#btn-reset-view', '#btn-walk-mode',
     '#btn-add-kf', '#preset-turntable', '#preset-dolly',
     '#preset-crane', '#preset-figure8'].forEach(id => {
      this.$<HTMLButtonElement>(id)!.disabled = !enabled;
    });
  }

  // ── Keyframe buttons ──────────────────────────────────────────────────────

  private bindKeyframeButtons(): void {
    this.$<HTMLButtonElement>('#btn-add-kf')!.addEventListener('click', () => {
      this.kfManager.addKeyframe();
    });

    this.$<HTMLButtonElement>('#btn-clear-kfs')!.addEventListener('click', () => {
      if (confirm('Clear all keyframes?')) {
        this.kfManager.clear();
        this.renderKeyframeList();
        this.updatePathButtonsState();
      }
    });

    this.$<HTMLButtonElement>('#btn-preview')!.addEventListener('click', () => {
      if (this.previewBtnPreviewing) {
        this.kfManager.stopPreview();
      } else {
        const duration = parseFloat(this.$<HTMLInputElement>('#export-duration')!.value) || 10;
        this.kfManager.startPreview(duration);
      }
    });

    this.$<HTMLButtonElement>('#btn-save-path')!.addEventListener('click', () => {
      const path = this.kfManager.toJSON();
      const blob = new Blob([JSON.stringify(path, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'camera-path.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    this.$<HTMLButtonElement>('#btn-load-path')!.addEventListener('click', () => {
      this.$<HTMLInputElement>('#path-file-input')!.click();
    });

    this.$<HTMLInputElement>('#path-file-input')!.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const path = JSON.parse(text) as CameraPath;
      this.kfManager.fromJSON(path);
      (e.target as HTMLInputElement).value = '';
    });
  }

  // ── Cinematic presets ─────────────────────────────────────────────────────

  private bindCinematicPresets(): void {
    this.$('#preset-turntable')!.addEventListener('click', () => {
      this.kfManager.generateTurntable();
    });
    this.$('#preset-dolly')!.addEventListener('click', () => {
      this.kfManager.generateDollyIn();
    });
    this.$('#preset-crane')!.addEventListener('click', () => {
      this.kfManager.generateCraneUp();
    });
    this.$('#preset-figure8')!.addEventListener('click', () => {
      this.kfManager.generateFigureEight();
    });
  }

  // ── Timeline / scrubber ───────────────────────────────────────────────────

  private bindTimeline(): void {
    const scrubber = this.$<HTMLInputElement>('#timeline-scrubber')!;
    scrubber.addEventListener('input', () => {
      const normalizedT = parseInt(scrubber.value) / 1000;
      const t = normalizedT * this.kfManager.getTotalDuration();
      this.kfManager.seekToTime(t);
      this.updateScrubberDisplay(t);
    });
  }

  updateScrubberDisplay(currentT: number): void {
    const total = this.kfManager.getTotalDuration();
    this.$('#scrubber-time-left')!.textContent = `${currentT.toFixed(1)}s`;
    this.$('#scrubber-time-right')!.textContent = `${total.toFixed(1)}s`;
    const scrubber = this.$<HTMLInputElement>('#timeline-scrubber')!;
    scrubber.value = String(total > 0 ? Math.round((currentT / total) * 1000) : 0);
  }

  // ── Export ────────────────────────────────────────────────────────────────

  private bindExport(): void {
    this.$<HTMLButtonElement>('#btn-export')!.addEventListener('click', async () => {
      if (this.kfManager.getKeyframes().length < 2) {
        alert('Add at least 2 keyframes before exporting.');
        return;
      }
      const settings = this.readExportSettings();
      await this.exportMgr.export(settings);
    });

    this.$<HTMLButtonElement>('#btn-cancel-export')!.addEventListener('click', () => {
      this.exportMgr.cancel();
    });
  }

  private readExportSettings(): ExportSettings {
    return {
      resolution: this.$<HTMLSelectElement>('#export-resolution')!.value as ExportSettings['resolution'],
      fps: parseInt(this.$<HTMLSelectElement>('#export-fps')!.value),
      duration: parseFloat(this.$<HTMLInputElement>('#export-duration')!.value) || 10,
      quality: this.$<HTMLSelectElement>('#export-quality')!.value as ExportSettings['quality'],
    };
  }

  // ── Event listeners ───────────────────────────────────────────────────────

  private bindEvents(): void {
    this.events.on('scene:loaded', ({ splatCount, bounds: _b }) => {
      this.$('#loading-overlay')!.classList.add('hidden');
      this.$('#stat-count')!.textContent = splatCount.toLocaleString();
      this.$('#stat-scene')!.textContent = 'loaded';
      this.setSceneButtonsEnabled(true);
      this.updatePathButtonsState();
    });

    this.events.on('scene:progress', ({ percent, message }) => {
      this.$('#progress-fill')!.style.width = `${percent}%`;
      this.$('#progress-label')!.textContent = message;
    });

    this.events.on('keyframe:added', () => {
      this.renderKeyframeList();
      this.updatePathButtonsState();
    });

    this.events.on('keyframe:deleted', () => {
      this.renderKeyframeList();
      this.updatePathButtonsState();
    });

    this.events.on('keyframe:reordered', () => {
      this.renderKeyframeList();
      this.updatePathButtonsState();
    });

    this.events.on('path:preview:start', () => {
      this.previewBtnPreviewing = true;
      this.$<HTMLButtonElement>('#btn-preview')!.textContent = '■ Stop';
      this.$<HTMLButtonElement>('#btn-preview')!.classList.add('active');
    });

    this.events.on('path:preview:stop', () => {
      this.previewBtnPreviewing = false;
      this.$<HTMLButtonElement>('#btn-preview')!.textContent = '▶ Preview';
      this.$<HTMLButtonElement>('#btn-preview')!.classList.remove('active');
    });

    this.events.on('export:start', () => {
      const overlay = this.$<HTMLDivElement>('#export-overlay')!;
      overlay.classList.add('visible');
      this.$('#export-status')!.textContent = 'Preparing…';
      this.$('#export-progress-fill')!.style.width = '0%';
      this.$<HTMLButtonElement>('#btn-export')!.disabled = true;
    });

    this.events.on('export:progress', ({ frame, total }) => {
      const pct = Math.round((frame / total) * 100);
      this.$('#export-progress-fill')!.style.width = `${pct}%`;
      this.$('#export-status')!.textContent = `Frame ${frame} / ${total} (${pct}%)`;
    });

    this.events.on('export:complete', ({ downloadUrl: _url }) => {
      this.$<HTMLDivElement>('#export-overlay')!.classList.remove('visible');
      this.$<HTMLButtonElement>('#btn-export')!.disabled = false;
    });

    this.events.on('export:cancelled', () => {
      this.$<HTMLDivElement>('#export-overlay')!.classList.remove('visible');
      this.$<HTMLButtonElement>('#btn-export')!.disabled = false;
    });

    this.events.on('export:error', ({ message }) => {
      this.$<HTMLDivElement>('#export-overlay')!.classList.remove('visible');
      this.$<HTMLButtonElement>('#btn-export')!.disabled = false;
      alert(`Export failed: ${message}`);
    });
  }

  // ── Keyframe list render ──────────────────────────────────────────────────

  private renderKeyframeList(): void {
    const list = this.$('#keyframe-list')!;
    const keyframes = this.kfManager.getKeyframes();

    if (keyframes.length === 0) {
      list.innerHTML = `
        <div class="kf-empty" id="kf-empty">
          No keyframes yet.<br/>
          Navigate to a view, then<br/>
          click <strong>Add Keyframe</strong>.
        </div>`;
      return;
    }

    list.innerHTML = '';
    keyframes.forEach((kf, idx) => {
      const item = document.createElement('div');
      item.className = 'kf-item';
      item.dataset['id'] = kf.id;
      item.innerHTML = `
        <span class="kf-index">${String(idx + 1).padStart(2, '0')}</span>
        <div class="kf-info">
          <div class="kf-time">${kf.time.toFixed(1)}s</div>
          <div class="kf-pos">${kf.position.x.toFixed(2)}, ${kf.position.y.toFixed(2)}, ${kf.position.z.toFixed(2)}</div>
        </div>
        <button class="kf-delete" title="Delete">✕</button>
      `;

      item.querySelector('.kf-delete')!.addEventListener('click', (e) => {
        e.stopPropagation();
        this.kfManager.deleteKeyframe(kf.id);
      });

      item.addEventListener('click', () => {
        this.kfManager.seekToTime(kf.time);
        list.querySelectorAll('.kf-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
      });

      list.appendChild(item);
    });

    // Update scrubber max to total duration
    const scrubber = this.$<HTMLInputElement>('#timeline-scrubber')!;
    scrubber.disabled = keyframes.length < 2;
    this.updateScrubberDisplay(0);
  }

  private updatePathButtonsState(): void {
    const count = this.kfManager.getKeyframes().length;
    this.$<HTMLButtonElement>('#btn-clear-kfs')!.disabled = count === 0;
    this.$<HTMLButtonElement>('#btn-preview')!.disabled = count < 2;
    this.$<HTMLButtonElement>('#btn-save-path')!.disabled = count === 0;
    this.$<HTMLButtonElement>('#btn-export')!.disabled = count < 2 || !this.viewer.isSceneLoaded();
  }

  // ── FPS display ───────────────────────────────────────────────────────────

  private startFPSDisplay(): void {
    this.fpsInterval = setInterval(() => {
      const fps = this.viewer.getFPS();
      const el = this.$('#stat-fps')!;
      el.textContent = String(fps);
      el.className = 'val fps-val' + (fps < 20 ? ' bad' : fps < 45 ? ' warn' : '');
    }, 500);
  }

  private $<T extends HTMLElement>(selector: string): T | null {
    return document.querySelector<T>(selector);
  }
}
