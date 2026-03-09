import { WalkControls } from './controls/WalkControls';
import { parseAppRuntimeQuery } from './lib/runtimeQuery';
import { SCENE_PRESETS } from './lib/scenePresets';
import { KeyframeManager } from './path/KeyframeManager';
import { AppEvents, type AppBootPhase, type Keyframe } from './types';
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

function setSceneButtonsEnabled(enabled: boolean, previewActive = false): void {
  for (const selector of ['#btn-frame-scene', '#btn-reset-view', '#btn-walk-mode']) {
    const button = $(selector) as HTMLButtonElement;
    button.disabled = !enabled || previewActive;
  }
}

function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(1)}s`;
}

async function main(): Promise<void> {
  const runtimeQuery = parseAppRuntimeQuery(window.location.search);
  let viewer: SceneViewer | null = null;
  let bootPhase: AppBootPhase = 'booting';
  let initErrorMessage: string | null = null;
  let currentStatusNote: string | null = null;
  const viewerHost = $('#viewer-host') as HTMLDivElement;
  const sceneUrlInput = $('#scene-url-input') as HTMLInputElement;
  const loadButton = $('#btn-load-scene') as HTMLButtonElement;
  const addKeyframeButton = $('#btn-add-kf') as HTMLButtonElement;
  const clearKeyframesButton = $('#btn-clear-kfs') as HTMLButtonElement;
  const previewButton = $('#btn-preview') as HTMLButtonElement;
  const savePathButton = $('#btn-save-path') as HTMLButtonElement;
  const loadPathButton = $('#btn-load-path') as HTMLButtonElement;
  const pathFileInput = $('#path-file-input') as HTMLInputElement;
  const timelineScrubber = $('#timeline-scrubber') as HTMLInputElement;
  const scrubberTimeLeft = $('#scrubber-time-left');
  const scrubberTimeRight = $('#scrubber-time-right');
  const keyframeList = $('#keyframe-list');
  const loadingOverlay = $('#loading-overlay');
  const progressFill = $('#progress-fill');
  const progressLabel = $('#progress-label');
  const statusNote = $('#status-note');
  const statCount = $('#stat-count');
  const statScene = $('#stat-scene');
  const statFps = $('#stat-fps');

  const events = new AppEvents();
  const getDebugSnapshot = () => ({
    bootPhase,
    initErrorMessage,
    statusNote: currentStatusNote,
    viewer: viewer?.getDebugSnapshot() ?? null,
  });

  if (runtimeQuery.e2eEnabled) {
    window.__GSPLAT_DEBUG__ = {
      snapshot: getDebugSnapshot,
    };
  }

  viewer = new SceneViewer({
    hostElement: viewerHost,
    events,
    runtimeOverrides: {
      viewerMode: runtimeQuery.viewerMode,
    },
  });
  bootPhase = 'viewer:initializing';

  try {
    await viewer.init();
    bootPhase = 'viewer:ready';
  } catch (error) {
    bootPhase = 'viewer:init-error';
    initErrorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    throw error;
  }

  const compatibilityStatusMessage = viewer.getCompatibilityStatusMessage();

  const setStatusNote = (message: string): void => {
    currentStatusNote = compatibilityStatusMessage ? `${message} ${compatibilityStatusMessage}` : message;
    statusNote.textContent = currentStatusNote;
  };

  const camera = viewer.getCamera();
  const interactionSurface = viewer.getInteractionSurface();
  if (!camera || !interactionSurface) {
    throw new Error('Viewer camera or interaction surface is unavailable after initialization');
  }

  const walkControls = new WalkControls({ camera, canvas: interactionSurface });
  const keyframeManager = new KeyframeManager({ viewer, events });
  viewer.setFrameHook(() => {
    if (walkControls.isActive()) {
      walkControls.update();
    }
  });

  let selectedKeyframeId: string | null = null;

  const updatePreviewButton = () => {
    previewButton.classList.toggle('active', keyframeManager.isPreviewActive());
    previewButton.textContent = keyframeManager.isPreviewActive() ? '■ Stop' : '▶ Preview';
  };

  const updateTimelineUI = (timeSeconds: number, durationSeconds: number) => {
    scrubberTimeLeft.textContent = formatSeconds(timeSeconds);
    scrubberTimeRight.textContent = formatSeconds(durationSeconds);
    const ratio = durationSeconds > 0 ? timeSeconds / durationSeconds : 0;
    timelineScrubber.value = String(Math.round(ratio * 1000));
  };

  const updatePathControlsState = () => {
    const keyframeCount = keyframeManager.getKeyframes().length;
    const sceneLoaded = viewer.isSceneLoaded();
    const previewActive = keyframeManager.isPreviewActive();

    addKeyframeButton.disabled = !sceneLoaded;
    clearKeyframesButton.disabled = keyframeCount === 0;
    previewButton.disabled = !sceneLoaded || keyframeCount < 2;
    savePathButton.disabled = keyframeCount === 0;
    loadPathButton.disabled = !sceneLoaded;
    timelineScrubber.disabled = !sceneLoaded || keyframeCount < 2;
    setSceneButtonsEnabled(sceneLoaded, previewActive);
    updatePreviewButton();
  };

  const renderKeyframeList = () => {
    const keyframes = keyframeManager.getKeyframes();

    if (keyframes.length === 0) {
      keyframeList.innerHTML = `
        <div class="kf-empty">
          No keyframes yet.<br />
          Explore the scene, then click <strong>Add Keyframe</strong>.
        </div>
      `;
      return;
    }

    keyframeList.innerHTML = '';

    keyframes.forEach((keyframe, index) => {
      const item = document.createElement('div');
      item.className = 'kf-item';
      if (keyframe.id === selectedKeyframeId) {
        item.classList.add('selected');
      }

      const info = document.createElement('div');
      info.className = 'kf-info';
      info.innerHTML = `
        <div class="kf-topline">
          <span class="kf-index">KF ${String(index + 1).padStart(2, '0')}</span>
          <span class="kf-time">${formatSeconds(keyframe.time)}</span>
        </div>
        <div class="kf-pos">${keyframe.position.x.toFixed(2)}, ${keyframe.position.y.toFixed(2)}, ${keyframe.position.z.toFixed(2)}</div>
      `;

      const controls = document.createElement('div');
      controls.className = 'kf-actions';

      const moveUpButton = document.createElement('button');
      moveUpButton.className = 'kf-action';
      moveUpButton.type = 'button';
      moveUpButton.textContent = '↑';
      moveUpButton.title = 'Move up';
      moveUpButton.disabled = index === 0;
      moveUpButton.addEventListener('click', event => {
        event.stopPropagation();
        if (keyframeManager.moveKeyframe(keyframe.id, -1)) {
          selectedKeyframeId = keyframe.id;
          setStatusNote(`Moved keyframe ${index + 1} earlier in the path.`);
          renderKeyframeList();
          updatePathControlsState();
        }
      });

      const moveDownButton = document.createElement('button');
      moveDownButton.className = 'kf-action';
      moveDownButton.type = 'button';
      moveDownButton.textContent = '↓';
      moveDownButton.title = 'Move down';
      moveDownButton.disabled = index === keyframes.length - 1;
      moveDownButton.addEventListener('click', event => {
        event.stopPropagation();
        if (keyframeManager.moveKeyframe(keyframe.id, 1)) {
          selectedKeyframeId = keyframe.id;
          setStatusNote(`Moved keyframe ${index + 1} later in the path.`);
          renderKeyframeList();
          updatePathControlsState();
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.className = 'kf-action danger';
      deleteButton.type = 'button';
      deleteButton.textContent = '✕';
      deleteButton.title = 'Delete keyframe';
      deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        if (keyframeManager.deleteKeyframe(keyframe.id)) {
          if (selectedKeyframeId === keyframe.id) {
            selectedKeyframeId = null;
          }
          setStatusNote(`Deleted keyframe ${index + 1}.`);
          renderKeyframeList();
          updatePathControlsState();
        }
      });

      controls.append(moveUpButton, moveDownButton, deleteButton);
      item.append(info, controls);
      item.addEventListener('click', () => {
        selectedKeyframeId = keyframe.id;
        keyframeManager.seekToTime(keyframe.time);
        setStatusNote(`Jumped to keyframe ${index + 1}.`);
        renderKeyframeList();
      });

      keyframeList.appendChild(item);
    });
  };

  const resizeViewer = () => {
    viewer.resize(viewerHost.clientWidth, viewerHost.clientHeight);
  };

  resizeViewer();
  window.addEventListener('resize', resizeViewer);
  window.addEventListener('beforeunload', () => viewer.dispose());

  const loadScene = async (url: string) => {
    keyframeManager.stopPreview();
    loadingOverlay.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressLabel.textContent = 'Starting…';
    setStatusNote('Loading scene…');
    statScene.textContent = 'loading';
    setSceneButtonsEnabled(false);
    addKeyframeButton.disabled = true;
    previewButton.disabled = true;
    loadPathButton.disabled = true;
    timelineScrubber.disabled = true;
    setWalkModeUI(false);
    walkControls.disable();

    try {
      await viewer.loadScene(url);
      keyframeManager.clear();
      selectedKeyframeId = null;
      renderKeyframeList();
      updatePathControlsState();
      updateTimelineUI(0, 0);
      setStatusNote('Scene loaded. Capture keyframes, scrub the path, or preview a camera move.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown load error';
      progressLabel.textContent = `Error: ${message}`;
      setStatusNote('Scene load failed. Try another public URL or preset.');
      updatePathControlsState();
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

  addKeyframeButton.addEventListener('click', () => {
    const keyframe = keyframeManager.addKeyframe();
    if (!keyframe) {
      return;
    }

    selectedKeyframeId = keyframe.id;
    renderKeyframeList();
    updatePathControlsState();
    setStatusNote(`Captured keyframe ${keyframeManager.getKeyframes().length} at ${formatSeconds(keyframe.time)}.`);
  });

  clearKeyframesButton.addEventListener('click', () => {
    if (keyframeManager.getKeyframes().length === 0 || !window.confirm('Clear the current camera path?')) {
      return;
    }

    selectedKeyframeId = null;
    keyframeManager.clear();
    renderKeyframeList();
    updatePathControlsState();
    setStatusNote('Camera path cleared.');
  });

  previewButton.addEventListener('click', () => {
    if (keyframeManager.isPreviewActive()) {
      keyframeManager.stopPreview();
      setStatusNote('Preview stopped.');
      return;
    }

    if (walkControls.isActive()) {
      walkControls.disable();
      setWalkModeUI(false);
    }

    if (keyframeManager.startPreview()) {
      selectedKeyframeId = null;
      renderKeyframeList();
      updatePathControlsState();
      setStatusNote('Previewing camera path.');
    }
  });

  savePathButton.addEventListener('click', () => {
    const path = keyframeManager.toJSON();
    const blob = new Blob([JSON.stringify(path, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'camera-path.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusNote(`Saved camera path with ${path.keyframes.length} keyframe${path.keyframes.length === 1 ? '' : 's'}.`);
  });

  loadPathButton.addEventListener('click', () => {
    pathFileInput.click();
  });

  pathFileInput.addEventListener('change', async event => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const path = keyframeManager.fromJSON(JSON.parse(text) as unknown);
      selectedKeyframeId = path.keyframes[0]?.id ?? null;
      renderKeyframeList();
      updatePathControlsState();
      setStatusNote(`Loaded camera path with ${path.keyframes.length} keyframe${path.keyframes.length === 1 ? '' : 's'}.`);
    } catch (error) {
      setStatusNote(error instanceof Error ? error.message : 'Invalid camera path file.');
    } finally {
      pathFileInput.value = '';
    }
  });

  timelineScrubber.addEventListener('input', () => {
    const normalizedTime = Number(timelineScrubber.value) / 1000;
    keyframeManager.seekToTime(normalizedTime * keyframeManager.getTotalDuration());
    selectedKeyframeId = null;
    renderKeyframeList();
  });

  events.on('scene:progress', ({ percent, message }) => {
    progressFill.style.width = `${percent}%`;
    progressLabel.textContent = message;
  });

  events.on('scene:loaded', ({ splatCount }) => {
    loadingOverlay.classList.add('hidden');
    statCount.textContent = splatCount.toLocaleString();
    statScene.textContent = 'loaded';
    updatePathControlsState();
  });

  events.on('scene:error', ({ message }) => {
    statScene.textContent = 'error';
    setStatusNote(`Scene load failed: ${message}`);
    updatePathControlsState();
  });

  events.on('keyframe:added', ({ keyframe }) => {
    selectedKeyframeId = keyframe.id;
    renderKeyframeList();
    updatePathControlsState();
  });

  events.on('keyframe:deleted', ({ id }) => {
    if (selectedKeyframeId === id) {
      selectedKeyframeId = null;
    }
    renderKeyframeList();
    updatePathControlsState();
  });

  events.on('keyframe:reordered', ({ keyframes }) => {
    if (selectedKeyframeId && !keyframes.some((keyframe: Keyframe) => keyframe.id === selectedKeyframeId)) {
      selectedKeyframeId = null;
    }
    renderKeyframeList();
    updatePathControlsState();
  });

  events.on('path:preview:start', () => {
    updatePathControlsState();
  });

  events.on('path:preview:stop', () => {
    updatePathControlsState();
    const totalDuration = keyframeManager.getTotalDuration();
    if (totalDuration > 0 && Math.abs(keyframeManager.getCurrentTime() - totalDuration) < 0.001) {
      statusNote.textContent = 'Preview complete.';
    }
  });

  events.on('path:seek', ({ time, duration }) => {
    updateTimelineUI(time, duration);
  });

  renderKeyframeList();
  if (viewer.isCompatibilityMode()) {
    setStatusNote('Ready to load a scene.');
  }
  updatePathControlsState();
  updateTimelineUI(0, 0);

  if (runtimeQuery.autoSceneUrl) {
    sceneUrlInput.value = runtimeQuery.autoSceneUrl;
    void loadScene(runtimeQuery.autoSceneUrl);
  }

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
