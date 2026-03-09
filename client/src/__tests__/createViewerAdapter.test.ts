import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockSceneViewer, mockSparkSceneViewer } = vi.hoisted(() => ({
  mockSceneViewer: vi.fn(),
  mockSparkSceneViewer: vi.fn(),
}));

vi.mock('../viewer/SceneViewer', () => ({
  SceneViewer: mockSceneViewer,
}));

vi.mock('../viewer/SparkSceneViewer', () => ({
  SparkSceneViewer: mockSparkSceneViewer,
}));

import { createViewerAdapter } from '../viewer/createViewerAdapter';

describe('createViewerAdapter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates the default mkkellogg adapter', () => {
    const options = { hostElement: {} as HTMLElement, events: {} as never };

    createViewerAdapter('mkkellogg', options);

    expect(mockSceneViewer).toHaveBeenCalledWith(options);
    expect(mockSparkSceneViewer).not.toHaveBeenCalled();
  });

  it('creates the Spark adapter when requested', () => {
    const options = { hostElement: {} as HTMLElement, events: {} as never };

    createViewerAdapter('spark', options);

    expect(mockSparkSceneViewer).toHaveBeenCalledWith(options);
  });
});
