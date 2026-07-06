import { Component, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RequirementService } from '../../services/requirement.service';
import {
  REQUIREMENT_PRIORITY_LABELS,
  REQUIREMENT_STATUS_LABELS,
  RequirementVersion,
} from '../../contracts/requirement.contracts';
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
  selector: 'app-requirement-version-list',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatTooltipModule, SkeletonComponent],
  templateUrl: './requirement-version-list.component.html',
  styleUrl: './requirement-version-list.component.scss',
})
export class RequirementVersionListComponent {
  readonly projectId = input.required<number>();
  readonly requirementId = input.required<number>();

  private readonly requirementService = inject(RequirementService);

  private readonly _versions = signal<RequirementVersion[]>([]);
  private readonly _loading = signal(false);
  private readonly _currentPage = signal(1);
  private readonly _lastPage = signal(1);

  protected readonly versions = this._versions.asReadonly();
  protected readonly loading = this._loading.asReadonly();
  protected readonly currentPage = this._currentPage.asReadonly();
  protected readonly lastPage = this._lastPage.asReadonly();
  protected readonly error = signal<string | null>(null);

  protected readonly statusLabels = REQUIREMENT_STATUS_LABELS;
  protected readonly priorityLabels = REQUIREMENT_PRIORITY_LABELS;
  protected readonly relativeTime = relativeTime;

  constructor() {
    effect(() => {
      const requirementId = this.requirementId();
      const projectId = this.projectId();
      if (requirementId && projectId) {
        this._currentPage.set(1);
        this.load(projectId, requirementId, 1);
      }
    });
  }

  private load(projectId: number, requirementId: number, page: number): void {
    this._loading.set(true);
    this.error.set(null);
    this.requirementService.listVersions(projectId, requirementId, page).subscribe({
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
    this.load(this.projectId(), this.requirementId(), page);
  }
}
