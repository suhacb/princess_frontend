import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeStatusChipComponent } from './change-status-chip.component';
import { ChangeStatus } from '../../contracts/change.contracts';

async function setup(status: ChangeStatus) {
  await TestBed.configureTestingModule({ imports: [ChangeStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<ChangeStatusChipComponent> =
    TestBed.createComponent(ChangeStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('ChangeStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Proposed label', async () => {
    expect((await setup('proposed')).nativeElement.textContent).toContain('Proposed');
  });

  it('renders Assessed label', async () => {
    expect((await setup('assessed')).nativeElement.textContent).toContain('Assessed');
  });

  it('renders Approved label', async () => {
    expect((await setup('approved')).nativeElement.textContent).toContain('Approved');
  });

  it('renders Rejected label', async () => {
    expect((await setup('rejected')).nativeElement.textContent).toContain('Rejected');
  });

  it('renders Implemented label', async () => {
    expect((await setup('implemented')).nativeElement.textContent).toContain('Implemented');
  });
});
