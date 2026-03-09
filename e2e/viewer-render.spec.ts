import { expect, test, type Page } from '@playwright/test';

type ViewerMode = 'default' | 'compat';

interface CanvasMetrics {
  averageBrightness: number;
  brightPixels: number;
  height: number;
  width: number;
}

const fixturePath = '/test-assets/smoke-grid.ply';

async function collectCanvasMetrics(page: Page): Promise<CanvasMetrics> {
  const metrics = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#viewer-host canvas');
    if (!canvas) {
      return null;
    }

    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return null;
    }

    const width = Math.min(canvas.width, 96);
    const height = Math.min(canvas.height, 96);
    const pixels = new Uint8Array(width * height * 4);
    gl.finish();
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let brightPixels = 0;
    let totalBrightness = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      const brightness = pixels[index]! + pixels[index + 1]! + pixels[index + 2]!;
      totalBrightness += brightness;
      if (brightness >= 40) {
        brightPixels += 1;
      }
    }

    return {
      averageBrightness: totalBrightness / (width * height * 3),
      brightPixels,
      height,
      width,
    };
  });

  expect(metrics).not.toBeNull();
  return metrics as CanvasMetrics;
}

for (const viewerMode of ['default', 'compat'] satisfies ViewerMode[]) {
  test(`renders the smoke fixture in Firefox using ${viewerMode} mode`, async ({ page }, testInfo) => {
    test.setTimeout(45_000);

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    await page.goto(`/?e2e=1&viewerMode=${viewerMode}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10_000,
    });
    await page.waitForFunction(() => typeof window.__GSPLAT_DEBUG__?.snapshot === 'function', {
      timeout: 10_000,
    });
    await page.waitForFunction(
      () => {
        const snapshot = window.__GSPLAT_DEBUG__?.snapshot();
        return Boolean(snapshot && snapshot.bootPhase !== 'booting');
      },
      { timeout: 10_000 }
    );

    const bootSnapshot = await page.evaluate(() => window.__GSPLAT_DEBUG__!.snapshot());
    expect(bootSnapshot).toMatchObject({
      bootPhase: 'viewer:ready',
      initErrorMessage: null,
    });

    const viewerHost = page.locator('#viewer-host');
    await expect(viewerHost).toBeVisible();

    const blankMetrics = await collectCanvasMetrics(page);
    await viewerHost.screenshot({
      path: testInfo.outputPath(`viewer-${viewerMode}-blank.png`),
    });

    await page.fill('#scene-url-input', fixturePath);
    await page.click('#btn-load-scene');

    await page.waitForFunction(
      () => {
        const snapshot = window.__GSPLAT_DEBUG__?.snapshot();
        return Boolean(snapshot?.viewer && snapshot.viewer.sceneLoaded && snapshot.viewer.splatRenderCount > 0);
      },
      { timeout: 30_000 }
    );

    await expect
      .poll(() => page.locator('#stat-scene').textContent(), {
        timeout: 10_000,
      })
      .toContain('loaded');

    const snapshot = await page.evaluate(() => window.__GSPLAT_DEBUG__!.snapshot());
    const loadedMetrics = await collectCanvasMetrics(page);
    await viewerHost.screenshot({
      path: testInfo.outputPath(`viewer-${viewerMode}-loaded.png`),
    });

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);

    expect(snapshot.bootPhase).toBe('viewer:ready');
    expect(snapshot.viewer).not.toBeNull();
    expect(snapshot.viewer?.sceneLoaded).toBe(true);
    expect(snapshot.viewer?.sceneCount).toBe(1);
    expect(snapshot.viewer?.splatCount).toBeGreaterThan(0);
    expect(snapshot.viewer?.splatRenderCount).toBeGreaterThan(0);
    expect(snapshot.viewer?.canvasSize.width).toBeGreaterThan(0);
    expect(snapshot.viewer?.canvasSize.height).toBeGreaterThan(0);

    if (viewerMode === 'compat') {
      expect(snapshot.viewer?.runtime.compatibilityMode).toBe(true);
      expect(snapshot.viewer?.runtime.viewerOptions.gpuAcceleratedSort).toBe(false);
      expect(snapshot.viewer?.runtime.viewerOptions.sharedMemoryForWorkers).toBe(false);
    } else {
      expect(snapshot.viewer?.runtime.viewerOptions.gpuAcceleratedSort).toBe(true);
      expect(snapshot.viewer?.runtime.viewerOptions.sharedMemoryForWorkers).toBe(true);
    }

    expect(loadedMetrics.brightPixels).toBeGreaterThan(blankMetrics.brightPixels + 20);
    expect(loadedMetrics.averageBrightness).toBeGreaterThan(blankMetrics.averageBrightness + 1);
  });
}
