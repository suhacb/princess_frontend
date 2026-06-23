import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '../../../core/auth/auth.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-callback',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-spinner diameter="48" />
    </div>
  `,
  styles: `
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: var(--mat-sys-surface);
    }
  `,
})
export class CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const accessToken = params['access_token'];

    if (!accessToken) {
      window.location.href = `${environment.authFrontendUrl}/login?appName=${environment.appName}&appUrl=${encodeURIComponent(environment.appUrl)}`;
      return;
    }

    this.authStore.setToken({
      accessToken: params['access_token'],
      tokenType: params['token_type'] ?? '',
      expiresIn: Number(params['expires_in']) || 0,
      refreshToken: params['refresh_token'] ?? '',
      refreshExpiresIn: Number(params['refresh_expires_in']) || 0,
      scope: params['scope'] ?? '',
      idToken: params['id_token'] ?? '',
      notBeforePolicy: params['not_before_policy'] ?? '',
      sessionState: params['session_state'] ?? '',
    });

    this.router.navigate(['/']);
  }
}
