One-sentence: Centered zero-state for empty lists and registers — icon, title, message and an optional outlined action — used across the Risk Log, Projects and every register when there's nothing to show yet.

```jsx
<EmptyState icon="folder_open" title="No projects found"
  message="Create your first PRINCE2 project to get started."
  actionLabel="New project" onAction={create} />
```

Siblings: `Skeleton` (loading shimmer) and `Tabs` (underline nav).
