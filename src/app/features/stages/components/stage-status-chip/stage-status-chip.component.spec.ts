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

  const cases: { status: StageStatus; expectedLabel: string; expectedClass: string }[] = [
    { status: 'planned', expectedLabel: 'Planned', expectedClass: 'status-chip--planned' },
    { status: 'active', expectedLabel: 'Active', expectedClass: 'status-chip--active' },
    { status: 'completed', expectedLabel: 'Completed', expectedClass: 'status-chip--completed' },
    { status: 'exception', expectedLabel: 'Exception', expectedClass: 'status-chip--exception' },
  ];

  for (const { status, expectedLabel, expectedClass } of cases) {
    it(`renders "${expectedLabel}" with class "${expectedClass}"`, () => {
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.status-chip') as HTMLElement;
      expect(el.textContent?.trim()).toBe(expectedLabel);
      expect(el.classList).toContain(expectedClass);
    });
  }
});
