import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskBoardComponent } from './task-board.component';
import type { Task } from '../../contracts/task.contracts';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1, projectId: 10, stageId: null, workPackageId: null,
    title: 'Task A', description: null,
    assigneeId: null, assigneeName: null,
    dueDate: null, status: 'todo', priority: 'medium',
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

function setup(tasks: Task[] = [], loading = false) {
  TestBed.configureTestingModule({
    imports: [TaskBoardComponent, BrowserAnimationsModule],
    providers: [
      {
        provide: TaskService,
        useValue: { update: vi.fn().mockReturnValue(of(undefined)) },
      },
    ],
  });
  const fixture = TestBed.createComponent(TaskBoardComponent);
  fixture.componentRef.setInput('projectId', 10);
  fixture.componentRef.setInput('tasks', tasks);
  fixture.componentRef.setInput('loading', loading);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('TaskBoardComponent', () => {
  it('renders 4 columns', () => {
    const f = setup([]);
    const cols = f.debugElement.queryAll(By.css('.tb__col'));
    expect(cols).toHaveLength(4);
  });

  it('renders skeleton when loading', () => {
    const f = setup([], true);
    expect(f.debugElement.query(By.css('.tb__skeleton'))).not.toBeNull();
  });

  it('places tasks in correct column', () => {
    const f = setup([
      makeTask({ id: 1, status: 'todo' }),
      makeTask({ id: 2, status: 'done' }),
    ]);
    const todoCol = f.debugElement.query(By.css('.tb__col--todo'));
    const doneCol = f.debugElement.query(By.css('.tb__col--done'));
    expect(todoCol.queryAll(By.css('.tb__card'))).toHaveLength(1);
    expect(doneCol.queryAll(By.css('.tb__card'))).toHaveLength(1);
  });

  it('shows correct count badge', () => {
    const f = setup([makeTask({ id: 1, status: 'todo' }), makeTask({ id: 2, status: 'todo' })]);
    const counts = f.debugElement.queryAll(By.css('.tb__col-count'));
    const todoCount = counts[0]; // todo is first column
    expect(todoCount.nativeElement.textContent.trim()).toBe('2');
  });

  it('emits taskSelected when card is clicked', () => {
    const task = makeTask({ id: 1 });
    const f = setup([task]);
    const spy = vi.fn();
    f.componentInstance.taskSelected.subscribe(spy);
    f.debugElement.query(By.css('.tb__card')).nativeElement.click();
    expect(spy).toHaveBeenCalledWith(task);
  });

  it('emits createClicked when New task button clicked', () => {
    const f = setup([]);
    const spy = vi.fn();
    f.componentInstance.createClicked.subscribe(spy);
    f.debugElement.query(By.css('button[color=primary]')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('shows empty drop hint when column is empty', () => {
    const f = setup([makeTask({ id: 1, status: 'todo' })]);
    const inProgressCol = f.debugElement.query(By.css('.tb__col--in_progress'));
    expect(inProgressCol.query(By.css('.tb__col-empty'))).not.toBeNull();
  });

  it('adds overdue class for overdue task', () => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const f = setup([makeTask({ dueDate: yesterday, status: 'todo' })]);
    expect(f.debugElement.query(By.css('.tb__card--overdue'))).not.toBeNull();
  });
});
