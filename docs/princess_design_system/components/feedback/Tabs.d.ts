import { CSSProperties } from 'react';

export interface TabItem { value: string; label: string; }

export interface TabsProps {
  /** Tabs as plain strings or {value,label}. */
  tabs: (string | TabItem)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

/** Underline tab bar, matching the project-detail navigation. */
export function Tabs(props: TabsProps): JSX.Element;
