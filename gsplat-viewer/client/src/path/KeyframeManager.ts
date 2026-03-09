/**
 * KeyframeManager.ts
 * Manages the list of keyframes, playback preview, and cinematic presets.
 */

import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';  // or use crypto.randomUUID()
import type { Keyframe, CameraPath, AppEvents } from '../types';
import { PathInterpolator } from './PathInterpolator';
import type { SceneViewer } from '../viewer/SceneViewer';

export class KeyframeManager {
  private keyframes: Keyframe[] = [];
  private interpolator = new PathInterpolator();
  private events: AppEvents;
  private viewer: SceneViewer;

  // Preview playback state
  private previewActive = false;
  private previewAnimFrame: number | null = null;
  private previewStartTime = 0;
  private previewDuration = 10; // seconds (overridable)

  // Scrubber state (0–1)
  private scrubberT = 0;

  constructor(viewer: SceneViewer, events: AppEvents) {
    this.viewer = viewer;
    this.events = events;
  }

  // ── Keyframe CRUD ──────────────────────────────────────────────────────────

  addKeyframe(timeSeconds?: number): Keyframe | null {
    const camera = this.viewer.getCamera();
    if (!camera) return null;

    const time = timeSeconds ?? this.suggestTime();

    const kf: Keyframe = {
      id: crypto.randomUUID(),
      time,
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

    this.keyframes.push(kf);
    this.keyframes.sort((a, b) => a.time - b.time);
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:added', { keyframe: kf });

    return kf;
  }

  deleteKeyframe(id: string): void {
    this.keyframes = this.keyframes.filter(kf => kf.id !== id);
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:deleted', { id });
  }

  reorder(ids: string[]): void {
    const map = new Map(this.keyframes.map(kf => [kf.id, kf]));
    const reordered = ids.map(id => map.get(id)!).filter(Boolean);

    // Redistribute times evenly when reordering
    const totalTime = this.getTotalDuration();
    const step = totalTime / Math.max(reordered.length - 1, 1);
    reordered.forEach((kf, i) => { kf.time = i * step; });

    this.keyframes = reordered;
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:reordered', { keyframes: this.keyframes });
  }

  getKeyframes(): Keyframe[] {
    return [...this.keyframes];
  }

  clear(): void {
    this.keyframes = [];
    this.interpolator.setKeyframes([]);
  }

  getTotalDuration(): number {
    return this.interpolator.getTotalDuration();
  }

  private suggestTime(): number {
    if (this.keyframes.length === 0) return 0;
    const last = this.keyframes[this.keyframes.length - 1];
    return last.time + 3; // +3 seconds per keyframe by default
  }

  // ── Preview Playback ───────────────────────────────────────────────────────

  startPreview(duration?: number): void {
    if (this.keyframes.length < 2) return;
    this.previewDuration = duration ?? this.getTotalDuration();
    this.previewActive = true;
    this.previewStartTime = performance.now();
    this.events.emit('path:preview:start', undefined);
    this.tickPreview();
  }

  stopPreview(): void {
    this.previewActive = false;
    if (this.previewAnimFrame !== null) {
      cancelAnimationFrame(this.previewAnimFrame);
      this.previewAnimFrame = null;
    }
    this.events.emit('path:preview:stop', undefined);
  }

  isPreviewActive(): boolean { return this.previewActive; }

  private tickPreview(): void {
    if (!this.previewActive) return;

    const elapsed = (performance.now() - this.previewStartTime) / 1000;
    const t = elapsed % this.previewDuration;
    this.seekToTime(t);

    if (elapsed >= this.previewDuration) {
      this.stopPreview();
      return;
    }

    this.previewAnimFrame = requestAnimationFrame(() => this.tickPreview());
  }

  /** Scrub to a specific time (called by timeline slider) */
  seekToTime(t: number): void {
    const pose = this.interpolator.evaluate(t);
    if (!pose) return;

    const camera = this.viewer.getCamera();
    if (!camera) return;

    camera.position.copy(pose.position);
    camera.quaternion.copy(pose.quaternion);
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();
    this.scrubberT = this.getTotalDuration() > 0 ? t / this.getTotalDuration() : 0;
  }

  getScrubberT(): number { return this.scrubberT; }
  getInterpolator(): PathInterpolator { return this.interpolator; }

  // ── Cinematic Path Presets ─────────────────────────────────────────────────

  generateTurntable(): void {
    const bounds = this.viewer.getSceneBounds();
    if (bounds.isEmpty()) return;

    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    bounds.getBoundingSphere(sphere);
    bounds.getCenter(center);

    const radius = sphere.radius * 2.0;
    const height = center.y + sphere.radius * 0.3;
    const steps = 8;

    this.clear();
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radius;
      const z = center.z + Math.sin(angle) * radius;

      const pos = new THREE.Vector3(x, height, z);
      const cam = new THREE.PerspectiveCamera(60);
      cam.position.copy(pos);
      cam.lookAt(center);

      this.keyframes.push({
        id: crypto.randomUUID(),
        time: i * 2,
        position: { x: pos.x, y: pos.y, z: pos.z },
        quaternion: { x: cam.quaternion.x, y: cam.quaternion.y, z: cam.quaternion.z, w: cam.quaternion.w },
        fov: 60,
      });
    }
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:reordered', { keyframes: this.keyframes });
  }

  generateDollyIn(): void {
    const bounds = this.viewer.getSceneBounds();
    if (bounds.isEmpty()) return;

    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    bounds.getBoundingSphere(sphere);
    bounds.getCenter(center);

    this.clear();
    const distances = [4.0, 2.5, 1.2];
    distances.forEach((mult, i) => {
      const pos = new THREE.Vector3(center.x, center.y + sphere.radius * 0.2, center.z + sphere.radius * mult);
      const cam = new THREE.PerspectiveCamera(60 - i * 5);
      cam.position.copy(pos);
      cam.lookAt(center);

      this.keyframes.push({
        id: crypto.randomUUID(),
        time: i * 4,
        position: { x: pos.x, y: pos.y, z: pos.z },
        quaternion: { x: cam.quaternion.x, y: cam.quaternion.y, z: cam.quaternion.z, w: cam.quaternion.w },
        fov: cam.fov,
      });
    });
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:reordered', { keyframes: this.keyframes });
  }

  generateCraneUp(): void {
    const bounds = this.viewer.getSceneBounds();
    if (bounds.isEmpty()) return;

    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    bounds.getBoundingSphere(sphere);
    bounds.getCenter(center);

    this.clear();
    const heights = [0.1, 0.5, 1.0, 1.8];
    heights.forEach((hMult, i) => {
      const y = center.y + sphere.radius * hMult;
      const dist = sphere.radius * (2.5 - hMult * 0.3);
      const pos = new THREE.Vector3(center.x + dist * 0.5, y, center.z + dist);
      const cam = new THREE.PerspectiveCamera(55);
      cam.position.copy(pos);
      cam.lookAt(center);

      this.keyframes.push({
        id: crypto.randomUUID(),
        time: i * 3,
        position: { x: pos.x, y: pos.y, z: pos.z },
        quaternion: { x: cam.quaternion.x, y: cam.quaternion.y, z: cam.quaternion.z, w: cam.quaternion.w },
        fov: cam.fov,
      });
    });
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:reordered', { keyframes: this.keyframes });
  }

  generateFigureEight(): void {
    const bounds = this.viewer.getSceneBounds();
    if (bounds.isEmpty()) return;

    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    bounds.getBoundingSphere(sphere);
    bounds.getCenter(center);

    this.clear();
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      // Lemniscate of Bernoulli
      const scale = sphere.radius * 2;
      const denom = 1 + Math.sin(a) * Math.sin(a);
      const x = center.x + scale * Math.cos(a) / denom;
      const z = center.z + scale * Math.sin(a) * Math.cos(a) / denom;
      const y = center.y + sphere.radius * 0.2;

      const pos = new THREE.Vector3(x, y, z);
      const cam = new THREE.PerspectiveCamera(60);
      cam.position.copy(pos);
      cam.lookAt(center);

      this.keyframes.push({
        id: crypto.randomUUID(),
        time: i * 1.5,
        position: { x: pos.x, y: pos.y, z: pos.z },
        quaternion: { x: cam.quaternion.x, y: cam.quaternion.y, z: cam.quaternion.z, w: cam.quaternion.w },
        fov: 60,
      });
    }
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:reordered', { keyframes: this.keyframes });
  }

  // ── Serialization ─────────────────────────────────────────────────────────

  toJSON(): CameraPath {
    return {
      version: 1,
      keyframes: [...this.keyframes],
      totalDuration: this.getTotalDuration(),
      createdAt: new Date().toISOString(),
    };
  }

  fromJSON(path: CameraPath): void {
    this.keyframes = path.keyframes;
    this.interpolator.setKeyframes(this.keyframes);
    this.events.emit('keyframe:reordered', { keyframes: this.keyframes });
  }
}
