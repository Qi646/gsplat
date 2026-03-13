import * as THREE from 'three';
import { createClientId } from '../lib/createClientId';
import type { InterpolatedPose, Keyframe, ScenePointSample } from '../types';
import type { ViewerAdapter } from '../viewer/ViewerAdapter';
import type {
  AgenticDraftControls,
  AgenticPathDraft,
  AgenticPathProgress,
} from './agenticPath';
import { AgenticPathGenerationError } from './agenticPath';

const APPEND_BRIDGE_SECONDS = 1;
const MAX_SCENE_POINTS = 512;
const MAX_CAPTURE_LONG_SIDE = 640;
const KEYFRAME_INTERVAL_SECONDS = 2;
const DEFAULT_TIMEOUT_MS = 90_000;

export interface NavigationAgentOrchestratorOptions {
  fetchImpl?: typeof fetch;
  onProgress?: (progress: AgenticPathProgress) => void;
  timeoutMs?: number;
  viewer: ViewerAdapter;
}

export interface GenerateNavAgentDraftOptions {
  controls: AgenticDraftControls;
  existingKeyframes: Keyframe[];
  prompt: string;
}

interface CurrentPose {
  fov: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

interface NavAction {
  type: string;
  [key: string]: unknown;
}

interface NavTurnResponse {
  actions: NavAction[];
}

const DEFAULT_LOOK_UP = new THREE.Vector3(0, 1, 0);

export class NavigationAgentOrchestrator {
  private readonly fetchImpl: typeof fetch;
  private generating = false;
  private cancelled = false;
  private readonly onProgress?: (progress: AgenticPathProgress) => void;
  private readonly timeoutMs: number;
  private readonly viewer: ViewerAdapter;

  constructor(options: NavigationAgentOrchestratorOptions) {
    this.viewer = options.viewer;
    this.fetchImpl = resolveFetchImpl(options.fetchImpl);
    this.onProgress = options.onProgress;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  isGenerating(): boolean {
    return this.generating;
  }

  cancelGeneration(): boolean {
    if (!this.generating) {
      return false;
    }
    this.cancelled = true;
    this.reportProgress({
      buttonLabel: 'Cancelling…',
      message: 'Cancelling navigation agent…',
      stage: 'cancelling',
    });
    return true;
  }

  async generateDraft(options: GenerateNavAgentDraftOptions): Promise<AgenticPathDraft> {
    if (this.generating) {
      throw new AgenticPathGenerationError('Navigation agent is already running.');
    }

    const prompt = options.prompt.trim();
    if (!prompt) {
      throw new AgenticPathGenerationError('Enter a camera-path prompt before generating a draft.');
    }

    if (!this.viewer.isSceneLoaded()) {
      throw new AgenticPathGenerationError('Load a scene before generating a camera-path draft.');
    }

    const camera = this.viewer.getCamera();
    const bounds = this.viewer.getSceneBounds();
    if (!camera || !bounds) {
      throw new AgenticPathGenerationError('Scene bounds or camera state are unavailable.');
    }

    this.generating = true;
    this.cancelled = false;

    const livePose = poseFromCamera(camera);
    const startTime =
      options.existingKeyframes.length > 0
        ? (options.existingKeyframes.at(-1)?.time ?? 0) + APPEND_BRIDGE_SECONDS
        : 0;

    try {
      return await this.run({ prompt, bounds, livePose, startTime });
    } finally {
      this.generating = false;
      this.cancelled = false;
      this.viewer.applyCameraPose(livePose);
      this.viewer.renderNow();
    }
  }

  private async run(options: {
    prompt: string;
    bounds: THREE.Box3;
    livePose: InterpolatedPose;
    startTime: number;
  }): Promise<AgenticPathDraft> {
    const { prompt, bounds, livePose, startTime } = options;
    const diagonal = bounds.getSize(new THREE.Vector3()).length();

    // Sample scene points
    const rawPoints = this.viewer.sampleScenePoints(MAX_SCENE_POINTS);

    this.reportProgress({ buttonLabel: 'Generating…', message: 'Capturing scene for navigation agent…', stage: 'capture-round-1' });

    // Capture initial frame
    const camera = this.viewer.getCamera();
    if (!camera) throw new AgenticPathGenerationError('Camera unavailable.');
    const initialImageDataUrl = await this.captureDataUrl();

    // Current mutable pose (starts at live camera)
    const currentPose: CurrentPose = {
      position: livePose.position.clone(),
      quaternion: livePose.quaternion.clone(),
      fov: livePose.fov,
    };

    const collectedKeyframes: Keyframe[] = [];
    let summary = 'Camera path';
    let doneTriggered = false;

    this.reportProgress({ buttonLabel: 'Generating…', message: 'Planning camera path (turn 1)…', stage: 'composing' });

    if (this.cancelled) throw new AgenticPathGenerationError('Cancelled.');

    // Turn 1
    const turn1Response = await this.callPlanTurn({
      bounds,
      currentCamera: serializeCamera(camera, currentPose),
      imageDataUrl: initialImageDataUrl,
      prompt,
      scenePoints: samplePoints(rawPoints, MAX_SCENE_POINTS),
      turnNumber: 1,
    });

    this.checkTimeout();

    let captureAndAssessReason: string | null = null;

    for (const action of turn1Response.actions) {
      if (this.cancelled) throw new AgenticPathGenerationError('Cancelled.');

      if (action.type === 'capture_and_assess') {
        captureAndAssessReason = (action['reason'] as string | undefined) ?? 'Assessment requested';
        break;
      }

      if (action.type === 'done') {
        summary = (action['summary'] as string | undefined) ?? summary;
        doneTriggered = true;
        break;
      }

      this.executeAction(action, currentPose, bounds, diagonal, collectedKeyframes, startTime);
    }

    // Turn 2 (optional, only if capture_and_assess was called)
    if (!doneTriggered && captureAndAssessReason) {
      this.applyPoseToViewer(currentPose);
      const assessImageDataUrl = await this.captureDataUrl();

      this.reportProgress({ buttonLabel: 'Generating…', message: 'Assessing and correcting path (turn 2)…', stage: 'verifying' });

      if (this.cancelled) throw new AgenticPathGenerationError('Cancelled.');

      const camera2 = this.viewer.getCamera();
      if (!camera2) throw new AgenticPathGenerationError('Camera unavailable.');

      const turn2Response = await this.callPlanTurn({
        assessmentReason: captureAndAssessReason,
        bounds,
        currentCamera: serializeCamera(camera2, currentPose),
        imageDataUrl: assessImageDataUrl,
        prompt,
        scenePoints: samplePoints(rawPoints, MAX_SCENE_POINTS),
        turnNumber: 2,
      });

      this.checkTimeout();

      for (const action of turn2Response.actions) {
        if (this.cancelled) throw new AgenticPathGenerationError('Cancelled.');
        if (action.type === 'capture_and_assess') break; // ignore second capture_and_assess
        if (action.type === 'done') {
          summary = (action['summary'] as string | undefined) ?? summary;
          doneTriggered = true;
          break;
        }
        this.executeAction(action, currentPose, bounds, diagonal, collectedKeyframes, startTime);
      }
    }

    if (collectedKeyframes.length === 0) {
      throw new AgenticPathGenerationError('Navigation agent placed no keyframes. Try a different prompt.');
    }

    return {
      draftId: createClientId('draft'),
      groundedRoute: null,
      groundedSubject: null,
      keyframes: collectedKeyframes,
      segments: [],
      summary,
    };
  }

  private executeAction(
    action: NavAction,
    pose: CurrentPose,
    bounds: THREE.Box3,
    diagonal: number,
    keyframes: Keyframe[],
    startTime: number,
  ): void {
    switch (action.type) {
      case 'move': {
        const forward = Number(action['forward'] ?? 0);
        const right = Number(action['right'] ?? 0);
        const up = Number(action['up'] ?? 0);
        const scale = diagonal;
        const quat = pose.quaternion;

        const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(quat).multiplyScalar(forward * scale);
        const rgt = new THREE.Vector3(1, 0, 0).applyQuaternion(quat).multiplyScalar(right * scale);
        const upv = new THREE.Vector3(0, 1, 0).applyQuaternion(quat).multiplyScalar(up * scale);
        pose.position.add(fwd).add(rgt).add(upv);
        this.clampPose(pose, bounds, diagonal);
        this.applyPoseToViewer(pose);
        break;
      }
      case 'rotate': {
        const yawDeg = Number(action['yawDeg'] ?? 0);
        const pitchDeg = Number(action['pitchDeg'] ?? 0);
        const rollDeg = Number(action['rollDeg'] ?? 0);
        applyRotation(pose, yawDeg, pitchDeg, rollDeg);
        this.applyPoseToViewer(pose);
        break;
      }
      case 'look_at': {
        const t = action['target'] as { x: number; y: number; z: number } | undefined;
        if (!t) break;
        const target = new THREE.Vector3(t.x, t.y, t.z);
        pose.quaternion = computeLookAtQuaternion(pose.position, target);
        this.applyPoseToViewer(pose);
        break;
      }
      case 'orbit': {
        const t = action['target'] as { x: number; y: number; z: number } | undefined;
        if (!t) break;
        const target = new THREE.Vector3(t.x, t.y, t.z);
        const azimuth = Number(action['azimuth_deg'] ?? 0);
        const elevation = Number(action['elevation_deg'] ?? 0);
        const radius = Number(action['radius'] ?? diagonal * 0.4);
        const { position, quaternion } = computeOrbitPose(target, azimuth, elevation, radius);
        pose.position.copy(position);
        pose.quaternion.copy(quaternion);
        this.clampPose(pose, bounds, diagonal);
        this.applyPoseToViewer(pose);
        break;
      }
      case 'set_pose': {
        const p = action['position'] as { x: number; y: number; z: number } | undefined;
        const q = action['quaternion'] as { x: number; y: number; z: number; w: number } | undefined;
        if (!p || !q) break;
        pose.position.set(p.x, p.y, p.z);
        pose.quaternion.set(q.x, q.y, q.z, q.w).normalize();
        if (typeof action['fov'] === 'number' && action['fov'] > 0) {
          pose.fov = action['fov'] as number;
        }
        this.clampPose(pose, bounds, diagonal);
        this.applyPoseToViewer(pose);
        break;
      }
      case 'place_keyframe': {
        const time = startTime + keyframes.length * KEYFRAME_INTERVAL_SECONDS;
        keyframes.push({
          id: createClientId('keyframe'),
          time,
          position: { x: pose.position.x, y: pose.position.y, z: pose.position.z },
          quaternion: { x: pose.quaternion.x, y: pose.quaternion.y, z: pose.quaternion.z, w: pose.quaternion.w },
          fov: pose.fov,
        });
        break;
      }
      default:
        break;
    }
  }

  private clampPose(pose: CurrentPose, bounds: THREE.Box3, diagonal: number): void {
    const safe = bounds.clone().expandByScalar(diagonal * 0.3);
    pose.position.clamp(safe.min, safe.max);
    pose.position.y = Math.max(pose.position.y, bounds.min.y);
  }

  private applyPoseToViewer(pose: CurrentPose): void {
    this.viewer.applyCameraPose({
      position: pose.position.clone(),
      quaternion: pose.quaternion.clone(),
      fov: pose.fov,
    });
    this.viewer.renderNow();
  }

  private async captureDataUrl(): Promise<string> {
    const blob = await this.viewer.captureFrame();
    return blobToJpegDataUrl(blob);
  }

  private async callPlanTurn(requestBody: unknown): Promise<NavTurnResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl('/api/path/navigate', {
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        let message = `Navigation agent request failed (${response.status})`;
        try {
          const json = JSON.parse(text) as { error?: string };
          if (json.error) message = json.error;
        } catch {
          // ignore
        }
        throw new AgenticPathGenerationError(message);
      }

      return (await response.json()) as NavTurnResponse;
    } finally {
      clearTimeout(timer);
    }
  }

  private checkTimeout(): void {
    if (this.cancelled) {
      throw new AgenticPathGenerationError('Cancelled.');
    }
  }

  private reportProgress(progress: AgenticPathProgress): void {
    this.onProgress?.(progress);
  }
}

// --- Math helpers ---

function computeOrbitPose(
  target: THREE.Vector3,
  azimuth_deg: number,
  elevation_deg: number,
  radius: number,
): { position: THREE.Vector3; quaternion: THREE.Quaternion } {
  const azRad = THREE.MathUtils.degToRad(azimuth_deg);
  const elRad = THREE.MathUtils.degToRad(elevation_deg);

  const cosEl = Math.cos(elRad);
  const sinEl = Math.sin(elRad);
  const cosAz = Math.cos(azRad);
  const sinAz = Math.sin(azRad);

  const offset = new THREE.Vector3(
    radius * cosEl * sinAz,
    radius * sinEl,
    radius * cosEl * cosAz,
  );
  const eye = target.clone().add(offset);
  const quaternion = computeLookAtQuaternion(eye, target);
  return { position: eye, quaternion };
}

function computeLookAtQuaternion(eye: THREE.Vector3, target: THREE.Vector3): THREE.Quaternion {
  const forward = target.clone().sub(eye).normalize();

  let up = DEFAULT_LOOK_UP.clone();
  // Pole singularity: if looking nearly straight up or down, use +Z as up
  if (Math.abs(forward.dot(up)) > 0.98) {
    up = new THREE.Vector3(0, 0, 1);
  }

  const m = new THREE.Matrix4().lookAt(eye, target, up);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

function applyRotation(pose: CurrentPose, yawDeg: number, pitchDeg: number, rollDeg: number): void {
  const q = pose.quaternion;

  if (yawDeg !== 0) {
    const yawQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      THREE.MathUtils.degToRad(yawDeg),
    );
    q.premultiply(yawQ);
  }

  if (pitchDeg !== 0) {
    const localX = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
    const pitchQ = new THREE.Quaternion().setFromAxisAngle(localX, THREE.MathUtils.degToRad(pitchDeg));
    q.premultiply(pitchQ);
  }

  if (rollDeg !== 0) {
    const localZ = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const rollQ = new THREE.Quaternion().setFromAxisAngle(localZ, THREE.MathUtils.degToRad(rollDeg));
    q.premultiply(rollQ);
  }

  q.normalize();
}

// --- Serialization helpers ---

function poseFromCamera(camera: THREE.PerspectiveCamera): InterpolatedPose {
  return {
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
    fov: camera.fov,
  };
}

function serializeCamera(camera: THREE.PerspectiveCamera, pose: CurrentPose): unknown {
  return {
    aspect: camera.aspect,
    fov: pose.fov,
    position: { x: pose.position.x, y: pose.position.y, z: pose.position.z },
    quaternion: { x: pose.quaternion.x, y: pose.quaternion.y, z: pose.quaternion.z, w: pose.quaternion.w },
  };
}

function samplePoints(points: ScenePointSample[], max: number): Array<{ x: number; y: number; z: number; opacity: number }> {
  const sorted = [...points].sort((a, b) => b.opacity - a.opacity);
  const step = sorted.length > max ? Math.floor(sorted.length / max) : 1;
  const result: Array<{ x: number; y: number; z: number; opacity: number }> = [];
  for (let i = 0; i < sorted.length && result.length < max; i += step) {
    const p = sorted[i];
    if (p) {
      result.push({ x: p.position.x, y: p.position.y, z: p.position.z, opacity: p.opacity });
    }
  }
  return result;
}

function resolveFetchImpl(fetchImpl?: typeof fetch): typeof fetch {
  const resolvedFetch = fetchImpl ?? globalThis.fetch;
  if (typeof resolvedFetch !== 'function') {
    throw new Error('A fetch implementation is required for navigation agent path generation.');
  }
  return resolvedFetch.bind(globalThis);
}

async function blobToJpegDataUrl(blob: Blob): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_CAPTURE_LONG_SIDE / Math.max(bitmap.width, bitmap.height, 1));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.82);
}
