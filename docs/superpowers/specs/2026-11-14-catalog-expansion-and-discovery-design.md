# Catalog expansion and course discovery (2026-11-14)

Owner's two briefs, same day: (1) grow the catalog from 19 courses to a full "zero to professional developer" platform
by adding 54 courses with real lessons; (2) a Course Search, Categorization, Filtering and Sorting system. The owner
handed every decision over ("do what is best, do not ask permission"), so the calls below are Claude's. Change any.

## Intent and goals

Someone with zero programming experience can open Talino, find a beginner course by searching or filtering, follow a
learning path to a professional level, and finish with real projects. Anti-goals: empty course shells, copied lessons,
invented enrollment numbers or ratings, regressions to existing progress, certificates or purchases.

## Approaches considered

1. **One data model, metadata kept beside the courses (chosen).** One `CourseMeta` table for all courses (category, tags,
   technologies, learning goals, publication date, availability, prerequisites). Lesson-level facts (count, minutes, skills,
   objectives, finish line) are read from the course itself, never copied. The discovery system is pure TypeScript
   (`search`, `filter`, `sort`) over `COURSES` + `COURSE_META`, so it is testable and nothing in the UI hardcodes a list.
2. Add the metadata fields to every course file. Rejected: rewrites 19 shipped files and risks their progress ids.
3. A server-side catalog and search. Rejected: Talino is offline-first with no accounts; the catalog is bundled.

## Decisions

- **Existing courses are untouched** (ids, lessons, quiz ids, projects). They gain metadata only through `COURSE_META`.
- **New `kind: 'standard'`** for the 54 new courses (the existing kinds keep their rules and their tests). A standard course
  is sized by its syllabus entry (`content/catalog/syllabus`), one lesson per topic, 5 to 15 lessons.
- **Course type (filter)** is derived: Free = starter; Career = `career`; Learning Path = belongs to a path in
  `LEARNING_PATHS`; Masterclass = standard with 12+ lessons; Course = standard with 8 to 11; Mini-Course = `mini`, or standard with 7 or fewer.
- **14 categories**, one primary per course plus free secondary tags.
- **Most popular** has no real enrollment data (Talino has no accounts), so it is defined from the catalog only: how many
  learning paths include a course and how many other courses list it as a prerequisite. The sort sheet says so.
  **Recommended** uses the learner's own plan and profile when they have one, else the catalog's order. **Newest** is the
  publication date. **Beginner-friendly** is level, then prerequisites, then duration.
- **Price/access rules unchanged:** starter is free, everything else needs its course entitlement or All-Access. New courses
  use the path-course price tier in the simulated store; RevenueCat products are the owner's step (`docs/revenuecat.md`).
- **Lessons** follow the existing teach-first contract (`lib/lesson-structure.ts`); a new check adds: at least one activity
  per lesson, dated official-source `version` notes (every lesson of a fast-moving subject), objectives, prerequisites.
- **Tali** is not authored per lesson: the companion engine builds every course and lesson introduction, quiz line, hint and
  celebration from lesson data, so new courses get them automatically.
- **Audio:** the 216 Kokoro recordings cover existing lessons only; new lessons use the phone's voice until generated.

## Curriculum

The full list (ids, levels, categories, prerequisites, technologies, learning goals, and every lesson topic) is the
syllabus data in `src/features/courses/content/catalog/`. Overlaps resolved there are summarized in the final report.

## Quality gates

`npm test` (structure, syllabus, activities, search/filter/sort), a code-block syntax checker, a source URL checker,
agent review of facts against official documentation, lint, typecheck, and the Courses tab on the simulator.
