import type { ViewerMode } from '../viewer/viewerRuntime';

export interface AppRuntimeQuery {
  autoSceneUrl: string | null;
  e2eEnabled: boolean;
  viewerMode: ViewerMode;
}

export function parseAppRuntimeQuery(search: string): AppRuntimeQuery {
  const params = new URLSearchParams(search);
  const rawScene = params.get('scene');
  const rawViewerMode = params.get('viewerMode');

  return {
    autoSceneUrl: rawScene && rawScene.trim() ? rawScene.trim() : null,
    e2eEnabled: params.get('e2e') === '1',
    viewerMode: rawViewerMode === 'compat' ? 'compat' : 'default',
  };
}
