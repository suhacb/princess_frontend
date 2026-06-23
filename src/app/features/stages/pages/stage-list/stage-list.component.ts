import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { StageService } from '../../services/stage.service';
import { ProjectService } from '../../../projects/services/project.service';
import { StageStatusChipComponent } from '../../components/stage-status-chip/stage-status-chip.component';
import {
  CreateStageDialogComponent,
  CreateStageDialogData,
} from '../../components/create-stage-dialog/create-stage-dialog.component';
import {
  StageTransitionDialogComponent,
  StageTransitionDialogData,
} from '../../components/stage-transition-dialog/stage-transition-dialog.component';
import {
  STAGE_TYPE_LABELS,
  Stage,
  StageTransitionAction,
  availableTransitions,
} from '../../contracts/stage.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-stage-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    DatePipe,
    StageStatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './stage-list.component.html',
  styleUrl: './stage-list.component.scss',
})
export class StageListComponent {
  private readonly stageService = inject(StageService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.stageService.loading;
  protected readonly stages = this.stageService.stages;
  protected readonly project = this.projectService.selectedProject;

  protected readonly stageTypeLabels = STAGE_TYPE_LABELS;

  protected readonly transitionError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) this.stageService.list(project.id).subscribe();
    });
  }

  protected navigateToStage(stageId: number): void {
    const project = this.project();
    if (!project) return;
    this.router.navigate(['/projects', project.id, 'stages', stageId]);
  }

  protected availableTransitions(stage: Stage): StageTransitionAction[] {
    return availableTransitions(stage.status);
  }

  protected openCreateDialog(): void {
    const project = this.project();
    if (!project) return;

    const data: CreateStageDialogData = {
      projectId: project.id,
      projectTolerances: project.tolerances,
    };

    this.dialog.open(CreateStageDialogComponent, {
      panelClass: 'princess-dialog',
      disableClose: true,
      data,
    });
  }

  protected openTransitionDialog(stage: Stage, action: StageTransitionAction): void {
    const project = this.project();
    if (!project) return;

    const data: StageTransitionDialogData = { stageName: stage.name, action };

    this.dialog
      .open(StageTransitionDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.transitionError.set(null);
        this.stageService.transition(project.id, stage.id, action).subscribe({
          error: () => this.transitionError.set('Transition failed. Please try again.'),
        });
      });
  }

}
