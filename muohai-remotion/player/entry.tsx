import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Player, type PlayerRef } from '@remotion/player';
import { Reel } from '../src/Reel';
import { FPS, H, SCENE_STARTS, TOTAL_FRAMES, TRANSITION, W } from '../src/theme';

const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const sceneButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-scene]'));

const sceneAt = (frame: number) => SCENE_STARTS.reduce((k, start, i) => (frame >= start ? i : k), 0);

const App: React.FC = () => {
  const ref = useRef<PlayerRef>(null);

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    let shown = -1;
    const mark = (frame: number) => {
      const k = sceneAt(frame);
      if (k === shown) return;
      shown = k;
      sceneButtons.forEach((b, i) => b.setAttribute('aria-current', i === k ? 'true' : 'false'));
    };
    const onFrame = (e: { detail: { frame: number } }) => mark(e.detail.frame);
    player.addEventListener('frameupdate', onFrame);
    player.addEventListener('seeked', onFrame);
    mark(player.getCurrentFrame());
    const handlers = sceneButtons.map((b, i) => {
      const h = () => {
        player.seekTo(SCENE_STARTS[i] + (i > 0 ? TRANSITION : 0));
        mark(SCENE_STARTS[i] + (i > 0 ? TRANSITION : 0));
      };
      b.addEventListener('click', h);
      return h;
    });
    return () => {
      player.removeEventListener('frameupdate', onFrame);
      player.removeEventListener('seeked', onFrame);
      sceneButtons.forEach((b, i) => b.removeEventListener('click', handlers[i]));
    };
  }, []);

  return (
    <Player
      ref={ref}
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={W}
      compositionHeight={H}
      style={{ width: '100%', height: '100%' }}
      controls
      loop
      autoPlay={!reduce}
      initialFrame={reduce ? 500 : 0}
      clickToPlay
      doubleClickToFullscreen
      showVolumeControls={false}
      initiallyMuted
      acknowledgeRemotionLicense
    />
  );
};

const mount = document.getElementById('reel');
Promise.all([
  document.fonts.load('800 100px "MH Display"'),
  document.fonts.load('700 100px "MH Display"'),
  document.fonts.load('italic 400 100px "MH Serif"'),
  document.fonts.load('500 30px "MH Mono"'),
])
  .catch(() => undefined)
  .then(() => {
    if (mount) createRoot(mount).render(<App />);
  });
