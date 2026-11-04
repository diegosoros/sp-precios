import React from 'react';
import { AbsoluteFill } from 'remotion';
import { eo4, pop, seg } from '../anim';
import { H, P, W } from '../theme';

/** Sol cempasúchil con franjas recortadas en la mitad baja. */
export const Sun: React.FC<{ id: string; cx: number; cy: number; r: number; cut: string }> = ({ id, cx, cy, r, cut }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r + 1} />
      </clipPath>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={P.sol} />
    <g clipPath={`url(#${id})`}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={cx - r - 4} y={cy + r * (0.2 + i * 0.19)} width={2 * r + 8} height={r * (0.022 + i * 0.028)} fill={cut} />
      ))}
    </g>
  </g>
);

/** Mar con líneas de oleaje que se abren hacia el frente. */
export const Sea: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const n = 16;
  const lines = [];
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1);
    const y = top + 18 + Math.pow(k, 1.6) * (H - top - 40);
    const amp = 3 + k * 14;
    const fr = 0.011 - k * 0.005;
    const sp = 0.9 + k * 1.1;
    let d = '';
    for (let x = -10; x <= W + 10; x += 10) {
      const yy = y + Math.sin(x * fr + t * sp + i * 1.7) * amp;
      d += `${x === -10 ? 'M' : 'L'}${x} ${yy.toFixed(1)}`;
    }
    lines.push(
      <path key={i} d={d} fill="none" stroke={P.laguna} strokeLinecap="round" strokeWidth={2 + k * 3} opacity={0.55 * (0.45 + k * 0.55)} />,
    );
  }
  return (
    <g>
      <rect x={0} y={top} width={W} height={H - top} fill={P.navD} />
      {lines}
    </g>
  );
};

/** Reflejo del sol sobre el agua. */
export const Reflection: React.FC<{ t: number; cx: number; top: number; r: number; p: number }> = ({ t, cx, top, r, p }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => {
      const k = i / 8;
      const y = top + 24 + i * 30 + k * k * 70;
      const w = r * 1.5 * (1 - k * 0.7) * (0.75 + 0.25 * Math.sin(t * 3.1 + i * 1.9)) * p;
      const h = 8 + k * 6;
      return (
        <rect key={i} x={cx - w / 2 + Math.sin(t * 2 + i) * 12} y={y} width={Math.max(0, w)} height={h} rx={h / 2} fill={P.sol} opacity={(1 - k * 0.65) * p} />
      );
    })}
  </g>
);

/* Anchos de cada letra a 100 px en Bricolage Grotesque 800, ancho 75 %. */
const LETTERS = ['M', 'U', 'O', 'H', 'A', 'I'];
const WM100 = [63.2, 42.7, 44.1, 42.5, 44.1, 19.8];
const CAP100 = 66;
const TRACK = 0.035;

/** Logotipo tipográfico: las letras suben una por una y la diéresis son dos soles. */
export const Wordmark: React.FC<{
  cx: number;
  base: number;
  width: number;
  t: number;
  frame: number;
  fps: number;
  start: number;
}> = ({ cx, base, width, t, frame, fps, start }) => {
  const total100 = WM100.reduce((a, b) => a + b, 0) + TRACK * 100 * (LETTERS.length - 1);
  const size = (width / total100) * 100;
  const cap = (CAP100 * size) / 100;
  const ws = WM100.map((w) => (w * size) / 100);
  const xs: number[] = [];
  let x = cx - width / 2;
  ws.forEach((w) => {
    xs.push(x);
    x += w + TRACK * size;
  });
  const top = base - cap - size * 0.08;
  const dot = pop(frame, fps, start + 0.62, 9);
  const ux = xs[1] + ws[1] / 2;
  const dy = base - cap - size * 0.15;
  const gap = ws[1] * 0.23;
  return (
    <g>
      <svg x={0} y={top} width={W} height={cap + size * 0.3} overflow="hidden">
        {LETTERS.map((l, i) => {
          const p = eo4(seg(t, start + i * 0.065, start + 0.6 + i * 0.065));
          if (p <= 0) return null;
          return (
            <text
              key={l}
              x={xs[i]}
              y={base - top + (1 - p) * cap * 1.3}
              fill={P.arena}
              style={{ fontFamily: '"MH Display", sans-serif', fontWeight: 800, fontStretch: '75%', fontSize: size }}
            >
              {l}
            </text>
          );
        })}
      </svg>
      <circle cx={ux - gap} cy={dy} r={size * 0.07 * dot} fill={P.sol} />
      <circle cx={ux + gap} cy={dy} r={size * 0.07 * dot} fill={P.sol} />
    </g>
  );
};

const petal = (R: number) =>
  `M0 0C${-R * 0.66} ${-R * 0.26} ${-R * 0.8} ${-R * 0.94} ${-R * 0.14} ${-R}Q0 ${-R * 0.9} ${R * 0.14} ${-R}C${R * 0.8} ${-R * 0.94} ${R * 0.66} ${-R * 0.26} 0 0Z`;

/** Hibisco de cinco pétalos con nervaduras, centro oscuro y estambre. */
export const Hibiscus: React.FC<{
  cx: number;
  cy: number;
  R: number;
  rot: number;
  color: string;
  core?: string;
  stamen?: string;
}> = ({ cx, cy, R, rot, color, core, stamen }) => {
  if (R <= 0) return null;
  const eye = Array.from({ length: 41 }, (_, e) => {
    const a = (e / 40) * Math.PI * 2;
    const rr = R * (0.24 + 0.035 * Math.sin(a * 5));
    return `${e === 0 ? 'M' : 'L'}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
  }).join('') + 'Z';
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${(rot * 180) / Math.PI})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={petal(R)} fill={color} transform={`rotate(${i * 72})`} />
      ))}
      {core && R > 60
        ? [0, 1, 2, 3, 4].map((v) => (
            <g key={v} transform={`rotate(${v * 72})`} opacity={0.55}>
              {[-1, 0, 1].map((s) => (
                <path
                  key={s}
                  d={`M0 0Q${s * R * 0.22} ${-R * 0.45} ${s * R * 0.3} ${-R * (s === 0 ? 0.86 : 0.74)}`}
                  fill="none"
                  stroke={core}
                  strokeLinecap="round"
                  strokeWidth={s === 0 ? R * 0.018 : R * 0.011}
                />
              ))}
            </g>
          ))
        : null}
      {core ? <path d={eye} fill={core} /> : null}
      {stamen ? (
        <g transform="rotate(36)">
          <path d={`M0 0Q${R * 0.1} ${-R * 0.5} ${R * 0.02} ${-R * 0.92}`} fill="none" stroke={stamen} strokeLinecap="round" strokeWidth={Math.max(1.5, R * 0.032)} />
          {Array.from({ length: 6 }, (_, j) => {
            const a = -Math.PI / 2 + (j - 2.5) * 0.5;
            return <circle key={j} cx={R * 0.02 + Math.cos(a) * R * 0.075} cy={-R * 0.92 + Math.sin(a) * R * 0.06} r={R * 0.03} fill={stamen} />;
          })}
          {Array.from({ length: 5 }, (_, m) => {
            const yy = -R * (0.62 + m * 0.055);
            const xx = R * (0.075 - m * 0.012);
            return (
              <g key={m}>
                <circle cx={xx + R * 0.045} cy={yy} r={R * 0.02} fill={stamen} />
                <circle cx={xx - R * 0.045} cy={yy} r={R * 0.02} fill={stamen} />
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

/** Textura fija de papel impreso sobre todo el video. */
export const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'soft-light', opacity: 0.55 }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <filter id="mh-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#mh-grain)" />
    </svg>
  </AbsoluteFill>
);

/** Lienzo SVG de tamaño completo para cada escena. */
export const Stage: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
      {children}
    </svg>
  </AbsoluteFill>
);
