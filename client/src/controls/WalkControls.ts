import * as THREE from 'three';

export type WalkControlState = 'inactive' | 'armed' | 'active';

export interface WalkControlsOptions {
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  moveSpeed?: number;
  lookSpeed?: number;
  sprintMult?: number;
  onLockError?: () => void;
  onStateChange?: (state: WalkControlState) => void;
}

export class WalkControls {
  private readonly camera: THREE.PerspectiveCamera;
  private readonly canvas: HTMLCanvasElement;
  private readonly moveSpeed: number;
  private readonly lookSpeed: number;
  private readonly sprintMult: number;
  private readonly onLockError?: () => void;
  private readonly onStateChange?: (state: WalkControlState) => void;
  private keys: Record<string, boolean> = {};
  private readonly forward = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly up = new THREE.Vector3();
  private readonly pitchRotation = new THREE.Quaternion();
  private readonly yawRotation = new THREE.Quaternion();
  private lastTime = 0;
  private state: WalkControlState = 'inactive';

  private onKeyDownBound: (event: KeyboardEvent) => void;
  private onKeyUpBound: (event: KeyboardEvent) => void;
  private onMouseMoveBound: (event: MouseEvent) => void;
  private onPointerLockChangeBound: () => void;
  private onPointerLockErrorBound: () => void;
  private onWindowBlurBound: () => void;
  private onVisibilityChangeBound: () => void;

  constructor(options: WalkControlsOptions) {
    this.camera = options.camera;
    this.canvas = options.canvas;
    this.moveSpeed = options.moveSpeed ?? 2.0;
    this.lookSpeed = options.lookSpeed ?? 0.002;
    this.sprintMult = options.sprintMult ?? 3.0;
    this.onLockError = options.onLockError;
    this.onStateChange = options.onStateChange;

    this.onKeyDownBound = this.onKeyDown.bind(this);
    this.onKeyUpBound = this.onKeyUp.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onPointerLockChangeBound = this.onPointerLockChange.bind(this);
    this.onPointerLockErrorBound = this.onPointerLockError.bind(this);
    this.onWindowBlurBound = this.onWindowBlur.bind(this);
    this.onVisibilityChangeBound = this.onVisibilityChange.bind(this);
  }

  enable(): void {
    if (this.state !== 'inactive') {
      return;
    }

    this.lastTime = performance.now();
    this.setState('armed');

    document.addEventListener('keydown', this.onKeyDownBound);
    document.addEventListener('keyup', this.onKeyUpBound);
    document.addEventListener('mousemove', this.onMouseMoveBound);
    document.addEventListener('pointerlockchange', this.onPointerLockChangeBound);
    document.addEventListener('pointerlockerror', this.onPointerLockErrorBound);
    window.addEventListener('blur', this.onWindowBlurBound);
    document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
    this.requestLock();
  }

  disable(): void {
    if (this.state === 'inactive') {
      return;
    }

    this.setState('inactive');
    this.clearKeys();
    this.lastTime = 0;

    document.removeEventListener('keydown', this.onKeyDownBound);
    document.removeEventListener('keyup', this.onKeyUpBound);
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    document.removeEventListener('pointerlockchange', this.onPointerLockChangeBound);
    document.removeEventListener('pointerlockerror', this.onPointerLockErrorBound);
    window.removeEventListener('blur', this.onWindowBlurBound);
    document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);

    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock?.();
    }
  }

  getState(): WalkControlState {
    return this.state;
  }

  isActive(): boolean {
    return this.state === 'active';
  }

  update(): void {
    if (this.state !== 'active') {
      return;
    }

    const now = performance.now();
    const deltaSeconds = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const sprinting = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    const distance = this.moveSpeed * (sprinting ? this.sprintMult : 1) * deltaSeconds;

    this.forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
    this.right.set(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize();
    this.up.set(0, 1, 0).applyQuaternion(this.camera.quaternion).normalize();

    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      this.camera.position.addScaledVector(this.forward, distance);
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      this.camera.position.addScaledVector(this.forward, -distance);
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      this.camera.position.addScaledVector(this.right, -distance);
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      this.camera.position.addScaledVector(this.right, distance);
    }
    if (this.keys['KeyQ']) {
      this.camera.position.addScaledVector(this.up, -distance);
    }
    if (this.keys['KeyE']) {
      this.camera.position.addScaledVector(this.up, distance);
    }
  }

  private requestLock(): void {
    if (this.state !== 'inactive' && document.pointerLockElement !== this.canvas) {
      try {
        const requestResult = this.canvas.requestPointerLock();
        if (requestResult && typeof (requestResult as Promise<void>).catch === 'function') {
          void (requestResult as Promise<void>).catch(() => {
            this.handleLockFailure();
          });
        }
      } catch {
        this.handleLockFailure();
      }
    }
  }

  private onPointerLockChange(): void {
    if (document.pointerLockElement === this.canvas) {
      this.lastTime = performance.now();
      this.setState('active');
      return;
    }

    if (this.state === 'active') {
      this.disable();
    }
  }

  private onPointerLockError(): void {
    this.handleLockFailure();
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.state === 'inactive') {
      return;
    }

    if (event.code === 'Escape') {
      this.disable();
      event.preventDefault();
      return;
    }

    if (this.state !== 'active') {
      return;
    }

    this.keys[event.code] = true;

    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (this.state === 'inactive') {
      return;
    }

    this.keys[event.code] = false;
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.state !== 'active' || document.pointerLockElement !== this.canvas) {
      return;
    }

    this.up.set(0, 1, 0).applyQuaternion(this.camera.quaternion).normalize();
    this.yawRotation.setFromAxisAngle(this.up, -event.movementX * this.lookSpeed);
    this.camera.quaternion.premultiply(this.yawRotation).normalize();

    this.right.set(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize();
    this.pitchRotation.setFromAxisAngle(this.right, -event.movementY * this.lookSpeed);
    this.camera.quaternion.premultiply(this.pitchRotation).normalize();
  }

  private onWindowBlur(): void {
    this.clearKeys();

    if (this.state === 'active') {
      this.disable();
    }
  }

  private onVisibilityChange(): void {
    this.clearKeys();

    if (document.visibilityState === 'hidden' && this.state === 'active') {
      this.disable();
    }
  }

  private clearKeys(): void {
    this.keys = {};
  }

  private handleLockFailure(): void {
    if (this.state !== 'armed') {
      return;
    }

    this.onLockError?.();
    this.disable();
  }

  private setState(nextState: WalkControlState): void {
    if (this.state === nextState) {
      return;
    }

    this.state = nextState;
    this.onStateChange?.(nextState);
  }
}
