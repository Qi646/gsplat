import { describe, expect, it, vi } from 'vitest';
import {
  OpenAIVisionPathPlanner,
  parsePathGenerationComposeModelResponse,
  parsePathGenerationComposeRequest,
  parsePathGenerationGroundModelResponse,
  parsePathGenerationGroundRequest,
  parsePathGenerationStepModelResponse,
  parsePathGenerationStepRequest,
  parsePathGenerationVerifyModelResponse,
  parsePathGenerationVerifyRequest,
} from '../src/pathGeneration.js';

function createGroundRequest() {
  return {
    captureRound: 1,
    captures: [
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 4, y: 1, z: 0 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        height: 360,
        id: 'capture-current',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        role: 'current',
        width: 640,
      },
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 0, y: 1, z: 4 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        height: 360,
        id: 'capture-scout-1',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        role: 'scout',
        width: 640,
      },
    ],
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    pathTail: null,
    prompt: 'Orbit the truck and keep the camera on it.',
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
  };
}

function createStepRequest() {
  const groundRequest = createGroundRequest();
  return {
    actionHistory: [
      {
        action: { type: 'create-keyframe' },
        outcome: 'stored',
        stepIndex: 0,
      },
    ],
    currentCapture: groundRequest.captures[0],
    draftControls: {
      holdPreference: 'auto',
      requestedDurationSeconds: 12,
    },
    draftKeyframes: [
      {
        fov: 60,
        id: 'kf-1',
        position: { x: 4, y: 1, z: 0 },
        quaternion: { x: 0, y: 0, z: 0, w: 1 },
        time: 0,
      },
    ],
    memoryCaptures: [
      {
        ...groundRequest.captures[1],
        capturedAtStep: 1,
      },
    ],
    prompt: 'Follow the corridor forward and save strong viewpoints.',
    sceneBounds: groundRequest.sceneBounds,
    stepIndex: 2,
    strategyVersion: 'stepwise-v1',
  };
}

function createComposeRequest() {
  return {
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    groundedSubject: {
      anchor: { x: 0, y: 0.5, z: 0 },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 4,
      confidence: 0.84,
      meanResidual: 0.08,
      sceneScale: 8,
    },
    groundedRoute: null,
    intent: {
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode: 'subject-centric',
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 10,
      tone: 'cinematic',
    },
    draftControls: {
      holdPreference: 'brief',
      requestedDurationSeconds: 10,
    },
    pathTail: null,
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
    validationFeedback: ['Subject drifted out of the safe frame box.'],
  };
}

function createVerifyRequest() {
  return {
    captures: [
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 4, y: 1, z: 0 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        captureKind: 'draft-sample',
        height: 360,
        id: 'verify-sample-1',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        probeReason: 'overview',
        projectedSubject: {
          ndcX: 0.04,
          ndcY: -0.03,
          visible: true,
        },
        timeSeconds: 8,
        width: 640,
      },
    ],
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    draftControls: {
      holdPreference: 'linger',
      requestedDurationSeconds: 12,
    },
    groundedSubject: {
      anchor: { x: 0, y: 0.5, z: 0 },
      basisForward: { x: 0, y: 0, z: -1 },
      basisUp: { x: 0, y: 1, z: 0 },
      captureCount: 4,
      confidence: 0.84,
      meanResidual: 0.08,
      sceneScale: 8,
    },
    groundedRoute: null,
    intent: {
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode: 'subject-centric',
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 12,
      tone: 'cinematic',
    },
    prompt: 'Orbit the truck and end on a lingering hold.',
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
    segments: [
      {
        direction: 'counterclockwise',
        durationSeconds: 8,
        lookMode: 'look-at-subject',
        segmentType: 'arc',
        sweepDegrees: 120,
      },
      {
        durationSeconds: 4,
        lookMode: 'look-at-subject',
        segmentType: 'hold',
      },
    ],
    summary: 'Orbit around the truck, then linger on the badge.',
  };
}

function createRouteComposeRequest() {
  return {
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    groundedRoute: {
      averageClearance: 1.2,
      confidence: 0.86,
      length: 9.5,
      maxTurnDegrees: 42,
      routeId: 'route-main',
      waypoints: [
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 1 },
        { x: 5, y: 0, z: 3 },
      ],
    },
    groundedSubject: null,
    intent: {
      continuousPath: true,
      orientationPreference: 'look-forward',
      pathMode: 'route-following',
      requestedMoveTypes: ['traverse', 'hold'],
      subjectHint: 'road',
      targetDurationSeconds: 12,
      tone: 'dynamic',
    },
    draftControls: {
      holdPreference: 'brief',
      requestedDurationSeconds: 12,
    },
    pathTail: null,
    sceneBounds: {
      max: { x: 8, y: 4, z: 8 },
      min: { x: -4, y: -2, z: -4 },
    },
    validationFeedback: ['The route draft lost the corridor near the end.'],
  };
}

function createRouteVerifyRequest() {
  return {
    captures: [
      {
        camera: {
          aspect: 16 / 9,
          fov: 60,
          position: { x: 4, y: 1, z: 0 },
          quaternion: { x: 0, y: 0, z: 0, w: 1 },
        },
        captureKind: 'active-probe',
        height: 360,
        id: 'verify-probe-1',
        imageDataUrl: 'data:image/jpeg;base64,AA==',
        probeReason: 'segment-transition',
        projectedRoute: {
          centerNdcX: 0.08,
          clearanceMargin: 0.55,
          headingErrorDegrees: 9,
          visibleFraction: 0.74,
        },
        timeSeconds: 6,
        width: 640,
      },
    ],
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    draftControls: {
      holdPreference: 'brief',
      requestedDurationSeconds: 12,
    },
    groundedRoute: {
      averageClearance: 1.2,
      confidence: 0.86,
      length: 9.5,
      maxTurnDegrees: 42,
      routeId: 'route-main',
      waypoints: [
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 1 },
        { x: 5, y: 0, z: 3 },
      ],
    },
    groundedSubject: null,
    intent: {
      continuousPath: true,
      orientationPreference: 'look-forward',
      pathMode: 'route-following',
      requestedMoveTypes: ['traverse', 'hold'],
      subjectHint: 'road',
      targetDurationSeconds: 12,
      tone: 'dynamic',
    },
    prompt: 'Follow the road and end with a brief pause.',
    sceneBounds: {
      max: { x: 8, y: 4, z: 8 },
      min: { x: -4, y: -2, z: -4 },
    },
    segments: [
      {
        distanceRatio: 0.9,
        durationSeconds: 9,
        lateralBias: 'center',
        lookMode: 'look-forward',
        segmentType: 'traverse',
        verticalBias: 'mid',
      },
      {
        durationSeconds: 3,
        lookMode: 'look-forward',
        segmentType: 'hold',
      },
    ],
    summary: 'Follow the road and settle into a short ending hold.',
  };
}

describe('pathGeneration request parsing', () => {
  it('accepts valid ground requests', () => {
    const parsed = parsePathGenerationGroundRequest(createGroundRequest());

    expect(parsed.prompt).toContain('Orbit the truck');
    expect(parsed.captureRound).toBe(1);
    expect(parsed.captures).toHaveLength(2);
  });

  it('accepts valid compose requests', () => {
    const parsed = parsePathGenerationComposeRequest(createComposeRequest());

    expect(parsed.intent.pathMode).toBe('subject-centric');
    expect(parsed.groundedRoute).toBeNull();
    expect(parsed.draftControls).toEqual({
      holdPreference: 'brief',
      requestedDurationSeconds: 10,
    });
    expect(parsed.validationFeedback).toEqual(['Subject drifted out of the safe frame box.']);
  });

  it('accepts valid route-following compose requests', () => {
    const parsed = parsePathGenerationComposeRequest(createRouteComposeRequest());

    expect(parsed.intent.pathMode).toBe('route-following');
    expect(parsed.groundedSubject).toBeNull();
    expect(parsed.groundedRoute?.routeId).toBe('route-main');
    expect(parsed.intent.requestedMoveTypes).toContain('traverse');
  });

  it('accepts valid verify requests', () => {
    const parsed = parsePathGenerationVerifyRequest(createVerifyRequest());

    expect(parsed.prompt).toContain('lingering hold');
    expect(parsed.draftControls).toEqual({
      holdPreference: 'linger',
      requestedDurationSeconds: 12,
    });
    expect(parsed.captures).toHaveLength(1);
    expect(parsed.captures[0]).toMatchObject({
      captureKind: 'draft-sample',
      probeReason: 'overview',
    });
  });

  it('accepts valid route-following verify requests', () => {
    const parsed = parsePathGenerationVerifyRequest(createRouteVerifyRequest());

    expect(parsed.intent.pathMode).toBe('route-following');
    expect(parsed.groundedRoute?.routeId).toBe('route-main');
    expect(parsed.captures[0]).toMatchObject({
      captureKind: 'active-probe',
      projectedRoute: {
        centerNdcX: 0.08,
      },
    });
  });

  it('accepts valid stepwise requests', () => {
    const parsed = parsePathGenerationStepRequest(createStepRequest());

    expect(parsed.strategyVersion).toBe('stepwise-v1');
    expect(parsed.currentCapture.id).toBe('capture-current');
    expect(parsed.memoryCaptures[0]?.capturedAtStep).toBe(1);
    expect(parsed.actionHistory[0]?.action).toEqual({ type: 'create-keyframe' });
  });

  it('normalizes verify-capture aliases for active probes', () => {
    const request = createVerifyRequest();
    request.captures = [
      {
        ...request.captures[0],
        captureKind: 'probe',
        probeReason: 'floor check',
      },
    ];

    const parsed = parsePathGenerationVerifyRequest(request);

    expect(parsed.captures[0]).toMatchObject({
      captureKind: 'active-probe',
      probeReason: 'floor-clearance',
    });
  });
});

describe('pathGeneration model-response parsing', () => {
  it('accepts valid ground responses', () => {
    const parsed = parsePathGenerationGroundModelResponse({
      intent: {
        continuousPath: true,
        orientationPreference: 'look-forward',
        pathMode: 'subject-centric',
        requestedMoveTypes: ['arc', 'dolly'],
        subjectHint: 'truck',
        targetDurationSeconds: 12,
        tone: 'cinematic',
      },
      pathMode: 'subject-centric',
      subjectLocalizations: [
        { captureId: 'capture-current', confidence: 0.94, pixelX: 320, pixelY: 240 },
        { captureId: 'capture-scout-1', confidence: 0.88, pixelX: 300, pixelY: 210 },
      ],
    });

    expect(parsed.intent.orientationPreference).toBe('look-forward');
    expect(parsed.intent.requestedMoveTypes).toEqual(['arc', 'dolly']);
    expect(parsed.subjectLocalizations).toHaveLength(2);
  });

  it('backfills missing capture ids from request capture order', () => {
    const request = createGroundRequest();
    const parsed = parsePathGenerationGroundModelResponse({
      intent: {
        continuousPath: true,
        orientationPreference: 'look-at-subject',
        pathMode: 'subject-centric',
        requestedMoveTypes: ['arc'],
        subjectHint: 'truck',
        targetDurationSeconds: 8,
        tone: 'cinematic',
      },
      pathMode: 'subject-centric',
      subjectLocalizations: [
        { confidence: 0.94, pixelX: 320, pixelY: 240 },
        { confidence: 0.88, pixelX: 300, pixelY: 210 },
      ],
    }, request.captures);

    expect(parsed.subjectLocalizations).toEqual([
      { captureId: 'capture-current', confidence: 0.94, pixelX: 320, pixelY: 240 },
      { captureId: 'capture-scout-1', confidence: 0.88, pixelX: 300, pixelY: 210 },
    ]);
  });

  it('accepts common capture id aliases from the model output', () => {
    const request = createGroundRequest();
    const parsed = parsePathGenerationGroundModelResponse({
      intent: {
        continuousPath: true,
        orientationPreference: 'look-at-subject',
        pathMode: 'subject-centric',
        requestedMoveTypes: ['arc'],
        subjectHint: 'truck',
        targetDurationSeconds: 8,
        tone: 'cinematic',
      },
      pathMode: 'subject-centric',
      subjectLocalizations: [
        { capture: 'current', confidence: 0.94, pixelX: 320, pixelY: 240 },
        { id: 'scout-1', confidence: 0.88, pixelX: 300, pixelY: 210 },
      ],
    }, request.captures);

    expect(parsed.subjectLocalizations).toEqual([
      { captureId: 'capture-current', confidence: 0.94, pixelX: 320, pixelY: 240 },
      { captureId: 'capture-scout-1', confidence: 0.88, pixelX: 300, pixelY: 210 },
    ]);
  });

  it('accepts supported route-following classifications with route observations', () => {
    const request = createGroundRequest();
    const parsed = parsePathGenerationGroundModelResponse({
      intent: {
        continuousPath: true,
        orientationPreference: 'look-forward',
        pathMode: 'route-following',
        requestedMoveTypes: ['traverse'],
        subjectHint: 'trees',
        targetDurationSeconds: 8,
        tone: 'dynamic',
      },
      pathMode: 'route-following',
      subjectLocalizations: [],
      routeObservations: [
        {
          captureId: 'capture-current',
          confidence: 0.91,
          entryPixel: { x: 120, y: 300 },
          exitPixel: { x: 520, y: 120 },
          centerlinePixels: [
            { x: 120, y: 300 },
            { x: 260, y: 250 },
            { x: 410, y: 190 },
            { x: 520, y: 120 },
          ],
          routeKind: 'corridor',
          widthPixels: 180,
        },
      ],
    }, request.captures);

    expect(parsed.pathMode).toBe('route-following');
    expect(parsed.unsupportedReason).toBeUndefined();
    expect(parsed.routeObservations).toHaveLength(1);
    expect(parsed.routeObservations?.[0]?.centerlinePixels).toHaveLength(4);
  });

  it('accepts valid composed segment plans', () => {
    const parsed = parsePathGenerationComposeModelResponse({
      segments: [
        {
          direction: 'counterclockwise',
          durationSeconds: 4,
          lookMode: 'look-at-subject',
          segmentType: 'arc',
          sweepDegrees: 120,
        },
        {
          durationSeconds: 2,
          lookMode: 'look-at-subject',
          segmentType: 'hold',
        },
      ],
      summary: 'Arc around the truck, then hold for a beat.',
    });

    expect(parsed.summary).toContain('truck');
    expect(parsed.segments).toHaveLength(2);
    expect(parsed.segments[0]?.segmentType).toBe('arc');
    expect(parsed.segments[1]?.segmentType).toBe('hold');
  });

  it('accepts traverse segment plans for route-following', () => {
    const parsed = parsePathGenerationComposeModelResponse({
      segments: [
        {
          distanceRatio: 0.88,
          durationSeconds: 9,
          lateralBias: 'middle',
          lookMode: 'look-forward',
          segmentType: 'traverse',
          verticalBias: 'eye-level',
        },
      ],
      summary: 'Follow the corridor in one continuous move.',
    });

    expect(parsed.segments[0]).toMatchObject({
      segmentType: 'traverse',
      lateralBias: 'center',
      verticalBias: 'mid',
    });
  });

  it('accepts valid stepwise action responses', () => {
    const parsed = parsePathGenerationStepModelResponse({
      action: {
        primitive: 'forward-medium',
        type: 'move',
      },
      complete: false,
      pathMode: 'route-following',
      reason: 'Advance along the corridor before committing another keyframe.',
    });

    expect(parsed).toEqual({
      action: {
        primitive: 'forward-medium',
        type: 'move',
      },
      complete: false,
      pathMode: 'route-following',
      reason: 'Advance along the corridor before committing another keyframe.',
      warning: undefined,
    });
  });

  it('normalizes loose arc direction labels', () => {
    const parsed = parsePathGenerationComposeModelResponse({
      segments: [
        {
          direction: 'right',
          durationSeconds: 4,
          lookMode: 'look-at-subject',
          segmentType: 'arc',
          sweepDegrees: 90,
        },
        {
          direction: 'ccw',
          durationSeconds: 4,
          lookMode: 'look-at-subject',
          segmentType: 'arc',
          sweepDegrees: 90,
        },
      ],
      summary: 'Two arcs around the truck.',
    });

    expect(parsed.segments[0]?.segmentType).toBe('arc');
    expect(parsed.segments[0]?.direction).toBe('clockwise');
    expect(parsed.segments[1]?.segmentType).toBe('arc');
    expect(parsed.segments[1]?.direction).toBe('counterclockwise');
  });

  it('normalizes loose vertical-bias labels', () => {
    const parsed = parsePathGenerationComposeModelResponse({
      segments: [
        {
          distanceScale: 0.9,
          durationSeconds: 4,
          lookMode: 'look-at-subject',
          segmentType: 'dolly',
          travelDirection: 'in',
          verticalBias: 'eye-level',
        },
        {
          direction: 'clockwise',
          durationSeconds: 4,
          lookMode: 'look-at-subject',
          segmentType: 'arc',
          sweepDegrees: 90,
          verticalBias: 0.15,
        },
        {
          durationSeconds: 4,
          heightScale: 0.4,
          lookMode: 'look-at-subject',
          segmentType: 'pedestal',
          travelDirection: 'up',
        },
        {
          direction: 'clockwise',
          durationSeconds: 4,
          lookMode: 'look-at-subject',
          segmentType: 'arc',
          sweepDegrees: 90,
          verticalBias: 'slightly elevated',
        },
      ],
      summary: 'Push in, rise, then arc high around the truck.',
    });

    expect(parsed.segments[0]?.segmentType).toBe('dolly');
    expect(parsed.segments[0]?.verticalBias).toBe('mid');
    expect(parsed.segments[1]?.segmentType).toBe('arc');
    expect(parsed.segments[1]?.verticalBias).toBe('mid');
    expect(parsed.segments[3]?.segmentType).toBe('arc');
    expect(parsed.segments[3]?.verticalBias).toBe('high');
  });

  it('accepts valid planner verification responses', () => {
    const parsed = parsePathGenerationVerifyModelResponse({
      approved: false,
      issues: ['The ending hold is too short.'],
    });

    expect(parsed.approved).toBe(false);
    expect(parsed.issues).toEqual(['The ending hold is too short.']);
  });
});

describe('OpenAIVisionPathPlanner status', () => {
  it('reports unavailable when no API key is configured', () => {
    const planner = new OpenAIVisionPathPlanner({ model: 'gpt-4.1-mini' });
    const originalApiKey = process.env['OPENAI_API_KEY'];
    delete process.env['OPENAI_API_KEY'];

    try {
      expect(planner.getStatus()).toEqual({
        available: false,
        capabilities: {
          includesActiveVerificationProbes: true,
          includesPlannerVerification: true,
          maxCaptureRounds: 2,
          maxSegments: 4,
          maxVerificationCaptures: 8,
          segmentTypes: ['hold', 'arc', 'dolly', 'pedestal', 'traverse'],
          supportedPathModes: ['subject-centric', 'route-following'],
          unsupportedPathModes: ['multi-subject', 'ambiguous'],
        },
        model: 'gpt-4.1-mini',
        plannerVersion: 'multistep-v2',
        reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
        strategies: [
          {
            available: false,
            experimental: false,
            id: 'multistep-v2',
            label: 'Planner Draft',
            reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
          },
          {
            available: false,
            experimental: true,
            id: 'stepwise-v1',
            label: 'Stepwise Agent',
            reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
          },
        ],
      });
    } finally {
      if (originalApiKey === undefined) {
        delete process.env['OPENAI_API_KEY'];
      } else {
        process.env['OPENAI_API_KEY'] = originalApiKey;
      }
    }
  });
});

describe('OpenAIVisionPathPlanner request compatibility', () => {
  it('uses max_completion_tokens by default and falls back to max_tokens when grounding', async () => {
    const requestBodies: Array<Record<string, unknown>> = [];
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      requestBodies.push(JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>);
      if (requestBodies.length === 1) {
        return new Response(JSON.stringify({
          error: {
            message: "Unsupported parameter: 'max_completion_tokens' is not supported with this model. Use 'max_tokens' instead.",
            param: 'max_completion_tokens',
            type: 'invalid_request_error',
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      return new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: {
                  continuousPath: true,
                  orientationPreference: 'look-at-subject',
                  pathMode: 'subject-centric',
                  requestedMoveTypes: ['arc'],
                  subjectHint: 'truck',
                  targetDurationSeconds: 10,
                  tone: 'cinematic',
                },
                pathMode: 'subject-centric',
                subjectLocalizations: [
                  { captureId: 'capture-current', confidence: 0.96, pixelX: 320, pixelY: 240 },
                  { captureId: 'capture-scout-1', confidence: 0.91, pixelX: 300, pixelY: 220 },
                ],
              }),
            },
          },
        ],
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;
    const planner = new OpenAIVisionPathPlanner({
      apiKey: 'test-key',
      fetchImpl,
      model: 'gpt-4.1-mini',
    });

    const response = await planner.groundPathIntent(createGroundRequest());

    expect(response.pathMode).toBe('subject-centric');
    expect(response.subjectLocalizations).toHaveLength(2);
    expect(requestBodies).toHaveLength(2);
    expect(requestBodies[0]?.['max_completion_tokens']).toBe(1800);
    expect(requestBodies[0]?.['max_tokens']).toBeUndefined();
    expect(requestBodies[1]?.['max_tokens']).toBe(1800);
    expect(requestBodies[1]?.['max_completion_tokens']).toBeUndefined();
  });

  it('omits custom temperature and adds minimal reasoning effort for GPT-5 family models when composing', async () => {
    const requestBodies: Array<Record<string, unknown>> = [];
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      requestBodies.push(JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>);
      return new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                segments: [
                  {
                    durationSeconds: 4,
                    lookMode: 'look-at-subject',
                    segmentType: 'arc',
                    sweepDegrees: 120,
                  },
                ],
                summary: 'Arc around the subject.',
              }),
            },
          },
        ],
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;
    const planner = new OpenAIVisionPathPlanner({
      apiKey: 'test-key',
      fetchImpl,
      model: 'gpt-5-mini-2025-08-07',
    });

    const response = await planner.composePathPlan(createComposeRequest());

    expect(response.segments).toHaveLength(1);
    expect(requestBodies).toHaveLength(1);
    expect(requestBodies[0]?.['max_completion_tokens']).toBe(1800);
    expect(requestBodies[0]?.['reasoning_effort']).toBe('minimal');
    expect(requestBodies[0]?.['temperature']).toBeUndefined();
    expect(requestBodies[0]?.['response_format']).toEqual({ type: 'json_object' });
  });

  it('falls back from reasoning_effort and parses structured completion content', async () => {
    const requestBodies: Array<Record<string, unknown>> = [];
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      requestBodies.push(JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>);
      if (requestBodies.length === 1) {
        return new Response(JSON.stringify({
          error: {
            message: "Unsupported parameter: 'reasoning_effort' is not supported with this model.",
            param: 'reasoning_effort',
            type: 'invalid_request_error',
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      return new Response(JSON.stringify({
        choices: [
          {
            finish_reason: 'stop',
            message: {
              content: [
                {
                  text: {
                    value: JSON.stringify({
                      segments: [
                        {
                          durationSeconds: 4,
                          lookMode: 'look-at-subject',
                          segmentType: 'arc',
                          sweepDegrees: 120,
                        },
                      ],
                      summary: 'Arc around the subject.',
                    }),
                  },
                  type: 'output_text',
                },
              ],
            },
          },
        ],
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;
    const planner = new OpenAIVisionPathPlanner({
      apiKey: 'test-key',
      fetchImpl,
      model: 'gpt-5-mini-2025-08-07',
    });

    const response = await planner.composePathPlan(createComposeRequest());

    expect(response.segments).toHaveLength(1);
    expect(requestBodies).toHaveLength(2);
    expect(requestBodies[0]?.['reasoning_effort']).toBe('minimal');
    expect(requestBodies[1]?.['reasoning_effort']).toBeUndefined();
  });

  it('retries through temperature and response_format compatibility fallbacks', async () => {
    const requestBodies: Array<Record<string, unknown>> = [];
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      requestBodies.push(JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>);
      if (requestBodies.length === 1) {
        return new Response(JSON.stringify({
          error: {
            message: "Unsupported value: 'temperature' does not support 0.2 with this model. Only the default (1) value is supported.",
            param: 'temperature',
            type: 'invalid_request_error',
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      if (requestBodies.length === 2) {
        return new Response(JSON.stringify({
          error: {
            message: "Unsupported parameter: 'response_format' is not supported with this model.",
            param: 'response_format',
            type: 'invalid_request_error',
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      return new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                intent: {
                  continuousPath: true,
                  orientationPreference: 'look-at-subject',
                  pathMode: 'subject-centric',
                  requestedMoveTypes: ['arc'],
                  subjectHint: 'truck',
                  targetDurationSeconds: 10,
                  tone: 'cinematic',
                },
                pathMode: 'subject-centric',
                subjectLocalizations: [
                  { captureId: 'capture-current', confidence: 0.96, pixelX: 320, pixelY: 240 },
                  { captureId: 'capture-scout-1', confidence: 0.91, pixelX: 300, pixelY: 220 },
                ],
              }),
            },
          },
        ],
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }) as unknown as typeof fetch;
    const planner = new OpenAIVisionPathPlanner({
      apiKey: 'test-key',
      fetchImpl,
      model: 'custom-vision-model',
    });

    const response = await planner.groundPathIntent(createGroundRequest());

    expect(response.pathMode).toBe('subject-centric');
    expect(requestBodies).toHaveLength(3);
    expect(requestBodies[0]?.['temperature']).toBe(0.2);
    expect(requestBodies[0]?.['response_format']).toEqual({ type: 'json_object' });
    expect(requestBodies[1]?.['temperature']).toBeUndefined();
    expect(requestBodies[1]?.['response_format']).toEqual({ type: 'json_object' });
    expect(requestBodies[2]?.['temperature']).toBeUndefined();
    expect(requestBodies[2]?.['response_format']).toBeUndefined();
  });
});
