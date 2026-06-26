import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { ProjectService } from '../../../projects/services/project.service';
import { IssueStatusChipComponent } from '../../components/issue-status-chip/issue-status-chip.component';
import { IssuePriorityChipComponent } from '../../components/issue-priority-chip/issue-priority-chip.component';
import { CreateIssueDialogComponent } from '../../components/create-issue-dialog/create-issue-dialog.component';
import {
  CreateIssuePayload,
  Issue,
  IssueType,
  ISSUE_TYPE_LABELS,
  PRIORITY_ORDER,
} from '../../contracts/issue.contracts';
import { BadgeComponent, BadgeTone } from '../../../../shared/components/badge/badge.component';

const ISSUE_TYPE_TONES: Record<IssueType, BadgeTone> = {
  problem:  'danger',
  concern:  'warning',
  rfc:      'primary',
  off_spec: 'tertiary',
};
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

type SortKey = 'priority' | 'raised_at';

@Component({
  selector: 'app-issue-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DatePipe,
    BadgeComponent,
    IssueStatusChipComponent,
    IssuePriorityChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss',
})
export class IssueListComponent {
  private readonly issueService = inject(IssueService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.issueService.loading;
  protected readonly typeLabels = ISSUE_TYPE_LABELS;
  protected readonly typeTone = (type: IssueType): BadgeTone => ISSUE_TYPE_TONES[type];

  protected readonly sortKey = signal<SortKey>('priority');

  protected readonly sortedIssues = computed<Issue[]>(() => {
    const issues = this.issueService.issues();
    const key = this.sortKey();
    return [...issues].sort((a, b) => {
      if (key === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return (b.raisedAt ?? '').localeCompare(a.raisedAt ?? '');
    });
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) this.issueService.list(project.id).subscribe();
    });
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateIssueDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((payload: CreateIssuePayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.issueService.create(project.id, payload).subscribe({
          next: issue => this.navigateToIssue(issue.id),
        });
      });
  }

  protected navigateToIssue(issueId: number): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'issues', issueId]);
  }
}
