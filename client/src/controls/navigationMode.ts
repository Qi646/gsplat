import type { WalkControlState } from './WalkControls';

export type NavigationShortcutAction =
  | 'enter-walk'
  | 'exit-walk'
  | 'add-keyframe'
  | 'roll-left'
  | 'roll-right';

export interface NavigationModePresentation {
  engaged: boolean;
  hudMessage: string;
  indicatorLabel: string;
  indicatorState: 'inspect' | 'armed' | 'active';
}

export interface NavigationShortcutEventLike {
  altKey?: boolean;
  code: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  target?: EventTarget | null;
}

export interface NavigationShortcutContext {
  interactionLocked: boolean;
  sceneLoaded: boolean;
  walkState: WalkControlState;
}

const EDITABLE_TARGET_SELECTOR = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

export function getNavigationModePresentation(
  state: WalkControlState,
): NavigationModePresentation {
  if (state === 'armed') {
    return {
      engaged: true,
      hudMessage: 'WALK MODE · Capturing cursor...',
      indicatorLabel: 'Walk [2] (locking)',
      indicatorState: 'armed',
    };
  }

  if (state === 'active') {
    return {
      engaged: true,
      hudMessage: 'WALK MODE · 1 Inspect · WASD fly · Mouse look · Q/E vertical · Z/C roll · Shift sprint · ESC exit',
      indicatorLabel: 'Walk [2]',
      indicatorState: 'active',
    };
  }

  return {
    engaged: false,
    hudMessage: '',
    indicatorLabel: 'Inspect [1]',
    indicatorState: 'inspect',
  };
}

export function resolveNavigationShortcutAction(
  event: NavigationShortcutEventLike,
  context: NavigationShortcutContext,
): NavigationShortcutAction | null {
  if (event.altKey || event.ctrlKey || event.metaKey || isEditableEventTarget(event.target ?? null)) {
    return null;
  }

  if (event.code === 'Digit1' || event.code === 'Numpad1') {
    return context.walkState === 'inactive' ? null : 'exit-walk';
  }

  if (event.code === 'KeyZ' || event.code === 'KeyC') {
    if (!context.sceneLoaded || context.interactionLocked || context.walkState === 'armed') {
      return null;
    }

    return event.code === 'KeyZ' ? 'roll-left' : 'roll-right';
  }

  if (event.code === 'KeyK') {
    if (!context.sceneLoaded || context.interactionLocked || context.walkState === 'armed') {
      return null;
    }

    return 'add-keyframe';
  }

  if (event.code !== 'Digit2' && event.code !== 'Numpad2') {
    return null;
  }

  if (context.walkState !== 'inactive' || !context.sceneLoaded || context.interactionLocked) {
    return null;
  }

  return 'enter-walk';
}

function isEditableEventTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== 'object') {
    return false;
  }

  const targetElement = target as {
    closest?: (selector: string) => unknown;
    isContentEditable?: boolean;
  };

  if (typeof targetElement.closest === 'function' && targetElement.closest(EDITABLE_TARGET_SELECTOR)) {
    return true;
  }

  return Boolean(targetElement.isContentEditable);
}
