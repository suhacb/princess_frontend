import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Subject } from 'rxjs';
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
  tags: [],
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
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let httpMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiMock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() };
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

  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('sets documents and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.list(3).subscribe();
      expect(service.documents()).toHaveLength(1);
      expect(service.documents()[0].title).toBe('Project Brief');
      expect(service.loading()).toBe(false);
    });

    it('passes filter params including category', () => {
      apiMock.get.mockReturnValue(of({ data: [], meta: {} }));
      service.list(3, { category: 'initiation', type: 'project_brief', status: 'draft' }).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith(
        '/projects/3/documents',
        { category: 'initiation', type: 'project_brief', status: 'draft' },
      );
    });

    it('omits category param when not set', () => {
      apiMock.get.mockReturnValue(of({ data: [], meta: {} }));
      service.list(3, { type: 'project_brief', status: 'draft' }).subscribe();
      const callArgs = apiMock.get.mock.calls[0][1] as Record<string, string>;
      expect(callArgs['category']).toBeUndefined();
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

  describe('classify()', () => {
    it('calls PATCH /:id/classify and syncs updated document', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(3, 1).subscribe();

      const classified = { ...stubApi, tags: ['qa', 'critical'] };
      apiMock.patch.mockReturnValue(of({ data: classified }));
      service.classify(3, 1, { tags: ['qa', 'critical'] }).subscribe();

      expect(apiMock.patch).toHaveBeenCalledWith('/projects/3/documents/1/classify', { tags: ['qa', 'critical'] });
      expect(service.selectedDocument()?.tags).toEqual(['qa', 'critical']);
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

  describe('listVersions()', () => {
    it('returns mapped versions array', () => {
      const v2: DocumentVersionApiResource = {
        ...stubVersionApi,
        id: 13,
        version_number: 2,
        file_name: 'brief_v2.docx',
      };
      apiMock.get.mockReturnValue(of({ data: [v2, stubVersionApi] }));

      let result: unknown;
      service.listVersions(3, 1).subscribe(v => (result = v));

      expect(apiMock.get).toHaveBeenCalledWith('/projects/3/documents/1/versions');
      expect((result as unknown[]).length).toBe(2);
      expect((result as Array<{ id: number }>)[0].id).toBe(13);
    });
  });

  describe('revertVersion()', () => {
    it('calls POST .../versions/:id/revert and updates selectedDocument', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(3, 1).subscribe();

      const reverted: DocumentVersionApiResource = {
        ...stubVersionApi,
        id: 14,
        version_number: 2,
        file_name: 'brief_reverted.docx',
      };
      apiMock.post.mockReturnValue(of({ data: reverted }));
      service.revertVersion(3, 1, 12).subscribe();

      expect(apiMock.post).toHaveBeenCalledWith(
        '/projects/3/documents/1/versions/12/revert',
        {},
      );
      expect(service.selectedDocument()?.currentVersion?.id).toBe(14);
      expect(service.selectedDocument()?.versionCount).toBe(2);
    });

    it('updates document in list after revert', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.list(3).subscribe();

      const reverted: DocumentVersionApiResource = {
        ...stubVersionApi,
        id: 15,
        version_number: 2,
      };
      apiMock.post.mockReturnValue(of({ data: reverted }));
      service.revertVersion(3, 1, 12).subscribe();

      expect(service.documents()[0].versionCount).toBe(2);
      expect(service.documents()[0].currentVersion?.id).toBe(15);
    });
  });

  describe('loadEditorConfig()', () => {
    it('calls GET /:id/editor-config and returns data', () => {
      const config = {
        document: { fileType: 'docx', key: 'key1', title: 'Brief', url: 'https://s3/file' },
        documentType: 'word',
        editorConfig: { callbackUrl: 'https://api/callback', user: { id: 'u1', name: 'Alice' }, lang: 'en' },
        token: 'jwt-token',
      };
      apiMock.get.mockReturnValue(of({ data: config }));

      let result: unknown;
      service.loadEditorConfig(3, 1).subscribe(c => (result = c));

      expect(apiMock.get).toHaveBeenCalledWith('/projects/3/documents/1/editor-config');
      expect((result as typeof config).token).toBe('jwt-token');
      expect((result as typeof config).documentType).toBe('word');
    });
  });

  describe('download()', () => {
    it('calls HttpClient.get with blob responseType', () => {
      const blobSubject = new Subject<Blob>();
      httpMock.get.mockReturnValue(blobSubject.asObservable());
      service.download(3, 1);
      expect(httpMock.get).toHaveBeenCalledWith(
        expect.stringContaining('/projects/3/documents/1/download'),
        expect.objectContaining({ responseType: 'blob' }),
      );
    });

    it('calls with version param when versionId provided', () => {
      httpMock.get.mockReturnValue(new Subject<Blob>().asObservable());
      service.download(3, 1, 42);
      const callArgs = httpMock.get.mock.calls[0][1] as { params: Record<string, string> };
      expect(callArgs.params['version']).toBe('42');
    });
  });

  describe('listReviewQueue()', () => {
    it('sets reviewQueue and clears reviewQueueLoading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.listReviewQueue(3).subscribe();
      expect(service.reviewQueue()).toHaveLength(1);
      expect(service.reviewQueue()[0].title).toBe('Project Brief');
      expect(service.reviewQueueLoading()).toBe(false);
    });

    it('calls GET /projects/3/documents/review-queue', () => {
      apiMock.get.mockReturnValue(of({ data: [], meta: {} }));
      service.listReviewQueue(3).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/projects/3/documents/review-queue');
    });

    it('reviewQueueCount reflects queue length', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi, { ...stubApi, id: 2 }], meta: {} }));
      service.listReviewQueue(3).subscribe();
      expect(service.reviewQueueCount()).toBe(2);
    });

    it('clears reviewQueueLoading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.listReviewQueue(3).subscribe({ error: () => {} });
      expect(service.reviewQueueLoading()).toBe(false);
    });
  });

  describe('acceptClassification()', () => {
    it('calls classify then update(status:confirmed) and removes from reviewQueue', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi], meta: {} }));
      service.listReviewQueue(3).subscribe();
      expect(service.reviewQueue()).toHaveLength(1);

      const classified = { ...stubApi, tags: ['qa'] };
      apiMock.patch.mockReturnValue(of({ data: classified }));
      apiMock.put.mockReturnValue(of({ data: { ...classified, status: 'confirmed' } }));

      service.acceptClassification(3, 1, { tags: ['qa'] }).subscribe();

      expect(apiMock.patch).toHaveBeenCalledWith('/projects/3/documents/1/classify', { tags: ['qa'] });
      expect(apiMock.put).toHaveBeenCalledWith(
        '/projects/3/documents/1',
        { status: 'confirmed' },
      );
      expect(service.reviewQueue()).toHaveLength(0);
      expect(service.reviewQueueCount()).toBe(0);
    });
  });

  describe('confirmQueueItem()', () => {
    it('calls update(status:confirmed) and removes from reviewQueue', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi, { ...stubApi, id: 2 }], meta: {} }));
      service.listReviewQueue(3).subscribe();
      expect(service.reviewQueue()).toHaveLength(2);

      apiMock.put.mockReturnValue(of({ data: { ...stubApi, status: 'confirmed' } }));
      service.confirmQueueItem(3, 1).subscribe();

      expect(apiMock.put).toHaveBeenCalledWith('/projects/3/documents/1', { status: 'confirmed' });
      expect(service.reviewQueue()).toHaveLength(1);
      expect(service.reviewQueue()[0].id).toBe(2);
    });
  });
});
