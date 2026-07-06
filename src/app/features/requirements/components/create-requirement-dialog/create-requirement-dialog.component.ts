import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../members/contracts/member.contracts';
import {
  CreateRequirementPayload,
  REQUIREMENT_PRIORITIES,
  REQUIREMENT_PRIORITY_LABELS,
  REQUIREMENT_TYPE_LABELS,
  Requirement,
  RequirementPriority,
  RequirementType,
} from '../../contracts/requirement.contracts';

export interface CreateRequirementDialogData {
  members: Member[];
  epics: Requirement[];
}

@Component({
  selector: 'app-create-requirement-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>New Requirement</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="epic">{{ typeLabels.epic }}</mat-option>
              <mat-option value="classic">{{ typeLabels.classic }}</mat-option>
              <mat-option value="user_story">{{ typeLabels.user_story }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              @for (p of priorities; track p) {
                <mat-option [value]="p">{{ priorityLabels[p] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        @if (isChild()) {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Parent epic (optional)</mat-label>
            <mat-select formControlName="parent_id">
              <mat-option [value]="null">None</mat-option>
              @for (epic of data.epics; track epic.id) {
                <mat-option [value]="epic.id">{{ epic.ref }} — {{ epic.title }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Short summary" />
        </mat-form-field>

        @if (isUserStory()) {
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>As a…</mat-label>
              <input matInput formControlName="role" placeholder="role" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>I want…</mat-label>
              <input matInput formControlName="action" placeholder="action" />
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>So that…</mat-label>
            <input matInput formControlName="benefit" placeholder="benefit" />
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Source (optional)</mat-label>
            <input matInput formControlName="source" placeholder="e.g. Stakeholder workshop" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Owner (optional)</mat-label>
            <mat-select formControlName="owner_id">
              <mat-option [value]="null">None</mat-option>
              @for (m of data.members; track m.id) {
                <mat-option [value]="m.person.id">{{ m.person.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Create</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 520px; padding-top: 8px; }
    .form-row { display: flex; gap: 12px; mat-form-field { flex: 1; } }
    .full-width { width: 100%; }
  `,
})
export class CreateRequirementDialogComponent {
  protected readonly data = inject<CreateRequirementDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateRequirementDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly priorities = REQUIREMENT_PRIORITIES;
  protected readonly priorityLabels = REQUIREMENT_PRIORITY_LABELS;
  protected readonly typeLabels = REQUIREMENT_TYPE_LABELS;

  protected readonly form = this.fb.group({
    type: ['classic' as RequirementType, Validators.required],
    parent_id: [null as number | null],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    role: [''],
    action: [''],
    benefit: [''],
    priority: ['should' as RequirementPriority, Validators.required],
    source: [''],
    owner_id: [null as number | null],
  });

  protected readonly isChild = computed(() => this.form.get('type')?.value !== 'epic');
  protected readonly isUserStory = computed(() => this.form.get('type')?.value === 'user_story');

  constructor() {
    this.form.get('type')!.valueChanges.subscribe(type => {
      if (type === 'epic') {
        this.form.patchValue({ parent_id: null, role: '', action: '', benefit: '' });
      }
      if (type !== 'user_story') {
        this.form.patchValue({ role: '', action: '', benefit: '' });
      }
    });
  }

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const type = v.type as RequirementType;
    const payload: CreateRequirementPayload = {
      type,
      title: v.title!,
      priority: v.priority as RequirementPriority,
      description: v.description || null,
      source: v.source || null,
      owner_id: v.owner_id ?? null,
      parent_id: type === 'epic' ? null : (v.parent_id ?? null),
      role: type === 'user_story' ? v.role || null : null,
      action: type === 'user_story' ? v.action || null : null,
      benefit: type === 'user_story' ? v.benefit || null : null,
    };
    this.dialogRef.close(payload);
  }
}
