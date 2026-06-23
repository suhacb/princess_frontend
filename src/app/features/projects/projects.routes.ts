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
      {
        path: 'stages',
        loadComponent: () =>
          import('../stages/pages/stage-list/stage-list.component').then(m => m.StageListComponent),
        title: 'Stages',
      },
      {
        path: 'stages/:stageId',
        loadComponent: () =>
          import('../stages/pages/stage-detail/stage-detail.component').then(m => m.StageDetailComponent),
        title: 'Stage',
      },
      {
        path: 'members',
        loadComponent: () =>
          import('../members/pages/member-list/member-list.component').then(m => m.MemberListComponent),
        title: 'Members',
      },
      // Future: audit
    ],
  },
];
