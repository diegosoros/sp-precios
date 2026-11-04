import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Progreso 0→1 entre los segundos a y b. */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const eo3 = (p: number) => 1 - Math.pow(1 - p, 3);
export const eo4 = (p: number) => 1 - Math.pow(1 - p, 4);
export const eio3 = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/** Tiempo local de la escena en segundos, más el cuadro y los fps. */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, frame, fps };
};

/** Resorte con rebote que arranca en el segundo `at`. */
export const pop = (frame: number, fps: number, at: number, damping = 11) => {
  const f = frame - Math.round(at * fps);
  if (f <= 0) return 0;
  return spring({ frame: f, fps, config: { damping, stiffness: 170, mass: 0.9 } });
};

export const pad2 = (n: number) => (n < 10 ? '0' : '') + n;
