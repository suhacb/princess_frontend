import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    // Auth callback — receives tokens from auth_frontend as query params
    // Logic implemented in FE-AUTH-01
    path: 'callback',
    loadComponent: () =>
      import('./features/auth/callback/callback.component').then(
        (m) => m.CallbackComponent
      ),
  },

  // ── Protected routes (authGuard added in FE-AUTH-01) ──────────────────────

  // Phase 8 — Dashboards
  // { path: 'dashboard', loadComponent: () => import('./features/dashboard/...') },

  // Phase 2 — PRINCE2 Project Structure
  // { path: 'projects', loadComponent: () => import('./features/projects/...') },

  // Phase 3 — Planning
  // { path: 'planning', loadComponent: () => import('./features/planning/...') },

  // Phase 4 — Logs
  // { path: 'logs', loadComponent: () => import('./features/logs/...') },

  // Phase 5 — Quality Assurance
  // { path: 'qa', loadComponent: () => import('./features/qa/...') },

  // Phase 6 — Documents & Search
  // { path: 'documents', loadComponent: () => import('./features/documents/...') },

  // Phase 9 — Reporting
  // { path: 'reports', loadComponent: () => import('./features/reports/...') },

  // Phase 7 — M365 + Settings
  // { path: 'settings', loadComponent: () => import('./features/settings/...') },

  { path: '**', redirectTo: '' },
];
