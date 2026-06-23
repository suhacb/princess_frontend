import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StageTransitionDialogComponent, StageTransitionDialogData } from './stage-transition-dialog.component';

function setup(data: StageTransitionDialogData): {
  fixture: ComponentFixture<StageTransitionDialogComponent>;
  dialogRef: { close: ReturnType<typeof vi.fn> };
} {
  const dialogRef = { close: vi.fn() };

  TestBed.configureTestingModule({
    imports: [StageTransitionDialogComponent],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
  });

  const fixture = TestBed.createComponent(StageTransitionDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('StageTransitionDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the stage name', () => {
    const { fixture } = setup({ stageName: 'Alpha Stage', action: 'start' });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.transition-stage')?.textContent).toContain('Alpha Stage');
  });

  it('shows Start label for start action', () => {
    const { fixture } = setup({ stageName: 'S', action: 'start' });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Start');
  });

  it('shows Flag Exception label for exception action', () => {
    const { fixture } = setup({ stageName: 'S', action: 'exception' });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Flag Exception');
  });

  it('closes with true on confirm', () => {
    const { fixture, dialogRef } = setup({ stageName: 'S', action: 'start' });
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLButtonElement>('button');
    const confirmBtn = Array.from(buttons).find(b => b.textContent?.includes('Start'));
    confirmBtn?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('closes with false on cancel', () => {
    const { fixture, dialogRef } = setup({ stageName: 'S', action: 'complete' });
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLButtonElement>('button');
    const cancelBtn = Array.from(buttons).find(b => b.textContent?.includes('Cancel'));
    cancelBtn?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
