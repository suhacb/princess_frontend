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
  {
    // Shell wrapper — all protected routes live here (authGuard added in FE-AUTH-01)
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      // Phase 8 — Dashboards
      // { path: 'dashboard', loadComponent: () => import('./features/dashboard/...') },

      // Phase 2 — PRINCE2 Project Structure
      // { path: 'projects', loadComponent: () => import('./features/projects/...') },

      // Phase 3 — Planning
      // { path: 'planning', ...children },

      // Phase 4 — Logs
      // { path: 'logs', ...children },

      // Phase 5 — Quality Assurance
      // { path: 'qa', ...children },

      // Phase 6 — Documents & Search
      // { path: 'documents', ...children },

      // Phase 9 — Reporting
      // { path: 'reports', ...children },

      // Phase 7 — M365 + Settings
      // { path: 'settings', loadComponent: () => import('./features/settings/...') },
    ],
  },

  { path: '**', redirectTo: '' },
];
