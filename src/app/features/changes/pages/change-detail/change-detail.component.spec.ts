import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ChangeDetailComponent } from './change-detail.component';
import { ChangeService } from '../../services/change.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Change } from '../../contracts/change.contracts';

const stubChange: Change = {
  id: 1,
  projectId: 5,
  issueId: null,
  requestType: 'rfc',
  title: 'Add new field',
  description: 'Details here',
  impactAssessment: 'Low impact',
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

const approvedChange: Change = {
  ...stubChange,
  status: 'approved',
  decisionRationale: 'Looks good',
  decisionBy: { id: 20, name: 'Bob' },
  decisionAt: '2026-06-10T10:00:00Z',
};

const implementedChange: Change = { ...stubChange, status: 'implemented' };

function setup(change: Change | null = stubChange, loading = false) {
  const changeSignal = signal(change);
  const changeService = {
    selectedChange: changeSignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(change)),
    update: vi.fn().mockReturnValue(of(change)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    approve: vi.fn().mockReturnValue(of(approvedChange)),
    reject: vi.fn().mockReturnValue(of({ ...stubChange, status: 'rejected' })),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [ChangeDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([{ path: '**', component: ChangeDetailComponent }]),
      { provide: ChangeService, useValue: changeService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<ChangeDetailComponent> = TestBed.createComponent(ChangeDetailComponent);
  fixture.componentRef.setInput('changeId', '1');
  fixture.detectChanges();
  return { fixture, changeService };
}

describe('ChangeDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls load on init', () => {
    const { changeService } = setup();
    expect(changeService.load).toHaveBeenCalledWith(5, 1);
  });

  it('renders change title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Add new field');
  });

  it('renders type badge', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.type-badge--rfc')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-change-status-chip')).toBeTruthy();
  });

  it('renders raised by in meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('shows skeleton when loading and no change', () => {
    const { fixture } = setup(null, true);
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
  });

  it('shows Approve and Reject buttons for decidable status', () => {
    const { fixture } = setup();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.trim() === 'Approve')).toBeTruthy();
    expect(buttons.find(b => b.textContent?.trim() === 'Reject')).toBeTruthy();
  });

  it('hides Approve and Reject buttons for implemented status', () => {
    const { fixture } = setup(implementedChange);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.trim() === 'Approve')).toBeFalsy();
    expect(buttons.find(b => b.textContent?.trim() === 'Reject')).toBeFalsy();
  });

  it('shows decision rationale block for approved change', () => {
    const { fixture } = setup(approvedChange);
    expect(fixture.nativeElement.querySelector('.info-block--approved')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Looks good');
  });

  it('shows decision rationale block for rejected change', () => {
    const rejectedChange: Change = {
      ...stubChange,
      status: 'rejected',
      decisionRationale: 'Out of scope',
      decisionBy: { id: 20, name: 'Bob' },
      decisionAt: '2026-06-10T10:00:00Z',
    };
    const { fixture } = setup(rejectedChange);
    expect(fixture.nativeElement.querySelector('.info-block--rejected')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Out of scope');
  });

  it('renders decided by name in meta', () => {
    const { fixture } = setup(approvedChange);
    expect(fixture.nativeElement.textContent).toContain('Bob');
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
    const { fixture, changeService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Save');
    saveBtn?.click();
    expect(changeService.update).toHaveBeenCalledWith(5, 1, expect.any(Object));
  });

  it('renders back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back"]')).toBeTruthy();
  });

  it('calls remove on delete', () => {
    const { fixture, changeService } = setup();
    const comp = fixture.componentInstance as any;
    comp.deleteChange();
    expect(changeService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('shows load error when load fails', () => {
    const changeService = {
      selectedChange: signal<Change | null>(null).asReadonly(),
      loading: signal(false).asReadonly(),
      load: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      update: vi.fn(),
      remove: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn(),
    };
    const projectService = {
      selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
    };

    TestBed.configureTestingModule({
      imports: [ChangeDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([{ path: '**', component: ChangeDetailComponent }]),
        { provide: ChangeService, useValue: changeService },
        { provide: ProjectService, useValue: projectService },
      ],
    });

    const fixture: ComponentFixture<ChangeDetailComponent> = TestBed.createComponent(ChangeDetailComponent);
    fixture.componentRef.setInput('changeId', '1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeTruthy();
  });
});
