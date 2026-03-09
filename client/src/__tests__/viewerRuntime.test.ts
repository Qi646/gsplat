import { describe, expect, it } from 'vitest';
import {
  COMPATIBILITY_MODE_MESSAGE,
  FORCED_COMPATIBILITY_MODE_MESSAGE,
  resolveViewerRuntimeConfig,
} from '../viewer/viewerRuntime';

describe('resolveViewerRuntimeConfig', () => {
  it('uses the shared-memory worker path when cross-origin isolation is available', () => {
    expect(resolveViewerRuntimeConfig(true)).toEqual({
      compatibilityMode: false,
      statusMessage: null,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: true,
        sharedMemoryForWorkers: true,
      },
    });
  });

  it('falls back to the compatibility worker path when cross-origin isolation is unavailable', () => {
    expect(resolveViewerRuntimeConfig(false)).toEqual({
      compatibilityMode: true,
      statusMessage: COMPATIBILITY_MODE_MESSAGE,
      warningMessage:
        'Cross-origin isolation is unavailable; disabling shared-memory splat sorting for compatibility.',
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    });
  });

  it('allows compatibility mode to be forced explicitly', () => {
    expect(resolveViewerRuntimeConfig(true, { viewerMode: 'compat' })).toEqual({
      compatibilityMode: true,
      statusMessage: FORCED_COMPATIBILITY_MODE_MESSAGE,
      warningMessage:
        'Compatibility mode was explicitly requested; disabling shared-memory splat sorting for compatibility.',
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    });
  });
});
