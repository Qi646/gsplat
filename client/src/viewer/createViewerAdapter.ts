import type { ViewerRendererId } from '../types';
import { SceneViewer } from './SceneViewer';
import { SparkSceneViewer } from './SparkSceneViewer';
import type { ViewerAdapter, ViewerAdapterOptions } from './ViewerAdapter';

export function createViewerAdapter(
  rendererId: ViewerRendererId,
  options: ViewerAdapterOptions,
): ViewerAdapter {
  if (rendererId === 'spark') {
    return new SparkSceneViewer(options);
  }

  return new SceneViewer(options);
}
