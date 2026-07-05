import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DocumentVersionListComponent } from '../document-version-list/document-version-list.component';

@Component({
  selector: 'app-document-version-history-dialog',
  imports: [MatDialogModule, MatButtonModule, DocumentVersionListComponent],
  template: `
    <h2 mat-dialog-title>Version History</h2>
    <mat-dialog-content>
      <app-document-version-list [projectId]="data.projectId" [docId]="data.docId" />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { padding-top: 4px !important; }
  `],
})
export class DocumentVersionHistoryDialogComponent {
  readonly data = inject<{ projectId: number; docId: number }>(MAT_DIALOG_DATA);
}
