import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { createClientId } from '../lib/createClientId';
import type { Keyframe } from '../types';
import { PathInterpolator } from '../path/PathInterpolator';

function makeKeyframe(overrides: Partial<Keyframe>): Keyframe {
  return {
    id: overrides.id ?? createClientId('test-keyframe'),
    time: overrides.time ?? 0,
    position: overrides.position ?? { x: 0, y: 0, z: 0 },
    quaternion: overrides.quaternion ?? { x: 0, y: 0, z: 0, w: 1 },
    fov: overrides.fov ?? 60,
  };
}

describe('PathInterpolator', () => {
  it('returns null with no keyframes and the single pose with one keyframe', () => {
    const interpolator = new PathInterpolator();

    expect(interpolator.evaluate(0)).toBeNull();

    interpolator.setKeyframes([
      makeKeyframe({
        time: 2,
        position: { x: 1, y: 2, z: 3 },
        quaternion: { x: 0, y: 0.5, z: 0, w: 0.5 },
        fov: 42,
      }),
    ]);

    const pose = interpolator.evaluate(999);
    expect(pose?.position.toArray()).toEqual([1, 2, 3]);
    expect(pose?.quaternion.toArray()).toEqual([0, 0.5, 0, 0.5]);
    expect(pose?.fov).toBe(42);
  });

  it('sorts keyframes and clamps evaluation to the path endpoints', () => {
    const interpolator = new PathInterpolator();
    interpolator.setKeyframes([
      makeKeyframe({ id: 'late', time: 10, position: { x: 10, y: 0, z: 0 } }),
      makeKeyframe({ id: 'early', time: 0, position: { x: 0, y: 0, z: 0 } }),
    ]);

    expect(interpolator.getTotalDuration()).toBe(10);
    expect(interpolator.evaluate(-5)?.position.x).toBeCloseTo(0, 6);
    expect(interpolator.evaluate(25)?.position.x).toBeCloseTo(10, 6);
  });

  it('uses shortest-arc quaternion interpolation', () => {
    const interpolator = new PathInterpolator();
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25, -0.5, 0.1));

    interpolator.setKeyframes([
      makeKeyframe({
        time: 0,
        quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
      }),
      makeKeyframe({
        time: 4,
        quaternion: { x: -quaternion.x, y: -quaternion.y, z: -quaternion.z, w: -quaternion.w },
      }),
    ]);

    const pose = interpolator.evaluate(2);
    expect(Math.abs((pose?.quaternion ?? new THREE.Quaternion()).dot(quaternion))).toBeCloseTo(1, 6);
  });

  it('applies smoothstep timing to fov interpolation', () => {
    const interpolator = new PathInterpolator();
    interpolator.setKeyframes([
      makeKeyframe({ time: 0, fov: 50 }),
      makeKeyframe({ time: 10, fov: 70 }),
    ]);

    const pose = interpolator.evaluate(2.5);
    expect(pose?.fov).toBeCloseTo(53.125, 6);
  });
});
