import { CSSProperties } from 'react';

export interface ScoreBadgeProps {
  /** Risk score 1–25 (probability × impact). Color follows the severity ramp. */
  score: number;
  size?: 'md' | 'lg';
  style?: CSSProperties;
}

/** Round risk-score badge colored by severity (low/medium/high/critical). */
export function ScoreBadge(props: ScoreBadgeProps): JSX.Element;
