import type { ScenePreset } from '../types';

export const SCENE_PRESETS: ScenePreset[] = [
  {
    name: 'Truck',
    url: 'https://huggingface.co/cakewalk/splat-data/resolve/main/nike.splat',
    sizeMB: 8,
    description: 'Small object scan for quick validation.',
  },
  {
    name: 'Garden',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/garden/point_cloud/iteration_30000/point_cloud.ply',
    sizeMB: 180,
    description: 'Outdoor scene with broad camera movement.',
  },
  {
    name: 'Room',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/room/point_cloud/iteration_30000/point_cloud.ply',
    sizeMB: 120,
    description: 'Indoor scene for navigation and framing checks.',
  },
  {
    name: 'Train',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/train/point_cloud/iteration_30000/point_cloud.ply',
    sizeMB: 65,
    description: 'Compact object scene with moderate load time.',
  },
];
