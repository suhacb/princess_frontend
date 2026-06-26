// Risk Log + Item detail. Lists are already project-scoped; rows show their
// relationships and document count; opening a risk reveals the relationship hub.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  const LINK_ICON = { issue: 'bug_report', change: 'sync_alt', stage: 'account_tree', risk: 'warning_amber' };

  function LinkChips({ links, docs }) {
    return (
      <div className="ck-links">
        {links.map((l, i) => (
          <span className={'ck-link ck-link--' + l.t} key={i}><span className="material-icons">{LINK_ICON[l.t]}</span>{l.ref}</span>
        ))}
        {docs > 0 && <span className="ck-link ck-link--doc"><span className="material-icons">description</span>{docs}</span>}
      </div>
    );
  }

  function RiskLog({ onOpenItem }) {
    const { Button, Select, ScoreBadge, StatusChip, AISuggestionCard, AIAssistButton } = DS;
    const all = window.COCKPIT.risks;
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState('score');
    const [showAI, setShowAI] = useState(true);
    let rows = all.filter((r) => status === 'All' || cap(r.status) === status);
    rows = [...rows].sort((a, b) => (sort === 'score' ? b.score - a.score : a.id < b.id ? 1 : -1));

    return (
      <div className="ck-page">
        <div className="ck-pagehead">
          <div className="ck-pagehead__title"><h1>Risk Log</h1><span className="ck-count">{rows.length}</span></div>
          <div className="ck-pagehead__actions">
            <AIAssistButton icon="auto_awesome">Ask Princess</AIAssistButton>
            <Button variant="filled" icon="add">Raise risk</Button>
          </div>
        </div>

        {showAI && (
          <AISuggestionCard title="R-011 has no mitigation owner"
            acceptLabel="Assign me as interim" onAccept={() => setShowAI(false)} onDismiss={() => setShowAI(false)}>
            “Permit dependency slip” is open but unassigned. Assign the project manager as interim owner so it stays tracked to the next checkpoint.
          </AISuggestionCard>
        )}

        <div className="ck-filters">
          <Select label="Status" value={status} onChange={setStatus} options={['All', 'Open', 'Mitigated', 'Materialised', 'Closed']} style={{ width: 160 }} />
          <div className="ck-segment">
            <button className={sort === 'score' ? 'is-active' : ''} onClick={() => setSort('score')}>By score</button>
            <button className={sort === 'newest' ? 'is-active' : ''} onClick={() => setSort('newest')}>Newest</button>
          </div>
        </div>

        <div className="ck-tablecard">
          <table className="ck-table">
            <thead><tr><th>Score</th><th>Risk</th><th>Owner</th><th>Status</th><th>Relationships</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => onOpenItem(r)}>
                  <td><ScoreBadge score={r.score} /></td>
                  <td><div className="ck-cell-strong">{r.title}</div><div className="ck-cell-sub"><code className="ck-ref">{r.ref}</code> · P×I = {r.score} · {r.response}</div></td>
                  <td className="ck-muted">{r.owner || <span className="ck-unowned">Unowned</span>}</td>
                  <td><StatusChip status={r.status} /></td>
                  <td><LinkChips links={r.links} docs={r.docs} /></td>
                  <td className="ck-cell-action"><span className="material-icons">chevron_right</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function RelNode({ kind, refId, focus }) {
    return (
      <div className={'ck-relnode' + (focus ? ' is-focus' : '') + (kind === 'doc' ? ' is-doc' : '')}>
        <div className="ck-relnode__kind">{kind}</div>
        <div className="ck-relnode__ref">{refId}</div>
      </div>
    );
  }

  function ItemDetail({ item, onBack, onAsk }) {
    const { ScoreBadge, StatusChip, Card, Button, AISuggestionCard } = DS;
    const r = item;
    const docs = window.COCKPIT.documents.filter((d) => d.on === r.ref);
    return (
      <div className="ck-page">
        <button className="ck-back" onClick={onBack}><span className="material-icons">arrow_back</span>Risk Log</button>
        <div className="ck-detailhead">
          <div className="ck-detailhead__row">
            <div className="ck-detailhead__title">
              <span className="ck-eyebrow">Risk · {r.ref}</span>
              <h1>{r.title}</h1>
            </div>
            <div className="ck-detailhead__meta"><ScoreBadge score={r.score} size="lg" /><StatusChip status={r.status} /></div>
          </div>
        </div>

        <div className="ck-cols ck-cols--3to2">
          <div className="ck-stack">
            <Card title="Description & response" variant="outlined">
              <p className="ck-cardnote">Steel tender returned later than the baseline programme allows, threatening Stage 3 delivery. Mitigation underway with a second supplier; awaiting revised lead times.</p>
              <div className="ck-metarow">
                <span className="ck-meta"><b>Response</b> {r.response}</span>
                <span className="ck-meta"><b>Proximity</b> {r.proximity}</span>
                <span className="ck-meta"><b>Category</b> {r.category}</span>
                <span className="ck-meta"><b>Owner</b> {r.owner || 'Unowned'}</span>
              </div>
            </Card>
            <Card title="Related items" variant="outlined">
              <div className="ck-relmap">
                <RelNode kind="Risk" refId={r.ref} focus />
                <span className="material-icons ck-relarrow">east</span>
                <RelNode kind="Issue" refId="I-042" />
                <span className="material-icons ck-relarrow">east</span>
                <RelNode kind="Change" refId="C-009" />
              </div>
              <div className="ck-relfoot">Also linked: <span className="ck-link ck-link--stage"><span className="material-icons">account_tree</span>Stage 3</span> <span className="ck-link ck-link--risk"><span className="material-icons">school</span>Lesson L-7</span></div>
            </Card>
          </div>
          <div className="ck-stack">
            <Card title="Linked documents" variant="outlined" style={{ background: 'color-mix(in srgb, #8f4d00 5%, var(--mat-sys-surface-container-lowest))' }}>
              <div className="ck-docs">
                {docs.length ? docs.map((d, i) => (
                  <div className="ck-doc" key={i}>
                    <span className={'ck-doc__ic ck-doc__ic--' + d.kind}><span className="material-icons">description</span></span>
                    <div><div className="ck-cell-strong">{d.name}</div><div className="ck-cell-sub">added {d.added}</div></div>
                  </div>
                )) : <p className="ck-cardnote">No documents linked yet.</p>}
              </div>
              <Button variant="outlined" icon="attach_file" size="sm" style={{ marginTop: 10 }}>Link document</Button>
            </Card>
            <AISuggestionCard title="Score 16 should trigger an exception assessment" label="AI · PRINCE2 guidance"
              acceptLabel="Generate exception report" onAccept={onAsk} onDismiss={onAsk}>
              A Critical risk affecting stage tolerance warrants an Exception Report to the Project Board, citing R-016 and the linked issue I-042.
            </AISuggestionCard>
          </div>
        </div>
      </div>
    );
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  Object.assign(window, { CkRiskLog: RiskLog, CkItemDetail: ItemDetail });
})();
