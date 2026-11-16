"""Lesson audio with Gemini text-to-speech (replaces Kokoro). One request per sentence, so the exact start and end of every sentence in the
recording is known and written to <id>.timing.json, exactly as generate.py did for Kokoro: the app highlights the sentence being spoken and a
tap on a sentence jumps to it from those numbers. Output: out/audio/<voice>/<lessonId>.m4a (AAC mono 48 kbps, made with macOS afconvert),
<lessonId>.timing.json and <lessonId>.peaks.json, where <voice> is the lowercase Gemini voice name (`achird` for Tali, `sulafat` for Tala:
`COMPANIONS` in src/features/companion/lib/companions.ts).

  .venv/bin/python generate_gemini.py --voice Achird --lessons starter-01      # one lesson (about 55 sentences)
  .venv/bin/python generate_gemini.py --voice Achird --dry-run --all           # what a full run would cost, no request made
  .venv/bin/python generate_gemini.py --voice Sulafat --all                    # every lesson; lessons with no recording first; resumable
  .venv/bin/python generate_gemini.py --voice Achird --language fil --all      # the Tagalog lessons (export with --language fil first), into out/audio/achird_fil/

Uses the owner's prepaid GEMINI_API_KEY from ../../.env (never printed). Every sentence's audio is kept in out/gemini-cache/ so an interrupted
or repeated run never pays for the same words twice. The key's rate limit decides the speed: a free key allows only a few requests a minute;
a paid one is much faster (use --workers and --min-interval).

Gemini's WAV has a C2PA metadata chunk after the audio: only the `data` chunk (at its declared size) is audio. Reading everything after the
44-byte header plays that metadata as static at the end of every clip.
"""
import argparse, hashlib, json, os, struct, subprocess, sys, tempfile, threading, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import soundfile as sf

from peaks import write_peaks

HERE = Path(__file__).parent
SCRIPTS = HERE / 'out' / 'scripts'
CACHE = HERE / 'out' / 'gemini-cache'
SAMPLE_RATE = 24000
PAUSE_SENTENCE, PAUSE_PARAGRAPH = 0.15, 0.55
MODEL = 'gemini-3.8-flash-lite-tts'
URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
# The Kokoro recordings these voices replace: lessons that have none of them (the phone's voice reads them today) are made first.
REPLACES = {'Achird': 'am_michael', 'Sulafat': 'af_heart'}
# Google's price for audio output, per million tokens, until 31 Dec 2026 (it doubles on 1 Jan 2027), and 25 audio tokens a second.
PRICE_PER_M = {'gemini-3.8-flash-lite-tts': 6.0, 'gemini-3.8-flash-tts': 9.0}
TARGET_RMS, MAX_PEAK = 0.09, 0.95


def api_key() -> str:
    for line in (HERE.parent.parent / '.env').read_text().splitlines():
        if line.startswith('GEMINI_API_KEY='):
            return line.split('=', 1)[1].strip().strip('"\'')
    sys.exit('GEMINI_API_KEY is not set in .env')


def pcm_of_wav(data: bytes) -> np.ndarray:
    """The audio of a Gemini WAV: the `data` chunk, at the size its header declares (never "everything after 44 bytes")."""
    at = 12
    while at + 8 <= len(data):
        chunk, size = data[at:at + 4], struct.unpack('<I', data[at + 4:at + 8])[0]
        if chunk == b'data':
            body = data[at + 8:at + 8 + size]
            return np.frombuffer(body[: len(body) // 2 * 2], dtype='<i2').astype(np.float32) / 32768
        at += 8 + size + (size & 1)
    raise ValueError('no data chunk in the WAV')


def tidy(samples: np.ndarray) -> np.ndarray:
    """Trims the silence Gemini puts before and after a sentence (so each sentence's timing is the speech itself) and evens the loudness
    from one request to the next, so the voice doesn't jump in volume between sentences."""
    loud = np.flatnonzero(np.abs(samples) > 0.004)
    if len(loud) == 0:
        return samples
    start, end = max(0, loud[0] - int(0.03 * SAMPLE_RATE)), min(len(samples), loud[-1] + int(0.06 * SAMPLE_RATE))
    out = samples[start:end]
    rms, peak = float(np.sqrt(np.mean(out ** 2))), float(np.max(np.abs(out)))
    gain = min(TARGET_RMS / rms if rms > 0 else 1.0, MAX_PEAK / peak if peak > 0 else 1.0)
    return (out * gain).astype(np.float32)


class Limiter:
    """Spaces requests out and backs everyone off together when the service says it is busy."""

    def __init__(self, min_interval: float):
        self.min_interval, self.lock, self.next_at = min_interval, threading.Lock(), 0.0

    def wait(self):
        with self.lock:
            now = time.time()
            delay = max(0.0, self.next_at - now)
            self.next_at = max(now, self.next_at) + self.min_interval
        if delay:
            time.sleep(delay)

    def back_off(self, seconds: float):
        with self.lock:
            self.next_at = max(self.next_at, time.time() + seconds)


def synthesize(key: str, model: str, voice: str, text: str, limiter: Limiter) -> np.ndarray:
    """One sentence as tidied samples: from the cache if it was made before, otherwise asked of Gemini (retrying while it is busy)."""
    name = hashlib.sha1(f'{model}\n{voice}\n{text}'.encode()).hexdigest()
    cached = CACHE / voice.lower() / f'{name}.wav'
    if cached.exists():
        return sf.read(cached, dtype='float32')[0]
    body = json.dumps({'contents': [{'parts': [{'text': text}]}], 'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}).encode()
    for attempt in range(8):
        limiter.wait()
        request = urllib.request.Request(URL.format(model=model), data=body, headers={'content-type': 'application/json', 'x-goog-api-key': key})
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                payload = json.loads(response.read())
            part = next((p for p in payload['candidates'][0]['content']['parts'] if p.get('inlineData')), None)
            if part is None:
                raise ValueError('no audio in the answer')
            import base64
            samples = tidy(pcm_of_wav(base64.b64decode(part['inlineData']['data'])))
            if len(samples) < SAMPLE_RATE * 0.15:
                raise ValueError('the audio was empty')
            cached.parent.mkdir(parents=True, exist_ok=True)
            sf.write(cached.with_suffix('.partial.wav'), samples, SAMPLE_RATE)
            os.replace(cached.with_suffix('.partial.wav'), cached)
            return samples
        except urllib.error.HTTPError as error:
            if error.code in (429, 500, 503, 504):
                wait = min(120, 8 * 2 ** attempt)
                limiter.back_off(wait)
                continue
            raise RuntimeError(f'Gemini said {error.code}: {error.read()[:200]!r}')
        except (urllib.error.URLError, TimeoutError, ValueError, KeyError, IndexError):
            time.sleep(min(30, 3 * 2 ** attempt))
    raise RuntimeError('Gemini did not answer after 8 tries')


def to_m4a(samples: np.ndarray, target: Path, bitrate: int = 48000):
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'a.wav'
        sf.write(wav, samples, SAMPLE_RATE)
        subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', str(bitrate), '-q', '127', str(wav), str(target)], check=True)


def make_lesson(key, model, voice, lesson_id, workers, limiter, out: Path) -> tuple[int, float]:
    data = json.loads((SCRIPTS / f'{lesson_id}.segments.json').read_text())
    segments = data['segments']
    with ThreadPoolExecutor(max_workers=workers) as pool:
        clips = list(pool.map(lambda segment: synthesize(key, model, voice, segment['text'], limiter), segments))
    audio, timing, cursor = [], [], 0
    for segment, clip in zip(segments, clips):
        start = cursor / SAMPLE_RATE
        cursor += len(clip)
        timing.append([round(start, 3), round(cursor / SAMPLE_RATE, 3)])
        gap = np.zeros(int(SAMPLE_RATE * (PAUSE_SENTENCE if segment['pause'] == 'sentence' else PAUSE_PARAGRAPH)), dtype=np.float32)
        cursor += len(gap)
        audio += [clip, gap]
    duration = cursor / SAMPLE_RATE
    target = out / f'{lesson_id}.m4a'
    partial = target.with_name(f'{lesson_id}.partial.m4a')
    to_m4a(np.concatenate(audio), partial)
    os.replace(partial, target)
    write_peaks(target, redo=True)
    # Written last: a lesson without it is made again on the next run.
    partial_timing = target.with_name(f'{lesson_id}.timing.partial')
    partial_timing.write_text(json.dumps({'v': 1, 'hash': data['hash'], 'duration': round(duration, 3), 'segments': timing}, separators=(',', ':')))
    os.replace(partial_timing, target.with_suffix('.timing.json'))
    return len(segments), duration


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--voice', required=True, choices=sorted(REPLACES), help='the Gemini voice: Achird (Tali) or Sulafat (Tala)')
    parser.add_argument('--model', default=MODEL, choices=sorted(PRICE_PER_M))
    parser.add_argument('--lessons', nargs='*')
    parser.add_argument('--all', action='store_true')
    parser.add_argument('--language', default='en', choices=['en', 'fil'], help='fil: the Tagalog lessons from out/scripts-fil, recorded into out/audio/<voice>_fil (the folder the app asks for in Tagalog)')
    parser.add_argument('--dry-run', action='store_true', help='count what would be made and what it costs; no request is sent')
    parser.add_argument('--workers', type=int, default=3, help='sentences asked for at the same time')
    parser.add_argument('--min-interval', type=float, default=0.5, help='seconds between the starts of two requests (raise it on a key with a low rate limit)')
    args = parser.parse_args()
    global SCRIPTS
    if args.language != 'en':
        SCRIPTS = HERE / 'out' / f'scripts-{args.language}'

    ids = [entry['id'] for entry in json.loads((SCRIPTS / '_manifest.json').read_text())] if args.all else (args.lessons or [])
    out = HERE / 'out' / 'audio' / (args.voice.lower() if args.language == 'en' else f'{args.voice.lower()}_{args.language}')
    old = HERE / 'out' / 'audio' / REPLACES[args.voice]
    todo = [lesson_id for lesson_id in ids if not (out / f'{lesson_id}.timing.json').exists()]
    # Lessons that have no recording at all today (the phone's voice reads them) come first, then the rest in catalog order.
    todo.sort(key=lambda lesson_id: (old / f'{lesson_id}.m4a').exists())

    sentences = chars = fresh_chars = 0
    for lesson_id in todo:
        for segment in json.loads((SCRIPTS / f'{lesson_id}.segments.json').read_text())['segments']:
            sentences += 1
            chars += len(segment['text'])
            name = hashlib.sha1(f'{args.model}\n{args.voice}\n{segment["text"]}'.encode()).hexdigest()
            if not (CACHE / args.voice.lower() / f'{name}.wav').exists():
                fresh_chars += len(segment['text'])
    hours = fresh_chars / 15 / 3600
    cost = fresh_chars / 15 * 25 / 1e6 * PRICE_PER_M[args.model]
    print(f'{args.voice}: {len(todo)} lessons to make, {sentences} sentences, {chars:,} characters; still to ask Gemini for: about {hours:.1f} h of speech, about ${cost:.2f} ({args.model}, price until 31 Dec 2026)', flush=True)
    if args.dry_run or not todo:
        return

    key, limiter = api_key(), Limiter(args.min_interval)
    failures = 0
    for number, lesson_id in enumerate(todo, 1):
        started = time.time()
        try:
            count, duration = make_lesson(key, args.model, args.voice, lesson_id, args.workers, limiter, out)
        except Exception as error:  # noqa: BLE001 - one bad lesson never stops the run; it is made again next time
            failures += 1
            print(f'[{number}/{len(todo)}] {lesson_id}: FAILED ({error})', flush=True)
            if failures >= 3:
                sys.exit('three lessons failed in a row: stopping (the cache keeps what was paid for; run again to carry on)')
            continue
        failures = 0
        print(f'[{number}/{len(todo)}] {lesson_id}: {count} sentences, {duration:.0f}s of audio, {(out / f"{lesson_id}.m4a").stat().st_size // 1024} KB in {time.time() - started:.0f}s', flush=True)


if __name__ == '__main__':
    main()
