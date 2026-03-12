import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClientId } from '../lib/createClientId';

describe('createClientId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uses crypto.randomUUID when available', () => {
    vi.stubGlobal('crypto', {
      randomUUID: ((() => 'uuid-1234') as unknown) as Crypto['randomUUID'],
    } as Partial<Crypto>);

    expect(createClientId('draft')).toBe('draft-uuid-1234');
  });

  it('falls back when randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (<T extends ArrayBufferView>(buffer: T): T => {
        new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength).fill(0xab);
        return buffer;
      }) as Crypto['getRandomValues'],
    } as Partial<Crypto>);
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    expect(createClientId('keyframe')).toBe('keyframe-loyw3v28-abababababababababab');
  });
});
