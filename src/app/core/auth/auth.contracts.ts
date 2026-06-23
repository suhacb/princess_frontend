export interface AccessTokenApiResource {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  scope: string;
  id_token: string;
  not_before_policy: string;
  session_state: string;
}

export interface AccessToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  scope: string;
  idToken: string;
  notBeforePolicy: string;
  sessionState: string;
}

export function mapAccessToken(api: AccessTokenApiResource): AccessToken {
  return {
    accessToken: api.access_token,
    tokenType: api.token_type,
    expiresIn: api.expires_in,
    refreshToken: api.refresh_token,
    refreshExpiresIn: api.refresh_expires_in,
    scope: api.scope,
    idToken: api.id_token,
    notBeforePolicy: api.not_before_policy,
    sessionState: api.session_state,
  };
}
