import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  PbsSelection,
  Product,
  PRODUCT_TYPE_LABELS,
  exportPbsToText,
} from '../../contracts/work-package.contracts';
import { ProductService } from '../../services/product.service';
import { WbsSidePanelComponent } from '../wbs-side-panel/wbs-side-panel.component';
import { WbsStatusChipComponent } from '../wbs-status-chip/wbs-status-chip.component';

type InlineMode =
  | { mode: 'add'; parentId: number | null }
  | { mode: 'edit'; id: number };

@Component({
  selector: 'app-wbs-tree',
  imports: [
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    EmptyStateComponent,
    SkeletonComponent,
    WbsSidePanelComponent,
    WbsStatusChipComponent,
  ],
  templateUrl: './wbs-tree.component.html',
  styleUrl: './wbs-tree.component.scss',
})
export class WbsTreeComponent {
  readonly projectId = input.required<number>();

  protected readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);

  protected readonly products = this.productService.products;
  protected readonly loading = this.productService.loading;
  protected readonly typeLabels = PRODUCT_TYPE_LABELS;

  protected typeLabel(product: Product): string { return PRODUCT_TYPE_LABELS[product.type]; }

  // ─── Expand/collapse ─────────────────────────────────────────────────────────

  private readonly _expanded = signal<Set<number>>(new Set());

  protected isExpanded(id: number): boolean { return this._expanded().has(id); }

  protected toggle(id: number): void {
    this._expanded.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  protected expandAll(): void {
    const ids = new Set<number>();
    function collect(products: Product[]): void {
      for (const p of products) { ids.add(p.id); collect(p.children); }
    }
    collect(this.products());
    this._expanded.set(ids);
  }

  protected collapseAll(): void { this._expanded.set(new Set()); }

  // ─── Selection ────────────────────────────────────────────────────────────────

  private readonly _selId = signal<number | null>(null);

  protected readonly selectedNode = computed<PbsSelection | null>(() => {
    const id = this._selId();
    if (id === null) return null;
    function find(products: Product[]): Product | null {
      for (const p of products) {
        if (p.id === id) return p;
        const found = find(p.children);
        if (found) return found;
      }
      return null;
    }
    const node = find(this.products());
    if (!node) return null;
    return { productId: id, parentId: node.parentId, node };
  });

  protected isSelected(id: number): boolean { return this._selId() === id; }

  protected select(product: Product): void { this._selId.set(product.id); }
  protected clearSelection(): void { this._selId.set(null); }

  // ─── Inline add/edit ─────────────────────────────────────────────────────────

  private readonly _inlineMode = signal<InlineMode | null>(null);
  protected readonly inlineTitle = signal('');

  @ViewChild('inlineInput') private inlineInputRef?: ElementRef<HTMLInputElement>;

  protected isAddingAtRoot(): boolean {
    const m = this._inlineMode();
    return m?.mode === 'add' && (m as { parentId: number | null }).parentId === null;
  }

  protected isAddingChild(parentId: number): boolean {
    const m = this._inlineMode();
    return m?.mode === 'add' && (m as { parentId: number | null }).parentId === parentId;
  }

  protected isEditing(id: number): boolean {
    const m = this._inlineMode();
    return m?.mode === 'edit' && (m as { id: number }).id === id;
  }

  private focusInput(): void {
    setTimeout(() => this.inlineInputRef?.nativeElement.focus(), 0);
  }

  protected startAddRoot(): void {
    this._inlineMode.set({ mode: 'add', parentId: null });
    this.inlineTitle.set('');
    this.focusInput();
  }

  protected startAddChild(event: Event, parentId: number): void {
    event.stopPropagation();
    this._expanded.update(s => { const n = new Set(s); n.add(parentId); return n; });
    this._inlineMode.set({ mode: 'add', parentId });
    this.inlineTitle.set('');
    this.focusInput();
  }

  protected startEdit(event: Event, product: Product): void {
    event.stopPropagation();
    this._inlineMode.set({ mode: 'edit', id: product.id });
    this.inlineTitle.set(product.title);
    this.focusInput();
  }

  protected cancelInline(): void {
    this._inlineMode.set(null);
    this.inlineTitle.set('');
  }

  protected handleAddKeydown(event: KeyboardEvent, parentId: number | null): void {
    if (event.key === 'Enter') { event.preventDefault(); this.saveNew(parentId); }
    else if (event.key === 'Escape') { this.cancelInline(); }
  }

  protected handleEditKeydown(event: KeyboardEvent, product: Product): void {
    if (event.key === 'Enter') { event.preventDefault(); this.saveEdit(product); }
    else if (event.key === 'Escape') { this.cancelInline(); }
  }

  protected saveNew(parentId: number | null): void {
    const title = this.inlineTitle().trim();
    if (!title) { this.cancelInline(); return; }
    this._inlineMode.set(null);
    this.inlineTitle.set('');
    this.productService
      .create(this.projectId(), { title, type: 'specialist', parent_id: parentId })
      .subscribe({ error: () => {} });
  }

  protected saveEdit(product: Product): void {
    const title = this.inlineTitle().trim();
    this._inlineMode.set(null);
    this.inlineTitle.set('');
    if (!title || title === product.title) return;
    this.productService.update(this.projectId(), product.id, { title }).subscribe();
  }

  // ─── Delete ───────────────────────────────────────────────────────────────────

  protected confirmDelete(event: Event, product: Product): void {
    event.stopPropagation();
    const hasChildren = product.children.length > 0;
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Delete product',
          message: hasChildren
            ? `Delete "${product.title}"? All nested sub-products will also be removed.`
            : `Delete "${product.title}"?`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.productService.remove(this.projectId(), product.id).subscribe({
          next: () => { if (this._selId() === product.id) this.clearSelection(); },
        });
      });
  }

  // ─── Export ───────────────────────────────────────────────────────────────────

  protected exportToClipboard(): void {
    navigator.clipboard.writeText(exportPbsToText(this.products())).catch(() => undefined);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────────

  constructor() {
    effect(() => {
      const pid = this.projectId();
      this.productService.list(pid).subscribe();
    });
  }
}
