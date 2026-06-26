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
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
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
  Activity,
  Product,
  ReorderPayload,
  WbsNodeType,
  WbsSelection,
  WorkPackage,
  exportWbsToText,
} from '../../contracts/work-package.contracts';
import { WorkPackageService } from '../../services/work-package.service';
import { WbsSidePanelComponent } from '../wbs-side-panel/wbs-side-panel.component';
import { WbsStatusChipComponent } from '../wbs-status-chip/wbs-status-chip.component';

type InlineMode =
  | { mode: 'add'; type: 'wp' }
  | { mode: 'add'; type: 'prod'; parentWpId: number }
  | { mode: 'add'; type: 'act'; parentWpId: number; parentProdId: number }
  | { mode: 'edit'; type: 'wp'; id: number }
  | { mode: 'edit'; type: 'prod'; id: number; parentWpId: number }
  | { mode: 'edit'; type: 'act'; id: number; parentWpId: number; parentProdId: number };

@Component({
  selector: 'app-wbs-tree',
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDropList,
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

  protected readonly wpService = inject(WorkPackageService);
  private readonly dialog = inject(MatDialog);

  protected readonly workPackages = this.wpService.workPackages;
  protected readonly loading = this.wpService.loading;

  // ─── Expand/collapse ─────────────────────────────────────────────────────

  private readonly _expandedWps = signal<Set<number>>(new Set());
  private readonly _expandedProds = signal<Set<number>>(new Set());

  protected isWpExpanded(id: number): boolean { return this._expandedWps().has(id); }
  protected isProdExpanded(id: number): boolean { return this._expandedProds().has(id); }

  protected toggleWp(id: number): void {
    this._expandedWps.update(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  protected toggleProd(id: number): void {
    this._expandedProds.update(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  protected expandAll(): void {
    const wps = this.workPackages();
    this._expandedWps.set(new Set(wps.map(wp => wp.id)));
    this._expandedProds.set(new Set(wps.flatMap(wp => wp.products.map(p => p.id))));
  }

  protected collapseAll(): void {
    this._expandedWps.set(new Set());
    this._expandedProds.set(new Set());
  }

  // ─── Selection ────────────────────────────────────────────────────────────

  private readonly _selWpId = signal<number | null>(null);
  private readonly _selProdId = signal<number | null>(null);
  private readonly _selActId = signal<number | null>(null);

  protected readonly selectedNode = computed<WbsSelection | null>(() => {
    const wpId = this._selWpId();
    if (wpId === null) return null;
    const wp = this.workPackages().find(w => w.id === wpId);
    if (!wp) return null;
    const prodId = this._selProdId();
    if (prodId === null) return { type: 'wp', wpId, node: wp };
    const prod = wp.products.find(p => p.id === prodId);
    if (!prod) return null;
    const actId = this._selActId();
    if (actId === null) return { type: 'prod', wpId, prodId, node: prod };
    const act = prod.activities.find(a => a.id === actId);
    if (!act) return null;
    return { type: 'act', wpId, prodId, actId, node: act };
  });

  protected isWpSelected(id: number): boolean {
    return this._selWpId() === id && this._selProdId() === null;
  }
  protected isProdSelected(wpId: number, prodId: number): boolean {
    return this._selWpId() === wpId && this._selProdId() === prodId && this._selActId() === null;
  }
  protected isActSelected(wpId: number, prodId: number, actId: number): boolean {
    return this._selWpId() === wpId && this._selProdId() === prodId && this._selActId() === actId;
  }

  protected selectWp(wp: WorkPackage): void {
    this._selWpId.set(wp.id); this._selProdId.set(null); this._selActId.set(null);
  }
  protected selectProd(wp: WorkPackage, prod: Product): void {
    this._selWpId.set(wp.id); this._selProdId.set(prod.id); this._selActId.set(null);
  }
  protected selectAct(wp: WorkPackage, prod: Product, act: Activity): void {
    this._selWpId.set(wp.id); this._selProdId.set(prod.id); this._selActId.set(act.id);
  }
  protected clearSelection(): void {
    this._selWpId.set(null); this._selProdId.set(null); this._selActId.set(null);
  }

  // ─── Inline edit / add ────────────────────────────────────────────────────

  private readonly _inlineMode = signal<InlineMode | null>(null);
  protected readonly inlineTitle = signal('');

  @ViewChild('inlineInput') private inlineInputRef?: ElementRef<HTMLInputElement>;

  protected isAddingAtRoot(): boolean {
    const m = this._inlineMode();
    return m?.mode === 'add' && m.type === 'wp';
  }
  protected isAddingProduct(wpId: number): boolean {
    const m = this._inlineMode();
    return m?.mode === 'add' && m.type === 'prod' && (m as { parentWpId: number }).parentWpId === wpId;
  }
  protected isAddingActivity(prodId: number): boolean {
    const m = this._inlineMode();
    return m?.mode === 'add' && m.type === 'act' && (m as { parentProdId: number }).parentProdId === prodId;
  }
  protected isEditingNode(type: WbsNodeType, id: number): boolean {
    const m = this._inlineMode();
    return m?.mode === 'edit' && m.type === type && (m as { id: number }).id === id;
  }

  private focusInput(): void {
    setTimeout(() => this.inlineInputRef?.nativeElement.focus(), 0);
  }

  protected startAddWorkPackage(): void {
    this._inlineMode.set({ mode: 'add', type: 'wp' });
    this.inlineTitle.set('');
    this.focusInput();
  }

  protected startAddProduct(event: Event, wpId: number): void {
    event.stopPropagation();
    this._expandedWps.update(s => { const n = new Set(s); n.add(wpId); return n; });
    this._inlineMode.set({ mode: 'add', type: 'prod', parentWpId: wpId });
    this.inlineTitle.set('');
    this.focusInput();
  }

  protected startAddActivity(event: Event, wpId: number, prodId: number): void {
    event.stopPropagation();
    this._expandedProds.update(s => { const n = new Set(s); n.add(prodId); return n; });
    this._inlineMode.set({ mode: 'add', type: 'act', parentWpId: wpId, parentProdId: prodId });
    this.inlineTitle.set('');
    this.focusInput();
  }

  protected startEdit(event: Event, type: WbsNodeType, node: WorkPackage | Product | Activity, wpId?: number, prodId?: number): void {
    event.stopPropagation();
    const m: InlineMode =
      type === 'wp'
        ? { mode: 'edit', type: 'wp', id: node.id }
        : type === 'prod'
          ? { mode: 'edit', type: 'prod', id: node.id, parentWpId: wpId! }
          : { mode: 'edit', type: 'act', id: node.id, parentWpId: wpId!, parentProdId: prodId! };
    this._inlineMode.set(m);
    this.inlineTitle.set(node.title);
    this.focusInput();
  }

  protected cancelInline(): void {
    this._inlineMode.set(null);
    this.inlineTitle.set('');
  }

  protected handleAddKeydown(
    event: KeyboardEvent,
    type: 'wp' | 'prod' | 'act',
    wpId?: number,
    prodId?: number,
  ): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (type === 'wp') this.saveNewWorkPackage();
      else if (type === 'prod' && wpId !== undefined) this.saveNewProduct(wpId);
      else if (type === 'act' && wpId !== undefined && prodId !== undefined) this.saveNewActivity(wpId, prodId);
    } else if (event.key === 'Escape') {
      this.cancelInline();
    }
  }

  protected handleEditKeydown(
    event: KeyboardEvent,
    type: WbsNodeType,
    node: WorkPackage | Product | Activity,
    wpId?: number,
    prodId?: number,
  ): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit(type, node, wpId, prodId);
    } else if (event.key === 'Escape') {
      this.cancelInline();
    }
  }

  protected saveNewWorkPackage(): void {
    const title = this.inlineTitle().trim();
    if (!title) { this.cancelInline(); return; }
    this.wpService.createWorkPackage(this.projectId(), { title }).subscribe({
      next: () => this.cancelInline(),
      error: () => this.cancelInline(),
    });
  }

  protected saveNewProduct(wpId: number): void {
    const title = this.inlineTitle().trim();
    if (!title) { this.cancelInline(); return; }
    this.wpService.createProduct(this.projectId(), wpId, { title }).subscribe({
      next: () => this.cancelInline(),
      error: () => this.cancelInline(),
    });
  }

  protected saveNewActivity(wpId: number, prodId: number): void {
    const title = this.inlineTitle().trim();
    if (!title) { this.cancelInline(); return; }
    this.wpService.createActivity(this.projectId(), wpId, prodId, { title }).subscribe({
      next: () => this.cancelInline(),
      error: () => this.cancelInline(),
    });
  }

  protected saveEdit(
    type: WbsNodeType,
    node: WorkPackage | Product | Activity,
    wpId?: number,
    prodId?: number,
  ): void {
    const title = this.inlineTitle().trim();
    this._inlineMode.set(null);
    if (!title || title === node.title) return;
    const pid = this.projectId();
    const payload = { title };
    if (type === 'wp') {
      this.wpService.updateWorkPackage(pid, node.id, payload).subscribe();
    } else if (type === 'prod') {
      this.wpService.updateProduct(pid, node.id, payload).subscribe();
    } else {
      this.wpService.updateActivity(pid, wpId!, prodId!, node.id, payload).subscribe();
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  protected confirmDeleteWp(event: Event, wp: WorkPackage): void {
    event.stopPropagation();
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Delete work package',
          message: `Delete "${wp.title}"? All nested products and activities will be removed.`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.wpService.removeWorkPackage(this.projectId(), wp.id).subscribe({
          next: () => { if (this._selWpId() === wp.id) this.clearSelection(); },
        });
      });
  }

  protected confirmDeleteProd(event: Event, wp: WorkPackage, prod: Product): void {
    event.stopPropagation();
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Delete product',
          message: `Delete "${prod.title}"? All nested activities will be removed.`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.wpService.removeProduct(this.projectId(), wp.id, prod.id).subscribe({
          next: () => { if (this._selProdId() === prod.id) this.clearSelection(); },
        });
      });
  }

  protected confirmDeleteAct(event: Event, wp: WorkPackage, prod: Product, act: Activity): void {
    event.stopPropagation();
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Delete activity',
          message: `Delete "${act.title}"?`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.wpService.removeActivity(this.projectId(), wp.id, prod.id, act.id).subscribe({
          next: () => { if (this._selActId() === act.id) this.clearSelection(); },
        });
      });
  }

  // ─── Drag & Drop ─────────────────────────────────────────────────────────

  protected dropWorkPackage(event: CdkDragDrop<WorkPackage[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const wps = [...this.workPackages()];
    moveItemInArray(wps, event.previousIndex, event.currentIndex);
    this.wpService.reorderWorkPackagesLocal(wps);
    const payload: ReorderPayload = { items: wps.map((wp, i) => ({ id: wp.id, sort_order: i })) };
    this.wpService.reorderWorkPackages(this.projectId(), payload).subscribe();
  }

  protected dropProduct(event: CdkDragDrop<Product[]>, wpId: number): void {
    if (event.previousIndex === event.currentIndex) return;
    const wp = this.workPackages().find(w => w.id === wpId);
    if (!wp) return;
    const products = [...wp.products];
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.wpService.reorderProductsLocal(wpId, products);
    const payload: ReorderPayload = { items: products.map((p, i) => ({ id: p.id, sort_order: i })) };
    this.wpService.reorderProducts(this.projectId(), wpId, payload).subscribe();
  }

  protected dropActivity(event: CdkDragDrop<Activity[]>, wpId: number, prodId: number): void {
    if (event.previousIndex === event.currentIndex) return;
    const prod = this.workPackages().find(w => w.id === wpId)?.products.find(p => p.id === prodId);
    if (!prod) return;
    const activities = [...prod.activities];
    moveItemInArray(activities, event.previousIndex, event.currentIndex);
    this.wpService.reorderActivitiesLocal(wpId, prodId, activities);
    const payload: ReorderPayload = { items: activities.map((a, i) => ({ id: a.id, sort_order: i })) };
    this.wpService.reorderActivities(this.projectId(), wpId, prodId, payload).subscribe();
  }

  // ─── Export ───────────────────────────────────────────────────────────────

  protected exportToClipboard(): void {
    const text = exportWbsToText(this.workPackages());
    navigator.clipboard.writeText(text).catch(() => undefined);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  constructor() {
    effect(() => {
      const pid = this.projectId();
      this.wpService.list(pid).subscribe();
    });
  }
}
