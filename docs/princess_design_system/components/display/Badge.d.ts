import { ReactNode, CSSProperties } from 'react';

export interface BadgeProps {
  children?: ReactNode;
  /** Semantic tone. */
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'tertiary';
  /** Solid fill (white text) vs subtle 12% tint (default). */
  solid?: boolean;
  /** Material Icons ligature for a leading icon. */
  icon?: string;
  style?: CSSProperties;
}

/** Small status pill / count badge with semantic tones. */
export function Badge(props: BadgeProps): JSX.Element;
