export const E2E_ROLES = {
  executive:         { externalId: 'e2e-executive',        username: 'e2e_executive',        givenName: 'E2E', familyName: 'Executive',       email: 'e2e.executive@princess.test' },
  senior_user:       { externalId: 'e2e-senior-user',      username: 'e2e_senior_user',      givenName: 'E2E', familyName: 'Senior User',      email: 'e2e.senior_user@princess.test' },
  senior_supplier:   { externalId: 'e2e-senior-supplier',  username: 'e2e_senior_supplier',  givenName: 'E2E', familyName: 'Senior Supplier',  email: 'e2e.senior_supplier@princess.test' },
  project_manager:   { externalId: 'e2e-project-manager',  username: 'e2e_project_manager',  givenName: 'E2E', familyName: 'Project Manager',  email: 'e2e.project_manager@princess.test' },
  project_assurance: { externalId: 'e2e-project-assurance',username: 'e2e_project_assurance',givenName: 'E2E', familyName: 'Assurance',        email: 'e2e.project_assurance@princess.test' },
  project_support:   { externalId: 'e2e-project-support',  username: 'e2e_project_support',  givenName: 'E2E', familyName: 'Support',          email: 'e2e.project_support@princess.test' },
  change_authority:  { externalId: 'e2e-change-authority', username: 'e2e_change_authority', givenName: 'E2E', familyName: 'Change Authority', email: 'e2e.change_authority@princess.test' },
  team_manager:      { externalId: 'e2e-team-manager',     username: 'e2e_team_manager',     givenName: 'E2E', familyName: 'Team Manager',     email: 'e2e.team_manager@princess.test' },
  team_member:       { externalId: 'e2e-team-member',      username: 'e2e_team_member',      givenName: 'E2E', familyName: 'Team Member',      email: 'e2e.team_member@princess.test' },
  observer:          { externalId: 'e2e-observer',         username: 'e2e_observer',         givenName: 'E2E', familyName: 'Observer',         email: 'e2e.observer@princess.test' },
  non_member:        { externalId: 'e2e-non-member',       username: 'e2e_non_member',       givenName: 'E2E', familyName: 'Non Member',       email: 'e2e.non_member@princess.test' },
} as const;

export type E2eRole = keyof typeof E2E_ROLES;

export function roleStateFile(role: E2eRole): string {
  return `e2e/.auth/${role}.json`;
}
