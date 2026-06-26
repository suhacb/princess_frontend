import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WbsTreeComponent } from './wbs-tree.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../contracts/work-package.contracts';

const stubChild: Product = {
  id: 20, projectId: 7, parentId: 1, identifier: null,
  title: 'Auth Module', purpose: null, type: 'specialist', status: 'in_development',
  children: [],
};

const stubProduct: Product = {
  id: 1, projectId: 7, parentId: null, identifier: 'P001',
  title: 'Backend System', purpose: null, type: 'specialist', status: 'draft',
  children: [stubChild],
};

function setup(products: Product[] = [], loading = false) {
  const prodSignal = signal(products);
  const loadingSignal = signal(loading);
  const productService = {
    products: prodSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    list: vi.fn().mockReturnValue(of(products)),
    create: vi.fn().mockReturnValue(of(stubProduct)),
    update: vi.fn().mockReturnValue(of(stubProduct)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    baseline: vi.fn().mockReturnValue(of(stubProduct)),
  };
  const dialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(false) }) };

  TestBed.configureTestingModule({
    imports: [WbsTreeComponent, BrowserAnimationsModule],
    providers: [
      { provide: ProductService, useValue: productService },
      { provide: MatDialog, useValue: dialog },
    ],
  });

  const fixture: ComponentFixture<WbsTreeComponent> = TestBed.createComponent(WbsTreeComponent);
  fixture.componentRef.setInput('projectId', 7);
  fixture.detectChanges();
  return { fixture, productService, dialog, prodSignal, loadingSignal };
}

describe('WbsTreeComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init with projectId', () => {
    const { productService } = setup();
    expect(productService.list).toHaveBeenCalledWith(7);
  });

  it('shows empty state when no products and not loading', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders product title', () => {
    const { fixture } = setup([stubProduct]);
    expect(fixture.nativeElement.textContent).toContain('Backend System');
  });

  it('does not show children when product is collapsed', () => {
    const { fixture } = setup([stubProduct]);
    expect(fixture.nativeElement.textContent).not.toContain('Auth Module');
  });

  it('shows children after expanding product', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.toggle(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Auth Module');
  });

  it('collapseAll hides all children', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.expandAll();
    fixture.detectChanges();
    comp.collapseAll();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Auth Module');
  });

  it('expandAll shows children', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.expandAll();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Auth Module');
  });

  it('selecting a product opens side panel', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.select(stubProduct);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-wbs-side-panel')).toBeTruthy();
  });

  it('clearSelection closes side panel', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.select(stubProduct);
    fixture.detectChanges();
    comp.clearSelection();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-wbs-side-panel')).toBeFalsy();
  });

  it('isSelected returns true for selected product', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.select(stubProduct);
    expect(comp.isSelected(1)).toBe(true);
    expect(comp.isSelected(99)).toBe(false);
  });

  it('startAddRoot sets inline mode to add root', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.startAddRoot();
    expect(comp.isAddingAtRoot()).toBe(true);
  });

  it('saveNew with empty title cancels without calling service', () => {
    const { fixture, productService } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.startAddRoot();
    comp.inlineTitle.set('   ');
    comp.saveNew(null);
    expect(productService.create).not.toHaveBeenCalled();
  });

  it('saveNew calls create with correct parent and default type', () => {
    const { fixture, productService } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.startAddRoot();
    comp.inlineTitle.set('New Product');
    comp.saveNew(null);
    expect(productService.create).toHaveBeenCalledWith(7, expect.objectContaining({
      title: 'New Product',
      type: 'specialist',
      parent_id: null,
    }));
  });

  it('saveNew child passes parent_id to create', () => {
    const { fixture, productService } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.inlineTitle.set('Sub Product');
    comp.saveNew(1);
    expect(productService.create).toHaveBeenCalledWith(7, expect.objectContaining({ parent_id: 1 }));
  });

  it('cancelInline clears inline mode', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.startAddRoot();
    comp.cancelInline();
    expect(comp.isAddingAtRoot()).toBe(false);
  });

  it('saveEdit with unchanged title skips API call', () => {
    const { fixture, productService } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.inlineTitle.set('Backend System');
    comp.saveEdit(stubProduct);
    expect(productService.update).not.toHaveBeenCalled();
  });

  it('saveEdit with new title calls update', () => {
    const { fixture, productService } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.inlineTitle.set('Renamed Product');
    comp.saveEdit(stubProduct);
    expect(productService.update).toHaveBeenCalledWith(7, 1, { title: 'Renamed Product' });
  });

  it('shows skeleton when loading', () => {
    const { fixture, loadingSignal } = setup([], true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
  });

  it('selectedNode derived from signal resolves product', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.select(stubProduct);
    const sel = comp.selectedNode();
    expect(sel?.productId).toBe(1);
    expect(sel?.node.title).toBe('Backend System');
    expect(sel?.parentId).toBeNull();
  });

  it('selectedNode resolves nested child', () => {
    const { fixture } = setup([stubProduct]);
    const comp = fixture.componentInstance as any;
    comp.select(stubChild);
    const sel = comp.selectedNode();
    expect(sel?.productId).toBe(20);
    expect(sel?.parentId).toBe(1);
  });
});
