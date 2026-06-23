import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { DailyLogComponent } from './daily-log.component';
import { DailyLogService } from '../../services/daily-log.service';
import { ProjectService } from '../../../projects/services/project.service';
import { DailyLogEntry } from '../../contracts/daily-log.contracts';

const stubEntry: DailyLogEntry = {
  id: 1, projectId: 5, stageId: null,
  date: '2026-06-09', entryType: 'note', body: 'Test note',
  source: 'manual', author: { id: 10, name: 'Alice', jobTitle: null, organization: null },
  createdAt: '2026-06-09T10:00:00Z',
};

function setup(entries: DailyLogEntry[] = []) {
  const entriesSignal = signal(entries);
  const dailyLogService = {
    entries: entriesSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(entries)),
    create: vi.fn().mockReturnValue(of({ ...stubEntry, id: 2 })),
    update: vi.fn().mockReturnValue(of({ ...stubEntry, body: 'Updated' })),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [DailyLogComponent, BrowserAnimationsModule],
    providers: [
      { provide: DailyLogService, useValue: dailyLogService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<DailyLogComponent> = TestBed.createComponent(DailyLogComponent);
  fixture.detectChanges();
  return { fixture, dailyLogService };
}

describe('DailyLogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { dailyLogService } = setup();
    expect(dailyLogService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no entries', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders entry body', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.textContent).toContain('Test note');
  });

  it('renders author name', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders type badge', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.querySelector('.type-badge--note')).toBeTruthy();
  });

  it('shows date group header', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.querySelector('.group-date')).toBeTruthy();
  });

  it('toggles create form on New Entry click', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('.create-panel')).toBeNull();
    const newBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('New Entry'));
    newBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.create-panel')).toBeTruthy();
  });

  it('shows edit form when Edit clicked', () => {
    const { fixture } = setup([stubEntry]);
    const editBtn = fixture.nativeElement.querySelector('button[aria-label="Edit entry"]');
    editBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.entry-edit-panel')).toBeTruthy();
  });

  it('shows delete confirmation when Delete clicked', () => {
    const { fixture } = setup([stubEntry]);
    const deleteBtn = fixture.nativeElement.querySelector('button[aria-label="Delete entry"]');
    deleteBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Delete this entry?');
  });

  it('calls remove on confirm delete', () => {
    const { fixture, dailyLogService } = setup([stubEntry]);
    const comp = fixture.componentInstance as any;
    comp.pendingDeleteId.set(1);
    fixture.detectChanges();
    const confirmBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Yes, delete'));
    confirmBtn?.click();
    expect(dailyLogService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('calls update when edit form submitted', () => {
    const { fixture, dailyLogService } = setup([stubEntry]);
    const comp = fixture.componentInstance as any;
    comp.startEdit(stubEntry);
    comp.editForm.patchValue({ body: 'Updated body' });
    comp.editForm.markAsDirty();
    fixture.detectChanges();
    const saveBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Save');
    saveBtn?.click();
    expect(dailyLogService.update).toHaveBeenCalledWith(5, 1, expect.objectContaining({ body: 'Updated body' }));
  });

  it('groups entries by date', () => {
    const entry2 = { ...stubEntry, id: 2, date: '2026-06-08', body: 'Yesterday' };
    const { fixture } = setup([stubEntry, entry2]);
    const groups = fixture.nativeElement.querySelectorAll('.log-group');
    expect(groups.length).toBe(2);
  });

  it('groups same-date entries into one group', () => {
    const entry2 = { ...stubEntry, id: 2, body: 'Second entry' };
    const { fixture } = setup([stubEntry, entry2]);
    const groups = fixture.nativeElement.querySelectorAll('.log-group');
    expect(groups.length).toBe(1);
    expect(groups[0].querySelectorAll('.log-entry').length).toBe(2);
  });

  it('calls create when Add Entry submitted', () => {
    const { fixture, dailyLogService } = setup([]);
    const comp = fixture.componentInstance as any;
    comp.showCreateForm.set(true);
    comp.createForm.patchValue({ date: '2026-06-09', entry_type: 'action', body: 'Do something' });
    fixture.detectChanges();
    const addBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Add Entry'));
    addBtn?.click();
    expect(dailyLogService.create).toHaveBeenCalledWith(5, expect.objectContaining({ body: 'Do something', entry_type: 'action' }));
  });

  it('hides edit form when Cancel clicked', () => {
    const { fixture } = setup([stubEntry]);
    const editBtn = fixture.nativeElement.querySelector('button[aria-label="Edit entry"]');
    editBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.entry-edit-panel')).toBeTruthy();
    const cancelBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Cancel');
    cancelBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.entry-edit-panel')).toBeNull();
  });
});
