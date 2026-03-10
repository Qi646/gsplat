import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  buildOrbitKeyframes,
  buildScoutCameraPoses,
  triangulateSubjectAnchor,
  type AgenticPathCapture,
  type AgenticShotSpec,
  type AgenticSubjectLocalization,
} from '../path/agenticPath';

function createCamera(
  position: THREE.Vector3,
  target: THREE.Vector3,
  aspect = 16 / 9,
): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.copy(position);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
}

function createCapture(id: string, camera: THREE.PerspectiveCamera): AgenticPathCapture {
  return {
    camera: {
      aspect: camera.aspect,
      fov: camera.fov,
      position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
      quaternion: {
        w: camera.quaternion.w,
        x: camera.quaternion.x,
        y: camera.quaternion.y,
        z: camera.quaternion.z,
      },
    },
    height: 900,
    id,
    imageDataUrl: 'data:image/jpeg;base64,AA==',
    role: 'scout',
    width: 1600,
  };
}

function createShotSpec(overrides: Partial<AgenticShotSpec> = {}): AgenticShotSpec {
  return {
    fullOrbit: false,
    orientationMode: 'look-at-subject',
    pathType: 'orbit',
    ...overrides,
  };
}

function getForwardVector(quaternion: { w: number; x: number; y: number; z: number }): THREE.Vector3 {
  return new THREE.Vector3(0, 0, -1).applyQuaternion(
    new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w),
  ).normalize();
}

function projectPoint(
  point: THREE.Vector3,
  capture: AgenticPathCapture,
): AgenticSubjectLocalization {
  const camera = createCamera(
    new THREE.Vector3(
      capture.camera.position.x,
      capture.camera.position.y,
      capture.camera.position.z,
    ),
    point,
    capture.camera.aspect,
  );
  camera.quaternion.set(
    capture.camera.quaternion.x,
    capture.camera.quaternion.y,
    capture.camera.quaternion.z,
    capture.camera.quaternion.w,
  );
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const projected = point.clone().project(camera);
  return {
    captureId: capture.id,
    confidence: 0.98,
    pixelX: ((projected.x + 1) / 2) * capture.width,
    pixelY: ((1 - projected.y) / 2) * capture.height,
  };
}

describe('triangulateSubjectAnchor', () => {
  it('reconstructs a subject anchor from multiple localized captures', () => {
    const subject = new THREE.Vector3(1.5, 0.75, -0.5);
    const captureA = createCapture('capture-a', createCamera(new THREE.Vector3(6, 2, 3), subject));
    const captureB = createCapture('capture-b', createCamera(new THREE.Vector3(-5, 1.5, 2), subject));
    const sceneBounds = new THREE.Box3(
      new THREE.Vector3(-10, -3, -10),
      new THREE.Vector3(10, 6, 10),
    );

    const solved = triangulateSubjectAnchor(
      [projectPoint(subject, captureA), projectPoint(subject, captureB)],
      [captureA, captureB],
      sceneBounds,
    );

    expect(solved.distanceTo(subject)).toBeLessThan(0.05);
  });
});

describe('buildScoutCameraPoses', () => {
  it('creates four deterministic scout poses around the scene bounds', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-2, -1, -2),
      new THREE.Vector3(2, 3, 2),
    );
    const camera = createCamera(new THREE.Vector3(5, 2, 0), bounds.getCenter(new THREE.Vector3()));

    const poses = buildScoutCameraPoses(bounds, camera);

    expect(poses).toHaveLength(4);
    expect(poses[0]?.position.distanceTo(bounds.getCenter(new THREE.Vector3()))).toBeGreaterThan(2);
  });
});

describe('buildOrbitKeyframes', () => {
  it('orients generated keyframes toward the subject when requested', () => {
    const anchor = new THREE.Vector3(0, 0.5, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const baseCamera = createCamera(new THREE.Vector3(5, 1, 0), anchor);

    const keyframes = buildOrbitKeyframes({
      anchor,
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      shotSpec: createShotSpec(),
      startTime: 0,
    });

    const firstPosition = new THREE.Vector3(
      keyframes[0]!.position.x,
      keyframes[0]!.position.y,
      keyframes[0]!.position.z,
    );
    const forward = getForwardVector(keyframes[0]!.quaternion);
    const toAnchor = anchor.clone().sub(firstPosition).normalize();

    expect(keyframes).toHaveLength(8);
    expect(forward.dot(toAnchor)).toBeGreaterThan(0.999);
  });

  it('faces forward along the orbit tangent when requested', () => {
    const anchor = new THREE.Vector3(0, 0, 0);
    const bounds = new THREE.Box3(
      new THREE.Vector3(-4, -2, -4),
      new THREE.Vector3(4, 4, 4),
    );
    const baseCamera = createCamera(new THREE.Vector3(5, 1, 0), anchor);

    const keyframes = buildOrbitKeyframes({
      anchor,
      basePose: {
        fov: baseCamera.fov,
        position: baseCamera.position.clone(),
        quaternion: baseCamera.quaternion.clone(),
      },
      bounds,
      shotSpec: createShotSpec({ orientationMode: 'look-forward' }),
      startTime: 0,
    });

    const firstPosition = new THREE.Vector3(
      keyframes[0]!.position.x,
      keyframes[0]!.position.y,
      keyframes[0]!.position.z,
    );
    const secondPosition = new THREE.Vector3(
      keyframes[1]!.position.x,
      keyframes[1]!.position.y,
      keyframes[1]!.position.z,
    );
    const tangent = secondPosition.clone().sub(firstPosition).setY(0).normalize();
    const forward = getForwardVector(keyframes[0]!.quaternion).setY(0).normalize();

    expect(forward.dot(tangent)).toBeGreaterThan(0.98);
  });
});
