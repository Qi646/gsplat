import type { ScenePreset } from '../types';

export const SCENE_PRESETS: ScenePreset[] = [
  {
    name: 'Truck',
    url: 'https://huggingface.co/cakewalk/splat-data/resolve/main/truck.splat',
    sizeMB: 78,
    description: 'Vehicle scene with dense detail for preset smoke tests.',
  },
  {
    name: 'Garden',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/garden/garden-7k.splat',
    sizeMB: 134,
    description: 'Outdoor scene with broad traversal and foliage coverage.',
  },
  {
    name: 'Room',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/room/room-7k.splat',
    sizeMB: 34,
    description: 'Indoor room scan for navigation and framing checks.',
  },
  {
    name: 'Train',
    url: 'https://huggingface.co/cakewalk/splat-data/resolve/main/train.splat',
    sizeMB: 31,
    description: 'Compact vehicle scene with moderate load time.',
  },
];
