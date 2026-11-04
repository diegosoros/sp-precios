import React from 'react';
import { Composition } from 'remotion';
import { Reel } from './Reel';
import { FPS, H, TOTAL_FRAMES, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="MuohaiReel" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
