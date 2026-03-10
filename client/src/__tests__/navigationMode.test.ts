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
      indicatorLabel: 'Inspect [1]',
      indicatorState: 'inspect',
    });
    expect(getNavigationModePresentation('armed')).toMatchObject({
      engaged: true,
      indicatorLabel: 'Walk [2] (locking)',
      indicatorState: 'armed',
    });
    expect(getNavigationModePresentation('active')).toMatchObject({
      engaged: true,
      indicatorLabel: 'Walk [2]',
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

  it('maps Z/C to camera roll when inspect or walk mode is active', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyZ',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBe('roll-left');
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyC',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'active',
        },
      ),
    ).toBe('roll-right');
  });

  it('maps K to add keyframe when scene interaction is available', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyK',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBe('add-keyframe');
  });

  it('maps K to add keyframe while walk mode is active', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyK',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'active',
        },
      ),
    ).toBe('add-keyframe');
  });

  it('blocks Z/C roll shortcuts while the scene is unavailable, interaction is locked, or walk mode is arming', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyZ',
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
          code: 'KeyZ',
        },
        {
          interactionLocked: true,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBeNull();
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyC',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'armed',
        },
      ),
    ).toBeNull();
  });

  it('blocks K while unavailable, locked, or while walk mode is arming', () => {
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyK',
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
          code: 'KeyK',
        },
        {
          interactionLocked: true,
          sceneLoaded: true,
          walkState: 'inactive',
        },
      ),
    ).toBeNull();
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyK',
        },
        {
          interactionLocked: false,
          sceneLoaded: true,
          walkState: 'armed',
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
    expect(
      resolveNavigationShortcutAction(
        {
          code: 'KeyZ',
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
