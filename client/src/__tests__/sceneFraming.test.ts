import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { computeFramedSceneView } from '../viewer/sceneFraming';

describe('computeFramedSceneView', () => {
  it('returns the same pose for the same bounds and camera parameters', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(1, 1, 1),
    );
    const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);

    const firstView = computeFramedSceneView(bounds, camera);
    const secondView = computeFramedSceneView(bounds, camera);

    expect(firstView?.position.toArray()).toEqual(secondView?.position.toArray());
    expect(firstView?.target.toArray()).toEqual(secondView?.target.toArray());
    expect(firstView?.up.toArray()).toEqual([0, 1, 0]);
  });

  it('fits a compact scene entirely inside the frustum', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(1, 1, 1),
    );
    const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);

    const framedView = computeFramedSceneView(bounds, camera);

    expect(framedView).not.toBeNull();
    expectBoundsToFitFrustum(bounds, camera, framedView!);
  });

  it('moves farther back for elongated scenes that are wide in camera space', () => {
    const compactBounds = new THREE.Box3(
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(1, 1, 1),
    );
    const elongatedBounds = new THREE.Box3(
      new THREE.Vector3(-12, -1, -1),
      new THREE.Vector3(12, 1, 1),
    );
    const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);

    const compactView = computeFramedSceneView(compactBounds, camera);
    const elongatedView = computeFramedSceneView(elongatedBounds, camera);

    expect(compactView).not.toBeNull();
    expect(elongatedView).not.toBeNull();
    expect(elongatedView!.position.distanceTo(elongatedView!.target)).toBeGreaterThan(
      compactView!.position.distanceTo(compactView!.target),
    );
    expectBoundsToFitFrustum(elongatedBounds, camera, elongatedView!);
  });

  it('responds to aspect ratio when fitting the same bounds', () => {
    const bounds = new THREE.Box3(
      new THREE.Vector3(-8, -2, -2),
      new THREE.Vector3(8, 2, 2),
    );
    const wideCamera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);
    const narrowCamera = new THREE.PerspectiveCamera(60, 9 / 16, 0.1, 1000);

    const wideView = computeFramedSceneView(bounds, wideCamera);
    const narrowView = computeFramedSceneView(bounds, narrowCamera);

    expect(wideView).not.toBeNull();
    expect(narrowView).not.toBeNull();
    expect(narrowView!.position.distanceTo(narrowView!.target)).toBeGreaterThan(
      wideView!.position.distanceTo(wideView!.target),
    );
    expectBoundsToFitFrustum(bounds, wideCamera, wideView!);
    expectBoundsToFitFrustum(bounds, narrowCamera, narrowView!);
  });
});

function expectBoundsToFitFrustum(
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
  framedView: NonNullable<ReturnType<typeof computeFramedSceneView>>,
): void {
  const framingCamera = camera.clone();
  framingCamera.position.copy(framedView.position);
  framingCamera.up.copy(framedView.up);
  framingCamera.near = 0.001;
  framingCamera.far = 10_000;
  framingCamera.lookAt(framedView.target);
  framingCamera.updateProjectionMatrix();
  framingCamera.updateMatrixWorld(true);

  for (const corner of getBoxCorners(bounds)) {
    const projected = corner.clone().project(framingCamera);
    expect(projected.x).toBeGreaterThanOrEqual(-1);
    expect(projected.x).toBeLessThanOrEqual(1);
    expect(projected.y).toBeGreaterThanOrEqual(-1);
    expect(projected.y).toBeLessThanOrEqual(1);
  }
}

function getBoxCorners(bounds: THREE.Box3): THREE.Vector3[] {
  const { min, max } = bounds;

  return [
    new THREE.Vector3(min.x, min.y, min.z),
    new THREE.Vector3(min.x, min.y, max.z),
    new THREE.Vector3(min.x, max.y, min.z),
    new THREE.Vector3(min.x, max.y, max.z),
    new THREE.Vector3(max.x, min.y, min.z),
    new THREE.Vector3(max.x, min.y, max.z),
    new THREE.Vector3(max.x, max.y, min.z),
    new THREE.Vector3(max.x, max.y, max.z),
  ];
}
