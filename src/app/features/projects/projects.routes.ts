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
      {
        path: 'daily-log',
        loadComponent: () =>
          import('../daily-log/pages/daily-log/daily-log.component').then(m => m.DailyLogComponent),
        title: 'Daily Log',
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('../issues/pages/issue-list/issue-list.component').then(m => m.IssueListComponent),
        title: 'Issue Log',
      },
      {
        path: 'issues/:issueId',
        loadComponent: () =>
          import('../issues/pages/issue-detail/issue-detail.component').then(m => m.IssueDetailComponent),
        title: 'Issue',
      },
      {
        path: 'risks',
        loadComponent: () =>
          import('../risks/pages/risk-list/risk-list.component').then(m => m.RiskListComponent),
        title: 'Risk Log',
      },
      {
        path: 'risks/:riskId',
        loadComponent: () =>
          import('../risks/pages/risk-detail/risk-detail.component').then(m => m.RiskDetailComponent),
        title: 'Risk',
      },
      {
        path: 'changes',
        loadComponent: () =>
          import('../changes/pages/change-list/change-list.component').then(m => m.ChangeListComponent),
        title: 'Change Log',
      },
      {
        path: 'changes/:changeId',
        loadComponent: () =>
          import('../changes/pages/change-detail/change-detail.component').then(m => m.ChangeDetailComponent),
        title: 'Change',
      },
      {
        path: 'quality-register',
        loadComponent: () =>
          import('../quality-register/pages/quality-list/quality-list.component').then(m => m.QualityListComponent),
        title: 'Quality Register',
      },
      {
        path: 'quality-register/:entryId',
        loadComponent: () =>
          import('../quality-register/pages/quality-detail/quality-detail.component').then(m => m.QualityDetailComponent),
        title: 'Quality Entry',
      },
      {
        path: 'lessons',
        loadComponent: () =>
          import('../lessons/pages/lesson-list/lesson-list.component').then(m => m.LessonListComponent),
        title: 'Lessons Log',
      },
      {
        path: 'lessons/:lessonId',
        loadComponent: () =>
          import('../lessons/pages/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent),
        title: 'Lesson',
      },
      {
        path: 'stages/:stageId/boundaries/:boundaryId',
        loadComponent: () =>
          import('../boundaries/pages/boundary-detail/boundary-detail.component').then(m => m.BoundaryDetailComponent),
        title: 'Boundary',
      },
      // Future: audit
    ],
  },
];
