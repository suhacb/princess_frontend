import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { StageService } from './stage.service';
import { StageApiResource } from '../contracts/stage.contracts';
import { environment } from '../../../../environments/environment';

const BASE = `${environment.apiUrl}/projects/10/stages`;

const stubApi: StageApiResource = {
  id: 1,
  project_id: 10,
  name: 'Initiation Stage',
  type: 'initiation',
  status: 'planned',
  planned_start_date: '2026-01-01',
  planned_end_date: '2026-02-01',
  actual_start_date: null,
  actual_end_date: null,
  tolerances: {
    time: { min: -5, max: 10 },
    cost: { min: -500, max: 1000 },
    scope: null,
    risk: null,
    quality: null,
    benefit: null,
  },
  tolerance_status: {
    time: 'within',
    cost: null,
    scope: null,
    risk: null,
    quality: null,
    benefit: null,
  },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const stubApi2: StageApiResource = { ...stubApi, id: 2, name: 'Delivery Stage', type: 'delivery' };

const paginatedResponse = (items: StageApiResource[]) => ({
  data: items,
  meta: { current_page: 1, last_page: 1, per_page: 15, total: items.length, from: 1, to: items.length },
  links: { first: null, last: null, prev: null, next: null },
});

describe('StageService', () => {
  let service: StageService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('list()', () => {
    it('sets the stages signal from the API response', async () => {
      const result$ = firstValueFrom(service.list(10));
      http.expectOne(BASE).flush(paginatedResponse([stubApi, stubApi2]));
      await result$;
      expect(service.stages()).toHaveLength(2);
      expect(service.stages()[0].name).toBe('Initiation Stage');
    });

    it('sets loading to false after response', async () => {
      const result$ = firstValueFrom(service.list(10));
      expect(service.loading()).toBe(true);
      http.expectOne(BASE).flush(paginatedResponse([]));
      await result$;
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets the selectedStage signal', async () => {
      const result$ = firstValueFrom(service.load(10, 1));
      http.expectOne(`${BASE}/1`).flush({ data: stubApi });
      const stage = await result$;
      expect(stage.name).toBe('Initiation Stage');
      expect(service.selectedStage()?.id).toBe(1);
    });
  });

  describe('create()', () => {
    it('appends the created stage to the stages signal', async () => {
      service['_stages'].set([{ ...stubApi2, projectId: 10, plannedStartDate: '2026-01-01', plannedEndDate: '2026-02-01', actualStartDate: null, actualEndDate: null, toleranceStatus: stubApi.tolerance_status, document: null, createdAt: '2026-01-01T00:00:00Z' }]);
      const payload = { name: 'Initiation Stage', type: 'initiation' as const, planned_start_date: null, planned_end_date: null, tolerances: stubApi.tolerances };
      const result$ = firstValueFrom(service.create(10, payload));
      http.expectOne(BASE).flush({ data: stubApi });
      const created = await result$;
      expect(created.name).toBe('Initiation Stage');
      expect(service.stages()).toHaveLength(2);
      expect(service.stages()[1].id).toBe(1);
    });
  });

  describe('update()', () => {
    it('replaces the updated stage in the stages signal', async () => {
      const mapped = { id: 1, projectId: 10, name: 'Initiation Stage', type: 'initiation' as const, status: 'planned' as const, plannedStartDate: '2026-01-01', plannedEndDate: '2026-02-01', actualStartDate: null, actualEndDate: null, tolerances: stubApi.tolerances, toleranceStatus: stubApi.tolerance_status, document: null, createdAt: '2026-01-01T00:00:00Z' };
      service['_stages'].set([mapped]);
      const result$ = firstValueFrom(service.update(10, 1, { name: 'Updated' }));
      http.expectOne(`${BASE}/1`).flush({ data: { ...stubApi, name: 'Updated' } });
      await result$;
      expect(service.stages()[0].name).toBe('Updated');
    });

    it('updates selectedStage when the same stage is selected', async () => {
      const mapped = { id: 1, projectId: 10, name: 'Initiation Stage', type: 'initiation' as const, status: 'planned' as const, plannedStartDate: '2026-01-01', plannedEndDate: '2026-02-01', actualStartDate: null, actualEndDate: null, tolerances: stubApi.tolerances, toleranceStatus: stubApi.tolerance_status, document: null, createdAt: '2026-01-01T00:00:00Z' };
      service['_selectedStage'].set(mapped);
      service['_stages'].set([mapped]);
      const result$ = firstValueFrom(service.update(10, 1, { name: 'Updated' }));
      http.expectOne(`${BASE}/1`).flush({ data: { ...stubApi, name: 'Updated' } });
      await result$;
      expect(service.selectedStage()?.name).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes the stage from the stages signal', async () => {
      const mapped1 = { id: 1, projectId: 10, name: 'A', type: 'initiation' as const, status: 'planned' as const, plannedStartDate: null, plannedEndDate: null, actualStartDate: null, actualEndDate: null, tolerances: stubApi.tolerances, toleranceStatus: stubApi.tolerance_status, document: null, createdAt: '2026-01-01T00:00:00Z' };
      const mapped2 = { ...mapped1, id: 2, name: 'B' };
      service['_stages'].set([mapped1, mapped2]);
      const result$ = firstValueFrom(service.remove(10, 1));
      http.expectOne(`${BASE}/1`).flush(null);
      await result$;
      expect(service.stages()).toHaveLength(1);
      expect(service.stages()[0].id).toBe(2);
    });

    it('clears selectedStage when removed', async () => {
      const mapped = { id: 1, projectId: 10, name: 'A', type: 'initiation' as const, status: 'planned' as const, plannedStartDate: null, plannedEndDate: null, actualStartDate: null, actualEndDate: null, tolerances: stubApi.tolerances, toleranceStatus: stubApi.tolerance_status, document: null, createdAt: '2026-01-01T00:00:00Z' };
      service['_selectedStage'].set(mapped);
      service['_stages'].set([mapped]);
      const result$ = firstValueFrom(service.remove(10, 1));
      http.expectOne(`${BASE}/1`).flush(null);
      await result$;
      expect(service.selectedStage()).toBeNull();
    });
  });

  describe('transition()', () => {
    it('updates stage status in the stages signal', async () => {
      const mapped = { id: 1, projectId: 10, name: 'A', type: 'initiation' as const, status: 'planned' as const, plannedStartDate: null, plannedEndDate: null, actualStartDate: null, actualEndDate: null, tolerances: stubApi.tolerances, toleranceStatus: stubApi.tolerance_status, document: null, createdAt: '2026-01-01T00:00:00Z' };
      service['_stages'].set([mapped]);
      const result$ = firstValueFrom(service.transition(10, 1, 'start'));
      http.expectOne(`${BASE}/1/transition`).flush({ data: { ...stubApi, status: 'active' } });
      const updated = await result$;
      expect(updated.status).toBe('active');
      expect(service.stages()[0].status).toBe('active');
    });
  });
});
