import { DatePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { Meeting } from '../../contracts/meeting.contracts';

@Component({
  selector: 'app-meeting-list',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatTooltipModule, EmptyStateComponent, SkeletonComponent],
  templateUrl: './meeting-list.component.html',
  styleUrl: './meeting-list.component.scss',
})
export class MeetingListComponent {
  readonly meetings          = input.required<Meeting[]>();
  readonly loading           = input.required<boolean>();
  readonly selectedMeetingId = input<number | null>(null);

  readonly meetingSelected = output<Meeting>();
  readonly createClicked   = output<void>();

  readonly search = signal('');

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return q
      ? this.meetings().filter(m => m.title.toLowerCase().includes(q))
      : this.meetings();
  });
}
