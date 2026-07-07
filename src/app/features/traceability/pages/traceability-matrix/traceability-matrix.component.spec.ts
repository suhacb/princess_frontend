import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { TraceabilityMatrixComponent } from './traceability-matrix.component';
import { TraceabilityService } from '../../services/traceability.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TraceabilityMatrix } from '../../contracts/traceability.contracts';

const stubMatrix: TraceabilityMatrix = {
  requirements: [
    {
      id: 1,
      ref: 'REQ-001',
      type: 'classic',
      title: 'Users can authenticate',
      priority: 'must',
      status: 'approved',
      derivedStatus: 'partial',
      acceptanceCriteria: [
        {
          id: 1,
          ref: 'AC-001',
          description: 'User is redirected to dashboard',
          supplierPassed: true,
          clientPassed: false,
          acceptedAt: null,
          testScenarios: [
            {
              id: 1,
              ref: 'TS-001',
              title: 'Login flow',
              type: 'feature',
              isTestable: true,
              latestSupplierResult: 'pass',
              latestClientResult: null,
              testCases: [{ id: 1, title: 'Valid login', priority: 'high', type: 'positive' }],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      ref: 'REQ-002',
      type: 'epic',
      title: 'Account management',
      priority: 'should',
      status: 'draft',
      derivedStatus: 'not_tested',
      userStories: [
        {
          id: 3,
          ref: 'REQ-003',
          title: 'As a user I can reset my password',
          role: 'user',
          status: 'draft',
          derivedStatus: 'not_tested',
          acceptanceCriteria: [],
        },
      ],
    },
  ],
  stats: {
    acsTotal: 1,
    acsWithTest: 1,
    acsWithTestPct: 100,
    testCasesTotal: 1,
    testCasesPassed: 1,
    testCasesPassedPct: 100,
  },
};

function setup(matrix: TraceabilityMatrix | null = stubMatrix) {
  const traceabilityService = {
    matrix: signal(matrix).asReadonly(),
    loading: signal(false).asReadonly(),
    load: vi.fn().mockReturnValue(of(matrix)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [TraceabilityMatrixComponent, BrowserAnimationsModule],
    providers: [
      { provide: TraceabilityService, useValue: traceabilityService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<TraceabilityMatrixComponent> = TestBed.createComponent(TraceabilityMatrixComponent);
  fixture.detectChanges();
  return { fixture, traceabilityService };
}

describe('TraceabilityMatrixComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads the matrix for the selected project on init', () => {
    const { traceabilityService } = setup();
    expect(traceabilityService.load).toHaveBeenCalledWith(5);
  });

  it('renders both classic requirements and epics', () => {
    const { fixture } = setup();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('REQ-001');
    expect(text).toContain('REQ-002');
  });

  it('renders the coverage stats bar', () => {
    const { fixture } = setup();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('100%');
    expect(text).toContain('AC design coverage');
    expect(text).toContain('Test case pass rate');
  });

  it('expands a requirement row to reveal its acceptance criteria', () => {
    const { fixture } = setup();
    const component = fixture.componentInstance;
    expect(component['isExpanded']('req-1')).toBe(false);
    component['toggle']('req-1');
    fixture.detectChanges();
    expect(component['isExpanded']('req-1')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('AC-001');
  });

  it('filters requirements by derived status', () => {
    const { fixture } = setup();
    const component = fixture.componentInstance;
    component['statusFilter'].set('partial');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('REQ-001');
    expect(text).not.toContain('REQ-002');
  });

  it('filters requirements by search term matching a nested scenario', () => {
    const { fixture } = setup();
    const component = fixture.componentInstance;
    component['search'].set('Login flow');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('REQ-001');
    expect(text).not.toContain('REQ-002');
  });

  it('shows an empty state when there are no requirements', () => {
    const { fixture } = setup({ requirements: [], stats: stubMatrix.stats });
    expect(fixture.nativeElement.textContent).toContain('No requirements to trace yet');
  });
});
