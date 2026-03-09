import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

export type PresetFileExtension = 'ksplat' | 'ply';

interface BasePresetManifestEntry {
  id: string;
  extension: PresetFileExtension;
  fileName: `${string}.${PresetFileExtension}`;
}

export interface ArchivePresetManifestEntry extends BasePresetManifestEntry {
  archivePath: string;
  source: 'archive';
}

export interface DirectDownloadPresetManifestEntry extends BasePresetManifestEntry {
  source: 'download';
  sourceUrl: string;
}

export type PresetManifestEntry = ArchivePresetManifestEntry | DirectDownloadPresetManifestEntry;

export interface ZipCentralDirectoryEntry {
  compressionMethod: number;
  compressedSize: number;
  localHeaderOffset: number;
  path: string;
  uncompressedSize: number;
}

export interface PresetArchiveServiceOptions {
  archiveUrl?: string;
  cacheDir?: string;
  fetchImpl?: typeof fetch;
}

const CENTRAL_DIRECTORY_SCAN_BYTES = 256 * 1024;
const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const LOCAL_FILE_HEADER_BYTES = 30;
const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;

export const VERIFIED_PRESET_ARCHIVE_URL = 'https://projects.markkellogg.org/downloads/gaussian_splat_data.zip';
export const LUIGI_PLY_URL =
  'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/luigi/luigi.ply';

export const VERIFIED_PRESET_MANIFEST = {
  garden: {
    archivePath: 'garden/garden.ksplat',
    extension: 'ksplat',
    fileName: 'garden.ksplat',
    id: 'garden',
    source: 'archive',
  },
  stump: {
    archivePath: 'stump/stump.ksplat',
    extension: 'ksplat',
    fileName: 'stump.ksplat',
    id: 'stump',
    source: 'archive',
  },
  truck: {
    archivePath: 'truck/truck.ksplat',
    extension: 'ksplat',
    fileName: 'truck.ksplat',
    id: 'truck',
    source: 'archive',
  },
  luigi: {
    extension: 'ply',
    fileName: 'luigi.ply',
    id: 'luigi',
    source: 'download',
    sourceUrl: LUIGI_PLY_URL,
  },
} as const satisfies Record<string, PresetManifestEntry>;

export function isPresetFileExtension(extension: string): extension is PresetFileExtension {
  return extension === 'ksplat' || extension === 'ply';
}

export function getVerifiedPresetEntry(
  presetId: string,
  extension?: string
): PresetManifestEntry | null {
  const entry = VERIFIED_PRESET_MANIFEST[presetId as keyof typeof VERIFIED_PRESET_MANIFEST] ?? null;

  if (!entry) {
    return null;
  }

  if (extension === undefined) {
    return entry;
  }

  if (!isPresetFileExtension(extension) || entry.extension !== extension) {
    return null;
  }

  return entry;
}

export function formatPresetRequestId(presetId: string, extension?: string): string {
  return extension ? `${presetId}.${extension}` : presetId;
}

export function buildPresetCachePath(cacheDir: string, presetId: string, extension?: string): string {
  const entry = getVerifiedPresetEntry(presetId, extension);
  if (!entry) {
    throw new Error(`Unknown preset: ${formatPresetRequestId(presetId, extension)}`);
  }

  return path.join(cacheDir, entry.fileName);
}

export function parseZipCentralDirectoryTail(
  buffer: Buffer,
  rangeStart: number
): Map<string, ZipCentralDirectoryEntry> {
  const endOfCentralDirectoryOffset = findEndOfCentralDirectoryOffset(buffer);
  const centralDirectorySize = buffer.readUInt32LE(endOfCentralDirectoryOffset + 12);
  const centralDirectoryOffset = buffer.readUInt32LE(endOfCentralDirectoryOffset + 16);
  const relativeCentralDirectoryOffset = centralDirectoryOffset - rangeStart;

  if (
    relativeCentralDirectoryOffset < 0 ||
    relativeCentralDirectoryOffset + centralDirectorySize > buffer.length
  ) {
    throw new Error('Central directory is not fully present in the fetched archive tail.');
  }

  const entries = new Map<string, ZipCentralDirectoryEntry>();
  let pointer = relativeCentralDirectoryOffset;
  const endPointer = relativeCentralDirectoryOffset + centralDirectorySize;

  while (pointer < endPointer) {
    const signature = buffer.readUInt32LE(pointer);
    if (signature !== CENTRAL_DIRECTORY_SIGNATURE) {
      throw new Error(`Invalid central directory header at offset ${pointer}.`);
    }

    const compressionMethod = buffer.readUInt16LE(pointer + 10);
    const compressedSize = buffer.readUInt32LE(pointer + 20);
    const uncompressedSize = buffer.readUInt32LE(pointer + 24);
    const fileNameLength = buffer.readUInt16LE(pointer + 28);
    const extraFieldLength = buffer.readUInt16LE(pointer + 30);
    const commentLength = buffer.readUInt16LE(pointer + 32);
    const localHeaderOffset = buffer.readUInt32LE(pointer + 42);
    const fileNameStart = pointer + 46;
    const fileNameEnd = fileNameStart + fileNameLength;
    const fileName = buffer.subarray(fileNameStart, fileNameEnd).toString('utf8');

    entries.set(fileName, {
      compressionMethod,
      compressedSize,
      localHeaderOffset,
      path: fileName,
      uncompressedSize,
    });

    pointer = fileNameEnd + extraFieldLength + commentLength;
  }

  return entries;
}

export function parseLocalFileHeader(buffer: Buffer): {
  extraFieldLength: number;
  fileNameLength: number;
} {
  if (buffer.length < LOCAL_FILE_HEADER_BYTES) {
    throw new Error('Local file header buffer is too small.');
  }

  const signature = buffer.readUInt32LE(0);
  if (signature !== LOCAL_FILE_HEADER_SIGNATURE) {
    throw new Error('Invalid local file header signature.');
  }

  return {
    extraFieldLength: buffer.readUInt16LE(28),
    fileNameLength: buffer.readUInt16LE(26),
  };
}

export function inflateZipEntry(
  compressionMethod: number,
  compressedData: Buffer,
  expectedSize: number
): Buffer {
  if (compressionMethod === 0) {
    return compressedData;
  }

  if (compressionMethod !== 8) {
    throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`);
  }

  const inflated = inflateRawSync(compressedData);
  if (inflated.length !== expectedSize) {
    throw new Error(
      `Inflated ZIP entry size mismatch. Expected ${expectedSize} bytes, got ${inflated.length}.`
    );
  }

  return inflated;
}

export class PresetArchiveService {
  private archiveUrl: string;
  private cacheDir: string;
  private fetchImpl: typeof fetch;
  private centralDirectoryPromise: Promise<Map<string, ZipCentralDirectoryEntry>> | null = null;
  private pendingCacheWrites = new Map<string, Promise<string>>();

  constructor(options: PresetArchiveServiceOptions = {}) {
    this.archiveUrl = options.archiveUrl ?? VERIFIED_PRESET_ARCHIVE_URL;
    this.cacheDir = options.cacheDir ?? path.join('/tmp', 'gsplat-presets');
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  hasPreset(presetId: string, extension: string): boolean {
    return getVerifiedPresetEntry(presetId, extension) !== null;
  }

  async getPresetFilePath(presetId: string, extension: string): Promise<string> {
    const manifestEntry = getVerifiedPresetEntry(presetId, extension);
    if (!manifestEntry) {
      throw new Error(`Unknown preset: ${formatPresetRequestId(presetId, extension)}`);
    }

    const cachePath = buildPresetCachePath(this.cacheDir, presetId, extension);
    if (existsSync(cachePath)) {
      return cachePath;
    }

    const pendingWrite = this.pendingCacheWrites.get(manifestEntry.fileName);
    if (pendingWrite) {
      return pendingWrite;
    }

    const cacheWritePromise = this.populatePresetCache(manifestEntry, cachePath).finally(() => {
      this.pendingCacheWrites.delete(manifestEntry.fileName);
    });

    this.pendingCacheWrites.set(manifestEntry.fileName, cacheWritePromise);
    return cacheWritePromise;
  }

  private async populatePresetCache(
    manifestEntry: PresetManifestEntry,
    cachePath: string
  ): Promise<string> {
    await mkdir(this.cacheDir, { recursive: true });

    if (existsSync(cachePath)) {
      return cachePath;
    }

    if (manifestEntry.source === 'download') {
      const presetData = await this.downloadPresetFile(manifestEntry.sourceUrl);
      await writeFile(cachePath, presetData);
      return cachePath;
    }

    const centralDirectory = await this.loadCentralDirectory();
    const archiveEntry = centralDirectory.get(manifestEntry.archivePath);
    if (!archiveEntry) {
      throw new Error(`Archive entry not found: ${manifestEntry.archivePath}`);
    }

    const compressedEntryData = await this.downloadCompressedEntry(archiveEntry);
    const inflatedEntryData = inflateZipEntry(
      archiveEntry.compressionMethod,
      compressedEntryData,
      archiveEntry.uncompressedSize
    );

    await writeFile(cachePath, inflatedEntryData);
    return cachePath;
  }

  private async loadCentralDirectory(): Promise<Map<string, ZipCentralDirectoryEntry>> {
    if (!this.centralDirectoryPromise) {
      this.centralDirectoryPromise = this.fetchCentralDirectory();
    }

    return this.centralDirectoryPromise;
  }

  private async fetchCentralDirectory(): Promise<Map<string, ZipCentralDirectoryEntry>> {
    const archiveSize = await this.fetchArchiveSize();
    const rangeStart = Math.max(0, archiveSize - CENTRAL_DIRECTORY_SCAN_BYTES);
    const tail = await this.fetchRange(rangeStart, archiveSize - 1);
    return parseZipCentralDirectoryTail(tail, rangeStart);
  }

  private async fetchArchiveSize(): Promise<number> {
    const response = await this.fetchImpl(this.archiveUrl, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Archive HEAD request failed with status ${response.status}.`);
    }

    const contentLength = Number(response.headers.get('content-length'));
    if (!Number.isFinite(contentLength) || contentLength <= 0) {
      throw new Error('Archive HEAD response did not provide a valid Content-Length.');
    }

    return contentLength;
  }

  private async downloadCompressedEntry(entry: ZipCentralDirectoryEntry): Promise<Buffer> {
    const localFileHeader = await this.fetchRange(
      entry.localHeaderOffset,
      entry.localHeaderOffset + LOCAL_FILE_HEADER_BYTES - 1
    );
    const { fileNameLength, extraFieldLength } = parseLocalFileHeader(localFileHeader);
    const dataStart = entry.localHeaderOffset + LOCAL_FILE_HEADER_BYTES + fileNameLength + extraFieldLength;
    const dataEnd = dataStart + entry.compressedSize - 1;

    return this.fetchRange(dataStart, dataEnd);
  }

  private async downloadPresetFile(sourceUrl: string): Promise<Buffer> {
    const response = await this.fetchImpl(sourceUrl);
    if (!response.ok) {
      throw new Error(`Preset download request failed with status ${response.status}.`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  private async fetchRange(start: number, end: number): Promise<Buffer> {
    const response = await this.fetchImpl(this.archiveUrl, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

    if (!response.ok && response.status !== 206) {
      throw new Error(`Archive range request failed with status ${response.status}.`);
    }

    return Buffer.from(await response.arrayBuffer());
  }
}

function findEndOfCentralDirectoryOffset(buffer: Buffer): number {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
      return offset;
    }
  }

  throw new Error('Could not find end of central directory record.');
}
