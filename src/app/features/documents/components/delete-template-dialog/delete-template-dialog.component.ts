import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DocumentTemplateNode } from '../../contracts/document-template.contracts';

export interface DeleteTemplateDialogData {
  node: DocumentTemplateNode;
}

@Component({
  selector: 'app-delete-template-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Delete template?</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to delete <strong>{{ data.node.name }}</strong>?
      </p>
      @if (data.node.children.length > 0) {
        <div class="cascade-warning">
          <mat-icon class="cascade-warning__icon">warning</mat-icon>
          <span>
            This node has {{ data.node.children.length }} child
            {{ data.node.children.length === 1 ? 'template' : 'templates' }}
            that will also be deleted.
          </span>
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" (click)="confirm()">Delete</button>
    </mat-dialog-actions>
  `,
  styles: `
    .cascade-warning {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--mat-sys-error-container, #fde8e8);
      color: var(--mat-sys-on-error-container, #3b0808);
      margin-top: 8px;
    }
    .cascade-warning__icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; }
  `,
})
export class DeleteTemplateDialogComponent {
  protected readonly data = inject<DeleteTemplateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateDialogComponent>);

  protected confirm(): void {
    this.dialogRef.close(true);
  }
}
