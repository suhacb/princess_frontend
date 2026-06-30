import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntityDocumentCardComponent } from './entity-document-card.component';
import { DocumentService } from '../../services/document.service';
import type { Document } from '../../contracts/document.contracts';

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
function setup(opts: { docSvcMock?: any; dialogMock?: any; routerMock?: any } = {}) {
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
  fixture.componentRef.setInput('entityType', 'stage');
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
  });

  describe('not-linked state', () => {
    it('renders empty state when no document is set', () => {
      const { fixture } = setup();
      expect(fixture.debugElement.query(By.css('.edc__empty'))).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('No document linked');
    });

    it('shows "Link existing" and "Create from template" buttons', () => {
      const { fixture } = setup();
      const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map(b => b.textContent?.trim());
      expect(labels.some(l => l?.includes('Link existing'))).toBe(true);
      expect(labels.some(l => l?.includes('Create from template'))).toBe(true);
    });

    it('opens link dialog on "Link existing" click', () => {
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }) };
      const { fixture } = setup({ dialogMock });
      const btn = fixture.nativeElement.querySelector('button[mat-stroked-button]') as HTMLButtonElement;
      btn.click();
      expect(dialogMock.open).toHaveBeenCalled();
    });
  });

  describe('linked state', () => {
    it('shows document title and type label after setDocument()', () => {
      const { fixture } = setup();
      fixture.componentInstance.setDocument(makeDoc());
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Stage Plan');
      expect(fixture.debugElement.query(By.css('.edc__linked'))).toBeTruthy();
    });

    it('navigates to document registry on "Open" click', () => {
      const { fixture, routerMock } = setup();
      fixture.componentInstance.setDocument(makeDoc({ id: 7 }));
      fixture.detectChanges();
      const openBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Open document"]');
      openBtn.click();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/p', 3, 'documents', 7]);
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

      fixture.componentInstance.setDocument(makeDoc({ id: 5 }));
      fixture.detectChanges();

      const unlinkBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Unlink document"]');
      unlinkBtn.click();

      expect(docSvcMock.unlinkDocument).toHaveBeenCalledWith(3, 5);
      expect(fixture.componentInstance['linkedDocument']()).toBeNull();
      expect(emitted).toEqual([null]);
    });

    it('shows error when unlink fails', () => {
      const docSvcMock = {
        create: vi.fn(), linkDocument: vi.fn(),
        unlinkDocument: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
        searchForLinking: vi.fn(),
      };
      const dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
      const { fixture } = setup({ docSvcMock, dialogMock });

      fixture.componentInstance.setDocument(makeDoc());
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
      const dialogMock = {
        open: vi.fn().mockReturnValue({ afterClosed: () => of(selectedDoc) }),
      };
      const { fixture } = setup({ docSvcMock, dialogMock });
      const emitted: (Document | null)[] = [];
      fixture.componentInstance.linkChanged.subscribe((d: Document | null) => emitted.push(d));

      fixture.nativeElement.querySelector('button[mat-stroked-button]').click();

      expect(docSvcMock.linkDocument).toHaveBeenCalledWith(3, 10, 'stage', 42);
      expect(emitted[0]).toEqual(selectedDoc);
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
  });
});
