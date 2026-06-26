import { CSSProperties } from 'react';

export interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: CSSProperties;
}

/** Shimmering placeholder block for loading states. */
export function Skeleton(props: SkeletonProps): JSX.Element;
