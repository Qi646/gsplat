import * as THREE from 'three';
import type { InterpolatedPose, Keyframe, SerializableVector3 } from '../types';
import type {
  AgenticDraftControls,
  AgenticPathCapture,
  AgenticPathDraft,
  AgenticPathMode,
  AgenticPathProgress,
  AgenticPathStrategyVersion,
} from './agenticPath';
import { AgenticPathGenerationError } from './agenticPath';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';

export type StepwiseMovePrimitive =
  | 'forward-short'
  | 'forward-medium'
  | 'back-short'
  | 'strafe-left-short'
  | 'strafe-right-short'
  | 'rise-short'
  | 'lower-short';
export type StepwiseRotatePrimitive =
  | 'yaw-left-small'
  | 'yaw-right-small'
  | 'yaw-left-medium'
  | 'yaw-right-medium'
  | 'pitch-up-small'
  | 'pitch-down-small';

export type StepwiseAction =
  | { type: 'move'; primitive: StepwiseMovePrimitive }
  | { type: 'rotate'; primitive: StepwiseRotatePrimitive }
  | { type: 'capture-image' }
  | { type: 'create-keyframe' };

export interface StepwiseMemoryCapture extends AgenticPathCapture {
  capturedAtStep: number;
}

export interface StepwiseActionHistoryEntry {
  action: StepwiseAction;
  note?: string;
  outcome: 'applied' | 'completed' | 'rejected' | 'stored';
  stepIndex: number;
}

interface StepwiseStepResponse {
  action?: StepwiseAction;
  complete: boolean;
  pathMode: AgenticPathMode;
  reason: string;
  warning?: string;
}

export interface StepwiseAgentOrchestratorOptions {
  fetchImpl?: typeof fetch;
  onProgress?: (progress: AgenticPathProgress) => void;
  timeoutMs?: number;
  viewer: ViewerAdapter;
}

export interface GenerateStepwiseDraftOptions {
  controls: AgenticDraftControls;
  existingKeyframes: Keyframe[];
  prompt: string;
}

const DEFAULT_GENERATION_TIMEOUT_MS = 60_000;
const MAX_DECISIONS = 24;
const MAX_MEMORY_CAPTURES = 12;
const MAX_KEYFRAMES = 8;
const MAX_REJECTIONS_WITHOUT_PROGRESS = 4;
const KEYFRAME_SPACING_SECONDS = 2.5;
const MIN_ROUTE_FACING_DOT = 0.35;

const MOVE_DISTANCE_MULTIPLIERS: Record<StepwiseMovePrimitive, number> = {
  'back-short': -0.07,
  'forward-medium': 0.18,
  'forward-short': 0.09,
  'lower-short': -0.06,
  'rise-short': 0.06,
  'strafe-left-short': -0.07,
  'strafe-right-short': 0.07,
};

const ROTATE_ANGLE_RADIANS: Record<StepwiseRotatePrimitive, number> = {
  'pitch-down-small': THREE.MathUtils.degToRad(-6),
  'pitch-up-small': THREE.MathUtils.degToRad(6),
  'yaw-left-medium': THREE.MathUtils.degToRad(12),
  'yaw-left-small': THREE.MathUtils.degToRad(6),
  'yaw-right-medium': THREE.MathUtils.degToRad(-12),
  'yaw-right-small': THREE.MathUtils.degToRad(-6),
};

export class StepwiseAgentOrchestrator {
  private readonly fetchImpl: typeof fetch;
  private generating = false;
  private generationTimeout: StepwiseGenerationTimeout | null = null;
  private readonly onProgress?: (progress: AgenticPathProgress) => void;
  private readonly timeoutMs: number;
  private readonly viewer: ViewerAdapter;

  constructor(options: StepwiseAgentOrchestratorOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.onProgress = options.onProgress;
    this.timeoutMs = Number.isFinite(options.timeoutMs) ? Math.max(1_000, options.timeoutMs ?? DEFAULT_GENERATION_TIMEOUT_MS) : DEFAULT_GENERATION_TIMEOUT_MS;
    this.viewer = options.viewer;
  }

  isGenerating(): boolean {
    return this.generating;
  }

  cancelGeneration(): boolean {
    if (!this.generating || !this.generationTimeout) {
      return false;
    }

    this.reportProgress({
      buttonLabel: 'Cancelling…',
      message: 'Canceling stepwise draft generation and restoring controls…',
      stage: 'cancelling',
    });
    this.generationTimeout.cancel('Stepwise draft generation canceled. Controls restored.');
    return true;
  }

  async generateDraft(options: GenerateStepwiseDraftOptions): Promise<AgenticPathDraft> {
    if (this.generating) {
      throw new AgenticPathGenerationError('Stepwise draft generation is already in progress.');
    }

    const prompt = options.prompt.trim();
    if (!prompt) {
      throw new AgenticPathGenerationError('Enter a camera-path prompt before generating a draft.');
    }
    if (!this.viewer.isSceneLoaded()) {
      throw new AgenticPathGenerationError('Load a scene before generating a camera-path draft.');
    }

    const camera = this.viewer.getCamera();
    const bounds = this.viewer.getSceneBounds();
    if (!camera || !bounds) {
      throw new AgenticPathGenerationError('Scene bounds or camera state are unavailable for path generation.');
    }

    const livePose = clonePoseFromCamera(camera);
    const timeout = new StepwiseGenerationTimeout(this.timeoutMs);
    const strategyVersion: AgenticPathStrategyVersion = 'stepwise-v1';
    const draftControls = normalizeDraftControls(options.controls);
    const keyframes = options.existingKeyframes.map(cloneKeyframe);
    const memoryCaptures: StepwiseMemoryCapture[] = [];
    const actionHistory: StepwiseActionHistoryEntry[] = [];
    let pathMode: AgenticPathMode = 'subject-centric';
    let warning: string | undefined;
    let stalledRejections = 0;

    this.generating = true;
    this.generationTimeout = timeout;

    try {
      for (let stepIndex = 0; stepIndex < MAX_DECISIONS; stepIndex += 1) {
        timeout.throwIfAborted('running the stepwise draft loop');
        this.reportProgress({
          buttonLabel: `Step ${stepIndex + 1}/${MAX_DECISIONS}…`,
          message: `Capturing and evaluating step ${stepIndex + 1} for the experimental stepwise draft…`,
          stage: 'capture-round-1',
        });

        await this.renderFrame(timeout, 'capturing the stepwise current view');
        const currentCamera = this.viewer.getCamera();
        if (!currentCamera) {
          throw new AgenticPathGenerationError('Viewer camera became unavailable during stepwise draft generation.');
        }

        const currentCapture = await this.captureCurrentView(
          `step-${stepIndex + 1}-current`,
          'current',
          currentCamera,
          timeout,
          'capturing the stepwise current view',
        );
        const response = await this.requestNextAction({
          actionHistory,
          currentCapture,
          draftControls,
          draftKeyframes: keyframes,
          memoryCaptures,
          prompt,
          sceneBounds: serializeBounds(bounds),
          stepIndex,
          strategyVersion,
        }, timeout);

        pathMode = response.pathMode;
        warning = response.warning ?? warning;

        if (response.complete) {
          actionHistory.push({
            action: response.action ?? { type: 'create-keyframe' },
            note: response.reason,
            outcome: 'completed',
            stepIndex,
          });
          break;
        }

        const action = response.action;
        if (!action) {
          throw new AgenticPathGenerationError('The stepwise planner returned no action.');
        }

        if (action.type === 'capture-image') {
          memoryCaptures.push({
            ...currentCapture,
            capturedAtStep: stepIndex,
          });
          if (memoryCaptures.length > MAX_MEMORY_CAPTURES) {
            memoryCaptures.shift();
          }
          actionHistory.push({
            action,
            note: response.reason,
            outcome: 'stored',
            stepIndex,
          });
          stalledRejections = 0;
          continue;
        }

        if (action.type === 'create-keyframe') {
          if (keyframes.length >= MAX_KEYFRAMES) {
            actionHistory.push({
              action,
              note: 'Rejected because the draft already reached the keyframe cap.',
              outcome: 'rejected',
              stepIndex,
            });
            stalledRejections += 1;
          } else {
            const keyframe = captureKeyframeFromCamera(currentCamera, keyframes.at(-1)?.time ?? null);
            keyframes.push(keyframe);
            actionHistory.push({
              action,
              note: response.reason,
              outcome: 'stored',
              stepIndex,
            });
            stalledRejections = 0;
          }
          if (stalledRejections >= MAX_REJECTIONS_WITHOUT_PROGRESS) {
            break;
          }
          continue;
        }

        const nextPose = applyDeterministicAction(action, currentCamera, bounds);
        const safetyResult = validateStepPose(nextPose, bounds, pathMode);
        if (!safetyResult.valid) {
          actionHistory.push({
            action,
            note: safetyResult.reason,
            outcome: 'rejected',
            stepIndex,
          });
          stalledRejections += 1;
          if (stalledRejections >= MAX_REJECTIONS_WITHOUT_PROGRESS) {
            break;
          }
          continue;
        }

        this.viewer.applyCameraPose(nextPose);
        this.viewer.renderNow();
        actionHistory.push({
          action,
          note: response.reason,
          outcome: 'applied',
          stepIndex,
        });
        stalledRejections = 0;
      }
    } finally {
      timeout.dispose();
      this.generating = false;
      this.generationTimeout = null;
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }

    if (keyframes.length < 2) {
      throw new AgenticPathGenerationError(
        'The experimental stepwise agent did not create enough draft keyframes. Try reframing the scene or regenerating.',
      );
    }

    return {
      draftId: crypto.randomUUID(),
      groundedRoute: null,
      groundedSubject: null,
      keyframes,
      segments: [],
      summary: buildDraftSummary(pathMode, keyframes.length, memoryCaptures.length),
      warning,
    };
  }

  private async requestNextAction(
    request: {
      actionHistory: StepwiseActionHistoryEntry[];
      currentCapture: AgenticPathCapture;
      draftControls: AgenticDraftControls;
      draftKeyframes: Keyframe[];
      memoryCaptures: StepwiseMemoryCapture[];
      prompt: string;
      sceneBounds: SerializedBounds;
      stepIndex: number;
      strategyVersion: 'stepwise-v1';
    },
    timeout: StepwiseGenerationTimeout,
  ): Promise<StepwiseStepResponse> {
    this.reportProgress({
      buttonLabel: `Thinking ${request.stepIndex + 1}/${MAX_DECISIONS}…`,
      message: 'Choosing the next deterministic move for the experimental stepwise draft…',
      stage: 'grounding',
    });

    const response = await timeout.runStep(() => this.fetchImpl('/api/path/step', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: timeout.signal,
    }), 'waiting for the stepwise planner response');

    if (!response.ok) {
      throw new AgenticPathGenerationError(
        await timeout.runStep(() => readAgenticPathError(response), 'reading the stepwise planner error response'),
      );
    }

    return parseStepResponse(
      await timeout.runStep(() => response.json() as Promise<unknown>, 'reading the stepwise planner response'),
    );
  }

  private async captureCurrentView(
    id: string,
    role: 'current' | 'scout',
    camera: THREE.PerspectiveCamera,
    timeout: StepwiseGenerationTimeout,
    context: string,
  ): Promise<AgenticPathCapture> {
    const frame = await timeout.runStep(() => this.viewer.captureFrame(), context);
    const image = await timeout.runStep(() => blobToJpegDataUrl(frame), context);

    return {
      camera: serializeCamera(camera),
      height: image.height,
      id,
      imageDataUrl: image.dataUrl,
      role,
      width: image.width,
    };
  }

  private async renderFrame(timeout: StepwiseGenerationTimeout, context: string): Promise<void> {
    timeout.throwIfAborted(context);
    this.viewer.renderNow();
    await timeout.runStep(waitForNextAnimationFrame, context);
  }

  private reportProgress(progress: AgenticPathProgress): void {
    this.onProgress?.(progress);
  }
}

interface SerializedBounds {
  max: SerializableVector3;
  min: SerializableVector3;
}

function captureKeyframeFromCamera(camera: THREE.PerspectiveCamera, lastTime: number | null): Keyframe {
  return {
    fov: camera.fov,
    id: crypto.randomUUID(),
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    quaternion: {
      w: camera.quaternion.w,
      x: camera.quaternion.x,
      y: camera.quaternion.y,
      z: camera.quaternion.z,
    },
    time: lastTime === null ? 0 : lastTime + KEYFRAME_SPACING_SECONDS,
  };
}

function buildDraftSummary(pathMode: AgenticPathMode, keyframeCount: number, memoryCaptureCount: number): string {
  const modeLabel = pathMode === 'route-following' ? 'route-following' : 'subject-centric';
  return `Experimental ${modeLabel} stepwise draft with ${keyframeCount} keyframes and ${memoryCaptureCount} remembered captures.`;
}

function applyDeterministicAction(
  action: Extract<StepwiseAction, { type: 'move' | 'rotate' }>,
  camera: THREE.PerspectiveCamera,
  bounds: THREE.Box3,
): InterpolatedPose {
  const nextPosition = camera.position.clone();
  const nextQuaternion = camera.quaternion.clone();
  const sceneScale = Math.max(bounds.getSize(new THREE.Vector3()).length(), 1);

  if (action.type === 'move') {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(nextQuaternion).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(nextQuaternion).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const distance = sceneScale * Math.abs(MOVE_DISTANCE_MULTIPLIERS[action.primitive]);

    switch (action.primitive) {
      case 'forward-short':
      case 'forward-medium':
      case 'back-short':
        nextPosition.addScaledVector(forward, sceneScale * MOVE_DISTANCE_MULTIPLIERS[action.primitive]);
        break;
      case 'strafe-left-short':
      case 'strafe-right-short':
        nextPosition.addScaledVector(right, sceneScale * MOVE_DISTANCE_MULTIPLIERS[action.primitive]);
        break;
      case 'rise-short':
      case 'lower-short':
        nextPosition.addScaledVector(up, sceneScale * MOVE_DISTANCE_MULTIPLIERS[action.primitive]);
        break;
    }

    if (distance <= 0) {
      throw new AgenticPathGenerationError('Invalid stepwise move distance.');
    }
  } else {
    const angle = ROTATE_ANGLE_RADIANS[action.primitive];
    const rotationAxis = action.primitive.startsWith('yaw')
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0).applyQuaternion(nextQuaternion).normalize();
    const rotation = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
    nextQuaternion.premultiply(rotation).normalize();
  }

  return {
    fov: camera.fov,
    position: nextPosition,
    quaternion: nextQuaternion,
  };
}

function validateStepPose(pose: InterpolatedPose, bounds: THREE.Box3, pathMode: AgenticPathMode): { reason?: string; valid: boolean } {
  const margin = Math.max(bounds.getSize(new THREE.Vector3()).length() * 0.04, 0.15);
  const expandedBounds = bounds.clone().expandByScalar(margin);
  if (!expandedBounds.containsPoint(pose.position)) {
    return {
      reason: 'Rejected because the step would leave the supported scene volume.',
      valid: false,
    };
  }

  const minHeight = bounds.min.y + margin * 0.5;
  if (pose.position.y < minHeight) {
    return {
      reason: 'Rejected because the step would dip below the floor clearance limit.',
      valid: false,
    };
  }

  if (pathMode === 'route-following') {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(pose.quaternion).normalize();
    if (forward.dot(new THREE.Vector3(0, 0, -1)) > -MIN_ROUTE_FACING_DOT) {
      return {
        reason: 'Rejected because the route-following view would turn too far away from forward travel.',
        valid: false,
      };
    }
  }

  return { valid: true };
}

function clonePoseFromCamera(camera: THREE.PerspectiveCamera): InterpolatedPose {
  return {
    fov: camera.fov,
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
  };
}

function cloneKeyframe(keyframe: Keyframe): Keyframe {
  return {
    fov: keyframe.fov,
    id: keyframe.id,
    position: { ...keyframe.position },
    quaternion: { ...keyframe.quaternion },
    time: keyframe.time,
  };
}

function normalizeDraftControls(controls: AgenticDraftControls): AgenticDraftControls {
  return {
    holdPreference: controls.holdPreference,
    requestedDurationSeconds: Number.isFinite(controls.requestedDurationSeconds)
      ? controls.requestedDurationSeconds
      : null,
  };
}

function serializeBounds(bounds: THREE.Box3): SerializedBounds {
  return {
    max: { x: bounds.max.x, y: bounds.max.y, z: bounds.max.z },
    min: { x: bounds.min.x, y: bounds.min.y, z: bounds.min.z },
  };
}

function serializeCamera(camera: THREE.PerspectiveCamera): AgenticPathCapture['camera'] {
  return {
    aspect: camera.aspect,
    fov: camera.fov,
    position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
    quaternion: {
      w: camera.quaternion.w,
      x: camera.quaternion.x,
      y: camera.quaternion.y,
      z: camera.quaternion.z,
    },
  };
}

function parseStepResponse(input: unknown): StepwiseStepResponse {
  if (typeof input !== 'object' || input === null) {
    throw new AgenticPathGenerationError('The stepwise planner returned an invalid response.');
  }

  const record = input as Record<string, unknown>;
  const pathMode = parsePathMode(record['pathMode']);
  const complete = record['complete'] === true;
  const reason = typeof record['reason'] === 'string' && record['reason'].trim().length > 0
    ? record['reason'].trim()
    : 'No rationale provided.';
  const warning = typeof record['warning'] === 'string' && record['warning'].trim().length > 0
    ? record['warning'].trim()
    : undefined;
  const action = record['action'] === undefined || record['action'] === null
    ? undefined
    : parseStepAction(record['action']);

  if (!complete && !action) {
    throw new AgenticPathGenerationError('The stepwise planner must choose an action unless it has completed the draft.');
  }

  return {
    action,
    complete,
    pathMode,
    reason,
    warning,
  };
}

function parsePathMode(value: unknown): AgenticPathMode {
  return value === 'route-following' ? 'route-following'
    : value === 'multi-subject' ? 'multi-subject'
      : value === 'ambiguous' ? 'ambiguous'
        : 'subject-centric';
}

function parseStepAction(value: unknown): StepwiseAction {
  if (typeof value !== 'object' || value === null) {
    throw new AgenticPathGenerationError('The stepwise planner returned an invalid action.');
  }

  const record = value as Record<string, unknown>;
  const type = record['type'];
  if (type === 'capture-image' || type === 'create-keyframe') {
    return { type };
  }
  if (type === 'move') {
    const primitive = record['primitive'];
    if (
      primitive === 'forward-short'
      || primitive === 'forward-medium'
      || primitive === 'back-short'
      || primitive === 'strafe-left-short'
      || primitive === 'strafe-right-short'
      || primitive === 'rise-short'
      || primitive === 'lower-short'
    ) {
      return { primitive, type };
    }
  }
  if (type === 'rotate') {
    const primitive = record['primitive'];
    if (
      primitive === 'yaw-left-small'
      || primitive === 'yaw-right-small'
      || primitive === 'yaw-left-medium'
      || primitive === 'yaw-right-medium'
      || primitive === 'pitch-up-small'
      || primitive === 'pitch-down-small'
    ) {
      return { primitive, type };
    }
  }

  throw new AgenticPathGenerationError('The stepwise planner returned an unsupported action.');
}

async function blobToJpegDataUrl(blob: Blob): Promise<{ dataUrl: string; height: number; width: number }> {
  const imageBitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new AgenticPathGenerationError('Could not create an image canvas for draft capture.');
    }
    context.drawImage(imageBitmap, 0, 0);
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.85),
      height: canvas.height,
      width: canvas.width,
    };
  } finally {
    imageBitmap.close();
  }
}

async function readAgenticPathError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { error?: unknown };
    if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
      return payload.error.trim();
    }
  } catch {
    // Fall back to plain text below.
  }

  const text = await response.text();
  return text.trim() || 'Could not generate an agentic camera-path draft from that prompt.';
}

function waitForNextAnimationFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

class StepwiseGenerationTimeout {
  readonly controller = new AbortController();
  readonly signal = this.controller.signal;
  private abortReason: Error | null = null;
  private readonly timeoutId: ReturnType<typeof setTimeout>;

  constructor(timeoutMs: number) {
    this.timeoutId = setTimeout(() => {
      this.abortReason = new AgenticPathGenerationError('Stepwise draft generation timed out. Controls restored.');
      this.controller.abort(this.abortReason);
    }, timeoutMs);
  }

  cancel(message: string): void {
    if (this.abortReason) {
      return;
    }

    this.abortReason = new AgenticPathGenerationError(message);
    this.controller.abort(this.abortReason);
    clearTimeout(this.timeoutId);
  }

  async runStep<T>(step: () => Promise<T>, context: string): Promise<T> {
    this.throwIfAborted(context);
    try {
      return await step();
    } catch (error) {
      this.throwIfAborted(context);
      throw error;
    }
  }

  throwIfAborted(_context: string): void {
    if (this.abortReason) {
      throw this.abortReason;
    }
  }

  dispose(): void {
    clearTimeout(this.timeoutId);
  }
}
