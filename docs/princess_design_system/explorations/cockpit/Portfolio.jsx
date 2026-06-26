// Portfolio — the only cross-project view. Picking a row sets project context.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  function Portfolio({ onOpenProject }) {
    const { Button, StatusChip, AISuggestionCard } = DS;
    const rows = window.COCKPIT.portfolio;
    const [showAI, setShowAI] = useState(true);
    return (
      <div className="ck-page">
        <div className="ck-pagehead">
          <div className="ck-pagehead__title"><h1>All projects</h1><span className="ck-count">{rows.length}</span></div>
          <div className="ck-pagehead__actions">
            <Button variant="outlined" icon="tune">Filters</Button>
            <Button variant="filled" icon="add">New project</Button>
          </div>
        </div>
        <p className="ck-lede">Choose a project to enter its workspace. Health, stage and tolerance are shown up front so the choice is informed.</p>

        {showAI && (
          <AISuggestionCard title="Ringroad Phase 2 has breached cost tolerance"
            label="AI · across the portfolio" acceptLabel="Open project"
            onAccept={() => { setShowAI(false); }} onDismiss={() => setShowAI(false)}>
            An Exception Report is due to the Project Board. This is the only project currently outside its tolerance bands.
          </AISuggestionCard>
        )}

        <div className="ck-tablecard">
          <table className="ck-table">
            <thead><tr><th></th><th>Project</th><th>Stage</th><th>Open risks</th><th>Tolerance</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} onClick={() => onOpenProject(p)}>
                  <td style={{ width: 18 }}><span className={'ck-health ck-health--' + p.health} /></td>
                  <td><div className="ck-cell-strong">{p.name}</div><div className="ck-cell-sub">Exec: {p.exec} · <code className="ck-ref">{p.reference}</code></div></td>
                  <td><StatusChip status={p.status} label={p.stage} /></td>
                  <td className="ck-muted">{p.openRisks}</td>
                  <td>{tolChip(p.tol)}</td>
                  <td className="ck-muted">{p.updated}</td>
                  <td className="ck-cell-action"><span className="material-icons">chevron_right</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function tolChip(tol) {
    const map = { 'Within': 'ok', 'Near limit': 'warn', 'Exception': 'danger', '—': 'none' };
    const tone = map[tol] || 'none';
    if (tone === 'none') return <span className="ck-muted">—</span>;
    return <span className={'ck-tol ck-tol--' + tone}>{tone === 'danger' && <span className="material-icons">warning_amber</span>}{tol}</span>;
  }

  Object.assign(window, { CkPortfolio: Portfolio });
})();
