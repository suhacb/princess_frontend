import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateQualityEntryDialogComponent } from './create-quality-entry-dialog.component';

function setup() {
  const dialogRefMock = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateQualityEntryDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: dialogRefMock }],
  });
  const fixture: ComponentFixture<CreateQualityEntryDialogComponent> =
    TestBed.createComponent(CreateQualityEntryDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRefMock };
}

describe('CreateQualityEntryDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('Add button is disabled when form is empty', () => {
    const { fixture } = setup();
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Add');
    expect(btn?.disabled).toBe(true);
  });

  it('Add button is enabled when required fields are filled', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ product_name: 'User manual', quality_method: 'review' });
    fixture.detectChanges();
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Add');
    expect(btn?.disabled).toBe(false);
  });

  it('closes with correct payload on confirm', () => {
    const { fixture, dialogRefMock } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      product_name: 'User manual',
      quality_method: 'review',
      planned_date: '2026-07-01',
    });
    comp.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      product_name: 'User manual',
      quality_method: 'review',
      planned_date: '2026-07-01',
    });
  });

  it('converts empty planned_date to null', () => {
    const { fixture, dialogRefMock } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ product_name: 'Spec doc', quality_method: 'test', planned_date: '' });
    comp.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(
      expect.objectContaining({ planned_date: null }),
    );
  });

  it('renders method options from QUALITY_METHODS', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.methods).toContain('review');
    expect(comp.methods).toContain('test');
    expect(comp.methods).toContain('audit');
    expect(comp.methods).toContain('inspection');
  });
});
