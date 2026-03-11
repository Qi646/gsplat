import * as THREE from 'three';
import type { InterpolatedPose, Keyframe } from '../types';
import { PathInterpolator } from './PathInterpolator';

export interface PathPreviewPlayerViewer {
  applyCameraPose(pose: InterpolatedPose): void;
}

export interface PathPreviewPlayerOptions {
  onSeek?: (time: number, duration: number) => void;
  onStart?: () => void;
  onStop?: () => void;
  viewer: PathPreviewPlayerViewer;
}

function cloneKeyframe(keyframe: Keyframe): Keyframe {
  return {
    id: keyframe.id,
    time: keyframe.time,
    position: { ...keyframe.position },
    quaternion: { ...keyframe.quaternion },
    fov: keyframe.fov,
  };
}

export class PathPreviewPlayer {
  private readonly interpolator = new PathInterpolator();
  private readonly onSeek?: (time: number, duration: number) => void;
  private readonly onStart?: () => void;
  private readonly onStop?: () => void;
  private readonly viewer: PathPreviewPlayerViewer;
  private currentTime = 0;
  private endTime = 0;
  private previewActive = false;
  private previewAnimationFrameId: number | null = null;
  private previewStartedAt = 0;
  private startTime = 0;

  constructor(options: PathPreviewPlayerOptions) {
    this.viewer = options.viewer;
    this.onSeek = options.onSeek;
    this.onStart = options.onStart;
    this.onStop = options.onStop;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getEndTime(): number {
    return this.endTime;
  }

  isActive(): boolean {
    return this.previewActive;
  }

  start(keyframes: Keyframe[], startTimeSeconds?: number): boolean {
    const normalizedKeyframes = keyframes.map(cloneKeyframe).sort((left, right) => left.time - right.time);
    if (this.previewActive || normalizedKeyframes.length < 2) {
      return false;
    }

    this.interpolator.setKeyframes(normalizedKeyframes);
    this.startTime = normalizedKeyframes[0]?.time ?? 0;
    this.endTime = normalizedKeyframes.at(-1)?.time ?? 0;
    const requestedStartTime = typeof startTimeSeconds === 'number' ? startTimeSeconds : this.startTime;
    this.currentTime = THREE.MathUtils.clamp(requestedStartTime, this.startTime, this.endTime);
    this.previewActive = true;
    this.previewStartedAt = performance.now() - (this.currentTime - this.startTime) * 1000;
    this.onStart?.();
    this.applyTime(this.currentTime);
    this.previewAnimationFrameId = requestAnimationFrame(this.tickPreview);
    return true;
  }

  stop(): void {
    if (!this.previewActive) {
      return;
    }

    this.previewActive = false;
    if (this.previewAnimationFrameId !== null) {
      cancelAnimationFrame(this.previewAnimationFrameId);
      this.previewAnimationFrameId = null;
    }
    this.onStop?.();
  }

  private readonly tickPreview = (): void => {
    if (!this.previewActive) {
      return;
    }

    const elapsedSeconds = (performance.now() - this.previewStartedAt) / 1000;
    const nextTime = Math.min(this.startTime + elapsedSeconds, this.endTime);
    this.applyTime(nextTime);

    if (nextTime >= this.endTime) {
      this.stop();
      return;
    }

    this.previewAnimationFrameId = requestAnimationFrame(this.tickPreview);
  };

  private applyTime(timeSeconds: number): void {
    this.currentTime = THREE.MathUtils.clamp(timeSeconds, this.startTime, this.endTime);
    const pose = this.interpolator.evaluate(this.currentTime);
    if (pose) {
      this.viewer.applyCameraPose(pose);
    }
    this.onSeek?.(this.currentTime, Math.max(0, this.endTime - this.startTime));
  }
}
