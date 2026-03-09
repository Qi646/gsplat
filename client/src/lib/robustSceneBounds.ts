import * as THREE from 'three';

export interface SceneBoundsSplatMesh {
  computeBoundingBox(applySceneTransforms?: boolean, sceneIndex?: number): THREE.Box3;
  getSplatCenter(globalIndex: number, outCenter: THREE.Vector3, applySceneTransform?: boolean): void;
  getSplatColor(globalIndex: number, outColor: THREE.Vector4): void;
  getSplatCount(): number;
}

export interface RobustSceneBoundsOptions {
  lowerQuantile: number;
  maxSamples: number;
  minimumAlpha: number;
  minimumRetainedSamples: number;
  upperQuantile: number;
}

export const DEFAULT_ROBUST_SCENE_BOUNDS_OPTIONS: RobustSceneBoundsOptions = {
  lowerQuantile: 0.01,
  maxSamples: 16_384,
  minimumAlpha: 5,
  minimumRetainedSamples: 64,
  upperQuantile: 0.99,
};

export function computeRobustSceneBounds(
  splatMesh: SceneBoundsSplatMesh,
  options: Partial<RobustSceneBoundsOptions> = {},
): THREE.Box3 | null {
  const resolvedOptions = {
    ...DEFAULT_ROBUST_SCENE_BOUNDS_OPTIONS,
    ...options,
  };
  const splatCount = splatMesh.getSplatCount();
  if (splatCount <= 0) {
    return null;
  }

  const sampleCount = Math.min(splatCount, resolvedOptions.maxSamples);
  const center = new THREE.Vector3();
  const color = new THREE.Vector4();
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const splatIndex =
      sampleCount === 1 ? 0 : Math.floor((sampleIndex * (splatCount - 1)) / (sampleCount - 1));

    splatMesh.getSplatColor(splatIndex, color);
    if (!Number.isFinite(color.w) || color.w < resolvedOptions.minimumAlpha) {
      continue;
    }

    splatMesh.getSplatCenter(splatIndex, center, true);
    if (![center.x, center.y, center.z].every(Number.isFinite)) {
      continue;
    }

    xs.push(center.x);
    ys.push(center.y);
    zs.push(center.z);
  }

  if (xs.length < resolvedOptions.minimumRetainedSamples) {
    return null;
  }

  xs.sort((left, right) => left - right);
  ys.sort((left, right) => left - right);
  zs.sort((left, right) => left - right);

  const box = new THREE.Box3(
    new THREE.Vector3(
      interpolateQuantile(xs, resolvedOptions.lowerQuantile),
      interpolateQuantile(ys, resolvedOptions.lowerQuantile),
      interpolateQuantile(zs, resolvedOptions.lowerQuantile),
    ),
    new THREE.Vector3(
      interpolateQuantile(xs, resolvedOptions.upperQuantile),
      interpolateQuantile(ys, resolvedOptions.upperQuantile),
      interpolateQuantile(zs, resolvedOptions.upperQuantile),
    ),
  );

  if (!isFiniteBox(box) || box.isEmpty()) {
    return null;
  }

  return box;
}

function interpolateQuantile(sortedValues: number[], quantile: number): number {
  const clampedQuantile = THREE.MathUtils.clamp(quantile, 0, 1);
  const index = (sortedValues.length - 1) * clampedQuantile;
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const lowerValue = sortedValues[lowerIndex] ?? sortedValues[sortedValues.length - 1] ?? 0;
  const upperValue = sortedValues[upperIndex] ?? lowerValue;

  return THREE.MathUtils.lerp(lowerValue, upperValue, index - lowerIndex);
}

function isFiniteBox(box: THREE.Box3): boolean {
  return [box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite);
}
