declare module '@mkkellogg/gaussian-splats-3d' {
  import * as THREE from 'three';

  export interface ViewerOptions {
    canvas: HTMLCanvasElement;
    initialCameraPosition?: [number, number, number];
    initialCameraLookAt?: [number, number, number];
    selfDrivenMode?: boolean;
    useWorkers?: boolean;
    workerConfig?: {
      crossOriginIsolated?: boolean;
    };
  }

  export interface AddSplatSceneOptions {
    format: SceneFormat;
    onProgress?: (percent: number, message: string, stage: unknown) => void;
  }

  export enum SceneFormat {
    Ply,
    Splat,
    KSplat,
  }

  export class Viewer {
    constructor(options: ViewerOptions);
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls?: {
      target?: THREE.Vector3;
      update?: () => void;
    };
    splatMesh?: {
      getSplatCount?: () => number;
    };
    init(): Promise<void>;
    addSplatScene(url: string, options: AddSplatSceneOptions): Promise<void>;
    update(): void;
    render(): void;
    dispose?(): void;
  }
}
