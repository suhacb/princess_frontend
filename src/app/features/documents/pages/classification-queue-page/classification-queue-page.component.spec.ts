import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ClassificationQueuePageComponent } from './classification-queue-page.component';
import { DocumentService } from '../../services/document.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Document } from '../../contracts/document.contracts';

const stubDoc: Document = {
  id: 1,
  projectId: 3,
  title: 'Project Brief',
  type: 'project_brief',
  typeLabel: 'Project Brief',
  category: 'initiation',
  categoryLabel: 'Initiation',
  status: 'in_review',
  tags: ['urgent'],
  owner: { id: 5, name: 'Alice' },
  currentVersion: {
    id: 12,
    documentId: 1,
    versionNumber: 1,
    fileName: 'brief.docx',
    fileSize: 1024,
    mimeType: 'application/pdf',
    comment: null,
    uploadedBy: { id: 5, name: 'Alice' },
    uploadedAt: new Date('2026-06-01T10:00:00Z'),
  },
  versionCount: 1,
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-01T09:00:00Z'),
};

const stubDoc2: Document = {
  ...stubDoc,
  id: 2,
  title: 'Risk Register',
  type: 'risk_register',
  typeLabel: 'Risk Register',
  category: 'register',
  categoryLabel: 'Register',
  tags: [],
};

function setup(queue: Document[] = []) {
  const queueSignal = signal<Document[]>(queue);
  const documentService = {
    reviewQueue: queueSignal.asReadonly(),
    reviewQueueLoading: signal(false).asReadonly(),
    reviewQueueCount: signal(queue.length),
    listReviewQueue: vi.fn().mockReturnValue(of(queue)),
    acceptClassification: vi.fn().mockReturnValue(of(stubDoc)),
    confirmQueueItem: vi.fn().mockReturnValue(of(stubDoc)),
    update: vi.fn().mockReturnValue(of(stubDoc)),
    _queueSignal: queueSignal,
  };
  const projectService = {
    selectedProject: signal({ id: 3, name: 'Test Project' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [ClassificationQueuePageComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: documentService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<ClassificationQueuePageComponent> = TestBed.createComponent(ClassificationQueuePageComponent);
  fixture.detectChanges();
  return { fixture, documentService, queueSignal };
}

describe('ClassificationQueuePageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls listReviewQueue on init with project id', () => {
    const { documentService } = setup();
    expect(documentService.listReviewQueue).toHaveBeenCalledWith(3);
  });

  it('shows empty state when queue is empty', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('does not show table when queue is empty', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('.queue-table')).toBeFalsy();
  });

  it('renders a row for each document', () => {
    const { fixture } = setup([stubDoc, stubDoc2]);
    const rows = fixture.nativeElement.querySelectorAll('.queue-item');
    expect(rows.length).toBe(2);
  });

  it('renders document title in row', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.textContent).toContain('Project Brief');
  });

  it('renders uploaded-by name from currentVersion', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders existing tags as chips', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.querySelector('.tag-chip')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('urgent');
  });

  it('shows — when document has no tags', () => {
    const { fixture } = setup([stubDoc2]);
    expect(fixture.nativeElement.querySelector('.no-tags')).toBeTruthy();
  });

  it('shows header badge with queue count', () => {
    const { fixture } = setup([stubDoc, stubDoc2]);
    const badge = fixture.nativeElement.querySelector('.queue-header__badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('2');
  });

  it('does not show header badge when queue is empty', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('.queue-header__badge')).toBeFalsy();
  });

  it('toggleExpanded shows classify panel for that document', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as { toggleExpanded: (d: Document) => void };
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-classify-panel')).toBeTruthy();
  });

  it('toggleExpanded hides panel when same doc is clicked again', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as { toggleExpanded: (d: Document) => void };
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-classify-panel')).toBeFalsy();
  });

  it('onAccepted calls acceptClassification and collapses panel', () => {
    const { fixture, documentService } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as {
      toggleExpanded: (d: Document) => void;
      onAccepted: (d: Document, p: { tags: string[] }) => void;
      expandedDocId: () => number | null;
    };
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    comp.onAccepted(stubDoc, { tags: ['qa'] });
    expect(documentService.acceptClassification).toHaveBeenCalledWith(3, 1, { tags: ['qa'] });
  });

  it('onSkipped collapses panel without calling service', () => {
    const { fixture, documentService } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as {
      toggleExpanded: (d: Document) => void;
      onSkipped: (d: Document) => void;
      expandedDocId: () => number | null;
    };
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    comp.onSkipped(stubDoc);
    fixture.detectChanges();
    expect(documentService.acceptClassification).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-classify-panel')).toBeFalsy();
  });

  it('toggleSelect adds/removes doc from selectedIds', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelect: (d: Document) => void;
      selectedIds: () => Set<number>;
    };
    comp.toggleSelect(stubDoc);
    expect(comp.selectedIds().has(1)).toBe(true);
    comp.toggleSelect(stubDoc);
    expect(comp.selectedIds().has(1)).toBe(false);
  });

  it('toggleSelectAll selects all when none selected', () => {
    const { fixture } = setup([stubDoc, stubDoc2]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelectAll: () => void;
      selectedIds: () => Set<number>;
    };
    comp.toggleSelectAll();
    expect(comp.selectedIds().size).toBe(2);
  });

  it('toggleSelectAll deselects all when all selected', () => {
    const { fixture } = setup([stubDoc, stubDoc2]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelectAll: () => void;
      selectedIds: () => Set<number>;
    };
    comp.toggleSelectAll();
    comp.toggleSelectAll();
    expect(comp.selectedIds().size).toBe(0);
  });

  it('shows bulk toolbar when items are selected', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as { toggleSelect: (d: Document) => void };
    comp.toggleSelect(stubDoc);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.bulk-toolbar')).toBeTruthy();
  });

  it('bulk toolbar is hidden when no items selected', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.querySelector('.bulk-toolbar')).toBeFalsy();
  });

  it('bulkConfirm calls confirmQueueItem for each selected doc', () => {
    const { fixture, documentService } = setup([stubDoc, stubDoc2]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelectAll: () => void;
      bulkConfirm: () => void;
    };
    comp.toggleSelectAll();
    comp.bulkConfirm();
    expect(documentService.confirmQueueItem).toHaveBeenCalledTimes(2);
  });

  it('clearSelection empties selectedIds', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelect: (d: Document) => void;
      clearSelection: () => void;
      selectedIds: () => Set<number>;
    };
    comp.toggleSelect(stubDoc);
    expect(comp.selectedIds().size).toBe(1);
    comp.clearSelection();
    expect(comp.selectedIds().size).toBe(0);
  });

  it('allSelected is true when all queue items are in selectedIds', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelect: (d: Document) => void;
      allSelected: () => boolean;
      someSelected: () => boolean;
    };
    comp.toggleSelect(stubDoc);
    expect(comp.allSelected()).toBe(true);
    expect(comp.someSelected()).toBe(false);
  });

  it('someSelected is true when only some items are selected', () => {
    const { fixture } = setup([stubDoc, stubDoc2]);
    const comp = fixture.componentInstance as unknown as {
      toggleSelect: (d: Document) => void;
      allSelected: () => boolean;
      someSelected: () => boolean;
    };
    comp.toggleSelect(stubDoc);
    expect(comp.someSelected()).toBe(true);
    expect(comp.allSelected()).toBe(false);
  });

  it('shows skeleton when loading is true and queue is empty', () => {
    const queueSignal = signal<Document[]>([]);
    const loadingSignal = signal(true);
    const documentService = {
      reviewQueue: queueSignal.asReadonly(),
      reviewQueueLoading: loadingSignal.asReadonly(),
      reviewQueueCount: signal(0),
      listReviewQueue: vi.fn().mockReturnValue(of([])),
      acceptClassification: vi.fn(),
      confirmQueueItem: vi.fn(),
      update: vi.fn(),
    };
    const projectService = {
      selectedProject: signal({ id: 3, name: 'Test' } as never).asReadonly(),
    };
    TestBed.configureTestingModule({
      imports: [ClassificationQueuePageComponent, BrowserAnimationsModule],
      providers: [
        { provide: DocumentService, useValue: documentService },
        { provide: ProjectService, useValue: projectService },
      ],
    });
    const fixture = TestBed.createComponent(ClassificationQueuePageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeFalsy();
  });

  it('renders the type label in the type badge', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.querySelector('.type-badge')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Project Brief');
  });

  it('onAccepted collapses the panel after success', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as {
      toggleExpanded: (d: Document) => void;
      onAccepted: (d: Document, p: object) => void;
      expandedDocId: () => number | null;
    };
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-classify-panel')).toBeTruthy();
    comp.onAccepted(stubDoc, { tags: ['qa'] });
    fixture.detectChanges();
    expect(comp.expandedDocId()).toBeNull();
  });

  it('bulkConfirm does nothing when selection is empty', () => {
    const { fixture, documentService } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as { bulkConfirm: () => void };
    comp.bulkConfirm();
    expect(documentService.confirmQueueItem).not.toHaveBeenCalled();
  });

  it('falls back to owner name when currentVersion is null', () => {
    const docNoVersion: Document = { ...stubDoc, currentVersion: null };
    const { fixture } = setup([docNoVersion]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('Classify button shows Close label when row is expanded', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as unknown as { toggleExpanded: (d: Document) => void };
    comp.toggleExpanded(stubDoc);
    fixture.detectChanges();
    const classifyBtn = fixture.nativeElement.querySelector('.classify-btn') as HTMLButtonElement;
    expect(classifyBtn.textContent?.toLowerCase()).toContain('close');
  });
});
