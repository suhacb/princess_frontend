export type RiskStatus = 'open' | 'mitigated' | 'closed' | 'materialised';
export type RiskProximity = 'imminent' | 'near' | 'distant';
export type RiskResponseType = 'avoid' | 'reduce' | 'transfer' | 'accept' | 'share' | 'exploit';

export const RISK_STATUS_LABELS: Record<RiskStatus, string> = {
  open: 'Open',
  mitigated: 'Mitigated',
  closed: 'Closed',
  materialised: 'Materialised',
};

export const RISK_PROXIMITY_LABELS: Record<RiskProximity, string> = {
  imminent: 'Imminent',
  near: 'Near',
  distant: 'Distant',
};

export const RISK_RESPONSE_TYPE_LABELS: Record<RiskResponseType, string> = {
  avoid: 'Avoid',
  reduce: 'Reduce',
  transfer: 'Transfer',
  accept: 'Accept',
  share: 'Share',
  exploit: 'Exploit',
};

export const RISK_STATUSES: RiskStatus[] = ['open', 'mitigated', 'closed', 'materialised'];
export const RISK_PROXIMITIES: RiskProximity[] = ['imminent', 'near', 'distant'];
export const RISK_RESPONSE_TYPES: RiskResponseType[] = [
  'avoid',
  'reduce',
  'transfer',
  'accept',
  'share',
  'exploit',
];
export const SCORE_LEVELS: number[] = [1, 2, 3, 4, 5];

export interface RiskOwner {
  id: number;
  name: string;
}

export interface RiskApiResource {
  id: number;
  project_id: number;
  stage_id: number | null;
  title: string;
  description: string | null;
  category: string | null;
  probability: number;
  impact: number;
  risk_score: number;
  proximity: RiskProximity;
  response_type: RiskResponseType;
  response_action: string | null;
  residual_probability: number | null;
  residual_impact: number | null;
  residual_risk_score: number | null;
  status: RiskStatus;
  raised_at: string | null;
  owner: RiskOwner | null;
  created_at: string;
  updated_at: string;
}

export interface Risk {
  id: number;
  projectId: number;
  stageId: number | null;
  title: string;
  description: string | null;
  category: string | null;
  probability: number;
  impact: number;
  riskScore: number;
  proximity: RiskProximity;
  responseType: RiskResponseType;
  responseAction: string | null;
  residualProbability: number | null;
  residualImpact: number | null;
  residualRiskScore: number | null;
  status: RiskStatus;
  raisedAt: string | null;
  owner: RiskOwner | null;
  createdAt: string;
}

export function mapRisk(api: RiskApiResource): Risk {
  return {
    id: api.id,
    projectId: api.project_id,
    stageId: api.stage_id,
    title: api.title,
    description: api.description,
    category: api.category,
    probability: api.probability,
    impact: api.impact,
    riskScore: api.risk_score,
    proximity: api.proximity,
    responseType: api.response_type,
    responseAction: api.response_action,
    residualProbability: api.residual_probability,
    residualImpact: api.residual_impact,
    residualRiskScore: api.residual_risk_score,
    status: api.status,
    raisedAt: api.raised_at,
    owner: api.owner,
    createdAt: api.created_at,
  };
}

export function riskScoreClass(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 16) return 'critical';
  if (score >= 10) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

export interface CreateRiskPayload {
  title: string;
  description?: string | null;
  category?: string | null;
  probability: number;
  impact: number;
  proximity: RiskProximity;
  risk_owner: number;
  response_type: RiskResponseType;
  response_action?: string | null;
  stage_id?: number | null;
}

export interface UpdateRiskPayload {
  title?: string;
  description?: string | null;
  category?: string | null;
  probability?: number;
  impact?: number;
  proximity?: RiskProximity;
  risk_owner?: number;
  response_type?: RiskResponseType;
  response_action?: string | null;
  residual_probability?: number | null;
  residual_impact?: number | null;
  status?: RiskStatus;
  stage_id?: number | null;
}
