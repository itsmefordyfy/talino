# Finding International Clients: brief for module writers

**Course:** `international-clients`, "Finding International Clients: From Zero to Your First Global Client" (beginner, 52 lessons in 10 modules, 3 projects, about 11 hours).
Design: `docs/superpowers/specs/2026-11-17-international-clients-course-design.md` (read it). Syllabus: `src/features/courses/content/catalog/syllabus-international-clients.ts`
(**lesson titles copied exactly, one lesson per topic, in order**).

**Subtitle:** Learn how to find international opportunities, build trust with foreign clients, write winning proposals, conduct discovery calls and secure freelance projects.
**Learners:** freelancers and VAs, developers, designers, writers, support and admin professionals, career changers, fresh graduates, many in the Philippines who want clients in the United States,
the United Kingdom, Australia, Canada and elsewhere, and who work in English. Their services should span those jobs (a virtual assistant, a web developer, a graphic designer, a writer, a customer support
agent, a bookkeeper, a video editor, an AI automation builder), not only developers. Use names and places naturally and without stereotypes. No real or famous people, and no real company's private details.
Every client, company, job post and prospect in an example is **fictional**.

You write ONE module (your number is in your instructions). **Read first, in this order:** `docs/content/WRITING_BRIEF.md` (the lesson contract, activity rules, accuracy rules; its "DIRECTION" part
about code does not apply to you, this course has no code), `docs/content/ADAPTATION_BRIEF.md` (the five learner levels and the `audience` pieces), `docs/content/SOFT_SKILLS_BRIEF.md` (the sister course:
same engine, same activity rules, same lesson depth; **its structure differs from yours only where this brief says so**), `src/features/courses/content/types.ts`, `lib/lesson-structure.ts`,
`lib/standard-rules.ts`, `src/features/activities/types.ts` and `lib/validate.ts`, `src/features/practice/types.ts`, and **one finished module of the sister course as a model of depth and craft**:
`catalog/courses/soft-skills-workplace/module-09.ts` (client management) plus `src/features/practice/scenarios/module-09.ts` (how to write partners and tasks).

## What you create (and nothing else)
1. `src/features/courses/content/catalog/courses/international-clients/module-NN.ts` exporting `lessons: Lesson[]` and `project: Project | null` (project only in modules 5, 6 and 10). It currently holds a stub: replace it.
2. `src/features/practice/scenarios/clients/module-NN.ts` exporting `items: PracticeItem[]` (replace the stub): the role-play scenarios and message tasks your lessons use.
Edit no other file. Do not run git. Scratch files go in your scratchpad. Write the file in pieces (header + lesson 1, then add lessons at a marker), each lesson complete before the next.
Lesson ids `international-clients-NN` (NN = 2-digit day across the whole course), `day` the same number. Quiz ids `<lesson-id>-q<n>`. Activity ids `<lesson-id>-<kind>-<n>`.

| Module | Days | Project |
|---|---|---|
| 1 International freelance market | 1-5 | none |
| 2 Niche and ideal clients | 6-10 | none |
| 3 Where to find clients | 11-16 | none |
| 4 Portfolio | 17-21 | none |
| 5 Freelance profile | 22-26 | **P1 Your International Freelancer Profile**, `unlockAfterDay: 26` |
| 6 Finding and approaching clients | 27-31 | **P2 International Client Acquisition Campaign**, `unlockAfterDay: 31` |
| 7 Proposals | 32-36 | none |
| 8 Communicating with clients | 37-41 | none |
| 9 Discovery, negotiation, closing | 42-46 | none |
| 10 First client and long term | 47-52 | **P3 Win Your First Freelance Contract**, `unlockAfterDay: 51` |

Module skill ids (`catalog/courses/international-clients/skills.ts`), one per module in this order: market-research, niche-positioning, finding-clients, portfolio, profile, outreach, proposals,
client-communication, negotiation, client-delivery. A lesson's `skills` is its module's id.

## Every lesson (checked by `catalog/intl-clients-module.test.ts`)
Run it as you go: `CHECK_INTL_MODULE=<n> npx jest --no-watchman src/features/courses/content/catalog/intl-clients-module` (it also runs the standard rules on your lessons). Each lesson carries
the eight parts the owner asked for: **objectives** (the `intro`), **clear explanations**, **real-world examples**, **practical steps**, an **"AI in Action"** demonstration, a **guided exercise** (the activities and the task),
a **knowledge check** (the quiz) and a **summary**.
- `intro` (2 to 4 verb-first objectives, one-to-two-sentence `why`), `summary`, `minutes` **12 to 16** (about 11 hours in all), `skills` (your module's skill id).
- `body` (about 450 to 800 words of explanation, not a list of definitions): opens with a **paragraph**, then these exact headings in this order:
  1. **A real situation**: a concrete, believable moment (fictional names, a few lines of what was written or said) that shows the skill failing or working.
  2. **How it works**: the idea for a beginner, why before how, one honest analogy if it helps, no jargon without a definition.
  3. **Practical steps**: a `list` (ordered) the learner can follow tomorrow, each step concrete ("Write the one problem the client named in their own words"), then a sentence on the most common mistake.
  4. **Weak and strong examples**: the same moment handled badly and well as a `table` (weak / strong / why it works); the strong one is one good version among several, never "the" answer.
  5. Level pieces (`audience` on blocks, see the adaptation brief): a gentler walk-through for newcomers (`{ max: 'beginner' }`) and an "if you already freelance" harder variation (`{ min: 'advanced' }`).
  6. **AI in Action**: a `prompt` block the learner copies into an AI assistant (their own facts in [BRACKETS]) written so **the learner supplies the real facts and does the thinking first**, then, in this order,
     three `details` blocks: **"Why this prompt works"** (3 to 5 bullets in the body array: role, context, constraints, a request to ask questions or show assumptions, a format), **"How to make it better"**
     (3 to 5 concrete upgrades: add your real numbers, paste the real post, ask for two options, say what to avoid), and **"What a helpful answer can look like (an illustration, not a real AI's output)"** (a short
     answer we wrote, so the learner can see what to look for, which must itself be honest and generic enough not to pretend to be live). Then one or two sentences on what AI gets wrong here (it flatters,
     it invents facts and statistics, it writes in a generic voice, it cannot see live listings) and how to check it.
  7. exactly one `takeaways` block (3 to 6 items), after "AI in Action".
  Optional: `tip`, `warning`, `details`, `list`, `table`, `diagram` and `visual` only if one exists that truly fits. **No `code` blocks.** No `version` blocks (this course states no product facts; see Accuracy).
- `activity` blocks (after the takeaways; the app draws them after the quiz), **at least two kinds per lesson**: `scenario` (a decision with consequences: exactly one `best`, one or two `acceptable`, `poor` ones that are
  tempting and explained), `match` (a *situation* to the better move or phrase, never a repeat of a printed list), `tap-reveal` (reflection cards: front a situation, back what to notice), `arrange`
  (put the steps of a method or parts of a message in order; `language: 'text'`), `fill-blank` (`language: 'text'`, words of a message with a `bank`). Each has 3 progressive hints, an explanation, concept. The explanation says
  why and never shames.
- `roleplay` / `message-review` activities (`{ kind: 'roleplay', scenarioId, id, title, prompt, hints (2+), explanation, concept }`, `{ kind: 'message-review', taskId, ... }`): the AI practice. The required ones for your module
  are listed below; **every scenario or task you write in `practice/scenarios/clients` is used by exactly one activity** and every activity names one that exists (`practice/catalog.test.ts` checks this across both courses). The activity's `prompt`
  sets the goal and the one thing to try; `hints` coach the approach and **never hold a model answer or the AI's hidden rubric**; `explanation` is shown after the debrief and says what the skill looks like, not what to type.
- `quiz`: 3 to 5 judgment questions ("Which reply to this inquiry is strongest, and why?"), 3 or 4 choices, a varied correct slot (do not put the right answer in the same place every time and do not make it the longest), `explanation`.
  Never trivia, never "all of the above", never a question the lesson did not teach.
- `task`: a short real-world thing to do (research, write, check, plan) with 2+ steps, 10 to 25 minutes, using the learner's own situation, then reflecting. This is the **guided exercise**; make it concrete.

## Accuracy, honesty and safety (these are the hard rules of the course)
- **Never invent opportunities.** No real job listing, no claim that any real company is hiring, no claim about what a real client "will" pay or want. Examples are labelled fictional wherever the learner sees a job post, a
  prospect profile or a client. Teach the learner to **verify** what they find (the company's own site, a profile with a history, a real address) and to **write down the source and the date**.
- **Never fabricate qualifications, clients, experience, testimonials or results**, and never teach or hint at doing so. Every profile, portfolio, proposal and cold message in the course is built from what the learner
  actually did. When the learner has little, teach honest options (sample projects labelled as samples, volunteer or personal projects described as such, learning in public, a clear "what I can do now").
- **No guarantees.** Never say or imply the course or any tactic will win clients, a reply rate, an income, or a "right" rate. Say "this raises your chances" or "many freelancers find". No invented statistics, studies, surveys,
  quotes or "what clients always want". Market statements are about **how hiring commonly works**, as patterns that vary by client, and each says to check the learner's own research. Do not rank countries or stereotype
  people of any nationality; describe expectations as tendencies to **ask about**, never as rules.
- **Platforms change.** Describe how a kind of platform works (a marketplace, a job board, a professional network) and what to look for, **never a current fee, percentage, policy, limit, badge name or price**, and never
  say what a platform "allows" this year. Tell the learner to read the platform's own current help pages and terms before acting. (If a lesson truly needs a product fact, leave it out.) Named platforms are fine: Upwork, Fiverr,
  Freelancer.com, LinkedIn, OnlineJobs.ph, and the generic remote job boards.
- **Money, contracts, tax: general education only.** The course is not legal, tax or financial advice. Teach what a contract commonly contains and what to ask about; say plainly that laws and tax rules differ by country
  and by client, that a qualified professional answers those questions, and never state a specific legal or tax rule, rate, form or threshold. Point to the existing course **Freelancer & VA with AI** (lessons "Getting paid from abroad", "BIR registration and taxes, in general terms" and "Contracts and scope") instead of re-teaching them, and to **Freelancing with AI Development** for software scoping.
- **Outreach ethics:** only publicly listed business contact details; no scraping, no buying lists, no pretending to know someone, no fake urgency, no hidden "this is automated" copy; respect "no" and unsubscribe requests;
  say that anti-spam laws exist in many countries and the learner should read the ones that apply to them and to the recipient. Teach short, specific, respectful messages that make one clear, easy request.
- **AI honesty:** the AI cannot see live listings, verify a company or know what a client will pay, and it flatters and invents. Every "AI in Action" tells the learner what to **check themselves**. The course never presents AI
  output as the learner's own proof of skill, and the rubric of every project rewards the learner's own judgment. Scores in the app come from the learner's own words.
- **No tools that do not exist.** Never say or imply that the app sends messages, finds clients, scrapes sites or looks up companies. The AI practice here is a simulated person and a message coach.
- **English only.** Write no Filipino or Tagalog (owner's standing rule); plain, warm, simple English an ESL learner can follow. Short sentences. Define idioms. Never write dialogue or mascot lines for Tali or Tala.
- Respectful, kind, practical. No hustle language ("crush it", "6 figures", "passive income"), no shaming, no "just be confident".

## Writing the practice items (`practice/scenarios/clients/module-NN.ts`)
Read `src/features/practice/types.ts` closely. The server builds the AI's instructions from these, so write for **an AI that must play a person** or **review a piece of writing**:
- **RoleplayScenario**: `id` `<prefix>-<kebab>` with your module's prefix (below), unique across the whole app; a `setting` the learner reads (2 to 4 sentences: where, who, what happened; if it concerns a fictional
  listing or prospect, say it is fictional), a one-sentence `goal` (an outcome, not a script), a partner (first name only, title, personality, **`private`**: what they want, fear or know that the learner doesn't;
  **`reactions.good` / `reactions.poor`**: how they respond when the learner listens, asks, is specific, honest and proposes a clear next step, versus when the learner is vague, pushy, generic, defensive, jargon-heavy,
  overpromises or invents credentials), the partner's `opening` line, `minTurns` 3 to 5, `maxTurns` 6 to 12, 3 to 6 `criteria` (only from `PRACTICE_CRITERIA`: clarity, tone, grammar, professionalism, completeness, empathy, actionability,
  listening, accountability, problem-solving, structure, relevance, collaboration, adaptability, integrity, negotiation), `strongSigns` (3 to 6), `traps` (3 to 5), `difficulty` (`gentle` | `realistic` | `demanding`). The partner is a
  **real person with a believable position**, not a villain and not a pushover; the conversation can end well or badly depending on the learner. Never put an ideal reply in any field. `speaking: true` only for scenarios meant
  to be answered aloud (a discovery call, an introduction, a pitch). Partner roles are from `PARTNER_ROLES` (client, manager, coworker, team-leader, recruiter, interviewer, customer, stakeholder, audience); use `client` for clients and
  `stakeholder` or `coworker` for a mentor or a third party. A **scam-recognition** role-play is allowed (a fictional "employer" who pushes an upfront fee or an off-platform chat): the partner stays plausible and persistent; the
  learner's job is to notice, ask safe questions and decline or verify; the scenario never teaches how to run a scam.
- **MessageTask**: `situation` (2 to 4 sentences; says when a post, profile or company is fictional), `brief` (one sentence), `channel` (`email` | `chat` | `update` | `message`), `received` (the fictional job post, prospect profile,
  client message or listing the learner responds to, written like the real thing and long enough to reason about, 60 to 220 words), `mustInclude` (2 to 6 short items the answer needs, e.g. "one specific detail from the post", "a
  question that shows you read it", "a clear next step"), `targetWords` `{ min, max }`, 3 to 7 `criteria`. Tasks that review **the learner's own work** (a headline, an overview, a case study, a research note about a real
  prospect) say so, and `mustInclude` demands the learner's own real facts and sources, not invented ones.
- Mix difficulty: at least one `gentle` and one `demanding` in a module of 3 or more items. Make partners different from each other in role, setting, country, stance and service; the same impatient client three times is a failure.
  Vary the markets (US, UK, Australia, Canada, others) and the learner's services across the course.

## Required AI practice per module (R role-play, M message review; prefix in brackets). You may add more; you may not drop these.
1. **International freelance market** [`mkt`]: M a short market-research note about **one service in one market** that separates "what the AI said" from "what I checked and where"; R a gentle conversation with a small-business owner abroad who
   has never hired a freelancer from overseas and asks how it would work; R or M one more of your choice (a client's worry about time zones or payment). At least 3 items.
2. **Niche and ideal clients** [`niche`]: **the Niche Discovery Coach** = R a mentor interview (partner: an experienced freelancer, role `stakeholder`, who asks probing questions about the learner's skills and what they have *really*
   done, and pushes for evidence and a narrower focus; the debrief scores specificity and honesty); M a value proposition in two or three sentences; R a prospect who asks "why should I pick you over other freelancers?". At least 3.
3. **Where to find clients** [`find`]: **the Client Research Workflow** = M a research note on one *fictional* company profile (what is verified, what is assumed, where it would be checked, whether it fits); M an evaluation of a *fictional*
   job listing (fit, budget, red flags, decision); R a scam-recognition conversation (gentle to realistic). At least 3, and lesson 4 (the workflow) teaches a simple tracker the learner builds in a spreadsheet.
4. **Portfolio** [`port`]: M a case study (the learner's own real or clearly labelled sample project) scored on business value and honesty; M a portfolio project description; R a client who asks the learner to walk through a project and
   asks hard but fair questions (including "did you do all of this yourself?"). At least 3.
5. **Freelance profile** [`prof`]: **the Profile Builder** = M a headline plus introduction for Upwork; M a LinkedIn "About" section; M an OnlineJobs.ph-style profile text; R a client who asks about gaps (no reviews yet, no formal
   experience) and for references. At least 4. **Project 1** (below).
6. **Finding and approaching clients** [`reach`]: **the Cold Outreach Assistant** = M a cold email to a *fictional* prospect profile (`received` holds the profile, which includes the verified facts); M a LinkedIn connection note or short
   message; M a follow-up; R a prospect who replies "not interested, how did you get my address?"; R a prospect who replies with a real question. At least 4. **Project 2** (below).
7. **Proposals** [`prop`]: **the Proposal Assistant** = M a proposal answering a *fictional* job post (`received`) for two different services (two tasks, different posts); M fix-and-improve a *weak* proposal the learner wrote first (or write
   the questions you would ask the client before proposing); R a client who replies to your proposal with doubts. At least 3.
8. **Communicating with international clients** [`talk`]: M a polite, clear message that changes a plan or sets a time-zone boundary; R explaining a technical idea to a non-technical client (use the learner's own kind of service); M a project
   update; R a difficult conversation (a delay or a mistake); M the message that follows it. At least 4. This module is the **Communication Coach**: each M task's `criteria` include clarity, tone, grammar and professionalism.
9. **Discovery, negotiation, closing** [`deal`]: **the Client Interview Simulator and Negotiation Coach**: R a discovery call (`speaking: true`, a client with a vague need and a hidden budget limit); R a second discovery call (a different market and
   service, `demanding`); R presenting the service and discussing budget; R a negotiation (budget below the learner's range: the learner can negotiate scope or price without a flat yes or no); R an objection ("I can get this cheaper"); R scope
   agreement (the client keeps adding "small" extras); M a follow-up summary after a call. At least 6. Rates, deadlines, deliverables and scope must all come up across them. The debrief evaluates communication and negotiation, never "winning".
10. **First client and long term** [`win`]: M a scope-and-terms email that restates what was agreed (educational, not a contract); M a welcome and onboarding message; M an invoice cover message and a polite payment reminder (two tasks);
    R a client who pays late or disputes an invoice; R an onboarding kickoff call. At least 5. Lesson 6 (**Your Client-Winning Prompt Playbook**) is the **Prompt Playground**: see below.

## Module-specific content
- **Module 1** lesson 5 teaches AI market research honestly: ask for patterns, assumptions and what to check, then verify on the open web yourself; the AI cannot see live listings. Lesson 2 (four markets) is about **how hiring commonly works**
  and what clients tend to ask about (communication, time overlap, payment, contracts, quality), not stereotypes or rankings. Lesson 3 compares freelancing, contracting and remote employment in plain words (who sets hours, who owns the tools,
  who pays for gaps, how long it lasts) with the legal/tax caveat.
- **Module 2** lesson 3 teaches choosing a niche as a **testable guess** and gives a niche-statement frame; lesson 5 builds a value proposition from the learner's own evidence and compares positioning against a competitor's *profile in general*
  (never a named person).
- **Module 3** lesson 4 is the **Client Finder / research workflow**: a spreadsheet with columns (name, link, source, date checked, what is verified, fit, decision-maker, next step, status) and a rule that nothing goes in without a source.
  The lessons on marketplaces and boards describe how they work in general; lesson 5 evaluates listings (specific vs vague scope, budget realism, client history, red flags); lesson 6 is scams (fees to apply, off-platform quick moves, "too good",
  fake cheques or equipment, requests for sensitive data, identity checks), with what to do and what to report.
- **Module 4** lesson 4 is honest "no clients yet" options; lesson 5 covers a simple portfolio website (what pages, what to show, how to say what is a sample); point to Talino's own **Portfolio** and **Résumé** features by name where they fit.
- **Module 5** teaches profile writing for three kinds of place (a marketplace profile, a professional network, a local-market job board) as principles; never reproduce a platform's current UI or limits. **Project 1.**
- **Module 6** lesson 3 (decision-makers) uses only public sources (a company's own team page, a public profile) and says to stop when none is public. **Project 2.**
- **Module 7**: a proposal is **an answer to one client's problem**, not a template; teach structure (the client's problem in their words, your understanding, a small first step, relevant proof, a clear next step), deliverables, timeline and a price
  *range logic* (how to think about it, never a number to charge).
- **Module 8** is the Communication Coach module (clarity, tone, grammar, completeness); lesson 2 covers etiquette and **time zones** as logistics to agree on (overlap hours, response windows, holidays in both countries), not cultural verdicts.
- **Module 9**: discovery questions, budget conversations without ambushing, negotiation as **problem-solving over scope, timeline and price together**, objections as questions, a scope the learner can actually deliver, closing with a written next step.
- **Module 10** (educational only): what a contract commonly covers (scope, deliverables, timeline, payment terms, revisions, ownership, confidentiality, termination), milestones, invoicing basics, how international payment tends to work (general, with fees and
  currency conversion as things to **ask about and compare**), onboarding checklists, delivery and testimonials asked for honestly, referrals and long-term work. Lesson 6 is the **Prompt Playbook** (below).

## Lesson 6 of Module 10: Your Client-Winning Prompt Playbook (the Prompt Playground)
Eight copyable, editable prompts, one `prompt` block each with the learner's facts in [BRACKETS], each followed by `details` "Why this prompt works" and "How to improve it" and an illustration `details`: (1) finding a freelance niche from your real skills,
(2) researching an international market and what to verify, (3) describing an ideal client, (4) improving a freelancer profile (the learner pastes their own draft), (5) writing a proposal (the learner pastes the real post), (6) a personalized cold email from
facts the learner verified, (7) preparing for a discovery call, (8) preparing to negotiate a rate. Teach the pattern that makes them work (role, context, real facts, constraints, ask for questions and assumptions, a format, then verify) and how to improve a prompt
after a poor answer. The lesson still has the standard parts (situation, how it works, practical steps, examples table, AI in Action with a ninth prompt for "improve any prompt", takeaways). It also names where each prompt belongs in the course. Required AI
practice: M one prompt the learner wrote themselves, reviewed for specificity and honesty; one more item of your choice.

## Projects (modules 5, 6, 10)
`Project` shape in `types.ts`: `id` `international-clients-p<n>`, `title`, `summary`, `outcome`, `unlockAfterDay`, `steps` (6 to 10, ids `<project-id>-s<n>`, clear instructions; steps that need AI practice name the exact scenario or task by its title and say where it
appears, "complete it in the lesson where it appears (lesson N)", and the project lists those item ids in `practiceItemIds`; include `audience` steps for newcomers and for experienced freelancers), `submission` (`kind: 'text'`: the learner pastes their own work and a short
reflection in their own words, with a `label`, `placeholder` and a `hint` saying what a good submission contains), `rubric` (3 to 6 criteria that read like what a reviewer checks) and `rubricExtra` (what is asked of experienced learners).
Never ask for AI-written text as the learner's own; the rubric rewards the learner's own judgment, specificity, honesty and "what I changed after the coach's feedback and why". **Every project includes a labelled evaluation: the rubric criteria are the evaluation criteria,
written so the review can give constructive feedback on each.**
- **P1 Your International Freelancer Profile** (module 5): professional headline, freelancer introduction, one service offering, ideal client profile, portfolio presentation, unique value proposition, then a short reflection on what is honest and what is still missing.
- **P2 International Client Acquisition Campaign** (module 6): choose a target market and service; **research 20 potential clients** (the learner researches real businesses on the open web and records for each: name, link, what they do, one fact they
  verified, the source and the date, why they might need the service, the likely decision-maker if publicly listed; **if the learner cannot research live, they use the course's labelled fictional sample prospects and say so at the top**: never invented real companies), choose
  and rank the best 5, write personalized outreach for three of them (each reviewed by the coach), and a follow-up schedule (dates and what each follow-up adds). The submission is the table (as text), the three messages, the schedule and a reflection. Tell the learner
  plainly that the app does not send anything: they send messages themselves, only if they choose, following the outreach ethics.
- **P3 Win Your First Freelance Contract** (module 10): a realistic simulation, **with fictional parties**, covering: receiving a client inquiry (reply), understanding requirements (questions), preparing a proposal, conducting a discovery call, negotiating rate and scope,
  preparing a project agreement summary, completing client onboarding. Use the module-7, 9 and 10 items. The submission includes the learner's written pieces, what they would do differently after each simulated conversation, and one retry they made. Provide
  evaluation criteria in the rubric and make clear a high score is never required.

## Report at the end
Lessons written, activities by kind, practice items by kind (and which required item each satisfies), the check output, anything you were unsure about. Do not claim to have run the engine; you cannot.
