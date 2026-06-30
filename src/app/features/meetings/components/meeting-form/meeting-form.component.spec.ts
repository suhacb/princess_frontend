import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MeetingFormComponent } from './meeting-form.component';
import { MeetingService } from '../../services/meeting.service';
import type { Meeting } from '../../contracts/meeting.contracts';

function makeMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    id: 1, projectId: 5, title: 'Kick-off',
    dateTime: '2026-07-01T09:00:00Z',
    agenda: 'Introductions', minutesBody: null,
    attendees: [], actionItems: [],
    actionItemsOpen: 0, actionItemsClosed: 0, document: null,
    ...overrides,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(serviceMock: any, meeting: Meeting | null = null) {
  TestBed.configureTestingModule({
    imports: [MeetingFormComponent, BrowserAnimationsModule],
    providers: [{ provide: MeetingService, useValue: serviceMock }],
  });
  const fixture = TestBed.createComponent(MeetingFormComponent);
  fixture.componentRef.setInput('projectId', 5);
  if (meeting) fixture.componentRef.setInput('meeting', meeting);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('MeetingFormComponent', () => {
  it('shows New meeting title in create mode', () => {
    const f = setup({ create: vi.fn().mockReturnValue(of(makeMeeting())) });
    expect(f.nativeElement.textContent).toContain('New meeting');
  });

  it('shows Edit meeting title in edit mode', () => {
    const f = setup({ update: vi.fn().mockReturnValue(of(makeMeeting())) }, makeMeeting());
    expect(f.nativeElement.textContent).toContain('Edit meeting');
  });

  it('patches form values from meeting input', () => {
    const f = setup({ update: vi.fn().mockReturnValue(of(makeMeeting())) }, makeMeeting());
    expect(f.componentInstance.form.getRawValue().title).toBe('Kick-off');
    expect(f.componentInstance.form.getRawValue().agenda).toBe('Introductions');
  });

  it('create button is disabled when form invalid', () => {
    const f = setup({ create: vi.fn().mockReturnValue(of(makeMeeting())) });
    const btn = f.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(btn.disabled).toBe(true);
  });

  it('emits cancelled when cancel button clicked', () => {
    const f = setup({ create: vi.fn() });
    const spy = vi.fn();
    f.componentInstance.cancelled.subscribe(spy);
    f.debugElement.query(By.css('button[type="button"]')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('calls create() and emits saved on successful submit', async () => {
    const newMeeting = makeMeeting({ id: 2, title: 'Sprint' });
    const createMock = vi.fn().mockReturnValue(of(newMeeting));
    const f = setup({ create: createMock });
    const spy = vi.fn();
    f.componentInstance.saved.subscribe(spy);

    f.componentInstance.form.patchValue({ title: 'Sprint', date_time: '2026-07-02T10:00' });
    f.detectChanges();
    f.debugElement.query(By.css('button[type="submit"]')).nativeElement.click();

    expect(createMock).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(newMeeting);
  });

  it('calls update() in edit mode', () => {
    const updateMock = vi.fn().mockReturnValue(of(makeMeeting({ title: 'Updated' })));
    const f = setup({ update: updateMock }, makeMeeting());
    f.componentInstance.form.patchValue({ title: 'Updated', date_time: '2026-07-01T09:00' });
    f.detectChanges();
    f.debugElement.query(By.css('button[type="submit"]')).nativeElement.click();
    expect(updateMock).toHaveBeenCalledWith(5, 1, expect.objectContaining({ title: 'Updated' }));
  });
});
