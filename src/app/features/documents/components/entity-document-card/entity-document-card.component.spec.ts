import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntityDocumentCardComponent } from './entity-document-card.component';
import { DocumentService } from '../../services/document.service';
import type { Document, DocumentVersion } from '../../contracts/document.contracts';

function makeVersion(overrides: Partial<DocumentVersion> = {}): DocumentVersion {
  return {
    id: 12, documentId: 1, versionNumber: 1, fileName: 'doc.docx',
    fileSize: 1024,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    comment: null, uploadedBy: { id: 5, name: 'Alice' }, uploadedAt: new Date(),
    ...overrides,
  };
}

function makeDoc(overrides: Partial<Document> = {}): Document {
  return {
    id: 1, projectId: 3, title: 'Stage Plan',
    type: 'stage_plan', typeLabel: 'Stage Plan',
    category: 'planning', categoryLabel: 'Planning',
    status: 'draft', tags: [], owner: null,
    currentVersion: null,
    versionCount: 0, createdAt: new Date(), updatedAt: new Date(),
    ...overrides,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(opts: { docSvcMock?: any; dialogMock?: any; routerMock?: any; entityType?: string } = {}) {
  const docSvcMock = opts.docSvcMock ?? {
    create: vi.fn(), linkDocument: vi.fn(), unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
  };
  const dialogMock = opts.dialogMock ?? { open: vi.fn() };
  const routerMock = opts.routerMock ?? { navigate: vi.fn() };

  TestBed.configureTestingModule({
    imports: [EntityDocumentCardComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: docSvcMock },
      { provide: MatDialog, useValue: dialogMock },
      { provide: Router, useValue: routerMock },
    ],
  });

  const fixture = TestBed.createComponent(EntityDocumentCardComponent);
  fixture.componentRef.setInput('projectId', 3);
  fixture.componentRef.setInput('entityType', opts.entityType ?? 'stage');
  fixture.componentRef.setInput('entityId', 42);
  fixture.detectChanges();
  return { fixture, docSvcMock, dialogMock, routerMock };
}

afterEach(() => TestBed.resetTestingModule());

describe('EntityDocumentCardComponent', () => {
  describe('loading state', () => {
    it('renders skeleton when loading=true and no linked doc', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.edc__skeleton'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.edc__linked'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.edc__empty'))).toBeNull();
    });

    it('renders skeleton when loading=true even when a doc is already linked', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc());
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.edc__skeleton'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.edc__linked'))).toBeNull();
    });
  });

  describe('initialDocument input', () => {
    it('syncs linked document when initialDocument input is set', () => {
      const { fixture } = setup();
      expect(fixture.debugElement.query(By.css('.edc__empty'))).toBeTruthy();

      fixture.componentRef.setInput('initialDocument', makeDoc({ title: 'My Plan' }));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.edc__linked'))).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('My Plan');
    });

    it('reverts to not-linked state when initialDocument changes back to null', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc());
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.edc__linked'))).toBeTruthy();

      fixture.componentRef.setInput('initialDocument', null);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.edc__empty'))).toBeTruthy();
    });
  });

  describe('not-linked state', () => {
    it('renders empty state when no document is set', () => {
      const { fixture } = setup();
      expect(fixture.debugElement.query(By.css('.edc__empty'))).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('No document linked');
    });

    it('shows "Link existing" and "Create from template" buttons', () => {
      const { fixture } = setup();
      const labels = Array.from(fixture.nativeElement.querySelectorAll('button'))
        .map((b) => (b as HTMLButtonElement).textContent?.trim());
      expect(labels.some(l => l?.includes('Link existing'))).toBe(true);
      expect(labels.some(l => l?.includes('Create from template'))).toBe(true);
    });

    it('shows a single "Create from template" button for single-type entity (stage)', () => {
      const { fixture } = setup({ entityType: 'stage' });
      expect(fixture.debugElement.query(By.css('[matMenuTriggerFor]'))).toBeNull();
    });

    it('shows a mat-menu trigger for multi-type entity (meeting)', () => {
      const { fixture } = setup({ entityType: 'meeting' });
      // mat-menu is only rendered for multi-type entities
      expect(fixture.debugElement.query(By.css('mat-menu'))).toBeTruthy();
    });

    it('opens link dialog on "Link existing" click', () => {
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }) };
      const { fixture } = setup({ dialogMock });
      fixture.nativeElement.querySelector('button[mat-stroked-button]').click();
      expect(dialogMock.open).toHaveBeenCalled();
    });

    it('disables both buttons while working', () => {
      const linkSubject = new Subject<void>();
      const docSvcMock = {
        create: vi.fn(), searchForLinking: vi.fn(), unlinkDocument: vi.fn(),
        linkDocument: vi.fn().mockReturnValue(linkSubject),
      };
      // afterClosed emits synchronously so switchMap starts; linkSubject keeps it in-flight
      const dialogMock = {
        open: vi.fn().mockReturnValue({ afterClosed: () => of(makeDoc()) }),
      };
      const { fixture } = setup({ docSvcMock, dialogMock });

      fixture.nativeElement.querySelector('button[mat-stroked-button]').click();
      fixture.detectChanges(); // working() is still true — linkSubject never emitted

      const disabled = Array.from(fixture.nativeElement.querySelectorAll('button[disabled]'));
      expect(disabled.length).toBeGreaterThan(0);
    });
  });

  describe('linked state', () => {
    it('shows document title and type chip after initialDocument set', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc());
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Stage Plan');
      expect(fixture.debugElement.query(By.css('.edc__linked'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('app-status-chip'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('app-document-status-chip'))).toBeTruthy();
    });

    it('navigates to document registry on "Open" click', () => {
      const { fixture, routerMock } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc({ id: 7 }));
      fixture.detectChanges();
      fixture.nativeElement.querySelector('[aria-label="Open document"]').click();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/p', 3, 'documents', 7]);
    });

    it('does not show Edit button when canEdit is false (null currentVersion)', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc({ currentVersion: null }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[aria-label="Edit document"]')).toBeNull();
    });

    it('does not show Edit button when status is confirmed', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc({
        status: 'confirmed',
        currentVersion: makeVersion(),
      }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[aria-label="Edit document"]')).toBeNull();
    });

    it('does not show Edit button for non-editable MIME type', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc({
        currentVersion: makeVersion({ mimeType: 'image/png' }),
      }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[aria-label="Edit document"]')).toBeNull();
    });

    it('shows Edit button and navigates to editor when canEdit is true', () => {
      const { fixture, routerMock } = setup();
      fixture.componentRef.setInput('initialDocument', makeDoc({
        id: 5,
        status: 'draft',
        currentVersion: makeVersion({ mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      }));
      fixture.detectChanges();
      const editBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Edit document"]');
      expect(editBtn).toBeTruthy();
      editBtn.click();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/p', 3, 'documents', 5, 'edit']);
    });

    it('calls unlinkDocument and emits null after confirm', () => {
      const docSvcMock = {
        create: vi.fn(), linkDocument: vi.fn(),
        unlinkDocument: vi.fn().mockReturnValue(of(undefined)),
        searchForLinking: vi.fn(),
      };
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
      const { fixture } = setup({ docSvcMock, dialogMock });
      const emitted: (Document | null)[] = [];
      fixture.componentInstance.linkChanged.subscribe((d: Document | null) => emitted.push(d));

      fixture.componentRef.setInput('initialDocument', makeDoc({ id: 5 }));
      fixture.detectChanges();
      fixture.nativeElement.querySelector('[aria-label="Unlink document"]').click();

      expect(docSvcMock.unlinkDocument).toHaveBeenCalledWith(3, 5);
      expect(fixture.componentInstance['linkedDocument']()).toBeNull();
      expect(emitted).toEqual([null]);
    });

    it('does not call unlinkDocument when confirm is cancelled', () => {
      const docSvcMock = {
        create: vi.fn(), linkDocument: vi.fn(),
        unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
      };
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(false) }) };
      const { fixture } = setup({ docSvcMock, dialogMock });

      fixture.componentRef.setInput('initialDocument', makeDoc());
      fixture.detectChanges();
      fixture.nativeElement.querySelector('[aria-label="Unlink document"]').click();

      expect(docSvcMock.unlinkDocument).not.toHaveBeenCalled();
      expect(fixture.componentInstance['linkedDocument']()).not.toBeNull();
    });

    it('shows error when unlink fails', () => {
      const docSvcMock = {
        create: vi.fn(), linkDocument: vi.fn(),
        unlinkDocument: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
        searchForLinking: vi.fn(),
      };
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
      const { fixture } = setup({ docSvcMock, dialogMock });

      fixture.componentRef.setInput('initialDocument', makeDoc());
      fixture.detectChanges();
      fixture.nativeElement.querySelector('[aria-label="Unlink document"]').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Failed to remove link');
    });
  });

  describe('link via dialog', () => {
    it('calls linkDocument and emits the doc after dialog confirms', () => {
      const selectedDoc = makeDoc({ id: 10, title: 'Existing Doc' });
      const docSvcMock = {
        create: vi.fn(),
        linkDocument: vi.fn().mockReturnValue(of(undefined)),
        unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
      };
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(selectedDoc) }) };
      const { fixture } = setup({ docSvcMock, dialogMock });
      const emitted: (Document | null)[] = [];
      fixture.componentInstance.linkChanged.subscribe((d: Document | null) => emitted.push(d));

      fixture.nativeElement.querySelector('button[mat-stroked-button]').click();

      expect(docSvcMock.linkDocument).toHaveBeenCalledWith(3, 10, 'stage', 42);
      expect(emitted[0]).toEqual(selectedDoc);
    });

    it('shows error when linkDocument fails after dialog selection', () => {
      const selectedDoc = makeDoc({ id: 10 });
      const docSvcMock = {
        create: vi.fn(),
        linkDocument: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
        unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
      };
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(selectedDoc) }) };
      const { fixture } = setup({ docSvcMock, dialogMock });

      fixture.nativeElement.querySelector('button[mat-stroked-button]').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Failed to link document');
    });
  });

  describe('createAndLink()', () => {
    it('creates document, links it, then navigates to the new doc', () => {
      const newDoc = makeDoc({ id: 99, title: 'Stage Plan' });
      const docSvcMock = {
        create: vi.fn().mockReturnValue(of(newDoc)),
        linkDocument: vi.fn().mockReturnValue(of(undefined)),
        unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
      };
      const routerMock = { navigate: vi.fn() };
      const { fixture } = setup({ docSvcMock, routerMock });

      fixture.componentInstance.createAndLink('stage_plan');

      expect(docSvcMock.create).toHaveBeenCalledWith(3, expect.objectContaining({ type: 'stage_plan' }));
      expect(docSvcMock.linkDocument).toHaveBeenCalledWith(3, 99, 'stage', 42);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/p', 3, 'documents', 99]);
    });

    it('shows error when create fails', () => {
      const docSvcMock = {
        create: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
        linkDocument: vi.fn(), unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
      };
      const { fixture } = setup({ docSvcMock });

      fixture.componentInstance.createAndLink('stage_plan');
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Failed to create document');
    });

    it('shows error when create succeeds but linkDocument fails', () => {
      const newDoc = makeDoc({ id: 99 });
      const docSvcMock = {
        create: vi.fn().mockReturnValue(of(newDoc)),
        linkDocument: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
        unlinkDocument: vi.fn(), searchForLinking: vi.fn(),
      };
      const { fixture } = setup({ docSvcMock });

      fixture.componentInstance.createAndLink('stage_plan');
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Document created but linking failed');
    });
  });
});
