import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COMPATIBILITY_MODE_MESSAGE,
  FAST_PATH_FALLBACK_MESSAGE,
  FIREFOX_FAST_PATH_OVERRIDE_MESSAGE,
  FIREFOX_FAST_PATH_OVERRIDE_WARNING,
  FIREFOX_SAFE_MODE_MESSAGE,
  resolveViewerRuntimeConfig,
} from '../viewer/viewerRuntime';

describe('resolveViewerRuntimeConfig', () => {
  it('defaults to the compatibility worker path for broader browser coverage', () => {
    expect(resolveViewerRuntimeConfig(false, 'other')).toEqual({
      compatibilityMode: true,
      statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
        enableSIMDInSort: true,
        integerBasedSort: false,
        splatSortDistanceMapPrecision: 20,
      },
    });
  });

  it('allows the fast shared-memory path to be requested explicitly when isolation is available', () => {
    expect(resolveViewerRuntimeConfig(true, 'other', { viewerMode: 'default' })).toEqual({
      compatibilityMode: false,
      statusMessage: null,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: true,
        sharedMemoryForWorkers: true,
        enableSIMDInSort: true,
        integerBasedSort: false,
        splatSortDistanceMapPrecision: 20,
      },
    });
  });

  it('falls back to compatibility mode when the fast path is requested without isolation', () => {
    expect(resolveViewerRuntimeConfig(false, 'other', { viewerMode: 'default' })).toEqual({
      compatibilityMode: true,
      statusMessage: FAST_PATH_FALLBACK_MESSAGE,
      warningMessage:
        'The fast shared-memory worker path was requested, but cross-origin isolation is unavailable; disabling shared-memory splat sorting for compatibility.',
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
        enableSIMDInSort: true,
        integerBasedSort: false,
        splatSortDistanceMapPrecision: 20,
      },
    });
  });

  it('keeps explicit compatibility mode as a no-op override', () => {
    expect(resolveViewerRuntimeConfig(true, 'other', { viewerMode: 'compat' })).toEqual({
      compatibilityMode: true,
      statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
        enableSIMDInSort: true,
        integerBasedSort: false,
        splatSortDistanceMapPrecision: 20,
      },
    });
  });

  it('forces Firefox onto the safer compatibility runtime by default', () => {
    expect(resolveViewerRuntimeConfig(true, 'firefox')).toEqual({
      compatibilityMode: true,
      statusMessage: FIREFOX_SAFE_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
        enableSIMDInSort: false,
        integerBasedSort: false,
        splatSortDistanceMapPrecision: 24,
      },
    });
  });

  it('ignores explicit fast-path requests in Firefox to avoid preset corruption', () => {
    expect(resolveViewerRuntimeConfig(true, 'firefox', { viewerMode: 'default' })).toEqual({
      compatibilityMode: true,
      statusMessage: FIREFOX_FAST_PATH_OVERRIDE_MESSAGE,
      warningMessage: FIREFOX_FAST_PATH_OVERRIDE_WARNING,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
        enableSIMDInSort: false,
        integerBasedSort: false,
        splatSortDistanceMapPrecision: 24,
      },
    });
  });
});
