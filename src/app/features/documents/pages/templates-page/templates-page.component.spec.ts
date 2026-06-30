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
};

const stubRootWithChild: DocumentTemplateNode = {
  ...stubRoot,
  children: [stubCategoryNode],
};

function setup(tree: DocumentTemplateNode[] = [], selected: DocumentTemplateNode | null = null) {
  const treeSignal = signal<DocumentTemplateNode[]>(tree);
  const selectedSignal = signal<DocumentTemplateNode | null>(selected);

  const templateService = {
    tree: treeSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    saving: signal(false).asReadonly(),
    selected: selectedSignal.asReadonly(),
    selectedId: signal<number | null>(null).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
    select: vi.fn((id: number | null) => selectedSignal.set(id ? tree.find(t => t.id === id) ?? null : null)),
    create: vi.fn().mockReturnValue(of(stubRoot)),
    update: vi.fn().mockReturnValue(of(stubRoot)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    uploadFile: vi.fn().mockReturnValue(of(stubRoot)),
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
  return { fixture, templateService, treeSignal, selectedSignal, dialogSpy };
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
});
