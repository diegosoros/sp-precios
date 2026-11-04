# MÜOHAI · Reel en Remotion

Motion graphics de 17.5 s en formato 9:16 (1080 × 1920, 30 fps, 525 cuadros) para Reels, TikTok e Historias, hecho con [Remotion](https://www.remotion.dev/) 4.0.536.

- `out/muohai-reel.mp4`: el video final, sin audio.
- `src/`: la composición `MuohaiReel` (React + SVG).
- `player/`: página web que reproduce la misma composición con `@remotion/player`.

## Escenas

| Inicio | Escena | Archivo |
| --- | --- | --- |
| 0.0 s | Amanecer y logotipo | `src/scenes/Amanecer.tsx` |
| 3.0 s | Alma hawaiana, sensualidad mexicana | `src/scenes/Alma.tsx` |
| 5.7 s | Edición limitada de 50 piezas | `src/scenes/Edicion.tsx` |
| 9.1 s | Reversible, sin costuras, hecho a mano | `src/scenes/Reversible.tsx` |
| 12.2 s | La colección, de Kai a Kaili | `src/scenes/Coleccion.tsx` |
| 14.5 s | Cierre con muohai.com.mx | `src/scenes/Cierre.tsx` |

Las escenas se encadenan con `TransitionSeries` y una transición propia de ola (`src/components/WaveWipe.tsx`). La paleta y las duraciones están en `src/theme.ts`.

## Uso

```bash
npm install
npm run studio    # abre Remotion Studio para previsualizar y editar
npm run render    # genera out/muohai-reel.mp4
npm run still     # genera out/poster.png (cuadro 500)
npm run player    # genera dist/index.html con el reproductor web
```

Si Remotion no puede descargar su navegador, indica uno existente con `--browser-executable=/ruta/a/chrome-headless-shell`.

## Licencias

- Remotion es gratis para personas y empresas de hasta 3 empleados; las empresas más grandes necesitan una [licencia de empresa](https://www.remotion.pro/license).
- Tipografías (OFL): Bricolage Grotesque, Instrument Serif y DM Mono.
