import { describe, expect, it, vi } from 'vitest';
import {
  OpenAIVisionPathPlanner,
  parseModelPathPlan,
  parsePathGenerationRequest,
} from '../src/pathGeneration.js';

function createPathGenerationRequest() {
  return {
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
    ],
    currentCamera: {
      aspect: 16 / 9,
      fov: 60,
      position: { x: 4, y: 1, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    },
    pathTail: null,
    plannerHistory: [],
    prompt: 'Orbit the truck and keep the camera on it.',
    remainingStepBudget: 2,
    sceneBounds: {
      max: { x: 2, y: 2, z: 2 },
      min: { x: -2, y: -2, z: -2 },
    },
  };
}

describe('pathGeneration request parsing', () => {
  it('accepts valid multi-capture generation requests', () => {
    const parsed = parsePathGenerationRequest({
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
      prompt: 'Orbit the truck with the camera facing forward.',
      sceneBounds: {
        max: { x: 2, y: 2, z: 2 },
        min: { x: -2, y: -2, z: -2 },
      },
    });

    expect(parsed.prompt).toContain('Orbit the truck');
    expect(parsed.captures).toHaveLength(2);
  });
});

describe('pathGeneration model-plan parsing', () => {
  it('accepts valid orbit plans with subject localizations', () => {
    const parsed = parseModelPathPlan({
      shotSpec: {
        fullOrbit: false,
        orientationMode: 'look-forward',
        pathType: 'orbit',
      },
      subjectLocalizations: [
        { captureId: 'capture-current', confidence: 0.94, pixelX: 320, pixelY: 240 },
        { captureId: 'capture-scout-1', confidence: 0.88, pixelX: 300, pixelY: 210 },
      ],
    });

    expect(parsed.shotSpec?.orientationMode).toBe('look-forward');
    expect(parsed.subjectLocalizations).toHaveLength(2);
  });

  it('rejects invalid orbit orientation modes', () => {
    expect(() =>
      parseModelPathPlan({
        shotSpec: {
          fullOrbit: false,
          orientationMode: 'sideways',
          pathType: 'orbit',
        },
        subjectLocalizations: [
          { captureId: 'capture-current', confidence: 0.94, pixelX: 320, pixelY: 240 },
          { captureId: 'capture-scout-1', confidence: 0.88, pixelX: 300, pixelY: 210 },
        ],
      })
    ).toThrow(/orientationMode/);
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
        model: 'gpt-4.1-mini',
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
  it('uses max_completion_tokens by default and falls back to max_tokens when required', async () => {
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
                message: 'Need one more nearby view.',
                requestedCaptures: [
                  {
                    captureId: 'capture-follow-up-1',
                    lateralOffsetScale: 0.1,
                    reason: 'Shift right for parallax.',
                    referenceCaptureId: 'capture-current',
                  },
                ],
                status: 'needs-captures',
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

    const response = await planner.generatePathPlan(createPathGenerationRequest());

    expect(response).toMatchObject({
      message: 'Need one more nearby view.',
      status: 'needs-captures',
    });
    expect(requestBodies).toHaveLength(2);
    expect(requestBodies[0]?.['max_completion_tokens']).toBe(1600);
    expect(requestBodies[0]?.['max_tokens']).toBeUndefined();
    expect(requestBodies[1]?.['max_tokens']).toBe(1600);
    expect(requestBodies[1]?.['max_completion_tokens']).toBeUndefined();
  });

  it('omits custom temperature and adds minimal reasoning effort for GPT-5 family models', async () => {
    const requestBodies: Array<Record<string, unknown>> = [];
    const fetchImpl = vi.fn(async (_input: unknown, init?: RequestInit) => {
      requestBodies.push(JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>);
      return new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                message: 'Need one more nearby view.',
                requestedCaptures: [
                  {
                    captureId: 'capture-follow-up-1',
                    lateralOffsetScale: 0.1,
                    reason: 'Shift right for parallax.',
                    referenceCaptureId: 'capture-current',
                  },
                ],
                status: 'needs-captures',
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

    const response = await planner.generatePathPlan(createPathGenerationRequest());

    expect(response).toMatchObject({
      message: 'Need one more nearby view.',
      status: 'needs-captures',
    });
    expect(requestBodies).toHaveLength(1);
    expect(requestBodies[0]?.['max_completion_tokens']).toBe(1600);
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
                      message: 'Need one more nearby view.',
                      requestedCaptures: [
                        {
                          captureId: 'capture-follow-up-1',
                          lateralOffsetScale: 0.1,
                          reason: 'Shift right for parallax.',
                          referenceCaptureId: 'capture-current',
                        },
                      ],
                      status: 'needs-captures',
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

    const response = await planner.generatePathPlan(createPathGenerationRequest());

    expect(response).toMatchObject({
      message: 'Need one more nearby view.',
      status: 'needs-captures',
    });
    expect(requestBodies).toHaveLength(2);
    expect(requestBodies[0]?.['reasoning_effort']).toBe('minimal');
    expect(requestBodies[1]?.['reasoning_effort']).toBeUndefined();
    expect(requestBodies[1]?.['temperature']).toBeUndefined();
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
                message: 'Need one more nearby view.',
                requestedCaptures: [
                  {
                    captureId: 'capture-follow-up-1',
                    lateralOffsetScale: 0.1,
                    reason: 'Shift right for parallax.',
                    referenceCaptureId: 'capture-current',
                  },
                ],
                status: 'needs-captures',
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

    const response = await planner.generatePathPlan(createPathGenerationRequest());

    expect(response).toMatchObject({
      message: 'Need one more nearby view.',
      status: 'needs-captures',
    });
    expect(requestBodies).toHaveLength(3);
    expect(requestBodies[0]?.['temperature']).toBe(0.2);
    expect(requestBodies[0]?.['response_format']).toEqual({ type: 'json_object' });
    expect(requestBodies[1]?.['temperature']).toBeUndefined();
    expect(requestBodies[1]?.['response_format']).toEqual({ type: 'json_object' });
    expect(requestBodies[2]?.['temperature']).toBeUndefined();
    expect(requestBodies[2]?.['response_format']).toBeUndefined();
  });
});
