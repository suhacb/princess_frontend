import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { DailyLogService } from '../../services/daily-log.service';
import { ProjectService } from '../../../projects/services/project.service';
import {
  DAILY_LOG_ENTRY_TYPES,
  DAILY_LOG_ENTRY_TYPE_LABELS,
  DailyLogEntry,
  DailyLogEntryType,
  DailyLogGroup,
  UpdateDailyLogEntryPayload,
} from '../../contracts/daily-log.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-daily-log',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './daily-log.component.html',
  styleUrl: './daily-log.component.scss',
})
export class DailyLogComponent {
  private readonly dailyLogService = inject(DailyLogService);
  private readonly projectService = inject(ProjectService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = this.dailyLogService.loading;
  protected readonly project = this.projectService.selectedProject;
  protected readonly entryTypes = DAILY_LOG_ENTRY_TYPES;
  protected readonly typeLabels = DAILY_LOG_ENTRY_TYPE_LABELS;

  protected readonly createError = signal<string | null>(null);
  protected readonly editingId = signal<number | null>(null);
  protected readonly editError = signal<string | null>(null);
  protected readonly pendingDeleteId = signal<number | null>(null);
  protected readonly deleteError = signal<string | null>(null);
  protected readonly showCreateForm = signal(false);

  protected readonly groups = computed<DailyLogGroup[]>(() => {
    const entries = this.dailyLogService.entries();
    const map = new Map<string, DailyLogEntry[]>();
    for (const entry of entries) {
      const group = map.get(entry.date) ?? [];
      group.push(entry);
      map.set(entry.date, group);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, entries]) => ({ date, entries }));
  });

  protected readonly createForm = this.fb.group({
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    entry_type: ['' as DailyLogEntryType, Validators.required],
    body: ['', Validators.required],
  });

  protected readonly editForm = this.fb.group({
    date: ['', Validators.required],
    entry_type: ['' as DailyLogEntryType, Validators.required],
    body: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        this.dailyLogService.list(project.id).subscribe();
      }
    });
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) return;
    const project = this.project();
    if (!project) return;

    const v = this.createForm.value;
    this.createError.set(null);
    this.dailyLogService.create(project.id, {
      date: v.date!,
      entry_type: v.entry_type as DailyLogEntryType,
      body: v.body!,
    }).subscribe({
      next: () => {
        this.createForm.reset({
          date: new Date().toISOString().slice(0, 10),
          entry_type: '' as DailyLogEntryType,
          body: '',
        });
        this.showCreateForm.set(false);
      },
      error: () => this.createError.set('Failed to create entry. Please try again.'),
    });
  }

  protected startEdit(entry: DailyLogEntry): void {
    this.editingId.set(entry.id);
    this.editError.set(null);
    this.pendingDeleteId.set(null);
    this.editForm.patchValue({
      date: entry.date,
      entry_type: entry.entryType,
      body: entry.body,
    });
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.editError.set(null);
  }

  protected submitEdit(entry: DailyLogEntry): void {
    if (this.editForm.invalid) return;
    const project = this.project();
    if (!project) return;

    const v = this.editForm.value;
    const payload: UpdateDailyLogEntryPayload = {
      date: v.date!,
      entry_type: v.entry_type as DailyLogEntryType,
      body: v.body!,
    };

    this.editError.set(null);
    this.dailyLogService.update(project.id, entry.id, payload).subscribe({
      next: () => this.editingId.set(null),
      error: () => this.editError.set('Save failed. Please try again.'),
    });
  }

  protected confirmDelete(entry: DailyLogEntry): void {
    const project = this.project();
    if (!project) return;
    this.deleteError.set(null);
    this.dailyLogService.remove(project.id, entry.id).subscribe({
      next: () => this.pendingDeleteId.set(null),
      error: () => this.deleteError.set('Delete failed. Please try again.'),
    });
  }
}
