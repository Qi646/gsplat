export interface ScenePreset {
  name: string;
  url: string;
  sizeMB: number;
  description: string;
}

export type AppEventMap = {
  'scene:loaded': { splatCount: number };
  'scene:progress': { percent: number; message: string };
  'scene:error': { message: string };
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
