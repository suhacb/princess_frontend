import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TestSessionService } from './test-session.service';
import { ApiService } from '../../../core/http/api.service';
import { TestSessionApiResource, TestSessionReportApiResource } from '../contracts/test-session.contracts';
import { TestScenarioApiResource } from '../../test-scenarios/contracts/test-scenario.contracts';
import { TestCaseApiResource } from '../../test-scenarios/contracts/test-case.contracts';
import { TestSessionResultApiResource } from '../contracts/test-session-result.contracts';

const stubScenario: TestScenarioApiResource = {
  id: 1,
  project_id: 5,
  ref: 'TS-001',
  title: 'User can authenticate',
  description: null,
  preconditions: null,
  type: 'feature',
  status: 'ready',
  is_testable: true,
  testable_notes: null,
  test_cases: [],
  acceptance_criteria: [],
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

const stubCase: TestCaseApiResource = {
  id: 10,
  test_scenario_id: 1,
  project_id: 5,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page', 'Submit form'],
  expected_result: 'Redirected to dashboard',
  priority: 'high',
  type: 'positive',
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

const stubResult: TestSessionResultApiResource = {
  id: 100,
  test_session_id: 1,
  test_scenario: stubScenario,
  test_case: stubCase,
  result: 'not_run',
  step_results: null,
  notes: null,
  defect_ref: null,
  executed_at: null,
  attachments: {},
};

const stubApiSession: TestSessionApiResource = {
  id: 1,
  project_id: 5,
  test_session_plan_id: 2,
  ref: 'TSE-001',
  title: 'Sprint 4 supplier session',
  session_date: '2026-07-10',
  tester: { id: 3, name: 'Carol', email: null, job_title: null, organization: null },
  team_type: 'supplier',
  environment: 'staging',
  status: 'planned',
  notes: null,
  results: [stubResult],
  created_by: null,
  updated_by: null,
  created_at: '2026-07-01T10:00:00Z',
  updated_at: '2026-07-01T10:00:00Z',
};

describe('TestSessionService', () => {
  let service: TestSessionService;
  let apiMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({
      providers: [TestSessionService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(TestSessionService);
  });

  describe('list()', () => {
    it('sets sessions and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiSession] }));
      service.list(5).subscribe();
      expect(service.sessions()).toHaveLength(1);
      expect(service.sessions()[0].ref).toBe('TSE-001');
      expect(service.loading()).toBe(false);
    });

    it('passes filters as query params', () => {
      apiMock.get.mockReturnValue(of({ data: [] }));
      service.list(5, { team_type: 'supplier', status: 'planned', tester_id: 3, test_session_plan_id: 2 }).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/projects/5/test-sessions', {
        team_type: 'supplier',
        status: 'planned',
        tester_id: 3,
        test_session_plan_id: 2,
      });
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedSession and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      expect(service.selectedSession()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new session to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiSession] }));
      service.list(5).subscribe();
      const created: TestSessionApiResource = { ...stubApiSession, id: 2, title: 'New session' };
      apiMock.post.mockReturnValue(of({ data: created }));
      service.create(5, { title: 'New session', session_date: '2026-07-11', tester_id: 3, team_type: 'client' }).subscribe();
      expect(service.sessions()[0].id).toBe(2);
      expect(service.sessions()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates session in list and selection', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      const updated: TestSessionApiResource = { ...stubApiSession, title: 'Updated' };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.selectedSession()?.title).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes session from list and clears selection', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      apiMock.get.mockReturnValue(of({ data: [stubApiSession] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.sessions()).toHaveLength(0);
      expect(service.selectedSession()).toBeNull();
    });
  });

  describe('status transitions', () => {
    it('start() calls the start endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      const started: TestSessionApiResource = { ...stubApiSession, status: 'in_progress' };
      apiMock.post.mockReturnValue(of({ data: started }));
      service.start(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-sessions/1/start', {});
      expect(service.selectedSession()?.status).toBe('in_progress');
    });

    it('complete() calls the complete endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      const completed: TestSessionApiResource = { ...stubApiSession, status: 'completed' };
      apiMock.post.mockReturnValue(of({ data: completed }));
      service.complete(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-sessions/1/complete', {});
      expect(service.selectedSession()?.status).toBe('completed');
    });

    it('cancel() calls the cancel endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      const cancelled: TestSessionApiResource = { ...stubApiSession, status: 'cancelled' };
      apiMock.post.mockReturnValue(of({ data: cancelled }));
      service.cancel(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-sessions/1/cancel', {});
      expect(service.selectedSession()?.status).toBe('cancelled');
    });
  });

  describe('updateResult()', () => {
    it('PUTs the scenario-level result and merges it into the selected session', () => {
      apiMock.get.mockReturnValue(of({ data: { ...stubApiSession, results: [] } }));
      service.load(5, 1).subscribe();
      apiMock.put.mockReturnValue(of({ data: stubResult }));
      service.updateResult(5, 1, 1, { result: 'pass' }).subscribe();
      expect(apiMock.put).toHaveBeenCalledWith('/projects/5/test-sessions/1/results/1', { result: 'pass' });
      expect(service.selectedSession()?.results).toHaveLength(1);
    });
  });

  describe('updateTestCaseResult()', () => {
    it('PUTs the test case result and updates an existing row', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      const updated: TestSessionResultApiResource = { ...stubResult, result: 'pass' };
      apiMock.put.mockReturnValue(of({ data: updated }));
      service.updateTestCaseResult(5, 1, 1, 10, { result: 'pass' }).subscribe();
      expect(apiMock.put).toHaveBeenCalledWith('/projects/5/test-sessions/1/results/1/test-cases/10', { result: 'pass' });
      expect(service.selectedSession()?.results).toHaveLength(1);
      expect(service.selectedSession()?.results[0].result).toBe('pass');
    });
  });

  describe('uploadAttachment()', () => {
    it('posts a FormData payload and appends the attachment locally', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiSession }));
      service.load(5, 1).subscribe();
      apiMock.post.mockReturnValue(
        of({
          data: {
            id: 50,
            step_index: 0,
            file_name: 'shot.png',
            file_size_bytes: 100,
            mime_type: 'image/png',
            created_by: null,
            created_at: '2026-07-01T00:00:00Z',
          },
        }),
      );
      const file = new File(['content'], 'shot.png', { type: 'image/png' });
      service.uploadAttachment(5, 1, 1, 10, file, 0).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith(
        '/projects/5/test-sessions/1/results/1/test-cases/10/attachments',
        expect.any(FormData),
      );
      expect(service.selectedSession()?.results[0].attachments['0']).toHaveLength(1);
    });
  });

  describe('deleteAttachment()', () => {
    it('deletes and removes the attachment locally', () => {
      const withAttachment: TestSessionApiResource = {
        ...stubApiSession,
        results: [{ ...stubResult, attachments: { case: [{ id: 50, step_index: null, file_name: 'a.png', file_size_bytes: 1, mime_type: 'image/png', created_by: null, created_at: '2026-07-01T00:00:00Z' }] } }],
      };
      apiMock.get.mockReturnValue(of({ data: withAttachment }));
      service.load(5, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.deleteAttachment(5, 1, 50, 10).subscribe();
      expect(apiMock.delete).toHaveBeenCalledWith('/projects/5/test-sessions/1/attachments/50');
      expect(service.selectedSession()?.results[0].attachments['case']).toHaveLength(0);
    });
  });

  describe('report()', () => {
    it('maps the report response', () => {
      const reportApi: TestSessionReportApiResource = {
        ref: 'TSE-001',
        title: 'Sprint 4 supplier session',
        session_date: '2026-07-10',
        team_type: 'supplier',
        environment: 'staging',
        status: 'completed',
        notes: null,
        summary: { pass: 1, fail: 0, blocked: 0, not_run: 0, skipped: 0 },
        results: [],
      };
      apiMock.get.mockReturnValue(of({ data: reportApi }));
      service.report(5, 1).subscribe(report => {
        expect(report.ref).toBe('TSE-001');
        expect(report.summary.pass).toBe(1);
      });
      expect(apiMock.get).toHaveBeenCalledWith('/projects/5/test-sessions/1/report');
    });
  });
});
