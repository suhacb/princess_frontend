import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { MeetingService } from './meeting.service';
import type { MeetingActionItemApiResource, MeetingApiResource } from '../contracts/meeting.contracts';

function makeApiMeeting(overrides: Partial<MeetingApiResource> = {}): MeetingApiResource {
  return {
    id: 1, project_id: 5, title: 'Kick-off', date_time: '2026-07-01T09:00:00Z',
    agenda: null, minutes_body: null,
    attendees: [],
    action_items_open: 0, action_items_closed: 0,
    created_at: '2026-06-28T00:00:00Z', updated_at: '2026-06-28T00:00:00Z',
    ...overrides,
  };
}

function makeApiActionItem(overrides: Partial<MeetingActionItemApiResource> = {}): MeetingActionItemApiResource {
  return {
    id: 10, meeting_id: 1, owner_id: 7, owner: { id: 7, name: 'Bob', email: 'bob@example.com', job_title: null, organization: null },
    description: 'Follow up', due_date: null, status: 'open',
    created_at: '2026-06-28T00:00:00Z', updated_at: '2026-06-28T00:00:00Z',
    ...overrides,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(apiMock: any) {
  TestBed.configureTestingModule({
    providers: [MeetingService, { provide: ApiService, useValue: apiMock }],
  });
  return TestBed.inject(MeetingService);
}

afterEach(() => TestBed.resetTestingModule());

describe('MeetingService', () => {
  it('initialises with empty meetings and loading=false', () => {
    const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [] })) });
    expect(svc.meetings()).toEqual([]);
    expect(svc.loading()).toBe(false);
  });

  describe('load()', () => {
    it('populates meetings signal from list response', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [makeApiMeeting()] })) });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      expect(svc.meetings()).toHaveLength(1);
      expect(svc.meetings()[0]).toMatchObject({ id: 1, title: 'Kick-off' });
    });

    it('sets loading false after completion', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of({ data: [] })) });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      expect(svc.loading()).toBe(false);
    });

    it('calls GET /projects/:id/meetings', () => {
      const getMock = vi.fn().mockReturnValue(of({ data: [] }));
      const svc = setup({ get: getMock });
      svc.load(5).subscribe();
      expect(getMock).toHaveBeenCalledWith('/projects/5/meetings');
    });
  });

  describe('create()', () => {
    it('prepends the new meeting to the signal', async () => {
      const svc = setup({ post: vi.fn().mockReturnValue(of({ data: makeApiMeeting({ id: 2, title: 'Sprint review' }) })) });
      await new Promise<void>(r =>
        svc.create(5, { title: 'Sprint review', date_time: '2026-07-02T10:00:00Z' }).subscribe({ complete: r }),
      );
      expect(svc.meetings()).toHaveLength(1);
      expect(svc.meetings()[0].title).toBe('Sprint review');
    });

    it('calls POST /projects/:id/meetings', () => {
      const postMock = vi.fn().mockReturnValue(of({ data: makeApiMeeting() }));
      const svc = setup({ post: postMock });
      svc.create(5, { title: 'T', date_time: '2026-07-01T00:00:00Z' }).subscribe();
      expect(postMock).toHaveBeenCalledWith('/projects/5/meetings', expect.objectContaining({ title: 'T' }));
    });
  });

  describe('update()', () => {
    it('replaces the updated meeting in the signal', async () => {
      const svc = setup({
        get: vi.fn().mockReturnValue(of({ data: [makeApiMeeting()] })),
        put: vi.fn().mockReturnValue(of({ data: makeApiMeeting({ title: 'Updated' }) })),
      });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r => svc.update(5, 1, { title: 'Updated' }).subscribe({ complete: r }));
      expect(svc.meetings()[0].title).toBe('Updated');
    });

    it('calls PUT /projects/:id/meetings/:id', () => {
      const putMock = vi.fn().mockReturnValue(of({ data: makeApiMeeting() }));
      const svc = setup({ put: putMock });
      svc.update(5, 1, { minutes_body: 'Notes' }).subscribe();
      expect(putMock).toHaveBeenCalledWith('/projects/5/meetings/1', expect.objectContaining({ minutes_body: 'Notes' }));
    });
  });

  describe('remove()', () => {
    it('removes the meeting from the signal', async () => {
      const svc = setup({
        get: vi.fn().mockReturnValue(of({ data: [makeApiMeeting()] })),
        delete: vi.fn().mockReturnValue(of(undefined)),
      });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r => svc.remove(5, 1).subscribe({ complete: r }));
      expect(svc.meetings()).toHaveLength(0);
    });

    it('calls DELETE /projects/:id/meetings/:id', () => {
      const deleteMock = vi.fn().mockReturnValue(of(undefined));
      const svc = setup({ delete: deleteMock });
      svc.remove(5, 1).subscribe();
      expect(deleteMock).toHaveBeenCalledWith('/projects/5/meetings/1');
    });
  });

  describe('addActionItem()', () => {
    it('appends the new action item and recalculates open count', async () => {
      const svc = setup({
        get: vi.fn().mockReturnValue(of({ data: [makeApiMeeting()] })),
        post: vi.fn().mockReturnValue(of({ data: makeApiActionItem() })),
      });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r =>
        svc.addActionItem(5, 1, { description: 'Follow up', owner_id: 7 }).subscribe({ complete: r }),
      );
      expect(svc.meetings()[0].actionItems).toHaveLength(1);
      expect(svc.meetings()[0].actionItems[0].description).toBe('Follow up');
      expect(svc.meetings()[0].actionItemsOpen).toBe(1);
    });

    it('calls POST /projects/:id/meetings/:id/action-items', () => {
      const postMock = vi.fn().mockReturnValue(of({ data: makeApiActionItem() }));
      const svc = setup({ post: postMock });
      svc.addActionItem(5, 1, { description: 'D', owner_id: 7 }).subscribe();
      expect(postMock).toHaveBeenCalledWith(
        '/projects/5/meetings/1/action-items',
        expect.objectContaining({ description: 'D', owner_id: 7 }),
      );
    });
  });

  describe('updateActionItem()', () => {
    it('replaces the updated action item and recalculates counts', async () => {
      const openItem  = makeApiActionItem({ id: 10, status: 'open' });
      const closedItem = { ...makeApiActionItem({ id: 10 }), status: 'closed' as const };
      const svc = setup({
        get: vi.fn().mockReturnValue(of({ data: [makeApiMeeting({ action_items: [openItem] })] })),
        patch: vi.fn().mockReturnValue(of({ data: closedItem })),
      });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r =>
        svc.updateActionItem(5, 1, 10, { status: 'closed' }).subscribe({ complete: r }),
      );
      expect(svc.meetings()[0].actionItems[0].status).toBe('closed');
      expect(svc.meetings()[0].actionItemsOpen).toBe(0);
      expect(svc.meetings()[0].actionItemsClosed).toBe(1);
    });

    it('calls PATCH /projects/:id/meetings/:id/action-items/:id', () => {
      const patchMock = vi.fn().mockReturnValue(of({ data: makeApiActionItem() }));
      const svc = setup({ patch: patchMock });
      svc.updateActionItem(5, 1, 10, { status: 'closed' }).subscribe();
      expect(patchMock).toHaveBeenCalledWith(
        '/projects/5/meetings/1/action-items/10',
        expect.objectContaining({ status: 'closed' }),
      );
    });
  });

  describe('removeActionItem()', () => {
    it('removes the action item and recalculates counts', async () => {
      const item = makeApiActionItem({ id: 10, status: 'open' });
      const svc = setup({
        get: vi.fn().mockReturnValue(of({ data: [makeApiMeeting({ action_items: [item] })] })),
        delete: vi.fn().mockReturnValue(of(undefined)),
      });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r =>
        svc.removeActionItem(5, 1, 10).subscribe({ complete: r }),
      );
      expect(svc.meetings()[0].actionItems).toHaveLength(0);
      expect(svc.meetings()[0].actionItemsOpen).toBe(0);
    });

    it('calls DELETE /projects/:id/meetings/:id/action-items/:id', () => {
      const deleteMock = vi.fn().mockReturnValue(of(undefined));
      const svc = setup({ delete: deleteMock });
      svc.removeActionItem(5, 1, 10).subscribe();
      expect(deleteMock).toHaveBeenCalledWith('/projects/5/meetings/1/action-items/10');
    });
  });
});
