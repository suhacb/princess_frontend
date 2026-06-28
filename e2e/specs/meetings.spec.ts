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

async function getProjectManagerPersonId(page: Page, projectId: number): Promise<number> {
  const { body } = await api(page, 'GET', `/api/projects/${projectId}/members`);
  const members = (body as { data: Array<{ id: number; person: { id: number; name: string }; role: string }> }).data;
  const pm = members.find(m => m.role === 'project_manager');
  if (!pm) throw new Error('No project_manager member found in E2E-001');
  return pm.person.id;
}

// ─── API access ───────────────────────────────────────────────────────────────

test.describe('meetings API — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/meetings returns 200', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/meetings`);
    expect(status).toBe(200);
  });

  test('can create, read, update and delete a meeting', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    // Create
    const { status: createStatus, body: created } = await api(page, 'POST', `/api/projects/${id}/meetings`, {
      title: 'E2E Kick-off',
      date_time: '2026-08-01T10:00:00Z',
      agenda: 'Review scope',
    });
    expect(createStatus).toBe(201);
    const meetingId = (created as { data: { id: number } }).data.id;
    expect(meetingId).toBeGreaterThan(0);

    // Read detail
    const { status: showStatus, body: shown } = await api(page, 'GET', `/api/projects/${id}/meetings/${meetingId}`);
    expect(showStatus).toBe(200);
    expect((shown as { data: { title: string } }).data.title).toBe('E2E Kick-off');

    // Update minutes
    const { status: updateStatus, body: updated } = await api(page, 'PUT', `/api/projects/${id}/meetings/${meetingId}`, {
      minutes_body: 'Agreed on timeline.',
    });
    expect(updateStatus).toBe(200);
    expect((updated as { data: { minutes_body: string } }).data.minutes_body).toBe('Agreed on timeline.');

    // Delete
    const { status: deleteStatus } = await api(page, 'DELETE', `/api/projects/${id}/meetings/${meetingId}`);
    expect(deleteStatus).toBe(204);

    // Confirm gone
    const { status: goneStatus } = await api(page, 'GET', `/api/projects/${id}/meetings/${meetingId}`);
    expect(goneStatus).toBe(404);
  });

  test('meeting list response includes action_items_open and action_items_closed counts', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/meetings`, {
      title: 'Count test',
      date_time: '2026-08-02T09:00:00Z',
    });
    const meetingId = (created as { data: { id: number } }).data.id;

    const pmPersonId = await getProjectManagerPersonId(page, id);

    await api(page, 'POST', `/api/projects/${id}/meetings/${meetingId}/action-items`, {
      description: 'Item 1', owner_id: pmPersonId,
    });
    await api(page, 'POST', `/api/projects/${id}/meetings/${meetingId}/action-items`, {
      description: 'Item 2', owner_id: pmPersonId, status: 'closed',
    });

    const { body: listBody } = await api(page, 'GET', `/api/projects/${id}/meetings`);
    const meeting = (listBody as { data: Array<{ id: number; action_items_open: number; action_items_closed: number }> })
      .data.find(m => m.id === meetingId);

    expect(meeting?.action_items_open).toBe(1);
    expect(meeting?.action_items_closed).toBe(1);
  });

  test('show response includes full action_items array, no counts', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/meetings`, {
      title: 'Detail test',
      date_time: '2026-08-03T09:00:00Z',
    });
    const meetingId = (created as { data: { id: number } }).data.id;
    const pmPersonId = await getProjectManagerPersonId(page, id);

    await api(page, 'POST', `/api/projects/${id}/meetings/${meetingId}/action-items`, {
      description: 'Action item A', owner_id: pmPersonId,
    });

    const { body: shown } = await api(page, 'GET', `/api/projects/${id}/meetings/${meetingId}`);
    const data = (shown as { data: { action_items: Array<{ description: string }>; action_items_open?: number } }).data;

    expect(data.action_items).toHaveLength(1);
    expect(data.action_items[0].description).toBe('Action item A');
    // Counts are NOT present on show response (only via withCount on index)
    expect(data.action_items_open).toBeUndefined();
  });
});

// ─── Action items — owner_id required ────────────────────────────────────────

test.describe('action items validation', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('creating an action item without owner_id returns 422', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/meetings`, {
      title: 'Validation test', date_time: '2026-08-04T09:00:00Z',
    });
    const meetingId = (created as { data: { id: number } }).data.id;

    const { status } = await api(page, 'POST', `/api/projects/${id}/meetings/${meetingId}/action-items`, {
      description: 'Missing owner',
      // owner_id intentionally omitted
    });
    expect(status).toBe(422);
  });

  test('creating an action item with non-member owner_id returns 422', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);

    const { body: created } = await api(page, 'POST', `/api/projects/${id}/meetings`, {
      title: 'Non-member owner test', date_time: '2026-08-05T09:00:00Z',
    });
    const meetingId = (created as { data: { id: number } }).data.id;

    const { status } = await api(page, 'POST', `/api/projects/${id}/meetings/${meetingId}/action-items`, {
      description: 'Bad owner', owner_id: 999999,
    });
    expect(status).toBe(422);
  });
});

// ─── Access control ───────────────────────────────────────────────────────────

test.describe('meetings API — project_assurance (meetings:read, no meetings:manage)', () => {
  test.use({ storageState: roleStateFile('project_assurance') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/meetings returns 200', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/meetings`);
    expect(status).toBe(200);
  });

  test('POST /api/projects/:id/meetings returns 403 (no meetings:manage)', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'POST', `/api/projects/${id}/meetings`, {
      title: 'Forbidden', date_time: '2026-08-01T10:00:00Z',
    });
    expect(status).toBe(403);
  });
});

test.describe('meetings API — observer (no meetings:read)', () => {
  test.use({ storageState: roleStateFile('observer') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/meetings returns 403 for observer (lacks meetings:read)', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/meetings`);
    expect(status).toBe(403);
  });
});

test.describe('meetings API — non_member (no access)', () => {
  test.use({ storageState: roleStateFile('non_member') });

  test.beforeEach(async () => { await resetDb(); });

  test('GET /api/projects/:id/meetings returns 403 for non_member', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const { status } = await api(page, 'GET', `/api/projects/${id}/meetings`);
    expect(status).toBe(403);
  });
});
