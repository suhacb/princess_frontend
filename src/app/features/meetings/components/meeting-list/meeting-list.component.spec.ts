import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeetingListComponent } from './meeting-list.component';
import type { Meeting } from '../../contracts/meeting.contracts';

function makeMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    id: 1, projectId: 5, title: 'Kick-off',
    dateTime: '2026-07-01T09:00:00Z',
    agenda: null, minutesBody: null,
    attendees: [], actionItems: [],
    actionItemsOpen: 0, actionItemsClosed: 0,
    ...overrides,
  };
}

function setup(meetings: Meeting[] = [], loading = false) {
  TestBed.configureTestingModule({ imports: [MeetingListComponent, BrowserAnimationsModule] });
  const fixture = TestBed.createComponent(MeetingListComponent);
  fixture.componentRef.setInput('meetings', meetings);
  fixture.componentRef.setInput('loading', loading);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('MeetingListComponent', () => {
  it('shows skeleton when loading', () => {
    const f = setup([], true);
    expect(f.debugElement.query(By.css('app-skeleton'))).not.toBeNull();
  });

  it('shows empty state when no meetings', () => {
    const f = setup([]);
    expect(f.debugElement.query(By.css('app-empty-state'))).not.toBeNull();
  });

  it('renders one item per meeting', () => {
    const f = setup([makeMeeting({ id: 1 }), makeMeeting({ id: 2, title: 'Retrospective' })]);
    expect(f.debugElement.queryAll(By.css('.ml__item'))).toHaveLength(2);
  });

  it('emits meetingSelected when item clicked', () => {
    const m = makeMeeting();
    const f = setup([m]);
    const spy = vi.fn();
    f.componentInstance.meetingSelected.subscribe(spy);
    f.debugElement.query(By.css('.ml__item')).nativeElement.click();
    expect(spy).toHaveBeenCalledWith(m);
  });

  it('emits createClicked when add button clicked', () => {
    const f = setup([makeMeeting()]);
    const spy = vi.fn();
    f.componentInstance.createClicked.subscribe(spy);
    f.debugElement.query(By.css('button[aria-label="New meeting"]')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('marks selected item with --active class', () => {
    const f = setup([makeMeeting({ id: 1 }), makeMeeting({ id: 2, title: 'Sprint' })]);
    fixture_setSelectedId(f, 1);
    f.detectChanges();
    const items = f.debugElement.queryAll(By.css('.ml__item'));
    expect(items[0].classes['ml__item--active']).toBe(true);
    expect(items[1].classes['ml__item--active']).toBeFalsy();
  });

  it('shows open badge for meetings with open action items', () => {
    const f = setup([makeMeeting({ actionItemsOpen: 3 })]);
    expect(f.debugElement.query(By.css('.ml__badge--open'))).not.toBeNull();
  });

  it('does not show open badge when 0 open items', () => {
    const f = setup([makeMeeting({ actionItemsOpen: 0 })]);
    expect(f.debugElement.query(By.css('.ml__badge--open'))).toBeNull();
  });

  it('filters by search text', () => {
    const f = setup([
      makeMeeting({ id: 1, title: 'Kick-off' }),
      makeMeeting({ id: 2, title: 'Retrospective' }),
    ]);
    f.componentInstance.search.set('retro');
    f.detectChanges();
    expect(f.debugElement.queryAll(By.css('.ml__item'))).toHaveLength(1);
  });
});

function fixture_setSelectedId(f: ReturnType<typeof setup>, id: number | null) {
  f.componentRef.setInput('selectedMeetingId', id);
}
