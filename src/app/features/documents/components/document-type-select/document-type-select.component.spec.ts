import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentTypeSelectComponent } from './document-type-select.component';

describe('DocumentTypeSelectComponent', () => {
  let fixture: ComponentFixture<DocumentTypeSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DocumentTypeSelectComponent, BrowserAnimationsModule],
    });
    fixture = TestBed.createComponent(DocumentTypeSelectComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('renders a mat-select', () => {
    expect(fixture.nativeElement.querySelector('mat-select')).toBeTruthy();
  });

  it('uses default label', () => {
    expect(fixture.nativeElement.textContent).toContain('Document type');
  });

  it('uses custom label when provided', () => {
    fixture.componentRef.setInput('label', 'Type');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Type');
  });

  it('writeValue sets the value without error', () => {
    const comp = fixture.componentInstance as any;
    comp.writeValue('project_brief');
    expect(comp.value).toBe('project_brief');
  });

  it('registerOnChange stores the callback', () => {
    const comp = fixture.componentInstance as any;
    const fn = vi.fn();
    comp.registerOnChange(fn);
    comp.onChange('project_plan');
    expect(fn).toHaveBeenCalledWith('project_plan');
  });
});
