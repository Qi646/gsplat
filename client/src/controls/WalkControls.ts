import * as THREE from 'three';

export interface WalkControlsOptions {
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  moveSpeed?: number;
  lookSpeed?: number;
  sprintMult?: number;
}

export class WalkControls {
  private camera: THREE.PerspectiveCamera;
  private canvas: HTMLCanvasElement;
  private moveSpeed: number;
  private lookSpeed: number;
  private sprintMult: number;
  private active = false;
  private keys: Record<string, boolean> = {};
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private lastTime = 0;

  private onKeyDownBound: (event: KeyboardEvent) => void;
  private onKeyUpBound: (event: KeyboardEvent) => void;
  private onMouseMoveBound: (event: MouseEvent) => void;
  private onClickBound: () => void;
  private onPointerLockChangeBound: () => void;

  constructor(options: WalkControlsOptions) {
    this.camera = options.camera;
    this.canvas = options.canvas;
    this.moveSpeed = options.moveSpeed ?? 2.0;
    this.lookSpeed = options.lookSpeed ?? 0.002;
    this.sprintMult = options.sprintMult ?? 3.0;

    this.onKeyDownBound = this.onKeyDown.bind(this);
    this.onKeyUpBound = this.onKeyUp.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onClickBound = this.requestLock.bind(this);
    this.onPointerLockChangeBound = this.onPointerLockChange.bind(this);
  }

  enable(): void {
    this.euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.lastTime = performance.now();
    this.active = true;

    document.addEventListener('keydown', this.onKeyDownBound);
    document.addEventListener('keyup', this.onKeyUpBound);
    document.addEventListener('mousemove', this.onMouseMoveBound);
    document.addEventListener('pointerlockchange', this.onPointerLockChangeBound);
    this.canvas.addEventListener('click', this.onClickBound);

    this.requestLock();
  }

  disable(): void {
    this.active = false;
    this.keys = {};

    document.removeEventListener('keydown', this.onKeyDownBound);
    document.removeEventListener('keyup', this.onKeyUpBound);
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    document.removeEventListener('pointerlockchange', this.onPointerLockChangeBound);
    this.canvas.removeEventListener('click', this.onClickBound);

    if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock();
    }
  }

  isActive(): boolean {
    return this.active;
  }

  update(): void {
    if (!this.active) {
      return;
    }

    const now = performance.now();
    const deltaSeconds = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const sprinting = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    const distance = this.moveSpeed * (sprinting ? this.sprintMult : 1) * deltaSeconds;

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0);

    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      this.camera.position.addScaledVector(forward, distance);
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      this.camera.position.addScaledVector(forward, -distance);
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      this.camera.position.addScaledVector(right, -distance);
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      this.camera.position.addScaledVector(right, distance);
    }
    if (this.keys['KeyQ']) {
      this.camera.position.addScaledVector(up, -distance);
    }
    if (this.keys['KeyE']) {
      this.camera.position.addScaledVector(up, distance);
    }
  }

  private requestLock(): void {
    if (document.pointerLockElement !== this.canvas) {
      this.canvas.requestPointerLock();
    }
  }

  private onPointerLockChange(): void {
    if (document.pointerLockElement !== this.canvas && this.active) {
      // Mouse look pauses until the user clicks back into the canvas.
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.active) {
      return;
    }

    this.keys[event.code] = true;

    if (event.code === 'Escape') {
      this.disable();
      document.dispatchEvent(new CustomEvent('walkmode:exit'));
    }

    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keys[event.code] = false;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.active || document.pointerLockElement !== this.canvas) {
      return;
    }

    this.euler.y -= event.movementX * this.lookSpeed;
    this.euler.x -= event.movementY * this.lookSpeed;
    this.euler.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);
  }
}
