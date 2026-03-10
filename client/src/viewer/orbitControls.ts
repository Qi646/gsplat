import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

export type NavigationMode = 'orbit' | 'walk';
export type ViewerCameraControls = TrackballControls;

const DEFAULT_CAMERA_UP = new THREE.Vector3(0, 1, 0);

export function createViewerOrbitControls(
  camera: THREE.PerspectiveCamera,
  domElement: HTMLCanvasElement,
): ViewerCameraControls {
  const controls = new TrackballControls(camera, domElement);
  controls.dynamicDampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.handleResize();
  controls.update();
  return controls;
}

export function setOrbitControlsNavigationMode(
  controls: ViewerCameraControls | null,
  mode: NavigationMode,
): void {
  if (!controls) {
    return;
  }

  controls.enabled = mode === 'orbit';
  if (mode === 'orbit') {
    controls.update();
  }
}

export function resumeOrbitControlsFromCamera(
  camera: THREE.PerspectiveCamera,
  controls: ViewerCameraControls | null,
  distance?: number,
): void {
  if (!controls) {
    return;
  }

  syncOrbitControlsTargetFromCamera(camera, controls, distance);
  controls.enabled = true;
  controls.update();
}

export function updateOrbitControls(
  controls: ViewerCameraControls | null,
  mode: NavigationMode,
): void {
  if (!controls || mode !== 'orbit') {
    return;
  }

  controls.update();
}

export function rollOrbitCamera(
  camera: THREE.PerspectiveCamera | null,
  radians: number,
): boolean {
  if (!camera || !Number.isFinite(radians) || Math.abs(radians) <= Number.EPSILON) {
    return false;
  }

  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  if (forward.lengthSq() <= Number.EPSILON) {
    return false;
  }

  forward.normalize();
  camera.up.applyAxisAngle(forward, radians).normalize();
  camera.lookAt(new THREE.Vector3().copy(camera.position).add(forward));
  return true;
}

export function syncOrbitControlsTargetFromCamera(
  camera: THREE.PerspectiveCamera,
  controls: ViewerCameraControls | null,
  distance?: number,
): void {
  if (!controls) {
    return;
  }

  const currentDistance = controls.target.distanceTo(camera.position);
  const fallbackDistance = currentDistance > 0 ? currentDistance : 1;
  const targetDistance = typeof distance === 'number' && distance > 0 ? distance : fallbackDistance;
  const lookDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
  camera.up.copy(DEFAULT_CAMERA_UP).applyQuaternion(camera.quaternion).normalize();
  controls.target.copy(camera.position).addScaledVector(lookDirection, targetDistance);
}

export function resizeViewerOrbitControls(
  controls: ViewerCameraControls | null,
): void {
  controls?.handleResize();
}
