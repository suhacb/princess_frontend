import { ReactNode, CSSProperties } from 'react';

/**
 * Primary action control. Pill-shaped, Material 3 on the azure theme.
 * @startingPoint section="Buttons" subtitle="Filled, tonal, outlined, text & danger buttons" viewport="700x120"
 */
export interface ButtonProps {
  children?: ReactNode;
  /** Visual emphasis. filled = primary CTA, tonal = secondary, outlined/text = low, danger = destructive. */
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Material Icons ligature name for a leading icon, e.g. "add". */
  icon?: string;
  /** Material Icons ligature for a trailing icon. */
  trailingIcon?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  style?: CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
