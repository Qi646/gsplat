import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import type { Keyframe } from '../types';
import {
  buildKeyframeFrustumWorldPoints,
  getOverlayFrustumDepth,
  projectKeyframeVisuals,
  projectPathToViewport,
  projectWorldPointToViewport,
  sampleCameraPathPositions,
} from '../path/cameraPathVisuals';

function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
  camera.position.set(0, 0, 0);
  camera.lookAt(new THREE.Vector3(0, 0, -1));
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  return camera;
}

function createKeyframe(overrides: Partial<Keyframe> = {}): Keyframe {
  return {
    fov: 60,
    id: 'kf-1',
    position: { x: 0, y: 0, z: -3 },
    quaternion: { x: 0, y: 0, z: 0, w: 1 },
    time: 0,
    ...overrides,
  };
}

describe('sampleCameraPathPositions', () => {
  it('returns empty or single-point paths for trivial keyframe counts', () => {
    expect(sampleCameraPathPositions([])).toEqual([]);

    const singlePointPath = sampleCameraPathPositions([createKeyframe()]);
    expect(singlePointPath).toHaveLength(1);
    expect(singlePointPath[0]?.toArray()).toEqual([0, 0, -3]);
  });

  it('samples a multi-keyframe path including the exact endpoints', () => {
    const positions = sampleCameraPathPositions([
      createKeyframe({
        id: 'kf-1',
        position: { x: 0, y: 0, z: -3 },
        time: 0,
      }),
      createKeyframe({
        id: 'kf-2',
        position: { x: 3, y: 1, z: -5 },
        time: 2,
      }),
    ], 4);

    expect(positions).toHaveLength(5);
    expect(positions[0]?.toArray()).toEqual([0, 0, -3]);
    expect(positions.at(-1)?.toArray()).toEqual([3, 1, -5]);
  });
});

describe('buildKeyframeFrustumWorldPoints', () => {
  it('derives world-space wedge corners from pose, fov, aspect, and depth', () => {
    const frustum = buildKeyframeFrustumWorldPoints(
      createKeyframe({
        fov: 90,
        position: { x: 1, y: 2, z: 3 },
      }),
      2,
      1,
    );

    expect(frustum.origin.toArray()).toEqual([1, 2, 3]);
    expect(frustum.corners[0]?.toArray()).toEqual(expect.arrayContaining([
      expect.closeTo(-1, 6),
      expect.closeTo(3, 6),
      expect.closeTo(2, 6),
    ]));
    expect(frustum.corners[1]?.toArray()).toEqual(expect.arrayContaining([
      expect.closeTo(3, 6),
      expect.closeTo(3, 6),
      expect.closeTo(2, 6),
    ]));
    expect(frustum.corners[2]?.toArray()).toEqual(expect.arrayContaining([
      expect.closeTo(3, 6),
      expect.closeTo(1, 6),
      expect.closeTo(2, 6),
    ]));
    expect(frustum.corners[3]?.toArray()).toEqual(expect.arrayContaining([
      expect.closeTo(-1, 6),
      expect.closeTo(1, 6),
      expect.closeTo(2, 6),
    ]));
  });
});

describe('getOverlayFrustumDepth', () => {
  it('scales from scene bounds and falls back cleanly when bounds are unavailable', () => {
    const sceneBounds = new THREE.Box3(
      new THREE.Vector3(-5, -5, -5),
      new THREE.Vector3(5, 5, 5),
    );

    expect(getOverlayFrustumDepth(sceneBounds, [])).toBeCloseTo(Math.max(Math.sqrt(75) * 0.12, 0.35));
    expect(getOverlayFrustumDepth(null, [])).toBe(1);
  });
});

describe('projectWorldPointToViewport', () => {
  it('projects finite front-facing points and rejects behind-camera or invalid points', () => {
    const camera = createCamera();
    const viewport = { height: 200, width: 400 };

    expect(projectWorldPointToViewport(new THREE.Vector3(0, 0, -3), camera, viewport)).toEqual({
      x: 200,
      y: 100,
    });
    expect(projectWorldPointToViewport(new THREE.Vector3(0, 0, 1), camera, viewport)).toBeNull();
    expect(projectWorldPointToViewport(new THREE.Vector3(Number.NaN, 0, -3), camera, viewport)).toBeNull();
  });
});

describe('projectPathToViewport', () => {
  it('splits visible path segments when the path moves behind the camera', () => {
    const camera = createCamera();
    const viewport = { height: 200, width: 400 };
    const segments = projectPathToViewport([
      new THREE.Vector3(-0.5, 0, -3),
      new THREE.Vector3(0.5, 0, -3),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(-0.5, 0, -4),
      new THREE.Vector3(-1, 0, -4),
    ], camera, viewport);

    expect(segments).toHaveLength(2);
    expect(segments[0]?.points).toHaveLength(2);
    expect(segments[1]?.points).toHaveLength(2);
  });
});

describe('projectKeyframeVisuals', () => {
  it('projects keyframe markers and frusta with selection state', () => {
    const camera = createCamera();
    const viewport = { height: 200, width: 400 };
    const keyframes = [
      createKeyframe({
        id: 'kf-1',
        position: { x: 0, y: 0, z: -3 },
      }),
      createKeyframe({
        id: 'kf-2',
        position: { x: 1, y: 0.5, z: -4 },
        time: 1,
      }),
    ];

    const projections = projectKeyframeVisuals(keyframes, camera, viewport, null, 'kf-2');
    expect(projections).toHaveLength(2);
    expect(projections[0]).toMatchObject({
      id: 'kf-1',
      label: 'KF 01',
      selected: false,
    });
    expect(projections[1]).toMatchObject({
      id: 'kf-2',
      label: 'KF 02',
      selected: true,
    });
    expect(projections[1]?.frustum).not.toBeNull();
  });
});
