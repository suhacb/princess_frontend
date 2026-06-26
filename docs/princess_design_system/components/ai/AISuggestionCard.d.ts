import { ReactNode, CSSProperties } from 'react';

/**
 * Azure-tinted card that proposes an AI action, pre-fill, or insight from project data.
 * @startingPoint section="AI" subtitle="AI suggestion card & assist button" viewport="700x260"
 */
export interface AISuggestionCardProps {
  /** Headline of the proposed action / insight. */
  title?: string;
  /** Explanatory body text. */
  children?: ReactNode;
  /** Eyebrow label — defaults to "AI Suggestion". */
  label?: string;
  acceptLabel?: string;
  dismissLabel?: string;
  /** When provided, renders the primary accept button. */
  onAccept?: () => void;
  /** When provided, renders the dismiss button. */
  onDismiss?: () => void;
  style?: CSSProperties;
}

export function AISuggestionCard(props: AISuggestionCardProps): JSX.Element;
