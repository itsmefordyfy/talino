# Finding International Clients: design (2026-11-17)

Owner's brief (pasted 2026-11-17): a complete, practical, AI-integrated beginner course, "Finding International Clients: From Zero to Your First Global Client", for Filipino freelancers seeking
clients in the US, UK, Australia, Canada and elsewhere; 10 modules, 3 projects, eight AI learning tools, a Prompt Playground, Tali/Tala integration, English and Tagalog/Taglish, Kokoro narration,
iPhone, iPad, Android and web. "Make routine implementation decisions independently without asking for approval." The owner opted out of questions, so this records the decisions.

## Intent and the why
Talino already teaches the freelance basics (Freelancer & VA with AI: market, niche, offers, tools, pricing, proposals, scams, calls, contracts, delivery, getting paid) and software freelancing (Freelancing with AI
Development). What a learner still lacks is **a campaign that ends in a first client abroad**, practised: research real prospects, build proof and a profile that are honest, write outreach and proposals that fit one person,
talk to a simulated client about need, budget and scope, and set up the work. This course is that, built on the practice engine the Soft Skills course introduced (role-play with a simulated person, a message coach), **not** a
second engine.

## Goals, non-goals, anti-goals
- Goals: one catalog course (10 modules, 52 lessons, 3 projects, about 11 hours) whose every lesson carries objectives, explanation, real-world examples, practical steps, an "AI in Action" demonstration, a guided exercise, a
  knowledge check and a summary; eight AI tools that really run; a Prompt Playground; Tali/Tala that coach the learner's own campaign; reuse across paths by id.
- Non-goals: web search, job-board scraping, company look-ups or sending messages (no integration exists, and none is faked); a CRM; analysing voice; a new TTS vendor; a Tagalog edition (owner's standing rule); legal, tax or financial advice.
- Anti-goals: a made-up job, client or result presented as real; an AI that writes the learner's profile or pitch for them to submit as their own; promising clients or income; stating a platform's current fees or rules; stereotyping
  clients or learners by nationality.

## Decisions (mine, recorded; the owner can overrule any)
1. **English only.** The owner's standing rule (no Filipino text, `TAGALOG_ENABLED` false, Kokoro has no Filipino voice) overrides the brief's "natural Tagalog/Taglish". Tali and Tala already answer in Taglish when the learner writes it
   (behaviour, not authored text), so the tutor part of the brief holds. Reported as not done.
2. **Course id `international-clients`, level `beginner`, category `careers`, goal `freelance` only** (so it never becomes the starting course for another goal). Positioned beside **Freelancer & VA with AI** (the broad toolkit) and
   **Freelancing with AI Development** (software scoping): this course owns international client acquisition and points to those for pricing models, taxes and software scope (`docs/content/OVERLAPS.md`). It carries **no `version` blocks and states no
   platform fee, policy or price**, so it is `volatile: false` and does not go stale; lessons teach how a kind of platform works and send the learner to its own current pages.
3. **The eight AI tools are the existing engine, used for their strengths, plus the Prompt Playground. Nothing is simulated as live.**

   | Brief's tool | Built as |
   |---|---|
   | Client Finder Assistant | Module 3's research workflow (a tracker with a source for every fact), a research-note message task the coach reviews, Tali's questions; **no live search** |
   | Niche Discovery Coach | Role-play: a mentor interview that pushes for evidence and focus, scored on specificity and honesty |
   | Profile Builder | Message tasks per place (marketplace, professional network, local job board), each with a suggested improved version beside the learner's own text |
   | Proposal Assistant | Message tasks that answer a *fictional* job post, plus a weak-proposal repair and a client-doubts role-play |
   | Cold Outreach Assistant | Message tasks answering a fictional prospect profile with verified facts, follow-ups, and role-plays of replies |
   | Client Interview Simulator | Role-plays of discovery calls (two speaking, words judged only) |
   | Negotiation Coach | Role-plays about budget, rate, objections and scope, judged on communication and negotiation, never on winning |
   | Communication Coach | The message coach's seven measures on every writing task (module 8 is its home) |
   | Prompt Playground | Every lesson's "AI in Action" (copyable prompt with the learner's facts in brackets, "Why this prompt works", "How to make it better", a labelled illustration) and Module 10's eight-prompt playbook |

   The Playground is **copyable, not live** here: the Generative AI course is building a live `prompt-lab`; when it lands, these prompts can be turned into labs without changing the lessons.
4. **Honesty is structural.** Fictional job posts, prospects and clients are labelled; the learner records a source and a date for every fact about a prospect; Project 2 uses real researched prospects, or
   labelled fictional samples when the learner cannot research live; the course says plainly that the app sends nothing. Scores in the app come from the learner's own words and completion never needs a high score.
5. **Reuse, not duplication:** one course record; learning paths and the journey reference it by id (`freelance-with-ai`, `professional-skills`, and a side journey milestone); practice items live in `practice/scenarios/clients` and join the one catalog;
   `catalog.test` now checks every role-play and message task against **both** engine courses.
6. **Tali / Tala** (`coach/lib/international-clients.ts`): know the course, module, lesson, objectives, the current activity or project (public fields only) and the learner's saved practice results (the existing mechanism); coach the approach with questions, one hint at a
   time; **never invent the learner's experience, clients or results, never write their proposal or message, never promise clients**, ask for the learner's real skills, services and target market and use what they say; say the AI cannot see live listings; answer in
   Taglish if the learner writes in it.
7. **Persistence** reuses what exists (activity progress, quiz results, project submissions and review, practice sessions, certificate and XP). No migration.
8. **Projects** are `text` submissions reviewed by the existing project review, with the learner's practice results as a labelled block; the rubric is the evaluation criteria.
9. **Kokoro** narration scripts exported for all lessons; recordings are a Mac job and the upload is the owner's; the phone's voice reads lessons until then. No TTS code changed, Gemini TTS not used.

## Curriculum
`catalog/syllabus-international-clients.ts` (lesson titles are the contract). Projects: P1 Your International Freelancer Profile (module 5, opens after day 26), P2 International Client Acquisition Campaign (module 6, day 31), P3 Win Your First Freelance Contract
(module 10, day 51). Writer brief: `docs/content/INTERNATIONAL_CLIENTS_BRIEF.md`.

## Wiring
Registered course (`registered.json`, `courses.generated.ts`, `course-index.data.ts` regenerated), cover, world "The Open Market", path additions by id, side late-addition journey milestone, What's New and store text, Tali's mode, `CLAUDE.md`, `docs/content/INTERNATIONAL_CLIENTS_STATUS.md`.

## Tests and verification
Per-module check (`CHECK_INTL_MODULE=n`), whole-course check (`CHECK_COURSE=international-clients npx jest check-one`), `catalog.test` and `practice/catalog.test` across both engine courses, the Tali unit tests, tsc, lint, an Android bundle export and the learner path seen on the
simulators the machine can run. A live Gemini run needs the owner's go-ahead and is not part of this change.
