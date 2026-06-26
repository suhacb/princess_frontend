import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { QualityListComponent } from './quality-list.component';
import { QualityRegisterService } from '../../services/quality-register.service';
import { ProjectService } from '../../../projects/services/project.service';
import { QualityEntry } from '../../contracts/quality-register.contracts';

const stubEntry: QualityEntry = {
  id: 1,
  projectId: 5,
  stageId: null,
  productName: 'User manual',
  qualityMethod: 'review',
  plannedDate: '2026-07-01',
  actualDate: null,
  reviewers: null,
  result: null,
  issuesRaised: null,
  signOffAt: null,
  signOffBy: null,
  createdAt: '2026-06-01T10:00:00Z',
};

const passedEntry: QualityEntry = {
  ...stubEntry,
  id: 2,
  productName: 'Spec document',
  qualityMethod: 'test',
  result: 'passed',
  signOffBy: { id: 10, name: 'Alice' },
};

function setup(entries: QualityEntry[] = []) {
  const entriesSignal = signal(entries);
  const qualityService = {
    entries: entriesSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(entries)),
    create: vi.fn().mockReturnValue(of(stubEntry)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [QualityListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: QualityRegisterService, useValue: qualityService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<QualityListComponent> = TestBed.createComponent(QualityListComponent);
  fixture.detectChanges();
  return { fixture, qualityService };
}

describe('QualityListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { qualityService } = setup();
    expect(qualityService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no entries', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders product name', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.textContent).toContain('User manual');
  });

  it('renders method label', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.textContent).toContain('Review');
  });

  it('renders pending badge when result is null', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.querySelector('.pending-badge')).toBeTruthy();
  });

  it('renders result chip when result is present', () => {
    const { fixture } = setup([passedEntry]);
    expect(fixture.nativeElement.querySelector('app-quality-result-chip')).toBeTruthy();
  });

  it('renders sign-off by name', () => {
    const { fixture } = setup([passedEntry]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders planned date', () => {
    const { fixture } = setup([stubEntry]);
    expect(fixture.nativeElement.textContent).toContain('2026');
  });

  it('filters by result', () => {
    const { fixture } = setup([stubEntry, passedEntry]);
    const comp = fixture.componentInstance as any;
    comp.resultFilter.set('passed');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.quality-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Spec document');
  });

  it('navigates to entry detail on row click', () => {
    const { fixture } = setup([stubEntry]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.quality-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/p', 5, 'quality', 1]);
  });
});
