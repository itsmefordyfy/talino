# Soft Skills for the Modern Workplace: brief for module writers

**Course:** `soft-skills-workplace`, "Soft Skills for the Modern Workplace" (beginner, 54 lessons in 10 modules, 3 projects). Design:
`docs/superpowers/specs/2026-11-17-soft-skills-course-design.md` (read it: the practice engine, what it will and won't do). Syllabus:
`src/features/courses/content/catalog/syllabus-soft-skills.ts` (**lesson titles copied exactly, one lesson per topic, in order**).

**Subtitle:** Become a confident communicator, problem solver, and effective professional. Learners: developers, IT people, freelancers and VAs,
builders, teachers, career changers, fresh graduates. Their examples should span those jobs (a bug report to a manager, a late website for
a bakery client, a lesson plan changed the night before, a VA who made a booking mistake), not only software teams. Many are in the Philippines
and work with clients abroad, in English. Use names and places naturally and without stereotypes; no real or famous people or companies' private details.

You write ONE module (your number is in your instructions). **Read first, in this order:** `docs/content/WRITING_BRIEF.md` (the lesson contract, activity
rules, accuracy rules; its "DIRECTION" part about code does not apply to you, this course has no code), `docs/content/ADAPTATION_BRIEF.md` (the five learner levels and the
`audience` pieces every lesson carries), `src/features/courses/content/types.ts`, `lib/lesson-structure.ts`, `lib/standard-rules.ts`,
`src/features/activities/types.ts` and `lib/validate.ts` (note the new kinds `roleplay` and `message-review`, below), `src/features/practice/types.ts`, and **one finished module as a model of depth**:
`catalog/courses/object-oriented-programming/module-02.ts` (shape and craft only; your subject is people, not code).

## What you create (and nothing else)
1. `src/features/courses/content/catalog/courses/soft-skills-workplace/module-NN.ts` exporting `lessons: Lesson[]` and `project: Project | null` (project only in modules 5, 8, 10).
2. `src/features/practice/scenarios/module-NN.ts` exporting `items: PracticeItem[]` (replace the empty stub): the role-play scenarios and message tasks your lessons use.
Edit no other file. Do not run git. Scratch files go in your scratchpad. Write the file in pieces (header + lesson 1, then add lessons at a marker), each lesson complete before the next.
Lesson ids `soft-skills-workplace-NN` (NN = 2-digit day across the whole course; your module's first and last day are in the table below), `day` the same number.

| Module | Days | Project |
|---|---|---|
| 1 Communication | 1-6 | none |
| 2 Teamwork | 7-11 | none |
| 3 Critical thinking | 12-17 | none |
| 4 Time management | 18-22 | none |
| 5 Emotional intelligence | 23-27 | **P1 Professional Communication Challenge**, `unlockAfterDay: 27` |
| 6 Presentation | 28-32 | none |
| 7 Adaptability | 33-37 | none |
| 8 Professionalism | 38-42 | **P2 Workplace Simulation**, `unlockAfterDay: 42` |
| 9 Client management | 43-48 | none |
| 10 Career readiness | 49-54 | **P3 Career Readiness Portfolio**, `unlockAfterDay: 52` |

## Every lesson (checked by `catalog/soft-skills-module.test.ts`)
Run it as you go: `CHECK_SOFT_MODULE=<n> npx jest --no-watchman src/features/courses/content/catalog/soft-skills-module` (it also runs the standard rules on your lessons).
The `roleplay` and `message-review` activity kinds are being added to the validator by another agent while you write; if the check complains only that those kinds are unknown, carry on and re-run later.
- `intro` (2 to 4 verb-first objectives, one-to-two-sentence `why`), `summary`, `minutes` 12 to 30, `skills` (your module's skill id from `skills.ts`).
- `body` (about 500 to 900 words of explanation, not a list of definitions): opens with a **paragraph**, then these exact headings in this order:
  1. **A real situation**: a concrete, believable workplace moment that shows the skill failing or working (specific names, a few lines of what was said or written).
  2. **How it works**: the idea explained for a beginner, why before how, one honest analogy if it helps, then a method the learner can use tomorrow (steps, a checklist, a simple frame). No jargon without a definition. No pop-psychology claims you can't stand behind: if you cite a model or study, keep to what is well established and say plainly where it is a rule of thumb.
  3. **Weak and strong examples**: the same situation handled badly and well, as a `table` (weak / strong / why it works) or a `diagram`; the strong version must be one among several good ones, not "the" answer.
  4. Level pieces (`audience` on blocks, see the adaptation brief): a gentler walk-through for beginners (`{ max: 'beginner' }`) and a "in your real job" or harder variation for advanced learners.
  5. **Try it with AI**: a `prompt` block the learner copies into an AI assistant (their own situation in the brackets), written so that **the learner does the thinking first** (they draft, the AI critiques; or the AI plays a role and asks, and does not solve for them), plus one or two sentences on what to look for and what AI gets wrong here (it flatters, it is generic, it invents facts, it hides disagreement). The lesson also teaches the learner to **check** what the AI says rather than accept it.
  6. exactly one `takeaways` block (2 to 6 items), after "Try it with AI".
  Optional: `tip`, `warning`, `details`, `list`, and `visual` only if one exists that truly fits (none are required). **No `code` blocks.** No `version` notes unless you state a fact about a specific AI product (then dated `2026-11-17`, official source, no price figures).
- `activity` blocks (after the takeaways in the file; the app draws them after the quiz), **at least two kinds per lesson**: `scenario` (a decision with consequences: exactly one `best` option, one or two `acceptable`, `poor` ones that are tempting and explained), `match` (a *situation* to the skill or the better phrase, never a repeat of a printed list), `tap-reveal` (reflection cards: front a situation, back what to notice), `arrange` (put the steps of a method or the parts of a message in order; `language: 'text'`, no tests), `fill-blank` (`language: 'text'`, words of a message with a `bank`), `predict-output` is not for this course. Each has 3 progressive hints, an explanation, concept; ids `<lesson-id>-<kind>-<n>`. Tone: the explanation says why, it never shames.
- `roleplay` / `message-review` activities (`{ kind: 'roleplay', scenarioId, id, title, prompt, hints (2+), explanation, concept }`, `{ kind: 'message-review', taskId, ... }`): the AI practice. Your module must have **at least 3 of them across its lessons**, which of each kind is given below, and **every scenario or task you write in `practice/scenarios` is used by exactly one activity** (and every activity names one that exists). The activity's `prompt` sets the goal and the one thing to try; `hints` coach the approach (what to notice, a first move, a pitfall), **never a model answer or the AI's hidden rubric**; `explanation` is shown after the debrief and says what the skill looks like, not what to type.
- `quiz`: 3 to 5 scenario questions that test judgment ("What is the best next message?", "What went wrong in this reply?"), 3 or 4 choices, a varied correct slot, an `explanation`. Never trivia, never "all of the above", never a question the lesson did not teach.
- `task`: a short real-world thing to do (write, ask, observe, plan) with 2+ steps, 5 to 20 minutes, often the learner doing it in their own job or life, then reflecting.
- Honesty: **never present AI output as the learner's proof of skill**; say that scores in the app come from their own words; tell them when a technique is a rule of thumb. Stay practical and kind: no shaming, no hustle language, no claims about "what employers always want".

## Writing the practice items (`practice/scenarios/module-NN.ts`)
Read `src/features/practice/types.ts` closely. The server builds the AI's instructions from these, so write for **an AI that must play a person**:
- **RoleplayScenario**: `id` `<prefix>-<kebab>` (prefixes: comm, team, think, time, eq, speak, adapt, ethics, client, career; unique across the course), a `setting` the learner reads (2 to 4 sentences: where, who, what happened), a one-sentence `goal` (an outcome, not a script), a partner (first name, title, personality, **`private`**: what they want, fear or know that the learner doesn't; **`reactions.good` / `reactions.poor`**: how they respond when the learner listens, takes responsibility, proposes a concrete next step, vs when the learner is vague, defensive, jargon-heavy or overpromises), the partner's `opening` line, `minTurns` 3 to 5 and `maxTurns` 6 to 12, 3 to 6 `criteria` (only those that matter here), `strongSigns` (what strong looks like, 3 to 6) and `traps` (3 to 5), `difficulty`. The partner must be a **real person with a believable position**, not a villain and not a pushover; the conversation can end well or badly depending on the learner. Never put the ideal reply in any field. Use `speaking: true` only for scenarios meant to be answered aloud (introductions, pitches, interviews, Q&A).
- **MessageTask**: `situation`, `brief`, `channel`, `received` (the message being answered, when there is one, written as a real message with its own tone), `mustInclude` (2 to 6 short items: the facts and moves a complete message needs, e.g. "an apology that names the specific error", "a new date"), `targetWords` `{ min, max }`, 3 to 7 `criteria` from the seven message measures (clarity, tone, grammar, professionalism, completeness, empathy, actionability) plus any others that fit.
- Mix difficulty: at least one `gentle` and one `demanding` per module when it has 3 or more items. Make scenarios different from each other in role, setting and stance; the same cranky client three times is a failure.

## What your module must include (the AI work the owner asked for)
Required AI practice per module (kinds in brackets: R role-play, M message review). You may add more; you may not drop these.
1. **Communication** — M improve a professional email; M explain a technical subject to a non-technical reader; R coworker conversation; R client conversation (lesson 6 is the practice lesson: three or four items in it); lesson 4 teaches listening with a short R. Show clear writing with before/after.
2. **Teamwork** — R a team disagreement (partner a teammate who thinks you are wrong); R giving constructive feedback to a coworker (partner reacts to tone); organizing responsibilities (a `scenario` activity and a prompt: the learner splits a project, the AI critiques gaps and overload); R or M a remote collaboration moment (a stalled async thread, a handoff note: M is fine).
3. **Critical thinking** — realistic workplace problems and `scenario` activities that make the learner compare options and challenge assumptions; R a stakeholder who pushes back on the learner's recommendation; **lesson 5 teaches verifying AI**: show an AI recommendation with a plausible flaw (a wrong number, an invented source, a missing constraint, an overconfident claim) and have the learner find it (`scenario`, `tap-reveal`, `match`); the prompt block has the learner ask the AI for its assumptions and sources and then check them elsewhere. Lesson 6 is the practice lesson (a problem solved end to end, with an R).
4. **Time management** — the AI helps build and stress-test a realistic weekly schedule (the prompt is the lesson 5 centrepiece: the learner supplies hours and commitments, the AI exposes what doesn't fit); prioritising (`arrange`, `scenario`); breaking a project down; deadline management with an R (a manager adds work to a full week; the learner negotiates without a flat yes or no) and an M (decline or renegotiate in writing).
5. **Emotional intelligence** — R empathy (a frustrated customer or teammate, the learner has to hear the feeling before fixing); different perspectives (`match`, `scenario`); R a difficult conversation; professional ways to handle your own frustration (`scenario`, `tap-reveal`); R or M conflict and repair. **Project 1: Professional Communication Challenge** (below).
6. **Presentation** — R `speaking: true` for an introduction, R audience questions after a short pitch (`speaking: true`), M for a presentation outline or a status-update script reviewed for structure and clarity; lesson 5 teaches rehearsing out loud and what honest feedback is, and is explicit that the app reviews the *words* (structure, clarity, relevance, filler words in the text), not voice, pace or body language, and how the learner can get those from a person or a recording they review themselves.
7. **Adaptability** — R an unexpected change (the client or manager changes the plan late), R receiving criticism from a manager (partner is fair but blunt), M a response to criticism or a change, the learner writes an improvement plan (prompt with the AI as a critic of the plan's realism).
8. **Professionalism and ethics** — `scenario` activities on confidentiality, accountability, integrity (a friend asks for client information, a colleague cuts a corner); R owning a mistake (a manager or client discovers it); M a message that owns a mistake and says what changes; lesson 5, responsible use of AI-generated content (disclosure, accuracy, privacy of what you paste into a tool, copyright and attribution as principles; no legal advice). **Project 2: Workplace Simulation.**
9. **Client management** — R negotiation (scope or price) with a client, R complaint handling, R communicating a project delay, R a requirements change; M a professional project update; M a delay message; lesson 6 on negotiating fairly.
10. **Career readiness** — R recruiter screening call (`speaking: true`) and R interviewer (a behavioural interview, `speaking: true`); M a professional introduction or a résumé summary / portfolio project description reviewed for evidence over adjectives; the learner drafts a career development plan with the AI as a critic. **Project 3: Career Readiness Portfolio.** Point to the app's own Mock interview (tech roles), Résumé and Portfolio features by name where they fit instead of re-teaching them.

## Projects (modules 5, 8, 10)
`Project` shape in types.ts: `id` `soft-skills-workplace-p<n>` (n = 1, 2, 3), `title`, `summary`, `outcome`, `unlockAfterDay`, `steps` (6 to 10, ids `<project-id>-s<n>`, each a clear instruction; **steps that need AI practice name the exact scenario or task by its title and say "complete it in the lesson where it appears (lesson N)" or reuse the item**; include `audience` steps for beginners and advanced), `submission` (`kind: 'text'`: the learner pastes their own written work and a short reflection in their own words, with a `label`, `placeholder` and a `hint` saying what a good submission contains), `rubric` (3 to 6 criteria that read like what a reviewer checks) and `rubricExtra`. Never ask the learner to submit what an AI wrote for them as their own; the rubric rewards the learner's own judgment, specific choices and reflection ("what you changed after the coach's feedback and why").
- **P1 Professional Communication Challenge** (write professional emails, respond to difficult workplace messages, create project updates, practise professional communication): four pieces of real writing from the course's message tasks (and the learner's own situation), each revised once after the coach's review, plus a reflection.
- **P2 Workplace Simulation** (take part in simulated team discussions, resolve a disagreement, manage competing priorities, respond to a project delay, demonstrate accountability): a run of role-play sessions from modules 2 to 7 and 8, with a reflection on each decision and on one retry.
- **P3 Career Readiness Portfolio** (a professional introduction, practised interview questions, a career development plan, demonstration of professional communication): their introduction, an interview practice reflection, a one-page plan with specific next steps and dates, and a short cover message.
Each project's steps may **only name practice items that exist**; the engine summarises the learner's saved sessions for those items in the review.

## Language and rules
- **English only.** Write no Filipino or Tagalog (owner's standing rule); plain, warm, simple English that an ESL learner can follow. Short sentences. Define idioms.
- Never write dialogue or mascot lines for Tali or Tala.
- No invented statistics, studies or quotes. Name a framework only when you are sure it is real and describe it in your own words.
- Every example is believable and respectful; scenarios involving distress or conflict stay workplace-appropriate; no medical, legal or mental-health advice (point to a professional where a situation calls for one).
- Do not give a "right script". Show the principles and one or two good versions; tell the learner their own words matter.
- Report at the end: lessons written, activities by kind, practice items by kind, anything you were unsure about, the check output. Do not claim to have run the engine; you can't.
