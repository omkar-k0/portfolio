import { defineConfig, devices } from '@playwright/test';

// One seam: the production build, served locally, checked in a real browser.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4322', ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL ?? 'chrome', viewport: { width: 1440, height: 900 } },
  webServer: {
    command: 'npx astro preview --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
