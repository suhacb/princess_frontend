// Project Home — role-aware. PM sees delivery & tolerances; PMO sees governance
// & gates; Team Manager sees only their work package. Same project, three homes.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;

  function Kpi({ k }) {
    return (
      <div className="ck-kpi">
        <div className="ck-kpi__label">{k.label}</div>
        <div className="ck-kpi__row">
          <span className={'ck-kpi__value ck-kpi__value--' + k.tone}>{k.value}</span>
          <span className="ck-kpi__sub">{k.sub}</span>
        </div>
      </div>
    );
  }

  function Home({ role, project, onOpenItem, onNavigate, onAsk }) {
    const { Card, Button, AISuggestionCard, StatusChip } = DS;
    const H = window.COCKPIT.home;

    return (
      <div className="ck-page">
        <div className="ck-pagehead">
          <div className="ck-pagehead__title">
            <h1>{project.name}</h1>
            <StatusChip status={project.status} label={project.stage} />
          </div>
          <div className="ck-pagehead__actions">
            <span className="ck-rolehint">{window.COCKPIT.roles[role].focus}</span>
          </div>
        </div>

        {role === 'pm' && (
          <React.Fragment>
            <div className="ck-kpis">{H.pm.kpis.map((k, i) => <Kpi k={k} key={i} />)}</div>
            <div className="ck-cols ck-cols--2to1">
              <Card title="Risks needing you" variant="outlined">
                <table className="ck-table ck-table--flush">
                  <tbody>
                    {window.COCKPIT.risks.filter((r) => r.status === 'open').slice(0, 3).map((r) => (
                      <tr key={r.id} onClick={() => onOpenItem(r)}>
                        <td style={{ width: 44 }}><DS.ScoreBadge score={r.score} /></td>
                        <td><div className="ck-cell-strong">{r.title}</div><div className="ck-cell-sub"><code className="ck-ref">{r.ref}</code> · {r.owner || 'Unowned'}</div></td>
                        <td className="ck-cell-action"><span className="material-icons">chevron_right</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button variant="text" trailingIcon="arrow_forward" onClick={() => onNavigate('risks')} style={{ marginTop: 8 }}>Open Risk Log</Button>
              </Card>
              <div className="ck-stack">
                <AISuggestionCard title="Princess · for you today" label="AI" acceptLabel="Review"
                  onAccept={onAsk} dismissLabel="Open dock" onDismiss={onAsk}>
                  R-016 is blocking Stage 3 and steel lead-time docs disagree. Draft an exception, or assign the unowned risk R-011.
                </AISuggestionCard>
                <Card title="Stage tolerance" variant="outlined">
                  {project.tolerances.slice(0, 2).map((t, i) => <Tol t={t} key={i} />)}
                </Card>
              </div>
            </div>
          </React.Fragment>
        )}

        {role === 'pmo' && (
          <React.Fragment>
            <div className="ck-kpis">{H.pmo.kpis.map((k, i) => <Kpi k={k} key={i} />)}</div>
            <div className="ck-cols ck-cols--2to1">
              <Card title="Assurance checklist · this stage" variant="outlined">
                <ul className="ck-check">
                  {H.pmo.checklist.map((c, i) => (
                    <li key={i} className={c.ok ? 'is-ok' : 'is-warn'}>
                      <span className="material-icons">{c.ok ? 'check_circle' : 'error'}</span>{c.label}
                    </li>
                  ))}
                </ul>
              </Card>
              <AISuggestionCard title="Lessons log empty for this stage" label="AI · assurance"
                acceptLabel="Open log" onAccept={() => onNavigate('home')} onDismiss={onAsk}>
                PRINCE2 expects lessons captured before the stage gate. Princess can pre-fill three from recent issues.
              </AISuggestionCard>
            </div>
          </React.Fragment>
        )}

        {role === 'tm' && (
          <React.Fragment>
            <Card title="My work package" variant="outlined">
              <div className="ck-wphead">
                <div><div className="ck-cell-strong" style={{ fontSize: '1.05rem' }}>{H.tm.wp.name}</div><div className="ck-cell-sub">Due {H.tm.wp.due}</div></div>
                <span className="ck-tol ck-tol--warn">{H.tm.wp.tol}</span>
              </div>
            </Card>
            <div className="ck-cols ck-cols--1to1">
              <Card title="My checklist" variant="outlined">
                <ul className="ck-check">
                  {H.tm.checklist.map((c, i) => (
                    <li key={i} className={c.ok ? 'is-ok' : 'is-todo'}>
                      <span className="material-icons">{c.ok ? 'check_circle' : 'radio_button_unchecked'}</span>{c.label}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Raise to the PM" variant="outlined">
                <p className="ck-cardnote">Team Managers raise risks and issues; the PM triages and owns the response.</p>
                <div className="ck-btnrow">
                  <Button variant="danger" icon="bug_report">Raise issue</Button>
                  <Button variant="outlined" icon="warning_amber">Raise risk</Button>
                </div>
              </Card>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  function Tol({ t }) {
    return (
      <div className="ck-tolrow">
        <div className="ck-tolrow__top"><span>{t.dim} · {t.range}</span><span className={'ck-tolrow__used ck-tolrow__used--' + t.state}>{t.used}</span></div>
        <div className="ck-tolbar"><i className={'ck-tolbar--' + t.state} style={{ width: t.pct + '%' }} /></div>
      </div>
    );
  }

  Object.assign(window, { CkHome: Home, CkTol: Tol });
})();
