import { WalkControls, type WalkControlState } from './controls/WalkControls';
import { DEFAULT_EXPORT_SETTINGS, ExportManager, type ExportProgress } from './export/ExportManager';
import { parseAppRuntimeQuery } from './lib/runtimeQuery';
import { SCENE_PRESETS } from './lib/scenePresets';
import { CameraPathOverlay } from './path/CameraPathOverlay';
import { KeyframeManager } from './path/KeyframeManager';
import { AppEvents, type AppBootPhase, type Keyframe, type ViewerRendererId } from './types';
import { createViewerAdapter } from './viewer/createViewerAdapter';
import type { ViewerAdapter } from './viewer/ViewerAdapter';

function $(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

function setWalkModeUI(state: WalkControlState): void {
  const engaged = state !== 'inactive';
  const hudMessage =
    state === 'armed'
      ? 'WALK MODE · Click in the viewer to enter · WASD fly · Mouse look · Q/E vertical · ESC exit'
      : 'WALK MODE · WASD fly · Mouse look · Q/E vertical · Shift sprint · ESC exit';

  $('#btn-walk-mode').classList.toggle('active', engaged);
  $('#walkmode-hud').classList.toggle('visible', engaged);
  $('#walkmode-hud').textContent = hudMessage;
}

function setSceneButtonsEnabled(sceneLoaded: boolean, previewActive: boolean, walkState: WalkControlState): void {
  const walkModeEngaged = walkState !== 'inactive';

  ($('#btn-frame-scene') as HTMLButtonElement).disabled = !sceneLoaded || previewActive || walkModeEngaged;
  ($('#btn-reset-view') as HTMLButtonElement).disabled = !sceneLoaded || previewActive || walkModeEngaged;
  ($('#btn-walk-mode') as HTMLButtonElement).disabled = !sceneLoaded || previewActive;
}

function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(1)}s`;
}

function formatRendererLabel(rendererId: ViewerRendererId): string {
  return rendererId === 'spark' ? 'Spark' : 'mkkellogg';
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function main(): Promise<void> {
  const runtimeQuery = parseAppRuntimeQuery(window.location.search);
  let viewer: ViewerAdapter | null = null;
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
  const exportButton = $('#btn-export-mp4') as HTMLButtonElement;
  const exportNote = $('#export-note');
  const pathFileInput = $('#path-file-input') as HTMLInputElement;
  const timelineScrubber = $('#timeline-scrubber') as HTMLInputElement;
  const pathVisualsButton = $('#btn-toggle-path-visuals') as HTMLButtonElement;
  const pathOverlayElement = document.querySelector<SVGSVGElement>('#camera-path-overlay');
  if (!pathOverlayElement) {
    throw new Error('Missing element: #camera-path-overlay');
  }
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
    rendererId: runtimeQuery.renderer,
    statusNote: currentStatusNote,
    viewer: viewer?.getDebugSnapshot() ?? null,
  });

  if (runtimeQuery.e2eEnabled) {
    window.__GSPLAT_DEBUG__ = {
      snapshot: getDebugSnapshot,
    };
  }

  viewer = createViewerAdapter(runtimeQuery.renderer, {
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
  const rendererLabel = formatRendererLabel(viewer.getRendererId());

  const setStatusNote = (message: string): void => {
    currentStatusNote = [`Renderer: ${rendererLabel}.`, message, compatibilityStatusMessage]
      .filter(Boolean)
      .join(' ');
    statusNote.textContent = currentStatusNote;
  };

  const camera = viewer.getCamera();
  const interactionSurface = viewer.getInteractionSurface();
  if (!camera || !interactionSurface) {
    throw new Error('Viewer camera or interaction surface is unavailable after initialization');
  }

  const keyframeManager = new KeyframeManager({ viewer, events });
  const exportManager = new ExportManager({ viewer });
  const pathOverlay = new CameraPathOverlay(pathOverlayElement);
  let walkState: WalkControlState = 'inactive';
  let pathVisualsEnabled = true;
  let sceneLoadInProgress = false;
  let selectedKeyframeId: string | null = null;
  const defaultExportNote = `${DEFAULT_EXPORT_SETTINGS.width}x${DEFAULT_EXPORT_SETTINGS.height} · ${DEFAULT_EXPORT_SETTINGS.fps} FPS via FFmpeg`;

  const getPathVisualsState = () => {
    const keyframes = keyframeManager.getKeyframes();
    const sceneLoaded = !sceneLoadInProgress && viewer.isSceneLoaded();
    const exportActive = exportManager.isExporting();
    const available = sceneLoaded && keyframes.length > 0;
    const visible = available && pathVisualsEnabled && !exportActive;

    return {
      available,
      exportActive,
      keyframes,
      sceneLoaded,
      visible,
    };
  };

  const updatePathVisualsButton = () => {
    const { available, exportActive } = getPathVisualsState();
    pathVisualsButton.disabled = !available || exportActive;
    pathVisualsButton.classList.toggle('active', pathVisualsEnabled);
    pathVisualsButton.setAttribute('aria-pressed', String(pathVisualsEnabled));
  };

  const syncPathVisualsState = () => {
    const { keyframes, sceneLoaded, visible } = getPathVisualsState();
    pathOverlay.setViewportSize(viewerHost.clientWidth, viewerHost.clientHeight);
    pathOverlay.setKeyframes(keyframes);
    pathOverlay.setSelectedKeyframeId(selectedKeyframeId);
    pathOverlay.setSceneBounds(sceneLoaded ? viewer.getSceneBounds() : null);
    pathOverlay.setEnabled(visible);
    if (visible) {
      pathOverlay.render(viewer.getCamera());
    } else {
      pathOverlay.clear();
    }

    updatePathVisualsButton();
  };

  const walkControls = new WalkControls({
    camera,
    canvas: interactionSurface,
    onStateChange: nextState => {
      const previousState = walkState;
      walkState = nextState;
      setWalkModeUI(walkState);
      if (walkState === 'inactive') {
        if (previousState === 'active') {
          viewer.resumeOrbitFromCamera();
        } else {
          viewer.setNavigationMode('orbit');
        }
      } else {
        viewer.setNavigationMode('walk');
      }

      if (walkState === 'active') {
        setStatusNote('Walk mode active. Press Esc to return to camera controls.');
      }

      updatePathControlsState();
    },
  });
  viewer.setFrameHook(() => {
    if (walkControls.isActive()) {
      walkControls.update();
    }

    pathOverlay.render(viewer.getCamera());
  });

  const updatePreviewButton = () => {
    previewButton.classList.toggle('active', keyframeManager.isPreviewActive());
    previewButton.textContent = keyframeManager.isPreviewActive() ? '■ Stop' : '▶ Preview';
  };

  const updateExportButton = (progress?: ExportProgress | null) => {
    if (!exportManager.isExporting()) {
      exportButton.textContent = '⬇ Export MP4';
      exportNote.textContent = defaultExportNote;
      return;
    }

    const percent = Math.round(progress?.percent ?? 0);
    exportButton.textContent = `⬇ Exporting ${percent}%`;
    exportNote.textContent = progress?.message ?? 'Exporting path to MP4…';
  };

  const setSceneSourceEnabled = (enabled: boolean) => {
    sceneUrlInput.disabled = !enabled;
    loadButton.disabled = !enabled;

    document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(button => {
      button.disabled = !enabled;
    });

    document.querySelectorAll<HTMLButtonElement>('.preset-btn').forEach(button => {
      button.disabled = !enabled;
    });
  };

  const setExportInteractionLock = (active: boolean) => {
    viewerHost.style.pointerEvents = active ? 'none' : '';
    keyframeList.classList.toggle('disabled', active);
  };

  const updateTimelineUI = (timeSeconds: number, durationSeconds: number) => {
    scrubberTimeLeft.textContent = formatSeconds(timeSeconds);
    scrubberTimeRight.textContent = formatSeconds(durationSeconds);
    const ratio = durationSeconds > 0 ? timeSeconds / durationSeconds : 0;
    timelineScrubber.value = String(Math.round(ratio * 1000));
  };

  const updatePathControlsState = () => {
    const keyframeCount = keyframeManager.getKeyframes().length;
    const sceneLoaded = !sceneLoadInProgress && viewer.isSceneLoaded();
    const previewActive = keyframeManager.isPreviewActive();
    const exportActive = exportManager.isExporting();
    const interactionLocked = previewActive || exportActive;

    addKeyframeButton.disabled = !sceneLoaded || exportActive;
    clearKeyframesButton.disabled = keyframeCount === 0 || exportActive;
    previewButton.disabled = !sceneLoaded || keyframeCount < 2 || exportActive;
    savePathButton.disabled = keyframeCount === 0 || exportActive;
    loadPathButton.disabled = !sceneLoaded || exportActive;
    timelineScrubber.disabled = !sceneLoaded || keyframeCount < 2 || exportActive;
    exportButton.disabled = !sceneLoaded || keyframeCount < 2 || exportActive;
    setSceneButtonsEnabled(sceneLoaded, interactionLocked, walkState);
    setSceneSourceEnabled(!exportActive);
    setExportInteractionLock(exportActive);
    updatePreviewButton();
    updateExportButton();
    updatePathVisualsButton();
  };

  const stopWalkMode = () => {
    if (walkState !== 'inactive') {
      walkControls.disable();
    }
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
    pathOverlay.setViewportSize(viewerHost.clientWidth, viewerHost.clientHeight);
    pathOverlay.render(viewer.getCamera());
  };

  resizeViewer();
  window.addEventListener('resize', resizeViewer);
  window.addEventListener('beforeunload', () => {
    stopWalkMode();
    pathOverlay.dispose();
    viewer.dispose();
  });

  const loadScene = async (url: string) => {
    stopWalkMode();
    keyframeManager.stopPreview();
    sceneLoadInProgress = true;
    loadingOverlay.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressLabel.textContent = 'Starting…';
    setStatusNote('Loading scene…');
    statScene.textContent = 'loading';
    pathOverlay.setSceneBounds(null);
    pathOverlay.clear();
    setSceneButtonsEnabled(false, false, walkState);
    addKeyframeButton.disabled = true;
    previewButton.disabled = true;
    loadPathButton.disabled = true;
    timelineScrubber.disabled = true;
    updatePathControlsState();
    syncPathVisualsState();

    try {
      await viewer.loadScene(url);
      keyframeManager.clear();
      selectedKeyframeId = null;
      sceneLoadInProgress = false;
      renderKeyframeList();
      updatePathControlsState();
      syncPathVisualsState();
      updateTimelineUI(0, 0);
      setStatusNote('Scene loaded. Capture keyframes, scrub the path, or preview a camera move.');
    } catch (error) {
      sceneLoadInProgress = false;
      const message = error instanceof Error ? error.message : 'Unknown load error';
      progressLabel.textContent = `Error: ${message}`;
      setStatusNote('Scene load failed. Try another public URL or preset.');
      updatePathControlsState();
      syncPathVisualsState();
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

  pathVisualsButton.addEventListener('click', () => {
    pathVisualsEnabled = !pathVisualsEnabled;
    syncPathVisualsState();
    setStatusNote(pathVisualsEnabled ? 'Camera path visuals shown.' : 'Camera path visuals hidden.');
  });

  ($('#btn-walk-mode') as HTMLButtonElement).addEventListener('click', () => {
    if (walkState !== 'inactive') {
      stopWalkMode();
      setStatusNote('Walk mode exited. Camera controls restored.');
      return;
    }

    walkControls.enable();
    setStatusNote('Walk mode armed. Click in the viewer to capture mouse look.');
  });

  addKeyframeButton.addEventListener('click', () => {
    const keyframe = keyframeManager.addKeyframe();
    if (!keyframe) {
      return;
    }

    selectedKeyframeId = keyframe.id;
    renderKeyframeList();
    updatePathControlsState();
    syncPathVisualsState();
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
    syncPathVisualsState();
    setStatusNote('Camera path cleared.');
  });

  previewButton.addEventListener('click', () => {
    if (keyframeManager.isPreviewActive()) {
      keyframeManager.stopPreview();
      setStatusNote('Preview stopped.');
      return;
    }

    stopWalkMode();

    if (keyframeManager.startPreview()) {
      selectedKeyframeId = null;
      renderKeyframeList();
      updatePathControlsState();
      syncPathVisualsState();
      setStatusNote('Previewing camera path.');
    }
  });

  savePathButton.addEventListener('click', () => {
    const path = keyframeManager.toJSON();
    const blob = new Blob([JSON.stringify(path, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'camera-path.json');
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
      syncPathVisualsState();
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
    syncPathVisualsState();
  });

  exportButton.addEventListener('click', async () => {
    stopWalkMode();
    keyframeManager.stopPreview();

    const exportPromise = exportManager.exportPath(keyframeManager.getKeyframes(), {
      onProgress: progress => {
        updateExportButton(progress);
        setStatusNote(progress.message);
      },
    });

    updatePathControlsState();
    syncPathVisualsState();

    try {
      const result = await exportPromise;
      downloadBlob(result.blob, result.fileName);
      setStatusNote(
        `Export complete. Downloaded ${result.fileName} with ${result.totalFrames} frame${result.totalFrames === 1 ? '' : 's'}.`,
      );
    } catch (error) {
      setStatusNote(error instanceof Error ? error.message : 'MP4 export failed.');
    } finally {
      updatePathControlsState();
      syncPathVisualsState();
    }
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
    syncPathVisualsState();
  });

  events.on('scene:error', ({ message }) => {
    statScene.textContent = 'error';
    setStatusNote(`Scene load failed: ${message}`);
    updatePathControlsState();
    syncPathVisualsState();
  });

  events.on('keyframe:added', ({ keyframe }) => {
    selectedKeyframeId = keyframe.id;
    renderKeyframeList();
    updatePathControlsState();
    syncPathVisualsState();
  });

  events.on('keyframe:deleted', ({ id }) => {
    if (selectedKeyframeId === id) {
      selectedKeyframeId = null;
    }
    renderKeyframeList();
    updatePathControlsState();
    syncPathVisualsState();
  });

  events.on('keyframe:reordered', ({ keyframes }) => {
    if (selectedKeyframeId && !keyframes.some((keyframe: Keyframe) => keyframe.id === selectedKeyframeId)) {
      selectedKeyframeId = null;
    }
    renderKeyframeList();
    updatePathControlsState();
    syncPathVisualsState();
  });

  events.on('path:preview:start', () => {
    updatePathControlsState();
    syncPathVisualsState();
  });

  events.on('path:preview:stop', () => {
    updatePathControlsState();
    syncPathVisualsState();
    const totalDuration = keyframeManager.getTotalDuration();
    if (totalDuration > 0 && Math.abs(keyframeManager.getCurrentTime() - totalDuration) < 0.001) {
      setStatusNote('Preview complete.');
    }
  });

  events.on('path:seek', ({ time, duration }) => {
    updateTimelineUI(time, duration);
    syncPathVisualsState();
  });

  renderKeyframeList();
  setStatusNote('Ready to load a scene.');
  setWalkModeUI(walkState);
  updateExportButton();
  updatePathControlsState();
  syncPathVisualsState();
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
