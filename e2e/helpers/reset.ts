const E2E_BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';
const E2E_TOKEN   = process.env['E2E_TOKEN'] ?? '';

/**
 * Fast per-test reset: truncates all e2e DB tables and re-seeds via E2eSeeder.
 * Call in test.beforeEach for test isolation without the cost of migrate:fresh.
 */
export async function resetDb(): Promise<void> {
  const res = await fetch(`${E2E_BACKEND}/api/e2e/reset`, {
    method: 'POST',
    headers: { 'X-E2E-Token': E2E_TOKEN },
  });
  if (!res.ok) {
    throw new Error(`E2E DB reset failed: ${res.status} ${await res.text()}`);
  }
}
