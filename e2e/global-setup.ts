import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { E2E_ROLES, type E2eRole } from './helpers/roles';

const E2E_BACKEND = process.env['E2E_BACKEND_URL'] ?? 'http://host.docker.internal:10105';
const E2E_TOKEN   = process.env['E2E_TOKEN'] ?? '';
const BASE_URL    = process.env['E2E_BASE_URL'] ?? 'http://localhost:4201';

function makeFakeJwt(role: E2eRole): string {
  const r = E2E_ROLES[role];
  const encode = (obj: object): string =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = encode({ alg: 'none', typ: 'JWT' });
  const payload = encode({
    sub:                  r.externalId,
    preferred_username:   r.username,
    given_name:           r.givenName,
    family_name:          r.familyName,
    email:                r.email,
    exp: 9_999_999_999,
    iat: Math.floor(Date.now() / 1000),
  });
  // alg:none — empty signature; decodeJwt only base64-decodes the payload
  return `${header}.${payload}.`;
}

function makeStorageState(jwt: string, origin: string): object {
  return {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          { name: 'access_token',       value: jwt },
          { name: 'refresh_token',      value: jwt },
          { name: 'token_type',         value: 'Bearer' },
          { name: 'expires_in',         value: '28800' },
          { name: 'refresh_expires_in', value: '28800' },
        ],
      },
    ],
  };
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

  // Write one storageState file per role. Each file contains a fake JWT whose
  // `sub` matches the role user's external_id so E2eAuth logs in the right user.
  const origin  = new URL(BASE_URL).origin;
  const authDir = join(__dirname, '.auth');
  mkdirSync(authDir, { recursive: true });

  for (const role of Object.keys(E2E_ROLES) as E2eRole[]) {
    const jwt   = makeFakeJwt(role);
    const state = makeStorageState(jwt, origin);
    writeFileSync(
      join(authDir, `${role}.json`),
      JSON.stringify(state, null, 2),
    );
  }

  console.log(`[e2e] DB reset complete. Auth states written for: ${Object.keys(E2E_ROLES).join(', ')}`);
}
