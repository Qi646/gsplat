import * as THREE from 'three';
import type { AppEvents, CameraPath, InterpolatedPose, Keyframe } from '../types';
import { buildCameraPath, parseCameraPath } from './cameraPath';
import { PathInterpolator } from './PathInterpolator';

export interface CameraPathViewer {
  applyCameraPose(pose: InterpolatedPose): void;
  getCamera(): THREE.PerspectiveCamera | null;
}

export interface KeyframeManagerOptions {
  viewer: CameraPathViewer;
  events: AppEvents;
  defaultSpacingSeconds?: number;
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

export class KeyframeManager {
  private readonly viewer: CameraPathViewer;
  private readonly events: AppEvents;
  private readonly defaultSpacingSeconds: number;
  private readonly interpolator = new PathInterpolator();
  private keyframes: Keyframe[] = [];
  private currentTime = 0;
  private previewActive = false;
  private previewAnimationFrameId: number | null = null;
  private previewStartedAt = 0;

  constructor(options: KeyframeManagerOptions) {
    this.viewer = options.viewer;
    this.events = options.events;
    this.defaultSpacingSeconds = options.defaultSpacingSeconds ?? 3;
  }

  addKeyframe(timeSeconds?: number): Keyframe | null {
    this.stopPreview();

    const camera = this.viewer.getCamera();
    if (!camera) {
      return null;
    }

    const keyframe: Keyframe = {
      id: crypto.randomUUID(),
      time: timeSeconds ?? this.suggestTime(),
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      quaternion: {
        x: camera.quaternion.x,
        y: camera.quaternion.y,
        z: camera.quaternion.z,
        w: camera.quaternion.w,
      },
      fov: camera.fov,
    };

    this.keyframes.push(keyframe);
    this.rebuild();
    this.events.emit('keyframe:added', { keyframe: cloneKeyframe(keyframe) });
    this.emitSeek();
    return cloneKeyframe(keyframe);
  }

  appendKeyframes(keyframes: Keyframe[]): Keyframe[] {
    if (keyframes.length === 0) {
      return [];
    }

    this.stopPreview();
    const appendedKeyframes = keyframes.map(cloneKeyframe);
    this.keyframes = [...this.keyframes, ...appendedKeyframes];
    this.rebuild();
    this.currentTime = Math.min(this.currentTime, this.getTotalDuration());
    this.applyCurrentTimeIfPossible();
    this.events.emit('keyframe:reordered', { keyframes: this.getKeyframes() });
    return appendedKeyframes.map(cloneKeyframe);
  }

  deleteKeyframe(id: string): boolean {
    const nextKeyframes = this.keyframes.filter(keyframe => keyframe.id !== id);
    if (nextKeyframes.length === this.keyframes.length) {
      return false;
    }

    this.stopPreview();
    this.keyframes = nextKeyframes;
    this.rebuild();
    this.currentTime = Math.min(this.currentTime, this.getTotalDuration());
    this.applyCurrentTimeIfPossible();
    this.events.emit('keyframe:deleted', { id });
    return true;
  }

  moveKeyframe(id: string, direction: -1 | 1): boolean {
    const currentIndex = this.keyframes.findIndex(keyframe => keyframe.id === id);
    const nextIndex = currentIndex + direction;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= this.keyframes.length) {
      return false;
    }

    this.stopPreview();

    const reordered = this.keyframes.map(cloneKeyframe);
    const [movedKeyframe] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, movedKeyframe);

    const totalDuration = this.getTotalDuration();
    const step = reordered.length > 1 ? totalDuration / (reordered.length - 1) : 0;
    reordered.forEach((keyframe, index) => {
      keyframe.time = step * index;
    });

    this.keyframes = reordered;
    this.rebuild();
    this.currentTime = Math.min(this.currentTime, this.getTotalDuration());
    this.applyCurrentTimeIfPossible();
    this.events.emit('keyframe:reordered', { keyframes: this.getKeyframes() });
    return true;
  }

  clear(): void {
    if (this.keyframes.length === 0) {
      this.currentTime = 0;
      this.emitSeek();
      return;
    }

    this.stopPreview();
    this.keyframes = [];
    this.rebuild();
    this.currentTime = 0;
    this.events.emit('keyframe:reordered', { keyframes: [] });
    this.emitSeek();
  }

  getKeyframes(): Keyframe[] {
    return this.keyframes.map(cloneKeyframe);
  }

  getTotalDuration(): number {
    return this.interpolator.getTotalDuration();
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  isPreviewActive(): boolean {
    return this.previewActive;
  }

  seekToTime(timeSeconds: number): void {
    if (this.previewActive) {
      this.stopPreview();
    }
    this.applyTime(timeSeconds);
  }

  startPreview(startTimeSeconds = 0): boolean {
    const totalDuration = this.getTotalDuration();
    if (this.previewActive || this.keyframes.length < 2 || totalDuration <= 0) {
      return false;
    }

    const normalizedStartTime = Number.isFinite(startTimeSeconds) ? startTimeSeconds : 0;
    const clampedStartTime = THREE.MathUtils.clamp(normalizedStartTime, 0, totalDuration);
    this.previewActive = true;
    this.previewStartedAt = performance.now() - clampedStartTime * 1000;
    this.events.emit('path:preview:start', undefined);
    this.applyTime(clampedStartTime);
    this.previewAnimationFrameId = requestAnimationFrame(this.tickPreview);
    return true;
  }

  stopPreview(): void {
    if (!this.previewActive) {
      return;
    }

    this.previewActive = false;
    if (this.previewAnimationFrameId !== null) {
      cancelAnimationFrame(this.previewAnimationFrameId);
      this.previewAnimationFrameId = null;
    }
    this.events.emit('path:preview:stop', undefined);
  }

  toJSON(): CameraPath {
    return buildCameraPath(this.keyframes);
  }

  fromJSON(input: unknown): CameraPath {
    this.stopPreview();

    const parsedPath = parseCameraPath(input);
    this.keyframes = parsedPath.keyframes.map(cloneKeyframe);
    this.rebuild();
    this.currentTime = 0;
    this.applyCurrentTimeIfPossible();
    this.events.emit('keyframe:reordered', { keyframes: this.getKeyframes() });
    return parsedPath;
  }

  private readonly tickPreview = (): void => {
    if (!this.previewActive) {
      return;
    }

    const elapsedSeconds = (performance.now() - this.previewStartedAt) / 1000;
    const totalDuration = this.getTotalDuration();
    const nextTime = Math.min(elapsedSeconds, totalDuration);

    this.applyTime(nextTime);

    if (elapsedSeconds >= totalDuration) {
      this.stopPreview();
      return;
    }

    this.previewAnimationFrameId = requestAnimationFrame(this.tickPreview);
  };

  private suggestTime(): number {
    return this.keyframes.length === 0
      ? 0
      : this.keyframes[this.keyframes.length - 1].time + this.defaultSpacingSeconds;
  }

  private rebuild(): void {
    this.keyframes = this.keyframes.map(cloneKeyframe).sort((left, right) => left.time - right.time);
    this.interpolator.setKeyframes(this.keyframes);
  }

  private applyTime(timeSeconds: number): void {
    const clampedTime = THREE.MathUtils.clamp(timeSeconds, 0, this.getTotalDuration());
    this.currentTime = clampedTime;

    const pose = this.interpolator.evaluate(clampedTime);
    if (pose) {
      this.viewer.applyCameraPose(pose);
    }

    this.emitSeek();
  }

  private applyCurrentTimeIfPossible(): void {
    if (this.keyframes.length === 0) {
      this.emitSeek();
      return;
    }

    this.applyTime(this.currentTime);
  }

  private emitSeek(): void {
    this.events.emit('path:seek', {
      time: this.currentTime,
      duration: this.getTotalDuration(),
    });
  }
}
