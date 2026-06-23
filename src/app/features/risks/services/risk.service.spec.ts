import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RiskService } from './risk.service';
import { ApiService } from '../../../core/http/api.service';
import { Risk, RiskApiResource } from '../contracts/risk.contracts';

const stubApiRisk: RiskApiResource = {
  id: 1,
  project_id: 5,
  stage_id: null,
  title: 'Server outage',
  description: null,
  category: 'Technical',
  probability: 3,
  impact: 4,
  risk_score: 12,
  proximity: 'near',
  response_type: 'reduce',
  response_action: null,
  residual_probability: null,
  residual_impact: null,
  residual_risk_score: null,
  status: 'open',
  raised_at: '2026-06-01T10:00:00Z',
  owner: { id: 10, name: 'Alice' },
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('RiskService', () => {
  let service: RiskService;
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
      providers: [RiskService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(RiskService);
  });

  describe('list()', () => {
    it('sets risks and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRisk] }));
      service.list(5).subscribe();
      expect(service.risks()).toHaveLength(1);
      expect(service.risks()[0].title).toBe('Server outage');
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedRisk and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRisk }));
      service.load(5, 1).subscribe();
      expect(service.selectedRisk()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });

    it('clears selectedRisk before loading', () => {
      apiMock.get
        .mockReturnValueOnce(of({ data: stubApiRisk }))
        .mockReturnValueOnce(of({ data: { ...stubApiRisk, id: 2 } }));
      service.load(5, 1).subscribe();
      expect(service.selectedRisk()?.id).toBe(1);
      service.load(5, 2).subscribe();
      expect(service.selectedRisk()?.id).toBe(2);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(5, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new risk to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRisk] }));
      service.list(5).subscribe();
      const newRisk: RiskApiResource = { ...stubApiRisk, id: 2, title: 'New risk' };
      apiMock.post.mockReturnValue(of({ data: newRisk }));
      service.create(5, {
        title: 'New risk',
        probability: 2,
        impact: 3,
        proximity: 'near',
        risk_owner: 10,
        response_type: 'reduce',
      }).subscribe();
      expect(service.risks()[0].id).toBe(2);
      expect(service.risks()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates risk in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRisk] }));
      service.list(5).subscribe();
      const updated: RiskApiResource = { ...stubApiRisk, title: 'Updated' };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.risks()[0].title).toBe('Updated');
    });

    it('propagates to selectedRisk when it matches', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRisk }));
      service.load(5, 1).subscribe();
      const updated: RiskApiResource = { ...stubApiRisk, title: 'Updated' };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.selectedRisk()?.title).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes risk from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRisk] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.risks()).toHaveLength(0);
    });

    it('clears selectedRisk if it was the deleted one', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRisk }));
      service.load(5, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.selectedRisk()).toBeNull();
    });
  });
});
