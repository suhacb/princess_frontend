import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ChangeListComponent } from './change-list.component';
import { ChangeService } from '../../services/change.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Change } from '../../contracts/change.contracts';

const stubChange: Change = {
  id: 1,
  projectId: 5,
  issueId: null,
  requestType: 'rfc',
  title: 'Add new field',
  description: null,
  impactAssessment: null,
  priority: 'high',
  status: 'proposed',
  raisedAt: '2026-06-01T10:00:00Z',
  decisionAt: null,
  decisionRationale: null,
  implementationDue: '2026-07-01',
  implementedAt: null,
  raisedBy: { id: 10, name: 'Alice' },
  decisionBy: null,
  createdAt: '2026-06-01T10:00:00Z',
};

const rejectedChange: Change = { ...stubChange, id: 2, title: 'Off-spec fix', status: 'rejected', requestType: 'off_spec' };

function setup(changes: Change[] = []) {
  const changesSignal = signal(changes);
  const changeService = {
    changes: changesSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(changes)),
    create: vi.fn().mockReturnValue(of(stubChange)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [ChangeListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: ChangeService, useValue: changeService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<ChangeListComponent> = TestBed.createComponent(ChangeListComponent);
  fixture.detectChanges();
  return { fixture, changeService };
}

describe('ChangeListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { changeService } = setup();
    expect(changeService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no changes', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders change title', () => {
    const { fixture } = setup([stubChange]);
    expect(fixture.nativeElement.textContent).toContain('Add new field');
  });

  it('renders type badge', () => {
    const { fixture } = setup([stubChange]);
    expect(fixture.nativeElement.querySelector('.type-badge--rfc')).toBeTruthy();
  });

  it('renders off_spec type badge', () => {
    const { fixture } = setup([rejectedChange]);
    expect(fixture.nativeElement.querySelector('.type-badge--off_spec')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup([stubChange]);
    expect(fixture.nativeElement.querySelector('app-change-status-chip')).toBeTruthy();
  });

  it('renders priority', () => {
    const { fixture } = setup([stubChange]);
    expect(fixture.nativeElement.textContent).toContain('high');
  });

  it('renders raised by name', () => {
    const { fixture } = setup([stubChange]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders implementation due date', () => {
    const { fixture } = setup([stubChange]);
    expect(fixture.nativeElement.textContent).toContain('2026');
  });

  it('filters by status', () => {
    const { fixture } = setup([stubChange, rejectedChange]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('rejected');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.change-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Off-spec fix');
  });

  it('navigates to change detail on row click', () => {
    const { fixture } = setup([stubChange]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.change-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/projects', 5, 'changes', 1]);
  });
});
