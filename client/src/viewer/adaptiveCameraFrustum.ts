import * as THREE from 'three';

export interface CameraFrustumPlanes {
  near: number;
  far: number;
}

const MIN_CAMERA_NEAR = 0.01;
const MAX_CAMERA_NEAR = 0.1;
const NEAR_SURFACE_FACTOR = 0.25;
const MIN_SURFACE_DISTANCE_FACTOR = 0.01;
const FAR_RADIUS_FACTOR = 2.5;
const MIN_FAR_SPAN = 10;

export function computeAdaptiveCameraFrustum(
  camera: THREE.PerspectiveCamera,
  sceneBounds: THREE.Box3,
): CameraFrustumPlanes | null {
  if (sceneBounds.isEmpty() || !isFiniteBox(sceneBounds)) {
    return null;
  }

  const sphere = sceneBounds.getBoundingSphere(new THREE.Sphere());
  if (!Number.isFinite(sphere.radius) || sphere.radius < 0 || !isFiniteVector(sphere.center)) {
    return null;
  }

  const distanceToCenter = camera.position.distanceTo(sphere.center);
  const distanceToSurface = Math.max(
    distanceToCenter - sphere.radius,
    sphere.radius * MIN_SURFACE_DISTANCE_FACTOR,
  );
  const near = THREE.MathUtils.clamp(
    distanceToSurface * NEAR_SURFACE_FACTOR,
    MIN_CAMERA_NEAR,
    MAX_CAMERA_NEAR,
  );
  const far = Math.max(distanceToCenter + sphere.radius * FAR_RADIUS_FACTOR, near + MIN_FAR_SPAN);

  if (![near, far].every(Number.isFinite) || far <= near) {
    return null;
  }

  return { near, far };
}

export function applyAdaptiveCameraFrustum(
  camera: THREE.PerspectiveCamera,
  sceneBounds: THREE.Box3,
  epsilon = 1e-4,
): boolean {
  const next = computeAdaptiveCameraFrustum(camera, sceneBounds);
  if (!next) {
    return false;
  }

  if (Math.abs(camera.near - next.near) <= epsilon && Math.abs(camera.far - next.far) <= epsilon) {
    return false;
  }

  camera.near = next.near;
  camera.far = next.far;
  return true;
}

function isFiniteBox(box: THREE.Box3): boolean {
  return [box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite);
}

function isFiniteVector(vector: THREE.Vector3): boolean {
  return [vector.x, vector.y, vector.z].every(Number.isFinite);
}
