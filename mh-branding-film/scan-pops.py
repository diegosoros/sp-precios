# Busca "pops" de un cuadro: diferencia entre cuadros 3× mayor que la de sus vecinos.
# Uso: python3 scan-pops.py video.mp4
import subprocess, sys
import numpy as np
v = sys.argv[1]; W = H = 180
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', v, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
fps = float(eval(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout.strip()))
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
hits = []
for i in range(2, len(d) - 2):
    nb = (d[i - 2] + d[i - 1] + d[i + 1] + d[i + 2]) / 4
    if d[i] > 3 * max(nb, .3) and d[i] > 2.0: hits.append((i + 1, (i + 1) / fps, d[i], nb))
print(f'{len(fr)} cuadros, {len(hits)} picos')
for f, t, a, b in hits: print(f'  cuadro {f:5d}  t={t:6.3f}s  diff={a:6.2f}  vecinos={b:5.2f}')
