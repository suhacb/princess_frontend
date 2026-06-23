export type DailyLogEntryType = 'note' | 'action' | 'reminder' | 'observation';

export const DAILY_LOG_ENTRY_TYPE_LABELS: Record<DailyLogEntryType, string> = {
  note: 'Note',
  action: 'Action',
  reminder: 'Reminder',
  observation: 'Observation',
};

export const DAILY_LOG_ENTRY_TYPES: DailyLogEntryType[] = ['note', 'action', 'reminder', 'observation'];

export interface DailyLogAuthor {
  id: number;
  name: string;
  jobTitle: string | null;
  organization: string | null;
}

export interface DailyLogEntryApiResource {
  id: number;
  project_id: number;
  stage_id: number | null;
  date: string;
  entry_type: DailyLogEntryType;
  body: string;
  source: string | null;
  author: {
    id: number;
    name: string;
    job_title: string | null;
    organization: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface DailyLogEntry {
  id: number;
  projectId: number;
  stageId: number | null;
  date: string;
  entryType: DailyLogEntryType;
  body: string;
  source: string | null;
  author: DailyLogAuthor | null;
  createdAt: string;
}

export function mapDailyLogEntry(api: DailyLogEntryApiResource): DailyLogEntry {
  return {
    id: api.id,
    projectId: api.project_id,
    stageId: api.stage_id,
    date: api.date,
    entryType: api.entry_type,
    body: api.body,
    source: api.source,
    author: api.author
      ? { id: api.author.id, name: api.author.name, jobTitle: api.author.job_title, organization: api.author.organization }
      : null,
    createdAt: api.created_at,
  };
}

export interface CreateDailyLogEntryPayload {
  date: string;
  entry_type: DailyLogEntryType;
  body: string;
  stage_id?: number | null;
}

export interface UpdateDailyLogEntryPayload {
  date?: string;
  entry_type?: DailyLogEntryType;
  body?: string;
  stage_id?: number | null;
}

export interface DailyLogGroup {
  date: string;
  entries: DailyLogEntry[];
}
