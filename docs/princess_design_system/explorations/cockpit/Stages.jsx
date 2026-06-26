// Plan & stages — the PRINCE2 lifecycle: stepper, stage tolerances (where
// exceptions are born), work packages tied to Team Managers, stage timeline.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;

  function Stages({ project, onAsk }) {
    const { LifecycleStepper, Card, Button, AISuggestionCard } = DS;
    const wpTone = { ok: 'ok', warn: 'warn', todo: 'none' };
    return (
      <div className="ck-page">
        <div className="ck-pagehead">
          <div className="ck-pagehead__title"><h1>Plan & stages</h1></div>
          <div className="ck-pagehead__actions"><Button variant="outlined" icon="edit">Edit stage plan</Button></div>
        </div>

        <Card variant="outlined" style={{ paddingTop: 22, paddingBottom: 22 }}>
          <LifecycleStepper stages={project.stages} activeIndex={project.stageIndex} />
        </Card>

        <div className="ck-cols ck-cols--1to1">
          <Card title="Stage 3 tolerances" variant="outlined">
            {project.tolerances.map((t, i) => <window.CkTol t={t} key={i} />)}
            <p className="ck-cardnote" style={{ marginTop: 12 }}>Breach a band and Princess raises an <b>Exception</b> to the Project Board — linked straight to the originating risk.</p>
          </Card>
          <Card title="Work packages" variant="outlined">
            <div className="ck-wplist">
              {project.workPackages.map((w, i) => (
                <div className="ck-wp" key={i}>
                  <DS.Avatar name={w.tm === '—' ? 'Unassigned' : w.tm} size="sm" />
                  <div className="ck-wp__main">
                    <div className="ck-cell-strong">{w.name}</div>
                    <div className="ck-cell-sub">{w.tm === '—' ? 'Unassigned' : 'Team Manager · ' + w.tm}</div>
                  </div>
                  <span className={'ck-tol ck-tol--' + wpTone[w.status]}>{w.note}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Stage timeline" variant="outlined">
          <div className="ck-gantt">
            <GRow label="Resurfacing" left={6} right={48} on />
            <GRow label="Cabling" left={30} right={22} />
            <GRow label="Inspection" left={64} right={6} />
          </div>
        </Card>

        <AISuggestionCard title="Time tolerance is 80% consumed" label="AI · forecast"
          acceptLabel="Model the slip" onAccept={onAsk} onDismiss={onAsk}>
          At the current rate, Stage 3 will reach +10 days (the limit) in about nine days. Princess can model a two-week steel slip against the plan.
        </AISuggestionCard>
      </div>
    );
  }

  function GRow({ label, left, right, on }) {
    return (
      <div className="ck-grow">
        <span className="ck-grow__label">{label}</span>
        <div className="ck-gtrack"><span className={'ck-gbar' + (on ? ' is-on' : '')} style={{ left: left + '%', right: right + '%' }} /></div>
      </div>
    );
  }

  Object.assign(window, { CkStages: Stages });
})();
