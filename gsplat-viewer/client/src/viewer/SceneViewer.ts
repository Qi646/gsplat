/**
 * SceneViewer.ts
 * Wraps @mkkellogg/gaussian-splats-3d and exposes a clean API
 * for loading, rendering, and camera control.
 */

import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import type { AppEvents } from '../types';

export interface ViewerOptions {
  canvas: HTMLCanvasElement;
  events: AppEvents;
}

export class SceneViewer {
  private viewer: GaussianSplats3D.Viewer | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private canvas: HTMLCanvasElement;
  private events: AppEvents;

  private initialPosition = new THREE.Vector3();
  private initialQuaternion = new THREE.Quaternion();
  private initialFov = 60;

  private splatCount = 0;
  private sceneLoaded = false;
  private sceneBounds = new THREE.Box3();

  // FPS tracking
  private fpsSamples: number[] = [];
  private lastFrameTime = performance.now();

  constructor(options: ViewerOptions) {
    this.canvas = options.canvas;
    this.events = options.events;
  }

  async init(): Promise<void> {
    // The GaussianSplats3D Viewer manages its own renderer/scene/camera
    // We access them after initialization
    this.viewer = new GaussianSplats3D.Viewer({
      canvas: this.canvas,
      initialCameraPosition: [0, 0, 3],
      initialCameraLookAt: [0, 0, 0],
      selfDrivenMode: false,    // We drive the render loop for export control
      useWorkers: true,
      workerConfig: { crossOriginIsolated: false },
    });

    await this.viewer.init();

    // Extract renderer, scene, camera references after init
    this.renderer = this.viewer.renderer as THREE.WebGLRenderer;
    this.scene = this.viewer.scene as THREE.Scene;
    this.camera = this.viewer.camera as THREE.PerspectiveCamera;

    this.startRenderLoop();
  }

  async loadScene(url: string): Promise<void> {
    if (!this.viewer) throw new Error('Viewer not initialized');

    this.sceneLoaded = false;
    this.events.emit('scene:progress', { percent: 0, message: 'Starting download…' });

    // Detect format from URL
    const format = this.detectFormat(url);

    await this.viewer.addSplatScene(url, {
      format,
      onProgress: (percent: number, _message: string, stage: GaussianSplats3D.LoadingTaskState) => {
        const stageLabel = this.stageToLabel(stage);
        this.events.emit('scene:progress', {
          percent: Math.round(percent),
          message: `${stageLabel} (${Math.round(percent)}%)`,
        });
      },
    });

    // Give the viewer a frame to process
    await new Promise(r => requestAnimationFrame(r));

    // Read splat count
    try {
      const splatMesh = this.viewer.splatMesh;
      this.splatCount = splatMesh?.getSplatCount?.() ?? 0;
    } catch {
      this.splatCount = 0;
    }

    // Compute scene bounds
    this.computeSceneBounds();

    // Store initial camera state
    this.saveInitialCamera();

    this.sceneLoaded = true;
    this.events.emit('scene:loaded', {
      splatCount: this.splatCount,
      bounds: this.sceneBounds,
    });
  }

  private detectFormat(url: string): GaussianSplats3D.SceneFormat {
    const lower = url.toLowerCase();
    if (lower.endsWith('.splat')) return GaussianSplats3D.SceneFormat.Splat;
    if (lower.endsWith('.ksplat')) return GaussianSplats3D.SceneFormat.KSplat;
    return GaussianSplats3D.SceneFormat.Ply;
  }

  private stageToLabel(stage: unknown): string {
    // The library exports numeric enum values
    const stageMap: Record<number, string> = {
      0: 'Requesting',
      1: 'Downloading',
      2: 'Processing',
      3: 'Uploading to GPU',
    };
    return stageMap[stage as number] ?? 'Loading';
  }

  private computeSceneBounds(): void {
    if (!this.scene) return;
    const box = new THREE.Box3();
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.computeBoundingBox();
          if (mesh.geometry.boundingBox) {
            box.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
          }
        }
      }
    });
    if (!box.isEmpty()) this.sceneBounds = box;
  }

  frameScene(): void {
    if (!this.camera || this.sceneBounds.isEmpty()) return;
    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    this.sceneBounds.getBoundingSphere(sphere);
    this.sceneBounds.getCenter(center);

    const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
    const distance = sphere.radius / Math.tan(fovRad / 2) * 1.3;

    // Animate camera to frame position
    const target = center.clone().add(new THREE.Vector3(0, sphere.radius * 0.3, distance));
    this.camera.position.copy(target);
    this.camera.lookAt(center);
    this.viewer?.controls?.target?.copy(center);
    this.viewer?.controls?.update?.();
  }

  resetView(): void {
    if (!this.camera) return;
    this.camera.position.copy(this.initialPosition);
    this.camera.quaternion.copy(this.initialQuaternion);
    this.camera.fov = this.initialFov;
    this.camera.updateProjectionMatrix();
    this.viewer?.controls?.update?.();
  }

  private saveInitialCamera(): void {
    if (!this.camera) return;
    this.initialPosition.copy(this.camera.position);
    this.initialQuaternion.copy(this.camera.quaternion);
    this.initialFov = this.camera.fov;
  }

  // ── Render loop ─────────────────────────────────────────────────────────────

  private animFrameId: number | null = null;
  private externalRenderMode = false;

  private startRenderLoop(): void {
    const tick = () => {
      if (this.externalRenderMode) {
        this.animFrameId = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      this.fpsSamples.push(1000 / delta);
      if (this.fpsSamples.length > 60) this.fpsSamples.shift();

      this.viewer?.update();
      this.viewer?.render();

      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  getFPS(): number {
    if (this.fpsSamples.length === 0) return 0;
    const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
    return Math.round(avg);
  }

  getSplatCount(): number { return this.splatCount; }
  getCamera(): THREE.PerspectiveCamera | null { return this.camera; }
  getRenderer(): THREE.WebGLRenderer | null { return this.renderer; }
  getScene(): THREE.Scene | null { return this.scene; }
  getSceneBounds(): THREE.Box3 { return this.sceneBounds; }
  isSceneLoaded(): boolean { return this.sceneLoaded; }

  /** Enter deterministic render mode for export — disables normal rAF loop */
  enterExportMode(): void {
    this.externalRenderMode = true;
  }

  exitExportMode(): void {
    this.externalRenderMode = false;
  }

  /** Force a synchronous render at given camera pose — used during export */
  renderFrame(position: THREE.Vector3, quaternion: THREE.Quaternion, fov: number): void {
    if (!this.camera || !this.renderer || !this.scene || !this.viewer) return;

    this.camera.position.copy(position);
    this.camera.quaternion.copy(quaternion);
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();

    // Trigger splat sort update at new camera position
    this.viewer.update();
    this.viewer.render();
  }

  dispose(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    this.viewer?.dispose?.();
  }
}
