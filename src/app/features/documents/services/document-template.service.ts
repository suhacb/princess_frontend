import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  DocumentTemplate,
  DocumentTemplateApiResource,
  DocumentTemplateNode,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  buildTemplateTree,
  mapDocumentTemplate,
} from '../contracts/document-template.contracts';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService {
  private readonly api = inject(ApiService);

  private readonly _templates = signal<DocumentTemplate[]>([]);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _selectedId = signal<number | null>(null);

  readonly templates = this._templates.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();

  readonly tree = computed<DocumentTemplateNode[]>(() => buildTemplateTree(this._templates()));

  readonly selected = computed<DocumentTemplateNode | null>(() => {
    const id = this._selectedId();
    if (id === null) return null;
    return this.findInTree(this.tree(), id);
  });

  private base(projectId: number): string {
    return `/projects/${projectId}/templates`;
  }

  list(projectId: number): Observable<DocumentTemplate[]> {
    this._loading.set(true);
    return this.api
      .get<{ data: DocumentTemplateApiResource[] }>(this.base(projectId))
      .pipe(
        map(res => res.data.map(mapDocumentTemplate)),
        tap(templates => {
          this._templates.set(templates);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, payload: CreateTemplatePayload): Observable<DocumentTemplate> {
    this._saving.set(true);
    return this.api
      .post<ApiResource<DocumentTemplateApiResource>>(this.base(projectId), payload)
      .pipe(
        map(res => mapDocumentTemplate(res.data)),
        tap(t => {
          this._templates.update(list => [...list, t]);
          this._saving.set(false);
        }),
        catchError(err => {
          this._saving.set(false);
          throw err;
        }),
      );
  }

  update(
    projectId: number,
    templateId: number,
    payload: UpdateTemplatePayload,
  ): Observable<DocumentTemplate> {
    this._saving.set(true);
    return this.api
      .put<ApiResource<DocumentTemplateApiResource>>(
        `${this.base(projectId)}/${templateId}`,
        payload,
      )
      .pipe(
        map(res => mapDocumentTemplate(res.data)),
        tap(updated => {
          this._templates.update(list => list.map(t => (t.id === templateId ? updated : t)));
          this._saving.set(false);
        }),
        catchError(err => {
          this._saving.set(false);
          throw err;
        }),
      );
  }

  remove(projectId: number, templateId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${templateId}`).pipe(
      tap(() => {
        this._templates.update(list => list.filter(t => t.id !== templateId));
        if (this._selectedId() === templateId) this._selectedId.set(null);
      }),
    );
  }

  uploadFile(
    projectId: number,
    templateId: number,
    file: File,
  ): Observable<DocumentTemplate> {
    const form = new FormData();
    form.append('file', file, file.name);
    this._saving.set(true);
    return this.api
      .post<ApiResource<DocumentTemplateApiResource>>(
        `${this.base(projectId)}/${templateId}/upload`,
        form,
      )
      .pipe(
        map(res => mapDocumentTemplate(res.data)),
        tap(updated => {
          this._templates.update(list => list.map(t => (t.id === templateId ? updated : t)));
          this._saving.set(false);
        }),
        catchError(err => {
          this._saving.set(false);
          throw err;
        }),
      );
  }

  select(id: number | null): void {
    this._selectedId.set(id);
  }

  private findInTree(nodes: DocumentTemplateNode[], id: number): DocumentTemplateNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = this.findInTree(node.children, id);
      if (found) return found;
    }
    return null;
  }
}
