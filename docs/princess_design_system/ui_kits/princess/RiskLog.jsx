// Risk Log screen — filter + sort, risk table with score badges & status chips,
// plus an inline AI suggestion proposing action on unowned risks.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  function RiskLog() {
    const { Button, Select, ScoreBadge, StatusChip, AISuggestionCard, AIAssistButton } = DS;
    const all = window.PRINCESS_DATA.risks;
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState('score');
    const [showAI, setShowAI] = useState(true);
    let rows = all.filter((r) => status === 'All' || statusLabel(r.status) === status);
    rows = [...rows].sort((a, b) => (sort === 'score' ? b.score - a.score : a.id - b.id));

    return (
      <div className="pk-page">
        <div className="pk-pagehead">
          <div className="pk-pagehead__title"><h1>Risk Log</h1><span className="pk-count">{rows.length}</span></div>
          <div className="pk-pagehead__actions">
            <AIAssistButton icon="auto_awesome">Ask Princess</AIAssistButton>
            <Button variant="filled" icon="add">Raise Risk</Button>
          </div>
        </div>

        {showAI && (
          <AISuggestionCard title="2 open risks have no mitigation owner"
            acceptLabel="Assign owner" onAccept={() => setShowAI(false)} onDismiss={() => setShowAI(false)}
            style={{ marginBottom: 4 }}>
            Risks R-004 and R-006 are unassigned. Assign the project manager as interim owner so they stay tracked at the next checkpoint.
          </AISuggestionCard>
        )}

        <div className="pk-filters">
          <Select label="Status" value={status} onChange={setStatus}
            options={['All', 'Open', 'Mitigated', 'Closed', 'Materialised']} style={{ width: 160 }} />
          <div className="pk-segment">
            <button className={sort === 'score' ? 'is-active' : ''} onClick={() => setSort('score')}>By Score</button>
            <button className={sort === 'newest' ? 'is-active' : ''} onClick={() => setSort('newest')}>Newest</button>
          </div>
        </div>

        <div className="pk-tablecard">
          <table className="pk-table pk-table--risk">
            <thead><tr><th>Score</th><th>Title</th><th>Category</th><th>Proximity</th><th>Response</th><th>Status</th><th>Owner</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><ScoreBadge score={r.score} /></td>
                  <td className="pk-cell-strong">{r.title}</td>
                  <td className="pk-muted">{r.category}</td>
                  <td className="pk-muted">{r.proximity}</td>
                  <td className="pk-muted">{r.response}</td>
                  <td><StatusChip status={r.status} /></td>
                  <td className="pk-muted">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function statusLabel(s) {
    return { open: 'Open', mitigated: 'Mitigated', closed: 'Closed', materialised: 'Materialised' }[s];
  }

  Object.assign(window, { RiskLog });
})();
