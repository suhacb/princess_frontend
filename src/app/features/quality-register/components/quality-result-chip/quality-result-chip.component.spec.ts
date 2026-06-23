import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualityResultChipComponent } from './quality-result-chip.component';

describe('QualityResultChipComponent', () => {
  async function setup(result: 'passed' | 'failed' | 'conditional') {
    await TestBed.configureTestingModule({ imports: [QualityResultChipComponent] }).compileComponents();
    const fixture: ComponentFixture<QualityResultChipComponent> = TestBed.createComponent(QualityResultChipComponent);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('renders Passed label for passed result', async () => {
    const fixture = await setup('passed');
    expect(fixture.nativeElement.textContent).toContain('Passed');
  });

  it('renders Failed label for failed result', async () => {
    const fixture = await setup('failed');
    expect(fixture.nativeElement.textContent).toContain('Failed');
  });

  it('renders Conditional label for conditional result', async () => {
    const fixture = await setup('conditional');
    expect(fixture.nativeElement.textContent).toContain('Conditional');
  });

  it('applies the correct CSS class for passed', async () => {
    const fixture = await setup('passed');
    expect(fixture.nativeElement.querySelector('.result-chip--passed')).toBeTruthy();
  });

  it('applies the correct CSS class for failed', async () => {
    const fixture = await setup('failed');
    expect(fixture.nativeElement.querySelector('.result-chip--failed')).toBeTruthy();
  });

  it('applies the correct CSS class for conditional', async () => {
    const fixture = await setup('conditional');
    expect(fixture.nativeElement.querySelector('.result-chip--conditional')).toBeTruthy();
  });
});
