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

  it('renders Proposed label with correct class', async () => {
    const f = await setup('proposed');
    expect(f.nativeElement.textContent).toContain('Proposed');
    expect(f.nativeElement.querySelector('.status-chip--proposed')).toBeTruthy();
  });

  it('renders Assessed label with correct class', async () => {
    const f = await setup('assessed');
    expect(f.nativeElement.textContent).toContain('Assessed');
    expect(f.nativeElement.querySelector('.status-chip--assessed')).toBeTruthy();
  });

  it('renders Approved label with correct class', async () => {
    const f = await setup('approved');
    expect(f.nativeElement.textContent).toContain('Approved');
    expect(f.nativeElement.querySelector('.status-chip--approved')).toBeTruthy();
  });

  it('renders Rejected label with correct class', async () => {
    const f = await setup('rejected');
    expect(f.nativeElement.textContent).toContain('Rejected');
    expect(f.nativeElement.querySelector('.status-chip--rejected')).toBeTruthy();
  });

  it('renders Implemented label with correct class', async () => {
    const f = await setup('implemented');
    expect(f.nativeElement.textContent).toContain('Implemented');
    expect(f.nativeElement.querySelector('.status-chip--implemented')).toBeTruthy();
  });
});
