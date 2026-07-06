import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCaseTypeChipComponent } from './test-case-type-chip.component';
import { TestCaseType } from '../../contracts/test-case.contracts';

async function setup(type: TestCaseType) {
  await TestBed.configureTestingModule({ imports: [TestCaseTypeChipComponent] }).compileComponents();
  const fixture: ComponentFixture<TestCaseTypeChipComponent> = TestBed.createComponent(TestCaseTypeChipComponent);
  fixture.componentRef.setInput('type', type);
  fixture.detectChanges();
  return fixture;
}

describe('TestCaseTypeChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders Positive label', async () => {
    const f = await setup('positive');
    expect(f.nativeElement.textContent).toContain('Positive');
  });

  it('renders Negative label', async () => {
    const f = await setup('negative');
    expect(f.nativeElement.textContent).toContain('Negative');
  });

  it('renders Edge label', async () => {
    const f = await setup('edge');
    expect(f.nativeElement.textContent).toContain('Edge');
  });
});
