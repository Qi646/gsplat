import type { ScenePreset } from '../types';

const IDENTITY_ROTATION = { x: 0, y: 0, z: 0, w: 1 } as const;
const HALF_TURN_X_ROTATION = { x: 1, y: 0, z: 0, w: 0 } as const;

export const SCENE_PRESETS: ScenePreset[] = [
  {
    name: 'Luigi',
    url: '/api/presets/luigi.ply',
    sizeMB: 1,
    description: 'Lightweight `.ply` object preset cached through the app for fast smoke checks.',
    sceneRotation: IDENTITY_ROTATION,
    defaultView: {
      position: { x: 0.004, y: 0.235, z: 1.86 },
      target: { x: 0.004, y: -0.013, z: 0 },
      fov: 60,
    },
  },
  {
    name: 'Garden',
    url: '/api/presets/garden.ksplat',
    sizeMB: 70,
    description: 'Verified outdoor scene served from the app preset cache.',
    sceneRotation: HALF_TURN_X_ROTATION,
    defaultView: {
      position: { x: 0.47, y: 8.778, z: 40.393 },
      target: { x: 0.47, y: 3.18, z: -1.623 },
      fov: 60,
    },
  },
  {
    name: 'Stump',
    url: '/api/presets/stump.ksplat',
    sizeMB: 68,
    description: 'Verified garden stump scene with stable framing and detail.',
    sceneRotation: HALF_TURN_X_ROTATION,
    defaultView: {
      position: { x: -8.814, y: 46.804, z: 182.199 },
      target: { x: -8.814, y: 23.949, z: 10.659 },
      fov: 60,
    },
  },
  {
    name: 'Truck',
    url: '/api/presets/truck.ksplat',
    sizeMB: 27,
    description: 'Verified vehicle scene from the upstream demo archive.',
    sceneRotation: HALF_TURN_X_ROTATION,
    defaultView: {
      position: { x: -6.912, y: 14.029, z: 77.272 },
      target: { x: -6.912, y: 4.222, z: 3.67 },
      fov: 60,
    },
  },
];

export function findScenePresetByUrl(url: string): ScenePreset | null {
  return SCENE_PRESETS.find(preset => preset.url === url) ?? null;
}
