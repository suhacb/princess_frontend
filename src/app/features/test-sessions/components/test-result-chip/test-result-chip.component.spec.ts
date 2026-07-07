import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestResultChipComponent } from './test-result-chip.component';
import { TestResultStatus } from '../../contracts/test-session-result.contracts';

async function setup(result: TestResultStatus) {
  await TestBed.configureTestingModule({ imports: [TestResultChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestResultChipComponent> = TestBed.createComponent(TestResultChipComponent);
  fixture.componentRef.setInput('result', result);
  fixture.detectChanges();
  return fixture;
}

describe('TestResultChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Pass label', async () => {
    const f = await setup('pass');
    expect(f.nativeElement.textContent).toContain('Pass');
  });

  it('renders Fail label', async () => {
    const f = await setup('fail');
    expect(f.nativeElement.textContent).toContain('Fail');
  });

  it('renders Blocked label', async () => {
    const f = await setup('blocked');
    expect(f.nativeElement.textContent).toContain('Blocked');
  });

  it('renders Not run label', async () => {
    const f = await setup('not_run');
    expect(f.nativeElement.textContent).toContain('Not run');
  });

  it('renders Skipped label', async () => {
    const f = await setup('skipped');
    expect(f.nativeElement.textContent).toContain('Skipped');
  });
});
