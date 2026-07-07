import { RequirementPriority, RequirementStatus, RequirementType } from '../../requirements/contracts/requirement.contracts';
import { TestScenarioType } from '../../test-scenarios/contracts/test-scenario.contracts';
import { TestCasePriority, TestCaseType } from '../../test-scenarios/contracts/test-case.contracts';
import { TestResultStatus } from '../../test-sessions/contracts/test-session-result.contracts';

export type TraceabilityDerivedStatus = 'not_tested' | 'partial' | 'covered' | 'failing';

export const TRACEABILITY_DERIVED_STATUS_LABELS: Record<TraceabilityDerivedStatus, string> = {
  not_tested: 'Not tested',
  partial: 'Partially covered',
  covered: 'Covered',
  failing: 'Failing',
};

export interface TraceabilityTestCaseApiResource {
  id: number;
  title: string;
  priority: TestCasePriority | null;
  type: TestCaseType | null;
}

export interface TraceabilityTestCase {
  id: number;
  title: string;
  priority: TestCasePriority | null;
  type: TestCaseType | null;
}

export function mapTraceabilityTestCase(api: TraceabilityTestCaseApiResource): TraceabilityTestCase {
  return {
    id: api.id,
    title: api.title,
    priority: api.priority,
    type: api.type,
  };
}

export interface TraceabilityScenarioApiResource {
  id: number;
  ref: string;
  title: string;
  type: TestScenarioType;
  is_testable: boolean;
  latest_supplier_result: TestResultStatus | null;
  latest_client_result: TestResultStatus | null;
  test_cases: TraceabilityTestCaseApiResource[];
}

export interface TraceabilityScenario {
  id: number;
  ref: string;
  title: string;
  type: TestScenarioType;
  isTestable: boolean;
  latestSupplierResult: TestResultStatus | null;
  latestClientResult: TestResultStatus | null;
  testCases: TraceabilityTestCase[];
}

export function mapTraceabilityScenario(api: TraceabilityScenarioApiResource): TraceabilityScenario {
  return {
    id: api.id,
    ref: api.ref,
    title: api.title,
    type: api.type,
    isTestable: api.is_testable,
    latestSupplierResult: api.latest_supplier_result,
    latestClientResult: api.latest_client_result,
    testCases: api.test_cases.map(mapTraceabilityTestCase),
  };
}

export interface TraceabilityAcApiResource {
  id: number;
  ref: string;
  description: string;
  supplier_passed: boolean;
  client_passed: boolean;
  accepted_at: string | null;
  test_scenarios: TraceabilityScenarioApiResource[];
}

export interface TraceabilityAc {
  id: number;
  ref: string;
  description: string;
  supplierPassed: boolean;
  clientPassed: boolean;
  acceptedAt: string | null;
  testScenarios: TraceabilityScenario[];
}

export function mapTraceabilityAc(api: TraceabilityAcApiResource): TraceabilityAc {
  return {
    id: api.id,
    ref: api.ref,
    description: api.description,
    supplierPassed: api.supplier_passed,
    clientPassed: api.client_passed,
    acceptedAt: api.accepted_at,
    testScenarios: api.test_scenarios.map(mapTraceabilityScenario),
  };
}

export interface TraceabilityUserStoryApiResource {
  id: number;
  ref: string;
  title: string;
  role: string | null;
  status: RequirementStatus;
  acceptance_criteria: TraceabilityAcApiResource[];
  derived_status: TraceabilityDerivedStatus;
}

export interface TraceabilityUserStory {
  id: number;
  ref: string;
  title: string;
  role: string | null;
  status: RequirementStatus;
  acceptanceCriteria: TraceabilityAc[];
  derivedStatus: TraceabilityDerivedStatus;
}

export function mapTraceabilityUserStory(api: TraceabilityUserStoryApiResource): TraceabilityUserStory {
  return {
    id: api.id,
    ref: api.ref,
    title: api.title,
    role: api.role,
    status: api.status,
    acceptanceCriteria: api.acceptance_criteria.map(mapTraceabilityAc),
    derivedStatus: api.derived_status,
  };
}

interface TraceabilityRequirementApiResourceBase {
  id: number;
  ref: string;
  type: RequirementType;
  title: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  derived_status: TraceabilityDerivedStatus;
}

export interface TraceabilityClassicRequirementApiResource extends TraceabilityRequirementApiResourceBase {
  type: 'classic';
  acceptance_criteria: TraceabilityAcApiResource[];
}

export interface TraceabilityEpicRequirementApiResource extends TraceabilityRequirementApiResourceBase {
  type: 'epic';
  user_stories: TraceabilityUserStoryApiResource[];
}

export type TraceabilityRequirementApiResource =
  | TraceabilityClassicRequirementApiResource
  | TraceabilityEpicRequirementApiResource;

interface TraceabilityRequirementBase {
  id: number;
  ref: string;
  type: RequirementType;
  title: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  derivedStatus: TraceabilityDerivedStatus;
}

export interface TraceabilityClassicRequirement extends TraceabilityRequirementBase {
  type: 'classic';
  acceptanceCriteria: TraceabilityAc[];
}

export interface TraceabilityEpicRequirement extends TraceabilityRequirementBase {
  type: 'epic';
  userStories: TraceabilityUserStory[];
}

export type TraceabilityRequirement = TraceabilityClassicRequirement | TraceabilityEpicRequirement;

export function mapTraceabilityRequirement(api: TraceabilityRequirementApiResource): TraceabilityRequirement {
  if (api.type === 'epic') {
    return {
      id: api.id,
      ref: api.ref,
      type: 'epic',
      title: api.title,
      priority: api.priority,
      status: api.status,
      derivedStatus: api.derived_status,
      userStories: api.user_stories.map(mapTraceabilityUserStory),
    };
  }

  return {
    id: api.id,
    ref: api.ref,
    type: 'classic',
    title: api.title,
    priority: api.priority,
    status: api.status,
    derivedStatus: api.derived_status,
    acceptanceCriteria: api.acceptance_criteria.map(mapTraceabilityAc),
  };
}

export interface TraceabilityStatsApiResource {
  acs_total: number;
  acs_with_test: number;
  acs_with_test_pct: number;
  test_cases_total: number;
  test_cases_passed: number;
  test_cases_passed_pct: number;
}

export interface TraceabilityStats {
  acsTotal: number;
  acsWithTest: number;
  acsWithTestPct: number;
  testCasesTotal: number;
  testCasesPassed: number;
  testCasesPassedPct: number;
}

export function mapTraceabilityStats(api: TraceabilityStatsApiResource): TraceabilityStats {
  return {
    acsTotal: api.acs_total,
    acsWithTest: api.acs_with_test,
    acsWithTestPct: api.acs_with_test_pct,
    testCasesTotal: api.test_cases_total,
    testCasesPassed: api.test_cases_passed,
    testCasesPassedPct: api.test_cases_passed_pct,
  };
}

export interface TraceabilityMatrixApiResource {
  data: TraceabilityRequirementApiResource[];
  stats: TraceabilityStatsApiResource;
}

export interface TraceabilityMatrix {
  requirements: TraceabilityRequirement[];
  stats: TraceabilityStats;
}

export function mapTraceabilityMatrix(api: TraceabilityMatrixApiResource): TraceabilityMatrix {
  return {
    requirements: api.data.map(mapTraceabilityRequirement),
    stats: mapTraceabilityStats(api.stats),
  };
}
