import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * AI-Assisted Project Planning. One worked example runs through every lesson: an online booking page for a small, made-up family clinic
 * (Maliwanag Family Clinic). Every planning artefact in the lessons (idea card, scope statement, user flows, feature list, milestone plan,
 * risk register, estimate table, prompt pack) is written for this course and is copyable. The hours in the estimate table are invented for
 * illustration and say so; they are not benchmarks. Every "example AI answer" is written for this course and labelled as such: none of them
 * is the output of a real model. Statements about tools, hosting plans and standards live in dated `version` notes, each checked against the
 * vendor's own documentation on CHECKED; no price figures are given because prices change and differ by country.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  agileManifesto: { label: 'Manifesto for Agile Software Development', url: 'https://agilemanifesto.org/' },
  scrumGuide: { label: 'The Scrum Guide', url: 'https://scrumguides.org/scrum-guide.html' },
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  ccWorkflows: { label: 'Claude Code docs: Common workflows (Plan before editing)', url: 'https://code.claude.com/docs/en/common-workflows' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  cursorPlan: { label: 'Cursor docs: Plan Mode', url: 'https://cursor.com/docs/agent/plan-mode' },
  cursorRules: { label: 'Cursor docs: Rules', url: 'https://cursor.com/docs/context/rules' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  copilotStudy: { label: 'GitHub Blog: Quantifying GitHub Copilot’s impact on developer productivity and happiness', url: 'https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/' },
  doraGenAi: { label: 'DORA: Impact of Generative AI in Software Development', url: 'https://dora.dev/ai/gen-ai-report/' },
  doraReport: { label: 'DORA: State of AI-assisted Software Development', url: 'https://dora.dev/research/2025/dora-report/' },
  owaspA01: { label: 'OWASP Top 10:2025, A01 Broken Access Control', url: 'https://top10.owasp.org/2025/A01_2025-Broken_Access_Control' },
  vercelCron: { label: 'Vercel docs: Usage & pricing for cron jobs', url: 'https://vercel.com/docs/cron-jobs/usage-and-pricing' },
  supabaseSmtp: { label: 'Supabase docs: Send emails with custom SMTP', url: 'https://supabase.com/docs/guides/auth/auth-smtp' },
  supabaseProd: { label: 'Supabase docs: Production checklist', url: 'https://supabase.com/docs/guides/deployment/going-into-prod' },
  webkitPush: { label: 'WebKit: Web Push for Web Apps on iOS and iPadOS', url: 'https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/' },
  pgPartial: { label: 'PostgreSQL docs: Partial indexes', url: 'https://www.postgresql.org/docs/current/indexes-partial.html' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'ai-project-planning-01',
    day: 1,
    title: 'What a project plan is for',
    summary: 'A plan is a short, written map you can judge AI’s work against, and AI is a good partner for making it as long as you make the decisions.',
    minutes: 22,
    skills: ['plan-purpose', 'planning-partner'],
    intro: {
      objectives: [
        'Explain what a light project plan is for and name its seven pieces',
        'Say why planning matters more, not less, when AI can build in minutes',
        'Use AI as an interviewer so your idea becomes a one-page idea card',
      ],
      why: 'AI will happily build whatever you type, so the expensive mistakes now are unclear ideas and wrong directions. An hour of planning gives you something to judge every AI answer against, whether you are building your first app or leading a team.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Imagine you tell a builder “make me a house” and walk away. When you come back there is a house. It might have four bedrooms you never needed, no kitchen, and a lovely balcony over the neighbour’s lot. Nobody did anything wrong: you never said what you wanted. A **project plan** is the short written answer to the questions you skipped: what are we making, for whom, in what order, what could go wrong, and roughly how long will it take? It is not a contract and it is not a prediction. It is a **map**: it shows where you are heading so that you notice when you drift, and you redraw it when you learn the road is closed.',
      },
      {
        type: 'paragraph',
        text: 'You might think planning matters less now that AI builds an app in minutes. It matters more. When building was slow, the effort of typing every line forced you to think first. Now you can type “make a clinic booking app” and get something running before your coffee is cold, with a login screen, an online payment page and a dashboard you never asked for. Because it looks finished, you cannot tell whether it is right: you never said what “right” was. Each new prompt then pulls in a different direction, and after a day you have a pile of code nobody understands and no list of what actually works. **AI made building cheap and deciding expensive.** A plan is where you do the deciding on purpose.',
      },
      { type: 'heading', text: 'The seven pieces of a light plan' },
      {
        type: 'paragraph',
        text: 'A plan for a small app does not need to be long. One to three pages is plenty. It has seven pieces, and each one answers a single question. The rest of this course teaches them in this order.',
      },
      {
        type: 'table',
        headers: ['Piece', 'The question it answers', 'Lesson'],
        rows: [
          ['Scope', 'What is in this version, and just as important, what is out?', '2'],
          ['User flows and screens', 'What does each kind of person do, step by step, and what do they see?', '3'],
          ['Features and priorities', 'What must exist, what should, and what can wait?', '4'],
          ['Milestones', 'In what order do we build, and what can we show at each stop?', '4'],
          ['Risks and unknowns', 'What could go wrong, or change the plan, and what do we do about it?', '5'],
          ['Estimates', 'How long might it take, as a range with its assumptions?', '6'],
          ['First prompts', 'What do we ask the AI to do first, and how do we check it?', '7'],
        ],
        caption: 'The seven pieces. Lesson 8 puts them together into a plan for your own app.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The planning loop. The plan is not finished when building starts: after each slice you check whether it still matches reality, and go back if it does not.',
        source: `flowchart LR
  I(Idea) --> S[Scope]
  S --> U[User flows]
  U --> F[Features and milestones]
  F --> R[Risks]
  R --> E[Estimates]
  E --> P[First prompts]
  P --> B[Build one slice]
  B --> L{Does the plan still match reality?}
  L -->|No| S
  L -->|Yes| B`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Planning an app is like planning a birthday party. The guest list is the scope: who is invited and, kindly, who is not. What each guest does from the door to the cake is the flow. The must-have food (the cake) versus the nice-to-have food (the second dessert) is the priority list. Deciding what to prepare first is the milestones. “What if it rains?” is the risks, how long the shopping and cooking will take is the estimate, and the shopping list you hand to a helper is the first prompts. An **app** is just a program you use on a phone or in a browser, and a **feature** is one thing it can do, such as “book a time”. AI is the helper who is very fast at cooking but will cook whatever you say, so you must say it well.',
      },
      { type: 'heading', text: 'Meet the example you will plan all course' },
      {
        type: 'paragraph',
        text: 'To keep things concrete, you will plan one real-feeling project from start to finish: an online booking page for **Maliwanag Family Clinic**, a small made-up clinic with two doctors and a front desk run by Ate Joy. Right now patients phone or message to book, Ate Joy writes the booking in a paper notebook, the same time sometimes gets given to two people, and some patients forget and never show up. Before anything else, write the idea on one card. Copy this and use the same shape for your own idea later.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'IDEA CARD (copy and fill in for any project)',
        code: `IDEA CARD: Maliwanag Family Clinic booking
Who has the problem: patients and the front desk of a small family clinic with two doctors.
What happens today: patients phone or message to book; the front desk writes it in a paper
  notebook; the same time is sometimes given twice; people forget and do not come.
What we want: patients book a time on their phone; the front desk sees the day in one list.
What we do NOT know yet: whether the front desk will actually use it, what the clinic may
  legally collect from patients, and what it will cost to run.`,
      },
      { type: 'heading', text: 'Using AI as a planning partner' },
      {
        type: 'paragraph',
        text: 'AI is very good at four planning jobs. As an **interviewer** it asks the questions you forgot. As a **drafter** it turns your answers into a first version of each piece. As a **critic** it attacks the plan and finds holes (lesson 5 is built on this). As a **translator** it turns the finished plan into prompts for building (lesson 7). The one job it must never have is **decider**. It does not know your clinic, your budget or what Ate Joy will put up with, and it will answer every question with the same confident voice whether it knows or is guessing. You decide; it proposes. A good first conversation is an interview, so ask for exactly that.',
      },
      {
        type: 'prompt',
        label: 'Prompt: let AI interview you (works in ChatGPT, Claude, Gemini or inside a coding tool)',
        text: 'I want to plan a small online booking page for a family clinic with two doctors and one front desk. Do not suggest solutions yet. Interview me, one question at a time, until you could write a one-page plan: who uses it, what they do, what is out of scope, and what worries me. Ask the next question only after I answer. Stop after at most 12 questions, then summarise what you heard in 10 lines so I can correct it.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example exchange (written for this course, not the output of a real model)',
        code: `AI:  Who are the people who will touch this app, and which of them matters most?
You: Patients, and Ate Joy at the front desk. Ate Joy matters most. If she will not use it, nothing works.
AI:  What does Ate Joy do today when a patient phones to book?
You: Opens the notebook, finds the doctor's page, looks for a free line, writes the name and number.
AI:  What is the worst thing that goes wrong with that today?
You: Two patients get the same time. Then someone is turned away at the door.
AI:  What would make you say, in one month, that this worked?
You: Ate Joy stops using the notebook, and nobody is double-booked.`,
      },
      {
        type: 'paragraph',
        text: 'Read the exchange again as the person who will plan the project. In five short questions the AI surfaced three things you will use later: the person whose adoption decides success (a risk, lesson 5), the painful failure to design against (a flow, lesson 3) and a success check you can test by hand (scope, lesson 2). You did the thinking; it asked the questions.',
      },
      {
        type: 'warning',
        text: 'An AI plan always sounds sure of itself, and its knowledge of tools, prices and limits can be out of date. Treat everything it writes as a draft to check. Lesson 5 shows how to check a plan against the real documentation of the tools it relies on.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the plan as an artefact in the repository, not a document in a chat: keep `PLAN.md` and a short decision log next to the code, so people and coding agents read the same source of truth and a change to the plan shows up in a diff and can be reviewed like code. Write each piece as a hypothesis that can be falsified: an assumption about users, a limit of a platform, a time range. The Scrum Guide describes the Product Backlog as an “emergent, ordered list”, and the Agile Manifesto values responding to change over following a plan; both treat the plan as something that is kept honest, not frozen. On a team, name an owner for each decision (scope, architecture, priority) so the AI’s proposals have a human who accepts or rejects them, and ask who will review the plan the way you would ask who will review the pull request.',
      },
      {
        type: 'version',
        text: 'The Agile Manifesto states its fourth value as “Responding to change over following a plan”, and the Scrum Guide defines the Product Backlog as “an emergent, ordered list of what is needed to improve the product”. Claude Code’s best-practices page describes asking Claude to interview you when you do not yet know exactly what you want, and to write the result to a spec file. Checked against these pages on this date.',
        checked: CHECKED,
        sources: [DOCS.agileManifesto, DOCS.scrumGuide, DOCS.ccBest],
      },
      {
        type: 'takeaways',
        items: [
          'A plan is a short written map, not a contract or a prediction: it tells you where you are heading so you notice when you drift.',
          'AI made building cheap and deciding expensive, so planning matters more, and a plan gives you something to judge AI’s work against.',
          'A light plan has seven pieces: scope, flows, features, milestones, risks, estimates and first prompts, each answering one question.',
          'Use AI as interviewer, drafter, critic and translator, but never as decider: you choose, it proposes, and you check what it claims.',
          'Start with a one-paragraph idea card, and ask AI to interview you before you ask it for anything else.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-01-match-1',
          kind: 'match',
          title: 'Which piece of the plan was missing?',
          prompt: 'Each line below is something that went wrong on a real-feeling AI-built project. Match it to the piece of the plan that would most likely have prevented it.',
          concept: 'the pieces of a plan',
          labels: { terms: 'What went wrong', meanings: 'The plan piece that would have prevented it' },
          pairs: [
            { term: 'The AI added online payments nobody asked for, and the first version took twice as long', definition: 'Scope: an explicit list of what is out', note: 'Extra features nobody asked for are a boundary problem: a written out-of-scope list is what lets you say no to the AI.' },
            { term: 'Nobody had written down what happens when two patients pick the same time', definition: 'User flows: the unhappy path written step by step', note: 'A flow lists what the person does and what goes wrong at each step, which is where “same time twice” belongs.' },
            { term: 'The team polished an animation first and ran out of weekend before booking worked', definition: 'Features and priorities: musts before coulds', note: 'Doing nice-to-have work before the thing the app exists for is a priority problem.' },
            { term: 'Reminder emails never arrive because the free email service only sends to team members', definition: 'Risks and unknowns: checking platform limits before building', note: 'A limit of a tool is an unknown you can look up before you build on it.' },
            { term: 'The client heard “two weeks” and the builder meant “two weeks if nothing goes wrong”', definition: 'Estimates: a range with its assumptions', note: 'A single number hides the assumptions it depends on; a range with assumptions says them out loud.' },
          ],
          hints: [
            'Ask for each line: was the problem about what is included, what people do, what comes first, what could fail, or how long?',
            'Think of the question each piece answers in the table above.',
            'Payments nobody asked for is about the boundary; two patients on one time is about what people do step by step.',
          ],
          explanation: 'Each problem maps to the one question a piece of the plan answers. Planning does not remove surprises, but each missing piece is a surprise you chose to have.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-01-scenario-1',
          kind: 'scenario',
          title: 'The ten-minute app',
          prompt: 'Choose your friend’s next move.',
          concept: 'plan before the next prompt',
          situation: 'Your friend runs a small salon. She typed “make me a booking app for my salon” into an AI tool and ten minutes later has a working-looking app with payments, staff logins and a loyalty screen. She is thrilled and asks: “So I should just keep telling it what to change, right?”',
          options: [
            { text: 'Pause and spend fifteen minutes writing an idea card and what is in and out of the first version, then judge the app against it.', consequence: 'She now has a yardstick. She can see that payments and loyalty are out for version 1 and ask the AI to remove them, and she can say what “working” means for booking.', quality: 'best' },
            { text: 'Keep prompting: it is working, so each tweak will get it closer.', consequence: 'Each change drifts in a new direction, nothing says what “finished” is, and after a week she has a large app she cannot explain and cannot tell is right.', quality: 'poor' },
            { text: 'Ask the AI to write the whole plan for her and accept it as it is.', consequence: 'Better than nothing, but the plan has the AI’s guesses about her salon, not her decisions, and she has no idea which parts are guesses.', quality: 'acceptable' },
            { text: 'Delete the app and give up on AI because it built things she did not ask for.', consequence: 'The AI did what its vague prompt allowed. The fix is a clearer idea, not a different tool.', quality: 'poor' },
          ],
          hints: [
            'What is missing before she can tell whether the app is right?',
            'She needs her own written idea and boundary to judge it against.',
            'Write the idea and the in and out of version 1 first, then compare.',
          ],
          explanation: 'AI will produce something from any prompt, so the plan is what turns “something” into “the right thing”. A short idea card and an in and out list is enough to start judging.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-01-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four words to know',
          prompt: 'Tap each card to check you can say it in your own words.',
          concept: 'planning vocabulary',
          cards: [
            { front: 'Plan', back: 'A short written answer to what you are making, for whom, in what order, what could go wrong and how long it might take. A map, not a promise.' },
            { front: 'Scope', back: 'The fence around the project: what is included in this version, and what is deliberately left out.' },
            { front: 'Flow', back: 'The steps one person takes to get one job done, for example opening the page, choosing a time and confirming.' },
            { front: 'Risk', back: 'Something that might go wrong or change the plan, such as an email service that will not send to patients.' },
          ],
          hints: ['Say each word aloud first, then flip the card.'],
          explanation: 'These four words come back in every lesson. If you can explain each one to a friend, you are ready for the next lesson.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-01-q1',
        prompt: 'Why does planning matter more, not less, when AI can build an app in minutes?',
        choices: [
          'AI tools refuse to write any code until you have uploaded a complete written project plan for them to read first',
          'Building is cheap now, so the costly mistake is building something unclear, and a plan lets you judge the result',
          'A written plan lowers the cost of every prompt you send to an AI assistant',
          'Plans are required by law before any software can be released to the public',
        ],
        answer: 1,
        explanation: 'When building took days, the effort forced you to think first. Now the AI will build from any prompt, so the plan is what tells you whether the result is the right thing.',
      },
      {
        id: 'ai-project-planning-01-q2',
        prompt: 'Which description of a project plan matches the lesson?',
        choices: [
          'A contract that fixes every feature and date, so nobody can change anything later',
          'A forecast of exactly how long the project will take, written once and then never touched or questioned again',
          'A full specification of every screen and line of code, written before the first prompt',
          'A short map of what you are making and in what order, redrawn when reality teaches you something',
        ],
        answer: 3,
        explanation: 'A plan is a map. It keeps you from drifting, and you update it when you learn something. It is not a contract, a promise or a complete specification.',
      },
      {
        id: 'ai-project-planning-01-q3',
        prompt: 'In the clinic example, the AI interview revealed that Ate Joy’s adoption decides success. Which piece of the plan does that become?',
        choices: [
          'A risk to record and test early: if she will not use it, the project fails',
          'A feature to add to the first milestone, such as a login for Ate Joy',
          'A line in the estimate table, because Ate Joy’s time is one of the costs of the whole project',
          'Nothing, because plans only cover technical matters and not people',
        ],
        answer: 0,
        explanation: 'Something that could make the whole project fail, and that you do not yet know the answer to, is a risk. Lesson 5 shows how to rank it and what to do about it.',
      },
      {
        id: 'ai-project-planning-01-q4',
        prompt: 'An AI assistant gives you a complete plan with confident time estimates and tool recommendations. What is the right way to treat it?',
        choices: [
          'Follow it, because the AI has read more documentation than you ever will',
          'Throw it away, because AI plans are always wrong and it is not worth reading any of it carefully',
          'As a draft you decide on: keep what fits, and check its claims about tools and limits yourself',
          'Ask the same AI to confirm it is correct, and follow it if it says yes',
        ],
        answer: 2,
        explanation: 'AI proposes and you decide. Its voice is equally confident when it is guessing, and its knowledge of tools can be out of date, so claims that matter are checked against official documentation.',
      },
      {
        id: 'ai-project-planning-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a project plan?',
        choices: [
          'A short written map of what you are making, in what order, and what could go wrong',
          'A promise to the customer that everything will finish exactly on time and on budget',
          'The computer code that the AI writes when you ask it to build your app',
        ],
        answer: 0,
        explanation: 'A plan is not code and not a promise. It is a short map you write before building and update as you learn.',
      },
      {
        id: 'ai-project-planning-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team uses coding agents. Where should the plan live so both people and agents work from the same truth?',
        choices: [
          'In a chat thread, because the agent reads the whole thread before each task',
          'Only in each developer’s head, so that every agent gets a different interpretation and the team can compare them later',
          'In a slide deck for stakeholders, updated at each milestone review meeting',
          'In the repository as reviewable files (a plan and a decision log) that change in diffs like code',
        ],
        answer: 3,
        explanation: 'A plan in the repo is versioned, reviewed, and available to every contributor and agent. A chat thread or slide deck drifts away from the code and is not reviewed in the same way.',
      },
    ],
    task: {
      title: 'Write your idea card and run an interview',
      minutes: 15,
      steps: [
        'Pick an app idea you would like to plan: your own, or a small one such as a booking page, a price list or a tracker for a small shop.',
        'Paste the interview prompt from this lesson into an AI assistant, replacing the clinic with your idea, and answer its questions honestly (short answers are fine).',
        'Read its 10-line summary and correct anything wrong. Then fill in the idea card from this lesson in your own words.',
        'Underline the one thing you do NOT know yet that worries you most. You will turn it into a risk in lesson 5.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['After the interview, ask the AI: “Explain in plain words, with an everyday example, what each of the seven pieces of a plan means for my idea.” Check that you could explain two of them to a friend.'] },
      { audience: { min: 'advanced' }, steps: ['Create a `docs/PLAN.md` in a new or existing repository, paste the idea card as its first section and add a “Decisions” heading with the owner and date of each decision so far. Commit it as the first change to the plan.'] },
    ],
  },
  {
    id: 'ai-project-planning-02',
    day: 2,
    title: 'Scope: what is in and what is out',
    summary: 'Draw the fence around version 1: say what is in, say what is out, and write a success check you can test by hand.',
    minutes: 24,
    skills: ['scope-statement', 'planning-partner'],
    intro: {
      objectives: [
        'Write a scope statement with an in list, an out list and a success check',
        'Apply three questions to decide whether a request is in or out of version 1',
        'Ask AI to attack your scope and decide which of its suggestions to keep',
      ],
      why: 'AI is eager to be helpful, so it adds features you never asked for, and every extra feature is more to test, protect and fix. A written boundary is how you say no to the AI, to a client and to your own good ideas.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A sari-sari store sells rice, soap, mobile load and candy. It does not sell fresh fish, repair phones or cut hair, and nobody is confused by that, because the owner decided what goes on the shelf. **Scope** is the shelf list of a project: what this version includes and what it deliberately does not. It matters because every feature is more than one idea. Each one is more screens to design, more rules to get right, more data to protect and more places for a bug to hide. A project with a small, clear scope gets finished. A project with a vague scope grows quietly (people call this **scope creep**) until nobody can say when it is done.',
      },
      {
        type: 'paragraph',
        text: 'AI makes scope creep easier. Ask for “a booking page” and a helpful assistant may add payments, reviews and a loyalty programme, because those often appear next to booking in the apps it learned from. You did not ask for them, but now you own them. This is why the **out-of-scope list** is more powerful than the in-scope list. The in list tells the builder what to make. The out list tells everyone what *not* to make, and anything not written down is a “maybe”. Two people can hear “booking app” and picture completely different things: one imagines online payment, the other text-message reminders. Writing the out list forces that conversation to happen on day one, not in week six.',
      },
      { type: 'heading', text: 'The parts of a scope statement' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**For:** who the version is for, in a phrase.',
          '**Problem:** what is wrong today, in one or two sentences.',
          '**The one job:** one sentence describing the thing that must work. If you can only keep one thing, it is this.',
          '**In scope:** a short list of what version 1 includes.',
          '**Out of scope:** what version 1 does not include, each with a short reason in brackets, so nobody reopens the question.',
          '**Success check:** two or three things you can test by hand to say “done”, not feelings.',
          '**Constraints:** the fixed facts: who builds it, time, budget, platform, opening hours.',
          '**Assumptions:** things you are counting on but have not confirmed. These feed the risk list in lesson 5.',
        ],
      },
      { type: 'heading', text: 'The clinic’s scope statement, in full' },
      {
        type: 'paragraph',
        text: 'Here is the whole statement for Maliwanag Family Clinic. It is the kind of thing you can finish in half an hour after the AI interview in lesson 1, and it is written to be copied: change the words and you have a statement for your own project.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'SCOPE STATEMENT: Maliwanag Family Clinic online booking, version 1 (copy and adapt)',
        code: `PROJECT: Maliwanag Family Clinic online booking, version 1

FOR: Patients of one clinic with two doctors, who book by phone today, and the front-desk
  staff who take those bookings.

PROBLEM: Phone lines are busy, bookings live in a paper notebook, two patients are sometimes
  given the same time, and people forget their visit.

THE ONE JOB: A patient can pick a doctor, a day and a free 30-minute time on their phone,
  and the front desk sees that booking in the day's list without anyone writing it down.

IN SCOPE (version 1):
- Patients see free times for a doctor on a day and book one.
- Patients cancel their own booking from a link.
- Front-desk staff sign in, see any day's bookings, cancel one, and mark a visit arrived or no-show.
- Staff block one-off times (leave, emergencies) so they cannot be booked.
- A confirmation email after booking, and a reminder email the day before.

OUT OF SCOPE (version 1):
- Medical records, diagnoses, prescriptions or uploading any health document (sensitive data
  with legal duties; the clinic keeps its own system for these).
- Online payment (money rules to get exactly right; the visit is paid at the clinic).
- Video consultations (a different product).
- SMS or push messages (extra cost and set-up; email only for now).
- Patient accounts and passwords (a booking needs only a name, mobile number and email).
- Booking two doctors at once, or repeating visits.
- A native phone app (a website that works well on a phone is enough).

SUCCESS CHECK (tested by hand):
- A new patient completes a booking in under three minutes with no help.
- Two people choosing the same time: exactly one succeeds, the other is told politely
  and shown other times.
- The front desk's list for tomorrow matches the bookings made, with no duplicates.

CONSTRAINTS: One part-time builder working with an AI assistant. Free hosting tiers while testing.
  Clinic open Monday to Saturday, 8:00 to 17:00, Philippine time only.

ASSUMPTIONS (to check): Front desk has a phone or laptop with internet all day. Patients have
  a mobile number and an email address. Free hosting and email tiers are enough for a pilot.`,
      },
      {
        type: 'paragraph',
        text: 'Look at four habits in that statement. The one job is a single sentence you can test. Every out-of-scope line has a reason in brackets, which saves you re-arguing it. The success checks are things you can do with two phones and a stopwatch. And the assumptions are written down so you can check them later, not discovered the hard way.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'If you have built a small project before, open its README and your commit history. The features you added late were probably scope you never wrote down. Try rewriting that old project as a scope statement and mark which of its late features would have been “out” for version 1.',
      },
      { type: 'heading', text: 'Three questions for in or out' },
      {
        type: 'paragraph',
        text: 'When a new request arrives (from the AI, from a client or from you at midnight), run three questions. **1. Does it serve the one job?** If not, it is probably out. **2. Could version 1 work without it?** If yes, it is out or “later”. **3. Does it add something we must protect or get exactly right**, such as money, health details or other people’s secrets? If yes, treat it as expensive: it needs a deliberate decision, not a quick yes. Try them on “patients upload a photo of their insurance card”. It does not serve the one job, booking works without it, and it collects sensitive personal data, so it is out and goes on a “later” list with its reason.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of scope as the fence around a garden. Inside the fence you plant exactly what you listed: tomatoes, herbs. Outside it are all the good ideas (a fish pond! a swing!) that you wrote on a “later” list so they do not trample the tomatoes. **Version 1** means the first usable version, small on purpose, not the final one. **Scope creep** is what happens when the fence is quietly moved a little each day until the garden is too big to look after. The success check is how you would know the tomatoes grew: something you can see and count, such as “two people try to book the same time and only one gets it”, not a feeling such as “people like it”. An AI assistant is a keen gardener who will happily plant extra things unless the fence is written down.',
      },
      { type: 'heading', text: 'Make AI attack your scope' },
      {
        type: 'paragraph',
        text: 'Once you have a draft, ask AI to be a critic instead of a drafter. Do not ask it to rewrite your statement, because then you stop deciding. Ask it for issues only, and you choose what to do with each one.',
      },
      {
        type: 'prompt',
        label: 'Prompt: challenge my scope (paste your scope statement under it)',
        text: 'Here is my scope statement for version 1 of an app. Act as a careful reviewer. (1) List ten things a reasonable person might assume this app includes that I have not mentioned, and for each say whether it should be in or out of version 1 and why. (2) Point out any sentence that is vague enough that two people could build different things from it. (3) Tell me which out-of-scope item is most likely to creep back in, and why. Do not rewrite my statement. Only list issues.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example reply, shortened (written for this course, not the output of a real model)',
        code: `1. Patients can rebook after cancelling. Not mentioned. Suggest out of v1: cancel, then book again.
2. A waiting list for full days. Not mentioned. Suggest out: it is a feature, not part of the one job.
3. Doctors see their own day's schedule. Not mentioned. Decide: is the doctor a user, or only the front desk?
...
Vague: "the front desk sees that booking in the day's list". Does the list update by itself, or after a
  page refresh? Two builders would choose differently.
Most likely to creep back: online payment. The clinic will ask "can patients pay a deposit to stop
  no-shows?" The reason in brackets does not answer that, so expect the question.`,
      },
      {
        type: 'warning',
        text: 'The AI’s list of “things people might assume” is a menu of ideas, not a to-do list. If you accept every item, you have just let it widen your scope for you. For each one, choose in, out or later, and write the reason in brackets.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Scope has a boundary and a context. Draw the system boundary: which actors (patient, staff), which external systems (email provider, identity provider, hosting), and what data crosses it. Classify the data, because that decides the obligations: a name and mobile number is personal data; a diagnosis is health data and may carry stricter legal duties, which is a good reason to keep it out of version 1. Non-functional requirements (availability, privacy, accessibility, audit) cost as much as features and belong in scope too. Write non-goals as explicit “we will not” statements, and when stakeholders want a fixed date and every feature, hold time fixed and vary scope: rank the work, cut from the bottom of the could list, and record each cut in a decision log. For agent workflows, copy the out-of-scope list into the agent’s instructions file, so drive-by refactors, new dependencies and “helpful” extras are refused before they reach a diff.',
      },
      {
        type: 'takeaways',
        items: [
          'Scope is the fence around version 1: what is in, what is out, and how you will know it works.',
          'The out-of-scope list matters most, because anything unwritten is a maybe and AI loves to add helpful extras.',
          'A scope statement has eight parts: for, problem, the one job, in, out (each with a reason), success check, constraints and assumptions.',
          'Run three questions on any request: does it serve the one job, could version 1 work without it, and does it add something we must protect or get exactly right?',
          'Ask AI to list issues with your scope, not to rewrite it, and decide yourself what is in, out or later.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-02-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the scope statement',
          prompt: 'This is a short scope statement for a tutoring centre’s booking page. Fill each blank from the word bank so that the statement is clear and testable.',
          concept: 'scope statement',
          language: 'text',
          code: `PROJECT: Booking page for a small tutoring centre, version 1
FOR: Parents and the centre's one receptionist.
THE ONE JOB: A parent can ___ a free tutoring slot on their phone, and the receptionist sees it in one list.
OUT OF SCOPE (version 1): Online payment, ___ lessons, and student grades.
SUCCESS CHECK: Two parents choose the same slot at once: exactly ___ of them gets it.
ASSUMPTION (to check): The receptionist has ___ at the desk all day.`,
          blanks: [
            { answers: ['book'], feedback: 'The one job is the thing a parent actually does. A parent cannot “delete” a free slot as the point of the app.' },
            { answers: ['video'], feedback: 'The out list holds what version 1 skips. “Booking lessons” is the one job itself, so it cannot be out of scope.' },
            { answers: ['one'], feedback: 'A success check you can test says exactly one parent succeeds. Two would be a double booking, which is the very problem.' },
            { answers: ['internet access'], feedback: 'An assumption is a fact you are counting on and must check. A free afternoon is not something the app depends on.' },
          ],
          bank: ['book', 'delete', 'video', 'booking', 'one', 'two', 'internet access', 'a free afternoon'],
          hints: [
            'Read each sentence aloud with a word in the blank and ask whether the statement still makes sense.',
            'The one job is the main thing a parent does; the out list holds things the version skips.',
            'The success check is about two parents and one slot: how many should succeed?',
          ],
          explanation: 'A good statement names the one job (book a slot), puts something clearly secondary out (video lessons), states a success check you can test (exactly one parent gets the slot) and records an assumption to confirm (internet access at the desk).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-02-scenario-1',
          kind: 'scenario',
          title: 'In or out of version 1?',
          prompt: 'Choose how to answer the clinic owner.',
          concept: 'in or out of scope',
          situation: 'The clinic owner is thrilled with the draft and says: “Can patients also upload photos of their lab results so the doctor can look before the visit? It is only an upload button.” Your scope statement, so far, has no mention of it.',
          options: [
            { text: 'Put it on the out list for version 1 with the reason (sensitive health data with legal duties, and booking works without it) and record it on a “later” list.', consequence: 'The owner sees it was taken seriously, version 1 stays small, and the idea is kept for a time when you can plan the privacy side properly.', quality: 'best' },
            { text: 'Say yes: it is only an upload button, and the AI can add it in one prompt.', consequence: 'The button is easy but the duties are not: where the files are stored, who can open them and how long they are kept all become your problem, in the first version.', quality: 'poor' },
            { text: 'Ask the AI to build it first, then decide whether it is worth keeping.', consequence: 'You now own code and stored health files that you did not plan, and removing them is harder than not adding them.', quality: 'poor' },
            { text: 'Say you will check what rules apply to the clinic before deciding, and keep it out until you know.', consequence: 'A sensible next step and nothing is built blindly, but it leaves the question open instead of ruling it out of version 1 right away.', quality: 'acceptable' },
          ],
          hints: [
            'Run the three questions: the one job, could version 1 work without it, and does it add something to protect?',
            'Booking works without uploads, and uploads add sensitive data.',
            'Decide now, write the reason down, and keep the idea on a later list.',
          ],
          explanation: 'It fails all three questions: it is not the one job, version 1 works without it, and it brings sensitive data. Saying no with a written reason is kinder than a quick yes you will regret, and the later list keeps the idea alive.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-02-q1',
        prompt: 'Why is the out-of-scope list described as more powerful than the in-scope list?',
        choices: [
          'It is shorter than the in list, so people are more likely to read it',
          'AI assistants only pay attention to the out-of-scope part of a document',
          'Anything unwritten is a “maybe”, and AI adds helpful extras, so the out list is what stops the drift',
          'Rules in most countries require every software project to list its exclusions before any code is written',
        ],
        answer: 2,
        explanation: 'The in list says what to build. Only the out list says what not to build, and without it the AI’s helpful extras and everyone’s different pictures of the app slip in.',
      },
      {
        id: 'ai-project-planning-02-q2',
        prompt: 'Which of these is a well-written success check?',
        choices: [
          'Two people try to book the same time: exactly one succeeds and the other is politely shown other times',
          'The booking page feels fast, modern and friendly to the people who use it every day',
          'Patients and staff are happy with the app after they have used it for a while',
          'The app works properly on every phone, browser and internet connection that any patient or staff member might use',
        ],
        answer: 0,
        explanation: 'A success check is something you can do by hand and see pass or fail. “Feels fast”, “happy” and “works everywhere” are feelings or claims too big to test.',
      },
      {
        id: 'ai-project-planning-02-q3',
        prompt: 'The clinic asks for an online deposit payment to reduce no-shows. Applying the three questions, what is the best answer for version 1?',
        choices: [
          'In, because reducing no-shows is a good goal and payment is only one more button',
          'In, but only if the AI writes all the payment code, so that you do not have to review or test it yourself',
          'Out, because the clinic should never take money from patients through any kind of website',
          'Out and on the later list: version 1 works without it, and money adds rules to get exactly right',
        ],
        answer: 3,
        explanation: 'Question 2 (could version 1 work without it?) is yes, and question 3 (money to get exactly right) flags it as expensive. It is not forbidden, just not for the first version.',
      },
      {
        id: 'ai-project-planning-02-q4',
        prompt: 'Which sentence belongs under “Assumptions (to check)”?',
        choices: [
          'We will build the whole booking page in about two weeks of spare evenings and a couple of weekends',
          'The front desk has a phone or laptop with internet at the desk all day',
          'Patients will love booking online once they try it for the first time',
          'The app will be fast and secure enough for a small clinic to trust',
        ],
        answer: 1,
        explanation: 'An assumption is a fact you are counting on that you can check. The internet at the desk is checkable. A time is an estimate, and “love” and “fast and secure” are hopes, not checkable facts.',
      },
      {
        id: 'ai-project-planning-02-q5',
        audience: { max: 'beginner' },
        prompt: 'What does “version 1” mean in a plan?',
        choices: [
          'The final, perfect app with every idea, feature and improvement already included in it',
          'A rough draft that nobody is ever meant to use',
          'The first usable version, small on purpose, with more added later',
        ],
        answer: 2,
        explanation: 'Version 1 is small on purpose but usable. Ideas that do not fit go on a later list instead of making the first version huge.',
      },
      {
        id: 'ai-project-planning-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A stakeholder demands a fixed launch date and every feature on the wish list. What is the most defensible response?',
        choices: [
          'Promise everything and ask the coding agents to work faster and in parallel so that it all somehow fits',
          'Keep the date, quietly skip testing and review for the features at the bottom of the list',
          'Move the date every time a new feature is added so that nobody is ever disappointed',
          'Keep the date and vary scope: rank features, cut from the bottom of the could list, and log each cut',
        ],
        answer: 3,
        explanation: 'With time fixed, scope is the lever that stays honest. Cutting from the lowest-priority work and recording each cut keeps quality and trust. Skipping review hides cost, and more agents move the bottleneck to review.',
      },
    ],
    task: {
      title: 'Write and attack your scope statement',
      minutes: 20,
      steps: [
        'Using your idea card from lesson 1, write a scope statement with all eight parts. Give every out-of-scope line a reason in brackets.',
        'Paste it into an AI assistant with the “challenge my scope” prompt from this lesson.',
        'For each of the ten things it lists, write in, out or later, with a reason. Count how many were new to you.',
        'Rewrite your one-job sentence so that you could test it with two phones and a stopwatch.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain scope creep to me with an everyday example, then tell me which parts of my statement are most likely to grow.” Pick one part and write it as a smaller version.'] },
      { audience: { min: 'advanced' }, steps: ['Add a data classification line (what personal or sensitive data version 1 touches), three non-functional requirements and an explicit non-goals section. Copy the out-of-scope list into an instructions file (CLAUDE.md or AGENTS.md) for the project.'] },
    ],
  },
  {
    id: 'ai-project-planning-03',
    day: 3,
    title: 'User flows and screens',
    summary: 'Write what each person does step by step, including what goes wrong, then read the list of screens straight off the flows.',
    minutes: 26,
    skills: ['user-flows', 'planning-partner'],
    intro: {
      objectives: [
        'Write a flow as numbered steps with “what if” branches for each important job',
        'Turn a flow into a screen list and a simple flowchart that AI can draw',
        'Spot the missing unhappy paths that AI-made apps usually skip',
      ],
      why: 'Flows are where a vague idea becomes specific enough to build. They show which features and screens you really need, and the sad paths you write down now are the bugs you will not have to debug later.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Suppose a friend asks you how to get to the clinic. You would not say “it is on Rizal Street”. You would give the route: “From the jeepney stop, walk past the bakery, turn left at the pharmacy, the clinic is the blue door.” And if you are kind, you would add: “If the street is flooded, go around by the church.” That is a **user flow**: the path one person takes to get one job done, step by step, plus what to do when the road is blocked. In an app, a flow says what the person does, what they see after each step, and what happens when something goes wrong.',
      },
      {
        type: 'paragraph',
        text: 'Flows come before the feature list for a simple reason: every step of a flow needs the app to be able to do something, so the flows tell you which features you actually need. They also tell you which **screens** you need. A screen is one thing the person sees at a time. And flows are where the **unhappy path** lives: what happens when the time was just taken, the phone number is mistyped, or the signal drops. AI is good at writing the happy path (everything goes right) and tends to skip the unhappy ones, which is exactly where real people spend their frustrating moments.',
      },
      { type: 'heading', text: 'How to write a flow list' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**List the people** who use the app, by role, not by name.',
          '**List each person’s jobs**, each as a verb and an object: “book an appointment”, “see a day’s bookings”.',
          '**Write the happy path** for each job as numbered steps, one action per step.',
          '**Add the “what if” branches** under the steps where things can go wrong, then list the screens: every time what the person sees changes, that is a screen.',
        ],
      },
      { type: 'heading', text: 'The clinic’s people, jobs and booking flow' },
      {
        type: 'code',
        language: 'text',
        label: 'PEOPLE AND JOBS: Maliwanag Family Clinic (copy and adapt)',
        code: `PEOPLE AND JOBS
Patient (on a phone, no account):
  P1 Book an appointment.
  P2 Cancel my appointment.
Front-desk staff (on the desk computer or a phone, signed in):
  S1 Sign in.
  S2 See a day's bookings.
  S3 Mark a visit arrived or no-show.
  S4 Block a time (leave, emergency).
  S5 Cancel a booking for a patient who phoned.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'USER FLOW P1: Book an appointment (copy and adapt)',
        code: `USER FLOW P1: Book an appointment (patient, on a phone)

Happy path
 1. Open the clinic's booking page.
 2. Choose a doctor.
 3. Choose a day (the next 14 days; closed days are greyed out).
 4. See the free 30-minute times for that doctor and day; tap one.
 5. Enter name, mobile number and email; choose a visit type from a short list.
 6. Review the summary and tap Confirm.
 7. The system saves the booking and holds the time.
 8. See a confirmation with a booking code and a cancel link.
 9. Receive a confirmation email.

What if
 4a. No free times that day: say so, and show the next days that have free times.
 5a. Mobile number or email looks wrong: show what to fix beside the field; keep what they typed.
 6a. Someone else took the time while they filled in the form: say "That time was just taken",
     keep their details, show other times that day.
 any. Connection drops: say the booking was NOT confirmed and offer Try again.
     A retry must never create two bookings.
 9a. The email fails to send: the booking still stands; the confirmation screen is the proof.`,
      },
      {
        type: 'paragraph',
        text: 'Notice that branch 6a is the whole reason the clinic wants this app. It is the paper notebook’s double-booking problem, written as a step. Notice also that the visit type is a short list, not free text: the scope statement said no health details in version 1, and a flow is where that decision becomes a screen. Here is the same flow as a diagram. Boxes are steps, diamonds are questions, and the arrows show where each answer leads.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Flow P1 as a flowchart. Every “No” arrow is an unhappy path that someone has to design.',
        source: `flowchart TD
  A(Open booking page) --> B[Choose a doctor]
  B --> C[Choose a day]
  C --> D{Any free times that day?}
  D -->|No| E[Show next days with free times]
  E --> C
  D -->|Yes| F[Pick a 30-minute time]
  F --> G[Enter name, mobile and email]
  G --> H{Details valid?}
  H -->|No| G2[Show what to fix]
  G2 --> G
  H -->|Yes| I[Review and confirm]
  I --> J{Is the time still free?}
  J -->|No| K[Say it was just taken and show other times]
  K --> F
  J -->|Yes| L[Save booking and hold the time]
  L --> M[Show confirmation with code and cancel link]
  M --> N(Send confirmation email)`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'SCREENS read off the flows (copy and adapt)',
        code: `SCREENS
Patient:
  1 Choose doctor and day
  2 Pick a time
  3 Your details
  4 Review and confirm
  5 Booked (code and cancel link)
  6 Cancel my booking
Front desk:
  7 Sign in
  8 Day list (with a date picker)
  9 Booking detail (arrived, no-show, cancel)
 10 Block a time
STATES on every screen that loads data: loading, nothing to show, error.`,
      },
      {
        type: 'paragraph',
        text: 'The last line of that list matters more than it looks. Any screen that loads data has three extra versions: waiting, empty and failed. The AI-Assisted UI and UX Development course covers designing those states; here it is enough to list them so they are not forgotten.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A **role** is a kind of person who uses the app, such as “patient” or “front desk”. A **job** is something that person wants to get done. The **happy path** is the steps when everything goes right, like a trip where the jeepney comes on time and the street is dry. The **unhappy paths** are the detours: the flood, the closed shop, the wrong turn. Reading the flowchart: a rounded shape is where it starts or ends, a box is something the person or app does, a diamond is a yes-or-no question, and each arrow shows where to go next. When you ask an AI to draw one, you are asking it to turn your numbered list into this picture. If a diamond has only one arrow coming out, a path is missing.',
      },
      { type: 'heading', text: 'Ask AI for the sad paths' },
      {
        type: 'prompt',
        label: 'Prompt: find what could go wrong in a flow (paste your happy path under it)',
        text: 'Here is the happy path of one user flow for a clinic booking page. For each numbered step, list at least two things that could go wrong (wrong input, slow or lost connection, someone else acting at the same time, an empty result). For each, say what the person should see and whether anything has been saved. Do not change my steps. At the end, tell me which step has the most risk of two people interfering with each other.',
      },
      {
        type: 'prompt',
        label: 'Prompt: draw the flow and list the screens',
        text: 'Turn this flow, including the “what if” branches, into a Mermaid flowchart (flowchart TD) with a diamond for every question. Keep every node label under 60 characters. Then list the screens the flow needs, one line each, and list the states each screen needs (loading, empty, error).',
      },
      {
        type: 'warning',
        text: 'Compare the AI’s flow with your scope statement, line by line. AI often adds a step that many apps have, such as “create an account”, even though your scope says no accounts. Cross out anything the out-of-scope list forbids.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** A flow is also a state machine in disguise. A booking has states (booked, cancelled, arrived, no-show) and only some transitions are legal, so write the transition table before the code. Branch 6a is a concurrency problem: a check in the interface (“this time is free”) can pass for two requests at once, so the guarantee has to live in the data layer. A unique partial index over doctor and start time, restricted to rows that are not cancelled, makes the second insert fail, and the app turns that failure into the friendly “just taken” screen. Retries need an idempotency key (a booking id the client generates once) so a repeated request is the same booking, not a second one. Finally, write a permission matrix: a patient reaches only the booking named by an unguessable token, staff reach all bookings, and nobody reaches anything by changing a number in a URL.',
      },
      {
        type: 'code',
        language: 'sql',
        audience: { min: 'advanced' },
        label: 'The guarantee behind branch 6a: one active booking per doctor and start time (tested in SQLite, same syntax in PostgreSQL)',
        code: `CREATE UNIQUE INDEX one_active_booking_per_time
  ON bookings (doctor_id, starts_at)
  WHERE status <> 'cancelled';`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        audience: { min: 'advanced' },
        caption: 'The data the flows imply. The status column carries the lifecycle (booked, cancelled, arrived, no-show).',
        source: `erDiagram
  DOCTOR ||--o{ BOOKING : receives
  DOCTOR ||--o{ BLOCKED_TIME : has
  BOOKING {
    string id
    string doctor_id
    datetime starts_at
    string status
    string patient_name
    string patient_mobile
    string patient_email
  }`,
      },
      {
        type: 'version',
        text: 'PostgreSQL’s documentation describes a partial index as an index built over a subset of a table’s rows, defined by a condition, and shows that a unique partial index enforces uniqueness only among the rows that satisfy the condition. The index above was run in SQLite, which accepts the same form: a second active booking for the same doctor and time was refused, while a cancelled one did not block a rebooking. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.pgPartial],
      },
      {
        type: 'takeaways',
        items: [
          'A user flow is the path one person takes to get one job done, step by step, including what to do when something goes wrong.',
          'Flows come before features: each step needs a capability, so the flow shows which features and screens you really need.',
          'Write the people, then their jobs, then numbered happy paths, then “what if” branches, then the screen list.',
          'AI writes happy paths well and skips the sad ones: ask it for what could go wrong at every step, and check its flow against your scope.',
          'Every screen that loads data also needs a loading, an empty and an error version.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-03-arrange-1',
          kind: 'arrange',
          title: 'Put the cancel flow in order',
          prompt: 'This is the happy path for job P2, “Cancel my appointment”. The steps are shuffled. Put them in the order a patient would experience them.',
          concept: 'writing a flow as ordered steps',
          language: 'text',
          solution: [
            'Open the cancel link from the confirmation email',
            'See the booking details (doctor, day and time) to check it is the right one',
            'Tap Cancel booking',
            'Confirm the “Are you sure?” question',
            'The system marks the booking cancelled and frees the time',
            'See “Your booking is cancelled” with a button to book a new time',
          ],
          reasons: [
            'The patient arrives from the link in the email, so that starts the flow.',
            'They need to see which booking it is before they cancel it.',
            'Only after checking do they choose to cancel.',
            'Cancelling is hard to undo, so the app asks once more.',
            'The system changes the data only after the patient has confirmed.',
            'The last screen tells them what happened and what they can do next.',
          ],
          hints: [
            'Where does a patient come from, and what do they want to check before they act?',
            'A destructive action usually comes after the person has seen what it affects and confirmed it.',
            'Open the link, see the details, tap Cancel, confirm, the system changes the data, then the result screen.',
          ],
          explanation: 'A good flow follows the person: arrive, check, act, confirm, system change, result. The system only changes the data after the person confirms, and the last step always says what happened.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-03-scenario-1',
          kind: 'scenario',
          title: 'What did the flow miss?',
          prompt: 'Choose the best response.',
          concept: 'unhappy paths',
          situation: 'You show Ate Joy flow P1. She reads step 6 and asks: “What if two patients both tap Confirm for the nine o’clock time at the same moment?” Your flow has nothing for that.',
          options: [
            { text: 'Add branch 6a: the second patient sees “That time was just taken”, keeps their details and is shown other times, and add “two people, one time: exactly one succeeds” to the success checks.', consequence: 'The flow now covers the clinic’s core problem, and it can be tested by hand with two phones before the clinic ever sees the app.', quality: 'best' },
            { text: 'Reply that it is a small clinic, so it will almost never happen.', consequence: 'It will happen at the busiest times, and one double booking brings back the notebook’s problem and Ate Joy’s trust problem.', quality: 'poor' },
            { text: 'Show any failed booking a general message such as “Something went wrong”.', consequence: 'Better than a crash, but the patient does not know the time was taken or what to do next, so they may phone the clinic and the app saves no work.', quality: 'acceptable' },
            { text: 'Let both bookings go through and let the front desk sort it out on the day.', consequence: 'This is the paper notebook problem again, now with a screen on top of it.', quality: 'poor' },
          ],
          hints: [
            'What does the person need to see when the thing they wanted is no longer available?',
            'A good branch says what happened, keeps their work and offers a next step.',
            'Add a “just taken” branch and a success check that tests it.',
          ],
          explanation: 'An unhappy path is part of the flow, not an afterthought. The best answer designs the sad moment (what they see, what is kept, what they can do) and makes it testable.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-03-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Flow words',
          prompt: 'Tap each card to check you can explain it with an everyday example.',
          concept: 'flow vocabulary',
          cards: [
            { front: 'Role', back: 'A kind of person who uses the app, such as “patient” or “front desk”. Name roles, not individuals.' },
            { front: 'Happy path', back: 'The steps of a job when everything goes right, written as a numbered list with one action per step.' },
            { front: 'Unhappy path', back: 'What happens when something goes wrong, such as a time that was just taken or a mistyped number, and what the person should see.' },
            { front: 'Screen', back: 'One thing the person sees at a time. Each time what they see changes in a flow, that is a screen.' },
          ],
          hints: ['Think of getting to the clinic by jeepney while you read each card.'],
          explanation: 'Knowing these four words lets you read any flow and ask an AI for the missing parts in plain language.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-03-q1',
        prompt: 'Why write user flows before the feature list?',
        choices: [
          'Each step of a flow needs the app to do something, so flows show which features and screens you need',
          'Flows are shorter than feature lists, so an AI assistant is able to read them faster and more accurately',
          'Screens must be drawn first because no one can decide what an app does without a picture',
          'Flows decide which programming language and tools the project has to use',
        ],
        answer: 0,
        explanation: 'A feature that no step of any flow uses is probably not needed, and a step that nothing supports shows a missing feature. Flows tie the two together.',
      },
      {
        id: 'ai-project-planning-03-q2',
        prompt: 'Which of these is an unhappy path in the booking flow?',
        choices: [
          'The patient chooses a doctor and a Tuesday and sees the free times',
          'The patient is shown a booking code and a link they can use to cancel later',
          'The patient taps Confirm, but someone else took that time a moment earlier',
          'The patient opens the booking page on a phone and starts the first step',
        ],
        answer: 2,
        explanation: 'An unhappy path is a branch where something goes wrong or is not available. The other choices are normal steps of the happy path.',
      },
      {
        id: 'ai-project-planning-03-q3',
        prompt: 'Your AI’s draft flow adds a step “create a password” for patients. The scope statement says patient accounts are out. What do you do?',
        choices: [
          'Keep it: most booking apps have accounts, and the AI probably knows best',
          'Remove the step and point to the scope statement: a booking needs only name, mobile and email',
          'Keep it, then add a “skip” button so that patients can decide for themselves whether or not to create a password',
          'Rewrite the scope statement to match the flow, because the flow is more recent',
        ],
        answer: 1,
        explanation: 'The scope is your decision and the AI’s draft is a proposal. When they disagree, the draft changes unless you decide on purpose that the scope should.',
      },
      {
        id: 'ai-project-planning-03-q4',
        prompt: 'A patient taps Confirm and the connection drops. What should the flow guarantee?',
        choices: [
          'The app shows a happy confirmation, because the patient probably did get a time',
          'The app reloads the page by itself, again and again, until a confirmation finally appears on the screen',
          'The app asks the patient to phone the clinic, since no online step can be trusted',
          'The patient is told the booking was not confirmed, and trying again can never create two bookings',
        ],
        answer: 3,
        explanation: 'The patient needs the truth (not confirmed) and a safe retry. A false confirmation or a retry that books twice would both recreate the notebook problem.',
      },
      {
        id: 'ai-project-planning-03-q5',
        audience: { max: 'beginner' },
        prompt: 'What is the “happy path” of a flow?',
        choices: [
          'The steps when everything goes right, from start to finish',
          'The shortest road from the user’s home to the clinic on a map',
          'The list of everything that could go wrong along the way',
        ],
        answer: 0,
        explanation: 'The happy path is the case where nothing goes wrong. What goes wrong is the unhappy paths, written as “what if” branches.',
      },
      {
        id: 'ai-project-planning-03-q6',
        audience: { min: 'advanced' },
        prompt: 'Two patients confirm the same slot within the same second, and the interface’s “is it free?” check passes for both. Where must double booking be prevented?',
        choices: [
          'In the interface, by refreshing the list of free times every few seconds so that stale times are rarely shown to anyone at all',
          'In the data layer, with a rule refusing two active bookings for one doctor and time; the app shows the loser a friendly message',
          'In the agent’s instructions, by telling it never to write code that could double-book',
          'By locking the whole booking page for everyone while anyone is in the middle of booking',
        ],
        answer: 1,
        explanation: 'Checks in the interface race each other. Only a constraint enforced where the data is saved is atomic. The application then turns the constraint error into the “just taken” branch.',
      },
    ],
    task: {
      title: 'Write the flows and screens for your app',
      minutes: 20,
      steps: [
        'List your app’s people and their jobs, using the clinic’s “people and jobs” block as a model. Keep to the jobs inside your scope.',
        'Pick the most important job and write its happy path as numbered steps, one action per step.',
        'Run the “what could go wrong” prompt on it. Keep at least three branches, and write what the person sees for each.',
        'Ask AI to draw the flow as a Mermaid flowchart and list the screens. Cross out anything your scope statement rules out.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain this flowchart to me like I am new to this, one box at a time.” Check that every diamond has two arrows leaving it, and add one if not.'] },
      { audience: { min: 'advanced' }, steps: ['Write the state-transition table for your main entity (which states, which transitions are legal, who may trigger each) and a permission matrix. State in one sentence where each uniqueness or ownership rule will be enforced.'] },
    ],
  },
  {
    id: 'ai-project-planning-04',
    day: 4,
    title: 'Features, priorities and milestones',
    summary: 'Pull features out of your flows, label them must, should or could, find what depends on what, and order the work into milestones you can demo.',
    minutes: 28,
    skills: ['prioritise-features', 'milestones'],
    intro: {
      objectives: [
        'List features from flows and label each one must, should, could or won’t',
        'Find the hidden dependencies that make a milestone plan impossible',
        'Write milestones as “you can show…” statements with a done-when check',
      ],
      why: 'AI can build any feature quickly, so the real question is which features, in which order. A plan that puts musts first and respects dependencies is the difference between a working first version and a pile of half-finished parts.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **feature** is one thing the app can do, named as a verb the person cares about: “book a time”, not “appointments table”. Think of packing for a trip. Your passport is a must: without it the trip simply does not happen. Sunscreen is something you should bring: you can buy it there, but it hurts to forget. A second pair of sunglasses is a could. Nobody packs the snorkel set for a city weekend, so it stays home (a won’t, this time). Choosing which features go in the bag, and in what order you pack them, is what this lesson is about.',
      },
      {
        type: 'paragraph',
        text: 'Start by pulling features out of your flows. Walk each step and ask: **what must the app be able to do here?** Step 4 of the booking flow (“see the free 30-minute times”) needs a feature that works out which times are free. Step 9 needs one that sends an email. Give each feature an id (F1, F2, …) so you can refer to it in prompts. Then give each a priority. A common set of labels is **must, should, could and won’t (this time)**:',
      },
      {
        type: 'list',
        items: [
          '**Must:** without it, version 1 fails its one job and there is no acceptable workaround.',
          '**Should:** important and painful to skip, but there is a workaround for now (for example, phone the clinic).',
          '**Could:** nice to have, only if there is time. Parking these is how you protect the musts.',
          '**Won’t (this time):** agreed not for version 1. This is your out-of-scope list, kept visible.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The test that makes these labels honest is the **workaround question**: “What would the clinic do on day one if this were missing?” If the answer is “they could not take bookings”, it is a must. If it is “Ate Joy would cancel it for the patient by hand”, it is a should. Notice a subtle pair in the clinic’s list below: a patient cancelling from an email link is only a *should*, but only because staff cancelling a booking is a *must*. The workaround has to exist, or the feature it covers for becomes a must. And if everything is a must, nothing is: that is a sign to ask the workaround question again.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'FEATURE LIST: Maliwanag Family Clinic, version 1 (copy and adapt)',
        code: `FEATURE LIST: Maliwanag Family Clinic, version 1
ID   Feature                                                 Priority  Needs
F1   Doctor weekly hours stored (set in a settings file)     Must      -
F2   Show free times for a doctor and day                    Must      F1
F3   Book a time (hold it, refuse a double booking)          Must      F2
F4   Confirmation screen with a booking code                 Must      F3
F5   Staff sign in                                           Must      -
F6   Staff day list                                          Must      F3, F5
F7   Staff cancel a booking                                  Must      F6
F8   Patient cancels from a link                             Should    F3
F9   Mark a visit arrived or no-show                         Should    F6
F10  Block one-off times (leave, emergencies)                Should    F1, F5
F11  Confirmation email                                      Should    F3
F12  Reminder email the day before                           Should    F11
F13  Reschedule in one step                                  Could     F8
F14  Waiting list for full days                              Could     F3
--   Online payment, medical records, video visits, SMS,
     patient accounts                                        Won't     (out of scope, version 1)`,
      },
      { type: 'heading', text: 'Dependencies: what has to exist first' },
      {
        type: 'paragraph',
        text: 'The last column of that list is the one beginners leave out. A **dependency** is something that has to exist before another thing can be built or tested: you cannot ice the cake before you bake it. F2 (show free times) needs F1 (the doctors’ hours), because you cannot know which times are free until you know when the doctor works. F6 (the staff day list) needs both F3 (there must be bookings to list) and F5 (staff must be able to sign in). Hidden dependencies sink plans: a milestone that looks small turns out to need three things from a later milestone. A quick test is to try to describe how you would demo a feature on its own. If you cannot, find what it needs.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Priorities are like deciding what goes in your bag when you can only carry one. A **must** is the thing you cannot leave without, a **should** is the thing you would be annoyed to forget, and a **could** is a treat. A **dependency** is the “first this, then that” of everyday life: you cannot ice a cake that is not baked, and you cannot put a plate on a table that has not been set. A **milestone** is like a stop on a bus route. You get off, look around, and check you are still going the right way. In a plan, a milestone is the moment you can show something that works, such as “I can book a time on my phone”, and decide what to do next with what you learned.',
      },
      { type: 'heading', text: 'Milestones: stops where you can show something' },
      {
        type: 'paragraph',
        text: 'A **milestone** is a stop on the road where you can show something working and check whether the plan still matches reality. It is not a date. Write each one as a sentence beginning “You can show…”, then add a “done when” check you can test by hand. Order them with three rules. First, dependencies decide the order: nothing comes before what it needs. Second, build the thinnest path that does the one job first, so you have something real early. Third, among what is left, do the riskiest or most uncertain things before the polish, because a surprise early is cheap and a surprise late is not.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'MILESTONE PLAN: Maliwanag Family Clinic (copy and adapt)',
        code: `MILESTONE PLAN
M0 Set up and decide. Features: F1.
   You can show: the booking page opens at a real web address on your phone, and a test record
   can be saved and read back.
   Done when: the assumptions about hosting and email are written down, each with a result.
M1 A patient can book. Features: F2, F3, F4.
   You can show: on a phone, choose a doctor, day and time, confirm, and see a booking code.
   Two phones choosing the same time: one succeeds, one is told it was just taken.
   Done when: the two-phone test passes five times in a row.
M2 The front desk can run the day. Features: F5, F6, F7, F9.
   You can show: Ate Joy signs in on the desk computer, sees tomorrow's list, cancels one booking,
   and the time can be booked again.
   Done when: Ate Joy has used it for one pretend day and said what confused her.
M3 Safe to pilot. Features: F8, F10, F11, plus error and empty screens and the access check.
   You can show: a patient cancels from an email link; blocked times disappear from the list;
   a stranger cannot open anyone else's booking.
   Done when: one real week alongside the notebook, with nobody double-booked.
M4 Fewer no-shows. Features: F12.
   You can show: tomorrow's patients receive a reminder email this morning.
   Done when: reminders reach a patient's own email address, not only a test inbox.
PARKED (could): F13, F14.`,
      },
      { type: 'heading', text: 'Let AI argue with your priorities' },
      {
        type: 'prompt',
        label: 'Prompt: challenge my priorities and dependencies (paste your feature list under it)',
        text: 'Here is my feature list for version 1, with priorities and what each feature needs. (1) For each Must, tell me what would happen on day one without it and whether a workaround exists. Name any Must that could be a Should. (2) Find any dependency I have missed, including hidden ones two steps away, and any cycle. (3) Suggest an order of milestones where each one ends with something I can demo on a phone. Do not change my priorities yourself: list your arguments and I will decide.',
      },
      {
        type: 'tip',
        text: 'If the AI says none of your musts could be a should, push back once: “Argue the opposite. Which Must would the clinic survive without for a month?” A planning partner earns its place by disagreeing with you, not by agreeing.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the feature list as a dependency graph and find its critical path: here, F1, F2, F3, F4 for “a patient can book”, and F5, F6, F7 beside it for “the desk can run the day”. Prefer vertical slices (a thin path through every layer that does one job) to horizontal layers (all tables, then all screens), because a slice can be demoed, tested and rolled back on its own. Sequence by risk reduction as well as value: put the riskiest assumption, here whether reminder email reaches non-team addresses, early enough to learn cheaply. Feature flags let you merge unfinished work without releasing it. For parallel work, whether by a team or by agents on separate branches, split along edges of the graph that share no files or data, and remember that every parallel stream arrives as a diff someone must review, so review capacity, not generation speed, bounds your parallelism. The Scrum Guide calls the backlog an ordered list and says refinement breaks items into smaller, more precise ones, which is the same discipline.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        audience: { min: 'advanced' },
        caption: 'The clinic’s dependency graph. An arrow means “is needed by”. The two chains that end in a demo are the critical paths of M1 and M2.',
        source: `flowchart LR
  F1[F1 Doctor hours] --> F2[F2 Free times]
  F2 --> F3[F3 Book a time]
  F3 --> F4[F4 Confirmation screen]
  F3 --> F6[F6 Staff day list]
  F5[F5 Staff sign in] --> F6
  F6 --> F7[F7 Staff cancel]
  F6 --> F9[F9 Arrived or no-show]
  F3 --> F8[F8 Patient cancel link]
  F3 --> F11[F11 Confirmation email]
  F11 --> F12[F12 Reminder email]
  F1 --> F10[F10 Block one-off times]
  F5 --> F10`,
      },
      {
        type: 'version',
        text: 'The Scrum Guide defines the Product Backlog as an emergent, ordered list, describes refinement as the ongoing act of breaking items down and making them more precise, and says the Developers who will do the work are responsible for sizing. Checked against the guide on this date. The must, should, could and won’t labels are a widely used technique rather than part of a standard, so treat the exact wording as a convention you agree with your team.',
        checked: CHECKED,
        sources: [DOCS.scrumGuide],
      },
      {
        type: 'takeaways',
        items: [
          'A feature is one thing the app can do, named as a verb the person cares about, and it should trace back to a step in a flow.',
          'Label features must, should, could or won’t, and use the workaround question: what would the clinic do on day one without it?',
          'A dependency is what has to exist first. Write a “needs” column, because hidden dependencies sink milestone plans.',
          'A milestone is a stop where you can show something working, written as “you can show…” with a done-when check, not as a date.',
          'Order by dependency first, thinnest working path second, and riskiest unknowns before polish. Ask AI to argue with your priorities, and decide yourself.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'Find the hidden dependency',
          prompt: 'An AI drafted this plan for a carwash booking page. Each feature lists what it needs first. One milestone cannot be finished in the order given because of a dependency that is two steps away. Tap the line that is wrong, then choose the best fix.',
          concept: 'hidden dependencies in a milestone plan',
          language: 'text',
          code: `PLAN: Booking page for Kuya Ben's carwash (first draft from an AI)
Features, and what each needs first:
 F1 Show free time slots for a bay        needs: F6
 F2 Book a slot                           needs: F1
 F3 Show a booking confirmation           needs: F2
 F4 Staff sign in                         needs: nothing
 F5 Staff see today's bookings            needs: F2, F4
 F6 Set the opening hours of each bay     needs: F4
Constraint: customers must be able to book within the first week. Opening hours may live in a settings file until staff screens exist.
Milestone 1: Customers can book a slot (F1, F2, F3)
Milestone 2: Staff can sign in and see bookings (F4, F5, F6)`,
          bugLine: 10,
          lineNote: 'The “needs” lines are facts about the features: F1 really does need opening hours. The problem is how the milestones group the features, so look at the lines that start with Milestone.',
          fixes: [
            { line: 'Milestone 1: Customers can book a slot, with opening hours read from a settings file (F1, F2, F3)', correct: true, why: 'F1 needs F6, and F6 needs F4, both in Milestone 2. The constraint lets opening hours sit in a settings file for now, which removes the chain and keeps Milestone 1 small enough for the first week.' },
            { line: 'Milestone 1: Customers can book a slot once staff have set opening hours (F4, F6, F1, F2, F3)', correct: false, why: 'This does satisfy the dependency, but it pulls staff sign-in and an opening-hours screen into Milestone 1, which breaks the constraint of customers booking within the first week.' },
            { line: 'Milestone 1: Customers can book a slot (F2, F3)', correct: false, why: 'Removing F1 hides the problem: F2 needs F1, so customers cannot see free slots and nothing can be booked or demoed.' },
            { line: 'Milestone 1: Staff can sign in and see bookings (F4, F5)', correct: false, why: 'F5 needs F2, so staff would have no bookings to see, and customers still could not book in the first week.' },
          ],
          hints: [
            'Follow the “needs” chain from F1: what does it need, and what does that need?',
            'F1 needs F6, F6 needs F4, and both F6 and F4 are in Milestone 2.',
            'The constraint line says opening hours may live in a settings file until staff screens exist. Use it.',
          ],
          explanation: 'F1 needs F6, which needs F4, so Milestone 1 secretly depends on Milestone 2. The constraint gives a way to cut that chain: keep opening hours in a settings file for now. Always trace a feature’s “needs” two or three steps before trusting a milestone.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-04-match-1',
          kind: 'match',
          title: 'Label the clinic’s features',
          prompt: 'Use the workaround question (“what would the clinic do on day one without it?”) to match each feature to its priority label.',
          concept: 'must, should, could, won’t',
          labels: { terms: 'Feature', meanings: 'Priority label' },
          pairs: [
            { term: 'A patient picks a free time on their phone and books it', definition: 'Must: version 1 fails its one job without it', note: 'This is the one job. With no way to book, there is nothing to run.' },
            { term: 'A patient cancels from a link in the email (the front desk can already cancel after a phone call)', definition: 'Should: painful to skip, but a workaround exists', note: 'A workaround exists, so it is not a must, but it would hurt to skip.' },
            { term: 'A waiting list that tells patients when a full day opens up', definition: 'Could: nice to have if time allows', note: 'Nothing breaks without it, and patients can simply check again later.' },
            { term: 'Online deposit payment to cut down on no-shows', definition: 'Won’t (this time): agreed not for version 1', note: 'Money rules are costly to get right and version 1 works without them: it is on the out list.' },
          ],
          hints: [
            'For each feature, ask what the clinic would do on day one if it did not exist.',
            'If the app cannot do its job at all without it, it is a must. If staff can cover by hand, it is a should.',
            'Payment is on the out-of-scope list from lesson 2, so it is a won’t for now.',
          ],
          explanation: 'The workaround question separates the labels: no workaround and the job fails means must; a workaround means should; nothing breaks means could; and agreed-not-now means won’t.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-04-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Three planning words',
          prompt: 'Tap each card to check you can explain it with an everyday example.',
          concept: 'priority, dependency, milestone',
          cards: [
            { front: 'Priority', back: 'How important a feature is for version 1: must, should, could or won’t (this time). Like deciding what goes in your bag.' },
            { front: 'Dependency', back: 'Something that has to exist before another thing can be built, like baking the cake before icing it.' },
            { front: 'Milestone', back: 'A stop on the road where you can show something that works and check you are still heading the right way. Not a date.' },
          ],
          hints: ['Match each word with the packing, baking and bus-stop pictures from the lesson.'],
          explanation: 'Priority says what matters most, dependency says what comes first, and a milestone is a checkpoint you can demo. Together they turn a wish list into an order of work.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-04-q1',
        prompt: 'Patients cancelling from an email link is a feature, but front-desk staff can already cancel a booking for a patient who phoned. Which label fits the patient link best?',
        choices: [
          'Must: cancelling is part of the one job and nothing at all can be released without it being finished',
          'Won’t: any feature that involves cancelling is automatically left out of version 1',
          'Could: it is a luxury, and nobody at the clinic would notice if it were missing',
          'Should: it is painful to skip, but staff cancelling by hand is a workaround for now',
        ],
        answer: 3,
        explanation: 'A workaround exists (staff cancel), so it is not a must, but it would hurt to skip because staff time is spent on it. That is a should.',
      },
      {
        id: 'ai-project-planning-04-q2',
        prompt: 'What is the main purpose of a milestone in this lesson?',
        choices: [
          'A date promised to the client, after which the project is late and the client is entitled to complain',
          'A stop where you can show something working and check whether the plan still matches reality',
          'The complete list of features that are still left to build in the project',
          'A reward step where the AI assistant reports that it has finished its task',
        ],
        answer: 1,
        explanation: 'A milestone is a demoable stop, written as “you can show…” with a done-when check. It is not a promised date and not a to-do list.',
      },
      {
        id: 'ai-project-planning-04-q3',
        prompt: 'In the clinic’s plan, F6 (staff day list) needs F3 (book a time) and F5 (staff sign in). An AI proposes F6 as the first thing to build. What is wrong with that?',
        choices: [
          'Nothing is wrong: the day list is the most important screen for the front desk, so it should come first',
          'It is the longest feature, and long features should always be built last',
          'F6 needs F3 and F5, which do not exist yet, so build what it needs first',
          'The AI is not allowed to propose an order of work until you have confirmed it',
        ],
        answer: 2,
        explanation: 'A list of bookings is empty until bookings can be made, and staff cannot see it until they can sign in. Building a feature before its dependencies leaves nothing to demo or test.',
      },
      {
        id: 'ai-project-planning-04-q4',
        prompt: 'Every feature on your list has been marked Must. What is the best next step?',
        choices: [
          'Ask what would happen on day one without each item, and move those with a workaround to Should',
          'Ask the AI to choose all the priorities for you, because it has seen many similar projects before in its training',
          'Add a fifth label such as “Critical” so the really important musts stand out from the others',
          'Start building them all at once, since a Must is something you cannot postpone',
        ],
        answer: 0,
        explanation: 'If everything is a must, nothing is. The workaround question exposes the items the project could survive without on day one.',
      },
      {
        id: 'ai-project-planning-04-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a “dependency” in a project plan?',
        choices: [
          'A feature that people use every single day, so that they come to depend on the app for it',
          'A tool or service that you have to pay for every month',
          'Something that must exist before another thing can be built, like baking before icing',
        ],
        answer: 2,
        explanation: 'A dependency is a “first this, then that”. Listing what each feature needs prevents a milestone from being impossible to finish.',
      },
      {
        id: 'ai-project-planning-04-q6',
        audience: { min: 'advanced' },
        prompt: 'Your plan has a chain F1, F2, F3 for the core path and an uncertain external email service. Which sequencing is most defensible?',
        choices: [
          'Slice vertically so a thin end-to-end path works first, and test the email unknown early enough to learn cheaply',
          'Build all the tables first, then all the screens, then all the logic, so that each layer is complete before the next layer starts',
          'Leave the email service until the end, since it is only used by a Should-level feature',
          'Give each of three agents a different layer and merge their work at the end of the week',
        ],
        answer: 0,
        explanation: 'A vertical slice is demoable and reversible, and an early test of the riskiest unknown is cheap while a late surprise is not. Layer-by-layer work postpones the first demo, and merging parallel streams late concentrates review.',
      },
    ],
    task: {
      title: 'Prioritise your features and plan your milestones',
      minutes: 20,
      steps: [
        'From your flows, list every feature with an id. Aim for 8 to 14 for version 1.',
        'Label each feature must, should, could or won’t. Use the workaround question and write the workaround next to each should.',
        'Add a “needs” column and trace each feature’s needs two steps back. Fix any feature that needs something later.',
        'Write three to five milestones as “you can show…” sentences with a done-when check. Paste everything into an AI and run the “challenge my priorities” prompt, then decide what to change.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Limit yourself to six features and only three musts. Ask the AI to explain each label with an everyday example before you assign it.'] },
      { audience: { min: 'advanced' }, steps: ['Draw the dependency graph, mark the critical path and tag each milestone with the riskiest assumption it tests. Note which streams could run in parallel and who or what would review each diff.'] },
    ],
  },
  {
    id: 'ai-project-planning-05',
    day: 5,
    title: 'Risks and unknowns',
    summary: 'Write down what could go wrong, ask AI to attack your plan, and check the tool limits it depends on in the official documentation.',
    minutes: 30,
    skills: ['risk-register', 'feasibility-checks', 'planning-partner'],
    intro: {
      objectives: [
        'Write a risk register with likelihood, impact, an early warning sign and a response',
        'Use AI to find what could go wrong, then verify its claims about tool limits yourself',
        'Choose which risk or unknown to deal with first',
      ],
      why: 'Projects rarely fail from the risks everybody talked about. They fail from the limit nobody checked. AI is a fast critic but a poor source of facts, so you learn to use it for the first and the official documentation for the second.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Before a picnic you think: “What if it rains?” You pack a tarp. You do not think: “What if nobody brings the charcoal?” and so the grilling never happens. A **risk** is something that might go wrong. An **unknown** is something you do not yet know that could change the plan, such as whether the park allows grills. Planning for risks does not mean being negative. It means that when the rain comes, you already have a tarp, and when the charcoal is missing, you have noticed in the morning and not at the park. Every risk has two sizes (**likelihood**: how probable, and **impact**: how bad) plus an **early warning sign** that tells you it is starting to happen.',
      },
      {
        type: 'paragraph',
        text: 'Risks come from a handful of places, and it helps to look in each on purpose. **People:** will the front desk actually use it? **Tools and platform limits:** what do the hosting, email and database plans really allow? **Data and legal:** what may you collect and who is responsible for it? **Technical:** the genuinely hard parts, like two people booking at once. **Time and money.** And, with AI in the project, a few that are new: the AI may state a limit confidently when it is out of date or wrong, produce code you cannot explain, add things you did not ask for, or tempt you to paste private data into a chat. Write each one in a **risk register**, a short list with a planned response.',
      },
      { type: 'heading', text: 'Four responses to a risk' },
      {
        type: 'list',
        items: [
          '**Avoid:** change the plan so the risk cannot happen.',
          '**Reduce:** make it less likely or less harmful.',
          '**Test:** find out cheaply before you decide, with a **spike**: a short experiment, limited to an hour or two, that answers one question.',
          '**Accept:** knowingly live with it, and write down when you will look again.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Which risk first? Not simply the biggest. Do first the ones that could change your design, that you can find out about cheaply, and that cost more the later you learn them. A high-impact unknown that a one-hour test can settle beats a high-impact problem you already know how to solve.',
      },
      { type: 'heading', text: 'Make AI attack the plan, then check its facts' },
      {
        type: 'prompt',
        label: 'Prompt: a pre-mortem (paste your scope, flows, features and milestones under it)',
        text: 'Imagine it is three months from now and this project has failed. Using the plan below, list 12 reasons it failed, grouped as people, tools and platform limits, data and legal, technical, and time. For each reason give an early warning sign I could notice. Mark clearly each one where you are guessing or may be out of date.',
      },
      {
        type: 'prompt',
        label: 'Prompt: turn my plan into claims I can check',
        text: 'List every external tool, service or platform limit my plan depends on, one per line, written as a claim I can look up. For example: “the hosting plan can run a job every hour”. Do not tell me whether each claim is true. I will check each one in the official documentation myself.',
      },
      {
        type: 'paragraph',
        text: 'The second prompt is the important one. An AI is a good critic and a poor reference. Its memory of plan limits and prices can be old, and it says an outdated fact in the same confident voice as a current one. So you split the work: AI lists the claims, you verify them in the vendor’s own documentation. The routine takes minutes per claim.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Find the vendor’s own documentation page for the exact plan you will use, not a blog post or a forum answer.',
          'Find the specific limit or rule and copy it with the date you read it.',
          'If the page is unclear, run the smallest test that answers it (send one email, deploy one job).',
          'Write the result, the source and the date into the risk register, and decide what changes.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Here is what that looked like for the clinic. The first draft of the plan, written with an AI’s help, assumed four things. Each was looked up in official documentation on 14 November 2026.',
      },
      {
        type: 'table',
        headers: ['Assumption in the draft plan', 'What the official docs said', 'What the plan changes'],
        rows: [
          ['Reminders run from an hourly job on the free hosting plan', 'Vercel’s Hobby plan allows cron jobs only once per day, with timing precision of about an hour, and refuses more frequent schedules at deployment', 'One daily job each morning sends tomorrow’s reminders (risk R4)'],
          ['Emails go out through the database service’s built-in sender', 'Supabase’s default email service sends only to pre-authorised team addresses, is best-effort and is described as not meant for production', 'Choose a real email sender before M3, and test it in M0 (risk R3)'],
          ['The free database is always running', 'Supabase says it may pause Free Plan projects that show low activity in a 7-day period', 'Decide before the pilot: a plan that is not paused, or a daily check (risk R5)'],
          ['Patients will get push notifications on their iPhones', 'On iOS and iPadOS, web push needs iOS or iPadOS 16.4 or later and a site added to the Home Screen', 'A patient who books once will not install anything: use email, not push'],
        ],
        caption: 'Four assumptions, checked against official pages on 2026-11-14. Limits change, so each check carries a date.',
      },
      {
        type: 'paragraph',
        text: 'None of those four checks showed that the project was impossible. Each showed that the draft plan was quietly wrong, and it took about an hour in total to learn it, instead of in week six with reminders already built around hourly runs. That is the whole point of checking early. Here is the register that came out of it.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'RISK REGISTER: Maliwanag Family Clinic (copy and adapt)',
        code: `RISK REGISTER: Maliwanag Family Clinic (likelihood and impact: low, medium, high)

R1 Front desk keeps using the notebook | likelihood: medium | impact: high
   Warning sign: the notebook is still on the desk after week one of the pilot.
   Response (reduce, M2 and M3): Ate Joy tries M2 on a pretend day and we fix what confused her;
   the pilot runs beside the notebook.

R2 Two bookings for the same time when people book at once | likelihood: medium | impact: high
   Warning sign: in the two-phone test, both phones are told "booked".
   Response (reduce, M1): a database rule refuses a second active booking for the same doctor and
   time; the two-phone test must pass five times in a row.

R3 Confirmation and reminder emails do not reach patients | likelihood: high | impact: medium
   Warning sign: a test email to an address outside the team never arrives.
   Response (test, then avoid, M0 and M3): a one-hour spike sends one email to a non-team address;
   a proper email sender is chosen before M3.

R4 An hourly reminder job is refused by the free hosting plan | likelihood: high | impact: low
   Warning sign: the deployment fails with a message about cron schedules.
   Response (avoid, M4): reminders are one daily morning job; recheck the hosting docs before M4.

R5 The free database pauses when activity is low | likelihood: medium | impact: high
   Warning sign: the booking page shows an error after a quiet week.
   Response (accept while building, reduce before M3): pick a plan that is not paused, or add a
   daily check, before the pilot starts.

R6 A patient opens another patient's booking by changing a link or number | likelihood: medium | impact: high
   Warning sign: changing a number in the address shows someone else's booking.
   Response (reduce, M3): long random tokens in links, staff pages behind sign-in, and a test
   where we try to open other people's bookings.

R7 The legal duties for holding patient details are not known | likelihood: unknown | impact: high
   Warning sign: nobody at the clinic can say who is responsible for the data.
   Response (test, before M3): ask a person who knows (not the AI); collect only name, mobile and
   email; no health details.

R8 AI-written code nobody can explain | likelihood: medium | impact: medium
   Warning sign: you cannot say in one sentence what a file does.
   Response (reduce, every milestone): small slices, one commit each, ask the AI to explain each
   change, keep the project brief up to date.

R9 Scope creeps back (payments, records) | likelihood: high | impact: medium
   Warning sign: "just one more button" requests.
   Response (reduce, always): the Won't list with reasons, and a later list for good ideas.`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A **risk** is a “what if” that could spoil your plan, like rain at a picnic. **Likelihood** is how probable it is, and **impact** is how bad it would be. An **early warning sign** is the dark cloud: a small thing you can notice before the rain. An **unknown** is a question you cannot answer yet, like “does the park allow a grill?”, and the best response to many unknowns is a **spike**, which is just a tiny test you do straight away, such as sending one real email to find out whether it arrives. When an AI tells you what a tool can do, it is like a friend saying the park allows grills: they might be right, but you check the park’s own sign. The register is a list of dark clouds, each with a tarp ready.',
      },
      {
        type: 'warning',
        text: 'While planning, never paste real patient names, passwords or API keys into an AI chat. Invent sample data. A plan needs the shape of the information, not the real thing.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Rank by exposure (likelihood times impact) but sequence by information value: a time-boxed spike on a high-variance assumption beats mitigating a risk you already know how to handle. Record every vendor dependency with its plan limit, source and verification date, plus an exit path (how you would move away) so lock-in is a decision rather than a surprise, and re-verify before each milestone, because plans and limits change; the very page that gave the cron limit above also says cron jobs are a legacy feature that will move to a newer scheduling product. Convert accepted risks into monitored signals (a health check, an alert, a calendar date). Add abuse cases the happy path never mentions: guessing booking identifiers (OWASP lists broken access control first in its 2025 Top 10 and includes viewing or editing someone else’s record by supplying its identifier), spam bookings that fill a doctor’s day (rate limits, bot checks), and retention and deletion of personal data. Give each risk an owner and a trigger, and review the register at every milestone, not once.',
      },
      {
        type: 'version',
        text: 'Vercel’s documentation says cron jobs on the Hobby plan can run once per day with per-hour precision, and that expressions running more often fail at deployment; the same page notes cron jobs are a legacy feature that will migrate to Schedules, so recheck before relying on it. Supabase’s documentation says the default email service sends only to pre-authorised addresses in the project’s team, is best-effort and is not meant for production, and gave a limit of 2 messages per hour that it says can change; its production checklist says it may pause Free Plan projects with low activity in a 7-day period. Checked on this date; plans, limits and page contents change often.',
        checked: CHECKED,
        sources: [DOCS.vercelCron, DOCS.supabaseSmtp, DOCS.supabaseProd],
      },
      {
        type: 'version',
        text: 'WebKit’s announcement states that Web Push for Home Screen web apps arrived with iOS and iPadOS 16.4, requires the site to be added to the Home Screen as a web app, and requires the permission request to come from a direct user interaction. OWASP’s Top 10:2025 lists Broken Access Control as number one and names viewing or editing someone else’s account by supplying its unique identifier as a common weakness. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.webkitPush, DOCS.owaspA01],
      },
      {
        type: 'takeaways',
        items: [
          'A risk is something that might go wrong; an unknown is something you do not yet know. Each risk gets a likelihood, an impact, an early warning sign and a response.',
          'The four responses are avoid, reduce, test (a spike) and accept, and a risk register records which one you chose and when.',
          'Do first the unknowns that could change your design, can be checked cheaply and cost more the later you learn them.',
          'Use AI as a critic (pre-mortem, list of claims to check) but never as the source of facts about limits: verify in the vendor’s own documentation and write down the date.',
          'Never paste real personal data, passwords or keys into a planning chat.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-05-scenario-1',
          kind: 'scenario',
          title: 'Which risk first?',
          prompt: 'Choose the risk to deal with first.',
          concept: 'sequencing risks by information value',
          situation: 'You are about to start Milestone 0 for the clinic. Four things are on your mind. You already know a database rule will solve double booking. You do not know whether the email service will send to patients’ own addresses, and the confirmation emails and reminders depend on it. The colours of the page are not chosen. A competing booking app might appear someday.',
          options: [
            { text: 'Spend an hour sending one test email to an address outside the team, to find out whether email will reach patients.', consequence: 'You learn cheaply about an unknown that could change the whole reminder design. If it fails, you pick another email sender in week one, not in week six.', quality: 'best' },
            { text: 'Build and test the double-booking rule first, because it is the biggest risk to the clinic.', consequence: 'It is important and you will do it in Milestone 1 anyway, but you already know the answer, so it does not reduce your uncertainty yet.', quality: 'acceptable' },
            { text: 'Pick the colours and logo, so that the first demo looks professional.', consequence: 'The page looks nice and the largest unknown is untouched, so a surprise about email will still land late.', quality: 'poor' },
            { text: 'Research the competing app, in case it makes the clinic’s project pointless.', consequence: 'It is a possible risk, but it is unlikely, far away and not something you can test in an hour, so it is the wrong thing to spend week one on.', quality: 'poor' },
          ],
          hints: [
            'Which of the four has an answer you do not yet know, and could change the design?',
            'Look for the one you can find out about cheaply, right now.',
            'The email test takes about an hour and decides whether reminders can work at all.',
          ],
          explanation: 'Sequence by information value: an unknown that could change the design and costs an hour to check comes first. A known risk can wait for its milestone, and looks or distant competitors are not week-one risks.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-05-match-1',
          kind: 'match',
          title: 'Choose the response',
          prompt: 'Each line is a risk with the action that was taken. Match it to the type of response it is.',
          concept: 'avoid, reduce, test, accept',
          labels: { terms: 'What was done', meanings: 'Type of response' },
          pairs: [
            { term: 'The hosting plan allows only a daily job, so reminders are redesigned as one job each morning', definition: 'Avoid: change the plan so the risk cannot happen', note: 'The redesign removes the situation in which the refused hourly job could occur.' },
            { term: 'A database rule and a two-phone test are added so a double booking is unlikely and caught', definition: 'Reduce: make it less likely or less harmful', note: 'Double booking is still possible in principle, but the rule and test make it far less likely.' },
            { term: 'You do not know whether email reaches patients, so you send one real test email this afternoon', definition: 'Test: find out cheaply before deciding', note: 'A small experiment that answers one question is a spike.' },
            { term: 'The free database might pause after a quiet week while you build alone, so you note it and decide to revisit before the pilot', definition: 'Accept: knowingly live with it and write down when to look again', note: 'Nothing is changed for now, but the decision and the date to revisit are written down.' },
          ],
          hints: [
            'Ask whether the action removes the risk, shrinks it, investigates it or leaves it alone on purpose.',
            'Redesigning so the problem cannot occur is different from making it less likely.',
            'A spike is a small test; accepting means deliberately doing nothing yet.',
          ],
          explanation: 'Avoid removes the cause, reduce shrinks it, test finds out, and accept leaves it with a note to look again. A register should say which one you chose for each risk.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-05-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Risk words',
          prompt: 'Tap each card to check you can explain it with an everyday example.',
          concept: 'risk vocabulary',
          cards: [
            { front: 'Early warning sign', back: 'A small thing you can notice that tells you a risk is starting, like dark clouds before rain.' },
            { front: 'Unknown', back: 'A question you cannot answer yet that could change the plan, such as “does the email service send to patients?”.' },
            { front: 'Spike', back: 'A short, time-limited experiment that answers one question, like sending one real test email before you build on it.' },
            { front: 'Risk register', back: 'A short list of what could go wrong, how likely and how bad it is, what to watch for, and what you will do about it.' },
          ],
          hints: ['Match each word with the picnic example from the lesson.'],
          explanation: 'With these four words you can read any risk register and ask an AI for help in plain language.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-05-q1',
        prompt: 'An AI assistant tells you the free hosting plan can run a reminder job every hour. What should you do before building on it?',
        choices: [
          'Build on it: the AI would not state a number it was unsure about',
          'Treat it as a claim and find the limit in the provider’s own docs for your plan',
          'Ask a second AI assistant the same question and trust the answer if the two agree',
          'Search for a forum post from someone who used the same free plan last year',
        ],
        answer: 1,
        explanation: 'AI says out-of-date facts as confidently as current ones, and two assistants can share the same old information. The vendor’s documentation for your plan is the source, and you note the date.',
      },
      {
        id: 'ai-project-planning-05-q2',
        prompt: 'Which of these is a good “early warning sign” for the risk that confirmation emails do not reach patients?',
        choices: [
          'A test email sent to an address outside your team never arrives',
          'The project falls behind the milestone dates it was given and the client starts to ask why',
          'You feel worried about the email part of the plan',
          'The risk has been rated as high on the register',
        ],
        answer: 0,
        explanation: 'An early warning sign is something you can observe before the harm: a failed test email shows the risk is real while there is still time to change. Lateness is an outcome, and feelings and ratings are not observations.',
      },
      {
        id: 'ai-project-planning-05-q3',
        prompt: 'You do not know whether something is possible, and the answer would change your design. What is the best response?',
        choices: [
          'Start building and find out as you go, because the AI will work around any problem',
          'Ask the AI whether it is possible and write down its answer as a fact in the plan',
          'Leave it out of the register, because a risk with no known likelihood cannot be ranked',
          'Run a small time-boxed experiment (a spike) now, and find out cheaply before building',
        ],
        answer: 3,
        explanation: 'A spike turns an unknown into a fact for an hour of work. Finding out late costs a redesign, and an AI answer is a claim to check, not a fact.',
      },
      {
        id: 'ai-project-planning-05-q4',
        prompt: 'The hourly reminder job risk has high likelihood but low impact: the deployment simply fails with a clear message. Why is it still worth a line in the register?',
        choices: [
          'Registers must list every risk the AI mentions, however small, or they are not complete',
          'Low-impact risks automatically become high-impact if nobody has written them down',
          'It is cheap to avoid now with a daily job, and costly to find out after reminders are built around hourly runs',
          'The hosting company will charge extra if the plan assumes something its limits do not allow, and the bill arrives at the worst time',
        ],
        answer: 2,
        explanation: 'The cost of a risk depends on when you learn it. A likely, cheap-to-avoid risk costs one design decision now and a rebuild later.',
      },
      {
        id: 'ai-project-planning-05-q5',
        audience: { max: 'beginner' },
        prompt: 'What is an “early warning sign” in a risk register?',
        choices: [
          'The name of the person who is blamed when the risk happens',
          'A small thing you can notice that tells you a risk is starting to happen',
          'A prediction of exactly which day the problem will happen and how many people it will affect',
        ],
        answer: 1,
        explanation: 'It is the dark cloud before the rain: something you can observe now, which gives you time to act.',
      },
      {
        id: 'ai-project-planning-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Your plan depends on several free-plan limits of external vendors. Which practice keeps the plan honest over the life of the project?',
        choices: [
          'Store the AI’s summary of the limits in the agent’s instructions file so that all later work follows it',
          'Assume the limits are stable, because vendors rarely change their documentation',
          'Record each limit as a dated assumption with its source and re-verify before each milestone',
          'Ask the coding agent to check the limits once at the start of the project and trust the result',
        ],
        answer: 2,
        explanation: 'Plans and limits change, and the same docs page that gave one limit announced a move to a newer product. Dated, sourced assumptions that are re-verified at milestones turn silent drift into a visible check.',
      },
    ],
    task: {
      title: 'Build your risk register and verify two claims',
      minutes: 20,
      steps: [
        'Run the pre-mortem prompt on your scope, flows, features and milestones. Pick the six to nine most believable reasons and write each as a register entry with likelihood, impact, early warning sign and a response.',
        'Run the “turn my plan into claims” prompt. Choose two claims about tools or limits that your plan depends on.',
        'Verify each claim on the vendor’s own documentation page for the plan you would use. Copy the exact limit, the page link and today’s date into your register. If the page is unclear, note the smallest test that would answer it.',
        'Decide which one risk or unknown you would deal with first, and write one sentence on why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Keep to five risks. For each, ask the AI: “Explain this risk in plain words, and suggest the smallest test I could do today.” Pick the test you can really do this week.'] },
      { audience: { min: 'advanced' }, steps: ['Add an owner, a trigger and a review date to every risk, an exit path for each vendor dependency, and at least three abuse cases (identifier guessing, spam submissions, data retention). Add a calendar reminder to re-verify the vendor limits.'] },
    ],
  },
  {
    id: 'ai-project-planning-06',
    day: 6,
    title: 'Honest estimates with AI',
    summary: 'Give estimates as ranges with assumptions, and be honest about what AI speeds up, what it does not, and what the evidence really says.',
    minutes: 28,
    skills: ['honest-estimates', 'planning-partner'],
    intro: {
      objectives: [
        'Estimate each milestone as a range split into build, review and waiting time',
        'Explain what AI speeds up in a project and what it does not',
        'Answer “how long will it take?” with a range, its confidence and its assumptions',
      ],
      why: 'Everyone will tell you AI builds an app in a day, and a client or a boss will hold you to a number you gave in the first week. Honest estimates protect your reputation and your evenings, and they only take a few minutes to make.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'An **estimate** is an educated guess about how much effort something will take. It is not a promise. Think of baking a cake. A faster mixer makes the mixing quicker. It does nothing for the time the cake spends in the oven, nothing for waiting for the flour to be delivered, and nothing for the tasting and fixing at the end. AI is a faster mixer. It can speed up some parts of building software a great deal, and it leaves other parts exactly as long as they were. An honest estimate says which is which, instead of dividing everything by a magic number.',
      },
      {
        type: 'paragraph',
        text: 'Estimates go wrong for ordinary reasons. We picture the best case. We forget the time spent waiting for other people, fixing what was built and learning something new. And the unknowns from the last lesson turn out to cost something. A single number hides all of that, and whoever hears “two weeks” hears a promise. A **range** with its **assumptions** and a **confidence** (high, medium or low) tells the truth: it says how big the unknowns are and what would make it longer.',
      },
      { type: 'heading', text: 'What AI speeds up and what it does not' },
      {
        type: 'table',
        headers: ['Kind of work', 'Does AI speed it up?', 'Why'],
        rows: [
          ['Familiar, well-described code: forms, lists, standard screens', 'Often a lot', 'It is common work with a clear description, and you can see at once whether it runs'],
          ['First drafts of tests, copy and documentation', 'Yes', 'A draft is cheap to produce; you still read and correct it'],
          ['Deciding what to build, and which trade-off to take', 'No', 'It needs your goals, the clinic’s context and your judgement'],
          ['Reading, reviewing and checking what AI wrote', 'No, and it may add work', 'More code appears faster, and someone must still understand it'],
          ['Connecting real accounts, keys, email and hosting', 'Unpredictable', 'Real services have their own limits and surprises, as lesson 5 showed'],
          ['Waiting for others: account approval, domain checks, the clinic’s answers', 'No', 'It is calendar time that nobody on your side can shorten'],
        ],
        caption: 'The same project has all six. An estimate that treats it all as the first row is the one that goes wrong.',
      },
      {
        type: 'paragraph',
        text: 'How much faster AI makes a whole project is genuinely unclear, and you should be wary of anyone who gives a confident multiplier. One controlled experiment run by GitHub gave 95 professional developers a single task, writing an HTTP server in JavaScript. Those with the assistant finished faster (about 1 hour 11 minutes against about 2 hours 41 minutes on average), though the study’s own confidence interval for the speed-up was wide, it covered one task in one language with an early tool, and the people who ran it work for the vendor. On the other side, the DORA research programme reports that higher AI adoption was associated with lower delivery throughput and lower delivery stability, and explains the pattern as larger batches of code that are slower to review and riskier to ship, while its later summary calls AI an amplifier of an organisation’s existing strengths and weaknesses. The honest reading is that speed on one narrow task is not speed on a whole project, and that review and verification are where the time can move to.',
      },
      {
        type: 'warning',
        text: 'Do not write “AI makes this five times faster” in a plan. You have no evidence for your project yet. Estimate in ranges now, finish the first milestone, and let your own actual hours tell you how fast you really go.',
      },
      { type: 'heading', text: 'How to estimate a milestone' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Break it down:** split each milestone into tasks small enough to finish in a day or less.',
          '**Use three columns:** build with AI (hours), review, test and fix (hours), and waiting on others (days). AI mostly changes only the first.',
          '**Give a range:** the smallest realistic number and the number if some things go wrong.',
          '**Write the assumption and a confidence** beside each line. Low confidence means a big unknown is hiding in it.',
          '**Add the ranges:** add the lows together and the highs together. Never average a range into one number.',
          '**Compare with reality** after the first milestone and rescale the rest. Your own data beats any rule of thumb.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        label: 'ESTIMATE: Maliwanag Family Clinic (invented numbers for illustration, not benchmarks)',
        code: `ESTIMATE: Maliwanag Family Clinic. One part-time builder, 8 hours a week.
These hours are INVENTED to show the shape. Yours will differ.

Milestone  Build (AI)  Review, test, fix  Waiting on others  Confidence
M0         2-4 h       1-3 h              0-1 day            medium
M1         4-8 h       4-8 h              none               medium
M2         4-8 h       3-6 h              none               medium
M3         5-10 h      5-10 h             0-3 days           low
M4         2-5 h       2-4 h              0-2 days           low
TOTAL      17-35 h     15-31 h            0-6 days

Biggest assumption behind each line:
M0 Accounts open the same day and the free tiers are enough.
M1 The two-phone test passes once the database rule is in.
M2 Ate Joy can try it on a pretend day this week.
M3 The email sender verifies quickly and the legal answer arrives.
M4 The daily reminder job runs on the plan we picked.`,
      },
      {
        type: 'paragraph',
        text: 'Check the arithmetic: the build column adds up to 2+4+4+5+2 = 17 hours at the low end and 4+8+8+10+5 = 35 at the high end. Look at what the table does not say. It has no line that divides anything by an AI multiplier. AI’s help is inside the build column and will show up in the real numbers after M1. For the pilot-ready point (M3), your hours are 28 to 57 (build 15 to 30, review 13 to 27). At 8 hours a week that is between about 3.5 and 7 weeks, plus up to 4 days of waiting that can overlap with work. So this is what you tell the clinic.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'THE ESTIMATE SENTENCE (copy and adapt)',
        code: `A pilot-ready version (M3) will probably take 4 to 7 weeks at about 8 hours a week, with low
confidence for the last part. That assumes the email sender verifies quickly and the clinic's
answer about patient data arrives in time. AI speeds up the drafting; it does not shorten the
waiting or the checking. I will re-estimate after M1 using the hours it actually took.`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** An **estimate** is your best guess of how long something will take, and a **range** is two numbers that say “somewhere between this and this”. An **assumption** is something you are counting on, like “the delivery arrives on Monday”, and **confidence** is how much you trust the guess. A faster mixer (the AI) speeds up the mixing part of the cake. It cannot make the oven hotter, make the flour arrive sooner, or taste the cake for you. So you split your estimate into the mixing (build with AI), the tasting and fixing (review, test and fix) and the waiting. Then you add the lows together and the highs together. Giving a friend a range such as “four to seven weeks” is not weak. It is honest, and it protects you both.',
      },
      {
        type: 'prompt',
        label: 'Prompt: a first-draft estimate to challenge (paste your milestone plan under it)',
        text: 'For each milestone below, give a range in hours for building with AI, a range for review, testing and fixing, and a range in days for waiting on other people. State the assumption behind each range and your confidence. Then list the three tasks you are least sure about and say what would make each one take three times longer. Do not give single numbers and do not apply any AI speed-up multiplier.',
      },
      {
        type: 'paragraph',
        text: 'Treat the AI’s answer as a first draft. It does not know your speed, your accounts or your clinic, so its numbers are generic. The most useful part is usually the last: “what would make this take three times longer”. Compare its answers with your risk register, and if the AI names a cause that is not in the register, you have found a missing risk.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Prefer observed throughput and cycle time to story points, and forecast from a reference class of your own past work, not from a generic number. AI shifts where time goes: generation gets cheap while review, verification and integration do not, and DORA’s reported association of higher AI adoption with larger batches and lower stability is a reason to keep slices small and to cap work in progress at your review capacity, since every parallel agent run lands as a diff that a person must read. Estimate review and verification explicitly, treat the usage limits and quotas of your AI plans as scheduling constraints (check the vendor’s documentation for the current ones), and agree re-plan triggers with stakeholders, for example “if M1 actuals exceed the high end, we re-scope M2 and M3 before continuing”. Communicate a range, its confidence and its drivers, never a single date.',
      },
      {
        type: 'version',
        text: 'GitHub’s 2022 research post describes a controlled experiment with 95 professional developers writing an HTTP server in JavaScript, in which the group with Copilot finished faster; it reports a wide confidence interval for the speed-up and notes the study covers one task and was run by GitHub’s own researchers. DORA’s generative AI research page words its finding as associations (a 25% increase in AI adoption associated with a 1.5% decrease in delivery throughput and a 7.2% decrease in delivery stability) and attributes it to larger batch sizes, and its 2025 report page describes AI’s primary role as an amplifier. Research findings change as tools change: treat these as dated evidence, not as a rule. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.copilotStudy, DOCS.doraGenAi, DOCS.doraReport],
      },
      {
        type: 'takeaways',
        items: [
          'An estimate is an educated guess given as a range, with assumptions and a confidence, not a promise.',
          'AI mostly speeds up drafting familiar code. Deciding, reviewing, integrating real services and waiting on others stay as long as they were.',
          'The evidence on whole-project speed is mixed and depends on the task, so never invent a multiplier: measure your own first milestone.',
          'Estimate three columns (build with AI, review and fix, waiting), add lows to lows and highs to highs, and write the assumption behind each line.',
          'Tell people a range with its confidence and what it assumes, and re-estimate after the first milestone.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-06-match-1',
          kind: 'match',
          title: 'Which column does it belong in?',
          prompt: 'Each line is a piece of work from a project. Match it to the part of the estimate where its time belongs.',
          concept: 'what AI speeds up and what it does not',
          labels: { terms: 'The work', meanings: 'Where its time belongs' },
          pairs: [
            { term: 'Asking an AI to draft the screen that lists a doctor’s free times', definition: 'Build with AI: a draft the assistant can produce quickly', note: 'Familiar screen with a clear description: this is what AI speeds up.' },
            { term: 'Booking five test visits to check that the times show in Philippine time', definition: 'Review, test and fix: checking what was built', note: 'Checking and correcting is your work and AI does not remove it.' },
            { term: 'The email provider needs two days to verify your sending domain', definition: 'Waiting on others: calendar days outside your control', note: 'Nobody on your side can shorten it, whatever tool you use.' },
            { term: 'Choosing whether reminders go out the day before or on the morning of the visit', definition: 'A decision only you can make, before any hours are counted', note: 'AI can list trade-offs, but the choice depends on your clinic.' },
          ],
          hints: [
            'Ask who or what is spending the time: the assistant, you checking, someone else, or you deciding.',
            'Waiting is the time you cannot shorten; reviewing is the time you spend reading and testing.',
            'Drafting a familiar screen is the build column; the domain check is waiting.',
          ],
          explanation: 'Splitting an estimate by who is spending the time shows where AI helps (drafting) and where it does not (checking, waiting, deciding).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-06-predict-output-1',
          kind: 'predict-output',
          title: 'Add the ranges',
          prompt: 'These are the build estimates for three milestones. What is the total range in hours? Remember: add lows to lows and highs to highs.',
          concept: 'adding estimate ranges',
          language: 'text',
          code: `M0 build:  2-4 h
M1 build:  4-8 h
M2 build:  4-8 h
TOTAL build: ?`,
          expected: '10-20 h',
          choices: ['10-20 h', '2-8 h', '15 h', '6-12 h'],
          wrongNotes: {
            '2-8 h': 'That is the lowest low to the highest high of any single milestone. Ranges add: three milestones take longer than the longest one.',
            '15 h': 'A single middle number hides the range, which is exactly the information that makes an estimate honest.',
            '6-12 h': 'That halves the real total. Add the three lows (2+4+4) and the three highs (4+8+8).',
          },
          hints: [
            'Add the three low numbers together first.',
            'Then add the three high numbers together separately.',
            '2+4+4 = 10 and 4+8+8 = 20.',
          ],
          explanation: 'Lows add to 2+4+4 = 10 and highs to 4+8+8 = 20, so the total is 10 to 20 hours. Reporting the range, not a middle number, keeps the uncertainty visible.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-06-scenario-1',
          kind: 'scenario',
          title: '“Just give me one date”',
          prompt: 'Choose your answer to the clinic owner.',
          concept: 'communicating an estimate',
          situation: 'The clinic owner says: “Everyone says AI can build an app in a day. Just give me one date for the pilot, and don’t make it complicated.” Your estimate says 4 to 7 weeks for the pilot-ready version with low confidence for the last part.',
          options: [
            { text: 'Give the range, say what it assumes, explain what AI speeds up and what it cannot (waiting, checking), and promise to re-estimate after the first milestone.', consequence: 'He knows what to plan for, understands the two big assumptions, and trusts you more when the first re-estimate arrives on time.', quality: 'best' },
            { text: 'Say “two weeks” to keep him happy, since AI is fast.', consequence: 'You have made a promise on no evidence. When week three arrives the project is “late”, though nothing went wrong.', quality: 'poor' },
            { text: 'Tell him AI makes everything five times faster, so it is about one week.', consequence: 'There is no evidence for that multiplier on your project, and it ignores waiting, review and unknowns.', quality: 'poor' },
            { text: 'Give him only the highest number, “seven weeks”, with no explanation, to be safe.', consequence: 'It is safer for you, but he cannot see what it depends on and cannot help you shorten it. It also hides that part of it is uncertain.', quality: 'acceptable' },
          ],
          hints: [
            'What does he need to know to plan, besides a number?',
            'A range with its assumptions can be checked and updated; a single number cannot.',
            'Say the range, what it assumes, what AI does and does not speed up, and when you will re-estimate.',
          ],
          explanation: 'A range with assumptions and a re-estimate point is honest and useful. A single optimistic number is a promise without evidence, and a padded number without reasons is not helpful.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-06-q1',
        prompt: 'Which of these kinds of work does AI speed up the least?',
        choices: [
          'Drafting a standard form screen from a clear description',
          'Writing a first draft of tests for a function that already exists',
          'Waiting for an email provider to verify your sending domain',
          'Turning a written flow into a list of screens and states',
        ],
        answer: 2,
        explanation: 'Waiting is calendar time controlled by other people. The other three are drafting tasks, which are what AI speeds up, though you still check the results.',
      },
      {
        id: 'ai-project-planning-06-q2',
        prompt: 'Why give an estimate as a range with assumptions, not as one number?',
        choices: [
          'A range sounds more modest, and clients prefer modest estimates',
          'Ranges are required by the tools that manage projects, so one number will not be accepted',
          'A single number is always wrong, so a range is simply the safer way to be wrong',
          'A single number hides what it depends on, while a range with assumptions shows the unknowns and when to re-plan',
        ],
        answer: 3,
        explanation: 'The purpose is information: the range shows how uncertain you are and the assumptions say what would make it longer, so people can plan and you know when to re-estimate.',
      },
      {
        id: 'ai-project-planning-06-q3',
        prompt: 'A teammate says: “AI makes us three times faster, so divide every estimate by three.” What is the best response?',
        choices: [
          'Do not apply a multiplier up front; estimate in ranges, finish the first milestone, and rescale from the actual hours',
          'Agree, because the vendor’s own experiment showed AI makes developers much faster at every kind of task',
          'Agree for build tasks, and also divide the waiting and review columns by three to stay consistent',
          'Ask the AI what its own speed-up multiplier is, and use whatever number it gives',
        ],
        answer: 0,
        explanation: 'The evidence covers narrow tasks and is mixed for whole projects, and waiting and review do not shrink. Your own first-milestone data is the honest way to learn your speed.',
      },
      {
        id: 'ai-project-planning-06-q4',
        prompt: 'Two tasks have build estimates of 3-5 h and 2-4 h, and review estimates of 1-2 h and 2-3 h. What is the total range in hours?',
        choices: [
          '5-9 h',
          '8-14 h',
          '10-14 h',
          '8-12 h',
        ],
        answer: 1,
        explanation: 'Build lows 3+2 = 5 and highs 5+4 = 9. Review lows 1+2 = 3 and highs 2+3 = 5. Add the columns: 5+3 = 8 and 9+5 = 14. Counting only the build column gives 5-9.',
      },
      {
        id: 'ai-project-planning-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In the cake example, which part does a faster mixer (the AI) not change?',
        choices: [
          'The time the cake spends baking in the oven',
          'How quickly the batter gets mixed',
          'Nothing: a faster mixer makes the whole cake faster',
        ],
        answer: 0,
        explanation: 'The mixer speeds up mixing only. Baking and waiting stay the same, just as AI speeds up drafting but not waiting for others or checking.',
      },
      {
        id: 'ai-project-planning-06-q6',
        audience: { min: 'advanced' },
        prompt: 'Your agents now produce diffs faster than the team can review them. DORA reports an association between higher AI adoption and larger batches with lower delivery stability. What is the best planning response?',
        choices: [
          'Add more agents, so that more work is in progress and the backlog clears sooner',
          'Skip human review for changes that the agents label as low risk',
          'Estimate only the generation time, because review is outside the build schedule',
          'Treat review as the bottleneck: keep slices small, limit work in progress to review capacity, and estimate review explicitly',
        ],
        answer: 3,
        explanation: 'When generation is cheap, review and verification set the pace. Small slices and a work-in-progress limit keep batches reviewable, and counting review in the estimate stops it from being a hidden cost.',
      },
    ],
    task: {
      title: 'Estimate your milestones as ranges',
      minutes: 20,
      steps: [
        'Take your milestone plan from lesson 4. For each milestone write build (AI), review and fix, and waiting columns as ranges. Be honest that your numbers are guesses.',
        'Write the biggest assumption and a confidence (high, medium or low) for each milestone. Check that any low confidence matches an item in your risk register.',
        'Add the lows and the highs, and write your estimate sentence for the first usable version.',
        'Paste your plan into an AI with the estimate prompt. Compare: where does it differ, and what does it say would make a task take three times longer?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use only three milestones. Ask the AI: “Explain in plain words why my estimate is a range, and what waiting time means for my project.” Write your estimate sentence in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Add a capacity line (hours per week per person) and your review capacity (diffs a day you can read well). Add re-plan triggers (for example “M1 actuals above the high end”) and check the usage limits of your AI plan in its official documentation.'] },
    ],
  },
  {
    id: 'ai-project-planning-07',
    day: 7,
    title: 'Turning the plan into the first prompts',
    summary: 'Write a one-page project brief and a pack of small prompts, each with an acceptance check, so building starts from the plan and not from a guess.',
    minutes: 30,
    skills: ['prompt-pack', 'planning-partner'],
    intro: {
      objectives: [
        'Write a project brief that gives an AI tool the same stable context every time',
        'Write small prompts with a goal, constraints, a plan-first request and an acceptance check',
        'Use a review prompt and a re-plan prompt to keep the plan and the code in step',
      ],
      why: 'A good plan is wasted if the first prompt is “build it all”. The prompt pack is how the plan reaches the AI in pieces small enough to review, which is what keeps you in charge of the project.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You now have a plan: scope, flows, features, milestones, risks and estimates. The temptation is to paste all of it into an AI tool and write “build this”. Do not. The result would be too large to review, the AI would quietly make dozens of decisions you never saw, and when something is wrong you could not tell where it began. Think of a carinderia. You do not say “feed my family”. You say which dish, how many portions, no peanuts, and serve it now. And the cook already knows your house rules, because you told them once, not at every order. Building with AI works the same way: the **house rules** go in a short **project brief** that stays the same, and the **orders** are small prompts, one per slice of work, each with a way to check the result.',
      },
      { type: 'heading', text: 'What a good first prompt contains' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Goal:** the one thing this prompt should achieve, in a sentence.',
          '**Context:** where the AI finds the rest (the project brief and the plan), so you do not repeat it.',
          '**Constraints:** what not to do. Copy the relevant lines of your out-of-scope list here.',
          '**Plan first:** ask it to propose its steps, and the files it will touch, and to wait for your OK.',
          '**Acceptance check:** how you will check that it worked, written as things you can do by hand.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The acceptance check is the part people skip, and it is the most valuable. “Make sure it works” gives the AI nothing to aim at and gives you nothing to check against. “Two browsers book 9:00 at the same moment: exactly one succeeds and the other sees ‘just taken’” can be tried in a minute and either passes or fails. It is the success check from your scope statement, shrunk to one slice.',
      },
      { type: 'heading', text: 'The project brief' },
      {
        type: 'paragraph',
        text: 'The brief is a one-page file the AI reads at the start of a session. Most coding tools have a standard place for one (the version note below names them), and in a plain chat assistant you paste it at the top of the conversation. It is mostly your plan squeezed into the rules the AI must follow. Keep it short, specific and free of anything secret.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'PROJECT BRIEF: save as docs/BRIEF.md and reference it, or as your tool’s instructions file (copy and adapt)',
        code: `# Maliwanag Family Clinic booking: project brief

Goal: patients book a 30-minute time with one of two doctors on their phone; the front desk
sees the day in one list.

Users: patients (no account; name, mobile number, email) and front-desk staff (they sign in).

Version 1 IN: free times by doctor and day; book a time; confirmation screen with a code;
staff sign in; staff day list; staff cancel. Later milestones: patient cancel link, one-off
blocked times, confirmation and reminder email.

Version 1 OUT (do not build and do not suggest): medical records or health documents, online
payment, video visits, SMS or push messages, patient accounts, booking two doctors at once,
a native phone app.

Assumed approach (confirm in your first reply): a mobile-first website on a free hosting plan,
with a hosted database that also handles staff sign-in.

Rules:
- Times are stored in UTC and shown in Philippine time.
- A doctor cannot have two active bookings at the same start time; the database must enforce it.
- Never log or print patient details.
- Links to a booking use long random tokens, never counting numbers.

Working style: propose a short plan before you change any file. Change one slice at a time.
After each slice say what changed, what you assumed and what you did NOT do. If the brief is
unclear, stop and ask.

Source of truth for scope, features, milestones and risks: docs/PLAN.md`,
      },
      { type: 'heading', text: 'The prompt pack' },
      {
        type: 'paragraph',
        text: 'Six prompts cover a whole milestone. The first asks the AI to understand before it acts. The next three ask for small pieces with checks. The last two keep the plan honest. Each is written to be copied, with square brackets where you fill in your own facts.',
      },
      {
        type: 'prompt',
        label: 'Prompt 1: kickoff (no code yet)',
        text: 'Read the project brief in docs/BRIEF.md. Do not write code or create files yet. (1) Tell me in your own words what you understand this project to be, in five lines. (2) List the questions you need answered before you start, most important first. (3) Propose the simplest technical approach that fits the brief, and name any tool or plan limit it depends on, marking the ones you are not sure about. (4) Propose the folder structure for Milestone 0. Then wait for my reply.',
      },
      {
        type: 'prompt',
        label: 'Prompt 2: Milestone 0, the skeleton',
        text: 'Using the approach we agreed, set up Milestone 0 only: a mobile-first booking page that opens in the browser and can save one test record to the database and read it back. Do not build any booking logic yet. Keep each doctor’s weekly hours in a settings file, as the brief says. Before you change any file, list the files you will create and wait for my OK. Acceptance: I can open the page on my phone and see the saved test record. When done, tell me what you assumed.',
      },
      {
        type: 'prompt',
        label: 'Prompt 3: Milestone 1, step one (free times)',
        text: 'Milestone 1, step one: show the free 30-minute times for a chosen doctor and day, using the weekly hours in the settings file and the bookings already saved. Out of scope for this step: saving a booking, emails and staff screens. Propose your plan first and wait for my OK. Acceptance: (a) on a Monday, the first doctor shows times from 8:00 to 16:30; (b) on a Sunday the clinic is closed, so no times show and a clear message says so; (c) all times display in Philippine time.',
      },
      {
        type: 'prompt',
        label: 'Prompt 4: Milestone 1, step two (book a time)',
        text: 'Next, add booking: a patient picks a free time, enters name, mobile number and email, and confirms. The rules in the brief apply, including the database enforcing one active booking per doctor and time. Write the automated test for the two-people case first and show me it failing, then make it pass. Acceptance: (a) booking a free time saves it and shows a confirmation code; (b) two browsers booking the same time at the same moment: exactly one succeeds, and the other sees “That time was just taken”, keeps their details and is shown other times; (c) refreshing the confirmation page does not create a second booking.',
      },
      {
        type: 'prompt',
        label: 'Prompt 5: the review prompt (after every slice)',
        text: 'Review the change you just made against docs/BRIEF.md. List: every file you changed, with one line on why; anything in the brief that you did not do; anything you assumed; anything you added that I did not ask for; and the exact steps for me to check it by hand. Do not make any more changes.',
      },
      {
        type: 'prompt',
        label: 'Prompt 6: re-plan (after every milestone)',
        text: 'Milestone [number] is done. It took [actual hours] against an estimate of [estimated range]. What surprised me: [your notes]. Update docs/PLAN.md: the remaining milestone estimates, any new risks with early warning signs, and anything that should move to Won’t. Show me the proposed changes as a list before you edit the file.',
      },
      {
        type: 'paragraph',
        text: 'Read the pack as a conversation. The kickoff makes the AI show you what it understood, before it can build the wrong thing. Step prompts name what is out for this step as well as what is in. The review prompt turns “I changed some files” into a list you can check against the brief, including what the AI added without being asked. And the re-plan prompt closes the loop from lesson 1: the plan changes when reality teaches you something, and the change goes through you.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A **prompt** is the message you send to the AI. Reading Prompt 3 line by line: “Milestone 1, step one” says which piece of the plan this is. “Show the free 30-minute times…” is the goal. “Out of scope for this step…” is the fence, so the AI does not wander. “Propose your plan first and wait for my OK” is you checking the recipe before the cooking starts. And the three items under **acceptance** are a checklist you can tick with your own phone: they say how you will know the dish came out right. The **project brief** is the page of house rules the cook reads at the start of every day, so your orders can stay short. If the AI asks questions you cannot answer, that is a good sign: it is telling you where the plan has a gap.',
      },
      {
        type: 'warning',
        text: 'Commit or save a copy of the project after every slice that you have checked by hand, so you can undo the next one. A “plan first” request is a habit, not a guarantee: always read what changed, and use the review prompt.',
      },
      {
        type: 'tip',
        text: 'Several AI coding tools have a mode that reads your project and proposes a plan without editing anything until you approve it. If your tool has one, use it for Prompts 1 and 2. In a plain chat assistant, the sentence “Do not write code yet” does the same job.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The brief is stable context and the slice prompts are volatile context, so keep the brief short and specific, and keep the per-task prompt to its delta. Express acceptance criteria as tests wherever you can (Prompt 4 asks for the failing test first), because a test is a check the agent can run itself. Remember what an instruction file is: guidance the model usually follows, not enforcement. A rule that must never be broken (do not edit this file, do not run that command) needs enforcement as well: permission settings, a hook or a failing check in CI. Add stop conditions for unattended runs (attempts, what to report, what not to touch), commit a checkpoint per slice, and run independent slices on separate branches only when they share no files or data, with the review budget decided first. This course stops at a plan and prompts; the Spec-Driven Development course turns each slice into a precise specification with tests, and the Context Engineering course covers how to shape what the model sees.',
      },
      {
        type: 'version',
        text: 'Claude Code’s documentation says plan mode lets Claude read files and propose a plan without making edits until you approve, entered by pressing Shift+Tab or starting with the plan permission mode; it names CLAUDE.md as the file for persistent instructions, notes that Claude can read a repository’s AGENTS.md, and says these files are treated as context, not enforced configuration. Cursor’s documentation describes a Plan Mode, reached with Shift+Tab, in which the agent asks clarifying questions and produces a reviewable plan before writing code, and says Cursor supports AGENTS.md as well as rules in .cursor/rules. Codex’s documentation says Codex reads AGENTS.md files before doing any work. Checked on this date; names, shortcuts and file locations change between releases.',
        checked: CHECKED,
        sources: [DOCS.ccWorkflows, DOCS.ccMemory, DOCS.cursorPlan, DOCS.cursorRules, DOCS.codexAgentsMd],
      },
      {
        type: 'takeaways',
        items: [
          'Do not paste the whole plan and say “build this”. Give the AI a stable project brief and then small prompts, one slice at a time.',
          'A good prompt has a goal, context (the brief), constraints (what not to do), a plan-first request and an acceptance check you can test by hand.',
          'Start with a kickoff prompt that asks the AI to restate the project and list its questions before it writes anything.',
          'After every slice use the review prompt, and after every milestone use the re-plan prompt, so the plan and the code stay in step.',
          'An instruction file is guidance, not enforcement: check the diff, and enforce any rule that must never be broken.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-07-arrange-1',
          kind: 'arrange',
          title: 'Put the prompt routine in order',
          prompt: 'These seven steps are how a milestone goes from plan to checked code. Put them in the order you would do them.',
          concept: 'the prompt pack routine',
          language: 'text',
          solution: [
            'Write the project brief from your plan',
            'Send the kickoff prompt and answer its questions, with no code written yet',
            'Ask for Milestone 0 only, and approve the list of files first',
            'Ask for one slice at a time, each with its acceptance check',
            'Run the review prompt and check the change by hand',
            'Commit the checked slice, then ask for the next one',
            'When the milestone is done, run the re-plan prompt with the real hours',
          ],
          reasons: [
            'The brief is the stable context every later prompt relies on.',
            'The kickoff shows you what the AI understood before it can build the wrong thing.',
            'The skeleton comes first because later slices need somewhere to live.',
            'Small slices with checks keep every change reviewable.',
            'The review turns “I changed some files” into a list you can check against the brief.',
            'A commit after a checked slice gives you something to undo back to.',
            'The re-plan comes at the end of a milestone, using what actually happened.',
          ],
          hints: [
            'What must exist before any prompt can be short and consistent?',
            'Understanding comes before building, a skeleton comes before slices, and checking comes before committing.',
            'Brief, kickoff, skeleton, slice with acceptance, review, commit, re-plan.',
          ],
          explanation: 'The routine is brief, kickoff, skeleton, then a loop of slice, review and commit, and finally a re-plan at the end of the milestone. Each step makes the next one safer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'Fix the vague line',
          prompt: 'This prompt is nearly good, but one line gives the AI nothing to aim at and gives you nothing to check against. Tap that line, then pick the best replacement.',
          concept: 'acceptance checks in prompts',
          language: 'text',
          code: `Milestone 1, step one: show free 30-minute times for a chosen doctor and day.
Use the weekly hours in the settings file and the bookings already saved.
Do not build saving a booking, emails or staff screens in this step.
Make sure it works.
Propose your plan before you change any file.`,
          bugLine: 4,
          lineNote: 'The goal, the constraint and the plan-first request are all fine. Look for the line that does not say how you will check the result.',
          fixes: [
            { line: 'Acceptance: on a Monday the first doctor shows times from 8:00 to 16:30; on a Sunday no times show and a message says the clinic is closed.', correct: true, why: 'It names concrete cases you can try by hand and that either pass or fail, which is what an acceptance check is.' },
            { line: 'Test it thoroughly and fix anything that is wrong.', correct: false, why: 'It sounds careful but does not say what “wrong” means, so neither you nor the AI can tell when it is done.' },
            { line: 'Make sure it works on every phone and every browser.', correct: false, why: 'This is too large to check and does not describe the behaviour of this slice.' },
            { line: 'Do not stop until the AI confirms that it works.', correct: false, why: 'The AI’s confirmation is not evidence. You need a check you can run yourself.' },
          ],
          hints: [
            'What would you do with your own phone to decide whether this step worked?',
            'An acceptance check names specific cases with a clear pass or fail.',
            'Pick the line that names Monday and Sunday cases.',
          ],
          explanation: 'An acceptance check gives specific, testable cases. Vague lines such as “make sure it works” sound safe but leave the AI guessing and leave you unable to verify.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-07-scenario-1',
          kind: 'scenario',
          title: 'The AI answers the kickoff',
          prompt: 'Choose the best response.',
          concept: 'keeping the AI inside the brief',
          situation: 'You sent the kickoff prompt. The AI replies with a good summary, then proposes: “For security, patients should create an account and confirm each booking with a one-time code sent by SMS.” Your brief says patient accounts and SMS are out of scope for version 1.',
          options: [
            { text: 'Reply that accounts and SMS are out of scope in the brief, and ask it to propose how a patient can reach their own booking safely without them, such as long random links.', consequence: 'The AI stays inside your boundary and answers the real security concern, so the plan gets better without growing.', quality: 'best' },
            { text: 'Accept the proposal, since the AI knows more about security than you do.', consequence: 'Accounts and SMS bring passwords, cost and extra set-up into version 1, and the scope you wrote is gone before any code exists.', quality: 'poor' },
            { text: 'Ask the AI to list the pros and cons of accounts and SMS, then decide whether to change the brief.', consequence: 'A reasonable way to reconsider, but it spends time on something you already decided, and changing the brief should be a deliberate choice, not a response to one suggestion.', quality: 'acceptable' },
            { text: 'Ignore the proposal and continue without saying anything.', consequence: 'The proposal stays in the conversation and may come back as code later, because you never told the AI it was out of bounds.', quality: 'poor' },
          ],
          hints: [
            'What does the brief say about accounts and SMS?',
            'The AI raised a real concern, safe access to a booking, but offered a solution outside your scope.',
            'Say it is out of scope and ask for a solution that fits inside the brief.',
          ],
          explanation: 'The brief exists for moments like this. Naming the boundary and asking for a solution inside it keeps you the decider, and often gets a better answer than a yes or a silence.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-07-q1',
        prompt: 'Why is it a bad idea to paste the whole plan and ask the AI to “build this”?',
        choices: [
          'The result is too big to review, the AI makes many silent decisions, and a failure cannot be traced to a cause',
          'AI tools can only read about a paragraph of text at a time and will cut off the rest of the plan',
          'The plan would become public, because anything pasted into an AI tool is published online',
          'The AI would refuse, because it only accepts prompts that name a single feature',
        ],
        answer: 0,
        explanation: 'Small slices keep every change reviewable. A single giant request hides the AI’s decisions inside a large result you cannot check.',
      },
      {
        id: 'ai-project-planning-07-q2',
        prompt: 'Which part of a prompt most directly stops the AI from adding features you never planned?',
        choices: [
          'The goal sentence at the top of the prompt',
          'The constraints, which carry the relevant lines of the out-of-scope list',
          'The request to propose a plan before changing any files',
          'The acceptance check at the bottom of the prompt',
        ],
        answer: 1,
        explanation: 'Constraints say what not to do. Repeating the out list there is how a boundary in your plan becomes a boundary in the AI’s work.',
      },
      {
        id: 'ai-project-planning-07-q3',
        prompt: 'Which acceptance check is best for the booking step?',
        choices: [
          'The booking screen looks good and feels easy to use',
          'The AI confirms that booking works and that all tests are fine',
          'Two browsers book 9:00 at the same moment: exactly one confirmation appears and the other sees “just taken”',
          'Booking works on all phones, in all browsers and for every kind of patient',
        ],
        answer: 2,
        explanation: 'A good check can be run by hand and either passes or fails. The others are opinions, an unverified claim or a target too large to test.',
      },
      {
        id: 'ai-project-planning-07-q4',
        prompt: 'What is the main job of the project brief file?',
        choices: [
          'To act as a legal contract between you and the AI company that provides the tool',
          'To replace the plan, so that you no longer have to keep docs/PLAN.md up to date',
          'To make sure the AI never produces any code that contains a mistake',
          'To give the AI the same stable context at the start of every session, so task prompts can stay short',
        ],
        answer: 3,
        explanation: 'The brief carries the house rules (scope, rules, working style) once, so each prompt only needs its own goal and checks. It points to the plan and does not replace it.',
      },
      {
        id: 'ai-project-planning-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In a prompt, what is an “acceptance check”?',
        choices: [
          'A button the AI presses to accept your request',
          'A password you must type before the AI will start',
          'A sentence saying how you will check that the result is right',
        ],
        answer: 2,
        explanation: 'An acceptance check names what you will try by hand to decide whether the work is done, such as “two phones book the same time and only one succeeds”.',
      },
      {
        id: 'ai-project-planning-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your instructions file says “never edit the settings file”, yet an agent edited it. What is the right conclusion and fix?',
        choices: [
          'The agent is faulty, so switch to a different tool and expect it to obey the file',
          'Instruction files are guidance, not enforcement, so add enforcement (permission settings, a hook or a failing check) and keep the rule written too',
          'Make the rule longer and write it in capital letters, because emphasis makes models obey',
          'Delete the file and repeat the rule in every prompt from now on',
        ],
        answer: 1,
        explanation: 'Tool documentation describes these files as context the model usually follows, not enforced configuration. A rule that must hold needs a mechanism that can actually stop the action.',
      },
    ],
    task: {
      title: 'Write your brief and your first three prompts',
      minutes: 20,
      steps: [
        'Write a one-page project brief for your app from your plan: goal, users, in, out, assumed approach, rules and working style. Keep any secret out of it.',
        'Write three prompts: a kickoff (no code), Milestone 0, and the first real slice with at least three acceptance checks you can try by hand.',
        'Send the brief and the kickoff prompt to an AI tool. Do not let it write code yet. List every question it asks and answer them.',
        'Read its proposed approach against your brief and risk register. Write down one thing it proposed that you refuse because it is out of scope.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each part of my first prompt in plain words and tell me which part is the acceptance check.” If it cannot find one, rewrite your prompt until it can.'] },
      { audience: { min: 'advanced' }, steps: ['Add stop conditions for an unattended run, list which rules you will enforce (permissions, hooks, tests) and which you only request, and choose two slices that share no files for separate branches, with who reviews each diff.'] },
    ],
  },
  {
    id: 'ai-project-planning-08',
    day: 8,
    title: 'Project: a plan for your own app',
    summary: 'Put the seven pieces together as a plan on a page, review it with twelve questions and an AI critic, and keep it alive as you build.',
    minutes: 30,
    skills: ['plan-purpose', 'prompt-pack', 'feasibility-checks'],
    intro: {
      objectives: [
        'Assemble scope, flows, features, milestones, risks, estimates and prompts into a plan on a page',
        'Review a plan with twelve questions and an AI critic before any building starts',
        'Set up the routine that keeps the plan true after every milestone',
      ],
      why: 'This is the lesson where you stop planning a clinic and plan your own app. A reviewed plan on a page is what you can hand to an AI tool, a teammate or a client, and it is the proof that you direct the AI and not the other way around.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Before you leave for a trip you do one last check of the bag at the door: passport, charger, ticket. It takes a minute and it saves the trip. This lesson is that check for a plan, and it is also the lesson where you make your own. You have seven pieces from the last seven lessons. Now you put them on one page, test the page with twelve questions, let an AI critic attack it, and set up the routine that keeps it true. The project at the end of the course is exactly this, for your own app.',
      },
      { type: 'heading', text: 'The plan on a page' },
      {
        type: 'paragraph',
        text: 'The plan on a page is a summary that points to the full pieces. It is short enough that a person, or an AI tool, can read it in two minutes and know what you are building, what you are not building, in what order, and what could go wrong. Here is the clinic’s, written to be copied: replace each line with your own.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'PLAN ON A PAGE: Maliwanag Family Clinic booking (copy and adapt)',
        code: `PLAN ON A PAGE: Maliwanag Family Clinic booking, version 1
Last updated: [date]   Owner: [your name]

1 IDEA
  Patients book a 30-minute time on their phone; the front desk sees the day in one list.
  Today: paper notebook, double bookings, forgotten visits.

2 SCOPE
  One job: a patient picks a doctor, a day and a free time and the front desk sees it.
  In: free times, booking, confirmation code, staff sign-in, day list, staff cancel,
      then patient cancel link, blocked times, confirmation and reminder email.
  Out (with reasons): health records, online payment, video, SMS, patient accounts, native app.
  Success checks: a new patient books in under three minutes; two people, one time: exactly one
      succeeds; tomorrow's list matches the bookings made.

3 FLOWS AND SCREENS
  People: patient, front desk. Jobs: 7. Main flow: 9 steps with 4 what-if branches.
  Screens: 10, each with loading, empty and error versions.

4 FEATURES (14 for version 1)
  Must 7 (F1 to F7). Should 5 (F8 to F12). Could 2 (F13, F14). Won't 5 (the out list).
  Each feature lists what it needs first.

5 MILESTONES
  M0 set up and decide. M1 a patient can book. M2 the front desk can run the day.
  M3 safe to pilot. M4 fewer no-shows. Each ends with "you can show..." and a done-when check.

6 RISKS (top three)
  R3 email may not reach patients (test first, in M0). R2 double booking (database rule, M1).
  R1 front desk keeps the notebook (pretend day in M2). Full register: 9 risks with warning signs.

7 ESTIMATE
  Pilot-ready (M3): 4 to 7 weeks at about 8 hours a week, low confidence for the last part.
  Assumes email verifies quickly and the clinic's data answer arrives. Re-estimate after M1.

8 FIRST PROMPTS
  Project brief, kickoff, M0 skeleton, first slice with acceptance checks, review, re-plan.

9 DECISIONS AND CHECKED FACTS (with dates)
  [date] Patient accounts: out. [date] Reminders: one daily job (hosting limit checked).`,
      },
      { type: 'heading', text: 'Twelve questions to review a plan' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Can I say the one job in one sentence?',
          'Does every out-of-scope line have a reason?',
          'Is every success check something I can test by hand?',
          'Does each job have a happy path and at least two “what if” branches?',
          'Does every feature trace back to a step in a flow?',
          'Did every Must pass the workaround question?',
          'Does every feature say what it needs, traced two steps back?',
          'Does every milestone end with something I can show and a done-when check?',
          'Is the riskiest unknown checked first, not last?',
          'Is every claim about a tool or limit verified in official documentation, with a date?',
          'Are estimates ranges in three columns, each with an assumption and a confidence?',
          'Could another person, or an AI tool, start Milestone 0 from the brief and prompts without asking me what I meant?',
        ],
      },
      {
        type: 'paragraph',
        text: 'Question 12 is the real test. If a stranger would have to ask you what you meant, the plan lives in your head and not on the page. Fix the plan until the answer is no.',
      },
      {
        type: 'prompt',
        label: 'Prompt: the final critic (paste your plan on a page under it)',
        text: 'Review the plan below as three different people: a sceptical senior engineer, a tired front-desk worker who has to use it every day, and the person paying for it. For each, give the three most serious problems you see. Then list any contradictions between my scope, flows, features, milestones and estimates, and any claim about a tool or limit that I should verify in official documentation. Do not rewrite the plan. Only list issues, most serious first.',
      },
      {
        type: 'paragraph',
        text: 'Run it once, choose the three issues that matter most, and fix them. Resist fixing everything: a plan is reviewed until it is good enough to start, not until it is perfect, because building will teach you more than another round of planning. The same prompts you used in lessons 1 to 6 (interview, challenge my scope, what could go wrong, challenge my priorities, pre-mortem, claims to check, estimate) are your **planning kit**. Save them as templates, because you will use them on every project.',
      },
      { type: 'heading', text: 'Keep the plan alive' },
      {
        type: 'list',
        items: [
          '**Keep it in the project** as `docs/PLAN.md`, next to the code, so you and your tools read the same version.',
          '**After every milestone** run the re-plan prompt with the real hours, and update estimates, risks and the Won’t list.',
          '**Date every checked fact** so you know what to re-verify when a plan or limit may have changed.',
          '**Log decisions** in one line each (what, why, date), so you do not reopen settled questions.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Plans fail in predictable ways: they run to thirty pages and nobody reads them, they describe only the happy path, every feature is a Must, estimates are a single number, facts from the AI are trusted unchecked, and nobody updates them after week one. A one-to-three-page plan that you review and update is better than a long one that you do not.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Pick a very small first idea: a one-page price list for a small shop, a class schedule, a simple tracker. Three to six features and three milestones are plenty. You do not have to write the whole plan alone: let an AI interview you for each piece, then ask it to explain anything you do not understand, in plain words, with an everyday example. The twelve review questions are a checklist like the one you use before leaving the house. If you can answer yes to most of them, the plan is good enough to start, and you can always improve it after the first milestone. The goal of this project is not a perfect plan. It is to show that you can decide what to build, in what order, and what might go wrong, before you ask an AI to build anything.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** In a team, the plan is a shared artefact with owners: name who decides scope, architecture and priority, review the plan like a pull request, and keep its decision log in the repository. Make it agent-ready: each slice has written acceptance criteria (tests where possible), explicit out-of-scope lines, known dependencies, and a named human who reviews each diff, and the number of slices in flight is capped by review capacity, not by how many agents you can start. Map dependencies across teams and vendors, sequence by risk reduction, and record plan and quota assumptions with dates. Report to stakeholders with a range, its confidence, its drivers and its re-plan triggers. The evidence of a well-run agent-assisted project is not how much code was generated; it is the reviewed plan, the failing-then-passing checks and the decision log.',
      },
      {
        type: 'takeaways',
        items: [
          'A plan on a page summarises all seven pieces in one or two minutes of reading and points to the full artefacts.',
          'Review it with twelve questions, and the last one is the real test: could someone else, or an AI tool, start from it without asking you what you meant?',
          'Use an AI critic to list issues, fix the three that matter most, and then start building: a plan is reviewed until good enough, not perfect.',
          'Keep the plan in the project, update it after every milestone, date every checked fact and log decisions.',
          'Save the prompts you used as your planning kit, so the next project starts in an hour and not in a week.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-08-match-1',
          kind: 'match',
          title: 'Which review question catches it?',
          prompt: 'Each line is a weakness found in a plan. Match it to the review question that catches it.',
          concept: 'reviewing a plan',
          labels: { terms: 'What the plan says', meanings: 'The question that catches it' },
          pairs: [
            { term: 'Success check: “Patients will love the new booking page”', definition: 'Is it something I can test by hand?', note: 'Love cannot be tested with two phones and a stopwatch.' },
            { term: 'Milestone 2: “Finish the backend”', definition: 'Does it end with something I can show?', note: 'A milestone needs a “you can show…” sentence and a done-when check.' },
            { term: 'Estimate: “Three weeks”', definition: 'Is it a range with assumptions in three columns?', note: 'A single number hides what it depends on.' },
            { term: 'Assumption: “The free plan should be fine for sending reminders”', definition: 'Is the limit verified in official documentation, with a date?', note: '“Should be fine” is a claim to check against the vendor’s own page.' },
          ],
          hints: [
            'For each line, ask what is missing: a test, something to show, a range or a source.',
            '“Love” cannot be tested; “three weeks” hides its assumptions.',
            '“Finish the backend” is not something you can demo to the clinic.',
          ],
          explanation: 'Each review question targets one weakness. Reading your own plan with the questions in mind is how you find the soft spots before the AI builds on them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-08-scenario-1',
          kind: 'scenario',
          title: 'The plan you inherit',
          prompt: 'Choose the single most valuable fix before anyone builds.',
          concept: 'prioritising plan fixes',
          situation: 'A friend shows you her plan for a tutoring booking app and asks if she can start building tomorrow. It has no out-of-scope list, 15 features that are all marked Must, a single estimate of “three weeks”, and no risk register.',
          options: [
            { text: 'Write the out-of-scope list with reasons and re-run the workaround question on the musts, because scope drives everything else in the plan.', consequence: 'The list shrinks, the milestones become possible and the estimate can finally mean something. Risks and ranges can follow in the next hour.', quality: 'best' },
            { text: 'Turn the single estimate into a range, since the number is the most visible problem.', consequence: 'A range on fifteen musts is still a range on the wrong project. It helps, but it fixes the symptom and not the cause.', quality: 'acceptable' },
            { text: 'Add more features, so that the first version is more impressive.', consequence: 'The plan grows, the estimate gets less honest and the odds of finishing fall.', quality: 'poor' },
            { text: 'Start building tomorrow and fix the plan when something goes wrong.', consequence: 'Building without a boundary invites the AI to add more, and each surprise arrives with code already written around it.', quality: 'poor' },
          ],
          hints: [
            'Which problem makes the other problems worse?',
            'Fifteen musts and no out list means there is no real boundary.',
            'Fix scope first: an out list with reasons and an honest must list.',
          ],
          explanation: 'Scope is upstream of flows, features, milestones and estimates. Fixing it first makes every later fix easier, while fixing only the visible symptom leaves the project the wrong size.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-project-planning-08-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Common plan mistakes and their fixes',
          prompt: 'Tap each card to see the fix.',
          concept: 'common planning mistakes',
          cards: [
            { front: 'The plan is thirty pages long', back: 'Keep a plan to one to three pages. A shorter plan is read and kept up to date.' },
            { front: 'Everything is a Must', back: 'Ask what the clinic would do on day one without it. Anything with a workaround becomes a Should.' },
            { front: 'The estimate is one number', back: 'Give a range with assumptions, so people see what it depends on.' },
            { front: 'The AI said the tool can do it', back: 'Check the vendor’s own documentation for the plan you will use, and write down the date.' },
          ],
          hints: ['Think about which lesson each mistake comes from.'],
          explanation: 'Each mistake is a lesson in this course. Spotting them in your own plan before you start building is the point of reviewing it.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-project-planning-08-q1',
        prompt: 'Which sign tells you a plan is ready to build from?',
        choices: [
          'It is long and detailed, covering every feature that anyone might want in later versions',
          'The AI tool that helped write it says that it is complete and ready for building',
          'You have worked on it for a full week, so no more questions could possibly be left',
          'Another person, or an AI tool, could start Milestone 0 from the brief and prompts without asking what you meant',
        ],
        answer: 3,
        explanation: 'A plan lives on the page only if someone else can act on it. Length, the AI’s approval and time spent are not evidence of that.',
      },
      {
        id: 'ai-project-planning-08-q2',
        prompt: 'Milestone 1 actually took more hours than the high end of your range. What should you do?',
        choices: [
          'Nothing: estimates are only guesses, and the next milestone will probably be quicker to build',
          'Change the original estimate so that it looks as if it was correct from the start',
          'Run the re-plan: rescale the remaining estimates from the real hours, add the cause as a risk, and decide what moves to Won’t',
          'Ask the AI to build Milestone 2 faster so that the schedule catches up with the first one',
        ],
        answer: 2,
        explanation: 'The point of the first milestone is to give you real data. Re-planning from it, and recording the cause, keeps the plan honest instead of hopeful.',
      },
      {
        id: 'ai-project-planning-08-q3',
        prompt: 'Which line from a plan fails the review questions?',
        choices: [
          'M1: you can show a patient booking a time on a phone; done when the two-phone test passes five times in a row',
          'M2: finish the backend, then the front end, then the testing and the polish',
          'R3: a test email to a non-team address may not arrive; send one in M0 and note the date and the result',
          'Estimate: 4 to 7 weeks at 8 hours a week, low confidence for the last part, assuming email verifies quickly',
        ],
        answer: 1,
        explanation: '“Finish the backend” has nothing you can show and no done-when check. The other lines name something to demonstrate or test, or give a range with its assumptions.',
      },
      {
        id: 'ai-project-planning-08-q4',
        prompt: 'Why keep the plan in the project and update it after each milestone?',
        choices: [
          'So the plan stays true and visible: it is the source of truth for people and AI tools, and its changes can be reviewed',
          'Because most hosting services refuse to run an app whose project folder has no plan file',
          'So the AI tool can charge fewer tokens, since a plan file replaces the need for any prompts',
          'Because a plan that is never edited eventually deletes itself from the repository',
        ],
        answer: 0,
        explanation: 'A plan that is out of date misleads everyone who reads it, including your tools. Keeping it with the code and updating it at each milestone keeps it honest.',
      },
      {
        id: 'ai-project-planning-08-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a good size for your first plan?',
        choices: [
          'Thirty pages covering every feature you might ever want',
          'One to three pages is enough for a small app',
          'A single sentence about what you want the AI to build',
        ],
        answer: 1,
        explanation: 'A small plan gets read and updated. A thirty-page plan gets ignored, and one sentence leaves the AI guessing.',
      },
      {
        id: 'ai-project-planning-08-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team will hand work to coding agents. What makes the plan “agent-ready”?',
        choices: [
          'Slices with written acceptance criteria (tests where possible), explicit out-of-scope lines, known dependencies and a named reviewer for each diff',
          'A long list of every feature, so each agent can choose the work it prefers',
          'A single prompt describing the whole product, so that the agents can divide it among themselves',
          'A statement that agents may merge their own changes if the tests they wrote themselves pass',
        ],
        answer: 0,
        explanation: 'Agents need bounded, checkable work and a human who reviews it. Unbounded wish lists, one giant prompt and self-approved merges remove the review that makes agent output trustworthy.',
      },
    ],
    task: {
      title: 'Assemble and review your plan on a page',
      minutes: 20,
      steps: [
        'Fill in the plan on a page for your own app, using what you wrote in lessons 1 to 7. Keep it to one or two pages.',
        'Answer the twelve review questions honestly. Mark each yes, no or unsure, and fix the “no” answers that are quick.',
        'Run the final critic prompt. Choose the three most serious issues and fix them.',
        'Save your planning kit: the prompts you used, with blanks to fill in, and your twelve-question checklist.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Plan only a tiny app (three to six features, three milestones). Ask the AI to explain every review question in plain words, then answer them one at a time.'] },
      { audience: { min: 'advanced' }, steps: ['Add an owner for each decision, a dependency map that includes external teams and vendors, a cap on slices in flight set by review capacity, and the re-plan triggers you would agree with stakeholders.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-project-planning-p1',
    title: 'A plan for your own app',
    summary: 'Plan an app of your own from idea to first prompts: scope, user flows, prioritised features, milestones, a risk register with verified facts, honest estimates and a project brief.',
    outcome: 'A reviewed, written plan that shows you can decide what to build, in what order and what could go wrong before an AI writes a line of code: the proof that you direct the AI.',
    unlockAfterDay: 7,
    steps: [
      { id: 'ai-project-planning-p1-s1', text: 'Write your idea card and a scope statement: the one job, what is in, what is out (each with a reason), two or three success checks you can test by hand, constraints and assumptions.' },
      { id: 'ai-project-planning-p1-s2', text: 'List your people and their jobs. Write the main job as a numbered happy path with at least three “what if” branches, draw it as a flowchart with AI’s help, and list the screens with their loading, empty and error states.' },
      { id: 'ai-project-planning-p1-s3', text: 'Write a feature list with ids, priorities (must, should, could, won’t) and a “needs” column traced two steps back, then a milestone plan where each milestone has a “you can show…” sentence and a done-when check.' },
      { id: 'ai-project-planning-p1-s4', text: 'Write a risk register of at least six risks, each with likelihood, impact, an early warning sign and a response. Verify at least two claims about tools or limits in the vendors’ official documentation and record the page, the exact limit and the date.' },
      { id: 'ai-project-planning-p1-s5', text: 'Estimate each milestone as ranges in three columns (build with AI, review and fix, waiting), with an assumption and a confidence, add them up, and write your estimate sentence.' },
      { id: 'ai-project-planning-p1-s6', text: 'Write a one-page project brief and the first prompts: kickoff, Milestone 0 and the first slice with acceptance checks, plus your review and re-plan prompts. Run the final critic prompt on your plan on a page and fix the three most serious issues.' },
      { id: 'ai-project-planning-p1-s7', audience: { max: 'beginner' }, text: 'Plan a very small app of three to six features and three milestones. Use AI interviews for each piece and ask it to explain anything unclear in plain words. Write the estimate sentence and the risks in your own words.' },
      { id: 'ai-project-planning-p1-s8', audience: { min: 'intermediate', max: 'intermediate' }, text: 'Choose an app that needs an API, a database or sign-in, and add the risks that each one brings (limits, data, access control), with the check you would run for each.' },
      { id: 'ai-project-planning-p1-s9', audience: { min: 'advanced' }, text: 'Plan a change to an existing codebase: list the modules it touches, a dependency map, regression risks, the tests that will protect it, a rollout and rollback plan, and the slices as acceptance criteria that an agent could be given.' },
      { id: 'ai-project-planning-p1-s10', audience: { min: 'professional' }, text: 'Add the team layer: an owner per decision, a review of the plan by a teammate or a second AI critic with its findings recorded, a decision log, a cap on slices in flight set by review capacity, and the re-plan triggers you would agree with stakeholders.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your plan on a page',
      placeholder: 'Paste your plan on a page, then your scope statement, main flow, feature list, milestone plan, risk register, estimate table and first prompts.',
      hint: 'The plan on a page plus the full pieces: scope with out list and success checks, a flow with what-ifs, features with priorities and needs, milestones with “you can show” sentences, a risk register with two verified and dated facts, ranged estimates, and the brief with first prompts.',
    },
    rubric: [
      'The scope statement has one testable job, an out list where every line has a reason, and success checks that can be tested by hand.',
      'The main flow has a happy path and at least three “what if” branches, and the screens follow from it.',
      'Features have priorities that pass the workaround question and a needs column, and every milestone ends with something that can be shown and a done-when check.',
      'The risk register has at least six risks with early warning signs and responses, and at least two claims about tools or limits are verified against official documentation with a source and date.',
      'Estimates are ranges split into build, review and waiting, with assumptions and confidence, and no invented AI speed-up multiplier.',
      'The brief and first prompts include constraints from the out list and acceptance checks, so another person or AI tool could start Milestone 0 without asking what was meant.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The plan is small and clear: three to six features, three milestones, and terms explained in the learner’s own words.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The risks and checks for the API, database or sign-in the app uses are specific, not generic.'] },
      { audience: { min: 'advanced' }, items: ['The plan includes a dependency map, regression and rollout risks, and slices written as acceptance criteria an agent could be given.'] },
      { audience: { min: 'professional' }, items: ['The plan records its reviewer’s findings, a decision log, a limit on slices in flight set by review capacity and agreed re-plan triggers.'] },
    ],
  },
  {
    id: 'ai-project-planning-p2',
    title: 'Your planning kit',
    summary: 'Turn what you used in this course into a reusable kit: prompt templates, a one-page review checklist and a routine you will follow on every project.',
    outcome: 'A reusable planning kit that makes any AI tool work to your plan: proof that you have turned a course into a habit.',
    unlockAfterDay: 6,
    steps: [
      { id: 'ai-project-planning-p2-s1', text: 'Save the prompts you used (interview, challenge my scope, what could go wrong, challenge my priorities, pre-mortem, claims to check, estimate, final critic) as templates, each with blanks to fill in and a one-line note on when to use it.' },
      { id: 'ai-project-planning-p2-s2', text: 'Write the twelve review questions as a one-page checklist in your own words, and add two questions of your own that come from your experience on this course.' },
      { id: 'ai-project-planning-p2-s3', text: 'Write your routine: the order you plan in, roughly how long each step takes, when you verify facts, and when you re-plan (after every milestone).' },
      { id: 'ai-project-planning-p2-s4', audience: { min: 'advanced' }, text: 'Add a plan-and-brief template for your repository, with an out-of-scope section, a decision log and a list of the rules you enforce (permissions, hooks, tests) next to the rules you only request.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your planning kit',
      placeholder: 'Paste your prompt templates, your checklist and your routine, with one example of a template used on a real idea.',
      hint: 'The templates with blanks, the checklist, the routine, and a short note on what changed when you used them.',
    },
    rubric: [
      'The templates are reusable, with clear blanks, and cover scope, flows, priorities, risks, claims to check and estimates.',
      'The checklist is in the learner’s own words and covers testable success checks, workarounds, dependencies, verified facts and ranged estimates.',
      'The routine says when to verify facts and when to re-plan, and is short enough to follow.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The kit uses plain words the learner can follow without looking anything up.'] },
      { audience: { min: 'advanced' }, items: ['The kit separates enforced rules from requested rules and names the mechanism that enforces each one.'] },
    ],
  },
];

export const aiProjectPlanningCourse: Course = {
  id: 'ai-project-planning',
  kind: 'standard',
  title: 'AI-Assisted Project Planning',
  level: 'beginner',
  tagline: 'Plan an app with AI before you build: scope, flows, priorities, risks and honest estimates.',
  description:
    'Before you ask an AI to build anything, you need to know what you are building. In this course you plan a small booking app from idea to first prompts, using AI as an interviewer, drafter and critic while you stay the decision-maker. You learn to set scope, map user flows, prioritise features, order milestones, find risks, give honest estimates and turn the plan into prompts.',
  finishLine: [
    'A written plan for your own app: scope, user flows, prioritised features, milestones, risk register and estimate ranges',
    'A pack of first prompts and a project brief that you can hand to any AI tool or coding agent',
    'A habit of challenging an AI-made plan and checking its claims against official documentation',
    'A reusable planning kit: your prompts, checklist and routine for the next project',
  ],
  objectives: [
    'Write a scope statement that says what is in and what is out of the first version',
    'Map user flows and screens, including the unhappy paths people forget',
    'Prioritise features as must, should and could, and order milestones by dependency',
    'Build a risk register and check feasibility against official documentation',
    'Give estimates as honest ranges, knowing what AI speeds up and what it does not',
    'Turn a plan into a project brief and a pack of first prompts for an AI tool',
  ],
  audiences: ['builder', 'career-changer', 'fresh-grad', 'experienced-dev'],
  skills: [
    { id: 'plan-purpose', label: 'Knowing what a plan is for' },
    { id: 'planning-partner', label: 'Using AI as a planning partner' },
    { id: 'scope-statement', label: 'Writing a scope statement' },
    { id: 'user-flows', label: 'Mapping user flows and screens' },
    { id: 'prioritise-features', label: 'Prioritising features: must, should, could' },
    { id: 'milestones', label: 'Ordering milestones by dependency' },
    { id: 'risk-register', label: 'Finding and ranking risks' },
    { id: 'feasibility-checks', label: 'Checking feasibility in official docs' },
    { id: 'honest-estimates', label: 'Giving honest estimate ranges' },
    { id: 'prompt-pack', label: 'Turning a plan into first prompts' },
  ],
  lessons,
  projects,
  icon: 'checklist',
  updated: '2026-11-14',
};
