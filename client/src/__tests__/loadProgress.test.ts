import { describe, expect, it } from 'vitest';
import { formatLoadProgress, LOAD_STAGE } from '../lib/loadProgress';

describe('formatLoadProgress', () => {
  it('shows download activity before the first visible percent increment', () => {
    expect(formatLoadProgress(0, '0%', LOAD_STAGE.Downloading)).toEqual({
      percent: 0,
      message: 'Downloading…',
    });

    expect(formatLoadProgress(0.02, '0.02%', LOAD_STAGE.Downloading)).toEqual({
      percent: 0.02,
      message: 'Downloading (0.02%)',
    });
  });

  it('formats processing and finalizing stages with the correct labels', () => {
    expect(formatLoadProgress(0, '0%', LOAD_STAGE.Processing)).toEqual({
      percent: 0,
      message: 'Processing scene…',
    });

    expect(formatLoadProgress(100, '100%', LOAD_STAGE.Done)).toEqual({
      percent: 100,
      message: 'Finalizing…',
    });
  });
});
