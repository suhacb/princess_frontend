import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCasePriorityChipComponent } from './test-case-priority-chip.component';
import { TestCasePriority } from '../../contracts/test-case.contracts';

async function setup(priority: TestCasePriority) {
  await TestBed.configureTestingModule({ imports: [TestCasePriorityChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestCasePriorityChipComponent> = TestBed.createComponent(TestCasePriorityChipComponent);
  fixture.componentRef.setInput('priority', priority);
  fixture.detectChanges();
  return fixture;
}

describe('TestCasePriorityChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Low label', async () => {
    const f = await setup('low');
    expect(f.nativeElement.textContent).toContain('Low');
  });

  it('renders Medium label', async () => {
    const f = await setup('medium');
    expect(f.nativeElement.textContent).toContain('Medium');
  });

  it('renders High label', async () => {
    const f = await setup('high');
    expect(f.nativeElement.textContent).toContain('High');
  });
});
