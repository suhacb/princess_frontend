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

  it('applies draft class', () => {
    expect(setup('draft').nativeElement.querySelector('.status-chip--draft')).toBeTruthy();
  });

  it('applies submitted class', () => {
    expect(setup('submitted').nativeElement.querySelector('.status-chip--submitted')).toBeTruthy();
  });

  it('applies approved class', () => {
    expect(setup('approved').nativeElement.querySelector('.status-chip--approved')).toBeTruthy();
  });

  it('applies rejected class', () => {
    expect(setup('rejected').nativeElement.querySelector('.status-chip--rejected')).toBeTruthy();
  });
});
