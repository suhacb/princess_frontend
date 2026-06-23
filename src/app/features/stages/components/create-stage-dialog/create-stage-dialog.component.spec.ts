import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CreateStageDialogComponent, CreateStageDialogData } from './create-stage-dialog.component';
import { StageService } from '../../services/stage.service';
import { ProjectTolerances } from '../../../projects/contracts/project.contracts';

const projectTolerances: ProjectTolerances = {
  time: { min: -5, max: 10 },
  cost: { min: -500, max: 1000 },
  scope: 'No scope creep',
  risk: null,
  quality: null,
  benefit: null,
};

const dialogData: CreateStageDialogData = { projectId: 10, projectTolerances };

type AnyComponent = Record<string, unknown>;

function setup(): {
  fixture: ComponentFixture<CreateStageDialogComponent>;
  component: CreateStageDialogComponent;
  stageService: { create: ReturnType<typeof vi.fn> };
  dialogRef: { close: ReturnType<typeof vi.fn> };
} {
  const stageService = { create: vi.fn() };
  const dialogRef = { close: vi.fn() };

  TestBed.configureTestingModule({
    imports: [CreateStageDialogComponent, ReactiveFormsModule, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: StageService, useValue: stageService },
    ],
  });

  const fixture = TestBed.createComponent(CreateStageDialogComponent);
  fixture.detectChanges();
  return { fixture, component: fixture.componentInstance, stageService, dialogRef };
}

describe('CreateStageDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('pre-fills tolerances from project tolerances', () => {
    const { component } = setup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = (component as any)['tolerancesForm'];
    expect(form.getRawValue().time_min).toBe(-5);
    expect(form.getRawValue().time_max).toBe(10);
    expect(form.getRawValue().scope).toBe('No scope creep');
  });

  it('disables Continue when name is empty', () => {
    const { fixture } = setup();
    const el = fixture.nativeElement as HTMLElement;
    const continueBtn = el.querySelector<HTMLButtonElement>('button[matStepperNext]');
    expect(continueBtn?.disabled).toBe(true);
  });

  it('calls stageService.create on submit and closes dialog', () => {
    const { component, stageService, dialogRef } = setup();
    const stubStage = { id: 1, name: 'New Stage' };
    stageService.create.mockReturnValue(of(stubStage));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = component as any;
    c['basicForm'].setValue({
      name: 'New Stage',
      type: 'initiation',
      planned_start_date: '',
      planned_end_date: '',
    });
    c['submit']();

    expect(stageService.create).toHaveBeenCalledWith(10, expect.objectContaining({ name: 'New Stage', type: 'initiation' }));
    expect(dialogRef.close).toHaveBeenCalledWith(stubStage);
  });

  it('sets error signal on create failure', () => {
    const { component, stageService } = setup();
    stageService.create.mockReturnValue(throwError(() => new Error('Server error')));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = component as any;
    c['basicForm'].setValue({
      name: 'New Stage',
      type: 'delivery',
      planned_start_date: '',
      planned_end_date: '',
    });
    c['submit']();

    expect(component['error']()).toBeTruthy();
    expect(component['submitting']()).toBe(false);
  });
});
