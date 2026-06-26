import { CSSProperties } from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps {
  label?: string;
  value?: string;
  /** Options as plain strings or {value,label} objects. */
  options?: (string | SelectOption)[];
  placeholder?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

/** Material 3 outlined select with a tonal dropdown menu. */
export function Select(props: SelectProps): JSX.Element;
