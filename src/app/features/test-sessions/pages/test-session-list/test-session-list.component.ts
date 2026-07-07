import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { TestSessionService } from '../../services/test-session.service';
import { TestSessionPlanService } from '../../services/test-session-plan.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TestSessionStatusChipComponent } from '../../components/test-session-status-chip/test-session-status-chip.component';
import {
  CreateTestSessionDialogComponent,
  CreateTestSessionDialogData,
} from '../../components/create-test-session-dialog/create-test-session-dialog.component';
import {
  CreateTestSessionPayload,
  TEST_SESSION_STATUS_LABELS,
  TEST_SESSION_STATUSES,
  TestSession,
  TestSessionStatus,
} from '../../contracts/test-session.contracts';
import { TEAM_TYPE_LABELS, TEAM_TYPES, TeamType } from '../../contracts/test-session-plan.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-test-session-list',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    TestSessionStatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './test-session-list.component.html',
  styleUrl: './test-session-list.component.scss',
})
export class TestSessionListComponent {
  private readonly sessionService = inject(TestSessionService);
  private readonly planService = inject(TestSessionPlanService);
  protected readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly sessions = this.sessionService.sessions;
  protected readonly loading = this.sessionService.loading;
  protected readonly members = this.memberService.members;

  protected readonly statusLabels = TEST_SESSION_STATUS_LABELS;
  protected readonly statuses = TEST_SESSION_STATUSES;
  protected readonly teamTypeLabels = TEAM_TYPE_LABELS;
  protected readonly teamTypes = TEAM_TYPES;

  protected readonly statusFilter = signal<TestSessionStatus | 'all'>('all');
  protected readonly teamTypeFilter = signal<TeamType | 'all'>('all');
  protected readonly testerFilter = signal<number | 'all'>('all');

  protected readonly filtered = computed<TestSession[]>(() => {
    const status = this.statusFilter();
    const teamType = this.teamTypeFilter();
    const tester = this.testerFilter();
    let items = this.sessions();
    if (status !== 'all') items = items.filter(s => s.status === status);
    if (teamType !== 'all') items = items.filter(s => s.teamType === teamType);
    if (tester !== 'all') items = items.filter(s => s.tester.id === tester);
    return items;
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.sessionService.list(project.id).subscribe();
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });
  }

  protected openSession(session: TestSession): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'test-sessions', session.id]);
  }

  protected openCreateDialog(): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.planService.list(project.id).subscribe(plans => {
      const data: CreateTestSessionDialogData = { members: this.members(), plans };
      this.dialog
        .open(CreateTestSessionDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
        .afterClosed()
        .subscribe((payload: CreateTestSessionPayload | undefined) => {
          if (!payload) return;
          this.sessionService.create(project.id, payload).subscribe(created => {
            this.router.navigate(['/p', project.id, 'test-sessions', created.id]);
          });
        });
    });
  }
}
