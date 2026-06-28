import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../../core/http/api.service';
import { ApiResource } from '../../../../shared/contracts/api.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  ProjectMember,
  ProjectMemberApiResource,
  mapProjectMember,
} from '../../../work-packages/contracts/work-package.contracts';
import {
  MEETING_ACTION_ITEM_STATUSES,
  Meeting,
  MeetingActionItem,
} from '../../contracts/meeting.contracts';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-detail',
  imports: [
    DatePipe, TitleCasePipe, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule,
    EmptyStateComponent, SkeletonComponent,
  ],
  templateUrl: './meeting-detail.component.html',
  styleUrl: './meeting-detail.component.scss',
})
export class MeetingDetailComponent implements OnInit {
  readonly projectId = input.required<number>();
  readonly meetingId = input.required<number>();

  private readonly meetingService = inject(MeetingService);
  private readonly api            = inject(ApiService);
  private readonly fb             = inject(FormBuilder);

  protected readonly meeting        = signal<Meeting | null>(null);
  protected readonly loading        = signal(true);
  protected readonly saving         = signal(false);
  protected readonly editingMinutes = signal(false);
  protected readonly addingItem     = signal(false);
  protected readonly savingItem     = signal(false);
  protected readonly editingItemId  = signal<number | null>(null);
  readonly members                  = signal<ProjectMember[]>([]);

  protected readonly actionItemStatuses = MEETING_ACTION_ITEM_STATUSES;

  readonly minutesForm = this.fb.nonNullable.group({
    minutes_body: [''],
  });

  readonly actionItemForm = this.fb.nonNullable.group({
    description: ['', Validators.required],
    owner_id:    [null as number | null, Validators.required],
    due_date:    [''],
    status:      ['open' as 'open' | 'closed'],
  });

  constructor() {
    effect(() => {
      const id = this.meetingId();
      if (id) this._load();
    });
  }

  ngOnInit(): void {
    this.api
      .get<ApiResource<ProjectMemberApiResource[]>>(`/projects/${this.projectId()}/members`)
      .subscribe({ next: res => this.members.set(res.data.map(mapProjectMember)) });
  }

  private _load(): void {
    this.loading.set(true);
    this.meetingService.show(this.projectId(), this.meetingId()).subscribe({
      next:  m => { this.meeting.set(m); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  protected startEditMinutes(): void {
    this.minutesForm.patchValue({ minutes_body: this.meeting()?.minutesBody ?? '' });
    this.editingMinutes.set(true);
  }

  protected cancelEditMinutes(): void {
    this.editingMinutes.set(false);
  }

  protected saveMinutes(): void {
    if (this.saving()) return;
    this.saving.set(true);
    const m = this.meeting();
    if (!m) return;
    this.meetingService.update(this.projectId(), m.id, {
      minutes_body: this.minutesForm.getRawValue().minutes_body || null,
    }).subscribe({
      next: updated => {
        this.meeting.set(updated);
        this.editingMinutes.set(false);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  protected startAddItem(): void {
    this.actionItemForm.reset({ status: 'open', owner_id: null });
    this.editingItemId.set(null);
    this.addingItem.set(true);
  }

  protected startEditItem(item: MeetingActionItem): void {
    this.actionItemForm.patchValue({
      description: item.description,
      owner_id:    item.ownerId,
      due_date:    item.dueDate ?? '',
      status:      item.status,
    });
    this.editingItemId.set(item.id);
    this.addingItem.set(true);
  }

  protected cancelItem(): void {
    this.addingItem.set(false);
    this.editingItemId.set(null);
  }

  protected submitItem(): void {
    if (this.actionItemForm.invalid || this.savingItem()) return;
    const m = this.meeting();
    if (!m) return;
    this.savingItem.set(true);

    const raw = this.actionItemForm.getRawValue();
    const editId = this.editingItemId();

    if (editId) {
      this.meetingService.updateActionItem(this.projectId(), m.id, editId, {
        description: raw.description,
        owner_id:    raw.owner_id ?? undefined,
        due_date:    raw.due_date || null,
        status:      raw.status,
      }).subscribe({
        next: () => { this.savingItem.set(false); this.cancelItem(); this._load(); },
        error: () => this.savingItem.set(false),
      });
    } else {
      this.meetingService.addActionItem(this.projectId(), m.id, {
        description: raw.description,
        owner_id:    raw.owner_id!,
        due_date:    raw.due_date || null,
        status:      raw.status,
      }).subscribe({
        next: () => { this.savingItem.set(false); this.cancelItem(); this._load(); },
        error: () => this.savingItem.set(false),
      });
    }
  }

  protected removeItem(item: MeetingActionItem): void {
    const m = this.meeting();
    if (!m) return;
    this.meetingService.removeActionItem(this.projectId(), m.id, item.id).subscribe({
      next: () => this._load(),
    });
  }

  protected toggleItemStatus(item: MeetingActionItem): void {
    const m = this.meeting();
    if (!m) return;
    this.meetingService.updateActionItem(this.projectId(), m.id, item.id, {
      status: item.status === 'open' ? 'closed' : 'open',
    }).subscribe({ next: () => this._load() });
  }
}
