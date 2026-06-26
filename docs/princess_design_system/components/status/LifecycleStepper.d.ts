import { CSSProperties } from 'react';

export interface LifecycleStepperProps {
  /** Ordered stage labels, e.g. ['Pre-Project','Initiation','Delivery','Closing','Closed']. */
  stages: string[];
  /** Index of the current stage; earlier stages render completed. */
  activeIndex?: number;
  style?: CSSProperties;
}

/** Horizontal PRINCE2 stage tracker for project headers. */
export function LifecycleStepper(props: LifecycleStepperProps): JSX.Element;
