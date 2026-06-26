One-sentence: Pill-shaped Material 3 button on the Sinecon azure theme; use `filled` for the page's single primary action, `tonal`/`outlined`/`text` for lower emphasis, `danger` for destructive.

```jsx
<Button variant="filled" icon="add" onClick={raise}>Raise Risk</Button>
<Button variant="outlined">Cancel</Button>
<Button variant="text" trailingIcon="chevron_right">View all</Button>
<Button variant="danger" icon="delete">Delete project</Button>
```

Variants: `filled` (primary CTA) · `tonal` (secondary container) · `outlined` · `text` · `danger`. Sizes: `sm` / `md` / `lg`. Icons are Material Icons ligature names.
