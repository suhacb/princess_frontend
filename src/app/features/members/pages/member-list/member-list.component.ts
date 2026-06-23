import { Component, effect, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MemberService } from '../../services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { MemberRoleChipComponent } from '../../components/member-role-chip/member-role-chip.component';
import {
  EditMemberDialogComponent,
  EditMemberDialogData,
} from '../../components/edit-member-dialog/edit-member-dialog.component';
import { Member, PERSON_SIDE_LABELS, PersonSide, UpdateMemberPayload } from '../../contracts/member.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-member-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MemberRoleChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent {
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.memberService.loading;
  protected readonly members = this.memberService.members;
  protected readonly project = this.projectService.selectedProject;

  protected sideLabel(side: PersonSide | null): string {
    return side ? PERSON_SIDE_LABELS[side] : '';
  }
  protected readonly displayedColumns = ['name', 'role', 'side', 'actions'];

  protected readonly pendingRemoveId = signal<number | null>(null);
  protected readonly removeError = signal<string | null>(null);
  protected readonly updateError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) this.memberService.list(project.id).subscribe();
    });
  }

  protected openEditDialog(member: Member): void {
    const project = this.project();
    if (!project) return;

    const data: EditMemberDialogData = { member };
    this.dialog
      .open(EditMemberDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((payload: UpdateMemberPayload | undefined) => {
        if (!payload) return;
        this.updateError.set(null);
        this.memberService.update(project.id, member.id, payload).subscribe({
          error: () => this.updateError.set('Update failed. Please try again.'),
        });
      });
  }

  protected personMeta(member: Member): string {
    return [member.person.jobTitle, member.person.organization].filter(Boolean).join(' · ');
  }

  protected initiateRemove(memberId: number): void {
    this.pendingRemoveId.set(memberId);
    this.removeError.set(null);
  }

  protected cancelRemove(): void {
    this.pendingRemoveId.set(null);
  }

  protected confirmRemove(member: Member): void {
    const project = this.project();
    if (!project) return;
    this.pendingRemoveId.set(null);
    this.memberService.remove(project.id, member.id).subscribe({
      error: () => this.removeError.set('Cannot remove the last project manager.'),
    });
  }
}
