import { Component, OnInit, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPES,
  PRODUCT_TYPE_LABELS,
  PbsSelection,
  ProductType,
} from '../../contracts/work-package.contracts';
import { ProductService } from '../../services/product.service';
import { WbsStatusChipComponent } from '../wbs-status-chip/wbs-status-chip.component';

@Component({
  selector: 'app-wbs-side-panel',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    WbsStatusChipComponent,
  ],
  templateUrl: './wbs-side-panel.component.html',
  styleUrl: './wbs-side-panel.component.scss',
})
export class WbsSidePanelComponent implements OnInit {
  readonly selection = input.required<PbsSelection>();
  readonly projectId = input.required<number>();
  readonly close = output<void>();

  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly types = PRODUCT_TYPES;
  protected readonly typeLabels = PRODUCT_TYPE_LABELS;
  protected readonly statusLabels = PRODUCT_STATUS_LABELS;

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    type: ['' as ProductType, Validators.required],
    purpose: [''],
  });

  protected saving = false;

  constructor() {
    effect(() => {
      const node = this.selection().node;
      this.form.patchValue(
        { title: node.title, type: node.type, purpose: node.purpose ?? '' },
        { emitEvent: false },
      );
    });
  }

  ngOnInit(): void {
    const node = this.selection().node;
    this.form.patchValue(
      { title: node.title, type: node.type, purpose: node.purpose ?? '' },
      { emitEvent: false },
    );
  }

  protected save(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const { title, type, purpose } = this.form.value;
    this.productService
      .update(this.projectId(), this.selection().productId, {
        title: title!,
        type: type as ProductType,
        purpose: purpose?.trim() || null,
      })
      .subscribe({ next: () => (this.saving = false), error: () => (this.saving = false) });
  }

  protected baseline(): void {
    this.productService
      .baseline(this.projectId(), this.selection().productId)
      .subscribe();
  }

  protected confirmDelete(): void {
    const node = this.selection().node;
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Delete product',
          message:
            node.children.length > 0
              ? `Delete "${node.title}"? All nested sub-products will also be removed.`
              : `Delete "${node.title}"?`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.productService
          .remove(this.projectId(), this.selection().productId)
          .subscribe({ next: () => this.close.emit() });
      });
  }
}
