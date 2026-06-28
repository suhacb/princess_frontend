import { describe, expect, it } from 'vitest';
import {
  AuditEntryApiResource,
  mapAuditEntry,
} from './audit-trail.contracts';

const ENTRY_API: AuditEntryApiResource = {
  id:           42,
  entity_type:  'task',
  entity_id:    7,
  entity_title: 'Write tests',
  event:        'updated',
  causer:       { id: 3, name: 'Alice' },
  occurred_at:  '2026-06-28T10:00:00Z',
  changes: {
    status: { old: 'open', new: 'closed' },
    title:  { old: 'Old title', new: 'Write tests' },
  },
};

describe('mapAuditEntry', () => {
  it('maps scalar fields correctly', () => {
    const result = mapAuditEntry(ENTRY_API);
    expect(result.id).toBe(42);
    expect(result.entityType).toBe('task');
    expect(result.entityId).toBe(7);
    expect(result.entityTitle).toBe('Write tests');
    expect(result.event).toBe('updated');
    expect(result.occurredAt).toBe('2026-06-28T10:00:00Z');
  });

  it('maps causer id and name', () => {
    const result = mapAuditEntry(ENTRY_API);
    expect(result.causerId).toBe(3);
    expect(result.causerName).toBe('Alice');
  });

  it('handles null causer (system events)', () => {
    const result = mapAuditEntry({ ...ENTRY_API, causer: null });
    expect(result.causerId).toBeNull();
    expect(result.causerName).toBeNull();
  });

  it('maps changes array from object', () => {
    const result = mapAuditEntry(ENTRY_API);
    expect(result.changes).toHaveLength(2);
    const statusChange = result.changes.find(c => c.field === 'status');
    expect(statusChange).toBeDefined();
    expect(statusChange!.oldValue).toBe('open');
    expect(statusChange!.newValue).toBe('closed');
  });

  it('maps empty changes object to empty array', () => {
    const result = mapAuditEntry({ ...ENTRY_API, changes: {} });
    expect(result.changes).toEqual([]);
  });

  it('maps created event with no changes', () => {
    const result = mapAuditEntry({ ...ENTRY_API, event: 'created', changes: {} });
    expect(result.event).toBe('created');
    expect(result.changes).toHaveLength(0);
  });

  it('maps deleted event', () => {
    const result = mapAuditEntry({ ...ENTRY_API, event: 'deleted', changes: {} });
    expect(result.event).toBe('deleted');
  });
});
