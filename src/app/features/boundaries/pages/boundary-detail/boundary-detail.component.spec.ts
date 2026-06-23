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

const submittedBoundary: StageBoundary = { ...stubBoundary, status: 'submitted' };

function setup(boundary: StageBoundary | null = stubBoundary) {
  const selectedBoundary = signal(boundary);
  const boundaryService = {
    selectedBoundary: selectedBoundary.asReadonly(),
    loading: signal(false).asReadonly(),
    load: vi.fn().mockReturnValue(of(boundary)),
    update: vi.fn().mockReturnValue(of(boundary)),
    submit: vi.fn().mockReturnValue(of(submittedBoundary)),
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

  it('renders boundary title in form', () => {
    const { fixture } = setup();
    const titleInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formcontrolname="title"]') ?? fixture.nativeElement.querySelector('input');
    expect(titleInput?.value).toBe('Q1 Close');
  });

  it('shows created by meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('shows submit button for draft', () => {
    const { fixture } = setup();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.textContent?.includes('Submit'));
    expect(submitBtn).toBeTruthy();
  });

  it('shows status chip', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-boundary-status-chip')).toBeTruthy();
  });

  it('shows back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back to stage"]')).toBeTruthy();
  });

  it('calls submit on Submit button click', () => {
    const { fixture, boundaryService } = setup();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.textContent?.includes('Submit for Approval'));
    submitBtn?.click();
    expect(boundaryService.submit).toHaveBeenCalledWith(5, 3, 1);
  });

  it('calls update on Save Changes click', () => {
    const { fixture, boundaryService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'New Title' });
    comp.form.markAsDirty();
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const saveBtn = buttons.find(b => b.textContent?.includes('Save Changes'));
    saveBtn?.click();
    expect(boundaryService.update).toHaveBeenCalled();
  });

  it('shows approve and reject buttons for submitted boundary', () => {
    const { fixture } = setup(submittedBoundary);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.includes('Approve'))).toBeTruthy();
    expect(buttons.find(b => b.textContent?.includes('Reject'))).toBeTruthy();
  });

  it('calls approve when Approve clicked', () => {
    const { fixture, boundaryService } = setup(submittedBoundary);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const approveBtn = buttons.find(b => b.textContent?.includes('Approve') && !b.textContent?.includes('Reject'));
    approveBtn?.click();
    expect(boundaryService.approve).toHaveBeenCalledWith(5, 3, 1);
  });

  it('does not show submit/save buttons for submitted boundary', () => {
    const { fixture } = setup(submittedBoundary);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.includes('Submit for Approval'))).toBeFalsy();
    expect(buttons.find(b => b.textContent?.includes('Save Changes'))).toBeFalsy();
  });
});
