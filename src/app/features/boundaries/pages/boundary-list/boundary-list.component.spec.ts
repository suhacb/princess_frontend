import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { BoundaryListComponent } from './boundary-list.component';
import { BoundaryService } from '../../services/boundary.service';
import { ProjectService } from '../../../projects/services/project.service';
import { StageBoundary } from '../../contracts/boundary.contracts';

const stubBoundary: StageBoundary = {
  id: 1, stageId: 3, type: 'end_stage_report', status: 'draft',
  title: 'Q1 Close', notes: null, nextStageId: null, exceptionSummary: null,
  submittedAt: null, submittedBy: null, approvedAt: null, approvedBy: null,
  createdBy: { id: 10, name: 'Alice' }, createdAt: '2026-01-01T00:00:00Z',
};

function setup(boundaries: StageBoundary[] = []) {
  const boundariesSignal = signal(boundaries);
  const boundaryService = {
    boundaries: boundariesSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(boundaries)),
    create: vi.fn().mockReturnValue(of(stubBoundary)),
  };
  const projectService = {
    selectedProject: signal({ id: 5 } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [BoundaryListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: BoundaryService, useValue: boundaryService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<BoundaryListComponent> = TestBed.createComponent(BoundaryListComponent);
  fixture.componentRef.setInput('projectId', 5);
  fixture.componentRef.setInput('stageId', 3);
  fixture.detectChanges();
  return { fixture, boundaryService };
}

describe('BoundaryListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { boundaryService } = setup();
    expect(boundaryService.list).toHaveBeenCalledWith(5, 3);
  });

  it('shows empty state when no boundaries', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders boundary cards', () => {
    const { fixture } = setup([stubBoundary]);
    expect(fixture.nativeElement.querySelector('.boundary-card')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Q1 Close');
  });

  it('shows type badge', () => {
    const { fixture } = setup([stubBoundary]);
    expect(fixture.nativeElement.querySelector('.type-badge--end_stage_report')).toBeTruthy();
  });

  it('shows status chip', () => {
    const { fixture } = setup([stubBoundary]);
    expect(fixture.nativeElement.querySelector('app-boundary-status-chip')).toBeTruthy();
  });

  it('shows created by info', () => {
    const { fixture } = setup([stubBoundary]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });
});
