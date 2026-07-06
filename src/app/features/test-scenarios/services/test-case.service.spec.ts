import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TestCaseService } from './test-case.service';
import { ApiService } from '../../../core/http/api.service';
import { TestCaseApiResource } from '../contracts/test-case.contracts';

const stubApiCase: TestCaseApiResource = {
  id: 1,
  test_scenario_id: 5,
  project_id: 2,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page', 'Submit form'],
  expected_result: 'User is redirected to the dashboard',
  priority: 'medium',
  type: 'positive',
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('TestCaseService', () => {
  let service: TestCaseService;
  let apiMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [TestCaseService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(TestCaseService);
  });

  describe('list()', () => {
    it('caches cases by scenario id and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCase] }));
      service.list(2, 5).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/projects/2/test-scenarios/5/test-cases');
      expect(service.casesFor(5)).toHaveLength(1);
      expect(service.casesFor(5)[0].ref).toBe('TC-001');
      expect(service.isLoading(5)).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(2, 5).subscribe({ error: () => {} });
      expect(service.isLoading(5)).toBe(false);
    });

    it('keeps separate caches per scenario', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCase] }));
      service.list(2, 5).subscribe();
      apiMock.get.mockReturnValue(of({ data: [] }));
      service.list(2, 6).subscribe();
      expect(service.casesFor(5)).toHaveLength(1);
      expect(service.casesFor(6)).toHaveLength(0);
    });
  });

  describe('create()', () => {
    it('appends new case to the scenario cache', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCase] }));
      service.list(2, 5).subscribe();
      const created: TestCaseApiResource = { ...stubApiCase, id: 2, title: 'Second case' };
      apiMock.post.mockReturnValue(of({ data: created }));
      service.create(2, 5, { title: 'Second case', steps: ['a'], expected_result: 'b', type: 'positive' }).subscribe();
      expect(service.casesFor(5)).toHaveLength(2);
      expect(service.casesFor(5)[1].title).toBe('Second case');
    });
  });

  describe('update()', () => {
    it('replaces the case in the scenario cache', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCase] }));
      service.list(2, 5).subscribe();
      const updated: TestCaseApiResource = { ...stubApiCase, title: 'Updated title' };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(2, 5, 1, { title: 'Updated title' }).subscribe();
      expect(service.casesFor(5)[0].title).toBe('Updated title');
    });
  });

  describe('remove()', () => {
    it('removes the case from the scenario cache', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCase] }));
      service.list(2, 5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(2, 5, 1).subscribe();
      expect(service.casesFor(5)).toHaveLength(0);
    });
  });

  describe('clearCache()', () => {
    it('removes the cached list for a scenario', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCase] }));
      service.list(2, 5).subscribe();
      service.clearCache(5);
      expect(service.casesFor(5)).toEqual([]);
    });
  });
});
