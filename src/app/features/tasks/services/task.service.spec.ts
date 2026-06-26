import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { TaskService } from './task.service';
import type { TaskApiResource } from '../contracts/task.contracts';

function makeApiTask(overrides: Partial<TaskApiResource> = {}): TaskApiResource {
  return {
    id: 1, project_id: 10, stage_id: null, work_package_id: null,
    title: 'T1', description: null,
    assignee_id: null, assignee: null,
    due_date: null, status: 'todo', priority: 'medium',
    created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(apiMock: any) {
  TestBed.configureTestingModule({
    providers: [
      TaskService,
      { provide: ApiService, useValue: apiMock },
    ],
  });
  return TestBed.inject(TaskService);
}

afterEach(() => TestBed.resetTestingModule());

describe('TaskService', () => {
  it('initialises with empty tasks and loading=false', () => {
    const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [] })) });
    expect(svc.tasks()).toEqual([]);
    expect(svc.loading()).toBe(false);
  });

  describe('load()', () => {
    it('populates tasks signal', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [makeApiTask()] })) });
      await new Promise<void>(r => svc.load(10).subscribe({ complete: r }));
      expect(svc.tasks()).toHaveLength(1);
      expect(svc.tasks()[0]).toMatchObject({ id: 1, title: 'T1' });
    });

    it('sets loading false after completion', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [] })) });
      await new Promise<void>(r => svc.load(10).subscribe({ complete: r }));
      expect(svc.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('appends the new task to the signal', async () => {
      const svc = setup({ post: vi.fn().mockReturnValue(of({ data: makeApiTask({ id: 2, title: 'New' }) })) });
      await new Promise<void>(r => svc.create(10, { title: 'New', status: 'todo', priority: 'low' }).subscribe({ complete: r }));
      expect(svc.tasks()).toHaveLength(1);
      expect(svc.tasks()[0].title).toBe('New');
    });

    it('sends required fields in payload', () => {
      const postMock = vi.fn().mockReturnValue(of({ data: makeApiTask() }));
      const svc = setup({ post: postMock });
      svc.create(10, { title: 'T', status: 'in_progress', priority: 'high' }).subscribe();
      expect(postMock).toHaveBeenCalledWith(
        '/projects/10/tasks',
        expect.objectContaining({ title: 'T', status: 'in_progress', priority: 'high' }),
      );
    });
  });

  describe('update()', () => {
    it('replaces the updated task in the signal', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [makeApiTask()] })), put: vi.fn().mockReturnValue(of({ data: makeApiTask({ status: 'done' }) })) });
      await new Promise<void>(r => svc.load(10).subscribe({ complete: r }));
      await new Promise<void>(r => svc.update(10, 1, { status: 'done' }).subscribe({ complete: r }));
      expect(svc.tasks()[0].status).toBe('done');
    });
  });

  describe('remove()', () => {
    it('removes the task from the signal', async () => {
      const svc = setup({
        get: vi.fn().mockReturnValue(of({ data: [makeApiTask()] })),
        delete: vi.fn().mockReturnValue(of(undefined)),
      });
      await new Promise<void>(r => svc.load(10).subscribe({ complete: r }));
      await new Promise<void>(r => svc.remove(10, 1).subscribe({ complete: r }));
      expect(svc.tasks()).toHaveLength(0);
    });
  });

  describe('loadHistory()', () => {
    it('maps history entries', async () => {
      const entry = { id: 1, task_id: 1, user: { id: 2, name: 'Bob' }, field: 'status', old_value: 'todo', new_value: 'done', created_at: '2025-06-01T00:00:00Z' };
      const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [entry] })) });
      const result = await new Promise<ReturnType<typeof svc.loadHistory> extends import('rxjs').Observable<infer T> ? T : never>(
        r => svc.loadHistory(10, 1).subscribe(r),
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ user: 'Bob', field: 'status', oldValue: 'todo', newValue: 'done' });
    });
  });
});
