import { Routes } from '@angular/router';
import { projectContextGuard } from '../../core/guards/project-context.guard';

export const cockpitRoutes: Routes = [
  {
    path: ':id',
    canActivate: [projectContextGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/project-home/project-home.component').then(m => m.ProjectHomeComponent),
        title: 'Project Home',
      },
      {
        path: 'plan',
        loadComponent: () =>
          import('./pages/plan/plan.component').then(m => m.PlanComponent),
        title: 'Plan & Stages',
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
        path: 'stages/:stageId/boundaries/:boundaryId',
        loadComponent: () =>
          import('../boundaries/pages/boundary-detail/boundary-detail.component').then(m => m.BoundaryDetailComponent),
        title: 'Boundary',
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
        path: 'requirements',
        loadComponent: () =>
          import('../requirements/pages/requirement-list/requirement-list.component').then(m => m.RequirementListComponent),
        title: 'Requirements',
      },
      {
        path: 'requirements/:requirementId',
        loadComponent: () =>
          import('../requirements/pages/requirement-detail/requirement-detail.component').then(m => m.RequirementDetailComponent),
        title: 'Requirement',
      },
      {
        path: 'acceptance-criteria',
        loadComponent: () =>
          import('../acceptance-criteria/pages/acceptance-criterion-list/acceptance-criterion-list.component').then(m => m.AcceptanceCriterionListComponent),
        title: 'Acceptance Criteria',
      },
      {
        path: 'test-scenarios',
        loadComponent: () =>
          import('../test-scenarios/pages/test-scenario-list/test-scenario-list.component').then(m => m.TestScenarioListComponent),
        title: 'Test Scenarios',
      },
      {
        path: 'quality',
        loadComponent: () =>
          import('../quality-register/pages/quality-list/quality-list.component').then(m => m.QualityListComponent),
        title: 'Quality Register',
      },
      {
        path: 'quality/:entryId',
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
        path: 'documents',
        loadComponent: () =>
          import('../documents/pages/documents-page/documents-page.component').then(m => m.DocumentsPageComponent),
        title: 'Document Library',
      },
      {
        path: 'documents/review-queue',
        loadComponent: () =>
          import('../documents/pages/classification-queue-page/classification-queue-page.component').then(m => m.ClassificationQueuePageComponent),
        title: 'Classification Review Queue',
      },
      {
        path: 'documents/templates',
        loadComponent: () =>
          import('../documents/pages/templates-page/templates-page.component').then(m => m.TemplatesPageComponent),
        title: 'Document Templates',
      },
      {
        path: 'documents/:docId',
        loadComponent: () =>
          import('../documents/pages/documents-page/documents-page.component').then(m => m.DocumentsPageComponent),
        title: 'Document Library',
      },
      {
        path: 'reports/highlight',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        title: 'Highlight Reports',
        data: { icon: 'summarize', label: 'Highlight Reports', message: 'Highlight reporting coming soon.' },
      },
      {
        path: 'reports/exceptions',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        title: 'Exception Reports',
        data: { icon: 'report_problem', label: 'Exception Reports', message: 'Exception reporting coming soon.' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent),
        title: 'Project Settings',
        data: { icon: 'settings', label: 'Project settings', message: 'Project configurator not yet designed.' },
      },
    ],
  },
];
