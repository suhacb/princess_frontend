import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesPageComponent } from './templates-page.component';
import { DocumentTemplateService } from '../../services/document-template.service';
import { ProjectService } from '../../../projects/services/project.service';
import { DocumentTemplateNode } from '../../contracts/document-template.contracts';

const stubRoot: DocumentTemplateNode = {
  id: 1, parentId: null, level: 'project', category: null, type: null,
  name: 'Root Template', description: null, fileName: null, s3Key: null,
  settings: {}, kind: 'root', categoryLabel: null, typeLabel: null,
  createdAt: new Date(), updatedAt: new Date(),
  children: [], effectiveSettings: {},
};

const stubCategoryNode: DocumentTemplateNode = {
  ...stubRoot,
  id: 2, parentId: 1, category: 'initiation', type: null,
  name: 'Initiation', kind: 'category', categoryLabel: 'Initiation',
  children: [],
};

const stubRootWithChild: DocumentTemplateNode = {
  ...stubRoot,
  children: [stubCategoryNode],
};

function setup(tree: DocumentTemplateNode[] = [], selected: DocumentTemplateNode | null = null) {
  const treeSignal = signal<DocumentTemplateNode[]>(tree);
  const selectedSignal = signal<DocumentTemplateNode | null>(selected);
  const loadingSignal = signal(false);

  const templateService = {
    tree: treeSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    saving: signal(false).asReadonly(),
    selected: selectedSignal.asReadonly(),
    selectedId: signal<number | null>(null).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
    select: vi.fn((id: number | null) => selectedSignal.set(id ? tree.find(t => t.id === id) ?? null : null)),
    create: vi.fn().mockReturnValue(of(stubRoot)),
    update: vi.fn().mockReturnValue(of(stubRoot)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    uploadFile: vi.fn().mockReturnValue(of(stubRoot)),
    _loadingSignal: loadingSignal,
  };
  const projectService = {
    selectedProject: signal({ id: 3, name: 'Test Project' } as never).asReadonly(),
  };
  const dialogSpy = { open: vi.fn().mockReturnValue({ afterClosed: () => of(null) }) };

  TestBed.configureTestingModule({
    imports: [TemplatesPageComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentTemplateService, useValue: templateService },
      { provide: ProjectService, useValue: projectService },
      { provide: MatDialog, useValue: dialogSpy },
    ],
  });

  const fixture: ComponentFixture<TemplatesPageComponent> =
    TestBed.createComponent(TemplatesPageComponent);
  fixture.detectChanges();
  return { fixture, templateService, treeSignal, selectedSignal, loadingSignal, dialogSpy };
}

describe('TemplatesPageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init with project id', () => {
    const { templateService } = setup();
    expect(templateService.list).toHaveBeenCalledWith(3);
  });

  it('shows empty state when tree is empty', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.textContent).toContain('No templates configured');
  });

  it('renders root nodes in the tree', () => {
    const { fixture } = setup([stubRootWithChild]);
    expect(fixture.nativeElement.textContent).toContain('Root Template');
  });

  it('shows detail pane when a node is selected', () => {
    const { fixture } = setup([stubRoot], stubRoot);
    expect(fixture.nativeElement.querySelector('app-template-node-detail')).not.toBeNull();
  });

  it('does not show detail pane when nothing is selected', () => {
    const { fixture } = setup([stubRoot], null);
    expect(fixture.nativeElement.querySelector('app-template-node-detail')).toBeNull();
  });

  it('calls select(null) on close detail click', () => {
    const { fixture, templateService } = setup([stubRoot], stubRoot);
    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Close detail"]');
    closeBtn.click();
    expect(templateService.select).toHaveBeenCalledWith(null);
  });

  it('opens create dialog on "New template" click', () => {
    const { fixture, dialogSpy } = setup([]);
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    btn.click();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('expands root node to reveal children when expand button clicked', () => {
    const { fixture } = setup([stubRootWithChild]);
    const expandBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.tree-node__expand-btn');
    expandBtn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Initiation');
  });

  it('selects node when row is clicked', () => {
    const { fixture, templateService } = setup([stubRoot]);
    const row: HTMLButtonElement = fixture.nativeElement.querySelector('.tree-node__row');
    row.click();
    expect(templateService.select).toHaveBeenCalledWith(1);
  });

  it('shows skeleton rows while loading', () => {
    const { fixture, loadingSignal } = setup([]);
    loadingSignal.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('shows file badge in tree for leaf nodes with a file', () => {
    const leafWithFile: DocumentTemplateNode = {
      ...stubCategoryNode,
      id: 3, parentId: 1, category: 'initiation', type: 'project_brief',
      kind: 'type', typeLabel: 'Project Brief',
      fileName: 'brief.docx', s3Key: 'templates/brief.docx',
    };
    const rootWithLeaf: DocumentTemplateNode = {
      ...stubRoot,
      children: [{ ...stubCategoryNode, children: [leafWithFile] }],
    };
    const { fixture } = setup([rootWithLeaf]);
    // expand root then category
    const expandBtns: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.tree-node__expand-btn');
    expandBtns[0].click();
    fixture.detectChanges();
    const expandBtns2: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.tree-node__expand-btn');
    expandBtns2[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.file-badge')).not.toBeNull();
  });

  it('shows exact empty state hint text', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.textContent).toContain('Create a root template to define project-wide styling');
  });

  it('calls service.create when create dialog returns a payload', () => {
    const { fixture, templateService, dialogSpy } = setup([]);
    dialogSpy.open.mockReturnValue({ afterClosed: () => of({ name: 'New Root', parent_id: null }) });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    btn.click();
    expect(templateService.create).toHaveBeenCalledWith(3, { name: 'New Root', parent_id: null });
  });

  it('does not call service.create when create dialog is cancelled', () => {
    const { fixture, templateService, dialogSpy } = setup([]);
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(null) });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    btn.click();
    expect(templateService.create).not.toHaveBeenCalled();
  });
});
