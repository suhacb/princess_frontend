import { Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { TestSessionPlanService } from '../../services/test-session-plan.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TestScenarioService } from '../../../test-scenarios/services/test-scenario.service';
import { TestSessionPlanStatusChipComponent } from '../../components/test-session-plan-status-chip/test-session-plan-status-chip.component';
import {
  CreateTestSessionPlanDialogComponent,
  CreateTestSessionPlanDialogData,
} from '../../components/create-test-session-plan-dialog/create-test-session-plan-dialog.component';
import {
  CreateTestSessionPlanPayload,
  TEAM_TYPE_LABELS,
  TEAM_TYPES,
  TEST_SESSION_PLAN_STATUS_LABELS,
  TEST_SESSION_PLAN_STATUSES,
  TeamType,
  TestSessionPlan,
  TestSessionPlanStatus,
} from '../../contracts/test-session-plan.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-test-session-plan-list',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    TestSessionPlanStatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './test-session-plan-list.component.html',
  styleUrl: './test-session-plan-list.component.scss',
})
export class TestSessionPlanListComponent {
  private readonly planService = inject(TestSessionPlanService);
  protected readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly scenarioService = inject(TestScenarioService);
  private readonly dialog = inject(MatDialog);

  protected readonly plans = this.planService.plans;
  protected readonly loading = this.planService.loading;
  protected readonly members = this.memberService.members;

  protected readonly statusLabels = TEST_SESSION_PLAN_STATUS_LABELS;
  protected readonly statuses = TEST_SESSION_PLAN_STATUSES;
  protected readonly teamTypeLabels = TEAM_TYPE_LABELS;
  protected readonly teamTypes = TEAM_TYPES;

  protected readonly statusFilter = signal<TestSessionPlanStatus | 'all'>('all');
  protected readonly teamTypeFilter = signal<TeamType | 'all'>('all');

  protected readonly actionError = signal<string | null>(null);

  protected readonly filtered = computed<TestSessionPlan[]>(() => {
    const status = this.statusFilter();
    const teamType = this.teamTypeFilter();
    let items = this.plans();
    if (status !== 'all') items = items.filter(p => p.status === status);
    if (teamType !== 'all') items = items.filter(p => p.teamType === teamType);
    return items;
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.planService.list(project.id).subscribe();
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });
  }

  protected openCreateDialog(): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.scenarioService.list(project.id, { is_testable: true }).subscribe(scenarios => {
      const data: CreateTestSessionPlanDialogData = { members: this.members(), scenarios };
      this.dialog
        .open(CreateTestSessionPlanDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
        .afterClosed()
        .subscribe((payload: CreateTestSessionPlanPayload | undefined) => {
          if (!payload) return;
          this.actionError.set(null);
          this.planService.create(project.id, payload).subscribe({
            error: () => this.actionError.set('Could not create the test session plan.'),
          });
        });
    });
  }

  protected openEditDialog(plan: TestSessionPlan): void {
    if (plan.status !== 'draft') return;
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.scenarioService.list(project.id, { is_testable: true }).subscribe(scenarios => {
      const data: CreateTestSessionPlanDialogData = { members: this.members(), scenarios, plan };
      this.dialog
        .open(CreateTestSessionPlanDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
        .afterClosed()
        .subscribe((payload: CreateTestSessionPlanPayload | undefined) => {
          if (!payload) return;
          this.actionError.set(null);
          this.planService.update(project.id, plan.id, payload).subscribe({
            error: () => this.actionError.set('Could not save the test session plan.'),
          });
        });
    });
  }

  protected deletePlan(plan: TestSessionPlan): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.actionError.set(null);
    this.planService.remove(project.id, plan.id).subscribe({
      error: () => this.actionError.set('Could not delete the test session plan.'),
    });
  }

  protected activatePlan(plan: TestSessionPlan): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.actionError.set(null);
    this.planService.activate(project.id, plan.id).subscribe({
      error: () => this.actionError.set('Could not activate the test session plan.'),
    });
  }

  protected completePlan(plan: TestSessionPlan): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.actionError.set(null);
    this.planService.complete(project.id, plan.id).subscribe({
      error: () => this.actionError.set('Could not complete the test session plan.'),
    });
  }

  protected cancelPlan(plan: TestSessionPlan): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.actionError.set(null);
    this.planService.cancel(project.id, plan.id).subscribe({
      error: () => this.actionError.set('Could not cancel the test session plan.'),
    });
  }
}
