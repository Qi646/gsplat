import type { ViewerRendererId } from '../types';
import type { ViewerMode } from '../viewer/viewerRuntime';

export interface AppRuntimeQuery {
  autoSceneUrl: string | null;
  e2eEnabled: boolean;
  renderer: ViewerRendererId;
  viewerMode: ViewerMode;
}

export function parseAppRuntimeQuery(search: string): AppRuntimeQuery {
  const params = new URLSearchParams(search);
  const rawRenderer = params.get('renderer');
  const rawScene = params.get('scene');
  const rawViewerMode = params.get('viewerMode');

  return {
    autoSceneUrl: rawScene && rawScene.trim() ? rawScene.trim() : null,
    e2eEnabled: params.get('e2e') === '1',
    renderer: rawRenderer === 'spark' ? 'spark' : 'mkkellogg',
    viewerMode: rawViewerMode === 'default' ? 'default' : 'compat',
  };
}
