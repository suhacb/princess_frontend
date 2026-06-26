One-sentence: Uppercase status pill for PRINCE2 project lifecycle (`pre_project`→`closed`) and log states (`open`/`mitigated`/`materialised`) — pass a known `status` for auto label + color, or a `label`+`tone` for anything else.

```jsx
<StatusChip status="delivery" />
<StatusChip status="open" />
<StatusChip label="On hold" tone="warning" />
```

Sibling domain components: `ScoreBadge` (risk 1–25 severity) and `LifecycleStepper` (stage tracker).
