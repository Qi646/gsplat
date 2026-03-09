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
      expect(urls.has(preset.url)).toBe(false);
      urls.add(preset.url);
    }
  });

  it('uses supported scene formats for every preset URL', () => {
    for (const preset of SCENE_PRESETS) {
      expect(['ply', 'splat', 'ksplat']).toContain(detectSceneFormat(preset.url));
    }
  });

  it('uses the verified same-origin ksplat preset routes', () => {
    expect(SCENE_PRESETS.map(preset => preset.name)).toEqual(['Garden', 'Stump', 'Truck']);
    expect(SCENE_PRESETS.map(preset => preset.url)).toEqual([
      '/api/presets/garden.ksplat',
      '/api/presets/stump.ksplat',
      '/api/presets/truck.ksplat',
    ]);
  });
});
