import * as THREE from 'three';
import type { Keyframe } from '../types';
import { PathInterpolator } from './PathInterpolator';

export interface OverlayViewport {
  width: number;
  height: number;
}

export interface OverlayScreenPoint {
  x: number;
  y: number;
}

export interface OverlayPathSegment {
  points: OverlayScreenPoint[];
}

export interface OverlayFrustumProjection {
  corners: [OverlayScreenPoint, OverlayScreenPoint, OverlayScreenPoint, OverlayScreenPoint];
  origin: OverlayScreenPoint;
}

export interface OverlayKeyframeProjection {
  frustum: OverlayFrustumProjection | null;
  id: string;
  index: number;
  label: string;
  selected: boolean;
  screenPoint: OverlayScreenPoint;
}

const DEFAULT_PATH_SAMPLES_PER_SEGMENT = 24;
const DEFAULT_VIEWPORT_PADDING_PX = 48;
const DEFAULT_MAX_FRUSTUM_SCREEN_RADIUS_PX = 24;
const FRUSTUM_NEIGHBOR_SCREEN_RADIUS_FACTOR = 0.35;

interface VisibleOverlayKeyframe {
  index: number;
  keyframe: Keyframe;
  screenPoint: OverlayScreenPoint;
}

function keyframeToVector3(keyframe: Keyframe): THREE.Vector3 {
  return new THREE.Vector3(keyframe.position.x, keyframe.position.y, keyframe.position.z);
}

function keyframeToQuaternion(keyframe: Keyframe): THREE.Quaternion {
  return new THREE.Quaternion(
    keyframe.quaternion.x,
    keyframe.quaternion.y,
    keyframe.quaternion.z,
    keyframe.quaternion.w,
  );
}

function isFiniteVector3(vector: THREE.Vector3): boolean {
  return [vector.x, vector.y, vector.z].every(Number.isFinite);
}

function isFiniteViewport(viewport: OverlayViewport): boolean {
  return viewport.width > 0 && viewport.height > 0 && [viewport.width, viewport.height].every(Number.isFinite);
}

function isFiniteBox(box: THREE.Box3): boolean {
  return [box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite);
}

function getScreenDistance(left: OverlayScreenPoint, right: OverlayScreenPoint): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function buildPathBounds(keyframes: Keyframe[]): THREE.Box3 | null {
  if (keyframes.length === 0) {
    return null;
  }

  const box = new THREE.Box3();
  keyframes.forEach(keyframe => {
    box.expandByPoint(keyframeToVector3(keyframe));
  });

  if (box.isEmpty() || !isFiniteBox(box)) {
    return null;
  }

  return box;
}

function getReferenceRadius(sceneBounds: THREE.Box3 | null, keyframes: Keyframe[]): number | null {
  const sphere = new THREE.Sphere();

  if (sceneBounds && !sceneBounds.isEmpty() && isFiniteBox(sceneBounds)) {
    sceneBounds.getBoundingSphere(sphere);
    if (Number.isFinite(sphere.radius) && sphere.radius > 0) {
      return sphere.radius;
    }
  }

  const pathBounds = buildPathBounds(keyframes);
  if (!pathBounds) {
    return null;
  }

  pathBounds.getBoundingSphere(sphere);
  if (Number.isFinite(sphere.radius) && sphere.radius > 0) {
    return sphere.radius;
  }

  return null;
}

export function getOverlayFrustumDepth(sceneBounds: THREE.Box3 | null, keyframes: Keyframe[]): number {
  const radius = getReferenceRadius(sceneBounds, keyframes);
  if (radius === null) {
    return 1;
  }

  return Math.max(radius * 0.12, 0.35);
}

export function sampleCameraPathPositions(
  keyframes: Keyframe[],
  samplesPerSegment = DEFAULT_PATH_SAMPLES_PER_SEGMENT,
): THREE.Vector3[] {
  if (keyframes.length === 0) {
    return [];
  }

  if (keyframes.length === 1) {
    return [keyframeToVector3(keyframes[0])];
  }

  const interpolator = new PathInterpolator();
  interpolator.setKeyframes(keyframes);
  const duration = interpolator.getTotalDuration();
  const totalSamples = Math.max((keyframes.length - 1) * samplesPerSegment, 1) + 1;
  const samples: THREE.Vector3[] = [];

  for (let index = 0; index < totalSamples; index += 1) {
    const time = duration * (index / (totalSamples - 1));
    const pose = interpolator.evaluate(time);
    if (pose && isFiniteVector3(pose.position)) {
      samples.push(pose.position);
    }
  }

  return samples;
}

export function projectWorldPointToViewport(
  point: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  viewport: OverlayViewport,
  paddingPx = DEFAULT_VIEWPORT_PADDING_PX,
): OverlayScreenPoint | null {
  if (!isFiniteViewport(viewport) || !isFiniteVector3(point)) {
    return null;
  }

  camera.updateMatrixWorld(true);

  const cameraSpacePoint = point.clone().applyMatrix4(camera.matrixWorldInverse);
  if (!Number.isFinite(cameraSpacePoint.z) || cameraSpacePoint.z >= -camera.near) {
    return null;
  }

  const projected = point.clone().project(camera);
  if (![projected.x, projected.y, projected.z].every(Number.isFinite)) {
    return null;
  }

  if (projected.z < -1 || projected.z > 1) {
    return null;
  }

  const screenPoint = {
    x: ((projected.x + 1) / 2) * viewport.width,
    y: ((1 - projected.y) / 2) * viewport.height,
  };

  if (
    screenPoint.x < -paddingPx ||
    screenPoint.x > viewport.width + paddingPx ||
    screenPoint.y < -paddingPx ||
    screenPoint.y > viewport.height + paddingPx
  ) {
    return null;
  }

  return screenPoint;
}

export function projectPathToViewport(
  pathPoints: THREE.Vector3[],
  camera: THREE.PerspectiveCamera,
  viewport: OverlayViewport,
  paddingPx = DEFAULT_VIEWPORT_PADDING_PX,
): OverlayPathSegment[] {
  const segments: OverlayPathSegment[] = [];
  let currentSegment: OverlayScreenPoint[] = [];

  for (const point of pathPoints) {
    const projectedPoint = projectWorldPointToViewport(point, camera, viewport, paddingPx);
    if (!projectedPoint) {
      if (currentSegment.length >= 2) {
        segments.push({ points: currentSegment });
      }
      currentSegment = [];
      continue;
    }

    currentSegment.push(projectedPoint);
  }

  if (currentSegment.length >= 2) {
    segments.push({ points: currentSegment });
  }

  return segments;
}

function getCameraDepthForPoint(point: THREE.Vector3, camera: THREE.PerspectiveCamera): number | null {
  camera.updateMatrixWorld(true);

  const cameraSpacePoint = point.clone().applyMatrix4(camera.matrixWorldInverse);
  const cameraDepth = -cameraSpacePoint.z;
  if (!Number.isFinite(cameraDepth) || cameraDepth <= camera.near) {
    return null;
  }

  return cameraDepth;
}

function getFrustumScreenRadius(frustum: OverlayFrustumProjection): number {
  return Math.max(
    ...frustum.corners.map(corner => getScreenDistance(frustum.origin, corner)),
  );
}

function clampFrustumToScreenRadius(
  frustum: OverlayFrustumProjection,
  maxRadiusPx: number,
): OverlayFrustumProjection {
  if (!(maxRadiusPx > 0)) {
    return frustum;
  }

  const currentRadius = getFrustumScreenRadius(frustum);
  if (!Number.isFinite(currentRadius) || currentRadius <= maxRadiusPx || currentRadius <= 0) {
    return frustum;
  }

  const scale = maxRadiusPx / currentRadius;
  const corners = frustum.corners.map(corner => ({
    x: frustum.origin.x + (corner.x - frustum.origin.x) * scale,
    y: frustum.origin.y + (corner.y - frustum.origin.y) * scale,
  })) as [
    OverlayScreenPoint,
    OverlayScreenPoint,
    OverlayScreenPoint,
    OverlayScreenPoint,
  ];

  return {
    origin: frustum.origin,
    corners,
  };
}

function getMaxFrustumScreenRadiusPx(
  visibleKeyframe: VisibleOverlayKeyframe,
  visibleKeyframes: VisibleOverlayKeyframe[],
): number {
  let nearestMarkerDistance = Number.POSITIVE_INFINITY;

  visibleKeyframes.forEach(candidate => {
    if (candidate.index === visibleKeyframe.index) {
      return;
    }

    nearestMarkerDistance = Math.min(
      nearestMarkerDistance,
      getScreenDistance(visibleKeyframe.screenPoint, candidate.screenPoint),
    );
  });

  if (!Number.isFinite(nearestMarkerDistance)) {
    return DEFAULT_MAX_FRUSTUM_SCREEN_RADIUS_PX;
  }

  return Math.max(
    0,
    Math.min(
      DEFAULT_MAX_FRUSTUM_SCREEN_RADIUS_PX,
      nearestMarkerDistance * FRUSTUM_NEIGHBOR_SCREEN_RADIUS_FACTOR,
    ),
  );
}

function getFrustumDepthForScreenRadius(
  keyframe: Keyframe,
  camera: THREE.PerspectiveCamera,
  viewport: OverlayViewport,
  maxScreenRadiusPx: number,
): number | null {
  if (!isFiniteViewport(viewport) || !(maxScreenRadiusPx > 0)) {
    return null;
  }

  const cameraDepth = getCameraDepthForPoint(keyframeToVector3(keyframe), camera);
  if (cameraDepth === null) {
    return null;
  }

  const viewHalfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * cameraDepth;
  const maxWorldHalfHeight = (Math.min(maxScreenRadiusPx, viewport.height / 2) / (viewport.height / 2)) * viewHalfHeight;
  const keyframeHalfHeightFactor = Math.tan(THREE.MathUtils.degToRad(keyframe.fov) / 2);
  if (!Number.isFinite(keyframeHalfHeightFactor) || keyframeHalfHeightFactor <= 0) {
    return null;
  }

  const frustumDepth = maxWorldHalfHeight / keyframeHalfHeightFactor;
  if (!Number.isFinite(frustumDepth) || frustumDepth <= 0) {
    return null;
  }

  return frustumDepth;
}

export function buildKeyframeFrustumWorldPoints(
  keyframe: Keyframe,
  aspect: number,
  depth: number,
): {
  corners: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3];
  origin: THREE.Vector3;
} {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const safeDepth = Number.isFinite(depth) && depth > 0 ? depth : 1;
  const origin = keyframeToVector3(keyframe);
  const quaternion = keyframeToQuaternion(keyframe);
  const halfHeight = Math.tan(THREE.MathUtils.degToRad(keyframe.fov) / 2) * safeDepth;
  const halfWidth = halfHeight * safeAspect;

  const localCorners = [
    new THREE.Vector3(-halfWidth, halfHeight, -safeDepth),
    new THREE.Vector3(halfWidth, halfHeight, -safeDepth),
    new THREE.Vector3(halfWidth, -halfHeight, -safeDepth),
    new THREE.Vector3(-halfWidth, -halfHeight, -safeDepth),
  ] as const;

  const corners = localCorners.map(corner => corner.applyQuaternion(quaternion).add(origin.clone())) as [
    THREE.Vector3,
    THREE.Vector3,
    THREE.Vector3,
    THREE.Vector3,
  ];

  return {
    corners,
    origin,
  };
}

export function projectKeyframeVisuals(
  keyframes: Keyframe[],
  camera: THREE.PerspectiveCamera,
  viewport: OverlayViewport,
  sceneBounds: THREE.Box3 | null,
  selectedKeyframeId: string | null,
  paddingPx = DEFAULT_VIEWPORT_PADDING_PX,
): OverlayKeyframeProjection[] {
  const aspect = viewport.width / Math.max(viewport.height, 1);
  const baseFrustumDepth = getOverlayFrustumDepth(sceneBounds, keyframes);
  const visibleKeyframes = keyframes.flatMap<VisibleOverlayKeyframe>((keyframe, index) => {
    const screenPoint = projectWorldPointToViewport(
      keyframeToVector3(keyframe),
      camera,
      viewport,
      paddingPx,
    );

    if (!screenPoint) {
      return [];
    }

    return [{
      index,
      keyframe,
      screenPoint,
    }];
  });

  return visibleKeyframes.map(({ index, keyframe, screenPoint }) => {
    const maxScreenRadiusPx = getMaxFrustumScreenRadiusPx(
      { index, keyframe, screenPoint },
      visibleKeyframes,
    );
    const cappedFrustumDepth = getFrustumDepthForScreenRadius(
      keyframe,
      camera,
      viewport,
      maxScreenRadiusPx,
    );
    const frustumDepth = cappedFrustumDepth === null
      ? baseFrustumDepth
      : Math.min(baseFrustumDepth, cappedFrustumDepth);
    const frustumWorld = buildKeyframeFrustumWorldPoints(keyframe, aspect, frustumDepth);
    const projectedOrigin = projectWorldPointToViewport(frustumWorld.origin, camera, viewport, paddingPx);
    const projectedCorners = frustumWorld.corners.map(corner => (
      projectWorldPointToViewport(corner, camera, viewport, paddingPx)
    ));

    const frustum = projectedOrigin && projectedCorners.every(Boolean)
      ? clampFrustumToScreenRadius({
          origin: projectedOrigin,
          corners: projectedCorners as [
            OverlayScreenPoint,
            OverlayScreenPoint,
            OverlayScreenPoint,
            OverlayScreenPoint,
          ],
        }, maxScreenRadiusPx)
      : null;

    return {
      frustum,
      id: keyframe.id,
      index,
      label: `KF ${String(index + 1).padStart(2, '0')}`,
      screenPoint,
      selected: keyframe.id === selectedKeyframeId,
    };
  });
}
