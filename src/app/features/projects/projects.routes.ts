import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/project-list/project-list.component').then(m => m.ProjectListComponent),
    title: 'Projects',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    title: 'Project',
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/project-overview/project-overview.component').then(m => m.ProjectOverviewComponent),
        title: 'Overview',
      },
      // FE-P2-02: stages
      // FE-P2-04: members
      // Future: audit
    ],
  },
];
