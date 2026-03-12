import * as THREE from 'three';
import type { SceneLoadInput } from '../lib/sceneSource';
import type { AppEvents, InterpolatedPose, ScenePointSample, ViewerDebugSnapshot, ViewerRendererId } from '../types';
import type { ViewerRuntimeOverrides } from './viewerRuntime';

export interface ViewerAdapterOptions {
  hostElement: HTMLElement;
  events: AppEvents;
  runtimeOverrides?: ViewerRuntimeOverrides;
}

export interface ViewerAdapter {
  init(): Promise<void>;
  loadScene(source: SceneLoadInput): Promise<void>;
  resize(width: number, height: number): void;
  setFrameHook(frameHook: (() => void) | null): void;
  setRenderBudget(maxRenderCount: number | null): void;
  getRenderBudget(): number | null;
  setNavigationMode(mode: 'orbit' | 'walk'): void;
  resumeOrbitFromCamera(distance?: number): void;
  renderNow(): void;
  captureFrame(): Promise<Blob>;
  sampleScenePoints(maxSamples?: number): ScenePointSample[];
  frameScene(): boolean;
  resetView(): void;
  applyCameraPose(pose: InterpolatedPose): void;
  getCamera(): THREE.PerspectiveCamera | null;
  getSceneBounds(): THREE.Box3 | null;
  getInteractionSurface(): HTMLCanvasElement | null;
  getFPS(): number;
  getSplatCount(): number;
  getRenderedSplatCount(): number;
  isSceneLoaded(): boolean;
  getCompatibilityStatusMessage(): string | null;
  getRendererId(): ViewerRendererId;
  getDebugSnapshot(): ViewerDebugSnapshot;
  dispose(): void;
}
