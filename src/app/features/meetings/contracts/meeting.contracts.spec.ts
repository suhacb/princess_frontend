import { describe, expect, it } from 'vitest';
import {
  MeetingActionItemApiResource,
  MeetingApiResource,
  MeetingAttendeeApiResource,
  mapMeeting,
  mapMeetingActionItem,
  mapMeetingAttendee,
} from './meeting.contracts';

const ATTENDEE_API: MeetingAttendeeApiResource = {
  id: 1, name: 'Alice', email: 'alice@example.com',
  job_title: 'PM', organization: 'Acme',
};

const ACTION_ITEM_API: MeetingActionItemApiResource = {
  id: 10, meeting_id: 2, owner_id: 1, owner: ATTENDEE_API,
  description: 'Follow up on budget', due_date: '2026-07-01',
  status: 'open', created_at: '2026-06-28T10:00:00Z', updated_at: '2026-06-28T10:00:00Z',
};

// List response shape: has counts, attendees loaded, no action_items relation
const MEETING_API_LIST: MeetingApiResource = {
  id: 2, project_id: 5, title: 'Kick-off', date_time: '2026-07-01T09:00:00Z',
  agenda: 'Introductions', minutes_body: null,
  attendees: [ATTENDEE_API],
  action_items_open: 1, action_items_closed: 0,
  created_at: '2026-06-28T10:00:00Z', updated_at: '2026-06-28T10:00:00Z',
};

// Show response shape: has action_items loaded, no counts
const MEETING_API_SHOW: MeetingApiResource = {
  id: 2, project_id: 5, title: 'Kick-off', date_time: '2026-07-01T09:00:00Z',
  agenda: 'Introductions', minutes_body: 'Notes here',
  attendees: [ATTENDEE_API],
  action_items: [ACTION_ITEM_API],
  created_at: '2026-06-28T10:00:00Z', updated_at: '2026-06-28T10:00:00Z',
};

describe('mapMeetingAttendee', () => {
  it('maps only id and name (drops email/job_title/organization)', () => {
    const result = mapMeetingAttendee(ATTENDEE_API);
    expect(result).toEqual({ id: 1, name: 'Alice' });
  });
});

describe('mapMeetingActionItem', () => {
  it('maps all fields from API resource', () => {
    const result = mapMeetingActionItem(ACTION_ITEM_API);
    expect(result.id).toBe(10);
    expect(result.meetingId).toBe(2);
    expect(result.ownerId).toBe(1);
    expect(result.ownerName).toBe('Alice');
    expect(result.description).toBe('Follow up on budget');
    expect(result.dueDate).toBe('2026-07-01');
    expect(result.status).toBe('open');
  });

  it('handles null owner', () => {
    const result = mapMeetingActionItem({ ...ACTION_ITEM_API, owner_id: null, owner: null });
    expect(result.ownerId).toBeNull();
    expect(result.ownerName).toBeNull();
  });

  it('maps closed status', () => {
    const result = mapMeetingActionItem({ ...ACTION_ITEM_API, status: 'closed' });
    expect(result.status).toBe('closed');
  });
});

describe('mapMeeting — list response (counts present, action_items absent)', () => {
  it('maps all top-level fields', () => {
    const result = mapMeeting(MEETING_API_LIST);
    expect(result.id).toBe(2);
    expect(result.projectId).toBe(5);
    expect(result.title).toBe('Kick-off');
    expect(result.dateTime).toBe('2026-07-01T09:00:00Z');
    expect(result.agenda).toBe('Introductions');
    expect(result.minutesBody).toBeNull();
  });

  it('uses counts from withCount fields', () => {
    const result = mapMeeting(MEETING_API_LIST);
    expect(result.actionItemsOpen).toBe(1);
    expect(result.actionItemsClosed).toBe(0);
  });

  it('maps attendees', () => {
    const result = mapMeeting(MEETING_API_LIST);
    expect(result.attendees).toHaveLength(1);
    expect(result.attendees[0]).toEqual({ id: 1, name: 'Alice' });
  });

  it('defaults action_items to empty array when absent', () => {
    const result = mapMeeting(MEETING_API_LIST);
    expect(result.actionItems).toEqual([]);
  });

  it('defaults counts to 0 when absent', () => {
    const result = mapMeeting({ ...MEETING_API_LIST, action_items_open: undefined, action_items_closed: undefined });
    expect(result.actionItemsOpen).toBe(0);
    expect(result.actionItemsClosed).toBe(0);
  });
});

describe('mapMeeting — show response (action_items present, counts absent)', () => {
  it('maps minutes_body from show response', () => {
    const result = mapMeeting(MEETING_API_SHOW);
    expect(result.minutesBody).toBe('Notes here');
  });

  it('maps nested action items from show response', () => {
    const result = mapMeeting(MEETING_API_SHOW);
    expect(result.actionItems).toHaveLength(1);
    expect(result.actionItems[0].id).toBe(10);
    expect(result.actionItems[0].ownerName).toBe('Alice');
  });

  it('defaults counts to 0 when absent (show endpoint does not include withCount)', () => {
    const result = mapMeeting(MEETING_API_SHOW);
    expect(result.actionItemsOpen).toBe(0);
    expect(result.actionItemsClosed).toBe(0);
  });
});

describe('mapMeeting — edge cases', () => {
  it('handles missing attendees array gracefully', () => {
    const result = mapMeeting({ ...MEETING_API_LIST, attendees: undefined });
    expect(result.attendees).toEqual([]);
  });

  it('handles null agenda', () => {
    const result = mapMeeting({ ...MEETING_API_LIST, agenda: null });
    expect(result.agenda).toBeNull();
  });
});
