import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { AppEvents, type InterpolatedPose } from '../types';
import { KeyframeManager, type CameraPathViewer } from '../path/KeyframeManager';

class FakeViewer implements CameraPathViewer {
  readonly camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  readonly appliedPoses: InterpolatedPose[] = [];

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  applyCameraPose(pose: InterpolatedPose): void {
    this.camera.position.copy(pose.position);
    this.camera.quaternion.copy(pose.quaternion);
    this.camera.fov = pose.fov;
    this.camera.updateProjectionMatrix();
    this.appliedPoses.push({
      position: pose.position.clone(),
      quaternion: pose.quaternion.clone(),
      fov: pose.fov,
    });
  }
}

function setCameraPose(
  camera: THREE.PerspectiveCamera,
  position: THREE.Vector3,
  quaternion = new THREE.Quaternion(),
  fov = 60
): void {
  camera.position.copy(position);
  camera.quaternion.copy(quaternion);
  camera.fov = fov;
  camera.updateProjectionMatrix();
}

describe('KeyframeManager', () => {
  it('captures the current camera pose with default spacing', () => {
    const viewer = new FakeViewer();
    const manager = new KeyframeManager({ viewer, events: new AppEvents() });

    setCameraPose(viewer.camera, new THREE.Vector3(1, 2, 3), new THREE.Quaternion(0, 0, 0, 1), 55);
    manager.addKeyframe();

    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0.4, 0));
    setCameraPose(viewer.camera, new THREE.Vector3(4, 5, 6), rotation, 40);
    manager.addKeyframe();

    const keyframes = manager.getKeyframes();
    expect(keyframes).toHaveLength(2);
    expect(keyframes[0].time).toBe(0);
    expect(keyframes[1].time).toBe(3);
    expect(keyframes[0].position).toEqual({ x: 1, y: 2, z: 3 });
    expect(keyframes[1].position).toEqual({ x: 4, y: 5, z: 6 });
    expect(keyframes[1].fov).toBe(40);
  });

  it('reorders keyframes and redistributes time across the existing duration', () => {
    const viewer = new FakeViewer();
    const manager = new KeyframeManager({ viewer, events: new AppEvents() });

    setCameraPose(viewer.camera, new THREE.Vector3(0, 0, 0));
    const first = manager.addKeyframe();
    setCameraPose(viewer.camera, new THREE.Vector3(1, 0, 0));
    const second = manager.addKeyframe();
    setCameraPose(viewer.camera, new THREE.Vector3(2, 0, 0));
    const third = manager.addKeyframe();

    expect(manager.getTotalDuration()).toBe(6);
    expect(manager.moveKeyframe(third?.id ?? '', -1)).toBe(true);

    const keyframes = manager.getKeyframes();
    expect(keyframes.map(keyframe => keyframe.id)).toEqual([first?.id, third?.id, second?.id]);
    expect(keyframes.map(keyframe => keyframe.time)).toEqual([0, 3, 6]);
  });

  it('round-trips path JSON content', () => {
    const viewer = new FakeViewer();
    const manager = new KeyframeManager({ viewer, events: new AppEvents() });

    setCameraPose(viewer.camera, new THREE.Vector3(-1, 1, 2), new THREE.Quaternion(), 50);
    manager.addKeyframe();

    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.3, 0));
    setCameraPose(viewer.camera, new THREE.Vector3(3, 4, 5), rotation, 65);
    manager.addKeyframe();

    const savedPath = manager.toJSON();

    const restoredManager = new KeyframeManager({ viewer: new FakeViewer(), events: new AppEvents() });
    const restoredPath = restoredManager.fromJSON(savedPath);

    expect(restoredPath).toEqual(savedPath);
    expect(restoredManager.getKeyframes()).toEqual(manager.getKeyframes());
    expect(restoredManager.getTotalDuration()).toBe(manager.getTotalDuration());
  });

  it('rejects invalid imported JSON', () => {
    const manager = new KeyframeManager({ viewer: new FakeViewer(), events: new AppEvents() });

    expect(() =>
      manager.fromJSON({
        version: 1,
        keyframes: [
          {
            id: 'broken',
            time: 0,
            position: { x: 0, y: 'nope', z: 0 },
            quaternion: { x: 0, y: 0, z: 0, w: 1 },
            fov: 60,
          },
        ],
      })
    ).toThrow(/Invalid camera path file/);
  });
});
