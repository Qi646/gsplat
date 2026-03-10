const DEFAULT_TARGET_FPS = 30;
const MIN_TARGET_FPS = 15;
const MAX_TARGET_FPS = 60;
const TARGET_FPS_STEP = 5;
const BUDGET_COOLDOWN_MS = 1000;
const LOW_FPS_TOLERANCE = 2;
const HIGH_FPS_TOLERANCE = 6;
const MIN_BUDGET_COUNT = 2048;
const MIN_BUDGET_RATIO = 0.05;

export interface AdaptiveRenderBudgetMetrics {
  fps: number;
  renderedSplatCount: number;
  totalSplatCount: number;
}

export interface AdaptiveRenderBudgetSnapshot {
  budgetCount: number | null;
  cooldownMs: number;
  enabled: boolean;
  suspended: boolean;
  targetFps: number;
}

export interface AdaptiveRenderBudgetState {
  budgetCount: number | null;
  enabled: boolean;
  maxTargetFps: number;
  minTargetFps: number;
  sliderStep: number;
  suspended: boolean;
  targetFps: number;
}

export class AdaptiveRenderBudgetController {
  private budgetCount: number | null = null;
  private enabled = false;
  private lastAdjustmentAt = Number.NEGATIVE_INFINITY;
  private suspended = false;
  private targetFps = DEFAULT_TARGET_FPS;

  getState(): AdaptiveRenderBudgetState {
    return {
      budgetCount: this.budgetCount,
      enabled: this.enabled,
      maxTargetFps: MAX_TARGET_FPS,
      minTargetFps: MIN_TARGET_FPS,
      sliderStep: TARGET_FPS_STEP,
      suspended: this.suspended,
      targetFps: this.targetFps,
    };
  }

  getSnapshot(nowMs: number): AdaptiveRenderBudgetSnapshot {
    return {
      budgetCount: this.budgetCount,
      cooldownMs: Math.max(0, BUDGET_COOLDOWN_MS - (nowMs - this.lastAdjustmentAt)),
      enabled: this.enabled,
      suspended: this.suspended,
      targetFps: this.targetFps,
    };
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.lastAdjustmentAt = Number.NEGATIVE_INFINITY;
    this.budgetCount = null;
  }

  setSuspended(suspended: boolean): void {
    this.suspended = suspended;
  }

  setTargetFps(targetFps: number): void {
    this.targetFps = sanitizeTargetFps(targetFps);
  }

  resetScene(): void {
    this.lastAdjustmentAt = Number.NEGATIVE_INFINITY;
    this.budgetCount = null;
  }

  update(metrics: AdaptiveRenderBudgetMetrics, nowMs: number): number | null {
    if (!this.enabled || this.suspended) {
      return null;
    }

    if (metrics.totalSplatCount <= 0 || metrics.renderedSplatCount <= 0 || !Number.isFinite(metrics.fps)) {
      return this.budgetCount;
    }

    const minBudgetCount = computeMinBudgetCount(metrics.totalSplatCount);
    const effectiveBudget = clampBudget(
      Math.min(this.budgetCount ?? metrics.renderedSplatCount, metrics.renderedSplatCount || metrics.totalSplatCount),
      minBudgetCount,
      metrics.totalSplatCount,
    );

    if (nowMs - this.lastAdjustmentAt < BUDGET_COOLDOWN_MS) {
      return normalizeBudget(this.budgetCount, metrics.totalSplatCount);
    }

    if (metrics.fps < this.targetFps - LOW_FPS_TOLERANCE) {
      const reductionFactor = clamp(metrics.fps / this.targetFps, 0.6, 0.92);
      const nextBudget = clampBudget(
        Math.floor(effectiveBudget * reductionFactor),
        minBudgetCount,
        metrics.totalSplatCount,
      );
      if (nextBudget < metrics.totalSplatCount) {
        this.budgetCount = nextBudget;
        this.lastAdjustmentAt = nowMs;
      }
      return normalizeBudget(this.budgetCount, metrics.totalSplatCount);
    }

    if (metrics.fps > this.targetFps + HIGH_FPS_TOLERANCE && this.budgetCount !== null) {
      const nextBudget = clampBudget(
        Math.ceil(this.budgetCount * 1.12),
        minBudgetCount,
        metrics.totalSplatCount,
      );
      this.budgetCount = nextBudget >= metrics.totalSplatCount ? null : nextBudget;
      this.lastAdjustmentAt = nowMs;
      return normalizeBudget(this.budgetCount, metrics.totalSplatCount);
    }

    return normalizeBudget(this.budgetCount, metrics.totalSplatCount);
  }
}

export function buildAdaptiveRenderBudgetNote(
  state: AdaptiveRenderBudgetState,
  metrics: AdaptiveRenderBudgetMetrics,
): string {
  if (metrics.totalSplatCount <= 0) {
    return 'Load a scene to enable adaptive FPS.';
  }

  if (state.suspended) {
    return `Adaptive FPS paused. Export is rendering full quality at target ${state.targetFps} FPS.`;
  }

  if (!state.enabled) {
    return `Adaptive FPS off. Full quality: ${metrics.renderedSplatCount.toLocaleString()} / ${metrics.totalSplatCount.toLocaleString()} rendered.`;
  }

  if (state.budgetCount === null || state.budgetCount >= metrics.totalSplatCount) {
    return `Target ${state.targetFps} FPS. Full quality: ${metrics.renderedSplatCount.toLocaleString()} / ${metrics.totalSplatCount.toLocaleString()} rendered.`;
  }

  const budgetPercent = Math.round((state.budgetCount / metrics.totalSplatCount) * 100);
  return `Target ${state.targetFps} FPS. Budget ${budgetPercent}%: ${metrics.renderedSplatCount.toLocaleString()} / ${metrics.totalSplatCount.toLocaleString()} rendered.`;
}

function sanitizeTargetFps(targetFps: number): number {
  const rounded = Math.round(targetFps / TARGET_FPS_STEP) * TARGET_FPS_STEP;
  return clamp(rounded, MIN_TARGET_FPS, MAX_TARGET_FPS);
}

function computeMinBudgetCount(totalSplatCount: number): number {
  return Math.min(totalSplatCount, Math.max(MIN_BUDGET_COUNT, Math.floor(totalSplatCount * MIN_BUDGET_RATIO)));
}

function normalizeBudget(budgetCount: number | null, totalSplatCount: number): number | null {
  if (budgetCount === null || budgetCount >= totalSplatCount) {
    return null;
  }

  return clampBudget(budgetCount, computeMinBudgetCount(totalSplatCount), totalSplatCount);
}

function clampBudget(budgetCount: number, minBudgetCount: number, totalSplatCount: number): number {
  return clamp(Math.floor(budgetCount), minBudgetCount, totalSplatCount);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
