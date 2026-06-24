import { test, expect } from '@playwright/test';
import { resetDb } from '../helpers/reset';

/**
 * Verifies that the per-test DB reset endpoint works:
 * - After a fast reset the e2e DB is wiped and re-seeded
 * - The project list reflects the clean state (no projects)
 */
test('db reset — project list is empty after reset', async ({ page }) => {
  await resetDb();

  await page.goto('/projects');

  // Wait for the list to settle — either the empty-state message or the count badge showing 0.
  await expect(page.getByText('No projects found')).toBeVisible({ timeout: 10_000 });
});
