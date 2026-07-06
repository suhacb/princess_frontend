import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcStatusChipComponent } from './ac-status-chip.component';
import { AcceptanceCriterionStatus } from '../../contracts/acceptance-criterion.contracts';

async function setup(status: AcceptanceCriterionStatus) {
  await TestBed.configureTestingModule({ imports: [AcStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<AcStatusChipComponent> = TestBed.createComponent(AcStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('AcStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Draft label', async () => {
    const f = await setup('draft');
    expect(f.nativeElement.textContent).toContain('Draft');
  });

  it('renders Approved label', async () => {
    const f = await setup('approved');
    expect(f.nativeElement.textContent).toContain('Approved');
  });
});
