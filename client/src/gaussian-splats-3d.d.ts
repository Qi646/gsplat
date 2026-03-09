declare module '@mkkellogg/gaussian-splats-3d' {
  import * as THREE from 'three';

  export interface ViewerOptions {
    rootElement?: HTMLElement;
    initialCameraPosition?: [number, number, number];
    initialCameraLookAt?: [number, number, number];
    selfDrivenMode?: boolean;
    gpuAcceleratedSort?: boolean;
    sharedMemoryForWorkers?: boolean;
    enableSIMDInSort?: boolean;
    integerBasedSort?: boolean;
    splatSortDistanceMapPrecision?: number;
  }

  export interface AddSplatSceneOptions {
    format: SceneFormat;
    position?: [number, number, number];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    showLoadingUI?: boolean;
    onProgress?: (percent: number, progressLabel: string, stage: number) => void;
  }

  export enum SceneFormat {
    Ply,
    Splat,
    KSplat,
  }

  export interface SplatMesh {
    getSplatCount(): number;
    getSplatCenter(globalIndex: number, outCenter: THREE.Vector3, applySceneTransform?: boolean): void;
    getSplatColor(globalIndex: number, outColor: THREE.Vector4): void;
    computeBoundingBox(applySceneTransforms?: boolean, sceneIndex?: number): THREE.Box3;
  }

  export interface ParsedSplatArray {
    splatCount: number;
    splats: number[][];
  }

  export class PlyParser {
    static parseToUncompressedSplatArray(buffer: ArrayBuffer): ParsedSplatArray;
  }

  export class Viewer {
    constructor(options: ViewerOptions);
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls?: {
      enabled?: boolean;
      target?: THREE.Vector3;
      update?: () => void;
    };
    init(): Promise<void>;
    addSplatScene(url: string, options: AddSplatSceneOptions): Promise<void>;
    getSplatMesh(): SplatMesh;
    getSceneCount(): number;
    removeSplatScene(index: number, showLoadingUI?: boolean): Promise<void>;
    removeSplatScenes(indexes: number[], showLoadingUI?: boolean): Promise<void>;
    update(): void;
    render(): void;
    dispose(): void;
  }
}
