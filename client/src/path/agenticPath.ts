import * as THREE from 'three';
import type { InterpolatedPose, Keyframe, SerializableQuaternion, SerializableVector3 } from '../types';
import { computeFramedSceneView } from '../viewer/sceneFraming';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';
import { PathInterpolator } from './PathInterpolator';

export type AgenticOrientationMode = 'look-at-subject' | 'look-forward';
export type AgenticOrbitDirection = 'clockwise' | 'counterclockwise';
export type AgenticVerticalBias = 'low' | 'mid' | 'high';
export type AgenticPathMode = 'subject-centric' | 'route-following' | 'multi-subject' | 'ambiguous';
export type AgenticPathSegmentType = 'hold' | 'arc' | 'dolly' | 'pedestal';
export type AgenticDollyDirection = 'in' | 'out';
export type AgenticPedestalDirection = 'up' | 'down';

export interface AgenticPathCapture {
  camera: SerializedCaptureCamera;
  height: number;
  id: string;
  imageDataUrl: string;
  role: 'current' | 'scout';
  width: number;
}

export interface AgenticSubjectLocalization {
  captureId: string;
  confidence: number;
  pixelX: number;
  pixelY: number;
}

export interface AgenticPromptIntent {
  continuousPath: true;
  orientationPreference: AgenticOrientationMode;
  pathMode: AgenticPathMode;
  requestedMoveTypes: AgenticPathSegmentType[];
  subjectHint: string | null;
  targetDurationSeconds: number | null;
  tone: string | null;
}

export interface AgenticGroundResponse {
  intent: AgenticPromptIntent;
  pathMode: AgenticPathMode;
  subjectLocalizations: AgenticSubjectLocalization[];
  unsupportedReason?: string;
  warning?: string;
}

export interface AgenticGroundedSubject {
  anchor: SerializableVector3;
  basisForward: SerializableVector3;
  basisUp: SerializableVector3;
  captureCount: number;
  confidence: number;
  meanResidual: number;
  sceneScale: number;
}

export interface AgenticPathStatus {
  available: boolean;
  capabilities: {
    maxCaptureRounds: number;
    maxSegments: number;
    segmentTypes: AgenticPathSegmentType[];
    supportedPathModes: AgenticPathMode[];
    unsupportedPathModes: AgenticPathMode[];
  };
  model: string | null;
  plannerVersion: 'multistep-v1';
  reason: string | null;
}

export interface AgenticBaseSegmentPlan {
  durationSeconds: number;
  fovDelta?: number;
  lookMode: AgenticOrientationMode;
  segmentType: AgenticPathSegmentType;
}

export interface AgenticHoldSegmentPlan extends AgenticBaseSegmentPlan {
  segmentType: 'hold';
}

export interface AgenticArcSegmentPlan extends AgenticBaseSegmentPlan {
  direction?: AgenticOrbitDirection;
  segmentType: 'arc';
  sweepDegrees?: number;
  verticalBias?: AgenticVerticalBias;
}

export interface AgenticDollySegmentPlan extends AgenticBaseSegmentPlan {
  distanceScale?: number;
  segmentType: 'dolly';
  travelDirection?: AgenticDollyDirection;
  verticalBias?: AgenticVerticalBias;
}

export interface AgenticPedestalSegmentPlan extends AgenticBaseSegmentPlan {
  heightScale?: number;
  segmentType: 'pedestal';
  travelDirection?: AgenticPedestalDirection;
}

export type AgenticPathSegmentPlan =
  | AgenticHoldSegmentPlan
  | AgenticArcSegmentPlan
  | AgenticDollySegmentPlan
  | AgenticPedestalSegmentPlan;

export interface AgenticComposeResponse {
  segments: AgenticPathSegmentPlan[];
  summary: string;
  warning?: string;
}

export interface AgenticPathDraft {
  draftId: string;
  groundedSubject: AgenticGroundedSubject;
  keyframes: Keyframe[];
  segments: AgenticPathSegmentPlan[];
  summary: string;
  warning?: string;
}

export interface AgenticPathProgress {
  buttonLabel: string;
  captureIndex?: number;
  captureRound?: number;
  message: string;
  stage:
    | 'capture-round-1'
    | 'grounding'
    | 'capture-round-2'
    | 'composing'
    | 'validating'
    | 'repairing'
    | 'cancelling';
  totalCaptures?: number;
}

export interface AgenticPathOrchestratorOptions {
  fetchImpl?: typeof fetch;
  onProgress?: (progress: AgenticPathProgress) => void;
  timeoutMs?: number;
  viewer: ViewerAdapter;
}

export interface GenerateAgenticDraftOptions {
  existingKeyframes: Keyframe[];
  prompt: string;
}

export interface BuildDraftPathOptions {
  basePose: InterpolatedPose;
  bounds: THREE.Box3;
  groundedSubject: AgenticGroundedSubject;
  segments: AgenticPathSegmentPlan[];
  startTime: number;
}

export interface AgenticDraftValidationResult {
  feedback: string[];
  valid: boolean;
}

interface AgenticGroundRequest {
  captureRound: number;
  captures: AgenticPathCapture[];
  currentCamera: SerializedCaptureCamera;
  pathTail: SerializedPathTail | null;
  prompt: string;
  sceneBounds: SerializedBounds;
}

interface AgenticComposeRequest {
  currentCamera: SerializedCaptureCamera;
  groundedSubject: AgenticGroundedSubject;
  intent: AgenticPromptIntent;
  pathTail: SerializedPathTail | null;
  sceneBounds: SerializedBounds;
  validationFeedback?: string[];
}

interface BuiltDraftPath {
  keyframes: Keyframe[];
  windows: SegmentWindow[];
}

interface OrbitFrame {
  axis: THREE.Vector3;
  height: number;
  radialDirection: THREE.Vector3;
  radius: number;
}

interface RayObservation {
  confidence: number;
  direction: THREE.Vector3;
  origin: THREE.Vector3;
}

interface ScoutPoseSpec {
  pitchRadians: number;
  yawRadians: number;
}

interface SegmentWindow {
  endTime: number;
  lookMode: AgenticOrientationMode;
  segmentType: AgenticPathSegmentType;
  startTime: number;
}

interface SegmentPoseSample {
  fov: number;
  position: THREE.Vector3;
}

interface SerializedBounds {
  max: SerializableVector3;
  min: SerializableVector3;
}

interface SerializedCaptureCamera {
  aspect: number;
  fov: number;
  position: SerializableVector3;
  quaternion: SerializableQuaternion;
}

interface SerializedPathTail {
  fov: number;
  position: SerializableVector3;
  quaternion: SerializableQuaternion;
  time: number;
}

type UnknownRecord = Record<string, unknown>;

const APPEND_BRIDGE_SECONDS = 1;
const DEFAULT_GENERATION_TIMEOUT_MS = 60_000;
const DEFAULT_LOOK_UP = new THREE.Vector3(0, 1, 0);
const MAX_CAPTURE_LONG_SIDE = 640;
const MAX_VALIDATION_FEEDBACK = 4;
const MIN_VECTOR_LENGTH_SQUARED = 1e-8;
const ROUND_ONE_TOTAL_CAPTURE_COUNT = 7;
const ROUND_TWO_TOTAL_CAPTURE_COUNT = 4;
const ROUND_ONE_SCOUT_POSE_SPECS: ScoutPoseSpec[] = [
  { pitchRadians: 0, yawRadians: THREE.MathUtils.degToRad(-16) },
  { pitchRadians: 0, yawRadians: THREE.MathUtils.degToRad(-8) },
  { pitchRadians: 0, yawRadians: THREE.MathUtils.degToRad(8) },
  { pitchRadians: 0, yawRadians: THREE.MathUtils.degToRad(16) },
  { pitchRadians: THREE.MathUtils.degToRad(-6), yawRadians: 0 },
  { pitchRadians: THREE.MathUtils.degToRad(6), yawRadians: 0 },
];
const ROUND_TWO_RESCAN_POSE_SPECS: ScoutPoseSpec[] = [
  { pitchRadians: 0, yawRadians: THREE.MathUtils.degToRad(-5) },
  { pitchRadians: 0, yawRadians: THREE.MathUtils.degToRad(5) },
  { pitchRadians: THREE.MathUtils.degToRad(-5), yawRadians: 0 },
  { pitchRadians: THREE.MathUtils.degToRad(5), yawRadians: 0 },
];
const SEGMENT_KEYFRAME_COUNT: Record<AgenticPathSegmentType, number> = {
  arc: 4,
  dolly: 3,
  hold: 2,
  pedestal: 3,
};
const VALIDATION_SAMPLE_STEP_SECONDS = 0.25;

export class AgenticPathGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgenticPathGenerationError';
  }
}

export class AgenticPathOrchestrator {
  private readonly fetchImpl: typeof fetch;
  private generating = false;
  private generationTimeout: AgenticGenerationTimeout | null = null;
  private readonly onProgress?: (progress: AgenticPathProgress) => void;
  private readonly timeoutMs: number;
  private readonly viewer: ViewerAdapter;

  constructor(options: AgenticPathOrchestratorOptions) {
    this.viewer = options.viewer;
    this.fetchImpl = resolveFetchImpl(options.fetchImpl);
    this.onProgress = options.onProgress;
    this.timeoutMs = resolveGenerationTimeoutMs(options.timeoutMs);
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
      message: 'Canceling agentic draft generation and restoring controls…',
      stage: 'cancelling',
    });
    this.generationTimeout.cancel('Agentic draft generation canceled. Controls restored.');
    return true;
  }

  async generateDraft(options: GenerateAgenticDraftOptions): Promise<AgenticPathDraft> {
    if (this.generating) {
      throw new AgenticPathGenerationError('Agentic path generation is already in progress.');
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

    this.generating = true;
    const livePose = clonePoseFromCamera(camera);
    const timeout = createGenerationTimeout(this.timeoutMs);
    this.generationTimeout = timeout;
    const basePose = options.existingKeyframes.at(-1) ? keyframeToPose(options.existingKeyframes.at(-1) as Keyframe) : livePose;
    const startTime = options.existingKeyframes.length > 0
      ? (options.existingKeyframes.at(-1)?.time ?? 0) + APPEND_BRIDGE_SECONDS
      : 0;
    const serializedCurrentCamera = serializePoseAsCamera(livePose, camera.aspect);
    const serializedBounds = serializeBounds(bounds);
    const serializedPathTail = serializePathTail(options.existingKeyframes.at(-1) ?? null);
    const fallbackRescanTarget = estimateScoutFocusTarget(bounds, camera);

    try {
      const roundOneCaptures = await this.captureRoundOne(bounds, livePose, camera, timeout);
      let groundResponse = await this.requestGround({
        captureRound: 1,
        captures: roundOneCaptures,
        currentCamera: serializedCurrentCamera,
        pathTail: serializedPathTail,
        prompt,
        sceneBounds: serializedBounds,
      }, timeout);
      assertSupportedGroundResponse(groundResponse);

      let captures = [...roundOneCaptures];
      let localizations = [...groundResponse.subjectLocalizations];
      let roundTwoUsed = false;

      if (localizations.length < 2) {
        const roundTwoCaptures = await this.captureRoundTwo(
          fallbackRescanTarget,
          bounds,
          livePose,
          camera,
          timeout,
          'current-view subject area',
        );
        captures = [...captures, ...roundTwoCaptures];

        const roundTwoGroundResponse = await this.requestGround({
          captureRound: 2,
          captures: roundTwoCaptures,
          currentCamera: serializedCurrentCamera,
          pathTail: serializedPathTail,
          prompt,
          sceneBounds: serializedBounds,
        }, timeout);
        assertSupportedGroundResponse(roundTwoGroundResponse);
        groundResponse = roundTwoGroundResponse;
        localizations = [...localizations, ...roundTwoGroundResponse.subjectLocalizations];
        roundTwoUsed = true;
      }

      let groundedSubject = groundSubjectFromLocalizations(localizations, captures, bounds, basePose);

      if (!roundTwoUsed && shouldRunTargetedRescan(groundedSubject)) {
        const roundTwoCaptures = await this.captureRoundTwo(
          vectorFromSerializable(groundedSubject.anchor),
          bounds,
          livePose,
          camera,
          timeout,
          'provisional subject anchor',
        );
        captures = [...captures, ...roundTwoCaptures];

        const roundTwoGroundResponse = await this.requestGround({
          captureRound: 2,
          captures: roundTwoCaptures,
          currentCamera: serializedCurrentCamera,
          pathTail: serializedPathTail,
          prompt,
          sceneBounds: serializedBounds,
        }, timeout);
        assertSupportedGroundResponse(roundTwoGroundResponse);
        groundResponse = roundTwoGroundResponse;
        localizations = [...localizations, ...roundTwoGroundResponse.subjectLocalizations];
        groundedSubject = groundSubjectFromLocalizations(localizations, captures, bounds, basePose);
      }

      let composeResponse = await this.requestCompose({
        currentCamera: serializedCurrentCamera,
        groundedSubject,
        intent: groundResponse.intent,
        pathTail: serializedPathTail,
        sceneBounds: serializedBounds,
      }, timeout);
      let builtDraft = buildDraftPath({
        basePose,
        bounds,
        groundedSubject,
        segments: composeResponse.segments,
        startTime,
      });
      this.reportProgress({
        buttonLabel: 'Validating…',
        message: 'Validating the generated camera-path draft…',
        stage: 'validating',
      });
      let validation = validateDraftPath(builtDraft, bounds, groundedSubject);

      if (!validation.valid) {
        composeResponse = await this.requestCompose({
          currentCamera: serializedCurrentCamera,
          groundedSubject,
          intent: groundResponse.intent,
          pathTail: serializedPathTail,
          sceneBounds: serializedBounds,
          validationFeedback: validation.feedback,
        }, timeout);
        builtDraft = buildDraftPath({
          basePose,
          bounds,
          groundedSubject,
          segments: composeResponse.segments,
          startTime,
        });
        this.reportProgress({
          buttonLabel: 'Validating…',
          message: 'Re-validating the repaired camera-path draft…',
          stage: 'validating',
        });
        validation = validateDraftPath(builtDraft, bounds, groundedSubject);
        if (!validation.valid) {
          throw new AgenticPathGenerationError(validation.feedback[0] ?? 'The draft path could not be validated.');
        }
      }

      return {
        draftId: crypto.randomUUID(),
        groundedSubject,
        keyframes: builtDraft.keyframes,
        segments: composeResponse.segments,
        summary: composeResponse.summary,
        warning: composeResponse.warning ?? groundResponse.warning,
      };
    } finally {
      this.generating = false;
      this.generationTimeout = null;
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }
  }

  private async captureRoundOne(
    bounds: THREE.Box3,
    livePose: InterpolatedPose,
    camera: THREE.PerspectiveCamera,
    timeout: AgenticGenerationTimeout,
  ): Promise<AgenticPathCapture[]> {
    const captures: AgenticPathCapture[] = [];

    try {
      this.reportCaptureProgress(1, 1, ROUND_ONE_TOTAL_CAPTURE_COUNT, 'Capturing the current view for draft planning.');
      await this.renderFrame(timeout, 'capturing round 1 current view');
      captures.push(await this.captureCurrentView(
        'capture-round-1-current',
        'current',
        camera,
        timeout,
        'capturing round 1 current view',
      ));

      const scoutPoses = buildScoutCameraPoses(bounds, camera);
      for (const [index, scoutPose] of scoutPoses.entries()) {
        timeout.throwIfAborted('capturing round 1 scout views');
        this.reportCaptureProgress(
          1,
          index + 2,
          ROUND_ONE_TOTAL_CAPTURE_COUNT,
          `Capturing nearby scout view ${index + 1}/6 for draft planning.`,
        );
        this.viewer.applyCameraPose(scoutPose);
        await this.renderFrame(timeout, 'capturing round 1 scout views');
        const activeCamera = this.viewer.getCamera();
        if (!activeCamera) {
          throw new AgenticPathGenerationError('Viewer camera became unavailable during draft capture.');
        }

        captures.push(await this.captureCurrentView(
          `capture-round-1-scout-${index + 1}`,
          'scout',
          activeCamera,
          timeout,
          'capturing round 1 scout views',
        ));
      }
    } finally {
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }

    return captures;
  }

  private async captureRoundTwo(
    anchor: THREE.Vector3,
    bounds: THREE.Box3,
    livePose: InterpolatedPose,
    camera: THREE.PerspectiveCamera,
    timeout: AgenticGenerationTimeout,
    focusLabel: string,
  ): Promise<AgenticPathCapture[]> {
    const captures: AgenticPathCapture[] = [];

    try {
      const rescanPoses = buildTargetedRescanPoses(anchor, bounds, camera);
      for (const [index, rescanPose] of rescanPoses.entries()) {
        timeout.throwIfAborted('capturing round 2 targeted rescans');
        this.reportCaptureProgress(
          2,
          index + 1,
          ROUND_TWO_TOTAL_CAPTURE_COUNT,
          `Capturing targeted rescan ${index + 1}/4 around the ${focusLabel}.`,
        );
        this.viewer.applyCameraPose(rescanPose);
        await this.renderFrame(timeout, 'capturing round 2 targeted rescans');
        const activeCamera = this.viewer.getCamera();
        if (!activeCamera) {
          throw new AgenticPathGenerationError('Viewer camera became unavailable during targeted rescans.');
        }

        captures.push(await this.captureCurrentView(
          `capture-round-2-scout-${index + 1}`,
          'scout',
          activeCamera,
          timeout,
          'capturing round 2 targeted rescans',
        ));
      }
    } finally {
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }

    return captures;
  }

  private async captureCurrentView(
    id: string,
    role: 'current' | 'scout',
    camera: THREE.PerspectiveCamera,
    timeout: AgenticGenerationTimeout,
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

  private async renderFrame(timeout: AgenticGenerationTimeout, context: string): Promise<void> {
    timeout.throwIfAborted(context);
    this.viewer.renderNow();
    await timeout.runStep(waitForNextAnimationFrame, context);
  }

  private async requestGround(
    request: AgenticGroundRequest,
    timeout: AgenticGenerationTimeout,
  ): Promise<AgenticGroundResponse> {
    this.reportProgress({
      buttonLabel: request.captureRound === 1 ? 'Grounding…' : 'Refining…',
      captureRound: request.captureRound,
      message: request.captureRound === 1
        ? 'Grounding the prompt against the captured views…'
        : 'Refining the grounded subject using targeted rescans…',
      stage: 'grounding',
    });
    const response = await timeout.runStep(() => this.fetchImpl('/api/path/ground', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: timeout.signal,
    }), 'waiting for the grounding response');

    if (!response.ok) {
      throw new AgenticPathGenerationError(
        await timeout.runStep(() => readAgenticPathError(response), 'reading the grounding error response'),
      );
    }

    return parseGroundResponse(
      await timeout.runStep(() => response.json() as Promise<unknown>, 'reading the grounding response'),
    );
  }

  private async requestCompose(
    request: AgenticComposeRequest,
    timeout: AgenticGenerationTimeout,
  ): Promise<AgenticComposeResponse> {
    this.reportProgress({
      buttonLabel: request.validationFeedback?.length ? 'Repairing…' : 'Composing…',
      message: request.validationFeedback?.length
        ? 'Requesting a repaired draft composition from the planner…'
        : 'Composing a multi-step camera-path draft…',
      stage: request.validationFeedback?.length ? 'repairing' : 'composing',
    });
    const response = await timeout.runStep(() => this.fetchImpl('/api/path/compose', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: timeout.signal,
    }), 'waiting for the composition response');

    if (!response.ok) {
      throw new AgenticPathGenerationError(
        await timeout.runStep(() => readAgenticPathError(response), 'reading the composition error response'),
      );
    }

    return parseComposeResponse(
      await timeout.runStep(() => response.json() as Promise<unknown>, 'reading the composition response'),
    );
  }

  private reportCaptureProgress(
    captureRound: 1 | 2,
    captureIndex: number,
    totalCaptures: number,
    message: string,
  ): void {
    this.reportProgress({
      buttonLabel: `Capture Round ${captureRound} ${captureIndex}/${totalCaptures}…`,
      captureIndex,
      captureRound,
      message: `${message} Viewer controls are temporarily locked.`,
      stage: captureRound === 1 ? 'capture-round-1' : 'capture-round-2',
      totalCaptures,
    });
  }

  private reportProgress(progress: AgenticPathProgress): void {
    this.onProgress?.(progress);
  }
}

export { AgenticPathOrchestrator as AgenticPathGenerator };

export function buildScoutCameraPoses(
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
): InterpolatedPose[] {
  return buildCapturePosesAroundTarget(
    estimateScoutFocusTarget(bounds, camera),
    bounds,
    camera,
    ROUND_ONE_SCOUT_POSE_SPECS,
    0.97,
    1.03,
  );
}

export function buildTargetedRescanPoses(
  anchor: THREE.Vector3,
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
): InterpolatedPose[] {
  return buildCapturePosesAroundTarget(anchor, bounds, camera, ROUND_TWO_RESCAN_POSE_SPECS, 0.95, 1.01);
}

export function groundSubjectFromLocalizations(
  localizations: AgenticSubjectLocalization[],
  captures: AgenticPathCapture[],
  sceneBounds: THREE.Box3,
  basePose: InterpolatedPose,
): AgenticGroundedSubject {
  if (localizations.length < 2) {
    throw new AgenticPathGenerationError('The planner could not localize the requested subject in enough captures.');
  }

  const captureById = new Map(captures.map(capture => [capture.id, capture]));
  const observations = localizations.map(localization => {
    const capture = captureById.get(localization.captureId);
    if (!capture) {
      throw new AgenticPathGenerationError(`Planner referenced an unknown capture: ${localization.captureId}`);
    }
    return buildRayObservation(capture, localization);
  });

  const solvedPoint = solveLeastSquaresPoint(observations);
  const sceneSize = sceneBounds.getSize(new THREE.Vector3());
  const sceneDiagonal = Math.max(sceneSize.length(), 1);
  const meanResidual = observations.reduce(
    (sum, observation) => sum + distancePointToRay(solvedPoint, observation.origin, observation.direction),
    0,
  ) / observations.length;

  if (!Number.isFinite(meanResidual) || meanResidual > Math.max(0.35, sceneDiagonal * 0.12)) {
    throw new AgenticPathGenerationError('The planner could not resolve a stable 3D subject anchor from the scout views.');
  }

  const inflatedBounds = sceneBounds.clone().expandByScalar(Math.max(sceneDiagonal * 0.1, 0.25));
  if (!inflatedBounds.containsPoint(solvedPoint)) {
    throw new AgenticPathGenerationError('The resolved subject anchor falls outside the loaded scene bounds.');
  }

  const averageLocalizationConfidence = observations.reduce((sum, observation) => sum + observation.confidence, 0)
    / observations.length;
  const residualPenalty = THREE.MathUtils.clamp(meanResidual / Math.max(sceneDiagonal * 0.05, 0.08), 0, 1);
  const captureFactor = THREE.MathUtils.clamp(observations.length / 4, 0.55, 1.2);

  return {
    anchor: vectorToSerializable(solvedPoint),
    basisForward: vectorToSerializable(getForwardVector(basePose.quaternion)),
    basisUp: vectorToSerializable(getUpVector(basePose.quaternion)),
    captureCount: observations.length,
    confidence: THREE.MathUtils.clamp(averageLocalizationConfidence * captureFactor * (1 - residualPenalty * 0.45), 0.05, 0.99),
    meanResidual,
    sceneScale: sceneDiagonal,
  };
}

export function buildDraftPath(options: BuildDraftPathOptions): BuiltDraftPath {
  const anchor = vectorFromSerializable(options.groundedSubject.anchor);
  const axis = normalizedVectorFromSerializable(options.groundedSubject.basisUp, DEFAULT_LOOK_UP);
  const sceneSize = options.bounds.getSize(new THREE.Vector3());
  const sceneDiagonal = Math.max(sceneSize.length(), 1);
  const keyframes: Keyframe[] = [];
  const windows: SegmentWindow[] = [];
  let currentPose = ensureSafeStartingPose(options.basePose, anchor, sceneDiagonal);
  let currentTime = options.startTime;

  for (const [segmentIndex, segment] of options.segments.entries()) {
    const sampleCount = SEGMENT_KEYFRAME_COUNT[segment.segmentType];
    const segmentSamples = buildSegmentSamples(segment, currentPose, anchor, axis, options.bounds, sceneDiagonal, sampleCount);
    const segmentStartTime = currentTime;

    segmentSamples.forEach((sample, sampleIndex) => {
      if (segmentIndex > 0 && sampleIndex === 0) {
        return;
      }

      const ratio = sampleCount > 1 ? sampleIndex / (sampleCount - 1) : 1;
      keyframes.push({
        fov: sample.fov,
        id: crypto.randomUUID(),
        position: vectorToSerializable(sample.position),
        quaternion: quaternionToSerializable(sample.quaternion),
        time: segmentStartTime + segment.durationSeconds * ratio,
      });
    });

    currentTime += segment.durationSeconds;
    currentPose = clonePose(segmentSamples.at(-1) as InterpolatedPose);
    windows.push({
      endTime: currentTime,
      lookMode: segment.lookMode,
      segmentType: segment.segmentType,
      startTime: segmentStartTime,
    });
  }

  return {
    keyframes,
    windows,
  };
}

export function validateDraftPath(
  builtDraft: BuiltDraftPath,
  bounds: THREE.Box3,
  groundedSubject: AgenticGroundedSubject,
): AgenticDraftValidationResult {
  if (builtDraft.keyframes.length < 2) {
    return {
      feedback: ['The composed draft path did not contain enough keyframes to preview.'],
      valid: false,
    };
  }

  const totalDuration = builtDraft.keyframes.at(-1)?.time ?? 0;
  const firstTime = builtDraft.keyframes[0]?.time ?? 0;
  const feedback: string[] = [];
  const sceneDiagonal = groundedSubject.sceneScale;
  const expandedBounds = bounds.clone().expandByScalar(sceneDiagonal * 0.15);
  const minDistanceToSubject = Math.max(0.5, sceneDiagonal * 0.15);
  const anchor = vectorFromSerializable(groundedSubject.anchor);
  const pathInterpolator = new PathInterpolator();
  pathInterpolator.setKeyframes(builtDraft.keyframes);

  if (totalDuration - firstTime < 6 || totalDuration - firstTime > 18) {
    feedback.push('The draft duration must stay between 6 and 18 seconds.');
  }

  for (let sampleTime = firstTime; sampleTime <= totalDuration + 1e-6; sampleTime += VALIDATION_SAMPLE_STEP_SECONDS) {
    const pose = pathInterpolator.evaluate(sampleTime);
    if (!pose) {
      feedback.push('The draft path could not be interpolated for validation.');
      break;
    }

    if (!expandedBounds.containsPoint(pose.position)) {
      pushValidationFeedback(feedback, 'The draft camera left the supported scene volume.');
    }

    if (pose.fov < 25 || pose.fov > 85) {
      pushValidationFeedback(feedback, 'The draft changed FOV outside the supported 25-85 range.');
    }

    if (pose.position.distanceTo(anchor) < minDistanceToSubject) {
      pushValidationFeedback(feedback, 'The draft moved the camera too close to the subject.');
    }

    const projectedAnchor = projectSubject(anchor, pose);
    if (!projectedAnchor.visible) {
      pushValidationFeedback(feedback, 'The subject left the frame during the generated draft.');
      continue;
    }

    const window = findSegmentWindow(builtDraft.windows, sampleTime);
    if (window?.lookMode === 'look-at-subject' && (
      Math.abs(projectedAnchor.ndcX) > 0.6
      || Math.abs(projectedAnchor.ndcY) > 0.6
    )) {
      pushValidationFeedback(feedback, 'Subject drifted out of the safe frame box.');
    }
  }

  return {
    feedback,
    valid: feedback.length === 0,
  };
}

function assertSupportedGroundResponse(response: AgenticGroundResponse): void {
  if (response.pathMode !== 'subject-centric') {
    throw new AgenticPathGenerationError(
      response.unsupportedReason ?? 'That prompt is not supported in agentic path v1.',
    );
  }
}

function buildCapturePosesAroundTarget(
  target: THREE.Vector3,
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
  specs: ScoutPoseSpec[],
  minDistanceFactor: number,
  maxDistanceFactor: number,
): InterpolatedPose[] {
  const sceneSize = bounds.getSize(new THREE.Vector3());
  const sceneDiagonal = Math.max(sceneSize.length(), 1);
  const framedView = computeFramedSceneView(bounds, camera);
  const framedDistance = framedView ? framedView.position.distanceTo(target) : camera.position.distanceTo(target);
  const currentDistance = Math.max(camera.position.distanceTo(target), 1);
  const minRadius = Math.max(Math.min(currentDistance * minDistanceFactor, sceneDiagonal * 0.2), 0.75);
  const maxRadius = Math.max(
    currentDistance * maxDistanceFactor,
    Math.min(framedDistance, currentDistance + sceneDiagonal * 0.18),
    minRadius + 0.25,
  );
  const radius = THREE.MathUtils.clamp(currentDistance, minRadius, maxRadius);
  const baseOffset = resolveScoutBaseOffset(target, camera.position, camera.quaternion, radius);
  const baseUp = getUpVector(camera.quaternion);
  const baseRight = getRightVector(camera.quaternion);

  return specs.map(spec => {
    const rotatedScout = rotateScoutOffset(baseOffset, baseUp, baseRight, spec);
    const position = target.clone().add(rotatedScout.offset);

    return {
      fov: camera.fov,
      position,
      quaternion: buildLookQuaternion(position, target, rotatedScout.up),
    };
  });
}

function buildSegmentSamples(
  segment: AgenticPathSegmentPlan,
  currentPose: InterpolatedPose,
  anchor: THREE.Vector3,
  axis: THREE.Vector3,
  bounds: THREE.Box3,
  sceneDiagonal: number,
  sampleCount: number,
): InterpolatedPose[] {
  const orbitFrame = deriveOrbitFrame(anchor, currentPose.position, currentPose.quaternion, axis);
  const minRadius = Math.max(sceneDiagonal * 0.18, 0.7);
  const maxRadius = Math.max(sceneDiagonal * 1.6, minRadius + 0.5);
  const radius = THREE.MathUtils.clamp(orbitFrame.radius || sceneDiagonal * 0.45, minRadius, maxRadius);
  const sceneHeight = Math.max(computeBoundsExtentAlongAxis(bounds, orbitFrame.axis), sceneDiagonal * 0.25, 1);
  const startHeight = orbitFrame.height;
  const endFov = THREE.MathUtils.clamp(currentPose.fov + (segment.fovDelta ?? 0), 25, 85);

  if (segment.segmentType === 'hold') {
    return finalizeSegmentOrientations(
      Array.from({ length: sampleCount }, (_, index) => ({
        fov: THREE.MathUtils.lerp(currentPose.fov, endFov, sampleCount > 1 ? index / (sampleCount - 1) : 1),
        position: currentPose.position.clone(),
      })),
      segment.lookMode,
      anchor,
      orbitFrame.axis,
      currentPose,
    );
  }

  if (segment.segmentType === 'arc') {
    const targetHeight = resolveHeightOffset(segment.verticalBias, startHeight, sceneHeight);
    const sweepRadians = THREE.MathUtils.degToRad(
      THREE.MathUtils.clamp(segment.sweepDegrees ?? 110, 35, 210),
    );
    const direction = resolveArcDirection(segment, currentPose, orbitFrame);
    const directionSign = direction === 'counterclockwise' ? 1 : -1;

    return finalizeSegmentOrientations(
      Array.from({ length: sampleCount }, (_, index) => {
        const ratio = sampleCount > 1 ? index / (sampleCount - 1) : 1;
        const angle = directionSign * sweepRadians * ratio;
        const height = THREE.MathUtils.lerp(startHeight, targetHeight, ratio);
        return {
          fov: THREE.MathUtils.lerp(currentPose.fov, endFov, ratio),
          position: createOrbitPosition(anchor, orbitFrame, radius, height, angle),
        };
      }),
      segment.lookMode,
      anchor,
      orbitFrame.axis,
      currentPose,
    );
  }

  if (segment.segmentType === 'dolly') {
    const targetHeight = resolveHeightOffset(segment.verticalBias, startHeight, sceneHeight);
    const direction = segment.travelDirection ?? 'in';
    const distanceAmount = sceneDiagonal * THREE.MathUtils.clamp(segment.distanceScale ?? 0.14, 0.05, 0.35);
    const endRadius = THREE.MathUtils.clamp(
      direction === 'in' ? radius - distanceAmount : radius + distanceAmount,
      minRadius,
      maxRadius,
    );

    return finalizeSegmentOrientations(
      Array.from({ length: sampleCount }, (_, index) => {
        const ratio = sampleCount > 1 ? index / (sampleCount - 1) : 1;
        return {
          fov: THREE.MathUtils.lerp(currentPose.fov, endFov, ratio),
          position: createOrbitPosition(
            anchor,
            orbitFrame,
            THREE.MathUtils.lerp(radius, endRadius, ratio),
            THREE.MathUtils.lerp(startHeight, targetHeight, ratio),
            0,
          ),
        };
      }),
      segment.lookMode,
      anchor,
      orbitFrame.axis,
      currentPose,
    );
  }

  const direction = segment.travelDirection ?? 'up';
  const heightAmount = sceneDiagonal * THREE.MathUtils.clamp(segment.heightScale ?? 0.14, 0.05, 0.35);
  const endHeight = direction === 'up' ? startHeight + heightAmount : startHeight - heightAmount;

  return finalizeSegmentOrientations(
    Array.from({ length: sampleCount }, (_, index) => {
      const ratio = sampleCount > 1 ? index / (sampleCount - 1) : 1;
      return {
        fov: THREE.MathUtils.lerp(currentPose.fov, endFov, ratio),
        position: createOrbitPosition(anchor, orbitFrame, radius, THREE.MathUtils.lerp(startHeight, endHeight, ratio), 0),
      };
    }),
    segment.lookMode,
    anchor,
    orbitFrame.axis,
    currentPose,
  );
}

function finalizeSegmentOrientations(
  samples: SegmentPoseSample[],
  lookMode: AgenticOrientationMode,
  anchor: THREE.Vector3,
  axis: THREE.Vector3,
  currentPose: InterpolatedPose,
): InterpolatedPose[] {
  return samples.map((sample, index) => {
    if (index === 0) {
      return {
        fov: sample.fov,
        position: sample.position.clone(),
        quaternion: currentPose.quaternion.clone(),
      };
    }

    if (lookMode === 'look-at-subject') {
      return {
        fov: sample.fov,
        position: sample.position.clone(),
        quaternion: buildLookQuaternion(sample.position, anchor, axis),
      };
    }

    const previousPosition = samples[Math.max(0, index - 1)]?.position ?? currentPose.position;
    const nextPosition = samples[Math.min(samples.length - 1, index + 1)]?.position ?? sample.position;
    const tangent = nextPosition.clone().sub(previousPosition);

    return {
      fov: sample.fov,
      position: sample.position.clone(),
      quaternion: tangent.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED
        ? currentPose.quaternion.clone()
        : buildLookQuaternion(sample.position, sample.position.clone().add(tangent), axis),
    };
  });
}

function buildRayObservation(
  capture: AgenticPathCapture,
  localization: AgenticSubjectLocalization,
): RayObservation {
  if (
    localization.pixelX < 0
    || localization.pixelX > capture.width
    || localization.pixelY < 0
    || localization.pixelY > capture.height
  ) {
    throw new AgenticPathGenerationError(`Planner returned out-of-bounds pixels for ${capture.id}.`);
  }

  const camera = createCameraFromSerialized(capture.camera);
  const ndc = new THREE.Vector3(
    (localization.pixelX / capture.width) * 2 - 1,
    1 - (localization.pixelY / capture.height) * 2,
    0.5,
  );
  const worldPoint = ndc.clone().unproject(camera);

  return {
    confidence: THREE.MathUtils.clamp(localization.confidence, 0.05, 1),
    direction: worldPoint.sub(camera.position).normalize(),
    origin: camera.position.clone(),
  };
}

function buildLookQuaternion(
  position: THREE.Vector3,
  target: THREE.Vector3,
  preferredUp = DEFAULT_LOOK_UP,
): THREE.Quaternion {
  const forward = target.clone().sub(position);
  if (forward.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    return new THREE.Quaternion();
  }

  forward.normalize();
  const up = projectOntoPlane(preferredUp, forward);
  if (up.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    up.copy(getArbitraryPerpendicular(forward));
  } else {
    up.normalize();
  }

  const matrix = new THREE.Matrix4().lookAt(position, target, up);
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function clonePose(pose: InterpolatedPose): InterpolatedPose {
  return {
    fov: pose.fov,
    position: pose.position.clone(),
    quaternion: pose.quaternion.clone(),
  };
}

function clonePoseFromCamera(camera: THREE.PerspectiveCamera): InterpolatedPose {
  return {
    fov: camera.fov,
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
  };
}

function computeBoundsExtentAlongAxis(bounds: THREE.Box3, axis: THREE.Vector3): number {
  const halfSize = bounds.getSize(new THREE.Vector3()).multiplyScalar(0.5);
  return 2 * (
    Math.abs(axis.x) * halfSize.x
    + Math.abs(axis.y) * halfSize.y
    + Math.abs(axis.z) * halfSize.z
  );
}

function createCameraFromPose(pose: InterpolatedPose): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(pose.fov, 16 / 9, 0.1, 1000);
  camera.position.copy(pose.position);
  camera.quaternion.copy(pose.quaternion);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
}

function createCameraFromSerialized(camera: SerializedCaptureCamera): THREE.PerspectiveCamera {
  const perspectiveCamera = new THREE.PerspectiveCamera(
    camera.fov,
    Math.max(camera.aspect, 1e-6),
    0.1,
    1000,
  );
  perspectiveCamera.position.set(camera.position.x, camera.position.y, camera.position.z);
  perspectiveCamera.quaternion.set(
    camera.quaternion.x,
    camera.quaternion.y,
    camera.quaternion.z,
    camera.quaternion.w,
  );
  perspectiveCamera.updateProjectionMatrix();
  perspectiveCamera.updateMatrixWorld(true);
  return perspectiveCamera;
}

function createOrbitPosition(
  center: THREE.Vector3,
  orbitFrame: OrbitFrame,
  radius: number,
  height: number,
  angle: number,
): THREE.Vector3 {
  const radialOffset = orbitFrame.radialDirection.clone().multiplyScalar(radius).applyAxisAngle(orbitFrame.axis, angle);
  return center.clone().add(radialOffset).addScaledVector(orbitFrame.axis, height);
}

function deriveOrbitFrame(
  center: THREE.Vector3,
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
  preferredAxis?: THREE.Vector3,
): OrbitFrame {
  const relativeOffset = position.clone().sub(center);
  const axis = preferredAxis?.clone() ?? getUpVector(quaternion);
  if (axis.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    axis.copy(DEFAULT_LOOK_UP);
  } else {
    axis.normalize();
  }

  let radialOffset = projectOntoPlane(relativeOffset, axis);
  if (radialOffset.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    radialOffset = projectOntoPlane(
      getForwardVector(quaternion).multiplyScalar(-Math.max(relativeOffset.length(), 1)),
      axis,
    );
  }
  if (radialOffset.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    radialOffset = getArbitraryPerpendicular(axis).multiplyScalar(Math.max(relativeOffset.length(), 1));
  }

  return {
    axis,
    height: relativeOffset.dot(axis),
    radialDirection: radialOffset.clone().normalize(),
    radius: radialOffset.length(),
  };
}

function distancePointToRay(
  point: THREE.Vector3,
  origin: THREE.Vector3,
  direction: THREE.Vector3,
): number {
  const toPoint = point.clone().sub(origin);
  const projectionLength = toPoint.dot(direction);
  const projection = direction.clone().multiplyScalar(projectionLength);
  return toPoint.sub(projection).length();
}

function ensureSafeStartingPose(
  pose: InterpolatedPose,
  anchor: THREE.Vector3,
  sceneDiagonal: number,
): InterpolatedPose {
  const minDistanceToSubject = Math.max(0.7, sceneDiagonal * 0.18);
  const relativeOffset = pose.position.clone().sub(anchor);
  const currentDistance = relativeOffset.length();

  if (currentDistance >= minDistanceToSubject) {
    return clonePose(pose);
  }

  const safeDirection = currentDistance <= MIN_VECTOR_LENGTH_SQUARED
    ? getForwardVector(pose.quaternion).multiplyScalar(-1)
    : relativeOffset.normalize();

  return {
    fov: pose.fov,
    position: anchor.clone().addScaledVector(safeDirection, minDistanceToSubject),
    quaternion: pose.quaternion.clone(),
  };
}

function findSegmentWindow(windows: SegmentWindow[], time: number): SegmentWindow | null {
  return windows.find(window => window.startTime <= time && time <= window.endTime + 1e-6) ?? null;
}

function getArbitraryPerpendicular(vector: THREE.Vector3): THREE.Vector3 {
  const reference = Math.abs(vector.y) < 0.9
    ? DEFAULT_LOOK_UP
    : new THREE.Vector3(1, 0, 0);
  const perpendicular = new THREE.Vector3().crossVectors(vector, reference);
  if (perpendicular.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    perpendicular.crossVectors(vector, new THREE.Vector3(0, 0, 1));
  }

  return perpendicular.normalize();
}

function getForwardVector(quaternion: THREE.Quaternion): THREE.Vector3 {
  return new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion).normalize();
}

function getRightVector(quaternion: THREE.Quaternion): THREE.Vector3 {
  return new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize();
}

function getUpVector(quaternion: THREE.Quaternion): THREE.Vector3 {
  return DEFAULT_LOOK_UP.clone().applyQuaternion(quaternion).normalize();
}

function invert3x3(matrix: number[]): number[] | null {
  const [
    m11, m12, m13,
    m21, m22, m23,
    m31, m32, m33,
  ] = matrix;

  const c11 = m22 * m33 - m23 * m32;
  const c12 = -(m21 * m33 - m23 * m31);
  const c13 = m21 * m32 - m22 * m31;
  const c21 = -(m12 * m33 - m13 * m32);
  const c22 = m11 * m33 - m13 * m31;
  const c23 = -(m11 * m32 - m12 * m31);
  const c31 = m12 * m23 - m13 * m22;
  const c32 = -(m11 * m23 - m13 * m21);
  const c33 = m11 * m22 - m12 * m21;
  const determinant = m11 * c11 + m12 * c12 + m13 * c13;

  if (Math.abs(determinant) <= 1e-8) {
    return null;
  }

  const inverseDeterminant = 1 / determinant;
  return [
    c11 * inverseDeterminant,
    c21 * inverseDeterminant,
    c31 * inverseDeterminant,
    c12 * inverseDeterminant,
    c22 * inverseDeterminant,
    c32 * inverseDeterminant,
    c13 * inverseDeterminant,
    c23 * inverseDeterminant,
    c33 * inverseDeterminant,
  ];
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function keyframeToPose(keyframe: Keyframe): InterpolatedPose {
  return {
    fov: keyframe.fov,
    position: new THREE.Vector3(keyframe.position.x, keyframe.position.y, keyframe.position.z),
    quaternion: new THREE.Quaternion(
      keyframe.quaternion.x,
      keyframe.quaternion.y,
      keyframe.quaternion.z,
      keyframe.quaternion.w,
    ),
  };
}

async function blobToJpegDataUrl(blob: Blob): Promise<{ dataUrl: string; height: number; width: number }> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_CAPTURE_LONG_SIDE / Math.max(bitmap.width, bitmap.height, 1));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new AgenticPathGenerationError('Could not create a capture canvas for planner screenshots.');
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.82),
    height,
    width,
  };
}

function multiplyMatrixVector(matrix: number[], vector: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    matrix[0] * vector.x + matrix[1] * vector.y + matrix[2] * vector.z,
    matrix[3] * vector.x + matrix[4] * vector.y + matrix[5] * vector.z,
    matrix[6] * vector.x + matrix[7] * vector.y + matrix[8] * vector.z,
  );
}

function normalizedVectorFromSerializable(vector: SerializableVector3, fallback: THREE.Vector3): THREE.Vector3 {
  const resolved = vectorFromSerializable(vector);
  return resolved.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED ? fallback.clone() : resolved.normalize();
}

function parseComposeResponse(input: unknown): AgenticComposeResponse {
  if (!isRecord(input)) {
    throw new AgenticPathGenerationError('Planner composition response was not a JSON object.');
  }

  const rawSegments = input['segments'];
  if (!Array.isArray(rawSegments) || rawSegments.length === 0) {
    throw new AgenticPathGenerationError('Planner composition response was missing segments.');
  }

  return {
    segments: rawSegments.slice(0, 4).map((segment, index) => parseSegment(segment, `segments[${index}]`)),
    summary: readOptionalString(input, 'summary') ?? 'Generated a multi-step camera-path draft.',
    warning: readOptionalString(input, 'warning'),
  };
}

function parseDirection(value: unknown, context: string): AgenticOrbitDirection {
  if (value === 'clockwise' || value === 'counterclockwise') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === 'cw'
      || normalized.includes('clockwise')
      || normalized.includes('right')
    ) {
      return 'clockwise';
    }
    if (
      normalized === 'ccw'
      || normalized.includes('counterclockwise')
      || normalized.includes('anticlockwise')
      || normalized.includes('anti-clockwise')
      || normalized.includes('left')
    ) {
      return 'counterclockwise';
    }
  }

  throw new AgenticPathGenerationError(`Planner response field ${context} must be clockwise or counterclockwise.`);
}

function parseDollyDirection(value: unknown, context: string): AgenticDollyDirection {
  if (value === 'in' || value === 'out') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('in') || normalized.includes('toward') || normalized.includes('closer')) {
      return 'in';
    }
    if (normalized.includes('out') || normalized.includes('away') || normalized.includes('back')) {
      return 'out';
    }
  }

  throw new AgenticPathGenerationError(`Planner response field ${context} must be in or out.`);
}

function parseGroundResponse(input: unknown): AgenticGroundResponse {
  if (!isRecord(input)) {
    throw new AgenticPathGenerationError('Planner grounding response was not a JSON object.');
  }

  const rawLocalizations = input['subjectLocalizations'];
  if (!Array.isArray(rawLocalizations)) {
    throw new AgenticPathGenerationError('Planner grounding response was missing subjectLocalizations.');
  }

  const pathMode = parsePathMode(input['pathMode'], 'pathMode');
  return {
    intent: parsePromptIntent(input['intent'], 'intent', pathMode),
    pathMode,
    subjectLocalizations: rawLocalizations.map((localization, index) =>
      parseLocalization(localization, `subjectLocalizations[${index}]`)),
    unsupportedReason: readOptionalString(input, 'unsupportedReason'),
    warning: readOptionalString(input, 'warning'),
  };
}

function parseLocalization(value: unknown, context: string): AgenticSubjectLocalization {
  if (!isRecord(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context} must be an object.`);
  }

  return {
    captureId: readString(value, 'captureId', context),
    confidence: THREE.MathUtils.clamp(readFiniteNumber(value, 'confidence', context), 0, 1),
    pixelX: readFiniteNumber(value, 'pixelX', context),
    pixelY: readFiniteNumber(value, 'pixelY', context),
  };
}

function parseOrientationMode(value: unknown, context: string): AgenticOrientationMode {
  if (value === 'look-at-subject' || value === 'look-forward') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('forward') || normalized.includes('along')) {
      return 'look-forward';
    }
    if (normalized.includes('subject') || normalized.includes('focus') || normalized.includes('look-at')) {
      return 'look-at-subject';
    }
  }

  throw new AgenticPathGenerationError(`Planner response field ${context} must be a supported look mode.`);
}

function parsePathMode(value: unknown, context: string): AgenticPathMode {
  if (value === 'subject-centric' || value === 'route-following' || value === 'multi-subject' || value === 'ambiguous') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('route') || normalized.includes('weave') || normalized.includes('corridor')) {
      return 'route-following';
    }
    if (normalized.includes('multi')) {
      return 'multi-subject';
    }
    if (normalized.includes('ambig')) {
      return 'ambiguous';
    }
    if (normalized.includes('subject')) {
      return 'subject-centric';
    }
  }

  throw new AgenticPathGenerationError(`Planner response field ${context} must be a supported path mode.`);
}

function parsePedestalDirection(value: unknown, context: string): AgenticPedestalDirection {
  if (value === 'up' || value === 'down') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('up') || normalized.includes('rise') || normalized.includes('crane')) {
      return 'up';
    }
    if (normalized.includes('down') || normalized.includes('drop') || normalized.includes('lower')) {
      return 'down';
    }
  }

  throw new AgenticPathGenerationError(`Planner response field ${context} must be up or down.`);
}

function parsePromptIntent(
  value: unknown,
  context: string,
  fallbackPathMode?: AgenticPathMode,
): AgenticPromptIntent {
  if (!isRecord(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context} must be an object.`);
  }

  return {
    continuousPath: true,
    orientationPreference: parseOrientationMode(
      value['orientationPreference'] ?? value['lookMode'] ?? 'look-at-subject',
      `${context}.orientationPreference`,
    ),
    pathMode: value['pathMode'] === undefined
      ? (fallbackPathMode ?? 'subject-centric')
      : parsePathMode(value['pathMode'], `${context}.pathMode`),
    requestedMoveTypes: parseRequestedMoveTypes(value['requestedMoveTypes']),
    subjectHint: readNullableString(value, 'subjectHint'),
    targetDurationSeconds: readNullableFiniteNumber(value, 'targetDurationSeconds'),
    tone: readNullableString(value, 'tone'),
  };
}

function parseRequestedMoveTypes(value: unknown): AgenticPathSegmentType[] {
  if (!Array.isArray(value)) {
    return ['arc'];
  }

  const moves = value
    .map(entry => coerceSegmentType(entry))
    .filter((entry): entry is AgenticPathSegmentType => entry !== null);

  return moves.length > 0 ? Array.from(new Set(moves)) : ['arc'];
}

function parseSegment(value: unknown, context: string): AgenticPathSegmentPlan {
  if (!isRecord(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context} must be an object.`);
  }

  const segmentType = coerceSegmentType(value['segmentType']);
  if (!segmentType) {
    throw new AgenticPathGenerationError(`Planner response field ${context}.segmentType is unsupported.`);
  }

  const baseSegment: AgenticBaseSegmentPlan = {
    durationSeconds: readPositiveNumber(value, 'durationSeconds', context),
    fovDelta: readOptionalFiniteNumber(value, 'fovDelta'),
    lookMode: parseOrientationMode(value['lookMode'] ?? 'look-at-subject', `${context}.lookMode`),
    segmentType,
  };

  if (segmentType === 'hold') {
    return {
      ...baseSegment,
      segmentType,
    };
  }

  if (segmentType === 'arc') {
    return {
      ...baseSegment,
      direction: value['direction'] === undefined ? undefined : parseDirection(value['direction'], `${context}.direction`),
      segmentType,
      sweepDegrees: readOptionalFiniteNumber(value, 'sweepDegrees'),
      verticalBias: value['verticalBias'] === undefined
        ? undefined
        : parseVerticalBias(value['verticalBias'], `${context}.verticalBias`),
    };
  }

  if (segmentType === 'dolly') {
    return {
      ...baseSegment,
      distanceScale: readOptionalFiniteNumber(value, 'distanceScale'),
      segmentType,
      travelDirection: value['travelDirection'] === undefined
        ? undefined
        : parseDollyDirection(value['travelDirection'], `${context}.travelDirection`),
      verticalBias: value['verticalBias'] === undefined
        ? undefined
        : parseVerticalBias(value['verticalBias'], `${context}.verticalBias`),
    };
  }

  return {
    ...baseSegment,
    heightScale: readOptionalFiniteNumber(value, 'heightScale'),
    segmentType,
    travelDirection: value['travelDirection'] === undefined
      ? undefined
      : parsePedestalDirection(value['travelDirection'], `${context}.travelDirection`),
  };
}

function parseVerticalBias(value: unknown, context: string): AgenticVerticalBias {
  if (value === 'low' || value === 'mid' || value === 'high') {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value <= -0.25) {
      return 'low';
    }
    if (value >= 0.25) {
      return 'high';
    }
    return 'mid';
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (
      normalized.includes('mid')
      || normalized.includes('medium')
      || normalized.includes('center')
      || normalized.includes('middle')
      || normalized.includes('neutral')
      || normalized.includes('eye')
      || normalized.includes('level')
    ) {
      return 'mid';
    }
    if (
      normalized.includes('high')
      || normalized.includes('top')
      || normalized.includes('upper')
      || normalized.includes('elevated')
      || normalized.includes('above')
      || normalized.includes('overhead')
    ) {
      return 'high';
    }
    if (
      normalized.includes('low')
      || normalized.includes('bottom')
      || normalized.includes('lower')
      || normalized.includes('ground')
      || normalized.includes('below')
      || normalized.includes('under')
    ) {
      return 'low';
    }
  }

  throw new AgenticPathGenerationError(`Planner response field ${context} must be low, mid, or high.`);
}

function coerceSegmentType(value: unknown): AgenticPathSegmentType | null {
  if (value === 'hold' || value === 'arc' || value === 'dolly' || value === 'pedestal') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'orbit' || normalized === 'turntable' || normalized === 'circle') {
    return 'arc';
  }
  if (normalized === 'push-in' || normalized === 'push in' || normalized === 'pull-back' || normalized === 'pull back') {
    return 'dolly';
  }
  if (normalized === 'crane' || normalized === 'rise' || normalized === 'drop') {
    return 'pedestal';
  }
  if (normalized === 'pause' || normalized === 'linger' || normalized === 'still') {
    return 'hold';
  }

  return null;
}

function projectOntoPlane(vector: THREE.Vector3, normal: THREE.Vector3): THREE.Vector3 {
  return vector.clone().sub(normal.clone().multiplyScalar(vector.dot(normal)));
}

function projectSubject(
  anchor: THREE.Vector3,
  pose: InterpolatedPose,
): { ndcX: number; ndcY: number; visible: boolean } {
  const camera = createCameraFromPose(pose);
  const projected = anchor.clone().project(camera);
  return {
    ndcX: projected.x,
    ndcY: projected.y,
    visible: Number.isFinite(projected.x)
      && Number.isFinite(projected.y)
      && Number.isFinite(projected.z)
      && projected.z >= -1
      && projected.z <= 1
      && Math.abs(projected.x) <= 1
      && Math.abs(projected.y) <= 1,
  };
}

function pushValidationFeedback(feedback: string[], message: string): void {
  if (feedback.length >= MAX_VALIDATION_FEEDBACK || feedback.includes(message)) {
    return;
  }
  feedback.push(message);
}

function quaternionToSerializable(quaternion: THREE.Quaternion): SerializableQuaternion {
  return {
    w: quaternion.w,
    x: quaternion.x,
    y: quaternion.y,
    z: quaternion.z,
  };
}

function readFiniteNumber(record: UnknownRecord, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context}.${key} must be a finite number.`);
  }

  return value;
}

function readNullableFiniteNumber(record: UnknownRecord, key: string): number | null {
  const value = record[key];
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${key} must be a finite number when provided.`);
  }

  return value;
}

function readNullableString(record: UnknownRecord, key: string): string | null {
  const value = record[key];
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AgenticPathGenerationError(`Planner response field ${key} must be a non-empty string when provided.`);
  }

  return value.trim();
}

function readOptionalFiniteNumber(record: UnknownRecord, key: string): number | undefined {
  const value = record[key];
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${key} must be a finite number when provided.`);
  }

  return value;
}

function readOptionalString(record: UnknownRecord, key: string): string | undefined {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function readPositiveNumber(record: UnknownRecord, key: string, context: string): number {
  const value = readFiniteNumber(record, key, context);
  if (!(value > 0)) {
    throw new AgenticPathGenerationError(`Planner response field ${context}.${key} must be greater than zero.`);
  }

  return value;
}

function readString(record: UnknownRecord, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AgenticPathGenerationError(`Planner response field ${context}.${key} must be a non-empty string.`);
  }

  return value;
}

async function readAgenticPathError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as unknown;
    if (isRecord(payload) && typeof payload['error'] === 'string' && payload['error'].trim().length > 0) {
      return payload['error'];
    }
  } catch {
    // Fall through to the generic message.
  }

  return 'Could not generate an agentic camera-path draft from that prompt.';
}

function estimateScoutFocusTarget(bounds: THREE.Box3, camera: THREE.PerspectiveCamera): THREE.Vector3 {
  const sceneCenter = bounds.getCenter(new THREE.Vector3());
  const forward = getForwardVector(camera.quaternion);
  const sceneDiagonal = Math.max(bounds.getSize(new THREE.Vector3()).length(), 1);
  const projectedDistance = sceneCenter.clone().sub(camera.position).dot(forward);
  const fallbackDistance = camera.position.distanceTo(sceneCenter);
  const focusDistance = THREE.MathUtils.clamp(
    projectedDistance > 0 ? projectedDistance : fallbackDistance,
    0.75,
    sceneDiagonal * 1.5,
  );

  return camera.position.clone().add(forward.multiplyScalar(focusDistance));
}

function resolveArcDirection(
  segment: AgenticArcSegmentPlan,
  currentPose: InterpolatedPose,
  orbitFrame: OrbitFrame,
): AgenticOrbitDirection {
  if (segment.direction) {
    return segment.direction;
  }

  if (segment.lookMode !== 'look-forward') {
    return 'clockwise';
  }

  const forward = projectOntoPlane(getForwardVector(currentPose.quaternion), orbitFrame.axis);
  if (forward.lengthSq() <= MIN_VECTOR_LENGTH_SQUARED) {
    return 'clockwise';
  }
  forward.normalize();

  const clockwiseTangent = orbitFrame.radialDirection.clone().applyAxisAngle(orbitFrame.axis, -0.05)
    .sub(orbitFrame.radialDirection)
    .normalize();
  const counterclockwiseTangent = orbitFrame.radialDirection.clone().applyAxisAngle(orbitFrame.axis, 0.05)
    .sub(orbitFrame.radialDirection)
    .normalize();
  return counterclockwiseTangent.dot(forward) > clockwiseTangent.dot(forward)
    ? 'counterclockwise'
    : 'clockwise';
}

function resolveFetchImpl(fetchImpl?: typeof fetch): typeof fetch {
  const resolvedFetch = fetchImpl ?? globalThis.fetch;
  if (typeof resolvedFetch !== 'function') {
    throw new Error('A fetch implementation is required for agentic camera-path generation.');
  }

  return resolvedFetch.bind(globalThis);
}

function resolveGenerationTimeoutMs(timeoutMs: number | undefined): number {
  if (typeof timeoutMs !== 'number' || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return DEFAULT_GENERATION_TIMEOUT_MS;
  }

  return timeoutMs;
}

function resolveHeightOffset(
  verticalBias: AgenticVerticalBias | undefined,
  preservedHeight: number,
  sceneHeight: number,
): number {
  if (verticalBias === 'low') {
    return -sceneHeight * 0.2;
  }

  if (verticalBias === 'high') {
    return sceneHeight * 0.25;
  }

  return THREE.MathUtils.clamp(
    preservedHeight,
    -sceneHeight * 0.35,
    sceneHeight * 0.35,
  );
}

function resolveScoutBaseOffset(
  center: THREE.Vector3,
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
  radius: number,
): THREE.Vector3 {
  const baseOffset = position.clone().sub(center);
  if (baseOffset.lengthSq() > MIN_VECTOR_LENGTH_SQUARED) {
    return baseOffset.setLength(radius);
  }

  const forwardOffset = getForwardVector(quaternion).multiplyScalar(-radius);
  if (forwardOffset.lengthSq() > MIN_VECTOR_LENGTH_SQUARED) {
    return forwardOffset;
  }

  return new THREE.Vector3(0, 0, radius);
}

function rotateScoutOffset(
  baseOffset: THREE.Vector3,
  baseUp: THREE.Vector3,
  baseRight: THREE.Vector3,
  spec: ScoutPoseSpec,
): { offset: THREE.Vector3; up: THREE.Vector3 } {
  const yawRotation = new THREE.Quaternion().setFromAxisAngle(baseUp, spec.yawRadians);
  const yawedOffset = baseOffset.clone().applyQuaternion(yawRotation);
  const yawedRight = baseRight.clone().applyQuaternion(yawRotation).normalize();
  const yawedUp = baseUp.clone().applyQuaternion(yawRotation).normalize();
  const pitchRotation = new THREE.Quaternion().setFromAxisAngle(yawedRight, spec.pitchRadians);

  return {
    offset: yawedOffset.applyQuaternion(pitchRotation),
    up: yawedUp.applyQuaternion(pitchRotation).normalize(),
  };
}

function serializeBounds(bounds: THREE.Box3): SerializedBounds {
  return {
    max: vectorToSerializable(bounds.max),
    min: vectorToSerializable(bounds.min),
  };
}

function serializeCamera(camera: THREE.PerspectiveCamera): SerializedCaptureCamera {
  return {
    aspect: Math.max(camera.aspect, 1e-6),
    fov: camera.fov,
    position: vectorToSerializable(camera.position),
    quaternion: quaternionToSerializable(camera.quaternion),
  };
}

function serializePathTail(keyframe: Keyframe | null): SerializedPathTail | null {
  if (!keyframe) {
    return null;
  }

  return {
    fov: keyframe.fov,
    position: { ...keyframe.position },
    quaternion: { ...keyframe.quaternion },
    time: keyframe.time,
  };
}

function serializePoseAsCamera(pose: InterpolatedPose, aspect: number): SerializedCaptureCamera {
  return {
    aspect: Math.max(aspect, 1e-6),
    fov: pose.fov,
    position: vectorToSerializable(pose.position),
    quaternion: quaternionToSerializable(pose.quaternion),
  };
}

function shouldRunTargetedRescan(groundedSubject: AgenticGroundedSubject): boolean {
  return groundedSubject.captureCount < 3
    || groundedSubject.confidence < 0.72
    || groundedSubject.meanResidual > Math.max(0.16, groundedSubject.sceneScale * 0.035);
}

function solveLeastSquaresPoint(observations: RayObservation[]): THREE.Vector3 {
  const matrix = Array.from({ length: 9 }, () => 0);
  const vector = new THREE.Vector3();

  for (const observation of observations) {
    const { confidence, direction, origin } = observation;
    const dx = direction.x;
    const dy = direction.y;
    const dz = direction.z;
    const projector = [
      1 - dx * dx,
      -dx * dy,
      -dx * dz,
      -dy * dx,
      1 - dy * dy,
      -dy * dz,
      -dz * dx,
      -dz * dy,
      1 - dz * dz,
    ];

    for (let index = 0; index < matrix.length; index += 1) {
      matrix[index] += projector[index] * confidence;
    }

    vector.add(multiplyMatrixVector(projector, origin).multiplyScalar(confidence));
  }

  const inverse = invert3x3(matrix);
  if (!inverse) {
    throw new AgenticPathGenerationError('The planner observations could not be triangulated into a stable 3D point.');
  }

  return multiplyMatrixVector(inverse, vector);
}

function vectorFromSerializable(vector: SerializableVector3): THREE.Vector3 {
  return new THREE.Vector3(vector.x, vector.y, vector.z);
}

function vectorToSerializable(vector: THREE.Vector3): SerializableVector3 {
  return {
    x: vector.x,
    y: vector.y,
    z: vector.z,
  };
}

function waitForNextAnimationFrame(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => resolve());
  });
}

interface AgenticGenerationTimeout {
  cancel(message?: string): void;
  readonly signal: AbortSignal;
  runStep<T>(operation: () => Promise<T>, context: string): Promise<T>;
  throwIfAborted(context: string): void;
}

function createGenerationTimeout(timeoutMs: number): AgenticGenerationTimeout {
  const startedAt = Date.now();
  const abortController = new AbortController();
  let abortReason: AgenticPathGenerationError | null = null;

  const createTimeoutError = (context: string) =>
    new AgenticPathGenerationError(
      `Agentic path generation timed out after ${formatTimeoutDuration(timeoutMs)} while ${context}. Controls were restored; try again.`,
    );

  const abortWith = (reason: AgenticPathGenerationError) => {
    if (!abortReason) {
      abortReason = reason;
      abortController.abort();
    }

    return abortReason;
  };

  const throwIfAborted = (context: string) => {
    if (abortReason) {
      throw abortReason;
    }

    if (Date.now() - startedAt >= timeoutMs) {
      throw abortWith(createTimeoutError(context));
    }
  };

  return {
    cancel(message = 'Agentic draft generation canceled. Controls restored.'): void {
      abortWith(new AgenticPathGenerationError(message));
    },
    signal: abortController.signal,
    async runStep<T>(operation: () => Promise<T>, context: string): Promise<T> {
      throwIfAborted(context);
      const remainingMs = Math.max(1, timeoutMs - (Date.now() - startedAt));
      let abortListener: EventListener | null = null;
      let timer: ReturnType<typeof setTimeout> | null = null;

      try {
        return await Promise.race([
          operation(),
          new Promise<never>((_, reject) => {
            abortListener = () => {
              reject(abortReason ?? new AgenticPathGenerationError('Agentic draft generation canceled. Controls restored.'));
            };

            abortController.signal.addEventListener('abort', abortListener, { once: true });
            timer = setTimeout(() => {
              reject(abortWith(createTimeoutError(context)));
            }, remainingMs);
          }),
        ]);
      } catch (error) {
        if (abortReason) {
          throw abortReason;
        }

        if (isAbortError(error)) {
          throw abortWith(createTimeoutError(context));
        }

        throw error;
      } finally {
        if (timer !== null) {
          clearTimeout(timer);
        }
        if (abortListener) {
          abortController.signal.removeEventListener('abort', abortListener);
        }
      }
    },
    throwIfAborted,
  };
}

function formatTimeoutDuration(timeoutMs: number): string {
  if (timeoutMs % 1000 === 0) {
    const seconds = timeoutMs / 1000;
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  }

  return `${timeoutMs} ms`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
