import { test, expect, type Page } from '@playwright/test';
import { resetDb } from '../helpers/reset';
import { roleStateFile } from '../helpers/roles';

const BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';

/** Reads the access_token from the page's localStorage (populated by storageState). */
async function getAccessToken(page: Page): Promise<string> {
  return page.evaluate(() => localStorage.getItem('access_token') ?? '');
}

/**
 * Calls the backend API directly. page.request inherits extraHTTPHeaders
 * (X-E2E-Token) from the browser context; Authorization is added from localStorage.
 */
async function api(page: Page, path: string): Promise<{ status: number; body: unknown }> {
  const token = await getAccessToken(page);
  const res   = await page.request.get(`${BACKEND}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  let body: unknown;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status(), body };
}

/** Finds the seeded test project ID via the API. */
async function getTestProjectId(page: Page): Promise<number> {
  const { status, body } = await api(page, '/api/projects');
  if (status !== 200) throw new Error(`GET /api/projects returned ${status}`);
  const data = (body as { data: Array<{ id: number; reference: string }> }).data;
  const project = data.find(p => p.reference === 'E2E-001');
  if (!project) throw new Error('E2E test project (E2E-001) not found — has the seeder run?');
  return project.id;
}

/**
 * Role-switching smoke tests.
 *
 * Each describe block calls test.use({ storageState: roleStateFile('<role>') })
 * to load the role-specific fake JWT. The JWT sub matches the role user's
 * external_id so E2eAuth logs in the correct user for every request.
 *
 * Use this file as the template for all role-based feature specs.
 */

test.beforeEach(async () => {
  await resetDb();
});

// ─── Identity verification ────────────────────────────────────────────────────

test.describe('user identity — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test('navbar shows correct initials (EP)', async ({ page }) => {
    await page.goto('/projects');
    // given_name='E2E' + family_name='Project Manager' → E + P
    await expect(page.getByRole('button', { name: 'User menu' })).toContainText('EP', { timeout: 10_000 });
  });
});

test.describe('user identity — observer', () => {
  test.use({ storageState: roleStateFile('observer') });

  test('navbar shows correct initials (EO)', async ({ page }) => {
    await page.goto('/projects');
    // given_name='E2E' + family_name='Observer' → E + O
    await expect(page.getByRole('button', { name: 'User menu' })).toContainText('EO', { timeout: 10_000 });
  });
});

// ─── Project member — project_manager ────────────────────────────────────────

test.describe('project_manager member access', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test('GET /api/projects/{id}/members returns 200 (has people:read via project-team:manage)', async ({ page }) => {
    await page.goto('/projects');
    const id  = await getTestProjectId(page);
    const { status } = await api(page, `/api/projects/${id}/members`);
    expect(status).toBe(200);
  });
});

// ─── Non-member ───────────────────────────────────────────────────────────────

test.describe('non_member access', () => {
  test.use({ storageState: roleStateFile('non_member') });

  test('GET /api/projects/{id}/members returns 403 (not a project member)', async ({ page }) => {
    await page.goto('/projects');
    const id  = await getTestProjectId(page);
    const { status } = await api(page, `/api/projects/${id}/members`);
    expect(status).toBe(403);
  });
});

// ─── Observer — selective read access ────────────────────────────────────────

test.describe('observer selective access', () => {
  test.use({ storageState: roleStateFile('observer') });

  test('GET /api/projects/{id}/members returns 403 (observer lacks people:read)', async ({ page }) => {
    await page.goto('/projects');
    const id  = await getTestProjectId(page);
    const { status } = await api(page, `/api/projects/${id}/members`);
    expect(status).toBe(403);
  });

  test('GET /api/projects/{id}/issues returns 200 (observer has issue-log:read)', async ({ page }) => {
    await page.goto('/projects');
    const id  = await getTestProjectId(page);
    const { status } = await api(page, `/api/projects/${id}/issues`);
    expect(status).toBe(200);
  });
});
