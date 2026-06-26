// Princess app sidebar — dark navy navigation with brand gradient accent line.
(function () {
  function Sidebar({ active, onNavigate }) {
    const groups = window.PRINCESS_DATA.nav;
    return (
      <nav className="pk-sidebar">
        <div className="pk-sidebar__brand" />
        <div className="pk-sidebar__scroll">
          {groups.map((group) => (
            <div className="pk-group" key={group.label}>
              <span className="pk-group__label">{group.label}</span>
              {group.items.map((item) => (
                <a key={item.key}
                  className={'pk-item' + (active === item.key ? ' pk-item--active' : '')}
                  onClick={() => onNavigate(item.key)}>
                  <span className="material-icons pk-item__icon">{item.icon}</span>
                  <span className="pk-item__label">{item.label}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="pk-sidebar__footer">
          <a className="pk-item"><span className="material-icons pk-item__icon">settings</span><span className="pk-item__label">Settings</span></a>
        </div>
      </nav>
    );
  }
  Object.assign(window, { Sidebar });
})();
