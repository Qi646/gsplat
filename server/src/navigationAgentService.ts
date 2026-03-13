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

const NAV_TOOLS = [
  {
    function: {
      description:
        'Move the camera along its local axes. Units are fractions of the scene diagonal (1.0 = one full diagonal). Positive forward moves toward the scene center, positive right moves right, positive up moves up.',
      name: 'move',
      parameters: {
        properties: {
          forward: { description: 'Forward/backward displacement (positive = forward, negative = back)', type: 'number' },
          right: { description: 'Left/right displacement (positive = right, negative = left)', type: 'number' },
          up: { description: 'Up/down displacement (positive = up, negative = down)', type: 'number' },
        },
        required: ['forward', 'right', 'up'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description: 'Rotate the camera. Yaw rotates left/right around world Y. Pitch tilts up/down around camera X. Roll tilts around camera Z.',
      name: 'rotate',
      parameters: {
        properties: {
          pitchDeg: { description: 'Pitch in degrees (positive = tilt up, negative = tilt down)', type: 'number' },
          rollDeg: { description: 'Roll in degrees (positive = clockwise)', type: 'number' },
          yawDeg: { description: 'Yaw in degrees (positive = turn right, negative = turn left)', type: 'number' },
        },
        required: ['yawDeg', 'pitchDeg', 'rollDeg'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description:
        'Rotate the camera in-place to face a specific 3D world point. Camera position stays unchanged. Great for reorienting toward a scene subject.',
      name: 'look_at',
      parameters: {
        properties: {
          target: {
            description: 'World-space point to look at',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              z: { type: 'number' },
            },
            required: ['x', 'y', 'z'],
            type: 'object',
          },
        },
        required: ['target'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description:
        'Place the camera on a sphere centered at a 3D world point, at the given azimuth, elevation, and radius. The camera automatically looks at the target. Use this to arc around a subject. Azimuth 0 = north (+Z), 90 = east (+X), 180 = south (-Z), 270 = west (-X). Elevation 0 = equator, 90 = directly above.',
      name: 'orbit',
      parameters: {
        properties: {
          azimuth_deg: { description: 'Azimuth angle in degrees (0=north/+Z, 90=east/+X)', type: 'number' },
          elevation_deg: { description: 'Elevation angle in degrees above equator (0=equator, 90=top)', type: 'number' },
          radius: {
            description: 'Distance from target in scene units. Use bounds size as reference.',
            type: 'number',
          },
          target: {
            description: 'Center point of the orbit sphere',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              z: { type: 'number' },
            },
            required: ['x', 'y', 'z'],
            type: 'object',
          },
        },
        required: ['target', 'azimuth_deg', 'elevation_deg', 'radius'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description: 'Teleport the camera to an exact world-space pose. Use when you know precise coordinates.',
      name: 'set_pose',
      parameters: {
        properties: {
          fov: { description: 'Optional field of view in degrees', type: 'number' },
          position: {
            description: 'World position',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              z: { type: 'number' },
            },
            required: ['x', 'y', 'z'],
            type: 'object',
          },
          quaternion: {
            description: 'Orientation as unit quaternion (x,y,z,w)',
            properties: {
              w: { type: 'number' },
              x: { type: 'number' },
              y: { type: 'number' },
              z: { type: 'number' },
            },
            required: ['x', 'y', 'z', 'w'],
            type: 'object',
          },
        },
        required: ['position', 'quaternion'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description:
        'Record the current camera pose as a keyframe in the path. Call this after positioning the camera where you want a keyframe. Include a short human-readable note for debugging.',
      name: 'place_keyframe',
      parameters: {
        properties: {
          note: { description: 'Optional description of this keyframe (e.g. "wide establishing shot")', type: 'string' },
        },
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description:
        'Capture a screenshot of the current view and start a correction turn. Use this if you are unsure whether your keyframes look good. Can only be called once per session.',
      name: 'capture_and_assess',
      parameters: {
        properties: {
          reason: { description: 'Why you want to assess the current view', type: 'string' },
        },
        required: ['reason'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description: 'End the session. Call this after placing all keyframes. Provide a short summary of the path you created.',
      name: 'done',
      parameters: {
        properties: {
          summary: { description: 'Short description of the camera path you created', type: 'string' },
        },
        required: ['summary'],
        type: 'object',
      },
    },
    type: 'function',
  },
] as const;

function buildSystemPrompt(): string {
  return `You are a camera path planning agent for a 3D Gaussian Splat scene viewer. Your job is to plan an interesting camera path by calling tool functions.

You receive:
- A screenshot of the current camera view
- Up to 512 sampled 3D scene points (x, y, z, opacity) from the splat cloud — use these for spatial reasoning
- Scene bounding box (min/max x,y,z)
- Current camera pose (position, quaternion, fov)
- A user prompt describing the desired camera movement

Your task: Call the provided tools to move the camera to interesting positions and record keyframes. Then call done() when finished.

## Spatial reasoning from point cloud
The scene points give you the actual 3D geometry. Cluster them mentally to find:
- The scene center (centroid of high-opacity points)
- Interesting subjects (dense clusters)
- Floor level (minimum Y among high-density points)
- Scene scale (use bounding box diagonal)

## Orbit math reference
orbit(target, azimuth_deg, elevation_deg, radius) places the camera at:
  x = target.x + radius * cos(elevation_rad) * sin(azimuth_rad)
  y = target.y + radius * sin(elevation_rad)
  z = target.z + radius * cos(elevation_rad) * cos(azimuth_rad)
where azimuth 0=north(+Z), 90=east(+X). Camera looks at target.

## Strategy
1. Start with a good establishing keyframe (wide view of scene)
2. Move through 3-6 interesting positions, placing a keyframe at each
3. Make the path cinematic: vary height, angle, and distance
4. Call done() with a summary

## Constraints
- Place at least 3 keyframes and at most 8 keyframes
- Stay within the scene bounds (expanded by 30% of diagonal)
- Keep camera above floor level
- Call done() or capture_and_assess() as the last action
- Do not call capture_and_assess() more than once`;
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

interface ToolCall {
  function: {
    arguments: string;
    name: string;
  };
  id: string;
  type: 'function';
}

interface ChatCompletionResponse {
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: unknown;
      tool_calls?: ToolCall[];
    };
  }>;
}

function parseToolCallsFromResponse(response: ChatCompletionResponse): NavAction[] {
  const message = response.choices?.[0]?.message;
  if (!message) {
    throw new NavigationAgentError(502, 'Navigation agent returned an empty response.');
  }

  const toolCalls = message.tool_calls;
  if (!toolCalls || toolCalls.length === 0) {
    throw new NavigationAgentError(502, 'Navigation agent returned no tool calls.');
  }

  const actions: NavAction[] = [];
  for (const toolCall of toolCalls) {
    const action = parseToolCall(toolCall);
    if (action) {
      actions.push(action);
    }
  }

  if (actions.length === 0) {
    throw new NavigationAgentError(502, 'Navigation agent returned no valid actions.');
  }

  return actions;
}

function parseToolCall(toolCall: ToolCall): NavAction | null {
  let args: Record<string, unknown>;
  try {
    args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
  } catch {
    return null;
  }

  const name = toolCall.function.name;

  switch (name) {
    case 'move':
      return {
        type: 'move',
        forward: Number(args['forward'] ?? 0),
        right: Number(args['right'] ?? 0),
        up: Number(args['up'] ?? 0),
      };
    case 'rotate':
      return {
        type: 'rotate',
        yawDeg: Number(args['yawDeg'] ?? 0),
        pitchDeg: Number(args['pitchDeg'] ?? 0),
        rollDeg: Number(args['rollDeg'] ?? 0),
      };
    case 'look_at': {
      const target = args['target'] as Record<string, unknown> | undefined;
      if (!target) return null;
      return {
        type: 'look_at',
        target: { x: Number(target['x'] ?? 0), y: Number(target['y'] ?? 0), z: Number(target['z'] ?? 0) },
      };
    }
    case 'orbit': {
      const target = args['target'] as Record<string, unknown> | undefined;
      if (!target) return null;
      return {
        type: 'orbit',
        target: { x: Number(target['x'] ?? 0), y: Number(target['y'] ?? 0), z: Number(target['z'] ?? 0) },
        azimuth_deg: Number(args['azimuth_deg'] ?? 0),
        elevation_deg: Number(args['elevation_deg'] ?? 0),
        radius: Number(args['radius'] ?? 1),
      };
    }
    case 'set_pose': {
      const position = args['position'] as Record<string, unknown> | undefined;
      const quaternion = args['quaternion'] as Record<string, unknown> | undefined;
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
      if (typeof args['fov'] === 'number') {
        action.fov = args['fov'];
      }
      return action;
    }
    case 'place_keyframe':
      return {
        type: 'place_keyframe',
        note: typeof args['note'] === 'string' ? args['note'] : undefined,
      };
    case 'capture_and_assess':
      return {
        type: 'capture_and_assess',
        reason: typeof args['reason'] === 'string' ? args['reason'] : 'Assessment requested',
      };
    case 'done':
      return {
        type: 'done',
        summary: typeof args['summary'] === 'string' ? args['summary'] : 'Camera path complete',
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
      tool_choice: 'auto',
      tools: NAV_TOOLS,
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
    const actions = parseToolCallsFromResponse(completion);

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
