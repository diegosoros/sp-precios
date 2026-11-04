export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const P = {
  nav: '#0B2A5B',
  navD: '#071D42',
  rosa: '#E5177B',
  rosaD: '#C10D64',
  rosaL: '#FF6FAE',
  rosaX: '#8C0848',
  sol: '#FFC23A',
  arena: '#FCEADF',
  laguna: '#2CC3B1',
} as const;

/** Duración de la ola entre escenas, en cuadros (0.7 s). */
export const TRANSITION = 21;

/**
 * Duración de cada escena en cuadros, contando la ola que la cubre al final.
 * Inicios resultantes: 0, 3.0, 5.7, 9.1, 12.2 y 14.5 s. Total: 525 cuadros (17.5 s).
 */
export const SCENES = [
  { id: 'amanecer', label: 'Amanecer y logotipo', frames: 111 },
  { id: 'alma', label: 'Alma hawaiana, sensualidad mexicana', frames: 102 },
  { id: 'edicion', label: 'Edición limitada de 50 piezas', frames: 123 },
  { id: 'reversible', label: 'Reversible, sin costuras, hecho a mano', frames: 114 },
  { id: 'coleccion', label: 'La colección, de Kai a Kaili', frames: 90 },
  { id: 'cierre', label: 'Cierre con muohai.com.mx', frames: 90 },
] as const;

export const SCENE_STARTS = SCENES.map((_, i) =>
  SCENES.slice(0, i).reduce((acc, s) => acc + s.frames - TRANSITION, 0),
);

export const TOTAL_FRAMES =
  SCENES.reduce((acc, s) => acc + s.frames, 0) - TRANSITION * (SCENES.length - 1);
