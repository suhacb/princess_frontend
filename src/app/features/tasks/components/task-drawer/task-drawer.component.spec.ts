import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiService } from '../../../../core/http/api.service';
import { TaskService } from '../../services/task.service';
import { TaskDrawerComponent } from './task-drawer.component';
import type { Task } from '../../contracts/task.contracts';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1, projectId: 10, stageId: null, workPackageId: null,
    title: 'Existing Task', description: 'Desc',
    assigneeId: null, assigneeName: null,
    dueDate: '2025-06-30', status: 'in_progress', priority: 'high',
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

const emptyMeta = { data: [] };

function setup(task: Task | null = null) {
  const taskServiceMock = {
    create: vi.fn().mockReturnValue(of({})),
    update: vi.fn().mockReturnValue(of({})),
    loadHistory: vi.fn().mockReturnValue(of([])),
  };
  const apiMock = {
    get: vi.fn().mockReturnValue(of(emptyMeta)),
  };

  TestBed.configureTestingModule({
    imports: [TaskDrawerComponent, BrowserAnimationsModule],
    providers: [
      { provide: TaskService, useValue: taskServiceMock },
      { provide: ApiService, useValue: apiMock },
    ],
  });

  const fixture = TestBed.createComponent(TaskDrawerComponent);
  fixture.componentRef.setInput('projectId', 10);
  fixture.componentRef.setInput('task', task);
  fixture.detectChanges();

  return { fixture, taskServiceMock };
}

afterEach(() => TestBed.resetTestingModule());

describe('TaskDrawerComponent', () => {
  describe('create mode (task=null)', () => {
    it('shows "New task" header', () => {
      const { fixture } = setup(null);
      expect(fixture.nativeElement.textContent).toContain('New task');
    });

    it('shows "Create" button', () => {
      const { fixture } = setup(null);
      const btn = fixture.debugElement.query(By.css('button[type=submit]'));
      expect(btn.nativeElement.textContent.trim()).toContain('Create');
    });

    it('does not show audit trail section', () => {
      const { fixture } = setup(null);
      expect(fixture.debugElement.query(By.css('.tdr__history'))).toBeNull();
    });

    it('calls taskService.create on submit', () => {
      const { fixture, taskServiceMock } = setup(null);
      fixture.componentInstance.form.patchValue({ title: 'New T', status: 'todo', priority: 'low' });
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button[type=submit]')).nativeElement.click();
      expect(taskServiceMock.create).toHaveBeenCalledWith(10, expect.objectContaining({ title: 'New T' }));
    });

    it('submit button disabled when title empty', () => {
      const { fixture } = setup(null);
      fixture.componentInstance.form.patchValue({ title: '' });
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
      expect(btn.disabled).toBe(true);
    });
  });

  describe('edit mode (task provided)', () => {
    it('shows "Edit task" header', () => {
      const { fixture } = setup(makeTask());
      expect(fixture.nativeElement.textContent).toContain('Edit task');
    });

    it('pre-fills title from task', () => {
      const { fixture } = setup(makeTask({ title: 'My Task' }));
      expect(fixture.componentInstance.form.getRawValue().title).toBe('My Task');
    });

    it('shows audit trail section', () => {
      const { fixture } = setup(makeTask());
      expect(fixture.debugElement.query(By.css('.tdr__history'))).not.toBeNull();
    });

    it('calls taskService.update on submit', () => {
      const { fixture, taskServiceMock } = setup(makeTask());
      fixture.debugElement.query(By.css('button[type=submit]')).nativeElement.click();
      expect(taskServiceMock.update).toHaveBeenCalledWith(10, 1, expect.any(Object));
    });

    it('shows "No changes recorded yet" when history is empty', () => {
      const { fixture } = setup(makeTask());
      expect(fixture.nativeElement.textContent).toContain('No changes recorded yet');
    });
  });

  it('emits closed when close button clicked', () => {
    const { fixture } = setup(null);
    const spy = vi.fn();
    fixture.componentInstance.closed.subscribe(spy);
    fixture.debugElement.query(By.css('button[aria-label="Close drawer"]')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});
