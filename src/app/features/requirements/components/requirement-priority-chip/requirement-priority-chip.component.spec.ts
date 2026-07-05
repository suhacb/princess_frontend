import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementPriorityChipComponent } from './requirement-priority-chip.component';
import { RequirementPriority } from '../../contracts/requirement.contracts';

async function setup(priority: RequirementPriority) {
  await TestBed.configureTestingModule({ imports: [RequirementPriorityChipComponent] }).compileComponents();
  const fixture: ComponentFixture<RequirementPriorityChipComponent> = TestBed.createComponent(RequirementPriorityChipComponent);
  fixture.componentRef.setInput('priority', priority);
  fixture.detectChanges();
  return fixture;
}

describe('RequirementPriorityChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Must label', async () => {
    const f = await setup('must');
    expect(f.nativeElement.textContent).toContain('Must');
  });

  it('renders Should label', async () => {
    const f = await setup('should');
    expect(f.nativeElement.textContent).toContain('Should');
  });

  it('renders Could label', async () => {
    const f = await setup('could');
    expect(f.nativeElement.textContent).toContain('Could');
  });

  it("renders Won't label", async () => {
    const f = await setup('wont');
    expect(f.nativeElement.textContent).toContain("Won't");
  });
});
