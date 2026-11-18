# How Large Language Models Work: design (2026-11-18)

Owner's brief (pasted 2026-11-18): build, inside the existing Talino app, a complete course "How Large Language Models Work" (11 modules, the lessons listed per module, a 25-question final
assessment with four choices and explanations, a practical challenge "design a simple AI assistant workflow", diagrams and interactive activities, no programming), differentiated from
*AI Fundamentals for Everyone* and the other AI courses; test the learner journey; report counts. Mid-session the owner added: "use Kokoro TTS here". The owner has opted out of questions
(standing autonomy), so this records the decisions instead (brainstorming gate: opted out, brief is complete).

## Intent and the why
People use ChatGPT, Claude and Gemini daily and are surprised when they forget, invent a source or answer differently the second time. Each surprise has a mechanical reason. The course
teaches that mechanism well enough to predict the behaviour and to decide when to add context, retrieval or a human check. It is a **mechanism** course: *why* it works that way, never prompt
recipes or build steps.

## Goals, non-goals, anti-goals
- Goals: one catalog course, 11 modules, 77 lessons (the owner's lesson titles exactly), every lesson with the contract the brief names (objectives, content, examples, real-world use, takeaways, a
  knowledge check or activity), diagrams for the ten named concepts, interactive visuals where a concept is best played with, a five-part 25-question assessment, one practical challenge as the
  course's project, the established-vs-varies distinction made visible in every lesson.
- Non-goals: a new app section, a new AI service or server route, live model calls (no prompt labs: no key of the owner's is spent), a second TTS vendor, a Tagalog edition (standing rule),
  a leaderboard or a new assessment engine, code or advanced mathematics.
- Anti-goals: claims about any product's architecture, size, data, price or benchmark; invented statistics; analogies presented as mechanisms; marketing.

## Decisions (mine, recorded; the owner can overrule any)
1. **Course id `how-llms-work`, `kind: 'standard'`, level `intermediate`**, category `ai-coding-fundamentals`, goals `learn-ai-dev` only (more goals would let it outrank beginner and career courses in the
   recommendation tests), `volatile: false` (concepts hold across providers; products are named only as examples, so no dated `version` notes are needed). `prerequisites: ['ai-fundamentals-everyone']`
   (advice only, never a lock). The brief's "Beginner to Intermediate" lands on the **intermediate tier** because the intended progression is AI Fundamentals (beginner) → this → advanced courses; the
   tier's "best for" range (beginner to intermediate learners) is exactly the brief's audience.
2. **77 lessons, one per brief lesson.** Modules 1 to 10 map 1:1 to the brief (5, 6, 6, 7, 7, 8, 8, 8, 6, 8 = 69 lessons). Module 11 ("Final Assessment and Practical Challenge") is 8 lessons: the
   comprehensive knowledge review, **the 25-question assessment as five parts of five questions** (the lesson contract allows 3 to 5 shared questions per lesson, so one 25-question page would need
   a new engine; five parts follow the sibling AI Fundamentals course's four-part assessment), the practical challenge and the reflection.
   Duration: the brief estimates 4 to 6 hours; 77 lessons at the catalog minimum of 10 minutes cannot be that short. **Recorded deviation**: lessons are kept short (10 to 14 minutes) and the total is
   reported honestly in the status file; the brief's lesson list was kept over its time estimate, as every earlier catalog course did.
3. **Assessment fairness.** Each assessment part has 4 shared questions plus one question per level band (newcomer, intermediate, advanced and professional), so **every learner level answers exactly
   5 questions per part and 25 in all**, each with four choices and an explanation. `catalog/llm-module.test.ts` enforces it. Scoring, XP, the 60% pass rule, best-attempt storage and course
   completion are the app's existing quiz and progress code, unchanged.
4. **The practical challenge is the course's project** `how-llms-work-p1` (text submission, rubric, level extras, reviewed by the coach through the existing project review): the learner designs a
   simple AI assistant workflow (the problem, the input, how the model processes it, the expected output, hallucination risks, how to verify). No programming. Lesson 76 teaches it with a
   workflow-builder activity; the project opens after day 76. The standard rule that the final project opens after about 70% of the lessons holds.
5. **Interactive learning reuses the existing activity kinds** (scenario, match, tap-reveal, arrange, fill-blank, workflow-builder in modules 9 to 11) and the existing AI visuals (tokens, embeddings,
   next-token prediction with temperature, context window, RAG, agent loop). **Three new visuals** (`llm-attention`, `llm-sampling`, `llm-transformer-flow`) cover what no visual did: self-attention,
   top-k and top-p, and the Transformer step by step. Each is an illustration with made-up numbers (the arithmetic is real) and says so on screen.
   True/false practice is a quiz question phrased "True or false, and why" with reasoned choices, so it fits the 3-to-4-choice quiz contract.
6. **Lesson shape** (checked by `catalog/llm-module.test.ts`): an opening paragraph; "A real situation"; "How it works" (with a diagram, visual or table, a plain-language block for newcomers and a depth
   block for advanced learners); "A worked example"; "In the real world"; a collapsed **"What is settled, and what varies between models"** block (the brief's requirement to separate established
   principles from implementation details); takeaways; two or more activity kinds; a quiz (shared plus a newcomer and an advanced question); a task ending in a reflection question, with level extras.
7. **Honesty rules** (`docs/content/LLM_BRIEF.md`): nothing about any product's architecture, size, training data, context size, release, price, benchmark or ranking; numbers in lessons are small, labelled
   invented; analogies are labelled; open research questions are called open; no code, no formulas beyond multiply, add and compare.
8. **No Tali code change.** The coach already receives the lesson, the learner's level and the project steps; a course-specific coach focus was not asked for and is listed as not done.
9. **Persistence, enrolment, access:** nothing new. The course is a catalog entry like the others: progress, quiz results, activity progress, project submissions, XP and the certificate use the
   existing tables; access follows the existing Free/Pro rules for catalog courses (no price or subscription rule is touched).
10. **Kokoro narration only** (owner, 2026-11-18, and the standing rule): the lessons' scripts are exported with `scripts/audio/export-scripts.cjs` and `run-how-llms-work.sh` makes the recordings for
    Tali's (`am_puck`) and Tala's (`af_heart`) voices; Gemini speech is never used. Until a lesson has a hosted recording the phone's own voice reads it.
11. **English only.** No Filipino or Tagalog was written; new typed `fil` tables copy the English text as a placeholder (standing rule).

## Placement
Catalog: Discover under AI coding fundamentals; learning path "Generative AI for Everyone" (after AI Fundamentals for Everyone); a side, late-addition journey milestone "How LLMs work inside" in
Intermediate (no existing learner's place moves; the road to the AI Expert certificate is unchanged); world "The Glass Engine Room"; cover (neural, night); What's New item `howLlmsWork`; store texts.

## Curriculum
`catalog/syllabus-llm.ts` is the contract (lesson titles).

## Constraints
Existing courses, ids, learner progress and journey places never change. No dependency, no migration, no server route, no secret. The owner's prepaid Gemini key is not used by anything new.

## Verification
Per-module checks (`CHECK_LLM_MODULE=n`), the whole-course check (`CHECK_COURSE=how-llms-work`), the catalog, journey, adventure, covers, recommendations, visuals and strings suites, tsc, eslint, a
learner-journey simulation test (`how-llms-work.course.test.ts`: counts, the 25-question assessment at every level, progress and completion through the app's own progress code), and an Android bundle export.
Everything not seen on a screen or device is listed in `docs/content/LLM_STATUS.md`.
