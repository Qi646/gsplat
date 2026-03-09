import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COMPATIBILITY_MODE_MESSAGE,
  COMPATIBILITY_MODE_MESSAGE,
  FORCED_COMPATIBILITY_MODE_MESSAGE,
  resolveViewerRuntimeConfig,
} from '../viewer/viewerRuntime';

describe('resolveViewerRuntimeConfig', () => {
  it('uses compatibility mode by default even when isolation is available', () => {
    expect(resolveViewerRuntimeConfig(true)).toEqual({
      compatibilityMode: true,
      statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    });
  });

  it('keeps compatibility mode as the default when isolation is unavailable', () => {
    expect(resolveViewerRuntimeConfig(false)).toEqual({
      compatibilityMode: true,
      statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    });
  });

  it('uses the fast shared-memory path when explicit default mode is requested and isolation is available', () => {
    expect(resolveViewerRuntimeConfig(true, { viewerMode: 'default' })).toEqual({
      compatibilityMode: false,
      statusMessage: null,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: true,
        sharedMemoryForWorkers: true,
      },
    });
  });

  it('falls back to compatibility mode when explicit default mode is requested without isolation', () => {
    expect(resolveViewerRuntimeConfig(false, { viewerMode: 'default' })).toEqual({
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

  it('keeps explicit compatibility mode as an override', () => {
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

  it('keeps Firefox on the explicit fast path when requested and isolation is available', () => {
    expect(resolveViewerRuntimeConfig(true, { viewerMode: 'default' })).toEqual({
      compatibilityMode: false,
      statusMessage: null,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: true,
        sharedMemoryForWorkers: true,
      },
    });
  });

  it('keeps Firefox on the default compatibility path when no override is provided', () => {
    expect(resolveViewerRuntimeConfig(true)).toEqual({
      compatibilityMode: true,
      statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    });
  });
});
