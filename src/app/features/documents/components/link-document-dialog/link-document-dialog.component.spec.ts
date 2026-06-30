import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
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
function setup(opts: { docs?: Document[]; allowedTypes?: string[] } = {}) {
  const docs = opts.docs ?? [makeDoc()];
  const svcMock = { searchForLinking: vi.fn().mockReturnValue(of(docs)) };
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
  it('loads documents on init', () => {
    const { svcMock } = setup();
    expect(svcMock.searchForLinking).toHaveBeenCalledWith(3, undefined);
  });

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

  it('selects a document on item click', () => {
    const { fixture } = setup();
    const item: HTMLElement = fixture.nativeElement.querySelector('.ld__item');
    item.click();
    fixture.detectChanges();
    expect(item.classList).toContain('ld__item--selected');
  });

  it('closes dialog with selected document on confirm', () => {
    const doc = makeDoc({ id: 7 });
    const { fixture, dialogRefMock } = setup({ docs: [doc] });

    fixture.nativeElement.querySelector('.ld__item').click();
    fixture.detectChanges();

    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[mat-flat-button]');
    confirmBtn.click();

    expect(dialogRefMock.close).toHaveBeenCalledWith(doc);
  });

  it('keeps confirm button disabled until a document is selected', () => {
    const { fixture } = setup();
    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[mat-flat-button]');
    expect(confirmBtn.disabled).toBe(true);
  });

  it('shows type labels in hint text', () => {
    const { fixture } = setup({ allowedTypes: ['stage_plan'] });
    expect(fixture.nativeElement.textContent).toContain('Stage Plan');
  });
});
