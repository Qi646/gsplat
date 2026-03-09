import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { computeRobustSceneBounds } from '../lib/robustSceneBounds';

describe('computeRobustSceneBounds', () => {
  it('trims extreme outliers from sampled splat bounds', () => {
    const coreSamples = Array.from({ length: 198 }, (_, index) => ({
      center: new THREE.Vector3(index / 20, index % 4, -2 + (index % 6)),
      color: new THREE.Vector4(255, 255, 255, 255),
    }));
    const splatMesh = createMockSplatMesh([
      {
        center: new THREE.Vector3(-100, 0, 0),
        color: new THREE.Vector4(255, 255, 255, 255),
      },
      {
        center: new THREE.Vector3(100, 0, 0),
        color: new THREE.Vector4(255, 255, 255, 255),
      },
      ...coreSamples,
    ]);

    const box = computeRobustSceneBounds(splatMesh);

    expect(box).not.toBeNull();
    expect(box!.min.x).toBeGreaterThan(-10);
    expect(box!.max.x).toBeLessThan(20);
  });

  it('returns null when too few alpha-valid samples remain', () => {
    const splatMesh = createMockSplatMesh([
      {
        center: new THREE.Vector3(0, 0, 0),
        color: new THREE.Vector4(255, 255, 255, 4),
      },
    ]);

    expect(computeRobustSceneBounds(splatMesh, { minimumRetainedSamples: 1 })).toBeNull();
  });

  it('returns null when sampled centers are invalid', () => {
    const splatMesh = createMockSplatMesh([
      {
        center: new THREE.Vector3(Number.NaN, 0, 0),
        color: new THREE.Vector4(255, 255, 255, 255),
      },
      {
        center: new THREE.Vector3(Number.NaN, 1, 1),
        color: new THREE.Vector4(255, 255, 255, 255),
      },
    ]);

    expect(computeRobustSceneBounds(splatMesh, { minimumRetainedSamples: 1 })).toBeNull();
  });
});

function createMockSplatMesh(samples: Array<{ center: THREE.Vector3; color: THREE.Vector4 }>) {
  return {
    computeBoundingBox(): THREE.Box3 {
      return new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
    },
    getSplatCenter(globalIndex: number, outCenter: THREE.Vector3): void {
      outCenter.copy(samples[globalIndex]!.center);
    },
    getSplatColor(globalIndex: number, outColor: THREE.Vector4): void {
      outColor.copy(samples[globalIndex]!.color);
    },
    getSplatCount(): number {
      return samples.length;
    },
  };
}
