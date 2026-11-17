# Programming Fundamentals: Think Like a Programmer (design, 2026-11-16)

Owner's brief: add a complete beginner course that teaches how software works, problem solving, reading code and working with AI coding tools,
in 12 modules (understanding programming, computational thinking, variables, operators, conditions, loops, functions, data structures,
reading/debugging/testing, how languages work, programming with AI, a final expense-tracker project), concept-first and language-independent,
with JavaScript as the practice language. The owner made routine decisions mine ("do not ask me"). Narration is **Kokoro** (owner, same day),
never Gemini.

## Decisions

1. **An exception to the AI-first rule, recorded.** CLAUDE.md (2026-11-14) forbids a standalone programming course; the owner lifted it for this
   one because understanding logic is what lets a learner direct, read and judge AI code. It is not a JavaScript course: it teaches ideas and
   uses JavaScript only because the in-app runner runs it. No web, framework or backend content. The archived `programming-fundamentals` and
   `computational-thinking` courses (never shipped) were raw material only; nothing is duplicated in the live catalog (`understanding-ai-code`
   reads generated code; `ai-coding-beginners` is a first win; neither teaches the ideas).
2. **One course, twelve modules, sixty lessons.** The catalog allowed 5 to 15 lessons and had no grouping. A syllabus entry may now carry
   `modules` (`SyllabusModule`: slug, title, summary, topics) and then up to 80 lessons (`lessonLimitOf`); `Course.modules` records each module's
   first and last day (`standardCourseProblems` checks them against the syllabus). The Adventure map (the course's lesson timeline) draws one
   chapter per module, titled with it. The 99 topics in the owner's outline were folded into 60 lessons of 15 to 30 minutes, so a lesson teaches
   two or three of the owner's bullets (for example "Constants" and "Naming Conventions"); every bullet is still taught.
3. **Eleven projects, one per module that has a practical project** (module 10, conceptual, has none); the last (the expense tracker) opens at
   lesson 59. Each asks the learner to explain their choices, so the coach's review assesses understanding. Existing progress ids are untouched.
4. **Ten-part lesson shape, enforced.** Every lesson has the same headings: an opening, "A real-world picture" (analogy), "How it works" (concept
   and a diagram/visual/table), "See it in code" + "Walk through the code" (or "Walk through an example"), the level pieces, "Try it with AI"
   (a copyable prompt that guides instead of answering), takeaways, at least two interactive activities of different kinds, a quiz and a task.
   `programming-fundamentals-structure.test.ts` checks it. The existing rules (teach first, level adaptation, activity validator, code blocks parse)
   apply unchanged. The owner's activity list maps onto the nine existing kinds (a trace table is a fill-blank or predict-output; a flowchart is an
   arrange over its steps); no new activity kind was added.
5. **Journey.** A new Beginner milestone "Think like a programmer" after "Meet AI", flagged `lateAddition`: a learner who has already started a
   later milestone is not pulled back to it (it stands aside, shown as skipped and still open), so no existing progress or position changes.
   Complete beginners meet it as their second step. No other course gains a prerequisite (none is justified). A learning path, "Think Like a
   Programmer", lists it first.
6. **Tali.** Lesson, quiz-question and exercise focus already hand Tali the lesson text and the hints-first rule. For programming lessons she
   also gets `CODE_TEACHING_INSTRUCTIONS` (walk a line with real values, predict first, never open with the answer) and the suggested questions
   become "Explain this in simpler terms", "What does this line mean?", "Give me another example", "What happens if I change this value?", "Give me a
   similar exercise".
7. **Languages.** English only. Tagalog is switched off app-wide (`TAGALOG_ENABLED = false`) and the owner's standing rule is not to write Filipino
   text, so the new course is English in Tagalog mode too (the app already shows "English lang muna" for an untranslated course); the Tagalog tables
   carry English placeholders where the types demand a key. Narration: the Kokoro pipeline (`scripts/audio`), phone voice as the fallback.

## Not in scope

A Tagalog translation of 60 lessons; a new activity kind; hosting the Kokoro recordings (an owner step).
