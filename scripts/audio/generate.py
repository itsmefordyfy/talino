"""Turns lesson scripts (export-scripts.cjs) into spoken audio with Kokoro, a free open-source voice that runs
on this Mac with no internet and no account. Output: out/audio/<voice>/<lessonId>.m4a (AAC, mono), made with
macOS's own afconvert, so nothing else needs installing.

  .venv/bin/python generate.py --voice am_puck --lessons starter-01 developer-03
  .venv/bin/python generate.py --voice am_puck --all          (about 14 hours of speech: leave it running)
  .venv/bin/python generate.py --audition                          (one short sample in each candidate male voice)
  .venv/bin/python generate.py --audition-female                   (the same in the candidate female voices)

A lesson is done when it has BOTH its recording and its timing file. Each sentence is spoken on its own (out/scripts/<id>.segments.json,
from export-scripts.cjs), so the exact start and end of every sentence is known and written to <id>.timing.json: the app highlights the
sentence being spoken, and a tap on a sentence jumps to it, from those numbers (never from an estimate by text length). Lessons with no
recording come first, then recordings made before timing existed are made again with it. An interrupted run carries on where it stopped.
"""
import argparse, json, os, re, subprocess, sys, tempfile, time
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from peaks import write_peaks
from word_timing import segment_words

HERE = Path(__file__).parent
SCRIPTS = HERE / 'out' / 'scripts'
SAMPLE_RATE = 24000
# Kokoro v1.0's male voices, best-graded first by its author (American, then British).
MALE_VOICES = ['am_michael', 'am_fenrir', 'am_puck', 'am_liam', 'am_eric', 'am_onyx', 'am_adam', 'bm_george', 'bm_fable', 'bm_daniel', 'bm_lewis']
# Its female voices, best-graded first (grades from Kokoro's VOICES.md: af_heart A, af_bella A-, then B- and below).
FEMALE_VOICES = ['af_heart', 'af_bella', 'af_nicole', 'af_aoede', 'af_kore', 'af_sarah', 'af_sky', 'af_nova', 'af_alloy', 'af_jessica', 'af_river', 'bf_emma', 'bf_isabella', 'bf_alice', 'bf_lily']
AUDITION = ['am_michael', 'am_fenrir', 'am_puck', 'bm_george']
FEMALE_AUDITION = ['af_heart', 'af_bella', 'af_nicole', 'af_sarah', 'bf_emma']
# Brisk, upbeat pace (owner, 2026-11-15: "faster and jolly"): Kokoro has no mood setting, so this is speed and shorter pauses; it was 0.95 and 0.15 / 0.55.
DEFAULT_SPEED = 1.1
PAUSE_SENTENCE, PAUSE_PARAGRAPH = 0.1, 0.4


def chunks(text: str):
    """Paragraphs, each split into sentences of a sensible length (Kokoro takes at most ~500 tokens at once)."""
    for paragraph in [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]:
        sentences = re.split(r'(?<=[.!?:])\s+', paragraph)
        buffer, pieces = '', []
        for sentence in sentences:
            if buffer and len(buffer) + len(sentence) > 260:
                pieces.append(buffer)
                buffer = sentence
            else:
                buffer = f'{buffer} {sentence}'.strip()
        if buffer:
            pieces.append(buffer)
        yield pieces


def speak(kokoro: Kokoro, text: str, voice: str, speed: float) -> np.ndarray:
    audio = []
    for pieces in chunks(text):
        for piece in pieces:
            samples, _ = kokoro.create(piece, voice=voice, speed=speed, lang='en-us' if voice.startswith('a') else 'en-gb')
            audio += [samples, np.zeros(int(SAMPLE_RATE * PAUSE_SENTENCE), dtype=np.float32)]
        audio.append(np.zeros(int(SAMPLE_RATE * (PAUSE_PARAGRAPH - PAUSE_SENTENCE)), dtype=np.float32))
    return np.concatenate(audio)


def speak_segments(kokoro: Kokoro, segments: list, voice: str, speed: float):
    """One Kokoro call per sentence, so each sentence's own start and end in the recording is known exactly: returns the audio, a
    [start, end] pair in seconds for each segment (the speech itself, not the silence after it), the start second of every word of
    each segment (only with the timed model, models/kokoro-v1.0-timed.onnx: same audio, plus Kokoro's phoneme durations; else None)
    and the total length."""
    audio, timing, words, cursor = [], [], [] if kokoro.has_timings else None, 0
    lang = 'en-us' if voice.startswith('a') else 'en-gb'
    for segment in segments:
        if words is not None:
            samples, starts, _ = segment_words(kokoro, segment['text'], voice, speed, lang)
            words.append([round(cursor / SAMPLE_RATE + value, 3) for value in starts])
        else:
            samples, _ = kokoro.create(segment['text'], voice=voice, speed=speed, lang=lang)
        start = cursor / SAMPLE_RATE
        cursor += len(samples)
        timing.append([round(start, 3), round(cursor / SAMPLE_RATE, 3)])
        gap = np.zeros(int(SAMPLE_RATE * (PAUSE_SENTENCE if segment['pause'] == 'sentence' else PAUSE_PARAGRAPH)), dtype=np.float32)
        cursor += len(gap)
        audio += [samples, gap]
    return np.concatenate(audio), timing, words, cursor / SAMPLE_RATE


def to_m4a(samples: np.ndarray, target: Path, bitrate: int = 48000):
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'a.wav'
        sf.write(wav, samples, SAMPLE_RATE)
        subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', str(bitrate), '-q', '127', str(wav), str(target)], check=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--voice', default='am_puck')
    parser.add_argument('--speed', type=float, default=DEFAULT_SPEED, help='1.0 is Kokoro\'s own pace')
    parser.add_argument('--lessons', nargs='*')
    parser.add_argument('--all', action='store_true')
    parser.add_argument('--audition', action='store_true')
    parser.add_argument('--audition-female', action='store_true', help='one short sample in each candidate female voice')
    args = parser.parse_args()
    # The timed model (make-timed-model.py) makes the very same audio and also says when each word is spoken; without it recordings are timed by sentence only.
    timed = HERE / 'models' / 'kokoro-v1.0-timed.onnx'
    kokoro = Kokoro(str(timed if timed.exists() else HERE / 'models' / 'kokoro-v1.0.onnx'), str(HERE / 'models' / 'voices-v1.0.bin'))
    missing = [voice for voice in [args.voice] if voice not in kokoro.get_voices()]
    if missing:
        sys.exit(f'unknown voice {missing}; male voices: {MALE_VOICES}; female voices: {FEMALE_VOICES}')

    if args.audition or args.audition_female:
        text = (SCRIPTS / 'starter-01.txt').read_text().split('Welcome to Talino.', 1)[1]
        sample = 'Welcome to Talino.' + text[:760].rsplit('.', 1)[0] + '.'
        for voice in (FEMALE_AUDITION if args.audition_female else AUDITION):
            started = time.time()
            to_m4a(speak(kokoro, sample, voice, args.speed), HERE / 'out' / 'audition' / f'{voice}.m4a')
            print(f'{voice}: {time.time() - started:.1f}s to make')
        return

    ids = [entry['id'] for entry in json.loads((SCRIPTS / '_manifest.json').read_text())] if args.all else (args.lessons or [])
    out = HERE / 'out' / 'audio' / args.voice
    # Lessons with no recording first, then the ones recorded before timing existed.
    todo = [lesson_id for lesson_id in ids if not (out / f'{lesson_id}.timing.json').exists()]
    todo.sort(key=lambda lesson_id: (out / f'{lesson_id}.m4a').exists())
    for number, lesson_id in enumerate(todo, 1):
        segments_file = SCRIPTS / f'{lesson_id}.segments.json'
        if not segments_file.exists():
            sys.exit(f'{segments_file} is missing: run  node scripts/audio/export-scripts.cjs  first')
        data = json.loads(segments_file.read_text())
        target = out / f'{lesson_id}.m4a'
        started = time.time()
        samples, timing, words, duration = speak_segments(kokoro, data['segments'], args.voice, args.speed)
        # The recording is replaced only once the new one is complete, so an interrupted run never leaves half a file.
        partial = target.with_name(f'{lesson_id}.partial.m4a')
        to_m4a(samples, partial)
        os.replace(partial, target)
        write_peaks(target, redo=True)  # the waveform the app's Listen player draws (see peaks.py)
        # Written last: a lesson without it is made again on the next run.
        timing_file = target.with_suffix('.timing.json')
        partial_timing = target.with_name(f'{lesson_id}.timing.partial')
        body = {'v': 1, 'hash': data['hash'], 'duration': round(duration, 3), 'segments': timing}
        if words is not None:
            body.update({'words': words, 'speed': args.speed})
        partial_timing.write_text(json.dumps(body, separators=(',', ':')))
        os.replace(partial_timing, timing_file)
        print(f'[{number}/{len(todo)}] {lesson_id}: {target.stat().st_size // 1024} KB, {len(timing)} sentences in {time.time() - started:.0f}s', flush=True)


if __name__ == '__main__':
    main()
