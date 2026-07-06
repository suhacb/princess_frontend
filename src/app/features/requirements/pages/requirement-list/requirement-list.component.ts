import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RequirementService } from '../../services/requirement.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { RequirementStatusChipComponent } from '../../components/requirement-status-chip/requirement-status-chip.component';
import { RequirementPriorityChipComponent } from '../../components/requirement-priority-chip/requirement-priority-chip.component';
import {
  CreateRequirementDialogComponent,
  CreateRequirementDialogData,
} from '../../components/create-requirement-dialog/create-requirement-dialog.component';
import {
  CreateRequirementPayload,
  Requirement,
  REQUIREMENT_STATUS_LABELS,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPE_LABELS,
  REQUIREMENT_TYPES,
  RequirementStatus,
  RequirementType,
} from '../../contracts/requirement.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-requirement-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    RequirementStatusChipComponent,
    RequirementPriorityChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './requirement-list.component.html',
  styleUrl: './requirement-list.component.scss',
})
export class RequirementListComponent {
  private readonly requirementService = inject(RequirementService);
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.requirementService.loading;
  protected readonly statusLabels = REQUIREMENT_STATUS_LABELS;
  protected readonly typeLabels = REQUIREMENT_TYPE_LABELS;
  protected readonly requirementStatuses = REQUIREMENT_STATUSES;
  protected readonly requirementTypes = REQUIREMENT_TYPES;

  protected readonly statusFilter = signal<RequirementStatus | 'all'>('all');
  protected readonly typeFilter = signal<RequirementType | 'all'>('all');

  protected readonly filtered = computed<Requirement[]>(() => {
    const status = this.statusFilter();
    const type = this.typeFilter();
    let items = this.requirementService.requirements();
    if (status !== 'all') items = items.filter(r => r.status === status);
    if (type !== 'all') items = items.filter(r => r.type === type);
    return items;
  });

  protected readonly epics = computed(() =>
    this.requirementService.requirements().filter(r => r.type === 'epic'),
  );

  protected epicTitle(parentId: number | null): string | null {
    if (!parentId) return null;
    return this.requirementService.requirements().find(r => r.id === parentId)?.title ?? null;
  }

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.requirementService.list(project.id).subscribe();
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });
  }

  protected openCreateDialog(): void {
    const data: CreateRequirementDialogData = {
      members: this.memberService.members(),
      epics: this.epics(),
    };
    this.dialog
      .open(CreateRequirementDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((payload: CreateRequirementPayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.requirementService.create(project.id, payload).subscribe({
          next: requirement => this.navigateToRequirement(requirement.id),
        });
      });
  }

  protected navigateToRequirement(requirementId: number): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'requirements', requirementId]);
  }
}
