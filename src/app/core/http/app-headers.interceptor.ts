import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStore } from '../auth/auth.store';

export const appHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const store = inject(AuthStore);
  const accessToken = store.accessToken();
  const refreshToken = store.refreshToken();

  const headers: Record<string, string> = {
    'X-Application-Name': environment.appName,
    'X-Client-Url': environment.appUrl,
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (refreshToken) headers['X-Refresh-Token'] = refreshToken;

  return next(req.clone({ setHeaders: headers }));
};
