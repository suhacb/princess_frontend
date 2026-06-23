import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { BoundaryDetailComponent } from './boundary-detail.component';
import { BoundaryService } from '../../services/boundary.service';
import { ProjectService } from '../../../projects/services/project.service';
import { StageService } from '../../../stages/services/stage.service';
import { StageBoundary } from '../../contracts/boundary.contracts';

const stubBoundary: StageBoundary = {
  id: 1, stageId: 3, type: 'end_stage_report', status: 'draft',
  title: 'Q1 Close', notes: 'Some notes', nextStageId: null, exceptionSummary: null,
  submittedAt: null, submittedBy: null, approvedAt: null, approvedBy: null,
  createdBy: { id: 10, name: 'Alice' }, createdAt: '2026-01-01T00:00:00Z',
};

function setup(boundary: StageBoundary | null = stubBoundary) {
  const selectedBoundary = signal(boundary);
  const boundaryService = {
    selectedBoundary: selectedBoundary.asReadonly(),
    loading: signal(false).asReadonly(),
    load: vi.fn().mockReturnValue(of(boundary)),
    update: vi.fn().mockReturnValue(of(boundary)),
    submit: vi.fn().mockReturnValue(of({ ...boundary, status: 'submitted' })),
    approve: vi.fn().mockReturnValue(of({ ...boundary, status: 'approved' })),
    reject: vi.fn().mockReturnValue(of({ ...boundary, status: 'rejected' })),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test Project' } as never).asReadonly(),
  };
  const stageService = {
    stages: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };

  TestBed.configureTestingModule({
    imports: [BoundaryDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: BoundaryService, useValue: boundaryService },
      { provide: ProjectService, useValue: projectService },
      { provide: StageService, useValue: stageService },
    ],
  });

  const fixture: ComponentFixture<BoundaryDetailComponent> = TestBed.createComponent(BoundaryDetailComponent);
  fixture.componentRef.setInput('stageId', '3');
  fixture.componentRef.setInput('boundaryId', '1');
  fixture.detectChanges();
  return { fixture, boundaryService, stageService };
}

describe('BoundaryDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls load on init', () => {
    const { boundaryService } = setup();
    expect(boundaryService.load).toHaveBeenCalledWith(5, 3, 1);
  });

  it('renders type label', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('End Stage Report');
  });

  it('renders boundary title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Q1 Close');
  });

  it('shows created by meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('shows submit button for draft', () => {
    const { fixture } = setup();
    const btn = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn).toBeTruthy();
  });

  it('shows status chip', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-boundary-status-chip')).toBeTruthy();
  });

  it('shows back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back to stage"]')).toBeTruthy();
  });
});
