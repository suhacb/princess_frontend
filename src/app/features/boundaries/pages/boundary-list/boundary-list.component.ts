import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { BoundaryService } from '../../services/boundary.service';
import { ProjectService } from '../../../projects/services/project.service';
import { BoundaryStatusChipComponent } from '../../components/boundary-status-chip/boundary-status-chip.component';
import {
  CreateBoundaryDialogComponent,
} from '../../components/create-boundary-dialog/create-boundary-dialog.component';
import {
  BOUNDARY_TYPE_LABELS,
  CreateBoundaryPayload,
} from '../../contracts/boundary.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-boundary-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DatePipe,
    BoundaryStatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './boundary-list.component.html',
  styleUrl: './boundary-list.component.scss',
})
export class BoundaryListComponent {
  readonly projectId = input.required<number>();
  readonly stageId = input.required<number>();

  private readonly boundaryService = inject(BoundaryService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.boundaryService.loading;
  protected readonly boundaries = this.boundaryService.boundaries;
  protected readonly typeLabels = BOUNDARY_TYPE_LABELS;

  constructor() {
    effect(() => {
      this.boundaryService.list(this.projectId(), this.stageId()).subscribe();
    });
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateBoundaryDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((payload: CreateBoundaryPayload | undefined) => {
        if (!payload) return;
        this.boundaryService.create(this.projectId(), this.stageId(), payload).subscribe({
          next: b => this.navigateToBoundary(b.id),
        });
      });
  }

  protected navigateToBoundary(boundaryId: number): void {
    this.router.navigate([
      '/projects', this.projectService.selectedProject()?.id,
      'stages', this.stageId(),
      'boundaries', boundaryId,
    ]);
  }
}
