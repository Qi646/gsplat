import { describe, expect, it } from 'vitest';
import {
  getNavigationModePresentation,
  resolveNavigationShortcutAction,
} from '../controls/navigationMode';

describe('getNavigationModePresentation', () => {
  it('maps inspect, locking, and active walk states to user-facing labels', () => {
    expect(getNavigationModePresentation('inactive')).toMatchObject({
      engaged: false,
      hudMessage: '',
      indicatorLabel: 'Inspect',
      indicatorState: 'inspect',
    });
    expect(getNavigationModePresentation('armed')).toMatchObject({
      engaged: true,
      indicatorLabel: 'Walk (locking)',
      indicatorState: 'armed',
    });
    expect(getNavigationModePresentation('active')).toMatchObject({
      engaged: true,
      indicatorLabel: 'Walk',
      indicatorState: 'active',
    });
  });
});

describe('resolveNavigationShortcutAction', () => {
  it('enters walk mode from 2 when the scene is ready', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'Digit2',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBe('enter-walk');
  });

  it('exits walk mode from 1 while walk mode is armed or active', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'Digit1',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'armed',
        },
      ),
    ).toBe('exit-walk');
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'Digit1',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'active',
        },
      ),
    ).toBe('exit-walk');
  });

  it('ignores walk-entry shortcuts when the scene is unavailable or interaction is locked', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'Digit2',
        },
        {
          interactionLocked: false,
          sceneLoaded: false,
          walkState: 'inactive',
        },
      ),
    ).toBeNull();
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'Digit2',
        },
        {
          interactionLocked: true,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBeNull();
  });

  it('ignores navigation shortcuts while typing in editable fields', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'Digit2',
          target: {
            closest: () => ({ tagName: 'INPUT' }),
          } as unknown as EventTarget,
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBeNull();
  });
});
