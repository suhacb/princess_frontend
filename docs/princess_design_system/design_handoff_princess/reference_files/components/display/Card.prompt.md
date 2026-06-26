One-sentence: Flat tonal content surface — Princess uses `surface-container-low` cards with no shadow for overview/info panels; switch to `outlined` or `elevated` only when a card must visually float.

```jsx
<Card title="Project details">
  <dl>…</dl>
</Card>
<Card variant="outlined">Bordered panel</Card>
```

Pairs with `Badge` (status pills), `Chip` (filters) and `Avatar` (users).
