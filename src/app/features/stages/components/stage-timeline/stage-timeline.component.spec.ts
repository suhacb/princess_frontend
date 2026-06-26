import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StageTimelineComponent } from './stage-timeline.component';
import { TimelineService } from '../../services/timeline.service';
import { of } from 'rxjs';
import type { TimelineRow } from '../../contracts/timeline.contracts';

const makeStageRow = (overrides: Partial<TimelineRow> = {}): TimelineRow => ({
  type: 'stage',
  id: 1,
  label: 'Initiation',
  stageId: 1,
  plannedStart: '2025-01-01',
  plannedEnd: '2025-03-31',
  actualStart: '2025-01-05',
  actualEnd: null,
  status: 'active',
  timeVarianceDays: null,
  toleranceTime: null,
  toleranceBreached: false,
  ...overrides,
});

const makeWpRow = (overrides: Partial<TimelineRow> = {}): TimelineRow => ({
  type: 'wp',
  id: 101,
  label: 'WP-Alpha',
  stageId: 1,
  plannedStart: '2025-01-10',
  plannedEnd: '2025-02-10',
  actualStart: '2025-01-12',
  actualEnd: null,
  status: 'active',
  timeVarianceDays: 5,
  toleranceTime: '10d',
  toleranceBreached: false,
  ...overrides,
});

function setup(rows: TimelineRow[] = [], loading = false) {
  const _rows = signal(rows);
  const _loading = signal(loading);

  const timelineService = {
    rows: _rows.asReadonly(),
    loading: _loading.asReadonly(),
    load: vi.fn().mockReturnValue(of(undefined)),
  };

  TestBed.configureTestingModule({
    imports: [StageTimelineComponent, BrowserAnimationsModule],
    providers: [{ provide: TimelineService, useValue: timelineService }],
  });

  const fixture = TestBed.createComponent(StageTimelineComponent);
  fixture.componentRef.setInput('projectId', 10);
  fixture.detectChanges();

  return { fixture, timelineService, _rows, _loading };
}

afterEach(() => TestBed.resetTestingModule());

describe('StageTimelineComponent', () => {
  describe('empty state', () => {
    it('renders empty-state when rows=[] and not loading', () => {
      const { fixture } = setup([]);
      const empty = fixture.debugElement.query(By.css('app-empty-state'));
      expect(empty).not.toBeNull();
    });

    it('renders skeleton when loading=true and rows=[]', () => {
      const { fixture } = setup([], true);
      const skeleton = fixture.debugElement.query(By.css('.tl__skeleton'));
      expect(skeleton).not.toBeNull();
    });
  });

  describe('canvas', () => {
    it('renders the gantt canvas when rows exist', () => {
      const { fixture } = setup([makeStageRow()]);
      const canvas = fixture.debugElement.query(By.css('.tl__canvas'));
      expect(canvas).not.toBeNull();
    });

    it('renders a row label for each row', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow()]);
      const labels = fixture.debugElement.queryAll(By.css('.tl__row-label'));
      expect(labels).toHaveLength(2);
    });

    it('adds --stage modifier to stage rows', () => {
      const { fixture } = setup([makeStageRow()]);
      const label = fixture.debugElement.query(By.css('.tl__row-label--stage'));
      expect(label).not.toBeNull();
    });

    it('adds --wp modifier to WP rows', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow()]);
      const label = fixture.debugElement.query(By.css('.tl__row-label--wp'));
      expect(label).not.toBeNull();
    });
  });

  describe('zoom controls', () => {
    it('starts with month zoom active', () => {
      const { fixture } = setup([makeStageRow()]);
      const buttons = fixture.debugElement.queryAll(By.css('.tl__zoom button'));
      const activeBtn = buttons.find(b => b.nativeElement.classList.contains('tl__zoom-btn--active'));
      expect(activeBtn?.nativeElement.textContent.trim()).toBe('Month');
    });

    it('switches zoom on button click', () => {
      const { fixture } = setup([makeStageRow()]);
      const buttons = fixture.debugElement.queryAll(By.css('.tl__zoom button'));
      const quarterBtn = buttons.find(b => b.nativeElement.textContent.trim() === 'Quarter');
      quarterBtn!.nativeElement.click();
      fixture.detectChanges();
      expect(quarterBtn!.nativeElement.classList).toContain('tl__zoom-btn--active');
    });
  });

  describe('planned bar', () => {
    it('renders planned bar for a row with plannedStart/End', () => {
      const { fixture } = setup([makeStageRow()]);
      const bar = fixture.debugElement.query(By.css('.tl-bar--planned'));
      expect(bar).not.toBeNull();
    });

    it('does not render planned bar when plannedStart is null', () => {
      const { fixture } = setup([makeStageRow({ plannedStart: null, plannedEnd: null })]);
      const bar = fixture.debugElement.query(By.css('.tl-bar--planned'));
      expect(bar).toBeNull();
    });
  });

  describe('actual bar classes', () => {
    it('uses tl-bar--progress for ongoing WP', () => {
      const { fixture } = setup([makeWpRow({ toleranceBreached: false, actualEnd: null })]);
      const bar = fixture.debugElement.query(By.css('.tl-bar--progress'));
      expect(bar).not.toBeNull();
    });

    it('uses tl-bar--done when actualEnd is set', () => {
      const { fixture } = setup([makeWpRow({ actualEnd: '2025-02-15', toleranceBreached: false })]);
      const bar = fixture.debugElement.query(By.css('.tl-bar--done'));
      expect(bar).not.toBeNull();
    });

    it('uses tl-bar--breach when tolerance breached', () => {
      const { fixture } = setup([makeWpRow({ toleranceBreached: true })]);
      const bar = fixture.debugElement.query(By.css('.tl-bar--breach'));
      expect(bar).not.toBeNull();
    });
  });

  describe('variance table', () => {
    it('renders the variance table when WP rows exist', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow()]);
      const table = fixture.debugElement.query(By.css('.tl__variance-table'));
      expect(table).not.toBeNull();
    });

    it('does not render variance table with stage rows only', () => {
      const { fixture } = setup([makeStageRow()]);
      const table = fixture.debugElement.query(By.css('.tl__variance-table'));
      expect(table).toBeNull();
    });

    it('shows breach badge for toleranceBreached WP', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow({ toleranceBreached: true })]);
      const badge = fixture.debugElement.query(By.css('.tl__breach-badge'));
      expect(badge).not.toBeNull();
      expect(badge.nativeElement.textContent.trim()).toBe('Breach');
    });

    it('shows ok badge when variance exists and not breached', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow({ toleranceBreached: false, timeVarianceDays: 2 })]);
      const badge = fixture.debugElement.query(By.css('.tl__ok-badge'));
      expect(badge).not.toBeNull();
    });

    it('shows in-progress badge when timeVarianceDays is null', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow({ timeVarianceDays: null, toleranceBreached: false })]);
      const badge = fixture.debugElement.query(By.css('.tl__na-badge'));
      expect(badge).not.toBeNull();
    });

    it('marks breach rows with breach modifier class', () => {
      const { fixture } = setup([makeStageRow(), makeWpRow({ toleranceBreached: true })]);
      const row = fixture.debugElement.query(By.css('.tl__variance-row--breach'));
      expect(row).not.toBeNull();
    });
  });

  describe('service integration', () => {
    it('calls timelineService.load() on init', () => {
      const { timelineService } = setup([]);
      expect(timelineService.load).toHaveBeenCalledWith(10);
    });
  });
});
