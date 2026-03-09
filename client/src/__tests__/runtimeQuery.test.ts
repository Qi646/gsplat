import { describe, expect, it } from 'vitest';
import { parseAppRuntimeQuery } from '../lib/runtimeQuery';

describe('parseAppRuntimeQuery', () => {
  it('returns defaults when no query parameters are provided', () => {
    expect(parseAppRuntimeQuery('')).toEqual({
      autoSceneUrl: null,
      e2eEnabled: false,
      renderer: 'mkkellogg',
      viewerMode: null,
    });
  });

  it('reads the e2e flag, renderer, scene URL, and compatibility mode from the query string', () => {
    expect(
      parseAppRuntimeQuery('?e2e=1&renderer=spark&scene=%2Ftest-assets%2Fsmoke-grid.ply&viewerMode=compat'),
    ).toEqual({
      autoSceneUrl: '/test-assets/smoke-grid.ply',
      e2eEnabled: true,
      renderer: 'spark',
      viewerMode: 'compat',
    });
  });

  it('reads the explicit fast-path opt-in and ignores blank scene values', () => {
    expect(parseAppRuntimeQuery('?scene=%20%20&viewerMode=default')).toEqual({
      autoSceneUrl: null,
      e2eEnabled: false,
      renderer: 'mkkellogg',
      viewerMode: 'default',
    });
  });

  it('falls back to the default compatibility mode and renderer for unsupported values', () => {
    expect(parseAppRuntimeQuery('?renderer=other&viewerMode=fast')).toEqual({
      autoSceneUrl: null,
      e2eEnabled: false,
      renderer: 'mkkellogg',
      viewerMode: null,
    });
  });
});
