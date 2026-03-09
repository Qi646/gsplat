import { describe, expect, it } from 'vitest';
import { detectBrowserFamily } from '../lib/browserInfo';

describe('detectBrowserFamily', () => {
  it('classifies Firefox user agents', () => {
    expect(detectBrowserFamily('Mozilla/5.0 Gecko/20100101 Firefox/136.0')).toBe('firefox');
  });

  it('treats non-Firefox user agents as other', () => {
    expect(detectBrowserFamily('Mozilla/5.0 AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36')).toBe(
      'other',
    );
  });

  it('treats missing user agents as other', () => {
    expect(detectBrowserFamily(undefined)).toBe('other');
  });
});
