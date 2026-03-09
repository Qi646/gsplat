import { describe, expect, it } from 'vitest';
import { detectSceneFormat } from '../lib/sceneFormat';

describe('detectSceneFormat', () => {
  it('defaults to ply for .ply URLs and unknown extensions', () => {
    expect(detectSceneFormat('https://example.com/scene.ply')).toBe('ply');
    expect(detectSceneFormat('https://example.com/scene')).toBe('ply');
  });

  it('recognizes .splat URLs regardless of case', () => {
    expect(detectSceneFormat('https://example.com/SCENE.SPLAT')).toBe('splat');
  });

  it('ignores query strings and fragments when detecting .ksplat', () => {
    expect(detectSceneFormat('https://example.com/scene.ksplat?download=1#view')).toBe('ksplat');
  });
});
