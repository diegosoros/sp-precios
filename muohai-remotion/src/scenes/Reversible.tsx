import React from 'react';
import { AbsoluteFill } from 'remotion';
import { eio3, eo3, seg, useTime } from '../anim';
import { Hibiscus, Stage } from '../components/brand';
import { Reveal, T } from '../components/type';
import { H, P, W } from '../theme';

type Side = 'A' | 'B';
type Piece = 'top' | 'bottom';

const cup = (s: number) => {
  const X = (x: number) => 540 + s * x;
  return `M${X(22)} 690Q${X(26)} 540 ${X(124)} 400Q${X(236)} 540 ${X(268)} 690Q${X(146)} 716 ${X(22)} 690Z`;
};
const SHAPES: Record<Piece, string[]> = {
  top: [cup(-1), cup(1)],
  bottom: ['M300 830Q540 862 780 830C770 912 640 1000 588 1086L492 1086C440 1000 310 912 300 830Z'],
};

const TopStrings: React.FC = () => (
  <g fill="none" stroke={P.arena} strokeWidth={5} strokeLinecap="round">
    <path d="M416 402Q470 300 512 232" />
    <path d="M664 402Q610 300 568 232" />
    <ellipse cx={522} cy={226} rx={22} ry={12} transform="rotate(-28.6 522 226)" />
    <ellipse cx={558} cy={226} rx={22} ry={12} transform="rotate(28.6 558 226)" />
    <path d="M272 690Q190 706 110 700" />
    <path d="M808 690Q890 706 970 700" />
    <path d="M518 690L562 690" />
    <circle cx={540} cy={690} r={12} />
  </g>
);

const BottomStrings: React.FC = () => (
  <g fill="none" stroke={P.arena} strokeWidth={5} strokeLinecap="round">
    {([[300, -1], [780, 1]] as const).map(([x, d]) => (
      <g key={x}>
        <path d={`M${x} 830L${x + d * 72} 822`} />
        <ellipse cx={x + d * 90} cy={818} rx={18} ry={10} transform={`rotate(${d * 22.9} ${x + d * 90} 818)`} />
        <path d={`M${x + d * 86} 826Q${x + d * 80} 870 ${x + d * 92} 904`} />
        <path d={`M${x + d * 96} 826Q${x + d * 112} 866 ${x + d * 108} 896`} />
      </g>
    ))}
  </g>
);

/** Estampado A: rayas de sol sobre rosa. Estampado B: hibiscos sobre sol. */
const Print: React.FC<{ id: string; side: Side }> = ({ id, side }) =>
  side === 'A' ? (
    <pattern id={id} patternUnits="userSpaceOnUse" width={48} height={48} patternTransform="rotate(-29)">
      <rect width={48} height={48} fill={P.rosa} />
      <rect width={16} height={48} fill={P.sol} />
    </pattern>
  ) : (
    <pattern id={id} patternUnits="userSpaceOnUse" width={68} height={136}>
      <rect width={68} height={136} fill={P.sol} />
      <Hibiscus cx={34} cy={34} R={24} rot={0.4} color={P.rosa} core={P.rosaX} />
      <Hibiscus cx={0} cy={102} R={24} rot={1.1} color={P.rosa} core={P.rosaX} />
      <Hibiscus cx={68} cy={102} R={24} rot={1.1} color={P.rosa} core={P.rosaX} />
    </pattern>
  );

const Face: React.FC<{ piece: Piece; side: Side; shade: number }> = ({ piece, side, shade }) => {
  const id = `print-${piece}-${side}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <Print id={id} side={side} />
      </defs>
      {piece === 'top' ? <TopStrings /> : <BottomStrings />}
      {SHAPES[piece].map((d) => (
        <g key={d}>
          <path d={d} fill={`url(#${id})`} />
          <path d={d} fill="#040E22" opacity={shade} />
          <path d={d} fill="none" stroke={P.arena} strokeWidth={4} />
        </g>
      ))}
    </svg>
  );
};

/** Giro en 3D sobre el eje vertical: el frente es el lado A y la espalda el lado B. */
const Flip: React.FC<{ piece: Piece; angle: number; y: number }> = ({ piece, angle, y }) => {
  const shade = (1 - Math.abs(Math.cos((angle * Math.PI) / 180))) * 0.45;
  return (
    <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: `540px ${y}px` }}>
      <AbsoluteFill style={{ transform: `rotateY(${angle}deg)`, transformOrigin: `540px ${y}px`, transformStyle: 'preserve-3d' }}>
        <AbsoluteFill style={{ backfaceVisibility: 'hidden' }}>
          <Face piece={piece} side="A" shade={shade} />
        </AbsoluteFill>
        <AbsoluteFill style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <Face piece={piece} side="B" shade={shade} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 9.1 s — El bikini gira para mostrar sus dos lados. */
export const Reversible: React.FC = () => {
  const { t } = useTime();
  const enter = eo3(seg(t, 0, 0.8));
  const topAngle = 180 * (eio3(seg(t, 0.9, 1.5)) + eio3(seg(t, 2.0, 2.6)));
  const bottomAngle = 180 * (eio3(seg(t, 1.0, 1.6)) + eio3(seg(t, 2.1, 2.7)));
  const side = Math.cos((topAngle * Math.PI) / 180) >= 0 ? 'LADO A' : 'LADO B';
  const serif = 84;
  return (
    <AbsoluteFill>
      <Stage bg={P.nav}>
        <T x={90} y={300} kind="mono" size={30} fill={P.laguna} ls={6} opacity={eo3(seg(t, 0.2, 0.6))}>
          {side}
        </T>
        <T x={990} y={300} kind="mono" size={30} fill={P.arena} anchor="end" ls={4} opacity={eo3(seg(t, 0.3, 0.7))}>
          1 PIEZA · 2 LADOS
        </T>
        <Reveal x={88} y={1330} kind="disp" size={248} fill={P.arena} p={seg(t, 0.3, 0.95)}>
          Reversible.
        </Reveal>
        <Reveal x={90} y={1330 + serif * 1.3} kind="serif" size={serif} fill={P.sol} p={seg(t, 0.55, 1.15)}>
          Sin costuras. Hecho a mano.
        </Reveal>
        <T x={90} y={1330 + serif * 1.3 + 80} kind="mono" size={30} fill={P.laguna} ls={6} opacity={eo3(seg(t, 1.5, 1.9))}>
          4 OUTFITS EN 1
        </T>
      </Stage>
      <AbsoluteFill style={{ opacity: enter, transform: `translateY(${(1 - enter) * 60}px)` }}>
        <Flip piece="top" angle={topAngle} y={545} />
        <Flip piece="bottom" angle={bottomAngle} y={958} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
