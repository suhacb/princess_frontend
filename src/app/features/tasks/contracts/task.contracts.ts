export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked'];
export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  blocked: 'Blocked',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export interface TaskApiResource {
  id: number;
  project_id: number;
  stage_id: number | null;
  work_package_id: number | null;
  title: string;
  description: string | null;
  assignee_id: number | null;
  assignee: { id: number; person: { id: number; name: string } } | null;
  due_date: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  projectId: number;
  stageId: number | null;
  workPackageId: number | null;
  title: string;
  description: string | null;
  assigneeId: number | null;
  assigneeName: string | null;
  dueDate: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

export function mapTask(api: TaskApiResource): Task {
  return {
    id: api.id,
    projectId: api.project_id,
    stageId: api.stage_id,
    workPackageId: api.work_package_id,
    title: api.title,
    description: api.description,
    assigneeId: api.assignee_id,
    assigneeName: api.assignee?.person?.name ?? null,
    dueDate: api.due_date,
    status: api.status,
    priority: api.priority,
    createdAt: api.created_at,
  };
}

// ─── Audit trail ──────────────────────────────────────────────────────────────

export interface TaskHistoryApiResource {
  id: number;
  task_id: number;
  user: { id: number; name: string } | null;
  field: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface TaskHistoryEntry {
  id: number;
  user: string | null;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export function mapTaskHistory(api: TaskHistoryApiResource): TaskHistoryEntry {
  return {
    id: api.id,
    user: api.user?.name ?? null,
    field: api.field,
    oldValue: api.old_value,
    newValue: api.new_value,
    createdAt: api.created_at,
  };
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string | null;
  assignee_id?: number | null;
  due_date?: string | null;
  stage_id?: number | null;
  work_package_id?: number | null;
}

export interface UpdateTaskPayload {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  description?: string | null;
  assignee_id?: number | null;
  due_date?: string | null;
  stage_id?: number | null;
  work_package_id?: number | null;
}

// ─── Due-date helpers ─────────────────────────────────────────────────────────

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false;
  return task.dueDate < new Date().toISOString().slice(0, 10);
}

export function isDueThisWeek(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false;
  const today = new Date().toISOString().slice(0, 10);
  const weekOut = new Date();
  weekOut.setDate(weekOut.getDate() + 7);
  const weekIso = weekOut.toISOString().slice(0, 10);
  return task.dueDate >= today && task.dueDate <= weekIso;
}
