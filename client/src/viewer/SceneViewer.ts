import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';
import type { AppEvents } from '../types';
import { detectSceneFormat } from '../lib/sceneFormat';

export interface ViewerOptions {
  canvas: HTMLCanvasElement;
  events: AppEvents;
}

export class SceneViewer {
  private canvas: HTMLCanvasElement;
  private events: AppEvents;
  private viewer: GaussianSplats3D.Viewer | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private sceneBounds = new THREE.Box3();
  private sceneLoaded = false;
  private splatCount = 0;
  private initialPosition = new THREE.Vector3();
  private initialQuaternion = new THREE.Quaternion();
  private initialFov = 60;
  private lastFrameTime = performance.now();
  private fpsSamples: number[] = [];
  private animationFrameId: number | null = null;
  private frameHook: (() => void) | null = null;

  constructor(options: ViewerOptions) {
    this.canvas = options.canvas;
    this.events = options.events;
  }

  async init(): Promise<void> {
    this.viewer = new GaussianSplats3D.Viewer({
      canvas: this.canvas,
      initialCameraPosition: [0, 0, 3],
      initialCameraLookAt: [0, 0, 0],
      selfDrivenMode: false,
      useWorkers: true,
      workerConfig: { crossOriginIsolated: false },
    });

    await this.viewer.init();

    this.renderer = this.viewer.renderer as THREE.WebGLRenderer;
    this.scene = this.viewer.scene as THREE.Scene;
    this.camera = this.viewer.camera as THREE.PerspectiveCamera;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.startRenderLoop();
  }

  async loadScene(url: string): Promise<void> {
    if (!this.viewer) {
      throw new Error('Viewer not initialized');
    }

    this.sceneLoaded = false;
    this.events.emit('scene:progress', { percent: 0, message: 'Starting download…' });

    try {
      await this.viewer.addSplatScene(url, {
        format: this.toSceneFormat(detectSceneFormat(url)),
        onProgress: (percent: number, _message: string, stage: unknown) => {
          this.events.emit('scene:progress', {
            percent: Math.round(percent),
            message: `${this.stageToLabel(stage)} (${Math.round(percent)}%)`,
          });
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown load error';
      this.events.emit('scene:error', { message });
      throw error;
    }

    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    this.splatCount = this.readSplatCount();
    this.computeSceneBounds();
    this.frameScene();
    this.saveInitialCamera();
    this.sceneLoaded = true;

    this.events.emit('scene:loaded', {
      splatCount: this.splatCount,
    });
  }

  resize(width: number, height: number): void {
    if (!this.renderer || !this.camera) {
      return;
    }

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
  }

  setFrameHook(frameHook: (() => void) | null): void {
    this.frameHook = frameHook;
  }

  frameScene(): void {
    if (!this.camera || this.sceneBounds.isEmpty()) {
      return;
    }

    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    this.sceneBounds.getBoundingSphere(sphere);
    this.sceneBounds.getCenter(center);

    const fovRadians = THREE.MathUtils.degToRad(this.camera.fov);
    const distance = (sphere.radius / Math.tan(fovRadians / 2)) * 1.3;
    const targetPosition = center.clone().add(new THREE.Vector3(0, sphere.radius * 0.3, distance));

    this.camera.position.copy(targetPosition);
    this.camera.lookAt(center);
    this.viewer?.controls?.target?.copy(center);
    this.viewer?.controls?.update?.();
  }

  resetView(): void {
    if (!this.camera) {
      return;
    }

    this.camera.position.copy(this.initialPosition);
    this.camera.quaternion.copy(this.initialQuaternion);
    this.camera.fov = this.initialFov;
    this.camera.updateProjectionMatrix();
    this.viewer?.controls?.update?.();
  }

  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  getFPS(): number {
    if (this.fpsSamples.length === 0) {
      return 0;
    }

    const average = this.fpsSamples.reduce((sum, sample) => sum + sample, 0) / this.fpsSamples.length;
    return Math.round(average);
  }

  getSplatCount(): number {
    return this.splatCount;
  }

  isSceneLoaded(): boolean {
    return this.sceneLoaded;
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.viewer?.dispose?.();
  }

  private toSceneFormat(formatId: ReturnType<typeof detectSceneFormat>): GaussianSplats3D.SceneFormat {
    if (formatId === 'splat') {
      return GaussianSplats3D.SceneFormat.Splat;
    }
    if (formatId === 'ksplat') {
      return GaussianSplats3D.SceneFormat.KSplat;
    }
    return GaussianSplats3D.SceneFormat.Ply;
  }

  private stageToLabel(stage: unknown): string {
    const stageMap: Record<number, string> = {
      0: 'Requesting',
      1: 'Downloading',
      2: 'Processing',
      3: 'Uploading to GPU',
    };

    return stageMap[stage as number] ?? 'Loading';
  }

  private startRenderLoop(): void {
    const tick = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      if (delta > 0) {
        this.fpsSamples.push(1000 / delta);
        if (this.fpsSamples.length > 60) {
          this.fpsSamples.shift();
        }
      }

      this.frameHook?.();
      this.viewer?.update();
      this.viewer?.render();
      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private readSplatCount(): number {
    try {
      return this.viewer?.splatMesh?.getSplatCount?.() ?? 0;
    } catch {
      return 0;
    }
  }

  private computeSceneBounds(): void {
    if (!this.scene) {
      return;
    }

    const box = new THREE.Box3().setFromObject(this.scene);
    if (!box.isEmpty()) {
      this.sceneBounds.copy(box);
    }
  }

  private saveInitialCamera(): void {
    if (!this.camera) {
      return;
    }

    this.initialPosition.copy(this.camera.position);
    this.initialQuaternion.copy(this.camera.quaternion);
    this.initialFov = this.camera.fov;
  }
}
