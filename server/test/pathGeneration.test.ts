import { describe, expect, it, vi } from 'vitest';
import {
  OpenAIVisionPathPlanner,
  parsePathGenerationComposeModelResponse,
  parsePathGenerationComposeRequest,
  parsePathGenerationGroundModelResponse,
  parsePathGenerationGroundRequest,
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
    intent: {
      continuousPath: true,
      orientationPreference: 'look-at-subject',
      pathMode: 'subject-centric',
      requestedMoveTypes: ['arc', 'hold'],
      subjectHint: 'truck',
      targetDurationSeconds: 10,
      tone: 'cinematic',
    },
    pathTail: null,
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
    validationFeedback: ['Subject drifted out of the safe frame box.'],
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
    expect(parsed.validationFeedback).toEqual(['Subject drifted out of the safe frame box.']);
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

  it('accepts unsupported route-following classifications', () => {
    const parsed = parsePathGenerationGroundModelResponse({
      intent: {
        continuousPath: true,
        orientationPreference: 'look-forward',
        pathMode: 'route-following',
        requestedMoveTypes: [],
        subjectHint: 'trees',
        targetDurationSeconds: 8,
        tone: 'dynamic',
      },
      pathMode: 'route-following',
      subjectLocalizations: [],
      unsupportedReason: 'Route-following prompts are not supported in v1.',
    });

    expect(parsed.pathMode).toBe('route-following');
    expect(parsed.unsupportedReason).toMatch(/not supported/i);
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
          maxCaptureRounds: 2,
          maxSegments: 4,
          segmentTypes: ['hold', 'arc', 'dolly', 'pedestal'],
          supportedPathModes: ['subject-centric'],
          unsupportedPathModes: ['route-following', 'multi-subject', 'ambiguous'],
        },
        model: 'gpt-4.1-mini',
        plannerVersion: 'multistep-v1',
        reason: 'Agentic path generation is disabled because OPENAI_API_KEY is not configured on the server.',
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
