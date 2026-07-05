import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementStatusChipComponent } from './requirement-status-chip.component';
import { RequirementStatus } from '../../contracts/requirement.contracts';

async function setup(status: RequirementStatus) {
  await TestBed.configureTestingModule({ imports: [RequirementStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<RequirementStatusChipComponent> = TestBed.createComponent(RequirementStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('RequirementStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Draft label', async () => {
    const f = await setup('draft');
    expect(f.nativeElement.textContent).toContain('Draft');
  });

  it('renders Reviewed label', async () => {
    const f = await setup('reviewed');
    expect(f.nativeElement.textContent).toContain('Reviewed');
  });

  it('renders Approved label', async () => {
    const f = await setup('approved');
    expect(f.nativeElement.textContent).toContain('Approved');
  });

  it('renders Rejected label', async () => {
    const f = await setup('rejected');
    expect(f.nativeElement.textContent).toContain('Rejected');
  });

  it('renders Deferred label', async () => {
    const f = await setup('deferred');
    expect(f.nativeElement.textContent).toContain('Deferred');
  });
});
