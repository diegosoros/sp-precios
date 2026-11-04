import React from 'react';
import { eo3, lerp, seg, useTime } from '../anim';
import { Hibiscus, Stage } from '../components/brand';
import { Reveal, T } from '../components/type';
import { P } from '../theme';

const SERIF = 219;
const DISPLAY = 224;

/** 3.0 s — Inspiración hawaiana con la sensualidad de la cultura mexicana. */
export const Alma: React.FC = () => {
  const { t } = useTime();
  const bloom = eo3(seg(t, 0, 1.3));
  return (
    <Stage bg={P.rosa}>
      <Hibiscus cx={880} cy={1580} R={480 * lerp(0.72, 1, bloom)} rot={0.3 + t * 0.2} color={P.rosaD} stamen={P.sol} core={P.rosaX} />
      <Hibiscus cx={990} cy={250} R={150 * bloom} rot={-0.4 - t * 0.28} color={P.rosaL} stamen={P.arena} core={P.rosaD} />
      <T x={90} y={300} kind="mono" size={30} fill={P.arena} ls={6} opacity={eo3(seg(t, 0.1, 0.6))}>
        CULTURA HAWAIANA × MEXICANA
      </T>
      <Reveal x={84} y={640} kind="serif" size={SERIF} fill={P.arena} p={seg(t, 0.2, 0.9)}>
        Alma
      </Reveal>
      <Reveal x={84} y={860} kind="serif" size={SERIF} fill={P.arena} p={seg(t, 0.35, 1.05)}>
        hawaiana,
      </Reveal>
      <Reveal x={88} y={1120} kind="disp" size={DISPLAY} fill={P.nav} p={seg(t, 0.85, 1.5)}>
        sensualidad
      </Reveal>
      <Reveal x={88} y={1120 + DISPLAY * 0.86} kind="disp" size={DISPLAY} fill={P.nav} p={seg(t, 1.0, 1.65)}>
        mexicana.
      </Reveal>
    </Stage>
  );
};
