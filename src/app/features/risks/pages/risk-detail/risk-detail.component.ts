import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { RiskService } from '../../services/risk.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { RiskStatusChipComponent } from '../../components/risk-status-chip/risk-status-chip.component';
import { RiskScoreBadgeComponent } from '../../components/risk-score-badge/risk-score-badge.component';
import {
  RISK_STATUSES,
  RISK_STATUS_LABELS,
  RISK_PROXIMITIES,
  RISK_PROXIMITY_LABELS,
  RISK_RESPONSE_TYPES,
  RISK_RESPONSE_TYPE_LABELS,
  SCORE_LEVELS,
  RiskStatus,
  RiskProximity,
  RiskResponseType,
  UpdateRiskPayload,
  riskScoreClass,
} from '../../contracts/risk.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-risk-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    RiskStatusChipComponent,
    RiskScoreBadgeComponent,
    SkeletonComponent,
  ],
  templateUrl: './risk-detail.component.html',
  styleUrl: './risk-detail.component.scss',
})
export class RiskDetailComponent {
  readonly riskId = input<string>();

  private readonly riskService = inject(RiskService);
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly risk = this.riskService.selectedRisk;
  protected readonly project = this.projectService.selectedProject;
  protected readonly members = this.memberService.members;
  protected readonly loading = this.riskService.loading;

  protected readonly statuses = RISK_STATUSES;
  protected readonly statusLabels = RISK_STATUS_LABELS;
  protected readonly proximities = RISK_PROXIMITIES;
  protected readonly proximityLabels = RISK_PROXIMITY_LABELS;
  protected readonly responseTypes = RISK_RESPONSE_TYPES;
  protected readonly responseTypeLabels = RISK_RESPONSE_TYPE_LABELS;
  protected readonly scoreLevels = SCORE_LEVELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);

  protected readonly computedScore = computed(() => {
    const p = this.form.get('probability')?.value ?? 0;
    const i = this.form.get('impact')?.value ?? 0;
    return (p ?? 0) * (i ?? 0);
  });

  protected readonly computedScoreClass = computed(() => riskScoreClass(this.computedScore()));

  protected readonly computedResidualScore = computed(() => {
    const p = this.form.get('residual_probability')?.value;
    const i = this.form.get('residual_impact')?.value;
    if (!p || !i) return null;
    return (p as number) * (i as number);
  });

  protected readonly form = this.fb.group({
    title: [''],
    category: [''],
    description: [''],
    probability: [null as number | null],
    impact: [null as number | null],
    proximity: ['' as RiskProximity],
    response_type: ['' as RiskResponseType],
    response_action: [''],
    risk_owner: [null as number | null],
    residual_probability: [null as number | null],
    residual_impact: [null as number | null],
    status: ['' as RiskStatus],
  });

  constructor() {
    effect(() => {
      const id = this.riskId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.riskService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load risk.'),
        });
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });

    effect(() => {
      const r = this.risk();
      if (r) {
        this.form.patchValue({
          title: r.title,
          category: r.category ?? '',
          description: r.description ?? '',
          probability: r.probability,
          impact: r.impact,
          proximity: r.proximity,
          response_type: r.responseType,
          response_action: r.responseAction ?? '',
          risk_owner: r.owner?.id ?? null,
          residual_probability: r.residualProbability,
          residual_impact: r.residualImpact,
          status: r.status,
        });
        this.form.markAsPristine();
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/projects', project.id, 'risks']);
  }

  protected save(): void {
    const r = this.risk();
    const project = this.project();
    if (!r || !project) return;

    const v = this.form.value;
    const payload: UpdateRiskPayload = {
      title: v.title!,
      category: v.category || null,
      description: v.description || null,
      probability: v.probability!,
      impact: v.impact!,
      proximity: v.proximity as RiskProximity,
      response_type: v.response_type as RiskResponseType,
      response_action: v.response_action || null,
      risk_owner: v.risk_owner!,
      residual_probability: v.residual_probability ?? null,
      residual_impact: v.residual_impact ?? null,
      status: v.status as RiskStatus,
    };
    this.saveError.set(null);
    this.riskService.update(project.id, r.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected deleteRisk(): void {
    const r = this.risk();
    const project = this.project();
    if (!r || !project) return;
    this.riskService.remove(project.id, r.id).subscribe({
      next: () => this.goBack(),
      error: () => this.saveError.set('Delete failed. Please try again.'),
    });
  }
}
