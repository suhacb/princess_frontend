import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect, type Page } from '@playwright/test';
import { resetDb } from '../helpers/reset';
import { roleStateFile, type E2eRole } from '../helpers/roles';

const BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';

async function getAccessToken(page: Page): Promise<string> {
  return page.evaluate(() => localStorage.getItem('access_token') ?? '');
}

/** Reads another role's fake JWT directly from its storageState file, for
 * calls that must be made as a specific user (e.g. the assigned team
 * manager) rather than the page's own logged-in role. */
function getRoleToken(role: E2eRole): string {
  const state = JSON.parse(readFileSync(join(__dirname, '..', '..', roleStateFile(role)), 'utf-8'));
  const entry = state.origins[0].localStorage.find((e: { name: string }) => e.name === 'access_token');
  return entry.value as string;
}

async function api(
  page: Page,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  tokenOverride?: string,
): Promise<{ status: number; body: unknown }> {
  const token = tokenOverride ?? await getAccessToken(page);
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

async function getTeamManagerId(page: Page, projectId: number): Promise<number> {
  const { body } = await api(page, 'GET', `/api/projects/${projectId}/members`);
  const members = (body as { data: Array<{ role: string; person: { id: number } }> }).data;
  const tm = members.find(m => m.role === 'team_manager');
  if (!tm) throw new Error('No team_manager member found on E2E-001 project');
  return tm.person.id;
}

// ─── products (PBS) API — project_manager ────────────────────────────────────

test.describe('products API — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/products/tree returns 200 with an array', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'GET', `/api/projects/${id}/products/tree`);
    expect(status).toBe(200);
    const typed = body as { data: unknown[] };
    expect(Array.isArray(typed.data)).toBe(true);
  });

  test('POST /api/projects/:id/products creates a root product', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'E2E Root Product',
      type: 'specialist',
    });
    expect(status).toBe(201);
    const typed = body as { data: Record<string, unknown> };
    expect(typed.data['title']).toBe('E2E Root Product');
    expect(typed.data['parent_id']).toBeNull();
  });

  test('POST /api/projects/:id/products with parent_id nests under the parent', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: parentBody } = await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'E2E Parent Product',
      type: 'specialist',
    });
    const parentId = (parentBody as { data: { id: number } }).data.id;

    const { status, body } = await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'E2E Child Product',
      type: 'specialist',
      parent_id: parentId,
    });
    expect(status).toBe(201);
    const typed = body as { data: Record<string, unknown> };
    expect(typed.data['parent_id']).toBe(parentId);

    const { body: treeBody } = await api(page, 'GET', `/api/projects/${id}/products/tree`);
    const tree = (treeBody as { data: Array<{ id: number; children: Array<{ id: number }> }> }).data;
    const parentNode = tree.find(p => p.id === parentId);
    expect(parentNode?.children.some(c => c.id === (typed.data['id'] as number))).toBe(true);
  });

  test('PATCH /api/projects/:id/products/:productId updates the title', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'Original Title',
      type: 'specialist',
    });
    const productId = (created as { data: { id: number } }).data.id;

    const { status, body } = await api(page, 'PATCH', `/api/projects/${id}/products/${productId}`, {
      title: 'Updated Title',
    });
    expect(status).toBe(200);
    const typed = body as { data: { title: string } };
    expect(typed.data.title).toBe('Updated Title');
  });

  test('POST /api/projects/:id/products/:productId/baseline transitions status', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'To Baseline',
      type: 'specialist',
    });
    const productId = (created as { data: { id: number } }).data.id;

    const { status, body } = await api(page, 'POST', `/api/projects/${id}/products/${productId}/baseline`);
    expect(status).toBe(200);
    const typed = body as { data: { status: string } };
    expect(typed.data.status).toBe('baselined');
  });

  test('DELETE /api/projects/:id/products/:productId removes the product', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'To Delete',
      type: 'specialist',
    });
    const productId = (created as { data: { id: number } }).data.id;

    const { status } = await api(page, 'DELETE', `/api/projects/${id}/products/${productId}`);
    expect([200, 204]).toContain(status);

    const { body: treeBody } = await api(page, 'GET', `/api/projects/${id}/products/tree`);
    const tree = (treeBody as { data: Array<{ id: number }> }).data;
    expect(tree.some(p => p.id === productId)).toBe(false);
  });
});

test.describe('products API — non_member', () => {
  test.use({ storageState: roleStateFile('non_member') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET products/tree returns 403 for non_member', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/products/tree`);
    expect(status).toBe(403);
  });
});

// ─── work packages API — project_manager ─────────────────────────────────────

test.describe('work packages API — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/work-packages returns 200 with an array', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'GET', `/api/projects/${id}/work-packages`);
    expect(status).toBe(200);
    const typed = body as { data: unknown[] };
    expect(Array.isArray(typed.data)).toBe(true);
  });

  test('POST /api/projects/:id/work-packages creates a draft work package', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const teamManagerId = await getTeamManagerId(page, id);

    const { status, body } = await api(page, 'POST', `/api/projects/${id}/work-packages`, {
      title: 'E2E Work Package',
      team_manager_id: teamManagerId,
      planned_start: '2026-08-01',
      planned_end: '2026-08-31',
    });
    expect(status).toBe(201);
    const typed = body as { data: Record<string, unknown> };
    expect(typed.data['title']).toBe('E2E Work Package');
    expect(typed.data['status']).toBe('draft');
  });

  test('work package lifecycle: authorize (PM) → accept → complete (assigned team manager)', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const teamManagerId = await getTeamManagerId(page, id);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/work-packages`, {
      title: 'E2E Lifecycle WP',
      team_manager_id: teamManagerId,
      planned_start: '2026-08-01',
      planned_end: '2026-08-31',
    });
    const wpId = (created as { data: { id: number } }).data.id;

    const { status: authStatus, body: authBody } = await api(
      page, 'POST', `/api/projects/${id}/work-packages/${wpId}/authorize`,
    );
    expect(authStatus).toBe(200);
    expect((authBody as { data: { status: string } }).data.status).toBe('authorized');

    // accept/complete belong to the assigned team manager, not the PM who authorized it.
    const tmToken = getRoleToken('team_manager');

    const { status: acceptStatus, body: acceptBody } = await api(
      page, 'POST', `/api/projects/${id}/work-packages/${wpId}/accept`, undefined, tmToken,
    );
    expect(acceptStatus).toBe(200);
    expect((acceptBody as { data: { status: string } }).data.status).toBe('in_progress');

    const { status: completeStatus, body: completeBody } = await api(
      page, 'POST', `/api/projects/${id}/work-packages/${wpId}/complete`, undefined, tmToken,
    );
    expect(completeStatus).toBe(200);
    expect((completeBody as { data: { status: string } }).data.status).toBe('completed');
  });

  test('DELETE /api/projects/:id/work-packages/:wpId removes the work package', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const teamManagerId = await getTeamManagerId(page, id);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/work-packages`, {
      title: 'To Delete',
      team_manager_id: teamManagerId,
      planned_start: '2026-08-01',
      planned_end: '2026-08-31',
    });
    const wpId = (created as { data: { id: number } }).data.id;

    const { status } = await api(page, 'DELETE', `/api/projects/${id}/work-packages/${wpId}`);
    expect([200, 204]).toContain(status);
  });
});

test.describe('work packages API — non_member', () => {
  test.use({ storageState: roleStateFile('non_member') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET work-packages returns 403 for non_member', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/work-packages`);
    expect(status).toBe(403);
  });
});

// ─── PBS tree UI — project_manager ───────────────────────────────────────────
// Drives the actual browser: nested product creation and the product overlay
// side panel (open, edit, close via Escape / backdrop / close button, delete).

test.describe('PBS tree UI — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('creates a root product and a nested sub-product via the tree UI', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    await page.goto(`/p/${id}/plan`);

    const addProductBtn = page.locator('.wbs__add-btn, .wbs__pane app-empty-state button')
      .filter({ hasText: /add product/i }).first();
    await addProductBtn.click();

    const rootInput = page.locator('.wbs-node--root.wbs-node--adding input');
    await rootInput.fill('E2E Root Product');
    await rootInput.press('Enter');

    const rootNode = page.locator('.wbs-node--root').filter({ hasText: 'E2E Root Product' });
    await expect(rootNode).toBeVisible();

    await rootNode.locator('button[title="Add sub-product"]').click();
    const childInput = page.locator('.wbs-node--child.wbs-node--adding input');
    await childInput.fill('E2E Sub Product');
    await childInput.press('Enter');

    const childNode = page.locator('.wbs-node--child').filter({ hasText: 'E2E Sub Product' });
    await expect(childNode).toBeVisible();
  });

  test('opens the product overlay side panel, edits the title, and closes it', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'E2E Panel Product',
      type: 'specialist',
    });

    await page.goto(`/p/${id}/plan`);

    const rootNode = page.locator('.wbs-node--root').filter({ hasText: 'E2E Panel Product' });
    await rootNode.locator('.wbs-node__row').click();

    const panel = page.locator('.panel');
    const backdrop = page.locator('.backdrop');
    await expect(panel).toBeVisible();
    await expect(backdrop).toBeVisible();

    const titleInput = panel.locator('input[formcontrolname="title"]');
    await expect(titleInput).toHaveValue('E2E Panel Product');
    await titleInput.fill('E2E Panel Product Renamed');
    await panel.getByRole('button', { name: /save changes/i }).click();

    await expect(page.locator('.wbs-node--root').filter({ hasText: 'E2E Panel Product Renamed' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
  });

  test('deletes a product via the tree row action with confirmation', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    await api(page, 'POST', `/api/projects/${id}/products`, {
      title: 'E2E Product To Delete',
      type: 'specialist',
    });

    await page.goto(`/p/${id}/plan`);

    const node = page.locator('.wbs-node--root').filter({ hasText: 'E2E Product To Delete' });
    await node.locator('button[title="Delete"]').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Delete product');
    await dialog.getByRole('button', { name: 'Delete' }).click();

    await expect(page.locator('.wbs-node--root').filter({ hasText: 'E2E Product To Delete' })).toHaveCount(0);
  });
});
