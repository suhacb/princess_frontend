import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AcceptanceCriterionService } from './acceptance-criterion.service';
import { ApiService } from '../../../core/http/api.service';
import { AcceptanceCriterionApiResource } from '../contracts/acceptance-criterion.contracts';

const stubApiCriterion: AcceptanceCriterionApiResource = {
  id: 1,
  project_id: 5,
  requirement_id: 3,
  ref: 'AC-001',
  title: 'Login succeeds with valid SSO token',
  description: 'Full description',
  measurement_method: null,
  acceptance_threshold: null,
  verifier: null,
  verification_method: 'test',
  status: 'draft',
  version: 1,
  approved_by: null,
  approved_at: null,
  supplier_passed: false,
  supplier_passed_at: null,
  supplier_decision: 'pending',
  supplier_decided_by: null,
  supplier_decided_at: null,
  supplier_decision_note: null,
  client_passed: false,
  client_passed_at: null,
  client_decision: 'pending',
  client_decided_by: null,
  client_decided_at: null,
  client_decision_note: null,
  accepted_at: null,
  requirement: { id: 3, ref: 'REQ-001', title: 'System must support SSO', type: 'classic' },
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-01T09:00:00Z',
};

describe('AcceptanceCriterionService', () => {
  let service: AcceptanceCriterionService;
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
      providers: [AcceptanceCriterionService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(AcceptanceCriterionService);
  });

  describe('list()', () => {
    it('sets criteria and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCriterion] }));
      service.list(5).subscribe();
      expect(service.criteria()).toHaveLength(1);
      expect(service.criteria()[0].ref).toBe('AC-001');
      expect(service.loading()).toBe(false);
    });

    it('passes requirement_id and status filters as query params', () => {
      apiMock.get.mockReturnValue(of({ data: [] }));
      service.list(5, { requirement_id: 3, status: 'approved' }).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/projects/5/acceptance-criteria', {
        requirement_id: 3,
        status: 'approved',
      });
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedCriterion and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiCriterion }));
      service.load(5, 1).subscribe();
      expect(service.selectedCriterion()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new criterion to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCriterion] }));
      service.list(5).subscribe();
      const created: AcceptanceCriterionApiResource = { ...stubApiCriterion, id: 2, title: 'New AC' };
      apiMock.post.mockReturnValue(of({ data: created }));
      service.create(5, { requirement_id: 3, title: 'New AC', description: 'desc' }).subscribe();
      expect(service.criteria()[0].id).toBe(2);
      expect(service.criteria()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates criterion in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCriterion] }));
      service.list(5).subscribe();
      const updated: AcceptanceCriterionApiResource = { ...stubApiCriterion, title: 'Updated', version: 2 };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.criteria()[0].title).toBe('Updated');
      expect(service.criteria()[0].version).toBe(2);
    });
  });

  describe('remove()', () => {
    it('removes criterion from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiCriterion] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.criteria()).toHaveLength(0);
    });
  });

  describe('approve()', () => {
    it('calls the approve endpoint and syncs status', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiCriterion }));
      service.load(5, 1).subscribe();
      const approved: AcceptanceCriterionApiResource = { ...stubApiCriterion, status: 'approved' };
      apiMock.post.mockReturnValue(of({ data: approved }));
      service.approve(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/acceptance-criteria/1/approve', {});
      expect(service.selectedCriterion()?.status).toBe('approved');
    });
  });

  describe('supplierDecision() / clientDecision()', () => {
    it('supplierDecision() posts to the supplier-decision endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiCriterion }));
      service.load(5, 1).subscribe();
      const updated: AcceptanceCriterionApiResource = { ...stubApiCriterion, supplier_decision: 'accepted' };
      apiMock.post.mockReturnValue(of({ data: updated }));
      service.supplierDecision(5, 1, { decision: 'accepted' }).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/acceptance-criteria/1/supplier-decision', {
        decision: 'accepted',
      });
      expect(service.selectedCriterion()?.supplierDecision).toBe('accepted');
    });

    it('clientDecision() posts to the client-decision endpoint with a note', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiCriterion }));
      service.load(5, 1).subscribe();
      const updated: AcceptanceCriterionApiResource = {
        ...stubApiCriterion,
        client_decision: 'rejected',
        client_decision_note: 'Regression found',
      };
      apiMock.post.mockReturnValue(of({ data: updated }));
      service.clientDecision(5, 1, { decision: 'rejected', note: 'Regression found' }).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/acceptance-criteria/1/client-decision', {
        decision: 'rejected',
        note: 'Regression found',
      });
      expect(service.selectedCriterion()?.clientDecision).toBe('rejected');
    });
  });

  describe('listVersions()', () => {
    it('maps versions and pagination meta', () => {
      apiMock.get.mockReturnValue(
        of({
          data: [
            {
              id: 1,
              acceptance_criterion_id: 1,
              version_number: 1,
              title: 'Login succeeds with valid SSO token',
              description: 'desc',
              verifier: null,
              verification_method: 'test',
              status: 'draft',
              supplier_passed: false,
              client_passed: false,
              supplier_decision: 'pending',
              supplier_decision_note: null,
              client_decision: 'pending',
              client_decision_note: null,
              created_by: null,
              created_at: '2026-06-01T09:00:00Z',
            },
          ],
          meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
        }),
      );
      service.listVersions(5, 1).subscribe(result => {
        expect(result.versions).toHaveLength(1);
        expect(result.versions[0].versionNumber).toBe(1);
        expect(result.currentPage).toBe(1);
        expect(result.total).toBe(1);
      });
      expect(apiMock.get).toHaveBeenCalledWith('/projects/5/acceptance-criteria/1/versions', { page: 1 });
    });
  });
});
