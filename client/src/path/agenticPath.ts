import * as THREE from 'three';
import type { InterpolatedPose, Keyframe, SerializableQuaternion, SerializableVector3 } from '../types';
import { computeFramedSceneView } from '../viewer/sceneFraming';
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
  role: 'current' | 'scout';
  width: number;
}

export interface AgenticSubjectLocalization {
  captureId: string;
  confidence: number;
  pixelX: number;
  pixelY: number;
}

export interface AgenticPathResponse {
  shotSpec: AgenticShotSpec;
  subjectLocalizations: AgenticSubjectLocalization[];
  warning?: string;
}

export interface AgenticPathGeneratorOptions {
  fetchImpl?: typeof fetch;
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
  prompt: string;
  sceneBounds: SerializedBounds;
}

interface BuildOrbitKeyframesOptions {
  anchor: THREE.Vector3;
  basePose: InterpolatedPose;
  bounds: THREE.Box3;
  shotSpec: AgenticShotSpec;
  startTime: number;
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
const MAX_CAPTURE_LONG_SIDE = 640;

export class AgenticPathGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgenticPathGenerationError';
  }
}

export class AgenticPathGenerator {
  private readonly fetchImpl: typeof fetch;
  private generating = false;
  private readonly viewer: ViewerAdapter;

  constructor(options: AgenticPathGeneratorOptions) {
    this.viewer = options.viewer;
    this.fetchImpl = resolveFetchImpl(options.fetchImpl);
  }

  isGenerating(): boolean {
    return this.generating;
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

    try {
      const captures = await this.captureScoutSet(bounds, livePose, camera);
      const response = await this.requestPathPlan({
        captures,
        currentCamera: serializeCamera(camera),
        pathTail: serializePathTail(options.existingKeyframes.at(-1) ?? null),
        prompt,
        sceneBounds: serializeBounds(bounds),
      });
      const anchor = triangulateSubjectAnchor(response.subjectLocalizations, captures, bounds);
      const lastKeyframe = options.existingKeyframes.at(-1) ?? null;
      const basePose = lastKeyframe ? keyframeToPose(lastKeyframe) : livePose;
      const startTime = lastKeyframe ? lastKeyframe.time + APPEND_BRIDGE_SECONDS : 0;

      return buildOrbitKeyframes({
        anchor,
        basePose,
        bounds,
        shotSpec: response.shotSpec,
        startTime,
      });
    } finally {
      this.generating = false;
    }
  }

  private async captureScoutSet(
    bounds: THREE.Box3,
    livePose: InterpolatedPose,
    camera: THREE.PerspectiveCamera,
  ): Promise<AgenticPathCapture[]> {
    const captures: AgenticPathCapture[] = [];

    try {
      await this.renderFrame();
      captures.push(await this.captureCurrentView('capture-current', 'current', camera));

      const scoutPoses = buildScoutCameraPoses(bounds, camera);
      for (const [index, scoutPose] of scoutPoses.entries()) {
        this.viewer.applyCameraPose(scoutPose);
        await this.renderFrame();
        const activeCamera = this.viewer.getCamera();
        if (!activeCamera) {
          throw new AgenticPathGenerationError('Viewer camera became unavailable during scout capture.');
        }

        captures.push(await this.captureCurrentView(`capture-scout-${index + 1}`, 'scout', activeCamera));
      }
    } finally {
      this.viewer.applyCameraPose(livePose);
      await this.renderFrame();
    }

    return captures;
  }

  private async captureCurrentView(
    id: string,
    role: 'current' | 'scout',
    camera: THREE.PerspectiveCamera,
  ): Promise<AgenticPathCapture> {
    const frame = await this.viewer.captureFrame();
    const image = await blobToJpegDataUrl(frame);

    return {
      camera: serializeCamera(camera),
      height: image.height,
      id,
      imageDataUrl: image.dataUrl,
      role,
      width: image.width,
    };
  }

  private async renderFrame(): Promise<void> {
    this.viewer.renderNow();
    await waitForNextAnimationFrame();
  }

  private async requestPathPlan(request: AgenticPathRequest): Promise<AgenticPathResponse> {
    const response = await this.fetchImpl('/api/path/generate', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new AgenticPathGenerationError(await readAgenticPathError(response));
    }

    return parseAgenticPathResponse(await response.json() as unknown);
  }
}

export function buildScoutCameraPoses(
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
): InterpolatedPose[] {
  const center = bounds.getCenter(new THREE.Vector3());
  const sceneSize = bounds.getSize(new THREE.Vector3());
  const sceneDiagonal = Math.max(sceneSize.length(), 1);
  const framedView = computeFramedSceneView(bounds, camera);
  const framedDistance = framedView ? framedView.position.distanceTo(center) : sceneDiagonal;
  const currentDistance = camera.position.distanceTo(center);
  const radius = Math.max(framedDistance, currentDistance, sceneDiagonal * 0.75, 1);
  const maxHeightOffset = Math.max(sceneSize.y, sceneDiagonal * 0.35, 0.75);
  const preservedHeight = THREE.MathUtils.clamp(
    camera.position.y - center.y,
    -maxHeightOffset,
    maxHeightOffset,
  );

  return [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map(angle => {
    const position = new THREE.Vector3(
      center.x + Math.cos(angle) * radius,
      center.y + preservedHeight,
      center.z + Math.sin(angle) * radius,
    );

    return {
      fov: camera.fov,
      position,
      quaternion: buildLookQuaternion(position, center),
    };
  });
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
    throw new AgenticPathGenerationError('The planner could not resolve a stable 3D subject anchor from the scout views.');
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
  const relativeOffset = new THREE.Vector3().copy(basePose.position).sub(anchor);
  const startAngle = Math.atan2(relativeOffset.z, relativeOffset.x);
  const unclampedRadius = Math.hypot(relativeOffset.x, relativeOffset.z);
  const minRadius = Math.max(sceneDiagonal * 0.2, 0.75);
  const maxRadius = Math.max(sceneDiagonal * 1.5, minRadius + 0.5);
  const radius = THREE.MathUtils.clamp(unclampedRadius || sceneDiagonal * 0.5, minRadius, maxRadius);
  const sceneHeight = Math.max(sceneSize.y, sceneDiagonal * 0.25, 1);
  const preservedHeight = basePose.position.y - anchor.y;
  const heightOffset = resolveHeightOffset(shotSpec.verticalBias, preservedHeight, sceneHeight);
  const durationSeconds = THREE.MathUtils.clamp(
    shotSpec.durationSeconds ?? DEFAULT_ORBIT_DURATION_SECONDS,
    2,
    20,
  );
  const sweepRadians = THREE.MathUtils.degToRad(
    shotSpec.fullOrbit ? 360 : DEFAULT_ORBIT_SWEEP_DEGREES,
  );
  const keyframeCount = shotSpec.fullOrbit ? DEFAULT_FULL_ORBIT_KEYFRAME_COUNT : DEFAULT_PARTIAL_ORBIT_KEYFRAME_COUNT;
  const direction = resolveOrbitDirection(shotSpec, basePose, startAngle);
  const directionSign = direction === 'counterclockwise' ? 1 : -1;

  return Array.from({ length: keyframeCount }, (_, index) => {
    const ratio = index / (keyframeCount - 1);
    const angle = startAngle + directionSign * sweepRadians * ratio;
    const position = new THREE.Vector3(
      anchor.x + Math.cos(angle) * radius,
      anchor.y + heightOffset,
      anchor.z + Math.sin(angle) * radius,
    );
    const tangent = new THREE.Vector3(
      -Math.sin(angle) * directionSign,
      0,
      Math.cos(angle) * directionSign,
    ).normalize();
    const nextRatio = Math.min(1, (index + 1) / (keyframeCount - 1));
    const nextAngle = startAngle + directionSign * sweepRadians * nextRatio;
    const lookTarget = index === keyframeCount - 1
      ? position.clone().add(tangent)
      : new THREE.Vector3(
          anchor.x + Math.cos(nextAngle) * radius,
          anchor.y + heightOffset,
          anchor.z + Math.sin(nextAngle) * radius,
        );
    const quaternion = shotSpec.orientationMode === 'look-forward'
      ? buildLookQuaternion(position, lookTarget)
      : buildLookQuaternion(position, anchor);

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

function buildLookQuaternion(position: THREE.Vector3, target: THREE.Vector3): THREE.Quaternion {
  const matrix = new THREE.Matrix4().lookAt(position, target, new THREE.Vector3(0, 1, 0));
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function clonePoseFromCamera(camera: THREE.PerspectiveCamera): InterpolatedPose {
  return {
    fov: camera.fov,
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
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
  return new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion).normalize();
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

function parseAgenticPathResponse(input: unknown): AgenticPathResponse {
  if (!isRecord(input)) {
    throw new AgenticPathGenerationError('Planner response was not a JSON object.');
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
    subjectLocalizations,
    warning: typeof input['warning'] === 'string' && input['warning'].trim().length > 0
      ? input['warning']
      : undefined,
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
  startAngle: number,
): AgenticOrbitDirection {
  if (shotSpec.direction) {
    return shotSpec.direction;
  }

  if (shotSpec.orientationMode !== 'look-forward') {
    return 'clockwise';
  }

  const forward = getForwardVector(basePose.quaternion);
  const forwardXZ = new THREE.Vector3(forward.x, 0, forward.z).normalize();
  if (forwardXZ.lengthSq() === 0) {
    return 'clockwise';
  }

  const clockwiseTangent = new THREE.Vector3(Math.sin(startAngle), 0, -Math.cos(startAngle)).normalize();
  const counterclockwiseTangent = new THREE.Vector3(-Math.sin(startAngle), 0, Math.cos(startAngle)).normalize();
  return counterclockwiseTangent.dot(forwardXZ) > clockwiseTangent.dot(forwardXZ)
    ? 'counterclockwise'
    : 'clockwise';
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
