export type AgenticOrientationMode = 'look-at-subject' | 'look-forward';
export type AgenticOrbitDirection = 'clockwise' | 'counterclockwise';
export type AgenticVerticalBias = 'low' | 'mid' | 'high';

export interface PathGenerationCamera {
  aspect: number;
  fov: number;
  position: PathGenerationVector3;
  quaternion: PathGenerationQuaternion;
}

export interface PathGenerationCapture {
  camera: PathGenerationCamera;
  height: number;
  id: string;
  imageDataUrl: string;
  role: 'current' | 'scout';
  width: number;
}

export interface PathGenerationRequest {
  captures: PathGenerationCapture[];
  currentCamera: PathGenerationCamera;
  pathTail: PathGenerationPathTail | null;
  prompt: string;
  sceneBounds: PathGenerationBounds;
}

export interface PathGenerationPathTail {
  fov: number;
  position: PathGenerationVector3;
  quaternion: PathGenerationQuaternion;
  time: number;
}

export interface PathGenerationBounds {
  max: PathGenerationVector3;
  min: PathGenerationVector3;
}

export interface PathGenerationResponse {
  shotSpec: PathGenerationShotSpec;
  subjectLocalizations: PathGenerationSubjectLocalization[];
  warning?: string;
}

export interface PathGenerationShotSpec {
  pathType: 'orbit';
  orientationMode: AgenticOrientationMode;
  fullOrbit: boolean;
  direction?: AgenticOrbitDirection;
  durationSeconds?: number;
  verticalBias?: AgenticVerticalBias;
}

export interface PathGenerationSubjectLocalization {
  captureId: string;
  confidence: number;
  pixelX: number;
  pixelY: number;
}

export interface PathGenerationPlanner {
  generatePathPlan: (request: unknown) => Promise<PathGenerationResponse>;
  getStatus: () => PathGenerationPlannerStatus;
}

export interface OpenAIVisionPathPlannerOptions {
  apiKey?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  model?: string;
}

export interface PathGenerationVector3 {
  x: number;
  y: number;
  z: number;
}

export interface PathGenerationQuaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface PathGenerationPlannerStatus {
  available: boolean;
  model: string | null;
  reason: string | null;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
}

interface ModelPathPlan {
  shotSpec: PathGenerationShotSpec | null;
  subjectLocalizations: PathGenerationSubjectLocalization[];
  unsupportedReason?: string;
  warning?: string;
}

type UnknownRecord = Record<string, unknown>;

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';

export class PathGenerationError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'PathGenerationError';
    this.statusCode = statusCode;
  }
}

export class OpenAIVisionPathPlanner implements PathGenerationPlanner {
  private readonly apiKey?: string;
  private readonly baseUrl?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly model?: string;

  constructor(options: OpenAIVisionPathPlannerOptions = {}) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.model = options.model;
  }

  getStatus(): PathGenerationPlannerStatus {
    const apiKey = this.apiKey ?? process.env['OPENAI_API_KEY'];
    const model = this.model ?? process.env['OPENAI_MODEL'] ?? DEFAULT_OPENAI_MODEL;

    if (!apiKey) {
      return {
        available: false,
        model,
        reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
      };
    }

    return {
      available: true,
      model,
      reason: null,
    };
  }

  async generatePathPlan(request: unknown): Promise<PathGenerationResponse> {
    const parsedRequest = parsePathGenerationRequest(request);
    const status = this.getStatus();
    if (!status.available) {
      throw new PathGenerationError(503, status.reason ?? 'Agentic path generation is not configured.');
    }
    const apiKey = this.apiKey ?? process.env['OPENAI_API_KEY'];

    const response = await this.fetchImpl(
      `${(this.baseUrl ?? process.env['OPENAI_BASE_URL'] ?? DEFAULT_OPENAI_BASE_URL).replace(/\/$/, '')}/chat/completions`,
      {
        body: JSON.stringify({
          max_tokens: 700,
          messages: [
            {
              content: buildSystemPrompt(),
              role: 'system',
            },
            {
              content: buildUserContent(parsedRequest),
              role: 'user',
            },
          ],
          model: this.model ?? process.env['OPENAI_MODEL'] ?? DEFAULT_OPENAI_MODEL,
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    if (!response.ok) {
      const failureText = await response.text();
      throw new PathGenerationError(
        502,
        `Vision planning request failed (${response.status}): ${failureText.slice(0, 200)}`.trim(),
      );
    }

    const payload = await response.json() as ChatCompletionResponse;
    const completionText = extractCompletionText(payload);
    const parsedPlan = parseModelPathPlan(JSON.parse(stripJsonFences(completionText)) as unknown);

    if (parsedPlan.unsupportedReason) {
      throw new PathGenerationError(400, parsedPlan.unsupportedReason);
    }

    if (!parsedPlan.shotSpec) {
      throw new PathGenerationError(502, 'Vision planner did not return a usable orbit shot specification.');
    }

    if (parsedPlan.subjectLocalizations.length < 2) {
      throw new PathGenerationError(
        400,
        'The planner could not localize the requested subject in enough captured views.',
      );
    }

    return {
      shotSpec: parsedPlan.shotSpec,
      subjectLocalizations: parsedPlan.subjectLocalizations,
      warning: parsedPlan.warning,
    };
  }
}

export function parseModelPathPlan(input: unknown): ModelPathPlan {
  if (!isRecord(input)) {
    throw new PathGenerationError(502, 'Vision planner returned a non-object response.');
  }

  const rawLocalizations = input['subjectLocalizations'];
  if (!Array.isArray(rawLocalizations)) {
    throw new PathGenerationError(502, 'Vision planner response is missing subjectLocalizations.');
  }

  return {
    shotSpec: input['shotSpec'] === null || input['shotSpec'] === undefined ? null : parseShotSpec(input['shotSpec']),
    subjectLocalizations: rawLocalizations.map((entry, index) =>
      parseLocalization(entry, `subjectLocalizations[${index}]`)),
    unsupportedReason: typeof input['unsupportedReason'] === 'string' && input['unsupportedReason'].trim().length > 0
      ? input['unsupportedReason']
      : undefined,
    warning: typeof input['warning'] === 'string' && input['warning'].trim().length > 0
      ? input['warning']
      : undefined,
  };
}

export function parsePathGenerationRequest(input: unknown): PathGenerationRequest {
  if (!isRecord(input)) {
    throw new PathGenerationError(400, 'Path-generation request body must be a JSON object.');
  }

  const rawCaptures = input['captures'];
  if (!Array.isArray(rawCaptures) || rawCaptures.length < 2) {
    throw new PathGenerationError(400, 'Path-generation requests must include at least two captures.');
  }

  return {
    captures: rawCaptures.map((capture, index) => parseCapture(capture, `captures[${index}]`)),
    currentCamera: parseCamera(input['currentCamera'], 'currentCamera'),
    pathTail: input['pathTail'] === null || input['pathTail'] === undefined
      ? null
      : parsePathTail(input['pathTail'], 'pathTail'),
    prompt: readString(input, 'prompt', 'request'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
  };
}

function buildSystemPrompt(): string {
  return [
    'You are a camera path planner for a 3D scene viewer.',
    'You only support orbit-style shots.',
    'Return JSON only with keys shotSpec, subjectLocalizations, warning, unsupportedReason.',
    'shotSpec.pathType must be "orbit" when the prompt is supported.',
    'orientationMode must be "look-at-subject" when the user says the camera should stay focused on the subject.',
    'orientationMode must be "look-forward" when the user says the camera should face forward or along the path.',
    'Set fullOrbit to true only when the user explicitly requests a full circle, all the way around, or 360.',
    'direction may be omitted when the user does not specify clockwise or counterclockwise.',
    'verticalBias may be omitted unless the user clearly asks for a high or low angle.',
    'subjectLocalizations should contain one entry per image where the requested subject is visible, with captureId, pixelX, pixelY, confidence.',
    'If the prompt requests a non-orbit motion, set unsupportedReason and leave shotSpec null.',
    'Do not invent captures that are not present in the input.',
  ].join(' ');
}

function buildUserContent(request: PathGenerationRequest): Array<Record<string, unknown>> {
  const content: Array<Record<string, unknown>> = [
    {
      text: [
        `Prompt: ${request.prompt}`,
        `Scene bounds: ${JSON.stringify(request.sceneBounds)}`,
        `Current camera: ${JSON.stringify(request.currentCamera)}`,
        `Path tail: ${JSON.stringify(request.pathTail)}`,
      ].join('\n'),
      type: 'text',
    },
  ];

  for (const capture of request.captures) {
    content.push({
      text: `Capture ${capture.id} (${capture.role}) metadata: ${JSON.stringify({
        camera: capture.camera,
        height: capture.height,
        width: capture.width,
      })}`,
      type: 'text',
    });
    content.push({
      image_url: {
        url: capture.imageDataUrl,
      },
      type: 'image_url',
    });
  }

  return content;
}

function extractCompletionText(payload: ChatCompletionResponse): string {
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim().length > 0) {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map(entry => (isRecord(entry) && typeof entry['text'] === 'string') ? entry['text'] : '')
      .join('\n')
      .trim();
    if (text.length > 0) {
      return text;
    }
  }

  throw new PathGenerationError(502, 'Vision planner returned an empty completion.');
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function parseBounds(value: unknown, context: string): PathGenerationBounds {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    max: parseVector3(value['max'], `${context}.max`),
    min: parseVector3(value['min'], `${context}.min`),
  };
}

function parseCamera(value: unknown, context: string): PathGenerationCamera {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    aspect: readFiniteNumber(value, 'aspect', context),
    fov: readFiniteNumber(value, 'fov', context),
    position: parseVector3(value['position'], `${context}.position`),
    quaternion: parseQuaternion(value['quaternion'], `${context}.quaternion`),
  };
}

function parseCapture(value: unknown, context: string): PathGenerationCapture {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  const role = readString(value, 'role', context);
  if (role !== 'current' && role !== 'scout') {
    throw new PathGenerationError(400, `${context}.role must be "current" or "scout".`);
  }

  const imageDataUrl = readString(value, 'imageDataUrl', context);
  if (!imageDataUrl.startsWith('data:image/')) {
    throw new PathGenerationError(400, `${context}.imageDataUrl must be an image data URL.`);
  }

  return {
    camera: parseCamera(value['camera'], `${context}.camera`),
    height: readPositiveNumber(value, 'height', context),
    id: readString(value, 'id', context),
    imageDataUrl,
    role,
    width: readPositiveNumber(value, 'width', context),
  };
}

function parseDirection(value: unknown, context: string): AgenticOrbitDirection {
  if (value !== 'clockwise' && value !== 'counterclockwise') {
    throw new PathGenerationError(502, `${context} must be "clockwise" or "counterclockwise".`);
  }

  return value;
}

function parseLocalization(value: unknown, context: string): PathGenerationSubjectLocalization {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  return {
    captureId: readString(value, 'captureId', context),
    confidence: readFiniteNumber(value, 'confidence', context),
    pixelX: readFiniteNumber(value, 'pixelX', context),
    pixelY: readFiniteNumber(value, 'pixelY', context),
  };
}

function parsePathTail(value: unknown, context: string): PathGenerationPathTail {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    fov: readFiniteNumber(value, 'fov', context),
    position: parseVector3(value['position'], `${context}.position`),
    quaternion: parseQuaternion(value['quaternion'], `${context}.quaternion`),
    time: readFiniteNumber(value, 'time', context),
  };
}

function parseQuaternion(value: unknown, context: string): PathGenerationQuaternion {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    w: readFiniteNumber(value, 'w', context),
    x: readFiniteNumber(value, 'x', context),
    y: readFiniteNumber(value, 'y', context),
    z: readFiniteNumber(value, 'z', context),
  };
}

function parseShotSpec(value: unknown): PathGenerationShotSpec {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, 'shotSpec must be an object.');
  }

  const pathType = readString(value, 'pathType', 'shotSpec');
  if (pathType !== 'orbit') {
    throw new PathGenerationError(502, `Unsupported shotSpec.pathType: ${pathType}`);
  }

  const orientationMode = readString(value, 'orientationMode', 'shotSpec');
  if (orientationMode !== 'look-at-subject' && orientationMode !== 'look-forward') {
    throw new PathGenerationError(502, `Unsupported shotSpec.orientationMode: ${orientationMode}`);
  }

  const fullOrbit = readBoolean(value, 'fullOrbit', 'shotSpec');
  const directionValue = value['direction'];
  const durationValue = value['durationSeconds'];
  const verticalBiasValue = value['verticalBias'];

  return {
    direction: directionValue === undefined || directionValue === null
      ? undefined
      : parseDirection(directionValue, 'shotSpec.direction'),
    durationSeconds: durationValue === undefined || durationValue === null
      ? undefined
      : readFiniteNumber(value, 'durationSeconds', 'shotSpec'),
    fullOrbit,
    orientationMode,
    pathType: 'orbit',
    verticalBias: verticalBiasValue === undefined || verticalBiasValue === null
      ? undefined
      : parseVerticalBias(verticalBiasValue, 'shotSpec.verticalBias'),
  };
}

function parseVector3(value: unknown, context: string): PathGenerationVector3 {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    x: readFiniteNumber(value, 'x', context),
    y: readFiniteNumber(value, 'y', context),
    z: readFiniteNumber(value, 'z', context),
  };
}

function parseVerticalBias(value: unknown, context: string): AgenticVerticalBias {
  if (value !== 'low' && value !== 'mid' && value !== 'high') {
    throw new PathGenerationError(502, `${context} must be "low", "mid", or "high".`);
  }

  return value;
}

function readBoolean(record: UnknownRecord, key: string, context: string): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') {
    throw new PathGenerationError(400, `${context}.${key} must be a boolean.`);
  }

  return value;
}

function readFiniteNumber(record: UnknownRecord, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new PathGenerationError(400, `${context}.${key} must be a finite number.`);
  }

  return value;
}

function readPositiveNumber(record: UnknownRecord, key: string, context: string): number {
  const value = readFiniteNumber(record, key, context);
  if (!(value > 0)) {
    throw new PathGenerationError(400, `${context}.${key} must be greater than zero.`);
  }

  return value;
}

function readString(record: UnknownRecord, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new PathGenerationError(400, `${context}.${key} must be a non-empty string.`);
  }

  return value;
}

function stripJsonFences(value: string): string {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}
