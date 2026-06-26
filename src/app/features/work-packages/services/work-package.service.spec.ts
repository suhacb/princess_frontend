import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { WorkPackageService } from './work-package.service';
import { ApiService } from '../../../core/http/api.service';
import { WorkPackageApiResource } from '../contracts/work-package.contracts';

const stubWpApi: WorkPackageApiResource = {
  id: 1, project_id: 7, title: 'Build Auth', description: null,
  status: 'draft',
  team_manager_id: 5, team_manager: { id: 5, name: 'Alice' },
  planned_start: '2026-02-01', planned_end: '2026-04-30',
  actual_start: null, actual_end: null,
  products: [],
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

function setup(overrides: Partial<Record<'get' | 'post' | 'patch' | 'delete', unknown>> = {}) {
  const apiService = {
    get: vi.fn().mockReturnValue(of({ data: [stubWpApi] })),
    post: vi.fn().mockReturnValue(of({ data: stubWpApi })),
    patch: vi.fn().mockReturnValue(of({ data: stubWpApi })),
    delete: vi.fn().mockReturnValue(of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [WorkPackageService, { provide: ApiService, useValue: apiService }],
  });
  return { service: TestBed.inject(WorkPackageService), apiService };
}

describe('WorkPackageService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('populates workPackages signal', () => {
      const { service } = setup();
      service.list(7).subscribe();
      expect(service.workPackages().length).toBe(1);
      expect(service.workPackages()[0].title).toBe('Build Auth');
    });

    it('maps team manager', () => {
      const { service } = setup();
      service.list(7).subscribe();
      expect(service.workPackages()[0].teamManager?.name).toBe('Alice');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.list(7).subscribe();
      expect(apiService.get).toHaveBeenCalledWith('/projects/7/work-packages');
    });

    it('sets loading to false after success', () => {
      const { service } = setup();
      service.list(7).subscribe();
      expect(service.loading()).toBe(false);
    });

    it('sets loading to false on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.list(7).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new WP to signal', () => {
      const { service } = setup({
        post: vi.fn().mockReturnValue(of({ data: { ...stubWpApi, id: 99, title: 'New WP' } })),
      });
      service.list(7).subscribe();
      service.create(7, {
        title: 'New WP',
        team_manager_id: 5,
        planned_start: '2026-03-01',
        planned_end: '2026-05-31',
      }).subscribe();
      expect(service.workPackages()[0].title).toBe('New WP');
      expect(service.workPackages().length).toBe(2);
    });

    it('calls correct endpoint with all required fields', () => {
      const { service, apiService } = setup();
      const payload = {
        title: 'New WP',
        team_manager_id: 5,
        planned_start: '2026-03-01',
        planned_end: '2026-05-31',
      };
      service.create(7, payload).subscribe();
      expect(apiService.post).toHaveBeenCalledWith(
        '/projects/7/work-packages',
        expect.objectContaining({
          title: 'New WP',
          team_manager_id: 5,
          planned_start: '2026-03-01',
          planned_end: '2026-05-31',
        }),
      );
    });
  });

  describe('update()', () => {
    it('updates WP in signal', () => {
      const { service } = setup({
        patch: vi.fn().mockReturnValue(of({ data: { ...stubWpApi, title: 'Updated' } })),
      });
      service.list(7).subscribe();
      service.update(7, 1, { title: 'Updated' }).subscribe();
      expect(service.workPackages()[0].title).toBe('Updated');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.update(7, 1, { title: 'Updated' }).subscribe();
      expect(apiService.patch).toHaveBeenCalledWith('/projects/7/work-packages/1', expect.any(Object));
    });
  });

  describe('remove()', () => {
    it('removes WP from signal', () => {
      const { service } = setup();
      service.list(7).subscribe();
      service.remove(7, 1).subscribe();
      expect(service.workPackages().length).toBe(0);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.remove(7, 1).subscribe();
      expect(apiService.delete).toHaveBeenCalledWith('/projects/7/work-packages/1');
    });
  });

  describe('authorize()', () => {
    it('updates status to authorized in signal', () => {
      const { service } = setup({
        post: vi.fn().mockReturnValue(of({ data: { ...stubWpApi, status: 'authorized' } })),
      });
      service.list(7).subscribe();
      service.authorize(7, 1).subscribe();
      expect(service.workPackages()[0].status).toBe('authorized');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.authorize(7, 1).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/7/work-packages/1/authorize', {});
    });
  });

  describe('accept()', () => {
    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.accept(7, 1).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/7/work-packages/1/accept', {});
    });
  });

  describe('complete()', () => {
    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.complete(7, 1).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/7/work-packages/1/complete', {});
    });
  });

  describe('cancel()', () => {
    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.cancel(7, 1).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/7/work-packages/1/cancel', {});
    });
  });
});
