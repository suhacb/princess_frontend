import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  AUDIT_ENTITY_LABELS,
  AUDIT_ENTITY_TYPES,
  AuditEntityType,
  AuditTrailFilters,
} from '../../contracts/audit-trail.contracts';
import { AuditTrailService } from '../../services/audit-trail.service';

@Component({
  selector: 'app-audit-trail-feed',
  imports: [
    DatePipe, MatButtonModule, MatIconModule, MatTooltipModule,
    EmptyStateComponent, SkeletonComponent,
  ],
  templateUrl: './audit-trail-feed.component.html',
  styleUrl: './audit-trail-feed.component.scss',
})
export class AuditTrailFeedComponent {
  readonly projectId = input.required<number>();

  private readonly auditService = inject(AuditTrailService);

  protected readonly entityTypes  = AUDIT_ENTITY_TYPES;
  protected readonly entityLabels = AUDIT_ENTITY_LABELS;

  readonly entityTypeFilter = signal<AuditEntityType | null>(null);
  readonly fromFilter       = signal<string | null>(null);
  readonly toFilter         = signal<string | null>(null);

  protected readonly entries     = this.auditService.entries;
  protected readonly loading     = this.auditService.loading;
  protected readonly meta        = this.auditService.meta;
  protected readonly canLoadMore = computed(() => {
    const m = this.meta();
    return m ? m.current_page < m.last_page : false;
  });

  private readonly _filters = computed<AuditTrailFilters>(() => ({
    entity_type: this.entityTypeFilter(),
    from: this.fromFilter(),
    to: this.toFilter(),
  }));

  constructor() {
    effect(() => {
      this.auditService.load(this.projectId(), this._filters()).subscribe();
    });
  }

  protected onEntityTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.entityTypeFilter.set(value ? value as AuditEntityType : null);
  }

  protected onFromChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.fromFilter.set(value || null);
  }

  protected onToChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.toFilter.set(value || null);
  }

  protected clearFilters(): void {
    this.entityTypeFilter.set(null);
    this.fromFilter.set(null);
    this.toFilter.set(null);
  }

  protected onLoadMore(): void {
    this.auditService.loadMore(this.projectId(), this._filters()).subscribe();
  }
}
