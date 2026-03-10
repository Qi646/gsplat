import { detectSceneFormat, type SceneFormatId } from './sceneFormat';

export interface SceneLoadSource {
  url: string;
  format?: SceneFormatId;
}

export type SceneLoadInput = string | SceneLoadSource;

export interface ResolvedSceneLoadSource {
  url: string;
  format: SceneFormatId;
}

export function resolveSceneLoadSource(source: SceneLoadInput): ResolvedSceneLoadSource {
  if (typeof source === 'string') {
    return {
      url: source,
      format: detectSceneFormat(source),
    };
  }

  return {
    url: source.url,
    format: source.format ?? detectSceneFormat(source.url),
  };
}
