# Course-based Home journey, lesson timeline, and the dive transition (2026-11-16)

Owner's brief: Home shows **courses** as the milestones of the four-level journey; tapping a course opens that course's **lesson
timeline**; Home always shows where the learner left off; entering a course is an immersive "dive into a learning universe"
transition (with a back transition), respecting Reduce Motion, on iPhone, iPad and Android. Real data only. The owner said to make
routine decisions without asking; every call below is mine.

## What exists (read first)

- Home is already a neural-network journey (`features/journey`): four levels, **milestones** of 1-4 courses plus a project, a pure
  engine (`lib/engine.ts`) that derives every status from real lessons and project reviews, one-course-at-a-time locking (owner,
  2026-11-16), a skill-check start level, directions, positions, badges, the AI Expert certificate.
- Progress is local SQLite (`lesson_progress`, one row per lesson, `completed_at` set once); nothing is stored for the journey.
  Courses are bundled catalog content. There is no account or server sync: "another device" means the iCloud backup / restore.
- A milestone tap opens a page sheet (`/journey/[id]`); the course page (`/course/[id]`) is Discover's and the Courses tab's.

## Goals

1. Home nodes are courses (every `learn` step of the journey definition, no new or duplicate courses). Milestones stay in the data
   as the prerequisite structure, but are no longer the nodes. The one milestone with no course (Show your work: portfolio and
   résumé) stays as an action node so nothing is removed.
2. A course node shows title, lesson count, completion %, status (completed / current / in progress / available / locked /
   skipped), optional and Pro tags, and a ring of progress. The level is the banner above it.
3. Home's header becomes a resume card for the primary course: "4 of 12 lessons", "Continue: Lesson 5 - title", % and a Continue
   button that opens that lesson directly. Other started courses are listed under it ("Also in progress") and never lose progress.
4. New screen `course-journey/[id]`: the course's lessons as a vertical connected timeline (completed, current, upcoming, locked),
   progress at the top, a Continue action, Tali at meaningful points, one spark moving along the path into the current lesson.
5. The dive: a root-level overlay (`DiveHost`) runs on the UI thread; the course screen is pushed with no native animation once the
   overlay covers the screen, and the overlay then dissolves to reveal it. Back runs the reverse.

## Non-goals / anti-goals

- No change to Discover, the Courses tab, the course page, lesson content, engine rules, billing or the Pro gates.
- No stored journey state, no fake progress, no hardcoded course names (the brief's examples are not used).
- No experimental shared-element transitions, no new dependency.
- Not a server-side sync: not building accounts for cross-device progress.

## Rules (course level; derived from the engine, tested in `lib/course-path.test.ts`)

- Completed = every lesson done (the project is separate, shown at the end of the timeline).
- Current = the first required, unfinished course of the engine's current milestone. Only one.
- A started, unfinished course is never shown locked (it is "in progress"), wherever it sits: the Courses tab can open any course.
- A course after the current one is locked until the current one is finished (the owner's one-course-at-a-time rule, now applied
  per course, not per milestone). Optional courses of the current milestone and everything in earlier milestones stay open.
- A course in a skipped level is "skipped" (dashed, open).
- **Primary resume**: the journey's current course when started; otherwise the started, unfinished course most recently worked on
  (latest `completed_at` of its lessons), else the current course ("Start").
- Lessons open in order (existing rule): after the current lesson, the rest are "upcoming" (visible, inert); "locked" is only a
  course the learner doesn't own (tap opens the paywall) or a course the journey keeps locked.

## Approaches considered

- A. Flatten milestones into course nodes at the presentation layer, engine untouched (chosen): no data or rule rewrite, every
  existing engine/badge/certificate test keeps its meaning.
- B. Rewrite the journey data so each course is its own milestone: breaks `requires`, project steps, badges, the certificate.
- C. Keep milestone nodes and add course chips inside: does not match "courses are the milestones".
- Transition: shared-element (rejected: experimental in this stack), native stack animation only (can't be a dive), a root overlay
  (chosen: UI-thread transforms/opacity only, identical on iOS and Android).

## Judgment calls to check

- Node text: the owner earlier asked for no subtitles under Home's nodes (2026-11-16). The brief now lists a short description per
  course; I show it in the resume card (current course), the screen-reader label and the timeline header, not under every node.
- A started course ahead of the current one is open, not locked.
- Back from the timeline is the header button / Android Back through the dive; the iOS edge swipe is disabled on that screen.
