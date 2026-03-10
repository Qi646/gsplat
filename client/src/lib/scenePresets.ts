import type { ScenePreset } from '../types';

export const SCENE_PRESETS: ScenePreset[] = [
  {
    name: 'Luigi',
    url: '/api/presets/luigi.ply',
    sizeMB: 1,
    description: 'Lightweight `.ply` object preset cached through the app for fast smoke checks.',
  },
  {
    name: 'Garden',
    url: '/api/presets/garden.ksplat',
    sizeMB: 70,
    description: 'Verified outdoor scene served from the app preset cache.',
  },
  {
    name: 'Stump',
    url: '/api/presets/stump.ksplat',
    sizeMB: 68,
    description: 'Verified garden stump scene with stable framing and detail.',
  },
  {
    name: 'Truck',
    url: '/api/presets/truck.ksplat',
    sizeMB: 27,
    description: 'Verified vehicle scene from the upstream demo archive.',
  },
];
