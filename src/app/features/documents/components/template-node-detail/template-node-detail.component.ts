import {
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentTemplateService } from '../../services/document-template.service';
import {
  DocumentTemplateNode,
  TemplateSettings,
  UpdateTemplatePayload,
} from '../../contracts/document-template.contracts';
import {
  DeleteTemplateDialogComponent,
  DeleteTemplateDialogData,
} from '../delete-template-dialog/delete-template-dialog.component';
import {
  CreateTemplateDialogComponent,
  CreateTemplateDialogData,
} from '../create-template-dialog/create-template-dialog.component';

@Component({
  selector: 'app-template-node-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './template-node-detail.component.html',
  styleUrl: './template-node-detail.component.scss',
})
export class TemplateNodeDetailComponent implements OnChanges {
  readonly node = input.required<DocumentTemplateNode>();
  readonly projectId = input.required<number>();
  readonly nodeDeleted = output<number>();

  private readonly templateService = inject(DocumentTemplateService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly saving = this.templateService.saving;
  protected readonly uploading = signal(false);
  protected readonly uploadError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    name: [''],
    description: [''],
    fontFamily: [''],
    fontSize: [null as number | null],
    primaryColor: [''],
    logoS3Key: [''],
    headerText: [''],
    footerText: [''],
    marginTop: [null as number | null],
    marginRight: [null as number | null],
    marginBottom: [null as number | null],
    marginLeft: [null as number | null],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node']) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    const n = this.node();
    const s = n.settings;
    this.form.reset({
      name: n.name,
      description: n.description ?? '',
      fontFamily: s.fontFamily ?? '',
      fontSize: s.fontSize ?? null,
      primaryColor: s.primaryColor ?? '',
      logoS3Key: s.logoS3Key ?? '',
      headerText: s.headerText ?? '',
      footerText: s.footerText ?? '',
      marginTop: s.margins?.top ?? null,
      marginRight: s.margins?.right ?? null,
      marginBottom: s.margins?.bottom ?? null,
      marginLeft: s.margins?.left ?? null,
    });
    this.form.markAsPristine();
  }

  protected inheritedValue(field: keyof TemplateSettings): string | number | undefined {
    const parent = this.parentEffective();
    if (!parent) return undefined;
    if (field === 'margins') return undefined;
    return parent[field] as string | number | undefined;
  }

  protected isLocallySet(field: keyof Omit<TemplateSettings, 'margins'>): boolean {
    return this.node().settings[field] !== undefined;
  }

  protected inheritedMargin(side: 'top' | 'right' | 'bottom' | 'left'): number | undefined {
    return this.parentEffective()?.margins?.[side];
  }

  private parentEffective(): TemplateSettings | null {
    const n = this.node();
    if (n.parentId === null) return null;
    const tree = this.templateService.tree();
    return this.findEffective(tree, n.parentId);
  }

  private findEffective(
    nodes: DocumentTemplateNode[],
    id: number,
  ): TemplateSettings | null {
    for (const node of nodes) {
      if (node.id === id) return node.effectiveSettings;
      const found = this.findEffective(node.children, id);
      if (found !== null) return found;
    }
    return null;
  }

  protected save(): void {
    if (this.form.pristine) return;
    const v = this.form.value;
    const settings: TemplateSettings = {};

    if (v.fontFamily) settings.fontFamily = v.fontFamily;
    if (v.fontSize != null) settings.fontSize = v.fontSize;
    if (v.primaryColor) settings.primaryColor = v.primaryColor;
    if (v.logoS3Key) settings.logoS3Key = v.logoS3Key;
    if (v.headerText) settings.headerText = v.headerText;
    if (v.footerText) settings.footerText = v.footerText;

    const hasMargins =
      v.marginTop != null ||
      v.marginRight != null ||
      v.marginBottom != null ||
      v.marginLeft != null;
    if (hasMargins) {
      settings.margins = {
        top: v.marginTop ?? 0,
        right: v.marginRight ?? 0,
        bottom: v.marginBottom ?? 0,
        left: v.marginLeft ?? 0,
      };
    }

    const payload: UpdateTemplatePayload = {
      name: v.name ?? undefined,
      description: v.description || null,
      settings,
    };

    this.templateService.update(this.projectId(), this.node().id, payload).subscribe({
      next: () => this.form.markAsPristine(),
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.uploadError.set(null);
    this.templateService.uploadFile(this.projectId(), this.node().id, file).subscribe({
      next: () => {
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.set('Upload failed. Please try again.');
        input.value = '';
      },
    });
  }

  protected openAddChild(): void {
    const ref = this.dialog.open<
      CreateTemplateDialogComponent,
      CreateTemplateDialogData
    >(CreateTemplateDialogComponent, {
      data: { parent: this.node() },
    });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.templateService.create(this.projectId(), payload).subscribe();
    });
  }

  protected openDelete(): void {
    const ref = this.dialog.open<
      DeleteTemplateDialogComponent,
      DeleteTemplateDialogData,
      boolean
    >(DeleteTemplateDialogComponent, {
      data: { node: this.node() },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      const id = this.node().id;
      this.templateService.remove(this.projectId(), id).subscribe({
        next: () => this.nodeDeleted.emit(id),
      });
    });
  }

  protected discard(): void {
    this.resetForm();
  }
}
