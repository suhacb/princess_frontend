import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { LessonListComponent } from './lesson-list.component';
import { LessonService } from '../../services/lesson.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Lesson } from '../../contracts/lesson.contracts';

const stubLesson: Lesson = {
  id: 1,
  projectId: 5,
  stageId: null,
  category: 'Planning',
  description: 'Estimations were too optimistic',
  recommendation: null,
  source: 'retrospective',
  raisedBy: { id: 10, name: 'Alice' },
  raisedAt: '2026-06-01T10:00:00Z',
  createdAt: '2026-06-01T10:00:00Z',
};

const incidentLesson: Lesson = {
  ...stubLesson,
  id: 2,
  description: 'Server outage during demo',
  source: 'incident',
  category: null,
  raisedBy: { id: 20, name: 'Bob' },
};

function setup(lessons: Lesson[] = []) {
  const lessonsSignal = signal(lessons);
  const lessonService = {
    lessons: lessonsSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(lessons)),
    create: vi.fn().mockReturnValue(of(stubLesson)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [LessonListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: LessonService, useValue: lessonService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<LessonListComponent> = TestBed.createComponent(LessonListComponent);
  fixture.detectChanges();
  return { fixture, lessonService };
}

describe('LessonListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { lessonService } = setup();
    expect(lessonService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no lessons', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders description', () => {
    const { fixture } = setup([stubLesson]);
    expect(fixture.nativeElement.textContent).toContain('Estimations were too optimistic');
  });

  it('renders source badge', () => {
    const { fixture } = setup([stubLesson]);
    expect(fixture.nativeElement.querySelector('.source-badge--retrospective')).toBeTruthy();
  });

  it('renders incident source badge', () => {
    const { fixture } = setup([incidentLesson]);
    expect(fixture.nativeElement.querySelector('.source-badge--incident')).toBeTruthy();
  });

  it('renders category', () => {
    const { fixture } = setup([stubLesson]);
    expect(fixture.nativeElement.textContent).toContain('Planning');
  });

  it('renders raised by name', () => {
    const { fixture } = setup([stubLesson]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders raised at date', () => {
    const { fixture } = setup([stubLesson]);
    expect(fixture.nativeElement.textContent).toContain('2026');
  });

  it('filters by source', () => {
    const { fixture } = setup([stubLesson, incidentLesson]);
    const comp = fixture.componentInstance as any;
    comp.sourceFilter.set('incident');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.lesson-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Server outage during demo');
  });

  it('navigates to lesson detail on row click', () => {
    const { fixture } = setup([stubLesson]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.lesson-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/projects', 5, 'lessons', 1]);
  });
});
