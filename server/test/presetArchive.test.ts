import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { deflateRawSync } from 'node:zlib';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LUIGI_PLY_URL,
  PresetArchiveService,
  buildPresetCachePath,
  inflateZipEntry,
  parseLocalFileHeader,
  parseZipCentralDirectoryTail,
} from '../src/presetArchive.js';

describe('presetArchive', () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { force: true, recursive: true });
      tempDir = null;
    }
  });

  it('parses a zip central directory tail and inflates a deflated entry', () => {
    const archive = buildZipArchive([
      {
        data: Buffer.from('garden-bytes'),
        name: 'garden/garden.ksplat',
      },
    ]);
    const tailStart = Math.max(0, archive.length - 256 * 1024);
    const entries = parseZipCentralDirectoryTail(archive.subarray(tailStart), tailStart);
    const gardenEntry = entries.get('garden/garden.ksplat');

    expect(gardenEntry).toBeDefined();
    expect(gardenEntry?.compressionMethod).toBe(8);
    expect(gardenEntry?.compressedSize).toBeGreaterThan(0);

    const localHeader = parseLocalFileHeader(
      archive.subarray(gardenEntry!.localHeaderOffset, gardenEntry!.localHeaderOffset + 30)
    );
    const dataStart = gardenEntry!.localHeaderOffset + 30 + localHeader.fileNameLength + localHeader.extraFieldLength;
    const compressedBytes = archive.subarray(dataStart, dataStart + gardenEntry!.compressedSize);

    expect(inflateZipEntry(gardenEntry!.compressionMethod, compressedBytes, gardenEntry!.uncompressedSize))
      .toEqual(Buffer.from('garden-bytes'));
  });

  it('extracts and caches a verified preset from a mocked ranged zip download', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-preset-'));
    const archive = buildZipArchive([
      {
        data: Buffer.from('truck-verified-data'),
        name: 'truck/truck.ksplat',
      },
    ]);
    const fetchImpl = createArchiveFetchMock(archive);
    const service = new PresetArchiveService({
      archiveUrl: 'https://example.com/archive.zip',
      cacheDir: tempDir,
      fetchImpl,
    });

    const cachePath = await service.getPresetFilePath('truck', 'ksplat');
    const fileData = await readFile(cachePath);

    expect(fileData).toEqual(Buffer.from('truck-verified-data'));
    expect(fetchImpl).toHaveBeenCalledTimes(4);
  });

  it('uses an existing cached preset file without touching the network', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-preset-'));
    const cachePath = buildPresetCachePath(tempDir, 'garden', 'ksplat');
    const fetchImpl = vi.fn<typeof fetch>();
    const service = new PresetArchiveService({
      archiveUrl: 'https://example.com/archive.zip',
      cacheDir: tempDir,
      fetchImpl,
    });

    await writeFile(cachePath, Buffer.from('cached-garden'));

    await expect(service.getPresetFilePath('garden', 'ksplat')).resolves.toBe(cachePath);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('downloads and caches a direct-download ply preset', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-preset-'));
    const fetchImpl = vi.fn<typeof fetch>(async input => {
      if (String(input) !== LUIGI_PLY_URL) {
        throw new Error(`Unexpected URL: ${String(input)}`);
      }

      return new Response(Buffer.from('luigi-ply-data'), { status: 200 });
    });
    const service = new PresetArchiveService({
      archiveUrl: 'https://example.com/archive.zip',
      cacheDir: tempDir,
      fetchImpl,
    });

    const cachePath = await service.getPresetFilePath('luigi', 'ply');
    const fileData = await readFile(cachePath);

    expect(cachePath).toBe(path.join(tempDir, 'luigi.ply'));
    expect(fileData).toEqual(Buffer.from('luigi-ply-data'));
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('fails when the archive entry for a preset is missing', async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'gsplat-preset-'));
    const archive = buildZipArchive([
      {
        data: Buffer.from('stump-data'),
        name: 'stump/stump.ksplat',
      },
    ]);
    const service = new PresetArchiveService({
      archiveUrl: 'https://example.com/archive.zip',
      cacheDir: tempDir,
      fetchImpl: createArchiveFetchMock(archive),
    });

    await expect(service.getPresetFilePath('garden', 'ksplat')).rejects.toThrow(
      'Archive entry not found: garden/garden.ksplat'
    );
  });
});

function buildZipArchive(entries: Array<{ data: Buffer; name: string }>): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let localOffset = 0;

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, 'utf8');
    const compressedData = deflateRawSync(entry.data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt32LE(0, 10);
    localHeader.writeUInt32LE(0, 14);
    localHeader.writeUInt32LE(compressedData.length, 18);
    localHeader.writeUInt32LE(entry.data.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt32LE(0, 12);
    centralHeader.writeUInt32LE(0, 16);
    centralHeader.writeUInt32LE(compressedData.length, 20);
    centralHeader.writeUInt32LE(entry.data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(localOffset, 42);

    localParts.push(localHeader, nameBuffer, compressedData);
    centralParts.push(centralHeader, nameBuffer);
    localOffset += localHeader.length + nameBuffer.length + compressedData.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endOfCentralDirectory = Buffer.alloc(22);
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(entries.length, 8);
  endOfCentralDirectory.writeUInt16LE(entries.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectory.length, 12);
  endOfCentralDirectory.writeUInt32LE(localOffset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, endOfCentralDirectory]);
}

function createArchiveFetchMock(archive: Buffer) {
  return vi.fn<typeof fetch>(async (_input, init) => {
    const method = init?.method?.toUpperCase() ?? 'GET';
    if (method === 'HEAD') {
      return new Response(null, {
        headers: {
          'content-length': String(archive.length),
        },
        status: 200,
      });
    }

    const headers = new Headers(init?.headers);
    const rangeHeader = headers.get('range');
    if (!rangeHeader) {
      return new Response(archive, { status: 200 });
    }

    const match = /^bytes=(\d+)-(\d+)$/.exec(rangeHeader);
    if (!match) {
      return new Response(null, { status: 416 });
    }

    const start = Number(match[1]);
    const end = Number(match[2]);
    const body = archive.subarray(start, end + 1);

    return new Response(body, {
      headers: {
        'content-length': String(body.length),
        'content-range': `bytes ${start}-${end}/${archive.length}`,
      },
      status: 206,
    });
  });
}
