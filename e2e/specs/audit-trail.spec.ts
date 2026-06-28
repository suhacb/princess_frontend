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

// ─── project_manager ──────────────────────────────────────────────────────────

test.describe('audit-trail API — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/audit-trail returns 200 with paginated envelope', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'GET', `/api/projects/${id}/audit-trail`);
    expect(status).toBe(200);

    const typed = body as { data: unknown[]; meta: Record<string, number> };
    expect(typed).toHaveProperty('data');
    expect(typed).toHaveProperty('meta');
    expect(Array.isArray(typed.data)).toBe(true);
    expect(typed.meta).toHaveProperty('current_page');
    expect(typed.meta).toHaveProperty('last_page');
    expect(typed.meta).toHaveProperty('per_page');
    expect(typed.meta).toHaveProperty('total');
    expect(typed.meta['current_page']).toBe(1);
    expect(typed.meta['per_page']).toBe(25);
  });

  test('each audit entry has the expected shape', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'GET', `/api/projects/${id}/audit-trail`);
    expect(status).toBe(200);

    const typed = body as { data: Array<Record<string, unknown>> };
    if (typed.data.length === 0) return;

    const entry = typed.data[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('entity_type');
    expect(entry).toHaveProperty('entity_id');
    expect(entry).toHaveProperty('entity_title');
    expect(entry).toHaveProperty('event');
    expect(entry).toHaveProperty('occurred_at');
    expect(entry).toHaveProperty('changes');
    expect('causer' in entry).toBe(true);
  });

  test('entity_type filter returns only entries of that type', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(
      page, 'GET', `/api/projects/${id}/audit-trail?entity_type=project`,
    );
    expect(status).toBe(200);

    const typed = body as { data: Array<{ entity_type: string }> };
    for (const entry of typed.data) {
      expect(entry.entity_type).toBe('project');
    }
  });

  test('from/to date filters return 200', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(
      page, 'GET',
      `/api/projects/${id}/audit-trail?from=2026-01-01&to=2026-12-31`,
    );
    expect(status).toBe(200);
  });

  test('page param returns correct current_page in meta', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(
      page, 'GET', `/api/projects/${id}/audit-trail?page=1`,
    );
    expect(status).toBe(200);
    const typed = body as { meta: { current_page: number } };
    expect(typed.meta.current_page).toBe(1);
  });

  test('invalid entity_type filter is ignored or returns 422', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(
      page, 'GET', `/api/projects/${id}/audit-trail?entity_type=nonexistent_type`,
    );
    expect([200, 422]).toContain(status);
  });
});

// ─── project_assurance (read-only member) ────────────────────────────────────

test.describe('audit-trail API — project_assurance', () => {
  test.use({ storageState: roleStateFile('project_assurance') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET audit-trail returns 200 for project_assurance', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/audit-trail`);
    expect(status).toBe(200);
  });
});

// ─── observer ─────────────────────────────────────────────────────────────────

test.describe('audit-trail API — observer', () => {
  test.use({ storageState: roleStateFile('observer') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET audit-trail returns 200 for observer (project member with projects:read)', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/audit-trail`);
    expect(status).toBe(200);
  });
});

// ─── non_member ───────────────────────────────────────────────────────────────

test.describe('audit-trail API — non_member', () => {
  test.use({ storageState: roleStateFile('non_member') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET audit-trail returns 403 for non_member', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/audit-trail`);
    expect(status).toBe(403);
  });
});
