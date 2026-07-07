import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TestSessionPlanService } from './test-session-plan.service';
import { ApiService } from '../../../core/http/api.service';
import { TestSessionPlanApiResource } from '../contracts/test-session-plan.contracts';

const stubApiPlan: TestSessionPlanApiResource = {
  id: 1,
  project_id: 5,
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  description: null,
  team_type: 'supplier',
  assignee: null,
  status: 'active',
  planned_date: '2026-07-10',
  scenarios: [],
  created_by: null,
  updated_by: null,
  created_at: '2026-07-01T10:00:00Z',
  updated_at: '2026-07-01T10:00:00Z',
};

describe('TestSessionPlanService', () => {
  let service: TestSessionPlanService;
  let apiMock: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({
      providers: [TestSessionPlanService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(TestSessionPlanService);
  });

  it('lists plans and clears loading on success', () => {
    apiMock.get.mockReturnValue(of({ data: [stubApiPlan] }));
    service.list(5).subscribe();
    expect(service.plans()).toHaveLength(1);
    expect(service.plans()[0].ref).toBe('TSP-001');
    expect(service.loading()).toBe(false);
  });

  it('passes filters as query params', () => {
    apiMock.get.mockReturnValue(of({ data: [] }));
    service.list(5, { status: 'active', team_type: 'supplier', planned_date: '2026-07-10' }).subscribe();
    expect(apiMock.get).toHaveBeenCalledWith('/projects/5/test-session-plans', {
      status: 'active',
      team_type: 'supplier',
      planned_date: '2026-07-10',
    });
  });

  it('clears loading on error', () => {
    apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.list(5).subscribe({ error: () => {} });
    expect(service.loading()).toBe(false);
  });

  it('loads a single plan', () => {
    apiMock.get.mockReturnValue(of({ data: stubApiPlan }));
    service.load(5, 1).subscribe();
    expect(apiMock.get).toHaveBeenCalledWith('/projects/5/test-session-plans/1');
    expect(service.selectedPlan()?.ref).toBe('TSP-001');
  });

  it('creates a plan and prepends it to the list', () => {
    apiMock.post.mockReturnValue(of({ data: stubApiPlan }));
    service.create(5, { title: 'New', planned_date: '2026-07-10', team_type: 'supplier' }).subscribe();
    expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-session-plans', {
      title: 'New',
      planned_date: '2026-07-10',
      team_type: 'supplier',
    });
    expect(service.plans()[0].ref).toBe('TSP-001');
  });

  it('updates a plan in place', () => {
    apiMock.get.mockReturnValue(of({ data: [stubApiPlan] }));
    service.list(5).subscribe();
    const updated = { ...stubApiPlan, title: 'Updated title' };
    apiMock.patch.mockReturnValue(of({ data: updated }));
    service.update(5, 1, { title: 'Updated title' }).subscribe();
    expect(apiMock.patch).toHaveBeenCalledWith('/projects/5/test-session-plans/1', { title: 'Updated title' });
    expect(service.plans()[0].title).toBe('Updated title');
  });

  it('removes a plan from the list', () => {
    apiMock.get.mockReturnValue(of({ data: [stubApiPlan] }));
    service.list(5).subscribe();
    apiMock.delete.mockReturnValue(of(undefined));
    service.remove(5, 1).subscribe();
    expect(apiMock.delete).toHaveBeenCalledWith('/projects/5/test-session-plans/1');
    expect(service.plans()).toHaveLength(0);
  });

  it('activates a plan', () => {
    const active = { ...stubApiPlan, status: 'active' as const };
    apiMock.post.mockReturnValue(of({ data: active }));
    service.activate(5, 1).subscribe();
    expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-session-plans/1/activate', {});
  });

  it('completes a plan', () => {
    const completed = { ...stubApiPlan, status: 'completed' as const };
    apiMock.post.mockReturnValue(of({ data: completed }));
    service.complete(5, 1).subscribe();
    expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-session-plans/1/complete', {});
  });

  it('cancels a plan', () => {
    const cancelled = { ...stubApiPlan, status: 'cancelled' as const };
    apiMock.post.mockReturnValue(of({ data: cancelled }));
    service.cancel(5, 1).subscribe();
    expect(apiMock.post).toHaveBeenCalledWith('/projects/5/test-session-plans/1/cancel', {});
  });
});
