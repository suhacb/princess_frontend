import { CSSProperties } from 'react';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  style?: CSSProperties;
}

/** Material 3 checkbox with label. */
export function Checkbox(props: CheckboxProps): JSX.Element;
