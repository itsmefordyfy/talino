"""Checks a recording's timing file against the audio itself, by decoding the .m4a and measuring loudness: inside each sentence's
[start, end] the audio should be speech, and in the pause the timing claims between two sentences it should be silent. Also compares
the recording's real length with the length the timing was measured on. A clear sign that the file does not describe the audio.

  .venv/bin/python check-timing.py out/audio/am_michael/starter-01.m4a [more.m4a ...]
Exit status 1 if any file fails.
"""
import json, subprocess, sys, tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

RATE = 16000


def decode(m4a: Path) -> np.ndarray:
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'a.wav'
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', f'LEI16@{RATE}', '-c', '1', str(m4a), str(wav)], check=True)
        samples, _ = sf.read(wav)
    return samples.astype(np.float32)


def rms(samples: np.ndarray, a: float, b: float) -> float:
    window = samples[int(a * RATE): int(b * RATE)]
    return float(np.sqrt(np.mean(window ** 2))) if len(window) else 0.0


def check(m4a: Path) -> bool:
    timing = json.loads(m4a.with_suffix('.timing.json').read_text())
    samples = decode(m4a)
    length = len(samples) / RATE
    segments = timing['segments']
    speech = np.array([rms(samples, s + 0.1, e - 0.1) for s, e in segments if e - s > 0.5])
    # Silence the timing claims: the pause after a sentence, away from both neighbours by 60 ms (AAC smears a little).
    gaps = np.array([rms(samples, segments[i][1] + 0.06, segments[i + 1][0] - 0.06) for i in range(len(segments) - 1) if segments[i + 1][0] - segments[i][1] > 0.25])
    floor = float(np.median(speech)) * 0.2
    quiet_speech = int(np.sum(speech < floor))
    loud_gaps = int(np.sum(gaps > floor))
    # Where does the first sound really begin versus the first start? And the last end versus the real length?
    envelope = np.array([rms(samples, t, t + 0.02) for t in np.arange(0, length - 0.02, 0.02)])
    first_sound = float(np.argmax(envelope > floor) * 0.02)
    # Every sentence start should sit within 150 ms of a rise in loudness.
    late = 0
    for start, end in segments:
        if end - start < 0.5:
            continue
        before, after = rms(samples, max(0, start - 0.15), start - 0.02), rms(samples, start + 0.05, start + 0.25)
        if after < floor or before > after:
            late += 1
    ok = abs(length - timing['duration']) < 1.0 and quiet_speech == 0 and loud_gaps == 0 and late <= max(1, len(segments) // 25) and first_sound < segments[0][0] + 0.4
    print(f"{m4a.name}: {len(segments)} sentences | audio {length:.2f}s vs timing {timing['duration']:.2f}s | speech windows below the floor: {quiet_speech} | claimed pauses that are loud: {loud_gaps} | starts not at a rise: {late} | first sound at {first_sound:.2f}s (start {segments[0][0]:.2f}s) | {'OK' if ok else 'FAIL'}")
    return ok


if __name__ == '__main__':
    results = [check(Path(arg)) for arg in sys.argv[1:]]
    sys.exit(0 if all(results) else 1)
