import type { AiTool } from '../types';

/**
 * The AI development tools, each checked against its official documentation. The comparison lesson, the
 * AI tools guide (`/ai-tools`) and every `toolComparison` block read this list, so a product change is
 * one edit here. Never put a price figure here (prices change and differ by country): name the plans.
 */
export const AI_TOOLS: readonly AiTool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    maker: 'OpenAI',
    kind: 'Chat assistant',
    bestFor: [
      'Explaining errors, concepts and unfamiliar code you paste in',
      'Talking through a design or a plan before you write code',
      'Small, self-contained snippets, scripts and test ideas',
    ],
    strengths: [
      'Works from a browser, desktop or phone with no project setup',
      'Projects keep chats and files for one piece of work together',
      'Codex is included in ChatGPT plans for agent work on a repository',
    ],
    limits: [
      'Sees only what you paste, upload or connect, so it guesses about the rest of your code',
      'You copy changes back into your project and test them yourself',
    ],
    context: 'What you paste or upload, plus files kept in a Project and any plugins you connect.',
    agent: 'In chat it answers and writes code for you to apply. For edits and commands in a repository, OpenAI points developers to Codex.',
    integrations: 'Web, desktop and mobile apps; plugins to connect other tools; Codex for coding work.',
    plans: 'Personal plans are Free, Go, Plus and Pro (Codex is limited on Free and Go, included on Plus, with more usage on Pro); Business, Enterprise and Higher Education plans for organisations. On personal plans your chats can be used for training unless you opt out; the Business plan page says business data is never used for training. Check the pricing page.',
    sources: [
      { label: 'ChatGPT pricing', url: 'https://chatgpt.com/pricing' },
      { label: 'ChatGPT Business plan', url: 'https://chatgpt.com/business/business-plan/' },
      { label: 'Codex docs: Pricing', url: 'https://learn.chatgpt.com/docs/pricing' },
    ],
    checked: '2026-11-14',
  },
  {
    id: 'claude',
    name: 'Claude',
    maker: 'Anthropic',
    kind: 'Chat assistant',
    bestFor: [
      'Reading and explaining long files, specs and logs',
      'Architecture discussions and reviewing a design',
      'Drafting code, tests and docs you then apply yourself',
    ],
    strengths: [
      'Projects hold documents, code and instructions for one piece of work',
      'On paid plans, project knowledge switches to retrieval when it nears the context limit',
      'Connectors bring in context from other tools',
    ],
    limits: [
      'In chat it works on what you give it, not on your live repository',
      'Answers still need checking against your code, tests and the official docs',
    ],
    context: 'Pasted text and uploaded files, Project knowledge and instructions, and connected tools.',
    agent: 'In chat it can create and edit files with code execution, but it does not change your repository. Anthropic\'s tool for that is Claude Code.',
    integrations: 'Web, desktop and mobile apps; connectors and desktop extensions on every plan.',
    plans: 'Individual plans are Free, Pro, Max and Ultra; Team and Enterprise for organisations, plus Education. Projects are on every plan (Free has a limit), Research and Claude Code start at Pro. Model training is opt-out on individual plans; Team and Enterprise say no training on your content by default. Check the pricing page.',
    sources: [
      { label: 'Claude pricing', url: 'https://claude.com/pricing' },
      { label: 'Claude Help Center: What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
    ],
    checked: '2026-11-14',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    maker: 'Anthropic',
    kind: 'Terminal coding agent (also IDE, desktop and web)',
    bestFor: [
      'Multi-file features and bug fixes in a repository',
      'Running tests, reading the failures and fixing them',
      'Exploring an unfamiliar codebase from the terminal',
      'Preparing commits and pull requests',
    ],
    strengths: [
      'Reads the project, runs commands and checks its own work in a loop',
      'Reads CLAUDE.md (or AGENTS.md) at the start of every session',
      'Permission modes, including Plan mode, and checkpoints to undo file edits',
    ],
    limits: [
      'It can run any command you allow, so permissions and review matter',
      'Long sessions fill the context window and get summarised, so early instructions can be lost',
    ],
    context: 'Searches and reads your files itself, plus git state, CLAUDE.md, auto memory, command output and MCP servers.',
    agent: 'Edits files, runs shell commands and tests, uses git, and can open pull requests; it asks first unless your permission mode or rules allow the action.',
    integrations: 'Terminal, VS Code, JetBrains, desktop app, web, Slack, GitHub Actions and GitLab CI/CD, and MCP servers.',
    plans: 'Needs a paid Claude plan (Pro, Max, Ultra, Team or Enterprise) or an Anthropic Console account; it is not on the Free plan. Check the pricing page.',
    sources: [
      { label: 'Claude Code docs: Overview', url: 'https://code.claude.com/docs/en/overview' },
      { label: 'Claude Code docs: How Claude Code works', url: 'https://code.claude.com/docs/en/how-claude-code-works' },
      { label: 'Claude pricing', url: 'https://claude.com/pricing' },
    ],
    checked: '2026-11-14',
  },
  {
    id: 'codex',
    name: 'Codex',
    maker: 'OpenAI',
    kind: 'Coding agent (terminal, IDE and cloud)',
    bestFor: [
      'Delegating a well-scoped coding task and reviewing the result',
      'Several tasks running in the cloud while you keep working',
      'Code review on pull requests',
    ],
    strengths: [
      'Same agent in the CLI, the IDE extension and Codex Cloud',
      'Local runs start sandboxed: writes limited to the workspace and no network by default',
      'Reads AGENTS.md files from your home folder and the repository',
    ],
    limits: [
      'Cloud tasks need your repository connected through GitHub or GitLab and a cloud environment set up',
      'Results must still be inspected and tested before you merge',
    ],
    context: 'Reads your repository and AGENTS.md files; cloud tasks run in an environment set up with your repositories and tools.',
    agent: 'Inspects files, edits code and runs commands locally (inside a sandbox, asking when it needs more); cloud tasks can end in a commit or a pull request.',
    integrations: 'ChatGPT apps, Codex CLI, the Codex IDE extension, Codex Cloud, GitHub and GitLab, a GitHub Action and code review.',
    plans: 'Included in ChatGPT Free, Go, Plus, Pro, Business, Edu and Enterprise plans. It can also run with an API key (billed at API pricing), but cloud features are not available that way. Check the pricing page.',
    sources: [
      { label: 'Codex docs: Pricing', url: 'https://learn.chatgpt.com/docs/pricing' },
      { label: 'Codex docs: CLI', url: 'https://learn.chatgpt.com/docs/codex/cli.md' },
      { label: 'Codex docs: Agent approvals and security', url: 'https://learn.chatgpt.com/docs/agent-approvals-security.md' },
    ],
    checked: '2026-11-14',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    maker: 'Cursor',
    kind: 'AI code editor (with CLI and cloud agents)',
    bestFor: [
      'Day-to-day coding with completions and an agent in one editor',
      'Changes across several files that you want to see as you go',
      'Project rules that every chat and agent run follows',
    ],
    strengths: [
      'Tab suggests multi-line and cross-file edits as you type',
      'Agent searches the codebase, edits files and runs terminal commands, with checkpoints',
      'Rules in `.cursor/rules`, AGENTS.md, and a `.cursorignore` file to keep files out of AI context',
    ],
    limits: [
      'Ignore files do not stop terminal commands or MCP tools from reading a file',
      'Cloud agents and Bugbot reviews need a higher paid plan',
    ],
    context: 'Code near the cursor and recent edits for Tab; for Agent, its own search of the codebase, files you @-mention, rules, terminal output and git diffs.',
    agent: 'Agent edits files and runs shell commands; Cloud Agents work in isolated cloud machines and can open pull requests.',
    integrations: 'The editor, a CLI, GitHub, GitLab, Bitbucket, Azure DevOps, Slack, Linear and MCP servers.',
    plans: 'Free (limited agent and chat requests), then individual plans Plus, Premium, Super and Ultra; the Plus plan offers only Grok models, and Cloud agents and Bugbot code reviews start at Premium. Teams and Enterprise add admin and privacy controls. Check the pricing page.',
    sources: [
      { label: 'Cursor docs: Agent', url: 'https://cursor.com/docs/agent/overview' },
      { label: 'Cursor help: Tab completion', url: 'https://cursor.com/help/ai-features/tab.md' },
      { label: 'Cursor help: Ignore files', url: 'https://cursor.com/help/customization/ignore-files.md' },
      { label: 'Cursor pricing', url: 'https://cursor.com/pricing' },
    ],
    checked: '2026-11-14',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    maker: 'GitHub',
    kind: 'Editor assistant and GitHub agent',
    bestFor: [
      'Completions and chat inside VS Code, JetBrains and other IDEs',
      'Teams whose work already lives on GitHub (issues, pull requests, reviews)',
      'Handing a task to a cloud agent that returns a pull request',
    ],
    strengths: [
      'Agent mode in the IDE finds code, edits files and runs commands',
      'Copilot cloud agent works in the background and opens one pull request per task',
      'Organisation policies, content exclusion and a public-code matching filter',
    ],
    limits: [
      'Content exclusion is a guardrail, not a filesystem security boundary',
      'GitHub itself warns its agent can produce incorrect or insecure code, so review and test',
    ],
    context: 'Open files and code around the cursor, the repository on GitHub, custom instructions, and MCP servers.',
    agent: 'Agent mode edits and runs commands in your IDE; the cloud agent researches a repository, makes changes and prepares a pull request for your review.',
    integrations: 'VS Code, JetBrains and other IDEs, GitHub.com, Copilot CLI and MCP servers.',
    plans: 'Copilot Free, Copilot Student, Pro, Pro+ and Max for individuals; Business and Enterprise for organisations. The cloud agent and full Copilot code review are not on Copilot Free; content exclusion is a Business and Enterprise feature. Verified teachers and popular open source maintainers may get Pro free. Check the plans page.',
    sources: [
      { label: 'GitHub Docs: Copilot plans', url: 'https://docs.github.com/en/copilot/get-started/plans' },
      { label: 'GitHub Docs: About Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent' },
      { label: 'GitHub Docs: Content exclusion', url: 'https://docs.github.com/en/copilot/concepts/context/content-exclusion' },
    ],
    checked: '2026-11-14',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    maker: 'Google',
    kind: 'Chat assistant and Google\'s coding tools',
    bestFor: [
      'Questions and explanations in the Gemini app',
      'Developers already working in Google Cloud, Android Studio or Colab',
      'Teams that already have Gemini Code Assist in their IDE',
    ],
    strengths: [
      'Google AI plans bundle the Gemini app with Antigravity, AI Studio, Colab and Android Studio limits',
      'Gemini Code Assist works in VS Code, JetBrains IDEs, Android Studio and Cloud Workstations',
      'Code Assist agent mode asks before changing files unless you allow the tool',
    ],
    limits: [
      'New Gemini Code Assist subscriptions are no longer sold; Google now points to Antigravity for the best coding experience with Gemini models',
      'In the Gemini app with Keep Activity on, some chats are read by human reviewers, so keep confidential code out',
    ],
    context: 'What you paste or upload in the app; in Code Assist, your open files, and (Enterprise) your own code bases on GitHub, GitLab or Bitbucket.',
    agent: 'Gemini Code Assist agent mode (VS Code and IntelliJ) runs multi-step tasks with system tools and MCP servers; the Gemini app answers in chat.',
    integrations: 'Gemini app; Code Assist in VS Code, JetBrains IDEs, Android Studio, Cloud Shell Editor and Cloud Workstations; MCP; Antigravity.',
    plans: 'Google AI Plus, Pro and Ultra plans raise Gemini app and Antigravity limits; Gemini Code Assist comes in Standard and Enterprise editions through Google Cloud, but new subscriptions are no longer available. Work and school accounts can have different data terms. Check the plans page.',
    sources: [
      { label: 'Google AI plans', url: 'https://one.google.com/about/google-ai-plans/' },
      { label: 'Gemini Code Assist overview', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/overview' },
      { label: 'Gemini Code Assist: Agent mode', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/agent-mode' },
      { label: 'Gemini Apps Privacy Hub', url: 'https://support.google.com/gemini/answer/13594961' },
    ],
    checked: '2026-11-14',
  },
];
