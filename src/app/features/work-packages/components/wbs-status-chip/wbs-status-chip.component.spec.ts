import { TestBed } from '@angular/core/testing';
import { WbsStatusChipComponent } from './wbs-status-chip.component';

function setup(status: string) {
  TestBed.configureTestingModule({ imports: [WbsStatusChipComponent] });
  const fixture = TestBed.createComponent(WbsStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('WbsStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows Draft label', () => expect(setup('draft').nativeElement.textContent).toContain('Draft'));
  it('shows In Development label', () => expect(setup('in_development').nativeElement.textContent).toContain('In Development'));
  it('shows Baselined label', () => expect(setup('baselined').nativeElement.textContent).toContain('Baselined'));
  it('shows Superseded label', () => expect(setup('superseded').nativeElement.textContent).toContain('Superseded'));

  it('applies draft class', () => expect(setup('draft').nativeElement.querySelector('.wbs-chip--draft')).toBeTruthy());
  it('applies in_development class', () => expect(setup('in_development').nativeElement.querySelector('.wbs-chip--in_development')).toBeTruthy());
  it('applies baselined class', () => expect(setup('baselined').nativeElement.querySelector('.wbs-chip--baselined')).toBeTruthy());
  it('applies superseded class', () => expect(setup('superseded').nativeElement.querySelector('.wbs-chip--superseded')).toBeTruthy());
});
