import { WalkControls, type WalkControlState } from './controls/WalkControls';
import {
  getNavigationModePresentation,
  resolveNavigationShortcutAction,
} from './controls/navigationMode';
import { DEFAULT_EXPORT_SETTINGS, ExportManager, type ExportProgress } from './export/ExportManager';
import { parseAppRuntimeQuery } from './lib/runtimeQuery';
import { detectSceneFormat } from './lib/sceneFormat';
import { resolveSceneLoadSource, type SceneLoadInput, type SceneLoadSource } from './lib/sceneSource';
import { SCENE_PRESETS } from './lib/scenePresets';
import { CameraPathOverlay } from './path/CameraPathOverlay';
import { KeyframeManager } from './path/KeyframeManager';
import {
  AdaptiveRenderBudgetController,
  buildAdaptiveRenderBudgetNote,
} from './performance/AdaptiveRenderBudgetController';
import { AppEvents, type AppBootPhase, type Keyframe, type ViewerRendererId } from './types';
import { createViewerAdapter } from './viewer/createViewerAdapter';
import { rollOrbitCamera } from './viewer/orbitControls';
import type { ViewerAdapter } from './viewer/ViewerAdapter';

const CAMERA_ROLL_STEP_RADIANS = Math.PI / 36;
const SUPPORTED_LOCAL_SCENE_FILE_PATTERN = /\.(ply|splat|ksplat)$/i;

function $(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

function setNavigationModeUI(state: WalkControlState): void {
  const presentation = getNavigationModePresentation(state);
  $('#btn-walk-mode').classList.toggle('active', presentation.engaged);
  $('#walkmode-hud').classList.toggle('visible', presentation.engaged);
  $('#walkmode-hud').textContent = presentation.hudMessage;
  $('#navigation-mode-indicator').setAttribute('data-mode-state', presentation.indicatorState);
  $('#navigation-mode-value').textContent = presentation.indicatorLabel;
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

function formatFileSize(sizeBytes: number): string {
  const megabytes = sizeBytes / (1024 * 1024);
  const decimals = megabytes >= 10 ? 0 : 1;
  return `${megabytes.toFixed(decimals)} MB`;
}

async function main(): Promise<void> {
  const runtimeQuery = parseAppRuntimeQuery(window.location.search);
  let viewer: ViewerAdapter | null = null;
  let bootPhase: AppBootPhase = 'booting';
  let initErrorMessage: string | null = null;
  let currentStatusNote: string | null = null;
  const viewerHost = $('#viewer-host') as HTMLDivElement;
  const sceneUrlInput = $('#scene-url-input') as HTMLInputElement;
  const sceneFileInput = $('#scene-file-input') as HTMLInputElement;
  const selectSceneFileButton = $('#btn-select-scene-file') as HTMLButtonElement;
  const sceneFileNote = $('#scene-file-note');
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
  const adaptiveFpsButton = $('#btn-adaptive-fps') as HTMLButtonElement;
  const targetFpsSlider = $('#target-fps-slider') as HTMLInputElement;
  const targetFpsValue = $('#target-fps-value');
  const performanceNote = $('#performance-note');
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
  const adaptiveRenderBudgetController = new AdaptiveRenderBudgetController();
  const pathOverlay = new CameraPathOverlay(pathOverlayElement);
  let walkState: WalkControlState = 'inactive';
  let pathVisualsEnabled = true;
  let sceneLoadInProgress = false;
  let currentSceneObjectUrl: string | null = null;
  let selectedKeyframeId: string | null = null;
  let queuedWalkStatusMessage: string | null = null;
  let suppressWalkExitStatus = false;
  const defaultExportNote = `${DEFAULT_EXPORT_SETTINGS.width}x${DEFAULT_EXPORT_SETTINGS.height} · ${DEFAULT_EXPORT_SETTINGS.fps} FPS via FFmpeg`;
  const isSceneLoaded = () => !sceneLoadInProgress && viewer.isSceneLoaded();
  const isInteractionLocked = () => keyframeManager.isPreviewActive() || exportManager.isExporting();
  targetFpsSlider.min = String(adaptiveRenderBudgetController.getState().minTargetFps);
  targetFpsSlider.max = String(adaptiveRenderBudgetController.getState().maxTargetFps);
  targetFpsSlider.step = String(adaptiveRenderBudgetController.getState().sliderStep);
  targetFpsSlider.value = String(adaptiveRenderBudgetController.getState().targetFps);

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

  const consumeQueuedWalkStatusMessage = (previousState: WalkControlState) => {
    if (!suppressWalkExitStatus) {
      if (queuedWalkStatusMessage) {
        setStatusNote(queuedWalkStatusMessage);
      } else if (previousState === 'active') {
        setStatusNote('Walk mode exited. Camera controls restored.');
      }
    }

    queuedWalkStatusMessage = null;
    suppressWalkExitStatus = false;
  };

  const stopWalkMode = (
    options: {
      silent?: boolean;
      statusMessage?: string;
    } = {},
  ) => {
    if (walkState === 'inactive') {
      return;
    }

    queuedWalkStatusMessage = options.statusMessage ?? null;
    suppressWalkExitStatus = Boolean(options.silent);
    walkControls.disable();
  };

  const enterWalkMode = (): boolean => {
    if (walkState !== 'inactive' || !isSceneLoaded() || isInteractionLocked()) {
      return false;
    }

    walkControls.enable();
    return true;
  };

  const addAndRenderKeyframe = (): boolean => {
    const keyframe = keyframeManager.addKeyframe();
    if (!keyframe) {
      return false;
    }

    selectedKeyframeId = keyframe.id;
    renderKeyframeList();
    updatePathControlsState();
    syncPathVisualsState();
    setStatusNote(`Captured keyframe ${keyframeManager.getKeyframes().length} at ${formatSeconds(keyframe.time)}.`);

    return true;
  };

  const walkControls = new WalkControls({
    camera,
    canvas: interactionSurface,
    onLockError: () => {
      queuedWalkStatusMessage = 'Walk mode could not capture the cursor. Press 2 to try again.';
      suppressWalkExitStatus = false;
    },
    onStateChange: nextState => {
      const previousState = walkState;
      walkState = nextState;
      setNavigationModeUI(walkState);
      if (walkState === 'inactive') {
        if (previousState === 'active') {
          viewer.resumeOrbitFromCamera();
        } else {
          viewer.setNavigationMode('orbit');
        }
        consumeQueuedWalkStatusMessage(previousState);
      } else {
        viewer.setNavigationMode('walk');
        if (walkState === 'armed') {
          setStatusNote('Capturing cursor for walk mode...');
        }
        if (walkState === 'active') {
          setStatusNote('Walk mode active. Press 1 or Esc to return to Inspect.');
        }
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
    sceneFileInput.disabled = !enabled;
    selectSceneFileButton.disabled = !enabled;
    loadButton.disabled = !enabled;

    document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(button => {
      button.disabled = !enabled;
    });

    document.querySelectorAll<HTMLButtonElement>('.preset-btn').forEach(button => {
      button.disabled = !enabled;
    });
  };

  const revokeSceneObjectUrl = (url: string | null) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  };

  const selectSceneSourceTab = (selectedTab: 'url' | 'file' | 'presets') => {
    document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(button => {
      button.classList.toggle('active', button.dataset['tab'] === selectedTab);
    });

    $('#tab-url').style.display = selectedTab === 'url' ? 'block' : 'none';
    $('#tab-file').style.display = selectedTab === 'file' ? 'block' : 'none';
    $('#tab-presets').style.display = selectedTab === 'presets' ? 'block' : 'none';
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

  const updatePerformanceControlsState = () => {
    const controllerState = adaptiveRenderBudgetController.getState();
    const sceneLoaded = isSceneLoaded();
    const exportActive = exportManager.isExporting();
    const totalSplatCount = sceneLoaded ? viewer.getSplatCount() : 0;
    const renderedSplatCount = sceneLoaded ? viewer.getRenderedSplatCount() : 0;

    adaptiveFpsButton.disabled = !sceneLoaded || exportActive;
    adaptiveFpsButton.classList.toggle('active', controllerState.enabled);
    adaptiveFpsButton.setAttribute('aria-pressed', String(controllerState.enabled));
    adaptiveFpsButton.textContent = controllerState.enabled ? 'Adaptive FPS On' : 'Adaptive FPS Off';

    targetFpsSlider.disabled = exportActive;
    targetFpsValue.textContent = String(controllerState.targetFps);
    performanceNote.textContent = buildAdaptiveRenderBudgetNote(controllerState, {
      fps: viewer.getFPS(),
      renderedSplatCount,
      totalSplatCount,
    });
  };

  const updatePathControlsState = () => {
    const keyframeCount = keyframeManager.getKeyframes().length;
    const sceneLoaded = isSceneLoaded();
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
    updatePerformanceControlsState();
    updatePathVisualsButton();
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
    stopWalkMode({ silent: true });
    pathOverlay.dispose();
    revokeSceneObjectUrl(currentSceneObjectUrl);
    viewer.dispose();
  });

  const loadScene = async (sourceInput: SceneLoadInput) => {
    const source = resolveSceneLoadSource(sourceInput);
    const previousSceneObjectUrl = currentSceneObjectUrl;
    const nextSceneObjectUrl = source.url.startsWith('blob:') ? source.url : null;

    stopWalkMode({ silent: true });
    keyframeManager.stopPreview();
    adaptiveRenderBudgetController.resetScene();
    viewer.setRenderBudget(null);
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
      await viewer.loadScene(source);
      keyframeManager.clear();
      selectedKeyframeId = null;
      sceneLoadInProgress = false;
      currentSceneObjectUrl = nextSceneObjectUrl;
      if (previousSceneObjectUrl !== nextSceneObjectUrl) {
        revokeSceneObjectUrl(previousSceneObjectUrl);
      }
      viewer.setRenderBudget(adaptiveRenderBudgetController.getState().budgetCount);
      renderKeyframeList();
      updatePathControlsState();
      syncPathVisualsState();
      updateTimelineUI(0, 0);
      setStatusNote('Scene loaded. Use Z/C to roll the camera, press K to capture keyframes, scrub the path, or preview a camera move.');
    } catch (error) {
      sceneLoadInProgress = false;
      currentSceneObjectUrl = null;
      if (previousSceneObjectUrl !== nextSceneObjectUrl) {
        revokeSceneObjectUrl(previousSceneObjectUrl);
      }
      if (nextSceneObjectUrl) {
        revokeSceneObjectUrl(nextSceneObjectUrl);
      }
      const message = error instanceof Error ? error.message : 'Unknown load error';
      progressLabel.textContent = `Error: ${message}`;
      setStatusNote('Scene load failed. Try another URL, preset, or local file.');
      updatePathControlsState();
      syncPathVisualsState();
    }
  };

  document.querySelectorAll<HTMLButtonElement>('.source-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedTab = tab.dataset['tab'];
      if (selectedTab === 'url' || selectedTab === 'file' || selectedTab === 'presets') {
        selectSceneSourceTab(selectedTab);
      }
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
      selectSceneSourceTab('url');
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

  selectSceneFileButton.addEventListener('click', () => {
    sceneFileInput.click();
  });

  sceneFileInput.addEventListener('change', () => {
    const file = sceneFileInput.files?.[0];
    sceneFileInput.value = '';

    if (!file) {
      return;
    }

    if (!SUPPORTED_LOCAL_SCENE_FILE_PATTERN.test(file.name)) {
      sceneFileNote.textContent = 'Unsupported local file. Choose a `.ply`, `.splat`, or `.ksplat` scene.';
      setStatusNote('Local scene selection failed. Choose a `.ply`, `.splat`, or `.ksplat` file.');
      return;
    }

    const localSceneSource: SceneLoadSource = {
      url: URL.createObjectURL(file),
      format: detectSceneFormat(file.name),
    };

    sceneFileNote.textContent = `${file.name} · ${formatFileSize(file.size)}`;
    void loadScene(localSceneSource);
  });

  targetFpsSlider.addEventListener('input', () => {
    adaptiveRenderBudgetController.setTargetFps(Number(targetFpsSlider.value));
    targetFpsSlider.value = String(adaptiveRenderBudgetController.getState().targetFps);
    updatePerformanceControlsState();
  });

  adaptiveFpsButton.addEventListener('click', () => {
    if (!isSceneLoaded() || exportManager.isExporting()) {
      return;
    }

    const nextEnabled = !adaptiveRenderBudgetController.getState().enabled;
    adaptiveRenderBudgetController.setEnabled(nextEnabled);
    viewer.setRenderBudget(adaptiveRenderBudgetController.getState().budgetCount);
    viewer.renderNow();
    updatePerformanceControlsState();
    setStatusNote(nextEnabled ? 'Adaptive FPS enabled for live viewing.' : 'Adaptive FPS disabled. Full quality restored.');
  });

  sceneUrlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      loadButton.click();
    }
  });

  document.addEventListener('keydown', event => {
    const action = resolveNavigationShortcutAction(event, {
      interactionLocked: isInteractionLocked(),
      sceneLoaded: isSceneLoaded(),
      walkState,
    });

    if (action === 'add-keyframe') {
      if (addAndRenderKeyframe()) {
        event.preventDefault();
      }
      return;
    }

    if (action === 'enter-walk') {
      if (enterWalkMode()) {
        event.preventDefault();
      }
      return;
    }

    if (action === 'exit-walk') {
      stopWalkMode({ statusMessage: 'Inspect mode active. Camera controls restored.' });
      event.preventDefault();
      return;
    }

    if (action === 'roll-left' || action === 'roll-right') {
      const rollRadians = action === 'roll-left' ? -CAMERA_ROLL_STEP_RADIANS : CAMERA_ROLL_STEP_RADIANS;
      const handled =
        walkState === 'active'
          ? walkControls.roll(rollRadians)
          : rollOrbitCamera(camera, rollRadians);

      if (handled) {
        event.preventDefault();
      }
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
      stopWalkMode({ statusMessage: 'Inspect mode active. Camera controls restored.' });
      return;
    }

    enterWalkMode();
  });

  addKeyframeButton.addEventListener('click', () => {
    addAndRenderKeyframe();
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

    stopWalkMode({ silent: true });

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
    stopWalkMode({ silent: true });
    keyframeManager.stopPreview();
    adaptiveRenderBudgetController.setSuspended(true);

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
      adaptiveRenderBudgetController.setSuspended(false);
      viewer.setRenderBudget(adaptiveRenderBudgetController.getState().budgetCount);
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
  setStatusNote('Ready to load a scene URL, preset, or local file.');
  selectSceneSourceTab('url');
  setNavigationModeUI(walkState);
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
    if (isSceneLoaded()) {
      const nextBudget = adaptiveRenderBudgetController.update({
        fps,
        renderedSplatCount: viewer.getRenderedSplatCount(),
        totalSplatCount: viewer.getSplatCount(),
      }, performance.now());
      if (viewer.getRenderBudget() !== nextBudget) {
        viewer.setRenderBudget(nextBudget);
      }
    } else {
      viewer.setRenderBudget(null);
    }
    statFps.textContent = String(fps);
    statFps.className = `val fps-val${fps < 20 ? ' bad' : fps < 45 ? ' warn' : ''}`;
    updatePerformanceControlsState();
  }, 500);
}

void main().catch(error => {
  console.error('Initialization failed', error);
  $('#progress-label').textContent = `Init error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  $('#status-note').textContent = 'Viewer initialization failed.';
});
