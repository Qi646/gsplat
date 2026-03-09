import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';
import { formatLoadProgress } from '../lib/loadProgress';
import type { AppEvents, InterpolatedPose, ViewerDebugSnapshot } from '../types';
import { detectSceneFormat } from '../lib/sceneFormat';
import { resolveViewerRuntimeConfig, type ViewerRuntimeOverrides, type ViewerRuntimeOptions } from './viewerRuntime';

export interface ViewerOptions {
  hostElement: HTMLElement;
  events: AppEvents;
  runtimeOverrides?: ViewerRuntimeOverrides;
}

export class SceneViewer {
  private hostElement: HTMLElement;
  private events: AppEvents;
  private runtimeOverrides: ViewerRuntimeOverrides;
  private viewer: GaussianSplats3D.Viewer | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
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
  private compatibilityMode = false;
  private compatibilityStatusMessage: string | null = null;
  private runtimeViewerOptions: ViewerRuntimeOptions = {
    gpuAcceleratedSort: false,
    sharedMemoryForWorkers: false,
    integerBasedSort: false,
    splatSortDistanceMapPrecision: 20,
  };

  constructor(options: ViewerOptions) {
    this.hostElement = options.hostElement;
    this.events = options.events;
    this.runtimeOverrides = options.runtimeOverrides ?? {};
  }

  async init(): Promise<void> {
    const runtimeConfig = resolveViewerRuntimeConfig(window.crossOriginIsolated, this.runtimeOverrides);
    this.compatibilityMode = runtimeConfig.compatibilityMode;
    this.compatibilityStatusMessage = runtimeConfig.statusMessage;
    this.runtimeViewerOptions = runtimeConfig.viewerOptions;

    if (runtimeConfig.warningMessage) {
      console.warn(runtimeConfig.warningMessage);
    }

    this.viewer = new GaussianSplats3D.Viewer({
      rootElement: this.hostElement,
      initialCameraPosition: [0, 0, 3],
      initialCameraLookAt: [0, 0, 0],
      selfDrivenMode: false,
      ...runtimeConfig.viewerOptions,
    });

    await this.viewer.init();

    this.renderer = this.viewer.renderer as THREE.WebGLRenderer;
    this.camera = this.viewer.camera as THREE.PerspectiveCamera;

    if (!this.renderer || !this.camera) {
      throw new Error('Viewer initialization did not expose a renderer and camera.');
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.startRenderLoop();
  }

  async loadScene(url: string): Promise<void> {
    if (!this.viewer) {
      throw new Error('Viewer not initialized');
    }

    this.resetSceneState();
    this.events.emit('scene:progress', { percent: 0, message: 'Starting download…' });

    try {
      await this.removeExistingScenes();

      await this.viewer.addSplatScene(url, {
        format: this.toSceneFormat(detectSceneFormat(url)),
        showLoadingUI: false,
        onProgress: (percent: number, progressLabel: string, stage: number) => {
          this.events.emit('scene:progress', formatLoadProgress(percent, progressLabel, stage));
        },
      });

      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      this.splatCount = this.readSplatCount();
      if (this.splatCount <= 0) {
        throw new Error('Loaded scene contains no splats.');
      }

      this.computeSceneBounds();
      if (!this.hasUsableSceneBounds()) {
        throw new Error('Loaded scene bounds are invalid.');
      }

      if (!this.frameScene()) {
        throw new Error('Loaded scene could not be framed.');
      }

      this.saveInitialCamera();
      this.sceneLoaded = true;

      this.events.emit('scene:loaded', {
        splatCount: this.splatCount,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown load error';
      this.events.emit('scene:error', { message });
      throw error;
    }
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

  frameScene(): boolean {
    if (!this.camera || !this.hasUsableSceneBounds()) {
      return false;
    }

    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    this.sceneBounds.getBoundingSphere(sphere);
    this.sceneBounds.getCenter(center);

    const fovRadians = THREE.MathUtils.degToRad(this.camera.fov);
    const radius = Math.max(sphere.radius, 0.5);
    const distance = (radius / Math.tan(fovRadians / 2)) * 1.3;
    const targetPosition = center.clone().add(new THREE.Vector3(0, radius * 0.3, distance));

    this.camera.position.copy(targetPosition);
    this.camera.lookAt(center);
    this.viewer?.controls?.target?.copy(center);
    this.viewer?.controls?.update?.();
    return true;
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

  applyCameraPose(pose: InterpolatedPose): void {
    if (!this.camera) {
      return;
    }

    const currentTarget = this.viewer?.controls?.target as THREE.Vector3 | undefined;
    const distanceToTarget = currentTarget ? currentTarget.distanceTo(this.camera.position) : 1;

    this.camera.position.copy(pose.position);
    this.camera.quaternion.copy(pose.quaternion);
    this.camera.fov = pose.fov;
    this.camera.updateProjectionMatrix();

    if (currentTarget) {
      const lookDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      const targetDistance = distanceToTarget > 0 ? distanceToTarget : 1;
      currentTarget.copy(this.camera.position).addScaledVector(lookDirection, targetDistance);
    }

    this.viewer?.controls?.update?.();
  }

  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  getInteractionSurface(): HTMLCanvasElement | null {
    return (this.renderer?.domElement as HTMLCanvasElement | undefined) ?? null;
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

  isCompatibilityMode(): boolean {
    return this.compatibilityMode;
  }

  getCompatibilityStatusMessage(): string | null {
    return this.compatibilityStatusMessage;
  }

  getDebugSnapshot(): ViewerDebugSnapshot {
    const internalViewer = this.viewer as (GaussianSplats3D.Viewer & {
      lastSortTime?: number;
      splatRenderCount?: number;
    }) | null;
    const gl = this.renderer?.getContext?.();

    return {
      canvasSize: {
        width: this.renderer?.domElement.width ?? 0,
        height: this.renderer?.domElement.height ?? 0,
        clientWidth: this.renderer?.domElement.clientWidth ?? 0,
        clientHeight: this.renderer?.domElement.clientHeight ?? 0,
      },
      rendererInfo: {
        renderer: gl ? String(gl.getParameter(gl.RENDERER)) : null,
        shadingLanguageVersion: gl ? String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)) : null,
        vendor: gl ? String(gl.getParameter(gl.VENDOR)) : null,
        version: gl ? String(gl.getParameter(gl.VERSION)) : null,
      },
      runtime: {
        compatibilityMode: this.compatibilityMode,
        compatibilityStatusMessage: this.compatibilityStatusMessage,
        viewerOptions: { ...this.runtimeViewerOptions },
      },
      sceneCount: this.viewer?.getSceneCount?.() ?? 0,
      sceneLoaded: this.sceneLoaded,
      splatCount: Math.max(this.splatCount, this.readSplatCount()),
      splatRenderCount: internalViewer?.splatRenderCount ?? 0,
      lastSortTime: typeof internalViewer?.lastSortTime === 'number' ? internalViewer.lastSortTime : null,
    };
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
      return this.viewer?.getSplatMesh()?.getSplatCount() ?? 0;
    } catch {
      return 0;
    }
  }

  private computeSceneBounds(): void {
    if (!this.viewer) {
      return;
    }

    try {
      const box = this.viewer.getSplatMesh().computeBoundingBox(true);
      if (this.isFiniteBox(box)) {
        this.sceneBounds.copy(box);
      }
    } catch {
      this.sceneBounds.makeEmpty();
    }
  }

  private resetSceneState(): void {
    this.sceneLoaded = false;
    this.splatCount = 0;
    this.sceneBounds.makeEmpty();
    this.initialPosition.set(0, 0, 0);
    this.initialQuaternion.identity();
    this.initialFov = 60;
  }

  private async removeExistingScenes(): Promise<void> {
    if (!this.viewer) {
      return;
    }

    const sceneCount = this.viewer.getSceneCount();
    if (sceneCount === 0) {
      return;
    }

    const sceneIndexes = Array.from({ length: sceneCount }, (_, index) => index);
    await this.viewer.removeSplatScenes(sceneIndexes, false);
  }

  private saveInitialCamera(): void {
    if (!this.camera) {
      return;
    }

    this.initialPosition.copy(this.camera.position);
    this.initialQuaternion.copy(this.camera.quaternion);
    this.initialFov = this.camera.fov;
  }

  private hasUsableSceneBounds(): boolean {
    return !this.sceneBounds.isEmpty() && this.isFiniteBox(this.sceneBounds);
  }

  private isFiniteBox(box: THREE.Box3): boolean {
    return [box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite);
  }
}
