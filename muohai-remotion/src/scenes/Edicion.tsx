import React from 'react';
import { eo3, pad2, pop, seg, useTime } from '../anim';
import { Stage } from '../components/brand';
import { Reveal, T } from '../components/type';
import { P } from '../theme';

const PIECES = 50;
const COLS = 10;
const GAP = 86;
const R = 29;
const GX = 90 + R;
const GY = 1000;
/* "50" a 560 px mide 472.6 px de ancho. */
const SERIF_X = 78 + 472.6 + 34;

/** 5.7 s — Cada set es de 50 piezas; los círculos se llenan hasta agotarse. */
export const Edicion: React.FC = () => {
  const { t, frame, fps } = useTime();
  const fillAt = (i: number) => 0.9 + i * 0.02;
  const sold = Array.from({ length: PIECES }, (_, i) => i).filter((i) => t >= fillAt(i) + 0.075).length;
  return (
    <Stage bg={P.arena}>
      <T x={90} y={300} kind="mono" size={30} fill={P.rosaD} ls={6} opacity={eo3(seg(t, 0.1, 0.6))}>
        EDICIÓN LIMITADA
      </T>
      <Reveal x={78} y={820} kind="disp" size={560} fill={P.nav} p={seg(t, 0.15, 0.8)}>
        50
      </Reveal>
      <Reveal x={SERIF_X} y={650} kind="serif" size={124} fill={P.rosa} p={seg(t, 0.4, 1.0)}>
        piezas
      </Reveal>
      <Reveal x={SERIF_X} y={774} kind="serif" size={124} fill={P.rosa} p={seg(t, 0.5, 1.1)}>
        por set
      </Reveal>
      {Array.from({ length: PIECES }, (_, i) => {
        const cx = GX + (i % COLS) * GAP;
        const cy = GY + Math.floor(i / COLS) * GAP;
        const appear = eo3(seg(t, 0.3 + i * 0.008, 0.7 + i * 0.008));
        const fill = pop(frame, fps, fillAt(i), 10);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={R * appear} fill="none" stroke={P.nav} strokeWidth={4} opacity={appear} />
            <circle cx={cx} cy={cy} r={R * fill} fill={P.rosa} />
          </g>
        );
      })}
      <T x={GX + (COLS - 1) * GAP + R} y={GY - R - 34} kind="mono" size={30} fill={P.nav} anchor="end" ls={2} opacity={eo3(seg(t, 0.5, 0.9))}>
        {`${pad2(sold)} / ${PIECES}`}
      </T>
      <Reveal x={84} y={1520} kind="serif" size={124} fill={P.nav} p={seg(t, 1.95, 2.55)}>
        Cuando se acaba,
      </Reveal>
      <Reveal x={84} y={1520 + 124 * 0.98} kind="serif" size={124} fill={P.rosa} p={seg(t, 2.1, 2.7)}>
        se acaba.
      </Reveal>
    </Stage>
  );
};
