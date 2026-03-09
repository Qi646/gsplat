import * as THREE from 'three';
import type { InterpolatedPose, Keyframe } from '../types';

function cloneKeyframe(keyframe: Keyframe): Keyframe {
  return {
    id: keyframe.id,
    time: keyframe.time,
    position: { ...keyframe.position },
    quaternion: { ...keyframe.quaternion },
    fov: keyframe.fov,
  };
}

export class PathInterpolator {
  private keyframes: Keyframe[] = [];
  private positionCurve: THREE.CatmullRomCurve3 | null = null;
  private totalDuration = 0;

  setKeyframes(keyframes: Keyframe[]): void {
    this.keyframes = keyframes.map(cloneKeyframe).sort((left, right) => left.time - right.time);
    this.rebuild();
  }

  getTotalDuration(): number {
    return this.totalDuration;
  }

  evaluate(timeSeconds: number): InterpolatedPose | null {
    const keyframes = this.keyframes;
    if (keyframes.length === 0) {
      return null;
    }

    if (keyframes.length === 1) {
      return {
        position: new THREE.Vector3(
          keyframes[0].position.x,
          keyframes[0].position.y,
          keyframes[0].position.z
        ),
        quaternion: new THREE.Quaternion(
          keyframes[0].quaternion.x,
          keyframes[0].quaternion.y,
          keyframes[0].quaternion.z,
          keyframes[0].quaternion.w
        ),
        fov: keyframes[0].fov,
      };
    }

    const clampedTime = THREE.MathUtils.clamp(timeSeconds, 0, this.totalDuration);
    const segmentIndex = this.findSegmentIndex(clampedTime);
    const startKeyframe = keyframes[segmentIndex];
    const endKeyframe = keyframes[Math.min(segmentIndex + 1, keyframes.length - 1)];
    const segmentDuration = endKeyframe.time - startKeyframe.time;
    const rawLocalT = segmentDuration > 0 ? (clampedTime - startKeyframe.time) / segmentDuration : 1;
    const localT = this.smoothstep(rawLocalT);

    const position = this.positionCurve
      ? this.positionCurve.getPoint(this.totalDuration > 0 ? clampedTime / this.totalDuration : 0)
      : new THREE.Vector3(
          THREE.MathUtils.lerp(startKeyframe.position.x, endKeyframe.position.x, localT),
          THREE.MathUtils.lerp(startKeyframe.position.y, endKeyframe.position.y, localT),
          THREE.MathUtils.lerp(startKeyframe.position.z, endKeyframe.position.z, localT)
        );

    const startQuaternion = new THREE.Quaternion(
      startKeyframe.quaternion.x,
      startKeyframe.quaternion.y,
      startKeyframe.quaternion.z,
      startKeyframe.quaternion.w
    );
    const endQuaternion = new THREE.Quaternion(
      endKeyframe.quaternion.x,
      endKeyframe.quaternion.y,
      endKeyframe.quaternion.z,
      endKeyframe.quaternion.w
    );

    if (startQuaternion.dot(endQuaternion) < 0) {
      endQuaternion.set(
        -endQuaternion.x,
        -endQuaternion.y,
        -endQuaternion.z,
        -endQuaternion.w
      );
    }

    return {
      position,
      quaternion: startQuaternion.slerp(endQuaternion, localT),
      fov: THREE.MathUtils.lerp(startKeyframe.fov, endKeyframe.fov, localT),
    };
  }

  private rebuild(): void {
    if (this.keyframes.length < 2) {
      this.positionCurve = null;
      this.totalDuration = this.keyframes[0]?.time ?? 0;
      return;
    }

    const points = this.keyframes.map(keyframe => new THREE.Vector3(
      keyframe.position.x,
      keyframe.position.y,
      keyframe.position.z
    ));

    this.positionCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    this.totalDuration = this.keyframes.at(-1)?.time ?? 0;
  }

  private findSegmentIndex(timeSeconds: number): number {
    for (let index = 0; index < this.keyframes.length - 1; index += 1) {
      if (this.keyframes[index].time <= timeSeconds && timeSeconds <= this.keyframes[index + 1].time) {
        return index;
      }
    }

    return Math.max(this.keyframes.length - 2, 0);
  }

  private smoothstep(value: number): number {
    const clampedValue = THREE.MathUtils.clamp(value, 0, 1);
    return clampedValue * clampedValue * (3 - 2 * clampedValue);
  }
}
