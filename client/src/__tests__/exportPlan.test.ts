import { describe, expect, it } from 'vitest';
import { buildCameraPath } from '../path/cameraPath';
import {
  buildExportPlanDocument,
  buildExportPlanSummary,
  buildExportSettingsList,
  parseImportedExportDocument,
  resolveExportPlanSettings,
} from '../export/exportPlan';

describe('exportPlan', () => {
  it('builds deterministic export targets from a saved profile and file base name', () => {
    const targets = buildExportSettingsList({
      fileBaseName: 'cinematic-pass',
      fps: 24,
      profileId: 'batch-720p-1080p',
    });

    expect(targets).toEqual([
      { fileName: 'cinematic-pass-720p.mp4', fps: 24, height: 720, width: 1280 },
      { fileName: 'cinematic-pass-1080p.mp4', fps: 24, height: 1080, width: 1920 },
    ]);
  });

  it('round-trips an export plan document with path and render settings', () => {
    const cameraPath = buildCameraPath([
      {
        fov: 55,
        id: 'kf-1',
        position: { x: 0, y: 1, z: 2 },
        quaternion: { w: 1, x: 0, y: 0, z: 0 },
        time: 0,
      },
      {
        fov: 60,
        id: 'kf-2',
        position: { x: 3, y: 4, z: 5 },
        quaternion: { w: 0.9682458366, x: 0, y: 0.25, z: 0 },
        time: 1.25,
      },
    ], '2026-03-10T12:00:00.000Z');

    const document = buildExportPlanDocument(cameraPath, {
      fileBaseName: 'hero-shot',
      fps: 30,
      profileId: 'single-1080p',
    }, '2026-03-10T12:05:00.000Z');

    const imported = parseImportedExportDocument(document);

    expect(imported.exportSettings).toEqual({
      fileBaseName: 'hero-shot',
      fps: 30,
      profileId: 'single-1080p',
    });
    expect(imported.cameraPath.createdAt).toBe(cameraPath.createdAt);
    expect(imported.cameraPath.totalDuration).toBe(cameraPath.totalDuration);
    expect(imported.cameraPath.keyframes.map(keyframe => keyframe.id)).toEqual(
      cameraPath.keyframes.map(keyframe => keyframe.id),
    );
  });

  it('still accepts legacy path-only JSON files', () => {
    const legacyPath = buildCameraPath([
      {
        fov: 50,
        id: 'kf-1',
        position: { x: 1, y: 2, z: 3 },
        quaternion: { w: 1, x: 0, y: 0, z: 0 },
        time: 0,
      },
      {
        fov: 60,
        id: 'kf-2',
        position: { x: 4, y: 5, z: 6 },
        quaternion: { w: 1, x: 0, y: 0, z: 0 },
        time: 3,
      },
    ]);

    expect(parseImportedExportDocument(legacyPath)).toEqual({
      cameraPath: legacyPath,
      exportSettings: null,
    });
  });

  it('rejects invalid export plan settings', () => {
    expect(() =>
      resolveExportPlanSettings({
        fileBaseName: '  ',
      }),
    ).toThrow('Export file base name must not be empty.');
  });

  it('summarizes the active export plan settings for the UI note', () => {
    expect(buildExportPlanSummary({ fps: 30, profileId: 'single-720p' })).toBe(
      '720p · 30 FPS via FFmpeg',
    );
    expect(buildExportPlanSummary({ fps: 24, profileId: 'batch-720p-1080p' })).toBe(
      '720p + 1080p Batch · 24 FPS via FFmpeg',
    );
  });
});
