import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { RiskListComponent } from './risk-list.component';
import { RiskService } from '../../services/risk.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Risk } from '../../contracts/risk.contracts';

const stubRisk: Risk = {
  id: 1,
  projectId: 5,
  stageId: null,
  title: 'Server outage',
  description: null,
  category: 'Technical',
  probability: 4,
  impact: 4,
  riskScore: 16,
  proximity: 'imminent',
  responseType: 'reduce',
  responseAction: null,
  residualProbability: null,
  residualImpact: null,
  residualRiskScore: null,
  status: 'open',
  raisedAt: '2026-06-01T10:00:00Z',
  owner: { id: 10, name: 'Alice' },
  createdAt: '2026-06-01T10:00:00Z',
};

const lowRisk: Risk = {
  ...stubRisk,
  id: 2,
  title: 'Minor delay',
  probability: 1,
  impact: 2,
  riskScore: 2,
  status: 'mitigated',
};

function setup(risks: Risk[] = []) {
  const risksSignal = signal(risks);
  const riskService = {
    risks: risksSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(risks)),
    create: vi.fn().mockReturnValue(of(stubRisk)),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [RiskListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: RiskService, useValue: riskService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<RiskListComponent> = TestBed.createComponent(RiskListComponent);
  fixture.detectChanges();
  return { fixture, riskService, memberService };
}

describe('RiskListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { riskService } = setup();
    expect(riskService.list).toHaveBeenCalledWith(5);
  });

  it('calls member list on init', () => {
    const { memberService } = setup();
    expect(memberService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no risks', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders risk title', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.textContent).toContain('Server outage');
  });

  it('renders score badge', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.querySelector('app-risk-score-badge')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.querySelector('app-risk-status-chip')).toBeTruthy();
  });

  it('renders category', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.textContent).toContain('Technical');
  });

  it('renders owner name', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders proximity label', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.textContent).toContain('Imminent');
  });

  it('renders response type label', () => {
    const { fixture } = setup([stubRisk]);
    expect(fixture.nativeElement.textContent).toContain('Reduce');
  });

  it('sorts by score descending by default (high before low)', () => {
    const { fixture } = setup([lowRisk, stubRisk]);
    const rows = fixture.nativeElement.querySelectorAll('.risk-row');
    expect(rows[0].textContent).toContain('Server outage');
    expect(rows[1].textContent).toContain('Minor delay');
  });

  it('filters by status', () => {
    const { fixture } = setup([stubRisk, lowRisk]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('mitigated');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.risk-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Minor delay');
  });

  it('switches sort to newest', () => {
    const { fixture } = setup([stubRisk]);
    const comp = fixture.componentInstance as any;
    comp.sortKey.set('raised_at');
    fixture.detectChanges();
    expect(comp.sortKey()).toBe('raised_at');
  });

  it('navigates to risk detail on row click', () => {
    const { fixture } = setup([stubRisk]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.risk-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/projects', 5, 'risks', 1]);
  });
});
