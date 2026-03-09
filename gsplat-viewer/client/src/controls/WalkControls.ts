/**
 * WalkControls.ts
 * First-person walk/fly camera using Pointer Lock API.
 * WASD to move, mouse to look, Q/E for up/down, Shift to sprint.
 */

import * as THREE from 'three';

export interface WalkControlsOptions {
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  moveSpeed?: number;    // units/second
  lookSpeed?: number;    // radians/pixel
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
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');  // YXZ = FPS-style

  private onKeyDownBound: (e: KeyboardEvent) => void;
  private onKeyUpBound: (e: KeyboardEvent) => void;
  private onMouseMoveBound: (e: MouseEvent) => void;
  private onPointerLockChangeBound: () => void;
  private onClickBound: () => void;

  private lastTime = 0;

  constructor(options: WalkControlsOptions) {
    this.camera = options.camera;
    this.canvas = options.canvas;
    this.moveSpeed = options.moveSpeed ?? 2.0;
    this.lookSpeed = options.lookSpeed ?? 0.002;
    this.sprintMult = options.sprintMult ?? 3.0;

    this.onKeyDownBound = this.onKeyDown.bind(this);
    this.onKeyUpBound = this.onKeyUp.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onPointerLockChangeBound = this.onPointerLockChange.bind(this);
    this.onClickBound = this.requestLock.bind(this);
  }

  enable(): void {
    // Sync euler to current camera rotation
    this.euler.setFromQuaternion(this.camera.quaternion, 'YXZ');

    document.addEventListener('keydown', this.onKeyDownBound);
    document.addEventListener('keyup', this.onKeyUpBound);
    document.addEventListener('mousemove', this.onMouseMoveBound);
    document.addEventListener('pointerlockchange', this.onPointerLockChangeBound);
    this.canvas.addEventListener('click', this.onClickBound);

    this.active = true;
    this.lastTime = performance.now();

    // Auto-request pointer lock
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

  /** Call once per frame during rAF loop */
  update(): void {
    if (!this.active) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);  // cap at 100ms
    this.lastTime = now;

    const sprint = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    const speed = this.moveSpeed * (sprint ? this.sprintMult : 1.0) * dt;

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0);

    // WASD
    if (this.keys['KeyW'] || this.keys['ArrowUp'])    this.camera.position.addScaledVector(forward, speed);
    if (this.keys['KeyS'] || this.keys['ArrowDown'])  this.camera.position.addScaledVector(forward, -speed);
    if (this.keys['KeyA'] || this.keys['ArrowLeft'])  this.camera.position.addScaledVector(right, -speed);
    if (this.keys['KeyD'] || this.keys['ArrowRight']) this.camera.position.addScaledVector(right, speed);

    // Q/E for vertical
    if (this.keys['KeyQ']) this.camera.position.addScaledVector(up, -speed);
    if (this.keys['KeyE']) this.camera.position.addScaledVector(up, speed);
  }

  private requestLock(): void {
    if (document.pointerLockElement !== this.canvas) {
      this.canvas.requestPointerLock();
    }
  }

  private onPointerLockChange(): void {
    if (document.pointerLockElement !== this.canvas && this.active) {
      // Pointer lock exited — keep walk mode active but stop capturing mouse
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (!this.active) return;
    this.keys[e.code] = true;

    // ESC exits walk mode
    if (e.code === 'Escape') {
      this.disable();
      document.dispatchEvent(new CustomEvent('walkmode:exit'));
    }

    // Prevent page scroll
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.active) return;
    if (document.pointerLockElement !== this.canvas) return;

    this.euler.y -= e.movementX * this.lookSpeed;
    this.euler.x -= e.movementY * this.lookSpeed;

    // Clamp pitch to ±85°
    this.euler.x = Math.max(
      -Math.PI / 2 + 0.05,
      Math.min(Math.PI / 2 - 0.05, this.euler.x)
    );

    this.camera.quaternion.setFromEuler(this.euler);
  }
}
