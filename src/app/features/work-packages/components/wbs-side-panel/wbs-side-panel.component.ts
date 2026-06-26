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
  WBS_STATUSES,
  WBS_STATUS_LABELS,
  WbsSelection,
  WbsStatus,
} from '../../contracts/work-package.contracts';
import { WorkPackageService } from '../../services/work-package.service';

const TYPE_LABELS: Record<string, string> = {
  wp: 'Work Package',
  prod: 'Product',
  act: 'Activity',
};

const TYPE_ICONS: Record<string, string> = {
  wp: 'folder_open',
  prod: 'inventory_2',
  act: 'task_alt',
};

@Component({
  selector: 'app-wbs-side-panel',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './wbs-side-panel.component.html',
  styleUrl: './wbs-side-panel.component.scss',
})
export class WbsSidePanelComponent implements OnInit {
  readonly selection = input.required<WbsSelection>();
  readonly projectId = input.required<number>();
  readonly close = output<void>();

  private readonly wpService = inject(WorkPackageService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly statuses = WBS_STATUSES;
  protected readonly statusLabels = WBS_STATUS_LABELS;
  protected readonly typeLabels = TYPE_LABELS;
  protected readonly typeIcons = TYPE_ICONS;

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    status: ['' as WbsStatus, Validators.required],
  });

  protected saving = false;

  constructor() {
    effect(() => {
      const sel = this.selection();
      this.form.patchValue({
        title: sel.node.title,
        description: sel.node.description ?? '',
        status: sel.node.status,
      }, { emitEvent: false });
    });
  }

  ngOnInit(): void {
    const sel = this.selection();
    this.form.patchValue({
      title: sel.node.title,
      description: sel.node.description ?? '',
      status: sel.node.status,
    }, { emitEvent: false });
  }

  protected save(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const { title, description, status } = this.form.value;
    const payload = {
      title: title!,
      description: description?.trim() || null,
      status: status as WbsStatus,
    };
    const sel = this.selection();
    const projectId = this.projectId();

    let obs$: import('rxjs').Observable<unknown>;
    if (sel.type === 'wp') {
      obs$ = this.wpService.updateWorkPackage(projectId, sel.wpId, payload);
    } else if (sel.type === 'prod') {
      obs$ = this.wpService.updateProduct(projectId, sel.prodId!, payload);
    } else {
      obs$ = this.wpService.updateActivity(projectId, sel.wpId, sel.prodId!, sel.actId!, payload);
    }

    obs$.subscribe({ next: () => (this.saving = false), error: () => (this.saving = false) });
  }

  protected confirmDelete(): void {
    const sel = this.selection();
    const label = TYPE_LABELS[sel.type];
    const hasChildren =
      sel.type === 'wp'
        ? (sel.node as import('../../contracts/work-package.contracts').WorkPackage).products.length > 0
        : sel.type === 'prod'
          ? (sel.node as import('../../contracts/work-package.contracts').Product).activities.length > 0
          : false;

    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: `Delete ${label}`,
          message: hasChildren
            ? `Delete "${sel.node.title}"? All nested items inside it will also be removed.`
            : `Delete "${sel.node.title}"?`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        const pid = this.projectId();
        let obs$: import('rxjs').Observable<void>;
        if (sel.type === 'wp') {
          obs$ = this.wpService.removeWorkPackage(pid, sel.wpId);
        } else if (sel.type === 'prod') {
          obs$ = this.wpService.removeProduct(pid, sel.wpId, sel.prodId!);
        } else {
          obs$ = this.wpService.removeActivity(pid, sel.wpId, sel.prodId!, sel.actId!);
        }
        obs$.subscribe({ next: () => this.close.emit() });
      });
  }
}
