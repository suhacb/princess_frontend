// Cockpit shell — scoped sidebar (project picker pinned on top) + top bar
// (project switcher, role switcher, command search, Ask Princess).
(function () {
  const DS = window.PrincessDesignSystem_3d336d;

  const NAV = [
    { label: 'Overview', items: [
      { key: 'home',   label: 'Project Home',  icon: 'dashboard' },
      { key: 'stages', label: 'Plan & stages', icon: 'account_tree', roles: ['pm', 'pmo'] },
    ]},
    { label: 'Logs', items: [
      { key: 'risks',   label: 'Risk Log',        icon: 'warning_amber' },
      { key: 'issues',  label: 'Issue Log',       icon: 'bug_report' },
      { key: 'changes', label: 'Change Log',      icon: 'sync_alt', roles: ['pm', 'pmo'] },
      { key: 'quality', label: 'Quality Register', icon: 'fact_check', roles: ['pm', 'pmo'] },
      { key: 'lessons', label: 'Lessons Log',     icon: 'school', roles: ['pm', 'pmo'] },
    ]},
    { label: 'Reports', roles: ['pm', 'pmo'], items: [
      { key: 'highlight',  label: 'Highlight Reports',  icon: 'summarize' },
      { key: 'exceptions', label: 'Exception Reports',  icon: 'report_problem' },
    ]},
    { label: 'Documents', items: [
      { key: 'docs', label: 'Library', icon: 'folder_open' },
    ]},
  ];

  function visible(roles, role) { return !roles || roles.indexOf(role) !== -1; }

  function Sidebar({ active, role, project, onNavigate, onOpenSwitcher }) {
    return (
      <nav className="ck-sidebar">
        <div className="ck-sidebar__brand" />
        <button className="ck-picker" onClick={onOpenSwitcher}>
          <span className="ck-picker__mark" />
          <span className="ck-picker__text">
            <span className="ck-picker__name">{project.name}</span>
            <span className="ck-picker__sub">{project.stage}</span>
          </span>
          <span className="material-icons ck-picker__chev">unfold_more</span>
        </button>
        <div className="ck-sidebar__scroll">
          {NAV.filter((g) => visible(g.roles, role)).map((group) => {
            const items = group.items.filter((it) => visible(it.roles, role));
            if (!items.length) return null;
            return (
              <div className="ck-group" key={group.label}>
                <span className="ck-group__label">{group.label}</span>
                {items.map((it) => (
                  <a key={it.key}
                    className={'ck-item' + (active === it.key ? ' ck-item--active' : '')}
                    onClick={() => onNavigate(it.key)}>
                    <span className="material-icons ck-item__icon">{it.icon}</span>
                    <span className="ck-item__label">{it.label}</span>
                  </a>
                ))}
              </div>
            );
          })}
        </div>
        <div className="ck-sidebar__footer">
          <a className="ck-item" onClick={onOpenSwitcher}>
            <span className="material-icons ck-item__icon">apps</span>
            <span className="ck-item__label">All projects</span>
          </a>
          <a className="ck-item">
            <span className="material-icons ck-item__icon">settings</span>
            <span className="ck-item__label">Project settings</span>
          </a>
        </div>
      </nav>
    );
  }

  function TopBar({ project, role, roles, onOpenSwitcher, onRole, onSearch, onAsk, aiOpen }) {
    const { IconButton, Avatar } = DS;
    const u = window.COCKPIT.user;
    return (
      <header className="ck-topbar">
        <div className="ck-topbar__start">
          <a className="ck-topbar__logo"><img src="../../assets/logo.svg" alt="Princess" height="22" /></a>
          <button className="ck-switch" onClick={onOpenSwitcher}>
            <span className="ck-switch__mark" />
            <span className="ck-switch__name">{project.name}</span>
            <span className="material-icons ck-switch__chev">expand_more</span>
          </button>
        </div>
        <div className="ck-topbar__center">
          <button className="ck-search" onClick={onSearch}>
            <span className="material-icons ck-search__icon">search</span>
            <span className="ck-search__label">Search {project.name}…</span>
            <kbd className="ck-search__kbd">⌘K</kbd>
          </button>
        </div>
        <div className="ck-topbar__end">
          <div className="ck-rolepick">
            <span className="ck-rolepick__eyebrow">Viewing as</span>
            <div className="ck-rolepick__seg">
              {Object.values(roles).map((r) => (
                <button key={r.key}
                  className={'ck-rolepick__btn' + (role === r.key ? ' is-active' : '')}
                  onClick={() => onRole(r.key)} title={r.focus}>{r.short}</button>
              ))}
            </div>
          </div>
          <button className={'ck-ask' + (aiOpen ? ' is-open' : '')} onClick={onAsk}>
            <span className="material-icons">auto_awesome</span>
            <span>Ask Princess</span>
          </button>
          <IconButton icon="notifications_none" badge="3" ariaLabel="Notifications" />
          <Avatar name={u.name} />
        </div>
      </header>
    );
  }

  Object.assign(window, { CkSidebar: Sidebar, CkTopBar: TopBar });
})();
