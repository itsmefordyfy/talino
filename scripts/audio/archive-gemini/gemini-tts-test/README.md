# Gemini TTS test (2026-11-14)

A trial of Gemini's text-to-speech as a possible alternative to Kokoro. **Not wired into the app.** Run from the project root
(they read `GEMINI_API_KEY` from `.env`, the owner's prepaid key: ask before running them again):

- `node scripts/audio/gemini-tts-test/run.mjs gemini-3.8-flash-lite-tts` makes an English and a Taglish clip for 20 voices
  (resumes, one request at a time: the free tier allows only a few TTS requests a minute).
- `node scripts/audio/gemini-tts-test/judge.mjs samples-<model>` transcribes each clip back with Gemini and scores the word
  match plus a description of the speaker. It is a proxy for intelligibility, **not** for how pleasant a voice is: it rated almost
  every voice 9 to 10, so the voice has to be picked by ear.

The run writes to the current folder (`samples-<model>/`); the finalists are copied to `scripts/audio/out/gemini-tts-samples/`
(git-ignored): `afplay scripts/audio/out/gemini-tts-samples/F-Sulafat-fil.wav`.

**A trap found on 2026-11-14:** Gemini's WAV has a `C2PA` metadata chunk (about 8 KB) after the audio. Read "everything after the 44-byte
header" as samples and every clip ends with ~150 ms of loud static (this is what the Settings "Hear Tali / Hear Tala" samples had). Always
read the `data` chunk by its declared size (`pcmOfWav` here, `lib/server/wav.ts` in the app's route).
