export interface LoadProgressState {
  percent: number;
  message: string;
}

export const LOAD_STAGE = {
  Downloading: 0,
  Processing: 1,
  Done: 2,
} as const;

export type LoadStage = (typeof LOAD_STAGE)[keyof typeof LOAD_STAGE];

function clampPercent(percent: number | undefined): number {
  if (typeof percent !== 'number' || !Number.isFinite(percent)) {
    return 0;
  }

  return Math.min(Math.max(percent, 0), 100);
}

function fallbackPercentLabel(percent: number): string {
  if (percent <= 0) {
    return '0%';
  }

  if (percent < 1) {
    return `${percent.toFixed(2)}%`;
  }

  if (percent < 10) {
    return `${percent.toFixed(1)}%`;
  }

  return `${Math.round(percent)}%`;
}

export function formatLoadProgress(
  percent: number | undefined,
  percentLabel: string | undefined,
  stage: LoadStage | number
): LoadProgressState {
  const normalizedPercent = clampPercent(percent);
  const normalizedLabel = percentLabel?.trim() ? percentLabel.trim() : fallbackPercentLabel(normalizedPercent);

  if (stage === LOAD_STAGE.Downloading) {
    if (normalizedPercent === 0) {
      return {
        percent: 0,
        message: 'Downloading…',
      };
    }

    return {
      percent: normalizedPercent,
      message: `Downloading (${normalizedLabel})`,
    };
  }

  if (stage === LOAD_STAGE.Processing) {
    return {
      percent: normalizedPercent,
      message: normalizedPercent >= 100 ? 'Processing complete.' : 'Processing scene…',
    };
  }

  if (stage === LOAD_STAGE.Done) {
    return {
      percent: 100,
      message: 'Finalizing…',
    };
  }

  return {
    percent: normalizedPercent,
    message: `Loading (${normalizedLabel})`,
  };
}
