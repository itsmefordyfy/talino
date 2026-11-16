import type { Course, Lesson, Project } from '../../types';

// Sources opened and read on 2026-11-14. Spec-driven tooling changes quickly: every statement about a product lives in a dated version note.
// The running example (Kuya Ben's booking feature, its acceptance tests and the pass/fail counts shown in the lessons) was written and run with Node 22 on 2026-11-14.
const CHECKED = '2026-11-14';

const DOCS = {
  specKit: { label: 'GitHub: github/spec-kit (README)', url: 'https://github.com/github/spec-kit' },
  specKitMethod: { label: 'GitHub: Spec Kit, spec-driven.md', url: 'https://github.com/github/spec-kit/blob/main/spec-driven.md' },
  specKitBlog: { label: 'GitHub Blog: Spec-driven development with AI', url: 'https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/' },
  claudeBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  claudeModes: { label: 'Claude Code docs: Permission modes (plan mode)', url: 'https://code.claude.com/docs/en/permission-modes' },
  claudeWorkflows: { label: 'Claude Code docs: Common workflows', url: 'https://code.claude.com/docs/en/common-workflows' },
  claudeMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  cursorPlan: { label: 'Cursor docs: Plan Mode', url: 'https://cursor.com/docs/agent/plan-mode' },
  cursorBest: { label: 'Cursor blog: Best practices for coding with agents', url: 'https://cursor.com/blog/agent-best-practices' },
  codexSlash: { label: 'Codex docs: Slash commands in Codex CLI', url: 'https://learn.chatgpt.com/docs/cli/slash-commands' },
  codexBest: { label: 'Codex docs: Best practices', url: 'https://learn.chatgpt.com/guides/best-practices' },
  nodeTest: { label: 'Node.js docs: Test runner (node:test)', url: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
  ghCodeowners: { label: 'GitHub Docs: About code owners', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners' },
  ghPrTemplate: { label: 'GitHub Docs: Creating a pull request template', url: 'https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository' },
};

const lessons: Lesson[] = [
  {
    id: 'spec-driven-dev-01',
    day: 1,
    title: 'Why specs make AI building reliable',
    summary: 'What a spec is, why an AI that builds from one gives you something you can check, and how much spec a change deserves.',
    intro: {
      objectives: [
        'Explain what a spec is and how it differs from a prompt',
        'Name the four problems that appear when AI builds with no written spec',
        'Describe the spec-driven loop from idea to shipped feature',
        'Choose how much spec a change deserves',
      ],
      why: 'AI builds fast, so a vague request produces a lot of wrong work quickly. A written spec is the cheapest way to get a result you can check, whether you are building your own app, a client project or a team feature.',
    },
    minutes: 20,
    skills: ['spec-first'],
    body: [
      { type: 'paragraph', text: "Ask an AI assistant three times: 'Build a booking page for Kuya Ben's barbershop.' You will get three different apps. One asks every customer to create an account. One lets two people book the same time. One forgets to ask for a phone number. Nothing is wrong with the AI. Your request left almost everything open, so it filled each gap with a guess, and the guesses differ every time. This course teaches the habit that fixes that: write down what the feature must do, check the work against it, and let the AI build to it. That habit is called **spec-driven development**." },
      { type: 'heading', text: 'A spec is something you can point at' },
      { type: 'paragraph', text: "A **spec** (short for specification) is a written description of what a feature must do, precise enough that you can look at the finished work and say 'yes, that matches' or 'no, it does not'. A prompt is a message that disappears into a chat. A spec is a file in your project. You, your teammates and every future AI session read the same file. The authors of GitHub's Spec Kit call a spec 'a contract for how your code should behave', and they stress the human's job: the AI generates the documents, and you make sure they are right." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a spec is a clear list of what the app must do. Think of an order form you give a tailor: size, colour, buttons, when you need it. A tailor who only hears 'make me a shirt' will guess, and you will not know whether the shirt is wrong until you wear it. With the form in hand, you can hold the finished shirt next to each line and tick it off. A **feature** is one thing your app can do, such as booking a haircut. A **requirement** is one line of the list, such as 'a booking cannot overlap another booking'." },
      { type: 'heading', text: 'Four problems when the AI builds with no spec' },
      {
        type: 'list',
        items: [
          '**Hidden guesses.** The AI fills every gap with a decision, and you only discover the decisions by reading code or by a customer finding them.',
          '**No yardstick.** Without a list of what must be true, review means "it looks right to me".',
          '**Memory in a chat.** Next week a new session has never heard of last week\'s decisions and may quietly contradict them.',
          '**Different versions everywhere.** Two people, or two tools, each build their own idea of the feature.',
        ],
      },
      { type: 'heading', text: 'The spec-driven loop' },
      { type: 'paragraph', text: "The loop has the same shape in every tool, and each step is one lesson of this course. You write the **spec**: what the feature must do and why. You turn it into a **design**: how it will be built. You break the design into **tasks**: small pieces the AI can build one at a time. You write **acceptance tests**: checks that decide when a task is done. The AI builds one task. You **review** the result against the spec. If something is missing, you go around again. When the product changes, you change the spec first." },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The spec-driven loop. A review that finds a gap goes back to building; a product change goes back to the spec.',
        source: 'flowchart TD\n  A[Idea] --> B[Spec: what and why]\n  B --> C[Design: how]\n  C --> D[Tasks: small pieces]\n  D --> E[Acceptance tests: when is it done]\n  E --> F[Build one task]\n  F --> G[Review against the spec]\n  G -->|gap found| F\n  G -->|all criteria met| H(Shipped)\n  H -->|the product changes| B',
      },
      { type: 'heading', text: 'What the tools call it' },
      {
        type: 'table',
        headers: ['Tool', 'Its version of the idea', 'Where the spec lives'],
        rows: [
          ['GitHub Spec Kit', 'Spec-driven development: define what to build and why, then turn the specification into a plan, tasks and working code.', 'Files in your project, written by commands such as specify, plan and tasks.'],
          ['Claude Code', 'Plan mode proposes changes before any edit. You can also ask Claude to interview you and write a SPEC.md, then build from it in a fresh session.', 'A SPEC.md you own and can review.'],
          ['Cursor', 'Plan Mode researches, asks questions and drafts a plan you can edit before building.', 'A Markdown plan, which you can save into the project.'],
          ['Codex', 'A /plan command that proposes a plan before work starts; project instructions say what done means and how to verify it.', 'A plan in the chat, plus your own instruction files.'],
        ],
        caption: 'Different words, the same shape: write it down, review it, then build.',
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. GitHub's Spec Kit README describes spec-driven development as defining what to build and why, then turning the specification into a plan, tasks and working code. Its minimal flow lists constitution (once per project), specify, plan, tasks, implement and converge, written as /speckit-specify and so on; the project's reference page writes the same commands with a dot (/speckit.specify), so check which spelling your agent uses. Claude Code's best-practices page suggests asking Claude to interview you and write the result to SPEC.md, and plan mode starts with Shift+Tab or /plan. Cursor's Plan Mode also starts with Shift+Tab, and saved plans go under .cursor/plans/. In Codex, /plan switches the chat into plan mode and is unavailable while Codex is already working. Shortcuts and command names change often: re-check before relying on one.",
        checked: CHECKED,
        sources: [DOCS.specKit, DOCS.specKitBlog, DOCS.claudeBest, DOCS.claudeModes, DOCS.cursorPlan, DOCS.cursorBest, DOCS.codexSlash],
      },
      {
        type: 'details',
        summary: 'Other tools use the same idea: Kiro',
        body: [
          "Kiro, an AI editor, describes a spec as a structured artifact that produces three files for a feature: requirements.md (user stories and acceptance criteria), design.md (architecture and how it will be built) and tasks.md (the plan, as discrete trackable tasks). That is the same requirements, design and tasks shape you will build in this course. We read Kiro's documentation on 2026-11-14. Its site is not yet on Talino's list of official source hosts, so look at kiro.dev/docs/specs yourself for the current details.",
        ],
      },
      { type: 'heading', text: 'How much spec does a change deserve?' },
      {
        type: 'table',
        headers: ['The change', 'The spec it needs'],
        rows: [
          ['Make the Book now button green', 'None. One line in your prompt.'],
          ['Add a phone number field to a form', 'A few acceptance criteria written in the prompt.'],
          ['A new flow with rules, such as booking, checkout or sign-up', 'A full spec: stories, criteria, constraints, non-goals, a design, tasks and tests.'],
          ['Anything hard to undo, such as payments or personal data', 'A full spec, and a person reviews it before anyone builds.'],
        ],
        caption: 'Spend your words where a wrong guess costs the most.',
      },
      { type: 'paragraph', text: "Through the whole course one feature travels from idea to shipped: **online booking for Kuya Ben's Barbershop**, where a customer picks a service and a time and gets a confirmed slot. You will read the real spec, design, task list and acceptance tests. We also wrote a small reference implementation and ran it, so every test result shown in these lessons is a result we actually got. You do not have to write code. Your job is the one AI cannot do for you: deciding what the feature must do, and checking that it does." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "For an engineer, the spec is an interface between people and agents, and the unit of review moves upstream: a wrong sentence in a spec is cheaper to fix than a wrong module, and a reviewer can read a one-page spec faster than a 600-line diff. The real risks are familiar ones in new clothes. Specs drift from the code unless something enforces the link; an over-detailed spec becomes a second, untested codebase; and a confident-looking spec can hide an assumption nobody checked. Keep the spec to behaviour (what must be observable), keep identifiers on every requirement so tests and tasks can point at them, and treat spec changes as reviewable changes." },
      { type: 'tip', text: 'The one-sentence test: can you say what the feature must do, and how you will know it works, in two sentences a stranger would understand? If not, you are not ready to ask an AI to build it.' },
      {
        type: 'takeaways',
        items: [
          'A spec is a written description of what a feature must do, precise enough to check the result against it.',
          'Without one, the AI fills every gap with a guess, you have no yardstick, and decisions are lost with the chat.',
          'The loop is the same in every tool: spec, design, tasks, acceptance tests, build one task, review against the spec.',
          'Match the size of the spec to the cost of a wrong guess: none for a colour, a full spec for a booking flow.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-01-match-1',
          kind: 'match',
          title: 'How much spec does each change need?',
          prompt: 'Match each change to the amount of written spec it deserves.',
          concept: 'right-sizing a spec',
          labels: { terms: 'The change', meanings: 'The spec it deserves' },
          pairs: [
            { term: 'Change the Book now button from blue to green', definition: 'One line in the prompt', note: 'A wrong guess here costs nothing and shows at once.' },
            { term: 'Add a phone number field to the booking form', definition: 'A few acceptance criteria in the prompt', note: 'A small rule (what counts as a valid number) needs to be stated, but not a document.' },
            { term: 'Build the booking flow with opening hours and no double booking', definition: 'A full spec with stories, criteria and tests', note: 'Several rules interact, so each must be written down and checkable.' },
            { term: 'Let customers pay a deposit by card', definition: 'A full spec that a person reviews before anyone builds', note: 'Money and personal data are hard to undo, so a person reads the spec first.' },
          ],
          hints: [
            'Ask for each change: how costly is a wrong guess, and how soon would anyone notice?',
            'A colour is noticed at once and costs nothing. Money is expensive and hard to undo.',
            'The booking flow has rules that interact, so it needs a full spec. The deposit needs that plus a review before building.',
          ],
          explanation: 'The size of a spec follows the cost of a wrong guess and how long it can stay hidden. A colour needs one line. A flow with interacting rules needs a full spec. Anything involving money or personal data also needs a person to review the spec before it is built.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-01-scenario-1',
          kind: 'scenario',
          title: 'The chat is not the spec',
          prompt: 'Choose what Mika should do before her next session.',
          concept: 'a spec outlives the chat',
          story: 'Mika is building the booking page with an AI assistant.',
          situation: "Mika says: 'I explained every rule in the chat, so the chat is my spec.' Two weeks later she opens a new session to add a feature. The new session builds a booking form that allows 15-minute start times, which she had ruled out in the first week. What should she do before the next session?",
          options: [
            { text: 'Write the rules she decided into a spec.md file in the project and start every session by pointing the AI at it.', consequence: 'The rules now live in a file that every session, teammate and reviewer reads. The 15-minute mistake can be checked against a written line.', quality: 'best' },
            { text: 'Scroll back through the old chat and paste as much of it as fits into the new session.', consequence: 'Some rules come across, but the pasted chat also holds rejected ideas and half-decisions. The AI cannot tell which were final.', quality: 'acceptable' },
            { text: 'Tell the new session to remember the old chat.', consequence: 'A new session has no access to the old one. It answers confidently and guesses again.', quality: 'poor' },
            { text: 'Write a longer first prompt next time and hope it covers everything.', consequence: 'A longer prompt is still a chat message. It vanishes into history, and nobody can review it as a file.', quality: 'poor' },
          ],
          hints: [
            'What survives from one session to the next? Not the chat.',
            'Where does a team or a future AI session look for the decisions of this project?',
            'Put the decisions in a file in the project, and point every session at it.',
          ],
          explanation: 'A spec earns its place by outliving the chat. A file in the project is read the same way by every session and every person, and a reviewer can point at the exact line a build broke.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-01-q1',
        prompt: 'What is the main difference between a prompt and a spec?',
        choices: [
          'A spec is written in a special programming language that AI tools require',
          'A spec is a longer prompt, so the AI pays more attention to every word',
          'A spec is a prompt that has been approved by the AI tool before it builds',
          'A file in the project that everyone reads and can check work against',
        ],
        answer: 3,
        explanation: 'Length and format are not the point. A spec is a durable, shared file: people and tools read the same thing, and you can compare the finished work with it.',
      },
      {
        id: 'spec-driven-dev-01-q2',
        prompt: 'You ask an AI for a booking page three times and get three different apps. What is the most likely reason?',
        choices: [
          'The AI is not capable enough to build booking pages reliably',
          'The request left decisions open, so the AI guessed',
          'You should have asked in a more polite and friendly tone',
          'The AI always changes its design to keep users interested',
        ],
        answer: 1,
        explanation: 'Every gap in a request is filled with a guess, and guesses vary between runs. Writing the decisions down removes the room to guess.',
      },
      {
        id: 'spec-driven-dev-01-q3',
        prompt: 'Which change deserves a full spec with a person reviewing it before anything is built?',
        choices: [
          'Letting customers pay a deposit by card when they book',
          'Changing the colour of a button on the home page, a change anyone can see and undo at once',
          'Fixing a spelling mistake in the shop address',
          'Making the page title one word shorter',
        ],
        answer: 0,
        explanation: 'Money and personal data are hard to undo, and a wrong guess there costs real harm. The other changes are small and visible at once.',
      },
      {
        id: 'spec-driven-dev-01-q4',
        prompt: 'In the spec-driven loop, what happens when a review finds that a requirement is not met?',
        choices: [
          'The spec is deleted because it failed to describe the work',
          'The feature ships anyway and the gap is noted for later',
          'Go back to building, aiming at the missing requirement',
          'The AI rewrites the whole feature from the start',
        ],
        answer: 2,
        explanation: 'Review exists to find gaps against the spec. A gap sends you back to build exactly that piece, not to restart or to ship with a known hole.',
      },
      {
        id: 'spec-driven-dev-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a spec?',
        choices: [
          'A short program that the AI writes before it writes the real app',
          'A clear list of what the app must do, to tick off when built',
          'A password that lets the AI tool open your project files',
          'A picture of what the finished app screen looks like',
        ],
        answer: 1,
        explanation: 'A spec is a checkable list of what the app must do, like an order form for a tailor. It is words, not code.',
      },
      {
        id: 'spec-driven-dev-01-q6',
        audience: { min: 'advanced' },
        prompt: 'A team writes 40-page specs with implementation detail for every function. Which risk are they most exposed to?',
        choices: [
          'The AI tools will refuse to read documents that long',
          'The product owner will no longer be needed on the project',
          'The spec becomes a second, untested codebase that drifts',
          'Acceptance tests can no longer be written for such a feature',
        ],
        answer: 2,
        explanation: 'Over-detailed specs duplicate the code in prose. Nothing checks the prose, so it drifts. Specs should describe observable behaviour and leave the how to the design.',
      },
    ],
    task: {
      title: 'Find the guesses in one request',
      minutes: 15,
      steps: [
        'Pick a feature you might really build (a booking page, a checkout, a sign-up).',
        "Write the one-line request you would give an AI, as you would normally type it.",
        'List five decisions the AI would have to guess to build it (who can use it, what is refused, what is out of scope, what counts as done).',
        'Turn the five guesses into five lines in a new file called spec.md. These are the start of your spec.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant: "What would you have to guess to build this?" Compare its list with yours and add anything you missed to spec.md.'] },
      { audience: { min: 'advanced' }, steps: ['For each guess, note what it would cost to get wrong in production and who would notice first. Rank the five by cost and mark the top two as items that need a human reviewer.'] },
    ],
  },
  {
    id: 'spec-driven-dev-02',
    day: 2,
    title: 'Writing requirements an AI can build from',
    summary: 'User stories, acceptance criteria, constraints and non-goals, written so two people would agree on whether each one is met.',
    intro: {
      objectives: [
        'Write a user story with acceptance criteria that are either true or false',
        'Rewrite a vague requirement into a testable one',
        'List constraints, non-goals and open questions in a spec',
        'Ask an AI to interview you and draft the spec',
      ],
      why: 'The requirements are the part of the spec an AI builds from and you check against. If a line cannot be marked true or false, neither the AI nor you can tell whether it was met.',
    },
    minutes: 25,
    skills: ['requirements-ac'],
    body: [
      { type: 'paragraph', text: "Lesson 1 said a spec is a file you can check work against. This lesson writes its heart: the requirements. The Prompt Engineering for Software Development course taught the first steps (stating a goal and a check in a prompt). Here the requirements leave the prompt and become a document that survives the chat, is reviewed by other people, and is numbered so every task and test can point at it. The running example is the booking feature for Kuya Ben's Barbershop." },
      { type: 'heading', text: 'The parts of a requirements document' },
      {
        type: 'list',
        items: [
          '**Why:** two or three sentences on the problem. It lets the AI (and you) decide sensible things the spec forgot.',
          '**Users:** who uses the feature and in what situation.',
          '**Stories with acceptance criteria:** what each user wants to do, and the true-or-false statements that say it works.',
          '**Constraints:** rules the build must obey whatever it does, such as privacy or time zones.',
          '**Non-goals:** things the feature will deliberately not do.',
          '**Open questions:** decisions nobody has made yet, written down so nobody guesses them.',
        ],
      },
      { type: 'heading', text: 'A story and its acceptance criteria' },
      { type: 'paragraph', text: "A **user story** says who wants what and why, in one sentence: 'As a customer, I want to pick a start time so that I know when to arrive.' It keeps the person in view. An **acceptance criterion** is one statement that is either true or false once the feature is built, usually with a small example: 'A haircut booked for 10:00 AM is confirmed and ends at 10:30 AM.' A story says what is wanted; its criteria say how you will know." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a **user story** is one sentence about a real person and what they want to do. An **acceptance criterion** is a yes-or-no check you can do on the finished app, such as 'if I type 10:15 as the start time, the app refuses it'. If you cannot answer yes or no, the line is not a criterion yet. Numbering them (R1-AC1, R1-AC2) is only a way of giving each check a name, so you, the AI and your tests can all say 'this one'." },
      { type: 'heading', text: 'The testability test' },
      { type: 'paragraph', text: "For every line, ask: could two sensible people disagree about whether the finished feature meets this? If they could, the line is vague. Vague lines are where the AI's guesses live, because it will pick the reading that is easiest to build. Replace feelings with examples and numbers, and replace 'handle' and 'support' with what visibly happens." },
      {
        type: 'table',
        headers: ['Vague requirement', 'Why it fails the test', 'A testable version'],
        rows: [
          ['Prevent double booking', "It does not say what counts as an overlap, or whether back-to-back is fine.", 'A booking that overlaps an existing booking on the same day is refused. A booking that starts exactly when another ends is allowed.'],
          ['Validate the phone number', "Valid by whose rule?", 'A phone number must be 11 digits and start with 09, otherwise the booking is refused.'],
          ['Confirm quickly', "Quickly for whom?", 'After the customer presses Confirm, the confirmation screen shows within 2 seconds on a mid-range phone.'],
          ['Show helpful errors', "Helpful is a feeling.", 'Every refusal shows one sentence that says what to change and contains no codes.'],
        ],
        caption: 'Each testable version could be checked by someone who has never met the author.',
      },
      { type: 'heading', text: 'Non-goals and open questions are not optional' },
      { type: 'paragraph', text: "AI tools like to help, so they add things you never asked for: a login, a payment step, a reminders page. Each addition is code you must read, test and maintain. A short list of **non-goals** ('no payments, no accounts, no online cancelling in version 1') is the cheapest protection. An **open question** is the honest version of a guess: you write 'Does the shop close for lunch?' and an owner, instead of letting the AI choose. GitHub's Spec Kit method says the same about its AI: when something is not specified, the template asks it to mark a gap for clarification rather than fill it in." },
      { type: 'heading', text: 'The full requirements for the booking feature' },
      { type: 'paragraph', text: "This is the real file the rest of the course builds from. Read it as a reviewer: for each line, ask the testability question." },
      {
        type: 'code',
        language: 'markdown',
        label: 'specs/booking/spec.md (version 1)',
        code: `# Spec: Book a haircut (Kuya Ben's Barbershop)
Status: Draft v1 | Owner: Ben | Date: 2026-12-01

## Why
Customers message Ben on Messenger to ask for a time. He answers
between haircuts, forgets some requests, and sometimes books two
people at once. He wants a page where a customer picks a service and
a time and gets a confirmed slot.

## Users
- Customer: books from a phone, often on mobile data.
- Ben: the only barber.

## Stories and acceptance criteria

### R1 Choose a service and a time
As a customer, I want to pick a service and a start time so that I
know when to arrive.
Services: Haircut (30 minutes), Cut and beard (60 minutes).
The shop is open 9:00 AM to 6:00 PM.
- R1-AC1 A haircut booked for 10:00 AM is confirmed and ends at 10:30 AM.
- R1-AC2 A start time that is not on the hour or half hour (for
  example 10:15 AM) is refused.
- R1-AC3 A service that would end after 6:00 PM (for example a
  Cut and beard at 5:30 PM) is refused.
- R1-AC4 A haircut from 5:30 PM to 6:00 PM is allowed.

### R2 No double booking
As Ben, I want each time to hold one customer so that I never serve
two people at once.
- R2-AC1 A booking that overlaps an existing booking on the same day
  is refused and nothing is saved.
- R2-AC2 A booking that starts exactly when another ends is allowed.
- R2-AC3 The same time on a different day is allowed.

### R3 Customer details
As Ben, I want a name and a phone number so that I can reach the
customer.
- R3-AC1 A blank name (empty or only spaces) is refused.
- R3-AC2 A phone number must be 11 digits starting with 09,
  otherwise the booking is refused.

### R4 Pressing Confirm twice books once
As a customer on a weak signal, I want to press Confirm again
without booking twice.
- R4-AC1 Sending the same request twice saves one booking and
  returns the first booking.

### R5 Plain-words messages
As a customer, I want to know what to change when a booking is
refused.
- R5-AC1 Every refusal shows one sentence in plain words and no codes.

## Constraints
- C1 Times are stored as minutes after midnight, Philippine Time.
- C2 A customer's name and phone are used only to contact them about
  their booking, and are never written to logs.

## Non-goals (version 1)
No payments or deposits. No customer accounts or login. No online
cancelling or rescheduling. No second barber. No SMS reminders.

## Open questions
- Q1 Does Ben close for lunch? (Owner: Ben. Needed before launch.)`,
      },
      { type: 'heading', text: 'Let the AI interview you' },
      { type: 'paragraph', text: "You do not have to write this alone. Claude Code's guidance suggests asking the AI to interview you until it could write the spec, then to write the file. The same prompt works in any assistant. The point is that the AI asks the questions you did not think of, and you decide the answers." },
      {
        type: 'prompt',
        label: 'Prompt: interview me, then write the spec',
        text: `I want to add online booking to Kuya Ben's Barbershop. Customers pick a service and a time on their phones. I have not thought it through yet.

Interview me, a few questions at a time, until you could write the spec. Ask about: who uses it, what the rules are, what must be refused, what is out of scope, and what I have not decided yet.

Then write specs/booking/spec.md with these sections: Why, Users, Stories with acceptance criteria (every criterion numbered like R1-AC1 and either true or false, with an example), Constraints, Non-goals, Open questions. Do not decide anything I did not tell you: put it under Open questions. Do not describe how to build it.`,
      },
      { type: 'tip', text: "Say what, not how. 'A booking that overlaps another is refused' is a requirement. 'Use a database lock to prevent overlaps' is a design decision, and it belongs in the next lesson." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Treat requirement text like an API. Give every requirement a stable identifier and never reuse one, so tasks, tests and commits can reference it for years. Put non-functional requirements in the same testable form (a threshold, a condition, a way to measure) instead of adjectives, and name the failure behaviour, not only the happy path: for a booking system, what happens on a duplicate submit, a clock change, a concurrent request. Look for requirements that conflict (quick confirmation versus a slow external check) and resolve them in the spec, not in code. Add a review gate: a spec with an unowned open question does not start building." },
      {
        type: 'version',
        text: "Checked 2026-11-14. In GitHub's Spec Kit, specify turns a natural-language description into spec.md, focused on what and why rather than the tech stack, and clarify asks targeted questions about underspecified areas and writes the answers back into the spec; the reference page describes up to five questions. The project's methodology document says its templates make the AI mark gaps instead of guessing. Claude Code's best-practices page shows the interview-then-SPEC.md pattern used above. Command names differ between tools and releases.",
        checked: CHECKED,
        sources: [DOCS.specKit, DOCS.specKitMethod, DOCS.claudeBest],
      },
      {
        type: 'takeaways',
        items: [
          'A requirements document has a why, users, stories with criteria, constraints, non-goals and open questions.',
          'An acceptance criterion is a statement that is either true or false, usually with a small example.',
          'If two sensible people could disagree about whether a line is met, rewrite it with a number or an example.',
          'Non-goals and open questions stop the AI from guessing or adding what you did not ask for.',
          'Requirements say what must be observable; how to build it belongs in the design.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-02-scenario-1',
          kind: 'scenario',
          title: 'Is this requirement testable?',
          prompt: 'Choose the rewrite that turns the vague line into one that can be checked.',
          concept: 'testable requirements',
          story: 'You are reviewing an AI-drafted spec for the booking page.',
          situation: "The draft has one line under R4: 'The booking should be confirmed quickly and reliably.' Your teammate asks you to rewrite it so it can be checked. Which rewrite is best?",
          options: [
            { text: 'After Confirm is pressed, the confirmation screen shows within 2 seconds on a mid-range phone, and if the same request is sent twice only one booking is saved.', consequence: 'Both halves can be tried by someone who has never met the author, and each is a clear pass or fail.', quality: 'best' },
            { text: 'The booking is confirmed in a fast and dependable way for all customers.', consequence: 'It sounds better but says the same thing in new adjectives. Two people still disagree about what fast and dependable mean.', quality: 'poor' },
            { text: 'Use a queue and retry logic so confirmations never fail.', consequence: 'This is a design decision that the AI may or may not need. It also promises that nothing ever fails, which nobody can test.', quality: 'poor' },
            { text: 'The booking is confirmed within 2 seconds.', consequence: 'Better, because it has a number, but it does not say on what phone or connection, and it drops the reliability half of the original line.', quality: 'acceptable' },
          ],
          hints: [
            'Ask: could two people disagree about whether this line is met?',
            'Look for a number, a condition and an example in the rewrite.',
            'The best option keeps both halves of the original line and makes each one a pass or fail check.',
          ],
          explanation: 'A testable rewrite names a measurable result, the conditions it holds under, and what happens in the failure case. Adjectives and design choices do not give a reviewer anything to tick.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-02-fix-bug-1',
          kind: 'fix-bug',
          title: 'Rewrite the vague requirement',
          prompt: 'One line of this requirement is too vague for an AI to build from or a person to check. Tap that line, then choose the best rewrite.',
          concept: 'testable acceptance criteria',
          language: 'markdown',
          code: `### R2 No double booking
As Ben, I want each time to hold one customer so that I never serve two people at once.
- The system should handle conflicting bookings properly.
- A booking that starts exactly when another ends is allowed.`,
          bugLine: 3,
          fixes: [
            { line: '- A booking that overlaps an existing booking on the same day is refused and nothing is saved.', correct: true, why: 'It says what counts (an overlap on the same day), what happens (refused) and what must not happen (nothing saved). Anyone can try it and see a pass or fail.' },
            { line: '- The system should refuse bad bookings quickly and show a friendly error.', correct: false, why: 'It swaps one vague word for several more: bad, quickly, friendly. It still does not say which bookings are refused.' },
            { line: '- Conflicting bookings are prevented using a database lock.', correct: false, why: 'This is a design decision, not a requirement. The owner cannot check a lock, and a correct system could prevent overlaps without one.' },
            { line: '- The system should handle all booking conflicts robustly and reliably.', correct: false, why: 'Robustly and reliably are adjectives, and all conflicts is not a list. Two people would still disagree about whether it is met.' },
          ],
          lineNote: 'That line is fine. Look for the line that uses a word like handle or properly instead of saying what visibly happens.',
          hints: [
            'Which line could two people disagree about?',
            "Look at the word 'properly'. What would an overlapping booking visibly do?",
            'The best rewrite says which bookings are refused and that nothing is saved.',
          ],
          explanation: 'A criterion should describe what a person would see: the overlap is refused and nothing is saved. How the system prevents it is a design choice for the next lesson.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-02-q1',
        prompt: 'Which statement is an acceptance criterion?',
        choices: [
          'The booking page should feel modern and professional',
          'Ben wants customers to book without calling him',
          'Use a clean layout with large buttons on small phones',
          'A haircut booked for 10:00 AM ends at 10:30 AM',
        ],
        answer: 3,
        explanation: 'It is either true or false once the feature exists, and it includes an example. The other lines are a feeling, a story motive and a design preference.',
      },
      {
        id: 'spec-driven-dev-02-q2',
        prompt: 'Why write a non-goals list into a spec?',
        choices: [
          'It lists what the feature will not do, so the AI never adds it',
          'It lists the features the AI is expected to build last',
          'It makes the spec longer so reviewers take it more seriously',
          'It shows which parts of the feature can be skipped if time runs out',
        ],
        answer: 0,
        explanation: 'AI tools often add login, payments or reminders unasked. A non-goals list rules those out and keeps the build small enough to review.',
      },
      {
        id: 'spec-driven-dev-02-q3',
        prompt: "A requirement says 'Use a database lock so two people cannot book the same time.' What is wrong with it as a requirement?",
        choices: [
          'Locks are too slow to be used in a booking system',
          'It says how, not what: only the visible result can be checked',
          'It should have been written as a user story starting with As a',
          'It is correct, because requirements should name the technology to use',
        ],
        answer: 1,
        explanation: 'Requirements describe observable behaviour. The lock is a design choice that might change; the requirement is that an overlapping booking is refused.',
      },
      {
        id: 'spec-driven-dev-02-q4',
        prompt: "The spec has an open question: 'Does Ben close for lunch?' with Ben named as owner. Why is that better than letting the AI decide?",
        choices: [
          'It shows the gap openly so a person answers it',
          'The AI cannot make decisions about opening hours at all',
          'Open questions are checked automatically by the tests',
          'It prevents the feature from ever being built until Ben replies',
        ],
        answer: 0,
        explanation: 'An unwritten gap becomes a hidden guess. Writing it down with an owner makes the decision visible, and the answer goes into the spec.',
      },
      {
        id: 'spec-driven-dev-02-q5',
        audience: { max: 'beginner' },
        prompt: "Which is a yes-or-no check you could do on the finished app?",
        choices: [
          'The booking page is easy to use for every kind of customer',
          'Customers will like the new design, and the shop owner will too',
          'The app looks friendly',
          'If I type 10:15 as the start time, the app refuses it',
        ],
        answer: 3,
        explanation: 'You can type 10:15 and see whether the app refuses it. The others are opinions with no yes-or-no answer.',
      },
      {
        id: 'spec-driven-dev-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Two requirements conflict: confirmations must appear within 2 seconds, and every booking must pass a slow external check. Where should the conflict be resolved?',
        choices: [
          'In the code, by whichever developer meets it first',
          'In the tests, by lowering the time limit until they pass',
          'In the spec, by a decision the owner records before building',
          'In the design, by adding a cache without telling the owner',
        ],
        answer: 2,
        explanation: 'A conflict between requirements is a product decision. Resolving it silently in code or tests hides a trade-off the owner should own and record.',
      },
    ],
    task: {
      title: 'Write one story with testable criteria',
      minutes: 20,
      steps: [
        'Take the feature from Lesson 1 and write one user story: As a ..., I want ... so that ...',
        'Write four acceptance criteria for it. Give each a number such as R1-AC1 and include a small example.',
        'Apply the testability test: for each line, ask whether two people could disagree. Rewrite any line that fails.',
        'Add a Non-goals list with at least three things the feature will not do, and one Open question with an owner.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Paste your four criteria into an AI assistant and ask: "Which of these could two people disagree about, and why?" Rewrite the ones it names.'] },
      { audience: { min: 'advanced' }, steps: ['Add two non-functional criteria with a threshold and a way to measure each, and one failure-path criterion (a duplicate submit, a timeout). Mark any two requirements that might conflict.'] },
    ],
  },
  {
    id: 'spec-driven-dev-03',
    day: 3,
    title: 'From requirements to a design',
    summary: 'Turning what the feature must do into how it will be built: data, steps, decisions and a map from every requirement to the design.',
    intro: {
      objectives: [
        'Explain the difference between a requirement and a design decision',
        'Write a short design with data, behaviour and recorded decisions',
        'Map each requirement to the part of the design that serves it',
        'Use plan mode to draft a design and review it against the spec',
      ],
      why: 'If you do not decide how the feature is built, the AI will, and you will meet its choices only in code. A one-page design lets you review the choices before they exist.',
    },
    minutes: 25,
    skills: ['design-from-spec'],
    body: [
      { type: 'paragraph', text: "The spec says what the booking feature must do. It does not say where the data lives, what the function is called, what order the checks run in, or what happens when two checks fail at once. Those are design decisions. If you skip them, the AI makes them silently, and two sessions may make them differently. A **design** is a short document that records those decisions before code exists, so you can review them while they are still cheap to change." },
      { type: 'heading', text: 'Requirement or design decision?' },
      { type: 'paragraph', text: "A quick way to tell them apart: a requirement is something the owner could check without opening the code ('an overlapping booking is refused'). A design decision is a choice about how to get there ('times are stored as minutes after midnight'). Requirements come from the people the feature is for. Design decisions come from the people building it, and they must serve the requirements. When a design decision cannot be traced to a requirement, ask why it exists." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: the spec is what you want the house to have (three bedrooms, a kitchen). The design is the floor plan: where each room goes and how they connect. You do not need to know how to draw a floor plan to review one. You only need to ask, for each room, 'which of my wishes is this for?' A **data model** is just a description of the information the app keeps (for a booking: name, phone, service, day and start time). A **function** is one named step of the program, such as 'book a slot'." },
      { type: 'heading', text: 'What a short design contains' },
      {
        type: 'list',
        items: [
          '**Data:** what information is kept and in what form.',
          '**Behaviour:** the steps the feature takes, the inputs, the results and the errors, in order.',
          '**Decisions:** each important choice, with the reason and the option that was rejected.',
          '**Traceability:** a table that says which part of the design serves which requirement.',
          '**Risks and open points:** what you are unsure of.',
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One booking request through the design. The order of the checks is itself a decision, so it is written down.',
        source: 'sequenceDiagram\n  participant C as Customer form\n  participant B as book function\n  participant S as Shop data\n  C->>B: request with id, name, phone, service, day, start\n  B->>S: has this request id been seen?\n  S-->>B: no\n  B->>B: check name, phone, service, time grid, hours\n  B->>S: any overlap on this day?\n  S-->>B: no\n  B->>S: save booking and request id\n  B-->>C: ok with the booking',
      },
      { type: 'heading', text: 'The design for the booking feature' },
      {
        type: 'code',
        language: 'markdown',
        label: 'specs/booking/design.md (version 1)',
        code: `# Design: Book a haircut
Implements: specs/booking/spec.md v1

## Data
Booking = { id, name, phone, service, day, start, end }
- day is text like "2026-12-01"; start and end are minutes after
  midnight (9:00 AM = 540, 6:00 PM = 1080).
Shop = { bookings: [], byRequest: {} }  (in memory for version 1)

## Behaviour
book(shop, request) where request = { requestId, name, phone,
service, day, start } returns one of:
  { ok: true, booking, duplicate }   or   { ok: false, error }
messageFor(error) returns one plain sentence.

Checks run in this order and the first failure is reported:
1 duplicate requestId -> return the first booking (ok, duplicate)
2 name_required   3 bad_phone   4 unknown_service
5 off_grid        6 outside_hours   7 slot_taken
Only then is the booking saved.

## Decisions
D1 Times are whole minutes after midnight, not Date objects.
   Why: no time zone or daylight-saving surprises (C1).
   Rejected: ISO date-time strings (easy to get the zone wrong).
D2 The form sends a requestId made once per form.
   Why: pressing Confirm twice must book once (R4).
D3 The rules live in one file, booking.js, with no screen code.
   Why: they can be tested without a phone (all acceptance tests).
D4 Nothing about the customer is written to logs (C2).
D5 Overlap means start < other.end and other.start < end, so
   back-to-back bookings do not overlap (R2-AC2).

## Traceability
R1 -> checks 4, 5, 6, D1     R2 -> check 7, D5
R3 -> checks 2, 3, C2/D4     R4 -> check 1, D2
R5 -> messageFor

## Risks
Two phones booking the same time at the same moment need a
database that refuses the second one. Version 1 is in memory, so
this is not covered yet.`,
      },
      { type: 'paragraph', text: "Notice three things. The checks have an **order**, because a request can fail two rules at once and the customer should hear about one clear problem. Decision D5 turns an ambiguous word (overlap) into a rule that settles back-to-back bookings. And the last section is honest about a hole: version 1 cannot yet stop two phones booking the same time at the same instant. A design that names its risks is more useful than one that looks finished." },
      { type: 'heading', text: 'Use plan mode to draft it, then review it' },
      { type: 'paragraph', text: "Plan modes in AI coding tools are made for this step. They read your project, ask questions and propose a plan without changing files. In Claude Code you press Shift+Tab or start a prompt with /plan; in Cursor, Shift+Tab; in Codex, /plan; in Spec Kit, the plan command takes your technical direction. Then you review the design as you would review the spec." },
      {
        type: 'prompt',
        label: 'Prompt: draft the design from the spec',
        text: `Read specs/booking/spec.md. Do not write code yet.

Write specs/booking/design.md with: Data, Behaviour (inputs, results, errors, and the order the checks run in), Decisions (each with the reason and the option you rejected), Traceability (a table from every requirement id to the part of the design that serves it), and Risks.

Rules: every requirement R1 to R5 and constraint C1 and C2 must appear in the traceability table. Do not add features that are not in the spec. If the spec leaves something open, list it under Risks instead of choosing.`,
      },
      {
        type: 'paragraph',
        text: "Review the AI's draft with three questions. Does every requirement appear in the traceability table? Is there any decision you cannot trace to a requirement (it may be extra scope)? And what did it assume that you did not say? Send it back with corrections before anyone writes code.",
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "In a real system, write decisions in a lightweight record (context, decision, consequences, status) so a later change can mark one as superseded instead of silently deleting it. Look hardest at state ownership and failure: where is the single source of truth, what makes an operation safe to retry (here, an idempotency key), and what enforces an invariant under concurrency. An in-memory check-then-insert, like the one in this design, is correct on one thread and wrong with two simultaneous requests; the real fix is a uniqueness or exclusion constraint in the database plus handling its error. Name that in the Risks section so it becomes a task, not a surprise." },
      {
        type: 'version',
        text: "Checked 2026-11-14. In GitHub's Spec Kit, plan takes your technical direction (stack, storage) and generates design artifacts from the spec, so the tech stack lives in the plan and not in the spec. Claude Code enters plan mode with Shift+Tab or a /plan prefix; in plan mode Claude proposes a plan and makes no edits until you approve it, and Ctrl+G opens the proposed plan in your text editor. Cursor's Plan Mode lets you review and edit its plan through chat or Markdown files before building. Codex's /plan switches to plan mode and takes an optional inline prompt. Check each tool's current docs for exact keys.",
        checked: CHECKED,
        sources: [DOCS.specKit, DOCS.claudeModes, DOCS.cursorPlan, DOCS.codexSlash],
      },
      {
        type: 'takeaways',
        items: [
          'A requirement is checkable without opening the code; a design decision is a choice about how to build it.',
          'A short design holds data, behaviour, decisions with reasons, a traceability table and risks.',
          'The order of checks, and rules like what counts as an overlap, must be decided in writing.',
          'Use plan mode to draft the design, then review it: is every requirement traced, and is anything extra?',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-03-predict-output-1',
          kind: 'predict-output',
          title: 'Which error does the customer see?',
          prompt: 'This function follows the design: checks run in order and the first failure is reported. A customer submits a blank name and a phone number that is too short. What does the program print?',
          concept: 'order of checks',
          language: 'javascript',
          code: `function firstError(req) {
  if (req.name.trim() === '') return 'name_required';
  if (req.phone.length !== 11) return 'bad_phone';
  return 'ok';
}
console.log(firstError({ name: '   ', phone: '0917' }));
console.log(firstError({ name: 'Ben', phone: '0917' }));`,
          expected: 'name_required\nbad_phone',
          choices: ['name_required\nbad_phone', 'bad_phone\nbad_phone', 'name_required\nname_required', 'ok\nbad_phone'],
          wrongNotes: {
            'bad_phone\nbad_phone': 'The name is checked first, so a blank name is reported before the phone is looked at.',
            'name_required\nname_required': 'The second request has a real name, so the first check passes and the phone check reports.',
            'ok\nbad_phone': 'Three spaces trimmed is an empty string, so the first check fails and ok is never reached.',
          },
          hints: [
            'The function returns at the first check that fails.',
            "Trim removes the spaces, so '   ' becomes an empty string.",
            'First call: the name check fails. Second call: the name passes, the phone check fails.',
          ],
          explanation: 'Each return ends the function, so only the first failing check is reported. That is why the order is part of the design: with another order the same input would give a different message.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-03-match-1',
          kind: 'match',
          title: 'Which requirement does this decision serve?',
          prompt: 'Match each design decision to the requirement or constraint it exists for.',
          concept: 'traceability',
          labels: { terms: 'A design decision', meanings: 'The requirement it serves' },
          pairs: [
            { term: 'The form creates a requestId once, and the server remembers it', definition: 'R4: pressing Confirm twice books once', note: 'A remembered id is how a repeat is recognised.' },
            { term: 'Overlap means start < other.end and other.start < end', definition: 'R2-AC2: back-to-back bookings are allowed', note: 'Strictly-less-than is what lets one booking end exactly when the next begins.' },
            { term: 'Times are minutes after midnight, not Date objects', definition: 'C1: no time zone surprises', note: 'Whole minutes cannot shift with a zone or daylight saving.' },
            { term: 'Nothing about the customer is written to logs', definition: 'C2: name and phone are used only to contact them', note: 'Logs are read by many people and kept for a long time.' },
          ],
          hints: [
            'For each decision ask: what could go wrong for the owner or customer if it were different?',
            'Which requirement talks about pressing a button twice?',
            "Strictly less than is what makes a booking ending at 10:30 not overlap one starting at 10:30.",
          ],
          explanation: 'Every design decision should have a requirement or constraint behind it. If one does not, it may be extra scope, and a reviewer should ask why it is there.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-03-q1',
        prompt: 'Which sentence is a design decision rather than a requirement?',
        choices: [
          'An overlapping booking is refused and nothing is saved',
          'A haircut at 10:00 AM ends at 10:30 AM',
          'A blank name is refused with a plain message',
          'Times are stored as whole minutes after midnight',
        ],
        answer: 3,
        explanation: 'How times are stored is a choice about building the feature. The others are behaviour the owner could check without opening the code.',
      },
      {
        id: 'spec-driven-dev-03-q2',
        prompt: 'Why does the design say in what order the checks run?',
        choices: [
          'Tests cannot run unless the checks are in alphabetical order',
          'The order makes the program run faster on slow phones',
          'A request can fail two rules, and one clear error is reported',
          'The AI tools require an order to be written down before building',
        ],
        answer: 2,
        explanation: 'Without a stated order, two sessions could report different errors for the same request. The order makes behaviour predictable and testable.',
      },
      {
        id: 'spec-driven-dev-03-q3',
        prompt: 'You review an AI-drafted design and find a decision about sending SMS reminders that is not traced to any requirement. What do you do?',
        choices: [
          'Ask why it exists: remove it, or add a requirement',
          'Move it to the end of the file so it is easier to ignore',
          'Keep it, because extra features make the product more useful',
          'Delete the traceability table so the gap is not visible',
        ],
        answer: 0,
        explanation: 'A decision with no requirement behind it is probably scope creep. Either the spec is missing something the owner wants, or the design should shrink.',
      },
      {
        id: 'spec-driven-dev-03-q4',
        prompt: 'Why does the booking design list a risk about two phones booking at the same moment?',
        choices: [
          'Because booking features are not allowed to run on phones',
          'Because version 1 cannot refuse the second request',
          'To show reviewers that the design is long enough',
          'Because the acceptance tests already cover it completely',
        ],
        answer: 1,
        explanation: 'Naming a known hole turns a hidden bug into a visible task. The design says version 1 does not cover it, so nobody assumes it does.',
      },
      {
        id: 'spec-driven-dev-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the house comparison, what is the design?',
        choices: [
          'The list of what you want the house to have',
          'The bricks and wood that the house is made of',
          'The floor plan showing where each room goes',
          'The key that opens the front door',
        ],
        answer: 2,
        explanation: 'The spec is the wish list, the design is the floor plan, and the code is the house. You can review a floor plan by asking which wish each room serves.',
      },
      {
        id: 'spec-driven-dev-03-q6',
        audience: { min: 'advanced' },
        prompt: 'The design checks for an existing booking and then inserts the new one in two separate steps. What is the production risk?',
        choices: [
          'Two simultaneous requests can both pass the check and both insert, so the database needs a constraint to refuse the second',
          'The insert will always be slower than the check, which fails the speed requirement',
          'The check will return the wrong answer every time on a busy server',
          'Nothing, because a function can only run one request at a time',
        ],
        answer: 0,
        explanation: 'Check-then-insert is a race when two requests interleave. A uniqueness or exclusion constraint in the database enforces the rule where it cannot be bypassed.',
      },
    ],
    task: {
      title: 'Draft and review a design',
      minutes: 20,
      steps: [
        'Take the spec.md you wrote and open an AI tool in plan mode (or any assistant if you do not have one).',
        'Use the design prompt from this lesson, changed for your own feature, and ask for design.md.',
        'Check the traceability table: is every requirement in it? Mark any decision you cannot trace to a requirement.',
        'Write down two things the AI assumed that you did not say, and fix them in the spec or the design.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain this design as if to a shop owner who has never coded." If any part is unclear, ask it to rewrite that part in plainer words.'] },
      { audience: { min: 'advanced' }, steps: ['Add a Risks entry for one concurrency or failure case. State what would enforce the rule in production and which task will add it.'] },
    ],
  },
  {
    id: 'spec-driven-dev-04',
    day: 4,
    title: 'Breaking the work into tasks',
    summary: 'How to cut a design into small tasks that each cover named requirements, run in a safe order and end in a check.',
    intro: {
      objectives: [
        'Describe what makes a task small enough for an AI to build and a person to review',
        'Write a task with the requirements it covers, its files, its dependencies and a done check',
        'Check that every acceptance criterion is covered by some task',
        'Order tasks by what depends on what',
      ],
      why: 'A big request produces a big change that nobody can review. Small tasks with a check at the end let you accept, reject or redo one piece at a time.',
    },
    minutes: 20,
    skills: ['task-breakdown'],
    body: [
      { type: 'paragraph', text: "Imagine handing a builder one note that says 'build the house'. Nobody can inspect it halfway, and when something is wrong you cannot tell which part to redo. Now imagine a list: foundation, walls, roof, wiring, each with an inspection at the end. That second note is a task list. AI coding tools behave the same way. Ask for the whole booking feature in one go and you get a large change that mixes everything together. Ask for one small task at a time and you get a change you can read in a few minutes and check with a test." },
      { type: 'heading', text: 'What makes a good task' },
      {
        type: 'list',
        items: [
          '**One outcome.** A task does one thing. If its description needs the word "and" between two outcomes, it is two tasks.',
          '**Small.** It touches a few files and its change can be read in minutes. A good test is whether you could review it between two other jobs.',
          '**Traceable.** It names the requirements it covers (R3, R1-AC2), so you can see which part of the spec each task serves.',
          '**Checkable.** It ends with a "done when": the acceptance tests that must pass, and the rule that no test that passed before may fail now.',
          '**Ordered.** It says what must be finished first, so an AI never builds on something that does not exist yet.',
          '**Fenced.** It names the files it may change. Everything else is out of bounds.',
        ],
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a task list is a to-do list where every item has a way to tick it. A **task** is one small job, such as 'refuse a booking with a blank name'. 'Done when' is the way you know the job is finished: for example, 'the check called R3-AC1 passes'. A **dependency** means one job needs another to be finished first, like needing walls before a roof. Writing the list is not extra work: it is the step that turns a big wish into pieces an AI can actually finish." },
      { type: 'table', headers: ['A weak task', 'What is wrong', 'A better task'], rows: [
        ['Implement booking', 'Many outcomes in one, nothing to check halfway, a huge change to review.', 'T4 No double booking: refuse a booking that overlaps another on the same day. Done when R2-AC1 to R2-AC3 pass.'],
        ['Make it robust', 'Robust is not a result anyone can tick.', 'T5 Duplicate requests: a repeated request id returns the first booking. Done when R4-AC1 passes.'],
        ['Add validation and refactor the storage', 'Two outcomes: if the refactor goes wrong, the validation is lost with it.', 'Two tasks: T2 Customer details, and a separate storage task later.'],
      ], caption: 'Each better task has one outcome, names its requirements and ends in a test.' },
      { type: 'heading', text: 'The task list for the booking feature' },
      {
        type: 'code',
        language: 'markdown',
        label: 'specs/booking/tasks.md (version 1)',
        code: `# Tasks: Book a haircut
Implements: spec.md v1 and design.md v1.
Rule: build one task at a time. A task is done when its "Done when"
tests pass and no test that passed before now fails.

## T1 Skeleton and data
Covers: D1, D3
Files: src/booking/booking.js (new)
Do: export createShop(), the constants (opening 540, closing 1080,
  grid 30, services haircut 30 and cut-and-beard 60) and a book()
  that saves any request with no checks yet.
Done when: R1-AC1 passes.
Depends on: nothing

## T2 Customer details
Covers: R3, C2
Files: src/booking/booking.js
Do: add checks 2 and 3 (name_required, bad_phone). No logging.
Done when: R3-AC1 and R3-AC2 pass.
Depends on: T1

## T3 Time rules
Covers: R1, D1
Files: src/booking/booking.js
Do: add checks 4, 5 and 6 (unknown_service, off_grid, outside_hours).
Done when: R1-AC2, R1-AC3 and R1-AC4 pass.
Depends on: T1

## T4 No double booking
Covers: R2, D5
Files: src/booking/booking.js
Do: add check 7 (slot_taken) using the overlap rule in D5.
Done when: R2-AC1, R2-AC2 and R2-AC3 pass.
Depends on: T3 (the end time must be known)

## T5 Duplicate requests
Covers: R4, D2
Files: src/booking/booking.js
Do: add check 1: a repeated requestId returns the first booking
  with duplicate: true and saves nothing new.
Done when: R4-AC1 passes.
Depends on: T1

## T6 Plain-words messages and the form
Covers: R5
Files: src/booking/booking.js, src/screens/BookingForm.js
Do: add messageFor(error). Show its sentence on the form when a
  booking is refused.
Done when: R5-AC1 passes. Manual check: refuse a booking on the
  form and read the message aloud; it has no codes.
Depends on: T2, T4, T5`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'What depends on what. T2, T3 and T5 only need T1, so they could be built in any order, or at the same time by different people.',
        source: 'flowchart TD\n  T1[T1 Skeleton and data] --> T2[T2 Customer details]\n  T1 --> T3[T3 Time rules]\n  T1 --> T5[T5 Duplicate requests]\n  T3 --> T4[T4 No double booking]\n  T2 --> T6[T6 Messages and the form]\n  T4 --> T6\n  T5 --> T6',
      },
      { type: 'heading', text: 'Check the cover: every criterion needs a task' },
      { type: 'paragraph', text: "Before building, run a coverage check. Take every acceptance criterion from the spec and find the task that covers it. A criterion with no task will never be built. A task with no criterion is probably extra scope. For this feature the cover is complete: R1 is in T3, R2 in T4, R3 in T2, R4 in T5 and R5 in T6, and T1 covers the design decisions that everything else needs. In a long spec you would not do this by eye. You can ask the AI to produce the table, or run a read-only analysis step; GitHub's Spec Kit has one that reports conflicts, gaps and ambiguities across the spec, plan and tasks without changing any file." },
      {
        type: 'prompt',
        label: 'Prompt: break the design into tasks',
        text: `Read specs/booking/spec.md and specs/booking/design.md. Do not write code.

Write specs/booking/tasks.md. Each task must have: an id (T1, T2...), a title, Covers (requirement and decision ids), Files it may change, Do (one or two sentences), Done when (the acceptance criteria ids that must pass), and Depends on.

Rules: each task has one outcome and its change can be reviewed in minutes. Order by dependency. Every acceptance criterion in the spec must be covered by exactly one task. If a task has no requirement behind it, say so instead of keeping it.

After the list, add a coverage table: every R-AC id and the task that covers it.`,
      },
      { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "If you have built small projects before, you will recognise this as the habit of building a feature in thin steps. The difference with AI is that the step is also a contract: the AI is told which files it may touch and which tests define done, so a step that wanders is visible in the diff. Keep each task small enough that, if you reject it, throwing it away costs you minutes and not an afternoon." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Slice vertically where you can: a task that delivers a thin end-to-end behaviour is easier to verify than a layer (all the validation, then all the storage) whose value only appears at the end. Put the riskiest or least understood task first, or add a short spike with a throw-away result, so surprises arrive early. Write interfaces before consumers when tasks can run in parallel. Mark tasks that are safe to run concurrently (no shared files, no ordering) and give each agent its own git worktree, then merge in dependency order; two tasks that edit the same function will conflict, and that is a signal to re-cut them." },
      {
        type: 'version',
        text: "Checked 2026-11-14. In GitHub's Spec Kit, tasks generates a dependency-ordered list of actionable work from the design artifacts into tasks.md, and analyze reports conflicts, gaps and ambiguities across spec.md, plan.md and tasks.md; the documentation describes analyze as read-only. Cursor's agent guidance recommends plans that are Markdown files you can edit to remove unnecessary steps. Claude Code lets you run parallel sessions in separate git worktrees with claude --worktree followed by a name. Command names and options change between releases.",
        checked: CHECKED,
        sources: [DOCS.specKit, DOCS.cursorBest, DOCS.claudeWorkflows],
      },
      {
        type: 'takeaways',
        items: [
          'A good task has one outcome, is small, names the requirements it covers, ends in a check and says what it depends on.',
          'A "done when" line points at acceptance criteria, and no test that passed before may fail now.',
          'Check the cover: every criterion needs a task, and a task with no criterion is probably extra scope.',
          'Order by dependency. Tasks that share nothing can be built in any order, or in parallel.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-04-code-challenge-1',
          kind: 'code-challenge',
          title: 'Find the criteria no task covers',
          prompt: 'Write `uncovered(criteria, tasks)`. `criteria` is a list of criterion ids. `tasks` is a list of objects like `{ id: "T1", covers: ["R1-AC1"] }`. Return the criterion ids that no task covers, in the same order as `criteria`.',
          concept: 'coverage of requirements by tasks',
          language: 'javascript',
          starter: `function uncovered(criteria, tasks) {
  // return the criterion ids that no task lists in covers
  return [];
}`,
          solution: `function uncovered(criteria, tasks) {
  const covered = [];
  for (const task of tasks) {
    for (const id of task.covers) covered.push(id);
  }
  const missing = [];
  for (const id of criteria) {
    if (!covered.includes(id)) missing.push(id);
  }
  return missing;
}`,
          tests: {
            kind: 'function',
            fn: 'uncovered',
            cases: [
              { label: 'everything covered', args: [['R1-AC1', 'R1-AC2', 'R2-AC1'], [{ id: 'T1', covers: ['R1-AC1'] }, { id: 'T2', covers: ['R1-AC2', 'R2-AC1'] }]], expected: [] },
              { label: 'one criterion has no task', args: [['R1-AC1', 'R1-AC2', 'R2-AC1'], [{ id: 'T1', covers: ['R1-AC1'] }, { id: 'T2', covers: ['R1-AC2'] }]], expected: ['R2-AC1'] },
              { label: 'no tasks at all', args: [['R3-AC1', 'R3-AC2'], []], expected: ['R3-AC1', 'R3-AC2'] },
              { label: 'order of the criteria is kept', args: [['A', 'B', 'C'], [{ id: 'T1', covers: ['B'] }]], expected: ['A', 'C'] },
            ],
          },
          hints: [
            'First collect every id that some task covers into one list.',
            'Then walk through criteria in order and keep the ones that are not in that list.',
            'Use a loop over tasks, an inner loop over task.covers, then `covered.includes(id)` to test each criterion.',
          ],
          explanation: 'A coverage check is two passes: gather what the tasks cover, then keep each criterion that is not among them. The same check, run on every spec before building, finds criteria that would never be built.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-04-scenario-1',
          kind: 'scenario',
          title: 'The task that is too big',
          prompt: 'Choose how to handle the first task the AI proposed.',
          concept: 'task size and outcome',
          story: 'You asked an AI to break the booking design into tasks.',
          situation: "Its first task reads: 'T1 Implement booking: validation, overlap detection, duplicate handling, messages and the form. Done when the booking page works.' What do you do?",
          options: [
            { text: 'Ask it to split T1 into tasks with one outcome each, each naming the criteria that must pass and what it depends on.', consequence: 'You get six small tasks. Each can be built, tested and reviewed alone, and you can reject one without losing the rest.', quality: 'best' },
            { text: 'Accept T1 but ask the AI to work slowly and carefully.', consequence: 'The change is still one large lump that mixes five outcomes. Slow does not make it reviewable.', quality: 'poor' },
            { text: 'Accept T1 and plan to review the whole change at the end.', consequence: 'You will face a large diff with no checkpoints, and when one rule is wrong you cannot tell which part to redo.', quality: 'poor' },
            { text: 'Split it yourself by cutting the text in half and calling the halves T1 and T2.', consequence: 'Two smaller tasks, but without done checks or dependencies, so there is still nothing to tick.', quality: 'acceptable' },
          ],
          hints: [
            "The phrase 'works' is not a check. How many outcomes does T1 contain?",
            'A good task has one outcome, names its requirements and ends in a test.',
            'Ask for a split where each task has covers, a done-when line and dependencies.',
          ],
          explanation: 'The fix is not to be careful but to cut: one outcome per task, with a done check each. That gives you a safe stopping point after every task.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-04-q1',
        prompt: 'Which task is small enough and clear enough to hand to an AI?',
        choices: [
          'Make the booking page work well for customers',
          'Add checks 2 and 3; done when R3-AC1 and R3-AC2 pass',
          'Implement booking, then clean up the project structure',
          'Handle every kind of bad input safely and robustly',
        ],
        answer: 1,
        explanation: 'It has one outcome, names the checks it adds, lists the criteria that define done and is small. The others are broad, have two outcomes or cannot be ticked.',
      },
      {
        id: 'spec-driven-dev-04-q2',
        prompt: "A task's 'Done when' says the listed tests pass and no test that passed before may fail. Why add the second part?",
        choices: [
          'The AI tool refuses to finish unless old tests are mentioned in the task',
          'It makes the list of tests longer so that reviewers have more to check',
          'Old tests are written by a different person and need to be rerun first',
          'A new task can quietly break something an earlier task built, so every task must leave the earlier work intact',
        ],
        answer: 3,
        explanation: 'A change that passes its own tests can still break earlier behaviour. Requiring earlier tests to stay green catches that the moment it happens.',
      },
      {
        id: 'spec-driven-dev-04-q3',
        prompt: 'During the coverage check you find a task that covers no requirement. What is the most likely meaning?',
        choices: [
          'The task is more important than the others, so it needs no requirement',
          'The task is already built so the check can safely ignore it',
          'The spec is missing a line, or the task is extra scope',
          'The task should be moved to the top of the list for the AI to do first',
        ],
        answer: 2,
        explanation: 'Every task should serve something in the spec. If one does not, either the owner wants it and the spec needs a line, or it is scope creep.',
      },
      {
        id: 'spec-driven-dev-04-q4',
        prompt: 'In the task list, T4 depends on T3 but T5 depends only on T1. What does that allow?',
        choices: [
          'T4 can be built before T3 as long as T5 is finished',
          'T5 must be built last because it has the fewest dependencies',
          'T1 can be skipped because T5 does not need anything else',
          'T5 can be built any time after T1, even in parallel',
        ],
        answer: 3,
        explanation: 'A task only waits for what it depends on. T5 needs T1 and nothing else, so it is free to run earlier or in parallel with other tasks that do not share its dependencies.',
      },
      {
        id: 'spec-driven-dev-04-q5',
        audience: { max: 'beginner' },
        prompt: "What does 'Done when' tell you in a task?",
        choices: [
          'The way you can check that the job is finished',
          'The date by which the AI must finish the job',
          'The name of the person who approved the job',
          'The number of lines the finished code should have',
        ],
        answer: 0,
        explanation: "'Done when' is the tick for the task. It turns 'I think it works' into a check you can run.",
      },
      {
        id: 'spec-driven-dev-04-q6',
        audience: { min: 'advanced' },
        prompt: 'Two tasks that you planned to run in parallel agents both edit the same function. What should you do?',
        choices: [
          'Run them anyway and let the merge tool sort it out afterwards',
          'Re-cut the tasks so they touch different code, or run them in order',
          'Give both agents the same worktree so they see each other\'s edits',
          'Tell each agent to be careful not to change the other task\'s lines',
        ],
        answer: 1,
        explanation: 'Shared edits to one function are a merge conflict waiting to happen. Either cut the work along a boundary that does not overlap, or sequence the tasks.',
      },
    ],
    task: {
      title: 'Cut your design into tasks',
      minutes: 20,
      steps: [
        'Open the spec.md and design.md you wrote for your feature.',
        'Use the task prompt from this lesson with your own file names and ask for tasks.md, with a coverage table at the end.',
        'Check the cover yourself: is every acceptance criterion in exactly one task? Mark any task with no requirement behind it.',
        'Redraw the dependencies on paper. Circle the tasks that could be built in any order.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain the first task in plain words, and tell me how I would check that it is done." If you cannot picture the check, rewrite its Done when line.'] },
      { audience: { min: 'advanced' }, steps: ['Mark the riskiest task and move it forward, or add a spike for it. Identify two tasks that could run in parallel worktrees and note which files each may touch.'] },
    ],
  },
  {
    id: 'spec-driven-dev-05',
    day: 5,
    title: 'Acceptance tests as the definition of done',
    summary: 'Turning each acceptance criterion into a test that can fail, running it red before building, and why done means the tests say so.',
    intro: {
      objectives: [
        'Turn an acceptance criterion into an automated test named after it',
        'Explain why a test must fail before the code exists and what a test that passes early means',
        'Read the output of a test run and say which criteria are met',
        'Write instructions that stop an AI from changing tests to make them pass',
      ],
      why: 'AI will tell you the work is done whether or not it is. A test run is the one report on that claim that you do not have to take on trust.',
    },
    minutes: 25,
    skills: ['acceptance-tests'],
    body: [
      { type: 'paragraph', text: "'Done' is a claim, and AI tools make it freely. They finish a task and write 'All set, the booking page works.' Sometimes it does. The only way to know is to check, and the cheapest checker is a computer that runs the same check every time. An **acceptance test** is a small program that checks one acceptance criterion. Together the tests are the definition of done: a task is finished when its tests pass, not when anyone says so." },
      { type: 'heading', text: 'One criterion, one test, one name' },
      { type: 'paragraph', text: "Take a criterion such as 'R2-AC2: a booking that starts exactly when another ends is allowed.' The test builds the situation (a booking from 10:00 to 10:30), does the thing (books another at 10:30) and checks the result (it is allowed). Name the test after the criterion's id and words. When it fails, the name tells you which line of the spec is broken, and a search finds both the criterion and its test." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a **test** is a little program that tries one thing on your app and says pass or fail. It is like checking an answer on a quiz: the computer does it in a second and never gets tired. An acceptance test is a test written from one line of your spec. You do not need to write them yourself. You only need to read the names, which say in ordinary words what each one checks, and to see how many pass and fail." },
      { type: 'heading', text: 'The acceptance tests for the booking feature' },
      { type: 'paragraph', text: "These use Node's built-in test runner, so there is nothing to install: the file is run with node --test. Read each test beside its criterion in the spec. Every test has the same three parts: set up a situation, do one thing, check one result." },
      {
        type: 'code',
        language: 'javascript',
        label: 'src/booking/booking.test.js',
        code: `const test = require('node:test');
const assert = require('node:assert/strict');
const { createShop, book, messageFor } = require('./booking.js');

const ok = { requestId: 'r1', name: 'Mang Tonyo', phone: '09171234567',
  service: 'haircut', day: '2026-12-01', start: 600 };
const withChange = (change) => ({ ...ok, ...change });

test('R1-AC1 a haircut at 10:00 AM is booked and ends at 10:30 AM', () => {
  const r = book(createShop(), ok);
  assert.equal(r.ok, true);
  assert.equal(r.booking.start, 600);
  assert.equal(r.booking.end, 630);
});

test('R1-AC2 a start time that is not on the half hour is refused', () => {
  const r = book(createShop(), withChange({ start: 615 }));
  assert.deepEqual([r.ok, r.error], [false, 'off_grid']);
});

test('R1-AC3 a service that would end after 6:00 PM is refused', () => {
  const r = book(createShop(), withChange({ service: 'cut-and-beard', start: 1050 }));
  assert.deepEqual([r.ok, r.error], [false, 'outside_hours']);
});

test('R1-AC4 the last haircut of the day, 5:30 PM to 6:00 PM, is allowed', () => {
  assert.equal(book(createShop(), withChange({ start: 1050 })).ok, true);
});

test('R2-AC1 a booking that overlaps an existing one is refused', () => {
  const shop = createShop();
  book(shop, withChange({ service: 'cut-and-beard', start: 600 }));
  const r = book(shop, withChange({ requestId: 'r2', name: 'Aling Nena', start: 630 }));
  assert.deepEqual([r.ok, r.error], [false, 'slot_taken']);
  assert.equal(shop.bookings.length, 1);
});

test('R2-AC2 a booking that starts exactly when another ends is allowed', () => {
  const shop = createShop();
  book(shop, ok);
  assert.equal(book(shop, withChange({ requestId: 'r2', start: 630 })).ok, true);
});

test('R2-AC3 the same time on a different day is allowed', () => {
  const shop = createShop();
  book(shop, ok);
  assert.equal(book(shop, withChange({ requestId: 'r2', day: '2026-12-02' })).ok, true);
});

test('R3-AC1 a blank name is refused', () => {
  const r = book(createShop(), withChange({ name: '   ' }));
  assert.deepEqual([r.ok, r.error], [false, 'name_required']);
});

test('R3-AC2 a phone number must be 11 digits starting with 09', () => {
  for (const phone of ['0917123456', '19171234567', '0917123456x', '']) {
    const r = book(createShop(), withChange({ phone }));
    assert.deepEqual([r.ok, r.error], [false, 'bad_phone'], phone);
  }
});

test('R4-AC1 sending the same request twice saves one booking', () => {
  const shop = createShop();
  const first = book(shop, ok);
  const second = book(shop, ok);
  assert.equal(shop.bookings.length, 1);
  assert.equal(second.duplicate, true);
  assert.equal(second.booking.id, first.booking.id);
});

test('R5-AC1 every refusal has a plain-words message', () => {
  for (const code of ['name_required', 'bad_phone', 'unknown_service',
    'off_grid', 'outside_hours', 'slot_taken']) {
    const text = messageFor(code);
    assert.ok(text.length > 10 && !text.includes('_'), code);
  }
});`,
      },
      { type: 'heading', text: 'Run them red before anything is built' },
      { type: 'paragraph', text: "Run the tests before the feature exists. This is called running them **red**: you want to see them fail. A test that has never failed has never shown that it can. We ran the file against the first task only (T1, a book() that saves anything with no checks), and this is the real result, with the timings removed:" },
      {
        type: 'code',
        language: 'text',
        label: 'node --test --test-reporter=spec src/booking/booking.test.js (after T1 only)',
        code: `✔ R1-AC1 a haircut at 10:00 AM is booked and ends at 10:30 AM
✖ R1-AC2 a start time that is not on the half hour is refused
✖ R1-AC3 a service that would end after 6:00 PM is refused
✔ R1-AC4 the last haircut of the day, 5:30 PM to 6:00 PM, is allowed
✖ R2-AC1 a booking that overlaps an existing one is refused
✔ R2-AC2 a booking that starts exactly when another ends is allowed
✔ R2-AC3 the same time on a different day is allowed
✖ R3-AC1 a blank name is refused
✖ R3-AC2 a phone number must be 11 digits starting with 09
✖ R4-AC1 sending the same request twice saves one booking
✖ R5-AC1 every refusal has a plain-words message
ℹ tests 11
ℹ pass 4
ℹ fail 7`,
      },
      { type: 'paragraph', text: "Read the result with care. Seven tests fail, and each failure points at a criterion that has not been built. But four pass already, with almost nothing built. They are the 'allowed' cases (R1-AC4, R2-AC2, R2-AC3) and the first happy path: a stub that accepts everything satisfies them. They are not wasted. They are **guards**: they will start failing the moment a later task is too strict, for instance if the overlap check wrongly refuses a back-to-back booking. But a green test before the work is not proof of anything. Only the seven that failed and then turned green prove the work." },
      { type: 'warning', text: "Watch for tests that cannot fail. If the AI hard-codes the answer a test expects, or edits a test to match what its code does, the test goes green and proves nothing. Tell the AI in plain words: do not change the tests, and do not write code that only returns the expected values." },
      { type: 'heading', text: 'Who writes the tests, and how to keep them honest' },
      { type: 'paragraph', text: "Let the AI draft the tests from the criteria, because it is quick, and then review them yourself against the spec, because the tests are now the real definition of done. Check that every criterion has a test, that each test checks what its name says, and that you have seen each refusal test fail. Cursor's agent guidance describes the same loop: write tests first, confirm they fail, then have the agent write code until they pass without changing the tests. Codex's guidance says your project instructions should say what done means and how to verify the work." },
      {
        type: 'prompt',
        label: 'Prompt: write the acceptance tests from the spec',
        text: `Read specs/booking/spec.md and specs/booking/design.md. Write src/booking/booking.test.js using Node's built-in node:test and node:assert/strict.

Rules: one test per acceptance criterion, named with its id and words (for example "R2-AC2 a booking that starts exactly when another ends is allowed"). Test behaviour through book(), createShop() and messageFor() only. Do not write src/booking/booking.js. Include the boundary cases the spec names (exactly 6:00 PM, back-to-back bookings).

Then run the tests and show me the output. They should fail, because nothing is built yet. Tell me which tests pass already and why.`,
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "A test suite is only as good as its ability to detect a wrong implementation. Beyond reading names, make the suite prove itself: run it against a deliberately broken version (mutation testing automates this) and check that something fails; assert on behaviour and on side effects, not on private structure, so a refactor does not break tests that still describe correct behaviour. Tests derived from the same model as the implementation share its blind spots, so have criteria reviewed by a person and add property-style cases for rules like overlap. In CI, make the acceptance run a required check and keep test files out of the agent's editable paths, or require a human review on any change to them." },
      {
        type: 'version',
        text: "Checked 2026-11-14. The tests in this lesson use Node.js's built-in test runner: the node:test module is run with node --test, and it is marked Stable in the Node 22 documentation (stable since v20); the spec reporter prints the readable list used above and is the default when output goes to a terminal. Cursor's agent guidance recommends writing tests first, confirming they fail and then having the agent write code until they pass without changing the tests. Codex's best-practices page says instruction files should state what done means and how to verify work.",
        checked: CHECKED,
        sources: [DOCS.nodeTest, DOCS.cursorBest, DOCS.codexBest],
      },
      {
        type: 'takeaways',
        items: [
          'An acceptance test checks one acceptance criterion, and is named with its id and words.',
          'Run the tests red before building: a test that has never failed has never shown it can.',
          'Tests that pass early are guards, not proof. Only tests that failed and then passed prove the work.',
          'Review the tests against the spec, and tell the AI never to edit them or hard-code their expected answers.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-05-code-challenge-1',
          kind: 'code-challenge',
          title: 'Make the overlap tests pass',
          prompt: 'Write `overlaps(aStart, aEnd, bStart, bEnd)` for two bookings on the same day, in minutes after midnight. It returns true when they share time. A booking that ends exactly when another starts does NOT overlap (R2-AC2).',
          concept: 'acceptance criteria as tests',
          language: 'javascript',
          starter: `function overlaps(aStart, aEnd, bStart, bEnd) {
  return false;
}`,
          solution: `function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}`,
          tests: {
            kind: 'function',
            fn: 'overlaps',
            cases: [
              { label: 'R2-AC1 starts inside the other booking', args: [630, 690, 600, 660], expected: true },
              { label: 'R2-AC1 starts before and runs into the other', args: [570, 630, 600, 660], expected: true },
              { label: 'R2-AC2 starts exactly when the other ends', args: [630, 660, 600, 630], expected: false },
              { label: 'R2-AC2 ends exactly when the other starts', args: [570, 600, 600, 630], expected: false },
              { label: 'the same time exactly', args: [600, 630, 600, 630], expected: true },
              { label: 'a gap between them', args: [540, 570, 600, 630], expected: false },
            ],
          },
          hints: [
            'Two bookings overlap when each one starts before the other ends.',
            'Compare a with b and b with a: aStart against bEnd, and bStart against aEnd.',
            'Use strictly less than, so that a booking ending at 630 and another starting at 630 do not overlap: aStart < bEnd && bStart < aEnd.',
          ],
          explanation: 'The two comparisons say each booking starts before the other ends. Strict less-than is what lets back-to-back bookings through, which is exactly what the boundary tests guard. Using <= would refuse them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-05-predict-output-1',
          kind: 'predict-output',
          title: 'Which criteria does this version fail?',
          prompt: 'This version of overlaps uses <= instead of <. A tiny test runner checks three criteria against it and prints pass or FAIL for each. What does it print?',
          concept: 'reading test results',
          language: 'javascript',
          code: `function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}
const cases = [
  ['R2-AC1', 630, 690, 600, 660, true],
  ['R2-AC2', 630, 660, 600, 630, false],
  ['R2-AC3', 540, 570, 600, 630, false],
];
for (const c of cases) {
  const result = overlaps(c[1], c[2], c[3], c[4]) === c[5] ? 'pass' : 'FAIL';
  console.log(c[0] + ' ' + result);
}`,
          expected: 'R2-AC1 pass\nR2-AC2 FAIL\nR2-AC3 pass',
          choices: ['R2-AC1 pass\nR2-AC2 FAIL\nR2-AC3 pass', 'R2-AC1 pass\nR2-AC2 pass\nR2-AC3 pass', 'R2-AC1 FAIL\nR2-AC2 FAIL\nR2-AC3 pass', 'R2-AC1 pass\nR2-AC2 FAIL\nR2-AC3 FAIL'],
          wrongNotes: {
            'R2-AC1 pass\nR2-AC2 pass\nR2-AC3 pass': 'With <= a booking that starts exactly when another ends counts as overlapping, so R2-AC2 expects false and gets true.',
            'R2-AC1 FAIL\nR2-AC2 FAIL\nR2-AC3 pass': 'The first case really does overlap (630 is between 600 and 660), so true is the right answer and it passes.',
            'R2-AC1 pass\nR2-AC2 FAIL\nR2-AC3 FAIL': 'The third case has a gap (570 to 600), so the result is false, which is what it expects, and it passes.',
          },
          hints: [
            'Work out the result of overlaps for each case, then compare it with the last value.',
            'For R2-AC2: 630 <= 630 is true and 600 <= 660 is true, so overlaps returns true. What did the case expect?',
            'Only the touching case (R2-AC2) goes wrong, because <= treats touching as overlapping.',
          ],
          explanation: 'The <= version treats two bookings that merely touch as overlapping, so the back-to-back criterion fails while the other two still pass. This is exactly why boundary cases are in the tests: the failing name points straight at the broken line of the spec.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-05-q1',
        prompt: 'Why run the acceptance tests before the feature is built?',
        choices: [
          'To warm up the test runner so later runs are faster',
          'To check that the project folder has been created correctly',
          'To give the AI a list of errors that it should hide from users',
          'To prove the tests can fail, so a later pass means something',
        ],
        answer: 3,
        explanation: 'A test that has never failed has never shown it can detect a missing feature. Seeing it fail first makes its later pass meaningful.',
      },
      {
        id: 'spec-driven-dev-05-q2',
        prompt: 'After task T1 four tests already pass. What is the right way to read that?',
        choices: [
          'Four requirements are finished and need no further work',
          'The tests are wrong because they should all fail at the start',
          'They are guards that catch a later task being too strict',
          'The AI has already built more than the task asked for',
        ],
        answer: 2,
        explanation: 'Allowed-case tests pass on a stub that accepts everything. They still protect against a later change that refuses valid bookings. Only the tests that went from red to green prove new work.',
      },
      {
        id: 'spec-driven-dev-05-q3',
        prompt: 'An AI says all tests pass, but you notice it changed the expected value in one test from false to true. What does this suggest?',
        choices: [
          'The test was edited to match the code, so a pass proves nothing',
          'The spec was wrong, so the test and code are now correct together',
          'The AI improved the test by making it more realistic',
          'Nothing, because the number of passing tests went up',
        ],
        answer: 0,
        explanation: 'Editing the expectation to fit the code removes the check. If the spec really changed, the spec is updated first and the test follows; the AI should not decide that alone.',
      },
      {
        id: 'spec-driven-dev-05-q4',
        prompt: 'Why is a test named "R2-AC2 a booking that starts exactly when another ends is allowed" useful when it fails?',
        choices: [
          'It tells the AI which file to open first when it starts looking for the cause',
          'It points straight at the line of the spec that is broken',
          'It shows how long the test took to run',
          'It lists the other tests that will also fail soon',
        ],
        answer: 1,
        explanation: 'Naming a test with its criterion id and words links the failure to the spec. You can read what went wrong without opening the test code.',
      },
      {
        id: 'spec-driven-dev-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does a test do?',
        choices: [
          'It writes the missing parts of your app for you, then runs them without asking',
          'It translates your app into other languages',
          'It makes the app run faster on small phones',
          'It tries one thing on your app and reports pass or fail',
        ],
        answer: 3,
        explanation: 'A test tries one thing, such as booking at 10:15, and says whether the app behaved as the spec says.',
      },
      {
        id: 'spec-driven-dev-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Your suite goes green. Which step best shows the suite can actually catch a wrong implementation?',
        choices: [
          'Run it against a deliberately broken version and see what fails',
          'Run the suite once more to confirm the result is stable',
          'Ask the same AI that wrote the code to confirm the tests are good',
          'Count the number of tests and compare it with last month',
        ],
        answer: 0,
        explanation: 'A green suite only shows the current code passes. Breaking the code on purpose (mutation testing does this automatically) shows whether a wrong implementation would be noticed.',
      },
    ],
    task: {
      title: 'Write tests and run them red',
      minutes: 20,
      steps: [
        'Take your spec.md and ask an AI tool for acceptance tests with the prompt from this lesson, one per criterion, named with its id.',
        'Create an empty implementation (functions that return nothing useful) so the tests can load. Run the tests and save the output.',
        'List which tests fail and which pass already. For each early pass, write one sentence on why a stub satisfied it.',
        'Add one line to your instructions file (CLAUDE.md, AGENTS.md or notes): "Never edit the tests to make them pass."',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Explain each test name in plain words and tell me what would break in the app if it failed." Keep the explanations next to your spec.'] },
      { audience: { min: 'advanced' }, steps: ['Write one deliberately broken implementation for your feature and run the suite against it. Every criterion it violates should fail; if one does not, add or sharpen a test.'] },
    ],
  },
  {
    id: 'spec-driven-dev-06',
    day: 6,
    title: 'Building one task at a time',
    summary: 'A repeatable loop for handing one task to an AI: hand-off, red, build, check, read the diff, commit, and what to do when it goes off script.',
    intro: {
      objectives: [
        'Write a hand-off prompt for one task that fences its scope and states the done check',
        'Follow the build loop for one task and say what to check at each step',
        'Recognise and stop an AI that changes tests or touches files outside its task',
        'Explain what to do when the build uncovers a gap in the spec',
      ],
      why: 'A task list only helps if work actually moves through it one piece at a time. The loop keeps every AI change small enough to read, check and undo.',
    },
    minutes: 25,
    skills: ['one-task-loop'],
    body: [
      { type: 'paragraph', text: "You have a spec, a design, a task list and tests. Now the AI builds. The temptation is to say 'do all the tasks'. Resist it. An AI that is given six tasks at once makes one large change, and a mistake in T2 is buried under everything built on top of it. Spec-driven building is a loop you repeat for each task, and the loop is the same whether the AI is Claude Code, Cursor, Codex or Copilot." },
      { type: 'heading', text: 'The loop for one task' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The build loop for one task. Failing at step 5 sends you back to build; it never sends you to the tests.',
        source: 'flowchart TD\n  A[1 Pick the next task whose dependencies are done] --> B[2 Hand over: task, spec, design, tests, fences]\n  B --> C[3 Run the tests: confirm the right ones fail]\n  C --> D[4 The AI builds this task only]\n  D --> E[5 Run all tests: done-when green, nothing else broken]\n  E -->|a test fails| D\n  E -->|all as expected| F[6 Read the diff against the task]\n  F -->|outside the task| D\n  F -->|clean| G[7 Commit with the task id]\n  G --> H(8 Tick the task and pick the next)',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: you give the AI one job at a time, with the list of checks that say when the job is finished. You run the checks yourself, you look at what changed, and only then do you save the work and move to the next job. 'Commit' means saving a named snapshot of your project so you can go back to it. A **diff** is the list of exactly what changed. Reading the diff does not mean understanding every line of code: it means checking that the AI only touched the files the task allowed and nothing surprising appeared." },
      { type: 'heading', text: 'The hand-off: what the AI needs for one task' },
      { type: 'paragraph', text: "A new session knows nothing about last week. The hand-off prompt gives it exactly what it needs and nothing else: the task, the files that explain the intent, the tests that define done, and the fences. Claude Code's guidance recommends starting a fresh session to build from a written spec, so the build begins with a clean context and a written definition of done. The same advice holds in every tool." },
      {
        type: 'prompt',
        label: 'Prompt: hand over task T3',
        text: `Build task T3 from specs/booking/tasks.md. Read specs/booking/spec.md, specs/booking/design.md and src/booking/booking.test.js first.

Task T3 Time rules: add checks 4, 5 and 6 (unknown_service, off_grid, outside_hours) to book() in src/booking/booking.js, in that order, as the design says.

Done when: R1-AC2, R1-AC3 and R1-AC4 pass, and every test that passed before still passes.

Fences: change src/booking/booking.js only. Do not edit any test. Do not write code that returns the expected values. Do not add features that are not in the task. If you find something the spec does not cover, stop and tell me instead of deciding.

When finished, run node --test --test-reporter=spec src/booking/booking.test.js and show me the command and its full output, then list the lines you changed.`,
      },
      { type: 'paragraph', text: "Four parts of that prompt do the real work. 'Done when' gives the AI a target it can check itself. The fences keep the change small. 'Stop and tell me' turns a spec gap into a question instead of a hidden decision. And the request for the command and its output gives you evidence, not a summary. Here is the code T3 adds, so you can see what a clean, task-sized change looks like. Read it line by line:" },
      {
        type: 'code',
        language: 'javascript',
        label: 'The lines T3 adds to book() in src/booking/booking.js',
        code: `  const length = SERVICES[req.service];
  if (length === undefined) return { ok: false, error: 'unknown_service' };
  if (req.start % GRID !== 0) return { ok: false, error: 'off_grid' };
  const end = req.start + length;
  if (req.start < OPEN || end > CLOSE) return { ok: false, error: 'outside_hours' };`,
      },
      {
        type: 'list',
        items: [
          'Line 1 looks up how long the chosen service takes (30 or 60 minutes). An unknown service has no length.',
          'Line 2 refuses an unknown service: check 4.',
          'Line 3 refuses a start that is not a multiple of 30 minutes. The % sign gives the remainder, so 615 leaves 15 and is refused: check 5.',
          'Lines 4 and 5 work out when the booking ends and refuse one that starts before 9:00 AM or ends after 6:00 PM: check 6. Using end > CLOSE rather than start >= CLOSE is what makes a Cut and beard at 5:30 PM fail (R1-AC3).',
        ],
      },
      { type: 'heading', text: 'Progress you can measure' },
      { type: 'paragraph', text: "Because every task has a done check, progress is a number, not a feeling. We built the booking feature task by task and ran the same eleven tests after each one. These counts are real:" },
      {
        type: 'table',
        headers: ['After task', 'Passing', 'Failing', 'What turned green'],
        rows: [
          ['T1 Skeleton and data', '4', '7', 'R1-AC1 and the three guards'],
          ['T2 Customer details', '6', '5', 'R3-AC1, R3-AC2'],
          ['T3 Time rules', '8', '3', 'R1-AC2, R1-AC3'],
          ['T4 No double booking', '9', '2', 'R2-AC1'],
          ['T5 Duplicate requests', '10', '1', 'R4-AC1'],
          ['T6 Messages', '11', '0', 'R5-AC1'],
        ],
        caption: 'Real results, one run per task. Each task turned exactly the tests it listed under Done when, and none went back to red.',
      },
      { type: 'heading', text: 'When the build goes off script' },
      {
        type: 'list',
        items: [
          '**The AI edits a test to make it pass.** Reject the change. Fix the code, or, if the spec really is wrong, change the spec first (Lesson 8).',
          '**The diff touches files the task did not list.** Reject it and ask for the task only. Unrequested changes are how scope creeps in.',
          '**A new test fails that passed before.** The task broke earlier work. Send it back; do not move on with a red test.',
          '**The AI hits something the spec does not say.** For example, can a Cut and beard end exactly at 6:00 PM? Stop. Decide, write the answer into the spec, then continue.',
        ],
      },
      { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "A commit per task is what makes this loop safe. If you commit after each green task, rejecting the next task means throwing away one small change, and you can compare any two tasks with git. Put the task id in the commit message (for example 'T3: time rules, R1-AC2 to AC4') so the history reads like the task list. The Git and GitHub course covers undoing a commit if you need it." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Independent tasks can run in parallel: T2, T3 and T5 only depend on T1, so three agents could each take one in its own worktree and branch, with merges in dependency order and the full suite run on the merged result, not only on each branch. For an unattended run, Claude Code's guidance suggests asking five questions first: does it know what done looks like, can it check its own work, what is it allowed to touch, what stops it (a cap on turns or spend), and who signs off on the result. The human gate stays at the merge. Keep the context small: one task, the spec files it needs, and nothing from earlier tasks." },
      {
        type: 'version',
        text: "Checked 2026-11-14. Claude Code's best-practices page recommends building from a written SPEC.md in a fresh session, asking for evidence (the command and its output) rather than a summary, and, before a task runs unattended, checking that it knows what done looks like, can check its own work, has limited permissions, has a cap such as maximum turns or budget, and ends with a person approving the result. At the plan approval prompt Claude Code offers to approve and start auto mode, to approve and review each edit manually, or to keep planning. Spec Kit's implement command executes tasks.md in dependency order and can be run once or one phase at a time for a large feature; its converge command checks the codebase against the spec, plan and tasks. These options change by version.",
        checked: CHECKED,
        sources: [DOCS.claudeBest, DOCS.claudeModes, DOCS.specKit],
      },
      {
        type: 'takeaways',
        items: [
          'Build one task per loop: hand over, confirm red, build, run all tests, read the diff, commit, tick.',
          'A hand-off names the task, the files to read, the done check, the fences and what to do when something is unclear.',
          'Ask for the command and its output. Evidence beats the AI saying it is done.',
          'If the build exposes a gap in the spec, stop and decide in writing before continuing.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-06-arrange-1',
          kind: 'arrange',
          title: 'Put the build loop in order',
          prompt: 'Arrange the eight steps of the build loop for one task, from picking the task to ticking it off.',
          concept: 'the one-task build loop',
          language: 'text',
          solution: [
            '1 Pick the next task whose dependencies are done',
            '2 Hand over the task, spec, design, tests and fences',
            '3 Run the tests and confirm the right ones fail',
            '4 The AI builds this task only',
            '5 Run all tests: done-when green, nothing else broken',
            '6 Read the diff against the task',
            '7 Commit with the task id',
            '8 Tick the task and pick the next',
          ],
          reasons: [
            'You cannot build a task before the work it depends on exists.',
            'The AI needs the task, the files that explain it and the fences before it starts.',
            'Red first shows the tests can fail and that the target is not already met.',
            'Only now does the AI write code, and only for this task.',
            'The tests decide whether the task is done, not the AI saying so.',
            'Passing tests do not show that nothing unrelated changed, so you read the diff.',
            'A commit per task makes each task easy to undo.',
            'Ticking closes the task and shows the next one that is free.',
          ],
          hints: [
            'You must know which task is next before you can hand it over.',
            'Tests are run red before the AI builds, and run again after.',
            'Reading the diff comes after the tests are green and before you commit.',
          ],
          explanation: 'The loop goes: pick, hand over, confirm red, build, run all tests, read the diff, commit, tick. Each step catches a different problem, and skipping one is how large mistakes get past you.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-06-scenario-1',
          kind: 'scenario',
          title: 'The AI found a gap',
          prompt: 'Choose how to respond when the AI stops with a question.',
          concept: 'gaps found while building',
          story: 'You handed task T3 to an AI with the instruction to stop if the spec does not cover something.',
          situation: "The AI stops and writes: 'The spec says a booking must end after 6:00 PM to be refused. Does a Cut and beard that ends exactly at 6:00 PM count? I did not guess.' R1-AC4 covers a haircut ending at 6:00 PM but not a longer service. What do you do?",
          options: [
            { text: 'Decide with Ben, add a line to the spec (a booking that ends exactly at 6:00 PM is allowed, any service), add a test for it, then tell the AI to continue.', consequence: 'The decision is now written once, checked by a test and visible to every later session.', quality: 'best' },
            { text: 'Tell the AI in chat to allow it, and keep going.', consequence: 'The code is right today, but the rule exists only in a chat. The spec and the tests are now out of step with the code.', quality: 'acceptable' },
            { text: 'Tell the AI to pick whichever is simpler to build.', consequence: 'You have handed a product decision to the build, and nobody can say later why it works as it does.', quality: 'poor' },
            { text: 'Skip the task and move on to T4 until the question goes away.', consequence: 'T4 depends on T3, so you are building on a gap. The question comes back with more code on top of it.', quality: 'poor' },
          ],
          hints: [
            'Whose decision is it: the AI\'s or the owner\'s?',
            'Where should the answer live so that the next session does not have to ask again?',
            'The answer goes into the spec and into a test, not only into the chat.',
          ],
          explanation: 'A gap found while building is a decision for the owner. Writing it into the spec and a test makes it permanent, which is the point of spec-driven work. The AI stopping instead of guessing is the behaviour the fences asked for.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-06-q1',
        prompt: 'Why hand an AI one task at a time instead of the whole task list?',
        choices: [
          'AI tools are not able to read a list that has more than one item',
          'Handing over one task costs less than handing over six in any tool',
          'A single change is easy to read, test and undo',
          'The tests only run correctly when a single task is in the project',
        ],
        answer: 2,
        explanation: 'Small changes can be reviewed and reverted. One large change mixes everything together, so you cannot tell which part is wrong.',
      },
      {
        id: 'spec-driven-dev-06-q2',
        prompt: 'The AI reports that task T4 is finished. What is the most reliable thing to ask for next?',
        choices: [
          'A longer explanation of how the overlap rule works',
          'The command it ran and its full output',
          'A promise that no other part of the project has changed',
          'The list of tasks that remain, so you can plan the next session',
        ],
        answer: 1,
        explanation: 'Evidence beats a summary. A run of the tests shows what passes and fails, and you can read it faster than rerunning everything yourself.',
      },
      {
        id: 'spec-driven-dev-06-q3',
        prompt: 'After task T4, 8 tests pass and 3 fail, but before T4 the count was 8 and 3 with different tests failing. What has happened?',
        choices: [
          'T4 worked, because the total is still the same',
          'The tests are unreliable and should be run until the numbers settle',
          'T4 turned some tests green but broke older ones, so it is not done',
          'T4 needs no change, because the number of failing tests is below half',
        ],
        answer: 2,
        explanation: 'The count alone can hide a swap. A task is done only when its own tests pass and nothing that passed before has gone red.',
      },
      {
        id: 'spec-driven-dev-06-q4',
        prompt: 'Why does the hand-off prompt tell the AI which files it may change?',
        choices: [
          'So a change outside the task is easy to spot in the diff',
          'To make the prompt look more professional for reviewers',
          'Because the tests refuse to run if other files are changed',
          'So that the AI knows which language the project is written in',
        ],
        answer: 0,
        explanation: 'Fences make scope creep visible. A diff that touches a file outside the list is a signal to reject the change before it merges.',
      },
      {
        id: 'spec-driven-dev-06-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a commit?',
        choices: [
          'A promise from the AI that the job is done correctly',
          'A copy of your project that is sent to your customers',
          'A message that tells the AI which job to do next',
          'A saved, named snapshot you can go back to',
        ],
        answer: 3,
        explanation: 'A commit saves the project as it is right now with a label. Committing after each task means you can return to any finished task.',
      },
      {
        id: 'spec-driven-dev-06-q6',
        audience: { min: 'advanced' },
        prompt: 'You run three independent tasks in parallel agents on separate branches. Where should the full acceptance suite run?',
        choices: [
          'Only on each branch, because each agent already proved its own task',
          'On each branch and again on the merged result',
          'Only once at the very end of the project after all features are merged',
          'On the first branch only, since the others are independent tasks',
        ],
        answer: 1,
        explanation: 'Interactions appear only after merging. Running the whole suite on the merged result catches conflicts that no single branch could show.',
      },
    ],
    task: {
      title: 'Build one task with the loop',
      minutes: 20,
      steps: [
        'Pick the first task in your tasks.md. Write its hand-off prompt using the one in this lesson as a template.',
        'Run your tests and note which fail. Hand the task to an AI tool in a fresh session.',
        'When it reports back, run the tests yourself and read the diff. Does it touch only the allowed files? Did any test change?',
        'Commit with the task id in the message. Write the new pass and fail counts in your tasks.md.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['After the task, ask the AI: "Explain each change you made in plain words and tell me which test it is for." Check that every change has a test.'] },
      { audience: { min: 'advanced' }, steps: ['Run two independent tasks in separate worktrees, merge them in dependency order, and run the whole suite on the merged result. Note any conflict and how you re-cut the tasks to avoid it.'] },
    ],
  },
  {
    id: 'spec-driven-dev-07',
    day: 7,
    title: 'Reviewing an implementation against its spec',
    summary: 'A three-pass review of AI-built work: run the evidence, trace each requirement to a test, then look for what the tests cannot see.',
    intro: {
      objectives: [
        'Review a finished implementation against the spec in three passes',
        'Sort a review finding into bug, gap, extra or spec problem',
        'Write review notes that point at a requirement and at evidence',
        'Write a review prompt that checks the spec and skips style',
      ],
      why: 'Green tests only prove what you thought to test. A review against the spec is how you catch the missing, the extra and the unwritten before a customer does.',
    },
    minutes: 25,
    skills: ['spec-review'],
    body: [
      { type: 'paragraph', text: "Tests answer one question: do the checks I wrote pass? A review answers a wider one: does what was built match what the spec asks for, and nothing more? The two can disagree. A feature can pass every test and still log customers' phone numbers, add a screen nobody asked for, or quietly decide something the spec left open. In spec-driven work the review is not a hunt for bugs in general. It is a comparison, requirement by requirement, with the document you wrote." },
      { type: 'heading', text: 'Three passes' },
      {
        type: 'table',
        headers: ['Pass', 'The question', 'The evidence you collect'],
        rows: [
          ['1 Evidence', 'Do the acceptance tests pass, on a clean run you did yourself?', 'The command and its full output, with the pass and fail counts.'],
          ['2 Trace', 'For every requirement, is there a test, and for every failing test, which line of the code is at fault?', 'A short table: criterion, test, result, the code that implements it.'],
          ['3 Beyond the tests', 'Does the code do anything the spec did not ask for, or break a constraint no test covers?', 'Lines in the diff that no requirement explains, and the constraints (privacy, time zones) checked by reading.'],
        ],
        caption: 'Pass 1 is mechanical, pass 2 is a comparison, pass 3 is judgement. Do them in this order.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: you hold the finished app next to your list and tick off every line. First you run the checks and see how many pass. Then for each line of your list you ask 'is this really in the app, and which check proves it?' Last you look for surprises: things in the app that are not on your list at all, such as a new page or something that saves customer details. A **finding** is one problem you write down, with the list line it breaks and the proof. You do not have to read all the code: you can ask the AI to point at the exact lines." },
      { type: 'heading', text: 'A worked review' },
      { type: 'paragraph', text: "We asked an AI to build the booking feature in one go, with no task list and no tests. Then we reviewed it against spec v1. Pass 1 is to run the acceptance tests against it. This is the real result, timings removed:" },
      {
        type: 'code',
        language: 'text',
        label: 'node --test --test-reporter=spec src/booking/booking.test.js (the one-go build)',
        code: `✔ R1-AC1 a haircut at 10:00 AM is booked and ends at 10:30 AM
✔ R1-AC2 a start time that is not on the half hour is refused
✖ R1-AC3 a service that would end after 6:00 PM is refused
✔ R1-AC4 the last haircut of the day, 5:30 PM to 6:00 PM, is allowed
✔ R2-AC1 a booking that overlaps an existing one is refused
✖ R2-AC2 a booking that starts exactly when another ends is allowed
✖ R2-AC3 the same time on a different day is allowed
✔ R3-AC1 a blank name is refused
✔ R3-AC2 a phone number must be 11 digits starting with 09
✖ R4-AC1 sending the same request twice saves one booking
✔ R5-AC1 every refusal has a plain-words message
ℹ tests 11
ℹ pass 7
ℹ fail 4`,
      },
      { type: 'paragraph', text: "Pass 2 traces each failure to the code. Here are the three lines that cause the four failures (the rest of the build was correct):" },
      {
        type: 'code',
        language: 'javascript',
        label: 'The lines in the one-go build that break the spec',
        code: `if (req.start < OPEN || req.start >= CLOSE) return { ok: false, error: 'outside_hours' };
for (const other of shop.bookings) {
  if (req.start <= other.end && other.start <= end) return { ok: false, error: 'slot_taken' };
}
// ... and there is no check for a request id that was already used`,
      },
      {
        type: 'list',
        items: [
          '**R1-AC3 fails.** The hours check only looks at when the booking starts. A Cut and beard at 5:30 PM starts before 6:00 PM, so it is accepted, although it ends at 6:30 PM. The check must look at the end time.',
          '**R2-AC2 fails.** The overlap check uses <=, so a booking that starts exactly when another ends counts as overlapping and is refused.',
          '**R2-AC3 fails.** The same loop never compares the day, so a booking at 10:00 on December 2 is refused because of one at 10:00 on December 1.',
          '**R4-AC1 fails.** Nothing remembers the request id, so a second press of Confirm saves a second booking.',
        ],
      },
      { type: 'paragraph', text: "Pass 3 reads the diff for what the tests cannot see. Suppose the same diff also contained a line the AI added to help itself debug (this example is written for the lesson, not taken from a real run): console.log('booking request', req). No acceptance test fails because of it, but constraint C2 says a customer's name and phone are never written to logs. A passing suite hides that. Only a reviewer who compares the diff with the constraints finds it." },
      { type: 'heading', text: 'Four kinds of finding' },
      {
        type: 'table',
        headers: ['Kind', 'What it is', 'Who acts'],
        rows: [
          ['Bug', 'The code breaks something the spec says (the >= check).', 'The builder fixes the code.'],
          ['Gap', 'The spec is silent and the code made a choice (can a Cut and beard end exactly at 6:00 PM?).', 'The owner decides, and the spec gets a line.'],
          ['Extra', 'The code does something no requirement asks for (a console.log of the request, a reminders page).', 'Remove it, or add a requirement if the owner wants it.'],
          ['Spec problem', 'The spec itself is wrong or two lines of it conflict.', 'The owner changes the spec first (Lesson 8).'],
        ],
        caption: 'Sorting findings matters because each kind has a different owner and a different fix.',
      },
      { type: 'heading', text: 'The review notes' },
      {
        type: 'code',
        language: 'markdown',
        label: 'specs/booking/review.md',
        code: `# Review: Book a haircut, against spec v1
Reviewed: one-go build, 2026-12-05
Tests: node --test: 7 pass, 4 fail (full output attached)

## Findings
| # | Kind | Spec | Evidence | Fix |
|---|------|------|----------|-----|
| 1 | Bug | R1-AC3 | test fails; hours check uses start only | check end <= closing |
| 2 | Bug | R2-AC2 | test fails; overlap uses <= | use < on both sides |
| 3 | Bug | R2-AC3 | test fails; overlap ignores the day | compare day first |
| 4 | Bug | R4-AC1 | test fails; request id not remembered | add check 1 |
| 5 | Extra | C2 | diff line logs the whole request | remove it |

## Gaps (spec silent)
- Can a Cut and beard end exactly at 6:00 PM? Owner: Ben.

## Spec problems
- None found.

## Decision
Not accepted. Fix findings 1 to 5 and re-run the tests.
Open questions still open: Q1 (lunch).`,
      },
      { type: 'heading', text: 'Ask for a review that stays on the spec' },
      { type: 'paragraph', text: "A fresh reviewer that never saw the building conversation is not swayed by the reasoning that produced the code. Claude Code's guidance suggests a review prompt that checks every requirement is implemented, that the listed edge cases have tests, and that reports gaps affecting correctness while skipping style. It also warns not to drop the skip-style part: a reviewer asked to find problems will always find something, and fixing every finding gives you extra layers and tests for cases that cannot happen." },
      {
        type: 'prompt',
        label: 'Prompt: review the diff against the spec',
        text: `You are reviewing code you did not write. Compare the changed files against specs/booking/spec.md and specs/booking/design.md.

1 Run node --test --test-reporter=spec src/booking/booking.test.js and show me the command and the full output.
2 For every criterion R1-AC1 to R5-AC1, say whether a test covers it and whether it passes. For every failing test, name the line of code at fault.
3 List anything in the diff that no requirement explains, and any breach of the constraints C1 and C2.
4 For each finding, say whether it is a bug, a gap, an extra or a spec problem, and quote the spec id.

Report gaps that affect correctness. Skip style, naming and formatting. Do not change any file.`,
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "Make the reviewer independent: a fresh session, or a second model, that gets the spec, the diff and the test output but not the builder's chat. Automate pass 2 where you can: a script that checks every requirement id appears in a test name (Lesson 8 shows one) turns coverage into a gate. For pass 3, review against checklists the spec cannot hold by itself (privacy, error paths, authorisation, resource use) and require that every finding cites a requirement or a constraint, so style opinions cannot dominate. A finding with no failing test or cited line is a suggestion, not a blocker. A person still owns the accept decision." },
      {
        type: 'version',
        text: "Checked 2026-11-14. Claude Code's best-practices page has a Review against your spec section: ask a subagent to review the diff against SPEC.md, check every requirement is implemented and the listed edge cases have tests, and report gaps that affect correctness while skipping style. It also notes that /code-review reviews a diff in a fresh subagent that never saw your conversation. GitHub's Spec Kit describes a checklist step that generates requirements-quality checklists, a read-only analyze step across the spec, plan and tasks, and a converge step that checks the codebase against the spec; its README lists converge in the minimal flow. Tool names and options change by version.",
        checked: CHECKED,
        sources: [DOCS.claudeBest, DOCS.specKit],
      },
      {
        type: 'takeaways',
        items: [
          'Review means comparing the work with the spec, requirement by requirement, not hunting bugs in general.',
          'Three passes: run the evidence, trace each requirement to a test and to code, then look beyond the tests.',
          'A finding is a bug, a gap, an extra or a spec problem, and each has a different owner.',
          'Ask for the spec and the evidence, and tell the reviewer to skip style, or it will always find something.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-07-code-challenge-1',
          kind: 'code-challenge',
          title: 'Check an implementation against its criteria',
          prompt: 'An AI wrote `isAllowed(start, service)`. Write `failing(cases)`. Each case is `{ id, start, service, expected }` where `expected` is true if the spec says the booking is allowed. Return the ids of the cases where `isAllowed` gives a different answer, in order.',
          concept: 'checking code against acceptance criteria',
          language: 'javascript',
          starter: `function isAllowed(start, service) {
  // The AI's version: it only looks at when the booking starts.
  return start >= 540 && start < 1080 && start % 30 === 0;
}

function failing(cases) {
  // return the ids of the cases that isAllowed gets wrong
  return [];
}`,
          solution: `function isAllowed(start, service) {
  return start >= 540 && start < 1080 && start % 30 === 0;
}

function failing(cases) {
  const failed = [];
  for (const c of cases) {
    if (isAllowed(c.start, c.service) !== c.expected) failed.push(c.id);
  }
  return failed;
}`,
          tests: {
            kind: 'function',
            fn: 'failing',
            cases: [
              { label: 'one criterion fails', args: [[{ id: 'R1-AC1', start: 600, service: 'haircut', expected: true }, { id: 'R1-AC2', start: 615, service: 'haircut', expected: false }, { id: 'R1-AC3', start: 1050, service: 'cut-and-beard', expected: false }, { id: 'R1-AC4', start: 1050, service: 'haircut', expected: true }]], expected: ['R1-AC3'] },
              { label: 'every criterion passes', args: [[{ id: 'R1-AC1', start: 600, service: 'haircut', expected: true }, { id: 'R1-AC2', start: 615, service: 'haircut', expected: false }]], expected: [] },
              { label: 'two failures keep their order', args: [[{ id: 'A', start: 1050, service: 'cut-and-beard', expected: false }, { id: 'B', start: 600, service: 'haircut', expected: true }, { id: 'C', start: 1050, service: 'cut-and-beard', expected: false }]], expected: ['A', 'C'] },
              { label: 'no cases', args: [[]], expected: [] },
            ],
          },
          hints: [
            'Loop over the cases and call isAllowed with each case start and service.',
            'A case fails when the answer from isAllowed is not the same as case.expected.',
            'Collect case.id into a list with push, and return the list after the loop.',
          ],
          explanation: 'Checking an implementation against criteria is a loop: run each case, compare with the expected answer, and report the ids that differ. The ids point straight back at the spec. Here the only failing case is the Cut and beard that runs past closing time, because isAllowed never looks at the end.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-07-match-1',
          kind: 'match',
          title: 'What kind of finding is it?',
          prompt: 'Match each review observation to the kind of finding it is.',
          concept: 'sorting review findings',
          labels: { terms: 'The observation', meanings: 'The kind of finding' },
          pairs: [
            { term: 'The code accepts a Cut and beard at 5:30 PM, but R1-AC3 says to refuse it', definition: 'Bug', note: 'The code breaks a line the spec states clearly.' },
            { term: 'The spec never says whether a Cut and beard may end exactly at 6:00 PM, and the code allows it', definition: 'Gap', note: 'The spec is silent and the code chose, so the owner must decide.' },
            { term: 'The AI added a reminders page that nothing in the spec mentions', definition: 'Extra', note: 'The code does more than any requirement asks for.' },
            { term: 'R2-AC1 says refuse overlaps, but a later line of the spec says Ben may double book friends', definition: 'Spec problem', note: 'Two lines of the spec conflict, so no code can satisfy both.' },
          ],
          hints: [
            'Ask who must act: the builder, the owner, or both?',
            'If the spec says something clearly and the code differs, it is a bug. If the spec says nothing, it is something else.',
            'Silent spec: gap. More than asked: extra. Spec contradicts itself: spec problem.',
          ],
          explanation: 'The kind tells you who acts. A bug goes back to the builder. A gap and a spec problem go to the owner, who changes the spec. An extra is removed unless the owner wants it, in which case it becomes a requirement.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-07-q1',
        prompt: 'Every acceptance test passes. Why might a review against the spec still find a problem?',
        choices: [
          'Because passing tests are always wrong when an AI wrote the code',
          'Because a green result is only valid on the day the tests are written',
          'Because reviews are meant to find problems even where none exist',
          'Because the tests only cover what someone thought to test, so extras and untested constraints can hide behind a green run',
        ],
        answer: 3,
        explanation: 'Tests check the criteria they were written for. Code can do something extra, or break a constraint no test covers, and still pass every test.',
      },
      {
        id: 'spec-driven-dev-07-q2',
        prompt: "During the review you find a console.log of the whole booking request, which includes the customer's phone. Which kind of finding is it, and which spec line does it breach?",
        choices: [
          'A bug against R3-AC2, the phone number rule',
          'A gap in the spec, because logging was never mentioned',
          'An extra, breaching C2 on logging customer data',
          'A spec problem against C1, the time zone rule',
        ],
        answer: 2,
        explanation: 'The line is something no requirement asks for, and the constraint C2 names it directly. No test fails because of it, which is why pass 3 reads the diff.',
      },
      {
        id: 'spec-driven-dev-07-q3',
        prompt: "In pass 2 you see that R2-AC2 fails. What should the review notes record?",
        choices: [
          'The criterion id, the failing test as evidence, and the fix',
          'That the booking feature is poorly written and should be rebuilt',
          'A request for the AI to write a longer explanation of overlaps',
          'A note to remove the R2-AC2 test, since it fails',
        ],
        answer: 0,
        explanation: 'A good finding names the spec line, shows evidence and points at the code. That lets the builder fix exactly one thing and lets you check it afterwards.',
      },
      {
        id: 'spec-driven-dev-07-q4',
        prompt: "Why does the review prompt end with 'skip style, naming and formatting'?",
        choices: [
          'Style and formatting never affect whether code works',
          'Without it the list fills with style findings that add churn',
          'AI tools cannot see style problems, so asking is useless',
          'Style is only checked by a different tool later in the same step',
        ],
        answer: 1,
        explanation: 'A reviewer asked to find problems always finds something. Scoping it to the spec keeps the list to the gaps that matter.',
      },
      {
        id: 'spec-driven-dev-07-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a finding in a review?',
        choices: [
          'A new feature that the AI discovers and builds on its own',
          'A copy of the spec that you save for later',
          'A message that tells you the whole app passed',
          'One problem you write down, with the list line it breaks',
        ],
        answer: 3,
        explanation: 'A finding is one specific problem, tied to the line of your list it breaks, with evidence such as a failing check.',
      },
      {
        id: 'spec-driven-dev-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Which setup makes an AI review most trustworthy as a gate before merge?',
        choices: [
          'A fresh session or model, findings cite requirements, a person decides',
          'The same session that wrote the code reviews it, because it knows the intent best',
          'The reviewer is told to approve unless the suite has fewer than ten tests',
          'The reviewer reads only the final summary written by the builder',
        ],
        answer: 0,
        explanation: 'Independence avoids the builder justifying its own work, citing requirements keeps opinions out, and a human still owns the decision to accept.',
      },
    ],
    task: {
      title: 'Review a piece of AI-built work',
      minutes: 20,
      steps: [
        'Take a small feature you built or have an AI build quickly for the spec you wrote, with no task list.',
        'Pass 1: run its tests (or, if it has none, run the ones you wrote) and save the full output.',
        'Pass 2 and 3: write a review.md with a findings table (kind, spec id, evidence, fix), a Gaps section and a decision.',
        'Run the review prompt from this lesson in a fresh session and compare its findings with yours.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Show me the exact lines behind finding 1 and explain in plain words why they break my list." Check the lines it quotes are really in the file.'] },
      { audience: { min: 'advanced' }, steps: ['Add a pass 3 checklist for your domain (privacy, authorisation, error paths, resource use). Require each finding to cite a requirement or constraint, and discard any that does not.'] },
    ],
  },
  {
    id: 'spec-driven-dev-08',
    day: 8,
    title: 'Keeping the spec alive as the product changes',
    summary: 'How a spec stays true after launch: change it first, update the tests red, build to green, and check that every requirement still has a test.',
    intro: {
      objectives: [
        'Explain how a spec goes stale and what it costs',
        'Apply a change to a spec, its tests and its code in the right order',
        'Use a regression run to prove old behaviour still works',
        'Check automatically that every criterion has a test',
      ],
      why: 'A spec that no longer matches the product is worse than none: the next AI session builds from a description that is wrong. Keeping it alive is how the first weeks of work keep paying off.',
    },
    minutes: 25,
    skills: ['spec-maintenance'],
    body: [
      { type: 'paragraph', text: "Two weeks after launch, Ben answers the open question from the spec: yes, he closes for lunch from 12:00 to 1:00. And customers ask to cancel online, which the spec listed as a non-goal. The product has changed. The next time anyone asks an AI to add a feature, it will read the spec, which still says the shop is open all day and cancelling is out of scope, and it will build on something that is no longer true. A spec stays useful only if changing it is part of changing the product." },
      { type: 'heading', text: 'How a spec goes stale' },
      {
        type: 'list',
        items: [
          '**Code changes, the spec does not.** A quick fix in a hurry that nobody writes down.',
          '**The decision lives in a chat.** The AI was told "allow it", and the rule exists nowhere else.',
          '**A test is edited to match the code.** The tests now describe what the code does, not what the spec says.',
        ],
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a spec is like the menu of a restaurant. If the kitchen starts cooking a new dish and nobody updates the menu, the next waiter, or the next AI, takes orders for the wrong things. So the rule is: update the menu first, then check the new dish, then cook it. A **regression** is when something that used to work stops working after a change. Running all the old checks again after a change tells you whether you caused one." },
      { type: 'heading', text: 'The order: spec, tests, tasks, code' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A change travels the same road as the first version, with one extra rule: the old tests must stay green.',
        source: 'flowchart TD\n  A[A change is wanted] --> B[Update the spec: new lines, new version, changelog]\n  B --> C[Update design and tasks if needed]\n  C --> D[Add tests for the new criteria]\n  D --> E[Run all tests: only the new ones may fail]\n  E --> F[Build the change one task at a time]\n  F --> G[Run all tests: old ones stay green]\n  G --> H(Commit the spec, tests and code together)',
      },
      { type: 'paragraph', text: "Start with the spec because it is the cheapest place to find out the change is wrong or conflicts with something. Here is the change as a diff of spec.md. A line starting with a minus is removed, a plus is added:" },
      {
        type: 'code',
        language: 'diff',
        label: 'specs/booking/spec.md, version 1 to 1.1',
        code: `-Status: Draft v1 | Owner: Ben | Date: 2026-12-01
+Status: v1.1 | Owner: Ben | Date: 2026-12-08
+
+## Changelog
+- v1.1 (2026-12-08) Ben answered Q1 (lunch). Added R6 and R7.
+  Cancelling is no longer a non-goal.

+### R6 Lunch break
+As Ben, I want no bookings from 12:00 PM to 1:00 PM so that I can eat.
+- R6-AC1 A booking that overlaps 12:00 PM to 1:00 PM is refused.
+- R6-AC2 A booking that ends at 12:00 PM or starts at 1:00 PM is allowed.
+
+### R7 Cancelling a booking
+As a customer, I want to cancel a booking so that Ben can give my
+time to someone else.
+- R7-AC1 A booking can be cancelled 2 hours or more before it
+  starts, and its time can be booked again.
+- R7-AC2 Less than 2 hours before it starts, cancelling is refused.
+- R7-AC3 Cancelling a booking that does not exist is refused.
+- R7-AC4 Sending the original booking request again after a cancel
+  does not bring the booking back.

-No online cancelling or rescheduling.
+No rescheduling.

-- Q1 Does Ben close for lunch? (Owner: Ben. Needed before launch.)
+- Q1 Answered 2026-12-08: closed 12:00 PM to 1:00 PM (see R6).`,
      },
      { type: 'paragraph', text: "Look at R7-AC4. It did not come from Ben. It came from asking one question of the old spec: what does R4 (pressing Confirm twice books once) mean now that bookings can be cancelled? If the first press was cancelled and the phone sends it again, a naive build would return the old, cancelled booking as if it were confirmed. Asking how each existing requirement interacts with the change is how a spec change finds its own gaps. The design gets the matching lines: a lunch check between the hours check and the overlap check, a cancelBooking(shop, id, now) function, a status on every booking, and a decision that a cancelled booking keeps its request id so a replay is refused." },
      { type: 'heading', text: 'Red for the new, green for the old' },
      { type: 'paragraph', text: "Add tests for R6 and R7, then run the whole suite against the code as it stands, before any new code. These are the real results:" },
      {
        type: 'code',
        language: 'text',
        label: 'Spec 1.1 tests (17) against the version 1 code, timings removed',
        code: `✔ R1-AC1 ... through R5-AC1   (the original 11 still pass)
✖ R6-AC1 a cut-and-beard at 11:30 AM that runs into lunch is refused
✔ R6-AC2 a booking that ends at 12:00 PM or starts at 1:00 PM is allowed
✖ R7-AC1 a booking can be cancelled 2 hours or more before it starts, and its time opens up
✖ R7-AC2 less than 2 hours before the start, cancelling is refused
✖ R7-AC3 cancelling a booking that does not exist is refused
✖ R7-AC4 sending the original request again after a cancel does not bring the booking back
ℹ tests 17
ℹ pass 12
ℹ fail 5`,
      },
      { type: 'paragraph', text: "Five new tests fail, which is exactly the new work. R6-AC2 passes at once: it is a guard for the boundary (ending exactly at noon is fine), not proof of anything yet. After the change was built, task by task, the same file gave 17 passing and 0 failing, and the original eleven tests alone, run against the new code, still gave 11 passing. That second run is the regression check: it shows the change broke nothing that worked before." },
      { type: 'heading', text: 'Let a script keep you honest' },
      { type: 'paragraph', text: "Discipline fails on busy days, so make the traceability automatic. This short script reads every criterion id (R6-AC1 and so on) from spec.md and checks that some test has that id in its name. It is the kind of small tool an AI writes in a minute and a team runs in its checks." },
      {
        type: 'code',
        language: 'javascript',
        label: 'check-spec.js',
        code: `const fs = require('fs');
const [specFile, testFile] = process.argv.slice(2);
const ids = [...new Set(fs.readFileSync(specFile, 'utf8').match(/R\\d+-AC\\d+/g) || [])];
const tests = fs.readFileSync(testFile, 'utf8');
const missing = ids.filter((id) => !tests.includes("test('" + id + ' '));
console.log('Criteria in the spec: ' + ids.length);
console.log('Criteria with a test: ' + (ids.length - missing.length));
if (missing.length > 0) {
  console.log('Missing tests: ' + missing.join(', '));
  process.exit(1);
}
console.log('Every criterion has a test.');`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the 1.1 spec against the old tests, then against the updated tests',
        code: `$ node check-spec.js specs/booking/spec.md src/booking/booking.test.js
Criteria in the spec: 17
Criteria with a test: 11
Missing tests: R6-AC1, R6-AC2, R7-AC1, R7-AC2, R7-AC3, R7-AC4

$ node check-spec.js specs/booking/spec.md src/booking/booking.test.js
Criteria in the spec: 17
Criteria with a test: 17
Every criterion has a test.`,
      },
      { type: 'tip', text: "Commit the spec, the tests and the code of a change together, with the spec version in the message. Then anyone can see that v1.1 of the spec and the behaviour of the code belong together." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "A change to the rules meets existing data. Bookings made before v1.1 may already sit across lunch, and a naive migration or validation would suddenly make them invalid. Decide in the spec: grandfather existing bookings (let them stand under the old rule), notify and move them, or refuse edits to them, and test that choice. Mark superseded requirements instead of deleting them so history stays readable. Gate merges on the traceability script, and use a drift check against the codebase (Spec Kit's converge step does this, and a second review pass can) on a schedule. Release behaviour that surprises users behind a flag. Assign every spec file an owner, so a change always has someone to approve it." },
      {
        type: 'version',
        text: "Checked 2026-11-14. GitHub's Spec Kit README lists converge as the last step of its minimal flow: run implement and then converge, and repeat until convergence reports Converged. Its documentation describes converge as checking the codebase against the spec, plan and tasks and adding new tasks for gaps, and analyze as a read-only report of conflicts, gaps and ambiguities; the README itself lists neither in detail. The git diff format used above (lines starting with minus and plus) is standard, and the Node test runner used in earlier lessons is documented as stable in Node 22.",
        checked: CHECKED,
        sources: [DOCS.specKit, DOCS.nodeTest],
      },
      {
        type: 'takeaways',
        items: [
          'A spec goes stale when code changes without it, when decisions live only in chat, or when tests are edited to fit the code.',
          'Change in this order: spec, design and tasks, new tests (red), code (green), with the old tests staying green.',
          'Ask how each existing requirement interacts with the change: that is how the spec finds its own gaps.',
          'A small script that checks every criterion has a test makes the link automatic.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-08-arrange-1',
          kind: 'arrange',
          title: 'Order a spec change',
          prompt: 'Arrange the steps for adding the lunch-break rule to a feature that is already live.',
          concept: 'changing a spec safely',
          language: 'text',
          solution: [
            'Update spec.md: add R6, bump the version, write the changelog',
            'Update design.md and tasks.md for the lunch check',
            'Add tests for R6-AC1 and R6-AC2',
            'Run all tests: only the new ones should fail',
            'Build the lunch check as one task',
            'Run all tests: the old ones must still pass',
            'Commit the spec, tests and code together',
          ],
          reasons: [
            'The spec is the cheapest place to find the change is wrong, and every later step reads it.',
            'The design and task list must match the spec before anyone builds.',
            'The new criteria need checks before there is any code for them.',
            'Red for the new tests, and nothing else, shows the tests can fail and nothing broke yet.',
            'One small task, with the usual loop.',
            'Old tests staying green is the regression check.',
            'Together they describe one version of the product.',
          ],
          hints: [
            'What do all the other steps read from or depend on?',
            'Tests are written before the code they check, and run before and after the build.',
            'Spec first, then design and tasks, then tests, then red run, then build, then green run, then commit.',
          ],
          explanation: 'The spec leads, the tests follow and fail first, the code turns them green, and the old tests prove nothing broke. Committing them together keeps spec, tests and code in step.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-08-predict-output-1',
          kind: 'predict-output',
          title: 'What does the traceability check report?',
          prompt: 'A tiny version of the check compares the criterion ids in the spec with the ids that have tests. What does it print?',
          concept: 'spec to test traceability',
          language: 'javascript',
          code: `const specIds = ['R1-AC1', 'R1-AC2', 'R6-AC1', 'R6-AC2', 'R7-AC1'];
const testIds = ['R1-AC1', 'R1-AC2', 'R6-AC1'];
const missing = [];
for (const id of specIds) {
  if (!testIds.includes(id)) missing.push(id);
}
console.log('Criteria in the spec: ' + specIds.length);
console.log('Missing tests: ' + missing.join(', '));`,
          expected: 'Criteria in the spec: 5\nMissing tests: R6-AC2, R7-AC1',
          choices: ['Criteria in the spec: 5\nMissing tests: R6-AC2, R7-AC1', 'Criteria in the spec: 3\nMissing tests: R6-AC2, R7-AC1', 'Criteria in the spec: 5\nMissing tests: R1-AC1, R1-AC2, R6-AC1', 'Criteria in the spec: 5\nMissing tests: R7-AC1'],
          wrongNotes: {
            'Criteria in the spec: 3\nMissing tests: R6-AC2, R7-AC1': 'The first number is the length of specIds, which has five entries, not testIds.',
            'Criteria in the spec: 5\nMissing tests: R1-AC1, R1-AC2, R6-AC1': 'Those three are the ones that DO have tests. The check keeps the ids that are not in testIds.',
            'Criteria in the spec: 5\nMissing tests: R7-AC1': 'R6-AC2 is in the spec but not in the test list, so it is missing too.',
          },
          hints: [
            'specIds has five entries. Count them for the first line.',
            'The loop keeps each id from specIds that is not in testIds.',
            'R6-AC2 and R7-AC1 are the two ids in specIds that testIds does not include.',
          ],
          explanation: 'The check lists the criteria that have no test, here R6-AC2 and R7-AC1, and a nonzero list is the signal to add tests or fix the spec before the change ships.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-08-q1',
        prompt: 'Why should a change be written into the spec before the code changes?',
        choices: [
          'Because AI tools cannot change code unless a spec change comes first',
          'It is the cheapest place to find a wrong or conflicting change',
          'Because the spec must be longer than the code to be useful',
          'Because the tests are generated automatically from the changelog',
        ],
        answer: 1,
        explanation: 'A mistake in a sentence costs minutes to fix. A mistake found in finished code costs far more. The spec also feeds the design, tests and tasks.',
      },
      {
        id: 'spec-driven-dev-08-q2',
        prompt: 'You add tests for the new lunch rule and run the whole suite on the old code. Five tests fail, and two old tests also fail. What does that tell you?',
        choices: [
          'Everything is normal, because new work always makes a few old tests fail',
          'The new tests are wrong, so they should be deleted',
          'The spec or tests are inconsistent: old tests should still pass',
          'The old tests were never useful and can be removed',
        ],
        answer: 2,
        explanation: 'Before any code changes, old tests must still pass. Two old failures mean the new tests or spec lines conflict with existing behaviour, which should be settled first.',
      },
      {
        id: 'spec-driven-dev-08-q3',
        prompt: 'How did R7-AC4 (a replayed request after a cancel does not bring the booking back) get into the spec?',
        choices: [
          'Ben asked for it when he requested online cancelling',
          'The AI added it silently while building the cancel function',
          'It was copied from R4 without any change in meaning',
          'Someone asked how R4 behaves once bookings can be cancelled',
        ],
        answer: 3,
        explanation: 'Asking how each existing requirement interacts with the change surfaced a case nobody had mentioned. That is a habit worth repeating on every change.',
      },
      {
        id: 'spec-driven-dev-08-q4',
        prompt: 'What does the check-spec.js script prove when it prints that every criterion has a test?',
        choices: [
          'That the feature is finished and correct',
          'That every criterion is named in some test',
          'That the spec has no gaps or conflicts left in it',
          'That the tests were written before the code',
        ],
        answer: 1,
        explanation: 'It checks coverage by name only. Whether each test passes, and whether the spec itself is right, still need the test run and a review.',
      },
      {
        id: 'spec-driven-dev-08-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a regression?',
        choices: [
          'A brand new feature that is added to the app after the launch date',
          'A list of all the changes made to the spec',
          'Something that worked before a change and stops working after it',
          'A test that has never been run',
        ],
        answer: 2,
        explanation: 'Re-running all the old checks after a change shows whether the change broke something that used to work.',
      },
      {
        id: 'spec-driven-dev-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A new rule makes some existing live data invalid. What should the spec change include?',
        choices: [
          'A decision about existing data, with a test for it',
          'Nothing, because validation only applies to new data',
          'A note asking the AI to fix invalid records when it notices them',
          'A requirement that all old records are deleted before release',
        ],
        answer: 0,
        explanation: 'A rule change meets old data. Choosing what happens to it, and testing that choice, prevents a release that suddenly breaks existing customers.',
      },
    ],
    task: {
      title: 'Change your spec the right way',
      minutes: 20,
      steps: [
        'Invent one change to your feature (a new rule, or an answer to an open question).',
        'Update spec.md: new requirement lines, a version and a changelog entry. Ask how each existing requirement interacts with the change, and add any new line that results.',
        'Add tests for the new criteria. Run the whole suite on the old code and check that only the new tests fail.',
        'Build the change, run the suite again, and commit the spec, tests and code together.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: "Which of my existing rules could this change affect, and how?" Add a line to the spec for any answer that surprises you.'] },
      { audience: { min: 'advanced' }, steps: ['Decide what happens to data created before the change, write it into the spec with a test, and add the traceability script to your checks so a criterion without a test fails the build.'] },
    ],
  },
  {
    id: 'spec-driven-dev-09',
    day: 9,
    title: 'Spec-driven work in a team',
    summary: 'How a team shares specs: review gates before building, owners for each file, instruction files for agents, and hand-offs with a clear contract.',
    intro: {
      objectives: [
        'Name who owns each part of a spec-driven feature in a team',
        'Run a spec review gate before anyone builds',
        'Write project instructions and a pull request template that point at the spec',
        'Write a hand-off contract that tells an agent what to do, touch and return',
      ],
      why: 'Alone, you can keep a spec in your head. With teammates and several AI sessions, the written spec, the owners and the gates are what keep everyone building the same thing.',
    },
    minutes: 25,
    skills: ['team-handoff'],
    body: [
      { type: 'paragraph', text: "On your own, a spec-driven loop is a habit. In a team it becomes a shared agreement. A product owner, an engineer, a tester and several AI sessions all touch the same feature, and the spec is the one place they can all point at. This lesson is about the pieces that make that work: where the files live, who must approve changes to them, what has to be true before building starts, and how a task is handed to an agent so that it comes back as something you can accept." },
      { type: 'heading', text: 'Specs live in the repository and change by pull request' },
      { type: 'paragraph', text: "Put the specs in the same repository as the code, one folder per feature: spec.md, design.md, tasks.md, the tests and, later, review.md. A change to a spec is then a pull request, a proposed change that people review and discuss before it is merged. That gives the spec history, comments and approvals for free. It also surfaces disagreements early: two people who want different rules will conflict in a spec file, which is cheaper to settle than a conflict in code that has already been built." },
      {
        type: 'code',
        language: 'text',
        label: 'The repository layout',
        code: `AGENTS.md                      project instructions for every AI session
.github/CODEOWNERS             who must review which files
.github/pull_request_template.md
specs/booking/spec.md          what and why (owned by product)
specs/booking/design.md        how (owned by engineering)
specs/booking/tasks.md         the task list with done checks
specs/booking/review.md        the review notes
src/booking/booking.js
src/booking/booking.test.js    the acceptance tests`,
      },
      { type: 'heading', text: 'Who owns what' },
      {
        type: 'table',
        headers: ['Role', 'Owns', 'Signs off'],
        rows: [
          ['Product owner', 'Why, users, stories, non-goals and the open questions.', 'The spec before building, and the final accept.'],
          ['Engineer', 'The design, the task list and feasibility.', 'The design and that the tasks cover the spec.'],
          ['Tester or QA', 'Turning criteria into acceptance tests and the red run.', 'That every criterion has a test that can fail.'],
          ['Reviewer', 'The review against the spec (a person, or an AI that a person supervises).', 'That the implementation matches the spec.'],
          ['AI agent', 'Building one task inside its fences.', 'Nothing: it reports, a person decides.'],
        ],
        caption: 'One person can wear several hats on a small team. What matters is that each sign-off has a name.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: when several people build something together, they need a shared recipe book and a rule that nobody changes a recipe without the right person agreeing. A **pull request** is a way to propose a change and let others read it first. An **owner** is the person who must say yes. A **gate** is a checkpoint that building does not pass until the questions are answered. Nothing here is complicated: it is the same list and checks you already know, with names attached to them." },
      { type: 'heading', text: 'The spec review gate' },
      { type: 'paragraph', text: "Before the first task is built, the team checks the spec itself. This is the cheapest review there is: reading a page, not a diff. If the answer to any line is no, building waits." },
      {
        type: 'list',
        ordered: true,
        items: [
          'Every requirement has an id, and every criterion is true or false (the testability test).',
          'Non-goals are written, and constraints (privacy, time zones, limits) are stated.',
          'Every open question has an owner, and no unanswered question blocks a task that is about to be built.',
          'The design traces every requirement, and its risks are written down.',
          'The tasks cover every criterion (a coverage table), and each task ends in a done check.',
          'The acceptance tests exist and have been run red.',
        ],
      },
      { type: 'heading', text: 'Files that carry the rules to every session' },
      { type: 'paragraph', text: "Agents start every session knowing nothing, so the project must tell them. Many tools read a project instruction file at the start: Claude Code reads CLAUDE.md or AGENTS.md, and Codex describes AGENTS.md as an open-format README for agents that loads into context automatically, and says it should state what done means and how to verify work. Keep it short. It should hold only what the agent cannot work out from the code." },
      {
        type: 'code',
        language: 'markdown',
        label: 'AGENTS.md',
        code: `# Project instructions
- Specs live in specs/<feature>/ (spec.md, design.md, tasks.md).
  Read them before building anything.
- Build from specs/<feature>/tasks.md, one task at a time. Do not
  start a task whose "Depends on" tasks are not done.
- Never edit a *.test.js file to make a test pass. If a test looks
  wrong, stop and explain why.
- If the spec is silent or unclear, stop and ask. Do not decide.
- Run: node --test --test-reporter=spec
  A task is done when its "Done when" tests pass and no test that
  passed before now fails. Show the command and its output.
- Never write a customer's name or phone to a log (constraint C2).`,
      },
      {
        type: 'code',
        language: 'text',
        label: '.github/CODEOWNERS (replace the team names with your own)',
        code: `# A change to a spec or to the acceptance tests needs the owners.
/specs/                        @kuyaben-shop/product-owners
/src/booking/booking.test.js   @kuyaben-shop/product-owners @kuyaben-shop/qa`,
      },
      {
        type: 'code',
        language: 'markdown',
        label: '.github/pull_request_template.md',
        code: `## Spec
Spec: specs/<feature>/spec.md (version: __)
Tasks done: T__

## Acceptance criteria
- [ ] Every criterion has a test with its id in the name
- [ ] Test command and output attached
- [ ] No test was edited to make it pass (or the edit is explained
      and the spec was changed first)

## Review against the spec
- [ ] specs/<feature>/review.md is attached
- [ ] Anything changed outside the task's files is listed here: __`,
      },
      { type: 'paragraph', text: "Two details are worth knowing. CODEOWNERS can live in .github, the repository root or docs, and when the repository owner turns on the branch protection setting that requires review from code owners, a change to those files cannot merge without an owner's approval. That is what stops an agent, or a rushed developer, from quietly editing the tests. And a pull request template is a Markdown file named pull_request_template.md whose contents appear in every new pull request." },
      { type: 'heading', text: 'The agent hand-off contract' },
      {
        type: 'table',
        headers: ['Goes to the agent', 'Comes back'],
        rows: [
          ['The task id and what to do, in a sentence or two', 'A diff of exactly the files the task allowed'],
          ['The files that explain it: spec, design, the tests', 'The test command and its full output'],
          ['Done when: the criteria that must pass, and that nothing else may fail', 'A list of the lines changed and anything it assumed'],
          ['The fences: files it may change, things it must not do', 'Questions it stopped on instead of guessing'],
          ['What to do when unsure: stop and ask', 'No edits to tests, specs or files outside the fences'],
        ],
        caption: 'The contract works the same for a person and for an agent. What is left unwritten gets guessed.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One feature through a team: two gates and a review, with a person making each decision.',
        source: 'flowchart TD\n  A[Spec pull request] --> B{Spec review gate}\n  B -->|questions open| A\n  B -->|passes| C[Design and tasks reviewed]\n  C --> D[Agents build tasks within fences]\n  D --> E[Pull request: tests, output, review.md]\n  E --> F{Owners and reviewer accept}\n  F -->|findings| D\n  F -->|accepted| G(Merge and ship)',
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "At team scale the questions become governance. Who may change a requirement after build started, and how is that change communicated to agents already running? Who owns the constitution, a short set of project-wide principles every spec must follow (Spec Kit has a command for creating one, and its methodology document calls it a set of immutable principles that govern how specifications become code)? Keep test files and specs under CODEOWNERS and required checks, so no single author or agent can move the goalposts. Run the traceability script and the acceptance suite as required checks. Track the metrics that show whether the method works: defects found in review rather than production, time spent on spec versus rework, how often a build stopped on a spec gap." },
      {
        type: 'version',
        text: "Checked 2026-11-14. GitHub Docs say a CODEOWNERS file can be placed in .github, the repository root or docs, and that a branch protection rule can require review from code owners. A pull request template is a Markdown file named pull_request_template.md, in the repository root, docs or .github. Claude Code reads CLAUDE.md files for project instructions, can read AGENTS.md as project instructions when no CLAUDE.md is present, and recommends keeping each CLAUDE.md under about 200 lines. Codex's best-practices page describes AGENTS.md as an open-format README for agents that loads into context automatically and recommends it state what done means and how to verify work. GitHub's Spec Kit describes a constitution as a set of project principles created once per project. Details change by tool version.",
        checked: CHECKED,
        sources: [DOCS.ghCodeowners, DOCS.ghPrTemplate, DOCS.claudeMemory, DOCS.codexBest, DOCS.specKitMethod],
      },
      {
        type: 'takeaways',
        items: [
          'Keep specs in the repository and change them by pull request, so they have history, reviewers and owners.',
          'Run a spec review gate before building: testable criteria, open questions owned, design traced, tasks covering, tests red.',
          'Instruction files, CODEOWNERS and a pull request template carry the rules to every person and session.',
          'A hand-off contract names the task, the files, the done check, the fences, and what comes back.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-09-match-1',
          kind: 'match',
          title: 'Which file does which job?',
          prompt: 'Match each team artifact to the problem it prevents or the job it does.',
          concept: 'team artifacts for spec-driven work',
          labels: { terms: 'The artifact', meanings: 'Its job' },
          pairs: [
            { term: 'spec.md reviewed in a pull request', definition: 'The owner approves what the feature must do before anyone builds it', note: 'Reading a page is the cheapest review there is.' },
            { term: 'A CODEOWNERS entry for the acceptance test file', definition: 'A named reviewer must approve a change to what counts as done', note: 'It stops tests being edited quietly to go green.' },
            { term: 'An AGENTS.md line: never edit tests to make them pass', definition: 'Every new AI session starts knowing the project rule', note: 'A new session remembers nothing, so the project must tell it.' },
            { term: 'A pull request template with a criteria checklist', definition: 'The author is reminded to attach test output and the review notes', note: 'It puts the evidence in front of the reviewer every time.' },
          ],
          hints: [
            'Ask what goes wrong in a team if the artifact is missing.',
            'Which artifact decides who must approve a change? Which one is read by an AI at the start of a session?',
            'CODEOWNERS is about approval, AGENTS.md about instructions, the template about evidence, and the spec pull request about agreeing what to build.',
          ],
          explanation: 'Each artifact closes one gap: agreement on what to build, approval for what counts as done, rules for sessions that remember nothing, and evidence at review time.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'Fix the hand-off',
          prompt: 'This hand-off will let an agent drift. Tap the line that has no checkable ending and choose the best rewrite.',
          concept: 'agent hand-off contracts',
          language: 'markdown',
          code: `Task T4 No double booking: refuse overlapping bookings on the same day.
Read: specs/booking/spec.md, design.md, src/booking/booking.test.js
Done when: the booking page works.
Files you may change: src/booking/booking.js only.
If something is unclear: stop and ask. Do not guess.`,
          bugLine: 3,
          fixes: [
            { line: 'Done when: R2-AC1, R2-AC2 and R2-AC3 pass and no test that passed before now fails.', correct: true, why: 'It names the exact criteria, and the second half makes sure the new task does not break earlier work. The agent can check it, and so can you.' },
            { line: 'Done when: you are confident that the code is correct.', correct: false, why: 'Confidence is not a check. The agent can be confident and wrong, and you have nothing to verify.' },
            { line: 'Done when: the code is clean, tidy and well structured.', correct: false, why: 'Style opinions are not acceptance criteria and invite endless polishing instead of a result you can tick.' },
            { line: 'Done when: the page loads in the browser without errors.', correct: false, why: 'It can load without a single booking rule working. It does not tie done to the spec.' },
          ],
          lineNote: 'That line is fine. Look for the line that gives the agent no way to check that it is finished.',
          hints: [
            'Which line could the agent claim is finished with nothing to prove it?',
            "'Works' is not a check. What did Lesson 5 say should define done?",
            'Name the acceptance criteria that must pass, and add that nothing that passed before may fail.',
          ],
          explanation: 'A hand-off needs a done check that a machine can run: the criteria that must pass and no regression. Everything else in the contract (files, reading list, stop rule) was already fine.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-09-q1',
        prompt: 'Why keep specs in the same repository as the code and change them by pull request?',
        choices: [
          'Because the AI tools refuse to read anything outside a repository',
          'Because specs are smaller than code and fit better in a pull request',
          'Because pull requests automatically turn spec lines into tests',
          'The spec gets history and approvals, and disagreements show early',
        ],
        answer: 3,
        explanation: 'A spec change reviewed like code keeps a record of who agreed what, and conflicts between teammates appear in a document instead of in finished code.',
      },
      {
        id: 'spec-driven-dev-09-q2',
        prompt: 'Which item belongs in the spec review gate, before the first task is built?',
        choices: [
          'A list of the bugs the AI found while building',
          'The final performance numbers from the finished feature',
          'Every open question has an owner',
          'The release notes for the version that ships',
        ],
        answer: 2,
        explanation: 'The gate checks the spec itself. Performance results, bugs and release notes only exist after building.',
      },
      {
        id: 'spec-driven-dev-09-q3',
        prompt: 'A developer wants an agent to stop quietly editing acceptance tests. Which setup directly prevents merging such a change?',
        choices: [
          'A CODEOWNERS entry plus required code owner review',
          'A pull request template that has a checklist about tests',
          'A line in AGENTS.md asking the agent to be careful',
          'A longer prompt reminding the agent about the tests in each session',
        ],
        answer: 0,
        explanation: 'Instructions and reminders ask; required code-owner review enforces. A change to the test file cannot merge without an owner approving it.',
      },
      {
        id: 'spec-driven-dev-09-q4',
        prompt: "In the hand-off contract, what should the agent return besides the diff?",
        choices: [
          'A summary of the project history for the next developer',
          'The test command and its output, and any questions',
          'A rewritten spec that fits the code it produced',
          'A new task list for the whole feature',
        ],
        answer: 1,
        explanation: 'Evidence, a list of changes and open questions let you accept or reject quickly. Rewriting the spec to fit the code would reverse the order of authority.',
      },
      {
        id: 'spec-driven-dev-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a pull request?',
        choices: [
          'A request for the AI to pull the latest news into the project',
          'A message sent to customers about a new feature',
          'A button that deletes the old version of the spec',
          'A way to propose a change for others to approve',
        ],
        answer: 3,
        explanation: 'A pull request proposes a change and lets teammates review it first. It is how specs and code get a second pair of eyes.',
      },
      {
        id: 'spec-driven-dev-09-q6',
        audience: { min: 'advanced' },
        prompt: 'Which metric best shows that spec-driven work is paying off for a team?',
        choices: [
          'Fewer defects in production and less rework',
          'How many AI sessions run each day across the team',
          'The number of pages of specification written each month',
          'The number of requirements added to each feature',
        ],
        answer: 0,
        explanation: 'The point of a spec is to find problems earlier and cheaper. Volume of paper or of sessions says nothing about whether it works.',
      },
    ],
    task: {
      title: 'Set up your team files',
      minutes: 20,
      steps: [
        'In a practice repository, create the folder layout from this lesson with your own spec, design and tasks files.',
        'Write AGENTS.md (or CLAUDE.md) with the six rules above, changed to fit your project, and keep it short.',
        'Write a pull_request_template.md and a CODEOWNERS file using your own account names.',
        'Write a hand-off for your first task with the five parts of the contract, and check that its Done when line could be run by a machine.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Show your hand-off to a friend and ask them to say, in their own words, what done means. If they cannot, rewrite the Done when line.'] },
      { audience: { min: 'advanced' }, steps: ['Turn on branch protection that requires code owner review in a practice repository. Try changing a test file on a branch and note what the merge screen asks for. Add the traceability script as a required check.'] },
    ],
  },
  {
    id: 'spec-driven-dev-10',
    day: 10,
    title: 'Project: take one feature from spec to shipped',
    summary: 'Put the whole method together on one feature of your own: the pack of documents, the build, the review and what shipped really means.',
    intro: {
      objectives: [
        'Choose a feature that is the right size for a spec-driven project',
        'List the documents and evidence that make up a finished spec-to-shipped pack',
        'Decide whether a feature is ready to ship using a clear gate',
        'Keep a reusable spec template and review checklist for future work',
      ],
      why: 'You now have each step. This lesson ties them into one repeatable routine, so the next feature you build with AI starts from a template and ends with proof.',
    },
    minutes: 30,
    skills: ['ship-feature'],
    body: [
      { type: 'paragraph', text: "In the last nine lessons you followed one feature, the booking flow for Kuya Ben's Barbershop, from a one-line wish to a built, reviewed and changed feature. The project of this course is to do the same thing with a feature of your own, with an AI tool, from a blank folder to something in a real person's hands. This lesson is the plan for it: how to pick the feature, what the finished pack contains, what shipped means, and the template you will keep." },
      { type: 'heading', text: 'Pick a feature of the right size' },
      { type: 'paragraph', text: "The best project is a **single flow with four to six rules**: something with enough decisions to need a spec, and small enough to build in a few sittings. A booking flow, a checkout with a discount code, a sign-up form with rules, a queue ticket, a splitting of an expense bill among friends: each fits. Leave out payments with real money and anything with other people's private data for this first project. If you cannot list the rules in a few lines, the feature is too big: cut it down to its first useful slice and list the rest as non-goals." },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: pick something small that you actually want, such as a page that works out how much each friend owes after a shared dinner. Write down three or four rules in ordinary sentences, ask the AI to help turn them into a spec, and let it build one small job at a time. You are not expected to understand the code. You are expected to check, by the list you wrote, that the finished app does what the list says. A **template** is a ready-made blank form you fill in each time, so you never start from an empty page." },
      { type: 'heading', text: 'The pack you will hand in' },
      {
        type: 'table',
        headers: ['Stage', 'The file', 'The proof it gives'],
        rows: [
          ['Spec', 'spec.md', 'Numbered requirements, true-or-false criteria, constraints, non-goals, open questions with owners.'],
          ['Design', 'design.md', 'Data, behaviour and decisions with reasons, and a table mapping every requirement to the design.'],
          ['Tasks', 'tasks.md', 'Small tasks with covers, files, done checks and dependencies, and a coverage table.'],
          ['Tests', 'the acceptance tests', 'One test per criterion, named with its id, and the output of the first red run.'],
          ['Build', 'a progress table', 'Pass and fail counts after each task, and a commit per task.'],
          ['Review', 'review.md', 'Findings sorted into bug, gap, extra and spec problem, with evidence, and a decision.'],
          ['Change', 'the changelog in spec.md', 'At least one change made the right way: spec, red, green, old tests still passing.'],
          ['Ship', 'a short release note', 'What the user can now do, what it does not do yet, and how to run the tests.'],
        ],
        caption: 'For the booking feature this was spec.md v1.1, design.md, tasks.md, 17 tests, the review notes and the changelog.',
      },
      { type: 'heading', text: 'What shipped means' },
      { type: 'paragraph', text: "Shipped is not 'the AI said it is done'. It is a short list that anyone can check. Every acceptance criterion passes on the final commit. The review is written and accepted. The spec describes what the code now does, including every change since version 1. No open question is left that blocks users. Someone other than you can run the tests from the README. And a real person can use it, by a link you share, a build you hand over or a deployment, because a feature nobody can reach has not been shipped." },
      { type: 'paragraph', text: "Here is the traceability of the finished booking feature, one row per requirement. This is the kind of table that makes a hand-in easy to review:" },
      {
        type: 'table',
        headers: ['Requirement', 'Task', 'Tests', 'Commit message'],
        rows: [
          ['R1 Service and time', 'T3', 'R1-AC1 to AC4', 'T3: time rules (R1-AC2 to AC4)'],
          ['R2 No double booking', 'T4', 'R2-AC1 to AC3', 'T4: overlap check (R2)'],
          ['R3 Customer details', 'T2', 'R3-AC1, AC2', 'T2: name and phone checks (R3)'],
          ['R4 Confirm twice books once', 'T5', 'R4-AC1', 'T5: duplicate requests (R4)'],
          ['R5 Plain messages', 'T6', 'R5-AC1', 'T6: messages (R5)'],
          ['R6 Lunch break, R7 Cancelling', 'v1.1 change', 'R6-AC1, AC2, R7-AC1 to AC4', 'v1.1: lunch and cancelling (R6, R7)'],
        ],
        caption: 'Each commit message names its task and requirements, so the history reads like the task list.',
      },
      { type: 'heading', text: 'Your reusable template' },
      { type: 'paragraph', text: "Keep this blank spec as your starting point. It is the structure of the booking spec without the booking. Fill it in with the interview prompt from Lesson 2, or by hand." },
      {
        type: 'code',
        language: 'markdown',
        label: 'spec-template.md',
        code: `# Spec: <feature name>
Status: Draft v1 | Owner: <name> | Date: <date>

## Why
<Two or three sentences: the problem and who has it.>

## Users
- <Who, and in what situation.>

## Stories and acceptance criteria
### R1 <name>
As a <who>, I want <what> so that <why>.
- R1-AC1 <A statement that is true or false, with a small example.>
- R1-AC2 <Another, including a boundary or a refusal.>

## Constraints
- C1 <A rule the build must obey: privacy, time zone, limits.>

## Non-goals (version 1)
<What this feature will deliberately not do.>

## Open questions
- Q1 <A decision nobody has made.> (Owner: <name>. Needed before: <task or date>.)

## Changelog
- v1 <date> First version.`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Choose the feature and write its one-sentence goal.',
          'Fill in the template with an AI interviewing you, then run the spec review gate.',
          'Draft design.md and tasks.md in plan mode and check the traceability and the coverage.',
          'Write the acceptance tests and run them red.',
          'Build one task at a time, commit each, and record the pass and fail counts.',
          'Review against the spec, sort the findings, fix them, and run everything again.',
          'Make one change the right way, then ship it and write the release note.',
        ],
      },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "For an experienced developer the useful variation is to run the method on an existing codebase. Write the spec of current behaviour first and check it with characterisation tests (tests that pin down what the code does today, right or wrong), then spec the change as a delta against it. Treat the pack as evidence for your reviewers: the red run, the progress table, the review notes with their findings, the traceability script's output. Measure the first run honestly: time spent on spec, design and review against the time AI spent building, how many findings the review caught, and which gaps the spec still let through. Those gaps are the next lines of your template." },
      {
        type: 'takeaways',
        items: [
          'Pick a single flow with four to six rules: big enough to need a spec, small enough to finish.',
          'The pack is spec, design, tasks, red tests, progress, review, a change and a release note.',
          'Shipped means: all criteria pass, the review is accepted, the spec matches the code, nothing blocking is open, and a real person can use it.',
          'Keep a template and a review checklist so the next feature starts from structure, not from a blank page.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-10-arrange-1',
          kind: 'arrange',
          title: 'From spec to shipped',
          prompt: 'Arrange the nine stages of taking a feature from nothing to shipped.',
          concept: 'the spec-to-shipped pipeline',
          language: 'text',
          solution: [
            'Choose a feature small enough to finish',
            'Write spec.md and close the open questions that block it',
            'Write design.md with a traceability table',
            'Write tasks.md and check every criterion is covered',
            'Write the acceptance tests and run them red',
            'Build one task at a time, committing each',
            'Review against the spec and write review.md',
            'Fix the findings, run all tests, update the spec',
            'Ship it to a real user and write the release note',
          ],
          alternatives: [
            [
              'Choose a feature small enough to finish',
              'Write spec.md and close the open questions that block it',
              'Write design.md with a traceability table',
              'Write the acceptance tests and run them red',
              'Write tasks.md and check every criterion is covered',
              'Build one task at a time, committing each',
              'Review against the spec and write review.md',
              'Fix the findings, run all tests, update the spec',
              'Ship it to a real user and write the release note',
            ],
          ],
          reasons: [
            'Everything starts from a feature you can actually finish.',
            'The spec is what everything else is built and checked against.',
            'The design records how, and traces every requirement.',
            'Tasks need the design, and the coverage check needs the spec.',
            'Tests need the spec, and must fail before anything is built.',
            'The build follows the tasks, one at a time.',
            'The review compares the result with the spec.',
            'Findings are fixed and the spec is brought into line with the code.',
            'Shipping comes last, once the gate is passed.',
          ],
          hints: [
            'What must exist before anything else can be written or checked?',
            'Tests and tasks both come from the spec and design, and both come before the build.',
            'Spec, design, then tasks and tests, then build, then review, then fix and ship.',
          ],
          explanation: 'The pipeline moves from decisions to checks to building to review. Tasks and tests can swap places because each depends only on the spec and design. Review and shipping always come after the build.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-10-code-challenge-1',
          kind: 'code-challenge',
          title: 'The ship gate',
          prompt: 'Write `canShip(status)`. `status` has `criteriaPassing`, `criteriaTotal`, `reviewAccepted`, `specUpToDate` and `openQuestions` (a number of questions that block users). Return `"SHIP"` when everything is in order. Otherwise return the first reason in this order: `"HOLD: tests failing"`, `"HOLD: review not accepted"`, `"HOLD: spec out of date"`, `"HOLD: open questions"`.',
          concept: 'definition of shipped',
          language: 'javascript',
          starter: `function canShip(status) {
  // check the reasons in the order the prompt gives
  return 'SHIP';
}`,
          solution: `function canShip(status) {
  if (status.criteriaPassing < status.criteriaTotal) return 'HOLD: tests failing';
  if (!status.reviewAccepted) return 'HOLD: review not accepted';
  if (!status.specUpToDate) return 'HOLD: spec out of date';
  if (status.openQuestions > 0) return 'HOLD: open questions';
  return 'SHIP';
}`,
          tests: {
            kind: 'function',
            fn: 'canShip',
            cases: [
              { label: 'everything in order', args: [{ criteriaPassing: 17, criteriaTotal: 17, reviewAccepted: true, specUpToDate: true, openQuestions: 0 }], expected: 'SHIP' },
              { label: 'a test is failing', args: [{ criteriaPassing: 16, criteriaTotal: 17, reviewAccepted: true, specUpToDate: true, openQuestions: 0 }], expected: 'HOLD: tests failing' },
              { label: 'review not accepted', args: [{ criteriaPassing: 17, criteriaTotal: 17, reviewAccepted: false, specUpToDate: true, openQuestions: 0 }], expected: 'HOLD: review not accepted' },
              { label: 'spec out of date', args: [{ criteriaPassing: 17, criteriaTotal: 17, reviewAccepted: true, specUpToDate: false, openQuestions: 0 }], expected: 'HOLD: spec out of date' },
              { label: 'an open question blocks users', args: [{ criteriaPassing: 17, criteriaTotal: 17, reviewAccepted: true, specUpToDate: true, openQuestions: 1 }], expected: 'HOLD: open questions' },
              { label: 'tests are reported first when several things are wrong', args: [{ criteriaPassing: 10, criteriaTotal: 17, reviewAccepted: false, specUpToDate: false, openQuestions: 2 }], expected: 'HOLD: tests failing' },
            ],
          },
          hints: [
            'Check each problem in turn with an if, and return as soon as one is found.',
            'The order matters: tests first, then review, then the spec, then open questions.',
            'Compare criteriaPassing with criteriaTotal for the first check, and return SHIP only after every check has passed.',
          ],
          explanation: 'A gate is a list of checks in a fixed order, returning the first failure. Putting the tests first means the report always names the most basic problem. Only when every check has passed does the function return SHIP.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'spec-driven-dev-10-scenario-1',
          kind: 'scenario',
          title: 'Is it ready to ship?',
          prompt: 'Choose what to do before shipping.',
          concept: 'spec matches the shipped code',
          story: 'All 17 tests pass and review.md says Accepted.',
          situation: "While fixing a last review finding, you let the AI change the cancellation notice from 2 hours to 3 hours at Ben's request. The code and its test were changed, but spec.md still says 2 hours. Ben wants to ship tonight. What do you do?",
          options: [
            { text: 'Update spec.md to 3 hours with a changelog entry, confirm the test names the same criterion, run everything again, then ship.', consequence: 'The spec, the test and the code now agree, and the next AI session starts from the truth. It costs ten minutes.', quality: 'best' },
            { text: 'Ship tonight and update the spec next week.', consequence: 'A spec that contradicts the product is exactly how the next feature gets built on a lie, and next week is when nobody remembers.', quality: 'poor' },
            { text: 'Change the code back to 2 hours so that it matches the spec.', consequence: 'It restores agreement but overrides the owner. Ben asked for 3 hours.', quality: 'poor' },
            { text: 'Leave both as they are and add a note in the chat.', consequence: 'The decision now lives in a chat, which is the first way specs go stale.', quality: 'poor' },
          ],
          hints: [
            "Who made the decision, and where is it written?",
            "Which of these leaves the spec, the test and the code saying the same thing?",
            'Spec first, with a changelog entry, then re-run everything, then ship.',
          ],
          explanation: 'Shipped means the spec matches the code. Changing the spec is quick, keeps the owner\'s decision and leaves the next session a true description.',
        },
      },
    ],
    quiz: [
      {
        id: 'spec-driven-dev-10-q1',
        prompt: 'Which feature is the best size for your first spec-driven project?',
        choices: [
          'A complete online shop with payments, accounts and delivery tracking',
          'A one-line change to a button label',
          'A single flow with four to six rules, such as a booking',
          'A social network with feeds, chat and notifications',
        ],
        answer: 2,
        explanation: 'It needs a spec because it has interacting rules, yet it can be built and reviewed in a few sittings. The others are far too big or too small to teach the method.',
      },
      {
        id: 'spec-driven-dev-10-q2',
        prompt: 'Which statement is part of the definition of shipped in this lesson?',
        choices: [
          'The AI says the work is finished',
          'The spec describes what the code now does',
          'The code has more tests than the spec has criteria',
          'The feature has been demonstrated on the developer\'s own laptop',
        ],
        answer: 1,
        explanation: 'A spec that no longer matches the code is a trap for the next session. Shipping requires the written description and the behaviour to agree, among the other checks.',
      },
      {
        id: 'spec-driven-dev-10-q3',
        prompt: 'In the final pack, what does the progress table show?',
        choices: [
          'How many hours each task took the person who built it',
          'The final list of bugs that remain in the shipped feature',
          'Which team member approved each requirement in the spec',
          'The pass and fail counts of the test suite after each task',
        ],
        answer: 3,
        explanation: 'The table records the real counts after each task, showing that every task turned its tests green and none went back to red.',
      },
      {
        id: 'spec-driven-dev-10-q4',
        prompt: 'Why keep a spec template for future features?',
        choices: [
          'It forces every feature to have exactly the same requirements',
          'So the AI can fill it in without asking you any questions',
          'You never start from a blank page',
          'It replaces the need for design and tasks',
        ],
        answer: 2,
        explanation: 'A template carries the structure that worked (why, users, criteria, constraints, non-goals, open questions) so the next spec begins complete.',
      },
      {
        id: 'spec-driven-dev-10-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a template?',
        choices: [
          'A ready-made blank form that you fill in each time',
          'A finished app that you copy and sell to others',
          'A test that the AI runs by itself in the background',
          'A password for sharing your project with friends',
        ],
        answer: 0,
        explanation: 'A template is a blank form with the headings already in place. You fill in the parts that are new each time.',
      },
      {
        id: 'spec-driven-dev-10-q6',
        audience: { min: 'advanced' },
        prompt: 'You apply the method to a large existing codebase. What is the most sensible first step?',
        choices: [
          'Rewrite the whole system from a new spec so that code follows it',
          'Spec the current behaviour, pin it with tests, then spec the change',
          'Skip the spec for the old code and only write specs for new features',
          'Ask the AI to infer every requirement and trust the result',
        ],
        answer: 1,
        explanation: 'Existing behaviour is the baseline. Pinning it with tests lets you change it with a regression check, and a delta spec keeps the new work reviewable.',
      },
    ],
    task: {
      title: 'Plan your project and write the first page',
      minutes: 20,
      steps: [
        'Choose the feature for your project and write its one-sentence goal and four to six rules in plain sentences.',
        'Copy the template from this lesson into specs/<your-feature>/spec.md and fill in Why, Users and your first two requirements with criteria.',
        'List three non-goals and at least one open question with an owner.',
        'Write the ship gate for your own feature: five checks, in order, that must pass before you hand it over.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Keep the feature to three rules. Ask an AI to read your spec and say, in plain words, what an app built from it would do, and check that this matches what you meant.'] },
      { audience: { min: 'advanced' }, steps: ['Choose a feature in an existing codebase. Write the current-behaviour spec for the area it touches, and list the characterisation tests you would add before changing anything.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'spec-driven-dev-p1',
    title: 'Write the spec pack for a feature',
    summary: 'Choose a feature of your own and write its spec, design, task list and acceptance tests, with the tests run red, before any code is built.',
    outcome: 'A reviewable spec pack that shows you can turn an idea into requirements, a design and checkable tasks that an AI can build from.',
    unlockAfterDay: 4,
    steps: [
      { id: 'spec-driven-dev-p1-s1', text: 'Choose a feature of the right size: a single flow with four to six rules. Write its goal in one sentence.' },
      { id: 'spec-driven-dev-p1-s2', text: 'Write spec.md from the template: why, users, at least three requirements with numbered true-or-false criteria, constraints, non-goals and open questions with owners. Use an AI interview to find what you missed.' },
      { id: 'spec-driven-dev-p1-s3', text: 'Draft design.md (data, behaviour with the order of checks, decisions with reasons, a traceability table and risks) in a plan mode or an assistant, and review it for anything no requirement explains.' },
      { id: 'spec-driven-dev-p1-s4', text: 'Write tasks.md with covers, files, done checks and dependencies, and add a coverage table showing every criterion in a task.' },
      { id: 'spec-driven-dev-p1-s5', text: 'Write one acceptance test per criterion, named with its id, and run them before building. Save the output showing which fail and which pass already, and say why.' },
      { id: 'spec-driven-dev-p1-s6', audience: { max: 'beginner' }, text: 'Keep the feature to three rules and about six criteria. Ask the AI to read your spec back to you in plain words and fix anything it misunderstood.' },
      { id: 'spec-driven-dev-p1-s7', audience: { min: 'advanced' }, text: 'Add a non-functional criterion with a threshold, a failure-path criterion (a duplicate submit or a timeout) and a risk about concurrency or existing data, each with a task.' },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your repository or shared folder',
      placeholder: 'https://github.com/you/your-feature-spec',
      hint: 'It should contain spec.md, design.md, tasks.md, the tests and the saved red-run output.',
    },
    rubric: [
      'Every acceptance criterion is true or false, has an id and includes an example or a number.',
      'Non-goals, constraints and open questions (with owners) are written.',
      'The design maps every requirement and states the order of checks and its risks.',
      'The tasks each have one outcome, a done check and dependencies, and every criterion is covered.',
      'There is one test per criterion, and the first run shows which tests fail before building.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The spec is small and every line can be understood without knowing how to code.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The tests run with one command, and the spec uses a data store, an API or a rule that has to be tested.'] },
      { audience: { min: 'advanced' }, items: ['Failure paths and a concurrency or data-migration risk are specified and traced to tasks.', 'A requirement with a measurable threshold has a way to measure it.'] },
    ],
  },
  {
    id: 'spec-driven-dev-p2',
    title: 'Take one feature from spec to shipped',
    summary: 'Build the feature from your spec pack with an AI tool, one task at a time, review it against the spec, change it once the right way and ship it with a release note.',
    outcome: 'A feature in a real person\'s hands with the evidence behind it: the spec, red-to-green test runs, a review against the spec and a spec that still matches the code.',
    unlockAfterDay: 9,
    steps: [
      { id: 'spec-driven-dev-p2-s1', text: 'Add project instructions (AGENTS.md or CLAUDE.md) with the rules: build one task at a time, never edit tests to make them pass, stop and ask when the spec is unclear.' },
      { id: 'spec-driven-dev-p2-s2', text: 'Build each task from tasks.md with the loop: hand-off prompt, confirm red, build, run all tests, read the diff, commit with the task id. Record the pass and fail counts after each task.' },
      { id: 'spec-driven-dev-p2-s3', text: 'Review the result against the spec in three passes (evidence, trace, beyond the tests). Write review.md with findings sorted into bug, gap, extra and spec problem, and a decision.' },
      { id: 'spec-driven-dev-p2-s4', text: 'Fix the findings. Then make one change to the spec the right way: spec and changelog, new tests red, code green, old tests still passing. Run a script that checks every criterion has a test.' },
      { id: 'spec-driven-dev-p2-s5', text: 'Ship the feature to a real person (a link, a build or a deployment) with a README that says how to run the tests, and write a short release note.' },
      { id: 'spec-driven-dev-p2-s6', audience: { max: 'beginner' }, text: 'Ask the AI to explain each task\'s change in plain words and say which test it is for. Tick every criterion yourself on the finished app.' },
      { id: 'spec-driven-dev-p2-s7', audience: { min: 'advanced' }, text: 'Run at least two independent tasks in separate worktrees and merge in dependency order, with a fresh-session review, a CODEOWNERS entry for the tests and the traceability script as a required check.' },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your repository',
      placeholder: 'https://github.com/you/your-feature',
      hint: 'It should contain the spec pack, the code, the progress table, review.md, the changelog and the release note, and say who can use the feature.',
    },
    rubric: [
      'Every acceptance criterion passes on the final commit, with the test output shown.',
      'The build history shows one task per commit and the pass and fail counts after each.',
      'review.md compares the work with the spec and sorts its findings, each with evidence.',
      'The spec describes what the shipped code does, including at least one change with a changelog entry.',
      'A real person can use the feature, and the README explains how to run the tests.',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The feature is small, and every criterion has been ticked on the finished app.'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The feature stores data and its rules are tested, including a refusal case and a boundary.'] },
      { audience: { min: 'advanced' }, items: ['The review was done independently of the builder, with findings that cite a requirement or constraint.', 'The pack includes a note on existing data or concurrency and how a required check keeps spec and tests linked.'] },
      { audience: { min: 'professional' }, items: ['The work shows an agent-assisted workflow with review evidence: hand-offs, red-to-green runs, fences held and a measured comparison of time spent on spec, build and review.'] },
    ],
  },
];

export const specDrivenDevCourse: Course = {
  id: 'spec-driven-dev',
  kind: 'standard',
  title: 'Spec-Driven Development',
  level: 'intermediate',
  tagline: 'Write the spec first, then let AI build to it, test it and be reviewed against it.',
  description: 'Learn to write the specification before the code and let AI build to it. You write requirements an AI can build from, turn them into a design and a task list, use acceptance tests as the definition of done, build one task at a time, and review the result against the spec. The method works with Claude Code, Cursor, Codex, GitHub Spec Kit or any assistant.',
  finishLine: [
    'A written spec, design, task list and acceptance tests for one real feature',
    'That feature built by AI one task at a time, and reviewed against its own spec',
    'A reusable spec template and review checklist for your own projects',
  ],
  objectives: [
    'Write requirements, user stories and acceptance criteria that an AI can build from',
    'Turn a spec into a design and a list of small, checkable tasks',
    'Use acceptance tests as the definition of done for each task',
    'Direct an AI to build one task at a time and review the result against the spec',
    'Keep a spec alive as the product changes',
    'Run spec-driven work in a team with review gates and agent handoffs',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev', 'fresh-grad'],
  skills: [
    { id: 'spec-first', label: 'Spec before code' },
    { id: 'requirements-ac', label: 'Requirements and acceptance criteria' },
    { id: 'design-from-spec', label: 'Design from a spec' },
    { id: 'task-breakdown', label: 'Task breakdown' },
    { id: 'acceptance-tests', label: 'Acceptance tests' },
    { id: 'one-task-loop', label: 'Building one task at a time' },
    { id: 'spec-review', label: 'Reviewing against a spec' },
    { id: 'spec-maintenance', label: 'Keeping a spec alive' },
    { id: 'team-handoff', label: 'Team review gates and agent handoffs' },
    { id: 'ship-feature', label: 'Spec to shipped' },
  ],
  lessons,
  projects,
  icon: 'fact_check',
  updated: '2026-11-14',
};
