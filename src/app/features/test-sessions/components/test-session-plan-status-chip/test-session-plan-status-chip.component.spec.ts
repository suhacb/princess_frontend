import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestSessionPlanStatusChipComponent } from './test-session-plan-status-chip.component';
import { TestSessionPlanStatus } from '../../contracts/test-session-plan.contracts';

async function setup(status: TestSessionPlanStatus) {
  await TestBed.configureTestingModule({ imports: [TestSessionPlanStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestSessionPlanStatusChipComponent> = TestBed.createComponent(TestSessionPlanStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('TestSessionPlanStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Draft label', async () => {
    const f = await setup('draft');
    expect(f.nativeElement.textContent).toContain('Draft');
  });

  it('renders Active label', async () => {
    const f = await setup('active');
    expect(f.nativeElement.textContent).toContain('Active');
  });

  it('renders Completed label', async () => {
    const f = await setup('completed');
    expect(f.nativeElement.textContent).toContain('Completed');
  });

  it('renders Cancelled label', async () => {
    const f = await setup('cancelled');
    expect(f.nativeElement.textContent).toContain('Cancelled');
  });
});
