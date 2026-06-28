export type MeetingActionItemStatus = 'open' | 'closed';

export const MEETING_ACTION_ITEM_STATUSES: MeetingActionItemStatus[] = ['open', 'closed'];

// ─── API resources ────────────────────────────────────────────────────────────

export interface MeetingAttendeeApiResource {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  organization: string | null;
}

export interface MeetingActionItemApiResource {
  id: number;
  meeting_id: number;
  owner_id: number | null;
  owner: MeetingAttendeeApiResource | null;
  description: string;
  due_date: string | null;
  status: MeetingActionItemStatus;
  created_at: string;
  updated_at: string;
}

export interface MeetingApiResource {
  id: number;
  project_id: number;
  title: string;
  date_time: string;
  agenda: string | null;
  minutes_body: string | null;
  // Conditionally present: whenLoaded — present on both index and show
  attendees?: MeetingAttendeeApiResource[];
  // Conditionally present: whenLoaded — only on show (detail) response
  action_items?: MeetingActionItemApiResource[];
  // Conditionally present: from withCount — only on index (list) response
  action_items_open?: number;
  action_items_closed?: number;
  created_at: string;
  updated_at: string;
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface MeetingAttendee {
  id: number;
  name: string;
}

export interface MeetingActionItem {
  id: number;
  meetingId: number;
  ownerId: number | null;
  ownerName: string | null;
  description: string;
  dueDate: string | null;
  status: MeetingActionItemStatus;
}

export interface Meeting {
  id: number;
  projectId: number;
  title: string;
  dateTime: string;
  agenda: string | null;
  minutesBody: string | null;
  attendees: MeetingAttendee[];
  actionItems: MeetingActionItem[];
  actionItemsOpen: number;
  actionItemsClosed: number;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapMeetingAttendee(api: MeetingAttendeeApiResource): MeetingAttendee {
  return { id: api.id, name: api.name };
}

export function mapMeetingActionItem(api: MeetingActionItemApiResource): MeetingActionItem {
  return {
    id: api.id,
    meetingId: api.meeting_id,
    ownerId: api.owner_id,
    ownerName: api.owner?.name ?? null,
    description: api.description,
    dueDate: api.due_date,
    status: api.status,
  };
}

export function mapMeeting(api: MeetingApiResource): Meeting {
  return {
    id: api.id,
    projectId: api.project_id,
    title: api.title,
    dateTime: api.date_time,
    agenda: api.agenda,
    minutesBody: api.minutes_body,
    attendees: (api.attendees ?? []).map(mapMeetingAttendee),
    actionItems: (api.action_items ?? []).map(mapMeetingActionItem),
    actionItemsOpen: api.action_items_open ?? 0,
    actionItemsClosed: api.action_items_closed ?? 0,
  };
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateMeetingPayload {
  title: string;
  date_time: string;
  agenda?: string | null;
  minutes_body?: string | null;
  attendee_ids?: number[];
}

export interface UpdateMeetingPayload {
  title?: string;
  date_time?: string;
  agenda?: string | null;
  minutes_body?: string | null;
  attendee_ids?: number[];
}

export interface CreateActionItemPayload {
  description: string;
  owner_id: number;  // required by backend — must be a project member
  due_date?: string | null;
  status?: MeetingActionItemStatus;
}

export interface UpdateActionItemPayload {
  description?: string;
  owner_id?: number | null;
  due_date?: string | null;
  status?: MeetingActionItemStatus;
}
