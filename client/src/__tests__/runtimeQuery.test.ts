import { describe, expect, it } from 'vitest';
import { parseAppRuntimeQuery } from '../lib/runtimeQuery';

describe('parseAppRuntimeQuery', () => {
  it('returns defaults when no query parameters are provided', () => {
    expect(parseAppRuntimeQuery('')).toEqual({
      autoSceneUrl: null,
      e2eEnabled: false,
      viewerMode: 'compat',
    });
  });

  it('reads the e2e flag, scene URL, and compatibility mode from the query string', () => {
    expect(parseAppRuntimeQuery('?e2e=1&scene=%2Ftest-assets%2Fsmoke-grid.ply&viewerMode=compat')).toEqual({
      autoSceneUrl: '/test-assets/smoke-grid.ply',
      e2eEnabled: true,
      viewerMode: 'compat',
    });
  });

  it('reads the explicit fast-path opt-in and ignores blank scene values', () => {
    expect(parseAppRuntimeQuery('?scene=%20%20&viewerMode=default')).toEqual({
      autoSceneUrl: null,
      e2eEnabled: false,
      viewerMode: 'default',
    });
  });

  it('falls back to compatibility mode for unsupported viewer modes', () => {
    expect(parseAppRuntimeQuery('?viewerMode=fast')).toEqual({
      autoSceneUrl: null,
      e2eEnabled: false,
      viewerMode: 'compat',
    });
  });
});
