import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AcceptanceCriterionDetailPanelComponent } from './acceptance-criterion-detail-panel.component';
import { AcceptanceCriterionService } from '../../services/acceptance-criterion.service';
import { MemberService } from '../../../members/services/member.service';
import { AcceptanceCriterion } from '../../contracts/acceptance-criterion.contracts';

const stubCriterion: AcceptanceCriterion = {
  id: 1,
  projectId: 5,
  requirementId: 3,
  ref: 'AC-001',
  title: 'Login succeeds with valid SSO token',
  description: 'Full description',
  measurementMethod: null,
  acceptanceThreshold: null,
  verifier: null,
  verificationMethod: 'test',
  status: 'draft',
  version: 1,
  approvedBy: null,
  approvedAt: null,
  supplierPassed: true,
  supplierPassedAt: '2026-06-01T10:00:00Z',
  supplierDecision: 'pending',
  supplierDecidedBy: null,
  supplierDecidedAt: null,
  supplierDecisionNote: null,
  clientPassed: false,
  clientPassedAt: '2026-06-01T10:00:00Z',
  clientDecision: 'pending',
  clientDecidedBy: null,
  clientDecidedAt: null,
  clientDecisionNote: null,
  acceptedAt: null,
  requirement: { id: 3, ref: 'REQ-001', title: 'System must support SSO', type: 'classic' },
  createdAt: '2026-06-01T09:00:00Z',
  updatedAt: '2026-06-01T09:00:00Z',
};

function buildAcServiceMock(criterion: AcceptanceCriterion | null, loading = false) {
  const criterionSignal = signal(criterion);
  return {
    selectedCriterion: criterionSignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(criterion)),
    update: vi.fn().mockReturnValue(of(criterion)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    approve: vi.fn().mockReturnValue(of(criterion)),
    supplierDecision: vi.fn().mockReturnValue(of(criterion)),
    clientDecision: vi.fn().mockReturnValue(of(criterion)),
    listVersions: vi.fn().mockReturnValue(of({ versions: [], currentPage: 1, lastPage: 1, total: 0 })),
  };
}

function setup(criterion: AcceptanceCriterion | null = stubCriterion, loading = false) {
  const acService = buildAcServiceMock(criterion, loading);
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const dialogMock = { open: vi.fn() };

  TestBed.configureTestingModule({
    imports: [AcceptanceCriterionDetailPanelComponent, BrowserAnimationsModule],
    providers: [
      { provide: AcceptanceCriterionService, useValue: acService },
      { provide: MemberService, useValue: memberService },
      { provide: MatDialog, useValue: dialogMock },
    ],
  });

  const fixture: ComponentFixture<AcceptanceCriterionDetailPanelComponent> = TestBed.createComponent(
    AcceptanceCriterionDetailPanelComponent,
  );
  fixture.componentRef.setInput('projectId', 5);
  fixture.componentRef.setInput('criterionId', 1);
  fixture.detectChanges();
  return { fixture, acService, memberService, dialogMock };
}

describe('AcceptanceCriterionDetailPanelComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads the criterion on init', () => {
    const { acService } = setup();
    expect(acService.load).toHaveBeenCalledWith(5, 1);
  });

  it('renders the title and ref', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Login succeeds with valid SSO token');
    expect(fixture.nativeElement.textContent).toContain('AC-001');
  });

  it('shows a skeleton while loading with no criterion yet', () => {
    const { fixture } = setup(null, true);
    expect(fixture.nativeElement.querySelector('.panel__skeleton')).toBeTruthy();
  });

  it('shows the Approve button only when status is draft', () => {
    const { fixture } = setup({ ...stubCriterion, status: 'draft' });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Approve');
  });

  it('hides the Approve button when already approved', () => {
    const { fixture } = setup({ ...stubCriterion, status: 'approved' });
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.some(b => b.textContent?.trim() === 'Approve')).toBe(false);
  });

  it('shows the accepted banner when accepted_at is set', () => {
    const { fixture } = setup({ ...stubCriterion, acceptedAt: '2026-06-05T10:00:00Z' });
    expect(fixture.nativeElement.querySelector('.accepted-banner')).toBeTruthy();
  });

  it('shows supplier and client sign-off sections with the automated signal', () => {
    const { fixture } = setup();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Supplier');
    expect(text).toContain('Client');
    expect(text).toContain('Test: Passed');
    expect(text).toContain('Test: Failed');
  });

  it('opens the supplier decision dialog', () => {
    const { fixture, dialogMock } = setup();
    dialogMock.open.mockReturnValue({ afterClosed: () => of(undefined) });
    const comp = fixture.componentInstance as any;
    comp.openSupplierDecision();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('submits the supplier decision after the dialog closes with a payload', () => {
    const { fixture, acService, dialogMock } = setup();
    dialogMock.open.mockReturnValue({ afterClosed: () => of({ decision: 'accepted', note: null }) });
    const comp = fixture.componentInstance as any;
    comp.openSupplierDecision();
    expect(acService.supplierDecision).toHaveBeenCalledWith(5, 1, { decision: 'accepted', note: null });
  });

  it('submits the client decision after the dialog closes with a payload', () => {
    const { fixture, acService, dialogMock } = setup();
    dialogMock.open.mockReturnValue({ afterClosed: () => of({ decision: 'rejected', note: 'Regression found' }) });
    const comp = fixture.componentInstance as any;
    comp.openClientDecision();
    expect(acService.clientDecision).toHaveBeenCalledWith(5, 1, { decision: 'rejected', note: 'Regression found' });
  });

  it('does not submit a decision when the dialog is cancelled', () => {
    const { fixture, acService, dialogMock } = setup();
    dialogMock.open.mockReturnValue({ afterClosed: () => of(undefined) });
    const comp = fixture.componentInstance as any;
    comp.openClientDecision();
    expect(acService.clientDecision).not.toHaveBeenCalled();
  });

  it('Save button is disabled when the form is pristine', () => {
    const { fixture } = setup();
    const saveBtn = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (b: any) => b.textContent?.trim() === 'Save changes',
    ) as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(true);
  });

  it('calls update on save', () => {
    const { fixture, acService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    comp.save();
    expect(acService.update).toHaveBeenCalledWith(5, 1, expect.any(Object));
  });

  it('calls approve()', () => {
    const { fixture, acService } = setup();
    const comp = fixture.componentInstance as any;
    comp.approve();
    expect(acService.approve).toHaveBeenCalledWith(5, 1);
  });

  it('emits close on delete success', () => {
    const { fixture, acService } = setup();
    const comp = fixture.componentInstance as any;
    const closeSpy = vi.fn();
    comp.close.subscribe(closeSpy);
    comp.deleteCriterion();
    expect(acService.remove).toHaveBeenCalledWith(5, 1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('emits close on the close button click', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    const closeSpy = vi.fn();
    comp.close.subscribe(closeSpy);
    fixture.nativeElement.querySelector('.panel__close').click();
    expect(closeSpy).toHaveBeenCalled();
  });
});
