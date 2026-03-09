import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PlyParser } from '@mkkellogg/gaussian-splats-3d';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, '../../public/test-assets/smoke-grid.ply');

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

describe('smoke-grid fixture', () => {
  it('is present and parses into splats with valid bounds', () => {
    const fixtureBuffer = fs.readFileSync(fixturePath);
    const parsed = PlyParser.parseToUncompressedSplatArray(toArrayBuffer(fixtureBuffer));

    expect(parsed.splatCount).toBe(27);

    const positions = parsed.splats.map((splat: number[]) => splat.slice(0, 3));
    const xs = positions.map((position: number[]) => position[0]);
    const ys = positions.map((position: number[]) => position[1]);
    const zs = positions.map((position: number[]) => position[2]);

    expect(Math.min(...xs)).toBeCloseTo(-0.9, 5);
    expect(Math.max(...xs)).toBeCloseTo(0.9, 5);
    expect(Math.min(...ys)).toBeCloseTo(-0.9, 5);
    expect(Math.max(...ys)).toBeCloseTo(0.9, 5);
    expect(Math.min(...zs)).toBeCloseTo(-0.6, 5);
    expect(Math.max(...zs)).toBeCloseTo(0.6, 5);
  });
});
