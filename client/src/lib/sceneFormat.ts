export type SceneFormatId = 'ply' | 'splat' | 'ksplat';

export function detectSceneFormat(url: string): SceneFormatId {
  const normalizedUrl = url.split(/[?#]/, 1)[0]?.toLowerCase() ?? '';

  if (normalizedUrl.endsWith('.ksplat')) {
    return 'ksplat';
  }

  if (normalizedUrl.endsWith('.splat')) {
    return 'splat';
  }

  return 'ply';
}
