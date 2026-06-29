import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource, PaginatedApiResource } from '../../../shared/contracts/api.contracts';
import { environment } from '../../../../environments/environment';
import {
  Document,
  DocumentApiResource,
  DocumentFilters,
  DocumentVersion,
  DocumentVersionApiResource,
  EditorConfigApiResource,
  CreateDocumentPayload,
  UpdateDocumentPayload,
  ClassifyDocumentPayload,
  mapDocument,
  mapDocumentVersion,
} from '../contracts/document.contracts';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);

  private readonly _documents = signal<Document[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedDocument = signal<Document | null>(null);
  private readonly _uploading = signal(false);
  private readonly _reviewQueue = signal<Document[]>([]);
  private readonly _reviewQueueLoading = signal(false);

  readonly documents = this._documents.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedDocument = this._selectedDocument.asReadonly();
  readonly uploading = this._uploading.asReadonly();
  readonly reviewQueue = this._reviewQueue.asReadonly();
  readonly reviewQueueLoading = this._reviewQueueLoading.asReadonly();
  readonly reviewQueueCount = computed(() => this._reviewQueue().length);

  private base(projectId: number): string {
    return `/projects/${projectId}/documents`;
  }

  list(projectId: number, filters: DocumentFilters = {}): Observable<Document[]> {
    this._loading.set(true);
    const params: Record<string, string> = {};
    if (filters.category) params['category'] = filters.category;
    if (filters.type) params['type'] = filters.type;
    if (filters.status) params['status'] = filters.status;
    if (filters.search) params['search'] = filters.search;

    return this.api
      .get<PaginatedApiResource<DocumentApiResource>>(this.base(projectId), params)
      .pipe(
        map(res => res.data.map(mapDocument)),
        tap(docs => {
          this._documents.set(docs);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  load(projectId: number, docId: number): Observable<Document> {
    this._loading.set(true);
    this._selectedDocument.set(null);
    return this.api
      .get<ApiResource<DocumentApiResource>>(`${this.base(projectId)}/${docId}`)
      .pipe(
        map(res => mapDocument(res.data)),
        tap(doc => {
          this._selectedDocument.set(doc);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, payload: CreateDocumentPayload): Observable<Document> {
    return this.api
      .post<ApiResource<DocumentApiResource>>(this.base(projectId), payload)
      .pipe(
        map(res => mapDocument(res.data)),
        tap(doc => this._documents.update(list => [doc, ...list])),
      );
  }

  update(projectId: number, docId: number, payload: UpdateDocumentPayload): Observable<Document> {
    return this.api
      .put<ApiResource<DocumentApiResource>>(`${this.base(projectId)}/${docId}`, payload)
      .pipe(
        map(res => mapDocument(res.data)),
        tap(updated => this.syncUpdated(docId, updated)),
      );
  }

  classify(
    projectId: number,
    docId: number,
    payload: ClassifyDocumentPayload,
  ): Observable<Document> {
    return this.api
      .patch<ApiResource<DocumentApiResource>>(
        `${this.base(projectId)}/${docId}/classify`,
        payload,
      )
      .pipe(
        map(res => mapDocument(res.data)),
        tap(updated => this.syncUpdated(docId, updated)),
      );
  }

  remove(projectId: number, docId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${docId}`).pipe(
      tap(() => {
        this._documents.update(list => list.filter(d => d.id !== docId));
        if (this._selectedDocument()?.id === docId) this._selectedDocument.set(null);
      }),
    );
  }

  uploadVersion(
    projectId: number,
    docId: number,
    file: File,
    comment?: string,
  ): Observable<DocumentVersion> {
    const form = new FormData();
    form.append('file', file, file.name);
    if (comment) form.append('comment', comment);

    this._uploading.set(true);
    return this.api
      .post<ApiResource<DocumentVersionApiResource>>(
        `${this.base(projectId)}/${docId}/upload`,
        form,
      )
      .pipe(
        map(res => mapDocumentVersion(res.data)),
        tap(version => {
          this._uploading.set(false);
          const selected = this._selectedDocument();
          if (selected?.id === docId) {
            this._selectedDocument.set({
              ...selected,
              currentVersion: version,
              versionCount: selected.versionCount + 1,
            });
          }
          this._documents.update(list =>
            list.map(d =>
              d.id === docId
                ? { ...d, currentVersion: version, versionCount: d.versionCount + 1 }
                : d,
            ),
          );
        }),
        catchError(err => {
          this._uploading.set(false);
          throw err;
        }),
      );
  }

  listVersions(projectId: number, docId: number): Observable<DocumentVersion[]> {
    return this.api
      .get<{ data: DocumentVersionApiResource[] }>(`${this.base(projectId)}/${docId}/versions`)
      .pipe(map(res => res.data.map(mapDocumentVersion)));
  }

  revertVersion(projectId: number, docId: number, versionId: number): Observable<DocumentVersion> {
    return this.api
      .post<ApiResource<DocumentVersionApiResource>>(
        `${this.base(projectId)}/${docId}/versions/${versionId}/revert`,
        {},
      )
      .pipe(
        map(res => mapDocumentVersion(res.data)),
        tap(newVersion => {
          const selected = this._selectedDocument();
          if (selected?.id === docId) {
            this._selectedDocument.set({
              ...selected,
              currentVersion: newVersion,
              versionCount: selected.versionCount + 1,
            });
          }
          this._documents.update(list =>
            list.map(d =>
              d.id === docId
                ? { ...d, currentVersion: newVersion, versionCount: d.versionCount + 1 }
                : d,
            ),
          );
        }),
      );
  }

  loadEditorConfig(projectId: number, docId: number): Observable<EditorConfigApiResource> {
    return this.api
      .get<ApiResource<EditorConfigApiResource>>(`${this.base(projectId)}/${docId}/editor-config`)
      .pipe(map(res => res.data));
  }

  download(projectId: number, docId: number, versionId?: number): void {
    const params: Record<string, string> = {};
    if (versionId) params['version'] = String(versionId);

    this.http
      .get(`${environment.apiUrl}${this.base(projectId)}/${docId}/download`, {
        responseType: 'blob',
        params,
      })
      .subscribe({
        next: blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const doc = this._selectedDocument();
          a.download = doc?.currentVersion?.fileName ?? 'document';
          a.click();
          URL.revokeObjectURL(url);
        },
      });
  }

  listReviewQueue(projectId: number): Observable<Document[]> {
    this._reviewQueueLoading.set(true);
    return this.api
      .get<PaginatedApiResource<DocumentApiResource>>(`${this.base(projectId)}/review-queue`)
      .pipe(
        map(res => res.data.map(mapDocument)),
        tap(docs => {
          this._reviewQueue.set(docs);
          this._reviewQueueLoading.set(false);
        }),
        catchError(err => {
          this._reviewQueueLoading.set(false);
          throw err;
        }),
      );
  }

  acceptClassification(
    projectId: number,
    docId: number,
    payload: ClassifyDocumentPayload,
  ): Observable<Document> {
    return this.classify(projectId, docId, payload).pipe(
      switchMap(() => this.update(projectId, docId, { status: 'confirmed' })),
      tap(() => this.removeFromQueue(docId)),
    );
  }

  confirmQueueItem(projectId: number, docId: number): Observable<Document> {
    return this.update(projectId, docId, { status: 'confirmed' }).pipe(
      tap(() => this.removeFromQueue(docId)),
    );
  }

  private removeFromQueue(docId: number): void {
    this._reviewQueue.update(list => list.filter(d => d.id !== docId));
  }

  private syncUpdated(docId: number, updated: Document): void {
    this._documents.update(list => list.map(d => (d.id === docId ? updated : d)));
    if (this._selectedDocument()?.id === docId) this._selectedDocument.set(updated);
  }
}
