import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DocumentService } from './document.service';
import { ApiService } from '../../../core/http/api.service';
import { HttpClient } from '@angular/common/http';
import { DocumentApiResource, DocumentVersionApiResource } from '../contracts/document.contracts';

const stubVersionApi: DocumentVersionApiResource = {
  id: 12,
  document_id: 1,
  version_number: 1,
  file_name: 'brief.docx',
  file_size: 1024,
  mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  comment: null,
  uploaded_by: { id: 5, name: 'Alice' },
  uploaded_at: '2026-06-01T10:00:00Z',
};

const stubApi: DocumentApiResource = {
  id: 1,
  project_id: 3,
  title: 'Project Brief',
  type: 'project_brief',
  type_label: 'Project Brief',
  category: 'initiation',
  category_label: 'Initiation',
  status: 'draft',
  owner: { id: 5, name: 'Alice' },
  current_version: stubVersionApi,
  version_count: 1,
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-01T09:00:00Z',
};

describe('DocumentService', () => {
  let service: DocumentService;
  let apiMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let httpMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    httpMock = { get: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        DocumentService,
        { provide: ApiService, useValue: apiMock },
        { provide: HttpClient, useValue: httpMock },
      ],
    });
    service = TestBed.inject(DocumentService);
  });

  describe('list()', () => {
    it('sets documents and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.list(3).subscribe();
      expect(service.documents()).toHaveLength(1);
      expect(service.documents()[0].title).toBe('Project Brief');
      expect(service.loading()).toBe(false);
    });

    it('passes filter params', () => {
      apiMock.get.mockReturnValue(of({ data: [], meta: {} }));
      service.list(3, { type: 'project_brief', status: 'draft' }).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith(
        '/projects/3/documents',
        { type: 'project_brief', status: 'draft' },
      );
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(3).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedDocument and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(3, 1).subscribe();
      expect(service.selectedDocument()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });

    it('clears selectedDocument before loading', () => {
      apiMock.get
        .mockReturnValueOnce(of({ data: stubApi }))
        .mockReturnValueOnce(of({ data: { ...stubApi, id: 2 } }));
      service.load(3, 1).subscribe();
      service.load(3, 2).subscribe();
      expect(service.selectedDocument()?.id).toBe(2);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(3, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new document to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.list(3).subscribe();
      apiMock.post.mockReturnValue(of({ data: { ...stubApi, id: 2, title: 'Risk Register' } }));
      service.create(3, { title: 'Risk Register', type: 'risk_register' }).subscribe();
      expect(service.documents()[0].id).toBe(2);
      expect(service.documents()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates document in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.list(3).subscribe();
      apiMock.put.mockReturnValue(of({ data: { ...stubApi, title: 'Updated Brief' } }));
      service.update(3, 1, { title: 'Updated Brief' }).subscribe();
      expect(service.documents()[0].title).toBe('Updated Brief');
    });

    it('propagates to selectedDocument when it matches', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(3, 1).subscribe();
      apiMock.put.mockReturnValue(of({ data: { ...stubApi, status: 'in_review' } }));
      service.update(3, 1, { status: 'in_review' }).subscribe();
      expect(service.selectedDocument()?.status).toBe('in_review');
    });
  });

  describe('remove()', () => {
    it('removes document from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.list(3).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(3, 1).subscribe();
      expect(service.documents()).toHaveLength(0);
    });

    it('clears selectedDocument if it was the deleted one', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(3, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(3, 1).subscribe();
      expect(service.selectedDocument()).toBeNull();
    });
  });

  describe('uploadVersion()', () => {
    it('updates selectedDocument currentVersion on success', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(3, 1).subscribe();

      const newVersion: DocumentVersionApiResource = {
        ...stubVersionApi,
        id: 13,
        version_number: 2,
        file_name: 'brief_v2.docx',
      };
      apiMock.post.mockReturnValue(of({ data: newVersion }));
      service.uploadVersion(3, 1, new File([''], 'brief_v2.docx')).subscribe();

      expect(service.selectedDocument()?.currentVersion?.id).toBe(13);
      expect(service.selectedDocument()?.versionCount).toBe(2);
      expect(service.uploading()).toBe(false);
    });

    it('clears uploading on error', () => {
      apiMock.post.mockReturnValue(throwError(() => new Error('fail')));
      service.uploadVersion(3, 1, new File([''], 'f.docx')).subscribe({ error: () => {} });
      expect(service.uploading()).toBe(false);
    });
  });
});
