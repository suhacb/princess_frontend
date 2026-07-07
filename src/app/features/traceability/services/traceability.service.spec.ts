import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TraceabilityService } from './traceability.service';
import { ApiService } from '../../../core/http/api.service';
import { TraceabilityMatrixApiResource } from '../contracts/traceability.contracts';

const stubResponse: TraceabilityMatrixApiResource = {
  data: [
    {
      id: 1,
      ref: 'REQ-001',
      type: 'classic',
      title: 'Users can authenticate',
      priority: 'must',
      status: 'approved',
      derived_status: 'covered',
      acceptance_criteria: [],
    },
  ],
  stats: {
    acs_total: 0,
    acs_with_test: 0,
    acs_with_test_pct: 0,
    test_cases_total: 0,
    test_cases_passed: 0,
    test_cases_passed_pct: 0,
  },
};

describe('TraceabilityService', () => {
  let service: TraceabilityService;
  let apiMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = { get: vi.fn() };
    TestBed.configureTestingModule({
      providers: [TraceabilityService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(TraceabilityService);
  });

  describe('load()', () => {
    it('requests the traceability endpoint for the project', () => {
      apiMock.get.mockReturnValue(of(stubResponse));
      service.load(5).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/projects/5/traceability');
    });

    it('sets matrix and clears loading on success', () => {
      apiMock.get.mockReturnValue(of(stubResponse));
      service.load(5).subscribe();
      expect(service.matrix()?.requirements).toHaveLength(1);
      expect(service.matrix()?.requirements[0].ref).toBe('REQ-001');
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });
});
