import { test, expect } from '@playwright/test';
import { resetDb } from '../helpers/reset';

/**
 * Verifies that the per-test DB reset works: after a fast reset the seeder
 * runs and the canonical test data is visible in the UI.
 */
test('db reset — seeded project is visible after reset', async ({ page }) => {
  await resetDb();

  await page.goto('/projects');

  await expect(page.getByText('E2E Test Project')).toBeVisible({ timeout: 10_000 });
});
