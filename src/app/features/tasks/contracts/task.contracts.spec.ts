import {
  isDueThisWeek,
  isOverdue,
  mapTask,
  mapTaskHistory,
  type Task,
  type TaskApiResource,
  type TaskHistoryApiResource,
} from './task.contracts';

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const tomorrow  = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const nextWeek  = new Date(Date.now() + 8 * 86_400_000).toISOString().slice(0, 10);

function makeApi(overrides: Partial<TaskApiResource> = {}): TaskApiResource {
  return {
    id: 1, project_id: 10, stage_id: null, work_package_id: null,
    title: 'T1', description: null,
    assignee_id: 5, assignee: { id: 5, person: { id: 99, name: 'Alice' } },
    due_date: null, status: 'todo', priority: 'medium',
    created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1, projectId: 10, stageId: null, workPackageId: null,
    title: 'T1', description: null,
    assigneeId: 5, assigneeName: 'Alice',
    dueDate: null, status: 'todo', priority: 'medium',
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

// ─── mapTask ──────────────────────────────────────────────────────────────────

describe('mapTask', () => {
  it('maps all fields', () => {
    const result = mapTask(makeApi());
    expect(result).toMatchObject({
      id: 1, projectId: 10, title: 'T1',
      assigneeId: 5, assigneeName: 'Alice',
      status: 'todo', priority: 'medium',
    });
  });

  it('assigneeName is null when assignee is null', () => {
    expect(mapTask(makeApi({ assignee: null })).assigneeName).toBeNull();
  });

  it('maps stage and work package ids', () => {
    const t = mapTask(makeApi({ stage_id: 3, work_package_id: 7 }));
    expect(t.stageId).toBe(3);
    expect(t.workPackageId).toBe(7);
  });
});

// ─── mapTaskHistory ───────────────────────────────────────────────────────────

describe('mapTaskHistory', () => {
  const api: TaskHistoryApiResource = {
    id: 1, task_id: 1,
    user: { id: 2, name: 'Bob' },
    field: 'status', old_value: 'todo', new_value: 'in_progress',
    created_at: '2025-06-01T10:00:00Z',
  };

  it('maps user name', () => expect(mapTaskHistory(api).user).toBe('Bob'));
  it('maps field and values', () => {
    const h = mapTaskHistory(api);
    expect(h.field).toBe('status');
    expect(h.oldValue).toBe('todo');
    expect(h.newValue).toBe('in_progress');
  });
  it('null user → null', () => {
    expect(mapTaskHistory({ ...api, user: null }).user).toBeNull();
  });
});

// ─── isOverdue ────────────────────────────────────────────────────────────────

describe('isOverdue', () => {
  it('returns true for past due date on non-done task', () => {
    expect(isOverdue(makeTask({ dueDate: yesterday, status: 'todo' }))).toBe(true);
  });
  it('returns false for done task regardless of date', () => {
    expect(isOverdue(makeTask({ dueDate: yesterday, status: 'done' }))).toBe(false);
  });
  it('returns false when no due date', () => {
    expect(isOverdue(makeTask({ dueDate: null }))).toBe(false);
  });
  it('returns false for future due date', () => {
    expect(isOverdue(makeTask({ dueDate: tomorrow }))).toBe(false);
  });
});

// ─── isDueThisWeek ────────────────────────────────────────────────────────────

describe('isDueThisWeek', () => {
  it('returns true when due tomorrow (within 7 days)', () => {
    expect(isDueThisWeek(makeTask({ dueDate: tomorrow, status: 'todo' }))).toBe(true);
  });
  it('returns false when due more than 7 days out', () => {
    expect(isDueThisWeek(makeTask({ dueDate: nextWeek, status: 'todo' }))).toBe(false);
  });
  it('returns false for done task', () => {
    expect(isDueThisWeek(makeTask({ dueDate: tomorrow, status: 'done' }))).toBe(false);
  });
  it('returns false when overdue', () => {
    expect(isDueThisWeek(makeTask({ dueDate: yesterday }))).toBe(false);
  });
  it('returns false with no due date', () => {
    expect(isDueThisWeek(makeTask({ dueDate: null }))).toBe(false);
  });
});
