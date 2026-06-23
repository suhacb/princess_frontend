import { TestBed } from '@angular/core/testing';
import { IssueStatusChipComponent } from './issue-status-chip.component';

function setup(status: string) {
  TestBed.configureTestingModule({ imports: [IssueStatusChipComponent] });
  const fixture = TestBed.createComponent(IssueStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('IssueStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows Open label', () => expect(setup('open').nativeElement.textContent).toContain('Open'));
  it('shows Under Review label', () => expect(setup('under_review').nativeElement.textContent).toContain('Under Review'));
  it('shows Escalated label', () => expect(setup('escalated').nativeElement.textContent).toContain('Escalated'));
  it('shows Closed label', () => expect(setup('closed').nativeElement.textContent).toContain('Closed'));
  it('applies open class', () => expect(setup('open').nativeElement.querySelector('.status-chip--open')).toBeTruthy());
  it('applies escalated class', () => expect(setup('escalated').nativeElement.querySelector('.status-chip--escalated')).toBeTruthy());
  it('applies closed class', () => expect(setup('closed').nativeElement.querySelector('.status-chip--closed')).toBeTruthy());
});
