import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { projectsRoutes } from './features/projects/projects.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
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
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      // Phase 8 — Dashboards
      // { path: 'dashboard', loadComponent: () => import('./features/dashboard/...') },

      // Phase 2 — PRINCE2 Project Structure
      { path: 'projects', children: projectsRoutes },

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
