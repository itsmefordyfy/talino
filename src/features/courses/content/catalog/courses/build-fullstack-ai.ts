import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Build a Full-Stack Application with AI. The running example is a fictional court-booking app, "Sampaguita Court" (basketball and badminton courts in
 * Naga City). It was built for real while this course was written (Node.js 22, Express 5.3, React 19.3 and Vite 8.3 for the web app, PostgreSQL for the data,
 * Vitest 5.1 and Playwright 1.65 for tests), one commit per lesson stage. Every command output, error, log line, test result and diff quoted in the lessons
 * was produced by that project, with port numbers shown as common defaults and folder names shortened. The prompts are written for this course; the
 * "AI-generated" code is code written the way an AI coding tool typically writes it, flaws included (they are the point of the review lessons), not the
 * transcript of a real model. Not run: the Docker image build, the GitHub Actions workflow and a deployment to a real host (those follow the vendors'
 * documentation, checked on CHECKED, and are labelled as such in the lessons).
 */

const CHECKED = '2026-11-14';

const DOCS = {
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  cloudRunContract: { label: 'Google Cloud docs: Cloud Run container runtime contract', url: 'https://docs.cloud.google.com/run/docs/container-contract' },
  cloudRunDeploy: { label: 'Google Cloud docs: Deploy container images to Cloud Run', url: 'https://docs.cloud.google.com/run/docs/deploying' },
  cloudRunSecrets: { label: 'Google Cloud docs: Configure secrets for services', url: 'https://docs.cloud.google.com/run/docs/configuring/services/secrets' },
  codexAgents: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  cursorAgent: { label: 'Cursor docs: Agent', url: 'https://cursor.com/docs/agent/overview' },
  dependabot: { label: 'GitHub Docs: Configuring Dependabot version updates', url: 'https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates' },
  expressErrors: { label: 'Express docs: Error handling', url: 'https://expressjs.com/en/guide/error-handling.html' },
  expressMigrating: { label: 'Express docs: Moving to Express 5', url: 'https://expressjs.com/en/guide/migrating-5.html' },
  expressMulter: { label: 'Express docs: Multer middleware', url: 'https://expressjs.com/en/resources/middleware/multer.html' },
  expressSecurity: { label: 'Express docs: Production best practices: Security', url: 'https://expressjs.com/en/advanced/best-practice-security.html' },
  ghNode: { label: 'GitHub Docs: Building and testing Node.js', url: 'https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs' },
  ghPostgres: { label: 'GitHub Docs: Creating PostgreSQL service containers', url: 'https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers' },
  mdnCookie: { label: 'MDN: Set-Cookie header', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie' },
  mdnCors: { label: 'MDN: Cross-Origin Resource Sharing (CORS)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
  mdnStatus: { label: 'MDN: HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status' },
  nodeCrypto: { label: 'Node.js docs: Crypto (scrypt, randomBytes, timingSafeEqual)', url: 'https://nodejs.org/api/crypto.html' },
  nodeReleases: { label: 'Node.js: Previous releases', url: 'https://nodejs.org/en/about/previous-releases' },
  owaspAuthz: { label: 'OWASP Cheat Sheet: Authorization', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
  owaspSqli: { label: 'OWASP Cheat Sheet: SQL Injection Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
  owaspTop10: { label: 'OWASP Top 10:2025: Introduction', url: 'https://top10.owasp.org/2025/0x00_2025-Introduction' },
  pgConstraints: { label: 'PostgreSQL docs: Constraints (exclusion constraints)', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
  playwrightIntro: { label: 'Playwright docs: Installation', url: 'https://playwright.dev/docs/intro' },
  rateLimit: { label: 'express-rate-limit (GitHub): README', url: 'https://github.com/express-rate-limit/express-rate-limit' },
  supaAuth: { label: 'Supabase docs: Auth', url: 'https://supabase.com/docs/guides/auth' },
  viteEnv: { label: 'Vite docs: Env Variables and Modes', url: 'https://vite.dev/guide/env-and-mode' },
  viteServer: { label: 'Vite docs: Server Options (server.proxy)', url: 'https://vite.dev/config/server-options' },
  vitestGuide: { label: 'Vitest docs: Getting Started', url: 'https://vitest.dev/guide/' },
  zodDocs: { label: 'Zod documentation', url: 'https://zod.dev/' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'build-fullstack-ai-01',
    day: 1,
    title: 'Plan a full application and write its spec',
    summary: 'Turn "I want a booking app" into a one-page spec with rules, data, non-goals and acceptance checks that an AI tool can build from and you can test against.',
    intro: {
      objectives: [
        'Explain what the front end, the back end and the database each do in a web application',
        'Write a one-page spec with rules, data, non-goals and acceptance checks',
        'Ask an AI tool to challenge your spec before it writes any code',
      ],
      why: 'A website shows information; an application remembers people, enforces rules and keeps data safe. AI will happily build whatever you describe, so the spec you write first decides whether you get a working booking app or a confident-looking one that double-books your customers.',
    },
    minutes: 25,
    skills: ['plan-spec'],
    body: [
      {
        type: 'paragraph',
        text: 'In the Build a Website with AI course you made pages that show information. A **full-stack application** is different: it has people who sign in, rules that must never be broken and data that must survive when the browser closes. Over this course you will direct an AI coding tool to build one, a court-booking app for a fictional sports centre in Naga City called Sampaguita Court, and you will learn to read, test, secure and ship what it builds. The tool writes most of the code. You do the part it cannot: deciding what the app must do, checking that it really does it, and noticing what it got wrong.',
      },
      { type: 'heading', text: 'Three parts and one journey' },
      {
        type: 'paragraph',
        text: "Every web application has three parts, and knowing which part does what is the most useful map you can carry. The **front end** is what the person sees and touches. It runs in their browser: forms, buttons, lists. The **back end** is a program running on a computer you control (a server). It receives requests from the front end, applies the rules and decides what is allowed. The **database** is the application's long-term memory: users, courts, bookings. The front end and back end talk through an **API**, a set of agreed web addresses such as `POST /api/bookings` that the front end calls to ask the back end to do something.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant B as Browser (front end)
  participant S as Server (back end, API)
  participant D as Database
  B->>S: POST /api/bookings (court, time, hours)
  S->>S: Check sign-in and the rules
  S->>D: Save the booking
  D-->>S: Saved (or: overlaps another booking)
  S-->>B: 201 Created, or 409 That time is booked`,
        caption: 'One booking, end to end. Every lesson in this course zooms in on one arrow of this picture.',
      },
      { type: 'visual', id: 'web-frontend-backend', caption: 'Press the buttons to watch a request travel between the parts.' },
      {
        type: 'paragraph',
        text: 'The rule that follows from this picture is the one that matters most for security later: **the browser is not in your control.** A customer can open the developer tools, change the form, or skip your front end and call the API directly. So any rule that must hold, such as "no two bookings overlap" or "you can only see your own bookings", has to be enforced on the back end and, where possible, in the database. The front end only helps people make fewer mistakes.',
      },
      {
        type: 'table',
        headers: ['Part', 'Its job', 'In Sampaguita Court', 'Never rely on it for'],
        rows: [
          ['Front end (browser)', 'Show things, collect input', 'Booking form, "My bookings" list', 'Enforcing rules or hiding data'],
          [
            'Back end (server, API)',
            'Check sign-in, apply rules, talk to the database',
            'Routes such as POST /api/bookings',
            'Anything the browser tells it about prices or roles',
          ],
          [
            'Database',
            'Remember data, refuse impossible data',
            'users, courts, bookings tables',
            'Being the only check: errors need friendly messages too',
          ],
        ],
        caption: 'Who is responsible for what.',
      },
      { type: 'heading', text: 'The spec: your most important prompt' },
      {
        type: 'paragraph',
        text: 'A **spec** (specification) is a short written description of what the application must do. For AI-assisted building it is the document you paste into the tool at the start of every task, so it should be specific enough to build from and checkable enough to test against. A good one-page spec has six parts: who uses it, the rules the system must enforce, the data it stores, what is deliberately not in version one, acceptance checks written as real examples, and the technology limits. Here is the spec for Sampaguita Court; the rest of the course builds exactly this.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'SPEC.md for the booking app',
        code: `# Sampaguita Court: booking app, version 1

## Who uses it
- Customers: sign up, see the courts, book a time, see and cancel their own bookings, attach proof of payment.
- Front desk (admin): sees every booking with the customer's name.

## Rules the system must enforce
1. A court cannot have two confirmed bookings that overlap in time. Back-to-back is fine.
2. A booking is 1 to 3 whole hours, starts on the hour, and is in the future.
3. The courts open at 6 AM and close at 10 PM, Manila time (UTC+8).
4. The price is hours x the court's hourly price. The server works it out; the browser's number is never trusted.
5. A customer can only ever see, change or cancel their own bookings.
6. Proof of payment is a PNG or JPEG image, at most 2 MB.

## Data
users (name, email, password hash, role), courts (name, hourly price in centavos),
bookings (user, court, start, end, total in centavos, status, notes, proof file).

## Not in version 1
Online payment, recurring bookings, a mobile app, a calendar view, reviews.

## Acceptance checks
- Ana books Court A for 6 to 8 PM. Ben tries 7 to 8 PM on Court A: he is told the time is taken. Court B at 7 PM works.
- Ben never sees Ana's booking, even if he guesses its address.
- A 4-hour booking, a booking at 5 AM and a booking in the past are all refused with a clear message.

## Stack
React web app, Node.js API, PostgreSQL. Secrets only in environment variables.`,
      },
      {
        type: 'paragraph',
        text: 'Look at what makes it good. The rules are numbered so you can refer to them ("rule 5 is broken"). Every rule can be tested: you can try to break it and see. The acceptance checks use named people and real times, which turns each into a test you could run by hand or, in lesson 10, automatically. And the non-goals list protects you: without it, an AI tool will cheerfully add payments, reviews and a calendar you did not ask for, and every extra feature is more code you must review and secure.',
      },
      {
        type: 'prompt',
        label: 'Ask the AI to challenge the spec before building',
        text: `Here is the spec for a court-booking web app. Do not write any code yet.

1. List every rule or situation that is ambiguous or missing (for example: what happens at midnight, what if two people press Book at the same moment, can an admin cancel for a customer).
2. For each, suggest the simplest answer and tell me what it would cost to change later.
3. Point out any line that cannot be tested, and rewrite it so it can.

[paste SPEC.md here]`,
      },
      {
        type: 'version',
        text: "This course's example was built with React 19.3 and Vite 8.3 (front end), Node.js 22 with Express 5.3 (API) and PostgreSQL (database). Express 5 requires Node.js 18 or newer, Vitest 5 requires Node 22.12 or newer, and Playwright's docs list Node 22.x as the oldest supported line. Node's release page lists v22, v24 and v26 as LTS (long-term support) on the date checked. AI tools choose their own stack and change it over time; the skills in this course (specifying, reviewing, testing, shipping) apply to any of them.",
        checked: CHECKED,
        sources: [DOCS.nodeReleases, DOCS.expressMigrating, DOCS.vitestGuide, DOCS.playwrightIntro],
      },
      {
        type: 'warning',
        text: 'Never paste real customer data, passwords, API keys or private business documents into a prompt. Use invented examples like Ana and Ben. A spec should describe the shape of your data, not contain it.',
      },
      {
        type: 'paragraph',
        text: 'A **walking skeleton** is the smallest version of the whole system that works end to end: one form, one API route, one database table, all connected. The sensible way to direct an AI tool is to ask for that first, run it, and then add the rules and features one at a time. Asking for "the whole app" in one prompt gives you thousands of lines you cannot yet judge.',
      },
      {
        type: 'paragraph',
        text: "Think of a restaurant. The **dining room** is the front end: tables, menus, the waiter who takes your order. The **kitchen** is the back end: it follows the recipes (the rules) and decides what can be cooked. The **pantry and recipe book** is the database: what is in stock and what was ordered yesterday. A *web browser* is the program (Chrome, Safari) that shows you a site; a *server* is simply someone else's computer that is always on and answers requests; an *API* is the order window between dining room and kitchen. The waiter should not be the one deciding whether the kitchen has enough pandesal; a customer can shout any order, and the kitchen still checks. That is why rules live in the back end.",
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'A spec is like the note you leave for a builder before you travel: where the doors go, what must never happen, what you do not want, and how you will check the work when you return. The clearer the note, the fewer guesses the builder makes. You will not write code to do any of this; you write sentences, and the sentences are what the AI turns into code.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'If any word here is new, ask the AI: "Explain API like I run a bakery." Asking a tool to explain its own words is a normal part of working with it.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'In a professional setting this one-pager grows into a lightweight design document, and the questions behind it are the ones that are expensive to change later: the **non-functional requirements** (expected load, acceptable downtime, how fast a page must respond, how long data is kept), the **data classification** (which fields are personal data and who may read them), and a rough **threat model** (who might misuse the app, and what they could gain). Decide build versus buy for the hard commodity parts early: sign-in, email and payments are usually better bought or taken from a maintained library than hand-written by an AI. Record the decisions and their reasons as short architecture decision records in the repository, so that the next agent session, and the next engineer, start from the same constraints instead of re-deriving them. Write acceptance checks in a Given/When/Then shape so each one becomes an automated test.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'A web application has three parts: the front end in the browser, the back end that applies the rules, and the database that remembers.',
          'The browser is not under your control, so every rule that matters is enforced on the back end and, where possible, in the database.',
          'A one-page spec has six parts: users, rules, data, non-goals, acceptance checks and technology limits. Write rules so each one can be tested.',
          'Ask the AI to challenge the spec before it writes code, and build a walking skeleton first rather than the whole app at once.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-01-scenario-1',
          kind: 'scenario',
          title: 'What do you send to the AI tool?',
          prompt: 'Choose the first prompt you would send.',
          concept: 'writing a spec',
          situation: 'Your cousin runs a badminton hall in Cebu with three courts and wants customers to book online instead of by Messenger. You have an AI coding tool open. You know the hourly price, the opening hours, and that two customers once turned up for the same hour.',
          options: [
            {
              text: 'Write a one-page spec: users, numbered rules (no overlapping bookings, opening hours, price worked out by the server), data, non-goals such as online payment, and two acceptance examples. Ask the tool to point out what is unclear before it builds.',
              consequence: 'The tool asks what happens when a customer cancels late, a question you had not thought about, and its first version already refuses overlapping bookings.',
              quality: 'best',
            },
            {
              text: 'Type: "Build me a booking system like Calendly with payments, reviews and an admin dashboard."',
              consequence: 'You get a large, impressive-looking app with half-working payments and invented review features. Nobody checked the double booking rule, and that was the one thing your cousin needed.',
              quality: 'poor',
            },
            {
              text: 'List every feature you can imagine in a long message, in the order they occurred to you, and ask for all of it in one go.',
              consequence: 'The tool builds a lot, but the rules are scattered and untestable, so you cannot tell whether the double-booking problem is actually solved.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Which message tells the tool what must never happen?',
            'Look for the one that can be tested with real examples and that asks for questions first.',
            'The best option has numbered rules, non-goals, acceptance examples and an instruction to find gaps before building.',
          ],
          explanation: "The spec turns the cousin's real problem (two customers, one hour) into a rule and an acceptance check. A vague request invites invention, and a feature list without rules cannot be tested.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-01-match-1',
          kind: 'match',
          title: 'Which part of the spec is it?',
          prompt: 'Match each line of a spec to the part of the spec it belongs in.',
          concept: 'spec parts',
          labels: { terms: 'A line from a spec', meanings: 'Where it belongs' },
          pairs: [
            {
              term: 'Customers pay by bank transfer; there is no online payment in version 1',
              definition: 'Non-goal',
              note: 'It says what is deliberately left out, so the AI does not add payments.',
            },
            {
              term: 'Two confirmed bookings of one court may never overlap in time',
              definition: 'Business rule',
              note: 'It is something the system must enforce on every request.',
            },
            {
              term: 'Ben books Court B for one hour and sees it in his list; Ana never does',
              definition: 'Acceptance check',
              note: 'It is a concrete example with named people that you can run as a test.',
            },
            {
              term: 'Each booking stores who, which court, start and end time, total in centavos and status',
              definition: 'Data to store',
              note: 'It describes what the database must remember.',
            },
          ],
          hints: [
            'One of these says what we will NOT build. Start with that one.',
            'The line with named people and an expected result is a test in disguise.',
            'A rule uses words like "may never"; the data line lists fields.',
          ],
          explanation: 'Each part of the spec answers a different question: what to leave out, what must always hold, how to check it, and what to remember.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-01-q1',
        prompt: 'Your rule says two bookings of one court must never overlap. Where must that rule be enforced for it to actually hold?',
        choices: [
          'In the booking form in the browser, by greying out the times that look taken so that customers cannot click them',
          'In the back end and the database, because every request, including ones that skip your form, passes through them',
          'In the spec only, because the AI tool reads it before building and will then respect it in every later task',
        ],
        answer: 1,
        explanation: 'A browser form only helps honest users. Anyone can call the API directly, so the rule must be checked on the back end and, best of all, refused by the database itself.',
      },
      {
        id: 'build-fullstack-ai-01-q2',
        prompt: 'Which line belongs under "Not in version 1"?',
        choices: [
          'Recurring weekly bookings and online payment',
          'Customers can cancel their own booking from the list on their account page',
          'The courts open at 6 AM and close at 10 PM Manila time, so later bookings are refused',
          "A customer cannot see another customer's bookings, even if they guess the address",
        ],
        answer: 0,
        explanation: 'Non-goals are things you are deliberately not building yet. The other three are rules or features version 1 must have.',
      },
      {
        id: 'build-fullstack-ai-01-q3',
        prompt: 'A spec line says "The app must be secure." What is the problem with it?',
        choices: [
          'It is too short; a real spec line needs at least three sentences of explanation and a diagram',
          'It belongs in the front end code, not in the spec, because security is only a matter of how the pages look and behave',
          `It cannot be tested; rewrite it as checks such as "asking for another customer's booking gets 404"`,
        ],
        answer: 2,
        explanation: '"Secure" has no pass or fail. A checkable statement names who does what and what must happen, so you can try to break it.',
      },
      {
        id: 'build-fullstack-ai-01-q4',
        prompt: 'Why end your first prompt with "Do not write any code yet. First tell me what is unclear or missing"?',
        choices: [
          'It forces the tool to take longer, and slower output is usually more careful and more correct',
          'Gaps in your plan come back as questions you can answer quickly, before code is built on them',
          'It stops the tool from choosing a framework itself, which keeps the whole project simpler',
        ],
        answer: 1,
        explanation: 'An AI tool will build on a weak plan without complaint. Asking for questions first turns missing rules into a cheap conversation instead of a rewrite.',
      },
      {
        id: 'build-fullstack-ai-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a database?',
        choices: [
          'The part of the app that decides who is allowed to do what and checks every rule',
          'The screen the customer looks at, with its buttons, forms, colours and the list of their bookings',
          'The part of the app that remembers information, like users and bookings, after the browser closes',
        ],
        answer: 2,
        explanation: 'The database is long-term memory. The back end applies the rules, and the front end is the screen.',
      },
      {
        id: 'build-fullstack-ai-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team will let an AI agent implement the booking app. Which decision is best recorded in the repository before the first agent session?',
        choices: [
          "The agent's preferred variable names and file layout, so that every file looks the same",
          'The final wording of every error message the app might ever show to a customer',
          'Nothing: the agent will infer every rule and every constraint from the code that it writes by itself later',
          'The stack, rules, non-goals and acceptance checks, plus the reasons behind build-versus-buy choices',
        ],
        answer: 3,
        explanation: 'Written constraints and their reasons are what let every later session and engineer start from the same ground; an agent cannot infer rules and non-goals that do not exist in the code yet.',
      },
    ],
    task: {
      title: 'Write the spec for your own booking app',
      minutes: 20,
      steps: [
        'Pick something people book: a court, a salon chair, a tutor, a meeting room. Use Sampaguita Court if you prefer.',
        'Write a SPEC.md with the six parts: who uses it, numbered rules, data, not in version 1, acceptance checks with named people, and the technology limits.',
        'Paste it into an AI chat tool with the challenge prompt from this lesson. Do not let it write code.',
        'Answer its questions, update the spec, and keep the file: you will use it in every lesson.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI: "Explain each of my rules in one plain sentence, with an example." If an explanation surprises you, the rule is unclear: rewrite it.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a short "Non-functional requirements" section (expected users, acceptable downtime, data you must protect) and one architecture decision record for build versus buy on sign-in.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-02',
    day: 2,
    title: 'Generate and steer the front end',
    summary: 'Ask for the booking screens with clear limits, read what the AI built, and steer it with small, precise prompts instead of starting over.',
    intro: {
      objectives: [
        'Write a front end prompt that sets the structure, the limits and where server calls live',
        'Read the generated files well enough to find the form, the server calls and the price logic',
        'Spot three front end mistakes: secrets in the browser, wrong value types and prices the server cannot trust',
      ],
      why: 'The front end is the part you can see and click, so it is where you will steer most often. Knowing where things live in the files lets you ask for one precise change instead of regenerating the whole screen and losing what already worked.',
    },
    minutes: 25,
    skills: ['frontend-states'],
    body: [
      {
        type: 'paragraph',
        text: 'The first thing an AI tool builds from your spec is usually the screens, because they are quick to generate and satisfying to see. That is also the risk: a screen that looks finished tells you nothing about whether the rules behind it work. In this lesson you will ask for the booking screens in a controlled way, run them, and learn the handful of places in the generated files where problems hide. You will also learn the habit that saves the most time all course: steering with small, specific prompts that name the file to change.',
      },
      { type: 'heading', text: 'Ask for structure, not just a look' },
      {
        type: 'paragraph',
        text: 'A prompt like "make a nice booking page" leaves every decision to the tool: which libraries, where the files go, how the server is called. Tell it these things instead. Three limits matter most for a full-stack project. First, put **all calls to the server in one file**, so you can see every request the front end can make. Second, forbid extra libraries unless you approve them, because each one is code you must keep updated. Third, name the states the screen must handle (loading, empty, error), so they are not forgotten; lesson 8 returns to this.',
      },
      {
        type: 'prompt',
        label: 'First front end prompt (paste your SPEC.md below it)',
        text: `Build the web front end for the spec below.

Technology: React with Vite, plain JavaScript, plain CSS in src/index.css with CSS variables. No other libraries.
Structure: src/api.js holds every call to the server (one function per API route, no fetch calls anywhere else); src/components has one file per component; src/money.js formats prices once.
Screens: sign in or create account; after sign in, a booking form (court, date, start hour, hours, estimated total) and a list of my bookings with a Cancel button.
Rules: prices are whole centavos everywhere and formatted as pesos only for display. Do not compute anything the server must decide. Phone-first layout with 44px tap targets.
Do not invent API routes: use only the ones listed in the spec's API section. When finished, list every file you created and every server route the front end calls.

[paste SPEC.md and the list of API routes]`,
      },
      {
        type: 'paragraph',
        text: 'That last sentence of the prompt is a review tool in disguise. The list of routes the front end calls can be compared with the routes the back end actually has (lesson 3), and any difference is a bug waiting to happen. Here is the project the tool produced, and the Vite setting that connects the screens to the API while you work.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The web app after the first generation',
        code: `web/
  index.html            the one page the browser loads
  vite.config.js        dev server settings, including the /api proxy
  src/
    main.jsx            starts React
    App.jsx             decides what to show: sign-in, or booking screens
    api.js              every call to the server, in one place
    money.js            pesos formatting and the total estimate
    index.css           styles
    components/
      AuthForm.jsx      sign in and create account
      BookingForm.jsx   the form that books a court
      MyBookings.jsx    the customer's list with Cancel`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'web/vite.config.js (as generated)',
        code: `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // In development the browser talks to Vite, and Vite forwards /api calls to the API server.
  server: { port: 5173, proxy: { '/api': 'http://localhost:4000' } },
});`,
      },
      {
        type: 'paragraph',
        text: 'The `proxy` line is why the front end can call `/api/...` while the API runs on a different port: during development, Vite forwards anything starting with `/api` to the API server. To the browser, everything comes from one address, which also means you will not meet CORS errors (lesson 9 explains them) until you deploy the two parts to different addresses.',
      },
      {
        type: 'version',
        text: "Vite's docs describe `server.proxy` as forwarding any request whose path starts with the key to the target, in development only, and say the dev server's default port is 5173. They also state that variables prefixed `VITE_` are exposed to client code and must not hold sensitive information such as API keys. This course's example used Vite 8.3.8 and React 19.3.1.",
        checked: CHECKED,
        sources: [DOCS.viteServer, DOCS.viteEnv],
      },
      { type: 'heading', text: 'Read the three places where front ends go wrong' },
      {
        type: 'paragraph',
        text: 'You do not need to read every line. Open `src/api.js`, the form component and `money.js` and look for three things. **One: secrets.** Anything the browser can run, a visitor can read. Vite copies variables whose names start with `VITE_` into the files it builds. To see it for yourself, the course project was built with a pretend key, and a search of the output found it.',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'A VITE_ variable ends up in the built files (real run)',
        code: `VITE_EMAIL_API_KEY=sk_demo_not_a_real_key npm run build
grep -o "sk_demo_not_a_real_key" dist/assets/*.js`,
      },
      { type: 'code', language: 'text', label: 'What the search printed', code: 'sk_demo_not_a_real_key' },
      {
        type: 'paragraph',
        text: "So the rule is simple: the email key, the database address and every other secret live only on the server (lesson 7 and lesson 9). **Two: value types.** Every value read from a form field is text, even a number input, so `'2'` is not `2`. **Three: trusted numbers.** The form shows an estimated total, which is helpful for the customer, but it is only an estimate: a visitor can change it, so the server must work out the real price. Here is the generated form's submit code; notice what it sends.",
      },
      {
        type: 'code',
        language: 'jsx',
        label: 'BookingForm.jsx, the submit function (first version)',
        code: `  const submit = async (e) => {
    e.preventDefault();
    try {
      const { booking } = await api.book({
        courtId: Number(courtId),
        startsAt: \`\${date}T\${hour.padStart(2, '0')}:00:00+08:00\`,
        hours: Number(hours),
        totalCents: total,
      });
      onBooked(booking);
      setMessage('Booked!');
    } catch (err) {
      setMessage(err.message);
    }
  };`,
      },
      {
        type: 'paragraph',
        text: 'The generated form sends `totalCents: total` to the server. That is the third mistake, found by reading one line. Lesson 9 shows what a visitor can do with it, and why the fix belongs on the server. A small helper in `money.js` is where the estimate comes from:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'money.js',
        code: `// Prices are whole centavos in the database and on the wire; format them once, here.
export const pesos = (cents) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(cents / 100);

export const totalCents = (pricePerHourCents, hours) => pricePerHourCents * Number(hours);`,
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Why Number() matters when reading a form (real run)',
        code: `node -e "const price=35000, hours='2'; console.log('wrong:', price + hours, ' right:', price * Number(hours));"`,
      },
      { type: 'code', language: 'text', label: 'Output', code: 'wrong: 350002  right: 70000' },
      {
        type: 'table',
        headers: ['Check in the generated files', 'What to look for', 'Prompt that fixes it'],
        rows: [
          [
            'All server calls in api.js',
            'No fetch( anywhere else; every path matches a real API route',
            '"Move every fetch call into src/api.js and list the routes."',
          ],
          [
            'No secrets in the browser',
            'No VITE_ variable holding a key or password; no keys in source',
            '"Remove the key from the front end; the server will make this call."',
          ],
          ['Right value types', 'Number(...) on numeric form fields before sending', '"Convert courtId and hours to numbers before the request."'],
          ['Prices are estimates', 'The server, not the form, decides the final price', '"Stop sending totalCents; show the total as an estimate."'],
        ],
        caption: 'A five-minute review of any generated front end.',
      },
      { type: 'heading', text: 'Steer with small prompts' },
      {
        type: 'paragraph',
        text: 'Once the first version runs, resist the urge to start over. Name the file, say what must stay the same, and say how you will check the result. A change prompt that works is short and fenced.',
      },
      {
        type: 'prompt',
        label: 'A steering prompt (a fenced change)',
        text: `In src/components/BookingForm.jsx only: stop sending totalCents to the server and label the total "Estimated total". Convert courtId and hours with Number() before sending. Do not change any other file and do not add libraries. Then show me the diff and tell me how to check it in the browser's Network tab.`,
      },
      {
        type: 'prompt',
        label: 'The same change, written for a professional workflow',
        text: 'Remove totalCents from the POST /api/bookings payload in BookingForm.jsx (the API prices server-side per SPEC rule 4). Acceptance: the request body in DevTools contains exactly courtId, startsAt, hours, notes; hours and courtId are numbers. Keep the change to one file, no new dependencies, and add no comments. Output a unified diff only.',
        audience: { min: 'advanced' },
      },
      {
        type: 'paragraph',
        text: `In plain words, a **component** is one reusable piece of the screen with its own job, like a single LEGO brick: \`BookingForm\` is the brick that holds the booking fields, \`MyBookings\` is the brick that draws the list. The file \`App.jsx\` snaps the bricks together. In \`api.js\`, each function is a ready-made phone call to the server: \`api.book(...)\` means "ring the server and ask it to make a booking". The dev server (\`npm run dev\`) is a small shop on your own computer so you can try the screens before anyone else can see them. A **form field** always hands over text, which is why \`'2'\` hours must be turned into the number \`2\` before the server sees it.`,
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: "Open your browser's developer tools (press F12, then the Network tab), click Book, and look at the request. Seeing exactly what your screen sends is the fastest way to understand and check it. You are looking at the same thing an attacker would see.",
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'Since you can already read a React component, use generation as a reading exercise: before you run anything, ask the tool to explain which state each component owns and which props it receives, then check that against the files. Pay particular attention to what the tool added without being asked, such as a `useEffect` that fetches data, extra state, or a package in `package.json`. Unrequested choices are where surprises hide, and each is a decision you now own.',
        audience: { min: 'intermediate', max: 'intermediate' },
      },
      {
        type: 'paragraph',
        text: "For a larger front end, decide deliberately how server data is fetched and cached rather than accepting the tool's default of `useEffect` plus `useState`: that pattern has race conditions (a slow response overwrites a newer one), no cache and no retry policy. Prefer an `AbortController` per request or a data-fetching library, and make the API contract explicit with a shared schema or an OpenAPI document, so the front end and back end cannot drift apart silently. Anything in the production bundle is public: audit the built output (not just the source) for keys and internal URLs in CI, set a Content-Security-Policy so injected scripts cannot call arbitrary hosts, and never render server text with `dangerouslySetInnerHTML`.",
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Ask the front end tool for structure: all server calls in one file, no extra libraries, prices in whole centavos and formatted once.',
          'A VITE_ variable is copied into the built files, so the browser never holds a secret; secrets belong on the server.',
          'Form fields return text: convert numbers explicitly. And a total shown on screen is only an estimate; the server decides the real price.',
          'Steer with small prompts that name one file, say what must not change, and say how to check the result.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-02-fix-bug-1',
          kind: 'fix-bug',
          title: 'The server refuses every booking',
          prompt: 'The API rejects every request from this form with "hours must be a whole number". Find the line that sends the wrong type and choose the fix.',
          concept: 'form values are text',
          story: 'Everything is in the form as text: the court number, the date, the hour, even the hours.',
          language: 'javascript',
          code: `function buildBooking(form) {
  return {
    courtId: Number(form.courtId),
    startsAt: \`\${form.date}T\${form.hour.padStart(2, '0')}:00:00+08:00\`,
    hours: form.hours,
  };
}`,
          bugLine: 5,
          fixes: [
            {
              line: '    hours: Number(form.hours),',
              correct: true,
              why: 'Number("2") is the number 2, so the server receives a whole number, as its schema expects.',
            },
            {
              line: '    hours: String(form.hours),',
              correct: false,
              why: 'The value is already text: this keeps it as text, so the server still refuses it.',
            },
            {
              line: '    hours: form.hours + 0,',
              correct: false,
              why: 'Adding 0 to the text "2" joins the two into the text "20": worse than before.',
            },
            {
              line: '    hours: Math.floor(form.hours / 2),',
              correct: false,
              why: 'This is a number, but it halves the hours, so a 2-hour booking becomes 1 hour.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'buildBooking',
            cases: [
              {
                label: 'two hours at 8 AM',
                args: [
                  { courtId: '1', date: '2026-12-05', hour: '8', hours: '2' },
                ],
                expected: { courtId: 1, startsAt: '2026-12-05T08:00:00+08:00', hours: 2 },
              },
              {
                label: 'one hour at 6 PM',
                args: [
                  { courtId: '2', date: '2026-12-06', hour: '18', hours: '1' },
                ],
                expected: { courtId: 2, startsAt: '2026-12-06T18:00:00+08:00', hours: 1 },
              },
            ],
          },
          hints: [
            'Look at how courtId is handled, then compare it with hours.',
            'courtId goes through Number(). Which other line is missing that treatment?',
            'Use Number(form.hours) on the hours line.',
          ],
          explanation: 'Values read from form fields are always text. courtId was converted, but hours was sent as the text "2", which a strict API refuses. Number() fixes it on the line that sends the value.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-02-predict-1',
          kind: 'predict-output',
          title: 'Text plus number',
          prompt: 'The hours value comes from a form field, so it is text. What does this print?',
          concept: 'form values are text',
          language: 'javascript',
          code: `const price = 35000;
const hours = '2';
console.log(price + hours);
console.log(price * hours);
console.log(price * Number(hours));`,
          choices: ['70000\n70000\n70000', '350002\n70000\n70000', '350002\n350002\n70000'],
          wrongNotes: {
            '70000\n70000\n70000': 'The first line uses + with text, and + joins text instead of adding.',
            '350002\n350002\n70000': '* always means multiply, so the second line converts "2" to 2 by itself.',
          },
          hints: [
            'What does the + sign do when one side is text?',
            'The * sign always multiplies, so it turns the text into a number first.',
            'Line 1 joins "35000" and "2" into 350002; lines 2 and 3 both give 70000.',
          ],
          explanation: 'With text on one side, + joins instead of adding, giving 350002. The * sign always multiplies, so it works even with text, but relying on that hides the problem: convert explicitly with Number().',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-02-q1',
        prompt: 'Why do you ask the AI to put every server call in one file, such as src/api.js?',
        choices: [
          'You can see every request the front end can make and compare it with the back end routes',
          'It is required by React; components are not allowed to call the server on their own',
          'It makes the app load much faster because the browser caches one small file better than it caches many files',
        ],
        answer: 0,
        explanation: 'One file is a complete, reviewable list of what the front end asks the server to do. React itself does not care, and speed is unaffected.',
      },
      {
        id: 'build-fullstack-ai-02-q2',
        prompt: 'Your email provider gave you a secret API key. You put it in a Vite variable called VITE_EMAIL_API_KEY so the front end can send confirmation emails. What happens?',
        choices: [
          'Nothing happens: VITE_ variables are only available while you run the development server',
          'The key stays private because it lives in a .env file, which a browser is never able to open',
          'The key is encrypted by Vite when the app is built, so that only your own server will be able to decrypt and use it',
          'The key is copied into the built JavaScript that every visitor downloads, so anyone can read it',
        ],
        answer: 3,
        explanation: 'Vite deliberately copies VITE_ variables into the client bundle. Secrets belong on the back end, which makes the email call itself.',
      },
      {
        id: 'build-fullstack-ai-02-q3',
        prompt: 'The booking form shows "Total: ₱700.00" and sends that number to the server. What should the server do with it?',
        choices: [
          'Ignore it and work out the price from its own court prices and the hours',
          'Store it as sent, then compare it with the court price at the end of each month',
          'Trust it, since the same developers wrote both the form and the server and they agree',
        ],
        answer: 0,
        explanation: "A visitor can edit what the browser sends. The price must come from the server's own data; the screen's total is only a helpful estimate.",
      },
      {
        id: 'build-fullstack-ai-02-q4',
        prompt: `The tool's first version is almost right, but the total is labelled "Total". What is the best next prompt?`,
        choices: [
          'Rewrite the whole front end from scratch, this time with the label "Estimated total" on the price',
          'In BookingForm.jsx only, relabel the total "Estimated total" and change nothing else; show the diff',
          'Make the whole page look better, fix the labels everywhere, and add whatever else a booking app usually needs',
        ],
        answer: 1,
        explanation: 'A fenced change names the file, limits the change and asks for a diff, so you keep everything that already works and can review exactly what moved.',
      },
      {
        id: 'build-fullstack-ai-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a component?',
        choices: [
          "A folder on the server where the database stores all of the customers' bookings in a safe way, one file for each booking",
          'A password that protects one page of the website from visitors who are not signed in yet',
          'A small reusable piece of the screen with one job, like the booking form or the bookings list',
        ],
        answer: 2,
        explanation: 'Components are the building bricks of a screen. Each one draws one part, and App.jsx puts them together.',
      },
      {
        id: 'build-fullstack-ai-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate proposes keeping the generated data fetching (useEffect plus useState) as the app grows to twenty screens. What is the strongest objection?',
        choices: [
          'useEffect cannot call an API at all, so the generated code would only ever work in development mode',
          'There is no objection: state inside components is always the correct place to keep server data',
          'It uses too many lines of code, and the size of the source files directly slows down the built app',
          'It has race conditions, no cache and no retry policy: slow replies can overwrite newer data',
        ],
        answer: 3,
        explanation: 'The default pattern lets an older, slower response replace a newer one and refetches without a cache. An AbortController or a fetching library handles both.',
      },
    ],
    task: {
      title: 'Generate the screens and read the network',
      minutes: 20,
      steps: [
        'Give your AI tool the front end prompt from this lesson with your SPEC.md and run it with npm run dev.',
        'Open the browser developer tools (F12) on the Network tab, fill in the booking form and press Book. Find the request and read what it sends.',
        'Search the generated front end for "VITE_", "fetch(" and "totalCents". Write down what you find.',
        'Send one fenced steering prompt that fixes the most serious finding, check it in the Network tab and save the prompt in a PROMPTS.md log.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI: "Explain what api.js does as if I have never coded, line by line." Then change one word on the screen (a button label) by prompt and watch the page update.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a CI step that builds the web app and fails if the output contains the text "key_" or "password", and replace one useEffect fetch with an abortable request or a data library.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-03',
    day: 3,
    title: 'Generate the back end and its API',
    summary: 'Ask for a back end with a clear list of routes, read how a request moves through it, and test it with real HTTP calls before any screen touches it.',
    intro: {
      objectives: [
        'Ask an AI tool for an API as a list of routes, methods and status codes before any code',
        'Read how a request passes through the middleware and route of a generated Express server',
        'Test an API with real HTTP calls and match each response to the right status code',
      ],
      why: 'The back end is where your rules actually live, and it is the part nobody can see from the screen. If you can read one route and exercise it with a command, you can check what the AI built instead of trusting that "it ran".',
    },
    minutes: 25,
    skills: ['backend-api'],
    body: [
      {
        type: 'paragraph',
        text: 'A screen can be bypassed, so the back end is where your rules must live. In this lesson the AI tool builds it: a server program that listens for requests from the browser, applies the rules from your spec and answers. You will learn to ask for it in the right order (the list of routes first, the code second), to read one route from top to bottom, and to test the server directly with a command, which is faster and more honest than clicking through a screen.',
      },
      { type: 'heading', text: 'Ask for the routes before the code' },
      {
        type: 'paragraph',
        text: 'An **API route** is a web address plus a verb. The address says what you are talking about (`/api/bookings`), and the verb says what you want to do with it: `GET` to read, `POST` to create, `DELETE` to remove. The server answers with a **status code**, a three-digit number that says how it went: 2xx means it worked, 4xx means the request was wrong, 5xx means the server failed. Asking the AI to write this list first, as a table you can approve, prevents the most common back end problem: a pile of routes that nobody planned.',
      },
      {
        type: 'prompt',
        label: 'Back end prompt: the plan first',
        text: `Using the spec below, propose the API as a table before writing code: method, path, who may call it (anyone, signed-in customer, admin), request body, success status and the error statuses it can return. Use these conventions: JSON only; plural nouns for resources; 201 for created, 204 for no content; 400 for bad input, 401 not signed in, 404 not found, 409 conflict. Technology: Node.js 22 with Express 5, PostgreSQL through the pg library with parameterised queries only. Then wait for my approval.

[paste SPEC.md]`,
      },
      {
        type: 'table',
        headers: ['Method and path', 'Who', 'Success', 'Errors'],
        rows: [
          ['POST /api/auth/register', 'Anyone', '201 with the new user', '400 bad input, 409 email taken'],
          ['POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me', 'Anyone / signed in', '200 or 204', '401 not signed in or wrong login'],
          ['GET /api/courts', 'Anyone', '200 list of courts', ''],
          ['GET /api/courts/:id/availability?date=', 'Anyone', '200 booked time ranges', ''],
          ['GET /api/bookings, POST /api/bookings', 'Signed in', '200 my list / 201 created', '400 bad input, 401, 409 time taken'],
          ['GET /api/bookings/:id, DELETE /api/bookings/:id', 'Signed in', '200 / 204', '401, 404'],
          ['POST /api/bookings/:id/proof', 'Signed in', '200', '400 bad file, 401, 404'],
        ],
        caption: "The route table the course project followed. A reviewer can compare it with the code and with the front end's api.js.",
      },
      {
        type: 'paragraph',
        text: "Keep this table: it is the **contract** between the front end and the back end. When the front end's `api.js` calls a path that is not in the table, or the table lists a route the code does not have, you have found a bug without running anything.",
      },
      { type: 'heading', text: 'One request, through the middleware' },
      {
        type: 'paragraph',
        text: 'Express handles a request by passing it through a chain of small functions called **middleware**, in the order you register them. Each can change the request, answer it, or pass it on. The order matters, and it is where the generated `app.js` is worth reading carefully.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/app.js (first generated version)',
        code: `export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(loadUser);

  app.use('/api/auth', authRouter);
  app.use('/api/courts', courtsRouter);
  app.use('/api/bookings', bookingsRouter);
  return app;
}`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A(Request arrives) --> B[cors: add cross-origin headers]
  B --> C[express.json: read the JSON body]
  C --> D[cookieParser: read cookies]
  D --> E[loadUser: find who is signed in]
  E --> F{Which route matches}
  F --> G[requireLogin, then the route handler]
  G --> H(Response sent)`,
        caption: 'The path of one request. A route sees req.user only because loadUser ran before it.',
      },
      {
        type: 'paragraph',
        text: "Now one route. `POST /api/bookings` is the heart of the app. Read it as a short story: take the input, build the end time, save the booking, and turn a database refusal into a friendly answer. Notice that `$1` to `$6` are placeholders: the values travel separately from the SQL text, which is how a database tells the difference between a command and a customer's words.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'POST /api/bookings (first generated version)',
        code: `bookingsRouter.post('/', async (req, res) => {
  const { courtId, startsAt, hours, notes, totalCents } = req.body;
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + hours * 3600_000);
  try {
    const { rows } = await query(
      \`INSERT INTO bookings (user_id, court_id, starts_at, ends_at, total_cents, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING \${COLUMNS}\`,
      [req.user.id, courtId, start, end, totalCents, notes ?? null],
    );
    sendEmail({ to: req.user.email, subject: 'Booking confirmed', text: \`Court \${courtId}, \${start.toISOString()}\` }).catch(() => {});
    res.status(201).json({ booking: rows[0] });
  } catch (err) {
    if (err.code === '23P01') return res.status(409).json({ error: 'That time is already booked' });
    res.status(500).json({ error: err.message });
  }
});`,
      },
      {
        type: 'warning',
        text: 'This is what a tool typically writes, and it works, which is exactly why it is dangerous to stop here. It trusts `totalCents` from the browser, never checks `hours`, and leaks `err.message` in a 500. Keep a list as you read. Lessons 8 and 9 fix these one at a time, with proof.',
      },
      { type: 'heading', text: 'Test the API with real calls' },
      {
        type: 'paragraph',
        text: '`curl` is a command that makes a web request from your terminal. Run the server, sign up (the server answers with a cookie), then try the happy path and the rule that matters. The `-c` and `-b` flags save and send the cookie, like a tiny browser. These outputs are from the course project:',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Sign up, then list the courts and book one',
        code: `curl -s -c jar -X POST localhost:3000/api/auth/register -H 'content-type: application/json' \\
  -d '{"name":"Ana Reyes","email":"ana@example.com","password":"correct-horse-9"}'
curl -s localhost:3000/api/courts
curl -s -b jar -X POST localhost:3000/api/bookings -H 'content-type: application/json' \\
  -d '{"courtId":1,"startsAt":"2026-12-05T18:00:00+08:00","hours":2,"totalCents":70000}'`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real responses',
        code: `{"user":{"id":1,"name":"Ana Reyes","email":"ana@example.com","role":"customer"}}
{"courts":[{"id":1,"name":"Court A","pricePerHourCents":35000},{"id":2,"name":"Court B","pricePerHourCents":30000}]}
{"booking":{"id":1,"courtId":1,"startsAt":"2026-12-05T10:00:00.000Z","endsAt":"2026-12-05T12:00:00.000Z","totalCents":70000,"status":"confirmed","notes":null,"proofFile":null}}`,
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Now the rule that matters: an overlapping booking',
        code: `curl -s -b jar -X POST localhost:3000/api/bookings -H 'content-type: application/json' \\
  -d '{"courtId":1,"startsAt":"2026-12-05T19:00:00+08:00","hours":1,"totalCents":35000}'`,
      },
      { type: 'code', language: 'text', label: 'Real response', code: '{"error":"That time is already booked"}' },
      {
        type: 'paragraph',
        text: 'The times are stored in UTC (6 PM Manila is 10:00 UTC), which is the safe way to keep time in a database; the screens convert back to Manila time for display. The second booking was refused, and the status code with it was `409 Conflict`. Checking the status code, not just the message, is how you will later write tests.',
      },
      {
        type: 'version',
        text: "Express 5 sends errors thrown or rejected in async route handlers to its error handling automatically, so generated routes no longer need a try/catch around every await, and its default error handler hides the stack trace in production. Express 5 also changed route path syntax: a bare `*` must now be named (the Express 5 migration guide shows `/{*splat}`). The statuses used here follow MDN's HTTP status reference. Checked against Express 5.x docs and the project built on Express 5.3.0.",
        checked: CHECKED,
        sources: [DOCS.expressErrors, DOCS.expressMigrating, DOCS.mdnStatus],
      },
      { type: 'visual', id: 'web-rest-crud', caption: 'Try the verbs on a pretend resource: read, create, change and delete.' },
      {
        type: 'paragraph',
        text: 'Picture the **order window** of a canteen. The dining room (the front end) hands a slip through the window: "POST a booking: Court A, 6 to 8 PM". The kitchen (the back end) checks the slip against its rules, asks the pantry (the database) to write it down, and passes back a number: `201` means "done", `409` means "someone already has that table". Each route in the table is one kind of slip the window accepts.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'Reading the route above in everyday words: `async (req, res) => { ... }` is the instruction "when a slip arrives (`req`), do these steps and write the reply on `res`". `req.body` is what was written on the slip; `req.user` is who handed it in (found from their cookie, a small ticket the browser keeps). The `query(...)` line asks the database to save the booking, and `res.status(201).json(...)` sends back the answer. Words like `try` and `catch` mean "attempt this, and if the database refuses, do the other thing".',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Walk me through this route one line at a time and say what could go wrong at each line." The second half of that sentence is where the useful part is.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: `Since you have written small servers before, review this generated route the way you would review a colleague's pull request: where is input validated, what is trusted from the client, what happens on a database error, and is the work atomic? Check-then-insert ("is the slot free? then insert") is a race: two requests can both see "free". The generated code avoids it by letting the database refuse the second insert, which is the right design and worth keeping when you ask for refactors.`,
        audience: { min: 'intermediate', max: 'intermediate' },
      },
      {
        type: 'paragraph',
        text: 'Treat the route table as an API contract and keep it in the repository (an OpenAPI document or a typed schema), so the AI, the tests and the front end all work from one source. Decide early on the conventions that are costly to change: error shape, pagination for list routes, idempotency for `POST` (a double-clicked Book button or a retried request should not create two bookings: accept an idempotency key or rely on a unique constraint), and versioning if clients you do not control will call the API. Prefer constraints in the database for invariants and keep handlers thin, so the same rule holds for the next route, the next service and the next agent-written change.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'An API route is a path plus a verb; the status code says how it went (2xx worked, 4xx bad request, 5xx server failure).',
          'Ask the AI for the route table first and keep it as the contract between front end and back end.',
          'Express passes a request through middleware in order, so the order matters: a route sees req.user only because loadUser ran first.',
          'Test with curl and check status codes, not only messages; a first generated route that works can still trust the client too much.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-03-arrange-1',
          kind: 'arrange',
          title: 'Put one request in order',
          prompt: 'Arrange the steps of a booking request in the order the server takes them.',
          concept: 'request flow',
          language: 'text',
          solution: [
            'The browser sends POST /api/bookings with the session cookie',
            'express.json() turns the body into req.body',
            'loadUser finds the signed-in customer from the cookie',
            'requireLogin refuses the request if nobody is signed in',
            'The route works out the end time and tries to save the booking',
            'The database accepts it, or refuses an overlapping booking',
            'The route answers 201 Created, or 409 Conflict if it was refused',
          ],
          reasons: [
            'Everything starts with the request arriving.',
            'The body must be read before any route can use req.body.',
            'The user must be identified before anything can check whether they are signed in.',
            'Anonymous requests stop here, before any work is done.',
            'Only a signed-in request reaches the booking logic.',
            'The database is the final judge of an overlap.',
            'The answer depends on what the database said.',
          ],
          hints: [
            'Which step must happen before the server can look inside the request?',
            'Identifying the user comes before checking that there is a user.',
            'The database answer comes just before the route sends its reply.',
          ],
          explanation: 'The body is read, then the user is identified, then access is checked, then the route runs, then the database decides, and finally the status code goes back. Each step relies on the one before it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-03-match-1',
          kind: 'match',
          title: 'Which status code?',
          prompt: 'Match each situation to the status code the API should answer with.',
          concept: 'status codes',
          labels: { terms: 'Situation', meanings: 'Status code' },
          pairs: [
            { term: 'Ben asks for his bookings but is not signed in', definition: '401 Unauthorized', note: 'The server does not know who he is.' },
            {
              term: "Ana books an hour that overlaps Ben's booking",
              definition: '409 Conflict',
              note: 'The request is well formed but clashes with existing data.',
            },
            { term: 'A booking request says hours: 9', definition: '400 Bad Request', note: 'The request itself breaks a rule.' },
            {
              term: 'Someone asks for booking number 99999, which does not exist',
              definition: '404 Not Found',
              note: 'There is nothing at that address.',
            },
          ],
          hints: [
            'Which situation is about who you are?',
            'One situation is a clash with data that already exists.',
            'A request that breaks a rule on its own is a bad request; a missing thing is not found.',
          ],
          explanation: 'The code tells the front end what kind of problem to show: sign in (401), fix the form (400), choose another time (409) or the thing is gone (404).',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-03-q1',
        prompt: 'Why ask the AI for a table of routes before it writes any code?',
        choices: [
          'The tool writes shorter code when it has a table, which makes the server run more quickly',
          'It becomes a contract you can approve and later compare with the code',
          'Express will refuse to start unless a route table has been supplied to the application first',
        ],
        answer: 1,
        explanation: 'A route table is a plan you can review in a minute. It becomes the contract that the front end, the tests and the code are checked against.',
      },
      {
        id: 'build-fullstack-ai-03-q2',
        prompt: 'In app.js, loadUser is registered before the routes. What happens if it were registered after them?',
        choices: [
          'Routes would run without req.user, so every signed-in check would fail or misbehave',
          'Nothing would change, because Express sorts middleware into a sensible order by itself',
          'The server would refuse to start because middleware must come before routes',
          'Only the login route would be affected, since all the other routes ignore the user',
        ],
        answer: 0,
        explanation: 'Express runs middleware in the order it was registered. A route that depends on req.user needs loadUser to run first.',
      },
      {
        id: 'build-fullstack-ai-03-q3',
        prompt: 'An overlapping booking is refused. Which response should the API send?',
        choices: [
          '200 OK with a message saying the booking failed, so the front end never has to handle errors',
          '500 Internal Server Error, because the database raised an error while the server tried to save it',
          '409 Conflict with a clear message, because the request is valid but clashes with existing data',
        ],
        answer: 2,
        explanation: '409 tells the front end the request clashed with current data, so it can ask for another time. 200 hides the failure and 500 means the server itself broke.',
      },
      {
        id: 'build-fullstack-ai-03-q4',
        prompt: 'In the generated route the SQL uses $1 to $6 and passes the values in an array. Why does that matter?',
        choices: [
          'It makes the query run faster than building the text with the values inside it',
          'It encrypts the values on their way to the database so that nobody on the network can read them',
          'It is only a style choice; the result is the same as joining the values into the SQL text',
          "It lets the database tell the command apart from the customer's words, so values are never run as SQL",
        ],
        answer: 3,
        explanation: 'Placeholders send the SQL and the values separately, so a value can never be interpreted as part of the command. Lesson 9 shows what happens when a route skips this.',
      },
      {
        id: 'build-fullstack-ai-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does the status code 201 tell the screen?',
        choices: ['Something broke on the server, so try again later', 'You must sign in first', 'Done: the thing you asked to create was created'],
        answer: 2,
        explanation: 'The 2xx codes mean success, and 201 specifically means that something new was created.',
      },
      {
        id: 'build-fullstack-ai-03-q6',
        audience: { min: 'advanced' },
        prompt: 'Customers on slow phones sometimes tap Book twice, and the API creates two bookings of the same hour for the same person. Which design is strongest?',
        choices: [
          'A database constraint that refuses the duplicate, plus an optional idempotency key',
          'Check in the route whether an identical booking exists, and insert only if none was found',
          'Disable the Book button in the front end and trust it, since users cannot press a disabled button',
          'Add a delay of two seconds to every booking request so the second tap always arrives too late',
        ],
        answer: 0,
        explanation: 'Invariants belong in the database, which is atomic. A check-then-insert in code is a race, and a disabled button only helps honest users on one device.',
      },
    ],
    task: {
      title: 'Build the API and test it from the terminal',
      minutes: 20,
      steps: [
        'Send your AI tool the back end prompt with your SPEC.md and approve the route table it proposes (change anything you disagree with).',
        'Ask it to generate the API and a short README that says how to run it, then start the server.',
        'Using curl with a cookie jar, sign up, create one booking and try to create an overlapping one. Write the status code of each response next to the route table.',
        'List three things in the generated booking route that you do not trust yet, and add them to a REVIEW.md file for lesson 9.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to explain each line of the POST /api/bookings route in plain words, then change the success message of one route by prompt and call it again to see the new answer.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Ask the agent to produce an OpenAPI description of the route table, and add a test that fails when the code has a route that the description does not list.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-04',
    day: 4,
    title: 'Design the database by asking',
    summary: 'Have AI design the tables, then read them for keys, constraints, money and time, and let the database itself refuse a double booking.',
    intro: {
      objectives: [
        'Ask an AI tool for a database design from your spec and read it as tables, keys and constraints',
        'Explain why money is stored in whole centavos and times in UTC',
        'Show that the database, not only the code, can refuse an overlapping booking',
      ],
      why: 'Code can be fixed tomorrow, but bad data stays. A database that refuses impossible bookings protects you even from bugs in code the AI wrote and you did not notice, so reading the schema is one of the highest-value reviews you can do.',
    },
    minutes: 25,
    skills: ['database'],
    body: [
      {
        type: 'paragraph',
        text: "The database is the application's memory, and it is the part that is hardest to change once real customers have put data in it. That makes it a good place to slow down and think, and a good place to use AI as a design partner rather than just a code generator. In this lesson you will ask for a schema, learn to read it, and see one idea that makes AI-built apps much safer: letting the database enforce the rules that must never be broken.",
      },
      { type: 'heading', text: 'Ask for a design, then read it' },
      {
        type: 'paragraph',
        text: 'A **schema** is the description of the database: its **tables** (one per kind of thing, like a sheet in a spreadsheet), the **columns** of each table (the fields), and the rules that keep the data sensible. Each row needs a **primary key**, a unique number that names it, and a row that refers to another, like a booking pointing at the customer who made it, holds that number as a **foreign key**. Ask the tool to propose the schema from your spec and to explain each choice, and do not let it write code you have not seen the design for.',
      },
      {
        type: 'prompt',
        label: 'Database prompt: design before SQL',
        text: `From the spec below, design the PostgreSQL schema. First give me the tables and columns as a short list with the reason for each choice, then the SQL as a numbered migration file (001_init.sql). Requirements: money as whole centavos in an integer column; times as timestamptz; a status column limited to known values; foreign keys everywhere a row refers to another; and make the database itself refuse two confirmed bookings of the same court that overlap in time. Do not store passwords, only a hash. List anything in the spec that the schema cannot enforce.

[paste SPEC.md]`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `erDiagram
  users ||--o{ bookings : makes
  courts ||--o{ bookings : "is booked in"
  users ||--o{ sessions : "signs in with"`,
        caption: 'The four tables of Sampaguita Court. A line with a fork at one end means "one to many": one customer, many bookings.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'server/db/001_init.sql: the bookings table (as generated)',
        code: `CREATE TABLE bookings (
  id          serial PRIMARY KEY,
  user_id     integer NOT NULL REFERENCES users (id),
  court_id    integer NOT NULL REFERENCES courts (id),
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz NOT NULL,
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  status      text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  notes       text,
  proof_file  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at AND ends_at <= starts_at + interval '3 hours'),
  -- The database itself refuses two confirmed bookings of one court that overlap in time.
  EXCLUDE USING gist (court_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status = 'confirmed')
);`,
      },
      {
        type: 'paragraph',
        text: 'Four choices in that file are worth understanding, because you will check for them in any schema an AI gives you. **Money is an integer of centavos** (`total_cents`): decimals like 350.10 cannot be stored exactly as floating-point numbers, so cents that drift by a fraction would eventually show up as wrong totals. **Times are `timestamptz`**, which the database stores in UTC and converts for display; the screens show Manila time. **Constraints** (`CHECK`) refuse nonsense: a booking must end after it starts and last at most three hours, whatever the code sends. And the last line, the **exclusion constraint**, is the clever one: it tells the database that two rows with the same `court_id` and overlapping time ranges may not both be confirmed.',
      },
      {
        type: 'version',
        text: "PostgreSQL's constraints documentation describes exclusion constraints (`EXCLUDE USING gist`) as guaranteeing that, comparing any two rows on the given operators, at least one comparison returns false or null; adding one creates a GiST index. Mixing an equality column (`court_id WITH =`) with a range overlap (`&&`) needs the `btree_gist` extension, as in the migration above. The docs checked are for PostgreSQL 18, the current release on that date; the course project ran on PostgreSQL 14.18 locally, where the same migration works.",
        checked: CHECKED,
        sources: [DOCS.pgConstraints],
      },
      { type: 'heading', text: 'Let the database say no' },
      {
        type: 'paragraph',
        text: `Why enforce overlap in the database when the code can check too? Because code can have bugs and because of **timing**: if two customers press Book at the same moment, a check in the code ("is the slot free?") can answer "yes" to both before either has saved, and you get a double booking. The database handles one insert at a time against the same index, so it cannot be fooled this way. Here are the real answers from the course project's database when the same insert is tried:`,
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Three inserts, after Ana holds Court A from 18:00 to 20:00',
        code: `INSERT INTO bookings (user_id, court_id, starts_at, ends_at, total_cents)
VALUES (2, 1, '2026-12-05 19:00+08', '2026-12-05 20:00+08', 35000);  -- overlaps Ana's booking

INSERT INTO bookings (user_id, court_id, starts_at, ends_at, total_cents)
VALUES (2, 1, '2026-12-05 20:00+08', '2026-12-05 21:00+08', 35000);  -- starts exactly when Ana's ends

INSERT INTO bookings (user_id, court_id, starts_at, ends_at, total_cents)
VALUES (2, 1, '2026-12-06 10:00+08', '2026-12-06 15:00+08', 35000);  -- five hours`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real results from psql',
        code: `ERROR:  conflicting key value violates exclusion constraint "bookings_court_id_tstzrange_excl"
DETAIL:  Key (court_id, tstzrange(starts_at, ends_at))=(1, ["2026-12-05 19:00:00+08","2026-12-05 20:00:00+08")) conflicts with existing key (court_id, tstzrange(starts_at, ends_at))=(1, ["2026-12-05 18:00:00+08","2026-12-05 20:00:00+08")).

INSERT 0 1

ERROR:  new row for relation "bookings" violates check constraint "bookings_check"`,
      },
      {
        type: 'paragraph',
        text: 'Three outcomes: the overlap is refused with a precise message, the back-to-back booking is accepted (the range notation `[18:00, 20:00)` includes the start and excludes the end, so 20:00 is free), and the five-hour booking is refused by the check. The API turns the first into a `409` (error code `23P01`, which the route in lesson 3 already handles) and the screen shows "That time is already booked".',
      },
      { type: 'heading', text: 'Changing the schema safely: migrations' },
      {
        type: 'paragraph',
        text: 'You never edit the live database by hand. A **migration** is a numbered SQL file that is applied once and recorded, so every copy of the app, on your laptop, in tests and in production, ends up with the same tables. The generated runner is small: it creates a `schema_migrations` table, applies any file it has not recorded, and wraps each in a transaction so a failed file leaves nothing half-done. Run twice, it is safe:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the migration command',
        code: `applied 001_init.sql
migrations up to date`,
      },
      {
        type: 'warning',
        text: 'Once a migration has run anywhere beyond your laptop, never edit it. Add a new file (002_...) instead. An edited old file would be skipped on databases that already ran it, so the copies would silently drift apart. Also never give an AI tool the password of a production database to "fix the schema": work on a copy.',
      },
      {
        type: 'table',
        headers: ['Schema review question', 'In Sampaguita Court', 'Red flag'],
        rows: [
          ['How is money stored?', 'Integer centavos', 'float, or text such as "₱350"'],
          ['How are times stored?', 'timestamptz (UTC)', 'text, or local time with no zone'],
          ['Which rules does the database enforce?', 'No overlap, 1 to 3 hours, valid status', 'Everything left to code'],
          ['Are relationships declared?', 'Foreign keys on user and court', 'Numbers that point at nothing'],
          ['What is stored for passwords?', 'A salted hash only', 'The password itself'],
        ],
        caption: 'A five-line review of any generated schema.',
      },
      { type: 'visual', id: 'web-database-joins', caption: 'See how a booking row is joined to its customer and court when you read it.' },
      {
        type: 'paragraph',
        text: `Think of a **spreadsheet** with one tab per kind of thing: a \`users\` tab, a \`courts\` tab and a \`bookings\` tab. Each row is one customer, one court or one booking, and the first column gives every row its own number so you can point at it. A booking row does not repeat the customer's name; it holds the customer's number, like writing "see row 7 of the users tab". The special rules we added work like spreadsheet validation, but stricter: a booking row simply cannot be saved if it overlaps another or lasts five hours.`,
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'The SQL file above is a list of instructions the database follows once: `CREATE TABLE` makes a new tab, each line inside is a column with its type (`integer` is a whole number, `text` is words, `timestamptz` is a date and time), `NOT NULL` means "this cannot be empty", and `REFERENCES users (id)` means "this number must exist in the users tab".',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Draw this schema as a picture and explain each foreign key in one sentence." Check the picture against the spec: every noun in your spec should be a table or a column.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: `Beyond correctness, review a generated schema for how it will change and how it will be queried. Migrations in production need an expand and contract approach (add the new column nullable, backfill in batches, deploy code that writes both, then drop the old one) because some statements lock the table, and a long lock on \`bookings\` is an outage. Check indexes against the real queries (\`user_id, starts_at\` serves "my bookings"; the exclusion constraint's index serves availability), use \`EXPLAIN\` before trusting a slow query, and decide the isolation story: the constraint gives serialisable behaviour for overlaps, but multi-step business rules (credits, quotas) need transactions and either explicit locks or a higher isolation level. If the data access will happen from the browser, as with some hosted backends, access control moves into the database as row-level security policies; PostgreSQL's default for a table with RLS enabled and no policy is to deny everything.`,
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'A schema is tables, columns, keys and constraints; ask the AI to design it and explain each choice before it writes SQL.',
          'Store money as whole centavos and times as timestamptz; both avoid silent, expensive errors.',
          'Let the database refuse impossible data: an exclusion constraint stops overlapping bookings even when two requests arrive at the same moment.',
          'Change the schema only through numbered migrations and never edit one that has already run elsewhere.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-04-code-1',
          kind: 'code-challenge',
          title: 'Detect a double booking',
          prompt: 'Write isDoubleBooked(existing, booking). Each item has courtId, start and end, with times as whole hours of the day (18 means 6 PM). It returns true when the new booking is on the same court and overlaps an existing one. A booking that starts exactly when another ends is fine.',
          concept: 'overlap check',
          language: 'javascript',
          starter: `function isDoubleBooked(existing, booking) {
  // existing: [{ courtId, start, end }]
  // booking: { courtId, start, end }
  return false;
}`,
          solution: `function isDoubleBooked(existing, booking) {
  return existing.some(
    (other) => other.courtId === booking.courtId && other.start < booking.end && booking.start < other.end
  );
}`,
          tests: {
            kind: 'function',
            fn: 'isDoubleBooked',
            cases: [
              {
                label: 'partial overlap on the same court',
                args: [[{ courtId: 1, start: 18, end: 20 }], { courtId: 1, start: 19, end: 21 }],
                expected: true,
              },
              { label: 'back to back is fine', args: [[{ courtId: 1, start: 18, end: 20 }], { courtId: 1, start: 20, end: 21 }], expected: false },
              { label: 'same hours, other court', args: [[{ courtId: 1, start: 18, end: 20 }], { courtId: 2, start: 18, end: 20 }], expected: false },
              {
                label: 'new booking inside an existing one',
                args: [[{ courtId: 1, start: 17, end: 21 }], { courtId: 1, start: 18, end: 19 }],
                expected: true,
              },
              {
                label: 'new booking wraps an existing one',
                args: [[{ courtId: 1, start: 18, end: 19 }], { courtId: 1, start: 17, end: 21 }],
                expected: true,
              },
              { label: 'nothing booked yet', args: [[], { courtId: 1, start: 9, end: 10 }], expected: false },
            ],
          },
          hints: [
            'Two time ranges overlap when each one starts before the other one ends.',
            'Compare other.start < booking.end and booking.start < other.end, and also compare the court.',
            'Use existing.some(...) with courtId equal, other.start < booking.end and booking.start < other.end.',
          ],
          explanation: "Two ranges overlap exactly when each starts before the other ends. Using < (not <=) makes the end exclusive, so a booking that starts when another ends is allowed, just like the database's [start, end) ranges.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-04-scenario-1',
          kind: 'scenario',
          title: 'How should the price be stored?',
          prompt: 'Choose the column design you would approve in review.',
          concept: 'storing money',
          situation: 'The AI proposes three ways to store the price of an hour at Court A, which is 350 pesos. Totals are added up for reports at the end of each month, and a customer can pay 350.50 for a special slot.',
          options: [
            {
              text: 'An integer column price_per_hour_cents holding 35000, formatted as pesos only when shown',
              consequence: 'Totals are exact whole numbers, a 350.50 slot is 35050, and a report is a plain sum with no rounding surprises.',
              quality: 'best',
            },
            {
              text: 'A float column price holding 350.5, which is easy to read in the database',
              consequence: 'Floating-point numbers cannot store most decimals exactly, so sums drift by tiny fractions and a monthly report is off by a few centavos nobody can explain.',
              quality: 'poor',
            },
            {
              text: 'A text column holding "₱350.50", exactly as the screen shows it',
              consequence: 'You cannot add the values without parsing them, a different currency symbol breaks the code, and sorting by price gives wrong results.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which choice lets you add numbers exactly?',
            'Decimals such as 0.1 cannot be stored exactly as floating-point numbers.',
            'Whole centavos in an integer column are exact and easy to sum.',
          ],
          explanation: 'Integers are exact. Storing centavos and formatting only for display avoids rounding errors, and the same idea works for any currency.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-04-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Spreadsheet words, database words',
          prompt: 'Tap each card to compare a spreadsheet idea with its database word.',
          concept: 'database vocabulary',
          hints: [],
          explanation: 'A database is a strict, shared spreadsheet that can refuse rows that break the rules.',
          cards: [
            { front: 'A tab in the spreadsheet', back: 'A table: one kind of thing, such as users, courts or bookings.' },
            { front: 'A column heading', back: 'A column: one field, such as starts_at or total_cents.' },
            { front: 'The row number', back: 'A primary key: a unique number that names one row.' },
            { front: '"See row 7 of the users tab"', back: 'A foreign key: a number that points at a row in another table.' },
            {
              front: 'Data validation that refuses bad entries',
              back: 'A constraint: a rule the database enforces, such as "no two overlapping bookings".',
            },
          ],
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-04-q1',
        prompt: 'Why does the schema store the price as total_cents, an integer, rather than a decimal number of pesos?',
        choices: [
          'Integers take less disk space, and a smaller database always runs faster than a larger one',
          'Exact whole numbers add up without the rounding errors that decimal floating-point numbers cause',
          'PostgreSQL cannot store a decimal point in any column, so every amount has to be an integer',
        ],
        answer: 1,
        explanation: 'Floating-point cannot represent most decimals exactly, so totals drift. Whole centavos are exact and are formatted as pesos only for display.',
      },
      {
        id: 'build-fullstack-ai-04-q2',
        prompt: 'The route checks "is the slot free?" and then inserts. Two customers press Book at the same instant. Why can both succeed without a database constraint?',
        choices: [
          'It cannot happen: a Node.js server only ever handles a single request at one time',
          'The database allows exactly one insert per second, so the second request is queued and then accepted',
          'The checks use different time zones, so the slot looks free to one of the two customers',
          'Both checks can run before either insert has finished, so both see the slot as free',
        ],
        answer: 3,
        explanation: 'Check-then-insert is a race. An exclusion constraint is evaluated by the database as part of the insert, so only one of the two can win.',
      },
      {
        id: 'build-fullstack-ai-04-q3',
        prompt: 'You need to add a "notes" column after the app has real data. What is the right way?',
        choices: [
          'Add a new numbered migration, 002_add_notes.sql, which every database applies once and records',
          'Edit 001_init.sql to include the column, because that file describes the whole schema',
          'Open the production database and add the column by hand, then update the migration file to match later',
        ],
        answer: 0,
        explanation: 'Migrations are append-only: an edited old file would be skipped wherever it already ran, so databases would silently differ.',
      },
      {
        id: 'build-fullstack-ai-04-q4',
        prompt: "An AI-generated schema stores the customer's password in a column called password. What do you do?",
        choices: [
          'Keep it, as long as the column is hidden from every API response',
          'Keep it, but shorten the allowed password length so that any leaked values are less useful',
          'Encrypt the column with a key stored in the same database so that it is protected at rest',
          'Reject it: store only a salted hash from a password hashing function, never the password itself',
        ],
        answer: 3,
        explanation: 'Anyone who reads the database would read the passwords. A salted hash cannot be turned back into the password. Lesson 5 shows how.',
      },
      {
        id: 'build-fullstack-ai-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a foreign key?',
        choices: [
          'The first column of every table, which gives that row its own unique number',
          'A secret code that the database asks for before it lets a visitor read any of the data inside it',
          'A number in one row that points at a row in another table, like a booking pointing at its customer',
        ],
        answer: 2,
        explanation: 'A foreign key links rows together. The primary key is the unique number of a row itself.',
      },
      {
        id: 'build-fullstack-ai-04-q6',
        audience: { min: 'advanced' },
        prompt: 'You must rename a heavily used column in a live table with zero downtime. Which plan is safest?',
        choices: [
          'Rename it in one migration during off-peak hours, because renames are instant in every case',
          'Add the new column, backfill in batches, deploy code that writes both, then drop the old one later',
          'Drop the table and recreate it from a nightly backup with the new column name already in place',
          'Ask the agent to rewrite every query to use the new name and deploy everything at once',
        ],
        answer: 1,
        explanation: 'Expand and contract keeps old and new code working at the same time, and avoids long locks and a hard cutover.',
      },
    ],
    task: {
      title: 'Design and test the database',
      minutes: 20,
      steps: [
        'Send the database prompt with your SPEC.md and read the design before the SQL. Check money, time, constraints and foreign keys with the review table.',
        'Create a local PostgreSQL database, run the migration and insert two overlapping bookings by hand (psql or any database tool). Write down the error message.',
        'Insert a back-to-back booking and a five-hour booking and note what happens to each.',
        'Run the migration command a second time and confirm it changes nothing.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to explain each table as a spreadsheet tab and each column as a heading, then draw the four tables on paper with arrows for the foreign keys.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write the migration that adds a nullable cancelled_at column, with a batched backfill plan and a rollback note, and check the lock behaviour of each statement in the PostgreSQL docs before you run it.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-05',
    day: 5,
    title: 'Add sign-in and user accounts',
    summary: 'Direct an AI tool to add accounts, then check the four things that matter: how passwords are stored, how a session works, what the cookie says and what the errors reveal.',
    intro: {
      objectives: [
        'Trace sign-up, sign-in and a signed-in request through hashing, a session row and a cookie',
        'Check generated authentication code against a five-point checklist',
        'Decide when to hand-write sign-in and when to use a maintained library or service',
      ],
      why: 'Sign-in is the part of an application that attackers test first and customers trust most. AI writes it fluently, so the skill that matters is not typing it but knowing exactly what a safe version looks like.',
    },
    minutes: 25,
    skills: ['accounts'],
    body: [
      {
        type: 'paragraph',
        text: 'So far anyone could call the API. Accounts change that: **authentication** answers "who are you?" and **authorisation** (lesson 9) answers "what are you allowed to do?". In this lesson the AI adds sign-up, sign-in and sign-out. You will not memorise the code. You will learn the shape of a safe design, so that when a tool hands you a hundred lines of authentication you can check the handful of places where mistakes are made.',
      },
      { type: 'heading', text: 'The shape of a safe design' },
      {
        type: 'paragraph',
        text: 'The browser cannot prove who it is on every request without help, so the server gives it a small secret after sign-in and asks for it back each time. Two ideas make this safe. First, the server **never stores the password**. It stores a **hash**: a one-way scramble of the password plus a random **salt** (extra random text, so two people with the same password get different hashes). When you sign in, the server scrambles what you typed the same way and compares. Second, after a good sign-in the server creates a **session**: a long random value, stored on the server (its hash, again) and given to the browser in a **cookie**. Each later request carries the cookie, and the server looks the session up.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant B as Browser
  participant S as API
  participant D as Database
  B->>S: POST /api/auth/register (name, email, password)
  S->>S: Hash the password with a random salt
  S->>D: Save the user and the hash
  S->>D: Save a session (hash of a random token)
  S-->>B: 201 and Set-Cookie: sid=token
  B->>S: GET /api/bookings (Cookie: sid=token)
  S->>D: Find the unexpired session, then the user
  S-->>B: 200 with that user's data`,
        caption: 'Sign-up and then a signed-in request. The password itself is never saved; the token is saved only as a hash.',
      },
      {
        type: 'prompt',
        label: 'Authentication prompt (a spec for sign-in)',
        text: "Add accounts to the API. Requirements: register, login, logout and me routes. Passwords are hashed with a salted, slow password hash (Node's built-in scrypt or a maintained library; never MD5, SHA-1 or plain SHA-256 alone), compared in constant time. Sessions: a random 32-byte token in an HttpOnly, SameSite=Lax cookie (Secure in production), stored on the server only as a SHA-256 hash with an expiry of 7 days, deleted on logout. The same message for a wrong email and a wrong password. Roles come from the database, never from the request. Do not log passwords or tokens. List anything you are unsure of.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/auth.js: hashing and sessions (as generated)',
        code: `const scryptAsync = promisify(scrypt);
const SESSION_DAYS = 7;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return \`\${salt.toString('hex')}:\${key.toString('hex')}\`;
}

export async function verifyPassword(password, stored) {
  const [saltHex, keyHex] = stored.split(':');
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(actual, expected);
}

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

export async function startSession(res, userId) {
  const token = randomBytes(32).toString('base64url');
  await query(
    \`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))\`,
    [sha256(token), userId, SESSION_DAYS],
  );
  res.cookie('sid', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export async function endSession(req, res) {
  if (req.cookies.sid) await query('DELETE FROM sessions WHERE token_hash = $1', [sha256(req.cookies.sid)]);
  res.clearCookie('sid');
}`,
      },
      {
        type: 'paragraph',
        text: "Read it as five questions. **Where is the password?** Nowhere: `hashPassword` makes a random salt, runs it through `scrypt` (a deliberately slow function, so guessing millions of passwords is expensive) and stores `salt:hash`. **How is it compared?** `verifyPassword` repeats the scramble and uses `timingSafeEqual`, which takes the same time whether the first byte or the last differs. **What is the session?** `randomBytes(32)` is a value nobody can guess; only its SHA-256 hash is stored, so a leaked database does not hand out working logins. **What does the cookie say?** `httpOnly` hides it from page scripts, `sameSite: 'lax'` stops most cross-site sends, `secure` limits it to HTTPS in production, and `maxAge` ends it. **Does logout really log out?** `endSession` deletes the row on the server, not just the cookie in the browser.",
      },
      { type: 'paragraph', text: "This is what the project's database and the browser actually hold after one sign-up (real output):" },
      {
        type: 'code',
        language: 'text',
        label: 'The response header the browser stores',
        code: `HTTP/1.1 201 Created
Set-Cookie: sid=VVVtSxj6J3emhpjhEHhqzLA_PiprhdNjZkPHL_LN2kQ; Max-Age=604800; Path=/; Expires=Sat, 21 Nov 2026 07:54:02 GMT; HttpOnly; SameSite=Lax`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'What the database holds (psql, hash shortened)',
        code: `-[ RECORD 1 ]-+------------------------------------------
id            | 1
email         | ana@example.com
role          | customer
password_hash | 745e9f28bcb354caf03100040a80cc7a:bf0b5cac8d0192f0740046a6b4f0e3a4edc49d4536f33c1d30a04eb8c9b7709020d9651...

-[ RECORD 1 ]----------------------------------------------------------------
token_hash | c57d04fe0ecadd5e44912a204dccf805b8ebabf35785a69ebf6af4b938ac2129
user_id    | 1
expires_at | 2026-11-21 15:54:02.684085+08`,
      },
      {
        type: 'paragraph',
        text: 'The token in the cookie (`VVVtSx...`) and the `token_hash` in the database are different strings: the database can recognise the token when it arrives, but cannot reproduce it. Now the other half of the lifecycle, again from the real project:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'me, a wrong password, logout, then me again (real responses)',
        code: `{"user":{"id":1,"email":"ana@example.com","name":"Ana Reyes","role":"customer"}}
{"error":{"code":"bad_login","message":"Wrong email or password"}}
[204]
{"error":{"code":"not_signed_in","message":"Please sign in"}}`,
      },
      {
        type: 'version',
        text: "Node.js's crypto module provides scrypt (key derivation), randomBytes, timingSafeEqual and randomUUID; the docs checked are for the current LTS line (v26 on the date checked; the project ran on Node 22). MDN documents the cookie attributes used here: HttpOnly hides a cookie from document.cookie, Secure sends it only over https (localhost is exempt), SameSite=Lax withholds it from most cross-site requests, and Max-Age sets its life in seconds. The Express security guide recommends non-default cookie options and limiting repeated authorisation attempts. Hosted services such as Supabase Auth provide password, magic link, social and single sign-on sign-in, identifying users with JSON Web Tokens that its row level security policies can read.",
        checked: CHECKED,
        sources: [DOCS.nodeCrypto, DOCS.mdnCookie, DOCS.expressSecurity, DOCS.supaAuth],
      },
      { type: 'heading', text: 'Build it, or buy it?' },
      {
        type: 'paragraph',
        text: 'An AI tool can write the code above in seconds, and it is a good way to learn what sign-in is. For an application that holds real customers, though, the safer default is to use a **maintained library or an authentication service** and configure it carefully, because they also handle things that a hand-written version forgets: password resets by email, limiting guessing, two-step sign-in, social sign-in and security fixes you did not have to notice. The review skills are the same either way: you still check the cookie settings, the error messages and who is allowed to do what. Whichever you choose, put the decision and the reason in the spec.',
      },
      {
        type: 'table',
        headers: ['Auth review question', 'Good answer', 'Red flag'],
        rows: [
          [
            'How are passwords stored?',
            'Salted, slow hash (scrypt, argon2, bcrypt)',
            'Plain text, MD5, a fast hash, or encrypted so it can be read back',
          ],
          [
            'What proves who you are?',
            'Random session token, stored hashed, with expiry',
            'A guessable id, the user id in the cookie, a token that never expires',
          ],
          ['What does the cookie say?', 'HttpOnly, SameSite, Secure in production, Max-Age', 'None of these flags, or a token in localStorage'],
          ['What do errors reveal?', 'One message for wrong email or wrong password', '"No account with that email" versus "Wrong password"'],
          ['Does logout work?', 'Server deletes the session', 'Only the browser forgets the cookie'],
        ],
        caption: "Five checks for any generated sign-in code. The first version of this course's project failed the fourth; lesson 9 shows the fix.",
      },
      {
        type: 'warning',
        text: `The first version of the project's login route answered "No account with that email" for one failure and "Wrong password" for the other. That tells an attacker which emails have accounts. It is one of several review findings in lesson 9, found by reading the answers, not the code.`,
      },
      { type: 'visual', id: 'web-auth-flow', caption: 'Follow the steps of a sign-in from the form to the cookie.' },
      {
        type: 'paragraph',
        text: `Think of a **cloakroom**. When you hand in your coat you get a numbered ticket, and the cloakroom keeps a note of the number. The ticket (the cookie) is useless without the cloakroom's notebook (the session in the database), and if you lose it you ask the cloakroom to cancel that number (sign out). The ticket must be hard to guess; "1, 2, 3" would let anyone take any coat. Passwords work the other way: the cloakroom never writes your password in its notebook. It writes a **scrambled version that cannot be unscrambled**, and re-scrambles whatever you say at the door to see if it matches.`,
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'In the code above: `hashPassword` scrambles a new password; `verifyPassword` re-scrambles a typed one and compares; `startSession` makes the ticket and the notebook entry; `endSession` cancels it; `loadUser` is the person at the door who reads your ticket on every visit and says "this is Ana". Words in the cookie line: `httpOnly` means page scripts cannot read the ticket, `secure` means it only travels on protected connections, and `maxAge` is how long the ticket stays valid.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "If someone stole the database, what could they do with the users table and the sessions table?" The right answer is: not log in, because only hashes are stored.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: "Threat-model the design before accepting it. Credential stuffing (reused passwords from other breaches) is stopped by rate limits, breached-password checks and optional second factors, not by hashing. Server-side sessions give instant revocation (delete a row to log someone out everywhere), which stateless JWTs do not; choose JWTs only when you have a reason and a revocation story. Cookie sessions bring CSRF into scope: SameSite=Lax covers most cases, but state-changing routes should still reject cross-origin requests you did not intend, and any cookie set for a parent domain widens the blast radius. Rotate the session id on privilege change, cap sessions per user, and log sign-in outcomes without the secrets. If you outsource identity, own the integration risks instead: verify tokens' signature, issuer and audience on every request, and keep service keys out of the browser.",
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Never store passwords: store a salted, slow hash, and compare in constant time.',
          'A session is a random token in an HttpOnly, SameSite cookie, kept on the server only as a hash with an expiry, and deleted on logout.',
          'Errors must not reveal which emails exist: use one message for a wrong email and a wrong password.',
          'For real customers, prefer a maintained library or service and configure it well; the review checklist is the same either way.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'Everyone is signed out immediately',
          prompt: 'Customers report that they are signed out the moment they sign in. The session check has one wrong line. Find it and choose the fix. A session is valid only while its expiry is still in the future.',
          concept: 'session expiry',
          language: 'javascript',
          code: `function isSessionValid(session, now) {
  return session.expiresAt < now;
}`,
          bugLine: 2,
          fixes: [
            {
              line: '  return session.expiresAt > now;',
              correct: true,
              why: 'The session is valid while its expiry time is later than the current time.',
            },
            {
              line: '  return session.expiresAt >= now;',
              correct: false,
              why: 'At the exact moment of expiry the session should already be over, so this keeps it alive one moment too long.',
            },
            {
              line: '  return session.expiresAt <= now;',
              correct: false,
              why: 'This is the opposite of the right idea: it accepts only expired sessions.',
            },
            {
              line: '  return now - session.expiresAt;',
              correct: false,
              why: 'This returns a number, not true or false, and it is positive for expired sessions.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'isSessionValid',
            cases: [
              { label: 'expires tomorrow', args: [{ expiresAt: 2000 }, 1000], expected: true },
              { label: 'expired yesterday', args: [{ expiresAt: 500 }, 1000], expected: false },
              { label: 'expires exactly now', args: [{ expiresAt: 1000 }, 1000], expected: false },
            ],
          },
          hints: [
            'Think about which time must be later: the expiry or the current time?',
            'The session is alive while the expiry is still ahead of now.',
            'Use expiresAt > now (and not >=, because expiry at exactly now is over).',
          ],
          explanation: 'The original compared the wrong way round, so only expired sessions counted as valid. A valid session has an expiry later than now; using > rather than >= also ends the session at the exact expiry moment.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-05-match-1',
          kind: 'match',
          title: 'Which cookie setting helps?',
          prompt: 'Match each danger to the cookie setting that reduces it.',
          concept: 'cookie flags',
          labels: { terms: 'Danger', meanings: 'Cookie setting' },
          pairs: [
            {
              term: 'A script injected into a page tries to read document.cookie',
              definition: 'HttpOnly',
              note: 'This hides the cookie from page scripts.',
            },
            {
              term: 'The cookie could travel over a plain http connection on café Wi-Fi',
              definition: 'Secure',
              note: 'This sends the cookie only over https (localhost excepted).',
            },
            {
              term: 'A page on another website makes the browser send a POST to your API',
              definition: 'SameSite=Lax',
              note: 'This withholds the cookie from most cross-site requests.',
            },
            {
              term: 'A stolen cookie should stop working after a week',
              definition: 'Max-Age (and a server-side expiry)',
              note: 'This limits how long the cookie, and the session behind it, lives.',
            },
          ],
          hints: [
            'One setting is about scripts, one about the connection, one about other sites, one about time.',
            'Secure is about the kind of connection; HttpOnly is about scripts on the page.',
            'SameSite is about requests coming from other websites; Max-Age is about time.',
          ],
          explanation: 'Each flag closes one door: scripts (HttpOnly), plain connections (Secure), other websites (SameSite) and old cookies (Max-Age). They work together, so a good sign-in sets all of them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-05-scenario-1',
          kind: 'scenario',
          title: 'Hand-written or bought?',
          prompt: "Choose how to add sign-in to the real booking app that will hold customers' emails.",
          concept: 'build or buy authentication',
          situation: 'The booking app will launch to real customers next month, with one developer maintaining it part time. The AI tool offers to hand-write sign-in in a few minutes.',
          options: [
            {
              text: 'Use a maintained authentication library or service, configure its cookie, reset and rate-limit settings, and review the result with the five-point checklist',
              consequence: 'Password resets, rate limits and security updates come with it, and your review time goes into the settings that are yours to get right.',
              quality: 'best',
            },
            {
              text: 'Keep the hand-written version because it is small, add scrypt hashing and tests, and plan to review it every quarter',
              consequence: 'It works and you understand it, but password reset, lockouts and security fixes are now your job too, and a part-time owner may miss them.',
              quality: 'acceptable',
            },
            {
              text: 'Hand-write it with a fast hash like plain SHA-256, since "it is only a small booking app"',
              consequence: 'A leaked database lets attackers test billions of password guesses a second, and customers who reuse passwords are exposed.',
              quality: 'poor',
            },
          ],
          hints: [
            'Who will maintain this after launch, and how much time do they have?',
            'The best choice also covers things the hand-written version forgets, like resets and limits.',
            'Using a maintained library or service, then checking its settings, is the strongest answer.',
          ],
          explanation: 'Sign-in is high-risk and mostly commodity. A maintained library or service gets security fixes and extras for free, and your review effort goes to configuration. A hand-written version can be acceptable with care, but a fast hash is never acceptable for passwords.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-05-q1',
        prompt: 'Why does the server store only a hash of the session token instead of the token itself?',
        choices: [
          'Hashes are always shorter than tokens, so the table takes up much less space and the lookup made on each request runs a lot faster',
          'A leaked sessions table cannot be used to sign in as anyone, because the hashes cannot be turned back into tokens',
          "The browser refuses to accept any cookie unless the server also holds a hashed copy of the cookie's value in its own database",
        ],
        answer: 1,
        explanation: 'The cookie holds the real token; the database holds a one-way hash. A database leak then does not give attackers working sessions.',
      },
      {
        id: 'build-fullstack-ai-05-q2',
        prompt: 'The login route says "No account with that email" for an unknown email and "Wrong password" otherwise. What is the problem?',
        choices: [
          'An attacker can discover which emails have accounts, so use one message such as "Wrong email or password"',
          'The messages are written in English only, which is a real problem for the customers who would rather read the form in Filipino',
          'Nothing is wrong: clear and specific messages are the most helpful thing a login form can offer to its users',
          'The second message is too long and should be shortened so that the whole form still fits on a small phone screen',
        ],
        answer: 0,
        explanation: 'Different answers let an attacker test a list of emails and learn who is registered. One shared message removes that signal.',
      },
      {
        id: 'build-fullstack-ai-05-q3',
        prompt: 'Which statement about hashing a password with scrypt is true?',
        choices: [
          'The server can decrypt the stored value later whenever it likes, which it needs to do to compare passwords at sign-in',
          'A salt is a second password that the customer must remember and type in addition to the first one at every sign-in',
          'Hashing is one-way: the server re-hashes what was typed with the stored salt and compares',
        ],
        answer: 2,
        explanation: 'A hash cannot be reversed. Sign-in works by hashing the attempt with the stored salt and comparing. The salt is random and stored beside the hash.',
      },
      {
        id: 'build-fullstack-ai-05-q4',
        prompt: 'A user clicks Sign out. The code only deletes the cookie in the browser. Why is that a weakness?',
        choices: [
          'Browsers do not allow cookies to be deleted by the server, so a sign-out like this has no effect on anything at all',
          'The server still holds a valid session, so anyone who copied the token earlier could keep using it',
          'It is fine: once a cookie is deleted it can never come back, and therefore the session is already completely finished',
        ],
        answer: 1,
        explanation: 'Sign-out must end the session on the server too. Otherwise a copied or stolen token stays valid until it expires.',
      },
      {
        id: 'build-fullstack-ai-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, why does the server give the browser a cookie after you sign in?',
        choices: [
          'To store your password safely inside the browser so that you never have to type it in again on any visit',
          'To count how many different visitors the website has, so that the owner can read the numbers in a monthly report',
          'So the browser can show a ticket on each visit and the server knows it is you',
        ],
        answer: 2,
        explanation: 'The cookie is the ticket the browser shows on every request. The password is only used at the door, once.',
      },
      {
        id: 'build-fullstack-ai-05-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate wants stateless JWTs in a cookie, valid for 30 days, with no server-side session table. What is the main trade-off to raise?',
        choices: [
          "JWTs cannot be sent in cookies, so the design would need to store them in the browser's localStorage",
          'Stateless tokens cannot identify a user, only a device, so roles would not work',
          'JWTs are always larger than 4 KB, which is more than a cookie is able to carry',
          "Revoking one user's access before expiry is hard, because there is no server-side row to delete",
        ],
        answer: 3,
        explanation: 'Server-side sessions can be ended instantly. A long-lived stateless token stays valid until it expires unless you add a revocation list, which brings the state back.',
      },
    ],
    task: {
      title: 'Add accounts and check them against the checklist',
      minutes: 20,
      steps: [
        'Send the authentication prompt to your AI tool and run the server.',
        'Register with curl using -i so you can see the Set-Cookie header. Write down each cookie attribute and what it does.',
        'Look in your database: confirm there is no readable password and that the session table holds a hash, not the token in your cookie.',
        'Try a wrong password and an unknown email. If the messages differ, add it to REVIEW.md as a finding.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ['Ask the AI to explain "hash", "salt" and "session" with a cloakroom analogy, then explain it back in your own words in two sentences.'],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write a short threat model for sign-in (credential stuffing, session theft, CSRF, account enumeration), list the control for each, and note which ones the generated code does not yet have.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-06',
    day: 6,
    title: 'Connect the pieces and read the data flow',
    summary: "Follow one booking from the click to the database row and back, in the browser's Network tab, the server log and the database, and learn where to look when a piece breaks.",
    intro: {
      objectives: [
        'Trace one action through the form, the API call, the server, the database and back',
        'Use the Network tab, a server log line and a database query to see each hop for real',
        'Decide which hop is broken from a symptom, before asking an AI tool to fix anything',
      ],
      why: 'When the pieces are generated separately, the bugs live in the joins between them. If you can follow one value across every hop, you can tell an AI tool exactly where the problem is, which gets a fix in one prompt instead of ten.',
    },
    minutes: 25,
    skills: ['data-flow'],
    body: [
      {
        type: 'paragraph',
        text: 'You now have a front end, an API and a database, built in three separate steps. The biggest risk in an AI-built application is not any one of them: it is the **joins**, the places where one piece hands data to the next and a name, a type or a time zone quietly changes. This lesson teaches the most useful debugging habit in full-stack work: pick one action, and follow its data across every hop, looking at the real thing at each step.',
      },
      { type: 'heading', text: 'The five hops of one booking' },
      {
        type: 'paragraph',
        text: 'Follow a single click on **Book**. The values the customer typed (a date, an hour, a number of hours) change shape several times on their way to a row in the database, and then change back on the way to the screen. Ask an AI tool to write this trace for your own app and then verify it, hop by hop, because a plausible-sounding trace can be wrong.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant F as BookingForm.jsx
  participant A as api.js and fetch
  participant V as Vite dev proxy
  participant S as Express route
  participant D as PostgreSQL
  F->>A: submit: api.book with courtId, startsAt, hours
  A->>V: POST /api/bookings (JSON, cookie)
  V->>S: forwarded to the API server
  S->>S: loadUser, parse, check the rules
  S->>D: INSERT with $1 to $5 placeholders
  D-->>S: the new row, or an overlap error
  S-->>A: 201 with the booking (times in UTC)
  A-->>F: the booking, shown in My bookings`,
        caption: 'The hops of one booking in development. In production there is no proxy: the same server also serves the web app.',
      },
      {
        type: 'table',
        headers: ['Hop', 'What changes shape', 'Where to look'],
        rows: [
          [
            'Form to api.js',
            'Text fields become numbers; date and hour become one ISO string with +08:00',
            'The submit function; the request in the Network tab',
          ],
          ['Browser to server', 'Object becomes JSON text; the cookie rides along', 'Network tab: request headers and payload'],
          ['Server route', 'JSON becomes req.body; the cookie becomes req.user', 'The server log line for the request'],
          [
            'Route to database',
            'JavaScript Date and numbers become SQL values; camelCase becomes snake_case',
            'The INSERT statement and a query on the table',
          ],
          ['Back to the screen', 'UTC timestamps become Manila time text; centavos become pesos', 'The response in the Network tab; money.js'],
        ],
        caption: 'Every hop where a value can change. Bugs hide where the shape changes.',
      },
      { type: 'heading', text: 'See each hop for real' },
      {
        type: 'paragraph',
        text: 'The project was driven by a real headless browser (Playwright, covered in lesson 10), which printed what the page sent and received when a customer booked Court A from 5 PM to 7 PM on 20 May 2027:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The Network view: request and response (real output)',
        code: `-> POST /api/bookings {"courtId":1,"startsAt":"2027-05-20T17:00:00+08:00","hours":2}
<- 201 /api/bookings {"booking":{"id":1,"courtId":1,"startsAt":"2027-05-20T09:00:00.000Z","endsAt":"2027-05-20T11:00:00.000Z","totalCents":70000,"status":"confirmed",...`,
      },
      {
        type: 'paragraph',
        text: 'Look at the times. The browser sent `17:00:00+08:00` (5 PM, Manila). The server answered `09:00:00.000Z` (the same instant in UTC, written with a Z). They are the same moment, which is why storing UTC and converting for display is safe; if you mixed up the two you would see bookings shifted by eight hours. The server wrote one line to its log for the request, and the email service received a confirmation:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The server log line for that request (real output)',
        code: '{"time":"2026-11-14T07:54:13.569Z","level":"info","msg":"request","requestId":"bf0118a8-5b08-4a48-850d-f7fa01e96c1a","method":"POST","path":"/api/bookings","status":201,"ms":25,"userId":2}',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The outside email service received (the stand-in used in development)',
        code: '[mock-email:ok] POST /send auth=present body={"to":"trace1794642853354@example.com","subject":"Booking confirmed","text":"Court 1, 2027-05-20T09:00:00.000Z"}',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'And the row in the database',
        code: 'SELECT id, user_id, court_id, starts_at, ends_at, total_cents, status FROM bookings ORDER BY id DESC LIMIT 1;',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real result',
        code: ` id | user_id | court_id |       starts_at        |        ends_at         | total_cents |  status   
----+---------+----------+------------------------+------------------------+-------------+-----------
  1 |       2 |        1 | 2027-05-20 17:00:00+08 | 2027-05-20 19:00:00+08 |       70000 | confirmed`,
      },
      {
        type: 'paragraph',
        text: "All five hops, one booking: 2 hours at 35,000 centavos is 70,000, the database shows the same instant as the browser sent (psql happens to display it in the session's time zone), and `userId: 2` in the log line is the customer who made it. A request id is the thread you can pull: lesson 12 uses it to find a failing request in the logs.",
      },
      {
        type: 'version',
        text: "Vite's docs say server.proxy forwards requests whose path starts with the key to another server, in development only, and that the default dev port is 5173; the built app has no proxy, which is why the production setup in lesson 11 makes one Express server serve both the API and the web files. MDN's Set-Cookie page notes that cookies are scoped by path and sent with same-site requests, which is why a single address for both parts keeps sign-in simple.",
        checked: CHECKED,
        sources: [DOCS.viteServer, DOCS.mdnCookie],
      },
      { type: 'visual', id: 'web-api-request-trace', caption: 'Step through the trace of a request and watch what each hop adds.' },
      { type: 'heading', text: 'When it breaks, find the hop first' },
      {
        type: 'paragraph',
        text: 'Most join bugs are one of five kinds, and each has a signature. Learning them means you can tell the AI "the request never leaves the form" instead of "the booking is broken", and that one sentence is the difference between a fix and a guess. A good prompt also names the evidence: "the Network tab shows a 404 from the Vite server for /api/courts".',
      },
      {
        type: 'prompt',
        label: 'A data-flow prompt that names the hop',
        text: 'Booking from the form fails. Evidence: in the Network tab, POST /api/bookings returns 400 with {"error":{"code":"invalid_input","fields":{"hours":"Invalid input: expected int, received string"}}}. The server log shows no other error. Trace how hours travels from the form field to the request body, find where it should have become a number, and fix only that. Show me the diff and the request body after the fix.',
      },
      {
        type: 'warning',
        text: `Do not paste a screenshot of an error and say "fix it". Without the request, the response and the log line, the tool guesses which hop is broken, and it often changes the wrong file. Copy the evidence as text, and leave out cookies, tokens and customers' details.`,
      },
      {
        type: 'paragraph',
        text: `A parcel analogy helps. When you order something online, the parcel is scanned at each stop: warehouse, courier hub, local depot, your door. If it never arrives, the tracking page tells you **which stop** lost it, and nobody blames the whole delivery system. A booking has five stops, and the browser's Network tab, the server log and a database query are the scans. "Where was it last seen?" is the question to ask first.`,
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'In your browser, press F12 and open the **Network** tab, then press Book. Each line is one request your page made. Click it: **Headers** show where it went and what came back (the status, such as 201 or 409), **Payload** shows exactly what your form sent, and **Response** shows what the server answered. If there is no line at all, the problem is in the form; if there is a red line, the server answered with an error and the Response tab tells you why.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Make me a table of every value on this screen, which table and column it comes from, and every place it is changed on the way." Then check three rows yourself.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: "As the system grows, make the trace automatic. Propagate one correlation id from the first request through every log line and any outside call, so that a single search shows the whole story; adopt a tracing standard once there is more than one service. Protect the joins with contract tests: a shared schema, or an OpenAPI document that both a front-end type generator and a server validation use, so a renamed field fails the build rather than a customer's booking. And decide on consistency on purpose: after a booking is created, does the screen add the response to local state (fast, can drift), refetch the list (simple, slower) or update optimistically (fast, needs rollback on a 409)? Each is a different failure mode to test.",
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Bugs in AI-built apps hide in the joins: pick one action and follow its data across every hop.',
          'Three tools show each hop for real: the browser Network tab, the server log and a database query.',
          'Values change shape between hops: text to number, local time to UTC, camelCase to snake_case, centavos to pesos.',
          'Name the broken hop and paste the evidence as text: a precise prompt gets a precise fix.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-06-predict-1',
          kind: 'predict-output',
          title: 'Follow the value',
          prompt: 'This code mimics what the form and the server do with one booking. What does it print?',
          concept: 'tracing data flow',
          language: 'javascript',
          code: `const form = { date: '2027-05-20', hour: '17', hours: '2' };
const startsAt = \`\${form.date}T\${form.hour.padStart(2, '0')}:00:00+08:00\`;
const body = JSON.stringify({ startsAt, hours: Number(form.hours) });
console.log(body);
const parsed = JSON.parse(body);
console.log(typeof parsed.hours, parsed.hours * 35000);`,
          choices: [
            `{"startsAt":"2027-05-20T17:00:00+08:00","hours":2}
number 70000`,
            `{"startsAt":"2027-05-20T17:00:00+08:00","hours":"2"}
string 70000`,
            `{"startsAt":"2027-05-20T17:00:00+08:00","hours":2}
number 350002`,
          ],
          wrongNotes: {
            '{"startsAt":"2027-05-20T17:00:00+08:00","hours":"2"}\nstring 70000': 'Number(form.hours) turned the text into a number before JSON.stringify, so hours is 2 without quotes.',
            '{"startsAt":"2027-05-20T17:00:00+08:00","hours":2}\nnumber 350002': 'parsed.hours is already a number, so * multiplies and gives 70000; joining only happens when one side is text and the operator is +.',
          },
          hints: [
            'Number(form.hours) runs before JSON.stringify. What type is the result?',
            'JSON keeps the number type, so after JSON.parse, hours is still a number.',
            'The body has hours: 2 with no quotes, and 2 * 35000 is 70000.',
          ],
          explanation: 'The text "2" becomes the number 2 in the form code, travels as 2 in the JSON, and is still a number after parsing, so the multiplication gives 70000. Following the value hop by hop shows exactly where its type is decided.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-06-match-1',
          kind: 'match',
          title: 'Which hop is broken?',
          prompt: 'Match each symptom to the hop where you would look first.',
          concept: 'finding the broken hop',
          labels: { terms: 'Symptom', meanings: 'Where to look first' },
          pairs: [
            {
              term: 'You press Book and the Network tab shows no request at all',
              definition: 'The form and api.js',
              note: 'The request was never sent, so the problem is in the browser code.',
            },
            {
              term: 'The request returns 404 with an HTML page from the dev server',
              definition: 'The proxy or the path',
              note: 'The path did not reach the API, so check the proxy and the URL.',
            },
            {
              term: 'The request returns 401 straight after a successful sign-in',
              definition: 'The cookie and the session',
              note: 'The server did not recognise the customer, so check the cookie and the session lookup.',
            },
            {
              term: 'The request returns 500 and the server log shows a SQL error',
              definition: 'The route and the database',
              note: 'The server reached the database and it refused, so read the SQL error in the log.',
            },
          ],
          hints: [
            'Two symptoms are about the request not arriving where it should; two are about answers.',
            'A 401 after signing in points at who the server thinks you are.',
            'A SQL error in the server log means the request reached the database.',
          ],
          explanation: 'Each symptom narrows the search to one hop. Starting from the nearest evidence (the Network tab, then the server log, then the database) is faster than reading all the code.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-06-q1',
        prompt: 'In the real trace the browser sent 17:00:00+08:00 and the server answered 09:00:00.000Z. What does that tell you?',
        choices: [
          'The server made a mistake and shifted the booking by eight hours when it stored the time',
          'The front end must always add eight hours to every time before it sends any request to the server',
          'The database lost the time zone, so every time is only a guess whenever it is read back out of it',
          'The two strings are the same instant written in two time zones, which is why storing UTC is safe',
        ],
        answer: 3,
        explanation: '+08:00 and Z describe the same moment. The server stores UTC, and the screens convert back to Manila time for display.',
      },
      {
        id: 'build-fullstack-ai-06-q2',
        prompt: 'Pressing Book shows no line at all in the Network tab. Which hop do you suspect?',
        choices: [
          'The form or api.js, because the request was never sent from the browser',
          'The database constraint, because it refused the booking',
          'The server log configuration, which is probably hiding the request from you on purpose',
        ],
        answer: 0,
        explanation: 'If no request appears, nothing left the browser. A database refusal would show a response with an error status.',
      },
      {
        id: 'build-fullstack-ai-06-q3',
        prompt: 'You ask an AI tool to trace one booking through your code and it writes a confident five-step explanation. What should you do?',
        choices: [
          'Verify two hops yourself in the Network tab, a log line or a query, and correct the trace if it differs',
          'Trust it, because the tool has read every file in the project and so cannot be wrong about how the data moves',
          'Delete the explanation, since a trace written by an AI can never be of any real use to a working developer',
        ],
        answer: 0,
        explanation: 'A plausible trace can still be wrong. Real evidence at a couple of hops confirms it, and mismatches are exactly where bugs live.',
      },
      {
        id: 'build-fullstack-ai-06-q4',
        prompt: 'Why is a request id in every log line useful?',
        choices: [
          'It tells the browser which cookie to send back on the next request that the page makes to the server',
          'It encrypts the log so that private data in it cannot be read by someone who finds the file on a disk',
          'It speeds up the request because the database can use the id as a shortcut straight to the booking row',
          'It lets you search the logs for one request and see everything that happened in it',
        ],
        answer: 3,
        explanation: "One id ties the lines of a request together. Lesson 12 uses it to follow a failing request from the customer's report to the exact error.",
      },
      {
        id: 'build-fullstack-ai-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what are the headers and payload you see when you click a request in the Network tab?',
        choices: [
          'The title and the body of the web page that was loaded when you first opened the address',
          'A copy of the code that the AI wrote for that part of the screen, shown line by line',
          'Where the request went and what came back, and what your form sent',
        ],
        answer: 2,
        explanation: 'Headers describe the request and response (address, status, cookies), and the payload is the data your form sent.',
      },
      {
        id: 'build-fullstack-ai-06-q6',
        audience: { min: 'advanced' },
        prompt: 'A rename of "hours" to "durationHours" in the API breaks the front end only in production. What practice prevents this class of bug?',
        choices: [
          'A rule that only one developer may rename fields, and only on Fridays after the release has gone out',
          'A contract test or shared schema that fails the build when the two sides disagree',
          'Writing the field names twice in different cases so that either spelling is accepted by the server code',
          'Turning off validation in production so that unknown fields are ignored without causing any error at all',
        ],
        answer: 1,
        explanation: 'A single schema or OpenAPI contract, checked in CI, turns a silent mismatch into a failing build.',
      },
    ],
    task: {
      title: 'Trace one booking in your own app',
      minutes: 20,
      steps: [
        'Run your app (front end and API) and open the Network tab. Make one booking and write down the request, the response and the status.',
        'Find the matching line in the server log (add a console.log of the path and status if there is none) and the row in the database.',
        'Write a five-line trace of the booking: the value of hours or the start time at each hop, with its type or format.',
        'Ask your AI tool to write the same trace from the code only, and note any hop where it differs from what you saw.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Draw the five stops of a booking on paper like a parcel tracking page, and write under each stop which tool (Network tab, log, database) would show you that stop.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a correlation id to every log line and every outside call, and write a contract test that fails when the response shape of POST /api/bookings changes.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-07',
    day: 7,
    title: 'Upload files and call outside services',
    summary: 'Accept proof-of-payment images safely and send confirmation emails through an outside service that can fail, without losing a booking or leaking a key.',
    intro: {
      objectives: [
        'Ask for file uploads with size, type and storage rules, and check what the AI generated',
        'Wrap a call to an outside service with a timeout, error handling and a key kept out of the code',
        'Decide what the app should do when an outside service is down',
      ],
      why: 'Almost every real app takes files from strangers and depends on services you do not run. Both are where AI-generated code is most optimistic, so a few specific limits and one failure plan turn a demo into something you can leave running.',
    },
    minutes: 25,
    skills: ['data-flow'],
    body: [
      {
        type: 'paragraph',
        text: 'Two things cross the edge of your application in this lesson. **Files come in** from customers, who send whatever they like: a payment screenshot, a huge video, a web page pretending to be a picture. And **calls go out** to services you do not run, such as an email provider, which are sometimes slow and sometimes down. AI tools write both with a hopeful, happy-path attitude. Your job is to ask for the limits up front and to check that they are really there.',
      },
      { type: 'heading', text: 'Files: ask for the limits' },
      {
        type: 'paragraph',
        text: 'In the spec, customers attach **proof of payment**, a PNG or JPEG of at most 2 MB. A file upload is sent as `multipart/form-data`, and in Express a middleware called multer reads it. Here is what the tool wrote the first time, from a prompt that said only "let customers attach a screenshot":',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'First generated upload (as written)',
        code: `const upload = multer({ dest: 'uploads/' });

// Customers attach proof of payment (a screenshot) to a booking.
bookingsRouter.post('/:id/proof', upload.single('proof'), async (req, res) => {
  await query('UPDATE bookings SET proof_file = $1 WHERE id = $2', [req.file.originalname, req.params.id]);
  res.json({ ok: true, file: req.file.filename });
});`,
      },
      {
        type: 'paragraph',
        text: `It works, and it has four problems you can see in these few lines. There is **no size limit**, so one request can fill the disk. There is **no type check**, so an HTML page is accepted as a "screenshot". It stores the customer's **original file name** in the database, which is text an attacker controls. And the file lands in \`uploads/\` with a name and no extension. Here is what the real project did when two files that should have been refused were sent:`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'The first version accepted a web page and a 5 MB file (real responses)',
        code: `{"ok":true,"file":"c9cce436c5c0e9aff20cb0714b8bc408"}
{"ok":true,"file":"87493d2eed93cd6da2ed5fee60513ecd"} [200]`,
      },
      {
        type: 'prompt',
        label: 'Upload prompt with the limits stated',
        text: "Add proof-of-payment upload to a booking: POST /api/bookings/:id/proof with a multipart field named proof. Rules: PNG or JPEG only; at most 2 MB; exactly one file; the server chooses a random file name with the right extension and never uses the customer's file name; refuse anything else with a clear 400 or 413 in the API's error shape; files are saved outside any public folder and are downloaded only through GET /api/bookings/:id/proof. Use multer with limits and fileFilter, attached to this route only. Explain what each limit protects against.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The upload after the prompt above',
        code: `const IMAGE_TYPES = { 'image/png': '.png', 'image/jpeg': '.jpg' };
const UPLOAD_DIR = resolve('uploads');

const upload = multer({
  // A random name chosen by the server: the customer's file name is never used on disk.
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, \`\${randomUUID()}\${IMAGE_TYPES[file.mimetype]}\`),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype in IMAGE_TYPES),
});

// Customers attach proof of payment (a screenshot) to a booking.
bookingsRouter.post('/:id/proof', upload.single('proof'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Attach a PNG or JPEG image under 2 MB' });
  await query('UPDATE bookings SET proof_file = $1 WHERE id = $2', [req.file.filename, req.params.id]);
  res.json({ ok: true });
});

bookingsRouter.get('/:id/proof', async (req, res) => {
  const { rows } = await query('SELECT proof_file FROM bookings WHERE id = $1', [req.params.id]);
  if (!rows[0]?.proof_file) return res.status(404).json({ error: 'No proof attached' });
  res.sendFile(resolve(UPLOAD_DIR, rows[0].proof_file));
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real results (the last one shortened): a web page, a real PNG, and a 5 MB file declared as a PNG',
        code: `{"error":"Attach a PNG or JPEG image under 2 MB"} [400]
{"ok":true} [200]
<!DOCTYPE html> ... MulterError: File too large ... at abortWithCode (.../multer/lib/make-middleware.js:225:22)`,
      },
      {
        type: 'paragraph',
        text: 'Better: the web page gets a 400, the real PNG is accepted, and the oversized file is stopped. But look at the last result: the server answered the oversized file with a raw **HTML error page that includes a stack trace and folder names**. That is a different kind of bug (an unhandled error leaking internals) and it is the subject of lesson 8. Notice how the lessons connect: each fix reveals the next thing to review.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A(Customer sends a file) --> B{Signed in?}
  B -->|No| X1(401)
  B -->|Yes| C{One file, under 2 MB?}
  C -->|No| X2(413 or 400)
  C -->|Yes| D{PNG or JPEG?}
  D -->|No| X3(400)
  D -->|Yes| E[Save under a random name]
  E --> F[Store the name on the booking]
  F --> G(200 OK)`,
        caption: 'Every door the upload passes through. Each refusal is a rule from the spec.',
      },
      {
        type: 'version',
        text: "The Express multer page says multer handles multipart/form-data, that files are kept in memory unless you set a destination or storage, that diskStorage functions must return a file name with its extension, and that you should never add multer as global middleware and should set limits (fileSize, files, fields). It also warns that file.originalname comes from the client and must be treated as untrusted. The type check in this lesson uses the type the browser reports, which is also set by the client; for high-risk uploads, check the file's first bytes or re-encode images with an image library.",
        checked: CHECKED,
        sources: [DOCS.expressMulter],
      },
      {
        type: 'warning',
        text: "Where the file is stored matters as much as what it is. Here the files sit on the server's own disk, which is fine on your laptop and wrong in production: a container's disk is wiped when the app is redeployed or restarted on another machine. Real deployments keep uploads in object storage (a bucket) and hand out access through your own authorised route or short-lived signed links, never as a public folder. Lesson 11 returns to this.",
      },
      { type: 'heading', text: 'Outside services: assume they fail' },
      {
        type: 'paragraph',
        text: "The confirmation email is sent by an **outside service**: your server makes an HTTP request to a provider's address with a secret **API key** that proves the request is yours. Three rules cover most of what goes wrong. **The key is a secret**: it belongs in an environment variable, never in the code (the first version of the project had it written into the file; lesson 9 finds it). **Set a timeout**: without one, a provider that stops answering will hold your request open for minutes. And **decide what failure means**: if the email cannot be sent, should the booking be cancelled? Almost never. The customer has a booking; the email is a nice extra.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/email.js (the timeout is new; the key line is still a problem)',
        code: `// Sends the confirmation email through an outside email service.
const EMAIL_API_URL = process.env.EMAIL_API_URL ?? 'http://localhost:4010/send';
const EMAIL_API_KEY = 'key_live_51Nf8aXyZqLmPw93kd02';

export async function sendEmail({ to, subject, text }) {
  const res = await fetch(EMAIL_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${EMAIL_API_KEY}\` },
    body: JSON.stringify({ to, subject, text }),
    signal: AbortSignal.timeout(3000), // never wait on an outside service forever
  });
  if (!res.ok) throw new Error(\`Email service answered \${res.status}\`);
}`,
      },
      {
        type: 'paragraph',
        text: 'A small stand-in for the provider let the project test both failures for real. With the service answering 503 (unavailable), and then with the service taking 10 seconds to answer, the booking route returned:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Email service down, then slow (real runs)',
        code: `{"booking":{"id":3, ... },"emailSent":false} [201 0.057283s]
{"booking":{"id":4, ... },"emailSent":false} [201 3.005255s]

confirmation email for booking 3 failed: Email service answered 503
confirmation email for booking 4 failed: The operation was aborted due to timeout`,
      },
      {
        type: 'paragraph',
        text: "Both bookings were saved (`201`), the response says `emailSent: false`, and the server logged why. The slow service cost the customer exactly 3 seconds, the timeout we chose, instead of hanging. That is a trade-off to know about: waiting for the email makes the booking slower when the provider is slow. Lesson 13's bigger feature and the advanced note below show the usual next step.",
      },
      {
        type: 'prompt',
        label: 'Outside service prompt',
        text: 'Wrap the call to the email service in src/email.js. Requirements: the URL and API key come from environment variables validated at startup (the app refuses to start if they are missing); a 3-second timeout; a thrown error if the service answers anything other than 2xx; no secrets or customer emails in log lines. In the booking route, a failure must never undo the booking: return 201 with emailSent: false and log a warning with the booking id. Add one test for each failure.',
      },
      {
        type: 'table',
        headers: ['Edge of the app', 'Ask for', 'Check in the code', 'Red flag'],
        rows: [
          ['Upload size', 'A limit on bytes and files', 'limits: { fileSize, files }', 'No limits object'],
          ['Upload type', 'An allowed list of types', 'fileFilter with an allow-list', 'Anything accepted'],
          [
            'Upload name and place',
            'Server-chosen names, non-public storage',
            'randomUUID, a route that checks access',
            'originalname on disk, a public folder',
          ],
          ['Outside call key', 'Environment variable, validated at start', 'process.env or a config module', 'A key written in the source'],
          ['Outside call speed', 'A timeout', 'AbortSignal.timeout(...) or similar', 'fetch with no signal'],
          ['Outside call failure', 'A decided behaviour', 'try/catch that logs and carries on or fails clearly', 'An empty .catch(() => {})'],
        ],
        caption: 'Review the edges of the app with this table.',
      },
      {
        type: 'paragraph',
        text: "Treat an **upload** like a parcel arriving at a shop. A careful shop checks the size (is it too big for the door?), the label (does it say it is a book, and is it really?), and then puts it on a shelf with its own shelf number, not the sender's name. An **outside service** is like phoning a supplier: you need their number and a password to prove who you are (the API key, which must never be written on a sign outside the shop), you do not wait on hold for ever (the timeout), and if they do not pick up you still serve your customer and try again later.",
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'In the upload code: `limits` sets the maximum size and number of files; `fileFilter` is the checker that lets only PNG and JPEG through; `randomUUID()` makes a long random name; and `res.sendFile` hands the file back only when the route says the customer may have it. In the email code: `fetch` makes the phone call, `Authorization: Bearer ...` is the password, `AbortSignal.timeout(3000)` means "hang up after 3 seconds", and `if (!res.ok) throw ...` means "if they say no, treat it as a failure".',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "What is the worst file someone could upload to this route, and which line stops it?" If it cannot point to a line, the protection is not there.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'Production hardening of both edges follows well-known patterns. For outside calls: retry only idempotent or idempotency-keyed requests, with exponential backoff and jitter and a hard cap; add a circuit breaker so a dead provider does not tie up your server; and move email out of the request path with an **outbox**: write the email job in the same transaction as the booking, and let a worker send it, retry it and record the result, so a crash between "saved" and "sent" loses nothing. Verify the signature of inbound webhooks. For uploads: send files directly to object storage with short-lived signed URLs, validate content by inspecting bytes or re-encoding images, scan if the files are shared with other users, serve them from a separate origin with `Content-Disposition` and `X-Content-Type-Options: nosniff`, and set per-user quotas.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Ask for uploads with explicit limits: size, number of files, allowed types, server-chosen names and non-public storage.',
          'An outside service needs three things: its key in an environment variable, a timeout, and a decided behaviour when it fails.',
          'A failing email must not undo a booking: save, report emailSent false and log the reason.',
          'Fixing one problem often exposes the next: the upload limit worked, but the error it raised leaked a stack trace.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-07-scenario-1',
          kind: 'scenario',
          title: 'The email provider is down',
          prompt: 'Choose how the booking route should behave.',
          concept: 'outside service failure',
          situation: 'A customer presses Book. The booking is saved in the database, but the email provider is returning errors for the next hour. Forty customers will book before it recovers.',
          options: [
            {
              text: 'Keep the booking, answer 201 with emailSent set to false, log a warning with the booking id, and have the screen say the booking is confirmed and an email will follow',
              consequence: "Customers have their bookings, you can find and resend the missing emails afterwards, and nobody is blocked by the provider's outage.",
              quality: 'best',
            },
            {
              text: 'Delete the booking and answer 500 so the customer tries again later, because a booking without an email is incomplete',
              consequence: 'Every customer in that hour loses a good booking and has to start again, and some will not come back. The email was never the important part.',
              quality: 'poor',
            },
            {
              text: 'Swallow the error silently with an empty catch and say nothing to anyone',
              consequence: 'Bookings succeed, but nobody knows forty confirmations were never sent, and customers write to ask where their emails are.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Which part of the system matters more to the customer: the booking or the email?',
            'A good answer keeps the booking and also records that the email failed.',
            'Keep the booking, report emailSent: false and log it so the emails can be resent later.',
          ],
          explanation: "The booking is the product; the email is a convenience. Keep the booking, tell the truth in the response and leave a trace in the log so the failure can be repaired. Silence hides the problem, and cancelling punishes the customer for your provider's outage.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'One retry too many',
          prompt: 'The email sender should retry a failed call at most maxAttempts times. attempt counts the retries already made. This function allows one retry too many. Find the line and choose the fix.',
          concept: 'retry limits',
          language: 'javascript',
          code: `function shouldRetry(status, attempt, maxAttempts) {
  const temporary = status >= 500 || status === 429;
  return temporary && attempt <= maxAttempts;
}`,
          bugLine: 3,
          fixes: [
            {
              line: '  return temporary && attempt < maxAttempts;',
              correct: true,
              why: 'With attempt counting retries already made, you may retry only while that count is below the maximum.',
            },
            {
              line: '  return temporary && attempt <= maxAttempts;',
              correct: false,
              why: 'This is the original line: when attempt equals maxAttempts it still allows one more retry.',
            },
            {
              line: '  return temporary && attempt < maxAttempts - 1;',
              correct: false,
              why: 'This stops one retry too early, so a limit of 3 would only ever allow 2.',
            },
            {
              line: '  return attempt < maxAttempts;',
              correct: false,
              why: 'This forgets the status check, so it would also retry a 400 Bad Request that can never succeed.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'shouldRetry',
            cases: [
              { label: 'temporary failure, retries left', args: [503, 2, 3], expected: true },
              { label: 'temporary failure, limit reached', args: [503, 3, 3], expected: false },
              { label: 'too many requests, first retry', args: [429, 0, 3], expected: true },
              { label: 'bad request never retried', args: [400, 0, 3], expected: false },
              { label: 'success never retried', args: [200, 0, 3], expected: false },
            ],
          },
          hints: [
            'Count: with maxAttempts 3, how many retries should be allowed in total?',
            'If attempt is the number of retries already made, which comparison stops at 3?',
            'Use attempt < maxAttempts, and keep the status check.',
          ],
          explanation: 'With attempt counting retries already made, retrying is allowed while attempt is less than the maximum. The <= version allowed an extra attempt, and dropping the status check would retry requests that can never succeed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-07-fill-blank-1',
          kind: 'fill-blank',
          title: 'The upload gate',
          prompt: 'Fill in the blanks so the function accepts PNG and JPEG files of exactly 2 MB or less, and refuses everything else.',
          concept: 'upload rules',
          language: 'javascript',
          code: `const ALLOWED = ['image/png', 'image/jpeg'];
const MAX_BYTES = 2 * 1024 * 1024;

function isAllowedUpload(file) {
  return ___.includes(file.mimetype) && file.size ___ MAX_BYTES;
}`,
          blanks: [
            { answers: ['ALLOWED'], feedback: 'The list of allowed types is called ALLOWED.' },
            { answers: ['<='], feedback: 'A file of exactly 2 MB is allowed, so the size must be less than or equal to the maximum.' },
          ],
          bank: ['ALLOWED', 'MAX_BYTES', '<=', '<', '>='],
          tests: {
            kind: 'function',
            fn: 'isAllowedUpload',
            cases: [
              { label: 'a small PNG', args: [{ mimetype: 'image/png', size: 100 }], expected: true },
              { label: 'a web page', args: [{ mimetype: 'text/html', size: 100 }], expected: false },
              { label: 'exactly 2 MB', args: [{ mimetype: 'image/jpeg', size: 2097152 }], expected: true },
              { label: 'one byte over', args: [{ mimetype: 'image/png', size: 2097153 }], expected: false },
            ],
          },
          hints: [
            'The first blank is the list of allowed types.',
            'The second blank compares the size with the maximum. Is exactly 2 MB allowed?',
            'Use ALLOWED and <=.',
          ],
          explanation: "An allow-list says what is permitted and refuses everything else, and the size check uses <= because the limit itself is allowed. The same two ideas are what multer's fileFilter and limits do in the route.",
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-07-q1',
        prompt: "The generated upload stores the customer's original file name in the database and on disk. Why is that a problem?",
        choices: [
          'File names are usually too long for the database to store, so they are always cut off in the middle',
          'Only PNG files are allowed to have a name, and every other type of file must be saved with no name at all',
          'The name is chosen by the customer and can be used to overwrite other files; use a server-made name',
          'Two customers will never upload files with the same name, so storing the names only wastes disk space',
        ],
        answer: 2,
        explanation: 'originalname is controlled by the sender. A random name chosen by the server removes that whole class of attack.',
      },
      {
        id: 'build-fullstack-ai-07-q2',
        prompt: 'Why set a timeout on the call to the email provider?',
        choices: [
          'A provider that stops answering would otherwise hold your requests open for a very long time',
          'It is required by Node.js, which refuses to make any request that has no timeout attached to it',
          'It makes the provider send the email faster, because providers always prioritise the requests that carry deadlines',
        ],
        answer: 0,
        explanation: 'A request with no timeout waits on a dead service. A short timeout turns a hang into a quick, handled failure.',
      },
      {
        id: 'build-fullstack-ai-07-q3',
        prompt: 'The email key is currently written in src/email.js. What is the right fix?',
        choices: [
          'Rename the constant to something much harder to guess, so that nobody who searches the code is able to find it',
          'Keep it in the file but add a comment asking all developers not to share the repository with anyone outside the team',
          'Base64-encode the key inside the file, which hides it from anyone who reads the code on a screen',
          'Move it to an environment variable checked at startup, and replace the key, since it was exposed',
        ],
        answer: 3,
        explanation: 'A key in source code can be read by anyone with the repository or its history. Move it out, and rotate it because it has already been exposed.',
      },
      {
        id: 'build-fullstack-ai-07-q4',
        prompt: "Where should customers' uploaded files be kept in a real deployment?",
        choices: [
          'In a public folder on the web server so that the browser is able to fetch them very quickly and directly',
          'In object storage, served only through a route that checks the customer may see the file',
          "In the browser's localStorage so that the server never has to store any of the customers' files at all",
        ],
        answer: 1,
        explanation: 'A container disk is temporary, and a public folder skips the access check. Persistent storage plus an authorised route solves both.',
      },
      {
        id: 'build-fullstack-ai-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is an API key?',
        choices: [
          'A button on the screen that opens the settings page of the application, which only the owner can see',
          'The web address of the other service, which is public so that anyone at all can look it up and use it',
          'A password that proves to another service the request comes from your app, so it must be kept secret',
        ],
        answer: 2,
        explanation: 'An API key identifies and authorises your app to an outside service, like a staff pass. Anyone who has it can act as you.',
      },
      {
        id: 'build-fullstack-ai-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Between "booking saved" and "email sent" the server can crash, and the confirmation is lost. Which design removes that gap?',
        choices: [
          "An outbox: record the email job in the booking's transaction, and let a worker send it and retry",
          'A longer timeout on the email call, so that the provider always has enough time to answer before any crash',
          'Sending the email first and saving the booking only after the provider has said yes to the request',
          'Sending every email twice in a row, so that at least one of the two copies is certain to get through',
        ],
        answer: 0,
        explanation: 'The outbox makes "booked" and "email is owed" one atomic fact, so a crash cannot separate them, and a worker can retry safely.',
      },
    ],
    task: {
      title: 'Add an upload and an email, and break them on purpose',
      minutes: 20,
      steps: [
        'Send the upload prompt and the outside service prompt to your AI tool (use a stand-in email service or a console message if you have no provider).',
        'Upload a text file renamed to .png, a 5 MB file and a real small PNG with curl or your form. Write down each status code.',
        'Make the email service fail (stop it, or point the address at nothing) and confirm that the booking still succeeds with emailSent false and a warning in the log.',
        'Search the source for anything that looks like a key or password and move it to an environment variable.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to explain the parcel analogy for uploads using your own code, line by line, and to list the three rules your upload route enforces.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Replace the inline email call with an outbox table and a small worker that retries with backoff, and write a test that kills the worker midway and shows no email is lost or sent twice.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-08',
    day: 8,
    title: 'Handle errors, loading and empty states',
    summary: 'Make the app behave well when data is slow, missing or wrong: one error shape from the API, a safe 500, and four states on every screen that shows data.',
    intro: {
      objectives: [
        'Name the states every data screen needs and what each should tell the customer',
        'Give the API one error shape and a 500 that leaks nothing',
        'Ask an AI tool for these states and check them by breaking things on purpose',
      ],
      why: 'AI builds the sunny day first: the data arrives instantly and the customer does everything right. Real customers have slow phones, empty accounts and typos, so the quality of an app is mostly in how it behaves when things are not perfect.',
    },
    minutes: 25,
    skills: ['frontend-states'],
    body: [
      {
        type: 'paragraph',
        text: 'The first version of the booking app has a quiet flaw: it only works when everything goes right. If the server is slow, the customer sees an empty page and wonders whether it is broken. If a new customer has no bookings, they see a blank list. If the server is down, nothing is shown at all, and in the code the failed request is never caught. This lesson fixes that on both sides: the API learns to answer every failure in the same, safe shape, and the screens learn the four states that every data screen needs.',
      },
      { type: 'heading', text: 'The four states of every data screen' },
      {
        type: 'paragraph',
        text: 'Any screen that shows data from the server is in exactly one of four states at a time. **Loading**: the request is on its way, so say so. **Error**: the request failed, so say what happened in plain words and offer a way to try again. **Empty**: the request worked but there is nothing to show, so explain what to do next, instead of showing a blank space. **Content**: the data, at last. Add a fifth for forms: **saving**, where the button is disabled so a double tap cannot book twice. AI tools often build only the content state, so ask for all of them by name.',
      },
      {
        type: 'prompt',
        label: 'Prompt for the states',
        text: `For every screen that loads data (courts and my bookings) add four states: loading (a short message, role="status"), error (the message from the API or "We can't reach the server" when there is no answer, role="alert", plus a Try again button), empty (my bookings: "You have no bookings yet. Pick a court and a time above to make your first one.") and content. The booking form must disable its button while saving and show the server's field messages next to the field they belong to. Handle network failure in src/api.js in one place. Do not change any other behaviour.`,
      },
      {
        type: 'table',
        headers: ['State', 'What the customer sees', 'What the code needs'],
        rows: [
          ['Loading', '"Loading courts and your bookings…"', 'A status value set before the request starts'],
          ['Error', 'The reason, and a Try again button', 'A catch that sets the error state; network errors handled in one place'],
          ['Empty', 'What to do next, not a blank space', 'A check for an empty list, shown only when not loading'],
          ['Content', 'The courts, the form, the list', 'The normal screen'],
          ['Saving', 'A disabled button that says "Booking…"', 'A flag set around the request, cleared in finally'],
        ],
        caption: 'Five states for the booking screens.',
      },
      {
        type: 'code',
        language: 'jsx',
        label: 'App.jsx: the load function and the states',
        code: `  const [data, setData] = useState({ status: 'loading', courts: [], bookings: [], error: '' });

  useEffect(() => {
    api.me().then((d) => setUser(d.user)).catch(() => {}).finally(() => setCheckedSession(true));
  }, []);

  const load = () => {
    setData((d) => ({ ...d, status: 'loading' }));
    Promise.all([api.courts(), api.myBookings()])
      .then(([c, b]) => setData({ status: 'ready', courts: c.courts, bookings: b.bookings, error: '' }))
      .catch((err) => setData((d) => ({ ...d, status: 'error', error: err.message })));
  };
  useEffect(() => { if (user) load(); }, [user]);`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'api.js: one place for network and server errors',
        code: `async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(\`/api\${path}\`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only rejects when the request never got an answer: offline, server down, DNS.
    throw new ApiError("We can't reach the server. Check your connection and try again.", { code: 'network' });
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const error = data?.error ?? {};
    throw new ApiError(error.message ?? 'Something went wrong. Please try again.', { code: error.code, fields: error.fields, status: res.status });
  }
  return data;
}`,
      },
      {
        type: 'paragraph',
        text: `Read \`request()\` carefully: it separates two failures that look alike on the screen but are very different. If \`fetch\` itself rejects, the request never got an answer (offline, server down), so the message is "We can't reach the server". If an answer arrives with an error status, the API's own message is shown, and \`fields\` carries per-field messages for the form. Because everything goes through this one function, every screen gets the same behaviour without extra code. Here is what a real headless browser saw in each state of the project:`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of a browser test, one line per state (shortened)',
        code: `EMPTY   : ... | My bookings | You have no bookings yet. Pick a court and a time above to make your first one.
LOADING : Sampaguita Court | Ben Cruz | Sign out | Loading courts and your bookings…
ERROR   : Sampaguita Court | Ben Cruz | Sign out | We can't reach the server. Check your connection and try again. | Try again
FIELD   : The courts are open 6 AM to 10 PM / Please fix the highlighted fields`,
      },
      {
        type: 'paragraph',
        text: 'The loading state was forced by delaying the request by a second and a half, and the error state by making the browser abort the request, so the states were seen, not assumed. That is the testing habit for this lesson: **break the app on purpose** (slow it down, cut the network, send bad input) and look at what the customer would see.',
      },
      { type: 'heading', text: 'The API side: one shape, and a safe 500' },
      {
        type: 'paragraph',
        text: 'The generated routes answered errors in different ways: a bare string here, `err.message` from the database there, and the upload limit from lesson 7 produced a whole HTML page with a stack trace. Ask for **one error shape** and one central place that produces it. Expected problems (bad input, not found, a clash) are thrown as a small `AppError` with a status, a short code the front end can act on, a human message and optional per-field messages. Anything else is a bug in our code: it is logged in full on the server and answered with a calm, generic 500.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/errors.js (the central handler)',
        code: `// One shape for every error the API sends: { error: { code, message, fields? } }.
export class AppError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'not_found', message: 'There is nothing at that address' } });
}

// Express 5 sends errors thrown in async handlers here as well.
export function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message, fields: err.fields } });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'invalid_json', message: 'The request body is not valid JSON' } });
  }
  if (err.name === 'MulterError') {
    const tooBig = err.code === 'LIMIT_FILE_SIZE';
    return res.status(tooBig ? 413 : 400).json({
      error: { code: tooBig ? 'file_too_large' : 'bad_upload', message: tooBig ? 'That file is over 2 MB' : 'The upload could not be read' },
    });
  }

  // Anything else is our bug: keep the details in the log, send the customer nothing sensitive.
  console.error(\`unhandled error on \${_req.method} \${_req.originalUrl}:\`, err);
  res.status(500).json({ error: { code: 'server_error', message: 'Something went wrong on our side. Please try again.' } });
}`,
      },
      {
        type: 'version',
        text: "Express 5 forwards errors thrown or rejected in async route handlers to the error-handling middleware without extra code, and its built-in handler sends the stack trace to the client except in production. A custom handler is a function with four parameters (err, req, res, next) registered last, and it should call next(err) if the response has already started (res.headersSent). The status codes used here (400, 401, 404, 409, 413, 500) are defined on MDN's HTTP status reference.",
        checked: CHECKED,
        sources: [DOCS.expressErrors, DOCS.mdnStatus],
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real responses of the final API (one error shape for every failure)',
        code: `400  {"error":{"code":"invalid_booking","message":"Please fix the highlighted fields","fields":{"hours":"Book between 1 and 3 hours"}}}
409  {"error":{"code":"slot_taken","message":"That time is already booked"}}
401  {"error":{"code":"not_signed_in","message":"Please sign in"}}
404  {"error":{"code":"not_found","message":"There is nothing at that address"}}
400  {"error":{"code":"invalid_json","message":"The request body is not valid JSON"}}
413  {"error":{"code":"file_too_large","message":"That file is over 2 MB"}}
500  {"error":{"code":"server_error","message":"Something went wrong on our side. Please try again."}}`,
      },
      {
        type: 'paragraph',
        text: "The last line is the one to remember. The 500 was produced on purpose by asking for a court that does not exist, so the database refused with a foreign-key error. The customer saw only the calm message; the details (the SQL error and where it happened) went to the server's log, where only you can read them. Compare that with the first version's `res.status(500).json({ error: err.message })`, which would have sent the database's own wording to anyone who tried.",
      },
      {
        type: 'warning',
        text: 'Error messages are part of your security. Never send stack traces, SQL text, file paths or the names of internal tables to the browser: they teach an attacker how the app is built. Log them on the server instead. And never put a password, a token or a card number in a log line either.',
      },
      {
        type: 'paragraph',
        text: 'The booking rules from the spec live in one small function, `checkBooking`, with no web framework and no database in it. That makes it easy to test (lesson 10), and it returns a message for each broken rule, keyed by the form field, so the screen can show it beside the right input:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/bookingRules.js',
        code: `// The booking rules, as plain functions with no database and no web framework, so they are easy to test.
export const OPEN_HOUR = 6; // courts open at 06:00 Manila time
export const CLOSE_HOUR = 22; // and close at 22:00
export const MAX_HOURS = 3;

// Manila has no daylight saving time: it is always UTC+8.
const manilaHour = (date) => (date.getUTCHours() + 8) % 24;

// Returns { field: message } for every broken rule; an empty object means the booking is fine.
export function checkBooking({ startsAt, hours }, now = new Date()) {
  const errors = {};
  const start = new Date(startsAt);

  if (typeof startsAt !== 'string' || Number.isNaN(start.getTime())) {
    errors.startsAt = 'Choose a valid date and time';
  } else if (start.getUTCMinutes() !== 0) {
    errors.startsAt = 'Bookings start on the hour';
  } else if (start <= now) {
    errors.startsAt = 'Choose a time in the future';
  }

  if (!Number.isInteger(hours) || hours < 1 || hours > MAX_HOURS) {
    errors.hours = \`Book between 1 and \${MAX_HOURS} hours\`;
  }

  if (!errors.startsAt && !errors.hours) {
    const first = manilaHour(start);
    if (first < OPEN_HOUR || first + hours > CLOSE_HOUR) errors.startsAt = 'The courts are open 6 AM to 10 PM';
  }
  return errors;
}`,
      },
      {
        type: 'paragraph',
        text: 'Think of a restaurant when the kitchen has run out of something. A good waiter does not stand silent, and does not hand you a plate of kitchen noise. They tell you what happened and what you can do now: "Sorry, the pandesal is finished; the ensaymada is fresh." Each state on a screen is that waiter: *loading* is "your order is coming", *empty* is "nothing ordered yet, here is the menu", *error* is "something went wrong, shall I try again?".',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: `In the code: \`status: 'loading'\` is a note the page keeps about where the request is. \`.catch(...)\` means "if the request fails, do this instead", and \`finally\` means "whatever happened, do this last" (for the Booking... button, turning it back on). The line \`if (data.status === 'error' && ...)\` simply shows a box only when the note says error. \`role="alert"\` tells screen readers to read the message out loud, which helps customers who cannot see the screen.`,
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Show me the loading, error and empty versions of this screen, and tell me how to force each one in the browser." Then actually force each one.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: `Beyond the four states, decide how failures are classified and what the customer can do about each. Separate **expected errors** (validation, conflicts: the customer can fix them) from **unexpected errors** (bugs and outages: they cannot), report only the second kind to your error tracker, and make retry safe: idempotent routes, or an idempotency key, so "Try again" never double-books. In React, add an error boundary so one component's bug does not blank the whole page, avoid layout jumps between states with skeletons of the right size, announce state changes to assistive technology, and consider optimistic updates with rollback when latency matters. On the API, keep error codes stable and documented, because the front end, tests and mobile clients branch on them, and keep messages free of internals even for authenticated admins.`,
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Every data screen has four states: loading, error, empty and content (plus saving for forms). Ask for them by name.',
          'Handle network failure and server errors in one place, api.js, so every screen behaves the same.',
          'Give the API one error shape with a code, a message and optional field messages; log the details and send a calm 500.',
          'Test the states by breaking the app on purpose: slow the request, cut the network, send bad input.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-08-code-1',
          kind: 'code-challenge',
          title: 'Validate a booking',
          prompt: 'Write validateBooking({ startHour, hours }). The rules: hours must be a whole number from 1 to 3 (error key hours, message "Book between 1 and 3 hours"). If hours is fine, the booking must start at hour 6 or later and end by hour 22, so startHour + hours must be at most 22 and startHour a whole number (error key startHour, message "The courts are open 6 AM to 10 PM"). Return an object of errors, empty when the booking is fine.',
          concept: 'validating input',
          language: 'javascript',
          starter: `function validateBooking({ startHour, hours }) {
  const errors = {};
  // add the rules here
  return errors;
}`,
          solution: `function validateBooking({ startHour, hours }) {
  const errors = {};
  if (!Number.isInteger(hours) || hours < 1 || hours > 3) {
    errors.hours = 'Book between 1 and 3 hours';
  } else if (!Number.isInteger(startHour) || startHour < 6 || startHour + hours > 22) {
    errors.startHour = 'The courts are open 6 AM to 10 PM';
  }
  return errors;
}`,
          tests: {
            kind: 'function',
            fn: 'validateBooking',
            cases: [
              { label: 'a normal evening booking', args: [{ startHour: 18, hours: 2 }], expected: {  } },
              { label: 'the last hour of the day is fine', args: [{ startHour: 21, hours: 1 }], expected: {  } },
              { label: 'too many hours', args: [{ startHour: 18, hours: 4 }], expected: { hours: 'Book between 1 and 3 hours' } },
              { label: 'zero hours', args: [{ startHour: 18, hours: 0 }], expected: { hours: 'Book between 1 and 3 hours' } },
              {
                label: 'half an hour is not a whole number',
                args: [{ startHour: 18, hours: 1.5 }],
                expected: { hours: 'Book between 1 and 3 hours' },
              },
              { label: 'before opening', args: [{ startHour: 5, hours: 1 }], expected: { startHour: 'The courts are open 6 AM to 10 PM' } },
              { label: 'would end after closing', args: [{ startHour: 21, hours: 2 }], expected: { startHour: 'The courts are open 6 AM to 10 PM' } },
              {
                label: 'only the hours error is reported when both are wrong',
                args: [{ startHour: 5, hours: 9 }],
                expected: { hours: 'Book between 1 and 3 hours' },
              },
            ],
          },
          hints: [
            'Check hours first: it must be a whole number between 1 and 3 (Number.isInteger helps).',
            'Only if hours is fine, check the opening hours: startHour must be at least 6 and startHour + hours at most 22.',
            'Use if / else if so that only one error is returned, and set errors.hours or errors.startHour.',
          ],
          explanation: 'The function checks the hours first and only then the opening hours, using the field name as the key so the screen can show each message next to its input. Keeping rules in a plain function like this is what makes them easy to test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'The empty message flashes while loading',
          prompt: 'Customers see "You have no bookings yet." for a moment every time the page loads, even though they have bookings. The empty check runs while the data is still loading. Fix the line.',
          concept: 'screen states',
          language: 'javascript',
          code: `function bookingsMessage(state) {
  if (state.error) return 'Could not load your bookings. Try again.';
  if (state.bookings.length === 0) return 'You have no bookings yet.';
  if (state.loading) return 'Loading your bookings...';
  return state.bookings.length + ' bookings';
}`,
          bugLine: 3,
          fixes: [
            {
              line: "  if (!state.loading && state.bookings.length === 0) return 'You have no bookings yet.';",
              correct: true,
              why: 'Empty only counts as empty when the loading has finished; while loading, the next line shows the loading message.',
            },
            {
              line: "  if (state.loading || state.bookings.length === 0) return 'You have no bookings yet.';",
              correct: false,
              why: 'This says "no bookings yet" while loading, which is exactly the flash we want to remove.',
            },
            {
              line: "  if (state.bookings.length === 0 && state.error) return 'You have no bookings yet.';",
              correct: false,
              why: 'The error case was already handled on the line above, so this would show "no bookings" only when the app is in a broken state.',
            },
            {
              line: "  if (state.bookings.length > 0) return 'You have no bookings yet.';",
              correct: false,
              why: 'This is the opposite: it would tell customers with bookings that they have none.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'bookingsMessage',
            cases: [
              { label: 'loading with nothing yet', args: [{ loading: true, error: null, bookings: [] }], expected: 'Loading your bookings...' },
              { label: 'failed to load', args: [{ loading: false, error: 'x', bookings: [] }], expected: 'Could not load your bookings. Try again.' },
              { label: 'loaded, nothing there', args: [{ loading: false, error: null, bookings: [] }], expected: 'You have no bookings yet.' },
              { label: 'loaded with two bookings', args: [{ loading: false, error: null, bookings: [1, 2] }], expected: '2 bookings' },
            ],
          },
          hints: [
            'While the data is loading, the list is empty too. Which line decides what to show then?',
            'The empty message should only appear when loading is finished.',
            'Add !state.loading && to the empty check.',
          ],
          explanation: 'An empty list is true both before the data arrives and when there really is nothing. The empty state must be shown only when loading has finished, otherwise customers see a wrong message on every visit.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-08-match-1',
          kind: 'match',
          title: 'Which state should the screen show?',
          prompt: 'Match each situation to the state the screen should show.',
          concept: 'screen states',
          labels: { terms: 'Situation', meanings: 'State to show' },
          pairs: [
            {
              term: 'A first-time customer opens My bookings and the server answers with an empty list',
              definition: 'Empty state',
              note: 'The request worked and there is nothing to show, so say what to do next.',
            },
            {
              term: 'The customer is on a slow phone and the bookings request is still on its way',
              definition: 'Loading state',
              note: 'Tell them something is happening instead of showing a blank page.',
            },
            {
              term: 'The phone loses signal and the request never gets an answer',
              definition: 'Error state with Try again',
              note: 'The request failed, so explain it and offer a retry.',
            },
            {
              term: 'The customer presses Book and the request is being sent',
              definition: 'Saving state',
              note: 'Disable the button so a second tap cannot create a second booking.',
            },
          ],
          hints: [
            'Two of these are about waiting, one about nothing to show, one about failure.',
            'A form that is being sent is the one that needs a disabled button.',
            'Empty means the request succeeded with no data; error means it did not succeed.',
          ],
          explanation: 'Each state answers a different question the customer has: is it working, did it fail, is there nothing here, or did my tap register. Naming the state first makes the right screen obvious.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-08-q1',
        prompt: 'A new customer opens My bookings and the server returns an empty list. Which screen is best?',
        choices: [
          'A blank area where the list would be, since there is nothing to show yet',
          'A short message saying there are no bookings yet and how to make the first one',
          'The text "Error: no data", so the customer knows the request worked but nothing arrived',
        ],
        answer: 1,
        explanation: 'An empty state should explain the situation and suggest the next step, not leave a blank space or pretend something failed.',
      },
      {
        id: 'build-fullstack-ai-08-q2',
        prompt: 'Why does the API log the full error but answer a 500 with only a calm generic message?',
        choices: [
          'Detailed messages are too long to send over a slow mobile connection to the customer',
          'Customers cannot read English error messages, so a generic one is easier to understand',
          'Express cannot send an error that has a stack trace, so the details have to be removed',
          'The details help attackers learn how the app is built, so they stay in the log',
        ],
        answer: 3,
        explanation: 'Stack traces, SQL and file paths describe your internals. Keep them in your log and send the customer nothing sensitive.',
      },
      {
        id: 'build-fullstack-ai-08-q3',
        prompt: 'Why does api.js treat "fetch rejected" differently from "the server answered 409"?',
        choices: [
          'A rejection means no answer arrived (offline or server down); a 409 is an answer with a reason to show',
          'A 409 is a network error, and a rejected fetch is always caused by invalid input from the form',
          'Both mean the same thing, and the code only separates them to make the file look tidier',
        ],
        answer: 0,
        explanation: 'The first means the request never completed; the second means the server answered and said why it refused. They need different messages.',
      },
      {
        id: 'build-fullstack-ai-08-q4',
        prompt: 'The Book button is not disabled while the request is in flight. What can go wrong?',
        choices: [
          'Nothing: buttons are only visual, and the server ignores a second identical request',
          'The browser caches the first answer, so the second tap shows an old booking',
          'The server runs out of memory because buttons that stay enabled use more of it',
          'A customer on a slow phone taps twice and sends two bookings',
        ],
        answer: 3,
        explanation: 'Without a saving state, a second tap sends a second request. The button should be disabled until the first finishes.',
      },
      {
        id: 'build-fullstack-ai-08-q5',
        audience: { max: 'beginner' },
        prompt: `In plain words, why show "We can't reach the server" with a Try again button instead of a blank page?`,
        choices: [
          'It makes the page load quicker the next time, because the browser remembers the message',
          'It is required by the law of every country in which a booking website is able to operate',
          'The customer is told what happened and has something to do next',
        ],
        answer: 2,
        explanation: 'A clear message and a way forward keeps customers from giving up. A blank page leaves them guessing.',
      },
      {
        id: 'build-fullstack-ai-08-q6',
        audience: { min: 'advanced' },
        prompt: 'Your error tracker is flooded with alerts for "That time is already booked". What is the best fix?',
        choices: [
          'Turn the error tracker off, since a flood of alerts proves the monitoring is not useful',
          'Report only unexpected errors (bugs and outages) and treat a 409 as a normal response',
          'Change the status code of every conflict to 200 so that it no longer counts as an error',
          'Increase the alert threshold so that any alert is sent only when a thousand have arrived',
        ],
        answer: 1,
        explanation: 'A conflict is the system working as designed. Alert on the unexpected so that real failures are not buried.',
      },
    ],
    task: {
      title: 'Break your own app on purpose',
      minutes: 20,
      steps: [
        'Send the states prompt to your AI tool and run the app.',
        'Force each state in the browser: slow the network in the developer tools for loading, switch to offline for error, use a new account for empty, and double-click Book for saving.',
        'Call the API with bad JSON, a missing field and a nonexistent id, and confirm every error has the same shape and no stack trace.',
        'Write down any state you could not reach or that looked wrong, and fix the worst one with a fenced prompt.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to show you the four versions of the My bookings screen as plain sentences, and to point at the line of code that decides each one.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a React error boundary around the booking list, make the retry idempotent, and add an alert rule that ignores 4xx responses but notifies you about any 5xx.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-09',
    day: 9,
    title: 'Review what the AI built for security',
    summary: "Attack your own app the way a stranger would: read another customer's booking, inject SQL, forge a role, find a leaked key and abuse CORS, then fix each and prove it.",
    intro: {
      objectives: [
        "Test whether one customer can see or change another customer's bookings, and fix it",
        'Spot and fix SQL built from user input, unsafe input handling, a key in the source and a CORS misconfiguration',
        'Use a repeatable script and the OWASP Top 10 to review AI-written code',
      ],
      why: 'AI writes code that works, and working code is not safe code. Every flaw in this lesson was in code that passed the happy-path demo, and each was found by a few minutes of asking "what if I am not an honest customer?".',
    },
    minutes: 35,
    skills: ['security-review'],
    body: [
      {
        type: 'paragraph',
        text: 'Everything so far worked: customers signed in, booked, got errors in a friendly shape. Now we do what AI tools rarely do for themselves: act as an attacker. The method is simple. Read the code for places where it **trusts the outside world**, then try to break each one with a real request, watch it fail, fix it and run the same request again. This lesson shows five findings from the booking app, each with the real failing output and the real output after the fix. The first, **broken authorisation**, is the most common serious flaw in AI-built apps.',
      },
      {
        type: 'paragraph',
        text: 'A map helps. The OWASP Top 10 is a widely used list of the most serious web application risks, and the current edition on the date checked is **OWASP Top 10:2025**. The findings here fall under: A01 Broken Access Control (finding 1), A05 Injection (finding 2), A07 Authentication Failures (the login messages and rate limit), A06 Insecure Design (trusting the browser with roles and prices), A02 Security Misconfiguration (CORS and headers), and, for dependencies and logs, A03 Software Supply Chain Failures and A09 Security Logging and Alerting Failures (lesson 12).',
      },
      {
        type: 'version',
        text: 'OWASP Top 10:2025 is the current edition on the date checked. Its ten categories are: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging & Alerting Failures and A10 Mishandling of Exceptional Conditions. Categories are renumbered between editions, so always say which edition you mean. The OWASP Cheat Sheet Series says to validate permissions on every request, deny by default, and test authorisation logic with automated tests; and its SQL injection cheat sheet lists parameterised queries and allow-list validation as the primary defences.',
        checked: CHECKED,
        sources: [DOCS.owaspTop10, DOCS.owaspAuthz, DOCS.owaspSqli],
      },
      { type: 'heading', text: "Finding 1: can one customer see another's bookings?" },
      {
        type: 'paragraph',
        text: '**Authentication** asked "who are you?"; **authorisation** asks "may you do this to *this* thing?". The first generated version checked that a customer was signed in, and nothing more. Look at the route that returns one booking: it finds the booking by number and returns it, whoever asks. A visitor only has to change the number in the address. This pattern has a name: **insecure direct object reference**, a kind of broken access control.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Before: the route finds any booking by its number',
        code: `bookingsRouter.get('/:id', async (req, res) => {
  const { rows } = await query(\`SELECT \${COLUMNS}, user_id AS "userId" FROM bookings WHERE id = $1\`, [req.params.id]);
  if (rows.length === 0) throw new AppError(404, 'not_found', 'Booking not found');
  res.json({ booking: rows[0] });
});

bookingsRouter.delete('/:id', async (req, res) => {
  const { rowCount } = await query(\`UPDATE bookings SET status = 'cancelled' WHERE id = $1\`, [req.params.id]);
  if (rowCount === 0) throw new AppError(404, 'not_found', 'Booking not found');
  res.status(204).end();
});`,
      },
      {
        type: 'paragraph',
        text: 'The review script signs up two customers, Ana and Ben, has each make a booking, and then tries to cross the line. These are the real results against the code above:',
      },
      {
        type: 'code',
        language: 'text',
        label: "Before (real output): Ben reads, then cancels, Ana's booking",
        code: `1) Ben (customer 2) asks for booking 1, which is Ana's:
{"booking":{"id":1,"courtId":1,"startsAt":"2026-12-05T10:00:00.000Z","endsAt":"2026-12-05T12:00:00.000Z","totalCents":70000,"status":"confirmed","notes":"Ana league night","proofFile":null,"userId":1}} [200]
   Ben cancels booking 1:
   [204]`,
      },
      {
        type: 'paragraph',
        text: "Ben read Ana's booking, including her private note, and cancelled it. The same gap existed on the proof-of-payment routes. The fix is not in the front end (Ben never has to use it) but in the query: a booking is loaded only if it belongs to the signed-in customer, or the customer is an admin, and a booking that belongs to someone else is answered exactly like one that does not exist (404, not 403, so even its existence is not confirmed). One function, used by every route that takes a booking number, means a route cannot forget it.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'After: one loadBooking function that every route uses',
        code: `// Loads one booking into req.booking, but only if it belongs to the signed-in customer (or they are an admin).
// Someone else's booking looks exactly like a booking that does not exist.
async function loadBooking(req, _res, next) {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) throw new AppError(404, 'not_found', 'Booking not found');
  const { rows } = await query(
    \`SELECT \${COLUMNS} FROM bookings WHERE id = $1 AND (user_id = $2 OR $3::boolean)\`,
    [id.data, req.user.id, req.user.role === 'admin'],
  );
  if (rows.length === 0) throw new AppError(404, 'not_found', 'Booking not found');
  req.booking = rows[0];
  next();
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'After (real output): the same two requests',
        code: `1) Ben (customer 2) asks for booking 1, which is Ana's:
{"error":{"code":"not_found","message":"Booking not found"}} [404]
   Ben cancels booking 1:
   [404]`,
      },
      { type: 'heading', text: "Finding 2: SQL built from the customer's words" },
      {
        type: 'paragraph',
        text: 'The list route lets a customer filter by status, and the first version built its SQL by pasting the filter into the text of the query. The customer is supposed to send `confirmed` or `cancelled`. Nothing forces them to.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Before: the status goes straight into the SQL text',
        code: `bookingsRouter.get('/', async (req, res) => {
  const { status } = req.query;
  let sql = \`SELECT \${COLUMNS}, user_id AS "userId" FROM bookings WHERE user_id = \${req.user.id}\`;
  if (status) sql += \` AND status = '\${status}'\`;
  sql += ' ORDER BY starts_at';
  const { rows } = await query(sql);
  res.json({ bookings: rows });
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: "Before (real output): a crafted status value returns other customers' bookings",
        code: `2) Ben filters his list with a crafted status value:
{"bookings":[{"id":2, ... "notes":"Ben practice", ... "userId":2},{"id":1, ... "status":"cancelled","notes":"Ana league night", ... "userId":1}]} ...`,
      },
      {
        type: 'paragraph',
        text: "The value sent was `x' OR user_id <> 0 --`. The quote closes the text early, `OR user_id <> 0` is true for every row, and `--` turns the rest of the line into a comment. Ben got Ana's booking back from his own list. This is **SQL injection**. The defence is the one used by the other routes: send the SQL and the values separately with placeholders (`$1`), and, for a value that can only be one of a few things, accept only those things.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'After: an allow-list for the value, and a placeholder in the query',
        code: `// My bookings, optionally only one status.
bookingsRouter.get('/', async (req, res) => {
  const { status } = parse(listQuerySchema, req.query);
  const { rows } = await query(
    \`SELECT \${COLUMNS} FROM bookings WHERE user_id = $1 AND ($2::text IS NULL OR status = $2) ORDER BY starts_at\`,
    [req.user.id, status ?? null],
  );
  res.json({ bookings: rows });
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'After (real output)',
        code: `2) Ben filters his list with a crafted status value:
{"error":{"code":"invalid_input","message":"Please check the highlighted fields","fields":{"status":"Invalid option: expected one of \\"confirmed\\"|\\"cancelled\\""}}} ...`,
      },
      { type: 'heading', text: 'Finding 3: trusting what the browser says' },
      {
        type: 'paragraph',
        text: 'Two more places trusted the request. The register route copied a `role` field from the request body into the new account, and the booking route used the `totalCents` that the browser sent (lesson 2 spotted it in the form). A visitor who adds `"role":"admin"` to the sign-up request becomes an admin, and one who sends `"totalCents":1` pays one centavo for two hours. The stored result shows it:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Before (real output): an admin account and a two-hour booking for one centavo',
        code: `3) Registering with a role nobody offered, and booking 2 hours for 1 centavo:
{"user":{"id":3,"name":"Mallory","email":"mal@example.com","role":"admin"}}
booking 3 hours=2.0000000000000000 total_cents=1`,
      },
      {
        type: 'paragraph',
        text: 'The fix is the pattern behind most input bugs: describe exactly what a request may contain, and refuse the rest. A schema library (here Zod) makes that a few lines, and a **strict** schema rejects fields you did not list. Roles are never read from the request, and the price is worked out on the server from its own court prices. Money, roles and ownership are decided by the server, never by the browser.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'After: strict schemas refuse unknown fields (server/src/schemas.js)',
        code: `import { z } from 'zod';
import { AppError } from './errors.js';

// strictObject rejects any field we did not list, so a client cannot slip in { role: 'admin' }.
export const registerSchema = z.strictObject({
  name: z.string().trim().min(1).max(80),
  email: z.email().max(254),
  password: z.string().min(10).max(128),
});

export const loginSchema = z.strictObject({
  email: z.string().max(254),
  password: z.string().max(128),
});

export const bookingSchema = z.strictObject({
  courtId: z.int().positive(),
  startsAt: z.string().max(40),
  hours: z.int(),
  notes: z.string().trim().max(500).optional(),
});

export const listQuerySchema = z.strictObject({
  status: z.enum(['confirmed', 'cancelled']).optional(),
});

export const idSchema = z.coerce.number().int().positive();

// Turns a failed parse into our one error shape, with a message per field.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'After (real output): the role is refused, the extra price field is refused, and a normal request is priced by the server',
        code: `3) ... {"error":{"code":"invalid_input","message":"Please check the highlighted fields","fields":{"_":"Unrecognized key: \\"role\\""}}}

with totalCents:
{"error":{"code":"invalid_input","message":"Please check the highlighted fields","fields":{"_":"Unrecognized key: \\"totalCents\\""}}}
without:
{"booking":{"id":1,"courtId":1,"startsAt":"2026-12-06T02:00:00.000Z","endsAt":"2026-12-06T04:00:00.000Z","totalCents":70000,"status":"confirmed","notes":null,"proofFile":null},"emailSent":true}`,
      },
      { type: 'heading', text: 'Finding 4: a key in the source code' },
      {
        type: 'paragraph',
        text: 'A search of the first version for anything that looks like a secret takes one command, and an attacker with access to your repository, or its history, will run the same one:',
      },
      { type: 'code', language: 'bash', label: 'Search the code for secrets', code: 'git grep -n -E "key_live|postgres://|Bearer" -- server/src' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output on the first version',
        code: `server/src/db.js:4:  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/courts',
server/src/email.js:3:const EMAIL_API_KEY = 'key_live_51Nf8aXyZqLmPw93kd02';
server/src/email.js:8:    headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${EMAIL_API_KEY}\` },`,
      },
      {
        type: 'paragraph',
        text: 'Two findings: a live-looking email key written into a file, and a database address with a password used as a silent fallback. (The key is invented for this course.) The fix has four parts: read every secret from an **environment variable**, make the app **refuse to start** if one is missing so a typo is caught immediately, list the variables in a `.env.example` with no real values and keep the real `.env` out of git, and, because the key was committed, **replace it at the provider**, since deleting the line does not delete it from history.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'After: server/src/config.js reads and checks the settings once',
        code: `// Read every setting once, and refuse to start if one is missing.
const required = ['DATABASE_URL', 'EMAIL_API_URL', 'EMAIL_API_KEY'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(\`Missing required environment variables: \${missing.join(', ')}\`);
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  emailApiUrl: process.env.EMAIL_API_URL,
  emailApiKey: process.env.EMAIL_API_KEY,
  // Browsers on these origins may call the API with cookies. Empty means same-origin only.
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
  production: process.env.NODE_ENV === 'production',
};`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output when the settings are missing',
        code: `Missing required environment variables: DATABASE_URL, EMAIL_API_URL, EMAIL_API_KEY
Missing required environment variables: EMAIL_API_URL, EMAIL_API_KEY`,
      },
      { type: 'heading', text: 'Finding 5: CORS, headers and guessing' },
      {
        type: 'paragraph',
        text: `**CORS** is a rule that browsers follow, not a lock on your server. By default a browser stops a page on one website from reading answers from another website's API. A server can relax that by sending \`Access-Control-Allow-Origin\`. When the front end showed a "CORS error" during development, the AI "fixed" it with the most permissive setting, \`cors({ origin: true, credentials: true })\`, which **copies back whatever origin asked** and says cookies are welcome. Now a page on any site can make a signed-in customer's browser call your API and read the answer.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Before (real output): an unknown website is told it may read the answer, with cookies',
        code: `4) A page on https://evil.example asks the API with Ana's cookie:
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
   preflight:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE`,
      },
      {
        type: 'paragraph',
        text: 'The fix is an **allow-list** of the origins you really use, from the settings (empty means "same address only", which is all you need when the Express server serves the web app). The after output has no `Access-Control-Allow-Origin` line at all, so a browser refuses to let the other page read the answer. Notice the line that remains, `Access-Control-Allow-Credentials: true`: on its own it grants nothing, because browsers need both headers to match. Also notice what CORS is **not**: `curl` ignores it entirely, so it is never a replacement for the authorisation check in finding 1.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'After: helmet adds security headers, and CORS comes from an allow-list',
        code: `  const app = express();
  app.use(helmet());
  // Only the origins we list may read responses with cookies; everyone else gets no CORS headers.
  app.use(cors({ origin: config.allowedOrigins, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(loadUser);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'After (real output)',
        code: `4) A page on https://evil.example asks the API with Ana's cookie:
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
   preflight:
HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE`,
      },
      {
        type: 'paragraph',
        text: 'The same finding covers two cheap hardening steps. The `X-Powered-By: Express` header from the "before" output is gone because helmet removes it and adds headers such as `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` and a Content-Security-Policy. And the login route now **limits attempts**: eight wrong passwords in a row were all answered `401` before, and after the fix the eighth is refused:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Before and after (real output): eight wrong passwords in a row',
        code: `Before: 401 401 401 401 401 401 401 401
After:  401 401 401 401 401 401 401 429`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'After: the unknown-email and wrong-password answers are now the same',
        code: '{"error":{"code":"bad_login","message":"Wrong email or password"}}',
      },
      {
        type: 'version',
        text: "MDN's CORS guide says a credentialed request needs an explicit origin (never the * wildcard) in Access-Control-Allow-Origin plus Access-Control-Allow-Credentials: true, and that the mechanism is enforced by browsers. The Express security guide recommends Helmet, non-default cookie names with secure and httpOnly options, limiting repeated authorisation attempts and checking dependencies. This course's project used Helmet 8.3, express-rate-limit 8.7 (its README documents the windowMs, limit and standardHeaders options) and Zod 4.6, whose strict objects reject unknown keys.",
        checked: CHECKED,
        sources: [DOCS.mdnCors, DOCS.expressSecurity, DOCS.rateLimit, DOCS.zodDocs],
      },
      { type: 'heading', text: 'Make the review repeatable' },
      {
        type: 'paragraph',
        text: 'The five checks above live in a small script, `attack.sh`, which anyone can run against a local or a staging server in seconds. Ask the AI to write one for your app, and ask it separately to review the code against the OWASP list; its review will find things, but only a real request proves a fix. Lesson 10 turns each check into an automated test so a future change cannot quietly bring a flaw back.',
      },
      {
        type: 'prompt',
        label: 'Security review prompt (and the habit that goes with it)',
        text: 'Review the code in server/src against OWASP Top 10:2025. For each finding give: the file and line, what an attacker could do, a curl command that demonstrates it, and the smallest fix. Cover at least: authorisation on every route that takes an id, SQL built from input, fields trusted from the request body (roles, prices, ownership), secrets in source, CORS settings, error messages that reveal internals, and login behaviour (messages, rate limit). Do not change any code yet.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Run each curl command yourself before accepting a fix, and run it again after.',
          'Fix with the smallest change, then commit it with the finding in the message.',
          'Add an automated test for every finding (lesson 10).',
          'Keep a SECURITY-REVIEW.md: finding, evidence, fix, test. It is a project deliverable.',
        ],
      },
      {
        type: 'warning',
        text: 'An AI review is a list of suspects, not a verdict. It misses things and sometimes invents flaws. Treat its output as a to-do list for you to verify with a real request, and never paste secrets, customer data or production credentials into the review prompt.',
      },
      {
        type: 'paragraph',
        text: 'Think of a block of **apartments**. Authentication is the front door key: it proves you live in the building. Authorisation is whether your key opens *your* flat only. The first version of our app had a key that opened the front door and then every flat, if you changed the number on the door. SQL injection is like a visitor who writes on the delivery slip "and also open the safe" and the clerk obeys, because he reads the slip as instructions. Trusting the browser is like believing a customer who tells the shop assistant "the price is one centavo". And a key hidden under the doormat (the key in the code) is only safe until someone looks.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'When you test these yourself, you do not need to be a hacker. The tools are ordinary: a terminal with `curl`, the Network tab of your browser, and the ability to change one number or one word in a request and see what happens. The rule of thumb is: for every place the app **takes something from outside** (a number in the address, a word in a form, a header, a file), ask "what if this is not what I expect?" and try it.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Explain this finding as if I were the shop owner: what would a customer see, and what would it cost me?" Then ask for the fix, and check it with the same request.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'Move from findings to controls. Make authorisation **deny by default**: centralise it in one policy function or middleware (`can(user, action, resource)`), so a new route has to opt in rather than remember, and write an authorisation matrix test (every role against every route and a foreign resource). Where the data layer allows, add defence in depth in the database: PostgreSQL row-level security policies filter rows per role, and an enabled table with no policy denies everything; hosted backends that let the browser talk to the database directly depend on them entirely. In CI, run dependency audit (supply chain), secret scanning on every push, static analysis and the attack script against a preview environment. Log authorisation failures and rate-limit hits (without secrets) and alert on spikes, because detection is its own OWASP category. Put the threat model, the findings and the accepted risks in the repository, so the next agent session starts from them.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Review AI code by finding every place it trusts the outside world, then try to break each one with a real request, before and after the fix.',
          'Authorisation is checked on the server for every thing a customer can name: load a record only if it belongs to them (or they are an admin) and answer anything else as not found.',
          'Never build SQL from input and never accept fields you did not list: use placeholders, allow-lists and strict schemas, and let the server decide roles and prices.',
          'Secrets live in environment variables validated at startup, and a leaked key is replaced, not just deleted; CORS is a browser rule with an allow-list, never a substitute for authorisation.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'Missing authorisation check',
          prompt: 'This function finds a booking for the signed-in user. Right now any customer can get any booking by its number. Fix the line so a customer gets only their own bookings and an admin gets any.',
          concept: 'authorisation',
          language: 'javascript',
          code: `function findBooking(bookings, user, id) {
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;
  return booking;
}`,
          bugLine: 4,
          fixes: [
            {
              line: "  return booking.userId === user.id || user.role === 'admin' ? booking : null;",
              correct: true,
              why: 'The booking is returned only to its owner or to an admin; everyone else gets the same null as a missing booking.',
            },
            {
              line: '  return booking.userId === user.id ? booking : null;',
              correct: false,
              why: 'Owners are protected, but admins can no longer see bookings, which the spec allows.',
            },
            {
              line: "  return user.role === 'admin' ? booking : null;",
              correct: false,
              why: 'Only admins would see bookings, so a customer could not see their own.',
            },
            {
              line: '  return booking.userId !== user.id ? booking : null;',
              correct: false,
              why: 'This is backwards: it returns the booking to everyone except its owner.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'findBooking',
            cases: [
              {
                label: 'the owner sees their booking',
                args: [[{ id: 1, userId: 1 }], { id: 1, role: 'customer' }, 1],
                expected: { id: 1, userId: 1 },
              },
              { label: 'another customer gets nothing', args: [[{ id: 1, userId: 1 }], { id: 2, role: 'customer' }, 1], expected: null },
              { label: 'an admin sees any booking', args: [[{ id: 1, userId: 1 }], { id: 9, role: 'admin' }, 1], expected: { id: 1, userId: 1 } },
              { label: 'a missing booking is null', args: [[{ id: 1, userId: 1 }], { id: 1, role: 'customer' }, 5], expected: null },
            ],
          },
          hints: [
            'The function checks that the booking exists, but never asks who is allowed to see it.',
            'The booking has userId; the user has id and role. Who should be allowed?',
            'Return the booking only if booking.userId === user.id or the role is admin; otherwise null.',
          ],
          explanation: 'A signed-in user is not automatically allowed to see every record. The check belongs where the record is loaded, and answering null for both "not yours" and "not there" does not even confirm that the booking exists.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-09-fix-bug-2',
          kind: 'fix-bug',
          title: "SQL built from a customer's words",
          prompt: 'This function builds the query for "my bookings" with an optional status. The status goes straight into the SQL text. Fix the line so the status travels as a value ($2), not as part of the SQL.',
          concept: 'SQL injection',
          language: 'javascript',
          code: `function bookingsQuery(userId, status) {
  let text = 'SELECT * FROM bookings WHERE user_id = $1';
  const values = [userId];
  if (status) {
    text += " AND status = '" + status + "'";
  }
  return { text, values };
}`,
          bugLine: 5,
          fixes: [
            {
              line: "    text += ' AND status = $2'; values.push(status);",
              correct: true,
              why: 'The SQL text stays fixed and the status is passed separately as a value, so it can never be read as SQL.',
            },
            {
              line: `    text += " AND status = '" + status.replace("'", "''") + "'";`,
              correct: false,
              why: 'Hand-made escaping is easy to get wrong and still builds SQL from input; placeholders are the safe, simple answer.',
            },
            {
              line: "    text += ' AND status = ' + status;",
              correct: false,
              why: "This still puts the customer's words into the SQL text, and it even removes the quotes.",
            },
            {
              line: "    text += ' AND status = $2';",
              correct: false,
              why: 'The placeholder is there, but the value is never added to values, so the database has nothing to put in it.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'bookingsQuery',
            cases: [
              {
                label: 'a normal status',
                args: [1, 'confirmed'],
                expected: { text: 'SELECT * FROM bookings WHERE user_id = $1 AND status = $2', values: [1, 'confirmed'] },
              },
              {
                label: 'an attack string stays a value',
                args: [2, "x' OR user_id <> 0 --"],
                expected: { text: 'SELECT * FROM bookings WHERE user_id = $1 AND status = $2', values: [2, "x' OR user_id <> 0 --"] },
              },
              { label: 'no status, no filter', args: [3, undefined], expected: { text: 'SELECT * FROM bookings WHERE user_id = $1', values: [3] } },
            ],
          },
          hints: [
            'The status is joined into the text of the query. Where should it go instead?',
            'The first value already uses $1. The status can use $2 and be added to the values array.',
            "Use text += ' AND status = $2'; and values.push(status);",
          ],
          explanation: "Placeholders keep the command and the data apart, so a value can never change what the query does. Escaping by hand and joining strings both leave the customer's words inside the SQL.",
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-09-fix-bug-3',
          kind: 'fix-bug',
          title: 'A CORS check that lets the wrong website in',
          prompt: 'The API should allow only https://courts.example.ph. This check uses startsWith, and a site called https://courts.example.ph.evil.io is accepted too. Fix the line.',
          concept: 'CORS allow-list',
          language: 'javascript',
          code: `const ALLOWED = ['https://courts.example.ph'];

function isAllowedOrigin(origin) {
  return ALLOWED.some((allowed) => origin.startsWith(allowed));
}`,
          bugLine: 4,
          fixes: [
            {
              line: '  return ALLOWED.includes(origin);',
              correct: true,
              why: 'An exact match against the list accepts only the origins you wrote down.',
            },
            {
              line: '  return ALLOWED.some((allowed) => origin.includes(allowed));',
              correct: false,
              why: "includes is even looser: the allowed text can appear anywhere inside the attacker's origin.",
            },
            {
              line: '  return ALLOWED.some((allowed) => origin.endsWith(allowed));',
              correct: false,
              why: 'An attacker can still put the allowed text at the end of their own address.',
            },
            { line: '  return true;', correct: false, why: 'This allows every origin, which is the problem we are fixing.' },
          ],
          tests: {
            kind: 'function',
            fn: 'isAllowedOrigin',
            cases: [
              { label: 'the real front end', args: ['https://courts.example.ph'], expected: true },
              { label: 'a look-alike with the real name at the start', args: ['https://courts.example.ph.evil.io'], expected: false },
              { label: 'a look-alike with the real name at the end', args: ['https://evil.example/https://courts.example.ph'], expected: false },
              { label: 'an unrelated site', args: ['https://evil.example'], expected: false },
            ],
          },
          hints: [
            'The attacker controls the whole origin string. What does startsWith allow after the allowed text?',
            'You want to accept only exact matches from the list.',
            'Use ALLOWED.includes(origin), which compares the whole string.',
          ],
          explanation: 'An origin must match an allowed origin exactly. Partial matches such as startsWith, includes or endsWith let an attacker register an address that contains yours.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-09-scenario-1',
          kind: 'scenario',
          title: 'The key was committed',
          prompt: 'Choose the response that actually removes the risk.',
          concept: 'leaked secrets',
          situation: 'During review you find the live email provider key written in src/email.js, and the repository was shared with a freelancer last month. The AI tool offers to delete the line and commit.',
          options: [
            {
              text: 'Create a new key at the provider and revoke the old one, move the new key to an environment variable, add a startup check and a .env.example, and add .env to .gitignore',
              consequence: 'The old key no longer works for anyone who copied it, the new one never touches the code, and a missing setting is caught when the app starts.',
              quality: 'best',
            },
            {
              text: 'Delete the line and commit; the key is gone from the code now',
              consequence: "The key is still in the git history and in the freelancer's copy, and it still works at the provider. Anyone who looks can use it.",
              quality: 'poor',
            },
            {
              text: 'Move the key to an environment variable but keep using the same key',
              consequence: 'The code is clean from now on, but the exposed key still works for everyone who saw it, so the risk remains until it is replaced.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Where else does the old key exist besides the current file?',
            'Deleting a line does not delete history, and the provider still accepts the old key.',
            'The key must be replaced at the provider, and the new one kept out of the code.',
          ],
          explanation: 'A secret that was committed or shared must be treated as public: replace it at the provider and revoke the old one. Moving it to the environment prevents the next leak but does not undo this one.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-09-q1',
        prompt: "A customer changes the number in /api/bookings/12 to 13 and sees someone else's booking. What is the best name for this flaw and fix?",
        choices: [
          'A CORS error: allow only your own website to call the API from a browser, and block all the others',
          'SQL injection: replace the text of the query with a stored procedure that takes the booking number',
          "Broken authorisation: load the booking only if it is the customer's own, otherwise answer 404",
          'A weak password: force customers to choose much longer passwords with symbols at sign-up time',
        ],
        answer: 2,
        explanation: 'The server checked who the customer was but not whether this record is theirs. The ownership check belongs in the query or in a function every route uses.',
      },
      {
        id: 'build-fullstack-ai-09-q2',
        prompt: "Why answer 404 rather than 403 when a customer asks for someone else's booking?",
        choices: [
          'It does not confirm the booking exists, so the numbers cannot be probed',
          'A 404 is cached by the browser, which makes the page load faster the next time the customer asks',
          'Both answers reveal nothing, and 404 is simply the one that an honest customer will understand best',
          'Because 403 is not a real HTTP status, and Express would refuse to send it from a route handler',
        ],
        answer: 0,
        explanation: 'A 403 tells an attacker the booking exists. Treating foreign records exactly like missing ones leaks nothing.',
      },
      {
        id: 'build-fullstack-ai-09-q3',
        prompt: 'Which fix actually stops SQL injection in the status filter?',
        choices: [
          'Removing every quote character from the status before joining it into the text of the query',
          'Placeholders for values, plus an allow-list for values with only a few choices',
          'Making the status lower case before it is added to the SQL string, so that keywords no longer match',
        ],
        answer: 1,
        explanation: 'Separating the command from the data stops values being read as SQL. Stripping characters or changing case still builds SQL from input.',
      },
      {
        id: 'build-fullstack-ai-09-q4',
        prompt: 'A request to register includes "role":"admin" and the server creates an admin. What is the most reliable fix?',
        choices: [
          'Hide the role field in the sign-up form, so that customers are not able to see that it exists',
          'Never read the role from the request: use a strict schema, and set roles on the server',
          'Check the role inside the browser, before the form is finally sent over to the server',
        ],
        answer: 1,
        explanation: 'Anything the browser sends can be changed. The server decides roles, prices and ownership, and a strict schema refuses unknown fields.',
      },
      {
        id: 'build-fullstack-ai-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is the difference between authentication and authorisation?',
        choices: [
          'Authentication is the password; authorisation is the email address',
          'They mean the same thing, and developers use the two words interchangeably',
          'Authentication is who you are; authorisation is what you are allowed to do',
        ],
        answer: 2,
        explanation: 'Signing in proves who you are. Authorisation decides whether you may do this particular thing to this particular record.',
      },
      {
        id: 'build-fullstack-ai-09-q6',
        audience: { min: 'advanced' },
        prompt: 'A new route is added by an agent and forgets the ownership check. Which design makes that mistake unlikely and detectable?',
        choices: [
          'Checking ownership only in the front end, which is the place where the booking list is built and shown',
          'A comment at the top of every route file reminding all of the developers to add an ownership check there',
          'Asking the agent in each prompt to please be careful, since it will remember that instruction for ever',
          'Deny by default through one shared policy, plus a matrix test that fails when a route lets a foreign user in',
        ],
        answer: 3,
        explanation: 'Centralising authorisation and testing it for every role and route turns a forgotten check into a failing build instead of a leak.',
      },
    ],
    task: {
      title: 'Run the five attacks against your own app',
      minutes: 20,
      steps: [
        "Sign up two customers with curl (or a script) and have each create a booking. Try to read, cancel and upload to the other's booking by number.",
        `Send a crafted filter value (x' OR 1=1 --) to any route that takes a query parameter, and try adding "role":"admin" to the sign-up body.`,
        'Search your source for keys and passwords with git grep, and send a request with an Origin header of https://evil.example to see what CORS headers come back.',
        'For each finding, write it in SECURITY-REVIEW.md with the evidence, ask your AI tool for the smallest fix, and run the same request again to prove it.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to explain each finding using the apartment-block story, and to name which request you would change by hand (the number, the word or the header) to test it.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write an authorisation matrix test (each role against each route and a foreign resource), and add secret scanning and the attack script to CI against a preview environment.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-10',
    day: 10,
    title: 'Test the whole application',
    summary: 'Have AI write unit, API and browser tests from your spec, then check the tests themselves: break the code on purpose and see whether they notice.',
    intro: {
      objectives: [
        'Explain what a unit test, an API test and an end-to-end test each catch',
        'Ask an AI tool for tests that name the spec rule they protect, including one for every security finding',
        'Tell a test that can fail from one that cannot, by breaking the code on purpose',
      ],
      why: 'AI will write you a hundred green tests in a minute, and a green test only helps if it can turn red. The most valuable testing skill when an AI writes the code is checking the tests, because they are the only thing standing between the next prompt and a broken booking system.',
    },
    minutes: 30,
    skills: ['testing-ci'],
    body: [
      {
        type: 'paragraph',
        text: "You now have an app that works when you click through it, and nothing that proves it still works after the next change. Every future prompt, yours or an agent's, can quietly break something: an ownership check removed while tidying, a price calculation changed. **Automated tests** are small programs that run the app and check the answers, so you find out in seconds instead of from a customer. In this lesson the AI writes them, and you learn the part it will not do for you: making sure they are real.",
      },
      { type: 'heading', text: 'Three kinds of test, three jobs' },
      {
        type: 'paragraph',
        text: 'Each kind of test looks at a different distance. A **unit test** calls one small function with no web server and no database, so it is instant and easy to read: `checkBooking` is a good candidate. An **API test** starts the real Express app and a real test database, sends real requests and checks the status and body. It is the best value for this app, because the rules live there. An **end-to-end test** drives a real browser through the real screens: slower, but the only one that proves the front end and back end work together. A healthy suite has many unit tests, a solid set of API tests and a few end-to-end tests of the journeys that earn money.',
      },
      {
        type: 'table',
        headers: ['Kind', 'Tool in the project', 'Catches', 'Speed'],
        rows: [
          ['Unit', 'Vitest', 'A rule broken in a pure function (opening hours, hours limit)', 'Milliseconds'],
          [
            'API',
            'Vitest and supertest, a test database',
            'A broken route: double booking, missing ownership check, wrong price',
            'Fractions of a second each',
          ],
          ['End to end', 'Playwright, a real Chrome', 'A broken screen, a broken join, a layout that scrolls sideways on a phone', 'Seconds each'],
          ['Manual', 'You, on a real phone', 'Whether it feels right', 'Minutes'],
        ],
        caption: 'Use the cheapest test that can catch the bug.',
      },
      {
        type: 'prompt',
        label: 'Prompt for tests that mean something',
        text: `Write automated tests for this app from the spec, not from the code. Use Vitest for unit tests of src/bookingRules.js, Vitest with supertest and a separate test database (TEST_DATABASE_URL) for API tests, and Playwright for three browser journeys. Rules: every test name states the SPEC rule it protects; include at least one test for each of these, which must fail if the protection is removed: overlapping bookings are refused, a customer cannot read, cancel or upload to another customer's booking, the price comes from the server, the role cannot be set at sign-up, the status filter refuses SQL, an unlisted origin gets no CORS permission, uploads must be small images, an email failure does not undo a booking. Mock only the outside email service. Tell me the command to run each group.

[paste SPEC.md and SECURITY-REVIEW.md]`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/tests/api.test.js: setup and two tests (as generated; fragment, the file continues)',
        code: `import request from 'supertest';
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { pool } from '../src/db.js';

vi.mock('../src/email.js', () => ({ sendEmail: vi.fn().mockResolvedValue(undefined) }));
const { sendEmail } = await import('../src/email.js');

const app = createApp();
const password = 'correct-horse-9';
const slot = (day, hour) => \`2026-12-\${String(day).padStart(2, '0')}T\${String(hour).padStart(2, '0')}:00:00+08:00\`;

// A "browser": supertest's agent keeps the session cookie between calls.
async function signUp(name) {
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/register').send({ name, email: \`\${name.toLowerCase()}@example.com\`, password });
  expect(res.status).toBe(201);
  return agent;
}

beforeEach(async () => {
  await pool.query('TRUNCATE bookings, sessions, users RESTART IDENTITY CASCADE');
  sendEmail.mockClear();
});
afterAll(() => pool.end());

describe('booking', () => {
  test('a signed-in customer books a court and the server prices it', async () => {
    const ana = await signUp('Ana');
    const res = await ana.post('/api/bookings').send({ courtId: 1, startsAt: slot(5, 18), hours: 2 });
    expect(res.status).toBe(201);
    expect(res.body.booking.totalCents).toBe(70000); // 2 hours x 35000, worked out by the server
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  test('two bookings that overlap on one court are refused with 409', async () => {
    const ana = await signUp('Ana');
    const ben = await signUp('Ben');
    await ana.post('/api/bookings').send({ courtId: 1, startsAt: slot(5, 18), hours: 2 }).expect(201);
    const clash = await ben.post('/api/bookings').send({ courtId: 1, startsAt: slot(5, 19), hours: 1 });
    expect(clash.status).toBe(409);
    expect(clash.body.error.code).toBe('slot_taken');
    // The same hour on the other court is fine, and back-to-back on the same court is fine.
    await ben.post('/api/bookings').send({ courtId: 2, startsAt: slot(5, 19), hours: 1 }).expect(201);
    await ben.post('/api/bookings').send({ courtId: 1, startsAt: slot(5, 20), hours: 1 }).expect(201);
  });
  // ... more tests follow ...
});`,
      },
      {
        type: 'paragraph',
        text: 'Read the shape of that file even if you never write one. A fake **browser** (`request.agent`) keeps the session cookie between calls. `beforeEach` empties the test tables so every test starts clean. Only the email service is replaced with a fake, because we do not want tests sending real mail. Each test is a short story with a clear name: book a court; try an overlap and expect `409`; check that back-to-back is fine. Here is the security test that protects finding 1 from lesson 9:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A test that protects the ownership rule',
        code: `  test("a customer cannot read, cancel or attach a file to someone else's booking", async () => {
    const ana = await signUp('Ana');
    const ben = await signUp('Ben');
    const { body } = await ana.post('/api/bookings').send({ courtId: 1, startsAt: slot(5, 18), hours: 1 });
    const id = body.booking.id;

    expect((await ben.get(\`/api/bookings/\${id}\`)).status).toBe(404);
    expect((await ben.delete(\`/api/bookings/\${id}\`)).status).toBe(404);
    expect((await ben.get(\`/api/bookings/\${id}/proof\`)).status).toBe(404);
    expect((await ana.get(\`/api/bookings/\${id}\`)).status).toBe(200);

    const list = await ben.get('/api/bookings');
    expect(list.body.bookings).toEqual([]);
  });`,
      },
      { type: 'heading', text: 'Run them, and read what they tell you' },
      { type: 'code', language: 'bash', label: 'Run the unit and API tests', code: 'cd server\nnpm test' },
      {
        type: 'paragraph',
        text: 'The first run of the generated suite did not pass, and the reason is instructive. One test failed, but not because of a bug in a rule:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'First run (real output, shortened)',
        code: ` ❯ tests/api.test.js (10 tests | 1 failed) 465ms
   ❯ security (6)
     × uploads must be small images 8ms

AssertionError: expected 429 to be 201 // Object.is equality

 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 17 passed (18)`,
      },
      {
        type: 'paragraph',
        text: "The test signed up eleven customers from one address, and lesson 9's login rate limit (ten attempts per fifteen minutes) refused the last sign-up with a `429`. The security fix and the test suite disagreed. The right answer is neither to remove the limit nor to delete the test: the limit became a setting (`AUTH_ATTEMPT_LIMIT`), the test environment raises it, and a separate small test file lowers it to 3 and checks that the fourth attempt really is refused. After that, the whole suite ran:",
      },
      {
        type: 'code',
        language: 'text',
        label: 'After the fix (real output)',
        code: ` Test Files  3 passed (3)
      Tests  20 passed (20)`,
      },
      { type: 'heading', text: 'Can the test fail? Break the code on purpose' },
      {
        type: 'paragraph',
        text: 'Here is the habit that separates a safety net from decoration. A test only protects you if it **fails when the code is wrong**. AI tools write tests that run the code and pass, and some of those tests would pass whatever the code did. The check takes one minute: remove the protection, run the tests, and expect red. To test the ownership test, the real project temporarily changed the query so that the owner check always passed:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The ownership check removed, tests run (real output)',
        code: ` ❯ tests/api.test.js (11 tests | 1 failed) 673ms
   ❯ security (7)
     × a customer cannot read, cancel or attach a file to someone else's booking 88ms

AssertionError: expected 200 to be 404 // Object.is equality

 ❯ tests/api.test.js:71:59
     71|     expect((await ben.get(\`/api/bookings/\${id}\`)).status).toBe(404);

 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 19 passed (20)`,
      },
      {
        type: 'paragraph',
        text: "Red, at exactly the line that checks Ben's access: the test is real. Now a test an AI might write for the same route, which looks reasonable and checks almost nothing:",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A weak test (fragment: the file imports are the same as the real tests)',
        code: `test('booking access works', async () => {
  const res = await request(createApp()).get('/api/bookings/1');
  expect(res.status).toBeLessThan(500);
});`,
      },
      { type: 'code', language: 'text', label: 'Run against the broken code (real output)', code: ' Tests  1 passed (1)' },
      {
        type: 'paragraph',
        text: 'It passes against the broken code, and it would pass against the correct code, and even when nobody is signed in (a `401` is also below 500). It cannot fail, so it protects nothing. Whenever a test of yours checks `toBeLessThan(500)`, `toBeDefined()` or "does not throw", ask the AI: "what bug would make this test fail?" If it has no answer, rewrite the assertion to check the exact status and body that the spec requires.',
      },
      { type: 'heading', text: 'The browser test' },
      {
        type: 'paragraph',
        text: 'The end-to-end tests use Playwright, which drives a real Chrome. The first one is the story from the spec: a customer signs up, sees the empty state, books, hits a clash and cancels.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'e2e/booking.spec.js: the main journey',
        code: `test('a customer books, hits a clash, and cancels', async ({ page }) => {
  await signUp(page, 'Ana');
  await expect(page.getByText('You have no bookings yet')).toBeVisible();

  await book(page, { hour: 18, hours: 2 });
  await expect(page.getByRole('status').filter({ hasText: 'Booked!' })).toBeVisible();
  await expect(page.getByRole('listitem')).toContainText('Court A');
  await expect(page.getByRole('listitem')).toContainText('₱700.00');

  await book(page, { hour: 19, hours: 1 });
  await expect(page.getByRole('status')).toHaveText('That time is already booked');

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('You have no bookings yet')).toBeVisible();
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the three browser tests',
        code: `Running 3 tests using 1 worker

  ✓  1 booking.spec.js:29:1 › a customer books, hits a clash, and cancels (1.0s)
  ✓  2 booking.spec.js:45:1 › another customer cannot take Ana's hour and never sees her booking (1.2s)
  ✓  3 booking.spec.js:59:1 › the booking page does not scroll sideways on a phone (458ms)

  3 passed (3.9s)`,
      },
      {
        type: 'version',
        text: "Vitest 5 (the current major on the date checked, v5.1.0) requires Node 22.12 or newer and Vite 6.4 or newer, and `vitest run` runs the tests once without watching. Playwright's installation guide says Node 22.x is the oldest supported line, and tests run with `npx playwright test` (headless, parallel, across the browsers you configure); this project's config used the installed Chrome. Supertest and the pg library are ordinary npm packages used here with their documented APIs.",
        checked: CHECKED,
        sources: [DOCS.vitestGuide, DOCS.playwrightIntro],
      },
      {
        type: 'warning',
        text: 'Tests that touch a database must never run against real data. Use a separate test database, keep its address in its own variable (TEST_DATABASE_URL), and have the tests refuse to run if the address does not look like a test database. An AI-written beforeEach that truncates tables is exactly the kind of line you do not want to point at production.',
      },
      {
        type: 'list',
        items: [
          'Name each test after the spec rule it protects.',
          'For every security finding there is a test that fails when the fix is removed.',
          'Run the break-it check on at least the money, ownership and overlap tests.',
          'Keep browser tests few: one per journey that earns money, plus a phone-width check.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Think of tests as a **checklist read by a very fast, very literal robot**. Before an airplane takes off, the crew goes through a written list: doors closed, fuel checked. The list does not make the plane safe by itself; it makes sure nobody forgets a step on a busy day. Your tests are that list for the app, and the robot runs it in seconds after every change. The "break it on purpose" check is like testing the smoke alarm by lighting a candle: you want to be sure it really rings.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: "To read a test without knowing the tools: `test('name', ...)` is one item on the list; the lines inside perform the action (book a court) and `expect(...)` states what must be true afterwards. A green tick means every `expect` held. The test names are plain sentences, so read them as a description of what the app promises. If the AI gives you tests, your first job is to read the names and ask: is anything in my spec missing from this list?",
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "List my spec rules in one column and the test that protects each in the other. Which rules have no test?" Missing rows are your next prompt.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'Think about what the suite costs and whether it can be trusted. Keep it fast enough to run on every push, isolate state (truncate per test or wrap each test in a transaction and roll it back) so order does not matter, and treat a flaky test as a bug, not noise: fix or delete it. Use **mutation testing** tools, or the manual break-it habit on critical paths, to measure whether tests detect faults, because line coverage only says code ran, not that anything was checked. Put contract tests between front end and API, run the API tests against a database of the same major version as production, and give security regressions their own named group so a failing one blocks a release. When an agent writes the tests and the code in one session, review the tests first: they are the specification the next session will trust.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Use three layers: unit tests for pure rules, API tests with a real test database for the routes, and a few browser tests for the journeys that matter.',
          'Ask for tests written from the spec, named after the rule they protect, with one for every security finding.',
          'A test is only worth something if it can fail: break the code on purpose and expect red, and distrust assertions like toBeLessThan(500).',
          'Never run tests against real data: use a separate test database and make the tests refuse anything else.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-10-predict-1',
          kind: 'predict-output',
          title: 'Which test can fail?',
          prompt: 'getBooking forgot the ownership check. Two tests check it, a weak one and a strong one. What does this print?',
          concept: 'weak and strong tests',
          language: 'javascript',
          code: `function getBooking(user, id) {
  return { id, userId: 1 }; // forgot to check that the booking belongs to this user
}

const weak = getBooking({ id: 2 }, 1) !== undefined;
const strong = getBooking({ id: 2 }, 1).userId === 2;
console.log('weak test passes:', weak);
console.log('strong test passes:', strong);`,
          choices: [
            `weak test passes: true
strong test passes: false`,
            `weak test passes: false
strong test passes: false`,
            `weak test passes: true
strong test passes: true`,
          ],
          wrongNotes: {
            'weak test passes: false\nstrong test passes: false': 'getBooking always returns an object, so it is never undefined: the weak check passes.',
            'weak test passes: true\nstrong test passes: true': 'The booking belongs to user 1 but the strong test expects user 2, which is the point: it fails on the broken code.',
          },
          hints: [
            'Is the result of getBooking ever undefined?',
            'The strong test asks whether the booking belongs to user 2, but the code always says user 1.',
            'The weak check is true (an object exists); the strong check is false (userId is 1, not 2).',
          ],
          explanation: 'The weak test passes against the broken code, so it would never warn you. The strong test checks the actual rule, who owns the booking, and fails, which is exactly what a test is for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-10-match-1',
          kind: 'match',
          title: 'Which test catches it?',
          prompt: 'Match each problem to the cheapest kind of check that would catch it.',
          concept: 'test layers',
          labels: { terms: 'Problem', meanings: 'Cheapest check that catches it' },
          pairs: [
            {
              term: 'checkBooking accepts a booking that ends at 11 PM',
              definition: 'Unit test of a pure function',
              note: 'The rule is in a plain function, so a unit test needs no server or database.',
            },
            {
              term: 'Two customers can both book Court A at 7 PM through the API',
              definition: 'API test with a real test database',
              note: 'This depends on the database constraint and the route together.',
            },
            {
              term: 'After a clash, the page shows no message because the front end drops it',
              definition: 'End-to-end test in a real browser',
              note: 'The API is right and the screen is wrong, so you need the browser.',
            },
            {
              term: 'The booking button is too small to tap comfortably on a cheap phone',
              definition: 'Manual check on a real phone',
              note: 'Feel and comfort are hard to automate.',
            },
          ],
          hints: [
            "Where does each problem live: a function, a route plus database, a screen, or a person's thumb?",
            'The clash message problem is on the screen, so which layer includes the screen?',
            'Pure function: unit; route and database: API; screen: end to end; feel: manual.',
          ],
          explanation: 'Use the cheapest test that can see the problem. A unit test cannot see a database constraint, and an end-to-end test is overkill for a pure rule. Feel needs a person.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-10-scenario-1',
          kind: 'scenario',
          title: 'All forty tests are green',
          prompt: 'Choose the next step.',
          concept: 'trusting tests',
          situation: 'You asked an agent for tests. It wrote forty in one go and every one passes on the first try. You are about to merge a change that the agent made while "tidying" the booking route.',
          options: [
            {
              text: 'Remove the ownership check, the overlap constraint and the server-side price one at a time, run the suite after each, and confirm that a named test fails every time; then merge',
              consequence: 'Each removal turns exactly the right test red, so you know the suite protects those rules, and one test that stayed green gets rewritten.',
              quality: 'best',
            },
            {
              text: 'Merge: forty green tests is a good sign, and the tidy change is small',
              consequence: `Several of the tests assert almost nothing, and the "tidy" change quietly dropped a check. Nothing notices until a customer sees another's booking.`,
              quality: 'poor',
            },
            {
              text: 'Ask the agent whether the tests are good and merge if it says yes',
              consequence: 'The agent that wrote the tests says they are fine. Its confidence is not evidence; only a failing test on broken code is.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'What evidence shows a test would catch a real bug?',
            'A test that has never been seen failing has not been shown to work.',
            'Break the protected code on purpose and check that a specific test turns red.',
          ],
          explanation: 'Green only means "nothing it checked was wrong". Breaking the code on purpose proves that the tests can notice, which is the only reason to have them.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-10-q1',
        prompt: 'Which kind of test best proves that two customers cannot both book the same court at 7 PM?',
        choices: [
          'A unit test of a pure function that has no database',
          'An end-to-end test that clicks through every screen in the app',
          'A manual test where one person books and a second person watches',
          'An API test that uses a real test database and sends both requests',
        ],
        answer: 3,
        explanation: 'The rule depends on the route and the database constraint together, so a real API test with a database is the cheapest test that can see it.',
      },
      {
        id: 'build-fullstack-ai-10-q2',
        prompt: 'A test asserts only that expect(res.status).toBeLessThan(500). What is wrong with it?',
        choices: [
          'It passes for a 401 or a 404 as well as for a 200, so it cannot tell correct code from broken code',
          'It runs too slowly, because checking a status code needs the whole database to be reset first',
          'It is too strict, since a good test should accept any response that the server happens to send',
        ],
        answer: 0,
        explanation: 'An assertion that almost any response satisfies cannot fail when the code is wrong. Check the exact status and body from the spec.',
      },
      {
        id: 'build-fullstack-ai-10-q3',
        prompt: "The suite fails because the login rate limit blocked the test's eleventh sign-up. What is the best fix?",
        choices: [
          'Delete the rate limit, because it is getting in the way of the tests',
          'Delete the failing test, since the failure shows that the test itself is badly written',
          'Make the limit a setting, raise it in tests, and add a test that lowers it to prove it works',
          'Run the tests slowly with a pause between sign-ups so the limit never triggers',
        ],
        answer: 2,
        explanation: 'The security control and the test both matter. A configurable limit lets the suite run and still lets one test prove the limit works.',
      },
      {
        id: 'build-fullstack-ai-10-q4',
        prompt: 'You want proof that a test really protects the ownership check. What do you do?',
        choices: [
          'Run the test twice, because a test that passes twice must be correct',
          'Remove or break the ownership check on purpose and confirm that the test fails',
          'Count the lines of code that the test covers and aim for more than eighty percent',
        ],
        answer: 1,
        explanation: 'Coverage only shows that code ran. A test that turns red when the protection is removed has been shown to notice.',
      },
      {
        id: 'build-fullstack-ai-10-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does a green tick on a test mean?',
        choices: [
          'Everything the test checks was true when it ran',
          'The app is perfect and has no bugs of any kind',
          'The AI tool that wrote the test is sure that the app is safe',
        ],
        answer: 0,
        explanation: 'A green test only says that its own checks held. It says nothing about what it did not check, which is why good tests matter.',
      },
      {
        id: 'build-fullstack-ai-10-q6',
        audience: { min: 'advanced' },
        prompt: 'Your API tests pass in CI against Postgres 18 but production runs Postgres 15 and a migration fails there. What practice prevents this?',
        choices: [
          'Run the tests twice so that the second run is more likely to catch the problem',
          'Apply migrations by hand in production, so that any problem is spotted by a person',
          'Skip the database in tests and replace it with a list in memory, to make the suite faster',
          'Run the API tests and migrations against a database of the same major version as production',
        ],
        answer: 3,
        explanation: 'Behaviour and available features differ between major versions, so tests should use the production major version, including when they apply migrations.',
      },
    ],
    task: {
      title: 'Get tests that can fail',
      minutes: 20,
      steps: [
        'Send the tests prompt to your AI tool with your SPEC.md and SECURITY-REVIEW.md, create a separate test database and run the unit and API tests.',
        'List your spec rules next to the test that protects each. Add a test for any rule with none.',
        'Pick three tests (ownership, overlap, price). For each, break the protected code on purpose, run the suite and confirm that the right test goes red, then undo the break.',
        'Run the browser test for the main journey and save the output as TEST-RESULTS.md.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to rewrite the names of your tests as plain sentences a shop owner would understand, and to explain what each green tick promises.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Run the suite in CI against a service container of the production database version, add a mutation-testing run (or a scripted break-it check) for the money, ownership and overlap code, and make security regressions a separate required job.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-11',
    day: 11,
    title: 'Deploy it',
    summary: 'Turn the app that runs on your laptop into one that runs on the internet: one production server, settings from the environment, a health check, a CI gate and a smoke test on the live address.',
    intro: {
      objectives: [
        'List what changes between running on your laptop and running in production',
        'Prepare the app for a host: one server, environment settings, a health check and migrations as a release step',
        'Release in a safe order and prove the live app works with a smoke test',
      ],
      why: 'An app that only works on your laptop earns nothing, and a careless first deploy is how test data, missing settings and half-applied migrations reach real customers. A short, repeatable release routine makes deploying boring, which is the goal.',
    },
    minutes: 30,
    skills: ['ship-operate'],
    body: [
      {
        type: 'paragraph',
        text: 'So far the app has lived on your computer, with a database you created and a front end served by a development tool. **Deploying** means putting it on a computer that is always on, with a database that persists, real settings, a secure address (`https://`) and a way to update it without breaking things. AI tools are good at writing the files that deployment needs and bad at knowing your host, so this lesson is about preparing the app, understanding each file and following a safe order, with the real checks that show it works.',
      },
      { type: 'heading', text: 'What changes in production' },
      {
        type: 'table',
        headers: ['In development', 'In production', 'What the app needs'],
        rows: [
          [
            'Vite serves the web app on one port and proxies /api to the API',
            'There is no Vite; the web app is built into files',
            'The API server also serves the built web files',
          ],
          [
            'Settings come from your shell or a .env file',
            'Settings come from the host',
            'Every setting from environment variables, checked at startup',
          ],
          [
            'The database is on your laptop and you run migrations by hand',
            'The database is a managed service',
            'Migrations as a separate release step',
          ],
          ['You can restart anything whenever you like', 'Customers are using it', 'A health check, graceful shutdown and a rollback plan'],
          [
            'http://localhost is allowed to use "Secure" cookies',
            "The host's proxy handles https and talks plain http to your app",
            'trust proxy, so the app knows the request was https',
          ],
          ['Files in uploads/ stay where they are', "The app's disk is replaced on every deploy", 'Uploads in object storage, not on the disk'],
        ],
        caption: 'Six things that quietly change.',
      },
      {
        type: 'prompt',
        label: 'Prompt: prepare the app for production',
        text: 'Prepare this app for production on a container host. Requirements: in production the Express server serves the built web app from web/dist and falls back to index.html for any non-API path, while unknown /api paths still get the JSON 404; a GET /healthz that checks the database; PORT from the environment; trust proxy set only in production; graceful shutdown on SIGTERM; a multi-stage Dockerfile (build the web app, then a slim runtime image with only production dependencies, running as a non-root user); a GitHub Actions workflow that runs migrations and tests against a Postgres service container and builds the web app; and a scripts/smoke.sh that checks the live address. List anything that will not work on a container host (for example files written to disk).',
      },
      {
        type: 'paragraph',
        text: 'Here is the part of the server the tool wrote for production. Read the comments: each line answers one row of the table above.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/app.js: production behaviour',
        code: `export function createApp() {
  const app = express();
  if (config.production) app.set('trust proxy', 1); // the host's proxy terminates HTTPS in front of us
  app.use(helmet());
  // Only the origins we list may read responses with cookies; everyone else gets no CORS headers.
  app.use(cors({ origin: config.allowedOrigins, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(loadUser);

  // The host calls this to decide whether the app is alive and can reach its database.
  app.get('/healthz', async (_req, res) => {
    try {
      await query('SELECT 1');
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'database_unreachable' });
    }
  });

  app.use('/api/auth', authRouter);
  app.use('/api/courts', courtsRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/admin', adminRouter);

  // In production this one server also serves the built web app (web/dist).
  if (config.production) {
    const webDist = fileURLToPath(new URL('../../web/dist', import.meta.url));
    app.use(express.static(webDist));
    // Express 5 needs a named wildcard. API paths that match nothing must still get the JSON 404.
    app.get('/{*splat}', (req, res, next) => (req.path.startsWith('/api/') ? next() : res.sendFile(\`\${webDist}/index.html\`)));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}`,
      },
      {
        type: 'paragraph',
        text: "The first version of that route for the web app's pages was `app.get('*', ...)`, the way earlier Express versions wrote it. On Express 5 it does not start:",
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real error from the generated code on Express 5',
        code: 'PathError [TypeError]: Missing parameter name at index 1: *; visit https://git.new/pathToRegexpError for info',
      },
      {
        type: 'paragraph',
        text: "Express 5 wants the wildcard to be named, which is why the final code reads `/{*splat}`. It is a good example of why you run what the AI wrote: the tool's habits come from older examples, and a version difference surfaces as an error on the first run, not as a warning in the prompt.",
      },
      { type: 'heading', text: 'Run it as production runs it' },
      {
        type: 'paragraph',
        text: 'Before touching any host, run the real production setup on your own computer: build the web app, start the server with `NODE_ENV=production`, and test the paths. These are real results from the project:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real status codes of the production server',
        code: `/healthz              200 application/json; charset=utf-8
/                     200 text/html; charset=utf-8
/my-bookings          200 text/html; charset=utf-8
/api/courts           200 application/json; charset=utf-8
/api/nope             404 application/json; charset=utf-8
/assets/nothing.js    200 text/html; charset=utf-8`,
      },
      {
        type: 'paragraph',
        text: "Read it as a reviewer. The health check, the home page, a page address (`/my-bookings`, which only exists inside the React app) and the API all behave. The unknown API path gets the JSON 404 we wanted. The last line is a small bug: a missing JavaScript file answers `200` with the home page's HTML, which is how a typo in a file name becomes a blank white page. It is harmless here and worth knowing; a stricter fallback would 404 anything with a file extension. Then the same three browser tests from lesson 10 were run against this production server:",
      },
      {
        type: 'code',
        language: 'text',
        label: 'The browser tests against the production build (real output)',
        code: `  ✓  1 booking.spec.js:29:1 › a customer books, hits a clash, and cancels (939ms)
  ✓  2 booking.spec.js:45:1 › another customer cannot take Ana's hour and never sees her booking (1.0s)
  ✓  3 booking.spec.js:59:1 › the booking page does not scroll sideways on a phone (459ms)

  3 passed (3.9s)`,
      },
      {
        type: 'paragraph',
        text: 'The production cookie is also worth a look. In production the sign-in cookie gains the `Secure` flag, and the security headers from lesson 9 are present (real output):',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real headers from the production server (shortened)',
        code: `Strict-Transport-Security: max-age=31536000; includeSubDomains
Set-Cookie: sid=vzWZgnV7ynK4ORiyewtCfgshTrLeG05oAZtmHf-ie_I; Max-Age=604800; Path=/; Expires=Sat, 21 Nov 2026 07:50:51 GMT; HttpOnly; Secure; SameSite=Lax`,
      },
      { type: 'heading', text: 'Files the host needs' },
      {
        type: 'code',
        language: 'text',
        label: 'Dockerfile (multi-stage: build the web app, then a slim runtime)',
        code: `# Stage 1: build the web app into plain files.
FROM node:22-slim AS web
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Stage 2: the API server, plus the built web app it serves.
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=web /app/web/dist /app/web/dist
USER node
# The host tells us the port through the PORT variable.
CMD ["node", "src/server.js"]`,
      },
      {
        type: 'paragraph',
        text: 'A **container image** is a sealed box holding your app, Node and its libraries, so it runs the same on the host as on your laptop. The first stage builds the web files; the second copies only what production needs, installs only production packages (`--omit=dev`), and runs as the unprivileged `node` user. The host starts it with a `PORT` variable. A CI workflow runs the same checks on every push so nothing reaches the host untested:',
      },
      {
        type: 'code',
        language: 'yaml',
        label: 'CI workflow (.github/workflows/ci.yml, shortened)',
        code: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    env:
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
      TEST_DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: |
            server/package-lock.json
            web/package-lock.json
      - name: Server tests
        working-directory: server
        run: |
          npm ci
          npm run migrate
          npm run seed
          npm test
      - name: Dependency audit (production packages only)
        working-directory: server`,
      },
      {
        type: 'version',
        text: "GitHub's documentation for building and testing Node.js uses actions/checkout@v6 and actions/setup-node@v7 with npm ci and npm test, and its PostgreSQL service container guide shows a postgres service with a pg_isready health check and a ports mapping reached through localhost. Google Cloud's Cloud Run documentation says to deploy an image with `gcloud run deploy SERVICE --image IMAGE_URL`, to set variables with `--set-env-vars`, and to expose Secret Manager secrets as environment variables with `--set-secrets` (pin a version rather than latest); its container contract says Cloud Run injects the PORT variable, that the app must listen on 0.0.0.0, and that it sends SIGTERM and then waits 10 seconds before shutting an instance down. Not run for this course: the Docker build, the workflow on GitHub (its postgres:18 image tag follows the PostgreSQL 18 release described in the PostgreSQL docs but was not pulled) and a real deployment. The workflow's commands were run locally (migrate, test, audit, build), and the production server was run directly with Node.",
        checked: CHECKED,
        sources: [DOCS.ghNode, DOCS.ghPostgres, DOCS.cloudRunDeploy, DOCS.cloudRunSecrets, DOCS.cloudRunContract, DOCS.nodeReleases],
      },
      {
        type: 'warning',
        text: "Two things in this app are deliberately not yet production-grade. Uploaded proof-of-payment files are saved on the server's disk, which a container host throws away on redeploy, so a real deployment moves them to object storage. And the login rate limiter keeps its counts in the server's memory, so with two running instances each counts separately. Put both on your launch checklist.",
      },
      { type: 'heading', text: 'A safe release order' },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A(Push to main) --> B[CI: install, migrate a test database, run tests]
  B --> C{All green?}
  C -->|No| X(Stop: fix it)
  C -->|Yes| D[Build the container image]
  D --> E[Run new migrations on production]
  E --> F[Deploy the new image]
  F --> G[Smoke test the live address]
  G --> H{Smoke test passed?}
  H -->|No| R(Roll back to the last image)
  H -->|Yes| Z(Done)`,
        caption: 'Tests before building, migrations before the new code, a smoke test after, and a way back.',
      },
      {
        type: 'paragraph',
        text: "The order has reasons. Migrations run **before** the new code, so the new code never meets a database that is missing a column; that is only safe if migrations are additive (add columns and tables, do not drop or rename in the same release). If the smoke test fails you **roll back the code** to the previous image, which works precisely because the database was only expanded. The smoke test is a short script that exercises the one flow that earns money on the live address. This is the real output of the project's script run against the production server:",
      },
      {
        type: 'code',
        language: 'text',
        label: 'scripts/smoke.sh (real output)',
        code: `health     : 200
home page  : 200
courts     : listed
sign up    : ok
booking    : created #5
cancel     : ok
SMOKE TEST PASSED`,
      },
      { type: 'visual', id: 'se-ci-cd-pipeline', caption: 'Walk through a build and release pipeline stage by stage.' },
      {
        type: 'paragraph',
        text: 'Deploying is like moving a stall from your kitchen at home into a real shop. At home you can taste, adjust and restart as often as you like. In the shop there are **settings** that belong to the building, not the recipe (the address, the key to the safe: environment variables), an "open" sign that tells the street you are really serving (the health check), and a routine for opening the day (tests, build, deploy, smoke test). If something goes wrong on opening day you put the old menu back, you do not cook live in front of customers (rollback).',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'The files an AI writes for deployment look intimidating. Read each one for its **job**: the `Dockerfile` says "how to pack the app into a box"; the CI file says "every time someone saves work, build it and test it on a clean computer"; `smoke.sh` says "after opening, order one coffee and check it arrives". You do not need to write them. You need to know what each is for and be able to ask the AI, "explain this file line by line and say what happens if it is wrong".',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Give me a deployment checklist for my host with the exact commands, and mark which steps I can undo." Do the undoable steps first.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: `Think of releases as risk management. Use **expand and contract** so any version of the code works with the database before and after a migration; deploy with a rolling or blue-green strategy and let the host's health check gate traffic, and consider a canary for risky changes. Keep infrastructure in code (the container, the workflow, the service definition) and secrets in the platform's secret manager, with separate staging and production credentials and databases, preview environments per pull request, and least-privilege database users (the migration user is not the app's runtime user). Define service-level objectives (availability, latency) before launch so "is it healthy?" has a number, and keep a runbook for rollback, restore and rotating each secret. Check the environment where state lives: with more than one instance, in-memory rate limits, caches and local files stop being correct.`,
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Production differs from development in six ways: how the web files are served, where settings come from, how migrations run, health checks and shutdown, https behind a proxy, and where files live.',
          'Run the real production setup locally first, with real checks: status codes, the browser tests and a smoke test.',
          'Release in a safe order: tests, build, additive migrations, deploy, smoke test, and a rollback that works because migrations were additive.',
          'The deployment files are an AI draft: read what each is for, and treat uploads on disk and in-memory counters as launch-checklist items.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-11-arrange-1',
          kind: 'arrange',
          title: 'Put the release in a safe order',
          prompt: 'Arrange the steps of a release in the order you would run them.',
          concept: 'release order',
          language: 'text',
          solution: [
            'Push the change to the main branch',
            'CI installs, migrates a test database and runs every test',
            'CI builds the container image only if the tests passed',
            'Run the new migrations on the production database',
            'Deploy the new image to the host',
            'Run the smoke test against the live address',
            'Roll back to the previous image if the smoke test fails',
          ],
          reasons: [
            'Everything starts from a change that is pushed.',
            'Nothing should be built or released before the tests pass.',
            'A broken build is wasted work, so build after the tests.',
            'The database must be ready before the new code that needs it arrives.',
            'Only then does the new code start receiving customers.',
            'You check the live address, not your laptop, to know it works.',
            'The way back is the last step, and works because migrations only added things.',
          ],
          hints: [
            'Which step must happen before anything is built?',
            'The new code should never run against a database that is missing something it needs.',
            'The smoke test comes after the deploy, and a rollback only happens if it fails.',
          ],
          explanation: 'Tests gate everything, the database is updated before the code that needs it, and the smoke test on the live address decides whether the release stays. A rollback works because additive migrations leave the old code compatible.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-11-match-1',
          kind: 'match',
          title: 'Where does each thing live?',
          prompt: 'Match each item to the right place in a deployed app.',
          concept: 'settings and storage',
          labels: { terms: 'Item', meanings: 'Where it belongs' },
          pairs: [
            {
              term: 'The database password',
              definition: "The host's secret manager, passed in as an environment variable",
              note: 'It must never be in the code or the git history.',
            },
            {
              term: 'The brand colours of the web pages',
              definition: 'In the code, committed to git',
              note: 'They are not secret and change with a release.',
            },
            {
              term: 'The port the server must listen on',
              definition: 'A PORT environment variable set by the host',
              note: 'The host decides the port, and the app reads it.',
            },
            {
              term: 'Payment screenshots uploaded by customers',
              definition: "Object storage, not the container's own disk",
              note: 'A container disk is replaced on every deploy, which would lose the files.',
            },
          ],
          hints: [
            'Which of these must never be visible in git?',
            'Which one is decided by the host and not by your code?',
            'Files that customers upload must survive a redeploy, so they cannot live on the container disk.',
          ],
          explanation: 'Secrets go in a secret manager, host-decided values in environment variables, ordinary content in the code and persistent files in storage that survives a redeploy.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-11-scenario-1',
          kind: 'scenario',
          title: 'The release broke bookings',
          prompt: 'Choose the response.',
          concept: 'rollback',
          situation: 'You deployed a release that included a migration renaming bookings.total_cents to price_cents. The smoke test fails: creating a booking returns a 500. Customers are trying to book right now. The previous image is still available.',
          options: [
            {
              text: 'Roll the host back to the previous image now, and fix forward later with an expand and contract migration (add price_cents, write both columns, switch, drop later)',
              consequence: 'The old image still reads total_cents, which the rename removed, so rolling the code back alone does not restore bookings. A rollback only helps when the previous code works with the current database, which is exactly why additive migrations matter.',
              quality: 'acceptable',
            },
            {
              text: 'Add the old column name back as a new additive migration (or a view) so the previous image works again, roll back the code, then redo the rename safely over several releases',
              consequence: 'The previous code works again within minutes, customers can book, and the rename is redone with the expand and contract pattern where no single release can break the running version.',
              quality: 'best',
            },
            {
              text: 'Keep the broken release running and tell customers to try again later while you debug in production',
              consequence: 'Every booking attempt fails while you debug, and a rushed hotfix on live data adds new risk on top of the old one.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which version of the code works with the database as it is now?',
            'A rename is not additive, so simply rolling back the code may not be enough.',
            'Restore compatibility first (additively), roll back, then redo the change in safe steps.',
          ],
          explanation: 'A rollback only helps if the previous code still works with the current database. Restoring compatibility with an additive change, then rolling back, ends the outage; the rename is redone with expand and contract so that no one release can break the running version.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-11-q1',
        prompt: 'Why does the production Express server serve the built web files itself, instead of using the Vite dev server?',
        choices: [
          'Vite is not allowed on the internet, so a different web server is needed',
          'In production there is no dev server or proxy, so the API server serves the built files',
          'The browser refuses to load JavaScript from any server that is not written in Node.js',
        ],
        answer: 1,
        explanation: 'The dev server and its /api proxy only exist during development. Production serves the built files, and one server for both keeps cookies and CORS simple.',
      },
      {
        id: 'build-fullstack-ai-11-q2',
        prompt: 'The app crashes at startup on the host with "Missing required environment variables: DATABASE_URL". Is that a bug?',
        choices: [
          'No: failing fast on a missing setting beats running with a wrong or guessed value',
          'Yes: the host should be changed so that the variable is created automatically for every service it runs',
          'Yes: the app should fall back to a default database address so it can always start',
          'No: it only happens in production, so it can be ignored until a customer reports it',
        ],
        answer: 0,
        explanation: 'A clear startup failure is the intended behaviour. A silent default (like a localhost database) can send production traffic to the wrong place.',
      },
      {
        id: 'build-fullstack-ai-11-q3',
        prompt: 'Why do migrations run before the new code is deployed, and why should they be additive?',
        choices: [
          'So that the database can be deleted and rebuilt from scratch with every new release of the code',
          'Because migrations are very fast, and the deploy tool charges for every minute that a release takes',
          'So the new code finds the columns it needs, and the old code keeps working if you must roll back',
        ],
        answer: 2,
        explanation: 'Additive migrations work with both the old and the new code, so the order is safe and rollback stays possible.',
      },
      {
        id: 'build-fullstack-ai-11-q4',
        prompt: "Customers' payment screenshots are saved in uploads/ on the container. After the next deploy they are gone. What is the fix?",
        choices: [
          'Deploy less often, so that fewer files are lost between releases',
          'Store the files in object storage and serve them through an authorised route',
          'Mark the folder as read-only in the Dockerfile so that the host cannot delete it during a deploy',
        ],
        answer: 1,
        explanation: 'A container disk is temporary by design. Persistent object storage survives deploys, and an authorised route keeps the access check.',
      },
      {
        id: 'build-fullstack-ai-11-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a health check?',
        choices: [
          'A list of the customers who have not booked a court in the last month',
          "A doctor's note that the developer has to send to the host before deploying",
          'A page the host can call to ask "are you alive and able to reach your database?"',
        ],
        answer: 2,
        explanation: 'The host calls /healthz regularly. If it fails, the host knows not to send customers to that copy and can restart it.',
      },
      {
        id: 'build-fullstack-ai-11-q6',
        audience: { min: 'advanced' },
        prompt: 'The login rate limiter stores counts in memory, and the host now runs three instances of the app. What happens?',
        choices: [
          'Nothing changes, because the instances share their memory through the load balancer',
          'The host sends all the traffic of one customer to the same instance for ever',
          'The limiter stops working completely, and every request is allowed from then on',
          'Each instance counts separately, so an attacker gets three times as many guesses',
        ],
        answer: 3,
        explanation: 'Per-process state is not shared. Use a shared store (a database or cache) for counters when there is more than one instance.',
      },
    ],
    task: {
      title: 'Run production on your own computer first',
      minutes: 25,
      steps: [
        'Send the production prompt to your AI tool. Build the web app, start the API with NODE_ENV=production and open the home page, a page address and the /healthz address.',
        'Run your browser tests and the smoke test against that production server and save the output in DEPLOY.md.',
        'Write a launch checklist for your chosen host with the exact commands, marking uploads, rate limits and secrets as open items if they are not solved.',
        'If you have a host account, deploy a first version and run the smoke test against the live address.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ["Ask the AI to walk you through the host's screens one step at a time from its official documentation, and tick each step as you finish it."],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a staging environment with its own database and secrets, preview deployments per pull request, a rollback runbook and a test that applies each migration to a copy of production data.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-12',
    day: 12,
    title: 'Monitor, maintain and keep improving it',
    summary: 'Keep a live app healthy: structured logs with a request id, a health check, a backup you have actually restored, dependency updates and a loop that turns feedback into the next spec.',
    intro: {
      objectives: [
        "Add logs that let you find one customer's failed request without logging secrets",
        'Run a backup and restore drill and an automatic dependency check',
        'Turn what you learn from a live app into the next small, specified change',
      ],
      why: 'Launching is the start of the work. Customers will hit problems you never imagined, libraries will publish security fixes, and disks fail. A little monitoring and a rehearsed recovery turn those from emergencies into routine.',
    },
    minutes: 30,
    skills: ['ship-operate'],
    body: [
      {
        type: 'paragraph',
        text: 'The app is live. Now four questions decide whether you sleep well. **Is it up?** **What happened to this customer?** **Can we recover if something is lost?** **Is it still safe next month?** Each has a cheap, standard answer, and an AI tool can set all of them up in an afternoon. As before, your skill is in asking for the right things and checking that they really work, because monitoring that has never been tested is the same as no monitoring.',
      },
      { type: 'heading', text: 'Is it up, and what happened? Health checks and logs' },
      {
        type: 'paragraph',
        text: "You already have the first half: the `/healthz` route from lesson 11 answers `200` when the app can reach its database and `503` when it cannot. Point an **uptime monitor** (the host's own, or a free service) at it and have it message you when it fails. For the second question you need **logs**: a written record of what the server did. The AI's first logging is usually `console.log('booking created')`, which cannot be searched or tied to one customer. Ask for **structured logs**, one JSON object per line, and a **request id** on every request, sent back to the customer in a response header and written in every line about that request.",
      },
      {
        type: 'prompt',
        label: 'Logging prompt',
        text: 'Add structured logging to the API. Requirements: one JSON object per line with time, level, msg and extra fields; a request id (random UUID) created per request, returned in an X-Request-Id header and included in every log line for that request; one log line per finished request with method, path (without the query string), status, duration in ms and the signed-in user id; never log request bodies, query strings, cookies, passwords, tokens or customer emails; a 500 response includes the request id so a customer can quote it; skip the health check in the request log; and shut down cleanly on SIGTERM. Add the logging to the error handler and the email failure path.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/logger.js',
        code: `import { randomUUID } from 'node:crypto';

// One JSON object per line: easy for a log service to search and filter.
export function log(level, msg, fields = {}) {
  if (process.env.NODE_ENV === 'test') return;
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields });
  (level === 'error' ? console.error : console.log)(line);
}

// Gives every request an id, sends it back in a header, and logs one line when the response is done.
// It records the path but never the query string or the body, which can hold passwords and tokens.
export function requestLogger(req, res, next) {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  const started = process.hrtime.bigint();
  // req.path is relative to whichever router is handling the request, so read the full path now.
  const path = req.originalUrl.split('?')[0];
  res.on('finish', () => {
    if (path === '/healthz') return; // the host checks this every few seconds
    log('info', 'request', {
      requestId: req.id,
      method: req.method,
      path,
      status: res.statusCode,
      ms: Math.round(Number(process.hrtime.bigint() - started) / 1e6),
      userId: req.user?.id ?? null,
    });
  });
  next();
}`,
      },
      {
        type: 'paragraph',
        text: "This is the logger as it ended up, and one line of it has a story. The first version of the AI's logger used `req.path` inside the `finish` handler. Running the app and reading the logs showed the problem at once: every request to a router was logged with a path relative to that router.",
      },
      {
        type: 'code',
        language: 'text',
        label: "The first logger's lines (real output): the path is wrong",
        code: `{"time":"2026-11-14T07:52:01.515Z","level":"info","msg":"request","requestId":"62d70aa6-0512-4667-bd90-346b8ae48fcb","method":"POST","path":"/register","status":201,"ms":56,"userId":null}
{"time":"2026-11-14T07:52:01.548Z","level":"info","msg":"request","requestId":"264a64c5-5754-46bb-997e-1bc0fafee399","method":"POST","path":"/","status":201,"ms":22,"userId":1}`,
      },
      {
        type: 'paragraph',
        text: "Inside Express, `req.path` is relative to wherever the request is being handled, so `/api/auth/register` became `/register` and `/api/bookings` became `/`. A log you cannot trust is worse than none. The fix is the line `const path = req.originalUrl.split('?')[0]`, which takes the full path once at the start and drops the query string, so tokens in a URL never reach the log. The lesson: **read your first real log lines**, do not assume the logger works.",
      },
      {
        type: 'paragraph',
        text: 'Now the payoff. A customer sends a message: "I tried to add a note to my booking and it said something went wrong". The error response carries a request id, and one search finds the whole story. In the real project, a booking note containing a hidden NUL character (an invisible character that PostgreSQL text cannot store) produced exactly that:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'What the customer saw (real output)',
        code: '{"error":{"code":"server_error","message":"Something went wrong on our side. Please try again.","requestId":"06ac51a6-48b1-4f42-8364-cbd177f9c8e7"}}',
      },
      {
        type: 'code',
        language: 'text',
        label: 'What the log said when searched for that request id (real output, shortened)',
        code: `{"time":"2026-11-14T07:52:13.766Z","level":"error","msg":"unhandled error","requestId":"06ac51a6-48b1-4f42-8364-cbd177f9c8e7","method":"POST","path":"/api/bookings","error":"invalid byte sequence for encoding \\"UTF8\\": 0x00","code":"22021","stack":"error: invalid byte sequence ...
{"time":"2026-11-14T07:52:13.766Z","level":"info","msg":"request","requestId":"06ac51a6-48b1-4f42-8364-cbd177f9c8e7","method":"POST","path":"/api/bookings","status":500,"ms":5,"userId":1}`,
      },
      {
        type: 'paragraph',
        text: 'The error and the request line share an id, the cause is named (a `0x00` byte that the database refuses), and the route is known. A real bug, found from one log search: the notes field accepted a character the database cannot store. The fix is a rule in the input schema plus a test, exactly the loop from lessons 9 and 10:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The fix (fragment of the schema): refuse the character',
        code: `  // Postgres text cannot hold a NUL character; found in the logs as a 500, now refused as a 400.
  notes: z.string().trim().max(500).refine((text) => !text.includes('\\u0000'), 'Notes contain a character we cannot store').optional(),`,
      },
      {
        type: 'warning',
        text: "What you do not log matters as much as what you do. Never write passwords, session tokens, full card numbers, request bodies or whole query strings to a log: logs are copied to other systems, kept for months and read by more people than the database is. Keep customers' emails out too unless you need them, and set a retention period.",
      },
      { type: 'heading', text: 'Can we recover? A backup you have restored' },
      {
        type: 'paragraph',
        text: "A backup you have never restored is a hope. Managed database hosts usually take backups for you, but the drill is the same on any database: dump it, restore it somewhere else, and check that the data is there. The project's drill, with real output, used PostgreSQL's own tools:",
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Backup, restore into a new database, compare',
        code: `pg_dump -Fc courts -f courts.dump
createdb courts_restore
pg_restore -d courts_restore courts.dump
psql -d courts_restore -c "select count(*) from bookings"`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the drill',
        code: `12484 bytes
courts: 1 users, 2 bookings, 2 courts
courts_restore: 1 users, 2 bookings, 2 courts`,
      },
      {
        type: 'paragraph',
        text: 'Same counts in both databases: the backup works, and the time it took is your idea of how long recovery takes. Write the steps and the time in a RUNBOOK.md, and repeat the drill on a schedule. Two numbers to decide in advance: how much data you can afford to lose (how often to back up) and how long you can be down (how fast you must restore).',
      },
      { type: 'heading', text: 'Is it still safe next month? Dependencies' },
      {
        type: 'paragraph',
        text: "Your app is mostly other people's code, and some of it will have security problems found after you shipped. `npm audit` checks your packages against a database of known problems, and the Express security guide recommends it. The CI workflow from lesson 11 already runs it on production packages; the real output on the project:",
      },
      { type: 'code', language: 'text', label: 'npm audit --omit=dev --audit-level=high (real output)', code: 'found 0 vulnerabilities' },
      {
        type: 'paragraph',
        text: 'Zero today means nothing next month, so automate the nagging: Dependabot opens a pull request when a package has a newer version, and your CI tests decide whether it is safe to merge. The configuration is a short file:',
      },
      {
        type: 'code',
        language: 'yaml',
        label: '.github/dependabot.yml',
        code: `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/server"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/web"
    schedule:
      interval: "weekly"`,
      },
      {
        type: 'paragraph',
        text: "This follows the minimal file in GitHub's documentation, repeated for the two folders that have a `package.json`. Also watch the platform under you: Node.js keeps older lines supported for a limited time, and the release page lists which are in long-term support, so plan a runtime upgrade before yours ends.",
      },
      {
        type: 'version',
        text: "The Express security guide recommends using the current Express version, TLS, Helmet, non-default cookie options, limiting authorisation attempts and checking dependencies with npm audit. GitHub's Dependabot documentation shows a minimal .github/dependabot.yml (version 2, a package-ecosystem, a directory and a schedule interval) that opens pull requests for newer versions. Cloud Run's container contract says an instance receives SIGTERM and then has 10 seconds before shutdown, which is why server.js closes the server and the database pool on SIGTERM. Node's previous-releases page lists v22, v24 and v26 as LTS lines on the date checked. In OWASP Top 10:2025, A03 is Software Supply Chain Failures and A09 is Security Logging & Alerting Failures: this lesson is the practical answer to both.",
        checked: CHECKED,
        sources: [DOCS.expressSecurity, DOCS.dependabot, DOCS.cloudRunContract, DOCS.nodeReleases, DOCS.owaspTop10],
      },
      {
        type: 'table',
        headers: ['Question', 'Answer', 'Evidence it works'],
        rows: [
          ['Is it up?', 'Health check plus an uptime monitor that messages you', 'You stopped the database once and got the message'],
          ['What happened to this customer?', 'Structured logs with a request id shown in 500 responses', 'You found a real failure from an id'],
          ['Can we recover?', 'Backups plus a restore drill and a runbook', 'You restored into another database and compared'],
          ['Is it still safe?', 'npm audit in CI, Dependabot, a runtime upgrade plan', 'A pull request arrived and tests judged it'],
          ['What do we do next?', 'Feedback becomes a small spec with acceptance checks', 'Each change has a prompt log entry and a test'],
        ],
        caption: 'The whole routine on one page.',
      },
      { type: 'heading', text: 'Keep improving without breaking it' },
      {
        type: 'paragraph',
        text: `The same loop that built the app now keeps it alive. A customer's message or a log line becomes a **small spec** (one rule, one acceptance check), then a prompt, then a test, then a deploy, then a smoke test. Keep a CHANGELOG or your prompt log, so you can answer "what changed on Tuesday?" when something breaks. Resist the urge to let an AI tool "improve" the whole app at once: ask for the one change, review the diff, run the tests. Lesson 13 shows how to hand a bigger change to a coding agent safely.`,
      },
      {
        type: 'paragraph',
        text: `Running a shop, you keep a **visitor book** (the logs: who came, when, what happened), you keep the **spare key and a copy of the stock list at your cousin's house** (backups, and you checked once that the key opens the door), and you check regularly whether the shop's equipment has a safety recall (dependency updates). A customer who says "it didn't work" is much easier to help if they can quote a ticket number from their receipt: that is what the request id is.`,
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'A log line is one row in the visitor book, written as a small structured note: `status: 500` means "something failed", `ms: 25` means "it took 25 thousandths of a second", and `requestId` is the ticket number that ties all the rows of one visit together. `npm audit` is the recall check: it compares the list of libraries you use against a list of known problems. None of this needs you to write code; it needs you to ask for it and to look at the first real output.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Ask the AI: "Write me a one-page runbook: if the site is down, if a customer reports an error, and if I need to restore a backup. Use my real commands." Then follow it once, as a drill.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'Move from logs to **observability**: metrics for the golden signals (latency, traffic, errors, saturation), traces that follow a request across services, and alerts on symptoms customers feel (error rate, slow bookings) rather than on every exception. Define service-level objectives and an error budget, so risky releases slow down when reliability is slipping. Treat alert fatigue as a defect: every alert must be actionable and have a runbook. Decide retention and access for logs as personal-data questions, put a recovery time and a recovery point objective on the database and test restores on a schedule, including point-in-time recovery if the host offers it. For supply chain, commit lockfiles, review dependency pull requests rather than merging them blindly, pin the runtime and base image versions, and generate a software bill of materials if customers ask for one. After any incident, hold a blameless review that ends in a test, a monitor or a runbook change.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Monitor four things: is it up (health check and an uptime alert), what happened (structured logs with a request id), can we recover (a restore drill) and is it still safe (dependency checks).',
          'Read your first real log lines: the logger can be wrong, and a trusted log that lies is worse than none.',
          'Never log secrets, bodies or whole URLs; give customers a request id they can quote.',
          'Improve in small specified steps: feedback becomes a spec, a prompt, a test and a deploy with a smoke test.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-12-predict-1',
          kind: 'predict-output',
          title: 'Read the log',
          prompt: 'These are four lines of the server log. What does this code print?',
          concept: 'reading structured logs',
          language: 'javascript',
          code: `const lines = [
  '{"level":"info","msg":"request","status":201,"ms":25}',
  '{"level":"info","msg":"request","status":409,"ms":3}',
  '{"level":"error","msg":"unhandled error","status":500,"ms":5}',
  '{"level":"info","msg":"request","status":201,"ms":31}',
];
const entries = lines.map((line) => JSON.parse(line));
const failures = entries.filter((e) => e.status >= 500);
const slowest = Math.max(...entries.map((e) => e.ms));
console.log(failures.length, slowest);
console.log(entries.filter((e) => e.status === 201).length);`,
          choices: ['1 31\n2', '2 31\n2', '1 25\n2', '1 31\n1'],
          wrongNotes: {
            '2 31\n2': 'Only one line has a status of 500 or more: the 409 is a client conflict, not a server failure.',
            '1 25\n2': 'The slowest request is the largest ms value, which is 31, not the first one.',
            '1 31\n1': 'Two lines have status 201, so the second line printed is 2.',
          },
          hints: [
            'Which statuses count as failures in the filter?',
            'Math.max over all four ms values gives the slowest request.',
            'One status is 500 or more, the largest ms is 31, and two requests had status 201.',
          ],
          explanation: 'Because every log line is a JSON object, ordinary code can count and search them. Here one request failed (500), the slowest took 31 ms, and two bookings were created (201).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-12-match-1',
          kind: 'match',
          title: 'Which tool answers the question?',
          prompt: 'Match each situation to what you would reach for first.',
          concept: 'monitoring routine',
          labels: { terms: 'Situation', meanings: 'First thing to use' },
          pairs: [
            {
              term: 'A customer writes: "my booking failed at 3 PM" and quotes a request id',
              definition: 'Search the logs for that request id',
              note: 'The id ties together every line about that request, including the error.',
            },
            {
              term: 'The host reports that the app is not answering its health check',
              definition: 'The health check and its uptime alert',
              note: 'The check tells you whether the app or its database is the problem.',
            },
            {
              term: 'The database disk is lost',
              definition: 'The runbook and the latest tested backup',
              note: 'Only a restored backup, practised in advance, gets the data back quickly.',
            },
            {
              term: 'A library you depend on has a newly published security problem',
              definition: 'npm audit and a Dependabot pull request',
              note: 'Dependency checks tell you which package and which version fixes it.',
            },
          ],
          hints: [
            'Which situation is about one customer, and which is about the whole app?',
            'Lost data is solved by a backup, not by logs.',
            'A known problem in a library is what the dependency tools are for.',
          ],
          explanation: 'Logs explain one request, the health check says whether the app is alive, backups restore lost data and dependency tools handle known vulnerabilities. Knowing which to open first saves the most time.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-12-scenario-1',
          kind: 'scenario',
          title: 'A customer says it failed',
          prompt: 'Choose how you handle the report.',
          concept: 'incident handling',
          situation: 'A customer messages: "Booking failed, I saw something went wrong." Their screenshot shows the message and a request id. You have structured logs, a test suite and a deploy pipeline.',
          options: [
            {
              text: 'Search the logs for the request id, read the error and the route, reproduce it in a failing test, fix it, deploy, and reply to the customer once the smoke test passes',
              consequence: 'You find a hidden character the database refuses, the test prevents a repeat, and the customer gets an accurate answer instead of a guess.',
              quality: 'best',
            },
            {
              text: 'Reply "please try again" and ask the AI to guess what might be wrong with the booking code',
              consequence: 'The tool changes the wrong thing, the real cause stays, and the next customer sees the same error.',
              quality: 'poor',
            },
            {
              text: 'Fix the bug directly on the live server without a test, since it is urgent and the fix is one line',
              consequence: 'It might work, but the change skips the tests and the smoke test, and nothing stops the bug from returning next month.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'What does the request id let you find?',
            'A failing test turns a one-off fix into a permanent protection.',
            'Search the logs, reproduce with a test, fix, deploy and verify.',
          ],
          explanation: 'The request id turns a vague report into an exact error. Reproducing it as a test, then fixing through the normal pipeline, solves the problem once and keeps it solved.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-12-q1',
        prompt: 'Why does the logger write the request path without the query string?',
        choices: [
          'A query string can carry tokens or personal details, and logs are copied and kept for a long time',
          'Query strings are too long to fit inside a single line of a log file',
          'Express removes query strings automatically, so the logger would otherwise print an empty value',
        ],
        answer: 0,
        explanation: 'Secrets and personal data sometimes travel in URLs. Not logging them keeps them out of every system that stores logs.',
      },
      {
        id: 'build-fullstack-ai-12-q2',
        prompt: 'What is the benefit of putting a request id in the 500 response and in every log line?',
        choices: [
          'It stops the same customer from making a second request until the first has finished',
          'It makes the server answer faster, because the id works as a cache key for the response',
          'It encrypts the error message, so that the customer cannot read the technical details',
          'A customer can quote the id, and you can find that exact request and its error in seconds',
        ],
        answer: 3,
        explanation: "The id links the customer's report to the log lines. Without it you are searching by time and guesswork.",
      },
      {
        id: 'build-fullstack-ai-12-q3',
        prompt: 'You took a database backup last week and have never restored it. How much should you trust it?',
        choices: [
          'Not yet: restore it into another database, compare the data and time it',
          'Fully: backups are made by the database itself, and they cannot fail in any way',
          'Fully: the dump command printed no error, so the file must be a good backup',
        ],
        answer: 0,
        explanation: 'A backup is only proven by a restore. The drill also tells you how long recovery takes.',
      },
      {
        id: 'build-fullstack-ai-12-q4',
        prompt: 'npm audit reports no known vulnerabilities today. Why still set up Dependabot?',
        choices: [
          'Because Dependabot replaces the need to run any tests on the project',
          'Because npm audit only works on the first day of a project, and stops afterwards',
          'Because Dependabot installs updates directly on the live server whenever it likes',
          'New problems are found in existing packages all the time, and updates can be tested',
        ],
        answer: 3,
        explanation: 'A clean audit is a snapshot. Dependabot keeps proposing updates as new issues appear, and CI decides whether each is safe to merge.',
      },
      {
        id: 'build-fullstack-ai-12-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a log?',
        choices: [
          'A list of the customers of the court, with the courts they have booked',
          'A chart that shows how many people visited the website last week',
          'A written record of what the server did, to read when something goes wrong',
        ],
        answer: 2,
        explanation: "Logs are the server's notebook: one line for each thing that happened, which you read when you need to know why something failed.",
      },
      {
        id: 'build-fullstack-ai-12-q6',
        audience: { min: 'advanced' },
        prompt: 'An alert fires every time a customer gets a 409 "slot taken" answer, and the team has started ignoring alerts. What is the best change?',
        choices: [
          'Send the alerts to more people so that someone will always see them',
          'Alert on symptoms customers feel, like the 5xx rate and slow bookings',
          'Raise the threshold until the alert fires only once a day, whatever has happened',
          'Turn alerts off during working hours, since the team is awake and can see the logs',
        ],
        answer: 1,
        explanation: 'Alerts must be actionable. A conflict is normal behaviour, while a rising 5xx rate or slow responses mean customers are hurting.',
      },
    ],
    task: {
      title: 'Add the monitoring routine to your app',
      minutes: 25,
      steps: [
        'Send the logging prompt to your AI tool. Make three requests (one good, one bad, one that fails) and read the first real log lines. Fix anything that looks wrong.',
        'Cause a 500 on purpose in a safe test copy, note the request id the response shows, and find that request in the log.',
        'Take a backup, restore it into a second database, compare counts and write the commands and the time taken in RUNBOOK.md.',
        'Add npm audit to CI and a dependabot.yml for each package folder.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the AI to explain one log line of your app word by word, then to write a three-sentence guide for a shop owner on what to do if a customer reports an error.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Define an availability and a latency objective for the booking route, add an alert on the symptom (5xx rate, slow bookings) with a runbook link, and schedule a monthly restore test.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-13',
    day: 13,
    title: 'Work with a coding agent on a bigger feature',
    summary: 'Hand a coding agent a real feature, a waitlist, with a spec, an instructions file, a plan, tests first and small steps, then review its diff like a strict colleague.',
    intro: {
      objectives: [
        'Explain how a coding agent differs from a chat assistant and what it needs from you',
        'Brief an agent with a feature spec, an instructions file and a plan to approve before any code',
        "Review an agent's diff and tests for the mistakes agents typically make",
      ],
      why: 'Agents can build in an hour what takes a day by hand, and they can also quietly rewrite the wrong thing at the same speed. The people who get good results are the ones who brief precisely, work in small verified steps and review the diff, which are skills you now have.',
    },
    minutes: 30,
    skills: ['agent-feature'],
    body: [
      {
        type: 'paragraph',
        text: 'Until now you mostly worked with a tool one step at a time. A **coding agent** works in a loop: it reads your files, makes a plan, edits several files, runs commands such as your tests, reads the results and tries again. That makes it fast, and it makes the quality of your briefing and your review matter much more. This lesson walks through a real feature, a **waitlist** for the booking app, from spec to merged change, and shows the checks that keep an agent on a short leash.',
      },
      { type: 'heading', text: 'What an agent can do, and what it needs' },
      {
        type: 'paragraph',
        text: "Agents differ in detail but share a core. Cursor's documentation describes its Agent as able to edit files, search the project, run terminal commands and watch their output, with checkpoints that can restore your files (stored separately from Git, so you still commit). Claude Code's best-practice guide says its most valuable single habit is to give the agent a way to check its own work, such as tests, so that it can see its mistakes instead of guessing. Both read **instructions files** in your repository before they start: Claude Code reads `CLAUDE.md` (and can use a repository's `AGENTS.md`), and Codex reads `AGENTS.md` from the project root down to the folder you are working in, with the nearest file taking precedence. So the agent starts every session knowing your commands and rules, without you retyping them.",
      },
      {
        type: 'version',
        text: "Claude Code's memory documentation says a project's CLAUDE.md (in ./CLAUDE.md or ./.claude/CLAUDE.md) is loaded into every session, recommends keeping each file under about 200 lines and being specific, and says instructions are context, not enforced configuration: to block an action regardless, use a hook. Its best-practices page recommends giving the agent a way to verify its work. Codex's AGENTS.md guide says Codex reads AGENTS.md files before doing any work, from a global layer and from the project root down to the current directory, with files nearer to the working directory taking precedence. Cursor's Agent documentation lists editing, searching, terminal commands and checkpoints stored separately from Git. Products and file names change often: re-check before relying on them.",
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.ccMemory, DOCS.codexAgents, DOCS.cursorAgent],
      },
      {
        type: 'paragraph',
        text: 'Here is the instructions file for the booking project. Notice that it holds exactly what a new colleague would ask on day one: how to run things, which rules never bend, and what not to touch. Most of its lines are the lessons of this course turned into standing orders.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'AGENTS.md (or CLAUDE.md): standing instructions',
        code: `# Project instructions (AGENTS.md or CLAUDE.md)

## What this is
Sampaguita Court: court booking. React + Vite in web/, Express 5 API in server/, PostgreSQL. SPEC.md is the source of truth for rules.

## Commands
- API tests: cd server && npm test (needs TEST_DATABASE_URL; never point it at a real database)
- Migrations: cd server && npm run migrate
- Browser tests: cd e2e && npx playwright test
- Smoke test: scripts/smoke.sh <base url>

## Rules for every change
- Work in small steps. After each step run the API tests and say what passed.
- Write the failing test first, show it failing, then write the code.
- Every route that takes an id or reads user data uses loadBooking-style ownership checks. Deny by default.
- SQL uses placeholders only. Request bodies go through a strict zod schema.
- Migrations are new numbered files and additive. Never edit one that exists.
- No new dependencies without asking. No secrets in code; settings come from src/config.js.
- Never change files outside the ones named in the task. Never touch .env files.
- Errors use AppError and the one error shape. Do not log bodies, tokens or emails.`,
      },
      {
        type: 'paragraph',
        text: 'Keep the file short and specific. A vague line ("write good code") changes nothing; a checkable line ("SQL uses placeholders only") changes every change. And remember it is advice the agent is likely to follow, not a lock. The rules that must never be broken, such as touching production credentials, should also be enforced by permissions or hooks.',
      },
      { type: 'heading', text: 'The workflow: spec, plan, tests first, small steps' },
      {
        type: 'paragraph',
        text: 'A bigger feature needs the same discipline as the whole app, in miniature. First write a **feature spec** with rules, non-goals and acceptance checks. Then ask for a **plan before any code** and read it. Then have the agent write the **tests first** and show them failing. Only then does it write code, in small steps, running the tests after each. This order is not ceremony: a plan you approve catches a wrong design for free, and a test that fails first proves it can fail.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'FEATURE-WAITLIST.md',
        code: `# Feature: waitlist

A customer who finds a time taken can join a waitlist for that exact court and time.
When the booking that blocks it is cancelled, the customer who has waited longest is emailed once.

## Rules
1. You can only join the waitlist for a time that is actually taken (otherwise: book it).
2. You cannot join the same waitlist entry twice.
3. When a booking is cancelled, only entries that overlap it and are now completely free are considered.
4. The person who joined first is told. Exactly one person, exactly once.
5. We only tell them. We never book on their behalf.
6. A customer can leave their own entry and nobody else's.
7. A failing email must never make a cancellation fail.

## Not in this feature
Automatic booking, a waitlist screen in the web app, SMS, expiring a notification.

## Acceptance checks
- Ana books Court A 6 to 7 PM. Ben and then Cara join the waitlist for it. Ana cancels. Only Ben is emailed.
- Cara tries to delete Ben's waitlist entry: 404.
- Ben tries to join the waitlist for a free time: 409 "that time is free: book it".`,
      },
      {
        type: 'prompt',
        label: 'Brief for the agent: plan only',
        text: 'Read AGENTS.md and FEATURE-WAITLIST.md. Do not write any code yet. Propose a plan: the new migration (additive), the new routes with who may call them and their statuses, where the cancellation hook goes, the pure function you will extract so it is easy to test, the list of tests you will write first, and any rule in the spec you think is ambiguous or missing. List every existing file you expect to change; I will refuse a plan that touches more than the booking routes and the app file.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Write the feature spec] --> B[Agent proposes a plan]
  B --> C{You approve the plan?}
  C -->|No| B
  C -->|Yes| D[Agent writes tests first]
  D --> E[Run: tests must fail]
  E --> F[Agent implements one small step]
  F --> G[Run all tests]
  G --> H{Green?}
  H -->|No| F
  H -->|Yes| I[You review the diff]
  I --> J(Commit and run the release routine)`,
        caption: 'The agent loop with your three checkpoints: approve the plan, see the tests fail, review the diff.',
      },
      {
        type: 'paragraph',
        text: 'Here is the real result of the first checkpoint on the waitlist. The agent wrote its tests before any implementation, and the first run had to be red:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Tests first: the first run fails (real output)',
        code: ` ❯ tests/waitlist.test.js (0 test)
 FAIL  tests/waitlist.test.js [ tests/waitlist.test.js ]
Error: Cannot find module '/src/waitlist.js' imported from .../server/tests/waitlist.test.js

 Test Files  1 failed (1)
      Tests  no tests`,
      },
      {
        type: 'paragraph',
        text: 'Red for the right reason: the code does not exist yet. The agent then wrote a first implementation, and the tests found a mistake that a human reviewer could have missed:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'First implementation (real output)',
        code: ` ❯ tests/waitlist.test.js (6 tests | 3 failed) 395ms
   ❯ nextInLine (pure) (3)
     × the longest-waiting entry goes first 26ms
   ❯ waitlist API (3)
     × when a booking is cancelled, the person who waited longest is emailed, once 147ms

AssertionError: expected 3 to be 2 // Object.is equality`,
      },
      {
        type: 'paragraph',
        text: 'The sort put the **newest** entry first, so the wrong customer would have been told. One character (`b.createdAt - a.createdAt` instead of `a.createdAt - b.createdAt`) and a rule from the spec ("the person who joined first is told") disagreed, and the test, written from the spec, noticed. After the fix the whole suite passed (real output):',
      },
      {
        type: 'code',
        language: 'text',
        label: 'After the fix (real output)',
        code: ` Test Files  4 passed (4)
      Tests  27 passed (27)`,
      },
      { type: 'heading', text: 'Review the diff like a strict colleague' },
      {
        type: 'code',
        language: 'text',
        label: 'The size of the change (real git output)',
        code: ` server/db/002_waitlist.sql    | 11 +++++++
 server/src/app.js             |  2 ++
 server/src/routes/bookings.js |  3 ++
 server/src/waitlist.js        | 68 +++++++++++++++++++++++++++++++++++++++
 server/tests/waitlist.test.js | 74 +++++++++++++++++++++++++++++++++++++++++++
 5 files changed, 158 insertions(+)`,
      },
      {
        type: 'paragraph',
        text: 'The first review is the size and the file list: five files, only additions, nothing outside the plan, no new dependency in `package.json`, and a new numbered migration rather than an edit. Then read the code with the checklist in the table. Here are the pieces of the real implementation that matter most:',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'server/src/waitlist.js (fragment: the pure function, the leave route and the cancel hook)',
        code: `// Who should hear about a freed slot? Pure, so it is easy to test.
// \`entries\` have a createdAt number; \`isFree(entry)\` says whether that entry's whole slot is open now.
export function nextInLine(entries, isFree) {
  const waiting = entries.filter(isFree).sort((a, b) => a.createdAt - b.createdAt);
  return waiting[0] ?? null;
}

// ... the join route is not shown ...

waitlistRouter.delete('/:id', async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  const { rowCount } = await query('DELETE FROM waitlist WHERE id = $1 AND user_id = $2', [id.success ? id.data : 0, req.user.id]);
  if (rowCount === 0) throw new AppError(404, 'not_found', 'Waitlist entry not found');
  res.status(204).end();
});

// Called after a booking is cancelled. Tells the first person in line; never books for them.
export async function notifyWaitlist(booking, requestId) {
  const { rows } = await query(
    \`SELECT w.id, extract(epoch FROM w.created_at) AS "createdAt", u.email, w.court_id AS "courtId", w.starts_at AS "startsAt",
            NOT EXISTS (SELECT 1 FROM bookings b WHERE b.court_id = w.court_id AND b.status = 'confirmed'
                        AND tstzrange(b.starts_at, b.ends_at) && tstzrange(w.starts_at, w.ends_at)) AS free
       FROM waitlist w JOIN users u ON u.id = w.user_id
      WHERE w.notified_at IS NULL AND w.court_id = $1 AND tstzrange(w.starts_at, w.ends_at) && tstzrange($2, $3)\`,
    [booking.courtId, booking.startsAt, booking.endsAt],
  );
  const next = nextInLine(rows, (entry) => entry.free);
  if (!next) return;
  await sendEmail({ to: next.email, subject: 'A court time opened up', text: \`Court \${next.courtId} at \${new Date(next.startsAt).toISOString()} is free. Book it before someone else does.\` });
  await query('UPDATE waitlist SET notified_at = now() WHERE id = $1', [next.id]);
  log('info', 'waitlist notified', { requestId, waitlistId: next.id });
}`,
      },
      {
        type: 'table',
        headers: ["Review question for an agent's diff", 'In the waitlist'],
        rows: [
          ['Did it stay inside the plan and the file list?', 'Five files, as planned; no dependencies added'],
          [
            'Is every new route protected and scoped to the user?',
            'requireLogin on the router; delete uses user_id = $2, so another customer gets 404',
          ],
          ['Is input validated and SQL parameterised?', 'The join body goes through the strict booking schema; all queries use placeholders'],
          ['Is the migration additive and new?', '002_waitlist.sql adds a table; 001 is untouched'],
          ['Does a failure in the extra work break the main work?', 'The cancel route catches notification errors, logs them and still answers 204'],
          ['Does it do exactly what the spec says, and no more?', 'It emails one person and never books; no automatic booking was added'],
          [
            'What does it NOT handle?',
            'If the notified customer never books, nobody else is told. The spec said "not in this feature"; write it down as the next spec',
          ],
        ],
        caption: 'A review checklist for agent diffs, applied to the waitlist.',
      },
      {
        type: 'paragraph',
        text: 'The last row is worth pausing on. A good review also asks what the feature leaves undone. Here, an entry is notified once and then stays notified: if Ben ignores the email, Cara never hears. That is a product decision, not a coding mistake, so it goes into the next feature spec instead of being quietly "fixed" by the agent.',
      },
      {
        type: 'warning',
        text: "Give an agent the same care you would give a very fast new hire with your laptop. Work on a branch or a separate working copy and commit before each step, read each command it asks to run, never give it production credentials or a database password, and stop it if it starts touching files you did not name. If a run goes wrong, restore from your last commit (or the tool's checkpoint) rather than asking it to undo its own mess.",
      },
      {
        type: 'paragraph',
        text: 'Think of an agent as a **very fast builder you have never met**, working in your kitchen. You would not say "redo the kitchen" and leave. You hand over a drawing (the spec), ask them to show you their plan, agree which walls they may touch, have them test the gas before they connect the cooker, and check each stage before the next. Fast is wonderful as long as each stage is small enough for you to look at.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'To read a diff without being a programmer: lines starting with `+` were added and lines starting with `-` were removed. Count the files: a small feature that touches thirty files is a warning sign. Look at the names: do they match the plan? Run the tests and read the names of the new ones as sentences. Then ask the agent: "Explain this change in five plain sentences and tell me the riskiest line." Its answer is a map; your own look at that line is the check.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Say it out loud in your prompt: "Do not change any file I have not named." That one sentence prevents most surprises.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: `At team scale, treat agent work as you treat any contributor's: it arrives as a pull request from a branch or an isolated worktree, passes the same required checks (tests, lint, type check, dependency and secret scans, the authorisation matrix), and gets a human review of the tests first, because they are the specification the next session will trust. Keep instruction files small and layered (root plus per-package) and use hooks or permission rules for anything that must not happen, since instructions are advisory. Manage context deliberately: one feature per session, the spec and the plan as files in the repository, and a fresh session for the review so the reviewer does not share the author's assumptions. Parallel agents on separate worktrees need a clear ownership of files and a merge order, and each task should carry its acceptance tests so "done" is checkable. Measure the effect honestly (lead time, escaped defects, review load) before scaling it.`,
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'A coding agent reads, edits and runs commands in a loop, so a precise brief and a way to check its work (tests) matter more than clever prompts.',
          'Keep an instructions file (AGENTS.md or CLAUDE.md) short and specific: commands, standing rules and what not to touch. It is advice, so enforce hard limits with permissions or hooks.',
          'Work in order: feature spec, plan you approve, tests that fail first, small steps, then review the diff.',
          'Review the diff for scope, access control, validation, migrations, failure handling and what the feature leaves undone; write the gaps as the next spec.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-13-arrange-1',
          kind: 'arrange',
          title: 'The agent workflow in order',
          prompt: 'Arrange the steps of working with an agent on a bigger feature.',
          concept: 'agent workflow',
          language: 'text',
          solution: [
            'Write the feature spec with rules, non-goals and acceptance checks',
            'Ask the agent for a plan and no code, then approve or correct it',
            'The agent writes the tests first and you see them fail',
            'The agent implements one small step and runs the tests',
            'You review the diff against the plan and the checklist',
            'Run the whole suite, commit, and use the normal release routine',
          ],
          reasons: [
            'Everything starts from a written description of what is wanted.',
            'A wrong design is cheapest to fix before any code exists.',
            'A test that has been seen failing is proven to be able to fail.',
            'Small steps keep each change small enough to check.',
            'The human review is the check the agent cannot do for itself.',
            'Only a reviewed, passing change goes through the release routine.',
          ],
          hints: [
            'What must exist before an agent can make a plan?',
            'The tests come before the code, and you should see them fail.',
            'Your review comes after the implementation and before the release.',
          ],
          explanation: 'Spec, plan, tests first, small steps, review, release: each stage gives a cheap place to catch a mistake before it becomes an expensive one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-13-fix-bug-1',
          kind: 'fix-bug',
          title: 'The wrong customer is told',
          prompt: 'The waitlist should tell the customer who has waited longest, which means the smallest createdAt number. This function picks the newest instead. Fix the line.',
          concept: 'reviewing agent code',
          language: 'javascript',
          code: `function pickNext(entries, freeIds) {
  const waiting = entries
    .filter((entry) => freeIds.includes(entry.id))
    .sort((a, b) => b.createdAt - a.createdAt);
  return waiting[0] ?? null;
}`,
          bugLine: 4,
          fixes: [
            {
              line: '    .sort((a, b) => a.createdAt - b.createdAt);',
              correct: true,
              why: 'Sorting by createdAt ascending puts the oldest (longest waiting) entry first.',
            },
            {
              line: '    .sort((a, b) => b.createdAt - a.createdAt)[1];',
              correct: false,
              why: 'Taking the second newest is not the longest waiting, and with one entry it would be undefined.',
            },
            {
              line: '    .sort((a, b) => a.id - b.id);',
              correct: false,
              why: 'Ids may follow the order of joining, but the rule is about createdAt, and the ids here are not in that order.',
            },
            {
              line: '    .reverse();',
              correct: false,
              why: 'Reversing the filtered list keeps whatever order it had, which is not sorted by waiting time.',
            },
          ],
          tests: {
            kind: 'function',
            fn: 'pickNext',
            cases: [
              {
                label: 'the longest waiting entry goes first',
                args: [[{ id: 1, createdAt: 100 }, { id: 2, createdAt: 50 }, { id: 3, createdAt: 200 }], [1, 2, 3]],
                expected: { id: 2, createdAt: 50 },
              },
              {
                label: 'entries that are not free are skipped',
                args: [[{ id: 1, createdAt: 100 }, { id: 2, createdAt: 50 }, { id: 3, createdAt: 200 }], [1, 3]],
                expected: { id: 1, createdAt: 100 },
              },
              { label: 'nobody fits', args: [[{ id: 1, createdAt: 100 }], []], expected: null },
            ],
          },
          hints: [
            'Which createdAt number belongs to the person who waited longest: the smallest or the largest?',
            'Sorting with a - b puts the smallest first; b - a puts the largest first.',
            'Use .sort((a, b) => a.createdAt - b.createdAt).',
          ],
          explanation: `The agent's first attempt sorted the other way round, a classic slip. A test written from the spec ("the person who joined first is told") caught it, which is why the tests come first.`,
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-13-scenario-1',
          kind: 'scenario',
          title: 'The agent wants to do more',
          prompt: 'Choose how you respond.',
          concept: 'keeping an agent in scope',
          situation: 'Midway through the waitlist, the agent writes: "While I was here I also rewrote the booking routes to use a new ORM, upgraded three dependencies and added automatic booking for the first person on the waitlist." The tests pass.',
          options: [
            {
              text: 'Discard that work, restore from the last commit, and re-brief: only the files in the plan, no new dependencies, no automatic booking; the extras become separate specs if wanted',
              consequence: 'You keep a small, reviewable change that matches the spec, and the good ideas go into their own specs with their own tests.',
              quality: 'best',
            },
            {
              text: 'Accept it, because the tests pass and the agent has already done the work',
              consequence: 'You now own a new ORM, three upgrades and a feature the spec ruled out, all in one diff nobody can review. A bug in any of them is hard to find.',
              quality: 'poor',
            },
            {
              text: 'Keep the dependency upgrades because they are probably good, and discard the rest',
              consequence: 'Less risk than keeping everything, but you still merge changes nobody planned, and the upgrades may break something the tests do not cover.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'What did the plan and the spec say about scope?',
            'Passing tests do not prove that unplanned changes are safe.',
            'Restore the last commit and tell the agent to stay inside the plan.',
          ],
          explanation: 'Scope is a safety property. Unplanned changes cannot be reviewed against the spec, so they are discarded and, if wanted, specified and tested on their own.',
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-13-q1',
        prompt: 'Why ask a coding agent for a plan and no code before it starts?',
        choices: [
          'Agents cannot write code until a plan has been written, because they use the plan as a compiler',
          'A wrong design is cheap to fix in a plan and costly once built into many files',
          'The plan is the only thing an agent is able to remember between one session and the next',
        ],
        answer: 1,
        explanation: 'Reviewing a plan takes a minute; reviewing a wrong implementation takes much longer. Approving the plan is your first checkpoint.',
      },
      {
        id: 'build-fullstack-ai-13-q2',
        prompt: "The agent's new tests all pass the first time they run, before any code is written. What does that tell you?",
        choices: [
          'The tests cannot fail, so they prove nothing: tests written first should fail first',
          'The agent is very good, so you can skip the review',
          'The feature must already exist, so the work is done',
          'The test database is empty, which is the normal state before any feature is written',
        ],
        answer: 0,
        explanation: 'A test that passes with no implementation is not testing the feature. Seeing red first is how you know a test can detect the missing behaviour.',
      },
      {
        id: 'build-fullstack-ai-13-q3',
        prompt: 'Your AGENTS.md says "never touch .env files". Is that enough to guarantee the agent will not?',
        choices: [
          'Yes: an instruction file is a lock, and the agent is forced to obey every line in it',
          'Yes, as long as the file is under 200 lines, because short files are always enforced by the tool',
          'No: instructions are context the agent usually follows, so back a hard rule with permissions or a hook',
        ],
        answer: 2,
        explanation: "Claude Code's documentation says instructions are context, not enforced configuration, and recommends a hook to block an action regardless of what the model decides.",
      },
      {
        id: 'build-fullstack-ai-13-q4',
        prompt: "The agent's diff touches 31 files for a feature that was planned to touch five. What do you do first?",
        choices: [
          'Run the tests, and merge if they are green',
          'Read only the five planned files, since the others are probably generated',
          'Ask the agent to add more tests so the large change is covered by the suite',
          'Stop, compare the file list with the plan, and send the agent back to stay in scope',
        ],
        answer: 3,
        explanation: 'A diff far larger than the plan means scope drift. Green tests cannot prove that unplanned changes are intended or safe.',
      },
      {
        id: 'build-fullstack-ai-13-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does a "+" line mean when you read a diff?',
        choices: ['A line that was removed by the change', 'A line that has a mistake in it', 'A line that was added by the change'],
        answer: 2,
        explanation: 'In a diff, + marks added lines and - marks removed ones. Reading them tells you exactly what the change did.',
      },
      {
        id: 'build-fullstack-ai-13-q6',
        audience: { min: 'advanced' },
        prompt: 'Three agents work in parallel on separate features of the same repository. Which practice keeps merging safe?',
        choices: [
          'Give each its own branch or worktree, name its files and merge in a decided order',
          "Let all three edit the same working folder at the same time so they can see each other's changes",
          'Ask the three agents to agree among themselves which one is allowed to merge first',
          'Skip the review on the second and third, since the first review proved that the approach is right',
        ],
        answer: 0,
        explanation: 'Isolation, clear file ownership, identical required checks and an explicit merge order turn parallel work into ordinary reviewable pull requests.',
      },
    ],
    task: {
      title: 'Build one small feature with an agent, by the book',
      minutes: 25,
      steps: [
        'Write an AGENTS.md or CLAUDE.md for your project (commands, standing rules, what not to touch) and a one-page feature spec for something small, such as a waitlist or a cancellation deadline.',
        'Ask the agent for a plan and no code. Correct the plan, then ask for tests first and run them to see them fail.',
        'Let the agent implement in small steps, running the tests each time. Then review the diff with the checklist from this lesson and write down anything it left undone.',
        'Commit the feature, run your release routine and add the prompts and the review notes to your PROMPTS.md.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Ask the agent: "Explain this change in five plain sentences, list every file you changed and name the riskiest line." Check the file list against your plan.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Run the agent in a separate worktree, add a hook or permission rule that blocks edits to .env and migration files that already exist, and require the authorisation matrix test in CI before its pull request can merge.',
        ],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-14',
    day: 14,
    title: 'Project: a booking application, live',
    summary: 'Bring everything together: a deployed booking app with its spec, prompt log, test results and security review, and the routine you will reuse on your next project.',
    intro: {
      objectives: [
        'Assemble the four deliverables that prove how the application was built and checked',
        'Run a final launch review with real commands and a clear done-or-not-done rule',
        'Write down the prompts, instructions file and checklist you will reuse on your next application',
      ],
      why: 'A live app is what a client sees, but the spec, the prompt log, the test results and the security review are what make it trustworthy, and they are the evidence an employer or customer will actually ask for. This lesson turns thirteen lessons of work into one package.',
    },
    minutes: 30,
    skills: ['agent-feature', 'plan-spec'],
    body: [
      {
        type: 'paragraph',
        text: 'You have built every piece of a real application with AI directing the typing and you directing the thinking. The last step is not another feature. It is **proof**: a live app plus four short documents that show what you intended, how you built it, what you tested and what you found and fixed. A client who pays for software, or an employer who hires you for it, rarely reads the code. They read these. This lesson tells you what goes in each, how to run a final review with real commands, and how to turn what you learned into a routine you reuse.',
      },
      { type: 'heading', text: 'The four deliverables' },
      {
        type: 'table',
        headers: ['Document', 'What it proves', 'What goes in it'],
        rows: [
          [
            'SPEC.md',
            'You knew what you were building',
            'Users, numbered rules, data, non-goals, acceptance checks, stack and limits (lesson 1), plus feature specs such as the waitlist (lesson 13)',
          ],
          [
            'PROMPTS.md',
            'You directed the AI, and you can repeat it',
            'For each step: the goal, the prompt, what came back, what you changed by hand (lessons 1 to 13)',
          ],
          [
            'TEST-RESULTS.md',
            'It works, and you checked that the checks work',
            'Real output of the unit, API and browser tests, the smoke test, the audit and the break-it checks (lessons 10 to 12)',
          ],
          [
            'SECURITY-REVIEW.md',
            'You looked for trouble and fixed what you found',
            'Each finding with its category, evidence, fix and test, plus the risks you accepted (lesson 9)',
          ],
        ],
        caption: 'Plus the live address and the repository link. Together they are the project submission.',
      },
      {
        type: 'paragraph',
        text: 'Here are the documents in miniature. TEST-RESULTS.md and SECURITY-REVIEW.md use the real numbers and findings of the course project; the PROMPTS.md excerpt only shows the format (its entries are illustrative, and yours will differ). Notice two habits. Every claim is backed by output you can reproduce, and the documents say honestly what was **not** done. A review that says "nothing was missed" is less believable than one that lists what it did not cover.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'TEST-RESULTS.md (the numbers are the real final results of the course project)',
        code: `# TEST-RESULTS.md (Sampaguita Court)

Run on the final commit, against a local production-mode server.

## API and unit tests (Vitest 5.1, PostgreSQL test database)
 Test Files  4 passed (4)
      Tests  27 passed (27)

## Browser tests (Playwright 1.65, Chrome)
  3 passed (3.9s)   journey, two customers, no sideways scroll at 390 px

## Smoke test against the running production build
health: 200 / home page: 200 / courts: listed / sign up: ok / booking: created / cancel: ok
SMOKE TEST PASSED

## Dependency audit (production packages)
found 0 vulnerabilities

## Break-it checks (the test went red when the protection was removed)
ownership check: yes (lesson 10)

## Not tested, and why
Break-it checks for the overlap constraint and the server-side price (to do), real phones (only a 390 px viewport), the email provider (a stand-in service), load.`,
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'SECURITY-REVIEW.md (the six findings of lesson 9)',
        code: `# SECURITY-REVIEW.md (OWASP Top 10:2025)

| # | Finding | Category | Evidence before | Fix | Test |
|---|---------|----------|-----------------|-----|------|
| 1 | Customer can read and cancel another's booking | A01 Broken Access Control | Ben got 200 and 204 on Ana's booking | loadBooking checks ownership, 404 otherwise | "a customer cannot read, cancel or attach..." |
| 2 | SQL built from the status filter | A05 Injection | Crafted status returned Ana's booking | Placeholders and an enum | "the status filter only accepts known values" |
| 3 | Role and price trusted from the request | A06 Insecure Design | role admin accepted; 2 hours for 1 centavo | Strict schemas, server-side price | "registration cannot choose a role..." |
| 4 | Key written in the source | A02 Security Misconfiguration | git grep found key_live_... | Env vars, startup check, key replaced | startup check (manual) |
| 5 | CORS reflected any origin with cookies | A02 Security Misconfiguration | Allow-Origin: https://evil.example | Allow-list, helmet | "a page on an unlisted origin gets no CORS permission" |
| 6 | Login messages and no attempt limit | A07 Authentication Failures | "No account with that email"; 8 tries all allowed | One message, rate limit | "a wrong email and a wrong password look the same" |

Accepted for now: uploads on local disk; in-memory rate limiter (one instance only).`,
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'PROMPTS.md (the format, with illustrative entries: goal, prompt, result and your own change)',
        code: `# PROMPTS.md (excerpt)

## 03: API
Goal: propose the route table first, then the code.
Prompt: "Using the spec below, propose the API as a table before writing code..."
Result: a route table of 11 routes (example).
My change: renamed one route by hand (example).

## 09: security review
Goal: find what the first version trusts.
Prompt: "Review the code in server/src against OWASP Top 10:2025. For each finding give the file, ..."
Result: a list of findings; I verified each with a real request before accepting a fix (example).

## 13: waitlist
Goal: build a feature with an agent in small steps.
Prompt: plan only, then tests first.
Result: the first implementation sorted newest-first; the test caught it (this one happened in lesson 13).`,
      },
      {
        type: 'version',
        text: 'The security review table names categories from OWASP Top 10:2025 (A01 Broken Access Control, A02 Security Misconfiguration, A05 Injection, A06 Insecure Design, A07 Authentication Failures), the edition current on the date checked. Category numbers change between editions, so a review document must state which edition it uses.',
        checked: CHECKED,
        sources: [DOCS.owaspTop10],
      },
      { type: 'heading', text: 'The final launch review' },
      {
        type: 'paragraph',
        text: 'Before you tell anyone it is done, run one last review with real commands, on the exact version you deployed. Do not trust your memory of earlier runs: the change you made yesterday may have broken something. The review is a short, boring list, and boring is the point.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Run the unit and API tests against a clean test database and save the output.',
          'Run the browser tests, then the smoke test against the live address, and save both outputs.',
          'Run the attack script from lesson 9 against the live address (a copy of the data, not real customers) and compare with the "after" results.',
          'Run the dependency audit and confirm that the CI pipeline is green on the deployed commit.',
          'Check the launch checklist: secrets in the host only, uploads in storage that survives a deploy, backups restored once, an uptime monitor and an alert that reaches you.',
          'Write what you did not test in TEST-RESULTS.md.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The rule for "done" is a function, not a feeling: every test passes, the smoke test passes, no finding is open (or each open one is written down as an accepted risk with an owner), and the backup has been restored once. If any of those is false, you are not done, and the documents say why.',
      },
      {
        type: 'prompt',
        label: 'Prompt: help me assemble the evidence pack',
        text: `Here are the outputs of my final checks and my notes. Draft TEST-RESULTS.md and SECURITY-REVIEW.md from them. Use only what is in the outputs: do not invent numbers or tests. Where something is missing (a risk I accepted, a thing I did not test) list it under 'Not tested' or 'Accepted risks' and ask me to confirm. Keep each document to one page.

[paste the command outputs and your notes]`,
      },
      {
        type: 'warning',
        text: 'An AI tool will happily write a confident TEST-RESULTS.md from nothing. Never publish numbers you did not get from a real run, and never let the tool fill the gaps with plausible-looking ones. Your credibility is the only thing these documents have.',
      },
      { type: 'heading', text: 'Take the routine with you' },
      {
        type: 'paragraph',
        text: 'The most valuable thing you built in this course is not the booking app. It is a **routine** you can run on any application: spec, plan, tests first, build in small steps, review for security, test the whole thing, deploy with a rollback, monitor, and improve in small specified changes. Make it yours so you do not have to remember it: keep a personal folder with your reusable prompts (the spec challenge, the route table, the schema, the security review, the tests, the plan-only agent brief), a copy of your instructions file to start every new project, and one checklist that turns the launch review into ticks.',
      },
      {
        type: 'table',
        headers: ['Your reusable asset', 'Start from', 'Update it when'],
        rows: [
          ['Prompt library', 'The prompts in lessons 1 to 13', 'A prompt gave a poor result: fix it and keep the fixed version'],
          ['Instructions file', 'The AGENTS.md or CLAUDE.md from lesson 13', 'The agent repeats a mistake: add one specific line'],
          ['Review checklists', 'The tables in lessons 2, 5, 7, 9 and 13', 'You meet a new kind of flaw: add a row'],
          ['Launch checklist', 'Lesson 11 and the review above', 'An incident teaches you something'],
        ],
        caption: 'A routine only helps if it lives somewhere you will find it.',
      },
      {
        type: 'paragraph',
        text: "Think of a **driving test**. Nobody passes it by being told the car is fine. The examiner has a list, checks each item in the car and on the road, and writes down what they saw. Your four documents are that examiner's sheet for your application, and you are both the driver and, on the final review, the examiner: be fair and write down what you really saw.",
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'You do not need a big project. For your own submission, a small one is fine: two features (for example sign in and booking), a handful of tests, and the same four documents. A small, honest, finished application with proof beats a large one that nobody can check. If a step feels too big, ask the AI to explain it in plain words and to make the next step smaller.',
        audience: { max: 'beginner' },
      },
      {
        type: 'tip',
        text: 'Keep your prompt log as you go, not at the end: write one line after every prompt (goal, result, what you changed). Reconstructing it from memory is painful and unreliable.',
        audience: { max: 'beginner' },
      },
      {
        type: 'paragraph',
        text: 'For a professional engagement, the evidence pack doubles as a handover and an audit trail. Attach it to the release (or the pull request) with the commit hash, and keep each document in the repository so history shows how decisions changed. Agree explicit acceptance criteria and a support period with the client, record the licences of dependencies and any AI-tool terms that affect ownership, and capture operational ownership: who holds the accounts, who is paged, who rotates which secret and when. For agent-assisted work, include the instruction files and the review evidence for each merged agent change, so the team can show how AI-written code was verified. Close with a short retrospective: what escaped to review, what escaped to production, and which check would have caught it earlier.',
        audience: { min: 'advanced' },
      },
      {
        type: 'takeaways',
        items: [
          'Ship proof with the app: SPEC.md (what you intended), PROMPTS.md (how you built it), TEST-RESULTS.md (it works) and SECURITY-REVIEW.md (what you checked and fixed).',
          'Run a final review with real commands on the deployed version, and write down what you did not test.',
          '"Done" is a checkable rule: everything passes, no unexplained open findings, and a backup restored once.',
          'Your reusable routine, prompts, instructions file and checklists is the lasting result: keep it in a place you will find and update it after every project.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-14-match-1',
          kind: 'match',
          title: 'Which document proves it?',
          prompt: 'Match each claim a client might question to the document that answers it.',
          concept: 'evidence pack',
          labels: { terms: 'The client asks', meanings: 'The document that answers' },
          pairs: [
            {
              term: `"Did you check whether one customer can see another's bookings?"`,
              definition: 'SECURITY-REVIEW.md',
              note: 'It lists the finding, the evidence, the fix and the test.',
            },
            {
              term: '"Does everything still pass on the version you deployed?"',
              definition: 'TEST-RESULTS.md',
              note: 'It holds the real output of the test runs on the final commit.',
            },
            {
              term: '"What exactly was the app supposed to do, and what was left out?"',
              definition: 'SPEC.md',
              note: 'It states the rules, the non-goals and the acceptance checks.',
            },
            {
              term: '"How was this built, and could someone repeat it?"',
              definition: 'PROMPTS.md',
              note: 'It records goal, prompt, result and hand changes for each step.',
            },
          ],
          hints: [
            'One question is about intent, one about method, one about results, one about security.',
            "Checking whether one customer can see another's data is a security question.",
            'Real output of test runs belongs in the test results; the prompts belong in the prompt log.',
          ],
          explanation: 'Each document answers a different doubt: what was intended (spec), how it was built (prompt log), whether it works (test results) and whether it is safe (security review).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-14-fill-blank-1',
          kind: 'fill-blank',
          title: 'The launch gate',
          prompt: 'Fill in the blanks so the function says an app is ready to launch only when every test passed and no finding is open.',
          concept: 'definition of done',
          language: 'javascript',
          code: `function readyToLaunch(report) {
  return report.testsPassed ___ report.testsTotal && report.smokeTest === 'passed' && report.openFindings ___ 0;
}`,
          blanks: [
            { answers: ['==='], feedback: 'Every test must pass, so the passed count must equal the total.' },
            { answers: ['==='], feedback: 'No finding may be open, so the open count must equal zero.' },
          ],
          bank: ['===', '===', '!==', '>', '<'],
          tests: {
            kind: 'function',
            fn: 'readyToLaunch',
            cases: [
              {
                label: 'everything is green',
                args: [
                  { testsPassed: 27, testsTotal: 27, smokeTest: 'passed', openFindings: 0 },
                ],
                expected: true,
              },
              {
                label: 'one test failing',
                args: [
                  { testsPassed: 26, testsTotal: 27, smokeTest: 'passed', openFindings: 0 },
                ],
                expected: false,
              },
              {
                label: 'smoke test failed',
                args: [
                  { testsPassed: 27, testsTotal: 27, smokeTest: 'failed', openFindings: 0 },
                ],
                expected: false,
              },
              {
                label: 'an open finding',
                args: [
                  { testsPassed: 27, testsTotal: 27, smokeTest: 'passed', openFindings: 1 },
                ],
                expected: false,
              },
            ],
          },
          hints: ['The passed tests must be exactly all of the tests.', 'The number of open findings must be exactly zero.', 'Both blanks are ===.'],
          explanation: 'A launch gate is a function of evidence, not a feeling. Every condition must hold, so a single failing test, a failed smoke test or an open finding blocks the launch.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-14-scenario-1',
          kind: 'scenario',
          title: 'The client asks: "Is it done?"',
          prompt: 'Choose your answer.',
          concept: 'proving the work',
          situation: 'It is launch day. The tests passed on your laptop last week, the deployed app seems fine, and the client asks whether it is done. You have 20 minutes before the call.',
          options: [
            {
              text: 'Run the final review on the deployed version, paste the real outputs into the evidence pack, list what you did not test, and answer with the documents',
              consequence: 'You find that the uploads folder is still on the container disk, record it as an accepted risk with a date to fix it, and the client sees exactly what is proven and what is not.',
              quality: 'best',
            },
            {
              text: 'Say yes: it passed on your laptop and nothing has changed since then, as far as you remember',
              consequence: 'A dependency update changed the build on the host, the smoke test would have caught it, and the client finds the problem first.',
              quality: 'poor',
            },
            {
              text: 'Ask the AI to write a confident test report quickly so you have something to show',
              consequence: 'The report has plausible numbers nobody produced. The first time the client reruns anything and gets different results, they stop believing every document you wrote.',
              quality: 'poor',
            },
          ],
          hints: [
            'What evidence do you have for the version that is live right now?',
            "Numbers must come from real runs, never from a tool's imagination.",
            'Run the final review, record real outputs, and be honest about what is untested.',
          ],
          explanation: 'The only honest answer to "is it done?" is evidence from the deployed version, including what was not covered. A report invented by a tool, or an old result from a laptop, destroys exactly the trust the documents are meant to build.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'build-fullstack-ai-14-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Your final checklist',
          prompt: 'Tap each card to read what to check before you say "done".',
          concept: 'launch review',
          hints: [],
          explanation: 'A short, repeatable checklist, run with real commands on the real version, is what turns "it seems fine" into "I checked".',
          cards: [
            { front: 'Does it work?', back: 'Run the tests and the smoke test on the live address, and save the output.' },
            { front: 'Is it safe?', back: 'Try the five attacks from lesson 9 again, and keep your SECURITY-REVIEW.md up to date.' },
            { front: 'Can I recover?', back: 'Take a backup, restore it somewhere else once, and write down how long it took.' },
            { front: 'Will I know if it breaks?', back: 'An uptime monitor and an alert that really reaches you.' },
            { front: 'Is it honest?', back: 'The documents say what was not tested and what risks you accepted.' },
          ],
        },
      },
    ],
    quiz: [
      {
        id: 'build-fullstack-ai-14-q1',
        prompt: 'A client asks how you know the booking rules are enforced. Which document do you open?',
        choices: [
          'PROMPTS.md, because the prompts show what the AI was told to build',
          'TEST-RESULTS.md, with real output of tests shown to fail when the protection is removed',
          'SPEC.md alone, because the rules are written down there in numbered form',
        ],
        answer: 1,
        explanation: 'The spec says what was intended; the test results show it is enforced and that the tests can actually fail. Evidence beats intention.',
      },
      {
        id: 'build-fullstack-ai-14-q2',
        prompt: 'Your TEST-RESULTS.md draft from the AI says "all 40 tests pass", but your run printed 27. What do you do?',
        choices: [
          'Keep the 40, since the tool probably counted the browser tests too',
          'Round the number down to 30, to be on the safe side with the client',
          'Delete the line, since a test count does not matter to a client',
          'Replace it with the real output, 27, and tell the tool to use only the outputs',
        ],
        answer: 3,
        explanation: 'Only numbers from a real run belong in the evidence pack. A tool that invents counts must be corrected, not trusted.',
      },
      {
        id: 'build-fullstack-ai-14-q3',
        prompt: 'Which of these is the best definition of "done" for a launch?',
        choices: [
          'All tests and the smoke test pass live, no finding is open without an owner, a backup was restored',
          'The developer feels confident and the deployed site opens without an error',
          'The AI tool says that the project is complete and its review found no problems',
        ],
        answer: 0,
        explanation: "Done is a checkable rule over evidence, not a feeling or a tool's opinion.",
      },
      {
        id: 'build-fullstack-ai-14-q4',
        prompt: 'Why list what you did not test in TEST-RESULTS.md?',
        choices: [
          'It lets you avoid fixing those things, because they have been written down',
          'A list of gaps makes the document look longer and more professional than it would otherwise be',
          'It is a legal requirement in every country where software is delivered to customers',
          'It makes the other results credible and tells the client which risks remain',
        ],
        answer: 3,
        explanation: 'Honesty about gaps is what makes the rest believable, and it lets the client decide which risks to accept.',
      },
      {
        id: 'build-fullstack-ai-14-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, why keep a prompt log while you build?',
        choices: [
          'To make the project folder larger, which helps when it is shown to a client',
          'Because the AI tool refuses to continue unless the previous prompts have been written down',
          'So you can show how the app was made and repeat the steps on the next project',
        ],
        answer: 2,
        explanation: 'The log is your record of what you asked, what came back and what you changed by hand, which is both proof and a reusable recipe.',
      },
      {
        id: 'build-fullstack-ai-14-q6',
        audience: { min: 'advanced' },
        prompt: 'A client handover includes the app, the evidence pack and a support period. What is the most commonly missed item?',
        choices: [
          'A larger number of features than the spec listed, so the client feels they got extra',
          'Who owns each account and secret, who is alerted, and who rotates which key',
          'The names of the AI tools used, which clients never need for any reason',
          "A second copy of the source code on the developer's own personal laptop",
        ],
        answer: 1,
        explanation: 'Operational ownership (accounts, alerts, key rotation) is what keeps the app alive after the project, and it is easy to forget.',
      },
    ],
    task: {
      title: 'Assemble and review your evidence pack',
      minutes: 25,
      steps: [
        'Run the final review list on your deployed app and save every output.',
        'Write SPEC.md, PROMPTS.md, TEST-RESULTS.md and SECURITY-REVIEW.md from your real notes and outputs, using the AI only to tidy wording, never to fill gaps.',
        'List what you did not test and any risk you accepted, with a date to revisit it.',
        'Create your reusable folder: your best prompts, your instructions file and a one-page checklist.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          'Keep the evidence pack to one page per document, and ask the AI to read each one back to you in plain words so you can check that it says what you meant.',
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Attach the pack to the release with the commit hash, add the instruction files and the review evidence for each agent-written change, and write a short retrospective on which check would have caught each escaped bug earlier.',
        ],
      },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'build-fullstack-ai-p1',
    title: 'A tested booking API with accounts',
    summary: 'Write a spec for something people book, then direct an AI tool to build the database, the API and sign-in, and prove with tests and a short security pass that the rules hold.',
    outcome: 'Shows a client or employer that you can specify a back end, steer an AI tool to build it and check it with tests and a review, not only run it once.',
    unlockAfterDay: 9,
    steps: [
      {
        id: 'build-fullstack-ai-p1-s1',
        text: 'Write a one-page SPEC.md for something people book (courts, chairs, tutors, rooms): users, numbered rules, data, non-goals and acceptance checks with named people. Ask the AI to challenge it before it builds.',
      },
      {
        id: 'build-fullstack-ai-p1-s2',
        text: 'Have the AI propose a route table, then build the database (with a constraint that refuses double bookings), the API and sign-in. Run it and exercise every route with curl.',
        link: 'https://expressjs.com/en/guide/error-handling.html',
      },
      {
        id: 'build-fullstack-ai-p1-s3',
        text: "Attack your own API: another customer's booking, a crafted filter value, a forged role, a key in the source, and a foreign Origin header. Record each finding with evidence, fix it and run the same request again.",
        link: 'https://top10.owasp.org/2025/0x00_2025-Introduction',
      },
      {
        id: 'build-fullstack-ai-p1-s4',
        text: 'Add automated tests: one per spec rule and one per security finding, using a separate test database. Break each protection on purpose and confirm that a test goes red.',
      },
      {
        id: 'build-fullstack-ai-p1-s5',
        audience: { max: 'beginner' },
        text: 'Keep it small: one thing to book, three or four rules, sign in and book only. Ask the AI to explain each file it made in plain words before you change anything, and run at least three of the checks by hand.',
      },
      {
        id: 'build-fullstack-ai-p1-s6',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Use a real PostgreSQL (or similar) database with a migration file, a strict input schema on every route and one error shape for the whole API.',
      },
      {
        id: 'build-fullstack-ai-p1-s7',
        audience: { min: 'advanced' },
        text: 'Add an authorisation matrix test (each role against each route and a foreign resource), secret scanning and the dependency audit in CI, and write the threat model in one page.',
      },
    ],
    submission: {
      kind: 'text',
      label: 'Spec, route table, findings and test results',
      placeholder: 'Paste your SPEC.md, your route table, your findings with evidence and fixes, and the output of your test run.',
      hint: 'Include the spec, the route table, each security finding with its before and after evidence, the test output, and the break-it checks you ran.',
    },
    rubric: [
      'The spec has numbered, testable rules, non-goals and acceptance checks with named examples.',
      'Double booking is refused by the database, and the API answers it with a clear 409.',
      'Every route that takes an id checks ownership, and the evidence shows another customer getting a 404.',
      'Input is validated with allow-lists or strict schemas, and no secret is in the source.',
      'Each finding has a test, and the break-it check shows the test can fail.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words what a route, a database constraint and a test are.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The API uses migrations, one error shape and strict input schemas.'] },
      {
        audience: { min: 'advanced' },
        items: ['An authorisation matrix test and CI checks (audit and secret scanning) are present, with a written threat model.'],
      },
    ],
  },
  {
    id: 'build-fullstack-ai-p2',
    title: 'A booking application, live',
    summary: 'Build and deploy a complete booking application with accounts, a database, a file upload and an outside service, and submit it with its spec, prompt log, test results and security review.',
    outcome: 'A deployed full-stack application, with the spec, prompt log, test results and security review that prove how it was built and checked, to show clients or employers.',
    unlockAfterDay: 13,
    steps: [
      {
        id: 'build-fullstack-ai-p2-s1',
        text: 'Take your spec (or the Sampaguita Court one) and build the front end with its four states, the API, the database and sign-in, directing the AI tool in small, fenced prompts and keeping a PROMPTS.md log as you go.',
      },
      {
        id: 'build-fullstack-ai-p2-s2',
        text: 'Add one file upload with limits and one outside service call with a timeout and a decided failure behaviour, using a stand-in service if you have no provider. Keep every secret in environment variables.',
      },
      {
        id: 'build-fullstack-ai-p2-s3',
        text: 'Run the security review against the OWASP Top 10:2025 list: authorisation, injection, input trust, secrets, CORS and login. Keep SECURITY-REVIEW.md with evidence, fixes and tests.',
        link: 'https://top10.owasp.org/2025/0x00_2025-Introduction',
      },
      {
        id: 'build-fullstack-ai-p2-s4',
        text: 'Write API tests and at least one browser test for the main journey, run them against a production-mode server, and save the real output in TEST-RESULTS.md, including what you did not test.',
        link: 'https://playwright.dev/docs/intro',
      },
      {
        id: 'build-fullstack-ai-p2-s5',
        text: 'Deploy it to a host with a managed database, set the settings in the host, run the migrations as a release step, and run a smoke test against the live address.',
        link: 'https://docs.cloud.google.com/run/docs/deploying',
      },
      {
        id: 'build-fullstack-ai-p2-s6',
        text: 'Add a health check, structured logs with a request id, a backup you have restored once and a dependency update routine, and write a short RUNBOOK.md.',
      },
      {
        id: 'build-fullstack-ai-p2-s7',
        audience: { max: 'beginner' },
        text: 'It is fine to ship a small application: sign in and booking only, one upload or one email, a handful of tests. The four documents and the live address are required, and you can ask the AI to explain each file in plain words.',
      },
      {
        id: 'build-fullstack-ai-p2-s8',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Use a managed PostgreSQL database with migrations in CI, tests that run on every push, and make the email and upload failure paths tested.',
      },
      {
        id: 'build-fullstack-ai-p2-s9',
        audience: { min: 'advanced' },
        text: 'Add a feature to your application through a coding agent using a feature spec, a plan you approve and tests first, and include the review of its diff. Decide in writing what changes when you run more than one instance.',
      },
      {
        id: 'build-fullstack-ai-p2-s10',
        audience: { min: 'professional' },
        text: 'Work through reviewable pull requests per prompt with CI results attached, run the agent in a separate worktree with permission rules for sensitive files, and include the review evidence for each agent-written change.',
      },
    ],
    submission: {
      kind: 'url',
      label: 'Live address and repository',
      placeholder: 'https://your-booking-app.example (and the repository link in the first line of your notes)',
      hint: 'Give the live address and the repository link. The repository must contain SPEC.md, PROMPTS.md, TEST-RESULTS.md and SECURITY-REVIEW.md.',
    },
    rubric: [
      'The application is live at a public address, and a sign-up, a booking and a cancellation work on it.',
      'The four documents exist and use real outputs, with what was not tested clearly listed.',
      'Security findings are fixed with evidence and tests, and no secret is in the repository.',
      'Tests cover the spec rules and the security findings, and at least one was shown to fail when its protection was removed.',
      'Health check, logs with a request id, a restored backup and a rollback plan are in place.',
      'The prompt log shows small, specific prompts and what was changed by hand.',
    ],
    rubricExtra: [
      {
        audience: { max: 'beginner' },
        items: ['The learner can explain in plain words the path of one booking through the front end, the API and the database.'],
      },
      {
        audience: { min: 'intermediate', max: 'intermediate' },
        items: ['Migrations and tests run in CI, and the upload and email failure paths are tested.'],
      },
      {
        audience: { min: 'advanced' },
        items: [
          'A coding-agent feature was built from a spec and a plan with tests first, and its diff review is included.',
          'Behaviour with more than one instance (rate limits, uploads, caches) is addressed or listed as a known limit.',
        ],
      },
      {
        audience: { min: 'professional' },
        items: ['Each agent-written change has a reviewable pull request with CI results and review evidence, and permissions protect sensitive files.'],
      },
    ],
  },
];

export const buildFullstackAiCourse: Course = {
  id: 'build-fullstack-ai',
  kind: 'standard',
  title: 'Build a Full-Stack Application with AI',
  level: 'intermediate',
  tagline: 'Direct an AI coding tool to build, secure, test and ship a real booking application.',
  description: 'Build a complete web application with accounts, a database, file uploads and an outside service, using a court-booking app as the running example. An AI tool writes the code while you plan, steer, review it for security, test it, deploy it and keep it healthy.',
  finishLine: [
    'A deployed booking application with real sign-in, a database and tests',
    'The spec, prompt log, test results and security review that prove how it was built',
  ],
  objectives: [
    'Write a spec that an AI coding tool can build a complete application from',
    'Steer the generation of the front end, the API and the database, and read how data flows between them',
    'Review AI-written code for broken authorisation, injection, unsafe input, leaked secrets and CORS mistakes',
    'Test the whole application and deploy it with a health check and a smoke test',
    'Monitor and maintain the live app, and direct a coding agent through a bigger feature',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev', 'fresh-grad'],
  skills: [
    { id: 'plan-spec', label: 'Planning and writing a spec' },
    { id: 'frontend-states', label: 'Steering the front end and its states' },
    { id: 'backend-api', label: 'Reading and steering a back end API' },
    { id: 'database', label: 'Designing the database' },
    { id: 'accounts', label: 'Sign-in and user accounts' },
    { id: 'data-flow', label: 'Tracing data, uploads and outside services' },
    { id: 'security-review', label: 'Reviewing AI code for security' },
    { id: 'testing-ci', label: 'Testing the whole application' },
    { id: 'ship-operate', label: 'Deploying, monitoring and maintaining' },
    { id: 'agent-feature', label: 'Directing a coding agent on a feature' },
  ],
  lessons: lessons,
  projects: projects,
  icon: 'dns',
  updated: '2026-11-14',
};
