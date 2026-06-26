import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { TimelineService } from './timeline.service';

const mockStages = [
  {
    id: 1, project_id: 10, name: 'Initiation', type: 'initiation',
    status: 'active', sequence: 1,
    planned_start: '2025-01-01', planned_end: '2025-03-31',
    actual_start: '2025-01-05', actual_end: null,
  },
  {
    id: 2, project_id: 10, name: 'Delivery', type: 'delivery',
    status: 'planned', sequence: 2,
    planned_start: '2025-04-01', planned_end: '2025-08-31',
    actual_start: null, actual_end: null,
  },
];

const mockVariance1 = {
  data: {
    stage: { id: 1, name: 'Initiation' },
    plans: [],
    work_packages: [
      {
        id: 101, title: 'WP-A',
        planned_start: '2025-01-10', planned_end: '2025-02-10',
        actual_start: '2025-01-12', actual_end: null,
        time_variance_days: 2, tolerance_time: '5d', tolerance_breached: false,
      },
    ],
  },
};

const mockVariance2 = {
  data: {
    stage: { id: 2, name: 'Delivery' },
    plans: [],
    work_packages: [
      {
        id: 201, title: 'WP-B',
        planned_start: '2025-04-05', planned_end: '2025-05-05',
        actual_start: null, actual_end: null,
        time_variance_days: null, tolerance_time: null, tolerance_breached: false,
      },
    ],
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setupTest(apiGetMock: any) {
  TestBed.configureTestingModule({
    providers: [
      TimelineService,
      { provide: ApiService, useValue: { get: apiGetMock } },
    ],
  });
  return TestBed.inject(TimelineService);
}

afterEach(() => TestBed.resetTestingModule());

describe('TimelineService', () => {
  it('starts with empty rows and loading=false', () => {
    const svc = setupTest(vi.fn().mockReturnValue(of({ data: [] })));
    expect(svc.rows()).toEqual([]);
    expect(svc.loading()).toBe(false);
  });

  describe('load()', () => {
    it('sets loading to true then false', async () => {
      const apiGet = vi.fn()
        .mockReturnValueOnce(of({ data: mockStages }))
        .mockReturnValue(of(mockVariance1));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));
      expect(svc.loading()).toBe(false);
    });

    it('builds one stage row per stage', async () => {
      const apiGet = vi.fn()
        .mockReturnValueOnce(of({ data: mockStages }))
        .mockReturnValueOnce(of(mockVariance1))
        .mockReturnValueOnce(of(mockVariance2));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));

      const stageRows = svc.rows().filter(r => r.type === 'stage');
      expect(stageRows).toHaveLength(2);
      expect(stageRows[0]).toMatchObject({ id: 1, label: 'Initiation', stageId: 1, toleranceBreached: false });
    });

    it('builds WP rows from variance response', async () => {
      const apiGet = vi.fn()
        .mockReturnValueOnce(of({ data: mockStages }))
        .mockReturnValueOnce(of(mockVariance1))
        .mockReturnValueOnce(of(mockVariance2));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));

      const wpRows = svc.rows().filter(r => r.type === 'wp');
      expect(wpRows).toHaveLength(2);
      expect(wpRows[0]).toMatchObject({
        id: 101, label: 'WP-A', stageId: 1,
        timeVarianceDays: 2, toleranceBreached: false,
      });
    });

    it('row order is stage → wps interleaved', async () => {
      const apiGet = vi.fn()
        .mockReturnValueOnce(of({ data: mockStages }))
        .mockReturnValueOnce(of(mockVariance1))
        .mockReturnValueOnce(of(mockVariance2));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));

      const types = svc.rows().map(r => r.type);
      expect(types).toEqual(['stage', 'wp', 'stage', 'wp']);
    });

    it('handles empty stages gracefully', async () => {
      const apiGet = vi.fn().mockReturnValueOnce(of({ data: [] }));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));
      expect(svc.rows()).toEqual([]);
    });

    it('tolerates a failing variance call (catchError per stage)', async () => {
      const apiGet = vi.fn()
        .mockReturnValueOnce(of({ data: mockStages }))
        .mockReturnValueOnce(throwError(() => new Error('500')))
        .mockReturnValueOnce(of(mockVariance2));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));

      // Stage 1 still appears, WP-A does not (variance failed)
      const stageRows = svc.rows().filter(r => r.type === 'stage');
      expect(stageRows).toHaveLength(2);
      const wpRows = svc.rows().filter(r => r.type === 'wp');
      // Only WP-B from stage 2 survives
      expect(wpRows.every(r => r.stageId === 2)).toBe(true);
    });

    it('clears previous rows on each load call', async () => {
      const apiGet = vi.fn()
        .mockReturnValueOnce(of({ data: mockStages }))
        .mockReturnValueOnce(of(mockVariance1))
        .mockReturnValueOnce(of(mockVariance2))
        .mockReturnValueOnce(of({ data: [] }));
      const svc = setupTest(apiGet);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));
      expect(svc.rows().length).toBeGreaterThan(0);

      await new Promise<void>(resolve => svc.load(10).subscribe({ complete: resolve }));
      expect(svc.rows()).toEqual([]);
    });
  });
});
