import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateChangeDialogComponent } from './create-change-dialog.component';

function setup() {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateChangeDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: dialogRef }],
  });
  const fixture: ComponentFixture<CreateChangeDialogComponent> =
    TestBed.createComponent(CreateChangeDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateChangeDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Raise button is disabled when form is invalid', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('exposes rfc and off_spec types', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.types).toContain('rfc');
    expect(comp.types).toContain('off_spec');
  });

  it('closes with payload when form is valid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ request_type: 'rfc', title: 'Add new field' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({ request_type: 'rfc', title: 'Add new field' }),
    );
  });

  it('sets empty optional fields to null in payload', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      request_type: 'rfc',
      title: 'Add new field',
      description: '',
      impact_assessment: '',
      priority: '',
      implementation_due: '',
    });
    comp.confirm();
    const payload = dialogRef.close.mock.calls[0][0];
    expect(payload.description).toBeNull();
    expect(payload.impact_assessment).toBeNull();
    expect(payload.priority).toBeNull();
    expect(payload.implementation_due).toBeNull();
  });

  it('does not close when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
