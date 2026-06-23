import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { RiskDetailComponent } from './risk-detail.component';
import { RiskService } from '../../services/risk.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Risk } from '../../contracts/risk.contracts';

const stubRisk: Risk = {
  id: 1,
  projectId: 5,
  stageId: null,
  title: 'Server outage',
  description: 'Risk description',
  category: 'Technical',
  probability: 3,
  impact: 4,
  riskScore: 12,
  proximity: 'near',
  responseType: 'reduce',
  responseAction: 'Add redundancy',
  residualProbability: 1,
  residualImpact: 2,
  residualRiskScore: 2,
  status: 'open',
  raisedAt: '2026-06-01T10:00:00Z',
  owner: { id: 10, name: 'Alice' },
  createdAt: '2026-06-01T10:00:00Z',
};

function setup(risk: Risk | null = stubRisk, loading = false) {
  const riskSignal = signal(risk);
  const riskService = {
    selectedRisk: riskSignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(risk)),
    update: vi.fn().mockReturnValue(of(risk)),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [RiskDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: RiskService, useValue: riskService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<RiskDetailComponent> = TestBed.createComponent(RiskDetailComponent);
  fixture.componentRef.setInput('riskId', '1');
  fixture.detectChanges();
  return { fixture, riskService, memberService };
}

describe('RiskDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders risk title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Server outage');
  });

  it('calls load on init', () => {
    const { riskService } = setup();
    expect(riskService.load).toHaveBeenCalledWith(5, 1);
  });

  it('shows skeleton when loading and no risk', () => {
    const { fixture } = setup(null, true);
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-risk-status-chip')).toBeTruthy();
  });

  it('renders score badge', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelectorAll('app-risk-score-badge').length).toBeGreaterThan(0);
  });

  it('renders owner name in meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('Save button is disabled when form is pristine', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn?.disabled).toBe(true);
  });

  it('Save button is enabled after form is dirtied', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn?.disabled).toBe(false);
  });

  it('calls update on save via button click', () => {
    const { fixture, riskService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    saveBtn?.click();
    expect(riskService.update).toHaveBeenCalledWith(5, 1, expect.any(Object));
  });

  it('renders back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back"]')).toBeTruthy();
  });

  it('calls remove on delete', () => {
    const { fixture, riskService } = setup();
    const comp = fixture.componentInstance as any;
    comp.deleteRisk();
    expect(riskService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('shows load error when load fails', () => {
    const riskSignal = signal<Risk | null>(null);
    const riskService = {
      selectedRisk: riskSignal.asReadonly(),
      loading: signal(false).asReadonly(),
      load: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      update: vi.fn(),
      remove: vi.fn(),
    };
    const memberService = {
      members: signal([]).asReadonly(),
      list: vi.fn().mockReturnValue(of([])),
    };
    const projectService = {
      selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
    };

    TestBed.configureTestingModule({
      imports: [RiskDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: RiskService, useValue: riskService },
        { provide: MemberService, useValue: memberService },
        { provide: ProjectService, useValue: projectService },
      ],
    });

    const fixture: ComponentFixture<RiskDetailComponent> = TestBed.createComponent(RiskDetailComponent);
    fixture.componentRef.setInput('riskId', '1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeTruthy();
  });

  it('residual score is displayed when both residual fields are set', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ residual_probability: 1, residual_impact: 2 });
    fixture.detectChanges();
    expect(comp.computedResidualScore()).toBe(2);
  });
});
