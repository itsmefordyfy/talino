# Soft Skills for the Modern Workplace: design (2026-11-17)

Owner's brief (pasted 2026-11-17): a complete AI-integrated beginner course, 10 modules, 4 to 7 lessons each, 3 projects, a reusable AI
role-play engine, an AI communication coach, speaking practice where the platform allows it, real persistence, no fake results, Kokoro
narration, English and Taglish, iPhone, iPad, Android and web. "Make reasonable implementation decisions independently."
The owner left routine decisions to me, so this records them instead of asking. (Brainstorming gate: the owner opted out of questions.)

## Intent and the why
Developers, freelancers, VAs, builders and teachers are hired and kept for how they communicate, think, plan and behave. Talino already
teaches the tools; this course teaches the human half, and it is **practised, not recited**: the learner talks to a simulated
client, manager or interviewer, writes a message a coach reviews, and is graded on what they did.

## Goals, non-goals, anti-goals
- Goals: a complete course (10 modules, 54 lessons, 3 projects) in the existing catalog; one reusable role-play engine and one message
  coach used by lessons and projects; real saved sessions and scores; Tali/Tala as the learner's assistant; course reachable from relevant paths.
- Non-goals: a new app section for the engine (it lives inside lessons and projects), analysing voice, face or body language (no
  reliable input exists), live speech recognition (no recognition module is installed; see Speaking), a new TTS vendor.
- Anti-goals: an AI that hands over the ideal answer; a score that is really the AI's opinion of itself; AI-written work counted as the
  learner's skill; a made-up result shown as a real one; Filipino text written without the owner (standing rule, see Decisions).

## Approaches considered (for the engine)
1. **A new standalone "Practice" feature with its own tab and scenario editor.** Rejected: a large new surface, nothing in the brief asks for
   it, and a role-play away from its lesson loses the teaching context.
2. **Reuse the mock-interview feature as is, with a "role" parameter.** Rejected: it is hard-wired to interviews (questions asked, answers
   counted, interview-specific report, résumé candidate text, its own routes and tables).
3. **A reusable engine beside the interview, sharing its plumbing, driven by scenario data, embedded in lessons as new activity kinds.**
   Chosen. Same server pattern as `/api/interview` (Gemini key server-side, instructions built on the server from checked input, allowance
   through the shared `ai_chats` table, conversation on the phone, validation of every model reply), same coach identity and
   error codes, but the scenario is data (`features/practice/scenarios`) and the server reads it **by id**, so a modified app cannot rewrite the partner.

## The parts

### Course content (data only)
- `catalog/syllabus-soft-skills.ts` (10 modules, 54 topics), `catalog/courses/soft-skills-workplace.ts` (assembly, as OOP), one
  `courses/soft-skills-workplace/module-NN.ts` per module (lessons, and a project in modules 5, 8 and 10), `skills.ts`.
- Lesson shape (checked by `catalog/soft-skills-module.test.ts`): intro, an opening paragraph, "A real situation", "How it works",
  "Weak and strong examples" (a table or diagram), the level pieces, "Try it with AI" (a prompt the learner copies; the learner does the
  thinking first), takeaways, at least two activity kinds, a 3 to 5 question scenario quiz and a task. Every module has at least one
  `roleplay` or `message-review` activity.
- Projects (the standard check wants one to open after about 70% of the course): P1 Professional Communication Challenge (module 5,
  opens after day 27), P2 Workplace Simulation (module 8, after day 42), P3 Career Readiness Portfolio (module 10, after day 52).
  Submissions are `text` (reflection and chosen work), each step names the practice items to complete, and the review reads the learner's
  saved sessions (below).

### The practice engine (`src/features/practice/`)
- **Scenarios and tasks** (`types.ts`, `scenarios/module-NN.ts`, `catalog.ts`): `RoleplayScenario` (setting, goal, a partner with a
  role, personality, private motives and how they react to good and poor answers, an opening line, turn limits, criteria, private
  rubric and traps) and `MessageTask` (situation, brief, received message, what a complete answer contains, length, criteria).
- **Activities** `roleplay` (`scenarioId`) and `message-review` (`taskId`) in `features/activities`. A role-play is done when the learner had
  at least `minTurns` turns **and** the debrief arrived; a message review is done when the coach's review arrived for a real message
  (a minimum length, not pasted from the task text). XP is paid once, as for every activity; the **score is stored and shown, but
  completing never depends on scoring high** (learning is the point; a retry is always offered). The activity's own `hints` coach the approach and never hold a model answer.
- **Role-play**: the partner opens with the scenario's line; the learner replies in a free text box; each reply goes to the server with
  the scenario id and the recent messages; the model plays the partner in character and **adapts** to what the learner said (the
  scenario says how the partner reacts to strong and weak answers); it never breaks character to coach, and never reveals the rubric.
  After `minTurns` the learner can **End and get feedback** (or it ends at `maxTurns`). The debrief is a JSON report validated on the
  phone: a 0-100 score per criterion the scenario names (only those), strengths and growth areas **quoting the learner's own lines**, one specific
  thing to try next time, and a note when too little was said to judge. **Retry** starts a fresh session of the same scenario; every session is kept.
- **Message coach**: the learner writes the message, the coach returns the seven measures (clarity, tone, grammar, professionalism,
  completeness, empathy, actionability; only those the task names count), each with a short reason, what is missing from `mustInclude`
  (without dictating wording), and **a suggested improved version beside the original with a "why this changed" list**, so the learner can compare. The suggested version is a model of
  how to improve, not an answer to copy; the learner is asked to rewrite it in their own words and send it back for a second review, and only the learner's own text is ever stored as their work.
- **Speaking** (honest): no speech-recognition module is installed, so the app does **not** transcribe audio itself. For scenarios marked
  `speaking`, the partner's lines are read aloud (`expo-speech`, the phone's voice; Kokoro is for pre-recorded lesson narration, it can't be
  called live), the learner answers by the keyboard's built-in dictation (works on iOS and Android) or typing, and the feedback judges **the words only**: structure, clarity, relevance, and
  signs of hesitation that show in the words themselves (filler words, trailing off), which the report labels as "in your words". It says
  in the screen and the report that it does not hear tone, pace, volume or confidence, and does not see body language. A real
  recording-and-transcribing option is a future change that needs a new native module and the owner's choice of a speech service.
- **Server** `src/app/api/practice+api.ts`: modes `turn`, `report`, `review`. Same shape as `/api/interview`: Gemini key only here, scenario by id from the
  catalog, input sanitised and size-limited, replies parsed and validated (untrusted), allowance counted in `ai_chats` under an app name `talinopractice` (a session or
  a review counts once; its follow-up turns and its report are free; the same Free/Pro fair-use idea as the interview), the owner's prepaid Gemini key (the owner
  agreed to the interview feature using it; **this is new use of it, flagged in the report**).
- **Persistence** (SQLite, append-only migration): `practice_sessions` (id, item id, kind, course/lesson/project it came from, started/ended,
  turns, status, report JSON, score, the learner's `attempt` number) and `practice_messages` (session id, order, role, text). Added to
  `docs/BACKUP_FORMAT.md` and the backup tables (the learner's own words and scores are theirs, kept like the interview's), to delete-all, and to demo-data removal where relevant. Activity completion uses the existing activity-progress table.
- **Screens**: one `PracticeView` inside `ActivityView` for both kinds (loading, error with retry, empty, content; Free-limit and offline states), usable at iPhone, iPad and web width, accessible (labels, 44 pt targets, Dynamic Type, results not conveyed by colour alone), a **History** list of past sessions per scenario on the activity itself, and the report card.
- **Tali / Tala**: in a lesson with a practice item the coach screen knows the scenario's title and goal (not its private fields), so the learner can ask for a hint without the answer; reuse the coach's focus mechanism (`coach/lib/focus.ts`).
- **Projects** review: the coach's project review prompt receives a short summary of the learner's saved sessions for the practice items the project names (item title, best and latest score, one growth area), clearly labelled as practice results; the submission text stays the learner's own words.

## Constraints
- English only. The owner's standing rule (no Filipino or Tagalog strings written or edited; `TAGALOG_ENABLED` is false; Kokoro has no Filipino voice) overrides the brief's
  "natural Taglish"; the engine's `language` parameter and strings tables follow the existing English-placeholder pattern. Reported to the owner as not done.
- Kokoro narration: scripts are exported for the 54 lessons and the generation job is started on this Mac like the OOP and DSA courses (local files only, upload is the owner's).
- Assessment honesty: AI output is never evidence by itself; scores come from the learner's own text in a validated report; the report states what it could not judge.
- Existing learners' progress, enrollments and journey places never move: the course is a new catalog entry; no existing id changes.

## Wiring
Registered course (`registered.json`, `courses.generated.ts`, `course-index.data.ts` regenerated), cover, adventure world, a learning path
`professional-skills` ("Soft Skills for Work", the course alone plus the course's natural neighbours as advice) and the course added to the
existing `freelancer`/`developer`/`builder`/`educator`-fitting paths **by id** (no duplicate course record), a **side** journey milestone as for OOP (the road
to the AI Expert certificate is unchanged), What's New and store text, Tali's mode for the course, `CLAUDE.md` and `docs/content/SOFT_SKILLS_STATUS.md`.

## Tests and verification
Jest for every pure part (prompts, turn and report parsing, session state, repo against `node:sqlite`, the route with a fake Gemini, scenario catalog rules: every scenario has
3 to 6 valid criteria, a private rubric, sane turn limits, no private field in what the app receives); the course checks (`CHECK_SOFT_MODULE=n`, `CHECK_COURSE=soft-skills-workplace`);
tsc and lint; the learner journey seen on the iPhone and iPad simulators (and Android emulator and web if they can be run); a live Gemini run only with the owner's key and
only for a short smoke test. Everything not seen is listed in the status doc.
