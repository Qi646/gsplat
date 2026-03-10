import * as THREE from 'three';
import type { InterpolatedPose, Keyframe, SerializableQuaternion, SerializableVector3 } from '../types';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';

export type AgenticOrientationMode = 'look-at-subject' | 'look-forward';
export type AgenticOrbitDirection = 'clockwise' | 'counterclockwise';
export type AgenticVerticalBias = 'low' | 'mid' | 'high';

export interface AgenticShotSpec {
  pathType: 'orbit';
  orientationMode: AgenticOrientationMode;
  fullOrbit: boolean;
  direction?: AgenticOrbitDirection;
  durationSeconds?: number;
  verticalBias?: AgenticVerticalBias;
}

export interface AgenticPathCapture {
  camera: SerializedCaptureCamera;
  height: number;
  id: string;
  imageDataUrl: string;
  role: 'current' | 'requested';
  width: number;
}

export interface AgenticSubjectLocalization {
  captureId: string;
  confidence: number;
  pixelX: number;
  pixelY: number;
}

export interface AgenticPlannerCaptureRequest {
  captureId: string;
  forwardOffsetScale?: number;
  lateralOffsetScale?: number;
  pitchDegrees?: number;
  reason: string;
  referenceCaptureId: string;
  verticalOffsetScale?: number;
  yawDegrees?: number;
}

export interface AgenticPlannerCaptureStep {
  message: string;
  requestedCaptures: AgenticPlannerCaptureRequest[];
}

export interface AgenticPathCompleteResponse {
  shotSpec: AgenticShotSpec;
  status: 'complete';
  subjectLocalizations: AgenticSubjectLocalization[];
  warning?: string;
}

export interface AgenticPathNeedsCapturesResponse {
  message: string;
  requestedCaptures: AgenticPlannerCaptureRequest[];
  status: 'needs-captures';
  warning?: string;
}

export type AgenticPathPlannerResponse = AgenticPathCompleteResponse | AgenticPathNeedsCapturesResponse;

export interface AgenticPathProgress {
  buttonLabel: string;
  captureIndex?: number;
  message: string;
  stage: 'capturing-current' | 'capturing-requested' | 'planning' | 'triangulating' | 'building' | 'cancelling';
  totalCaptures?: number;
}

export interface AgenticPathGeneratorOptions {
  fetchImpl?: typeof fetch;
  onProgress?: (progress: AgenticPathProgress) => void;
  timeoutMs?: number;
  viewer: ViewerAdapter;
}

export interface GenerateAgenticPathOptions {
  existingKeyframes: Keyframe[];
  prompt: string;
}

interface AgenticPathRequest {
  captures: AgenticPathCapture[];
  currentCamera: SerializedCaptureCamera;
  pathTail: SerializedPathTail | null;
  plannerHistory: AgenticPlannerCaptureStep[];
  prompt: string;
  remainingStepBudget: number;
  sceneBounds: SerializedBounds;
}

interface BuildOrbitKeyframesOptions {
  anchor: THREE.Vector3;
  basePose: InterpolatedPose;
  bounds: THREE.Box3;
  shotSpec: AgenticShotSpec;
  startTime: number;
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
const DEFAULT_ORBIT_DURATION_SECONDS = 6;
const DEFAULT_ORBIT_SWEEP_DEGREES = 300;
const DEFAULT_PARTIAL_ORBIT_KEYFRAME_COUNT = 8;
const DEFAULT_FULL_ORBIT_KEYFRAME_COUNT = 9;
const DEFAULT_GENERATION_TIMEOUT_MS = 45_000;
const DEFAULT_LOOK_UP = new THREE.Vector3(0, 1, 0);
const LOCAL_CAMERA_RIGHT = new THREE.Vector3(1, 0, 0);
const LOCAL_CAMERA_UP = new THREE.Vector3(0, 1, 0);
const LOCAL_CAMERA_FORWARD = new THREE.Vector3(0, 0, -1);
const MAX_CAPTURE_LONG_SIDE = 640;
const MAX_CAPTURE_REQUESTS_PER_STEP = 3;
const MAX_FORWARD_OFFSET_SCALE = 0.35;
const MAX_LATERAL_OFFSET_SCALE = 0.35;
const MAX_PLANNER_STEPS = 4;
const MAX_PITCH_DEGREES = 20;
const MAX_VERTICAL_OFFSET_SCALE = 0.25;
const MAX_YAW_DEGREES = 30;
const MIN_VECTOR_LENGTH_SQUARED = 1e-8;

export class AgenticPathGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgenticPathGenerationError';
  }
}

export class AgenticPathGenerator {
  private readonly fetchImpl: typeof fetch;
  private generating = false;
  private generationTimeout: AgenticGenerationTimeout | null = null;
  private readonly onProgress?: (progress: AgenticPathProgress) => void;
  private readonly timeoutMs: number;
  private readonly viewer: ViewerAdapter;

  constructor(options: AgenticPathGeneratorOptions) {
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
      message: 'Canceling agentic path generation and restoring controls…',
      stage: 'cancelling',
    });
    this.generationTimeout.cancel('Agentic path generation canceled. Controls restored.');
    return true;
  }

  async generatePath(options: GenerateAgenticPathOptions): Promise<Keyframe[]> {
    if (this.generating) {
      throw new AgenticPathGenerationError('Agentic path generation is already in progress.');
    }

    const prompt = options.prompt.trim();
    if (!prompt) {
      throw new AgenticPathGenerationError('Enter a camera-path prompt before generating keyframes.');
    }

    if (!this.viewer.isSceneLoaded()) {
      throw new AgenticPathGenerationError('Load a scene before generating a camera path.');
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

    try {
      const response = await this.resolvePathPlan({
        currentCamera: serializeCamera(camera),
        livePose,
        pathTail: serializePathTail(options.existingKeyframes.at(-1) ?? null),
        prompt,
        sceneBounds: serializeBounds(bounds),
        sceneBoundsBox: bounds,
        viewerCamera: camera,
      }, timeout);
      const lastKeyframe = options.existingKeyframes.at(-1) ?? null;
      const basePose = lastKeyframe ? keyframeToPose(lastKeyframe) : livePose;
      const startTime = lastKeyframe ? lastKeyframe.time + APPEND_BRIDGE_SECONDS : 0;
      this.reportProgress({
        buttonLabel: 'Building path…',
        message: 'Building orbit keyframes from the planner output…',
        stage: 'building',
      });

      return buildOrbitKeyframes({
        anchor: response.anchor,
        basePose,
        bounds,
        shotSpec: response.shotSpec,
        startTime,
      });
    } finally {
      this.generating = false;
      this.generationTimeout = null;
    }
  }

  private async captureCurrentContext(
    livePose: InterpolatedPose,
    camera: THREE.PerspectiveCamera,
    timeout: AgenticGenerationTimeout,
  ): Promise<AgenticPathCapture[]> {
    try {
      this.reportCaptureProgress({
        captureIndex: 1,
        role: 'current',
        totalCaptures: 1,
      });
      await this.renderFrame(timeout, 'capturing the current view');
      return [
        await this.captureCurrentView('capture-current', 'current', camera, timeout, 'capturing the current view'),
      ];
    } finally {
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }
  }

  private async captureRequestedSet(
    requestedCaptures: AgenticPlannerCaptureRequest[],
    existingCaptures: AgenticPathCapture[],
    livePose: InterpolatedPose,
    sceneBounds: THREE.Box3,
    timeout: AgenticGenerationTimeout,
    plannerStepIndex: number,
  ): Promise<{ captures: AgenticPathCapture[]; executedRequests: AgenticPlannerCaptureRequest[] }> {
    if (requestedCaptures.length < 1 || requestedCaptures.length > MAX_CAPTURE_REQUESTS_PER_STEP) {
      throw new AgenticPathGenerationError('The planner requested an invalid number of follow-up captures.');
    }

    const captureById = new Map(existingCaptures.map(capture => [capture.id, capture]));
    const capturedViews: AgenticPathCapture[] = [];
    const executedRequests: AgenticPlannerCaptureRequest[] = [];

    try {
      for (const [index, requestedCapture] of requestedCaptures.entries()) {
        timeout.throwIfAborted('capturing planner-requested follow-up views');
        const referenceCapture = captureById.get(requestedCapture.referenceCaptureId);
        if (!referenceCapture) {
          throw new AgenticPathGenerationError(
            `The planner referenced an unknown capture for follow-up context: ${requestedCapture.referenceCaptureId}`,
          );
        }

        const capturePose = buildRequestedCapturePose(referenceCapture, requestedCapture, sceneBounds);
        this.reportCaptureProgress({
          captureIndex: index + 1,
          plannerStepIndex,
          reason: requestedCapture.reason,
          role: 'requested',
          totalCaptures: requestedCaptures.length,
        });
        this.viewer.applyCameraPose(capturePose);
        await this.renderFrame(timeout, 'capturing planner-requested follow-up views');
        const activeCamera = this.viewer.getCamera();
        if (!activeCamera) {
          throw new AgenticPathGenerationError('Viewer camera became unavailable during follow-up capture.');
        }

        capturedViews.push(await this.captureCurrentView(
          requestedCapture.captureId,
          'requested',
          activeCamera,
          timeout,
          'capturing planner-requested follow-up views',
        ));
        executedRequests.push({ ...requestedCapture });
      }
    } finally {
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }

    return {
      captures: capturedViews,
      executedRequests,
    };
  }

  private async captureCurrentView(
    id: string,
    role: 'current' | 'requested',
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

  private async resolvePathPlan(
    request: Omit<AgenticPathRequest, 'captures' | 'plannerHistory' | 'remainingStepBudget'> & {
      livePose: InterpolatedPose;
      sceneBoundsBox: THREE.Box3;
      viewerCamera: THREE.PerspectiveCamera;
    },
    timeout: AgenticGenerationTimeout,
  ): Promise<{ anchor: THREE.Vector3; shotSpec: AgenticShotSpec }> {
    const captures = await this.captureCurrentContext(
      request.livePose,
      request.viewerCamera,
      timeout,
    );
    const plannerHistory: AgenticPlannerCaptureStep[] = [];

    for (let stepIndex = 0; stepIndex < MAX_PLANNER_STEPS; stepIndex += 1) {
      const response = await this.requestPathPlan({
        captures,
        currentCamera: request.currentCamera,
        pathTail: request.pathTail,
        plannerHistory,
        prompt: request.prompt,
        remainingStepBudget: MAX_PLANNER_STEPS - stepIndex,
        sceneBounds: request.sceneBounds,
      }, timeout, stepIndex);

      if (response.status === 'complete') {
        this.reportTriangulationProgress(stepIndex);
        return {
          anchor: triangulateSubjectAnchor(response.subjectLocalizations, captures, request.sceneBoundsBox),
          shotSpec: response.shotSpec,
        };
      }

      const followUp = await this.captureRequestedSet(
        response.requestedCaptures,
        captures,
        request.livePose,
        request.sceneBoundsBox,
        timeout,
        stepIndex,
      );
      captures.push(...followUp.captures);
      plannerHistory.push({
        message: response.message,
        requestedCaptures: followUp.executedRequests,
      });
    }

    throw new AgenticPathGenerationError(
      'The planner needed more follow-up captures than the current step budget allows. Reframe the subject and try again.',
    );
  }

  private async requestPathPlan(
    request: AgenticPathRequest,
    timeout: AgenticGenerationTimeout,
    stepIndex: number,
  ): Promise<AgenticPathPlannerResponse> {
    this.reportProgress({
      buttonLabel: stepIndex > 0 ? `Planning ${stepIndex + 1}/${MAX_PLANNER_STEPS}…` : 'Planning…',
      message: stepIndex > 0
        ? `Sending the requested follow-up captures back to the planner (step ${stepIndex + 1}/${MAX_PLANNER_STEPS})…`
        : 'Sending the current view to the planner…',
      stage: 'planning',
    });
    const response = await timeout.runStep(() => this.fetchImpl('/api/path/generate', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: timeout.signal,
    }), 'waiting for the planner response');

    if (!response.ok) {
      throw new AgenticPathGenerationError(
        await timeout.runStep(() => readAgenticPathError(response), 'reading the planner error response'),
      );
    }

    return parseAgenticPathResponse(
      await timeout.runStep(() => response.json() as Promise<unknown>, 'reading the planner response'),
    );
  }

  private reportCaptureProgress(options: {
    captureIndex: number;
    plannerStepIndex?: number;
    reason?: string;
    role: 'current' | 'requested';
    totalCaptures: number;
  }): void {
    const isCurrentCapture = options.role === 'current';
    const stepLabel = options.plannerStepIndex === undefined
      ? ''
      : ` Planner step ${options.plannerStepIndex + 2}/${MAX_PLANNER_STEPS}.`;
    const reasonLabel = options.reason ? ` ${options.reason}` : '';
    this.reportProgress({
      buttonLabel: `Capturing ${options.captureIndex}/${options.totalCaptures}…`,
      captureIndex: options.captureIndex,
      message: isCurrentCapture
        ? 'Capturing the current view. Viewer controls are temporarily locked.'
        : `Capturing planner-requested follow-up view ${options.captureIndex}/${options.totalCaptures}.${stepLabel}${reasonLabel} Viewer controls are temporarily locked.`,
      stage: isCurrentCapture ? 'capturing-current' : 'capturing-requested',
      totalCaptures: options.totalCaptures,
    });
  }

  private reportTriangulationProgress(stepIndex: number): void {
    this.reportProgress({
      buttonLabel: 'Triangulating…',
      message: stepIndex > 0
        ? `Triangulating the subject anchor from the targeted follow-up captures (${stepIndex + 1}/${MAX_PLANNER_STEPS})…`
        : 'Triangulating the subject anchor from the captured views…',
      stage: 'triangulating',
    });
  }

  private reportProgress(progress: AgenticPathProgress): void {
    this.onProgress?.(progress);
  }
}

export function buildRequestedCapturePose(
  referenceCapture: AgenticPathCapture,
  request: AgenticPlannerCaptureRequest,
  sceneBounds: THREE.Box3,
): InterpolatedPose {
  const referencePose = poseFromSerializedCamera(referenceCapture.camera);
  const sceneDiagonal = Math.max(sceneBounds.getSize(new THREE.Vector3()).length(), 1);
  const lateralOffset = sceneDiagonal * THREE.MathUtils.clamp(
    request.lateralOffsetScale ?? 0,
    -MAX_LATERAL_OFFSET_SCALE,
    MAX_LATERAL_OFFSET_SCALE,
  );
  const verticalOffset = sceneDiagonal * THREE.MathUtils.clamp(
    request.verticalOffsetScale ?? 0,
    -MAX_VERTICAL_OFFSET_SCALE,
    MAX_VERTICAL_OFFSET_SCALE,
  );
  const forwardOffset = sceneDiagonal * THREE.MathUtils.clamp(
    request.forwardOffsetScale ?? 0,
    -MAX_FORWARD_OFFSET_SCALE,
    MAX_FORWARD_OFFSET_SCALE,
  );
  const yawRadians = THREE.MathUtils.degToRad(
    THREE.MathUtils.clamp(request.yawDegrees ?? 0, -MAX_YAW_DEGREES, MAX_YAW_DEGREES),
  );
  const pitchRadians = THREE.MathUtils.degToRad(
    THREE.MathUtils.clamp(request.pitchDegrees ?? 0, -MAX_PITCH_DEGREES, MAX_PITCH_DEGREES),
  );
  const quaternion = referencePose.quaternion.clone();
  if (Math.abs(yawRadians) > 0) {
    quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(LOCAL_CAMERA_UP, yawRadians));
  }
  if (Math.abs(pitchRadians) > 0) {
    quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(LOCAL_CAMERA_RIGHT, pitchRadians));
  }

  return {
    fov: referencePose.fov,
    position: referencePose.position.clone()
      .addScaledVector(getRightVector(referencePose.quaternion), lateralOffset)
      .addScaledVector(getUpVector(referencePose.quaternion), verticalOffset)
      .addScaledVector(getForwardVector(referencePose.quaternion), forwardOffset),
    quaternion,
  };
}

export function triangulateSubjectAnchor(
  localizations: AgenticSubjectLocalization[],
  captures: AgenticPathCapture[],
  sceneBounds: THREE.Box3,
): THREE.Vector3 {
  if (localizations.length < 2) {
    throw new AgenticPathGenerationError('The planner could not localize the requested subject in enough views.');
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
    throw new AgenticPathGenerationError('The planner could not resolve a stable 3D subject anchor from the captured views.');
  }

  const inflatedBounds = sceneBounds.clone().expandByScalar(Math.max(sceneDiagonal * 0.1, 0.25));
  if (!inflatedBounds.containsPoint(solvedPoint)) {
    throw new AgenticPathGenerationError('The resolved subject anchor falls outside the loaded scene bounds.');
  }

  return solvedPoint;
}

export function buildOrbitKeyframes(options: BuildOrbitKeyframesOptions): Keyframe[] {
  const { anchor, basePose, bounds, shotSpec, startTime } = options;
  const sceneSize = bounds.getSize(new THREE.Vector3());
  const sceneDiagonal = Math.max(sceneSize.length(), 1);
  const orbitFrame = deriveOrbitFrame(anchor, basePose.position, basePose.quaternion);
  const unclampedRadius = orbitFrame.radius;
  const minRadius = Math.max(sceneDiagonal * 0.2, 0.75);
  const maxRadius = Math.max(sceneDiagonal * 1.5, minRadius + 0.5);
  const radius = THREE.MathUtils.clamp(unclampedRadius || sceneDiagonal * 0.5, minRadius, maxRadius);
  const sceneHeight = Math.max(computeBoundsExtentAlongAxis(bounds, orbitFrame.axis), sceneDiagonal * 0.25, 1);
  const heightOffset = resolveHeightOffset(shotSpec.verticalBias, orbitFrame.height, sceneHeight);
  const durationSeconds = THREE.MathUtils.clamp(
    shotSpec.durationSeconds ?? DEFAULT_ORBIT_DURATION_SECONDS,
    2,
    20,
  );
  const sweepRadians = THREE.MathUtils.degToRad(
    shotSpec.fullOrbit ? 360 : DEFAULT_ORBIT_SWEEP_DEGREES,
  );
  const keyframeCount = shotSpec.fullOrbit ? DEFAULT_FULL_ORBIT_KEYFRAME_COUNT : DEFAULT_PARTIAL_ORBIT_KEYFRAME_COUNT;
  const direction = resolveOrbitDirection(shotSpec, basePose, orbitFrame);
  const directionSign = direction === 'counterclockwise' ? 1 : -1;

  return Array.from({ length: keyframeCount }, (_, index) => {
    const ratio = index / (keyframeCount - 1);
    const angle = directionSign * sweepRadians * ratio;
    const position = createOrbitPosition(anchor, orbitFrame, radius, heightOffset, angle);
    const nextRatio = index === keyframeCount - 1 ? ratio : (index + 1) / (keyframeCount - 1);
    const nextAngle = directionSign * sweepRadians * nextRatio;
    const lookTarget = index === keyframeCount - 1
      ? position.clone().add(
          position.clone().sub(
            createOrbitPosition(
              anchor,
              orbitFrame,
              radius,
              heightOffset,
              directionSign * sweepRadians * Math.max(0, (index - 1) / (keyframeCount - 1)),
            ),
          ),
        )
      : createOrbitPosition(anchor, orbitFrame, radius, heightOffset, nextAngle);
    const quaternion = shotSpec.orientationMode === 'look-forward'
      ? buildLookQuaternion(position, lookTarget, orbitFrame.axis)
      : buildLookQuaternion(position, anchor, orbitFrame.axis);

    return {
      fov: basePose.fov,
      id: crypto.randomUUID(),
      position: vectorToSerializable(position),
      quaternion: quaternionToSerializable(quaternion),
      time: startTime + durationSeconds * ratio,
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

function clonePoseFromCamera(camera: THREE.PerspectiveCamera): InterpolatedPose {
  return {
    fov: camera.fov,
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
  };
}

function poseFromSerializedCamera(camera: SerializedCaptureCamera): InterpolatedPose {
  return {
    fov: camera.fov,
    position: new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
    quaternion: new THREE.Quaternion(
      camera.quaternion.x,
      camera.quaternion.y,
      camera.quaternion.z,
      camera.quaternion.w,
    ),
  };
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

function getForwardVector(quaternion: THREE.Quaternion): THREE.Vector3 {
  return LOCAL_CAMERA_FORWARD.clone().applyQuaternion(quaternion).normalize();
}

function getRightVector(quaternion: THREE.Quaternion): THREE.Vector3 {
  return LOCAL_CAMERA_RIGHT.clone().applyQuaternion(quaternion).normalize();
}

function getUpVector(quaternion: THREE.Quaternion): THREE.Vector3 {
  return LOCAL_CAMERA_UP.clone().applyQuaternion(quaternion).normalize();
}

function deriveOrbitFrame(
  center: THREE.Vector3,
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
): OrbitFrame {
  const relativeOffset = position.clone().sub(center);
  const axis = getUpVector(quaternion);
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

function computeBoundsExtentAlongAxis(bounds: THREE.Box3, axis: THREE.Vector3): number {
  const halfSize = bounds.getSize(new THREE.Vector3()).multiplyScalar(0.5);
  return 2 * (
    Math.abs(axis.x) * halfSize.x
    + Math.abs(axis.y) * halfSize.y
    + Math.abs(axis.z) * halfSize.z
  );
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

function parseAgenticPathResponse(input: unknown): AgenticPathPlannerResponse {
  if (!isRecord(input)) {
    throw new AgenticPathGenerationError('Planner response was not a JSON object.');
  }

  const warning = typeof input['warning'] === 'string' && input['warning'].trim().length > 0
    ? input['warning']
    : undefined;
  const status = parsePlannerResponseStatus(input);
  if (status === 'needs-captures') {
    return {
      message: readString(input, 'message', 'planner response'),
      requestedCaptures: parseRequestedCaptures(input['requestedCaptures']),
      status,
      warning,
    };
  }

  const shotSpec = parseShotSpec(input['shotSpec']);
  const rawLocalizations = input['subjectLocalizations'];
  if (!Array.isArray(rawLocalizations)) {
    throw new AgenticPathGenerationError('Planner response was missing subjectLocalizations.');
  }

  const subjectLocalizations = rawLocalizations.map((localization, index) =>
    parseLocalization(localization, `subjectLocalizations[${index}]`));
  if (subjectLocalizations.length < 2) {
    throw new AgenticPathGenerationError('The planner could not localize the subject in enough captures.');
  }

  return {
    shotSpec,
    status,
    subjectLocalizations,
    warning,
  };
}

function parseCaptureRequest(value: unknown, context: string): AgenticPlannerCaptureRequest {
  if (!isRecord(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context} must be an object.`);
  }

  return {
    captureId: readString(value, 'captureId', context),
    forwardOffsetScale: readOptionalFiniteNumber(value, 'forwardOffsetScale', context),
    lateralOffsetScale: readOptionalFiniteNumber(value, 'lateralOffsetScale', context),
    pitchDegrees: readOptionalFiniteNumber(value, 'pitchDegrees', context),
    reason: readString(value, 'reason', context),
    referenceCaptureId: readString(value, 'referenceCaptureId', context),
    verticalOffsetScale: readOptionalFiniteNumber(value, 'verticalOffsetScale', context),
    yawDegrees: readOptionalFiniteNumber(value, 'yawDegrees', context),
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

function parsePlannerResponseStatus(input: UnknownRecord): 'complete' | 'needs-captures' {
  const status = input['status'];
  if (status === 'complete' || status === 'needs-captures') {
    return status;
  }

  if (input['requestedCaptures'] !== undefined) {
    return 'needs-captures';
  }

  if (input['shotSpec'] !== undefined || input['subjectLocalizations'] !== undefined) {
    return 'complete';
  }

  throw new AgenticPathGenerationError('Planner response was missing status.');
}

function parseRequestedCaptures(value: unknown): AgenticPlannerCaptureRequest[] {
  if (!Array.isArray(value)) {
    throw new AgenticPathGenerationError('Planner response was missing requestedCaptures.');
  }

  if (value.length < 1 || value.length > MAX_CAPTURE_REQUESTS_PER_STEP) {
    throw new AgenticPathGenerationError('Planner response requested an invalid number of follow-up captures.');
  }

  return value.map((entry, index) => parseCaptureRequest(entry, `requestedCaptures[${index}]`));
}

function parseShotSpec(value: unknown): AgenticShotSpec {
  if (!isRecord(value)) {
    throw new AgenticPathGenerationError('Planner response was missing shotSpec.');
  }

  const pathType = readString(value, 'pathType', 'shotSpec');
  if (pathType !== 'orbit') {
    throw new AgenticPathGenerationError(`Planner returned an unsupported path type: ${pathType}`);
  }

  const orientationMode = readString(value, 'orientationMode', 'shotSpec');
  if (orientationMode !== 'look-at-subject' && orientationMode !== 'look-forward') {
    throw new AgenticPathGenerationError(`Planner returned an unsupported orientation mode: ${orientationMode}`);
  }

  const fullOrbit = readBoolean(value, 'fullOrbit', 'shotSpec');
  const directionValue = value['direction'];
  const verticalBiasValue = value['verticalBias'];
  const durationValue = value['durationSeconds'];

  return {
    direction: directionValue === undefined || directionValue === null
      ? undefined
      : parseDirection(directionValue),
    durationSeconds: durationValue === undefined || durationValue === null
      ? undefined
      : readFiniteNumber(value, 'durationSeconds', 'shotSpec'),
    fullOrbit,
    orientationMode,
    pathType: 'orbit',
    verticalBias: verticalBiasValue === undefined || verticalBiasValue === null
      ? undefined
      : parseVerticalBias(verticalBiasValue),
  };
}

function parseDirection(value: unknown): AgenticOrbitDirection {
  if (value !== 'clockwise' && value !== 'counterclockwise') {
    throw new AgenticPathGenerationError(`Planner returned an unsupported orbit direction: ${String(value)}`);
  }

  return value;
}

function parseVerticalBias(value: unknown): AgenticVerticalBias {
  if (value !== 'low' && value !== 'mid' && value !== 'high') {
    throw new AgenticPathGenerationError(`Planner returned an unsupported vertical bias: ${String(value)}`);
  }

  return value;
}

function quaternionToSerializable(quaternion: THREE.Quaternion): SerializableQuaternion {
  return {
    w: quaternion.w,
    x: quaternion.x,
    y: quaternion.y,
    z: quaternion.z,
  };
}

function readBoolean(record: UnknownRecord, key: string, context: string): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') {
    throw new AgenticPathGenerationError(`Planner response field ${context}.${key} must be a boolean.`);
  }

  return value;
}

function readFiniteNumber(record: UnknownRecord, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context}.${key} must be a finite number.`);
  }

  return value;
}

function readOptionalFiniteNumber(record: UnknownRecord, key: string, context: string): number | undefined {
  const value = record[key];
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AgenticPathGenerationError(`Planner response field ${context}.${key} must be a finite number when present.`);
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

  return 'Could not generate an agentic camera path from that prompt.';
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

function resolveOrbitDirection(
  shotSpec: AgenticShotSpec,
  basePose: InterpolatedPose,
  orbitFrame: OrbitFrame,
): AgenticOrbitDirection {
  if (shotSpec.direction) {
    return shotSpec.direction;
  }

  if (shotSpec.orientationMode !== 'look-forward') {
    return 'clockwise';
  }

  const forward = projectOntoPlane(getForwardVector(basePose.quaternion), orbitFrame.axis);
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

function projectOntoPlane(vector: THREE.Vector3, normal: THREE.Vector3): THREE.Vector3 {
  return vector.clone().sub(normal.clone().multiplyScalar(vector.dot(normal)));
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
    cancel(message = 'Agentic path generation canceled. Controls restored.'): void {
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
              reject(abortReason ?? new AgenticPathGenerationError('Agentic path generation canceled. Controls restored.'));
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
