import { CSSProperties } from 'react';

export interface IconButtonProps {
  /** Material Icons ligature name, e.g. "notifications_none". */
  icon: string;
  size?: 'sm' | 'md';
  active?: boolean;
  /** Optional count/dot rendered as a small error-colored badge. */
  badge?: string | number;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

/** Round, icon-only button for toolbars, top bar and table row actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
