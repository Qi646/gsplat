import type {
  CameraPath,
  Keyframe,
  SerializableQuaternion,
  SerializableVector3,
} from '../types';

const CAMERA_PATH_VERSION = 2 as const;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readString(record: UnknownRecord, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid camera path file: ${context} ${key} must be a non-empty string.`);
  }
  return value;
}

function readFiniteNumber(record: UnknownRecord, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid camera path file: ${context} ${key} must be a finite number.`);
  }
  return value;
}

function readVector3(value: unknown, context: string): SerializableVector3 {
  if (!isRecord(value)) {
    throw new Error(`Invalid camera path file: ${context} position must be an object.`);
  }

  return {
    x: readFiniteNumber(value, 'x', `${context} position`),
    y: readFiniteNumber(value, 'y', `${context} position`),
    z: readFiniteNumber(value, 'z', `${context} position`),
  };
}

function readQuaternion(value: unknown, context: string): SerializableQuaternion {
  if (!isRecord(value)) {
    throw new Error(`Invalid camera path file: ${context} quaternion must be an object.`);
  }

  const quaternion = {
    x: readFiniteNumber(value, 'x', `${context} quaternion`),
    y: readFiniteNumber(value, 'y', `${context} quaternion`),
    z: readFiniteNumber(value, 'z', `${context} quaternion`),
    w: readFiniteNumber(value, 'w', `${context} quaternion`),
  };

  const length = Math.hypot(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  if (!(length > 0)) {
    throw new Error(`Invalid camera path file: ${context} quaternion must be non-zero.`);
  }

  return {
    x: quaternion.x / length,
    y: quaternion.y / length,
    z: quaternion.z / length,
    w: quaternion.w / length,
  };
}

function isIdentityQuaternion(quaternion: SerializableQuaternion): boolean {
  return (
    Math.abs(quaternion.x) < 1e-6 &&
    Math.abs(quaternion.y) < 1e-6 &&
    Math.abs(quaternion.z) < 1e-6 &&
    Math.abs(quaternion.w - 1) < 1e-6
  );
}

function cloneKeyframe(keyframe: Keyframe): Keyframe {
  return {
    id: keyframe.id,
    time: keyframe.time,
    position: { ...keyframe.position },
    quaternion: { ...keyframe.quaternion },
    fov: keyframe.fov,
  };
}

function normalizeKeyframes(keyframes: Keyframe[]): Keyframe[] {
  return keyframes
    .map(cloneKeyframe)
    .sort((left, right) => left.time - right.time);
}

function normalizeSceneRotation(
  sceneRotation?: SerializableQuaternion | null,
): SerializableQuaternion | undefined {
  if (!sceneRotation || isIdentityQuaternion(sceneRotation)) {
    return undefined;
  }

  return { ...sceneRotation };
}

function parseKeyframe(value: unknown, index: number): Keyframe {
  const context = `keyframe ${index + 1}`;

  if (!isRecord(value)) {
    throw new Error(`Invalid camera path file: ${context} must be an object.`);
  }

  const time = readFiniteNumber(value, 'time', context);
  if (time < 0) {
    throw new Error(`Invalid camera path file: ${context} time must be >= 0.`);
  }

  const fov = readFiniteNumber(value, 'fov', context);
  if (fov <= 0 || fov >= 180) {
    throw new Error(`Invalid camera path file: ${context} fov must be between 0 and 180.`);
  }

  return {
    id: readString(value, 'id', context),
    time,
    position: readVector3(value['position'], context),
    quaternion: readQuaternion(value['quaternion'], context),
    fov,
  };
}

export function buildCameraPath(
  keyframes: Keyframe[],
  createdAt = new Date().toISOString(),
  sceneRotation?: SerializableQuaternion | null,
): CameraPath {
  const normalizedKeyframes = normalizeKeyframes(keyframes);
  return {
    version: CAMERA_PATH_VERSION,
    keyframes: normalizedKeyframes,
    totalDuration: normalizedKeyframes.at(-1)?.time ?? 0,
    createdAt,
    sceneRotation: normalizeSceneRotation(sceneRotation),
  };
}

export function parseCameraPath(input: unknown): CameraPath {
  if (!isRecord(input)) {
    throw new Error('Invalid camera path file: root value must be an object.');
  }

  const version = input['version'];
  if (version !== 1 && version !== CAMERA_PATH_VERSION) {
    throw new Error('Invalid camera path file: unsupported version.');
  }

  const rawKeyframes = input['keyframes'];
  if (!Array.isArray(rawKeyframes)) {
    throw new Error('Invalid camera path file: keyframes must be an array.');
  }

  const normalizedKeyframes = normalizeKeyframes(rawKeyframes.map((keyframe, index) => parseKeyframe(keyframe, index)));
  const ids = new Set<string>();
  for (const keyframe of normalizedKeyframes) {
    if (ids.has(keyframe.id)) {
      throw new Error('Invalid camera path file: keyframe ids must be unique.');
    }
    ids.add(keyframe.id);
  }

  const createdAt = typeof input['createdAt'] === 'string' ? input['createdAt'] : new Date().toISOString();
  const sceneRotation =
    version === CAMERA_PATH_VERSION && input['sceneRotation'] !== undefined
      ? readQuaternion(input['sceneRotation'], 'scene')
      : undefined;

  return buildCameraPath(normalizedKeyframes, createdAt, sceneRotation);
}
