# Arma la pista de audio de viste. (27 s): canción a 120 BPM cortada en tiempos fuertes + efectos colocados por su pico medido.
# Uso: python3 build-audio.py   → assets/audio/viste-mix.wav (normalizado a -14 LUFS)
import json, os, subprocess
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
A = lambda *p: os.path.join(HERE, 'assets', *p)
SR, DUR = 48000, 27.0

def load(path, extra=()):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, *extra, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()

def peak(x):   # pico de la envolvente (5 ms)
    env = np.convolve(np.abs(x).mean(1), np.ones(240) / 240, 'same')
    return env.argmax() / SR

def fade(x, a=.008, b=.012):
    x = x.copy(); na, nb = int(a * SR), int(b * SR)
    x[:na] *= np.linspace(0, 1, na)[:, None]; x[-nb:] *= np.linspace(1, 0, nb)[:, None]
    return x

# ---------- canción: House 02 (Mixkit), 123.01 BPM → 120 BPM ----------
SONG_BPM = 123.01
k = SONG_BPM / 120                                    # factor de tiempo tras estirar
song = load(A('music', 'house-02.mp3'), ['-af', f'atempo={120 / SONG_BPM:.6f}'])
grid = lambda orig_s: orig_s * k                      # tiempo original → tiempo estirado
BEAT = 60 / 120         # la cuadrícula del bombo va un tiempo antes de la estimada por energía de compás
DOWN = grid(2.431) - BEAT     # tiempo fuerte, 3 compases antes del drop
DROP = grid(8.284) - BEAT     # primer bombo del drop
BREAK = grid(101.935) - BEAT  # primer tiempo sin bombo (outro sin graves)
SEG = [                 # (inicio en la película, inicio en la canción estirada, duración)
    (0.0, DOWN, 22.0),  # el zoom cae en el drop (0:06)
    (22.0, BREAK, 4.0), # la pared en la parte tranquila
    (26.0, DROP, 1.0),  # regresa el beat con el wordmark
]
music = np.zeros((int(DUR * SR), 2), np.float32)
for t0, s0, d in SEG:
    a, n = int(s0 * SR), int(d * SR)
    music[int(t0 * SR): int(t0 * SR) + n] += fade(song[a:a + n])
assert abs((DROP - DOWN) - 6.0) < .002, 'el drop debe caer en 0:06'

# ---------- efectos (Mixkit) ----------
S = {n: load(A('sfx', f'{n}.wav')) for n in ['click', 'pop', 'woosh', 'swoosh', 'slide', 'punch', 'ding', 'typing']}
S['typing'] = fade(S['typing'][:int(1.05 * SR)], .004, .15)    # un tramo de tecleo para "Estampando"
PK = {n: peak(x) for n, x in S.items()}
PK['typing'] = .09                                              # primera tecla del tramo
# (tiempo del evento, efecto, dB)
CUES = [
    (.78, 'woosh', -12), (1.05, 'pop', -6), (2.25, 'click', 0), (2.62, 'woosh', -13), (3.0, 'pop', -3),
    (3.62, 'woosh', -15), (4.0, 'pop', -8), (4.5, 'pop', -10), (5.06, 'woosh', -12), (5.5, 'click', 0),
    (5.86, 'swoosh', -6), (6.0, 'punch', -3),
    (6.5, 'pop', -12), (6.62, 'pop', -15), (6.74, 'pop', -15), (7.0, 'pop', -12), (7.12, 'pop', -15),
    (7.72, 'woosh', -14), (8.15, 'woosh', -10), (8.24, 'pop', -12), (8.5, 'click', 0), (8.8, 'pop', -10),
    (9.0, 'click', -4), (9.45, 'slide', -6), (10.0, 'click', -6), (10.2, 'woosh', -10), (10.62, 'pop', -8),
    (11.08, 'pop', -12), (11.16, 'swoosh', -6), (11.76, 'woosh', -14), (12.16, 'swoosh', -8), (12.3, 'pop', -12),
    (12.72, 'woosh', -15), (13.25, 'woosh', -8), (13.62, 'pop', -8), (13.96, 'slide', -11),
    (14.1, 'click', -4), (14.5, 'pop', -10), (14.76, 'woosh', -10), (15.2, 'woosh', -10), (15.5, 'click', -4),
    (15.66, 'pop', -10), (16.2, 'woosh', -12), (16.64, 'pop', -14), (17.0, 'click', 0), (17.16, 'slide', -14),
    (17.5, 'click', 0), (18.2, 'woosh', -10), (18.6, 'click', 0),
    (19.12, 'pop', -6), (19.6, 'typing', -2), (20.55, 'woosh', -12), (20.66, 'pop', -12), (21.62, 'ding', -2),
    (22.04, 'punch', -2), (22.2, 'swoosh', -6), (23.1, 'woosh', -14), (23.5, 'click', -2), (23.6, 'woosh', -16),
    (24.0, 'click', -2), (24.66, 'swoosh', -8), (25.12, 'woosh', -12), (25.56, 'pop', -8), (26.0, 'pop', -4),
]
fx = np.zeros_like(music)
for t, n, db in CUES:
    x = S[n] * (10 ** ((db - 6) / 20)); start = int((t - PK[n]) * SR)
    a = max(0, -start); x = x[a:]; start = max(0, start)
    end = min(len(fx), start + len(x)); fx[start:end] += x[:end - start]

mix = music + fx
os.makedirs(A('audio'), exist_ok=True)
raw_path = A('audio', 'viste-premix.wav')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', raw_path], input=mix.astype(np.float32).tobytes(), check=True)

# ---------- loudnorm a -14 LUFS (dos pasadas) ----------
LN = 'loudnorm=I=-14:TP=-1.0:LRA=11'
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', raw_path, '-af', f'{LN}:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
out = A('audio', 'viste-mix.wav')
af = f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw_path, '-af', af, '-ar', str(SR), '-c:a', 'pcm_s24le', out], check=True)
os.remove(raw_path)
# ajuste fino: el modo lineal puede quedar unas décimas arriba por el techo de pico
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', out, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True)
got = float([l for l in r.stderr.splitlines() if l.strip().startswith('I:')][-1].split()[1])
tmp = out.replace('.wav', '-tmp.wav'); os.replace(out, tmp)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', f'volume={-14 - got:.2f}dB', '-c:a', 'pcm_s24le', out], check=True); os.remove(tmp)
print('picos medidos:', {n: round(v, 3) for n, v in PK.items()})
print('entrada:', m['input_i'], 'LUFS →', out)
