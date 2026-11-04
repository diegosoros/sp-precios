import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import './fonts';
import { Grain } from './components/brand';
import { waveWipe } from './components/WaveWipe';
import { Alma } from './scenes/Alma';
import { Amanecer } from './scenes/Amanecer';
import { Cierre } from './scenes/Cierre';
import { Coleccion } from './scenes/Coleccion';
import { Edicion } from './scenes/Edicion';
import { Reversible } from './scenes/Reversible';
import { P, SCENES, TRANSITION } from './theme';

const COMPONENTS = [Amanecer, Alma, Edicion, Reversible, Coleccion, Cierre];
/** Color de la espuma de la ola que trae cada escena (a partir de la segunda). */
const FOAM = [P.arena, P.rosa, P.sol, P.nav, P.rosa];

const timing = linearTiming({ durationInFrames: TRANSITION, easing: Easing.inOut(Easing.cubic) });

export const Reel: React.FC = () => {
  const items: React.ReactNode[] = [];
  COMPONENTS.forEach((Scene, i) => {
    if (i > 0) {
      items.push(<TransitionSeries.Transition key={`ola-${i}`} timing={timing} presentation={waveWipe({ foam: FOAM[i - 1] })} />);
    }
    items.push(
      <TransitionSeries.Sequence key={SCENES[i].id} durationInFrames={SCENES[i].frames} name={SCENES[i].label}>
        <Scene />
      </TransitionSeries.Sequence>,
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: P.nav }}>
      <TransitionSeries>{items}</TransitionSeries>
      <Grain />
    </AbsoluteFill>
  );
};
