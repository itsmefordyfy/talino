"""Adds the start time of every WORD to the timing files that only have sentence times, so the app lights up the word being spoken
exactly (instead of estimating it from word length). It does NOT touch the recordings: it speaks each sentence again with the same voice
and speed on models/kokoro-v1.0-timed.onnx (same audio, plus Kokoro's own phoneme durations; make-timed-model.py makes that file) and
keeps the result only when the sentence comes out exactly as long as it is in the recording (to 10 ms). A recording made at another
speed, or from other text, therefore never gets wrong word times: it is reported and left as it was.

  .venv/bin/python word-timings.py --voice am_puck --all
  .venv/bin/python word-timings.py --voice af_heart --lessons starter-01
  .venv/bin/python word-timings.py --voice am_puck --all --force      (redo lessons that already have words)

After it, host the changed `.timing.json` files again (`node --env-file=.env scripts/audio/upload-supabase.mjs`: a file whose size changed is sent again, the recordings are skipped) so phones download the word times.
"""
import argparse, json, os, sys, time
from pathlib import Path

from kokoro_onnx import Kokoro

from word_timing import SAMPLE_RATE, segment_words

HERE = Path(__file__).parent
TOLERANCE = 0.01
# The speeds recordings were made at: 1.1 since 2026-11-15, 0.95 before.
SPEEDS = [1.1, 0.95]


def words_for(kokoro, segments, timing, voice, lang, speed):
    """Per-segment word starts (absolute seconds in the recording) at `speed`, or None when any sentence's length disagrees with the recording."""
    out, hows = [], {'clean': 0, 'loose': 0}
    for index, segment in enumerate(segments):
        start, end = timing['segments'][index]
        audio, starts, how = segment_words(kokoro, segment['text'], voice, speed, lang)
        if abs(len(audio) / SAMPLE_RATE - (end - start)) > TOLERANCE:
            return None, hows
        # 'loose': under 85% of the words' own phonemes were found in the speech (numbers, symbols, odd spellings); those words are still placed, less surely.
        hows['clean' if how >= 0.85 else 'loose'] += 1
        out.append([round(start + value, 3) for value in starts])
    return out, hows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--voice', required=True)
    parser.add_argument('--lessons', nargs='*')
    parser.add_argument('--all', action='store_true')
    parser.add_argument('--force', action='store_true')
    args = parser.parse_args()
    folder = HERE / 'out' / 'audio' / args.voice
    if args.all:
        ids = sorted(path.name[: -len('.timing.json')] for path in folder.glob('*.timing.json'))
    else:
        ids = args.lessons or []
    kokoro = Kokoro(str(HERE / 'models' / 'kokoro-v1.0-timed.onnx'), str(HERE / 'models' / 'voices-v1.0.bin'))
    if not kokoro.has_timings:
        sys.exit('models/kokoro-v1.0-timed.onnx has no duration output: run make-timed-model.py')
    lang = 'en-us' if args.voice.startswith('a') else 'en-gb'
    done = skipped = 0
    for number, lesson_id in enumerate(ids, 1):
        target = folder / f'{lesson_id}.timing.json'
        source = HERE / 'out' / 'scripts' / f'{lesson_id}.segments.json'
        if not target.exists() or not source.exists():
            print(f'[{number}/{len(ids)}] {lesson_id}: no timing or script, skipped', flush=True)
            skipped += 1
            continue
        timing, data = json.loads(target.read_text()), json.loads(source.read_text())
        if 'words' in timing and not args.force:
            continue
        if timing.get('hash') != data['hash'] or len(timing['segments']) != len(data['segments']):
            print(f'[{number}/{len(ids)}] {lesson_id}: the recording was made from other text, skipped', flush=True)
            skipped += 1
            continue
        started = time.time()
        words, hows, used = None, {}, None
        for speed in SPEEDS:
            words, hows = words_for(kokoro, data['segments'], timing, args.voice, lang, speed)
            if words is not None:
                used = speed
                break
        if words is None:
            print(f'[{number}/{len(ids)}] {lesson_id}: sentence lengths match no known speed, skipped', flush=True)
            skipped += 1
            continue
        timing['words'] = words
        timing['speed'] = used
        partial = target.with_suffix('.partial')
        partial.write_text(json.dumps(timing, separators=(',', ':')))
        os.replace(partial, target)
        done += 1
        print(f'[{number}/{len(ids)}] {lesson_id}: words at speed {used}, {hows} in {time.time() - started:.0f}s', flush=True)
    print(f'done {done}, skipped {skipped}')


if __name__ == '__main__':
    main()
