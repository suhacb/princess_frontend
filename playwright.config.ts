import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env['E2E_BASE_URL'] ?? 'http://localhost:4201';

export default defineConfig({
  testDir: './e2e/specs',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,

  use: {
    baseURL: BASE_URL,
    storageState: 'e2e/.auth/state.json',
    // Sent with every browser request so the backend switches to princess_e2e
    // and skips Keycloak validation.
    extraHTTPHeaders: { 'X-E2E-Token': process.env['E2E_TOKEN'] ?? '' },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: process.env['CHROME_BIN'] ?? undefined,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],

  webServer: {
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 90_000,
  },
});
