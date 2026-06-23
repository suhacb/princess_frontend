import { decodeJwt } from './decode-jwt';

function b64url(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function makeToken(payload: Record<string, unknown>): string {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe('decodeJwt', () => {
  it('decodes a valid JWT and returns the payload', () => {
    const token = makeToken({ sub: 'u1', email: 'test@example.com', preferred_username: 'u1' });
    const payload = decodeJwt(token);
    expect(payload?.['email']).toBe('test@example.com');
    expect(payload?.['preferred_username']).toBe('u1');
  });

  it('decodes all standard Keycloak user fields', () => {
    const token = makeToken({
      preferred_username: 'jdoe',
      given_name: 'John',
      family_name: 'Doe',
      email: 'j@example.com',
    });
    const payload = decodeJwt(token);
    expect(payload?.['given_name']).toBe('John');
    expect(payload?.['family_name']).toBe('Doe');
  });

  it('returns null for a token that cannot be base64-decoded', () => {
    expect(decodeJwt('not.valid.token')).toBeNull();
  });

  it('returns null when the token has fewer than 3 segments', () => {
    expect(decodeJwt('onlyone')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeJwt('')).toBeNull();
  });

  it('returns null when payload segment is not valid JSON after decoding', () => {
    const badToken = `header.${btoa('not-json')}.sig`;
    expect(decodeJwt(badToken)).toBeNull();
  });
});
