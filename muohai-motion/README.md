# MÜOHAI · Reel vertical

Motion graphics de 17.5 s en formato 9:16 (1080 × 1920, 30 fps) para Reels, TikTok e Historias.

- `muohai-reel.mp4`: el video final, sin audio.
- `index.html`: reproductor en el navegador, con escenas navegables.
- `reel.src.html`: fuente de la animación (canvas). Las fuentes se insertan al compilar.

## Escenas

| Inicio | Escena |
| --- | --- |
| 0.0 s | Amanecer y logotipo |
| 3.0 s | Alma hawaiana, sensualidad mexicana |
| 5.7 s | Edición limitada de 50 piezas |
| 9.1 s | Reversible, sin costuras, hecho a mano |
| 12.2 s | La colección, de Kai a Kaili |
| 14.5 s | Cierre con muohai.com.mx |

## Volver a generar

```bash
node build.js            # genera index.html con las fuentes incrustadas
node render.js           # renderiza muohai-reel.mp4 (requiere Playwright y ffmpeg)
```

Tipografías (licencia OFL): Bricolage Grotesque, Instrument Serif y DM Mono.
