import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProjectStatusChipComponent } from '../../components/project-status-chip/project-status-chip.component';
import { CreateProjectDialogComponent } from '../../components/create-project-dialog/create-project-dialog.component';
import { ProjectService } from '../../services/project.service';
import { Project, PROJECT_STATUS_LABELS, PROJECT_STATUSES, ProjectStatus } from '../../contracts/project.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-project-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    DatePipe,
    ProjectStatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.projectService.loading;
  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<ProjectStatus | ''>('');

  protected readonly statuses = PROJECT_STATUSES;
  protected readonly statusLabels = PROJECT_STATUS_LABELS;
  protected readonly displayedColumns = ['name', 'reference', 'status', 'currentStageName', 'tolerances', 'createdAt', 'actions'];

  protected readonly filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    return this.projectService.projects().filter(p => {
      const matchesQuery = !query ||
        p.name.toLowerCase().includes(query) ||
        p.reference.toLowerCase().includes(query);
      const matchesStatus = !status || p.status === status;
      return matchesQuery && matchesStatus;
    });
  });

  protected sort: Sort = { active: 'name', direction: 'asc' };

  protected readonly sortedProjects = computed(() => {
    const data = [...this.filteredProjects()];
    if (!this.sort.active || this.sort.direction === '') return data;

    return data.sort((a, b) => {
      const dir = this.sort.direction === 'asc' ? 1 : -1;
      const key = this.sort.active as keyof Project;
      const valA = String(a[key] ?? '');
      const valB = String(b[key] ?? '');
      return valA.localeCompare(valB) * dir;
    });
  });

  ngOnInit(): void {
    this.projectService.list().subscribe();
  }

  protected onSortChange(sort: Sort): void {
    this.sort = sort;
  }

  protected openCreateDialog(): void {
    this.dialog.open(CreateProjectDialogComponent, {
      panelClass: 'princess-dialog',
      disableClose: true,
    });
  }

  protected toleranceHealth(project: Project): 'full' | 'partial' | 'none' {
    const t = project.tolerances;
    const fields = [t.time.min, t.time.max, t.cost.min, t.cost.max, t.scope, t.risk, t.quality, t.benefit];
    const defined = fields.filter(f => f !== null && f !== undefined && f !== '').length;
    if (defined === 0) return 'none';
    if (defined === fields.length) return 'full';
    return 'partial';
  }
}
