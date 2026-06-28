import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiService } from '../../../../core/http/api.service';
import { MeetingDetailComponent } from './meeting-detail.component';
import { MeetingService } from '../../services/meeting.service';
import type { Meeting, MeetingActionItem } from '../../contracts/meeting.contracts';

const MEMBERS_RESPONSE = {
  data: [
    { id: 1, person: { id: 7, name: 'Bob' }, role: 'team_member' },
  ],
};

function makeActionItem(overrides: Partial<MeetingActionItem> = {}): MeetingActionItem {
  return {
    id: 10, meetingId: 1, ownerId: 7, ownerName: 'Bob',
    description: 'Follow up', dueDate: null, status: 'open',
    ...overrides,
  };
}

function makeMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    id: 1, projectId: 5, title: 'Kick-off',
    dateTime: '2026-07-01T09:00:00Z',
    agenda: 'Test agenda', minutesBody: null,
    attendees: [{ id: 1, name: 'Alice' }],
    actionItems: [], actionItemsOpen: 0, actionItemsClosed: 0,
    ...overrides,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(meetingServiceMock: any, meetingId = 1) {
  TestBed.configureTestingModule({
    imports: [MeetingDetailComponent, BrowserAnimationsModule],
    providers: [
      { provide: MeetingService, useValue: meetingServiceMock },
      { provide: ApiService, useValue: { get: vi.fn().mockReturnValue(of(MEMBERS_RESPONSE)) } },
    ],
  });
  const fixture = TestBed.createComponent(MeetingDetailComponent);
  fixture.componentRef.setInput('projectId', 5);
  fixture.componentRef.setInput('meetingId', meetingId);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('MeetingDetailComponent', () => {
  it('renders meeting title once loaded', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting())) };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('Kick-off');
  });

  it('renders attendees', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting())) };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('Alice');
  });

  it('shows empty hint when no minutes and not editing', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting({ minutesBody: null }))) };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('No minutes recorded');
  });

  it('shows minutes body when present', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting({ minutesBody: 'Key decisions made' }))) };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('Key decisions made');
  });

  it('shows minutes textarea after edit-minutes click', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting())) };
    const f = setup(svc);
    f.debugElement.query(By.css('button[aria-label="Edit minutes"]')).nativeElement.click();
    f.detectChanges();
    expect(f.debugElement.query(By.css('.md__minutes-form'))).not.toBeNull();
  });

  it('calls update() with minutes_body on save', () => {
    const meeting = makeMeeting();
    const updateMock = vi.fn().mockReturnValue(of({ ...meeting, minutesBody: 'Saved notes' }));
    const svc = { show: vi.fn().mockReturnValue(of(meeting)), update: updateMock };
    const f = setup(svc);

    f.debugElement.query(By.css('button[aria-label="Edit minutes"]')).nativeElement.click();
    f.detectChanges();
    f.componentInstance.minutesForm.patchValue({ minutes_body: 'Saved notes' });
    f.debugElement.query(By.css('.md__minutes-form button[type="submit"]')).nativeElement.click();

    expect(updateMock).toHaveBeenCalledWith(5, 1, { minutes_body: 'Saved notes' });
  });

  it('renders action items list', () => {
    const item = makeActionItem();
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting({ actionItems: [item], actionItemsOpen: 1 }))) };
    const f = setup(svc);
    expect(f.debugElement.queryAll(By.css('.md__ai-item'))).toHaveLength(1);
  });

  it('shows add action item form on button click', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting())) };
    const f = setup(svc);
    f.debugElement.query(By.css('button[aria-label="Add action item"]')).nativeElement.click();
    f.detectChanges();
    expect(f.debugElement.query(By.css('.md__ai-form'))).not.toBeNull();
  });

  it('action item submit is disabled when owner_id not set (required by backend)', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting())) };
    const f = setup(svc);
    f.debugElement.query(By.css('button[aria-label="Add action item"]')).nativeElement.click();
    f.detectChanges();

    f.componentInstance.actionItemForm.patchValue({ description: 'Test', owner_id: null });
    f.detectChanges();

    const submitBtn = f.debugElement.query(By.css('.md__ai-form button[type="submit"]')).nativeElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it('calls addActionItem with owner_id on submit', () => {
    const addMock = vi.fn().mockReturnValue(of(makeActionItem()));
    const showMock = vi.fn().mockReturnValue(of(makeMeeting()));
    const f = setup({ show: showMock, addActionItem: addMock });

    f.debugElement.query(By.css('button[aria-label="Add action item"]')).nativeElement.click();
    f.detectChanges();

    f.componentInstance.actionItemForm.patchValue({ description: 'Do something', owner_id: 7 });
    f.detectChanges();

    f.debugElement.query(By.css('.md__ai-form button[type="submit"]')).nativeElement.click();
    expect(addMock).toHaveBeenCalledWith(5, 1, expect.objectContaining({ description: 'Do something', owner_id: 7 }));
  });

  it('calls updateActionItem on status toggle (open → closed)', () => {
    const item = makeActionItem({ status: 'open' });
    const updateMock = vi.fn().mockReturnValue(of(item));
    const showMock = vi.fn().mockReturnValue(of(makeMeeting({ actionItems: [item], actionItemsOpen: 1 })));
    const f = setup({ show: showMock, updateActionItem: updateMock });

    f.debugElement.query(By.css('.md__ai-toggle')).nativeElement.click();
    expect(updateMock).toHaveBeenCalledWith(5, 1, 10, { status: 'closed' });
  });

  it('calls removeActionItem when delete button clicked', () => {
    const item = makeActionItem();
    const removeMock = vi.fn().mockReturnValue(of(undefined));
    const showMock = vi.fn().mockReturnValue(of(makeMeeting({ actionItems: [item] })));
    const f = setup({ show: showMock, removeActionItem: removeMock });

    f.debugElement.query(By.css('button[aria-label="Remove action item"]')).nativeElement.click();
    expect(removeMock).toHaveBeenCalledWith(5, 1, 10);
  });

  it('loads project members on init for owner select', () => {
    const svc = { show: vi.fn().mockReturnValue(of(makeMeeting())) };
    const f = setup(svc);
    expect(f.componentInstance.members()).toHaveLength(1);
    expect(f.componentInstance.members()[0].person.name).toBe('Bob');
  });
});
