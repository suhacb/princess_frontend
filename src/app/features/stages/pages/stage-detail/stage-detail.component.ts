import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { StageService } from '../../services/stage.service';
import { ProjectService } from '../../../projects/services/project.service';
import { StageStatusChipComponent } from '../../components/stage-status-chip/stage-status-chip.component';
import {
  StageTransitionDialogComponent,
  StageTransitionDialogData,
} from '../../components/stage-transition-dialog/stage-transition-dialog.component';
import {
  STAGE_TYPE_LABELS,
  StageTransitionAction,
  ToleranceHealth,
  availableTransitions,
} from '../../contracts/stage.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { BoundaryListComponent } from '../../../boundaries/pages/boundary-list/boundary-list.component';

@Component({
  selector: 'app-stage-detail',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    DatePipe,
    StageStatusChipComponent,
    SkeletonComponent,
    TitleCasePipe,
    BoundaryListComponent,
  ],
  templateUrl: './stage-detail.component.html',
  styleUrl: './stage-detail.component.scss',
})
export class StageDetailComponent {
  readonly stageId = input<string>();

  private readonly stageService = inject(StageService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.stageService.loading;
  protected readonly stage = this.stageService.selectedStage;
  protected readonly project = this.projectService.selectedProject;

  protected readonly stageTypeLabels = STAGE_TYPE_LABELS;
  protected readonly transitionError = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);

  protected readonly transitions = computed(() => {
    const stage = this.stage();
    return stage ? availableTransitions(stage.status) : [];
  });

  protected readonly stageIdNum = computed(() => {
    const id = this.stageId();
    return id ? +id : null;
  });

  protected readonly textToleranceDims = ['scope', 'risk', 'quality', 'benefit'] as const;

  constructor() {
    effect(() => {
      const id = this.stageId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.stageService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load stage. Please try again.'),
        });
      }
    });
  }

  protected openTransitionDialog(action: StageTransitionAction): void {
    const stage = this.stage();
    const project = this.project();
    if (!stage || !project) return;

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

  protected setCurrentStage(): void {
    const stage = this.stage();
    const project = this.project();
    if (!stage || !project) return;
    this.projectService.setCurrentStage(project.id, stage.id).subscribe();
  }

  protected formatToleranceRange(min: number | null, max: number | null, unit: string): string {
    if (min === null && max === null) return 'Not set';
    const minStr = min !== null ? `${min}` : '—';
    const maxStr = max !== null ? `${max}` : '—';
    return `${minStr} / ${maxStr} ${unit}`;
  }

  protected getTextTolerance(dim: 'scope' | 'risk' | 'quality' | 'benefit'): string | null {
    const t = this.stage()?.tolerances;
    return t ? t[dim] : null;
  }

  protected getToleranceHealth(dim: 'scope' | 'risk' | 'quality' | 'benefit'): ToleranceHealth {
    const s = this.stage()?.toleranceStatus;
    return s ? s[dim] : null;
  }
}
