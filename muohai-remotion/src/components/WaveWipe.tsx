import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { lerp } from '../anim';
import { H, W } from '../theme';

type WaveWipeProps = {
  /** Color de la espuma que marca el borde de la ola. */
  foam: string;
};

const edge = (p: number) => {
  const base = lerp(H + 90, -90, p);
  const phase = p * 4.2;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 10) {
    const y = base + Math.sin(x * 0.009 + phase) * 38 + Math.sin(x * 0.021 + phase * 0.5) * 12;
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  return pts;
};

const WaveWipePresentation: React.FC<TransitionPresentationComponentProps<WaveWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const pts = edge(presentationProgress);
  const clip = `path('M0 ${H + 200}L${pts.join('L')}L${W} ${H + 200}Z')`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <path d={`M${pts.join('L')}`} fill="none" stroke={passedProps.foam} strokeWidth={12} strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Ola que sube desde abajo y cubre la escena anterior, con una línea de espuma. */
export const waveWipe = (props: WaveWipeProps): TransitionPresentation<WaveWipeProps> => ({
  component: WaveWipePresentation,
  props,
});
