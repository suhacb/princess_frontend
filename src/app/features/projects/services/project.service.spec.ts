import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from './project.service';
import { ProjectApiResource } from '../contracts/project.contracts';
import { environment } from '../../../../environments/environment';

const BASE = `${environment.apiUrl}/projects`;

const stubApi: ProjectApiResource = {
  id: 1,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  current_stage_name: 'Stage 1',
  tolerances: {
    time: { min: -5, max: 10 },
    cost: { min: -1000, max: 2000 },
    scope: 'No scope creep',
    risk: 'Low',
    quality: 'ISO standards',
    benefit: 'ROI > 15%',
  },
  created_by: 'jdoe',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

const stubApi2: ProjectApiResource = { ...stubApi, id: 2, name: 'Beta', reference: 'PROJ-002' };

describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('list()', () => {
    it('sets the projects signal from the API response', async () => {
      const result$ = firstValueFrom(service.list());
      http.expectOne(BASE).flush({
        data: [stubApi, stubApi2],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 2, from: 1, to: 2 },
        links: { first: null, last: null, prev: null, next: null },
      });
      await result$;
      expect(service.projects()).toHaveLength(2);
      expect(service.projects()[0].name).toBe('Alpha');
    });

    it('sets loading to false after response', async () => {
      const result$ = firstValueFrom(service.list());
      expect(service.loading()).toBe(true);
      http.expectOne(BASE).flush({
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 0, from: null, to: null },
        links: { first: null, last: null, prev: null, next: null },
      });
      await result$;
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets the selectedProject signal', async () => {
      const result$ = firstValueFrom(service.load(1));
      http.expectOne(`${BASE}/1`).flush({ data: stubApi });
      const project = await result$;
      expect(project.name).toBe('Alpha');
      expect(service.selectedProject()?.id).toBe(1);
    });
  });

  describe('create()', () => {
    it('prepends the created project to the projects signal', async () => {
      service['_projects'].set([{ ...stubApi, id: 2, name: 'Beta', reference: 'PROJ-002', currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' }]);
      const payload = { name: 'Alpha', reference: 'PROJ-001', tolerances: stubApi.tolerances };
      const result$ = firstValueFrom(service.create(payload));
      http.expectOne(`${BASE}`).flush({ data: stubApi });
      const created = await result$;
      expect(created.name).toBe('Alpha');
      expect(service.projects()[0].id).toBe(1);
      expect(service.projects()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('replaces the updated project in the projects signal', async () => {
      service['_projects'].set([{ ...stubApi, currentStageName: 'Stage 1', createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' }]);
      const result$ = firstValueFrom(service.update(1, { name: 'Alpha Updated' }));
      http.expectOne(`${BASE}/1`).flush({ data: { ...stubApi, name: 'Alpha Updated' } });
      await result$;
      expect(service.projects()[0].name).toBe('Alpha Updated');
    });

    it('updates selectedProject when it is the same project', async () => {
      service['_selectedProject'].set({ ...stubApi, currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' });
      service['_projects'].set([{ ...stubApi, currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' }]);
      const result$ = firstValueFrom(service.update(1, { name: 'Alpha Updated' }));
      http.expectOne(`${BASE}/1`).flush({ data: { ...stubApi, name: 'Alpha Updated' } });
      await result$;
      expect(service.selectedProject()?.name).toBe('Alpha Updated');
    });
  });

  describe('remove()', () => {
    it('removes the project from the projects signal', async () => {
      service['_projects'].set([
        { ...stubApi, currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' },
        { ...stubApi2, currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' },
      ]);
      const result$ = firstValueFrom(service.remove(1));
      http.expectOne(`${BASE}/1`).flush(null);
      await result$;
      expect(service.projects()).toHaveLength(1);
      expect(service.projects()[0].id).toBe(2);
    });

    it('clears selectedProject when the removed project was selected', async () => {
      service['_selectedProject'].set({ ...stubApi, currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' });
      service['_projects'].set([{ ...stubApi, currentStageName: null, createdBy: 'jdoe', createdAt: '2026-01-01T00:00:00Z' }]);
      const result$ = firstValueFrom(service.remove(1));
      http.expectOne(`${BASE}/1`).flush(null);
      await result$;
      expect(service.selectedProject()).toBeNull();
    });
  });
});
