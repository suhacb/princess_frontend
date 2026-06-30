import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LinkDocumentDialogComponent } from './link-document-dialog.component';
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
function setup(opts: { docs?: Document[]; allowedTypes?: string[]; svcMock?: any } = {}) {
  const docs = opts.docs ?? [makeDoc()];
  const svcMock = opts.svcMock ?? { searchForLinking: vi.fn().mockReturnValue(of(docs)) };
  const dialogRefMock = { close: vi.fn() };

  TestBed.configureTestingModule({
    imports: [LinkDocumentDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: svcMock },
      { provide: MatDialogRef, useValue: dialogRefMock },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { projectId: 3, allowedTypes: opts.allowedTypes ?? ['stage_plan'] },
      },
    ],
  });

  const fixture = TestBed.createComponent(LinkDocumentDialogComponent);
  fixture.detectChanges();
  return { fixture, svcMock, dialogRefMock };
}

afterEach(() => TestBed.resetTestingModule());

describe('LinkDocumentDialogComponent', () => {
  describe('initial load', () => {
    it('calls searchForLinking on init with no query', () => {
      const { svcMock } = setup();
      expect(svcMock.searchForLinking).toHaveBeenCalledWith(3, undefined);
    });

    it('shows loading skeletons while fetch is in-flight', () => {
      const subject = new Subject<Document[]>();
      const svcMock = { searchForLinking: vi.fn().mockReturnValue(subject) };
      const { fixture } = setup({ svcMock });
      expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
      expect(fixture.debugElement.query(By.css('.ld__list'))).toBeNull();
    });

    it('shows results after fetch resolves', () => {
      const { fixture } = setup({ docs: [makeDoc()] });
      expect(fixture.nativeElement.querySelectorAll('.ld__item').length).toBe(1);
      expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBe(0);
    });
  });

  describe('type filtering', () => {
    it('filters results to allowed types only', () => {
      const docs = [
        makeDoc({ id: 1, type: 'stage_plan', typeLabel: 'Stage Plan' }),
        makeDoc({ id: 2, type: 'meeting_minutes', typeLabel: 'Meeting Minutes' }),
      ];
      const { fixture } = setup({ docs, allowedTypes: ['stage_plan'] });
      const items = fixture.nativeElement.querySelectorAll('.ld__item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('Stage Plan');
    });

    it('shows empty state when no compatible results', () => {
      const docs = [makeDoc({ type: 'meeting_minutes', typeLabel: 'Meeting Minutes' })];
      const { fixture } = setup({ docs, allowedTypes: ['stage_plan'] });
      expect(fixture.nativeElement.textContent).toContain('No compatible documents found');
    });

    it('shows all allowed types in hint text for multi-type entity', () => {
      const docs = [
        makeDoc({ id: 1, type: 'meeting_agenda', typeLabel: 'Meeting Agenda' }),
        makeDoc({ id: 2, type: 'meeting_minutes', typeLabel: 'Meeting Minutes' }),
      ];
      const { fixture } = setup({ docs, allowedTypes: ['meeting_agenda', 'meeting_minutes'] });
      const hint = fixture.nativeElement.querySelector('.ld__type-hint').textContent;
      expect(hint).toContain('Meeting Agenda');
      expect(hint).toContain('Meeting Minutes');
    });
  });

  describe('search', () => {
    it('re-fetches with search term after debounce', async () => {
      const svcMock = { searchForLinking: vi.fn().mockReturnValue(of([])) };
      const { fixture } = setup({ svcMock });

      svcMock.searchForLinking.mockClear();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fixture.componentInstance as any).searchControl.setValue('plan');

      await new Promise(r => setTimeout(r, 350));
      fixture.detectChanges();

      expect(svcMock.searchForLinking).toHaveBeenCalledWith(3, 'plan');
    });
  });

  describe('selection and confirm', () => {
    it('selects a document on item click', () => {
      const { fixture } = setup();
      const item: HTMLElement = fixture.nativeElement.querySelector('.ld__item');
      item.click();
      fixture.detectChanges();
      expect(item.classList).toContain('ld__item--selected');
    });

    it('keeps confirm button disabled until a document is selected', () => {
      const { fixture } = setup();
      const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[mat-flat-button]');
      expect(confirmBtn.disabled).toBe(true);
    });

    it('closes dialog with selected document on confirm', () => {
      const doc = makeDoc({ id: 7 });
      const { fixture, dialogRefMock } = setup({ docs: [doc] });

      fixture.nativeElement.querySelector('.ld__item').click();
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button[mat-flat-button]').click();

      expect(dialogRefMock.close).toHaveBeenCalledWith(doc);
    });

    it('shows type labels in hint text', () => {
      const { fixture } = setup({ allowedTypes: ['stage_plan'] });
      expect(fixture.nativeElement.textContent).toContain('Stage Plan');
    });
  });

  describe('cancel', () => {
    it('closes dialog without a value when Cancel is clicked', () => {
      const { fixture, dialogRefMock } = setup();
      const cancelBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[mat-dialog-close]');
      cancelBtn.click();
      expect(dialogRefMock.close).not.toHaveBeenCalledWith(expect.objectContaining({ id: expect.anything() }));
    });
  });
});
