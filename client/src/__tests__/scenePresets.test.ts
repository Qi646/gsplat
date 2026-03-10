import { describe, expect, it } from 'vitest';
import { SCENE_PRESETS } from '../lib/scenePresets';
import { detectSceneFormat } from '../lib/sceneFormat';

describe('SCENE_PRESETS', () => {
  it('defines unique presets with complete metadata', () => {
    const urls = new Set<string>();

    for (const preset of SCENE_PRESETS) {
      expect(preset.name.trim().length).toBeGreaterThan(0);
      expect(preset.url.trim().length).toBeGreaterThan(0);
      expect(preset.description.trim().length).toBeGreaterThan(0);
      expect(preset.sizeMB).toBeGreaterThan(0);
      expect(preset.sceneRotation).toBeDefined();
      expect(preset.defaultView).toBeDefined();
      expect(urls.has(preset.url)).toBe(false);
      urls.add(preset.url);
    }
  });

  it('uses supported scene formats for every preset URL', () => {
    for (const preset of SCENE_PRESETS) {
      expect(['ply', 'splat', 'ksplat']).toContain(detectSceneFormat(preset.url));
    }
  });

  it('uses the verified same-origin preset routes for cached ply and ksplat assets', () => {
    expect(SCENE_PRESETS.map(preset => preset.name)).toEqual(['Luigi', 'Garden', 'Stump', 'Truck']);
    expect(SCENE_PRESETS.map(preset => preset.url)).toEqual([
      '/api/presets/luigi.ply',
      '/api/presets/garden.ksplat',
      '/api/presets/stump.ksplat',
      '/api/presets/truck.ksplat',
    ]);
    expect(detectSceneFormat(SCENE_PRESETS[0]!.url)).toBe('ply');
  });

  it('stores upright calibration for the large ksplat demo presets', () => {
    expect(SCENE_PRESETS.find(preset => preset.name === 'Luigi')?.sceneRotation).toEqual({
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    });
    expect(SCENE_PRESETS.filter(preset => preset.name !== 'Luigi').map(preset => preset.sceneRotation)).toEqual([
      { x: 1, y: 0, z: 0, w: 0 },
      { x: 1, y: 0, z: 0, w: 0 },
      { x: 1, y: 0, z: 0, w: 0 },
    ]);
  });
});
