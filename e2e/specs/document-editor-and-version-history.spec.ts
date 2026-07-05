import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect, type Page } from '@playwright/test';
import { resetDb } from '../helpers/reset';
import { roleStateFile } from '../helpers/roles';

const BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';

// A real, minimal valid .docx (proper OOXML zip) — the backend validates actual
// file content for office-document uploads, not just the declared extension/mimeType,
// so a plain fake buffer named "*.docx" gets rejected with a 422.
const MINIMAL_DOCX = readFileSync(join(__dirname, '..', 'fixtures', 'minimal.docx'));

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

async function uploadVersion(
  page: Page,
  projectId: number,
  docId: number,
  fileName: string,
  comment?: string,
): Promise<void> {
  const token = await getAccessToken(page);
  const res = await page.request.fetch(`${BACKEND}/api/projects/${projectId}/documents/${docId}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    multipart: {
      file: {
        name: fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: MINIMAL_DOCX,
      },
      ...(comment ? { comment } : {}),
    },
  });
  if (!res.ok()) {
    throw new Error(`upload failed: ${res.status()} ${await res.text()}`);
  }
}

async function openDocument(page: Page, projectId: number, docId: number): Promise<void> {
  await page.goto(`/p/${projectId}/documents/${docId}`);
  await expect(page.locator('.detail-pane')).toBeVisible();
}

test.describe('version history modal — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('View history opens the dialog listing every uploaded version', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Version History Doc');
    await uploadVersion(page, id, docId, 'v1.docx', 'First cut');
    await uploadVersion(page, id, docId, 'v2.docx', 'Second cut');

    await openDocument(page, id, docId);
    await page.getByRole('button', { name: /view history/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Version History')).toBeVisible();
    await expect(dialog.locator('.version-row')).toHaveCount(2);
    await expect(dialog.locator('.version-row').first()).toContainText('v2.docx');
    await expect(dialog.locator('.version-row').nth(1)).toContainText('v1.docx');
  });

  test('the current version is badged and cannot be reverted to itself', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Current Badge Doc');
    await uploadVersion(page, id, docId, 'only.docx');

    await openDocument(page, id, docId);
    await page.getByRole('button', { name: /view history/i }).click();

    const dialog = page.getByRole('dialog');
    const row = dialog.locator('.version-row').first();
    await expect(row).toHaveClass(/is-current/);
    await expect(row.locator('.badge-current')).toBeVisible();
    await expect(row.locator('button:has(mat-icon:has-text("restore"))')).toBeDisabled();
  });

  test('reverting an older version creates a new version and updates the list', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Revert Doc');
    await uploadVersion(page, id, docId, 'v1.docx');
    await uploadVersion(page, id, docId, 'v2.docx');

    await openDocument(page, id, docId);
    await page.getByRole('button', { name: /view history/i }).click();

    const dialog = page.getByRole('dialog');
    // v1 is the older, revertible row (second in the list, newest first).
    const olderRow = dialog.locator('.version-row').nth(1);
    await olderRow.locator('button:has(mat-icon:has-text("restore"))').click();

    const confirmDialog = page.getByRole('dialog').filter({ hasText: 'Revert to v1?' });
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Revert' }).click();

    await expect(dialog.locator('.version-row')).toHaveCount(3);
    await expect(dialog.locator('.version-row').first()).toContainText('v1.docx');
    await expect(dialog.locator('.version-row').first()).toHaveClass(/is-current/);
  });

  test('closing the dialog returns to the document detail panel', async ({ page }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Close Dialog Doc');
    await uploadVersion(page, id, docId, 'v1.docx');

    await openDocument(page, id, docId);
    await page.getByRole('button', { name: /view history/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.locator('.detail-pane')).toBeVisible();
  });
});

// ─── OnlyOffice editor tab ────────────────────────────────────────────────────
//
// The editor opens in a new browser tab pointed at /editor/:projectId/documents/:docId
// (document-editor-page.component.ts). That page loads a real OnlyOffice DocsAPI
// script from a hardcoded http://localhost:10112 — in this Docker Compose setup the
// Playwright container and the OnlyOffice container sit on separate networks, so the
// script can never actually load here (it does on a real dev machine, where "localhost"
// is the developer's own host). These tests verify what's reachable in this
// environment: that the correct tab/URL opens and that the resulting
// script-load failure is surfaced through the real error UI, not just mocked in
// the unit spec.

test.describe('OnlyOffice editor tab — project_manager', () => {
  test.use({ storageState: roleStateFile('project_manager') });

  test.beforeEach(async () => { await resetDb(); });

  test('Open in editor opens a new tab at the correct editor URL', async ({ page, context }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Editor Doc');
    await uploadVersion(page, id, docId, 'editor.docx');

    await openDocument(page, id, docId);

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('.detail-pane button:has(mat-icon:has-text("edit"))').click(),
    ]);
    await popup.waitForLoadState();

    expect(popup.url()).toContain(`/editor/${id}/documents/${docId}`);
    await popup.close();
  });

  test('surfaces a clear error when the OnlyOffice script cannot be reached', async ({ page, context }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E Editor Error Doc');
    await uploadVersion(page, id, docId, 'editor.docx');

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      (async () => {
        await openDocument(page, id, docId);
        await page.locator('.detail-pane button:has(mat-icon:has-text("edit"))').click();
      })(),
    ]);

    await expect(popup.getByText('Failed to load document editor. Is OnlyOffice running?'))
      .toBeVisible({ timeout: 15_000 });
    await expect(popup.getByRole('button', { name: 'Close' })).toBeVisible();
    await popup.close();
  });

  test('view-only mode from version history opens the editor URL with view params', async ({ page, context }) => {
    await page.goto('/projects');
    const id = await getTestProjectId(page);
    const docId = await createDocument(page, id, 'E2E View Version Doc');
    await uploadVersion(page, id, docId, 'v1.docx');
    await uploadVersion(page, id, docId, 'v2.docx');

    await openDocument(page, id, docId);
    await page.getByRole('button', { name: /view history/i }).click();

    const dialog = page.getByRole('dialog');
    const olderRow = dialog.locator('.version-row').nth(1);

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      olderRow.locator('button:has(mat-icon:has-text("visibility"))').click(),
    ]);
    await popup.waitForLoadState();

    expect(popup.url()).toContain(`/editor/${id}/documents/${docId}`);
    expect(popup.url()).toContain('view=1');
    expect(popup.url()).toContain('versionId=');
    await popup.close();
  });
});
