import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { RequirementService } from '../../services/requirement.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { RequirementStatusChipComponent } from '../../components/requirement-status-chip/requirement-status-chip.component';
import { RequirementPriorityChipComponent } from '../../components/requirement-priority-chip/requirement-priority-chip.component';
import { RequirementVersionListComponent } from '../../components/requirement-version-list/requirement-version-list.component';
import { AcceptanceCriterionService } from '../../../acceptance-criteria/services/acceptance-criterion.service';
import { AcStatusChipComponent } from '../../../acceptance-criteria/components/ac-status-chip/ac-status-chip.component';
import { AcDecisionChipComponent } from '../../../acceptance-criteria/components/ac-decision-chip/ac-decision-chip.component';
import { AcceptanceCriterionDetailPanelComponent } from '../../../acceptance-criteria/components/acceptance-criterion-detail-panel/acceptance-criterion-detail-panel.component';
import {
  CreateAcceptanceCriterionDialogComponent,
  CreateAcceptanceCriterionDialogData,
} from '../../../acceptance-criteria/components/create-acceptance-criterion-dialog/create-acceptance-criterion-dialog.component';
import { CreateAcceptanceCriterionPayload } from '../../../acceptance-criteria/contracts/acceptance-criterion.contracts';
import {
  REQUIREMENT_PRIORITIES,
  REQUIREMENT_PRIORITY_LABELS,
  REQUIREMENT_TYPE_LABELS,
  RequirementPriority,
  UpdateRequirementPayload,
} from '../../contracts/requirement.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-requirement-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    RequirementStatusChipComponent,
    RequirementPriorityChipComponent,
    RequirementVersionListComponent,
    AcStatusChipComponent,
    AcDecisionChipComponent,
    AcceptanceCriterionDetailPanelComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './requirement-detail.component.html',
  styleUrl: './requirement-detail.component.scss',
})
export class RequirementDetailComponent {
  readonly requirementId = input<string>();

  private readonly requirementService = inject(RequirementService);
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly acceptanceCriterionService = inject(AcceptanceCriterionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  protected readonly requirement = this.requirementService.selectedRequirement;
  protected readonly project = this.projectService.selectedProject;
  protected readonly members = this.memberService.members;
  protected readonly loading = this.requirementService.loading;
  protected readonly acceptanceCriteria = this.acceptanceCriterionService.criteria;
  protected readonly selectedCriterionId = signal<number | null>(null);

  protected readonly typeLabels = REQUIREMENT_TYPE_LABELS;
  protected readonly priorities = REQUIREMENT_PRIORITIES;
  protected readonly priorityLabels = REQUIREMENT_PRIORITY_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly isUserStory = computed(() => this.requirement()?.type === 'user_story');
  protected readonly isEpic = computed(() => this.requirement()?.type === 'epic');
  protected readonly isDeletable = computed(() => this.requirement()?.status === 'draft');

  protected readonly form = this.fb.group({
    title: [''],
    description: [''],
    role: [''],
    action: [''],
    benefit: [''],
    priority: ['' as RequirementPriority],
    source: [''],
    owner_id: [null as number | null],
  });

  constructor() {
    effect(() => {
      const id = this.requirementId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.requirementService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load requirement.'),
        });
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
        this.acceptanceCriterionService.list(project.id, { requirement_id: +id }).subscribe();
      }
    });

    effect(() => {
      const r = this.requirement();
      if (r) {
        this.form.patchValue({
          title: r.title,
          description: r.description ?? '',
          role: r.role ?? '',
          action: r.action ?? '',
          benefit: r.benefit ?? '',
          priority: r.priority,
          source: r.source ?? '',
          owner_id: r.owner?.id ?? null,
        });
        this.form.markAsPristine();
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/p', project.id, 'requirements']);
  }

  protected save(): void {
    const r = this.requirement();
    const project = this.project();
    if (!r || !project) return;

    const v = this.form.value;
    const payload: UpdateRequirementPayload = {
      title: v.title!,
      description: v.description || null,
      priority: v.priority as RequirementPriority,
      source: v.source || null,
      owner_id: v.owner_id ?? null,
      ...(r.type === 'user_story'
        ? { role: v.role || null, action: v.action || null, benefit: v.benefit || null }
        : {}),
    };
    this.saveError.set(null);
    this.requirementService.update(project.id, r.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected deleteRequirement(): void {
    const r = this.requirement();
    const project = this.project();
    if (!r || !project) return;
    this.requirementService.remove(project.id, r.id).subscribe({
      next: () => this.goBack(),
      error: () => this.actionError.set('Delete failed — check that this requirement has no dependent children.'),
    });
  }

  protected sendForReview(): void {
    this.runTransition(id => this.requirementService.review(this.project()!.id, id));
  }

  protected approve(): void {
    this.runTransition(id => this.requirementService.approve(this.project()!.id, id));
  }

  protected reject(): void {
    this.runTransition(id => this.requirementService.reject(this.project()!.id, id));
  }

  protected defer(): void {
    this.runTransition(id => this.requirementService.defer(this.project()!.id, id));
  }

  private runTransition(fn: (id: number) => ReturnType<RequirementService['review']>): void {
    const r = this.requirement();
    const project = this.project();
    if (!r || !project) return;
    this.actionError.set(null);
    fn(r.id).subscribe({
      error: () => this.actionError.set('Action failed — you may not have permission to do this.'),
    });
  }

  protected openCreateAcceptanceCriterionDialog(): void {
    const r = this.requirement();
    const project = this.project();
    if (!r || !project) return;
    const data: CreateAcceptanceCriterionDialogData = {
      requirements: [{ id: r.id, ref: r.ref, title: r.title, type: r.type }],
      members: this.members(),
      preselectedRequirementId: r.id,
    };
    this.dialog
      .open(CreateAcceptanceCriterionDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((payload: CreateAcceptanceCriterionPayload | undefined) => {
        if (!payload) return;
        this.acceptanceCriterionService.create(project.id, payload).subscribe({
          next: criterion => this.selectedCriterionId.set(criterion.id),
        });
      });
  }

  protected openAcceptanceCriterion(id: number): void {
    this.selectedCriterionId.set(id);
  }

  protected closeAcceptanceCriterionPanel(): void {
    this.selectedCriterionId.set(null);
  }
}
