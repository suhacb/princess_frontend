import { ReactNode, CSSProperties } from 'react';

export interface AIAssistButtonProps {
  children?: ReactNode;
  /** Material Icons ligature — defaults to "auto_awesome". */
  icon?: string;
  /** Solid gradient fill vs gradient outline (default). */
  solid?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

/** Gradient "Ask Princess" trigger that invokes AI assistance in context. */
export function AIAssistButton(props: AIAssistButtonProps): JSX.Element;
