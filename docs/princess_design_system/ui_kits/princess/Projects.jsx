// Projects list screen — search, status filter, table of PRINCE2 projects.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  function Projects({ onOpenProject }) {
    const { Button, Input, Select, StatusChip, EmptyState } = DS;
    const all = window.PRINCESS_DATA.projects;
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('All statuses');
    const rows = all.filter((p) =>
      (status === 'All statuses' || statusLabel(p.status) === status) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.reference.toLowerCase().includes(q.toLowerCase()))
    );
    return (
      <div className="pk-page">
        <div className="pk-pagehead">
          <div className="pk-pagehead__title"><h1>Projects</h1><span className="pk-count">{rows.length}</span></div>
          <Button variant="filled" icon="add">New project</Button>
        </div>
        <div className="pk-filters">
          <Input icon="search" placeholder="Name or reference" value={q} onChange={setQ} style={{ flex: 1, maxWidth: 360 }} />
          <Select value={status} onChange={setStatus}
            options={['All statuses', 'Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed']} style={{ width: 200 }} />
        </div>
        {rows.length === 0 ? (
          <div className="pk-tablecard"><EmptyState icon="folder_open" title="No projects found" message="Try adjusting your filters." /></div>
        ) : (
          <div className="pk-tablecard">
            <table className="pk-table">
              <thead><tr><th>Name</th><th>Reference</th><th>Status</th><th>Current stage</th><th>Tolerances</th><th>Created</th><th></th></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} onClick={() => onOpenProject(p)}>
                    <td className="pk-cell-link">{p.name}</td>
                    <td><code className="pk-ref">{p.reference}</code></td>
                    <td><StatusChip status={p.status} /></td>
                    <td className="pk-muted">{p.stage}</td>
                    <td><span className={'pk-dot pk-dot--' + p.tolerances} title={p.tolerances} /></td>
                    <td className="pk-muted">{p.created}</td>
                    <td className="pk-cell-action"><span className="material-icons">chevron_right</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function statusLabel(s) {
    return { pre_project: 'Pre-Project', initiation: 'Initiation', delivery: 'Delivery', closing: 'Closing', closed: 'Closed' }[s];
  }

  Object.assign(window, { Projects });
})();
