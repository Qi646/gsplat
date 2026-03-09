import { WalkControls } from './controls/WalkControls';
import { SCENE_PRESETS } from './lib/scenePresets';
import { AppEvents } from './types';
import { SceneViewer } from './viewer/SceneViewer';

function $(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

function setWalkModeUI(active: boolean): void {
  $('#btn-walk-mode').classList.toggle('active', active);
  $('#walkmode-hud').classList.toggle('visible', active);
}

function setSceneButtonsEnabled(enabled: boolean): void {
  for (const selector of ['#btn-frame-scene', '#btn-reset-view', '#btn-walk-mode']) {
    const button = $(selector) as HTMLButtonElement;
    button.disabled = !enabled;
  }
}

async function main(): Promise<void> {
  const canvas = $('#splat-canvas') as HTMLCanvasElement;
  const sceneUrlInput = $('#scene-url-input') as HTMLInputElement;
  const loadButton = $('#btn-load-scene') as HTMLButtonElement;
  const loadingOverlay = $('#loading-overlay');
  const progressFill = $('#progress-fill');
  const progressLabel = $('#progress-label');
  const statusNote = $('#status-note');
  const statCount = $('#stat-count');
  const statScene = $('#stat-scene');
  const statFps = $('#stat-fps');

  const events = new AppEvents();
  const viewer = new SceneViewer({ canvas, events });
  await viewer.init();

  const camera = viewer.getCamera();
  if (!camera) {
    throw new Error('Viewer camera is unavailable after initialization');
  }

  const walkControls = new WalkControls({ camera, canvas });
  viewer.setFrameHook(() => {
    if (walkControls.isActive()) {
      walkControls.update();
    }
  });

  const resizeViewer = () => {
    const container = canvas.parentElement;
    if (!container) {
      return;
    }
    viewer.resize(container.clientWidth, container.clientHeight);
  };

  resizeViewer();
  window.addEventListener('resize', resizeViewer);
  window.addEventListener('beforeunload', () => viewer.dispose());

  const loadScene = async (url: string) => {
    loadingOverlay.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressLabel.textContent = 'Starting…';
    statusNote.textContent = 'Loading scene…';
    statScene.textContent = 'loading';
    setSceneButtonsEnabled(false);
    setWalkModeUI(false);
    walkControls.disable();

    try {
      await viewer.loadScene(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown load error';
      progressLabel.textContent = `Error: ${message}`;
      statusNote.textContent = 'Scene load failed. Try another public URL or preset.';
    }
  };

  document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(button => {
        button.classList.remove('active');
      });
      tab.classList.add('active');

      const selectedTab = tab.dataset['tab'];
      $('#tab-url').style.display = selectedTab === 'url' ? 'block' : 'none';
      $('#tab-presets').style.display = selectedTab === 'presets' ? 'block' : 'none';
    });
  });

  for (const preset of SCENE_PRESETS) {
    const button = document.createElement('button');
    button.className = 'preset-btn';
    button.title = preset.description;
    button.innerHTML = `
      <span class="preset-name">${preset.name}</span>
      <span class="preset-meta">${preset.sizeMB} MB · ${preset.description}</span>
    `;
    button.addEventListener('click', () => {
      sceneUrlInput.value = preset.url;
      document.querySelector<HTMLButtonElement>('[data-tab="url"]')?.click();
      void loadScene(preset.url);
    });
    $('#preset-grid').appendChild(button);
  }

  loadButton.addEventListener('click', () => {
    const url = sceneUrlInput.value.trim();
    if (url) {
      void loadScene(url);
    }
  });

  sceneUrlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      loadButton.click();
    }
  });

  ($('#btn-frame-scene') as HTMLButtonElement).addEventListener('click', () => {
    viewer.frameScene();
  });

  ($('#btn-reset-view') as HTMLButtonElement).addEventListener('click', () => {
    viewer.resetView();
  });

  ($('#btn-walk-mode') as HTMLButtonElement).addEventListener('click', () => {
    if (walkControls.isActive()) {
      walkControls.disable();
      setWalkModeUI(false);
      return;
    }

    walkControls.enable();
    setWalkModeUI(true);
  });

  document.addEventListener('walkmode:exit', () => {
    setWalkModeUI(false);
  });

  events.on('scene:progress', ({ percent, message }) => {
    progressFill.style.width = `${percent}%`;
    progressLabel.textContent = message;
  });

  events.on('scene:loaded', ({ splatCount }) => {
    loadingOverlay.classList.add('hidden');
    setSceneButtonsEnabled(true);
    statCount.textContent = splatCount.toLocaleString();
    statScene.textContent = 'loaded';
    statusNote.textContent = 'Scene loaded. Use Frame Scene, Reset View, or Walk Mode to explore.';
  });

  events.on('scene:error', ({ message }) => {
    statScene.textContent = 'error';
    statusNote.textContent = `Scene load failed: ${message}`;
  });

  window.setInterval(() => {
    const fps = viewer.getFPS();
    statFps.textContent = String(fps);
    statFps.className = `val fps-val${fps < 20 ? ' bad' : fps < 45 ? ' warn' : ''}`;
  }, 500);
}

void main().catch(error => {
  console.error('Initialization failed', error);
  $('#progress-label').textContent = `Init error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  $('#status-note').textContent = 'Viewer initialization failed.';
});
