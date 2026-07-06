import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcVerificationMethodChipComponent } from './ac-verification-method-chip.component';
import { VerificationMethod } from '../../contracts/acceptance-criterion.contracts';

async function setup(method: VerificationMethod) {
  await TestBed.configureTestingModule({ imports: [AcVerificationMethodChipComponent] }).compileComponents();
  const fixture: ComponentFixture<AcVerificationMethodChipComponent> = TestBed.createComponent(AcVerificationMethodChipComponent);
  fixture.componentRef.setInput('method', method);
  fixture.detectChanges();
  return fixture;
}

describe('AcVerificationMethodChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Test label', async () => {
    const f = await setup('test');
    expect(f.nativeElement.textContent).toContain('Test');
  });

  it('renders Demo label', async () => {
    const f = await setup('demo');
    expect(f.nativeElement.textContent).toContain('Demo');
  });

  it('renders Review label', async () => {
    const f = await setup('review');
    expect(f.nativeElement.textContent).toContain('Review');
  });

  it('renders Inspection label', async () => {
    const f = await setup('inspection');
    expect(f.nativeElement.textContent).toContain('Inspection');
  });
});
