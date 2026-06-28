import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { Meeting } from '../../contracts/meeting.contracts';
import { MeetingService } from '../../services/meeting.service';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';
import { MeetingListComponent } from '../meeting-list/meeting-list.component';

@Component({
  selector: 'app-meeting-panel',
  imports: [
    MatButtonModule, MatIconModule,
    EmptyStateComponent,
    MeetingListComponent,
    MeetingDetailComponent,
    MeetingFormComponent,
  ],
  templateUrl: './meeting-panel.component.html',
  styleUrl: './meeting-panel.component.scss',
})
export class MeetingPanelComponent {
  readonly projectId = input.required<number>();

  private readonly meetingService = inject(MeetingService);

  protected readonly meetings        = this.meetingService.meetings;
  protected readonly loading         = this.meetingService.loading;
  protected readonly selectedMeeting = signal<Meeting | null>(null);
  protected readonly showForm        = signal(false);
  protected readonly editingMeeting  = signal<Meeting | null>(null);

  constructor() {
    effect(() => {
      this.meetingService.load(this.projectId()).subscribe();
    });
  }

  protected selectMeeting(m: Meeting): void {
    this.selectedMeeting.set(m);
    this.showForm.set(false);
  }

  protected openCreate(): void {
    this.editingMeeting.set(null);
    this.selectedMeeting.set(null);
    this.showForm.set(true);
  }

  protected openEdit(m: Meeting): void {
    this.editingMeeting.set(m);
    this.showForm.set(true);
  }

  protected onFormSaved(saved: Meeting): void {
    this.showForm.set(false);
    this.selectedMeeting.set(saved);
  }

  protected onFormCancelled(): void {
    this.showForm.set(false);
  }
}
