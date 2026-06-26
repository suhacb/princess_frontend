import {
  addDays,
  barLayout,
  computeHeaderTicks,
  computeRangeEnd,
  computeRangeStart,
  daysBetween,
  toIso,
  type TimelineRow,
} from './timeline.contracts';

describe('toIso', () => {
  it('returns YYYY-MM-DD', () => {
    expect(toIso(new Date('2025-03-15'))).toBe('2025-03-15');
  });
});

describe('daysBetween', () => {
  it('returns positive delta', () => expect(daysBetween('2025-01-01', '2025-01-11')).toBe(10));
  it('returns zero for same day', () => expect(daysBetween('2025-06-01', '2025-06-01')).toBe(0));
  it('returns negative when to < from', () => expect(daysBetween('2025-06-10', '2025-06-01')).toBeLessThan(0));
});

describe('addDays', () => {
  it('adds positive days', () => expect(addDays('2025-01-01', 10)).toBe('2025-01-11'));
  it('adds negative days', () => expect(addDays('2025-01-11', -10)).toBe('2025-01-01'));
});

// ─── Range helpers ────────────────────────────────────────────────────────────

const makeRow = (overrides: Partial<TimelineRow> = {}): TimelineRow => ({
  type: 'stage',
  id: 1,
  label: 'S1',
  stageId: 1,
  plannedStart: '2025-03-01',
  plannedEnd: '2025-06-30',
  actualStart: null,
  actualEnd: null,
  status: 'planned',
  timeVarianceDays: null,
  toleranceTime: null,
  toleranceBreached: false,
  ...overrides,
});

describe('computeRangeStart', () => {
  it('picks the earliest planned start', () => {
    const rows = [
      makeRow({ plannedStart: '2025-03-01' }),
      makeRow({ id: 2, plannedStart: '2025-01-15' }),
    ];
    expect(computeRangeStart(rows)).toEqual(new Date('2025-01-15'));
  });

  it('falls back to actual_start when planned_start null', () => {
    const rows = [makeRow({ plannedStart: null, actualStart: '2025-04-01' })];
    expect(computeRangeStart(rows)).toEqual(new Date('2025-04-01'));
  });

  it('returns first of current month for empty array', () => {
    const d = computeRangeStart([]);
    expect(d.getDate()).toBe(1);
  });
});

describe('computeRangeEnd', () => {
  it('picks the latest planned end', () => {
    const rows = [
      makeRow({ plannedEnd: '2025-06-30' }),
      makeRow({ id: 2, plannedEnd: '2025-09-15' }),
    ];
    const start = new Date('2025-01-01');
    expect(computeRangeEnd(rows, start).toISOString().slice(0, 10)).toBe('2025-09-15');
  });

  it('ensures at least 3 months from start', () => {
    const rows = [makeRow({ plannedEnd: '2025-02-01' })];
    const start = new Date('2025-01-01');
    const end = computeRangeEnd(rows, start);
    expect(end >= new Date('2025-04-01')).toBe(true);
  });
});

// ─── barLayout ────────────────────────────────────────────────────────────────

describe('barLayout', () => {
  const rangeStart = '2025-01-01';
  const totalDays = 100;
  const today = '2025-04-11'; // day 100

  it('returns null when start is null', () => {
    expect(barLayout(null, '2025-02-01', rangeStart, totalDays, today)).toBeNull();
  });

  it('returns correct left% and width%', () => {
    // start at day 10, end at day 20 → left=10%, width=10%
    const bar = barLayout('2025-01-11', '2025-01-21', rangeStart, totalDays, today);
    expect(bar).not.toBeNull();
    expect(bar!.left).toBeCloseTo(10, 0);
    expect(bar!.width).toBeCloseTo(10, 0);
  });

  it('uses today as effective end when end is null', () => {
    const bar = barLayout('2025-01-01', null, rangeStart, totalDays, today);
    expect(bar).not.toBeNull();
    expect(bar!.width).toBeGreaterThan(0);
  });

  it('returns null when bar has no width', () => {
    // bar is entirely before range start
    const bar = barLayout('2024-12-01', '2024-12-31', rangeStart, totalDays, today);
    // left will be negative → clamped to 0, width might end up ≤ 0
    // If it renders nothing meaningful we expect null or 0 width
    if (bar) expect(bar.width).toBeLessThanOrEqual(0);
    else expect(bar).toBeNull();
  });
});

// ─── computeHeaderTicks ───────────────────────────────────────────────────────

describe('computeHeaderTicks', () => {
  it('returns weekly ticks', () => {
    const ticks = computeHeaderTicks('2025-01-01', 28, 'week');
    // Should have ~4-5 weekly ticks within 28 days
    expect(ticks.length).toBeGreaterThanOrEqual(4);
    ticks.forEach(t => {
      expect(t.left).toBeGreaterThanOrEqual(0);
      expect(t.left).toBeLessThanOrEqual(100);
    });
  });

  it('returns monthly ticks', () => {
    const ticks = computeHeaderTicks('2025-01-01', 180, 'month');
    // Jan-Jun = 6 months
    expect(ticks.length).toBeGreaterThanOrEqual(5);
    expect(ticks[0].label).toContain('Jan');
  });

  it('returns quarterly ticks', () => {
    const ticks = computeHeaderTicks('2025-01-01', 365, 'quarter');
    expect(ticks.length).toBeGreaterThanOrEqual(4);
    expect(ticks.some(t => t.label.startsWith('Q'))).toBe(true);
  });

  it('tick left values are ascending', () => {
    const ticks = computeHeaderTicks('2025-01-01', 180, 'month');
    for (let i = 1; i < ticks.length; i++) {
      expect(ticks[i].left).toBeGreaterThan(ticks[i - 1].left);
    }
  });
});
