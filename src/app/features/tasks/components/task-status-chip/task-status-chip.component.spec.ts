import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskStatusChipComponent } from './task-status-chip.component';

function setup(status: string) {
  TestBed.configureTestingModule({ imports: [TaskStatusChipComponent, BrowserAnimationsModule] });
  const fixture = TestBed.createComponent(TaskStatusChipComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('TaskStatusChipComponent', () => {
  it('renders "To Do" for todo', () => {
    const f = setup('todo');
    expect(f.nativeElement.textContent.trim()).toBe('To Do');
  });
  it('renders "In Progress" for in_progress', () => {
    const f = setup('in_progress');
    expect(f.nativeElement.textContent.trim()).toBe('In Progress');
  });
  it('renders "Done" for done', () => {
    const f = setup('done');
    expect(f.nativeElement.textContent.trim()).toBe('Done');
  });
  it('renders "Blocked" for blocked', () => {
    const f = setup('blocked');
    expect(f.nativeElement.textContent.trim()).toBe('Blocked');
  });
  it('applies correct CSS class', () => {
    const f = setup('blocked');
    const span = f.debugElement.query(By.css('.ts-chip--blocked'));
    expect(span).not.toBeNull();
  });
});
