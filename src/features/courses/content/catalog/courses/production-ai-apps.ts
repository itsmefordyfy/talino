import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Building Production-Ready Applications with AI. What was run while this course was written (Node.js 22.23, SQLite 3.54, actionlint, curl):
 * a small sample app, "Tindahan Reminders", in a draft version and a hardened version, run for real. The output shown is the real output
 * (request ids, times and file names differ on your computer): the failure-injection runs (a service that hangs, a service that fails
 * twice), the latency measurements (p50 and p95, before and after), the curl calls against the draft and the hardened server, the JSON log
 * lines, the alert script on sample logs, the backup and restore drill on a SQLite file, the CI workflow (parsed by actionlint, its steps
 * run locally, a planted secret caught, a broken limiter caught by the tests), the smoke test passing and failing, and the date-validation
 * drift. Hosting, monitoring and AI products are named only as examples of a kind, from their official documentation, and described in
 * words: no prices. Every statement that depends on a product lives in a dated `version` note. Example AI answers and prompts are
 * written for this course and are not the output of a real model; the timings are from one laptop and will differ on yours.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  owaspTop10: { label: 'OWASP Top 10:2025 (introduction and category list)', url: 'https://top10.owasp.org/2025/0x00_2025-Introduction' },
  owaspApi4: { label: 'OWASP API Security Top 10 2023: API4 Unrestricted Resource Consumption', url: 'https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption' },
  owaspLogging: { label: 'OWASP Logging Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
  mdnTimeout: { label: 'MDN: AbortSignal.timeout()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static' },
  mdn429: { label: 'MDN: 429 Too Many Requests', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429' },
  awsRetries: { label: 'Amazon Builders’ Library: Timeouts, retries, and backoff with jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/' },
  webVitals: { label: 'web.dev: Web Vitals', url: 'https://web.dev/articles/vitals' },
  nodeTest: { label: 'Node.js docs: Test runner (node:test)', url: 'https://nodejs.org/api/test.html' },
  nodeSqlite: { label: 'Node.js docs: SQLite (node:sqlite)', url: 'https://nodejs.org/api/sqlite.html' },
  sqliteCli: { label: 'SQLite docs: Command Line Shell (.backup, .restore, .dump)', url: 'https://www.sqlite.org/cli.html' },
  ghWorkflow: { label: 'GitHub Docs: Workflow syntax for GitHub Actions', url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax' },
  ghSecureUse: { label: 'GitHub Docs: Secure use reference (GitHub Actions)', url: 'https://docs.github.com/en/actions/reference/security/secure-use' },
  ghPushProtection: { label: 'GitHub Docs: About push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  ghProtectedBranches: { label: 'GitHub Docs: About protected branches', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
  ghDependabot: { label: 'GitHub Docs: Configuring Dependabot version updates', url: 'https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates' },
  ghCheckout: { label: 'GitHub: actions/checkout', url: 'https://github.com/actions/checkout' },
  ghSetupNode: { label: 'GitHub: actions/setup-node', url: 'https://github.com/actions/setup-node' },
  ccActions: { label: 'Claude Code docs: GitHub Actions', url: 'https://code.claude.com/docs/en/github-actions' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project (CLAUDE.md)', url: 'https://code.claude.com/docs/en/memory' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  dora: { label: 'DORA: Software delivery performance metrics', url: 'https://dora.dev/guides/dora-metrics/' },
  atlassianBlameless: { label: 'Atlassian: How to run a blameless postmortem', url: 'https://www.atlassian.com/incident-management/postmortem/blameless' },
  gcpPostmortems: { label: 'Google Cloud Architecture Center: Conduct thorough postmortems', url: 'https://docs.cloud.google.com/architecture/framework/reliability/conduct-postmortems' },
  gcpUptime: { label: 'Google Cloud docs: Uptime checks', url: 'https://docs.cloud.google.com/monitoring/uptime-checks' },
  gcpBudgets: { label: 'Google Cloud docs: Create, edit, or delete budgets and budget alerts', url: 'https://docs.cloud.google.com/billing/docs/how-to/budgets' },
  promptCaching: { label: 'Claude API docs: Prompt caching', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
  batchApi: { label: 'Claude API docs: Batch processing', url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'production-ai-apps-01',
    day: 1,
    title: 'What production-ready means',
    summary: 'A demo works while you watch; a product keeps working, tells you when it does not, and never loses what people trusted it with.',
    minutes: 24,
    skills: ['production-readiness'],
    intro: {
      objectives: [
        'Explain the difference between an app that demos well and one that is ready for real users',
        'Name the six questions a production-ready app must answer, and which lesson of this course covers each',
        'Read a first draft built by AI and spot what it would do to real users',
      ],
      why: 'AI can give you a working app in an afternoon, and that speed hides the gap between “it ran when I tried it” and “people can depend on it”. Knowing the gap lets you ask AI for the missing half instead of discovering it from an angry customer.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A demo works when you are watching. A product works when you are asleep. That one difference explains almost everything in this course. At a school fair, a food cart can sell perfect fishballs for an afternoon because the cook is standing right there, tasting, fixing, and chasing away the flies. A restaurant has to serve the same food on a rainy Tuesday when the main cook is sick, the supplier is late, and nobody is checking. **Production** is the word for the live version of your software that real people use. **Production-ready** means it behaves like the restaurant, not like the cart.',
      },
      {
        type: 'paragraph',
        text: 'Throughout this course we harden one small app. **Tindahan Reminders** is a tiny service that Ate Lorna’s sari-sari store uses to keep reminders (a customer’s payment due on a date) and to ask an AI service for a weekly summary. An AI assistant wrote the first draft from a short prompt, and it passes the demo: you send a reminder, it is saved, you get a happy answer. Here is what the draft does when real, careless, or unfriendly people use it. These are real calls to the real draft; we ran them with Node.js 22 and curl.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: two calls to the first draft of the app',
        code: `# A request with no sign-in, a nonsense date, and a role the client chose for itself
$ curl -i -X POST localhost:4001/reminders -d '{"note":"pay rent","due":"not a date","role":"admin"}'
HTTP/1.1 201 Created
{"saved":{"note":"pay rent","due":"not a date","role":"admin"},"youAre":"admin"}

# A request whose body is broken JSON
$ curl -i -X POST localhost:4001/reminders -d '{oops'
HTTP/1.1 500 Internal Server Error
{"error":"Expected property name or '}' in JSON at position 1 (line 1 column 2)","stack":["SyntaxError: ... at JSON.parse (<anonymous>)"]}`,
      },
      {
        type: 'paragraph',
        text: 'Read that slowly. Nobody signed in, yet the app saved the reminder. It accepted “not a date” as a due date. It believed the client when the client said “I am admin”. And when the body was broken, it answered with a server error and handed the stranger a piece of its own internals. Every one of these is something an AI assistant does readily, because you asked for “an endpoint that saves a reminder” and it delivered exactly that: the happy path. Nobody asked for the other ninety percent.',
      },
      { type: 'heading', text: 'Six questions that define “ready”' },
      {
        type: 'paragraph',
        text: 'Production-ready is not a feeling and not a badge. It is a set of questions you can answer with evidence. Software is ready for real users when people can depend on it, you find out quickly when it stops working, you can fix it or undo the change safely, and you never lose their data. Break that into six questions. Each one is a lesson of this course, so you will return to this table.',
      },
      {
        type: 'table',
        headers: ['Question', 'What “yes” looks like', 'Lesson'],
        rows: [
          ['What happens when something fails?', 'A slow or broken dependency costs a second and a polite message, not a frozen app', '2'],
          ['Is it fast enough, and how do you know?', 'You have measured numbers, not a hunch', '3'],
          ['Can someone hurt it or use it to hurt others?', 'Sign-in, input checks, limits and no leaked internals', '4'],
          ['Can you see what it is doing?', 'Logs you can search, and an alert before a customer calls', '5'],
          ['Can you get the data back?', 'A backup you have actually restored, and deletion that works', '6'],
          ['Can you change it safely?', 'Automated checks, a release routine, a way back, and code you can still read next month', '7 to 10'],
        ],
        caption: 'The six questions of production. Lesson 11 adds the seventh that surprises people: what it costs when many people use it.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The path of this course. The loop at the bottom is what “running a product” means: you never reach a final state.',
        source: `flowchart TD
  D(Demo that works) --> R[Reliability and failure handling]
  R --> P[Performance you measure]
  P --> S[Security you can defend]
  S --> O[Logs, metrics and alerts]
  O --> B[Backups and data care]
  B --> C[Checks on every change]
  C --> E[A release routine]
  E --> L(Live and watched)
  L --> I[Incident, learn, improve]
  I --> R`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** An *API* is the part of an app that other programs talk to, like the counter at a store: you ask for something in a fixed way and you get an answer. *Sign-in* (also called *authentication*) is the app checking who you are. A *role* is a label such as “member” or “admin” that says what you are allowed to do. In the output above, the draft let the person tell the app their own role, which is like a customer walking into a shop and telling the guard “I am the owner” with no proof. *Server error* (the number 500) means the app itself broke. You do not need to fix any of this yet. The point is to notice that “it saved my reminder” is only one of many things a real app must get right.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** In a team this is a *production readiness review*: a short checklist gate a service passes before it takes real traffic, owned by the people who will carry the pager. The useful versions are risk-based, not exhaustive: a weekend prototype and a payments path do not get the same bar. Anchor it in service level objectives (what “working” means in numbers, such as availability and a latency percentile, agreed before launch) so alerts and trade-offs have something to point at. The AI-specific shift is that code arrives faster than your review capacity, so the gate must be automated where it can be (tests, scans, a smoke check) and human where it cannot (data ownership, blast radius, who is on call). Treat generated code as an unreviewed pull request from a fast, confident junior: plausible, and silent about everything you did not ask for.',
      },
      {
        type: 'prompt',
        label: 'Ask AI for a readiness review, then check its claims yourself',
        text: 'Act as a skeptical reviewer, not a helper. Read this project and tell me, for each of these six questions, what the code does today and what evidence you saw: (1) what happens when an outside service is slow or down, (2) how fast the main requests are and whether anything was measured, (3) who can call each endpoint and how input is checked, (4) what is logged and whether anyone would be alerted to a failure, (5) whether the data is backed up and whether a restore was ever tried, (6) how a change reaches users and how it is undone. Quote the file and line for every claim. If you cannot find evidence, write “no evidence” instead of guessing. Do not change any files.',
      },
      {
        type: 'warning',
        text: 'Never accept “this is production-ready” from an AI assistant, or from yourself, without evidence you can point to: a test that fails when the thing breaks, a number from a measurement, a restore you performed. The assistant has no way to know whether your backups ever worked.',
      },
      {
        type: 'version',
        text: 'The security gaps in this lesson’s draft map onto categories of the OWASP Top 10:2025 (checked against the project’s own page): A01 Broken Access Control (the client chose its own role), A06 Insecure Design (nothing was designed for misuse), A09 Security Logging & Alerting Failures, and A10 Mishandling of Exceptional Conditions (the broken body ending in a stack trace). The list is revised every few years; lesson 4 returns to it.',
        checked: CHECKED,
        sources: [DOCS.owaspTop10],
      },
      {
        type: 'takeaways',
        items: [
          'A demo works while you watch; production has to work when you are asleep, and tell you when it does not.',
          'An AI first draft delivers the happy path you asked for and is silent about failure, abuse, speed, data loss and change.',
          'Production-ready is a set of six questions answered with evidence: failure, speed, safety, visibility, data, and safe change.',
          'Ask AI to review with “quote the evidence or say no evidence”, then verify the claims yourself.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-01-match-1',
          kind: 'match',
          title: 'Which question went unanswered?',
          prompt: 'Each situation happened to a real small app. Match it to the production question the team had not answered before launch.',
          concept: 'production readiness',
          labels: { terms: 'What happened', meanings: 'The unanswered question' },
          pairs: [
            { term: 'A promo went viral at noon and the app froze; nobody knew until a customer posted about it', definition: 'Can you see what it is doing?', note: 'Nobody was alerted. The slowdown was invisible until a customer complained.' },
            { term: 'A developer ran a clean-up command on the live database and the customers table was empty', definition: 'Can you get the data back?', note: 'The loss was not the problem alone; having no tested way back was.' },
            { term: 'The AI summary service had a bad afternoon and every page of the app waited on it until it timed out in the browser', definition: 'What happens when something fails?', note: 'One slow dependency took everything down with it.' },
            { term: 'A user changed a number in the browser’s request and read another customer’s reminders', definition: 'Can someone hurt it or use it to hurt others?', note: 'The server trusted what the client sent instead of checking who is asking.' },
          ],
          hints: [
            'For each story, ask what the team would have needed in place to prevent the pain.',
            'Two of the four involve a dependency you do not control or data you cannot recreate.',
            'Look for the key verb: froze (failure), nobody knew (visibility), empty (data), read another’s (safety).',
          ],
          explanation: 'Each story is a different one of the six questions. The skill is naming which question was missing, because that tells you which lesson’s tools to reach for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-01-scenario-1',
          kind: 'scenario',
          title: 'The launch you are asked to approve',
          prompt: 'A friend built a booking app with an AI agent and says it is ready for her first 300 customers on Saturday. She has shown you it working on her phone. What do you do?',
          concept: 'readiness evidence',
          situation: 'The agent’s own summary says: “All features implemented, tests pass, production-ready.” There are three tests, all for the happy path. There is no backup, no log search, and the sign-in was added in a hurry.',
          options: [
            { text: 'Ask for evidence on the six questions: try bad input, kill the AI service, check a restore, and look for what is logged. Fix the gaps that put customers’ data at risk first, and launch to a small group.', consequence: 'You find two real gaps in an hour (no backup, a missing permission check) and she launches safely to thirty people first.', quality: 'best' },
            { text: 'Trust the agent’s summary, since the tests pass and it works on her phone.', consequence: 'Saturday goes fine until a customer edits an id in the address and sees someone else’s booking.', quality: 'poor' },
            { text: 'Tell her to delay until she has read all of the code line by line.', consequence: 'She is overwhelmed, never finishes, and the real gaps are still not found because she does not know what to look for.', quality: 'acceptable' },
          ],
          hints: [
            'What does “tests pass” actually prove when all three are happy-path tests?',
            'You cannot read everything, so choose the checks that catch the most damage.',
            'A small first launch lets reality test the app while the harm is still small.',
          ],
          explanation: 'Evidence on the six questions finds the gaps cheaply, and a staged launch limits the harm of the ones you miss. Trust without evidence is the failure; perfectionism without a method is the other.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-01-q1',
        prompt: 'Which sentence best explains why an AI-written first draft usually is not production-ready?',
        choices: [
          'AI tools cannot write code that works, so everything they produce has to be rewritten by hand before real people can use it',
          'It delivers the happy path you asked for, and says nothing about failure, abuse, speed, data loss or change unless you ask',
          'Generated code is always slower than hand-written code, so it cannot handle more than a few users at the same time',
          'It uses the wrong programming language for the job, which is why it fails as soon as real customers start using the app',
        ],
        answer: 1,
        explanation: 'The draft does what the prompt said. The missing ninety percent was never asked for, so the assistant stays silent about it.',
      },
      {
        id: 'production-ai-apps-01-q2',
        prompt: 'In the draft’s output, the client sent "role":"admin" and the app answered "youAre":"admin". What is wrong?',
        choices: [
          'The role should have been written in capital letters so that it matches the labels the server stores internally',
          'The response should have included a stack trace so that the developer could see which line handled the request',
          'The app should have been faster to reply, because a slow reply is what lets a client invent its own role',
          'The server believed what the client claimed about itself instead of deciding the role from proof of identity',
        ],
        answer: 3,
        explanation: 'Anything the client sends can be made up. A role has to come from something the server checked, such as a verified sign-in, never from the request body.',
      },
      {
        id: 'production-ai-apps-01-q3',
        prompt: 'A teammate says “the agent ran the tests and they all pass, so it is ready.” Which reply is the most useful?',
        choices: [
          'Agreed: passing tests are the only evidence that matters for production, so we can ship it now',
          'Which of the six questions do those tests cover, and where is the evidence for the rest?',
          'Ask the agent to run the same tests again in case it made a mistake the first time and the result changes',
          'Add more happy-path tests until there are at least a hundred of them, because the count is what shows the app is safe',
        ],
        answer: 1,
        explanation: 'A passing test only proves what it tests. Readiness is shown by evidence for each question, not by the number of green checks.',
      },
      {
        id: 'production-ai-apps-01-q4',
        prompt: 'Which item is part of the six questions of production?',
        choices: [
          'Whether the app’s logo looks good on a dark background',
          'Whether the code uses the newest version of every library',
          'Whether you can get the data back after an accident',
          'Whether the app has at least one feature more than its rivals',
        ],
        answer: 2,
        explanation: 'Getting data back is question five. Looks, being newest and feature counts are not production questions; they do not decide whether people can depend on it.',
      },
      {
        id: 'production-ai-apps-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is “production”?',
        choices: [
          'The live copy of the app that real people use, as opposed to the copy you test on',
          'The folder on your own laptop where all of the code and the test copies of the app are kept',
          'The first draft that an AI writes before you change it',
        ],
        answer: 0,
        explanation: 'Production is the live place. What goes wrong there affects real people, which is why it needs more care than your own test copy.',
      },
      {
        id: 'production-ai-apps-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team ships a new internal tool and a customer-facing payment path in the same week. How should the readiness bar differ?',
        choices: [
          'Identical for both, because a bar that changes with the risk is just a way to skip steps',
          'Higher for the internal tool, since staff use it every day and will notice every small problem',
          'Higher for the payment path, scaled to the harm of failure and how hard it is to undo',
          'Neither needs one while the code was written by an assistant and reviewed by the same assistant',
        ],
        answer: 2,
        explanation: 'A readiness bar is risk-based: money and customer data justify more evidence, tighter objectives and a staged rollout. Uniform bars waste effort or miss the risk that matters.',
      },
    ],
    task: {
      title: 'Run the readiness review on something real',
      minutes: 15,
      steps: [
        'Pick any small project you or an AI built (or ask an AI assistant to generate a tiny “save a note” API). Write down in one line what it does for a real user.',
        'Paste the readiness-review prompt from this lesson into your AI tool of choice, with the project open, and read the answer for the phrase “no evidence”.',
        'Choose three of its claims and check each yourself: try one bad request, find where an error is logged, and look for any backup.',
        'Fill in the six-question table for your project with “yes”, “no” or “no evidence”, and circle the one gap that could hurt a user most.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each of the six questions to me with an example from a small shop.” Write the example you understood best in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Write two objectives for your service in numbers (for example a request-success rate and a slow-request threshold) and say which of the six questions each one would catch.'] },
    ],
  },
  {
    id: 'production-ai-apps-02',
    day: 2,
    title: 'Reliability and failure handling',
    summary: 'Everything outside your code will fail sometimes; timeouts, careful retries and a plain fallback keep one bad dependency from taking the whole app down.',
    minutes: 28,
    skills: ['failure-handling'],
    intro: {
      objectives: [
        'Add a time limit, a bounded retry with growing waits, and a fallback to a call that depends on an outside service',
        'Decide which errors are worth retrying and which are not',
        'Prove that your failure handling works by injecting failures, not by hoping',
      ],
      why: 'Most real outages begin with a dependency you do not control: an AI service, a payment provider, a database. If your app has no plan for those days, one slow service becomes your outage.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Picture a waiter in a restaurant who sends an order to the kitchen and then stands at the window until the dish appears. On a good night it takes four minutes. One night the cook walks out, and the waiter stands there for the whole evening while every table goes unserved. Nobody told the waiter how long to wait, or what to say to the tables. Your app is that waiter every time it calls something it does not control: the AI service that writes the weekly summary, a payment provider, a map service, even your own database. Those things **will** fail sometimes: slow, down, or wrong. **Reliability** is not about preventing that. It is about deciding in advance what your app does when it happens.',
      },
      {
        type: 'paragraph',
        text: 'Tindahan Reminders asks an AI service for a one-line summary of the week. The first draft, written by an assistant, looks like this and it is fine on a good day. We pointed it at a pretend service that we could make hang or fail on command (**failure injection**: breaking things on purpose, in a safe place, to see what happens).',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The first draft: no time limit, no plan',
        code: `async function summaryBefore() {
  const res = await fetch(url);
  return (await res.json()).summary;
}`,
      },
      {
        type: 'paragraph',
        text: 'There are three missing ideas, and each is a single sentence. A **timeout** says “I will wait this long and no longer”, because without your own limit you wait as long as the tool’s default allows, which is usually far longer than a person will stay on the screen. A **retry** says “some failures are brief, so try again a couple of times”, but with **backoff**, waiting a little longer before each attempt (for example 50 ms, then 100 ms), so you are not hammering a service that is already struggling. A **fallback** says “if it still does not work, do something useful anyway”, such as showing the reminders without the summary. Here is the same call with all three.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The hardened version: a limit, bounded retries with growing waits, a fallback',
        code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function summaryAfter({ tries = 3, timeoutMs = 300, baseMs = 50 } = {}) {
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (res.status >= 500) throw new Error('upstream ' + res.status);
      if (!res.ok) return { text: 'Summary unavailable.', source: 'fallback' };
      return { text: (await res.json()).summary, source: 'live', attempt };
    } catch (error) {
      console.log('attempt ' + attempt + ' failed: ' + (error.name === 'TimeoutError' ? 'timed out' : error.message));
      if (attempt < tries) await sleep(baseMs * 2 ** (attempt - 1));
    }
  }
  return { text: 'Summary unavailable. Your reminders are below.', source: 'fallback' };
}`,
      },
      {
        type: 'paragraph',
        text: 'Read it from the top. The loop makes at most three attempts, so the retrying has an end. Each `fetch` carries `AbortSignal.timeout(300)`, which cancels the request after 300 milliseconds and raises an error named `TimeoutError`. A server error (500 and up) is treated as worth another try. A 4xx answer returns the fallback straight away, because a request the server called wrong does not become right by waiting. Between attempts it sleeps 50 ms, then 100 ms: each wait doubles. When all attempts are used, it returns a plain message and the app carries on. Here is what happened when we ran both versions against the pretend service in three moods.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the failure-injection run (Node.js 22)',
        code: `Upstream hangs
before (stopped by us after 2000 ms) -> "STILL WAITING" in 2004 ms
  attempt 1 failed: timed out
  attempt 2 failed: timed out
  attempt 3 failed: timed out
after  -> {"text":"Summary unavailable. Your reminders are below.","source":"fallback"} in 1061 ms
Upstream flaky (fails twice, then works)
  attempt 1 failed: upstream 503
  attempt 2 failed: upstream 503
after  -> {"text":"Two reminders are due this week.","source":"live","attempt":3} in 164 ms
Upstream healthy
after  -> {"text":"Two reminders are due this week.","source":"live","attempt":1} in 2 ms`,
      },
      {
        type: 'paragraph',
        text: 'When the service hangs, the old version was still waiting when we gave up on it after two seconds; the new one answers in about a second (three 300 ms waits and the pauses between them) with a message the page can show. When the service is flaky, the new version quietly recovers on the third try. When it is healthy, nothing changes. That is the whole point: good failure handling costs you nothing on a good day.',
      },
      {
        type: 'table',
        headers: ['What came back', 'Retry?', 'Why'],
        rows: [
          ['Timeout, connection reset', 'Yes, a few times', 'Often brief; a second try may well work'],
          ['500, 502, 503, 504', 'Yes, with backoff', 'The server had a problem, which may pass'],
          ['429 Too Many Requests', 'Yes, but wait as long as Retry-After says', 'You are being told to slow down, so retrying faster makes it worse'],
          ['400, 401, 403, 404, 422', 'No', 'The request is wrong or not allowed; waiting changes nothing'],
        ],
        caption: 'Retry only errors that might succeed later.',
      },
      {
        type: 'paragraph',
        text: 'Two cautions come with retrying, and both are things an AI assistant will not warn you about. First, **retry only actions that are safe to repeat**. Asking for a summary twice is harmless. Charging a card or sending an SMS twice is not. For those, give each action an **idempotency key**, a unique id for “this one intended action” that the receiving service uses to recognise a repeat and do it only once. Second, **retry at one layer only**. If your page retries three times, which calls your app, which retries three times, which calls a service that retries three times, one failing request becomes twenty-seven. Retries add load to something that is already struggling, so keep the count small and in one place.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of calling a friend who does not pick up. A sensible person lets it ring for a while (the timeout), tries again a couple of times, waiting a bit longer between calls (backoff), and then sends a text instead (the fallback). A silly person lets it ring all night, or calls forty times in one minute. Reading the code above: `for` repeats the steps up to three times; `try` means “attempt this”; `catch` means “if it went wrong, do this instead”; `await sleep(...)` pauses; and `return { text: ... }` hands back the plain message at the end. You can paste the function into an AI assistant and ask it to explain each line to you.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Production resilience is mostly about limits, not retries. Put a *deadline* on the whole request and give each dependency a timeout derived from its own latency percentile (tight enough to fail fast, loose enough that a small share of false timeouts is acceptable), then propagate the remaining budget downstream. Add jitter to the backoff so clients that failed together do not return together. Cap retry volume with a budget or a token bucket, because naive retries turn a brownout into an outage; a circuit breaker is the other tool but adds modal behaviour that is harder to test. Isolate pools (bulkheads) so one slow dependency cannot take every worker. Make the fallback a design decision with an owner: stale cached data, a degraded feature, or an honest error. And test it: a resilience claim without a failure-injection run is a guess.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to add failure handling, with proof',
        text: 'This function calls an outside AI service. Add: a timeout of 300 ms per attempt, at most 3 attempts, exponential backoff starting at 50 ms with random jitter of up to 20 percent, retries only for timeouts, 5xx and 429 (honour a Retry-After header), and a plain fallback result when all attempts fail. Do not retry any 4xx other than 429. Then write a small script that starts a local fake service which can hang, return 503 twice and then succeed, and return 400, and print what the function returns and how long it took in each case. Show me the real output of running it.',
      },
      {
        type: 'warning',
        text: 'A retry without a limit is a self-inflicted attack on your own dependency. If an assistant writes `while (true)` or a retry with no attempt cap, stop and ask for a maximum number of tries, a maximum wait, and a plain failure result.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**If you have built a few apps.** Put the retry loop in one small helper that takes the timeout, the number of attempts and the fallback as parameters, instead of repeating it at each call site. Then a change to your retry policy is one edit and one test, and an assistant cannot invent a slightly different loop for every new call.',
      },
      {
        type: 'version',
        text: 'Checked against MDN: `AbortSignal.timeout(ms)` returns a signal that aborts after the given time with a `TimeoutError`, can be passed to `fetch`, and is widely available in browsers since April 2024; Node.js 22 (used for the runs here) supports it too. Checked against the Amazon Builders’ Library article on retries: set a timeout on every remote call, limit retries, back off with jitter, retry at a single layer, retry only idempotent operations, and retry only errors that may succeed later. MDN describes `429 Too Many Requests` and the optional `Retry-After` header that says how long to wait.',
        checked: CHECKED,
        sources: [DOCS.mdnTimeout, DOCS.awsRetries, DOCS.mdn429],
      },
      {
        type: 'takeaways',
        items: [
          'Every outside dependency will be slow or down sometimes; decide in advance what your app does then.',
          'Three tools: a timeout on every call, a few retries with growing waits, and a useful fallback.',
          'Retry only errors that may pass (timeouts, 5xx, 429), never a request the server called wrong.',
          'Repeat only safe actions, use an idempotency key for the others, and retry at a single layer.',
          'Prove it with failure injection: make the service hang and flake on purpose and read the result.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-02-code-challenge-1',
          kind: 'code-challenge',
          title: 'Plan the waits between attempts',
          prompt: 'Write `backoffDelays(tries, baseMs, capMs)`. It returns an array with one wait time (in milliseconds) for each pause **between** attempts, so `tries` attempts need `tries - 1` waits. The first wait is `baseMs` and each next wait doubles, but no wait may be longer than `capMs`.',
          concept: 'exponential backoff',
          language: 'javascript',
          starter: 'function backoffDelays(tries, baseMs, capMs) {\n  // one wait for each pause between attempts\n}',
          tests: {
            kind: 'function',
            fn: 'backoffDelays',
            cases: [
              { label: '4 tries, base 100', args: [4, 100, 10000], expected: [100, 200, 400] },
              { label: 'the cap stops the doubling', args: [5, 100, 300], expected: [100, 200, 300, 300] },
              { label: 'one try needs no waiting', args: [1, 100, 1000], expected: [] },
              { label: '3 tries, base 50', args: [3, 50, 1000], expected: [50, 100], hidden: true },
            ],
          },
          solution: 'function backoffDelays(tries, baseMs, capMs) {\n  const delays = [];\n  let wait = baseMs;\n  for (let attempt = 1; attempt < tries; attempt += 1) {\n    delays.push(Math.min(wait, capMs));\n    wait = wait * 2;\n  }\n  return delays;\n}',
          hints: [
            'How many pauses are there if you make 4 attempts? Start from that count.',
            'Keep a variable for the current wait and double it after each pause. Use Math.min to apply the cap.',
            'Loop `tries - 1` times: push Math.min(wait, capMs), then set wait to wait * 2.',
          ],
          explanation: 'There is one pause fewer than there are attempts, and each pause doubles until it hits the cap. The cap matters in real systems: without it a long outage would make clients wait minutes between tries.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-02-fix-bug-1',
          kind: 'fix-bug',
          title: 'Retrying what cannot get better',
          prompt: 'An assistant wrote this helper to decide whether to try a failed request again. It also retries requests the server rejected as wrong, which wastes time and load. Tap the faulty line, then choose the fix.',
          concept: 'which errors to retry',
          language: 'javascript',
          code: 'function shouldRetry(status, attempt, maxTries) {\n  if (attempt >= maxTries) return false;\n  return status >= 400;\n}',
          bugLine: 3,
          fixes: [
            { line: '  return status === 429 || status >= 500;', correct: true, why: 'Retries a “slow down” (429) and server-side problems (5xx), and leaves 400, 401, 403, 404 and 422 alone.' },
            { line: '  return status >= 500;', correct: false, why: 'This stops retrying wrongly rejected requests, but it also never retries a 429, which asks the client to try again after waiting.' },
            { line: '  return status > 400;', correct: false, why: 'Only 400 itself is excluded. A 401, 403 or 404 still looks worth retrying, and none of them will improve by waiting.' },
            { line: '  return status !== 404;', correct: false, why: 'Everything except “not found” is retried, including a 401 or 422. Almost all client errors would still be retried.' },
          ],
          tests: {
            kind: 'function',
            fn: 'shouldRetry',
            cases: [
              { label: '503 on attempt 1', args: [503, 1, 3], expected: true },
              { label: '429 on attempt 1', args: [429, 1, 3], expected: true },
              { label: '404 is not retried', args: [404, 1, 3], expected: false },
              { label: '401 is not retried', args: [401, 1, 3], expected: false },
              { label: 'out of attempts', args: [503, 3, 3], expected: false },
              { label: '400 is not retried', args: [400, 1, 3], expected: false },
            ],
          },
          hints: [
            'Which of 400, 401, 403, 404 and 422 would succeed if you simply tried again later?',
            'The two groups worth retrying are “slow down” (429) and “the server had a problem” (500 and up).',
            'Write a condition that is true for 429 or for any status of 500 and above.',
          ],
          explanation: 'Retries are for failures that may pass: overload (429) and server trouble (5xx). A request the server rejected as invalid or forbidden will get the same answer every time, so retrying it only adds load.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-02-scenario-1',
          kind: 'scenario',
          title: 'The text message that arrived three times',
          prompt: 'Your app sends a payment reminder SMS through a provider. Sometimes the provider takes 12 seconds to answer, your 5-second timeout fires, the retry sends again, and the customer gets the same text three times. What is the best fix?',
          concept: 'idempotency',
          situation: 'The provider’s documentation says each send request accepts an idempotency key, and a repeat with the same key is recognised and not sent twice.',
          options: [
            { text: 'Create one idempotency key per intended message (for example the reminder’s own id) and send the same key on every retry.', consequence: 'A retry after a timeout is recognised as the same send. The customer gets one text, even when the first try was slow rather than lost.', quality: 'best' },
            { text: 'Stop retrying SMS sends, so a slow provider simply means some reminders never go out.', consequence: 'No duplicates, but reminders silently go missing whenever the provider has a slow moment.', quality: 'acceptable' },
            { text: 'Raise the timeout to 60 seconds so the retry never starts.', consequence: 'Duplicates drop, but every slow call now freezes the sender for a minute, and a truly dead provider still produces duplicates later.', quality: 'poor' },
          ],
          hints: [
            'The first request may have succeeded even though the answer came too late.',
            'The retry has to tell the provider “this is the same message as before”.',
            'Use a key that is created once per message and reused on every try.',
          ],
          explanation: 'A timeout does not mean the work failed; it means you stopped waiting. An idempotency key lets the provider tell a repeat from a new request, so you can retry safely.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-02-q1',
        prompt: 'In the failure-injection run, why did the first draft still show “waiting” after two seconds while the hardened version answered in about one?',
        choices: [
          'The hardened version used a faster computer, and the first draft ran on a slower one during the test',
          'The hardened version cached the service’s answer from an earlier run, so it never needed to wait',
          'It sets its own limit, retries a few times with growing waits, then returns a plain fallback',
          'The first draft sent too many requests at the same moment, so the service had to slow down its answer',
        ],
        answer: 2,
        explanation: 'Both ran against the same hanging service. Only the hardened one has its own timeout, a bounded number of tries and a fallback, so it gives up on purpose and returns something useful.',
      },
      {
        id: 'production-ai-apps-02-q2',
        prompt: 'Which response is worth retrying a few times?',
        choices: [
          '422 Unprocessable Entity for a date that is not valid',
          '404 Not Found for a reminder id that does not exist',
          '401 Unauthorized because the key was left out',
          '503 Service Unavailable from the AI service',
        ],
        answer: 3,
        explanation: 'A 503 is the server’s own trouble and may pass. The 4xx answers say the request itself is wrong or not allowed, so a retry gets the same answer.',
      },
      {
        id: 'production-ai-apps-02-q3',
        prompt: 'Your page retries 3 times, your API retries 3 times, and the service behind it retries 3 times. One user request fails everywhere. Roughly how many calls reach the failing service in the worst case?',
        choices: [
          'Three, because the retries at each layer share a single count that is spent only once per request',
          'Nine, because only the last two layers add retries on top of the first attempt that the page makes',
          'Eight, because the first attempt at every layer is free and only the extra tries are counted',
          'Twenty-seven, because the retries at each layer multiply instead of adding',
        ],
        answer: 3,
        explanation: 'Three tries at three layers is 3 × 3 × 3. Retries multiply down the stack, which is why you retry at one layer only and keep the count small.',
      },
      {
        id: 'production-ai-apps-02-q4',
        prompt: 'What does an idempotency key let you do?',
        choices: [
          'Make a request run faster by skipping the sign-in check that every request normally goes through',
          'Retry an action such as sending a payment or a message without it happening twice',
          'Hide the secret key of your account from the logs and from anyone who can read the server output',
          'Prove to the user which version of the app made the request and when the request was received',
        ],
        answer: 1,
        explanation: 'The receiver uses the key to recognise a repeat of the same intended action and do it once, which is what makes a retry after a timeout safe.',
      },
      {
        id: 'production-ai-apps-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a fallback?',
        choices: [
          'A second copy of your whole app that sits idle and costs twice as much to run, just in case',
          'The warning message that a computer shows when a program stops working and has to close itself',
          'A plan B for when the first thing fails, such as showing the reminders without the summary',
        ],
        answer: 2,
        explanation: 'A fallback means the user still gets something useful when a part of the app cannot do its job, instead of a frozen screen or an error.',
      },
      {
        id: 'production-ai-apps-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A downstream dependency is overloaded and many clients time out together. Which change most reduces the chance that the retries keep it overloaded after the original problem passes?',
        choices: [
          'Retry immediately and as fast as possible so the work is finished sooner',
          'Raise every timeout so clients wait for longer, since fewer requests then time out',
          'Remove the timeouts from the clients, so no request is ever abandoned in the middle',
          'Add jitter to the backoff and cap total retry volume with a budget',
        ],
        answer: 3,
        explanation: 'Synchronised, unbounded retries keep load high and delay recovery. Jitter spreads the returning clients out and a retry budget bounds the extra load they can add.',
      },
    ],
    task: {
      title: 'Break a call on purpose',
      minutes: 18,
      steps: [
        'Make a folder and save a small script that starts a local web server with a mode you can switch: “ok”, “hang” (never answers) and “fail twice then work”. Ask an AI assistant to write it if you like.',
        'Write the first-draft call (a bare `fetch`), run it against “hang” and stop it after a few seconds. Notice that nothing tells you it is stuck.',
        'Add a timeout, three tries with doubling waits and a fallback message, using the lesson’s code as a guide. Run all three modes and write the real timings next to each.',
        'Add one line to your notes: which of your own app’s outside calls has no time limit today, and what would be its fallback?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain the hardened function line by line, using the example of calling a friend who does not pick up. Keep the explanation next to your code.'] },
      { audience: { min: 'advanced' }, steps: ['Add random jitter to the waits and a limit of ten retries per minute across all requests, then run 50 concurrent calls against “fail twice then work” and show how many requests reached the service with and without the limit.'] },
    ],
  },
  {
    id: 'production-ai-apps-03',
    day: 3,
    title: 'Performance you can measure',
    summary: 'Fast is a number, not a feeling: measure percentiles, find where the time goes, change one thing and measure again.',
    minutes: 28,
    skills: ['performance'],
    intro: {
      objectives: [
        'Explain why p50 and p95 tell you more than an average',
        'Spot the two most common slow patterns in AI-written data code: one query per row, and a missing index',
        'Run a before-and-after measurement and say honestly what changed',
      ],
      why: 'AI assistants happily “optimise” code by guessing, and a guess that makes the code harder to read but no faster is a loss. Measuring tells you whether anything is slow, where, and whether your fix worked.',
    },
    body: [
      {
        type: 'paragraph',
        text: '“It feels fast” is a feeling. “The list request takes 2 milliseconds at p95” is a fact you can compare tomorrow. Performance work goes wrong in exactly one way, which is changing things before measuring them. Think of a queue at a pharmacy. If you only ask “how long is the average wait?” you might hear four minutes and feel fine, while one customer in twenty waits thirty minutes and never comes back. **Percentiles** describe that unlucky customer. The **p50** (the median) is the wait that half of customers beat. The **p95** is the wait that nineteen out of twenty customers beat, so one in twenty is slower than that. When people say “the tail” of the latency, they mean those slow few. Averages hide the tail, which is why production work looks at percentiles.',
      },
      {
        type: 'paragraph',
        text: 'A reliable routine has four steps: **measure** the real thing, **find** where the time goes, **change one thing**, and **measure again**. Change two things at once and you will not know which one helped. Here is the list endpoint of Tindahan Reminders. It returns a customer’s reminders with the customer’s name. The first draft, written by an assistant, is correct and looks perfectly reasonable.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The draft: one query for the list, then one more query for every row',
        code: `function listBefore(customerId) {
  const rows = db.prepare('select * from reminders where customer_id = ?').all(customerId);
  return rows.map((r) => ({
    ...r,
    customer: db.prepare('select name from customers where id = ?').get(r.customer_id).name,
  }));
}`,
      },
      {
        type: 'paragraph',
        text: 'This is the **N+1 query** pattern: one query to get the list (the “1”) and then one extra query for each of the N rows. A customer with 100 reminders costs 101 queries. It is invisible in a demo with five rows and expensive with real data, and assistants write it constantly because it reads naturally. The second problem is not in the code at all. The `reminders` table has 50,000 rows and no **index**, so for each query the database reads every row to find the customer’s reminders. We asked SQLite how it would run the query (`explain query plan`), before and after adding an index on `(customer_id, due, id)`.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the database’s own plan for the query, before and after the index',
        code: `Before the index:
SCAN reminders
USE TEMP B-TREE FOR ORDER BY

After the index:
SEARCH r USING COVERING INDEX reminders_customer_due (customer_id=?)`,
      },
      {
        type: 'paragraph',
        text: '“SCAN” means “read the whole table”. “SEARCH … USING INDEX” means “jump straight to the matching rows”, like using the index at the back of a book instead of reading every page. Now the fix, in two honest steps, measured separately. We ran each version 200 times for different customers on one laptop (Node.js 22 with SQLite in memory) and recorded the p50 and p95.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The fix: one joined query, only the columns we show, one page of 20',
        code: `const page = db.prepare(
  'select r.id, r.due, r.note, c.name as customer ' +
  'from reminders r join customers c on c.id = r.customer_id ' +
  'where r.customer_id = ? order by r.due, r.id limit 20'
);

function listAfter(customerId) {
  return page.all(customerId);
}`,
      },
      {
        type: 'table',
        headers: ['Version', 'Rows returned', 'p50', 'p95'],
        rows: [
          ['Draft: no index, one query per row', '100', '1.76 ms', '2.18 ms'],
          ['Index added, code unchanged', '100', '0.39 ms', '0.51 ms'],
          ['Index, one joined query, page of 20', '20', '0.01 ms', '0.02 ms'],
        ],
        caption: 'Real measurements on one laptop, in memory. Your numbers will differ; the method is what to keep.',
      },
      {
        type: 'paragraph',
        text: 'Read the table honestly. The index alone made the same code about four and a half times faster at p50, and the join and the page took it close to the limit of what we could even measure. Notice also what changed besides speed: the last row returns 20 rows, not 100, so part of the gain comes from doing less work. That is legitimate here, because no person reads 100 reminders on a phone, but you should know when you changed the *answer* and not just the *speed*. These timings are tiny because the data is in memory on one machine. A real database over a network adds delay, and the shape of the table (drafts versus fixes) is the part that carries over.',
      },
      {
        type: 'paragraph',
        text: 'For a website or app screen, the same idea has agreed numbers. Google’s *Web Vitals* measure what a visitor feels: how fast the main content appears (Largest Contentful Paint), how quickly the page reacts to a tap or click (Interaction to Next Paint) and whether things jump around (Cumulative Layout Shift). They are judged at the 75th percentile of real visits, separately for phones and computers, not on your fast laptop.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *database* is where the app keeps its information, like a very organised filing cabinet. A *query* is a request to it, such as “give me Aling Nena’s reminders”. An *index* works like the tabs on the folders: instead of reading every paper in the cabinet, the database jumps to the right folder. The draft above asked the cabinet 101 separate questions when one would do, and it had no tabs. *Latency* is simply how long a request takes. We time many requests and look at the middle one (p50) and the slow-end one (p95), because a single timing can be lucky or unlucky. In the code, `.all(customerId)` runs the query with that customer’s id and returns every matching row, and `limit 20` stops after twenty.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Compute percentiles from raw samples or a histogram, never by averaging percentiles across servers, and watch the tail (p99, p99.9) because fan-out multiplies it: a page that makes ten backend calls meets the slow one far more often than any single call suggests. When load testing, beware *coordinated omission*: a test client that waits for each response before sending the next slows down exactly when the server does, so it under-reports the stalls real users would have hit; use an open-loop (fixed arrival rate) generator and time from the intended send. Profile before changing anything, check the plan on production-sized data (an optimiser can choose differently at 50 rows and 50 million), and treat an index as a trade: faster reads, slower writes, more storage. Keep a performance budget in CI for the paths that matter, so a regression is a failing check and not a surprise.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to find the slow path before it changes anything',
        text: 'The list-reminders endpoint feels slow with real data. Do NOT change code yet. First: (1) write a script that seeds 500 customers and 50,000 reminders into an in-memory database and calls the endpoint for 200 different customers, printing p50, p95 and the slowest time; (2) show me the database’s query plan for each query the endpoint runs; (3) tell me how many queries one request makes. Then propose one change, explain what it should improve, and wait for my approval. After I approve, apply only that change and rerun the same script so we can compare.',
      },
      {
        type: 'tip',
        text: 'Make the AI show its work as numbers. A reply that says “this should be much faster” is a guess. A reply that shows the same script run before and after, with the same data, is evidence.',
      },
      {
        type: 'warning',
        text: 'Be wary of “optimisations” that add a cache first. A cache can hide a slow query behind stale answers, and a customer who just paid but still sees “unpaid” is a worse problem than a few extra milliseconds. Fix the cause (queries, indexes, payload size) before you add something that can serve old data.',
      },
      {
        type: 'version',
        text: 'Checked against web.dev (Web Vitals): the three Core Web Vitals are Largest Contentful Paint (good at 2.5 seconds or less), Interaction to Next Paint (200 milliseconds or less) and Cumulative Layout Shift (0.1 or less), each judged at the 75th percentile of page loads. The runs in this lesson use `node:sqlite` in Node.js 22.23: the Node.js documentation lists it as added in v22.5.0, usable without a flag from v22.13.0 but still experimental there, and as a release candidate from v25.7.0, so check its status before relying on it in an app.',
        checked: CHECKED,
        sources: [DOCS.webVitals, DOCS.nodeSqlite],
      },
      {
        type: 'takeaways',
        items: [
          'Fast is a number: measure p50 and p95, because averages hide the slow few that users remember.',
          'Measure, find where the time goes, change one thing, measure again with the same data.',
          'AI-written data code often makes one query per row (N+1) and forgets indexes; both are cheap to find with a plan and a script.',
          'Say honestly whether a fix made the same work faster or simply did less work.',
          'Fix the cause before adding a cache that can serve stale answers.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-03-code-challenge-1',
          kind: 'code-challenge',
          title: 'Compute a percentile',
          prompt: 'Write `percentile(values, p)` using the **nearest-rank** method. Sort a copy of `values` from smallest to largest, work out the rank as `Math.ceil(p / 100 * values.length)`, and return the value at that rank (rank 1 is the first value). Do not change the array you were given.',
          concept: 'percentiles',
          language: 'javascript',
          starter: 'function percentile(values, p) {\n  // nearest-rank percentile of a list of timings\n}',
          tests: {
            kind: 'function',
            fn: 'percentile',
            cases: [
              { label: 'median of five timings', args: [[15, 20, 35, 40, 50], 50], expected: 35 },
              { label: 'p95 of five timings', args: [[15, 20, 35, 40, 50], 95], expected: 50 },
              { label: 'unsorted input', args: [[50, 15, 40, 20, 35], 50], expected: 35 },
              { label: 'p100 is the slowest', args: [[3, 1, 2], 100], expected: 3 },
              { label: 'p50 of ten timings', args: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 50], expected: 50, hidden: true },
            ],
          },
          solution: 'function percentile(values, p) {\n  const sorted = values.slice().sort((a, b) => a - b);\n  const rank = Math.ceil((p / 100) * sorted.length);\n  return sorted[rank - 1];\n}',
          hints: [
            'You need the timings in order from fastest to slowest first.',
            'Sort a copy with `values.slice().sort((a, b) => a - b)` so the numbers are compared as numbers, not as text.',
            'rank = Math.ceil(p / 100 * length), then return sorted[rank - 1].',
          ],
          explanation: 'Sorting puts the fast requests first, and the rank says how far along the list the percentile sits. For five timings, p95 gives rank 5, the slowest. Sorting a copy keeps the original samples untouched for other calculations.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-03-predict-output-1',
          kind: 'predict-output',
          title: 'Count the queries',
          prompt: 'This simulates the draft endpoint for a customer with three reminders. How many queries does it make?',
          concept: 'N+1 queries',
          language: 'javascript',
          code: 'const reminders = [101, 102, 103];\nlet queries = 0;\n\nfunction query() {\n  queries += 1;\n}\n\nquery();\nfor (const id of reminders) {\n  query();\n}\nconsole.log(queries);',
          expected: '4',
          choices: ['3', '4', '6'],
          wrongNotes: {
            '3': 'That counts only the per-row queries. The list itself is one more query, made before the loop.',
            '6': 'The loop makes one query per reminder, not two, and the list is made once. That is 1 + 3.',
          },
          hints: [
            'One query happens before the loop starts.',
            'The loop runs once for each of the three reminders.',
            'Add the one before the loop to the three inside it.',
          ],
          explanation: 'One query fetches the list and one more runs for each of the three rows, so 1 + 3 = 4. With 100 reminders it would be 101: that growth with the size of the list is what “N+1” means.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-03-scenario-1',
          kind: 'scenario',
          title: 'The assistant wants to add a cache',
          prompt: 'Your dashboard has become slow with real data. You ask the assistant to speed it up. It immediately proposes: “Cache all API responses in memory for 10 minutes.” What do you do?',
          concept: 'measure before optimising',
          situation: 'Nobody has measured anything yet. The dashboard shows each customer’s current balance, and customers pay at the store all day.',
          options: [
            { text: 'Ask it to write a script that measures the slow requests and their query plans first, find the real cause, and fix that before considering a cache.', consequence: 'You discover an N+1 and a missing index. The fix cuts the time sharply and balances stay correct, with no cache needed.', quality: 'best' },
            { text: 'Accept the cache, since it is the quickest change and the dashboard will feel fast again.', consequence: 'The dashboard is fast, but a customer who just paid still sees the old balance for ten minutes and complains. The slow queries are still there.', quality: 'poor' },
            { text: 'Reject any change and live with the slowness until traffic proves it matters.', consequence: 'Nothing breaks today, but the problem grows with the data until it is an incident, and you have learned nothing about the cause.', quality: 'acceptable' },
          ],
          hints: [
            'What do you know about why it is slow so far?',
            'What does a 10-minute cache do to a balance that changes all day?',
            'Find the cause with numbers, then choose the smallest change that fixes it.',
          ],
          explanation: 'Measuring first finds the real cause, usually cheaper and safer than a cache. A cache is a trade (speed for stale answers) that you should choose on purpose, not as a reflex.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-03-q1',
        prompt: 'Your endpoint’s average time is 40 ms but its p95 is 900 ms. What does that tell you?',
        choices: [
          'About one request in twenty is very slow, and the average was hiding them',
          'The server is fast overall and the p95 figure can safely be ignored because it is only an unusual measurement',
          'Every request takes exactly 900 ms, and the average of 40 ms must be a mistake in the measuring script',
          'The test used too many requests, so the numbers can only be trusted after running it again with fewer',
        ],
        answer: 0,
        explanation: 'p95 means 95 percent of requests were that fast or faster, so the remaining 5 percent were slower, and the average smoothed that out. Users remember the slow ones.',
      },
      {
        id: 'production-ai-apps-03-q2',
        prompt: 'An assistant says “this endpoint should be much faster if we add caching and rewrite the loops.” What should you ask for first?',
        choices: [
          'A longer explanation of how caches work in general, so you can judge whether the idea sounds reasonable to you',
          'A list of five other places in the codebase where caching could also be added in the future',
          'A script that measures the endpoint now, with the same data each time, so any change can be compared',
          'The same suggestion again, phrased with more confidence and with a specific number for how much time it will save',
        ],
        answer: 2,
        explanation: 'Without a baseline, “faster” cannot be checked. A repeatable measurement lets you test each change, and often shows the cache was not needed.',
      },
      {
        id: 'production-ai-apps-03-q3',
        prompt: 'A customer has 100 reminders and the draft endpoint looks up the customer’s name inside a loop, once per reminder. How many queries does one request make?',
        choices: [
          '1, because the database runs repeated lookups together as a single query',
          '100, because only the lookups inside the loop count as queries',
          '2, because the list and the names are always separate queries',
          '101: one for the list and one more for each of the 100 rows',
        ],
        answer: 3,
        explanation: 'The list is one query and each row triggers another, so the count grows with the list: 1 + N. A single joined query replaces all of them.',
      },
      {
        id: 'production-ai-apps-03-q4',
        prompt: 'In the measurements, what did adding the index alone change?',
        choices: [
          'Nothing at all, until the query itself was rewritten to use a join and a page of results',
          'It made the average faster but left the p95 unchanged',
          'It made the endpoint return only 20 rows instead of 100',
          'p50 fell from 1.76 ms to 0.39 ms while the code still made one query per row',
        ],
        answer: 3,
        explanation: 'The table shows the index step on its own: the same code, the same 100 rows, and a lower time at both p50 and p95. Paging and the join came after.',
      },
      {
        id: 'production-ai-apps-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does a database index do?',
        choices: [
          'It makes a second copy of your data somewhere else, in case the first one is ever lost or damaged by an accident',
          'It works like the index of a book, letting the database jump to the right rows instead of reading all of them',
          'It checks that nobody without a password can read the data',
        ],
        answer: 1,
        explanation: 'An index is a shortcut to the rows you want. Without it the database reads every row to find a match, which gets slower as the data grows.',
      },
      {
        id: 'production-ai-apps-03-q6',
        audience: { min: 'advanced' },
        prompt: 'A load test reports a p99 within target, yet users complain about stalls at peak. The test client waits for each response before sending the next request. What is the likely flaw?',
        choices: [
          'p99 is the wrong percentile for any test, so the team should look only at the fastest request, the minimum, instead',
          'The test ran for too short a time to see any slow requests at all',
          'The server used too few threads, which a longer test would have shown',
          'The client slows down when the server stalls, hiding delays real users would hit (coordinated omission)',
        ],
        answer: 3,
        explanation: 'A closed-loop client sends fewer requests exactly when the server is slow, hiding the queueing real arrivals experience. An open-loop generator at a fixed rate, timed from the intended send, avoids it.',
      },
    ],
    task: {
      title: 'Measure a slow endpoint, then fix it',
      minutes: 20,
      steps: [
        'Ask an AI assistant to write a small script with an in-memory SQLite database holding 500 customers and 50,000 reminders, and a function that lists a customer’s reminders with the customer’s name using one query per row. Run it and save the output.',
        'Make the script call the function 200 times for different customers and print p50, p95 and the slowest time. Write the numbers down: this is your baseline.',
        'Ask the assistant for the database’s query plan for the slow query. Add the index it suggests and rerun the same script. Write down the new numbers.',
        'Ask for the one-query version with a page of 20 and rerun. Write a sentence saying how much of the gain came from doing less work.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain in plain words what an N+1 query is, using a store counter as the comparison, and what “SCAN” and “SEARCH” mean in the query plan.'] },
      { audience: { min: 'advanced' }, steps: ['Add a second index you suspect is unnecessary and measure write time for 10,000 inserts with and without it, to put a number on the trade between read and write speed.'] },
    ],
  },
  {
    id: 'production-ai-apps-04',
    day: 4,
    title: 'Security you can defend',
    summary: 'Know who is asking, check every input, set limits, fail quietly and keep secrets out of code, then prove each one with a real request.',
    minutes: 30,
    skills: ['security-hardening'],
    intro: {
      objectives: [
        'Turn an unsafe AI-written endpoint into one that checks identity, input, size and rate',
        'Explain why roles and ids must come from the server, never from what the client sends',
        'Prove each protection with a real request and its status code',
      ],
      why: 'AI-written endpoints work for friendly users and are open to everyone else. “Defensible” means you can point to the check that stops each abuse and show it working, which is what a client, a customer or a security review will ask for.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'In a sari-sari store the cash box sits behind the counter, and you do not hand it to a stranger who says “I am the owner’s cousin.” You decide who may touch it, you do not take their word for it, and you do not tell strangers where you keep the spare key. Software security is the same set of habits. **Defensible** security does not mean “nothing can ever go wrong”. It means you can point at the specific check that stops each kind of abuse, and show it working. AI assistants skip these checks because you asked for a feature, and a feature that works for friendly users does not need them to demo.',
      },
      {
        type: 'paragraph',
        text: 'The first draft of Tindahan Reminders (lesson 1) failed in four ways. We fixed each with one idea, and then proved the fix with a real request. The five ideas below are the working baseline for almost any small web service: **know who is asking**, **check every input**, **set limits**, **fail quietly**, and **keep secrets and dependencies in order**.',
      },
      {
        type: 'table',
        headers: ['Draft behaviour', 'Fix', 'What the real request now shows'],
        rows: [
          ['Accepts a request from anyone', 'Require a sign-in token and look up the user on the server', '401 “sign in first”'],
          ['Trusts a role sent in the body', 'The owner and role come from the token; ignore the body for these', 'Saved with `owner: "ana"` whatever the body says'],
          ['Accepts “not a date”', 'Validate shape and meaning on the server', '422 with the list of problems'],
          ['Accepts a huge body', 'Limit the body size', '413 “body too large”'],
          ['Unlimited requests from one user', 'A rate limit that answers 429 with Retry-After', '429 on the 4th request in 10 seconds'],
          ['Prints a stack trace on error', 'A generic message and a request id; details only in the log', '500 “something went wrong” plus an id'],
        ],
        caption: 'Six fixes for the six behaviours of the draft.',
      },
      { type: 'heading', text: 'Know who is asking, and decide the rest on the server' },
      {
        type: 'paragraph',
        text: 'Anything that arrives in a request, whether in the body, the address or a header, can be written by anyone, because a browser’s address bar and a command-line tool let a person send whatever they like. So the server must work out two things itself: **who** the caller is (*authentication*, usually a token that was issued at sign-in) and **what they are allowed to do** (*authorization*, decided from records the server holds). The hardened handler looks up the token, takes the user and role from its own table, and attaches the owner to the saved reminder itself.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Fragment of the hardened handler: identity comes from the token, not the body',
        code: `const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
const user = TOKENS[token];
if (!user) return send(401, { error: 'sign in first' });

// ... later, after validation: the owner is the verified user, never a field of the body
reminders.push({ ...value, owner: user.user });`,
      },
      { type: 'heading', text: 'Check every input, and limit what one caller can use' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Validation and a fixed-window rate limiter, both small enough to read',
        code: `export function validate(input) {
  const errors = [];
  if (typeof input !== 'object' || input === null) return { errors: ['body must be a JSON object'] };
  if (typeof input.note !== 'string' || input.note.trim().length < 1 || input.note.length > 200) errors.push('note must be 1 to 200 characters');
  if (typeof input.due !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}$/.test(input.due) || Number.isNaN(Date.parse(input.due))) errors.push('due must be a real date like 2026-12-01');
  return errors.length ? { errors } : { value: { note: input.note.trim(), due: input.due } };
}

export function makeLimiter(limit, windowMs) {
  const seen = new Map();
  return function allow(key, now) {
    const entry = seen.get(key);
    if (!entry || now - entry.start >= windowMs) { seen.set(key, { start: now, count: 1 }); return true; }
    if (entry.count >= limit) return false;
    entry.count += 1;
    return true;
  };
}`,
      },
      {
        type: 'paragraph',
        text: 'The validator returns only the two fields we expect, trimmed, so a surprise field such as `role` is dropped rather than saved. The limiter remembers when each user’s current window started and how many requests they made in it; once they reach the limit, further requests in that window are refused until the window ends. Both live in the same file as the server so the tests in lesson 7 can import them. One honest warning: validation like this is a floor, not a ceiling. Lesson 10 shows a gap in this very `validate` function that the tests we had did not catch, which is exactly the kind of thing generated code hides.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the same requests, against the hardened server (headers trimmed)',
        code: `--- no token
HTTP/1.1 401 Unauthorized
x-content-type-options: nosniff
cache-control: no-store
{"error":"sign in first"}

--- bad input (a made-up date, plus a "role" the client tried to send)
HTTP/1.1 422 Unprocessable Entity
{"errors":["due must be a real date like 2026-12-01"]}

--- broken JSON
HTTP/1.1 400 Bad Request
{"error":"body is not valid JSON"}

--- good request
HTTP/1.1 201 Created
{"saved":{"note":"pay rent","due":"2026-12-01","owner":"ana"}}

--- 4th request within 10 seconds, same user (limit is 3)
HTTP/1.1 429 Too Many Requests
retry-after: 10
{"error":"too many requests, try again soon"}

--- body of 3,000 characters (limit is 2,000 bytes)
HTTP/1.1 413 Payload Too Large
{"error":"body too large"}`,
      },
      {
        type: 'paragraph',
        text: 'Notice the status codes: **401** means “I do not know who you are”, **422** means “I understood the request, but the content is not acceptable”, **400** means “I could not even read it”, **429** means “slow down” and **413** means “too big”. Using the right one helps your own monitoring (lesson 5) and the clients that call you. Also notice that the failure messages tell the caller what to fix but never reveal how the server works. Errors are the other half of fail-quietly: the draft returned a stack trace, which tells an attacker your file names and libraries. The hardened version logs the details privately and gives the caller a short message and a request id to quote to you.',
      },
      { type: 'heading', text: 'Secrets and dependencies' },
      {
        type: 'paragraph',
        text: 'Two more habits cost almost nothing. Keep every key, token and password **out of the code** (in environment variables on the server, never in a file that is committed and never in an app that ships to a phone or browser), because anything in the client can be read by whoever installs it. And keep your **dependencies**, the libraries your app is built from, up to date and few: run your package manager’s audit command, and check that a library an assistant suggests is real and well known, since assistants sometimes name packages that do not exist or have look-alike names. Lesson 7 automates these checks, and the course AI Coding Security and Best Practices goes much deeper on secrets, supply chains and prompt injection.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *token* is like a wristband at a concert: you get it once at the door after showing your ticket, and from then on staff look at the wristband, not at what you say. *Validation* means checking that what people send makes sense before the app uses it, like a cashier checking that a bill is real before accepting it. A *rate limit* is a rule like “three attempts per ten seconds”, which stops one person, or one broken program, from using up everything. In the code: `const user = TOKENS[token]` looks the wristband up in the app’s own list; `if (!user)` means “if it is not on the list”; `return send(401, ...)` stops and answers “sign in first”. The word *server* means the computer that runs the app, and *client* means the app or browser that talks to it.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The failures that matter most in API work are authorization, not authentication: *object-level* checks (does this record belong to this caller?) and *function-level* checks (may this role call this action?), which assistants forget because the happy path never exercises them. Test them with two users in one test, not one. Key rate limits to an authenticated identity and a network address, return `Retry-After`, and move the counters to shared storage once you run more than one instance, since an in-memory limiter is per process. Prefer allow-list schema validation at the boundary with a size limit on every string, array and body, and reject unknown fields. Add security headers at the edge, rotate secrets, scope tokens, and write a short threat model (assets, entry points, who might abuse them) so the checklist has a reason. Map findings to OWASP categories so they can be prioritised and tracked.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to review as an attacker and write failing tests',
        text: 'Review this service as an attacker, not as its author. List every endpoint and, for each one: who can call it, what is validated, what is trusted from the client (ids, roles, prices, owner fields), whether there is a size and rate limit, and what an error response reveals. For every weakness you find, write a failing automated test that demonstrates it with a real request, and only then propose the smallest fix. Do not add features. Do not change code until I approve the list.',
      },
      {
        type: 'warning',
        text: 'A security review by the same assistant that wrote the code is a first pass, not a verdict. Try the attacks yourself with a command-line tool, and treat “I could not find any issues” as “I did not look hard enough” until you have seen the failing tests and the 401, 422, 429 and 413 responses for yourself.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**If you have built a few apps.** Put the checks in one place that every route passes through (sign-in first, then validation, then the limit), so a new endpoint cannot forget them. Write one test per check that sends a real request to the running server, and keep a test for the case where the check is missing.',
      },
      {
        type: 'version',
        text: 'Checked against the OWASP Top 10:2025 (A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A05 Injection, A07 Authentication Failures, A09 Security Logging & Alerting Failures, A10 Mishandling of Exceptional Conditions are among its categories) and the OWASP API Security Top 10 2023, which names unrestricted resource consumption (API4) and advises rate limits, maximum payload sizes, timeouts and spending limits. MDN documents 429 Too Many Requests and the Retry-After header. GitHub documents push protection, which blocks a push that contains a recognised secret; it is on by default for your own pushes to public repositories and off by default at repository level until an administrator enables it.',
        checked: CHECKED,
        sources: [DOCS.owaspTop10, DOCS.owaspApi4, DOCS.mdn429, DOCS.ghPushProtection],
      },
      {
        type: 'takeaways',
        items: [
          'The server decides who is asking and what they may do, from its own records; anything the client sends can be made up.',
          'Validate every input on the server, keep only the fields you expect, and limit body size and request rate.',
          'Use accurate status codes: 401, 422, 400, 429, 413. They guide clients and your monitoring.',
          'Fail quietly: a short message and a request id to the caller, details only in your logs.',
          'Keep secrets out of code and clients, keep dependencies few and audited, and prove every protection with a real request.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'The role that came from the request',
          prompt: 'An assistant wrote this helper to decide a caller’s role. A person who signs in as an ordinary member can still act as an admin. Tap the faulty line, then choose the fix.',
          concept: 'server-side authorization',
          language: 'javascript',
          code: 'function roleFor(request, accounts) {\n  const account = accounts[request.token];\n  if (!account) return \'none\';\n  return request.body.role || account.role;\n}',
          bugLine: 4,
          fixes: [
            { line: '  return account.role;', correct: true, why: 'The role comes only from the server’s own account record, found through the token. Whatever the body claims is ignored.' },
            { line: '  return request.body.role || \'member\';', correct: false, why: 'This still trusts the body, and it also ignores the real role, so a genuine admin who sends no role would become a member.' },
            { line: '  return request.body.role === \'admin\' ? \'admin\' : account.role;', correct: false, why: 'This makes it worse: anyone who writes "admin" in the body becomes an admin, which is the very hole we are closing.' },
            { line: '  return account.role === request.body.role ? account.role : \'member\';', correct: false, why: 'The body is still part of the decision. A real admin who sends no role, or a different one, is downgraded to member.' },
          ],
          tests: {
            kind: 'function',
            fn: 'roleFor',
            cases: [
              { label: 'a member cannot claim admin', args: [{ token: 't1', body: { role: 'admin' } }, { t1: { role: 'member' }, t2: { role: 'admin' } }], expected: 'member' },
              { label: 'a real admin stays admin with an empty body', args: [{ token: 't2', body: {} }, { t1: { role: 'member' }, t2: { role: 'admin' } }], expected: 'admin' },
              { label: 'an unknown token has no role', args: [{ token: 'zzz', body: { role: 'admin' } }, { t1: { role: 'member' }, t2: { role: 'admin' } }], expected: 'none' },
              { label: 'a member with an empty body', args: [{ token: 't1', body: {} }, { t1: { role: 'member' }, t2: { role: 'admin' } }], expected: 'member' },
            ],
          },
          hints: [
            'Which of the two values on the last line can the caller change?',
            'The account record is found with the token and belongs to the server.',
            'Return only account.role and do not look at the body.',
          ],
          explanation: 'A role is a decision the server makes from its own records. Mixing in a value from the request, even as a fallback, lets a caller choose their own permissions.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-04-code-challenge-1',
          kind: 'code-challenge',
          title: 'Which requests does the limiter allow?',
          prompt: 'Write `allowedRequests(times, limit, windowMs)`. `times` is the list of times (in milliseconds, in increasing order) at which one user made requests. A **fixed window** starts at the first request in it. A request is allowed if fewer than `limit` requests were already allowed in the current window. A request made `windowMs` or more after the window began starts a new window and is allowed. Return an array of `true` or `false`, one for each request.',
          concept: 'rate limiting',
          language: 'javascript',
          starter: 'function allowedRequests(times, limit, windowMs) {\n  // one true or false for each request time\n}',
          tests: {
            kind: 'function',
            fn: 'allowedRequests',
            cases: [
              { label: 'limit of 3 within one window', args: [[0, 1, 2, 3], 3, 1000], expected: [true, true, true, false] },
              { label: 'a new window lets people back in', args: [[0, 1, 2, 3, 1000, 1001], 3, 1000], expected: [true, true, true, false, true, true] },
              { label: 'exactly one window later starts a new one', args: [[0, 500, 1000], 2, 1000], expected: [true, true, true] },
              { label: 'a limit of 1', args: [[0, 10, 20], 1, 100], expected: [true, false, false], hidden: true },
            ],
          },
          solution: 'function allowedRequests(times, limit, windowMs) {\n  const result = [];\n  let start = 0;\n  let count = 0;\n  for (let i = 0; i < times.length; i += 1) {\n    const now = times[i];\n    if (i === 0 || now - start >= windowMs) {\n      start = now;\n      count = 1;\n      result.push(true);\n    } else if (count >= limit) {\n      result.push(false);\n    } else {\n      count += 1;\n      result.push(true);\n    }\n  }\n  return result;\n}',
          hints: [
            'Keep two variables: when the current window started and how many requests it has allowed.',
            'If this is the first request, or it came windowMs or more after the window started, begin a new window with a count of 1.',
            'Otherwise, refuse when count has reached the limit, and allow (and count) the request when it has not.',
          ],
          explanation: 'This is the same fixed-window rule as the server’s limiter, written as a pure function so you can see how it decides. Its known weakness is that a burst can straddle two windows; that is the trade for being simple and cheap.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-04-match-1',
          kind: 'match',
          title: 'Abuse and the check that stops it',
          prompt: 'Match each thing a caller might do to the protection that answers it.',
          concept: 'defensive checks',
          labels: { terms: 'What the caller does', meanings: 'The protection' },
          pairs: [
            { term: 'Sends {"role":"admin"} in the body to get admin rights', definition: 'Decide the role on the server from the verified token', note: 'The body is the caller’s words. The role must come from the server’s own record.' },
            { term: 'Posts a note that is 5 MB of text', definition: 'A maximum body size, answering 413', note: 'Size limits stop one request from using up memory and money.' },
            { term: 'Sends the same request 500 times in a minute from one account', definition: 'A rate limit answering 429 with Retry-After', note: 'A rate limit is what answers repetition, whether from an attacker or a bug.' },
            { term: 'Sends broken JSON to see what the server prints', definition: 'A generic error with a request id, details only in the log', note: 'Detailed errors help an attacker more than the caller.' },
          ],
          hints: [
            'Ask what the caller controls in each case: the content, the size, the number, or the way the server complains.',
            'The first one concerns trust, and the last one concerns what the server reveals.',
            'Size goes with 413 and repetition goes with 429.',
          ],
          explanation: 'Each protection answers a specific kind of abuse. If you cannot say which check stops an abuse, you probably do not have one.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-04-q1',
        prompt: 'Where should the server decide that a caller is an admin?',
        choices: [
          'From a "role" field in the request body, so the app knows which screen the user is on',
          'From a header the browser adds automatically, because browsers are not able to change those headers',
          'From the verified sign-in token, looking up the account in the server’s own records',
          'From whichever role the caller used the last time they signed in, as remembered by the browser',
        ],
        answer: 2,
        explanation: 'Only data the server holds and checked, found through the verified token, can be trusted. Anything the client sends, including headers, can be written by the caller.',
      },
      {
        id: 'production-ai-apps-04-q2',
        prompt: 'Why does the hardened server refuse a very large request body with a 413?',
        choices: [
          'One request could otherwise use huge memory and cost (unrestricted resource consumption)',
          'Large bodies always contain viruses that spread to other users on the same server',
          'The HTTP standard says that any body larger than a few kilobytes must be rejected',
          'Large bodies are slower to send, so the client would give up before the server had read them',
        ],
        answer: 0,
        explanation: 'Without limits, a single caller can consume bandwidth, memory and, with paid services, money. Maximum sizes and rate limits are the prevention the OWASP API Security Top 10 recommends.',
      },
      {
        id: 'production-ai-apps-04-q3',
        prompt: 'A signed-in user sends valid JSON, but the due date is "2026-13-45". Which status code fits best?',
        choices: [
          '401 Unauthorized, because the date makes the whole request untrustworthy',
          '422 Unprocessable Entity, because the request was read but its content is not acceptable',
          '429 Too Many Requests, because the date has been tried before',
          '500 Internal Server Error, because the server could not make sense of the date and had a problem',
        ],
        answer: 1,
        explanation: '401 is about identity and 429 about rate. 500 means the server broke, which it did not. 422 says the request was understood but the content is invalid, and tells the client to fix the input.',
      },
      {
        id: 'production-ai-apps-04-q4',
        prompt: 'Why does the hardened server answer a crash with “something went wrong” plus a request id instead of the error text?',
        choices: [
          'Error text is always too long to fit in a response, so the id is a shorter version of it',
          'Short messages load faster on slow phones, which matters more than reporting the real cause',
          'The request id is needed so that the browser can retry the request automatically afterwards',
          'Internal details help an attacker, so they go only to private logs, linked by the id',
        ],
        answer: 3,
        explanation: 'The caller needs to know something failed and how to quote it to you. The details belong in a log only you can read, and the request id lets you find the exact entry.',
      },
      {
        id: 'production-ai-apps-04-q5',
        audience: { max: 'beginner' },
        prompt: 'Why is it unsafe for an app to believe a “role” that the user’s browser sends?',
        choices: [
          'Browsers cannot send words, only numbers, so the role would arrive scrambled and the app could not read it',
          'The role would be shown on the screen where other users could see it',
          'Anyone can send anything, so a person could just write “admin”; the app must check for itself',
        ],
        answer: 2,
        explanation: 'What arrives from a browser is only a claim. It is like someone telling a guard “I am the owner” with no proof, so the app has to check against its own records.',
      },
      {
        id: 'production-ai-apps-04-q6',
        audience: { min: 'advanced' },
        prompt: 'A signed-in, rate-limited user changes the id in /reminders/42 to /reminders/43 and reads another customer’s reminder. Which control is missing?',
        choices: [
          'A stricter rate limit, so a user has no time to try many ids',
          'A check that the record belongs to the caller, tested with two users',
          'Longer ids, since short numbers can be guessed more easily than long random ones',
          'Input validation on the id, to check that it is a number',
        ],
        answer: 1,
        explanation: 'Sign-in and limits do not decide whose record it is. The handler must check ownership on every access, and a test with two users shows when it is missing. Random ids only make guessing harder, not allowed.',
      },
    ],
    task: {
      title: 'Attack your own endpoint',
      minutes: 20,
      steps: [
        'Ask an AI assistant to write a tiny server with POST /reminders that saves whatever JSON it receives. Run it and send three bad requests with curl: broken JSON, a made-up date, and a body containing "role":"admin". Save the responses.',
        'Ask the assistant to add a sign-in token check, validation that keeps only the fields `note` and `due`, a body size limit of 2,000 bytes and a limit of 3 requests per 10 seconds per user. Do not accept the change until you have run the same bad requests again.',
        'Write a table of the six responses you got (for example 401, 422, 400, 201, 429 and 413) next to the six requests that caused them.',
        'Add one line saying which endpoint in your own projects trusts an id or a role from the client.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each status code you received (401, 422, 400, 429, 413) using a shop counter as the example, and write one sentence about the one you found most surprising.'] },
      { audience: { min: 'advanced' }, steps: ['Add a second user and a GET /reminders/:id endpoint, write a test where user B requests user A’s reminder and expects a refusal, and show the test failing before you add the ownership check.'] },
    ],
  },
  {
    id: 'production-ai-apps-05',
    day: 5,
    title: 'Monitoring, logs and alerts',
    summary: 'Write logs you can search, watch a few numbers that show users’ pain, and alert on symptoms so you hear about a problem before your customers tell you.',
    minutes: 28,
    skills: ['observability'],
    intro: {
      objectives: [
        'Write structured logs with a request id, and say what must never be logged',
        'Choose a few signals that show whether users are being hurt, and an alert rule for each',
        'Explain why a good alert needs enough traffic to judge and an action to take',
      ],
      why: 'A problem you do not know about is a problem that keeps growing. Logs, a few numbers and an alert are how you learn about a failure from your own tools instead of from an angry message.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Imagine running Ate Lorna’s store with no logbook, no sales counter and a door with no chime. A customer says “I came yesterday afternoon and nobody served me”, and you cannot prove or disprove it. **Observability** is the ability to see what your app is doing from the outside, and it has three everyday tools. **Logs** are the logbook: a record of events, each with a time. **Metrics** are the sales counter: numbers over time, such as requests per minute or the share that failed. **Alerts** are the door chime: a message that reaches a person when a number goes bad. An AI assistant will happily scatter `console.log("here")` through your code, which helps while you are building and is close to useless at 3 a.m. with a hundred users waiting.',
      },
      { type: 'heading', text: 'Logs you can search' },
      {
        type: 'paragraph',
        text: 'A log line written as a sentence (“user ana saved a reminder”) is easy to read and hard to count. A **structured log** writes each event as one line of JSON with named fields, so a tool (or a one-line command) can find and count them: all the 429s, everything for one user, every request slower than a second. The hardened Tindahan Reminders writes one line per request, and gives every request a short **request id** that it also sends back to the caller in a header. We ran it and these are the real lines it wrote (we trimmed the list).',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The logger and the request id: small and boring on purpose',
        code: `const log = (fields) => console.log(JSON.stringify({ time: new Date().toISOString(), ...fields }));

// inside the request handler, once the answer is known:
log({ level: status >= 500 ? 'error' : 'info', msg: 'request', requestId, method: req.method, path: req.url, status, ms: Math.round(performance.now() - started), user: res.user ?? null });`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: three lines of the hardened server’s log, and a search for the 429s',
        code: `{"time":"2026-11-14T12:23:37.231Z","level":"info","msg":"request","requestId":"b2cc51a5","method":"POST","path":"/reminders","status":401,"ms":2,"user":null}
{"time":"2026-11-14T12:23:37.263Z","level":"info","msg":"request","requestId":"3ae42798","method":"POST","path":"/reminders","status":201,"ms":0,"user":"ana"}
{"time":"2026-11-14T12:23:37.272Z","level":"info","msg":"request","requestId":"107b24f9","method":"POST","path":"/reminders","status":429,"ms":0,"user":"ana"}

$ grep -c '"status":429' hardened-log.txt
3`,
      },
      {
        type: 'paragraph',
        text: 'Now “my reminder did not save at 10:42” has a path to an answer: the customer quotes the request id from the error (or you search for their user and that minute), and you see exactly what the server decided and how long it took. Decide up front what each line carries: **when** (time), **where** (the endpoint), **who** (the user, as an id), **what happened** (status, message) and **how long** it took. Equally important is what you must **never** write to a log: passwords, access tokens and session ids, keys, database connection strings, card numbers and other sensitive personal data. Our log names the user (`ana`) but not the token she signed in with. The OWASP logging guidance also asks you to log security-relevant events (sign-in failures, refused requests, validation failures, errors, start-ups and configuration changes) and to protect the logs themselves, because logs are a favourite place for secrets to leak.',
      },
      { type: 'heading', text: 'A few numbers, and alerts on symptoms' },
      {
        type: 'paragraph',
        text: 'You do not need fifty dashboards. For a service like this, three numbers cover most of what hurts users: **how many** requests arrive, **how many fail** (the share answered with a 5xx server error), and **how long** they take (p95, from lesson 3). Add one more: a **health check**, a tiny endpoint such as `/health` that an outside checker calls every minute. An *uptime check* from a monitoring service does exactly that from several places in the world, so you learn the app is unreachable even when the app itself is too broken to tell you.',
      },
      {
        type: 'paragraph',
        text: 'An **alert** is a rule that turns a number into a message to a person. The skill is making it useful. Alert on **symptoms users feel** (many failures, very slow answers, the health check failing), not on internal numbers that may or may not matter (a busy processor). Require **enough traffic to judge**: at 3 a.m. one failed request out of two is “50 percent errors” and tells you nothing. And make sure each alert has an **action**: if nobody knows what to do when it fires, it is noise, and people learn to ignore noise, including the one that matters. We wrote the rule as a small function and tried it on four pretend minutes of logs.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'An alert rule as code: judge the recent requests, but only with enough of them',
        code: `export function summarize(lines, now, windowMs) {
  const recent = lines.map((l) => JSON.parse(l)).filter((e) => e.msg === 'request' && now - Date.parse(e.time) <= windowMs);
  const errors = recent.filter((e) => e.status >= 500).length;
  const times = recent.map((e) => e.ms).sort((a, b) => a - b);
  const p95 = times.length ? times[Math.ceil(0.95 * times.length) - 1] : 0;
  return { requests: recent.length, errors, errorRate: recent.length ? errors / recent.length : 0, p95 };
}

export function decide(s, { maxErrorRate = 0.05, maxP95 = 800, minRequests = 20 } = {}) {
  if (s.requests < minRequests) return 'quiet (too few requests to judge)';
  if (s.errorRate > maxErrorRate) return 'ALERT: error rate ' + (s.errorRate * 100).toFixed(1) + '% is above ' + maxErrorRate * 100 + '%';
  if (s.p95 > maxP95) return 'ALERT: p95 ' + s.p95 + ' ms is above ' + maxP95 + ' ms';
  return 'ok';
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the rule on four sets of sample log lines',
        code: `healthy  {"requests":40,"errors":0,"errorRate":0,"p95":90} -> ok
failing  {"requests":40,"errors":10,"errorRate":0.25,"p95":80} -> ALERT: error rate 25.0% is above 5%
slow     {"requests":40,"errors":0,"errorRate":0,"p95":2500} -> ALERT: p95 2500 ms is above 800 ms
night    {"requests":6,"errors":0,"errorRate":0,"p95":80} -> quiet (too few requests to judge)`,
      },
      {
        type: 'paragraph',
        text: 'The rule reads like what a sensible person would do: look at the last few minutes, ignore the slice if there is too little to judge, shout if many requests failed, shout if the slow end is far too slow. In a real product a monitoring service runs rules like these for you, and the exact settings differ, but the thinking is the same, so you can ask an AI assistant to set them up and still judge whether they make sense. Whatever the tool, an alert should point to a short **runbook** (lesson 9): what to look at first and what the safe first fix is.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *log* is a diary your app writes by itself: what happened, when, and to whom. *JSON* is a tidy way to write a record as `{"name": value}` pairs that a program can read, so each log line is like a filled-in form instead of a sentence. A *request id* is a short code stamped on every visit, like the number on a queue ticket: if a customer gives you the number, you can find that exact visit. An *alert* is a message sent to you, like a phone notification, when a number such as “failed visits” gets too high. In the code, `.filter(...)` keeps only the lines you want, `.length` counts them, and dividing errors by requests gives the share that failed.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat telemetry as a product with a budget. Cardinality is the cost driver for metrics: a label such as user id or full URL multiplies time series without limit, so label by route template, status class and region, and keep identities in logs and traces. Sample high-volume logs but never errors, set retention by purpose (debugging versus audit), and sanitise carriage returns and line feeds in logged input to prevent log injection. Correlate across services with a trace or request id propagated in headers, and keep clocks synchronised. Prefer alerts tied to service level objectives (page on fast consumption of the error budget, ticket on slow burn) over raw thresholds, require a runbook link on every page, and review alerts that fired without a human action: each is a candidate for deletion. Monitor the monitoring: a silent logger is a failure too.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to add logging, then review its work for secrets',
        text: 'Add structured logging to this service. Requirements: one JSON line per request with time, level, requestId, method, path (without the query string), status, duration in ms and the user id if known; a requestId that is also returned in an x-request-id header; errors logged with a message and stack but never returned to the caller; and a /health endpoint. NEVER log passwords, tokens, authorization headers, request bodies or full email addresses. After you finish, search your own changes for any place where one of those could reach a log and list what you found. Then show me five real log lines from running the service.',
      },
      {
        type: 'warning',
        text: 'Debug logging written by an assistant often prints whole requests or whole objects “to help”. That is how passwords and tokens end up in a log file that more people can read than can read the database. Read every log statement it adds, and search the logs after a test run for words like “token”, “password” and “authorization”.',
      },
      {
        type: 'version',
        text: 'Checked against the OWASP Logging Cheat Sheet: log input and output validation failures, authentication and authorization failures, application errors and start-ups, and high-risk actions; use structured formats such as JSON with consistent field names; record when, where, who and what; never log passwords, session ids and access tokens, keys, connection strings or sensitive personal data; sanitise carriage returns and line feeds; restrict access to logs and monitor for logging stopping. Checked against Google Cloud’s documentation: an uptime check sends recurring HTTP, HTTPS or TCP probes from many locations and can trigger an alerting policy when the target stops responding. Other monitoring products offer the same idea under their own names.',
        checked: CHECKED,
        sources: [DOCS.owaspLogging, DOCS.gcpUptime],
      },
      {
        type: 'takeaways',
        items: [
          'Logs are the logbook, metrics the sales counter and alerts the door chime; you need all three to hear about a problem before your customers do.',
          'Write one structured JSON line per request with when, where, who, what and how long, plus a request id the caller can quote.',
          'Never log passwords, tokens, keys, connection strings or sensitive personal data, and read every log line an assistant adds.',
          'Watch a few user-facing numbers (traffic, share of failures, p95) and an outside health check.',
          'A good alert fires on a symptom, only with enough traffic to judge, and always has an action and a runbook.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-05-code-challenge-1',
          kind: 'code-challenge',
          title: 'Should this page someone?',
          prompt: 'Write `shouldAlert(statuses, maxRate, minRequests)`. `statuses` lists the HTTP status code of each recent request. Return `true` only when there are at least `minRequests` requests **and** the share of server errors (status 500 or higher) is **greater than** `maxRate`. Fewer requests than `minRequests` is too little to judge, so return `false`.',
          concept: 'alert rules',
          language: 'javascript',
          starter: 'function shouldAlert(statuses, maxRate, minRequests) {\n  // true only with enough requests and too many server errors\n}',
          tests: {
            kind: 'function',
            fn: 'shouldAlert',
            cases: [
              { label: '2 failures in 10 requests', args: [[200, 200, 200, 200, 200, 200, 200, 200, 500, 500], 0.05, 10], expected: true },
              { label: 'all failing but too few requests', args: [[500, 500, 500, 500, 500, 500], 0.05, 10], expected: false },
              { label: 'exactly at the limit does not alert', args: [[200, 200, 200, 200, 200, 200, 200, 200, 200, 500], 0.1, 10], expected: false },
              { label: 'one failure in 10 with a 5 percent limit', args: [[200, 200, 200, 200, 200, 200, 200, 200, 200, 500], 0.05, 10], expected: true },
              { label: '404s are not server errors', args: [[404, 404, 404, 404, 404, 404, 404, 404, 404, 404], 0.05, 10], expected: false, hidden: true },
            ],
          },
          solution: 'function shouldAlert(statuses, maxRate, minRequests) {\n  if (statuses.length < minRequests) return false;\n  const errors = statuses.filter((s) => s >= 500).length;\n  return errors / statuses.length > maxRate;\n}',
          hints: [
            'Decide first whether there are enough requests to judge at all.',
            'Count the statuses that are 500 or higher with `filter`, then divide by the total.',
            'Return `errors / statuses.length > maxRate`, after returning false when there are too few requests.',
          ],
          explanation: 'Two conditions make an alert useful: enough data to be meaningful, and a rate above the line. Only 5xx statuses count: a 404 or 401 is the caller’s problem, not a failure of your service.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'The log line that remembers the password',
          prompt: 'An assistant added this sign-in logging “to help with debugging”. Tap the line that puts private data into the log, then choose the fix. The call at the bottom prints the line, so you can see what ends up in the log.',
          concept: 'what never to log',
          language: 'javascript',
          code: 'function logLogin(user, password, token) {\n  console.log(JSON.stringify({ msg: \'login\', user, password, token }));\n}\nlogLogin(\'ana\', \'hunter2\', \'abc123\');',
          bugLine: 2,
          fixes: [
            { line: '  console.log(JSON.stringify({ msg: \'login\', user }));', correct: true, why: 'Records that a sign-in happened and who it was, and leaves out the password and the token.' },
            { line: '  console.log(JSON.stringify({ msg: \'login\', user, password: \'***\', token }));', correct: false, why: 'The password is masked, but the token is still written. Anyone who can read the log could use it to act as the user.' },
            { line: '  console.log(JSON.stringify({ msg: \'login\', user, token }));', correct: false, why: 'The password is gone but the access token is still in the log, and a token works like a password until it expires.' },
            { line: '  console.log(JSON.stringify({ msg: \'login\', user, password }));', correct: false, why: 'The token is gone, but the password itself is still written in plain text.' },
          ],
          tests: { kind: 'output', expected: ['{"msg":"login","user":"ana"}'] },
          hints: [
            'Look at every value placed inside the object that is logged.',
            'Which of those values would let someone else act as Ana?',
            'Keep the message and the user. Remove both the password and the token.',
          ],
          explanation: 'Logs are read by more people and kept longer than most databases, so they must never hold secrets. Log that the event happened and who it concerned, never the credentials.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-05-scenario-1',
          kind: 'scenario',
          title: 'Which alert wakes you at 3 a.m.?',
          prompt: 'You can set up one alert that pages your phone in the night for Tindahan Reminders. Which one do you choose?',
          concept: 'alert design',
          situation: 'The app is small, you are the only person on call, and at night it gets only a handful of requests a minute.',
          options: [
            { text: 'Page when the health check fails for several minutes, or when more than 5 percent of requests fail over five minutes with enough traffic to judge.', consequence: 'It fires only when customers cannot use the app. You wake up rarely, and when you do, the problem is real.', quality: 'best' },
            { text: 'Page whenever the server’s processor goes above 70 percent for a minute.', consequence: 'It fires during harmless batch jobs and every traffic spike, and you soon start ignoring your phone, including on the night that matters.', quality: 'poor' },
            { text: 'Page on every single 500 error.', consequence: 'One odd request at 3 a.m. wakes you, and a single failed retry that the app already recovered from is treated as an emergency.', quality: 'acceptable' },
          ],
          hints: [
            'Which alerts describe something a customer would notice?',
            'What happens to the alert when only a few requests arrive at night?',
            'Choose symptoms, with enough traffic to be meaningful, over internal numbers.',
          ],
          explanation: 'A page should mean a person must act now because users are hurt. Symptom-based rules with a traffic floor keep alerts rare and trustworthy, which is what makes people respond to them.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-05-q1',
        prompt: 'Why are structured JSON log lines better than sentences such as “user ana saved a reminder”?',
        choices: [
          'JSON lines are shorter, so they always use less disk space than a sentence',
          'Each field can be searched and counted, such as every 429 for one user',
          'Sentences cannot contain the user’s name, but JSON can, so the log is more complete',
          'JSON is encrypted by default, which keeps passwords safe even when they are written to it',
        ],
        answer: 1,
        explanation: 'Named fields let a tool filter and count events. The benefit is searchability, not size or secrecy; JSON is not encrypted and still must never hold secrets.',
      },
      {
        id: 'production-ai-apps-05-q2',
        prompt: 'Which of these is appropriate to write to a log?',
        choices: [
          'The full sign-in token, so the same session can be recognised later',
          'The user’s password, written once so support can compare it when they complain that sign-in fails',
          'The complete card number of a customer who tried to pay, to help investigate failed payments',
          'That a sign-in failed for the user “ana”, with the time and a request id',
        ],
        answer: 3,
        explanation: 'The event, who it concerned, when it happened and an id are useful and safe. Passwords, tokens and card numbers are secrets that must not appear in logs.',
      },
      {
        id: 'production-ai-apps-05-q3',
        prompt: 'A customer says “my reminder did not save at 10:42.” What most helps you find that exact request?',
        choices: [
          'The request id from the error (or their user and the minute), searched in structured logs',
          'The total number of requests the app handled that day',
          'A graph of the average response time over the whole month',
          'The size of the log file at that time, since a failed request always makes the file a little larger',
        ],
        answer: 0,
        explanation: 'A request id (or user plus time) points to one log line that shows what the server decided and how long it took. Totals and averages cannot identify one request.',
      },
      {
        id: 'production-ai-apps-05-q4',
        prompt: 'At night the app gets six requests in five minutes, and all six fail. Your alert rule says “page above 5 percent errors, but only with at least 20 requests”. What happens, and is it right?',
        choices: [
          'It pages you, because 100 percent errors is always an emergency whatever the traffic',
          'It never pages anybody, because the rule is broken whenever there are fewer than twenty requests in the window',
          'It stays quiet because there is too little traffic to judge; the health check covers a total outage',
          'It pages you twice, once for the errors and once for the low traffic, which doubles the chance of noticing it',
        ],
        answer: 2,
        explanation: 'A traffic floor stops single unlucky requests from waking you. Total outages are caught by the separate health check, so the two rules cover each other.',
      },
      {
        id: 'production-ai-apps-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a log?',
        choices: [
          'A diary the app writes by itself of what happened and when',
          'A password list that the app uses to let people in',
          'A picture of the app’s screen that is saved every single minute and kept for a month',
        ],
        answer: 0,
        explanation: 'A log is a written record of events, each with a time, so you can look back at what the app did when something went wrong.',
      },
      {
        id: 'production-ai-apps-05-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate adds the user id as a label on a request-count metric “so we can see per-user traffic”. What is the main problem?',
        choices: [
          'Metrics cannot hold numbers that identify a person, because that is not allowed by any metrics tool, and the label would be silently dropped',
          'Every distinct user makes a new time series, so cost and memory grow without limit; per-user detail belongs in logs',
          'The metric will count each request twice, once with the label and once without it',
          'Alerts cannot be created on a metric that has any label at all',
        ],
        answer: 1,
        explanation: 'High-cardinality labels multiply series and can overwhelm or bankrupt a metrics system. Keep labels few (route, status class) and put identities in logs and traces.',
      },
    ],
    task: {
      title: 'Make your app tell you when it is hurt',
      minutes: 20,
      steps: [
        'Take the small server from the previous lessons (or ask an AI to write one) and add one JSON log line per request with time, requestId, method, path, status, ms and user. Return the requestId in an x-request-id header.',
        'Send ten requests, some of them bad, and save the log. Search it for one status with `grep` and count the matches.',
        'Read every line of the log for anything private (tokens, passwords, personal details). Remove what you find.',
        'Write down one alert rule for your app as a sentence: the number, the threshold, the minimum traffic and what the person on call should do first.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each field of one of your log lines in plain words, and then to explain what an alert is using the example of a door chime.'] },
      { audience: { min: 'advanced' }, steps: ['Write the alert rule as a function with a unit test for each of: healthy, failing, slow and quiet-night inputs, and add a fifth test for the exact threshold boundary.'] },
    ],
  },
  {
    id: 'production-ai-apps-06',
    day: 6,
    title: 'Protecting users’ data',
    summary: 'Back data up, prove you can restore it, delete it when asked and collect no more than you need, because lost or leaked data cannot be fixed afterwards.',
    minutes: 30,
    skills: ['data-protection'],
    intro: {
      objectives: [
        'Run a backup and a restore drill and say what it proved',
        'Delete one person’s data safely and explain what still holds a copy',
        'List the privacy habits that keep a small app out of trouble when AI tools handle real data',
      ],
      why: 'Every other problem in this course can be fixed afterwards. Lost or leaked customer data cannot. A tested backup and a few privacy habits are the cheapest protection a small app has.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Ate Lorna’s store has an old notebook where she writes who owes what. If the notebook burns, she does not just lose a record: she loses the customers’ trust and a lot of money. Your app is a notebook too, holding phone numbers, balances and notes that people handed you in good faith. There are two promises to keep. **Do not lose it**: if the data is damaged, deleted by mistake, or the server disappears, you can get it back. **Do not leak or hoard it**: you collect only what you need, protect it, and remove it when asked. This lesson takes the first promise with a real drill, then the second with a few habits.',
      },
      { type: 'heading', text: 'A backup you have never restored is a hope' },
      {
        type: 'paragraph',
        text: 'A **backup** is a copy of your data kept somewhere safe so you can return to an earlier moment. The uncomfortable fact is that many backups fail quietly: the job ran but saved an empty file, or saved the wrong folder, or needs a key nobody has. So a backup only counts once you have performed a **restore drill**: taking the backup, bringing it back to life somewhere safe, and checking that the data is really there. Two numbers describe how good your plan is. The **recovery point** is how much recent data you can afford to lose (if you back up nightly, up to a day). The **recovery time** is how long you can be down while you restore. Pick them on purpose.',
      },
      {
        type: 'paragraph',
        text: 'We built a small SQLite database for the store (three customers, four reminders) and ran the whole drill, including the kind of accident an AI agent or a tired developer really causes: a `delete` with no `where` clause. This is the script and its real output (SQLite 3.54).',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'The drill: backup, accident, restore into a new file, verify, switch over',
        code: `# 1. Take a backup with SQLite's own command (safe while the app is running)
sqlite3 app.db ".backup backup-2026-11-14.db"

# 2. The accident: a delete with no where
sqlite3 app.db "delete from reminders;"

# 3. Restore into a NEW file first, never over the broken one, and check it
cp backup-2026-11-14.db restored.db
sqlite3 restored.db "pragma integrity_check;"
sqlite3 restored.db "select 'customers', count(*) from customers union all select 'reminders', count(*) from reminders;"

# 4. Spot-check a real row, then switch over
sqlite3 restored.db "select c.name, r.due, r.note from reminders r join customers c on c.id=r.customer_id where r.note='tricycle loan';"
mv app.db app-broken.db && mv restored.db app.db`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the drill',
        code: `--- 2. The accident
reminders_left: 0
--- 3. Restore drill
ok
customers|3
reminders|4
foreign key problems: 0
--- 4. Spot-check
Mang Jun|2026-12-03|tricycle loan
reminders_now: 4`,
      },
      {
        type: 'paragraph',
        text: 'Look at what the drill proved: the backup file opens (`integrity_check` says `ok`), the counts match what we put in (3 customers, 4 reminders), nothing refers to a missing customer, and a real row we know about is there. Notice the order, too. We restored into a **new** file and checked it **before** replacing the broken one, so if the backup had been bad, we would still have had the original to work with. And we kept the broken file instead of deleting it, since it may hold something the backup lacks.',
      },
      {
        type: 'table',
        headers: ['Rule', 'Why'],
        rows: [
          ['Automate it, and keep several copies, not just the latest', 'People forget; and a bad day may not be noticed for a while, so you want an older copy too'],
          ['Store a copy somewhere other than the machine it protects', 'A disk failure, a deleted server or a stolen laptop takes both the data and the backup'],
          ['Protect backups like the data: restricted access, encrypted where your platform offers it', 'A backup file is a complete copy of everything people trusted you with'],
          ['Run a restore drill on a schedule and after every change to how you back up', 'The drill is the only proof that the backup works'],
          ['Back up before a risky change, such as a migration or a bulk edit', 'Many “accidents” are planned work that went wrong'],
        ],
        caption: 'Five backup rules.',
      },
      {
        type: 'warning',
        text: 'Never give an AI coding agent write access to your live database “to clean up” or “to fix the data”. An agent can run a perfectly reasonable command against the wrong place. Let it work on a copy (a restored backup is perfect for that), read the exact statements it proposes, and run the real change yourself, after taking a backup.',
      },
      { type: 'heading', text: 'Deleting data, and collecting less' },
      {
        type: 'paragraph',
        text: 'The second promise starts with a question that AI-built apps rarely ask: do we need this at all? Collect only what the app needs, keep it only as long as it is needed, and be able to remove one person’s data when they ask. Deleting should be one transaction so it either fully happens or does not happen at all. Here is the real run of deleting one customer’s data (Mang Jun, id 2) and what is left afterwards.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: deleting one customer, then checking the backup',
        code: `$ sqlite3 app.db "begin; delete from reminders where customer_id=2; delete from customers where id=2; commit;"
customers|2
reminders|3
--- the backup file still holds Mang Jun:
Mang Jun`,
      },
      {
        type: 'paragraph',
        text: 'The live data is clean, but the old backup still contains him. That is normal, and honest apps say so in plain words: “backups are kept for N days and then deleted, and a deleted person is never restored from them”. Write that rule down, then make your restore routine follow it. The same care applies to AI tools. Real customer data should not be pasted into a prompt or sent to an outside AI service unless you have checked what that service does with it (its data and retention settings) and your customer’s agreement allows it; use made-up or masked data while building. Laws also apply: many places have data privacy laws, such as the Philippines’ Data Privacy Act of 2012 and the European Union’s GDPR. This course cannot give legal advice, so for a real product ask a qualified local professional which rules cover you.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *database* is the organised place where the app keeps everything it remembers. A *backup* is a photocopy of it kept somewhere else. A *restore* is putting the photocopy back. A *transaction* is a group of steps that happen all together or not at all, like paying and getting your receipt: you never want to be charged and given nothing. In the drill, `.backup` makes the copy, `delete from reminders;` is the accident (it has no condition, so it deletes every row), `pragma integrity_check;` asks the database to inspect itself, and `count(*)` counts rows so you can compare with what you expect. Rows are the lines of a table, like lines in the notebook.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** State the recovery point and recovery time objectives per data store and test against them. Nightly dumps give a day of exposure; shorten it with continuous log archiving and point-in-time recovery where the engine supports it, and keep at least one copy offsite or in an account that production credentials cannot delete (immutable or write-once storage), because ransomware and a compromised admin delete backups first. Automate the restore drill, run it against a scratch instance in CI or on a schedule, and alert when it fails or the latest backup is older than the objective. Keep encryption keys apart from the data they protect. Design deletion up front (soft delete versus erasure, cascades, derived stores, search indexes, logs, analytics) and define what happens in backups and when a restore replays a deleted person. Classify data, minimise it, and put access rules next to it (row-level policies, least-privilege roles).',
      },
      {
        type: 'prompt',
        label: 'Ask AI to write the drill, and to show it working',
        text: 'Write a bash script that (1) takes a backup of my SQLite database with the sqlite3 .backup command into a dated file, (2) keeps only the newest 7 backups, (3) restores the newest backup into a NEW scratch file (never over the live database), (4) runs pragma integrity_check and prints the row count of every table in both the live and the restored file, and (5) exits with an error code if any count differs or the check is not "ok". Create a sample database, run the script, then deliberately run a delete without a where on a copy and show that the restore brings the rows back. Show me the real output of every run.',
      },
      {
        type: 'version',
        text: 'Checked against the SQLite command-line shell documentation (SQLite 3.54 was used for the drill): `.backup ?DB? FILE` copies the database to a file, `.restore ?DB? FILE` restores content from a file, and `.dump` writes the database as SQL text that can be replayed into another database. The `.backup` and `.save` commands are disabled by the shell’s `--safe` option. Other databases have their own tools (for example, point-in-time recovery in managed services); the drill is the same: take, restore somewhere safe, verify.',
        checked: CHECKED,
        sources: [DOCS.sqliteCli],
      },
      {
        type: 'takeaways',
        items: [
          'A backup you have never restored is a hope. A restore drill (restore, check integrity, compare counts, spot-check a row) is the proof.',
          'Restore into a new file first, verify it, and keep the broken original until you are sure.',
          'Keep several backups, store a copy elsewhere, protect them like the data, and back up before risky changes.',
          'Do not give AI agents write access to live data; work on a restored copy and run the real change yourself.',
          'Collect little, delete in one transaction when asked, say how long backups live, and do not paste real customer data into AI tools you have not checked.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-06-arrange-1',
          kind: 'arrange',
          title: 'The restore drill, in order',
          prompt: 'Put the steps of a safe restore drill in a sensible order, first at the top.',
          concept: 'restore drill',
          language: 'text',
          solution: [
            'Take a backup of the live database',
            'Copy the backup into a new scratch file',
            'Run the integrity check on the scratch file',
            'Compare the row counts with what you expect',
            'Spot-check one real record you know about',
            'Only then switch the app over, keeping the old file',
          ],
          reasons: [
            'Everything starts with a copy you can fall back on.',
            'You never restore over the live file, because a bad backup would then destroy your last chance.',
            'The check tells you whether the file is intact before you trust it.',
            'Counts reveal an empty or partial backup that still “opens”.',
            'A real record proves the data makes sense, not just that numbers match.',
            'Switching is last, and keeping the old file keeps the way back open.',
          ],
          hints: [
            'What must exist before you can restore anything?',
            'Which steps check the copy, and which step uses it?',
            'The final step is the one that cannot easily be undone, so it comes after every check.',
          ],
          explanation: 'Take, copy, check, compare, spot-check, switch. Every step before the switch is cheap and reversible, and the switch itself leaves the old file in place.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'Delete one customer, not all of them',
          prompt: 'A customer asked to have their data removed. An assistant wrote this transaction, but one line will delete far more than it should. Tap the faulty line, then choose the fix.',
          concept: 'scoped deletes',
          language: 'sql',
          code: '-- remove customer 2 and their reminders, all or nothing\nbegin;\ndelete from reminders;\ndelete from customers where id = 2;\ncommit;',
          bugLine: 3,
          fixes: [
            { line: 'delete from reminders where customer_id = 2;', correct: true, why: 'Removes only that customer’s reminders, matching the customer row that the next line deletes.' },
            { line: 'delete from reminders where id = 2;', correct: false, why: 'This compares the reminder’s own id with 2, so it deletes one unrelated reminder and leaves the customer’s reminders behind.' },
            { line: 'delete from reminders where customer_id is not null;', correct: false, why: 'Every reminder has a customer id, so this still deletes every reminder, just with a condition that looks careful.' },
            { line: 'delete from reminders where note is not null;', correct: false, why: 'Nearly every reminder has a note, so this too removes almost everything, and it does not mention the customer at all.' },
          ],
          hints: [
            'Which line has no `where` clause, so it applies to every row?',
            'What column links a reminder to its customer?',
            'The condition should match the same customer as the next line, using the customer’s id.',
          ],
          explanation: 'A delete without a condition removes every row. The fix ties the condition to the customer the request is about, and the surrounding transaction makes the two deletes succeed or fail together.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-06-code-challenge-1',
          kind: 'code-challenge',
          title: 'Which old backups can go?',
          prompt: 'Write `expiredBackups(dates, keep)`. `dates` is a list of backup dates written like `"2026-11-14"` (in any order) and `keep` is how many of the **newest** backups to keep. Return the dates to delete, oldest first. Text dates in this form sort correctly as plain text.',
          concept: 'backup retention',
          language: 'javascript',
          starter: 'function expiredBackups(dates, keep) {\n  // the older backups that should be deleted, oldest first\n}',
          tests: {
            kind: 'function',
            fn: 'expiredBackups',
            cases: [
              { label: 'keep the newest two of four', args: [['2026-11-12', '2026-11-14', '2026-11-13', '2026-11-10'], 2], expected: ['2026-11-10', '2026-11-12'] },
              { label: 'fewer backups than the limit', args: [['2026-11-12', '2026-11-14'], 5], expected: [] },
              { label: 'no backups at all', args: [[], 3], expected: [] },
              { label: 'keep none', args: [['b', 'a'], 0], expected: ['a', 'b'], hidden: true },
            ],
          },
          solution: 'function expiredBackups(dates, keep) {\n  const sorted = dates.slice().sort();\n  return sorted.slice(0, Math.max(0, sorted.length - keep));\n}',
          hints: [
            'Sort a copy of the dates so the oldest come first.',
            'If you keep `keep` of them, the ones to delete are all the others at the start of the list.',
            'Return sorted.slice(0, Math.max(0, sorted.length - keep)).',
          ],
          explanation: 'Sorting puts the newest dates at the end, so everything before the last `keep` entries is expired. Math.max stops the count going negative when there are fewer backups than you keep.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-06-q1',
        prompt: 'When does a nightly backup count as real protection?',
        choices: [
          'When the backup job reports “success” every single night, with no errors in its own log',
          'When the backup file is stored on the same disk as the database, so that it is quick to reach in an emergency',
          'When the file is encrypted and its name carries the date, so that it can be told apart from older ones',
          'When you have restored from it and checked the result',
        ],
        answer: 3,
        explanation: 'Success messages, location and file names do not show that the data can be recovered. Only a restore, followed by checks, proves the backup works.',
      },
      {
        id: 'production-ai-apps-06-q2',
        prompt: 'A customer asked you to delete their data, and last week’s backup still holds it. What is the sensible position?',
        choices: [
          'Edit last week’s backup file by hand so the person is removed, even if that breaks its integrity',
          'Delete from live data now, say how long backups are kept, and never restore that person from them',
          'Tell the customer that deleting is impossible because every backup contains a copy of everything',
          'Keep the data live as well, and only hide it in the app, since a deleted row might be needed for a later restore',
        ],
        answer: 1,
        explanation: 'Live data is deleted at once; backups age out on a stated schedule and a restore never brings the person back. Editing backups corrupts them and hiding data is not deleting it.',
      },
      {
        id: 'production-ai-apps-06-q3',
        prompt: 'In the drill, why did we restore into a new file and check it before replacing the broken database?',
        choices: [
          'Restoring directly over the old file would make the live app slower for a while',
          'SQLite cannot restore into the same file name as an existing database under any circumstances',
          'The integrity check only works on files that have a new name and a new date',
          'A bad backup is found while the original still exists to fall back on',
        ],
        answer: 3,
        explanation: 'If the restored copy turns out to be empty or damaged, the broken original is still there, so you have lost nothing extra. Restoring over it removes your last option.',
      },
      {
        id: 'production-ai-apps-06-q4',
        prompt: 'An AI coding agent offers to “clean up the duplicate customers” directly in the live database. What is the safest way to use it?',
        choices: [
          'Let it run directly, since it can describe the commands it plans to execute before it runs them',
          'Give it admin rights to the live database but ask it to be careful and to undo any change that looks wrong',
          'Have it work on a restored copy, read its statements, then run the real change yourself',
          'Refuse to use agents with data at all, because any agent will always damage whatever data it can reach',
        ],
        answer: 2,
        explanation: 'A copy makes mistakes cheap, reading the statements keeps you in control, and a backup before the real run gives you a way back. Total refusal or full trust are both worse.',
      },
      {
        id: 'production-ai-apps-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does “restore from a backup” mean?',
        choices: [
          'Install the app again from the app store on a new phone, so that it starts again with no old data',
          'Put the saved copy of your data back, so the app has its information again',
          'Make the app run faster by clearing out old data',
        ],
        answer: 1,
        explanation: 'A backup is a saved copy and restoring is putting that copy back in use. It is the whole reason for making the copy.',
      },
      {
        id: 'production-ai-apps-06-q6',
        audience: { min: 'advanced' },
        prompt: 'Your only protection is a nightly backup. What recovery point does that give you, and how can it be improved?',
        choices: [
          'Up to a day of data can be lost; archive the database log continuously or back up more often',
          'No data can ever be lost, because the backup happens every night without exception',
          'One week of data can be lost; the only improvement is to buy a larger disk',
          'Exactly one hour of data can be lost, which is the standard exposure for any nightly job',
        ],
        answer: 0,
        explanation: 'With a nightly backup, a failure just before the next run loses almost a day. Continuous log archiving (point-in-time recovery) or more frequent backups shrinks the exposure.',
      },
    ],
    task: {
      title: 'Run your own restore drill',
      minutes: 20,
      steps: [
        'Create a small SQLite database (or ask an AI to make one) with two tables and a few rows, using the sqlite3 command. Note the row counts.',
        'Take a backup with `.backup`, then ruin the original with a `delete` that has no `where`. Look at the empty table.',
        'Restore into a new file, run `pragma integrity_check;`, compare the row counts, and spot-check one real row. Only then replace the broken file.',
        'Write three lines for your own app: where its data lives, where its backup lives, and the date you will next run a drill.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain what each line of the drill script does using the notebook comparison, and to say in your own words why the new-file step matters.'] },
      { audience: { min: 'advanced' }, steps: ['Wrap the drill in a script that exits non-zero when any count differs, run it from CI on a schedule, and add a check that fails if the newest backup is older than your stated recovery point.'] },
    ],
  },
  {
    id: 'production-ai-apps-07',
    day: 7,
    title: 'Automated checks on every change',
    summary: 'A robot runs the same checks on every change: syntax, tests and a secret scan, and the main branch refuses anything that fails.',
    minutes: 30,
    skills: ['automated-checks'],
    intro: {
      objectives: [
        'Read a CI workflow file and say what each part does',
        'Make a check mean something: show it passing, and show it failing when the code is broken',
        'Connect the checks to the main branch so an unchecked change cannot slip in',
      ],
      why: 'AI produces changes faster than you can read them. A robot that runs the same checks on every one, without getting tired or being talked out of it, is the cheapest reviewer you will ever have.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A bakery that sells to the public does not rely on the baker’s mood. Before each tray goes out, someone ticks the same list: weighed, tasted, labelled. **Continuous integration**, usually shortened to **CI**, is that list for software. Every time someone proposes a change, a computer in the cloud checks out the code, runs a fixed set of checks, and reports pass or fail. You wrote none of the tests on a busy afternoon, and an AI agent made eleven changes while you were at lunch. The robot checks all of them the same way. That is the point: your discipline stops depending on your energy.',
      },
      {
        type: 'paragraph',
        text: 'On GitHub, CI is a text file in your repository under `.github/workflows/`, in a format called **YAML**, a way of writing settings with indentation. Here is the real workflow for Tindahan Reminders. We checked it with `actionlint`, a tool that finds mistakes in workflow files, and then ran each step by hand on our own computer.',
      },
      {
        type: 'code',
        language: 'yaml',
        label: '.github/workflows/ci.yml',
        code: `name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  checks:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - name: Install exactly what the lockfile says
        run: npm ci
      - name: Syntax check
        run: npm run check
      - name: Tests
        run: npm test
      - name: Look for secrets pasted into code
        run: |
          if grep -rEn "(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|BEGIN (RSA )?PRIVATE KEY)" --include='*.mjs' --include='*.json' --exclude-dir=node_modules .; then
            echo "A secret-looking string is in the code. Remove it and rotate it."
            exit 1
          fi`,
      },
      {
        type: 'list',
        items: [
          '`on:` says when it runs: for every pull request, and for every push to `main`.',
          '`permissions: contents: read` gives the job only the right to read the code. Anything it does not need, it does not get, so a mistake or a hijacked step cannot change your repository.',
          '`concurrency` with `cancel-in-progress` stops older runs of the same branch when a newer push arrives, saving time and money.',
          '`timeout-minutes` makes a stuck job end instead of running for hours.',
          '`npm ci` installs exactly the versions in the lockfile, so CI tests what you will ship, not whatever is newest today.',
          'The last step is a deliberately simple secret scan: it fails the job if something shaped like a key is in the code.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real results of running those steps locally (Node.js 22, actionlint)',
        code: `$ actionlint .github/workflows/ci.yml
(no output: no problems found)

$ npm run check
> node --check server.mjs

$ npm test
ok 1 - validate accepts a good reminder and trims the note
ok 2 - validate rejects a made-up date
ok 3 - the limiter blocks the 4th request in a window and lets the next window in
# tests 3
# pass 3
# fail 0`,
      },
      { type: 'heading', text: 'A check must be able to fail' },
      {
        type: 'paragraph',
        text: 'A green tick is only worth something if the check can turn red. AI-written tests are famous for passing no matter what, because they test the code against itself. So prove each check by breaking things on purpose, which is what we did next. First we planted a fake key-shaped string in a file and ran the secret scan. Then we edited the rate limiter to be wrong by one (`>` instead of `>=`) and ran the tests. This is a hand-made version of *mutation testing*, and it takes a minute.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the same checks, with something deliberately broken',
        code: `$ echo "const KEY = 'AKIAABCDEFGHIJKLMNOP';" > leak.mjs   # then the secret-scan step
leak.mjs:1:const KEY = 'AKIAABCDEFGHIJKLMNOP';
A secret-looking string is in the code. Remove it and rotate it.
(the step exits with 1, so the job fails)

$ npm test      # with the limiter changed to "entry.count > limit"
not ok 3 - the limiter blocks the 4th request in a window and lets the next window in
# pass 2
# fail 1`,
      },
      {
        type: 'paragraph',
        text: 'Both checks failed when they should. The course AI-Assisted Testing and Quality Assurance goes deeper on writing tests that mean something. Here the lesson is the habit: before you trust a green tick, see it go red once.',
      },
      { type: 'heading', text: 'Make the main branch obey the robot' },
      {
        type: 'paragraph',
        text: 'Checks that people can ignore will be ignored on the day they are in a hurry. GitHub lets you protect the `main` branch so that a change can only get in through a **pull request** (a proposed change that others can review), and only after the checks you choose, the *required status checks*, have passed. GitHub now offers *rulesets* as a newer way to set the same kind of rule. Two companions help the robot stay current: **Dependabot** opens pull requests that update your dependencies (so known security fixes arrive as small, checkable changes), and **push protection** blocks a push that contains a recognised secret before it reaches the repository. Also pin what your workflow trusts: a third-party action referenced by a tag can be moved or changed by its owner, so for important workflows pin it to a full commit id, and keep the permissions of your job as small as possible.',
      },
      {
        type: 'code',
        language: 'yaml',
        label: '.github/dependabot.yml: weekly pull requests for npm packages and for the actions themselves',
        code: `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"`,
      },
      {
        type: 'paragraph',
        text: 'Finally, an AI assistant can also be one of the checks. Claude Code has an official GitHub Action that can review pull requests, or respond when someone writes `@claude` in a comment; other tools offer similar review bots. Treat such a reviewer as a tireless first reader that catches some things, not as an approver: give it only the permissions it needs, keep its key in a repository secret (never in the file), cap its work, and keep your required checks and a human decision for anything that matters. The course AI-Assisted Code Review covers how to use AI reviewers well.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *repository* is the folder where your project and its history live on GitHub. A *pull request* is a message saying “please add this change”, with the change attached so people can look. *CI* is a robot that wakes up whenever that happens, tries your project, and writes “pass” or “fail” next to the request. *YAML* is just a way of writing a list of settings where the indentation shows what belongs to what. In the file above, each `- name:` line begins one step, and `run:` is the command the robot types for that step. A *lockfile* records the exact version of every library you use, so everyone, robot included, gets the same ones.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Keep CI fast and trustworthy: a flaky test is worse than none because it trains the team to rerun, so quarantine and fix it. Run cheap checks first, cache dependencies, and split slow suites; enforce required checks through rulesets or a merge queue so the tested merge result is what lands. Pin third-party actions to a full commit SHA (or use a lockfile approach where available), default the token to read-only and widen it per job, and prefer short-lived credentials (OIDC federation to your cloud) to long-lived secrets stored in the repository. Remember that repository secrets are readable by anyone who can write a workflow, so scope them by environment and require approval for production. Build, test and scan the same artifact you deploy, treat the AI reviewer’s findings as input to a human decision, and track change-failure rate and lead time to see whether the checks help.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to write the workflow, then check it can fail',
        text: 'Create a GitHub Actions workflow for this Node.js project that runs on every pull request and on pushes to main. Steps: install with npm ci, run the syntax check, run the tests, and fail if a secret-looking string (an AWS access key id, a private key header or an sk- style key) is found in the code. Use permissions: contents: read at the top, a concurrency group that cancels older runs, and a 10 minute timeout. Do not use secrets that I have not named. Then run actionlint on the file, run every step locally, and show me the real output. Finally, break something on purpose (a test, and a planted fake key) and show me each check failing.',
      },
      {
        type: 'warning',
        text: 'Be careful when an assistant “fixes” a failing check by editing the check: deleting a test, loosening a threshold, adding `|| true` to a command or marking a step as allowed to fail. A red check is information. Ask why it is red and fix the code. If the check itself is wrong, change it in a separate, clearly explained commit.',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**If you have built a few apps.** Add the CI file in the very first pull request of a project, before more features arrive: starting with three checks is far easier than adding them to fifty files. Keep the commands as scripts in package.json so that CI and your laptop run exactly the same thing.',
      },
      {
        type: 'version',
        text: 'Checked against GitHub’s documentation and the actions’ own pages: workflow files support a top-level `permissions` key (any permission you leave out is set to none once you set one) and `concurrency` with `cancel-in-progress`; the README usage examples of actions/checkout and actions/setup-node show `@v7`, so check each action’s releases page for the current major version when you copy a workflow. GitHub documents required status checks and rulesets (rulesets can overlap, while only one branch protection rule applies to a branch), Dependabot version updates configured in `.github/dependabot.yml`, and recommends pinning actions to a full-length commit SHA and defaulting the token to read-only. Claude Code’s GitHub Action responds to @claude mentions or runs a prompt, takes a repository secret for its credential, and notes that on public repositories GitHub withholds secrets from runs triggered by fork pull requests. The test runner `node --test` is documented as stable.',
        checked: CHECKED,
        sources: [DOCS.ghWorkflow, DOCS.ghCheckout, DOCS.ghSetupNode, DOCS.ghProtectedBranches, DOCS.ghDependabot, DOCS.ghSecureUse, DOCS.ccActions, DOCS.nodeTest],
      },
      {
        type: 'takeaways',
        items: [
          'CI is a robot that runs the same checks on every change; it replaces willpower with a routine.',
          'Read a workflow by its parts: when it runs, what it may touch (permissions), and the steps in order.',
          'A check only means something if you have seen it fail: plant a fake key, break the limiter, watch it go red.',
          'Make the main branch obey: pull requests plus required status checks, with Dependabot and push protection as helpers.',
          'An AI reviewer is a useful first reader, never the approver; never let anyone “fix” a failing check by weakening it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-07-arrange-1',
          kind: 'arrange',
          title: 'The steps of a CI job',
          prompt: 'Put the steps of the CI job in a sensible order, first at the top.',
          concept: 'CI job order',
          language: 'text',
          solution: [
            'Check out the code',
            'Set up the right version of Node.js',
            'Install exactly what the lockfile says',
            'Run the syntax check',
            'Run the tests',
            'Scan for secrets in the code',
          ],
          alternatives: [
            ['Check out the code', 'Set up the right version of Node.js', 'Install exactly what the lockfile says', 'Scan for secrets in the code', 'Run the syntax check', 'Run the tests'],
            ['Check out the code', 'Set up the right version of Node.js', 'Install exactly what the lockfile says', 'Run the syntax check', 'Scan for secrets in the code', 'Run the tests'],
          ],
          reasons: [
            'Nothing can run until the robot has a copy of the code.',
            'The tools need the right Node.js version before anything is installed.',
            'Dependencies must be installed before any step that uses them.',
            'The cheapest check goes early so a typo fails in seconds.',
            'Tests need the code and its libraries to be ready.',
            'The scan reads files only, so it can run at any point after checkout.',
          ],
          hints: [
            'What must exist before any command can run?',
            'Installing libraries comes after the right tools are in place and before tests.',
            'The quick, cheap checks can go in any order after installing, but never before checkout.',
          ],
          explanation: 'Checkout, tool setup and install must come first and in that order. The three checks after them are independent of each other; putting the cheap ones early just gives faster feedback.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'A workflow with too much power',
          prompt: 'An assistant generated this workflow. It only runs tests, yet it hands the job permission to change the repository. Tap the line that is too generous, then choose the fix that gives the job only what it needs.',
          concept: 'least privilege',
          language: 'yaml',
          code: 'name: CI\non: [push]\npermissions: write-all\njobs:\n  checks:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v7\n      - run: npm test',
          bugLine: 3,
          fixes: [
            { line: 'permissions: { contents: read }', correct: true, why: 'The job can read the code to check it out and nothing else, which is all that a test run needs.' },
            { line: 'permissions: read-all', correct: false, why: 'Better than write-all, but it still grants read access to everything, which this job does not need.' },
            { line: 'permissions: {}', correct: false, why: 'This removes every permission including reading the repository, which the checkout step needs, so the job can fail on a private repository.' },
            { line: 'permissions: { contents: write }', correct: false, why: 'This lets the job change repository contents, which a test run should never need.' },
          ],
          hints: [
            'Which words in the file say what the job is allowed to do?',
            'What is the least a test job needs to do with the repository?',
            'Allow reading the repository contents and nothing more.',
          ],
          explanation: 'The token a workflow receives can be misused by a buggy or compromised step, so give it the smallest permission that works. Reading contents is enough for checkout and tests.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-07-match-1',
          kind: 'match',
          title: 'Which check would have caught it?',
          prompt: 'Each story is a mistake that reached production. Match it to the automated check that would have stopped it.',
          concept: 'what each check catches',
          labels: { terms: 'What reached production', meanings: 'The check that would have stopped it' },
          pairs: [
            { term: 'A developer pasted a live API key into a config file and pushed it', definition: 'A secret scan in CI, plus push protection', note: 'Scanning for key-shaped text is exactly the job of this check.' },
            { term: 'A rate-limit change meant the fourth request was let through instead of blocked', definition: 'A unit test that fails when the limiter is wrong', note: 'The behaviour was wrong, which is what a test with expected results catches.' },
            { term: 'A library the app depends on had a published security fix that nobody applied', definition: 'Dependabot update pull requests', note: 'Version updates arrive as small pull requests that the other checks can then test.' },
            { term: 'An urgent change was merged straight to main with no checks at all', definition: 'A required status check on the main branch', note: 'Branch rules are what turn checks from advice into a gate.' },
          ],
          hints: [
            'Ask what kind of thing went wrong: text in a file, behaviour, an outdated library, or the process itself.',
            'The last story is about the process, not the code.',
            'A check that compares behaviour against expected results is a test.',
          ],
          explanation: 'Each tool covers one kind of failure, which is why CI has several steps. The branch rule is different: it makes every other check unavoidable.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-07-q1',
        prompt: 'Why does the workflow use `npm ci` instead of `npm install`?',
        choices: [
          'It is faster because it skips downloading the libraries and uses only the ones already on the robot’s computer',
          'It lets the robot choose the newest version of every library, so that the tests always run against the latest code',
          'It installs exactly the versions recorded in the lockfile, so CI tests what you will ship',
          'It removes all the tests from the project so the build completes faster for the person waiting',
        ],
        answer: 2,
        explanation: 'A lockfile fixes every dependency version. Installing exactly from it means a change in CI behaves the same as on any other machine, instead of drifting with new releases.',
      },
      {
        id: 'production-ai-apps-07-q2',
        prompt: 'What does making a check a “required status check” on the main branch do?',
        choices: [
          'A change cannot be merged until that check has passed',
          'The check runs twice, once before the merge and once after the merge is done',
          'The check also runs on the developer’s computer when they type a command in the terminal, before they push',
          'The check is shown in a different colour in the list of runs so that people notice it',
        ],
        answer: 0,
        explanation: 'Required status checks block merging until they pass. Without this, a check is only a suggestion that people can skip when in a hurry.',
      },
      {
        id: 'production-ai-apps-07-q3',
        prompt: 'You deliberately made the rate limiter wrong and the test suite turned red. What does that show?',
        choices: [
          'The tests are too strict and will block good changes whenever someone edits that file',
          'The rate limiter should not have any tests, since a test that fails is just a nuisance',
          'The CI robot is broken, because a healthy robot would have fixed the limiter itself',
          'The test can fail, so a green result for the real code actually means something',
        ],
        answer: 3,
        explanation: 'A test that cannot fail proves nothing. Seeing it fail on broken code shows it checks the behaviour, so its passing on the real code is meaningful.',
      },
      {
        id: 'production-ai-apps-07-q4',
        prompt: 'A job only checks out the code and runs tests. Which permissions setting is the best fit?',
        choices: [
          'write-all, so that nothing the job needs can ever be blocked',
          'contents: read, giving the job only the right to read the repository',
          'read-all, since reading everything is safer than writing anything',
          'No permissions line at all, because workflows never have access to the repository',
        ],
        answer: 1,
        explanation: 'Least privilege means granting only what the job needs. Reading repository contents is enough for checkout and tests; the broader settings give a buggy or hijacked step more power than necessary.',
      },
      {
        id: 'production-ai-apps-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is CI?',
        choices: [
          'A special kind of computer that only developers are allowed to use, and that runs the finished app',
          'A password system that keeps strangers out of your app',
          'A robot that runs the same checks on every change and writes pass or fail next to it',
        ],
        answer: 2,
        explanation: 'CI is an automatic checker. Every time someone proposes a change it runs the same list of checks, so the result does not depend on anyone remembering to do it.',
      },
      {
        id: 'production-ai-apps-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your workflow uses a popular third-party action referenced as `@v3`. Why do security guides recommend pinning it to a full commit SHA for sensitive workflows?',
        choices: [
          'A tag can be moved by the action’s owner, so a backdoor could arrive without any change to your file',
          'A commit SHA makes the action run faster than a tag does, because the code is cached on the runner for later',
          'Tags are not allowed in workflow files, and only commit ids can be used',
          'Pinning to a SHA means the action will keep updating itself to the newest release',
        ],
        answer: 0,
        explanation: 'GitHub’s hardening guidance says a full-length commit SHA is the way to pin an action to a specific, unchangeable version, whereas a tag can be moved. The trade is that you update the SHA deliberately, which Dependabot can help with.',
      },
    ],
    task: {
      title: 'Put a robot in front of your project',
      minutes: 20,
      steps: [
        'In a small Node.js project (or one an AI generates for you), add a test with `node --test` for one function, and a `check` script using `node --check`. Run both locally.',
        'Ask an AI assistant to write the CI workflow from this lesson, run `actionlint` on it (install it with your package manager if needed) and run each step locally.',
        'Prove two checks can fail: plant a fake key-shaped string and run the secret scan, and break a function on purpose and watch the test fail. Undo both.',
        'If your project is on GitHub, add the workflow, open a pull request and look for the result. In the repository settings, find where required status checks are set up.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each line of the workflow file as if you had never seen YAML, and to say in one sentence what would go wrong if the `permissions` line were missing.'] },
      { audience: { min: 'advanced' }, steps: ['Pin the two actions to full commit SHAs with a trailing comment naming the version, add the Dependabot file so the pins stay current, and write down which of your secrets are readable by anyone who can edit a workflow.'] },
    ],
  },
  {
    id: 'production-ai-apps-08',
    day: 8,
    title: 'A release routine you trust',
    summary: 'Release small, take a way back first, prove the live app works with a smoke test, watch it for a few minutes, and decide to keep or roll back by a rule you wrote earlier.',
    minutes: 28,
    skills: ['release-routine'],
    intro: {
      objectives: [
        'Write a release routine with a before, a during and an after',
        'Run a smoke test that decides, by its exit code, whether to keep or roll back',
        'Make a database change that can be undone, and measure whether your routine is improving',
      ],
      why: 'When AI lets you change an app ten times a day, “just deploy it” stops being safe. A boring routine you trust, with a way back decided in advance, is what lets you ship often without gambling each time.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Pilots do not take off on a feeling. Before every flight, the same checklist is read aloud, even by pilots who have flown ten thousand times, because the checklist does not get tired or distracted. A **release routine** is that checklist for putting a new version of your app in front of real users. It sounds dull, and that is the goal. A release should be so routine that it is boring, which is only possible if the dangerous decisions (is it working? do we go back?) were made calmly in advance, not at 11 p.m. with customers complaining.',
      },
      {
        type: 'paragraph',
        text: 'Four ideas make a routine trustworthy. **Release small**: a change with ten lines has few places to hide a problem and is easy to undo, while a change with ten thousand lines is a gamble, and AI agents can easily produce those. **Do the same steps every time**, so you never rely on remembering. **Have a way back before you go**: a rollback you could do right now, and a backup if data is involved. **Watch after you ship**: a release is not finished when the deploy button goes green, but when the app has behaved well for a few minutes under real use.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The routine as a loop. The decision at the end is made by a rule written before the release, not by a feeling during it.',
        source: `flowchart TD
  A[Checks are green on main] --> B[Backup taken if data changes]
  B --> C[Release the small change]
  C --> D[Smoke test the live app]
  D -->|pass| E[Watch logs and alerts for 15 minutes]
  D -->|fail| R(Roll back, then investigate)
  E -->|healthy| K(Keep it, write the release note)
  E -->|alert or errors| R`,
      },
      { type: 'heading', text: 'The smoke test: let a script decide' },
      {
        type: 'paragraph',
        text: 'A **smoke test** is a short script that runs against the live app right after a release and checks the few things that matter most. The name comes from electronics: switch it on and see whether smoke comes out. Keep it tiny and honest. It is not your whole test suite; it is the question “is the live app alive and still doing its most important jobs?” Its result is an **exit code**: 0 means pass, and anything else means fail, so a script (or a person) can act on it without reading anything. Here is the one for Tindahan Reminders.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'smoke.mjs: three checks against a live address, exit code 1 means roll back',
        code: `const [base, token] = process.argv.slice(2);
const checks = [
  ['health answers', async () => (await fetch(base + '/health')).status === 200],
  ['signed-out write is refused', async () => (await fetch(base + '/reminders', { method: 'POST', body: '{}' })).status === 401],
  ['signed-in write is saved', async () => {
    const res = await fetch(base + '/reminders', { method: 'POST', headers: { authorization: 'Bearer ' + token }, body: JSON.stringify({ note: 'smoke test', due: '2026-12-31' }) });
    return res.status === 201;
  }],
];
let failed = 0;
for (const [name, run] of checks) {
  let ok = false;
  try { ok = await run(); } catch { ok = false; }
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + name);
  if (!ok) failed += 1;
}
process.exit(failed ? 1 : 0);`,
      },
      {
        type: 'paragraph',
        text: 'The second check matters most, and it is easy to miss: it proves that a protection still *works*, not only that the app answers. We ran the script against two releases: one good build and one where the sign-in check had quietly gone missing (the draft behaviour from lesson 1).',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the same smoke test against two releases',
        code: `Release 1 (hardened build)
PASS  health answers
PASS  signed-out write is refused
PASS  signed-in write is saved
exit code: 0

Release 2 (a build where the sign-in check went missing)
PASS  health answers
FAIL  signed-out write is refused
PASS  signed-in write is saved
exit code: 1`,
      },
      {
        type: 'paragraph',
        text: 'Release 2 passes two of three checks, and the dangerous one failed. A person looking at the app would have seen it “working”. The smoke test said “roll back”, and it said so in seconds. Write that rule down before you ship: **if the smoke test fails, or the alert rules from lesson 5 fire within the watch period, roll back first and investigate afterwards.** Debugging with customers waiting is how small problems become long ones. Rolling back means going to the last known-good version; how that is done depends on where you host, and the course AI-Assisted Deployment shows it for several kinds of hosting.',
      },
      { type: 'heading', text: 'Rolling back is easy for code and hard for data' },
      {
        type: 'paragraph',
        text: 'Going back to old code takes a minute. Going back after a **database change** is harder: if the new version renamed a column or deleted rows, the old code no longer fits, and no rollback un-sends an email. So change data in two safe steps. **Expand**: add the new column or table, leaving the old one alone, and release code that works with both. **Contract**: later, in a separate release, remove the old thing once nothing uses it. Between the two, a rollback is always safe. Take a backup before any release that touches data (you practised the drill in lesson 6), and for risky features release to a small share of users first, or behind a switch you can turn off without a new release.',
      },
      {
        type: 'paragraph',
        text: 'Finally, measure whether the routine works. DORA, a long-running research programme on software delivery, describes five measures: **change lead time** (from commit to running in production), **deployment frequency**, **failed deployment recovery time**, **change fail rate** (the share of deployments needing an urgent fix such as a rollback) and **deployment rework rate**. Use them as signals for the team’s process, never as targets for individuals: once people are judged by a number, they start to game the number.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** *Releasing* means giving your users the new version. A *rollback* means putting the old version back, like restoring the last saved copy of a document after a bad edit. A *smoke test* is a quick “is it on fire?” check done right after you release. An *exit code* is the number a program leaves behind when it finishes: 0 means “all went well” and anything else means “something failed”. In the script above, `process.exit(failed ? 1 : 0)` says: if any check failed, finish with 1, otherwise with 0. `try { ... } catch { ... }` means “try this, and if it breaks, call the check failed instead of crashing”.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Separate deploy from release: ship dark behind a flag, then ramp exposure while watching service level indicators, with an automatic halt on regression. Promote the same artifact through environments and tie each release to a commit and a change record so a rollback is a known operation, not a fresh build. Make migrations backward compatible across at least one version (expand, migrate, contract), run them as their own step with their own rollback story, and test the downgrade path where you claim one. Use environment protection and short-lived, scoped credentials so neither a person nor an AI agent can push to production without the right approval; an agent proposing a release is fine, an agent holding standing production credentials is a risk. Track the five delivery measures per service, treat a rising change-fail rate as a quality signal, and review releases that needed a rollback in the same blameless way as incidents (lesson 9).',
      },
      {
        type: 'prompt',
        label: 'Ask AI to draft your release checklist from your own project',
        text: 'Read this project and write a release checklist for it with three sections: BEFORE (what must be true: checks green, a backup if data changes, a rollback target identified), DURING (the exact commands or clicks to release, in order), and AFTER (a smoke test of 3 to 5 checks that includes at least one check that a protection still works, what to watch for 15 minutes, and the rule for rolling back). Use only commands that exist in this repository or that I name. Mark anything you are unsure about as a question for me instead of guessing. Do not deploy anything.',
      },
      {
        type: 'warning',
        text: 'Do not let an AI agent deploy to production on its own because “the tests passed”. Passing tests mean the change is ready to propose; releasing it is a decision with a person’s name on it, a backup behind it and a smoke test after it.',
      },
      {
        type: 'version',
        text: 'Checked against DORA’s guide to software delivery metrics: five metrics in two groups, throughput (change lead time, deployment frequency, failed deployment recovery time) and instability (change fail rate, deployment rework rate). The metric names and definitions can change, so check the guide for the current set before quoting it. Exit-code handling in the smoke test follows Node.js’s `process.exit`; how to roll back, and which environment protection features exist, differs for each hosting product and is covered in their own documentation.',
        checked: CHECKED,
        sources: [DOCS.dora],
      },
      {
        type: 'takeaways',
        items: [
          'A release routine is a checklist: small changes, the same steps every time, a way back before you go, and a watch period after.',
          'A smoke test checks the few things that matter on the live app, including that a protection still works, and ends with an exit code a script can act on.',
          'Decide the rollback rule in advance: if the smoke test fails or an alert fires in the watch period, roll back first and investigate after.',
          'Code rolls back easily and data does not: expand first, contract later, and back up before a data change.',
          'Measure the routine with delivery signals (lead time, frequency, recovery time, change fail rate) and never use them to rank people.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'A release decision that keeps a bad release',
          prompt: 'An assistant wrote this helper to decide whether to keep a release. When one smoke check fails but the error rate looks fine, it still says to keep it. Tap the faulty line, then choose the fix.',
          concept: 'keep or roll back',
          language: 'javascript',
          code: 'function decide(smokeResults, errorRate, maxErrorRate) {\n  const allPassed = smokeResults.every((ok) => ok);\n  if (allPassed || errorRate <= maxErrorRate) return \'keep\';\n  return \'rollback\';\n}',
          bugLine: 3,
          fixes: [
            { line: '  if (allPassed && errorRate <= maxErrorRate) return \'keep\';', correct: true, why: 'Keep the release only when every smoke check passed and the error rate is within the limit. Either one failing means roll back.' },
            { line: '  if (allPassed) return \'keep\';', correct: false, why: 'This ignores the error rate, so a release that passes the smoke test but is failing real users would be kept.' },
            { line: '  if (errorRate <= maxErrorRate) return \'keep\';', correct: false, why: 'This ignores the smoke test, so a broken sign-in check could be kept just because few requests failed so far.' },
            { line: '  if (!allPassed && errorRate <= maxErrorRate) return \'keep\';', correct: false, why: 'This keeps a release when something failed and rolls back a perfect one, which is the opposite of what is needed.' },
          ],
          tests: {
            kind: 'function',
            fn: 'decide',
            cases: [
              { label: 'everything fine', args: [[true, true, true], 0.01, 0.05], expected: 'keep' },
              { label: 'one smoke check failed', args: [[true, false, true], 0.01, 0.05], expected: 'rollback' },
              { label: 'smoke passed but errors are high', args: [[true, true, true], 0.2, 0.05], expected: 'rollback' },
              { label: 'everything is failing', args: [[false, false], 0.5, 0.05], expected: 'rollback' },
            ],
          },
          hints: [
            'What must be true of both the smoke test and the error rate before you keep a release?',
            'The word “or” means either one is enough to keep. Is that what you want?',
            'Use “and”: keep only if all checks passed and the error rate is within the limit.',
          ],
          explanation: 'A release is healthy only if every signal is healthy, so the conditions are joined with “and”. Using “or” lets a single good signal hide a bad one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-08-arrange-1',
          kind: 'arrange',
          title: 'A safe release, in order',
          prompt: 'Put the release routine in a sensible order, first at the top.',
          concept: 'release routine',
          language: 'text',
          solution: [
            'Confirm the checks are green on main',
            'Take a backup because the release changes data',
            'Release the small change',
            'Run the smoke test against the live app',
            'Watch logs and alerts for 15 minutes',
            'Write the release note, or roll back if anything failed',
          ],
          reasons: [
            'Never release something the robot has not approved.',
            'The backup is the way back for data, and it must exist before the change.',
            'The release itself happens only after the way back is ready.',
            'The smoke test tells you within seconds if the live app is broken.',
            'Some problems only appear under real use, so you keep watching for a while.',
            'You record the outcome last, and the rollback rule applies at any of the steps after the release.',
          ],
          hints: [
            'What has to be true before you are allowed to release anything?',
            'The way back (a backup) is prepared before the change, not after.',
            'Quick checks come right after the release and slower watching comes after that.',
          ],
          explanation: 'Checks, backup, release, smoke test, watch, record. Everything before the release is preparation for undoing it, and everything after it is evidence about whether to keep it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-08-scenario-1',
          kind: 'scenario',
          title: 'Rename a column the safe way',
          prompt: 'The app stores a customer’s phone number in a column called `phone`. A new feature needs it renamed to `mobile`. The assistant suggests a one-step rename inside the release. What do you do?',
          concept: 'expand then contract',
          situation: 'Real customers use the app all day. If you must roll back the release, the old code still expects a column called `phone`.',
          options: [
            { text: 'Release 1 adds `mobile` and has the code write to both and read the new one; release 2, later, removes `phone` once nothing uses it.', consequence: 'You can roll back release 1 at any time because `phone` still exists. The removal happens later, when you are sure.', quality: 'best' },
            { text: 'Rename the column in the release, and if something goes wrong, rename it back by hand.', consequence: 'During a rollback the old code runs against the renamed column and fails for every customer until someone fixes the database in a hurry.', quality: 'poor' },
            { text: 'Never rename columns; always add new ones and keep the old ones forever.', consequence: 'Safe, but the database fills with unused columns that confuse the next person, and an AI agent will start using the wrong one.', quality: 'acceptable' },
          ],
          hints: [
            'What does the old code need if you have to roll back?',
            'Can you avoid removing anything in the same release that adds something new?',
            'Add the new thing first and remove the old thing in a later release.',
          ],
          explanation: 'Expand then contract keeps every release compatible with the one before it, so a rollback never meets a database it does not understand.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-08-q1',
        prompt: 'Three minutes after a release, the smoke test starts failing. What is the right first move?',
        choices: [
          'Debug it on the live app while customers keep using it, since a rollback would waste the work',
          'Roll back to the last good version, then investigate',
          'Run the smoke test again until it passes, since an occasional failure is normal',
          'Send an announcement to customers and wait to see how many of them report problems',
        ],
        answer: 1,
        explanation: 'The rule was written in advance: a failed smoke test means roll back first. Debugging with customers affected makes small problems long ones, and repeating a test until it passes hides the signal.',
      },
      {
        id: 'production-ai-apps-08-q2',
        prompt: 'Why is releasing small changes often safer than releasing a big batch now and then?',
        choices: [
          'Customers prefer receiving many updates, so they stay happier with the app and are more willing to forgive problems',
          'Small releases are free, whereas big ones are charged by the hosting company according to how large the batch is',
          'It is easier to write the release note when there are many releases, because each one needs only a single line',
          'A small change has fewer places for a problem to hide, so it is easier to find and undo',
        ],
        answer: 3,
        explanation: 'Risk grows with the size of a change. A small release narrows the search to a few lines, and rolling it back loses little work.',
      },
      {
        id: 'production-ai-apps-08-q3',
        prompt: 'A release needs to remove a database column. Which approach is safest?',
        choices: [
          'Rename it to something unusual so that nobody can use it, and keep it permanently',
          'Remove it during the release, and restore from backup if there is a problem',
          'Remove it during the night when fewer customers are using the app, so fewer of them see the effects',
          'Stop using the column in one release, and remove it in a later release once nothing needs it',
        ],
        answer: 3,
        explanation: 'Splitting the change keeps each release compatible with the previous one, so a rollback is always possible. Removing during a release makes a rollback meet a database the old code cannot use.',
      },
      {
        id: 'production-ai-apps-08-q4',
        prompt: 'According to DORA, what does “change fail rate” measure?',
        choices: [
          'How many lines of code were changed in each release, on average',
          'How long it takes from the first commit of a change until the change runs in production',
          'The share of deployments that need an urgent fix, such as a rollback or a hotfix',
          'How many times per day the team deploys to production',
        ],
        answer: 2,
        explanation: 'Change fail rate is about deployments that needed urgent remediation. The other options are lead time, deployment frequency and a size measure, which is not a DORA metric.',
      },
      {
        id: 'production-ai-apps-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a smoke test?',
        choices: [
          'A quick check right after a release that the live app is alive and doing its most important jobs',
          'A long list of every test the app has ever had, run once a year before the yearly company meeting',
          'A test of how loud the app’s warning sounds are',
        ],
        answer: 0,
        explanation: 'A smoke test is small and fast. It asks “is it on fire?” and gives a pass or fail within seconds, so you can decide whether to keep the release.',
      },
      {
        id: 'production-ai-apps-08-q6',
        audience: { min: 'advanced' },
        prompt: 'An AI agent in your pipeline can currently deploy to production using a long-lived token. Which change best reduces the risk without removing the agent?',
        choices: [
          'Tell the agent in its instructions file never to deploy without asking, and keep the long-lived token',
          'Let it propose releases, require human approval for production, and use short-lived credentials',
          'Move the token into the agent’s prompt so that it is not stored in the repository',
          'Disable the smoke test so that the agent has fewer ways to be blocked during a release',
        ],
        answer: 1,
        explanation: 'Instructions are guidance, not enforcement. An approval gate and short-lived, narrowly scoped credentials limit what a mistaken or manipulated agent can do, while still using its speed.',
      },
    ],
    task: {
      title: 'Write and run a smoke test',
      minutes: 20,
      steps: [
        'Run the small server from lesson 4 (or any small web server you have) on your computer, with a /health endpoint.',
        'Write a smoke test with at least three checks, including one that proves a protection still works (for example “a request without sign-in is refused”). Print PASS or FAIL for each and exit with 1 if any failed.',
        'Break the server on purpose (remove the sign-in check), run the smoke test again and confirm that the exit code changes. Undo the break.',
        'Write your rollback rule as a single sentence and put it at the top of your release checklist.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain the smoke test script line by line, and to give an everyday example of a “quick check right after a change” from cooking or travel.'] },
      { audience: { min: 'advanced' }, steps: ['Add a second release with an expand-then-contract migration to your sample app, write the smoke test for both versions of the code against the same database, and show the rollback working after release one.'] },
    ],
  },
  {
    id: 'production-ai-apps-09',
    day: 9,
    title: 'When things go wrong: incidents',
    summary: 'Stop the harm first, communicate plainly, keep notes, then write a blameless review that turns the failure into checks, alerts and a better runbook.',
    minutes: 30,
    skills: ['incident-response'],
    intro: {
      objectives: [
        'Handle the first ten minutes of an incident with a calm checklist',
        'Write a runbook for an alert so that anyone on call can act on it',
        'Write a blameless postmortem whose action items prevent, detect or shorten the next one',
      ],
      why: 'However careful you are, something will break. People forgive an outage; they rarely forgive silence or the same failure twice. A calm routine and an honest review are what turn a bad night into a stronger app.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Every restaurant eventually has a kitchen fire. What separates a scare from a disaster is not that the fire never starts, but that everyone already knows where the extinguisher is, who calls whom, and that the first job is to get people out, not to work out why the stove caught fire. An **incident** is an unplanned event that hurts your users: the app is down, slow, wrong, or exposing something it should not. The most useful idea in incident work is that **stopping the harm comes before understanding the cause**. You can investigate later, with calm, from the logs. A customer cannot wait for your curiosity.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The life of an incident. Notice that “find the cause” comes after “stop the harm”, and that the review feeds back into detection.',
        source: `flowchart LR
  D[Detect: alert, user report] --> T[Triage: how bad, who is hurt]
  T --> M[Mitigate: roll back, switch off, fall back]
  M --> C[Communicate: say what you know]
  C --> R[Resolve: confirm it is really fixed]
  R --> P[Review: blameless write-up]
  P --> I[Improve: checks, alerts, runbook]
  I --> D`,
      },
      { type: 'heading', text: 'The first ten minutes' },
      {
        type: 'paragraph',
        text: 'In a team, an incident has roles: someone who leads and decides, someone who investigates and fixes, and someone who communicates. In a one-person project you wear all three hats, so write the steps down in advance and follow them even when your heart is pounding. Here is the order that works for most small apps.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Look at what changed.** Most incidents follow a change: a release, a setting, a new dependency, a surge of traffic. Ask “what changed in the last hour?” first.',
          '**Reduce the harm.** If a release just went out, roll back to the last good version. If one feature is the problem, switch it off or fall back (lesson 2). If it looks like an attack, restrict access.',
          '**Say what you know.** Post a short, plain message where your users will see it: what they might notice, that you are working on it, and when you will update them next. Do not guess a cause in public.',
          '**Keep a timeline as you go.** A notes file with the time (and time zone) of each observation and action. In the heat of the moment you will not remember the order, and the review needs it.',
          '**Confirm the fix with evidence.** Smoke test, the alert returning to normal, the error rate in the logs, not “it seems fine now”.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Decide severity in words before you need it, for example: **high** means everyone is blocked or data is exposed (act now, tell users), **medium** means a part is broken with a workaround (act today), **low** is cosmetic (a ticket). Then, for every alert you set up in lesson 5, write a **runbook**: a short page that says what the alert means, what to check first and what the safe first action is. A runbook is written when you are calm so that you can follow it when you are not. Here is one for the alert “error rate above 5 percent”.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'A runbook for one alert (written for the sample app)',
        code: `ALERT: error rate above 5% for 5 minutes (severity: high)

1. What changed? Was there a release, a setting change or a dependency update in the last hour?
   - Yes, a release: roll back to the previous version (see release checklist), then run the smoke test.
   - No: continue.
2. Is the AI summary service the cause? Look for "upstream" errors in the logs.
   - Yes: the fallback should already be serving. Check it is. No user action needed beyond a notice.
3. Find one failed request: search the log for "status":500 and note its requestId.
   - Search for that requestId to see the error message and the user.
4. Post a status message: what users may notice, that we are working on it, when we will update next.
5. When the error rate is back under 5% for 15 minutes, confirm with the smoke test and write the timeline.
Owner: whoever is on call. Last reviewed: 2026-11-14.`,
      },
      { type: 'heading', text: 'The blameless postmortem' },
      {
        type: 'paragraph',
        text: 'After the incident, you write a **postmortem** (also called a post-incident review): a short document that records what happened and what you will change. The word that matters is **blameless**. The goal is not to find who made the mistake; people with good intentions make mistakes all the time, and a team that punishes them hides them. Instead you ask “why did the *system* allow this?”: why could that change go out without a check catching it? Atlassian’s guidance and Google Cloud’s reliability guidance agree on the core parts: a timeline, the immediate cause and the contributing factors, what went well, what was lucky, and action items that are owned and tracked. Here is a worked example. The incident is made up for this course, built on the sample app: during a hurried release, an AI agent’s refactor had removed the sign-in check, and the smoke test from lesson 8 was skipped.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Postmortem (a made-up incident, written for this course)',
        code: `Title: Reminders could be saved without signing in, 14 Nov 2026
Status: resolved. Severity: high (customer data could be written by anyone). Author: on-call.

SUMMARY
For 31 minutes, POST /reminders accepted requests with no sign-in. 27 reminders were saved with no owner.
No data was read by outsiders and no existing data was changed.

IMPACT
27 unowned reminders (since deleted). No customer-visible outage. Trust risk: moderate.

TIMELINE (all times Manila, UTC+8)
14:02  Release v1.4.2 deployed. The smoke test was skipped because of a deadline.
14:11  First unsigned write appears in the logs (status 201, user null).
14:33  A teammate searching the logs for something else notices "201 ... user null".
14:35  Decision: roll back. 14:37 Rolled back to v1.4.1; smoke test passes.
14:42  27 unowned reminders found and removed. Status note posted to staff.

ROOT CAUSE AND CONTRIBUTING FACTORS
- Immediate: a refactor by an AI agent removed the token check from the handler.
- No test asserted that a request without a token is refused (CI was green).
- The smoke test existed but was optional, so it could be skipped under pressure.
- No alert on writes that have no user, so it was found by luck, 31 minutes late.

WHAT WENT WELL
- Structured logs let us find the unsigned writes in one search. Rollback took 2 minutes.

WHERE WE GOT LUCKY
- The endpoint only writes reminders, and nobody discovered it during the 31 minutes.

ACTION ITEMS (owner, due, type)
1. Add a CI test: no token returns 401 (Ana, 21 Nov, prevent)
2. Make the smoke test a required step of the release script (Ben, 21 Nov, prevent)
3. Alert on any 2xx write with user null (Ana, 28 Nov, detect)
4. Add "no access-control line removed" to the agent review checklist (Ben, 28 Nov, prevent)`,
      },
      {
        type: 'paragraph',
        text: 'Read the example for what it does not say: nobody is blamed, “be more careful” is not an action item, and each action changes the system so that the same mistake is caught earlier or cannot happen. Notice also how the lessons of this course appear as action items: a test in CI (lesson 7), a required smoke test (lesson 8), an alert (lesson 5). The review is how a failure becomes a check.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** An *incident* is a moment when your app is hurting its users. A *rollback* is putting the previous working version back. A *runbook* is a short how-to page, like the instructions next to a fire extinguisher: you write it calmly now so that anyone can follow it in a panic later. A *postmortem* is the write-up afterwards, a bit like a report after a fire drill, and *blameless* means it asks “what in our setup let this happen?” instead of “whose fault is it?”. A *timeline* is a list of what happened at which time. You do not need a team to do this: even alone, writing the timeline and three action items afterwards makes the next incident smaller.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Separate the incident process (declare, assign an incident commander, a scribe and a communications lead, set a cadence for updates, hand over cleanly) from the technical work, and drill it, because the process is what fails under stress. Mitigate by the cheapest reversible lever (rollback, flag, traffic shift, load shedding) before diagnosis. Write reviews for the system, not the person: map contributing factors across detection, prevention, mitigation and communication, avoid single “root cause” framing where several conditions combined, and group actions by whether they reduce the likelihood, the impact or the time to detect and recover. Track actions to completion with owners and dates, because an unfinished action item is a repeat incident, and review the reviews. Where AI is involved, add the agent’s permissions, review path and guardrails to the factors, rather than treating “the AI did it” as an answer.',
      },
      {
        type: 'prompt',
        label: 'Use AI to draft the timeline and the review, with a human deciding what is true',
        text: 'Here are my incident notes and the relevant log lines (I have removed tokens, passwords and personal data). Draft a blameless postmortem using this structure: summary, impact, timeline with times and time zone, immediate cause, contributing factors, what went well, where we got lucky, and action items each with an owner placeholder, a due date placeholder and a type (prevent, detect or mitigate). Rules: do not name or blame any person, use only facts that appear in my notes, mark any gap as “unknown: ask” instead of guessing, and do not write “be more careful” as an action. After the draft, list the three claims you are least sure of.',
      },
      {
        type: 'warning',
        text: 'Before pasting logs or notes into an AI tool during an incident, remove tokens, keys, passwords and customers’ personal details. Stress is exactly when people paste the whole log. Let the AI help with wording and structure, and keep the facts, the decisions and the final text yours.',
      },
      {
        type: 'version',
        text: 'Checked against Atlassian’s guidance on blameless postmortems (assume good intent and ask why the system allowed an action, not why one person took it; describe people by role; include a timestamped timeline; assign action items) and Google Cloud’s reliability guidance on postmortems (identify both the immediate cause and the systemic issues, list contributing factors, and keep a prioritised list of actions that reduce the chance of recurrence and improve detection and recovery). The section headings of a postmortem template vary between teams; the template here is one reasonable shape, not a standard.',
        checked: CHECKED,
        sources: [DOCS.atlassianBlameless, DOCS.gcpPostmortems],
      },
      {
        type: 'takeaways',
        items: [
          'In an incident, stop the harm first (roll back, switch off, fall back) and find the cause afterwards.',
          'Ask what changed, communicate plainly, keep a timestamped timeline and confirm the fix with evidence.',
          'Write a runbook for each alert while you are calm: what it means, what to check, the safe first action.',
          'A blameless postmortem asks why the system allowed it; its action items prevent, detect or shorten the next incident.',
          'Use AI to draft, never to decide the facts, and never paste secrets or personal data into it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-09-scenario-1',
          kind: 'scenario',
          title: 'Errors spike ten minutes after a release',
          prompt: 'You released a new version ten minutes ago. Now the error alert fires: about one request in five is failing. You do not know why. What do you do first?',
          concept: 'mitigate first',
          situation: 'You have a previous version that worked, the rollback takes about two minutes, and customers are using the app right now.',
          options: [
            { text: 'Roll back to the previous version, confirm with the smoke test, post a short status note, and then investigate in the logs.', consequence: 'Errors stop within minutes. You investigate calmly afterwards, with the failing requests still in the logs.', quality: 'best' },
            { text: 'Stay on the new version and read the code to find the bug before touching anything.', consequence: 'You find the bug after an hour of rising errors and unhappy customers, when a two-minute rollback was available.', quality: 'poor' },
            { text: 'Restart the server and see if the errors go away.', consequence: 'The errors pause briefly and come back, and you have lost time and some evidence that was in memory.', quality: 'acceptable' },
          ],
          hints: [
            'What changed ten minutes ago, and can you undo it quickly?',
            'Is understanding the cause or stopping the harm more urgent for the customers?',
            'Use the cheapest reversible action first, and diagnose afterwards.',
          ],
          explanation: 'When a recent change correlates with the damage, rolling it back is the fastest, safest mitigation. The cause can be studied from the logs once users are no longer hurt.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-09-fill-blank-1',
          kind: 'fill-blank',
          title: 'Finish the runbook',
          prompt: 'Complete this short runbook for an error-rate alert using the words from the bank. Two words are not used.',
          concept: 'runbooks',
          language: 'text',
          code: '1. First ask: what ___ in the last hour?\n2. If a release went out, ___ to the last good version.\n3. Tell users what they see, and when you will ___ them again.\n4. Then use the ___ id of a failed request to find its log line.',
          blanks: [
            { answers: ['changed'], feedback: 'Most incidents follow a change, so the first question is what changed.' },
            { answers: ['roll back'], feedback: 'The quickest way to stop the harm after a release is going back to the version that worked.' },
            { answers: ['update'], feedback: 'People can wait for a fix if they hear from you; promise the time of your next update.' },
            { answers: ['request'], feedback: 'The request id ties a customer’s failed call to one line in your logs.' },
          ],
          bank: ['changed', 'roll back', 'update', 'request', 'delete', 'ignore'],
          hints: [
            'The runbook starts from the idea that something was different before the problem began.',
            'Think about the fastest way to undo a recent release, and what users want to hear.',
            'The words not used are delete and ignore.',
          ],
          explanation: 'A runbook is a calm checklist: find the change, undo it, keep people informed, and use your logs. Following it is what keeps a bad night short.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-09-match-1',
          kind: 'match',
          title: 'Where does it go in the postmortem?',
          prompt: 'Match each sentence from a draft postmortem to the section it belongs in.',
          concept: 'postmortem structure',
          labels: { terms: 'A sentence from the draft', meanings: 'The section it belongs in' },
          pairs: [
            { term: '14:35 Decision to roll back; 14:37 rolled back and the smoke test passed', definition: 'Timeline', note: 'Timestamped events in order belong in the timeline.' },
            { term: 'The smoke test was optional, so it could be skipped under pressure', definition: 'Contributing factors', note: 'This is a condition in the system that let the incident happen.' },
            { term: 'Add a required CI test that a request without a token returns 401', definition: 'Action items', note: 'An owned, dated task that prevents the same failure is an action item.' },
            { term: 'Nobody discovered the endpoint during the 31 minutes', definition: 'Where we got lucky', note: 'Something that could have made it worse but did not is luck, and worth recording.' },
          ],
          hints: [
            'Two of these contain a time or a task. Which is which?',
            'One describes a weakness in how releases work, and one describes what did not happen.',
            'The sentence that starts with a verb and names something to add is a task.',
          ],
          explanation: 'Keeping facts (timeline), causes (contributing factors), luck and tasks in separate sections keeps the review honest, and makes the action items impossible to miss.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-09-q1',
        prompt: 'A release went out ten minutes ago and errors have jumped. What is the right first step?',
        choices: [
          'Read the whole change line by line until the bug is found, since you cannot fix what you do not understand',
          'Wait for another ten minutes of data, so that you know for certain whether it is a real problem or not',
          'Write the postmortem now while the details are fresh in your mind, and then decide how to fix it afterwards',
          'Roll back to the last good version, then look for the cause',
        ],
        answer: 3,
        explanation: 'Stopping the harm comes first, and the cheapest reversible lever after a release is a rollback. The logs will still hold the evidence afterwards.',
      },
      {
        id: 'production-ai-apps-09-q2',
        prompt: 'Which sentence belongs in a blameless postmortem?',
        choices: [
          'The release process allowed a build without the sign-in check to go out because the smoke test was optional',
          'Dan should have checked the sign-in code carefully before he released it, and he did not, so it was his mistake',
          'The AI agent is unreliable and should not be used for anything again',
          'Everyone must try harder to be careful in the future',
        ],
        answer: 0,
        explanation: 'A blameless review describes how the system allowed the mistake. Naming a person, blaming a tool or asking for more care gives no change that would catch the next one.',
      },
      {
        id: 'production-ai-apps-09-q3',
        prompt: 'Why does a timeline give a time zone with each time?',
        choices: [
          'Because customers in other countries must see the same times in the status message',
          'Because the clock on the server can only display times in one time zone',
          'So events can be put in order and compared with logs written in other places',
          'Because postmortems with time zones are easier to translate into another language later',
        ],
        answer: 2,
        explanation: 'People and systems record times differently. A zone makes the order unambiguous and lets you match your notes to server logs.',
      },
      {
        id: 'production-ai-apps-09-q4',
        prompt: 'Which action item is the most useful?',
        choices: [
          'Be more careful with releases from now on',
          'Add a required CI test that no token returns 401 (owner: Ana, due 21 Nov, prevents a repeat)',
          'Review the code more often, whenever somebody has some time to spare',
          'Talk to the team about security at the next meeting, to raise awareness of the issue and how important it is',
        ],
        answer: 1,
        explanation: 'A good action is specific, owned and dated, and changes the system. The others depend on people remembering and cannot be checked.',
      },
      {
        id: 'production-ai-apps-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a runbook?',
        choices: [
          'A report that blames the person who caused a problem and lists what should happen to them as a result',
          'A list of everyone who has ever used the app',
          'A short how-to page, written calmly in advance, that tells you what to do when an alert fires',
        ],
        answer: 2,
        explanation: 'A runbook is like the instructions next to a fire extinguisher: you read them calmly once, so that you can follow them quickly when it matters.',
      },
      {
        id: 'production-ai-apps-09-q6',
        audience: { min: 'advanced' },
        prompt: 'A postmortem’s only action item reads “reviewers must check for removed access checks”. Why is that weak, and what is a stronger alternative?',
        choices: [
          'It relies on attention under deadline; add an automated check that fails when the access check is missing',
          'It is too strong, because reviewers have no time to review anything for any reason at all',
          'It should be assigned to the AI agent rather than to a human reviewer, since agents never forget instructions',
          'It is fine as it is, because a written rule is the strongest control a team can have',
        ],
        answer: 0,
        explanation: 'Reminders to be careful fail when people are busy. Automation that makes the mistake visible or impossible keeps working under pressure, with the reviewer as a second layer.',
      },
    ],
    task: {
      title: 'Write a runbook and a mini postmortem',
      minutes: 20,
      steps: [
        'Pick one alert you wrote in lesson 5 (or invent one for a small app). Write its runbook in five steps or fewer: what changed, the safe first action, how to find one failed request, the status message and how to confirm the fix.',
        'Invent a small incident for your app (a release broke sign-in, the AI service hung, a bad migration). Write the timeline with times and a time zone, one contributing factor, one thing that went well and one thing that was lucky.',
        'Write three action items, each with an owner, a date and a type: prevent, detect or mitigate. Check that none of them says “be more careful”.',
        'Ask an AI assistant to review your postmortem for blame, and rewrite any sentence it flags.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain “blameless” with the example of a kitchen where a pot boiled over, and to rewrite one blaming sentence of yours in a blameless way.'] },
      { audience: { min: 'advanced' }, steps: ['Add a section to your postmortem that lists the AI agent’s permissions and review path as contributing factors, with one action that limits what the agent can change without a failing check.'] },
    ],
  },
  {
    id: 'production-ai-apps-10',
    day: 10,
    title: 'Keeping AI-written code maintainable',
    summary: 'AI writes code fast and forgets between sessions, so keep one place per idea, write the house rules down, and let tests and small changes keep the codebase readable.',
    minutes: 30,
    skills: ['maintainability-and-cost'],
    intro: {
      objectives: [
        'Spot drift: the same idea written three slightly different ways by different AI sessions',
        'Write an instructions file that tells an agent how your project does things',
        'Review generated code for duplication, dead code and invented dependencies, and fix it behind a test',
      ],
      why: 'An app is read and changed far more often than it is written. If every AI session adds its own style, the app becomes hard to change safely, and you will eventually be afraid to touch it.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Picture a shared kitchen where every cook who comes in labels the shelves in their own way: one writes “sugar”, another “asukal”, a third just draws a cup. Each shelf makes sense to the person who labelled it, and the kitchen as a whole is a puzzle. AI assistants work like a stream of new cooks. Each session starts from a blank memory, reads a few files, solves the problem in front of it, and moves on. The result runs, and over months the same idea ends up written several different ways. Code is **maintainable** when a person who did not write it can find where something lives, change it in one place, and trust the tests to tell them what broke. That is a different skill from making code work, and it is one the assistant will not practise unless you ask.',
      },
      {
        type: 'paragraph',
        text: 'Here is a real example from the sample app. Over three sessions, three places needed to know whether a text is a real date. Each was written by an assistant, correctly for its own purpose, and each decides differently. We ran all three on five inputs.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Three answers to “is this a date?”, written in three different sessions',
        code: `const inReminderForm = (s) => /^\\d{4}-\\d{2}-\\d{2}$/.test(s);                       // shape only
const inImport = (s) => !Number.isNaN(Date.parse(s));                                // anything Date accepts
const inServer = (s) => /^\\d{4}-\\d{2}-\\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)); // shape and real date`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the three checks on five inputs',
        code: `2026-12-01         form: true  import: true  server: true
2026-13-45         form: true  import: false server: false
2026-02-31         form: true  import: true  server: true
December 1         form: false import: true  server: false
2026-12-01T25:00   form: false import: false server: false`,
      },
      {
        type: 'paragraph',
        text: 'The three disagree on three of the five inputs, which means a reminder the form accepts can be one the server rejects, and the other way round. Worse, look at the third row: **2026-02-31 passes in the server, the function we wrote in lesson 4 and called a real-date check.** It is not a real date. JavaScript’s `Date.parse` quietly rolls it forward to 3 March, and our three tests in CI never tried it. This is the shape of most maintenance bugs in AI-written code: not a crash, but a quiet disagreement between copies. The fix is one idea, one place. We wrote a single `isRealDate` function in one file, used it in all three places, and wrote tests that include the awkward dates. Our first version crashed on `2026-13-45`, because `toISOString()` throws on an invalid date, and the test caught it before anything else did. Here is the corrected version and what it returned.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'dates.mjs: the one place that decides, with the guard the first version lacked',
        code: `export function isRealDate(text) {
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(text)) return false;
  const time = Date.parse(text);
  if (Number.isNaN(time)) return false;
  return new Date(time).toISOString().slice(0, 10) === text;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the new tests and of the function on sample dates',
        code: `$ node --test
ok 1 - real dates pass
ok 2 - impossible dates fail, including ones Date.parse accepts
# pass 2
# fail 0

2026-12-01   true
2026-13-45   false
2026-02-31   false
December 1   false
2028-02-29   true
2027-02-29   false`,
      },
      {
        type: 'paragraph',
        text: 'The trick works because a real date survives a round trip: if you turn the text into a date and back into text, a real one comes back unchanged and a rolled-over one (2026-02-31 becomes 2026-03-03) does not. You do not need to memorise that. You need the habit of asking “is there already one function that decides this?” before accepting a second.',
      },
      { type: 'heading', text: 'Habits that keep AI code readable' },
      {
        type: 'list',
        items: [
          '**One place per idea.** Before accepting a new helper, ask the assistant to search the project for an existing one. Reuse beats a clever duplicate.',
          '**Write the house rules down in an instructions file** that the agent reads at the start of every session: where validation lives, naming, how to run the checks, what never to do. Keep it short and specific.',
          '**Keep every change small and single-purpose.** A pull request that does one thing can be understood, tested and undone. One that “refactors everything” cannot.',
          '**Let tests be the specification.** Ask for a failing test first, then the change. The test is what lets the next session change the code without fear.',
          '**Delete.** Remove dead code, unused functions and dependencies you no longer need. AI is eager to add and rarely offers to remove.',
          '**Check the dependencies.** Confirm that any package the assistant adds is real, maintained and needed, and that you could explain why it is there.',
        ],
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'AGENTS.md (or CLAUDE.md): a short instructions file for the sample app',
        code: `# Tindahan Reminders: how we work

## Commands
- Run all checks: npm run check && npm test
- Start locally: node server.mjs

## Rules
- Input validation lives in server.mjs and dates.mjs only. Never write a second date check; import isRealDate.
- Never trust ids, roles or owners sent by the client. They come from the sign-in token.
- Every new endpoint needs: a test with no token (401), a test with a bad body (422), and a log line.
- Do not add a dependency without asking. Do not log tokens, passwords or request bodies.

## Before you finish
- Run the checks and show the output. List every file you changed and why.`,
      },
      {
        type: 'paragraph',
        text: 'Two honest caveats about the instructions file. It is **guidance, not enforcement**: the tool reads it at the start of the session and follows it as context, but it can still be ignored, so anything that really matters must also be a test or an automated check (the sign-in rule should also be a CI test, as the postmortem in lesson 9 proposes). And it should stay short, because long, vague files are followed less consistently than short, specific ones. Different tools use different file names (Claude Code reads `CLAUDE.md` and can also read an `AGENTS.md`; Codex reads `AGENTS.md`), so check what your tool uses.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** *Maintainable* means “a person can understand it and change it safely later”, like a recipe someone else can follow. *Duplication* is when the same idea is written in several places, so changing one place leaves the others wrong, like a phone number written on five sticky notes. A *helper function* is a small named piece of code that does one job, so everyone can use the same one. A *dependency* is a library someone else wrote that your app uses. An *instructions file* is a short note to the AI saying “in this project, we do things this way”. In the example above, `/^\\d{4}-\\d{2}-\\d{2}$/` is a pattern meaning “four digits, a dash, two digits, a dash, two digits”, and `.test(text)` asks whether the text matches it.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Generated code fails maintainability in predictable ways: parallel implementations of one rule, speculative abstraction, comments that restate or contradict the code, swallowed exceptions, and a quiet drift in error handling and naming. Counter it structurally: conventions encoded as lint rules and architecture tests (so they are enforced, not just requested), small single-purpose pull requests, characterisation tests before refactors, and review prompts that ask the agent to list duplicated logic and unused code it can see. Keep the instructions file under version control with owners, treat changes to it as code review, and scope it (a root file plus directory-level files) so each agent receives only what is relevant; context is a budget. Record architectural decisions where an agent can read them (short decision records) and track dependency count and age as a health signal. Measure outcomes such as time to change and rework, not lines produced.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to find duplication and dead code before you add anything',
        text: 'Do not change any files. Search this project and report: (1) any logic that appears in more than one place, such as validation, formatting or permission checks, quoting file and line for each copy and saying whether the copies behave differently; (2) functions, files and dependencies that nothing uses; (3) any package in package.json that you cannot find imported anywhere. For each duplicate, propose the single place it should live and the test that would prove the copies agree. Wait for my approval before changing anything.',
      },
      {
        type: 'tip',
        text: 'End each agent session by asking “list every file you changed and why, and anything you added that already existed elsewhere”. Reading that list takes a minute and catches most duplication before it is merged.',
      },
      {
        type: 'version',
        text: 'Checked against Claude Code’s documentation: each session starts with a fresh context, and CLAUDE.md files give persistent instructions loaded at the start of every session; they are treated as context, not enforced configuration (a hook can block an action regardless), and specific, concise instructions are followed more consistently; Claude Code can also read a repository’s AGENTS.md. Checked against Codex’s documentation: Codex reads AGENTS.md before starting work, layering files from the project root down to the current directory (files closer to the working directory take precedence) up to a combined size limit that defaults to 32 KiB. File names, limits and loading rules change between releases, so check the current page for your tool.',
        checked: CHECKED,
        sources: [DOCS.ccMemory, DOCS.codexAgentsMd],
      },
      {
        type: 'takeaways',
        items: [
          'AI sessions forget each other, so the same idea gets written several ways, and the copies quietly disagree.',
          'One place per idea: ask for an existing helper before accepting a new one, and test the awkward cases (a date like 2026-02-31).',
          'Write the house rules in a short, specific instructions file, and enforce the important ones with tests, because the file is guidance only.',
          'Keep changes small and single-purpose, make tests the specification, and delete what is unused.',
          'End a session by asking what changed and why, and read the answer.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-10-code-challenge-1',
          kind: 'code-challenge',
          title: 'Is this a real calendar date?',
          prompt: 'Write `isRealDate(text)` for dates written like `"2026-12-01"` without using the `Date` tool. It returns `true` only if the text is year-month-day (4 digits, 2 digits, 2 digits, separated by `-`) **and** the day exists in that month. Remember that February has 29 days in a leap year: a year divisible by 4 is a leap year, except years divisible by 100, unless they are also divisible by 400.',
          concept: 'one function, awkward cases',
          language: 'javascript',
          starter: 'function isRealDate(text) {\n  // true only for a date that exists, like 2028-02-29\n}',
          tests: {
            kind: 'function',
            fn: 'isRealDate',
            cases: [
              { label: 'an ordinary date', args: ['2026-12-01'], expected: true },
              { label: 'February 31 does not exist', args: ['2026-02-31'], expected: false },
              { label: 'a leap day in a leap year', args: ['2028-02-29'], expected: true },
              { label: 'a leap day in a normal year', args: ['2027-02-29'], expected: false },
              { label: 'a century year that is not a leap year', args: ['2100-02-29'], expected: false },
              { label: 'a century year that is a leap year', args: ['2000-02-29'], expected: true },
              { label: 'month 13', args: ['2026-13-45'], expected: false },
              { label: '31 days in a 30-day month', args: ['2026-04-31'], expected: false },
              { label: 'not in the right shape', args: ['December 1'], expected: false, hidden: true },
            ],
          },
          solution: 'function isRealDate(text) {\n  const parts = text.split(\'-\');\n  if (parts.length !== 3 || parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) return false;\n  const year = Number(parts[0]);\n  const month = Number(parts[1]);\n  const day = Number(parts[2]);\n  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;\n  if (month < 1 || month > 12 || day < 1) return false;\n  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;\n  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];\n  return day <= days[month - 1];\n}',
          hints: [
            'Split the text at the dashes and check that you get three pieces of length 4, 2 and 2.',
            'Turn the pieces into numbers, check the month is 1 to 12, and decide whether the year is a leap year.',
            'Keep a list of the days in each month (February depends on the leap year) and check day <= days[month - 1].',
          ],
          explanation: 'A real date needs the right shape, a month from 1 to 12, and a day that exists in that month. The leap-year rule is what makes 2028-02-29 valid while 2027-02-29 and 2100-02-29 are not, which is exactly the kind of case an AI-written check forgets.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-10-match-1',
          kind: 'match',
          title: 'Name the maintenance smell',
          prompt: 'Match what you find in a codebase written by many AI sessions to the habit that would have prevented it.',
          concept: 'maintainability habits',
          labels: { terms: 'What you find', meanings: 'The habit that prevents it' },
          pairs: [
            { term: 'Three different functions that each decide whether a phone number is valid', definition: 'One place per idea: search for an existing helper first', note: 'Parallel implementations of one rule are the classic result of sessions that cannot see each other.' },
            { term: 'A 40-file pull request called “cleanup” that nobody can review', definition: 'Small, single-purpose changes', note: 'A change that large cannot be understood, tested or undone as one piece.' },
            { term: 'A library in package.json that nothing imports and nobody remembers adding', definition: 'Check and prune dependencies', note: 'Each unused dependency is something to update, audit and trust for no benefit.' },
            { term: 'A change to an old function that broke something in another part of the app, with no failing test', definition: 'Tests as the specification', note: 'Without tests, nothing says what must keep working when the code changes.' },
          ],
          hints: [
            'Ask for each one: what was missing that would have stopped it happening?',
            'One of these is about size, one about copies, one about unused things, one about safety nets.',
            'The unused library is a dependency problem; the unexpected breakage is a missing test.',
          ],
          explanation: 'Each smell has a matching habit. None of them are about writing better code in the first place; they are about the routine around the code.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-10-scenario-1',
          kind: 'scenario',
          title: 'The agent wants to add a helper',
          prompt: 'You ask an agent to validate the phone number on a new form. Its plan says: “I will add a new `isValidPhone` function in this file.” You remember the project already has phone validation. What do you do?',
          concept: 'reuse before adding',
          situation: 'The existing check lives in `validators.js` and is used by two other forms. The agent did not mention it.',
          options: [
            { text: 'Tell the agent to search for existing phone validation, reuse and, if needed, extend that one function, and add a test that covers the new case.', consequence: 'There is still one phone check. The new form behaves like the others and the tests cover all three.', quality: 'best' },
            { text: 'Accept the new function, since it works and the form is done.', consequence: 'Now two checks disagree about spaces and dashes. A customer’s number is accepted on one form and rejected on another.', quality: 'poor' },
            { text: 'Accept it for now and plan to merge the two functions someday.', consequence: 'Someday does not come. Each later session copies whichever version it finds first.', quality: 'acceptable' },
          ],
          hints: [
            'How many functions will decide “is this a valid phone number” if you accept the plan?',
            'What happens when the two versions disagree about a number?',
            'Point the agent at the existing function and ask for a test that proves they agree.',
          ],
          explanation: 'Duplication costs the least on the day it is created and the most later. Reusing the single existing function keeps one source of truth, and a test makes the shared behaviour checkable.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-10-q1',
        prompt: 'Why does a codebase built over many AI sessions tend to drift?',
        choices: [
          'AI tools deliberately write code in different styles so that people will not copy it from one another',
          'Each session starts without memory of the earlier ones, so it solves the same problem a new way',
          'Newer sessions always write worse code than older ones, and the gap between them grows over time',
          'Assistants refuse to reuse existing functions unless they are written in the same file as the new one',
        ],
        answer: 1,
        explanation: 'A session sees only what it reads. Unless you point it at the existing helper or rule, it invents a fresh solution, and the copies slowly diverge.',
      },
      {
        id: 'production-ai-apps-10-q2',
        prompt: 'In the date example, the form, the import and the server disagreed about what a date is. What is the underlying fix?',
        choices: [
          'Add a fourth check that compares the results of the other three and reports any difference',
          'Give each place its own check but write them all in the same style, so that they look similar',
          'Remove the checks and trust the user, since the database will refuse an impossible date anyway',
          'One shared function used in every place, with tests that include the awkward dates',
        ],
        answer: 3,
        explanation: 'Disagreement comes from copies. A single function with tests that cover edge cases such as 2026-02-31 means every place gives the same answer.',
      },
      {
        id: 'production-ai-apps-10-q3',
        prompt: 'What is the right way to think about an instructions file such as AGENTS.md or CLAUDE.md?',
        choices: [
          'A long document that should hold the whole design of the app, so that nothing needs to be explained again',
          'A set of unbreakable rules that an agent is technically unable to disobey',
          'A replacement for tests, because a clear rule means a test is unnecessary',
          'Guidance read at the start of a session, not a guarantee, so rules that matter also need tests or checks',
        ],
        answer: 3,
        explanation: 'The tool loads the file as context, which usually improves behaviour but does not enforce it. Short, specific rules work best, and the important ones belong in automated checks too.',
      },
      {
        id: 'production-ai-apps-10-q4',
        prompt: 'An agent adds a new helper function. Which review question catches the most drift?',
        choices: [
          'Is the new function written in a pleasant style that matches how the other functions look?',
          'How many lines long is the new function, and could it be made a little shorter?',
          'Does something that does this already exist in the project?',
          'Did the agent write a comment above the function that explains what it does?',
        ],
        answer: 2,
        explanation: 'Duplication with differing behaviour is the costly kind of drift. Style, length and comments matter less than whether there are now two answers to one question.',
      },
      {
        id: 'production-ai-apps-10-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does it mean for code to be “maintainable”?',
        choices: [
          'A person who did not write it can find things, change them safely and trust the tests',
          'It was written very quickly, so that the app could be released early',
          'It uses the largest possible number of libraries made by other people, so nothing is written by hand',
        ],
        answer: 0,
        explanation: 'Maintainable code is code you can change later without fear, like a recipe another cook can follow. Speed of writing and the number of libraries have nothing to do with it.',
      },
      {
        id: 'production-ai-apps-10-q6',
        audience: { min: 'advanced' },
        prompt: 'Each of an agent’s pull requests looks fine, but the codebase keeps growing inconsistent. Which change helps most?',
        choices: [
          'Ask reviewers to read every line more slowly and to be stricter with the agent',
          'Encode conventions as lint rules and tests, keep an instructions file, and keep pull requests small',
          'Move to a larger model, which will remember the earlier sessions of the project on its own and so stay consistent',
          'Ban the agent from touching existing files, so that it can only create new ones',
        ],
        answer: 1,
        explanation: 'Per-change review cannot see cross-change drift. Enforced conventions plus small changes make drift visible and cheap to correct, while guidance steers each session.',
      },
    ],
    task: {
      title: 'Find and remove a duplicate',
      minutes: 20,
      steps: [
        'Pick a small project of yours (or ask an AI to generate one with a form, an import and a server). Run the “find duplication and dead code” prompt from this lesson and read its report without changing anything.',
        'Choose one duplicated rule and write a test for it that includes at least two awkward inputs. Watch it fail on the weaker copy.',
        'Move the rule into one shared function, use it in every place, and run the test and your other checks again.',
        'Write a ten-line instructions file (AGENTS.md or CLAUDE.md) for your project with three rules and the command that runs your checks.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain the pattern `/^\\d{4}-\\d{2}-\\d{2}$/` piece by piece, and to give you one more everyday example of “the same idea written in several places”.'] },
      { audience: { min: 'advanced' }, steps: ['Add an architecture test or lint rule that fails when a second implementation of the shared rule appears (for example, a search for a date-shaped regular expression outside dates.mjs), and show it failing on a planted duplicate.'] },
    ],
  },
  {
    id: 'production-ai-apps-11',
    day: 11,
    title: 'Costs at scale',
    summary: 'A demo has a flat cost and a product has a meter: model what each user costs, find the biggest lever, and set limits and alerts before success becomes a surprise bill.',
    minutes: 26,
    skills: ['maintainability-and-cost'],
    intro: {
      objectives: [
        'Name the costs that grow with usage in an AI-powered app',
        'Build a simple cost model per user and use it to compare changes',
        'Choose limits, alerts and a switch-off so that a bug or a viral day cannot become a surprise bill',
      ],
      why: 'Free tiers and low volumes hide costs that appear only when people actually use your app. Knowing what grows, and putting a cap and an alert on it, is how success stays a good problem.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A demo has a flat cost: a few cents of testing and a free hosting plan. A product has a **meter**, like a taxi: the more people ride, the more it costs, and some rides cost far more than others. With AI features the meter is very visible, because most AI services charge by the amount of text they read and write, and your own code can call them in a loop faster than a human ever would. This lesson is about cost in words and small calculations. We will not quote prices, since they differ by provider, change often and vary by country: always read your provider’s current pricing page for real numbers.',
      },
      {
        type: 'table',
        headers: ['Cost driver', 'It grows with', 'How you control it'],
        rows: [
          ['AI calls (text read and written)', 'Users × calls per user × length of each prompt and answer', 'Shorter prompts, capped answers, cheaper models for easy tasks, caching, limits per user'],
          ['Database and storage', 'Rows, photos and files kept, and how long you keep them', 'Retention rules, deleting what you no longer need, smaller files'],
          ['Network traffic', 'Pages, images and API responses sent to users', 'Paging (lesson 3), compressed images, sending only needed fields'],
          ['Logs and monitoring', 'Requests and how much you write per request', 'Sampling noisy lines, retention by purpose, never logging bodies'],
          ['Other paid APIs (SMS, email, maps)', 'Each message or lookup', 'Rate limits, caching results, batching, confirmation before bulk sends'],
          ['Automation (CI minutes, agent runs)', 'Pushes, test time and agent turns', 'Concurrency cancel (lesson 7), time limits, caps on agent turns'],
        ],
        caption: 'What grows when more people use the app.',
      },
      { type: 'heading', text: 'A cost model you can do on paper' },
      {
        type: 'paragraph',
        text: 'You do not need a finance team to see where a bill is heading. Estimate the biggest driver with one line of arithmetic: users × calls per user per day × days × size of each call × the rate for that size. Tindahan Reminders’ weekly-summary feature is the only AI cost. We wrote the formula as a function and used **cost units** with made-up rates, because the point is how the numbers move, not what any provider charges. Plug in your provider’s real rate when you do this for real.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The model: the cost of the AI feature for a month, in made-up cost units',
        code: `function monthlyCost(users, callsPerDay, tokensPerCall, costPer1kTokens) {
  return users * callsPerDay * 30 * (tokensPerCall / 1000) * costPer1kTokens;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the model on four situations (cost units per month)',
        code: `today: 300 users, 3 calls, 800 tokens        8640
prompt trimmed to 500 tokens                 5400
and a cap of 2 calls per user per day        3600
success: 3000 users, same habits             86400`,
      },
      {
        type: 'paragraph',
        text: 'Two lessons sit in those four lines. First, **success multiplies the bill**: ten times the users is ten times the cost, so a feature that is comfortable today can be impossible at ten times the size, unless the business earns more per user as well. Second, the cheap levers are on the *shape* of each call: trimming the prompt cut the cost by more than a third, and a cap of two calls per person per day cut it again, and neither touched the quality much. The word **token** just means a small piece of text (a few characters), and it is the unit most AI services count. Notice too that this was a ten-second calculation. It is easy to ask an AI assistant to build you a better one with your real numbers; it is much harder to recover from a bill you never estimated.',
      },
      {
        type: 'paragraph',
        text: 'The levers that exist for AI calls are worth knowing by name. **Prompt caching** lets a provider reuse the part of a prompt that stays the same between calls (a long, fixed set of instructions, for example), which reduces both cost and delay; Anthropic’s API describes it with a `cache_control` setting. **Batch processing** sends many requests together to be answered later, trading speed for cost, which suits work nobody is waiting for, such as nightly summaries. A **smaller model** for easy tasks and a **maximum answer length** keep the size of each call down. An **application cache** can reuse an answer for an identical question, but keep lesson 3’s warning in mind: a cache that serves a stale balance is worse than a slow query.',
      },
      { type: 'heading', text: 'Limits, alerts and an off switch' },
      {
        type: 'paragraph',
        text: 'The scary bills are not caused by popularity but by accidents: a retry loop with no limit (lesson 2) that calls a paid API all night, an agent that gets stuck in a loop, a bot that discovers your endpoint, a free tier that quietly ends. So put three guards around any paid call. A **per-user limit**: the OWASP API Security list names unrestricted resource consumption as a risk precisely because per-request fees from third-party providers can turn an unlimited endpoint into a cost attack, and it recommends limits on rate and size and spending limits with providers, or billing alerts where caps are not possible. A **spend alert**: set a budget with an alert at, say, half and at the full amount, and know that many cloud budgets only *alert* and do not stop spending. And an **off switch**: a setting that turns the AI feature off (showing the fallback from lesson 2) without a new release, so that when the alert fires at night you can stop the meter in a minute.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a store that gives free prepaid load to every customer who asks. At ten customers it costs almost nothing. At ten thousand, the store goes broke unless it limits how much each person can ask for, watches the total, and has a way to say “no more today”. A *token* is a small piece of text, roughly a short word or part of one; AI services usually charge for the tokens they read and write. A *budget alert* is a message that tells you when spending reaches a number you chose. In the function above, `users * callsPerDay * 30` counts all the calls in a month, and the rest multiplies by how big each call is and what it costs, like quantity times price at a market stall.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Do unit economics, not just totals: cost per active user, per feature and per request, against revenue per user, because usage is heavy-tailed and a few users often drive most of the bill; look at the p95 user, not the mean. Attribute spend with labels or per-feature API keys so you can see which feature costs what, and chart cost next to latency and error rate. Design the cost controls into the architecture: quotas per tenant, backpressure and queueing, routing easy tasks to cheaper models, caching with a stated freshness guarantee, a circuit breaker that trips the paid dependency off at a spend threshold, and a reconciled kill switch. Remember the hidden multipliers: retries across layers, agent loops, fan-out, log volume per request, and data egress. Treat provider prices as inputs that change, keep them in configuration, and re-run the model when they or your usage do.',
      },
      {
        type: 'prompt',
        label: 'Ask AI to build a cost model from your real numbers and find the biggest lever',
        text: 'Build a small script that models the monthly cost of this app. Read the code to find every paid call (AI, SMS, email, maps, storage) and list them. For each, ask me for the unit rate and expected volume, and put those in a config object at the top, not hard-coded in the formula. Then print the monthly cost at today’s volume, at 10 times the volume, and with each of these changes applied one at a time: a shorter prompt, a cap per user per day, and a cheaper model for simple tasks. Mark any number you had to assume. Also list where a bug (a retry loop, an agent loop, an unauthenticated endpoint) could multiply the cost, and propose a limit and an alert for each. Do not call any paid API while doing this.',
      },
      {
        type: 'warning',
        text: 'Never test your cost controls by running the real paid service in a loop. Use a local fake that counts calls, or the provider’s test mode, and check that the limit trips when the count reaches the cap. Budgets and alerts report spending after it happens; the per-user limit and the off switch are what stop it.',
      },
      {
        type: 'version',
        text: 'Checked against the Claude API documentation: prompt caching lets the API resume from a previously seen prompt prefix, reducing latency and cost for repetitive prompts, and is enabled with `cache_control`; the Message Batches API processes large volumes of requests asynchronously, suited to work that does not need an immediate answer, trading speed for lower cost. Checked against Google Cloud’s documentation: a Cloud Billing budget monitors spending against a planned amount and sends alerts at thresholds you set, and an alerts-only budget does not cap spending. Checked against the OWASP API Security Top 10 (2023), API4: advises rate limits, payload size limits, timeouts and spending limits or billing alerts. Pricing, discounts and model names differ by provider and change often, so this lesson states none: read the provider’s current pricing page.',
        checked: CHECKED,
        sources: [DOCS.promptCaching, DOCS.batchApi, DOCS.gcpBudgets, DOCS.owaspApi4],
      },
      {
        type: 'takeaways',
        items: [
          'A product has a meter: costs grow with users, calls per user and the size of each call, and success multiplies the bill.',
          'Estimate the biggest driver on paper with one formula and compare changes (shorter prompts, caps, cheaper models) before building them.',
          'The biggest cost surprises are accidents (retry loops, agent loops, open endpoints), so cap them per user and keep an off switch.',
          'Budgets and alerts report spending, and many do not stop it: the limits and the switch do.',
          'This course states no prices: look up your provider’s current rates and keep them in configuration.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-11-code-challenge-1',
          kind: 'code-challenge',
          title: 'The monthly cost of the AI feature',
          prompt: 'Write `monthlyCost(users, callsPerDay, tokensPerCall, costPer1kTokens)`. Each user makes `callsPerDay` AI calls every day for 30 days, each call uses `tokensPerCall` tokens, and the price is `costPer1kTokens` cost units for every 1,000 tokens. Return the month’s total in cost units.',
          concept: 'cost model',
          language: 'javascript',
          starter: 'function monthlyCost(users, callsPerDay, tokensPerCall, costPer1kTokens) {\n  // total cost units for a 30-day month\n}',
          tests: {
            kind: 'function',
            fn: 'monthlyCost',
            cases: [
              { label: '100 users, 2 calls, 1000 tokens, 1 unit per 1k', args: [100, 2, 1000, 1], expected: 6000 },
              { label: '500 users, 4 calls, 500 tokens, half a unit per 1k', args: [500, 4, 500, 0.5], expected: 15000 },
              { label: 'no users cost nothing', args: [0, 3, 800, 0.4], expected: 0 },
              { label: '10 users, 3 calls, 2000 tokens', args: [10, 3, 2000, 0.5], expected: 900, hidden: true },
            ],
          },
          solution: 'function monthlyCost(users, callsPerDay, tokensPerCall, costPer1kTokens) {\n  return users * callsPerDay * 30 * (tokensPerCall / 1000) * costPer1kTokens;\n}',
          hints: [
            'First count the calls in a month: users × calls per day × 30.',
            'Each call uses tokensPerCall tokens, and the price is for every 1,000 of them, so divide the tokens by 1000.',
            'Multiply the number of calls by (tokensPerCall / 1000) and then by costPer1kTokens.',
          ],
          explanation: 'Calls in a month times tokens per call (in thousands) times the rate gives the total. The same shape of formula works for SMS messages, storage or any other metered cost.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-11-scenario-1',
          kind: 'scenario',
          title: 'The bill that jumped overnight',
          prompt: 'You wake to a spend alert: yesterday’s AI cost was twenty times the normal amount, with no change in the number of users. What do you do first?',
          concept: 'cost incident',
          situation: 'The AI feature has a fallback and a setting that turns it off. The logs show one account made thousands of calls in a few hours.',
          options: [
            { text: 'Turn the AI feature off (fallback on), then inspect the logs for the account and the endpoint, and add a per-user limit before turning it back on.', consequence: 'The meter stops within minutes. You find the endpoint had no limit and an automated script was calling it. After the limit is added, it is safe to switch the feature back on.', quality: 'best' },
            { text: 'Increase the budget so that the alert stops firing, and look at the logs later in the week.', consequence: 'The alert goes quiet and the calls continue. By the time you read the logs, the cost has grown further.', quality: 'poor' },
            { text: 'Delete the API key at the provider, which stops the spending immediately.', consequence: 'Spending stops, but so does the whole feature with no fallback in place, and you must reissue keys and redeploy before anything works.', quality: 'acceptable' },
          ],
          hints: [
            'What can you do in a minute that stops the meter without breaking the app?',
            'A raised budget changes the alert but not the spending.',
            'Switch the feature off with its fallback, then find the cause and add a limit before returning.',
          ],
          explanation: 'The off switch exists for this moment: it stops the cost quickly and leaves the app usable with a fallback. The investigation and the new limit make it safe to turn back on.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-11-match-1',
          kind: 'match',
          title: 'The cost, and the guard that fits it',
          prompt: 'Match each risk of a surprise bill to the guard that answers it best.',
          concept: 'cost controls',
          labels: { terms: 'The risk', meanings: 'The guard' },
          pairs: [
            { term: 'One user, or a bot, calls the AI endpoint thousands of times a day', definition: 'A per-user rate and daily call limit', note: 'Unrestricted consumption is stopped by limits tied to the caller.' },
            { term: 'A long, fixed set of instructions is sent with every request', definition: 'Prompt caching of the unchanged part', note: 'Reusing the unchanged prefix lowers both cost and delay.' },
            { term: 'A nightly summary of every customer does not need an instant answer', definition: 'Batch processing', note: 'Asynchronous batches trade speed for lower cost when nobody is waiting.' },
            { term: 'Spending rises quietly over a month with no one noticing until the invoice', definition: 'A budget with alerts at set thresholds', note: 'A budget watches the total and tells you early. It reports spending but does not by itself stop it.' },
          ],
          hints: [
            'Ask whether the risk is about who is calling, what is sent, when it is needed, or noticing too late.',
            'The nightly job is the only one where waiting is acceptable.',
            'A budget alert is about noticing; a limit is about stopping.',
          ],
          explanation: 'Each guard answers one kind of cost risk. Limits stop abuse, caching and batching make normal use cheaper, and budgets make slow growth visible.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-11-q1',
        prompt: 'In the cost model, going from 300 to 3,000 users with the same habits changed the monthly cost from 8,640 to 86,400 units. What does that show?',
        choices: [
          'Costs grow with usage, so a feature that is fine today can be unaffordable at ten times the size',
          'The model must contain a mistake, because ten times the users would cost less per person than before',
          'AI costs are fixed each month, so the second figure only reflects a change in the price',
          'Larger apps always get cheaper per user, so the real cost would be lower than the model says',
        ],
        answer: 0,
        explanation: 'With the same calls per user, cost scales with the number of users. Planning for success means checking that the economics still work at the larger size.',
      },
      {
        id: 'production-ai-apps-11-q2',
        prompt: 'Which change cut the modelled cost the most without removing the feature?',
        choices: [
          'Doubling the number of users, to share the fixed costs between more people',
          'Turning on more detailed logging, so that the team can see where the money goes',
          'Switching the app to a different programming language that is known to run faster',
          'Trimming the prompt to 500 tokens and capping calls at two per user per day',
        ],
        answer: 3,
        explanation: 'The cost depends on calls per user and tokens per call. Reducing both (5,400 and then 3,600 units in the run) lowers it a lot, and the other options either raise it or do nothing to the formula.',
      },
      {
        id: 'production-ai-apps-11-q3',
        prompt: 'A cloud budget is set with alerts at 50 and 100 percent of the planned amount. The AI feature starts running up a huge bill over a weekend. What does the budget do on its own?',
        choices: [
          'It switches the AI feature off at 100 percent, so the bill can never go over the plan',
          'It reports the spending through alerts, but an alerts-only budget does not stop it',
          'It refunds every cost above the planned amount at the end of the month',
          'It rewrites the prompts so that each call costs less than before',
        ],
        answer: 1,
        explanation: 'Google Cloud’s documentation says an alerts-only budget does not cap usage or spending. The limits and the off switch in your own app are what stop the meter.',
      },
      {
        id: 'production-ai-apps-11-q4',
        prompt: 'Which guard best protects a paid AI endpoint against one script calling it thousands of times?',
        choices: [
          'A longer timeout on each call, so that fewer calls are made in the same time',
          'Retrying every failed call at once, so that none of the answers are ever lost',
          'A per-user limit on calls, with a spend alert and an off switch behind it',
          'A shorter log retention period, so that the evidence of the calls is kept for less time',
        ],
        answer: 2,
        explanation: 'Limits tied to the caller stop the calls, the alert tells you if something gets past, and the switch lets you stop everything quickly. The other options do not limit the number of calls.',
      },
      {
        id: 'production-ai-apps-11-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a token in an AI service’s bill?',
        choices: [
          'A small piece of text, and the unit that many AI services use to count what they read and write',
          'A password that lets you use the service for free',
          'A coin you receive when the AI answers your question quickly, which you can spend later in the app',
        ],
        answer: 0,
        explanation: 'Many AI services measure the amount of text in tokens (roughly short words or pieces of words) and charge by the number read and written.',
      },
      {
        id: 'production-ai-apps-11-q6',
        audience: { min: 'advanced' },
        prompt: 'Your average cost per user looks affordable, but the monthly bill keeps overshooting the forecast. What is the most likely reason, and the best response?',
        choices: [
          'Usage is evenly spread, so the forecast arithmetic must be wrong; round every figure up to be safe',
          'The provider changes its prices every month, so forecasting cannot be done at all',
          'Usage is heavy-tailed, so a few users drive most of the cost; set quotas for them',
          'Costs are driven by the number of developers rather than by users, so reduce the team',
        ],
        answer: 2,
        explanation: 'Averages hide the tail. Per-user cost distributions are usually heavy-tailed, so look at the p95 and top users, attribute spend by feature, and add per-tenant quotas.',
      },
    ],
    task: {
      title: 'Put a meter on your own app',
      minutes: 18,
      steps: [
        'List every paid call in a project of yours (AI, SMS, email, maps, storage). If you have none, use the weekly-summary feature of the sample app.',
        'Write the `monthlyCost` function with your own numbers, using your provider’s current pricing page for the rate (write the rate in a comment with the date you read it).',
        'Print the cost today, at ten times the users, and after two changes: a shorter prompt and a cap per user per day. Write down which change helps most.',
        'Write down where an accident could multiply the cost (a retry loop, an open endpoint), and decide on one limit, one alert and one off switch for it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain the cost formula as quantity times price at a market stall, and to suggest two ways a small shop could limit how much free load each customer can ask for.'] },
      { audience: { min: 'advanced' }, steps: ['Add a per-user spend counter to a local fake of the AI service, trip a circuit breaker at a threshold, and show with a test that the breaker stops calls and the fallback takes over.'] },
    ],
  },
  {
    id: 'production-ai-apps-12',
    day: 12,
    title: 'Project: harden an app for real users',
    summary: 'Take a real app from “works in the demo” to “ready for named users”, in a sensible order, with a before-and-after evidence table and an honest readiness review.',
    minutes: 32,
    skills: ['production-readiness', 'incident-response'],
    intro: {
      objectives: [
        'Plan a hardening project: scope, baseline, order of work and what counts as done',
        'Build an evidence table that a client or teammate can check by rerunning your commands',
        'Write a one-page readiness review that is honest about who the app is ready for and what is still risky',
      ],
      why: 'Employers and clients do not hire “I used AI to build an app”; they hire “I can make an app safe to depend on, and show you how I know”. The evidence table and the readiness review are that proof.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A home inspector does not walk through a house saying “looks nice”. They check the wiring, the roof and the pipes, write down what they found, and at the end hand over a report that a buyer can trust. Your final project is the same job for software. You take an app, find what would hurt real users, fix the worst first, and finish with a report that shows each claim with proof. You have practised every piece in this course on the sample app; now you will do it on your own app. This lesson is the playbook, and the project steps are on the project card.',
      },
      {
        type: 'paragraph',
        text: '**Start by saying who the app is for.** “Ready” always means ready for someone: thirty friends testing on a Saturday is a different bar from three thousand paying customers. Write one sentence naming the users and the three worst things that could happen to them (for example: someone reads another person’s data, their data is lost, the app is down during the day they need it). Those three sentences decide your order of work, because you fix the worst harm first.',
      },
      {
        type: 'paragraph',
        text: '**Then take a baseline before you change anything.** Run the readiness-review prompt from lesson 1 on your app and answer the six questions with “yes”, “no” or “no evidence”. Save the answers and the commands that produced them. If you skip this, you cannot show a before and an after, and the improvements will be impossible to prove.',
      },
      {
        type: 'table',
        headers: ['Order', 'Work', 'Why this position', 'Lesson'],
        rows: [
          ['1', 'Backup and a restore drill', 'Everything else can be fixed later; lost data cannot', '6'],
          ['2', 'Access control, input checks, size and rate limits', 'Stops strangers from reading or writing what they should not', '4'],
          ['3', 'Timeouts, retries and fallbacks on outside calls', 'Keeps one slow service from taking the app down', '2'],
          ['4', 'Structured logs, a health check and two alerts', 'You will learn about the next problem from your tools', '5'],
          ['5', 'CI, a secret scan and a smoke test, wired to a release routine', 'Stops regressions and makes releasing boring', '7, 8'],
          ['6', 'Measure and fix the slowest path', 'Only after measuring, and only one change at a time', '3'],
          ['7', 'Runbook and a postmortem template', 'So the next incident starts calm', '9'],
          ['8', 'Instructions file, one place per idea, a cost model with a cap and a switch', 'So the next month of changes stays safe and affordable', '10, 11'],
        ],
        caption: 'A sensible order: highest harm first. Adjust it using your own three worst outcomes.',
      },
      { type: 'heading', text: 'The evidence table' },
      {
        type: 'paragraph',
        text: 'The heart of the project is a table with one row per area and four columns: what was wrong **before**, with the evidence; what is true **after**, with the evidence; and the **command** that anyone can run to see it. Evidence means a number, an output or a file, not a feeling. Here is the sample app’s table, built from the real runs in this course. Use it as the shape, and fill yours with your own results.',
      },
      {
        type: 'table',
        headers: ['Area', 'Before (evidence)', 'After (evidence)', 'How to reproduce'],
        rows: [
          ['Failure handling', 'AI service hangs: the old call was still waiting when we stopped it at 2004 ms', 'Falls back after about 1061 ms with a plain message; recovers on the 3rd try when the service is flaky', 'resilience script, three modes'],
          ['Performance', 'List endpoint: p50 1.76 ms, p95 2.18 ms, 100 rows, scan plan', 'p50 0.01 ms, p95 0.02 ms, 20 rows, index search plan', 'perf script, same data, 200 runs'],
          ['Security', 'Unsigned write saved (201), “not a date” accepted, role taken from the body, stack trace in a 500', '401, 422, owner from the token, 400 without internals, 429 on the 4th request, 413 on a large body', 'curl calls in the security demo'],
          ['Logs and alerts', 'No request log, no health check, nobody told about errors', 'One JSON line per request with a request id; alert rule fires on 25% errors and on slow p95, quiet at night', 'run the server, grep the log, run the alert script'],
          ['Data', 'No backup; a delete without where emptied the table', 'Restore drill: integrity ok, 3 customers and 4 reminders back, 0 foreign key problems', 'drill script'],
          ['Checks', 'No CI, a planted key and a broken limiter would both ship', 'CI with 3 tests and a secret scan; the scan caught a planted key and a test failed on the broken limiter', 'npm test, plant, break, rerun'],
          ['Release', 'Deploy and hope', 'Smoke test of 3 checks: exit code 0 on the good build, 1 when sign-in was missing', 'smoke script against two builds'],
          ['Incidents', 'No plan', 'A runbook for the error-rate alert and a blameless postmortem template', 'documents in the repository'],
        ],
        caption: 'The sample app’s evidence table. The numbers come from one laptop and will differ on yours; the habit of attaching a rerunnable command is what to copy.',
      },
      {
        type: 'paragraph',
        text: 'Be honest about what you did **not** test. A row that says “not tested: concurrent load, a real restore from the cloud copy” is worth more than a row of confident ticks, because a reader can trust the rest. Likewise do not state an improvement you cannot reproduce. If a number moved because you changed the data, say so.',
      },
      { type: 'heading', text: 'Working with agents on the hardening itself' },
      {
        type: 'paragraph',
        text: 'AI coding tools are very good at this kind of job if you steer them, and they can also quietly remove a protection while “refactoring”, as in the incident of lesson 9. A reliable pattern is: **one area per change**, a **failing test or measurement first**, then the change, then the **same test or measurement again**, and a short diff you read yourself, looking especially for deleted checks, loosened limits and new dependencies. Keep your instructions file open in every session, and finish each one by asking the agent to list what it changed and what it was unable to verify.',
      },
      {
        type: 'prompt',
        label: 'The master prompt for one hardening step',
        text: 'We are hardening this app for real users, one area at a time. This session is about: [AREA, e.g. access control and input checks]. The users are [WHO] and the worst outcomes we are preventing are [THREE OUTCOMES]. Steps: (1) write a script or failing tests that demonstrate the current weakness with real requests and show me the output; (2) propose the smallest change that fixes it and wait for my approval; (3) apply only that change; (4) rerun the same script or tests and show the before and after side by side; (5) list every file you changed, anything you removed, any dependency you added, and anything you could not verify. Do not touch other areas, do not weaken any existing check, and do not claim anything is fixed without showing the output.',
      },
      { type: 'heading', text: 'The readiness review' },
      {
        type: 'paragraph',
        text: 'Finish with one page. It names who the app is ready for and who it is not yet ready for. It includes the evidence table, the three worst outcomes and how each is now prevented, detected or recoverable, the known risks you have **chosen to accept** and who accepted them, and the next three things you would do. Such a page is what a client signs off on and what a new teammate reads on their first day. It also keeps you honest: if you cannot fill a section, you have found the next piece of work.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *baseline* is the “before” photo: how things were before you changed them. An *evidence table* is a before-and-after comparison with proof you can check, like photos of the same room before and after cleaning. You do not have to harden everything: pick the three worst things that could happen to your users, fix those first, and write down honestly what is still left. A smaller, honest, finished project is far better than a big one that is half done. Ask your AI assistant to walk you through one area at a time and to explain each result in plain words.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Scope the hardening with a short threat model and agreed service level objectives so “done” is measurable: availability and a latency percentile for the main paths, a recovery point and recovery time for each data store. Add load and soak tests with an open-loop generator, a failure drill (kill a dependency, fill a disk, expire a certificate), a restore drill from the offsite copy, and a game-day exercise of the runbook with someone who did not write it. Evidence should be automated where possible (CI jobs, scheduled drills, dashboards) so it stays true after the project ends. For a team, record accepted risks in decision records with owners and review dates, define who is on call and how pages are escalated, and agree guardrails for agents (scoped credentials, approval gates, protected checks) as part of the production design, not as an afterthought.',
      },
      {
        type: 'takeaways',
        items: [
          'Start from who the app is for and the three worst outcomes; they decide the order of work.',
          'Capture a baseline before changing anything, so every improvement can be shown as a before and an after.',
          'Harden in a sensible order: data and access first, then failure handling, visibility, checks and release, performance, runbooks, maintainability and cost.',
          'Evidence is a number, an output or a file plus a command anyone can rerun; say plainly what you did not test.',
          'End with a one-page readiness review: ready for whom, accepted risks and owners, and the next three steps.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-12-arrange-1',
          kind: 'arrange',
          title: 'The order of a hardening project',
          prompt: 'Put the steps of a hardening project in a sensible order, first at the top.',
          concept: 'hardening order',
          language: 'text',
          solution: [
            'Name the users and the three worst outcomes',
            'Take a baseline with the six-question review',
            'Set up backup and run a restore drill',
            'Fix access control and input checks',
            'Add timeouts, retries and logging with alerts',
            'Write the evidence table and the readiness review',
          ],
          reasons: [
            'The worst outcomes decide everything that follows.',
            'Without a baseline there is no before to compare with.',
            'Lost data cannot be fixed later, so the safety net comes first.',
            'Stopping strangers from reading or writing is the next-largest harm.',
            'Resilience and visibility come once the biggest harms are covered.',
            'The report comes last, because it summarises evidence you have gathered.',
          ],
          hints: [
            'What do you need to know before you can decide what to fix first?',
            'Which problems can never be repaired after the fact?',
            'The final report depends on everything before it.',
          ],
          explanation: 'Outcomes, baseline, data, access, resilience and visibility, report. Each step uses the one before, and the highest-harm work comes earliest.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-12-scenario-1',
          kind: 'scenario',
          title: 'Two days before launch',
          prompt: 'A client wants to launch to 500 customers on Friday. It is Wednesday morning. The AI-built app passes its demo, has no backup, trusts a user id sent by the browser, and has no logs. You have two days. What is your plan?',
          concept: 'hardening under a deadline',
          situation: 'The client has agreed that you can launch to a smaller group first if you explain why.',
          options: [
            { text: 'Do the baseline in an hour, then fix in order: a backup and restore drill, the user-id trust problem, basic logs and a health check, a smoke test. Launch to a small group Friday and write down what is not yet covered.', consequence: 'The worst harms (lost data, one customer reading another’s data) are closed and visible, and the client gets an honest list of what remains for the next week.', quality: 'best' },
            { text: 'Spend both days making the interface prettier so the launch impresses people.', consequence: 'The launch looks good until a customer edits an id in the address bar and reads someone else’s data, and there is no backup to repair any damage.', quality: 'poor' },
            { text: 'Refuse to launch until every one of the six questions has a perfect answer.', consequence: 'Nothing ships, the client loses confidence, and the real risks still go unfixed because there is no plan to work through them in order.', quality: 'acceptable' },
          ],
          hints: [
            'Which two weaknesses could hurt customers most, and cannot be repaired later?',
            'Is “perfect” possible in two days, and who benefits from waiting?',
            'Close the worst harms first, launch small, and be honest about what is left.',
          ],
          explanation: 'Time-boxed hardening is about ordering by harm and being honest. A smaller, safer launch with a clear list of what remains beats both a pretty unsafe one and a launch that never happens.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'production-ai-apps-12-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Is that evidence?',
          prompt: 'Each card shows a claim from a draft readiness review. Say whether it is evidence before you tap, then check what would make it strong.',
          concept: 'what counts as evidence',
          cards: [
            { front: '“We have backups.”', back: 'A claim, not evidence. Show the restore drill: the command, integrity_check ok, the row counts and the date it last ran.' },
            { front: '“Security is handled; the agent reviewed it.”', back: 'A first pass only. Show the real requests and the 401, 422, 429 and 413 responses, plus a test with two users for object-level access.' },
            { front: '“The app is fast.”', back: 'A feeling. Show p50 and p95 from a script you can rerun on the same data, before and after the change.' },
            { front: '“All tests pass.”', back: 'Only as strong as the tests. Show that a deliberately broken limiter or a missing sign-in check turns a test red.' },
          ],
          hints: ['For each claim, ask what you could show to someone who does not trust you.'],
          explanation: 'Evidence is something a doubtful reader can rerun or inspect. A claim becomes evidence when you attach the command, the output and the date.',
        },
      },
    ],
    quiz: [
      {
        id: 'production-ai-apps-12-q1',
        prompt: 'What should you do before changing anything in a hardening project?',
        choices: [
          'Ask the agent to rewrite the whole app in the safest style it knows, so that there is nothing left to harden',
          'Add the monitoring tools first, so that you can watch the app while you change it',
          'Take a baseline with the six-question review and save the commands and outputs',
          'Delete every feature that is not essential, so that there is less code that can break',
        ],
        answer: 2,
        explanation: 'Without a baseline, you cannot show a before and an after, so improvements stay unproven. The baseline also tells you what the worst gaps are.',
      },
      {
        id: 'production-ai-apps-12-q2',
        prompt: 'Which pair of areas should usually be tackled first?',
        choices: [
          'A dashboard with many charts and a much longer list of automated alerts',
          'Interface polish and a faster build pipeline',
          'Cost optimisation and a cleaner project folder',
          'Backups with a restore drill, and access control with input checks',
        ],
        answer: 3,
        explanation: 'Lost data and strangers reading or writing data are the harms that cannot be repaired later. Polish, dashboards and cost tuning matter less if those fail.',
      },
      {
        id: 'production-ai-apps-12-q3',
        prompt: 'Which of these is evidence in an evidence table?',
        choices: [
          'A sentence saying that the performance is good enough for users',
          'A screenshot of a green icon with no information about what it checks',
          'An agent’s summary that says it reviewed the code carefully',
          'The p50 and p95 before and after, from a command anyone can rerun',
        ],
        answer: 3,
        explanation: 'Evidence can be rerun or inspected. The other items are claims or unexplained symbols that a sceptical reader cannot check.',
      },
      {
        id: 'production-ai-apps-12-q4',
        prompt: 'How should you work with an AI agent on one hardening step?',
        choices: [
          'Let it fix every area in one long session, because a single pass saves the most time',
          'One area per change: a failing check first, then the change, then the same check, and read the diff',
          'Give it your full production credentials so that it can verify everything for itself',
          'Ask for the fixes only, with no tests, since tests would make the changes harder to review and slower to merge',
        ],
        answer: 1,
        explanation: 'A narrow, test-first change is easy to review and shows its own proof. A long session or broad access hides removed checks and unreviewed risk.',
      },
      {
        id: 'production-ai-apps-12-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a baseline?',
        choices: [
          'The final report you hand to a client',
          'A list of the people who built the app and what each of them did',
          'The “before” picture, so you can show the improvement later',
        ],
        answer: 2,
        explanation: 'A baseline is what you measured or observed before changing anything. Comparing against it is how you prove that a change helped.',
      },
      {
        id: 'production-ai-apps-12-q6',
        audience: { min: 'advanced' },
        prompt: 'Your readiness review says “ready for 30 invited users, not yet for public launch”. Why is that a good verdict?',
        choices: [
          'Readiness depends on the users and the harm, and it states accepted risks and what remains',
          'It avoids a decision, which keeps the team safe from blame if the launch goes badly later on',
          'It is only a polite way of saying the project failed, so it should be reworded',
          'It means the app has not been tested, since only a public launch is a real test',
        ],
        answer: 0,
        explanation: 'Ready is relative to the audience and the harm of failure. A specific verdict with accepted risks and next steps is more useful and more honest than a blanket yes or no.',
      },
    ],
    task: {
      title: 'Plan your hardening project',
      minutes: 20,
      steps: [
        'Choose the app you will harden (your own, or the “save a note” API an AI can generate for you). Write one sentence naming its users and three sentences naming the worst things that could happen to them.',
        'Run the readiness-review prompt from lesson 1 on it. Save the answers as your baseline, with the commands that produced them.',
        'Copy the evidence table from this lesson into a file and replace the “Before” column with what you found. Leave “After” empty for now.',
        'Order your eight areas by your three worst outcomes, and write the first change you will make, with the test or measurement you will run before and after.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Pick only three areas for your project (data, access and logs are a good start), and ask the AI to walk you through them one at a time, explaining every result in plain words.'] },
      { audience: { min: 'advanced' }, steps: ['Add one automated evidence job to CI (for example a scheduled restore drill that fails if the newest backup is older than your stated recovery point) and link it from the evidence table.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'production-ai-apps-p1',
    title: 'Break it on purpose: failures, speed and attacks',
    summary: 'Take a small app (yours, or one an AI generates) and prove, with scripts you can rerun, how it behaves when an outside service fails, when data grows and when someone sends bad requests, then fix the worst of each.',
    outcome: 'A repository with failure-injection, measurement and attack scripts and their before-and-after output shows a client that you test an AI-built app instead of trusting it.',
    unlockAfterDay: 6,
    steps: [
      { id: 'production-ai-apps-p1-s1', text: 'Choose a small app with one outside call (an AI or other web service), one list endpoint and one write endpoint. Write who its users are and the three worst outcomes for them.' },
      { id: 'production-ai-apps-p1-s2', audience: { max: 'beginner' }, text: 'If you do not have an app, ask an AI assistant to generate a tiny “save a note” server and a fake outside service that you can make hang. Ask it to explain each file in plain words before you run anything.' },
      { id: 'production-ai-apps-p1-s3', text: 'Write a failure-injection script (the service hangs, fails twice, works). Record the draft’s behaviour, then add a timeout, bounded retries and a fallback, and record the new behaviour with real timings.' },
      { id: 'production-ai-apps-p1-s4', text: 'Seed a realistic amount of data, measure the list endpoint’s p50 and p95 over 200 runs, look at its query plan, change one thing and measure again.' },
      { id: 'production-ai-apps-p1-s5', text: 'Attack your own write endpoint with curl: no sign-in, a made-up role, a bad date, broken JSON and an oversized body. Add authentication from a token, validation, size and rate limits, and record every status code before and after.' },
      { id: 'production-ai-apps-p1-s6', audience: { min: 'advanced' }, text: 'Add an object-level access test with two users, a retry budget so retries cannot multiply load, and a test that fails when the sign-in check is removed.' },
      { id: 'production-ai-apps-p1-s7', text: 'Add structured request logs with a request id, run a backup and restore drill, and write the “before and after” table for the first six areas.' },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your repository',
      placeholder: 'https://github.com/your-name/break-it-on-purpose',
      hint: 'The repository should contain the scripts, a README with the commands to rerun them, and the before-and-after output of each.',
    },
    rubric: [
      'Each area has a script that anyone can rerun, with real before and after output saved',
      'The failure handling has a timeout, a bounded number of retries and a fallback, and no retry of requests the server called wrong',
      'Latency is reported as p50 and p95 on the same data before and after, and the fix is explained',
      'Identity and role come from the server, inputs are validated, and size and rate limits answer with the right status codes',
      'Logs carry a request id and contain no passwords, tokens or personal details',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The README explains in plain words what each script does and what the results mean, and the project covers at least three of the areas with real output'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The app uses a real database and an outside service or a faithful fake, and the tests cover validation, a rate limit and a failure case'] },
      { audience: { min: 'advanced' }, items: ['A two-user test proves object-level access, the retry budget is demonstrated under concurrency, and the README states what was not tested'] },
    ],
  },
  {
    id: 'production-ai-apps-p2',
    title: 'Harden an app for real users',
    summary: 'Run the full hardening project on one app: baseline, backups with a restore drill, access control, failure handling, logs and alerts, CI and a release routine, a runbook, and a one-page readiness review with an evidence table.',
    outcome: 'An evidence table plus a readiness review shows an employer or client that you can make an AI-built app safe to depend on, and prove it.',
    unlockAfterDay: 11,
    steps: [
      { id: 'production-ai-apps-p2-s1', text: 'Write one sentence naming the app’s users and three sentences naming the worst outcomes. Run the six-question readiness review and save it as your baseline, with the commands.' },
      { id: 'production-ai-apps-p2-s2', audience: { max: 'beginner' }, text: 'Choose three areas (backup, access control and logs are a good start). For each, ask your AI assistant to explain the problem in plain words first, then make one change and show the result. Write the table for those three.' },
      { id: 'production-ai-apps-p2-s3', text: 'Set up backups and perform a restore drill (restore to a new file, integrity check, row counts, a spot-check). Record the output.' },
      { id: 'production-ai-apps-p2-s4', text: 'Harden access control and inputs, add timeouts, retries and a fallback to outside calls, and add structured logs, a health check and two alert rules with a runbook for each.' },
      { id: 'production-ai-apps-p2-s5', text: 'Add a CI workflow (install from the lockfile, checks, tests, secret scan, read-only permissions), prove two checks can fail, add a smoke test and write your release and rollback routine.' },
      { id: 'production-ai-apps-p2-s6', audience: { min: 'intermediate' }, text: 'Measure your slowest path in percentiles and fix it, add a short instructions file (AGENTS.md or CLAUDE.md) with your rules, and write a cost model with a per-user limit and an off switch for any paid call.' },
      { id: 'production-ai-apps-p2-s7', audience: { min: 'professional' }, text: 'Do the hardening with a coding agent on one area per branch, keep its diffs and your review notes as evidence, and include one case where you rejected or corrected its change.' },
      { id: 'production-ai-apps-p2-s8', text: 'Write the evidence table (area, before, after, command to reproduce) and a one-page readiness review: who the app is ready for, accepted risks with owners, and the next three steps. Paste both here.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your evidence table and readiness review',
      placeholder: 'Users and worst outcomes: ...\n\nEvidence table (area | before | after | command)\n...\n\nReadiness review: ready for ..., not yet ready for ...\nAccepted risks: ...\nNext three steps: ...',
      hint: 'Every row needs a command someone else can rerun, and the review must say plainly what was not tested.',
    },
    rubric: [
      'The users and three worst outcomes are named, and the order of work follows them',
      'A baseline exists and every improvement is shown as a before and an after with a command to reproduce it',
      'A restore drill was actually run, with integrity check and row counts shown',
      'Access control, input checks, limits, failure handling, logs and alerts are each evidenced, with a runbook for the alerts',
      'The readiness review is honest: it says who the app is ready for, which risks are accepted and by whom, and what was not tested',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The three chosen areas are explained in your own words and each has a real result, so a smaller, honest project is fine'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['CI runs on every pull request with a test that was shown failing, and a smoke test is part of the release routine'] },
      { audience: { min: 'advanced' }, items: ['Service level objectives, a recovery point and recovery time are stated, the restore drill is automated or scheduled, and the cost model includes a limit and an off switch'] },
      { audience: { min: 'professional' }, items: ['Agent-assisted changes are one area per branch with the diffs and your review evidence, including a change that you corrected or rejected, and the agent’s permissions are described'] },
    ],
  },
];

export const productionAiAppsCourse: Course = {
  id: 'production-ai-apps',
  kind: 'standard',
  title: 'Building Production-Ready Applications with AI',
  level: 'advanced',
  tagline: 'Take an app AI built for a demo and make it safe, fast, observable and ready for real people.',
  description: 'AI can build an app in an afternoon; real users need more than that. You will harden a small app step by step: failure handling, measured performance, defensible security, logs and alerts, tested backups, automated checks, a release routine and an incident plan, keeping evidence at each step.',
  finishLine: [
    'A hardened app with before-and-after evidence for failures, speed, security, logging and backups',
    'A CI workflow, a smoke test and a release and rollback routine you actually ran',
    'A runbook and a blameless incident write-up template for your own app',
    'A short readiness review you can hand to a client or a teammate',
  ],
  objectives: [
    'Judge whether an AI-built app is ready for real users using evidence for six production questions',
    'Add timeouts, retries and fallbacks to an app and prove they work with injected failures',
    'Measure latency in percentiles, find the slow path and confirm a fix with numbers',
    'Harden sign-in, input checks and limits, and write logs and alerts that tell you when something breaks',
    'Run a backup restore drill, and set up automated checks, a release routine and an incident runbook',
  ],
  audiences: ['experienced-dev', 'builder', 'career-changer'],
  skills: [
    { id: 'production-readiness', label: 'Production readiness' },
    { id: 'failure-handling', label: 'Failure handling' },
    { id: 'performance', label: 'Measuring performance' },
    { id: 'security-hardening', label: 'Security hardening' },
    { id: 'observability', label: 'Logs and alerts' },
    { id: 'data-protection', label: 'Protecting data' },
    { id: 'automated-checks', label: 'Automated checks' },
    { id: 'release-routine', label: 'Release routine' },
    { id: 'incident-response', label: 'Incident response' },
    { id: 'maintainability-and-cost', label: 'Maintainability and cost' },
  ],
  lessons,
  projects,
  icon: 'verified_user',
  updated: '2026-11-14',
};
