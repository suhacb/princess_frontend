import {
  mapDocument,
  mapDocumentVersion,
  formatFileSize,
  DOCUMENT_STATUS_TRANSITIONS,
  DOCUMENT_TYPE_LABELS,
  DocumentApiResource,
  DocumentVersionApiResource,
} from './document.contracts';

const stubVersionApi: DocumentVersionApiResource = {
  id: 12,
  document_id: 1,
  version_number: 3,
  file_name: 'brief_v3.docx',
  file_size_bytes: 204800,
  mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  comment: 'Updated scope section',
  created_by: { id: 5, name: 'Alice Smith' },
  created_at: '2026-06-28T10:00:00Z',
};

const stubDocApi: DocumentApiResource = {
  id: 1,
  project_id: 3,
  title: 'Project Brief',
  type: 'project_brief',
  type_label: 'Project Brief',
  category: 'initiation',
  category_label: 'Initiation',
  status: 'draft',
  tags: ['important', 'phase1'],
  owner: { id: 5, name: 'Alice Smith' },
  current_version: stubVersionApi,
  versions_count: 3,
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-28T10:00:00Z',
};

describe('mapDocumentVersion()', () => {
  it('maps all fields correctly', () => {
    const v = mapDocumentVersion(stubVersionApi);
    expect(v.id).toBe(12);
    expect(v.documentId).toBe(1);
    expect(v.versionNumber).toBe(3);
    expect(v.fileName).toBe('brief_v3.docx');
    expect(v.fileSize).toBe(204800);
    expect(v.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(v.comment).toBe('Updated scope section');
    expect(v.uploadedBy).toEqual({ id: 5, name: 'Alice Smith' });
    expect(v.uploadedAt).toBeInstanceOf(Date);
    expect(v.uploadedAt.toISOString()).toContain('2026-06-28');
  });

  it('maps null comment', () => {
    const v = mapDocumentVersion({ ...stubVersionApi, comment: null });
    expect(v.comment).toBeNull();
  });
});

describe('mapDocument()', () => {
  it('maps all fields correctly', () => {
    const d = mapDocument(stubDocApi);
    expect(d.id).toBe(1);
    expect(d.projectId).toBe(3);
    expect(d.title).toBe('Project Brief');
    expect(d.type).toBe('project_brief');
    expect(d.typeLabel).toBe('Project Brief');
    expect(d.category).toBe('initiation');
    expect(d.categoryLabel).toBe('Initiation');
    expect(d.status).toBe('draft');
    expect(d.tags).toEqual(['important', 'phase1']);
    expect(d.owner).toEqual({ id: 5, name: 'Alice Smith' });
    expect(d.versionCount).toBe(3);
    expect(d.createdAt).toBeInstanceOf(Date);
    expect(d.updatedAt).toBeInstanceOf(Date);
  });

  it('maps currentVersion correctly', () => {
    const d = mapDocument(stubDocApi);
    expect(d.currentVersion).not.toBeNull();
    expect(d.currentVersion!.id).toBe(12);
    expect(d.currentVersion!.documentId).toBe(1);
  });

  it('maps null currentVersion and null owner', () => {
    const d = mapDocument({ ...stubDocApi, current_version: null, owner: null });
    expect(d.currentVersion).toBeNull();
    expect(d.owner).toBeNull();
  });

  it('defaults tags to empty array when api returns undefined', () => {
    const d = mapDocument({ ...stubDocApi, tags: undefined as unknown as string[] });
    expect(d.tags).toEqual([]);
  });
});

describe('DOCUMENT_STATUS_TRANSITIONS', () => {
  it('draft can only move to in_review', () => {
    expect(DOCUMENT_STATUS_TRANSITIONS.draft).toEqual(['in_review']);
  });

  it('in_review can move to confirmed or back to draft', () => {
    expect(DOCUMENT_STATUS_TRANSITIONS.in_review).toContain('confirmed');
    expect(DOCUMENT_STATUS_TRANSITIONS.in_review).toContain('draft');
  });

  it('confirmed can only move to superseded', () => {
    expect(DOCUMENT_STATUS_TRANSITIONS.confirmed).toEqual(['superseded']);
  });

  it('superseded has no transitions', () => {
    expect(DOCUMENT_STATUS_TRANSITIONS.superseded).toHaveLength(0);
  });
});

describe('DOCUMENT_TYPE_LABELS', () => {
  it('contains label for project_brief', () => {
    expect(DOCUMENT_TYPE_LABELS['project_brief']).toBe('Project Brief');
  });

  it('contains label for risk_register', () => {
    expect(DOCUMENT_TYPE_LABELS['risk_register']).toBe('Risk Register');
  });

  it('contains label for general', () => {
    expect(DOCUMENT_TYPE_LABELS['general']).toBe('General');
  });

  it('contains label for lessons_report', () => {
    expect(DOCUMENT_TYPE_LABELS['lessons_report']).toBe('Lessons Report');
  });

  it('contains label for traceability_matrix', () => {
    expect(DOCUMENT_TYPE_LABELS['traceability_matrix']).toBe('Traceability Matrix');
  });

  it('contains all 28 types', () => {
    expect(Object.keys(DOCUMENT_TYPE_LABELS)).toHaveLength(28);
  });
});

describe('formatFileSize()', () => {
  it('formats bytes', () => { expect(formatFileSize(512)).toBe('512 B'); });
  it('formats KB', () => { expect(formatFileSize(2048)).toBe('2.0 KB'); });
  it('formats MB', () => { expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB'); });
});
