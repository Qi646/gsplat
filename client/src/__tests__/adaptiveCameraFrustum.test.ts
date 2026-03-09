import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  applyAdaptiveCameraFrustum,
  computeAdaptiveCameraFrustum,
} from '../viewer/adaptiveCameraFrustum';

function createBounds(): THREE.Box3 {
  return new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
}

describe('computeAdaptiveCameraFrustum', () => {
  it('keeps the near plane capped when the camera is well outside the scene', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const planes = computeAdaptiveCameraFrustum(camera, createBounds());

    expect(planes).toMatchObject({
      near: 0.1,
    });
    expect(planes?.far).toBeCloseTo(24.3301270189, 6);
  });

  it('reduces the near plane when the camera is close to the scene surface', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, 1.9320508076);

    const planes = computeAdaptiveCameraFrustum(camera, createBounds());

    expect(planes?.near).toBeCloseTo(0.05, 6);
    expect(planes?.far).toBeCloseTo(10.05, 6);
  });

  it('stays finite and valid even when the camera is inside the scene sphere', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const planes = computeAdaptiveCameraFrustum(camera, createBounds());

    expect(planes?.near).toBeCloseTo(0.01, 6);
    expect(planes?.far).toBeCloseTo(10.01, 6);
  });
});

describe('applyAdaptiveCameraFrustum', () => {
  it('updates the camera planes only when they change', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, 20);
    const bounds = createBounds();

    expect(applyAdaptiveCameraFrustum(camera, bounds)).toBe(true);
    expect(applyAdaptiveCameraFrustum(camera, bounds)).toBe(false);
  });
});
