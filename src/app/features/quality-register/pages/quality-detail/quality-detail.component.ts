import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { QualityRegisterService } from '../../services/quality-register.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { QualityResultChipComponent } from '../../components/quality-result-chip/quality-result-chip.component';
import {
  QUALITY_METHODS,
  QUALITY_METHOD_LABELS,
  QUALITY_RESULTS,
  QUALITY_RESULT_LABELS,
  QualityMethod,
  QualityResult,
  UpdateQualityEntryPayload,
} from '../../contracts/quality-register.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-quality-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    QualityResultChipComponent,
    SkeletonComponent,
  ],
  templateUrl: './quality-detail.component.html',
  styleUrl: './quality-detail.component.scss',
})
export class QualityDetailComponent {
  readonly entryId = input<string>();

  private readonly qualityService = inject(QualityRegisterService);
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly entry = this.qualityService.selectedEntry;
  protected readonly project = this.projectService.selectedProject;
  protected readonly members = this.memberService.members;
  protected readonly loading = this.qualityService.loading;

  protected readonly methods = QUALITY_METHODS;
  protected readonly methodLabels = QUALITY_METHOD_LABELS;
  protected readonly results = QUALITY_RESULTS;
  protected readonly resultLabels = QUALITY_RESULT_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);

  protected readonly hasResult = computed(() => !!this.entry()?.result);

  protected readonly form = this.fb.group({
    product_name: [''],
    quality_method: ['' as QualityMethod],
    planned_date: [''],
    actual_date: [''],
    result: [null as QualityResult | null],
    issues_raised: [''],
    sign_off_by: [null as number | null],
    sign_off_at: [''],
  });

  constructor() {
    effect(() => {
      const id = this.entryId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.qualityService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load quality entry.'),
        });
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });

    effect(() => {
      const e = this.entry();
      if (e) {
        this.form.patchValue({
          product_name: e.productName,
          quality_method: e.qualityMethod,
          planned_date: e.plannedDate ?? '',
          actual_date: e.actualDate ?? '',
          result: e.result,
          issues_raised: e.issuesRaised ?? '',
          sign_off_by: e.signOffBy?.id ?? null,
          sign_off_at: e.signOffAt ?? '',
        });
        this.form.markAsPristine();
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/p', project.id, 'quality']);
  }

  protected save(): void {
    const e = this.entry();
    const project = this.project();
    if (!e || !project) return;

    const v = this.form.value;
    const payload: UpdateQualityEntryPayload = {
      product_name: v.product_name!,
      quality_method: v.quality_method as QualityMethod,
      planned_date: v.planned_date || null,
      actual_date: v.actual_date || null,
      result: v.result ?? null,
      issues_raised: v.issues_raised || null,
      sign_off_by: v.sign_off_by ?? null,
      sign_off_at: v.sign_off_at || null,
    };
    this.saveError.set(null);
    this.qualityService.update(project.id, e.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected deleteEntry(): void {
    const e = this.entry();
    const project = this.project();
    if (!e || !project) return;
    this.qualityService.remove(project.id, e.id).subscribe({
      next: () => this.goBack(),
      error: () => this.saveError.set('Delete failed. Please try again.'),
    });
  }
}
