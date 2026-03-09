import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COMPATIBILITY_MODE_MESSAGE,
  FAST_PATH_FALLBACK_MESSAGE,
  resolveViewerRuntimeConfig,
} from '../viewer/viewerRuntime';

describe('resolveViewerRuntimeConfig', () => {
  it('defaults to the compatibility worker path for broader browser coverage', () => {
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

  it('allows the fast shared-memory path to be requested explicitly when isolation is available', () => {
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

  it('falls back to compatibility mode when the fast path is requested without isolation', () => {
    expect(resolveViewerRuntimeConfig(false, { viewerMode: 'default' })).toEqual({
      compatibilityMode: true,
      statusMessage: FAST_PATH_FALLBACK_MESSAGE,
      warningMessage:
        'The fast shared-memory worker path was requested, but cross-origin isolation is unavailable; disabling shared-memory splat sorting for compatibility.',
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    });
  });

  it('keeps explicit compatibility mode as a no-op override', () => {
    expect(resolveViewerRuntimeConfig(true, { viewerMode: 'compat' })).toEqual({
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
