import { TestBed } from '@angular/core/testing';
import { IssuePriorityChipComponent } from './issue-priority-chip.component';

function setup(priority: string) {
  TestBed.configureTestingModule({ imports: [IssuePriorityChipComponent] });
  const fixture = TestBed.createComponent(IssuePriorityChipComponent);
  fixture.componentRef.setInput('priority', priority);
  fixture.detectChanges();
  return fixture;
}

describe('IssuePriorityChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows Low label', () => expect(setup('low').nativeElement.textContent).toContain('Low'));
  it('shows Medium label', () => expect(setup('medium').nativeElement.textContent).toContain('Medium'));
  it('shows High label', () => expect(setup('high').nativeElement.textContent).toContain('High'));
  it('shows Critical label', () => expect(setup('critical').nativeElement.textContent).toContain('Critical'));
  it('renders critical as solid badge', () => {
    const el = setup('critical').nativeElement.querySelector('.badge') as HTMLElement;
    expect(el.style.background).toBeTruthy();
  });
});
