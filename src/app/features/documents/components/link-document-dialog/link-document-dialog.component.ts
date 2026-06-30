import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DocumentService } from '../../services/document.service';
import { DocumentStatusChipComponent } from '../document-status-chip/document-status-chip.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  Document,
  DocumentType,
  DOCUMENT_TYPE_LABELS,
} from '../../contracts/document.contracts';

export interface LinkDocumentDialogData {
  projectId: number;
  allowedTypes: DocumentType[];
}

@Component({
  selector: 'app-link-document-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DocumentStatusChipComponent,
    SkeletonComponent,
  ],
  templateUrl: './link-document-dialog.component.html',
  styleUrl: './link-document-dialog.component.scss',
})
export class LinkDocumentDialogComponent implements OnInit {
  protected readonly data = inject<LinkDocumentDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<LinkDocumentDialogComponent>);
  private readonly documentService = inject(DocumentService);

  protected readonly searchControl = new FormControl('');
  protected readonly allResults = signal<Document[]>([]);
  protected readonly loading = signal(false);
  protected readonly selected = signal<Document | null>(null);

  protected readonly results = computed(() => {
    const allowed = new Set(this.data.allowedTypes);
    return this.allResults().filter(d => allowed.has(d.type));
  });

  protected readonly typeLabels = DOCUMENT_TYPE_LABELS;

  ngOnInit(): void {
    this._search('');

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(q => this._search(q ?? ''));
  }

  private _search(query: string): void {
    this.loading.set(true);
    this.documentService.searchForLinking(this.data.projectId, query || undefined).subscribe({
      next: docs => {
        this.allResults.set(docs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected select(doc: Document): void {
    this.selected.set(doc);
  }

  protected confirm(): void {
    const doc = this.selected();
    if (!doc) return;
    this.dialogRef.close(doc);
  }
}
