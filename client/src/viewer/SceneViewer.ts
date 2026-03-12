import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';
import { formatLoadProgress } from '../lib/loadProgress';
import { computeRobustSceneBounds } from '../lib/robustSceneBounds';
import type { SceneFormatId } from '../lib/sceneFormat';
import { resolveSceneLoadSource, type SceneLoadInput } from '../lib/sceneSource';
import type { AppEvents, InterpolatedPose, ScenePointSample, ViewerDebugSnapshot } from '../types';
import { applyAdaptiveCameraFrustum } from './adaptiveCameraFrustum';
import {
  createViewerOrbitControls,
  resizeViewerOrbitControls,
  resumeOrbitControlsFromCamera,
  setOrbitControlsNavigationMode,
  syncOrbitControlsTargetFromCamera,
  updateOrbitControls,
  type NavigationMode,
  type ViewerCameraControls,
} from './orbitControls';
import { computeFramedSceneView } from './sceneFraming';
import { resolveViewerRuntimeConfig, type ViewerRuntimeOverrides, type ViewerRuntimeOptions } from './viewerRuntime';
import type { ViewerAdapter, ViewerAdapterOptions } from './ViewerAdapter';

const DEFAULT_SCENE_POINT_SAMPLE_LIMIT = 8192;

export class SceneViewer implements ViewerAdapter {
  private hostElement: HTMLElement;
  private events: AppEvents;
  private runtimeOverrides: ViewerRuntimeOverrides;
  private viewer: GaussianSplats3D.Viewer | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private controls: ViewerCameraControls | null = null;
  private sceneBounds = new THREE.Box3();
  private sceneLoaded = false;
  private splatCount = 0;
  private initialPosition = new THREE.Vector3();
  private initialTarget = new THREE.Vector3();
  private initialUp = new THREE.Vector3(0, 1, 0);
  private initialQuaternion = new THREE.Quaternion();
  private initialFov = 60;
  private lastFrameTime = performance.now();
  private fpsSamples: number[] = [];
  private animationFrameId: number | null = null;
  private frameHook: (() => void) | null = null;
  private navigationMode: NavigationMode = 'orbit';
  private compatibilityMode = false;
  private compatibilityStatusMessage: string | null = null;
  private renderBudget: number | null = null;
  private renderedSplatCount = 0;
  private runtimeViewerOptions: ViewerRuntimeOptions = {
    gpuAcceleratedSort: false,
    sharedMemoryForWorkers: false,
    integerBasedSort: false,
    splatSortDistanceMapPrecision: 20,
  };

  constructor(options: ViewerAdapterOptions) {
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
      useBuiltInControls: false,
      ...runtimeConfig.viewerOptions,
    });

    await this.viewer.init();

    this.renderer = this.viewer.renderer as THREE.WebGLRenderer;
    this.camera = this.viewer.camera as THREE.PerspectiveCamera;

    if (!this.renderer || !this.camera) {
      throw new Error('Viewer initialization did not expose a renderer and camera.');
    }

    this.controls = createViewerOrbitControls(this.camera, this.renderer.domElement);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.startRenderLoop();
  }

  async loadScene(source: SceneLoadInput): Promise<void> {
    if (!this.viewer) {
      throw new Error('Viewer not initialized');
    }

    const resolvedSource = resolveSceneLoadSource(source);
    this.resetSceneState();
    this.events.emit('scene:progress', { percent: 0, message: 'Starting download…' });

    try {
      await this.removeExistingScenes();

      await this.viewer.addSplatScene(resolvedSource.url, {
        format: this.toSceneFormat(resolvedSource.format),
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
    resizeViewerOrbitControls(this.controls);
    this.syncCameraProjection(true);
  }

  setFrameHook(frameHook: (() => void) | null): void {
    this.frameHook = frameHook;
  }

  setRenderBudget(maxRenderCount: number | null): void {
    this.renderBudget = maxRenderCount;
  }

  getRenderBudget(): number | null {
    return this.renderBudget;
  }

  setNavigationMode(mode: 'orbit' | 'walk'): void {
    this.navigationMode = mode;
    setOrbitControlsNavigationMode(this.controls, mode);
  }

  resumeOrbitFromCamera(distance?: number): void {
    if (!this.camera) {
      return;
    }

    this.navigationMode = 'orbit';
    resumeOrbitControlsFromCamera(this.camera, this.controls, distance);
  }

  renderNow(): void {
    this.frameHook?.();
    updateOrbitControls(this.controls, this.navigationMode);
    this.viewer?.update();
    this.applyRenderBudgetToFrame();
    this.syncCameraProjection();
    this.viewer?.render();
  }

  async captureFrame(): Promise<Blob> {
    const surface = this.getInteractionSurface();
    if (!surface) {
      throw new Error('Viewer capture surface is unavailable.');
    }

    return canvasToBlob(surface);
  }

  sampleScenePoints(maxSamples = DEFAULT_SCENE_POINT_SAMPLE_LIMIT): ScenePointSample[] {
    const splatMesh = this.viewer?.getSplatMesh();
    if (!splatMesh) {
      return [];
    }

    const sampleLimit = Math.max(1, Math.floor(maxSamples));
    const splatCount = typeof splatMesh.getSplatCount === 'function' ? splatMesh.getSplatCount() : 0;
    if (splatCount <= 0) {
      return [];
    }

    const stride = Math.max(1, Math.ceil(splatCount / sampleLimit));
    const center = new THREE.Vector3();
    const color = new THREE.Vector4();
    const samples: ScenePointSample[] = [];

    for (let splatIndex = 0; splatIndex < splatCount && samples.length < sampleLimit; splatIndex += stride) {
      splatMesh.getSplatColor(splatIndex, color);
      splatMesh.getSplatCenter(splatIndex, center, true);
      if (
        !Number.isFinite(color.w)
        || !Number.isFinite(center.x)
        || !Number.isFinite(center.y)
        || !Number.isFinite(center.z)
      ) {
        continue;
      }

      samples.push({
        opacity: color.w,
        position: {
          x: center.x,
          y: center.y,
          z: center.z,
        },
      });
    }

    return samples;
  }

  frameScene(): boolean {
    if (!this.camera || !this.controls || !this.hasUsableSceneBounds()) {
      return false;
    }

    const framedView = computeFramedSceneView(this.sceneBounds, this.camera);
    if (!framedView) {
      return false;
    }

    this.camera.position.copy(framedView.position);
    this.camera.up.copy(framedView.up);
    this.controls.target.copy(framedView.target);
    this.syncCameraProjection(true);
    updateOrbitControls(this.controls, 'orbit');
    return true;
  }

  resetView(): void {
    if (!this.camera || !this.controls) {
      return;
    }

    this.camera.position.copy(this.initialPosition);
    this.camera.up.copy(this.initialUp);
    this.camera.quaternion.copy(this.initialQuaternion);
    this.camera.fov = this.initialFov;
    this.controls.target.copy(this.initialTarget);
    this.syncCameraProjection(true);
    updateOrbitControls(this.controls, 'orbit');
  }

  applyCameraPose(pose: InterpolatedPose): void {
    if (!this.camera || !this.controls) {
      return;
    }

    const distanceToTarget = this.controls.target.distanceTo(this.camera.position);

    this.camera.position.copy(pose.position);
    this.camera.quaternion.copy(pose.quaternion);
    this.camera.fov = pose.fov;
    this.syncCameraProjection(true);

    syncOrbitControlsTargetFromCamera(this.camera, this.controls, distanceToTarget);
    updateOrbitControls(this.controls, 'orbit');
  }

  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  getSceneBounds(): THREE.Box3 | null {
    if (!this.sceneLoaded || !this.hasUsableSceneBounds()) {
      return null;
    }

    return this.sceneBounds.clone();
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

  getRenderedSplatCount(): number {
    return this.readRenderedSplatCount();
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

  getRendererId(): 'mkkellogg' {
    return 'mkkellogg';
  }

  getDebugSnapshot(): ViewerDebugSnapshot {
    const internalViewer = this.viewer as (GaussianSplats3D.Viewer & {
      lastSortTime?: number;
      splatRenderCount?: number;
    }) | null;
    const gl = this.renderer?.getContext?.();

    return {
      rendererId: this.getRendererId(),
      camera: {
        near: this.camera?.near ?? 0,
        far: this.camera?.far ?? 0,
      },
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
      splatRenderCount: this.readRenderedSplatCount(),
      lastSortTime: typeof internalViewer?.lastSortTime === 'number' ? internalViewer.lastSortTime : null,
    };
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls?.dispose();
    this.viewer?.dispose?.();
  }

  private toSceneFormat(formatId: SceneFormatId): GaussianSplats3D.SceneFormat {
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
      updateOrbitControls(this.controls, this.navigationMode);
      this.viewer?.update();
      this.applyRenderBudgetToFrame();
      this.syncCameraProjection();
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

  private readRenderedSplatCount(): number {
    return this.renderedSplatCount;
  }

  private applyRenderBudgetToFrame(): void {
    const availableCount = this.readAvailableRenderedSplatCount();
    const renderCount = this.renderBudget === null ? availableCount : Math.min(availableCount, this.renderBudget);
    const splatMesh = this.viewer?.getSplatMesh() as (GaussianSplats3D.SplatMesh & {
      geometry?: {
        attributes?: {
          splatIndex?: {
            array?: ArrayLike<number> & { copyWithin?: (target: number, start: number, end?: number) => void };
            needsUpdate?: boolean;
            updateRange?: { count: number; offset: number };
          };
        };
        instanceCount?: number;
        setDrawRange?: (start: number, count: number) => void;
      };
    }) | null;

    if (splatMesh?.geometry) {
      const splatIndexAttribute = splatMesh.geometry.attributes?.splatIndex;
      const splatIndexes = splatIndexAttribute?.array;
      if (
        renderCount > 0 &&
        renderCount < availableCount &&
        typeof splatIndexes?.copyWithin === 'function'
      ) {
        splatIndexes.copyWithin(0, availableCount - renderCount, availableCount);
        if (splatIndexAttribute) {
          splatIndexAttribute.needsUpdate = true;
          if (splatIndexAttribute.updateRange) {
            splatIndexAttribute.updateRange.offset = 0;
            splatIndexAttribute.updateRange.count = renderCount;
          }
        }
      }
      if (typeof splatMesh.geometry.instanceCount === 'number') {
        splatMesh.geometry.instanceCount = renderCount;
      }
      splatMesh.geometry.setDrawRange?.(0, renderCount);
    }

    this.renderedSplatCount = renderCount;
  }

  private readAvailableRenderedSplatCount(): number {
    const internalViewer = this.viewer as (GaussianSplats3D.Viewer & {
      splatRenderCount?: number;
    }) | null;
    return internalViewer?.splatRenderCount ?? this.readSplatCount();
  }

  private computeSceneBounds(): void {
    if (!this.viewer) {
      return;
    }

    try {
      const splatMesh = this.viewer.getSplatMesh();
      const robustBox = computeRobustSceneBounds(splatMesh);
      if (robustBox && this.isFiniteBox(robustBox)) {
        this.sceneBounds.copy(robustBox);
        return;
      }

      const rawBox = splatMesh.computeBoundingBox(true);
      if (this.isFiniteBox(rawBox)) {
        this.sceneBounds.copy(rawBox);
      }
    } catch {
      this.sceneBounds.makeEmpty();
    }
  }

  private resetSceneState(): void {
    this.sceneLoaded = false;
    this.splatCount = 0;
    this.renderedSplatCount = 0;
    this.sceneBounds.makeEmpty();
    this.initialPosition.set(0, 0, 0);
    this.initialTarget.set(0, 0, 0);
    this.initialUp.set(0, 1, 0);
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
    if (!this.camera || !this.controls) {
      return;
    }

    this.initialPosition.copy(this.camera.position);
    this.initialTarget.copy(this.controls.target);
    this.initialUp.copy(this.camera.up);
    this.initialQuaternion.copy(this.camera.quaternion);
    this.initialFov = this.camera.fov;
  }

  private syncCameraProjection(forceProjectionUpdate = false): void {
    if (!this.camera) {
      return;
    }

    const frustumChanged = this.hasUsableSceneBounds()
      ? applyAdaptiveCameraFrustum(this.camera, this.sceneBounds)
      : false;

    if (forceProjectionUpdate || frustumChanged) {
      this.camera.updateProjectionMatrix();
    }
  }

  private hasUsableSceneBounds(): boolean {
    return !this.sceneBounds.isEmpty() && this.isFiniteBox(this.sceneBounds);
  }

  private isFiniteBox(box: THREE.Box3): boolean {
    return [box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Viewer capture produced an empty frame.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}
