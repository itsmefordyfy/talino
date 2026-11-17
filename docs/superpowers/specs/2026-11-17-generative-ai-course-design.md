# Generative AI: From Fundamentals to Real-World Applications: design (2026-11-17)

Owner's brief (pasted 2026-11-17): a complete Beginner-to-Intermediate course, 12 modules, four guided projects, a Prompt Playground, Model
Comparison, an AI Experiment Lab, an AI Workflow Builder, context-aware Tali/Tala, real assessments, responsible-AI guidance, Kokoro narration
(never Gemini TTS), "make routine implementation decisions independently". The owner opted out of questions, so this records the decisions.

## Intent and the why
Talino already has the developer ladder (LLMs Explained, Generative AI for Developers, RAG, Agents, Evaluation…). It has nothing for the
much larger audience that *uses* generative AI: students, freelancers, VAs, educators, entrepreneurs, professionals. This course teaches how it
works well enough to judge it, then has the learner **do** things with it: prompt, compare, evaluate, build a workflow, build a small feature.

## Goals, non-goals, anti-goals
- Goals: one catalog course (12 modules, 67 lessons, 4 projects) with every lesson built from the ten parts the brief names; four interactive
  learning features that actually work; honest labelling of what is live and what is an illustration; real saved results.
- Non-goals: a new app section (everything sits inside lessons, projects and the Concept Lab), a second AI service, a new TTS vendor, live image,
  video or audio generation (cost, and no key the owner has agreed to spend), benchmark tables, a Tagalog edition.
- Anti-goals: a made-up model output shown as real; fabricated benchmark numbers; a lesson that is a tutorial for one product's buttons; AI-written
  work counted as the learner's skill; secrets or private data sent to a model.

## Decisions (mine, recorded; the owner can overrule any)
1. **English only.** The owner's standing rule (no Filipino text, `TAGALOG_ENABLED` false, Kokoro has no Filipino voice) overrides the brief's "Tagalog/Taglish
   where appropriate"; Tali/Tala *instructions* still tell the coach to answer in Taglish when the learner writes it (that is behaviour, not authored text,
   and the coach already does so). Reported as not done.
2. **Course id `generative-ai-applications`, level `beginner`** (the catalog has three levels; "beginner to intermediate" lands at the entry level, the learner
   journey places it), category: a new `artificial-intelligence` category if the discovery code handles one generically, else `ai-coding-fundamentals`.
3. **Live AI = the practice engine, extended, not duplicated.** The Prompt Playground, the Experiment Lab and Model Comparison are one new activity kind,
   `prompt-lab`, whose task (`LabTask`) is plain data in `practice/labs/` that the **server reads by id** (same rule as role-plays: the phone never sends
   instructions, private fields never leave the server). Two new modes on `/api/practice`: `lab-run` and `lab-review`. Sessions reuse `practice_sessions` /
   `practice_messages` (`kind` is free text), so **no migration**. Allowance is the existing `talinopractice` count (a lab session counts once; its further
   runs up to `maxRuns` and its review are free). Uses the owner's Gemini key like the interview and the practice engine: **flagged**.
4. **Honest labelling, in the UI and the data.** *Live* = a real model call made now (badge "Live model"), and its text is whatever the model said. *Illustration* =
   a hand-written example (badge "Illustration, not a real model's output"): the `demo` lesson block ("AI in Action"), the lab's `example`, the workflow
   builder's simulated run. Image, video and audio generation are **illustrations and guided external practice** only. Model Comparison compares *capabilities in words*
   (the existing dated `toolComparison` block from `ai-dev/tools.ts`, checked against official pages) and, live, two prompts or two model tiers **measured on this
   task right now** (latency and token counts come from the API response; nothing is called a benchmark).
5. **Workflow Builder** = new activity kind `workflow-builder`, local and deterministic (no model call): the learner builds Input → AI → Tool/Action → Human
   review → Output from a palette with rules (a risky send must follow a human review, a secret never goes to a prompt…), then watches a labelled simulated run.
6. **AI in Action** = a new lesson block `demo` (title, prompt, output, what to notice), always drawn with the Illustration badge.
7. **Tools by use case, not by button.** Lessons teach concepts and point to the official pages; version-sensitive statements use the existing `version` block (date,
   official sources, no prices). Tools named: ChatGPT, Gemini, Claude, Hugging Face, Midjourney, Runway and others, only for what each is for; learners are taught to check
   capabilities themselves (lesson 1.3, 12.3). Image and video platforms the owner named are described from their official pages by the writers' `version` notes, or not at all.
8. **Tali/Tala** know the course, module, lesson, objectives, the current activity, the project instructions and the lab/workflow in front of the learner (public fields only),
   the learner's past results (the existing quiz/activity mistakes the coach already receives), and teach by hint, never by the finished answer; they explain why an AI answer
   may be wrong. `coach/lib/gen-ai.ts`.
9. **Persistence** reuses what exists: activity progress, quiz results, project submissions, certificate/XP, practice sessions (runs and reviews). No new tables.
10. **Kokoro** narration scripts exported for all lessons (`scripts/audio`), recordings not generated here (Mac job, upload is the owner's), the phone's own voice
    until then. No TTS code changed.
11. **Projects** are `text` submissions reviewed by the existing project review; each step names the lab or workflow in the lessons it builds on, and the review gets the
    learner's saved lab results as a labelled block, like Soft Skills' practice block.

## Curriculum (12 modules, 67 lessons)
See `catalog/syllabus-genai.ts` (lesson titles are the contract). Projects: P1 AI Content Creation Studio (after Module 5, day 31), P2 AI Knowledge Assistant (after
Module 7, day 42), P3 AI Business Automation (after Module 9, day 54), P4 AI-Powered Application (after Module 10, day 60; capstone in Module 12 revisits it).

## Interactive features, mapped to the brief
| Brief | Built as |
|---|---|
| Prompt Playground (editable prompts, copy, examples, improvement suggestions, expected output example, comparison, criteria) | `prompt-lab`, `experiment: 'playground'` (Copy on the editor, Tips after the first run, Example (illustration), A/B compare, criteria list) |
| Model Comparison | `prompt-lab` with `compare: 'models'` (live, measured, two tiers of the one provider) + dated `toolComparison` blocks + comparison tables written as guidance |
| AI Experiment Lab (text generation, summarization, classification, document analysis, structured output, tool use; image generation) | `prompt-lab` with the six live experiments; image generation as guided illustration activities and the image-prompt builder visual |
| AI Workflow Builder | `workflow-builder` activity |
| Context-aware Tali/Tala | `coach/lib/gen-ai.ts` |
| Concept visuals | new visuals: context window, prompt anatomy, image-prompt builder, agent loop (existing: tokens, embeddings, RAG, neural net, model I/O, workflow, AI app) |

## Constraints
No existing id, progress or journey place changes (the course is new, its journey milestone is a side, late addition). Private lab fields (`system`, `key`, `facts`, tool
fixtures' hidden answers) never reach the phone (tests assert it). Everything a model returns is untrusted: validated, size-limited, never executed. No live Gemini call is made
in this work; the route is tested with a fake Gemini only.

## Verification
Jest for every pure part and the route; the per-module and whole-course checks (`CHECK_GENAI_MODULE=n`, `CHECK_COURSE=generative-ai-applications`); tsc, eslint, an Android
export; screens seen on the iPhone and iPad simulators where taps are not needed. Everything not seen or not run live is listed in `docs/content/GENAI_STATUS.md`.
