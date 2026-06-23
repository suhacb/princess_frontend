import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskScoreBadgeComponent } from './risk-score-badge.component';

async function setup(score: number) {
  await TestBed.configureTestingModule({ imports: [RiskScoreBadgeComponent] }).compileComponents();
  const fixture: ComponentFixture<RiskScoreBadgeComponent> = TestBed.createComponent(RiskScoreBadgeComponent);
  fixture.componentRef.setInput('score', score);
  fixture.detectChanges();
  return fixture;
}

describe('RiskScoreBadgeComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the score number', async () => {
    const f = await setup(12);
    expect(f.nativeElement.textContent.trim()).toBe('12');
  });

  it('applies low class for score 1-4', async () => {
    const f = await setup(4);
    expect(f.nativeElement.querySelector('.score-badge--low')).toBeTruthy();
  });

  it('applies medium class for score 5-9', async () => {
    const f = await setup(6);
    expect(f.nativeElement.querySelector('.score-badge--medium')).toBeTruthy();
  });

  it('applies high class for score 10-15', async () => {
    const f = await setup(12);
    expect(f.nativeElement.querySelector('.score-badge--high')).toBeTruthy();
  });

  it('applies critical class for score 16-25', async () => {
    const f = await setup(20);
    expect(f.nativeElement.querySelector('.score-badge--critical')).toBeTruthy();
  });
});
