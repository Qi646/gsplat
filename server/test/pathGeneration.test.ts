import { describe, expect, it } from 'vitest';
import {
  OpenAIVisionPathPlanner,
  parseModelPathPlan,
  parsePathGenerationRequest,
} from '../src/pathGeneration.js';

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
