export type ProjectRole =
  | 'executive'
  | 'senior_user'
  | 'senior_supplier'
  | 'project_manager'
  | 'project_assurance'
  | 'project_support'
  | 'change_authority'
  | 'team_manager'
  | 'team_member'
  | 'observer';

export type PersonSide = 'customer' | 'supplier' | 'neutral';
export type RoleGroup = 'board' | 'management' | 'assurance' | 'change' | 'team' | 'observer';

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  executive: 'Executive',
  senior_user: 'Senior User',
  senior_supplier: 'Senior Supplier',
  project_manager: 'Project Manager',
  project_assurance: 'Project Assurance',
  project_support: 'Project Support',
  change_authority: 'Change Authority',
  team_manager: 'Team Manager',
  team_member: 'Team Member',
  observer: 'Observer',
};

export const PROJECT_ROLES: ProjectRole[] = [
  'executive',
  'senior_user',
  'senior_supplier',
  'project_manager',
  'project_assurance',
  'project_support',
  'change_authority',
  'team_manager',
  'team_member',
  'observer',
];

export const PERSON_SIDE_LABELS: Record<PersonSide, string> = {
  customer: 'Customer',
  supplier: 'Supplier',
  neutral: 'Neutral',
};

export const PERSON_SIDES: PersonSide[] = ['customer', 'supplier', 'neutral'];

export const ROLE_GROUP: Record<ProjectRole, RoleGroup> = {
  executive: 'board',
  senior_user: 'board',
  senior_supplier: 'board',
  project_manager: 'management',
  project_assurance: 'assurance',
  project_support: 'assurance',
  change_authority: 'change',
  team_manager: 'team',
  team_member: 'team',
  observer: 'observer',
};

export interface PersonApiResource {
  id: number;
  name: string;
  email: string | null;
  job_title: string | null;
  organization: string | null;
}

export interface MemberApiResource {
  id: number;
  person: PersonApiResource;
  role: ProjectRole;
  side: PersonSide | null;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: number;
  name: string;
  email: string | null;
  jobTitle: string | null;
  organization: string | null;
}

export interface Member {
  id: number;
  person: Person;
  role: ProjectRole;
  side: PersonSide | null;
  createdAt: string;
}

export function mapPerson(api: PersonApiResource): Person {
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    jobTitle: api.job_title,
    organization: api.organization,
  };
}

export function mapMember(api: MemberApiResource): Member {
  return {
    id: api.id,
    person: mapPerson(api.person),
    role: api.role,
    side: api.side,
    createdAt: api.created_at,
  };
}

export interface UpdateMemberPayload {
  role?: ProjectRole;
  side?: PersonSide | null;
}
