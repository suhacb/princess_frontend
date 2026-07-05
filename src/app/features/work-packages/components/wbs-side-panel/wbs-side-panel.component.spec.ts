import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WbsSidePanelComponent } from './wbs-side-panel.component';
import { ProductService } from '../../services/product.service';
import { PbsSelection, Product } from '../../contracts/work-package.contracts';

const stubChild: Product = {
  id: 20, projectId: 7, parentId: 1, identifier: null,
  title: 'Auth Module', purpose: null, type: 'management', status: 'in_development',
  children: [],
};

const stubProduct: Product = {
  id: 1, projectId: 7, parentId: null, identifier: 'P001',
  title: 'Backend System', purpose: 'Provide REST API', type: 'specialist', status: 'draft',
  children: [stubChild],
};

const rootSelection: PbsSelection = { productId: 1, parentId: null, node: stubProduct };
const childSelection: PbsSelection = { productId: 20, parentId: 1, node: stubChild };

function setup(selection: PbsSelection) {
  const productService = {
    update: vi.fn().mockReturnValue(of(stubProduct)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    baseline: vi.fn().mockReturnValue(of({ ...stubProduct, status: 'baselined' })),
  };
  const dialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };

  TestBed.configureTestingModule({
    imports: [WbsSidePanelComponent, BrowserAnimationsModule],
    providers: [
      { provide: ProductService, useValue: productService },
      { provide: MatDialog, useValue: dialog },
    ],
  });

  const fixture: ComponentFixture<WbsSidePanelComponent> = TestBed.createComponent(WbsSidePanelComponent);
  fixture.componentRef.setInput('selection', selection);
  fixture.componentRef.setInput('projectId', 7);
  fixture.detectChanges();
  return { fixture, productService, dialog };
}

describe('WbsSidePanelComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('form initialisation', () => {
    it('patches title from selection', () => {
      const { fixture } = setup(rootSelection);
      expect((fixture.componentInstance as any).form.value.title).toBe('Backend System');
    });

    it('patches type from selection', () => {
      const { fixture } = setup(rootSelection);
      expect((fixture.componentInstance as any).form.value.type).toBe('specialist');
    });

    it('patches purpose from selection', () => {
      const { fixture } = setup(rootSelection);
      expect((fixture.componentInstance as any).form.value.purpose).toBe('Provide REST API');
    });

    it('shows empty purpose when null', () => {
      const { fixture } = setup(childSelection);
      expect((fixture.componentInstance as any).form.value.purpose).toBe('');
    });

    it('renders type select in DOM', () => {
      const { fixture } = setup(rootSelection);
      expect(fixture.nativeElement.querySelector('mat-select')).toBeTruthy();
    });

    it('shows Baseline button for draft status', () => {
      const { fixture } = setup(rootSelection);
      const btn = fixture.nativeElement.querySelector('button[mat-stroked-button]');
      expect(btn?.textContent).toContain('Baseline');
    });

    it('does not show Baseline button for baselined status', () => {
      const baselinedSelection: PbsSelection = {
        ...rootSelection,
        node: { ...stubProduct, status: 'baselined' },
      };
      const { fixture } = setup(baselinedSelection);
      expect(fixture.nativeElement.querySelector('button[mat-stroked-button]')).toBeFalsy();
    });
  });

  describe('save()', () => {
    it('calls update with correct productId and payload', () => {
      const { fixture, productService } = setup(rootSelection);
      const comp = fixture.componentInstance as any;
      comp.form.patchValue({ title: 'Renamed', type: 'management', purpose: 'New purpose' });
      comp.save();
      expect(productService.update).toHaveBeenCalledWith(7, 1, expect.objectContaining({
        title: 'Renamed',
        type: 'management',
        purpose: 'New purpose',
      }));
    });

    it('converts empty purpose to null', () => {
      const { fixture, productService } = setup(rootSelection);
      const comp = fixture.componentInstance as any;
      comp.form.patchValue({ title: 'T', type: 'specialist', purpose: '  ' });
      comp.save();
      expect(productService.update).toHaveBeenCalledWith(7, 1, expect.objectContaining({ purpose: null }));
    });

    it('does not call API when form is invalid', () => {
      const { fixture, productService } = setup(rootSelection);
      const comp = fixture.componentInstance as any;
      comp.form.patchValue({ title: '' });
      comp.save();
      expect(productService.update).not.toHaveBeenCalled();
    });
  });

  describe('baseline()', () => {
    it('calls productService.baseline with correct ids', () => {
      const { fixture, productService } = setup(rootSelection);
      const comp = fixture.componentInstance as any;
      comp.baseline();
      expect(productService.baseline).toHaveBeenCalledWith(7, 1);
    });
  });

  describe('confirmDelete()', () => {
    it('opens confirm dialog', () => {
      const { fixture, dialog } = setup(rootSelection);
      (fixture.componentInstance as any).confirmDelete();
      expect(dialog.open).toHaveBeenCalled();
    });

    it('calls remove on confirm', () => {
      const { fixture, productService } = setup(rootSelection);
      (fixture.componentInstance as any).confirmDelete();
      expect(productService.remove).toHaveBeenCalledWith(7, 1);
    });

    it('emits close after successful delete', () => {
      const { fixture } = setup(rootSelection);
      const closeSpy = vi.fn();
      (fixture.componentInstance as any).close.subscribe(closeSpy);
      (fixture.componentInstance as any).confirmDelete();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('does not delete when dialog cancelled', () => {
      const { fixture, productService, dialog } = setup(rootSelection);
      dialog.open.mockReturnValue({ afterClosed: () => of(false) });
      (fixture.componentInstance as any).confirmDelete();
      expect(productService.remove).not.toHaveBeenCalled();
    });
  });

  describe('overlay dismiss', () => {
    it('renders a backdrop element', () => {
      const { fixture } = setup(rootSelection);
      expect(fixture.nativeElement.querySelector('.backdrop')).toBeTruthy();
    });

    it('clicking the backdrop emits close', () => {
      const { fixture } = setup(rootSelection);
      const closeSpy = vi.fn();
      (fixture.componentInstance as any).close.subscribe(closeSpy);
      fixture.nativeElement.querySelector('.backdrop').click();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('pressing Escape emits close', () => {
      const { fixture } = setup(rootSelection);
      const closeSpy = vi.fn();
      (fixture.componentInstance as any).close.subscribe(closeSpy);
      (fixture.componentInstance as any).onEscape();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('clicking the panel itself does not emit close', () => {
      const { fixture } = setup(rootSelection);
      const closeSpy = vi.fn();
      (fixture.componentInstance as any).close.subscribe(closeSpy);
      fixture.nativeElement.querySelector('.panel').click();
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });
});
