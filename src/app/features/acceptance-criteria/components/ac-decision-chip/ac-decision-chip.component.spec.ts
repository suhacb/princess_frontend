import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcDecisionChipComponent } from './ac-decision-chip.component';
import { AcceptanceCriterionDecision } from '../../contracts/acceptance-criterion.contracts';

async function setup(decision: AcceptanceCriterionDecision) {
  await TestBed.configureTestingModule({ imports: [AcDecisionChipComponent] }).compileComponents();
  const fixture: ComponentFixture<AcDecisionChipComponent> = TestBed.createComponent(AcDecisionChipComponent);
  fixture.componentRef.setInput('decision', decision);
  fixture.detectChanges();
  return fixture;
}

describe('AcDecisionChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Pending label', async () => {
    const f = await setup('pending');
    expect(f.nativeElement.textContent).toContain('Pending');
  });

  it('renders Accepted label', async () => {
    const f = await setup('accepted');
    expect(f.nativeElement.textContent).toContain('Accepted');
  });

  it('renders Rejected label', async () => {
    const f = await setup('rejected');
    expect(f.nativeElement.textContent).toContain('Rejected');
  });
});
