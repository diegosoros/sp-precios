# viste. — película de lanzamiento de MH Branding

Video cuadrado de 1440×1440, 27 s, 120 BPM (54 beats), una sola toma. Mapa de beats en `BEATMAP.md`.

## Archivos

- `film.html` — la película. Todo se calcula a partir de `t` dentro de `seek(t)` (resortes de forma cerrada, sin transiciones CSS ni timers).
- `render-film.js` — renderiza con Playwright desde un servidor local (el clip de la pared se carga como blob URL).
- `build-audio.py` — arma la pista: canción cortada en tiempos fuertes + efectos colocados por su pico + loudnorm a −14 LUFS.
- `scan-pops.py` — busca saltos de un cuadro (diferencia 3× la de sus vecinos).
- `stills.html`, `render-stills.js` — las 4 imágenes de muestra.

## Archivos externos (no están en git)

Colócalos en estas rutas antes de renderizar:

| Ruta | Origen |
|---|---|
| `assets/music/house-02.mp3` | Mixkit — House 02 |
| `assets/sfx/click.wav` | Mixkit — Select click (1109) |
| `assets/sfx/pop.wav` | Mixkit — Hard pop click (2364) |
| `assets/sfx/woosh.wav` | Mixkit — Fast air woosh (2607) |
| `assets/sfx/swoosh.wav` | Mixkit — Cinematic wind swoosh (1471) |
| `assets/sfx/slide.wav` | Mixkit — Futuristic slide (1533) |
| `assets/sfx/punch.wav` | Mixkit — Hard and quick punch (2143) |
| `assets/sfx/ding.wav` | Mixkit — Toy drums and bell ding (560) |
| `assets/sfx/typing.wav` | Mixkit — Slow typing on a keyboard (2532) |
| `assets/footage/pexels-6945207.mp4` | Pexels — video 6945207 (pared con sombras de palmera) |

El clip de la pared se re-codifica all-intra, en cuadrado y con tono cálido:

```
ffmpeg -ss 2.9 -t 3.0 -i assets/footage/pexels-6945207.mp4 -an \
  -vf "crop=1080:1080:0:250,scale=1440:1440:flags=lanczos,colorchannelmixer=rr=1.035:gg=1.0:bb=0.93,eq=brightness=0.02:saturation=0.9" \
  -c:v libx264 -g 1 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart assets/footage/wall-intra.mp4
```

## Renderizar

```
python3 build-audio.py            # assets/audio/viste-mix.wav
node render-film.js draft         # 30 fps, revisión rápida
node render-film.js final viste.mp4   # 60 fps, 4 subcuadros (tmix) + audio
python3 scan-pops.py viste.mp4
```
