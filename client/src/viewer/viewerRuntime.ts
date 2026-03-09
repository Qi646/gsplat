export interface ViewerRuntimeOptions {
  gpuAcceleratedSort: boolean;
  sharedMemoryForWorkers: boolean;
}

export type ViewerMode = 'default' | 'compat';

export interface ViewerRuntimeConfig {
  compatibilityMode: boolean;
  statusMessage: string | null;
  warningMessage: string | null;
  viewerOptions: ViewerRuntimeOptions;
}

export const COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active because cross-origin isolation is unavailable; scene loading may be slower.';

export const FORCED_COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active because it was explicitly requested; scene loading may be slower.';

export interface ViewerRuntimeOverrides {
  viewerMode?: ViewerMode | null;
}

export function resolveViewerRuntimeConfig(
  crossOriginIsolated: boolean | undefined,
  overrides: ViewerRuntimeOverrides = {}
): ViewerRuntimeConfig {
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
