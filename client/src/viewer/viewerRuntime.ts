export interface ViewerRuntimeOptions {
  gpuAcceleratedSort: boolean;
  sharedMemoryForWorkers: boolean;
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

const SAFE_SORT_VIEWER_OPTIONS = {
  integerBasedSort: false,
  splatSortDistanceMapPrecision: 20,
} as const;

export interface ViewerRuntimeOverrides {
  viewerMode?: ViewerMode | null;
}

export function resolveViewerRuntimeConfig(
  crossOriginIsolated: boolean | undefined,
  overrides: ViewerRuntimeOverrides = {}
): ViewerRuntimeConfig {
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
