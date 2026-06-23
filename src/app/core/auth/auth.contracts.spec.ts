import { mapAccessToken, AccessTokenApiResource } from './auth.contracts';

const apiResource: AccessTokenApiResource = {
  access_token: 'at',
  token_type: 'Bearer',
  expires_in: 300,
  refresh_token: 'rt',
  refresh_expires_in: 1800,
  scope: 'openid profile',
  id_token: 'it',
  not_before_policy: '0',
  session_state: 'ss',
};

describe('mapAccessToken', () => {
  it('maps all snake_case API fields to camelCase app fields', () => {
    const result = mapAccessToken(apiResource);
    expect(result.accessToken).toBe('at');
    expect(result.tokenType).toBe('Bearer');
    expect(result.expiresIn).toBe(300);
    expect(result.refreshToken).toBe('rt');
    expect(result.refreshExpiresIn).toBe(1800);
    expect(result.scope).toBe('openid profile');
    expect(result.idToken).toBe('it');
    expect(result.notBeforePolicy).toBe('0');
    expect(result.sessionState).toBe('ss');
  });

  it('maps empty string values without coercion', () => {
    const empty: AccessTokenApiResource = {
      access_token: '',
      token_type: '',
      expires_in: 0,
      refresh_token: '',
      refresh_expires_in: 0,
      scope: '',
      id_token: '',
      not_before_policy: '',
      session_state: '',
    };
    const result = mapAccessToken(empty);
    expect(result.accessToken).toBe('');
    expect(result.expiresIn).toBe(0);
  });
});
