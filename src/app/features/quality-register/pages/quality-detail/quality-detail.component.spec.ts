import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { QualityDetailComponent } from './quality-detail.component';
import { QualityRegisterService } from '../../services/quality-register.service';
import { ProjectService } from '../../../projects/services/project.service';
import { MemberService } from '../../../members/services/member.service';
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
  result: 'passed',
  actualDate: '2026-07-05',
  signOffBy: { id: 10, name: 'Alice' },
  signOffAt: '2026-07-06T09:00:00Z',
};

function setup(entry: QualityEntry | null = stubEntry, loading = false) {
  const entrySignal = signal(entry);
  const qualityService = {
    selectedEntry: entrySignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(entry)),
    update: vi.fn().mockReturnValue(of(entry)),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };

  TestBed.configureTestingModule({
    imports: [QualityDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: QualityRegisterService, useValue: qualityService },
      { provide: ProjectService, useValue: projectService },
      { provide: MemberService, useValue: memberService },
    ],
  });

  const fixture: ComponentFixture<QualityDetailComponent> = TestBed.createComponent(QualityDetailComponent);
  fixture.componentRef.setInput('entryId', '1');
  fixture.detectChanges();
  return { fixture, qualityService };
}

describe('QualityDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls load on init', () => {
    const { qualityService } = setup();
    expect(qualityService.load).toHaveBeenCalledWith(5, 1);
  });

  it('renders product name', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('User manual');
  });

  it('renders method badge', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.method-badge')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.method-badge').textContent).toContain('Review');
  });

  it('renders result chip when result is present', () => {
    const { fixture } = setup(passedEntry);
    expect(fixture.nativeElement.querySelector('app-quality-result-chip')).toBeTruthy();
  });

  it('does not render result chip when result is null', () => {
    const { fixture } = setup(stubEntry);
    expect(fixture.nativeElement.querySelector('app-quality-result-chip')).toBeFalsy();
  });

  it('renders sign-off by in meta', () => {
    const { fixture } = setup(passedEntry);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders sign-off date in meta', () => {
    const { fixture } = setup(passedEntry);
    expect(fixture.nativeElement.textContent).toContain('2026');
  });

  it('shows skeleton when loading and no entry', () => {
    const { fixture } = setup(null, true);
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
  });

  it('renders back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back"]')).toBeTruthy();
  });

  it('Save button is disabled when form is pristine', () => {
    const { fixture } = setup();
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Save');
    expect(btn?.disabled).toBe(true);
  });

  it('Save button is enabled after form is dirtied', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Save');
    expect(saveBtn?.disabled).toBe(false);
  });

  it('calls update on save via button click', () => {
    const { fixture, qualityService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Save');
    saveBtn?.click();
    expect(qualityService.update).toHaveBeenCalledWith(5, 1, expect.any(Object));
  });

  it('calls remove on delete', () => {
    const { fixture, qualityService } = setup();
    const comp = fixture.componentInstance as any;
    comp.deleteEntry();
    expect(qualityService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('shows load error when load fails', () => {
    const qualityService = {
      selectedEntry: signal<QualityEntry | null>(null).asReadonly(),
      loading: signal(false).asReadonly(),
      load: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      update: vi.fn(),
      remove: vi.fn(),
    };
    const projectService = {
      selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
    };
    const memberService = {
      members: signal([]).asReadonly(),
      list: vi.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      imports: [QualityDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: QualityRegisterService, useValue: qualityService },
        { provide: ProjectService, useValue: projectService },
        { provide: MemberService, useValue: memberService },
      ],
    });

    const fixture: ComponentFixture<QualityDetailComponent> = TestBed.createComponent(QualityDetailComponent);
    fixture.componentRef.setInput('entryId', '1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeTruthy();
  });
});
