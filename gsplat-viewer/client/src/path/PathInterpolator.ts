/**
 * PathInterpolator.ts
 * Interpolates camera pose between keyframes using:
 *   - THREE.CatmullRomCurve3 for position
 *   - Sequential quaternion slerp for rotation
 *   - Smoothstep easing per segment
 *   - FOV lerp
 */

import * as THREE from 'three';
import type { Keyframe, InterpolatedPose } from '../types';

export class PathInterpolator {
  private keyframes: Keyframe[] = [];
  private positionCurve: THREE.CatmullRomCurve3 | null = null;
  private totalDuration = 0;

  setKeyframes(keyframes: Keyframe[]): void {
    this.keyframes = [...keyframes].sort((a, b) => a.time - b.time);
    this.rebuild();
  }

  private rebuild(): void {
    if (this.keyframes.length < 2) {
      this.positionCurve = null;
      this.totalDuration = this.keyframes[0]?.time ?? 0;
      return;
    }

    const points = this.keyframes.map(kf =>
      new THREE.Vector3(kf.position.x, kf.position.y, kf.position.z)
    );

    this.positionCurve = new THREE.CatmullRomCurve3(
      points,
      false,      // not closed
      'catmullrom',
      0.5         // tension
    );

    this.totalDuration = this.keyframes[this.keyframes.length - 1].time;
  }

  getTotalDuration(): number {
    return this.totalDuration;
  }

  getKeyframeCount(): number {
    return this.keyframes.length;
  }

  /**
   * Evaluate the path at time t (seconds).
   * Returns null if < 2 keyframes.
   */
  evaluate(t: number): InterpolatedPose | null {
    const kfs = this.keyframes;
    if (kfs.length === 0) return null;
    if (kfs.length === 1) {
      return {
        position: new THREE.Vector3(kfs[0].position.x, kfs[0].position.y, kfs[0].position.z),
        quaternion: new THREE.Quaternion(kfs[0].quaternion.x, kfs[0].quaternion.y, kfs[0].quaternion.z, kfs[0].quaternion.w),
        fov: kfs[0].fov,
      };
    }

    // Clamp t to [0, totalDuration]
    t = Math.max(0, Math.min(t, this.totalDuration));

    // Find surrounding keyframes
    let i0 = 0;
    for (let i = 0; i < kfs.length - 1; i++) {
      if (kfs[i].time <= t && t <= kfs[i + 1].time) {
        i0 = i;
        break;
      }
    }
    const i1 = Math.min(i0 + 1, kfs.length - 1);

    const kf0 = kfs[i0];
    const kf1 = kfs[i1];

    // Local t within this segment [0, 1]
    const segDuration = kf1.time - kf0.time;
    let localT = segDuration > 0 ? (t - kf0.time) / segDuration : 1.0;

    // Apply smoothstep easing
    localT = this.smoothstep(localT);

    // Position: evaluate CatmullRom curve at global normalized t
    let position: THREE.Vector3;
    if (this.positionCurve) {
      const globalT = this.totalDuration > 0 ? t / this.totalDuration : 0;
      position = this.positionCurve.getPoint(globalT);
    } else {
      position = new THREE.Vector3(
        THREE.MathUtils.lerp(kf0.position.x, kf1.position.x, localT),
        THREE.MathUtils.lerp(kf0.position.y, kf1.position.y, localT),
        THREE.MathUtils.lerp(kf0.position.z, kf1.position.z, localT),
      );
    }

    // Rotation: quaternion slerp between adjacent keyframes
    const q0 = new THREE.Quaternion(kf0.quaternion.x, kf0.quaternion.y, kf0.quaternion.z, kf0.quaternion.w);
    const q1 = new THREE.Quaternion(kf1.quaternion.x, kf1.quaternion.y, kf1.quaternion.z, kf1.quaternion.w);

    // Ensure shortest arc
    if (q0.dot(q1) < 0) q1.negate();

    const quaternion = q0.clone().slerp(q1, localT);

    // FOV: linear lerp
    const fov = THREE.MathUtils.lerp(kf0.fov, kf1.fov, localT);

    return { position, quaternion, fov };
  }

  /** Smoothstep: S-curve ease-in/ease-out */
  private smoothstep(t: number): number {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }

  /** Smoother step (Ken Perlin's) for extra smoothness */
  private smootherstep(t: number): number {
    t = Math.max(0, Math.min(1, t));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Get evenly spaced points along path for visualization (e.g. path gizmo).
   */
  getPathPoints(numPoints = 100): THREE.Vector3[] {
    if (!this.positionCurve) return [];
    return this.positionCurve.getPoints(numPoints);
  }
}
