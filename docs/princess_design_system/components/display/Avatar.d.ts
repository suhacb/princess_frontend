import { CSSProperties } from 'react';

export interface AvatarProps {
  /** Full name — initials are derived from the first two words. */
  name?: string;
  /** Image URL; overrides initials when present. */
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

/** Circular user avatar — initials on the Sinecon brand gradient, or an image. */
export function Avatar(props: AvatarProps): JSX.Element;
