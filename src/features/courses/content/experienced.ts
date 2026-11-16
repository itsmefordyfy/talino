import type { Course, Lesson, Project } from './types';

const CHECKED = '2026-11-14';

/** Official pages cited by the level-specific version notes (all opened on the checked date). */
const SRC = {
  doraMetrics: { label: 'DORA: software delivery performance metrics', url: 'https://dora.dev/guides/dora-metrics/' },
  dora2025: { label: 'DORA: 2025 State of AI-assisted Software Development', url: 'https://dora.dev/research/2025/dora-report/' },
  pushProtection: { label: 'GitHub Docs: About push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  mcp: { label: 'Model Context Protocol: What is MCP?', url: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
  ccPermissions: { label: 'Claude Code: Configure permissions', url: 'https://code.claude.com/docs/en/permissions' },
  ccMemory: { label: 'Claude Code: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  copilotInstructions: { label: 'GitHub Docs: Adding repository custom instructions for Copilot', url: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions' },
  codexAgentsMd: { label: 'Codex: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  contextEng: { label: 'Anthropic: Effective context engineering for AI agents', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
  gitBlame: { label: 'Git documentation: git-blame', url: 'https://git-scm.com/docs/git-blame' },
  gitLog: { label: 'Git documentation: git-log', url: 'https://git-scm.com/docs/git-log' },
  gitDiffOptions: { label: 'Git documentation: diff options', url: 'https://git-scm.com/docs/diff-options' },
  gitBisect: { label: 'Git documentation: git-bisect', url: 'https://git-scm.com/docs/git-bisect' },
  gitWorktree: { label: 'Git documentation: git-worktree', url: 'https://git-scm.com/docs/git-worktree' },
  codeOwners: { label: 'GitHub Docs: About code owners', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners' },
  coAuthors: { label: 'GitHub Docs: Creating a commit with multiple authors', url: 'https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors' },
  fowlerAdr: { label: 'Martin Fowler: Architecture Decision Record', url: 'https://martinfowler.com/bliki/ArchitectureDecisionRecord.html' },
  hooks: { label: 'Claude Code: Automate actions with hooks', url: 'https://code.claude.com/docs/en/hooks-guide' },
  subagents: { label: 'Claude Code: Subagents', url: 'https://code.claude.com/docs/en/sub-agents' },
  effectiveAgents: { label: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
  specKit: { label: 'GitHub: Spec Kit', url: 'https://github.com/github/spec-kit' },
  owaspLlm: { label: 'OWASP Top 10 for LLM Applications 2025', url: 'https://genai.owasp.org/llm-top-10/' },
  owaspLlm06: { label: 'OWASP: LLM06:2025 Excessive Agency', url: 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/' },
  npmCi: { label: 'npm Docs: npm ci', url: 'https://docs.npmjs.com/cli/v11/commands/npm-ci' },
  pgExplain: { label: 'PostgreSQL documentation: Using EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
  apiErrors: { label: 'Claude API: Errors', url: 'https://platform.claude.com/docs/en/api/errors' },
  apiVersioning: { label: 'Claude API: API versions', url: 'https://platform.claude.com/docs/en/api/versioning' },
  structuredOutputs: { label: 'Claude API: Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
  evalsGuide: { label: 'Claude API: Create strong empirical evaluations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/develop-tests' },
  nistRmf: { label: 'NIST: AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
  copilotCodeReferencing: { label: 'GitHub Docs: About GitHub Copilot code referencing', url: 'https://docs.github.com/en/copilot/concepts/completions/code-referencing' },
};

const lessons: Lesson[] = [
  {
    id: 'experienced-01',
    day: 1,
    title: 'Why now, and an honest look at the hype',
    summary: 'What AI coding tools really change for an experienced developer, and where the claims run ahead of the evidence.',
    intro: {
      objectives: [
        'Explain why research on AI coding speed is mixed and what the gain depends on',
        'Sort everyday development tasks into those where AI tends to help and those where it traps you',
        'Propose a small measured trial of your own instead of trusting a headline number',
      ],
      why: 'Teams in Manila, Cebu and Davao, and remote clients, now expect developers to work with these tools, and a sceptic who tests the claims is more useful than a fan or a refuser. This lesson gives you the honest starting point for the 20 days.',
    },
    minutes: 15,
    skills: ['ai-workflow', 'team-impact'],
    body: [
      { type: 'paragraph', text: "You have shipped code for years. You know what a production incident at 2 AM feels like, you know why that strange `if` in the billing module exists, and you have seen plenty of 'this changes everything' tools come and go. Being sceptical of AI coding tools is reasonable. This course does not ask you to drop that scepticism. It asks you to test it." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "This course is written for working developers, so a few words first. An **AI coding assistant** is a program you talk to in plain language: it reads code and writes code for you. A **codebase** is all the files that make up one piece of software, and **boilerplate** is the repetitive code almost every project needs. The lesson's warning is simple: the assistant writes quickly, but it can be wrong with total confidence, and a person has to check. If you have never written code, take 'Coding with AI for Complete Beginners' and 'Understanding AI-Generated Code' first, then come back. You can still read along to see how professionals check an assistant's work.",
      },
      { type: 'heading', text: 'What has actually changed' },
      { type: 'paragraph', text: "AI coding assistants can now read a whole repository, run commands, edit several files and explain what they did. For some tasks that is a real speed-up: boilerplate, test scaffolding, reading unfamiliar code, first drafts of documentation, small mechanical migrations. For other tasks it is a trap: subtle business rules, security-sensitive code, anything where 'looks right' and 'is right' are far apart." },
      { type: 'paragraph', text: 'The research is mixed. Some studies report faster task completion. At least one controlled study found that experienced developers working in codebases they knew well were slower with AI, even though they believed they were faster. Both findings can be true at once. The gain depends on the task, the codebase, the tool and the person driving it. That is why this course ends with you measuring your own before and after, instead of trusting anyone\'s headline, including ours.' },
      {
        type: 'table',
        headers: ['Task', 'Where it tends to land'],
        rows: [
          ['Boilerplate', 'Real speed-up'],
          ['Test scaffolding', 'Real speed-up'],
          ['Reading unfamiliar code', 'Real speed-up'],
          ['First drafts of documentation', 'Real speed-up'],
          ['Small mechanical migrations', 'Real speed-up'],
          ['Subtle business rules', 'Trap'],
          ['Security-sensitive code', 'Trap'],
          ['Anything where "looks right" and "is right" are far apart', 'Trap'],
        ],
        caption: 'From the lesson: where AI coding tools help and where they trap you',
      },
      {
        type: 'activity',
        activity: {
          id: 'experienced-01-scenario-1',
          kind: 'scenario',
          title: 'The headline number',
          prompt: 'What do you recommend?',
          concept: 'evaluating ai claims',
          situation: 'Your manager forwards an article claiming AI makes every developer twice as fast. Your lead replies that a controlled study found experienced developers slower in codebases they knew well, even though they felt faster. The manager asks you: should the team adopt AI tools?',
          options: [
            {
              text: 'Quote the article: a number that big is proof enough.',
              consequence: 'That figure comes from someone else\'s tasks and codebase. It says little about yours.',
              quality: 'poor',
            },
            {
              text: 'Say the study proves AI slows everyone down and recommend dropping it.',
              consequence: 'One study of one setting does not prove the same for every task, codebase or person.',
              quality: 'poor',
            },
            {
              text: 'Say it depends, and leave it there.',
              consequence: 'It is true, but your manager gets nothing to decide with.',
              quality: 'acceptable',
            },
            {
              text: 'Propose a small measured trial: log comparable tasks before and after on your own codebase, then decide from your own numbers.',
              consequence: 'Both findings can be true at once. Your own measured results are the evidence that matters, and it is how this course ends.',
              quality: 'best',
            },
          ],
          hints: [
            'Both the article and the study could be right about their own settings.',
            'The gain depends on the task, the codebase, the tool and the person.',
            'What evidence would be about your team, not somebody else\'s?',
          ],
          explanation: 'Results are mixed and depend on context, so the useful move is to measure your own before and after.',
        },
      },
      { type: 'heading', text: 'Why it matters for your career' },
      { type: 'paragraph', text: 'Teams in Manila, Cebu and Davao, and foreign clients hiring remote Filipino developers, increasingly expect people to be comfortable with these tools, the same way they once came to expect Git. Your advantage is judgment. A junior with an AI assistant can produce a lot of code quickly. You can tell which of it should ship. The goal is to keep that judgment and add speed, not to trade one for the other.' },
      { type: 'list', items: [
        'AI is good at producing plausible code quickly.',
        'It does not know your business, your users or the history behind your code.',
        'It makes confident mistakes, so review stays your job.',
        'The real skill is directing it: good context, small steps, and verification you trust.',
      ] },
      { type: 'paragraph', text: 'Over the next 20 days you will set up a tool safely, learn to feed it context, use it for reading, refactoring, testing, debugging, reviewing and documenting, and then decide for yourself where it earns its place. You finish with two pieces of proof: your own written workflow and a before/after case study with honest numbers.' },
      { type: 'prompt', label: 'Sort your week', text: 'I am a developer with [N] years of experience in [languages and stack]. I am sceptical of AI coding tools. Give me five tasks from a typical week in my kind of work where an AI assistant is likely to help, and five where it is likely to waste my time or add risk. For each, explain why in one sentence. Do not exaggerate, and say when the answer depends on the codebase.' },
      { type: 'tip', text: 'Write your current opinion of AI coding tools in two or three honest sentences today. On day 20 you will read it again and see what changed, if anything.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat adoption as an engineering question with a design. Individual speed, the time to a first draft, is the cheapest number to collect and the least trustworthy, because review, integration and incident costs land later and on other people. Measure at the delivery level instead. DORA currently defines five measures in two groups: throughput (change lead time, deployment frequency, failed deployment recovery time) and instability (change fail rate, deployment rework rate). Watch both groups, because a gain in one bought with a loss in the other is not a gain. DORA's 2025 report describes AI's primary role as an amplifier of an organisation's existing strengths and weaknesses, which matches what teams see: strong tests, small changes and fast review let the speed show up, and weak ones let defects arrive faster. Decide before the trial which result would make you stop.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "DORA's guide to its software delivery metrics lists three throughput measures (change lead time, deployment frequency, failed deployment recovery time) and two instability measures (change fail rate, deployment rework rate); the guide was last updated on 5 January 2026. DORA's 2025 report, 'State of AI-assisted Software Development', summarises AI's primary role as an amplifier of an organisation's existing strengths and weaknesses.",
        checked: CHECKED,
        sources: [SRC.doraMetrics, SRC.dora2025],
      },
      {
        type: 'takeaways',
        items: [
          'AI is good at producing plausible code quickly, and can be confidently wrong.',
          'It does not know your business, your users or the history behind your code, so review stays your job.',
          'Research is mixed: the gain depends on the task, codebase, tool and person.',
          'Your advantage is judgment about what should ship. Direct the tool with good context, small steps and verification.',
          'The course ends with your own measured before and after, not someone else\'s headline.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-01-q1',
        prompt: 'Why does this course end with you measuring your own before and after?',
        choices: [
          'Because AI always makes developers faster, so the numbers will look good',
          'Because the gain varies with the task, codebase, tool and person',
          'Because studies prove AI makes every developer slower',
        ],
        answer: 1,
        explanation: 'Research results are mixed and depend heavily on context. Your own measured results on your own work are the evidence that matters.',
      },
      {
        id: 'experienced-01-q2',
        prompt: 'What is an experienced developer\'s main advantage when working with an AI assistant?',
        choices: [
          'Judging which generated code should actually ship',
          'Typing faster than the assistant',
          'Not needing to read the generated code',
        ],
        answer: 0,
        explanation: 'Anyone can generate code. Knowing the business rules, history and risks well enough to accept or reject it is where experience pays.',
      },
      {
        id: 'experienced-01-q3',
        prompt: 'Which task is an AI assistant most likely to help with?',
        choices: [
          'Deciding whether an undocumented billing rule is still needed',
          'Approving a security exception for production',
          'Scaffolding test cases for a well-understood function',
          'Choosing next quarter\'s product priorities',
        ],
        answer: 2,
        explanation: 'Scaffolding tests for code whose behaviour you understand is repetitive work you can check. The others depend on knowledge and authority the tool does not have.',
      },
      {
        id: 'experienced-01-q4',
        prompt: 'Which statement about AI coding tools is the most accurate?',
        choices: [
          'They replace the need for code review',
          'They only help junior developers',
          'They never make mistakes in popular languages',
          'They produce plausible code quickly but can be confidently wrong',
        ],
        answer: 3,
        explanation: 'Plausible but wrong output is the core risk. That is why verification stays your job.',
      },
      {
        id: 'experienced-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is the main risk of using an AI coding assistant that this lesson stresses?',
        choices: [
          "It refuses to write code for anyone who has less than a year of experience with programming",
          "It can write code that looks right but is wrong, while sounding sure",
          "It copies another developer's project word for word every time you ask it for something",
          "It can only write code in programming languages that are no longer maintained by anyone",
        ],
        answer: 1,
        explanation: 'The assistant produces plausible code quickly, with the same confident tone whether it is right or wrong. That is why a person still has to check what it writes.',
      },
      {
        id: 'experienced-01-q6',
        audience: { min: 'advanced' },
        prompt: 'After a team adopts an AI assistant, merged pull requests per week rise by 35%. Which extra evidence best shows whether delivery actually improved?',
        choices: [
          "A survey asking developers how much faster they feel they are working with the tool",
          "The vendor's published benchmark results on public coding tasks, run by the vendor",
          "The number of lines of code merged each week, which should have risen along with merges",
          "Change fail rate and rework over the same weeks, next to lead time",
        ],
        answer: 3,
        explanation: 'Throughput alone can rise while quality falls. Pairing lead time with instability measures such as change fail rate and rework shows whether the extra speed came with extra failures. Feelings, vendor benchmarks and line counts are not delivery outcomes.',
      },
    ],
    task: {
      title: 'Write your starting point',
      minutes: 15,
      steps: [
        'List ten tasks you did in the last two weeks (for example: fixed a bug, wrote a migration, reviewed a PR, wrote docs).',
        'Mark each one "AI might help", "AI is risky here" or "not sure".',
        'Paste the prompt above into an AI assistant you are allowed to use (no company code yet) and compare its list with yours.',
        'Save a short note with your current opinion of AI coding tools. You will reread it on day 20.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Write one sentence each, in your own words, for what an AI coding assistant, a codebase and boilerplate are. Then ask any AI chat to explain each in one sentence and compare.",
          "Pick one tiny thing you would like built, such as a page listing your shop's prices. Write down one way the result could look right and still be wrong.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Choose the delivery measures you would track in a trial, at least one throughput measure and one instability measure, and write the result that would make you stop the trial before you begin.",
          "Pull lead time and rework for your team's last 20 merged changes and list what else changed in that period, so you know what you could not attribute to AI.",
        ],
      },
    ],
  },
  {
    id: 'experienced-02',
    day: 2,
    title: 'Your company\'s AI policy and code privacy',
    summary: 'Know what you may share, with which tool, under which account, before you paste a single line.',
    intro: {
      objectives: [
        'List the questions to answer before pasting any work code into an AI tool',
        'Decide what to do when a policy or a contract says nothing about AI',
        'Keep personal data and secrets out of prompts, and react correctly when a key leaks',
      ],
      why: 'The code and data you work with usually belong to your employer or client, so one careless paste can breach a contract, the Data Privacy Act or your job. Knowing the rules first protects you as much as the company.',
    },
    minutes: 15,
    skills: ['review-security', 'team-impact'],
    body: [
      { type: 'paragraph', text: "Before you paste a single line of work code into an AI tool, know the rules. Source code is often your employer's or client's most valuable asset. Many companies now have an AI usage policy. Some ban external tools, some approve one tool under an enterprise agreement, and some have nothing written down yet. 'Nothing written' is not the same as 'allowed'." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Why be so careful? The code you work on usually belongs to someone else, such as your employer or a client, even though you typed it. **Pasting** it into an AI tool sends a copy to a company's servers. A **policy** is just the written rules about what you may do. A **secret** is anything that works like a password, such as an API key (a long code that lets a program use a service as you). **Personal data** is anything that identifies a real person, like a name next to a phone number. Until you know the rules, practise on made-up examples and on code you wrote for yourself. 'AI Coding Best Practices' goes deeper on safe habits.",
      },
      { type: 'heading', text: 'Questions to answer first' },
      { type: 'list', items: [
        'Which AI tools are approved for company code, and which are not?',
        'Under which account: a company-managed one, or your personal one?',
        'Does the vendor agreement say your prompts and code are not used for training, and how long are they kept?',
        'Are some repositories or data off limits even with an approved tool (payments, health records, customer data)?',
        'Must AI-assisted work be disclosed in commits or pull requests?',
        'Who do you ask when you are not sure?',
      ] },
      { type: 'paragraph', text: 'If you freelance, or work for a foreign client through OnlineJobs.ph or a staffing agency, your contract and NDA usually decide this. Read them. If they say nothing about AI, ask the client in writing before you use an AI tool on their code, and keep the reply.' },
      { type: 'heading', text: 'Personal data is a separate risk' },
      { type: 'paragraph', text: 'Code is one risk. Data is another. Logs, database dumps, support tickets and test fixtures often hold names, phone numbers, addresses or GCash reference numbers. In the Philippines the Data Privacy Act sets rules for processing personal information, and many companies have a Data Protection Officer. The safe habit is simple: do not paste real personal data into AI tools. Use made-up or masked samples instead. For anything specific, confirm with your DPO or the National Privacy Commission rather than relying on a chatbot\'s reading of the law.' },
      { type: 'warning', text: 'Never paste secrets: API keys, passwords, private keys, `.env` files or connection strings. If one ends up in a prompt by accident, treat it as leaked and rotate it. Deleting the chat is not enough.' },
      { type: 'heading', text: 'Settings that matter' },
      { type: 'paragraph', text: 'Many assistants let you or an admin exclude files and folders from what the tool can read. Check your tool\'s documentation for its exclusion or ignore setting and use it for secrets, credentials and sensitive folders. Also check whether chat history is stored, whether code snippets are sent as telemetry, and whether the tool can run terminal commands without asking you first.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-02-match-1',
          kind: 'match',
          title: 'Rules before the first paste',
          prompt: 'Match each situation to what the lesson says to do.',
          concept: 'ai policy and code privacy',
          pairs: [
            {
              term: 'Your company has no written AI policy',
              definition: 'Not the same as "allowed": ask before using AI on company code.',
            },
            {
              term: 'Your freelance contract says nothing about AI',
              definition: 'Ask the client in writing before using an AI tool on their code, and keep the reply.',
            },
            {
              term: 'Logs, database dumps and test fixtures',
              definition: 'They often hold personal data: use made-up or masked samples instead.',
            },
            {
              term: 'An API key ends up in a prompt by accident',
              definition: 'Treat it as leaked and rotate it. Deleting the chat is not enough.',
            },
            {
              term: 'Files and folders with secrets',
              definition: 'Use your tool\'s exclusion or ignore setting so it cannot read them.',
            },
          ],
          hints: [
            'Silence is not permission.',
            'Real records can hold names, phone numbers and GCash reference numbers.',
            'Once a secret has left your control, only replacing it fixes the problem.',
          ],
          explanation: 'Before pasting code, know the rules, ask in writing when they are missing, keep personal data and secrets out, and use exclusions for sensitive folders.',
        },
      },
      { type: 'prompt', label: 'Turn a policy into a checklist', text: 'Here is my company\'s AI usage policy, with names removed: [paste policy]. Turn it into a short checklist a developer can follow day to day: which tools are allowed, which code and data I must not share, what I must disclose, and who to ask. Then list anything ambiguous that I should clarify with my manager.' },
      { type: 'tip', text: 'If your company has no policy yet, offer to draft a first version with your lead. It is a visible, senior contribution, and it protects you too.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "A policy only works as controls. Classify data (public, internal, confidential, regulated), map each class to the tools and accounts allowed to see it, and enforce the map where people cannot forget it: an approved business workspace instead of personal accounts, repository secret scanning, tool-level exclusions for sensitive paths, and an audit trail. Secret scanning shows why you layer. GitHub's push protection blocks a push that contains a detected secret, but it is off by default at repository level and, unless an administrator restricts bypass, anyone with write access can bypass it by giving a reason, so it is a net, not a wall. Ask vendors the contractual questions as well as the settings ones: retention, training use on your plan, sub-processors, region and breach notice. Then write the exception path, so people have a fast legitimate route instead of a shadow one.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "GitHub's documentation says push protection blocks pushes that contain secrets such as hardcoded credentials. Repository-level push protection is disabled by default and must be turned on by an administrator. By default anyone with write access can bypass a block by giving a reason, each bypass is logged, and administrators can restrict bypass to designated people. User-level push protection, enabled by default for individual accounts, covers pushes to public repositories.",
        checked: CHECKED,
        sources: [SRC.pushProtection],
      },
      {
        type: 'takeaways',
        items: [
          'Source code is often your employer\'s or client\'s most valuable asset: know the policy before you paste.',
          '"Nothing written" is not the same as "allowed". Ask, and get the answer in writing.',
          'Do not paste real personal data; use made-up or masked samples.',
          'Never paste secrets. If one leaks into a prompt, rotate it.',
          'Use your tool\'s file exclusions, and check history, telemetry and whether it can run commands unasked.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-02-q1',
        prompt: 'Your company has no written AI policy. What is the safest reading?',
        choices: [
          'Ask before using AI tools on company code, and get the answer in writing',
          'Any tool is fine because nothing forbids it',
          'Only free tools are allowed',
        ],
        answer: 0,
        explanation: 'Silence is not permission. A written answer protects both you and the company.',
      },
      {
        id: 'experienced-02-q2',
        prompt: 'You accidentally pasted an API key into an AI chat. What should you do?',
        choices: [
          'Ask the assistant to forget it',
          'Delete the chat and move on',
          'Rotate the key and treat it as leaked',
        ],
        answer: 2,
        explanation: 'You cannot be sure where the prompt was stored or logged. Rotating the key is the only reliable fix.',
      },
      {
        id: 'experienced-02-q3',
        prompt: 'You need sample data to debug an issue with an AI assistant. What is the safe habit?',
        choices: [
          'Paste a real database dump so the AI sees the exact problem',
          'Use made-up or masked records that reproduce the issue',
          'Paste real data but remove the email column',
          'Paste only the GCash reference numbers',
        ],
        answer: 1,
        explanation: 'Masked or synthetic samples avoid sharing personal data, which the Data Privacy Act and most company policies restrict.',
      },
      {
        id: 'experienced-02-q4',
        audience: { max: 'beginner' },
        prompt: 'Which of these is a "secret" that should never go into an AI chat?',
        choices: [
          "The name of the programming language your project uses, which is public information anyway",
          "The title of a bug ticket in your team's tracker, such as 'Login page is slow'",
          "A question about how a loop works in the language you are learning",
          "A password or API key stored in a file called `.env`",
        ],
        answer: 3,
        explanation: 'A password or API key works like a key to a door: whoever has it can act as you. The other choices reveal nothing that can be misused.',
      },
      {
        id: 'experienced-02-q5',
        audience: { min: 'advanced' },
        prompt: 'Why is repository secret scanning not a substitute for the rule that client code stays out of personal AI accounts?',
        choices: [
          "It is switched on automatically for every repository, so no extra rule about accounts is needed at all",
          "It rewrites Git history to remove any secret it finds, which makes the account rule redundant for everyone",
          "It acts on pushes and can be bypassed with a reason, so it cannot control what gets pasted into a chat",
          "It only works for public repositories, so private client code is never scanned by it at all",
        ],
        answer: 2,
        explanation: 'Push protection acts on pushes, is off by default at repository level and can be bypassed by anyone with write access unless an administrator restricts it. It is a useful net, but it does not see a chat window.',
      },
    ],
    task: {
      title: 'Know your rules',
      minutes: 15,
      steps: [
        'Find your company\'s AI policy (intranet, handbook, or ask your lead). If you freelance, reread your contract and NDA.',
        'Write down which tools and accounts are approved, and what is off limits.',
        'Open your AI tool\'s settings or docs and find how to exclude files. Exclude `.env` files and any secrets folder.',
        'Write three questions to clarify with your manager or client, and send at least one.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "List five things on your own computer that count as secrets or personal data, such as a password file or a friend's phone number. Write a safe fake for each that you could paste into an AI chat.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Draft a one-page data classification table for your team's repositories: four classes, which AI tools and accounts may see each, and who approves exceptions.",
          "Check whether push protection is on for one repository you maintain, and record who can bypass it and where a bypass would be logged.",
        ],
      },
    ],
  },
  {
    id: 'experienced-03',
    day: 3,
    title: 'Choosing and configuring an AI coding assistant',
    summary: 'Pick one approved tool, set it up so it asks before acting, and give it a fair two-week trial.',
    intro: {
      objectives: [
        'Tell inline completion, editor chat and agentic tools apart and pick a first use for each',
        'Choose a tool by approval, context, privacy and permission controls',
        'Set up approval prompts and file exclusions before the first real task',
        'Run a fair two-week trial using the same three tasks',
      ],
      why: 'The tool you pick and how you set it up decide how far you can trust it later. Fifteen minutes of setup now saves you from your first bad surprise.',
    },
    minutes: 15,
    skills: ['ai-workflow', 'context-prompting'],
    body: [
      { type: 'paragraph', text: "There are many AI coding tools and they change every month, so this lesson is about how to choose, not which logo to pick. Tools such as GitHub Copilot, Cursor or Claude Code are examples; your company may have approved one of these or something else. Start with what is approved. A great tool you are not allowed to use is no tool at all." },
      { type: 'heading', text: 'Three kinds of help' },
      { type: 'list', items: [
        '**Inline completion:** suggestions as you type in the editor. Low effort, good for boilerplate, easy to accept without thinking.',
        '**Chat in the editor:** you ask questions about selected code or files and get answers or edits back.',
        '**Agentic tools:** in the editor or the terminal, they read the repository, edit several files, run commands and tests, and report back. Most powerful, and the one that most needs guardrails.',
      ] },
      { type: 'paragraph', text: 'Many tools now offer all three. You do not need to use all three on day one. A common path for experienced developers is chat first (ask about code you are reading), then agentic work on small, well-tested tasks.' },
      {
        type: 'table',
        headers: ['Kind', 'What it does', 'Good first use'],
        rows: [
          [
            'Inline completion',
            'Suggests code as you type in the editor',
            'Boilerplate; easy to accept without thinking',
          ],
          [
            'Chat in the editor',
            'Answers questions or makes edits about selected code or files',
            'Asking about code you are reading',
          ],
          [
            'Agentic tools',
            'Reads the repository, edits several files, runs commands and tests',
            'Small, well-tested tasks, with guardrails',
          ],
        ],
        caption: 'Three kinds of help',
      },
      {
        type: 'activity',
        activity: {
          id: 'experienced-03-match-1',
          kind: 'match',
          title: 'Which kind of help?',
          prompt: 'Three moments from your week. Match each one with the kind of AI help that fits it.',
          concept: 'ai coding assistant types',
          labels: { terms: 'What you want', meanings: 'Kind of help' },
          pairs: [
            {
              term: 'You are writing the fifth near-identical serializer class and want the next lines suggested as you type.',
              definition: 'Inline completion',
            },
            {
              term: 'You select an unfamiliar 80-line function in a legacy module and ask why it retries twice.',
              definition: 'Chat in the editor',
            },
            {
              term: 'You want a config option renamed across twelve files, the test suite run, and a report of what changed.',
              definition: 'Agentic tool',
            },
          ],
          hints: [
            'One kind helps while you type, one answers questions about code you point at, and one acts on the repository.',
            'Boilerplate is the classic job for suggestions as you type.',
            'Editing many files and running commands is the most powerful kind, and the one that most needs guardrails.',
          ],
          explanation: 'Repetitive boilerplate suits inline completion, a question about selected code suits chat in the editor, and a change across many files with tests run suits an agentic tool, with approval prompts on.',
        },
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Here are the three kinds of help in everyday words. **Inline completion** is like your phone's autocomplete, but for code: it guesses the next lines as you type. **Chat in the editor** is a conversation beside your code: you ask 'what does this do?' and it answers. An **agentic tool** is closer to a helper who can open files, make changes and run commands while you watch, so it needs the tightest rules. The **editor** is the program you write code in, and the **terminal** is a text window where you type commands. If these are new, start with chat and read every answer before you accept it. 'Coding with AI for Complete Beginners' walks you through a first tool step by step.",
      },
      { type: 'heading', text: 'What to check when choosing' },
      { type: 'list', items: [
        'Approved by your company or client, under the right account.',
        'Works in your editor and with your languages and frameworks.',
        'Can read project context: the files you point it to and a repository instructions file.',
        'Privacy controls: file exclusions, data retention, training opt-out.',
        'Permission controls: it asks before editing files or running commands, and you can see every change as a diff.',
      ] },
      { type: 'heading', text: 'Set it up for control' },
      { type: 'paragraph', text: "Turn on approval prompts for terminal commands and file edits, at least at first. Exclude secrets and sensitive folders. Learn the shortcuts to accept, reject and undo. If inline suggestions distract you while you think, switch them off in comments and Markdown, or switch them off entirely for a day and see how it feels. Configuration is personal; there is no prize for leaving every feature on." },
      { type: 'tip', text: 'Give one tool a fair two-week trial before you judge it. The first days are slow for everyone because you are learning how to ask, not just what to ask.' },
      { type: 'heading', text: 'A fair trial' },
      { type: 'paragraph', text: 'Use the same three tasks to test any tool: explain a module you know well (you can judge the answer), write tests for a small function, and make a small change across two files. If it gets your own module wrong, you have learned how much to trust it on code you do not know.' },
      { type: 'prompt', label: 'First conversation with a new tool', text: 'You are helping me on this repository. Read the project structure and the README, then explain in under 200 words: what this project does, the main folders and what each is for, how to run it, and how to run the tests. List any file you could not read or anything you are guessing about. Do not change any files.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat the tool choice as an architecture decision with an exit. Keep what you build portable: instructions in plain-text files several tools read, integrations over open protocols, and prompts that do not lean on one vendor's quirks. MCP is an open standard for connecting AI applications to external data sources, tools and workflows, and many assistants and editors support it, so an integration written once is not tied to one product. Evaluate on your own repository with a fixed task set (a read-only explanation, a test for a small function, a two-file change), the same tasks for every candidate, scored for correctness, review effort and cost. Then inspect the control surface: can an administrator enforce permission rules, which rule wins when two disagree, can you scope what an agent may run, and can you export logs?",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "The official MCP documentation describes MCP as an open-source standard for connecting AI applications to external systems such as data sources, tools and workflows, supported by a wide range of clients and servers. Claude Code's permission documentation says rules are evaluated in the order deny, then ask, then allow, and the first match decides, so a broad deny cannot be overridden by a narrower allow. Other tools use different models, so read your tool's documentation.",
        checked: CHECKED,
        sources: [SRC.mcp, SRC.ccPermissions],
      },
      {
        type: 'takeaways',
        items: [
          'Start with the tool your company or client has approved.',
          'Three kinds of help: inline completion, chat in the editor, and agentic tools. Agentic tools most need guardrails.',
          'Turn on approval prompts for edits and commands, exclude secrets, and learn accept, reject and undo.',
          'Give one tool a fair two-week trial on the same three tasks.',
          'Test it first on code you know well, so you can judge its answers.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-03-q1',
        prompt: 'What should decide which AI coding tool you use for work code first?',
        choices: [
          'Which one has the most features',
          'Which one your company or client has approved',
          'Which one is most popular online',
        ],
        answer: 1,
        explanation: 'An unapproved tool can break policy or a contract no matter how good it is.',
      },
      {
        id: 'experienced-03-q2',
        prompt: 'Why is explaining a module you already know well a good first test of a tool?',
        choices: [
          'Because you can judge whether the explanation is right',
          'Because the tool is faster on familiar code',
          'Because it avoids using any context',
          'Because it generates the most code',
        ],
        answer: 0,
        explanation: 'Testing on code you understand shows you how accurate the tool is before you rely on it for code you do not know.',
      },
      {
        id: 'experienced-03-q3',
        prompt: 'Which setting matters most when you start using an agentic tool?',
        choices: [
          'Dark mode',
          'Auto-accept for all edits so it runs faster',
          'Approval prompts before it edits files or runs commands',
        ],
        answer: 2,
        explanation: 'Agentic tools can change many files and run commands. Approving each action keeps you in control while you learn how it behaves.',
      },
      {
        id: 'experienced-03-q4',
        audience: { max: 'beginner' },
        prompt: 'Which kind of AI help acts most like a helper who can open files, change them and run commands for you?',
        choices: [
          "Inline completion, which suggests the next words of code as you type them in the editor",
          "Chat in the editor, which answers questions about code that you select and point at",
          "An agentic tool, which can read a project, edit files and run commands",
          "A spell-checker, which only looks at the comments you write above your code",
        ],
        answer: 2,
        explanation: 'An agentic tool is the kind that takes actions in your project. That is also why it is the one that most needs approval prompts and limits.',
      },
      {
        id: 'experienced-03-q5',
        audience: { min: 'advanced' },
        prompt: 'You are comparing three assistants for a team of twelve. Which evaluation design is most defensible?',
        choices: [
          "Each developer picks a tool and everyone compares how much they liked it after one week of use",
          "Run the same fixed tasks on your repository with each tool and score the results",
          "Choose the tool whose documentation lists the longest and most impressive set of features",
          "Pick whichever tool ranks highest on a public coding benchmark that the vendor links to from its site",
        ],
        answer: 1,
        explanation: 'A fixed task set on your own code gives a like-for-like comparison on the things you care about. Preferences, feature lists and vendor benchmarks do not say how a tool behaves on your codebase.',
      },
    ],
    task: {
      title: 'Set up your assistant',
      minutes: 20,
      steps: [
        'Install or open the AI assistant your company or client has approved (or a personal one on a personal project).',
        'Turn on approval prompts for file edits and commands, and exclude secrets and `.env` files.',
        'Run the first-conversation prompt above on a repository you know well.',
        'Note two things it got right and one thing it got wrong or vague.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Open your editor and find where its AI features live. Turn on a setting that asks you before it changes a file, then write one sentence on what each of the three kinds of help would do for you.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Write a six-task evaluation sheet for two candidate tools: same tasks, same repository, and columns for correctness, review minutes and cost. Run it on one tool.",
          "List which controls (approval rules, exclusions, logs) you would need an administrator to enforce, and check in the tool's documentation whether it can.",
        ],
      },
    ],
  },
  {
    id: 'experienced-04',
    day: 4,
    title: 'Context is everything: instructions files and conventions',
    summary: 'Write down what a new teammate would need to know, so the assistant follows your conventions instead of guessing.',
    intro: {
      objectives: [
        'Write a short repository instructions file with stack, commands, conventions and do-nots',
        'Build a request from goal, where, constraints, example and done means',
        'Decide when a repeated mistake belongs in the instructions file',
      ],
      why: 'Most bad AI output is a context problem, and you are the one who has the context. Writing it down once makes every later request, and every tool on your team, follow your conventions.',
    },
    minutes: 15,
    skills: ['context-prompting', 'ai-workflow'],
    body: [
      { type: 'paragraph', text: "Most bad AI output is a context problem. The tool does not know that money is stored in centavos, that you never edit an applied migration, or that the team hates new dependencies. You know. The fix is to write it down where the tool will read it every time." },
      { type: 'heading', text: 'Repository instructions files' },
      { type: 'paragraph', text: "Most assistants read a Markdown file of project instructions from the repository. The file name depends on the tool: examples include `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` or a rules folder. Check your tool's documentation for the exact name. Keep it short and specific: a long file of vague advice gets ignored by people and tools alike." },
      { type: 'code', language: 'markdown', label: 'A starter instructions file', code: `# Notes for AI assistants

## Stack
- Python 3.12, Django, PostgreSQL
- Frontend: TypeScript and React

## Commands
- Run tests: pytest
- Lint: ruff check .
- Type check: mypy src

## Conventions
- Money is stored as integer centavos, never floats.
- Database access goes through the repository classes in src/repos/.
- Every new endpoint needs a test in tests/api/.

## Do not
- Do not edit migrations that have been applied; add a new one.
- Do not add dependencies without asking first.
- Do not touch files in src/legacy/billing/ unless the task says so.` },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Think of an instructions file as the 'welcome, here is how we do things' note you would give a new teammate on their first day. It is just a text file in your project. **Markdown** means plain text with simple marks, such as `#` for a heading and `-` for a list item. The assistant reads the file before it starts, so you do not have to repeat yourself. Read the example line by line: **Stack** names the tools the project uses, **Commands** says how to run the checks, **Conventions** are the habits to follow, and **Do not** lists things never to touch. Centavos are the smallest unit of Philippine money (100 centavos make a peso). Storing money as whole numbers avoids tiny rounding mistakes.",
      },
      { type: 'paragraph', text: "Notice what goes in: how to run and check things, the rules that are not obvious from the code, and the places that need extra care. Leave out what any developer can see by reading the code. Commit the file so the whole team, and every tool, uses the same rules." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-04-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the instructions file',
          prompt: 'Fill in the blanks so these rules match the starter instructions file above.',
          concept: 'repository instructions files',
          language: 'markdown',
          code: '## Conventions\n- Money is stored as integer ___, never floats.\n- Database access goes through the repository classes in ___.\n## Do not\n- Do not edit migrations that have been ___; add a new one.',
          blanks: [
            {
              answers: ['centavos'],
            },
            {
              answers: ['src/repos/'],
            },
            {
              answers: ['applied'],
            },
          ],
          bank: ['centavos', 'src/repos/', 'applied', 'pesos', 'src/legacy/', 'deleted'],
          hints: [
            'The first rule is the one the assistant kept getting wrong in the lesson.',
            'The repository classes live in a folder named after what they hold.',
            'A migration that has already run must not be edited; you add a new one instead.',
          ],
          explanation: 'These rules are not obvious from the code, which is exactly what belongs in an instructions file. Writing them down once means the tool reads them on every request.',
        },
      },
      { type: 'heading', text: 'Context in each request' },
      { type: 'paragraph', text: 'The instructions file covers the project. Each request still needs its own context. A good request has five parts:' },
      { type: 'list', ordered: true, items: [
        '**Goal:** what should be true when you are done.',
        '**Where:** the files or functions involved.',
        '**Constraints:** what must not change (public API, database schema, behaviour).',
        '**Example:** a similar piece of code in the repo to copy the style from.',
        '**Done means:** the tests, lint and type checks that must pass.',
      ] },
      { type: 'prompt', label: 'A request with full context', text: 'Goal: add a `discount_centavos` field to the order summary response. Where: src/api/orders.py and src/repos/orders.py. Constraints: do not change the database schema or any existing field names. Follow the style of the `shipping_centavos` field, which already works the same way. Done means: pytest tests/api/test_orders.py passes and ruff check . is clean. First tell me your plan in a few bullet points and wait for my OK.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-04-match-1',
          kind: 'match',
          title: 'The five parts of a request',
          prompt: 'A teammate wrote a request for an assistant. Match each line with the part of a good request it supplies.',
          concept: 'context for ai requests',
          labels: { terms: 'Lines from a teammate\'s request', meanings: 'Part of the request' },
          pairs: [
            {
              term: 'When an account is locked, the login endpoint returns 403 with the message "Account locked" instead of a 500 error.',
              definition: 'Goal',
            },
            {
              term: 'src/auth/login.ts and the handler in src/routes/auth.ts',
              definition: 'Where',
            },
            {
              term: 'Do not change the response for successful logins or the users table.',
              definition: 'Constraints',
            },
            {
              term: 'Handle it the way the "email not verified" case is handled in the same file.',
              definition: 'Example',
            },
            {
              term: 'npm test -- auth passes and npm run lint is clean.',
              definition: 'Done means',
            },
          ],
          hints: [
            'Ask of each line: is it the outcome, a location, a limit, a model to copy, or a check?',
            'File paths answer "where"; "Do not change…" lines are constraints.',
            'A similar case already in the code is the example; commands that must pass are "done means".',
          ],
          explanation: 'The new behaviour is the goal, the file paths are where, what must not change are constraints, the "email not verified" case is the example to copy, and the passing commands are done means, so the assistant has nothing to guess.',
        },
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "If you have built small projects, you already own what an instructions file needs: the commands you type to run, test and build, and the mistakes you keep repeating. Start there instead of from a template. Open your last project, copy the three commands you run most into a Commands section, and add one Do not line for the mistake that cost you the most time. Keep it short enough to read in a minute. If it grows past one screen, ask which lines the assistant could learn by reading the code, and delete those.",
      },
      { type: 'tip', text: 'Every time the assistant makes the same mistake twice, add one line to the instructions file. After a few weeks it reads like a senior teammate\'s onboarding notes.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Context engineering is deciding what the model sees at each step. The context window is a finite resource and recall quality falls as it fills, so the aim is the smallest set of high-signal information, not the largest. Layer it. Keep a short always-loaded file for facts true everywhere: commands, layout, hard rules. Move area-specific rules into scoped files that load only when matching files are touched, and procedures into on-demand mechanisms. Prefer pointers over pastes (paths, queries, links), let the agent retrieve just in time, and have long tasks write notes to a file instead of leaning on a long chat. Look for contradictions between layers, because conflicting instructions may be resolved arbitrarily. And remember that instructions are context, not enforcement: anything that must never happen belongs in a permission rule or a hook.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "File names and loading rules differ by tool. Claude Code's documentation recommends under 200 lines per CLAUDE.md, loads CLAUDE.md files in subdirectories on demand, supports path-scoped rules in `.claude/rules/`, can read a repository's `AGENTS.md`, and says its memory is context rather than enforced configuration. GitHub Copilot reads `.github/copilot-instructions.md`, path-specific `*.instructions.md` files with an `applyTo` pattern, and `AGENTS.md` files, where the nearest one takes precedence. Codex concatenates `AGENTS.md` files from the project root down to the working directory and stops adding files at a combined 32 KiB by default (`project_doc_max_bytes`).",
        checked: CHECKED,
        sources: [SRC.ccMemory, SRC.copilotInstructions, SRC.codexAgentsMd, SRC.contextEng],
      },
      {
        type: 'takeaways',
        items: [
          'Most bad AI output is a context problem: write down what a new teammate would need to know.',
          'A short, specific instructions file covers how to run checks, non-obvious rules and risky areas.',
          'Each request needs its own goal, where, constraints, example and "done means".',
          'When the assistant repeats a mistake, add one line to the instructions file.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-04-q1',
        prompt: 'What belongs in a repository instructions file?',
        choices: [
          'A full copy of the codebase\'s documentation',
          'How to run checks, non-obvious rules, and areas that need extra care',
          'Your API keys so the tool can run integration tests',
        ],
        answer: 1,
        explanation: 'Short, specific rules the code does not show are what help. Secrets never belong in it.',
      },
      {
        id: 'experienced-04-q2',
        prompt: 'The assistant keeps using floats for money. What is the most lasting fix?',
        choices: [
          'Correct it by hand every time',
          'Stop using the assistant for money code forever',
          'Switch to a different programming language',
          'Add the centavos rule to the instructions file',
        ],
        answer: 3,
        explanation: 'Writing the rule down once means the tool reads it on every request.',
      },
      {
        id: 'experienced-04-q3',
        prompt: 'Why point the assistant to an existing example in the repo?',
        choices: [
          'So it copies your team\'s style and patterns instead of inventing its own',
          'So it can delete the old code',
          'Because tools cannot read new files',
        ],
        answer: 0,
        explanation: 'A concrete example is the fastest way to get code that fits the codebase.',
      },
      {
        id: 'experienced-04-q4',
        audience: { max: 'beginner' },
        prompt: 'What is an instructions file in a project?',
        choices: [
          "A text file that tells the assistant how your project works and its rules",
          "A program that installs the assistant on your computer so that it can start working",
          "A list of every password the assistant is allowed to use when it logs in for you",
          "A file that makes the project run faster by skipping slow steps while it builds",
        ],
        answer: 0,
        explanation: 'It is a plain text note, like a first-day note for a new teammate, that the assistant reads before it starts. Passwords never belong in it.',
      },
      {
        id: 'experienced-04-q5',
        audience: { min: 'advanced' },
        prompt: 'Your repository\'s instruction file has grown to 600 lines and the assistant often ignores rules near the end. What is the best fix?',
        choices: [
          "Write IMPORTANT in capitals before every rule so that the assistant treats them as urgent",
          "Move to a model with a longer context window and keep the file exactly as it is today",
          "Keep a short core file, move area rules into scoped files, and delete what the code shows",
          "Copy the same 600 lines into three different folders so the assistant meets them more often",
        ],
        answer: 2,
        explanation: 'Longer files use more context and reduce how reliably rules are followed. A short core plus scoped files keeps only relevant instructions loaded, and lines the code already shows add cost without value.',
      },
    ],
    task: {
      title: 'Write your instructions file',
      minutes: 20,
      steps: [
        'Find the file name your assistant reads for project instructions in its documentation.',
        'Write a first version with Stack, Commands, Conventions and Do not sections, under 40 lines.',
        'Ask the assistant to summarise the rules it now sees, and check it read them correctly.',
        'Give it one small task using the five-part request and note whether the output fits your conventions.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "In a practice folder, create an instructions file (use the name your tool reads) with Stack, Commands and Do not sections, three lines each. Ask the assistant to read it and say the rules back in its own words.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "List every instruction file your tool loads for one repository (user, project, subdirectory, scoped rules). Find two contradictions or stale lines, and move one area-specific section into a scoped file.",
          "Pick a rule you cannot afford to have ignored and check that it is enforced by a permission rule or a hook, not only written in a file.",
        ],
      },
    ],
  },
  {
    id: 'experienced-05',
    day: 5,
    title: 'AI for reading legacy code',
    summary: 'Use the assistant as a fast, fallible guide through old code, and check every claim against the source and Git history.',
    intro: {
      objectives: [
        'Ask an assistant for a map of old code that you can check, with line numbers and an unsure list',
        'Use `git blame`, `git log --follow -p` and `git log --grep` to find why code exists',
        'Verify a claim that code is unused before deleting anything',
      ],
      why: 'Inherited code with no tests or docs is where many experienced developers first find AI useful, and where a confident wrong answer costs the most.',
    },
    minutes: 15,
    skills: ['context-prompting', 'safe-change'],
    body: [
      { type: 'paragraph', text: "Reading code is where many experienced developers first find AI genuinely useful. You inherit a ten-year-old module with no tests and no docs. An assistant can give you a map in minutes. The catch: a map drawn by someone who has never been there. It is often right about structure and often wrong about intent." },
      { type: 'heading', text: 'Ask for a map, not a verdict' },
      { type: 'list', items: [
        'What does this module do, and what are its entry points?',
        'Trace one request from the controller to the database and back.',
        'Which functions have side effects (writes, network calls, emails)?',
        'Where is the state, and who changes it?',
        'What looks unused, duplicated or dangerous?',
      ] },
      { type: 'prompt', label: 'Map a module', text: 'Read src/legacy/billing/ and explain it to an experienced developer who is new to this code. Give: (1) the purpose in two sentences, (2) entry points, (3) a step-by-step trace of how an invoice is created, with file names and line numbers, (4) side effects such as database writes, emails or external calls, and (5) a list of things you are unsure about or guessing. Do not suggest changes yet.' },
      { type: 'paragraph', text: "The line numbers and the 'unsure' list are the important parts. Line numbers let you check each claim quickly. The unsure list tells you where the tool is filling gaps with guesses, which it will otherwise do without warning." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "**Legacy code** is old code that people still depend on, often written by others and with no notes. **Git** is the tool that keeps every past version of a project, so you can ask who changed a line and when. The assistant can give you a quick **map**, like a sketch of a town drawn by a visitor: usually right about where the roads are, sometimes wrong about why they were built. That is why the lesson asks for file names and line numbers (so you can check each claim) and for a list of things the tool was unsure about. Never delete code just because the assistant says nothing uses it. 'Understanding AI-Generated Code' is a good companion.",
      },
      { type: 'heading', text: 'The why lives in history, not in the code' },
      { type: 'paragraph', text: "An assistant can tell you what a strange condition does. It usually cannot tell you why it exists, because the reason is in a ticket, a Slack thread or someone's memory. Git history is your best evidence. Use it before you trust any explanation of intent." },
      { type: 'code', language: 'bash', label: 'Find out why the code is the way it is', code: `# Who changed these lines last, and in which commit
git blame -L 120,160 src/legacy/billing/invoice.py

# Every change to the file, with the diffs, following renames
git log --follow -p -- src/legacy/billing/invoice.py

# Commits whose message mentions a word, for example a ticket key
git log --oneline --grep="VAT"` },
      { type: 'paragraph', text: 'You can paste a commit message and diff into the assistant and ask what problem the change was fixing. That is often more reliable than asking about the code alone, because the commit carries some of the original intent.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-05-match-1',
          kind: 'match',
          title: 'Ask Git why',
          prompt: 'Match each command to what it tells you.',
          concept: 'git history for legacy code',
          pairs: [
            {
              term: 'git blame -L 120,160 src/legacy/billing/invoice.py',
              definition: 'Who changed lines 120 to 160 last, and in which commit',
            },
            {
              term: 'git log --follow -p -- src/legacy/billing/invoice.py',
              definition: 'Every change to the file, with the diffs, following renames',
            },
            {
              term: 'git log --oneline --grep="VAT"',
              definition: 'Commits whose message mentions a word, such as a ticket key',
            },
          ],
          hints: [
            'One command looks at lines, one at the whole file, one at commit messages.',
            '`-p` shows the patch, and `--follow` keeps going through renames.',
            '`--grep` searches commit messages.',
          ],
          explanation: 'The reason code exists is usually in a commit, a ticket or someone\'s memory, not in the code. Git history is your best evidence before you trust an explanation of intent.',
        },
      },
      { type: 'warning', text: 'Do not delete code because the assistant called it unused. Search for dynamic calls, reflection, cron jobs, config files and other repositories first. Old systems hide callers in odd places.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-05-scenario-1',
          kind: 'scenario',
          title: 'Unused, says the assistant',
          prompt: 'What do you do with the assistant\'s claim?',
          concept: 'verifying ai claims about code',
          situation: 'The assistant maps src/legacy/billing/ and says the function apply_late_fee() is unused and safe to delete. Nothing in this repository calls it by name.',
          options: [
            {
              text: 'Delete it: nothing calls it.',
              consequence: 'It may still be called from a scheduled job, a config file, reflection or another repository, which reading this repo cannot show.',
              quality: 'poor',
            },
            {
              text: 'Ask the assistant again until it also says it is unused.',
              consequence: 'Asking again is not a check. It repeats the same blind spot.',
              quality: 'poor',
            },
            {
              text: 'Search for dynamic calls, config, cron jobs and other repositories, and check Git history, before deciding.',
              consequence: 'Old systems hide callers in odd places. This is how you find them before you delete anything.',
              quality: 'best',
            },
            {
              text: 'Leave it in forever and never ask about it again.',
              consequence: 'Nothing breaks, but you keep dead code you never confirmed was dead.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Static reading of one repository can miss callers.',
            'Where could a call hide that is not a normal function call?',
            'Look at dynamic calls, configuration, scheduled jobs and other repositories.',
          ],
          explanation: 'The assistant is a fast, fallible guide. Verify claims against the source and history before you act, especially before you delete.',
        },
      },
      { type: 'tip', text: 'Ask the assistant to draw the flow as a Mermaid diagram or a plain numbered list, then correct it as you read. Correcting a draft is faster than writing from nothing, and the corrected version becomes documentation.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "At scale, do not paste the module. Let an agent explore with search and read only what it needs, then keep the result as a reviewed note in the repository so the next person starts from your corrections. Use history as evidence in more ways than blame. `git blame -w -C -C -C` ignores whitespace and follows lines moved or copied from other files, `--ignore-revs-file` (or `blame.ignoreRevsFile`) skips mass-reformat commits, `git log -S` finds commits that change how often a string occurs, `-G` finds commits whose diff lines match a regex, and `git log -L :function:file` traces one function. Before changing behaviour, write characterisation tests that pin today's outputs, bugs included, and label them. Then change in small, reversible steps, using expand and contract (add the new path, migrate callers, remove the old) for interfaces that others call.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Checked against the current Git manual pages. `git blame -w` ignores whitespace when comparing versions, each extra `-C` widens the search for moved or copied lines (three look in files from any commit), and `--ignore-revs-file` or the `blame.ignoreRevsFile` setting names commits that blame treats as if they never happened. `git log -S<string>` selects diffs that change the number of occurrences of a string, `-G<regex>` selects diffs with added or removed lines that match a regex, and `-L :<funcname>:<file>` traces the history of a function.",
        checked: CHECKED,
        sources: [SRC.gitBlame, SRC.gitLog, SRC.gitDiffOptions],
      },
      {
        type: 'takeaways',
        items: [
          'AI gives a fast map of old code: right about structure, often wrong about intent.',
          'Ask for a map with file names and line numbers, and an "unsure" list, so you can check each claim.',
          'The why lives in Git history, tickets and people; use blame and log before you trust an explanation.',
          'Never delete code just because the assistant called it unused.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-05-q1',
        prompt: 'Why ask the assistant for file names and line numbers in its explanation?',
        choices: [
          'So you can quickly check each claim against the source',
          'Because it makes the answer longer',
          'Because Git requires line numbers',
        ],
        answer: 0,
        explanation: 'References turn a confident summary into something you can verify in seconds.',
      },
      {
        id: 'experienced-05-q2',
        prompt: 'Where is the best evidence for why an odd piece of legacy code exists?',
        choices: [
          'The assistant\'s best guess',
          'The variable names alone',
          'Git history, linked tickets and the people who wrote it',
          'The newest Stack Overflow answer',
        ],
        answer: 2,
        explanation: 'Intent is rarely in the code itself. Commits, tickets and people hold the reasons.',
      },
      {
        id: 'experienced-05-q3',
        prompt: 'The assistant says a function is unused. What do you do?',
        choices: [
          'Delete it right away',
          'Search for dynamic callers, config, scheduled jobs and other repos before deciding',
          'Ask the assistant again until it agrees',
        ],
        answer: 1,
        explanation: 'Static reading misses callers that are found at runtime, in config or in other systems.',
      },
      {
        id: 'experienced-05-q4',
        audience: { max: 'beginner' },
        prompt: 'An assistant tells you nobody uses a function in your old project. What should you do before deleting it?',
        choices: [
          "Delete it, because the assistant has already read all of the code in your project",
          "Ask the assistant to say it again, but more confidently, and then delete the function",
          "Search for other places that might call it, and look at the project history first",
          "Rename it and see whether anything breaks over the next week, then decide",
        ],
        answer: 2,
        explanation: 'An assistant reading one project can miss callers in settings, schedules or other projects. Checking yourself, and reading the history, is how you avoid deleting something that is still needed.',
      },
      {
        id: 'experienced-05-q5',
        audience: { min: 'advanced' },
        prompt: 'You need to find when a retry constant was introduced, but a recent commit reformatted every file. Which approach finds the real origin?',
        choices: [
          "Run `git blame` on the file and take the commit it shows at the top as the real origin of the constant",
          "Ask the assistant why the constant exists, since it has read the code, and quote its explanation",
          "Run `git log` with no options and read the most recent entry, which must be the relevant one",
          "Run `git blame -w`, ignoring the reformat commit, and read the commit that added the line",
        ],
        answer: 3,
        explanation: 'Ignoring whitespace and the mass-reformat commit lets blame point at the commit that really changed the line. Plain blame would credit the reformat, and the assistant cannot know the reason from the code alone.',
      },
    ],
    task: {
      title: 'Map one old module',
      minutes: 20,
      steps: [
        'Pick a module you do not know well in a repository you are allowed to use with your assistant.',
        'Run the map prompt and save the answer.',
        'Check three of its claims against the code and one against `git log` or `git blame`.',
        'Write down one thing it got wrong or guessed, and correct the map.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "In a practice project, run `git log --oneline` and pick one commit. Ask the assistant to explain it in plain words, then check its explanation against the real change with `git show <commit>`.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Pin one legacy function with characterisation tests. Then use `git log -L :function:file` and `git blame -w -C` to find the commit that introduced its oddest branch.",
          "Compare what you found with the assistant's guess about intent and record where they differ.",
        ],
      },
    ],
  },
  {
    id: 'experienced-06',
    day: 6,
    title: 'Refactoring with AI, safely',
    summary: 'Tests first, one kind of change at a time, small diffs you can review, and a commit after every green step.',
    intro: {
      objectives: [
        'Follow the safe loop: pin behaviour, one kind of change per step, run the checks, commit when green',
        'End a request with "and stop" to keep the diff small',
        'Treat a changed test assertion as a sign that behaviour changed',
        'Recover from a bad step with `git restore` instead of asking for a fix of the fix',
      ],
      why: 'Refactoring is where AI saves hours and also where it quietly breaks behaviour, so your habits for small, tested, reviewable changes matter more than before.',
    },
    minutes: 15,
    skills: ['safe-change', 'ai-workflow'],
    body: [
      { type: 'paragraph', text: "Refactoring is where AI can save real hours and also where it can quietly break things. The tool is happy to rewrite 600 lines in one go. You cannot review 600 lines of changed behaviour in one go. The rules you already follow for safe refactoring matter even more now." },
      { type: 'heading', text: 'The safe loop' },
      { type: 'list', ordered: true, items: [
        '**Pin the behaviour first.** If the code has no tests, write characterisation tests that record what it does today, bugs included. Day 7 covers this.',
        '**One kind of change per step.** Rename, or extract a function, or move a file. Never all three in one diff.',
        '**Keep the diff small.** Small enough that you can read every line and explain it.',
        '**Run the checks.** Tests, lint and type checks after every step.',
        '**Commit when green.** Each commit is a safe point you can return to.',
      ] },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "**Refactoring** means changing how code is organised without changing what it does, like tidying a kitchen without changing the menu. The safe loop is how you make sure the menu stayed the same. A **test** is a small program that checks the code still behaves as expected. A **branch** is a separate copy of your work in Git, so mistakes never touch the main version. A **diff** shows exactly which lines changed. 'One kind of change per step' just means: rename, or move, or split a function, never all at once, so that if something breaks you know which step did it.",
      },
      { type: 'prompt', label: 'One step at a time', text: 'We are refactoring src/legacy/billing/invoice.py. Do step 1 only: extract the VAT calculation inside `create_invoice` into a pure function `compute_vat(lines)` in the same file. Do not change behaviour, names of public functions, or any other part of the file. After the change, run pytest tests/billing and report the result. Then list every line you changed and stop.' },
      { type: 'paragraph', text: "Notice the 'and stop'. Without it, many tools keep going and 'improve' things you did not ask about. Scope creep is the most common way an AI refactor turns a 20-line change into a 400-line change." },
      { type: 'code', language: 'bash', label: 'Keep each step reviewable', code: `git switch -c refactor/extract-vat

# after each AI step
git diff --stat          # how big is this change?
git diff                 # read every line
pytest tests/billing     # still green?
git add -p               # stage only what you meant to change
git commit -m "Extract compute_vat from create_invoice"` },
      {
        type: 'activity',
        activity: {
          id: 'experienced-06-arrange-1',
          kind: 'arrange',
          title: 'A reviewable step',
          prompt: 'The assistant just made one refactor step. Put the commands in a sensible order: branch first, check the change, run the tests, stage only what you meant, then commit.',
          concept: 'safe refactoring',
          language: 'bash',
          solution: [
            'git switch -c refactor/extract-vat',
            'git diff --stat',
            'git diff',
            'pytest tests/billing',
            'git add -p',
            'git commit -m "Extract compute_vat from create_invoice"',
          ],
          alternatives: [
            [
              'git switch -c refactor/extract-vat',
              'git diff',
              'git diff --stat',
              'pytest tests/billing',
              'git add -p',
              'git commit -m "Extract compute_vat from create_invoice"',
            ],
            [
              'git switch -c refactor/extract-vat',
              'git diff --stat',
              'pytest tests/billing',
              'git diff',
              'git add -p',
              'git commit -m "Extract compute_vat from create_invoice"',
            ],
            [
              'git switch -c refactor/extract-vat',
              'git diff',
              'pytest tests/billing',
              'git diff --stat',
              'git add -p',
              'git commit -m "Extract compute_vat from create_invoice"',
            ],
            [
              'git switch -c refactor/extract-vat',
              'pytest tests/billing',
              'git diff --stat',
              'git diff',
              'git add -p',
              'git commit -m "Extract compute_vat from create_invoice"',
            ],
            [
              'git switch -c refactor/extract-vat',
              'pytest tests/billing',
              'git diff',
              'git diff --stat',
              'git add -p',
              'git commit -m "Extract compute_vat from create_invoice"',
            ],
          ],
          reasons: [
            'Work on a branch, never directly on main.',
            'First see how big the change is.',
            'Then read every line of it.',
            'Run the checks to see that it is still green.',
            'Stage only the changes you meant to make.',
            'Commit when green: each commit is a safe point.',
          ],
          hints: [
            'Everything you do after the first command happens on the branch.',
            'Checking comes before staging, and staging comes before committing.',
            'The size check, the full diff and the tests can come in any order, but all three come before `git add -p`.',
          ],
          explanation: 'A branch makes the work safe to abandon, the checks tell you what changed and whether it is still green, staging with `-p` keeps unintended changes out, and each green commit is a point you can return to.',
        },
      },
      { type: 'heading', text: 'What to look for in the diff' },
      { type: 'list', items: [
        'Changes outside the files you named.',
        'Quietly changed defaults, rounding, error handling or log messages.',
        'Deleted comments that explained a business rule.',
        'New helper functions that duplicate ones already in the codebase.',
        'Tests changed to match new behaviour, which hides a behaviour change.',
      ] },
      { type: 'warning', text: 'If the assistant edits a test so it passes, stop and ask why. In a refactor, tests should not need to change. A changed assertion means changed behaviour.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-06-scenario-1',
          kind: 'scenario',
          title: 'The test that changed',
          prompt: 'What do you do?',
          concept: 'refactoring with tests',
          situation: 'You asked for one refactor step. The assistant reports "all tests pass". Your diff shows it also changed one assertion in the invoice tests from 118 to 120.',
          options: [
            {
              text: 'Accept it: green tests mean the refactor is safe.',
              consequence: 'The test now agrees with new behaviour, so a change in behaviour was approved along with the code.',
              quality: 'poor',
            },
            {
              text: 'Stop and ask why the assertion changed. In a refactor, tests should not need to change.',
              consequence: 'A changed assertion means changed behaviour. You find out before it is committed.',
              quality: 'best',
            },
            {
              text: 'Keep the change and add a comment explaining the new number.',
              consequence: 'The behaviour change is still there, just labelled. Nobody decided it was wanted.',
              quality: 'poor',
            },
            {
              text: 'Ask the assistant if it is sure and continue if it says yes.',
              consequence: 'Asking again does not check anything. The diff and the tests are the evidence.',
              quality: 'poor',
            },
          ],
          hints: [
            'A refactor should not change what the code does.',
            'What does a changed assertion tell you about behaviour?',
            'Stop and find out why before the step goes into a commit.',
          ],
          explanation: 'If the assistant edits a test so it passes, stop and ask why. A refactor keeps behaviour, so tests should not need to change.',
        },
      },
      { type: 'tip', text: "If a step goes wrong, do not ask the tool to fix its fix three times. Run `git restore .`, narrow the request and try again. A clean restart is usually faster." },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Once one agent works safely in one checkout, parallelise by giving each task its own Git worktree and branch. Worktrees share the repository but each has its own checked-out files and index, and Git refuses to check one branch out in two worktrees at once, which is exactly the isolation you want. For a mechanical change across hundreds of files, ask the assistant to write a codemod or script instead of editing each file itself: you review one small program, run it deterministically, and re-run it after a rebase. Gate every step with checks the agent cannot edit, and treat any refactor diff that touches tests as a finding. Use expand and contract (add the new path, migrate callers, remove the old) for interfaces, schemas and feature flags, so each step can ship and be reverted alone.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'bash',
        label: 'One worktree and branch per agent',
        code: `git worktree add -b agent/rename-config ../agent-a   # new branch, in its own folder
git worktree add -b agent/add-tests ../agent-b
git worktree list
git worktree add ../agent-c main                       # refused: main is checked out in the original folder
git worktree remove ../agent-a                         # works only on a clean worktree`,
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Git's manual says `git worktree add` creates a linked worktree that shares everything with the repository except per-worktree files such as `HEAD` and the index, and refuses to check out a branch that another worktree already has checked out unless forced. `git worktree remove` removes only clean worktrees unless forced, and `git worktree list` shows each worktree with its branch.",
        checked: CHECKED,
        sources: [SRC.gitWorktree],
      },
      {
        type: 'takeaways',
        items: [
          'Pin behaviour first: if there are no tests, write characterisation tests.',
          'One kind of change per step, a diff small enough to read, checks after every step, and a commit when green.',
          'End the request with "and stop" to avoid scope creep.',
          'Check the diff for changes outside the named files, quiet changes to defaults and rounding, and edited tests.',
          'If a step goes wrong, restore and narrow the request instead of asking for a fix of the fix.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-06-q1',
        prompt: 'Why ask the assistant for only one kind of change per step?',
        choices: [
          'Tools cannot do more than one thing',
          'So each diff is small enough to review and any break is easy to locate',
          'It uses fewer tokens, which is the main goal',
        ],
        answer: 1,
        explanation: 'Small, single-purpose diffs are reviewable and make it obvious which step broke something.',
      },
      {
        id: 'experienced-06-q2',
        prompt: 'During a refactor, the assistant changed an assertion in a test so the suite passes. What does that tell you?',
        choices: [
          'The refactor is complete',
          'The test was probably wrong',
          'Nothing important',
          'Behaviour probably changed, so you need to find out why',
        ],
        answer: 3,
        explanation: 'A pure refactor keeps behaviour. A changed assertion is a red flag that behaviour moved.',
      },
      {
        id: 'experienced-06-q3',
        prompt: 'What should exist before you let AI refactor untested legacy code?',
        choices: [
          'Tests that pin down the current behaviour',
          'A longer prompt',
          'A new framework',
        ],
        answer: 0,
        explanation: 'Characterisation tests are your safety net: they tell you immediately if the behaviour changed.',
      },
      {
        id: 'experienced-06-q4',
        prompt: 'An AI step has gone wrong and its second fix made it worse. What is usually fastest?',
        choices: [
          'Ask it to fix it a third time',
          'Merge it and fix it later',
          'Restore the files, narrow the request and try again',
        ],
        answer: 2,
        explanation: 'Stacking fixes on a bad change compounds errors. Going back to the last green commit is cleaner.',
      },
      {
        id: 'experienced-06-q5',
        audience: { max: 'beginner' },
        prompt: 'What does "refactoring" mean?',
        choices: [
          "Adding a brand new feature to the program while keeping the old code in place",
          "Deleting the tests so that the code runs faster and the checks stop failing",
          "Changing how code is organised without changing what it does",
          "Translating the program into another programming language, line by line",
        ],
        answer: 2,
        explanation: 'Refactoring is tidying the inside of the code while its behaviour stays the same. Tests and small steps are how you prove the behaviour did not change.',
      },
      {
        id: 'experienced-06-q6',
        audience: { min: 'advanced' },
        prompt: 'Two agents must work on different tasks in the same repository at the same time. Which setup keeps them from overwriting each other\'s files?',
        choices: [
          "One linked worktree per agent, each on its own branch, merged after review",
          "Both work in the same folder on the same branch and take turns saving files, one after the other",
          "One agent works on main while the other edits a zip copy of the project, then they swap the files",
          "Both use `git stash` to hand files back and forth between their sessions, whenever one of them finishes",
        ],
        answer: 0,
        explanation: 'A linked worktree gives each agent its own files, index and branch while sharing the repository, so their work cannot collide until you merge it.',
      },
    ],
    task: {
      title: 'One safe refactor step',
      minutes: 20,
      steps: [
        'Pick a small, tested function you would like to clean up (a personal or approved repository).',
        'Create a branch and ask the assistant for one refactor step only, ending with "and stop".',
        'Read the full diff, run the tests, and stage only intended changes with `git add -p`.',
        'Commit, then write one line on whether the diff contained anything you did not ask for.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "In a practice project, ask the assistant to rename one function and stop. Run `git diff` and read every changed line, ticking off each one you can explain.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Create two worktrees for two small tasks and run an agent in each with a narrow scope. Merge them one at a time after reading each diff.",
          "Take one repetitive change, such as a rename or an import path, and ask for a codemod script instead of direct edits. Review the script, run it, and compare its diff with what direct edits would have produced.",
        ],
      },
    ],
  },
  {
    id: 'experienced-07',
    day: 7,
    title: 'Test generation that actually tests',
    summary: 'Let the assistant draft test cases fast, then make sure each assertion checks real behaviour and edge cases.',
    intro: {
      objectives: [
        'Ask for boundary cases instead of volume when generating tests',
        'Read a threshold condition and predict which side of it an input lands on',
        'Check generated tests with a sabotage check: break the code on purpose and see what fails',
        'Spot tests whose expected values only copy the current output',
      ],
      why: 'Writing tests is one of the first jobs developers hand to an assistant, and green tests that check nothing are worse than no tests because they invite trust.',
    },
    minutes: 15,
    skills: ['safe-change', 'review-security'],
    body: [
      { type: 'paragraph', text: "Writing tests is one of the most useful jobs to hand an assistant, because it is repetitive and you can check the result. It is also easy to get tests that look thorough and test nothing. Volume is not coverage, and coverage is not correctness." },
      { type: 'heading', text: 'A small example' },
      { type: 'code', language: 'python', label: 'fees.py', code: `def delivery_fee(subtotal_centavos: int, distance_km: float) -> int:
    """Return the delivery fee in centavos."""
    if subtotal_centavos >= 100_000:  # free delivery from 1,000 pesos
        return 0
    base = 4_900
    extra_km = max(0.0, distance_km - 3)
    return base + round(extra_km * 1_000)` },
      { type: 'code', language: 'python', label: 'test_fees.py (run with: pytest)', code: `import pytest

from fees import delivery_fee


@pytest.mark.parametrize(
    "subtotal, distance, expected",
    [
        (100_000, 10, 0),       # free at exactly 1,000 pesos
        (99_999, 1, 4_900),     # one centavo under the threshold
        (50_000, 3, 4_900),     # no extra charge up to 3 km
        (50_000, 5.5, 7_400),   # 2.5 extra km at 10 pesos each
    ],
)
def test_delivery_fee(subtotal, distance, expected):
    assert delivery_fee(subtotal, distance) == expected` },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **test** is a short program that runs your code with a chosen input and checks the answer. Here `delivery_fee` is the code, and each row such as `(100_000, 10, 0)` says: with this subtotal and this distance, I expect this fee. **Parametrize** just means running one test many times with different rows. A **boundary** is the exact edge where behaviour changes. In this shop 100,000 centavos (1,000 pesos) gets free delivery, so 99,999 and 100,000 sit on either side of the edge and are the most useful numbers to try. `>=` means 'greater than or equal to'. Changing it to `>` moves the edge by one, and a good test notices.",
      },
      { type: 'paragraph', text: "Good tests sit on the boundaries: exactly at the threshold, one below, exactly at 3 km. Ask for those explicitly. Left alone, assistants tend to produce happy-path cases with round numbers." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-07-predict-output-1',
          kind: 'predict-output',
          title: 'Which side of the threshold?',
          prompt: 'Read `delivery_fee` from the lesson. What do these two calls print?',
          concept: 'boundary tests',
          language: 'python',
          code: 'def delivery_fee(subtotal_centavos: int, distance_km: float) -> int:\n    if subtotal_centavos >= 100_000:\n        return 0\n    base = 4_900\n    extra_km = max(0.0, distance_km - 3)\n    return base + round(extra_km * 1_000)\n\nprint(delivery_fee(100_000, 10))\nprint(delivery_fee(99_999, 10))',
          expected: '0\n11900',
          choices: ['0\n11900', '0\n4900', '11900\n11900', '0\n7000'],
          wrongNotes: {
            '0\n4900': 'The distance still counts: 10 km is 7 km past the free 3, so the extra charge is added to the base fee.',
            '11900\n11900': 'At exactly 100,000 centavos the condition `>= 100_000` is true, so the first call returns 0.',
            '0\n7000': 'The base fee of 4,900 is added to the extra-distance charge.',
          },
          hints: [
            'Check the first call against the `>=` comparison: is 100,000 at the threshold?',
            'For the second call the order is below the threshold, so the fee is not 0.',
            'The base is 4,900, and 10 km is 7 km past the first 3 at 1,000 centavos each.',
          ],
          explanation: 'Exactly at the threshold the delivery is free. One centavo under it, the full fee applies: 4,900 plus 7 extra kilometres at 1,000 each is 11,900. That is why tests belong on the boundaries.',
        },
      },
      { type: 'prompt', label: 'Ask for boundaries, not volume', text: 'Write pytest tests for `delivery_fee` in fees.py. First list the boundaries and edge cases you see (thresholds, zero, negative input, very large values), and say which behaviours are unclear from the code. Then write parametrised tests for the clear ones. For unclear ones, do not guess: write the test name and a TODO asking me what the expected value is.' },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "At your level the habit to build is checking tests, not writing more of them. After the assistant writes a test, change the code by one character (`>=` to `>`, `+` to `-`) and run the suite. If everything is still green, ask the assistant which input would have caught the change, add it, and check that the test fails before you undo your edit. Do this twice and you will start to see weak tests on sight, such as assertions that compare a mock with itself or only check that a value is not empty.",
      },
      { type: 'heading', text: 'Review every generated test' },
      { type: 'list', items: [
        '**Does the expected value come from the requirement, or from running the code?** A test that copies current output also copies current bugs. That is fine for characterisation tests, but label them.',
        '**Is it testing a mock?** If everything is mocked, the test only proves the mocks agree with each other.',
        '**Would it fail if the code were wrong?** Break the function on purpose (change `>=` to `>`) and run the tests. If nothing fails, the tests are weak.',
        '**Is it readable?** A failing test should tell the next developer what broke.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'experienced-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'Green, but weak',
          prompt: 'This test passes. It would still pass if someone changed `>=` to `>` in `delivery_fee`. Find the weak line, then pick the assertion that would catch that change.',
          concept: 'weak tests',
          language: 'python',
          code: 'from fees import delivery_fee\n\ndef test_free_delivery():\n    assert delivery_fee(150_000, 10) == 0',
          bugLine: 4,
          fixes: [
            {
              line: 'assert delivery_fee(100_000, 10) == 0',
              correct: true,
              why: 'Exactly at the threshold. With `>` the function would return 11,900 here, so this test fails when the code is broken.',
            },
            {
              line: 'assert delivery_fee(200_000, 10) == 0',
              correct: false,
              why: 'Still free under `>`, because 200,000 is well above the threshold. It passes either way.',
            },
            {
              line: 'assert delivery_fee(150_000, 10) >= 0',
              correct: false,
              why: 'Always true for any fee. It cannot fail, so it tests nothing.',
            },
          ],
          lineNote: 'That line is fine. The weak part is the assertion about free delivery.',
          hints: [
            'Think about the "sabotage check": break the code on purpose and see what fails.',
            'Which input sits on the edge between free and not free?',
            'The threshold is 100,000. What if the subtotal is exactly that?',
          ],
          explanation: 'A test that would not fail when the code is wrong is weak. Boundary inputs (exactly at the threshold) catch a `>=` that turns into `>`, which round numbers well above it do not.',
        },
      },
      { type: 'warning', text: 'Never let the assistant change production code and its tests in the same step without you reading both. That is how a bug and a test that blesses it arrive together.' },
      { type: 'tip', text: 'The quick sabotage check in the list above is a manual version of mutation testing. Tools exist to automate it for most languages if you want to go further.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Example-based tests check the cases someone thought of. Properties check rules that must hold for every input, and generated suites tend to contain the first kind. Ask for invariants (never negative, free exactly at the threshold, farther never costs less) and run them over many inputs with a fixed seed so any failure can be replayed. Random inputs alone miss boundaries: drawing from 0 to 300,000, you almost never land exactly on 100,000, so add the edge values by hand or use a property-testing library. Swap `>=` for `>` below and the hand-added edge fails at once, while random draws alone usually pass. The sabotage check is manual mutation testing; at team level, run a mutation tool on the modules that matter and review the surviving mutants. Keep test and production changes in separate commits so a reviewer can see the tests came first.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'python',
        label: 'props.py (run: python props.py, next to fees.py)',
        code: `import random

from fees import delivery_fee

rng = random.Random(7)  # fixed seed: a failure can be replayed
EDGES = [0, 99_999, 100_000, 100_001]  # random draws rarely land exactly on a boundary

cases = [(s, 3.0) for s in EDGES]
cases += [(rng.randint(0, 300_000), round(rng.uniform(0, 30), 1)) for _ in range(5_000)]

for subtotal, km in cases:
    fee = delivery_fee(subtotal, km)
    assert fee >= 0, (subtotal, km, fee)
    assert (fee == 0) == (subtotal >= 100_000), (subtotal, km, fee)
    if subtotal < 100_000:
        assert fee >= 4_900, (subtotal, km, fee)
        assert delivery_fee(subtotal, km + 1) >= fee, (subtotal, km)  # farther never costs less
print(f"{len(cases):,} cases satisfied every property")`,
      },
      {
        type: 'takeaways',
        items: [
          'Volume is not coverage, and coverage is not correctness.',
          'Ask for boundaries: exactly at a threshold, one below, zero, negative and very large values.',
          'Check where each expected value came from: the requirement, or just the current output.',
          'Sabotage the code on purpose. If no test fails, the tests are weak.',
          'Never let production code and its tests change together without reading both.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-07-q1',
        prompt: 'What is the quickest way to check that generated tests would catch a bug?',
        choices: [
          'Count how many tests there are',
          'Check the coverage percentage only',
          'Ask the assistant if the tests are good',
          'Break the code on purpose and see whether a test fails',
        ],
        answer: 3,
        explanation: 'If a deliberate bug does not fail any test, the tests are not protecting that behaviour.',
      },
      {
        id: 'experienced-07-q2',
        prompt: 'Which test case is most valuable for `delivery_fee`?',
        choices: [
          'A subtotal of exactly 100,000 centavos',
          'A subtotal of 500,000 centavos',
          'A distance of 10 km',
        ],
        answer: 0,
        explanation: 'Values exactly on a threshold catch off-by-one mistakes like `>=` versus `>`.',
      },
      {
        id: 'experienced-07-q3',
        prompt: 'What is the risk of tests whose expected values come from running the current code?',
        choices: [
          'They run too slowly',
          'They lock in today\'s bugs as correct behaviour',
          'They cannot be parametrised',
        ],
        answer: 1,
        explanation: 'That is acceptable for labelled characterisation tests, but they do not prove the code is right.',
      },
      {
        id: 'experienced-07-q4',
        audience: { max: 'beginner' },
        prompt: 'In the delivery fee example, why are subtotals of 99,999 and 100,000 good numbers to test?',
        choices: [
          "They are round numbers that are easy to type and easy to read at a glance",
          "They are the two largest orders that the shop is able to accept in one day",
          "They make the tests finish faster because the numbers are close together",
          "They sit on either side of the exact point where the fee changes",
        ],
        answer: 3,
        explanation: 'Mistakes like `>=` versus `>` only show up on the edge itself. Numbers just below and exactly at the threshold are what catch them.',
      },
      {
        id: 'experienced-07-q5',
        audience: { min: 'advanced' },
        prompt: 'A property test over 10,000 random inputs still passes after you swap `>=` for `>` in a threshold check. What does that tell you?',
        choices: [
          "The tests are strong, because random and hand-written tests agree with each other on every case",
          "Random inputs rarely hit a boundary exactly, so add the edge values and sabotage the code to check",
          "Property tests are unable to find off-by-one mistakes of any kind, so they are the wrong tool here",
          "The threshold is not used by the code at all, so the swap changed nothing that the program does",
        ],
        answer: 1,
        explanation: 'With a wide random range the chance of landing exactly on the threshold is tiny. Adding the edge values explicitly, then sabotaging the code to see them fail, is what shows the suite really protects the boundary.',
      },
    ],
    task: {
      title: 'Generate and sabotage',
      minutes: 20,
      steps: [
        'Save `fees.py` above (or pick a small function of your own) and ask for tests with the boundaries prompt.',
        'Run them with `pytest`.',
        'Change `>=` to `>` in the code and run again. Did a test fail?',
        'Remove or rewrite one weak generated test and add one boundary case it missed.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Add one boundary row of your own to the parametrised test, for example a subtotal of 100_001. Before running it, predict whether it passes, then run it.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Save `props.py` next to `fees.py`, add the edge values for a function of your own, then swap an operator in the code and confirm the properties fail.",
          "Ask the assistant for three more invariants and reject any that only restate the implementation.",
        ],
      },
    ],
  },
  {
    id: 'experienced-08',
    day: 8,
    title: 'Debugging and root cause with AI',
    summary: 'Use the assistant to generate and test hypotheses, not to paper over symptoms.',
    intro: {
      objectives: [
        'Reproduce a bug, ideally as a failing test, before asking an assistant anything',
        'Ask for ranked root-cause hypotheses with a quick check for each, instead of a fix',
        'Put `git bisect` commands in order to find the commit that broke something',
        'Recognise a symptom fix, such as a broad try/except that hides the error',
      ],
      why: 'An assistant will make an error go away in seconds, and a developer who cannot tell that from finding the cause ships bugs that come back. Root cause thinking is the part of debugging you keep.',
    },
    minutes: 15,
    skills: ['safe-change', 'context-prompting'],
    body: [
      { type: 'paragraph', text: "Paste a stack trace into an assistant and you will get a fix in seconds. Often it is a fix for the symptom: a `try/except` that swallows the error, a null check that hides missing data, a retry around a race condition. The ticket closes and the bug comes back next month in a different form. Your experience is knowing the difference between making the error go away and finding why it happened." },
      { type: 'heading', text: 'Reproduce first' },
      { type: 'paragraph', text: "Before you ask anything, reproduce the bug and write down the exact steps. If you can turn it into a failing test, even better: the test becomes your proof that the fix works, and the assistant can run it. An assistant without a reproduction is guessing, and so are you." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **bug** is a mistake that makes a program behave wrongly. To **reproduce** it means to make it happen again on purpose by following exact steps. Without that you cannot tell whether your fix worked. A **stack trace** is the list of steps the program printed just before it crashed, and the first lines usually say what went wrong. Think of a doctor: they ask when it hurts and what changed before they guess a cure. The **root cause** is the real reason behind the symptom. Hiding the symptom, for example by ignoring an error, is like switching off a smoke alarm instead of putting out the fire. 'Debugging and Troubleshooting with AI' practises this step by step.",
      },
      { type: 'heading', text: 'Give it what a colleague would need' },
      { type: 'list', items: [
        'What you expected and what actually happened.',
        'The full error and stack trace (with secrets and personal data removed).',
        'The steps or failing test that reproduce it.',
        'What changed recently: deploys, dependency updates, config.',
        'What you already tried and ruled out.',
      ] },
      { type: 'prompt', label: 'Hypotheses, not fixes', text: 'Here is a bug. Expected: [ ]. Actual: [ ]. Stack trace: [ ]. It reproduces with: [failing test or steps]. Recent changes: [ ]. Already ruled out: [ ]. Do not write a fix yet. Give me the three most likely root causes, ranked, with the evidence for each, and for each one a quick check (a log line, a query, a test) that would confirm or rule it out.' },
      { type: 'paragraph', text: "Asking for ranked hypotheses with checks turns the assistant into a thinking partner. You run the checks, paste back the results, and narrow down together. This is the same discipline you would use with a teammate at the whiteboard, only faster." },
      { type: 'heading', text: 'When it broke between two versions' },
      { type: 'paragraph', text: 'If you know a version where it worked and one where it does not, `git bisect` finds the commit for you. Then the assistant has a much smaller diff to reason about.' },
      { type: 'code', language: 'bash', label: 'Let Git find the breaking commit', code: `git bisect start
git bisect bad                 # the current commit is broken
git bisect good v1.4.0         # this tag still worked
git bisect run pytest tests/test_fees.py
# Git prints the first bad commit. Then:
git bisect reset` },
      { type: 'paragraph', text: 'Read the commands in order. `git bisect start` begins the session. `git bisect bad` marks the commit you are on as broken, and `git bisect good v1.4.0` marks a tag that still worked. `git bisect run pytest tests/test_fees.py` then lets Git check out commits between the two and run your test on each, until it prints the first bad one. `git bisect reset` ends the session and returns you to where you started.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-08-arrange-1',
          kind: 'arrange',
          title: 'Let Git find the commit',
          prompt: 'Put the `git bisect` commands in order: start, mark the known bad and known good points, let it run the test, then clean up.',
          concept: 'git bisect',
          language: 'bash',
          solution: [
            'git bisect start',
            'git bisect bad',
            'git bisect good v1.4.0',
            'git bisect run pytest tests/test_fees.py',
            'git bisect reset',
          ],
          alternatives: [
            [
              'git bisect start',
              'git bisect good v1.4.0',
              'git bisect bad',
              'git bisect run pytest tests/test_fees.py',
              'git bisect reset',
            ],
          ],
          reasons: [
            'A bisect session has to start before anything else.',
            'The current commit is broken.',
            'This tag still worked.',
            'With both ends known, Git can test commits itself.',
            'End the session to return to where you were.',
          ],
          hints: [
            'Start comes first and reset comes last.',
            'Git needs a good and a bad point before it can run.',
            'The run command goes after both points are marked.',
          ],
          explanation: 'Git needs a start, a bad commit and a good commit; then it can run your test on the commits in between and print the first bad one. Reset returns you to your original state.',
        },
      },
      { type: 'warning', text: 'Treat any fix that adds a broad `try/except`, a sleep, a retry or a default value with suspicion. Ask the assistant: what would have to be true for this fix to be wrong? If the honest answer is "the real cause is elsewhere", keep digging.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-08-scenario-1',
          kind: 'scenario',
          title: 'The error went away',
          prompt: 'What do you do with this fix?',
          concept: 'root cause analysis',
          situation: 'A nightly job fails with a NoneType error on a discount value. The assistant\'s first suggestion wraps the line in a broad try/except and returns 0 on failure. The job runs again.',
          options: [
            {
              text: 'Merge it: the error is gone and the job runs.',
              consequence: 'The ticket closes, but why the discount was missing is still unknown. The bug returns in another form.',
              quality: 'poor',
            },
            {
              text: 'Ask what would have to be true for this fix to be wrong, and keep digging if the honest answer is that the cause is elsewhere.',
              consequence: 'A swallowed error is a symptom fix. The question pushes you toward the real cause and a reproduction.',
              quality: 'best',
            },
            {
              text: 'Merge it, but add a log line to see how often it fires.',
              consequence: 'You gain evidence for later, but the error is still hidden and the missing data still unexplained.',
              quality: 'acceptable',
            },
            {
              text: 'Ask for three more fixes and merge the shortest.',
              consequence: 'Shorter does not mean closer to the root cause. You are still not reproducing the bug.',
              quality: 'poor',
            },
          ],
          hints: [
            'Making the error go away is not the same as finding why it happened.',
            'Broad `try/except`, defaults, sleeps and retries deserve suspicion.',
            'Ask the assistant what would have to be true for the fix to be wrong.',
          ],
          explanation: 'Treat any fix that swallows an error, adds a default or retries with suspicion. Reproduce the bug, find the cause and guard it with a test.',
        },
      },
      { type: 'tip', text: 'After the fix, ask the assistant to help you write a short root-cause note: what happened, why, how it was found, and the test that now guards it. Your future self will thank you.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Make the failure cheap to ask about. A failing test or a one-command reproduction lets an agent loop on evidence instead of guesses, and lets `git bisect run` do the search: exit code 0 marks a commit good, 1 to 127 except 125 marks it bad, 125 skips a commit that cannot be tested (a build failure, say), and anything else aborts the search. Treat hypotheses as falsifiable: for each one, name the observation that would disprove it, and have the agent run that check before it edits code. When the evidence lives in production, give the assistant read-only access to logs and traces over a narrow, least-privilege connection, and redact personal data before it leaves your systems. Time-box the hunt, and finish with a regression test and a note on why earlier checks did not catch the failure.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'bash',
        label: 'check.sh, used with: git bisect run ./check.sh',
        code: `#!/bin/sh
python -m compileall -q src || exit 125   # this commit cannot even be loaded: skip it
pytest -q tests/test_fees.py              # exits 0 when every test passes, non-zero otherwise`,
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Git's manual for `git bisect run` says the script's exit code 0 means the revision is good, codes 1 to 127 except 125 mean bad, 125 means the revision cannot be tested and is skipped, and any other code aborts the bisect. It warns that skipping a commit next to the first bad one can leave Git unable to say exactly which commit was first bad.",
        checked: CHECKED,
        sources: [SRC.gitBisect],
      },
      {
        type: 'takeaways',
        items: [
          'Reproduce first, ideally as a failing test. An assistant without a reproduction is guessing.',
          'Give it what a colleague would need: expected, actual, trace, reproduction, recent changes and what you ruled out.',
          'Ask for ranked hypotheses with a quick check for each, not a fix.',
          'When it broke between two versions, let `git bisect` find the commit.',
          'Be suspicious of broad try/except, sleeps, retries and default values.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-08-q1',
        prompt: 'Why ask the assistant for ranked hypotheses with checks instead of a fix?',
        choices: [
          'Because fixes from AI are never correct',
          'Because finding the real cause prevents the bug from returning in another form',
          'Because it uses less memory',
        ],
        answer: 1,
        explanation: 'A quick fix often hides the symptom. Testing hypotheses gets you to the root cause.',
      },
      {
        id: 'experienced-08-q2',
        prompt: 'What should you have before asking an assistant to help debug?',
        choices: [
          'A reproduction: exact steps or a failing test',
          'A new branch named after the assistant',
          'Permission to deploy to production',
          'A list of every file in the repository',
        ],
        answer: 0,
        explanation: 'Without a reproduction neither you nor the tool can confirm the cause or the fix.',
      },
      {
        id: 'experienced-08-q3',
        prompt: 'A suggested fix wraps the failing call in a broad try/except that logs and continues. What is the main concern?',
        choices: [
          'It is too short',
          'Python does not allow it',
          'It may hide the real cause and let bad data through',
        ],
        answer: 2,
        explanation: 'Swallowing errors makes the symptom disappear while the underlying problem keeps doing damage.',
      },
      {
        id: 'experienced-08-q4',
        audience: { max: 'beginner' },
        prompt: 'What does it mean to "reproduce" a bug?',
        choices: [
          "Make it happen again on purpose by following exact steps",
          "Copy the program to another computer and run it there to see if it still fails",
          "Ask the assistant to guess what probably happened and then trust its guess",
          "Delete the part of the program that fails so that the error disappears for good",
        ],
        answer: 0,
        explanation: 'Reproducing means you can trigger the bug whenever you like. Only then can you tell whether a change really fixed it.',
      },
      {
        id: 'experienced-08-q5',
        audience: { min: 'advanced' },
        prompt: 'During `git bisect run ./check.sh`, one commit cannot be built, so it cannot be tested. What should the script do for that commit?',
        choices: [
          "Exit with 1 so that the commit is counted as bad and the search carries on",
          "Exit with 0 so that Git skips that commit and moves on to the next one",
          "Exit with 125 so that Git skips that commit",
          "Exit with 128 so that Git retries that commit later, once the build is fixed",
        ],
        answer: 2,
        explanation: 'Exit code 125 tells bisect the commit is untestable and should be skipped. 1 would wrongly mark it bad, 0 would mark it good, and a code of 128 or more aborts the whole search.',
      },
    ],
    task: {
      title: 'Debug one real bug the slow-then-fast way',
      minutes: 20,
      steps: [
        'Pick a recent or open bug you are allowed to discuss with your assistant.',
        'Write the reproduction as a failing test or exact steps.',
        'Run the hypotheses prompt, then do the checks it suggests and paste the results back.',
        'Write a three-line root-cause note: cause, evidence, and the test that guards it.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Write down the exact steps that make a small bug appear in one of your practice projects. Give them to the assistant with the error message and ask it to explain the error line by line before it suggests any fix.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Write a `check.sh` for a real regression, using 125 for commits that cannot be built, and run `git bisect run`. Give the assistant only the first bad commit's diff and the failing test, and compare its hypotheses with the cause you confirm.",
          "Add a regression test and a two-line note on why earlier checks missed the bug.",
        ],
      },
    ],
  },
  {
    id: 'experienced-09',
    day: 9,
    title: 'Code review with AI, and reviewing AI code',
    summary: 'Use the assistant as a first-pass reviewer, and learn the specific ways AI-written code goes wrong.',
    intro: {
      objectives: [
        'Give an AI first-pass reviewer the diff, the goal and your conventions, and ask for must-fix versus suggestion',
        'Recognise the patterns AI-written code fails in, such as invented APIs, scope creep and weak tests',
        'Hold the author of a pull request responsible for every line, whoever typed it',
      ],
      why: 'You will review more AI-written code than ever, and "the AI wrote it" is not an acceptable answer in review. Knowing the failure patterns makes your reviews faster and sharper.',
    },
    minutes: 15,
    skills: ['review-security', 'team-impact'],
    body: [
      { type: 'paragraph', text: "Review now runs in two directions. You can ask an assistant to review a diff before a human sees it, and you will increasingly review code that an assistant wrote, yours or a teammate's. Both are useful. Neither replaces a person who understands the system approving the change." },
      { type: 'heading', text: 'AI as a first-pass reviewer' },
      { type: 'paragraph', text: "A first pass catches the boring problems: missing null checks, unclosed resources, inconsistent naming, unhandled errors. That frees human reviewers for design, business rules and risk. Give it the diff, the goal of the change and your conventions." },
      { type: 'code', language: 'bash', label: 'Export your branch\'s changes for review', code: `git diff main...HEAD > review.diff
git diff --stat main...HEAD` },
      { type: 'prompt', label: 'First-pass review', text: 'Review this diff as a senior engineer. The goal of the change is: [goal]. Our conventions: [paste key rules or point to the instructions file]. Review in this order: (1) correctness, including edge cases and error handling, (2) security, (3) readability. For each finding give the file and line, why it matters, and a concrete fix. Mark each as must-fix or suggestion. If something depends on context you cannot see, ask instead of assuming.' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **pull request** (PR) is a proposal to add your changes to a shared project so that teammates can look them over first. A **review** is that look: someone reads the changes, asks questions, and either approves them or asks for fixes. An AI first-pass reviewer reads the changes before a person does and points out routine slips, like a spell-checker for code. It can miss things and it can raise false alarms, so a person still decides. The author of the change is the one responsible for it, even if an assistant typed the code, so you should be able to explain every line you submit.",
      },
      { type: 'heading', text: 'How AI-written code goes wrong' },
      { type: 'paragraph', text: 'AI code has its own failure patterns. Learn them and your reviews get faster and sharper:' },
      { type: 'list', items: [
        '**Invented APIs:** a method or option that does not exist in your version of the library.',
        '**Scope creep:** changes to files and behaviour that were not part of the task.',
        '**Duplicate helpers:** a new utility that already exists elsewhere in the codebase.',
        '**Plausible but wrong edge cases:** time zones, rounding, empty lists, Unicode names.',
        '**Weak tests:** tests that pass because they test mocks or copy current output.',
        '**Silent error handling:** exceptions caught and ignored to make things work.',
      ] },
      { type: 'paragraph', text: "The author of a pull request is responsible for it, whoever typed the code. If you open a PR with AI-written code, you should be able to explain every line in review. 'The AI wrote it' is not an answer a reviewer should accept, and it is not one you should give." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-09-match-1',
          kind: 'match',
          title: 'What went wrong in this PR?',
          prompt: 'You are reviewing AI-written pull requests. Match each thing you spot with the failure pattern it shows.',
          concept: 'reviewing ai-written code',
          labels: { terms: 'What you spot in the PR', meanings: 'Failure pattern' },
          pairs: [
            {
              term: 'The PR calls `response.json_safe()`, a method your HTTP library has never had.',
              definition: 'Invented APIs',
            },
            {
              term: 'Asked to fix a typo in an error message, the PR also reformats three modules and changes a default timeout.',
              definition: 'Scope creep',
            },
            {
              term: 'The PR adds `formatPeso()` in a new file, but `formatMoney()` in utils/money.ts already does the same thing.',
              definition: 'Duplicate helpers',
            },
            {
              term: 'A due-date check marks bills overdue a day early for users in Manila because it compares UTC dates.',
              definition: 'Plausible but wrong edge cases',
            },
            {
              term: 'The new test mocks the price calculator, then checks that the mock returned what it was told to return.',
              definition: 'Weak tests',
            },
            {
              term: 'A `try { … } catch (e) {}` wraps the payment call, and the failing test turns green.',
              definition: 'Silent error handling',
            },
          ],
          hints: [
            'Some patterns are about what the code touches, some about what it hides, and some about what it gets subtly wrong.',
            'A method that does not exist is different from a helper that exists twice.',
            'A test that only tests a mock is weak; an empty catch block hides errors.',
          ],
          explanation: 'A method the library lacks is an invented API, unrelated changes are scope creep, a second money formatter is a duplicate helper, the UTC date bug is a plausible but wrong edge case, a test of a mock is weak, and an empty catch is silent error handling.',
        },
      },
      { type: 'warning', text: 'Only send diffs to an AI reviewer that your policy allows. A first-pass review of a client\'s private repository in an unapproved tool is still a data leak.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-09-scenario-1',
          kind: 'scenario',
          title: 'The AI wrote it',
          prompt: 'How do you respond in the review?',
          concept: 'ownership of ai-written code',
          situation: 'In review you ask why a pull request adds a new format_amount helper when money.format() already exists. The author answers: "The AI wrote it."',
          options: [
            {
              text: 'Accept it: if an AI wrote it, nobody can be expected to know.',
              consequence: 'The duplicate lands in the codebase and the author learns nothing about owning their change.',
              quality: 'poor',
            },
            {
              text: 'Say the author is responsible for every line: ask them to check the codebase for existing helpers and remove the duplicate.',
              consequence: 'The author of a pull request owns it whoever typed the code. This is the standard a reviewer should hold.',
              quality: 'best',
            },
            {
              text: 'Approve it and quietly fix it yourself later.',
              consequence: 'The problem is fixed once, but the author never learns to check before opening the next pull request.',
              quality: 'poor',
            },
          ],
          hints: [
            'Who is responsible for a pull request?',
            'Duplicate helpers are one of the known AI failure patterns.',
            '"The AI wrote it" is not an answer a reviewer should accept.',
          ],
          explanation: 'The author of a pull request is responsible for it, whoever typed the code. You should be able to explain every line in review.',
        },
      },
      { type: 'tip', text: 'Keep a short list of the AI mistakes you catch most often in your codebase. Add the top ones to your instructions file so the assistant stops making them.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Make review a system, not a favour. Use CODEOWNERS so the right people are requested automatically, and branch protection that requires a code owner's approval before merge. An AI reviewer can be an extra check that comments, but it should not be the approval. Change the order of review: read the description and the tests first, because tests are the specification the code must satisfy, then the code, and be most suspicious of diffs where tests changed alongside production code. Ask the author for evidence, not assurances: the command they ran and its output, the cases they tried, and what they chose not to change. Track review capacity as a constraint. If generated pull requests arrive faster than people can review them, the queue grows, so cap pull request size and say so in the template.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "GitHub's documentation says a CODEOWNERS file names the people or teams responsible for code, who are requested for review automatically when a pull request changes files they own. The file can live in `.github/`, the repository root or `docs/`, the last matching pattern wins, and the branch protection option 'Require review from Code Owners' requires approval from a code owner before merging (approval from any one owner on a line satisfies it).",
        checked: CHECKED,
        sources: [SRC.codeOwners],
      },
      {
        type: 'takeaways',
        items: [
          'Review now runs both ways: AI as a first-pass reviewer, and you reviewing AI-written code.',
          'Give the reviewer the diff, the goal and your conventions, in the order correctness, security, readability.',
          'AI code fails in patterns: invented APIs, scope creep, duplicate helpers, wrong edge cases, weak tests, silent errors.',
          'The author owns the pull request and must be able to explain every line.',
          'Only send diffs to tools your policy allows.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-09-q1',
        prompt: 'Who is responsible for AI-written code in a pull request?',
        choices: [
          'The AI tool vendor',
          'The reviewer only',
          'Nobody, because it was generated',
          'The person who opened the pull request',
        ],
        answer: 3,
        explanation: 'The author owns the change and should be able to explain every line.',
      },
      {
        id: 'experienced-09-q2',
        prompt: 'Which issue is especially common in AI-written code?',
        choices: [
          'Calling a library method that does not exist in your version',
          'Too many comments explaining business history',
          'Refusing to write any tests',
        ],
        answer: 0,
        explanation: 'Assistants can mix up versions or invent plausible APIs, so check unfamiliar calls against the docs.',
      },
      {
        id: 'experienced-09-q3',
        prompt: 'What is the best role for an AI first-pass review?',
        choices: [
          'Replacing human approval',
          'Catching routine problems so humans can focus on design and risk',
          'Approving security changes',
        ],
        answer: 1,
        explanation: 'AI is useful for the mechanical layer of review; judgment and approval stay with people.',
      },
      {
        id: 'experienced-09-q4',
        prompt: 'Why ask the AI reviewer to mark findings as must-fix or suggestion?',
        choices: [
          'It makes the review longer',
          'GitHub requires it',
          'So you can act on real problems first and not drown in style comments',
        ],
        answer: 2,
        explanation: 'Prioritised findings keep review focused on what actually matters.',
      },
      {
        id: 'experienced-09-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a pull request?',
        choices: [
          "A command that deletes the old versions of a project to save disk space",
          "A copy of your project that is stored on your phone, in case of loss",
          "A proposal to add your changes to a shared project, for others to review",
          "A message asking the assistant for a faster answer when the first one is slow",
        ],
        answer: 2,
        explanation: 'A pull request lets teammates read your changes and approve them or ask for fixes before they join the shared project.',
      },
      {
        id: 'experienced-09-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team now receives AI-assisted pull requests faster than reviewers can read them. Which response addresses the real constraint?',
        choices: [
          "Let an AI reviewer's approval count in place of a human one, to clear the queue",
          "Cap pull request size, require test evidence, and route changes to code owners",
          "Ask reviewers to approve faster by skimming only the summary of each change",
          "Ban AI tools for anyone with fewer than five years of experience on the team",
        ],
        answer: 1,
        explanation: 'The bottleneck is human review capacity. Smaller pull requests with evidence and the right owners keep reviews real, while swapping in AI approval or skimming removes the check that matters.',
      },
    ],
    task: {
      title: 'Review in both directions',
      minutes: 20,
      steps: [
        'Take a recent branch of yours and export its diff with `git diff main...HEAD`.',
        'Run the first-pass review prompt in your approved assistant.',
        'For each must-fix finding, decide: real problem, false alarm, or needs context. Fix the real ones.',
        'Add your two most common AI-code mistakes to your instructions file.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Take a small change you made and write a three-line description for it: what changed, why, and how you checked it. Ask the assistant what a reviewer might question, then answer each question yourself.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Add a CODEOWNERS entry for one sensitive directory (check where the file may live and which pattern wins), and write a pull request template with a section for the commands run and their output.",
          "Review one AI-assisted pull request tests-first and note what the tests told you before you opened the code.",
        ],
      },
    ],
  },
  {
    id: 'experienced-10',
    day: 10,
    title: 'Documentation and ADRs',
    summary: 'Let the assistant draft READMEs, runbooks and decision records, while you supply the why.',
    intro: {
      objectives: [
        'Name the sections of an Architecture Decision Record: context, decision, consequences and alternatives',
        'Draft documents from your notes with an instruction to write [TODO] instead of inventing reasons',
        'Prove an AI-drafted README works by following it on a clean machine',
      ],
      why: 'Documentation is usually missing or stale, and an assistant can draft the what for you. The why behind your decisions is the part only you hold, and it is what new teammates need most.',
    },
    minutes: 15,
    skills: ['context-prompting', 'team-impact'],
    body: [
      { type: 'paragraph', text: "Most developers would rather write code than docs, so docs are usually missing or stale. Assistants are good at the first draft: they can read the code and describe what it does. What they cannot know is why you built it that way, what you rejected, and what will hurt the next person. That part is yours, and it is the valuable part." },
      { type: 'heading', text: 'Architecture Decision Records' },
      { type: 'paragraph', text: 'An ADR is a short file that records one important decision: the context, what you decided, and the consequences. Teams keep them in the repo, often in `docs/adr/`, numbered in order. They answer the question every new team member asks: why is it like this?' },
      { type: 'code', language: 'markdown', label: 'docs/adr/0007-store-money-as-centavos.md', code: `# 7. Store money as integer centavos

Status: Accepted
Date: 2026-11-13

## Context
Totals were stored as floats. Rounding errors caused order totals to be
off by one centavo against GCash and bank settlement reports.

## Decision
All amounts are stored and calculated as integer centavos. Conversion
to pesos happens only when displaying.

## Consequences
- Reconciliation matches settlement reports exactly.
- Every money field needs a migration and a code change.
- Display code must always format centavos; a helper does this.

## Alternatives considered
- Decimal columns: correct, but our reporting tools handled them poorly.` },
      {
        type: 'activity',
        activity: {
          id: 'experienced-10-fill-blank-1',
          kind: 'fill-blank',
          title: 'The parts of a decision record',
          prompt: 'Fill in the three section headings of this Architecture Decision Record.',
          concept: 'architecture decision records',
          language: 'markdown',
          code: '# 7. Store money as integer centavos\nStatus: Accepted\n## ___\nTotals were stored as floats. Rounding errors caused order totals to be off by one centavo against settlement reports.\n## ___\nAll amounts are stored and calculated as integer centavos.\n## ___\n- Every money field needs a migration and a code change.\n## Alternatives considered\n- Decimal columns: correct, but our reporting tools handled them poorly.',
          blanks: [
            {
              answers: ['Context'],
            },
            {
              answers: ['Decision'],
            },
            {
              answers: ['Consequences'],
            },
          ],
          bank: ['Context', 'Decision', 'Consequences', 'Summary', 'Date'],
          hints: [
            'Each section answers a question: what was going on, what did you choose, what follows from it?',
            'The first one describes the problem that made a decision necessary.',
            'The last one lists what is good and bad about the choice, such as the migration work.',
          ],
          explanation: 'An ADR records one decision: the context, what you decided, and the consequences, plus what else you considered.',
        },
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **decision record** is a short note that answers 'why did we do it this way?' months later, when nobody remembers. Read the example above as four short answers. **Context** says what problem we had, **Decision** says what we chose, **Consequences** says what gets easier and what gets harder, and **Alternatives** says what else we considered. **ADR** stands for Architecture Decision Record. An assistant can tidy your notes into this shape, but only you know the real reasons. That is why the prompt tells it to write [TODO] where something is missing, instead of inventing a reason.",
      },
      { type: 'prompt', label: 'Draft an ADR from your notes', text: 'Draft an Architecture Decision Record from my notes below. Use these sections: Title, Status, Date, Context, Decision, Consequences (good and bad), Alternatives considered. Keep it under 300 words and in plain language. Use only what is in my notes; where something is missing, write [TODO: ...] instead of inventing it. My notes: [paste your notes, meeting summary or Slack thread with names removed].' },
      { type: 'paragraph', text: "The '[TODO]' instruction matters. Without it, assistants fill gaps with confident, reasonable-sounding reasons that nobody actually had. A fake rationale in an ADR is worse than none, because people will trust it." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-10-scenario-1',
          kind: 'scenario',
          title: 'The reason nobody gave',
          prompt: 'What do you do with that sentence?',
          concept: 'documenting decisions honestly',
          situation: 'Your notes say you moved away from Decimal columns but not why. The AI\'s ADR draft says: "Decimal columns were rejected because they are 40% slower." Nobody on the team measured that.',
          options: [
            {
              text: 'Keep it. It sounds reasonable and fills the gap.',
              consequence: 'A fake rationale is worse than none, because people will trust it.',
              quality: 'poor',
            },
            {
              text: 'Replace it with [TODO: why were Decimal columns rejected?] and ask the people involved.',
              consequence: 'The gap stays visible until someone fills it with the real reason, which is the part only you can supply.',
              quality: 'best',
            },
            {
              text: 'Soften it to "were rejected for performance reasons".',
              consequence: 'It is still a reason nobody gave, only vaguer and harder to question.',
              quality: 'poor',
            },
            {
              text: 'Delete the Alternatives section from the ADR.',
              consequence: 'No fake reason remains, but the record loses what was considered, which new people often ask about.',
              quality: 'acceptable',
            },
          ],
          hints: [
            'Where did the 40% come from?',
            'This is why the prompt says to use only your notes.',
            'Leave a visible [TODO] instead of a made-up reason.',
          ],
          explanation: 'Assistants fill gaps with confident, reasonable-sounding reasons nobody had. Ask for [TODO] and supply the why yourself.',
        },
      },
      { type: 'heading', text: 'Other docs worth drafting with AI' },
      { type: 'list', items: [
        '**READMEs:** how to set up, run, test and deploy. Then follow the steps on a clean machine to prove they work.',
        '**Runbooks:** what to do when an alert fires. Have someone on call review it.',
        '**Docstrings and comments:** ask for comments that explain why, not what the next line does.',
        '**API references:** generated from code, then checked against real requests.',
      ] },
      { type: 'warning', text: 'Docs drafted from code describe what the code does, including its bugs. Check every claim against real behaviour before you publish.' },
      { type: 'tip', text: 'Point your instructions file to the ADR folder. Then the assistant can read past decisions before it suggests something you already rejected.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Documentation is now input for the agents on your team, so stale docs mislead tools as well as people. Keep ADRs next to the code in a numbered folder and, as Martin Fowler describes, treat an accepted ADR as immutable: when a decision changes, write a new one that supersedes it instead of editing history, so an agent reading the folder can tell which decisions are current. Put the decision first and keep each record to about a page: the rationale, serious alternatives, consequences, and the conditions that should trigger a rethink. Make docs testable. Run the README's setup commands in CI on a clean checkout, check links, generate API references from the code, and review them against real requests. Give the assistant the ADR folder as context and ask it to flag when a proposed change conflicts with an accepted decision.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Martin Fowler's page on Architecture Decision Records advises keeping ADRs in the source repository (commonly `doc/adr`), one file each with an increasing number and a name for the decision. It says an accepted ADR should never be reopened or changed but superseded, lists the statuses proposed, accepted and superseded, and suggests putting the decision first, followed by a brief rationale, serious alternatives and consequences, in about a page.",
        checked: CHECKED,
        sources: [SRC.fowlerAdr],
      },
      {
        type: 'takeaways',
        items: [
          'Assistants draft the what; you supply the why, what you rejected and what will hurt the next person.',
          'An ADR records one decision: context, decision, consequences and alternatives.',
          'Tell the assistant to use only your notes and to write [TODO] for gaps.',
          'Check docs drafted from code against real behaviour before publishing.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-10-q1',
        prompt: 'What is the most valuable part of an ADR that only you can provide?',
        choices: [
          'The file name and number',
          'The context and reasons behind the decision, including alternatives rejected',
          'The Markdown formatting',
        ],
        answer: 1,
        explanation: 'The why is not in the code, so a tool cannot know it. That is what makes an ADR useful.',
      },
      {
        id: 'experienced-10-q2',
        prompt: 'Why tell the assistant to write [TODO] where your notes are missing information?',
        choices: [
          'So it does not invent a plausible rationale nobody actually had',
          'Because ADRs must contain TODOs',
          'To make the document longer',
          'So it runs faster',
        ],
        answer: 0,
        explanation: 'Invented reasons look trustworthy and mislead future readers.',
      },
      {
        id: 'experienced-10-q3',
        prompt: 'How do you prove an AI-drafted README is correct?',
        choices: [
          'Ask the assistant to double-check it',
          'Check the spelling',
          'Follow its setup steps on a clean machine or fresh clone',
        ],
        answer: 2,
        explanation: 'Running the steps is the only reliable proof that setup docs work.',
      },
      {
        id: 'experienced-10-q4',
        audience: { max: 'beginner' },
        prompt: 'Which of these is a good use of a decision record (ADR)?',
        choices: [
          "Recording why the team stores money as whole centavos",
          "Storing the team's passwords in one safe place that everyone can open when needed",
          "Listing every file in the project, together with a short note about each one",
          "Replacing the project's tests, so that nobody has to maintain them any more",
        ],
        answer: 0,
        explanation: 'A decision record keeps the reason behind a choice, so people months later do not have to guess. It is not a place for passwords or file lists.',
      },
      {
        id: 'experienced-10-q5',
        audience: { min: 'advanced' },
        prompt: 'An accepted ADR chose a message queue. Six months later the team switches to scheduled jobs. What does the ADR practice recommend?',
        choices: [
          "Edit the old ADR so that it describes the new design and keep the same number",
          "Delete the old ADR to avoid confusion, since the decision is no longer in force",
          "Write a new ADR that supersedes the old one, and mark the old one superseded",
          "Keep the old ADR exactly as it is and say nothing; the code is the record",
        ],
        answer: 2,
        explanation: 'Accepted ADRs are not rewritten. A new record that supersedes the old one preserves the history of why each decision was made and which one is current.',
      },
    ],
    task: {
      title: 'Write one decision down',
      minutes: 15,
      steps: [
        'Pick a decision in your project that people keep asking about.',
        'Write rough notes: what, why, what else you considered.',
        'Use the ADR prompt to draft it, then fill every [TODO] yourself.',
        'Save it in `docs/adr/` (or a personal repo) and link the folder from your instructions file.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Write three sentences about one choice you made in a practice project: what problem it solved, what you chose and what you gave up. Ask the assistant to turn them into Context, Decision and Consequences without adding anything new.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Add a CI step that runs your README's setup commands on a clean checkout, and an ADR template with status values.",
          "Take one old decision and write a superseding ADR for it, including the conditions that should trigger a rethink.",
        ],
      },
    ],
  },
  {
    id: 'experienced-11',
    day: 11,
    title: 'Agentic workflows: plan, implement, verify',
    summary: 'Let an agent do multi-step work while you keep control of the plan, the scope and the final diff.',
    intro: {
      objectives: [
        'Run the plan, implement, verify loop with an agent',
        'Review an agent plan before any code is written',
        'Treat "all tests pass" from an agent as a claim and check it yourself',
        'Keep control with approval prompts, a narrow scope and a stop after repeated failures',
      ],
      why: 'An agent can finish a whole small task while you review, or produce a 30-file diff nobody understands. The loop you already know from good engineering is what separates the two.',
    },
    minutes: 15,
    skills: ['ai-workflow', 'safe-change'],
    body: [
      { type: 'paragraph', text: "Agentic tools read files, edit code, run commands and tests, and loop until they think they are done. Used well, they handle a whole small task while you review. Used badly, they produce a 30-file diff you do not understand. The difference is a simple loop you already know from good engineering: plan, implement, verify." },
      {
        type: 'diagram',
        format: 'json',
        source: {
          kind: 'flow',
          title: 'Plan, implement, verify',
          direction: 'TD',
          summary: 'The agent writes a plan, you review it and correct it until it is right, the agent implements one step at a time, and you verify by running checks and reading the diff. A failed check sends you back to implement.',
          nodes: [
            {
              id: 'plan',
              label: 'Agent writes a plan',
              shape: 'rounded',
              note: 'Ask for a plan before any code and read it like a design review.',
            },
            {
              id: 'ok',
              label: 'Plan OK?',
              shape: 'diamond',
              note: 'Fixing a plan costs one message; fixing a wrong implementation costs an afternoon.',
            },
            {
              id: 'build',
              label: 'Implement one step',
              shape: 'box',
              note: 'On a branch, never directly on main.',
            },
            {
              id: 'verify',
              label: 'You verify',
              shape: 'box',
              note: 'Run the checks yourself, read the diff, and for anything users touch, run the app.',
            },
            {
              id: 'good',
              label: 'Checks pass?',
              shape: 'diamond',
            },
            {
              id: 'done',
              label: 'Done',
              shape: 'circle',
            },
          ],
          edges: [
            {
              from: 'plan',
              to: 'ok',
            },
            {
              from: 'ok',
              to: 'plan',
              label: 'No: correct it',
              dashed: true,
            },
            {
              from: 'ok',
              to: 'build',
              label: 'Yes',
            },
            {
              from: 'build',
              to: 'verify',
            },
            {
              from: 'verify',
              to: 'good',
            },
            {
              from: 'good',
              to: 'build',
              label: 'No',
              dashed: true,
            },
            {
              from: 'good',
              to: 'done',
              label: 'Yes',
            },
          ],
        },
        caption: 'The loop you already know from good engineering',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "An **agent** is an AI tool that does more than answer: it can open files, change them, run commands, look at the result and try again, until it thinks the job is done. That is powerful and risky, like handing your bike to a helper: you want to know where they plan to ride before they leave. So you ask for a **plan** first and read it, you let the agent work in small steps, and you **verify**, which means checking the result yourself instead of trusting its report. A **terminal command** is a line of text that tells the computer to do something, and some, like deleting files, cannot be undone. 'AI Agents and Agentic Coding' covers this in depth.",
      },
      { type: 'heading', text: '1. Plan' },
      { type: 'paragraph', text: "Ask for a plan before any code. Read it like a design review. Is it touching the right files? Is it changing things it should not? Did it miss a case you know about? Fixing a plan costs one message. Fixing a wrong implementation costs an afternoon." },
      { type: 'prompt', label: 'Plan before code', text: 'Task: [describe the change and why]. Before writing any code, read the relevant files and give me a plan: the files you will change, what you will change in each, the tests you will add or update, and any risks or questions. Keep it under 15 bullet points. Do not edit anything until I reply "approved".' },
      { type: 'heading', text: '2. Implement in steps' },
      { type: 'paragraph', text: 'Approve the plan, then let it implement one step or a few steps at a time. For bigger tasks ask it to stop after each step and report. Work on a branch, never directly on main.' },
      { type: 'heading', text: '3. Verify' },
      { type: 'paragraph', text: "The agent saying 'all tests pass' is a claim, not proof. Run the checks yourself or read the actual command output. Then read the diff. Then, for anything users touch, run the app and try it." },
      { type: 'code', language: 'bash', label: 'Your own verification, every time', code: `git status                     # which files changed?
git diff --stat main...HEAD    # how big is it?
pytest                          # or: npm test
ruff check .                    # or: npx eslint .
git diff main...HEAD            # read it all` },
      {
        type: 'activity',
        activity: {
          id: 'experienced-11-scenario-1',
          kind: 'scenario',
          title: 'All tests pass',
          prompt: 'What do you do before merging?',
          concept: 'verifying agent output',
          situation: 'The task was to add one field. The agent reports "All tests pass" and its change touches 30 files.',
          options: [
            {
              text: 'Merge it: the agent said the tests pass.',
              consequence: 'That is a claim, not proof. A 30-file diff for one field has not been read.',
              quality: 'poor',
            },
            {
              text: 'Run the checks yourself and read the full diff. Ask why 30 files changed, and narrow the scope if it sprawled.',
              consequence: 'You see real command output and the real change, and the scope question catches the sprawl.',
              quality: 'best',
            },
            {
              text: 'Run the tests yourself, and merge if they pass.',
              consequence: 'Better than trusting the report, but a 30-file diff for one field still has to be read.',
              quality: 'acceptable',
            },
            {
              text: 'Ask the agent to run the tests again and trust the second answer.',
              consequence: 'The same claim repeated is not verification.',
              quality: 'poor',
            },
          ],
          hints: [
            '"All tests pass" from the agent is a claim.',
            'Verification means reading real output and the whole diff.',
            'Compare the size of the change with the size of the task.',
          ],
          explanation: 'Plan, implement, verify: the agent\'s report is not proof. Run the checks, read the diff and keep the scope limited.',
        },
      },
      { type: 'heading', text: 'Keeping control' },
      { type: 'list', items: [
        'Keep approval prompts on for commands that install packages, delete files, push, or touch databases.',
        'Never give an agent production credentials or let it push or deploy on its own.',
        'Limit the scope in the prompt: name the folders it may change.',
        'If it loops on the same failure two or three times, stop it. It is missing context; give it some or take over.',
        'Start a fresh session for a new task so old context does not leak in.',
      ] },
      { type: 'warning', text: 'An agent that can run any terminal command can also run destructive ones. Read every command it asks to run, especially `rm`, `git push --force`, database migrations and anything with `sudo`.' },
      { type: 'tip', text: 'Good first agent tasks: adding a field end to end in a well-tested app, upgrading a minor dependency and fixing the fallout, or writing tests for an untested module. Bad first tasks: anything with payments, auth or data migrations.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "The loop scales into a harness: the tools an agent may call, permissions that bound them, and checks that run whether or not the model remembers to. Prefer deterministic enforcement for rules that must hold. In Claude Code, hooks run your own commands at points in the agent's lifecycle, so a formatter, a test run or a block on a dangerous command always happens, whereas a sentence in an instructions file is only context. Split work across subagents when context isolation helps: each runs in its own context window with its own tool allowlist and returns only a summary, which keeps exploration noise out of the main session. Match structure to the task. Anthropic separates predefined workflows (chaining, routing, parallelisation, orchestrator-workers, evaluator-optimizer) from open-ended agents, and advises the simplest design that works, tested in a sandbox. Give every run a budget: steps, time and a stop condition.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "For anything bigger than a few files, put the specification first. Write what the change must do, its constraints and acceptance criteria, and the tests that prove them, review that, and only then let the agent plan and implement against it. This is spec-driven development; GitHub's open-source Spec Kit, for example, walks an agent through project principles, a specification, a technical plan, tasks and implementation, with you reviewing each step's result.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Claude Code's documentation describes hooks as user-defined shell commands run at specific points in its lifecycle, giving deterministic control instead of relying on the model to choose to run them, and subagents as Markdown-defined assistants that run in their own context window with a custom system prompt and restricted tools (a `tools` allowlist or `disallowedTools`), returning a summary to the main conversation. Anthropic's 'Building effective agents' contrasts workflows, which follow predefined code paths, with agents that direct their own process, and recommends the simplest workable design with sandboxed testing. GitHub's Spec Kit README describes a spec-driven process from principles through specification, plan and tasks to implementation.",
        checked: CHECKED,
        sources: [SRC.hooks, SRC.subagents, SRC.effectiveAgents, SRC.specKit],
      },
      {
        type: 'takeaways',
        items: [
          'Agents loop through files, edits and commands; the control is in plan, implement, verify.',
          'Ask for a plan first and correct it before any code is written.',
          'Implement a step or a few steps at a time, on a branch.',
          '"All tests pass" is a claim: run the checks yourself and read the diff.',
          'Keep approval prompts on, never give agents production credentials, and stop a loop after two or three failures.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-11-q1',
        prompt: 'Why review the agent\'s plan before it writes code?',
        choices: [
          'Fixing a plan is much cheaper than fixing a wrong implementation',
          'Agents cannot write code without a plan',
          'It makes the agent faster at typing',
        ],
        answer: 0,
        explanation: 'A wrong file choice or missed case is a one-message fix at the plan stage.',
      },
      {
        id: 'experienced-11-q2',
        prompt: 'The agent reports "all tests pass". What do you do?',
        choices: [
          'Merge immediately',
          'Ask it to say it again',
          'Delete the tests',
          'Run the checks yourself or read the real output, then read the diff',
        ],
        answer: 3,
        explanation: 'A report is a claim. Your own verification is the proof.',
      },
      {
        id: 'experienced-11-q3',
        prompt: 'The agent has failed on the same error three times. What is the best move?',
        choices: [
          'Let it keep trying overnight',
          'Stop it, then give it the missing context or take over',
          'Give it production credentials so it can see more',
        ],
        answer: 1,
        explanation: 'Repeated failure means it lacks information. More attempts rarely help.',
      },
      {
        id: 'experienced-11-q4',
        audience: { max: 'beginner' },
        prompt: 'Why ask an agent for a plan before it changes anything?',
        choices: [
          "Because a plan makes the agent type faster once it starts changing files",
          "Because agents are unable to work at all unless a plan file exists first",
          "So that the agent forgets the earlier instructions you gave it in the session",
          "So you can read it and correct a wrong idea before any file changes",
        ],
        answer: 3,
        explanation: 'Changing a plan costs one message, while undoing a wrong change costs much more. Reading the plan first is the cheapest check you have.',
      },
      {
        id: 'experienced-11-q5',
        audience: { min: 'advanced' },
        prompt: 'One rule must always hold: the test suite runs after every file edit. Where is it most reliably enforced?',
        choices: [
          "As a sentence in the instructions file, which the assistant reads at the start of the session",
          "In the prompt at the start of each session, written in the strongest wording you can find",
          "In a hook that runs the tests after edits, since hooks run even if the model forgets",
          "By asking a second agent to remind the first one to run the tests after every edit it makes",
        ],
        answer: 2,
        explanation: 'Instructions and prompts are context that a model may follow imperfectly. A hook is a command your tooling runs deterministically, so the rule holds every time.',
      },
    ],
    task: {
      title: 'Run one full loop',
      minutes: 20,
      steps: [
        'Pick a small, well-tested task on a branch (personal or approved repository).',
        'Use the plan prompt and correct the plan at least once before approving.',
        'Let the agent implement, then run tests and lint yourself and read the full diff.',
        'Write down how long it took and what you had to correct. You will use these notes on day 15.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask an assistant for a plan to add one small thing to a practice project, such as a footer line. Read the plan, write down one step you do not understand, and ask the assistant to explain that step before you approve anything.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Run one task with two subagents of narrow scope, a read-only explorer and an implementer, and add one hook that blocks a command you never want run.",
          "Record steps, time and what you had to correct, and note which rules you moved from the instructions file into enforcement.",
        ],
      },
    ],
  },
  {
    id: 'experienced-12',
    day: 12,
    title: 'Security review and dependency risk',
    summary: 'Know the security mistakes AI makes most, and check every package it suggests before you install it.',
    intro: {
      objectives: [
        'Spot common security mistakes in AI-written code, such as injection and missing authorisation',
        'Fix a SQL query built from user input by using a placeholder',
        'Check a suggested package on its registry page and source before installing it',
        'Explain why an AI security pass is an extra and not an audit',
      ],
      why: 'AI learned from a lot of insecure public code, so you stay the security reviewer, and an invented or look-alike package name is a new way for an attack to reach your project.',
    },
    minutes: 15,
    skills: ['review-security'],
    body: [
      { type: 'paragraph', text: "AI assistants learned from a huge amount of public code, and a lot of public code is insecure. They will happily write SQL by string formatting, skip an authorisation check, or hardcode a key in an example that ends up in production. You are the security reviewer." },
      { type: 'heading', text: 'Mistakes to look for' },
      { type: 'list', items: [
        'SQL or shell commands built from user input.',
        'Missing authorisation: the endpoint checks that you are logged in, not that the record is yours.',
        'Secrets in code, config committed to Git, or keys shipped inside a mobile or web app.',
        'Overly open CORS, disabled certificate checks, or debug mode left on.',
        'Unsafe deserialisation or file uploads without type and size limits.',
        'Personal data written to logs.',
      ] },
      { type: 'paragraph', text: 'Authorisation is a check AI code often skips. Authentication asks who you are. Authorisation asks whether you may touch this particular record. An endpoint that confirms you are logged in and then returns any order by its id has the first and not the second.' },
      { type: 'code', language: 'python', label: 'The classic one, and its fix', code: `import sqlite3

conn = sqlite3.connect("shop.db")


# Unsafe: user input becomes part of the SQL text
def find_user_unsafe(email: str):
    return conn.execute(
        f"SELECT id, name FROM users WHERE email = '{email}'"
    ).fetchone()


# Safe: the driver sends the value separately from the SQL
def find_user(email: str):
    return conn.execute(
        "SELECT id, name FROM users WHERE email = ?", (email,)
    ).fetchone()` },
      {
        type: 'activity',
        activity: {
          id: 'experienced-12-fix-bug-1',
          kind: 'fix-bug',
          title: 'The classic one',
          prompt: 'This function builds its SQL from user input. Find the line with the bug, then pick the safe version.',
          concept: 'sql injection',
          language: 'python',
          code: 'import sqlite3\n\nconn = sqlite3.connect("shop.db")\n\ndef find_orders(customer_id: str):\n    return conn.execute(f"SELECT id, total FROM orders WHERE customer_id = \'{customer_id}\'").fetchall()',
          bugLine: 6,
          fixes: [
            {
              line: 'return conn.execute("SELECT id, total FROM orders WHERE customer_id = ?", (customer_id,)).fetchall()',
              correct: true,
              why: 'Yes. The driver sends the value separately from the SQL, so input can never become part of the query.',
            },
            {
              line: 'return conn.execute(f"SELECT id, total FROM orders WHERE customer_id = \'{customer_id.strip()}\'").fetchall()',
              correct: false,
              why: 'Trimming spaces does not stop a quote or SQL fragment. The input is still pasted into the query text.',
            },
            {
              line: 'return conn.execute("SELECT id, total FROM orders WHERE customer_id = \'" + customer_id + "\'").fetchall()',
              correct: false,
              why: 'Joining strings with + is the same mistake as the f-string: user input becomes part of the SQL text.',
            },
          ],
          lineNote: 'That line is fine. The bug is in the line that builds the query.',
          hints: [
            'Which line puts the user\'s value into the SQL text?',
            'Anything that builds the query as a string from `customer_id` is open to injection.',
            'Use a placeholder in the SQL and pass the value as a separate argument.',
          ],
          explanation: 'Placeholders keep the value separate from the SQL text. Building the query from strings, however it is joined, lets user input change what the query means.',
        },
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "**SQL** is the language programs use to ask a database for data. **Injection** happens when a program builds that question by gluing a visitor's typed words into it, so a visitor can type extra commands instead of a name. The fix is a **placeholder**: the `?` in the safe version marks a gap that the database fills with the visitor's text as plain data, never as commands. Think of a form with a box for the name: whatever is written inside the box is treated as a name and nothing more. A **dependency** is someone else's code that your project uses. AI sometimes suggests names that do not exist, so look every one up before you install it.",
      },
      { type: 'heading', text: 'Dependencies the AI suggests' },
      { type: 'paragraph', text: "Assistants sometimes suggest packages that do not exist, or names close to a real package. Attackers watch for this and publish malicious packages under those names. Before you install anything an assistant suggests, check it yourself." },
      { type: 'list', ordered: true, items: [
        'Find the package on its registry page (npm, PyPI) and its source repository.',
        'Check that it is actively maintained and widely used, and who publishes it.',
        'Check the licence is compatible with your project.',
        'Ask whether you need a dependency at all; a few lines of your own code may be safer.',
        'Run your audit tool after installing, for example `npm audit` or `pip-audit`.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'experienced-12-scenario-1',
          kind: 'scenario',
          title: 'A package you have never heard of',
          prompt: 'What do you do before installing?',
          concept: 'dependency risk',
          situation: 'The assistant adds an import and tells you to run pip install for a package you have never heard of, to parse a date format.',
          options: [
            {
              text: 'Install it, then run pip-audit.',
              consequence: 'Auditing after is a good extra, but attackers publish malicious packages under names assistants tend to suggest, so the check has to come before the install.',
              quality: 'poor',
            },
            {
              text: 'Look it up on PyPI and its source repository first: who publishes it, whether it is maintained, its licence, and whether you need it at all.',
              consequence: 'This catches invented or look-alike names, and it may show a few lines of your own code are safer than a new dependency.',
              quality: 'best',
            },
            {
              text: 'Install it because the assistant sounded sure.',
              consequence: 'Assistants sometimes suggest packages that do not exist or names close to a real one.',
              quality: 'poor',
            },
          ],
          hints: [
            'The assistant can suggest a package that does not exist.',
            'Where would you find who publishes a package?',
            'Check the registry page and the source repository, and ask whether you need the dependency at all.',
          ],
          explanation: 'Check every package yourself before you install it: registry page, maintenance, licence, and whether you need it. Run your audit tool afterwards as well.',
        },
      },
      { type: 'prompt', label: 'Security pass on a diff', text: 'Act as an application security reviewer. Review this diff for: injection (SQL, shell, template), missing authentication or authorisation checks, secrets in code, unsafe handling of user input or file uploads, personal data in logs, and risky new dependencies. For each finding give the line, the realistic attack, and a concrete fix. If you see nothing serious, say so plainly rather than inventing issues. [paste diff]' },
      { type: 'warning', text: 'An AI security review is a helpful extra pass, not a security audit. For payments, authentication or personal data, follow your company\'s security process and get a qualified human review.' },
      { type: 'tip', text: 'Add a line to your instructions file: never build SQL or shell commands from strings, and never add a dependency without asking. It prevents a lot of review comments.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Map findings to a threat model rather than to a checklist. For code that calls models, OWASP's 2025 list for LLM applications is useful vocabulary: LLM03 supply chain, LLM05 improper output handling and LLM06 excessive agency are the entries most relevant when assistants add packages, handle model output and take actions. For dependencies, make installs reproducible and reviewable: commit lockfiles, install from them in CI (`npm ci` installs exactly what the lockfile records and fails if it disagrees with `package.json`), review lockfile diffs like code, restrict which registries you pull from, and treat a new transitive dependency as a change that needs an owner. Add static analysis and secret scanning as gates the assistant cannot waive, and give agents least privilege: no production credentials, and no network access you did not intend. Keep an AI security pass as a supplement to threat modelling and expert review.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "The OWASP Top 10 for LLM Applications 2025 lists LLM03 Supply Chain, LLM05 Improper Output Handling and LLM06 Excessive Agency among its ten entries. npm's documentation says `npm ci` is meant for automated environments, requires an existing lockfile, never modifies `package.json` or the lockfile, removes an existing `node_modules` first, and exits with an error if the lockfile and `package.json` disagree.",
        checked: CHECKED,
        sources: [SRC.owaspLlm, SRC.npmCi],
      },
      {
        type: 'takeaways',
        items: [
          'You are the security reviewer: AI learned from a lot of public code, and a lot of it is insecure.',
          'Look for injection, missing authorisation, secrets in code, open CORS and debug mode, and personal data in logs.',
          'Use parameterised queries; never build SQL or shell commands from strings.',
          'Check every suggested package before installing, then audit.',
          'An AI security pass is an extra, not an audit.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-12-q1',
        prompt: 'Why is the f-string query in the example unsafe?',
        choices: [
          'F-strings are slow',
          'SQLite does not support f-strings',
          'User input becomes part of the SQL text, allowing injection',
        ],
        answer: 2,
        explanation: 'Parameterised queries keep data separate from SQL so input cannot change the query.',
      },
      {
        id: 'experienced-12-q2',
        prompt: 'The assistant suggests installing a package you have never heard of. What do you do first?',
        choices: [
          'Check its registry page, source, maintainers and licence',
          'Install it and run the tests',
          'Ask the assistant whether it is safe and trust the answer',
        ],
        answer: 0,
        explanation: 'Suggested packages can be misspelled, abandoned or even malicious look-alikes. Verify before installing.',
      },
      {
        id: 'experienced-12-q3',
        prompt: 'An endpoint checks that the user is logged in, then returns any order by its id. What is missing?',
        choices: [
          'Input validation of the id format only',
          'Rate limiting only',
          'Caching',
          'An authorisation check that the order belongs to that user',
        ],
        answer: 3,
        explanation: 'Being logged in is authentication. Checking ownership is authorisation, and AI code often skips it.',
      },
      {
        id: 'experienced-12-q4',
        audience: { max: 'beginner' },
        prompt: 'What does a `?` placeholder in a database query protect against?',
        choices: [
          "Spelling mistakes in the name of a table or column that you type by hand",
          "A visitor's typed text being treated as commands instead of plain data",
          "Queries that take too long to run when the table holds a very large number of rows",
          "Forgetting to log in to the database before you ask it for anything",
        ],
        answer: 1,
        explanation: 'With a placeholder, the database receives the visitor\'s words separately from the command, so they can only ever be data.',
      },
      {
        id: 'experienced-12-q5',
        audience: { min: 'advanced' },
        prompt: 'A pull request adds an assistant-suggested package that also pulls in three other packages. Which control best reduces supply-chain risk in CI?',
        choices: [
          "Install with `npm install` so that the newest versions are always picked up automatically",
          "Run the tests once and trust a green result, since the tests exercise the new package",
          "Commit the lockfile, install from it with `npm ci`, and review the lockfile diff",
          "Ask the assistant whether the package is safe and keep its answer in the pull request",
        ],
        answer: 2,
        explanation: 'A committed lockfile plus a lockfile-only install makes CI use exactly the reviewed versions and fail on drift. A passing test run or an assistant\'s opinion says nothing about what the packages contain.',
      },
    ],
    task: {
      title: 'Security pass on your own code',
      minutes: 20,
      steps: [
        'Pick a branch or module that handles user input.',
        'Run the security prompt on its diff in your approved assistant.',
        'Run your dependency audit (`npm audit`, `pip-audit` or your language\'s tool) and read the result.',
        'Fix or file one real finding, and note one false alarm.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "In a practice file, write a made-up search query twice: once with the visitor's text glued in and once with a `?` placeholder. Ask the assistant to explain the difference in plain words.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Check one recent AI-suggested dependency: its registry page, publisher, licence, the lockfile diff, and whether a few lines of your own code would do. Add a CI step that installs from the lockfile and fails on drift.",
          "List which of OWASP's LLM03, LLM05 and LLM06 apply to one AI feature of yours and what control covers each.",
        ],
      },
    ],
  },
  {
    id: 'experienced-13',
    day: 13,
    title: 'Performance work with AI',
    summary: 'Measure first, let the assistant help read profiles and suggest changes, then measure again.',
    intro: {
      objectives: [
        'Follow the loop: define slow, measure, change one thing, measure again',
        'Give an assistant the profile and the hot code instead of the whole file',
        'Revert a change that did not move the measured number',
        'Name common real causes of slowness, such as a database query inside a loop',
      ],
      why: 'AI makes it cheap to produce clever optimisations that look advanced and save nothing. Measuring before and after keeps you from shipping risk for no gain.',
    },
    minutes: 15,
    skills: ['safe-change', 'ai-workflow'],
    body: [
      { type: 'paragraph', text: "Ask an assistant to 'make this faster' and it will rewrite code that looks slow. Often that is not the code that is slow. You know the old rule: measure first. It matters more now, because AI makes it cheap to produce clever optimisations that change behaviour and save nothing." },
      { type: 'heading', text: 'The loop' },
      { type: 'list', ordered: true, items: [
        '**Define slow.** Which request, job or screen, and what number would be good enough?',
        '**Measure.** Profile it, or time it with realistic data.',
        '**Ask.** Give the assistant the profile output and the hot code, not the whole file.',
        '**Change one thing.** Keep the tests green.',
        '**Measure again.** If the number did not move, revert.',
      ] },
      {
        type: 'diagram',
        format: 'json',
        source: {
          kind: 'flow',
          title: 'Measure, change, measure',
          direction: 'TD',
          summary: 'Define what slow means, measure with realistic data, ask the assistant with the profile and the hot code, change one thing, and measure again. If the number moved, keep the change; if not, revert it.',
          nodes: [
            {
              id: 'define',
              label: 'Define slow',
              shape: 'rounded',
              note: 'Which request, job or screen, and what number would be good enough?',
            },
            {
              id: 'measure',
              label: 'Measure',
              shape: 'box',
              note: 'Profile it, or time it with realistic data.',
            },
            {
              id: 'ask',
              label: 'Ask with profile and hot code',
              shape: 'box',
              note: 'Give the profile output and the hot code, not the whole file.',
            },
            {
              id: 'change',
              label: 'Change one thing',
              shape: 'box',
              note: 'Keep the tests green.',
            },
            {
              id: 'again',
              label: 'Measure again',
              shape: 'box',
            },
            {
              id: 'moved',
              label: 'Did the number move?',
              shape: 'diamond',
            },
            {
              id: 'keep',
              label: 'Keep it',
              shape: 'circle',
            },
            {
              id: 'revert',
              label: 'Revert',
              shape: 'circle',
            },
          ],
          edges: [
            {
              from: 'define',
              to: 'measure',
            },
            {
              from: 'measure',
              to: 'ask',
            },
            {
              from: 'ask',
              to: 'change',
            },
            {
              from: 'change',
              to: 'again',
            },
            {
              from: 'again',
              to: 'moved',
            },
            {
              from: 'moved',
              to: 'keep',
              label: 'Yes',
            },
            {
              from: 'moved',
              to: 'revert',
              label: 'No',
            },
          ],
        },
        caption: 'The loop from this lesson',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "**Performance** means how fast something runs. To **measure** is to time it with a stopwatch instead of guessing. A **profile** is a report listing which parts of a program took the most time, like a receipt showing where your money went. The lesson's rule is: look at the receipt before you try to save money. Assistants often rewrite code that looks slow but is not the slow part, so you can end up doing extra work and risking new bugs for no gain. After each change, measure again, and if the number did not improve, undo the change.",
      },
      { type: 'code', language: 'bash', label: 'Profile a Python script, sorted by cumulative time', code: `python -m cProfile -s cumtime app.py > profile.txt
head -40 profile.txt` },
      { type: 'code', language: 'python', label: 'A micro-benchmark you can run', code: `import timeit

setup = "data = list(range(10_000)); lookup = set(data)"

print("list:", timeit.timeit("9_999 in data", setup=setup, number=1_000))
print("set: ", timeit.timeit("9_999 in lookup", setup=setup, number=1_000))` },
      { type: 'paragraph', text: "The benchmark shows the kind of win worth having: a membership check in a list scans every item, while a set looks it up directly. Real-world slowness is more often one of a few patterns: a database query inside a loop, a missing index, loading far more data than needed, or calling a network service again and again. Assistants are good at spotting these once you point them to the right code." },
      { type: 'prompt', label: 'Read a profile with me', text: 'Here is profiler output for a slow request and the code of the top three functions by cumulative time. [paste]. Explain where the time is going in plain terms. Suggest up to three changes, ordered by expected impact, and for each say how to measure whether it worked and what behaviour it could change. Do not rewrite code that is not in the hot path.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-13-scenario-1',
          kind: 'scenario',
          title: 'Cleverer, not faster',
          prompt: 'What do you do with the rewrite?',
          concept: 'performance measurement',
          situation: 'You asked the assistant to speed up generate_report. It rewrote it with caching and a thread pool. The tests are green, but your timing script shows the same request time as before.',
          options: [
            {
              text: 'Keep it: the code looks more advanced.',
              consequence: 'You carry a cache and threads, with their risks, for no gain.',
              quality: 'poor',
            },
            {
              text: 'Revert the change: the number did not move.',
              consequence: 'An optimisation that does not move the measured number is only risk. You can profile again for the real hot spot.',
              quality: 'best',
            },
            {
              text: 'Profile again to look for the real hot path, and leave the rewrite in meanwhile.',
              consequence: 'A sound next step, but the unneeded cache and threads stay in the code and can change behaviour.',
              quality: 'acceptable',
            },
            {
              text: 'Ask for another optimisation on top, without measuring.',
              consequence: 'Stacking changes without measuring is how optimisations change behaviour and save nothing.',
              quality: 'poor',
            },
          ],
          hints: [
            'The tests pass, but what did the timing show?',
            'The loop ends with measuring again.',
            'If the number did not move, revert.',
          ],
          explanation: 'Measure first and after. A change that does not move the number should be reverted, not kept for looking clever.',
        },
      },
      { type: 'heading', text: 'Watch for' },
      { type: 'list', items: [
        'Caches added without a way to invalidate them.',
        'Concurrency added to code that shares state.',
        'Changed ordering or rounding in results.',
        'Optimisations that help a tiny benchmark but not the real request.',
      ] },
      { type: 'warning', text: 'Never paste production query results or customer data into an assistant to explain a slow query. Use the query plan and table sizes, not the rows.' },
      { type: 'tip', text: 'Keep your before and after numbers. A measured speed-up with the method written down is exactly the kind of evidence your case study on day 20 needs.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Define slow in the terms users and operators feel: a latency percentile such as p95 or p99, not an average, measured with realistic data volumes and concurrency. The most common production cause an assistant will not see from a single file is the N+1 pattern, one query for a list and one more per item. The fix is usually a join or a batched query, verified by counting queries. For databases, read the plan instead of guessing: in PostgreSQL, `EXPLAIN ANALYZE` actually executes the statement and reports real row counts and timings, so wrap data-changing statements in a transaction you roll back, and `BUFFERS` adds I/O detail. Pin the win with a regression guard, such as a query-count assertion or a latency budget in CI, because the next generated change will happily undo it.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'python',
        label: 'nplus1.py: count the queries (run: python nplus1.py)',
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript(
    """
    CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT);
    CREATE TABLE items  (id INTEGER PRIMARY KEY, order_id INTEGER, centavos INTEGER);
    CREATE INDEX items_order ON items(order_id);
    """
)
conn.executemany("INSERT INTO orders VALUES (?, ?)", [(i, f"c{i}") for i in range(1, 201)])
conn.executemany("INSERT INTO items (order_id, centavos) VALUES (?, ?)", [(i, 5_000) for i in range(1, 201) for _ in range(3)])

queries = 0


def run(sql, params=()):
    global queries
    queries += 1
    return conn.execute(sql, params).fetchall()


# N+1: one query for the orders, then one more per order
totals = {}
for order_id, _ in run("SELECT id, customer FROM orders"):
    totals[order_id] = run("SELECT SUM(centavos) FROM items WHERE order_id = ?", (order_id,))[0][0]
print("N+1 :", queries, "queries")

# One query with a join and GROUP BY
queries = 0
joined = dict(run("SELECT o.id, SUM(i.centavos) FROM orders o JOIN items i ON i.order_id = o.id GROUP BY o.id"))
print("join:", queries, "query; same answer:", joined == totals)`,
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "The PostgreSQL 18 documentation says that with the ANALYZE option, EXPLAIN actually executes the query and shows true row counts and run time, so side effects of data-changing statements happen as usual; to analyse one without keeping its changes, run it inside BEGIN and ROLLBACK. ANALYZE implicitly enables BUFFERS, which reports buffer hits, reads, dirtied and written per node.",
        checked: CHECKED,
        sources: [SRC.pgExplain],
      },
      {
        type: 'takeaways',
        items: [
          '"Make this faster" often rewrites code that is not the slow part. Measure first.',
          'The loop: define slow, measure, ask with the profile and hot code, change one thing, measure again.',
          'If the number did not move, revert.',
          'Common real causes: a query in a loop, a missing index, too much data, repeated network calls.',
          'Never paste production data to explain a slow query; use the query plan and table sizes.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-13-q1',
        prompt: 'What should you do before asking an assistant to optimise code?',
        choices: [
          'Measure where the time actually goes',
          'Rewrite the whole module',
          'Add caching everywhere',
        ],
        answer: 0,
        explanation: 'Without a measurement you may optimise code that was never the bottleneck.',
      },
      {
        id: 'experienced-13-q2',
        prompt: 'A change suggested by the assistant did not move your measured number. What now?',
        choices: [
          'Keep it because it looks cleverer',
          'Revert it and look again at the profile',
          'Add another optimisation on top',
        ],
        answer: 1,
        explanation: 'A change with no measured benefit adds risk and complexity for nothing.',
      },
      {
        id: 'experienced-13-q3',
        prompt: 'Which is a common real cause of slow web requests?',
        choices: [
          'Using descriptive variable names',
          'Having too many comments',
          'Writing tests',
          'A database query inside a loop',
        ],
        answer: 3,
        explanation: 'One query per item multiplies round trips. Batching or joining usually fixes it.',
      },
      {
        id: 'experienced-13-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a "profile" in this lesson?',
        choices: [
          "A report showing which parts of a program take the most time",
          "The picture and name shown on your account page when you sign in",
          "A copy of the program with all of its comments removed to make it smaller",
          "A list of the bugs that were found by the tests in the last run",
        ],
        answer: 0,
        explanation: 'A profile is the receipt for time: it shows where a program spends it, so you improve the real slow part instead of guessing.',
      },
      {
        id: 'experienced-13-q5',
        audience: { min: 'advanced' },
        prompt: 'A list endpoint takes two seconds, and the log shows 201 database queries for 200 rows. Which fix and check fit best?',
        choices: [
          "Add a thread pool around the queries and compare the average time before and after",
          "Cache the whole response forever so that the slow part is no longer visible to users",
          "Ask the assistant to make the function faster and merge if the tests are green",
          "Replace the per-row queries with one join, then check query count and p95",
        ],
        answer: 3,
        explanation: 'One query per row is the N+1 pattern. Removing the repeated queries addresses the cause, and checking both the query count and a latency percentile proves it. Threads and caches hide or add risk, and green tests do not measure speed.',
      },
    ],
    task: {
      title: 'Measure, change, measure',
      minutes: 20,
      steps: [
        'Run the `timeit` example and note both numbers.',
        'Pick one slow function or request you are allowed to share and profile or time it.',
        'Use the profile prompt and try the top suggestion on a branch.',
        'Measure again and record before, after and whether you kept the change.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Time a small piece of your own code with the `timeit` example, change one thing, and time it again. Write down both numbers and whether you kept the change.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Run the `nplus1.py` demo, then count the queries of one list endpoint of your own. Fix one N+1 and add a test that asserts the query count.",
          "Report p95 before and after, and write down how you generated the load.",
        ],
      },
    ],
  },
  {
    id: 'experienced-14',
    day: 14,
    title: 'Working with AI in a team',
    summary: 'Small pull requests, honest attribution, shared instructions, and helping juniors learn instead of skip learning.',
    intro: {
      objectives: [
        'Keep AI-assisted pull requests small, with a description that says what, why, how tested and what to check',
        'Follow or propose a team rule for attributing AI-assisted work',
        'Help a junior use AI as a tutor instead of a way to skip understanding',
      ],
      why: 'As a senior you help set the team habits, and AI can fill a review queue with large diffs nobody understands. Small changes, honest attribution and shared setup keep reviews real.',
    },
    minutes: 15,
    skills: ['team-impact', 'review-security'],
    body: [
      { type: 'paragraph', text: "One developer using AI well is a personal win. A team using it badly is a review queue full of huge pull requests nobody understands. As a senior, you help set the habits." },
      { type: 'heading', text: 'Keep pull requests small' },
      { type: 'paragraph', text: "AI makes big diffs cheap to write and just as expensive to review as ever. Agree on a size your team can review properly, and split work that grows past it. A good rule: one purpose per pull request, and a description that says what changed, why, how it was tested, and what the reviewer should look at closely." },
      { type: 'prompt', label: 'Draft a PR description from the diff', text: 'From this diff, draft a pull request description with: Summary (two sentences), Why, What changed (bullets), How I tested it, Risks and what reviewers should check closely. Do not claim tests or checks I have not told you I ran; leave [TODO] for those. [paste diff or summary]' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **pull request** is a proposal to add changes to a shared project. When a team shares one project, each person has to read the others' changes, so a huge proposal is hard to read well. AI makes it easy to produce a lot of code quickly, but reading it still takes human time. So the habit is: one purpose per pull request, small enough to read carefully, with a description that says what changed, why, how it was checked and what to look at closely. **Attribution** simply means saying openly that an assistant helped. If you are not sure what your team expects, ask.",
      },
      { type: 'heading', text: 'Attribution and disclosure' },
      { type: 'paragraph', text: "Teams handle AI attribution differently. Some ask for a note in the PR description, some use a Git commit trailer, some require nothing. Follow your team's rule; if there is none, propose one. Whatever the rule, the human author stays responsible for the change." },
      { type: 'code', language: 'text', label: 'One common style: a commit trailer', code: `Add discount_centavos to order summary

Plan and tests written by me; implementation drafted with an AI
assistant and reviewed line by line.

Co-authored-by: Name <email@example.com>` },
      { type: 'paragraph', text: 'GitHub reads `Co-authored-by:` trailers and shows co-authors on the commit. Some AI tools add their own trailer automatically. Check that what gets written matches your team\'s policy and your client\'s contract.' },
      { type: 'heading', text: 'Shared setup' },
      { type: 'list', items: [
        'Keep one instructions file in the repo, reviewed like code.',
        'Share prompts that work, for example in a `docs/prompts.md` file.',
        'Agree which tasks are fine for agents and which always need a human first (auth, payments, migrations).',
      ] },
      { type: 'heading', text: 'Mentoring juniors' },
      { type: 'paragraph', text: "Juniors with AI can produce working code before they understand it. That is a risk for them and for your codebase. Help them use AI as a tutor, not a crutch: ask them to explain their PR line by line, pair on debugging without the assistant sometimes, and encourage prompts like 'explain why' and 'what are the alternatives' instead of only 'write this'." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-14-scenario-1',
          kind: 'scenario',
          title: 'Working, but not understood',
          prompt: 'How do you handle the review?',
          concept: 'team practice with ai',
          situation: 'A junior opens a working 600-line pull request. In review they cannot explain two of its functions and say the assistant wrote them.',
          options: [
            {
              text: 'Approve it: it works and the tests pass.',
              consequence: 'You ship code nobody on the team understands, and the junior learns to skip understanding.',
              quality: 'poor',
            },
            {
              text: 'Ask them to explain the code line by line, split the work into smaller pull requests, and have them use the assistant as a tutor ("explain why", "what are the alternatives").',
              consequence: 'Small pull requests are reviewable, explaining builds understanding, and tutoring keeps the junior learning instead of skipping learning.',
              quality: 'best',
            },
            {
              text: 'Ban the junior from using the assistant.',
              consequence: 'It removes the symptom but not the habit, and wastes a useful learning tool.',
              quality: 'poor',
            },
          ],
          hints: [
            'The author must be able to explain every line.',
            'AI makes big diffs cheap to write and just as expensive to review.',
            'Use AI as a tutor, not a crutch.',
          ],
          explanation: 'Keep pull requests small, make the author responsible, and help juniors use AI to learn instead of to skip learning.',
        },
      },
      { type: 'warning', text: 'Do not use AI tools to judge people: performance reviews, hiring decisions or comparing teammates by AI usage. Those need human judgment and fairness.' },
      { type: 'tip', text: 'Run a short team retro after a month: what AI helped with, what it broke, what rule to add. Small, regular adjustments beat a big policy written once.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Turn habits into team infrastructure. Version the instructions file and the shared prompts like code and give them owners through CODEOWNERS, so a change to the rules gets the same review as a change to the system. Write the policy as a tiered table of tasks (agent allowed, agent with human review, human first) instead of a slogan, and repeat the expectations in the pull request template. Attribution is a convention. GitHub reads `Co-authored-by:` trailers, one per line after a blank line, in `Name <email>` form, but whether to use them for AI-assisted work is a team and contract decision, and a human must stay accountable. Treat review capacity as the scarce resource: watch review wait time and pull request size, and run a monthly retro that turns incidents into rule changes. Design mentoring deliberately, for example with no-assistant pairing sessions, because juniors can ship working code they cannot explain.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "GitHub's documentation says a co-author is added with one `Co-authored-by: NAME <EMAIL>` trailer per co-author at the end of the commit message, separated from the description by an empty line, using an email linked to the co-author's GitHub account (or their GitHub-provided no-reply address). Its CODEOWNERS documentation says owners are requested for review automatically on pull requests that change files they own.",
        checked: CHECKED,
        sources: [SRC.coAuthors, SRC.codeOwners],
      },
      {
        type: 'takeaways',
        items: [
          'Keep pull requests small: one purpose, with a description that says what, why, how tested and what to review closely.',
          'Follow your team\'s attribution rule, or propose one. The human author stays responsible.',
          'Share one instructions file and the prompts that work, and agree which tasks always need a human first.',
          'Help juniors use AI as a tutor: explain their PR line by line and ask for the why.',
          'Do not use AI tools to judge people.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-14-q1',
        prompt: 'Why do small pull requests matter even more with AI?',
        choices: [
          'Because AI cannot write big changes',
          'Because AI makes big diffs cheap to write but they are still costly to review',
          'Because GitHub limits PR size',
        ],
        answer: 1,
        explanation: 'Review time is the bottleneck. Small PRs keep review thorough.',
      },
      {
        id: 'experienced-14-q2',
        prompt: 'Your team has no rule for AI attribution. What is a good step?',
        choices: [
          'Propose a simple rule to the team and follow it consistently',
          'Hide AI use',
          'Put the AI tool as the only author',
        ],
        answer: 0,
        explanation: 'A shared, simple rule keeps things honest and consistent, and the human author stays responsible.',
      },
      {
        id: 'experienced-14-q3',
        prompt: 'A junior\'s PR works, but they cannot explain how. What helps them most?',
        choices: [
          'Approve it since it works',
          'Ban them from using AI',
          'Rewrite it yourself silently',
          'Walk through it together and have them explain each part before merging',
        ],
        answer: 3,
        explanation: 'Understanding the code is the learning. Explaining it line by line builds that and protects the codebase.',
      },
      {
        id: 'experienced-14-q4',
        audience: { max: 'beginner' },
        prompt: 'Why should a pull request stay small even when an assistant wrote the code?',
        choices: [
          "Small files always run faster than large ones, so a small change also speeds the program up",
          "People still have to read it carefully, and big changes are hard to read well",
          "Assistants can only write a few lines at a time before they must stop and wait for you",
          "GitHub refuses to accept any large file or change that it is sent",
        ],
        answer: 1,
        explanation: 'Writing code got cheaper, but reading it did not. A small change can be reviewed properly by a person; a huge one gets skimmed.',
      },
      {
        id: 'experienced-14-q5',
        audience: { min: 'advanced' },
        prompt: 'Your team wants AI-assisted work disclosed consistently. Which proposal is most workable?',
        choices: [
          "Fail CI on any commit that lacks an AI trailer, whether or not AI was used for the change",
          "Have the assistant add its own trailer automatically and then stop reviewing the commit",
          "Leave it to each developer's judgment so that nobody feels policed or slowed down",
          "Agree one convention in the PR template and keep the author accountable",
        ],
        answer: 3,
        explanation: 'A written, simple convention keeps disclosure consistent and keeps accountability with the human author. Forcing trailers mechanically, relying on judgment alone, or automating the trailer and skipping review each leave a gap.',
      },
    ],
    task: {
      title: 'Improve one team habit',
      minutes: 15,
      steps: [
        'Look at your last three pull requests. Note their size and whether AI was involved.',
        'Use the PR description prompt on your next PR and fill in the [TODO]s honestly.',
        'Find your team\'s attribution rule. If there is none, write a two-line proposal.',
        'Share one prompt that worked for you with a teammate.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Pick a small change you made and write its description with four headings: What, Why, How I checked it, What to look at closely. Ask the assistant to read the description and tell you what is unclear.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Draft a tiered AI-use table (agent allowed, agent with human review, human first) for your team. Link it from the pull request template and add a CODEOWNERS entry for the instructions file.",
          "Propose one no-assistant mentoring practice and one question for your next retro.",
        ],
      },
    ],
  },
  {
    id: 'experienced-15',
    day: 15,
    title: 'Measuring before and after, honestly',
    summary: 'Pick measures that matter, record a baseline, and watch out for feeling faster without being faster.',
    intro: {
      objectives: [
        'Choose measures that matter: cycle time, review time and rounds, PR size, defects, rework and time on task',
        'Record a baseline with the same method you will use after',
        'Spot the measuring traps: feeling, different tasks, lines of code, small samples, ignoring defects and gaming',
      ],
      why: 'People feel faster when code appears quickly even if review and rework take longer, so you and a sceptical manager need numbers collected the same way before and after.',
    },
    minutes: 15,
    skills: ['team-impact', 'ai-workflow'],
    body: [
      { type: 'paragraph', text: "People are poor judges of their own speed, and AI makes this worse: watching code appear feels fast even when the review and rework take longer. If you want to know whether AI helps you, or to convince a sceptical manager, you need numbers collected the same way before and after." },
      { type: 'heading', text: 'What to measure' },
      { type: 'list', items: [
        '**Cycle time:** from first commit (or ticket start) to merge.',
        '**Review time and rounds:** how long PRs wait, and how many review cycles they need.',
        '**PR size:** lines and files changed per PR.',
        '**Defects:** bugs found after merge that trace back to your changes.',
        '**Rework:** code you rewrote or reverted within a few weeks.',
        '**Time on task:** a simple log of start and finish times for comparable tasks.',
      ] },
      { type: 'paragraph', text: "The DORA research program's delivery measures, such as lead time for changes and change failure rate, are a good team-level reference. For a personal case study, cycle time, defects and a time log are enough." },
      { type: 'heading', text: 'Getting the numbers' },
      { type: 'code', language: 'bash', label: 'Pull your recent history', code: `# Your merged PRs with created and merged times (GitHub CLI)
gh pr list --state merged --author "@me" --limit 30 \\
  --json number,title,createdAt,mergedAt,additions,deletions

# Your commits in the last four weeks, with size
git log --since="4 weeks ago" --author="Your Name" --shortstat --date=short \\
  --pretty=format:"%h %ad %s"` },
      { type: 'prompt', label: 'Turn raw data into a table', text: 'Here is JSON from `gh pr list` for my merged pull requests. Calculate for each PR the hours from createdAt to mergedAt and the total lines changed. Then give the median and the range for both. Show your calculation method, and do not drop any PR without telling me why. [paste JSON]' },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "To **measure** means to write down numbers instead of trusting a feeling. **Cycle time** is how long a piece of work takes from start to finish. A **baseline** is your 'before' number, collected first so that you have something fair to compare with later. Watching code appear on screen feels fast, but the real time also includes checking it and fixing it, which is why feelings are poor evidence. A simple start is a notebook with columns for the task, start time, finish time, whether you used AI, and bugs found later. Compare similar tasks only: a quick fix and a whole new feature cannot be compared.",
      },
      { type: 'heading', text: 'Traps to avoid' },
      { type: 'list', items: [
        '**Feeling instead of measuring.** Write the times down as you go.',
        '**Different tasks.** Compare similar tasks, or the same kind of task, before and after.',
        '**Lines of code.** More lines is not more value. Often it is the opposite.',
        '**Too few samples.** Three tasks prove little. Say so in your write-up.',
        '**Ignoring defects.** Faster with more bugs is not better.',
        '**Gaming.** Once a number becomes a target, people optimise the number. Use measures to learn, not to rank teammates.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'experienced-15-match-1',
          kind: 'match',
          title: 'Spot the trap',
          prompt: 'These lines come from developers\' write-ups about AI and productivity. Match each line with the measuring trap it falls into.',
          concept: 'measuring ai impact',
          labels: { terms: 'What you read in a write-up', meanings: 'The trap' },
          pairs: [
            {
              term: '"AI made me much faster this sprint. I did not time anything, but it felt like it."',
              definition: 'Feeling instead of measuring',
            },
            {
              term: '"Before AI I fixed a migration bug; after, I built a CRUD form. The form took less time."',
              definition: 'Different tasks',
            },
            {
              term: '"With AI I wrote 4,000 lines last month against 1,500 before, so I am far more productive."',
              definition: 'Lines of code',
            },
            {
              term: '"I tried the assistant on two tickets and both were faster, so it is proven."',
              definition: 'Too few samples',
            },
            {
              term: '"Cycle time dropped 30%." (Four bugs from those PRs reached production; the write-up does not mention them.)',
              definition: 'Ignoring defects',
            },
            {
              term: 'After the lead posts a weekly ranking of PRs merged per person, everyone splits work into tiny PRs.',
              definition: 'Gaming',
            },
          ],
          hints: [
            'Some traps are about how the data was collected, others about how it was read or used.',
            'Comparing a bug fix with a form is a different problem from having only two data points.',
            'A number that people start chasing because it is ranked is the trap of a measure becoming a target.',
          ],
          explanation: 'No times is feeling, a bug fix against a form is different tasks, 4,000 lines is lines of code, two tickets is too few samples, faster with hidden bugs is ignoring defects, and tiny PRs to climb a ranking is gaming.',
        },
      },
      { type: 'warning', text: 'Ask the assistant to calculate from your data, then spot-check a few rows yourself. Assistants can make arithmetic mistakes or silently skip rows.' },
      { type: 'tip', text: 'Start your baseline now. Log the next three tasks you do without AI (or with your usual habits): start time, finish time, bugs found later. That is the before for your case study.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat the trial as an experiment, not a diary. Prefer a within-person design in which comparable tasks are assigned to 'with AI' or 'without AI' by a coin flip, because choosing which tasks to try the tool on lets enthusiasm and task difficulty leak into the result. Fix the measures before you start, and watch both sides of the ledger: DORA groups its measures into throughput (change lead time, deployment frequency, failed deployment recovery time) and instability (change fail rate, deployment rework rate), and a gain in one at the other's expense is not a gain. With six tasks per arm, report medians with an interval, not a single difference. A bootstrap interval that spans zero says the sample cannot tell a gain from noise, and saying so is the honest result. Beware learning effects too: your skill with the tool grows during the trial.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'python',
        label: 'boot.py: a median difference with a bootstrap interval (run: python boot.py)',
        code: `import random
import statistics

before = [9.5, 11.0, 8.0, 12.5, 9.0, 10.0]  # hours from start to merge, six tasks
after = [7.0, 6.5, 9.0, 7.5, 12.0, 6.0]

observed = statistics.median(before) - statistics.median(after)
rng = random.Random(1)
diffs = sorted(
    statistics.median(rng.choices(before, k=len(before))) - statistics.median(rng.choices(after, k=len(after)))
    for _ in range(10_000)
)
low, high = diffs[250], diffs[9_750]  # the middle 95% of the resampled differences
print(f"median saved: {observed:.1f} h, 95% interval {low:.1f} to {high:.1f} h")`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Run as is, it prints a median saving of 2.5 hours with an interval from -0.8 to 4.5 hours: the point estimate looks good, but the interval includes zero, so six tasks per arm cannot rule out no effect.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "DORA's guide to its software delivery metrics lists three throughput measures (change lead time, deployment frequency, failed deployment recovery time) and two instability measures (change fail rate, deployment rework rate); the guide was last updated on 5 January 2026.",
        checked: CHECKED,
        sources: [SRC.doraMetrics],
      },
      {
        type: 'takeaways',
        items: [
          'People are poor judges of their own speed, and watching code appear feels fast.',
          'Measure cycle time, review time and rounds, PR size, defects, rework and time on task.',
          'Start a baseline now, before you change how you work.',
          'Avoid feeling over measuring, mismatched tasks, lines of code, tiny samples and gaming.',
          'Spot-check any calculation the assistant does for you.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-15-q1',
        prompt: 'Why is your own feeling of speed a weak measure of AI\'s benefit?',
        choices: [
          'Feelings are always too negative',
          'Watching code appear feels fast even when review and rework take longer',
          'Managers do not accept feelings',
        ],
        answer: 1,
        explanation: 'Perceived and actual speed can differ, so record real times and outcomes.',
      },
      {
        id: 'experienced-15-q2',
        prompt: 'Which comparison is most honest?',
        choices: [
          'Similar tasks measured the same way before and after',
          'A hard task before and an easy task after',
          'Lines of code written per day',
          'How excited you felt each week',
        ],
        answer: 0,
        explanation: 'Like-for-like tasks and the same measurement method make the comparison meaningful.',
      },
      {
        id: 'experienced-15-q3',
        prompt: 'You were 30% faster but post-merge bugs doubled. How should you report it?',
        choices: [
          'Report only the speed-up',
          'Leave the project out of the case study',
          'Report both, because faster with more defects may not be better',
        ],
        answer: 2,
        explanation: 'Quality and speed together tell the true story. Hiding one makes the case study untrustworthy.',
      },
      {
        id: 'experienced-15-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a "baseline" in this lesson?',
        choices: [
          "The fastest time you have ever achieved on a task like it, kept as your target for the future",
          "A score that the assistant gives your code once it has read all of the project files",
          "Your 'before' numbers, collected first so later numbers can be compared fairly",
          "The number of lines that the project contained when you first started to work on it",
        ],
        answer: 2,
        explanation: 'You cannot say you got faster without knowing how fast you were before, measured the same way. The baseline is that starting point.',
      },
      {
        id: 'experienced-15-q5',
        audience: { min: 'advanced' },
        prompt: 'Six tasks per arm give a median saving of 2.5 hours, with a bootstrap interval of -0.8 to 4.5 hours. What is the most defensible statement?',
        choices: [
          "AI saves 2.5 hours on every task, because the median difference is positive",
          "The data cannot rule out no effect, so call it inconclusive and collect more tasks",
          "AI makes work slower, because the interval includes a negative value as its lower end",
          "The interval must be wrong, because a trustworthy interval should never include zero at all",
        ],
        answer: 1,
        explanation: 'An interval that spans zero means the data are compatible with a gain, no change or a small loss. Honest reporting says so and adds more comparable tasks instead of quoting the point estimate.',
      },
    ],
    task: {
      title: 'Start your baseline',
      minutes: 15,
      steps: [
        'Run the `gh pr list` or `git log` command above on a repository you work in.',
        'Use the prompt to get median cycle time and PR size, and spot-check two rows by hand.',
        'Create a simple time log (spreadsheet or text file) with columns: task, type, start, finish, AI used, bugs later.',
        'Choose the two or three task types you will compare for your case study.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Make a notebook or spreadsheet with the columns from the lesson and fill in the next three small tasks with honest times. These are your baseline, not a score.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Write a one-paragraph protocol before you collect data: the measures (at least one throughput and one instability measure), how tasks are assigned by coin flip, the sample size, and what result would make you stop.",
          "Adapt `boot.py` to your own numbers and report the median difference with its interval.",
        ],
      },
    ],
  },
  {
    id: 'experienced-16',
    day: 16,
    title: 'Adding AI features to products',
    summary: 'Call a model from your backend, keep the key secret, and plan for cost, latency, failure and evaluation.',
    intro: {
      objectives: [
        'Keep a model API key on your backend and never in an app bundle',
        'Plan for timeouts, failures, cost and privacy around a model call',
        'Treat model output as untrusted input and explain what prompt injection is',
      ],
      why: 'Adding AI to a product is increasingly asked of experienced developers. The call is a few lines of code; the engineering around it is where your experience counts.',
    },
    minutes: 15,
    skills: ['ai-features'],
    body: [
      { type: 'paragraph', text: "Using AI to write code is one skill. Building AI into the product is another, and it is increasingly asked of experienced developers: summarise a support ticket, classify a request, draft a reply. The code to call a model is short. The engineering around it is where your experience counts." },
      { type: 'heading', text: 'The basic call' },
      { type: 'paragraph', text: "Most providers offer an HTTP API: you send messages and settings, you get text back. Here is the shape for one provider's API, using standard `fetch` in Node.js 18 or newer. Other providers use different URLs, headers and fields, and APIs change, so always check the provider's current documentation." },
      { type: 'code', language: 'javascript', label: 'summarize.mjs (run: node summarize.mjs)', code: `// Set these in your environment, never in code:
//   ANTHROPIC_API_KEY  your secret key
//   MODEL_NAME         a model id from the provider's docs
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: process.env.MODEL_NAME,
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: "Summarise this support ticket in two sentences: The GCash payment went through but the order still shows unpaid.",
      },
    ],
  }),
  signal: AbortSignal.timeout(30_000),
});

if (!response.ok) {
  throw new Error("Model call failed: " + response.status + " " + (await response.text()));
}

const data = await response.json();
console.log(data.content[0].text);` },
      { type: 'paragraph', text: 'Notice three choices in that code. The key and the model name come from environment variables, so the key never sits in the source and you can switch to a newer model without editing code, because models are updated and retired. The call has a 30-second timeout, so a slow provider cannot hang your request forever. And a failed response is checked and raised instead of ignored.' },
      {
        type: 'visual',
        id: 'ai-app-workflow',
        caption: 'Where the API key lives: follow a request from the app through your server to the model and back.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "An **API** is a way for one program to ask another program for something over the internet; here, your program asks an AI company's model for a reply. An **API key** is like a password that proves the request is yours, and the company bills the account it belongs to. That is why the key lives on a **server** (a computer you control that runs your code) and never inside a phone app, where anyone can pull it out. A **timeout** is how long you are willing to wait before giving up, and **environment variables** are settings kept outside your code so that secrets are never written into files. The example reads the key and model name from those settings, sends one message and prints the answer.",
      },
      { type: 'heading', text: 'The engineering around it' },
      { type: 'list', items: [
        '**Keys stay on the server.** Never ship an API key inside a mobile app or frontend bundle. Your backend calls the model.',
        '**Timeouts and failures.** Models are slow compared with a database and sometimes fail or rate-limit you. Set timeouts, retry carefully, and design a fallback the user can live with.',
        '**Cost.** Providers usually charge per token, with input and output priced separately. Cap output length, trim input, cache repeated answers, and set a budget alert.',
        '**Privacy.** Sending user data to a provider is processing personal data. Check your policy, the provider\'s terms and the Data Privacy Act obligations with your DPO.',
        '**Output is untrusted.** Validate it like user input. If you ask for JSON, parse it and handle failure. Never execute model output as code or SQL.',
        '**Evaluation.** You need a way to know whether a prompt or model change made things better or worse. That is tomorrow\'s lesson.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'experienced-16-match-1',
          kind: 'match',
          title: 'Which concern did they miss?',
          prompt: 'Each team below shipped an AI feature and hit a problem. Match each problem with the concern they did not handle.',
          concept: 'ai features in products',
          labels: { terms: 'What went wrong', meanings: 'Concern to handle' },
          pairs: [
            {
              term: 'A teammate put the provider\'s API key in the mobile app\'s config so the app can call the model directly.',
              definition: 'Keys: keep them on the server',
            },
            {
              term: 'During a busy hour the provider takes 40 seconds, and the support page spins forever.',
              definition: 'Timeouts and failures: set timeouts and a fallback',
            },
            {
              term: 'The bill tripled after users started pasting whole PDF contracts into the summariser.',
              definition: 'Cost: trim input, cap output, set a budget alert',
            },
            {
              term: 'Tickets with customers\' names and addresses go to the provider, and nobody has asked the DPO.',
              definition: 'Privacy: check policy, terms and your DPO',
            },
            {
              term: 'The model sometimes starts its reply with "Sure! Here is the JSON:", and the code crashes on parse.',
              definition: 'Output: treat it as untrusted and validate it',
            },
            {
              term: 'After switching to a cheaper model, nobody can say whether the summaries got worse.',
              definition: 'Evaluation: measure before and after a change',
            },
          ],
          hints: [
            'Ask of each problem: is it about secrets, speed, money, personal data, what comes back, or knowing the quality?',
            'Huge inputs show up on the bill; slow answers show up on the screen.',
            'A crash on a reply is about trusting the output; not knowing if a change made things worse is about evaluation.',
          ],
          explanation: 'A key in the app is a key problem, the endless spinner needs a timeout, the tripled bill is cost, unreviewed personal data is privacy, the chatty JSON is untrusted output, and the unknown quality after a model switch is the missing evaluation.',
        },
      },
      { type: 'prompt', label: 'Design review for an AI feature', text: 'I want to add this AI feature: [describe]. Our stack: [ ]. Act as a senior engineer and review the design. Cover: where the model call should live, how to handle timeouts and failures, how to control cost, what personal data is involved and how to minimise it, how to validate the output, and how we would measure quality before launch. List open questions for me.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-16-scenario-1',
          kind: 'scenario',
          title: 'Straight from the app',
          prompt: 'What do you recommend?',
          concept: 'api key security',
          situation: 'A teammate wants to call the model directly from the mobile app so no backend is needed. The API key would be stored in the app code.',
          options: [
            {
              text: 'Ship it, and rotate the key if it leaks.',
              consequence: 'The key is exposed to anyone who opens your app bundle, and cost can climb before you notice.',
              quality: 'poor',
            },
            {
              text: 'Keep the call on your backend and give the app only your backend\'s address.',
              consequence: 'Keys stay on the server, where you can also set timeouts, limits and validation.',
              quality: 'best',
            },
            {
              text: 'Hide the key in the code under an odd variable name.',
              consequence: 'Anything shipped inside an app or frontend bundle can be read out of it.',
              quality: 'poor',
            },
          ],
          hints: [
            'Where does the key live in each option?',
            'Never ship an API key inside a mobile app or frontend bundle.',
            'Your backend calls the model.',
          ],
          explanation: 'Keys stay on the server. Your backend is also where timeouts, cost limits and validation belong.',
        },
      },
      { type: 'warning', text: 'Users will try to make your feature do things you did not intend by typing instructions into it (prompt injection). Never give the model access to actions or data the user should not have.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "A model call is a remote dependency with unusual failure modes, so design it like one. Retry only what is retryable (rate limits and server errors), never client errors. Back off exponentially with jitter, honour a `retry-after` header when present, and cap attempts, because retrying a spend-cap error will not help. Make requests safe to repeat or deduplicate on your side, log the provider's request id for support, and validate output against a schema before use. Structured-output features constrain the response to a JSON schema, but unsupported schema features are rejected, so still handle failure. Bound cost with input trimming, output caps, per-user quotas and a budget alert, and cache answers that repeat. Treat model output as untrusted (OWASP calls this improper output handling) and limit what a model-driven action may touch (excessive agency): the model should never hold more authority than the user it serves.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'javascript',
        label: 'retry.mjs: retry what is worth retrying (run: node retry.mjs)',
        code: `// Retry only what is worth retrying, wait longer each time, add jitter, and give up.
export async function callWithRetry(send, { attempts = 4, baseMs = 500, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  for (let attempt = 1; ; attempt++) {
    const response = await send();
    if (response.ok) return response;
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === attempts) throw new Error(\`Model call failed: \${response.status}\`);
    const header = Number(response.headers.get("retry-after"));
    const wait = header > 0 ? header * 1000 : baseMs * 2 ** (attempt - 1) * (0.5 + Math.random() / 2);
    await sleep(wait);
  }
}

// A stub instead of the network, so you can run this file as is.
const replies = [429, 529, 200];
const waits = [];
const stub = async () => {
  const status = replies.shift();
  return { ok: status === 200, status, headers: new Headers() };
};
const response = await callWithRetry(stub, { sleep: async (ms) => waits.push(Math.round(ms)) });
console.log(response.status, "after", waits.length, "waits");
console.log("a 400 is not retried:");
await callWithRetry(async () => ({ ok: false, status: 400, headers: new Headers() })).catch((e) => console.log(e.message));`,
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Anthropic's API documentation lists 429 (rate limit) and 500 and 529 (server error and overloaded) among its HTTP errors, says a spend-cap 429 has no `retry-after` header and keeps failing until access resumes, says the official SDKs retry transient failures twice by default with exponential backoff and honour `retry-after`, and says every response carries a `request-id` header. It says a request must send an `anthropic-version` header and recommends the latest version; at the time of checking the latest listed is 2026-10-21, while the lesson's example sends the older listed 2023-06-01, so check the current docs. Its structured outputs feature constrains responses to a JSON schema, and unsupported schema features return a 400 error.",
        checked: CHECKED,
        sources: [SRC.apiErrors, SRC.apiVersioning, SRC.structuredOutputs, SRC.owaspLlm],
      },
      {
        type: 'takeaways',
        items: [
          'The code to call a model is short; the engineering around it is where experience counts.',
          'Keep keys on the server and call the model from your backend.',
          'Plan for timeouts, failures, cost and privacy.',
          'Treat model output as untrusted input: validate it, and never execute it.',
          'Users can try to steer your feature with typed instructions (prompt injection): never give the model more access than the user should have.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-16-q1',
        prompt: 'Where should the API key for a model provider live in a mobile app product?',
        choices: [
          'On your backend, which calls the model for the app',
          'In the app bundle, obfuscated',
          'In a public config file',
        ],
        answer: 0,
        explanation: 'Anything shipped in an app can be extracted. Keep keys server-side.',
      },
      {
        id: 'experienced-16-q2',
        prompt: 'How should your code treat a model\'s output?',
        choices: [
          'As trusted, since it came from your own backend',
          'As code to run directly',
          'As untrusted input: validate, parse and handle failure',
        ],
        answer: 2,
        explanation: 'Model output can be malformed or manipulated, so validate it like any external input.',
      },
      {
        id: 'experienced-16-q3',
        prompt: 'Which is a practical way to control the cost of an AI feature?',
        choices: [
          'Send the whole database with every request',
          'Remove all timeouts',
          'Retry every failure forever',
          'Cap output length, trim input and cache repeated answers',
        ],
        answer: 3,
        explanation: 'Cost usually scales with tokens in and out, so fewer tokens and fewer repeat calls cost less.',
      },
      {
        id: 'experienced-16-q4',
        prompt: 'Why does the example read the model name from an environment variable?',
        choices: [
          'Model names change, so you take the current one from the provider\'s docs without editing code',
          'Environment variables make the call faster',
          'The API refuses hardcoded model names',
        ],
        answer: 0,
        explanation: 'Models are updated and retired. Configuration makes switching easy and keeps the example honest.',
      },
      {
        id: 'experienced-16-q5',
        audience: { max: 'beginner' },
        prompt: 'Why does the lesson say an API key must stay on a server?',
        choices: [
          "Because phones are unable to store any text of their own that a program can read",
          "Because anyone can pull a key out of an app's code and run up your bill",
          "Because keys make the model answer more accurately when they are kept on the server",
          "Because a key stops working after it has been used one time, so it is hidden",
        ],
        answer: 1,
        explanation: 'Whatever is shipped inside an app can be extracted. A key found there lets a stranger make requests that your account pays for.',
      },
      {
        id: 'experienced-16-q6',
        audience: { min: 'advanced' },
        prompt: 'A model call returns 429 with a `retry-after` header of 20. What should your retry logic do?',
        choices: [
          "Retry immediately, up to ten times, to get through before the limit resets for you",
          "Wait at least the requested time, then retry with a capped number of attempts",
          "Never retry, because a 429 means that the key is invalid and must be replaced at once",
          "Switch to a smaller model and retry with no delay, since it may have more room",
        ],
        answer: 1,
        explanation: 'A 429 means a limit was hit, and the header says how long to wait. Waiting, with capped attempts, respects the limit; immediate retries make it worse, and a 429 does not mean the key is invalid.',
      },
    ],
    task: {
      title: 'Make one model call',
      minutes: 20,
      steps: [
        'Get an API key from a provider you are allowed to use and set it as an environment variable (never in code).',
        'Adapt `summarize.mjs` to that provider\'s current docs and run it with a made-up ticket.',
        'Add handling for a timeout and a non-200 response, and test both.',
        'Write three sentences: where this call would live in your product, and what it would cost you to find out.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Look at a sample or your own code for any place where a key is written straight into the text. Replace it with a made-up placeholder and write down where the real value would live instead.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Wrap your model call in the retry helper (or your SDK's built-in retries), log the provider's request id, validate the response against a schema, and write a test that a 400 is not retried.",
          "Estimate the cost of one user's day of use and set a per-user quota and a budget alert.",
        ],
      },
    ],
  },
  {
    id: 'experienced-17',
    day: 17,
    title: 'Prompt and evaluation basics',
    summary: 'Write prompts like specifications and test them like code, with a small set of cases you run on every change.',
    intro: {
      objectives: [
        'Write a prompt as a specification: role and task, marked input, rules, output format and examples',
        'Explain what an eval set is and when to run it',
        'Predict what a simple eval harness prints before a model is plugged in',
        'Grow an eval set from the mistakes users report',
      ],
      why: 'In a product a prompt is code, and one without tests works in the demo and fails on real users. You already know the cure: specifications and test suites.',
    },
    minutes: 15,
    skills: ['ai-features', 'context-prompting'],
    body: [
      { type: 'paragraph', text: "In a product, a prompt is code. It changes behaviour, it can break, and it needs tests. Developers who treat prompts as casual text end up with features that work in the demo and fail on real users. You already know the cure: specifications and test suites." },
      { type: 'heading', text: 'A prompt as a specification' },
      { type: 'list', items: [
        '**Role and task:** what the model is doing, in one or two sentences.',
        '**Input, clearly marked:** put user text inside tags or delimiters so it is not confused with your instructions.',
        '**Rules:** what to do with unclear input, what never to do.',
        '**Output format:** exact labels or a JSON shape you can parse.',
        '**Examples:** two or three input and output pairs, including a tricky one.',
      ] },
      { type: 'prompt', label: 'A classifier prompt', text: 'You classify customer support messages for a Philippine online shop. Messages may be in English, Filipino or Taglish. Reply with exactly one label and nothing else: billing, account_access, bug, delivery, other. If the message fits more than one, choose the one the customer most needs solved first. If it is unclear, reply other. Message: <message>{{text}}</message>' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-17-match-1',
          kind: 'match',
          title: 'Read a prompt as a specification',
          prompt: 'These lines come from a new prompt for a courier\'s support tool. Match each line with the part of a specification it plays.',
          concept: 'prompt specifications',
          labels: { terms: 'Lines from a new prompt', meanings: 'Part of the specification' },
          pairs: [
            {
              term: 'You write a one-sentence summary of delivery complaints for a courier\'s support team.',
              definition: 'Role and task',
            },
            {
              term: 'Complaint: <complaint>{{text}}</complaint>',
              definition: 'Input, clearly marked',
            },
            {
              term: 'Never include the customer\'s phone number or address in the summary. If the complaint is empty, reply NO_TEXT.',
              definition: 'Rules',
            },
            {
              term: 'Return JSON only: {"summary": string, "needs_refund": true or false}',
              definition: 'Output format',
            },
            {
              term: '"Wala pa rin parcel ko, 2 weeks na" -> {"summary": "Parcel still not delivered after two weeks.", "needs_refund": false}',
              definition: 'Examples',
            },
          ],
          hints: [
            'Ask of each line: does it say what the model is doing, where the user text goes, what it must never do, the shape of the reply, or a sample?',
            'User text wrapped in tags is the marked input.',
            'A JSON shape is the output format; an input with its expected output is an example.',
          ],
          explanation: 'The first line states role and task, the tags mark the user input, "never" and the empty-input case are rules, the JSON shape is the output format, and the Taglish input with its expected reply is an example.',
        },
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **prompt** is the written instruction you give an AI model. In a product the instruction is part of the program, so it needs the same care as code: say what the model is doing, mark where the customer's words go (so it does not mistake them for your orders), list the rules, show the exact format of the answer, and give a few examples. A **label** is one fixed word the model must answer with, like `billing` or `bug`. An **eval**, short for evaluation, is a list of example inputs with the answers you expect, which you run again each time you change the prompt, like a spelling test for your assistant. 'Prompt Engineering for Software Development' goes further.",
      },
      { type: 'heading', text: 'Evaluation: tests for prompts' },
      { type: 'paragraph', text: "An eval is a set of example inputs with the result you expect, run automatically. Start small: 20 to 50 real-looking cases, including the hard ones. Run it before and after every prompt or model change. If the score drops, you caught a regression before your users did." },
      { type: 'code', language: 'python', label: 'eval_classifier.py (run: python eval_classifier.py)', code: `CASES = [
    {"input": "Hindi ko ma-login ang account ko", "expected": "account_access"},
    {"input": "I was charged twice via GCash", "expected": "billing"},
    {"input": "The app crashes when I open Orders", "expected": "bug"},
    {"input": "Nasaan na yung parcel ko? 5 days na", "expected": "delivery"},
]


def classify(text: str) -> str:
    """Replace this with a call to your model. It must return one label."""
    return "bug"


def run_eval() -> None:
    passed = 0
    for case in CASES:
        got = classify(case["input"])
        ok = got == case["expected"]
        passed += ok
        print("PASS" if ok else "FAIL", repr(case["input"]), "->", got)
    print(f"{passed}/{len(CASES)} passed")


if __name__ == "__main__":
    run_eval()` },
      { type: 'paragraph', text: "Run as is, it prints 1/4 passed, because the placeholder always answers 'bug'. That is the point: the harness works before the model does. Exact-match checks suit labels. For free text, start with simple rule checks (length, required words, valid JSON), then add human review or a second model as a grader, and check the grader against human judgment on a sample." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-17-predict-output-1',
          kind: 'predict-output',
          title: 'Run the harness first',
          prompt: 'This is a tiny eval harness whose placeholder `classify` always answers "bug". What does it print?',
          concept: 'prompt evaluation',
          language: 'python',
          code: 'CASES = [\n    ("I was charged twice", "billing"),\n    ("The app crashes", "bug"),\n    ("Where is my parcel", "delivery"),\n]\n\ndef classify(text):\n    return "bug"\n\npassed = 0\nfor text, expected in CASES:\n    if classify(text) == expected:\n        passed += 1\nprint(f"{passed}/{len(CASES)} passed")',
          expected: '1/3 passed',
          choices: ['0/3 passed', '1/3 passed', '3/3 passed', '1/1 passed'],
          wrongNotes: {
            '3/3 passed': 'The placeholder returns "bug" for everything, but only one case expects "bug".',
            '1/1 passed': 'The harness counts every case in CASES, so the total is 3, not 1.',
          },
          hints: [
            'What does `classify` return for every message?',
            'Which expected labels equal "bug"?',
            'Only the second case expects "bug".',
          ],
          explanation: 'The placeholder always says "bug", so only the one case that expects "bug" passes: 1/3. That is the point of a harness: it works, and reports honestly, before the model is plugged in.',
        },
      },
      { type: 'warning', text: 'Build eval cases from realistic but made-up or anonymised examples. Do not copy real customer messages into a test file without permission and masking.' },
      { type: 'tip', text: 'Every time a user reports a wrong answer, add that input to your eval set. Your eval grows into a record of every mistake you have fixed.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Evals are the test suite for non-deterministic components, so give them the properties a suite needs. Split cases into a development set you tune against and a held-out set you read only when you decide, and report results per slice (language, intent, input length), because an average hides the group that broke. Grade with code wherever you can (exact match, schema validity, required fields). Use a model as grader only for qualities code cannot check, prefer a different model from the one being graded, and calibrate it against human labels on a sample. Record the prompt version and model identifier with every run, repeat runs to see variance, and turn a threshold into a CI gate with a non-zero exit code. Review the cases themselves: an eval built only from examples the prompt's author imagined measures their imagination.",
      },
      {
        type: 'code',
        audience: { min: 'advanced' },
        language: 'python',
        label: 'gate.py: per-slice results and a CI gate (run: python gate.py)',
        code: `import sys

# (input, expected label, slice): the slice shows where it fails, not only how often
CASES = [
    ("I was charged twice via GCash", "billing", "english"),
    ("The app crashes when I open Orders", "bug", "english"),
    ("Nasaan na yung parcel ko? 5 days na", "delivery", "taglish"),
    ("Hindi ko ma-login ang account ko", "account_access", "taglish"),
]


def classify(text: str) -> str:
    return "bug"  # placeholder: replace with the model call


def main(threshold: float = 0.75) -> int:
    results = {}
    for text, expected, part in CASES:
        results.setdefault(part, []).append(classify(text) == expected)
    for part, marks in results.items():
        print(f"{part:8} {sum(marks)}/{len(marks)}")
    score = sum(map(sum, results.values())) / len(CASES)
    print(f"overall {score:.0%}, gate {threshold:.0%}")
    return 0 if score >= threshold else 1  # a non-zero exit code fails the CI job


if __name__ == "__main__":
    sys.exit(main())`,
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Anthropic's guide to building evaluations advises specific, measurable success criteria; grading by code, by humans or by a model; task-specific cases that include edge cases; automating grading where possible and preferring many automated questions over a few hand-graded ones; and, generally, grading with a different model from the one that produced the output.",
        checked: CHECKED,
        sources: [SRC.evalsGuide],
      },
      {
        type: 'takeaways',
        items: [
          'In a product, a prompt is code: it changes behaviour, can break and needs tests.',
          'Write it like a specification: role and task, marked input, rules, output format and examples.',
          'An eval is a set of inputs with expected results, run before and after every prompt or model change.',
          'Start with 20 to 50 realistic cases and add every wrong answer users report.',
          'Use made-up or anonymised cases, never real customer messages without permission and masking.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-17-q1',
        prompt: 'Why mark user input with tags or delimiters inside a prompt?',
        choices: [
          'It makes the model respond faster',
          'So the model can tell your instructions apart from the user\'s text',
          'Because models only read XML',
        ],
        answer: 1,
        explanation: 'Clear boundaries reduce confusion and make it harder for user text to pass as instructions.',
      },
      {
        id: 'experienced-17-q2',
        prompt: 'What is the main purpose of an eval set?',
        choices: [
          'To catch regressions when you change a prompt or model',
          'To train the model',
          'To replace user feedback',
          'To reduce token cost',
        ],
        answer: 0,
        explanation: 'Like a test suite, it tells you whether a change made results better or worse.',
      },
      {
        id: 'experienced-17-q3',
        prompt: 'A user reports a wrong classification. What is the best follow-up?',
        choices: [
          'Ignore it; models are random',
          'Rewrite the whole prompt from scratch',
          'Add that case (anonymised) to the eval set, then fix and rerun',
        ],
        answer: 2,
        explanation: 'Adding real failures to the eval prevents the same mistake from coming back unnoticed.',
      },
      {
        id: 'experienced-17-q4',
        audience: { max: 'beginner' },
        prompt: 'What is an "eval"?',
        choices: [
          "A button that makes the model answer faster whenever the prompt gets too long for it",
          "A short name for an error message that the model prints back to the user in the chat",
          "A setting that hides your prompt from the users so that they cannot copy it out of the app",
          "Example inputs with expected answers, run again after each prompt change",
        ],
        answer: 3,
        explanation: 'An eval is a test list for a prompt. Running it after each change tells you whether the change made answers better or worse.',
      },
      {
        id: 'experienced-17-q5',
        audience: { min: 'advanced' },
        prompt: 'Your classifier scores 92% overall after a prompt change, but support says Taglish tickets feel worse. What should your eval have shown you?',
        choices: [
          "Nothing more, because an overall average is the only fair summary of a classifier run",
          "Results per slice, such as Taglish against English, so one group failing shows",
          "A longer prompt, so that the model is shown many more examples before it answers",
          "A second model that confirms the 92% figure by grading the same cases again",
        ],
        answer: 1,
        explanation: 'An average can rise while one group gets worse. Reporting by slice shows where the failure is, and it is what lets you act on support\'s observation.',
      },
    ],
    task: {
      title: 'Build a tiny eval',
      minutes: 20,
      steps: [
        'Save `eval_classifier.py` and run it. Confirm it prints 1/4 passed.',
        'Add six more cases, including two tricky Taglish ones and one that should be "other".',
        'Replace `classify` with a call to your model (adapt yesterday\'s example) using the classifier prompt.',
        'Run it, change one line of the prompt, and run it again. Did the score move?',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Write five example messages with the label you expect for each in a plain list. Ask an assistant to label them and mark which of its answers match yours.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Split your eval into development and held-out parts with slices, make it exit non-zero below a threshold, and run it whenever the prompt file changes.",
          "Record the prompt version and model identifier with each run, repeat it three times, and report the variance.",
        ],
      },
    ],
  },
  {
    id: 'experienced-18',
    day: 18,
    title: 'When not to use AI',
    summary: 'Know the tasks where AI costs more than it saves, and keep the skills you would lose by never doing them yourself.',
    intro: {
      objectives: [
        'List the situations where AI costs more than it saves',
        'Choose a sensible use of AI during a production incident',
        'Plan time to work without assistance so your skills stay sharp',
      ],
      why: 'Judgment includes knowing when not to reach for a tool. A senior developer who can say why a task should stay manual is easier to trust than one who uses AI on everything.',
    },
    minutes: 15,
    skills: ['ai-workflow', 'review-security'],
    body: [
      { type: 'paragraph', text: "A senior developer's judgment includes knowing when not to reach for a tool. You do not use a framework for a ten-line script, and you do not need an AI assistant for everything. Here is where it often costs more than it saves." },
      { type: 'heading', text: 'Skip it, or be very careful, when' },
      { type: 'list', items: [
        '**You cannot verify the result.** If you could not tell a right answer from a wrong one, you are not using a tool, you are trusting one. Learn enough first.',
        '**The code or data is not cleared for AI tools.** Policy beats convenience, every time.',
        '**It is security-critical and subtle:** cryptography, authentication flows, permission models. Use well-known libraries and expert review.',
        '**The change is tiny and you already know it.** Explaining a two-line fix takes longer than typing it.',
        '**The assistant is looping.** Two or three failed attempts on the same problem means it lacks context. Stop and think.',
        '**You are learning a fundamental.** If the goal is to understand, generating the answer skips the part that teaches you.',
        '**Licensing is unclear.** If generated code looks like it was copied from a specific project, check before you ship it.',
        '**The decision is about people.** Hiring, performance and conduct decisions need human judgment and accountability.',
      ] },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Good judgment includes knowing when not to use a tool. The simplest test is this: could you tell if the answer is wrong? If not, you are trusting the tool instead of using it, so learn the basics first. Some code is also too sensitive for guesswork, such as anything about passwords, logins or payments. And if the assistant fails at the same problem two or three times, it is probably missing information that you have, so stop and think instead of asking again. A **production** system is the live one that real customers use. Doing nothing risky there is often better than a fast, clever fix.",
      },
      { type: 'heading', text: 'During incidents' },
      { type: 'paragraph', text: "Under pressure, AI can help you read logs and recall commands. It can also send you down a confident wrong path while production is down. Use it to speed up checks you understand, not to choose actions you cannot evaluate. Follow your runbook, and never let an agent run commands against production on its own." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-18-scenario-1',
          kind: 'scenario',
          title: 'Production is down',
          prompt: 'What do you do?',
          concept: 'when not to use ai',
          situation: 'Production is down at 2 AM. The assistant confidently proposes a command that would reset part of the production database, and explains it clearly.',
          options: [
            {
              text: 'Run it: the explanation was clear.',
              consequence: 'A clear explanation is not a check. You may be acting on a confident wrong path while production is down.',
              quality: 'poor',
            },
            {
              text: 'Follow your runbook, and use the assistant only to speed up checks you understand.',
              consequence: 'You stay in control of actions you can evaluate, and keep the assistant for logs and commands you recall.',
              quality: 'best',
            },
            {
              text: 'Let an agent run it, so you can keep reading logs.',
              consequence: 'Never let an agent run commands against production on its own.',
              quality: 'poor',
            },
          ],
          hints: [
            'Which actions can you evaluate yourself?',
            'Under pressure, a confident wrong path is expensive.',
            'Use AI for checks you understand, not for actions you cannot evaluate.',
          ],
          explanation: 'During incidents, follow the runbook and never let an agent act on production on its own. Use AI to speed up checks you understand.',
        },
      },
      { type: 'heading', text: 'Keep your edge' },
      { type: 'paragraph', text: "Skills you never use fade. Developers who let AI do all their debugging can find it harder to debug alone when the tool is down, or when the problem is too strange for it. Some developers set aside time each week to work without assistance, especially on debugging and design. Decide what you want to stay sharp at, and protect time for it." },
      {
        type: 'activity',
        activity: {
          id: 'experienced-18-match-1',
          kind: 'match',
          title: 'Skip it, or be careful',
          prompt: 'Match each situation to why AI costs more than it saves.',
          concept: 'judgment about ai use',
          pairs: [
            {
              term: 'You could not tell a right answer from a wrong one',
              definition: 'You are trusting a tool, not using one: learn enough first.',
            },
            {
              term: 'The change is a two-line fix you already know',
              definition: 'Explaining it takes longer than typing it.',
            },
            {
              term: 'The assistant fails the same problem two or three times',
              definition: 'It lacks context: stop and think.',
            },
            {
              term: 'The code or data is not cleared for AI tools',
              definition: 'Policy beats convenience, every time.',
            },
            {
              term: 'You are learning a fundamental',
              definition: 'Generating the answer skips the part that teaches you.',
            },
          ],
          hints: [
            'Ask what you lose in each case: time, safety or learning.',
            'A looping assistant is missing something.',
            'Some situations are about rules, others about skill.',
          ],
          explanation: 'Part of judgment is knowing when not to reach for a tool. Verification, policy, learning and context decide it.',
        },
      },
      { type: 'prompt', label: 'Ask the AI to argue against itself', text: 'Here is a task I am about to do: [describe]. Before helping, tell me honestly whether I would be better off doing it myself, without AI, and why. Consider: how easy the result is to verify, how sensitive the code or data is, whether I am trying to learn this skill, and how long it would take to explain versus to do. Then give a recommendation in one sentence.' },
      { type: 'warning', text: 'Generated code can resemble existing open-source code. If your company has rules about licences or code provenance, follow them, and use any duplicate or licence detection your tool or company provides.' },
      { type: 'tip', text: "Write your own 'not for AI' list today. Five lines is enough. It goes straight into your workflow document tomorrow." },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Decide with a rule, not a mood. Score a task on blast radius (what breaks if the output is wrong), verifiability (how cheaply you can check it) and reversibility, then map the combinations to modes: autonomous, with review, human-led. High blast radius with expensive verification, such as cryptography, authorisation models and data migrations, stays human-led, with AI limited to explaining or critiquing. For regulated or high-impact work, anchor the rule in a framework: NIST's AI Risk Management Framework (1.0, January 2023) organises risk work into Govern, Map, Measure and Manage, and its Generative AI Profile (NIST-AI-600-1, July 2024) adds risks specific to generative AI. OWASP lists excessive agency (LLM06): too many capabilities, too much access or too much autonomy. On provenance, GitHub documents Copilot's code referencing, which can block or reference suggestions that match public code, but a clean result is not a licence review.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "NIST released AI RMF 1.0 on 26 January 2023, with the functions Govern, Map, Measure and Manage, and the Generative AI Profile (NIST-AI-600-1) on 26 July 2024. OWASP's 2025 LLM list describes LLM06 Excessive Agency as damaging actions taken in response to unexpected, ambiguous or manipulated model output, rooted in too many capabilities, too much access or too much autonomy. GitHub's documentation says Copilot's code referencing checks suggestions against a public-code index and, depending on policy, blocks a matching suggestion or shows a reference with matching repositories and licences.",
        checked: CHECKED,
        sources: [SRC.nistRmf, SRC.owaspLlm06, SRC.copilotCodeReferencing],
      },
      {
        type: 'takeaways',
        items: [
          'Do not use AI when you cannot verify the result, or the code or data is not cleared for it.',
          'Be very careful with security-critical code such as cryptography, authentication and permissions.',
          'Skip it for tiny changes you already know, and stop when the assistant loops.',
          'During incidents follow the runbook and never let an agent act on production.',
          'Protect time to work without assistance, so skills do not fade.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-18-q1',
        prompt: 'What is the strongest reason not to use AI for a task?',
        choices: [
          'The task is in an old language',
          'You would not be able to tell whether the result is right',
          'The task takes more than an hour',
        ],
        answer: 1,
        explanation: 'If you cannot verify the output, you are relying on trust instead of judgment.',
      },
      {
        id: 'experienced-18-q2',
        prompt: 'During a production incident, what is a sensible use of an AI assistant?',
        choices: [
          'Letting an agent run fixes against production by itself',
          'Choosing actions you cannot evaluate',
          'Ignoring the runbook because the assistant is faster',
          'Speeding up log reading and checks you understand',
        ],
        answer: 3,
        explanation: 'Use it to go faster on things you can judge, while you and the runbook stay in charge.',
      },
      {
        id: 'experienced-18-q3',
        prompt: 'Why might you deliberately debug without AI sometimes?',
        choices: [
          'To keep a skill sharp that you would lose by never using it',
          'Because AI cannot debug at all',
          'Because company policy always forbids it',
        ],
        answer: 0,
        explanation: 'Skills fade without practice, and you need them when the tool is unavailable or wrong.',
      },
      {
        id: 'experienced-18-q4',
        audience: { max: 'beginner' },
        prompt: 'You cannot tell whether the assistant\'s answer is right. According to the lesson, what should you do?',
        choices: [
          "Use it anyway, because it sounded sure of itself when it gave the answer",
          "Learn enough first to judge it, or ask someone who can",
          "Ask the assistant to repeat the answer three times and use the majority",
          "Paste it into your project and see what happens when you run it",
        ],
        answer: 1,
        explanation: 'If you cannot check an answer you are trusting, not using, the tool. Learning enough to judge it, or asking someone who can, comes first.',
      },
      {
        id: 'experienced-18-q5',
        audience: { min: 'advanced' },
        prompt: 'Which task is the best candidate to stay human-led, with AI limited to critique?',
        choices: [
          "Renaming a variable across a well-tested module with the help of an editor tool",
          "Writing a docstring for an internal helper function that has a few callers",
          "Designing the permission model for a multi-tenant billing service",
          "Generating test fixtures that use made-up names and made-up phone numbers",
        ],
        answer: 2,
        explanation: 'A permission model for billing has a high blast radius and is expensive to verify, because flaws can stay hidden until they are exploited. The other tasks are cheap to check and easy to reverse.',
      },
    ],
    task: {
      title: 'Write your not-for-AI list',
      minutes: 10,
      steps: [
        'List five kinds of tasks in your work where you will not use AI, or only with extra care.',
        'For each, write one sentence on why.',
        'Run the argue-against-itself prompt on one task from your current week and compare its answer with your list.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "List three things you would not hand to an assistant yet, because you could not check the answer or because they involve passwords or payments. Write one sentence of why for each.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Build a table of ten recurring tasks in your team with columns for blast radius, verifiability and reversibility, and assign each task a mode: autonomous, with review, or human-led.",
          "Take one regulated or high-impact task and check it against NIST's Govern, Map, Measure and Manage functions. Note which control you lack.",
        ],
      },
    ],
  },
  {
    id: 'experienced-19',
    day: 19,
    title: 'Your personal AI workflow document',
    summary: 'Pull everything together into one page that says how you work with AI, and keep it up to date.',
    intro: {
      objectives: [
        'Write a one or two page workflow document with rules, setup, task types, prompts and a not-for-AI list',
        'Give every task type a verification step',
        'Remove confidential details before sharing the document',
      ],
      why: 'A written workflow is something you can follow on a busy day, share with your team and show in an interview as proof that you use AI with judgment, not only enthusiasm.',
    },
    minutes: 15,
    skills: ['ai-workflow', 'team-impact'],
    body: [
      { type: 'paragraph', text: "Over the past weeks you set up a tool, wrote an instructions file, built a prompt collection, and learned where AI helps and where it hurts. Today you write it down as one document. A clear workflow is something you can follow on a busy day, share with your team, and show in an interview as proof that you use AI with judgment, not just enthusiasm." },
      { type: 'paragraph', text: 'If you already submitted project 1 after day 9, treat today as version 2: update it with what you learned about agents, security, performance, measurement and limits.' },
      { type: 'code', language: 'markdown', label: 'A template for your workflow document', code: `# My AI-assisted workflow
Last updated: YYYY-MM-DD

## Rules I follow
- Approved tools and accounts: ...
- Never shared: secrets, client data, these repos: ...
- Disclosure: how I mark AI-assisted work ...

## Setup
- Tool(s) and key settings (approvals on, exclusions) ...
- Instructions file: where it lives, what it covers ...

## By task type
| Task | How I use AI | How I verify |
|------|--------------|--------------|
| Reading legacy code | Map with line refs | Check 3 claims + git log |
| Refactoring | One step, then stop | Tests green, read diff |
| Tests | Boundaries first | Break the code on purpose |
| Debugging | Ranked hypotheses | Reproduce, failing test |
| Review | First pass only | Human approval |

## Prompts I reuse
1. ...
2. ...
3. ...

## Not for AI
- ...

## How I measure
- Time log, cycle time, post-merge bugs ...` },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **workflow** is simply the way you usually do a job, written down in steps. Writing yours down helps because on a busy day you follow the page instead of your mood. Read the template as a checklist you fill in with your own life. **Rules** say what you may and may not share, **Setup** names the tools and settings you use, **By task type** is a table of what you do and how you check the result, **Prompts** are instructions you reuse, and **Not for AI** lists jobs you keep for yourself. The how-I-check column matters most. If you are still learning to code, keep your first version short and update it after each course.",
      },
      { type: 'heading', text: 'What makes it good' },
      { type: 'list', items: [
        '**Specific to you:** your stack, your company rules, your task types. A generic list of tips is not a workflow.',
        '**Verification for every task type.** The how-I-check column matters more than the how-I-use column.',
        '**Short enough to use.** One or two pages. Link out to longer prompt files.',
        '**Dated and versioned.** Tools change monthly; your document should too.',
      ] },
      { type: 'prompt', label: 'Get a critical review', text: 'Here is my personal AI-assisted development workflow. [paste]. Review it as a sceptical senior engineer and a security lead. Point out: tasks where my verification step is too weak, any rule that conflicts with common company AI policies, anything vague that I could not actually follow on a busy day, and gaps compared with the task types I listed. Do not rewrite it; give me numbered comments.' },
      { type: 'warning', text: 'If you share your workflow publicly or in a portfolio, remove company names, internal repository names and anything your employer or client would consider confidential.' },
      { type: 'tip', text: 'Put a reminder in your calendar to review the document once a month. Delete rules you no longer follow and add the ones you learned the hard way.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Promote the personal document into team infrastructure. Keep it in the repository, give it owners, and review changes like code. Derive each rule from evidence (an incident, a measured result, a review finding) and link it, so people see why it exists, and delete rules nobody can justify. Put machine-readable parts where tools read them: build, test and convention notes belong in an instructions file, and AGENTS.md is read by several tools. Enforce what must not fail through permissions, hooks and CI, because instructions are guidance and enforcement is separate. Add what personal versions skip: an incident path for an AI-caused defect or a leaked secret, an owner for tool settings and approved accounts, an onboarding path for new hires, and a review date. Treat the document as a product with users, and ask the team which parts they ignore.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Codex reads `AGENTS.md` files from the project root down to the working directory, GitHub Copilot supports `AGENTS.md` files (the nearest one takes precedence), and Claude Code can read a repository's `AGENTS.md` in place of CLAUDE.md. Claude Code's documentation says its memory files are context, not enforced configuration, and points to a PreToolUse hook to block an action regardless of what the model decides.",
        checked: CHECKED,
        sources: [SRC.codexAgentsMd, SRC.copilotInstructions, SRC.ccMemory],
      },
      {
        type: 'takeaways',
        items: [
          'A workflow document says how you work with AI: rules, setup, approach and verification per task type, reusable prompts and not-for-AI list.',
          'Make it specific to your stack, company rules and task types.',
          'The "how I check" column matters more than the "how I use" column.',
          'Keep it to one or two pages, dated and versioned, and review it monthly.',
          'Remove company and client names before sharing it.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-19-q1',
        prompt: 'Which column of the by-task table matters most?',
        choices: [
          'Which AI tool you used',
          'How long the prompt is',
          'How you verify the result',
        ],
        answer: 2,
        explanation: 'Verification is what makes AI-assisted work trustworthy. Without it the workflow is only hope.',
      },
      {
        id: 'experienced-19-q2',
        prompt: 'What makes a workflow document useful rather than generic?',
        choices: [
          'It is specific to your stack, rules and task types',
          'It lists every AI tool on the market',
          'It is at least ten pages long',
        ],
        answer: 0,
        explanation: 'A workflow you can actually follow is grounded in your real work and constraints.',
      },
      {
        id: 'experienced-19-q3',
        prompt: 'Before putting your workflow in a public portfolio, what should you do?',
        choices: [
          'Add your company\'s internal repo names for credibility',
          'Include a sample of client code',
          'Remove confidential names and details',
          'Nothing; workflows are never confidential',
        ],
        answer: 2,
        explanation: 'Your workflow can be public; your employer\'s or client\'s details cannot.',
      },
      {
        id: 'experienced-19-q4',
        audience: { max: 'beginner' },
        prompt: 'Why write your workflow down instead of keeping it in your head?',
        choices: [
          "So that you can follow it on a busy day, share it and improve it",
          "So that the assistant charges you less once it has read your workflow",
          "Because tools refuse to work at all unless a workflow document exists",
          "So that you never have to check anything again once the steps are written",
        ],
        answer: 0,
        explanation: 'A written workflow is something you can follow when you are tired or rushed, show to others and refine. It does not replace checking the work.',
      },
      {
        id: 'experienced-19-q5',
        audience: { min: 'advanced' },
        prompt: 'A team rule says "never run database migrations without approval", but it exists only as a line in the instructions file. How should you strengthen it?',
        choices: [
          "Repeat the line in capitals so that it stands out from the rest of the file",
          "Remove the line so that nobody relies on a rule that is not enforced anyway",
          "Enforce it with a permission rule or hook, and keep the sentence as documentation",
          "Ask each developer to remember it and to remind the others during reviews",
        ],
        answer: 2,
        explanation: 'Instructions are context that a model may follow imperfectly. A permission rule or hook blocks the command deterministically, while the written line explains why the rule exists.',
      },
    ],
    task: {
      title: 'Write version 1 (or 2)',
      minutes: 20,
      steps: [
        'Copy the template into a new Markdown file.',
        'Fill every section from your notes of the last 18 days, including at least five task types.',
        'Run the critical review prompt and fix the two most important comments.',
        'Submit it as project 1 if you have not yet, or update your submission.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Fill in the template with only what is true for you today, even if some sections are short, and add one line to 'Not for AI'. Set a reminder to revisit it after your next course.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Turn your document into a team proposal: add owners, an incident path for AI-caused defects, an onboarding path and a review date.",
          "Move two rules from prose into enforcement (a permission rule, a hook or a CI check) and link each rule to its evidence.",
        ],
      },
    ],
  },
  {
    id: 'experienced-20',
    day: 20,
    title: 'Presenting your case study',
    summary: 'Turn your before and after into a short, honest write-up that a manager, client or interviewer will trust.',
    intro: {
      objectives: [
        'Structure a case study: context, baseline, what changed, results, what went wrong, limits and recommendation',
        'State how many tasks are behind each number and what the numbers cannot prove',
        'Get permission and remove confidential details before publishing',
      ],
      why: 'Few developers can show, with numbers, method and honest limits, how AI changed their work. A short case study helps in a promotion talk, a proposal to your team, a freelance profile or an interview.',
    },
    minutes: 15,
    skills: ['team-impact', 'ai-workflow'],
    body: [
      { type: 'paragraph', text: "Anyone can say 'I use AI and it makes me faster'. Very few can show it with numbers, method and honest limits. A short case study does that. It is useful in a promotion conversation, a proposal to your team, a freelance profile, or an interview where someone asks how you work with AI." },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A **case study** is a short story with numbers: what you did, what you measured, what happened and what you learned. The honest parts matter most: how many tasks were behind each number, what went wrong, and what the numbers cannot prove. Imagine telling a friend about a new exercise routine. 'I feel great' is a feeling, but 'I tracked three weeks and my runs got a minute faster, though I also slept more' is evidence with limits. Keep your first case study short, and never include private details of an employer or client.",
      },
      { type: 'heading', text: 'A structure that works' },
      { type: 'list', ordered: true, items: [
        '**Context:** your role, the kind of codebase (described generally), and the question you wanted to answer.',
        '**Baseline:** how you worked before and the numbers you recorded.',
        '**What you changed:** tools, settings, your workflow (link your workflow document).',
        '**Results:** the same measures after, in a small table, with the number of tasks.',
        '**What went wrong:** where AI slowed you down, broke something or needed heavy correction.',
        '**Limits:** small sample, different tasks, learning effects. Say what the numbers cannot prove.',
        '**Recommendation:** what you would advise a teammate or team to do next.',
      ] },
      { type: 'paragraph', text: "Section 5 is the one most people skip and the one that earns trust. A case study where everything improved reads like an advertisement. One that says 'refactoring got faster, debugging did not, and one AI-written change caused a bug that reached staging' reads like engineering." },
      { type: 'code', language: 'markdown', label: 'A results table', code: `| Measure (median)           | Before (6 tasks) | After (6 tasks) |
|----------------------------|------------------|-----------------|
| Hours from start to merge  | 9.5              | 7.0             |
| Review rounds per PR       | 2                | 2               |
| Lines changed per PR       | 140              | 210             |
| Bugs found after merge     | 1                | 2               |` },
      { type: 'paragraph', text: "Those numbers are an illustration, not a prediction. Yours may show a bigger gain, none, or a loss. Any of those makes a valid case study if the method is honest." },
      { type: 'prompt', label: 'Critique the draft', text: 'Here is my before/after case study on using AI in my development work. [paste]. Review it as a sceptical engineering manager. Tell me: which claims are not supported by the numbers, where the comparison might be unfair, what a reader would want to know that is missing, and whether any detail looks confidential. Then suggest a one-paragraph summary I could say aloud in an interview, without exaggerating.' },
      { type: 'warning', text: 'Get permission before you publish anything based on work for an employer or client, and never include their code, data, names or metrics they consider private. Describe the work in general terms.' },
      {
        type: 'activity',
        activity: {
          id: 'experienced-20-scenario-1',
          kind: 'scenario',
          title: 'The big headline',
          prompt: 'How do you write it up?',
          concept: 'honest case studies',
          situation: 'Your draft says "AI made me 40% faster". It rests on three tasks, and your log shows two of them had more bugs after merge.',
          options: [
            {
              text: 'Keep the 40% headline and cut the bug numbers.',
              consequence: 'It reads like an advertisement, and any careful reader will ask about quality.',
              quality: 'poor',
            },
            {
              text: 'Report the numbers with the number of tasks, include the extra bugs, and state that three tasks prove little.',
              consequence: 'Honest limits and failures earn trust. A case study where everything improved reads like an ad.',
              quality: 'best',
            },
            {
              text: 'Drop the case study: three tasks is too few to say anything.',
              consequence: 'Small samples are fine if you say so. The method and the failures are still worth showing.',
              quality: 'poor',
            },
          ],
          hints: [
            'What does a sceptical manager want to know?',
            'Which section do most people skip, and why does it earn trust?',
            'Say what the numbers cannot prove.',
          ],
          explanation: 'A short, honest write-up with numbers, method, failures and limits is evidence a manager, client or interviewer will trust.',
        },
      },
      { type: 'heading', text: 'Close the loop' },
      { type: 'paragraph', text: "Reread the note you wrote on day 1 about your opinion of AI tools. Add a paragraph to your case study on how your view changed, or did not, and why. That reflection, from a sceptic who measured, is worth more than any certificate, including this one." },
      { type: 'tip', text: 'Prepare a two-minute spoken version. Interviewers and managers often ask about AI in passing, and a calm, specific answer with one number and one honest limit stands out.' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Write the study so that a sceptical staff engineer could try to break it. State the question and the decision it supports before the results. Name the threats to validity: selection (you chose which tasks to try the tool on), novelty and learning effects, regression to the mean (you picked an unusually bad week as the baseline), concurrent changes such as a new framework or a staffing change, and changes in how you measured. Report distributions or intervals, not a bare headline; with six tasks per arm an interval often spans zero, and that is a valid finding. Include the costs a speed number hides: review time, rework, incidents, and licence or token spend. Place the work beside delivery measures such as DORA's throughput and instability groups. For a proposal to leadership, end with a recommendation, a pilot scope, success criteria and a stop condition.",
      },
      {
        type: 'takeaways',
        items: [
          'A case study shows numbers, method and honest limits: context, baseline, what changed, results, what went wrong, limits, recommendation.',
          '"What went wrong" earns the most trust.',
          'Say how many tasks are behind each number and what the numbers cannot prove.',
          'Get permission and remove confidential details before you publish.',
          'Prepare a calm two-minute spoken version with one number and one honest limit.',
        ],
      },
    ],
    quiz: [
      {
        id: 'experienced-20-q1',
        prompt: 'Why include a "what went wrong" section in your case study?',
        choices: [
          'It is required by GitHub',
          'It makes the study longer',
          'Showing failures and limits makes the results credible',
        ],
        answer: 2,
        explanation: 'A study where everything improved reads like an advertisement. Honest problems earn trust.',
      },
      {
        id: 'experienced-20-q2',
        prompt: 'Your results show no real speed-up. Is the case study still valid?',
        choices: [
          'Yes, if the method is honest and you explain what you learned',
          'No, only positive results count',
          'Only if you change the numbers',
        ],
        answer: 0,
        explanation: 'An honest null or negative result is useful evidence and shows good judgment.',
      },
      {
        id: 'experienced-20-q3',
        prompt: 'What should you do before publishing a case study based on client work?',
        choices: [
          'Include the client\'s code so readers can verify',
          'Name the client to add credibility',
          'Publish quickly before anyone notices',
          'Get permission and remove confidential details',
        ],
        answer: 3,
        explanation: 'Client work is usually covered by contracts and NDAs. Permission and anonymisation come first.',
      },
      {
        id: 'experienced-20-q4',
        audience: { max: 'beginner' },
        prompt: 'According to the lesson, what makes a case study believable?',
        choices: [
          "Using the biggest number you can find, and putting it in the first line",
          "Showing how many tasks were behind the numbers, and what went wrong",
          "Leaving out any task that took longer than expected, to keep things tidy",
          "Writing in complicated words so that it sounds professional to a manager",
        ],
        answer: 1,
        explanation: 'Readers trust a case study that shows its sample size, its failures and its limits. A bigger number, missing tasks or fancy words make it look like an advertisement.',
      },
      {
        id: 'experienced-20-q5',
        audience: { min: 'advanced' },
        prompt: 'You chose the three tasks you expected AI to help with most for your trial. What threat does that create?',
        choices: [
          "Selection bias: the trial favours the tool, so assign tasks by coin flip",
          "Regression to the mean: the tasks were too easy to measure with any accuracy",
          "No threat at all, because you are the expert on your own work and know the tasks",
          "Measurement drift: the stopwatch was probably inaccurate over the whole trial",
        ],
        answer: 0,
        explanation: 'Choosing the tasks you expect the tool to win on builds the answer into the trial. Random assignment, or at least stating the choice as a limit, addresses it.',
      },
    ],
    task: {
      title: 'Draft your case study',
      minutes: 20,
      steps: [
        'Collect your baseline and after numbers from your time log and Git history.',
        'Write a first draft using the seven-part structure, with a results table.',
        'Run the critique prompt and fix every unsupported claim it finds.',
        'Reread your day 1 note and add a short paragraph on how your view changed.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Write a half-page case study about something small you tried with AI this month, such as a page you built: what you did, one number, one thing that went wrong, and one thing you cannot say yet.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Add a 'threats to validity' section that names at least four threats and what you did about each, and give an interval or range for your key number.",
          "Write a pilot proposal for your team with success criteria and a stop condition.",
        ],
      },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'experienced-p1',
    title: 'Your AI-assisted workflow',
    summary: 'A written workflow document that says how you use AI in your own development work: rules, setup, approach and verification per task type, reusable prompts, and what you keep away from AI.',
    outcome: 'Shows an employer or client that you use AI with clear rules, verification and judgment, not just enthusiasm.',
    unlockAfterDay: 9,
    steps: [
      { id: 'experienced-p1-s1', text: 'Write down your company\'s or client\'s AI rules: approved tools, accounts, what you must never share, and disclosure.' },
      { id: 'experienced-p1-s2', text: 'Describe your setup: the tool you use, key settings (approvals, exclusions) and your repository instructions file.' },
      { id: 'experienced-p1-s3', text: 'For at least five task types you do often (for example reading code, refactoring, tests, debugging, review), write how you use AI and exactly how you verify the result.' },
      { id: 'experienced-p1-s4', text: 'Add three to five prompts you actually reuse, with names, client details and secrets removed.' },
      { id: 'experienced-p1-s5', text: 'Add your not-for-AI list and how you will measure whether the workflow helps.' },
      { id: 'experienced-p1-s6', text: 'Follow it for a few days of real work, revise it, and paste the final version below.' },
      {
        id: 'experienced-p1-s7',
        audience: { max: 'beginner' },
        text: 'Keep it small: write the rules, the setup and three task types (not five), each with one way you check the result. Ask the assistant to read your document and explain it back to you in plain words, then fix anything it misread.',
      },
      {
        id: 'experienced-p1-s8',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Base it on a real project of yours: put the commands you actually run to build, test and lint it into an instructions file, and show one task where a generated change failed those checks.',
      },
      {
        id: 'experienced-p1-s9',
        audience: { min: 'advanced' },
        text: 'Add a team section: who owns the instructions file, which tasks always need a human first, and an incident path for an AI-caused defect or a leaked secret. Move at least two rules from prose into enforcement (a permission rule, a hook or a CI check) and link the evidence for each.',
      },
      {
        id: 'experienced-p1-s10',
        audience: { min: 'professional' },
        text: 'Show one agent-assisted run end to end on a real task: the plan you approved, the checks you ran yourself, the diff you reviewed and what you corrected. Attach the commands and their output to the document.',
      },
    ],
    submission: {
      kind: 'text',
      label: 'Your workflow document',
      placeholder: '# My AI-assisted workflow\nLast updated: ...\n\n## Rules I follow\n...',
      hint: 'Paste the whole document (Markdown is fine). Include rules, setup, a task table with a verification step for each, reusable prompts and your not-for-AI list. Remove company and client names.',
    },
    rubric: [
      'Names approved tools and respects policy: no secrets, client data or unapproved sharing of company code.',
      'Covers at least five task types, each with a concrete verification step.',
      'Includes at least three reusable prompts that are specific, not generic.',
      'States clearly what the learner will not use AI for, with reasons.',
      'Is specific to the learner\'s stack and work, and short enough to follow day to day.',
    ],
    rubricExtra: [
      {
        audience: { max: 'beginner' },
        items: [
          'Keeps the scope small (rules, setup and three task types) and says how each result is checked.',
          'Explains key terms in the learner\'s own words and shows no secrets or private data.',
        ],
      },
      {
        audience: { min: 'intermediate', max: 'intermediate' },
        items: ['Uses the commands of a real project and shows one generated change that failed a check.'],
      },
      {
        audience: { min: 'advanced' },
        items: [
          'Names owners and an incident path, with at least two rules enforced by permissions, hooks or CI instead of only written down.',
          'Links each non-obvious rule to evidence such as an incident, a measurement or a review finding.',
        ],
      },
      {
        audience: { min: 'professional' },
        items: ['Includes review evidence from an agent-assisted run: the approved plan, the learner\'s own check output, the reviewed diff and the corrections made.'],
      },
    ],
  },
  {
    id: 'experienced-p2',
    title: 'Before/after case study',
    summary: 'A short, honest write-up comparing comparable tasks before and after you adopted your AI-assisted workflow, with numbers, method, failures and limits.',
    outcome: 'Gives a manager, client or interviewer measured evidence of how you work with AI, including what did not work.',
    unlockAfterDay: 19,
    steps: [
      { id: 'experienced-p2-s1', text: 'Choose two or three task types and the measures you will compare (for example cycle time, review rounds, bugs after merge, time on task).' },
      { id: 'experienced-p2-s2', text: 'Collect baseline numbers from your time log, Git history or `gh pr list`, using the same method you will use after.' },
      { id: 'experienced-p2-s3', text: 'Do comparable tasks with your AI-assisted workflow and record the same measures.' },
      { id: 'experienced-p2-s4', text: 'Write the case study: context, baseline, what changed, results table, what went wrong, limits, recommendation, and how your view changed since day 1.' },
      { id: 'experienced-p2-s5', text: 'Remove confidential details and get permission if the work belongs to an employer or client.' },
      { id: 'experienced-p2-s6', text: 'Publish it as a repository README, a gist or a blog post, and submit the link.', link: 'https://github.com/new' },
      {
        id: 'experienced-p2-s7',
        audience: { max: 'beginner' },
        text: 'Keep it small: compare three similar small tasks before and after, using a simple notebook of times. Write what you tried, one number, one thing that went wrong and one thing you cannot say.',
      },
      {
        id: 'experienced-p2-s8',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'Use a real project of your own that has tests. For each task record the time, whether the tests passed on the first run and any bugs found later, and compare similar tasks only.',
      },
      {
        id: 'experienced-p2-s9',
        audience: { min: 'advanced' },
        text: 'Write a protocol before you collect data: the measures (one throughput and one instability measure), task assignment by coin flip, the sample size and a stop condition. Report an interval or range, and add a threats-to-validity section with at least four threats.',
      },
      {
        id: 'experienced-p2-s10',
        audience: { min: 'professional' },
        text: 'Write a one-page pilot proposal for your team: scope, success criteria, costs including review time and token spend, risks, a stop condition and who will review the results. Link the case study as evidence.',
      },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your case study',
      placeholder: 'https://github.com/yourname/ai-workflow-case-study',
      hint: 'A public or shareable link to a write-up or repository. It should include a results table, the method, at least one thing that went wrong, and the limits of your numbers.',
    },
    rubric: [
      'Has a clear baseline and after, measured the same way on comparable tasks.',
      'Shows numbers in a table with the number of tasks behind them.',
      'Reports at least one failure, slowdown or quality problem honestly.',
      'States the limits of the comparison and does not overclaim.',
      'Contains no confidential code, data or client names.',
      'Ends with a concrete, reasoned recommendation.',
    ],
    rubricExtra: [
      {
        audience: { max: 'beginner' },
        items: ['Is small and honest: three comparable tasks, simple times, one failure and one limit stated plainly.'],
      },
      {
        audience: { min: 'intermediate', max: 'intermediate' },
        items: ['Compares similar tasks on a real project and records test results and later bugs alongside the time.'],
      },
      {
        audience: { min: 'advanced' },
        items: ['States a protocol before the data, gives an interval or range, and names at least four threats to validity with what was done about each.'],
      },
      {
        audience: { min: 'professional' },
        items: ['Ends with a pilot proposal that has success criteria, full costs (review time and spend), risks and a stop condition.'],
      },
    ],
  },
];

export const experiencedCourse: Course = {
  id: 'experienced',
  kind: 'career',
  level: 'intermediate',
  title: 'Experienced Developer: Code with AI',
  tagline: 'Keep your judgment, add speed, and measure it honestly.',
  description: 'For developers with years of hands-on coding who are sceptical of AI tools or just starting with them. Over 20 short days you set up an assistant safely, use it for reading, refactoring, testing, debugging, review and docs, learn where it hurts, and build AI features into products. You finish with your own written workflow and a before/after case study with real numbers.',
  finishLine: [
    'Your own AI-assisted workflow document, with rules, setup and a verification step for every task type',
    'A before/after case study with honest numbers, failures and limits',
    'A repository instructions file and a set of prompts you actually reuse',
    'A clear list of what you will not hand to AI, and why',
  ],
  audiences: ['experienced-dev'],
  skills: [
    { id: 'ai-workflow', label: 'AI-assisted workflow' },
    { id: 'context-prompting', label: 'Context and prompting' },
    { id: 'safe-change', label: 'Safe changes and testing' },
    { id: 'review-security', label: 'Review and security' },
    { id: 'ai-features', label: 'AI features and evaluation' },
    { id: 'team-impact', label: 'Team practice and measurement' },
  ],
  lessons,
  projects,
  coachRole: {
    id: 'code-reviewer',
    label: 'Code reviewer',
    description: 'Paste code or a diff and Tali reviews it like a senior engineer: correctness first, then security, then readability.',
    instructions: 'Act as a senior engineer reviewing the code or diff the learner pastes. Review in this order: correctness (bugs, edge cases, error handling), then security (injection, authorisation, secrets, risky dependencies), then readability and maintainability. If you are missing context such as the language version, framework, expected behaviour or how the code is called, ask for it before judging instead of assuming. Suggest concrete changes as small diffs or replacement snippets, mark each as must-fix or suggestion, and explain briefly why each matters. If the pasted code contains secrets, personal data or looks like confidential company code, point it out and remind the learner to follow their AI policy.',
  },
  icon: 'terminal',
  updated: '2026-11-13',
};
