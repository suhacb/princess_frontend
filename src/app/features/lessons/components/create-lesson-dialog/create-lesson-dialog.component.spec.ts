import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateLessonDialogComponent } from './create-lesson-dialog.component';

function setup() {
  const dialogRefMock = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateLessonDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: dialogRefMock }],
  });
  const fixture: ComponentFixture<CreateLessonDialogComponent> =
    TestBed.createComponent(CreateLessonDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRefMock };
}

describe('CreateLessonDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('Record button is disabled when form is empty', () => {
    const { fixture } = setup();
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Record');
    expect(btn?.disabled).toBe(true);
  });

  it('Record button is enabled when required fields are filled', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ source: 'retrospective', description: 'Estimations were off' });
    fixture.detectChanges();
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Record');
    expect(btn?.disabled).toBe(false);
  });

  it('closes with correct payload on confirm', () => {
    const { fixture, dialogRefMock } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      source: 'retrospective',
      description: 'Estimations were off',
      category: 'Planning',
      recommendation: 'Use three-point estimation',
    });
    comp.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      source: 'retrospective',
      description: 'Estimations were off',
      category: 'Planning',
      recommendation: 'Use three-point estimation',
    });
  });

  it('converts empty optional fields to null', () => {
    const { fixture, dialogRefMock } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ source: 'incident', description: 'Server went down', category: '', recommendation: '' });
    comp.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(
      expect.objectContaining({ category: null, recommendation: null }),
    );
  });

  it('renders all three source options', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.sources).toContain('retrospective');
    expect(comp.sources).toContain('incident');
    expect(comp.sources).toContain('observation');
  });
});
