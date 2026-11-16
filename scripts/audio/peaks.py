"""Waveform shapes for the Listen player: for each recording, 192 loudness values (about one per word or two, so the shape follows the speaking) (0 to 1) saved next to it as
<lessonId>.peaks.json ({"peaks": [...]}), a few hundred bytes. The player draws them as the waveform it plays through.
Reads the finished .m4a files, so it can be run at any time (it skips lessons that already have one):

  .venv/bin/python peaks.py                 # every recording in out/audio/am_michael
  .venv/bin/python peaks.py --voice am_michael --redo
"""
import argparse, json, subprocess, tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).parent
BARS = 192


def peaks_of(samples: np.ndarray, bars: int = BARS) -> list[float]:
    """Loudness per slice of the recording, evened out so quiet speech still shows (0 to 1, two decimals)."""
    samples = np.abs(samples.astype(np.float32))
    edges = np.linspace(0, len(samples), bars + 1, dtype=int)
    rms = np.array([np.sqrt(np.mean(samples[a:b] ** 2)) if b > a else 0.0 for a, b in zip(edges[:-1], edges[1:])])
    # Speech is about as loud from one slice to the next, so stretch the spread between the quietest and loudest slices to fill
    # the height (never below 0.2, so a pause is still a visible bar): the shape shows where the lesson breathes.
    low, high = np.percentile(rms, 5), np.percentile(rms, 98)
    spread = np.clip((rms - low) / ((high - low) or 1.0), 0, 1)
    return [round(float(0.2 + 0.8 * v), 2) for v in spread]


def peaks_for_file(m4a: Path) -> list[float]:
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'a.wav'
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', str(m4a), str(wav)], check=True)
        samples, _ = sf.read(wav)
    return peaks_of(samples)


def write_peaks(m4a: Path, redo: bool = False) -> bool:
    target = m4a.with_suffix('.peaks.json')
    if target.exists() and not redo:
        return False
    target.write_text(json.dumps({'peaks': peaks_for_file(m4a)}, separators=(',', ':')))
    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--voice', default='am_michael')
    parser.add_argument('--redo', action='store_true')
    args = parser.parse_args()
    made = [f.name for f in sorted((HERE / 'out' / 'audio' / args.voice).glob('*.m4a')) if write_peaks(f, args.redo)]
    print(f'{len(made)} waveform files written')
