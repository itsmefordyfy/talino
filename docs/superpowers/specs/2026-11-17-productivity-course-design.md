# Time Management and Productivity: design (2026-11-17)

Owner's brief (pasted 2026-11-17): a complete AI-integrated beginner course, 10 modules, 4 to 6 lessons each, 3 projects, five interactive activities (Eisenhower
Matrix, Daily Schedule Builder, Pomodoro timer, Productivity Challenge, AI Prompt Playground), Tali/Tala as a productivity coach, real assessment and persistence,
reuse across learning paths without duplicate course records, Kokoro narration (never Gemini TTS), English and Taglish, "make routine decisions independently".
The owner opted out of questions, so this records the decisions instead (brainstorming gate: opted out).

## Intent and the why
Everyone Talino serves (developers, freelancers and VAs, builders, teachers, career changers) is judged on whether work arrives on time and whether they stay well.
Soft Skills for the Modern Workplace already has one five-lesson module on time. This course is the deep version: it is **practised, not recited**. The learner
sorts a real workload, builds a day that survives an interruption, runs focus sessions, and uses AI as a planning partner whose output they check.

## Goals, non-goals, anti-goals
- Goals: one catalog course (10 modules, 43 lessons, about 10 hours, 3 projects) in the existing catalog; four free interactive tools (matrix, schedule builder,
  Pomodoro timer, prompt playground) that keep the learner's own work; one graded activity kind (`planning`) that scores a prioritised workload and a day plan by rules;
  the existing role-play and message-coach engine reused for the AI practice; Tali/Tala that know the lesson and the activity in front of the learner.
- Non-goals: a calendar sync, a new app tab, a second AI service, a new TTS vendor, push notifications for the timer, a Tagalog edition (see Decisions).
- Anti-goals: a schedule that scores well because it has no breaks or no life in it; AI output counted as the learner's skill; productivity-tracking pressure
  (module 10 teaches rest, boundaries and when *not* to measure); a claim about what the learner "always" does; a prompt "checker" presented as an AI.

## Decisions (mine, recorded; the owner can overrule any)
1. **English only.** The owner's standing rule (no Filipino or Tagalog text written or edited; `TAGALOG_ENABLED` false; Kokoro has no Filipino voice) overrides the brief's
   Taglish request. New strings are English; where a typed string table requires `fil`, English placeholders are used and not translated. Reported as not done.
2. **Course id `time-management-productivity`**, `kind: 'standard'`, `level: 'beginner'`, category `careers` (the catalog's home for professional skills; the brief's
   "Professional Development / Soft Skills"), goals `get-job` and `freelance`. **One record**, reused by id in every learning path: `professional-skills` (general
   professional development), `freelance-with-ai` (freelancer and VA), `build-and-sell` (entrepreneur), `ai-assisted-developer` (AI-powered developer and IT professional) and
   the educator's journey/path; no course is copied, no existing id, enrolment or progress row changes.
3. **Overlap with Soft Skills module 4** is deliberate and recorded in `docs/content/OVERLAPS.md`'s spirit: that module is five lessons inside a communication-led course
   (a weekly schedule stress-tested with AI, a deadline role-play); this course is the deep version (habits, goals, priorities, focus, tools, automation, remote work,
   sustainability). Lesson titles differ, the practice items differ, and the course's `prerequisites` stay empty (advice only: the soft skills course is a natural neighbour).
4. **Tools are `visual` blocks**, the existing interactive-explanation mechanism (`features/visuals`, shown in lessons and in the Concept Lab), new category `productivity`:
   `eisenhower-matrix`, `daily-schedule-builder`, `pomodoro-timer`, `ai-prompt-playground`. They are real tools, not pictures: the learner adds their own tasks, moves them, builds a
   day, runs a timer. **Their state is kept** on the phone: the matrix, the day plan, the timer and the prompt drafts as small JSON in the existing `app_state`
   table under `productivity:` keys, and finished focus rounds in a new `focus_sessions` table (append-only migration 10). Both are in "reset all data" and **excluded
   from the cloud backup like practice sessions** (`EXCLUDED_TABLES`, `docs/BACKUP_FORMAT.md`); the owner can move `focus_sessions` into `BACKUP_TABLES` if wanted.
5. **The graded activity is one new kind, `planning`** (the Productivity Challenge, and the module practice tasks), with two modes: `prioritize` (sort a fictional workload into the four quadrants) and
   `schedule` (build a day from tasks, fixed commitments and an optional interruption). One kind keeps the number of edits to the shared activity files (XP, adventure kinds, strings,
   validation, dispatch) small. Scoring is **deterministic code, never a model**: `productivity/lib/matrix.ts` and `lib/schedule.ts`. The schedule is scored on five dimensions
   (prioritisation, time allocation, realistic planning, handling the interruption, decision making). **Hard failures never pass**, whatever the rest scores: overlapping blocks,
   work outside the day's window, a must-do task missing or late, no break, a focus run longer than the scenario allows, work packed past the day's cap. A plan with no rest or no
   personal time is therefore refused, as the brief requires. Every scenario carries a reference `solution` that must pass its own rules (`validateActivity`).
6. **AI practice reuses the Soft Skills practice engine** (role-play and message coach, `features/practice`, `/api/practice`): this course adds its own items
   (`practice/scenarios/productivity/module-NN.ts`), read by the server by id like every other; no server change. A role-play partner is a person (a busy teammate, a client
   with conflicting deadlines), never "the AI productivity coach reading a script".
7. **The Prompt Playground is local and labelled.** It holds editable prompt templates (daily plan, weekly plan, prioritisation, task breakdown, meeting summary, project schedule,
   productivity review), explains each part, fills the learner's own details into the brackets, **copies** the prompt for their own assistant (ChatGPT, Gemini, Claude…) and
   gives **structure suggestions** from a rule-based check (role, goal, context, inputs, limits, format, a request to ask or list assumptions, privacy). It says plainly that it does
   not run an AI and cannot judge quality; the live model is Tali (the coach), reachable from the same screen. The Generative AI course's `prompt-lab` (live runs) is separate work
   in progress and is not duplicated or depended on; productivity lab tasks can be added to it later as data.
8. **"AI in Action"** is a heading with a short, hand-written illustration in every lesson, always labelled "Illustration, written by hand, not a live AI's output", because
   a made-up output must never pass as a real one.
9. **Tali/Tala** (`coach/lib/productivity.ts`, as `soft-skills.ts`): in this course the coach knows the lesson and the activity in front of the learner (the matrix's scenario, the day's
   rules) from public fields only, asks what the learner has tried, and works only from what the learner typed or placed; it never says what the learner "usually" does.
10. **Honesty rules for content.** No invented statistics or studies; a named technique (Eisenhower, Pomodoro, time blocking, implementation intentions, habit stacking, the planning
    fallacy, Parkinson's law) is described in the lesson's own words and labelled a rule of thumb where it is. Tools (Google Calendar, Notion, Trello, Todoist, Microsoft To Do, Jira,
    ChatGPT, Gemini, Claude, Zapier, Make, n8n) are taught by what they are for, with no prices, plan limits or button tours (nothing there is stated as a product fact, so no `version` notes);
    the core course never needs a paid plan. Module 10 teaches rest, boundaries and "enough".
11. **Kokoro narration:** lesson scripts exported for the 43 lessons with the existing `scripts/audio` tooling; recordings are a Mac job (hours of compute, uploaded by the owner), not run here.
12. **Persistence:** activity progress, quiz results, project submissions and certificate progress use the existing tables unchanged; the tools use `app_state` (no new table for
    their state) and add `focus_sessions` (one append-only migration). A graded planning attempt is saved like any activity (attempts, hints, XP once); the half-built plan is kept while
    the app is open (`useActivityDraft`), not across launches, like every other activity's draft.

## Curriculum (43 lessons)
Titles are the contract (`catalog/syllabus-productivity.ts`): M1 Understanding Time Management (4), M2 Goal Setting and Planning (4), M3 Prioritization and Decision Making (4),
M4 Planning Your Day and Managing Your Schedule (5), M5 Beating Procrastination and Staying Motivated (5), M6 Focus, Deep Work and Managing Distractions (4), M7 Productivity Tools
and Digital Organization (4), M8 Productivity with AI and Automation (5), M9 Time Management for Work, Study and Remote Careers (4), M10 Sustainable Productivity and Continuous
Improvement (4). Projects: P1 My Personal Productivity System (after M7, day 30), P2 AI-Powered Productivity Assistant (after M8, day 35), P3 The Productive Professional Challenge (after M9, day 39).

## Approaches considered (for the interactive tools)
1. **Everything as graded activity kinds** (a kind each for matrix, schedule, timer, prompt lab). Rejected: a timer and a prompt editor have nothing to grade, and four kinds means four sets of edits to
   files other work is changing at the same time.
2. **Everything as free visuals, no grading.** Rejected: the brief wants evaluation of prioritisation, time allocation, realistic planning, interruptions and decisions, and a project that depends on it.
3. **Free tools as visuals plus one graded `planning` kind that reuses the same boards.** Chosen. The learner meets the tool free and persistent, then the same board with a scenario and a score.

## The parts
- `features/productivity/` (new): `types.ts`, `lib/{matrix,schedule,pomodoro,prompt-check,time}.ts` (pure, tested), `data/prompt-templates.ts`, `api/productivity-repo.ts` (tool state in `app_state`, focus log in `focus_sessions`),
  `hooks/`, `components/` (matrix board, day planner, timer, prompt playground), `strings.ts`. Public API through `index.ts`.
- `features/visuals/productivity/` registers the four visuals. `features/activities`: kind `planning` (types, validation, checking, view, XP 12, adventure kinds, strings).
- Course content: `catalog/syllabus-productivity.ts`, `catalog/courses/time-management-productivity.ts` + `time-management-productivity/module-NN.ts` + `skills.ts`; practice items in
  `practice/scenarios/productivity/`; wiring (registered list, generated index, cover, world, paths, journey side milestone, What's New, store text).
- Lesson shape (checked by `catalog/productivity-module.test.ts`): intro, an opening paragraph, "A real situation", "How it works" (the technique), "Weak and strong examples", level pieces,
  "AI in Action", "Try it with AI" (a copyable prompt where the learner thinks first), "Next steps", takeaways last; two or more activity kinds; 3 to 5 scenario quiz questions; a task.

## Constraints
Existing learners' progress, enrolments and journey places never move (new catalog entry only, journey milestone is a late-added side step). The owner's prepaid Gemini key is not used by any new
code path (the practice engine's existing routes serve the new items; **no live call was made by this work**). No secrets, no new dependency.

## Tests and verification
Jest for every pure part (matrix, schedule scoring with the reference solutions and hard failures, timer state machine with an injected clock, prompt check, repo against `node:sqlite`, kind registration);
the module checks and whole-course check; tsc and lint; the tools and the challenge seen on the iOS simulator (and Android/web where they can be run). Everything not seen is listed in
`docs/content/PRODUCTIVITY_STATUS.md`.
