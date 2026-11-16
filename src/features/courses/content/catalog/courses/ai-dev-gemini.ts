import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Gemini for Software Development (ai-coding-tools). Every product statement sits in a `version` note checked on
 * 2026-11-14 against the pages below, which were opened that day. Google's developer docs now live at
 * aistudio.google.com/docs (ai.google.dev redirects there); the Gemini CLI pages are read from its GitHub repository.
 * Things that moved this year and are taught as such: Gemini CLI is now an enterprise tool, free and Google AI Pro/Ultra
 * access moved to Antigravity CLI on 2026-06-18, and new Gemini Code Assist subscriptions are no longer sold.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  geminiLimits: { label: 'Gemini Apps Help: Limits and feature availability', url: 'https://support.google.com/gemini/answer/16275805' },
  geminiPrivacy: { label: 'Gemini Apps Help: Privacy Hub', url: 'https://support.google.com/gemini/answer/13594961' },
  googleAiPlans: { label: 'Google AI plans', url: 'https://one.google.com/about/google-ai-plans/' },
  models: { label: 'Gemini API docs: Models', url: 'https://aistudio.google.com/docs/models' },
  quickstart: { label: 'Google AI Studio quickstart', url: 'https://aistudio.google.com/docs/ai-studio-quickstart' },
  buildMode: { label: 'Google AI Studio: Vibe code in Build', url: 'https://aistudio.google.com/docs/aistudio-build-mode' },
  fullstack: { label: 'Google AI Studio: Full-stack apps', url: 'https://aistudio.google.com/docs/aistudio-fullstack' },
  apiKey: { label: 'Gemini API docs: API keys', url: 'https://aistudio.google.com/docs/api-key' },
  getStarted: { label: 'Gemini API docs: Getting started', url: 'https://aistudio.google.com/docs/get-started' },
  pricing: { label: 'Gemini API docs: Pricing', url: 'https://aistudio.google.com/docs/pricing' },
  rateLimits: { label: 'Gemini API docs: Rate limits', url: 'https://aistudio.google.com/docs/rate-limits' },
  terms: { label: 'Gemini API Additional Terms of Service', url: 'https://aistudio.google.com/docs/terms' },
  logsPolicy: { label: 'Gemini API docs: Data logging and sharing', url: 'https://aistudio.google.com/docs/logs-policy' },
  prompting: { label: 'Gemini API docs: Prompt design strategies', url: 'https://aistudio.google.com/docs/prompting-strategies' },
  longContext: { label: 'Gemini API docs: Long context', url: 'https://aistudio.google.com/docs/long-context' },
  imageUnderstanding: { label: 'Gemini API docs: Image understanding', url: 'https://aistudio.google.com/docs/image-understanding' },
  codingAgents: { label: 'Gemini API docs: Coding agent setup', url: 'https://aistudio.google.com/docs/coding-agents' },
  cliReadme: { label: 'Gemini CLI on GitHub (README)', url: 'https://github.com/google-gemini/gemini-cli' },
  cliGeminiMd: { label: 'Gemini CLI docs: GEMINI.md context files', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md' },
  cliPlan: { label: 'Gemini CLI docs: Plan Mode', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md' },
  cliTrusted: { label: 'Gemini CLI docs: Trusted Folders', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/trusted-folders.md' },
  cliSandbox: { label: 'Gemini CLI docs: Sandboxing', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md' },
  cliHeadless: { label: 'Gemini CLI docs: Headless mode', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/headless.md' },
  cliReference: { label: 'Gemini CLI docs: CLI reference', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/cli-reference.md' },
  cliTools: { label: 'Gemini CLI docs: Tools reference', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/tools.md' },
  cliIgnore: { label: 'Gemini CLI docs: Ignoring files', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-ignore.md' },
  cliCheckpoint: { label: 'Gemini CLI docs: Checkpointing', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/checkpointing.md' },
  cliPolicy: { label: 'Gemini CLI docs: Policy engine', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/policy-engine.md' },
  cliPackage: { label: 'Gemini CLI package.json (Node.js requirement)', url: 'https://github.com/google-gemini/gemini-cli/blob/main/package.json' },
  cliConfig: { label: 'Gemini CLI docs: Configuration reference', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md' },
  cliCommands: { label: 'Gemini CLI docs: Commands reference', url: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/commands.md' },
  codeAssist: { label: 'Gemini Code Assist overview', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/overview' },
  codeAssistAgent: { label: 'Gemini Code Assist: Agent mode', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/agent-mode' },
  codeAssistChat: { label: 'Gemini Code Assist: Agent mode chat and context', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer' },
  codeAssistData: { label: 'Gemini for Google Cloud: How it handles your data', url: 'https://docs.cloud.google.com/gemini/docs/discover/data-governance' },
  owaspLlm01: { label: 'OWASP GenAI: LLM01 Prompt Injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    id: 'ai-dev-gemini-01',
    day: 1,
    title: 'What Gemini offers a software builder',
    summary: 'Gemini is a family of models reached through four different doors; learn what each door is for and which ones Google has changed this year.',
    minutes: 20,
    skills: ['gemini-surfaces'],
    intro: {
      objectives: [
        'Name the four ways to reach Gemini and say what each is best at',
        'Explain what Google now says about Gemini CLI and Gemini Code Assist',
        'Pick the right Gemini surface for a given building task',
      ],
      why: 'Most confusion about Gemini comes from one word naming many things. If you know which door you are standing at, you know what Gemini can see, what it can change, who may use it and what happens to your data.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Gemini is the name of Google's family of AI models, and it is also the name of several things you use to reach them. That is the first source of confusion. A **model** is the engine: it reads your request and writes a reply. A **product** is the vehicle built around the engine: a chat window, a web workbench, a terminal program, an editor panel. The same engine can sit inside different vehicles, and each vehicle has its own rules about what the engine can see, what it can change, who is allowed to use it and what happens to what you type. This lesson maps the vehicles so you always know which one you are in.",
      },
      { type: 'heading', text: 'Four ways to reach Gemini' },
      {
        type: 'table',
        headers: ['Door', 'What it is', 'Good for', 'Watch out for'],
        rows: [
          ['The Gemini app', 'A chat in the browser or on a phone, with features such as Canvas and Deep Research', 'Questions, explanations, short snippets, one-off scripts', 'It sees only what you type or upload, and with Keep Activity on some chats are read by human reviewers'],
          ['Google AI Studio', "Google's web workbench: a Playground to test prompts, Build mode to describe an app and watch it run, and the page that creates API keys", 'Trying prompts, a first full app, getting a key', 'Free use is an unpaid service whose content can be used to improve Google products'],
          ['The Gemini API', 'The way your own program calls Gemini, using an API key and a software kit (SDK)', 'When your app itself needs AI: summaries, chat, reading images', 'The key must stay on a server, and limits are counted per project'],
          ['Terminal and editor agents', 'Gemini CLI, Gemini Code Assist and the Antigravity tools, which read a project folder and change files', 'Work inside a real codebase', 'Their availability changed this year (see below)'],
        ],
        caption: 'The four doors to Gemini',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Some plain definitions. A **studio** here just means a workbench: AI Studio is a web page where you can try the AI, change its settings and see what comes out, like a test bench in a workshop. A **terminal** is a window where you type commands as text instead of clicking buttons; a **terminal agent** is an AI helper that lives in that window and can read and change the files in a folder you point it at. An **API key** is a long secret code, like a password, that tells Google 'this request comes from me'. Google uses it to count how much you use and to apply your limits, so anyone who gets your key can use your allowance. You will meet each of these again in the next lessons; for now, just know which door is which.",
      },
      { type: 'heading', text: 'Old tutorials may be out of date' },
      {
        type: 'paragraph',
        text: "Many videos and blog posts describe Gemini CLI as a free tool you sign into with a personal Google account, and Gemini Code Assist as a paid editor add-on you can buy. Both statements changed in 2026. Google's own pages now say Gemini CLI is meant for organisations with a Gemini Code Assist Standard or Enterprise licence, that free individual access and Google AI Pro and Ultra access moved to a different tool called Antigravity CLI, and that new Code Assist subscriptions are no longer sold. The lesson for a builder: product facts about AI tools have a short shelf life, so you check the dated notes in this course and then check the official page yourself.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Gemini Apps Help lists plans for the Gemini app: no plan, Google AI Plus, Google AI Pro and Google AI Ultra. Usage limits are compute-based, refresh every 5 hours until you reach a weekly limit, and Google says they may change without notice. The app's context window (how much text it can hold at once) is smaller with no plan and about a million tokens on Pro and Ultra. The AI Studio docs describe a Playground and Build mode, and the model list names a Gemini 4 family (Carbon, Argon and Hydrogen) as the newest, Gemini 3.x models below it, and marks Gemini 2.5 Pro and Flash as deprecated. Model names and limits move often: open the pages for today's list.",
        checked: CHECKED,
        sources: [DOCS.geminiLimits, DOCS.googleAiPlans, DOCS.models, DOCS.buildMode],
        plans: 'Gemini app: no plan, Google AI Plus, Pro, Ultra',
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The Gemini CLI README (an open-source terminal agent under the Apache 2.0 licence) says it is designed for organisations with Gemini Code Assist Standard or Enterprise licences or Code Assist for GitHub on Google Cloud, plus legacy paid API and Vertex keys. It says free individual access and Google AI Pro and Ultra moved to Antigravity CLI on 18 June 2026, and that Gemini CLI is not tuned for the Gemini 4 series. The Gemini Code Assist overview says new subscriptions are no longer available for purchase, lists a Standard and an Enterprise edition, supports VS Code, JetBrains IDEs, Android Studio, Cloud Shell Editor and Cloud Workstations, and recommends Antigravity CLI for the best coding experience with Gemini models.",
        checked: CHECKED,
        sources: [DOCS.cliReadme, DOCS.codeAssist],
        plans: 'Gemini Code Assist Standard or Enterprise (existing customers)',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Choosing a door for a task',
        source: `flowchart TD
  A[A task for Gemini] --> B{Does my own app need to call Gemini?}
  B -->|yes| C[The Gemini API, with a key kept on a server]
  B -->|no| D{Must it read and change files in a project folder?}
  D -->|yes| E[A terminal or editor agent]
  D -->|no| F{Do I want a running app from a description?}
  F -->|yes| G[Google AI Studio Build mode]
  F -->|no| H[The Gemini app chat]`,
      },
      { type: 'toolComparison', tools: ['gemini', 'chatgpt', 'claude'], caption: 'Gemini beside two other chat assistants (shared tool data, checked 2026-11-14)' },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Separate three things that vendors blur together: the model, the harness around it (the loop that reads files, calls tools and asks for approval) and the contract (which edition, whose data terms, which admin controls). A tool can be strong in one and weak in another. Google's README says its own harness was not tuned for the newest models and should not be used to benchmark them, which is a reminder that a coding result belongs to the model and the harness together. For a team, the durable questions are governance questions: which account type and contract, where prompts and code go, what the agent may change without asking. Pin decisions to those, not to a model name that the docs list today and deprecate next season.",
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-01-scenario-1',
          kind: 'scenario',
          title: 'Which door for the bakery page?',
          prompt: 'Pick the best way to start.',
          concept: 'choosing a Gemini surface',
          situation: "A friend runs a small bakery. She has never coded, has no project folder, and wants a web page that shows today's menu and lets her change the prices herself. She asks you where to start with Gemini.",
          options: [
            { text: 'Open Google AI Studio, use Build mode, describe the page, and watch the running preview while she asks for changes.', consequence: 'Best fit. Build mode turns a description into a running app with a preview and a chat for changes, with no folder or install needed.', quality: 'best' },
            { text: 'Ask the Gemini app chat for the page as HTML, then copy it into a file and open it in a browser.', consequence: 'It works for one page, but she must save, open and re-copy every change herself, and the chat cannot run or preview her page.', quality: 'acceptable' },
            { text: "Install Gemini CLI and sign in with her free Google account, because a 2025 video said that is how to do it.", consequence: "Google's README says free individual access moved to Antigravity CLI on 18 June 2026, and a terminal tool is a heavy start for someone who has never coded.", quality: 'poor' },
          ],
          hints: [
            'She has no project folder and has never used a terminal.',
            'Which door lets you describe an app and see it running straight away?',
            'One option depends on a statement Google says is no longer true.',
          ],
          explanation: 'AI Studio Build mode matches a newcomer who wants a running result from a description. The chat works but leaves the building to her, and the old CLI advice is exactly the kind of dated tutorial this lesson warns about.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-01-match-1',
          kind: 'match',
          title: 'Match the task to the door',
          prompt: 'Match each situation to the Gemini door that fits it best.',
          concept: 'choosing a Gemini surface',
          labels: { terms: 'Situation', meanings: 'Best door' },
          pairs: [
            { term: 'Yesterday you got a confusing error message and want it explained in plain words.', definition: 'The Gemini app chat' },
            { term: 'Your shop app must summarise customer reviews by itself, every night, with no person typing.', definition: 'The Gemini API' },
            { term: 'You want to run the same prompt three ways and compare the answers side by side with settings you control.', definition: "AI Studio's Playground" },
            { term: 'Your company holds a Gemini Code Assist Standard licence and wants an agent to work inside its repository from the terminal.', definition: 'Gemini CLI' },
          ],
          hints: [
            'Ask who or what is doing the asking: a person in a chat, your program, or an agent working in files.',
            'Two doors are for testing and chatting; two are for building and automation.',
            'The Standard licence is named in the README as the audience for the CLI.',
          ],
          explanation: 'A person asking a question fits the chat; a program calling Gemini needs the API; side-by-side testing is the Playground; and the CLI is the terminal agent that Google now ties to Code Assist licences.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-01-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four words to know',
          prompt: 'Tap each card to check the word against its plain meaning.',
          concept: 'AI tool vocabulary',
          cards: [
            { front: 'Model', back: 'The AI engine itself. It reads your request and writes a reply. Gemini 4 and Gemini 3 are models.' },
            { front: 'AI Studio', back: "A web workbench from Google where you try prompts, build a small app from a description and create an API key." },
            { front: 'Terminal', back: 'A window where you type commands as text. A terminal agent lives there and can read and change the files in a folder.' },
            { front: 'API key', back: 'A secret code that tells Google a request comes from you. Treat it like a password and never post it or put it in a web page.' },
          ],
          hints: ['Read each front, say the meaning in your own words, then tap to compare.', 'Tap every card before you move on.'],
          explanation: 'These four words come back in every lesson. If one feels fuzzy, tap it again before continuing.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'Gemini is a family of models; the Gemini app, AI Studio, the API and the terminal and editor agents are different doors to it.',
          'Each door decides what Gemini can see, what it can change and how your data is handled.',
          'Gemini CLI is now an enterprise tool; free and Google AI Pro or Ultra access moved to Antigravity CLI, and new Code Assist subscriptions are no longer sold.',
          'Tutorials on AI tools age fast: trust dated, sourced notes and check the official page.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-01-q1',
        prompt: 'Where do you create the API key that your own code uses to call Gemini?',
        choices: ["In the Gemini app's chat settings", "On Google AI Studio's API keys page", 'By running the Gemini CLI install command', "In the Antigravity download page's licence step"],
        answer: 1,
        explanation: 'AI Studio creates a project and key for new users and has an API keys page for new ones. The chat app and the CLI install are different doors.',
      },
      {
        id: 'ai-dev-gemini-01-q2',
        prompt: 'A 2025 tutorial says: install Gemini CLI and sign in with your free Google account. What does Google say today?',
        choices: ["Free personal access moved to Antigravity CLI in June 2026; Gemini CLI now serves Code Assist licences and paid keys", "It still works exactly as the tutorial says, because Gemini CLI remains a free tool for every personal Google account today, as before", "The npm package was removed from the registry in June 2026, so nobody at all can install or start the CLI any longer on any computer", "It works only if you buy Google AI Pro, because free accounts are turned away at the sign-in screen with a page about billing plans"],
        answer: 0,
        explanation: "The README says free individual access and Google AI Pro and Ultra moved to Antigravity CLI, while the CLI stays for Code Assist Standard or Enterprise and paid API or Vertex keys. The package still exists, which is why old tutorials mislead.",
      },
      {
        id: 'ai-dev-gemini-01-q3',
        prompt: 'What is the difference between a Gemini model and a Gemini product?',
        choices: ["They are the same thing; Google uses two names only because the marketing team likes variety in every one of its announcements", "A product is a bigger and more expensive model that Google releases once a year, to replace each of the earlier models completely", "A model is the AI engine; a product is the chat, workbench or tool built around it, with its own rules", "A model runs only on Google's servers, while a product runs only on your own phone or laptop without any network connection at all"],
        answer: 2,
        explanation: 'The same models appear in different products, and each product decides what the model can see and change and how your data is handled.',
      },
      {
        id: 'ai-dev-gemini-01-q4',
        audience: { max: 'beginner' },
        prompt: 'Why should an API key be treated like a password?',
        choices: ["Anyone who has it can use your allowance and make requests as you", "It stores your Gemini chat history so the website can show it to you again", "It is needed every time you open the Gemini website, to log you in quickly", "It makes your computer faster when it talks to the model"],
        answer: 0,
        explanation: 'A key tells Google a request comes from you, so a stolen key lets someone else use your limits or run up charges.',
      },
      {
        id: 'ai-dev-gemini-01-q5',
        audience: { min: 'advanced' },
        prompt: "Your security lead asks which Gemini coding tool to approve for the whole team. What is the most durable first question?",
        choices: ["Which model name tops this month's public leaderboards, because that single fact decides everything else for the whole team here", "Which tool has the nicest terminal colours and the friendliest installer, since the whole team will look at it every working day", "Which tool appeared in the most popular tutorial video this year, since that many viewers have clearly already tried it out", "Which account type and contract apply, where code and prompts go, and what the agent may change unasked"],
        answer: 3,
        explanation: 'Model names and product availability change within months, but who holds the contract, where code and prompts go and what an agent may do unasked stay the deciding questions.',
      },
    ],
    task: {
      title: 'Map your doors',
      minutes: 15,
      steps: [
        'Open the Gemini app and Google AI Studio in two browser tabs. Sign in to both with the Google account you will use for this course.',
        'Write a four-row table in a notes file: door, what it is, one task you would use it for, one risk. Use the table in this lesson as a check, not as a copy.',
        "Open the Gemini CLI page on GitHub and read the notice at the top of the README. Write one sentence on whether a free personal account can use Gemini CLI today, with the date you checked.",
        'Pick one real thing you want to build with Gemini and write which door you would start at and why.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask the Gemini app: 'Explain what a terminal and an API key are, in everyday words, with one example each.' Compare its answer with the plain definitions in this lesson and note one thing you want to check.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Draft a half-page approval note for your team: which Gemini door is allowed for which data (public code, private code, customer data), on which account type, and who reviews agent-made changes. Cite the page you relied on for each rule.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: 'ai-dev-gemini-02',
    day: 2,
    title: 'Getting started with Gemini and Google AI Studio',
    summary: 'Run your first prompt in AI Studio, understand what the free tier costs you in privacy, and set up an API key you can use without ever leaking it.',
    minutes: 25,
    skills: ['ai-studio-setup'],
    intro: {
      objectives: [
        'Run a prompt in the AI Studio Playground with system instructions',
        'Create an API key and keep it in an environment variable',
        'Explain what happens to your content on the free and paid tiers',
      ],
      why: 'AI Studio is the easiest place to start, and the API key it hands you is the most dangerous thing in this course if you mishandle it. Learn the safe habit on day two, before you have anything to lose.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Google AI Studio is where most Gemini builders begin. You sign in with a Google account, accept the terms, and land in a Playground: a page where you type a prompt, press Run and read the answer. Unlike the Gemini app, it exposes the controls: which model, what standing instructions, which tools are switched on. That makes it the best place to learn how Gemini behaves, and the place you go to get an API key when you want your own program to talk to it.",
      },
      { type: 'heading', text: 'Your first prompt, with standing instructions' },
      {
        type: 'paragraph',
        text: "In the Playground, open **Run settings** and find the **System instructions** box. System instructions are rules the model follows for the whole conversation, before it reads any of your messages: its role, its tone, its limits. Google's own quickstart builds a character this way, and the same box is how you turn a general assistant into a patient coding tutor.",
      },
      {
        type: 'prompt',
        label: 'System instructions to paste in Run settings',
        text: "You are a patient coding tutor for people who have never written code. Answer in at most five short lines. Define any technical word you use. End every answer with one question that checks I understood.",
      },
      {
        type: 'prompt',
        label: 'Then type this in the chat box and press Run',
        text: 'What is a variable? Use a sari-sari store example.',
      },
      {
        type: 'paragraph',
        text: "A reply in this style might look like the example below. It is an illustration of the shape you should expect, not a recording: your model, your settings and the day you run it will give different words.",
      },
      {
        type: 'code',
        language: 'text',
        label: 'Example reply (illustrative)',
        code: "A variable is a labelled box that holds a value.\nIn a sari-store, a box labelled 'price of Kopiko' holds 15 today and 17 next week.\nIn code you write the label once and change the value when it changes.\nThe label is the variable's name; the value is what is inside.\nIf the price rises to 17, which part of the box do you change: the label or the value?",
      },
      { type: 'heading', text: 'Free has a price: your content' },
      {
        type: 'paragraph',
        text: "AI Studio and the free quota of the Gemini API are, in Google's terms, an unpaid service. For unpaid services Google says it uses what you submit, and the answers, to improve its products and machine learning, and that human reviewers may read and annotate it after it is disconnected from your account. Google says in plain words not to submit sensitive, confidential or personal information to unpaid services. The paid tier works differently: Google says it does not use prompts and responses from paid services to improve its products. So the rule for the free Playground is simple: practise with made-up and public material only.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The Gemini API Terms say Google AI Studio and unpaid quota in the Gemini API are Unpaid Services: Google uses submitted content and responses to provide, improve and develop its products, human reviewers may read and annotate it, and you should not submit sensitive, confidential or personal information. Access through a Cloud project with an active billing account is a Paid Service, where Google says it does not use your prompts or responses to improve products. For people in the European Economic Area, Switzerland and the United Kingdom, the paid-service terms apply to all services. The pricing page describes a free tier for getting started with limited access to some models, and says some newer models are not available on it. Terms and tiers change: read the pages before you rely on them.",
        checked: CHECKED,
        sources: [DOCS.terms, DOCS.pricing, DOCS.logsPolicy],
        plans: 'Free tier, Paid tier (billing enabled), Enterprise',
      },
      { type: 'heading', text: 'Your API key, and your first call' },
      {
        type: 'paragraph',
        text: "An API key is created on AI Studio's API keys page; new users get a default project and key automatically after accepting the terms. Google's documentation tells you to put the key in an environment variable named `GEMINI_API_KEY` (the SDKs also accept `GOOGLE_API_KEY`, which wins if both are set). An **environment variable** is a named setting that lives in your computer's environment instead of inside your code, so the code can read the secret without containing it. Here is the smallest working program, adapted from Google's getting-started guide.",
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Set the key once in your terminal session',
        code: 'export GEMINI_API_KEY="paste-your-key-here"\nnpm install @google/genai',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'hello-gemini.mjs',
        code: 'import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({});\n\nconst interaction = await ai.interactions.create({\n  model: "gemini-4-hydrogen",\n  input: "Explain how AI works in a few words",\n});\nconsole.log(interaction.output_text);',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "What this program does, line by line. The first line borrows Google's ready-made toolkit (the **SDK**) so you do not have to write the plumbing. The `new GoogleGenAI({})` line creates a connection to Gemini; the empty braces mean 'look for my key in the environment', which is why the key never appears in the file. The `ai.interactions.create` part sends one request: the model's name and your message. The last line prints Gemini's reply. If you pasted this file into a chat or a GitHub repository, nobody would learn your key from it, and that is the whole point of the design. The model name is the part most likely to change; the docs list the current ones.",
      },
      {
        type: 'warning',
        text: "Protect an API key like a password. Never commit it to a repository, never put it in a web or mobile app's code (Google says keys compiled into client-side code can be extracted by users), and never paste it into a chat, a screenshot or a video. If it leaks, create a replacement, deploy it, disable the old key, and check usage for anything you did not do.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Google's API key page says: AI Studio creates a default project and key for new users; keys created in AI Studio are authorization keys bound to a service account, and unrestricted standard keys are rejected; set GEMINI_API_KEY or GOOGLE_API_KEY (GOOGLE_API_KEY takes precedence); keep keys out of source control and out of web and mobile apps, calling Gemini through a backend instead; store production keys in a secret manager and set billing alerts; restrict keys, for example by IP address or to the Gemini API only. The getting-started guide uses @google/genai (npm) and google-genai (Python), and the docs index tells coding agents never to use the deprecated google-generativeai or @google/generative-ai packages. The guide's first call uses ai.interactions.create with the model name gemini-4-hydrogen.",
        checked: CHECKED,
        sources: [DOCS.apiKey, DOCS.getStarted, DOCS.codingAgents],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Think of the key as a credential with a blast radius and design around it. Quotas are applied per project, not per key, so two apps sharing one project share one allowance and one bill: give each app its own project, and restrict each key to the Gemini API (and to server IP addresses where you can). Keep the key server-side behind your own endpoint, which is also where you add authentication, rate limiting and abuse checks, because a leaked or abused key costs money rather than just data. In production use a secret manager, rotate on a schedule and on any suspicion, and set billing alerts so a runaway loop pages a human. Browser-side calls need short-lived credentials, not a long-lived key.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Checked 2026-11-14. The rate limits page says limits are measured as requests per minute, input tokens per minute and requests per day, are applied per project and not per key, and depend on a usage tier (Free, Tier 1, Tier 2, Tier 3) that rises with cumulative Google Cloud spend; you must set up billing to leave the Free tier. Daily quotas reset at midnight Pacific time, and preview models have stricter limits.",
        checked: CHECKED,
        sources: [DOCS.rateLimits],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-02-fix-1',
          kind: 'fix-bug',
          title: 'The key in the file',
          prompt: 'This server file is about to be committed to a public GitHub repository. Tap the line that exposes the secret and choose the safe fix.',
          concept: 'keeping API keys out of code',
          language: 'javascript',
          code: `import { GoogleGenAI } from '@google/genai';

// server.mjs, committed to the repository
const ai = new GoogleGenAI({ apiKey: 'AIzaSy-EXAMPLE-NOT-A-REAL-KEY' });

export async function summarise(text) {
  const interaction = await ai.interactions.create({
    model: 'gemini-4-hydrogen',
    input: \`Summarise in one sentence: \${text}\`,
  });
  return interaction.output_text;
}`,
          bugLine: 4,
          fixes: [
            { line: '  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });', correct: true, why: 'The code reads the key from an environment variable at run time, so the repository never contains it. Set the variable on the machine or in the hosting dashboard.' },
            { line: "  const ai = new GoogleGenAI({ apiKey: atob('QUl6YVN5LUVYQU1QTEUtTk9ULUEtUkVBTC1LRVk=') });", correct: false, why: 'Base64 is an encoding, not protection. Anyone can decode it in one step, and it is still committed to the repository.' },
            { line: "  const ai = new GoogleGenAI({ apiKey: 'AIzaSy-EXAMPLE-' + 'NOT-A-REAL-KEY' });", correct: false, why: 'Splitting the string does not hide it. The full key is still in the file and in the git history.' },
            { line: "  const ai = new GoogleGenAI({ apiKey: window.localStorage.getItem('key') });", correct: false, why: 'This file runs on a server, which has no window or localStorage. Browser storage is also readable by anyone using the page.' },
          ],
          hints: [
            'Look for the line that contains a real-looking secret value.',
            'The secret must not be a literal in the file, even disguised.',
            'Read the value from the environment, as the GEMINI_API_KEY setting does in the docs.',
          ],
          explanation: 'Only reading the key from the environment keeps it out of the repository. Hiding or encoding a literal still leaves the secret in the file, and a key that was ever committed should also be rotated.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-02-arrange-1',
          kind: 'arrange',
          title: 'From sign-in to first reply',
          prompt: 'Put the steps of your first Gemini API call in a sensible order.',
          concept: 'first API call workflow',
          language: 'text',
          solution: [
            'Sign in to Google AI Studio and accept the terms',
            'Open the API keys page and copy your key',
            'Store the key in the GEMINI_API_KEY environment variable',
            'Install the SDK with npm install @google/genai',
            'Run a script that sends one prompt and prints the reply',
          ],
          alternatives: [
            [
              'Sign in to Google AI Studio and accept the terms',
              'Open the API keys page and copy your key',
              'Install the SDK with npm install @google/genai',
              'Store the key in the GEMINI_API_KEY environment variable',
              'Run a script that sends one prompt and prints the reply',
            ],
          ],
          reasons: [
            'You need an account and the accepted terms before a project and key exist.',
            'The key is created and shown on the API keys page.',
            'The key goes into the environment, not into your code.',
            'The SDK is the toolkit your script imports; it can be installed before or after the key is stored.',
            'Running the script comes last, when both the key and the SDK are in place.',
          ],
          hints: [
            'Something has to exist before you can copy it.',
            'The script cannot run until both the key and the SDK are ready.',
            'Account, key, environment variable, SDK, run. The last two setup steps can swap.',
          ],
          explanation: 'Account first, then key, then setup (key in the environment and the SDK, in either order), then the run. The key never goes into the script.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'AI Studio is a workbench: the Playground exposes the model, system instructions and tools that the chat app hides.',
          'Free use is an unpaid service: Google may use the content and human reviewers may read it, so practise with public or made-up material.',
          'Keep the key in GEMINI_API_KEY, out of repositories, screenshots and browser code.',
          'If a key leaks, replace it, switch to the new one, disable the old one and check usage.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-02-q1',
        prompt: 'What are system instructions in the AI Studio Playground?',
        choices: ["Rules the model follows for the whole conversation, such as its role, tone and limits", "A list of the errors the model made in your last prompt, kept so you can correct them", "The steps for installing the SDK and setting your key on your own computer"],
        answer: 0,
        explanation: 'System instructions are standing rules applied before your messages, which is how you turn a general assistant into, for example, a short-answer coding tutor.',
      },
      {
        id: 'ai-dev-gemini-02-q2',
        prompt: 'Which place is safe for a Gemini API key used by a server program?',
        choices: ['A constant in a file you commit to GitHub', 'The JavaScript of a web page so the browser can call Gemini directly', 'An environment variable such as GEMINI_API_KEY', 'A comment above the line that uses it'],
        answer: 2,
        explanation: 'Environment variables keep the secret outside the code. Google warns that keys in client-side code can be extracted and that keys must be kept out of source control.',
      },
      {
        id: 'ai-dev-gemini-02-q3',
        prompt: "You test a prompt in AI Studio on the free tier using a real customer's name and phone number. What is wrong?",
        choices: ["Nothing, because the Playground deletes everything that you type as soon as each single run has finished and the page is closed", "The phone number format is unsupported, so the Playground would simply fail to process the whole request and show an error to you", "The Playground blocks all personal names automatically, so the customer's details would never reach any model, reviewer or log at all", "Free-tier content may be used to improve products and read by reviewers, so personal data does not belong there"],
        answer: 3,
        explanation: "Google's terms say not to submit sensitive, confidential or personal information to unpaid services. Use made-up data while practising.",
      },
      {
        id: 'ai-dev-gemini-02-q4',
        audience: { max: 'beginner' },
        prompt: 'What is an environment variable?',
        choices: ["A named setting kept outside your code, so a program can read a secret without containing it", "A display setting that reduces glare on your screen when you work late at night in a very dark room, to protect your eyes", "A kind of AI model that Google trains specifically to read and write settings files for developers who are building small apps", "A comment placed in a file that explains what each line of the program is meant to do, written for the people reading it"],
        answer: 0,
        explanation: "An environment variable lives in the computer's environment. The code asks for it by name, so the secret is never written in the file you share.",
      },
      {
        id: 'ai-dev-gemini-02-q5',
        audience: { min: 'advanced' },
        prompt: 'Two of your apps share one Google Cloud project and one Gemini API key each. One app has a bug that loops and burns requests. What does the per-project quota mean for you?',
        choices: ["Only the buggy app is limited, because every key carries its own separate quota inside the project that it was created in", "Nothing happens, because quotas apply only to the free tier and never to paid projects of any size, whatever they are doing", "Both apps share one allowance because limits are per project; give each app its own project and set billing alerts", "Google automatically blocks the buggy key before it has used more than a tiny part of the allowance, so nothing is lost at all"],
        answer: 2,
        explanation: 'Google applies limits per project, not per key, so apps in one project compete for one allowance and one bill. Separate projects and billing alerts contain a runaway app.',
      },
    ],
    task: {
      title: 'Your first Playground session and key',
      minutes: 20,
      steps: [
        'In AI Studio, paste the tutor system instructions from this lesson, ask three questions of your own, and note how the answers follow the five-line rule.',
        'Change one thing in the system instructions (for example, answer in Filipino and English) and run the same question again. Write down what changed.',
        'Open the API keys page and confirm you have a key. Do not copy it into a note, chat or screenshot.',
        "Add `GEMINI_API_KEY` to your shell profile or use `export` for one session, then run the hello-gemini script from this lesson. If a model name is rejected, open Google's models page and use a current one.",
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "If a terminal feels strange, ask Gemini: 'Give me the exact commands, one at a time, to check that Node.js is installed and to run a file called hello-gemini.mjs.' Run each command and paste any error back to ask what it means.",
          "Write the difference between a key and an environment variable in one sentence of your own.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Create a separate project and a key restricted to the Gemini API for this practice app, set a billing alert, and write down how you would rotate the key without downtime (new key deployed, traffic switched, old key disabled).",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: 'ai-dev-gemini-03',
    day: 3,
    title: 'Prompting Gemini for code',
    summary: "Turn Google's own prompting advice into a coding prompt with context, examples, structure and a question at the end.",
    minutes: 25,
    skills: ['gemini-prompting'],
    intro: {
      objectives: [
        'Write a coding prompt with context, a task, examples and constraints',
        'Use tags or headings to keep a long prompt readable for Gemini',
        'Place big context first and the question last, and explain why',
      ],
      why: 'The same Gemini gives a vague answer to a vague request and a usable function to a precise one. A repeatable prompt shape is the cheapest skill in this course and the one you will use every day.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Gemini does what your words say, using only the context you give it. It cannot see your screen, your folder or your project unless you paste, upload or connect them. Google's prompt guide for developers reduces to a few habits, and they matter more for code than for chat, because code must fit your exact situation: your language, your versions, your function names, your tests. In this lesson you will use one small running example, **Barkada Split**, a web page that splits a restaurant bill among friends.",
      },
      { type: 'heading', text: 'Five habits from the Gemini prompt guide' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Be precise and direct.** State the goal clearly and briefly; extra pleading or persuasion adds nothing. Define any ambiguous term.',
          '**Add context instead of assuming.** Give the language, versions, the code the new code must fit and the exact error. The guide says to include the information the model needs rather than assuming it has it.',
          '**Show examples.** Google recommends including examples (few-shot prompting) and keeping their format identical, because the examples teach the model the shape of the answer. Two or three are usually enough; too many can make it copy them.',
          '**Use one consistent structure.** Separate parts with XML-style tags such as `<context>` and `<task>` or with Markdown headings. Choose one style per prompt.',
          '**Put big context first and the question last.** When you paste a lot of material, place your instruction at the very end, and bridge with a phrase like "Based on the information above".',
        ],
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Google's prompt design guide says to be precise and direct, use consistent structure with XML-style tags or Markdown headings, define ambiguous terms, state the output length you want because Gemini 3 models answer efficiently by default, put critical instructions and the persona in the system instruction or at the start of the prompt, supply long context first and the question at the end, and anchor with a phrase such as 'Based on the information above'. It recommends always including few-shot examples and keeping their format consistent. Gemini 2.5 and 3 models think internally, so you need not ask them to write out their reasoning. The guide also says Gemini 4 and Gemini 3.6+ models ignore custom temperature, top_p and top_k values and warn about them, so leave those settings alone.",
        checked: CHECKED,
        sources: [DOCS.prompting],
      },
      { type: 'heading', text: 'Weak and strong, side by side' },
      {
        type: 'prompt',
        label: 'Weak',
        text: 'Write a bill splitter.',
      },
      {
        type: 'prompt',
        label: 'Strong (the five habits in one prompt)',
        text: "<context>\nApp: Barkada Split, a web page that splits a restaurant bill among friends in the Philippines.\nStack: plain JavaScript in one file, no libraries, runs in the browser. Amounts are in pesos.\n</context>\n<task>\nWrite a function splitBill(total, people, tipPercent) that returns what each person pays, rounded to 2 decimal places.\n</task>\n<examples>\nsplitBill(1200, 4, 10) -> 330\nsplitBill(500, 1, 0) -> 500\nsplitBill(999, 3, 0) -> 333\n</examples>\n<constraints>\nKeep the function name. Throw an Error if people is less than 1. Use no libraries.\n</constraints>\nBased on the information above, write the function and one sentence explaining your rounding choice.",
      },
      {
        type: 'paragraph',
        text: "The weak prompt leaves every decision to the model: which language, whether tips exist, whether to round. The strong one removes each guess that would break your page, and the examples double as a quick test: you can run all three and see if the function agrees. A reply might look like the following (an illustration of the shape, not a recording; the code itself is correct and was run).",
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Example reply code (illustrative reply, tested code)',
        code: "function splitBill(total, people, tipPercent) {\n  if (people < 1) throw new Error('people must be at least 1');\n  const withTip = total + (total * tipPercent) / 100;\n  return Math.round((withTip / people) * 100) / 100;\n}\n\nconsole.log(splitBill(1200, 4, 10)); // 330\nconsole.log(splitBill(500, 1, 0));   // 500\nconsole.log(splitBill(999, 3, 0));   // 333",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Think of the prompt as an order at a tailor. 'A shirt' gets you something; 'a short-sleeve cotton shirt in my size, for a wedding, in blue' gets you what you meant. The strong prompt names four things: the **context** (what exists and who it is for), the **task** (what to make), **examples** (what a right answer looks like) and **constraints** (what it must not do). The tags like `<context>` are just labels that keep the parts apart. Reading the code: the `if` line refuses a bill split among zero people; the next line adds the tip, which is the total times the tip percent divided by 100; the last line divides among the people and rounds to two decimals. Here is a plain version for your first try.",
      },
      {
        type: 'prompt',
        audience: { max: 'beginner' },
        label: 'A plain-language first prompt',
        text: "I want a simple web page called Barkada Split. It asks for the bill total in pesos, how many friends are splitting it, and a tip percent, and then shows how much each person pays. Keep it one file with nothing to install. Example: 1200 pesos, 4 friends, 10 percent tip should show 330 each. Before you write it, tell me what you are assuming. After you write it, explain each part in plain words.",
      },
      {
        type: 'paragraph',
        text: "Two more habits save time. First, put rules that apply to every message (role, tone, language, what to avoid) in the **system instructions** box of AI Studio instead of retyping them. Second, break a big job into steps: ask for a plan first, then one piece of code at a time, feeding each answer into the next prompt. Small prompts are easier to check than one giant one.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "At engineering level a prompt is a spec plus context, and both can be tested. Write acceptance criteria and examples that double as test cases, keep the prompt and its expected outputs in the repository, and rerun them when you change the model or its settings, since model names change and answers drift. Treat a prompt template like code: review it, version it, and record the failures it led to. Because Gemini 4 and recent 3.x models ignore custom sampling settings, do not rely on temperature for determinism; rely on structured output, constrained examples and validation of the result. Put durable rules in system instructions or a context file, not in the user message that you retype.",
      },
      {
        type: 'prompt',
        audience: { min: 'advanced' },
        label: 'A spec-style prompt with acceptance criteria',
        text: "<context>\nTypeScript 5, strict mode, ESM, Vitest. File: src/split-bill.ts. No new dependencies.\nMoney is passed in as integer centavos and returned as integer centavos.\n</context>\n<task>\nImplement splitBill(totalCentavos: number, people: number, tipPercent: number): number[] returning each person's share in centavos. The shares must sum exactly to the total with tip, and no two shares may differ by more than 1 centavo.\n</task>\n<acceptance>\n1. splitBill(120000, 4, 10) returns [33000, 33000, 33000, 33000].\n2. splitBill(99900, 3, 0) returns [33300, 33300, 33300].\n3. splitBill(1000, 3, 0) returns shares summing to 1000.\n4. people < 1 throws a RangeError. The input is never mutated.\n</acceptance>\nWrite the failing tests first and show them. Then implement. Based on the information above, list any criterion you could not satisfy.",
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-03-fill-1',
          kind: 'fill-blank',
          title: 'Complete the structured prompt',
          prompt: 'Fill in the five blanks. The first two are the answers the examples must show, then one limit, one thing to avoid, and the phrase that points back at the context.',
          concept: 'structured coding prompts',
          language: 'text',
          code: "<context>\nBarkada Split: one JavaScript file, no libraries, amounts in pesos.\n</context>\n<task>\nWrite splitBill(total, people, tipPercent) that returns each person's share.\n</task>\n<examples>\nsplitBill(1200, 4, 10) -> ___\nsplitBill(500, 1, 0) -> ___\n</examples>\n<constraints>\nThrow an Error if people is less than ___. Do not use any ___.\n</constraints>\nBased on the information ___, write the function.",
          blanks: [
            { answers: ['330'], feedback: '1200 plus a 10 percent tip is 1320, shared by 4 people.' },
            { answers: ['500'], feedback: 'One person, no tip: they pay the whole bill.' },
            { answers: ['1'], feedback: 'A bill needs at least one person to split it.' },
            { answers: ['libraries'], feedback: 'The context said no libraries; the constraint repeats it for safety.' },
            { answers: ['above'], feedback: 'Google suggests an anchor phrase after a big block of context, pointing back at it.' },
          ],
          bank: ['330', '500', '1', 'libraries', 'above', '0', 'below', '1320'],
          hints: [
            'Work the first example: add the tip to the total, then divide by the number of people.',
            'The constraint about people protects against dividing among nobody.',
            'The last phrase points back at the context that came before the question.',
          ],
          explanation: 'The examples show exact results the function must produce, the constraints state limits, and the anchor phrase "Based on the information above" connects the question at the end to the context before it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-03-match-1',
          kind: 'match',
          title: 'Symptom to prompt fix',
          prompt: 'Each pair shows what went wrong with an answer and the prompting habit that fixes it. Match them.',
          concept: 'fixing weak prompts',
          labels: { terms: 'What went wrong', meanings: 'The fix' },
          pairs: [
            { term: 'You pasted a long file and Gemini answered a different question from the one you asked.', definition: 'Put the question at the very end, after the context, and anchor it with a phrase like "Based on the information above".' },
            { term: 'Every reply comes back in a different format, so your script cannot read it.', definition: 'Add two or three examples that all use exactly the same format.' },
            { term: "Gemini wrote code for a newer library version than the one in your project.", definition: 'Give the language and version and paste the code the new code must fit.' },
            { term: 'You asked for a quick answer and got a long essay.', definition: 'State the length and format you want, since the default is not tuned to your taste.' },
          ],
          hints: [
            'Each fix is one of the five habits: precise, context, examples, structure, order.',
            'Formatting problems are fixed by showing the format; scope problems by giving context.',
            'Where the question sits in the prompt matters for pasted material.',
          ],
          explanation: 'Order, examples, context and an explicit length each cure a specific failure. Matching the symptom to the habit is how you debug a prompt instead of just rewording it.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'Give Gemini what it cannot see: language, versions, the code to fit and the exact error.',
          'Examples teach format and double as quick tests; keep their format identical.',
          'Separate the parts with tags or headings, and put long context first and the question last.',
          'Leave temperature, top_p and top_k alone on current models, and put standing rules in system instructions.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-03-q1',
        prompt: "You paste a 2,000-line file into a prompt. According to Google's guide, where should your question go?",
        choices: ["Before the file, so Gemini knows what to look for while it reads the rest", "In the middle of the file, so the file sits on both sides of the question", "At the very end, after the context, anchored with a phrase such as 'Based on the information above'", "Anywhere, because the position of the question never changes the answer"],
        answer: 2,
        explanation: 'For large context Google says to supply it all first and put the specific instruction or question at the end, bridging with an anchor phrase.',
      },
      {
        id: 'ai-dev-gemini-03-q2',
        prompt: 'Why include examples such as `splitBill(1200, 4, 10) -> 330` in a code prompt?',
        choices: ["They make the prompt longer, so that Gemini treats the request as more important and works harder on it than on a short one", "They show the exact shape of a right answer and double as a quick test you can run", "They replace the need to state the language and version, because the model can always guess both of them from the numbers alone", "They are required by AI Studio before it will run any prompt that mentions a function name or a number in the request text"],
        answer: 1,
        explanation: 'Examples teach format and behaviour, and you can run them against the generated function to check it.',
      },
      {
        id: 'ai-dev-gemini-03-q3',
        prompt: 'You want Gemini 4 to be more predictable, so you set temperature to 0 in your request. What does the prompt guide say?',
        choices: ["It works as expected, so lower values always make the answers more deterministic", "It is required for every Gemini model before it will answer a question with code", "Gemini 4 ignores custom values and warns about them; leave them out and rely on clear prompts and checks"],
        answer: 2,
        explanation: 'The guide says Gemini 4 and Gemini 3.6+ models ignore custom values for these settings and return deprecation warnings, so remove them.',
      },
      {
        id: 'ai-dev-gemini-03-q4',
        audience: { max: 'beginner' },
        prompt: 'Which request is the best first prompt for a newcomer?',
        choices: ["Make a Barkada Split page with total, friends and tip fields; 1200 pesos, 4 friends, 10 percent tip shows 330 each; one file.", "Write the best bill splitter ever made, as quickly as you can, and please please do your very best work on every single detail of it.", "Make me a fast, modern, professional app that works perfectly on every phone, in every browser and in every country in the world, today.", "I need something for splitting money with friends, you know the kind of thing, so just do whatever seems right and surprise me later."],
        answer: 0,
        explanation: 'It names the goal, the fields, one example with the right answer and a limit. The others leave the model guessing or add pleading that changes nothing.',
      },
      {
        id: 'ai-dev-gemini-03-q5',
        audience: { min: 'advanced' },
        prompt: 'Your team keeps a Gemini prompt that generates a money-splitting function. A model update changes its output style. What practice catches the regression?',
        choices: ["Raise the temperature setting so that the outputs vary less from one run to the next run on the new model, and keep it high", "Trust the new model, because every newer model is automatically better at following prompts that were written for older versions", "Add more polite words to the prompt, so that the model tries harder to keep the previous style of output from the old version", "Keep the prompt and its acceptance examples in the repository and rerun them as tests when the model changes"],
        answer: 3,
        explanation: 'Prompts behave like code: versioned, with examples that act as tests. Sampling settings are ignored on current models and a newer model can still break an expected format.',
      },
    ],
    task: {
      title: 'Write and test your strong prompt',
      minutes: 20,
      steps: [
        'In AI Studio, send the weak prompt first and note what Gemini assumed. Then send the strong Barkada Split prompt and compare.',
        'Copy the generated function into a file, run the three examples with Node and confirm each result. If one differs, send back the exact line that differs and ask for a fix.',
        'Pick a small function from your own project or idea, write a prompt with context, task, examples and constraints, and save it in a prompts file.',
        'Move one rule you keep repeating into the System instructions box and notice what you no longer have to type.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Use the plain-language prompt, then ask Gemini: 'Explain each part of the code you wrote as if I have never coded.' Write one sentence of your own about what the rounding line does.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Run the spec-style prompt, write the failing tests first, and check that the shares sum exactly to the total. Add one adversarial case (three people, 1,000 centavos) and record how the model handled the leftover centavo.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: 'ai-dev-gemini-04',
    day: 4,
    title: 'Working with long files and screenshots',
    summary: 'Feed Gemini long code and images on purpose: what a long context window really gives you, how to send a screenshot, and what to hide first.',
    minutes: 25,
    skills: ['multimodal-input'],
    intro: {
      objectives: [
        'Explain what a context window is and where a long one still slips',
        'Send a screenshot to Gemini with a prompt that turns it into code',
        'Crop out private information before you share an image',
      ],
      why: 'Two of Gemini\'s best-known strengths are reading very long inputs and understanding images. Used carelessly they also leak secrets and produce confident mistakes, so you need both the technique and the habit of checking.',
    },
    body: [
      {
        type: 'paragraph',
        text: "A model reads your request inside a **context window**: the amount of text, in tokens, that it can hold at once. A **token** is a small piece of text, roughly four characters, so a word is often one or two tokens. Google's docs say many Gemini models have windows of one million tokens or more, which is room for a large part of a project or a long set of logs in one request. That is genuinely useful, but there is a difference between room and attention, and the second half of this lesson turns to the other input Gemini is known for: images.",
      },
      { type: 'heading', text: 'What a long window is good for, and where it slips' },
      {
        type: 'list',
        items: [
          '**Good for:** questions across a whole codebase or a long document without building a search system first, reading long logs, summarising meetings, and giving many examples at once.',
          '**Where it slips:** Google notes that finding one fact in a huge prompt works very well, but accuracy drops when there are several things to find. Longer inputs also take longer to start answering, and they cost more because you pay for every token you send.',
          '**Habits that help:** send only what is relevant, put the question at the end, and ask Gemini to quote the file name and the line behind each claim, so you can check it in seconds.',
          '**Caching:** if you ask many questions about the same large input, Google offers context caching so you do not pay full price to resend it each time.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Imagine handing a friend a very thick folder and asking one question. They can read it all, but they may skim; if you also tell them which pages to look at and ask them to point to the exact line they used, you can quickly check their answer. That is what 'quote the file and line' does. A long window is a big desk, not a perfect memory. And a **token** is just how the AI counts text: a long file is many thousands of tokens, which is why limits and costs are measured in them instead of in pages.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Google's long context page says many Gemini models have windows of 1 million tokens or more. For Gemini 4 the 1M window is shared across input, thinking and output, with up to 1M output tokens through long decode; earlier Gemini 3 and 2.5 models have 1M input and 64K output. It says to put the query at the end of the prompt after all the context, to cache reusable content, and to avoid sending tokens you do not need. Its limitations: single-fact retrieval is strong but accuracy drops when a prompt holds multiple facts to find, higher accuracy can mean more requests and cost, and longer inputs generally increase latency. The Gemini app's window depends on your plan (see lesson 1).",
        checked: CHECKED,
        sources: [DOCS.longContext, DOCS.models],
      },
      { type: 'heading', text: 'Screenshots to code' },
      {
        type: 'paragraph',
        text: "Gemini accepts images as well as text, which makes a screenshot a legitimate way to say 'build this' or 'what does this error mean'. In AI Studio and the app you upload the picture next to your prompt. Through the API you send it inline as part of the request, or upload it once to the Files API when it is large or you will reuse it. Google lists PNG, JPEG, WEBP, HEIC and HEIF as supported formats. Quality matters: send a clear, sharp, correctly rotated image, and name each image in your prompt when you send more than one ('Image 1 is the current page; image 2 is the design I want').",
      },
      {
        type: 'prompt',
        label: 'A screenshot-to-code prompt (attach the image)',
        text: "<context>\nThe attached image is a phone screenshot of a bill-splitting screen from a design tool. I am building it as one HTML file with CSS, no libraries.\n</context>\n<task>\nFirst, list what you can see: every label, input and button, and the colours as hex values you estimate. Do not write code yet. After I confirm, write the page.\n</task>\n<constraints>\nMobile width first. Use semantic HTML. Say which details you are unsure about instead of guessing silently.\n</constraints>",
      },
      {
        type: 'paragraph',
        text: "Asking for a description before the code is the most useful habit here. A model can misread small text, misjudge a colour or invent an element, and a description lets you correct the misreading before it is baked into code. After the page is generated, open it in a browser next to the original and compare, then send back one specific difference at a time.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'A screenshot-to-code loop',
        source: `flowchart TD
  A[Screenshot] --> B[Crop or blur private details]
  B --> C[Upload with a prompt that asks for a description first]
  C --> D[Correct anything it misread]
  D --> E[Gemini writes the page]
  E --> F[Open the page beside the screenshot]
  F --> G{Same?}
  G -->|no| H[Send one specific difference]
  H --> E
  G -->|yes| I[Review the code and commit]`,
      },
      {
        type: 'warning',
        text: "A screenshot carries more than you meant to share: open tabs, a terminal with a key or a token in it, a customer's name, a file path with your username. Crop or blur before you upload. Remember that on Google's free tiers and in the Gemini app with Keep Activity on, what you upload can be read by human reviewers.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Google's image understanding page lists PNG, JPEG, WEBP, HEIC and HEIF; inline image data counts toward a 20MB total request limit, and the Files API is recommended for large files or reuse; it states a maximum of 3,600 image files per request. Its tips: check that images are correctly rotated, use clear non-blurry images, and with a single image plus text place the text prompt before the image in the API's input array. Images up to 384 pixels on both sides cost 258 tokens; larger images are tiled into 768 by 768 pixel pieces at 258 tokens each.",
        checked: CHECKED,
        sources: [DOCS.imageUnderstanding],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "For large inputs, decide between putting everything in context and retrieving only what matters. Whole-repository prompts are fast to build and good for exploratory questions, but they are costly, slower and weaker when many facts must be found, so use retrieval, chunking or a map-reduce pass (summarise each module, then reason over the summaries) for precise or repeated work, and use caching when the same corpus is queried many times. Demand verifiable output: file and line citations, and a pass that rechecks each cited line against the source. For images, remember token cost scales with size, tile large screenshots deliberately, upload once through the Files API when reusing, and treat any text read from an image as untrusted input that could carry instructions (prompt injection).",
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-04-scenario-1',
          kind: 'scenario',
          title: 'Forty files and one bug',
          prompt: 'Pick the best way to ask.',
          concept: 'long-context prompting',
          situation: "Your checkout page double-charges some customers. The code is spread over about forty files, and you do not know which one is guilty. You have a 1M-token Gemini model available.",
          options: [
            { text: "Include the relevant folders (not .env or node_modules), put the question last after 'Based on the information above', and ask for the file name and the line quoted for each claim.", consequence: 'Best. The model has the context, the question sits at the end where Google says it works best, and the quotes let you verify every claim quickly.', quality: 'best' },
            { text: 'Paste only the one file you suspect, to save tokens.', consequence: 'Cheap and fast, but if your guess is wrong, the answer is confident about the wrong place. It is a fine second step, not a good first one.', quality: 'acceptable' },
            { text: 'Paste the whole repository including the .env file, with the question at the top.', consequence: 'This sends secrets to a service, wastes tokens on dependencies, and puts the question where long prompts handle it worst.', quality: 'poor' },
          ],
          hints: [
            'Think about what to include and what must never be included.',
            'Where does the guide say the question belongs in a long prompt?',
            'Which option lets you check the model rather than trust it?',
          ],
          explanation: 'Relevant files, question last, and quoted evidence use the long window the way it works best, keep secrets out and make the answer checkable.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-04-arrange-1',
          kind: 'arrange',
          title: 'Order the screenshot loop',
          prompt: 'Put the steps of turning a screenshot into a page in a safe, sensible order.',
          concept: 'screenshot-to-code workflow',
          language: 'text',
          solution: [
            'Crop or blur anything private in the screenshot',
            'Upload it with a prompt that names the stack and asks for a description first',
            'Read the description and correct anything it misread',
            'Let Gemini write the page',
            'Open the page beside the screenshot and list the differences',
            'Send the differences back one at a time',
          ],
          reasons: [
            'Private details must be removed before the image leaves your machine.',
            'Naming the stack and asking for a description first catches misreading early.',
            'You correct the misreading before it becomes code.',
            'Only then is the code written from a description you agreed with.',
            'Comparing side by side shows what is really different.',
            'One difference per message keeps each fix small and checkable.',
          ],
          hints: [
            'What must happen before anything is uploaded?',
            'The description comes before the code, and your correction comes between them.',
            'Comparing and fixing form the last loop.',
          ],
          explanation: 'Privacy first, description before code, your correction in the middle, and small fixes at the end. The same order protects you from leaks and from silent misreadings.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'A long window is room, not perfect attention: send relevant material, put the question last and ask for quoted evidence.',
          'Gemini reads images: send clear, named, correctly rotated pictures, and ask for a description before code.',
          'Compare the generated page with the screenshot and send one difference at a time.',
          'Crop secrets and private details out of screenshots before you upload them.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-04-q1',
        prompt: 'According to Google, what is a limit of very long prompts?',
        choices: ["Gemini cannot read more than about ten pages of text in one request, however large the window", "Finding several facts is less accurate than finding one; long inputs are also slower and cost more", "The model forgets the last paragraph of the prompt first, so important text must go at the top", "Long prompts are refused unless they have first been stored in a cache by an administrator"],
        answer: 1,
        explanation: 'Google reports strong single-fact retrieval but lower accuracy for several facts, longer waiting time and cost that grows with the tokens you send.',
      },
      {
        id: 'ai-dev-gemini-04-q2',
        prompt: 'Why ask Gemini to describe a screenshot before it writes code?',
        choices: ["It makes the answer longer, and a longer answer is always more reliable", "It lets you correct misread text, colours or invented parts before they become code", "Gemini cannot write any code until it has first described the image it was given"],
        answer: 1,
        explanation: 'A description exposes misreadings cheaply. Fixing a wrong label in words is easier than finding it later inside generated CSS.',
      },
      {
        id: 'ai-dev-gemini-04-q3',
        prompt: 'Which item should you remove from a screenshot before uploading it to a free Gemini tier?',
        choices: ["A terminal line that shows an API key or a token", "The colour of the buttons on the page you are copying", "The heading text at the top of the page you want built", "The width and height of the browser window"],
        answer: 0,
        explanation: 'Keys, tokens and customer data in an image are sent to the service like any other text, and human reviewers may read content on unpaid tiers.',
      },
      {
        id: 'ai-dev-gemini-04-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a token, in plain words?',
        choices: ["A coin that you spend to open the Gemini website for a few minutes at a time, topped up from your own Google account balance", "A password that signs you in to your Google account when you use a new phone or a new browser for the very first time", "A small piece of text, roughly four characters, which is how the AI counts what it reads", "A photo-sized image that the model draws on the screen before it writes any reply to the request that you have just sent"],
        answer: 2,
        explanation: 'Models count text in tokens, so limits and costs are measured in them. A long file is many thousands of tokens.',
      },
      {
        id: 'ai-dev-gemini-04-q5',
        audience: { min: 'advanced' },
        prompt: 'You must answer 200 different questions about the same 600,000-token log archive. Which approach fits best?',
        choices: ["Resend the whole archive with every single question and trust that the longest window will cope with all of it each time you ask", "Summarise it once into a single page and then throw the original logs away to save storage space on your own disk or laptop", "Paste only the first 10,000 tokens and assume that they are typical of everything that comes after them in the rest of the archive", "Cache the archive or index it, ask for cited lines, and recheck each citation against the source"],
        answer: 3,
        explanation: 'Repeated questions over the same input call for caching or retrieval, and cited lines give you a cheap way to verify answers. Resending everything is costly and a single summary loses detail.',
      },
    ],
    task: {
      title: 'Screenshot to page, with a privacy check',
      minutes: 20,
      steps: [
        'Take a screenshot of any simple app screen you like (a calculator, a form). Before uploading, check it for names, keys and open tabs and crop them out.',
        'In AI Studio, upload it with the screenshot-to-code prompt from this lesson. Read the description and correct at least one thing.',
        'Let Gemini write the page, open it in a browser beside the screenshot, and list three differences. Send them back one at a time.',
        'Try a long-file question: paste a README or a long code file, put your question at the end with the anchor phrase, and ask for quoted lines. Check two of the quotes against the file.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask Gemini to explain the HTML and CSS it wrote in plain words, one block at a time, and write down what a 'div' and a 'class' are in your own words.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Run the same repository question twice: once with the whole repository and once with a retrieved subset of files. Compare accuracy, citations, latency and token use, and write down when you would choose each.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: 'ai-dev-gemini-05',
    day: 5,
    title: 'Building a small app with Gemini',
    summary: 'Describe an app in AI Studio Build mode, steer it in small steps, read what it wrote, and learn how Build handles secrets and sharing.',
    minutes: 30,
    skills: ['gemini-app-building'],
    intro: {
      objectives: [
        'Write a short app brief and build a first version in AI Studio Build mode',
        'Improve the app in small, reviewable steps and read the generated code',
        'Explain how Build keeps your Gemini key off the browser and what sharing costs you',
      ],
      why: 'Build mode can turn a paragraph into a running app in minutes. The skill that matters is steering it: a clear brief, small changes you check, and knowing where the keys and the bills end up.',
    },
    body: [
      {
        type: 'paragraph',
        text: "In AI Studio's **Build mode** you describe what you want, and it creates the files, runs them and shows a live preview beside the chat. Google calls this vibe coding: you direct by describing, the tool writes, and you refine by talking and looking. Behind it is the Antigravity Agent, Google's coding agent, which keeps the context of your whole project and edits several files so a change in one place reaches the others. By default a web app is a React front end (the part people see and tap) with a Node.js server (a program on a computer you do not see, where secrets can live safely). You can also choose to build a native Android app with Kotlin and Jetpack Compose.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "A few words made plain. The **front end** is what appears on the screen: buttons, boxes, numbers. The **server side** is a hidden helper that runs elsewhere; it is the right place for secrets like keys, because a visitor cannot open it. A **preview** is the live version of your app shown beside the chat while you work, so you can try it before anyone else sees it. **React** is a popular toolkit for building screens; you do not need to learn it to use Build, but you will read a little of it to check what was made. And 'vibe coding' simply means describing what you want in everyday words and improving it by conversation.",
      },
      { type: 'heading', text: 'Write a brief before you press Build' },
      {
        type: 'paragraph',
        text: "A paragraph of planning saves ten rounds of repair. Say who the app is for, the screens, the data it needs, the rules, and what you do not want yet. Leaving out logins, databases and payments in version one keeps the first result small enough to check.",
      },
      {
        type: 'prompt',
        label: 'A brief for Build mode',
        text: "Build a mobile-friendly web app called Barkada Split for friends sharing a restaurant bill in the Philippines.\nScreen: one page with three fields (bill total in pesos, number of friends, tip percent) and a clear result that shows what each person pays and the total with tip.\nRules: example 1200 pesos, 4 friends, 10 percent tip shows 330 each. Show a friendly message for a total of zero, fewer than 1 friend, or a tip outside 0 to 100.\nStyle: large tap targets, light and clean, peso sign on every amount.\nNot yet: no login, no database, no payments.",
      },
      { type: 'heading', text: 'Steer in small steps, then read the code' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Try the preview** with your own example numbers, including a strange one (zero friends).',
          '**Ask for one change per message**: "round each share to centavos and show the leftover if it does not divide evenly". Small requests are easy to check and to undo.',
          '**Point instead of describing.** Annotation mode lets you highlight a part of the screen and say what to change, such as "make this number larger".',
          '**Open the Code tab and read.** You do not need to understand every line, but find the function that does the maths and run your example against it.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The kind of maths function you might find in the Code tab (tested)',
        code: "function splitBill(total, people, tipPercent) {\n  if (!(total > 0)) return { error: 'Enter a bill amount above zero' };\n  if (!Number.isInteger(people) || people < 1) return { error: 'People must be a whole number, 1 or more' };\n  if (tipPercent < 0 || tipPercent > 100) return { error: 'Tip must be between 0 and 100' };\n  const withTip = total * (1 + tipPercent / 100);\n  const share = Math.round((withTip / people) * 100) / 100;\n  return { share, withTip: Math.round(withTip * 100) / 100 };\n}\n\nconsole.log(splitBill(1200, 4, 10)); // { share: 330, withTip: 1320 }\nconsole.log(splitBill(500, 2.5, 0)); // { error: 'People must be a whole number, 1 or more' }",
      },
      {
        type: 'paragraph',
        text: "This is an example of the shape of generated code, not a recording of what Build will write for you. Read it as a reviewer: three checks refuse bad input before any maths runs, then the tip is added, the total is divided among the people and the result is rounded to two decimals. If a line surprises you, paste it back and ask: 'What does this line do, and what happens if it is removed?'",
      },
      { type: 'heading', text: 'Keys, sharing and where it runs' },
      {
        type: 'paragraph',
        text: "If your app calls Gemini itself (for example, to explain the split in friendly language), Build sets up your `GEMINI_API_KEY` as a secret on the server side, so it is never included in the code the browser receives. Keys for other services go in the **Secrets** panel in Settings, not into the chat. Your app is private by default. When you share it, other people can use it, but **their Gemini calls count toward your usage limits and, on paid models, may cost you money**. When it is ready you can sync the project to GitHub, download it as a ZIP, or publish it to Cloud Run; a downloaded app needs `GEMINI_API_KEY` set in whatever hosting you choose.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Google's Build mode docs say you can start from a prompt, the I'm Feeling Lucky button, a gallery app or a GitHub import; web apps are React plus a Node.js server by default and Android apps use Kotlin and Jetpack Compose; the Antigravity Agent manages multiple files; annotation mode lets you highlight part of the UI and describe a change; the Code tab shows and edits the generated files. For a new app that uses the Gemini API, Build configures GEMINI_API_KEY as a server-side secret that is never in client-side code (viewable in the Secrets panel), and for Android it uses Firebase AI Logic and App Check instead of a raw key. Apps are private by default; when you share one, API calls count toward your usage limits and paid models may cost money. You can sync to GitHub, download a ZIP, or publish to Cloud Run (pricing may apply). The full-stack page adds Firebase Firestore and Authentication and Google Workspace integrations, which the agent can set up when you ask.",
        checked: CHECKED,
        sources: [DOCS.buildMode, DOCS.fullstack],
        plans: 'Free to start; Cloud Run publishing and paid models may incur charges',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: "Once the calculator works, grow it the way a real project grows: ask Build to 'add a database so a group can save a past bill' and it can set up Firebase Firestore, or 'add Sign in with Google' for authentication, and it writes the code for both. Each addition is a new place for mistakes, so repeat the routine: describe one feature, test it with edge cases, read the new code, and check that no secret or personal data ended up in the browser's code. This is where you move from a toy to an app with accounts and stored data.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Treat Build output as a first draft of a pull request. Sync it to GitHub, run your linter, type checker and tests in your own pipeline, pin dependency versions, and review every server route for authentication, input validation and rate limiting. The sharp edge is cost: a published app uses your key for all users' Gemini calls, so an unauthenticated route that calls the model is an open tap on your billing. Add per-user limits and quotas, put the project under billing alerts, and decide up front what happens at the limit. Keep an eye on data flow too: if the app logs prompts or stores user input, you now own a privacy obligation.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Checked 2026-11-14. Google's Build mode docs state that when you deploy to Cloud Run from AI Studio your API key is included in the server-side environment and the deployed app uses your key for all users' Gemini API calls, and that a ZIP download needs GEMINI_API_KEY set in your own hosting environment. They also note that sharing counts calls toward your limits.",
        checked: CHECKED,
        sources: [DOCS.buildMode],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-05-scenario-1',
          kind: 'scenario',
          title: 'The shared link',
          prompt: 'Pick the best next step.',
          concept: 'sharing an app that uses your key',
          situation: "You added an 'Explain this split in Taglish' button to Barkada Split; it calls Gemini using your key. A friend wants to post the app's link in a group chat with about 800 people.",
          options: [
            { text: 'Wait until the app has a limit per visitor (and billing alerts are set), test with a few friends first, then share more widely.', consequence: "Best. Visitors' Gemini calls count toward your limits and may cost you, so you add a guard before the audience grows.", quality: 'best' },
            { text: 'Share the link now and watch the usage page for a day.', consequence: 'You may notice in time, but a popular link can use up your allowance or run up charges before you look.', quality: 'acceptable' },
            { text: "Paste your API key into the page so it works for everyone without the server.", consequence: "This exposes the key to every visitor, because client-side keys can be extracted. It is the exact mistake Build's server-side setup prevents.", quality: 'poor' },
          ],
          hints: [
            "Whose usage limits do other people's calls count toward?",
            'Which option adds a protection before the audience grows?',
            'One option undoes the way Build keeps your key private.',
          ],
          explanation: 'Shared apps spend your Gemini allowance. A per-visitor limit and billing alerts turn an open tap into a controlled one, and the key must stay on the server.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-05-arrange-1',
          kind: 'arrange',
          title: 'Read the generated function in order',
          prompt: 'The lines of a small generated function got shuffled. Put them back so that it prints 330.',
          concept: 'reading generated code',
          language: 'javascript',
          solution: [
            'function splitBill(total, people, tipPercent) {',
            '  const withTip = total * (1 + tipPercent / 100);',
            '  const share = withTip / people;',
            '  return Math.round(share * 100) / 100;',
            '}',
            'console.log(splitBill(1200, 4, 10));',
          ],
          tests: { kind: 'output', expected: ['330'] },
          reasons: [
            'The function is declared before it is used.',
            'The total with tip must exist before it can be divided.',
            'The share needs withTip, so it comes after it.',
            'The return uses share, so it comes after share is defined.',
            'The closing brace ends the function body.',
            'The call comes after the function is defined, and prints the result.',
          ],
          hints: [
            'A function must be defined before the line that calls it.',
            'Each line uses a value made on the line above: tip, share, then the rounded result.',
            'The closing brace comes right after the return.',
          ],
          explanation: 'Reading generated code is reading in dependency order: each value is built from the one before it, so the tip comes first, then the share, then the rounded result.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'A one-paragraph brief with screens, rules and a not-yet list gives Build something small enough to check.',
          'Ask for one change per message, point with annotation mode, and read the Code tab.',
          'Build keeps your Gemini key as a server-side secret; third-party keys go in the Secrets panel, never in chat.',
          "A shared app spends your allowance: add limits and alerts before the audience grows.",
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-05-q1',
        prompt: 'What does AI Studio Build create by default for a web app?',
        choices: ['A single HTML page with no server, because servers are not supported', 'A Python script that you run only on your own laptop', 'A React front end plus a Node.js server, with a live preview', 'A mobile app file that only installs on Android phones'],
        answer: 2,
        explanation: 'The docs say the default web app is a React client with a Node.js server runtime; Android apps with Kotlin and Compose are a separate platform choice.',
      },
      {
        id: 'ai-dev-gemini-05-q2',
        prompt: 'Your Build app calls Gemini. Where does the Gemini API key live?',
        choices: ['In a server-side secret, never in the code sent to the browser', 'In a constant at the top of the front-end JavaScript so every visitor can use it', 'In the chat, so the agent can read it each time you ask for a change', 'In a comment next to the function that makes the call'],
        answer: 0,
        explanation: 'Build configures GEMINI_API_KEY on the server side. Browser code can be read by visitors, and chat is not a place for secrets.',
      },
      {
        id: 'ai-dev-gemini-05-q3',
        prompt: 'What is the best way to improve a generated app?',
        choices: ['Rewrite the whole brief each time and rebuild from nothing', 'Ask for ten changes in one message so the agent does everything at once', 'Accept whatever appears, because the preview already proves it works', 'Ask for one change at a time, try it in the preview, and read the code that changed'],
        answer: 3,
        explanation: 'Small steps are easy to test and undo, and reading the changed code catches mistakes the preview does not show, such as missing input checks.',
      },
      {
        id: 'ai-dev-gemini-05-q4',
        audience: { max: 'beginner' },
        prompt: 'Why do secrets such as keys belong on the server side of an app?',
        choices: ["A visitor can read what runs in their browser but cannot open the hidden server", "Servers are faster at reading text than screens are, so secrets are always read there first, for the sake of speed alone", "Screens cannot store numbers or words at all, so every secret has to live somewhere other than the screen in front of you", "Google requires every app to have a server before it will let anyone press a button on the page that you have built there"],
        answer: 0,
        explanation: "Anything sent to the browser can be inspected by the person using the page. The server is a hidden helper, so a secret kept there stays private.",
      },
      {
        id: 'ai-dev-gemini-05-q5',
        audience: { min: 'advanced' },
        prompt: 'You deploy a Build app to Cloud Run. It has an open /explain route that calls Gemini with your key, with no sign-in. What is the main risk?',
        choices: ["Nothing: the key is server-side, so nobody can use it indirectly through your app, even when there is no sign-in at all in front of it", "Anyone who finds the route can spend your quota through the app; it needs sign-in, per-user limits and alerts", "Google blocks the route once more than ten people have called it in a day, so the only risk is some downtime for the users of the app", "The Cloud Run publish fails until you move the key into the browser code where the route can reach it more easily from every page"],
        answer: 1,
        explanation: 'A server-side key stops theft of the key, not abuse of the route. The deployed app uses your key for every visitor, so an unauthenticated model call is an open tap on your bill.',
      },
    ],
    task: {
      title: 'Build Barkada Split in Build mode',
      minutes: 25,
      steps: [
        'Open AI Studio, choose Build, and paste the brief from this lesson. Try the preview with 1200 pesos, 4 friends and 10 percent tip, then with zero friends.',
        'Ask for one improvement (for example, show the leftover centavo when the bill does not divide evenly) and check it with an example you work out by hand.',
        "Open the Code tab, find the function that does the maths and run its logic yourself against two examples in Node or the browser console.",
        'Look in Settings at the Secrets panel and note what is stored there. Write down who would pay if you shared the link and the app called Gemini.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask Gemini in the Build chat: 'Explain the code in plain words, one part at a time, as if I have never coded.' Write one sentence on what the front end and the server side do in your app.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Sync the project to GitHub, add a lint step and one unit test for the maths function, and write a short review note listing every server route, whether it needs authentication, and the limit you would put on it.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    id: 'ai-dev-gemini-06',
    day: 6,
    title: 'Debugging and refactoring with Gemini',
    summary: 'Give Gemini evidence instead of guesses, make it prove a fix with a test, and catch its habit of suggesting outdated tools.',
    minutes: 25,
    skills: ['gemini-debugging'],
    intro: {
      objectives: [
        'Write a bug report that gives Gemini the code, the error, the expectation and the versions',
        'Ask for a failing test before a fix and prove the fix by running it',
        'Spot outdated or invented suggestions and ground Gemini in current docs',
      ],
      why: "Debugging is where assistants save the most time and mislead the most. A good bug report and a test you run yourself turn Gemini from a confident guesser into a useful partner.",
    },
    body: [
      {
        type: 'paragraph',
        text: "In a chat, Gemini cannot run your app. It sees only what you send, so debugging with it is a conversation about **evidence**. The more of the real situation you provide, the less it has to invent. A bug report that Gemini can use has five parts: what you were trying to do, the code involved, the exact error or wrong output, what you expected instead, and your environment (language and versions). Then you tell it what you want back: usually a short explanation of the cause and the smallest possible fix.",
      },
      { type: 'heading', text: 'A bug report Gemini can use' },
      {
        type: 'paragraph',
        text: "Here is a real kind of bug. Barkada Split should show 330 for 1200 pesos, 4 friends and a 10 percent tip, but it shows 1230. The report below follows the structure from lesson 3.",
      },
      {
        type: 'prompt',
        label: 'A bug report',
        text: "<context>\nBarkada Split, plain JavaScript in the browser. splitBill should return what each person pays.\n</context>\n<code>\nfunction splitBill(total, people, tipPercent) {\n  const tip = total * tipPercent / 100;\n  const share = total + tip / people;\n  return Math.round(share * 100) / 100;\n}\n</code>\n<problem>\nsplitBill(1200, 4, 10) returns 1230. I expected 330 (1200 plus a 120 tip is 1320, split four ways).\n</problem>\n<task>\nExplain the cause in two sentences. Then show the smallest fix as a changed line only. Do not rewrite anything else.\n</task>",
      },
      {
        type: 'paragraph',
        text: "The cause is operator precedence. Division happens before addition, so `tip / people` is computed first and then added to the whole total, which means one person pays the full bill plus a quarter of the tip. The fix is to add first and divide after: `(total + tip) / people`. A good reply names that cause in its own words; a poor one just says 'fixed' and hands you a new block of code.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Some words made plain. A **bug** is a mistake in a program that makes it do the wrong thing. An **error message** is the program's own description of what went wrong; copy it exactly, because the exact words are the best clue. A **test** is a small check that runs your code with an example and compares the answer with the one you expect. In the bug above, arithmetic works like school maths: multiplication and division happen before addition unless brackets say otherwise. So `total + tip / people` first divides the tip, then adds the total, and that is not what we meant. Brackets fix it: `(total + tip) / people`.",
      },
      { type: 'heading', text: 'Reproduce, fix, then prove it' },
      {
        type: 'list',
        items: [
          '**Ask for a failing test first.** If Gemini writes a test that fails for the right reason, you both agree on what the bug is before any fix exists.',
          '**Then ask for the fix.** Smallest change, the changed line only, and a sentence on why it works.',
          '**Run it yourself.** "It should work now" from a chat is a claim, not a result. Run the test and your own example.',
          '**Keep the session honest.** If an answer is wrong, paste the new error and the code as it is now, not as Gemini remembers it.',
        ],
      },
      { type: 'heading', text: 'The habit to watch: confident, outdated answers' },
      {
        type: 'paragraph',
        text: "Models learn from text collected up to a cutoff date, so they sometimes suggest tools that were current then and have since been replaced. Google says this directly in its coding-agent setup page: agents often suggest deprecated models, older SDKs and outdated patterns. For Gemini itself, the docs index tells coding agents to use the `google-genai` Python package and the `@google/genai` npm package and never the older `google-generativeai` or `@google/generative-ai`. So when Gemini hands you a package name, a model name or a function you have not seen, check it against the official page, and give the model the current page to read: paste the text of the docs page, or, in an agent that can fetch pages, point it at the markdown version of the docs, since every page there can be fetched as markdown by adding `.md` to its address.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Google's coding agent setup page says coding agents rely on training data that cuts off at a set date, so they often suggest deprecated models, older SDKs or outdated code patterns, and it recommends connecting the agent to official resources: Gemini agent skills, a Docs MCP server, machine-readable docs and the llms.txt index. The docs index says to use google-genai (Python) or @google/genai (npm) and never the deprecated google-generativeai or @google/generative-ai, that the Interactions API is the default, and that generateContent remains supported but is considered legacy. Every docs page is available as markdown by adding .md to its address. These recommendations may change with new SDK releases.",
        checked: CHECKED,
        sources: [DOCS.codingAgents, DOCS.getStarted],
      },
      { type: 'heading', text: 'Refactoring without breaking things' },
      {
        type: 'paragraph',
        text: "To **refactor** is to improve how code is organised without changing what it does. With an assistant it is safe only when you can tell whether the behaviour stayed the same, which means tests. Run the tests first, ask for one small refactor at a time and request a diff, run the tests again, and commit between steps so you can step back. Ask Gemini to list every behaviour it believes might have changed; reviewing that list often finds the one it missed.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Debug like an engineer, not like a customer. Ask for ranked hypotheses, each with a cheap way to falsify it (a log line, a breakpoint, a test), then run the cheapest one; this keeps the model from anchoring on its first guess. Insist on a regression test that fails before the fix and passes after, and add characterization tests around legacy code before any refactor so you pin down what it does today. Review diffs for behavioural change, not style: changed error handling, widened types, removed guards and swapped dependencies. Defend against stale suggestions with version pins, lockfile review and a lint rule or CI check that rejects deprecated packages, and let a planning mode produce a read-only plan before an agent edits a large module.",
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-06-fix-1',
          kind: 'fix-bug',
          title: 'Why does Barkada Split show 1230?',
          prompt: 'Tap the buggy line, then choose the smallest correct fix.',
          concept: 'finding a precedence bug',
          language: 'javascript',
          code: `function splitBill(total, people, tipPercent) {
  const tip = total * tipPercent / 100;
  const share = total + tip / people;
  return Math.round(share * 100) / 100;
}`,
          bugLine: 3,
          fixes: [
            { line: '  const share = (total + tip) / people;', correct: true, why: 'Add the tip to the total first, then divide among the people.' },
            { line: '  const share = total + tip * people;', correct: false, why: 'This multiplies the tip by the number of people, which makes the result even larger.' },
            { line: '  const share = total + (tip / people);', correct: false, why: 'The brackets only restate what already happened: the tip is divided and then added to the whole total.' },
            { line: '  const share = (total + tip) * people;', correct: false, why: 'This multiplies instead of dividing, so each friend pays more than the whole bill.' },
          ],
          tests: {
            kind: 'function',
            fn: 'splitBill',
            cases: [
              { args: [1200, 4, 10], expected: 330 },
              { args: [500, 1, 0], expected: 500 },
              { args: [999, 3, 0], expected: 333 },
              { args: [1000, 2, 10], expected: 550 },
            ],
          },
          hints: [
            'Try 999 split among 3 with no tip. What should each person pay?',
            'Division happens before addition, so look at the line that mixes both.',
            'The tip must be added to the total before dividing among the people.',
          ],
          explanation: 'Division binds tighter than addition, so `total + tip / people` divides only the tip. Brackets around `total + tip` make the sum happen first. A test with no tip (999 among 3) would have caught it at once.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-06-scenario-1',
          kind: 'scenario',
          title: 'The package that does not look right',
          prompt: 'Pick the best response.',
          concept: 'checking outdated suggestions',
          situation: "You ask Gemini to add a Gemini call to your Node project. It tells you to run `npm install @google/generative-ai` and writes code for that package. You are not sure it is current.",
          options: [
            { text: "Check Google's current getting-started page, see which package it names, and paste the current example into your prompt so Gemini rewrites the code against it.", consequence: 'Best. The docs name the current package (@google/genai) and say coding agents often suggest older SDKs, so you ground the model in the official example.', quality: 'best' },
            { text: 'Run the install and see whether it works.', consequence: 'It might install and run, which proves nothing about being current or supported. You may build on a package Google says not to use.', quality: 'poor' },
            { text: 'Ask Gemini whether it is sure, and accept its answer.', consequence: 'A model can repeat the same outdated belief confidently. Asking again is not a check; the official page is.', quality: 'acceptable' },
          ],
          hints: [
            'Where does the true list of current packages live?',
            "Google's own coding-agent page warns about exactly this habit.",
            'The best option gives the model the correct source to work from.',
          ],
          explanation: 'Name and version questions are answered by the official docs, not by the model. Giving Gemini the current example fixes the code and the habit.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'A usable bug report has the goal, the code, the exact error or output, the expectation and the versions.',
          'Ask for a failing test, then the smallest fix, then run it yourself.',
          'Models can suggest outdated tools; Google says so itself, so check names against the official docs and feed the model the current page.',
          'Refactor in small steps with tests before and after, and commit between them.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-06-q1',
        prompt: 'Which bug report gives Gemini the best chance of a correct fix?',
        choices: ["My bill splitter is broken and I do not know why, so please fix it quickly and tell me afterwards exactly what you changed in it", "Here is my whole project folder as a zip file; find anything that is wrong with it and repair whatever you happen to find there", "It worked yesterday and stopped today; maybe the internet is slow, so can you look at what else might be wrong with it for me", "The function, the call splitBill(1200, 4, 10) giving 1230 instead of 330, and my JavaScript browser setup"],
        answer: 3,
        explanation: 'It supplies the code, the actual output, the expected output and the environment, and says what to return. The others make the model guess.',
      },
      {
        id: 'ai-dev-gemini-06-q2',
        prompt: 'Why ask for a failing test before asking for the fix?',
        choices: ["A test makes the model write more code, and more code always means a better and safer result in the end, whatever it says", "Tests are required before Gemini is able to read any of your code, so you always have to write one before you can begin", "You and the model agree on exactly what the bug is, and the same test later proves the fix", "A failing test lets the model skip the explanation, so the reply is shorter and costs fewer tokens to read and to pay for"],
        answer: 2,
        explanation: 'A failing test pins down the bug in an executable form. After the fix, the same test turns green and keeps guarding against the bug returning.',
      },
      {
        id: 'ai-dev-gemini-06-q3',
        prompt: "Google's coding-agent page says agents often suggest deprecated models and older SDKs. What should you do?",
        choices: ["Check the name against the official docs and give the model the current example or page to work from", "Trust the suggestion when the model sounds certain, since it was trained by the same company that wrote the SDK in question", "Ask the model to repeat itself until two answers match, then use whichever package name appears most often in its replies", "Install every suggested package and keep whichever one runs without printing an error on the very first try that you make"],
        answer: 0,
        explanation: 'Training data has a cutoff, so names and APIs can be stale. The official docs are the source of truth and can be pasted into your prompt.',
      },
      {
        id: 'ai-dev-gemini-06-q4',
        audience: { max: 'beginner' },
        prompt: 'What does it mean to refactor code?',
        choices: ["To delete the code and start again from nothing, which is the safest way to remove every old mistake from a project", "To make the code run on a different phone or computer by translating it into another programming language entirely", "To add a brand new feature to the app so that users have something more to do each time that they visit it", "To tidy or reorganise code so it is easier to work with, without changing what it does"],
        answer: 3,
        explanation: 'Refactoring changes the structure, not the behaviour. That is why tests matter: they show the behaviour stayed the same.',
      },
      {
        id: 'ai-dev-gemini-06-q5',
        audience: { min: 'advanced' },
        prompt: 'You must refactor a 3,000-line legacy module with no tests, using an agent. What is the safest first step?',
        choices: ["Ask the agent to rewrite the whole module in one go, then review the final result when it has finished all of the work", "Write characterization tests that pin down current behaviour, then refactor in small steps with a plan first", "Skip the tests, because the agent will explain every change that it makes in words that you can read through afterwards", "Upgrade all the dependencies first, so the agent starts from newer code and from fewer deprecation warnings in the logs"],
        answer: 1,
        explanation: 'Without tests you cannot tell whether behaviour changed. Characterization tests give a baseline, and small steps with a plan keep each diff reviewable.',
      },
    ],
    task: {
      title: 'Break it, then fix it with proof',
      minutes: 20,
      steps: [
        'Take the working splitBill function from lesson 3. Change one line to introduce the precedence bug from this lesson and run `splitBill(1200, 4, 10)` to see the wrong result.',
        'Send Gemini the bug report from this lesson and ask for the cause in two sentences and the changed line only. Compare its cause with the one explained above.',
        "Ask Gemini for three tests, run them, apply the fix and run them again. Write down which test would have caught the bug alone.",
        "Ask Gemini how to call Gemini from Node, then check the package name and model name it gives against Google's getting-started page. Note anything outdated.",
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask Gemini: 'Explain operator precedence with three everyday examples, then show where it caused this bug.' Write down in your own words why brackets changed the answer.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Ask for three ranked hypotheses for a bug in a module you own, each with a cheap test to falsify it. Run the cheapest test first and record how often the model's top hypothesis was right.",
          "Add a CI check that fails the build if a deprecated Gemini package appears in package.json.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    id: 'ai-dev-gemini-07',
    day: 7,
    title: 'Gemini in the terminal and the editor',
    summary: 'See how an agent that works in your project folder differs from a chat: context files, approval modes, trusted folders, sandboxing and automation, as Google documents them.',
    minutes: 30,
    skills: ['gemini-cli'],
    intro: {
      objectives: [
        'Explain how a terminal or editor agent differs from a chat assistant',
        'Write a GEMINI.md context file and say how it is loaded',
        'Choose an approval mode and safety controls for a task, and say when headless mode fits',
      ],
      why: 'An agent can change your files and run commands, so what it is told, what it may do unasked and what you can undo matter more than how clever it is. These controls are the same ideas in every agent tool, learned here with Gemini CLI.',
    },
    body: [
      {
        type: 'paragraph',
        text: "A chat assistant answers; an **agent** acts. A terminal or editor agent reads your project folder, proposes edits and commands, and, with your approval, carries them out and looks at the result. Google offers this in several forms: **Gemini CLI**, an open-source agent for the terminal; **Gemini Code Assist** agent mode inside VS Code and IntelliJ (in VS Code it runs on Gemini CLI); and Google's **Antigravity** tools, which Google now recommends for the newest Gemini models. As lesson 1 explained, Gemini CLI is now aimed at organisations with Code Assist licences and paid API keys, so this lesson is written to teach the controls, which carry over to any agent, and to show how Google documents them.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "Plain words first. A **terminal** is a window where you type instructions as text; you tell it which **folder** to work in, and a **command** is one instruction you type. An **agent** in the terminal is an AI helper you start in a project folder: it can read the files there, suggest changes and, if you allow it, make them. A **context file** is a note to the helper that it reads at the start, like leaving written house rules for a new housemate. In Gemini CLI that note is called `GEMINI.md`. If you cannot use Gemini CLI yourself, you can still learn the ideas below and practise them with a notes file and the Gemini app, which is what the task at the end of the lesson allows.",
      },
      { type: 'heading', text: 'Starting Gemini CLI' },
      {
        type: 'code',
        language: 'bash',
        label: 'Install and start (needs Node.js 20 or newer)',
        code: 'npm install -g @google/gemini-cli\ncd barkada-split\ngemini',
      },
      {
        type: 'paragraph',
        text: "You start it inside the project folder, so the folder is the project it can see. Authentication depends on your account: sign in with Google using a Code Assist licence (set `GOOGLE_CLOUD_PROJECT` for a paid licence), or set `GEMINI_API_KEY` from AI Studio, or use Vertex AI. Its built-in tools cover the file system, shell commands, and web fetch and search. In a prompt, `@src/split.js` adds a file's content and `!npm test` runs a shell command directly.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The README gives these install options: npx @google/gemini-cli, npm install -g @google/gemini-cli, brew install gemini-cli and sudo port install gemini-cli, with weekly stable and preview release channels and a daily nightly. It lists three sign-in routes: Google login with GOOGLE_CLOUD_PROJECT for a paid Code Assist licence, a Gemini API key in GEMINI_API_KEY, and Vertex AI with GOOGLE_API_KEY and GOOGLE_GENAI_USE_VERTEXAI=true. The package requires Node.js 20 or newer. The tools reference lists file system, shell, and web fetch and search tools, says mutating tools need your confirmation with a diff or the exact command shown, and describes @ for files and ! for shell commands.",
        checked: CHECKED,
        sources: [DOCS.cliReadme, DOCS.cliTools, DOCS.cliPackage],
      },
      { type: 'heading', text: 'Context that persists: GEMINI.md' },
      {
        type: 'paragraph',
        text: "Instead of repeating the same rules in every prompt, write them once in `GEMINI.md`. The CLI loads a global file from `~/.gemini/GEMINI.md`, files in your workspace and its parent folders, and, just in time, files in folders it touches, then joins them and sends them with each prompt. `/memory show` prints exactly what it loaded, `/init` drafts a file from your folder, and a file can import another with `@./path.md`. The setting `context.fileName` lets you name other files, such as `AGENTS.md`. A `.geminiignore` file works like `.gitignore` to keep paths out of tools that respect it, such as the `@` command.",
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'GEMINI.md for Barkada Split (an example to adapt)',
        code: "# Project: Barkada Split\n\n## What this is\nA one-file web app that splits a restaurant bill among friends. Amounts are in pesos.\n\n## Rules\n- Use plain JavaScript. Do not add dependencies without asking me first.\n- Keep the function name splitBill(total, people, tipPercent).\n- Show every amount with a peso sign and two decimal places.\n\n## Before you finish\n- Run the tests and show me the result.\n- Never read or print the .env file.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The GEMINI.md docs describe a hierarchy: a global ~/.gemini/GEMINI.md, workspace and parent-folder files, and just-in-time files discovered when a tool touches a directory; contents are concatenated and sent with every prompt; /memory show and /memory reload inspect and refresh it; files can be imported with @file.md; context.fileName in settings.json can name other files. The commands reference describes /init as generating a tailored GEMINI.md. The ignore docs say .geminiignore follows .gitignore conventions and needs a session restart to apply, and that ignored files stay visible to other services such as Git.",
        checked: CHECKED,
        sources: [DOCS.cliGeminiMd, DOCS.cliCommands, DOCS.cliIgnore],
      },
      { type: 'heading', text: 'Permissions: what it may do unasked' },
      {
        type: 'table',
        headers: ['Control', 'What it does', 'Use it when'],
        rows: [
          ['Default approval mode', 'Asks before each tool that changes files or runs commands, showing the diff or the exact command', 'Normally, and always on code you do not know yet'],
          ['Plan mode (--approval-mode=plan)', 'Read-only research and a written plan; nothing is edited until you approve the plan', 'A new repository or a risky change'],
          ['auto_edit mode', 'Approves edit tools automatically, while other actions still ask', 'A tight loop of small edits you review in git afterwards'],
          ['yolo mode', 'Approves everything with no prompts; only from the command line', 'Almost never: a disposable sandbox at most'],
          ['Trusted folders', 'Untrusted folders run in safe mode: project settings, .env files, MCP servers and custom commands are not loaded, and auto-approval is off', 'Opening any repository you did not write'],
          ['Sandbox (gemini -s)', 'Runs tool execution in an isolated environment', 'Running untrusted code or risky commands'],
          ['Checkpointing and /restore', 'Snapshots your files before each approved edit so you can roll back', 'Experiments; it is off until you enable it'],
        ],
        caption: "Gemini CLI's main safety controls",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One round of an agent task in default mode',
        source: 'sequenceDiagram\n  participant You\n  participant CLI as Gemini CLI\n  participant Model as Gemini model\n  You->>CLI: Add a check for zero friends\n  CLI->>Model: Your request, GEMINI.md and files\n  Model-->>CLI: Please edit src/split.js\n  CLI->>You: Show the diff and ask to approve\n  You->>CLI: Approve\n  CLI->>Model: Edit done, here is the result\n  Model-->>CLI: Summary of the change\n  CLI->>You: Report what changed',
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The CLI reference lists --approval-mode with the choices default, auto_edit, yolo and plan, -p for a non-interactive prompt, -s for a sandbox and --output-format text, json or stream-json. The configuration reference says auto_edit auto-approves edit tools, plan is read-only and yolo can only be enabled from the command line. Plan Mode is entered with Shift+Tab, /plan, or --approval-mode=plan and is read-only. The Trusted Folders feature is off by default and is enabled in settings.json; in an untrusted folder workspace settings and .env files are ignored, MCP servers do not connect and auto-approval is disabled; /permissions changes a folder's trust. Checkpointing is off by default, is enabled in settings.json and restored with /restore.",
        checked: CHECKED,
        sources: [DOCS.cliReference, DOCS.cliConfig, DOCS.cliPlan, DOCS.cliTrusted, DOCS.cliSandbox, DOCS.cliCheckpoint],
      },
      { type: 'heading', text: 'In the editor, and in scripts' },
      {
        type: 'paragraph',
        text: "Gemini Code Assist agent mode (VS Code and IntelliJ) works the same way inside the editor: it asks you to allow operations that change files, may skip asking for read-only requests, can show a plan for approval, and can use MCP servers. Google marks agent mode as a preview, warns that the agent can reach your file system and terminal so you should be careful with auto-approval, and warns that MCP servers can run arbitrary code with your permissions, so you should trust only servers you know. For scripts, `gemini -p \"summarise the changes in this repo\"` runs once without the interactive screen, and `--output-format json` returns a single JSON object with the answer and usage statistics.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. Gemini Code Assist's agent mode page says agent mode is available in VS Code and IntelliJ, is a preview (pre-GA), and that in VS Code it uses Gemini CLI, which is not optimised for the latest Gemini models, so Google recommends Antigravity CLI for the best coding experience. It says mutating operations ask for permission unless you always allow that tool, read-only requests might not ask, and it can show a high-level plan. Its context comes from workspace information, tool results and Markdown context files such as GEMINI.md. It warns that the agent can access your file system and terminal and MCP servers can run arbitrary code. The headless docs describe -p and --output-format json with response, stats and error fields, and exit codes 0 (success), 1 (error), 42 (input error) and 53 (turn limit exceeded).",
        checked: CHECKED,
        sources: [DOCS.codeAssistAgent, DOCS.codeAssistChat, DOCS.cliHeadless],
        plans: 'Gemini Code Assist Standard or Enterprise (agent mode is a preview)',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Design permissions as least privilege with an audit trail. Start unfamiliar repositories in plan mode, keep default mode for anything that touches a shell, and write policy rules for what must never run unasked: Gemini CLI's policy engine reads TOML files in `~/.gemini/policies/` where a rule names a tool, optionally a command prefix, and a decision of `allow`, `deny` or `ask_user`, so you can deny `rm -rf` outright. In CI, run headless in a sandbox, parse the JSON and the exit codes (not the prose), and cap turns. Be careful with the trust bypass: `--skip-trust` or `GEMINI_CLI_TRUST_WORKSPACE=true` makes the CLI load a repository's own settings, commands and MCP servers, so use it only for repositories you control, because a pull request can carry its own `GEMINI.md` or configuration, which is a prompt-injection route.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Checked 2026-11-14. The policy engine docs say rules in TOML files under ~/.gemini/policies/ can set toolName, commandPrefix, decision (allow, deny or ask_user) and priority, that deny is the recommended way to exclude tools, and that rules can be tied to approval modes. The trusted folders docs say headless runs in an untrusted folder with Folder Trust enabled fail unless bypassed with --skip-trust or GEMINI_CLI_TRUST_WORKSPACE=true, which trust the workspace for the session. OWASP's LLM01 guidance names untrusted content that the model reads as an injection route and recommends least privilege and human approval for risky actions.",
        checked: CHECKED,
        sources: [DOCS.cliPolicy, DOCS.cliTrusted, DOCS.owaspLlm01],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-07-fill-1',
          kind: 'fill-blank',
          title: 'Finish the GEMINI.md',
          prompt: 'Fill the four blanks so the context file sets a limit, a format, a check and a secret rule.',
          concept: 'writing a context file',
          language: 'markdown',
          code: "# Project: Barkada Split\n\n## Rules\n- Use plain JavaScript. Do not add ___ without asking me first.\n- Show every amount with a peso sign and two ___ places.\n\n## Before you finish\n- Run the ___ and show me the result.\n- Never read or print the ___ file.",
          blanks: [
            { answers: ['dependencies', 'libraries'], feedback: 'A rule against silent extra packages keeps the project small and reviewable.' },
            { answers: ['decimal'], feedback: 'Pesos are shown with centavos, which are two decimal places.' },
            { answers: ['tests'], feedback: 'Asking the agent to run the tests gives you evidence rather than a claim.' },
            { answers: ['.env'], feedback: 'The .env file holds secrets such as API keys, so the agent should never open it.' },
          ],
          bank: ['dependencies', 'decimal', 'tests', '.env', 'README', 'colours', 'a database'],
          hints: [
            'Think about what an agent might add on its own that you would want to approve.',
            'Money shown with centavos has a fixed number of digits after the point.',
            'The file that holds secrets starts with a dot and is named after the environment.',
          ],
          explanation: 'A good context file states limits (dependencies), formats (two decimals), the proof you expect (run the tests) and what is off limits (.env). Each rule saves you retyping it and prevents a predictable mistake.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-07-match-1',
          kind: 'match',
          title: 'Pick the control',
          prompt: 'Match each situation to the Gemini CLI control that suits it best.',
          concept: 'choosing an approval mode',
          labels: { terms: 'Situation', meanings: 'Control' },
          pairs: [
            { term: 'You opened a stranger\'s repository and want to understand it and agree a design before any file changes.', definition: 'Plan mode (read-only)' },
            { term: 'You want to see and approve each diff and each shell command on your own project.', definition: 'Default approval mode' },
            { term: 'You are about to run code you did not write and want its commands isolated from your machine.', definition: 'The sandbox (gemini -s)' },
            { term: 'You tried an experiment, disliked the result, and want the files and the conversation back as they were.', definition: 'Checkpointing with /restore' },
          ],
          hints: [
            'Ask what each situation is protecting: files, your machine, or your ability to undo.',
            'Read-only research suits a repository you do not know; isolation suits code you do not trust.',
            'Only one control brings back both files and conversation.',
          ],
          explanation: 'Plan mode protects files while you learn, default mode keeps you in the loop, the sandbox isolates execution, and checkpoints give you an undo. Each control answers a different worry.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'An agent reads your folder and acts; the controls on what it may do unasked matter more than its cleverness.',
          'GEMINI.md holds the rules you would otherwise retype; /memory show reveals what was loaded.',
          'Plan mode, default mode, trusted folders, the sandbox and checkpoints each protect something different.',
          'Headless mode suits scripts; read the JSON and the exit codes, and treat a repository that carries its own configuration as untrusted.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-07-q1',
        prompt: 'What does `/memory show` do in Gemini CLI?',
        choices: ['Deletes all saved conversations from your computer', 'Lists every file your project contains', 'Uploads your GEMINI.md file to Google AI Studio', 'Prints the combined context from every GEMINI.md file that was loaded'],
        answer: 3,
        explanation: 'The docs say /memory show displays the full concatenated context, so you can check exactly what instructions the model receives.',
      },
      {
        id: 'ai-dev-gemini-07-q2',
        prompt: 'You open a repository you did not write and run Gemini CLI. Which setup best protects you?',
        choices: ["yolo mode, so that nothing interrupts the investigation while the agent reads through the whole repository from the top", "auto_edit mode, so that small fixes are applied as the agent reads and you can review all of them later in git history", "Trusted Folders on with the folder untrusted, and the session started in plan mode (read-only)", "Headless mode with --skip-trust, so that the CLI never stops to ask you anything at all about the folder it has opened"],
        answer: 2,
        explanation: 'An untrusted folder ignores the repository\'s own settings, .env files and MCP servers, and plan mode is read-only. The other options remove approval or skip the trust check.',
      },
      {
        id: 'ai-dev-gemini-07-q3',
        prompt: 'What is the difference between default and auto_edit approval modes?',
        choices: ["Default prompts for each tool call; auto_edit approves edit tools automatically", "Default shows no diffs at all, while auto_edit shows every diff before you decide whether you want to accept it or not", "They are the same mode, and only the keyboard shortcut that selects each one is different from the shortcut of the other", "Default is read-only, while auto_edit lets the agent run any shell command without ever stopping to ask you about it first"],
        answer: 0,
        explanation: 'The CLI reference says default prompts on each tool call, while auto_edit automatically approves edit tools such as replace and write_file.',
      },
      {
        id: 'ai-dev-gemini-07-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a context file such as GEMINI.md for?',
        choices: ["A file where Google stores your account password so that the agent can sign in for you on every single run of the tool", "Written house rules the agent reads at the start, so you do not repeat them in every request", "A file that makes your project run faster by saving compiled copies of every page that lives in the project folder for you", "A list of every mistake that the agent made yesterday, kept so that it can apologise at the start of each new session"],
        answer: 1,
        explanation: 'The agent loads GEMINI.md and sends it with each prompt, so your rules (stack, style, what not to touch) apply without retyping.',
      },
      {
        id: 'ai-dev-gemini-07-q5',
        audience: { min: 'advanced' },
        prompt: 'A CI job runs Gemini CLI headless on pull requests from outside contributors, with GEMINI_CLI_TRUST_WORKSPACE=true. What is the main risk?',
        choices: ["The job will run slowly, because trust checks are expensive and every pull request from outside needs a new one to be made", "The exit code will always be 0 even when the run fails, so that the pipeline would never report a real problem to anyone", "The JSON output will be missing its usage statistics, so that the cost reports for the pipeline become wrong in every run", "It loads configuration and MCP servers carried by the pull request itself, a prompt-injection and execution route"],
        answer: 3,
        explanation: 'The trust bypass makes the CLI honour the repository\'s own settings. For untrusted contributions, keep trust off, use a sandbox and least-privilege rules, and never let the agent act on content from the pull request unreviewed.',
      },
    ],
    task: {
      title: 'Write the rules before the agent arrives',
      minutes: 20,
      steps: [
        'Write a GEMINI.md for a small project of yours (stack, rules, how to run tests, what never to touch). Keep it under twenty lines.',
        'Create a `.geminiignore` (or the equivalent for your tool) that lists your secrets file and any large generated folders.',
        'If you have access to Gemini CLI or Code Assist, start it in plan mode, ask it to explain the project and propose one small change, and compare its plan with your rules. If you do not, paste your GEMINI.md and a short project description into the Gemini app and ask for the same plan.',
        'Write down, for your project, which actions the agent may do without asking, which must always ask, and which are denied.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask Gemini: 'Explain what a terminal, a folder and a command are, using a kitchen as the example.' Then write three rules for your own project in plain sentences, as if for a new housemate.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Write a policy file with a deny rule for a destructive shell command prefix and an ask_user rule for network access, then run a headless job in a sandbox that parses the JSON output and checks the exit code. Record what happens when the turn limit is exceeded.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    id: 'ai-dev-gemini-08',
    day: 8,
    title: 'Review, safety and privacy',
    summary: 'Review what Gemini writes before you ship it, know what each Gemini door does with your data, and follow the steps when a key leaks.',
    minutes: 25,
    skills: ['gemini-safety'],
    intro: {
      objectives: [
        'Review generated code with a short checklist before you accept it',
        'Say what the Gemini app, AI Studio, the paid API and Code Assist do with your content',
        'Respond correctly when an API key leaks in a repository, a prompt or a screenshot',
      ],
      why: 'Two things go wrong with AI building: you ship something nobody checked, or you send something that should never have left your machine. A checklist and a rehearsed response cost minutes and prevent the expensive versions of both.',
    },
    body: [
      {
        type: 'paragraph',
        text: "Everything Gemini writes is a draft, and everything you send it leaves your machine. That gives you two jobs: **review** what comes back, and **protect** what goes in. Google says the first one itself: its Gemini Code Assist documentation warns that the tool can produce output that seems plausible but is incorrect, and tells you to validate it and to test generated code for security issues before use. This lesson turns that advice into habits you can apply to any Gemini door.",
      },
      { type: 'heading', text: 'A five-minute review of generated code' },
      {
        type: 'table',
        headers: ['Check', 'What goes wrong', 'How to check'],
        rows: [
          ['Does it match your examples?', 'It handles the happy case and fails an edge such as zero people or a tip of 0', 'Run the examples and a strange input; write a test'],
          ['Are the names real and current?', 'An invented function or a deprecated package, a habit Google itself warns about', 'Check each unfamiliar name against the official docs'],
          ['Any secrets?', 'A key typed into code, a token in a log line, an .env file read aloud', 'Search the diff for key-like strings and check that secret files are ignored'],
          ['Is input trusted too much?', 'User text pasted straight into a database query or a web page', 'Look for string-building around queries and HTML; ask for validation and parameterised queries'],
          ['What did it add?', 'A new package nobody asked for, or edits to unrelated files', 'Read the whole diff, then open each new dependency\'s page and confirm that it is the real one'],
        ],
        caption: 'A short review checklist for AI-generated code',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "If you are new to this, treat the review like proofreading a friend's essay. You do not need to be an expert to catch real problems: run the code with an example you worked out by hand, try something silly (zero friends, a negative bill), and ask Gemini to explain any line you do not understand. A **dependency** is a ready-made piece of code your project borrows from other people; a **diff** is the list of exactly what changed. Two safe rules: never accept a change you could not explain in one sentence, and never run a command you do not understand without asking Gemini what it does first.",
      },
      { type: 'heading', text: 'What happens to your data, door by door' },
      {
        type: 'table',
        headers: ['Door', 'What Google says', 'What that means for you'],
        rows: [
          ['Gemini app, Keep Activity on', 'Chats are saved to your activity; a subset are reviewed by human reviewers; activity auto-deletes after 18 months by default', 'Do not enter anything confidential that you would not want a reviewer to see'],
          ['Gemini app, Keep Activity off or a temporary chat', 'Not used to train models, but chats are kept for 72 hours, and Google may still use them for safety', 'Better, not private: still no secrets'],
          ['AI Studio and the free API quota', 'Unpaid services: content can be used to improve Google products, and human reviewers may read it', 'Practice with public or made-up material only'],
          ['The paid API (billing enabled)', 'Google says it does not use prompts and responses to improve products', 'Suitable for real data, subject to your own obligations'],
          ['Gemini for Google Cloud and Code Assist', "Google's data page says Gemini does not use your prompts or responses to train its models; code customisation stores your private code", 'Check which account type and terms cover you'],
        ],
        caption: 'Data handling by door (details in the version note)',
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The Gemini Apps Privacy Hub says: with Keep Activity on, chats are saved to your activity and can help improve Google services, and a subset is reviewed by human reviewers, so you should not enter confidential information you would not want a reviewer to see; activity is auto-deleted after 18 months by default (you can pick 3 or 36 months); with Keep Activity off, and for temporary chats, chats are not used to train Google's models but are retained for 72 hours, and Google may still use chats for safety purposes; reviewed chats can be kept up to three years; work or school accounts may be subject to different data handling terms. The Gemini API terms describe unpaid services as used to improve products with possible human review, and paid services as not used that way. Google's Gemini for Google Cloud data governance page says Gemini does not use your prompts or responses to train its models, and that code customisation stores your private code. Terms differ by account and region, so read the pages that cover you.",
        checked: CHECKED,
        sources: [DOCS.geminiPrivacy, DOCS.terms, DOCS.codeAssistData, DOCS.codeAssist],
      },
      { type: 'heading', text: 'When a key leaks' },
      {
        type: 'paragraph',
        text: "Keys leak in three common ways: committed to a repository, pasted into a prompt, or visible in a screenshot or a video. The fix is the same for all three and is written in Google's API key guide: create a replacement, deploy it, disable the old key once the new one works, and review usage for requests you did not make. Deleting the chat, the screenshot or the commit is a good clean-up but not the fix, because a secret that has left your machine must be assumed copied. Only making the old key worthless protects you.",
      },
      {
        type: 'warning',
        text: "Rewriting git history or deleting a file does not un-leak a key that was already public. Rotate first, clean up second.",
      },
      {
        type: 'paragraph',
        text: "One more risk is about what Gemini reads rather than what you send. A web page, a README, a document or text inside a screenshot can contain instructions aimed at the model, a problem called prompt injection. A chat can only misinform you, but an agent that can edit files and run commands can be steered into doing damage. The defences are the ones from lesson 7: least privilege, approval before risky actions, and not auto-approving anything while the agent is reading content you did not write.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Turn these habits into controls. Map data classes (public code, internal code, customer data, credentials) to the doors allowed for each, enforced through account type and contract, not by memory. Add secret scanning as a pre-commit hook and in CI, give each service its own key with the narrowest restriction available, and keep separate projects for experiments and production so one leak or runaway loop has a small blast radius. Review supply chain risk in generated diffs: new dependencies, install scripts and lookalike package names. For AI Studio and API projects, know your logging posture: logs are private to your project, retained for a period you can set, and only shared with Google if you choose to share a dataset.",
      },
      {
        type: 'version',
        audience: { min: 'advanced' },
        text: "Checked 2026-11-14. Google's data logging page says logging is on by default for Interactions API calls and for Generate Content calls in projects created on or after 26 October 2026, and is available for projects with billing enabled; logs are private to your Cloud project, retained for 55 days by default (configurable to 7, 14, 28 or 55 days), and prompts and responses in logs are not used for product improvement unless you share a dataset, in which case the unpaid-services terms apply and human reviewers may read it. It tells you not to donate data from clients available to users in the EEA, Switzerland or the UK, nor data that is personal, sensitive or confidential.",
        checked: CHECKED,
        sources: [DOCS.logsPolicy],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-08-fix-1',
          kind: 'fix-bug',
          title: 'The ignore file that ignores the wrong thing',
          prompt: 'Your project keeps its secrets in a file named `.env`. This `.gitignore` is meant to keep it out of GitHub. Tap the line that leaves the secret exposed and choose the fix.',
          concept: 'keeping secret files out of a repository',
          language: 'text',
          code: 'node_modules/\ndist/\n*.log\n.env.local',
          bugLine: 4,
          fixes: [
            { line: '.env', correct: true, why: 'This line names the file that holds the secret, so git leaves it alone from now on.' },
            { line: '.env.example', correct: false, why: 'The example file holds no real secrets and is meant to be committed. This ignores the wrong file.' },
            { line: '# .env', correct: false, why: 'A line that starts with # is a comment, so nothing is ignored.' },
            { line: 'env', correct: false, why: 'This matches a file or folder named env, not one named .env with a dot.' },
          ],
          hints: [
            'Which file name holds the real secrets in this project?',
            'The ignore line must match that exact name, including the dot at the start.',
            'Remember that if the file was already committed once, you also need to rotate the key.',
          ],
          explanation: 'Git only ignores what a line matches. `.env.local` is a different file, so `.env` stayed exposed. If `.env` was ever committed, ignoring it now is not enough: rotate the key too.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-08-scenario-1',
          kind: 'scenario',
          title: 'The key in the screenshot',
          prompt: 'Pick the best response.',
          concept: 'responding to a leaked key',
          situation: "To ask about an error, you uploaded a screenshot of your terminal to the free AI Studio Playground. An hour later you notice the screenshot shows your GEMINI_API_KEY on the screen.",
          options: [
            { text: 'Create a new key, put it in your environment or hosting settings, check that the app works, disable the old key, review usage, and then delete the chat.', consequence: 'Best. This follows the documented order and makes the exposed key worthless, which is the only reliable protection.', quality: 'best' },
            { text: 'Delete the chat and the uploaded image, and carry on.', consequence: 'The clean-up is sensible, but the key already left your machine and on the free tier reviewers may have read it. The old key still works until you disable it.', quality: 'acceptable' },
            { text: 'Delete the screenshot file from your computer and say nothing.', consequence: 'The copy that matters is the one you uploaded, not the one on your disk. The key is still live and the problem is still unreported.', quality: 'poor' },
          ],
          hints: [
            'Ask whether the old key still works after each option.',
            'The documented order is: new key, deploy it, disable the old one, check usage.',
            'Only one option makes the exposed key useless.',
          ],
          explanation: 'A secret that has been uploaded must be treated as copied. Replace it, switch over, disable the old key and check usage; cleaning up the evidence comes after.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-08-arrange-1',
          kind: 'arrange',
          title: 'Order the leak response',
          prompt: 'Put the steps of responding to a leaked Gemini API key in a safe order.',
          concept: 'key rotation',
          language: 'text',
          solution: [
            'Create a new API key in Google AI Studio',
            'Put the new key in your environment or hosting settings and deploy',
            'Check that the app works with the new key',
            'Disable the old key',
            'Review usage for requests you did not make',
            'Remove the secret from the repository and add its file to .gitignore',
          ],
          alternatives: [
            [
              'Create a new API key in Google AI Studio',
              'Put the new key in your environment or hosting settings and deploy',
              'Check that the app works with the new key',
              'Disable the old key',
              'Remove the secret from the repository and add its file to .gitignore',
              'Review usage for requests you did not make',
            ],
          ],
          reasons: [
            'You need a working replacement before you take the old key away.',
            'The new key must be live in the app before the old one is disabled.',
            'Testing first avoids switching off the only key that works.',
            'Disabling the old key is what actually makes the leaked copy worthless.',
            'Usage review shows whether anyone used the key before you disabled it.',
            'Clean-up of the repository comes last and does not need to wait for the review.',
          ],
          hints: [
            'You must have a working key before you disable the old one.',
            'Disabling the old key comes only after the new one works.',
            'Review and clean-up can go in either order at the end.',
          ],
          explanation: 'Replace, switch, verify, disable, then investigate and clean up. Disabling the old key before the new one works would take your app down; cleaning up first leaves the old key live.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'Review generated code for examples, invented names, secrets, trusted input and surprise additions.',
          "Each door handles data differently: free and unpaid tiers may be read by reviewers, so keep secrets and personal data out.",
          'A leaked key is fixed by making it worthless: new key, deploy, disable the old one, check usage.',
          'Content that Gemini reads can carry instructions; limit what an agent may do unasked.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-08-q1',
        prompt: 'In the Gemini app you turn Keep Activity off. What does Google say happens to future chats?',
        choices: ["They are kept out of Activity and training, but still saved for 72 hours and may be used for safety", "They are deleted the moment that you close the window, so nobody at Google can ever see any of them again after that time", "They are read by no one, under any circumstance, because the setting overrides every other policy that Google applies to chats", "They are saved for 18 months as before, and the setting only hides them from your own Activity page, nothing else changes"],
        answer: 0,
        explanation: 'The Privacy Hub says chats with Keep Activity off are not used to train models but are retained for 72 hours, and Google may still use chats for safety purposes.',
      },
      {
        id: 'ai-dev-gemini-08-q2',
        prompt: 'You committed a key to GitHub by mistake and then rewrote the history to remove it. What is still required?',
        choices: ["Nothing, because the key is no longer in the repository and so nobody can find it again afterwards, in any copy or clone", "Waiting a day, because keys expire automatically once the history of the repository that held them has been changed again", "Making the repository private, so that the key can no longer be copied by anybody who has already seen it in the past", "Rotating the key: create a new one, deploy it, disable the old one and check usage"],
        answer: 3,
        explanation: 'Anyone who saw or copied the key while it was public still has it. Only disabling the old key makes it useless.',
      },
      {
        id: 'ai-dev-gemini-08-q3',
        prompt: "Gemini adds a package named 'gemini-helper-sdk' that you never asked for. What is the best next step?",
        choices: ["Accept it, because a model from a big company would never add a package that turns out to be unsafe to use in a project", "Delete the lockfile so that the package is installed fresh and any problem with it disappears by itself on the next install", "Check its page in the official registry to see that it is real and needed, and ask Gemini why it added it", "Rename the package in your code to something similar, so that nobody can find it by searching for the name it came with"],
        answer: 2,
        explanation: 'Generated diffs can add unneeded or lookalike packages. Confirm that a dependency is real and necessary before it enters your project.',
      },
      {
        id: 'ai-dev-gemini-08-q4',
        audience: { max: 'beginner' },
        prompt: 'What does it mean to rotate a key?',
        choices: ["To turn the key in the settings page like a dial until the number on the screen reaches zero and the key is used up", "To make a new key, switch the app to it and switch off the old one so the leaked copy stops working", "To copy the key into several safe places so that a single lost copy can never stop you from working on your project", "To hide the key by writing it backwards, so that anyone who reads it cannot guess which service it is able to unlock"],
        answer: 1,
        explanation: 'Rotation replaces a key and disables the old one. A leaked key stops being a danger only when it stops working.',
      },
      {
        id: 'ai-dev-gemini-08-q5',
        audience: { min: 'advanced' },
        prompt: 'Your team wants Gemini help on a repository that contains customer data in test fixtures. Which policy is most defensible?',
        choices: ["Mask the customer data, then allow the work only on an approved account type with known terms and secret scanning", "Allow it on personal free accounts, because training is the only risk and the human reviewers cannot see any of the content", "Block every AI tool forever, because any use of an outside service on test data already counts as a breach of the contract", "Ask each developer to use their own judgement for each file, and trust that they will all remember which rules apply to it"],
        answer: 0,
        explanation: 'Data classification, masking and an approved account type with known terms make the rule enforceable. Personal free accounts may let reviewers read content, and blanket bans or individual judgement do not scale.',
      },
    ],
    task: {
      title: 'Build your safety checklist',
      minutes: 20,
      steps: [
        'Write a personal checklist of what you will never paste into Gemini (keys, `.env` contents, customer data, client code you may not share) and which door each kind of work will use.',
        "Open your own project's `.gitignore` and confirm that your secret files are listed by their exact names. Search your last commits for key-like strings.",
        'Run the review checklist from this lesson on the Barkada Split code from earlier lessons, and write down two things you found or confirmed.',
        'Write the five steps of your key-leak response in your own words and keep them where you will find them in a hurry.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Make a fake `.env` file with three made-up values and practise swapping each for a placeholder before pasting anything into a chat. Ask Gemini to explain what a repository and a dependency are, and compare with this lesson.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Add a secret-scanning step to your pre-commit hooks and CI, and plant a fake key in a test branch to confirm it is caught. Write a one-page data classification and tool-approval table for your team, naming the account type required for each class.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    id: 'ai-dev-gemini-09',
    day: 9,
    title: 'When to choose Gemini',
    summary: 'Match Gemini to the work it suits, be honest about where it is weaker or in flux, and compare tools with a small test on your own task.',
    minutes: 20,
    skills: ['tool-choice'],
    intro: {
      objectives: [
        'List the strengths Google documents for Gemini and the limits and changes to plan for',
        'Choose between Gemini and another tool using questions about the task, data and team',
        'Run a small fair comparison on your own work instead of trusting a ranking',
      ],
      why: 'Every tool is the right answer to some question. Knowing which question Gemini answers well, and testing it on your own work, saves you from both hype and habit.',
    },
    body: [
      {
        type: 'paragraph',
        text: "No tool wins everywhere, so the useful question is not 'is Gemini good?' but 'good for what, under which constraints?'. The constraints are the part people forget: what data may leave your machine, which account you are allowed to use, whether the work lives in a repository, and how quickly the tool and its pricing will change under you. This lesson collects what Google documents as Gemini's strengths, the limits and changes to plan around, and a method for deciding with evidence. The course Choosing the Right AI Coding Tool compares every tool on one scale; here you decide about Gemini.",
      },
      { type: 'heading', text: 'Where Gemini is a good fit' },
      {
        type: 'list',
        items: [
          '**Very large inputs.** Many Gemini models have windows of a million tokens or more, so a long specification, a log archive or a whole small codebase can go into one request (with the accuracy caveats from lesson 4).',
          '**Mixed inputs.** Google lists text, images, audio, video and PDF as inputs for its Gemini 4 models, which suits screenshot-to-code, reading a recorded meeting or analysing a scanned form together with its text.',
          '**From description to a running, shareable app.** AI Studio Build mode goes from a prompt to a preview, a GitHub sync, a ZIP or a Cloud Run deployment, with Firebase and Google Workspace integrations the agent can set up.',
          '**Work inside Google\'s ecosystem.** If your team already uses Google Cloud, Android Studio, Firebase or Workspace, Gemini tools and contracts are in the same place as your data and billing.',
          '**Apps that call a model.** The Gemini API and its tools are a direct route when your own app needs summarising, chat or image reading.',
        ],
      },
      { type: 'heading', text: 'Limits and changes to plan for' },
      {
        type: 'list',
        items: [
          '**Product churn.** In 2026 Gemini CLI moved to enterprise licences and paid keys, free individual access moved to Antigravity CLI, and new Code Assist subscriptions stopped being sold. Models too: Google marks Gemini 2.5 Pro and Flash as deprecated, with requests rerouted to newer models from 1 December 2026. Do not hard-code assumptions.',
          '**The free tier has a price.** Free use is an unpaid service whose content may be used to improve Google products and read by reviewers; some newer models are not on the free tier.',
          '**Limits change.** Gemini app limits are compute-based and Google says they may change without notice; API limits are per project and depend on your usage tier.',
          '**It is still a draft.** Google warns, as every vendor does, that output can be plausible and wrong, and that coding agents suggest outdated tools. Review stays your job.',
        ],
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. The models page lists Gemini 4 Carbon, Argon and Hydrogen with 1M-token context windows and text, image, audio, video and PDF input, lists Gemini 2.5 Pro and Flash as deprecated with requests routed to newer models from 1 December 2026, and recommends Gemini 4 Hydrogen or 3.5 Flash-Lite for new projects over 2.5 Flash-Lite. The pricing page describes a free tier with limited access to some models and says some newer models, including Gemini 4 Carbon and Argon, are not available on it. The Gemini Apps Help page says usage limits are compute-based and may change without notice. The Gemini CLI README and the Code Assist overview describe the 2026 changes covered in lesson 1. Re-check these pages before you rely on any of them.",
        checked: CHECKED,
        sources: [DOCS.models, DOCS.pricing, DOCS.geminiLimits, DOCS.cliReadme, DOCS.codeAssist],
      },
      { type: 'toolComparison', tools: ['gemini', 'chatgpt', 'claude-code', 'cursor'], caption: 'Gemini beside three tools you may compare it with (shared tool data, checked 2026-11-14)' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Questions that point toward Gemini, or away',
        source: `flowchart TD
  A[A new task] --> B{Is the main work reading huge files, images or video?}
  B -->|yes| C[Gemini is worth trying first]
  B -->|no| D{Do you need an agent editing a repo every day?}
  D -->|yes| E[Compare agents on your own repo, using approved accounts]
  D -->|no| F{Is your team already in Google Cloud, Firebase or Android?}
  F -->|yes| G[Gemini fits your existing tools and contracts]
  F -->|no| H[Pick what you can review and keep prompts portable]`,
      },
      { type: 'heading', text: 'Decide with a small test, not a ranking' },
      {
        type: 'paragraph',
        text: "A leaderboard, an article or a video tells you how someone else's tasks went, on a version that has probably changed. A small bake-off tells you how your tasks go today. Pick two or three real tasks from your own work, write the acceptance examples first, run the same task in each tool, and record what happened: did it pass your examples, how many corrections did it need, how long did you spend reviewing, and which data and account rules applied. Keep your rules portable so that switching is cheap: Gemini CLI can be set to read `AGENTS.md` instead of `GEMINI.md`, and prompts, examples and tests live in your repository, not in one tool's chat history.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "If you are just starting, do not try to choose the perfect tool. A good-enough tool that you understand beats a perfect tool you do not. Pick one, learn its habits (small steps, clear examples, running what it writes), and only then compare. A fair comparison can be tiny: ask two assistants for the same simple thing, such as the bill splitter, using the same words, and write down which one needed fewer corrections and which explanation you understood better. Then decide for that kind of task, and treat the answer as a note for today, since tools change.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Run the evaluation like an engineering experiment. Sample five to ten tasks from your real backlog, fix acceptance tests before any tool sees the task, and measure pass rate, corrections per task, review time, cost per accepted change and policy fit (account type, data terms, audit trail). Keep the model and the harness separate in your notes, because a better model in a worse harness can lose, and abstract model names behind configuration so that a deprecation is a one-line change that your tests then verify. Re-run the comparison on a schedule, since both sides move, and record the decision with its evidence and an expiry date.",
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-09-scenario-1',
          kind: 'scenario',
          title: 'Which tool for the studio?',
          prompt: 'Pick the best way to decide.',
          concept: 'choosing an AI coding tool',
          situation: "A two-person studio wants to standardise on one AI coding tool. One partner found a comparison article from last year that ranks a tool first; the other likes Gemini because of the long context window. Both have client repositories under contract.",
          options: [
            { text: 'Pick three real tasks, write acceptance tests first, run each on two or three tools using accounts their contracts allow, record corrections, review time and data terms, and recheck in a few months.', consequence: 'Best. It tests the tools on their own work with their own constraints, and the recheck acknowledges that products change.', quality: 'best' },
            { text: "Choose whichever scored highest on a public benchmark this month.", consequence: 'A benchmark measures someone else\'s tasks and often a different harness. It is a weak starting point, but better than a year-old article.', quality: 'acceptable' },
            { text: "Follow last year's article, since the ranking was carefully written.", consequence: 'Models, tools and plans changed several times since then, and the article knew nothing about their client contracts.', quality: 'poor' },
          ],
          hints: [
            'Whose tasks and whose constraints does each option test?',
            'The tools change faster than most articles are updated.',
            'The best option includes a date to look again.',
          ],
          explanation: 'A small test on your own tasks, under your own contracts, gives evidence that outlives hype, and a recheck date keeps it honest as tools change.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-09-match-1',
          kind: 'match',
          title: 'What should decide it?',
          prompt: 'Match each situation to the factor that should drive the decision.',
          concept: 'tool selection factors',
          labels: { terms: 'Situation', meanings: 'Deciding factor' },
          pairs: [
            { term: 'You must analyse a 400-page PDF spec together with six screenshots in one request.', definition: 'Input size and type: long context and mixed inputs' },
            { term: 'The model name you hard-coded is deprecated and requests are being rerouted to a newer one.', definition: 'Change tolerance: keep model names in configuration and re-run your tests' },
            { term: 'The repositories belong to a client whose contract limits which AI services may see the code.', definition: 'Account type and data terms' },
            { term: 'Free-tier results look excellent, but the app will soon handle real customer messages.', definition: 'Tier and data use: the free tier may use content to improve products' },
          ],
          hints: [
            'Each situation highlights one constraint: size, change, contract or data use.',
            'A deprecation is about how easily you can swap a name.',
            'Real customer data changes which tier you may use.',
          ],
          explanation: 'Good tool choices follow the constraint that bites: input size, how often things change, contracts, and what the tier does with your data.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-09-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Three questions before you pick a tool',
          prompt: 'Tap each question and read what it protects you from.',
          concept: 'choosing a tool',
          cards: [
            { front: 'What am I allowed to share?', back: 'Your own project and public material are usually fine. Client code, customer data and keys need their own rules and the right account.' },
            { front: 'What is the task?', back: 'A question, a page from a picture, a long file, or edits inside a project folder each point to a different door.' },
            { front: 'Can I check what it gives me?', back: 'If you can run it and compare with an example you worked out, you can use almost any tool safely. If you cannot check it, slow down.' },
          ],
          hints: ['Say your own answer to each question first.', 'Tap all three cards.'],
          explanation: 'Sharing rules, the kind of task and your ability to check the result decide most beginner tool choices before any comparison.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'Gemini fits very large inputs, mixed text, image, audio, video and PDF input, description-to-app building and Google-ecosystem work.',
          'Plan for churn: tools, plans and model names changed in 2026, and the free tier trades privacy for access.',
          'Decide with a small test of your own tasks and acceptance examples, and recheck later.',
          'Keep rules, prompts and tests portable and keep model names in configuration.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-09-q1',
        prompt: 'Which pairing is a strength that Google documents for its Gemini 4 models?',
        choices: ['Text-only input with a very small context window for speed', 'A free tier that includes every model, with no data use', 'Audio input only, with images handled by a separate service', 'A one-million-token context window and text, image, audio, video and PDF input'],
        answer: 3,
        explanation: 'The models page lists a 1M-token window and those input types for Gemini 4 Carbon, Argon and Hydrogen. The free tier does not include every model.',
      },
      {
        id: 'ai-dev-gemini-09-q2',
        prompt: 'Google says Gemini 2.5 Pro and Flash are deprecated and will be rerouted to newer models. What practice makes this a small change?',
        choices: ["Never upgrade a model, so that behaviour stays exactly the same forever and nothing ever has to be checked again after that", "Copy the model name into every file so that it is easy to find with a search when the time comes to change it somewhere", "Keep model names in one configuration value and run tests that verify behaviour after a change", "Ask the model itself which version to use each time you run the program, and follow whatever it replies with that time"],
        answer: 2,
        explanation: 'A single configuration point plus tests means a deprecation is a one-line change that you can verify.',
      },
      {
        id: 'ai-dev-gemini-09-q3',
        prompt: 'What is the most reliable way to choose between two AI coding tools for your own work?',
        choices: ["Read the most recent ranking article and follow its order, since the authors have already compared every tool for all of its readers", "Run the same real tasks with acceptance examples in both and compare results, review time and data terms", "Choose whichever tool's maker is the largest company, because large companies keep their products supported for a longer time", "Pick the one with the longest feature list on its website, because more features always means more value for you and your team"],
        answer: 1,
        explanation: 'A small test on your own tasks reflects your constraints and today\'s versions, while rankings reflect someone else\'s.',
      },
      {
        id: 'ai-dev-gemini-09-q4',
        audience: { max: 'beginner' },
        prompt: 'You are new to AI tools. What is the best way to start choosing one?',
        choices: ["Subscribe to every plan from every company and compare them all in the first week, before you build anything with any of them", "Wait until one tool is clearly perfect for everything, and do not start building until the day that it finally appears to you", "Choose the tool your friends use, then never look at any other tool or any update from the company again after that point", "Pick one good-enough tool, learn its habits with small steps and checking, and compare later"],
        answer: 3,
        explanation: 'Skill in giving clear instructions and checking results carries across tools, so starting with one and learning it well beats hunting for a perfect choice.',
      },
      {
        id: 'ai-dev-gemini-09-q5',
        audience: { min: 'advanced' },
        prompt: 'You run a bake-off of AI coding tools on ten backlog tasks. Which set of measures best supports a decision?',
        choices: ["Pass rate on pre-written acceptance tests, corrections per task, review time, cost per accepted change and policy fit", "Which tool produced the longest code and the friendliest explanations across all of the ten tasks that you tried with it today", "How fast each tool answered the first message, measured only once on a quiet afternoon with a good connection to the internet", "Which tool the team preferred in a vote that was held right after everyone had watched one short demonstration of each tool"],
        answer: 0,
        explanation: 'Pre-written tests make the comparison objective, and the other measures capture the real cost of using the output and whether the tool is allowed on your data.',
      },
    ],
    task: {
      title: 'A tiny bake-off',
      minutes: 15,
      steps: [
        'Pick one small task from your own work (a function, a page from a screenshot, a bug) and write three acceptance examples for it.',
        'Run it in Gemini (AI Studio or the app) and in one other tool you have access to, using the same words.',
        'For each tool record: passed your examples or not, number of corrections, minutes spent reviewing, and anything about data or account rules that would stop you using it for real work.',
        'Write three sentences: when you would reach for Gemini, when you would reach for the other tool, and the date after which you will test again.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask each tool to explain its own answer in plain words and note which explanation you understood better. Write down one question you asked that neither tool could check for you.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Extend the bake-off to five tasks with automated acceptance tests, record cost per accepted change, and store the results and the decision date in your repository so the decision can be re-run.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: 'ai-dev-gemini-10',
    day: 10,
    title: 'Project: build and fix an app with Gemini',
    summary: 'Run the whole Gemini workflow on a small app: build it, break it on purpose, fix it with a test, check it for safety, and write the workflow down with a comparison to one other tool.',
    minutes: 25,
    skills: ['gemini-workflow'],
    intro: {
      objectives: [
        'Plan and run the full loop: brief, build, test, change, break, fix and review',
        'Write a workflow note another person could follow, with your prompts, rules and checklist',
        'Compare Gemini with one other tool using evidence from your own run',
      ],
      why: 'A workflow you can hand to someone else is proof that you can direct an AI tool, not just watch it. The note you write here is what a client, a teammate or a future you will actually use.',
    },
    body: [
      {
        type: 'paragraph',
        text: "This lesson prepares you for the course project. The goal is a small working app, built with Gemini, that you deliberately break and then fix with a test, plus a short written workflow and a comparison with one other AI tool. Everything you need comes from the previous lessons: the door you chose in lesson 1, the key habits of lesson 2, the prompt shape of lesson 3, screenshots and long files from lesson 4, Build mode from lesson 5, the bug report from lesson 6, the context file and approval ideas from lesson 7, the safety checks of lesson 8 and the bake-off of lesson 9.",
      },
      { type: 'heading', text: 'The loop you will run' },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The project loop',
        source: `flowchart TD
  A[Brief and acceptance examples] --> B[Build version one in AI Studio]
  B --> C[Test with your own examples]
  C --> D[Add one feature in small steps]
  D --> E[Break it on purpose]
  E --> F[Bug report, failing test, fix, proof]
  F --> G[Review and key and data checks]
  G --> H[Write the workflow note and the comparison]`,
      },
      {
        type: 'paragraph',
        text: "Choose a small app you care about. Barkada Split is a fine choice; so are a tip calculator for a delivery rider, a price list for a sari-sari store, or a study timetable. Keep version one to one screen and one rule, so that you can check every result by hand. Breaking the app on purpose is not mischief: it is the fastest way to prove that your bug report, your test and your review habits actually catch something.",
      },
      { type: 'heading', text: 'What goes in the workflow note' },
      {
        type: 'table',
        headers: ['Section', 'What it contains', 'Why it earns its place'],
        rows: [
          ['The door and why', 'Which Gemini surface you used for each step, and what you ruled out', 'Shows you chose, not drifted'],
          ['Prompts that worked', 'The brief, the bug report and one screenshot or long-file prompt, copied as you used them', 'A prompt that worked is a tool; one lost in chat history is not'],
          ['Rules file', 'Your GEMINI.md or system instructions, with a line about why each rule exists', 'Others can reproduce your set-up in minutes'],
          ['Review checklist', 'The checks you ran on the generated code and what each found', 'Evidence that you reviewed, not just accepted'],
          ['Key and data habit', 'Where your key lives, what you never paste, and your leak-response steps', 'The part clients and employers ask about first'],
          ['Comparison note', 'One other tool on the same task: results, corrections, review time, data terms, and when you would use each', 'Shows judgement, with evidence and a date'],
        ],
        caption: 'The sections of your workflow note',
      },
      {
        type: 'paragraph',
        text: "For the comparison note, be fair and modest. Run the same task, with the same words and the same acceptance examples, in the other tool; record what each did and what you had to fix; and write down which account type and data terms applied. You have tested one small app, so say that your result is a sample and not a ruling, put the date on it and name the tool versions or plans, because both change. The course Choosing the Right AI Coding Tool gives the full method, and your note should link what you saw to its questions.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "This project can be small and still be real. A one-page app with one rule counts. Do each step with the help of Gemini: ask it to explain the code it wrote in plain words, ask it what each line of your rules file does, and ask it to quiz you on your own checklist. For the comparison, the other tool can simply be another chat assistant. The important part is that you wrote the examples first, you ran what the tools produced, and you can say in your own words what you learned. Your workflow note is a checklist for your next project, written by you.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Make the workflow reproducible and measurable. Keep the note, the prompts, the rules file and the tests in the repository, run the checks in CI (tests, a secret scan, a dependency diff), and record numbers rather than impressions: corrections per task, minutes to an accepted change, defects the review caught that the tests did not. Where you use an agent, show the evidence of control: the approval mode, what ran unasked, the diff you reviewed and what you reverted. Treat the comparison as a dated experiment with a rerun date, and state the threats to its validity: one app, one author, tool versions that will move.",
      },
      {
        type: 'version',
        text: "Checked 2026-11-14. AI Studio's Build mode, its model list, the Gemini CLI and Code Assist status and the plan names all changed during 2026 and will change again. Before you start the project, reopen the pages cited in lessons 1, 2 and 5 (the Build mode docs, the API key guide and the models page) and use what they say on the day, not what this course says. Note the date and the model you used in your workflow note so that a reader knows which version your results describe.",
        checked: CHECKED,
        sources: [DOCS.buildMode, DOCS.apiKey, DOCS.models, DOCS.cliReadme],
      },
      {
        type: 'toolComparison',
        tools: ['gemini', 'chatgpt', 'claude', 'cursor'],
        caption: 'Candidates for your comparison note (shared tool data, checked 2026-11-14)',
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-10-arrange-1',
          kind: 'arrange',
          title: 'Order the project',
          prompt: 'Put the steps of the project in an order that protects you from avoidable mistakes.',
          concept: 'project workflow',
          language: 'text',
          solution: [
            'Write the brief and three acceptance examples',
            'Build version one in AI Studio and test it with your examples',
            'Add one feature in a small step and read the code that changed',
            'Break the app on purpose and write a bug report',
            'Get a failing test, then the fix, and run both yourself',
            'Review the code and check keys and data',
            'Write the workflow note and the comparison with one other tool',
          ],
          reasons: [
            'The examples define what correct means before any tool is used.',
            'Version one is checked against those examples, not against a feeling.',
            'Small steps with reading keep you in control of what changes.',
            'The bug report practises the evidence habit on a bug you caused.',
            'A failing test, then a fix, then your own run is the proof loop.',
            'Review and key checks come before you call the app done.',
            'The note records what you actually did and learned, so it comes last.',
          ],
          hints: [
            'Examples come before anything is built.',
            'You can only report a bug after you have made one.',
            'The writing comes after the work it describes.',
          ],
          explanation: 'Define correct first, build and test, change in small steps, break on purpose, prove the fix, review, then document. Each step feeds the next and the note describes real evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-dev-gemini-10-scenario-1',
          kind: 'scenario',
          title: 'Writing an honest comparison',
          prompt: 'Pick the best way to write the comparison note.',
          concept: 'fair tool comparison',
          situation: "You built your app with Gemini and tried the same task once in another assistant. Gemini needed two corrections and the other tool needed four, but you used a slightly different prompt for it, and you only tried one task.",
          options: [
            { text: 'Rerun the other tool with exactly the same prompt and examples, record both results with the date and versions, and say plainly that one small task is a sample, not a ruling.', consequence: 'Best. The comparison is fair, dated and honest about its limits, which is what makes it useful.', quality: 'best' },
            { text: 'Write that Gemini is better, citing the two versus four corrections.', consequence: 'The prompts differed and the sample is one task, so the numbers do not support a general claim.', quality: 'poor' },
            { text: 'Say the tools are the same, since one task proves nothing.', consequence: 'Modest, but it throws away real evidence. The honest move is to report the result with its limits.', quality: 'acceptable' },
          ],
          hints: [
            'What was different between the two runs besides the tool?',
            'A good note reports evidence and its limits.',
            'One option fixes the unfairness before writing anything.',
          ],
          explanation: 'Fairness means the same prompt and examples. Honesty means reporting the result, the date and the limits of a one-task sample.',
        },
      },
      {
        type: 'takeaways',
        items: [
          'The project proves the whole loop: brief, build, test, change, break, fix, review and document.',
          'Breaking your app on purpose is how you prove that your bug report, test and review actually work.',
          'A workflow note holds the prompts, the rules file, the checklist, the key habit and a dated comparison.',
          'A fair comparison uses the same prompt and examples, and admits that one small task is a sample.',
        ],
      },
    ],
    quiz: [
      {
        id: 'ai-dev-gemini-10-q1',
        prompt: 'Why break your own app on purpose in the project?',
        choices: ["To make the app look more complicated, which impresses a reviewer who only looks at how long and how tangled the code is", "Because Gemini refuses to fix anything that was never broken, so that a fault has to be created before it is able to help", "To check that your bug report, failing test and review habits catch a real fault", "To use up the free quota before the end of the month, so that the allowance resets at exactly the right time for you"],
        answer: 2,
        explanation: 'A bug you know about lets you check the whole fix loop: the report, the failing test, the fix and your own run.',
      },
      {
        id: 'ai-dev-gemini-10-q2',
        prompt: 'Which item does not belong in a workflow note?',
        choices: ['The prompt you used for the bug report', 'Your real API key, so that a reader can reproduce your run', 'Your rules file and the reason for each rule'],
        answer: 1,
        explanation: 'A note can describe where the key lives and how you protect it, but never contains the key. Anyone who reads the note would get your allowance.',
      },
      {
        id: 'ai-dev-gemini-10-q3',
        prompt: 'What makes a comparison between two tools fair?',
        choices: ["The same task, words and acceptance examples in both, with the date and versions recorded", "A different prompt in each tool, so that each one is shown at its best on the task that you have decided to give it", "Trying each tool for a different number of minutes, so that the one that is faster gets the shorter turn of the two", "Asking each tool which of the two is better, and believing the answer that each one happens to give about itself"],
        answer: 0,
        explanation: 'Only the tool should differ. Recording the date and versions lets a reader see which products the result describes.',
      },
      {
        id: 'ai-dev-gemini-10-q4',
        audience: { max: 'beginner' },
        prompt: 'You are new to coding. Which project size is right for this course?',
        choices: ["A big app with logins, payments and a database, because a large project looks more impressive to anyone who reviews it later", "No app at all, only a written opinion about Gemini, because opinions are easier to check than a running page on a phone", "An app copied from a gallery with nothing changed, so that there is no chance of a mistake that you would have to explain", "A one-page app with one rule, built and checked step by step while Gemini explains each part"],
        answer: 3,
        explanation: 'A small app you can check by hand teaches the whole loop. Size is not what the reviewer looks for; evidence that you directed, checked and fixed is.',
      },
      {
        id: 'ai-dev-gemini-10-q5',
        audience: { min: 'advanced' },
        prompt: 'You present your comparison of two tools to your team lead. Which statement of its limits is the most credible?',
        choices: ["We tried each tool once, so the result is final and can be used to decide for every future project that the team starts", "One app, one author and moving versions: treat it as a dated sample and rerun it with more tasks", "The newer tool is always better, so no limits need to be stated anywhere in the note, since the answer is already clear", "Limits are unnecessary when the numbers are recorded, because numbers speak for themselves in every case and for every reader"],
        answer: 1,
        explanation: 'Naming the sample size, the single author and the moving versions, and proposing a rerun, shows you understand what the evidence can and cannot support.',
      },
    ],
    task: {
      title: 'Plan your project before you start',
      minutes: 15,
      steps: [
        'Choose your app and write the brief in five lines: who it is for, the one screen, the one rule, three acceptance examples and what you will not build.',
        'Decide your comparison tool and write down which task you will run in both.',
        'Draft the headings of your workflow note from the table in this lesson, with one line under each saying what you expect to put there.',
        'Write down the date and the Gemini model you will use, and open the pages cited in this lesson to confirm that the steps still match what you see.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: [
          "Ask Gemini to turn your five-line brief into a numbered to-do list with a checkbox for each step, in plain words, and to explain any step you do not understand.",
        ],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          "Define the metrics you will collect (corrections per task, minutes to an accepted change, defects caught by review but not by tests) and the repository layout where the note, prompts, rules and tests will live.",
        ],
      },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-dev-gemini-p1',
    title: 'Your Gemini key and data safety kit',
    summary: 'Write the safety kit you will use whenever you work with Gemini: what you never paste, which door you use for which work, your review checklist and your key-leak response, then test one part of it for real.',
    outcome: 'A short document that shows a client or employer you handle keys, data and generated code responsibly, with evidence that you tested it.',
    unlockAfterDay: 8,
    steps: [
      { id: 'ai-dev-gemini-p1-s1', text: 'List what you will never paste into Gemini (keys, `.env` contents, customer data, client code you may not share) and which Gemini door you will use for each kind of work, with a sentence from the official pages explaining why.', link: 'https://support.google.com/gemini/answer/13594961' },
      { id: 'ai-dev-gemini-p1-s2', text: 'Write your five-point review checklist for generated code (examples, names, secrets, trusted input, surprise additions) and run it on one small piece of code that Gemini wrote for you. Record what it found.' },
      { id: 'ai-dev-gemini-p1-s3', text: 'Write your key-leak response as numbered steps in your own words, following the order in Google\'s API key guide, and say where each step is done (AI Studio, your hosting, your repository).', link: 'https://aistudio.google.com/docs/api-key' },
      { id: 'ai-dev-gemini-p1-s4', text: 'Test one thing for real: make a fake `.env` with a made-up key, show that your `.gitignore` keeps it out of a commit, and show where your real key lives instead (an environment variable or a secrets panel).' },
      { id: 'ai-dev-gemini-p1-s5', audience: { max: 'beginner' }, text: 'Scaffold for newcomers: ask Gemini to explain each item of your kit in plain words and to test you with three questions. Write one sentence in your own words for each of the words key, secret, repository and diff.' },
      { id: 'ai-dev-gemini-p1-s6', audience: { min: 'intermediate', max: 'intermediate' }, text: 'Add a real guard to a project you own: a pre-commit check or CI step that fails when a key-like string appears, and show it failing on your fake key.' },
      { id: 'ai-dev-gemini-p1-s7', audience: { min: 'advanced' }, text: 'Add a team-level policy: a table mapping data classes (public code, internal code, customer data, credentials) to the Gemini doors and account types allowed for each, how it is enforced, and who approves exceptions.' },
      { id: 'ai-dev-gemini-p1-s8', audience: { min: 'professional' }, text: 'Add the audit evidence: the approval mode and policy rules you use for any agent, a record of one prompt-injection test you ran, and the log or screenshot proving what the agent could and could not do unasked.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your safety kit',
      placeholder: 'Paste your kit: never-paste list and doors, review checklist and its result, leak-response steps, and the test you ran.',
      hint: 'A reviewer should find: the never-paste list with reasons, the door for each kind of work, the checklist applied to real code, ordered leak-response steps, and evidence that you tested the .gitignore or guard. Never paste a real key.',
    },
    rubric: [
      'The never-paste list and the door mapping are specific and justified by what the official pages say about data handling.',
      'The review checklist was applied to real generated code, with at least one concrete finding or confirmation recorded.',
      'The key-leak steps are in a safe order (replace, deploy, disable the old key, check usage) and name where each is done.',
      'A real test is shown (a secret file kept out of a commit, and the real key kept in the environment), and no real secret appears anywhere.',
    ],
    rubricExtra: [
      {
        audience: { max: 'beginner' },
        items: ['The learner explains key, secret, repository and diff in their own words.'],
      },
      {
        audience: { min: 'intermediate', max: 'intermediate' },
        items: ['A working pre-commit or CI guard is shown catching a fake key.'],
      },
      {
        audience: { min: 'advanced' },
        items: [
          'A data-class to door and account-type table exists, with enforcement and an exception owner.',
          'Supply chain risk (new packages in generated diffs) is covered in the review checklist.',
        ],
      },
      {
        audience: { min: 'professional' },
        items: ['Audit evidence shows the approval mode, deny rules and the result of a prompt-injection test.'],
      },
    ],
  },
  {
    id: 'ai-dev-gemini-p2',
    title: 'Build and fix an app with Gemini',
    summary: 'Build a small app in Google AI Studio, add a feature in small steps, break it on purpose and fix it with a bug report and a test, then document your workflow and compare Gemini with one other tool.',
    outcome: 'A working app, a fix you can prove, and a workflow note with a dated comparison: evidence that you can direct an AI tool, check its work and explain your choices.',
    unlockAfterDay: 9,
    steps: [
      { id: 'ai-dev-gemini-p2-s1', text: 'Write the brief and three acceptance examples for a small one-screen app (Barkada Split or your own idea). Say what you will not build yet.' },
      { id: 'ai-dev-gemini-p2-s2', text: 'Write a rules file or system instructions (stack, formats, what never to touch, how to prove a change) and save it in the project.', link: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md' },
      { id: 'ai-dev-gemini-p2-s3', text: 'Build version one in AI Studio Build mode from your brief. Test it with your examples and one strange input, and read the code that does the main calculation.', link: 'https://aistudio.google.com/docs/aistudio-build-mode' },
      { id: 'ai-dev-gemini-p2-s4', text: 'Add one feature in small steps (for example, show the leftover centavo, or restyle the page from a screenshot with a description-first prompt). Crop any private details from images first.' },
      { id: 'ai-dev-gemini-p2-s5', text: 'Break the app on purpose, write a bug report with the code, the output, the expectation and your versions, get a failing test first, apply the fix and run both yourself.' },
      { id: 'ai-dev-gemini-p2-s6', text: 'Run your review checklist and key check: show where any key lives and confirm that nothing secret is in the repository, a prompt or a screenshot.' },
      { id: 'ai-dev-gemini-p2-s7', text: 'Write the workflow note (door and why, prompts that worked, rules file, review checklist, key and data habit) and a dated comparison with one other tool on the same task, referring to the questions in Choosing the Right AI Coding Tool.' },
      { id: 'ai-dev-gemini-p2-s8', audience: { max: 'beginner' }, text: 'Scaffold for newcomers: keep the app to one screen and one rule. Ask Gemini to explain the generated code in plain words, then write three sentences in your own words about what the main function does. The other tool for the comparison can be a chat assistant.' },
      { id: 'ai-dev-gemini-p2-s9', audience: { min: 'intermediate', max: 'intermediate' }, text: 'Add a real integration: store past bills in a database (for example Firebase through Build), or have a server route call Gemini to explain a split, with the key kept server-side. Test the failure case where the call fails.' },
      { id: 'ai-dev-gemini-p2-s10', audience: { min: 'advanced' }, text: 'Sync the project to GitHub, add tests and a CI run with a secret scan, review every server route for authentication and limits, and measure corrections per task and review time in your comparison.' },
      { id: 'ai-dev-gemini-p2-s11', audience: { min: 'professional' }, text: 'Run part of the work with a terminal or editor agent under a stated approval mode and policy, and include the review evidence: the diff you reviewed, what you reverted, what ran unasked and the metrics, as a dated experiment with a rerun date.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository or app link',
      placeholder: 'https://github.com/your-name/barkada-split',
      hint: 'A link to a repository (or the published app plus a document) containing the app, the rules file, the bug report and test, and a WORKFLOW note with the comparison. No secrets anywhere.',
    },
    rubric: [
      'The app runs and gives the answers in the learner\'s acceptance examples, including at least one strange input.',
      'A deliberate bug was introduced and fixed, shown by a bug report, a failing test and a passing run.',
      'No secrets appear in the repository, prompts, screenshots or workflow note, and the key lives in an environment variable or secrets panel.',
      'The workflow note contains the prompts, the rules file, the review checklist and the key and data habit, in the learner\'s own words.',
      'The comparison note uses the same task and examples in both tools, is dated, names the versions or plans, and states its limits honestly.',
    ],
    rubricExtra: [
      {
        audience: { max: 'beginner' },
        items: ['The learner explains in plain language what the main function does and why the fix worked.'],
      },
      {
        audience: { min: 'intermediate', max: 'intermediate' },
        items: ['The app uses a database or a server-side Gemini call, with the key kept server-side and the failure case tested.'],
      },
      {
        audience: { min: 'advanced' },
        items: [
          'Tests and CI (including a secret scan) run on the repository, and server routes are reviewed for authentication and limits.',
          'The comparison includes measured numbers such as corrections per task and review time.',
        ],
      },
      {
        audience: { min: 'professional' },
        items: ['The workflow shows agent control evidence: approval mode, policy, reviewed diff, reverted changes and a rerun date for the comparison.'],
      },
    ],
  },
];


export const aiDevGeminiCourse: Course = {
  id: 'ai-dev-gemini',
  kind: 'standard',
  title: 'Gemini for Software Development',
  level: 'beginner',
  tagline: 'Use Google Gemini to build and fix small apps, and know which Gemini tool fits the job.',
  description:
    "Learn Google Gemini as a software-building assistant: the Gemini app, Google AI Studio, the API, and the terminal and editor tools as Google describes them today. You prompt for code, feed it long files and screenshots, build and debug a small app, and keep your keys and data safe.",
  finishLine: [
    'A working small app built with Gemini and fixed after you broke it on purpose',
    'A safe API key habit and a data checklist for what you paste into Gemini',
    'A reusable GEMINI.md context file and a set of prompts for code, long files and screenshots',
    'A written workflow comparing Gemini with one other AI coding tool',
  ],
  objectives: [
    'Choose the right Gemini surface for a task: the app, AI Studio, the API or a terminal agent',
    'Write coding prompts that fix the goal, context, constraints and an example',
    'Build a small app in AI Studio and review the code it generates',
    'Debug and refactor with Gemini using error text, tests and small diffs',
    'Keep API keys and private data out of prompts, screenshots and repositories',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'builder'],
  skills: [
    { id: 'gemini-surfaces', label: 'Gemini surfaces' },
    { id: 'ai-studio-setup', label: 'AI Studio and API keys' },
    { id: 'gemini-prompting', label: 'Prompting Gemini for code' },
    { id: 'multimodal-input', label: 'Long files and screenshots' },
    { id: 'gemini-app-building', label: 'Building with Gemini' },
    { id: 'gemini-debugging', label: 'Debug and refactor' },
    { id: 'gemini-cli', label: 'Terminal and editor tools' },
    { id: 'gemini-safety', label: 'Review, safety and privacy' },
    { id: 'tool-choice', label: 'Choosing a tool' },
    { id: 'gemini-workflow', label: 'Your Gemini workflow' },
  ],
  lessons,
  projects,
  icon: 'auto_awesome',
  updated: '2026-11-14',
};
