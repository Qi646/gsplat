import * as THREE from 'three';

export interface SceneBoundsSplatMesh {
  computeBoundingBox(applySceneTransforms?: boolean, sceneIndex?: number): THREE.Box3;
  getSplatCenter(globalIndex: number, outCenter: THREE.Vector3, applySceneTransform?: boolean): void;
  getSplatColor(globalIndex: number, outColor: THREE.Vector4): void;
  getSplatCount(): number;
}

export interface RobustSceneBoundsOptions {
  framingTighteningRadiusRatio: number;
  framingUpperQuantile: number;
  framingLowerQuantile: number;
  lowerQuantile: number;
  maxSamples: number;
  minimumAlpha: number;
  minimumRetainedSamples: number;
  upperQuantile: number;
}

export const DEFAULT_ROBUST_SCENE_BOUNDS_OPTIONS: RobustSceneBoundsOptions = {
  framingTighteningRadiusRatio: 1.4,
  framingUpperQuantile: 0.95,
  framingLowerQuantile: 0.05,
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

  return computeFramedSceneBoundsFromSortedSamples(xs, ys, zs, resolvedOptions);
}

export function computeFramedSceneBoundsFromSortedSamples(
  xs: number[],
  ys: number[],
  zs: number[],
  options: Partial<RobustSceneBoundsOptions> = {},
): THREE.Box3 | null {
  const resolvedOptions = {
    ...DEFAULT_ROBUST_SCENE_BOUNDS_OPTIONS,
    ...options,
  };

  if (xs.length < resolvedOptions.minimumRetainedSamples || ys.length < resolvedOptions.minimumRetainedSamples || zs.length < resolvedOptions.minimumRetainedSamples) {
    return null;
  }

  const wideBox = createQuantileBox(
    xs,
    ys,
    zs,
    resolvedOptions.lowerQuantile,
    resolvedOptions.upperQuantile,
  );
  if (!isFiniteBox(wideBox) || wideBox.isEmpty()) {
    return null;
  }

  const tightBox = createQuantileBox(
    xs,
    ys,
    zs,
    resolvedOptions.framingLowerQuantile,
    resolvedOptions.framingUpperQuantile,
  );

  if (!isFiniteBox(tightBox) || tightBox.isEmpty()) {
    return wideBox;
  }

  const wideRadius = wideBox.getBoundingSphere(new THREE.Sphere()).radius;
  const tightRadius = tightBox.getBoundingSphere(new THREE.Sphere()).radius;
  if (
    tightRadius > 0 &&
    wideRadius / tightRadius > resolvedOptions.framingTighteningRadiusRatio
  ) {
    return tightBox;
  }

  return wideBox;
}

function createQuantileBox(
  xs: number[],
  ys: number[],
  zs: number[],
  lowerQuantile: number,
  upperQuantile: number,
): THREE.Box3 {
  return new THREE.Box3(
    new THREE.Vector3(
      interpolateQuantile(xs, lowerQuantile),
      interpolateQuantile(ys, lowerQuantile),
      interpolateQuantile(zs, lowerQuantile),
    ),
    new THREE.Vector3(
      interpolateQuantile(xs, upperQuantile),
      interpolateQuantile(ys, upperQuantile),
      interpolateQuantile(zs, upperQuantile),
    ),
  );
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
