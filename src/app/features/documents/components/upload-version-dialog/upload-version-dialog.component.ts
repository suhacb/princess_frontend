import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface UploadVersionResult {
  file: File;
  comment: string | null;
}

@Component({
  selector: 'app-upload-version-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Upload New Version</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <div class="file-picker">
          <input type="file" #fileInput (change)="onFileChange($event)" hidden />
          <button mat-stroked-button type="button" (click)="fileInput.click()">
            <mat-icon>upload_file</mat-icon>
            {{ selectedFile() ? 'Change file' : 'Choose file' }}
          </button>
          @if (selectedFile()) {
            <span class="file-name">{{ selectedFile()!.name }}</span>
          } @else {
            <span class="file-hint">No file selected</span>
          }
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Version comment (optional)</mat-label>
          <textarea matInput formControlName="comment" rows="2" placeholder="What changed in this version?"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!selectedFile()" (click)="confirm()">Upload</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 12px; min-width: 420px; padding-top: 8px; }
    .file-picker { display: flex; align-items: center; gap: 12px; }
    .file-name { font-size: 0.875rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 260px; }
    .file-hint { font-size: 0.875rem; color: var(--mat-sys-on-surface-variant); }
    .full-width { width: 100%; }
  `,
})
export class UploadVersionDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<UploadVersionDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly selectedFile = signal<File | null>(null);

  protected readonly form = this.fb.group({
    comment: [''],
  });

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
  }

  protected confirm(): void {
    const file = this.selectedFile();
    if (!file) return;
    const result: UploadVersionResult = {
      file,
      comment: this.form.value.comment || null,
    };
    this.dialogRef.close(result);
  }
}
