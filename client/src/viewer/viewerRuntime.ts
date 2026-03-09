import type { BrowserFamily } from '../lib/browserInfo';

export interface ViewerRuntimeOptions {
  gpuAcceleratedSort: boolean;
  sharedMemoryForWorkers: boolean;
  enableSIMDInSort: boolean;
  integerBasedSort: boolean;
  splatSortDistanceMapPrecision: number;
}

export type ViewerMode = 'default' | 'compat';

export interface ViewerRuntimeConfig {
  compatibilityMode: boolean;
  statusMessage: string | null;
  warningMessage: string | null;
  viewerOptions: ViewerRuntimeOptions;
}

export const DEFAULT_COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active by default for broader browser coverage; scene loading may be slower.';

export const FAST_PATH_FALLBACK_MESSAGE =
  'Compatibility mode is active because the fast path requires cross-origin isolation; scene loading may be slower.';

export const FIREFOX_SAFE_MODE_MESSAGE =
  'Firefox is using a safer compatibility runtime to avoid preset rendering corruption; scene loading and sorting may be slower.';

export const FIREFOX_FAST_PATH_OVERRIDE_MESSAGE =
  'Firefox is using a safer compatibility runtime to avoid preset rendering corruption; the fast-path request was ignored.';

export const FIREFOX_FAST_PATH_OVERRIDE_WARNING =
  'The fast shared-memory viewer path was requested in Firefox, but Firefox now forces a safer compatibility runtime to avoid preset rendering corruption.';

const SAFE_SORT_VIEWER_OPTIONS = {
  enableSIMDInSort: true,
  integerBasedSort: false,
  splatSortDistanceMapPrecision: 20,
} as const;

const FIREFOX_SAFE_VIEWER_OPTIONS = {
  gpuAcceleratedSort: false,
  sharedMemoryForWorkers: false,
  enableSIMDInSort: false,
  integerBasedSort: false,
  splatSortDistanceMapPrecision: 24,
} as const;

export interface ViewerRuntimeOverrides {
  viewerMode?: ViewerMode | null;
}

export function resolveViewerRuntimeConfig(
  crossOriginIsolated: boolean | undefined,
  browserFamily: BrowserFamily,
  overrides: ViewerRuntimeOverrides = {}
): ViewerRuntimeConfig {
  if (browserFamily === 'firefox') {
    const fastPathRequested = overrides.viewerMode === 'default';

    return {
      compatibilityMode: true,
      statusMessage: fastPathRequested
        ? FIREFOX_FAST_PATH_OVERRIDE_MESSAGE
        : FIREFOX_SAFE_MODE_MESSAGE,
      warningMessage: fastPathRequested ? FIREFOX_FAST_PATH_OVERRIDE_WARNING : null,
      viewerOptions: { ...FIREFOX_SAFE_VIEWER_OPTIONS },
    };
  }

  if (overrides.viewerMode !== 'default') {
    return {
      compatibilityMode: true,
      statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
        ...SAFE_SORT_VIEWER_OPTIONS,
      },
    };
  }

  if (crossOriginIsolated) {
    return {
      compatibilityMode: false,
      statusMessage: null,
      warningMessage: null,
      viewerOptions: {
        gpuAcceleratedSort: true,
        sharedMemoryForWorkers: true,
        ...SAFE_SORT_VIEWER_OPTIONS,
      },
    };
  }

  return {
    compatibilityMode: true,
    statusMessage: FAST_PATH_FALLBACK_MESSAGE,
    warningMessage:
      'The fast shared-memory worker path was requested, but cross-origin isolation is unavailable; disabling shared-memory splat sorting for compatibility.',
    viewerOptions: {
      gpuAcceleratedSort: false,
      sharedMemoryForWorkers: false,
      ...SAFE_SORT_VIEWER_OPTIONS,
    },
  };
}
