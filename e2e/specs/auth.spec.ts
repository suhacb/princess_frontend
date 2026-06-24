import { test, expect } from '@playwright/test';

/**
 * Verifies that the Keycloak bypass works end-to-end:
 * - The fake JWT in localStorage is recognised by Angular's AuthStore
 * - AuthGuard calls validate-access-token, which returns true via E2eAuth middleware
 * - The app renders inside the shell (no redirect to the login URL)
 */
test('auth bypass — navigates to protected route without Keycloak redirect', async ({ page }) => {
  await page.goto('/projects');

  // If Keycloak bypass fails, window.location is set to the auth frontend login URL.
  await expect(page).not.toHaveURL(/9020/);
  await expect(page).not.toHaveURL(/\/login/);

  // The page header "Projects" is the first stable landmark after Angular renders.
  await expect(page.getByRole('heading', { name: 'Projects', level: 1 })).toBeVisible({ timeout: 10_000 });
});
