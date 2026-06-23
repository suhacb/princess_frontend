import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateBoundaryDialogComponent } from './create-boundary-dialog.component';

function setup() {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [CreateBoundaryDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: { close: closeFn } }],
  });
  const fixture = TestBed.createComponent(CreateBoundaryDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn, component: fixture.componentInstance as never };
}

describe('CreateBoundaryDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('Create button is disabled when no type selected', () => {
    const { fixture } = setup();
    const createBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Create'));
    expect(createBtn?.disabled).toBe(true);
  });

  it('includes end_stage_report as a selectable type', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.types).toContain('end_stage_report');
    expect(comp.typeLabels['end_stage_report']).toBe('End Stage Report');
  });

  it('includes exception_report as a selectable type', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.types).toContain('exception_report');
    expect(comp.typeLabels['exception_report']).toBe('Exception Report');
  });

  it('closes with payload when type is selected and Create clicked', () => {
    const { fixture, closeFn } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ type: 'end_stage_report', title: 'My Title' });
    fixture.detectChanges();
    const createBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Create'));
    createBtn?.click();
    expect(closeFn).toHaveBeenCalledWith({ type: 'end_stage_report', title: 'My Title' });
  });

  it('closes with null title when title is empty', () => {
    const { fixture, closeFn } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ type: 'exception_report', title: '' });
    fixture.detectChanges();
    const createBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Create'));
    createBtn?.click();
    expect(closeFn).toHaveBeenCalledWith({ type: 'exception_report', title: null });
  });
});
