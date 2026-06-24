import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StageStatusChipComponent } from './stage-status-chip.component';
import { StageStatus } from '../../contracts/stage.contracts';

describe('StageStatusChipComponent', () => {
  let fixture: ComponentFixture<StageStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageStatusChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StageStatusChipComponent);
  });

  const cases: { status: StageStatus; expectedLabel: string }[] = [
    { status: 'planned',   expectedLabel: 'Planned' },
    { status: 'active',    expectedLabel: 'Active' },
    { status: 'completed', expectedLabel: 'Completed' },
    { status: 'exception', expectedLabel: 'Exception' },
  ];

  for (const { status, expectedLabel } of cases) {
    it(`renders "${expectedLabel}" for status "${status}"`, () => {
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(expectedLabel);
    });
  }
});
