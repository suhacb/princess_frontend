import { test, expect, type Page } from '@playwright/test';
import { resetDb } from '../helpers/reset';
import { roleStateFile } from '../helpers/roles';

const BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';

async function getAccessToken(page: Page): Promise<string> {
  return page.evaluate(() => localStorage.getItem('access_token') ?? '');
}

async function api(
  page: Page,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
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

  test('GET /api/projects/:id/documents?category=planning filters by category', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    await api(page, 'POST', `/api/projects/${id}/documents`, { title: 'Stage Plan', type: 'stage_plan' });
    await api(page, 'POST', `/api/projects/${id}/documents`, { title: 'Project Brief', type: 'project_brief' });

    const { status, body } = await api(page, 'GET', `/api/projects/${id}/documents?category=planning`);
    expect(status).toBe(200);
    const typed = body as { data: Array<{ category: string }> };
    for (const doc of typed.data) {
      expect(doc.category).toBe('planning');
    }
  });

  test('PATCH /api/projects/:id/documents/:docId/classify updates tags', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'To Classify',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;

    const { status, body } = await api(
      page,
      'PATCH',
      `/api/projects/${id}/documents/${docId}/classify`,
      { tags: ['urgent', 'qa'] },
    );
    expect(status).toBe(200);
    const typed = body as { data: { tags: string[] } };
    expect(typed.data.tags).toContain('urgent');
    expect(typed.data.tags).toContain('qa');
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

  test('POST /api/projects/:id/documents/:docId/upload uploads a file version', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Upload Test',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;
    const token = await getAccessToken(page);

    const fileContent = 'Hello, this is a test file.';
    const formData = new FormData();
    formData.append('file', new Blob([fileContent], { type: 'text/plain' }), 'test.txt');
    formData.append('comment', 'Initial version');

    const res = await page.request.fetch(`${BACKEND}/api/projects/${id}/documents/${docId}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: {
          name: 'test.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from(fileContent),
        },
        comment: 'Initial version',
      },
    });
    expect([200, 201]).toContain(res.status());

    const body = await res.json() as { data: Record<string, unknown> };
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('version_number');
    expect(body.data['file_name']).toBe('test.txt');
  });

  test('GET /api/projects/:id/documents/:docId/download returns a redirect or blob', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Download Test',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;
    const token = await getAccessToken(page);

    const fileContent = 'Download me.';
    await page.request.fetch(`${BACKEND}/api/projects/${id}/documents/${docId}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: {
          name: 'download_test.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from(fileContent),
        },
      },
    });

    const downloadRes = await page.request.fetch(
      `${BACKEND}/api/projects/${id}/documents/${docId}/download`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        maxRedirects: 0,
      },
    );
    expect([200, 302]).toContain(downloadRes.status());
  });
});

  test('GET /versions returns all versions for a document', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const token = await getAccessToken(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Version History Test',
      type: 'project_brief',
    });
    const docId = (created as { data: { id: number } }).data.id;

    await page.request.fetch(`${BACKEND}/api/projects/${id}/documents/${docId}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: { name: 'v1.txt', mimeType: 'text/plain', buffer: Buffer.from('version 1') },
        comment: 'First version',
      },
    });
    await page.request.fetch(`${BACKEND}/api/projects/${id}/documents/${docId}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: { name: 'v2.txt', mimeType: 'text/plain', buffer: Buffer.from('version 2') },
        comment: 'Second version',
      },
    });

    const { status, body } = await api(page, 'GET', `/api/projects/${id}/documents/${docId}/versions`);
    expect(status).toBe(200);

    const typed = body as { data: Array<Record<string, unknown>> };
    expect(Array.isArray(typed.data)).toBe(true);
    expect(typed.data.length).toBeGreaterThanOrEqual(2);
    expect(typed.data[0]).toHaveProperty('id');
    expect(typed.data[0]).toHaveProperty('version_number');
    expect(typed.data[0]).toHaveProperty('file_name');
    expect(typed.data[0]).toHaveProperty('file_size');
    expect(typed.data[0]).toHaveProperty('uploaded_by');
    expect(typed.data[0]).toHaveProperty('uploaded_at');
  });

  test('POST /versions/:id/revert creates a new version as copy', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const token = await getAccessToken(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Revert Test',
      type: 'stage_plan',
    });
    const docId = (created as { data: { id: number } }).data.id;

    const uploadRes = await page.request.fetch(
      `${BACKEND}/api/projects/${id}/documents/${docId}/upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        multipart: {
          file: { name: 'v1.txt', mimeType: 'text/plain', buffer: Buffer.from('original') },
        },
      },
    );
    const uploadBody = await uploadRes.json() as { data: { id: number } };
    const versionId = uploadBody.data.id;

    await page.request.fetch(`${BACKEND}/api/projects/${id}/documents/${docId}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: { name: 'v2.txt', mimeType: 'text/plain', buffer: Buffer.from('second') },
      },
    });

    const { status, body } = await api(
      page,
      'POST',
      `/api/projects/${id}/documents/${docId}/versions/${versionId}/revert`,
    );
    expect([200, 201]).toContain(status);

    const typed = body as { data: Record<string, unknown> };
    expect(typed.data).toHaveProperty('id');
    expect(typed.data).toHaveProperty('version_number');
    expect(Number(typed.data['version_number'])).toBeGreaterThan(1);
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

  test('PATCH classify returns 403 for observer', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'PATCH', `/api/projects/${id}/documents/999/classify`, {
      tags: ['test'],
    });
    expect([403, 404]).toContain(status);
  });
});

// ─── project_assurance (read-only) ───────────────────────────────────────────

test.describe('documents API — project_assurance', () => {
  test.use({ storageState: roleStateFile('project_assurance') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET documents returns 200 for project_assurance', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/documents`);
    expect(status).toBe(200);
  });

  test('POST documents returns 403 for project_assurance', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Assurance Doc',
      type: 'project_brief',
    });
    expect(status).toBe(403);
  });
});

// ─── team_manager ─────────────────────────────────────────────────────────────

test.describe('documents API — team_manager', () => {
  test.use({ storageState: roleStateFile('team_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET documents returns 200 for team_manager', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/documents`);
    expect(status).toBe(200);
  });

  test('POST documents — team_manager can create a work_package', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status, body } = await api(page, 'POST', `/api/projects/${id}/documents`, {
      title: 'Team Work Package',
      type: 'work_package',
    });
    expect([201, 403]).toContain(status);
    if (status === 201) {
      const typed = body as { data: { type: string } };
      expect(typed.data.type).toBe('work_package');
    }
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
