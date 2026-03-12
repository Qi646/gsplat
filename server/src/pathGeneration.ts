export type AgenticOrientationMode = 'look-at-subject' | 'look-forward';
export type AgenticOrbitDirection = 'clockwise' | 'counterclockwise';
export type AgenticVerticalBias = 'low' | 'mid' | 'high';
export type PathGenerationStrategyVersion = 'multistep-v2' | 'stepwise-v1';
export type PathGenerationPathMode = 'subject-centric' | 'route-following' | 'multi-subject' | 'ambiguous';
export type PathGenerationSegmentType = 'hold' | 'arc' | 'dolly' | 'pedestal' | 'traverse';
export type PathGenerationDollyDirection = 'in' | 'out';
export type PathGenerationPedestalDirection = 'up' | 'down';
export type PathGenerationLateralBias = 'left' | 'center' | 'right';
export type PathGenerationHoldPreference = 'auto' | 'none' | 'brief' | 'linger';
export type PathGenerationVerifyCaptureKind = 'draft-sample' | 'active-probe';
export type PathGenerationVerifyProbeReason =
  | 'overview'
  | 'floor-clearance'
  | 'subject-framing'
  | 'subject-distance'
  | 'segment-transition'
  | 'hold-read'
  | 'long-path-lookahead';
export type PathGenerationStepMovePrimitive =
  | 'forward-short'
  | 'forward-medium'
  | 'back-short'
  | 'strafe-left-short'
  | 'strafe-right-short'
  | 'rise-short'
  | 'lower-short';
export type PathGenerationStepRotatePrimitive =
  | 'yaw-left-small'
  | 'yaw-right-small'
  | 'yaw-left-medium'
  | 'yaw-right-medium'
  | 'pitch-up-small'
  | 'pitch-down-small';

export interface PathGenerationKeyframe {
  fov: number;
  id: string;
  position: PathGenerationVector3;
  quaternion: PathGenerationQuaternion;
  time: number;
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

export interface PathGenerationStepMemoryCapture extends PathGenerationCapture {
  capturedAtStep: number;
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

export interface PathGenerationDraftControls {
  holdPreference: PathGenerationHoldPreference;
  requestedDurationSeconds: number | null;
}

export interface PathGenerationSubjectLocalization {
  captureId: string;
  confidence: number;
  pixelX: number;
  pixelY: number;
}

export interface PathGenerationRoutePixelPoint {
  x: number;
  y: number;
}

export interface PathGenerationRouteObservation {
  captureId: string;
  centerlinePixels: PathGenerationRoutePixelPoint[];
  confidence: number;
  entryPixel: PathGenerationRoutePixelPoint;
  exitPixel: PathGenerationRoutePixelPoint;
  routeKind: string | null;
  widthPixels: number | null;
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
  routeObservations?: PathGenerationRouteObservation[];
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

export interface PathGenerationGroundedRoute {
  averageClearance: number;
  confidence: number;
  length: number;
  maxTurnDegrees: number;
  routeId: string;
  waypoints: PathGenerationVector3[];
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

export interface PathGenerationTraverseSegmentPlan extends PathGenerationBaseSegmentPlan {
  distanceRatio?: number;
  lateralBias?: PathGenerationLateralBias;
  segmentType: 'traverse';
  verticalBias?: AgenticVerticalBias;
}

export type PathGenerationSegmentPlan =
  | PathGenerationHoldSegmentPlan
  | PathGenerationArcSegmentPlan
  | PathGenerationDollySegmentPlan
  | PathGenerationPedestalSegmentPlan
  | PathGenerationTraverseSegmentPlan;

export interface PathGenerationComposeRequest {
  currentCamera: PathGenerationCamera;
  draftControls: PathGenerationDraftControls;
  groundedRoute: PathGenerationGroundedRoute | null;
  groundedSubject: PathGenerationGroundedSubject | null;
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

export interface PathGenerationVerifyCapture {
  camera: PathGenerationCamera;
  captureKind: PathGenerationVerifyCaptureKind;
  height: number;
  id: string;
  imageDataUrl: string;
  probeReason: PathGenerationVerifyProbeReason;
  projectedRoute?: {
    centerNdcX: number;
    clearanceMargin: number;
    headingErrorDegrees: number;
    visibleFraction: number;
  };
  projectedSubject?: {
    ndcX: number;
    ndcY: number;
    visible: boolean;
  };
  timeSeconds: number;
  width: number;
}

export interface PathGenerationVerifyRequest {
  captures: PathGenerationVerifyCapture[];
  currentCamera: PathGenerationCamera;
  draftControls: PathGenerationDraftControls;
  groundedRoute: PathGenerationGroundedRoute | null;
  groundedSubject: PathGenerationGroundedSubject | null;
  intent: PathGenerationPromptIntent;
  prompt: string;
  sceneBounds: PathGenerationBounds;
  segments: PathGenerationSegmentPlan[];
  summary: string;
}

export interface PathGenerationVerifyResponse {
  approved: boolean;
  issues: string[];
  warning?: string;
}

export type PathGenerationStepAction =
  | {
    type: 'move';
    primitive: PathGenerationStepMovePrimitive;
  }
  | {
    type: 'rotate';
    primitive: PathGenerationStepRotatePrimitive;
  }
  | {
    type: 'capture-image';
  }
  | {
    type: 'create-keyframe';
  };

export interface PathGenerationStepActionHistoryEntry {
  action: PathGenerationStepAction;
  note?: string;
  outcome: 'applied' | 'completed' | 'rejected' | 'stored';
  stepIndex: number;
}

export interface PathGenerationStepRequest {
  actionHistory: PathGenerationStepActionHistoryEntry[];
  currentCapture: PathGenerationCapture;
  draftControls: PathGenerationDraftControls;
  draftKeyframes: PathGenerationKeyframe[];
  memoryCaptures: PathGenerationStepMemoryCapture[];
  prompt: string;
  sceneBounds: PathGenerationBounds;
  stepIndex: number;
  strategyVersion: 'stepwise-v1';
}

export interface PathGenerationStepResponse {
  action?: PathGenerationStepAction;
  complete: boolean;
  pathMode: PathGenerationPathMode;
  reason: string;
  warning?: string;
}

export interface PathGenerationStrategyStatus {
  available: boolean;
  experimental: boolean;
  id: PathGenerationStrategyVersion;
  label: string;
  reason: string | null;
}

export interface PathGenerationPlannerStatus {
  available: boolean;
  capabilities: {
    includesActiveVerificationProbes: boolean;
    includesPlannerVerification: boolean;
    maxCaptureRounds: number;
    maxSegments: number;
    maxVerificationCaptures: number;
    segmentTypes: PathGenerationSegmentType[];
    supportedPathModes: PathGenerationPathMode[];
    unsupportedPathModes: PathGenerationPathMode[];
  };
  model: string | null;
  plannerVersion: 'multistep-v2';
  reason: string | null;
  strategies: PathGenerationStrategyStatus[];
}

export interface PathGenerationPlanner {
  composePathPlan: (request: unknown) => Promise<PathGenerationComposeResponse>;
  getStatus: () => PathGenerationPlannerStatus;
  groundPathIntent: (request: unknown) => Promise<PathGenerationGroundResponse>;
  stepPathAction: (request: unknown) => Promise<PathGenerationStepResponse>;
  verifyPathPlan: (request: unknown) => Promise<PathGenerationVerifyResponse>;
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
const DEFAULT_OPENAI_MODEL = 'gpt-5-mini';
const DEFAULT_CHAT_COMPLETION_REQUEST_COMPATIBILITY: ChatCompletionRequestCompatibility = {
  includeReasoningEffort: false,
  includeResponseFormat: true,
  includeTemperature: true,
  tokenBudgetParameter: 'max_completion_tokens',
};
const MAX_CHAT_COMPLETION_COMPATIBILITY_ATTEMPTS = 4;
const PLANNER_COMPLETION_TOKEN_LIMIT = 1800;
const STATUS_CAPABILITIES = {
  includesActiveVerificationProbes: true,
  includesPlannerVerification: true,
  maxCaptureRounds: 2,
  maxSegments: 4,
  maxVerificationCaptures: 8,
  segmentTypes: ['hold', 'arc', 'dolly', 'pedestal', 'traverse'] as PathGenerationSegmentType[],
  supportedPathModes: ['subject-centric', 'route-following'] as PathGenerationPathMode[],
  unsupportedPathModes: ['multi-subject', 'ambiguous'] as PathGenerationPathMode[],
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
    const available = Boolean(apiKey);
    const reason = available
      ? null
      : 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.';
    const strategies = buildStrategyStatuses(available, reason);

    return {
      available,
      capabilities: STATUS_CAPABILITIES,
      model,
      plannerVersion: 'multistep-v2',
      reason,
      strategies,
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

    if (STATUS_CAPABILITIES.unsupportedPathModes.includes(response.pathMode) && !response.unsupportedReason) {
      response.unsupportedReason = defaultUnsupportedReasonForPathMode(response.pathMode);
    }

    return response;
  }

  async composePathPlan(request: unknown): Promise<PathGenerationComposeResponse> {
    const parsedRequest = parsePathGenerationComposeRequest(request);
    const apiKey = this.requireApiKey();

    if (STATUS_CAPABILITIES.unsupportedPathModes.includes(parsedRequest.intent.pathMode)) {
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

  async verifyPathPlan(request: unknown): Promise<PathGenerationVerifyResponse> {
    const parsedRequest = parsePathGenerationVerifyRequest(request);
    const apiKey = this.requireApiKey();
    const completion = await this.requestChatCompletion(
      buildVerifyChatCompletionRequestBody(parsedRequest, this.resolveModel()),
      apiKey,
    );
    return parsePathGenerationVerifyModelResponse(
      JSON.parse(stripJsonFences(extractCompletionText(completion))) as unknown,
    );
  }

  async stepPathAction(request: unknown): Promise<PathGenerationStepResponse> {
    const parsedRequest = parsePathGenerationStepRequest(request);
    const apiKey = this.requireApiKey();
    const completion = await this.requestChatCompletion(
      buildStepChatCompletionRequestBody(parsedRequest, this.resolveModel()),
      apiKey,
    );
    return parsePathGenerationStepModelResponse(
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

function buildStrategyStatuses(available: boolean, reason: string | null): PathGenerationStrategyStatus[] {
  return [
    {
      available,
      experimental: false,
      id: 'multistep-v2',
      label: 'Planner Draft',
      reason,
    },
    {
      available,
      experimental: true,
      id: 'stepwise-v1',
      label: 'Stepwise Agent',
      reason,
    },
  ];
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
  const intent = parsePromptIntent(input['intent'], 'intent');
  return {
    currentCamera: parseCamera(input['currentCamera'], 'currentCamera'),
    draftControls: parseDraftControls(input['draftControls'], 'draftControls'),
    groundedRoute: intent.pathMode === 'route-following'
      ? parseGroundedRoute(input['groundedRoute'], 'groundedRoute')
      : null,
    groundedSubject: intent.pathMode === 'subject-centric'
      ? parseGroundedSubject(input['groundedSubject'], 'groundedSubject')
      : null,
    intent,
    pathTail: input['pathTail'] === null || input['pathTail'] === undefined
      ? null
      : parsePathTail(input['pathTail'], 'pathTail'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
    validationFeedback: rawValidationFeedback === undefined
      ? undefined
      : parseValidationFeedback(rawValidationFeedback, 'validationFeedback'),
  };
}

export function parsePathGenerationVerifyRequest(input: unknown): PathGenerationVerifyRequest {
  if (!isRecord(input)) {
    throw new PathGenerationError(400, 'Path-generation verify request body must be a JSON object.');
  }

  const rawCaptures = input['captures'];
  if (!Array.isArray(rawCaptures) || rawCaptures.length === 0) {
    throw new PathGenerationError(400, 'Verify requests must include at least one draft review capture.');
  }
  if (rawCaptures.length > STATUS_CAPABILITIES.maxVerificationCaptures) {
    throw new PathGenerationError(
      400,
      `Verify requests may include at most ${STATUS_CAPABILITIES.maxVerificationCaptures} captures.`,
    );
  }

  const intent = parsePromptIntent(input['intent'], 'intent');
  return {
    captures: rawCaptures.map((capture, index) => parseVerifyCapture(capture, `captures[${index}]`)),
    currentCamera: parseCamera(input['currentCamera'], 'currentCamera'),
    draftControls: parseDraftControls(input['draftControls'], 'draftControls'),
    groundedRoute: intent.pathMode === 'route-following'
      ? parseGroundedRoute(input['groundedRoute'], 'groundedRoute')
      : null,
    groundedSubject: intent.pathMode === 'subject-centric'
      ? parseGroundedSubject(input['groundedSubject'], 'groundedSubject')
      : null,
    intent,
    prompt: readString(input, 'prompt', 'request'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
    segments: parseSegmentPlanArray(input['segments'], 'segments'),
    summary: readString(input, 'summary', 'request'),
  };
}

export function parsePathGenerationStepRequest(input: unknown): PathGenerationStepRequest {
  if (!isRecord(input)) {
    throw new PathGenerationError(400, 'Path-generation step request body must be a JSON object.');
  }

  const rawActionHistory = input['actionHistory'];
  const rawMemoryCaptures = input['memoryCaptures'];

  return {
    actionHistory: Array.isArray(rawActionHistory)
      ? rawActionHistory.map((entry, index) => parseStepActionHistoryEntry(entry, `actionHistory[${index}]`))
      : [],
    currentCapture: parseCapture(input['currentCapture'], 'currentCapture'),
    draftControls: parseDraftControls(input['draftControls'], 'draftControls'),
    draftKeyframes: parseKeyframeArray(input['draftKeyframes'], 'draftKeyframes'),
    memoryCaptures: Array.isArray(rawMemoryCaptures)
      ? rawMemoryCaptures.map((entry, index) => parseStepMemoryCapture(entry, `memoryCaptures[${index}]`))
      : [],
    prompt: readString(input, 'prompt', 'request'),
    sceneBounds: parseBounds(input['sceneBounds'], 'sceneBounds'),
    stepIndex: readIntegerInRange(input, 'stepIndex', 'request', 0, 128),
    strategyVersion: parseStrategyVersion(input['strategyVersion'], 'strategyVersion'),
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
  const rawRouteObservations = input['routeObservations'];

  const intent = parsePromptIntent(input['intent'], 'intent', pathMode);
  return {
    intent: { ...intent, pathMode },
    pathMode,
    routeObservations: pathMode === 'route-following'
      ? parseRouteObservationArray(rawRouteObservations, captures)
      : undefined,
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

export function parsePathGenerationVerifyModelResponse(input: unknown): PathGenerationVerifyResponse {
  if (!isRecord(input)) {
    throw new PathGenerationError(502, 'Vision planner returned a non-object verification response.');
  }

  const rawIssues = input['issues'];
  const issues = Array.isArray(rawIssues)
    ? rawIssues.map((entry, index) => {
      if (typeof entry !== 'string' || entry.trim().length === 0) {
        throw new PathGenerationError(502, `issues[${index}] must be a non-empty string.`);
      }
      return entry.trim();
    })
    : [];
  const approved = input['approved'] === true;

  if (!approved && issues.length === 0) {
    throw new PathGenerationError(502, 'Vision planner rejected the draft without returning any issues.');
  }

  return {
    approved,
    issues,
    warning: readOptionalNonEmptyString(input, 'warning'),
  };
}

export function parsePathGenerationStepModelResponse(input: unknown): PathGenerationStepResponse {
  if (!isRecord(input)) {
    throw new PathGenerationError(502, 'Vision planner returned a non-object stepwise response.');
  }

  const complete = input['complete'] === true;
  const reason = readString(input, 'reason', 'response');
  const pathMode = parsePathMode(input['pathMode'], 'pathMode');
  const action = input['action'] === undefined || input['action'] === null
    ? undefined
    : parseStepAction(input['action'], 'action');

  if (!complete && !action) {
    throw new PathGenerationError(502, 'Vision planner step response must include an action unless complete is true.');
  }

  return {
    action,
    complete,
    pathMode,
    reason,
    warning: readOptionalNonEmptyString(input, 'warning'),
  };
}

function buildGroundSystemPrompt(): string {
  return [
    'You are the grounding step of a camera path planner for a 3D scene viewer.',
    'Classify the prompt into exactly one pathMode: "subject-centric", "route-following", "multi-subject", or "ambiguous".',
    'In multistep-v2, "subject-centric" and "route-following" are supported.',
    'Route-following prompts include weave through, pass between, move down a corridor, or follow a route through space.',
    'Multi-subject prompts include visiting multiple landmarks or switching primary subjects.',
    'Ambiguous means there is not one clear primary subject or movement request.',
    'Return JSON only with keys pathMode, intent, subjectLocalizations, routeObservations, warning, unsupportedReason.',
    'intent must contain pathMode, continuousPath, subjectHint, tone, orientationPreference, targetDurationSeconds, requestedMoveTypes.',
    'For subject-centric prompts, subjectLocalizations should include every capture where the primary subject is visible.',
    'For route-following prompts, routeObservations should include every capture where the route is visible.',
    'Every subjectLocalizations entry must include captureId, pixelX, pixelY, confidence.',
    'Every routeObservations entry must include captureId, confidence, entryPixel, exitPixel, centerlinePixels, routeKind, widthPixels.',
    'Each route centerline must contain 3 to 8 ordered pixel points from near-to-far traversal.',
    'captureId must exactly match one of the input capture ids.',
    'Never invent captures that are not present in the input.',
    'When unsupported, set unsupportedReason and leave subjectLocalizations and routeObservations empty.',
    'requestedMoveTypes may only contain hold, arc, dolly, pedestal, traverse.',
    'Map orbit, turntable, circle-around requests to "arc"; push-in/pull-back to "dolly"; rise/drop to "pedestal"; pause/linger to "hold".',
    'Map follow, weave, corridor, aisle, path-through, or move-along requests to "traverse".',
  ].join(' ');
}

function buildComposeSystemPrompt(): string {
  return [
    'You are the composition step of a camera path planner for a 3D scene viewer.',
    'The prompt has already been classified and grounded in 3D.',
    'Return JSON only with keys summary, segments, warning.',
    'Use at most 4 ordered segments and only these segment types: hold, arc, dolly, pedestal, traverse.',
    'Every segment must include segmentType, durationSeconds, lookMode.',
    'Arc segments may include sweepDegrees, direction, verticalBias.',
    'Dolly segments may include travelDirection, distanceScale, verticalBias.',
    'Pedestal segments may include travelDirection and heightScale.',
    'Traverse segments may include distanceRatio, lateralBias, and verticalBias.',
    'Hold segments may include fovDelta.',
    'When verticalBias is present, it must be the string "low", "mid", or "high"; never emit numeric verticalBias values.',
    'When direction is present, it must be the string "clockwise" or "counterclockwise".',
    'When lateralBias is present, it must be the string "left", "center", or "right".',
    'Do not output raw keyframes.',
    'Keep the overall path cinematic, continuous, and compatible with one supported prompt mode.',
    'Respect draftControls when provided. requestedDurationSeconds should strongly guide the overall duration.',
    'When holdPreference is "brief" or "linger", prefer a final hold segment. "linger" should be materially longer than a beat.',
    'When holdPreference is "none", do not include hold segments.',
    'For route-following, emit at most one traverse segment and prefer optional opening/ending hold segments over extra route fragments.',
    'If validationFeedback is present, adjust the segment choices to address those failures.',
  ].join(' ');
}

function buildVerifySystemPrompt(): string {
  return [
    'You are the verification step of a camera path planner for a 3D scene viewer.',
    'A draft path has already been composed and locally validated. Review the sampled draft images, active probe images, and metadata.',
    'Return JSON only with keys approved, issues, warning.',
    'Set approved to true only if the draft visually matches the prompt and looks plausible.',
    'Verify captures may be either "draft-sample" or "active-probe".',
    '"draft-sample" captures are exact poses from the proposed path.',
    '"active-probe" captures are small nearby inspection views around a risky draft moment; they are evidence-gathering probes, not literal path poses.',
    'Use active-probe captures to judge uncertainty, occlusion, floor clearance, and long-path plausibility, but do not require the final path to exactly match a probe framing.',
    'Reject drafts that visibly lose the subject, drift away from the requested framing, dip under the world/floor, or fail a requested ending hold.',
    'For route-following, also reject drafts that lose the route, look implausibly misaligned to the route direction, or squeeze through visibly low-clearance sections.',
    'When holdPreference is "brief" or "linger", check that the later verification frames read like a real pause rather than continuous motion.',
    'When holdPreference is "none", treat the explicit control as overriding hold language in the prompt.',
    'If approved is false, issues must contain short, actionable reasons the composer can address.',
  ].join(' ');
}

function buildStepSystemPrompt(): string {
  return [
    'You are the stepwise action policy for an experimental camera-path agent in a 3D scene viewer.',
    'Return JSON only with keys complete, pathMode, reason, action, warning.',
    'Classify the prompt into exactly one pathMode: "subject-centric", "route-following", "multi-subject", or "ambiguous".',
    'Only "subject-centric" and "route-following" are supported. For unsupported modes, set complete=true and explain why in reason.',
    'Choose exactly one next action unless complete is true.',
    'Allowed move primitives: forward-short, forward-medium, back-short, strafe-left-short, strafe-right-short, rise-short, lower-short.',
    'Allowed rotate primitives: yaw-left-small, yaw-right-small, yaw-left-medium, yaw-right-medium, pitch-up-small, pitch-down-small.',
    'Other allowed action types are capture-image and create-keyframe.',
    'Use create-keyframe when the current camera pose should be preserved in the draft.',
    'Use capture-image when the current frame is useful evidence to remember for later decisions.',
    'Prefer a first create-keyframe within the first few steps and a second create-keyframe before completing.',
    'For subject-centric prompts, prioritize keeping one primary subject well framed.',
    'For route-following prompts, prioritize steady forward progress and looking in the route direction.',
    'When the draft already has at least two keyframes and the requested move is achieved, set complete=true.',
    'Never emit numeric motion values or raw camera poses.',
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

function buildVerifyChatCompletionRequestBody(
  request: PathGenerationVerifyRequest,
  model: string,
): UnknownRecord {
  return {
    messages: [
      {
        content: buildVerifySystemPrompt(),
        role: 'system',
      },
      {
        content: buildVerifyUserContent(request),
        role: 'user',
      },
    ],
    model,
  };
}

function buildStepChatCompletionRequestBody(
  request: PathGenerationStepRequest,
  model: string,
): UnknownRecord {
  return {
    messages: [
      {
        content: buildStepSystemPrompt(),
        role: 'system',
      },
      {
        content: buildStepUserContent(request),
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
    `Draft controls: ${JSON.stringify(request.draftControls)}`,
    `Grounded subject: ${JSON.stringify(request.groundedSubject)}`,
    `Grounded route: ${JSON.stringify(request.groundedRoute)}`,
    `Scene bounds: ${JSON.stringify(request.sceneBounds)}`,
    `Current camera: ${JSON.stringify(request.currentCamera)}`,
    `Path tail: ${JSON.stringify(request.pathTail)}`,
    `Validation feedback: ${JSON.stringify(request.validationFeedback ?? [])}`,
  ].join('\n');
}

function buildVerifyUserContent(request: PathGenerationVerifyRequest): Array<Record<string, unknown>> {
  const content: Array<Record<string, unknown>> = [
    {
      text: [
        `Prompt: ${request.prompt}`,
        `Intent: ${JSON.stringify(request.intent)}`,
        `Draft controls: ${JSON.stringify(request.draftControls)}`,
        `Draft summary: ${request.summary}`,
        `Segments: ${JSON.stringify(request.segments)}`,
        `Grounded subject: ${JSON.stringify(request.groundedSubject)}`,
        `Grounded route: ${JSON.stringify(request.groundedRoute)}`,
        `Scene bounds: ${JSON.stringify(request.sceneBounds)}`,
        `Current camera: ${JSON.stringify(request.currentCamera)}`,
      ].join('\n'),
      type: 'text',
    },
  ];

  for (const capture of request.captures) {
    content.push({
      text: `Draft review frame ${capture.id}: ${JSON.stringify({
        camera: capture.camera,
        captureKind: capture.captureKind,
        probeReason: capture.probeReason,
        projectedRoute: capture.projectedRoute,
        projectedSubject: capture.projectedSubject,
        timeSeconds: capture.timeSeconds,
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

function buildStepUserContent(request: PathGenerationStepRequest): Array<Record<string, unknown>> {
  const content: Array<Record<string, unknown>> = [
    {
      text: [
        `Prompt: ${request.prompt}`,
        `Strategy version: ${request.strategyVersion}`,
        `Step index: ${request.stepIndex}`,
        `Draft controls: ${JSON.stringify(request.draftControls)}`,
        `Draft keyframes: ${JSON.stringify(request.draftKeyframes)}`,
        `Action history: ${JSON.stringify(request.actionHistory)}`,
        `Memory capture count: ${request.memoryCaptures.length}`,
        `Scene bounds: ${JSON.stringify(request.sceneBounds)}`,
      ].join('\n'),
      type: 'text',
    },
    {
      text: `Current capture metadata: ${JSON.stringify({
        camera: request.currentCapture.camera,
        height: request.currentCapture.height,
        id: request.currentCapture.id,
        role: request.currentCapture.role,
        width: request.currentCapture.width,
      })}`,
      type: 'text',
    },
    {
      image_url: {
        url: request.currentCapture.imageDataUrl,
      },
      type: 'image_url',
    },
  ];

  for (const capture of request.memoryCaptures) {
    content.push({
      text: `Memory capture ${capture.id}: ${JSON.stringify({
        camera: capture.camera,
        capturedAtStep: capture.capturedAtStep,
        height: capture.height,
        role: capture.role,
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

function parseStepMemoryCapture(value: unknown, context: string): PathGenerationStepMemoryCapture {
  const capture = parseCapture(value, context);
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    ...capture,
    capturedAtStep: readIntegerInRange(value, 'capturedAtStep', context, 0, 128),
  };
}

function parseKeyframeArray(value: unknown, context: string): PathGenerationKeyframe[] {
  if (!Array.isArray(value)) {
    throw new PathGenerationError(400, `${context} must be an array.`);
  }

  return value.map((entry, index) => parseKeyframe(entry, `${context}[${index}]`));
}

function parseKeyframe(value: unknown, context: string): PathGenerationKeyframe {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    fov: readFiniteNumber(value, 'fov', context),
    id: readString(value, 'id', context),
    position: parseVector3(value['position'], `${context}.position`),
    quaternion: parseQuaternion(value['quaternion'], `${context}.quaternion`),
    time: readFiniteNumber(value, 'time', context),
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

function parseGroundedRoute(value: unknown, context: string): PathGenerationGroundedRoute {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    averageClearance: readPositiveNumber(value, 'averageClearance', context),
    confidence: readFiniteNumber(value, 'confidence', context),
    length: readPositiveNumber(value, 'length', context),
    maxTurnDegrees: readFiniteNumber(value, 'maxTurnDegrees', context),
    routeId: readString(value, 'routeId', context),
    waypoints: parseVector3Array(value['waypoints'], `${context}.waypoints`),
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

function parseRouteObservationArray(
  value: unknown,
  captures: PathGenerationCapture[],
): PathGenerationRouteObservation[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new PathGenerationError(502, 'Vision planner grounding response is missing routeObservations.');
  }

  return value.map((entry, index) => parseRouteObservation(entry, `routeObservations[${index}]`, captures, index));
}

function parseRouteObservation(
  value: unknown,
  context: string,
  captures: PathGenerationCapture[],
  observationIndex: number,
): PathGenerationRouteObservation {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  const captureId = resolveLocalizationCaptureId(value, context, captures, observationIndex);
  const capture = captures.find(entry => entry.id === captureId) ?? null;
  return {
    captureId,
    centerlinePixels: parseRoutePixelPointArray(
      value['centerlinePixels'] ?? value['centerline'] ?? value['polyline'],
      `${context}.centerlinePixels`,
      capture,
      3,
      8,
    ),
    confidence: readFiniteNumber(value, 'confidence', context),
    entryPixel: parseRoutePixelPoint(value['entryPixel'] ?? value['entry'], `${context}.entryPixel`, capture),
    exitPixel: parseRoutePixelPoint(value['exitPixel'] ?? value['exit'], `${context}.exitPixel`, capture),
    routeKind: readNullableString(value, 'routeKind'),
    widthPixels: readNullableFiniteNumber(value, 'widthPixels'),
  };
}

function parseRoutePixelPointArray(
  value: unknown,
  context: string,
  capture: PathGenerationCapture | null,
  minimumLength: number,
  maximumLength: number,
): PathGenerationRoutePixelPoint[] {
  if (!Array.isArray(value) || value.length < minimumLength) {
    throw new PathGenerationError(502, `${context} must be an array with at least ${minimumLength} points.`);
  }

  return value
    .slice(0, maximumLength)
    .map((entry, index) => parseRoutePixelPoint(entry, `${context}[${index}]`, capture));
}

function parseRoutePixelPoint(
  value: unknown,
  context: string,
  capture: PathGenerationCapture | null,
): PathGenerationRoutePixelPoint {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  const x = readFiniteNumber(
    value,
    'x' in value ? 'x' : 'pixelX',
    context,
  );
  const y = readFiniteNumber(
    value,
    'y' in value ? 'y' : 'pixelY',
    context,
  );

  if (capture && (x < 0 || x > capture.width || y < 0 || y > capture.height)) {
    throw new PathGenerationError(502, `${context} must stay within the capture bounds.`);
  }

  return { x, y };
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
    requestedMoveTypes: parseRequestedMoveTypes(value['requestedMoveTypes'], `${context}.requestedMoveTypes`, pathMode),
    subjectHint: readNullableString(value, 'subjectHint'),
    targetDurationSeconds: readNullableFiniteNumber(value, 'targetDurationSeconds'),
    tone: readNullableString(value, 'tone'),
  };
}

function parseDraftControls(value: unknown, context: string): PathGenerationDraftControls {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    holdPreference: parseHoldPreference(value['holdPreference'] ?? 'auto', `${context}.holdPreference`),
    requestedDurationSeconds: readNullableFiniteNumber(value, 'requestedDurationSeconds'),
  };
}

function parseStrategyVersion(value: unknown, context: string): 'stepwise-v1' {
  if (value === 'stepwise-v1') {
    return value;
  }

  throw new PathGenerationError(400, `${context} must be "stepwise-v1".`);
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

function parseRequestedMoveTypes(
  value: unknown,
  context: string,
  pathMode: PathGenerationPathMode,
): PathGenerationSegmentType[] {
  const fallbackMove = pathMode === 'route-following' ? 'traverse' : 'arc';
  if (!Array.isArray(value)) {
    return [fallbackMove];
  }

  const moves = value
    .map(entry => coerceSegmentType(entry))
    .filter((entry): entry is PathGenerationSegmentType => entry !== null);
  return moves.length > 0 ? Array.from(new Set(moves)) : [fallbackMove];
}

function parseSegmentPlanArray(value: unknown, context: string): PathGenerationSegmentPlan[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new PathGenerationError(400, `${context} must be a non-empty array.`);
  }

  return value
    .slice(0, STATUS_CAPABILITIES.maxSegments)
    .map((entry, index) => parseSegmentPlan(entry, `${context}[${index}]`));
}

function parseSegmentPlan(value: unknown, context: string): PathGenerationSegmentPlan {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  const segmentType = coerceSegmentType(value['segmentType']);
  if (!segmentType) {
    throw new PathGenerationError(502, `${context}.segmentType must be hold, arc, dolly, pedestal, or traverse.`);
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

  if (segmentType === 'traverse') {
    return {
      ...baseSegment,
      distanceRatio: readOptionalFiniteNumber(value, 'distanceRatio'),
      lateralBias: value['lateralBias'] === undefined
        ? undefined
        : parseLateralBias(value['lateralBias'], `${context}.lateralBias`),
      segmentType,
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

function parseStepActionHistoryEntry(value: unknown, context: string): PathGenerationStepActionHistoryEntry {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  const outcome = readString(value, 'outcome', context);
  if (outcome !== 'applied' && outcome !== 'completed' && outcome !== 'rejected' && outcome !== 'stored') {
    throw new PathGenerationError(400, `${context}.outcome must be applied, completed, rejected, or stored.`);
  }

  return {
    action: parseStepAction(value['action'], `${context}.action`),
    note: readOptionalNonEmptyString(value, 'note'),
    outcome,
    stepIndex: readIntegerInRange(value, 'stepIndex', context, 0, 128),
  };
}

function parseStepAction(value: unknown, context: string): PathGenerationStepAction {
  if (!isRecord(value)) {
    throw new PathGenerationError(502, `${context} must be an object.`);
  }

  const type = readString(value, 'type', context);
  if (type === 'capture-image' || type === 'create-keyframe') {
    return { type };
  }

  if (type === 'move') {
    return {
      primitive: parseMovePrimitive(value['primitive'], `${context}.primitive`),
      type,
    };
  }

  if (type === 'rotate') {
    return {
      primitive: parseRotatePrimitive(value['primitive'], `${context}.primitive`),
      type,
    };
  }

  throw new PathGenerationError(502, `${context}.type must be move, rotate, capture-image, or create-keyframe.`);
}

function coerceSegmentType(value: unknown): PathGenerationSegmentType | null {
  if (value === 'hold' || value === 'arc' || value === 'dolly' || value === 'pedestal' || value === 'traverse') {
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
  if (normalized === 'traverse' || normalized === 'follow' || normalized === 'route' || normalized === 'travel') {
    return 'traverse';
  }

  return null;
}

function parseDirection(value: unknown, context: string): AgenticOrbitDirection {
  if (value === 'clockwise' || value === 'counterclockwise') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === 'cw'
      || normalized.includes('clockwise')
      || normalized.includes('right')
    ) {
      return 'clockwise';
    }
    if (
      normalized === 'ccw'
      || normalized.includes('counterclockwise')
      || normalized.includes('anticlockwise')
      || normalized.includes('anti-clockwise')
      || normalized.includes('left')
    ) {
      return 'counterclockwise';
    }
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

function parseLateralBias(value: unknown, context: string): PathGenerationLateralBias {
  if (value === 'left' || value === 'center' || value === 'right') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('left')) {
      return 'left';
    }
    if (normalized.includes('right')) {
      return 'right';
    }
    if (normalized.includes('center') || normalized.includes('middle') || normalized.includes('balanced')) {
      return 'center';
    }
  }

  throw new PathGenerationError(502, `${context} must be "left", "center", or "right".`);
}

function parseHoldPreference(value: unknown, context: string): PathGenerationHoldPreference {
  if (value === 'auto' || value === 'none' || value === 'brief' || value === 'linger') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('off') || normalized.includes('none')) {
      return 'none';
    }
    if (normalized.includes('brief') || normalized.includes('short')) {
      return 'brief';
    }
    if (normalized.includes('linger') || normalized.includes('long')) {
      return 'linger';
    }
  }

  throw new PathGenerationError(400, `${context} must be "auto", "none", "brief", or "linger".`);
}

function parseMovePrimitive(value: unknown, context: string): PathGenerationStepMovePrimitive {
  if (
    value === 'forward-short'
    || value === 'forward-medium'
    || value === 'back-short'
    || value === 'strafe-left-short'
    || value === 'strafe-right-short'
    || value === 'rise-short'
    || value === 'lower-short'
  ) {
    return value;
  }

  throw new PathGenerationError(502, `${context} must be a supported move primitive.`);
}

function parseRotatePrimitive(value: unknown, context: string): PathGenerationStepRotatePrimitive {
  if (
    value === 'yaw-left-small'
    || value === 'yaw-right-small'
    || value === 'yaw-left-medium'
    || value === 'yaw-right-medium'
    || value === 'pitch-up-small'
    || value === 'pitch-down-small'
  ) {
    return value;
  }

  throw new PathGenerationError(502, `${context} must be a supported rotate primitive.`);
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

function parseVector3Array(value: unknown, context: string): PathGenerationVector3[] {
  if (!Array.isArray(value) || value.length < 2) {
    throw new PathGenerationError(400, `${context} must be an array with at least two points.`);
  }

  return value.map((entry, index) => parseVector3(entry, `${context}[${index}]`));
}

function parseVerifyCapture(value: unknown, context: string): PathGenerationVerifyCapture {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    camera: parseCamera(value['camera'], `${context}.camera`),
    captureKind: parseVerifyCaptureKind(value['captureKind'] ?? 'draft-sample', `${context}.captureKind`),
    height: readFiniteNumber(value, 'height', context),
    id: readString(value, 'id', context),
    imageDataUrl: readString(value, 'imageDataUrl', context),
    probeReason: parseVerifyProbeReason(value['probeReason'] ?? 'overview', `${context}.probeReason`),
    projectedRoute: value['projectedRoute'] === undefined
      ? undefined
      : parseVerifyProjectedRoute(value['projectedRoute'], `${context}.projectedRoute`),
    projectedSubject: value['projectedSubject'] === undefined
      ? undefined
      : parseVerifyProjectedSubject(value['projectedSubject'], `${context}.projectedSubject`),
    timeSeconds: readFiniteNumber(value, 'timeSeconds', context),
    width: readFiniteNumber(value, 'width', context),
  };
}

function parseVerifyCaptureKind(value: unknown, context: string): PathGenerationVerifyCaptureKind {
  if (value === 'draft-sample' || value === 'active-probe') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('probe')) {
      return 'active-probe';
    }
    if (normalized.includes('sample') || normalized.includes('draft') || normalized.includes('path')) {
      return 'draft-sample';
    }
  }

  throw new PathGenerationError(400, `${context} must be "draft-sample" or "active-probe".`);
}

function parseVerifyProbeReason(value: unknown, context: string): PathGenerationVerifyProbeReason {
  if (
    value === 'overview'
    || value === 'floor-clearance'
    || value === 'subject-framing'
    || value === 'subject-distance'
    || value === 'segment-transition'
    || value === 'hold-read'
    || value === 'long-path-lookahead'
  ) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes('floor') || normalized.includes('clearance') || normalized.includes('under')) {
      return 'floor-clearance';
    }
    if (normalized.includes('frame') || normalized.includes('edge') || normalized.includes('subject')) {
      return normalized.includes('distance') || normalized.includes('close')
        ? 'subject-distance'
        : 'subject-framing';
    }
    if (normalized.includes('distance') || normalized.includes('close')) {
      return 'subject-distance';
    }
    if (normalized.includes('transition') || normalized.includes('boundary')) {
      return 'segment-transition';
    }
    if (normalized.includes('hold') || normalized.includes('pause')) {
      return 'hold-read';
    }
    if (normalized.includes('lookahead') || normalized.includes('long')) {
      return 'long-path-lookahead';
    }
    if (normalized.includes('overview') || normalized.includes('sample')) {
      return 'overview';
    }
  }

  throw new PathGenerationError(
    400,
    `${context} must be a supported verification capture reason.`,
  );
}

function parseVerifyProjectedSubject(
  value: unknown,
  context: string,
): NonNullable<PathGenerationVerifyCapture['projectedSubject']> {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    ndcX: readFiniteNumber(value, 'ndcX', context),
    ndcY: readFiniteNumber(value, 'ndcY', context),
    visible: value['visible'] === true,
  };
}

function parseVerifyProjectedRoute(
  value: unknown,
  context: string,
): NonNullable<PathGenerationVerifyCapture['projectedRoute']> {
  if (!isRecord(value)) {
    throw new PathGenerationError(400, `${context} must be an object.`);
  }

  return {
    centerNdcX: readFiniteNumber(value, 'centerNdcX', context),
    clearanceMargin: readFiniteNumber(value, 'clearanceMargin', context),
    headingErrorDegrees: readFiniteNumber(value, 'headingErrorDegrees', context),
    visibleFraction: readFiniteNumber(value, 'visibleFraction', context),
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

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value <= -0.25) {
      return 'low';
    }
    if (value >= 0.25) {
      return 'high';
    }
    return 'mid';
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (
      normalized.includes('mid')
      || normalized.includes('medium')
      || normalized.includes('center')
      || normalized.includes('middle')
      || normalized.includes('neutral')
      || normalized.includes('eye')
      || normalized.includes('level')
    ) {
      return 'mid';
    }
    if (
      normalized.includes('high')
      || normalized.includes('top')
      || normalized.includes('upper')
      || normalized.includes('elevated')
      || normalized.includes('above')
      || normalized.includes('overhead')
    ) {
      return 'high';
    }
    if (
      normalized.includes('low')
      || normalized.includes('bottom')
      || normalized.includes('lower')
      || normalized.includes('ground')
      || normalized.includes('below')
      || normalized.includes('under')
    ) {
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
  if (pathMode === 'multi-subject') {
    return 'Multi-subject path prompts are not supported in agentic path v2.1.';
  }
  if (pathMode === 'ambiguous') {
    return 'The prompt is too ambiguous for agentic path v2.1. Name one clear subject or one clear route.';
  }
  return 'The prompt is not supported in agentic path v2.1.';
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
