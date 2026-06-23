import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskStatusChipComponent } from './risk-status-chip.component';
import { RiskStatus } from '../../contracts/risk.contracts';

async function setup(status: RiskStatus) {
  await TestBed.configureTestingModule({ imports: [RiskStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<RiskStatusChipComponent> = TestBed.createComponent(RiskStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('RiskStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Open label', async () => {
    const f = await setup('open');
    expect(f.nativeElement.textContent).toContain('Open');
    expect(f.nativeElement.querySelector('.status-chip--open')).toBeTruthy();
  });

  it('renders Mitigated label', async () => {
    const f = await setup('mitigated');
    expect(f.nativeElement.textContent).toContain('Mitigated');
    expect(f.nativeElement.querySelector('.status-chip--mitigated')).toBeTruthy();
  });

  it('renders Closed label', async () => {
    const f = await setup('closed');
    expect(f.nativeElement.textContent).toContain('Closed');
    expect(f.nativeElement.querySelector('.status-chip--closed')).toBeTruthy();
  });

  it('renders Materialised label', async () => {
    const f = await setup('materialised');
    expect(f.nativeElement.textContent).toContain('Materialised');
    expect(f.nativeElement.querySelector('.status-chip--materialised')).toBeTruthy();
  });
});
