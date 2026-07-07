import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { LessonDetailComponent } from './lesson-detail.component';
import { LessonService } from '../../services/lesson.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Lesson } from '../../contracts/lesson.contracts';

const stubLesson: Lesson = {
  id: 1,
  projectId: 5,
  stageId: null,
  category: 'Planning',
  description: 'Estimations were too optimistic',
  recommendation: 'Use three-point estimation',
  source: 'retrospective',
  raisedBy: { id: 10, name: 'Alice' },
  raisedAt: '2026-06-01T10:00:00Z',
  createdAt: '2026-06-01T10:00:00Z',
};

const incidentLesson: Lesson = {
  ...stubLesson,
  source: 'incident',
  category: null,
};

function setup(lesson: Lesson | null = stubLesson, loading = false) {
  const lessonSignal = signal(lesson);
  const lessonService = {
    selectedLesson: lessonSignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(lesson)),
    update: vi.fn().mockReturnValue(of(lesson)),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [LessonDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([{ path: '**', component: LessonDetailComponent }]),
      { provide: LessonService, useValue: lessonService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<LessonDetailComponent> = TestBed.createComponent(LessonDetailComponent);
  fixture.componentRef.setInput('lessonId', '1');
  fixture.detectChanges();
  return { fixture, lessonService };
}

describe('LessonDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls load on init', () => {
    const { lessonService } = setup();
    expect(lessonService.load).toHaveBeenCalledWith(5, 1);
  });

  it('renders description', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Estimations were too optimistic');
  });

  it('renders source badge', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.source-badge--retrospective')).toBeTruthy();
  });

  it('renders incident source badge', () => {
    const { fixture } = setup(incidentLesson);
    expect(fixture.nativeElement.querySelector('.source-badge--incident')).toBeTruthy();
  });

  it('renders observation source badge', () => {
    const observationLesson: Lesson = { ...stubLesson, source: 'observation' };
    const { fixture } = setup(observationLesson);
    expect(fixture.nativeElement.querySelector('.source-badge--observation')).toBeTruthy();
  });

  it('renders category label', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Planning');
  });

  it('renders raised by in meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders raised at date in meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('2026');
  });

  it('shows skeleton when loading and no lesson', () => {
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
    const { fixture, lessonService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Save');
    saveBtn?.click();
    expect(lessonService.update).toHaveBeenCalledWith(5, 1, expect.any(Object));
  });

  it('calls remove on delete', () => {
    const { fixture, lessonService } = setup();
    const comp = fixture.componentInstance as any;
    comp.deleteLesson();
    expect(lessonService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('shows load error when load fails', () => {
    const lessonService = {
      selectedLesson: signal<Lesson | null>(null).asReadonly(),
      loading: signal(false).asReadonly(),
      load: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      update: vi.fn(),
      remove: vi.fn(),
    };
    const projectService = {
      selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
    };

    TestBed.configureTestingModule({
      imports: [LessonDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([{ path: '**', component: LessonDetailComponent }]),
        { provide: LessonService, useValue: lessonService },
        { provide: ProjectService, useValue: projectService },
      ],
    });

    const fixture: ComponentFixture<LessonDetailComponent> = TestBed.createComponent(LessonDetailComponent);
    fixture.componentRef.setInput('lessonId', '1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeTruthy();
  });
});
