import React from 'react';
import { eo4 } from '../anim';
import { W } from '../theme';

export type Kind = 'disp' | 'ui' | 'serif' | 'mono';

const STACK = {
  display: '"MH Display", "Arial Narrow", sans-serif',
  serif: '"MH Serif", Georgia, serif',
  mono: '"MH Mono", ui-monospace, monospace',
};

export const kindStyle = (kind: Kind): React.CSSProperties => {
  switch (kind) {
    case 'disp':
      return { fontFamily: STACK.display, fontWeight: 800, fontStretch: '75%' };
    case 'ui':
      return { fontFamily: STACK.display, fontWeight: 700, fontStretch: '100%' };
    case 'serif':
      return { fontFamily: STACK.serif, fontStyle: 'italic', fontWeight: 400 };
    default:
      return { fontFamily: STACK.mono, fontWeight: 500 };
  }
};

export type TextProps = {
  x: number;
  /** Línea base, en px del cuadro de 1080 × 1920. */
  y: number;
  kind: Kind;
  size: number;
  fill: string;
  anchor?: 'start' | 'middle' | 'end';
  ls?: number;
  opacity?: number;
  children: string;
};

/** Texto SVG anclado a su línea base, como en una retícula de impresión. */
export const T: React.FC<TextProps> = ({ x, y, kind, size, fill, anchor = 'start', ls = 0, opacity = 1, children }) => (
  <text
    x={x}
    y={y}
    fill={fill}
    textAnchor={anchor}
    opacity={opacity}
    style={{ ...kindStyle(kind), fontSize: size, letterSpacing: ls, fontKerning: 'normal' }}
  >
    {children}
  </text>
);

/** Línea que sube desde una máscara. `p` va de 0 a 1. */
export const Reveal: React.FC<TextProps & { p: number }> = ({ p, ...props }) => {
  if (p <= 0) return null;
  const s = props.size;
  return (
    <svg x={0} y={props.y - s * 1.02} width={W} height={s * 1.34} overflow="hidden">
      <T {...props} y={s * 1.02 + (1 - eo4(p)) * s * 1.15} />
    </svg>
  );
};
