import type { Course, Lesson, Project, SourceLink } from '../../types';

// Mastering GitHub Copilot. Every product statement lives in a dated `version` note, checked against GitHub's official documentation
// (docs.github.com) on 2026-11-14. GitHub changes Copilot often: when a page changes, update its note and its date together.
const CHECKED = '2026-11-14';

const DOCS = {
  whatIs: { label: 'GitHub Docs: What is GitHub Copilot?', url: 'https://docs.github.com/en/copilot/get-started/what-is-github-copilot' },
  plans: { label: 'GitHub Docs: Copilot plans', url: 'https://docs.github.com/en/copilot/get-started/plans' },
  inIdes: { label: 'GitHub Docs: GitHub Copilot in IDEs', url: 'https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides' },
  aboutAgents: { label: 'GitHub Docs: About GitHub Copilot agents', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/about-agents/about-github-copilot-agents' },
  quickstart: { label: 'GitHub Docs: Quickstart for using GitHub Copilot in your IDE', url: 'https://docs.github.com/en/copilot/get-started/quickstart-for-using-github-copilot-in-your-ide' },
  policies: { label: 'GitHub Docs: Managing Copilot policies as an individual subscriber', url: 'https://docs.github.com/copilot/how-tos/manage-your-account/managing-copilot-policies-as-an-individual-subscriber' },
  trainingBlog: { label: 'GitHub Blog: Updates to GitHub Copilot interaction data usage policy', url: 'https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/' },
  suggestions: { label: 'GitHub Docs: Getting code suggestions in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions' },
  promptEngineering: { label: 'GitHub Docs: Prompt engineering for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-engineering' },
  chatInIde: { label: 'GitHub Docs: Asking GitHub Copilot questions in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/chat-with-copilot/chat-in-ide' },
  cheatSheet: { label: 'GitHub Docs: GitHub Copilot Chat cheat sheet', url: 'https://docs.github.com/en/copilot/reference/chat-cheat-sheet' },
  contextManagement: { label: 'GitHub Docs: Managing context for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/context-management' },
  indexing: { label: 'GitHub Docs: Indexing repositories for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/repository-indexing' },
  spaces: { label: 'GitHub Docs: About GitHub Copilot Spaces', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/spaces' },
  repoInstructions: { label: 'GitHub Docs: Adding repository custom instructions', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions' },
  instructionsSupport: { label: 'GitHub Docs: Support for different types of custom instructions', url: 'https://docs.github.com/en/copilot/reference/custom-instructions-support' },
  responseCustomization: { label: 'GitHub Docs: Response customization', url: 'https://docs.github.com/en/copilot/concepts/prompting/response-customization' },
  promptFiles: { label: 'GitHub Docs: Prompt files for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-files' },
  agentMode: { label: 'GitHub Docs: Using agent mode in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode' },
  planMode: { label: 'GitHub Docs: Using plan mode in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-plan-mode' },
  mcp: { label: 'GitHub Docs: Model Context Protocol (MCP)', url: 'https://docs.github.com/en/copilot/concepts/customizations/mcp' },
  cloudAgent: { label: 'GitHub Docs: About Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent' },
  kickOff: { label: 'GitHub Docs: Kick off a task with Copilot agents on GitHub', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task' },
  risks: { label: 'GitHub Docs: Risks and mitigations for Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations' },
  codeReview: { label: 'GitHub Docs: GitHub Copilot code review', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review' },
  cli: { label: 'GitHub Docs: About GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli' },
  contentExclusion: { label: 'GitHub Docs: Content exclusion for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion' },
  sessionData: { label: 'GitHub Docs: About GitHub Copilot session data', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data' },
} satisfies Record<string, SourceLink>;

// The running example is SariStock, an invented small TypeScript app that tracks the stock of a sari-sari store (items, quantities, reorder levels).
const lessons: Lesson[] = [
  {
    id: 'ai-dev-copilot-01',
    day: 1,
    title: 'What GitHub Copilot is and what it can do',
    summary: 'The assistive, agentic and customizing sides of Copilot, where each one runs, and how to choose how closely to steer.',
    minutes: 20,
    skills: ['copilot-orientation'],
    intro: {
      objectives: [
        'Describe the assistive, agentic and customization sides of GitHub Copilot with an example of each',
        'Choose between inline suggestions, chat, agent mode and the cloud agent for a given task',
        'Explain why you stay responsible for everything Copilot writes',
      ],
      why: 'Copilot is not one feature but a family of them, from a suggestion in your editor to an agent that opens a pull request while you sleep. Knowing which one fits a task is what makes it faster than doing the work yourself.',
    },
    body: [
      {
        type: 'paragraph',
        text: "GitHub Copilot is GitHub's AI assistant for building software. If you have used ChatGPT or Claude in a browser, the big difference is where it lives: Copilot sits inside the places you already work, such as your code editor and GitHub itself, so it can see the file you have open and the repository around it instead of waiting for you to paste code into a chat. GitHub's documentation describes its job as helping you write, understand and ship software.",
      },
      { type: 'heading', text: 'Four families of features' },
      {
        type: 'paragraph',
        text: "The docs group Copilot into **assistive** features, which respond while you work (suggestions as you type, answers to questions, explanations of code); **agentic** features, which take a goal and work through several steps (researching a repository, proposing a plan, editing files, running tools, reviewing pull requests); **customizations**, which tailor its answers with instructions, reusable prompts and connected tools; and **external agents and tools**, such as partner coding agents and MCP servers from other providers. This course teaches the first three in depth, in the order you will meet them.",
      },
      {
        type: 'paragraph',
        text: "A way to remember the difference is how much you let go of the steering wheel. With inline suggestions you drive and Copilot whispers the next few words. In chat you ask and decide what to apply. In agent mode you describe a goal and watch Copilot take several steps in your editor, asking before it runs a command. With the cloud agent you hand over a well-scoped task and review the pull request later. The more you hand over, the more you must check afterwards.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Choosing how closely to steer: every path ends with you reviewing and testing',
        source: `flowchart TD
  A(Your task) --> B{How closely do you want to steer?}
  B -->|Line by line| C[Inline suggestions in the editor]
  B -->|Question or small change| D[Copilot Chat: ask, then apply]
  B -->|Multi-step, watching| E[Agent mode in your editor]
  B -->|Hand off, review later| F[Cloud agent opens a pull request]
  C --> G(You review and test)
  D --> G
  E --> G
  F --> G`,
      },
      { type: 'heading', text: 'Where it runs' },
      {
        type: 'table',
        headers: ['Surface', 'What you do there', 'Example in SariStock'],
        rows: [
          ['Editor (VS Code, JetBrains, Visual Studio, Xcode and others)', 'Inline suggestions, chat, agent mode', "Type `// items at or below reorder level` and accept the function Copilot suggests"],
          ['GitHub.com and GitHub Mobile', 'Chat about a repository, hand tasks to the cloud agent', "Assign the issue 'Add low-stock alert' to Copilot"],
          ['Pull requests', 'Ask Copilot to review them; the cloud agent opens its own pull requests', 'Add Copilot as a reviewer before a person reads the change'],
          ['Terminal (Copilot CLI)', 'Chat and agent work from the command line', 'Run `copilot` in the project folder and ask it to explain a failing test'],
        ],
      },
      {
        type: 'version',
        text: "GitHub's documentation groups Copilot into assistive features, agentic features (researching a repository, planning, editing files, running tools, reviewing pull requests and preparing tasks for review), customizations (instructions, reusable prompts, repository context, external tools, agent skills and custom agents) and external agents and tools such as partner coding agents and MCP servers. Which of them you get depends on your plan, your client and your organization's policies. Agent mode is available in Visual Studio Code, Visual Studio, JetBrains IDEs, Xcode and Eclipse. Copilot CLI answers questions, edits files and runs commands from the terminal on Linux, macOS and Windows.",
        checked: CHECKED,
        sources: [DOCS.whatIs, DOCS.aboutAgents, DOCS.inIdes, DOCS.cli],
      },
      {
        type: 'version',
        text: "Plans, in words: Copilot Free, Copilot Student (free for verified students), Copilot Pro, Pro+ and Max for individuals; Copilot Business and Copilot Enterprise for organizations (plus a Copilot access option for eligible enterprises). Copilot Free includes chat, inline suggestions, agent mode and Copilot Chat on GitHub, but with a monthly cap on completions, automatic model selection only, no cloud agent and only a limited code review of a selection in VS Code. Paid plans include the cloud agent and code review. Usage beyond plain suggestions is metered in GitHub AI Credits, and what you can use also depends on administrator policies. GitHub says verified teachers and maintainers of popular open source projects may be eligible for free Copilot Pro. Check the plans page for today's allowances.",
        checked: CHECKED,
        sources: [DOCS.plans],
        plans: 'Free, Student, Pro, Pro+, Max, Business, Enterprise',
      },
      {
        type: 'toolComparison',
        tools: ['copilot', 'cursor', 'claude-code', 'codex'],
        caption: 'Copilot next to the other coding tools in this path: the entries are checked against each product\'s own docs.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: an **editor** is the program where you read and change code, the way a word processor is where you write letters. VS Code is a popular free one. A **repository** (or repo) is a project's folder with the full history of every change saved, and **GitHub** is a website that stores repositories online so teams can share them. A **pull request** is a request to add your changes to the main project, where teammates can look first. Copilot is a helper that works inside the editor and on GitHub. It suggests, explains and, if you allow it, makes changes. It is like a very fast assistant who has read a lot of code but has never met your shop, so it guesses sometimes, and you check.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "For an engineering team the question is control, not features. The docs say you remain responsible for the goal and the constraints whichever agent you use, and that what is available depends on plan, client and organization policy, so rollout is a policy exercise: which surfaces are enabled, whether the cloud agent may run, which MCP servers are allowed, what content is excluded. Cost shapes behaviour too: agent sessions and chat draw on metered credits while basic suggestions do not, so teams that default every task to an agent will see usage that suggestions never produced. A sensible default is the least autonomous mode that finishes the job, with the pull request as the single gate every mode flows through.",
      },
      {
        type: 'warning',
        text: "Copilot can produce code that looks right and is wrong or insecure. GitHub says this about its own agent, and it is true of every mode. Read what it wrote, run the tests, and treat the change as yours, because after you merge it, it is.",
      },
      {
        type: 'takeaways',
        items: [
          'Copilot is a family: assistive features (suggestions, chat), agentic features (agent mode, cloud agent, code review) and customizations (instructions, prompts, tools).',
          'It runs in your editor, on GitHub.com, in pull requests and in the terminal; the plan and your organization decide what you can use.',
          'Pick the least autonomous mode that does the job, and remember that more hand-off means more checking.',
          'You are accountable for every change you accept, whoever or whatever wrote it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-01-match-1',
          kind: 'match',
          title: 'Which Copilot feature fits?',
          prompt: 'Each line is a situation in SariStock. Match it with the Copilot feature that fits it best.',
          concept: 'Copilot features',
          labels: { terms: 'Situation', meanings: 'Best feature' },
          pairs: [
            { term: 'You are mid-function and want the next few lines drafted while your hands stay on the keyboard', definition: 'Inline suggestions in the editor', note: 'That is the assistive, line-by-line side.' },
            { term: 'A clearly written issue is ready and you want a pull request waiting for you after lunch', definition: 'The cloud agent', note: 'Handing off a well-scoped task and reviewing later is what the cloud agent is for.' },
            { term: 'You want a change across three files made in your editor while you watch each terminal command', definition: 'Agent mode in the IDE', note: 'Agent mode works through steps locally and asks before commands.' },
            { term: "You just inherited a file and want to know what it does, without changing anything", definition: 'A question in Copilot Chat', note: 'Asking a question changes nothing.' },
          ],
          hints: [
            'Ask two things of each line: do you want to steer step by step, and do you want it to change files?',
            'Handing over a task and reviewing later is the most hands-off option; explaining code is the least.',
            'Suggestions as you type, chat answers, local agent steps and a background pull request are the four you are matching.',
          ],
          explanation: 'The more autonomy a task needs, the further along the family you go: suggestions for the next line, chat for questions, agent mode for watched multi-step work, and the cloud agent for work you review as a pull request.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-01-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Assistive, agentic or a customization?',
          prompt: 'Tap each card to check your answer.',
          concept: 'Copilot families',
          cards: [
            { front: 'Gray text appears as you type a function name. Which family?', back: 'Assistive: it responds while you work, and you accept or reject it.' },
            { front: "You type 'add a low-stock alert' and Copilot edits four files and runs the tests. Which family?", back: 'Agentic: it takes a goal and works through several steps.' },
            { front: 'A file in your repository tells Copilot to always store money as whole centavos. Which family?', back: 'A customization: instructions that shape every answer.' },
          ],
          hints: [],
          explanation: 'Assistive features respond, agentic ones act through steps, and customizations change how both behave.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-01-q1',
        prompt: "In SariStock you type the goal 'add a low-stock alert' and Copilot researches the repository, edits several files and runs the tests. Which kind of feature is that?",
        choices: [
          "An assistive feature, because Copilot responds to something you typed in the editor",
          "A customization, because the project behaves differently once the work has finished",
          "An agentic feature: it takes a goal and works through steps",
          "An external tool, because running a command means leaving Copilot behind",
        ],
        answer: 2,
        explanation: 'Agentic features take a goal and work through steps (research, edit, run tools). Assistive features respond to what you are doing right now, such as a suggestion or an answer.',
      },
      {
        id: 'ai-dev-copilot-01-q2',
        prompt: 'You are on Copilot Free and cannot find the cloud agent anywhere. According to the plans page, why?',
        choices: [
          'It is only available on macOS',
          'It needs a separate extension from the marketplace',
          'It has been switched off for accounts younger than a year',
          'Copilot Free does not include it; paid plans do',
        ],
        answer: 3,
        explanation: 'The plans page lists the cloud agent as not included on Copilot Free. Agent mode in the editor is included, with limits.',
      },
      {
        id: 'ai-dev-copilot-01-q3',
        prompt: 'A suggestion you accepted without reading causes a bug in production. Who is accountable?',
        choices: [
          "Whoever accepted and merged the change",
          "GitHub, because it wrote the code and should have caught the bug",
          "Nobody, because an automated tool wrote the code and cannot be held accountable",
        ],
        answer: 0,
        explanation: "GitHub's docs say that for every type of agent you remain responsible for the goal, the limits and reviewing what it produces.",
      },
      {
        id: 'ai-dev-copilot-01-q4',
        prompt: 'You have a clear, small task and want to keep full control of each step. Which choice follows the advice to use the least autonomous mode that finishes the job?',
        choices: [
          'Assign an issue to the cloud agent so you never have to look at the code',
          'Start an agent session for every task, however small',
          'Use inline suggestions or a chat question and apply the result yourself',
        ],
        answer: 2,
        explanation: 'Small, well-understood work does not need an autonomous run. Suggestions and chat keep you in control, and you move up to agent mode or the cloud agent when the task is bigger.',
      },
      {
        id: 'ai-dev-copilot-01-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a repository?',
        choices: [
          "A website where you ask an AI questions about your code",
          "A setting in your editor that turns Copilot on and off",
          "A kind of code editor that is used mainly by beginners",
          "A project folder with its full change history",
        ],
        answer: 3,
        explanation: 'A repository holds your project files and their full history. GitHub stores repositories online, and Copilot can read the one you are working in.',
      },
      {
        id: 'ai-dev-copilot-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team of twelve enables Copilot and a month later the AI usage line is far above plan. Everyone now starts an agent session for tasks that used to take a suggestion or a chat question. What is the best response?',
        choices: [
          "Turn off agent mode for everyone and rely only on completions from now on",
          "Ask everyone to use agent mode less, with no guidance on when to use it",
          "Write down which mode suits which task and review usage against it",
          "Move the whole team to a different plan without looking at what is being used",
        ],
        answer: 2,
        explanation: 'Agent sessions and chat draw on metered credits, so cost follows behaviour. Guidance on the least autonomous mode that does the job, checked against real usage, fixes the cause instead of banning a useful feature.',
      },
    ],
    task: {
      title: 'Map Copilot to your own work',
      minutes: 12,
      steps: [
        'Open the "What is GitHub Copilot?" page linked in the first version note and read the four families.',
        'Write three tasks from a project you know (or SariStock): one for inline suggestions, one for chat, one you would hand to an agent.',
        'For each task, write the check that would prove Copilot got it right (a test command, a page you would open).',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Open any GitHub repository in your browser and find where Pull requests and Issues live. Write one sentence on what each is for.'] },
      { audience: { min: 'advanced' }, steps: ['Look at your organization or team setup and list which Copilot surfaces, models and agents are enabled. Mark one you would change and the policy that controls it.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-02',
    day: 2,
    title: 'Setting up Copilot in your editor',
    summary: 'Install the extension, sign in, try your first suggestion and chat, and set the privacy options that decide what happens to your data.',
    minutes: 20,
    skills: ['copilot-orientation', 'copilot-safety'],
    intro: {
      objectives: [
        'Set up Copilot in VS Code with a GitHub account and a Copilot plan',
        'Run a first suggestion and a first chat question to confirm it works',
        'Find and set the personal privacy options for public-code matching and model training',
      ],
      why: 'A working setup takes ten minutes, but the privacy choices you make now decide whether your code and prompts can be used to train models. Setting them on purpose is part of using a tool that sees your code.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Copilot reaches your editor through an **extension**, a small add-on that gives the editor new abilities. To use it you need three things: a GitHub account, a Copilot plan on that account (the free plan counts), and the extension signed in to the account. The setup below uses VS Code because it has the most complete Copilot features, but the same ideas apply to JetBrains IDEs, Visual Studio and others.",
      },
      { type: 'heading', text: 'The setup, step by step' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Make sure your GitHub account has a Copilot plan. Individuals can start on Copilot Free.',
          'Install the Copilot extension in VS Code, using the installation guide the docs link to rather than a search result.',
          'Sign in to GitHub from VS Code when it asks. If sign-in fails, the docs have a troubleshooting guide.',
          'Open Copilot Chat with Ctrl+Alt+I (Windows and Linux) or Control+Command+I (Mac), and ask "what does this file do" with a file open.',
          'Get a first suggestion: in a new .js file, type the line below and press Tab when gray text appears.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The first-suggestion test from the quickstart (the exact suggestion will differ) (fragment)',
        code: `function calculateDaysBetweenDates(begin, end) {`,
      },
      {
        type: 'paragraph',
        text: "After you type that line, Copilot should show the body of the function in gray, called **ghost text**. Pressing Tab accepts it and Esc rejects it. If nothing appears, check that you are signed in and that the extension is enabled. Keep the file: next lesson uses this exact moment to talk about when to accept a suggestion and when not to.",
      },
      { type: 'heading', text: 'Privacy settings you should look at now' },
      {
        type: 'paragraph',
        text: "On your personal account, Copilot's settings page on GitHub holds a few switches that matter more than any shortcut. Two deserve a decision today. The first is **Suggestions matching public code**: Block hides suggestions that closely match public code on GitHub, and Allow shows them along with where they came from. The second is **Allow GitHub to use my data for AI model training**: set it to Disabled to opt out. Read both and choose deliberately, instead of living with the defaults.",
      },
      {
        type: 'table',
        headers: ['Setting (personal account)', 'What it controls', 'Default you should check'],
        rows: [
          ['Suggestions matching public code', 'Allow or block suggestions that closely match public code', 'Look at it and decide; Block is the cautious choice for work code'],
          ['Allow GitHub to use my data for AI model training', 'Whether your Copilot interactions can be used to train models', 'On for Free, Pro, Pro+ and Max unless you disable it'],
          ['Copilot access to Bing', 'Lets Copilot Chat search the web', 'Disabled by default'],
          ['Cloud agent: repository access', 'Which of your repositories the cloud agent may work in', 'All repositories by default'],
        ],
      },
      {
        type: 'version',
        text: "Quickstart as the docs give it: you need an active Copilot plan and must be signed in to GitHub in your IDE; install the Copilot extension, sign in, open Copilot Chat (Ctrl+Alt+I on Windows and Linux, Control+Command+I on Mac) and ask about the open file, then try the inline suggestion with `function calculateDaysBetweenDates(begin, end) {` in a new .js file. In agent mode you pick Agent in the chat window. Support for features differs by IDE, so check the feature matrix for yours.",
        checked: CHECKED,
        sources: [DOCS.quickstart, DOCS.inIdes],
      },
      {
        type: 'version',
        text: "Personal Copilot settings: Suggestions matching public code (Allow or Block), Copilot access to Bing (disabled by default), cloud agent repository access (all repositories by default), partner agents (a paid plan is required) and Allow GitHub to use my data for AI model training. GitHub's blog says that from April 24, 2026 interaction data from Copilot Free, Pro and Pro+ users is used to train and improve models unless the user opts out, and the docs add Max to that list. Copilot Business and Copilot Enterprise are not affected, the training setting does not appear for those accounts, and GitHub says it does not train on private repository content at rest. If you opted out of data collection before, that choice is kept. These policies change: reread the settings page and the blog post before you trust this note.",
        checked: CHECKED,
        sources: [DOCS.policies, DOCS.trainingBlog],
        plans: 'Individual plans (Free, Pro, Pro+, Max) have the training switch; Business and Enterprise do not',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: signing in tells GitHub who you are, so it knows which Copilot plan to use. **Ghost text** is the pale preview of code that Copilot thinks you want next, a bit like the word suggestions on a phone keyboard. Nothing is added to your file until you press Tab, and Esc dismisses it. The privacy settings answer two questions: may Copilot show you code that closely matches code others published, and may GitHub learn from your prompts and code snippets to improve its models. If your project is private or belongs to an employer, say no to the second until you have checked the rules. When in doubt, ask your teacher, client or manager.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "In a company the personal switches mostly stop mattering, because a seat from a Business or Enterprise organization inherits the organization's policies: for example, the public-code matching setting inherits from the organization or enterprise when your seat comes through an Enterprise Cloud organization. The MCP policy is off by default for Business and Enterprise, and organization instructions only run on GitHub.com. Your rollout checklist is therefore administrative: confirm which plan each developer's seat comes from, set the public-code and MCP policies on purpose, decide which repositories get content exclusion, and make sure contractors on personal Free or Pro plans are not used on client code. Mixed personal and company accounts are the usual hole.",
      },
      {
        type: 'takeaways',
        items: [
          'You need a GitHub account, a Copilot plan and the extension signed in; the free plan is enough to start.',
          'Ghost text is a preview: Tab accepts it, Esc rejects it, and nothing changes until you press Tab.',
          'Decide on purpose about public-code matching and model training; the training switch exists on individual plans only.',
          'In an organization, policies set by administrators win over your personal choices.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-02-scenario-1',
          kind: 'scenario',
          title: 'A client repository on a personal plan',
          prompt: 'Choose the response that protects your client and still lets you work.',
          concept: 'Copilot privacy',
          situation: "You are freelancing on a client's private repository using your own personal Copilot Pro account. The client's contract says their code must not be used to train anyone's models. You have not looked at your Copilot settings yet.",
          options: [
            {
              text: "Open your Copilot settings, check 'Allow GitHub to use my data for AI model training', set it to Disabled, and tell the client which tool and plan you use.",
              consequence: "You have used the control that exists for individual plans and been open about the tool. The client can decide with full information.",
              quality: 'best',
            },
            {
              text: 'Keep going: the repository is private, and private code is never used for training.',
              consequence: "GitHub's blog says code at rest in a private repository is not trained on, but snippets and outputs sent to Copilot during a session can be, unless you opt out. Your assumption could break the contract.",
              quality: 'poor',
            },
            {
              text: 'Stop using Copilot on the project and say nothing about why.',
              consequence: 'Safe for the contract but it gives up a useful tool, and the client learns nothing about the policy question. Opting out and disclosing gets both.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Which control does a personal plan actually give you over model training?',
            'Private repositories are protected at rest, but what happens to code sent to Copilot during a session?',
            'The best answer uses the control and tells the client; staying silent or assuming is weaker.',
          ],
          explanation: 'On an individual plan the training switch is your control: set it to Disabled and be open with the client. Private repositories are protected at rest, but snippets you send in a session are not covered by that promise unless you opt out.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-02-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Check your setup',
          prompt: 'Tap each card to see whether you have the step right.',
          concept: 'Copilot setup',
          cards: [
            { front: 'You pressed Tab and nothing changed in the file. What was likely missing?', back: 'No suggestion appeared. Check that you are signed in and that the extension is enabled. Ghost text only shows when Copilot offers one.' },
            { front: 'What do you press to dismiss ghost text you do not want?', back: 'Esc. Pressing Tab accepts it.' },
            { front: 'Where do you choose whether Copilot may show suggestions that match public code?', back: "In Copilot settings on GitHub, under 'Suggestions matching public code' (Allow or Block)." },
          ],
          hints: [],
          explanation: 'Setup problems are almost always sign-in or extension problems, and the privacy choices live in your Copilot settings on GitHub.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-02-q1',
        prompt: "Which setting should you change if you do not want Copilot to offer code that closely matches public code on GitHub?",
        choices: [
          'Allow GitHub to use my data for AI model training',
          'Suggestions matching public code, set to Block',
          'Copilot access to Bing',
          'Cloud agent repository access',
        ],
        answer: 1,
        explanation: "Block under 'Suggestions matching public code' hides suggestions that closely match public code. The training switch is about a different thing: whether your interactions can be used to train models.",
      },
      {
        id: 'ai-dev-copilot-02-q2',
        prompt: 'What do you need before the extension can give you suggestions?',
        choices: [
          "A paid plan, because the free plan has no suggestions at all",
          "Only the extension, since it signs you in on its own",
          "A GitHub account with a Copilot plan, and the extension signed in",
          "A pull request that is already open in the repository you work on",
        ],
        answer: 2,
        explanation: 'The quickstart says you need an active Copilot plan and must be signed in to GitHub in your IDE. Copilot Free is a plan, so it counts.',
      },
      {
        id: 'ai-dev-copilot-02-q3',
        prompt: 'You opt out of model training on your Copilot Pro account. What does that setting control?',
        choices: [
          "Whether GitHub can use your Copilot interactions to train and improve its models",
          "Whether agent mode and the other advanced features stay switched on for your account at all",
          "Whether you are still allowed to use chat in addition to the inline suggestions",
        ],
        answer: 0,
        explanation: "The setting 'Allow GitHub to use my data for AI model training' controls only whether your interactions can be used to train models. It is a privacy switch, not a feature switch.",
      },
      {
        id: 'ai-dev-copilot-02-q4',
        prompt: 'You are on a Copilot Business seat from your employer and cannot find the model training switch in your personal settings. Why?',
        choices: [
          "Your browser hides settings on accounts that were created recently",
          "You have not finished installing the extension in your editor yet",
          "Training stays switched off until an administrator asks for it",
          "Business and Enterprise data is not used, so the switch is hidden",
        ],
        answer: 3,
        explanation: 'The setting does not appear for accounts with a Business or Enterprise license, because GitHub does not use that customer data for training.',
      },
      {
        id: 'ai-dev-copilot-02-q5',
        audience: { max: 'beginner' },
        prompt: 'What is ghost text?',
        choices: [
          "A pale preview of code that only becomes real when you press Tab",
          "A hidden file that Copilot saves inside your project folder to remember you",
          "A message that another developer on your team sent you in the editor",
          "An error message that the editor shows in gray text near the cursor",
        ],
        answer: 0,
        explanation: 'Ghost text is a preview. Nothing is added to your file until you accept it with Tab, and Esc removes it.',
      },
      {
        id: 'ai-dev-copilot-02-q6',
        audience: { min: 'advanced' },
        prompt: 'A contractor on your team uses a personal Copilot Pro account on your company repository. What is the most useful control to review first?',
        choices: [
          "The keyboard shortcuts the contractor uses to accept suggestions in the editor",
          "The color theme and font size the contractor has chosen for their editor window",
          "Whether the contractor opens GitHub from the mobile app or from a laptop browser",
          "Which plan each seat comes from; policies only cover organization seats",
        ],
        answer: 3,
        explanation: "Organization policies such as MCP, public-code matching and content exclusion apply to seats assigned through the organization. A personal plan sits outside them, so a mixed setup is a gap.",
      },
    ],
    task: {
      title: 'Set up and test Copilot',
      minutes: 15,
      steps: [
        'Install and sign in to Copilot in VS Code, then open Copilot Chat and ask what a file in any project does.',
        'Type the calculateDaysBetweenDates line in a new .js file and press Tab if ghost text appears. Press Esc on a second try to see rejection.',
        'Open your Copilot settings on GitHub and write down your current values for public-code matching and model training.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Ask Copilot Chat: 'Explain what this file does in simple words, line by line.' Then ask it to define any word you did not know."] },
      { audience: { min: 'advanced' }, steps: ['Find where your organization sets Copilot policies and list which ones apply to your seat. Note one you would change and who owns that decision.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-03',
    day: 3,
    title: 'Completions that help instead of distract',
    summary: 'How inline suggestions work, how to steer them with comments and open files, and how to review each one before pressing Tab.',
    minutes: 20,
    skills: ['copilot-completions', 'copilot-safety'],
    intro: {
      objectives: [
        'Accept, reject, cycle and partly accept an inline suggestion',
        'Write a comment that steers a suggestion toward the code you want',
        'Spot a risky suggestion and replace it with a safe one',
      ],
      why: 'Inline suggestions are the part of Copilot you will use hundreds of times a day. Used with a reading habit they save real time, and used on autopilot they quietly add bugs and security holes.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Inline suggestions, also called code completions, are the oldest Copilot feature. As you type, Copilot shows what it thinks comes next as gray ghost text, anywhere from the rest of a line to a whole function. Think of the word prediction on a phone keyboard, but trained on a huge amount of code and able to continue several lines. It is fast and it is a guess, so the skill is not accepting more, it is accepting well.",
      },
      { type: 'heading', text: 'The keys to know' },
      {
        type: 'table',
        headers: ['What you want', 'VS Code, Windows and Linux', 'VS Code, Mac'],
        rows: [
          ['Accept the whole suggestion', 'Tab', 'Tab'],
          ['Reject it', 'Esc', 'Esc'],
          ['See the next or previous alternative', 'Alt+] and Alt+[', 'Option+] and Option+['],
          ['Accept only the next word', 'Ctrl+Right arrow', 'Command+Right arrow'],
          ['Open several alternatives in a new tab', 'Ctrl+Enter', 'Ctrl+Enter'],
        ],
        caption: 'Shortcuts differ a little in JetBrains and Visual Studio; the docs list each one.',
      },
      {
        type: 'paragraph',
        text: "Accepting one word at a time is the underused move. When the first half of a suggestion is right and the rest drifts, take the part you trust and keep typing, and Copilot offers a fresh guess from there. Alternatives help when the first idea is close but not right: cycle once or twice before you give up and type it yourself.",
      },
      { type: 'heading', text: 'Steer with comments and open files' },
      {
        type: 'paragraph',
        text: "A comment is a prompt. Describe what the next lines should do, press Enter, and Copilot suggests code to match. It also uses your open files to understand what you are doing, so open the files that hold the types and helpers you want it to use and close the ones that do not matter. Here is SariStock with a comment that names the rule exactly instead of leaving Copilot to guess.",
      },
      {
        type: 'code',
        language: 'typescript',
        label: 'A comment as a prompt, and a realistic suggestion (an example; real output varies)',
        code: `export type Item = { id: string; name: string; quantity: number; reorderLevel: number };

// Return the items whose quantity is at or below their own reorderLevel,
// sorted with the lowest quantity first. Do not change the input array.
export function lowStockItems(items: Item[]): Item[] {
  return items
    .filter((item) => item.quantity <= item.reorderLevel)
    .sort((a, b) => a.quantity - b.quantity);
}`,
      },
      {
        type: 'paragraph',
        text: "Read that suggestion the way a reviewer would. It filters with `<=`, matching 'at or below'. It calls `.sort` after `.filter`, and `.filter` returns a new array, so the input array is untouched, as the comment asked. Had the comment said only 'low stock items', Copilot might have chosen `<` or compared against a fixed number, and both would look reasonable. A precise comment turns a guess into something you can check line by line.",
      },
      {
        type: 'version',
        text: "GitHub's docs: ghost text is accepted with Tab and rejected with Esc; hovering a suggestion shows arrows for alternatives; in VS Code Alt+] and Alt+[ (Option on Mac) move between suggestions, Ctrl+Enter opens several in a new tab, and Command or Ctrl plus Right arrow accepts the next word. Next edit suggestions, which predict where your next edit should be and press Tab to jump and Tab again to accept, are available in VS Code, Visual Studio, Xcode and Eclipse (and in the JetBrains plugin). Copilot uses your open files to understand your request, so open the relevant ones and close the irrelevant. Copilot Free has a monthly cap on completions. Content exclusion can stop Copilot using chosen files for suggestions, on Business and Enterprise.",
        checked: CHECKED,
        sources: [DOCS.suggestions, DOCS.promptEngineering, DOCS.plans, DOCS.inIdes],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: every suggestion is a proposal from a helper that has read a lot of code, not a fact. A good habit is to read it before you press Tab, the way you would read a text message before sending it. Look at three things: does it do what my comment says, does it use names that exist in my project, and does it look after things like empty lists or a person typing the wrong thing? In the example above, `.filter(...)` keeps only the items that match a rule, `<=` means 'less than or equal to', and `.sort(...)` puts them in order. If a line makes no sense to you, ask Copilot Chat to explain it before keeping it.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat suggestions as unreviewed code from a fast junior who has not read your codebase. The failure modes are well known: a plausible but outdated API, a subtly wrong boundary, copied patterns that are wrong for this module, and security-relevant shortcuts such as string-built SQL or disabled certificate checks. Your safeguards are the ones you already trust: types, linters, tests and review. Two team settings matter here: public-code matching can be blocked so a suggestion that closely matches published code is hidden, and content exclusion keeps chosen files out of suggestions on Business and Enterprise. Measure by what survives review, not by how many suggestions were accepted.",
      },
      {
        type: 'warning',
        text: 'Suggestions often build database queries by joining strings together, because that pattern is common in the code Copilot learned from. Joining user input into a query is how SQL injection happens. Never accept it; use the library\'s parameter placeholders instead.',
      },
      {
        type: 'takeaways',
        items: [
          'Tab accepts, Esc rejects, Alt+] (Option+] on Mac) cycles alternatives, and Ctrl or Command with Right arrow accepts one word.',
          'A precise comment is a prompt: name the rule, the sort order and what must not change.',
          'Open the files that hold your types and helpers; close the ones that do not matter.',
          'Read every suggestion for the rule, the names and the edge cases before you accept it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'A risky suggestion',
          prompt: 'Copilot suggested this function and you were about to press Tab. One line is unsafe. Tap the risky line, then choose the safe replacement.',
          concept: 'Reviewing suggestions',
          language: 'typescript',
          code: `import Database from 'better-sqlite3';

const db = new Database('saristock.db');

// Find an item by the name a customer typed
export function findItemByName(name: string) {
  return db.prepare("SELECT * FROM items WHERE name = '" + name + "'").get();
}`,
          bugLine: 7,
          lineNote: 'That line is fine. Look for where text typed by a person is joined into a database query.',
          fixes: [
            { line: "  return db.prepare('SELECT * FROM items WHERE name = ?').get(name);", correct: true, why: 'The question mark is a placeholder: the library sends the name as data, never as part of the query, so a name such as x\' OR \'1\'=\'1 is only a strange name.' },
            { line: "  return db.prepare(\"SELECT * FROM items WHERE name = '\" + name.trim() + \"'\").get();", correct: false, why: 'Trimming spaces does not stop quotes. The name is still joined into the query text.' },
            { line: "  return db.prepare(\"SELECT * FROM items WHERE name = '\" + name.replace(/'/g, \"''\") + \"'\").get();", correct: false, why: 'Hand-escaping quotes is fragile and easy to get wrong. The library already has a safe way: placeholders.' },
            { line: "  return db.prepare(\"SELECT * FROM items WHERE name = '\" + String(name) + \"'\").get();", correct: false, why: 'Converting to a string changes nothing about the danger: the text is still joined into the query.' },
          ],
          hints: [
            'Look for the line that builds the query from the name a person typed.',
            'A database library can send values separately from the query text, using a placeholder.',
            'Replace the joined string with a query that has a question mark and pass the name to `.get(...)`.',
          ],
          explanation: 'Joining typed text into a query lets a person change the query itself (SQL injection). A parameter placeholder keeps data and query apart. Copilot suggests the joined version often because it is common in older code, which is why you read before you press Tab.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-03-match-1',
          kind: 'match',
          title: 'Which key now?',
          prompt: 'Match each moment with the move that fits it best.',
          concept: 'Inline suggestions',
          labels: { terms: 'The moment', meanings: 'The move' },
          pairs: [
            { term: 'The first half of the gray text is exactly right, but the rest invents a function you do not have', definition: 'Accept the next word only, then keep typing', note: 'Taking part of a suggestion keeps what is good.' },
            { term: 'The suggestion is plainly wrong and distracting', definition: 'Press Esc', note: 'Esc rejects the ghost text.' },
            { term: 'The idea looks close but uses < where you need <=', definition: 'Cycle to the next alternative, or fix the one character yourself', note: 'Alternatives are cheap to look at.' },
            { term: 'You edited a type and the same rename is needed a few lines below', definition: 'Use the next edit suggestion: Tab to jump, Tab to accept', note: 'Next edit suggestions predict where your next change belongs.' },
          ],
          hints: [
            'Decide first whether the suggestion is wholly wrong, partly right, or close.',
            'Partly right calls for taking part of it; close calls for a nearby alternative or a small fix.',
            'A follow-up change elsewhere in the file is what next edit suggestions are for.',
          ],
          explanation: 'Partly right, wholly wrong, close and a follow-up edit each have a different move. Using them keeps the suggestion that helps and drops the one that distracts.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-03-q1',
        prompt: 'A suggestion is right for the first half of the line and wrong after that. What is the best move?',
        choices: [
          "Press Tab and delete the wrong half later when you notice it",
          "Press Esc and give up on suggestions for this file entirely",
          "Accept a word at a time until it drifts, then type the rest",
          "Close the editor and restart it to get a better suggestion",
        ],
        answer: 2,
        explanation: 'Accepting a word at a time keeps the part you trust. Accepting everything and cleaning up later is how wrong lines get left behind.',
      },
      {
        id: 'ai-dev-copilot-03-q2',
        prompt: "You write the comment `// low stock items` and Copilot uses `quantity < 10` for the rule. What went wrong, and what is the fix?",
        choices: [
          "The comment was vague; name the rule, such as at or below reorder level",
          "Copilot ignores comments entirely, so you must type the whole function yourself",
          "Copilot can compare only against fixed numbers and never against fields of an item",
        ],
        answer: 0,
        explanation: 'A comment is a prompt. A vague one leaves Copilot to invent the rule. A precise one names the field and the comparison, which you can then check.',
      },
      {
        id: 'ai-dev-copilot-03-q3',
        prompt: 'According to the docs, how does Copilot use your open files when you ask for a suggestion?',
        choices: [
          "It deletes the files you are not using to save space on disk",
          "It uploads them to your teammates so they can see your progress",
          "It ignores them and uses only the single line you are typing",
          "It uses them to understand your request, so open relevant files",
        ],
        answer: 3,
        explanation: 'The prompt-engineering page says Copilot uses your open files to understand your request. That is why file choice is part of steering.',
      },
      {
        id: 'ai-dev-copilot-03-q4',
        prompt: 'Why is a suggestion that builds a database query by joining a typed name into the text dangerous?',
        choices: [
          "A person can type text that changes the query itself (SQL injection)",
          "It makes the query run slower than a version with placeholders would",
          "It can corrupt the database file when two people search at once",
        ],
        answer: 0,
        explanation: 'Joined text becomes part of the query, so crafted input can change what the query does. Placeholders keep data and query separate.',
      },
      {
        id: 'ai-dev-copilot-03-q5',
        audience: { max: 'beginner' },
        prompt: "Before pressing Tab on a suggestion, which question is worth asking?",
        choices: [
          "Is the gray text long enough to be worth pressing Tab for?",
          "Did Copilot suggest it quickly, without any noticeable delay at all?",
          "Does it look like code from other projects I have seen?",
          "Does it do what my comment says, with names that exist here?",
        ],
        answer: 3,
        explanation: 'Fast and familiar-looking do not make code right. Checking it against your intent and your own names catches most problems.',
      },
      {
        id: 'ai-dev-copilot-03-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team reports that accepted suggestions are a growing share of the code and that defects found in review rose. Which response measures the right thing?',
        choices: [
          "Track what survives review and tests, and tighten guardrails where suggestions fail",
          "Track the share of accepted suggestions and push that number higher each sprint",
          "Disable inline suggestions for senior developers only, since they review the most code",
          "Ask developers to type more slowly so each suggestion gets a closer look",
        ],
        answer: 0,
        explanation: 'Acceptance rate measures use, not value. Outcomes in review and tests show where suggestions fail, and the fix is stronger guardrails and clearer conventions.',
      },
    ],
    task: {
      title: 'Steer one suggestion',
      minutes: 12,
      steps: [
        'In a small project, write a vague comment for a function (such as "// low stock items") and press Enter. Note what Copilot suggests.',
        'Delete the suggestion and rewrite the comment with the exact rule, sort order and what must not change. Compare the new suggestion with the first.',
        'Review the new suggestion line by line, and cycle through at least one alternative with Alt+] (Option+] on Mac).',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Select the suggestion Copilot gave and ask Copilot Chat: 'Explain this code line by line in simple words.' Keep it only if you can say what each line does."] },
      { audience: { min: 'advanced' }, steps: ['Write the test first for the function, then ask for a suggestion and run the test. Record every boundary the suggestion got wrong on the first try.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-04',
    day: 4,
    title: 'Copilot Chat for understanding and changing code',
    summary: 'Use the chat modes, inline chat and slash commands to understand code first, then change it in small, reviewable steps.',
    minutes: 22,
    skills: ['copilot-chat'],
    intro: {
      objectives: [
        'Pick between Ask, Plan and Agent in Copilot Chat for a task',
        'Use chat to understand unfamiliar code and check its explanation against the code',
        'Request a small change, review the diff and verify it',
      ],
      why: 'Most of a developer\'s day is reading code someone else wrote. Chat is where Copilot earns its keep: it shortens the time to understand a file, and it makes small changes you can review in seconds.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Copilot Chat is a conversation panel inside your editor, plus a quicker **inline chat** that opens right on the code you selected. Unlike a chat in a browser, it already knows which file you have open and which lines you selected, because the docs say Copilot references the open file or your selection by default. That makes the first rule of working with it easy: understand before you change. Ask what the code does, check the answer against the code, and only then ask for an edit.",
      },
      { type: 'heading', text: 'Choose a mode' },
      {
        type: 'table',
        headers: ['Mode', 'What it does', 'Use it when'],
        rows: [
          ['Ask', 'Answers questions about your code and suggests code you apply yourself', 'You want to understand something, or get a snippet to review'],
          ['Plan', 'Researches the task and drafts a plan; makes no code changes until you approve it', 'The task is large or unclear and you want to agree the steps first'],
          ['Agent', 'Breaks a task into steps, edits files, runs commands and fixes its own errors', 'You can state the goal and want it carried out (next lessons)'],
        ],
        caption: 'In VS Code you switch modes with the dropdown at the bottom of the chat view. JetBrains also has an Edit mode, and Visual Studio has Ask and Agent.',
      },
      { type: 'heading', text: 'Understand first' },
      {
        type: 'paragraph',
        text: "Open the file, select the function and ask for an explanation that includes what the code does not handle. That last request matters: it turns a summary into a review. Below, SariStock has a small function and a realistic answer. The answer is an example of what such a tool might say, not a recording.",
      },
      {
        type: 'code',
        language: 'typescript',
        label: 'The selected function',
        code: `export function applySale(item: Item, qty: number): Item {
  return { ...item, quantity: item.quantity - qty };
}`,
      },
      {
        type: 'prompt',
        label: 'Ask mode, with the function selected',
        text: 'Explain what applySale does in two sentences, then list every input it does not handle safely.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'An example answer (real answers vary)',
        code: `applySale returns a copy of the item with qty taken off its quantity; it does not change the original.
It does not check that qty is a positive whole number, or that qty is not more than the stock, so
a sale of 3 from 2 leaves -1 in stock, and a qty of -5 adds stock.`,
      },
      {
        type: 'paragraph',
        text: "Check that answer against the code before trusting it. `{ ...item, quantity: ... }` does build a new object, so the claim about the original is right. There is no validation, so the two gaps are real too. Always do this check: a chat explanation is a claim about your code, and the code is the evidence. Now ask for the smallest change that fixes the gaps, and say what to keep.",
      },
      {
        type: 'prompt',
        label: 'Change request in the same chat',
        text: 'Change applySale to throw an Error when qty is not a positive whole number or is greater than item.quantity. Keep it a pure function. Change nothing else in the file.',
      },
      {
        type: 'code',
        language: 'typescript',
        label: 'The kind of result to expect, which you must still review and test',
        code: `export function applySale(item: Item, qty: number): Item {
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error('Sale quantity must be a positive whole number');
  }
  if (qty > item.quantity) {
    throw new Error('Only ' + item.quantity + ' of ' + item.name + ' in stock');
  }
  return { ...item, quantity: item.quantity - qty };
}`,
      },
      {
        type: 'paragraph',
        text: "Review it as a diff. The two guards match the request, `Number.isInteger` rejects 2.5 and `qty <= 0` rejects zero and negatives, and the last line is unchanged. Then prove it: run the tests, or write one for `applySale(item, 3)` when the stock is 2. Slash commands save typing for common jobs: `/explain` explains the code in the active editor, `/fix` proposes fixes for problems in the selection and `/tests` generates unit tests for it.",
      },
      {
        type: 'version',
        text: "Chat modes by IDE, from the docs: VS Code has Ask, Agent and Plan; Visual Studio has Ask and Agent (17.14 and later); JetBrains has Agent, Ask, Plan and Edit; Xcode and Eclipse have Agent and Plan. By default Copilot references the open file or your selected code. In VS Code, inline chat is Ctrl+I (Windows and Linux) or Command+I (Mac). Slash commands from the cheat sheet: `/explain`, `/fix` and `/tests` in VS Code, Visual Studio, JetBrains and Xcode, `/fixTestFailure` in VS Code, `/doc` in Visual Studio and Xcode. In VS Code chat participants include `@github`, `@terminal` and `@vscode`. You can change the model with the model picker, and premium models are available on some plans.",
        checked: CHECKED,
        sources: [DOCS.chatInIde, DOCS.cheatSheet, DOCS.planMode],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **mode** is a setting for how much Copilot is allowed to do. Ask is like asking a teacher a question: you get an answer, nothing in your files changes. Plan is like asking the teacher to write a lesson plan first. Agent is like asking them to start the work. A **slash command** is a short word starting with / that stands for a common request, for example `/explain`. A **diff** is a before-and-after view of what changed, with removed lines and added lines marked. In the code above, `throw new Error(...)` stops the function and reports a problem, and `Number.isInteger(qty)` asks whether qty is a whole number like 3 and not 2.5.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'If you have built a few small apps, make "explain what this does not handle" your standard question for any unfamiliar function. It is the fastest way to find the missing checks, and the missing checks are where bugs live.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Chat is a reading tool before it is a writing tool. In a large codebase use Ask or Plan to build a map: entry points, who calls a function, where state is mutated, then verify each claim by opening the cited code, because a confident explanation can be wrong in a way that reads fine. Write change requests as constraints (pure function, no new dependency, touch only this file, keep the public signature) and demand a minimal diff, so review is cheap. Keep the model's job narrow, and use your own tools for what they do better: the type checker for signatures, search for call sites, tests for behaviour. Start a new chat when the topic changes so stale context does not leak into the answer.",
      },
      {
        type: 'takeaways',
        items: [
          'Ask answers and suggests, Plan drafts steps and changes nothing, Agent acts; pick the least powerful mode that fits.',
          'Understand first: ask what the code does and what it does not handle, then check the answer against the code.',
          'Request small, constrained changes, review the diff, and prove it with a test.',
          'Slash commands such as /explain, /fix and /tests save typing for common jobs.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-04-predict-output-1',
          kind: 'predict-output',
          title: 'Trace it before you trust the explanation',
          prompt: 'Copilot Chat explained `describeStock` as "labels each item out, low or ok". Before agreeing, work out exactly what this program prints.',
          concept: 'Checking explanations',
          language: 'javascript',
          code: `function describeStock(item) {
  if (item.quantity === 0) return 'out';
  if (item.quantity <= item.reorderLevel) return 'low';
  return 'ok';
}

const items = [
  { name: 'Kape', quantity: 0, reorderLevel: 5 },
  { name: 'Asukal', quantity: 5, reorderLevel: 5 },
  { name: 'Sabon', quantity: 12, reorderLevel: 5 },
];

for (const item of items) {
  console.log(item.name + ': ' + describeStock(item));
}`,
          expected: 'Kape: out\nAsukal: low\nSabon: ok',
          choices: [
            'Kape: out\nAsukal: ok\nSabon: ok',
            'Kape: out\nAsukal: low\nSabon: ok',
            'Kape: low\nAsukal: low\nSabon: ok',
            'Kape: out\nAsukal: low\nSabon: low',
          ],
          wrongNotes: {
            'Kape: out\nAsukal: ok\nSabon: ok': 'Asukal has quantity 5 and reorderLevel 5. The test is `<=`, so 5 counts as low.',
            'Kape: low\nAsukal: low\nSabon: ok': 'The `=== 0` check comes first, so Kape (0) is out and never reaches the low check.',
            'Kape: out\nAsukal: low\nSabon: low': 'Sabon has 12, which is above its reorder level of 5, so it is ok.',
          },
          hints: [
            'Go item by item and follow the `if` lines from the top.',
            'The first `if` that matches returns and stops the function, so order matters.',
            'Asukal sits exactly on its reorder level. Does `<=` include it?',
          ],
          explanation: 'Kape is 0 so the first check returns out. Asukal (5) is not 0 but 5 <= 5, so low. Sabon (12) passes neither check and is ok. Tracing a few cases by hand is the cheapest way to test a chat explanation.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-04-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Make the request better',
          prompt: 'Each card shows a weak request. Tap it to see what to add.',
          concept: 'Chat prompts',
          cards: [
            { front: "'Fix my code.' What is missing?", back: "Which code, what is wrong and what 'fixed' means. Select the function and say: 'applySale lets stock go negative. Throw an Error instead. Change nothing else.'" },
            { front: "'Make it better.' What is missing?", back: "A goal you can check. Better how: faster, shorter, safer? Name one, and say what must stay the same." },
            { front: "'Write tests.' What is missing?", back: "The cases and the rules. Ask: 'Write tests for applySale: normal sale, qty equal to stock, qty above stock, zero and a negative number.'" },
          ],
          hints: [],
          explanation: 'A good chat request names the code, the problem, the change and the limits. Vague requests give you something that looks helpful and fits nothing.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-04-q1',
        prompt: 'You want to understand a confusing function and must not change any file. Which mode fits?',
        choices: [
          'Ask, which answers questions and suggests code you apply yourself',
          'Agent, because it explores the repository and runs commands',
          'Plan, because it edits as it goes and then explains',
          'Any mode, since all of them leave files alone',
        ],
        answer: 0,
        explanation: 'Ask answers and suggests, and you decide what to apply. Agent edits files and runs commands, and Plan makes no changes until you approve a plan but exists to prepare one, not to explain a function.',
      },
      {
        id: 'ai-dev-copilot-04-q2',
        prompt: 'What does plan mode do before any code changes?',
        choices: [
          "It scans the project and deletes any files that appear to be unused",
          "It generates unit tests for every file in the whole repository at once",
          "It commits your current changes so that you can undo the plan later",
          "It researches the task and drafts a plan for you to approve",
        ],
        answer: 3,
        explanation: 'Plan mode uses read-only research and produces a summary, steps and open questions. It makes no code changes until you review and approve the plan.',
      },
      {
        id: 'ai-dev-copilot-04-q3',
        prompt: 'You select a function and open chat without attaching anything. Which code does Copilot reference by default?',
        choices: [
          'Every file in the repository',
          'The open file or the code you selected',
          'Only the files changed in the last commit',
          'Nothing, until you paste code in',
        ],
        answer: 1,
        explanation: 'The docs say Copilot references the open file or your selected code by default. Anything else you need, you attach.',
      },
      {
        id: 'ai-dev-copilot-04-q4',
        prompt: "Copilot's explanation says applySale 'rejects negative quantities'. You cannot see any such check in the code. What do you do?",
        choices: [
          "Trust the code, and treat the claim as unverified",
          "Believe the explanation, because the tool has read all of the code",
          "Ask the same question again until the answer finally changes",
        ],
        answer: 0,
        explanation: 'An explanation is a claim about the code, and the code is the evidence. If they disagree, the code wins. Asking again only gives another claim.',
      },
      {
        id: 'ai-dev-copilot-04-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a slash command in Copilot Chat?',
        choices: [
          "A key combination that closes the chat panel and ends the session",
          "A short word starting with / that stands for a common request",
          "A file in your project that stores your chat history between sessions",
          "A way to split your editor window into two side-by-side columns",
        ],
        answer: 1,
        explanation: 'Slash commands are shortcuts for requests you make often, like /explain, /fix and /tests.',
      },
      {
        id: 'ai-dev-copilot-04-q6',
        audience: { min: 'advanced' },
        prompt: 'You inherit a 200-file service and need to find where an order total is changed after checkout. Which approach uses chat well?',
        choices: [
          "Ask Copilot to explain the whole service and trust the summary it gives back",
          "Start agent mode and tell it to find and fix anything wrong with totals",
          "Paste the entire repository into one long chat and ask where totals change",
          "Get candidates from Ask or Plan, then verify each one in the code and search",
        ],
        answer: 3,
        explanation: 'Use chat to generate candidates, then verify with the code, search and types. Handing the whole investigation to an agent, or relying on a summary, removes the evidence you need.',
      },
    ],
    task: {
      title: 'Understand, then change, one function',
      minutes: 15,
      steps: [
        'Pick a function you did not write. Select it and ask in Ask mode: what it does, and every input it does not handle.',
        'Check each claim against the code and mark any you cannot confirm.',
        'Ask for the smallest change that fixes one gap, with the limits stated. Review the diff and run a test that proves it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["After Copilot's answer, ask: 'Explain that again as if I have never coded, and define every word.' Write the three terms you learned."] },
      { audience: { min: 'advanced' }, steps: ['Write the request as a spec with acceptance criteria and a list of files that must not change. After the edit, run `git diff --stat` and confirm only the intended files moved.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-05',
    day: 5,
    title: 'Giving Copilot the right context',
    summary: 'What Copilot sees by default, how to attach more, and how to keep the conversation focused so answers stay about your code.',
    minutes: 22,
    skills: ['copilot-chat'],
    intro: {
      objectives: [
        'List the sources of context Copilot uses and how each one gets in',
        'Attach the right files, issues or pull requests instead of describing them',
        'Recognise a stale or crowded conversation and reset it',
      ],
      why: "Most wrong Copilot answers are really 'it never saw that' answers. Choosing what it sees is a skill that improves every mode, from a suggestion to a cloud agent.",
    },
    body: [
      {
        type: 'paragraph',
        text: "Copilot does not remember your project. Each time you ask, it gathers some text, such as your question, the file you have open and anything you attach, and answers from that pile only. If a fact is not in the pile, Copilot guesses, and a guess sounds as sure as a fact. The pile has a size limit, called the **context window**, measured in tokens (small pieces of text). Everything counts toward it: instructions, your messages, Copilot's replies and the results of tool calls. So the skill is simple to say and takes practice: put the right facts in, and keep the wrong ones out. The Context Engineering course goes deep on the theory; this lesson is how Copilot does it.",
      },
      { type: 'heading', text: 'Where context comes from' },
      {
        type: 'table',
        headers: ['Source', 'How it gets in', 'Use it for'],
        rows: [
          ['The open file or selection', 'Automatic in chat; select code to narrow it', 'Questions and edits about one function or file'],
          ['Files you attach', 'In VS Code type # and pick; drag a file or use Reference File in JetBrains; the paperclip in Xcode; @ on GitHub', 'Code the answer must match: types, helpers, tests'],
          ['Issues, pull requests, repositories', 'Type @ on GitHub.com or in chat to attach them', 'Bug reports, reviews, a whole repository'],
          ['Your repository, indexed', 'Starting a chat with a repository context builds a search index in the background', 'Questions about how a codebase works'],
          ['Instructions', 'Custom instructions files, loaded automatically (next lesson)', 'Rules that apply to every request'],
          ['Tools and Spaces', 'MCP servers; Copilot Spaces of repositories, issues, notes and files', 'Information that lives outside the repository'],
        ],
      },
      {
        type: 'paragraph',
        text: "A word on names. Blog posts and older tutorials mention `@workspace` and `#codebase` as ways to point chat at your whole project. GitHub's current chat cheat sheet does not list them, and instead lists VS Code participants `@github`, `@terminal` and `@vscode` and variables such as `#file` and `#selection`. Features get renamed. The reliable habit is to type `@` or `#` in your own editor's chat box and read the list it offers today, rather than copying a name from a post.",
      },
      { type: 'heading', text: 'Attach, do not describe' },
      {
        type: 'paragraph',
        text: "Compare two requests about the same bug. The weak one describes: 'my sale function lets stock go negative, can you fix it'. The strong one attaches and constrains: it gives the two files, the rule and the limits. In VS Code you would type # and choose each file, so the prompt below carries the real code, not your memory of it.",
      },
      {
        type: 'prompt',
        label: 'Weak, from a newcomer',
        audience: { max: 'beginner' },
        text: 'My sale function lets stock go negative. Can you fix it?',
      },
      {
        type: 'prompt',
        label: 'Strong: files attached and limits stated',
        text: "Using the attached inventory.ts and inventory.test.ts: applySale lets stock go negative. Make it throw an Error when qty is more than item.quantity, following the error style in the attached file. Add one failing test first, show me only the diff, and do not change any other function.",
      },
      {
        type: 'paragraph',
        text: "The second request names the files, the rule, the style to copy, the order of work and the limit, so Copilot has little left to guess. Notice that it asks for a failing test first. That gives you evidence in a form you can run.",
      },
      { type: 'heading', text: 'Keep the pile clean' },
      {
        type: 'paragraph',
        text: "A long conversation is a full desk. Early wrong ideas stay in it, tool output piles up, and Copilot may stop weighing your newest message. Start a new chat for an unrelated task. In VS Code, a small circle near the chat input shows how full the context window is. In Copilot CLI, `/context` shows usage by part (instructions, tools, messages, free space) and `/compact` summarises the conversation to free space, and compaction loses fine detail and cannot be undone. For work that spans several sessions, keep the facts in files, so a fresh chat can read them.",
      },
      {
        type: 'version',
        text: "From the docs: the context window holds system instructions and tool definitions, your messages, Copilot's replies and tool results; its size depends on the model. VS Code shows a small circle indicator near the chat input; the CLI and GitHub Copilot app have `/context` and `/compact`, and compaction starts automatically at about 80% of capacity there. By default chat references the open file or your selection; VS Code uses `#` variables (the cheat sheet lists #file, #selection, #function, #class, #path, #project and others) and participants `@github`, `@terminal` and `@vscode`; the cheat sheet does not list `@workspace` or `#codebase`. On GitHub, `@` attaches discussions, files, issues, pull requests and repositories. Starting a chat with a repository context indexes it in the background for semantic search; initial indexing of a large repository can take up to a minute and indexed repositories are not used for model training. Spaces hold repositories, files, issues, pull requests, notes and images, can be shared, and work in chat on GitHub and in your IDE through the GitHub MCP server.",
        checked: CHECKED,
        sources: [DOCS.contextManagement, DOCS.cheatSheet, DOCS.chatInIde, DOCS.indexing, DOCS.spaces, DOCS.promptEngineering],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Picture a librarian who has never seen your school essay. Telling her 'it's about history' gets a shrug. Putting the three right books and the assignment on the desk gets a useful answer. Attaching a file is putting the book on the desk. The **context window** is the size of the desk: only so much fits, and a desk covered with old notes makes it hard to find the page you need. A **token** is a small piece of text, roughly a short word, which is how the desk's size is measured. That is why starting a new chat for a new job is not rude to Copilot. It simply clears the desk so the next question gets the room it needs.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat context as an input pipeline you can inspect and budget. Retrieval is a design space: a semantic index finds code by meaning but must stay fresh, exact search is precise but needs the right keyword, and agents exploring on their own can burn tokens on dead ends. Prefer a hybrid: a small always-on layer (instructions), targeted attachments you choose, and the index for discovery. Anything fetched is untrusted input: an issue, a web page or a tool result can carry text aimed at the agent, so keep write permissions narrow when an agent reads external content. Contradictions are a common cause of bad output, so keep one source of truth per fact, and make the repository retrievable with clear names and a short module map.",
      },
      {
        type: 'takeaways',
        items: [
          'Copilot answers from a pile of context; facts that are not in the pile get guessed.',
          'Attach the files, issues and pull requests the answer depends on instead of describing them.',
          'Names change: type @ or # in your own editor to see the participants and variables available today.',
          'Start a new chat for a new task, and keep durable facts in files rather than in a long conversation.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-05-scenario-1',
          kind: 'scenario',
          title: 'The function that does not exist',
          prompt: 'Choose the response that fixes the cause, not just the symptom.',
          concept: 'Context for Copilot',
          situation: "You ask Copilot Chat to add a low-stock check to the checkout screen. It writes code that calls getStockLevel(itemId), but there is no such function in SariStock. The real helper is called quantityOf and lives in src/inventory.ts, which is not open in your editor.",
          options: [
            {
              text: "Attach src/inventory.ts, tell Copilot the helper is quantityOf, and ask it to redo the change using only functions that exist in that file.",
              consequence: 'Copilot now sees the real helper, so it has nothing to invent. You fixed the missing context, which is the cause.',
              quality: 'best',
            },
            {
              text: 'Create a getStockLevel function so the generated code runs.',
              consequence: 'It runs, but you now have two helpers doing one job, and the code Copilot wrote may not match the real data rules.',
              quality: 'poor',
            },
            {
              text: "Ask the same question again and hope for a better guess.",
              consequence: 'You may get a different invented name. Without the file in context, the cause is still there.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Why did Copilot invent a name? What did it not have in front of it?',
            'The cheapest fix gives Copilot the file with the real function.',
            'Do not change your code to fit Copilot\'s guess; change what Copilot can see.',
          ],
          explanation: 'Copilot invented getStockLevel because the file that defines quantityOf was not in its context. Attaching the file fixes the cause. Creating the missing function or re-asking leaves the real problem in place.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-05-match-1',
          kind: 'match',
          title: 'Which context move?',
          prompt: 'Match each situation with the context move that fits it best.',
          concept: 'Managing context',
          labels: { terms: 'Situation', meanings: 'Context move' },
          pairs: [
            { term: 'You want answers based on bug report 42 in your repository', definition: 'Attach the issue with @ in chat on GitHub', note: '@ attaches issues, pull requests, files and repositories on GitHub.' },
            { term: 'Chat keeps repeating an old wrong idea after forty messages about other work', definition: 'Start a new chat so the old material is gone', note: 'A crowded conversation hurts answers.' },
            { term: 'Every answer should know that money is stored as whole centavos', definition: 'Put it in the repository custom instructions', note: 'Always-on rules belong in instructions.' },
            { term: 'Your team keeps a design note, three repositories and sample issues that questions should draw from', definition: 'A Copilot Space that holds them', note: 'Spaces keep a task\'s sources in one shareable place.' },
          ],
          hints: [
            'Is the fact one for this task only, or one that should apply to every request?',
            'Think about whether the problem is something missing from context or too much old context.',
            'A shared collection of sources for a task is what Spaces hold.',
          ],
          explanation: 'Attach what one question needs, put always-true rules in instructions, group a team\'s sources in a Space, and start fresh when the conversation itself has become the problem.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-05-q1',
        prompt: 'Copilot writes code that calls a function your project does not have. What is the most likely cause, and the best first fix?',
        choices: [
          "The model is broken, so restart the editor and ask again",
          "Your project is too large for Copilot to be able to read at all",
          "The file defining the real function was not in context; attach it",
          "Chat modes cannot call functions, so it writes its own versions instead",
        ],
        answer: 2,
        explanation: 'Copilot only answers from what it was given. A missing file leads to an invented name. Attaching the file puts the fact in context.',
      },
      {
        id: 'ai-dev-copilot-05-q2',
        prompt: 'You read in an old blog post that you should type `@workspace`, but your chat does not offer it. What is the sensible move?',
        choices: [
          "Type @ or # in your chat box and use what it lists; names change",
          "Reinstall the extension until the name finally appears in the list",
          "Assume Copilot is broken and stop using chat for the rest of the day",
          "Write the name in a code comment and Copilot will go and find it",
        ],
        answer: 0,
        explanation: "GitHub's current cheat sheet lists different participants and variables, and features get renamed. Your editor's list is the truth for your version.",
      },
      {
        id: 'ai-dev-copilot-05-q3',
        prompt: 'What counts toward the context window?',
        choices: [
          "Only your own messages, since the replies belong to Copilot",
          "Only the file you have open, because nothing else is ever sent",
          "Instructions, messages, replies and tool results",
        ],
        answer: 2,
        explanation: 'The docs list system instructions, tool definitions, your messages, replies and tool calls with their output. Long sessions can fill it.',
      },
      {
        id: 'ai-dev-copilot-05-q4',
        prompt: 'You finished a bug fix and now want help planning an unrelated feature. What should you do?',
        choices: [
          "Start a new chat so old material does not crowd the new task",
          "Keep the same chat so that Copilot remembers everything you said",
          "Ask Copilot to forget the conversation by typing a special command",
          "Close all of your open files and keep chatting in the same window",
        ],
        answer: 0,
        explanation: 'A fresh chat clears the context. Carrying unrelated history along costs room and can mislead the answer.',
      },
      {
        id: 'ai-dev-copilot-05-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a context window in simple terms?',
        choices: [
          "The pop-up that shows Copilot suggestions as you are typing code",
          "A setting that makes the editor window bigger on your screen",
          "A website where you manage your plan and your billing details",
          "The amount of text Copilot can look at once, like a desk",
        ],
        answer: 3,
        explanation: 'It is the limit on how much text the model can consider at once. When the desk is full or cluttered, answers get worse.',
      },
      {
        id: 'ai-dev-copilot-05-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent that reads issues from your public repository can be steered by text inside an issue. Which design response is best?',
        choices: [
          "Treat issue text as trusted because it came from your own repository, not a stranger",
          "Give the agent broad write access so that it can fix problems faster",
          "Ask the agent to ignore any instructions that appear inside issues",
          "Treat fetched text as untrusted and keep the agent's write access narrow",
        ],
        answer: 3,
        explanation: 'Anyone can open an issue on a public repository. Anything fetched is data, not instructions, so narrow permissions and review limit the damage if it is hostile.',
      },
    ],
    task: {
      title: 'Rewrite a vague request with attachments',
      minutes: 12,
      steps: [
        'Write a vague request you might send about your own project (like "fix the stock bug").',
        'Rewrite it so it names the files to attach, the rule, the style to copy, and the limit on what may change.',
        'Send the rewritten version with the files attached, and check whether Copilot used the real names. Note what it still guessed.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Ask Copilot: 'What would you need to see to do this well?' and attach whatever it asks for before you ask the real question."] },
      { audience: { min: 'advanced' }, steps: ['Check how full your context is mid-task (the circle in VS Code, or /context in the CLI). Write down which category is largest and one change that would make it smaller.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-06',
    day: 6,
    title: 'Custom instructions for your project',
    summary: 'Write repository and path-specific instructions and a reusable prompt file so Copilot follows your rules without being told every time.',
    minutes: 25,
    skills: ['copilot-instructions'],
    intro: {
      objectives: [
        'Write a short repository instructions file with commands, conventions and what done means',
        'Scope a rule to some files with a path-specific instructions file',
        'Choose between instructions, a prompt file and an agent file for a given need',
      ],
      why: 'Without instructions you repeat yourself in every chat, and every teammate gets different answers. A short, correct file teaches Copilot your rules once, for everyone and every mode that reads it.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Imagine leaving a note for a new colleague on their first day: how to run the tests, which folder holds what, and the three mistakes everyone makes. Copilot custom instructions are that note, written in plain Markdown. Because Copilot does not remember your project, the note is read each time, so you write it once and stop repeating yourself. The goal is not to describe the whole project. It is to hold the few facts that Copilot would otherwise get wrong.",
      },
      { type: 'heading', text: 'The kinds of instructions' },
      {
        type: 'table',
        headers: ['Kind', 'Where it lives', 'Applies to'],
        rows: [
          ['Repository-wide', '`.github/copilot-instructions.md`', 'Requests made in the context of the repository'],
          ['Path-specific', '`.github/instructions/NAME.instructions.md`, with an `applyTo` pattern at the top', 'Requests that involve files matching the pattern'],
          ['Agent files', '`AGENTS.md` anywhere in the repository (nearest one wins), or one `CLAUDE.md` or `GEMINI.md` at the root', 'AI agents, which also read these files in other tools'],
          ['Personal', 'Your own settings on GitHub', 'Your conversations only'],
          ['Organization', 'Set by organization owners', 'Members of a Business or Enterprise organization, on GitHub.com'],
          ['Prompt file', '`.prompt.md` files, typically in `.github/prompts/`', 'Only when you choose to run them'],
        ],
        caption: 'Instructions apply on their own; a prompt file is something you pick for one task.',
      },
      { type: 'heading', text: 'A repository file for SariStock' },
      {
        type: 'code',
        language: 'markdown',
        label: '.github/copilot-instructions.md',
        code: `# SariStock

A small TypeScript app that tracks the stock of a sari-sari store.

## Commands
- Install: \`npm install\`
- Test: \`npm test\` (run it before you say a task is finished)
- Lint: \`npm run lint\`

## Conventions
- Money is stored as whole centavos (integers), never decimal pesos.
- Functions in \`src/inventory.ts\` are pure: return new objects, never change the input.
- Throw an \`Error\` with a clear message for invalid input.

## Gotchas
- Item names are not unique; always use \`id\`.
- Do not add dependencies without asking.`,
      },
      {
        type: 'paragraph',
        text: "Each part earns its place. The commands let an agent check its own work. The conventions are choices a stranger could not guess. The gotchas are traps that already cost you time. Notice what is missing: no history of the project, no 'write clean code', no style the formatter already enforces. GitHub's own prompt for generating such a file asks for no more than two pages, which is a sensible ceiling. For a large or varied repository the docs advise against instructions that point to outside resources, dictate a style, or demand a fixed level of detail.",
      },
      { type: 'heading', text: 'Scope a rule to some files' },
      {
        type: 'code',
        language: 'markdown',
        label: '.github/instructions/api.instructions.md',
        code: `---
applyTo: "src/api/**/*.ts"
---

- Validate every request body with the helpers in \`src/api/validation.ts\`.
- Add a test in \`tests/api/\` for every new endpoint.`,
      },
      {
        type: 'paragraph',
        text: "The block between the dashes is front matter, and `applyTo` is a pattern for the files the rules cover. In `src/api/**/*.ts`, `**` means any number of folders, and `*.ts` means any file ending in .ts. An optional `excludeAgent` line, set to `\"code-review\"` or `\"cloud-agent\"`, stops that feature reading the file. When both a repository-wide file and a matching path file exist, Copilot uses both, so do not let them contradict each other. A **prompt file** is different: a saved task such as 'write tests for the selected function the SariStock way', run only when you choose.",
      },
      {
        type: 'version',
        text: "Repository-wide instructions go in `.github/copilot-instructions.md` at the repository root, as natural-language Markdown. Path-specific instructions go in `.github/instructions/NAME.instructions.md` (the file name must end in `.instructions.md`) and start with front matter holding `applyTo`, a glob pattern, with several patterns separated by commas; the optional `excludeAgent` accepts `\"code-review\"` or `\"cloud-agent\"`. `AGENTS.md` files can sit anywhere in the repository and the nearest one wins; a single `CLAUDE.md` or `GEMINI.md` in the root also works. On GitHub.com chat, personal instructions take precedence over repository instructions, which take precedence over organization instructions, and all relevant sets are still sent, so avoid conflicts. Copilot may not follow instructions the same way every time. Code review reads instruction files from the pull request's head branch. Support varies by client and feature: for example, path-specific instructions on GitHub.com work with the cloud agent and code review but not chat, and organization instructions work only on GitHub.com. Prompt files use the `.prompt.md` extension, are typically stored in `.github/prompts/`, and are available in VS Code, Visual Studio, JetBrains IDEs and Xcode.",
        checked: CHECKED,
        sources: [DOCS.repoInstructions, DOCS.instructionsSupport, DOCS.responseCustomization, DOCS.promptFiles],
        plans: 'Organization instructions need Copilot Business or Enterprise',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **Markdown** file is a plain text file where a `#` makes a heading and a `-` makes a list item, so people and tools can both read it easily. The file name starting with a dot, like `.github`, is a folder that tools use, and many systems hide it. Reading the example above line by line: the lines under Commands tell Copilot how to run and test your app, so it can check its own work; the lines under Conventions are your team's choices; Gotchas are traps to avoid. A **glob** like `src/api/**/*.ts` is a pattern that means 'every file ending in .ts anywhere inside src/api'. Short and specific beats long and vague.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat instruction files as shared configuration and review them like code: an owner, pull requests for changes and a periodic prune for stale paths and contradictions. Because code review reads them from the head branch, you can test a change to the instructions in the same pull request. Scope aggressively in a monorepo with path files, so a mobile task does not pay for backend rules, and use `excludeAgent` when a rule suits chat but would confuse the reviewer. Mind the support matrix: a rule that only lives in a path file is not applied by chat in every client, so critical rules also belong in a test or a lint rule, which cannot be ignored. And remember a cloned repository's instruction file is text from a third party that your agent reads as instructions.",
      },
      {
        type: 'takeaways',
        items: [
          'Repository instructions live in .github/copilot-instructions.md; path-specific ones in .github/instructions/NAME.instructions.md with applyTo.',
          'Hold only what Copilot would get wrong: commands, conventions, gotchas and what done means; keep it short.',
          'A prompt file is a saved task you run on purpose; instructions apply by themselves.',
          'Support varies by client and feature, so put critical rules in tests or lint as well, and never let two files contradict.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-06-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the path-specific file',
          prompt: 'This file should apply only to TypeScript files inside src/api, and must carry SariStock\'s money and testing rules. Fill each blank from the bank.',
          concept: 'Instructions files',
          language: 'markdown',
          code: `---
applyTo: "___"
---

- Validate every request body with the helpers in \`src/api/validation.ts\`.
- Store money as whole ___, never as decimal pesos.
- Add a test in \`tests/api/\` for every new ___.
- Run ___ before saying the task is finished.`,
          blanks: [
            { answers: ['src/api/**/*.ts'], feedback: 'The pattern must cover only .ts files at any depth inside src/api.' },
            { answers: ['centavos'], feedback: "Money is stored as whole centavos in this project, as the repository file says." },
            { answers: ['endpoint'], feedback: 'The rule is about the API: a test per new endpoint.' },
            { answers: ['npm test'], feedback: 'The project\'s test command is npm test.' },
          ],
          bank: ['src/api/**/*.ts', 'centavos', 'endpoint', 'npm test', '*.py', 'pesos', 'page', 'npm start'],
          hints: [
            'The first blank is a glob: which folder, which kind of file?',
            'Money and tests were set in the repository file you just read.',
            'One word is a unit of money, one is the thing the API exposes, one is a command from the Commands list.',
          ],
          explanation: 'applyTo scopes the file to src/api/**/*.ts. The rules reuse the repository facts: whole centavos, a test for each endpoint, and `npm test` as the check that proves the work.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-06-match-1',
          kind: 'match',
          title: 'Which file for which need?',
          prompt: 'Match each need with the file type that serves it best.',
          concept: 'Instruction types',
          labels: { terms: 'The need', meanings: 'The file' },
          pairs: [
            { term: 'A rule that should apply to every request about the repository', definition: '.github/copilot-instructions.md', note: 'Repository-wide instructions apply across the repository.' },
            { term: 'A rule that matters only for files under src/api', definition: 'A .instructions.md file with applyTo', note: 'Path-specific instructions are scoped by applyTo.' },
            { term: 'A saved "write tests the SariStock way" task you run when you want it', definition: 'A prompt file (.prompt.md)', note: 'Prompt files are chosen for one task, not applied automatically.' },
            { term: 'Rules that several AI tools in your team should all read', definition: 'An AGENTS.md file', note: 'Agent files are read by AI agents in more than one tool.' },
          ],
          hints: [
            'Ask: should it apply automatically, to some files only, or only when you choose it?',
            'A saved task you pick on purpose is not an instruction.',
            'The file named for agents is the one other AI tools read too.',
          ],
          explanation: 'Always-on rules go in the repository file, scoped rules in a path file, saved tasks in prompt files, and cross-tool rules in AGENTS.md.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-06-q1',
        prompt: 'Where does the repository-wide Copilot instructions file live?',
        choices: [
          'In a file called `.github/copilot-instructions.md`',
          'In `src/copilot.md`',
          'In your personal settings only',
          'In `package.json` under a copilot key',
        ],
        answer: 0,
        explanation: 'The docs name `.github/copilot-instructions.md` at the repository root. Path-specific rules go in `.github/instructions/` files that end in `.instructions.md`.',
      },
      {
        id: 'ai-dev-copilot-06-q2',
        prompt: 'What does `applyTo: "src/api/**/*.ts"` do in a path-specific instructions file?',
        choices: [
          "It tells Copilot to rewrite those files whenever they change",
          "It runs the matching files as tests every time you save",
          "It hides those files from Copilot so it never reads them",
          "It scopes the rules to TypeScript files under src/api",
        ],
        answer: 3,
        explanation: 'applyTo is a glob for which files the instructions cover. `**` matches any depth and `*.ts` matches TypeScript files.',
      },
      {
        id: 'ai-dev-copilot-06-q3',
        prompt: 'Your instructions file is 12 pages of project history and style opinions, and Copilot follows it unevenly. What is the best fix?',
        choices: [
          "Cut it to commands, conventions and gotchas, and remove contradictions",
          "Make it much longer so that nothing about the project is ever left out",
          "Add a rule at the top that says Copilot must always obey every line below",
        ],
        answer: 0,
        explanation: 'Short, specific and consistent beats long. Copilot may not follow instructions every time, and contradictions or filler make that worse.',
      },
      {
        id: 'ai-dev-copilot-06-q4',
        prompt: 'You change `.github/copilot-instructions.md` in a pull request and want Copilot code review to use the new version on that same pull request. Does it?',
        choices: [
          "No, because review reads only the base branch of the repository",
          "Only after you merge the pull request into the main branch",
          "Yes, it reads instruction files from the head branch",
          "Only if you also edit the organization settings on GitHub.com",
        ],
        answer: 2,
        explanation: 'The docs say review reads instruction and skill files from the head branch, so you can test an instructions change inside the same pull request.',
      },
      {
        id: 'ai-dev-copilot-06-q5',
        audience: { max: 'beginner' },
        prompt: 'What is the plain-language job of a Commands section in an instructions file?',
        choices: [
          "To list the keyboard shortcuts that you use in your editor every single day",
          "To store the GitHub password that Copilot uses to sign in for you",
          "To say how to run and test the project so Copilot can check itself",
          "To name the people who are allowed to edit the instructions file",
        ],
        answer: 2,
        explanation: 'Knowing how to run the tests lets Copilot (especially an agent) check its own work, instead of guessing.',
      },
      {
        id: 'ai-dev-copilot-06-q6',
        audience: { min: 'advanced' },
        prompt: 'A critical rule ("never log customer phone numbers") lives only in a path-specific instructions file. Why is that not enough?',
        choices: [
          "Instructions are ignored in every Copilot client, which makes them useless for rules",
          "Path files cannot contain rules about logging, personal data or anything similar",
          "Path files only take effect on weekdays when the organization is online",
          "Instructions may not apply or be obeyed, so enforce it with lint or a test",
        ],
        answer: 3,
        explanation: 'Instructions guide behaviour but are not guaranteed to apply everywhere or be obeyed every time. A lint rule or test enforces the rule whoever or whatever writes the code.',
      },
    ],
    task: {
      title: 'Write your first instructions file',
      minutes: 15,
      steps: [
        'In a repository you own, create .github/copilot-instructions.md with three sections: Commands, Conventions and Gotchas. Keep it under one page.',
        'Ask Copilot Chat (with the file in place) a question the file should change, such as how to run the tests. Check that the answer lists the file under its references.',
        'Delete any line you cannot justify with a mistake it would prevent.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Ask Copilot to draft the file from your project, then read every line and delete anything you cannot explain in your own words."] },
      { audience: { min: 'advanced' }, steps: ['Add one path-specific file with applyTo for your riskiest folder. Verify when it loads, and check whether the same rule is also enforced by a test or a lint rule.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-07',
    day: 7,
    title: 'Agent mode: letting Copilot do multi-step work',
    summary: 'Hand Copilot a goal in your editor, watch it edit files and run commands, and keep control with plans, approvals and a clean branch.',
    minutes: 25,
    skills: ['copilot-agents', 'copilot-safety'],
    intro: {
      objectives: [
        'Describe what agent mode does that chat does not, and where you stay in control',
        'Write an agent prompt with a goal, limits and a check, and start with a plan when the task is big',
        'Approve or reject proposed commands and review the result as one diff',
      ],
      why: 'Agent mode can change many files and run commands in one go. Used with a plan, a clean branch and a test to run, it does hours of mechanical work. Used loosely, it makes changes you cannot undo or explain.',
    },
    body: [
      {
        type: 'paragraph',
        text: "In chat, Copilot answers and you apply. In **agent mode** you describe a goal and Copilot works toward it: it decides which files to change, makes edits across the project, proposes terminal commands, reads the results and tries again until the task is done or it needs you. The docs describe it as taking a high-level task and iterating. It is available in VS Code, Visual Studio, JetBrains IDEs, Xcode and Eclipse, and Copilot Free includes it with limits. The price of the power is that mistakes can now spread across many files, which is why this lesson is mostly about control.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The agent loop in your editor, with you at each gate',
        source: `flowchart TD
  A(You state a goal and a check) --> B[Optional: plan mode drafts steps]
  B --> C[Copilot finds files and edits them]
  C --> D{Needs a terminal command?}
  D -->|Yes| E[You approve or reject the command]
  E --> F[Copilot reads the output]
  D -->|No| G[Edits appear in the editor]
  F --> G
  G --> H{Tests pass?}
  H -->|No| C
  H -->|Yes| I(You review the whole diff)`,
      },
      { type: 'heading', text: 'Plan first when the task is big' },
      {
        type: 'paragraph',
        text: "For a large or unclear task the docs recommend plan mode first. Plan mode researches with read-only tools and drafts a summary, steps and open questions, and it makes no code changes until you approve. You can answer its questions or change the scope, then choose Start Implementation, which switches chat to agent mode and carries out the plan, or Open in Editor to keep the plan as a Markdown file. A plan you can read costs a minute and is the cheapest review in this whole workflow, because mistakes are still sentences.",
      },
      { type: 'heading', text: 'An agent prompt: goal, limits, check' },
      {
        type: 'prompt',
        label: 'Agent mode, on a fresh git branch',
        text: "Goal: when an item's quantity drops to or below its reorderLevel after a sale, add it to a lowStockAlerts list that the dashboard shows.\nLimits: change only src/inventory.ts, src/dashboard.ts and their tests. Do not add dependencies. Keep applySale a pure function.\nCheck: write a failing test for the boundary (quantity equal to reorderLevel) first, then make it pass. Run `npm test` and `npm run lint` and show me the output.\nStop and ask before deleting any file or running anything that is not a test, lint or build command.",
      },
      {
        type: 'paragraph',
        text: "That prompt does four things. The goal says what should be true when the work is done. The limits name files and forbid new dependencies, so the diff stays small enough to read. The check gives Copilot a command to prove its work, so it can loop on failures without you. And the last line sets the approval boundary. Here is what a run of it might look like. This is an invented example of the shape, not a recording.",
      },
      {
        type: 'code',
        language: 'text',
        label: 'An example run (real runs differ)',
        code: `Copilot: I'll read src/inventory.ts and src/dashboard.ts first.
Copilot: Adding a failing test in tests/inventory.test.ts for quantity === reorderLevel.
Copilot: Proposed command: npm test        [You: Allow]
Output: 1 failing (low stock at the boundary)
Copilot: Updating applySale to return the updated item, adding lowStockAlerts in dashboard.ts.
Copilot: Proposed command: npm test        [You: Allow]
Output: 7 passing
Copilot: Proposed command: npm run lint    [You: Allow]
Output: no problems`,
      },
      { type: 'heading', text: 'Stay in control' },
      {
        type: 'list',
        items: [
          '**Start on a clean branch** (`git switch -c low-stock-alert`), so the whole run is one diff you can read, and discard with one command if it goes wrong.',
          '**Read each command before you approve it.** By default Copilot asks first; settings or administrators may let some run automatically, and you should widen that only for commands you would run yourself anyway.',
          '**Review edits as they stream in** and undo what you do not want. Redirect with a follow-up prompt instead of starting over.',
          '**Run the check yourself at the end.** An agent saying tests pass is a claim; the output on your screen is the evidence.',
        ],
      },
      {
        type: 'version',
        text: "From the docs: agent mode takes a high-level task, decides which files to change, edits across the project, proposes and runs terminal commands and iterates; it also calls tools from MCP servers. By default you approve terminal commands before they run, you can reject each one, and you can redirect with a follow-up prompt; some commands may run automatically through editor settings or administrator policy. Edits stream into the editor and, in VS Code, can be undone. Each prompt consumes GitHub AI Credits, and an administrator may have disabled agent mode for your IDE. For large or ambiguous tasks the docs recommend plan mode, which is not available in Visual Studio; Start Implementation switches Copilot Chat to agent mode. Copilot CLI is a terminal agent: it asks before using tools that are not already allowed, `--deny-tool` takes precedence over `--allow-tool`, and `--allow-all-tools` removes the prompts and gives it the same access you have.",
        checked: CHECKED,
        sources: [DOCS.agentMode, DOCS.planMode, DOCS.mcp, DOCS.cli],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **terminal command** is a line of text you type to tell the computer to do something, like running your project's tests. The agent proposes a command and waits for your yes or no, which is why reading it matters. A **branch** is a separate copy of your project's history where you can try changes without touching the main version, so if the agent makes a mess you can throw the branch away. A **diff** shows every line added and removed. In the example run above, `npm test` runs the project's tests, 'failing' means a test found a problem, and 'passing' means the tests found none. If you do not understand a command, reject it and ask Copilot to explain it first.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "If you have built a few apps, practise the 'read the plan' habit: ask for plan mode on your next feature, and compare the plan to what you would have done. Where they differ, one of you has learned something.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Think in autonomy tiers with a gate for each. Suggestions and chat are advice; agent mode in the editor is supervised execution with command approval; the cloud agent is delegated execution gated by the pull request. Every tier up needs a stronger external check: the tests and linters the agent can run itself, and the review it cannot. Be deliberate about auto-approval: allow narrow, read-only or idempotent commands, deny destructive ones (the CLI's deny rules beat allow rules), and prefer sandboxes for broader autonomy, since the docs say directory trust is a heuristic and auto-approval gives the agent your own access. Connected MCP tools extend the surface: allow only what the task needs. Keep sessions short and scoped, because long ones fill the context and degrade.",
      },
      {
        type: 'takeaways',
        items: [
          'Agent mode edits files and runs commands in a loop; it asks before commands by default and you can reject any step.',
          'Use plan mode first for big or unclear tasks, and read the plan before you start implementation.',
          'Write the prompt as goal, limits and a check, on a clean branch, and review the whole diff at the end.',
          'Widen auto-approval only for commands you would run yourself, and deny destructive ones.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-07-scenario-1',
          kind: 'scenario',
          title: 'Which mode for this task?',
          prompt: 'Choose how to start the work.',
          concept: 'Choosing a Copilot mode',
          situation: "Your client wants SariStock to warn when stock is low. It touches how sales are recorded, the dashboard, the receipts and the tests, and the requirements are only half written. You have an afternoon and a clean git branch.",
          options: [
            {
              text: "Use plan mode to get a plan with open questions, answer them, read the plan, then start implementation with the tests as the check.",
              consequence: 'The unclear parts are settled while mistakes are still sentences, and the agent then has a goal, limits and a check. You review one diff at the end.',
              quality: 'best',
            },
            {
              text: "Type 'add low stock warnings' in agent mode and approve everything so it is not interrupted.",
              consequence: 'It will produce something, but the requirements were half written, so it fills the gaps by guessing, and blanket approval removes your chance to stop a bad command.',
              quality: 'poor',
            },
            {
              text: "Ask a chat question about each file and make every edit by hand.",
              consequence: 'Safe, and you learn the code, but it is slow for a change this size and spends your afternoon on mechanical edits.',
              quality: 'acceptable',
            },
            {
              text: 'Assign it straight to the cloud agent without writing a full issue.',
              consequence: 'The agent reads the issue at assignment time only and works without you. A vague issue gives a vague pull request that you still must review.',
              quality: 'poor',
            },
          ],
          hints: [
            'What is missing from the task before any code is written?',
            'Plan mode makes no changes, so unclear requirements are cheap to fix there.',
            'The best start is the one that settles the unclear parts first and keeps you in the loop.',
          ],
          explanation: 'A big task with unclear requirements needs a plan first. Plan mode researches without changing code, you answer its questions, and then agent mode implements with a check to run. Vague prompts plus blanket approval remove the controls that make agents safe.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-07-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Approve or reject?',
          prompt: 'Copilot proposes each command during an agent run. Tap to see the verdict.',
          concept: 'Approving commands',
          cards: [
            { front: 'npm test', back: 'Approve. It is the check you asked for and does not change your files.' },
            { front: 'git push --force origin main', back: 'Reject. It rewrites shared history, and you never asked it to publish anything. Pushing is yours to decide.' },
            { front: 'rm -rf node_modules && npm install', back: 'Ask first what it is fixing. Deleting installed packages is recoverable, but a command like this should be explained, not approved on autopilot.' },
          ],
          hints: [],
          explanation: 'Approve commands that serve the check you asked for, reject ones that go beyond the task or cannot be undone, and ask for an explanation when you are unsure.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-07-q1',
        prompt: 'By default, what happens when agent mode wants to run a terminal command?',
        choices: [
          "It runs silently in the background so the task is never interrupted by you",
          "It runs only inside a sandbox that has no network access at all",
          "It runs only after your plan has been upgraded to Copilot Business",
          "You approve it first; settings or administrators may allow some to run",
        ],
        answer: 3,
        explanation: 'The docs say you approve terminal commands before they run by default, and that your administrator or editor settings may allow some to run automatically.',
      },
      {
        id: 'ai-dev-copilot-07-q2',
        prompt: 'A task touches payments, stock and receipts, and the requirements are unclear. What is the best first step?',
        choices: [
          "Use plan mode to agree on the steps, then start implementation",
          "Start agent mode right away and let it ask questions as it goes",
          "Split the work into three chats that share no common plan",
          "Hand it to the cloud agent and review the pull request later",
        ],
        answer: 0,
        explanation: 'The docs recommend plan mode first for large or ambiguous tasks. It changes no code until you approve the plan.',
      },
      {
        id: 'ai-dev-copilot-07-q3',
        prompt: 'Why start an agent run on a new git branch?',
        choices: [
          "The change is one diff to review, and easy to discard",
          "Agent mode refuses to run on the main branch of any project",
          "It makes Copilot answer faster because there is less history",
        ],
        answer: 0,
        explanation: 'A branch isolates the run. You review one diff, and a failed attempt costs you a single command to throw away.',
      },
      {
        id: 'ai-dev-copilot-07-q4',
        prompt: 'During a run Copilot proposes `git push --force origin main`. You never asked it to publish anything. What do you do?',
        choices: [
          "Allow it, because the agent knows what the task needs better than you",
          "Allow it once just to see what happens, then review later",
          "Allow it only on weekdays and only for non-sensitive repositories",
          "Reject it; pushing, especially forced, is not part of the task",
        ],
        answer: 3,
        explanation: 'Every proposed command is a request you can refuse. A forced push rewrites shared history and is far outside the goal you set.',
      },
      {
        id: 'ai-dev-copilot-07-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a terminal command?',
        choices: [
          "A line of text you type to tell the computer to do something",
          "A button in the Copilot toolbar that you press to start a new chat",
          "A message that Copilot sends to GitHub when it finishes",
          "A file that stores your editor settings and shortcuts",
        ],
        answer: 0,
        explanation: 'Commands like `npm test` run programs on your computer. That is why an agent asking to run one needs your attention.',
      },
      {
        id: 'ai-dev-copilot-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team wants agents to run faster without constant approval prompts. Which policy is most defensible?',
        choices: [
          "Turn on allow-all for everyone, because review happens at the pull request anyway",
          "Forbid agent mode entirely, since no approval policy can ever be safe enough",
          "Allow narrow, repeatable commands, deny destructive ones, sandbox the rest",
          "Let each developer decide for themselves with no shared guidance at all",
        ],
        answer: 2,
        explanation: 'Allow-all gives the agent the same access you have. A narrow allow list for safe commands, explicit denials and a sandbox for the rest give speed with a bounded blast radius.',
      },
    ],
    task: {
      title: 'Run one planned agent task',
      minutes: 20,
      steps: [
        'Create a branch in a small project. In plan mode, describe a feature and answer any questions Copilot asks. Read the plan and cut anything you did not ask for.',
        'Start implementation with a prompt that has a goal, limits and a check. Read each command before you allow it.',
        'When it finishes, run the tests yourself and read the full diff. Write down one thing the agent did that you would not have, good or bad.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Before allowing any command, ask Copilot: 'Explain what this command does and whether it changes my files.' Only allow it when you understand the answer."] },
      { audience: { min: 'advanced' }, steps: ['Write the allow and deny list you would give this agent as if for a teammate. Test one denied command to confirm it is actually blocked.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-08',
    day: 8,
    title: 'Copilot with pull requests and code review',
    summary: 'Hand a task to the cloud agent, receive a pull request, and use Copilot code review as a first pass before a person approves.',
    minutes: 25,
    skills: ['copilot-agents', 'copilot-review'],
    intro: {
      objectives: [
        'Describe how the cloud agent turns an issue into a pull request, and what protects the repository',
        'Request a Copilot code review and say what it can and cannot tell you',
        'Order the steps from a written issue to a human-approved merge',
      ],
      why: 'The pull request is where AI-written code meets your team. Knowing who can approve, what runs automatically and what Copilot review does not prove keeps the gate real instead of a rubber stamp.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Until now Copilot worked next to you. The **cloud agent** works away from you: you hand it a task on GitHub, it researches the repository, makes changes in a cloud environment, runs tests and linters, and opens a **pull request** for you to review. A pull request (PR) is a proposal to merge one branch into another, with a page for discussion, review and automatic checks. The docs say the agent can work on one branch at a time and open one pull request per task, which makes each task a unit you can review, reject or merge.",
      },
      { type: 'heading', text: 'From issue to pull request' },
      {
        type: 'paragraph',
        text: "You can start a task by assigning an issue to Copilot, or from the Agents tab or github.com/copilot with a prompt. An assigned issue always creates a pull request, and Copilot asks for your review when it finishes. The agent reads the issue title, description and existing comments at the moment you assign it, so a late comment is invisible to it: finish the issue first, and post later information on the pull request. A good issue states the outcome, the files likely involved, the tests required and the limits.",
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'An issue written for the cloud agent (an example)',
        code: `# Add a low-stock alert to the dashboard

When a sale leaves an item at or below its reorderLevel, show it in a "Reorder soon" list on the dashboard.

- Change only src/inventory.ts, src/dashboard.ts and their tests.
- A sale that leaves quantity equal to reorderLevel must count as low.
- Add a test for that boundary. \`npm test\` and \`npm run lint\` must pass.
- No new dependencies.`,
      },
      { type: 'heading', text: 'What keeps the repository safe' },
      {
        type: 'paragraph',
        text: "Giving an agent write access to your code sounds risky, so GitHub's docs list the controls. Only people with write access can trigger the agent. It pushes to a single branch: a new `copilot/` branch, or the branch of a pull request it was mentioned on, and branch protections and required checks still apply. It cannot mark a pull request ready for review, approve it or merge it, so a person must. Workflows do not run on its pull request until someone with write access clicks Approve and run workflows. The person who asked for the pull request cannot approve it. Internet access is limited by a firewall, and hidden characters are filtered from what you send it, because text in an issue can try to steer an agent.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The cloud agent flow and its human gates',
        source: `sequenceDiagram
  participant You
  participant Agent as Copilot cloud agent
  participant Repo as GitHub repository
  participant Rev as Another reviewer
  You->>Repo: Write issue, assign to Copilot
  Agent->>Repo: Push to a copilot/ branch, open draft pull request
  You->>Repo: Approve and run workflows
  Repo-->>You: Checks and Copilot review comments
  You->>Agent: Ask for changes on the pull request
  Rev->>Repo: Approve and merge`,
      },
      { type: 'heading', text: 'Copilot code review: a first pass, not a gate' },
      {
        type: 'paragraph',
        text: "Copilot can also review any pull request, yours or a person's. By default it reviews only when you assign it, under Reviewers, where you can choose a review effort level of Lite, Balanced or Max. It leaves review comments, suggested fixes you can apply with a click, and an overview comment. It reads your instruction files from the pull request's head branch, and it skips some files such as dependency files, logs and SVGs. Two limits matter most. GitHub says it is not guaranteed to spot all problems and that you should always validate its feedback. And by default its reviews do not count toward required approvals, so a human approval is still needed. 'No comments' from Copilot means it found nothing it chose to say, not that the change is safe.",
      },
      {
        type: 'version',
        text: "The docs describe the cloud agent as researching a repository, planning and implementing changes in the background, and running tests and linters in a cloud development environment. It can work on one branch at a time and open one pull request per task; rulesets or branch protection can prevent it creating or updating pull requests. Only users with write access can trigger it; it pushes to one branch (a new `copilot/` branch unless mentioned on an existing pull request); it cannot mark a pull request ready, approve or merge it; workflows need someone with write access to click Approve and run workflows; the requester cannot approve the pull request; GitHub-Actions-based sessions have a 59-minute limit. GitHub's docs say Copilot in the cloud, a newer experience, became available to paid plans from October 28, 2026 while Copilot Free keeps the older Copilot Chat experience, so screens and names may differ from what you see. Copilot code review lets you choose Lite, Balanced or Max effort, may skip file types such as dependency files, logs and SVGs, does not count toward required approvals by default, and GitHub states it is not guaranteed to find every problem. Copilot Free does not include full code review.",
        checked: CHECKED,
        sources: [DOCS.cloudAgent, DOCS.kickOff, DOCS.risks, DOCS.codeReview],
        plans: 'The cloud agent and full code review are not on Copilot Free; Student, Pro, Pro+, Max, Business and Enterprise include them, subject to organization policies',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: think of the main project as a printed book that many people rely on. A **branch** is a photocopy you can scribble on safely. A **pull request** says 'please look at my scribbles and, if they are good, copy them into the book'. A **review** is someone reading the scribbles first. **Checks** (also called CI, short for continuous integration) are tests that run automatically on the scribbles. The cloud agent does the scribbling for you on its own photocopy, but it is not allowed to put its changes into the book. A person has to read them and decide. That one rule is what makes it safe to let it work while you are away.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Design the gate, not just the tool. Required reviews and rulesets are your enforcement: decide whether Copilot approvals may count (a setting, off by default) and keep at least one human approval for anything that ships. Remember agents can open pull requests under their own app identity, and the docs say one extra approval is then required if the repository already requires one. Use session logs and audit events for traceability, since commits are authored by Copilot with the requester as co-author and link to their session. Keep firewall allowlists tight, grant MCP tools only what a task needs, and note that delegated runs use configured MCP tools without asking. Treat AI review as a cheap first pass that raises the floor, and never as a substitute for review by someone who understands the change.",
      },
      {
        type: 'takeaways',
        items: [
          'The cloud agent turns a well-written issue into one pull request on a copilot/ branch; it cannot approve or merge.',
          'Workflows wait for someone with write access to approve them, and the requester cannot approve the pull request.',
          'Copilot code review is a first pass: it is not guaranteed to find everything and does not count toward required approvals by default.',
          'Write the issue before you assign it; the agent reads it once, at assignment.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-08-arrange-1',
          kind: 'arrange',
          title: 'From issue to a merged pull request',
          prompt: 'Put the steps of a cloud agent task in the order they happen, with the human gates in the right places.',
          concept: 'Cloud agent flow',
          language: 'text',
          solution: [
            'Write a complete issue: outcome, files, tests, limits',
            'Assign the issue to Copilot',
            'Copilot works on a copilot/ branch and opens a draft pull request',
            'Someone with write access clicks Approve and run workflows',
            'Add Copilot as a reviewer, then read the diff yourself',
            'Ask for changes on the pull request and re-run the checks',
            'A different person approves and merges',
          ],
          alternatives: [
            [
              'Write a complete issue: outcome, files, tests, limits',
              'Assign the issue to Copilot',
              'Copilot works on a copilot/ branch and opens a draft pull request',
              'Add Copilot as a reviewer, then read the diff yourself',
              'Someone with write access clicks Approve and run workflows',
              'Ask for changes on the pull request and re-run the checks',
              'A different person approves and merges',
            ],
          ],
          reasons: [
            'The agent reads the issue once, when it is assigned, so it must be complete first.',
            'Assigning the issue is what starts the task and always results in a pull request.',
            'The agent pushes to one new branch and opens a draft; it cannot mark it ready.',
            'Workflows do not run until someone with write access approves them.',
            'Copilot review is a first pass; you still read the diff yourself.',
            'Changes are requested on the pull request, then the checks run again.',
            'The person who asked cannot approve, so another person approves and merges.',
          ],
          hints: [
            'Which step must be finished before the agent starts, because it reads it only once?',
            'The agent can never approve or merge. Where does a person step in, and who may not approve?',
            'The final step is a human who did not ask for the pull request.',
          ],
          explanation: 'Write the issue completely, assign it, let the agent open a draft pull request on its own branch, approve the workflows, review with Copilot and your own eyes, ask for changes, and finish with an approval by someone other than the requester.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-08-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'What does this review result prove?',
          prompt: 'Tap each card to see what you can and cannot conclude.',
          concept: 'AI code review',
          cards: [
            { front: 'Copilot reviewed the pull request and left no comments. Safe to merge?', back: 'Not on that alone. GitHub says Copilot is not guaranteed to find all problems. Read the diff and rely on the tests and a human approval.' },
            { front: 'Copilot suggested a fix and you can apply it with one click. Apply it blindly?', back: 'No. A suggestion is a proposal like any other. Read it, run the checks again and make sure it does what the reviewer meant.' },
            { front: 'Your repository requires one approval. Does Copilot review satisfy it?', back: "By default no: its reviews do not count toward required approvals. A person still has to approve." },
          ],
          hints: [],
          explanation: 'AI review raises the floor by catching some issues cheaply. It does not replace human judgement or your tests, and by default it does not satisfy approval rules.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-08-q1',
        prompt: 'The cloud agent opened a draft pull request from your issue. Who can approve it?',
        choices: [
          "You, since you asked for it and you know the task better than anyone",
          "Copilot itself, once all the tests that it ran have passed on its branch",
          "Someone other than the person who asked for it",
          "Nobody can, until the draft pull request has been deleted and recreated",
        ],
        answer: 2,
        explanation: 'The risks page says the person who asked for the pull request cannot approve it, and the agent cannot approve or merge its own work.',
      },
      {
        id: 'ai-dev-copilot-08-q2',
        prompt: 'Copilot opened its pull request but none of your automated checks have started. According to the docs, what is the likely reason?',
        choices: [
          "The agent turned the automated checks off so it could finish faster",
          "Workflows wait for someone with write access to approve them",
          "Automated checks only run after the agent marks the pull request ready",
          "Checks are paused until the repository owner upgrades their plan",
        ],
        answer: 1,
        explanation: 'Workflows wait for a person with write access to approve them, so an agent cannot trigger arbitrary automation on its own.',
      },
      {
        id: 'ai-dev-copilot-08-q3',
        prompt: 'Copilot code review finishes with no comments on your pull request. What does that tell you?',
        choices: [
          "Very little: Copilot is not guaranteed to find all problems",
          "The change is correct and safe, so merging it now is fine",
          "The tests must have passed or Copilot would have complained",
          "A human review is no longer needed because AI has already looked",
        ],
        answer: 0,
        explanation: 'Absence of comments is not proof. GitHub tells you to validate Copilot feedback and says it can miss problems.',
      },
      {
        id: 'ai-dev-copilot-08-q4',
        prompt: 'Which describes how the cloud agent uses branches?',
        choices: [
          "It pushes directly to the main branch so reviewers see the change sooner",
          "It creates a new branch for every single file that it edits in a task",
          "One branch and one pull request per task, on a new copilot/ branch",
        ],
        answer: 2,
        explanation: 'One branch and one pull request per task keeps each task reviewable. Branch protections and required checks still apply to that branch.',
      },
      {
        id: 'ai-dev-copilot-08-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a pull request?',
        choices: [
          "A way to download a project from GitHub to your computer",
          "A proposal to merge changes, with a page for review",
          "A button that undoes the last change you made in the editor",
          "A message from Copilot that asks you to upgrade your plan",
        ],
        answer: 1,
        explanation: 'A pull request packages a set of changes for review and automatic checks before they are added to the main branch.',
      },
      {
        id: 'ai-dev-copilot-08-q6',
        audience: { min: 'advanced' },
        prompt: 'Your branch protection requires one approval. How should Copilot code review fit that rule?',
        choices: [
          "A first pass that comments; by default it does not count as the approval",
          "The required approval itself, since it is faster and never gets tired or distracted",
          "A replacement for your automated checks, because it reads the whole diff",
          "It should not be used on pull requests at all, since it can be wrong",
        ],
        answer: 0,
        explanation: 'AI review cheaply raises the floor. The docs say its reviews do not count toward required approvals by default, and enabling that is a deliberate policy choice, not a default to lean on.',
      },
    ],
    task: {
      title: 'Write an issue and review its result',
      minutes: 20,
      steps: [
        'Write an issue for a small, safe change in a practice repository: outcome, files, tests required and limits. Re-read it as if you knew nothing about the project.',
        'If your plan includes the cloud agent, assign the issue to Copilot. If not, write the pull request by hand instead.',
        'On the pull request, add Copilot as a reviewer if available, then read the diff yourself and write one comment of your own that Copilot did not make.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Open any pull request on GitHub (a public one is fine) and find the Files changed tab. Write what the green and red lines mean in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Check your repository rules: which approvals are required, can Copilot reviews count, and who can click Approve and run workflows? Write down one gap and the setting that closes it.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-09',
    day: 9,
    title: 'Tests, debugging and refactoring with Copilot',
    summary: 'Use Copilot to write tests that can fail, debug from evidence, and refactor in small steps that tests keep honest.',
    minutes: 25,
    skills: ['copilot-quality', 'copilot-chat'],
    intro: {
      objectives: [
        'Ask Copilot for tests with cases and boundaries, and check that they can actually fail',
        'Debug by giving Copilot the failing output and asking for causes before fixes',
        'Refactor in small steps with passing tests and a diff you can read',
      ],
      why: 'Tests are how you know what Copilot wrote works, and Copilot is happy to write tests that prove nothing. Learning to demand tests that can fail is what turns a fast assistant into a safe one.',
    },
    body: [
      {
        type: 'paragraph',
        text: "A test is a small program that checks that another program does what it should. Copilot writes them quickly, which creates a trap: a test that always passes looks like success. So the rule for this lesson is that every test Copilot writes must be able to fail, and you must have seen it fail for the right reason. Tests, debugging and refactoring are one skill, because all three ask the same question: what is the evidence that this behaves correctly?",
      },
      { type: 'heading', text: 'Tests that can fail' },
      {
        type: 'paragraph',
        text: "Ask for cases, not just 'write tests'. Name the normal case, the boundaries and the invalid inputs, because boundaries are where code written from a vague idea is wrong. Selecting a function and using `/tests` asks Copilot for unit tests for it, but the better habit is to say what rules to cover, ask for the tests first, run them and watch them fail, then make the code pass. Here are boundary tests for SariStock's `lowStockItems`, in the style of Node's built-in test runner. They are written to be read, and they run.",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'tests/inventory.test.js (run with: node --test)',
        code: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowStockItems } from '../src/inventory.js';

test('an item exactly at its reorder level counts as low', () => {
  const items = [{ id: '1', name: 'Itlog', quantity: 3, reorderLevel: 3 }];
  assert.deepEqual(lowStockItems(items), items);
});

test('an item above its reorder level is not low', () => {
  const items = [{ id: '2', name: 'Bigas', quantity: 4, reorderLevel: 3 }];
  assert.deepEqual(lowStockItems(items), []);
});

test('the lowest quantity comes first and the input is not changed', () => {
  const items = [
    { id: '3', name: 'Kape', quantity: 2, reorderLevel: 5 },
    { id: '4', name: 'Asukal', quantity: 1, reorderLevel: 5 },
  ];
  const copy = [...items];
  assert.deepEqual(lowStockItems(items).map((item) => item.name), ['Asukal', 'Kape']);
  assert.deepEqual(items, copy);
});`,
      },
      {
        type: 'paragraph',
        text: "Each test names one rule in plain words, so a failure explains itself. To check that a test can fail, break the code on purpose: change `<=` to `<` in `lowStockItems` and run the tests. The first test should now fail. If it still passes, it tests nothing. Copilot's tests sometimes assert something that is always true, or mock away the very function under test, so this one-minute check is worth doing every time.",
      },
      { type: 'heading', text: 'Debug from evidence' },
      {
        type: 'paragraph',
        text: "When a test fails, give Copilot the evidence: the exact failing output and the function, attached or selected. Then ask for causes before fixes. Asking 'fix it' invites a guess that makes the symptom disappear, perhaps by changing the test. In VS Code `/fixTestFailure` asks Copilot to find and fix a failing test, which is useful once you have told it which side is right: the test or the code.",
      },
      {
        type: 'prompt',
        label: 'Debugging prompt with evidence',
        text: "This test fails (output pasted below) and the function is attached.\nDo not change the test. Give me two likely causes in order of likelihood, with the line that makes you think so, and one command that would confirm each. Do not edit anything yet.\n\n[paste the failing output here]",
      },
      { type: 'heading', text: 'Refactor in small steps' },
      {
        type: 'paragraph',
        text: "A refactor changes how code is built without changing what it does. That makes tests the whole safety net: run them green before you start, change one thing, run them again. Use plan mode or agent mode for moves that touch many files, with limits such as 'no behaviour change, no new dependencies, one function at a time', and read the diff for anything that looks like behaviour changing. A refactor that also edits the tests has changed the safety net and the code at once, so be suspicious of it.",
      },
      {
        type: 'version',
        text: "From GitHub's cheat sheet: `/tests` generates unit tests for the selected code (VS Code, Visual Studio, JetBrains, Xcode), `/fix` proposes fixes for problems in the selected code (the same IDEs), `/explain` explains the code in the active editor, and `/fixTestFailure` finds and fixes a failing test (VS Code only). The prompt-engineering page advises breaking complex tasks into smaller ones, giving examples (unit tests can serve as examples), avoiding ambiguity by naming the function or file, and iterating. Agent mode iterates on terminal results until the task is done, and plan mode is recommended for large or ambiguous tasks.",
        checked: CHECKED,
        sources: [DOCS.cheatSheet, DOCS.promptEngineering, DOCS.agentMode, DOCS.planMode],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a test is like a checklist a teacher uses to mark your answers: 'is 5 counted as low when the limit is 5?' If the code gives a different answer, the test fails and tells you which rule broke. A **boundary** is the exact edge of a rule, such as quantity equal to the limit, and it is where mistakes hide. In the code above, `test('...', () => { ... })` defines one check, `assert.deepEqual(a, b)` says 'these two must be the same', and `.map((item) => item.name)` turns a list of items into a list of their names. To see that a test can fail, change the code slightly and run the tests again. That is not breaking things for fun. It proves the test is paying attention.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Make this your routine on every feature: ask for the tests first, run them red, then let Copilot write the code. If you cannot get a test to fail, the test is wrong, not the code.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Judge generated tests like production code. Common defects are assertions that always hold, mocks that replace the unit under test, happy-path-only coverage, snapshot tests that bless whatever the code does, and tests coupled to implementation so any refactor breaks them. Mutation testing, even by hand (flip an operator, remove a guard), is the quickest way to measure whether a suite notices. For debugging, keep the agent from 'fixing' by editing the failing test: tell it which side is the specification. For refactors, characterization tests pin current behaviour before any change, and a pure move should produce a diff that tooling can show as a move. Require the full suite and lint in CI so an agent's local green is re-proved somewhere it cannot influence.",
      },
      {
        type: 'takeaways',
        items: [
          'Ask for tests with named cases and boundaries, and run them red before you make them pass.',
          'Break the code on purpose to prove a test can fail; a test that cannot fail proves nothing.',
          'Debug from evidence: paste the failing output, forbid test edits, and ask for causes before fixes.',
          'Refactor with green tests, one small step at a time, and read the diff for behaviour changes.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'The boundary the tests caught',
          prompt: 'Copilot wrote `lowStockNames`. The boundary test (quantity equal to the reorder level) fails. Tap the buggy line, then choose the fix that makes all the tests pass.',
          concept: 'Boundary tests',
          language: 'javascript',
          code: `function lowStockNames(items) {
  const low = items.filter((item) => item.quantity < item.reorderLevel);
  return low.map((item) => item.name);
}`,
          bugLine: 2,
          lineNote: 'That line is not the one failing the boundary test. Look at the comparison that decides what counts as low.',
          fixes: [
            { line: '  const low = items.filter((item) => item.quantity <= item.reorderLevel);', correct: true, why: 'At or below the reorder level counts as low, so <= includes the exact boundary and still leaves items above it out.' },
            { line: '  const low = items.filter((item) => item.quantity >= item.reorderLevel);', correct: false, why: 'This flips the rule: it keeps items that are at or above the reorder level, which are the ones that are not low.' },
            { line: '  const low = items.filter((item) => item.quantity <= 5);', correct: false, why: 'A fixed 5 ignores each item\'s own reorder level, so an item with 4 and a level of 3 would wrongly count as low.' },
            { line: '  const low = items.filter((item) => item.quantity <= item.reorderLevel + 1);', correct: false, why: 'Adding one fixes the boundary by accident and breaks the next case: an item one above its level is counted as low.' },
          ],
          tests: {
            kind: 'function',
            fn: 'lowStockNames',
            cases: [
              { label: 'below and at the level, and above it', args: [[{ name: 'Kape', quantity: 2, reorderLevel: 5 }, { name: 'Asukal', quantity: 5, reorderLevel: 5 }, { name: 'Sabon', quantity: 12, reorderLevel: 5 }]], expected: ['Kape', 'Asukal'] },
              { label: 'exactly at its own level', args: [[{ name: 'Itlog', quantity: 3, reorderLevel: 3 }]], expected: ['Itlog'] },
              { label: 'one above its own level', args: [[{ name: 'Bigas', quantity: 4, reorderLevel: 3 }]], expected: [] },
              { label: 'no items', args: [[]], expected: [] },
            ],
          },
          hints: [
            'The failing case has quantity equal to the reorder level. Which comparison leaves that out?',
            'Look at the symbol between item.quantity and item.reorderLevel.',
            'You need the one that means less than or equal to, and it must still use each item\'s own level.',
          ],
          explanation: 'The rule is at or below each item\'s own reorder level, so the comparison must be <=. Tests at the boundary and one step beyond it are exactly what catch the < versus <= mistake that generated code makes so often.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-09-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Could this test ever fail?',
          prompt: 'Copilot wrote each of these checks. Tap to see whether it proves anything.',
          concept: 'Meaningful tests',
          cards: [
            { front: "assert.ok(true) inside a test called 'low stock works'", back: 'It can never fail, so it proves nothing. Replace it with a call to lowStockItems and an exact expected result.' },
            { front: "A test that replaces lowStockItems with a fake that returns the expected list, then checks the list", back: 'It tests the fake, not your code. Test the real function with real inputs.' },
            { front: 'A test for an item with quantity 3 and reorderLevel 3 that expects it to be listed as low', back: 'A good one. It pins the boundary, and it fails if someone changes <= to <.' },
          ],
          hints: [],
          explanation: 'A useful test fails when the behaviour is wrong. Tests that always pass, or that test a stand-in, give false confidence, which is worse than having none.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-09-q1',
        prompt: 'Copilot generated five tests and they all pass. What is the best next check?',
        choices: [
          "Merge it, because a green test run means the work is finished",
          "Ask Copilot whether the tests it wrote are good enough to merge",
          "Break the code on purpose, like <= to <, and see if a test fails",
          "Delete the tests that pass the quickest, keeping only the slow ones",
        ],
        answer: 2,
        explanation: 'A test that cannot fail proves nothing. Introducing a deliberate fault shows whether the tests notice it.',
      },
      {
        id: 'ai-dev-copilot-09-q2',
        prompt: 'A test fails and you paste the output into chat. Which request leads to the best debugging?',
        choices: [
          "'Keep the test. List two causes with evidence, before any edit'",
          "'Fix this failing test so that it passes as quickly as possible'",
          "'Make the whole project work again, whatever it takes to do it'",
          "'Delete whatever is failing so the whole run goes green again'",
        ],
        answer: 0,
        explanation: 'Asking for causes first, and forbidding test edits, stops a guess that hides the symptom. The evidence-based request keeps you in charge of what is right.',
      },
      {
        id: 'ai-dev-copilot-09-q3',
        prompt: 'You want to refactor a module. What must be true before you start?',
        choices: [
          "The tests pass, so you can tell whether behaviour changed",
          "The module has been rewritten once by hand so it is easy to read",
          "Copilot has been given every file in the whole repository",
          "The pull request has already been approved by a teammate",
        ],
        answer: 0,
        explanation: 'A refactor must not change behaviour, and tests are how you know. Starting from green lets any failure be blamed on your last small step.',
      },
      {
        id: 'ai-dev-copilot-09-q4',
        prompt: 'Which slash command is documented for VS Code only and asks Copilot to find and fix a failing test?',
        choices: [
          "/explain, which explains how the active code works",
          "/doc, which documents a symbol in Visual Studio or Xcode",
          "/fixTestFailure, which finds and fixes a failing test",
          "/simplify, which simplifies the selection in Xcode",
        ],
        answer: 2,
        explanation: 'The cheat sheet lists `/fixTestFailure` for VS Code. `/explain` explains code, `/doc` documents a symbol, and `/simplify` is listed for Xcode.',
      },
      {
        id: 'ai-dev-copilot-09-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a boundary in a test?',
        choices: [
          "The folder where all of the tests for a project are kept together",
          "The line that separates one source file from the next in the editor",
          "A test that takes a very long time to finish running on your machine",
          "The exact edge of a rule, such as a quantity equal to the limit",
        ],
        answer: 3,
        explanation: 'Boundaries are the values right at the edge of a rule. Code written from a vague idea is often wrong exactly there.',
      },
      {
        id: 'ai-dev-copilot-09-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent is asked to fix a failing test and turns it green by loosening the assertion. How do you prevent this next time?',
        choices: [
          "State which side is right, forbid test edits, and re-run it all in CI",
          "Ask it to be more careful with the tests the next time you use it",
          "Switch to a different model and hope that it behaves better this time around",
          "Stop using agents for bug fixes, and ask for fewer features altogether",
        ],
        answer: 0,
        explanation: 'Make the constraint explicit and enforce it where the agent cannot change it: a rule in the prompt, and a CI run that re-proves the result independently.',
      },
    ],
    task: {
      title: 'Make a test fail on purpose',
      minutes: 15,
      steps: [
        'Pick a function in a project and ask Copilot for tests that name the normal case, two boundaries and one invalid input. Run them.',
        'Break the function on purpose (flip a comparison or remove a guard) and run the tests again. Note which tests failed. Fix the code back.',
        'If no test failed, rewrite the weakest one until it does, and write down what was wrong with it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Ask Copilot: 'Explain each test in plain words and what the code would have to do wrong for it to fail.' Check each answer by breaking the code that way."] },
      { audience: { min: 'advanced' }, steps: ['Do three hand mutations (flip an operator, drop a guard, return early). Record how many the suite catches and write one test for each it missed.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-10',
    day: 10,
    title: 'Safety, privacy and review',
    summary: 'The risks of AI-written code and the controls that reduce them: content exclusion, privacy settings, agent limits and a review habit.',
    minutes: 25,
    skills: ['copilot-safety', 'copilot-review'],
    intro: {
      objectives: [
        'Name the main risks of working with Copilot and match each to a control',
        'Explain what content exclusion does and what it does not guarantee',
        'Apply a personal review checklist to a Copilot-written change',
      ],
      why: 'Copilot sees your code and writes code you will ship. Knowing exactly where its protections stop is what lets you use it on real projects without leaking secrets, breaking a contract or shipping a hole.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Using Copilot safely is mostly four questions. What can it see? Where does what it sees go? What can it do? And what will I check before it ships? Each has a control, and each control has a limit, so this lesson is as much about the limits as the controls. A protection you misunderstand is worse than none, because you stop being careful.",
      },
      { type: 'heading', text: 'The risks, each with a control' },
      {
        type: 'table',
        headers: ['Risk', 'Control', 'Where it stops'],
        rows: [
          ['Wrong or insecure code that looks right', 'Tests, linters, code review (human first), Copilot review as a first pass', 'GitHub says Copilot can produce incorrect or insecure code; nothing replaces your review'],
          ['A secret or private file reaches Copilot', 'Keep secrets out of attached files and instruction files; content exclusion on Business and Enterprise', 'Content exclusion is not a security boundary and cannot guarantee prevention of every kind of file access'],
          ['Your code or prompts used for training', 'The training switch on individual plans; Business and Enterprise data is not used for training', 'The switch is yours only on Free, Pro, Pro+ and Max; check it after policy changes'],
          ['Suggestions copied from public code', 'The public-code matching setting (Block)', 'Closely matching only; it is not a license check'],
          ['An agent does something you did not intend', 'Command approval, a clean branch, narrow allow lists, pull request gates', 'Auto-approval gives the agent your access; delegated runs use configured MCP tools without asking'],
          ['Hidden instructions in an issue, file or page', 'Hidden-character filtering and write-access rules for the cloud agent; treat fetched text as untrusted', 'Filtering does not make external text trustworthy; review what the agent plans to do'],
        ],
      },
      {
        type: 'paragraph',
        text: "Content exclusion deserves a closer look because people over-trust it. It lets repository administrators and organization owners on Business and Enterprise name files or paths that Copilot should not use: excluded files get no inline suggestions, do not inform suggestions in other files, are not used for chat answers and are skipped in code review. But GitHub's docs state it is not a filesystem security boundary and not a substitute for operating-system permissions. Copilot may still use information the editor provides indirectly, such as type information; exclusions do not apply to symbolic links or to repositories on remote filesystems; and third-party MCP servers may ignore them. A password in a file that you excluded is still a password in a file. Do not keep secrets in the repository at all.",
      },
      { type: 'heading', text: 'Your review checklist' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Scope:** did it change only what I asked? Read the file list before the code.',
          '**Behaviour:** do the tests pass, and did I see a test fail for the right reason?',
          '**Names:** does every function, package and option it uses exist? A new dependency needs the same scrutiny as one you chose yourself.',
          '**Secrets:** no keys, tokens or passwords in code, tests, logs or instruction files.',
          '**Danger zones:** database queries built from text, file paths from users, authentication, money. Read these slowly.',
          '**Explainability:** can I explain every line to a teammate? If not, ask Copilot to explain it, or delete it.',
        ],
      },
      {
        type: 'prompt',
        label: 'A second opinion, not a verdict',
        text: "Review the attached diff as a skeptical security reviewer. List anything that handles user input, secrets, file paths, SQL or authentication, and for each one say what could go wrong. If you are not sure, say so. Do not edit any file.",
      },
      {
        type: 'paragraph',
        text: "That prompt asks Copilot to find risks, which is useful, but it is another model's opinion on its own kind of output. Use it to find things you then verify, never as a stamp of approval.",
      },
      {
        type: 'version',
        text: "From GitHub's docs: content exclusion is available on Copilot Business and Enterprise and can be configured by repository administrators and organization owners. Excluded files receive no inline suggestions, do not inform suggestions elsewhere, are not used for Copilot's responses and are skipped in code review. It applies to inline suggestions in Visual Studio, VS Code, JetBrains IDEs, Vim and Neovim, Xcode and Eclipse, and to chat and agents in Visual Studio, VS Code, JetBrains IDEs, the Copilot app, Copilot CLI, Copilot in the cloud and code review (not Xcode or Eclipse). The docs state that it is not a filesystem security boundary, is not a substitute for operating-system permissions, may miss indirect file access by agents, still lets Copilot use indirect information such as type information, does not apply to symbolic links or remote filesystems, and is not guaranteed to be respected by third-party MCP servers or clients.",
        checked: CHECKED,
        sources: [DOCS.contentExclusion],
        plans: 'Content exclusion needs Copilot Business or Enterprise',
      },
      {
        type: 'version',
        text: "Data handling, from GitHub's docs and blog: from April 24, 2026 interaction data from individual plans (Free, Pro and Pro+, and Max in the docs) may be used for training unless the user opts out in Copilot settings; Business and Enterprise customer data is not used for training; private repository content at rest is not trained on, though snippets sent to Copilot in an active session can be for opted-in individuals. Session data (prompts, responses, tools used and changes) from Copilot CLI and the GitHub Copilot app syncs to your GitHub account by default and is visible only to you unless shared, while GitHub Actions cloud sessions are visible to anyone with access to the repository. The MCP servers in Copilot policy is disabled by default for Business and Enterprise, and for the cloud agent the default GitHub MCP token is read-only and scoped to the current repository. The cloud agent's own checks include CodeQL, a dependency check against the GitHub Advisory Database and secret scanning, and they can be disabled, so do not rely on them as your only review.",
        checked: CHECKED,
        sources: [DOCS.trainingBlog, DOCS.policies, DOCS.sessionData, DOCS.mcp, DOCS.risks],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a **secret** is anything that proves who you are or pays for things, like a password or an **API key** (a long code that lets a program use a paid service). If one lands in your code and the code goes on GitHub, strangers can find and use it. Keep secrets in a separate file that you never share, and never paste them into chat. A **license** is the permission that comes with code, which says what others may do with it; if Copilot copies a published snippet, its license may matter. And **content exclusion** is a way for a team to say 'Copilot, stay out of these files', like a Keep Out sign: useful, but a sign is not a locked door.",
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Turn the checklist into your own: add the one mistake that has cost you the most time, and keep the list where you will see it when you open a pull request.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Write the threat model, then map controls to it. Assets are source, secrets, customer data and the build pipeline; actors include a careless teammate, a hostile issue or dependency, and the agent acting on injected text. Controls then layer: content exclusion and least-privilege MCP for what the tool sees and calls, branch rules, required checks and human approval for what ships, secret scanning and CI for what slips through, and audit and session logs for what happened. Decide retention and sharing for session data, because Actions sessions are visible to anyone with repository access. Note the honest limits the docs state (exclusion is not a security boundary; third-party servers may ignore it) and compensate with controls that do not depend on the tool being obedient, such as keeping secrets out of the repository and running CI as the final judge.",
      },
      {
        type: 'takeaways',
        items: [
          'Every protection has a limit: content exclusion is a guardrail, not a security boundary, and Business and Enterprise only.',
          'Choose your training and public-code settings on purpose; Business and Enterprise data is not used for training.',
          'Keep secrets out of the repository and out of prompts and instruction files.',
          'Review with a checklist: scope, behaviour, names, secrets, danger zones and whether you can explain every line.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-10-scenario-1',
          kind: 'scenario',
          title: 'The package nobody has heard of',
          prompt: 'Choose the safe response to this suggestion.',
          concept: 'Safe review',
          situation: "Copilot Chat suggests fixing a date-formatting problem in SariStock by running `npm install saristock-date-utils-pro` and importing a function from it. You have never heard of this package, and it is not in your package.json.",
          options: [
            {
              text: "Do not install it yet. Look the package up on the official registry, check that it exists and who maintains it, and ask Copilot whether the platform's built-in date formatting can do the job instead.",
              consequence: 'You catch a package that may not exist or may be a lookalike, and you consider the option with no new dependency. Fast and safe.',
              quality: 'best',
            },
            {
              text: 'Install it, since Copilot recommended it and the name sounds right.',
              consequence: 'Models sometimes invent plausible package names, and attackers register such names. Installing runs code from a stranger on your machine and ships it to users.',
              quality: 'poor',
            },
            {
              text: 'Install it in a throwaway folder first to see if it works.',
              consequence: 'Better than installing in your project, but installing can still run code on your machine, and working does not prove it is safe or maintained.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Could a name that sounds right still be invented, or a lookalike of a real package?',
            'What does installing a package actually do on your machine?',
            'The best answer verifies first and also asks whether you need a dependency at all.',
          ],
          explanation: 'Generated names can be wrong, and a dependency is code you did not write running with your access. Verify it exists and who owns it, and prefer built-in features when they do the job.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-10-fix-bug-1',
          kind: 'fix-bug',
          title: 'A key in the source',
          prompt: 'Copilot wrote this helper with the key written into the code. Tap the risky line, then choose the safe replacement.',
          concept: 'Secrets in code',
          language: 'typescript',
          code: `// Builds the map link for a delivery address
const MAPS_KEY = 'EXAMPLE_KEY_1234567890';

export function mapUrl(address: string) {
  return 'https://maps.example.com/embed?key=' + MAPS_KEY + '&q=' + encodeURIComponent(address);
}`,
          bugLine: 2,
          lineNote: 'That line is fine. Look for where a secret value is written into the source file.',
          fixes: [
            { line: "const MAPS_KEY = process.env.MAPS_KEY ?? '';", correct: true, why: 'The key is read from the environment at run time, so it lives outside the source and out of git. It must also be kept in a file that is ignored by git, and rotated if it was ever committed.' },
            { line: "const MAPS_KEY = atob('RVhBTVBMRV9LRVlfMTIzNDU2Nzg5MA==');", correct: false, why: 'Encoding is not protection. Anyone who sees the source can decode it in a second, and it is still in git history.' },
            { line: "const MAPS_KEY = 'EXAMPLE_KEY_' + '1234567890';", correct: false, why: 'Splitting the string leaves the secret in the file, only less obvious. Scanners and anyone reading the code will still find it.' },
            { line: "const MAPS_KEY = 'EXAMPLE_KEY_1234567890'; // TODO move to env", correct: false, why: 'A comment changes nothing. The secret is still committed, and a TODO next to a secret is one that tends to ship.' },
          ],
          hints: [
            'Which line puts the secret value itself into the file?',
            'A secret should come from outside the source code, such as an environment variable.',
            'Replace the literal with a read from `process.env`.',
          ],
          explanation: 'Anything in source ends up in version control and in every copy of the repository. Reading the key from the environment keeps it out. Also keep the environment file out of git, and rotate any key that was already committed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-10-match-1',
          kind: 'match',
          title: 'Which control fits?',
          prompt: 'Match each worry with the control that addresses it best, remembering its limits.',
          concept: 'Copilot safety controls',
          labels: { terms: 'Worry', meanings: 'Best control' },
          pairs: [
            { term: 'A client\'s contract says their code must not be used to train models, and you use a personal Pro plan', definition: 'Turn off the training switch in your Copilot settings and tell the client', note: 'That is the control individual plans have.' },
            { term: 'Your organization wants certain files kept out of Copilot\'s suggestions and answers', definition: 'Content exclusion, as a guardrail alongside real access controls', note: 'It is available on Business and Enterprise and is not a security boundary.' },
            { term: 'An agent might run a command you did not intend', definition: 'Read and approve each command, work on a clean branch and keep a narrow allow list', note: 'These bound what a run can do.' },
            { term: 'You are unsure whether a Copilot-written change is correct', definition: 'Tests you have seen fail, your own diff review and a human approval', note: 'Nothing replaces those.' },
          ],
          hints: [
            'Which worry is about data going to training, and which is about files, commands or correctness?',
            'One control only exists on Business and Enterprise plans.',
            'Correctness has no setting. It needs evidence and a person.',
          ],
          explanation: 'Each worry has its own control: training settings for data use, content exclusion for files (with limits), approvals and branches for agent actions, and tests plus human review for correctness.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-10-q1',
        prompt: "Your organization excluded `config/secrets.yml` with content exclusion. A teammate says that makes it safe to keep passwords there. What is the right response?",
        choices: [
          "Agree, because Copilot can never read a file that has been excluded",
          "Agree, but only for chat, since agents are not covered by exclusion",
          "Agree, since content exclusion also encrypts the excluded files on your disk",
          "Disagree: it is not a security boundary, so keep secrets out of the repo",
        ],
        answer: 3,
        explanation: "GitHub's docs say content exclusion is not a filesystem security boundary and not a substitute for OS permissions. Keep secrets out of the repository.",
      },
      {
        id: 'ai-dev-copilot-10-q2',
        prompt: 'Which plans can use content exclusion?',
        choices: [
          "Copilot Business and Copilot Enterprise",
          "Every plan, including Copilot Free and Student",
          "Only Copilot Pro, Pro+ and Max, for individuals",
          "Only verified students and teachers with a free plan",
        ],
        answer: 0,
        explanation: 'The content exclusion page lists Copilot Business and Copilot Enterprise. Individual plans do not have it.',
      },
      {
        id: 'ai-dev-copilot-10-q3',
        prompt: 'Why is a new dependency suggested by Copilot worth checking before you install it?',
        choices: [
          "The name may be invented, and installs run a stranger's code",
          "Because Copilot only suggests packages that you have to pay for",
          "Because installing any package always breaks your build and tests",
        ],
        answer: 0,
        explanation: 'Generated package names can be wrong, and a dependency is code you did not write. Verify it exists, who maintains it, and whether you need it.',
      },
      {
        id: 'ai-dev-copilot-10-q4',
        prompt: 'Which statement about model training and Copilot plans matches GitHub\'s description?',
        choices: [
          "No plan's data is ever used for training, under any setting at all",
          "Individuals may opt out; Business and Enterprise data is not used",
          "Every plan's data is used and nobody on any plan can opt out of it",
          "Only Copilot Business data is used for training, and only with consent",
        ],
        answer: 1,
        explanation: 'From April 24, 2026 individual plans have a default-on training setting you can disable, while Business and Enterprise are not affected.',
      },
      {
        id: 'ai-dev-copilot-10-q5',
        audience: { max: 'beginner' },
        prompt: 'What is an API key, and why must you keep it out of your code?',
        choices: [
          "A password for a program; anyone who finds it can use your service",
          "A shortcut that opens your editor faster; it is harmless to share",
          "The password to your own computer; it matters only if you lose it",
          "A comment in the code that explains what a function does and why it exists",
        ],
        answer: 0,
        explanation: 'An API key works like a password for a program. If it is in code that reaches GitHub, others can find it and use your service, possibly at your cost.',
      },
      {
        id: 'ai-dev-copilot-10-q6',
        audience: { min: 'advanced' },
        prompt: 'You must let agents run on a repository that holds customer data. Which design is the most defensible?',
        choices: [
          "Rely on content exclusion alone, since it already blocks agents from reading any of those files",
          "Allow everything for now and audit the logs later when something has already gone wrong",
          "Forbid agents altogether, because no single control can ever be perfect enough",
          "Keep customer data out of the repo, limit tools, require human approval, log everything",
        ],
        answer: 3,
        explanation: 'The docs are clear that exclusion has limits. Defence in depth, with controls that do not depend on the tool being obedient, is the sound design.',
      },
    ],
    task: {
      title: 'Build your review checklist',
      minutes: 15,
      steps: [
        'Write a six-line checklist from this lesson, adding one line from a mistake you have made. Save it in your notes or repository.',
        'Open your last Copilot-written change (or ask Copilot for one) and run the checklist against it. Mark each line pass or fail.',
        'Check your Copilot settings once more: public-code matching and, if shown, model training. Write down your decisions and why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ["Search a project you have for the words 'password', 'key' and 'token'. If you find a real secret in a file you share, write down where it should live instead."] },
      { audience: { min: 'advanced' }, steps: ['Write a one-page threat model for letting agents work in your repository: assets, actors, controls and the limit of each control. Mark the control that does not depend on the tool behaving.'] },
    ],
  },
  {
    id: 'ai-dev-copilot-11',
    day: 11,
    title: 'Project: ship a feature with Copilot',
    summary: 'Plan, build, test and review a real feature with Copilot, and keep a verification log that proves each claim.',
    minutes: 30,
    skills: ['copilot-agents', 'copilot-quality', 'copilot-review'],
    intro: {
      objectives: [
        'Plan a feature, define done and choose the right Copilot mode for each step',
        'Keep a verification log that records the evidence for every claim',
        'Turn what you learned into your own checklist, prompts and routine',
      ],
      why: 'Shipping one real feature end to end is the proof that you can direct Copilot rather than be directed by it. The verification log is what you show a client or employer, and what you rely on when something breaks.',
    },
    body: [
      {
        type: 'paragraph',
        text: "This lesson gets you ready for the final project: ship one real feature using chat, agent mode, a repository instructions file and a review, and record the evidence as you go. The feature can be SariStock's low-stock alert or something small from a project of your own. Pick something you can finish in one sitting and verify with tests: a validation rule, a small report, a filter. A big feature hides weak habits. A small one shows them.",
      },
      { type: 'heading', text: 'Define done before you start' },
      {
        type: 'paragraph',
        text: "Write three sentences before you open Copilot: what the feature does for a user, how you will know it works (the tests and the page or command you will check), and what must not change. Those sentences become the issue or the agent prompt, and they stop you from accepting whatever Copilot happens to produce. If you cannot write them, the task is not ready, and plan mode is the place to find that out.",
      },
      { type: 'heading', text: 'The path, and the evidence at each step' },
      {
        type: 'table',
        headers: ['Step', 'Copilot mode', 'Evidence for your log'],
        rows: [
          ['1. Set the rules', 'Chat to draft, you to edit', 'The instructions file, kept to one page, and the commands in it that you ran'],
          ['2. Plan', 'Plan mode', 'The plan, and what you removed from it'],
          ['3. Tests first', 'Chat or `/tests`', 'Failing output for the right reason, before any code'],
          ['4. Build', 'Agent mode on a clean branch', 'Each command approved or rejected, and the passing test output'],
          ['5. Review', 'Copilot review, then you, then a person', 'The comments, what you accepted or rejected, and why'],
          ['6. Reflect', 'You', 'What Copilot got wrong, and the line you add to your checklist'],
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The final project as a loop with evidence at every gate',
        source: `flowchart TD
  A(Write what done means) --> B[Instructions file and plan]
  B --> C[Failing tests first]
  C --> D[Agent builds on a branch]
  D --> E{Tests and lint pass?}
  E -->|No| D
  E -->|Yes| F[Pull request and Copilot review]
  F --> G[You review the diff]
  G --> H(Verification log and checklist update)`,
      },
      { type: 'heading', text: 'The verification log' },
      {
        type: 'paragraph',
        text: "The log is a short Markdown file in your repository. Each line is a claim and the evidence for it, so a stranger can check your work without trusting you or Copilot. Record what you asked, which mode you used, what you ran, what the output was, what Copilot got wrong, and what you changed by hand. The mistakes are the valuable part: they are where your judgement was needed.",
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'VERIFICATION.md (an example entry)',
        code: `# Verification log: low-stock alert

## Done means
- A sale that leaves quantity <= reorderLevel adds the item to the "Reorder soon" list.
- npm test and npm run lint pass. No new dependencies. applySale stays pure.

## Step 3: tests first (chat)
- Asked for tests with the boundary (quantity equal to reorderLevel) and an invalid quantity.
- Ran \`npm test\`: 2 failing, both "lowStockAlerts is not defined". Right reason.

## Step 4: build (agent mode, branch low-stock-alert)
- Approved: \`npm test\` (x3), \`npm run lint\`. Rejected: \`npm install lodash\` (not needed).
- Final: \`npm test\` 8 passing; \`npm run lint\` no problems.
- Copilot got wrong: first used < instead of <=; the boundary test caught it.
- I changed by hand: renamed lowStockAlerts to reorderSoon to match the dashboard.

## Step 5: review
- Copilot review: 2 comments. Accepted the missing-null-check one; rejected the rename suggestion.
- Human review: opened the diff, 3 files, all in scope.`,
      },
      {
        type: 'paragraph',
        text: "Notice what is absent: no claim without a command or a result behind it, and no 'it works'. Notice also that Copilot's mistake is recorded as a win for the process, because the boundary test caught it. Finally, turn the log into your own workflow. Keep the instructions file, the prompt file for the task you repeat, your review checklist and a short routine (plan, tests, build, review, log) where you will find them for the next feature.",
      },
      {
        type: 'version',
        text: "Which parts of the workflow your plan supports: Copilot Free includes agent mode and chat in the editor but not the cloud agent, and its code review is limited to reviewing a selection in VS Code; Copilot Student, Pro, Pro+, Max, Business and Enterprise include the cloud agent and code review. On Free you can still do steps 1 to 4 and open the pull request yourself, then review it by hand. Repository instructions are read by agent mode and chat in editors that support them, and by the cloud agent and code review on GitHub.com. Plan mode is available in VS Code, JetBrains, Xcode and Eclipse but not Visual Studio, so Visual Studio users should ask for a plan in a normal chat message.",
        checked: CHECKED,
        sources: [DOCS.plans, DOCS.planMode, DOCS.agentMode, DOCS.instructionsSupport, DOCS.codeReview],
        plans: 'Free covers steps 1 to 4; the cloud agent and full code review need Student, Pro, Pro+, Max, Business or Enterprise',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: you are going to build one small feature the way a careful professional would, with a helper. A **feature** is one thing your app can do, like warning you when a product is running low. **Evidence** is proof you can show, such as the screen where all the tests say 'passing'. The **log** is a diary of what you asked, what Copilot did and what you checked. You do not need to understand every word of the code. You do need to run the tests, read what changed, and be able to say in plain words what the feature does. If something is unclear, ask Copilot to explain it, and write what you learned in the log.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat the project as a small, instrumented process. Keep the evidence machine-checkable where you can: tests and lint in CI, a diff-stat limit in the issue, a required reviewer who is not the requester. Record cycle time per step and the defects each gate caught, so you can say which gate earned its cost: the plan, the failing test, the lint rule or the human review. Over a few features that data tells you where to tighten instructions, which tasks suit the cloud agent and which need your hands. The point is not to prove Copilot is fast. It is to know, with numbers, where it is safe to be fast.",
      },
      {
        type: 'takeaways',
        items: [
          'Write what done means, and how you will check it, before you open Copilot.',
          'Use plan mode, tests first, agent mode on a branch, then review: each gate leaves evidence.',
          'The verification log records the command, the output and what Copilot got wrong.',
          'Capture your checklist, instructions file and routine so the next feature starts faster and safer.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-11-scenario-1',
          kind: 'scenario',
          title: 'Tests pass, but is it done?',
          prompt: 'Choose the response that matches the evidence you have.',
          concept: 'Verification',
          situation: "The agent finished your low-stock feature. `npm test` shows 8 passing. But you read the diff and notice the dashboard still reads the old list: the new reorderSoon list is never rendered. No test covers the dashboard.",
          options: [
            {
              text: "Treat the feature as not done. Write a test (or a manual check with a screenshot) that shows the dashboard lists the item, make it fail, then fix it and log all of it.",
              consequence: 'You found a gap that the tests could not, closed it with evidence and recorded the lesson: passing tests only prove what they cover.',
              quality: 'best',
            },
            {
              text: 'Merge it: the tests pass, so the agent must be right.',
              consequence: 'The tests do not cover the dashboard, so they cannot tell you it works. You would ship a feature that does nothing visible.',
              quality: 'poor',
            },
            {
              text: 'Ask Copilot to confirm that the dashboard is wired up, and merge if it says yes.',
              consequence: 'Its answer is a claim, not evidence, and it already missed this once. A check you can run is better than another opinion.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'What do the passing tests actually cover?',
            'You read the diff and found something no test covers. What would prove the feature works?',
            'Evidence you can run, such as a new test or a screenshot, beats another opinion.',
          ],
          explanation: 'Passing tests prove only what they test. Reading the diff found a gap, and the right response is to add evidence for it, such as a test that fails first, and to record it in the log.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-copilot-11-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Good log line or bad?',
          prompt: 'Tap each log line to see whether it counts as evidence.',
          concept: 'Verification log',
          cards: [
            { front: "'Tests pass.'", back: 'Weak. Which command, and what exact output? Write: `npm test`: 8 passing, 0 failing.' },
            { front: "'Copilot used < instead of <=; the boundary test failed with expected [Itlog], got []; I changed it to <=.'", back: 'Strong. It records the mistake, the evidence that caught it and your fix.' },
            { front: "'Reviewed by Copilot, looks good.'", back: 'Weak. Copilot review is a first pass and can miss problems. Record its comments and what you accepted or rejected, plus your own review.' },
          ],
          hints: [],
          explanation: 'Good log lines name the command, the output and the decision. They let someone else check your work without trusting you or Copilot.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-dev-copilot-11-q1',
        prompt: 'What should you write down before opening Copilot for the project?',
        choices: [
          "What it does, how you will know it works, and what must not change",
          "The exact names of the files that Copilot is going to create for you",
          "The model you plan to use and how many credits it will cost",
          "A list of every keyboard shortcut that you already know by heart",
        ],
        answer: 0,
        explanation: 'Those three sentences define done and become the prompt or issue. Without them you accept whatever the tool produces.',
      },
      {
        id: 'ai-dev-copilot-11-q2',
        prompt: 'You are on Copilot Free. Which part of the project workflow can you still do with Copilot?',
        choices: [
          "None of it, since Copilot Free has no chat and no agent features at all",
          "Only the pull request review, since agent mode is not on Free",
          "Steps 1 to 4, then open the pull request and review it yourself",
          "Only the cloud agent step, since chat is not on the Free plan",
        ],
        answer: 2,
        explanation: 'Copilot Free includes chat and agent mode with limits, but not the cloud agent, and its code review is limited. Open the pull request yourself and review by hand.',
      },
      {
        id: 'ai-dev-copilot-11-q3',
        prompt: 'Which verification log line is the strongest evidence?',
        choices: [
          "Everything works now, and the feature is finished",
          "Copilot told me in chat that the problem was fixed and the work was complete",
          "The pull request looked fine to me when I scrolled through it in the browser",
          "`npm test`: 8 passing; the boundary test failed first, then passed",
        ],
        answer: 3,
        explanation: 'It names the command, the exact output and the failure that proved the test could fail. The others are claims without evidence.',
      },
      {
        id: 'ai-dev-copilot-11-q4',
        prompt: 'Why record what Copilot got wrong in the log?',
        choices: [
          "To blame the tool in case a bug turns up later in production",
          "They show where your judgement was needed and what to tighten",
          "To fill the page so that the log looks as if it took a lot of work",
          "Because mistakes do not matter if the tests end up passing",
        ],
        answer: 1,
        explanation: 'The mistakes are the useful data: they show which gate caught what, and what to add to your instructions or checklist.',
      },
      {
        id: 'ai-dev-copilot-11-q5',
        audience: { max: 'beginner' },
        prompt: 'What is evidence in this project?',
        choices: [
          "A promise from Copilot that the code now works as asked",
          "The number of lines of code that Copilot wrote for you",
          "Proof you can show, like test output or a screenshot",
          "A long explanation of how the feature was built, step by step",
        ],
        answer: 2,
        explanation: 'Evidence is something another person can check, like test output. A promise or a long explanation is only a claim.',
      },
      {
        id: 'ai-dev-copilot-11-q6',
        audience: { min: 'advanced' },
        prompt: 'After three features you want to know where Copilot is safe to use at full speed. What should you measure?',
        choices: [
          "Which gate caught which defects, and how long each step took",
          "How many lines of code Copilot generated for you each day of work",
          "How often you accepted the very first suggestion Copilot showed",
          "How many prompts you sent to Copilot for each of the features",
        ],
        answer: 0,
        explanation: 'Defects caught per gate, and cost per gate, show where checks earn their keep and where a task can safely move faster.',
      },
    ],
    task: {
      title: 'Prepare your project',
      minutes: 20,
      steps: [
        'Choose a small feature and write the three "done means" sentences. Create a branch and a VERIFICATION.md with the headings from the example.',
        'Draft your repository instructions file and note the commands in it that you have run.',
        'Ask Copilot in plan mode for a plan, cut anything not asked for, and save it in the log. Do not start building yet.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Pick the smallest feature you can think of, such as a message that says "no items yet" on an empty list. A small finished project teaches more than a big unfinished one.'] },
      { audience: { min: 'advanced' }, steps: ['Add a measurable acceptance criterion and a diff-stat limit to your done means. Decide which check will run in CI so the log does not depend on your word.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-dev-copilot-p1',
    title: 'Your Copilot starter kit',
    summary: 'Set up Copilot with privacy options chosen on purpose, then write a short repository instructions file, a path-specific file and a reusable prompt file for a project you own.',
    outcome: 'A repository that teaches Copilot your rules once, which a client or teammate can read in two minutes and which you can prove Copilot actually uses.',
    unlockAfterDay: 6,
    steps: [
      { id: 'ai-dev-copilot-p1-s1', text: 'Install Copilot in your editor, sign in, and write down your settings for public-code matching and model training, with one sentence on why you chose each.', link: 'https://docs.github.com/en/copilot/get-started/quickstart-for-using-github-copilot-in-your-ide' },
      { id: 'ai-dev-copilot-p1-s2', text: 'In a repository you own, write .github/copilot-instructions.md with Commands, Conventions and Gotchas. Keep it under one page and run every command you list.', link: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions' },
      { id: 'ai-dev-copilot-p1-s3', text: 'Add one path-specific file in .github/instructions/ with an applyTo pattern for your riskiest folder, and one prompt file for a task you repeat, such as writing tests for the selected function your way.' },
      { id: 'ai-dev-copilot-p1-s4', text: 'Prove Copilot uses them: ask a question the files should change, open the references Copilot lists for the answer, and record what you saw in a short NOTES.md.' },
      { id: 'ai-dev-copilot-p1-s5', audience: { max: 'beginner' }, text: 'Use a very small project, such as a one-page shop list. Ask Copilot to draft the instructions file, then keep only the lines you can explain in your own words and note what each one does.' },
      { id: 'ai-dev-copilot-p1-s6', audience: { min: 'advanced' }, text: 'For one rule in your instructions, add enforcement that does not depend on Copilot obeying: a lint rule, a test or a CI check. Note what happens when the rule is broken.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/you/your-project',
      hint: 'A public repository (or a link a reviewer can open) containing the instructions files and NOTES.md with your settings decisions and what you saw in the references.',
    },
    rubric: [
      'The repository instructions file is under one page and holds commands that actually run, conventions and gotchas, with no filler',
      'The path-specific file has a correct applyTo pattern and rules that match that folder only',
      'The prompt file describes one repeatable task clearly enough that someone else could run it',
      'NOTES.md shows evidence that Copilot used the files and records the privacy settings you chose and why',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Every line in the instructions file can be explained in the learner\'s own words, in the notes'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The project has real tests and a lint or build command, and the instructions list them'] },
      { audience: { min: 'advanced' }, items: ['At least one critical rule is also enforced by a lint rule, test or CI check, and the notes explain why instructions alone are not enough'] },
      { audience: { min: 'professional' }, items: ['The notes say which rules belong at organization level and which at repository level, and who reviews changes to the instructions files'] },
    ],
  },
  {
    id: 'ai-dev-copilot-p2',
    title: 'Ship a feature with Copilot',
    summary: 'Plan, test, build and review one real feature using Copilot chat, plan mode, agent mode, a pull request and a review, and keep a verification log that proves each claim.',
    outcome: 'A merged-quality pull request with a verification log that shows you directed Copilot, caught its mistakes with evidence, and can say exactly what was checked.',
    unlockAfterDay: 10,
    steps: [
      { id: 'ai-dev-copilot-p2-s1', text: 'Choose a small feature you can verify with tests. Write three sentences for what done means (what it does, how you will check it, what must not change). Create a branch and a VERIFICATION.md.' },
      { id: 'ai-dev-copilot-p2-s2', text: 'In plan mode (or a chat message asking for a plan, in Visual Studio), get a plan, answer its questions and cut anything you did not ask for. Save the plan in the log.' },
      { id: 'ai-dev-copilot-p2-s3', text: 'Ask Copilot for tests that name the normal case, the boundaries and an invalid input. Run them and record the failing output, and why it fails for the right reason.' },
      { id: 'ai-dev-copilot-p2-s4', text: 'Use agent mode on your branch with a goal, limits and a check. Read each command before approving it, and record the ones you approved and rejected and the final test and lint output.' },
      { id: 'ai-dev-copilot-p2-s5', text: 'Open a pull request. Add Copilot as a reviewer if your plan includes code review, or review with your own checklist if not. Record each comment, what you accepted, what you rejected and why.' },
      { id: 'ai-dev-copilot-p2-s6', text: 'Prove one test can fail: break the code on purpose, run the tests, and record which test failed. Then restore the code.' },
      { id: 'ai-dev-copilot-p2-s7', text: 'Finish the log with what Copilot got wrong, what you changed by hand and one line you add to your review checklist or instructions file.' },
      { id: 'ai-dev-copilot-p2-s8', audience: { max: 'beginner' }, text: 'Pick the smallest feature you can, for example an empty-list message. At each step ask Copilot to explain what it did in plain words, and write one thing you learned in the log.' },
      { id: 'ai-dev-copilot-p2-s9', audience: { min: 'advanced' }, text: 'Add a measurable acceptance criterion and a diff-stat limit to done means, and make CI run the tests and lint so the log does not depend on your word. Record the cycle time of each step.' },
    ],
    submission: {
      kind: 'url',
      label: 'Pull request or repository link',
      placeholder: 'https://github.com/you/your-project/pull/1',
      hint: 'A link to the pull request (or the repository) that contains VERIFICATION.md. The log should name commands, outputs and decisions, not only conclusions.',
    },
    rubric: [
      'Done means is written before the work, and the feature meets it with the tests to show it',
      'Tests were seen failing for the right reason before the code was written, and one test is shown to fail when the code is broken on purpose',
      'The agent run is bounded: a branch, stated limits, and commands that were read before being approved',
      'The pull request diff stays inside the stated scope, and the review comments are recorded with accept or reject decisions',
      'VERIFICATION.md names real commands and outputs, and states what Copilot got wrong and what was changed by hand',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The learner can explain in plain words what the feature does and what the tests check'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The feature uses real data handling or an API, with at least one test for an invalid input'] },
      { audience: { min: 'advanced' }, items: ['The change fits an existing codebase, respects its patterns, and CI re-runs the checks independently of the agent', 'Security-relevant parts (input handling, secrets, dependencies) are named in the review notes'] },
      { audience: { min: 'professional' }, items: ['The log includes evidence of separation of duties (a reviewer who is not the requester) and records which gate caught which defect'] },
    ],
  },
];

export const aiDevCopilotCourse: Course = {
  id: 'ai-dev-copilot',
  kind: 'standard',
  title: 'Mastering GitHub Copilot',
  level: 'intermediate',
  tagline: 'Use Copilot in your editor and on GitHub, and stay in charge of every change.',
  description:
    'GitHub Copilot suggests code as you type, answers questions about your project, edits files in agent mode and opens pull requests through its cloud agent. This course teaches you to set it up safely, give it the right context and instructions, choose the right mode for each task, and review what it produces. You finish by shipping a real feature with Copilot and a verification log that proves it works.',
  finishLine: [
    'Copilot set up in your editor with privacy options chosen on purpose',
    'A repository instructions file and a reusable prompt file that make Copilot follow your project rules',
    'A feature built with chat, agent mode and a pull request review, with every step checked by tests',
    'A verification log and a personal checklist for reviewing anything Copilot writes',
  ],
  objectives: [
    'Choose between inline suggestions, chat, agent mode and the cloud agent for a task',
    'Give Copilot the right context with open files, references and a repository instructions file',
    'Write path-specific instructions and a prompt file that your whole team can reuse',
    'Run an agent task and review its pull request with tests and Copilot code review',
    'Apply the safety, privacy and content-exclusion controls that protect your code',
  ],
  audiences: ['experienced-dev', 'fresh-grad', 'builder'],
  skills: [
    { id: 'copilot-orientation', label: 'Copilot features, plans and setup' },
    { id: 'copilot-completions', label: 'Inline suggestions' },
    { id: 'copilot-chat', label: 'Chat, context and references' },
    { id: 'copilot-instructions', label: 'Instructions and prompt files' },
    { id: 'copilot-agents', label: 'Agent mode and the cloud agent' },
    { id: 'copilot-review', label: 'Pull requests and code review' },
    { id: 'copilot-quality', label: 'Tests, debugging and refactoring with Copilot' },
    { id: 'copilot-safety', label: 'Safety, privacy and review' },
  ],
  lessons,
  projects,
  icon: 'code',
  updated: '2026-11-14',
};
