import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { cockpitRoutes } from './features/cockpit/cockpit.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./features/auth/callback/callback.component').then(m => m.CallbackComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/cockpit/pages/portfolio/portfolio.component').then(m => m.PortfolioComponent),
        title: 'Projects',
      },
      {
        path: 'p',
        children: cockpitRoutes,
      },
    ],
  },

  {
    path: 'editor/:projectId/documents/:docId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/documents/pages/document-editor-page/document-editor-page.component')
        .then(m => m.DocumentEditorPageComponent),
    title: 'Document Editor',
  },

  { path: '**', redirectTo: '' },
];
