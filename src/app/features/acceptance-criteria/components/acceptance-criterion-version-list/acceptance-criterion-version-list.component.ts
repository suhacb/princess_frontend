import { Component, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AcceptanceCriterionService } from '../../services/acceptance-criterion.service';
import {
  AC_STATUS_LABELS,
  AC_DECISION_LABELS,
  AcceptanceCriterionVersion,
} from '../../contracts/acceptance-criterion.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

@Component({
  selector: 'app-acceptance-criterion-version-list',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatTooltipModule, SkeletonComponent],
  templateUrl: './acceptance-criterion-version-list.component.html',
  styleUrl: './acceptance-criterion-version-list.component.scss',
})
export class AcceptanceCriterionVersionListComponent {
  readonly projectId = input.required<number>();
  readonly criterionId = input.required<number>();

  private readonly acService = inject(AcceptanceCriterionService);

  private readonly _versions = signal<AcceptanceCriterionVersion[]>([]);
  private readonly _loading = signal(false);
  private readonly _currentPage = signal(1);
  private readonly _lastPage = signal(1);

  protected readonly versions = this._versions.asReadonly();
  protected readonly loading = this._loading.asReadonly();
  protected readonly currentPage = this._currentPage.asReadonly();
  protected readonly lastPage = this._lastPage.asReadonly();
  protected readonly error = signal<string | null>(null);

  protected readonly statusLabels = AC_STATUS_LABELS;
  protected readonly decisionLabels = AC_DECISION_LABELS;
  protected readonly relativeTime = relativeTime;

  constructor() {
    effect(() => {
      const criterionId = this.criterionId();
      const projectId = this.projectId();
      if (criterionId && projectId) {
        this._currentPage.set(1);
        this.load(projectId, criterionId, 1);
      }
    });
  }

  private load(projectId: number, criterionId: number, page: number): void {
    this._loading.set(true);
    this.error.set(null);
    this.acService.listVersions(projectId, criterionId, page).subscribe({
      next: result => {
        this._versions.set(result.versions);
        this._currentPage.set(result.currentPage);
        this._lastPage.set(result.lastPage);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
        this.error.set('Failed to load version history.');
      },
    });
  }

  protected goToPage(page: number): void {
    this.load(this.projectId(), this.criterionId(), page);
  }
}
