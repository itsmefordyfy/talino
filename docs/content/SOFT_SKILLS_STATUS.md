# Soft Skills for the Modern Workplace: status (2026-11-17)

**State: written, registered, wired and passing its checks in code; the practice engine is built and tested with fakes. Never run against live Gemini, never played end to end on a device, not narrated.**
Design: `docs/superpowers/specs/2026-11-17-soft-skills-course-design.md`. Writer brief: `docs/content/SOFT_SKILLS_BRIEF.md`.

## What exists
- Course `soft-skills-workplace` (beginner, category careers): **10 modules, 54 lessons (about 21 hours by the lessons' `minutes`), 3 projects, 286 quiz questions**, 195 lesson activities
  (scenario 50, roleplay 33, match 28, message-review 27, arrange 24, tap-reveal 23, fill-blank 10). Modules: 1 Communication (6 lessons), 2 Teamwork (5), 3 Critical thinking (6),
  4 Time management (5), 5 Emotional intelligence (5, Project 1), 6 Presentation (5), 7 Adaptability (5), 8 Professionalism (5, Project 2), 9 Client management (6), 10 Career readiness (6, Project 3).
  Projects: P1 Professional Communication Challenge (opens after day 27), P2 Workplace Simulation (42), P3 Career Readiness Portfolio (52); each lists its practice items in `practiceItemIds`.
- Lesson shape (checked): intro, opening paragraph, "A real situation", "How it works", "Weak and strong examples", level pieces, "Try it with AI" (a prompt the learner copies; they think first), takeaways,
  two or more activity kinds, a scenario quiz, a task. No code, no version notes (no product facts are stated).
- **Practice items: 60** (33 role-plays, 27 message tasks; 4 role-plays are `speaking`), each used by exactly one activity (`practice/catalog.test.ts`).
- Files: `catalog/syllabus-soft-skills.ts`, `catalog/courses/soft-skills-workplace.ts` + `soft-skills-workplace/module-01..10.ts` + `skills.ts`, `practice/scenarios/module-01..10.ts`,
  `catalog/soft-skills-module.test.ts` (per-module check: `CHECK_SOFT_MODULE=n`; whole course: `CHECK_COURSE=soft-skills-workplace npx jest check-one`).
- Wiring: registered (`registered.json`, `courses.generated.ts`, `course-index.data.ts`), cover, world "The Common Room", learning path `professional-skills` ("Soft Skills for Work") and the course
  added by id to `freelance-with-ai`, a **side, late-addition** journey milestone "Soft skills at work" in Beginner (the road to the AI Expert certificate is unchanged, no id of an existing course
  or milestone changed), What's New item `softSkills`, store texts (`WHATS_NEW.md`, `DESCRIPTION.md`). The syllabus lists only the goals `get-job` and `freelance`: with `teach` it became the
  recommended starting course for a teacher (`plan.test`).

## The practice engine (`src/features/practice`, `src/app/api/practice+api.ts`)
- Activity kinds `roleplay` (`scenarioId`) and `message-review` (`taskId`); the scenario catalog is plain data the server reads **by id**, so the phone never sends instructions and never receives
  `partner.private`, `reactions`, `strongSigns`, `traps` or `mustInclude` (tests assert it on every response). Modes `turn`, `report`, `review`.
- Role-play: the partner opens with the scenario's line, replies in character and adapts; the debrief is validated JSON (scores only for the criteria the scenario names, strengths and growth areas that must
  quote the learner's own words, one next step, a "too little to judge" state); Try again keeps every session. Message coach: scores per measure with reasons, what is missing, the learner's text beside a suggested
  version with "why this changed", a second review of the learner's rewrite. Only the learner's own text is stored as their work. Completion never depends on a high score; XP once (roleplay 15, message-review 12).
- **Speaking (honest):** no speech-recognition module is installed, so the app does not transcribe audio. Speaking scenarios read the partner aloud with `expo-speech` (the phone's voice), the learner dictates with
  the keyboard's microphone or types, and the feedback judges **the words only**; the screen and report say it does not hear tone, pace, volume or confidence and does not see body language. Real
  recording and transcription would need a new native module and a speech service (the owner's choice).
- Allowance: `ai_chats` app name `talinopractice` (a session or review counts once; its turns and report are free), Free 3 and Pro 30 a rolling 24 hours (`PRACTICE_FREE_DAILY_LIMIT` / `PRACTICE_PRO_DAILY_LIMIT`
  override); no new SQL (the table already takes the name). Needs the hosted route (`/api/practice`) deployed like the others, with `GEMINI_API_KEY` and the quota and RevenueCat variables.
- Persistence: migration 9 (`practice_sessions`, `practice_messages`), in delete-all, **excluded from backup like the interview's** (phone only; flip them into `BACKUP_TABLES` with specs in `backup/lib/schema.ts`
  if the owner wants a restore to bring back the learner's words). Project review receives a labelled "Practice results" block from `practiceItemIds` (capped, sanitised, untrusted; the review judges the submission's own text).
- Tali / Tala: `coach/lib/soft-skills.ts` (chips that coach the approach; built only from public item fields; never writes the learner's message or the ideal reply).

## Checked
`npx tsc --noEmit` clean; eslint 0 errors; full `npx jest`: 3,484 pass, 3 fail, none from this work (`ui-labels` backup Tagalog labels; `strings-parity` `activityStrings` and `storeStrings`, both already failing: the practice kinds' `fil` how-to lines are
English placeholders, which adds to `activityStrings`); `expo export --platform android` bundles. Every module passed its own check; whole-course check passes; the catalog test (60 items, one use each, well-formed) passes;
route tests with a fake Gemini (31) and the practice suites (142+) pass. **Seen** on the iPhone 17 and iPad Air simulators: a lesson with a role-play, scenario card, opening, chat, turn counter, composer, a seeded debrief,
history, the message coach layout and word counter, dark mode. 

## Not done, and why
- **Tagalog / Taglish: none written.** The owner's standing rule (no Filipino text; `TAGALOG_ENABLED` false), against the brief's request; the brief's Taglish asks need the owner's go-ahead and a review.
- **Kokoro narration: scripts exported (`scripts/audio/out/soft-skills-lessons.txt`, 54 lessons, 288,268 characters, about 5.3 hours per voice), recordings not generated** (the lesson text may still be trimmed first: lessons run about
  800 to 1,100 spoken words against the brief's 500 to 900). Run `nohup caffeinate -i scripts/audio/run-soft-skills.sh > scripts/audio/out/run-soft-skills.log 2>&1 &` (local files; upload is the owner's). Kokoro has no
  Filipino voice, so narration is English only; the phone's own voice reads lessons until a recording exists.
- **No live Gemini call was made** (the owner's prepaid key; CLAUDE.md says ask first): partner behaviour, debrief and review wording, and whether the models respect `private` and `reactions` are unseen. A first
  smoke test of two or three sessions is the next step, with the owner's go-ahead.
- **Not seen:** a real send, a debrief or a review on screen, the review's side-by-side result on a device, Android, web, VoiceOver, the keyboard lifting the composer, the project screen's practice card, dark mode of the
  debrief, the journey milestone, the course page, the learning path, the speaking read-aloud. No taps are possible in a simulator here.
- **Not verified:** the hosted `/api/practice` (must be redeployed with EAS Hosting), RevenueCat's verification for this route, the real allowance in `ai_chats`.
- Lesson content was checked by the structure rules and read by its writers, not reviewed by a person: the examples are invented; frameworks named (STAR, RACI, SBI, HEAR, Eisenhower, BATNA, growth mindset,
  the planning fallacy) are described in the lessons' own words and labelled rules of thumb where they are; no statistics or studies are cited. Two plain statements are not sourced (employers do not charge to hire;
  résumé customs differ by country). A subject-matter review is advisable before release.
- Practice items in Module 1 `comm-improve-email` is write-then-improve, not "rewrite this draft".
