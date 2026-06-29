import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassifyPanelComponent } from './classify-panel.component';
import { ClassifyDocumentPayload, Document } from '../../contracts/document.contracts';

const stubDoc: Document = {
  id: 1,
  projectId: 3,
  title: 'Project Brief',
  type: 'project_brief',
  typeLabel: 'Project Brief',
  category: 'initiation',
  categoryLabel: 'Initiation',
  status: 'in_review',
  tags: ['urgent', 'phase1'],
  owner: { id: 5, name: 'Alice' },
  currentVersion: null,
  versionCount: 1,
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-01T09:00:00Z'),
};

function setup(doc: Document = stubDoc) {
  TestBed.configureTestingModule({
    imports: [ClassifyPanelComponent, BrowserAnimationsModule],
  });
  const fixture: ComponentFixture<ClassifyPanelComponent> = TestBed.createComponent(ClassifyPanelComponent);
  fixture.componentRef.setInput('document', doc);
  fixture.detectChanges();
  return { fixture, comp: fixture.componentInstance as unknown as { selectedType: () => string; tags: () => string[]; accept: () => void; skip: () => void; addTag: (e: { value: string; chipInput?: { clear: () => void } }) => void; removeTag: (t: string) => void } };
}

describe('ClassifyPanelComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the type select', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-document-type-select')).toBeTruthy();
  });

  it('renders the tags form field', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('mat-chip-grid')).toBeTruthy();
  });

  it('initializes selectedType from document.type', () => {
    const { comp } = setup();
    expect(comp.selectedType()).toBe('project_brief');
  });

  it('initializes tags from document.tags', () => {
    const { comp } = setup();
    expect(comp.tags()).toEqual(['urgent', 'phase1']);
  });

  it('initializes with empty tags when document has none', () => {
    const { comp } = setup({ ...stubDoc, tags: [] });
    expect(comp.tags()).toEqual([]);
  });

  it('addTag adds a new unique tag', () => {
    const { comp } = setup();
    comp.addTag({ value: 'newTag', chipInput: { clear: vi.fn() } });
    expect(comp.tags()).toContain('newTag');
  });

  it('addTag does not add duplicate tags', () => {
    const { comp } = setup();
    comp.addTag({ value: 'urgent', chipInput: { clear: vi.fn() } });
    expect(comp.tags().filter(t => t === 'urgent')).toHaveLength(1);
  });

  it('addTag ignores empty/whitespace values', () => {
    const { comp } = setup();
    const before = comp.tags().length;
    comp.addTag({ value: '   ', chipInput: { clear: vi.fn() } });
    expect(comp.tags().length).toBe(before);
  });

  it('removeTag removes the specified tag', () => {
    const { comp } = setup();
    comp.removeTag('urgent');
    expect(comp.tags()).not.toContain('urgent');
    expect(comp.tags()).toContain('phase1');
  });

  it('renders Accept and Skip buttons', () => {
    const { fixture } = setup();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const labels = [...buttons].map(b => b.textContent?.trim().toLowerCase() ?? '');
    expect(labels.some(l => l.includes('accept'))).toBe(true);
    expect(labels.some(l => l.includes('skip'))).toBe(true);
  });

  it('emits accepted with type and tags when accept() is called', () => {
    const { fixture, comp } = setup();
    let emitted: ClassifyDocumentPayload | undefined;
    fixture.componentInstance.accepted.subscribe((p: ClassifyDocumentPayload) => (emitted = p));
    comp.accept();
    expect(emitted).toEqual({ type: 'project_brief', tags: ['urgent', 'phase1'] });
  });

  it('emits accepted with updated tags after addTag', () => {
    const { fixture, comp } = setup();
    let emitted: ClassifyDocumentPayload | undefined;
    fixture.componentInstance.accepted.subscribe((p: ClassifyDocumentPayload) => (emitted = p));
    comp.addTag({ value: 'critical', chipInput: { clear: vi.fn() } });
    comp.accept();
    expect(emitted?.tags).toContain('critical');
  });

  it('emits skipped when skip() is called', () => {
    const { fixture, comp } = setup();
    let skipped = false;
    fixture.componentInstance.skipped.subscribe(() => (skipped = true));
    comp.skip();
    expect(skipped).toBe(true);
  });
});
