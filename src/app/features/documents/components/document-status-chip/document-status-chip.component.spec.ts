import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentStatusChipComponent } from './document-status-chip.component';

function setup(status: 'draft' | 'in_review' | 'confirmed' | 'superseded') {
  TestBed.configureTestingModule({ imports: [DocumentStatusChipComponent] });
  const fixture: ComponentFixture<DocumentStatusChipComponent> = TestBed.createComponent(DocumentStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('DocumentStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Draft label', () => {
    const f = setup('draft');
    expect(f.nativeElement.textContent).toContain('Draft');
  });

  it('renders In Review label', () => {
    const f = setup('in_review');
    expect(f.nativeElement.textContent).toContain('In Review');
  });

  it('renders Confirmed label', () => {
    const f = setup('confirmed');
    expect(f.nativeElement.textContent).toContain('Confirmed');
  });

  it('renders Superseded label', () => {
    const f = setup('superseded');
    expect(f.nativeElement.textContent).toContain('Superseded');
  });
});
