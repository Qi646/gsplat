export interface ViewerRuntimeOptions {
  gpuAcceleratedSort: boolean;
  sharedMemoryForWorkers: boolean;
  enableSIMDInSort?: boolean;
  integerBasedSort?: boolean;
  splatSortDistanceMapPrecision?: number;
}

export type ViewerMode = 'default' | 'compat';

export interface ViewerRuntimeConfig {
  compatibilityMode: boolean;
  statusMessage: string | null;
  warningMessage: string | null;
  viewerOptions: ViewerRuntimeOptions;
}

export const DEFAULT_COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active by default; use ?viewerMode=default to opt into the faster shared-memory path for diagnostics.';

export const COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active because the fast path requires cross-origin isolation; scene loading may be slower.';

export const FORCED_COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active because it was explicitly requested; scene loading may be slower.';

export interface ViewerRuntimeOverrides {
  viewerMode?: ViewerMode | null;
}

export function resolveViewerRuntimeConfig(
  crossOriginIsolated: boolean | undefined,
  overrides: ViewerRuntimeOverrides = {}
): ViewerRuntimeConfig {
  if (overrides.viewerMode === 'default') {
    if (crossOriginIsolated) {
      return {
        compatibilityMode: false,
        statusMessage: null,
        warningMessage: null,
        viewerOptions: {
          gpuAcceleratedSort: true,
          sharedMemoryForWorkers: true,
        },
      };
    }

    return {
      compatibilityMode: true,
      statusMessage: COMPATIBILITY_MODE_MESSAGE,
      warningMessage:
        'Cross-origin isolation is unavailable; disabling shared-memory splat sorting for compatibility.',
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    };
  }

  if (overrides.viewerMode === 'compat') {
    return {
      compatibilityMode: true,
      statusMessage: FORCED_COMPATIBILITY_MODE_MESSAGE,
      warningMessage:
        'Compatibility mode was explicitly requested; disabling shared-memory splat sorting for compatibility.',
      viewerOptions: {
        gpuAcceleratedSort: false,
        sharedMemoryForWorkers: false,
      },
    };
  }

  return {
    compatibilityMode: true,
    statusMessage: DEFAULT_COMPATIBILITY_MODE_MESSAGE,
    warningMessage: null,
    viewerOptions: {
      gpuAcceleratedSort: false,
      sharedMemoryForWorkers: false,
    },
  };
}
