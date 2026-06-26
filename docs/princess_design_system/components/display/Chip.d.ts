import { ReactNode, CSSProperties } from 'react';

export interface ChipProps {
  children?: ReactNode;
  icon?: string;
  selected?: boolean;
  /** When provided, shows a removable × and calls this on click. */
  onRemove?: () => void;
  onClick?: () => void;
  style?: CSSProperties;
}

/** Filter / input chip with optional icon, selected state and remove affordance. */
export function Chip(props: ChipProps): JSX.Element;
