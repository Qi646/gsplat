import * as THREE from 'three';
import type { AppEvents, InterpolatedPose, ViewerDebugSnapshot, ViewerRendererId } from '../types';
import type { ViewerRuntimeOverrides } from './viewerRuntime';

export interface ViewerAdapterOptions {
  hostElement: HTMLElement;
  events: AppEvents;
  runtimeOverrides?: ViewerRuntimeOverrides;
}

export interface ViewerAdapter {
  init(): Promise<void>;
  loadScene(url: string): Promise<void>;
  resize(width: number, height: number): void;
  setFrameHook(frameHook: (() => void) | null): void;
  setNavigationMode(mode: 'orbit' | 'walk'): void;
  resumeOrbitFromCamera(distance?: number): void;
  renderNow(): void;
  captureFrame(): Promise<Blob>;
  frameScene(): boolean;
  resetView(): void;
  applyCameraPose(pose: InterpolatedPose): void;
  getCamera(): THREE.PerspectiveCamera | null;
  getInteractionSurface(): HTMLCanvasElement | null;
  getFPS(): number;
  getSplatCount(): number;
  isSceneLoaded(): boolean;
  getCompatibilityStatusMessage(): string | null;
  getRendererId(): ViewerRendererId;
  getDebugSnapshot(): ViewerDebugSnapshot;
  dispose(): void;
}
