import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AcceptanceCriterionService } from '../../services/acceptance-criterion.service';
import { RequirementService } from '../../../requirements/services/requirement.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { AcStatusChipComponent } from '../../components/ac-status-chip/ac-status-chip.component';
import { AcVerificationMethodChipComponent } from '../../components/ac-verification-method-chip/ac-verification-method-chip.component';
import { AcDecisionChipComponent } from '../../components/ac-decision-chip/ac-decision-chip.component';
import { AcceptanceCriterionDetailPanelComponent } from '../../components/acceptance-criterion-detail-panel/acceptance-criterion-detail-panel.component';
import {
  CreateAcceptanceCriterionDialogComponent,
  CreateAcceptanceCriterionDialogData,
} from '../../components/create-acceptance-criterion-dialog/create-acceptance-criterion-dialog.component';
import {
  AC_STATUSES,
  AC_STATUS_LABELS,
  AcceptanceCriterion,
  AcceptanceCriterionStatus,
  CreateAcceptanceCriterionPayload,
} from '../../contracts/acceptance-criterion.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-acceptance-criterion-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    AcStatusChipComponent,
    AcVerificationMethodChipComponent,
    AcDecisionChipComponent,
    AcceptanceCriterionDetailPanelComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './acceptance-criterion-list.component.html',
  styleUrl: './acceptance-criterion-list.component.scss',
})
export class AcceptanceCriterionListComponent {
  private readonly acService = inject(AcceptanceCriterionService);
  private readonly requirementService = inject(RequirementService);
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.acService.loading;
  protected readonly statusLabels = AC_STATUS_LABELS;
  protected readonly statuses = AC_STATUSES;

  protected readonly statusFilter = signal<AcceptanceCriterionStatus | 'all'>('all');
  protected readonly requirementFilter = signal<number | 'all'>('all');
  protected readonly selectedCriterionId = signal<number | null>(null);

  protected readonly projectId = computed(() => this.projectService.selectedProject()?.id ?? 0);

  protected readonly linkableRequirements = computed(() =>
    this.requirementService.requirements().filter(r => r.type !== 'epic'),
  );

  protected readonly filtered = computed<AcceptanceCriterion[]>(() => {
    const status = this.statusFilter();
    const requirementId = this.requirementFilter();
    let items = this.acService.criteria();
    if (status !== 'all') items = items.filter(c => c.status === status);
    if (requirementId !== 'all') items = items.filter(c => c.requirementId === requirementId);
    return items;
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.acService.list(project.id).subscribe();
        this.requirementService.list(project.id).subscribe();
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });
  }

  protected openCreateDialog(): void {
    const data: CreateAcceptanceCriterionDialogData = {
      requirements: this.linkableRequirements(),
      members: this.memberService.members(),
    };
    this.dialog
      .open(CreateAcceptanceCriterionDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((payload: CreateAcceptanceCriterionPayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.acService.create(project.id, payload).subscribe({
          next: criterion => this.selectedCriterionId.set(criterion.id),
        });
      });
  }

  protected openCriterion(id: number): void {
    this.selectedCriterionId.set(id);
  }

  protected closePanel(): void {
    this.selectedCriterionId.set(null);
  }
}
