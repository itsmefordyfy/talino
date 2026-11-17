# Object-Oriented Programming course: status (2026-11-16)

**State: written, registered and passing its checks in code. Not yet looked at in the app, and not narrated.**

## What exists

- Course `object-oriented-programming` (intermediate, prerequisite `programming-fundamentals`, advice only): **14 modules, 80 lessons, 12 projects (p1 to p12), 480 quiz
  questions, 333 activities, 97 Mermaid diagrams, 132 tables, 130 copyable AI prompts, 46 dated version notes**, about 36 hours of lesson time by the lessons' own `minutes`.
  Activities by kind: predict-output 66, scenario 63, match 56, fix-bug 51, code-challenge 49, tap-reveal 20, fill-blank 19, arrange 9. The five existing OOP visuals
  (`classes-objects`, `encapsulation`, `abstraction`, `inheritance`, `polymorphism`) are reused in 8 places.
- Files: `catalog/syllabus-oop.ts` (the 14 modules and 80 titles), `catalog/courses/object-oriented-programming.ts` (assembly), `.../object-oriented-programming/module-01..14.ts`
  and `skills.ts`, `docs/content/OOP_BRIEF.md` (writer brief), `catalog/oop-module.test.ts` (per-module and whole-course lesson-shape check).
- Wiring: registered (`registered.json`, `courses.generated.ts`, regenerated `course-index.data.ts`), world "The Parts Foundry", cover, learning path `software-design`, and a
  **side, late-addition milestone** "Object-oriented design" in the Intermediate level of the journey (the road to the AI Expert certificate is unchanged and existing
  learners' places never move).
- Modules: 1 Introduction (4 lessons), 2 Classes and Objects (6), 3 Constructors and Initialization (7), 4 Encapsulation (6), 5 Abstraction (5), 6 Inheritance (6), 7 Polymorphism (5),
  8 Composition and Relationships (6), 9 Interfaces and Abstract Classes (5), 10 SOLID (6), 11 Maintainable OOP (7), 12 OOP in Real Applications (5), 13 AI-Assisted OOP (7),
  14 Final Project: Library Management System (5). Projects: modules 10 and 12 have none.

## Checked

`npx tsc --noEmit` (whole project) clean; eslint clean on the course files; jest for `courses`, `journey`, `adventure`, `activities`, `visuals`, `coach`, `me`
all pass (1,832 tests); `CHECK_OOP_MODULE=n` passed for every module while written, and the whole-course checks (14 modules, 12 projects, titles, ten-part shape, "learner is
asked to explain") pass on the registered course. Writers ran every JavaScript block in Node 22 (and the activities in the in-app runner), compiled TypeScript blocks with the
repo's `tsc --strict`, and ran the Python, Java and C# comparison snippets locally where they made a claim.

**Rendered (2026-11-16, a throwaway Jest test, deleted):** all 80 lessons mounted with the app's real `LessonIntro` + `LessonBlocks` + key-terms provider (tables, Mermaid
diagrams, code, version notes, prompts, details, visuals; 333 activity slots) with no error and no empty render, and Listen's `lessonSegments`, `lessonScript` and
`lessonOutline` built for every lesson: **8,082 narration segments, about 112,600 words before the trim; after it about 68,300 words, roughly 7 to 8 hours of speech** for a Kokoro job per voice. This is not the simulator:
`simctl` timed out on this Mac (CoreSimulator unresponsive), so the screens themselves were not seen.

## Not done, and why

- **Tagalog: none written.** The owner's standing rule (2026-11-15), `TAGALOG_ENABLED = false`, and the Programming Fundamentals brief all say English only; the brief for this
  course asked for complete Tagalog. The `fil` adventure table has an English placeholder. A Tagalog pass is separate work, after review of the English.
- **Narration:** Gemini TTS was removed on 2026-11-15; Kokoro (Tali `am_puck`, Tala `af_heart`) has no Tagalog voice. Recordings are generated on the owner's Mac
  (`scripts/audio/generate.py`), so **Kokoro coverage of this course is 0 lessons until they are generated**; until then the phone's own voice reads it.
- **New visuals:** none (the visual registry's Tagalog parity test requires Filipino titles). Writers each named the visual they wished existed: prototype-chain stepper,
  contract-test runner, swap-a-part Account, mutation-by-hand, request-through-layers, dependency graph for coupling.
- **Not looked at in the app:** the course page, Home's new node, a lesson with its diagrams, the activities on a device, dark mode, Android. Mermaid diagrams were checked
  by the app's own validator, not on screen.
- **Not verified against official pages:** Java statements (`docs.oracle.com` is not an allowed source host: Java and C++ rows rest on local runs or well-known facts, and
  the lesson text says so where it matters); Apple's SwiftUI/Observation pages returned nothing readable, so lesson 67's iOS row is worded as unchecked and names no API.
  Add `docs.oracle.com` and `isocpp.org` to `lib/path-rules.ts` if you want them cited.
- **Length: trimmed (2026-11-17).** Spoken words per lesson (what Listen reads, `oop-length.test.ts`) went from 112,631 in total (1,408 per lesson) to **68,284 (854 per lesson)**:
  every lesson is at most 996 words, 850 for ordinary lessons and up to 1,000 for guided builds and the capstone (lessons 76 to 79 about 890, lesson 80 979). Cut: restatements,
  second examples, secondary tables and diagrams, long details blocks, extra language comparisons, wordy captions. No quiz question or activity was removed. Level-tagged blocks
  are not spoken. Check any time: `OOP_LENGTH=1 [OOP_LENGTH_MODULE=n] [OOP_LENGTH_MAX=850] npx jest --no-watchman src/features/courses/content/catalog/oop-length`.
  Several projects' `unlockAfterDay` is the day before the guided-build lesson (as the brief allows).
- **Not run:** the full `npx expo lint` and any simulator pass.

## Decisions that conflict with the brief

- **Second standalone programming course:** CLAUDE.md (2026-11-14) says Talino is not a programming academy; Programming Fundamentals is the recorded exception. This course
  is a second one at the owner's explicit request, a side branch of the journey.
- **80 lessons, not ~100:** the module-course cap (`MODULE_COURSE_MAX_LESSONS`) is 80, so the brief's bullets are grouped; each is covered by exactly one lesson.
- **`typescript` is not in the course's `technologies`:** listing it made the course outrank web courses for a React/Next/TypeScript learner (`recommendations.test`).
  TypeScript is a comparison thread, not the subject.

## Known sibling-session notes

Each module's writer left "for other modules" notes (terms defined, overlaps): `module-10` L53 and `module-06` L33 both cover Liskov from different angles; `module-05` L27
and `module-09` L46/47 overlap on interfaces by design; the in-app runner differs from Node for `structuredClone`, writes to a frozen object inside a class, `new.target`,
and `Object.freeze(this)` before assigning a `#private` field (all kept out of runnable activities).

## Kokoro narration job (started 2026-11-17)

Scripts exported for all 80 lessons (`cat scripts/audio/out/oop-lessons.txt | xargs node scripts/audio/export-scripts.cjs`: 390,211 characters, about 7 hours of speech). Both voices
(Tali `am_puck`, Tala `af_heart`) are generating side by side at low priority with `scripts/audio/run-oop.sh` (local files only, nothing uploaded; hosting stays the owner's
step, `scripts/audio/upload-r2.mjs`). Logs: `scripts/audio/out/generate-<voice>-oop.log`; it writes `scripts/audio/out/run-oop.done` when both finish; an interrupted run carries on where it
stopped (run the same command again). Check a recording with `.venv/bin/python check-timing.py out/audio/am_puck/<id>.m4a`. Word timing: run `word-timings.py --voice <voice> --lessons ...`
afterwards if the timed model was not used. **If a lesson's text changes, re-run the export and delete that lesson's recording and `.timing.json` before generating again.**
