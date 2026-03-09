import * as THREE from 'three';

// ─── Scene ───────────────────────────────────────────────────────────────────

export interface ScenePreset {
  name: string;
  url: string;
  sizeMB: number;
  description: string;
}

export const SCENE_PRESETS: ScenePreset[] = [
  {
    name: 'Truck',
    url: 'https://huggingface.co/cakewalk/splat-data/resolve/main/nike.splat',
    sizeMB: 8,
    description: 'Object scan',
  },
  {
    name: 'Garden',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/garden/point_cloud/iteration_30000/point_cloud.ply',
    sizeMB: 180,
    description: 'Outdoor scene',
  },
  {
    name: 'Room',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/room/point_cloud/iteration_30000/point_cloud.ply',
    sizeMB: 120,
    description: 'Indoor scene',
  },
  {
    name: 'Train',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/train/point_cloud/iteration_30000/point_cloud.ply',
    sizeMB: 65,
    description: 'Object scan',
  },
];

// ─── Camera path ─────────────────────────────────────────────────────────────

export interface Keyframe {
  id: string;
  time: number;          // seconds from path start
  position: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number };
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

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportResolution = '854x480' | '1280x720' | '1920x1080';
export type ExportQuality = 'draft' | 'med' | 'high';

export interface ExportSettings {
  resolution: ExportResolution;
  fps: number;
  duration: number;
  quality: ExportQuality;
}

export interface ExportStartRequest {
  width: number;
  height: number;
  fps: number;
  frameCount: number;
  quality: ExportQuality;
}

export interface ExportFrameRequest {
  sessionId: string;
  frameIndex: number;
  data: string;          // base64 PNG
}

export interface ExportSession {
  id: string;
  totalFrames: number;
  framesReceived: number;
  outputPath: string;
  status: 'running' | 'complete' | 'cancelled' | 'error';
  error?: string;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type AppEventMap = {
  'scene:loaded': { splatCount: number; bounds: THREE.Box3 };
  'scene:progress': { percent: number; message: string };
  'scene:error': { message: string };
  'keyframe:added': { keyframe: Keyframe };
  'keyframe:deleted': { id: string };
  'keyframe:reordered': { keyframes: Keyframe[] };
  'path:preview:start': void;
  'path:preview:stop': void;
  'export:start': ExportSettings;
  'export:progress': { frame: number; total: number };
  'export:complete': { downloadUrl: string };
  'export:cancelled': void;
  'export:error': { message: string };
};

export class AppEvents extends EventTarget {
  emit<K extends keyof AppEventMap>(type: K, detail: AppEventMap[K]): void {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  on<K extends keyof AppEventMap>(
    type: K,
    handler: (detail: AppEventMap[K]) => void
  ): () => void {
    const listener = (e: Event) => handler((e as CustomEvent).detail);
    this.addEventListener(type, listener);
    return () => this.removeEventListener(type, listener);
  }
}
