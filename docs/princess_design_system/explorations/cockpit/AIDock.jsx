// Princess AI dock — persistent right rail unifying four AI surfaces:
// Insight (quick, per-context), Guidance (PRINCE2 "what to do"), Chat, Proposals.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  const TABS = [
    { key: 'insight',   label: 'Insight',   icon: 'lightbulb' },
    { key: 'guidance',  label: 'Guidance',  icon: 'menu_book' },
    { key: 'chat',      label: 'Chat',      icon: 'forum' },
    { key: 'proposals', label: 'Proposals', icon: 'task_alt' },
  ];

  function contextLabel(ctx) {
    if (ctx.item) return ctx.item.ref + ' · ' + ctx.item.title;
    return ({ home: 'Project Home', risks: 'Risk Log', stages: 'Plan & stages',
      portfolio: 'All projects', docs: 'Documents' }[ctx.route]) || 'This project';
  }

  function AICard({ eyebrow, children, actions }) {
    return (
      <div className="ck-aicard">
        <div className="ck-aicard__head">
          <span className="ck-aicard__mark" />
          <span className="ck-aicard__eyebrow">{eyebrow}</span>
        </div>
        <div className="ck-aicard__body">{children}</div>
        {actions && <div className="ck-aicard__actions">{actions}</div>}
      </div>
    );
  }

  function Insight({ ctx }) {
    if (ctx.item) {
      return (
        <React.Fragment>
          <AICard eyebrow="Quick insight">{ctx.item.ref} is your highest-scoring open item and is blocking Stage 3 sign-off.</AICard>
          <AICard eyebrow="Why it matters">Two linked documents disagree on steel lead time — 6 vs 9 weeks. Resolve before the gate.</AICard>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <AICard eyebrow="For you today">Stage 3 time tolerance is 80% consumed. One critical risk (R-016) and one unowned risk (R-011) need attention.</AICard>
        <AICard eyebrow="Trend">Three of your eight open risks now trace back to the same steel supplier.</AICard>
      </React.Fragment>
    );
  }

  function Guidance({ ctx }) {
    return (
      <AICard eyebrow="PRINCE2 guidance">
        A Critical risk that threatens stage tolerance calls for an exception assessment.
        <ol className="ck-steps">
          <li>Assess the deviation against Stage 3 time tolerance.</li>
          <li>Notify the Project Board if a breach is forecast.</li>
          <li>Produce an Exception Report for their decision.</li>
        </ol>
      </AICard>
    );
  }

  function Chat() {
    return (
      <div className="ck-chat">
        <div className="ck-bubble ck-bubble--me">What's our exposure if steelwork slips two weeks?</div>
        <div className="ck-bubble ck-bubble--ai">A two-week slip pushes Stage 3 to +10 days — exactly your time-tolerance limit — and delays the cabling work package. Want me to draft the Exception Report?</div>
        <div className="ck-chat__suggest">
          <button className="ck-suggchip">Draft the exception report</button>
          <button className="ck-suggchip">Show the affected work packages</button>
        </div>
      </div>
    );
  }

  function Proposals({ onApply }) {
    const { Button } = DS;
    return (
      <React.Fragment>
        <AICard eyebrow="Proposal" actions={
          <React.Fragment>
            <Button variant="filled" size="sm" icon="auto_awesome" onClick={onApply}>Generate</Button>
            <Button variant="text" size="sm" onClick={onApply}>Dismiss</Button>
          </React.Fragment>
        }>Draft an Exception Report citing R-016 and the linked issue I-042.</AICard>
        <AICard eyebrow="Proposal" actions={
          <React.Fragment>
            <Button variant="filled" size="sm" icon="check" onClick={onApply}>Apply</Button>
            <Button variant="text" size="sm" onClick={onApply}>Dismiss</Button>
          </React.Fragment>
        }>Assign the project manager as interim owner of R-011 so it stays tracked.</AICard>
      </React.Fragment>
    );
  }

  function AIDock({ ctx, onClose }) {
    const [tab, setTab] = useState('insight');
    const [toast, setToast] = useState(false);
    const apply = () => { setToast(true); setTimeout(() => setToast(false), 2200); };
    return (
      <aside className="ck-dock">
        <div className="ck-dock__head">
          <div className="ck-dock__title"><span className="ck-dock__mark" />Princess</div>
          <button className="ck-dock__close material-icons" onClick={onClose}>close</button>
        </div>
        <div className="ck-dock__ctx"><span className="material-icons">my_location</span>{contextLabel(ctx)}</div>
        <div className="ck-dock__tabs">
          {TABS.map((t) => (
            <button key={t.key} className={'ck-dock__tab' + (tab === t.key ? ' is-active' : '')} onClick={() => setTab(t.key)}>
              <span className="material-icons">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
        <div className="ck-dock__scroll">
          {tab === 'insight' && <Insight ctx={ctx} />}
          {tab === 'guidance' && <Guidance ctx={ctx} />}
          {tab === 'chat' && <Chat />}
          {tab === 'proposals' && <Proposals onApply={apply} />}
        </div>
        {toast && <div className="ck-dock__toast"><span className="material-icons">check_circle</span>Applied — you can undo from the activity log</div>}
        <div className="ck-dock__ask">
          <span className="ck-dock__mark" />
          <input className="ck-dock__input" placeholder="Ask about this project…" />
          <button className="ck-dock__send material-icons">arrow_upward</button>
        </div>
      </aside>
    );
  }

  Object.assign(window, { CkAIDock: AIDock });
})();
