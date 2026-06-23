import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CreateProjectDialogComponent } from './create-project-dialog.component';
import { ProjectService } from '../../services/project.service';
import { environment } from '../../../../../environments/environment';

describe('CreateProjectDialogComponent', () => {
  let fixture: ComponentFixture<CreateProjectDialogComponent>;
  let component: CreateProjectDialogComponent;
  let mockDialogRef: { close: ReturnType<typeof vi.fn> };
  let mockProjectService: { create: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockDialogRef = { close: vi.fn() };
    mockProjectService = { create: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CreateProjectDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ProjectService, useValue: mockProjectService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('renders the stepper with 3 steps', () => {
    const steps = fixture.nativeElement.querySelectorAll('.mat-step-header');
    expect(steps.length).toBe(3);
  });

  it('basicForm is invalid when name and reference are empty', () => {
    expect(component['basicForm'].invalid).toBe(true);
  });

  it('basicForm is valid when name and reference are filled', () => {
    component['basicForm'].setValue({ name: 'Alpha', reference: 'PROJ-001' });
    expect(component['basicForm'].valid).toBe(true);
  });

  it('submit() does nothing when basicForm is invalid', () => {
    component['submit']();
    expect(mockProjectService.create).not.toHaveBeenCalled();
  });

  it('submit() calls projectService.create with correct payload', () => {
    mockProjectService.create.mockReturnValue(of({ id: 1, name: 'Alpha' }));
    component['basicForm'].setValue({ name: 'Alpha', reference: 'PROJ-001' });
    component['submit']();
    expect(mockProjectService.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alpha', reference: 'PROJ-001' })
    );
  });

  it('closes the dialog with the created project on success', () => {
    const project = { id: 1, name: 'Alpha' };
    mockProjectService.create.mockReturnValue(of(project));
    component['basicForm'].setValue({ name: 'Alpha', reference: 'PROJ-001' });
    component['submit']();
    expect(mockDialogRef.close).toHaveBeenCalledWith(project);
  });

  it('sets error signal on create failure', () => {
    mockProjectService.create.mockReturnValue(throwError(() => new Error('fail')));
    component['basicForm'].setValue({ name: 'Alpha', reference: 'PROJ-001' });
    component['submit']();
    expect(component['error']()).not.toBeNull();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
