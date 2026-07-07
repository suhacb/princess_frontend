import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestSessionStatusChipComponent } from './test-session-status-chip.component';
import { TestSessionStatus } from '../../contracts/test-session.contracts';

async function setup(status: TestSessionStatus) {
  await TestBed.configureTestingModule({ imports: [TestSessionStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestSessionStatusChipComponent> = TestBed.createComponent(TestSessionStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('TestSessionStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Planned label', async () => {
    const f = await setup('planned');
    expect(f.nativeElement.textContent).toContain('Planned');
  });

  it('renders In progress label', async () => {
    const f = await setup('in_progress');
    expect(f.nativeElement.textContent).toContain('In progress');
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
