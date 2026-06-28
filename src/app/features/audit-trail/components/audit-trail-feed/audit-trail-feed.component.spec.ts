import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuditTrailFeedComponent } from './audit-trail-feed.component';
import { AuditTrailService } from '../../services/audit-trail.service';
import type { AuditEntry, AuditTrailMeta } from '../../contracts/audit-trail.contracts';
import { signal } from '@angular/core';

function makeEntry(overrides: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id: 1, entityType: 'task', entityId: 5, entityTitle: 'Task A',
    event: 'created', causerName: 'Alice', causerId: 3,
    occurredAt: '2026-06-28T10:00:00Z', changes: [],
    ...overrides,
  };
}

function makeMeta(overrides: Partial<AuditTrailMeta> = {}): AuditTrailMeta {
  return { current_page: 1, last_page: 1, per_page: 25, total: 1, ...overrides };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(svcMock: any) {
  TestBed.configureTestingModule({
    imports: [AuditTrailFeedComponent, BrowserAnimationsModule],
    providers: [{ provide: AuditTrailService, useValue: svcMock }],
  });
  const fixture = TestBed.createComponent(AuditTrailFeedComponent);
  fixture.componentRef.setInput('projectId', 5);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => TestBed.resetTestingModule());

describe('AuditTrailFeedComponent', () => {
  it('renders an entry title in the feed', () => {
    const svc = {
      entries: signal([makeEntry({ entityTitle: 'Task A' })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('Task A');
  });

  it('renders event chip with correct event type', () => {
    const svc = {
      entries: signal([makeEntry({ event: 'deleted' })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    const chip = f.debugElement.query(By.css('.atf__event-chip--deleted'));
    expect(chip).not.toBeNull();
    expect(chip.nativeElement.textContent.trim()).toBe('deleted');
  });

  it('renders causer name', () => {
    const svc = {
      entries: signal([makeEntry({ causerName: 'Bob' })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('by Bob');
  });

  it('renders "by system" when causer is null', () => {
    const svc = {
      entries: signal([makeEntry({ causerName: null, causerId: null })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.nativeElement.textContent).toContain('by system');
  });

  it('shows entity type label from lookup', () => {
    const svc = {
      entries: signal([makeEntry({ entityType: 'meeting' })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    const label = f.debugElement.query(By.css('.atf__entity-label'));
    expect(label.nativeElement.textContent.trim()).toBe('Meeting');
  });

  it('shows skeleton when loading with no entries', () => {
    const svc = {
      entries: signal([]),
      loading: signal(true),
      meta:    signal(null),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.debugElement.queryAll(By.css('app-skeleton'))).toHaveLength(5);
  });

  it('shows empty state when not loading and no entries', () => {
    const svc = {
      entries: signal([]),
      loading: signal(false),
      meta:    signal(null),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.debugElement.query(By.css('app-empty-state'))).not.toBeNull();
  });

  it('does NOT show empty state when entries are present', () => {
    const svc = {
      entries: signal([makeEntry()]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.debugElement.query(By.css('app-empty-state'))).toBeNull();
  });

  it('shows changes details block for updated event with changes', () => {
    const svc = {
      entries: signal([makeEntry({
        event: 'updated',
        changes: [{ field: 'status', oldValue: 'open', newValue: 'closed' }],
      })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    const details = f.debugElement.query(By.css('.atf__changes'));
    expect(details).not.toBeNull();
    expect(details.nativeElement.textContent).toContain('status');
    expect(details.nativeElement.textContent).toContain('open');
    expect(details.nativeElement.textContent).toContain('closed');
  });

  it('does NOT show changes block for created event', () => {
    const svc = {
      entries: signal([makeEntry({ event: 'created', changes: [] })]),
      loading: signal(false),
      meta:    signal(makeMeta()),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.debugElement.query(By.css('.atf__changes'))).toBeNull();
  });

  it('shows load-more button when canLoadMore is true', () => {
    const svc = {
      entries: signal([makeEntry()]),
      loading: signal(false),
      meta:    signal(makeMeta({ current_page: 1, last_page: 3 })),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    const btn = f.debugElement.query(By.css('button[aria-label="Load more audit events"]'));
    expect(btn).not.toBeNull();
  });

  it('hides load-more button when on last page', () => {
    const svc = {
      entries: signal([makeEntry()]),
      loading: signal(false),
      meta:    signal(makeMeta({ current_page: 1, last_page: 1 })),
      load:    vi.fn().mockReturnValue(of(undefined)),
    };
    const f = setup(svc);
    expect(f.debugElement.query(By.css('button[aria-label="Load more audit events"]'))).toBeNull();
  });

  it('calls auditService.load with projectId on init', () => {
    const loadMock = vi.fn().mockReturnValue(of(undefined));
    const svc = {
      entries: signal([]),
      loading: signal(false),
      meta:    signal(null),
      load:    loadMock,
    };
    setup(svc);
    expect(loadMock).toHaveBeenCalledWith(5, expect.any(Object));
  });

  it('calls auditService.loadMore when load-more button clicked', () => {
    const loadMoreMock = vi.fn().mockReturnValue(of(undefined));
    const svc = {
      entries: signal([makeEntry()]),
      loading: signal(false),
      meta:    signal(makeMeta({ current_page: 1, last_page: 3 })),
      load:    vi.fn().mockReturnValue(of(undefined)),
      loadMore: loadMoreMock,
    };
    const f = setup(svc);
    f.debugElement.query(By.css('button[aria-label="Load more audit events"]')).nativeElement.click();
    expect(loadMoreMock).toHaveBeenCalledWith(5, expect.any(Object));
  });

  it('passes entity_type filter to load after select change', () => {
    const loadMock = vi.fn().mockReturnValue(of(undefined));
    const svc = {
      entries: signal([]),
      loading: signal(false),
      meta:    signal(null),
      load:    loadMock,
    };
    const f = setup(svc);

    const select = f.debugElement.query(By.css('.atf__type-select')).nativeElement as HTMLSelectElement;
    select.value = 'task';
    select.dispatchEvent(new Event('change'));
    f.detectChanges();

    expect(loadMock).toHaveBeenLastCalledWith(5, expect.objectContaining({ entity_type: 'task' }));
  });

  it('clears filters when clear button clicked', () => {
    const loadMock = vi.fn().mockReturnValue(of(undefined));
    const svc = {
      entries: signal([]),
      loading: signal(false),
      meta:    signal(null),
      load:    loadMock,
    };
    const f = setup(svc);

    f.componentInstance.entityTypeFilter.set('task');
    f.detectChanges();

    const clearBtn = f.debugElement.query(By.css('button[aria-label="Clear filters"]'));
    expect(clearBtn).not.toBeNull();
    clearBtn.nativeElement.click();
    f.detectChanges();

    expect(f.componentInstance.entityTypeFilter()).toBeNull();
  });
});
