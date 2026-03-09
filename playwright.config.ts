import { defineConfig } from '@playwright/test';

const port = 3310;

export default defineConfig({
  fullyParallel: false,
  retries: 0,
  testDir: './e2e',
  timeout: 120_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run start',
    env: {
      ...process.env,
      PORT: String(port),
    },
    port,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
  workers: 1,
  projects: [
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
  ],
});
