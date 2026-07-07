// ─── Variance API response (GET /projects/{id}/stages/{id}/variance) ─────────

export interface VarianceWpApiResource {
  id: number;
  title: string;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  time_variance_days: number | null;
  tolerance_time: string | null;
  tolerance_breached: boolean;
}

export interface VariancePlanApiResource {
  id: number;
  name: string;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  time_variance_days: number | null;
  tolerance_time: string | null;
  tolerance_breached: boolean;
}

export interface VarianceResponseData {
  stage: { id: number; name: string } | null;
  plans: VariancePlanApiResource[];
  work_packages: VarianceWpApiResource[];
}

// ─── Stage resource (correct field names from real backend) ───────────────────

export interface TimelineStageApiResource {
  id: number;
  project_id: number;
  name: string;
  type: string;
  status: string;
  sequence: number;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
}

// ─── Timeline domain model ────────────────────────────────────────────────────

export type TimelineRowType = 'stage' | 'wp';
export type TimelineZoom = 'week' | 'month' | 'quarter';

export interface TimelineRow {
  type: TimelineRowType;
  id: number;
  label: string;
  stageId: number;
  plannedStart: string | null;
  plannedEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
  timeVarianceDays: number | null;
  toleranceTime: string | null;
  toleranceBreached: boolean;
}

export interface BarLayout {
  left: number;
  width: number;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round(
    (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 86_400_000,
  );
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return toIso(d);
}

export function computeRangeStart(rows: TimelineRow[]): Date {
  const dates = rows
    .map(r => r.plannedStart ?? r.actualStart)
    .filter((d): d is string => d !== null);
  if (!dates.length) {
    const d = new Date();
    d.setDate(1);
    return d;
  }
  return new Date(dates.reduce((a, b) => (a < b ? a : b)));
}

export function computeRangeEnd(rows: TimelineRow[], rangeStart: Date): Date {
  const dates = rows
    .map(r => r.plannedEnd ?? r.actualEnd)
    .filter((d): d is string => d !== null);
  if (!dates.length) {
    const end = new Date(rangeStart);
    end.setUTCMonth(end.getUTCMonth() + 6);
    return end;
  }
  const maxDate = new Date(dates.reduce((a, b) => (a > b ? a : b)));
  // Ensure at least 3 months visible. UTC arithmetic avoids losing an hour
  // across a DST boundary, which local setMonth() would do for a date parsed
  // from a UTC-midnight ISO string (e.g. Jan -> Apr crosses CET -> CEST).
  const minEnd = new Date(rangeStart);
  minEnd.setUTCMonth(minEnd.getUTCMonth() + 3);
  return maxDate > minEnd ? maxDate : minEnd;
}

export function barLayout(
  start: string | null,
  end: string | null,
  rangeStartIso: string,
  totalDays: number,
  todayIso: string,
): BarLayout | null {
  if (!start) return null;
  const effectiveEnd = end ?? todayIso;
  // Bar is entirely before the visible range
  if (effectiveEnd < rangeStartIso) return null;
  const leftDays = daysBetween(rangeStartIso, start);
  const widthDays = Math.max(1, daysBetween(start, effectiveEnd));
  const left = Math.max(0, (leftDays / totalDays) * 100);
  const width = Math.min(100 - left, (widthDays / totalDays) * 100);
  if (width <= 0) return null;
  return { left, width };
}

export interface HeaderTick {
  label: string;
  left: number;
}

export function computeHeaderTicks(
  rangeStartIso: string,
  totalDays: number,
  zoom: TimelineZoom,
): HeaderTick[] {
  const ticks: HeaderTick[] = [];
  const start = new Date(rangeStartIso);
  const end = new Date(rangeStartIso);
  end.setDate(end.getDate() + totalDays);

  const cur = new Date(start);

  if (zoom === 'week') {
    // Align to nearest Monday
    const dow = cur.getDay();
    cur.setDate(cur.getDate() - ((dow + 6) % 7));
    while (cur <= end) {
      const left = (daysBetween(rangeStartIso, toIso(cur)) / totalDays) * 100;
      if (left >= 0 && left <= 100) {
        ticks.push({
          label: cur.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          left,
        });
      }
      cur.setDate(cur.getDate() + 7);
    }
  } else if (zoom === 'month') {
    // First of each month
    cur.setDate(1);
    while (cur <= end) {
      const left = (daysBetween(rangeStartIso, toIso(cur)) / totalDays) * 100;
      if (left >= -2 && left <= 100) {
        ticks.push({
          label: cur.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
          left: Math.max(0, left),
        });
      }
      cur.setMonth(cur.getMonth() + 1);
    }
  } else {
    // Quarter: first of every 3rd month
    cur.setDate(1);
    cur.setMonth(Math.floor(cur.getMonth() / 3) * 3);
    while (cur <= end) {
      const left = (daysBetween(rangeStartIso, toIso(cur)) / totalDays) * 100;
      if (left >= -2 && left <= 100) {
        const q = Math.floor(cur.getMonth() / 3) + 1;
        ticks.push({
          label: `Q${q} ${cur.getFullYear()}`,
          left: Math.max(0, left),
        });
      }
      cur.setMonth(cur.getMonth() + 3);
    }
  }

  return ticks;
}
