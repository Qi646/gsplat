import * as THREE from 'three';

const DEFAULT_FRAME_DIRECTION = new THREE.Vector3(0, 0.3, 1).normalize();
const DEFAULT_FRAME_UP = new THREE.Vector3(0, 1, 0);
const DEFAULT_FRAME_PADDING = 1.1;

export interface FramedSceneView {
  position: THREE.Vector3;
  target: THREE.Vector3;
  up: THREE.Vector3;
}

export function computeFramedSceneView(
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
  padding = DEFAULT_FRAME_PADDING,
): FramedSceneView | null {
  if (bounds.isEmpty()) {
    return null;
  }

  const target = bounds.getCenter(new THREE.Vector3());
  const corners = getBoxCorners(bounds);
  if (corners.length === 0) {
    return null;
  }

  const aspect = Math.max(camera.aspect, 1e-6);
  const verticalFovRadians = THREE.MathUtils.degToRad(camera.fov);
  const tanHalfVerticalFov = Math.tan(verticalFovRadians / 2);
  const tanHalfHorizontalFov = tanHalfVerticalFov * aspect;
  if (!(tanHalfVerticalFov > 0) || !(tanHalfHorizontalFov > 0)) {
    return null;
  }

  const viewDirection = DEFAULT_FRAME_DIRECTION.clone();
  const right = new THREE.Vector3().crossVectors(DEFAULT_FRAME_UP, viewDirection);
  if (right.lengthSq() === 0) {
    return null;
  }
  right.normalize();

  const up = new THREE.Vector3().crossVectors(viewDirection, right).normalize();

  let requiredDistance = 0;
  const relativeCorner = new THREE.Vector3();
  for (const corner of corners) {
    relativeCorner.copy(corner).sub(target);

    const horizontalOffset = relativeCorner.dot(right);
    const verticalOffset = relativeCorner.dot(up);
    const depthOffset = relativeCorner.dot(viewDirection);

    requiredDistance = Math.max(
      requiredDistance,
      depthOffset + Math.abs(horizontalOffset) / tanHalfHorizontalFov,
      depthOffset + Math.abs(verticalOffset) / tanHalfVerticalFov,
    );
  }

  const distance = Math.max(requiredDistance * padding, 1e-3);

  return {
    position: target.clone().addScaledVector(viewDirection, distance),
    target,
    up: DEFAULT_FRAME_UP.clone(),
  };
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
