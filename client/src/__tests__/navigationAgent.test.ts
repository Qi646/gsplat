import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { applyRotation, computeLookAtQuaternion, computeOpacityCentroid, computeOrbitPose } from '../path/navigationAgent';

const Y_UP = new THREE.Vector3(0, 1, 0);
const Y_DOWN = new THREE.Vector3(0, -1, 0);

describe('computeOrbitPose', () => {
  const target = new THREE.Vector3(0, 0, 0);

  it('Y-up: elevation=30° places camera at positive Y offset', () => {
    const radius = 10;
    const { position } = computeOrbitPose(target, 0, 30, radius, Y_UP);
    expect(position.y).toBeGreaterThan(0);
    expect(position.y).toBeCloseTo(radius * Math.sin(THREE.MathUtils.degToRad(30)), 4);
  });

  it('Y-down: elevation=30° places camera at negative Y offset', () => {
    const radius = 10;
    const { position } = computeOrbitPose(target, 0, 30, radius, Y_DOWN);
    expect(position.y).toBeLessThan(0);
    expect(position.y).toBeCloseTo(-radius * Math.sin(THREE.MathUtils.degToRad(30)), 4);
  });

  it('Y-up: elevation=0° keeps camera at same Y as target', () => {
    const { position } = computeOrbitPose(target, 45, 0, 5, Y_UP);
    expect(position.y).toBeCloseTo(0, 4);
  });

  it('Y-down: elevation=0° keeps camera at same Y as target', () => {
    const { position } = computeOrbitPose(target, 45, 0, 5, Y_DOWN);
    expect(position.y).toBeCloseTo(0, 4);
  });

  it('default sceneUp is Y-up (backward compat)', () => {
    const radius = 10;
    const withDefault = computeOrbitPose(target, 90, 45, radius);
    const withYUp = computeOrbitPose(target, 90, 45, radius, Y_UP);
    expect(withDefault.position.x).toBeCloseTo(withYUp.position.x, 5);
    expect(withDefault.position.y).toBeCloseTo(withYUp.position.y, 5);
    expect(withDefault.position.z).toBeCloseTo(withYUp.position.z, 5);
  });

  it('camera is at correct distance from target', () => {
    const radius = 7;
    const { position } = computeOrbitPose(target, 30, 20, radius, Y_UP);
    expect(position.distanceTo(target)).toBeCloseTo(radius, 4);
  });
});

describe('computeLookAtQuaternion', () => {
  it('Y-up: camera looks toward -Z with up=(0,1,0)', () => {
    const eye = new THREE.Vector3(0, 0, 5);
    const target = new THREE.Vector3(0, 0, 0);
    const q = computeLookAtQuaternion(eye, target, Y_UP);

    // forward direction should be (0,0,-1) in camera space → world (0,0,-1)
    const worldForward = new THREE.Vector3(0, 0, -1).applyQuaternion(q);
    expect(worldForward.x).toBeCloseTo(0, 4);
    expect(worldForward.y).toBeCloseTo(0, 4);
    expect(worldForward.z).toBeCloseTo(-1, 4);
  });

  it('Y-down: rendered up is along (0,-1,0)', () => {
    const eye = new THREE.Vector3(0, 0, 5);
    const target = new THREE.Vector3(0, 0, 0);
    const q = computeLookAtQuaternion(eye, target, Y_DOWN);

    // Camera local up (0,1,0) transformed to world should point along sceneUp = (0,-1,0)
    const worldUp = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(worldUp.x).toBeCloseTo(0, 4);
    expect(worldUp.y).toBeCloseTo(-1, 4);
    expect(worldUp.z).toBeCloseTo(0, 4);
  });

  it('default sceneUp is Y-up (backward compat)', () => {
    const eye = new THREE.Vector3(1, 1, 1);
    const target = new THREE.Vector3(0, 0, 0);
    const withDefault = computeLookAtQuaternion(eye, target);
    const withYUp = computeLookAtQuaternion(eye, target, Y_UP);
    expect(withDefault.x).toBeCloseTo(withYUp.x, 5);
    expect(withDefault.y).toBeCloseTo(withYUp.y, 5);
    expect(withDefault.z).toBeCloseTo(withYUp.z, 5);
    expect(withDefault.w).toBeCloseTo(withYUp.w, 5);
  });
});

describe('applyRotation', () => {
  it('Y-up yaw=90° and Y-down yaw=90° produce mirrored rotations', () => {
    const makeIdentityPose = () => ({
      fov: 60,
      position: new THREE.Vector3(0, 0, 0),
      quaternion: new THREE.Quaternion(),
    });

    const poseUp = makeIdentityPose();
    applyRotation(poseUp, 90, 0, 0, Y_UP);

    const poseDown = makeIdentityPose();
    applyRotation(poseDown, 90, 0, 0, Y_DOWN);

    // With Y-up, yaw=90° rotates around +Y → camera now looks at -X in world
    const fwdUp = new THREE.Vector3(0, 0, -1).applyQuaternion(poseUp.quaternion);
    // With Y-down, yaw=90° rotates around -Y → camera now looks at +X in world (mirrored)
    const fwdDown = new THREE.Vector3(0, 0, -1).applyQuaternion(poseDown.quaternion);

    // Mirrored: x-components should be opposite
    expect(fwdUp.x).toBeCloseTo(-fwdDown.x, 4);
    expect(fwdUp.y).toBeCloseTo(fwdDown.y, 4);
  });

  it('pitch only uses local camera axis (not affected by sceneUp)', () => {
    const pose = {
      fov: 60,
      position: new THREE.Vector3(0, 0, 0),
      quaternion: new THREE.Quaternion(),
    };
    applyRotation(pose, 0, 30, 0, Y_UP);

    // Camera looks slightly down (positive pitch = look up in typical convention)
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(pose.quaternion);
    // y component should be non-zero (pitched)
    expect(Math.abs(fwd.y)).toBeGreaterThan(0.4);
  });

  it('default sceneUp is Y-up (backward compat)', () => {
    const makeIdentityPose = () => ({
      fov: 60,
      position: new THREE.Vector3(0, 0, 0),
      quaternion: new THREE.Quaternion(),
    });

    const poseDefault = makeIdentityPose();
    applyRotation(poseDefault, 45, 0, 0);

    const poseYUp = makeIdentityPose();
    applyRotation(poseYUp, 45, 0, 0, Y_UP);

    expect(poseDefault.quaternion.x).toBeCloseTo(poseYUp.quaternion.x, 5);
    expect(poseDefault.quaternion.y).toBeCloseTo(poseYUp.quaternion.y, 5);
    expect(poseDefault.quaternion.z).toBeCloseTo(poseYUp.quaternion.z, 5);
    expect(poseDefault.quaternion.w).toBeCloseTo(poseYUp.quaternion.w, 5);
  });
});

describe('computeOpacityCentroid', () => {
  it('returns null for empty input', () => {
    expect(computeOpacityCentroid([])).toBeNull();
  });

  it('returns null when all opacities are zero', () => {
    const points = [
      { opacity: 0, position: { x: 1, y: 2, z: 3 } },
      { opacity: 0, position: { x: 4, y: 5, z: 6 } },
    ];
    expect(computeOpacityCentroid(points)).toBeNull();
  });

  it('computes weighted centroid correctly', () => {
    const points = [
      { opacity: 1, position: { x: 0, y: 0, z: 0 } },
      { opacity: 3, position: { x: 4, y: 4, z: 4 } },
    ];
    const result = computeOpacityCentroid(points);
    expect(result).not.toBeNull();
    expect(result!.x).toBeCloseTo(3, 5);
    expect(result!.y).toBeCloseTo(3, 5);
    expect(result!.z).toBeCloseTo(3, 5);
  });

  it('single point returns that point', () => {
    const points = [{ opacity: 0.8, position: { x: 5, y: -2, z: 7 } }];
    const result = computeOpacityCentroid(points);
    expect(result).toEqual({ x: 5, y: -2, z: 7 });
  });
});
