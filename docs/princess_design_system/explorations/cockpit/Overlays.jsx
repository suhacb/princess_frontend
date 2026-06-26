// Overlays — project switcher (set context without leaving the page) and the
// ⌘K command palette (jump to any item, document, relationship, or AI action).
(function () {
  const DS = window.PrincessDesignSystem_3d336d;

  function Switcher({ onClose, onPick, onPortfolio }) {
    const rows = window.COCKPIT.portfolio;
    return (
      <div className="ck-overlay ck-overlay--switch" onClick={onClose}>
        <div className="ck-switchpanel" onClick={(e) => e.stopPropagation()}>
          <div className="ck-switchpanel__head"><span className="ck-eyebrow">Switch project</span></div>
          <div className="ck-switchpanel__list">
            {rows.map((p) => (
              <button key={p.id} className={'ck-switchrow' + (p.active ? ' is-active' : '')} onClick={() => onPick(p)}>
                <span className={'ck-health ck-health--' + p.health} />
                <span className="ck-switchrow__main">
                  <span className="ck-cell-strong">{p.name}</span>
                  <span className="ck-cell-sub">{p.stage}</span>
                </span>
                <span className={'ck-tol ck-tol--' + ({ 'Within': 'ok', 'Near limit': 'warn', 'Exception': 'danger', '—': 'none' }[p.tol])}>{p.tol}</span>
              </button>
            ))}
          </div>
          <div className="ck-switchpanel__foot">
            <button className="ck-textbtn" onClick={onPortfolio}><span className="material-icons">apps</span>All projects</button>
            <button className="ck-textbtn"><span className="material-icons">add</span>New project</button>
          </div>
        </div>
      </div>
    );
  }

  function Palette({ onClose, onOpenItem, onNavigate, onAsk }) {
    const risks = window.COCKPIT.risks;
    return (
      <div className="ck-overlay ck-overlay--palette" onClick={onClose}>
        <div className="ck-palette" onClick={(e) => e.stopPropagation()}>
          <div className="ck-palette__q">
            <span className="material-icons">search</span>
            <span className="ck-palette__typed">steel</span><span className="ck-palette__caret" />
            <kbd className="ck-search__kbd">esc</kbd>
          </div>
          <div className="ck-palette__scroll">
            <div className="ck-palette__group">Items</div>
            <button className="ck-prow is-active" onClick={() => onOpenItem(risks[0])}>
              <DS.ScoreBadge score={16} size="md" />
              <span>Tender delay on steelwork</span><span className="ck-prow__meta">Risk · R-016</span>
            </button>
            <button className="ck-prow" onClick={() => onNavigate('changes')}>
              <span className="ck-link ck-link--change"><span className="material-icons">sync_alt</span></span>
              <span>Steelwork scope change</span><span className="ck-prow__meta">Change · C-009</span>
            </button>
            <div className="ck-palette__group">Documents</div>
            <button className="ck-prow" onClick={() => onNavigate('docs')}>
              <span className="ck-link ck-link--doc"><span className="material-icons">description</span></span>
              <span>Steel tender — RFQ.pdf</span><span className="ck-prow__meta">Document</span>
            </button>
            <div className="ck-palette__group">Follow relationship</div>
            <button className="ck-prow" onClick={() => onNavigate('risks')}>
              <span className="ck-link ck-link--stage"><span className="material-icons">account_tree</span></span>
              <span>Risks linked to Stage 3</span><span className="ck-prow__meta">3 items</span>
            </button>
            <div className="ck-palette__group">Ask Princess</div>
            <button className="ck-prow ck-prow--ai" onClick={onAsk}>
              <span className="ck-aicard__mark" />
              <span>“What's blocking the steelwork stream?”</span><span className="ck-prow__meta">AI</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { CkSwitcher: Switcher, CkPalette: Palette });
})();
