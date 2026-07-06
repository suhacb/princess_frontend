import { Component, HostListener, effect, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AcceptanceCriterionService } from '../../services/acceptance-criterion.service';
import { MemberService } from '../../../members/services/member.service';
import { AcStatusChipComponent } from '../ac-status-chip/ac-status-chip.component';
import { AcVerificationMethodChipComponent } from '../ac-verification-method-chip/ac-verification-method-chip.component';
import { AcDecisionChipComponent } from '../ac-decision-chip/ac-decision-chip.component';
import { AcceptanceCriterionVersionListComponent } from '../acceptance-criterion-version-list/acceptance-criterion-version-list.component';
import {
  AcceptanceDecisionDialogComponent,
  AcceptanceDecisionDialogData,
} from '../acceptance-decision-dialog/acceptance-decision-dialog.component';
import {
  VERIFICATION_METHODS,
  VERIFICATION_METHOD_LABELS,
  UpdateAcceptanceCriterionPayload,
  VerificationMethod,
  RecordDecisionPayload,
} from '../../contracts/acceptance-criterion.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-acceptance-criterion-detail-panel',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    AcStatusChipComponent,
    AcVerificationMethodChipComponent,
    AcDecisionChipComponent,
    AcceptanceCriterionVersionListComponent,
    SkeletonComponent,
  ],
  templateUrl: './acceptance-criterion-detail-panel.component.html',
  styleUrl: './acceptance-criterion-detail-panel.component.scss',
})
export class AcceptanceCriterionDetailPanelComponent {
  readonly projectId = input.required<number>();
  readonly criterionId = input.required<number>();
  readonly close = output<void>();

  private readonly acService = inject(AcceptanceCriterionService);
  private readonly memberService = inject(MemberService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly criterion = this.acService.selectedCriterion;
  protected readonly loading = this.acService.loading;
  protected readonly members = this.memberService.members;

  protected readonly methods = VERIFICATION_METHODS;
  protected readonly methodLabels = VERIFICATION_METHOD_LABELS;

  protected readonly saveError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    verification_method: [null as VerificationMethod | null],
    verifier_id: [null as number | null],
    measurement_method: [''],
    acceptance_threshold: [''],
  });

  constructor() {
    effect(() => {
      const id = this.criterionId();
      const projectId = this.projectId();
      if (id && projectId) {
        this.acService.load(projectId, id).subscribe();
        if (this.memberService.members().length === 0) {
          this.memberService.list(projectId).subscribe();
        }
      }
    });

    effect(() => {
      const c = this.criterion();
      if (c) {
        this.form.patchValue({
          title: c.title,
          description: c.description,
          verification_method: c.verificationMethod,
          verifier_id: c.verifier?.id ?? null,
          measurement_method: c.measurementMethod ?? '',
          acceptance_threshold: c.acceptanceThreshold ?? '',
        });
        this.form.markAsPristine();
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close.emit();
  }

  protected save(): void {
    const c = this.criterion();
    if (!c || this.form.invalid) return;
    const v = this.form.value;
    const payload: UpdateAcceptanceCriterionPayload = {
      title: v.title!,
      description: v.description!,
      verification_method: v.verification_method || null,
      verifier_id: v.verifier_id ?? null,
      measurement_method: v.measurement_method || null,
      acceptance_threshold: v.acceptance_threshold || null,
    };
    this.saveError.set(null);
    this.acService.update(this.projectId(), c.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected approve(): void {
    const c = this.criterion();
    if (!c) return;
    this.actionError.set(null);
    this.acService.approve(this.projectId(), c.id).subscribe({
      error: () => this.actionError.set('Approve failed — you may not have permission to do this.'),
    });
  }

  protected deleteCriterion(): void {
    const c = this.criterion();
    if (!c) return;
    this.actionError.set(null);
    this.acService.remove(this.projectId(), c.id).subscribe({
      next: () => this.close.emit(),
      error: () => this.actionError.set('Delete failed — this criterion may already be linked to a test scenario.'),
    });
  }

  protected openSupplierDecision(): void {
    this.openDecisionDialog('Supplier', c => c.supplierPassed, (id, payload) =>
      this.acService.supplierDecision(this.projectId(), id, payload),
    );
  }

  protected openClientDecision(): void {
    this.openDecisionDialog('Client', c => c.clientPassed, (id, payload) =>
      this.acService.clientDecision(this.projectId(), id, payload),
    );
  }

  private openDecisionDialog(
    side: 'Supplier' | 'Client',
    computedPassedFn: (c: NonNullable<ReturnType<typeof this.criterion>>) => boolean,
    submit: (id: number, payload: RecordDecisionPayload) => ReturnType<AcceptanceCriterionService['supplierDecision']>,
  ): void {
    const c = this.criterion();
    if (!c) return;
    const data: AcceptanceDecisionDialogData = { side, computedPassed: computedPassedFn(c) };
    this.dialog
      .open(AcceptanceDecisionDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((payload: RecordDecisionPayload | undefined) => {
        if (!payload) return;
        this.actionError.set(null);
        submit(c.id, payload).subscribe({
          error: () => this.actionError.set('Recording the decision failed. Please try again.'),
        });
      });
  }
}
