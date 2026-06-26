import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../core/http/api.service';
import { ApiResource } from '../../../../shared/contracts/api.contracts';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  CreateWorkPackagePayload,
  ProjectMember,
  ProjectMemberApiResource,
  WorkPackage,
  WorkPackageStatus,
  mapProjectMember,
} from '../../contracts/work-package.contracts';
import { WorkPackageService } from '../../services/work-package.service';
import {
  CreateWorkPackageDialogComponent,
  CreateWorkPackageDialogData,
} from '../create-work-package-dialog/create-work-package-dialog.component';
import { WpStatusChipComponent } from '../wp-status-chip/wp-status-chip.component';

@Component({
  selector: 'app-work-package-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    EmptyStateComponent,
    SkeletonComponent,
    WpStatusChipComponent,
  ],
  templateUrl: './work-package-list.component.html',
  styleUrl: './work-package-list.component.scss',
})
export class WorkPackageListComponent {
  readonly projectId = input.required<number>();

  protected readonly wpService = inject(WorkPackageService);
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);

  protected readonly workPackages = this.wpService.workPackages;
  protected readonly loading = this.wpService.loading;

  protected openCreateDialog(): void {
    this.api
      .get<ApiResource<ProjectMemberApiResource[]>>(`/projects/${this.projectId()}/members`)
      .pipe(
        switchMap(res => {
          const members: ProjectMember[] = res.data.map(mapProjectMember);
          return this.dialog
            .open(CreateWorkPackageDialogComponent, {
              panelClass: 'princess-dialog',
              data: { members } satisfies CreateWorkPackageDialogData,
            })
            .afterClosed();
        }),
      )
      .subscribe((payload: CreateWorkPackagePayload | undefined) => {
        if (!payload) return;
        this.wpService.create(this.projectId(), payload).subscribe();
      });
  }

  protected canAuthorize(wp: WorkPackage): boolean { return wp.status === 'draft'; }
  protected canAccept(wp: WorkPackage): boolean { return wp.status === 'authorized'; }
  protected canComplete(wp: WorkPackage): boolean { return wp.status === 'in_progress'; }
  protected canCancel(wp: WorkPackage): boolean {
    return wp.status === 'authorized' || wp.status === 'in_progress';
  }

  protected authorize(wp: WorkPackage): void {
    this.wpService.authorize(this.projectId(), wp.id).subscribe();
  }
  protected accept(wp: WorkPackage): void {
    this.wpService.accept(this.projectId(), wp.id).subscribe();
  }
  protected complete(wp: WorkPackage): void {
    this.wpService.complete(this.projectId(), wp.id).subscribe();
  }

  protected confirmCancel(wp: WorkPackage): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Cancel work package',
          message: `Cancel "${wp.title}"?`,
          confirmLabel: 'Cancel WP',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) this.wpService.cancel(this.projectId(), wp.id).subscribe();
      });
  }

  protected confirmDelete(wp: WorkPackage): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: 'princess-dialog',
        data: {
          title: 'Delete work package',
          message: `Delete "${wp.title}"? This action cannot be undone.`,
          confirmLabel: 'Delete',
          confirmColor: 'warn',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) this.wpService.remove(this.projectId(), wp.id).subscribe();
      });
  }

  constructor() {
    effect(() => {
      const pid = this.projectId();
      this.wpService.list(pid).subscribe();
    });
  }
}
