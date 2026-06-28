import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Meeting } from '../../contracts/meeting.contracts';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './meeting-form.component.html',
  styleUrl: './meeting-form.component.scss',
})
export class MeetingFormComponent {
  readonly projectId = input.required<number>();
  readonly meeting   = input<Meeting | null>(null);

  readonly saved     = output<Meeting>();
  readonly cancelled = output<void>();

  private readonly meetingService = inject(MeetingService);
  private readonly fb             = inject(FormBuilder);

  protected readonly saving  = signal(false);
  protected readonly isEdit  = computed(() => this.meeting() !== null);
  protected readonly title   = computed(() => this.isEdit() ? 'Edit meeting' : 'New meeting');

  readonly form = this.fb.nonNullable.group({
    title:     ['', Validators.required],
    date_time: ['', Validators.required],
    agenda:    [''],
  });

  constructor() {
    effect(() => {
      const m = this.meeting();
      if (m) {
        this.form.patchValue({
          title:     m.title,
          date_time: m.dateTime.slice(0, 16),
          agenda:    m.agenda ?? '',
        });
      } else {
        this.form.reset();
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const raw = this.form.getRawValue();
    const payload = {
      title:     raw.title,
      date_time: raw.date_time,
      agenda:    raw.agenda || null,
    };

    const m = this.meeting();
    const op$ = m
      ? this.meetingService.update(this.projectId(), m.id, payload)
      : this.meetingService.create(this.projectId(), payload);

    op$.subscribe({
      next:  saved => { this.saving.set(false); this.saved.emit(saved); },
      error: ()    => this.saving.set(false),
    });
  }
}
