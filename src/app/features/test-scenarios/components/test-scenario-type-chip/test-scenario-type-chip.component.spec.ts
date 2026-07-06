import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestScenarioTypeChipComponent } from './test-scenario-type-chip.component';
import { TestScenarioType } from '../../contracts/test-scenario.contracts';

async function setup(type: TestScenarioType) {
  await TestBed.configureTestingModule({ imports: [TestScenarioTypeChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestScenarioTypeChipComponent> = TestBed.createComponent(TestScenarioTypeChipComponent);
  fixture.componentRef.setInput('type', type);
  fixture.detectChanges();
  return fixture;
}

describe('TestScenarioTypeChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Feature label', async () => {
    const f = await setup('feature');
    expect(f.nativeElement.textContent).toContain('Feature');
  });

  it('renders End-to-end label', async () => {
    const f = await setup('e2e');
    expect(f.nativeElement.textContent).toContain('End-to-end');
  });
});
