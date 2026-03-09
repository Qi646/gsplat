import { describe, expect, it } from 'vitest';
import {
  COMPATIBILITY_MODE_MESSAGE,
  FORCED_COMPATIBILITY_MODE_MESSAGE,
  resolveViewerRuntimeConfig,
} from '../viewer/viewerRuntime';

describe('resolveViewerRuntimeConfig', () => {
  it('uses the fast shared-memory path by default when isolation is available', () => {
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

  it('falls back to compatibility mode when isolation is unavailable', () => {
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

  it('treats explicit default mode as a no-op alias', () => {
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

  it('keeps Firefox on the same fast default path when isolation is available', () => {
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

  it('still falls back to compatibility mode on Firefox when isolation is unavailable', () => {
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
});
