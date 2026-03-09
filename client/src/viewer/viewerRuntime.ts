export interface ViewerRuntimeOptions {
  gpuAcceleratedSort: boolean;
  sharedMemoryForWorkers: boolean;
}

export interface ViewerRuntimeConfig {
  compatibilityMode: boolean;
  statusMessage: string | null;
  warningMessage: string | null;
  viewerOptions: ViewerRuntimeOptions;
}

export const COMPATIBILITY_MODE_MESSAGE =
  'Compatibility mode is active because cross-origin isolation is unavailable; scene loading may be slower.';

export function resolveViewerRuntimeConfig(crossOriginIsolated: boolean | undefined): ViewerRuntimeConfig {
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
