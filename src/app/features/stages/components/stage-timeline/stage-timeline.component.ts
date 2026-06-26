import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  BarLayout,
  HeaderTick,
  TimelineRow,
  TimelineZoom,
  barLayout,
  computeHeaderTicks,
  computeRangeEnd,
  computeRangeStart,
  daysBetween,
  toIso,
} from '../../contracts/timeline.contracts';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-stage-timeline',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, EmptyStateComponent, SkeletonComponent],
  templateUrl: './stage-timeline.component.html',
  styleUrl: './stage-timeline.component.scss',
})
export class StageTimelineComponent {
  readonly projectId = input.required<number>();

  protected readonly timelineService = inject(TimelineService);
  protected readonly rows = this.timelineService.rows;
  protected readonly loading = this.timelineService.loading;

  protected readonly zoom = signal<TimelineZoom>('month');

  // ─── Date range ──────────────────────────────────────────────────────────────

  protected readonly rangeStart = computed(() => computeRangeStart(this.rows()));
  protected readonly rangeEnd = computed(() => computeRangeEnd(this.rows(), this.rangeStart()));

  protected readonly rangeStartIso = computed(() => toIso(this.rangeStart()));
  protected readonly totalDays = computed(() =>
    Math.max(1, daysBetween(this.rangeStartIso(), toIso(this.rangeEnd()))),
  );

  protected readonly todayIso = toIso(new Date());

  protected readonly todayPct = computed(() => {
    const left = (daysBetween(this.rangeStartIso(), this.todayIso) / this.totalDays()) * 100;
    return Math.max(0, Math.min(100, left));
  });

  protected readonly todayVisible = computed(
    () => this.todayPct() > 0 && this.todayPct() < 100,
  );

  // ─── Header ticks ─────────────────────────────────────────────────────────────

  protected readonly headerTicks = computed<HeaderTick[]>(() =>
    computeHeaderTicks(this.rangeStartIso(), this.totalDays(), this.zoom()),
  );

  // ─── Bar layout helpers ───────────────────────────────────────────────────────

  protected plannedBar(row: TimelineRow): BarLayout | null {
    return barLayout(row.plannedStart, row.plannedEnd, this.rangeStartIso(), this.totalDays(), this.todayIso);
  }

  protected actualBar(row: TimelineRow): BarLayout | null {
    if (!row.actualStart) return null;
    return barLayout(row.actualStart, row.actualEnd, this.rangeStartIso(), this.totalDays(), this.todayIso);
  }

  protected actualBarClass(row: TimelineRow): string {
    if (row.toleranceBreached) return 'tl-bar--actual tl-bar--breach';
    if (row.actualEnd) return 'tl-bar--actual tl-bar--done';
    return 'tl-bar--actual tl-bar--progress';
  }

  protected tooltipText(row: TimelineRow): string {
    const parts: string[] = [row.label];
    if (row.plannedStart) parts.push(`Planned: ${row.plannedStart} → ${row.plannedEnd ?? '?'}`);
    if (row.actualStart) parts.push(`Actual: ${row.actualStart} → ${row.actualEnd ?? 'ongoing'}`);
    if (row.timeVarianceDays !== null) {
      const sign = row.timeVarianceDays > 0 ? '+' : '';
      parts.push(`Variance: ${sign}${row.timeVarianceDays}d`);
    }
    return parts.join('\n');
  }

  // ─── Variance table ───────────────────────────────────────────────────────────

  protected readonly wpRows = computed(() => this.rows().filter(r => r.type === 'wp'));

  protected plannedDays(row: TimelineRow): number | null {
    if (!row.plannedStart || !row.plannedEnd) return null;
    return daysBetween(row.plannedStart, row.plannedEnd);
  }

  protected actualDays(row: TimelineRow): number | null {
    if (!row.actualStart) return null;
    const end = row.actualEnd ?? this.todayIso;
    return daysBetween(row.actualStart, end);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────────

  constructor() {
    effect(() => {
      const pid = this.projectId();
      this.timelineService.load(pid).subscribe();
    });
  }
}
