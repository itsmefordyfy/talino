import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Improve and Expand Existing Applications with AI. The worked example is one practice project, "Tindahan Orders" (an Express + HTML
 * order and utang tracker of about 710 lines, written for this course in a messy 2021 style, with no tests). Every step in these
 * lessons was run on it while the course was written (Node.js 22.23, npm 12.0, Git 2.54): the maps, greps, diffs, test runs,
 * coverage tables, npm output and benchmark numbers shown are the real output of those runs (only the long folder part of a file
 * path was shortened). Every "example AI answer" is written for this course and labelled as such: it is not the output of a real
 * model. Product statements live in dated `version` notes.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  ccWorkflows: { label: 'Claude Code docs: Common workflows (understand new codebases, refactor, tests)', url: 'https://code.claude.com/docs/en/common-workflows' },
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  ccPlan: { label: 'Claude Code docs: Permission modes (plan mode)', url: 'https://code.claude.com/docs/en/permission-modes' },
  ccCheckpoint: { label: 'Claude Code docs: Checkpointing', url: 'https://code.claude.com/docs/en/checkpointing' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project (CLAUDE.md)', url: 'https://code.claude.com/docs/en/memory' },
  ccLarge: { label: 'Claude Code docs: Monorepos and large codebases', url: 'https://code.claude.com/docs/en/large-codebases' },
  cursorPlan: { label: 'Cursor docs: Plan Mode', url: 'https://cursor.com/docs/agent/planning' },
  cursorCheckpoints: { label: 'Cursor docs: Checkpoints', url: 'https://cursor.com/docs/agent/chat/checkpoints' },
  cursorIndex: { label: 'Cursor docs: Codebase indexing (Instant Grep)', url: 'https://cursor.com/docs/context/codebase-indexing' },
  cursorRules: { label: 'Cursor docs: Rules (and AGENTS.md)', url: 'https://cursor.com/docs/context/rules' },
  codexPrompting: { label: 'Codex docs: Prompting (explain a codebase, write a test, refactor, review)', url: 'https://learn.chatgpt.com/docs/prompting' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  copilotBest: { label: 'GitHub Docs: Best practices for using GitHub Copilot', url: 'https://docs.github.com/en/copilot/get-started/best-practices' },
  copilotChat: { label: 'GitHub Docs: Asking GitHub Copilot questions in your IDE (ask, agent and plan modes)', url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide' },
  copilotInstructions: { label: 'GitHub Docs: Adding repository custom instructions for Copilot', url: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions' },
  gitSwitch: { label: 'Git docs: git-switch', url: 'https://git-scm.com/docs/git-switch' },
  gitDiff: { label: 'Git docs: git-diff', url: 'https://git-scm.com/docs/git-diff' },
  gitRestore: { label: 'Git docs: git-restore', url: 'https://git-scm.com/docs/git-restore' },
  gitLog: { label: 'Git docs: git-log (the -S pickaxe search)', url: 'https://git-scm.com/docs/git-log' },
  gitBlame: { label: 'Git docs: git-blame', url: 'https://git-scm.com/docs/git-blame' },
  gitWorktree: { label: 'Git docs: git-worktree', url: 'https://git-scm.com/docs/git-worktree' },
  nodeTest: { label: 'Node.js 22 docs: Test runner', url: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
  nodeCli: { label: 'Node.js 22 docs: Command-line options (--cpu-prof, test coverage flags)', url: 'https://nodejs.org/docs/latest-v22.x/api/cli.html' },
  nodeCrypto: { label: 'Node.js 22 docs: crypto.randomUUID()', url: 'https://nodejs.org/docs/latest-v22.x/api/crypto.html#cryptorandomuuidoptions' },
  nodePerf: { label: 'Node.js 22 docs: Performance measurement APIs', url: 'https://nodejs.org/docs/latest-v22.x/api/perf_hooks.html' },
  mdnPerfNow: { label: 'MDN: Performance.now()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Performance/now' },
  mdnDateTimeFormat: { label: 'MDN: Intl.DateTimeFormat', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat' },
  npmOutdated: { label: 'npm docs: npm outdated', url: 'https://docs.npmjs.com/cli/v11/commands/npm-outdated' },
  npmUpdate: { label: 'npm docs: npm update', url: 'https://docs.npmjs.com/cli/v11/commands/npm-update' },
  npmAudit: { label: 'npm docs: npm audit', url: 'https://docs.npmjs.com/cli/v11/commands/npm-audit' },
  npmCi: { label: 'npm docs: npm ci', url: 'https://docs.npmjs.com/cli/v11/commands/npm-ci' },
  npmLock: { label: 'npm docs: package-lock.json', url: 'https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json' },
  npmSemver: { label: 'npm docs: About semantic versioning', url: 'https://docs.npmjs.com/about-semantic-versioning' },
  semver: { label: 'Semantic Versioning 2.0.0', url: 'https://semver.org/' },
  expressMigrate: { label: 'Express docs: Migrating to Express 5', url: 'https://expressjs.com/en/guide/migrating-5.html' },
  expressHistory: { label: 'Express release history (4.x History.md)', url: 'https://github.com/expressjs/express/blob/4.x/History.md' },
  uuidChangelog: { label: 'uuid changelog (breaking changes by major version)', url: 'https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md' },
  ghCodeowners: { label: 'GitHub Docs: About code owners', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners' },
  ghProtected: { label: 'GitHub Docs: About protected branches', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
  dependabot: { label: 'GitHub Docs: About Dependabot version updates', url: 'https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates' },
  strangler: { label: 'Martin Fowler: Strangler Fig Application', url: 'https://martinfowler.com/bliki/StranglerFigApplication.html' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'improve-existing-ai-01',
    day: 1,
    title: 'Understand an unfamiliar project with AI',
    summary: 'Open a project you did not write, ask AI for a map, and check every claim it makes against the real code.',
    minutes: 24,
    skills: ['read-unfamiliar-code'],
    intro: {
      objectives: [
        'Get a first picture of an unfamiliar project from its files, its package list and its entry point',
        'Ask an AI tool for a read-only overview that names the file behind every claim',
        'Check an AI overview against the code before you rely on any of it',
      ],
      why: 'Most paid software work is on a project that already exists: a client’s app, a teammate’s repo, or something you built with AI months ago. The people who get trusted with it are the ones who can learn a codebase fast without believing everything an assistant says about it.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Most software work is not starting something new. It is opening a project that already exists and being expected to change it without breaking it. This course is about that job, and it uses one practice project all the way through. **Tindahan Orders** is a small order and credit tracker for a neighbourhood store. A developer named Jun wrote it in 2021 and left it on a USB drive for you. It works. It has no README, no tests, and about 700 lines of code you have never seen. A **codebase** is simply all the files that make up a program; an **existing codebase** is one that somebody else started. Every output in these lessons comes from really running this project, and your first job is to find out what you are holding.',
      },
      { type: 'heading', text: 'The first five minutes: look before you ask' },
      {
        type: 'paragraph',
        text: 'Before you show anything to an AI, spend five minutes looking yourself. Two things matter most: the **package list** (what the project is built on and how it starts) and the **size** of each file (where the real code is). Here is what Jun’s drive contains.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the folder, then the size of each file',
        code: `$ ls
data.json  db.js  package-lock.json  package.json  public  seed.js  server.js

$ wc -l server.js db.js seed.js public/index.html
     281 server.js
     140 db.js
      69 seed.js
     221 public/index.html
     711 total

$ cat package.json
{
  "name": "tindahan-orders",
  "version": "1.0.0",
  "description": "Order and utang tracker for a neighbourhood store",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "seed": "node seed.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "morgan": "^1.10.0",
    "uuid": "^8.3.2"
  }
}`,
      },
      {
        type: 'paragraph',
        text: 'That already says a lot. `npm start` runs `server.js`, so that is the **entry point**: the file where the program begins. It uses Express (a library for building web servers), morgan (request logging) and uuid (making unique ids). There is a `data.json` file next to the code, so the data is probably kept in a plain file rather than a database server. And there is a `public` folder, which Express serves to the browser. Nothing here needed an AI. Notice what you have now: a guess you can test, not a mystery.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The shape of Tindahan Orders as received, worked out from package.json and the file names. You will confirm each arrow by reading code, not by trusting this picture.',
        source: `flowchart LR
  B[Browser page: public/index.html] -->|fetch /api/...| S[server.js: routes]
  S -->|calls functions| D[db.js: storage layer]
  D -->|reads and writes| F[(data.json)]
  SEED[seed.js] -->|fills with sample data| F`,
      },
      { type: 'heading', text: 'Ask AI for a map, not a rewrite' },
      {
        type: 'paragraph',
        text: 'Now an AI tool is genuinely useful: it can read 700 lines in seconds and write down what it found. The trap is the request. “Explain this project” invites a confident essay. A better request has three rules: it is **read-only** (the AI must not change files while you are still learning), it asks for **evidence** (a file and a line behind every claim), and it allows **“I am not sure”**. The first question to ask is always about the map, then about one flow, then about risk.',
      },
      {
        type: 'prompt',
        label: 'A read-only overview prompt (works in Claude Code, Cursor, Codex or Copilot)',
        text: 'Read this project but do not change any file. Give me: (1) what it is for, in one paragraph; (2) every file and its job in one line; (3) the entry point and how to start it; (4) where data is stored and how it is read and written; (5) the steps that happen when someone creates an order, naming the function and file for each step; (6) anything surprising or risky. For every claim, name the file and line it comes from. If you are not sure about something, say so instead of guessing.',
      },
      {
        type: 'paragraph',
        text: 'Here is an overview of the kind an assistant might write for Tindahan Orders. It is written for this course (it is not output from a real model), and it contains the sort of mistakes real overviews contain.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example AI overview (written for this course). Four of its claims are wrong.',
        code: `Tindahan Orders is a Node.js web app for a small store.
- server.js: Express routes for products, customers, orders and reports,
  including POST /api/orders/:id/cancel to cancel an order.
- db.js: storage layer. Products, customers and orders are saved in a
  SQLite database.
- public/index.html: the page the shop owner uses.
- seed.js: fills the database with sample data.
Customers sign in with a phone number and password to see their utang.
When an order is created, server.js checks that there is enough stock,
then saves it through db.js.`,
      },
      {
        type: 'paragraph',
        text: 'It reads smoothly, and that is exactly the danger. Smooth is not the same as true. You do not need to read all 700 lines to test it. You need three cheap moves: **search** for the thing (`grep` or your editor’s search), **open** the lines it points at and read them, and **run** the program and watch what it does. Try the first move on four of its claims.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: checking the overview by searching',
        code: `$ grep -rn -i "sqlite\\|jwt\\|cancel\\|password" --include="*.js" --include="*.html" --exclude-dir=node_modules .
(exit code 1)

$ grep -n "readFileSync\\|writeFileSync" db.js
12:    fs.writeFileSync(DB_FILE, JSON.stringify(empty, null, 2));
15:  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
19:  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

$ grep -n "stock" server.js
36:app.get('/api/products/low-stock-old', function (req, res) {
40:    return p.stock < 5;
56:    stock: b.stock || 0,
70:  if (req.body.stock != undefined) p.stock = req.body.stock;
138:    // take it out of stock right away
139:    p.stock = p.stock - items[i].qty;`,
      },
      {
        type: 'paragraph',
        text: '`grep` exit code 1 means “no match”. Nowhere in the code do the words SQLite, JWT, cancel or password appear, so there is no cancel route, no SQLite and no sign-in: three claims were invented. And the data layer reads and writes a plain JSON file. The fourth claim is subtler. “Checks that there is enough stock” sounds reasonable, but the only lines about stock in the order code (138 and 139) subtract from it with no comparison at all. The project never checks. The AI described what a sensible shop app would do, not what this one does. That gap, between what an app should do and what it does, is where the bugs you will fix in this course live.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of inheriting a house. You would walk through every room before moving walls. An AI is a fast tour guide who has read the floor plan, but sometimes describes a room that is not there. “Read-only” means the guide may look but not touch anything. A *file* is one saved document of code; a *folder* holds files; the *entry point* is the front door, the first file that runs. The `grep` command searches all files for a word, like pressing Ctrl+F across the whole house at once. When it prints nothing and says “exit code 1”, that is its way of saying “I looked everywhere and found no such word”. So when the AI said “SQLite database” and `grep` found nothing, you learned the AI was wrong, without reading a single line of the project.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**At scale.** In a large repository the README is usually the least reliable document and the build graph the most reliable: start from the entry points, the manifests (`package.json`, `pom.xml`, `go.mod`), the CI configuration and the ownership file, then use history to find where change actually happens (`git log --stat` and a count of the most-touched files). Have the agent write its overview into a file on a throwaway branch so a teammate can review it like any other change, and send broad exploration to a subagent so the file reads stay out of your main context. Treat every statement as a hypothesis with a cheap test. A claim you will build on should be confirmed twice, by search and by running code, because models are most fluent exactly where they have inferred rather than read.',
      },
      {
        type: 'version',
        text: 'The tools document this exact habit. Claude Code’s common-workflows page suggests starting with “give me an overview of this codebase”, then narrowing to architecture, data models and “trace the login process from front-end to database”, and says a subagent can do the exploring so only the findings come back to your main conversation. Codex’s prompting guide shows asking it to explain a request flow and to “list the files involved” so you can check them. In Cursor, search over your project is done by Instant Grep, which the docs say builds and queries its index locally, supports full regex, and does not store embeddings of your code for search; the agent’s answers are therefore only as good as what it opened. GitHub Copilot’s ask mode is described as optimised for answering questions about your codebase, and Copilot’s best-practices page says to open relevant files and close irrelevant ones to give it context. Checked on this date; product names and modes change often.',
        checked: CHECKED,
        sources: [DOCS.ccWorkflows, DOCS.codexPrompting, DOCS.cursorIndex, DOCS.copilotChat, DOCS.copilotBest],
      },
      {
        type: 'takeaways',
        items: [
          'Look before you ask: package.json, file sizes and the entry point give you a testable first picture in five minutes.',
          'Ask for a read-only overview that names the file and line behind every claim and admits what it does not know.',
          'An AI overview is a set of hypotheses. Check the ones you will build on with three moves: search, open and read, run.',
          'No match for a word you were told exists means the claim was probably invented; a missing check (like stock) means the AI described what the app should do.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Choose your practice project now**, because the tasks, activities and the final project all need one. Use a project you already have (an app you built with AI earlier is perfect), or have an AI make a messy one with the prompt below. Do not read the code it writes: finding what is wrong with it is the exercise for the next eight lessons. Your project will differ from Tindahan Orders in its details; the habits are the same.',
      },
      {
        type: 'prompt',
        label: 'Make your own practice project (only if you do not have one)',
        text: 'Create a small Express (Node.js) app with a plain HTML page for a neighbourhood store: products with stock, customers who buy on credit (utang), orders with an optional discount, a daily sales report and a plain-text receipt. Keep everything in one JSON file that a separate db.js reads and writes. Write it the way a busy developer might have in 2021: var and callbacks, all routes in one server.js of about 300 lines, no tests, no README, one dependency pinned to an old version. Include these realistic flaws and do not mention them in your answer or in comments: an order that fails halfway leaves stock already reduced; stock can go negative; quantity and discount are not validated; totals show float errors like 25.049999999999997; orders are grouped into days using the UTC date; the receipt crashes if a product was deleted; product search is case sensitive; every order line in the report re-reads the data file.',
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-01-scenario-1',
          kind: 'scenario',
          title: 'The AI says the data lives in SQLite',
          prompt: 'Choose what you do next.',
          concept: 'verify AI claims',
          situation: 'Your AI overview says “orders are saved in a SQLite database”. You have not seen a database file in the folder, and you are about to plan a backup routine around that sentence.',
          options: [
            { text: 'Search the project for the word, then open db.js and read what it actually reads and writes.', consequence: 'The search finds nothing and db.js reads and writes data.json. Your backup plan is built on the truth: copy one file.', quality: 'best' },
            { text: 'Believe it: the AI read the whole project, so write the SQLite backup plan tonight.', consequence: 'You plan around a database that does not exist, and the real data file has no backup at all.', quality: 'poor' },
            { text: 'Ask the AI to quote the exact file and line that proves it.', consequence: 'Better than nothing, because a bad quote is easy to catch, but a quote is still the AI’s claim. You must open the file yourself to know.', quality: 'acceptable' },
            { text: 'Delete data.json, since the real data must be somewhere else.', consequence: 'You just deleted the store’s only data on the strength of an unchecked sentence.', quality: 'poor' },
          ],
          hints: [
            'Which option checks the claim against the code instead of against another sentence?',
            'You have two cheap checks: a search and opening one file.',
            'The best option uses search and reading, not belief or a second question to the same AI.',
          ],
          explanation: 'Every AI claim you will rely on needs a quick check against the code. A search plus opening db.js takes a minute and settles it. Asking for a quote helps a little, but only the file itself is evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-01-match-1',
          kind: 'match',
          title: 'Match each claim to its fastest check',
          prompt: 'Each statement is something an AI overview might say about Tindahan Orders. Pair it with the quickest honest way to check it.',
          concept: 'verify AI claims',
          labels: { terms: 'What the AI claimed', meanings: 'The fastest honest check' },
          pairs: [
            { term: '“Customers sign in with a password”', definition: 'Search every file for the words password and login; no match means it was invented', note: 'The words would appear in the code if sign-in existed, so a search settles it.' },
            { term: '“db.js saves everything to a file”', definition: 'Open db.js and read the functions that load and save', note: 'This one is about what one specific file does, so reading that file is the check.' },
            { term: '“The app is made of four files”', definition: 'List the folder and count, ignoring node_modules', note: 'A count of files is a fact about the folder, so list the folder.' },
            { term: '“Creating an order reduces stock”', definition: 'Run the app, note a product’s stock, create an order, and look again', note: 'This is behaviour, so the strongest check is to watch it happen.' },
          ],
          hints: [
            'Decide for each claim whether it is about words in the code, one file, the folder, or behaviour.',
            'Words in the code: search. One file: open it. The folder: list it. Behaviour: run it.',
            'The password claim is a search, the db.js claim is reading, the four-files claim is counting, the stock claim is running.',
          ],
          explanation: 'Search, open and read, list, and run are four cheap checks. Choosing the one that fits the kind of claim is most of the skill of not being fooled by a confident summary.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-01-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Four words for inherited projects',
          prompt: 'Tap each card after you have said what the word means in your own words.',
          concept: 'codebase vocabulary',
          cards: [
            { front: 'Codebase', back: 'All the files that make up a program. An existing codebase is one somebody else started.' },
            { front: 'Entry point', back: 'The first file that runs when the program starts. For Tindahan Orders it is server.js, because npm start runs it.' },
            { front: 'Dependency', back: 'Code written by other people that your project borrows, like Express. The package.json file lists them.' },
            { front: 'Read-only request', back: 'Asking the AI to look and explain but not to change any file, so you can learn safely first.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words are enough to follow the rest of the course.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-01-q1',
        prompt: 'You ask an AI tool for an overview of a project you have just inherited. How should you treat what it says?',
        choices: [
          'As accurate, because the model read every file in the project in a few seconds and cannot make mistakes about code it has read',
          'As a list of hypotheses; check the claims you will rely on by searching, reading the code and running it',
          'As unreliable, so ignore it and read all the code yourself line by line instead',
          'As accurate if it sounds confident and names specific files in its answer',
        ],
        answer: 1,
        explanation: 'An overview is fast and often right, which is why it is worth having, but it can describe what a project should do instead of what it does. Cheap checks on the important claims give you the speed without the risk.',
      },
      {
        id: 'improve-existing-ai-01-q2',
        prompt: 'Why should the first prompt about an unfamiliar project say “do not change any file”?',
        choices: [
          'Because AI tools cannot edit files until you give them permission each time, and the permission prompt is what teaches you the project',
          'Because it makes the answer shorter and cheaper to produce',
          'Because Git cannot track changes made while you are asking questions',
          'Because you do not yet understand the project, so any change it makes is one you cannot judge',
        ],
        answer: 3,
        explanation: 'Until you have a map you cannot tell a safe edit from a harmful one. Read-only first keeps the starting point clean, and every change comes later with a plan and a diff you can read.',
      },
      {
        id: 'improve-existing-ai-01-q3',
        prompt: 'An AI says “the app checks stock before accepting an order”. You search the order code and find only a line that subtracts the quantity. What does that tell you?',
        choices: [
          'The AI described what a sensible app would do, and the project has a missing check that will matter later',
          'The AI is right, because subtracting stock counts as checking it',
          'The search must have missed the real check, so run it again with different words',
          'Stock is checked inside the browser page instead, so the server does not need to, which is why the search finds nothing on the server',
        ],
        answer: 0,
        explanation: 'A subtraction with no comparison is not a check. When the code and the description disagree, the code wins, and the gap is a finding to write down.',
      },
      {
        id: 'improve-existing-ai-01-q4',
        prompt: 'package.json has "start": "node server.js" under scripts. What do you learn from that line?',
        choices: [
          'That the browser page is server.js',
          'That the project needs Node 22 or newer to run at all',
          'That server.js is where the program starts, so read it first',
          'That server.js has no dependencies of its own to install',
        ],
        answer: 2,
        explanation: 'The start script names the file that runs first. That is your entry point and the best first file to open.',
      },
      {
        id: 'improve-existing-ai-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is the “entry point” of a project?',
        choices: [
          'The folder where all the pictures and other media for the project are kept',
          'The password you need to open the project',
          'The first file that runs when the program starts, like the front door of a house',
        ],
        answer: 2,
        explanation: 'The entry point is where the program begins. Starting there and following what it calls is the easiest way into a project you did not write.',
      },
      {
        id: 'improve-existing-ai-01-q6',
        audience: { min: 'advanced' },
        prompt: 'You must understand a 400,000-line monorepo before an estimate is due on Friday. Which approach is best?',
        choices: [
          'Paste as much of the code as fits into one chat and ask it to explain the whole system',
          'Anchor on entry points, manifests, CI config and history, split exploration across subagents, and verify key claims by search and running tests',
          'Ask the original author for a walkthrough and skip the tooling, since nothing beats a conversation',
          'Run a code-intelligence tool and accept its dependency graph as the complete description of the system, then write the estimate straight from that graph',
        ],
        answer: 1,
        explanation: 'At this size no single pass fits in context. Anchor on things that cannot lie (entry points, build and CI config, history), split exploration so context stays clean, and verify what you will rely on. Tools help, but a graph is also only a hypothesis until tested.',
      },
    ],
    task: {
      title: 'Take your first look at your practice project',
      minutes: 15,
      steps: [
        'Pick your practice project (your own, or generate one with the prompt in this lesson) and put it in a folder you can open in a terminal.',
        'Do the five-minute look yourself: run ls, count lines with wc -l for each source file, and read package.json. Write three sentences saying what it is built on, where it starts and where its data probably lives.',
        'Send an AI tool the read-only overview prompt. Pick four claims from its answer and check each with a search, by opening the file, or by running the app.',
        'Write down every claim that was wrong or unsupported, with the check that showed it. Keep this note: you will use it in the next lesson.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['After the overview, ask the AI: “Explain server.js to me line by line, as if I have never coded.” Then find one line it explained and confirm for yourself that it does what it said.'] },
      { audience: { min: 'advanced' }, steps: ['Run `git log --name-only --pretty=format: | sort | uniq -c | sort -rn | head` on a real repository you work with (any repository with some history). Compare its hot files with what the AI overview treated as important, and note the difference.'] },
    ],
  },
  {
    id: 'improve-existing-ai-02',
    day: 2,
    title: 'Map it before you change anything',
    summary: 'Trace one real action through the code, find what touches what, and write the map down for you and your AI to share.',
    minutes: 26,
    skills: ['map-before-change'],
    intro: {
      objectives: [
        'Follow one action from the browser to the data file and back, and draw it',
        'Find everything that touches a piece of data before you change how it works',
        'Write a short map and an instructions file that you and your AI tool both read',
      ],
      why: 'Changing code you do not understand is how a one-line fix breaks the report nobody opened. A map costs an hour and tells you, before you start, which other parts of the app your change can reach.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Before you move a wall in a house you need to know which pipes and wires run inside it. Code has the same hidden connections. A change to how stock is saved might also change the report, the receipt and the web page, and nothing on your screen warns you. The cure is a **map**: a short document, kept in the project, that records how to run the app, which file does what, what happens during each important action, where the data lives and which spots look fragile. You and your AI tool both read it, so every session starts from the same facts instead of rediscovering them. Lesson 1 gave you a first look; now you make it precise.',
      },
      { type: 'heading', text: 'The five parts of a useful map' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Run it.** The exact commands to start the app, reset its data and check it still works.',
          '**Files and jobs.** One line per file saying what it is responsible for.',
          '**Flows.** For each important action (creating an order, running a report), the steps in order, naming the function and file for each.',
          '**State.** Where data is kept and which code reads or writes it. State is where most surprises hide.',
          '**Hazards.** Anything that looks fragile or wrong. At this stage these are suspects, not facts: you write them down and reproduce them later.',
        ],
      },
      { type: 'heading', text: 'Follow one action all the way through' },
      {
        type: 'paragraph',
        text: 'The best way to learn a flow is to trace one real action. Creating an order is the heart of Tindahan Orders, so read the order route in `server.js` and note each call to `db.js`. Here is what happens, as the code was received.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Creating an order in Tindahan Orders as received. Every db.js call reads the whole data file; updateProduct also writes it.',
        source: `sequenceDiagram
  participant Page as Browser page
  participant Srv as server.js
  participant DB as db.js
  participant File as data.json
  Page->>Srv: POST /api/orders with items
  Srv->>DB: getProduct(id) for each item
  DB->>File: read the whole file
  Srv->>DB: updateProduct(p) takes stock out right away
  DB->>File: write the whole file
  Srv->>DB: getCustomer(id) if a customer was chosen
  Srv->>DB: addOrder(order)
  DB->>File: write the whole file
  Srv-->>Page: 201 and the saved order`,
      },
      {
        type: 'paragraph',
        text: 'Read the diagram once more and look at the order of events. Stock is written to the file for each item **before** the later items and the customer have been checked. If anything fails after that, the stock has already changed. Do not assume: run it. The request below orders 2 Asin and one product that does not exist.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: an order that fails halfway (Asin stock was 40 before)',
        code: `$ curl -s -X POST localhost:3100/api/orders -H 'content-type: application/json' \\
    -d '{"items":[{"productId":"p-asin","qty":2},{"productId":"p-nope","qty":1}]}'
{"error":"product not found: p-nope"}

stock of Asin before: 40
stock of Asin after:  38`,
      },
      {
        type: 'paragraph',
        text: 'The order was refused, yet two Asin disappeared from stock. The map just earned its keep: you found a real bug by reading a diagram, and you have not changed a line. Write it in the Hazards section and move on; lesson 5 fixes it.',
      },
      { type: 'heading', text: 'Blast radius: search for what you plan to change' },
      {
        type: 'paragraph',
        text: 'The **blast radius** of a change is everything it could affect. You estimate it by searching for the thing you will touch. Suppose you want to change how stock is stored. `git grep` searches every file Git tracks and prints the file and line number of each match.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: who touches products and stock in the code as received',
        code: `$ git grep -n "updateProduct\\|deleteProduct" -- "*.js"
db.js:48:function updateProduct(p) {
db.js:60:function deleteProduct(id) {
db.js:130:  updateProduct: updateProduct,
db.js:131:  deleteProduct: deleteProduct,
server.js:72:  db.updateProduct(p);
server.js:77:  var ok = db.deleteProduct(req.params.id);
server.js:140:    db.updateProduct(p);

$ git grep -n "stock" -- public/index.html
public/index.html:52:    <input id="newStock" placeholder="stock" type="number" style="width:80px">
public/index.html:105:      var cls = p.stock < 5 ? 'low' : '';
public/index.html:107:        '</td><td class="money ' + cls + '">' + p.stock + '</td><td><button onclick="rem
public/index.html:119:    stock: document.getElementById('newStock').value,`,
      },
      {
        type: 'paragraph',
        text: 'Two answers fall out in seconds. `updateProduct` is called from exactly two places (the product edit route at line 72 and the order route at line 140), so those are the only places where saved stock can change. And the web page also reads and shows stock, so a change to the shape of a product can break the page without any server error. That is a blast radius of four spots you can list, instead of a feeling that “it might break something”.',
      },
      { type: 'heading', text: 'Write it down: the map and the instructions file' },
      {
        type: 'paragraph',
        text: 'Put what you learned in two small files at the project root. `MAP.md` is for people; an **instructions file** is the same knowledge trimmed to what an AI tool must always know. Keep both short enough to read in two minutes. Here is the real MAP.md for Tindahan Orders after this lesson.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'MAP.md (abridged from the real one)',
        code: `# Tindahan Orders: map

## Run it
npm install, then npm start (port 3000, or set PORT). npm run seed rebuilds data.json with sample data.

## Files
- server.js (281 lines): all 16 routes, products, customers, orders, reports
- db.js (140): storage; every function reads the whole data.json, most also write it
- public/index.html (221): the one page; plain JavaScript, calls /api/*
- seed.js (69): sample data; data.json is tracked in git

## State
data.json = { products, customers, orders }. Money is a plain number of pesos.
Writers of stock: PUT /api/products/:id (server.js:72) and POST /api/orders (server.js:140).

## Flow: create an order
page -> POST /api/orders -> for each item: getProduct, take stock out, save
-> getCustomer -> addOrder -> 201

## Hazards (suspects: reproduce before fixing)
1. Stock is saved per line before the rest of the order is checked
2. No check that stock is enough, or that qty and discount make sense
3. Totals are floats (25.049999999999997)
4. Days come from createdAt.slice(0, 10): UTC, but the shop is UTC+8
   (server.js:108, 225 and index.html:214)
5. Receipt reads names from live products: crashes if a product was deleted
6. Product search is case sensitive
7. Daily report re-reads data.json for every order line
8. index.html puts product names into innerHTML unescaped
9. No tests; the data path is hard-coded`,
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'CLAUDE.md or AGENTS.md at the project root (the AI’s short version)',
        code: `# Tindahan Orders
Express server plus one HTML page. Data is one file, data.json, read and written whole by db.js.

- Start: npm start. Reset sample data: npm run seed (this overwrites data.json).
- There are no tests yet. After any change, run the app, try the affected route, and say what you ran.
- Work on a branch, one change per commit, and show me the diff before you commit.
- Match the surrounding style (var, function). Do not reformat files or rename things unless asked.
- Never edit data.json by hand. Read MAP.md before touching orders, stock or dates.`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *route* is an address that the server answers, like a counter in a shop with a sign over it: `POST /api/orders` is the counter where someone says “I am placing an order”. A *request* is what the page sends to a counter and a *response* is what comes back. The *data flow* is the path one piece of information takes, here from the page, through the server, into the file and back. The `git grep` output above reads like this: `server.js:72:` means “file server.js, line 72”, followed by the text of that line. So `db.updateProduct(p);` on line 72 is one place that changes a product. A map is like the floor plan you would want before knocking down a wall, and the instructions file is the sticky note you leave for any helper who walks in.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**What to look for as you read.** You have built small projects, so you know how pieces fit when you chose them. Reading someone else’s code the useful question is: where are the **seams**, the places where one part hands data to another through a narrow doorway? In Tindahan Orders the seam is `db.js`: server.js talks to storage only through twelve functions. A seam is where you can safely add a test or swap the insides later, and finding them is the main thing a map is for.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For large systems.** A map that stays accurate in a big repository is layered and owned. Keep a short root file for rules that apply everywhere and put area-specific notes next to the code they describe, so a session started in one package loads only that package’s conventions. Combine static structure (module graph, CODEOWNERS for who to ask) with dynamic evidence (git churn multiplied by complexity finds the files that are both big and constantly edited). Record seams explicitly, because they are where incremental migration works: route new behaviour through a thin wrapper and move callers across one at a time, the pattern often called a strangler fig. Review changes to the map and instructions in pull requests like documentation, and delete rules a newer model no longer needs.',
      },
      {
        type: 'version',
        text: 'Each tool reads a project instructions file, under a different name. Claude Code reads CLAUDE.md (and can use a repository’s AGENTS.md); its best-practices page says /init generates a starting version from your codebase and recommends keeping it short, and its large-codebase guide describes a root file plus per-directory files that load on demand. Codex reads AGENTS.md, merging files from the project root down to the current directory (closer files override), with a default combined limit of 32 KiB. GitHub Copilot reads .github/copilot-instructions.md, path-specific .instructions.md files, and AGENTS.md files. Cursor reads project rules in .cursor/rules (.mdc files with frontmatter) and also supports AGENTS.md. Checked on this date; file names and limits change.',
        checked: CHECKED,
        sources: [DOCS.ccMemory, DOCS.ccBest, DOCS.ccLarge, DOCS.codexAgentsMd, DOCS.copilotInstructions, DOCS.cursorRules],
      },
      {
        type: 'version',
        text: 'git grep searches the files Git tracks, so it skips node_modules and anything ignored, which is why it is a good first search in a repository; git log with the -S option finds the commits that added or removed a given string. Checked against the Git documentation on this date (Git 2.54 was used for the output above).',
        checked: CHECKED,
        sources: [DOCS.gitLog],
      },
      {
        type: 'takeaways',
        items: [
          'A map records how to run the app, the files and their jobs, the important flows, where state lives and the hazards you suspect.',
          'Trace one real action end to end and run it; reading the flow found a real bug (stock saved before the order was validated) without changing a line.',
          'Estimate the blast radius of a change by searching for what you will touch and listing every place that reads or writes it.',
          'Keep MAP.md for people and a shorter instructions file (CLAUDE.md, AGENTS.md or similar) for the AI, small enough to read in two minutes.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-02-code-challenge-1',
          kind: 'code-challenge',
          title: 'Build a tiny grep',
          prompt: 'Write grepLines(files, word). files is an object whose keys are file names and whose values are the text of each file. Return an array of "name:line" strings, one for every line that contains the word, in file order and then line order. Line numbers start at 1, like git grep.',
          concept: 'finding blast radius',
          language: 'javascript',
          starter: `function grepLines(files, word) {
  // go through each file name, split its text into lines,
  // and collect name:lineNumber for every line that contains the word
  return [];
}`,
          solution: `function grepLines(files, word) {
  var hits = [];
  var names = Object.keys(files);
  for (var i = 0; i < names.length; i++) {
    var lines = files[names[i]].split('\\n');
    for (var j = 0; j < lines.length; j++) {
      if (lines[j].indexOf(word) !== -1) {
        hits.push(names[i] + ':' + (j + 1));
      }
    }
  }
  return hits;
}`,
          tests: {
            kind: 'function',
            fn: 'grepLines',
            cases: [
              { label: 'finds each call and the definition', args: [{ 'db.js': 'function a() {}\nfunction updateProduct(p) {}', 'server.js': 'db.updateProduct(p);\nres.json(p);\ndb.updateProduct(q);' }, 'updateProduct'], expected: ['db.js:2', 'server.js:1', 'server.js:3'] },
              { label: 'no match gives an empty list', args: [{ 'server.js': 'res.json(p);' }, 'stock'], expected: [] },
              { label: 'line numbers start at 1', args: [{ 'a.js': 'stock\nx\nstock' }, 'stock'], expected: ['a.js:1', 'a.js:3'] },
              { label: 'one file with several lines', args: [{ 'index.html': '<td>stock</td>\n<td>price</td>\n<td>stock left</td>\n<td>name</td>' }, 'stock'], expected: ['index.html:1', 'index.html:3'] },
            ],
          },
          hints: [
            'Object.keys(files) gives you the file names; split the text on the newline character to get its lines.',
            'Use two loops, one over the files and one over the lines of the current file. indexOf returns -1 when the word is not in the line.',
            'Push names[i] + ":" + (j + 1) for each matching line, because line numbers start at 1 but array positions start at 0.',
          ],
          explanation: 'This is what git grep -n does: for each file, for each line, report the places the word appears. Every blast-radius estimate is this loop, run over your project.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-02-scenario-1',
          kind: 'scenario',
          title: 'Change how stock is saved',
          prompt: 'Choose your first move.',
          concept: 'blast radius',
          situation: 'The client asks you to make stock changes also record who made them. You are about to ask your AI tool to “add a changedBy field to stock updates”. The project has no tests.',
          options: [
            { text: 'Search for every place that reads or writes stock first, list them, then ask the AI to change them as one planned change.', consequence: 'You find two writers on the server and a page that reads stock. The change covers all three and nothing is surprised later.', quality: 'best' },
            { text: 'Ask the AI to make the change and run the app once to see that nothing crashes.', consequence: 'It saves a field in one place and misses the other writer. Nothing crashes, so you ship, and half of your stock history has no author.', quality: 'poor' },
            { text: 'Ask the AI to find all the places and make the change in one go, then read the diff yourself.', consequence: 'This can work, and reading the diff is good. But you have no list of your own to compare the diff against, so a missed place looks identical to a complete change.', quality: 'acceptable' },
            { text: 'Rewrite db.js from scratch so stock handling is clean, then reconnect the server.', consequence: 'You replaced everything to change one field, and every hazard you did not know about is now a surprise in new code.', quality: 'poor' },
          ],
          hints: [
            'What can you do in a minute that tells you how far the change reaches?',
            'A search lists every place stock is read or written.',
            'The best option builds your own list before the AI changes anything, so you can check its work against it.',
          ],
          explanation: 'List the touchpoints before the change, then judge the diff against your list. A change you cannot compare with a list of affected places is a change you cannot review.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-02-match-1',
          kind: 'match',
          title: 'Which part of the map answers it?',
          prompt: 'Pair each question you might have about Tindahan Orders with the part of the map that should answer it.',
          concept: 'parts of a map',
          labels: { terms: 'The question', meanings: 'Where the map answers it' },
          pairs: [
            { term: 'A teammate asks how to start the app on her laptop', definition: 'Run it', note: 'Commands to start, reset and check belong in the first section.' },
            { term: 'Which file would I open to change the discount rule?', definition: 'Files and jobs', note: 'A one-line job per file is for exactly this question.' },
            { term: 'What happens between pressing Save order and the page showing the receipt?', definition: 'Flows', note: 'A step-by-step trace of one action is a flow.' },
            { term: 'Could a bug in the receipt come from how the data file is saved?', definition: 'State', note: 'Where data lives and who writes it is the state section.' },
            { term: 'I noticed a line that re-reads the data file for every order line', definition: 'Hazards', note: 'Anything that looks fragile is written down as a hazard until it is reproduced.' },
          ],
          hints: [
            'Decide whether each question is about starting, finding a file, a sequence of steps, data, or something suspicious.',
            'Steps in order are a flow. Where data is kept is state. Something that looks wrong is a hazard.',
            'Starting the app is Run it, picking a file is Files and jobs, the order sequence is Flows, the data file is State, the suspicious line is Hazards.',
          ],
          explanation: 'Each section of a map exists to answer one kind of question. When a question has no home in your map, that is a sign the map is missing a section.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-02-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words for reading a project',
          prompt: 'Tap each card after saying the meaning in your own words.',
          concept: 'map vocabulary',
          cards: [
            { front: 'Route', back: 'An address the server answers, such as POST /api/orders. Think of it as a counter with a sign over it.' },
            { front: 'Request and response', back: 'The request is what the page sends to a route. The response is what the server sends back.' },
            { front: 'Data flow', back: 'The path one piece of information takes through the program: page, server, storage and back.' },
            { front: 'Blast radius', back: 'Everything a change could affect. You estimate it by searching for what you are about to change.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words are how you will describe what you find in any project.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-02-q1',
        prompt: 'What is the main reason to write a map before you start changing a project?',
        choices: [
          'It lets the AI skip reading the code, which saves tokens',
          'It is required by Git before you can create a branch',
          'It shows what else a change could reach, before the change surprises you',
          'It proves to the client that you worked on the project',
        ],
        answer: 2,
        explanation: 'The value of a map is knowing the connections in advance. Without it, the only way to find what a change affected is for something to break.',
      },
      {
        id: 'improve-existing-ai-02-q2',
        prompt: 'In the order flow as received, why did a request with an unknown second product still reduce stock for the first one?',
        choices: [
          'Stock is saved for each item inside the loop, before the remaining items and the customer are checked',
          'The database server rolled back only half of the transaction when the error happened',
          'The page sends the stock change separately from the order request, and the server applies that change first before it reads the order',
          'The response was cached, so the failed order was replayed on the next request',
        ],
        answer: 0,
        explanation: 'The sequence shows updateProduct being called per item, ahead of the other checks. There is no transaction and no database server here: just a file written inside a loop.',
      },
      {
        id: 'improve-existing-ai-02-q3',
        prompt: 'git grep finds updateProduct called in two places in server.js. What does that tell you?',
        choices: [
          'That updateProduct can be deleted from db.js safely',
          'That those are the only two places saved stock can change, so they bound the effect of changing updateProduct',
          'That the project has two copies of the stock data to keep in step',
          'That there is a bug, because a function should only ever be used once and calling it from two places duplicates its work',
        ],
        answer: 1,
        explanation: 'A short list of callers is a blast radius you can review. Fewer callers mean fewer places to check; it does not mean the function is unused or wrong.',
      },
      {
        id: 'improve-existing-ai-02-q4',
        prompt: 'Which of these belongs in a short instructions file for an AI tool?',
        choices: [
          'A copy of every source file so the AI never has to open anything',
          'The password for the production server, so the AI can test against it',
          'A line-by-line description of each function, kept up to date by hand every time someone changes the code, in the same file',
          'How to run and check the app, rules like “one change per commit”, and the hazards to read first',
        ],
        answer: 3,
        explanation: 'The file is for what the AI cannot see by reading code: commands, working rules and the risky spots. It should be short enough to read in two minutes, and it never holds secrets.',
      },
      {
        id: 'improve-existing-ai-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “server.js:72:” at the start of a grep line mean?',
        choices: [
          'The 72nd person who visited the server',
          'File server.js, line 72',
          'Version 72 of the project',
        ],
        answer: 1,
        explanation: 'grep prints the file name, the line number and then the text of the line, so you can jump straight to it.',
      },
      {
        id: 'improve-existing-ai-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Your monorepo has twelve packages and your agent sessions load too many conventions that do not apply. What is the best fix?',
        choices: [
          'Put every convention in one long root file so nothing is ever missing',
          'Delete the instructions files and rely on the model to infer every convention from the code it happens to read, however large the monorepo',
          'Keep a short root file for shared rules and put package rules beside each package, so a session loads only the area it works in',
          'Ask each developer to paste their own conventions into the chat at the start of each session',
        ],
        answer: 2,
        explanation: 'Layering keeps context small and relevant, keeps each team’s rules next to the code it owns, and lets the files be reviewed in pull requests. One giant file spends context on rules that do not apply.',
      },
    ],
    task: {
      title: 'Map your practice project',
      minutes: 20,
      steps: [
        'Pick the most important action in your project (creating an order, a booking, a sign-up). Read its route and write the steps in order, naming each function and file. Draw them as a sequence if you like.',
        'Run that action once with a request that should fail halfway. Look at your data afterwards: did anything change that should not have?',
        'Use git grep (or your editor’s search) to list every place that reads or writes the main piece of data in your project.',
        'Write MAP.md with the five parts (Run it, Files, State, a Flow, Hazards) and a short CLAUDE.md or AGENTS.md. Keep each under a page.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask your AI: “Read MAP.md and explain each hazard in plain words, with an example of what a shop owner would notice.” Check that each explanation matches what you saw when you ran the action.'] },
      { audience: { min: 'advanced' }, steps: ['Add one churn view to your map: list the five most-edited files in your real repository from git history, mark the ones that also have the most dependants, and note who owns them. Decide where a nested instructions file would go.'] },
    ],
  },
  {
    id: 'improve-existing-ai-03',
    day: 3,
    title: 'A safe workflow for every change',
    summary: 'Branch, change one thing, run a check, read the diff, commit: the loop that keeps AI edits from quietly breaking a project.',
    minutes: 26,
    skills: ['safe-change-workflow'],
    intro: {
      objectives: [
        'Run the same six-step loop for every change, however small',
        'Read a diff and spot an edit that nobody asked for',
        'Explain what tool checkpoints cover and why Git is still your real safety net',
      ],
      why: 'AI edits files faster than you can watch. A project with no tests has no alarm, so your habits are the alarm: a branch to throw away, a check you can run in seconds and a diff you actually read.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'An AI assistant can change ten files in the time it takes you to read one, and it will tell you it did a good job. In a project with no tests, nothing else will tell you otherwise. So the safety has to live in your routine. The routine is the same for a one-word fix and for a new feature, which is exactly why it works: you never have to decide whether a change is “small enough to skip it”. A **branch** is a separate line of work in Git, like a draft copy of a document that you can throw away without touching the original. A **commit** is a saved snapshot with a message. A **diff** is the list of exactly which lines changed between two versions. The loop below uses all three.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The safe change loop. If the diff shows anything you did not ask for, go back to the change, not forward to the commit.',
        source: `flowchart LR
  A[1 Branch] --> B[2 One small change]
  B --> C[3 Run the checks]
  C --> D[4 Read the diff]
  D -->|something unexpected| B
  D -->|only what you asked| E[5 Commit]
  E --> F[6 Merge, or throw the branch away]`,
      },
      { type: 'heading', text: 'Step 3 needs a check that exists' },
      {
        type: 'paragraph',
        text: 'Tindahan Orders has no tests yet, so before the first change we add the cheapest useful safety net: a **smoke check**. A smoke check does not prove the app is right. It proves the app still starts and answers, the way you would switch on a repaired appliance and see whether smoke comes out. This one starts the server on a spare port, asks it seven questions that only read data (products, a search, a report for a day in the sample data, the credit list) and compares each answer with what the unchanged app gives. It never writes, because the data file is not isolated from the real one yet.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the smoke check on the unchanged app',
        code: `$ npm run smoke
ok   /health
ok   /api/products
ok   /api/products?q=Kape
ok   /api/orders?date=2026-10-18
ok   /api/report/daily?date=2026-10-18
ok   /api/report/utang
ok   /api/report/top-products
smoke: 7/7 passed`,
      },
      { type: 'heading', text: 'The loop on a real change: search that ignores case' },
      {
        type: 'paragraph',
        text: 'The change: searching for “kape” finds nothing, because the product is named “Kape 3-in-1” and the search is case sensitive. You start on a branch so main stays clean.',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Step 1: a branch for one change',
        code: `git switch -c fix/search-ignores-case`,
      },
      {
        type: 'paragraph',
        text: 'Now you ask your AI tool for the change, and you ask for **one thing and nothing else**. Here is a diff of the kind an agent might return (written by hand for this course, then run for real). It does what you asked, and one more thing.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example agent diff (written for this course): git diff',
        code: `@@ -22,12 +22,10 @@ app.get('/api/products', function (req, res) {
   if (q) {
-    var out = [];
-    for (var i = 0; i < products.length; i++) {
-      if (products[i].name.indexOf(q) != -1) {
-        out.push(products[i]);
-      }
-    }
+    var needle = q.trim().toLowerCase();
+    var out = products.filter(function (p) {
+      return p.name.toLowerCase().indexOf(needle) !== -1;
+    });
     return res.json(out);
@@ -47,7 +45,7 @@ app.post('/api/products', function (req, res) {
-  if (!b.price) {
+  if (b.price === undefined) {
     return res.status(400).json({ error: 'price is required' });`,
      },
      {
        type: 'paragraph',
        text: 'The first hunk is the change you wanted (and a rewrite you did not ask for). The second is a “tidy-up” in a different route. It looks harmless. This is why step 4 exists, and why the checks in step 3 are not enough on their own: the smoke check passes with this diff, because it only reads data. Run the two behaviours the diff touches against the changed code and compare with the original.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the example diff applied, then the same requests on the original code',
        code: `# with the example diff applied
$ curl -s "localhost:3100/api/products?q=kape"
[{"id":"p-kape","name":"Kape 3-in-1","price":8.35,"stock":120, ...}]
$ curl "localhost:3100/api/products?q=a&q=b"          ->  HTTP 500
$ curl -X POST .../api/products -d '{"name":"Mystery","price":""}'
{"name":"Mystery","price":"","stock":0,"category":"general","id":"c31e7b78-...", ...}

# on the original code
$ curl "localhost:3100/api/products?q=a&q=b"          ->  HTTP 200
$ curl -X POST .../api/products -d '{"name":"Mystery","price":""}'
{"error":"price is required"}                          ->  HTTP 400`,
      },
      {
        type: 'paragraph',
        text: 'Two real regressions from a diff that “worked”. A search written as `q.trim()` crashes when someone sends `q` twice (Express then gives you a list, not text). And the “tidy-up” lets a product with a **blank price** be saved, which is exactly what the web page sends when the price box is empty, so the shop could now sell a product for nothing. You would never have seen either by trying the feature once. You saw them because you read the diff and asked of every changed line: did I ask for this?',
      },
      {
        type: 'paragraph',
        text: 'Revert everything, then ask for the single change again, and keep it as small as the request. The clean version is one changed line, plus one line added to the smoke check so the new behaviour is guarded.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the clean change, the checks and the merge',
        code: `$ git diff --stat
 server.js | 2 +-
 smoke.js  | 1 +
 2 files changed, 2 insertions(+), 1 deletion(-)

$ npm run smoke | tail -1
smoke: 8/8 passed

$ git add -A && git commit -m "Product search ignores case and extra spaces"
$ git switch main && git merge --no-ff -m "Merge fix/search-ignores-case" fix/search-ignores-case
$ git log --oneline --graph
*   aee34b0 Merge fix/search-ignores-case
|\\
| * cb36d78 Product search ignores case and extra spaces
|/
* 461d355 Add a read-only smoke check (npm run smoke)
* a9db791 Imported from Jun's USB drive (as received)`,
      },
      {
        type: 'paragraph',
        text: 'If the check had failed, you would have seen it at step 3. Here is the smoke check catching a typo that Node itself accepted (the name `ouut` is valid syntax, just wrong): `node --check server.js` said nothing, and the check printed `FAIL` for both search URLs and `smoke: 6/8 passed`. A syntax check cannot find that. Running the app can.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine editing a school project that is due tomorrow. Before you change anything you make a copy of the file (the branch). You change one paragraph (one small change). You read it back to make sure the printer will still work (run the checks). You use “track changes” to see exactly what you altered (the diff), and only then save it as the new version (the commit). If you hate it, you delete the copy and the original is untouched. In the diff, a line starting with `-` was removed and a line starting with `+` was added. Reading the example above, the first group replaces a loop with one that lowercases both words, which is what you asked for. The second group changes how an empty price is treated, which you did **not** ask for. Spotting the lines that do not belong is the whole skill.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Keep the commit honest.** You already use Git for your own work. With AI in the loop add two habits: commit **before** you ask for a change so there is always a clean point to return to, and stage by hunk (`git add -p`) when an agent returned good and unwanted edits together, so the commit contains only what you reviewed. A commit message should say what changed for the user, in a way that you can find again with `git log` six months from now.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**In a team and a pipeline.** The loop scales by moving steps from habit to enforcement: branch protection requires a pull request and passing status checks before merge, CODEOWNERS routes review to whoever owns the touched paths, and CI runs the same checks you ran locally on a clean checkout. Keep AI-assisted changes as small and single-purpose as human ones, because review quality falls quickly with diff size, and expect reviewers to ask for the prompt or plan behind a large generated change. For several agents at once, give each its own branch and its own working directory with `git worktree`, so edits cannot collide and each diff stays separately reviewable and revertable. Prefer revert over forward-fix when a merged change misbehaves in production, then work out why on a branch.',
      },
      { type: 'heading', text: 'What checkpoints are for, and what they are not' },
      {
        type: 'paragraph',
        text: 'Your AI tool probably keeps its own undo history. That helps, but it is not Git. Claude Code snapshots the files its editing tools change before each prompt and lets you rewind code and conversation; Cursor creates checkpoints before agent changes you can restore. Both docs say these are for quick, session-level recovery, and that Git remains the permanent history. There are real gaps: Claude Code does not track a file that only a shell command changed, and neither tool undoes edits you made yourself outside the tool. Use checkpoints to undo the last experiment; use branches and commits for everything you want to keep or compare.',
      },
      {
        type: 'version',
        text: 'Claude Code: checkpointing tracks edits made by its file-editing tools, opens with /rewind (or pressing Esc twice on an empty prompt) and can restore code, conversation or both; the docs say it does not track files changed only by Bash commands or by outside edits and is not a replacement for version control. Cursor: Agent creates checkpoints before significant changes, restoring reverts files only, and the docs say to use them only for undoing Agent changes and to use Git for permanent history. Codex’s refactoring workflow advises committing or stashing current work first so you can compare changes cleanly. Checked on this date; tool behaviour changes often.',
        checked: CHECKED,
        sources: [DOCS.ccCheckpoint, DOCS.cursorCheckpoints, DOCS.codexPrompting],
      },
      {
        type: 'version',
        text: 'Git: git switch -c creates and moves to a new branch, git diff shows unstaged changes (and --stat gives a per-file summary), and git restore discards changes in the working tree. GitHub: protected branches can require pull requests and passing status checks before merge, and CODEOWNERS can require review from the owners of changed files. Git 2.54 was used for the output above; checked against the documentation on this date.',
        checked: CHECKED,
        sources: [DOCS.gitSwitch, DOCS.gitDiff, DOCS.gitRestore, DOCS.ghProtected, DOCS.ghCodeowners],
      },
      {
        type: 'takeaways',
        items: [
          'Every change follows one loop: branch, one small change, run the checks, read the diff, commit, merge or throw away.',
          'A smoke check proves the app still starts and answers; it does not prove a change is right, so it never replaces reading the diff.',
          'Ask of every changed line: did I ask for this? An unrequested “tidy-up” caused two real regressions in the example diff.',
          'Tool checkpoints are for undoing the last experiment; Git commits and branches are the real history.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-03-arrange-1',
          kind: 'arrange',
          title: 'Put the safe change loop in order',
          prompt: 'Arrange these six steps of the search-ignores-case change, first step at the top.',
          concept: 'safe change workflow',
          language: 'text',
          solution: [
            'git switch -c fix/search-ignores-case',
            'Ask the AI for one small change and nothing else',
            'npm run smoke',
            'git diff',
            'git add -A && git commit -m "Product search ignores case"',
            'git switch main && git merge fix/search-ignores-case',
          ],
          reasons: [
            'The branch comes first so main stays clean and you can throw the work away.',
            'The change is requested next, and kept to one thing so the diff stays small.',
            'The check runs on the changed code before you look at anything else.',
            'You read the diff to find edits nobody asked for, before saving them.',
            'Only now do you save a snapshot, with a message that says what changed.',
            'Merging comes last, once the branch has passed the check and your reading.',
          ],
          hints: [
            'What must exist before you can safely change anything?',
            'The commit saves the change, so the check and the diff come before it.',
            'Branch, change, smoke check, diff, commit, merge.',
          ],
          explanation: 'Branch, one small change, run the checks, read the diff, commit, merge. The order matters: the diff and the checks happen before the commit, so a bad change never becomes part of the history.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'Repair the “tidy-up”',
          prompt: 'The agent changed the price check in this validation function and a blank price from the web form now gets through. Tap the changed line, then choose the fix that restores the original behaviour. The web page sends a price as text, so "8.5" must still be accepted.',
          concept: 'reading a diff',
          language: 'javascript',
          code: `function validateProduct(b) {
  if (!b.name) {
    return 'name is required';
  }
  if (b.price === undefined) {
    return 'price is required';
  }
  return null;
}`,
          bugLine: 5,
          fixes: [
            { line: 'if (!b.price) {', correct: true, why: 'This is the original check. It rejects a missing price and the empty text "" a blank form box sends, and it accepts "8.5" and 5.' },
            { line: 'if (b.price == null) {', correct: false, why: 'The loose comparison to null only catches undefined and null. The empty text "" is neither, so a blank price is still accepted.' },
            { line: 'if (typeof b.price !== \'number\') {', correct: false, why: 'This rejects "8.5", which is what the web page really sends, so every product added from the page would fail.' },
            { line: 'if (b.price === undefined || b.price === null) {', correct: false, why: 'Still no check for the empty text "", so the blank-price bug stays.' },
          ],
          lineNote: 'That line is fine. Look for the line that decides what counts as a missing price.',
          tests: {
            kind: 'function',
            fn: 'validateProduct',
            cases: [
              { label: 'price missing', args: [{ name: 'Tinapay' }], expected: 'price is required' },
              { label: 'blank price from the form', args: [{ name: 'Tinapay', price: '' }], expected: 'price is required' },
              { label: 'price sent as text', args: [{ name: 'Tinapay', price: '8.5' }], expected: null },
              { label: 'price as a number', args: [{ name: 'Tinapay', price: 5 }], expected: null },
              { label: 'name missing', args: [{ price: 5 }], expected: 'name is required' },
            ],
          },
          hints: [
            'Which values should count as “no price”: undefined, and what else does a blank form box send?',
            'A blank text box sends the empty text "". Which condition is true for undefined and for ""?',
            'The condition that is true for every “empty” value is the plain negation: !b.price.',
          ],
          explanation: 'The original !b.price is true for undefined, null and the empty text, which is everything a blank form can send. The “more precise” check only caught undefined. A diff that looks like a harmless tidy-up can change behaviour, so every changed line needs a reason.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-03-scenario-1',
          kind: 'scenario',
          title: 'Is this change safe to merge?',
          prompt: 'Choose what you do.',
          concept: 'reviewing a diff',
          situation: 'You asked an agent to rename one confusing variable. Its diff touches 14 files, renames the variable in 3 of them, and also reformats the rest of each file. The smoke check passes. The agent says everything is fine.',
          options: [
            { text: 'Throw the change away and ask again for only the rename, with no reformatting.', consequence: 'The new diff has a few lines. You can read all of it in a minute and be sure that nothing else moved.', quality: 'best' },
            { text: 'Merge it: the smoke check passed and the agent confirmed it is fine.', consequence: 'The smoke check never exercised most of what changed, and nobody read 14 files of mixed edits. A real behaviour change could be buried in the noise.', quality: 'poor' },
            { text: 'Skim the diff for anything alarming and merge if nothing stands out.', consequence: 'Skimming a diff that is mostly formatting is how real changes get missed. It might pass, but you cannot say what you reviewed.', quality: 'acceptable' },
            { text: 'Merge it and fix whatever breaks later, since you can always revert.', consequence: 'You can revert, but you have given up the chance to catch the problem before it reaches the shop, and you will not know which of 14 files caused it.', quality: 'poor' },
          ],
          hints: [
            'How much of this diff can you honestly review?',
            'The goal of the change was one rename; the rest of the diff is noise that hides risk.',
            'Ask again for only what you wanted, so the diff is small enough to read completely.',
          ],
          explanation: 'A diff you cannot read completely is a diff you cannot trust. Making the request smaller is cheaper than reviewing a bigger change badly. Agents often reformat while they work; say “do not reformat” in your instructions file too.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-03-q1',
        prompt: 'Why read the diff before committing an AI’s change, when the checks already passed?',
        choices: [
          'Because the checks only cover part of the app, and the diff shows every edit, including ones you never asked for',
          'Because Git refuses to create a commit until the person has scrolled through the whole diff to the very end of the file',
          'Because the diff proves the AI used the newest syntax available for the language',
          'Because reading the diff makes the checks run faster the next time you use them',
        ],
        answer: 0,
        explanation: 'Checks can only catch what they test. The diff is the complete list of what changed, so it is the only place an unrequested edit is visible.',
      },
      {
        id: 'improve-existing-ai-03-q2',
        prompt: 'The example diff changed `!b.price` to `b.price === undefined`. What was the real effect?',
        choices: [
          'Prices of zero were rejected, which broke free samples in the shop',
          'The server crashed on startup because the new check was not valid in this version of Node',
          'A blank price from the web form, an empty string, was accepted and saved',
          'Nothing changed, because both checks mean the same thing for every possible value',
        ],
        answer: 2,
        explanation: 'The empty string is not undefined, so the new check lets it through, and a blank price box sends exactly that. The old check treated every empty value as missing.',
      },
      {
        id: 'improve-existing-ai-03-q3',
        prompt: 'The smoke check passed on the example diff that allowed blank prices. Why did it not catch the problem?',
        choices: [
          'Smoke checks are not able to detect any behaviour change at all',
          'The check was written for a different version of the app',
          'The server restarted between the requests, which cleared the problem before the check had a chance to see it',
          'It only reads data, so it never sent a blank price and could not see that behaviour change',
        ],
        answer: 3,
        explanation: 'A check only protects what it exercises. This one made seven read-only requests, so a change to how products are created was outside its view. That is why you add a check for each behaviour you fix.',
      },
      {
        id: 'improve-existing-ai-03-q4',
        prompt: 'Why keep using Git commits when your AI tool already has checkpoints and a rewind command?',
        choices: [
          'Checkpoints can only be used once per project and then they are deleted',
          'Checkpoints are session-level undo and miss some changes, while Git is permanent history you can branch, share and compare',
          'Git runs your tests on every commit, which checkpoints are not able to do, and it blocks any commit whose tests fail until they are fixed',
          'Checkpoints are only available to people on paid plans of the tool',
        ],
        answer: 1,
        explanation: 'Both tool docs describe checkpoints as quick recovery within a session and point to Git for permanent history. Claude Code, for example, does not track files only changed by shell commands.',
      },
      {
        id: 'improve-existing-ai-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a branch?',
        choices: [
          'A separate copy of the work where you can try changes without touching the original',
          'A button that deletes the project when you are finished with it',
          'A list of every person who has ever edited the project',
        ],
        answer: 0,
        explanation: 'A branch is a safe side copy. If the changes go badly you delete the branch and the main version is untouched.',
      },
      {
        id: 'improve-existing-ai-03-q6',
        audience: { min: 'advanced' },
        prompt: 'Three agent sessions need to work on the same repository at the same time. What is the best setup?',
        choices: [
          'Let all three edit the same working directory and merge whatever is left at the end of the day, fixing the conflicts by hand then',
          'Run them one at a time so that no two ever overlap, even for unrelated tasks',
          'Give each its own branch and its own git worktree, keep each change small, and let CI checks and review gate every merge',
          'Give them the same branch but ask each to pull before it writes, to avoid conflicts',
        ],
        answer: 2,
        explanation: 'Separate worktrees stop edits colliding on disk, separate branches keep each diff reviewable and revertable, and required checks keep the merge point honest. Sharing one directory makes diffs inseparable.',
      },
    ],
    task: {
      title: 'Run the loop once on your practice project',
      minutes: 20,
      steps: [
        'Make sure your project is a Git repository with a clean working tree (git status). If it is not, run git init and commit what works.',
        'Add a read-only smoke check: a short script that starts the app and makes five or so requests that only read data, and prints how many passed. Commit it on its own branch.',
        'On a new branch, ask your AI tool for one small change (for example: make a search ignore case). Say “change nothing else and do not reformat”.',
        'Run the smoke check, then read the whole git diff. Write down any edit you did not ask for. Commit only when the diff matches your request, and merge the branch.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['After reading the diff, ask the AI: “Explain each line this diff added or removed in plain words.” Compare that with what you thought each line did.'] },
      { audience: { min: 'advanced' }, steps: ['Set up two git worktrees of your repository and have one agent session work in each on unrelated changes. Open both diffs side by side and decide what branch protection rule and required check you would add so neither can merge unreviewed.'] },
    ],
  },
  {
    id: 'improve-existing-ai-04',
    day: 4,
    title: 'Add a feature to an existing app',
    summary: 'Write the request as a spec, plan before code, follow the app’s own habits and hunt down every place that reads the data you change.',
    minutes: 28,
    skills: ['add-feature'],
    intro: {
      objectives: [
        'Turn a feature request into a spec with checkable acceptance criteria',
        'Use a plan step so the AI shows its approach before it edits anything',
        'List every place that reads the data a feature touches, and check each one',
      ],
      why: 'Adding a feature to a working app is where AI helps most and breaks most. The new code usually works on its own; the damage is in the old code that reads the same data and was never told about the change.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A new feature in an existing app fails in two quiet ways. First, it can ignore the app’s own habits, so you end up with a second way of doing everything. Second, and more dangerous, it can work perfectly on its own while breaking old code that reads the same data. This lesson adds one real feature to Tindahan Orders and watches both risks. The feature: **void an order**. When a customer gives something back, or the cashier makes a mistake, Ate Nena needs to cancel the order without erasing it. This is a good test because an order is read in many places: the reports, the credit list, the receipt and the web page.',
      },
      { type: 'heading', text: 'Start with a spec, not a wish' },
      {
        type: 'paragraph',
        text: '“Add a way to void orders” is a wish. The AI will fill the gaps with guesses. A **spec** (specification) says exactly what done looks like, as short statements you can check one by one. These are called **acceptance criteria**. Write them yourself, before you ask for any code, because they are also your test plan.',
      },
      {
        type: 'prompt',
        label: 'The feature request as a spec (plan first, no code yet)',
        text: 'Plan, but do not write code yet: add “void an order” to this app. Acceptance criteria: (1) POST /api/orders/:id/void with an optional reason marks the order voided and records when; (2) the order’s items go back into stock; (3) the order stays in history, marked voided, never deleted; (4) voiding an order twice is refused with 409 and does not restock again; (5) voided orders do not count in the daily report, the credit (utang) report or top products; (6) the receipt shows VOID. Follow the style of POST /api/orders/:id/pay and use the existing db.js functions. List every file and every place that reads orders that the change must touch. Do not change how any other route behaves.',
      },
      { type: 'heading', text: 'Plan before code' },
      {
        type: 'paragraph',
        text: 'Most tools have a mode where the AI reads and proposes but changes nothing until you approve: plan mode. In Claude Code you press Shift+Tab until the status bar shows plan mode (or start with a permission-mode option); Cursor’s Plan Mode is also reached with Shift+Tab; Copilot lists a plan mode in its chat modes; Codex’s prompting guide shows a plan step for larger changes. Whatever the tool, the habit is the same: **read the plan against your map**. A good plan names the route, the `db.js` functions it will reuse, and every report that reads orders. If the plan does not mention the reports, you have just learned that before any code exists.',
      },
      { type: 'heading', text: 'Follow the neighbours' },
      {
        type: 'paragraph',
        text: 'The app already has a route that marks an order as paid, so the new route should look like its sibling: find the order, answer 404 if it is missing, change it, save it with `updateOrder`, return it. The same style means the next person (and the next AI session) finds no surprises. This is the finished route.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The void route in server.js, written to match the /pay route beside it',
        code: `app.post('/api/orders/:id/void', function (req, res) {
  var o = db.getOrder(req.params.id);
  if (!o) {
    return res.status(404).json({ error: 'order not found' });
  }
  if (o.voided) {
    return res.status(409).json({ error: 'order is already voided' });
  }
  for (var i = 0; i < o.items.length; i++) {
    var p = db.getProduct(o.items[i].productId);
    if (p) {
      p.stock = p.stock + o.items[i].qty;
      db.updateProduct(p);
    }
  }
  o.voided = true;
  o.voidedAt = new Date().toISOString();
  o.voidReason = (req.body && req.body.reason) || '';
  db.updateOrder(o);
  res.json(o);
});`,
      },
      {
        type: 'paragraph',
        text: 'Three decisions are worth noticing. The order is **marked** voided, not deleted, so the history stays (criterion 3). The check `if (o.voided)` makes a second void a 409 before anything is restocked, so stock cannot be added twice. And `if (p)` skips an item whose product has since been deleted instead of crashing. The new fields are optional: old orders have no `voided` field, so `!o.voided` is simply true for them and the data file needs no migration.',
      },
      { type: 'heading', text: 'The trap: everyone who reads orders' },
      {
        type: 'paragraph',
        text: 'Here is the map paying off. A search for `getOrders()` in the order code finds four readers, and the receipt and the web page read orders too. Each needs a decision about what “voided” means there.',
      },
      {
        type: 'table',
        headers: ['Who reads orders', 'What voided should mean there'],
        rows: [
          ['GET /api/orders (the list)', 'Keep it in the list, with the voided flag, so history is complete'],
          ['GET /api/report/daily', 'Skip it: a voided sale is not a sale'],
          ['GET /api/report/utang (credit owed)', 'Skip it: nobody owes money for a cancelled order'],
          ['GET /api/report/top-products', 'Skip it: those items were handed back'],
          ['GET /api/orders/:id/receipt', 'Print VOID so a cancelled receipt cannot be mistaken for a real one'],
          ['public/index.html (recent orders)', 'Show VOID instead of paid or UTANG, and hide the Void button'],
        ],
        caption: 'The checklist for the void feature. It comes straight from searching for who reads orders.',
      },
      {
        type: 'paragraph',
        text: 'To see why the checklist matters, here is what really happened when the first pass touched only the route and the daily report. Lorna owed ₱71. A ₱51 order was added for her on credit, then voided.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: first pass (route and daily report only), then the finished feature',
        code: `# first pass
$ curl -s localhost:3100/api/report/utang
[{"customerId":"c-tess","name":"Tess Reyes","owed":268.25},{"customerId":"c-lorna","name":"Lorna Dela Cruz","owed":71}]
  (after adding a 51 peso order for Lorna on credit: owed 122)
$ curl -s -X POST localhost:3100/api/orders/<id>/void -d '{"reason":"returned"}'
{ voided: true, voidReason: 'returned' }
$ curl -s localhost:3100/api/report/utang
[... "Lorna Dela Cruz","owed":122}]        <- still owes for a voided order
$ curl -s -X POST .../void  (a second time)
{"error":"order is already voided"}  -> HTTP 409

# after fixing the credit report, top products, receipt and page
Sabon stock after the sale: 33
utang before void: ... "owed":122
utang after void:  ... "owed":71
Sabon stock after void: 35
TINDAHAN NI ATE NENA
Sabon x2  51
TOTAL: PHP 51
UTANG
*** VOID ***`,
      },
      {
        type: 'paragraph',
        text: 'The feature “worked” in every way you would try by hand: it returned the order, restocked, refused a second void. And Lorna would still have been told she owed money for something she handed back. Nothing crashed and no error appeared. Only the checklist, built from the map, found it. The whole feature across the route, the three reports, the receipt and the page was `2 files changed, 41 insertions(+), 2 deletions(-)`, and `npm run smoke` still said `8/8 passed`, which is the reminder that the smoke check could never have seen any of this. Lesson 7 builds the tests that can.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a paper receipt book at a shop. When a sale is cancelled you do not tear the page out, because the numbers would no longer add up and nobody could prove what happened. You stamp it VOID and put the goods back on the shelf. That is exactly what the route does. Reading it top to bottom: it finds the order by its id (`getOrder`); if there is none it says “not found”; if it is already voided it refuses; it then loops over every item and adds the quantity back to the product’s stock; it writes down that the order is voided, when, and why; and it saves and returns the order. A *loop* is just “do this for each item in the list”. The `if (p)` line means “only if the product still exists”.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Specs as test plans.** Each acceptance criterion is a sentence you can turn into one check: restock (query stock before and after), refusal (call twice, expect 409 and unchanged stock), reports (compare totals before and after). Write them as a list in your pull request description, tick them off with evidence, and hand the same list to the AI. Also notice the data change was **additive**: new optional fields with a safe default. Additive changes are the easiest to ship to an app with live data, because old records stay valid.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**Production concerns.** This store has a file, so read-modify-write is not atomic: two cashiers voiding the same order at once can both see it unvoided and restock twice. In a real system that needs a lock, a transaction, or an idempotency key. Soft deletion (a `voided` flag) preserves the audit trail but spreads a filter across every reader; centralise that filter (a query helper or a view) so the next feature cannot forget it. Think about API compatibility (older clients ignore the new field), authorisation (who may void, and should a manager approve large ones), and rollout (a feature flag lets you merge dark and enable per store). Large generated changes are easier to review as stacked pull requests: route and restock first, then each reader.',
      },
      {
        type: 'version',
        text: 'Plan modes: Claude Code’s plan mode lets Claude read files and propose a plan without editing until you approve (Shift+Tab until the status bar shows plan mode, or claude --permission-mode plan). Cursor’s Plan Mode, reached with Shift+Tab from the chat input, researches the codebase, asks clarifying questions and drafts an editable plan that can be saved to the workspace. GitHub Copilot lists a plan mode in VS Code, JetBrains, Xcode and Eclipse chat. Codex’s prompting guide shows a planning prompt that requires no user-visible behaviour changes and a step-by-step plan for a refactor. Checked on this date; names, shortcuts and availability change.',
        checked: CHECKED,
        sources: [DOCS.ccPlan, DOCS.ccWorkflows, DOCS.cursorPlan, DOCS.copilotChat, DOCS.codexPrompting],
      },
      {
        type: 'takeaways',
        items: [
          'Write the request as a spec with acceptance criteria; they become your checklist and your test plan.',
          'Ask for a plan first and read it against your map: a plan that skips the readers of the data is a warning.',
          'Make the new code look like its neighbours, and prefer additive data changes (optional fields with safe defaults).',
          'List every place that reads the data you touch and decide what the change means in each. A feature can work and still break an old report.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-04-code-challenge-1',
          kind: 'code-challenge',
          title: 'Count credit the right way',
          prompt: 'owedByCustomer(orders) should return an object mapping each customer id to how much they owe. Only count orders that have a customerId, are not paid and are not voided, and round each customer’s total to 2 decimals. The starter forgets voided orders and rounding, as the first pass of the feature did.',
          concept: 'features that touch shared data',
          language: 'javascript',
          starter: `function owedByCustomer(orders) {
  var owed = {};
  for (var i = 0; i < orders.length; i++) {
    var o = orders[i];
    if (o.customerId && !o.paid) {
      owed[o.customerId] = (owed[o.customerId] || 0) + o.total;
    }
  }
  return owed;
}`,
          solution: `function owedByCustomer(orders) {
  var owed = {};
  for (var i = 0; i < orders.length; i++) {
    var o = orders[i];
    if (o.customerId && !o.paid && !o.voided) {
      owed[o.customerId] = (owed[o.customerId] || 0) + o.total;
    }
  }
  var ids = Object.keys(owed);
  for (var k = 0; k < ids.length; k++) {
    owed[ids[k]] = Math.round(owed[ids[k]] * 100) / 100;
  }
  return owed;
}`,
          tests: {
            kind: 'function',
            fn: 'owedByCustomer',
            cases: [
              { label: 'adds unpaid orders per customer', args: [[{ customerId: 'a', paid: false, total: 20 }, { customerId: 'b', paid: false, total: 5 }, { customerId: 'a', paid: false, total: 30 }]], expected: { a: 50, b: 5 } },
              { label: 'ignores voided orders', args: [[{ customerId: 'a', paid: false, total: 51, voided: true }, { customerId: 'a', paid: false, total: 71 }]], expected: { a: 71 } },
              { label: 'ignores paid orders and walk-in orders', args: [[{ customerId: 'a', paid: true, total: 40 }, { customerId: null, paid: false, total: 12 }]], expected: {} },
              { label: 'rounds to centavos', args: [[{ customerId: 'a', paid: false, total: 0.1 }, { customerId: 'a', paid: false, total: 0.2 }]], expected: { a: 0.3 } },
            ],
          },
          hints: [
            'Which extra condition should keep a voided order out of the total?',
            'Add !o.voided to the if. Then add a second loop over Object.keys(owed) to round each total.',
            'Round with Math.round(x * 100) / 100, because 0.1 + 0.2 is 0.30000000000000004 in JavaScript.',
          ],
          explanation: 'The credit report is one of the readers of orders, so it has to know about voided ones. Without the check a customer still owes for a cancelled sale. The rounding guards against the float error that also shows up in order totals.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-04-scenario-1',
          kind: 'scenario',
          title: 'How should “void” work?',
          prompt: 'Pick the design you would put in the spec.',
          concept: 'designing a feature around existing data',
          situation: 'The AI proposes two designs for voiding an order. A: delete the order from the data file and put its items back in stock. B: keep the order, add a voided flag with the time and reason, and put its items back in stock.',
          options: [
            { text: 'B: keep the order and mark it voided, then make every reader of orders aware of the flag.', consequence: 'History is complete, a dispute can be answered later, and the reports stay correct once the readers skip voided orders.', quality: 'best' },
            { text: 'A: delete the order, because a deleted order cannot affect any report.', consequence: 'The reports are right, but there is no record that the sale ever happened, and a customer who says “I returned that” cannot be answered.', quality: 'poor' },
            { text: 'A, but write a line to a log file first so the order can be recovered.', consequence: 'It keeps some history, but it is a second storage place to keep consistent, and the app itself can no longer show the voided order.', quality: 'acceptable' },
            { text: 'Skip restocking: the shop can adjust stock by hand when needed.', consequence: 'You removed a requirement from the spec to make the feature easier, and every void now leaves wrong stock.', quality: 'poor' },
          ],
          hints: [
            'What does the shop lose if the order disappears?',
            'A record you keep can still be shown, audited and filtered; a deleted one cannot.',
            'The best design keeps the order and marks it, at the cost of making readers skip it.',
          ],
          explanation: 'Marking an order voided keeps the audit trail. The price is that every place that reads orders must understand the flag, which is exactly what the checklist is for.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-04-predict-output-1',
          kind: 'predict-output',
          title: 'Restock with a deleted product',
          prompt: 'This is the restock loop from the void route in miniature. One product on the order (itlog) was deleted from the shop earlier. What does it print?',
          concept: 'defensive restocking',
          language: 'javascript',
          code: `var stock = { asin: 5, kape: 10 };
var items = [
  { id: 'asin', qty: 2 },
  { id: 'itlog', qty: 3 },
  { id: 'kape', qty: 1 },
];
items.forEach(function (it) {
  if (stock[it.id] !== undefined) {
    stock[it.id] = stock[it.id] + it.qty;
  }
});
console.log(stock.asin);
console.log(stock.kape);
console.log(stock.itlog);`,
          choices: ['7\n11\nundefined', '7\n11\n3', '7\n10\nundefined', 'NaN\n11\nundefined'],
          wrongNotes: {
            '7\n11\n3': 'The if skips itlog because it is not in the stock list, so nothing is added for it and stock.itlog is still undefined.',
            '7\n10\nundefined': 'The third item, kape, is still restocked: 10 plus 1 is 11, not 10.',
            'NaN\n11\nundefined': 'asin is in the list, so the if lets it through: 5 plus 2 is 7. NaN would only appear if an undefined value were added.',
          },
          hints: [
            'Walk through the three items one at a time and write down the stock after each.',
            'For itlog the condition stock[it.id] !== undefined is false, so that item is skipped.',
            'asin goes 5 to 7, kape goes 10 to 11, and itlog never gets an entry.',
          ],
          explanation: 'The guard skips items whose product no longer exists, so the void succeeds for the rest instead of crashing. The output is 7, 11 and undefined.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-04-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words for adding a feature',
          prompt: 'Tap each card after saying the meaning in your own words.',
          concept: 'feature vocabulary',
          cards: [
            { front: 'Spec', back: 'A clear description of what the finished feature does, written before the code.' },
            { front: 'Acceptance criteria', back: 'Short statements you can check one by one to decide whether the feature is done.' },
            { front: 'Plan mode', back: 'A mode where the AI reads and proposes a plan but does not change any file until you agree.' },
            { front: 'Soft delete', back: 'Marking something as removed (like VOID) instead of erasing it, so the history stays.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'Spec, criteria, plan and soft delete are the four ideas this lesson uses.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-04-q1',
        prompt: 'Why write acceptance criteria yourself before asking an AI for a feature?',
        choices: [
          'The AI cannot write any code unless it is first given a numbered list of requirements to work from',
          'They are your checklist for judging the result, so you are not just accepting whatever it built',
          'They make the generated code shorter and therefore easier for you to read',
          'Git needs them to name the branch that the feature will be built on',
        ],
        answer: 1,
        explanation: 'Without criteria you can only ask “does it seem to work?”. With them you can check each statement, and they double as a test plan.',
      },
      {
        id: 'improve-existing-ai-04-q2',
        prompt: 'The AI’s plan for “void an order” never mentions the reports. What should you do?',
        choices: [
          'Approve it: the reports will probably keep working on their own',
          'Ask it to write the code and look at the reports afterwards in the browser',
          'Delete the reports from the app so that they cannot be affected by the new feature in any way',
          'Send it back and ask which code reads orders and what a voided order should do in each place',
        ],
        answer: 3,
        explanation: 'The plan is the cheapest place to find a missing reader. Your map and a search for getOrders() tell you that the reports read orders, so a plan that ignores them is incomplete.',
      },
      {
        id: 'improve-existing-ai-04-q3',
        prompt: 'Why does the void route mark the order as voided instead of deleting it?',
        choices: [
          'The history stays, so the shop can answer disputes and the reports can still tell what happened',
          'Deleting rows from the data file is not possible with Node.js',
          'A flag is faster to save than a deletion because the file is smaller and Node.js writes it more quickly',
          'Express does not allow a route to remove data and return a response',
        ],
        answer: 0,
        explanation: 'Marking keeps the record. Deleting is possible and even simple here, but it destroys the audit trail the shop needs.',
      },
      {
        id: 'improve-existing-ai-04-q4',
        prompt: 'After the first pass, a customer still owed money for a voided order. Which step in your process would have caught that before running anything?',
        choices: [
          'Running npm run smoke, which sends read requests to the credit report',
          'Asking the AI whether it was sure the feature was finished',
          'The checklist of every reader of orders, built by searching for getOrders()',
          'Reading the diff of only the route you changed, since that is where the new code lives',
        ],
        answer: 2,
        explanation: 'The credit report is a reader of orders. The checklist forces you to decide what voided means for each reader. The smoke check never created a voided order, so it could not see this.',
      },
      {
        id: 'improve-existing-ai-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does “follow the style of the code beside it” mean?',
        choices: [
          'Write the new code so it looks and works like the nearby code, so the next person finds no surprises',
          'Copy the old code exactly, including its mistakes, so that nothing changes at all',
          'Use the newest and most unusual features of the language so the code looks modern',
        ],
        answer: 0,
        explanation: 'A project is easier to maintain when similar things are written in similar ways. The new void route is built like the pay route beside it.',
      },
      {
        id: 'improve-existing-ai-04-q6',
        audience: { min: 'advanced' },
        prompt: 'Two cashiers void the same order at the same moment in an app that stores data in one JSON file. What can go wrong?',
        choices: [
          'The file system rejects the second write and the cashier sees a clear error message',
          'Both requests read the order as not yet voided and both restock, since read-modify-write on a file is not atomic; it needs a lock or transaction',
          'Nothing, because Node.js runs one request at a time, so two requests can never overlap even when each of them reads the file, waits, and writes it back',
          'The first void is rolled back automatically so that only the later one counts',
        ],
        answer: 1,
        explanation: 'Each request reads the whole file, changes it and writes it back. Interleaving means both see the old state. A real fix is a lock, a database transaction or an idempotency key. Node being single-threaded does not help once the code awaits or reads between steps.',
      },
    ],
    task: {
      title: 'Add one feature to your practice project',
      minutes: 20,
      steps: [
        'Choose a small feature that touches data other screens read (for example: cancel an order, archive a product, mark a customer inactive). Write four to six acceptance criteria.',
        'Search for every place that reads that data and build a table of readers and what the feature should mean in each.',
        'Ask your AI tool for a plan first (plan mode, or “plan only, no code”) and compare it with your table. Send it back if a reader is missing.',
        'Implement on a branch, run the feature by hand against every row of your table, read the diff, and commit.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain the finished route line by line in plain words, then change one thing yourself (for example the message on a refusal) and check that you predicted what would happen.'] },
      { audience: { min: 'advanced' }, steps: ['Write down one concurrency or compatibility risk of your feature (a race, an old client, a missing authorisation check) and either guard against it or record why you accept it.'] },
    ],
  },
  {
    id: 'improve-existing-ai-05',
    day: 5,
    title: 'Fix a bug you did not cause',
    summary: 'Reproduce an inherited bug, write the test that fails for the right reason, fix the cause instead of the symptom, and prove it.',
    minutes: 28,
    skills: ['fix-inherited-bug'],
    intro: {
      objectives: [
        'Reproduce an inherited bug and write a regression test that fails before the fix',
        'Tell a fix for the cause from a patch for the symptom',
        'Use Git history to learn when a line arrived, without expecting it to tell you why',
      ],
      why: 'On a project you inherited, bugs arrive as complaints with no history behind them. A fix you can prove with a test that failed first is the difference between “I think that is better” and “that is fixed and will stay fixed”.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The map from lesson 2 left you a list of suspects. A suspect is not a bug until you have made it happen. This lesson works through three real ones in Tindahan Orders, each of which the shop would feel: an order that fails halfway but still takes stock, a receipt that crashes, and a daily report that puts early-morning sales on the wrong day. The method is the one from the Debugging with AI course (reproduce, isolate, fix, verify), with one change for code you did not write: you first need a **safety net for the fix itself**, a test that fails today and passes after. A test that guards a bug you have fixed is called a **regression test**, because it catches the bug if it ever regresses (comes back).',
      },
      { type: 'heading', text: 'Reproduce first, with real data' },
      {
        type: 'paragraph',
        text: 'The day-boundary bug is the sneakiest, so start there. The shop is in Manila, which is 8 hours ahead of UTC. The server stamps each order in UTC (that is what `toISOString()` gives), and the reports decide which day an order belongs to with `createdAt.slice(0, 10)`, the first ten characters of that UTC stamp. An order placed at 6:30 AM on 14 November in Manila is `2026-11-13T22:30:00.000Z` in UTC, so its first ten characters say 13 November.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: an order at 6:30 AM Manila time on 14 November, as received',
        code: `$ curl -s -X POST localhost:3100/api/orders -H 'content-type: application/json' \\
    -d '{"items":[{"productId":"p-itlog","qty":2}],"createdAt":"2026-11-13T22:30:00.000Z"}'
$ curl -s "localhost:3100/api/report/daily?date=2026-11-14"
{"date":"2026-11-14","orders":0,"total":0,"byCategory":{}}
$ curl -s "localhost:3100/api/report/daily?date=2026-11-13"
{"date":"2026-11-13","orders":1,"total":19,"byCategory":{"pantry":19}}`,
      },
      {
        type: 'paragraph',
        text: 'There it is: a sale made on the 14th appears on the 13th. The receipt crash reproduces the same way. Make an order, delete one of its products, then open the receipt: the server answers HTTP 500 and its log says `TypeError: Cannot read properties of null (reading \'name\')` at `server.js:201`. The receipt looks the product up in today’s product list to print its name, and the product is gone.',
      },
      { type: 'heading', text: 'What Git history can and cannot tell you' },
      {
        type: 'paragraph',
        text: 'Before fixing, find out when the suspicious line arrived. `git log -S"text"` lists the commits that added or removed that exact text, and `git blame` shows which commit last touched each line.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: history of the slice(0, 10) lines in the repository',
        code: `$ git log -S"slice(0, 10)" --oneline -- server.js
818664a Fix receipt crash on a deleted product and the UTC/Manila day mix-up in reports (with tests)
a9db791 Imported from Jun's USB drive (as received)

$ git blame -L 8,10 db.js
^a9db791 (Course Author 2026-11-14 15:41:39 +0800  8)
^a9db791 (Course Author 2026-11-14 15:41:39 +0800  9) function load() {
^a9db791 (Course Author 2026-11-14 15:41:39 +0800 10)   if (!fs.existsSync(DB_FILE)) {`,
      },
      {
        type: 'paragraph',
        text: 'The first command (shown after the fix, so it has two entries) says the text was there from the first commit. The second shows the weakness of inherited history: every line points to one big import commit named after a USB drive. History tells you **when** and **who**. It almost never tells you **why**, so do not let an AI (or yourself) invent a reason. The code is the only evidence, and what you can say for sure is what the program does.',
      },
      { type: 'heading', text: 'Make the project testable, then write the test that fails' },
      {
        type: 'paragraph',
        text: 'To test a route you need to start the app inside a test without opening the real data file. The app could not do that, so the first commit makes three small changes and no behaviour change: the data file path can come from an environment variable (`TINDAHAN_DB`), `server.js` exports the app and only listens when started directly, and request logging is skipped when `NODE_ENV` is `test`. Each test then starts the app on a random port against a throwaway copy of a fixture file. This is called creating a **seam**, a place where a test can attach. Then write the tests for the bugs and **run them before touching the code**.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: five regression tests, run against the unfixed code',
        code: `$ npm test
✖ an order with an unknown product changes no stock
✖ an order for more than the stock is refused
✖ quantity must be a whole number above zero
✖ a discount above 100 percent is refused
✖ totals are rounded to centavos
ℹ tests 5
ℹ pass 0
ℹ fail 5

  38 !== 40            (stock after the failed order, versus before)
  201 !== 409          (the oversell was accepted)
  25.049999999999997 !== 25.05`,
      },
      {
        type: 'warning',
        text: 'A regression test must fail for the right reason before the fix. The first draft of the day-boundary test in this project passed one of its two checks on the unfixed code, because the machine’s clock said 14 November and the test created an order “now”. A test that depends on today’s date passes or fails by accident. Give every test order an explicit `createdAt`, so the result never depends on when you run it.',
      },
      { type: 'heading', text: 'Fix the cause, not the symptom' },
      {
        type: 'paragraph',
        text: 'Take the discount bug: a discount of 150 percent produced a total of −29. There are three ways to “fix” it. You could clamp the number to 100 in the web page, but another client, or the browser’s developer tools, can still send 150. You could silently clamp it on the server, which hides a mistake from the cashier. Or you could **reject** it on the server, where the order is built, with a clear message. Only the last fixes the cause: the server trusted its input. The same shape fixes the oversell and the half-failed order: check **everything** first, change **nothing** until all checks pass.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Fragment: the shape of the fixed order route (checks first, then changes)',
        code: `// 1. check everything, change nothing yet
for (var i = 0; i < items.length; i++) {
  var qty = Number(items[i].qty);
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: 'qty must be a whole number of at least 1' });
  }
  var p = db.getProduct(items[i].productId);
  if (!p) return res.status(404).json({ error: 'product not found: ' + items[i].productId });
  wanted[p.id] = (wanted[p.id] || 0) + qty;
  if (wanted[p.id] > p.stock) return res.status(409).json({ error: 'not enough stock for ' + p.name });
}
// ... customer and discount checks, totals rounded to centavos ...
// 2. only now take the items out of stock
for (var id in wanted) {
  found[id].stock = found[id].stock - wanted[id];
  db.updateProduct(found[id]);
}`,
      },
      {
        type: 'paragraph',
        text: 'For the day boundary the fix is one small function that answers “which day is this order, in the shop’s time zone?”, used by the list, the report and the page’s default date. Because it names the zone explicitly it gives the same answer on any computer.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output (shortened): the same timestamp, as the old code and the new function read it',
        code: `$ TZ=UTC node day.js
2026-11-13        <- iso.slice(0, 10)         (what the report used)
2026-11-14        <- shopDay(iso)             (shop time, Asia/Manila)
$ TZ=America/New_York node day.js
2026-11-13
2026-11-14        <- same answer on a computer in another time zone

$ npm test
✔ 8 tests passed  (the 5 order tests, the receipt, and the two day tests)
$ npm run smoke | tail -1
smoke: 8/8 passed`,
      },
      {
        type: 'paragraph',
        text: 'The receipt crash was fixed the same way: each order line already stores the product’s name when the order is made, so the receipt prints `it.name` from the order instead of looking the product up again. A deleted product no longer matters, because the receipt never needed it. Notice that the fix **removes a dependency** (receipt on the live product list) rather than catching the error. That is usually what “fix the cause” looks like.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A bug report is like a customer saying “the till is wrong”. You cannot fix that until you can make the till go wrong on purpose, which is *reproducing* it. A regression test is a small program that makes the problem happen and then checks the answer, like repeating the mistake in front of a witness. It must **fail first**: if it passes before you have fixed anything, it is not watching the bug. The three lines of the seam are like putting a test socket on the wall so you can plug in without touching the real wiring. And “check everything first, change nothing until all checks pass” is how a cashier works: look at the whole basket before ringing up the first item, because it is hard to un-ring a till.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Fix the contract, not just the case.** When you fix one failing input, ask what the rule is that it violated: here, “an order is all or nothing”. Then write the test for the rule, not just the example (an unknown product *and* an unknown customer *and* too little stock should all leave the data unchanged). A test for the rule will catch the next case you did not think of. Watch for behaviour that callers rely on: a web page that sent `"2"` as text for a quantity kept working because the fix converts with `Number()`.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**Beyond the code.** A root-cause fix is incomplete if bad data already exists: here, negative stock and orders on the wrong day are stored in the data file. Plan a reviewed, reversible repair (backup first, a script that reports what it will change before it changes it) and add a detector so new bad rows page someone. For a regression in a large history, `git bisect run` with your failing test finds the introducing commit mechanically. Decide deliberately whether callers depended on the old behaviour (Hyrum’s law: with enough users, every observable behaviour is relied on): a bug fix is a behaviour change and may need a flag, a deprecation window or a changelog line. Record the incident learning where the next person will look: the test name and the instructions file.',
      },
      {
        type: 'version',
        text: 'Claude Code’s docs advise giving it the command that reproduces the issue, any steps to reproduce, and whether the error is intermittent. Codex’s prompting guide has a fix-a-bug workflow that asks for a regression test where feasible. Node.js 22’s built-in test runner (node --test with node:test and node:assert) was used for the tests in this lesson; test files are found by name patterns and the process exits with code 1 if a test fails. git log -S and git blame behave as documented; Git 2.54 was used. Checked on this date; tool features change often.',
        checked: CHECKED,
        sources: [DOCS.ccWorkflows, DOCS.codexPrompting, DOCS.nodeTest, DOCS.gitLog, DOCS.gitBlame],
      },
      {
        type: 'version',
        text: 'The shop-day function relies on Intl: toLocaleDateString (and Intl.DateTimeFormat) accept a timeZone option, and the en-CA locale writes dates as YYYY-MM-DD. This was run on Node.js 22.23; check MDN’s Intl.DateTimeFormat page for browser support before using the same call in a web page.',
        checked: CHECKED,
        sources: [DOCS.mdnDateTimeFormat],
      },
      {
        type: 'takeaways',
        items: [
          'A suspect is not a bug until you have reproduced it with real input; write down the exact command and the answer you expected.',
          'Make the project testable with a small seam, then write the regression test and watch it fail for the right reason before you fix anything.',
          'Fix the cause: validate on the server, check everything before changing anything, and remove fragile dependencies instead of catching their errors.',
          'Git history tells you when and who, not why. Never let anyone, including an AI, invent the why.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'The last unit of stock',
          prompt: 'Ate Nena has 8 candles and a customer wants all 8, but the order is refused. enoughStock(stock, qty) should allow buying exactly what is left and refuse anything more. Tap the buggy line and choose the fix.',
          concept: 'boundary bugs',
          language: 'javascript',
          code: `function enoughStock(stock, qty) {
  if (!Number.isInteger(qty) || qty < 1) {
    return false;
  }
  return qty < stock;
}`,
          bugLine: 5,
          fixes: [
            { line: 'return qty <= stock;', correct: true, why: 'Buying exactly the stock left (8 of 8) is allowed, and 9 of 8 is still refused.' },
            { line: 'return qty <= stock + 1;', correct: false, why: 'This allows 9 candles when only 8 exist, which brings back the oversell bug.' },
            { line: 'return qty == stock;', correct: false, why: 'Now only the exact amount is accepted: buying 1 of 8 would be refused.' },
            { line: 'return qty > 0;', correct: false, why: 'This only repeats the check above it and never looks at the stock, so any quantity is accepted.' },
          ],
          lineNote: 'That line is fine. The problem is the comparison that decides whether there is enough stock.',
          tests: {
            kind: 'function',
            fn: 'enoughStock',
            cases: [
              { label: 'all of the stock', args: [8, 8], expected: true },
              { label: 'one more than the stock', args: [8, 9], expected: false },
              { label: 'a few of the stock', args: [8, 3], expected: true },
              { label: 'quantity zero', args: [8, 0], expected: false },
            ],
          },
          hints: [
            'Try the case from the story: stock 8 and quantity 8. What does qty < stock give?',
            'When qty equals stock the comparison needs to be true, so “less than” is one character short.',
            'Use less-than-or-equal: qty <= stock.',
          ],
          explanation: 'An off-by-one at the boundary is the classic inherited bug, and it only shows when the quantity equals the stock. This is why the test cases include the exact boundary, not just easy numbers.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-05-predict-output-1',
          kind: 'predict-output',
          title: 'Which day is it in Manila?',
          prompt: 'This Node.js script prints three lines. The first uses the report’s old method. The other two use the shop-day method with the time zone Asia/Manila. Work out what it prints (Manila is 8 hours ahead of UTC).',
          concept: 'time zones and the shop day',
          language: 'node',
          code: `var iso = '2026-11-13T22:30:00.000Z';
console.log(iso.slice(0, 10));
console.log(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }));
console.log(new Date('2026-11-14T16:30:00.000Z').toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }));`,
          expected: '2026-11-13\n2026-11-14\n2026-11-15',
          choices: ['2026-11-13\n2026-11-14\n2026-11-15', '2026-11-13\n2026-11-14\n2026-11-14', '2026-11-14\n2026-11-14\n2026-11-14', '2026-11-13\n2026-11-13\n2026-11-14'],
          wrongNotes: {
            '2026-11-13\n2026-11-14\n2026-11-14': '16:30 UTC plus 8 hours is 00:30 on the next day in Manila, so the third line is 15 November, not 14.',
            '2026-11-14\n2026-11-14\n2026-11-14': 'The first line uses slice on the UTC text, which keeps the UTC date: 13 November.',
            '2026-11-13\n2026-11-13\n2026-11-14': '22:30 UTC plus 8 hours is 06:30 on 14 November in Manila, so the second line is the 14th.',
          },
          hints: [
            'The first line only cuts the first ten characters of the text; it does no time arithmetic.',
            'For the other lines add 8 hours to the UTC time and read the date.',
            '22:30 on the 13th becomes 06:30 on the 14th; 16:30 on the 14th becomes 00:30 on the 15th.',
          ],
          explanation: 'The slice keeps the UTC date, 13 November. In Manila time the first order is on the 14th, and the 16:30 UTC order has already crossed midnight into the 15th. A day boundary depends on the time zone of the shop, so the code must name it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-05-scenario-1',
          kind: 'scenario',
          title: 'Which fix for a 150% discount?',
          prompt: 'Choose the fix you would ship.',
          concept: 'fix the cause',
          situation: 'A cashier entered 150 in the discount box and the order total became −29. Your AI tool offers three fixes.',
          options: [
            { text: 'Reject discounts outside 0 to 100 on the server with a 400 error and a clear message, and add a test.', consequence: 'Every client, including the page and any future one, gets the same rule, and the cashier is told what went wrong.', quality: 'best' },
            { text: 'Limit the number box in the web page to 100 and leave the server as it is.', consequence: 'The page behaves, but the server still accepts 150 from any other client or a changed page, so the bug is only hidden.', quality: 'acceptable' },
            { text: 'Silently clamp any discount above 100 down to 100 on the server.', consequence: 'No negative totals, but a typo like 150 now silently gives away the whole order and nobody notices.', quality: 'poor' },
            { text: 'Wrap the total in Math.abs so that it can never show as negative.', consequence: 'The report now adds 29 pesos of sales that never happened. You hid the symptom and made the data wrong.', quality: 'poor' },
          ],
          hints: [
            'Where should the rule “a discount is between 0 and 100” live so that nobody can bypass it?',
            'The page can be bypassed. The server is where the order is built.',
            'Reject bad input on the server with a clear error, and write a test for it.',
          ],
          explanation: 'Validate where the data enters the system you control, tell the caller what was wrong, and test it. Patches that hide the symptom, such as abs or silent clamping, trade a visible bug for an invisible one.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-05-q1',
        prompt: 'You wrote a regression test for a bug and it passes on the unfixed code. What does that mean?',
        choices: [
          'The bug does not really exist, so there is nothing to fix',
          'The test is not watching the bug yet; make it fail for the right reason before you touch the code',
          'The fix is already in place from an earlier commit by the previous developer',
          'The test is perfect and is the sign that your tooling has been set up correctly, so you can start fixing',
        ],
        answer: 1,
        explanation: 'A test that cannot fail guards nothing. In this project a date-dependent draft passed by accident. Always see red before green.',
      },
      {
        id: 'improve-existing-ai-05-q2',
        prompt: 'What does git log -S"slice(0, 10)" -- server.js find?',
        choices: [
          'Every line that contains the text, with the person who is responsible for it today',
          'The commits that added or removed that exact text in server.js',
          'The ten most recent commits that touched server.js, in order',
          'The tests that fail because of that line of code',
        ],
        answer: 1,
        explanation: 'The -S option (the pickaxe) lists commits where the number of occurrences of the text changed. It tells you when text arrived or left, not why.',
      },
      {
        id: 'improve-existing-ai-05-q3',
        prompt: 'Which change fixes the cause of an order that fails halfway but has already reduced stock?',
        choices: [
          'Catch the error and add the stock back in a catch block',
          'Show the cashier a warning that stock might be wrong afterwards',
          'Check every item and the customer first, and only then change any stock',
          'Run the order twice so that the second attempt corrects the first',
        ],
        answer: 2,
        explanation: 'The cause is changing state before all checks pass. Checking everything first means there is never anything to undo. Catching and reversing is fragile: the reversal itself can fail.',
      },
      {
        id: 'improve-existing-ai-05-q4',
        prompt: 'The receipt crashed because it looked up a product that had been deleted. Why is printing the name saved on the order line a better fix than catching the error?',
        choices: [
          'Catching errors is not allowed inside an Express route handler',
          'It removes the dependency on a record that can disappear, so the receipt can never hit that problem',
          'It makes the receipt print faster because it skips a function call and one read of the data file entirely',
          'It is shorter, and shorter code never has bugs in it',
        ],
        answer: 1,
        explanation: 'The order already stores the name at the time of sale, which is also what a historical receipt should show. Removing the fragile lookup fixes the cause instead of hiding the symptom.',
      },
      {
        id: 'improve-existing-ai-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a regression test?',
        choices: [
          'A test you take once at the start of learning to code',
          'A check that makes sure a problem you already fixed does not come back',
          'A speed test that measures how fast the program is running now',
        ],
        answer: 1,
        explanation: 'To regress is to go backwards. A regression test keeps the fix from going backwards later when someone changes the code again.',
      },
      {
        id: 'improve-existing-ai-05-q6',
        audience: { min: 'advanced' },
        prompt: 'After you deploy the validation fix, 40 products in production already have negative stock. What is the best next step?',
        choices: [
          'Nothing: the new validation means the bad rows will fix themselves over time as customers place new orders for those products and the stock numbers return to normal',
          'Run a one-off update that sets all negative stock to zero straight away',
          'Delete the 40 products so that they stop appearing in the stock reports',
          'Back up the data, write a repair script that reports what it would change first, review and run it, and add a check for new negative stock',
        ],
        answer: 3,
        explanation: 'A code fix does not repair stored data. A reviewed, reversible repair with a dry run and a detector treats data changes with the same care as code changes. Zeroing blindly loses information about why stock went wrong.',
      },
    ],
    task: {
      title: 'Fix one inherited bug the proper way',
      minutes: 20,
      steps: [
        'Pick one suspect from your map’s hazards list that the shop would notice. Reproduce it with an exact request or action and write down what you expected.',
        'Create the smallest seam you need to test it (a data path from an environment variable, an exported app) and commit that on its own, with no behaviour change.',
        'Write a regression test, give it fixed dates and ids, and run it on the unfixed code. It must fail for the reason you expect.',
        'Fix the cause on a branch, run the test, the smoke check and the whole diff review, and commit with a message that says what changed for the user.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask your AI: “Explain why this test failed before the fix and passes now, in plain words.” If its explanation does not match what you saw, say so and ask again.'] },
      { audience: { min: 'advanced' }, steps: ['Write down who or what might depend on the old behaviour, and whether the bug fix needs a flag, a changelog line or a data repair. Add the incident learning to your instructions file as one rule.'] },
    ],
  },
  {
    id: 'improve-existing-ai-06',
    day: 6,
    title: 'Refactor without breaking things',
    summary: 'Record what the code does today, then reshape it in small steps while the recording keeps proving nothing changed.',
    minutes: 28,
    skills: ['refactor-with-tests'],
    intro: {
      objectives: [
        'Explain what a refactor is and why it needs a safety net first',
        'Record the current behaviour of a route as a characterization test, then check the recording has no holes',
        'Do one kind of change at a time and keep refactors and bug fixes in separate commits',
      ],
      why: 'AI can rewrite a messy function in seconds and it will look cleaner. Whether it still does the same thing is a different question, and without a recording of the old behaviour you cannot answer it.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'To **refactor** is to change how code is organised without changing what it does. The order route in Tindahan Orders is a good candidate: after the lesson 5 fixes it was about sixty lines doing two jobs at once, handling the web request and applying the shop’s rules (stock, quantities, discounts, rounding). You cannot test the rules without starting a server, and you cannot read the route without holding both jobs in your head. The risk of refactoring is the reverse of a feature: the code looks better and nobody can tell whether it still behaves the same. So the rule for code you do not trust is **tests first**. And since this code has no tests, the first tests are not “what should it do?” tests. They are recordings of what it does.',
      },
      { type: 'heading', text: 'Characterization tests: record, do not judge' },
      {
        type: 'paragraph',
        text: 'A **characterization test** (also called a golden master test) runs the code on a list of inputs, writes down exactly what comes out, and fails later if the output ever differs. It does not ask whether the behaviour is right. It only protects it. Here is the harness for the order route in Tindahan Orders, in outline: a list of cases, a function that sends each one to a fresh app and records the status, the body (minus the random id) and the stock afterwards, and a `--record` switch that writes the result to a file.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Fragment: the shape of test/characterization.js (cases abridged)',
        code: `var CASES = [
  { name: 'one item', body: { items: [{ productId: 'p-kape', qty: 3 }] } },
  { name: 'qty as text, like the web page sends it', body: { items: [{ productId: 'p-asin', qty: '2' }] } },
  { name: 'same product on two lines', body: { items: [{ productId: 'p-sabon', qty: 2 }, { productId: 'p-sabon', qty: 3 }] } },
  { name: 'unknown product', body: { items: [{ productId: 'p-nope', qty: 1 }] } },
  { name: 'more than the stock', body: { items: [{ productId: 'p-candle', qty: 9 }] } },
  { name: 'discount as text', body: { items: [{ productId: 'p-softdrink', qty: 3 }], discountPercent: '20' } },
  // ... 8 more
];

async function characterize() {
  var app = await helpers.startApp();
  var results = [];
  for (var i = 0; i < CASES.length; i++) {
    var body = JSON.parse(JSON.stringify(CASES[i].body));
    body.createdAt = '2026-11-01T04:00:00.000Z'; // fixed, so the record never depends on the clock
    var r = await app.call('POST', '/api/orders', body);
    var shown = r.body;
    if (shown && shown.id) { shown = Object.assign({}, shown); delete shown.id; } // ids change every run
    var stocks = (await app.call('GET', '/api/products')).body.map(function (p) { return p.id + ':' + p.stock; });
    results.push({ name: CASES[i].name, status: r.status, body: shown, stocks: stocks.join(' ') });
  }
  app.close();
  return results;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the recorded behaviour of POST /api/orders (status, case, result)',
        code: `201  one item                                   total 25.05
201  two items, discount 10                     total 155.7
201  qty as text, like the web page sends it    total 24
201  same product on two lines                  total 127.5
201  on utang for a customer                    total 99
404  unknown customer                           customer not found
404  unknown product                            product not found: p-nope
400  no items                                   no items
400  qty zero                                   qty must be a whole number of at least 1
400  qty 1.5                                    qty must be a whole number of at least 1
409  more than the stock                        not enough stock for Kandila (only 8 left)
400  discount 101                               discountPercent must be between 0 and 100
201  discount as text                           total 36
400  discount negative                          discountPercent must be between 0 and 100`,
      },
      {
        type: 'paragraph',
        text: 'Read the list as a description of the route, written by the code itself. Notice what it records beyond the obvious: a quantity sent as the text `"2"` is accepted (the web page does that), and the same product on two lines is added together when checking stock. Those are behaviours a refactor could easily lose, and nobody wrote them down until now.',
      },
      { type: 'heading', text: 'Is the safety net any good? Break something on purpose' },
      {
        type: 'paragraph',
        text: 'A recording only protects what its cases exercise. The way to test the net is to **break the code deliberately and see whether the tests notice**. This is the idea behind mutation testing, done by hand. Change the discount rule from `discount <= 100` to `discount < 100`, so a 100 percent discount is wrongly refused, and run the tests.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the first 14 cases, with the discount boundary broken on purpose',
        code: `--- break one rule on purpose (discount <= 100 becomes < 100) ---
✔ POST /api/orders behaves exactly as recorded
...
ℹ tests 9
ℹ pass 9
ℹ fail 0`,
      },
      {
        type: 'paragraph',
        text: 'Every test passed. The net had a hole: there was a case for 101 percent and for a negative discount, but none for **exactly** 100. Boundaries are where inherited code usually hides bugs, so add them: a discount of exactly 100, a discount of 0, and an order for exactly all of the stock. The important detail is how you record them. Re-record from the **original** code, not the refactored code, otherwise you would be recording the new behaviour as if it were the old. Now break it again.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: 17 cases recorded from the original code, boundary broken again',
        code: `✖ POST /api/orders behaves exactly as recorded
  AssertionError: case "discount exactly 100 (a free order)" changed
  + actual - expected
    {
      body: {
  +     error: 'discountPercent must be between 0 and 100'
  -     createdAt: '2026-11-01T04:00:00.000Z',
  -     discountPercent: 100,
  ...
ℹ pass 8
ℹ fail 1`,
      },
      { type: 'heading', text: 'Now refactor: one kind of change at a time' },
      {
        type: 'paragraph',
        text: 'With the net in place, extract the rules into a function in a new file, `orders.js`. The function is **pure**: it receives the request and two lookup functions, returns either an error (with the HTTP status) or the order and the stock changes to make, and saves nothing. The route shrinks to the web part: call it, answer with an error, or apply the changes and save.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The order route after the refactor (the rules moved to orders.js)',
        code: `app.post('/api/orders', function (req, res) {
  var result = orderLogic.buildOrder(req.body, { getProduct: db.getProduct, getCustomer: db.getCustomer });
  if (result.error) {
    return res.status(result.error.status).json({ error: result.error.message });
  }
  // only now, with everything checked, take the items out of stock
  result.deductions.forEach(function (d) {
    d.product.stock = d.product.stock - d.qty;
    db.updateProduct(d.product);
  });
  res.status(201).json(db.addOrder(result.order));
});`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the refactor, checked',
        code: `$ npm test
✔ POST /api/orders behaves exactly as recorded      (17 cases, recorded from the old code)
... 9 tests in all
ℹ pass 9
ℹ fail 0

$ npm run smoke | tail -1
smoke: 8/8 passed

server.js: 332 lines before, 272 after.  orders.js: 76 lines.`,
      },
      {
        type: 'paragraph',
        text: 'Two points of craft. First, **one kind of change at a time**. If while extracting the function you also spot and fix a bug, the recording can no longer tell you whether a failing case is a mistake in the extraction or the intended fix. Commit the refactor alone, then fix in a second commit. Second, read the diff for small structural traps. While writing this step, the new file was first imported into `server.js` under the name `orders`, but several handlers in that file already declare their own `var orders = db.getOrders()`. JavaScript lets an inner variable hide an outer one with the same name, so the code would have worked by accident and confused every reader later. The name was changed to `orderLogic` before the tests ran. An AI will make this kind of slip too, and tests do not always catch it.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of tidying a recipe card without changing the dish. You write the recipe out again in a clearer order, but you cook it before and after and taste both. The *characterization test* is the tasting: you record exactly what the first dish was like (the spice, the saltiness), and the second must match. The route above now does just the “waiter” job: it takes the order from the customer (`req.body`), hands it to the kitchen (`buildOrder`), and brings back either a refusal (`result.error`) or a finished dish (`201`). The kitchen file never touches the door. A *pure function* is one that only works out an answer from what it is given and changes nothing in the world, which makes it easy to test.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Why a pure function helps.** `buildOrder` takes its collaborators as arguments (`getProduct`, `getCustomer`) instead of reaching into the database module. That is the seam from lesson 5 made smaller: you can now test every rule with plain objects, no server and no file, in microseconds. Later you can swap the JSON file for a real database and `buildOrder` does not change. When an AI proposes a refactor, ask what its seams are: where does I/O happen, and can the logic be called without it?',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**At scale.** Golden masters must be deterministic: strip or freeze ids, timestamps and ordering, and run each case in isolation, or you will chase flaky failures. They protect behaviour, including bugs, so mark each recorded oddity you intend to fix later and fix it in a separate change. For large migrations use incremental patterns: keep the old and new paths side by side behind a flag or an interface, move callers one at a time, compare outputs in shadow mode, then delete the old path (the strangler fig or branch-by-abstraction). Mutation testing tools automate the break-it-and-see check used above. AI agents are well suited to mechanical, behaviour-preserving transformations (renames, extractions, codemods) when each step is gated by the characterization suite and the PR contains only that step. To keep `git blame` useful after a mass reformat, list the commit in an ignore-revs file and use blame’s ignore option.',
      },
      {
        type: 'version',
        text: 'Claude Code’s common-workflows page has a refactor recipe: find deprecated usage, ask for suggestions, apply changes “while maintaining the same behavior”, then run tests, and it advises doing refactoring in small, testable increments. Codex’s prompting guide recommends committing or stashing first so you can compare changes cleanly, planning with “no user-visible behavior changes” and a rollback strategy, then implementing one milestone at a time and reviewing the diff of each. git blame has options to ignore chosen revisions (--ignore-rev and --ignore-revs-file). Checked on this date; tool features change often.',
        checked: CHECKED,
        sources: [DOCS.ccWorkflows, DOCS.codexPrompting, DOCS.gitBlame],
      },
      {
        type: 'takeaways',
        items: [
          'A refactor changes structure, not behaviour, so it needs a recording of the current behaviour first.',
          'A characterization test records what the code does today, bugs included. It protects behaviour; it does not judge it.',
          'Check the net by breaking the code on purpose: boundaries (exactly 100, exactly the stock) are the usual holes. Record new cases from the original code.',
          'One kind of change per commit: a refactor commit with no behaviour change, then separate commits for fixes and features.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-06-code-challenge-1',
          kind: 'code-challenge',
          title: 'Pull the rules out of the route',
          prompt: 'The route’s money rules are being moved into a function. Write orderTotal(lines, discountPercent): lines is a list of {price, qty}. Round each line (price times qty) to centavos with roundCents, add the lines and round the subtotal, then apply the discount as Math.round(subtotal * (100 - discountPercent)) / 100.',
          concept: 'extracting pure functions',
          language: 'javascript',
          starter: `function roundCents(amount) {
  return Math.round(amount * 100) / 100;
}

function orderTotal(lines, discountPercent) {
  // round each line, add them up, round the subtotal, then apply the discount
  return 0;
}`,
          solution: `function roundCents(amount) {
  return Math.round(amount * 100) / 100;
}

function orderTotal(lines, discountPercent) {
  var subtotal = 0;
  for (var i = 0; i < lines.length; i++) {
    subtotal = subtotal + roundCents(lines[i].price * lines[i].qty);
  }
  subtotal = roundCents(subtotal);
  return Math.round(subtotal * (100 - discountPercent)) / 100;
}`,
          tests: {
            kind: 'function',
            fn: 'orderTotal',
            cases: [
              { label: 'three Kape, no discount (float error removed)', args: [[{ price: 8.35, qty: 3 }], 0], expected: 25.05 },
              { label: 'two lines with 10 percent off', args: [[{ price: 58, qty: 2 }, { price: 9.5, qty: 6 }], 10], expected: 155.7 },
              { label: 'a 100 percent discount is free', args: [[{ price: 12, qty: 1 }], 100], expected: 0 },
              { label: '20 percent off softdrinks', args: [[{ price: 15, qty: 3 }], 20], expected: 36 },
            ],
          },
          hints: [
            'Use a loop to add roundCents(price * qty) for every line into a subtotal.',
            'Round the subtotal once more with roundCents before applying the discount.',
            'The last line is Math.round(subtotal * (100 - discountPercent)) / 100.',
          ],
          explanation: 'This is the shape of a safe extraction: the money rule becomes a small function you can test with plain numbers, and its answers match the ones the old route recorded (25.05, 155.7, 0 and 36).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-06-predict-output-1',
          kind: 'predict-output',
          title: 'Two variables with one name',
          prompt: 'This is the naming trap from the refactor in miniature: a handler declares its own orders while a module-level orders exists. What does it print? (In JavaScript a var is visible in its whole function, from the top.)',
          concept: 'variable shadowing',
          language: 'javascript',
          code: `var orders = 'module-level list';

function showOrders() {
  console.log(orders);
  var orders = 'local list';
  console.log(orders);
}

showOrders();
console.log(orders);`,
          choices: ['undefined\nlocal list\nmodule-level list', 'module-level list\nlocal list\nmodule-level list', 'module-level list\nlocal list\nlocal list', 'undefined\nlocal list\nundefined'],
          wrongNotes: {
            'module-level list\nlocal list\nmodule-level list': 'The var inside showOrders is hoisted to the top of that function, so the first console.log sees the local variable, which has no value yet. It does not fall back to the module-level one.',
            'module-level list\nlocal list\nlocal list': 'The local variable lives only inside showOrders. Outside, orders is still the module-level list.',
            'undefined\nlocal list\nundefined': 'The last line is outside the function, where the module-level variable is untouched.',
          },
          hints: [
            'A var is declared at the top of its function, even if the line that gives it a value comes later.',
            'At the first console.log the local orders exists but has no value yet.',
            'Inside the function you get undefined and then local list; outside it is the module-level list.',
          ],
          explanation: 'The local `var orders` hides the module-level one for the whole function and is undefined until its line runs. Code that works “by accident” like this is why the refactor renamed the import to orderLogic.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-06-scenario-1',
          kind: 'scenario',
          title: 'The refactor that fixed a bug',
          prompt: 'Choose what you do.',
          concept: 'one kind of change at a time',
          situation: 'You asked an agent to extract the order rules into a function. Its diff does that, and also changes the discount check to reject discounts of 100 because “a 100 percent discount is probably a mistake”. The characterization test now fails on the “discount exactly 100” case.',
          options: [
            { text: 'Ask the agent to undo the behaviour change, keep the refactor in one commit, and raise the 100 percent rule as its own change if the shop wants it.', consequence: 'The recording passes again, the refactor is provably behaviour-neutral, and the shop gets to decide the rule on purpose.', quality: 'best' },
            { text: 'Re-record the golden file so the test passes with the new behaviour.', consequence: 'The failing test was telling you something true. Re-recording hides a behaviour change inside a commit that is supposed to change nothing.', quality: 'poor' },
            { text: 'Keep both changes in one commit but describe the behaviour change in the commit message.', consequence: 'A message helps, but the refactor can no longer be reviewed or reverted on its own, and the net cannot vouch for it.', quality: 'acceptable' },
            { text: 'Delete the “discount exactly 100” case, since the agent has a reason.', consequence: 'You removed the very test that caught the unrequested change, and the net now has the hole you added the case to close.', quality: 'poor' },
          ],
          hints: [
            'What is a refactor commit supposed to promise?',
            'It promises no behaviour change. The failing case shows that promise is broken.',
            'Separate the two changes: refactor first, rule change as its own decision.',
          ],
          explanation: 'A refactor that passes its recording is a refactor you can trust. A failing recording is information, not an obstacle. Split the changes so each one can be reviewed, decided and reverted on its own.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-06-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words for refactoring',
          prompt: 'Tap each card after saying the meaning in your own words.',
          concept: 'refactoring vocabulary',
          cards: [
            { front: 'Refactor', back: 'Reorganising code so it is easier to read and change, without changing what it does.' },
            { front: 'Characterization test', back: 'A test that records what the code does today, so you notice if a change alters it.' },
            { front: 'Pure function', back: 'A function that only works out an answer from what it is given and changes nothing else, so it is easy to test.' },
            { front: 'Golden file', back: 'The saved recording of the old behaviour that new runs are compared against.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words describe the whole technique in this lesson.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-06-q1',
        prompt: 'Why record the code’s current behaviour before you refactor it?',
        choices: [
          'So the AI can learn from the recording and refactor more cleanly',
          'To prove to your client that the original code was correct',
          'Because without it you cannot tell whether the refactor changed what the code does',
          'Because Node.js will not run refactored code unless a recording exists for it',
        ],
        answer: 2,
        explanation: 'A refactor promises no change in behaviour. The recording is the only way to check the promise on code that has no tests.',
      },
      {
        id: 'improve-existing-ai-06-q2',
        prompt: 'You break the discount boundary on purpose and all recorded cases still pass. What does that tell you?',
        choices: [
          'The refactor is safe, because nothing the tests can see has changed and every recorded case still passes',
          'The recording has no case at that boundary, so the safety net has a hole to fill',
          'The test runner is broken and is not running your cases at all',
          'The boundary is not important, since no test depends on it',
        ],
        answer: 1,
        explanation: 'A recording only protects the inputs it contains. Breaking the code on purpose shows where it does not look, and a case for exactly 100 closes the hole.',
      },
      {
        id: 'improve-existing-ai-06-q3',
        prompt: 'Why does the characterization harness delete the order id and fix createdAt before comparing results?',
        choices: [
          'Because ids are secret and should never be written to a file',
          'Because a random id and the current time differ on every run, so the comparison would fail with no real change',
          'Because Express removes those fields from every response automatically',
          'Because the golden file would otherwise become too large to store in Git and slow down every clone of the project',
        ],
        answer: 1,
        explanation: 'A recording must be deterministic. Anything that legitimately changes on each run (ids, clocks) must be removed or frozen so a difference means a real change.',
      },
      {
        id: 'improve-existing-ai-06-q4',
        prompt: 'An agent’s refactor also contains a small bug fix. What is the best way to handle it?',
        choices: [
          'Keep it in the same commit, because fixing a bug while you are already in the file is efficient and saves a review',
          'Re-record the golden file so that the fix is included in the recording',
          'Ask the agent to remove the fix, commit the refactor alone, and make the fix a separate change with its own test',
          'Revert both and abandon the refactor, because the agent cannot be trusted with this file',
        ],
        answer: 2,
        explanation: 'Mixed changes cannot be reviewed or reverted separately, and the recording can no longer tell you what caused a failure. Two commits keep each promise clear.',
      },
      {
        id: 'improve-existing-ai-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does it mean to refactor code?',
        choices: [
          'To add a new feature that customers asked for',
          'To delete the code and write the whole program again from nothing',
          'To tidy up how the code is organised without changing what it does',
        ],
        answer: 2,
        explanation: 'Refactoring is like rewriting a recipe card more clearly while the dish stays the same.',
      },
      {
        id: 'improve-existing-ai-06-q6',
        audience: { min: 'advanced' },
        prompt: 'You must replace a 30,000-line billing module that production depends on. Which plan is soundest?',
        choices: [
          'Rewrite it in one branch over a few weeks and switch over when it is finished',
          'Freeze the old module and never touch it again, adding new behaviour only in new code',
          'Ask an agent to rewrite the module in one pass and rely on code review to find every difference between old and new behaviour across thirty thousand lines of billing logic',
          'Put old and new paths behind an interface, record the old behaviour, move callers across one at a time, compare outputs in shadow mode, then remove the old path',
        ],
        answer: 3,
        explanation: 'Incremental replacement keeps production on a working path at every step and lets recorded behaviour prove each move. A big-bang rewrite has no checkpoints and a huge review surface.',
      },
    ],
    task: {
      title: 'Record, then refactor one function',
      minutes: 22,
      steps: [
        'Choose one long function or route in your practice project that mixes request handling with rules. Write ten or more cases (include boundaries) and a harness that records the results to a file, with ids and times frozen or removed.',
        'Record from the current code, commit the recording, then break one rule on purpose and confirm that the test fails. If it does not, add the missing case and record again from the original code.',
        'Ask your AI tool to extract the rules into a pure function, with “change no behaviour and fix nothing else”. Run the tests and the smoke check.',
        'Read the diff for stray behaviour changes and naming traps (a new name hiding an old one). Commit the refactor on its own.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain, in plain words, what your new function does and what the route now does, and check that each explanation matches the code.'] },
      { audience: { min: 'advanced' }, steps: ['Run a mutation experiment on your suite: make three deliberate one-character breaks in the refactored code (a boundary, a sign, a default) and record how many your tests catch. Add cases until all three are caught.'] },
    ],
  },
  {
    id: 'improve-existing-ai-07',
    day: 7,
    title: 'Add tests to code that has none',
    summary: 'Decide what to test first, build a setup that cannot touch real data, let AI write tests, and check that those tests can actually fail.',
    minutes: 28,
    skills: ['write-tests-legacy'],
    intro: {
      objectives: [
        'Rank what to test first in an untested app by what a mistake would cost',
        'Set up tests that run against throwaway data and never depend on the clock',
        'Review AI-written tests by breaking the code on purpose and seeing whether they notice',
      ],
      why: 'AI writes tests as quickly as it writes code, and many of them look right while checking nothing. If you can tell a test that guards the shop from one that only decorates the report, tests become the safety net that lets you change things with confidence.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'In lesson 5 you wrote tests because a bug forced you to; in lesson 6 you recorded one route so you could refactor. Now the rest of the app: its routes, reports and edge cases that still have no tests at all. You will not test everything, and you should not try. A **test** is a small program that sets up a situation, does something and checks the result with an **assertion**, a statement that must be true or the test fails. The skill is choosing what to test, setting tests up so they cannot do harm, and noticing when a test (especially one an AI wrote) is not really testing anything.',
      },
      { type: 'heading', text: 'What to test first: by cost of being wrong' },
      {
        type: 'paragraph',
        text: 'With no tests, ask of each part of the app: if this were silently wrong, who would be hurt and how badly? Rank by that, not by how easy the code is to test. For a store, wrong money, wrong stock, wrong days and anything that deletes data come first. Start from the outside (the web routes, which is how the shop really uses the app), then pull rules into pure functions and unit test them cheaply, as lesson 6 did.',
      },
      {
        type: 'table',
        headers: ['Risk in Tindahan Orders', 'First test to write'],
        rows: [
          ['Wrong money (totals, discounts, rounding)', 'buildOrder with plain objects: subtotal, discount, centavos'],
          ['Wrong stock (oversell, void restocks twice)', 'Order more than is left; void twice and check stock'],
          ['Wrong day in reports', 'An order near midnight shop time lands on the right day'],
          ['Data loss (delete, void)', 'Delete a product that has orders; void an order then read the receipt'],
          ['Reports that others rely on', 'Daily, credit and top-products results for known data'],
        ],
        caption: 'The test list for the app, ranked by the cost of being wrong.',
      },
      { type: 'heading', text: 'A setup that cannot hurt the real data' },
      {
        type: 'paragraph',
        text: 'Tests create, change and delete things. If they ran against the real data file they would rewrite the shop’s stock. In this project `data.json` is even tracked in Git, so a careless test could overwrite the sample data every developer shares. The helper below copies a fixed fixture file to a temporary folder, points the app at it, and starts the app on a random free port, so every test file begins from the same known data and never sees the real file.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Fragment: the core of test/helpers.js',
        code: `async function startApp() {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tindahan-'));
  var file = path.join(dir, 'data.json');
  fs.copyFileSync(path.join(__dirname, 'fixture.json'), file); // a known starting point
  process.env.TINDAHAN_DB = file;                              // the app reads this, not the real file
  process.env.NODE_ENV = 'test';
  var app = require('../server');
  var server = await new Promise(function (resolve) {
    var s = app.listen(0, function () { resolve(s); });        // port 0 = any free port
  });
  // ... returns the base URL, a close() and a call(method, url, body) helper
}`,
      },
      {
        type: 'paragraph',
        text: 'Two more rules came from real mistakes in this project. **Never depend on the clock:** every test order gets an explicit `createdAt`, as the lesson 5 warning explained, so the tests behave the same today and next year. And **keep tests independent of order** where you can; where they share an app (as these do within one file), each test creates the data it needs.',
      },
      { type: 'heading', text: 'Coverage: a map of what no test touched' },
      {
        type: 'paragraph',
        text: 'The test runner can report **coverage**: which lines of your code ran while the tests ran. Use it as a map of the dark corners, not as a score. Here is the project before and after this lesson’s tests, using the same command on both versions (test files left out of the numbers).',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: node --test --experimental-test-coverage --test-coverage-exclude="test/**" "test/*.test.js"',
        code: `(before: 9 tests)
file      | line % | branch % | funcs % | uncovered lines
dates.js  | 100.00 |    66.67 |  100.00 |
db.js     |  74.29 |    85.19 |   75.00 | 11-14 39-46 57 71-73 83-90 102 114-124
orders.js | 100.00 |    96.97 |  100.00 |
server.js |  52.57 |    58.06 |   36.84 | 18 27-34 39-44 48-62 66-75 81-82 89 93-98 ...
all files |  67.00 |    79.79 |   58.97 |

(after: 29 tests)
file      | line % | branch % | funcs % | uncovered lines
dates.js  | 100.00 |    66.67 |  100.00 |
db.js     |  95.71 |    88.24 |  100.00 | 11-14 57 123
orders.js | 100.00 |   100.00 |  100.00 |
server.js |  91.18 |    76.81 |   80.95 | 18 39-44 68-69 118-122 141-142 176-177 187-188 267-270
all files |  94.00 |    85.00 |   90.24 |`,
      },
      {
        type: 'paragraph',
        text: 'Lines 27 to 34 and 48 to 62 of `server.js`, the product search and product creation, were dark before and are lit now. But 94 percent means only that 94 percent of the lines **ran**. A test that runs a line and asserts nothing lights it up just as well. Coverage tells you where to look; it cannot tell you whether anyone was watching.',
      },
      { type: 'heading', text: 'Let the AI write them, then try to break the code' },
      {
        type: 'prompt',
        label: 'A prompt for tests that are worth keeping',
        text: 'Write node:test tests for the three report routes in server.js, using test/helpers.js and the fixture. Rules: give every order an explicit createdAt (never use the current time); assert exact numbers and values, not just that a response exists; do not compute the expected answer with the same formula the code uses; each test should create the data it needs. For each test, say in a comment which line of server.js, if it were broken, this test would catch.',
      },
      {
        type: 'paragraph',
        text: 'AI-written tests fail in three recognisable ways. They **assert nothing specific** (“the response exists”). They **mirror the implementation** (the expected value is worked out with the code under test, so both are wrong together). Or they **depend on something unstable**: the clock, the order of tests, the real data. The cure for the first two is the same check you used in lesson 6: **break the code on purpose and see if the test fails**. Here is a vague test an assistant might write, next to the exact test from the project, run after deleting the “not voided” condition from the credit report.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the “not voided” check removed from the credit report, then both tests run',
        code: `✔ daily report adds up orders and groups by category
✔ daily report needs a date
✖ utang lists who owes, biggest first, and ignores paid and voided orders
✔ top products counts quantities and skips voided orders
✔ utang report works                         <- the vague test: assert.ok(r.body)

AssertionError: Expected values to be strictly equal:
348 !== 58`,
      },
      {
        type: 'paragraph',
        text: 'The vague test passes with a real bug in the code, because it only checks that something came back. The exact test fails with `348 !== 58`: Mario was charged for a ₱290 voided order. That difference is the whole value of a test. A cheap review rule for any AI-generated test is therefore: **make it fail once on purpose** by breaking the line it claims to protect, then put the line back.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A test is like checking the till against the receipts at closing time. You know what should be in the till (the *expected* answer), you count what is really there (the *actual* answer), and the *assertion* is you saying “these two must match”. Here is one real test from the project, line by line: it starts the app with the sample data; it asks for the credit report; it finds Mario’s row; and it says his debt must be 58 pesos. If the shop’s code ever changes so that the answer is not 58, the test shouts. A test that only asks “did I get *an* answer?” is like counting the till and saying “yes, there is money in it” without checking the amount. *Coverage* just shows which parts of the code were run during the tests, like highlighting the rooms of a house that someone walked through.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Arrange, act, assert.** Give every test the same three beats: arrange the data it needs (create the customer and the orders), act (call the route), assert (check the exact result). Keep each test to one reason to fail so its name explains the failure. When several tests build similar data, move the repeated steps into a small helper (like the `order()` function in the reports tests) so the test body shows only what is special about the case.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**Legacy test strategy.** Work from the outside in: characterization tests at the public boundary, then seams, then unit tests on extracted logic, and regression tests for every bug found. Make nondeterminism injectable (a clock parameter, seeded randomness, an isolated port and storage) rather than patching globals. Treat coverage as a gate on **changed lines** in CI, not an absolute target, and use mutation testing to estimate whether the suite detects faults at all. Property-based tests suit money and ordering rules. Set a review policy for generated tests: they must fail against a seeded fault, use fixed clocks, avoid mocking the unit under test, and be small enough to read. Quarantine flaky tests quickly with an owner and a deadline instead of retrying them, because retries hide real intermittent bugs.',
      },
      {
        type: 'version',
        text: 'Node.js 22 built-in test runner: node --test runs files matching its name patterns (or glob patterns you pass, quoted), and exits with code 1 if a test fails. Code coverage is experimental (Stability 1): node --test --experimental-test-coverage prints a table of line, branch and function coverage, and --test-coverage-exclude leaves out files matching a glob. Claude Code’s docs show a tests recipe (identify untested code, add tests that match your existing patterns, add edge cases, run and fix) and Codex’s prompting guide shows asking for a test that follows the conventions of the other tests and covers the happy path plus edge cases. GitHub’s Copilot best practices say to use automated tests and tooling to check Copilot’s work. Checked on this date; flags and tool features change.',
        checked: CHECKED,
        sources: [DOCS.nodeTest, DOCS.nodeCli, DOCS.ccWorkflows, DOCS.codexPrompting, DOCS.copilotBest],
      },
      {
        type: 'takeaways',
        items: [
          'Rank what to test by the cost of being wrong (money, stock, dates, deletions), starting from the outside edges of the app.',
          'Tests must run against throwaway data and fixed dates, so they cannot hurt the shop and give the same result any day.',
          'Coverage maps the lines no test reached; it does not say whether any test was actually checking something.',
          'Review AI-written tests by breaking the code on purpose: a test that still passes was not guarding the line it claims to.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-07-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write a characterization helper',
          prompt: 'characterize(fn, inputs) runs fn on each input and returns one line per input: the input as JSON, then " => ", then the result as JSON. If fn throws, write " => throws " followed by the error message instead. The helper check (already written) calls it for a discount function that rejects values outside 0 to 100.',
          concept: 'recording behaviour',
          language: 'javascript',
          starter: `function discountRate(percent) {
  if (percent < 0 || percent > 100) {
    throw new Error('bad discount ' + percent);
  }
  return percent / 100;
}

function check(inputs) {
  return characterize(discountRate, inputs);
}

function characterize(fn, inputs) {
  // for each input: try fn(input) and record "input => result";
  // if it throws, record "input => throws message"
  return [];
}`,
          solution: `function discountRate(percent) {
  if (percent < 0 || percent > 100) {
    throw new Error('bad discount ' + percent);
  }
  return percent / 100;
}

function check(inputs) {
  return characterize(discountRate, inputs);
}

function characterize(fn, inputs) {
  var lines = [];
  for (var i = 0; i < inputs.length; i++) {
    try {
      lines.push(JSON.stringify(inputs[i]) + ' => ' + JSON.stringify(fn(inputs[i])));
    } catch (e) {
      lines.push(JSON.stringify(inputs[i]) + ' => throws ' + e.message);
    }
  }
  return lines;
}`,
          tests: {
            kind: 'function',
            fn: 'check',
            cases: [
              { label: 'ordinary and rejected inputs', args: [[10, 150, 0]], expected: ['10 => 0.1', '150 => throws bad discount 150', '0 => 0'] },
              { label: 'a negative discount throws', args: [[-5]], expected: ['-5 => throws bad discount -5'] },
              { label: 'the boundary 100 is allowed', args: [[100, 101]], expected: ['100 => 1', '101 => throws bad discount 101'] },
              { label: 'no inputs gives no lines', args: [[]], expected: [] },
            ],
          },
          hints: [
            'Loop over inputs and build a lines array. Wrap each call in try and catch so one error does not stop the loop.',
            'In the try, push JSON.stringify(input) + " => " + JSON.stringify(fn(input)). In the catch, use e.message.',
            'Return the lines array at the end, and make sure the catch branch writes "throws " before the message.',
          ],
          explanation: 'This is a tiny golden-master recorder. The lines it returns are what you would save to a file and compare against after a refactor. Recording errors as well as results matters, because how code fails is behaviour too.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-07-scenario-1',
          kind: 'scenario',
          title: 'Reviewing a test an AI wrote',
          prompt: 'Choose your review move.',
          concept: 'reviewing AI-written tests',
          situation: 'An assistant writes eight tests for the report routes. All pass the first time and coverage jumps to 90 percent. Most of them end with `assert.ok(response.body)` or `assert.strictEqual(response.status, 200)`.',
          options: [
            { text: 'Break a line the tests claim to protect, such as the voided check, and see whether any test fails; then ask for exact assertions on the numbers.', consequence: 'If nothing fails you have proof the tests are decoration, and the exact assertions give you real protection.', quality: 'best' },
            { text: 'Accept them: they pass and coverage is high, which is what a test suite is for.', consequence: 'You now believe the reports are protected. A real bug in the totals would pass every one of these tests.', quality: 'poor' },
            { text: 'Ask the AI whether the tests are good and trust its answer.', consequence: 'It will probably say yes, with reasons. The question can only be answered by running the tests against broken code.', quality: 'poor' },
            { text: 'Read each test for exact assertions, without running anything.', consequence: 'Reading helps and will catch the vague ones, but you can miss a test that looks precise yet mirrors the implementation. Breaking the code settles it.', quality: 'acceptable' },
          ],
          hints: [
            'Passing tests and high coverage can both be true of tests that check nothing.',
            'What action would make a useless test reveal itself?',
            'Break the code on purpose and see if any test notices.',
          ],
          explanation: 'A test earns trust by failing when the code is wrong. Breaking a protected line on purpose is a thirty-second experiment that tells you more than the pass count and the coverage number together.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-07-match-1',
          kind: 'match',
          title: 'Name the test smell',
          prompt: 'Each description is a test an AI might write for Tindahan Orders. Pair it with what is wrong with it.',
          concept: 'test smells',
          labels: { terms: 'The test', meanings: 'What is wrong with it' },
          pairs: [
            { term: 'It asserts only that the credit report returned something', definition: 'It asserts nothing specific, so it passes for almost any output', note: 'A test has to check the actual values.' },
            { term: 'It creates an order “now” and expects it in today’s report', definition: 'It depends on the clock, so it can pass today and fail tomorrow', note: 'The result changes with the date the test is run.' },
            { term: 'It calls the app against the real data.json', definition: 'It touches real data and can change the shop’s stock', note: 'Tests must use a throwaway copy of known data.' },
            { term: 'It works out the expected total with the same formula the route uses', definition: 'It mirrors the implementation, so a wrong formula passes the test', note: 'The expected answer must come from somewhere independent, such as a number worked out by hand.' },
          ],
          hints: [
            'Ask what would have to be true for each test to fail.',
            'A test that checks nothing, depends on today, touches real data or copies the code under test is each a different smell.',
            'The vague assertion asserts nothing specific, “now” is the clock, data.json is real data, the shared formula is mirroring.',
          ],
          explanation: 'These four smells cover most bad tests an assistant produces. Naming them is how you ask for a better test: say which smell you see and what the test should check instead.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-07-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words for testing',
          prompt: 'Tap each card after saying the meaning in your own words.',
          concept: 'testing vocabulary',
          cards: [
            { front: 'Assertion', back: 'A statement in a test that must be true, such as “Mario owes 58”. If it is false, the test fails.' },
            { front: 'Fixture', back: 'A fixed set of sample data that every test starts from, so results are the same every time.' },
            { front: 'Coverage', back: 'A report of which lines of code ran during the tests. It shows what no test reached.' },
            { front: 'Regression', back: 'A problem that was fixed and then comes back. Tests exist to catch it early.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words let you read any test report.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-07-q1',
        prompt: 'An app has no tests and a limited afternoon. What should you test first?',
        choices: [
          'The simplest functions, because they take the least time to cover and push the coverage number up quickly',
          'Whatever the AI finds easiest to write tests for, since easy tests get written first',
          'The parts where a silent mistake costs the most: money, stock, dates and anything that deletes data',
          'The web page’s colours and layout, because users see those first',
        ],
        answer: 2,
        explanation: 'Rank by the cost of being wrong. A wrong total or a deleted record hurts the shop; an easy-to-test helper that nobody depends on does not.',
      },
      {
        id: 'improve-existing-ai-07-q2',
        prompt: 'Your suite reports 94 percent line coverage. What does that tell you?',
        choices: [
          'That 94 percent of the code is correct and the remaining six percent is where all of the bugs are',
          'That 94 percent of lines ran during the tests, though not necessarily that anything was checked',
          'That the application is safe to change without any further checks',
          'That six percent of the tests are failing at the moment',
        ],
        answer: 1,
        explanation: 'Coverage counts lines that executed. A test with no assertion executes lines just as well as a good one, so coverage shows gaps but never proves protection.',
      },
      {
        id: 'improve-existing-ai-07-q3',
        prompt: 'After removing the “not voided” check from the credit report, the vague test still passed and the exact test failed with 348 !== 58. What did this prove?',
        choices: [
          'The exact test is wrong, because a correct test would never fail on code that is working as it should',
          'Both tests are equally good, since each ran against the same route',
          'Voided orders are impossible to test because their totals change',
          'The vague test could not detect that bug, because it only checked that something came back',
        ],
        answer: 3,
        explanation: 'Only a test that fails when the code is wrong is guarding it. The break-it-on-purpose experiment separated the one that guards from the one that decorates.',
      },
      {
        id: 'improve-existing-ai-07-q4',
        prompt: 'Why does every test file copy a fixture to a temporary folder instead of using data.json?',
        choices: [
          'Because tests write to the data and the real file would be changed and shared with every developer',
          'Because Node.js cannot read a file that sits next to the server code',
          'Because temporary folders make the tests run in parallel on several computers at once, which finishes the suite faster',
          'Because Git refuses to commit a data file that a test has opened',
        ],
        answer: 0,
        explanation: 'Tests create, edit and delete records. A throwaway copy of known data keeps them from damaging the real file and gives each run the same starting point.',
      },
      {
        id: 'improve-existing-ai-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is an assertion in a test?',
        choices: [
          'A line that says “this answer must be exactly right, or the test fails”',
          'A message the program prints to thank the user for visiting',
          'A comment that explains the code to the next person who reads it, written above the function it describes',
        ],
        answer: 0,
        explanation: 'An assertion compares the real answer with the expected one, like checking the till against the receipts.',
      },
      {
        id: 'improve-existing-ai-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team now lets agents add tests to a legacy service. Which review policy protects you best?',
        choices: [
          'Require 90 percent coverage on the whole repository before any merge',
          'Require generated tests to fail against a seeded fault, use fixed clocks and isolated data, and gate coverage on changed lines',
          'Ban generated tests and have people write all tests by hand to be safe',
          'Merge generated tests if they pass twice in a row, and rerun any that flake until they pass, since flaky tests are usually harmless',
        ],
        answer: 1,
        explanation: 'The policy checks the property that matters (the test detects faults) and removes the usual sources of false confidence. Whole-repo coverage targets reward decorative tests, and retries hide real flakiness.',
      },
    ],
    task: {
      title: 'Cover the riskiest parts of your project',
      minutes: 22,
      steps: [
        'Write a short risk list for your project (money, stock or balances, dates, deletions) and pick the top three items.',
        'Build the safe setup: a fixture file copied to a temporary folder, the data path from an environment variable, a random port, and explicit dates in every test.',
        'Ask your AI tool for tests for those three areas using the prompt from this lesson, then run node --test with coverage and note what stays uncovered.',
        'For each AI-written test, break the line it claims to protect and confirm it fails. Fix or delete any test that does not, and commit the rest.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain one of its tests line by line in plain words, including what the expected value is and where the number came from. Check the number by hand.'] },
      { audience: { min: 'advanced' }, steps: ['Make the clock injectable in one function (pass the current time in as an argument), delete the global patching, and write the test with two fixed instants either side of midnight in your business time zone.'] },
    ],
  },
  {
    id: 'improve-existing-ai-08',
    day: 8,
    title: 'Update dependencies safely',
    summary: 'Read what is outdated and vulnerable, update inside the allowed range first, read the changelog before any major step and change one package at a time.',
    minutes: 28,
    skills: ['update-dependencies'],
    intro: {
      objectives: [
        'Read npm outdated and npm audit, and explain what Current, Wanted and Latest mean',
        'Update a package inside its allowed range, one at a time, with a test run after each',
        'Decide what to do about a major version: read the changelog, check your own usage and try it on a throwaway branch',
      ],
      why: 'An inherited project comes with years of aging dependencies and a security report. Updating them blindly with an AI one-liner is how a working app stops working; doing it package by package with checks is routine, fast and safe.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **dependency** is code other people wrote that your project borrows: Express to run the web server, morgan to log requests, uuid to make ids. They are listed in `package.json`, and each one has its own dependencies. Jun installed them in 2021, so Tindahan Orders is running 2021’s versions of everything. Over time dependencies collect security fixes and deprecations, and an old project falls behind. Updating is risky for a simple reason: you are replacing code you will never read, and the change shows up as hundreds of lines in a file nobody reviews. The routine in this lesson makes it safe: look, update inside the allowed range, one package at a time, test after each, and read the notes before any big jump.',
      },
      { type: 'heading', text: 'Three files, three jobs, and what the numbers mean' },
      {
        type: 'list',
        items: [
          '**package.json** says which versions you are willing to accept, as ranges, such as `"express": "^4.17.1"`.',
          '**package-lock.json** records the exact version that was actually installed for every package, including the dependencies of your dependencies. Commit it: it is what makes your teammate’s install and the server’s install identical to yours.',
          '**node_modules** is the installed copy. It is rebuilt from the other two and is never committed.',
        ],
      },
      {
        type: 'paragraph',
        text: 'A version number like `4.17.1` is **MAJOR.MINOR.PATCH** under semantic versioning. A patch is a bug fix, a minor adds features without breaking anything, and a major is allowed to break things. The caret in `^4.17.1` means “4.17.1 or newer, but stay on major 4”. A tilde `~4.17.1` is stricter: patches only. A bare `4.17.1` is exactly that. For versions starting with 0 the rules tighten, because anything may change at 0.x. These results come from npm’s own semver checker.',
      },
      {
        type: 'table',
        headers: ['Range', 'Version', 'Allowed?'],
        rows: [
          ['^4.17.1', '4.22.3', 'yes: same major, newer'],
          ['^4.17.1', '5.3.0', 'no: a new major'],
          ['^4.17.1', '4.17.0', 'no: older than the range starts'],
          ['~4.17.1', '4.17.9', 'yes: patches only'],
          ['~4.17.1', '4.18.0', 'no: a new minor'],
          ['^0.2.3', '0.3.0', 'no: for 0.x the minor is the breaking part'],
          ['4.17.1', '4.17.2', 'no: exactly one version'],
        ],
        caption: 'What a range allows, checked with npm’s semver library.',
      },
      { type: 'heading', text: 'Step 1: look before you touch' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the practice project as received',
        code: `$ npm outdated
Package  Current  Wanted  Latest  Location              Depended by
express   4.17.1  4.22.3   5.3.0  node_modules/express  tindahan
morgan    1.10.0  1.12.1  1.12.1  node_modules/morgan   tindahan
uuid       8.3.2   8.3.2  14.0.3  node_modules/uuid     tindahan
(exit code 1)

$ npm audit | tail -4
10 vulnerabilities (4 low, 2 moderate, 4 high)`,
      },
      {
        type: 'paragraph',
        text: '**Current** is installed. **Wanted** is the newest version your range allows. **Latest** is the version the registry tags as latest, which may be a new major your range blocks. The exit code 1 is how `npm outdated` says “something is outdated”, useful in scripts. So express can safely move from 4.17.1 to 4.22.3, and the 5.3.0 is a separate decision. uuid is stuck at 8.3.2 even though 14 exists, because `^8.3.2` forbids a new major.',
      },
      { type: 'heading', text: 'Step 2: update inside the range, one package at a time' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: npm update express, then the checks',
        code: `$ git switch -c chore/update-deps
$ npm update express
added 24 packages, removed 1 package, changed 21 packages, and audited 79 packages in 2s
3 vulnerabilities (1 low, 2 moderate)

$ git diff --stat
 package-lock.json | 629 +++++++++++++++++++++++++++++++++++-------------
 1 file changed, 501 insertions(+), 128 deletions(-)
$ git diff package.json
(nothing)

$ npm test     -> tests 29, pass 29, fail 0
$ npm run smoke | tail -1
smoke: 8/8 passed`,
      },
      {
        type: 'paragraph',
        text: 'Read the result carefully. `package.json` did not change, because by default `npm update` moves to the newest version inside the range without rewriting the range. The lockfile changed by 629 lines, because Express brought new versions of its own dependencies. That is the update. The audit dropped from 10 findings to 3 with no change to your code, and your 29 tests and the smoke check still pass. Commit the lockfile on its own, then repeat for `morgan` (1.10.0 to 1.12.1). One package per commit means that if something breaks, `git log` tells you exactly which update did it. Express’s own release history for this jump shows security fixes and some small behaviour changes (for example, the default depth for urlencoded bodies in 4.20), which is why the tests and the changelog matter even for “safe” updates.',
      },
      { type: 'heading', text: 'Step 3: a flagged package you do not have to upgrade' },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: what is left after the in-range updates',
        code: `$ npm audit
uuid  <11.1.1
Severity: moderate
uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided
fix available via \`npm audit fix --force\`
Will install uuid@14.0.3, which is a breaking change

$ npm install uuid@8.3.2   (earlier, on a fresh install)
npm warn deprecated uuid@8.3.2: uuid@10 and below is no longer supported.
For ESM codebases, update to uuid@latest. For CommonJS codebases, use uuid@11
(but be aware this version will likely be deprecated in 2028).`,
      },
      {
        type: 'paragraph',
        text: 'Do not run `npm audit fix --force` on the strength of that message: it installs the new major without reading anything. Read the advisory. The bug affects uuid versions 3, 5 and 6 when a buffer is passed in. Tindahan Orders calls only `uuid.v4()` with no buffer, so it is not exploitable here. The deprecation notice is the more useful clue: it recommends uuid 11 for CommonJS code, and uuid’s changelog shows version 12 removed CommonJS support entirely, so newer uuid is an ES-module-only package. (On the Node 22 used here, `require()` of such a package happens to work, which was tried; on an older Node, such as the one a 2021 server may still run, it can fail to load.) Upgrading to the latest would tie the shop to a newer Node or push you to convert the project to ES modules, a bigger job than the dependency is worth. There is a better option: the project used uuid for one thing, random version 4 ids, and Node itself now does that with `crypto.randomUUID()`. The cheapest dependency to maintain is the one you delete.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: replacing the package with the built-in',
        code: `$ git diff db.js
-var uuid = require('uuid');
+var crypto = require('node:crypto');
...
 function newId() {
-  return uuid.v4();
+  return crypto.randomUUID();
 }

$ npm uninstall uuid
removed 1 package, and audited 74 packages in 459ms
found 0 vulnerabilities

$ npm test   -> tests 30, pass 30   (a new test checks ids are version 4 UUIDs)`,
      },
      { type: 'heading', text: 'Step 4: a major version (Express 5) is its own project' },
      {
        type: 'paragraph',
        text: '`npm outdated` still says Latest is Express 5.3.0. A major version may break your code, so the move is: read the migration guide, **check your own usage** for each breaking change, then try it on a throwaway branch. The guide lists the removals (`app.del`, `req.param`, the old status-first argument forms, wildcard route syntax now needing a name, `req.body` being undefined when no parser ran) and says Node 18 or newer is required.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: checking the project against the guide, then trying Express 5 on a throwaway branch',
        code: `$ grep -n "app.del\\|req.param(\\|res.sendfile\\|redirect(.back" server.js
(no match: none of the removed calls is used)

$ grep -nE "app\\.(get|post|put|delete|use)\\('[^']*[*?(]" server.js
(no match: no route path uses a wildcard, an optional part or a group)

$ git switch -c scratch/express5 && npm install express@5
$ npm ls express          ->  express@5.3.0
$ npm test                ->  tests 30, pass 30, fail 0
$ npm run smoke           ->  smoke: 8/8 passed
$ curl localhost:3100/    ->  200

$ git switch chore/update-deps && git branch -D scratch/express5
$ npm ci                  (rebuilds node_modules exactly from the lockfile)`,
      },
      {
        type: 'paragraph',
        text: 'Express 5 passed everything here, which is good news, but it still should not ride along with this pull request. The tests do not cover the static web page or request logging, a major upgrade deserves its own review and manual check in a browser, and keeping it separate means it can be reverted alone. Notice the last command: `npm ci` throws away `node_modules` and reinstalls exactly what the lockfile says, which is how servers and CI should install and how you reset after an experiment.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** `package.json` is your **shopping list** (“I need eggs, any brand from this supplier”). `package-lock.json` is the **receipt** (“you actually got these exact eggs”). Anyone following the receipt gets the same eggs, which is why the receipt is saved with the project. A version like `4.17.1` is three counters: the first goes up when the maker changes something that can break your code, the middle when they add something new, the last when they fix a small mistake. The little `^` says “newer is fine, but do not cross to a new first number”. When you ran `npm update express`, npm went to the shop, took the newest eggs that match your list, and wrote a new receipt, and your list stayed the same.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Is it reachable?** Not every audit finding is a real risk. For each one, ask: is the vulnerable function used by my code (here, uuid’s buffer form was not), is it reachable from untrusted input, and is it a direct dependency or something buried under another package? Fix what is exploitable first, then reduce the list. Also learn to read the dependency tree (`npm ls` shows who requires what) so that when a deep package is flagged you know which direct dependency brings it in.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**Supply chain and policy.** Treat the lockfile as a security artefact: install with `npm ci` in CI and production, review lockfile diffs in pull requests, and watch for packages that add install scripts or change maintainers. Automate with a bot such as Dependabot, but keep majors out of automatic merging and give each update PR the same gates as human work: required checks, a changelog summary and an owner. Dependabot waits three days after a release by default before a version update, while security updates are not subject to that cooldown. For a transitive vulnerability with no upstream fix, use `overrides` temporarily and track removal. Align runtime support (the Node version in `engines`) with what your dependencies require, stage rollouts, and when an AI agent proposes an upgrade ask it to read the changelog, list breaking changes against your own usage with evidence from search and tests, and never accept `--force` without that.',
      },
      {
        type: 'version',
        text: 'npm (v11 docs): npm outdated shows Current, Wanted (the highest version your range allows) and Latest (the registry’s latest tag); npm update moves packages to the newest version satisfying your range and does not change the ranges in package.json unless you pass --save; package-lock.json records the exact tree and is meant to be committed; npm ci installs from it exactly; npm audit reports known vulnerabilities. The output above came from npm 12.0 on Node.js 22.23, whose exit code for outdated packages was 1. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.npmOutdated, DOCS.npmUpdate, DOCS.npmLock, DOCS.npmCi, DOCS.npmAudit, DOCS.npmSemver],
      },
      {
        type: 'version',
        text: 'Express: the 4.x release history shows fixes and behaviour changes between 4.17.1 and 4.22.3 (for example a default depth limit for urlencoded bodies in 4.20.0); the Express 5 migration guide requires Node.js 18 or newer and lists removed APIs and the new path syntax. uuid: its changelog records that version 12.0.0 removed CommonJS support and 14.0.0 requires a global crypto (Node 20+). Node.js 22 provides crypto.randomUUID(), which returns a version 4 UUID. GitHub’s Dependabot opens pull requests for outdated dependencies, configured in dependabot.yml, with a default three-day cooldown for version updates. Checked on this date; versions change often.',
        checked: CHECKED,
        sources: [DOCS.expressHistory, DOCS.expressMigrate, DOCS.uuidChangelog, DOCS.nodeCrypto, DOCS.dependabot],
      },
      {
        type: 'takeaways',
        items: [
          'package.json is the range you accept, the lockfile is the exact versions installed; commit the lockfile and install with npm ci.',
          'Update inside the range first (npm update), one package per commit, with the tests and a smoke check after each.',
          'Read audit advisories and deprecation notices instead of running audit fix --force; sometimes the best update is removing the dependency.',
          'Treat a major version as its own change: read the migration guide, check your own usage, try it on a throwaway branch, and ship it separately.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-08-code-challenge-1',
          kind: 'code-challenge',
          title: 'Does the caret allow it?',
          prompt: 'Write allowedByCaret(range, version) for ranges of the form "^MAJOR.MINOR.PATCH" with a major of 1 or more. A version is allowed when it has the same major as the range and is not older than the range’s version. Both arguments are text such as "^4.17.1" and "4.22.3".',
          concept: 'semantic version ranges',
          language: 'javascript',
          starter: `function allowedByCaret(range, version) {
  // range looks like "^4.17.1": drop the caret, split both on ".", compare as numbers
  return false;
}`,
          solution: `function allowedByCaret(range, version) {
  var wanted = range.slice(1).split('.').map(Number);
  var have = version.split('.').map(Number);
  if (have[0] !== wanted[0]) return false;
  if (have[1] !== wanted[1]) return have[1] > wanted[1];
  return have[2] >= wanted[2];
}`,
          tests: {
            kind: 'function',
            fn: 'allowedByCaret',
            cases: [
              { label: 'newer minor, same major', args: ['^4.17.1', '4.22.3'], expected: true },
              { label: 'a new major is blocked', args: ['^4.17.1', '5.3.0'], expected: false },
              { label: 'older patch is below the range', args: ['^4.17.1', '4.17.0'], expected: false },
              { label: 'older minor is below the range', args: ['^1.10.0', '1.9.9'], expected: false },
              { label: 'the exact version itself', args: ['^8.3.2', '8.3.2'], expected: true },
              { label: 'much newer minor', args: ['^1.0.0', '1.99.0'], expected: true },
            ],
          },
          hints: [
            'Remove the first character (the caret), then split on "." and turn the pieces into numbers.',
            'If the majors differ the answer is false. If the minors differ, the version must have the larger minor.',
            'When major and minor are equal, the version’s patch must be at least the range’s patch.',
          ],
          explanation: 'This is what npm does when it decides which versions a range allows. The same rule explains why ^8.3.2 never offers uuid 9 and why Wanted and Latest can differ.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-08-arrange-1',
          kind: 'arrange',
          title: 'Update one dependency safely',
          prompt: 'Put the routine for updating Express inside its range in order, first step at the top.',
          concept: 'safe dependency updates',
          language: 'text',
          solution: [
            'git switch -c chore/update-deps',
            'npm outdated, then npm audit, to see what is old and what is flagged',
            'npm update express',
            'npm test, then npm run smoke',
            'git add -A and commit the lockfile change by itself',
            'Repeat the same steps for the next package, one at a time',
          ],
          reasons: [
            'A branch keeps main clean while you experiment.',
            'You read the situation before changing anything, so you know the starting point.',
            'The update moves one package to the newest version inside its range.',
            'Checks run on the updated code before it is saved.',
            'A commit per package means a failure points to one update.',
            'Only after one update is checked and saved do you move to the next.',
          ],
          hints: [
            'Which two steps should come before any package changes?',
            'The commit comes after the checks pass, and each package gets its own.',
            'Branch, look, update, check, commit, repeat.',
          ],
          explanation: 'Branch, look, update one package, check, commit, repeat. One package per commit is what makes a regression traceable to a single update.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-08-scenario-1',
          kind: 'scenario',
          title: 'npm audit says “fix --force”',
          prompt: 'Choose what you do.',
          concept: 'reading audit output',
          situation: 'After your in-range updates, npm audit still lists one moderate finding in uuid and suggests npm audit fix --force, which installs uuid 14, “a breaking change”. Your code calls uuid.v4() once, and the project is CommonJS.',
          options: [
            { text: 'Read the advisory and the changelog, see that your use is not affected and that the new major drops CommonJS, then remove the dependency in favour of crypto.randomUUID().', consequence: 'The finding is gone, the dependency is gone, ids are the same kind, and no part of the project needed converting.', quality: 'best' },
            { text: 'Run the --force command: npm knows best, and the tests will tell you if something broke.', consequence: 'It installs and may even run on your laptop’s Node 22, but you have just made the shop depend on a package that dropped CommonJS and on a newer Node, with nothing read and nothing decided.', quality: 'poor' },
            { text: 'Ignore the finding for now because the app is small.', consequence: 'Not reachable here, so it is low risk today, but the deprecation warning stays and the next audit repeats the question without an answer written down.', quality: 'acceptable' },
            { text: 'Delete package-lock.json and reinstall so npm picks fresh versions.', consequence: 'You throw away the record of exactly what was working and now have dozens of changes in one go, none of which you read.', quality: 'poor' },
          ],
          hints: [
            'What does the advisory say, and does your code do that?',
            'The changelog tells you what the new major breaks, and the deprecation message points to a CommonJS-safe path.',
            'Check reachability, read what the major breaks, then pick the smallest change: here, drop the dependency.',
          ],
          explanation: 'An audit finding is a question, not a command. Read what is affected, check your own use, and choose the smallest safe change. --force skips all of that reading.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-08-match-1',
          kind: 'match',
          title: 'What may npm update install?',
          prompt: 'Each line of package.json asks for a different amount of freedom. Pair each range with what npm update is allowed to install.',
          concept: 'semver ranges',
          labels: { terms: 'The range', meanings: 'What it allows' },
          pairs: [
            { term: '"express": "^4.17.1"', definition: 'Any 4.x.y from 4.17.1 upward, never 5.0.0', note: 'The caret keeps the major fixed.' },
            { term: '"express": "~4.17.1"', definition: 'Only 4.17.x patches, from 4.17.1 upward', note: 'The tilde keeps the minor fixed as well.' },
            { term: '"express": "4.17.1"', definition: 'Exactly 4.17.1 and nothing else', note: 'No symbol means exactly that version.' },
            { term: '"thing": "^0.2.3"', definition: 'Only 0.2.x from 0.2.3, because in 0.x the minor can break things', note: 'For 0.x versions the caret is stricter than for 1.x and above.' },
          ],
          hints: [
            'The caret fixes the first number, the tilde fixes the first two, no symbol fixes all three.',
            'A version starting with 0 is treated as unstable, so the caret fixes the minor too.',
            '^4.17.1 allows 4.x, ~4.17.1 allows 4.17.x, 4.17.1 is exact, and ^0.2.3 allows 0.2.x.',
          ],
          explanation: 'The symbol in front of a version is a promise about how much change you accept. A tighter range means fewer surprises and more manual updates; a looser one means more automatic fixes and more risk.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-08-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words for dependencies',
          prompt: 'Tap each card after saying the meaning in your own words.',
          concept: 'dependency vocabulary',
          cards: [
            { front: 'Dependency', back: 'Code written by others that your project borrows, such as Express.' },
            { front: 'Lockfile', back: 'package-lock.json: the receipt of the exact versions installed, kept so everyone gets the same ones.' },
            { front: 'Major version', back: 'The first number of a version. When it goes up, the maker says things may break.' },
            { front: 'Vulnerability', back: 'A known weakness in a version of a package that someone could use to attack your app.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words are enough to read npm outdated and npm audit.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-08-q1',
        prompt: 'After npm update express, package.json is unchanged but package-lock.json has changed by hundreds of lines. Why?',
        choices: [
          'npm made a mistake and wrote the changes to the wrong file',
          'The update moves to the newest version the existing range allows, so only the lockfile records the new exact versions',
          'npm update only ever changes the lockfile and never installs anything new into node_modules, so nothing on disk really changes',
          'The lockfile is regenerated from scratch on every command that npm runs',
        ],
        answer: 1,
        explanation: 'The range in package.json still allows the new version, so there is nothing to rewrite there. The lockfile records exactly what was installed, including packages Express depends on.',
      },
      {
        id: 'improve-existing-ai-08-q2',
        prompt: 'npm outdated shows Wanted 4.22.3 and Latest 5.3.0 for express. What do those columns tell you?',
        choices: [
          'Wanted is the newest version your range allows, and Latest is the registry’s newest tag, here a major your range blocks',
          'Wanted is the version most people use, and Latest is the version you installed on your own machine last time, according to the registry',
          'Wanted is the newest version, and Latest is the safest one to choose',
          'Both columns show the version that npm update will install',
        ],
        answer: 0,
        explanation: 'Wanted is bounded by your range, Latest is not. When they differ, a major version is waiting, and that is a separate decision.',
      },
      {
        id: 'improve-existing-ai-08-q3',
        prompt: 'Why was removing uuid better than upgrading it to the latest version in this project?',
        choices: [
          'Because newer versions of uuid are slower than older ones',
          'Because Git cannot track a change to a package version',
          'Because the project only needed random v4 ids, which Node’s crypto.randomUUID() makes, and the latest uuid dropped CommonJS',
          'Because npm audit never reports problems for built-in modules and so it would hide them from the list for good and from every later audit',
        ],
        answer: 2,
        explanation: 'The package was used for one thing the platform now does itself. Removing it closed the finding and the deprecation warning without converting the project to ES modules.',
      },
      {
        id: 'improve-existing-ai-08-q4',
        prompt: 'All 30 tests and the smoke check pass with Express 5. Why keep the Express 5 upgrade out of the pull request that updates the in-range packages?',
        choices: [
          'Because tests are not allowed to run against a major version',
          'Because Express 5 is not yet available to install for Node.js 22',
          'Because a major upgrade changes more than the tests can see, so it needs its own review, a manual check and an easy revert',
          'Because the lockfile can only be changed once in each pull request, and the earlier updates in this one have already used that change up',
        ],
        answer: 2,
        explanation: 'The tests cover the API, not the static page or logging. A separate change can be reviewed on its own and reverted without losing the safe updates.',
      },
      {
        id: 'improve-existing-ai-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is package-lock.json?',
        choices: [
          'A secret password file that protects the project from hackers',
          'A copy of every picture used in the web page',
          'A receipt that records the exact versions installed, so everyone gets the same ones',
        ],
        answer: 2,
        explanation: 'package.json is the shopping list of what you accept, and the lockfile is the receipt of what you actually got.',
      },
      {
        id: 'improve-existing-ai-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A bot opens thirty dependency-update pull requests in a week for a production service. Which policy keeps it safe and manageable?',
        choices: [
          'Auto-merge everything that passes the tests, because tests are enough to catch every problem a dependency could cause in production',
          'Turn the bot off, and update dependencies once a year by hand',
          'Merge only security updates and ignore all other updates until they become urgent',
          'Keep majors out of auto-merge, require CI, a changelog summary and an owner on every update, and review lockfile diffs',
        ],
        answer: 3,
        explanation: 'Small frequent updates are cheaper than a yearly big one, but only if each carries the same gates as human work and majors get human attention. Passing tests alone cannot see behaviour changes the suite does not cover.',
      },
    ],
    task: {
      title: 'Update your project’s dependencies, one at a time',
      minutes: 22,
      steps: [
        'On a branch, run npm outdated and npm audit in your practice project. Write down the Current, Wanted and Latest of each package and the severity counts.',
        'Update each package inside its range with npm update <name>, running your tests and smoke check and making a commit after every package.',
        'Pick one flagged or outdated package with a major update waiting. Read its changelog or migration guide, search your code for each breaking change, and try the major on a throwaway branch. Decide whether to ship it separately.',
        'Run npm audit again and record the before and after counts. Delete the throwaway branch and run npm ci to confirm you can rebuild from the lockfile.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain each line of npm outdated in plain words for your project, then check the explanation of Wanted against your package.json range.'] },
      { audience: { min: 'advanced' }, steps: ['Write the dependency policy for your repository in five lines: what auto-merges, what needs review, how majors are handled, how security updates are treated and who owns the lockfile. Add it to your instructions file.'] },
    ],
  },
  {
    id: 'improve-existing-ai-09',
    day: 9,
    title: 'Make it faster and lighter',
    summary: 'Measure first with a repeatable benchmark, find where the time really goes, change one thing at a time and measure again.',
    minutes: 28,
    skills: ['measure-performance'],
    intro: {
      objectives: [
        'Build a repeatable measurement (same data, warm-up, median) before changing anything',
        'Find the real cause of slowness by counting work and profiling, not by guessing',
        'Prove a speed-up with before and after numbers and show that the answers did not change',
      ],
      why: 'When you tell an AI “make it faster” it adds a cache and a paragraph of confidence. Real speed-ups come from measuring, finding the one loop that wastes the time, and proving the fix, which is also the evidence a client wants to see.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The shop owner says the daily report “takes forever” now that the app holds a year of orders. “Forever” is not a number, and you cannot improve what you have not measured. Programmers are famously bad at guessing what is slow, and AI assistants are worse, because their favourite answers (add a cache, use a faster library) fit any program. The method is always the same: **measure first, change one thing, measure again, and check the answers did not change.** Two words you will need. **Latency** is how long a request takes, in milliseconds (ms; 1000 ms is one second). **Payload** is how many bytes the server sends back. A page can be slow because the server works too long, or because it sends far more than it shows.',
      },
      { type: 'heading', text: 'Step 1: a measurement you can repeat' },
      {
        type: 'paragraph',
        text: 'First create realistic load: `node seed.js 3000` fills the data file with 3000 orders (a 1.6 MB file). Then write a small benchmark that calls each endpoint repeatedly and prints the **median** time, the slowest time and the response size. Three rules make the numbers trustworthy. Use the **same data** every run. **Warm up** with a few uncounted calls, because the first calls are slower. And report the **median**, not the average, because one slow outlier ruins an average and barely moves a median.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Fragment: the timing loop of bench/bench.js',
        code: `for (var i = 0; i < 18; i++) {
  var start = performance.now();
  var res = await fetch('http://localhost:' + PORT + targets[t]);
  var text = await res.text();
  var ms = performance.now() - start;
  bytes = text.length;
  if (i >= 3) times.push(ms);        // the first 3 calls are warm-up and are not counted
}
console.log(targets[t].padEnd(36) + median(times).toFixed(1).padStart(10) + Math.max.apply(null, times).toFixed(1).padStart(12) + String(bytes).padStart(10));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the baseline with 3000 orders',
        code: `endpoint                             median ms  slowest ms     bytes
/api/report/daily?date=2026-10-15        973.5      1046.1       127
/api/report/utang                         18.9        19.9       219
/api/report/top-products                   6.6         7.5       155
/api/orders                               10.5        11.4    914733
/api/products                              6.2         7.1       946`,
      },
      {
        type: 'paragraph',
        text: 'Now “forever” has a number: the daily report takes almost a second, and it is the only slow request. The others are fine, so there is no reason to touch them. Also look at the last column: `/api/orders` is quick but sends 914,733 bytes (about 0.9 MB), and the web page uses ten of those orders. That is a payload problem, the “lighter” half of the lesson.',
      },
      { type: 'heading', text: 'Step 2: find where the time goes' },
      {
        type: 'paragraph',
        text: 'Do not guess; count. The data layer reads and parses the **whole** file on every call, so a cheap measurement is how many times one request reads the file. A tiny script wraps the file-reading function and counts.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: how many times one request reads the data file',
        code: `/api/report/daily?date=2026-10-15 -> data file read 201 times
/api/report/utang                 -> data file read 4 times
/api/report/top-products          -> data file read 1 times

orders that day: 100 orders, 200 order lines`,
      },
      {
        type: 'paragraph',
        text: 'There is the cause, in one line of output: 201 reads for 100 orders with 200 lines. That is 1 read for the orders plus one more for every order line, because the report looks up each line’s product with `db.getProduct`, and `getProduct` reads and parses 1.6 MB each time. This pattern has a name, **N+1**: one request to get a list, then one more request per item in it. Search for it whenever a loop calls something that does I/O.',
      },
      { type: 'heading', text: 'Step 3: fix the biggest cost, then measure again' },
      {
        type: 'code',
        language: 'javascript',
        label: 'Fragment: the daily report reads the products once and looks them up by id',
        code: `var orders = db.getOrders();
// read the products once and look them up by id, instead of re-reading the file per order line
var categoryOf = {};
db.getProducts().forEach(function (p) {
  categoryOf[p.id] = p.category;
});
// ... inside the loop over each order line:
var cat = categoryOf[o.items[j].productId] || 'unknown';`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: reads and median after the first fix (utang report also reduced to a single pass)',
        code: `/api/report/daily?date=2026-10-15 -> data file read 2 times
/api/report/utang                 -> data file read 2 times

/api/report/daily?date=2026-10-15        108.6       146.0       127
/api/report/utang                         10.7        11.2       219`,
      },
      {
        type: 'paragraph',
        text: 'From 201 reads to 2, and 973 ms down to 108 ms, about nine times faster. A less careful process would stop there. But 108 ms for 3000 orders is still more than two cheap file reads explain, so **measure again, and find the next cost**. A profiler records where a program spends its time; Node has one built in (`node --cpu-prof`). Run it on the work the report does for each order.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: node --cpu-prof, the functions with the most self time',
        code: `  125.4 ms  shopDay dates.js:4
   25.2 ms  (program)
    5.0 ms  loader
    3.2 ms  (garbage collector)`,
      },
      {
        type: 'paragraph',
        text: 'The slow part is `shopDay`, the function from lesson 5 that answers “which day is this order in Manila?”. **The previous lesson’s own fix** was now the bottleneck: it built a new date formatter for every one of the 3000 orders, and building a formatter is the expensive step. The fix is to build it once and reuse it. Before trusting it, prove it gives the same answers: run the old and new functions over all 3000 real timestamps and five awkward inputs, including an invalid date and an empty string.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the shopDay change, timed and compared',
        code: `3000 orders -> shopDay took 109.9 ms (100 matched)     (before)
3000 orders -> shopDay took 3.4 ms (100 matched)       (after: formatter built once)
old vs new shopDay: differences in 3005 inputs = 0

/api/report/daily?date=2026-10-15         13.3        17.6       127
/api/report/utang                         11.2        13.8       219`,
      },
      {
        type: 'paragraph',
        text: 'Two small changes took the daily report from 973.5 ms to 13.3 ms, about 73 times faster, and zero differences across 3005 inputs mean the answers did not change. The two numbers together (faster, same answers) are the whole claim. A speed-up without the second number is a guess that happens to look good.',
      },
      { type: 'heading', text: 'Step 4: lighter, not just faster' },
      {
        type: 'paragraph',
        text: 'The page shows the ten latest orders but downloads all 3000. The server can offer an optional `limit` so the page asks only for what it shows. The default stays the same, so any other client that calls `/api/orders` without it keeps working.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the orders list, full and limited',
        code: `endpoint                             median ms  slowest ms     bytes
/api/orders                               11.2        13.4    914733
/api/orders?limit=10                       7.7        13.8      2886`,
      },
      {
        type: 'paragraph',
        text: '914,733 bytes became 2,886, a 99.7 percent reduction in what the shop’s phone downloads. On a slow mobile connection that, not the milliseconds, is what the owner feels. And notice what you **did not** do: you did not cache the whole file, you did not rewrite the storage and you did not touch the three endpoints that were already fast. A cache is a promise to keep a copy correct when the original changes, and that promise is where the next set of bugs lives. A JSON file also has a ceiling: when orders reach the hundreds of thousands, the real next step is a database, and the benchmark you just built is how you will know it is time.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine the store has a storeroom at the back, and for every item on a customer’s list the shopkeeper walks to the storeroom, finds the item, and walks back. For 200 items that is 200 trips. The fix is to carry the whole price list to the counter once. The *benchmark* is a stopwatch you start and stop the same way each time. *Median* means “the middle time when you line them all up from fastest to slowest”, which ignores the one-off slow trip when somebody blocked the door. *Milliseconds* are thousandths of a second. The table’s last column, *bytes*, is how much was sent: 914,733 is like sending the whole phone book when the page only needed the first page. When you read the before and after table you are reading proof, not opinion.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Think in work, not time.** Time depends on the machine, but the count of operations does not: 201 file reads versus 2 is true on every laptop. When you review a loop, ask what it does per item and how that grows with the data: a read inside a loop over N items is N reads, and a search inside a loop over N is N times the size of the search. Fixing the growth (read once, index by id) beats micro-tuning. And always re-measure after a fix: removing the biggest cost often reveals the next one.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**Performance engineering.** Report percentiles (p50, p95, p99), not just the median, and run long enough to see noise, with production-like data volumes and a warm and a cold case. Use a profiler for attribution (`--cpu-prof` produces a profile you can open in tooling) and tracing for requests that cross services, and keep a performance budget in CI so regressions fail a build. Beware cache invalidation: a cache of the parsed file must be invalidated on every write, across every process that writes, or it serves stale data; sometimes the right move is a real datastore with indexes. Reduce payloads with pagination (prefer keyset over offset for large sets), field selection and compression. When you give an AI agent a performance task, hand it the benchmark and the profile and ask for one hypothesis at a time with the measurement that would confirm or reject it, and require the equivalence check.',
      },
      {
        type: 'version',
        text: 'Node.js 22: performance.now() (from the performance measurement APIs, also available in browsers) returns a high-resolution timestamp in milliseconds for timing code; node --cpu-prof writes a CPU profile (.cpuprofile) of the run, with --cpu-prof-dir choosing where. MDN documents Intl.DateTimeFormat, whose format() method reuses an object created once with a locale and options such as timeZone; calling toLocaleDateString with a timeZone option for every order was the cost measured above (about 110 ms for 3000 orders on Node 22.23), and reusing one formatter removed it. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.nodePerf, DOCS.mdnPerfNow, DOCS.nodeCli, DOCS.mdnDateTimeFormat],
      },
      {
        type: 'takeaways',
        items: [
          'Measure first with the same data, a warm-up and the median; report the slowest run and the size too.',
          'Count the work (here 201 file reads for 100 orders) and profile it; the cause is rarely where you would guess, and the next bottleneck appears after the first fix.',
          'Prove a speed-up with two things: before and after numbers, and a check that the answers did not change.',
          'Lighter matters too: send only what the page shows, and keep the default behaviour for old callers.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'A median that sorts as text',
          prompt: 'This median helper gives wrong answers for lists like [10, 9, 100]. Tap the buggy line and choose the fix. (Hint: in JavaScript, sort() with no argument compares items as text.)',
          concept: 'measuring correctly',
          language: 'javascript',
          code: `function median(values) {
  var sorted = values.slice().sort();
  var middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }
  return (sorted[middle - 1] + sorted[middle]) / 2;
}`,
          bugLine: 2,
          fixes: [
            { line: 'var sorted = values.slice().sort(function (a, b) { return a - b; });', correct: true, why: 'The comparison function sorts by numeric value, so [10, 9, 100] becomes [9, 10, 100] and the median is 10.' },
            { line: 'var sorted = values.sort();', correct: false, why: 'Still sorts as text (so 100 comes before 9), and it also changes the caller’s own list.' },
            { line: 'var sorted = values.slice().sort().reverse();', correct: false, why: 'Reversing a text sort does not make it numeric: [10, 9, 100] becomes [9, 100, 10] and the middle is 100.' },
            { line: 'var sorted = values.slice().reverse();', correct: false, why: 'This does not sort at all, it only flips the order the list arrived in.' },
          ],
          lineNote: 'That line is fine. Look for the line that puts the values in order.',
          tests: {
            kind: 'function',
            fn: 'median',
            cases: [
              { label: 'odd length where text order differs', args: [[10, 9, 100]], expected: 10 },
              { label: 'even length where text order differs', args: [[10, 9, 100, 1000]], expected: 55 },
              { label: 'one value', args: [[7]], expected: 7 },
              { label: 'an outlier does not move it', args: [[10, 10, 11, 10, 500]], expected: 10 },
            ],
          },
          hints: [
            'Try [10, 9, 100] by hand. As text, which comes first: "100" or "9"?',
            'sort() without a function compares as text. You need a comparison function that works on numbers.',
            'Use sort(function (a, b) { return a - b; }) on a copy made with slice().',
          ],
          explanation: 'A benchmark that reports the wrong median is worse than none. The default sort is text order, so numbers need a comparison function. Using slice() first also avoids reordering the caller’s own array.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-09-code-challenge-1',
          kind: 'code-challenge',
          title: 'Look products up by id, once',
          prompt: 'Write categoryTotals(orders, products). orders is a list of {items: [{productId, lineTotal}]} and products a list of {id, category}. Return an object with the total of lineTotal for each category, rounded to 2 decimals; a productId not found in products counts under "unknown". Build a lookup object first instead of searching the products list for every line.',
          concept: 'removing N+1 work',
          language: 'javascript',
          starter: `function categoryTotals(orders, products) {
  // 1. build categoryOf: an object from product id to category
  // 2. add each line's lineTotal to its category (or "unknown")
  // 3. round each category total to 2 decimals
  return {};
}`,
          solution: `function categoryTotals(orders, products) {
  var categoryOf = {};
  for (var p = 0; p < products.length; p++) {
    categoryOf[products[p].id] = products[p].category;
  }
  var totals = {};
  for (var i = 0; i < orders.length; i++) {
    for (var j = 0; j < orders[i].items.length; j++) {
      var line = orders[i].items[j];
      var cat = categoryOf[line.productId] || 'unknown';
      totals[cat] = (totals[cat] || 0) + line.lineTotal;
    }
  }
  var cats = Object.keys(totals);
  for (var c = 0; c < cats.length; c++) {
    totals[cats[c]] = Math.round(totals[cats[c]] * 100) / 100;
  }
  return totals;
}`,
          tests: {
            kind: 'function',
            fn: 'categoryTotals',
            cases: [
              { label: 'groups lines by category across orders', args: [[{ items: [{ productId: 'a', lineTotal: 24 }, { productId: 'b', lineTotal: 25.5 }] }, { items: [{ productId: 'a', lineTotal: 12 }] }], [{ id: 'a', category: 'pantry' }, { id: 'b', category: 'household' }]], expected: { pantry: 36, household: 25.5 } },
              { label: 'a deleted product counts as unknown', args: [[{ items: [{ productId: 'x', lineTotal: 5 }] }], [{ id: 'a', category: 'pantry' }]], expected: { unknown: 5 } },
              { label: 'rounds to centavos', args: [[{ items: [{ productId: 'a', lineTotal: 0.1 }, { productId: 'a', lineTotal: 0.2 }] }], [{ id: 'a', category: 'drinks' }]], expected: { drinks: 0.3 } },
              { label: 'no orders gives an empty object', args: [[], [{ id: 'a', category: 'pantry' }]], expected: {} },
            ],
          },
          hints: [
            'First loop over products and fill an object: categoryOf[product.id] = product.category.',
            'Then loop over every order line and add its lineTotal to totals[category], using "unknown" when the id is not in categoryOf.',
            'Finish by looping over Object.keys(totals) and rounding with Math.round(x * 100) / 100.',
          ],
          explanation: 'This is the fix that took the report from 201 file reads to 2: one pass to build an index, then constant-time lookups. Missing products still land in “unknown”, which is why the answers did not change.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-09-predict-output-1',
          kind: 'predict-output',
          title: 'Why the median, not the average?',
          prompt: 'Five timings of the same endpoint, in ms: one run was slow because the computer was busy. This script prints the average, then the median (sorted as numbers). What does it print?',
          concept: 'median versus average',
          language: 'javascript',
          code: `var times = [10, 10, 11, 10, 500];
var total = 0;
for (var i = 0; i < times.length; i++) {
  total = total + times[i];
}
console.log(total / times.length);
var sorted = times.slice().sort(function (a, b) { return a - b; });
console.log(sorted[Math.floor(sorted.length / 2)]);`,
          choices: ['108.2\n10', '10\n10', '108.2\n11', '541\n10'],
          wrongNotes: {
            '10\n10': 'The average adds all five numbers, including 500, and divides by five, so it is far above 10.',
            '108.2\n11': 'Sorted, the list is 10, 10, 10, 11, 500 and the middle (third) item is 10, not 11.',
            '541\n10': '541 is the total. The first line prints the total divided by 5, which is 108.2.',
          },
          hints: [
            'Add the five numbers and divide by 5 for the first line.',
            'Sort the list: 10, 10, 10, 11, 500. Which is the middle one of five?',
            'Average 541 / 5 = 108.2; median is the third item, 10.',
          ],
          explanation: 'One busy moment turned a typical 10 ms into an average of 108.2 ms. The median stays at 10, which is what the request usually costs. That is why benchmarks report the median (and the slowest run separately).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-09-scenario-1',
          kind: 'scenario',
          title: '“Make the report faster”',
          prompt: 'Choose your first move.',
          concept: 'measure first',
          situation: 'You ask an AI tool to make the slow daily report faster. It immediately suggests caching the whole data file in memory for 60 seconds, “which will fix it”, and offers to write the code.',
          options: [
            { text: 'Build a repeatable benchmark and a read counter first, find where the time goes, then change that one thing and measure again.', consequence: 'You find the 201 file reads and the date formatter. Two small changes give a 73 times speed-up with the answers verified identical, and no cache to keep correct.', quality: 'best' },
            { text: 'Accept the cache: caching always makes things faster.', consequence: 'Reports get faster, but a new order now takes up to a minute to show in them, and a void or a stock change shows stale data. You added a bug to fix a number you never measured.', quality: 'poor' },
            { text: 'Ask the AI to profile it for you and fix whatever it finds.', consequence: 'Better, since profiling is the right idea, but you have no repeatable before and after numbers of your own and no check that the answers still match.', quality: 'acceptable' },
            { text: 'Rewrite the storage to use a database straight away.', consequence: 'It may help eventually, but you have rebuilt the foundation to fix a loop that read a file 201 times, with a large migration risk and no measurement showing it was needed.', quality: 'poor' },
          ],
          hints: [
            'What does “faster” mean until you have a number?',
            'You need to know where the time goes before choosing what to change.',
            'Measure with a benchmark, find the real cost, change one thing, and measure again.',
          ],
          explanation: 'A cache is a fix for a particular cause. Without measuring you do not know the cause, and a cache brings its own correctness problems. The benchmark and the counter point at the cheap fix.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-09-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Words for speed',
          prompt: 'Tap each card after saying the meaning in your own words.',
          concept: 'performance vocabulary',
          cards: [
            { front: 'Latency', back: 'How long one request takes, usually in milliseconds (ms). 1000 ms is one second.' },
            { front: 'Median', back: 'The middle time when you line all the timings up from fastest to slowest. One slow outlier does not change it.' },
            { front: 'Payload', back: 'How many bytes the server sends back. A big payload is slow on a phone even if the server is quick.' },
            { front: 'N+1', back: 'One request to get a list, then one more request for every item in it. It makes slowness grow with the data.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four words are enough to read any benchmark table in this lesson.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-09-q1',
        prompt: 'Why does the benchmark report the median instead of the average time?',
        choices: [
          'Because the median is always the smaller number, which makes the app look better in the report',
          'Because Node.js is not able to add up numbers that have decimal points',
          'Because one slow outlier, such as a busy moment, ruins an average but barely moves a median',
          'Because the median needs fewer runs than the average to be accurate',
        ],
        answer: 2,
        explanation: 'The median is the typical run. A single 500 ms blip turned an average of about 10 ms into 108, while the median stayed at 10.',
      },
      {
        id: 'improve-existing-ai-09-q2',
        prompt: 'One request for 100 orders with 200 lines read the data file 201 times. Which pattern is that?',
        choices: [
          'A memory leak, where the program forgets to release memory',
          'N+1: one read for the list and one more read for every item in it',
          'A race condition between two requests to the server',
          'A syntax error that only appears on large inputs',
        ],
        answer: 1,
        explanation: 'One read for the orders plus one per line is the classic N+1 shape. The fix is to read the products once and look them up by id.',
      },
      {
        id: 'improve-existing-ai-09-q3',
        prompt: 'After the first fix the daily report took 108 ms instead of 973 ms. What is the best next step?',
        choices: [
          'Stop: nine times faster is always good enough for any project',
          'Add a cache now, because the remaining time must be the file read',
          'Measure and profile again to find where the remaining time goes',
          'Rewrite the report in a different programming language to get closer to the limit',
        ],
        answer: 2,
        explanation: 'The profile showed the date function used 125 ms for 3000 orders. Removing one cost often reveals the next, and you cannot know which without measuring again.',
      },
      {
        id: 'improve-existing-ai-09-q4',
        prompt: 'Why is it safer to add an optional ?limit=10 to /api/orders than to change /api/orders to return only ten orders?',
        choices: [
          'Because query strings are faster to parse than a route path',
          'Because Express refuses to change routes that already exist',
          'Because the default stays the same, so any other client that calls it without limit keeps working',
          'Because the page would otherwise fail to load the first time it was opened, since it expects a short list',
        ],
        answer: 2,
        explanation: 'An additive option keeps existing behaviour intact. Changing the default would silently break anything that expects the whole list.',
      },
      {
        id: 'improve-existing-ai-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does “milliseconds” measure?',
        choices: [
          'How many bytes are sent to the phone',
          'How much memory the computer has left',
          'Tiny slices of time: a thousandth of a second each',
        ],
        answer: 2,
        explanation: 'Milliseconds (ms) measure how long something takes. 1000 ms is one second, so 13 ms is very fast.',
      },
      {
        id: 'improve-existing-ai-09-q6',
        audience: { min: 'advanced' },
        prompt: 'You are tempted to cache the parsed data file in memory to speed up every endpoint. What must you settle first?',
        choices: [
          'How to invalidate the cache on every write from every process, or readers see stale data; and whether a datastore is simpler',
          'Whether the cache can be kept in a file so that it survives a restart of the server without anyone having to rebuild it',
          'How large the cache can grow before Node.js refuses to start the process',
          'Whether the cache makes the median look better than the average in the benchmark',
        ],
        answer: 0,
        explanation: 'The hard part of a cache is keeping it correct when the original changes. With several writers a stale cache silently gives wrong reports. Measure whether you need it at all, and consider a datastore if you do.',
      },
    ],
    task: {
      title: 'Speed up one thing in your practice project, with proof',
      minutes: 22,
      steps: [
        'Seed your project with a large amount of realistic data (thousands of records) and write a small benchmark that prints the median, slowest time and response size for each endpoint, with a warm-up.',
        'Pick the slowest endpoint. Count the work it does (file or database reads, loops inside loops) and, if you can, run node --cpu-prof on it. Write down the cause in one sentence.',
        'Fix that one cause on a branch. Re-run the benchmark. If it is still slow, profile again and find the next cost.',
        'Prove the answers did not change: compare the old and new results across a large set of inputs, run your tests and smoke check, and write a before and after table for your report.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI to explain your before and after table in plain words, and then explain to it, in your own words, why the median is used. Correct it if it disagrees.'] },
      { audience: { min: 'advanced' }, steps: ['Add p95 to your benchmark output and a budget check that exits non-zero when the daily report’s median passes a limit you choose. Decide where that check should run in CI.'] },
    ],
  },
  {
    id: 'improve-existing-ai-10',
    day: 10,
    title: 'Project: take over an app and improve it',
    summary: 'Put the whole course in order: the sequence of a real take-over, the evidence that proves each improvement, and the before and after report you hand over.',
    minutes: 30,
    skills: ['inherited-app-report'],
    intro: {
      objectives: [
        'Order the steps of a take-over so that each one makes the next one safe',
        'Collect evidence for every improvement instead of claiming it',
        'Write a before and after report, including what you chose not to do, and turn the course into your own checklist',
      ],
      why: 'Clients and employers do not hire you for the commits; they hire you for the confidence that the app is in better hands. A short report with numbers, evidence and honest limits is what turns “I fixed some things” into a reason to keep working with you.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You have now done every part of a take-over on one project. This lesson puts the parts in order, shows what the finished work looks like for Tindahan Orders, and then hands the same job to you with your own project. A take-over is not a list of tasks. It is a sequence in which each step makes the next one safe: you map before you change, you add a way to notice mistakes before you make any, and you prove each improvement before you claim it. The report at the end is the proof, written for someone who was not there.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The order of a take-over. Each step produces something the next one needs.',
        source: `flowchart TD
  A[Map and instructions file] --> B[Branch plus a read-only smoke check]
  B --> C[Characterization tests around what you will touch]
  C --> D[Fix the worst bugs, each with a regression test]
  D --> E[Add the feature from a spec and a reader checklist]
  E --> F[Update dependencies one at a time]
  F --> G[Measure and fix the slowest thing]
  G --> H[Before and after report]`,
      },
      {
        type: 'paragraph',
        text: 'One honest note about order. The lessons in this course ran feature, bug fix and refactor in that sequence so that each idea got its own lesson, and the first tests arrived with the first bug fix. On a real engagement, move the tests **earlier**: right after the map and the smoke check, put characterization tests around the part of the code you are about to change. The rule behind the order does not change: never change what you cannot yet notice breaking.',
      },
      { type: 'heading', text: 'What the finished take-over looked like' },
      {
        type: 'paragraph',
        text: 'Here is the real record of the Tindahan Orders take-over, from the unchanged USB-drive import to the last merge. Every number is from a command you saw run in this course.',
      },
      {
        type: 'table',
        headers: ['Area', 'Before', 'After', 'Evidence'],
        rows: [
          ['Map', 'None; no README', 'MAP.md plus an instructions file with 9 hazards', 'Lessons 1 and 2; each hazard reproduced before it was fixed'],
          ['Tests', '0 tests', '30 tests in 7 files, 93.53 percent line coverage', 'npm test and node --test with coverage'],
          ['Bugs fixed', '8 reproduced', '8 fixed: search case, half-failed order, oversell, quantity, discount, float totals, receipt crash, UTC day', 'A regression test that failed first for each'],
          ['Feature', 'No way to cancel an order', 'Void an order: restocks, keeps history, skipped by 3 reports', 'Spec with 6 criteria and a table of readers'],
          ['Dependencies', '10 vulnerabilities; express 4.17.1; morgan 1.10.0', '0 vulnerabilities; express 4.22.3; morgan 1.12.1; uuid removed', 'npm audit and npm outdated, one commit per package'],
          ['Daily report speed', '973.5 ms median (3000 orders)', '13.3 ms median, same answers on 3005 checked inputs', 'bench/bench.js and a read counter (201 reads to 2)'],
          ['Orders payload', '914,733 bytes', '2,886 bytes with ?limit=10', 'Benchmark bytes column'],
        ],
        caption: 'The take-over of Tindahan Orders in numbers.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the history, without the merge commits (oldest at the bottom)',
        code: `6fc1942 Faster reports: read products once, one pass for utang, reuse the date formatter; orders?limit=N
f2a6d7f Add bench/ (timing and file-read counter)
343f7bb Drop the uuid package: use crypto.randomUUID() (same v4 ids, one less dependency)
9a50c38 Update morgan within ^1 (1.10.0 to 1.12.1), lockfile only
7644989 Update express within ^4 (4.17.1 to 4.22.3), lockfile only
7754f7d Tests for reports, void, products, customers and buildOrder (29 tests)
278f8eb Extract buildOrder into orders.js (behaviour unchanged: 17 recorded cases still pass)
c0cdc0c Characterization tests: record what POST /api/orders does today (14 cases)
818664a Fix receipt crash on a deleted product and the UTC/Manila day mix-up in reports (with tests)
d7933f2 Fix order bugs: validate first then deduct stock, reject bad qty and discount, round to centavos (with tests)
743c666 Make the app testable: DB path from TINDAHAN_DB, export app, npm test
f0838a8 Voided orders no longer count in utang or top products; receipt and page show VOID
5c27cad Add POST /api/orders/:id/void (restock) and skip voided in the daily report
cb36d78 Product search ignores case and extra spaces
461d355 Add a read-only smoke check (npm run smoke)
a9db791 Imported from Jun's USB drive (as received)`,
      },
      {
        type: 'paragraph',
        text: 'Read that history as a story. Sixteen small commits, each with a message that says what changed for the user, and none that mixes a refactor with a fix. A reviewer can skim it in two minutes, revert any single one, and see that the change in the lesson 9 commit is the only one that touches speed. That legibility is part of the deliverable.',
      },
      { type: 'heading', text: 'The report: evidence, and honest limits' },
      {
        type: 'paragraph',
        text: 'A report is a claim plus its proof, one line each, in plain language for a person who does not read code. It also lists what you did **not** do. In Tindahan Orders that list is real: the web page still builds its HTML by joining strings, which can break on a product named with angle brackets (hazard 8 in the map); the move to Express 5 is a separate pull request; and the JSON file will need replacing with a database as orders grow. Saying so earns more trust than a report with no limits.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'REPORT.md template',
        code: `# Take-over report: <project>

## Summary
Two sentences: what the app is, and the state it is in now compared with when you got it.

## Before and after
| Area | Before | After | Evidence (command or file) |
|------|--------|-------|-----------------------------|

## Bugs fixed
For each: how to reproduce it, the test that failed first, the commit.

## Feature added
The spec (acceptance criteria), the readers you checked, the commit.

## Dependencies
npm outdated and npm audit before and after; one line per update.

## Performance
The benchmark table, the cause you found, and the check that answers did not change.

## Not done, and why
Known issues you left open, risks, and what you would do next.

## How to work on it
Commands to run, the branch workflow, where the map and instructions file are.`,
      },
      { type: 'heading', text: 'Put it into your own workflow' },
      {
        type: 'paragraph',
        text: 'The course is only useful if it becomes your habit. Keep three small things, and use them on the next project that lands on your desk. A **checklist** you run on day one of any inherited project. An **instructions file** template you drop into every repository so each AI session starts with the same rules. And a **routine** (a weekly or monthly slot) for outdated and audit checks, so dependencies never become a once-a-year emergency.',
      },
      {
        type: 'prompt',
        label: 'Your take-over starter prompt (copy it into your notes)',
        text: 'This is a project I have just inherited. Do not change any file yet. Read it and give me: what it is for; every file and its job; the entry point and how to run it; where data is stored and who writes it; the steps of its most important action, naming the function and file for each; and a list of anything fragile, wrong or risky, each with the file and line and how I could reproduce it. Mark anything you are not sure of. Then propose, as a plan, the smallest read-only safety net I could add first (a smoke check and a list of characterization cases for the code I will change).',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine you are hired to look after someone else’s shop. On the first day you walk through and write down where everything is (the map). You put a notebook by the till to record every sale so you can spot mistakes (the safety net). You fix the biggest problems first and write down what you did. At the end you give the owner a note: “here is what it was like, here is what it is like now, here is the proof, and here are the things I did not touch.” That note is the report. Every row in the table above is one small promise with a way to check it: if someone doubts “73 times faster”, you point at the benchmark and say “run it yourself”.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**Scope on purpose.** On your own project you will find more than you can fix. Decide the scope before you start: three bugs, one feature, one dependency, one performance fix, and write the rest into the “not done” section. A finished, proven small take-over is worth more than ten half-fixed things, and the “not done” list is the start of your next piece of paid work.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**Making it team-ready.** Turn the take-over into the repository’s own guardrails: the smoke check and tests run in CI as required checks, the map and instructions file are reviewed through CODEOWNERS, dependency updates come from a bot under a written policy, and a benchmark with a budget runs on a schedule. For agent-assisted work keep the evidence in the pull request: the plan, the diff you reviewed, the checks that ran and the failing-first test for each fix, so a reviewer can verify without trusting anyone’s memory. A fresh reviewer that did not see the conversation (a teammate, or a separate agent pass over the diff) is more likely to catch what the author’s own reasoning smooths over.',
      },
      {
        type: 'version',
        text: 'Review tools: Claude Code’s best-practices page says a separate reviewer who did not write the code is more reliable than self-review, and that its /code-review command in the terminal reviews the diff in a fresh subagent that never saw your conversation. Codex’s prompting guide shows /review for a local review (rerun it after fixes) and commenting “@codex review” on a GitHub pull request. Instructions files for each tool are described in lesson 2. Checked on this date; commands change often.',
        checked: CHECKED,
        sources: [DOCS.ccBest, DOCS.codexPrompting],
      },
      {
        type: 'takeaways',
        items: [
          'A take-over is a sequence where each step makes the next safe: map, safety net, tests around what you touch, fixes, feature, dependencies, speed, report.',
          'Every improvement needs evidence you can point at: a failing-then-passing test, a recorded suite, an audit before and after, a benchmark and an equivalence check.',
          'A good report states what changed, how to verify it, and what you chose not to do.',
          'Keep the checklist, the instructions-file template and a maintenance routine, and reuse them on the next inherited project.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-10-arrange-1',
          kind: 'arrange',
          title: 'Order the take-over',
          prompt: 'Put the seven stages of a take-over in a sensible order, first at the top. Remember that each stage should make the next one safe.',
          concept: 'take-over sequence',
          language: 'text',
          solution: [
            'Write MAP.md and the instructions file, and reproduce the suspected hazards',
            'Work on a branch and add a read-only smoke check',
            'Record behaviour with characterization tests around the code you will change',
            'Fix the worst bugs, each with a regression test that failed first',
            'Add the requested feature from a spec and a checklist of readers',
            'Update dependencies one at a time, then measure and fix the slowest endpoint',
            'Write the before and after report, including what you did not do',
          ],
          reasons: [
            'You cannot make safe changes to a project you do not understand.',
            'The branch and the smoke check give you a way to notice breakage before you change anything.',
            'Recording the current behaviour turns “I think it is fine” into something a test can say.',
            'With a net in place you can fix bugs and prove each fix.',
            'The feature goes in once the readers of the data are known and the bug fixes are safe underneath it.',
            'Dependency and speed work both need the net, and speed needs a baseline measured on the app as it is.',
            'The report comes last because it summarises evidence that only exists once the work is done.',
          ],
          hints: [
            'What must exist before you change any code?',
            'The net (smoke check, characterization tests) comes before bug fixes, the feature, dependencies and speed work.',
            'Map, branch and smoke check, characterize, fix bugs, add the feature, update and speed up, report.',
          ],
          explanation: 'Each step produces what the next needs: understanding, a way to notice breakage, a recording of behaviour, proven fixes, then the new work, and finally the report that summarises the evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-10-scenario-1',
          kind: 'scenario',
          title: 'The client wants the feature first',
          prompt: 'Choose how to respond.',
          concept: 'scoping a take-over',
          situation: 'A new client hands you an app with no tests and says: “Add a loyalty-points feature this week. Do not spend time on anything else.” You can see a likely stock bug in the code the feature will touch.',
          options: [
            { text: 'Agree the feature, and explain that the first half-day goes to a map, a smoke check and tests around the code the feature touches, so the feature does not break the shop.', consequence: 'You deliver the feature on time, with a small safety net and a short report. The client sees the stock bug listed as a risk and decides what to do about it.', quality: 'best' },
            { text: 'Do only the feature, exactly as asked, with no checks beyond trying it once.', consequence: 'It ships on time. The stock bug and the missing checks combine, and a week later points are awarded for orders that were never really filled.', quality: 'poor' },
            { text: 'Refuse to start the feature until the whole app has been tested and refactored.', consequence: 'The app would be better, but the client asked for one thing, cannot see the value yet, and may take the work elsewhere.', quality: 'poor' },
            { text: 'Build the feature, and quietly fix the stock bug at the same time without telling anyone.', consequence: 'The fix is welcome, but it is a behaviour change nobody reviewed, tangled into a feature commit, and the client cannot tell what changed or why.', quality: 'acceptable' },
          ],
          hints: [
            'What does the client actually need this week, and what protects it?',
            'A small safety net around the touched code is cheap and makes the feature safe.',
            'Do the asked feature, with a short net around it, and tell the client about the risk you saw.',
          ],
          explanation: 'Scope the safety work to the code the feature touches, deliver what was asked, and make risks visible instead of fixing them silently or demanding a rewrite first.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-10-match-1',
          kind: 'match',
          title: 'Which evidence backs which claim?',
          prompt: 'Each line is a claim in a take-over report. Pair it with the evidence that would actually support it.',
          concept: 'evidence for claims',
          labels: { terms: 'The claim', meanings: 'The evidence' },
          pairs: [
            { term: '“The daily report is 73 times faster”', definition: 'A benchmark table with before and after medians, plus a check that old and new answers are identical', note: 'A speed claim needs numbers and proof that the answers did not change.' },
            { term: '“The refactor changed nothing”', definition: 'A characterization suite recorded from the old code and passing on the new code', note: 'The recording is made before the change and replayed after.' },
            { term: '“The dependencies are up to date and safe”', definition: 'npm outdated and npm audit output before and after, with one commit per package', note: 'The tools’ own output and the history show what changed.' },
            { term: '“The half-failed order bug is fixed”', definition: 'A regression test that failed on the old code and passes on the new', note: 'It must be seen failing first, to prove it measures the bug.' },
          ],
          hints: [
            'Ask what a sceptical client would want to run themselves for each claim.',
            'Speed needs measurements, a refactor needs a recording, dependencies need tool output, a bug fix needs a test that failed first.',
            'Faster: benchmark. No change: recorded suite. Safe dependencies: outdated and audit. Bug fixed: failing-first regression test.',
          ],
          explanation: 'A claim in a report is only as good as the thing you can point at. Each of these four has a standard proof, and you have now produced all of them in this course.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'improve-existing-ai-10-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Four things to keep',
          prompt: 'Tap each card after saying what it is for in your own words.',
          concept: 'take-over toolkit',
          cards: [
            { front: 'Map', back: 'A short file saying how to run the app, what each file does and what looks risky, so nobody has to rediscover it.' },
            { front: 'Smoke check', back: 'A quick read-only script that proves the app still starts and answers after a change.' },
            { front: 'Regression test', back: 'A test written for a bug that fails first, then passes after the fix, and stays to stop the bug coming back.' },
            { front: 'Before and after report', back: 'A short note with numbers and proof of what changed and what you chose not to touch.' },
          ],
          hints: ['Say each word aloud before you flip the card.'],
          explanation: 'These four are the toolkit you reuse on every inherited project.',
        },
      },
    ],
    quiz: [
      {
        id: 'improve-existing-ai-10-q1',
        prompt: 'On a real engagement, where would you move the characterization tests compared with the order of the lessons?',
        choices: [
          'To the very end, after the report, since tests are only a nice extra',
          'Right after the map and the smoke check, before you change the code they cover',
          'Before the map, because you cannot understand code until it has tests',
          'Nowhere: the first bug fix is a good enough place for them every time',
        ],
        answer: 1,
        explanation: 'The rule is never to change what you cannot notice breaking. Recording behaviour around the code you will change comes before changing it.',
      },
      {
        id: 'improve-existing-ai-10-q2',
        prompt: 'Besides what you did, what should an honest take-over report include?',
        choices: [
          'The names of every AI tool you used, in the order you tried them',
          'What you chose not to do and the known issues you left open, with reasons',
          'A promise that no further bugs exist in the parts you touched',
          'The full text of every prompt you sent during the project',
        ],
        answer: 1,
        explanation: 'Limits make the rest believable and start the next conversation. No project is finished, and a report that claims otherwise should not be trusted.',
      },
      {
        id: 'improve-existing-ai-10-q3',
        prompt: 'A report says “reports are 73 times faster”. What must stand behind that sentence?',
        choices: [
          'A screenshot of the app, which a sceptical reader can check at a glance without running any commands',
          'The AI tool’s statement that the code is now more efficient',
          'The benchmark before and after (same data, median) and a check that the answers did not change',
          'The number of lines of code that were removed from the report route',
        ],
        answer: 2,
        explanation: 'A speed claim is two facts: how much faster, measured fairly, and that the output is the same. Without the second a fast wrong answer would look like success.',
      },
      {
        id: 'improve-existing-ai-10-q4',
        prompt: 'Which is the strongest evidence that a refactor changed nothing?',
        choices: [
          'The AI says the new code is equivalent to the old code',
          'A characterization suite recorded from the old code, still passing on the new, whose boundary cases were checked by deliberate breaks',
          'The diff is smaller than the old file was, so little can have changed, and a smaller diff is always a safer one to merge into the main branch of the project',
          'The app starts and the first page loads without errors',
        ],
        answer: 1,
        explanation: 'A recording made before the change and replayed after is evidence. Checking the recording with deliberate breaks shows it is sensitive enough to count.',
      },
      {
        id: 'improve-existing-ai-10-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a before and after report?',
        choices: [
          'A note that shows how the app was, how it is now, and the proof of the difference',
          'A list of every file in the project with its size',
          'A message that tells users the app will be down for repairs',
        ],
        answer: 0,
        explanation: 'It is the summary you hand over: what it was like, what it is like now, how to check, and what is left.',
      },
      {
        id: 'improve-existing-ai-10-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team now lets agents make changes in a service you maintain. What is the best way to keep review trustworthy?',
        choices: [
          'Let the same agent that wrote the change also review it, since it knows the context best, which also keeps every review quick and cheap for the team',
          'Require a person to read every line of every agent change before any test is run',
          'Keep the plan, reviewed diff and check results in each pull request, with failing-first tests, and have a reviewer who did not see the session confirm it',
          'Forbid agents from touching code that has tests, so existing behaviour is never at risk',
        ],
        answer: 2,
        explanation: 'Evidence in the pull request lets anyone verify without trusting memory, and an independent reviewer is not swayed by the reasoning that produced the change. Self-review and blanket bans both miss that.',
      },
    ],
    task: {
      title: 'Write your take-over checklist and report template',
      minutes: 20,
      steps: [
        'Write your own one-page checklist for the first day on an inherited project, using the stages of this lesson, with the exact commands you use at each stage.',
        'Save the starter prompt and an instructions-file template into your notes or a repository you reuse, trimmed to what you actually run.',
        'Copy the REPORT.md template and fill in the Before and after table for your practice project with the numbers you have so far (leave the rest for the final project).',
        'Set a recurring reminder for outdated and audit checks on your practice project, and write the one command you will run.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask your AI tool to read your checklist and explain each stage back to you in plain words. Fix any line it finds confusing, because it is probably confusing to a client too.'] },
      { audience: { min: 'advanced' }, steps: ['Turn two lines of your checklist into enforcement: add the smoke check as a required CI step and write a CODEOWNERS entry for the map and instructions file, then note what you would need to turn on in branch protection.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'improve-existing-ai-p1',
    title: 'Map an inherited app and build its safety net',
    summary: 'Take a project you did not write, map it, write the instructions file, add a read-only smoke check and make one small change through the safe loop.',
    outcome: 'Proof that you can enter an unfamiliar codebase, understand it and change it without breaking it: a map, a check and a clean, reviewed commit.',
    unlockAfterDay: 3,
    steps: [
      { id: 'improve-existing-ai-p1-s1', text: 'Choose your practice project (your own earlier app, or one generated with the prompt in lesson 1) and put it in a Git repository with a first commit that records it as received.' },
      { id: 'improve-existing-ai-p1-s2', text: 'Do the five-minute look, then ask an AI tool for a read-only overview. Check at least four of its claims by search, reading or running, and write down every wrong claim and the check that showed it.' },
      { id: 'improve-existing-ai-p1-s3', text: 'Trace the most important action end to end, run it once with input that should fail halfway, and write MAP.md (run it, files, state, one flow, hazards) plus a short CLAUDE.md or AGENTS.md.', link: 'https://code.claude.com/docs/en/memory' },
      { id: 'improve-existing-ai-p1-s4', text: 'On a branch, add a read-only smoke check, then make one small change through the loop: one request to the AI, the check, a full read of the diff, a commit, a merge. Note any edit you did not ask for.' },
      { id: 'improve-existing-ai-p1-s5', audience: { max: 'beginner' }, text: 'Keep it small: map only one action, list three hazards, and ask the AI to explain each hazard in plain words before you write it down. Your smoke check can be three requests.' },
      { id: 'improve-existing-ai-p1-s6', audience: { min: 'advanced' }, text: 'Add the churn and ownership view to the map (most-edited files from history and who owns them) and put the smoke check into CI as a required check.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/you/practice-app',
      hint: 'A repository with MAP.md, the instructions file, the smoke check and a history that shows the as-received commit and your branch and merge.',
    },
    rubric: [
      'The map lists how to run the app, what each file does, where data lives, one traced flow and a hazards list',
      'At least four AI claims were checked against the code, and the wrong ones are written down with the check',
      'A read-only smoke check runs with one command and reports how many checks passed',
      'The small change was made on a branch, the diff was read, and the commit contains only what was asked for',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Each hazard is explained in plain words and was reproduced at least once by running the app'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['At least one hazard was reproduced with a real request and its output pasted into the map'] },
      { audience: { min: 'advanced' }, items: ['The map includes churn and ownership, and the smoke check is wired into CI as a required step'] },
    ],
  },
  {
    id: 'improve-existing-ai-p2',
    title: 'Take over an app and improve it',
    summary: 'Run the whole take-over on your practice project: tests, bug fixes, one new feature, a dependency update and a measured speed-up, ending with a before and after report.',
    outcome: 'A repository with a clean history and a REPORT.md that proves, with evidence, that the app is safer, better and faster than when you received it.',
    unlockAfterDay: 9,
    steps: [
      { id: 'improve-existing-ai-p2-s1', text: 'Start from your map and smoke check. Record the starting numbers: outdated and audit counts, test count and coverage, and a benchmark with a large seeded data set for your slowest endpoint.' },
      { id: 'improve-existing-ai-p2-s2', text: 'Record the behaviour of the most important route with a characterization suite (at least ten cases including boundaries). Break one rule on purpose and confirm that the suite notices, adding cases until it does.', link: 'https://nodejs.org/docs/latest-v22.x/api/test.html' },
      { id: 'improve-existing-ai-p2-s3', text: 'Fix at least three reproduced bugs from your hazards list. Each fix gets a regression test that you saw fail first, its own commit, and a one-line note in the report.' },
      { id: 'improve-existing-ai-p2-s4', text: 'Add one feature from a spec with acceptance criteria. Build the table of every place that reads the data it touches, ask for a plan first, and check each reader.' },
      { id: 'improve-existing-ai-p2-s5', text: 'Update dependencies inside their ranges one at a time with checks after each, then handle one flagged or major update by reading the changelog, checking your own usage and trying it on a throwaway branch.', link: 'https://docs.npmjs.com/cli/v11/commands/npm-outdated' },
      { id: 'improve-existing-ai-p2-s6', text: 'Count the work your slowest endpoint does, fix the biggest cost, measure again, and prove the answers did not change. Include the before and after table.' },
      { id: 'improve-existing-ai-p2-s7', text: 'Write REPORT.md from the template: summary, before and after table with evidence, bugs, feature, dependencies, performance, what you did not do, and how to work on the project.' },
      { id: 'improve-existing-ai-p2-s8', audience: { max: 'beginner' }, text: 'Scale the work down: fix two bugs instead of three, skip the major-version trial, and use a smaller seeded data set. Ask the AI to explain every diff in plain words before you commit it, and put one sentence of your own in the report for each change.' },
      { id: 'improve-existing-ai-p2-s9', audience: { min: 'intermediate', max: 'intermediate' }, text: 'Your feature or one of your bug fixes must involve an API route and stored data, and your tests must run against a throwaway copy of the data with fixed dates.' },
      { id: 'improve-existing-ai-p2-s10', audience: { min: 'advanced' }, text: 'Make the work team-ready: run tests and smoke in CI as required checks, add a performance budget check, write the dependency update policy in the instructions file, and list one data repair or compatibility risk for each bug fix.' },
      { id: 'improve-existing-ai-p2-s11', audience: { min: 'professional' }, text: 'Do the engagement with an agent-assisted workflow and keep the evidence in each pull request: the plan, the diff you reviewed, the checks run, and an independent review pass (a teammate or a separate agent run that did not see the session). Summarise where review caught something.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/you/practice-app',
      hint: 'A repository with a readable history, tests, benchmark scripts and REPORT.md at the root.',
    },
    rubric: [
      'The report has a before and after table where every claim names its evidence (a command, a file or a commit)',
      'At least three bugs were each reproduced, covered by a regression test that failed first, and fixed in their own commit',
      'The feature has acceptance criteria and a checked list of every place that reads the data it touches',
      'Dependencies were updated one at a time with checks, and one major or flagged package was investigated, not blindly forced',
      'The speed-up is measured on realistic data with before and after numbers and a check that the answers did not change',
      'The report lists what was not done and the known risks, and the commit history keeps refactors, fixes and features separate',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Every change has a plain-language explanation that matches what the diff does'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The tests use throwaway data and fixed dates, and the project uses an API route with stored data as required'] },
      { audience: { min: 'advanced' }, items: ['CI runs the checks as required steps, a performance budget exists, and each bug fix notes any data repair or compatibility risk'] },
      { audience: { min: 'professional' }, items: ['Each pull request carries agent-assisted work evidence (plan, reviewed diff, checks) and a summary of what an independent review caught'] },
    ],
  },
];

export const improveExistingAiCourse: Course = {
  id: 'improve-existing-ai',
  kind: 'standard',
  title: 'Improve and Expand Existing Applications with AI',
  level: 'intermediate',
  tagline: 'Take over a project you did not write, fix it, extend it and speed it up, safely, with AI.',
  description: 'Most real work happens on software that already exists. You will learn to understand an unfamiliar project with AI, map it before touching it, change it with a safe workflow, add a feature, fix inherited bugs, refactor, add tests, update dependencies and make it faster, all on a real messy practice app.',
  finishLine: ['A written map and instructions file for an inherited project', 'A safety net of tests and a change workflow you trust', 'A before and after report: bugs fixed, a feature added, a dependency updated and a speed-up measured'],
  objectives: [
    'Map an unfamiliar project with AI and verify the map against the code',
    'Change an existing app through small, reviewed, checked steps on a branch',
    'Add a feature and fix a bug without breaking the parts you did not touch',
    'Write tests for code that has none, then refactor behind them',
    'Update a dependency and speed up a slow endpoint by measuring first',
  ],
  audiences: ['builder', 'experienced-dev', 'career-changer'],
  skills: [
    { id: 'read-unfamiliar-code', label: 'Understanding unfamiliar code with AI' },
    { id: 'map-before-change', label: 'Mapping before changing' },
    { id: 'safe-change-workflow', label: 'The safe change workflow' },
    { id: 'add-feature', label: 'Adding a feature to an existing app' },
    { id: 'fix-inherited-bug', label: 'Fixing inherited bugs' },
    { id: 'refactor-with-tests', label: 'Refactoring behind tests' },
    { id: 'write-tests-legacy', label: 'Testing legacy code' },
    { id: 'update-dependencies', label: 'Updating dependencies safely' },
    { id: 'measure-performance', label: 'Measuring and improving performance' },
    { id: 'inherited-app-report', label: 'Reporting a take-over' },
  ],
  lessons,
  projects,
  icon: 'construction',
  updated: '2026-11-14',
};
