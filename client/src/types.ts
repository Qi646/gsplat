import * as THREE from 'three';

export interface ScenePreset {
  name: string;
  url: string;
  sizeMB: number;
  description: string;
}

export interface SerializableVector3 {
  x: number;
  y: number;
  z: number;
}

export interface SerializableQuaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Keyframe {
  id: string;
  time: number;
  position: SerializableVector3;
  quaternion: SerializableQuaternion;
  fov: number;
}

export interface CameraPath {
  version: 1;
  keyframes: Keyframe[];
  totalDuration: number;
  createdAt: string;
}

export interface InterpolatedPose {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  fov: number;
}

export interface ViewerDebugSnapshot {
  canvasSize: {
    width: number;
    height: number;
    clientWidth: number;
    clientHeight: number;
  };
  rendererInfo: {
    renderer: string | null;
    shadingLanguageVersion: string | null;
    vendor: string | null;
    version: string | null;
  };
  runtime: {
    compatibilityMode: boolean;
    compatibilityStatusMessage: string | null;
    viewerOptions: {
      gpuAcceleratedSort: boolean;
      sharedMemoryForWorkers: boolean;
    };
  };
  sceneCount: number;
  sceneLoaded: boolean;
  splatCount: number;
  splatRenderCount: number;
  lastSortTime: number | null;
}

export type AppEventMap = {
  'scene:loaded': { splatCount: number };
  'scene:progress': { percent: number; message: string };
  'scene:error': { message: string };
  'keyframe:added': { keyframe: Keyframe };
  'keyframe:deleted': { id: string };
  'keyframe:reordered': { keyframes: Keyframe[] };
  'path:preview:start': void;
  'path:preview:stop': void;
  'path:seek': { time: number; duration: number };
};

export class AppEvents extends EventTarget {
  emit<K extends keyof AppEventMap>(type: K, detail: AppEventMap[K]): void {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  on<K extends keyof AppEventMap>(
    type: K,
    handler: (detail: AppEventMap[K]) => void
  ): () => void {
    const listener = (event: Event) => handler((event as CustomEvent).detail);
    this.addEventListener(type, listener);
    return () => this.removeEventListener(type, listener);
  }
}

declare global {
  interface Window {
    __GSPLAT_DEBUG__?: {
      snapshot: () => ViewerDebugSnapshot;
    };
  }
}
