# AI Automation for Business and Everyday Work: design (2026-11-18)

Owner's brief (pasted 2026-11-18): build the complete course "AI Automation for Business and Everyday Work" inside Talino: 11 modules, every lesson fully written, practical
exercises, guided automation projects, a 25-question final assessment, a final practical project, diagrams, and the whole thing integrated, tested and reported. The brief asks
for no questions, so this records the decisions. The owner can overrule any of them.

## Intent
Talino already teaches what AI is (AI Fundamentals for Everyone), how models behave (How Large Language Models Work), prompting in depth (Generative AI), and a five-lesson
no-code automation mini-course (AI Automation with No-Code Tools). What a learner still lacks is **a practical course in taking real repetitive work off their plate**: spot the work,
choose rules or AI for each step, build a trigger → AI step → human approval → action workflow for email, meetings, documents, spreadsheets, marketing, sales, support and a small
business, understand AI agents without code, and do all of it safely. Progression: AI Fundamentals for Everyone → How LLMs Work → **this** → (a future advanced agent-development course).

## Non-goals and anti-goals
- Not a programming course: no code to write. (`code` blocks are allowed only for sample data the learner reads or pastes: an email, a form payload, a CSV, a JSON answer.)
- No live integration with Zapier, Make, n8n, Google Workspace or Microsoft 365 from inside Talino, and none is faked. Hands-on work in the app is **rule-checked workflow
  building** (the existing `workflow-builder` activity, labelled "Simulated run, not a real model") and **designing on paper**; the learner can follow along in a real platform they
  can reach, but the course never depends on one.
- No product price, plan limit, feature list, button tour or "this is free" claim. The brief says to avoid claiming a feature is free without verifying; the course therefore teaches how
  such platforms are *usually priced* (free tiers or trials, usage-based, per-task or per-run) in general words, how to estimate runs before building, and sends the learner to each tool's
  own pricing page. `volatile: false`, no `version` blocks.
- No made-up client, result or income promise. Every example business, customer and number is fictional and labelled; ROI figures are the learner's own or labelled examples.
- No AI output presented as real: every "AI in Action" block is a hand-written illustration and says so.

## Decisions (mine)
1. **Course id `ai-automation-business`, level `beginner`, category `careers`, goals `get-job` and `freelance`** (never the starting course for another goal). The brief's "Beginner to
   Intermediate" is one `level` in the catalog; the five learner levels are served inside each lesson (`audience` pieces). Prerequisites (advice only): `ai-fundamentals-everyone`, `how-llms-work`.
2. **83 lessons in 11 modules** (the brief's 77 teaching lessons in modules 1 to 10, then six in module 11). The module-course cap (`MODULE_COURSE_MAX_LESSONS`) is raised from 80 to 90 to
   fit them; no other course is affected. Module 11 is five assessment lessons (one per part of the course, five questions each = **25 questions**) and the final project lesson.
3. **The final assessment is 25 questions, five per part, as five lessons**, because Talino's lesson rule is 3 to 5 quiz questions per lesson. Each part's recap teaches before it asks
   (the 250-word rule). Talino adapts every lesson to the learner's level, so each part authors **nine** questions: 3 shared by everyone, plus 2 matched to newcomers, 2 to intermediate
   and 2 to advanced learners, on the same topics. **Every learner answers exactly five per part, 25 in all.** The questions are multiple choice, four choices, one correct answer, each
   with an explanation, and together cover every module.
4. **Length: about 14 hours, not the brief's 5 to 7.** A standard lesson must be at least 10 minutes (`standard-rules.ts`), so 83 lessons cannot total 5 to 7 hours. Lessons are kept lean
   (about 450 to 700 words of shared teaching, 10 to 14 minutes, the assessment parts 10 to 15, the project lesson up to 30) and the course says "about 14 hours" through its computed
   duration; the shortfall against the brief is reported, not hidden. A learner can stop after any module and keep a working skill.
5. **Hands-on learning:** every module teaches by a worked example with sample input, sample AI prompt and expected output; lessons carry `workflow-builder` activities (the learner
   assembles input → AI → tool → human approval → output, with tempting wrong steps and rules that explain why), plus scenario, match, arrange, fill-blank and tap-reveal activities.
   Seven **projects** (modules 3, 4, 5, 6, 8, 9 and 11) are text submissions the coach reviews against a rubric; the learner documents a workflow design and, when they can reach a platform, the real build.
6. **Visuals:** `diagram` blocks (Mermaid flowcharts, sequence diagrams) for traditional vs AI automation, workflow architecture, trigger-action-condition, email automation, document
   processing, customer support, agent architecture, human-in-the-loop and a business automation system; existing visuals (`ai-agent-loop`, `ai-context-window`, `ai-prompt-anatomy`) where they fit.
   No new component was built.
7. **No practice-engine role-plays or message tasks.** They need server-side catalog items and a redeployed hosted route; this course does not need them and so adds no server dependency.
   Tali (the coach) does the project reviews (`coach/lib/ai-automation.ts`).
8. **English only** (standing rule: no Filipino text). Philippine and international examples: a sari-sari store, an online seller, a coffee shop in Naga City, a clinic, a tutoring centre,
   a BPO team and a virtual assistant with clients in the US, UK and Australia, a small UK consultancy, a US online shop.
9. **One running example in Module 8**, used again in Module 6, 9 and the final project guidance: "Pili & Pine Candles", a fictional online candle shop in Naga City, and its customer-inquiry workflow
   (form → AI category, urgency and suggested reply → saved for review → a person approves → reply sent → row in a sheet). Writers share its field names (see the brief).
10. **Kokoro narration** scripts are exported for the lessons (recordings are a Mac job, the upload is the owner's); the phone's voice reads them meanwhile. No TTS code changed.

## Curriculum
`catalog/syllabus-ai-automation.ts` (lesson titles are the contract; all 77 titles are the owner's, the six in module 11 are mine). Projects: P1 Personal Productivity Automations (after day 22),
P2 Document and Report Automations (29), P3 Marketing and Sales Workflow (37), P4 Customer Support Workflow (45), P5 Automated Customer Inquiry Workflow (61), P6 Small-Business Automation System
(69), P7 Final Project: An AI-Powered Business Workflow (83). Writer brief: `docs/content/AI_AUTOMATION_BRIEF.md`.

## Wiring
Registered course (`registered.json`, `courses.generated.ts`, `course-index.data.ts` regenerated), cover, world, learning-path additions by id, a side late-addition journey milestone, What's New,
Tali's mode, `CLAUDE.md`, `docs/content/AI_AUTOMATION_STATUS.md`.

## Tests and verification
Per-module check (`CHECK_AUTO_MODULE=n`), whole-course check, `catalog.test`, the activity validator over every workflow-builder (its reference solution must pass its own rules), tsc, lint,
and a bundle export. No live Gemini call is made and no screen is seen unless the simulator is available; the status file says exactly what was and was not run.
