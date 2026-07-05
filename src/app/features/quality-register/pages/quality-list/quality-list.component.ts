import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { QualityRegisterService } from '../../services/quality-register.service';
import { ProjectService } from '../../../projects/services/project.service';
import { QualityResultChipComponent } from '../../components/quality-result-chip/quality-result-chip.component';
import { CreateQualityEntryDialogComponent } from '../../components/create-quality-entry-dialog/create-quality-entry-dialog.component';
import {
  QualityEntry,
  QUALITY_METHOD_LABELS,
  QUALITY_RESULTS,
  QUALITY_RESULT_LABELS,
  QualityResult,
  CreateQualityEntryPayload,
} from '../../contracts/quality-register.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-quality-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    DatePipe,
    QualityResultChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './quality-list.component.html',
  styleUrl: './quality-list.component.scss',
})
export class QualityListComponent {
  private readonly qualityService = inject(QualityRegisterService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.qualityService.loading;
  protected readonly methodLabels = QUALITY_METHOD_LABELS;
  protected readonly resultLabels = QUALITY_RESULT_LABELS;
  protected readonly qualityResults = QUALITY_RESULTS;
  protected readonly resultFilter = signal<QualityResult | 'all'>('all');

  protected readonly filteredEntries = computed<QualityEntry[]>(() => {
    const filter = this.resultFilter();
    const entries = this.qualityService.entries();
    return filter === 'all' ? entries : entries.filter(e => e.result === filter);
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) this.qualityService.list(project.id).subscribe();
    });
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateQualityEntryDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((payload: CreateQualityEntryPayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.qualityService.create(project.id, payload).subscribe({
          next: entry => this.navigateToEntry(entry.id),
        });
      });
  }

  protected navigateToEntry(entryId: number): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'quality', entryId]);
  }
}
