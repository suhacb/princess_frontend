// Princess app top bar — logo, command search, notifications, avatar menu.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  function TopBar() {
    const { IconButton, Avatar } = DS;
    const u = window.PRINCESS_DATA.user;
    return (
      <header className="pk-topbar">
        <div className="pk-topbar__start">
          <IconButton icon="menu" ariaLabel="Toggle navigation" />
          <a className="pk-topbar__logo"><img src="../../assets/logo.svg" alt="Princess" height="24" /></a>
        </div>
        <div className="pk-topbar__center">
          <button className="pk-search">
            <span className="material-icons pk-search__icon">search</span>
            <span className="pk-search__label">Search projects, risks, documents…</span>
            <kbd className="pk-search__kbd">⌘K</kbd>
          </button>
        </div>
        <div className="pk-topbar__end">
          <IconButton icon="auto_awesome" ariaLabel="Ask Princess" />
          <IconButton icon="notifications_none" badge="3" ariaLabel="Notifications" />
          <Avatar name={u.name + ' ' + u.familyName} />
        </div>
      </header>
    );
  }
  Object.assign(window, { TopBar });
})();
