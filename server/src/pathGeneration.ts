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
  role: 'current' | 'requested' | 'scout';
  width: number;
}

export interface PathGenerationRequest {
  captures: PathGenerationCapture[];
  currentCamera: PathGenerationCamera;
  pathTail: PathGenerationPathTail | null;
  plannerHistory: PathGenerationPlannerHistoryStep[];
  prompt: string;
  remainingStepBudget: number;
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
  status: 'complete';
  shotSpec: PathGenerationShotSpec;
  subjectLocalizations: PathGenerationSubjectLocalization[];
  warning?: string;
}

export interface PathGenerationNeedsCapturesResponse {
  message: string;
  requestedCaptures: PathGenerationCaptureRequest[];
  status: 'needs-captures';
  warning?: string;
}

export interface PathGenerationCaptureRequest {
  captureId: string;
  forwardOffsetScale?: number;
  lateralOffsetScale?: number;
  pitchDegrees?: number;
  reason: string;
  referenceCaptureId: string;
  verticalOffsetScale?: number;
  yawDegrees?: number;
}

export interface PathGenerationPlannerHistoryStep {
  message: string;
  requestedCaptures: PathGenerationCaptureRequest[];
}

export type PathGenerationPlannerResponse = PathGenerationResponse | PathGenerationNeedsCapturesResponse;

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
  generatePathPlan: (request: unknown) => Promise<PathGenerationPlannerResponse>;
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
  message?: string;
  requestedCaptures: PathGenerationCaptureRequest[];
  shotSpec: PathGenerationShotSpec | null;
  status: 'complete' | 'needs-captures';
  subjectLocalizations: PathGenerationSubjectLocalization[];
  unsupportedReason?: string;
  warning?: string;
}

type UnknownRecord = Record<string, unknown>;

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';
const MAX_CAPTURE_REQUESTS_PER_STEP = 3;

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

  async generatePathPlan(request: unknown): Promise<PathGenerationPlannerResponse> {
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

    if (parsedPlan.status === 'needs-captures') {
      if (parsedRequest.remainingStepBudget <= 1) {
        throw new PathGenerationError(
          400,
          'The planner still needs more context after the current capture budget. Reframe the subject and try again.',
        );
      }

      validateCaptureRequests(parsedPlan.requestedCaptures, parsedRequest.captures);
      return {
        message: parsedPlan.message ?? 'The planner needs a few additional targeted captures before it can finish the orbit.',
        requestedCaptures: parsedPlan.requestedCaptures,
        status: 'needs-captures',
        warning: parsedPlan.warning,
      };
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
      status: 'complete',
      subjectLocalizations: parsedPlan.subjectLocalizations,
      warning: parsedPlan.warning,
    };
  }
}

export function parseModelPathPlan(input: unknown): ModelPathPlan {
  if (!isRecord(input)) {
    throw new PathGenerationError(502, 'Vision planner returned a non-object response.');
  }

  const status = parseModelPathPlanStatus(input);
  const rawLocalizations = input['subjectLocalizations'];
  const rawRequestedCaptures = input['requestedCaptures'];

  return {
    message: typeof input['message'] === 'string' && input['message'].trim().length > 0
      ? input['message']
      : undefined,
    requestedCaptures: status === 'needs-captures'
      ? parseRequestedCaptures(rawRequestedCaptures)
      : [],
    shotSpec: input['shotSpec'] === null || input['shotSpec'] === undefined ? null : parseShotSpec(input['shotSpec']),
    status,
    subjectLocalizations: status === 'complete'
      ? parseSubjectLocalizations(rawLocalizations)
      : [],
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
  if (!Array.isArray(rawCaptures) || rawCaptures.length < 1) {
    throw new PathGenerationError(400, 'Path-generation requests must include at least one capture.');
  }

  return {
    captures: rawCaptures.map((capture, index) => parseCapture(capture, `captures[${index}]`)),
    currentCamera: parseCamera(input['currentCamera'], 'currentCamera'),
    pathTail: input['pathTail'] === null || input['pathTail'] === undefined
      ? null
      : parsePathTail(input['pathTail'], 'pathTail'),
    plannerHistory: parsePlannerHistory(input['plannerHistory']),
    prompt: readString(input, 'prompt', 'request'),
    remainingStepBudget: input['remainingStepBudget'] === undefined
      ? 1
      : readPositiveInteger(input, 'remainingStepBudget', 'request'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
  };
}

function buildSystemPrompt(): string {
  return [
    'You are an iterative camera path planner for a 3D scene viewer.',
    'You only support orbit-style shots.',
    'Return JSON only.',
    'When you have enough evidence, return keys status, shotSpec, subjectLocalizations, warning, unsupportedReason.',
    'When you need more evidence, return keys status, message, requestedCaptures, warning, unsupportedReason.',
    'status must be "complete" or "needs-captures".',
    'shotSpec.pathType must be "orbit" when the prompt is supported.',
    'orientationMode must be "look-at-subject" when the user says the camera should stay focused on the subject.',
    'orientationMode must be "look-forward" when the user says the camera should face forward or along the path.',
    'Set fullOrbit to true only when the user explicitly requests a full circle, all the way around, or 360.',
    'direction may be omitted when the user does not specify clockwise or counterclockwise.',
    'verticalBias may be omitted unless the user clearly asks for a high or low angle.',
    'subjectLocalizations should contain one entry per image where the requested subject is visible, with captureId, pixelX, pixelY, confidence.',
    'Use status "needs-captures" when the subject is occluded, ambiguous, not visible in enough views, or lacks enough parallax for reliable triangulation.',
    `requestedCaptures may contain at most ${MAX_CAPTURE_REQUESTS_PER_STEP} entries.`,
    'Each requested capture must include captureId, referenceCaptureId, and reason.',
    'referenceCaptureId must refer to an existing capture from the input.',
    'Requested offsets are camera-local controls: lateralOffsetScale moves right/left, verticalOffsetScale moves up/down, forwardOffsetScale moves forward/back, yawDegrees rotates around camera-local up, and pitchDegrees rotates around camera-local right.',
    'Keep requested moves small, targeted, and close to the user-framed context. Prefer lateral or slight vertical parallax before wide moves.',
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
        `Planner history: ${JSON.stringify(request.plannerHistory)}`,
        `Remaining step budget: ${request.remainingStepBudget}`,
        `Available capture ids: ${request.captures.map(capture => capture.id).join(', ')}`,
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
  if (role !== 'current' && role !== 'requested' && role !== 'scout') {
    throw new PathGenerationError(400, `${context}.role must be "current", "requested", or "scout".`);
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

function parseCaptureRequest(value: unknown, context: string): PathGenerationCaptureRequest {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  return {
    captureId: readString(value, 'captureId', context),
    forwardOffsetScale: readOptionalFiniteNumber(value, 'forwardOffsetScale', context),
    lateralOffsetScale: readOptionalFiniteNumber(value, 'lateralOffsetScale', context),
    pitchDegrees: readOptionalFiniteNumber(value, 'pitchDegrees', context),
    reason: readString(value, 'reason', context),
    referenceCaptureId: readString(value, 'referenceCaptureId', context),
    verticalOffsetScale: readOptionalFiniteNumber(value, 'verticalOffsetScale', context),
    yawDegrees: readOptionalFiniteNumber(value, 'yawDegrees', context),
  };
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

function parseModelPathPlanStatus(value: UnknownRecord): 'complete' | 'needs-captures' {
  const rawStatus = value['status'];
  if (rawStatus === 'complete' || rawStatus === 'needs-captures') {
    return rawStatus;
  }

  if (value['shotSpec'] !== undefined || value['subjectLocalizations'] !== undefined) {
    return 'complete';
  }

  if (value['requestedCaptures'] !== undefined) {
    return 'needs-captures';
  }

  throw new PathGenerationError(502, 'Vision planner response is missing status.');
}

function parsePlannerHistory(value: unknown): PathGenerationPlannerHistoryStep[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new PathGenerationError(400, 'request.plannerHistory must be an array.');
  }

  return value.map((entry, index) => parsePlannerHistoryStep(entry, `plannerHistory[${index}]`));
}

function parsePlannerHistoryStep(value: unknown, context: string): PathGenerationPlannerHistoryStep {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    message: readString(value, 'message', context),
    requestedCaptures: parseRequestedCaptures(value['requestedCaptures'], `${context}.requestedCaptures`),
  };
}

function parseRequestedCaptures(
  value: unknown,
  context = 'requestedCaptures',
): PathGenerationCaptureRequest[] {
  if (!Array.isArray(value)) {
    throw new PathGenerationError(502, `Vision planner response is missing ${context}.`);
  }

  return value.map((entry, index) => parseCaptureRequest(entry, `${context}[${index}]`));
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

function parseSubjectLocalizations(value: unknown): PathGenerationSubjectLocalization[] {
  if (!Array.isArray(value)) {
    throw new PathGenerationError(502, 'Vision planner response is missing subjectLocalizations.');
  }

  return value.map((entry, index) => parseLocalization(entry, `subjectLocalizations[${index}]`));
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

function readOptionalFiniteNumber(record: UnknownRecord, key: string, context: string): number | undefined {
  const value = record[key];
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new PathGenerationError(502, `${context}.${key} must be a finite number when present.`);
  }

  return value;
}

function readPositiveInteger(record: UnknownRecord, key: string, context: string): number {
  const value = readFiniteNumber(record, key, context);
  if (!Number.isInteger(value) || value <= 0) {
    throw new PathGenerationError(400, `${context}.${key} must be a positive integer.`);
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

function validateCaptureRequests(
  requestedCaptures: PathGenerationCaptureRequest[],
  captures: PathGenerationCapture[],
): void {
  if (requestedCaptures.length === 0) {
    throw new PathGenerationError(502, 'Vision planner requested additional captures but did not describe any.');
  }

  if (requestedCaptures.length > MAX_CAPTURE_REQUESTS_PER_STEP) {
    throw new PathGenerationError(
      502,
      `Vision planner requested too many additional captures (${requestedCaptures.length}).`,
    );
  }

  const knownCaptureIds = new Set(captures.map(capture => capture.id));
  const requestedIds = new Set<string>();
  for (const request of requestedCaptures) {
    if (!knownCaptureIds.has(request.referenceCaptureId)) {
      throw new PathGenerationError(
        502,
        `Vision planner referenced an unknown capture for follow-up context: ${request.referenceCaptureId}`,
      );
    }

    if (knownCaptureIds.has(request.captureId) || requestedIds.has(request.captureId)) {
      throw new PathGenerationError(
        502,
        `Vision planner reused a capture id for a follow-up request: ${request.captureId}`,
      );
    }

    if (
      request.forwardOffsetScale === undefined
      && request.lateralOffsetScale === undefined
      && request.verticalOffsetScale === undefined
      && request.yawDegrees === undefined
      && request.pitchDegrees === undefined
    ) {
      throw new PathGenerationError(
        502,
        `Vision planner returned a follow-up capture without any camera adjustment: ${request.captureId}`,
      );
    }

    requestedIds.add(request.captureId);
  }
}
