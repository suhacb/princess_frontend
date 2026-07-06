import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestScenarioStatusChipComponent } from './test-scenario-status-chip.component';
import { TestScenarioStatus } from '../../contracts/test-scenario.contracts';

async function setup(status: TestScenarioStatus) {
  await TestBed.configureTestingModule({ imports: [TestScenarioStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestScenarioStatusChipComponent> = TestBed.createComponent(TestScenarioStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('TestScenarioStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Draft label', async () => {
    const f = await setup('draft');
    expect(f.nativeElement.textContent).toContain('Draft');
  });

  it('renders Ready label', async () => {
    const f = await setup('ready');
    expect(f.nativeElement.textContent).toContain('Ready');
  });

  it('renders Obsolete label', async () => {
    const f = await setup('obsolete');
    expect(f.nativeElement.textContent).toContain('Obsolete');
  });
});
