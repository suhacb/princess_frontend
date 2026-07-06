import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TestScenarioService } from './test-scenario.service';
import { ApiService } from '../../../core/http/api.service';
import { TestScenarioApiResource } from '../contracts/test-scenario.contracts';

const stubApiScenario: TestScenarioApiResource = {
  id: 1,
  project_id: 5,
  ref: 'TS-001',
  title: 'User can authenticate',
  description: null,
  preconditions: null,
  type: 'feature',
  status: 'draft',
  is_testable: false,
  testable_notes: null,
  test_cases: [],
  acceptance_criteria: [],
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('TestScenarioService', () => {
  let service: TestScenarioService;
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
      providers: [TestScenarioService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(TestScenarioService);
  });

  describe('list()', () => {
    it('sets scenarios and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiScenario] }));
      service.list(5).subscribe();
      expect(service.scenarios()).toHaveLength(1);
      expect(service.scenarios()[0].ref).toBe('TS-001');
      expect(service.loading()).toBe(false);
    });

    it('passes filters as query params', () => {
      apiMock.get.mockReturnValue(of({ data: [] }));
      service.list(5, { type: 'feature', status: 'draft', is_testable: true }).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/projects/5/test-scenarios', {
        type: 'feature',
        status: 'draft',
        is_testable: 1,
      });
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedScenario and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiScenario }));
      service.load(5, 1).subscribe();
      expect(service.selectedScenario()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new scenario to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiScenario] }));
      service.list(5).subscribe();
      const created: TestScenarioApiResource = { ...stubApiScenario, id: 2, title: 'New scenario' };
      apiMock.post.mockReturnValue(of({ data: created }));
      service.create(5, { type: 'feature', title: 'New scenario' }).subscribe();
      expect(service.scenarios()[0].id).toBe(2);
      expect(service.scenarios()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates scenario in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiScenario] }));
      service.list(5).subscribe();
      const updated: TestScenarioApiResource = { ...stubApiScenario, title: 'Updated' };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.scenarios()[0].title).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes scenario from list and clears selection', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiScenario }));
      service.load(5, 1).subscribe();
      apiMock.get.mockReturnValue(of({ data: [stubApiScenario] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.scenarios()).toHaveLength(0);
      expect(service.selectedScenario()).toBeNull();
    });
  });

  describe('status transitions', () => {
    it('ready() calls the ready endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiScenario }));
      service.load(5, 1).subscribe();
      const ready: TestScenarioApiResource = { ...stubApiScenario, status: 'ready' };
      apiMock.post.mockReturnValue(of({ data: ready }));
      service.ready(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-scenarios/1/ready', {});
      expect(service.selectedScenario()?.status).toBe('ready');
    });

    it('obsolete() calls the obsolete endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiScenario }));
      service.load(5, 1).subscribe();
      const obsolete: TestScenarioApiResource = { ...stubApiScenario, status: 'obsolete' };
      apiMock.post.mockReturnValue(of({ data: obsolete }));
      service.obsolete(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-scenarios/1/obsolete', {});
      expect(service.selectedScenario()?.status).toBe('obsolete');
    });

    it('reopen() calls the reopen endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiScenario }));
      service.load(5, 1).subscribe();
      const reopened: TestScenarioApiResource = { ...stubApiScenario, status: 'draft' };
      apiMock.post.mockReturnValue(of({ data: reopened }));
      service.reopen(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-scenarios/1/reopen', {});
    });

    it('markTestable() posts testable_notes payload', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiScenario }));
      service.load(5, 1).subscribe();
      const testable: TestScenarioApiResource = { ...stubApiScenario, is_testable: true };
      apiMock.post.mockReturnValue(of({ data: testable }));
      service.markTestable(5, 1, { testable_notes: 'Verified manually' }).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-scenarios/1/mark-testable', {
        testable_notes: 'Verified manually',
      });
      expect(service.selectedScenario()?.isTestable).toBe(true);
    });

    it('markNotTestable() calls the mark-not-testable endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: { ...stubApiScenario, is_testable: true } }));
      service.load(5, 1).subscribe();
      const notTestable: TestScenarioApiResource = { ...stubApiScenario, is_testable: false };
      apiMock.post.mockReturnValue(of({ data: notTestable }));
      service.markNotTestable(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-scenarios/1/mark-not-testable', {});
      expect(service.selectedScenario()?.isTestable).toBe(false);
    });
  });
});
