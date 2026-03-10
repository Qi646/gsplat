import * as Spark from '@sparkjsdev/spark';
import * as THREE from 'three';
import {
  computeFramedSceneBoundsFromSortedSamples,
  DEFAULT_ROBUST_SCENE_BOUNDS_OPTIONS,
  type RobustSceneBoundsOptions,
} from '../lib/robustSceneBounds';
import { findScenePresetByUrl } from '../lib/scenePresets';
import { detectSceneFormat } from '../lib/sceneFormat';
import type { InterpolatedPose, SceneView, ViewerDebugSnapshot } from '../types';
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
import type { ViewerAdapter, ViewerAdapterOptions } from './ViewerAdapter';

const SPARK_VIEW_OPTIONS = {
  sort32: true,
  sortRadial: false,
  stochastic: false,
} as const;

export class SparkSceneViewer implements ViewerAdapter {
  private readonly hostElement: HTMLElement;
  private readonly events: ViewerAdapterOptions['events'];
  private scene: THREE.Scene | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private controls: ViewerCameraControls | null = null;
  private sparkRenderer: Spark.SparkRenderer | null = null;
  private splatMesh: Spark.SplatMesh | null = null;
  private readonly sceneBounds = new THREE.Box3();
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

  constructor(options: ViewerAdapterOptions) {
    this.hostElement = options.hostElement;
    this.events = options.events;
  }

  async init(): Promise<void> {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.sparkRenderer = new Spark.SparkRenderer({
      renderer: this.renderer,
      view: { ...SPARK_VIEW_OPTIONS },
    });
    this.scene.add(this.sparkRenderer);

    this.hostElement.replaceChildren(this.renderer.domElement);

    this.controls = createViewerOrbitControls(this.camera, this.renderer.domElement);

    this.resize(this.hostElement.clientWidth, this.hostElement.clientHeight);
    this.startRenderLoop();
  }

  async loadScene(url: string): Promise<void> {
    if (!this.scene) {
      throw new Error('Viewer not initialized');
    }

    this.resetSceneState();
    this.events.emit('scene:progress', { percent: 0, message: 'Starting download…' });

    try {
      this.removeExistingScene();

      const loader = new Spark.SplatLoader();
      loader.fileType = this.toSparkFileType(detectSceneFormat(url));

      const packedSplats = await loader.loadAsync(url, event => {
        this.events.emit('scene:progress', formatSparkLoadProgress(event));
      });

      this.events.emit('scene:progress', { percent: 0, message: 'Processing scene…' });

      const splatMesh = loader.parse(packedSplats);
      splatMesh.updateMatrixWorld(true);
      await splatMesh.initialized;

      this.scene.add(splatMesh);
      this.splatMesh = splatMesh;

      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      this.splatCount = this.readSplatCount();
      if (this.splatCount <= 0) {
        throw new Error('Loaded scene contains no splats.');
      }

      const preset = findScenePresetByUrl(url);
      if (preset?.sceneRotation) {
        this.applySceneRotation(
          new THREE.Quaternion(
            preset.sceneRotation.x,
            preset.sceneRotation.y,
            preset.sceneRotation.z,
            preset.sceneRotation.w,
          ),
        );
      }

      this.computeSceneBounds();
      if (!this.hasUsableSceneBounds()) {
        throw new Error('Loaded scene bounds are invalid.');
      }

      if (!(preset?.defaultView ? this.applySceneView(preset.defaultView) : this.frameScene())) {
        throw new Error('Loaded scene could not be framed.');
      }

      this.saveInitialCamera();
      this.sceneLoaded = true;

      this.events.emit('scene:loaded', {
        splatCount: this.splatCount,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown load error';
      this.removeExistingScene();
      this.resetSceneState();
      this.events.emit('scene:error', { message });
      throw error;
    }
  }

  resize(width: number, height: number): void {
    if (!this.renderer || !this.camera) {
      return;
    }

    const safeWidth = Math.max(width, 1);
    const safeHeight = Math.max(height, 1);

    this.renderer.setSize(safeWidth, safeHeight, false);
    this.camera.aspect = safeWidth / safeHeight;
    resizeViewerOrbitControls(this.controls);
    this.syncCameraProjection(true);
  }

  setFrameHook(frameHook: (() => void) | null): void {
    this.frameHook = frameHook;
  }

  setNavigationMode(mode: 'orbit' | 'walk'): void {
    this.navigationMode = mode;
    setOrbitControlsNavigationMode(this.controls, mode);
  }

  resumeOrbitFromCamera(distance?: number): void {
    if (!this.camera || !this.controls) {
      return;
    }

    this.navigationMode = 'orbit';
    resumeOrbitControlsFromCamera(this.camera, this.controls, distance);
  }

  renderNow(): void {
    this.frameHook?.();
    updateOrbitControls(this.controls, this.navigationMode);
    this.syncCameraProjection();
    if (this.scene && this.camera) {
      this.renderer?.render(this.scene, this.camera);
    }
  }

  async captureFrame(): Promise<Blob> {
    const surface = this.getInteractionSurface();
    if (!surface) {
      throw new Error('Viewer capture surface is unavailable.');
    }

    return canvasToBlob(surface);
  }

  frameScene(): boolean {
    if (!this.camera || !this.controls || !this.hasUsableSceneBounds()) {
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
    this.camera.up.set(0, 1, 0);
    this.controls.target.copy(center);
    this.syncCameraProjection(true);
    this.controls.update();
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
    this.syncCameraProjection(true);
    this.controls.target.copy(this.initialTarget);
    this.controls.update();
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
    this.controls.update();
  }

  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  getSceneRotation(): THREE.Quaternion | null {
    return this.splatMesh?.quaternion.clone() ?? null;
  }

  getSceneBounds(): THREE.Box3 | null {
    if (!this.sceneLoaded || !this.hasUsableSceneBounds()) {
      return null;
    }

    return this.sceneBounds.clone();
  }

  getInteractionSurface(): HTMLCanvasElement | null {
    return this.renderer?.domElement ?? null;
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

  setSceneRotation(rotation: THREE.Quaternion): void {
    if (!this.applySceneRotation(rotation)) {
      return;
    }

    this.computeSceneBounds();
    if (this.hasUsableSceneBounds() && this.frameScene()) {
      this.saveInitialCamera();
    } else {
      this.syncCameraProjection(true);
    }
  }

  getCompatibilityStatusMessage(): string | null {
    return null;
  }

  getRendererId(): 'spark' {
    return 'spark';
  }

  getDebugSnapshot(): ViewerDebugSnapshot {
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
        compatibilityMode: false,
        compatibilityStatusMessage: null,
        viewerOptions: null,
      },
      sceneCount: this.splatMesh ? 1 : 0,
      sceneLoaded: this.sceneLoaded,
      splatCount: this.readSplatCount(),
      splatRenderCount: this.readSplatCount(),
      lastSortTime: null,
    };
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.removeExistingScene();
    this.controls?.dispose();
    this.renderer?.dispose();
  }

  private toSparkFileType(formatId: ReturnType<typeof detectSceneFormat>): Spark.SplatFileType {
    if (formatId === 'splat') {
      return Spark.SplatFileType.SPLAT;
    }

    if (formatId === 'ksplat') {
      return Spark.SplatFileType.KSPLAT;
    }

    return Spark.SplatFileType.PLY;
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
      this.syncCameraProjection();
      if (this.scene && this.camera) {
        this.renderer?.render(this.scene, this.camera);
      }
      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private readSplatCount(): number {
    return this.splatMesh?.packedSplats?.numSplats ?? this.splatCount;
  }

  private computeSceneBounds(): void {
    if (!this.splatMesh) {
      return;
    }

    try {
      const robustBox = computeSparkSceneBounds(this.splatMesh);
      if (robustBox && this.isFiniteBox(robustBox)) {
        this.sceneBounds.copy(robustBox);
        return;
      }

      const rawBox = this.splatMesh.getBoundingBox(true).clone().applyMatrix4(this.splatMesh.matrixWorld);
      if (this.isFiniteBox(rawBox)) {
        this.sceneBounds.copy(rawBox);
        return;
      }
    } catch {
      // Fall through to the empty-bounds path below.
    }

    this.sceneBounds.makeEmpty();
  }

  private applySceneRotation(rotation: THREE.Quaternion): boolean {
    if (!this.splatMesh) {
      return false;
    }

    this.splatMesh.quaternion.copy(rotation).normalize();
    this.splatMesh.updateMatrixWorld(true);
    return true;
  }

  private applySceneView(view: SceneView): boolean {
    if (!this.camera || !this.controls) {
      return false;
    }

    this.camera.position.set(view.position.x, view.position.y, view.position.z);
    this.camera.up.set(view.up?.x ?? 0, view.up?.y ?? 1, view.up?.z ?? 0);
    this.controls.target.set(view.target.x, view.target.y, view.target.z);
    this.camera.fov = view.fov;
    this.camera.lookAt(this.controls.target);
    this.syncCameraProjection(true);
    this.controls.update();
    return true;
  }

  private resetSceneState(): void {
    this.sceneLoaded = false;
    this.splatCount = 0;
    this.sceneBounds.makeEmpty();
    this.initialPosition.set(0, 0, 0);
    this.initialTarget.set(0, 0, 0);
    this.initialUp.set(0, 1, 0);
    this.initialQuaternion.identity();
    this.initialFov = 60;
  }

  private removeExistingScene(): void {
    if (!this.scene || !this.splatMesh) {
      return;
    }

    this.scene.remove(this.splatMesh);
    this.splatMesh.dispose();
    this.splatMesh = null;
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

function formatSparkLoadProgress(event: ProgressEvent): { message: string; percent: number } {
  if (!event.lengthComputable || event.total <= 0) {
    return {
      percent: 0,
      message: 'Downloading scene…',
    };
  }

  const percent = THREE.MathUtils.clamp((event.loaded / event.total) * 100, 0, 100);
  return {
    percent,
    message: `Downloading scene… ${percent.toFixed(1)}%`,
  };
}

function computeSparkSceneBounds(
  splatMesh: Spark.SplatMesh,
  options: Partial<RobustSceneBoundsOptions> = {},
): THREE.Box3 | null {
  const resolvedOptions = {
    ...DEFAULT_ROBUST_SCENE_BOUNDS_OPTIONS,
    ...options,
  };
  const splatCount = splatMesh.packedSplats.numSplats;
  if (splatCount <= 0) {
    return null;
  }

  const sampleStride = Math.max(1, Math.ceil(splatCount / resolvedOptions.maxSamples));
  const center = new THREE.Vector3();
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];

  splatMesh.forEachSplat((index, splatCenter, _scales, _quaternion, opacity) => {
    if (index % sampleStride !== 0 || xs.length >= resolvedOptions.maxSamples) {
      return;
    }

    if (!Number.isFinite(opacity) || opacity * 255 < resolvedOptions.minimumAlpha) {
      return;
    }

    center.copy(splatCenter).applyMatrix4(splatMesh.matrixWorld);
    if (![center.x, center.y, center.z].every(Number.isFinite)) {
      return;
    }

    xs.push(center.x);
    ys.push(center.y);
    zs.push(center.z);
  });

  xs.sort((left, right) => left - right);
  ys.sort((left, right) => left - right);
  zs.sort((left, right) => left - right);

  return computeFramedSceneBoundsFromSortedSamples(xs, ys, zs, resolvedOptions);
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
