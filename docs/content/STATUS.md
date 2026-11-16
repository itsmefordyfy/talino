# Catalog status (updated 2026-11-14, end of the AI-first content run)

Direction: **AI-first** (`AI_FIRST_AUDIT.md`). **Live in the app: 55 courses, 580 lessons, 97 projects**: the 19 existing courses plus all
36 planned AI-first courses (`src/features/courses/content/catalog/syllabus-ai-*.ts`), every one registered
(`catalog/registered.json`). The completeness test ("every syllabus course has been written and registered") is green.

A new course = a file in `catalog/courses/<id>.ts` that passes
`CHECK_COURSE=<id> npx jest --no-watchman src/features/courses/content/catalog/check-one`, then
`node scripts/content/build-catalog-index.mjs <id>`; it also needs a cover (`courses/lib/covers.ts`), a world
(`adventure/lib/world-themes.ts`, English and Tagalog) and a metadata row.

## Five-level adaptation (`ADAPTATION_BRIEF.md`)

Every one of the 19 existing courses and all 36 new ones carry level pieces (`levelAdaptationProblems` is empty for all; `NOT_YET_ADAPTED` is empty).

## Gates (2026-11-14)

`npx tsc --noEmit` clean, `npx expo lint` clean, `npx jest --no-watchman` 2,033 passed (1 skipped: the per-course check, which needs `CHECK_COURSE`).
Source links: `node scripts/content/check-sources.mjs <id>` was run on every new course; every real documentation link resolved, and the only
failures are placeholder or deliberate attack addresses inside sample code (localhost, `evil.example`, `you/your-repo`).

## Voice (Kokoro)

Listen uses Kokoro recordings for every lesson, in both coaches' voices (`am_michael` for Tali, `af_heart` for Tala). The first 216 lessons
were generated earlier; the other 364 were generated on 2026-11-14 with `scripts/audio` (`export-scripts.cjs`, then
`generate.py --voice <voice> --all`). Level-tagged blocks are not read, so adapting a lesson does not change its recording. **Owner step:**
host `scripts/audio/out/audio/<voice>/` (about 1.3 MB a lesson) and set `EXPO_PUBLIC_AUDIO_ORIGIN`; until then real users hear the phone's voice.

## Known follow-ups

- Tagalog: the level pieces of every adapted course exist only in English; the new AI-first courses have no Tagalog lesson text yet (worlds and catalog names do).
- Older quizzes in the 19 existing courses often have the right answer as the longest choice (the new courses are checked for this).
- `/api/coach` must be redeployed for level-aware project reviews.
- No independent accuracy review per course (a second reader checking facts against the official pages) and no simulator pass over each
  new course page: the writers verified their own facts and ran their own code. Their reports list what each could not verify (for example
  OpenAI help pages that returned 403, Philippine tax and privacy law, which is only pointed at, never stated).
- `stripe.com` was added to the allowed documentation hosts (`lib/path-rules.ts`); `revenuecat.com`, `open-meteo.com` and `twilio.com` are not.
- Discover now shows its categories as tabs (For you, All, one per category); Today shows only the learner's own courses and progress.
