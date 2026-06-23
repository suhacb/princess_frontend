import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RiskService } from '../../services/risk.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { RiskStatusChipComponent } from '../../components/risk-status-chip/risk-status-chip.component';
import { RiskScoreBadgeComponent } from '../../components/risk-score-badge/risk-score-badge.component';
import {
  CreateRiskDialogComponent,
  CreateRiskDialogData,
} from '../../components/create-risk-dialog/create-risk-dialog.component';
import {
  CreateRiskPayload,
  Risk,
  RISK_STATUS_LABELS,
  RISK_STATUSES,
  RISK_PROXIMITY_LABELS,
  RISK_RESPONSE_TYPE_LABELS,
  RiskStatus,
} from '../../contracts/risk.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

type SortKey = 'score' | 'raised_at';

@Component({
  selector: 'app-risk-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    RiskStatusChipComponent,
    RiskScoreBadgeComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './risk-list.component.html',
  styleUrl: './risk-list.component.scss',
})
export class RiskListComponent {
  private readonly riskService = inject(RiskService);
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.riskService.loading;
  protected readonly statusLabels = RISK_STATUS_LABELS;
  protected readonly proximityLabels = RISK_PROXIMITY_LABELS;
  protected readonly responseTypeLabels = RISK_RESPONSE_TYPE_LABELS;
  protected readonly statusFilter = signal<RiskStatus | 'all'>('all');
  protected readonly sortKey = signal<SortKey>('score');
  protected readonly riskStatuses = RISK_STATUSES;

  protected readonly filteredAndSorted = computed<Risk[]>(() => {
    const filter = this.statusFilter();
    const key = this.sortKey();
    let risks = this.riskService.risks();
    if (filter !== 'all') risks = risks.filter(r => r.status === filter);
    return [...risks].sort((a, b) => {
      if (key === 'score') return b.riskScore - a.riskScore;
      return (b.raisedAt ?? '').localeCompare(a.raisedAt ?? '');
    });
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.riskService.list(project.id).subscribe();
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });
  }

  protected openCreateDialog(): void {
    const members = this.memberService.members();
    const data: CreateRiskDialogData = { members };
    this.dialog
      .open(CreateRiskDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((payload: CreateRiskPayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.riskService.create(project.id, payload).subscribe({
          next: risk => this.navigateToRisk(risk.id),
        });
      });
  }

  protected navigateToRisk(riskId: number): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/projects', project.id, 'risks', riskId]);
  }
}
