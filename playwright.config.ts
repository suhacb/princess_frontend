import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env['E2E_BASE_URL'] ?? 'http://localhost:4201';

export default defineConfig({
  testDir: './e2e/specs',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  // Each test calls resetDb() against a single shared princess_e2e database;
  // running spec files across multiple workers races the reset/reseed and
  // trips unique-constraint violations in the backend seeder.
  workers: 1,
  retries: 0,
  timeout: 30_000,

  use: {
    baseURL: BASE_URL,
    // Default role: project_manager (broadest project permissions).
    // Override per describe block with test.use({ storageState: roleStateFile('observer') }).
    storageState: 'e2e/.auth/project_manager.json',
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
