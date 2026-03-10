import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WalkControls, type WalkControlState } from '../controls/WalkControls';

type Listener = (event: { type: string; [key: string]: unknown }) => void;

class FakeEventTarget {
  private readonly listeners = new Map<string, Set<Listener>>();

  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    if (typeof listener !== 'function') {
      return;
    }

    const listenersForType = this.listeners.get(type) ?? new Set<Listener>();
    listenersForType.add(listener as unknown as Listener);
    this.listeners.set(type, listenersForType);
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    if (typeof listener !== 'function') {
      return;
    }

    this.listeners.get(type)?.delete(listener as unknown as Listener);
  }

  dispatchEvent(event: { type: string; [key: string]: unknown }): void {
    for (const listener of this.listeners.get(event.type) ?? []) {
      listener(event);
    }
  }
}

class FakeDocument extends FakeEventTarget {
  pointerLockElement: FakeCanvas | null = null;
  visibilityState: 'visible' | 'hidden' = 'visible';

  exitPointerLock(): void {
    this.pointerLockElement = null;
    this.dispatchEvent({ type: 'pointerlockchange' });
  }
}

class FakeWindow extends FakeEventTarget {}

class FakeCanvas extends FakeEventTarget {
  requestPointerLockCalls = 0;
  shouldRejectPointerLock = false;

  constructor(private readonly documentRef: FakeDocument) {
    super();
  }

  requestPointerLock(): void {
    this.requestPointerLockCalls += 1;
    if (this.shouldRejectPointerLock) {
      this.documentRef.dispatchEvent({ type: 'pointerlockerror' });
      return;
    }
    this.documentRef.pointerLockElement = this;
    this.documentRef.dispatchEvent({ type: 'pointerlockchange' });
  }
}

describe('WalkControls', () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  let now = 0;
  let performanceNowSpy: ReturnType<typeof vi.spyOn>;
  let documentMock: FakeDocument;
  let windowMock: FakeWindow;
  let canvas: FakeCanvas;
  let camera: THREE.PerspectiveCamera;
  let states: WalkControlState[];

  const dispatchKey = (type: 'keydown' | 'keyup', code: string) => {
    const preventDefault = vi.fn();
    documentMock.dispatchEvent({ code, preventDefault, type });
    return preventDefault;
  };

  const activateControls = (controls: WalkControls) => {
    controls.enable();
  };

  beforeEach(() => {
    now = 0;
    performanceNowSpy = vi.spyOn(globalThis.performance, 'now').mockImplementation(() => now);
    documentMock = new FakeDocument();
    windowMock = new FakeWindow();
    canvas = new FakeCanvas(documentMock);
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    states = [];

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: documentMock as unknown as Document,
      writable: true,
    });
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: windowMock as unknown as Window & typeof globalThis,
      writable: true,
    });
  });

  afterEach(() => {
    performanceNowSpy.mockRestore();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
      writable: true,
    });
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
      writable: true,
    });
  });

  it('requests pointer lock immediately and becomes active without a canvas click', () => {
    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
      onStateChange: state => states.push(state),
    });

    controls.enable();
    expect(canvas.requestPointerLockCalls).toBe(1);
    expect(controls.getState()).toBe('active');
    expect(states).toEqual(['armed', 'active']);
  });

  it('falls back to inactive and reports lock errors when pointer lock is rejected', () => {
    canvas.shouldRejectPointerLock = true;
    let lockErrors = 0;
    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
      onLockError: () => {
        lockErrors += 1;
      },
      onStateChange: state => states.push(state),
    });

    controls.enable();

    expect(canvas.requestPointerLockCalls).toBe(1);
    expect(lockErrors).toBe(1);
    expect(controls.getState()).toBe('inactive');
    expect(states).toEqual(['armed', 'inactive']);
  });

  it('exits on Escape and clears any held movement keys', () => {
    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    dispatchKey('keydown', 'KeyW');

    const preventDefault = dispatchKey('keydown', 'Escape');
    now = 1000;
    controls.update();

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(controls.getState()).toBe('inactive');
    expect(documentMock.pointerLockElement).toBeNull();
    expect(camera.position.toArray()).toEqual([0, 0, 0]);
  });

  it('fully exits when pointer lock is lost', () => {
    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);

    documentMock.pointerLockElement = null;
    documentMock.dispatchEvent({ type: 'pointerlockchange' });
    dispatchKey('keydown', 'KeyW');
    now = 1000;
    controls.update();

    expect(controls.getState()).toBe('inactive');
    expect(camera.position.toArray()).toEqual([0, 0, 0]);
  });

  it('clears held keys on blur and visibility changes', () => {
    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    dispatchKey('keydown', 'KeyW');
    windowMock.dispatchEvent({ type: 'blur' });

    expect(controls.getState()).toBe('inactive');

    activateControls(controls);
    now = 1000;
    controls.update();
    expect(camera.position.toArray()).toEqual([0, 0, 0]);

    dispatchKey('keydown', 'KeyE');
    documentMock.visibilityState = 'hidden';
    documentMock.dispatchEvent({ type: 'visibilitychange' });
    documentMock.visibilityState = 'visible';

    expect(controls.getState()).toBe('inactive');

    activateControls(controls);
    now = 2000;
    controls.update();
    expect(camera.position.toArray()).toEqual([0, 0, 0]);
  });

  it('moves forward in the full look direction when the camera is pitched', () => {
    const yaw = Math.PI / 3;
    const pitch = Math.PI / 4;
    camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));

    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    dispatchKey('keydown', 'KeyW');
    now = 1000;
    controls.update();

    const expected = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(0.2);

    expect(camera.position.x).toBeCloseTo(expected.x);
    expect(camera.position.y).toBeCloseTo(expected.y);
    expect(camera.position.z).toBeCloseTo(expected.z);
  });

  it('moves backward opposite the look direction when the camera is pitched', () => {
    const yaw = -Math.PI / 6;
    const pitch = -Math.PI / 5;
    camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));

    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    dispatchKey('keydown', 'KeyS');
    now = 1000;
    controls.update();

    const expected = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(-0.2);

    expect(camera.position.x).toBeCloseTo(expected.x);
    expect(camera.position.y).toBeCloseTo(expected.y);
    expect(camera.position.z).toBeCloseTo(expected.z);
  });

  it('moves Q and E along the camera local up axis when the camera is rolled', () => {
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);

    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    dispatchKey('keydown', 'KeyE');
    now = 1000;
    controls.update();

    const expected = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(0.2);

    expect(camera.position.x).toBeCloseTo(expected.x);
    expect(camera.position.y).toBeCloseTo(expected.y);
    expect(camera.position.z).toBeCloseTo(expected.z);
  });

  it('preserves roll when mouse look yaws around the current local up axis', () => {
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    const initialUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();

    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    documentMock.dispatchEvent({ movementX: 120, movementY: 0, type: 'mousemove' });

    const nextUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    expect(nextUp.dot(initialUp)).toBeCloseTo(1, 6);
  });

  it('keeps vertical motion on Q and E', () => {
    const controls = new WalkControls({
      camera,
      canvas: canvas as unknown as HTMLCanvasElement,
    });

    activateControls(controls);
    dispatchKey('keydown', 'KeyE');
    now = 1000;
    controls.update();

    expect(camera.position.x).toBeCloseTo(0);
    expect(camera.position.y).toBeCloseTo(0.2);
    expect(camera.position.z).toBeCloseTo(0);
  });
});
