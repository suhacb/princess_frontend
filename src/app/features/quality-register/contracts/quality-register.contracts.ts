export type QualityMethod = 'review' | 'test' | 'audit' | 'inspection';
export type QualityResult = 'passed' | 'failed' | 'conditional';

export const QUALITY_METHOD_LABELS: Record<QualityMethod, string> = {
  review: 'Review',
  test: 'Test',
  audit: 'Audit',
  inspection: 'Inspection',
};

export const QUALITY_RESULT_LABELS: Record<QualityResult, string> = {
  passed: 'Passed',
  failed: 'Failed',
  conditional: 'Conditional',
};

export const QUALITY_METHODS: QualityMethod[] = ['review', 'test', 'audit', 'inspection'];
export const QUALITY_RESULTS: QualityResult[] = ['passed', 'failed', 'conditional'];

export interface QualitySignOffPerson {
  id: number;
  name: string;
}

export interface QualityEntryApiResource {
  id: number;
  project_id: number;
  stage_id: number | null;
  product_name: string;
  quality_method: QualityMethod;
  planned_date: string | null;
  actual_date: string | null;
  reviewers: number[] | null;
  result: QualityResult | null;
  issues_raised: string | null;
  sign_off_at: string | null;
  sign_off_by: QualitySignOffPerson | null;
  created_at: string;
  updated_at: string;
}

export interface QualityEntry {
  id: number;
  projectId: number;
  stageId: number | null;
  productName: string;
  qualityMethod: QualityMethod;
  plannedDate: string | null;
  actualDate: string | null;
  reviewers: number[] | null;
  result: QualityResult | null;
  issuesRaised: string | null;
  signOffAt: string | null;
  signOffBy: QualitySignOffPerson | null;
  createdAt: string;
}

export function mapQualityEntry(api: QualityEntryApiResource): QualityEntry {
  return {
    id: api.id,
    projectId: api.project_id,
    stageId: api.stage_id,
    productName: api.product_name,
    qualityMethod: api.quality_method,
    plannedDate: api.planned_date,
    actualDate: api.actual_date,
    reviewers: api.reviewers,
    result: api.result,
    issuesRaised: api.issues_raised,
    signOffAt: api.sign_off_at,
    signOffBy: api.sign_off_by,
    createdAt: api.created_at,
  };
}

export interface CreateQualityEntryPayload {
  product_name: string;
  quality_method: QualityMethod;
  planned_date?: string | null;
  stage_id?: number | null;
}

export interface UpdateQualityEntryPayload {
  product_name?: string;
  quality_method?: QualityMethod;
  planned_date?: string | null;
  actual_date?: string | null;
  result?: QualityResult | null;
  issues_raised?: string | null;
  sign_off_by?: number | null;
  sign_off_at?: string | null;
  stage_id?: number | null;
}
