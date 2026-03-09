import * as THREE from 'three';
import type { Keyframe } from '../types';
import {
  projectKeyframeVisuals,
  projectPathToViewport,
  sampleCameraPathPositions,
  type OverlayFrustumProjection,
  type OverlayKeyframeProjection,
  type OverlayPathSegment,
  type OverlayViewport,
} from './cameraPathVisuals';

const SVG_NS = 'http://www.w3.org/2000/svg';

function cloneKeyframe(keyframe: Keyframe): Keyframe {
  return {
    id: keyframe.id,
    time: keyframe.time,
    position: { ...keyframe.position },
    quaternion: { ...keyframe.quaternion },
    fov: keyframe.fov,
  };
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tagName);
}

function setHidden(element: SVGElement, hidden: boolean): void {
  element.style.display = hidden ? 'none' : 'block';
}

function buildPolylinePath(points: OverlayPathSegment['points']): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
}

function buildFrustumPath(frustum: OverlayFrustumProjection): string {
  const [topLeft, topRight, bottomRight, bottomLeft] = frustum.corners;
  return [
    `M ${frustum.origin.x.toFixed(2)} ${frustum.origin.y.toFixed(2)} L ${topLeft.x.toFixed(2)} ${topLeft.y.toFixed(2)}`,
    `M ${frustum.origin.x.toFixed(2)} ${frustum.origin.y.toFixed(2)} L ${topRight.x.toFixed(2)} ${topRight.y.toFixed(2)}`,
    `M ${frustum.origin.x.toFixed(2)} ${frustum.origin.y.toFixed(2)} L ${bottomRight.x.toFixed(2)} ${bottomRight.y.toFixed(2)}`,
    `M ${frustum.origin.x.toFixed(2)} ${frustum.origin.y.toFixed(2)} L ${bottomLeft.x.toFixed(2)} ${bottomLeft.y.toFixed(2)}`,
    `M ${topLeft.x.toFixed(2)} ${topLeft.y.toFixed(2)} L ${topRight.x.toFixed(2)} ${topRight.y.toFixed(2)} L ${bottomRight.x.toFixed(2)} ${bottomRight.y.toFixed(2)} L ${bottomLeft.x.toFixed(2)} ${bottomLeft.y.toFixed(2)} Z`,
  ].join(' ');
}

export class CameraPathOverlay {
  private readonly root: SVGSVGElement;
  private readonly pathGroup: SVGGElement;
  private readonly frustumGroup: SVGGElement;
  private readonly markerGroup: SVGGElement;
  private enabled = true;
  private keyframes: Keyframe[] = [];
  private sceneBounds: THREE.Box3 | null = null;
  private selectedKeyframeId: string | null = null;
  private viewport: OverlayViewport = { width: 0, height: 0 };

  constructor(root: SVGSVGElement) {
    this.root = root;
    this.root.setAttribute('aria-hidden', 'true');
    this.root.setAttribute('preserveAspectRatio', 'none');

    this.pathGroup = createSvgElement('g');
    this.pathGroup.setAttribute('class', 'camera-path-group');
    this.frustumGroup = createSvgElement('g');
    this.frustumGroup.setAttribute('class', 'camera-frustum-group');
    this.markerGroup = createSvgElement('g');
    this.markerGroup.setAttribute('class', 'camera-marker-group');
    this.root.replaceChildren(this.pathGroup, this.frustumGroup, this.markerGroup);
    this.clear();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    setHidden(this.root, !enabled);
    if (!enabled) {
      this.clear();
    }
  }

  setViewportSize(width: number, height: number): void {
    this.viewport = {
      width: Math.max(width, 0),
      height: Math.max(height, 0),
    };

    this.root.setAttribute('viewBox', `0 0 ${Math.max(this.viewport.width, 1)} ${Math.max(this.viewport.height, 1)}`);
  }

  setSceneBounds(sceneBounds: THREE.Box3 | null): void {
    this.sceneBounds = sceneBounds?.clone() ?? null;
  }

  setKeyframes(keyframes: Keyframe[]): void {
    this.keyframes = keyframes.map(cloneKeyframe);
  }

  setSelectedKeyframeId(selectedKeyframeId: string | null): void {
    this.selectedKeyframeId = selectedKeyframeId;
  }

  render(camera: THREE.PerspectiveCamera | null): void {
    if (!this.enabled || !camera || this.viewport.width <= 0 || this.viewport.height <= 0 || this.keyframes.length === 0) {
      this.clear();
      return;
    }

    const pathSegments = this.keyframes.length >= 2
      ? projectPathToViewport(sampleCameraPathPositions(this.keyframes), camera, this.viewport)
      : [];
    const projectedKeyframes = projectKeyframeVisuals(
      this.keyframes,
      camera,
      this.viewport,
      this.sceneBounds,
      this.selectedKeyframeId,
    );

    this.renderPathSegments(pathSegments);
    this.renderFrusta(projectedKeyframes);
    this.renderMarkers(projectedKeyframes);
  }

  clear(): void {
    this.pathGroup.replaceChildren();
    this.frustumGroup.replaceChildren();
    this.markerGroup.replaceChildren();
  }

  dispose(): void {
    this.clear();
    this.root.replaceChildren();
  }

  private renderPathSegments(pathSegments: OverlayPathSegment[]): void {
    const elements = pathSegments.map(segment => {
      const path = createSvgElement('path');
      path.setAttribute('class', 'camera-path-segment');
      path.setAttribute('d', buildPolylinePath(segment.points));
      return path;
    });

    this.pathGroup.replaceChildren(...elements);
  }

  private renderFrusta(projectedKeyframes: OverlayKeyframeProjection[]): void {
    const elements = projectedKeyframes.flatMap(projectedKeyframe => {
      if (!projectedKeyframe.frustum) {
        return [];
      }

      const path = createSvgElement('path');
      path.setAttribute(
        'class',
        projectedKeyframe.selected ? 'camera-frustum selected' : 'camera-frustum',
      );
      path.setAttribute('d', buildFrustumPath(projectedKeyframe.frustum));
      return [path];
    });

    this.frustumGroup.replaceChildren(...elements);
  }

  private renderMarkers(projectedKeyframes: OverlayKeyframeProjection[]): void {
    const elements = projectedKeyframes.map(projectedKeyframe => {
      const group = createSvgElement('g');
      group.setAttribute(
        'class',
        projectedKeyframe.selected ? 'camera-keyframe selected' : 'camera-keyframe',
      );

      const marker = createSvgElement('circle');
      marker.setAttribute('class', projectedKeyframe.selected ? 'camera-marker selected' : 'camera-marker');
      marker.setAttribute('cx', projectedKeyframe.screenPoint.x.toFixed(2));
      marker.setAttribute('cy', projectedKeyframe.screenPoint.y.toFixed(2));
      marker.setAttribute('r', projectedKeyframe.selected ? '5' : '4');

      const label = createSvgElement('text');
      label.setAttribute('class', projectedKeyframe.selected ? 'camera-label selected' : 'camera-label');
      label.setAttribute('x', (projectedKeyframe.screenPoint.x + 9).toFixed(2));
      label.setAttribute('y', (projectedKeyframe.screenPoint.y - 9).toFixed(2));
      label.textContent = projectedKeyframe.label;

      group.append(marker, label);
      return group;
    });

    this.markerGroup.replaceChildren(...elements);
  }
}
