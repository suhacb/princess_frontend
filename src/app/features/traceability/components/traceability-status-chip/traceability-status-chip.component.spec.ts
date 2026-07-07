import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraceabilityStatusChipComponent } from './traceability-status-chip.component';
import { TraceabilityDerivedStatus } from '../../contracts/traceability.contracts';

async function setup(status: TraceabilityDerivedStatus) {
  await TestBed.configureTestingModule({ imports: [TraceabilityStatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TraceabilityStatusChipComponent> = TestBed.createComponent(TraceabilityStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('TraceabilityStatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Not tested label', async () => {
    const f = await setup('not_tested');
    expect(f.nativeElement.textContent).toContain('Not tested');
  });

  it('renders Partially covered label', async () => {
    const f = await setup('partial');
    expect(f.nativeElement.textContent).toContain('Partially covered');
  });

  it('renders Covered label', async () => {
    const f = await setup('covered');
    expect(f.nativeElement.textContent).toContain('Covered');
  });

  it('renders Failing label', async () => {
    const f = await setup('failing');
    expect(f.nativeElement.textContent).toContain('Failing');
  });
});
