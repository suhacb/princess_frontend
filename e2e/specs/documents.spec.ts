import { test, expect, type Page } from '@playwright/test';
import { resetDb } from '../helpers/reset';
import { roleStateFile } from '../helpers/roles';

const BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';

async function getAccessToken(page: Page): Promise<string> {
  return page.evaluate(() => localStorage.getItem('access_token') ?? '');
}

async function api(
  page: Page,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
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

// ─── project_manager ──────────────────────────────────────────────────────────

test.describe('documents API — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/documents returns 200 with paginated envelope', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'GET', `/api/projects/${id}/documents`);
    expect(status).toBe(200);

    const typed = body as { data: unknown[]; meta: Record<string, number> };
    expect(typed).toHaveProperty('data');
    expect(typed).toHaveProperty('meta');
    expect(Array.isArray(typed.data)).toBe(true);
    expect(typed.meta).toHaveProperty('current_page');
    expect(typed.meta).toHaveProperty('last_page');
    expect(typed.meta).toHaveProperty('per_page');
    expect(typed.meta).toHaveProperty('total');
  });

  test('POST /api/projects/:id/documents creates a document', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'E2E Project Brief',
      type: 'project_brief',
    });
    expect(status).toBe(201);

    const typed = body as { data: Record<string, unknown> };
    expect(typed.data).toHaveProperty('id');
    expect(typed.data['title']).toBe('E2E Project Brief');
    expect(typed.data['type']).toBe('project_brief');
    expect(typed.data['status']).toBe('draft');
    expect(typed.data).toHaveProperty('category');
    expect(typed.data['category']).toBe('initiation');
  });

  test('GET /api/projects/:id/documents/:docId returns single document', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'E2E Stage Plan',
      type: 'stage_plan',
    });
    const docId = (created as { data: { id: number } }).data.id;

    const { status, body } = await api(page, 'GET', `/api/projects/${id}/documents/${docId}`);
    expect(status).toBe(200);
    const typed = body as { data: Record<string, unknown> };
    expect(typed.data['id']).toBe(docId);
    expect(typed.data['title']).toBe('E2E Stage Plan');
    expect(typed.data['type']).toBe('stage_plan');
    expect(typed.data['category']).toBe('planning');
  });

  test('PUT /api/projects/:id/documents/:docId updates metadata', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Original Title',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;

    const { status, body } = await api(page, 'PUT', `/api/projects/${id}/documents/${docId}`, {
      title: 'Updated Title',
    });
    expect(status).toBe(200);
    const typed = body as { data: { title: string } };
    expect(typed.data.title).toBe('Updated Title');
  });

  test('PUT /api/projects/:id/documents/:docId transitions status draft→in_review', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Status Test',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;

    const { status, body } = await api(page, 'PUT', `/api/projects/${id}/documents/${docId}`, {
      status: 'in_review',
    });
    expect(status).toBe(200);
    const typed = body as { data: { status: string } };
    expect(typed.data.status).toBe('in_review');
  });

  test('GET /api/projects/:id/documents?status=draft filters correctly', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    await api(page, 'POST', `/api/projects/${id}/documents`, { title: 'Draft Doc', type: 'project_brief' });

    const { status, body } = await api(page, 'GET', `/api/projects/${id}/documents?status=draft`);
    expect(status).toBe(200);
    const typed = body as { data: Array<{ status: string }> };
    for (const doc of typed.data) {
      expect(doc.status).toBe('draft');
    }
  });

  test('DELETE /api/projects/:id/documents/:docId returns 200 or 204', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'To Delete',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;

    const { status } = await api(page, 'DELETE', `/api/projects/${id}/documents/${docId}`);
    expect([200, 204]).toContain(status);
  });
});

// ─── observer (read-only) ────────────────────────────────────────────────────

test.describe('documents API — observer', () => {
  test.use({ storageState: roleStateFile('observer') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET documents returns 200 for observer', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/documents`);
    expect(status).toBe(200);
  });

  test('POST documents returns 403 for observer', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Observer Doc',
      type: 'project_brief',
    });
    expect(status).toBe(403);
  });
});

// ─── non_member ───────────────────────────────────────────────────────────────

test.describe('documents API — non_member', () => {
  test.use({ storageState: roleStateFile('non_member') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET documents returns 403 for non_member', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/documents`);
    expect(status).toBe(403);
  });
});
