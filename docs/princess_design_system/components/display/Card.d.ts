import { ReactNode, CSSProperties } from 'react';

/**
 * Content surface. Flat tonal by default — Material 3 favours tonal containers over shadow.
 * @startingPoint section="Display" subtitle="Cards, badges, chips & avatars" viewport="700x260"
 */
export interface CardProps {
  children?: ReactNode;
  /** Optional uppercase section title, matching the app's info-card heading. */
  title?: string;
  /** tonal = flat surface-container (default) · outlined = bordered · elevated = shadowed. */
  variant?: 'tonal' | 'outlined' | 'elevated';
  style?: CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
