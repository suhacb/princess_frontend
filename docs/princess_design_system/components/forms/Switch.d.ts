import { CSSProperties } from 'react';

export interface SwitchProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  style?: CSSProperties;
}

/** Material 3 switch toggle with optional label. */
export function Switch(props: SwitchProps): JSX.Element;
