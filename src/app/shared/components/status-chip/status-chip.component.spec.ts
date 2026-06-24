import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusChipComponent } from './status-chip.component';

async function setup(inputs: { status?: string; tone?: string; label?: string }) {
  await TestBed.configureTestingModule({ imports: [StatusChipComponent] }).compileComponents();
  const fixture: ComponentFixture<StatusChipComponent> = TestBed.createComponent(StatusChipComponent);
  if (inputs.status !== undefined) fixture.componentRef.setInput('status', inputs.status);
  if (inputs.tone !== undefined) fixture.componentRef.setInput('tone', inputs.tone);
  if (inputs.label !== undefined) fixture.componentRef.setInput('label', inputs.label);
  fixture.detectChanges();
  return fixture;
}

describe('StatusChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders PRINCE2 preset label and color for open', async () => {
    const f = await setup({ status: 'open' });
    const el = f.nativeElement.querySelector('.status-chip') as HTMLElement;
    expect(el.textContent?.trim()).toBe('Open');
    expect(el.style.color).toBeTruthy();
  });

  it('renders PRINCE2 preset for delivery', async () => {
    const f = await setup({ status: 'delivery' });
    expect(f.nativeElement.textContent).toContain('Delivery');
  });

  it('renders PRINCE2 preset for materialised', async () => {
    const f = await setup({ status: 'materialised' });
    expect(f.nativeElement.textContent).toContain('Materialised');
  });

  it('renders PRINCE2 preset for mitigated', async () => {
    const f = await setup({ status: 'mitigated' });
    expect(f.nativeElement.textContent).toContain('Mitigated');
  });

  it('renders custom label with tone', async () => {
    const f = await setup({ tone: 'warning', label: 'On Hold' });
    expect(f.nativeElement.textContent).toContain('On Hold');
  });

  it('label input overrides preset label', async () => {
    const f = await setup({ status: 'open', label: 'Custom' });
    expect(f.nativeElement.textContent).toContain('Custom');
  });
});
