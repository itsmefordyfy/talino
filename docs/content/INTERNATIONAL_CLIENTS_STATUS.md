# Finding International Clients: status (2026-11-17)

**State: written, registered, wired and passing its checks in code. Built on the Soft Skills practice engine; the engine was not changed. Never run against live Gemini, never played end to end on a device, not narrated.**
Design: `docs/superpowers/specs/2026-11-17-international-clients-course-design.md`. Writer brief: `docs/content/INTERNATIONAL_CLIENTS_BRIEF.md`.

## What exists
- Course `international-clients` (beginner, category careers, goal `freelance` only): **10 modules, 52 lessons (about 13 hours by the lessons' own `minutes`, 783 in all), 3 projects, 312 quiz questions**, 186 lesson activities
  (scenario 45, message-review 41, match 33, roleplay 27, arrange 15, tap-reveal 13, fill-blank 12). Modules: 1 International freelance market (5 lessons), 2 Niche and ideal clients (5), 3 Where to find clients (6),
  4 Portfolio (5), 5 Freelance profile (5, **P1**), 6 Finding and approaching clients (5, **P2**), 7 Proposals (5), 8 Communicating with clients (5), 9 Discovery, negotiation and closing (5), 10 First client and long term (6, **P3**).
  Projects: P1 Your International Freelancer Profile (opens after day 26), P2 International Client Acquisition Campaign (31), P3 Win Your First Freelance Contract (51). Each has 10 steps (with a newcomer step and an
  experienced step), 5 or 6 rubric criteria that are the labelled evaluation, `rubricExtra`, and lists its practice items in `practiceItemIds` (P1 7, P2 7, P3 11).
- Lesson shape (checked by `catalog/intl-clients-module.test.ts`): paragraph, "A real situation", "How it works", "Practical steps" (an ordered list), "Weak and strong examples" (a table), newcomer and experienced pieces
  (plus one short intermediate tip in the first lesson of each module so the five-level rule holds), **"AI in Action"** (a copyable prompt with the learner's facts in brackets, then "Why this prompt works", "How to make it better" and an
  illustration block that says it is not a real AI's output), takeaways, then activities, a 6-question quiz (4 shared, one for newcomers, one for advanced), a task and `taskExtra`. No code, no version blocks (the course states no platform fee,
  policy or price, so it is `volatile: false`).
- **Practice items: 68** in `practice/scenarios/clients/module-01..10.ts` (27 role-plays, 9 of them `speaking`; 41 message tasks), each used by exactly one activity. Every client, company, job post and prospect is fictional and labelled.
  Project 2 has 20 labelled fictional sample prospects (a collapsed block at the end of lesson 31) for learners who cannot research live.
- Files: `catalog/syllabus-international-clients.ts`, `catalog/courses/international-clients.ts` + `international-clients/module-01..10.ts` + `skills.ts`, `practice/scenarios/clients/`, `catalog/intl-clients-module.test.ts`
  (per module: `CHECK_INTL_MODULE=n`; whole course: `CHECK_COURSE=international-clients npx jest check-one`), `coach/lib/international-clients.ts` (+ test).
- Wiring: registered (`registered.json`, `courses.generated.ts`, `course-index.data.ts`, `build-catalog-index.mjs` knows the syllabus file), cover, world "The Open Market", path additions by id (`freelance-with-ai`, `professional-skills`), a **side,
  late-addition** journey milestone "Find international clients" (audience `freelance`; no existing id moved), What's New item `internationalClients`, store texts (`WHATS_NEW.md`, `DESCRIPTION.md`), `docs/content/OVERLAPS.md` entry 13,
  Tali's mode and chips (`lesson-intl`, `quiz-intl`, `activity-intl`, `project-intl`), Kokoro scripts exported (`scripts/audio/out/international-clients-lessons.txt`, 52 lessons, 454,170 characters, about 8.4 hours per voice).

## The brief's eight AI tools and the Prompt Playground: what each really is
| Brief | Built as | Live AI? |
|---|---|---|
| Client Finder Assistant | Module 3's research workflow (a tracker with a source for every fact), a research-note message task the coach reviews, Tali's questions | Coach review is live; **there is no job or company search** and none is faked |
| Niche Discovery Coach | Role-play: a mentor interview (`niche-mentor-interview`) scored on specificity and honesty | Live (practice route) |
| Profile Builder | Message tasks: Upwork headline and intro, LinkedIn About, OnlineJobs.ph-style profile, service offering | Live review with a suggested version beside the learner's own text |
| Proposal Assistant | Message tasks answering fictional job posts, a weak-proposal repair, a client-doubts role-play | Live |
| Cold Outreach Assistant | Message tasks on a fictional prospect profile with verified facts, a LinkedIn note, a follow-up, two prospect-reply role-plays | Live; **Talino sends nothing** (said in the lessons and Project 2) |
| Client Interview Simulator | Role-plays of discovery calls (`deal-discovery-*`, speaking) | Live |
| Negotiation Coach | Role-plays: budget, rate, objection, scope (`deal-*`), judged on communication and negotiation, never on winning | Live |
| Communication Coach | The message coach's seven measures on every writing task (module 8 is its home) | Live |
| Prompt Playground | Every lesson's "AI in Action" and Module 10 lesson 6's eight-prompt playbook (niche, market, ideal client, profile, proposal, cold email, discovery call, rate) | **Copyable, not live.** The Generative AI course's live `prompt-lab` kind was not built when this was written |

## Checked
`CHECK_INTL_MODULE=1..10` each pass; `CHECK_COURSE=international-clients` (standard rules, five levels, one lesson per topic) passes; `practice/catalog.test` is course-aware (Soft Skills and this course) and every one of the 68 items is used exactly once and
every project item resolves (checked with a temporary test, deleted); Tali's tests for this course pass (nothing private reaches her); `strings-parity`, world, cover and recommendation tests pass for this course's parts; `expo export --platform android` bundles.
**Seen** on the iPhone 18 Pro simulator after relaunching the dev client: the course page (cover, title, description), lesson 45's Learn stage (audio bar, level note, intro) and Project 2's screen. Content was grep-checked for guarantees, platform fees,
named laws, tax forms, payment providers and Filipino words (none stated; the percentages that appear are labelled made-up examples or claims the lesson teaches against).

## Not done, and why
- **Tagalog / Taglish: none written.** The owner's standing rule (no Filipino text; `TAGALOG_ENABLED` false; Kokoro has no Filipino voice) against the brief. Tali and Tala already answer in Taglish when the learner writes it.
- **Kokoro recordings not generated** (scripts exported only; run `scripts/audio/run-international-clients.sh` on the Mac, upload is the owner's). The phone's voice reads lessons until then.
- **No live Gemini call was made** (the owner's prepaid key): partner behaviour, debrief and review wording, and whether the models respect `private` and `reactions` are unseen. A smoke test of two or three sessions is the next step, with the owner's go-ahead.
  The hosted `/api/practice` must be deployed (same as Soft Skills).
- **Not seen:** a real role-play or review on screen, the quiz and Practice stages, a lesson's AI in Action, the intermediate tips, the journey milestone, the learning paths, iPad, Android emulator, web, VoiceOver, dark mode. No taps are possible in a simulator here.
- **Length:** the brief asked for 10 to 12 hours; the lessons' `minutes` add up to about 13, and the shared teaching runs 1,000 to 1,500 words a lesson against the brief's 450 to 800 (the checker has no upper limit). Trim lesson 16, 31 and 52 first if shorter is wanted.
- **The learner's skills, services and target market are not stored.** Tali learns them from what the learner says in the chat and from the project draft; no new profile store was built. Activity results reach her through the existing mechanism.
- Content was checked by the rules, read by its writers and spot-read, not reviewed by a person: every example is invented; no statistics or studies are cited; the course states no platform fee, policy, price, legal or tax rule. A subject-matter
  review (a working freelancer, and someone who knows contracts and tax in the Philippines) is advisable before release.
- Other sessions' work in the same tree fails some shared tests (the Generative AI and Productivity courses not yet registered or without a path, one unused Productivity practice item, Tagalog placeholder checks); none comes from this course.
