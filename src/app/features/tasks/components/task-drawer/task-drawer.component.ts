import { Component, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin, of } from 'rxjs';
import { ApiService } from '../../../../core/http/api.service';
import { ApiResource } from '../../../../shared/contracts/api.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  ProjectMember,
  ProjectMemberApiResource,
  mapProjectMember,
} from '../../../work-packages/contracts/work-package.contracts';
import { StageApiResource } from '../../../stages/contracts/stage.contracts';
import { WorkPackageApiResource } from '../../../work-packages/contracts/work-package.contracts';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  Task,
  TaskHistoryEntry,
  TaskPriority,
  TaskStatus,
} from '../../contracts/task.contracts';
import { TaskService } from '../../services/task.service';

interface StageSummary { id: number; name: string; }
interface WpSummary    { id: number; title: string; }

@Component({
  selector: 'app-task-drawer',
  imports: [ReactiveFormsModule, SlicePipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, SkeletonComponent],
  templateUrl: './task-drawer.component.html',
  styleUrl: './task-drawer.component.scss',
})
export class TaskDrawerComponent implements OnInit {
  readonly projectId = input.required<number>();
  readonly task      = input<Task | null>(null);

  readonly saved  = output<void>();
  readonly closed = output<void>();

  private readonly fb          = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly api         = inject(ApiService);

  protected readonly saving      = signal(false);
  protected readonly loadingMeta = signal(true);
  protected readonly history     = signal<TaskHistoryEntry[]>([]);
  protected readonly historyLoading = signal(false);

  protected readonly members  = signal<ProjectMember[]>([]);
  protected readonly stages   = signal<StageSummary[]>([]);
  protected readonly wps      = signal<WpSummary[]>([]);

  protected readonly statuses   = TASK_STATUSES;
  protected readonly priorities = TASK_PRIORITIES;
  protected readonly statusLabels   = TASK_STATUS_LABELS;
  protected readonly priorityLabels = TASK_PRIORITY_LABELS;

  protected readonly isEdit = computed(() => this.task() !== null);
  protected readonly title  = computed(() => this.isEdit() ? 'Edit task' : 'New task');

  readonly form = this.fb.nonNullable.group({
    title:            ['', Validators.required],
    status:           ['todo' as TaskStatus, Validators.required],
    priority:         ['medium' as TaskPriority, Validators.required],
    description:      [''],
    assignee_id:      [null as number | null],
    due_date:         [''],
    stage_id:         [null as number | null],
    work_package_id:  [null as number | null],
  });

  constructor() {
    effect(() => {
      const t = this.task();
      if (t) {
        this.form.patchValue({
          title:           t.title,
          status:          t.status,
          priority:        t.priority,
          description:     t.description ?? '',
          assignee_id:     t.assigneeId,
          due_date:        t.dueDate ?? '',
          stage_id:        t.stageId,
          work_package_id: t.workPackageId,
        });
        this.loadHistory();
      } else {
        this.form.reset({ status: 'todo', priority: 'medium' });
        this.history.set([]);
      }
    });
  }

  ngOnInit(): void {
    const pid = this.projectId();
    forkJoin({
      members: this.api.get<ApiResource<ProjectMemberApiResource[]>>(`/projects/${pid}/members`),
      stages:  this.api.get<ApiResource<StageApiResource[]>>(`/projects/${pid}/stages`),
      wps:     this.api.get<ApiResource<WorkPackageApiResource[]>>(`/projects/${pid}/work-packages`),
    }).subscribe({
      next: ({ members, stages, wps }) => {
        this.members.set(members.data.map(mapProjectMember));
        this.stages.set(stages.data.map(s => ({ id: s.id, name: s.name })));
        this.wps.set(wps.data.map(w => ({ id: w.id, title: w.title })));
        this.loadingMeta.set(false);
      },
      error: () => this.loadingMeta.set(false),
    });
  }

  private loadHistory(): void {
    const t = this.task();
    if (!t) return;
    this.historyLoading.set(true);
    this.taskService.loadHistory(this.projectId(), t.id).subscribe({
      next: entries => {
        this.history.set(entries);
        this.historyLoading.set(false);
      },
      error: () => this.historyLoading.set(false),
    });
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const raw = this.form.getRawValue();
    const payload = {
      title:           raw.title,
      status:          raw.status,
      priority:        raw.priority,
      description:     raw.description || null,
      assignee_id:     raw.assignee_id,
      due_date:        raw.due_date || null,
      stage_id:        raw.stage_id,
      work_package_id: raw.work_package_id,
    };

    const t = this.task();
    const op$ = t
      ? this.taskService.update(this.projectId(), t.id, payload)
      : this.taskService.create(this.projectId(), payload);

    op$.subscribe({
      next:  () => { this.saving.set(false); this.saved.emit(); },
      error: () => this.saving.set(false),
    });
  }
}
