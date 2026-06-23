import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { ProjectService } from '../../../projects/services/project.service';
import { IssueStatusChipComponent } from '../../components/issue-status-chip/issue-status-chip.component';
import { IssuePriorityChipComponent } from '../../components/issue-priority-chip/issue-priority-chip.component';
import {
  EscalateIssueDialogComponent,
  EscalateIssueDialogData,
} from '../../components/escalate-issue-dialog/escalate-issue-dialog.component';
import {
  ResolveIssueDialogComponent,
  ResolveIssueDialogData,
} from '../../components/resolve-issue-dialog/resolve-issue-dialog.component';
import {
  ISSUE_TYPES,
  ISSUE_TYPE_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUS_LABELS,
  EscalateIssuePayload,
  IssueType,
  IssuePriority,
  ResolveIssuePayload,
  UpdateIssuePayload,
  canEditIssue,
  canEscalate,
  canResolve,
} from '../../contracts/issue.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-issue-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    DatePipe,
    IssueStatusChipComponent,
    IssuePriorityChipComponent,
    SkeletonComponent,
  ],
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.scss',
})
export class IssueDetailComponent {
  readonly issueId = input<string>();

  private readonly issueService = inject(IssueService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly issue = this.issueService.selectedIssue;
  protected readonly project = this.projectService.selectedProject;
  protected readonly loading = this.issueService.loading;

  protected readonly types = ISSUE_TYPES;
  protected readonly typeLabels = ISSUE_TYPE_LABELS;
  protected readonly priorities = ISSUE_PRIORITIES;
  protected readonly priorityLabels = ISSUE_PRIORITY_LABELS;
  protected readonly statusLabels = ISSUE_STATUS_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly canEdit = computed(() => {
    const i = this.issue();
    return i ? canEditIssue(i.status) : false;
  });
  protected readonly canEscalate = computed(() => {
    const i = this.issue();
    return i ? canEscalate(i.status) : false;
  });
  protected readonly canResolve = computed(() => {
    const i = this.issue();
    return i ? canResolve(i.status) : false;
  });

  protected readonly form = this.fb.group({
    issue_type: ['' as IssueType],
    priority: ['' as IssuePriority],
    title: [''],
    description: [''],
  });

  constructor() {
    effect(() => {
      const id = this.issueId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.issueService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load issue.'),
        });
      }
    });

    effect(() => {
      const i = this.issue();
      if (i) {
        this.form.patchValue({
          issue_type: i.issueType,
          priority: i.priority,
          title: i.title,
          description: i.description ?? '',
        });
        if (!canEditIssue(i.status)) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/projects', project.id, 'issues']);
  }

  protected save(): void {
    const i = this.issue();
    const project = this.project();
    if (!i || !project) return;

    const v = this.form.value;
    const payload: UpdateIssuePayload = {
      issue_type: v.issue_type as IssueType,
      priority: v.priority as IssuePriority,
      title: v.title!,
      description: v.description || null,
    };
    this.saveError.set(null);
    this.issueService.update(project.id, i.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected openEscalateDialog(): void {
    const i = this.issue();
    const project = this.project();
    if (!i || !project) return;

    const data: EscalateIssueDialogData = { issueTitle: i.title };
    this.dialog
      .open(EscalateIssueDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((payload: EscalateIssuePayload | undefined) => {
        if (!payload) return;
        this.actionError.set(null);
        this.issueService.escalate(project.id, i.id, payload).subscribe({
          error: () => this.actionError.set('Escalation failed. Please try again.'),
        });
      });
  }

  protected openResolveDialog(): void {
    const i = this.issue();
    const project = this.project();
    if (!i || !project) return;

    const data: ResolveIssueDialogData = { issueTitle: i.title };
    this.dialog
      .open(ResolveIssueDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((payload: ResolveIssuePayload | undefined) => {
        if (!payload) return;
        this.actionError.set(null);
        this.issueService.resolve(project.id, i.id, payload).subscribe({
          error: () => this.actionError.set('Resolution failed. Please try again.'),
        });
      });
  }

  protected deleteIssue(): void {
    const i = this.issue();
    const project = this.project();
    if (!i || !project) return;
    this.issueService.remove(project.id, i.id).subscribe({
      next: () => this.goBack(),
      error: () => this.actionError.set('Delete failed. Please try again.'),
    });
  }
}
