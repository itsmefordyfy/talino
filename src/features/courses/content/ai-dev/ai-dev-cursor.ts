import type { Course, Lesson, SourceLink } from '../types';

/**
 * Mastering Cursor (AI-Assisted Software Development path, course 5). Every product statement sits in a
 * `version` note checked against Cursor's own documentation on 2026-11-14; the main text keeps to
 * engineering habits that outlive a release. Practice code is SariStock (React + Express + SQLite + Vitest).
 */

const CHECKED = '2026-11-14';

const S = {
  overview: { label: 'Cursor docs: Overview', url: 'https://cursor.com/docs' },
  quickstart: { label: 'Cursor docs: Quickstart', url: 'https://cursor.com/docs/get-started/quickstart' },
  pricing: { label: 'Cursor docs: Models & Pricing', url: 'https://cursor.com/docs/models-and-pricing' },
  pricingHelp: { label: 'Cursor help: Pricing and plans', url: 'https://cursor.com/help/account-and-billing/pricing' },
  agentsWindow: { label: 'Cursor docs: Agents Window', url: 'https://cursor.com/docs/agent/agents-window' },
  install: { label: 'Cursor help: Download and install', url: 'https://cursor.com/help/getting-started/install' },
  migrate: { label: 'Cursor help: Migrate from VS Code', url: 'https://cursor.com/help/getting-started/migrate-vscode' },
  vscode: { label: 'Cursor docs: VS Code migration', url: 'https://cursor.com/docs/configuration/migrations/vscode' },
  privacy: { label: 'Cursor help: Privacy and data', url: 'https://cursor.com/help/security-and-privacy/privacy' },
  runModes: { label: 'Cursor docs: Run Modes', url: 'https://cursor.com/docs/agent/security/run-modes' },
  terminalHelp: { label: 'Cursor help: Terminal integration', url: 'https://cursor.com/help/ai-features/terminal' },
  agentSecurity: { label: 'Cursor docs: Agent security', url: 'https://cursor.com/docs/agent/security' },
  tab: { label: 'Cursor help: Tab completion', url: 'https://cursor.com/help/ai-features/tab' },
  shortcuts: { label: 'Cursor docs: Keyboard shortcuts', url: 'https://cursor.com/docs/reference/keyboard-shortcuts' },
  agentHelp: { label: 'Cursor help: Agent mode', url: 'https://cursor.com/help/ai-features/agent' },
  askHelp: { label: 'Cursor help: Ask mode', url: 'https://cursor.com/help/ai-features/ask-mode' },
  agentOverview: { label: 'Cursor docs: Cursor Agent', url: 'https://cursor.com/docs/agent/overview' },
  planMode: { label: 'Cursor docs: Plan Mode', url: 'https://cursor.com/docs/agent/plan-mode' },
  composer: { label: 'Cursor docs: Composer 2.5', url: 'https://cursor.com/docs/models/cursor-composer-2-5' },
  changelog046: { label: 'Cursor changelog: Agent is ready and UI refresh (0.46)', url: 'https://cursor.com/changelog/0-46-x' },
  changelog20: { label: 'Cursor changelog: 2.0', url: 'https://cursor.com/changelog/2-0' },
  rules: { label: 'Cursor docs: Rules', url: 'https://cursor.com/docs/rules' },
  prompting: { label: 'Cursor docs: Prompting agents', url: 'https://cursor.com/docs/agent/prompting' },
  context: { label: 'Cursor help: @ mentions and context', url: 'https://cursor.com/help/customization/context' },
  ignore: { label: 'Cursor docs: Ignore file', url: 'https://cursor.com/docs/reference/ignore-file' },
  search: { label: 'Cursor docs: Search', url: 'https://cursor.com/docs/agent/tools/search' },
  releaseNotes: { label: 'Cursor docs: Release notes', url: 'https://cursor.com/docs/release-notes' },
  debug: { label: 'Cursor docs: Debug Mode', url: 'https://cursor.com/docs/agent/debug-mode' },
  subagents: { label: 'Cursor docs: Subagents', url: 'https://cursor.com/docs/subagents' },
  git: { label: 'Cursor help: Git', url: 'https://cursor.com/help/integrations/git' },
  agentReview: { label: 'Cursor docs: Agent Review', url: 'https://cursor.com/docs/agent/agent-review' },
  bugbot: { label: 'Cursor docs: Bugbot', url: 'https://cursor.com/docs/bugbot' },
  bugbotHelp: { label: 'Cursor help: Bugbot', url: 'https://cursor.com/help/ai-features/bugbot' },
  worktrees: { label: 'Cursor docs: Worktrees', url: 'https://cursor.com/docs/configuration/worktrees' },
  cloudHelp: { label: 'Cursor help: Cloud Agents', url: 'https://cursor.com/help/ai-features/cloud-agents' },
  mcp: { label: 'Cursor docs: Model Context Protocol (MCP)', url: 'https://cursor.com/docs/mcp' },
  skills: { label: 'Cursor docs: Agent Skills', url: 'https://cursor.com/docs/skills' },
  hooks: { label: 'Cursor docs: Hooks', url: 'https://cursor.com/docs/hooks' },
  cli: { label: 'Cursor docs: Cursor CLI', url: 'https://cursor.com/docs/cli/overview' },
  cliHeadless: { label: 'Cursor docs: Using Headless CLI', url: 'https://cursor.com/docs/cli/headless' },
  owasp: { label: 'OWASP GenAI: LLM01 Prompt Injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
} satisfies Record<string, SourceLink>;

const l01: Lesson = {
  id: 'ai-dev-cursor-01',
  day: 1,
  title: 'Introduction to Cursor',
  summary: 'What Cursor is, the places you can run its agent, and where an AI code editor fits next to chat and terminal tools.',
  minutes: 18,
  skills: ['cursor-setup', 'cursor-modes'],
  intro: {
    objectives: [
      'Describe Cursor as an editor with an agent built in, not a chat window beside your code',
      'Name the places Cursor runs an agent: the editor, the Agents Window, the cloud and the CLI',
      'Choose which Cursor surface fits a task from your own week',
      'Check which plan a feature needs before you plan your work around it',
    ],
    why: 'Teams that use Cursor expect you to know its parts and their limits on day one. Knowing where each part fits keeps you from asking an agent to do a job that Tab or a quick question would do better.',
  },
  body: [
    { type: 'paragraph', text: "Cursor is a code editor with an AI agent built into it. If you have used VS Code, the screen will look familiar: the file explorer on the left, editor tabs in the middle, a terminal at the bottom. The difference is a side panel where an agent reads your project, edits files, runs commands and shows you what it changed. This course is about working well inside that editor: giving the agent the right context, keeping changes small enough to review, and proving every change with tests before it reaches your team." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Let us define the words. A **code editor** is a program for writing code, the way a word processor is a program for writing letters: it shows your text, lets you keep several files open in tabs, and colours the words so code is easier to read. A **project folder** is one folder on your computer that holds every file of an app: its pages, its settings and its logic. Cursor opens a project folder and lists its files on the left. The **agent** is the AI helper in the side panel. You describe what you want in plain words, it reads the files in that folder, changes some of them, and tells you what it did. Nothing it changes is final until you have looked at it." },
    { type: 'heading', text: 'An editor first, an agent second' },
    { type: 'paragraph', text: "Chat assistants (the ChatGPT and Claude courses in this path) see only what you paste. Terminal agents (the Claude Code course) work in your shell and you review their changes in Git. Cursor sits in between: the agent works where you already read and write code, so you can watch a diff appear, jump to the file, fix one line by hand and keep going. That closeness is its strength and its risk. It is easy to accept a change because it looks tidy in a nice diff view. The habit this course builds is simple: you read every diff, and nothing is done until the tests and the type checker say so." },
    { type: 'heading', text: 'The parts you will use' },
    {
      type: 'table',
      headers: ['Part', 'What it is for', 'Your job'],
      rows: [
        ['Tab', 'Predicts your next edit as you type, even several lines', 'Read the grey text before you press Tab'],
        ['Agent in the editor', 'Answers questions, plans and edits files from the side panel', 'Give context, review the diff, run checks'],
        ['Agents Window', 'Runs and manages many agents across projects at once', 'Keep tasks separate and review each result'],
        ['Cloud Agents', 'Long tasks on a cloud machine that end in a pull request', 'Review the pull request like a teammate wrote it'],
        ['Cursor CLI', 'The same agent in a terminal, also for scripts', 'Limit what it may run without asking'],
      ],
      caption: 'The surfaces of Cursor, from smallest to largest',
    },
    {
      type: 'version',
      text: 'Cursor\'s docs describe it as a coding agent for building software, built on the VS Code codebase. Agent opens in the editor\'s side panel with Cmd+I (Ctrl+I on Windows and Linux). The Agents Window, an agent-first workspace for running parallel agents across repos, local and cloud, became generally available with Cursor 3 on April 2, 2026; you open it from the command palette with "Open Agents Window". Cloud Agents run in isolated cloud environments and can open pull requests. The Cursor CLI runs the agent in a terminal with the `agent` command.',
      checked: CHECKED,
      sources: [S.overview, S.vscode, S.agentsWindow, S.cloudHelp, S.cli],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Here is the table in everyday terms. **Tab** works like the word suggestions on a phone keyboard: grey text appears and you press the Tab key to accept it. The **agent** is a helper sitting beside you who edits the files while you watch. The **Agents Window** is a screen for running several helpers at once. A **Cloud Agent** works on a computer owned by Cursor instead of yours, so it can keep going when your laptop is shut, and it hands back a **pull request**: a proposal for changes that someone must approve before they join the project. The **CLI** is the same agent inside a **terminal**, the text-only window where you type commands instead of clicking." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Choose a surface by two properties: who is watching, and how much can go wrong before a human sees it. Tab and the editor agent keep you in the loop on every edit. Cloud Agents and print-mode CLI runs are unattended, so the review gate moves to the pull request and to the permissions you set beforehand. The docs call out an asymmetry: Run Modes, the approval and sandbox settings, apply only to local agents, while Cloud Agents run on their own machines and never ask for approval, so the controls there are the repositories, secrets and network access you put into their environment. Their commits are authored as the agent, so review rules that check the author will see the agent's identity. Treat each surface as its own trust boundary with its own failure mode, and write down which kinds of task are allowed on which." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Run Modes apply only to local agents; Cloud Agents run in their own machines and never ask for approval. A Cloud Agent environment provides the repositories, dependencies, secrets and network access you configure in the dashboard. Cloud Agent commits are authored as the agent, not as the person who started the task, and the Co-authored-by trailer is not added for every agent.",
      checked: CHECKED,
      sources: [S.runModes, S.cloudHelp],
    },
    { type: 'heading', text: 'Which plan has what' },
    { type: 'paragraph', text: "Cursor's plans change often, and the features you can use depend on them. Before you design a workflow around Cloud Agents or automatic pull request review, check that your plan, or your company's plan, includes them. Do not quote prices from memory to a client or a manager: they change and differ by country." },
    {
      type: 'version',
      text: 'The Models & Pricing page lists Free (Agent, Chat and Tab with limited usage), Plus, Premium, Super, Ultra, Teams and Enterprise, sold as part of "The X Subscription". The pricing page says Plus includes Grok models only, and no Cloud Agents, Automations, Bugbot or third-party models; Premium and above add those. Subscriptions bought before that change are legacy plans (Hobby, Pro, Pro+, Ultra, Teams) that keep working. Check the pricing page for current prices in your country.',
      checked: CHECKED,
      sources: [S.pricing, S.pricingHelp],
      plans: 'Cloud Agents and Bugbot: Premium and above, and Teams; not Free or Plus. On an older plan, check the Legacy Cursor plans page',
    },
    { type: 'heading', text: 'What stays your job' },
    { type: 'list', items: [
      '**Deciding what to build.** The agent is fast at "how"; you own "what" and "why".',
      '**Reviewing every change.** Agent edits are saved to disk as it works, so Git is your safety net.',
      '**Proving it works.** Tests, type checks, a run in the browser. A confident summary is not proof.',
      '**Protecting secrets and client code.** Know your company\'s AI policy before you open their repository in any AI tool.',
    ] },
    { type: 'tip', text: "The difference between choosing a tool and mastering one: the first is covered in AI Basics for Tech (day 3). Here we assume your team already chose Cursor and go deep on how to use it well." },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-01-match-1',
        kind: 'match',
        title: 'Which part of Cursor?',
        prompt: 'Match each moment from a developer\'s week with the part of Cursor that fits it best.',
        concept: 'cursor surfaces',
        labels: { terms: 'The moment', meanings: 'Part of Cursor' },
        pairs: [
          { term: 'You are typing the third almost identical Express route handler and want the next lines filled in.', definition: 'Tab' },
          { term: 'You want a restock form, its API endpoint and a test added, and you will watch the diff as it happens.', definition: 'Agent in the editor side panel' },
          { term: 'You want three separate tasks running on the same repo at once, each in its own checkout.', definition: 'Agents Window' },
          { term: 'You want a long migration to keep running after you close your laptop and end as a pull request.', definition: 'A Cloud Agent' },
          { term: 'You want a nightly script in CI to ask the agent for a summary of new TODO comments.', definition: 'Cursor CLI' },
        ],
        hints: [
          'Sort by size: one line as you type, one task you watch, many tasks, a task that runs while you are away, a script.',
          'Running without your laptop open means the work is not on your machine.',
          'A script or CI job has no editor window, so it needs a terminal tool.',
        ],
        explanation: 'Tab handles the next lines as you type, the editor Agent handles a task you supervise, the Agents Window manages parallel tasks, Cloud Agents keep working without your machine, and the CLI fits scripts and CI.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Cursor is a VS Code based editor with an agent built in: Tab, Agent, the Agents Window, Cloud Agents and the CLI.',
        'Closeness to the code is the strength and the risk: read every diff instead of trusting a tidy view.',
        'Plans decide which features you have; check the pricing page, never quote prices from memory.',
        'You still own what to build, the review, the proof and the protection of secrets.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-01-q1',
      prompt: 'What mainly separates Cursor from a chat assistant in a browser?',
      choices: [
        'It uses a different kind of language model',
        'Its agent works inside your editor, reading and editing your project files directly',
        'It never makes mistakes because it can see the code',
        'It only works offline',
      ],
      answer: 1,
      explanation: 'The agent works in the editor with direct access to your files and terminal. It can still be wrong, which is why you review its diffs.',
    },
    {
      id: 'ai-dev-cursor-01-q2',
      prompt: 'Your team wants Bugbot to review every pull request. What do you check first?',
      choices: [
        'That the plan your team is on includes Bugbot, on the official pricing page',
        'A blog post from last year with the price',
        'Nothing, every Cursor plan includes everything',
      ],
      answer: 0,
      explanation: 'Features depend on the plan and plans change. The official pricing page is the source, not an old blog post.',
    },
    {
      id: 'ai-dev-cursor-01-q3',
      prompt: 'Which task is the best fit for Tab rather than the agent?',
      choices: [
        'Designing a new database schema',
        'Finishing a repetitive line you have already started typing',
        'Opening a pull request',
        'Investigating a race condition',
      ],
      answer: 1,
      explanation: 'Tab predicts your next edit as you type. Bigger work with several steps belongs to the agent.',
    },
    {
      id: 'ai-dev-cursor-01-q4',
      prompt: 'The agent says "Done, all tests pass." What makes the work actually done?',
      choices: [
        'The summary, because the agent ran the tests',
        'You have read the diff and seen the tests and type check pass yourself',
        'The diff view shows green lines',
      ],
      answer: 1,
      explanation: 'A summary is a claim. Reading the diff and seeing the checks pass with your own eyes is the proof.',
    },
    {
      id: 'ai-dev-cursor-01-q5',
      audience: { max: 'beginner' },
      prompt: "What is a project folder, in the words of this lesson?",
      choices: ["A setting that switches Cursor's AI features on", "A list of the AI helpers you have installed", "One folder on your computer that holds all the files of an app", "A saved copy of your last chat with the agent"],
      answer: 2,
      explanation: "A project folder holds every file of one app. Cursor opens it, shows its files on the left, and lets the agent read and change them. It is not a setting, a list of helpers or a chat history.",
    },
    {
      id: 'ai-dev-cursor-01-q6',
      audience: { min: 'advanced' },
      prompt: "A teammate says a Cloud Agent is as safe as the editor agent because it also asks before anything risky. What is wrong with that assumption?",
      choices: ["Nothing: Cloud Agents use the same approval prompts as the editor", "Cloud Agents cannot open pull requests, so approvals are never needed", "Cloud Agents are read-only, so there is no risk to manage at all", "Run Modes apply to local agents only; a Cloud Agent runs on its own machine without asking, so limit its repositories and secrets and review its pull request"],
      answer: 3,
      explanation: "The docs say Run Modes apply only to local agents and that Cloud Agents never ask for approval. The controls move to the environment you configure and to the review of the pull request, whose commits are authored as the agent.",
    },
  ],
  task: {
    title: 'Map Cursor to your week',
    minutes: 15,
    steps: [
      'Write down five coding tasks from your last week (or a school project).',
      'For each one, write which part of Cursor fits it: Tab, Agent, the Agents Window, a Cloud Agent or the CLI, and one sentence why.',
      'Open the official pricing page and note which of those parts your current plan (or the Free plan) includes.',
      'Write one rule for yourself about reviewing AI changes that you will follow for the rest of this course.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Open Cursor on any folder, even an empty one. Find the file list on the left, an editor tab and the agent panel. Write one sentence about what each is for, in your own words.",
        "Ask the agent in the side panel: 'In plain words, what is a code editor and what is a project folder?' Compare its answer with this lesson and note one difference.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Write a one-page table of the surfaces (Tab, editor agent, Cloud Agent, CLI in CI) with who watches, what the review gate is, and which kinds of task your team allows on each. Mark the rows that have no approval prompts.",
        "Pick one task from your backlog and decide where it should run and why. Note what evidence you would require in the pull request before merging it.",
      ],
    },
  ],
};

const l02: Lesson = {
  id: 'ai-dev-cursor-02',
  day: 2,
  title: 'Setting up Cursor for development',
  summary: 'Install Cursor, bring over your VS Code setup, and set privacy, ignore files and command approvals before the first real task.',
  minutes: 20,
  skills: ['cursor-setup'],
  intro: {
    objectives: [
      'Install Cursor and import your VS Code extensions, settings and keybindings',
      'Turn on Privacy Mode and add a .cursorignore before opening real code',
      'Choose a run mode that matches how much you trust the agent with commands',
      'Get SariStock running in Cursor as your practice project',
    ],
    why: 'Most bad surprises with an agent come from setup nobody looked at: a secret it could read or a command it ran without asking. Ten minutes now protects you and your client.',
  },
  body: [
    { type: 'paragraph', text: "A careful setup is the difference between an agent you can trust on client code and one you are nervous about. Today you install Cursor, bring your existing editor setup across, and decide three things before the first real task: what Cursor may send for training, which files it must never read, and which commands it may run without asking you." },
    { type: 'heading', text: 'Install and import' },
    { type: 'paragraph', text: "Download Cursor from the official site, sign in, and open a folder. If you come from VS Code you do not have to rebuild your setup by hand: Cursor can import your extensions, themes, settings and keybindings in one step. Some extensions may be missing, because Cursor installs extensions from a different registry, so check the few you depend on (your linter, formatter and test runner) right after the import." },
    {
      type: 'version',
      text: 'Install: macOS 12 and later (.dmg), Windows 10 and later (.exe), and Linux through apt, dnf or an AppImage. Import: open Cursor Settings with Cmd+Shift+J (Ctrl+Shift+J), go to General > Account, and under VS Code Import click Import; it brings extensions, themes, settings and keybindings. You can also export a VS Code profile and import it manually. Cursor uses the Open VSX extension registry, not the VS Code Marketplace, so not every extension is listed.',
      checked: CHECKED,
      sources: [S.quickstart, S.install, S.migrate, S.vscode],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "A few words first. **Installing** means putting a program on your computer. **Importing** copies the settings of another editor so you do not start from nothing. A **setting** is a switch or option in a program. **Extensions** are small add-ons that give an editor new abilities, such as pointing out mistakes in code. Before Cursor looks at any project, three choices protect you: what the company behind the AI may use for training, which files the agent must never read, and which commands it may run without asking you. A **command** is a typed instruction to the computer, for example 'run the tests'. The **terminal** is the window where commands are typed." },
    { type: 'heading', text: 'Privacy before code' },
    { type: 'paragraph', text: "When you use AI features, your prompt and the code context are sent to a model provider. Privacy Mode is the setting that stops that code being used for training. On a work laptop, ask whether your company manages it for you; on a personal account, turn it on yourself before you open anything you would not post publicly. Then add a `.cursorignore` to every project for files the agent should never read." },
    { type: 'code', language: 'text', label: '.cursorignore for SariStock', code: `# secrets and local data
.env*
server/data/*.db
# generated output
dist/
coverage/` },
    { type: 'paragraph', text: "This file uses the same pattern syntax as `.gitignore`. It keeps environment files, the local SQLite database and generated folders out of the agent's reach, so it never reads a real customer list or pastes an API key into a prompt." },
    {
      type: 'version',
      text: 'Privacy Mode: Cursor Settings > General > Privacy Mode; with it on, your code is never used for training. It is on by default for team members, and Teams and Enterprise admins can enforce it. Cursor already ignores .env files, .git/ and lock files, and respects .gitignore; .cursorignore adds more. Terminal commands and MCP tools run outside these file controls and may still read ignored files.',
      checked: CHECKED,
      sources: [S.privacy, S.ignore],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Here is the `.cursorignore` file above, line by line. A line that starts with `#` is a **comment**, a note for people that the computer skips. `.env*` means any file whose name begins with `.env`; the `*` stands for any characters. Such files usually hold passwords and keys. `server/data/*.db` means any file ending in `.db` inside the `server/data` folder, which here is the app's local database. `dist/` and `coverage/` are folders that tools create by themselves, and the AI gains nothing from reading them. Every line is a **pattern**, and Cursor's file tools will not read anything that matches one." },
    { type: 'heading', text: 'Decide what runs without asking' },
    { type: 'paragraph', text: "The agent can edit files in your workspace without asking (you review the diff afterwards), but terminal commands are where real damage happens: a `git push --force`, a `rm -rf`, a migration against the wrong database. Cursor's run modes decide which commands run straight away, which run in a sandbox, and which wait for you. Start strict and loosen only for commands you have watched it run safely many times, such as `npm test`." },
    {
      type: 'version',
      text: 'Run modes live in Cursor Settings > Agents > Approvals & Execution. In Cursor 3.6 and later the choices are Auto-review (the default: allowlisted commands run, others run in a sandbox when possible, the rest are screened by a classifier), Allowlist (only allowlisted commands run without approval; with sandboxing on, other supported commands can run in the sandbox) and Run Everything (no approval). The docs call Auto-review a best-effort guardrail, not a security boundary. Workspace trust is off by default and can be enabled with "security.workspace.trust.enabled": true.',
      checked: CHECKED,
      sources: [S.runModes, S.terminalHelp, S.agentSecurity],
    },
    { type: 'warning', text: "Never pick Run Everything on a repository that can reach production, holds client data, or has deploy scripts. One misread instruction is enough. If a teammate says it is faster, it is faster in the same way that driving without brakes is faster." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Plan for the failure of each control, not only its success. Ignore files stop Cursor's file tools, and the docs state that terminal commands and MCP tools run outside them. Auto-review is documented as a best-effort guardrail rather than a security boundary, because its classifier can make mistakes, and sandboxing is optional in Allowlist mode. The realistic threat is indirect prompt injection: instructions hidden in a README, an issue or a dependency that the agent reads as if you had written them. OWASP lists least privilege, human approval for high-risk actions and segregating untrusted content among its mitigations, and says it is unclear whether any foolproof prevention exists. In practice, keep production credentials off development machines, open unfamiliar repositories in a disposable environment, pre-approve only narrow commands, and remember that approvals protect you only when people actually read them." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Run Modes docs: in Auto-review, commands that are neither allowlisted nor sandboxable go to an LLM classifier, and 'the classifier can make mistakes'; in Allowlist mode there is no classifier and sandboxing is optional. The sandbox blocks network access by default and protects paths such as .git/config and .git/hooks. Cursor's security page says AI can behave unexpectedly due to prompt injection and calls Run Modes best-effort guardrails, not a hard security boundary; agents can edit workspace files without approval, except configuration files. OWASP LLM01 defines indirect prompt injection and says it is unclear whether foolproof prevention exists.",
      checked: CHECKED,
      sources: [S.runModes, S.agentSecurity, S.owasp],
    },
    { type: 'heading', text: 'Your practice project: SariStock' },
    { type: 'paragraph', text: "SariStock is a small inventory app for a sari-sari store: a React and TypeScript frontend (Vite), a Node.js and Express API, SQLite through `better-sqlite3`, and tests with Vitest. Products have a name, a price in centavos and a stock count; sales reduce stock; there is a low-stock list. Use the one you built in an earlier course, generate one with the prompt below, or use your own project." },
    { type: 'prompt', label: 'Generate SariStock in an empty folder (Agent)', text: 'Create a small app called SariStock in this empty folder. Frontend: React + TypeScript with Vite in client/. Backend: Node.js + Express + TypeScript in server/, SQLite with better-sqlite3, a products table (id, name, price_centavos INTEGER, stock INTEGER) and a sales table. Endpoints: GET /api/products, POST /api/sales (reduces stock, rejects a sale larger than stock), GET /api/products/low-stock. Tests with Vitest for the server. Add npm scripts: dev, test, typecheck. Keep it under 20 files. First show me the file list and wait for my OK before writing anything.' },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-02-arrange-1',
        kind: 'arrange',
        title: 'A safe first hour',
        prompt: 'Put these setup steps in the order a careful developer would do them on a new laptop with a client project.',
        concept: 'safe cursor setup',
        language: 'text',
        solution: [
          'Install Cursor and sign in with the approved account',
          'Import VS Code settings and check your key extensions work',
          'Turn on Privacy Mode (or confirm your company enforces it)',
          'Choose a strict run mode for terminal commands',
          'Add a .cursorignore for secrets and local data',
          'Open the client project and ask Agent to explain it',
        ],
        alternatives: [
          [
            'Install Cursor and sign in with the approved account',
            'Import VS Code settings and check your key extensions work',
            'Turn on Privacy Mode (or confirm your company enforces it)',
            'Add a .cursorignore for secrets and local data',
            'Choose a strict run mode for terminal commands',
            'Open the client project and ask Agent to explain it',
          ],
        ],
        reasons: [
          'Nothing else is possible until Cursor is installed under the right account.',
          'Importing early means your linter and test runner are ready.',
          'Privacy has to be decided before any client code is sent anywhere.',
          'Approvals must be set before the agent can run a command.',
          'Ignore rules must exist before the agent reads the project.',
          'Only now is it safe to point the agent at real code.',
        ],
        hints: [
          'Anything that protects the client code must happen before you open the client code.',
          'The very last step is the only one that sends client code to a model.',
          'Run mode and .cursorignore can go in either order, as long as both come before opening the project.',
        ],
        explanation: 'Install and import first, then every protection (privacy, approvals, ignore rules), and only then open the client project. The protections are useless if the agent has already read the code.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-02-scenario-1',
        kind: 'scenario',
        title: 'Faster, says the teammate',
        prompt: 'Choose the best response.',
        concept: 'run modes and risk',
        situation: 'You join a team maintaining an online shop. A teammate tells you to switch to Run Everything "because approvals slow you down". The repository has a deploy script and a .env file with production database credentials.',
        options: [
          { text: 'Keep a strict mode, allowlist only safe repeat commands like the test script, and make sure .env is ignored', consequence: 'You keep most of the speed for routine commands while anything risky still waits for you.', quality: 'best' },
          { text: 'Switch to Run Everything but promise to watch the agent closely', consequence: 'You will not catch every command in time; one mistaken deploy or migration is enough to hurt the business.', quality: 'poor' },
          { text: 'Approve every command by hand forever, including npm test', consequence: 'Safe, but you will start clicking Approve without reading, which is its own risk. Allowlisting safe commands is better.', quality: 'acceptable' },
        ],
        hints: [
          'Think about which commands are dangerous and which are routine.',
          'An allowlist lets the routine commands through without opening the door to everything.',
        ],
        explanation: 'The goal is speed on safe, repeated commands and a stop on everything else. Allowlisting the test script with a strict mode gives both; Run Everything removes the stop entirely.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Import your VS Code setup, then check the extensions you depend on (Cursor uses Open VSX).',
        'Decide privacy and add .cursorignore before opening real code; the terminal can still read ignored files.',
        'Start with a strict run mode and allowlist only commands you have seen run safely.',
        'Use SariStock (or your own project) as the practice codebase for the rest of the course.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-02-q1',
      prompt: 'Why might a VS Code extension you rely on be missing after importing into Cursor?',
      choices: [
        'Cursor deletes extensions it does not like',
        'Cursor installs extensions from the Open VSX registry, where not every extension is listed',
        'Extensions never work in Cursor',
      ],
      answer: 1,
      explanation: 'Cursor uses Open VSX rather than the VS Code Marketplace, so check your key extensions after importing.',
    },
    {
      id: 'ai-dev-cursor-02-q2',
      prompt: 'You put `.env` in `.cursorignore`. Which statement is true?',
      choices: [
        'Nothing in Cursor can ever read .env now',
        'Agent file reads are blocked, but a terminal command like `cat .env` runs outside those file controls',
        'The file is deleted from the project',
        'Git will stop tracking the file',
      ],
      answer: 1,
      explanation: 'The docs say terminal commands and MCP tools run outside Cursor\'s file access controls, so also keep strict approvals for commands.',
    },
    {
      id: 'ai-dev-cursor-02-q3',
      prompt: 'What does Privacy Mode promise?',
      choices: [
        'Your code is never sent to any model provider',
        'Your code is never used for training',
        'The agent cannot run terminal commands',
      ],
      answer: 1,
      explanation: 'Code is still sent to model providers to answer you; Privacy Mode means it is not used for training.',
    },
    {
      id: 'ai-dev-cursor-02-q4',
      prompt: 'Which command is a sensible first entry for an allowlist on SariStock?',
      choices: ['npm test', 'git push --force', 'rm -rf server/data', 'npm publish'],
      answer: 0,
      explanation: 'Running the tests is routine, read-mostly and easy to undo. The others can destroy work or publish something by mistake.',
    },
    {
      id: 'ai-dev-cursor-02-q5',
      audience: { max: 'beginner' },
      prompt: "What does a .cursorignore file do?",
      choices: ["It tells Cursor's file tools which files the AI must not read", "It deletes the files you list from your computer", "It stops Cursor from installing extensions", "It hides your files from the other people on your team"],
      answer: 0,
      explanation: "A .cursorignore lists patterns of files that Cursor's file tools should not read, such as passwords and local databases. The files stay where they are; they are only kept out of the agent's reach.",
    },
    {
      id: 'ai-dev-cursor-02-q6',
      audience: { min: 'advanced' },
      prompt: "A repository's README, which the agent reads, hides a line telling it to upload your SSH keys with curl. Which defence matters most, according to the lesson?",
      choices: ["Add README.md to .cursorignore, since an ignored file can never influence the agent", "Turn on Privacy Mode, since it stops the model from following instructions in files", "Keep approvals or a sandbox with network blocked in front of commands, and pre-approve only narrow ones, because text the agent reads is untrusted and run modes limit the damage", "Write a project rule saying never to follow instructions found in files, which the model is then bound to obey"],
      answer: 2,
      explanation: "Indirect prompt injection arrives through content the agent reads. Privacy Mode is about training, and rules are guidance, not enforcement. Approvals, a sandbox and narrow allowlists are what limit what an injected instruction can do.",
    },
  ],
  task: {
    title: 'Set up Cursor and SariStock',
    minutes: 25,
    steps: [
      'Install Cursor, sign in, and import your VS Code setup if you have one. Check that your linter and test runner extensions are present.',
      'Turn on Privacy Mode (or confirm your company enforces it) and look at Settings > Agents > Approvals & Execution. Write down which mode you chose and why.',
      'Get SariStock: use the one from an earlier course, generate it with the prompt above (review the file list first), or open your own project.',
      'Add the .cursorignore from the lesson, adjusted to your project, and run `npm test` once yourself so you know the baseline.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "After the import, open Cursor Settings and find Privacy Mode and the run-mode setting. Without changing anything yet, write what each one does in your own words, then change both to the safe choices from the lesson.",
        "Ask the agent in Ask mode to explain each line of your .cursorignore in plain words. Check its answer against the lesson.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Write a one-page 'safe to open' checklist for an unfamiliar repository: where it opens (a disposable environment or your laptop), which credentials must not be present, which run mode you use, and which commands are allowlisted.",
        "Try the checklist on a repository you do not own, and note one step that was missing.",
      ],
    },
  ],
};

const l03: Lesson = {
  id: 'ai-dev-cursor-03',
  day: 3,
  title: 'Understanding Tab, Chat, and Agent workflows',
  summary: 'Use Tab for the next edit, Ask mode for questions, and Agent, Plan or Debug mode for work, switching on purpose instead of by habit.',
  minutes: 20,
  skills: ['cursor-modes', 'cursor-review'],
  intro: {
    objectives: [
      'Accept, reject and partly accept Tab suggestions with the keyboard',
      'Pick Ask, Agent, Plan or Debug mode for a task and switch between them',
      'Send selected code to the agent with a shortcut instead of copy and paste',
      'Catch a wrong Tab suggestion before it reaches a commit',
    ],
    why: 'Using the biggest tool for every job wastes time and makes changes harder to review. Matching the mode to the task is what makes experienced Cursor users fast.',
  },
  body: [
    { type: 'paragraph', text: "Cursor gives you three kinds of help, and each has a different cost of being wrong. Tab finishes what you are typing: cheap, but easy to accept without reading. Chat, which Cursor now runs as Ask mode, answers questions and changes nothing. Agent changes files and runs commands: powerful, so it needs review. Knowing which one you are in is the first habit." },
    { type: 'heading', text: 'Tab: the next edit' },
    { type: 'paragraph', text: "Tab predicts your next edit from your recent changes, the surrounding code and linter errors. It can change several lines, add a missing import, and suggest a related edit somewhere else in the file. Accept with Tab, reject with Escape or by typing on, and accept part of a suggestion word by word when only its start is right. If suggestions distract you while you write prose or JSON, snooze Tab or switch it off for those file types." },
    {
      type: 'version',
      text: 'Tab: accept with Tab, reject with Escape or by typing, accept word by word with Cmd+Right Arrow (Ctrl+Right Arrow). After accepting, pressing Tab again jumps to the predicted next edit location, and Tab can suggest edits in other files through a portal at the bottom of the editor. Click the Tab status indicator (bottom right) to snooze it, turn it off globally, or turn it off for file types. Project rules do not affect Tab.',
      checked: CHECKED,
      sources: [S.tab, S.shortcuts, S.rules],
    },
    { type: 'paragraph', text: "Tab is still a prediction. Here is a suggestion that looks fine at a glance. SariStock stores prices as integer centavos, and Tab completed a formatting helper:" },
    { type: 'code', language: 'javascript', label: 'Accepted from Tab (has a bug)', code: `function formatPeso(centavos) {
  const pesos = centavos / 10;
  return '₱' + pesos.toFixed(2);
}

console.log(formatPeso(1250)); // prints ₱125.00, but 1250 centavos is ₱12.50` },
    { type: 'paragraph', text: "One character is wrong: there are 100 centavos in a peso, not 10. Nothing crashes, the type checker is happy, and a customer gets charged ten times too much on a receipt. This is why you read Tab's grey text before pressing Tab, and why money code needs a test with a known value." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the helper from Tab, line by line. A **function** is a named set of steps you can reuse, and `formatPeso` is this one's name; it receives a number called `centavos`. `const pesos = centavos / 10;` divides the amount by 10 and stores the result under the name `pesos`. `toFixed(2)` shows a number with exactly two decimals. `'₱' + pesos.toFixed(2)` glues the peso sign in front of it. `console.log(...)` prints a value so you can see it, and a line after `//` is a **comment** that the computer ignores. Since 100 centavos make a peso, 1250 centavos is ₱12.50, but dividing by 10 gives 125, so the code prints ₱125.00. The mistake is one character." },
    { type: 'heading', text: 'Ask, Agent, Plan and Debug' },
    { type: 'paragraph', text: "The side panel works in modes. Ask is read-only: use it to understand code without risk. Agent is the default and does the work. Plan researches and writes a plan you approve before any code is written. Debug gathers runtime evidence before fixing a bug (day 8). Switching mode starts a fresh context, so start a new chat when you change task." },
    {
      type: 'table',
      headers: ['Mode', 'Edits files?', 'Reach for it when'],
      rows: [
        ['Ask', 'No, read-only', 'You want to understand code or compare options'],
        ['Agent', 'Yes', 'The task is clear and small enough to review'],
        ['Plan', 'Yes, after you approve the plan', 'Several files, unclear scope, or several valid designs'],
        ['Debug', 'Yes', 'A bug you can reproduce but cannot explain'],
      ],
      caption: 'Modes in the agent panel',
    },
    {
      type: 'diagram',
      format: 'mermaid',
      source: `flowchart TD
  A[What do you need?] --> B{Change any code?}
  B -->|no| C[Ask mode]
  B -->|yes| D{Is the approach clear?}
  D -->|no| E[Plan mode, then build]
  D -->|yes| F{Is it a bug you cannot explain?}
  F -->|yes| G[Debug mode]
  F -->|no| H[Agent mode]`,
      caption: 'Choosing a mode before you type the prompt',
    },
    {
      type: 'version',
      text: 'Modes: Agent, Ask (read-only), Plan (edits after you approve the plan) and Debug. Cycle modes with Shift+Tab in the agent input or use the mode picker; Cmd+. (Ctrl+.) opens the mode menu and Cmd+/ cycles models. Cmd+I, Cmd+L and Cmd+K toggle the side panel; with code selected, Cmd+L or Cmd+K adds the selection to a new chat and Cmd+Shift+L adds it to the current chat. The help page says Cmd+K used to open inline edit, which has been replaced by this workflow. Rules apply in every mode.',
      checked: CHECKED,
      sources: [S.agentHelp, S.askHelp, S.shortcuts],
    },
    { type: 'tip', text: "Select the lines you are asking about and send them with the shortcut instead of pasting them. The agent then knows the file and line numbers, so its answer points to real code." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "The modes in plain words. **Ask** is like asking a question at a help desk: you get an answer and nothing in your project changes. **Agent** hands the job to a helper who edits the files. **Plan** asks the helper to write down the steps first so you can approve them. **Debug** is for a bug you cannot explain: the helper adds small notes to the program, you make the bug happen, and the notes show what really went wrong. A **new chat** is a clean conversation, which stops the helper from being confused by an old task. Pick the smallest mode that does the job." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Mode choice is risk management. Ask is read-only, so it is the default for exploring unfamiliar code or reading a diff. Plan buys a reviewable artefact before any edit, which pays off when the design is ambiguous or touches shared interfaces; review it as a design document, not as prose. Debug trades speed for evidence: it instruments the code and waits for your reproduction, which beats guessing for timing bugs, regressions and performance problems. Tab is the sharpest edge, because it fires continuously on your own keystrokes and the docs say project rules do not affect it, so conventions you encoded in rules do not constrain Tab; type checks, linters and tests in CI must. Keep chats short and single-purpose: a fresh context avoids stale constraints, and when a window nears capacity older parts are summarized, so early detail is no longer verbatim." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Rules docs: rules do not affect Cursor Tab or other AI features. Prompting docs: every chat shares a fixed context window; when it nears capacity, Cursor compresses older parts of the conversation into a summary. Debug Mode docs recommend it for bugs you can reproduce but cannot explain, race conditions and timing issues, performance problems and regressions.",
      checked: CHECKED,
      sources: [S.rules, S.prompting, S.debug],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-03-fix-bug-1',
        kind: 'fix-bug',
        title: 'The ten-times receipt',
        prompt: 'This helper came from Tab. Tap the line with the bug, then choose the fix.',
        concept: 'reviewing tab suggestions',
        language: 'javascript',
        code: `function formatPeso(centavos) {
  const pesos = centavos / 10;
  return '₱' + pesos.toFixed(2);
}`,
        bugLine: 2,
        fixes: [
          { line: '  const pesos = centavos / 100;', correct: true, why: 'There are 100 centavos in a peso, so 1250 centavos becomes 12.50.' },
          { line: '  const pesos = centavos * 100;', correct: false, why: 'Multiplying makes the number far bigger; 1250 centavos would print as 125000.00.' },
          { line: '  const pesos = Math.round(centavos / 10);', correct: false, why: 'Rounding does not fix the wrong divisor, and it throws away the centavos.' },
        ],
        tests: {
          kind: 'function',
          fn: 'formatPeso',
          cases: [
            { label: '1250 centavos', args: [1250], expected: '₱12.50' },
            { label: '5 centavos', args: [5], expected: '₱0.05' },
            { label: 'zero', args: [0], expected: '₱0.00' },
          ],
        },
        hints: [
          'Check the conversion with a number you know: how many centavos make one peso?',
          'Try 100 centavos. It should print ₱1.00.',
          'The divisor on line 2 should be 100.',
        ],
        explanation: 'Tab used 10 instead of 100. A test with a known value (1250 centavos is ₱12.50) catches it at once, which is why money code always gets one.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Tab predicts the next edit; read the grey text and test money and dates with known values.',
        'Ask mode is read-only, Agent does the work, Plan agrees the approach first, Debug finds evidence first.',
        'Shift+Tab cycles modes; switching mode starts a fresh context, so start a new chat for a new task.',
        'Send selected code with the shortcut so the agent sees the real file and lines.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-03-q1',
      prompt: 'You want to understand how sales reduce stock in SariStock without any chance of a file changing. Which mode?',
      choices: ['Agent', 'Ask', 'Debug', 'Plan'],
      answer: 1,
      explanation: 'Ask mode is read-only, so it explores and explains without editing.',
    },
    {
      id: 'ai-dev-cursor-03-q2',
      prompt: 'Only the first half of a Tab suggestion is right. What do you do?',
      choices: [
        'Accept it all and fix it later',
        'Accept it word by word up to where it goes wrong, then keep typing',
        'Turn Tab off forever',
      ],
      answer: 1,
      explanation: 'Partial accept (word by word) keeps the useful part and leaves the wrong part out.',
    },
    {
      id: 'ai-dev-cursor-03-q3',
      prompt: 'An old tutorial says "press Cmd+K to edit inline". What does Cursor\'s help page say now?',
      choices: [
        'Cmd+K deletes the selected code',
        'Inline edit was replaced: Cmd+K (like Cmd+L) sends the selection to the agent panel',
        'Cmd+K opens the terminal',
      ],
      answer: 1,
      explanation: 'The help page says Cmd+K used to open inline edit and that this has been replaced by sending the selected lines to Agent.',
    },
    {
      id: 'ai-dev-cursor-03-q4',
      prompt: 'Why start a new chat when you move from one task to another?',
      choices: [
        'Old conversations are deleted after an hour',
        'A fresh context keeps the agent focused on the new task instead of the old one',
        'Cursor charges per chat',
      ],
      answer: 1,
      explanation: 'Leftover context from a previous task can steer the agent in the wrong direction. The docs recommend a new chat when changing tasks.',
    },
    {
      id: 'ai-dev-cursor-03-q5',
      audience: { max: 'beginner' },
      prompt: "In plain words, what is the difference between Ask mode and Agent mode?",
      choices: ["Ask is for beginners and Agent is only for experts", "Ask checks your spelling and Agent checks your numbers", "Ask uses Tab to finish your sentences and Agent does not", "Ask only answers questions and changes nothing, while Agent can edit your files and run commands"],
      answer: 3,
      explanation: "Ask is read-only: it explains and explores. Agent can change files and run commands, which is why you review what it did. Both are open to everyone.",
    },
    {
      id: 'ai-dev-cursor-03-q6',
      audience: { min: 'advanced' },
      prompt: "Your team writes 'money is integer centavos, never floats' as a project rule, yet a Tab completion still produces float arithmetic and nobody notices until QA. What is the right lesson?",
      choices: ["Rules guide the agent modes but do not affect Tab, so put the invariant in types, lint checks or tests that run on every change", "Set alwaysApply to true and Tab will follow the rule from then on", "Use Tab only inside Ask mode, which always obeys project rules", "Rules are ignored whenever the file is open in an editor tab"],
      answer: 0,
      explanation: "The docs say rules do not affect Tab. An invariant that must hold belongs in something that cannot be skipped: a type, a linter rule or a test run in CI.",
    },
  ],
  task: {
    title: 'One task, three modes',
    minutes: 20,
    steps: [
      'In SariStock, select the function that records a sale and send it to a new chat with the shortcut. In Ask mode, ask what happens when the sale quantity is larger than the stock.',
      'Check the answer by reading the code yourself. Note one thing it got right and anything it got wrong.',
      'Switch to Plan mode in a new chat and ask for a plan to show "out of stock" on the product list. Read the plan but do not build it yet.',
      'Write a small helper by hand with Tab on, and note one suggestion you rejected and why.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Open any file with a few lines of code. Select two lines, send them to the agent in Ask mode, and ask 'Explain this line by line for someone who has never coded.' Check one sentence of the answer against the code.",
        "Write down, in your own words, when you would pick Ask, Agent, Plan or Debug.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Take a function with a boundary rule. Write the failing test first, then let Tab or the agent write the function, and record whether the suggestion passed on the first try.",
        "Choose a mode for a flaky test, a risky schema change and a quick code-reading question, and write one sentence of reasoning for each.",
      ],
    },
  ],
};

const l04: Lesson = {
  id: 'ai-dev-cursor-04',
  day: 4,
  title: 'Using Composer and agent capabilities',
  summary: 'Learn what "Composer" meant then and means now, and what Cursor\'s agent can actually do: search, edit, run, ask, plan and delegate.',
  minutes: 20,
  skills: ['cursor-modes', 'cursor-multi-file'],
  intro: {
    objectives: [
      'Explain what happened to the Composer panel and what Composer means in Cursor today',
      'List the tools Cursor\'s agent uses and what each can change',
      'Steer a running agent with queued and immediate messages',
      'Spot outdated Cursor instructions in an old tutorial or AI answer',
    ],
    why: 'Half the Cursor tutorials online describe an interface that no longer exists, and AI assistants repeat them. Knowing the history lets you translate old advice instead of getting lost.',
  },
  body: [
    { type: 'paragraph', text: "If you search for Cursor tutorials you will meet the word Composer everywhere: \"open Composer\", \"use Composer for multi-file edits\". It has meant two different things, and mixing them up is a common source of confusion, including in answers from AI chat assistants trained on older pages. Today you sort out the name, then learn what the agent can really do." },
    { type: 'heading', text: 'Composer then: a panel for multi-file edits' },
    { type: 'paragraph', text: "In 2024 Cursor had separate places for separate jobs: Chat for questions, and Composer for edits across several files, with an agent option inside it. In February 2025 the 0.46 release made Agent the default and merged Chat, Composer and Agent into one interface. So when an old tutorial says \"open Composer\", today you open the agent panel and pick a mode." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Some words to pin down. A **model** is the AI engine that produces the answers. Different models are good at different things, and Cursor lets you pick one, a bit like choosing which expert to ask. A **panel** is one area of the screen. 'Composer, the panel' was an area for editing many files, and 'Composer, the model' is one of the engines you can choose. Today there is a single agent panel, so a tutorial that says 'open Composer' means 'open the agent panel'. A **tutorial** can be out of date because software changes every few months, which is why this lesson sends you back to the official docs when something does not match your screen." },
    { type: 'heading', text: 'Composer now: Cursor\'s own model' },
    { type: 'paragraph', text: "Since Cursor 2.0 (October 2025), Composer is the name of a model that Cursor trains for agentic coding. It appears in the model picker next to models from other companies. Choosing it is a model choice, like choosing any other model, not a different panel." },
    {
      type: 'version',
      text: 'The 0.46 changelog (February 19, 2025) says Agent is now the default mode and there is "no more confusion between Chat, Composer, and Agent - just one smart interface". The 2.0 changelog (October 29, 2025) introduces Composer as Cursor\'s "first agentic coding model". Today the docs list Composer 2.5 as "Cursor\'s own agentic model", tuned for tool use, file edits and terminal work in Cursor, and draw it from the usage pool for Cursor models included with paid plans.',
      checked: CHECKED,
      sources: [S.changelog046, S.changelog20, S.composer, S.pricing],
    },
    { type: 'heading', text: 'What the agent can do' },
    { type: 'paragraph', text: "An agent is instructions (Cursor's prompt plus your rules), tools, and a model that decides which tool to call next. Its tools are what make it more than a chat: it searches files, reads them (images too), edits them, runs shell commands, searches the web, can drive a built-in browser, and can stop to ask you a clarifying question. It keeps going, tool after tool, until it thinks the task is done." },
    {
      type: 'diagram',
      format: 'mermaid',
      source: `flowchart LR
  P[Your prompt and rules] --> M{Model picks next step}
  M --> S[Search and read files]
  M --> E[Edit files]
  M --> T[Run a terminal command]
  M --> Q[Ask you a question]
  S --> M
  E --> M
  T --> M
  Q --> M
  M --> D[Summary and diff for you]`,
      caption: 'The agent loop: tools until the model decides it is done',
    },
    { type: 'paragraph', text: "Two features keep you in charge while it loops. You can queue a message: it waits until the current task finishes. Or you can send one immediately to redirect the work now. And for bigger jobs the agent can hand pieces to subagents, smaller agents with their own context, such as a built-in Explore subagent that searches widely and returns only what matters." },
    {
      type: 'version',
      text: 'Agent tools listed in the docs: search files and folders, web search, fetch rules, read files (including images), edit files, run shell commands, a browser, image generation and asking clarifying questions; there is no limit on the number of tool calls. While Agent works, Enter queues a message and Cmd+Enter sends it immediately. Built-in subagents are Explore (codebase search with a faster model) and Browser. A context ring next to the input shows how full the context window is.',
      checked: CHECKED,
      sources: [S.agentOverview, S.subagents, S.prompting],
    },
    { type: 'warning', text: "No tool-call limit means the agent can wander. If it starts editing files you did not expect, stop it, read what it changed, and restart with a narrower prompt. A long run is not a sign of good work." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "The agent loop in plain words. You write a request. The agent picks a first step, such as searching your files, looks at what it found, then picks the next step, such as changing a file or running a command. It repeats until it believes the job is done, then shows you a summary and the changes. A **tool** is one ability the agent can use, like a tool in a toolbox. A **subagent** is a smaller helper the main agent sends off to do one job with its own clean notebook, so the main conversation stays tidy. You can still step in: queue a message for later, or send one straight away to change direction." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "The loop's control points matter once a team relies on it. Every tool call adds to the context, so long runs consume window and money. Subagents isolate context, but each consumes tokens independently: the docs say five parallel subagents use roughly five times the tokens of one agent, and the startup overhead can make them slower than the main agent on simple tasks, so the benefit is isolation, not speed. Because the number of tool calls is not capped, bound a task with acceptance criteria that a command can check, such as 'tests pass and only these two files changed', and verify by diff rather than by the agent's summary. Pin a model deliberately for repeatable jobs: a custom subagent can inherit the parent's model or pin a specific one, and Cursor falls back to a compatible model if an admin blocks the pinned one." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Agent overview docs: there is no limit on the number of tool calls Agent can make during a task. Subagents docs: each subagent has its own context window; five parallel subagents use roughly five times the tokens of one agent; they add startup overhead and can be slower on simple tasks; a subagent's model field defaults to inherit or can pin a model ID, with a fallback to a compatible model if an admin blocks the pinned one; the docs recommend starting with two or three focused subagents.",
      checked: CHECKED,
      sources: [S.agentOverview, S.subagents],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-04-tap-reveal-1',
        kind: 'tap-reveal',
        title: 'Old advice, new Cursor',
        prompt: 'Each card is a claim from an old tutorial or an AI chat answer about Cursor. Tap to see what the current docs say.',
        concept: 'outdated tool advice',
        cards: [
          { front: '"Open Composer with Cmd+I and pick Normal mode for multi-file edits."', back: 'Outdated. Composer, Chat and Agent were merged into one panel in 0.46. Cmd+I opens the agent panel, where you choose Agent, Ask, Plan or Debug.' },
          { front: '"Composer is a model you can pick."', back: 'True today. Since Cursor 2.0, Composer is Cursor\'s own agentic coding model; the docs list Composer 2.5.' },
          { front: '"The agent can only change the file you have open."', back: 'False. The agent searches the project and edits as many files as the task needs, which is why you review every file in the diff.' },
          { front: '"Select code and press Cmd+K for an inline edit box."', back: 'Outdated. The help page says inline edit was replaced; Cmd+K now sends the selection to the agent panel.' },
        ],
        hints: [],
        explanation: 'Product names and shortcuts move fast. When advice and the current docs disagree, the docs win, and an AI answer about a tool is only as fresh as the pages it learned from.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Composer used to be the multi-file edit panel; in 0.46 it was merged with Chat and Agent into one agent panel.',
        'Since Cursor 2.0, Composer is Cursor\'s own agentic coding model, picked in the model picker.',
        'The agent loops through tools (search, read, edit, run, ask) until it decides it is done.',
        'Queue messages or send them immediately to steer; stop a run that wanders and narrow the prompt.',
        'Check old tutorials and AI answers about Cursor against the current docs.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-04-q1',
      prompt: 'A 2024 video says to "use Composer" to edit three files. What do you do in Cursor today?',
      choices: [
        'Install an old Cursor version',
        'Open the agent panel and use Agent (or Plan) mode',
        'Use Tab in each file',
      ],
      answer: 1,
      explanation: 'The 0.46 release merged Composer into the unified agent interface, so multi-file work happens in the agent panel.',
    },
    {
      id: 'ai-dev-cursor-04-q2',
      prompt: 'What is Composer 2.5, according to Cursor\'s docs?',
      choices: [
        'A settings page',
        'Cursor\'s own agentic coding model',
        'A Git extension',
        'The name of the Free plan',
      ],
      answer: 1,
      explanation: 'The docs describe Composer 2.5 as Cursor\'s own agentic model, tuned for tool use and edits inside Cursor.',
    },
    {
      id: 'ai-dev-cursor-04-q3',
      prompt: 'While the agent is working you realise it should also update the README. You do not want to interrupt it. What do you do?',
      choices: [
        'Press Enter to queue the message for after the current task',
        'Close Cursor',
        'Start a second chat on the same files',
      ],
      answer: 0,
      explanation: 'Enter queues the message; it runs after the current task. Cmd+Enter is for when you need to redirect it now.',
    },
    {
      id: 'ai-dev-cursor-04-q4',
      prompt: 'Why does the agent hand broad searches to an Explore subagent?',
      choices: [
        'So the search results do not fill up the main conversation\'s context',
        'Because the main agent cannot read files',
        'To avoid using a model',
      ],
      answer: 0,
      explanation: 'The subagent has its own context window and returns only the relevant findings, keeping the main conversation focused.',
    },
    {
      id: 'ai-dev-cursor-04-q5',
      audience: { max: 'beginner' },
      prompt: "In this lesson, what is a 'tool' of the agent?",
      choices: ["The hammer icon in the toolbar at the top of the screen", "A paid extra that you must buy before the agent works", "A shortcut key on the keyboard that starts a chat", "One ability the agent can use, such as searching files, editing a file or running a command"],
      answer: 3,
      explanation: "Tools are the abilities the agent calls in its loop: searching, reading, editing, running commands and asking you questions. The agent picks one after another until it thinks the task is done.",
    },
    {
      id: 'ai-dev-cursor-04-q6',
      audience: { min: 'advanced' },
      prompt: "A lead wants every migration task split across five parallel subagents 'for speed'. What is the trade-off the docs describe?",
      choices: ["Parallel subagents always finish sooner and cost the same as one agent", "Subagents share one context window, so they save tokens", "Each subagent consumes tokens independently, so five cost roughly five times one agent and add startup overhead; the benefit is context isolation, not speed", "Subagents cannot read files, so they are only useful for planning"],
      answer: 2,
      explanation: "The subagents docs say each one has its own context and its own token use, with startup overhead. Use them to keep long research out of the main conversation, not as a general speed-up.",
    },
  ],
  task: {
    title: 'Watch the agent loop',
    minutes: 20,
    steps: [
      'In SariStock, open the agent panel in Agent mode and ask: "Add a `GET /api/products/:id` endpoint that returns one product or a 404. Do not change other endpoints."',
      'While it works, note each tool it uses (search, read, edit, terminal) in order.',
      'Queue one follow-up ("also add a test for the 404 case") and watch when it runs.',
      'Read the full diff, run `npm test` yourself, and write two sentences on what the agent did well and what you had to check.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Ask the agent to explain, in plain words and in order, what it just did: which files it searched, read and changed, and which commands it ran. Compare its list with the one you wrote while watching.",
        "In your own words, write what 'Composer' meant in 2024 and what it means now.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Write an acceptance check for the endpoint task that a command can verify, such as the tests pass and `git diff --stat` lists only the expected files, and run it after the agent finishes.",
        "Run the same task once with a subagent doing the search, compare the context ring's breakdown with the first run, and note whether the isolation was worth the extra tokens.",
      ],
    },
  ],
};

const l05: Lesson = {
  id: 'ai-dev-cursor-05',
  day: 5,
  title: 'Project rules and configuration',
  summary: 'Write .cursor/rules files that load at the right moment, and know when AGENTS.md, user rules or team rules fit better.',
  minutes: 22,
  skills: ['cursor-context'],
  intro: {
    objectives: [
      'Write a project rule with the right frontmatter so it loads only when it should',
      'Choose between Always Apply, file-pattern, agent-selected and manual rules',
      'Decide when AGENTS.md, user rules or team rules are the better home',
      'Keep rules short by pointing at example files instead of copying them',
    ],
    why: 'A rule that loads at the wrong time wastes context or gets ignored; one that loads at the right time stops the same mistake every day. This is where your team\'s conventions start shaping every change the agent makes.',
  },
  body: [
    { type: 'paragraph', text: "Why write instructions down at all, and what goes in them, is covered in AI Basics for Tech (day 4). This lesson is about Cursor's own mechanics: where rule files live, the frontmatter that decides when each one loads, and how project, user, team and AGENTS.md instructions combine. Getting the loading right matters: every rule that loads takes space in the context window, and a rule that never loads might as well not exist." },
    { type: 'heading', text: 'Project rules live in .cursor/rules' },
    { type: 'paragraph', text: "A project rule is a Markdown file with a `.mdc` extension in `.cursor/rules/`, committed with the code so the whole team gets it. Three frontmatter fields decide when it is included: `alwaysApply`, `globs` (file patterns) and `description`. Here is a rule for SariStock's Express routes:" },
    { type: 'code', language: 'markdown', label: '.cursor/rules/express-routes.mdc', code: `---
globs: server/routes/**/*.ts
alwaysApply: false
---

- Validate the request body before any database call; return 400 with { error } on bad input.
- Money is integer centavos. Never use floats for prices.
- Wrap multi-step writes in db.transaction (better-sqlite3).
- Follow the pattern in @server/routes/sales.ts for new routes.
- Every new route gets a Vitest test in server/test/.` },
    { type: 'paragraph', text: "Because `globs` is set and `alwaysApply` is false, this rule attaches only when a matching route file is in context. Working on the React side never pays for it. The mention of `sales.ts` tells the agent where to look; the docs say the file is read with a tool when needed, not pasted into the prompt." },
    {
      type: 'table',
      headers: ['alwaysApply', 'description', 'globs', 'When it loads'],
      rows: [
        ['true', 'any', 'any', 'Every chat'],
        ['false', 'not set', 'set', 'When a matching file is in context'],
        ['false', 'set', 'not set', 'When the agent judges the description relevant'],
        ['false', 'not set', 'not set', 'Only when you @-mention the rule'],
      ],
      caption: 'How the three frontmatter fields combine',
    },
    {
      type: 'version',
      text: 'Project rules are .mdc files in .cursor/rules (a plain .md file there is ignored). The four types are Always Apply, Apply Intelligently (by description), Apply to Specific Files (globs, comma-separated) and Apply Manually (@-mention). Create one with /create-rule in chat or from Customize > Rules > Add Rule. The docs advise keeping rules under 500 lines and adding rules when the agent repeats a mistake. Rules apply in Agent, Ask, Plan and Debug, but not to Tab.',
      checked: CHECKED,
      sources: [S.rules, S.agentHelp],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Here is the rule file, line by line. The part between the two lines of `---` is the **frontmatter**: settings about the rule itself. `globs: server/routes/**/*.ts` is a pattern that names the files the rule belongs to: any `.ts` file in `server/routes`, however deep (`**` means any number of folders). `alwaysApply: false` means the rule is not loaded into every chat. Below the second `---` are the instructions, one per line starting with a dash. To **validate** means to check that the input makes sense before using it. A **transaction** is a group of database changes that either all succeed or all fail together. A **rule** is a note you write once so the agent follows it every time." },
    { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "By now you probably have a codebase with real conventions, so turn them into rules in layers: a short AGENTS.md or always-on rule for the stack and the commands to run, a glob-scoped rule for each area (routes, components, migrations), and a manual rule for rare procedures. After writing a rule, test it: open a file in scope, ask the agent which rules it is following, and check that a file out of scope does not load it. When the agent breaks a rule, the rule is usually too vague or too long, so rewrite it with an example file path instead of adding more words. Commit the rules with the code so the whole team gets the same behaviour." },
    { type: 'heading', text: 'AGENTS.md, user rules and team rules' },
    { type: 'list', items: [
      '**AGENTS.md** is plain Markdown with no frontmatter, in the project root and optionally in subfolders (a `server/AGENTS.md` for backend notes). Choose it when other tools on your team also read AGENTS.md, so one file serves everyone.',
      '**User rules** are your personal preferences across all projects, such as "answer briefly and list files you changed". Never put project conventions here: your teammates will not get them.',
      '**Team rules** are set by an admin in the dashboard and can be enforced. They are for company-wide policy, such as "never log personal data".',
    ] },
    {
      type: 'version',
      text: 'AGENTS.md is supported in the project root and subdirectories; nested files combine with their parents and the more specific one wins. User rules are set in Customize > Rules. Team rules are managed from the dashboard on Team and Enterprise plans, can be enforced, and take precedence: Team Rules, then Project Rules, then User Rules.',
      checked: CHECKED,
      sources: [S.rules],
      plans: 'Team rules: Teams and Enterprise',
    },
    { type: 'warning', text: "Rules are guidance, not a security control. Cursor's docs say so for enforced team rules too. A rule saying \"never read .env\" does not stop a terminal command from reading it; .cursorignore and approvals do that job." },
    { type: 'tip', text: "When the agent makes the same mistake twice, ask it in the same chat: \"Write a project rule that would have prevented this, scoped to the files involved.\" Then edit the rule yourself before committing it." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Think of a rule as a house rule pinned to the fridge. The agent reads it before it starts, but it can still make mistakes, so a rule is guidance, not a lock. If the agent keeps making the same mistake, that is a sign to write a rule about it. If you want to protect a secret, use the ignore file from lesson 2 as well, because a rule alone stops nothing. Keep each rule short and about one thing, and name an example file instead of copying code into the rule, so the example never goes out of date." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Rules are context, not enforcement. The docs say applied rules are included at the start of the model context, so every always-on rule costs tokens on every turn and competes with your task. Scope with globs and keep each rule short; the docs advise staying under 500 lines and splitting large rules into smaller ones. Referenced files such as @template.ts are not inlined: the agent reads them with its tools when needed, so anything that must always be present belongs in the rule body. Precedence runs Team, then Project, then User, and for enforced team rules used in compliance workflows the docs say AI guidance should not be your only security control. For conventions that must hold, back the rule with a check that cannot be talked out of it: a linter rule, a type, a test or a hook." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Rules docs: rule contents are included at the start of the model context; referenced files are not inlined and are read with tools when needed; keep rules under 500 lines and split large ones; Team Rules take precedence over Project Rules, then User Rules; for enforced Team Rules, AI guidance should not be your only security control; rules do not affect Cursor Tab.",
      checked: CHECKED,
      sources: [S.rules],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-05-fill-blank-1',
        kind: 'fill-blank',
        title: 'Scope the rule',
        prompt: 'This rule should load automatically whenever a React component file under client/src/components is in context, and at no other time. Fill in the frontmatter.',
        concept: 'project rule frontmatter',
        language: 'markdown',
        code: `---
globs: ___
alwaysApply: ___
---

- Components are named exports with a Props type.
- Show prices with formatPeso, never by dividing in the component.`,
        blanks: [
          { answers: ['client/src/components/**/*.tsx'], feedback: 'The pattern must match .tsx files in any folder under client/src/components.' },
          { answers: ['false'], feedback: 'If alwaysApply is true, the rule loads in every chat and the globs are ignored.' },
        ],
        bank: ['client/src/components/**/*.tsx', 'false', 'true', 'server/**/*.ts', '*.md'],
        hints: [
          'The glob should point at the folder the rule talks about, and at the file type React components use.',
          '`**` matches any number of folders.',
          'Setting alwaysApply to true would make the globs pointless.',
        ],
        explanation: 'A glob of client/src/components/**/*.tsx with alwaysApply false attaches the rule only when a matching component is in context, so backend work never loads it.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-05-match-1',
        kind: 'match',
        title: 'Where should this instruction live?',
        prompt: 'Match each instruction with the best place for it.',
        concept: 'choosing a rule type',
        labels: { terms: 'The instruction', meanings: 'Best home' },
        pairs: [
          { term: 'Every SQLite migration in server/migrations must have an up and a down step.', definition: 'A project rule with globs for the migrations folder' },
          { term: 'I prefer short answers that end with a list of the files you changed.', definition: 'A user rule' },
          { term: 'Company-wide: never paste customer personal data into prompts or logs.', definition: 'An enforced team rule' },
          { term: 'A long checklist for the yearly price-list import, needed twice a year.', definition: 'A manual rule you @-mention when needed' },
        ],
        hints: [
          'Ask of each one: who needs it (just you, the project, the whole company) and how often?',
          'Something needed twice a year should not load into every chat.',
          'Personal style is not a project convention.',
        ],
        explanation: 'File-specific conventions go in a rule scoped by globs, personal preferences in user rules, company policy in an enforced team rule, and rare procedures in a manual rule so they load only when you ask.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Project rules are .mdc files in .cursor/rules; alwaysApply, globs and description decide when they load.',
        'Scope rules with globs so they only cost context when relevant.',
        'AGENTS.md suits plain, shared instructions; user rules are personal; team rules are company policy.',
        'Point rules at example files instead of copying code into them.',
        'Rules guide the agent; they do not enforce security.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-05-q1',
      prompt: 'You saved a rule as `.cursor/rules/api.md` and it never applies. Why?',
      choices: [
        'Project rules must use the .mdc extension; a plain .md file there is ignored',
        'Rules only work on paid plans',
        'Rules only apply in Ask mode',
      ],
      answer: 0,
      explanation: 'The docs say a plain .md file in .cursor/rules is ignored because it has no frontmatter. Use .mdc, or put plain instructions in AGENTS.md.',
    },
    {
      id: 'ai-dev-cursor-05-q2',
      prompt: 'A rule has `alwaysApply: false`, a `description` and no `globs`. When is it used?',
      choices: [
        'In every chat',
        'When the agent decides the description is relevant',
        'Never',
        'Only in Tab',
      ],
      answer: 1,
      explanation: 'With a description and no globs, the agent reads the description and pulls the rule in when relevant.',
    },
    {
      id: 'ai-dev-cursor-05-q3',
      prompt: 'Which statement about rules and Tab is true?',
      choices: [
        'Rules change Tab suggestions',
        'Rules do not affect Tab; they guide the agent in its modes',
        'Tab only works when a rule is active',
      ],
      answer: 1,
      explanation: 'The rules docs say rules do not impact Cursor Tab.',
    },
    {
      id: 'ai-dev-cursor-05-q4',
      prompt: 'Why point a rule at `@server/routes/sales.ts` instead of pasting the route code into the rule?',
      choices: [
        'Pasted code goes stale as the real file changes, and the agent reads the file when it needs it',
        'Rules cannot contain code',
        'Pasting code is against the licence',
      ],
      answer: 0,
      explanation: 'Referencing a canonical file keeps the rule short and current; the agent reads the file with its tools when needed.',
    },
    {
      id: 'ai-dev-cursor-05-q5',
      audience: { max: 'beginner' },
      prompt: "In a rule file, what does the line alwaysApply: false say?",
      choices: ["The rule is switched off and never used", "The rule contains a mistake and needs fixing", "The rule is meant only for beginners", "The rule is not loaded into every chat; it is used only when its other settings, such as the file pattern, match"],
      answer: 3,
      explanation: "alwaysApply: false means the rule does not load into every chat. It still applies when its globs match a file in context, or when the agent judges its description relevant, or when you mention it.",
    },
    {
      id: 'ai-dev-cursor-05-q6',
      audience: { min: 'advanced' },
      prompt: "'Never log customer phone numbers' exists only as an always-apply project rule. Why is that not enough?",
      choices: ["Always-apply rules are ignored in Agent mode", "A rule is guidance placed in the model's context; it can be missed or outweighed by a prompt, so back it with a lint check, test or hook that blocks the violation", "Cursor rejects any rule that is longer than one line", "Always-apply rules only work for the first message of each chat"],
      answer: 1,
      explanation: "Rules shape what the model sees; they do not stop an action. The docs say AI guidance should not be your only security control, so enforce the invariant with something deterministic.",
    },
  ],
  task: {
    title: 'Two rules for SariStock',
    minutes: 20,
    steps: [
      'Create `.cursor/rules/express-routes.mdc` like the lesson\'s, adjusted to your folders, and a second rule scoped to your React components.',
      'Start a new chat, open a route file, and ask Agent "Which rules are you following right now?" Check that only the route rule is listed.',
      'Open a component instead and ask again. Check the component rule appears and the route rule does not.',
      'Commit both rules on a branch with a message that explains what they are for.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Write one rule in plain sentences first, such as 'Prices are always shown with the peso sign'. Then ask the agent to turn it into a rule file with the right frontmatter and to explain each line to you.",
        "Open a file the rule should cover and ask the agent which rules it is following. Check that your rule is on the list.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Pick one convention that must hold and write it twice: as a rule and as an automated check (a lint rule, a test or a hook). Make the agent break it on purpose and record which of the two catches it.",
        "Count your always-on rules and their total length in lines, and move one into a glob-scoped rule if it does not need to load everywhere.",
      ],
    },
  ],
};

const l06: Lesson = {
  id: 'ai-dev-cursor-06',
  day: 6,
  title: 'Using codebase indexing and context',
  summary: 'Know how the agent finds code, when to point it at files with @-mentions, and how to keep secrets and noise out of its context.',
  minutes: 20,
  skills: ['cursor-context'],
  intro: {
    objectives: [
      'Explain how Cursor\'s agent searches a codebase and what stays on your machine',
      'Attach the right context with @-mentions for files, terminals, diffs and past chats',
      'Read the context ring and react before the window fills up',
      'Tune ignore files so search is accurate and secrets stay out',
    ],
    why: 'The quality of every answer depends on what the agent read. When you control the context, you get answers about your code instead of confident guesses about code like it.',
  },
  body: [
    { type: 'paragraph', text: "An agent can only reason about what is in its context window: your prompt, rules, the files it read, and the conversation so far. Cursor helps it fill that window well by searching your project, but you decide a lot of it. Too little context and the agent guesses; too much and the important parts get crowded out." },
    { type: 'heading', text: 'How the agent finds code' },
    { type: 'paragraph', text: "When you mention a function name or an error string, the agent searches for it with exact and regular-expression search, the same way you would with grep, then opens the matches. For broad questions it can send an Explore subagent to run many searches and report back. Cursor also keeps a codebase index for semantic search, so a question in plain words (\"where do we check stock before a sale?\") can find code that never uses those words." },
    {
      type: 'version',
      text: 'The Search docs describe Instant Grep, a search engine that builds and queries its index on your machine and supports regex; Cursor says it does not upload file paths or code to build that index and does not store embeddings of your codebase for search. When the agent opens a match, that file content can be included in the model request. The 3.27 release notes say codebase indexing feeds semantic search. Settings include Indexing > Ignore Files > Hierarchical Cursor Ignore.',
      checked: CHECKED,
      sources: [S.search, S.releaseNotes, S.ignore],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "The **context window** is the amount of text the agent can keep in mind at one time: your request, the rules, the files it read and the conversation so far. Think of a desk: only so many papers fit, and a crowded desk makes the important paper easy to lose. To **search** a project means to look through its files for a word, the way you press Ctrl+F in a document, but across every file. An **index** is a prepared list of where things are, like the index at the back of a book, so searching is fast. Cursor builds its fast search index on your own computer, not on someone else's." },
    { type: 'heading', text: '@-mentions: pointing instead of hoping' },
    { type: 'paragraph', text: "Type `@` in the chat input to attach context directly. Use it when you already know what matters: the component and its test, the failing terminal output, your branch's diff. Skip it when you do not know where the code lives; the agent's own search is good at that, and a wrong @-mention can lead it astray." },
    {
      type: 'table',
      headers: ['You want the agent to see', 'Attach'],
      rows: [
        ['A file or a whole folder', '@ the file or folder name'],
        ['The output of a command you ran', '@Terminals'],
        ['Your uncommitted changes', '@Commit (Diff of Working State)'],
        ['Everything on your branch compared with main', '@Branch (Diff with Main)'],
        ['A decision from an earlier conversation', '@Chats'],
      ],
      caption: 'Common @-mentions',
    },
    {
      type: 'version',
      text: '@-mentions listed in the docs: files and folders, @Terminals, @Chats, @Commit (Diff of Working State), @Branch (Diff with Main) and @Browser. You can type @ several times to attach several items. Pasting code with Cmd+V adds it as a reference; Cmd+Shift+V pastes it as text. A context ring next to the input shows how full the window is, split into system prompt, tools, rules, skills, MCP, subagents, summarized conversation and conversation; near full, Cursor summarizes older parts.',
      checked: CHECKED,
      sources: [S.prompting, S.context, S.shortcuts],
    },
    { type: 'heading', text: 'Keeping noise and secrets out' },
    { type: 'paragraph', text: "Ignore files do two jobs: security (secrets, client data) and accuracy (no generated bundles or vendored code in search results). Cursor already skips files in `.gitignore`, lock files, `.env` files, `node_modules/`, images and many binary formats. Add the rest to `.cursorignore`, and add global patterns for keys and credentials in your user settings so every project is covered." },
    { type: 'code', language: 'text', label: 'Additions to .cursorignore for a bigger SariStock', code: `# vendored copy of an old library: noise in search
server/vendor/
# real exports from the store: personal data
exports/*.json
# keep one sample file visible to the agent
!exports/sample.json` },
    { type: 'paragraph', text: "The last line uses `!` to re-include one sample file so the agent can learn the export format without seeing real customers. Test a pattern with `git check-ignore -v <file>` because Cursor uses the same syntax." },
    { type: 'warning', text: "Ignored means hidden from Cursor's file tools, not from the machine. The docs warn that terminal commands and MCP tools can still read ignored files. Keep command approvals on, and never keep production credentials in a project you open with an AI tool." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the ignore lines above one by one. `server/vendor/` ignores a whole folder of code copied in from outside, which would only clutter the search results. `exports/*.json` ignores every `.json` file in the `exports` folder, because real exports hold customers' **personal data**: information that identifies a real person, such as a name next to a phone number. The last line starts with `!`, which means 'except': the single file `exports/sample.json` is let back in, so the agent can see what the format looks like without ever seeing real data. Lines that start with `#` are comments for people." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Context is a budget you allocate. The docs break the context ring into categories such as system prompt, tools, rules and conversation, so every always-on rule, every connected MCP server and every long chat draws on the same window; when it nears capacity Cursor summarizes older parts, so early decisions are no longer verbatim. Know what stays local and what leaves: Instant Grep builds and queries its index on your machine and Cursor says it does not store embeddings of your codebase for search, but when the agent opens a match that file content can be part of the model request. Ignore files control Cursor's file tools only; terminals and MCP tools can still read ignored files. In a large repository, confirm claims with exact regex search, scope with ignore patterns and path-specific rules, and start fresh chats instead of stretching one." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Search docs: Instant Grep builds and queries its index on your machine, supports full regex, and Cursor does not upload file paths or code to build the index or store embeddings of your codebase for search; when Agent opens a match, that file content can still be included in the model request. Prompting docs: the context ring opens a breakdown of token usage by category such as system prompt, tools, rules and conversation, and older parts of a conversation are summarized as the window fills.",
      checked: CHECKED,
      sources: [S.search, S.prompting],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-06-match-1',
        kind: 'match',
        title: 'What to attach',
        prompt: 'Match each situation with the context you would attach.',
        concept: 'choosing context',
        labels: { terms: 'Situation', meanings: 'Attach' },
        pairs: [
          { term: 'Vitest just printed three failures and you want them explained.', definition: '@Terminals' },
          { term: 'Before opening a pull request, you want a review of everything your branch changed.', definition: '@Branch (Diff with Main)' },
          { term: 'Yesterday you and the agent agreed to keep prices in centavos; today a new chat forgot.', definition: '@Chats' },
          { term: 'You want ProductCard.tsx and its test updated together.', definition: '@ both files' },
          { term: 'You have no idea where discounts are calculated.', definition: 'No @-mention: let the agent search' },
        ],
        hints: [
          'Think about where the information lives: a terminal, Git, an old conversation, specific files, or unknown.',
          'When you do not know the location, pointing would only be a guess.',
        ],
        explanation: 'Attach what you know is relevant (terminal output, a branch diff, an earlier chat, specific files) and let the agent search when you do not know where to look.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-06-scenario-1',
        kind: 'scenario',
        title: 'The ignored file that was read',
        prompt: 'Choose the best response.',
        concept: 'limits of ignore files',
        situation: 'Your .cursorignore lists `.env.production`. While debugging a connection error, the agent proposes running `cat .env.production` in the terminal to "check the database URL".',
        options: [
          { text: 'Reject the command, tell the agent the URL format without the password, and keep that file out of the project folder in future', consequence: 'The secret never enters the conversation, and the agent still gets what it needs to debug.', quality: 'best' },
          { text: 'Approve it, since the file is in .cursorignore and so it is protected', consequence: 'It is not protected from the terminal: the password is now in the model request and the chat history.', quality: 'poor' },
          { text: 'Approve it, then delete the chat afterwards', consequence: 'The secret was already sent. Deleting the chat does not undo that; you would need to rotate the password.', quality: 'poor' },
        ],
        hints: [
          'Does .cursorignore apply to terminal commands?',
          'What does the agent actually need: the password, or the shape of the URL?',
        ],
        explanation: 'Ignore files block Cursor\'s file tools, not the shell. Reject commands that would print secrets and give the agent a safe description instead.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'The agent finds code with fast local search, an Explore subagent and a codebase index for semantic search.',
        '@-mention what you know is relevant; let the agent search when you do not.',
        'Watch the context ring; start a fresh chat when a long one fills up with old material.',
        '.cursorignore and global ignores keep secrets and noise out, but terminal and MCP tools can still read files.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-06-q1',
      prompt: 'Which @-mention shows the agent your uncommitted changes?',
      choices: ['@Chats', '@Commit (Diff of Working State)', '@Terminals', '@Browser'],
      answer: 1,
      explanation: '@Commit (Diff of Working State) attaches uncommitted changes; @Branch (Diff with Main) attaches the whole branch.',
    },
    {
      id: 'ai-dev-cursor-06-q2',
      prompt: 'When is it better not to @-mention files?',
      choices: [
        'When you do not know which files are relevant, so the agent\'s search can find them',
        'Never; always mention every file',
        'When the task is about tests',
      ],
      answer: 0,
      explanation: 'The docs suggest skipping @-mentions when you are unsure; a wrong mention can steer the agent away from the real code.',
    },
    {
      id: 'ai-dev-cursor-06-q3',
      prompt: 'According to the Search docs, where does Instant Grep build its index?',
      choices: [
        'On your machine',
        'On a public server anyone can query',
        'Inside your Git history',
      ],
      answer: 0,
      explanation: 'Instant Grep builds and queries its index locally. Files the agent opens can still be sent in model requests.',
    },
    {
      id: 'ai-dev-cursor-06-q4',
      prompt: 'Why add `server/vendor/` to .cursorignore even though it holds no secrets?',
      choices: [
        'It makes the project build faster',
        'Vendored code adds noise to search results and context, making answers less accurate',
        'Cursor cannot read JavaScript in vendor folders',
      ],
      answer: 1,
      explanation: 'Ignoring irrelevant code is also about accuracy: the agent finds your code instead of a copy of someone else\'s.',
    },
    {
      id: 'ai-dev-cursor-06-q5',
      audience: { max: 'beginner' },
      prompt: "What is a 'context window', in plain words?",
      choices: ["A pop-up window that lists the files of your project", "A screen where you choose the colours of your code", "The amount of text the agent can keep in mind at one time: your request, the rules, the files it read and the conversation so far", "A list of everyone who has opened the project"],
      answer: 2,
      explanation: "The context window is the agent's working memory for a chat. When it is crowded, important parts can be lost or summarized, which is why you start a fresh chat for a new task.",
    },
    {
      id: 'ai-dev-cursor-06-q6',
      audience: { min: 'advanced' },
      prompt: "In a very large repository the agent's answers about one module keep drifting late in a long chat. What is the most defensible fix?",
      choices: ["Raise the model's temperature so that it explores more options", "Paste the whole module into the chat so that nothing can be missed", "Add the module to .cursorignore so that the agent stops reading it", "Start a fresh chat for the task, attach only what matters or let the agent search, and confirm its claims with exact search"],
      answer: 3,
      explanation: "A long chat fills the window and older parts are summarized. A fresh, focused chat plus exact search gives the agent clean context and gives you evidence. Ignoring the module would hide the code you want it to reason about.",
    },
  ],
  task: {
    title: 'Tune the context',
    minutes: 20,
    steps: [
      'Ask Agent in Ask mode: "Where does SariStock reduce stock after a sale? List file paths and line numbers." Open each one to check.',
      'Run `npm test` in the terminal, then ask about the output with @Terminals instead of pasting it.',
      'Click the context ring and note which category uses the most tokens.',
      'Review your .cursorignore: add one pattern for noise and one for anything sensitive, and test both with `git check-ignore -v`.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Use the search tool in the left sidebar to look for one word you know is in your project. Then ask the agent the same question in Ask mode and compare the two answers.",
        "In your own words, write what a context window is and why a fresh chat helps.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Open the context ring in a long chat and record how much each category uses. Remove or scope one always-on rule or unused MCP server, repeat in a fresh chat, and note the difference.",
        "Check one 'nothing else uses X' claim with an exact regex search, and list one kind of use that search could not see.",
      ],
    },
  ],
};

const l07: Lesson = {
  id: 'ai-dev-cursor-07',
  day: 7,
  title: 'Generating and modifying multiple files',
  summary: 'Build a full-stack SariStock restock feature across React, Express, SQLite and tests, with a plan first and a file-by-file diff review after.',
  minutes: 25,
  skills: ['cursor-multi-file', 'cursor-review'],
  intro: {
    objectives: [
      'Plan a full-stack change in Plan mode before any code is written',
      'Review a multi-file diff file by file and reject what you did not ask for',
      'Catch a validation bug in generated Express code with a test',
      'Roll back a wrong turn with a checkpoint',
    ],
    why: 'Changes that span React, an API and a database are where agents save the most time and where unreviewed mistakes do the most damage. This is the core skill employers expect from a Cursor user.',
  },
  body: [
    { type: 'paragraph', text: "Today you build a real feature across the stack: a restock form in React, a `POST /api/products/:id/restock` endpoint in Express, a `restocks` table in SQLite that keeps a history, and Vitest tests. That is five or six files. The agent can write all of it in a minute; your job is to make sure it is the right change, and that you have read every line before it reaches a commit." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Some words for the feature. The **frontend** is the part users see and tap, here a React form. The **backend**, or **server**, is the program that receives requests and keeps the rules; Express is a tool for building one. The **database**, SQLite here, is where information is stored in **tables**, a bit like spreadsheets with rows. An **endpoint** is an address the server answers, such as `/api/products/7/restock`. **Validation** means checking that what arrived makes sense before using it, for example that a quantity is a whole number from 1 to 1000. One feature touches all of these, which is why the agent changes several files at once and why you read every one." },
    { type: 'heading', text: 'Plan first' },
    { type: 'paragraph', text: "For a change across layers, start in Plan mode. The agent researches the code, asks clarifying questions and writes a plan you can edit. Read it like a design review: does it follow the existing sales route, does it validate input on the server (never only in the form), does the database change come as a new migration?" },
    { type: 'prompt', label: 'Plan the restock feature (Plan mode)', text: 'Plan a restock feature for SariStock. Server: POST /api/products/:id/restock with JSON body { quantity }, quantity a whole number from 1 to 1000; return 400 with { error } on bad input and 404 if the product does not exist. Add a restocks table (id, product_id, quantity, created_at) in a new migration, and update stock and insert the restock row in one transaction. Follow @server/routes/sales.ts. Client: a RestockForm component on the product page that shows the new stock or the error. Tests: Vitest for validation and the route. Do not add dependencies or change existing endpoints. List every file you will create or change.' },
    {
      type: 'diagram',
      format: 'mermaid',
      source: `sequenceDiagram
  participant F as RestockForm (React)
  participant A as Express API
  participant D as SQLite
  F->>A: POST /api/products/7/restock
  A->>A: validate quantity
  A->>D: insert restock and update stock
  D-->>A: new stock
  A-->>F: 200 with product, or 400 / 404`,
      caption: 'The restock request across the stack',
    },
    { type: 'heading', text: 'The server code to expect' },
    { type: 'code', language: 'typescript', label: 'server/routes/restock.ts (what a good result looks like)', code: `import { Router } from 'express';
import { db } from '../db';
import { validateRestock } from '../lib/validate-restock';

export const restockRouter = Router();

const addStock = db.transaction((productId: number, quantity: number) => {
  db.prepare('INSERT INTO restocks (product_id, quantity) VALUES (?, ?)').run(productId, quantity);
  return db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(quantity, productId);
});

restockRouter.post('/products/:id/restock', (req, res) => {
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'product not found' });
  const check = validateRestock(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });
  addStock(Number(req.params.id), check.quantity);
  res.json(db.prepare('SELECT id, name, stock FROM products WHERE id = ?').get(Number(req.params.id)));
});` },
    { type: 'paragraph', text: "Validation sits in its own small function so it can be tested without a server, and the insert and update run in one `better-sqlite3` transaction, so a crash between them cannot leave a restock row without the stock change. Check also that the app uses `express.json()`; without it `req.body` is undefined and every request fails validation." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading `restock.ts` line by line. The first three lines bring in tools from other files. `db.transaction` wraps two database changes, saving the restock record and adding to the stock, so either both happen or neither does. In the route, `req.params.id` is the product number taken from the address. The code first looks the product up and answers 404 (not found) if it does not exist. `validateRestock(req.body)` checks the data that came with the request, and if it fails the code answers 400 (bad request). Only then does it add the stock and send back the updated product. The order matters: look up, validate, then change." },
    { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "You have built features like this before, so use the agent for the tedious parts and keep the decisions. In Plan mode, ask for the API contract first (status codes, error shape, request and response types) and the migration, then check that they match your existing endpoints. Ask for tests next to the code: unit tests for the validator and one route test against an in-memory database. If the feature needs authentication, say so in the plan: which routes need a token, what a missing token returns, and where the secret is read from. Reject any hardcoded secret, any dependency you did not ask for, and any edit to a migration that has already been applied." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Multi-file changes fail at the seams, so review the seams. Check that the server owns every invariant, since the client's validation is only a convenience; that the multi-step write is atomic and, where retries can happen, idempotent (a restock endpoint called twice adds twice unless you design otherwise); and that the migration is additive and safe against existing data and rolling deploys. Look for what the diff leaves out: authorization on the route, a rate limit, an index for the new lookup, error responses that leak internals, and logging of personal data. Plan mode is cheap insurance because you review a design before code exists. Checkpoints restore files only, locally and separately from Git, so commit before risky steps and keep each commit revertable. For a team, require the plan, the test output and the list of rejected agent changes in the pull request." },
    { type: 'heading', text: 'Review the diff file by file' },
    { type: 'list', ordered: true, items: [
      'Read the list of changed files first. Anything you did not expect (a new dependency in package.json, an edited old migration) is a stop sign.',
      'Review the server, then the database, then the client, then the tests. Ask: is the input checked on the server? Are amounts integers?',
      'Reject a single file you disagree with instead of accepting everything and fixing it later.',
      'Run the tests and the type checker yourself, then click through the form once in the browser.',
    ] },
    {
      type: 'version',
      text: 'Plan Mode: Shift+Tab from the chat input; the agent asks clarifying questions, researches, and writes a plan you can edit before you build it. Plans are saved in your home directory by default; "Save to workspace" moves one into the project. Agent edits appear in the diff view as it works; with suggested changes, Cmd+Return accepts all and Cmd+Shift+Backspace rejects all. Checkpoints are created automatically before significant changes; restoring one reverts files only, is stored locally and is separate from Git.',
      checked: CHECKED,
      sources: [S.planMode, S.agentHelp, S.shortcuts, S.agentOverview],
    },
    { type: 'tip', text: "If the result is far from what you wanted, do not argue with it for ten messages. Restore the checkpoint, make the plan more specific, and run it again. The Plan Mode docs recommend exactly this." },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-07-fix-bug-1',
        kind: 'fix-bug',
        title: 'Restocking zero',
        prompt: 'The agent generated this validator. The plan said quantity must be a whole number from 1 upwards. Find the line with the bug and choose the fix.',
        concept: 'validating generated code',
        language: 'javascript',
        code: `function validateRestock(body) {
  const quantity = Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { ok: false, error: 'quantity must be a whole number above 0' };
  }
  return { ok: true, quantity };
}`,
        bugLine: 3,
        fixes: [
          { line: '  if (!Number.isInteger(quantity) || quantity <= 0) {', correct: true, why: 'Zero and negative numbers are now rejected, and non-numbers still fail the integer check.' },
          { line: '  if (quantity <= 0) {', correct: false, why: 'This drops the integer check: "abc" becomes NaN, NaN <= 0 is false, so garbage passes.' },
          { line: "  if (!Number.isInteger(quantity) || quantity === '0') {", correct: false, why: 'quantity is already a number, so it never equals the string \'0\'; zero still passes.' },
        ],
        tests: {
          kind: 'function',
          fn: 'validateRestock',
          cases: [
            { label: 'five', args: [{ quantity: 5 }], expected: { ok: true, quantity: 5 } },
            { label: 'text from a form', args: [{ quantity: '12' }], expected: { ok: true, quantity: 12 } },
            { label: 'zero', args: [{ quantity: 0 }], expected: { ok: false, error: 'quantity must be a whole number above 0' } },
            { label: 'not a number', args: [{ quantity: 'abc' }], expected: { ok: false, error: 'quantity must be a whole number above 0' } },
            { label: 'decimal', args: [{ quantity: 2.5 }], expected: { ok: false, error: 'quantity must be a whole number above 0' } },
          ],
        },
        hints: [
          'Test the edges: what happens with a quantity of exactly 0?',
          'The error message says "above 0", but the comparison lets one value through.',
          'Change the comparison on line 3 from < to <=.',
        ],
        explanation: 'The check used < 0, so a restock of 0 was accepted and would add a useless history row. Edge-value tests (0, text, decimals) are the fastest way to catch this in generated validation code.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-07-scenario-1',
        kind: 'scenario',
        title: 'Seven files changed',
        prompt: 'Choose the best response.',
        concept: 'reviewing multi-file diffs',
        situation: 'You asked for the restock feature. The diff shows the five files from the plan, plus package.json (a new validation library added) and an edit to the existing 001_init.sql migration that adds the restocks table.',
        options: [
          { text: 'Reject the package.json change and the edit to the old migration, ask for the table in a new migration with the existing validator style, then review again', consequence: 'The feature lands without a surprise dependency and without breaking databases that already ran 001_init.sql.', quality: 'best' },
          { text: 'Accept all; the tests pass on your machine', consequence: 'Your fresh database passes, but every existing database already ran 001 and will never get the new table.', quality: 'poor' },
          { text: 'Accept the five planned files and reject the other two, without telling the agent why', consequence: 'Better, but the agent does not learn the rule; add it to your rules file so it does not happen again.', quality: 'acceptable' },
        ],
        hints: [
          'Compare the changed files with the plan.',
          'What happens to a database that already ran the first migration if you edit that file?',
        ],
        explanation: 'Unplanned files are where the risk hides. Applied migrations must never be edited, and new dependencies need a human decision. Reject them, say why, and record the rule.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Plan full-stack changes in Plan mode and read the plan like a design review.',
        'Validate on the server, use transactions for multi-step writes, and keep validation testable.',
        'Review the list of changed files first; unplanned files are the biggest risk.',
        'Test the edges (0, text, decimals) of any generated validation.',
        'Restore a checkpoint and refine the plan instead of patching a wrong result for ten messages.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-07-q1',
      prompt: 'Why put the restock validation in its own function?',
      choices: [
        'So it can be unit tested without starting the server',
        'Because Express cannot validate input',
        'To make the file longer',
      ],
      answer: 0,
      explanation: 'A pure function is quick to test with edge values, which is where generated validation code usually goes wrong.',
    },
    {
      id: 'ai-dev-cursor-07-q2',
      prompt: 'The agent edited an existing, already-applied migration file. What is the problem?',
      choices: [
        'None, SQL files can be edited at any time',
        'Databases that already ran it will never get the change; a new migration is needed',
        'It makes the tests slower',
      ],
      answer: 1,
      explanation: 'Applied migrations are history. Existing databases skip them, so changes must come as a new migration.',
    },
    {
      id: 'ai-dev-cursor-07-q3',
      prompt: 'What does restoring a checkpoint undo?',
      choices: [
        'The files the agent changed after that point; the conversation stays',
        'Your Git commits on the remote',
        'Everything, including the chat messages',
      ],
      answer: 0,
      explanation: 'Restoring reverts files only and does not remove messages. Checkpoints are local and separate from Git.',
    },
    {
      id: 'ai-dev-cursor-07-q4',
      prompt: 'All tests pass. What is still worth doing before you commit the restock feature?',
      choices: [
        'Nothing, passing tests prove it all works',
        'Run the type checker and try the form in the browser with a bad quantity',
        'Delete the tests to keep the repo small',
      ],
      answer: 1,
      explanation: 'Tests cover what someone thought to test. A type check and one real run in the browser catch wiring problems tests often miss.',
    },
    {
      id: 'ai-dev-cursor-07-q5',
      audience: { max: 'beginner' },
      prompt: "In this lesson, what is an 'endpoint'?",
      choices: ["A button the user presses to finish the app", "The last file the agent changes in a task", "An address on the server that answers one kind of request, such as restocking a product", "The end of a Plan mode session"],
      answer: 2,
      explanation: "An endpoint is an address on the server, like /api/products/7/restock, that receives a request and sends back an answer. The form in the frontend calls it.",
    },
    {
      id: 'ai-dev-cursor-07-q6',
      audience: { min: 'advanced' },
      prompt: "The restock endpoint passes its tests, but the shop's network is flaky and the app retries a timed-out POST. Which risk did the plan not cover?",
      choices: ["A retried request can add the same restock twice, so the endpoint needs an idempotency key or another way to make repeats safe", "The transaction refuses the second request automatically", "SQLite rejects any two restocks with the same quantity", "Validation rejects the retry because the stock has changed"],
      answer: 0,
      explanation: "Validation checks the shape of one request and the transaction makes one request atomic. Neither recognises a repeat of the same request, so the design needs an idempotency key or a unique request id.",
    },
  ],
  task: {
    title: 'Ship the restock feature',
    minutes: 25,
    steps: [
      'Create a branch. Run the Plan mode prompt from the lesson on SariStock and edit the plan until it matches what you want.',
      'Build it. Review the changed-file list first, then each file; reject anything unplanned and say why.',
      'Make sure there are tests for 0, text, a decimal and a missing product. Run `npm test` and the type checker yourself.',
      'Try the form in the browser with a valid and an invalid quantity, then commit with a message that describes the feature.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Before building, ask the agent in Ask mode to explain each file in the plan in one sentence, using a shop analogy. Then write which file is the frontend, which is the backend and which touches the database.",
        "After it is built, point to the line that answers 404 and the line that answers 400, and say in your own words when each happens.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Add an idempotency key to the restock request (a client-generated id stored with the restock row, so a repeat is ignored) and a test that posts the same request twice.",
        "In the pull request, record what you checked besides the tests: authorization, migration safety, query cost and any logged personal data.",
      ],
    },
  ],
};

const l08: Lesson = {
  id: 'ai-dev-cursor-08',
  day: 8,
  title: 'Debugging through AI-assisted workflows',
  summary: 'Use Debug mode, terminal context and checkpoints to find root causes with evidence instead of letting the agent guess at fixes.',
  minutes: 22,
  skills: ['cursor-modes', 'cursor-review'],
  intro: {
    objectives: [
      'Run a Debug mode session: hypotheses, instrumentation, reproduction, fix and clean-up',
      'Give the agent the error, the steps and the expected result in one message',
      'Predict what a common type bug in generated JavaScript prints',
      'Reject a fix that hides a symptom instead of removing the cause',
    ],
    why: 'An agent that guesses can make an error message disappear while the bug stays. Debugging with evidence is how you fix a production bug once instead of three times.',
  },
  body: [
    { type: 'paragraph', text: "A shopkeeper reports that after restocking 5 packs of pancit canton, the screen shows a stock of 105 instead of 15. There is no error and no crash. This is the kind of bug where an agent left alone will often guess: it might add `Math.min` somewhere or round the number, the screen looks plausible, and the real cause stays in the code. Cursor's Debug mode is built to avoid that by collecting runtime evidence first." },
    { type: 'heading', text: 'What happened' },
    { type: 'code', language: 'javascript', label: 'Generated client code for an optimistic update (has a bug)', code: `const product = { name: 'Pancit canton', stock: 10 };
const body = { quantity: '5' }; // read straight from an <input>, so it is text

product.stock = product.stock + body.quantity;
console.log(product.stock); // prints 105
console.log(typeof product.stock); // prints string` },
    { type: 'paragraph', text: "In JavaScript, `+` with a string joins text: 10 + '5' is '105'. The server stores the right number, but the React state shows the joined string until the page reloads. The real fix is to convert the input to a number once, at the edge (`Number(value)` and a check), not to patch the display." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the code line by line. `const product = { name: 'Pancit canton', stock: 10 };` makes a record with a name and a stock of 10. The next line makes `body`, the data that came from the form. Text typed into a form arrives as **text**, called a *string*, so the 5 is written `'5'` in quotes rather than as the number 5. `product.stock + body.quantity` looks like addition, but when one side is text, `+` joins the two pieces instead: 10 and '5' become '105'. `typeof` reports what kind of value something is, here `string`. A **bug** is a mistake in a program, and this one shows no error message, only a wrong number." },
    { type: 'heading', text: 'Debug mode, step by step' },
    {
      type: 'diagram',
      format: 'mermaid',
      source: `flowchart TD
  A[Describe bug, steps, expected vs actual] --> B[Agent explores and lists hypotheses]
  B --> C[Agent adds log statements]
  C --> D[You reproduce the bug]
  D --> E[Agent reads the logs]
  E --> F[Small fix at the root cause]
  F --> G[You reproduce again to verify]
  G --> H[Agent removes the instrumentation]`,
      caption: 'A Debug mode session',
    },
    {
      type: 'version',
      text: 'Debug Mode: the agent explores and generates hypotheses, adds log statements that send data to a local debug server running in a Cursor extension, asks you to reproduce the bug, analyzes the logs, makes a targeted fix, and removes the instrumentation once you confirm. Switch to it with Shift+Tab or the mode picker. The docs recommend it for bugs you can reproduce but cannot explain, timing issues, performance problems and regressions.',
      checked: CHECKED,
      sources: [S.debug, S.agentHelp],
    },
    { type: 'prompt', label: 'A good Debug mode opening', text: 'Bug: after restocking a product, the product page shows the wrong stock until reload. Steps: open product 7 (stock 10), enter 5 in the restock form, submit. Expected: 15. Actual: 105. The database has 15 after reload, so I think the client state is wrong. Relevant: @client/src/components/RestockForm.tsx. Find the root cause with evidence before changing code, and keep the fix minimal.' },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Debug mode in plain words: instead of guessing, the helper works like a detective. It lists suspects, called **hypotheses**, and adds small notes called **log statements** that print what the program is doing. Then it asks you to make the bug happen and reads the notes to find the real cause. To **reproduce** a bug means to make it happen again on purpose by following exact steps. A good bug report has three parts: what you did, what you expected, and what actually happened. The more exact these are, the less the helper has to guess." },
    { type: 'heading', text: 'Evidence you can attach' },
    { type: 'list', items: [
      '**Terminal output:** run the failing test or the server and attach it with @Terminals instead of retyping it.',
      '**A screenshot:** paste it into the chat for UI bugs; vision-capable models can read it.',
      '**The selection:** select the suspicious lines and add them with Cmd+Shift+L (Ctrl+Shift+L).',
      '**What changed:** if it used to work, attach @Branch (Diff with Main) and ask which change could cause it.',
    ] },
    {
      type: 'version',
      text: 'You can attach terminal output with @Terminals, paste images and screenshots with Cmd+V, and add selected code to the chat with Cmd+Shift+L. The agent can read image files and include them for vision-capable models.',
      checked: CHECKED,
      sources: [S.prompting, S.shortcuts, S.agentOverview],
    },
    { type: 'warning', text: "Logs added for debugging can capture personal data: names, phone numbers, totals. Make sure the instrumentation is removed before you commit, and never paste a real customer's details into the chat to reproduce a bug. Use made-up data." },
    { type: 'tip', text: "Before you accept any fix, ask: \"Which line caused this, and why does your change remove the cause rather than the symptom?\" If the answer is vague, the fix probably is too. Then write a test that fails before the fix and passes after." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Treat the agent's fix as a hypothesis until evidence confirms it. Debug mode instruments the code with log statements that send data to a local debug server, asks you to reproduce the bug, and fixes from the logs, which suits race conditions, performance problems and regressions where reading code is not enough. Insist on a failing test that reproduces the defect before the fix, so the regression stays caught, and review the removal of the instrumentation in the diff. Check that the fix sits at the boundary where the bad value enters, not where it shows. Watch for logs that capture personal data or secrets, and for fixes that hide the symptom: caps, blind retries, catch blocks that swallow errors. For production issues, bring the telemetry you already trust, such as traces, error reports or a git bisect result, as evidence instead of asking the agent to infer causes from code alone." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Debug Mode docs: six stages (investigate, instrument with log statements that send data to a local debug server in a Cursor extension, reproduce, analyze, fix, verify and clean up, after which the agent removes all instrumentation); recommended for bugs you can reproduce but cannot explain, race conditions and timing or async issues, performance problems and memory leaks, and regressions.",
      checked: CHECKED,
      sources: [S.debug],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-08-predict-output-1',
        kind: 'predict-output',
        title: 'Stock after a restock',
        prompt: 'The form value arrives as text. What does this code print?',
        concept: 'string and number bugs',
        language: 'javascript',
        code: `const product = { stock: 10 };
const body = { quantity: '5' };
product.stock = product.stock + body.quantity;
console.log(product.stock);
console.log(typeof product.stock);`,
        choices: ['15\nnumber', '105\nstring', '105\nnumber', 'NaN\nnumber'],
        wrongNotes: {
          '15\nnumber': 'That would need Number(body.quantity). With a string on one side, + joins text.',
          '105\nnumber': 'The value is 105, but it is the text "105", so typeof says string.',
          'NaN\nnumber': 'NaN comes from failed number conversion; here nothing is converted, the values are joined.',
        },
        hints: [
          'What does + do when one side is a string?',
          '10 + "5" joins the two as text.',
        ],
        explanation: 'With a string operand, + concatenates: 10 + "5" is "105", a string. Convert input to a number once at the edge, and add a test with a string quantity.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-08-arrange-1',
        kind: 'arrange',
        title: 'Order the debug session',
        prompt: 'Put the steps of an evidence-first debugging session in order.',
        concept: 'debug mode workflow',
        language: 'text',
        solution: [
          'Describe the bug with steps, expected and actual results',
          'Agent lists hypotheses and adds log statements',
          'You reproduce the bug exactly as asked',
          'Agent reads the logs and names the root cause',
          'Agent makes a small fix and you add a failing-then-passing test',
          'You reproduce again, then the logs are removed before commit',
        ],
        reasons: [
          'Without a clear report the agent cannot form useful hypotheses.',
          'Instrumentation must be in place before the bug is reproduced.',
          'The logs only capture real behaviour if the bug actually happens.',
          'The cause comes from evidence, not a guess.',
          'The fix targets the cause, and a test keeps it fixed.',
          'Verify, then clean up so debug logs never reach a commit.',
        ],
        hints: [
          'You cannot read logs that were never written.',
          'Cleaning up is always last, after you have verified the fix.',
        ],
        explanation: 'Report, instrument, reproduce, analyse, fix, verify and clean up. Skipping reproduction or analysis turns debugging back into guessing.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Debug mode gathers runtime evidence (hypotheses, logs, your reproduction) before it fixes anything.',
        'Give the agent steps, expected and actual results, and attach terminal output and files.',
        'Fix the cause at the edge (convert input once) rather than patching what the screen shows.',
        'Ask why the fix removes the cause, add a test, and remove debug logs before committing.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-08-q1',
      prompt: 'Why does Debug mode ask you to reproduce the bug?',
      choices: [
        'So the added log statements capture real runtime behaviour',
        'Because the agent cannot read code',
        'To use up your usage limit',
      ],
      answer: 0,
      explanation: 'The logs are only useful if the bug actually happens while they are in place.',
    },
    {
      id: 'ai-dev-cursor-08-q2',
      prompt: 'The agent fixes the "105" bug by showing `Math.min(product.stock, 999)`. What is wrong with that?',
      choices: [
        'Nothing, the number on screen is now small',
        'It hides the symptom; the cause is text joined with a number',
        'Math.min does not exist in JavaScript',
      ],
      answer: 1,
      explanation: 'The cause is string concatenation. Capping the display hides it and breaks honest stock counts.',
    },
    {
      id: 'ai-dev-cursor-08-q3',
      prompt: 'Your tests fail in the terminal. What is the best way to give the agent the output?',
      choices: [
        'Retype the error from memory',
        'Attach it with @Terminals',
        'Describe it as "tests are broken"',
      ],
      answer: 1,
      explanation: '@Terminals attaches the real output, so the agent works from exact messages and line numbers.',
    },
    {
      id: 'ai-dev-cursor-08-q4',
      prompt: 'What must happen before you commit after a Debug mode session?',
      choices: [
        'Remove the debug instrumentation and check no personal data was logged',
        'Delete all tests',
        'Switch to Run Everything',
      ],
      answer: 0,
      explanation: 'Debug logs are temporary. Debug mode removes them after you confirm, and you check the diff to be sure.',
    },
    {
      id: 'ai-dev-cursor-08-q5',
      audience: { max: 'beginner' },
      prompt: "In the lesson, why does 10 + '5' give '105'?",
      choices: ["Because the computer rounds up when numbers are large", "Because '5' is text, and + joins text with a value instead of adding", "Because the database stored the wrong number", "Because the form sent the number twice"],
      answer: 1,
      explanation: "Text from a form arrives as a string. When one side of + is a string, JavaScript joins the pieces, so 10 and '5' become '105'. Converting the input to a number once, at the edge, fixes the cause.",
    },
    {
      id: 'ai-dev-cursor-08-q6',
      audience: { min: 'advanced' },
      prompt: "A production report says stock totals drift under load. The agent proposes wrapping the update in try/catch and retrying. What is the best response?",
      choices: ["Accept it, since retries make flaky code reliable", "Raise the log level and wait for the drift to disappear on its own", "Ask the agent to add a short sleep before each update to avoid timing problems", "Reject it as symptom-hiding: reproduce with a failing test or instrumentation, find where the value changes, and fix the cause with a regression test"],
      answer: 3,
      explanation: "A retry or a swallowed error can hide a race or a lost update and make it harder to see. Evidence first: reproduce, locate the change, fix at the cause, and keep a test that fails without the fix.",
    },
  ],
  task: {
    title: 'Plant and hunt a bug',
    minutes: 25,
    steps: [
      'On a branch, plant the bug from this lesson in SariStock\'s client (use the form value without Number()). Commit it so you can compare.',
      'Start a Debug mode session with the opening prompt, adjusted to your files. Reproduce when asked.',
      'Before accepting, ask why the fix removes the cause. Add a test with a string quantity that fails before and passes after.',
      'Check the final diff has no leftover log statements, then write three sentences on what evidence found the cause.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Write a bug report with the three parts (what you did, what you expected, what happened) for the 105 bug, and then for one other small mistake you can find in SariStock.",
        "After the fix, write in two sentences, in your own words, why the number was joined instead of added.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Write the failing test before asking for the fix, and attach its output with @Terminals. Afterwards, run `git diff` and confirm that it holds the fix, the test and no leftover instrumentation.",
        "Note which evidence (logs, the test, git history) proved the cause, and what you would need in production, where you cannot run your own reproduction.",
      ],
    },
  ],
};

const l09: Lesson = {
  id: 'ai-dev-cursor-09',
  day: 9,
  title: 'Working with existing projects',
  summary: 'Join a codebase you did not write: get oriented safely, record its conventions as rules, and make a first change that fits.',
  minutes: 20,
  skills: ['cursor-context', 'cursor-setup'],
  intro: {
    objectives: [
      'Get oriented in an unfamiliar repository using Ask mode without changing anything',
      'Record a project\'s existing conventions as rules or AGENTS.md before generating code',
      'Make a first change that copies existing patterns instead of inventing new ones',
      'Keep the agent from "improving" code you were not asked to touch',
    ],
    why: 'Most paid work is on code someone else wrote. The developer who fits in quickly and changes only what was asked is the one teams keep.',
  },
  body: [
    { type: 'paragraph', text: "A new project is where agents are most tempting and most dangerous. Tempting, because \"explain this repo\" saves hours. Dangerous, because the agent does not know the history: why the odd retry exists, why this folder uses callbacks, which tests are flaky on purpose. Your first week on an existing project with Cursor has three phases: understand, record, then change a little." },
    { type: 'heading', text: '1. Understand, read-only' },
    { type: 'paragraph', text: "Use Ask mode for the first conversations, so nothing can change. Ask for the map, then check it against the code. Run the project and its tests yourself before any AI change, so you know which failures were already there; otherwise you will blame the agent for old problems, or miss new ones." },
    { type: 'prompt', label: 'First questions on a new repo (Ask mode)', text: 'Explain this codebase for a developer joining today. Point me to the main entry points, key modules, and anything I should read before making changes. Then list: how to run it, how to run the tests, the conventions you can see (naming, error handling, how money and dates are stored), and anything that looks unusual or risky. Give file paths for every claim and say when you are guessing.' },
    {
      type: 'version',
      text: 'Cursor\'s Quickstart suggests opening Agent (Cmd+I) on a new folder and asking it to "Explain this codebase. Point me to the main entry points, key modules, and anything I should read before making changes," then asking for "three small, safe improvements" and choosing one. Ask mode is read-only: the agent answers and explores without making edits.',
      checked: CHECKED,
      sources: [S.quickstart, S.askHelp],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "An **existing project** is code that already works and was written by other people, maybe years ago. A **repository**, or repo, is the project folder together with the full history of its changes. A **convention** is the way a team habitually does something, such as how files are named. When you join, look around first: ask the agent in Ask mode to explain, which changes nothing. Then run the project and its **tests**, small programs that check the app still works, before you change anything, so you know what was already broken. That starting picture is called a **baseline**, and it lets you tell old problems from new ones." },
    { type: 'heading', text: '2. Record the conventions' },
    { type: 'paragraph', text: "Once you have seen how the project does things, write it down where the agent will read it. If the repo already has an AGENTS.md or `.cursor/rules`, read those first: they are the team's instructions to every tool, including you. If not, draft one with the agent and edit it hard. Keep only rules that are true, non-obvious and about this project." },
    { type: 'prompt', label: 'Draft rules from what exists (Agent mode)', text: 'Based only on code you can see in this repo, draft an AGENTS.md under 40 lines: stack, commands to run and test, conventions with an example file path for each, and areas to avoid. Do not invent rules the code does not follow; if the code is inconsistent, list that as a question for me instead.' },
    {
      type: 'version',
      text: 'Cursor reads AGENTS.md in the project root and in subdirectories, and project rules from .cursor/rules. You can also type /create-rule in Agent to have it write a rule file with the right frontmatter. Project, user and team rules apply in every agent mode.',
      checked: CHECKED,
      sources: [S.rules, S.agentHelp],
    },
    { type: 'heading', text: '3. Change a little, in the house style' },
    { type: 'paragraph', text: "Your first change should be small, low risk and in the existing style, even if you would have designed it differently. Point the agent at a similar piece of code (\"follow @server/routes/sales.ts\") and forbid unrelated changes. Agents love to tidy: renaming variables, reformatting files, upgrading syntax. Each tidy-up makes the diff harder to review and can break code you do not understand yet." },
    { type: 'code', language: 'text', label: 'A scope line worth adding to any request on an existing repo', code: `Change only what this task needs. Do not rename, reformat, or "modernize"
other code, and do not touch files outside server/routes and server/test.
If you think something else should change, list it at the end instead.` },
    { type: 'warning', text: "Before opening a client's or employer's repository in Cursor, check that AI tools are allowed on it and under which account. Your company's AI policy is covered in AI Basics for Tech (day 2). If you are not sure, ask first; it is a much easier conversation before than after." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "An AGENTS.md is a plain text file where a project writes instructions for AI tools, like a welcome note for a new helper: how to run things, how files are named and what to avoid. Now the scope line from the lesson, one sentence at a time. 'Change only what this task needs' keeps the edit small. 'Do not rename, reformat, or modernize other code' stops the agent from tidying things you did not ask about. The last sentence makes it list extra ideas instead of acting on them. A **diff** is the list of what changed, and a small diff is easy for a person to check." },
    { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "On an existing project, first find the seams you will touch: the entry point for the route or screen, its tests and one similar feature to copy. Ask the agent to trace that path with file names, then open each file yourself. Write a characterization test for the current behaviour before editing, so your change shows up as a clear difference. Keep the first change inside one layer if you can, and run the whole suite before and after, because slow or flaky tests are part of the baseline you inherit. If nothing tests your area, say so in the pull request instead of quietly adding a large new suite." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "In a large or legacy codebase the hard problems are history and blast radius, and an agent sees neither unless you give them. Mine the history yourself: `git log` and `git blame` on the files you will touch, linked issues, and the tests that encode past incidents. Before changing a shared module, list its callers with exact search, and look for dynamic uses such as string-built imports or configuration that search misses. Treat the team's conventions as constraints: rules, AGENTS.md, code owners and CI checks are the contract, and an 'improvement' that breaks them costs reviewers more than it saves. Ask the agent to keep a change plan as a file so a later chat or a teammate can continue it, and agree up front where AI use is allowed and how it is disclosed, since policy varies by team." },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-09-scenario-1',
        kind: 'scenario',
        title: 'The helpful refactor',
        prompt: 'Choose the best response.',
        concept: 'scope on existing projects',
        situation: 'It is your second day on a client\'s Express API. You asked Agent to add one field to an endpoint. The diff touches 23 files: it also converted callbacks to async/await "for consistency" and renamed a helper used everywhere. All existing tests pass.',
        options: [
          { text: 'Restore the checkpoint, rerun the task with a scope line forbidding unrelated changes, and suggest the refactor to the team as a separate proposal', consequence: 'The client gets a small, reviewable change, and the refactor idea goes through the team instead of sneaking in.', quality: 'best' },
          { text: 'Keep it all, since the tests pass and the code looks more modern', consequence: 'Reviewers face a 23-file diff for a one-field task, and behaviour the tests do not cover may have changed.', quality: 'poor' },
          { text: 'Manually undo the refactor in each file', consequence: 'It works, but it is slow and error-prone when a checkpoint can restore the files in one step.', quality: 'acceptable' },
        ],
        hints: [
          'How big should the diff be for "add one field"?',
          'Cursor already saved a way back to the state before the agent ran.',
        ],
        explanation: 'On an existing project, scope is part of correctness. Undo with a checkpoint, narrow the request, and raise refactors separately where the team can decide.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-09-tap-reveal-1',
        kind: 'tap-reveal',
        title: 'Check the tour',
        prompt: 'The agent gave you a tour of a new repo. Tap each claim to see how you would check it.',
        concept: 'verifying an AI codebase tour',
        cards: [
          { front: '"Tests run with npm test."', back: 'Run it yourself and note which tests already fail before you change anything.' },
          { front: '"Prices are stored as floats in the products table."', back: 'Open the migration or schema file it names. If it gives no file path, treat the claim as a guess.' },
          { front: '"The utils/legacy folder is unused and can be deleted."', back: 'Search for imports yourself and check Git history for why it exists. "Unused" is a classic wrong guess.' },
        ],
        hints: [],
        explanation: 'Every claim in a codebase tour should point to a file you can open or a command you can run. Claims without evidence are guesses until you check them.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Start read-only: Ask mode tours, then run the app and tests yourself to know the baseline.',
        'Read existing rules or AGENTS.md first; if there are none, draft them from real code and edit hard.',
        'Make the first change small and in the house style, pointing at an existing example.',
        'Forbid unrelated changes in the prompt and restore a checkpoint when the agent over-reaches.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-09-q1',
      prompt: 'Why run the existing tests before your first AI-assisted change?',
      choices: [
        'To know which failures were already there, so you judge the agent\'s change fairly',
        'Because Cursor requires it',
        'To make the tests faster',
      ],
      answer: 0,
      explanation: 'A baseline tells you which failures are old and which ones your change introduced.',
    },
    {
      id: 'ai-dev-cursor-09-q2',
      prompt: 'The repo already has an AGENTS.md. What do you do first?',
      choices: [
        'Delete it and write your own',
        'Read it: it holds the team\'s instructions for every tool, including you',
        'Ignore it; Cursor only reads .mdc files',
      ],
      answer: 1,
      explanation: 'Cursor reads AGENTS.md, and it tells you the team\'s conventions. Read it before changing anything.',
    },
    {
      id: 'ai-dev-cursor-09-q3',
      prompt: 'What makes a good first change on a client codebase?',
      choices: [
        'A large refactor to show your skills',
        'A small, low-risk change that follows an existing pattern',
        'Upgrading every dependency',
      ],
      answer: 1,
      explanation: 'Small changes in the house style are easy to review and build the team\'s trust.',
    },
    {
      id: 'ai-dev-cursor-09-q4',
      prompt: 'How do you stop the agent from tidying code you were not asked to touch?',
      choices: [
        'Say in the prompt to change only what the task needs and to list other ideas at the end',
        'Use Tab instead of Agent',
        'Turn off Privacy Mode',
      ],
      answer: 0,
      explanation: 'An explicit scope line keeps the diff small and turns the agent\'s ideas into suggestions instead of edits.',
    },
    {
      id: 'ai-dev-cursor-09-q5',
      audience: { max: 'beginner' },
      prompt: "What is a 'baseline' before you change an existing project?",
      choices: ["The first file you open in the project", "A backup copy of Cursor's settings", "The picture of what works and what already fails, found by running the app and its tests before you change anything", "The longest function in the project"],
      answer: 2,
      explanation: "A baseline is what the project does before your change. Running the app and the tests first tells you which problems were already there, so you judge the agent's change fairly.",
    },
    {
      id: 'ai-dev-cursor-09-q6',
      audience: { min: 'advanced' },
      prompt: "You must change a shared utility used across a large repository. The agent says it is safe because a search found 14 callers. What is the best next step?",
      choices: ["Proceed, because an exact search is always complete", "Check for uses the search cannot see, such as dynamic imports or configuration, read the blame and tests, then change it in small steps with the callers' tests running", "Delete the callers' tests that fail, then proceed", "Ask the agent to rewrite every caller at once so nothing is left inconsistent"],
      answer: 1,
      explanation: "Exact search is strong evidence, but it misses dynamic uses and runtime configuration. History, tests and small steps with the callers' suites running keep the blast radius under control.",
    },
  ],
  task: {
    title: 'Onboard onto a real repo',
    minutes: 25,
    steps: [
      'Pick an open-source project you can legally clone (or your team\'s, if AI tools are allowed on it). Run it and its tests; note any failures.',
      'Use the Ask mode tour prompt and check three of its claims against the code.',
      'Draft an AGENTS.md with the agent, delete anything that is not true or not specific, and keep it under 40 lines.',
      'Make one small change with the scope line from the lesson, and check the diff touches only the files you expected.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Ask the agent in Ask mode to explain the project's folders one by one in plain words and to name the file you would open first. Write a three-line map of the project in your own words.",
        "Run the tests before any change and write down how many pass and how many fail. That is your baseline.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Before the change, run `git log` and `git blame` on the files involved and list two things the history taught you.",
        "Record the test suite's baseline (passing, failing, flaky and time taken) in the pull request description.",
      ],
    },
  ],
};

const l10: Lesson = {
  id: 'ai-dev-cursor-10',
  day: 10,
  title: 'Codebase exploration and architecture analysis',
  summary: 'Trace a request through the layers, draw the architecture with the agent, and check every claim against the code before you act on it.',
  minutes: 22,
  skills: ['cursor-context', 'cursor-modes'],
  intro: {
    objectives: [
      'Trace one request through React, Express and SQLite with the agent and verify each step',
      'Ask for an architecture diagram and check it against real imports',
      'Use exact search to confirm or reject the agent\'s claims about dependencies',
      'Write down architecture risks the agent finds as questions, not facts',
    ],
    why: 'Before you change a system you need a correct picture of it. An architecture picture that is confidently wrong leads to fixes in the wrong place.',
  },
  body: [
    { type: 'paragraph', text: "Architecture analysis with an agent is fast and slightly dangerous. In a minute it can describe your layers, draw a diagram and point at coupling problems. Most of that will be right. The parts that are wrong will look exactly like the parts that are right. This lesson is about using Cursor to explore quickly while proving every claim you plan to act on." },
    { type: 'heading', text: 'Trace one request end to end' },
    { type: 'paragraph', text: "The best way into an architecture is one real request. In SariStock, follow a sale: the React component that submits it, the fetch call, the Express route, the validation, the SQL that reduces stock, and the response the UI uses. Ask the agent to trace it with file paths and line numbers, then open each one. You learn the system, and you learn how far to trust the agent on this codebase." },
    { type: 'prompt', label: 'Trace a request (Ask mode)', text: 'Trace what happens when a cashier records a sale in SariStock, from the React component to the database and back. For each step give the file path, the function name and the line number, and quote the line that hands off to the next step. Then draw it as a Mermaid sequence diagram. Mark any step you inferred without reading the code.' },
    {
      type: 'version',
      text: 'The agent can delegate broad codebase searches to the built-in Explore subagent, which runs many searches in its own context and returns only the findings; you can also ask for it directly ("use a subagent to find all the places we validate user input"). Instant Grep supports full regex, so patterns like import.*PaymentService trace references across files. Mermaid diagrams appear in chat, and since the 3.27 release they can be expanded, zoomed and copied there and in Markdown preview.',
      checked: CHECKED,
      sources: [S.search, S.subagents, S.releaseNotes],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "**Architecture** is how a program is organised into parts and how those parts talk to each other, like the floor plan of a house with its kitchen, bedrooms and hallways. A **layer** is one such part: here the screen the user sees (React), the server (Express) and the stored information (SQLite). To **trace a request** is to follow one action, such as recording a sale, through each layer in order, like following a parcel from the shop to the delivery van. The agent can do that quickly and draw the result as a **diagram**, a picture of boxes and arrows. Then you check the picture against the real files, because a picture can look clear and still be wrong." },
    { type: 'heading', text: 'From trace to architecture' },
    { type: 'paragraph', text: "Once one path is clear, ask for the map: the layers, which module imports which, where state lives, and where the layers leak into each other (a React component writing SQL, a route containing business rules). Ask for evidence with every claim and for the claims it is least sure about. Then check the big ones yourself with exact search, which does not guess." },
    { type: 'code', language: 'bash', label: 'Check an import claim yourself', code: `# Agent says: "Only server/routes/sales.ts uses the stock helper."
grep -rn "adjustStock" server/ client/
# If client/ shows up, the claim is wrong, and the frontend is reaching into server code.` },
    { type: 'paragraph', text: "`grep -rn` prints every matching line with its file and line number. If the agent's claim is right you see one file; if not, you have found both a wrong answer and a possible architecture problem." },
    {
      type: 'table',
      headers: ['Agent claim', 'How to check it', 'Why it matters'],
      rows: [
        ['"X is only used in one place"', 'Exact search for X across the repo', 'Deleting or changing "unused" code is a classic breakage'],
        ['"This layer never touches the database"', 'Search that folder for db imports', 'Leaks decide where a change must happen'],
        ['"This module is dead code"', 'Search imports and check Git history', 'It may be loaded dynamically or by a script'],
        ['"Moving this to a service is safe"', 'List its callers and their tests', 'Untested callers are where refactors break'],
      ],
      caption: 'Turning architecture claims into checks',
    },
    { type: 'tip', text: "Keep the agent's architecture findings in a short notes file as questions (\"Does client/ import server code? grep says yes, in 2 files\"). Bring them to a senior developer. They often know the reason, and you look careful, not lost." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the check above line by line. A line that starts with `#` is only a comment. `grep` is a command that searches for text inside files. `-r` means look in every file in the folders given, and `-n` means show the line number of each match. `\"adjustStock\"` is the word being searched for, and `server/ client/` are the two folders to search. Every match prints the file, the line number and the line itself. If the word turns up under `client/`, the agent's claim was wrong, and you have found out without trusting anyone's summary." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Architecture claims from an agent are hypotheses about a graph that you can compute. Build the dependency graph with tools rather than prose: import-analysis tools for your language, `git log --follow` for churn, and code-owner files for who decides. Use exact regex search to confirm absence claims, and remember its blind spots: dynamic imports, string-built paths, reflection, generated code and runtime configuration. For broad questions, delegate the searching to a subagent so the main context stays clean, and ask the agent to separate observed facts, with path and line, from inferences. Record decisions in an architecture decision record rather than in a chat, and turn each agreed boundary into an enforced check, such as a lint rule that forbids client code importing server code. A diagram nobody enforces drifts within weeks." },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-10-match-1',
        kind: 'match',
        title: 'Prove it',
        prompt: 'Match each architecture claim from the agent with the quickest reliable way to check it.',
        concept: 'verifying architecture claims',
        labels: { terms: 'The agent says', meanings: 'Check it by' },
        pairs: [
          { term: 'The formatPeso helper is only called from the receipt component.', definition: 'An exact search for formatPeso across the repo' },
          { term: 'The low-stock threshold has always been 5; nobody changed it.', definition: 'Reading the Git history of the file that defines it' },
          { term: 'POST /api/sales returns 409 when stock is too low.', definition: 'Calling the endpoint with too large a quantity and reading the status' },
          { term: 'The server folder never imports anything from client.', definition: 'Searching server/ for imports that point into client/' },
        ],
        hints: [
          'Some claims are about text in files, some about history, some about behaviour when the app runs.',
          'Behaviour is best checked by running it; history by Git.',
        ],
        explanation: 'Usage and import claims are checked by exact search, history claims by Git, and behaviour claims by running the code. Each check is quick, and none depends on trusting the summary.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-10-tap-reveal-1',
        kind: 'tap-reveal',
        title: 'Spot the invented detail',
        prompt: 'The agent described SariStock\'s architecture. Tap each line to see whether it could be checked or was likely invented.',
        concept: 'hallucinated architecture details',
        cards: [
          { front: '"Sales use the Redis cache in server/cache.ts to avoid double counting."', back: 'Suspicious: SariStock has no Redis. If server/cache.ts does not exist, the agent invented a common pattern from other projects.' },
          { front: '"Stock is reduced in server/routes/sales.ts, line 24, inside db.transaction."', back: 'Checkable: open the file at that line. Specific claims with paths are easy to verify.' },
          { front: '"The app follows clean architecture with use cases and repositories."', back: 'Vague label: ask which files are the use cases and repositories. A label without files is a guess.' },
        ],
        hints: [],
        explanation: 'Invented details often sound like common patterns (a cache, a framework, a named architecture). Ask for the file and line; if there is none, the detail is not real.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Start architecture work by tracing one real request through every layer, with paths and line numbers.',
        'Ask for diagrams and evidence, and for the claims the agent is least sure about.',
        'Check claims with exact search, Git history or a real run; the summary is not evidence.',
        'Record architecture risks as questions for the team, not as facts.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-10-q1',
      prompt: 'What is a good first step to understand an unfamiliar system\'s architecture?',
      choices: [
        'Ask for a full rewrite plan',
        'Trace one real request through every layer and open each file',
        'Read only the README',
      ],
      answer: 1,
      explanation: 'One end-to-end trace shows the real layers and hand-offs, and tests how accurate the agent is on this codebase.',
    },
    {
      id: 'ai-dev-cursor-10-q2',
      prompt: 'The agent says a helper is unused. What do you do before deleting it?',
      choices: [
        'Delete it; the agent searched',
        'Search for it yourself and check Git history for why it exists',
        'Ask the agent again with the same question',
      ],
      answer: 1,
      explanation: '"Unused" is a common wrong claim: code can be loaded by scripts or dynamically. Exact search and history are your evidence.',
    },
    {
      id: 'ai-dev-cursor-10-q3',
      prompt: 'Why might the agent mention a Redis cache that your project does not have?',
      choices: [
        'It filled the gap with a pattern common in other projects',
        'Cursor installs Redis automatically',
        'Redis is part of Express',
      ],
      answer: 0,
      explanation: 'Models predict plausible text. Without evidence from your files, a common pattern can appear as if it were yours.',
    },
    {
      id: 'ai-dev-cursor-10-q4',
      prompt: 'When is the Explore subagent useful?',
      choices: [
        'For broad searches whose raw results would flood the main conversation',
        'For pushing code to GitHub',
        'For writing a single line',
      ],
      answer: 0,
      explanation: 'It searches in its own context and returns only the relevant findings, keeping your main chat focused.',
    },
    {
      id: 'ai-dev-cursor-10-q5',
      audience: { max: 'beginner' },
      prompt: "What does it mean to 'trace a request' through an app?",
      choices: ["To delete the old requests from the database", "To count how many people used the app today", "To ask the agent to rewrite the app from scratch", "To follow one action, such as recording a sale, through each part of the app in order and check each step in the real files"],
      answer: 3,
      explanation: "A trace follows one real action from the screen through the server to the database and back. Opening each file it names teaches you the system and shows how far to trust the agent on it.",
    },
    {
      id: 'ai-dev-cursor-10-q6',
      audience: { min: 'advanced' },
      prompt: "The agent's diagram says client code never touches server code, and the team wants that to stay true. What is the strongest long-term control?",
      choices: ["A project rule telling the agent never to import across the boundary", "A wiki page that describes the boundary in detail", "An automated check in CI that fails when client code imports from server, such as a lint rule", "Asking the agent to redraw the diagram every sprint"],
      answer: 2,
      explanation: "Rules and diagrams are guidance that drift. A deterministic check in CI turns the boundary into something that cannot be crossed by accident, whoever or whatever writes the code.",
    },
  ],
  task: {
    title: 'Map SariStock and prove it',
    minutes: 25,
    steps: [
      'Run the trace prompt for recording a sale. Open every file and line it names; mark each step correct or wrong.',
      'Ask for an architecture overview with a Mermaid diagram of the layers and their imports.',
      'Pick the two claims you would act on and check them with grep or Git history.',
      'Write a notes file with the diagram, the checked claims, and two architecture questions for a teammate.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Draw the three layers of SariStock as three boxes on paper, with arrows for one sale. Then ask the agent to check your drawing against the real files and say which arrow is wrong or missing.",
        "Run the grep line from the lesson on your project with a function name of your choice and read each result aloud.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Write one architecture boundary as an enforced check, for example a lint rule or a script that fails when client code imports server code. Add it to CI and prove it fails with a deliberate violation.",
        "In your notes, record which agent claims you could confirm by command and which only by reading.",
      ],
    },
  ],
};

const l11: Lesson = {
  id: 'ai-dev-cursor-11',
  day: 11,
  title: 'AI-assisted testing and refactoring',
  summary: 'Pin down behaviour with tests first, then refactor with the agent in small checked steps, and never let it weaken a test to make it pass.',
  minutes: 24,
  skills: ['cursor-review', 'cursor-multi-file'],
  intro: {
    objectives: [
      'Ask the agent for characterization tests that pin current behaviour before a refactor',
      'Refactor in small steps with tests run after each one',
      'Catch a refactor that silently changes a boundary condition',
      'Set up a verifier subagent and Agent Review as extra checks, not replacements',
    ],
    why: 'Refactoring is where agents look most impressive and where behaviour changes slip through unnoticed. Tests first is the habit that lets you accept big diffs with confidence.',
  },
  body: [
    { type: 'paragraph', text: "The safest refactor is one where tests tell you, after every step, that behaviour has not changed. The general method (small steps, reviewable diffs, tests that test something) is covered in AI Basics for Tech (days 6 and 7). Here we apply it inside Cursor on SariStock's Vitest suite, using the editor's checkpoints and review features to keep each step honest." },
    { type: 'heading', text: 'Step 1: pin the behaviour' },
    { type: 'paragraph', text: "Before refactoring the low-stock logic, ask the agent for characterization tests: tests that record what the code does now, including edge cases, even if it looks odd. The boundary matters most. SariStock's rule is that a product is low on stock when its stock is at or below its reorder level." },
    { type: 'code', language: 'typescript', label: 'server/test/low-stock.test.ts', code: `import { describe, expect, test } from 'vitest';
import { lowStock } from '../lib/low-stock';

const products = [
  { name: 'Rice 1kg', stock: 5, reorderLevel: 5 },
  { name: 'Soap', stock: 2, reorderLevel: 5 },
  { name: 'Eggs', stock: 30, reorderLevel: 12 },
];

describe('lowStock', () => {
  test('includes products exactly at the reorder level', () => {
    expect(lowStock(products)).toContain('Rice 1kg');
  });
  test('lists only products at or below their level', () => {
    expect(lowStock(products)).toEqual(['Rice 1kg', 'Soap']);
  });
});` },
    { type: 'paragraph', text: "The first test exists only for the boundary: Rice has exactly 5 with a level of 5. That is the value a refactor is most likely to get wrong, and an agent writing tests will often skip it unless you ask." },
    { type: 'prompt', label: 'Characterization tests (Agent mode)', text: 'Write Vitest characterization tests for @server/lib/low-stock.ts that pin its current behaviour, including the boundary where stock equals reorderLevel, an empty list, and products with stock 0. Do not change low-stock.ts. Run the tests and show me the output. If any test fails against the current code, tell me instead of changing the test or the code.' },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the test file line by line. `import` brings in tools: `describe`, `expect` and `test` come from Vitest, the program that runs the tests, and `lowStock` is the function being checked. `products` is a list of three example products, each with a `stock` (how many are left) and a `reorderLevel` (the number at which the shop should order more). `describe` groups tests under a name. Each `test` has a sentence saying what it checks and an `expect` line such as 'expect the result to contain Rice 1kg'. Rice has exactly 5 with a level of 5. That is the **boundary**, the value at which the answer flips, and a test that fails there tells you something broke." },
    { type: 'heading', text: 'Step 2: refactor in small steps' },
    { type: 'paragraph', text: "Now ask for one refactor step at a time (\"extract the threshold check into isLow(product)\"), run the tests, read the diff, commit. If a step fails, restore the checkpoint rather than letting the agent pile fixes on top. And watch for the worst failure: an agent that \"fixes\" a failing test by changing what the test expects." },
    { type: 'warning', text: "If a refactor makes a test fail and the agent edits the test's expected value, stop. Unless the old behaviour was a confirmed bug, the test was right and the refactor is wrong. Add to your rules: never change a test's expectation during a refactor without asking." },
    { type: 'heading', text: 'Extra checks: a verifier subagent and Agent Review' },
    { type: 'code', language: 'markdown', label: '.cursor/agents/verifier.md', code: `---
name: verifier
description: Checks finished work. Use after a task is marked done.
readonly: true
---

Be skeptical. Run npm test and npm run typecheck and report the real output.
List any test whose expected value changed in this diff, and any new code
path with no test. Report what passed and what is incomplete. Do not edit files.` },
    {
      type: 'version',
      text: 'Custom subagents are Markdown files with YAML frontmatter (name, description, and options such as model and readonly) in .cursor/agents/ for a project or ~/.cursor/agents/ for you; the docs show a "verifier" pattern that runs tests and reports what passed. Agent Review runs a code review on local changes: type /agent-review, or run it from the Source Control tab against your main branch, at Quick or Deep depth; it can run automatically after commits and reads BUGBOT.md rule files. Checkpoints restore files only.',
      checked: CHECKED,
      sources: [S.subagents, S.agentReview, S.agentOverview],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "To **refactor** is to change how code is written without changing what it does, like rewriting a recipe more clearly while the dish tastes the same. Tests are the taste check: you run them after every small step. If one fails, the step changed behaviour and you undo it. The worst shortcut is letting the agent edit the test to match the new, wrong behaviour, because then the check stops checking anything. A **characterization test** records what the code does today, so you can prove that a rewrite did not change it." },
    { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "With a working app, aim your refactors where the tests are weakest. First measure what is covered: run the coverage report your test runner offers and look for branches that no test reaches. Write characterization tests for those, error paths included, and then refactor one function at a time. Add an API-level test for each route you touch, using a real in-memory database rather than mocks, so a refactor of the inner code cannot break the contract unnoticed. Break the code on purpose once to confirm that a test fails; a suite that stays green when the code is wrong is not protecting you." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Generated tests are only as strong as what they falsify. Judge a suite by whether it fails when the code is wrong: use mutation testing or manual sabotage rather than line coverage, and review the test plan before the code. Keep a refactor behaviour-preserving by freezing the public contract first, with characterization tests at the seam you are changing and contract tests on any interface other teams use. Treat any diff that edits a test's expected value as a behaviour change that needs a named reason. Automated reviewers share blind spots: Bugbot's findings default to neutral on GitHub, so they inform a human review rather than gate it, and a verifier subagent with readonly set can run the checks but cannot edit files. In CI, quarantine flaky tests with an owner and a deadline instead of retrying silently, and require the plan, the test output and any changed expectation in the pull request." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Bugbot docs: the GitHub check is named Cursor Bugbot and its findings default to neutral, so requiring the check alone does not block merges; blocking needs the fail-on-unresolved-issues setting if your organization has it. Subagents docs: a custom subagent's readonly option blocks file edits and state-changing shell commands, and its model field defaults to inherit. Agent Review docs: it reviews local changes at Quick or Deep depth.",
      checked: CHECKED,
      sources: [S.bugbot, S.subagents, S.agentReview],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-11-fix-bug-1',
        kind: 'fix-bug',
        title: 'The refactor that moved the line',
        prompt: 'The agent refactored lowStock into a chain. The rule is "at or below the reorder level". One line changed behaviour. Find it and fix it.',
        concept: 'boundary bugs in refactors',
        language: 'javascript',
        code: `function lowStock(products) {
  return products
    .filter((p) => p.stock < p.reorderLevel)
    .map((p) => p.name);
}`,
        bugLine: 3,
        fixes: [
          { line: '    .filter((p) => p.stock <= p.reorderLevel)', correct: true, why: 'At or below means <=, so a product exactly at its level is included again.' },
          { line: '    .filter((p) => p.stock <= p.reorderLevel - 1)', correct: false, why: 'For whole numbers this is the same as < reorderLevel, so the boundary product is still missing.' },
          { line: '    .filter((p) => p.reorderLevel <= p.stock)', correct: false, why: 'This flips the rule and lists well-stocked products instead.' },
        ],
        tests: {
          kind: 'function',
          fn: 'lowStock',
          cases: [
            {
              label: 'boundary and below',
              args: [[{ name: 'Rice 1kg', stock: 5, reorderLevel: 5 }, { name: 'Soap', stock: 2, reorderLevel: 5 }, { name: 'Eggs', stock: 30, reorderLevel: 12 }]],
              expected: ['Rice 1kg', 'Soap'],
            },
            { label: 'empty list', args: [[]], expected: [] },
            { label: 'out of stock', args: [[{ name: 'Sardines', stock: 0, reorderLevel: 3 }]], expected: ['Sardines'] },
          ],
        },
        hints: [
          'Which product sits exactly on the boundary in the test data?',
          'Rice has stock 5 and a level of 5. Should it be listed?',
          'The comparison on line 3 must include equality.',
        ],
        explanation: 'The refactor turned <= into <, dropping products exactly at their reorder level. Only a test with a boundary value catches it, which is why you pin behaviour before refactoring.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-11-scenario-1',
        kind: 'scenario',
        title: 'Green again, somehow',
        prompt: 'Choose the best response.',
        concept: 'protecting tests during refactors',
        situation: 'Mid-refactor, one test fails: "includes products exactly at the reorder level". The agent reports "Fixed: updated the test to match the new behaviour" and the suite is green.',
        options: [
          { text: 'Restore the checkpoint before that step, tell the agent the test is correct, and ask it to fix the code instead', consequence: 'The rule shopkeepers rely on stays intact and the refactor continues on safe ground.', quality: 'best' },
          { text: 'Accept it; the suite is green', consequence: 'A product with exactly 5 left no longer appears on the low-stock list, and the store runs out.', quality: 'poor' },
          { text: 'Ask the agent whether the new behaviour is better', consequence: 'Maybe useful as a discussion, but the decision about business rules belongs to the team, not to the refactor.', quality: 'acceptable' },
        ],
        hints: [
          'A refactor, by definition, should not change behaviour.',
          'Who decides the shop\'s low-stock rule?',
        ],
        explanation: 'Changing an expectation to make a refactor pass hides a behaviour change. Undo the step and fix the code; business rules change only on purpose.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Pin current behaviour with characterization tests, especially boundary values, before refactoring.',
        'Refactor one small step at a time: run tests, read the diff, commit, repeat.',
        'Never accept a changed test expectation in a refactor without a deliberate decision.',
        'A verifier subagent and Agent Review add checks; they do not replace your own review.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-11-q1',
      prompt: 'What is a characterization test?',
      choices: [
        'A test that records what the code does now, so a refactor can prove nothing changed',
        'A test written by a designer',
        'A test that only checks types',
      ],
      answer: 0,
      explanation: 'It captures current behaviour, odd parts included, so later changes are measured against it.',
    },
    {
      id: 'ai-dev-cursor-11-q2',
      prompt: 'Which test value most often catches refactor mistakes in comparisons?',
      choices: [
        'A very large random number',
        'The exact boundary value, such as stock equal to the reorder level',
        'A negative price',
      ],
      answer: 1,
      explanation: 'Changing <= to < only affects the exact boundary, so only a boundary test notices.',
    },
    {
      id: 'ai-dev-cursor-11-q3',
      prompt: 'Where do you save a custom subagent for the whole team to use in one project?',
      choices: ['.cursor/agents/ in the repository', 'In a chat message', 'In package.json'],
      answer: 0,
      explanation: 'Project subagents live in .cursor/agents/; committing them shares them with the team.',
    },
    {
      id: 'ai-dev-cursor-11-q4',
      prompt: 'Agent Review found no issues. What does that mean?',
      choices: [
        'The code is correct and needs no human review',
        'One more automated check passed; you still read the diff and run the tests',
        'Bugbot is now disabled',
      ],
      answer: 1,
      explanation: 'Automated reviews catch some problems, not all. They add to your review; they do not replace it.',
    },
    {
      id: 'ai-dev-cursor-11-q5',
      audience: { max: 'beginner' },
      prompt: "What does 'refactor' mean?",
      choices: ["Adding a brand-new feature to the app", "Deleting the tests that fail so the suite turns green", "Changing how code is written without changing what it does, checking with tests after each small step", "Translating the app into a different programming language"],
      answer: 2,
      explanation: "A refactor changes the shape of the code, not its behaviour. Tests run after every small step prove that nothing changed, and a failing test means you undo the step.",
    },
    {
      id: 'ai-dev-cursor-11-q6',
      audience: { min: 'advanced' },
      prompt: "A generated test suite for a payment module shows 95% line coverage and passes on the first run. What is the most reliable way to find out whether it protects you?",
      choices: ["Trust the coverage number, since 95% means nearly everything is tested", "Ask the agent whether its own tests are good enough", "Count how many test cases there are and compare with similar modules", "Introduce deliberate faults, by mutation testing or manual sabotage, confirm that tests fail, and review the plan for boundaries and error paths"],
      answer: 3,
      explanation: "Line coverage shows which lines ran, not whether any assertion would notice a fault. Deliberately breaking the code shows whether the tests would catch a real mistake.",
    },
  ],
  task: {
    title: 'Refactor with a safety net',
    minutes: 25,
    steps: [
      'Pick one function in SariStock (low stock, sale totals or price formatting). Use the characterization prompt to pin its behaviour, including a boundary case.',
      'Refactor it in at least two small steps, running `npm test` and reading the diff after each.',
      'Add the verifier subagent from the lesson and ask the agent to use it at the end. Compare its report with your own review.',
      'Commit each step separately, so the history shows a refactor you could undo one step at a time.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Temporarily change `<=` to `<` in the low-stock function, run the tests, and read the failure message: which test failed and why? Undo the change and run the tests again.",
        "Explain in your own words what a boundary value is, using the Rice example.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Run a manual mutation check: break three behaviours of the refactored function one at a time and record which tests fail. Add a test for any mutation that survived.",
        "In the pull request, list every changed test expectation with its reason, or state that there were none.",
      ],
    },
  ],
};

const l12: Lesson = {
  id: 'ai-dev-cursor-12',
  day: 12,
  title: 'Git integration',
  summary: 'Use Cursor\'s commit messages, conflict help, Agent Review and Bugbot on pull requests, while keeping authorship and history honest.',
  minutes: 22,
  skills: ['cursor-git', 'cursor-review'],
  intro: {
    objectives: [
      'Generate a commit message from staged changes and edit it until it is true',
      'Resolve a merge conflict with the agent and check the result yourself',
      'Review a branch with Agent Review and a pull request with Bugbot',
      'Decide when AI attribution trailers are required by your team',
    ],
    why: 'Git history is how a team understands its own code months later. AI can make commits and pull requests faster; you make sure they stay accurate and reviewable.',
  },
  body: [
    { type: 'paragraph', text: "Cursor builds on the editor's normal Source Control panel, so every Git habit you have still applies: small commits, clear messages, a branch per change, review before merge. On top of that it adds AI help at four points: writing the commit message, resolving conflicts, reviewing your changes before you push, and reviewing the pull request after you open it." },
    {
      type: 'diagram',
      format: 'mermaid',
      source: `flowchart LR
  A[Branch] --> B[Agent change]
  B --> C[You review the diff]
  C --> D[Tests pass]
  D --> E[Stage and commit]
  E --> F[Agent Review on branch]
  F --> G[Push and open pull request]
  G --> H[Bugbot and teammates review]
  H --> I[Merge]`,
      caption: 'Where AI helps in a Git workflow, and where you check',
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "**Git** is a tool that records every version of a project, so you can see what changed, when and why, and go back if needed; think of 'track changes' for a whole folder. A **commit** is one saved snapshot with a short message. A **branch** is a separate line of work, so experiments do not disturb the main version. A **pull request** is a request, made on a website such as GitHub, for your branch's changes to be added to the main project after other people have looked at them. A **merge conflict** happens when two people changed the same lines and Git cannot choose between them. The agent can help with each of these steps, but you decide." },
    { type: 'heading', text: 'Commit messages' },
    { type: 'paragraph', text: "Stage your changes and Cursor can draft a message from the diff and your repo's history. Treat it like any generated text: it describes what changed, but it cannot know why. Edit it so the subject says what changed and the body says why, and remove claims that are not true (\"improves performance\" when nothing was measured). If your team uses Conventional Commits, say so in a rule so drafts follow it." },
    { type: 'code', language: 'text', label: 'A generated message, after your edit', code: `feat(restock): add restock endpoint and form

Shopkeepers had to edit stock by hand after deliveries, with no history.
POST /api/products/:id/restock validates quantity (1 to 1000), writes a
restocks row and updates stock in one transaction. Tests cover 0, text,
decimals and a missing product.` },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the message above. The first line is the **subject**: `feat(restock)` says this adds a feature in the restock area, followed by a short summary. The blank line separates it from the **body**, which says why the change was made: shopkeepers had to edit stock by hand after deliveries and had no history. The body then says what the new endpoint does and what the tests cover. A good message lets a stranger understand the change a year later without opening the code, and only you can supply the why." },
    { type: 'heading', text: 'Conflicts and attribution' },
    { type: 'paragraph', text: "When a merge conflicts, Cursor can open the conflict in chat and propose a resolution. Read both sides yourself first and decide what the result should do; then check the agent's version against that and run the tests. A resolution that compiles can still drop one side's behaviour. Cursor can also add a trailer marking commits and pull requests the agent made. Some companies require that disclosure and some forbid it; follow your team's policy, not the default." },
    {
      type: 'version',
      text: 'Stage changes and click the sparkle icon in the commit message box to generate a message from the diff and repo history. In a merge conflict, Resolve in Chat asks Agent to propose a resolution. When Agent creates commits or pull requests (including via gh pr create), Cursor can add a "Made with Cursor" trailer; it is on by default and toggled in Cursor Settings > Git & PRs > Attribution (Cursor 3.11 and later). Enterprise admins can turn it off for everyone. Cursor Blame annotates which lines were AI-written.',
      checked: CHECKED,
      sources: [S.git],
    },
    { type: 'heading', text: 'Reviewing before and after the pull request' },
    { type: 'paragraph', text: "Before you push, run Agent Review on the whole branch against main; it sees all your changes together, which catches problems that file-by-file review misses. After you open the pull request, Bugbot can review it on GitHub, GitLab, Bitbucket or Azure DevOps and leave inline comments with suggested fixes. Treat both like a teammate's review: some comments will be wrong, and every one you accept is still your change." },
    {
      type: 'version',
      text: 'Agent Review: /agent-review in the agent input, or the Source Control tab to compare all local changes with your main branch; Quick or Deep depth. Bugbot reviews pull requests automatically on each update; comment "cursor review" or "bugbot run" to trigger it by hand. It reads .cursor/BUGBOT.md files for project review rules; project rules in .cursor/rules do not apply to Bugbot. On GitHub it publishes a "Cursor Bugbot" check whose findings default to neutral, so requiring the check alone does not block merges on findings.',
      checked: CHECKED,
      sources: [S.agentReview, S.bugbot, S.bugbotHelp],
      plans: 'Bugbot: Premium and above, Teams and Enterprise (not Free or Plus); see the pricing page',
    },
    { type: 'warning', text: "Never let an agent force-push, rewrite shared history or merge its own pull request without a human approval. Keep `git push --force` and merges off any allowlist." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Treat AI review as one signal in a branch-protection policy, not as the policy. Bugbot's GitHub check reports success, neutral or failure and its findings default to neutral, so require human approval separately. Its rules come from .cursor/BUGBOT.md, not .cursor/rules, it skips pull requests above a size limit and files marked linguist-generated, which is one more reason to keep pull requests small, and it does not read the contents of credential-looking files. For attribution, decide policy per repository: commits can carry a trailer, Cloud Agent commits are authored as the agent, and rules that check commit authors will see that. Keep force-push and self-merge off every allowlist, protect main with required reviews and checks, and record which parts were AI-generated if your compliance or licensing rules ask for it." },
    { type: 'paragraph', audience: { min: 'professional' }, text: "For a team, review policy is where AI-assisted development is won or lost. Write down who may merge agent-authored pull requests, how many human approvals they need, which checks must pass, and what size of change you will accept; small pull requests are cheaper to review and stay inside review-bot limits. Keep a sample audit: each month read a handful of merged agent pull requests for missed edge cases, unplanned dependencies and policy slips, and feed the findings back into rules and checks. Track outcomes you can defend, such as review time per pull request, change failure rate and escaped defects, not the number of suggestions accepted. Make the disclosure rule explicit, because clients and employers differ on whether AI help must be declared." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Bugbot docs: the GitHub check is named Cursor Bugbot and findings default to neutral, so requiring the check alone does not block merges; pull requests above the default review-size limit are skipped; files marked linguist-generated are excluded; rules come from .cursor/BUGBOT.md and .cursor/rules project rules are not applied; it does not read the contents of credential-looking files such as .env. Cloud Agents docs: commits are authored as the agent, not the person who started the task.",
      checked: CHECKED,
      sources: [S.bugbot, S.cloudHelp],
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-12-fill-blank-1',
        kind: 'fill-blank',
        title: 'Ask Bugbot again',
        prompt: 'You pushed fixes to a pull request and want Bugbot to review it again right now. Complete the comment and the rules file path.',
        concept: 'bugbot triggers and rules',
        language: 'text',
        code: `Pull request comment:  ___
Review rules file:     .cursor/___`,
        blanks: [
          { answers: ['cursor review', 'bugbot run'], feedback: 'Bugbot listens for "cursor review" or "bugbot run" in a pull request comment.' },
          { answers: ['BUGBOT.md'], feedback: 'Bugbot reads .cursor/BUGBOT.md; .cursor/rules files do not apply to it.' },
        ],
        bank: ['cursor review', 'BUGBOT.md', '/agent-review', 'rules/review.mdc', 'git review'],
        hints: [
          '/agent-review runs inside the editor, not on the pull request.',
          'The comment starts with the product\'s name.',
          'Bugbot\'s rules file is named after Bugbot and is not a .mdc rule.',
        ],
        explanation: 'Comment "cursor review" (or "bugbot run") on the pull request to trigger Bugbot, and keep its review guidance in .cursor/BUGBOT.md.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-12-scenario-1',
        kind: 'scenario',
        title: 'Bugbot says it is fine',
        prompt: 'Choose the best response.',
        concept: 'ai review in pull requests',
        situation: 'Your restock pull request has a passing "Cursor Bugbot" check with no comments. A teammate has not reviewed it yet, and your branch protection only requires the Bugbot check.',
        options: [
          { text: 'Wait for a human review, and suggest the team also require one reviewer in branch protection', consequence: 'A person who knows the business reads the change, and the rule now protects every future pull request.', quality: 'best' },
          { text: 'Merge, since the review check passed', consequence: 'An automated review cannot know your business rules; a missed problem goes straight to production.', quality: 'poor' },
          { text: 'Run Agent Review locally too, then merge', consequence: 'Two automated reviews are better than one, but they share blind spots; a human should still approve.', quality: 'acceptable' },
        ],
        hints: [
          'What can a teammate know that an automated reviewer cannot?',
          'Is the problem this one pull request or the branch protection rule?',
        ],
        explanation: 'AI review adds a useful check, but merge decisions need a human who knows the context. Fix the process too, so it does not depend on remembering.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Generated commit messages describe what changed; you add why and remove anything untrue.',
        'Decide how a conflict should resolve before reading the agent\'s proposal, then run the tests.',
        'Run Agent Review on the whole branch before pushing, and treat Bugbot like a teammate\'s review.',
        'Follow your team\'s policy on AI attribution trailers.',
        'Keep force-push and merges behind a human approval.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-12-q1',
      prompt: 'What does a generated commit message usually miss?',
      choices: ['The list of changed files', 'Why the change was made', 'The file names'],
      answer: 1,
      explanation: 'The diff shows what changed; the reason lives in your head or the ticket, so you add it.',
    },
    {
      id: 'ai-dev-cursor-12-q2',
      prompt: 'Why run Agent Review on your whole branch instead of only the last edit?',
      choices: [
        'It sees all your changes together and catches problems that cross files',
        'It is the only way to push',
        'It deletes old commits',
      ],
      answer: 0,
      explanation: 'Comparing all local changes with main catches issues across the full set of changes, not just the latest edit.',
    },
    {
      id: 'ai-dev-cursor-12-q3',
      prompt: 'You wrote review guidance in `.cursor/rules/review.mdc`, but Bugbot ignores it. Why?',
      choices: [
        'Bugbot reads .cursor/BUGBOT.md, not project rules',
        'Bugbot only reads README.md',
        'Rules need to be in package.json',
      ],
      answer: 0,
      explanation: 'The Bugbot docs say project rules do not apply to Bugbot runs; use .cursor/BUGBOT.md.',
    },
    {
      id: 'ai-dev-cursor-12-q4',
      prompt: 'Your client forbids AI attribution in commit messages. What do you do?',
      choices: [
        'Leave the default trailer on anyway',
        'Turn off the attribution setting (or ask the admin to) and follow the client\'s policy',
        'Stop using Git',
      ],
      answer: 1,
      explanation: 'Attribution is configurable in settings and by enterprise admins. The client\'s policy decides.',
    },
    {
      id: 'ai-dev-cursor-12-q5',
      audience: { max: 'beginner' },
      prompt: "What is a pull request?",
      choices: ["A request to download the whole project to your computer", "A button that deletes old commits to save space", "A proposal, on a site such as GitHub, to add your branch's changes to the main project after others have looked at them", "A message asking the agent to write code for you"],
      answer: 2,
      explanation: "A pull request asks the team to add the changes from a branch to the main project, giving others the chance to review them first. It is the place where Bugbot and your teammates look at the change.",
    },
    {
      id: 'ai-dev-cursor-12-q6',
      audience: { min: 'advanced' },
      prompt: "Your team enables Bugbot and wants it to act as the merge gate. What do the docs imply you must do?",
      choices: ["Also require human review and, if your organization has it, the fail-on-unresolved-issues setting, because the check's findings default to neutral and do not block merges by themselves", "Nothing, since a Bugbot check with comments always fails the build", "Move your review rules into .cursor/rules so that Bugbot can read them", "Turn off branch protection, since Bugbot replaces it"],
      answer: 0,
      explanation: "The check's findings default to neutral, so requiring it alone does not block a merge. Pair it with required human review, and enable the blocking setting only if you want findings to fail the check.",
    },
  ],
  task: {
    title: 'A pull request you would be proud of',
    minutes: 25,
    steps: [
      'Take your restock branch from day 7 (or any small change). Generate a commit message with the sparkle icon and rewrite it with a clear why.',
      'Run Agent Review on the branch. Fix or reject each finding, writing one line on why for each.',
      'Push and open a pull request with a description: what changed, why, how you tested it, and what reviewers should look at first.',
      'If your plan includes Bugbot, trigger it with a comment and respond to its findings; if not, ask a classmate or the coach to review instead.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Look at the Source Control panel and find the changes you have staged. Write the commit message yourself first, with a subject and a body that says why, then compare it with the generated one and note one thing the generated one could not know.",
        "In your own words, explain what a branch and a pull request are.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Write the repository's review policy for AI-assisted changes in six lines: required human approvals, which checks gate merge, what Bugbot or Agent Review may and may not decide, attribution, and the pull request size you will accept.",
        "Test the policy by finding one existing pull request that would break it and say what would have changed.",
      ],
    },
    {
      audience: { min: 'professional' },
      steps: [
        "Draft a monthly audit routine for merged agent pull requests: how many you sample, what you look for, and where the findings go (rules, checks or training). Run it once on real history and record what you found.",
      ],
    },
  ],
};

const l13: Lesson = {
  id: 'ai-dev-cursor-13',
  day: 13,
  title: 'Advanced Cursor workflows',
  summary: 'Run parallel agents in worktrees, hand long tasks to Cloud Agents, connect tools with MCP, and automate checks with hooks and the CLI.',
  minutes: 25,
  skills: ['cursor-multi-file', 'cursor-setup', 'cursor-git'],
  intro: {
    objectives: [
      'Split a full-stack React and Express feature across parallel agents in separate worktrees',
      'Decide what is safe to hand to a Cloud Agent and what to keep local',
      'Configure an MCP server without putting secrets in the config file',
      'Choose between rules, skills, subagents, hooks and the CLI for a repeated job',
    ],
    why: 'Once the basics are solid, the gains come from running work in parallel and automating the checks you repeat. The same habits (small tasks, review, tests) keep that speed safe.',
  },
  body: [
    { type: 'paragraph', text: "Everything so far was one agent and you. Advanced Cursor work is about running several agents at once without them trampling each other, letting long tasks run in the cloud, connecting the agent to your other tools, and turning your repeated checks into automation. More agents means more diffs to review, so the review habits from day 7 matter even more here." },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "More words to pin down. A **worktree** is an extra copy of your project's files on your computer, on its own branch, so two helpers can work at once without touching each other's files, like two cooks each given their own chopping board. A **Cloud Agent** works on a computer you do not own, so your laptop can be off. **MCP**, the Model Context Protocol, is a standard way to plug outside tools into the agent, such as a list of issues. A **token** is a secret code that proves who you are to a service, and it must never be written into a file that is shared. Each of these buys speed and gives you more to check afterwards." },
    { type: 'heading', text: 'Parallel agents in worktrees' },
    { type: 'paragraph', text: "Two agents editing the same checkout will collide. Git worktrees give each task its own folder and branch from the same repository. For SariStock's next feature, a sales report, you can run one agent on the Express endpoint `GET /api/reports/daily-sales` and another on the React `DailySalesCard`, each in its own worktree, agreeing up front on the JSON shape so the halves fit." },
    { type: 'code', language: 'json', label: '.cursor/worktrees.json (setup for each new worktree)', code: `{
  "setup-worktree": [
    "npm ci",
    "cp $ROOT_WORKTREE_PATH/.env .env"
  ]
}` },
    { type: 'paragraph', text: "Cursor runs these commands in every new worktree, so each agent starts with installed dependencies and a local `.env` copied from your main checkout. Review and merge the halves one at a time, then run the full test suite on the combined branch: two correct halves can still disagree about a field name." },
    {
      type: 'version',
      text: 'Worktrees let Agent work in isolated Git checkouts. The UI feature is in the Agents Window; in the IDE you use Worktree Skills commands. Setup comes from .cursor/worktrees.json with setup-worktree (plus setup-worktree-unix and setup-worktree-windows), each an array of commands or a script path. Worktrees are disabled for multi-root workspaces.',
      checked: CHECKED,
      sources: [S.worktrees, S.agentsWindow, S.search],
    },
    { type: 'heading', text: 'Cloud Agents for long tasks' },
    { type: 'paragraph', text: "A Cloud Agent runs on its own virtual machine with your repository, builds and tests there, and ends with a pull request, often with screenshots or a video of it working. Good candidates are well-specified, well-tested tasks: \"upgrade Vitest and fix what breaks\". Poor candidates are vague ones and anything touching secrets you would not put in a cloud environment. Its pull request gets the same review as any other." },
    {
      type: 'version',
      text: 'Cloud Agents run in isolated cloud environments and can build features, write tests and open pull requests with screenshots, videos and logs. Start one by selecting Cloud by the agent input, at cursor.com/agents, or by mentioning @Cursor in Slack, GitHub or Linear. "Move to Cloud" does not carry uncommitted local changes: commit or stash first. They can use MCP servers and run project hooks from .cursor/hooks.json.',
      checked: CHECKED,
      sources: [S.cloudHelp],
      plans: 'Premium and above, and Teams; not Free or Plus. On an older plan, check the Legacy Cursor plans page',
    },
    { type: 'heading', text: 'MCP: connecting other tools' },
    { type: 'paragraph', text: "The Model Context Protocol lets the agent call tools outside the editor: your issue tracker, a database browser, documentation search. Configure project servers in `.cursor/mcp.json` and keep secrets out of the file by reading them from environment variables. Only install servers you trust: they run code and reach services on your behalf." },
    { type: 'code', language: 'json', label: '.cursor/mcp.json (secret read from the environment)', code: `{
  "mcpServers": {
    "issues": {
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer \${env:ISSUES_TOKEN}" }
    }
  }
}` },
    {
      type: 'version',
      text: 'MCP servers are configured in .cursor/mcp.json (project) or ~/.cursor/mcp.json (global), or installed from Customize. Transports: stdio, SSE and Streamable HTTP. Config interpolation supports ${env:NAME}, ${userHome} and ${workspaceFolder} in command, args, env, url and headers. MCP tool calls ask for approval by default and follow the same Run Modes as terminal commands.',
      checked: CHECKED,
      sources: [S.mcp, S.agentSecurity],
    },
    { type: 'paragraph', audience: { max: 'beginner' }, text: "Reading the `mcp.json` file line by line. The curly brackets and quotation marks are **JSON**, a way to write settings as named pairs. `mcpServers` lists the outside tools you plug in, and `issues` is the name given to one of them. `url` is its address on the internet. `headers` are extra information sent with every request, and `Authorization` carries the token. `${env:ISSUES_TOKEN}` means 'read the secret from a setting on this computer called ISSUES_TOKEN', so the real token is never written in the file and never reaches Git." },
    { type: 'paragraph', audience: { min: 'intermediate', max: 'intermediate' }, text: "Start small with automation. A first useful setup is one rule file for your conventions, one hook or script that runs your linter after edits, and one verifier subagent that runs the tests and reports. Use worktrees when two tasks touch different layers, such as an endpoint and its screen, and agree the interface, the JSON shape, before either agent starts. Connect only the MCP servers you will really use, because each one adds tools and approvals to every chat. Review each worktree's diff on its own, merge one at a time, and run the full tests after each merge." },
    { type: 'paragraph', audience: { min: 'advanced' }, text: "Parallelism multiplies review load, so design for it. Split work along seams with agreed contracts, give each agent its own worktree, and merge serially with the full suite after each merge. Worktrees isolate files, not services: two agents sharing one dev database or one port still collide, so give each its own. For Cloud Agents the controls move to the environment: they run on their own machines and never ask for approval, so scope the repositories, secrets and network access you give them. For MCP, servers can execute code and reach external services, tool calls ask for approval by default, and secrets come from the environment. Hooks are the enforcement layer: permission hooks can deny actions with exit code 2, but by default a crash or timeout lets the action proceed, so set failClosed on security-critical ones. Unattended CLI runs in CI should be read-only; avoid --force." },
    {
      type: 'version',
      audience: { min: 'advanced' },
      text: "Hooks docs: permission hooks such as beforeShellExecution, beforeMCPExecution, beforeReadFile and preToolUse can deny actions; exit code 2 blocks the action; by default crashes, timeouts and other non-zero exit codes let the action proceed, and failClosed: true makes them block (recommended for security-critical beforeMCPExecution hooks); when hooks from several sources match, deny beats ask and ask beats allow. MCP docs: servers can access external services and execute code on your behalf, and Cursor asks before running MCP tools by default. Run Modes docs: they apply only to local agents; Cloud Agents run in their own machines and never ask for approval. CLI docs: print mode with --force runs every action except those blocked by permissions.deny or team policy.",
      checked: CHECKED,
      sources: [S.hooks, S.mcp, S.runModes, S.cliHeadless],
    },
    { type: 'paragraph', audience: { min: 'professional' }, text: "For a team, the unit of adoption is the workflow, not the tool. Write a delegation policy: which task types may go to a Cloud Agent (well specified, well tested, no production secrets), which need Plan mode and a design review first, and which stay human. Keep the instruction layer in version control: AGENTS.md or rules, skills for repeatable procedures, subagents such as a verifier, and hooks for the checks that must not be skippable. Measure outcomes you can defend, such as lead time, review time per pull request, change failure rate and escaped defects, before and after adoption, rather than lines produced or suggestions accepted. Audit a sample of agent pull requests each month for missed edge cases, unplanned dependencies and policy violations, and feed what you find back into the rules." },
    { type: 'heading', text: 'Automating the repeated parts' },
    {
      type: 'table',
      headers: ['You keep repeating', 'Use', 'Where it lives'],
      rows: [
        ['The same instructions for a folder', 'A project rule', '.cursor/rules/*.mdc'],
        ['A multi-step procedure with scripts', 'A skill, invoked with /', '.cursor/skills/<name>/SKILL.md'],
        ['A focused job in its own context, like verifying', 'A subagent', '.cursor/agents/*.md'],
        ['Something that must run at a fixed point, like a formatter after edits', 'A hook', '.cursor/hooks.json'],
        ['A prompt in CI or a script', 'The CLI in print mode', 'agent -p "..."'],
      ],
      caption: 'Picking the right automation',
    },
    {
      type: 'version',
      text: 'Skills are folders with a SKILL.md in .cursor/skills/ (project) or ~/.cursor/skills/ (user), invoked with / in chat. Hooks are scripts defined in hooks.json at .cursor/hooks.json or ~/.cursor/hooks.json, with events such as beforeShellExecution and afterFileEdit. The CLI installs with curl https://cursor.com/install -fsS | bash and runs as agent; agent -p runs non-interactively, rejecting actions that need approval unless you add --force, which runs everything except what permissions.deny and team policy block.',
      checked: CHECKED,
      sources: [S.skills, S.hooks, S.cli, S.cliHeadless],
    },
    { type: 'warning', text: "Do not use `agent -p --force` in CI on a repository with deploy credentials. In a pipeline nobody is watching, so the approval prompts are your only brake; give CI jobs read-only tasks such as reviews and summaries." },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-13-match-1',
        kind: 'match',
        title: 'Which advanced tool?',
        prompt: 'Match each need on the SariStock team with the Cursor feature that fits.',
        concept: 'choosing advanced cursor features',
        labels: { terms: 'The need', meanings: 'Feature' },
        pairs: [
          { term: 'Two agents build the report endpoint and the report card at the same time without touching each other\'s files.', definition: 'Worktrees, one per agent' },
          { term: 'Upgrade the test runner overnight and wake up to a pull request with the fixes.', definition: 'A Cloud Agent' },
          { term: 'The agent should read open tickets from the team\'s issue tracker while planning.', definition: 'An MCP server' },
          { term: 'Run the linter automatically every time the agent edits a file.', definition: 'A hook' },
          { term: 'A nightly pipeline step that writes a summary of new TODO comments.', definition: 'The CLI in print mode' },
        ],
        hints: [
          'Separate checkouts, a remote machine, an outside tool, a fixed event, a script.',
          'Something that must happen at a fixed point in the agent loop is not a rule; rules are guidance.',
        ],
        explanation: 'Worktrees isolate parallel agents, Cloud Agents run long tasks remotely, MCP connects outside tools, hooks run at fixed events, and the CLI fits scripts and pipelines.',
      },
    },
    {
      type: 'activity',
      activity: {
        id: 'ai-dev-cursor-13-fill-blank-1',
        kind: 'fill-blank',
        title: 'No secrets in mcp.json',
        prompt: 'Complete this project MCP config so the token comes from an environment variable named ISSUES_TOKEN, and name the file.',
        concept: 'mcp configuration without secrets',
        language: 'json',
        code: `// file: .cursor/___
{
  "mcpServers": {
    "issues": {
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer ___" }
    }
  }
}`,
        blanks: [
          { answers: ['mcp.json'], feedback: 'Project MCP servers are configured in .cursor/mcp.json.' },
          { answers: ['${env:ISSUES_TOKEN}'], feedback: 'Use the ${env:NAME} interpolation so the token never appears in a committed file.' },
        ],
        bank: ['mcp.json', '${env:ISSUES_TOKEN}', 'settings.json', 'ISSUES_TOKEN=abc123', '$ISSUES_TOKEN'],
        hints: [
          'The file is named after the protocol.',
          'Cursor\'s interpolation syntax starts with ${env:.',
          'Never paste the real token value into the file.',
        ],
        explanation: 'Project servers go in .cursor/mcp.json, and ${env:ISSUES_TOKEN} reads the token from your environment so the committed file holds no secret.',
      },
    },
    {
      type: 'takeaways',
      items: [
        'Run parallel agents in separate worktrees, agree the interface first, and test the combined result.',
        'Give Cloud Agents well-specified, well-tested tasks and review their pull requests like any other.',
        'Configure MCP with ${env:...} for secrets and install only servers you trust.',
        'Rules guide, skills package procedures, subagents isolate jobs, hooks run at fixed events, the CLI fits scripts.',
        'More automation means more review: keep approvals on wherever nobody is watching.',
      ],
    },
  ],
  quiz: [
    {
      id: 'ai-dev-cursor-13-q1',
      prompt: 'Why run two agents in separate worktrees instead of the same checkout?',
      choices: [
        'Each gets its own files and branch, so their edits cannot collide',
        'Worktrees make the models smarter',
        'It is required for Tab',
      ],
      answer: 0,
      explanation: 'A worktree is a separate checkout, so each agent changes its own copy of the files.',
    },
    {
      id: 'ai-dev-cursor-13-q2',
      prompt: 'You click "Move to Cloud" with uncommitted edits. What does the Cloud Agent start from?',
      choices: [
        'Your uncommitted edits',
        'A clean state of the remote repository, without your uncommitted changes',
        'An empty repository',
      ],
      answer: 1,
      explanation: 'The help page says Move to Cloud does not snapshot uncommitted changes; commit or stash first.',
    },
    {
      id: 'ai-dev-cursor-13-q3',
      prompt: 'Which is the safe way to give an MCP server an API token?',
      choices: [
        'Paste the token into .cursor/mcp.json and commit it',
        'Reference it with ${env:NAME} and set it in your environment',
        'Put it in a project rule',
      ],
      answer: 1,
      explanation: 'Interpolation keeps the secret out of the file, so it never lands in Git.',
    },
    {
      id: 'ai-dev-cursor-13-q4',
      prompt: 'You want the linter to run after every file the agent edits, without fail. What do you use?',
      choices: ['A rule saying "please run the linter"', 'A hook on file edits', 'A longer prompt'],
      answer: 1,
      explanation: 'Rules are guidance the model may skip; a hook is a script that runs at a fixed point in the agent loop.',
    },
    {
      id: 'ai-dev-cursor-13-q5',
      audience: { max: 'beginner' },
      prompt: "What is a Cloud Agent, in plain words?",
      choices: ["A weather forecast shown inside the editor", "An agent that only works while your laptop is open", "An agent that works on a computer owned by Cursor, so it can keep going when your laptop is off, and hands back a pull request", "A tool that stores your passwords safely"],
      answer: 2,
      explanation: "A Cloud Agent runs on a computer in the cloud with your repository, builds and tests there, and ends with a pull request. Your laptop can be off, which is also why you review its work like a teammate's.",
    },
    {
      id: 'ai-dev-cursor-13-q6',
      audience: { min: 'advanced' },
      prompt: "A security-critical hook that blocks reads of customer files crashes or times out. By default, what happens to the action, and what should you configure?",
      choices: ["The action is blocked automatically, so no configuration is needed", "By default a crash or timeout lets the action proceed, so set failClosed: true on that hook", "The agent is disabled until the hook is fixed", "Cursor reruns the hook until it passes"],
      answer: 1,
      explanation: "The hooks docs say crashes, timeouts and non-zero exits other than 2 allow the action by default. failClosed: true makes them block, which the docs recommend for security-critical hooks.",
    },
  ],
  task: {
    title: 'Two agents, one feature',
    minutes: 25,
    steps: [
      'Write the JSON shape for `GET /api/reports/daily-sales` (date, total centavos, number of sales) in a short spec file.',
      'Start two agents in separate worktrees (Agents Window, or `git worktree add` by hand): one builds the Express endpoint with tests, one builds the React DailySalesCard against the spec.',
      'Review and merge each half, then run all tests and the type checker on the combined branch and fix any mismatch.',
      'Add one automation that would have helped (a rule, a hook or a verifier subagent) and write two sentences on why you chose it.',
    ],
  },
  taskExtra: [
    {
      audience: { max: 'beginner' },
      steps: [
        "Draw the two worktrees on paper as two copies of your project, one for the endpoint and one for the screen, and write which files each helper will change. Then ask the agent to check that no file appears in both.",
        "In your own words, write what a token is and why it must not be written into mcp.json.",
      ],
    },
    {
      audience: { min: 'advanced' },
      steps: [
        "Add failClosed to one hook, make it fail on purpose (for example a script that exits with code 1), and record what happens to the action with and without failClosed.",
        "Write a one-page delegation policy: which tasks go to a Cloud Agent, which to a local agent with approvals, which stay human, and what evidence each needs in the pull request.",
      ],
    },
    {
      audience: { min: 'professional' },
      steps: [
        "Pick three real tasks from your team's backlog, classify each under your delegation policy, run one of them, and write down the lead time, the review time and every defect the review caught.",
      ],
    },
  ],
};

export const aiDevCursorCourse: Course = {
  id: 'ai-dev-cursor',
  kind: 'path',
  title: 'Mastering Cursor',
  tagline: 'Use an AI code editor like a careful senior developer.',
  description: 'Learn Cursor from the editor out: Tab, the agent modes, rules, context, multi-file changes, debugging, refactoring and Git. You practise on SariStock, a React, Express and SQLite app, and prove every change with a reviewed diff and passing tests.',
  finishLine: [
    'A Cursor setup with privacy, ignore files and command approvals you chose on purpose',
    'Project rules that load at the right time and keep the agent in your conventions',
    'A full-stack SariStock feature built with Cursor Agent, reviewed file by file and tested',
    'A pull request workflow with honest commits, AI review and a human approval',
  ],
  audiences: ['experienced-dev', 'fresh-grad', 'builder'],
  skills: [
    { id: 'cursor-setup', label: 'Set up and secure Cursor' },
    { id: 'cursor-modes', label: 'Tab, Ask, Agent, Plan and Debug' },
    { id: 'cursor-context', label: 'Rules, @-mentions and ignore files' },
    { id: 'cursor-multi-file', label: 'Multi-file features with Agent' },
    { id: 'cursor-review', label: 'Diffs, tests and checkpoints' },
    { id: 'cursor-git', label: 'Git and pull request review' },
  ],
  lessons: [l01, l02, l03, l04, l05, l06, l07, l08, l09, l10, l11, l12, l13],
  projects: [
    {
      id: 'ai-dev-cursor-p1',
      title: 'Build a full-stack feature with Cursor Agent',
      summary: 'Add a restock feature to SariStock (React form, Express endpoint with validation, a SQLite migration and Vitest tests) using Cursor Agent, with a committed rules file and a reviewed diff.',
      outcome: 'A pull request that shows an employer you can direct an AI agent across a full stack, review its work file by file and prove it with tests.',
      unlockAfterDay: 7,
      steps: [
        { id: 'ai-dev-cursor-p1-s1', text: 'Get SariStock: use the one you built in an earlier course, generate it with the prompt from day 2 (review the file list first), or use your own React + Express project. Push it to a GitHub repository you own.' },
        { id: 'ai-dev-cursor-p1-s2', text: 'Add a .cursorignore for secrets and local data, and commit a project rule in .cursor/rules (or an AGENTS.md) with your stack, test commands, the centavos rule and "never edit an applied migration".', link: 'https://cursor.com/docs/rules' },
        { id: 'ai-dev-cursor-p1-s3', text: 'On a new branch, plan the restock feature in Plan mode: POST /api/products/:id/restock, validation (whole number 1 to 1000), a restocks table in a new migration, one transaction, a React RestockForm, and tests. Save the plan to the workspace and edit it before building.', link: 'https://cursor.com/docs/agent/plan-mode' },
        { id: 'ai-dev-cursor-p1-s4', text: 'Build it with Agent. Review the changed-file list and then each file; reject anything unplanned. Note every change you rejected or edited by hand, and why.' },
        { id: 'ai-dev-cursor-p1-s5', text: 'Make sure tests cover 0, text, a decimal, a too-large quantity and a missing product. Run the tests and the type checker yourself and try the form in the browser.' },
        { id: 'ai-dev-cursor-p1-s6', text: 'Run Agent Review on the branch, fix or reject its findings, then open a pull request whose description says what changed, how you tested it, what the agent got wrong and what you changed.', link: 'https://cursor.com/docs/agent/agent-review' },
      { id: 'ai-dev-cursor-p1-s7', audience: { max: 'beginner' }, text: "Scaffold for newcomers: before building, ask the agent in Ask mode to explain each file in the plan in one plain sentence, and to read the finished validator back to you line by line. Then write three sentences in your own words saying what validation, a transaction and a migration are. Build in small pieces: the server first, then the form, running the tests after each." },
      { id: 'ai-dev-cursor-p1-s8', audience: { min: 'intermediate', max: 'intermediate' }, text: "Add authentication to the restock route: require a token header, answer 401 when it is missing or wrong, read the secret from an environment variable, and add tests for both cases. Add a route-level test that uses a real in-memory database." },
      { id: 'ai-dev-cursor-p1-s9', audience: { min: 'advanced' }, text: "Make the endpoint safe to retry: add an idempotency key so a repeated request records one restock, argue that the migration is additive and safe on a database that already has data, and write down the authorization, logging and performance risks you reviewed with the evidence for each (a test, a query plan or a measurement)." },
      { id: 'ai-dev-cursor-p1-s10', audience: { min: 'professional' }, text: "Run the build as a documented agent workflow: keep the spec and acceptance criteria as a file in the pull request, commit the rules or AGENTS.md and a verifier subagent, use a hook for one check that must not be skipped (with failClosed if it blocks), and attach the review evidence: what the agent got wrong, which check caught it, and the time each step took compared with doing it by hand." },
      ],
      submission: {
        kind: 'url',
        label: 'Pull request link',
        placeholder: 'https://github.com/you/saristock/pull/1',
        hint: 'A pull request with the committed rules file, the restock feature across client, server, migration and tests, and a description that lists the tests you ran and the AI changes you rejected or edited.',
      },
      rubric: [
        'A project rule or AGENTS.md is committed and states real, project-specific conventions',
        'The feature spans React, Express, a new SQLite migration and tests, with validation on the server',
        'Tests cover edge cases (0, text, decimals, too large, missing product) and pass',
        'The description shows the diff was reviewed: what the agent got wrong and what was changed by hand',
        'No secrets, real customer data or unplanned dependencies are in the pull request',
      ],
      rubricExtra: [
        { audience: { max: 'beginner' }, items: ["The learner explains in plain words what validation, a transaction and a migration do in their feature."] },
        { audience: { min: 'intermediate', max: 'intermediate' }, items: ["The route requires authentication, with tests for a missing and a wrong token, and no secret appears in the code."] },
        { audience: { min: 'advanced' }, items: ["Retry safety is implemented and tested, migration safety is argued, and the pull request records the risks reviewed with their evidence."] },
        { audience: { min: 'professional' }, items: ["The pull request carries the spec, the committed rules or AGENTS.md, the verifier subagent and the review evidence with the time comparison."] },
      ],
    },
  ],
  icon: 'code_blocks',
  updated: '2026-11-14',
  level: 'intermediate',
  path: { id: 'ai-dev', order: 5 },
};
