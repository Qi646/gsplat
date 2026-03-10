import { describe, expect, it } from 'vitest';
import {
  AdaptiveRenderBudgetController,
  buildAdaptiveRenderBudgetNote,
} from '../performance/AdaptiveRenderBudgetController';

describe('AdaptiveRenderBudgetController', () => {
  it('exposes the default slider state and sanitizes target FPS values', () => {
    const controller = new AdaptiveRenderBudgetController();

    expect(controller.getState()).toEqual({
      budgetCount: null,
      enabled: false,
      maxTargetFps: 60,
      minTargetFps: 15,
      sliderStep: 5,
      suspended: false,
      targetFps: 30,
    });

    controller.setTargetFps(33);
    expect(controller.getState().targetFps).toBe(35);

    controller.setTargetFps(12);
    expect(controller.getState().targetFps).toBe(15);

    controller.setTargetFps(99);
    expect(controller.getState().targetFps).toBe(60);
  });

  it('downscales the budget below target FPS and holds it during cooldown', () => {
    const controller = new AdaptiveRenderBudgetController();
    controller.setEnabled(true);

    const firstBudget = controller.update(
      {
        fps: 20,
        renderedSplatCount: 10_000,
        totalSplatCount: 10_000,
      },
      0,
    );

    expect(firstBudget).toBe(6666);
    expect(controller.getSnapshot(0)).toMatchObject({
      budgetCount: 6666,
      cooldownMs: 1000,
      enabled: true,
      suspended: false,
      targetFps: 30,
    });

    const cooldownBudget = controller.update(
      {
        fps: 10,
        renderedSplatCount: 6666,
        totalSplatCount: 10_000,
      },
      500,
    );

    expect(cooldownBudget).toBe(6666);
    expect(controller.getSnapshot(500).cooldownMs).toBe(500);
  });

  it('does not churn budgets inside the hysteresis band', () => {
    const controller = new AdaptiveRenderBudgetController();
    controller.setEnabled(true);

    controller.update(
      {
        fps: 20,
        renderedSplatCount: 10_000,
        totalSplatCount: 10_000,
      },
      0,
    );

    const stableBudget = controller.update(
      {
        fps: 34,
        renderedSplatCount: 6666,
        totalSplatCount: 10_000,
      },
      1500,
    );

    expect(stableBudget).toBe(6666);
    expect(controller.getState().budgetCount).toBe(6666);
  });

  it('upscales back toward full quality when FPS is comfortably above target', () => {
    const controller = new AdaptiveRenderBudgetController();
    controller.setEnabled(true);

    controller.update(
      {
        fps: 27,
        renderedSplatCount: 5_000,
        totalSplatCount: 5_000,
      },
      0,
    );
    expect(controller.getState().budgetCount).toBe(4500);

    const restoredBudget = controller.update(
      {
        fps: 60,
        renderedSplatCount: 4500,
        totalSplatCount: 5_000,
      },
      1500,
    );

    expect(restoredBudget).toBeNull();
    expect(controller.getState().budgetCount).toBeNull();
  });

  it('clamps reductions to the minimum floor and resets on scene changes or disable', () => {
    const controller = new AdaptiveRenderBudgetController();
    controller.setEnabled(true);

    const floorBudget = controller.update(
      {
        fps: 1,
        renderedSplatCount: 3000,
        totalSplatCount: 3000,
      },
      0,
    );

    expect(floorBudget).toBe(2048);

    controller.resetScene();
    expect(controller.getState().budgetCount).toBeNull();

    controller.update(
      {
        fps: 20,
        renderedSplatCount: 10_000,
        totalSplatCount: 10_000,
      },
      0,
    );
    expect(controller.getState().budgetCount).toBe(6666);

    controller.setEnabled(false);
    expect(controller.getState()).toMatchObject({
      budgetCount: null,
      enabled: false,
    });
  });
});

describe('buildAdaptiveRenderBudgetNote', () => {
  it('describes live adaptive budgets and export suspension clearly', () => {
    expect(
      buildAdaptiveRenderBudgetNote(
        {
          budgetCount: null,
          enabled: false,
          maxTargetFps: 60,
          minTargetFps: 15,
          sliderStep: 5,
          suspended: false,
          targetFps: 30,
        },
        {
          fps: 0,
          renderedSplatCount: 0,
          totalSplatCount: 0,
        },
      ),
    ).toBe('Load a scene to enable adaptive FPS.');

    expect(
      buildAdaptiveRenderBudgetNote(
        {
          budgetCount: 6000,
          enabled: true,
          maxTargetFps: 60,
          minTargetFps: 15,
          sliderStep: 5,
          suspended: false,
          targetFps: 30,
        },
        {
          fps: 24,
          renderedSplatCount: 6000,
          totalSplatCount: 10_000,
        },
      ),
    ).toBe('Target 30 FPS. Budget 60%: 6,000 / 10,000 rendered.');

    expect(
      buildAdaptiveRenderBudgetNote(
        {
          budgetCount: 6000,
          enabled: true,
          maxTargetFps: 60,
          minTargetFps: 15,
          sliderStep: 5,
          suspended: true,
          targetFps: 30,
        },
        {
          fps: 24,
          renderedSplatCount: 6000,
          totalSplatCount: 10_000,
        },
      ),
    ).toBe('Adaptive FPS paused. Export is rendering full quality at target 30 FPS.');
  });
});
