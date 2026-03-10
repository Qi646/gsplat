import { describe, expect, it } from 'vitest';
import { resolveSceneLoadSource } from '../lib/sceneSource';

describe('resolveSceneLoadSource', () => {
  it('infers the format from plain URL strings', () => {
    expect(resolveSceneLoadSource('https://example.com/scene.ksplat')).toEqual({
      url: 'https://example.com/scene.ksplat',
      format: 'ksplat',
    });
  });

  it('keeps explicit formats for blob-backed local files', () => {
    expect(
      resolveSceneLoadSource({
        url: 'blob:https://example.com/local-scene',
        format: 'splat',
      }),
    ).toEqual({
      url: 'blob:https://example.com/local-scene',
      format: 'splat',
    });
  });
});
