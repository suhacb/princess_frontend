import { TestBed } from '@angular/core/testing';
import { BoundaryStatusChipComponent } from './boundary-status-chip.component';

function setup(status: string) {
  TestBed.configureTestingModule({ imports: [BoundaryStatusChipComponent] });
  const fixture = TestBed.createComponent(BoundaryStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('BoundaryStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows Draft label', () => {
    expect(setup('draft').nativeElement.textContent).toContain('Draft');
  });

  it('shows Submitted label', () => {
    expect(setup('submitted').nativeElement.textContent).toContain('Submitted');
  });

  it('shows Approved label', () => {
    expect(setup('approved').nativeElement.textContent).toContain('Approved');
  });

  it('shows Rejected label', () => {
    expect(setup('rejected').nativeElement.textContent).toContain('Rejected');
  });
});
