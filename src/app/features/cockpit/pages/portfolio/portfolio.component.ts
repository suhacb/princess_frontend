import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../projects/services/project.service';
import { ShellStore } from '../../../../core/services/shell.store';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  CreateProjectDialogComponent,
} from '../../../projects/components/create-project-dialog/create-project-dialog.component';
import { Project, PROJECT_STATUS_LABELS, PROJECT_STATUSES, ProjectStatus } from '../../../projects/contracts/project.contracts';

type ToleranceHealth = 'ok' | 'warn' | 'exception';

@Component({
  selector: 'app-portfolio',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    StatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly shellStore = inject(ShellStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly loading = this.projectService.loading;
  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<ProjectStatus | ''>('');
  protected readonly statuses = PROJECT_STATUSES;
  protected readonly statusLabels = PROJECT_STATUS_LABELS;

  protected readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const s = this.statusFilter();
    return this.projectService.projects().filter(p => {
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q);
      const matchesS = !s || p.status === s;
      return matchesQ && matchesS;
    });
  });

  ngOnInit(): void {
    this.projectService.list().subscribe();
  }

  protected openProject(project: Project): void {
    this.shellStore.setProject(project.id);
    this.router.navigate(['/p', project.id, 'home']);
  }

  protected openCreateDialog(): void {
    this.dialog.open(CreateProjectDialogComponent, {
      panelClass: 'princess-dialog',
      disableClose: true,
    });
  }

  protected toleranceHealth(project: Project): ToleranceHealth {
    const t = project.tolerances;
    const hasAny = [t.time?.min, t.time?.max, t.cost?.min, t.cost?.max].some(v => v !== null && v !== undefined);
    if (!hasAny) return 'warn';
    return 'ok';
  }

  protected toleranceLabel(health: ToleranceHealth): string {
    return health === 'ok' ? 'Within' : health === 'warn' ? 'Near limit' : 'Exception';
  }
}
