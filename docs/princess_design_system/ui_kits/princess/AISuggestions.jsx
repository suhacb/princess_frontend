// AI Suggestions screen — Princess proposes actions across the project,
// each as an actionable suggestion card with a source context.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const { useState } = React;

  function AISuggestions() {
    const { AISuggestionCard, AIAssistButton, Badge } = DS;
    const [items, setItems] = useState(window.PRINCESS_DATA.suggestions);
    const dismiss = (id) => setItems((xs) => xs.filter((x) => x.id !== id));

    return (
      <div className="pk-page">
        <div className="pk-pagehead">
          <div className="pk-pagehead__title">
            <h1>AI Suggestions</h1>
            <Badge tone="primary">{items.length} active</Badge>
          </div>
          <AIAssistButton solid icon="auto_awesome">Ask Princess anything</AIAssistButton>
        </div>
        <p className="pk-lede">Princess reviews your project data continuously and proposes actions. Apply, refine, or dismiss — nothing changes until you accept.</p>

        <div className="pk-ai-list">
          {items.map((s) => (
            <div key={s.id} className="pk-ai-item">
              <AISuggestionCard title={s.title} acceptLabel={s.accept}
                onAccept={() => dismiss(s.id)} onDismiss={() => dismiss(s.id)}>
                {s.body}
              </AISuggestionCard>
              <span className="pk-ai-context"><span className="material-icons">link</span>{s.context}</span>
            </div>
          ))}
          {items.length === 0 && (
            <div className="pk-ai-empty">
              <span className="material-icons">auto_awesome</span>
              <p>You're all caught up. Princess will surface new suggestions as your project evolves.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  Object.assign(window, { AISuggestions });
})();
