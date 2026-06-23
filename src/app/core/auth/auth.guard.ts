import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthStore } from './auth.store';
import { environment } from '../../../environments/environment';

const buildLoginUrl = () =>
  `${environment.authFrontendUrl}/login?appName=${environment.appName}&appUrl=${encodeURIComponent(environment.appUrl)}`;

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);

  if (!authStore.accessToken()) {
    authStore.loadFromStorage();
  }

  if (!authStore.accessToken()) {
    window.location.href = buildLoginUrl();
    return false;
  }

  return authStore.validateAccessToken().pipe(
    map(isValid => {
      if (isValid) return true;
      authStore.resetToken();
      window.location.href = buildLoginUrl();
      return false;
    }),
    catchError(() => {
      authStore.resetToken();
      window.location.href = buildLoginUrl();
      return of(false);
    })
  );
};
