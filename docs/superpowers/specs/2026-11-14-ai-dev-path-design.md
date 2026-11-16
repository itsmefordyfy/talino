# AI-Assisted Software Development path: design

Owner's brief, 2026-11-14. Decisions below are Claude's where the brief left them open.

## What it is
A learning path of seven courses (`kind: 'path'`, `path: { id: 'ai-dev', order }`), one lesson per syllabus topic
(`content/ai-dev/syllabus.ts`), 79 lessons in all:

| # | Course | Level | Lessons |
|---|---|---|---|
| 1 | Introduction to AI for Software Developers (`ai-dev-intro`) | Beginner | 7 |
| 2 | Mastering ChatGPT for Software Development (`ai-dev-chatgpt`) | Beginner | 11 |
| 3 | Mastering Claude for Software Development (`ai-dev-claude`) | Beginner | 11 |
| 4 | Mastering Claude Code (`ai-dev-claude-code`) | Intermediate | 15 |
| 5 | Mastering Cursor (`ai-dev-cursor`) | Intermediate | 13 |
| 6 | Mastering OpenAI Codex (`ai-dev-codex`) | Intermediate | 10 |
| 7 | Advanced AI-Powered Software Engineering (`ai-dev-advanced`) | Advanced | 12 |

Every lesson follows the teach-first structure (`lib/lesson-structure.ts`), has at least one activity, a quiz with explained
answers and a laptop task; every course has at least one project reviewed by Tali; Course 7's second project is the capstone.

## Keeping tool facts current
- `version` lesson blocks hold every product-specific statement with the date it was checked and the official pages it was
  checked against (drawn as "Checked <date> · may change" with links). A tool course has one in every lesson; sources must be
  on an official host (`lib/path-rules.ts`). Re-checking a tool means re-reading those pages and updating those blocks.
- `content/ai-dev/tools.ts` is the one place for the seven-tool comparison (ChatGPT, Claude, Claude Code, Codex, Cursor,
  Copilot, Gemini): the comparison lesson (`toolComparison` block) and the AI tools guide (`/ai-tools`) read it. Plans are
  named in words, never with price figures.
- Screenshots of the products are not included: we have none we may use, and must not fake them. Diagrams describe workflows.

## Existing courses
Talino has no standalone JavaScript, React, React Native, Node, SQL, Git, architecture, testing, DevOps or API course.
Adding lessons to the career courses would un-finish courses (and certificates) learners already completed, so the owner's
table of AI-assisted topics is taught in path lessons (`STACK_COVERAGE`, tested to really mention each topic), and the
courses that lead into the path (starter, developer, experienced, the AI engineering and QA minis) show "Go further with
AI tools" links (`PATH_NEXT_STEPS`). The path's own lessons go deeper than, and point back to, the starter, Developer and
Experienced lessons on prompting, checking output, tests, debugging, Git and review, instead of repeating them.

## Discovery, progress and rewards
- Courses tab: an "AI-Assisted Development" section after the career courses: a path card (what it is, "x of 7 courses
  finished", "Where should I start?", "AI tools guide"), then the courses grouped Beginner / Intermediate / Advanced.
  Course cards and course pages show the level. Worlds (adventure) list the path as "AI development worlds".
- "Where should I start?" (`/ai-path-check`, `lib/ai-placement.ts`): eight tool-agnostic questions in four tiers; the
  learner starts at the first tier not fully passed. Nothing is saved.
- Badges: one per path course (`path:<id>`, tool-specific progress), "AI Developer" (all seven) and "Capstone shipped"
  (`ai-dev-advanced-p2` passed). A path course is not a career course: it never counts toward Talino Master.
- Onboarding: a new interest "AI coding tools", and path courses weighted into the plan for software-engineer, frontend,
  backend, full-stack, improve-skills and the architecture interests (beginners steered away from the agent courses).
- Store: one non-consumable per course (`talino_course_ai_dev_*`, entitlement `course_ai_dev_*`), included in All-Access,
  not in the launch bundle. Simulated price ₱499 each (Claude's call; real prices are set in the stores).
- Certificates work as for career courses (all lessons and passed project reviews).
