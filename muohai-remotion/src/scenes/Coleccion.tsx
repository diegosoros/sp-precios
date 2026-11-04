import React from 'react';
import { eo3, seg, useTime } from '../anim';
import { Stage } from '../components/brand';
import { Reveal, T } from '../components/type';
import { P, W } from '../theme';

const ROWS = [
  ['KAI', 'KAINANI'],
  ['ALANA', 'NALI'],
  ['VENUS', 'HULUHULU'],
  ['KEANU', 'KAILI'],
];
/* Ancho de cada nombre a 250 px en Bricolage Grotesque 800, ancho 75 %. */
const NAME_W: Record<string, number> = {
  KAI: 270,
  KAINANI: 669.75,
  ALANA: 534.25,
  NALI: 362.75,
  VENUS: 521.25,
  HULUHULU: 800,
  KEANU: 527,
  KAILI: 402.5,
};
const SIZE = 250;
const GAP = 120;
const SPEED = 170;

/** 12.2 s — Los nombres de los sets corren en franjas alternas. */
export const Coleccion: React.FC = () => {
  const { t } = useTime();
  return (
    <Stage bg={P.sol}>
      <T x={90} y={300} kind="mono" size={30} fill={P.nav} ls={6} opacity={eo3(seg(t, 0.1, 0.6))}>
        LA COLECCIÓN
      </T>
      {ROWS.map((names, r) => {
        const dir = r % 2 ? 1 : -1;
        const color = r % 2 ? P.rosa : P.nav;
        const dot = r % 2 ? P.nav : P.rosa;
        const y = 560 + r * 255;
        const enter = eo3(seg(t, 0.02 + r * 0.08, 0.75 + r * 0.08));
        const period = names.reduce((acc, n) => acc + NAME_W[n] + GAP, 0);
        const shift = dir * t * SPEED - dir * (1 - enter) * W + r * 237;
        let x = ((shift % period) + period) % period - period;
        const items: React.ReactNode[] = [];
        for (let k = 0; x < W + 10; k++) {
          const name = names[k % names.length];
          items.push(
            <T key={`t${k}`} x={x} y={y} kind="disp" size={SIZE} fill={color}>
              {name}
            </T>,
          );
          x += NAME_W[name];
          items.push(<circle key={`c${k}`} cx={x + GAP / 2} cy={y - SIZE * 0.3} r={15} fill={dot} />);
          x += GAP;
        }
        return <g key={r}>{items}</g>;
      })}
      <Reveal x={88} y={1560} kind="serif" size={92} fill={P.nav} p={seg(t, 0.7, 1.3)}>
        Tanga, brasileño o cheeky.
      </Reveal>
    </Stage>
  );
};
