import { WalkControls, type WalkControlState } from './controls/WalkControls';
import {
  getNavigationModePresentation,
  resolveNavigationShortcutAction,
} from './controls/navigationMode';
import { ExportManager, type ExportProgress } from './export/ExportManager';
import {
  DEFAULT_EXPORT_PLAN_SETTINGS,
  EXPORT_PROFILES,
  buildExportPlanDocument,
  buildExportPlanSummary,
  buildExportSettingsList,
  getExportProfile,
  parseImportedExportDocument,
  resolveExportPlanSettings,
  type ExportPlanSettings,
} from './export/exportPlan';
import { parseAppRuntimeQuery } from './lib/runtimeQuery';
import { detectSceneFormat } from './lib/sceneFormat';
import { resolveSceneLoadSource, type SceneLoadInput, type SceneLoadSource } from './lib/sceneSource';
import { SCENE_PRESETS } from './lib/scenePresets';
import { AgenticPathGenerator, type AgenticPathProgress } from './path/agenticPath';
import {
  buildAgenticPathFailureFeedback,
  type AgenticPathFailureFeedback,
} from './path/agenticPathFeedback';
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

interface AgenticPathStatus {
  available: boolean;
  model: string | null;
  reason: string | null;
}

function $(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

function setNavigationModeUI(state: WalkControlState): void {
  const presentation = getNavigationModePresentation(state);
  const isWalkMode = presentation.engaged;
  ($('#btn-inspect-mode') as HTMLButtonElement).classList.toggle('active', !isWalkMode);
  ($('#btn-walk-mode') as HTMLButtonElement).classList.toggle('active', isWalkMode);
  $('#walkmode-hud').classList.toggle('visible', presentation.engaged);
  $('#walkmode-hud').textContent = presentation.hudMessage;
}

function setSceneButtonsEnabled(sceneLoaded: boolean, previewActive: boolean, walkState: WalkControlState): void {
  const walkModeEngaged = walkState !== 'inactive';

  ($('#btn-frame-scene') as HTMLButtonElement).disabled = !sceneLoaded || previewActive || walkModeEngaged;
  ($('#btn-reset-view') as HTMLButtonElement).disabled = !sceneLoaded || previewActive || walkModeEngaged;
  ($('#btn-walk-mode') as HTMLButtonElement).disabled = !sceneLoaded || previewActive;
  ($('#btn-inspect-mode') as HTMLButtonElement).disabled = false;
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

function parseAgenticPathStatus(input: unknown): AgenticPathStatus {
  if (typeof input !== 'object' || input === null) {
    return {
      available: false,
      model: null,
      reason: 'Agentic path generation is unavailable because the server capability check returned invalid data.',
    };
  }

  const record = input as Record<string, unknown>;
  return {
    available: record['available'] === true,
    model: typeof record['model'] === 'string' ? record['model'] : null,
    reason: typeof record['reason'] === 'string' ? record['reason'] : null,
  };
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
  const cancelExportButton = $('#btn-cancel-export') as HTMLButtonElement;
  const saveExportPlanButton = $('#btn-save-export-plan') as HTMLButtonElement;
  const exportNote = $('#export-note');
  const exportProfileSelect = $('#export-profile-select') as HTMLSelectElement;
  const exportFpsInput = $('#export-fps-input') as HTMLInputElement;
  const exportFileBaseInput = $('#export-file-base-input') as HTMLInputElement;
  const agenticPathNote = $('#agentic-path-note');
  const agenticPathFeedback = $('#agentic-path-feedback');
  const agenticPathFeedbackTitle = $('#agentic-path-feedback-title');
  const agenticPathFeedbackMessage = $('#agentic-path-feedback-message');
  const agenticPathFeedbackDetail = $('#agentic-path-feedback-detail');
  const agenticPathBlocker = $('#agentic-path-blocker');
  const cancelGeneratePathBlockerButton = $('#btn-cancel-generate-path-blocker') as HTMLButtonElement;
  const agenticPathBlockerMessage = $('#agentic-path-blocker-message');
  const pathPromptInput = $('#path-prompt-input') as HTMLTextAreaElement;
  const generatePathButton = $('#btn-generate-path') as HTMLButtonElement;
  const agenticPromptButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-agentic-prompt]'));
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
  const agenticPathGenerator = new AgenticPathGenerator({
    onProgress: progress => {
      agenticPathProgress = progress;
      updatePathControlsState();
      setStatusNote(progress.message);
    },
    viewer,
  });
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
  let exportPlanSettings: ExportPlanSettings = { ...DEFAULT_EXPORT_PLAN_SETTINGS };
  let currentExportProgress: ExportProgress | null = null;
  let agenticPathProgress: AgenticPathProgress | null = null;
  let agenticPathFailure: AgenticPathFailureFeedback | null = null;
  let agenticPathStatus: AgenticPathStatus = {
    available: false,
    model: null,
    reason: 'Checking whether agentic path generation is available on the server…',
  };
  const isSceneLoaded = () => !sceneLoadInProgress && viewer.isSceneLoaded();
  const isInteractionLocked = () =>
    keyframeManager.isPreviewActive() || exportManager.isExporting() || agenticPathGenerator.isGenerating();
  targetFpsSlider.min = String(adaptiveRenderBudgetController.getState().minTargetFps);
  targetFpsSlider.max = String(adaptiveRenderBudgetController.getState().maxTargetFps);
  targetFpsSlider.step = String(adaptiveRenderBudgetController.getState().sliderStep);
  targetFpsSlider.value = String(adaptiveRenderBudgetController.getState().targetFps);
  EXPORT_PROFILES.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.label;
    exportProfileSelect.appendChild(option);
  });

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
        setStatusNote('Fly mode exited. Camera controls restored.');
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
      queuedWalkStatusMessage = 'Fly mode could not capture the cursor. Press 2 to try again.';
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
          setStatusNote('Capturing cursor for fly mode...');
        }
        if (walkState === 'active') {
          setStatusNote('Fly mode active. Press 1 or Esc to return to Inspect.');
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

  const buildIdleExportNote = () => {
    const summary = buildExportPlanSummary(exportPlanSettings);
    const targetCount = buildExportSettingsList(exportPlanSettings).length;
    return targetCount > 1 ? `${summary} · ${targetCount} MP4s` : summary;
  };

  const updateExportButton = (progress: ExportProgress | null = currentExportProgress) => {
    if (!exportManager.isExporting()) {
      exportButton.textContent = '⬇ Export MP4';
      cancelExportButton.textContent = '✕ Cancel';
      exportNote.textContent = buildIdleExportNote();
      return;
    }

    const percent = Math.round(progress?.percent ?? 0);
    const batchProgressLabel =
      progress && progress.totalJobs > 1 ? ` ${progress.currentJobIndex}/${progress.totalJobs}` : '';
    exportButton.textContent = `⬇ Exporting${batchProgressLabel} ${percent}%`;
    cancelExportButton.textContent =
      exportManager.isCancelling() || progress?.stage === 'cancelling' ? '✕ Cancelling…' : '✕ Cancel';
    exportNote.textContent = progress?.message ?? 'Exporting path to MP4…';
  };

  const applyExportPlanSettings = (nextSettings: Partial<ExportPlanSettings> | undefined) => {
    exportPlanSettings = resolveExportPlanSettings(nextSettings);
    exportProfileSelect.value = exportPlanSettings.profileId;
    exportFpsInput.value = String(exportPlanSettings.fps);
    exportFileBaseInput.value = exportPlanSettings.fileBaseName;
    updateExportButton(currentExportProgress);
  };

  const syncExportPlanSettingsFromControls = (): boolean => {
    try {
      applyExportPlanSettings({
        fileBaseName: exportFileBaseInput.value,
        fps: Number(exportFpsInput.value),
        profileId: exportProfileSelect.value as ExportPlanSettings['profileId'],
      });
      return true;
    } catch (error) {
      applyExportPlanSettings(exportPlanSettings);
      setStatusNote(error instanceof Error ? error.message : 'Invalid export settings.');
      return false;
    }
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

  const updateAgenticPathNote = () => {
    if (agenticPathGenerator.isGenerating()) {
      agenticPathNote.textContent =
        agenticPathProgress?.message ?? 'Generating a camera path. Viewer controls are temporarily locked.';
      return;
    }

    if (!agenticPathStatus.available) {
      agenticPathNote.textContent =
        agenticPathStatus.reason ?? 'Agentic path generation is currently unavailable.';
      return;
    }

    if (!isSceneLoaded()) {
      agenticPathNote.textContent =
        'Load a scene to enable prompt-driven orbit generation. It uses the current view plus four nearby multi-axis scout captures.';
      return;
    }

    const modelLabel = agenticPathStatus.model ? ` Using ${agenticPathStatus.model}.` : '';
    agenticPathNote.textContent =
      `Prompt a cinematic orbit and append generated keyframes based on the current view plus four nearby multi-axis scout captures.${modelLabel}`;
  };

  const updateAgenticPathBlocker = () => {
    const generationActive = agenticPathGenerator.isGenerating();
    agenticPathBlocker.classList.toggle('active', generationActive);
    agenticPathBlocker.setAttribute('aria-hidden', String(!generationActive));
    agenticPathBlockerMessage.textContent = generationActive
      ? agenticPathProgress?.message ?? 'Generating a camera path. Viewer controls are temporarily locked.'
      : '';
  };

  const updateAgenticPathFeedback = () => {
    const visible = !agenticPathGenerator.isGenerating() && agenticPathFailure !== null;
    agenticPathFeedback.hidden = !visible;
    agenticPathFeedback.classList.toggle('visible', visible);
    agenticPathFeedback.setAttribute('aria-hidden', String(!visible));

    if (!visible || !agenticPathFailure) {
      agenticPathFeedbackTitle.textContent = '';
      agenticPathFeedbackMessage.textContent = '';
      agenticPathFeedbackDetail.textContent = '';
      return;
    }

    agenticPathFeedbackTitle.textContent = agenticPathFailure.title;
    agenticPathFeedbackMessage.textContent = agenticPathFailure.message;
    agenticPathFeedbackDetail.textContent = agenticPathFailure.detail;
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
    const exportCancelling = exportManager.isCancelling();
    const generationActive = agenticPathGenerator.isGenerating();
    const generationCancelling = agenticPathProgress?.stage === 'cancelling';
    const interactionLocked = previewActive || exportActive || generationActive;

    addKeyframeButton.disabled = !sceneLoaded || exportActive || generationActive;
    clearKeyframesButton.disabled = keyframeCount === 0 || exportActive || generationActive;
    previewButton.disabled = !sceneLoaded || keyframeCount < 2 || exportActive || generationActive;
    savePathButton.disabled = keyframeCount === 0 || exportActive || generationActive;
    saveExportPlanButton.disabled = keyframeCount === 0 || exportActive || generationActive;
    loadPathButton.disabled = !sceneLoaded || exportActive || generationActive;
    timelineScrubber.disabled = !sceneLoaded || keyframeCount < 2 || exportActive || generationActive;
    exportButton.disabled = !sceneLoaded || keyframeCount < 2 || exportActive || generationActive;
    cancelExportButton.disabled = !exportActive || exportCancelling;
    exportProfileSelect.disabled = exportActive || generationActive;
    exportFpsInput.disabled = exportActive || generationActive;
    exportFileBaseInput.disabled = exportActive || generationActive;
    pathPromptInput.disabled = !sceneLoaded || exportActive || generationActive || !agenticPathStatus.available;
    generatePathButton.disabled =
      !sceneLoaded
      || exportActive
      || generationActive
      || !agenticPathStatus.available
      || pathPromptInput.value.trim().length === 0;
    generatePathButton.classList.toggle('active', generationActive);
    generatePathButton.textContent = generationActive
      ? agenticPathProgress?.buttonLabel ?? 'Generating…'
      : '✨ Generate Path';
    cancelGeneratePathBlockerButton.disabled = !generationActive || generationCancelling;
    cancelGeneratePathBlockerButton.textContent = generationCancelling ? 'Cancelling…' : 'Cancel';
    agenticPromptButtons.forEach(button => {
      button.disabled = !sceneLoaded || exportActive || generationActive || !agenticPathStatus.available;
    });
    setSceneButtonsEnabled(sceneLoaded, interactionLocked, walkState);
    setSceneSourceEnabled(!exportActive && !generationActive);
    setExportInteractionLock(exportActive || generationActive);
    updatePreviewButton();
    updateExportButton(currentExportProgress);
    updatePerformanceControlsState();
    updatePathVisualsButton();
    updateAgenticPathNote();
    updateAgenticPathBlocker();
    updateAgenticPathFeedback();
  };

  const loadAgenticPathStatus = async () => {
    try {
      const response = await fetch('/api/path/status');
      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      agenticPathStatus = parseAgenticPathStatus(await response.json() as unknown);
      if (!agenticPathStatus.available && !agenticPathStatus.reason) {
        agenticPathStatus = {
          available: false,
          model: agenticPathStatus.model,
          reason: 'Agentic path generation is unavailable on this server.',
        };
      }
    } catch {
      agenticPathStatus = {
        available: false,
        model: null,
        reason: 'Agentic path generation is unavailable because the server capability check failed.',
      };
    }

    updatePathControlsState();
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
    agenticPathFailure = null;
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
      setStatusNote('Scene loaded. Use Z/C to roll the camera, press K to capture keyframes, generate an orbit prompt, scrub the path, or preview a camera move.');
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

  exportProfileSelect.addEventListener('change', () => {
    const previousProfileId = exportPlanSettings.profileId;
    if (!syncExportPlanSettingsFromControls()) {
      return;
    }

    if (previousProfileId !== exportPlanSettings.profileId) {
      setStatusNote(`Export profile set to ${getExportProfile(exportPlanSettings.profileId).label}.`);
    }
  });

  exportFpsInput.addEventListener('change', () => {
    const previousFps = exportPlanSettings.fps;
    if (!syncExportPlanSettingsFromControls()) {
      return;
    }

    if (previousFps !== exportPlanSettings.fps) {
      setStatusNote(`Export FPS set to ${exportPlanSettings.fps}.`);
    }
  });

  exportFileBaseInput.addEventListener('change', () => {
    const previousFileBaseName = exportPlanSettings.fileBaseName;
    if (!syncExportPlanSettingsFromControls()) {
      return;
    }

    if (previousFileBaseName !== exportPlanSettings.fileBaseName) {
      setStatusNote(`Export file base set to ${exportPlanSettings.fileBaseName}.`);
    }
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

  pathPromptInput.addEventListener('input', () => {
    agenticPathFailure = null;
    updatePathControlsState();
  });

  agenticPromptButtons.forEach(button => {
    button.addEventListener('click', () => {
      pathPromptInput.value = button.dataset['agenticPrompt'] ?? '';
      agenticPathFailure = null;
      pathPromptInput.focus();
      updatePathControlsState();
    });
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

  ($('#btn-inspect-mode') as HTMLButtonElement).addEventListener('click', () => {
    if (walkState !== 'inactive') {
      stopWalkMode({ statusMessage: 'Inspect mode active. Camera controls restored.' });
    }
  });

  addKeyframeButton.addEventListener('click', () => {
    addAndRenderKeyframe();
  });

  generatePathButton.addEventListener('click', async () => {
    const prompt = pathPromptInput.value.trim();
    if (!prompt || !isSceneLoaded() || exportManager.isExporting()) {
      return;
    }

    stopWalkMode({ silent: true });
    keyframeManager.stopPreview();
    agenticPathFailure = null;
    updatePathControlsState();
    syncPathVisualsState();

    try {
      const generatedKeyframes = await agenticPathGenerator.generatePath({
        existingKeyframes: keyframeManager.getKeyframes(),
        prompt,
      });
      agenticPathProgress = null;
      agenticPathFailure = null;
      const appendedKeyframes = keyframeManager.appendKeyframes(generatedKeyframes);
      selectedKeyframeId = appendedKeyframes[0]?.id ?? selectedKeyframeId;
      renderKeyframeList();
      updatePathControlsState();
      syncPathVisualsState();
      setStatusNote(
        `Appended ${appendedKeyframes.length} generated keyframe${appendedKeyframes.length === 1 ? '' : 's'} from the prompt.`,
      );
    } catch (error) {
      agenticPathProgress = null;
      agenticPathFailure = buildAgenticPathFailureFeedback(error);
      setStatusNote(agenticPathFailure.message);
    } finally {
      updatePathControlsState();
      syncPathVisualsState();
    }
  });

  cancelGeneratePathBlockerButton.addEventListener('click', () => {
    agenticPathGenerator.cancelGeneration();
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

    const keyframes = keyframeManager.getKeyframes();
    const selectedPreviewIndex = selectedKeyframeId
      ? keyframes.findIndex(keyframe => keyframe.id === selectedKeyframeId)
      : -1;
    const previewStartTime = selectedPreviewIndex >= 0 ? keyframes[selectedPreviewIndex]!.time : 0;

    if (keyframeManager.startPreview(previewStartTime)) {
      selectedKeyframeId = null;
      renderKeyframeList();
      updatePathControlsState();
      syncPathVisualsState();
      setStatusNote(
        selectedPreviewIndex >= 0
          ? `Previewing camera path from keyframe ${selectedPreviewIndex + 1}.`
          : 'Previewing camera path.',
      );
    }
  });

  savePathButton.addEventListener('click', () => {
    const path = keyframeManager.toJSON();
    const blob = new Blob([JSON.stringify(path, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'camera-path.json');
    setStatusNote(`Saved camera path with ${path.keyframes.length} keyframe${path.keyframes.length === 1 ? '' : 's'}.`);
  });

  saveExportPlanButton.addEventListener('click', () => {
    if (!syncExportPlanSettingsFromControls()) {
      return;
    }

    const path = keyframeManager.toJSON();
    const exportPlan = buildExportPlanDocument(path, exportPlanSettings);
    const blob = new Blob([JSON.stringify(exportPlan, null, 2)], { type: 'application/json' });
    const exportTargetCount = buildExportSettingsList(exportPlanSettings).length;
    downloadBlob(blob, 'camera-export-plan.json');
    setStatusNote(
      `Saved export plan with ${path.keyframes.length} keyframe${path.keyframes.length === 1 ? '' : 's'} and ${exportTargetCount} export target${exportTargetCount === 1 ? '' : 's'}.`,
    );
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
      const imported = parseImportedExportDocument(JSON.parse(text) as unknown);
      const path = keyframeManager.fromJSON(imported.cameraPath);
      if (imported.exportSettings) {
        applyExportPlanSettings(imported.exportSettings);
      }
      selectedKeyframeId = path.keyframes[0]?.id ?? null;
      renderKeyframeList();
      updatePathControlsState();
      syncPathVisualsState();
      if (imported.exportSettings) {
        const exportTargetCount = buildExportSettingsList(imported.exportSettings).length;
        setStatusNote(
          `Loaded export plan with ${path.keyframes.length} keyframe${path.keyframes.length === 1 ? '' : 's'} and ${exportTargetCount} export target${exportTargetCount === 1 ? '' : 's'}.`,
        );
      } else {
        setStatusNote(`Loaded camera path with ${path.keyframes.length} keyframe${path.keyframes.length === 1 ? '' : 's'}.`);
      }
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
    if (!syncExportPlanSettingsFromControls()) {
      return;
    }

    stopWalkMode({ silent: true });
    keyframeManager.stopPreview();
    adaptiveRenderBudgetController.setSuspended(true);
    currentExportProgress = null;
    const exportTargets = buildExportSettingsList(exportPlanSettings);
    const exportPromise = exportManager.exportBatch(keyframeManager.getKeyframes(), {
      onProgress: progress => {
        currentExportProgress = progress;
        updateExportButton(progress);
        setStatusNote(progress.message);
      },
      settingsList: exportTargets,
    });

    updatePathControlsState();
    syncPathVisualsState();

    try {
      const result = await exportPromise;
      result.results.forEach(exportResult => {
        downloadBlob(exportResult.blob, exportResult.fileName);
      });
      if (result.results.length === 1) {
        const singleResult = result.results[0];
        if (singleResult) {
          setStatusNote(
            `Export complete. Downloaded ${singleResult.fileName} with ${singleResult.totalFrames} frame${singleResult.totalFrames === 1 ? '' : 's'}.`,
          );
        }
      } else {
        setStatusNote(
          `Batch export complete. Downloaded ${result.results.length} MP4s: ${result.results.map(exportResult => exportResult.fileName).join(', ')}.`,
        );
      }
    } catch (error) {
      setStatusNote(error instanceof Error ? error.message : 'MP4 export failed.');
    } finally {
      currentExportProgress = null;
      adaptiveRenderBudgetController.setSuspended(false);
      viewer.setRenderBudget(adaptiveRenderBudgetController.getState().budgetCount);
      updatePathControlsState();
      syncPathVisualsState();
    }
  });

  cancelExportButton.addEventListener('click', () => {
    if (!exportManager.cancelExport()) {
      return;
    }

    updatePathControlsState();
    setStatusNote('Cancelling export…');
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

  await loadAgenticPathStatus();
  renderKeyframeList();
  applyExportPlanSettings(DEFAULT_EXPORT_PLAN_SETTINGS);
  setStatusNote('Ready to load a scene URL, preset, or local file.');
  selectSceneSourceTab('url');
  setNavigationModeUI(walkState);
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
