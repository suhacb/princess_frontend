import { CSSProperties } from 'react';

/**
 * Material 3 outlined text field with floating label.
 * @startingPoint section="Forms" subtitle="Outlined text field, select, checkbox & switch" viewport="700x320"
 */
export interface InputProps {
  /** Floating label text. */
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Material Icons ligature for a leading prefix icon, e.g. "search". */
  icon?: string;
  type?: string;
  /** Error message — shown below and turns the field red. */
  error?: string;
  /** Helper text shown below when there's no error. */
  hint?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
