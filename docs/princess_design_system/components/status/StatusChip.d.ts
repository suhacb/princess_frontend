import { CSSProperties } from 'react';

export type PrinceStatus =
  | 'pre_project' | 'initiation' | 'delivery' | 'closing' | 'closed'
  | 'open' | 'mitigated' | 'materialised';

/**
 * Uppercase status pill for project lifecycle and log states.
 * @startingPoint section="Status" subtitle="Status chips, risk score badges & lifecycle stepper" viewport="700x220"
 */
export interface StatusChipProps {
  /** Known PRINCE2 project/risk status — auto-labels and colors. */
  status?: PrinceStatus | string;
  /** Override the displayed text. */
  label?: string;
  /** Override the color when not using a known status. */
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  style?: CSSProperties;
}

export function StatusChip(props: StatusChipProps): JSX.Element;
