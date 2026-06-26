// Project detail screen — header with lifecycle stepper, tabs, overview cards.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  function ProjectDetail({ project, onBack }) {
    const { StatusChip, LifecycleStepper, Tabs, Card, Button } = DS;
    const p = project || window.PRINCESS_DATA.projects[0];
    const [tab, setTab] = useState('Overview');
    const stageIndex = { pre_project: 0, initiation: 1, delivery: 2, closing: 3, closed: 4 }[p.status] ?? 0;

    return (
      <div className="pk-page">
        <button className="pk-back" onClick={onBack}><span className="material-icons">arrow_back</span>Projects</button>

        <div className="pk-detailhead">
          <div className="pk-detailhead__row">
            <h1>{p.name}</h1>
            <code className="pk-ref">{p.reference}</code>
            <StatusChip status={p.status} />
          </div>
          <p className="pk-detailhead__stage">Current stage: <strong>{p.stage}</strong></p>
        </div>

        <LifecycleStepper stages={['Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed']} activeIndex={stageIndex} />

        <Tabs tabs={['Overview', 'Risks', 'Issues', 'Quality', 'Documents']} value={tab} onChange={setTab} style={{ marginTop: 20 }} />

        <div className="pk-overview">
          <Card title="Project details">
            <dl className="pk-dl">
              <dt>Name</dt><dd>{p.name}</dd>
              <dt>Reference</dt><dd><code className="pk-ref">{p.reference}</code></dd>
              <dt>Created by</dt><dd>A. Novak</dd>
              <dt>Created</dt><dd>{p.created}</dd>
              <dt>Current stage</dt><dd>{p.stage}</dd>
            </dl>
          </Card>
          <Card title="Tolerances">
            <dl className="pk-dl">
              <dt>Time</dt><dd>-5 / +10 days</dd>
              <dt>Cost</dt><dd>-1 000 / +5 000 €</dd>
              <dt>Scope</dt><dd>No change to core deliverables</dd>
              <dt>Quality</dt><dd>Meets ISO 9001</dd>
              <dt>Risk</dt><dd>No threats above Medium</dd>
            </dl>
          </Card>
        </div>
      </div>
    );
  }

  Object.assign(window, { ProjectDetail });
})();
