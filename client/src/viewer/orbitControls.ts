import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type NavigationMode = 'orbit' | 'walk';

export function createViewerOrbitControls(
  camera: THREE.PerspectiveCamera,
  domElement: HTMLCanvasElement,
): OrbitControls {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.target.set(0, 0, 0);
  controls.update();
  return controls;
}

export function setOrbitControlsNavigationMode(
  controls: OrbitControls | null,
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
  controls: OrbitControls | null,
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
  controls: OrbitControls | null,
  mode: NavigationMode,
): void {
  if (!controls || mode !== 'orbit') {
    return;
  }

  controls.update();
}

export function syncOrbitControlsTargetFromCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls | null,
  distance?: number,
): void {
  if (!controls) {
    return;
  }

  const currentDistance = controls.target.distanceTo(camera.position);
  const targetDistance = distance ?? (currentDistance > 0 ? currentDistance : 1);
  const lookDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  controls.target.copy(camera.position).addScaledVector(lookDirection, targetDistance);
}
