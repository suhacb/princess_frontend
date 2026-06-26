import { CSSProperties } from 'react';

/**
 * Centered empty/zero state for lists and registers.
 * @startingPoint section="Feedback" subtitle="Empty state, skeleton loaders & tabs" viewport="700x300"
 */
export interface EmptyStateProps {
  /** Material Icons ligature, e.g. "folder_open". */
  icon?: string;
  title?: string;
  message?: string;
  /** When set, renders an outlined action button. */
  actionLabel?: string;
  onAction?: () => void;
  style?: CSSProperties;
}

export function EmptyState(props: EmptyStateProps): JSX.Element;
