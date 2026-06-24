import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const E2E_BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';
const E2E_TOKEN   = process.env['E2E_TOKEN'] ?? '';
const BASE_URL    = process.env['E2E_BASE_URL'] ?? 'http://localhost:4201';

function makeFakeJwt(): string {
  const encode = (obj: object): string =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = encode({ alg: 'none', typ: 'JWT' });
  const payload = encode({
    sub: 'e2e-user-1',
    preferred_username: 'e2e_user',
    given_name: 'E2E',
    family_name: 'User',
    email: 'e2e@princess.test',
    exp: 9_999_999_999,
    iat: Math.floor(Date.now() / 1000),
  });
  // alg:none — empty signature, three-part structure required by decodeJwt
  return `${header}.${payload}.`;
}

export default async function globalSetup(): Promise<void> {
  // Full reset once before the suite: migrate:fresh + E2eSeeder
  const res = await fetch(`${E2E_BACKEND}/api/e2e/reset?full=true`, {
    method: 'POST',
    headers: { 'X-E2E-Token': E2E_TOKEN },
  });
  if (!res.ok) {
    throw new Error(`E2E DB reset failed: ${res.status} ${await res.text()}`);
  }

  // Write Playwright browser storage state. The fake JWT lets Angular's decodeJwt
  // read the user fields without any Keycloak interaction.
  const fakeJwt = makeFakeJwt();
  const origin  = new URL(BASE_URL).origin;
  const state = {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          { name: 'access_token',       value: fakeJwt },
          { name: 'refresh_token',      value: fakeJwt },
          { name: 'token_type',         value: 'Bearer' },
          { name: 'expires_in',         value: '28800' },
          { name: 'refresh_expires_in', value: '28800' },
        ],
      },
    ],
  };

  const authDir = join(__dirname, '.auth');
  mkdirSync(authDir, { recursive: true });
  writeFileSync(join(authDir, 'state.json'), JSON.stringify(state, null, 2));

  console.log('[e2e] DB reset complete. Auth state written.');
}
