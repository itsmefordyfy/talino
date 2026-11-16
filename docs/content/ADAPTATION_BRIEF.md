# Adapting a course to the five learner levels

Talino has five learner experience levels (`src/features/courses/content/levels.ts`): **complete-beginner** ("I have never
written code"), **beginner** ("I know a few programming basics"), **intermediate** ("I have built small projects"),
**advanced** ("I already have development experience"), **professional** ("I work as a software developer").
They describe PROGRAMMING experience, not AI-tool experience: a professional may be new to Claude Code, a complete
beginner may already use ChatGPT. Never assume either way: teach the tool itself to everybody who needs it, and change the
programming depth.

A lesson is not rewritten five times. It keeps ONE shared lesson that every level can follow, and adds small pieces for
particular levels through an optional `audience` range (`{ min?, max? }`, inclusive on the five-step scale). The app shows
each learner the shared lesson plus the pieces for their level, and always offers "Show everything", so nothing is withheld.

## What you may tag with `audience`

- **Any lesson body block** (`paragraph`, `list`, `code`, `prompt`, `table`, `tip`, `warning`, `details`, `diagram`...).
- **Quiz questions** (`QuizQuestion.audience`), **activities** (`activity.audience`), **project steps**
  (`ProjectStep.audience`), **project rubric extras** (`Project.rubricExtra`), and **lesson task extras** (`Lesson.taskExtra`).

Typical ranges: `{ max: 'beginner' }` (complete beginners and beginners), `{ max: 'complete-beginner' }`,
`{ min: 'intermediate', max: 'intermediate' }`, `{ min: 'advanced' }` (advanced and professional), `{ min: 'professional' }`.

## What to add to every lesson (the minimum), without changing any existing text, id, answer or activity

1. **A plain-language block for newcomers** (`audience: { max: 'beginner' }`, 80 to 150 words, placed right after the concept it
   explains): the same idea in everyday words with an analogy, every technical term defined on first use, and "what the code
   above is doing" read line by line when the lesson shows code. Do not assume programming knowledge. For complete
   beginners add a first-principles sentence ("A *file* is..."). This block is shown to complete beginners and beginners.
2. **A depth block for experienced learners** (`audience: { min: 'advanced' }`, 80 to 150 words): the same concept as a working
   engineer meets it: trade-offs, scale, performance, security, testing, failure modes, how it appears in a large or existing
   codebase, accurate terminology without hand-holding. For professionals in AI-tool courses this is where context
   engineering, spec-driven development, MCP, agent workflows, review and validation of generated code, and team-level
   productivity belong (verify product facts against official docs and add a dated `version` note).
3. **One quiz question per side** with the next free question number (ids `<lesson>-q5`, `-q6`... never renumber existing ones):
   a gentler question for newcomers (`audience: { max: 'beginner' }`, checks the plain-language idea) and a realistic
   engineering-scenario question for advanced learners (`audience: { min: 'advanced' }`). Every question: 3 or 4 choices, a
   real explanation, the right answer not always the longest and not always the same slot. The shared questions stay for everyone.
   Each learner must still be asked 3 to 6 questions (`lessonStructureProblems` checks all five levels).
4. **Practice at the right level:** either one extra activity with an `audience` (a gentle warm-up for newcomers: tap-reveal,
   match or a scenario; or a harder one for advanced learners: a fix-bug in a bigger snippet, a design decision scenario), or,
   where a shared activity suits all, nothing. Activity ids stay `<lesson-id>-<kind>-<n>`, unique, and every activity must pass the
   usual validator (JavaScript is executed by the validator).
5. **Task and project:** `Lesson.taskExtra` (extra laptop steps per level, e.g. "ask the AI to explain each line of what it
   made" for newcomers; "write a failing test first and have the agent make it pass" for advanced) and, in each project,
   `audience` steps plus `rubricExtra` (3 to 6 shared criteria stay; add 1 to 3 per level range: a beginner project can be
   smaller and scaffolded, an intermediate project must use an API/database/auth/test, an advanced one an existing codebase,
   scale, performance and security concerns, a professional one an agent-assisted workflow with review evidence).

Not every lesson needs every piece: adapt the levels that make sense for the subject (a lesson on "what a prompt is" needs the
newcomer block more than the professional one; a lesson on MCP servers needs the professional block more). But **every
lesson gets at least one newcomer piece and one experienced piece**, and every course covers all five levels somewhere in its
quizzes, tasks or projects.

## For AI-focused courses (the AI-Assisted path, Builder, Starter, Experienced Developer, AI mini-courses)

Tailor by level as the owner defined:

- **Complete Beginner:** introduce the AI tool from scratch; how to give instructions to AI (a clear request: goal, context,
  constraints, example); build simple websites and apps with AI; explain generated code in plain language; no prior
  programming knowledge; basic concepts through practical examples.
- **Beginner:** generate and modify code with AI; learn fundamentals through AI-assisted projects; simple React, JavaScript and
  Python apps; debug common errors with AI; understand project structure and code organisation.
- **Intermediate:** build complete applications with AI; APIs, databases, authentication and integrations; Claude Code, Cursor
  and Codex used effectively; refactor existing projects; generate and run tests; debug harder issues.
- **Advanced:** large and existing codebases; AI for architecture and system design; complex features with coding agents;
  scalable applications; automate development and testing workflows; performance and security.
- **Professional:** AI in professional engineering workflows; managing complex AI-assisted projects; agentic and multi-agent
  workflows; reviewing and validating AI-generated implementations; engineering productivity; context engineering,
  spec-driven development, MCP and advanced automation.

Prompt examples change with the level too: a newcomer's prompt is plain and specific ("Make a page with my shop's name and
three prices"); a professional's prompt is a constrained, testable spec with context and acceptance criteria. Show both
where the lesson teaches prompting, as `prompt` blocks with the matching `audience`.

## Rules

- Never delete or reword existing content, ids, answers or progress-relevant data. Only add. (Learners' progress is stored by lesson,
  quiz and activity ids.)
- A newcomer block must not become the only place a concept appears (the check requires 250 words of shared teaching).
- No condescension: "plain words" never means "dumbed down", and the depth block never means "show off".
- Accuracy rules of docs/content/WRITING_BRIEF.md apply: verify every technical claim, run every example.
- Check with the course's own test (`npx jest src/features/courses/content/...` for path courses; for others the content test)
  and `npx tsc --noEmit` (errors about a missing `fil` locale in `strings.ts` files come from a separate Tagalog translation effort:
  ignore them).
