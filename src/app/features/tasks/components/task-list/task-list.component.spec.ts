import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskListComponent } from './task-list.component';
import type { Task } from '../../contracts/task.contracts';

const today     = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const tomorrow  = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

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
  TestBed.configureTestingModule({ imports: [TaskListComponent, BrowserAnimationsModule] });
  const fixture = TestBed.createComponent(TaskListComponent);
  fixture.componentRef.setInput('tasks', tasks);
  fixture.componentRef.setInput('loading', loading);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('TaskListComponent', () => {
  it('shows skeleton when loading', () => {
    const f = setup([], true);
    expect(f.debugElement.query(By.css('.tl__skeleton'))).not.toBeNull();
  });

  it('shows empty state when no tasks', () => {
    const f = setup([]);
    expect(f.debugElement.query(By.css('app-empty-state'))).not.toBeNull();
  });

  it('renders one item per task', () => {
    const f = setup([makeTask({ id: 1 }), makeTask({ id: 2, title: 'Task B' })]);
    expect(f.debugElement.queryAll(By.css('.tl__item'))).toHaveLength(2);
  });

  it('emits createClicked when New task button clicked', () => {
    const f = setup([makeTask()]);
    const spy = vi.fn();
    f.componentInstance.createClicked.subscribe(spy);
    f.debugElement.query(By.css('button[color=primary]')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('emits taskSelected when item clicked', () => {
    const task = makeTask();
    const f = setup([task]);
    const spy = vi.fn();
    f.componentInstance.taskSelected.subscribe(spy);
    f.debugElement.query(By.css('.tl__item')).nativeElement.click();
    expect(spy).toHaveBeenCalledWith(task);
  });

  it('adds --overdue class for overdue task', () => {
    const f = setup([makeTask({ dueDate: yesterday })]);
    expect(f.debugElement.query(By.css('.tl__item--overdue'))).not.toBeNull();
  });

  it('adds --due-soon class for task due tomorrow', () => {
    const f = setup([makeTask({ dueDate: tomorrow })]);
    expect(f.debugElement.query(By.css('.tl__item--due-soon'))).not.toBeNull();
  });

  describe('filters', () => {
    it('filters by status signal', () => {
      const f = setup([makeTask({ id: 1, status: 'todo' }), makeTask({ id: 2, status: 'done' })]);
      f.componentInstance.filterStatus.set('done');
      f.detectChanges();
      expect(f.debugElement.queryAll(By.css('.tl__item'))).toHaveLength(1);
    });

    it('filters by assignee name', () => {
      const f = setup([makeTask({ id: 1, assigneeName: 'Alice' }), makeTask({ id: 2, assigneeName: 'Bob' })]);
      f.componentInstance.filterAssignee.set('alice');
      f.detectChanges();
      expect(f.debugElement.queryAll(By.css('.tl__item'))).toHaveLength(1);
    });

    it('clears filters', () => {
      const f = setup([makeTask({ id: 1, status: 'todo' }), makeTask({ id: 2, status: 'done' })]);
      f.componentInstance.filterStatus.set('todo');
      f.detectChanges();
      expect(f.debugElement.queryAll(By.css('.tl__item'))).toHaveLength(1);
      f.componentInstance.clearFilters();
      f.detectChanges();
      expect(f.debugElement.queryAll(By.css('.tl__item'))).toHaveLength(2);
    });
  });
});
