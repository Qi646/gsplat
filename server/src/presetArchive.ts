import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

export interface PresetManifestEntry {
  id: string;
  archivePath: string;
  fileName: `${string}.ksplat`;
}

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

export const VERIFIED_PRESET_MANIFEST = {
  garden: {
    archivePath: 'garden/garden.ksplat',
    fileName: 'garden.ksplat',
    id: 'garden',
  },
  stump: {
    archivePath: 'stump/stump.ksplat',
    fileName: 'stump.ksplat',
    id: 'stump',
  },
  truck: {
    archivePath: 'truck/truck.ksplat',
    fileName: 'truck.ksplat',
    id: 'truck',
  },
} as const satisfies Record<string, PresetManifestEntry>;

export function getVerifiedPresetEntry(presetId: string): PresetManifestEntry | null {
  return VERIFIED_PRESET_MANIFEST[presetId as keyof typeof VERIFIED_PRESET_MANIFEST] ?? null;
}

export function buildPresetCachePath(cacheDir: string, presetId: string): string {
  const entry = getVerifiedPresetEntry(presetId);
  if (!entry) {
    throw new Error(`Unknown preset: ${presetId}`);
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

  hasPreset(presetId: string): boolean {
    return getVerifiedPresetEntry(presetId) !== null;
  }

  async getPresetFilePath(presetId: string): Promise<string> {
    const manifestEntry = getVerifiedPresetEntry(presetId);
    if (!manifestEntry) {
      throw new Error(`Unknown preset: ${presetId}`);
    }

    const cachePath = buildPresetCachePath(this.cacheDir, presetId);
    if (existsSync(cachePath)) {
      return cachePath;
    }

    const pendingWrite = this.pendingCacheWrites.get(presetId);
    if (pendingWrite) {
      return pendingWrite;
    }

    const cacheWritePromise = this.populatePresetCache(manifestEntry, cachePath).finally(() => {
      this.pendingCacheWrites.delete(presetId);
    });

    this.pendingCacheWrites.set(presetId, cacheWritePromise);
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
