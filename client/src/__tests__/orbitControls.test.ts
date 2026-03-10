import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { rollOrbitCamera } from '../viewer/orbitControls';

describe('rollOrbitCamera', () => {
  it('rolls around the current view axis without moving the camera', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(1, 2, 3);
    camera.up.set(0, -1, 0);
    camera.lookAt(new THREE.Vector3(6, 2, 3));

    const beforePosition = camera.position.clone();
    const beforeForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    const beforeUp = camera.up.clone();
    const radians = Math.PI / 18;
    const expectedUp = beforeUp.clone().applyAxisAngle(beforeForward, radians).normalize();

    const didRoll = rollOrbitCamera(camera, radians);

    const afterForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    expect(didRoll).toBe(true);
    expect(camera.position.toArray()).toEqual(beforePosition.toArray());
    expect(afterForward.dot(beforeForward)).toBeCloseTo(1, 6);
    expect(camera.up.x).toBeCloseTo(expectedUp.x, 6);
    expect(camera.up.y).toBeCloseTo(expectedUp.y, 6);
    expect(camera.up.z).toBeCloseTo(expectedUp.z, 6);
  });

  it('ignores invalid or zero roll steps', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const beforeQuaternion = camera.quaternion.clone();

    expect(rollOrbitCamera(camera, 0)).toBe(false);
    expect(rollOrbitCamera(null, Math.PI / 8)).toBe(false);
    expect(camera.quaternion.toArray()).toEqual(beforeQuaternion.toArray());
  });
});
