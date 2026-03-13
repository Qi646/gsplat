export interface NavScenePoint {
  opacity: number;
  x: number;
  y: number;
  z: number;
}

export interface NavVector3 {
  x: number;
  y: number;
  z: number;
}

export interface NavQuaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface NavCamera {
  aspect: number;
  fov: number;
  position: NavVector3;
  quaternion: NavQuaternion;
}

export interface NavBounds {
  max: NavVector3;
  min: NavVector3;
}

export type NavAction =
  | { type: 'move'; forward: number; right: number; up: number }
  | { type: 'rotate'; yawDeg: number; pitchDeg: number; rollDeg: number }
  | { type: 'look_at'; target: NavVector3 }
  | { type: 'orbit'; target: NavVector3; azimuth_deg: number; elevation_deg: number; radius: number }
  | { type: 'set_pose'; position: NavVector3; quaternion: NavQuaternion; fov?: number }
  | { type: 'place_keyframe'; note?: string }
  | { type: 'capture_and_assess'; reason: string }
  | { type: 'done'; summary: string };

export interface NavTurnRequest {
  assessmentReason?: string;
  bounds: NavBounds;
  currentCamera: NavCamera;
  imageDataUrl: string;
  prompt: string;
  scenePoints: NavScenePoint[];
  turnNumber: 1 | 2;
}

export interface NavTurnResponse {
  actions: NavAction[];
}

export interface NavPlannerStatus {
  available: boolean;
  model: string | null;
  reason: string | null;
}

export interface OpenAINavigationAgentServiceOptions {
  apiKey?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  model?: string;
}

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_OPENAI_MODEL = 'gpt-5-mini';

function buildSystemPrompt(): string {
  return `You are a camera path planning agent for a 3D Gaussian Splat scene viewer. Plan a cinematic camera path by returning a JSON object.

You receive:
- A screenshot of the current camera view
- Up to 512 sampled 3D scene points (x, y, z, opacity) for spatial reasoning
- Scene bounding box (min/max x,y,z)
- Current camera pose (position, quaternion, fov)
- A user prompt describing the desired camera movement

## Output format
Return ONLY a JSON object with an "actions" array. Example:
{
  "actions": [
    { "type": "orbit", "target": {"x": 0, "y": 0, "z": 0}, "azimuth_deg": 45, "elevation_deg": 20, "radius": 1.5 },
    { "type": "place_keyframe", "note": "wide establishing shot" },
    { "type": "orbit", "target": {"x": 0, "y": 0, "z": 0}, "azimuth_deg": 135, "elevation_deg": 10, "radius": 1.2 },
    { "type": "place_keyframe", "note": "side angle" },
    { "type": "done", "summary": "Slow orbit around the scene" }
  ]
}

## Action types
Camera positioning (always follow with place_keyframe):
- orbit: { type, target:{x,y,z}, azimuth_deg, elevation_deg, radius }
- move: { type, forward, right, up }  — fractions of scene diagonal
- look_at: { type, target:{x,y,z} }  — rotate in place to face a point
- rotate: { type, yawDeg, pitchDeg, rollDeg }
- set_pose: { type, position:{x,y,z}, quaternion:{x,y,z,w}, fov? }

Control:
- place_keyframe: { type, note? }  — records current camera pose as a keyframe
- capture_and_assess: { type, reason }  — request a screenshot review (once only, as last action before done)
- done: { type, summary }  — ends the sequence (must be last action)

## Required pattern
Every positioning action MUST be immediately followed by place_keyframe. End with done.
Correct:   orbit → place_keyframe → orbit → place_keyframe → done
Wrong:     orbit → orbit → done  (no keyframes recorded)

## Spatial reasoning from point cloud
- Scene center: centroid of high-opacity points
- Floor level: minimum Y among dense points
- Scene scale: bounding box diagonal

## Orbit math
orbit(target, azimuth_deg, elevation_deg, radius) places camera at:
  x = target.x + radius * cos(el) * sin(az)
  y = target.y + radius * sin(el)
  z = target.z + radius * cos(el) * cos(az)
azimuth 0=north(+Z), 90=east(+X). Camera auto-looks at target.

## Strategy
1. Wide establishing shot (high elevation, large radius)
2. 2–4 more angles varying height, azimuth, and distance
3. Close detail shot if an interesting subject is found
4. End with done()

## Constraints
- Place 3–8 keyframes
- Stay within scene bounds (expanded 30% of diagonal)
- Keep camera above floor level
- done must be the last action`;
}

function buildUserMessage(request: NavTurnRequest): unknown[] {
  const diagonal = Math.sqrt(
    Math.pow(request.bounds.max.x - request.bounds.min.x, 2) +
      Math.pow(request.bounds.max.y - request.bounds.min.y, 2) +
      Math.pow(request.bounds.max.z - request.bounds.min.z, 2),
  );

  const center = {
    x: (request.bounds.min.x + request.bounds.max.x) / 2,
    y: (request.bounds.min.y + request.bounds.max.y) / 2,
    z: (request.bounds.min.z + request.bounds.max.z) / 2,
  };

  const contextText = [
    `## User prompt\n${request.prompt}`,
    request.turnNumber === 2 && request.assessmentReason
      ? `## Assessment reason (turn 2)\n${request.assessmentReason}\nReview the screenshot and adjust keyframes as needed.`
      : '',
    `## Scene info`,
    `Bounding box: min(${fmt(request.bounds.min.x)}, ${fmt(request.bounds.min.y)}, ${fmt(request.bounds.min.z)}) max(${fmt(request.bounds.max.x)}, ${fmt(request.bounds.max.y)}, ${fmt(request.bounds.max.z)})`,
    `Scene diagonal: ${fmt(diagonal)}`,
    `Scene center: (${fmt(center.x)}, ${fmt(center.y)}, ${fmt(center.z)})`,
    ``,
    `## Current camera`,
    `Position: (${fmt(request.currentCamera.position.x)}, ${fmt(request.currentCamera.position.y)}, ${fmt(request.currentCamera.position.z)})`,
    `FOV: ${fmt(request.currentCamera.fov)}°`,
    ``,
    `## Scene points (${request.scenePoints.length} sampled, format: x,y,z,opacity)`,
    request.scenePoints
      .map(p => `${fmt(p.x)},${fmt(p.y)},${fmt(p.z)},${p.opacity.toFixed(2)}`)
      .join('\n'),
  ]
    .filter(Boolean)
    .join('\n');

  const parts: unknown[] = [
    { type: 'text', text: contextText },
    {
      image_url: { url: request.imageDataUrl },
      type: 'image_url',
    },
  ];

  return parts;
}

function fmt(n: number): string {
  return n.toFixed(3);
}

interface ChatCompletionResponse {
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: string | null;
    };
  }>;
}

function parseActionsFromContent(response: ChatCompletionResponse): NavAction[] {
  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new NavigationAgentError(502, 'Navigation agent returned an empty response.');
  }

  let parsed: unknown;
  try {
    // Strip markdown code fences if present
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    throw new NavigationAgentError(502, 'Navigation agent returned invalid JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new NavigationAgentError(502, 'Navigation agent response is not a JSON object.');
  }

  const rawActions = (parsed as Record<string, unknown>)['actions'];
  if (!Array.isArray(rawActions)) {
    throw new NavigationAgentError(502, 'Navigation agent response missing "actions" array.');
  }

  const actions: NavAction[] = [];
  for (const raw of rawActions) {
    const action = parseRawAction(raw as Record<string, unknown>);
    if (action) actions.push(action);
  }

  if (actions.length === 0) {
    throw new NavigationAgentError(502, 'Navigation agent returned no valid actions.');
  }

  return actions;
}

function parseRawAction(raw: Record<string, unknown>): NavAction | null {
  const type = raw['type'];
  if (typeof type !== 'string') return null;

  switch (type) {
    case 'move':
      return {
        type: 'move',
        forward: Number(raw['forward'] ?? 0),
        right: Number(raw['right'] ?? 0),
        up: Number(raw['up'] ?? 0),
      };
    case 'rotate':
      return {
        type: 'rotate',
        yawDeg: Number(raw['yawDeg'] ?? 0),
        pitchDeg: Number(raw['pitchDeg'] ?? 0),
        rollDeg: Number(raw['rollDeg'] ?? 0),
      };
    case 'look_at': {
      const target = raw['target'] as Record<string, unknown> | undefined;
      if (!target) return null;
      return {
        type: 'look_at',
        target: { x: Number(target['x'] ?? 0), y: Number(target['y'] ?? 0), z: Number(target['z'] ?? 0) },
      };
    }
    case 'orbit': {
      const target = raw['target'] as Record<string, unknown> | undefined;
      if (!target) return null;
      return {
        type: 'orbit',
        target: { x: Number(target['x'] ?? 0), y: Number(target['y'] ?? 0), z: Number(target['z'] ?? 0) },
        azimuth_deg: Number(raw['azimuth_deg'] ?? 0),
        elevation_deg: Number(raw['elevation_deg'] ?? 0),
        radius: Number(raw['radius'] ?? 1),
      };
    }
    case 'set_pose': {
      const position = raw['position'] as Record<string, unknown> | undefined;
      const quaternion = raw['quaternion'] as Record<string, unknown> | undefined;
      if (!position || !quaternion) return null;
      const action: Extract<NavAction, { type: 'set_pose' }> = {
        type: 'set_pose',
        position: { x: Number(position['x'] ?? 0), y: Number(position['y'] ?? 0), z: Number(position['z'] ?? 0) },
        quaternion: {
          x: Number(quaternion['x'] ?? 0),
          y: Number(quaternion['y'] ?? 0),
          z: Number(quaternion['z'] ?? 0),
          w: Number(quaternion['w'] ?? 1),
        },
      };
      if (typeof raw['fov'] === 'number') action.fov = raw['fov'];
      return action;
    }
    case 'place_keyframe':
      return {
        type: 'place_keyframe',
        note: typeof raw['note'] === 'string' ? raw['note'] : undefined,
      };
    case 'capture_and_assess':
      return {
        type: 'capture_and_assess',
        reason: typeof raw['reason'] === 'string' ? raw['reason'] : 'Assessment requested',
      };
    case 'done':
      return {
        type: 'done',
        summary: typeof raw['summary'] === 'string' ? raw['summary'] : 'Camera path complete',
      };
    default:
      return null;
  }
}

export class NavigationAgentError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'NavigationAgentError';
    this.statusCode = statusCode;
  }
}

export class OpenAINavigationAgentService {
  private readonly apiKey?: string;
  private readonly baseUrl?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly model?: string;

  constructor(options: OpenAINavigationAgentServiceOptions = {}) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.model = options.model;
  }

  getStatus(): NavPlannerStatus {
    const apiKey = this.apiKey ?? process.env['OPENAI_API_KEY'];
    const model = this.model ?? process.env['OPENAI_MODEL'] ?? DEFAULT_OPENAI_MODEL;
    const available = Boolean(apiKey);
    return {
      available,
      model,
      reason: available
        ? null
        : 'Navigation agent is disabled because OPENAI_API_KEY is not configured on the server.',
    };
  }

  async planTurn(request: NavTurnRequest): Promise<NavTurnResponse> {
    const apiKey = this.requireApiKey();
    const model = this.resolveModel();

    const body = {
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserMessage(request) },
      ],
      model,
      response_format: { type: 'json_object' },
    };

    const response = await this.fetchImpl(
      `${(this.baseUrl ?? process.env['OPENAI_BASE_URL'] ?? DEFAULT_OPENAI_BASE_URL).replace(/\/$/, '')}/chat/completions`,
      {
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new NavigationAgentError(502, `Navigation agent API request failed (${response.status}): ${text.slice(0, 200)}`);
    }

    const completion = (await response.json()) as ChatCompletionResponse;
    const actions = parseActionsFromContent(completion);

    return { actions };
  }

  private resolveModel(): string {
    return this.model ?? process.env['OPENAI_MODEL'] ?? DEFAULT_OPENAI_MODEL;
  }

  private requireApiKey(): string {
    const apiKey = this.apiKey ?? process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      throw new NavigationAgentError(503, 'Navigation agent is not configured: OPENAI_API_KEY is missing.');
    }
    return apiKey;
  }
}
