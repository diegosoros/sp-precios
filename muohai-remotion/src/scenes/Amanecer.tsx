import React from 'react';
import { eo3, lerp, seg, useTime } from '../anim';
import { Reflection, Sea, Stage, Sun, Wordmark } from '../components/brand';
import { T } from '../components/type';
import { P, W } from '../theme';

const HORIZON = 1220;

/** 0.0 s — El sol sale del mar y aparece el logotipo. */
export const Amanecer: React.FC = () => {
  const { t, frame, fps } = useTime();
  const rise = eo3(seg(t, 0.1, 1.8));
  const line = eo3(seg(t, 0, 0.9));
  const label = eo3(seg(t, 0.3, 1.1));
  const foot = eo3(seg(t, 1.6, 2.3));
  return (
    <Stage bg={P.nav}>
      <Sun id="sol-amanecer" cx={540} cy={lerp(HORIZON + 320, 940, rise)} r={280} cut={P.nav} />
      <Sea t={t} top={HORIZON} />
      <Reflection t={t} cx={540} top={HORIZON} r={280} p={rise} />
      <rect x={540 - 540 * line} y={HORIZON - 2} width={W * line} height={3} fill={P.arena} opacity={0.85} />
      <T x={540} y={272} kind="mono" size={30} fill={P.arena} anchor="middle" ls={lerp(22, 10, label)} opacity={label}>
        TRAJES DE BAÑO · MÉXICO
      </T>
      <Wordmark cx={540} base={600} width={860} t={t} frame={frame} fps={fps} start={0.55} />
      <T x={540} y={1560 + (1 - foot) * 24} kind="mono" size={30} fill={P.arena} anchor="middle" ls={8} opacity={foot}>
        EDICIÓN LIMITADA · HECHO A MANO
      </T>
    </Stage>
  );
};
