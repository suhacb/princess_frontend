import { test, expect, type Page } from '@playwright/test';
import { resetDb } from '../helpers/reset';
import { roleStateFile } from '../helpers/roles';

const BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';

async function getAccessToken(page: Page): Promise<string> {
  return page.evaluate(() => localStorage.getItem('access_token') ?? '');
}

async function api(
  page: Page,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<{ status: number; body: unknown }> {
  const token = await getAccessToken(page);
  const res = await page.request.fetch(`${BACKEND}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: body ? JSON.stringify(body) : undefined,
  });
  let responseBody: unknown;
  try { responseBody = await res.json(); } catch { responseBody = null; }
  return { status: res.status(), body: responseBody };
}

async function getTestProjectId(page: Page): Promise<number> {
  const { status, body } = await api(page, 'GET', '/api/projects');
  if (status !== 200) throw new Error(`GET /api/projects returned ${status}`);
  const data = (body as { data: Array<{ id: number; reference: string }> }).data;
  const project = data.find(p => p.reference === 'E2E-001');
  if (!project) throw new Error('E2E test project (E2E-001) not found');
  return project.id;
}

async function createDocument(page: Page, projectId: number, title: string): Promise<number> {
  const { body } = await api(page, 'POST', `/api/projects/${projectId}/documents`, {
    title,
    type: 'project_brief',
  });
  return (body as { data: { id: number } }).data.id;
}

// Real browser-driven tests of the document detail overlay drawer: opening
// via row click and via deep link, closing via the close button, the
// backdrop, and Escape, and that the URL reflects drawer state (route param
// drives the overlay per documents-page.component.ts).

test.describe('document detail overlay drawer — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('clicking a document row opens the drawer with a backdrop', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await createDocument(page, id, 'E2E Drawer Doc');

    await page.goto(`/p/${id}/documents`);
    await page.locator('.doc-row').filter({ hasText: 'E2E Drawer Doc' }).click();

    await expect(page.locator('.detail-pane')).toBeVisible();
    await expect(page.locator('.backdrop')).toBeVisible();
    await expect(page.locator('.detail-title')).toHaveText('E2E Drawer Doc');
    await expect(page).toHaveURL(new RegExp(`/p/${id}/documents/\\d+$`));
  });

  test('clicking the close button closes the drawer and navigates back', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await createDocument(page, id, 'E2E Close Button Doc');

    await page.goto(`/p/${id}/documents`);
    await page.locator('.doc-row').filter({ hasText: 'E2E Close Button Doc' }).click();
    await expect(page.locator('.detail-pane')).toBeVisible();

    await page.getByRole('button', { name: 'Close detail' }).click();

    await expect(page.locator('.detail-pane')).not.toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/p/${id}/documents$`));
  });

  test('clicking the backdrop closes the drawer', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await createDocument(page, id, 'E2E Backdrop Doc');

    await page.goto(`/p/${id}/documents`);
    await page.locator('.doc-row').filter({ hasText: 'E2E Backdrop Doc' }).click();
    await expect(page.locator('.detail-pane')).toBeVisible();

    // Click the backdrop itself, not the panel it sits behind.
    await page.locator('.backdrop').click({ position: { x: 5, y: 5 } });

    await expect(page.locator('.detail-pane')).not.toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/p/${id}/documents$`));
  });

  test('pressing Escape closes the drawer', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await createDocument(page, id, 'E2E Escape Doc');

    await page.goto(`/p/${id}/documents`);
    await page.locator('.doc-row').filter({ hasText: 'E2E Escape Doc' }).click();
    await expect(page.locator('.detail-pane')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.locator('.detail-pane')).not.toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/p/${id}/documents$`));
  });

  test('deep-linking directly to a document URL opens the drawer on load', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Deep Link Doc');

    await page.goto(`/p/${id}/documents/${docId}`);

    await expect(page.locator('.detail-pane')).toBeVisible();
    await expect(page.locator('.detail-title')).toHaveText('E2E Deep Link Doc');
  });

  test('the backdrop blocks interaction with the list behind it', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await createDocument(page, id, 'E2E First Doc');
    await createDocument(page, id, 'E2E Second Doc');

    await page.goto(`/p/${id}/documents`);
    await page.locator('.doc-row').filter({ hasText: 'E2E First Doc' }).click();
    await expect(page.locator('.detail-title')).toHaveText('E2E First Doc');

    // The backdrop should intercept clicks meant for the row underneath it —
    // the drawer is a true modal overlay, not a free-floating panel.
    await expect(async () => {
      await page.locator('.doc-row').filter({ hasText: 'E2E Second Doc' }).click({ timeout: 500 });
    }).rejects.toThrow();

    // Still showing the first doc — the click never reached the row.
    await expect(page.locator('.detail-title')).toHaveText('E2E First Doc');
  });

  test('closing and reopening the drawer with a different document swaps its content', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await createDocument(page, id, 'E2E First Doc');
    await createDocument(page, id, 'E2E Second Doc');

    await page.goto(`/p/${id}/documents`);
    await page.locator('.doc-row').filter({ hasText: 'E2E First Doc' }).click();
    await expect(page.locator('.detail-title')).toHaveText('E2E First Doc');

    await page.keyboard.press('Escape');
    await expect(page.locator('.detail-pane')).not.toBeVisible();

    await page.locator('.doc-row').filter({ hasText: 'E2E Second Doc' }).click();
    await expect(page.locator('.detail-title')).toHaveText('E2E Second Doc');
  });
});
