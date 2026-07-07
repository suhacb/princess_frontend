import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TestSessionPlanService } from './test-session-plan.service';
import { ApiService } from '../../../core/http/api.service';
import { TestSessionPlanApiResource } from '../contracts/test-session-plan.contracts';

const stubApiPlan: TestSessionPlanApiResource = {
  id: 1,
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  team_type: 'supplier',
  status: 'active',
  planned_date: '2026-07-10',
};

describe('TestSessionPlanService', () => {
  let service: TestSessionPlanService;
  let apiMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = { get: vi.fn() };
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

  it('passes status as a query param', () => {
    apiMock.get.mockReturnValue(of({ data: [] }));
    service.list(5, 'active').subscribe();
    expect(apiMock.get).toHaveBeenCalledWith('/projects/5/test-session-plans', { status: 'active' });
  });

  it('clears loading on error', () => {
    apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.list(5).subscribe({ error: () => {} });
    expect(service.loading()).toBe(false);
  });
});
