export type AgenticOrientationMode = 'look-at-subject' | 'look-forward';
export type AgenticOrbitDirection = 'clockwise' | 'counterclockwise';
export type AgenticVerticalBias = 'low' | 'mid' | 'high';
export type PathGenerationPathMode = 'subject-centric' | 'route-following' | 'multi-subject' | 'ambiguous';
export type PathGenerationSegmentType = 'hold' | 'arc' | 'dolly' | 'pedestal';
export type PathGenerationDollyDirection = 'in' | 'out';
export type PathGenerationPedestalDirection = 'up' | 'down';

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

export interface PathGenerationBounds {
  max: PathGenerationVector3;
  min: PathGenerationVector3;
}

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

export interface PathGenerationPathTail {
  fov: number;
  position: PathGenerationVector3;
  quaternion: PathGenerationQuaternion;
  time: number;
}

export interface PathGenerationPromptIntent {
  continuousPath: true;
  orientationPreference: AgenticOrientationMode;
  pathMode: PathGenerationPathMode;
  requestedMoveTypes: PathGenerationSegmentType[];
  subjectHint: string | null;
  targetDurationSeconds: number | null;
  tone: string | null;
}

export interface PathGenerationSubjectLocalization {
  captureId: string;
  confidence: number;
  pixelX: number;
  pixelY: number;
}

export interface PathGenerationGroundRequest {
  captureRound: number;
  captures: PathGenerationCapture[];
  currentCamera: PathGenerationCamera;
  pathTail: PathGenerationPathTail | null;
  prompt: string;
  sceneBounds: PathGenerationBounds;
}

export interface PathGenerationGroundResponse {
  intent: PathGenerationPromptIntent;
  pathMode: PathGenerationPathMode;
  subjectLocalizations: PathGenerationSubjectLocalization[];
  unsupportedReason?: string;
  warning?: string;
}

export interface PathGenerationGroundedSubject {
  anchor: PathGenerationVector3;
  basisForward: PathGenerationVector3;
  basisUp: PathGenerationVector3;
  captureCount: number;
  confidence: number;
  meanResidual: number;
  sceneScale: number;
}

export interface PathGenerationBaseSegmentPlan {
  durationSeconds: number;
  fovDelta?: number;
  lookMode: AgenticOrientationMode;
  segmentType: PathGenerationSegmentType;
}

export interface PathGenerationHoldSegmentPlan extends PathGenerationBaseSegmentPlan {
  segmentType: 'hold';
}

export interface PathGenerationArcSegmentPlan extends PathGenerationBaseSegmentPlan {
  direction?: AgenticOrbitDirection;
  segmentType: 'arc';
  sweepDegrees?: number;
  verticalBias?: AgenticVerticalBias;
}

export interface PathGenerationDollySegmentPlan extends PathGenerationBaseSegmentPlan {
  distanceScale?: number;
  segmentType: 'dolly';
  travelDirection?: PathGenerationDollyDirection;
  verticalBias?: AgenticVerticalBias;
}

export interface PathGenerationPedestalSegmentPlan extends PathGenerationBaseSegmentPlan {
  heightScale?: number;
  segmentType: 'pedestal';
  travelDirection?: PathGenerationPedestalDirection;
}

export type PathGenerationSegmentPlan =
  | PathGenerationHoldSegmentPlan
  | PathGenerationArcSegmentPlan
  | PathGenerationDollySegmentPlan
  | PathGenerationPedestalSegmentPlan;

export interface PathGenerationComposeRequest {
  currentCamera: PathGenerationCamera;
  groundedSubject: PathGenerationGroundedSubject;
  intent: PathGenerationPromptIntent;
  pathTail: PathGenerationPathTail | null;
  sceneBounds: PathGenerationBounds;
  validationFeedback?: string[];
}

export interface PathGenerationComposeResponse {
  segments: PathGenerationSegmentPlan[];
  summary: string;
  warning?: string;
}

export interface PathGenerationPlannerStatus {
  available: boolean;
  capabilities: {
    maxCaptureRounds: number;
    maxSegments: number;
    segmentTypes: PathGenerationSegmentType[];
    supportedPathModes: PathGenerationPathMode[];
    unsupportedPathModes: PathGenerationPathMode[];
  };
  model: string | null;
  plannerVersion: 'multistep-v1';
  reason: string | null;
}

export interface PathGenerationPlanner {
  composePathPlan: (request: unknown) => Promise<PathGenerationComposeResponse>;
  getStatus: () => PathGenerationPlannerStatus;
  groundPathIntent: (request: unknown) => Promise<PathGenerationGroundResponse>;
}

export interface OpenAIVisionPathPlannerOptions {
  apiKey?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  model?: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: unknown;
      refusal?: unknown;
    };
  }>;
  output?: unknown;
  output_text?: unknown;
}

interface ChatCompletionRequestCompatibility {
  includeReasoningEffort: boolean;
  includeResponseFormat: boolean;
  includeTemperature: boolean;
  tokenBudgetParameter: TokenBudgetParameter;
}

interface PlannerRequestFailureDetails {
  message: string;
  param: string | null;
}

type TokenBudgetParameter = 'max_completion_tokens' | 'max_tokens';
type UnknownRecord = Record<string, unknown>;

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';
const DEFAULT_CHAT_COMPLETION_REQUEST_COMPATIBILITY: ChatCompletionRequestCompatibility = {
  includeReasoningEffort: false,
  includeResponseFormat: true,
  includeTemperature: true,
  tokenBudgetParameter: 'max_completion_tokens',
};
const MAX_CHAT_COMPLETION_COMPATIBILITY_ATTEMPTS = 4;
const PLANNER_COMPLETION_TOKEN_LIMIT = 1800;
const STATUS_CAPABILITIES = {
  maxCaptureRounds: 2,
  maxSegments: 4,
  segmentTypes: ['hold', 'arc', 'dolly', 'pedestal'] as PathGenerationSegmentType[],
  supportedPathModes: ['subject-centric'] as PathGenerationPathMode[],
  unsupportedPathModes: ['route-following', 'multi-subject', 'ambiguous'] as PathGenerationPathMode[],
};

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
        capabilities: STATUS_CAPABILITIES,
        model,
        plannerVersion: 'multistep-v1',
        reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
      };
    }

    return {
      available: true,
      capabilities: STATUS_CAPABILITIES,
      model,
      plannerVersion: 'multistep-v1',
      reason: null,
    };
  }

  async groundPathIntent(request: unknown): Promise<PathGenerationGroundResponse> {
    const parsedRequest = parsePathGenerationGroundRequest(request);
    const apiKey = this.requireApiKey();
    const completion = await this.requestChatCompletion(
      buildGroundChatCompletionRequestBody(parsedRequest, this.resolveModel()),
      apiKey,
    );
    const response = parsePathGenerationGroundModelResponse(
      JSON.parse(stripJsonFences(extractCompletionText(completion))) as unknown,
      parsedRequest.captures,
    );

    if (response.pathMode !== 'subject-centric' && !response.unsupportedReason) {
      response.unsupportedReason = defaultUnsupportedReasonForPathMode(response.pathMode);
    }

    return response;
  }

  async composePathPlan(request: unknown): Promise<PathGenerationComposeResponse> {
    const parsedRequest = parsePathGenerationComposeRequest(request);
    const apiKey = this.requireApiKey();

    if (parsedRequest.intent.pathMode !== 'subject-centric') {
      throw new PathGenerationError(
        400,
        defaultUnsupportedReasonForPathMode(parsedRequest.intent.pathMode),
      );
    }

    const completion = await this.requestChatCompletion(
      buildComposeChatCompletionRequestBody(parsedRequest, this.resolveModel()),
      apiKey,
    );
    return parsePathGenerationComposeModelResponse(
      JSON.parse(stripJsonFences(extractCompletionText(completion))) as unknown,
    );
  }

  private resolveModel(): string {
    return this.model ?? process.env['OPENAI_MODEL'] ?? DEFAULT_OPENAI_MODEL;
  }

  private requireApiKey(): string {
    const status = this.getStatus();
    if (!status.available) {
      throw new PathGenerationError(503, status.reason ?? 'Agentic path generation is not configured.');
    }

    const apiKey = this.apiKey ?? process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      throw new PathGenerationError(503, 'Agentic path generation is not configured.');
    }
    return apiKey;
  }

  private async requestChatCompletion(
    body: UnknownRecord,
    apiKey: string,
  ): Promise<ChatCompletionResponse> {
    const model = this.resolveModel();
    let compatibility = getInitialChatCompletionRequestCompatibility(model);

    for (let attemptIndex = 0; attemptIndex < MAX_CHAT_COMPLETION_COMPATIBILITY_ATTEMPTS; attemptIndex += 1) {
      const response = await this.fetchChatCompletion(
        applyCompatibilityToChatCompletionBody(body, compatibility),
        apiKey,
      );
      if (response.ok) {
        return await response.json() as ChatCompletionResponse;
      }

      const failureText = await response.text();
      const nextCompatibility = resolveChatCompletionRequestCompatibility(response.status, failureText, compatibility);
      if (!nextCompatibility) {
        throw buildPlanningRequestFailure(response.status, failureText);
      }

      compatibility = nextCompatibility;
    }

    throw new PathGenerationError(
      502,
      'Vision planning request failed after exhausting request compatibility fallbacks.',
    );
  }

  private async fetchChatCompletion(body: UnknownRecord, apiKey: string): Promise<Response> {
    return await this.fetchImpl(
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
  }
}

export function parsePathGenerationGroundRequest(input: unknown): PathGenerationGroundRequest {
  if (!isRecord(input)) {
    throw new PathGenerationError(400, 'Path-generation ground request body must be a JSON object.');
  }

  const rawCaptures = input['captures'];
  if (!Array.isArray(rawCaptures) || rawCaptures.length < 2) {
    throw new PathGenerationError(400, 'Ground requests must include at least two captures.');
  }

  return {
    captureRound: readIntegerInRange(input, 'captureRound', 'request', 1, STATUS_CAPABILITIES.maxCaptureRounds),
    captures: rawCaptures.map((capture, index) => parseCapture(capture, `captures[${index}]`)),
    currentCamera: parseCamera(input['currentCamera'], 'currentCamera'),
    pathTail: input['pathTail'] === null || input['pathTail'] === undefined
      ? null
      : parsePathTail(input['pathTail'], 'pathTail'),
    prompt: readString(input, 'prompt', 'request'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
  };
}

export function parsePathGenerationComposeRequest(input: unknown): PathGenerationComposeRequest {
  if (!isRecord(input)) {
    throw new PathGenerationError(400, 'Path-generation compose request body must be a JSON object.');
  }

  const rawValidationFeedback = input['validationFeedback'];
  return {
    currentCamera: parseCamera(input['currentCamera'], 'currentCamera'),
    groundedSubject: parseGroundedSubject(input['groundedSubject'], 'groundedSubject'),
    intent: parsePromptIntent(input['intent'], 'intent'),
    pathTail: input['pathTail'] === null || input['pathTail'] === undefined
      ? null
      : parsePathTail(input['pathTail'], 'pathTail'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
    validationFeedback: rawValidationFeedback === undefined
      ? undefined
      : parseValidationFeedback(rawValidationFeedback, 'validationFeedback'),
  };
}

export function parsePathGenerationGroundModelResponse(
  input: unknown,
  captures: PathGenerationCapture[] = [],
): PathGenerationGroundResponse {
  if (!isRecord(input)) {
    throw new PathGenerationError(502, 'Vision planner returned a non-object grounding response.');
  }

  const pathMode = parsePathMode(input['pathMode'], 'pathMode');
  const rawLocalizations = input['subjectLocalizations'];
  if (!Array.isArray(rawLocalizations)) {
    throw new PathGenerationError(502, 'Vision planner grounding response is missing subjectLocalizations.');
  }

  const intent = parsePromptIntent(input['intent'], 'intent', pathMode);
  return {
    intent: { ...intent, pathMode },
    pathMode,
    subjectLocalizations: rawLocalizations.map((entry, index) =>
      parseLocalization(entry, `subjectLocalizations[${index}]`, captures, index)),
    unsupportedReason: readOptionalNonEmptyString(input, 'unsupportedReason'),
    warning: readOptionalNonEmptyString(input, 'warning'),
  };
}

export function parsePathGenerationComposeModelResponse(input: unknown): PathGenerationComposeResponse {
  if (!isRecord(input)) {
    throw new PathGenerationError(502, 'Vision planner returned a non-object composition response.');
  }

  const rawSegments = input['segments'];
  if (!Array.isArray(rawSegments) || rawSegments.length === 0) {
    throw new PathGenerationError(502, 'Vision planner composition response is missing segments.');
  }

  return {
    segments: rawSegments
      .slice(0, STATUS_CAPABILITIES.maxSegments)
      .map((segment, index) => parseSegmentPlan(segment, `segments[${index}]`)),
    summary: readOptionalNonEmptyString(input, 'summary') ?? 'Generated a multi-step subject-centric draft path.',
    warning: readOptionalNonEmptyString(input, 'warning'),
  };
}

function buildGroundSystemPrompt(): string {
  return [
    'You are the grounding step of a camera path planner for a 3D scene viewer.',
    'Classify the prompt into exactly one pathMode: "subject-centric", "route-following", "multi-subject", or "ambiguous".',
    'Only "subject-centric" is supported in v1.',
    'Route-following prompts include weave through, pass between, move down a corridor, or follow a route through space.',
    'Multi-subject prompts include visiting multiple landmarks or switching primary subjects.',
    'Ambiguous means there is not one clear primary subject or movement request.',
    'Return JSON only with keys pathMode, intent, subjectLocalizations, warning, unsupportedReason.',
    'intent must contain pathMode, continuousPath, subjectHint, tone, orientationPreference, targetDurationSeconds, requestedMoveTypes.',
    'For supported prompts, subjectLocalizations should include every capture where the primary subject is visible.',
    'Every subjectLocalizations entry must include captureId, pixelX, pixelY, confidence.',
    'captureId must exactly match one of the input capture ids.',
    'Never invent captures that are not present in the input.',
    'When unsupported, set unsupportedReason and leave subjectLocalizations empty unless a clear primary subject is still visible.',
    'requestedMoveTypes may only contain hold, arc, dolly, pedestal.',
    'Map orbit, turntable, circle-around requests to "arc"; push-in/pull-back to "dolly"; rise/drop to "pedestal"; pause/linger to "hold".',
  ].join(' ');
}

function buildComposeSystemPrompt(): string {
  return [
    'You are the composition step of a camera path planner for a 3D scene viewer.',
    'The prompt has already been classified as subject-centric and the subject is already grounded in 3D.',
    'Return JSON only with keys summary, segments, warning.',
    'Use at most 4 ordered segments and only these segment types: hold, arc, dolly, pedestal.',
    'Every segment must include segmentType, durationSeconds, lookMode.',
    'Arc segments may include sweepDegrees, direction, verticalBias.',
    'Dolly segments may include travelDirection, distanceScale, verticalBias.',
    'Pedestal segments may include travelDirection and heightScale.',
    'Hold segments may include fovDelta.',
    'Do not output raw keyframes.',
    'Keep the overall path cinematic, continuous, and compatible with a single primary subject.',
    'If validationFeedback is present, adjust the segment choices to address those failures.',
  ].join(' ');
}

function buildGroundChatCompletionRequestBody(
  request: PathGenerationGroundRequest,
  model: string,
): UnknownRecord {
  return {
    messages: [
      {
        content: buildGroundSystemPrompt(),
        role: 'system',
      },
      {
        content: buildGroundUserContent(request),
        role: 'user',
      },
    ],
    model,
  };
}

function buildComposeChatCompletionRequestBody(
  request: PathGenerationComposeRequest,
  model: string,
): UnknownRecord {
  return {
    messages: [
      {
        content: buildComposeSystemPrompt(),
        role: 'system',
      },
      {
        content: buildComposeUserContent(request),
        role: 'user',
      },
    ],
    model,
  };
}

function applyCompatibilityToChatCompletionBody(
  body: UnknownRecord,
  compatibility: ChatCompletionRequestCompatibility,
): UnknownRecord {
  const nextBody: UnknownRecord = {
    ...body,
    [compatibility.tokenBudgetParameter]: PLANNER_COMPLETION_TOKEN_LIMIT,
  };

  if (compatibility.includeResponseFormat) {
    nextBody['response_format'] = { type: 'json_object' };
  }

  if (compatibility.includeTemperature) {
    nextBody['temperature'] = 0.2;
  }

  if (compatibility.includeReasoningEffort) {
    nextBody['reasoning_effort'] = 'minimal';
  }

  return nextBody;
}

function getInitialChatCompletionRequestCompatibility(model: string): ChatCompletionRequestCompatibility {
  return {
    ...DEFAULT_CHAT_COMPLETION_REQUEST_COMPATIBILITY,
    includeReasoningEffort: usesDefaultOnlyTemperature(model),
    includeTemperature: !usesDefaultOnlyTemperature(model),
  };
}

function buildGroundUserContent(request: PathGenerationGroundRequest): Array<Record<string, unknown>> {
  const content: Array<Record<string, unknown>> = [
    {
      text: [
        `Prompt: ${request.prompt}`,
        `Capture round: ${request.captureRound}`,
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

function buildComposeUserContent(request: PathGenerationComposeRequest): string {
  return [
    `Intent: ${JSON.stringify(request.intent)}`,
    `Grounded subject: ${JSON.stringify(request.groundedSubject)}`,
    `Scene bounds: ${JSON.stringify(request.sceneBounds)}`,
    `Current camera: ${JSON.stringify(request.currentCamera)}`,
    `Path tail: ${JSON.stringify(request.pathTail)}`,
    `Validation feedback: ${JSON.stringify(request.validationFeedback ?? [])}`,
  ].join('\n');
}

function extractCompletionText(payload: ChatCompletionResponse): string {
  const content = extractTextCandidate(payload.choices?.[0]?.message?.content);
  if (content) {
    return content;
  }

  const responseOutputText = extractTextCandidate(payload.output_text);
  if (responseOutputText) {
    return responseOutputText;
  }

  const responseOutput = extractTextCandidate(payload.output);
  if (responseOutput) {
    return responseOutput;
  }

  const refusal = extractTextCandidate(payload.choices?.[0]?.message?.refusal);
  if (refusal) {
    throw new PathGenerationError(502, `Vision planner returned a refusal instead of JSON: ${refusal.slice(0, 200)}`);
  }

  const finishReason = payload.choices?.[0]?.finish_reason;
  const payloadSummary = summarizeCompletionPayload(payload);
  throw new PathGenerationError(
    502,
    `Vision planner returned an empty completion${finishReason ? ` (finish reason: ${finishReason})` : ''}. ${payloadSummary}`,
  );
}

function extractTextCandidate(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const text = value
      .map(entry => extractTextCandidate(entry))
      .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
      .join('\n')
      .trim();
    return text.length > 0 ? text : null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const directText = extractTextCandidate(value['text']);
  if (directText) {
    return directText;
  }

  const directValue = extractTextCandidate(value['value']);
  if (directValue) {
    return directValue;
  }

  const directContent = extractTextCandidate(value['content']);
  if (directContent) {
    return directContent;
  }

  const directOutputText = extractTextCandidate(value['output_text']);
  if (directOutputText) {
    return directOutputText;
  }

  const directOutput = extractTextCandidate(value['output']);
  if (directOutput) {
    return directOutput;
  }

  return null;
}

function summarizeCompletionPayload(payload: ChatCompletionResponse): string {
  const summary: string[] = [];
  const firstChoice = payload.choices?.[0];
  const firstMessage = firstChoice?.message;

  if (typeof firstChoice?.finish_reason === 'string' && firstChoice.finish_reason.trim().length > 0) {
    summary.push(`finish_reason=${firstChoice.finish_reason}`);
  }

  if (firstMessage) {
    summary.push(`message.content=${describePayloadValue(firstMessage.content)}`);
    if (firstMessage.refusal !== undefined) {
      summary.push(`message.refusal=${describePayloadValue(firstMessage.refusal)}`);
    }
  }

  if (payload.output_text !== undefined) {
    summary.push(`output_text=${describePayloadValue(payload.output_text)}`);
  }

  if (payload.output !== undefined) {
    summary.push(`output=${describePayloadValue(payload.output)}`);
  }

  return summary.length > 0 ? `Payload summary: ${summary.join(', ')}` : 'Payload summary: no text-bearing fields present.';
}

function describePayloadValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return `array(${value.length})`;
  }

  if (isRecord(value)) {
    return `object(${Object.keys(value).slice(0, 4).join(',')})`;
  }

  return typeof value;
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

function parseGroundedSubject(value: unknown, context: string): PathGenerationGroundedSubject {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    anchor: parseVector3(value['anchor'], `${context}.anchor`),
    basisForward: parseVector3(value['basisForward'], `${context}.basisForward`),
    basisUp: parseVector3(value['basisUp'], `${context}.basisUp`),
    captureCount: readPositiveNumber(value, 'captureCount', context),
    confidence: readFiniteNumber(value, 'confidence', context),
    meanResidual: readFiniteNumber(value, 'meanResidual', context),
    sceneScale: readPositiveNumber(value, 'sceneScale', context),
  };
}

function parseLocalization(
  value: unknown,
  context: string,
  captures: PathGenerationCapture[],
  localizationIndex: number,
): PathGenerationSubjectLocalization {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  return {
    captureId: resolveLocalizationCaptureId(value, context, captures, localizationIndex),
    confidence: readFiniteNumber(value, 'confidence', context),
    pixelX: readFiniteNumber(value, 'pixelX', context),
    pixelY: readFiniteNumber(value, 'pixelY', context),
  };
}

function resolveLocalizationCaptureId(
  value: UnknownRecord,
  context: string,
  captures: PathGenerationCapture[],
  localizationIndex: number,
): string {
  const aliases = [
    value['captureId'],
    value['captureID'],
    value['capture_id'],
    value['capture'],
    value['id'],
  ];

  for (const alias of aliases) {
    const resolved = resolveCaptureIdAlias(alias, captures);
    if (resolved) {
      return resolved;
    }
  }

  if (localizationIndex >= 0 && localizationIndex < captures.length) {
    return captures[localizationIndex]!.id;
  }

  throw new PathGenerationError(502, `${context}.captureId must be a non-empty string.`);
}

function resolveCaptureIdAlias(
  value: unknown,
  captures: PathGenerationCapture[],
): string | null {
  const captureIds = captures.map(capture => capture.id);

  if (typeof value === 'number' && Number.isInteger(value)) {
    if (value >= 0 && value < captureIds.length) {
      return captureIds[value]!;
    }
    if (value >= 1 && value <= captureIds.length) {
      return captureIds[value - 1]!;
    }
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (captures.length === 0) {
    return trimmed;
  }

  if (captureIds.includes(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed.toLowerCase();
  const exactNormalizedMatch = captureIds.find(captureId => captureId.toLowerCase() === normalized);
  if (exactNormalizedMatch) {
    return exactNormalizedMatch;
  }

  const prefixed = normalized.startsWith('capture-') ? normalized : `capture-${normalized}`;
  const prefixedMatch = captureIds.find(captureId => captureId.toLowerCase() === prefixed);
  if (prefixedMatch) {
    return prefixedMatch;
  }

  const suffixMatch = captures.find(capture => {
    const captureId = capture.id.toLowerCase();
    return captureId.endsWith(`-${normalized}`) || captureId.endsWith(normalized);
  });
  if (suffixMatch) {
    return suffixMatch.id;
  }

  if (normalized === 'current') {
    const currentCapture = captures.find(capture => capture.role === 'current');
    if (currentCapture) {
      return currentCapture.id;
    }
  }

  return null;
}

function parsePathMode(value: unknown, context: string): PathGenerationPathMode {
  if (value === 'subject-centric' || value === 'route-following' || value === 'multi-subject' || value === 'ambiguous') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('route') || normalized.includes('weave') || normalized.includes('corridor')) {
      return 'route-following';
    }
    if (normalized.includes('multi')) {
      return 'multi-subject';
    }
    if (normalized.includes('ambig')) {
      return 'ambiguous';
    }
    if (normalized.includes('subject')) {
      return 'subject-centric';
    }
  }

  throw new PathGenerationError(502, `${context} must be a supported path mode.`);
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

function parsePromptIntent(
  value: unknown,
  context: string,
  fallbackPathMode?: PathGenerationPathMode,
): PathGenerationPromptIntent {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  const pathMode = value['pathMode'] === undefined
    ? fallbackPathMode ?? 'subject-centric'
    : parsePathMode(value['pathMode'], `${context}.pathMode`);

  return {
    continuousPath: true,
    orientationPreference: parseOrientationMode(
      value['orientationPreference'] ?? value['lookMode'] ?? 'look-at-subject',
      `${context}.orientationPreference`,
    ),
    pathMode,
    requestedMoveTypes: parseRequestedMoveTypes(value['requestedMoveTypes'], `${context}.requestedMoveTypes`),
    subjectHint: readNullableString(value, 'subjectHint'),
    targetDurationSeconds: readNullableFiniteNumber(value, 'targetDurationSeconds'),
    tone: readNullableString(value, 'tone'),
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

function parseRequestedMoveTypes(value: unknown, context: string): PathGenerationSegmentType[] {
  if (!Array.isArray(value)) {
    return ['arc'];
  }

  const moves = value
    .map(entry => coerceSegmentType(entry))
    .filter((entry): entry is PathGenerationSegmentType => entry !== null);
  return moves.length > 0 ? Array.from(new Set(moves)) : ['arc'];
}

function parseSegmentPlan(value: unknown, context: string): PathGenerationSegmentPlan {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  const segmentType = coerceSegmentType(value['segmentType']);
  if (!segmentType) {
    throw new PathGenerationError(502, `${context}.segmentType must be hold, arc, dolly, or pedestal.`);
  }

  const baseSegment: PathGenerationBaseSegmentPlan = {
    durationSeconds: readPositiveNumber(value, 'durationSeconds', context),
    fovDelta: readOptionalFiniteNumber(value, 'fovDelta'),
    lookMode: parseOrientationMode(value['lookMode'] ?? 'look-at-subject', `${context}.lookMode`),
    segmentType,
  };

  if (segmentType === 'hold') {
    return {
      ...baseSegment,
      segmentType,
    };
  }

  if (segmentType === 'arc') {
    return {
      ...baseSegment,
      direction: value['direction'] === undefined ? undefined : parseDirection(value['direction'], `${context}.direction`),
      segmentType,
      sweepDegrees: readOptionalFiniteNumber(value, 'sweepDegrees'),
      verticalBias: value['verticalBias'] === undefined
        ? undefined
        : parseVerticalBias(value['verticalBias'], `${context}.verticalBias`),
    };
  }

  if (segmentType === 'dolly') {
    return {
      ...baseSegment,
      distanceScale: readOptionalFiniteNumber(value, 'distanceScale'),
      segmentType,
      travelDirection: value['travelDirection'] === undefined
        ? undefined
        : parseDollyDirection(value['travelDirection'], `${context}.travelDirection`),
      verticalBias: value['verticalBias'] === undefined
        ? undefined
        : parseVerticalBias(value['verticalBias'], `${context}.verticalBias`),
    };
  }

  return {
    ...baseSegment,
    heightScale: readOptionalFiniteNumber(value, 'heightScale'),
    segmentType,
    travelDirection: value['travelDirection'] === undefined
      ? undefined
      : parsePedestalDirection(value['travelDirection'], `${context}.travelDirection`),
  };
}

function coerceSegmentType(value: unknown): PathGenerationSegmentType | null {
  if (value === 'hold' || value === 'arc' || value === 'dolly' || value === 'pedestal') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'orbit' || normalized === 'turntable' || normalized === 'circle') {
    return 'arc';
  }
  if (normalized === 'push-in' || normalized === 'push in' || normalized === 'pull-back' || normalized === 'pull back') {
    return 'dolly';
  }
  if (normalized === 'crane' || normalized === 'rise' || normalized === 'drop') {
    return 'pedestal';
  }
  if (normalized === 'pause' || normalized === 'linger' || normalized === 'still') {
    return 'hold';
  }

  return null;
}

function parseDirection(value: unknown, context: string): AgenticOrbitDirection {
  if (value === 'clockwise' || value === 'counterclockwise') {
    return value;
  }

  throw new PathGenerationError(502, `${context} must be "clockwise" or "counterclockwise".`);
}

function parseDollyDirection(value: unknown, context: string): PathGenerationDollyDirection {
  if (value === 'in' || value === 'out') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('in') || normalized.includes('toward') || normalized.includes('closer')) {
      return 'in';
    }
    if (normalized.includes('out') || normalized.includes('back') || normalized.includes('away')) {
      return 'out';
    }
  }

  throw new PathGenerationError(502, `${context} must be "in" or "out".`);
}

function parseOrientationMode(value: unknown, context: string): AgenticOrientationMode {
  if (value === 'look-at-subject' || value === 'look-forward') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('forward') || normalized.includes('along')) {
      return 'look-forward';
    }
    if (normalized.includes('subject') || normalized.includes('focus') || normalized.includes('look-at')) {
      return 'look-at-subject';
    }
  }

  throw new PathGenerationError(502, `${context} must be "look-at-subject" or "look-forward".`);
}

function parsePedestalDirection(value: unknown, context: string): PathGenerationPedestalDirection {
  if (value === 'up' || value === 'down') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('up') || normalized.includes('rise') || normalized.includes('crane')) {
      return 'up';
    }
    if (normalized.includes('down') || normalized.includes('drop') || normalized.includes('lower')) {
      return 'down';
    }
  }

  throw new PathGenerationError(502, `${context} must be "up" or "down".`);
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

function parseValidationFeedback(value: unknown, context: string): string[] {
  if (!Array.isArray(value)) {
    throw new PathGenerationError(400, `${context} must be an array of strings.`);
  }

  return value.map((entry, index) => {
    if (typeof entry !== 'string' || entry.trim().length === 0) {
      throw new PathGenerationError(400, `${context}[${index}] must be a non-empty string.`);
    }
    return entry.trim();
  });
}

function parseVerticalBias(value: unknown, context: string): AgenticVerticalBias {
  if (value === 'low' || value === 'mid' || value === 'high') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'medium' || normalized === 'center' || normalized === 'middle' || normalized === 'neutral') {
      return 'mid';
    }
    if (normalized === 'top' || normalized === 'upper' || normalized === 'elevated' || normalized === 'above') {
      return 'high';
    }
    if (normalized === 'bottom' || normalized === 'lower' || normalized === 'ground' || normalized === 'below') {
      return 'low';
    }
  }

  throw new PathGenerationError(502, `${context} must be "low", "mid", or "high".`);
}

function readFiniteNumber(record: UnknownRecord, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new PathGenerationError(400, `${context}.${key} must be a finite number.`);
  }

  return value;
}

function readIntegerInRange(
  record: UnknownRecord,
  key: string,
  context: string,
  min: number,
  max: number,
): number {
  const value = readFiniteNumber(record, key, context);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new PathGenerationError(400, `${context}.${key} must be an integer between ${min} and ${max}.`);
  }

  return value;
}

function readOptionalFiniteNumber(record: UnknownRecord, key: string): number | undefined {
  const value = record[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new PathGenerationError(502, `${key} must be a finite number when provided.`);
  }
  return value;
}

function readOptionalNonEmptyString(record: UnknownRecord, key: string): string | undefined {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }
  return value.trim();
}

function readPositiveNumber(record: UnknownRecord, key: string, context: string): number {
  const value = readFiniteNumber(record, key, context);
  if (!(value > 0)) {
    throw new PathGenerationError(400, `${context}.${key} must be greater than zero.`);
  }

  return value;
}

function readNullableFiniteNumber(record: UnknownRecord, key: string): number | null {
  const value = record[key];
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new PathGenerationError(502, `${key} must be a finite number when provided.`);
  }
  return value;
}

function readNullableString(record: UnknownRecord, key: string): string | null {
  const value = record[key];
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new PathGenerationError(502, `${key} must be a non-empty string when provided.`);
  }
  return value.trim();
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

function buildPlanningRequestFailure(statusCode: number, failureText: string): PathGenerationError {
  const failureDetails = parsePlannerRequestFailureDetails(failureText);
  return new PathGenerationError(
    502,
    `Vision planning request failed (${statusCode}): ${failureDetails.message.slice(0, 200)}`.trim(),
  );
}

function defaultUnsupportedReasonForPathMode(pathMode: PathGenerationPathMode): string {
  if (pathMode === 'route-following') {
    return 'Route-following prompts like weaving through geometry are not supported in agentic path v1.';
  }
  if (pathMode === 'multi-subject') {
    return 'Multi-subject path prompts are not supported in agentic path v1.';
  }
  if (pathMode === 'ambiguous') {
    return 'The prompt is too ambiguous for agentic path v1. Name one clear subject and one continuous camera move.';
  }
  return 'The prompt is not supported in agentic path v1.';
}

function parsePlannerRequestFailureDetails(failureText: string): PlannerRequestFailureDetails {
  try {
    const parsed = JSON.parse(failureText) as unknown;
    if (isRecord(parsed) && isRecord(parsed['error'])) {
      const errorRecord = parsed['error'];
      const message = typeof errorRecord['message'] === 'string' && errorRecord['message'].trim().length > 0
        ? errorRecord['message']
        : failureText;
      return {
        message,
        param: typeof errorRecord['param'] === 'string' ? errorRecord['param'] : null,
      };
    }
  } catch {
    // Keep the raw response body when the error payload is not JSON.
  }

  return {
    message: failureText,
    param: null,
  };
}

function resolveChatCompletionRequestCompatibility(
  statusCode: number,
  failureText: string,
  attemptedCompatibility: ChatCompletionRequestCompatibility,
): ChatCompletionRequestCompatibility | null {
  if (statusCode !== 400) {
    return null;
  }

  const failureDetails = parsePlannerRequestFailureDetails(failureText);
  const searchableFailureText = `${failureDetails.param ?? ''}\n${failureDetails.message}\n${failureText}`;
  const nextCompatibility: ChatCompletionRequestCompatibility = { ...attemptedCompatibility };
  let changed = false;

  const fallbackTokenBudgetParameter = resolveTokenBudgetFallback(
    statusCode,
    searchableFailureText,
    attemptedCompatibility.tokenBudgetParameter,
  );
  if (
    fallbackTokenBudgetParameter
    && fallbackTokenBudgetParameter !== attemptedCompatibility.tokenBudgetParameter
  ) {
    nextCompatibility.tokenBudgetParameter = fallbackTokenBudgetParameter;
    changed = true;
  }

  if (
    attemptedCompatibility.includeReasoningEffort
    && shouldRemoveCompatibilityParameter(failureDetails, searchableFailureText, 'reasoning_effort')
  ) {
    nextCompatibility.includeReasoningEffort = false;
    changed = true;
  }

  if (
    attemptedCompatibility.includeTemperature
    && shouldRemoveCompatibilityParameter(failureDetails, searchableFailureText, 'temperature')
  ) {
    nextCompatibility.includeTemperature = false;
    changed = true;
  }

  if (
    attemptedCompatibility.includeResponseFormat
    && shouldRemoveCompatibilityParameter(
      failureDetails,
      searchableFailureText,
      'response_format',
      ['json mode', 'json_object'],
    )
  ) {
    nextCompatibility.includeResponseFormat = false;
    changed = true;
  }

  return changed ? nextCompatibility : null;
}

function resolveTokenBudgetFallback(
  statusCode: number,
  failureText: string,
  attemptedParameter: TokenBudgetParameter,
): TokenBudgetParameter | null {
  if (statusCode !== 400 || !/unsupported parameter/i.test(failureText)) {
    return null;
  }

  const suggestedParameter = failureText.match(/use ['"]?(max_completion_tokens|max_tokens)['"]? instead/i)?.[1];
  if (suggestedParameter === 'max_completion_tokens' || suggestedParameter === 'max_tokens') {
    return suggestedParameter;
  }

  if (new RegExp(`['"]?${attemptedParameter}['"]?`, 'i').test(failureText)) {
    return attemptedParameter === 'max_completion_tokens' ? 'max_tokens' : 'max_completion_tokens';
  }

  return null;
}

function usesDefaultOnlyTemperature(model: string): boolean {
  return /^gpt-5(?:$|[-.])/i.test(model.trim());
}

function shouldRemoveCompatibilityParameter(
  failureDetails: PlannerRequestFailureDetails,
  searchableFailureText: string,
  parameterName: string,
  extraNeedles: string[] = [],
): boolean {
  const normalizedSearchableFailureText = searchableFailureText.toLowerCase();
  const isUnsupportedCompatibilityError = /unsupported parameter|unsupported value/i.test(searchableFailureText);
  if (!isUnsupportedCompatibilityError) {
    return false;
  }

  if (failureDetails.param === parameterName) {
    return true;
  }

  const quotedParameterPattern = new RegExp(`['"]?${parameterName}['"]?`, 'i');
  if (quotedParameterPattern.test(searchableFailureText)) {
    return true;
  }

  return extraNeedles.some(needle => normalizedSearchableFailureText.includes(needle.toLowerCase()));
}
