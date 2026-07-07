import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../members/contracts/member.contracts';
import { ProjectService } from '../../../projects/services/project.service';
import {
  TEAM_TYPE_LABELS,
  TEAM_TYPES,
  TeamType,
  TestSessionPlan,
} from '../../contracts/test-session-plan.contracts';
import { CreateTestSessionPayload } from '../../contracts/test-session.contracts';

export interface CreateTestSessionDialogData {
  members: Member[];
  plans: TestSessionPlan[];
}

@Component({
  selector: 'app-create-test-session-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './create-test-session-dialog.component.html',
  styleUrl: './create-test-session-dialog.component.scss',
})
export class CreateTestSessionDialogComponent {
  protected readonly data = inject<CreateTestSessionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateTestSessionDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  protected readonly teamTypes = TEAM_TYPES;
  protected readonly teamTypeLabels = TEAM_TYPE_LABELS;

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    session_date: ['', Validators.required],
    tester_id: [null as number | null, Validators.required],
    team_type: ['supplier' as TeamType, Validators.required],
    test_session_plan_id: [null as number | null, Validators.required],
    environment: [''],
    notes: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateTestSessionPayload = {
      title: v.title!,
      session_date: v.session_date!,
      tester_id: v.tester_id!,
      team_type: v.team_type as TeamType,
      test_session_plan_id: v.test_session_plan_id!,
      environment: v.environment || null,
      notes: v.notes || null,
    };
    this.dialogRef.close(payload);
  }

  protected managePlans(): void {
    const project = this.projectService.selectedProject();
    this.dialogRef.close();
    if (project) this.router.navigate(['/p', project.id, 'test-session-plans']);
  }
}
