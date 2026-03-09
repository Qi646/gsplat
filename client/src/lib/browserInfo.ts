export type BrowserFamily = 'firefox' | 'other';

export function detectBrowserFamily(userAgent: string | undefined | null): BrowserFamily {
  if (typeof userAgent !== 'string') {
    return 'other';
  }

  return /firefox|fxios/i.test(userAgent) ? 'firefox' : 'other';
}
