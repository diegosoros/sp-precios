import { loadFont } from '@remotion/fonts';
import bricolage from './fonts/bricolage.woff2';
import serifItalic from './fonts/instr-italic.woff2';
import mono from './fonts/dmmono500.woff2';

// Tipografías (OFL): Bricolage Grotesque variable (ancho 75–100 %), Instrument Serif itálica y DM Mono.
loadFont({ family: 'MH Display', url: bricolage, format: 'woff2', weight: '200 800', stretch: '75% 100%', style: 'normal' });
loadFont({ family: 'MH Serif', url: serifItalic, format: 'woff2', weight: '400', style: 'italic' });
loadFont({ family: 'MH Mono', url: mono, format: 'woff2', weight: '500', style: 'normal' });
