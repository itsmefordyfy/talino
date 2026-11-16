# Lesson audio

**Direction (owner, 2026-11-15): Kokoro v1, US English. Tali is `am_puck`, Tala is `af_heart`.** Gemini text to speech was tried 2026-11-14 and dropped the next
day; its pipeline is kept, unused, in `archive-gemini/` (see its note at the end). Lessons are read from a hosted Kokoro recording, or by the phone's own voice
when there is none to play. Chat answers and Tagalog lessons are the phone's voice too: Kokoro runs only here, on this Mac, and has no Filipino voice.

### In the app
Two ways a lesson is read (`features/courses/audio/listen-controller.ts`), both followed sentence by sentence:
1. **A hosted recording** (`<origin>/<voice>/<id>.m4a` + `.timing.json`, `<voice>` = `COMPANIONS[id].voice`): played from the phone's cache or downloaded on first listen;
   followed (highlight, tap a sentence) only when the timing's hash describes the words on screen, otherwise it still plays, without following.
2. **The phone's own voice**, when no recording can be had: no audio host, no connection, none made for this lesson yet, or a build without `expo-audio`.

# Making the recordings with Kokoro

Free, open-source speech (Kokoro v1.0, Apache-licensed model by hexgrad; runtime `kokoro-onnx`) that runs on this Mac with
no internet and no account. It makes one audio file per lesson from exactly the text Listen reads on the phone
(`lessonScript`, `src/features/courses/lib/plain-text.ts`: title, summary, objectives, why it matters, the teaching, the key
takeaways; never the quiz or activities).

## One-time setup (already done on this Mac)
```bash
python3 -m venv scripts/audio/.venv && scripts/audio/.venv/bin/pip install kokoro-onnx soundfile numpy
cd scripts/audio/models   # then download both files from github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx   # 325 MB
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin    # 28 MB
```
The venv, the model and everything under `out/` are git-ignored. Audio files are made with macOS's `afconvert` (AAC, mono, 48 kbps).

## Make audio
```bash
node scripts/audio/export-scripts.cjs                      # text of every lesson -> out/scripts/ (re-run after content changes)
cd scripts/audio
.venv/bin/python generate.py --audition                    # short sample in four male voices -> out/audition/
.venv/bin/python generate.py --voice am_puck --lessons starter-01 developer-03
.venv/bin/python generate.py --voice am_puck --all      # 580 lessons, about 48 hours of speech; measured 2026-11-15: ~110 s and ~2 MB per lesson, so ~17 hours per voice
```
A lesson is done when it has its recording AND its `.timing.json`; an interrupted run carries on, lessons with no recording come first and recordings made before timing existed are made again with it (the old file is replaced only when the new one is complete). After a lesson's text changes, run `export-scripts.cjs` and delete its `.timing.json`, then re-run. Run `export-scripts.cjs` first: the generator speaks the sentences in `out/scripts/<id>.segments.json`.

## Timing: the highlight and "tap a sentence" come from this
Each sentence of a lesson is spoken by its own Kokoro call (`generate.py` `speak_segments`), so the exact start and end of every sentence in the recording is known and saved as `<id>.timing.json` next to the `.m4a`:
`{ "v": 1, "hash": "<hash of the words>", "duration": 240.8, "segments": [[start, end], ...] }` (seconds; one pair per segment of `src/features/courses/lib/speech-segments.ts`, which also cuts the text on screen, so the audio and the screen use the same sentences). The stock Kokoro model gives no word timings, but the patched `kokoro-v1.0-timed.onnx` (below) does, and `words` carries them. The app only follows a recording whose `hash` matches the lesson's words and whose `duration` matches the audio it is playing (otherwise it plays without highlighting). Host the `.timing.json` files with the `.m4a` files. Check any recording against its own audio (decodes it and measures loudness inside each sentence and in each pause):
```bash
.venv/bin/python check-timing.py out/audio/am_puck/starter-01.m4a
```
Female voices (Tala): `af_heart` (the one used, Kokoro's top-graded), `af_bella`, `af_nicole`, `af_aoede`, `af_kore`, `af_sarah`, `af_sky`, `af_nova`, `af_alloy`, `af_jessica`, `af_river` (American), `bf_emma`, `bf_isabella`, `bf_alice`, `bf_lily` (British). `generate.py --audition-female` makes a sample of five. `coach-samples.py` remakes the two greetings the app bundles.
Male voices (Tali: `am_puck`, the owner's pick 2026-11-15; the first run used `am_michael`): `am_michael`, `am_fenrir`, `am_puck`, `am_liam`, `am_eric`, `am_onyx`, `am_adam` (American), `bm_george`, `bm_fable`,
`bm_daniel`, `bm_lewis` (British). Speed 1.1 by default (`--speed`; it was 0.95 until 2026-11-15, with pauses of 0.15 / 0.55 s now 0.1 / 0.4). Kokoro has no mood or emotion setting, so "jolly" can only come from speed, pauses, punctuation and the voice itself (`am_puck` is the liveliest male one).

## Hear it in the app while developing
`scripts/audio/serve.sh` serves `out/audio/` on this Mac (port 8099) so the simulator and any phone on the same Wi-Fi play the Kokoro voice. The
address is in `.env.development.local` (`EXPO_PUBLIC_AUDIO_ORIGIN=http://<this Mac's Wi-Fi address>:8099`, development builds only, git-ignored): update it if
the Mac's address changes, and restart `expo start` if the app doesn't pick it up. A lesson whose recording isn't made yet says so and is read by the phone's voice.

## Size and delivery
About 6 KB per second: roughly 2 MB per lesson, so **about 1.2 GB per voice for all 580 lessons (2.4 GB for both)**: too much to bundle in the app, so the audio is
hosted and downloaded per lesson on first listen, then kept in the phone's cache for offline use.

## Hosting for store builds (2026-11-15)
A store build has no audio host unless `EXPO_PUBLIC_AUDIO_ORIGIN` is in `.env.production.local` (an `https` address; plain http to this Mac is allowed only in development). It points at the public Supabase Storage bucket
`talino-audio` (`<SUPABASE_URL>/storage/v1/object/public/talino-audio`, folders `am_puck/` and `af_heart/`, three files per lesson). `upload-supabase.mjs` (retired 2026-11-15 as `upload-supabase.mjs.retired`: the audio moved to R2) sent finished lessons (recording AND timing) and skips what is there; it stops at a budget
(400 MB by default) because **that Supabase project is shared with the other apps and the free plan holds 1 GB for all of it**: a full voice needs Supabase Pro or another host such as Cloudflare R2 (then change the origin; the app only needs `<origin>/<voice>/<lesson>.m4a|.timing.json|.peaks.json`).
`run-all.sh` makes both voices side by side and uploads every 20 minutes (see its header to start, watch and stop it). The older `af_heart` and `am_michael` recordings (made before timing existed) have no `.timing.json`, so the app can't follow them and `generate.py` makes them again; `out/audio/am_michael/` is Tali's replaced voice and can be deleted.

### Moving the audio to Cloudflare R2 (owner's choice 2026-11-15, replacing Supabase Storage)
The Supabase bucket hit its 400 MB budget (the project is shared and the free plan is 1 GB), so the recordings move to R2: about 10 GB free, no download fees. Steps: create a Cloudflare account (R2 asks for a card, not charged inside the free allowance),
create a bucket `talino-audio`, give it a public https address (a custom domain such as `audio.fordytechsolutions.com`, or R2's free `r2.dev` address for testing only: it is rate-limited, and changing the address later needs a new app build),
and create an API token with Object Read & Write on that bucket. Put `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` and `R2_PUBLIC_URL` in the project's gitignored `.env`, run `npm install` once in `scripts/audio`, then
`node --env-file=.env scripts/audio/upload-r2.mjs --plan` (what is finished, no keys needed), `--dry-run` (compare with the bucket), and without flags to send. Then set `EXPO_PUBLIC_AUDIO_ORIGIN` in `.env.production.local` to the public address
(the script prints it) and make a new store build. After that the `talino-audio` bucket in Supabase can be deleted to give its space back to the other apps. The running `run-all.sh` still tries the capped Supabase uploader; that is harmless.

## Known limits
English only, US and UK accents (no Philippine accent); Kokoro reads code-like words by its own rules, so check any lesson that is
heavy on commands before shipping it (`--lessons`). The audio is synthetic: label it "AI voice" where Listen is offered.

## Gemini archive (`archive-gemini/`, not used)
`generate_gemini.py` and `gemini-tts-test/` (the voice trials), the TypeScript that went with them (the `/api/speech` route, the live sentence voice, the answer
voice queue) as `src/*.ts.txt` so no tool compiles it, the old Gemini greetings (`assets-audio/`), and `recovered-compiled/`: `reply-queue`, `reply-voice` and their
tests, which were deleted before being archived and were rebuilt only as the compiled JavaScript Jest had cached (the original TypeScript is gone). Notes from the
trial: Gemini gives no timestamps, so it needed one request per sentence; about $26 per voice for all 580 lessons; the free tier caps requests per model per day.
`out/gemini-cache/`, `out/gemini-tts-samples/` and `out/audio/achird/` are the matching generated files (git-ignored; delete them to free space).


## Word timing: the highlight follows each word exactly
The network computes how many frames each phoneme gets but the stock `kokoro-v1.0.onnx` doesn't output it. One-time: `.venv/bin/pip install onnx && .venv/bin/python make-timed-model.py` writes `models/kokoro-v1.0-timed.onnx` (same audio, plus a `duration` output; git-ignored like the other models). Then:
- `generate.py` uses it automatically when it exists and writes `words` (the start second of every whitespace word of every sentence) and `speed` into `<id>.timing.json`; the audio is unchanged (sentence and clause pauses are 0 on purpose).
- `.venv/bin/python word-timings.py --voice am_puck --all` (also `--lessons id…`, `--force`) adds `words` to recordings that already exist, **without touching them**: each sentence is spoken again at the speed the recording was made at and kept only when its length equals the recorded one to 10 ms (a recording made at another speed, or from other text, is reported and skipped).
- `.venv/bin/python -m unittest test_word_timing` checks the phoneme-to-word matching with a stand-in engine.
- Host the changed timing files with `upload-supabase.mjs` (a file whose size changed is sent again).
Format: `{ "v": 1, "hash", "duration", "segments": [[start, end]…], "words": [[t, t…]…], "speed": 1.1 }`; `words[i]` has one start per `\S+` word of segment `i`'s text. The app ignores `words` that are malformed and falls back to estimating the word from its length.
