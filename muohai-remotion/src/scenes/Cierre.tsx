import React from 'react';
import { eo3, lerp, pop, seg, useTime } from '../anim';
import { Stage, Sun, Wordmark } from '../components/brand';
import { Reveal, T } from '../components/type';
import { P, W } from '../theme';

const AX = 540;
const HW = 262;
const TOP = 420;
const BOTTOM = 950;
const ARCH = `M${AX - HW} ${BOTTOM}L${AX - HW} ${TOP + HW}A${HW} ${HW} 0 0 1 ${AX + HW} ${TOP + HW}L${AX + HW} ${BOTTOM}Z`;
/* "muohai.com.mx" a 58 px mide 427.4 px de ancho. */
const URL_W = 427.4;

/** 14.5 s — Arco rosa con el sol, logotipo y llamada a la tienda. */
export const Cierre: React.FC = () => {
  const { t, frame, fps } = useTime();
  const arch = eo3(seg(t, 0.05, 0.85));
  const revealTop = lerp(BOTTOM, TOP - 10, arch);
  const sun = eo3(seg(t, 0.35, 1.4));
  const meta = eo3(seg(t, 1.25, 1.8));
  const pulse = t > 1.95 ? 1 + 0.018 * Math.sin((t - 1.95) * 4.2) : 1;
  const pill = pop(frame, fps, 1.45, 10) * pulse;
  const bw = URL_W + 120;
  const bh = 106;
  return (
    <Stage bg={P.nav}>
      <defs>
        <clipPath id="arco-revela">
          <rect x={0} y={revealTop} width={W} height={BOTTOM - revealTop} />
        </clipPath>
        <clipPath id="arco">
          <path d={ARCH} />
        </clipPath>
      </defs>
      <g clipPath="url(#arco-revela)">
        <path d={ARCH} fill={P.rosa} />
        <g clipPath="url(#arco)">
          <Sun id="sol-cierre" cx={AX} cy={lerp(1180, 770, sun) + Math.max(0, t - 1.4) * 8} r={172} cut={P.rosa} />
        </g>
      </g>
      <Wordmark cx={540} base={1250} width={800} t={t} frame={frame} fps={fps} start={0.55} />
      <Reveal x={540} y={1360} kind="serif" size={69} fill={P.arena} anchor="middle" p={seg(t, 1.0, 1.6)}>
        Trajes de baño de edición limitada
      </Reveal>
      <T x={540} y={1432} kind="mono" size={27} fill={P.laguna} anchor="middle" ls={4} opacity={meta}>
        HECHO A MANO EN GUADALAJARA, MX
      </T>
      {pill > 0 ? (
        <g transform={`translate(540 1548) scale(${pill})`}>
          <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={bh / 2} fill={P.rosa} />
          <T x={0} y={20} kind="ui" size={58} fill={P.arena} anchor="middle">
            muohai.com.mx
          </T>
        </g>
      ) : null}
    </Stage>
  );
};
