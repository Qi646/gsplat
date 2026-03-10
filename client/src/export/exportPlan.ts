import type { CameraPath } from '../types';
import { parseCameraPath } from '../path/cameraPath';
import {
  DEFAULT_EXPORT_SETTINGS,
  resolveExportSettings,
  type ExportSettings,
} from './ExportManager';

type UnknownRecord = Record<string, unknown>;

export type ExportProfileId = 'single-720p' | 'single-1080p' | 'batch-720p-1080p';

export interface ExportProfileDefinition {
  description: string;
  id: ExportProfileId;
  label: string;
  targets: Array<{
    height: number;
    suffix: string | null;
    width: number;
  }>;
}

export interface ExportPlanSettings {
  fileBaseName: string;
  fps: number;
  profileId: ExportProfileId;
}

export interface ExportPlanDocument {
  cameraPath: CameraPath;
  createdAt: string;
  exportSettings: ExportPlanSettings;
  type: 'gsplat-export-plan';
  version: 1;
}

export interface ImportedExportDocument {
  cameraPath: CameraPath;
  exportSettings: ExportPlanSettings | null;
}

export const EXPORT_PROFILES: ExportProfileDefinition[] = [
  {
    description: 'Single MP4 at 1280x720.',
    id: 'single-720p',
    label: '720p',
    targets: [
      { height: 720, suffix: null, width: 1280 },
    ],
  },
  {
    description: 'Single MP4 at 1920x1080.',
    id: 'single-1080p',
    label: '1080p',
    targets: [
      { height: 1080, suffix: null, width: 1920 },
    ],
  },
  {
    description: 'Two MP4s at 1280x720 and 1920x1080.',
    id: 'batch-720p-1080p',
    label: '720p + 1080p Batch',
    targets: [
      { height: 720, suffix: '720p', width: 1280 },
      { height: 1080, suffix: '1080p', width: 1920 },
    ],
  },
];

export const DEFAULT_EXPORT_PLAN_SETTINGS: ExportPlanSettings = {
  fileBaseName: stripMp4Extension(DEFAULT_EXPORT_SETTINGS.fileName),
  fps: DEFAULT_EXPORT_SETTINGS.fps,
  profileId: 'single-720p',
};

export function resolveExportPlanSettings(
  overrides: Partial<ExportPlanSettings> | undefined,
): ExportPlanSettings {
  const profileId = resolveExportProfileId(overrides?.profileId);
  const fps = Math.floor(overrides?.fps ?? DEFAULT_EXPORT_PLAN_SETTINGS.fps);
  const fileBaseName = normalizeExportFileBaseName(overrides?.fileBaseName);

  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error('Export FPS must be a positive integer.');
  }

  return {
    fileBaseName,
    fps,
    profileId,
  };
}

export function buildExportSettingsList(
  overrides: Partial<ExportPlanSettings> | undefined,
): ExportSettings[] {
  const planSettings = resolveExportPlanSettings(overrides);
  const profile = getExportProfile(planSettings.profileId);

  return profile.targets.map(target =>
    resolveExportSettings({
      fileName: buildExportFileName(planSettings.fileBaseName, target.suffix),
      fps: planSettings.fps,
      height: target.height,
      width: target.width,
    }),
  );
}

export function buildExportPlanDocument(
  cameraPath: CameraPath,
  exportSettings: Partial<ExportPlanSettings> | undefined,
  createdAt = new Date().toISOString(),
): ExportPlanDocument {
  return {
    cameraPath,
    createdAt,
    exportSettings: resolveExportPlanSettings(exportSettings),
    type: 'gsplat-export-plan',
    version: 1,
  };
}

export function parseImportedExportDocument(input: unknown): ImportedExportDocument {
  if (isRecord(input) && input['type'] === 'gsplat-export-plan') {
    return parseExportPlanDocument(input);
  }

  return {
    cameraPath: parseCameraPath(input),
    exportSettings: null,
  };
}

export function buildExportPlanSummary(
  overrides: Partial<ExportPlanSettings> | undefined,
): string {
  const settings = resolveExportPlanSettings(overrides);
  const profile = getExportProfile(settings.profileId);
  return `${profile.label} · ${settings.fps} FPS via FFmpeg`;
}

export function getExportProfile(profileId: ExportProfileId): ExportProfileDefinition {
  const profile = EXPORT_PROFILES.find(candidate => candidate.id === profileId);
  if (!profile) {
    throw new Error(`Unknown export profile: ${profileId}`);
  }
  return profile;
}

function parseExportPlanDocument(input: UnknownRecord): ImportedExportDocument {
  const version = input['version'];
  if (version !== 1) {
    throw new Error('Invalid export plan file: unsupported version.');
  }

  return {
    cameraPath: parseCameraPath(input['cameraPath']),
    exportSettings: parseExportPlanSettings(input['exportSettings']),
  };
}

function parseExportPlanSettings(input: unknown): ExportPlanSettings {
  if (!isRecord(input)) {
    throw new Error('Invalid export plan file: exportSettings must be an object.');
  }

  return resolveExportPlanSettings({
    fileBaseName: readString(input, 'fileBaseName', 'exportSettings'),
    fps: readNumber(input, 'fps', 'exportSettings'),
    profileId: resolveExportProfileId(readString(input, 'profileId', 'exportSettings')),
  });
}

function resolveExportProfileId(value: unknown): ExportProfileId {
  if (value === undefined) {
    return DEFAULT_EXPORT_PLAN_SETTINGS.profileId;
  }

  if (value === 'single-720p' || value === 'single-1080p' || value === 'batch-720p-1080p') {
    return value;
  }

  throw new Error('Invalid export plan file: exportSettings profileId is unsupported.');
}

function buildExportFileName(baseName: string, suffix: string | null): string {
  const normalizedBaseName = normalizeExportFileBaseName(baseName);
  if (!suffix) {
    return `${normalizedBaseName}.mp4`;
  }

  return `${normalizedBaseName}-${suffix}.mp4`;
}

function normalizeExportFileBaseName(value: unknown): string {
  if (typeof value !== 'string') {
    return DEFAULT_EXPORT_PLAN_SETTINGS.fileBaseName;
  }

  const trimmed = stripMp4Extension(value.trim());
  if (!trimmed) {
    throw new Error('Export file base name must not be empty.');
  }

  return trimmed;
}

function stripMp4Extension(value: string): string {
  return value.replace(/\.mp4$/i, '');
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readString(record: UnknownRecord, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid export plan file: ${context} ${key} must be a non-empty string.`);
  }
  return value;
}

function readNumber(record: UnknownRecord, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid export plan file: ${context} ${key} must be a finite number.`);
  }
  return value;
}
