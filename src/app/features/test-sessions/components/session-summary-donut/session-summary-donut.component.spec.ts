import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionSummaryDonutComponent } from './session-summary-donut.component';
import { TestSessionReportSummary } from '../../contracts/test-session.contracts';

async function setup(summary: TestSessionReportSummary) {
  await TestBed.configureTestingModule({ imports: [SessionSummaryDonutComponent] }).compileComponents();
  const fixture: ComponentFixture<SessionSummaryDonutComponent> = TestBed.createComponent(SessionSummaryDonutComponent);
  fixture.componentRef.setInput('summary', summary);
  fixture.detectChanges();
  return fixture;
}

describe('SessionSummaryDonutComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the total result count', async () => {
    const f = await setup({ pass: 3, fail: 1, blocked: 0, not_run: 1, skipped: 0 });
    expect(f.nativeElement.querySelector('.donut-total').textContent).toBe('5');
  });

  it('renders a legend entry per result category', async () => {
    const f = await setup({ pass: 3, fail: 1, blocked: 0, not_run: 1, skipped: 0 });
    const items = f.nativeElement.querySelectorAll('.donut-legend li');
    expect(items.length).toBe(5);
    expect(items[0].textContent).toContain('Pass: 3');
  });

  it('handles a summary with zero results without dividing by zero', async () => {
    const f = await setup({ pass: 0, fail: 0, blocked: 0, not_run: 0, skipped: 0 });
    expect(f.nativeElement.querySelector('.donut-total').textContent).toBe('0');
  });

  it('renders only segments with a nonzero value', async () => {
    const f = await setup({ pass: 2, fail: 0, blocked: 0, not_run: 0, skipped: 0 });
    const segments = f.nativeElement.querySelectorAll('.donut-segment');
    expect(segments.length).toBe(1);
  });
});
