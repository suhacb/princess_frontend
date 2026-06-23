export type LessonSource = 'retrospective' | 'incident' | 'observation';

export const LESSON_SOURCE_LABELS: Record<LessonSource, string> = {
  retrospective: 'Retrospective',
  incident: 'Incident',
  observation: 'Observation',
};

export const LESSON_SOURCES: LessonSource[] = ['retrospective', 'incident', 'observation'];

export interface LessonRaisedBy {
  id: number;
  name: string;
}

export interface LessonApiResource {
  id: number;
  project_id: number;
  stage_id: number | null;
  category: string | null;
  description: string;
  recommendation: string | null;
  source: LessonSource;
  raised_by: LessonRaisedBy | null;
  raised_at: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  projectId: number;
  stageId: number | null;
  category: string | null;
  description: string;
  recommendation: string | null;
  source: LessonSource;
  raisedBy: LessonRaisedBy | null;
  raisedAt: string;
  createdAt: string;
}

export function mapLesson(api: LessonApiResource): Lesson {
  return {
    id: api.id,
    projectId: api.project_id,
    stageId: api.stage_id,
    category: api.category,
    description: api.description,
    recommendation: api.recommendation,
    source: api.source,
    raisedBy: api.raised_by,
    raisedAt: api.raised_at,
    createdAt: api.created_at,
  };
}

export interface CreateLessonPayload {
  description: string;
  source: LessonSource;
  category?: string | null;
  recommendation?: string | null;
  stage_id?: number | null;
}

export interface UpdateLessonPayload {
  description?: string;
  source?: LessonSource;
  category?: string | null;
  recommendation?: string | null;
  stage_id?: number | null;
}
