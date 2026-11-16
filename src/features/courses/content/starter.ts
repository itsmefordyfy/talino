import type { Course } from './types';

const CHECKED = '2026-11-14';

const SRC = {
  glossary: { label: 'Claude docs: Glossary (tokens, context window, temperature, RAG)', url: 'https://platform.claude.com/docs/en/about-claude/glossary' },
  prompting: { label: 'Claude docs: Prompting best practices', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices' },
  owaspLlm01: { label: 'OWASP GenAI: LLM01 Prompt Injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
  owaspLlm09: { label: 'OWASP GenAI: LLM09 Misinformation', url: 'https://genai.owasp.org/llmrisk/llm092025-misinformation/' },
  pushProtection: { label: 'GitHub Docs: About push protection', url: 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection' },
  claudeMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  agentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  mcp: { label: 'Model Context Protocol: What is MCP?', url: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
  claudePermissions: { label: 'Claude Code docs: Configure permissions', url: 'https://code.claude.com/docs/en/permissions' },
};

export const starterCourse: Course = {
  id: 'starter',
  kind: 'starter',
  level: 'beginner',
  title: 'AI Basics for Tech',
  tagline: 'Seven short days to use AI well, safely and with your own judgement.',
  description:
    'Start here, whatever your background. In seven 15-minute lessons you learn what AI assistants really are, how to prompt them, how to check what they give you and how to use them safely at work or school. On the last day you pick the career path that fits you.',
  finishLine: [
    'You can explain what an AI assistant can and cannot do, in plain words.',
    'You write clear prompts with context, a role, examples and limits, and you improve them step by step.',
    'You check AI output before you use it, and you know what never to paste into a tool.',
    'You have a first small piece of real work made with AI, with your own changes on top.',
    'You know which Talino career course to take next.',
  ],
  audiences: ['fresh-grad', 'experienced-dev', 'career-changer', 'educator', 'builder'],
  skills: [
    { id: 'ai-fundamentals', label: 'How AI works' },
    { id: 'prompting', label: 'Prompting' },
    { id: 'verification', label: 'Checking AI output' },
    { id: 'responsible-ai', label: 'Safe and honest AI use' },
    { id: 'ai-workflow', label: 'AI in daily work' },
    { id: 'career-direction', label: 'Career direction' },
  ],
  lessons: [
    {
      id: 'starter-01',
      day: 1,
      title: 'What AI assistants are (and aren\'t)',
      summary: 'A plain explanation of how AI models work, what they are good at and where they fail.',
      intro: { objectives: ['Explain in plain words how a language model writes an answer.', 'Name what an AI assistant is good at and four limits it has.', 'Spot why a confident answer can still be wrong.'], why: 'Everything else in this course builds on a clear picture of what AI really is, so you trust it where it helps and double-check it where it can fail, whatever your job or school.' },
      minutes: 15,
      skills: ['ai-fundamentals', 'verification'],
      body: [
        {
          type: 'paragraph',
          text: 'Welcome to Talino. Before you use AI for real work, it helps to know what is actually happening when you type a question and an answer appears. You don\'t need math for this. You need a good mental picture.',
        },
        { type: 'heading', text: 'A model predicts text' },
        {
          type: 'paragraph',
          text: 'An AI assistant such as ChatGPT, Gemini or Claude runs on a **large language model**. The model was trained on a huge amount of text and code. From that training it learned patterns: which words, sentences and code usually follow others. When you ask a question, it writes an answer one small piece at a time, each time picking a likely next piece.',
        },
        {
          type: 'paragraph',
          text: 'That simple idea explains a lot. It is why AI writes fluent English, translates well and can produce working code for common tasks. It is also why it can sound confident while being wrong. The model is producing likely-sounding text, not looking facts up in a trusted database.',
        },
        {
          type: 'visual',
          id: 'ai-model-input-output',
          caption: 'A simplified illustration: the model scores likely next pieces of text, picks one, and the answer grows.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "In everyday words: a *language model* is a computer program (a set of instructions a computer follows) that has read a very large amount of writing and learned which words tend to follow which. That reading phase is called *training*, and it is finished before you type anything. When you chat, the program does not look anything up. It works like the autocomplete on your phone, except that it has learned from far more text, so it can continue a whole email or a whole program, not just one word. The small pieces it writes one at a time are called *tokens*: a token can be a short word, part of a longer word or a punctuation mark. A *prompt* is whatever you type to start. No maths is needed: if you can picture very good autocomplete, you have the main idea.",
        },
        { type: 'heading', text: 'What assistants are good at' },
        {
          type: 'list',
          items: [
            'Drafting: emails, outlines, reports, lesson plans, first versions of code.',
            'Explaining: a concept, an error message, a piece of code you don\'t understand.',
            'Transforming: summarising, rewriting for a different reader, turning notes into a table.',
            'Brainstorming: ideas, names, test cases, questions you forgot to ask.',
          ],
        },
        { type: 'heading', text: 'What they are not' },
        {
          type: 'list',
          items: [
            '**Not a search engine.** Some assistants can search the web, but the model itself may invent sources, numbers or quotes.',
            '**Not always up to date.** Its training stops at a certain point, so recent changes may be missing.',
            '**Not a person who knows you.** It only knows what is in the conversation, unless the tool has a memory feature you turned on.',
            '**Not accountable.** If the answer is wrong, you are the one who used it.',
          ],
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "Why does this matter in practice? Imagine a friend who has read thousands of cookbooks but has never been in your kitchen. You ask why your adobo turned out too sour. They can give you likely reasons, quickly and politely, but they cannot taste your pot. An AI assistant is the same: its answers are likely explanations, not facts it has checked. So use it for a first draft or a list of ideas, then check the parts that matter. You do not need to know how to code to benefit from this: the same idea holds for emails, study notes and, in later days, even building a small website.",
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "Engineers meet the same facts as design constraints. Output is sampled, so one prompt can return different text each time; even at temperature 0 an API's results are not fully deterministic. A feature that depends on exact wording therefore needs tests on properties (a field exists, a number is in range), not on exact strings. The model reasons only over what sits in its context window, its fixed working memory, so whatever it must know (your schema, your conventions, today's date) has to be supplied or retrieved; retrieval-augmented generation feeds trusted documents in beside the question. Treat a reply as untrusted input from a component that can be wrong: validate it before parsing, authorise before acting on it, and log what went in and out. Accountability does not move to the model: it stays with whoever merged the result.",
        },
        {
          type: 'version',
          audience: { min: 'advanced' },
          text: "Anthropic's glossary describes temperature as the setting that controls the randomness of a model's predictions, and says that even with temperature 0 results are not fully deterministic and identical inputs can give different outputs. It defines the context window as the text a model can look back on when generating, a kind of working memory distinct from its training data. It defines retrieval-augmented generation as passing documents retrieved at runtime into the context window along with the query. Other vendors' APIs may behave differently, so check the documentation of the model you use.",
          checked: CHECKED,
          sources: [SRC.glossary],
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-01-match-1',
            kind: 'match',
            title: 'Which limit bit them?',
            prompt: 'Each person below trusted an assistant and got burned. Match each moment with the limit of AI assistants behind it.',
            concept: 'limits of ai assistants',
            labels: { terms: 'What happened', meanings: 'The limit behind it' },
            pairs: [
              {
                term: 'Lea asks for three studies that support her thesis claim. The assistant lists titles and authors she cannot find anywhere.',
                definition: 'Not a search engine',
              },
              {
                term: 'Marco asks what changed in a tool he uses, and the answer describes an older version as if it were the newest.',
                definition: 'Not always up to date',
              },
              {
                term: 'In a brand-new chat, Joy types "improve my resume" and gets generic advice for a job she is not applying for.',
                definition: 'Not a person who knows you',
              },
              {
                term: 'Ben sends a client an AI-drafted quote with a wrong total, and the client holds him to that price.',
                definition: 'Not accountable',
              },
            ],
            hints: [
              'For each moment, ask what the assistant could not do: look things up, know recent news, know the person, or take the blame.',
              'Sources that do not exist come from a model producing likely-sounding text, not from looking anything up.',
              'A new chat starts with only what you type into it; and when a wrong answer goes out under your name, the responsibility is yours.',
            ],
            explanation: 'Invented studies show the model is not a search engine, the old version shows its training stops at a point, the generic advice shows it knows only what is in the conversation, and the wrong quote shows that the person who used the answer is accountable.',
          },
        },
        {
          type: 'tip',
          text: 'Think of an AI assistant as a fast, well-read intern. Great at first drafts, needs clear instructions, and you always review the work before it goes out.',
        },
        {
          type: 'paragraph',
          text: 'Try it yourself. Paste the prompt below into any AI assistant you already use. Then read the answer with one question in mind: which parts would you need to check before trusting them?',
        },
        {
          type: 'prompt',
          label: 'See the limits for yourself',
          text: 'Explain in simple English how you, an AI language model, produce an answer. Then list three kinds of questions where your answers are often wrong, and tell me how I should double-check each kind.',
        },
        {
          type: 'warning',
          text: 'Never treat a confident tone as proof. A wrong answer and a right answer sound exactly the same.',
        },
        {
          type: 'takeaways',
          items: [
            'A language model writes by predicting likely next pieces of text, using patterns learned in training.',
            'That makes it fluent, and also able to sound confident while being wrong.',
            'It is strong at drafting, explaining, transforming text and brainstorming.',
            'It is not a search engine, not always up to date, does not know you and is not accountable: you are.',
            'A confident tone is never proof. Check what matters.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-01-q1',
          prompt: 'What is a language model mainly doing when it writes an answer?',
          choices: [
            'Looking the answer up in a verified database',
            'Predicting likely next pieces of text based on patterns it learned',
            'Copying a single web page that matches your question',
          ],
          answer: 1,
          explanation:
            'A language model generates text by predicting what is likely to come next. That is why it is fluent, and also why it can be wrong while sounding sure.',
        },
        {
          id: 'starter-01-q2',
          prompt: 'Which task is an AI assistant usually strong at?',
          choices: [
            'Guaranteeing that a legal fact is current',
            'Knowing your company\'s private rules without being told',
            'Turning messy meeting notes into a clear summary',
            'Taking responsibility for a wrong answer',
          ],
          answer: 2,
          explanation:
            'Transforming text you give it, like summarising notes, is a core strength. Current facts and private knowledge are not.',
        },
        {
          id: 'starter-01-q3',
          prompt: 'An assistant gives you a statistic with a source and sounds very sure. What should you do?',
          choices: [
            'Open the source and confirm the number is really there',
            'Use it, since it named a source',
            'Ask the assistant if it is sure, and trust its yes',
          ],
          answer: 0,
          explanation:
            'Models can invent sources and numbers. Only the real source confirms it, and asking the model again is not a check.',
        },
        {
          id: 'starter-01-q4',
          audience: { max: 'beginner' },
          prompt: "In everyday words, what is a \"token\" in an AI assistant?",
          choices: ["A password that lets you log in to the assistant", "A small piece of text, such as a short word, part of a word or a punctuation mark, that the model reads and writes", "One complete answer that the assistant gives you", "A coin you spend each time you start a new chat"],
          answer: 1,
          explanation: "The model writes its answer one small piece at a time, and those pieces are called tokens. They are not passwords, whole answers or payments.",
        },
        {
          id: 'starter-01-q5',
          audience: { min: 'advanced' },
          prompt: "A team ships a feature that asks an assistant for a one-line product description, and its test compares the reply to one exact sentence. The test fails on about one run in five, with no code change. What is the best fix?",
          choices: ["Set the temperature to 0 and keep the exact-string test, since that makes the output identical on every run", "Ask the assistant at the end of each run whether it repeated the same sentence as before", "Test properties of the reply (not empty, under a length limit, no banned words) and review wording changes by hand", "Add the previous reply to the prompt on every call so that the wording is locked"],
          answer: 2,
          explanation: "Sampling means wording varies, and temperature 0 does not make an API fully deterministic. Tests should check what must always be true of the output, not one exact string.",
        },
      ],
      task: {
        title: 'Find the edges',
        minutes: 10,
        steps: [
          'Open an AI assistant you can use (free versions are fine).',
          'Paste the "See the limits for yourself" prompt and read the answer.',
          'Ask it one question about something you know very well, like your course, your job or your hometown.',
          'Write down one thing it got right and one thing that was wrong, vague or missing.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Ask the assistant to explain, in words you would use with a friend, what a language model, training and a token are. Compare its answer with this lesson and write down one sentence it said that you want to check somewhere else.",
            "Ask it a question about your own street, school or workplace, which it cannot know. Notice whether it admits that or invents something, and write one line about what you saw.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Pick one place in your own work where an assistant's output feeds another system (a script, a ticket, a commit message). Write down what you would validate before that output is used, and which part of it you would never let it decide alone.",
            "Run the same prompt three times and diff the answers. List which parts of the reply varied and which tests you would write on properties instead of on exact text.",
          ],
        },
      ],
    },
    {
      id: 'starter-02',
      day: 2,
      title: 'Prompting well',
      summary: 'Give context, a role, examples and limits, then improve the answer step by step.',
      intro: { objectives: ['Write a prompt with context, a role, a task, examples and constraints.', 'Steer a close answer with follow-ups in the same chat instead of starting over.', 'Ask the assistant to interview you when you are unsure what it needs.'], why: 'Vague prompts give generic answers that you then have to fix. A prompt that says who you are, who will read the result and what you need saves you rounds of rewriting, in a job search, at work or at school.' },
      minutes: 15,
      skills: ['prompting'],
      body: [
        {
          type: 'paragraph',
          text: 'Most bad AI answers come from short, vague prompts. "Write a cover letter" gives you a generic letter. The assistant can\'t read your mind, so the quality of what you get depends on what you give.',
        },
        { type: 'heading', text: 'The five parts of a strong prompt' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Context:** who you are, what the situation is, who will read the result.',
            '**Role:** the expert you want it to act as, like "a senior recruiter" or "a patient Python tutor".',
            '**Task:** exactly what you want, with a clear verb: draft, explain, compare, list, fix.',
            '**Examples:** a sample of the style or format you like. One good example beats a paragraph of description.',
            '**Constraints:** length, tone, format, what to avoid, and what to do when it is unsure.',
          ],
        },
        {
          type: 'paragraph',
          text: 'You don\'t need all five every time. For a quick question, context and a clear task are enough. For anything you will actually use, include them all.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "The five parts are not a form to fill in. They are five questions you answer before you press send: who am I and what is this for (context), who should the AI act like (role), what exactly do I want (task), what does a good result look like (example), and what are the limits (constraints). A *prompt* is just the message you send. Below is a prompt a complete beginner could write to get a small website. Read it and notice that it needs no technical words: it names the shop, says what goes on the page and who will read it, and asks the assistant to explain how to open the result.",
        },
        {
          type: 'prompt',
          audience: { max: 'beginner' },
          label: 'A first prompt for a website, in plain words',
          text: "I run a small bakery called Aling Rosa's Bakeshop. Make a one-page website for it. It should have the shop name at the top, a short friendly welcome, and a menu with three items and prices in pesos: pandesal 5, ensaymada 25, cake slice 60. Use warm colours and big, easy-to-read text because many of my customers are older. Give me the whole thing as one file, and explain step by step how to open it on my laptop. If anything is unclear, ask me before you start.",
        },
        {
          type: 'paragraph',
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "You have built small projects, so write prompts the way you would write a ticket for a teammate. Paste the real error and the code around it, say which versions you use, and describe what you expected and what happened instead. Ask for one change at a time and run it before you ask for the next. If an answer would touch several files, ask for a plan first: rejecting a plan costs a minute, rejecting finished code costs an hour.",
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-02-match-1',
            kind: 'match',
            title: 'Spot the parts in a real prompt',
            prompt: 'These lines come from one prompt a job seeker wrote. Match each line with the part of a strong prompt it supplies.',
            concept: 'prompt structure',
            labels: { terms: 'Lines from a prompt', meanings: 'Part of the prompt' },
            pairs: [
              {
                term: 'I am a nurse moving into a healthcare account at a BPO. The reader is a hiring manager in Cebu.',
                definition: 'Context',
              },
              {
                term: 'Act as a career coach who has hired call-centre agents for ten years.',
                definition: 'Role',
              },
              {
                term: 'Draft three resume bullet points about handling patient calls.',
                definition: 'Task',
              },
              {
                term: 'Here is a bullet I like: "Answered patient questions by phone and logged every call the same day."',
                definition: 'Examples',
              },
              {
                term: 'Keep each bullet under 20 words, skip buzzwords, and tell me if anything I gave you is unclear.',
                definition: 'Constraints',
              },
            ],
            hints: [
              'Ask of each line: is it about me, about who the AI should be, what to do, a sample, or a limit?',
              'The line with a clear verb (draft) is the task; the line that starts "Act as" gives the AI a role.',
              'A sample of the style you want is an example; word limits and "tell me if unclear" are constraints.',
            ],
            explanation: 'Who you are and who reads it is context, "Act as" sets the role, the clear verb is the task, the sample bullet is an example, and the word limit, no buzzwords and "tell me if unclear" are constraints.',
          },
        },
        { type: 'heading', text: 'Before and after' },
        {
          type: 'paragraph',
          text: 'Weak: "Explain APIs." Stronger: the prompt below. Notice how it says who the reader is, how long the answer should be, and what format to use.',
        },
        {
          type: 'prompt',
          label: 'A complete prompt',
          text: 'You are a friendly IT instructor. I am a fresh graduate in the Philippines preparing for my first developer interview. Explain what an API is in under 150 words, using a GCash payment as the example. Then give me two interview questions about APIs with short model answers. Use simple English. If something depends on the company, say so instead of guessing.',
        },
        {
          type: 'prompt',
          audience: { min: 'advanced' },
          label: 'The same discipline, as a testable spec',
          text: "Context: a TypeScript Express service in this repo; tests run with `npm test`. Task: add `applyDiscount(totalCentavos: number, code: string): number` in `src/pricing.ts`. Acceptance criteria: (1) returns integer centavos; (2) an unknown code returns the total unchanged and does not throw; (3) never returns a negative number; (4) no new dependencies. Process: first list your assumptions and a test plan and wait for my OK; then write the tests, then the code. Output: a unified diff only. If a requirement is ambiguous, ask instead of guessing.",
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "Past a one-off chat, a prompt behaves like a specification, so write it like one. State acceptance criteria that a test could fail, keep the stable instructions apart from the changing input (tags or headings, so pasted text cannot be mistaken for instructions), give a few examples that cover edge cases, and ask for assumptions and a test plan before code. A prompt is also a dependency whose behaviour can shift when the model or the wording changes. Keep the ones that earn their place in version control next to the code, and re-run them on a small fixed set of inputs, with automated checks on the output, whenever either one changes. Reviewing the plan is cheaper than reviewing the diff.",
        },
        {
          type: 'version',
          audience: { min: 'advanced' },
          text: "Anthropic's prompting guide advises being specific about the output format and constraints, adding the context or reason behind an instruction, and including a few examples that are relevant, diverse (covering edge cases) and wrapped in tags so they are not mistaken for instructions; it also recommends separate tags for instructions, context and inputs when a prompt mixes them. It suggests testing a prompt by showing it to a colleague with little context. Other tools may prefer different formats, so check the documentation of the one you use.",
          checked: CHECKED,
          sources: [SRC.prompting],
        },
        {
          type: 'table',
          headers: ['Part', 'In the complete prompt above'],
          rows: [
            [
              'Context',
              'A fresh graduate in the Philippines preparing for a first developer interview.',
            ],
            ['Role', 'A friendly IT instructor.'],
            [
              'Task',
              'Explain what an API is, then give two interview questions with short model answers.',
            ],
            ['Examples', 'Asks for a concrete example inside the answer: a GCash payment.'],
            [
              'Constraints',
              'Under 150 words, simple English, and say so when something depends on the company instead of guessing.',
            ],
          ],
          caption: 'The five parts, found in the complete prompt above',
        },
        { type: 'heading', text: 'Iterate, don\'t restart' },
        {
          type: 'paragraph',
          text: 'Your first prompt is a draft too. Read the answer, then steer it: "Shorter." "Use a table." "That example is too technical for a non-IT reader." "You assumed I use Windows; I use a Mac." Each follow-up builds on the conversation, so you get closer with every turn.',
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-02-scenario-1',
            kind: 'scenario',
            title: 'Close, but not quite',
            prompt: 'Pick the best way to get from a close draft to the right one.',
            concept: 'prompt iteration',
            situation: 'You asked an assistant to draft a message to your team lead. The draft is good, but it asks for a whole day of leave and you only need Friday morning.',
            options: [
              {
                text: 'Start a new chat and type the whole prompt again with the correction.',
                consequence: 'It works, but you throw away the context already built in this chat and have to rebuild it.',
                quality: 'poor',
              },
              {
                text: 'Reply in the same chat: "I only need Friday morning. Change it and keep it under 80 words."',
                consequence: 'The assistant keeps the earlier context, so one short follow-up steers the draft to what you need.',
                quality: 'best',
              },
              {
                text: 'Copy the draft and fix the details by hand.',
                consequence: 'You get what you need, but you skip the quick steering that the same chat makes possible.',
                quality: 'acceptable',
              },
            ],
            hints: [
              'Think about what the chat already knows.',
              'A first prompt is a draft too.',
              'A short follow-up in the same conversation builds on everything said so far.',
            ],
            explanation: 'Iterating in the same conversation keeps the context, so a short follow-up gets you closer with every turn. Starting over throws that away.',
          },
        },
        {
          type: 'tip',
          text: 'Ask the assistant to ask you first. Adding "Before you answer, ask me up to three questions about anything unclear" often saves several rounds.',
        },
        {
          type: 'prompt',
          label: 'Let it interview you',
          text: 'I want help writing a short message to my team lead asking for one day of leave next week. Before you write anything, ask me up to three questions about what you need to know. Then write the message in a polite, professional tone, under 80 words.',
        },
        {
          type: 'warning',
          text: 'Long prompts are fine, but keep private details out of them. You will learn exactly what to leave out on Day 4.',
        },
        {
          type: 'takeaways',
          items: [
            'Short, vague prompts give generic answers. Quality depends on what you give.',
            'A strong prompt has context, a role, a task, examples and constraints; for a quick question, context and a task are enough.',
            'Your first prompt is a draft: steer with follow-ups in the same chat instead of restarting.',
            'Let the assistant interview you first when you are not sure what it needs to know.',
            'Keep private details out of long prompts.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-02-q1',
          prompt: 'Which prompt is likely to give the most useful answer?',
          choices: [
            '"Write a resume summary."',
            '"Write a good resume summary, please make it nice."',
            '"You are a recruiter. Write a 3-sentence resume summary for a fresh IT graduate applying for a junior QA role. Professional tone, no buzzwords."',
          ],
          answer: 2,
          explanation:
            'It gives a role, context, a clear task and constraints. Politeness and the word "good" add nothing the model can use.',
        },
        {
          id: 'starter-02-q2',
          prompt: 'Why does adding an example to your prompt help?',
          choices: [
            'It shows the exact style or format you want, which is hard to describe',
            'It makes the model search the internet',
            'It is required, or the model will refuse',
            'It makes the answer always correct',
          ],
          answer: 0,
          explanation:
            'An example demonstrates format and tone directly. It improves the fit of the answer, not its truth.',
        },
        {
          id: 'starter-02-q3',
          prompt: 'The answer is close but too long and too formal. What is the best next step?',
          choices: [
            'Start a new chat and type the same prompt again',
            'Reply in the same chat: "Make it half as long and more casual."',
            'Accept it, since AI answers can\'t be adjusted',
          ],
          answer: 1,
          explanation:
            'Iterating in the same conversation keeps the context, so a short follow-up steers the answer quickly.',
        },
        {
          id: 'starter-02-q4',
          prompt: 'What does the constraint "If you are unsure, say so instead of guessing" do?',
          choices: [
            'Guarantees there are no mistakes',
            'Makes the answer longer',
            'Turns off the model\'s training',
            'Encourages the model to flag uncertainty, which makes checking easier',
          ],
          answer: 3,
          explanation:
            'It often helps the model admit gaps, but it is not a guarantee. You still check the result.',
        },
        {
          id: 'starter-02-q5',
          audience: { max: 'beginner' },
          prompt: "You want a simple page for your shop. Which message gives an AI assistant the most to work with?",
          choices: ["Make me a website", "Make an amazing, professional, world-class website for my business, please", "Make a one-page website for my bakery with its name, a short welcome and three items with prices in pesos, in big easy-to-read text", "Make a website, and keep trying until it looks good"],
          answer: 2,
          explanation: "It names the shop, what goes on the page and how it should look. Vague wishes such as amazing or world-class give the assistant nothing it can act on.",
        },
        {
          id: 'starter-02-q6',
          audience: { min: 'advanced' },
          prompt: "Your team keeps a prompt that turns commit messages into changelog entries, and a script parses the output. After a model update the format shifts and the parser breaks. Which practice would have caught it?",
          choices: ["Setting the temperature to 0, so that the output stays identical after any model update", "Making the prompt longer so that the required format is repeated several times", "Re-running the prompt on a small fixed set of sample inputs with an automated format check whenever the prompt or the model changes", "Asking the model at the end of each run whether it followed the format"],
          answer: 2,
          explanation: "A prompt is a dependency. A fixed set of inputs with automated checks shows changes in behaviour before they reach production. Temperature 0 does not guarantee identical output, and the model's own claim is not a check.",
        },
      ],
      task: {
        title: 'Upgrade one prompt',
        minutes: 15,
        steps: [
          'Write a one-line prompt for something you really need this week (a message, an explanation, a plan).',
          'Run it and save the answer.',
          'Rewrite the prompt with context, a role, the task, an example or format, and constraints. Run it again.',
          'Give it two follow-up instructions to improve the answer.',
          'Compare the first and last answers and note what made the biggest difference.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Write the bakery prompt from this lesson with your own shop or idea in place of Aling Rosa's, run it, and then ask the assistant to explain in plain words how to open what it made. Do not worry if you cannot follow all of it: ask it to explain again, more simply.",
            "Change one thing about your idea (the colours, the prices, the welcome line) with a follow-up in the same chat and write down what changed.",
          ],
        },
        {
          audience: { min: 'intermediate', max: 'intermediate' },
          steps: [
            "Take a real error from a project of yours and write the prompt as a ticket: the code around it, the exact error, your versions, what you expected. Compare the answer with the one you get from just pasting the error.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Turn one recurring request of yours into a spec prompt with acceptance criteria, a test plan step and a stated output format. Save it in a repository file, then run it on three different inputs and note what failed the criteria.",
            "Write the one automated check you would run on the output of that prompt if it were part of a pipeline.",
          ],
        },
      ],
    },
    {
      id: 'starter-03',
      day: 3,
      title: 'Checking AI output',
      summary: 'Spot hallucinations and verify facts, code and numbers before you use them.',
      intro: { objectives: ['Recognise a hallucination: false output presented as true.', 'Choose the right check for facts, quotes, code, numbers and advice.', 'Test AI-written code with inputs where you already know the answer.', 'Match how hard you check to what is at stake.'], why: 'Checking an answer before you use it is what separates careful professionals from people caught out by an invented source or a wrong figure. It is the habit employers, clients and teachers trust most.' },
      minutes: 15,
      skills: ['verification', 'prompting'],
      body: [
        {
          type: 'paragraph',
          text: 'Yesterday you learned to get better answers. Today you learn the habit that separates careful professionals from everyone else: checking the answer before you use it.',
        },
        { type: 'heading', text: 'What a hallucination looks like' },
        {
          type: 'paragraph',
          text: 'A **hallucination** is when an AI produces something false but presents it as true. Common examples: a book or article that doesn\'t exist, a law section with the wrong number, a function or library option that was never real, or a statistic with no source. They look exactly like real answers, which is why they are dangerous.',
        },
        { type: 'heading', text: 'Check by type of output' },
        {
          type: 'list',
          items: [
            '**Facts, dates, laws, prices:** confirm with an official or primary source, such as a government site, the company\'s own page or the original paper.',
            '**Quotes and citations:** open the source and find the exact words. If you can\'t find it, don\'t use it.',
            '**Code:** run it. Read it line by line. Test it with normal input, empty input and wrong input. Check that every library and function actually exists in the official docs.',
            '**Numbers and math:** redo the calculation yourself or in a spreadsheet.',
            '**Advice (legal, tax, health, money):** treat it as a starting point only, and confirm with a qualified person or the official office.',
          ],
        },
        {
          type: 'tip',
          text: 'The more it matters, the harder you check. A brainstorm for blog titles needs a quick read. A client deliverable, a grade or a production deploy needs real verification.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "You can check a claim even when no code is involved. Take any claim the assistant gives you, such as a date, a price or a rule, and ask: where would a person look this up? That place is your source: an official website, the shop's own page, the original document. Search for the claim, open the official page and find the same fact there. If you cannot find it in a couple of minutes, treat it as unproven and do not pass it on. It takes about a minute, and it is the same habit professionals use.",
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-03-match-1',
            kind: 'match',
            title: 'Match the output to its check',
            prompt: 'Different kinds of output need different checks. Match each one.',
            concept: 'verifying ai output',
            pairs: [
              {
                term: 'A date or a law section number',
                definition: 'Confirm with an official or primary source.',
              },
              {
                term: 'A quote or citation',
                definition: 'Open the source and find the exact words.',
              },
              {
                term: 'AI-written code',
                definition: 'Run it, read it, and test normal, empty and wrong input.',
              },
              {
                term: 'A calculation',
                definition: 'Redo it yourself or in a spreadsheet.',
              },
              {
                term: 'Legal, tax, health or money advice',
                definition: 'A starting point only: confirm with a qualified person or the official office.',
              },
            ],
            hints: [
              'Ask what could go wrong with each kind of output.',
              'Quotes can be invented, so the check is to find the exact words in the source.',
              'Code is the one you can actually run.',
            ],
            explanation: 'The more it matters, the harder you check, and each kind of output has its own check: a source for facts, the exact words for quotes, a run for code, your own math for numbers.',
          },
        },
        { type: 'heading', text: 'Make the assistant help you check' },
        {
          type: 'paragraph',
          text: 'You can ask the AI to point at its own weak spots. This does not replace your check, because it can be wrong about itself too, but it tells you where to look first.',
        },
        {
          type: 'prompt',
          label: 'Find the weak spots',
          text: 'Review your last answer. List every factual claim, number, name or code function in it. For each one, say how confident you are (high, medium, low) and tell me exactly where I could verify it from an official source.',
        },
        {
          type: 'paragraph',
          text: 'For code, a quick test like the one below catches many mistakes. Here a function from an AI is checked against inputs where you already know the right answer.',
        },
        {
          type: 'code',
          language: 'python',
          label: 'Test before you trust',
          code: `def peso_to_centavos(amount: float) -> int:
    return round(amount * 100)

assert peso_to_centavos(1) == 100
assert peso_to_centavos(19.99) == 1999
assert peso_to_centavos(0) == 0
print("All checks passed")`,
        },
        {
          type: 'paragraph',
          text: 'Why `round` and not `int`? A computer stores a decimal like 19.99 as a very close approximation, so 19.99 * 100 can come out as 1998.9999999999998 instead of exactly 1999. `int` cuts the decimals off and would give 1998, while `round` goes to the nearest whole number, 1999. This is the kind of quiet mistake a test with a known answer catches and a quick read does not.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "What the code above is doing, line by line. The first line creates a small named tool, a *function*, called `peso_to_centavos`. It takes an amount in pesos and gives back whole centavos (100 centavos make one peso). The line `return round(amount * 100)` multiplies the amount by 100 and rounds to the nearest whole number. Each `assert` line is a check that says: this must be true. If it is false, the program stops and tells you. The last line prints a message only when every check passed. To *run* code means to tell the computer to carry it out; to *test* it means to run it on inputs where you already know the right answer.",
        },
        {
          type: 'paragraph',
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "You have built small projects, so go one step beyond running the code once: write the checks first. Before you ask for a function, write three or four examples of input and the expected answer, including an empty input and a wrong one, and paste them into your prompt. Run the generated code against them. When one fails, paste the failing output back and ask for a fix, then run all the checks again, not only the one that failed, because a fix can break something that used to pass. Also look up every library the code imports in its official documentation: an assistant can name one that does not exist.",
        },
        {
          type: 'visual',
          id: 'ai-llm-workflow',
          caption: 'Follow a prompt through the model to a checked answer, and see what the check does when it finds a problem.',
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-03-fix-bug-1',
            kind: 'fix-bug',
            title: 'The cents that went missing',
            prompt: 'An AI wrote `peso_to_centavos`, and its two checks should pass. One fails. Find the line with the bug, then pick the fix.',
            concept: 'testing ai code',
            language: 'python',
            code: 'def peso_to_centavos(amount: float) -> int:\n    return int(amount * 100)\n\nassert peso_to_centavos(1) == 100\nassert peso_to_centavos(19.99) == 1999\nprint("All checks passed")',
            bugLine: 2,
            fixes: [
              {
                line: 'return round(amount * 100)',
                correct: true,
                why: 'Yes. 19.99 * 100 comes out as 1998.9999999999998, and `round` goes to the nearest whole centavo, 1999.',
              },
              {
                line: 'return int(amount * 100) + 1',
                correct: false,
                why: 'This makes `peso_to_centavos(1)` return 101, so the first check fails.',
              },
              {
                line: 'return amount * 100',
                correct: false,
                why: 'It returns a float, and 19.99 * 100 is 1998.9999999999998, so the second check still fails.',
              },
            ],
            lineNote: 'That line is fine. The bug is in the line that turns the amount into centavos.',
            hints: [
              'Which of the two checks fails? The one with a decimal in it.',
              'Computers store decimals like 19.99 as close approximations. What does 19.99 * 100 come out as?',
              '`int` cuts the decimals off instead of rounding to the nearest value.',
            ],
            explanation: 'The product lands just under 1999, and `int` drops the fraction, giving 1998. Rounding to the nearest value fixes it. Running a test with a known answer is what caught this.',
          },
        },
        {
          type: 'warning',
          text: 'Asking "Are you sure?" is not verification. The model may change a right answer to a wrong one just because you sounded doubtful.',
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "Verification scales as a pipeline, not as a habit. Generated code goes through what human code goes through: diff review, type checks and linters, the test suite in CI and a security scan. Then add checks for failures typical of generated code. Packages that do not exist: attackers can publish a malicious package under a commonly hallucinated name, so confirm every new dependency in its registry (publisher, age, source repository) before installing, and pin the version. Tests written by the same prompt as the code share its blind spots, so derive them from the spec or write them first, and prove they bite by breaking the code on purpose. Keep a named human owner for every merge, and scale review depth with blast radius: authentication, payments, migrations and personal data get a second reviewer.",
        },
        {
          type: 'version',
          audience: { min: 'advanced' },
          text: "OWASP's LLM09 (Misinformation) lists unsafe code generation among its risks: a model may suggest insecure or non-existent code libraries, and attackers can publish malicious packages under commonly hallucinated names. Its mitigations include cross-verification against trusted sources with human oversight, automatic validation of key outputs, and secure coding practices. The page does not give a step-by-step package check, so the registry checks above are standard practice, not an OWASP rule.",
          checked: CHECKED,
          sources: [SRC.owaspLlm09],
        },
        {
          type: 'takeaways',
          items: [
            'A hallucination is false output presented as true: invented sources, laws, functions or statistics.',
            'Check by type: official sources for facts, the exact words for quotes, running and testing for code, your own math for numbers.',
            'Check in proportion to the stakes.',
            'Asking "Are you sure?" is not verification; a source or a test is.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-03-q1',
          prompt: 'An assistant cites "Section 14 of a Philippine law" for a claim. How do you verify it?',
          choices: [
            'Ask the assistant to quote the section again',
            'Assume it is right, since it gave a section number',
            'Find the law on an official or trusted legal source and read that section',
          ],
          answer: 2,
          explanation:
            'Section numbers are a common hallucination. Only the actual text of the law confirms it.',
        },
        {
          id: 'starter-03-q2',
          prompt: 'What is the best first check for AI-written code?',
          choices: [
            'Run it and test it with inputs where you know the right result',
            'Check that it has comments',
            'See if it is short',
            'Ask the AI to rate its own code',
          ],
          answer: 0,
          explanation:
            'Running and testing shows what the code actually does. Comments and length tell you nothing about correctness.',
        },
        {
          id: 'starter-03-q3',
          prompt: 'Why is "Are you sure?" a weak way to verify an answer?',
          choices: [
            'Because the model always says yes',
            'Because the model may flip its answer under pressure, right or wrong',
            'Because it uses up your free messages',
          ],
          answer: 1,
          explanation:
            'The model can change a correct answer just because you pushed back. Real verification uses a source or a test.',
        },
        {
          id: 'starter-03-q4',
          prompt: 'Which output needs the most careful checking?',
          choices: [
            'Ten ideas for a team lunch theme',
            'A friendlier rewrite of a message you already wrote',
            'A list of synonyms for "fast"',
            'A tax deadline you will tell a client about',
          ],
          answer: 3,
          explanation:
            'Check in proportion to the stakes. A deadline told to a client can cause real harm if wrong, so confirm it with the official office.',
        },
        {
          id: 'starter-03-q5',
          audience: { max: 'beginner' },
          prompt: "In a test, what does an `assert` line do?",
          choices: ["It prints the result so that you can read it", "It asks the AI to rewrite the function", "It states something that must be true, and stops with an error if it is not", "It saves the code to a file"],
          answer: 2,
          explanation: "An assert is a check: it says what must be true and makes the program stop with an error when that is false. That is how a test tells you the code is wrong.",
        },
        {
          id: 'starter-03-q6',
          audience: { min: 'advanced' },
          prompt: "An assistant-generated pull request adds a dependency called `fast-csv-clean-pro` that nobody on the team has heard of. All tests pass. What is the right next step?",
          choices: ["Merge it: passing tests show that the dependency is safe to use", "Ask the assistant whether the package is real, and merge if it says yes", "Install it in a throwaway container, and merge if it starts without errors", "Look the package up in the official registry, check its publisher, age and source repository, and only then decide, pinning an exact version if it stays"],
          answer: 3,
          explanation: "Tests do not show that a dependency is safe, and the assistant's own word is not a check. A package name can be one that models hallucinate and attackers register, so verify it at the registry before it enters the project.",
        },
      ],
      task: {
        title: 'Catch a mistake',
        minutes: 15,
        steps: [
          'Ask an assistant a factual question in your field that has a checkable answer (a definition, a date, a function\'s parameters).',
          'Run the "Find the weak spots" prompt on its answer.',
          'Verify the two lowest-confidence claims using an official source or by running the code.',
          'Write one line for each: correct, partly correct or wrong, and the source you used.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Ask the assistant to explain each line of the Python example in plain words. Then write, in your own words, what `assert` does and what happens if a check is false.",
            "Run the example in any Python environment you can reach (ask the assistant to walk you through it, one step at a time). Change 19.99 to another amount and see what happens.",
          ],
        },
        {
          audience: { min: 'intermediate', max: 'intermediate' },
          steps: [
            "Before asking for a small function, write four test cases first: two normal ones, one empty and one wrong input. Run the generated code on them and note which one failed first.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Take an AI-generated change with a new dependency: verify the dependency in its registry, pin its version, and write the one test that would have caught the worst bug you can think of in the change. Break the code on purpose to prove that the test fails.",
          ],
        },
      ],
    },
    {
      id: 'starter-04',
      day: 4,
      title: 'Using AI safely and honestly',
      summary: 'Protect secrets and personal data, follow the rules where you work or study, and disclose AI use.',
      intro: { objectives: ['List what never to paste into an AI tool: secrets, personal data and material you may not share.', 'Replace real details with fake ones before you ask for help.', 'Act fast when a key or password has leaked.', 'Disclose AI help where your school, client or employer expects it.'], why: 'What you type into an AI tool leaves your laptop, so one careless paste can expose a client, a customer or your own account. Safe habits protect your job, your grades and other people.' },
      minutes: 15,
      skills: ['responsible-ai', 'ai-fundamentals'],
      body: [
        {
          type: 'paragraph',
          text: 'AI tools are useful, but what you type into them leaves your laptop. Depending on the tool and its settings, it may be stored, reviewed or used to improve the service. Good habits here protect you, your employer, your clients and your students.',
        },
        { type: 'heading', text: 'Never paste these' },
        {
          type: 'list',
          items: [
            '**Secrets:** passwords, API keys, tokens, private keys, database connection strings.',
            '**Personal data:** names with contact details, government ID numbers, payslips, health records, students\' grades.',
            '**Client or company material** that you are not allowed to share, including company source code, unless the tool is approved for that use.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If you need help with real data, replace it with fake data first. Change "Juan Dela Cruz, 0917 123 4567" to "Customer A, 0900 000 0000". The AI can still help with the structure.',
        },
        {
          type: 'warning',
          text: 'If you ever paste a real API key or password into a chat or a public repo, treat it as leaked. Revoke it and create a new one right away. Deleting the message is not enough.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "In plain words: a *secret* is anything that works like a password. An *API key* is a long code that a program uses to prove it may use a service as you, so anyone who gets it can use that service and you may be the one who pays. A file called `.env` is where programmers often keep such codes. *Personal data* is anything that identifies a real person, such as a name next to a phone number. None of these belong in a chat, because what you type leaves your laptop. Before you paste anything, read it once and swap each secret for a made-up stand-in such as `API_KEY=put-your-key-here`. If a real one slips through, get a new key from the website that gave it to you, so that the old one stops working.",
        },
        { type: 'heading', text: 'Follow the rules where you are' },
        {
          type: 'paragraph',
          text: 'Many companies list which AI tools are approved and what you may use them for. Schools and universities have their own academic honesty rules. Ask before assuming. In the Philippines, the **Data Privacy Act** protects personal information, so handling other people\'s data carelessly can have real consequences. Keep this general: for what applies to your exact situation, check your company policy, your school, or the National Privacy Commission.',
        },
        { type: 'heading', text: 'Be honest about AI help' },
        {
          type: 'list',
          items: [
            'If your school, client or employer requires you to disclose AI use, disclose it.',
            'Never submit AI work as entirely your own where that is not allowed.',
            'Respect licences. AI can produce text or code that closely matches existing work, so don\'t assume everything it gives you is free to use.',
            'You are responsible for what you ship, whoever drafted it.',
          ],
        },
        {
          type: 'tip',
          text: 'A simple disclosure line works in most places: "I used an AI assistant to draft the outline and check grammar. The analysis and final edits are my own."',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "Honesty about AI, in plain words: using AI help is allowed in many places, and the problem is hiding it where the rules say you must tell. If you are not sure whether you may use it for an assignment or a client job, ask the teacher or the client first. Asking takes a minute. Being caught hiding it can cost you a grade or a contract.",
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-04-match-1',
            kind: 'match',
            title: 'What do you do?',
            prompt: 'Match each situation to the safe habit from this lesson.',
            concept: 'safe ai use',
            pairs: [
              {
                term: 'A real API key pasted into a chat',
                definition: 'Treat it as leaked: revoke it and create a new one. Deleting the message is not enough.',
              },
              {
                term: 'A customer name and phone number in your text',
                definition: 'Replace them with fake data first, like "Customer A, 0900 000 0000".',
              },
              {
                term: 'Company source code',
                definition: 'Do not paste it unless the tool is approved for that use.',
              },
              {
                term: 'A school that requires you to disclose AI help',
                definition: 'Say how you used it, for example with one short disclosure line.',
              },
            ],
            hints: [
              'Secrets are the most urgent: what do you do once they have left your control?',
              'Fake data keeps the structure of your text without exposing anyone.',
              'Disclosure is about being honest, while the other three are about what leaves your laptop.',
            ],
            explanation: 'What you type into a tool leaves your laptop, so secrets and personal data stay out, company material needs an approved tool, and you are open about AI help where the rules ask for it.',
          },
        },
        {
          type: 'prompt',
          label: 'Anonymise before you ask',
          text: 'I will paste some text. Replace every personal name, phone number, email address, ID number, address and company name with a placeholder like [NAME 1] or [PHONE 1]. Return only the cleaned text and a list of the placeholders you used. Do not keep or repeat the original details.',
        },
        {
          type: 'paragraph',
          text: 'One caution about that prompt: it still sends the original text to the tool. Use it only with an approved tool, or clean the text yourself when the data is sensitive.',
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "In a team, these personal habits turn into policy and tooling. Classify data (public, internal, customer, credentials, third-party code under licence) and decide which class may go to which tool. Approve specific business accounts rather than leaving it to personal ones, and read each tool's retention and training terms for your plan, because they differ. Then take the human out of the leak path: secret scanning with push protection blocks a commit that contains a recognised credential before it reaches the repository, and a pre-commit hook catches it even earlier. When one does leak, rotate it; deleting is not enough. Also treat what a model reads as untrusted: a web page or file can carry instructions aimed at the assistant (prompt injection), so give agents least privilege, require human approval for risky actions, and keep a record of what they could reach.",
        },
        {
          type: 'version',
          audience: { min: 'advanced' },
          text: "GitHub's documentation says push protection blocks a push when it detects a potential secret, and that by default anyone with write access can bypass the block by giving a reason, which creates an alert. Repository-level push protection is disabled by default and must be enabled by an administrator or owner; a separate user-level setting, on by default, stops a person from pushing secrets to public repositories on GitHub.com. OWASP's LLM01 describes indirect prompt injection (instructions inside external content the model reads) and lists least privilege, human approval for high-risk actions and separating untrusted content as mitigations, adding that no single measure fully prevents it.",
          checked: CHECKED,
          sources: [SRC.pushProtection, SRC.owaspLlm01],
        },
        {
          type: 'takeaways',
          items: [
            'Never paste secrets, personal data, or client or company material you are not allowed to share.',
            'Replace real details with fake ones before you ask for help with structure.',
            'A leaked key or password must be revoked or changed; deleting the message is not enough.',
            'Follow your company or school rules, and disclose AI use where it is required.',
            'You are responsible for what you ship, whoever drafted it.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-04-q1',
          prompt: 'You accidentally pasted a real API key into an AI chat. What should you do?',
          choices: [
            'Delete the chat and move on',
            'Revoke the key and create a new one',
            'Nothing, AI tools never store anything',
          ],
          answer: 1,
          explanation:
            'Once a secret has left your control, treat it as leaked. Revoking it is the only reliable fix.',
        },
        {
          id: 'starter-04-q2',
          prompt: 'You want AI help formatting a client\'s customer list. What is the safest approach?',
          choices: [
            'Paste the full list into any free chatbot',
            'Email the list to yourself first',
            'Ask the client to paste it for you',
            'Replace the real details with fake ones, or use a tool your company has approved for that data',
          ],
          answer: 3,
          explanation:
            'Fake data keeps the structure without exposing anyone. Approved tools are the exception your company has already vetted.',
        },
        {
          id: 'starter-04-q3',
          prompt: 'Your instructor allows AI for brainstorming but requires disclosure. What do you do?',
          choices: [
            'Add a short note saying how you used AI',
            'Use AI only at night so it doesn\'t count',
            'Skip the disclosure if the AI part was small',
          ],
          answer: 0,
          explanation:
            'When disclosure is required, you disclose, even for small help. A one-line note is enough in most cases.',
        },
        {
          id: 'starter-04-q4',
          prompt: 'Who is responsible for a bug in code you shipped that an AI wrote?',
          choices: [
            'The AI company',
            'Nobody, since a machine wrote it',
            'You, because you chose to use and ship it',
          ],
          answer: 2,
          explanation:
            'AI is a tool. Whoever reviews and ships the work owns the result.',
        },
        {
          id: 'starter-04-q5',
          audience: { max: 'beginner' },
          prompt: "Which of these is safe to paste into an AI chat just as it is?",
          choices: ["A general question about how to word a polite reminder to a customer who pays late, with no names or numbers in it", "A line from a `.env` file that holds a live API key, because the chat is private", "A customer's full name together with the phone number they gave you for deliveries", "A classmate's grades, so that the assistant can compare them with yours"],
          answer: 0,
          explanation: "A general question with no names, numbers or keys exposes nothing. A key, a customer's contact details and another person's grades are secrets or personal data, so they stay out.",
        },
        {
          id: 'starter-04-q6',
          audience: { min: 'advanced' },
          prompt: "Your company has no AI policy yet, and developers paste company code into their personal AI accounts. Which first step lowers the risk the most without banning useful tools?",
          choices: ["Ban every AI tool until a full policy exists, so that nobody can leak anything", "Tell each developer to switch off model training in their own account and trust them from there", "Name one approved business tool, say which data classes may go into it, and turn on secret scanning with push protection for the repositories", "Ask the AI vendor to promise in writing that nothing pasted is ever stored"],
          answer: 2,
          explanation: "A clear approved route plus automated protection reduces risk while keeping the benefit. A ban pushes use out of sight, a training switch is not permission to share, and a vendor promise does not replace your own data rules.",
        },
      ],
      task: {
        title: 'Your personal AI rules',
        minutes: 10,
        steps: [
          'Find out if your company or school has an AI policy. Search the intranet, handbook or syllabus, or ask.',
          'Check the data or privacy settings of the AI tool you use most, and note whether your chats may be used for training.',
          'Write five short rules for yourself, for example: "No real names in prompts."',
          'Save them where you will see them, like a note on your laptop.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Make a fake `.env` file with three invented values, such as `API_KEY=not-a-real-key`. Rewrite it with safe placeholders you could paste into a chat. Never use real values for this practice.",
            "Ask your teacher, manager or client one question: which AI tools may I use here, and do I need to say when I did?",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Draft a one-page data classification table for your team: each data class, which AI tools it may go to, and who approves exceptions.",
            "On GitHub, check whether push protection is turned on for a repository you own, and turn it on if you can. Write down how a leaked key would be rotated in that project.",
          ],
        },
      ],
    },
    {
      id: 'starter-05',
      day: 5,
      title: 'AI for everyday tech work',
      summary: 'Use AI to write, research, learn faster and understand code, with prompts you can reuse.',
      intro: { objectives: ['Name the four everyday uses of AI: writing, research, learning and understanding code.', 'Use AI for a first draft or a map, then check and edit it yourself.', 'Ask an assistant to quiz you instead of only explaining.', 'Read a short piece of code and say what it prints.'], why: 'These four uses cover much of the day for a developer, a VA, a teacher or a first-time builder. With a few reusable prompts you start tasks faster and still keep control of the result.' },
      minutes: 15,
      skills: ['ai-workflow', 'prompting', 'responsible-ai'],
      body: [
        {
          type: 'paragraph',
          text: 'Now let\'s make AI part of your normal day. Whether you are a developer, a VA, a teacher or someone building a first website, the same four uses come up again and again: writing, research, learning and understanding code.',
        },
        {
          type: 'table',
          headers: ['Use', 'What AI does', 'What you still do'],
          rows: [
            [
              'Writing',
              'Gets you past the blank page with a draft.',
              'Edit for accuracy and for your own voice.',
            ],
            [
              'Research',
              'Maps the topic: main ideas, key terms, questions to ask.',
              'Read the real sources yourself.',
            ],
            [
              'Learning',
              'Explains at your level and quizzes you.',
              'Answer the questions yourself.',
            ],
            [
              'Understanding code',
              'Explains a snippet line by line.',
              'Share only code you are allowed to share.',
            ],
          ],
          caption: 'The four everyday uses',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "These four jobs all work the same way: you hand the assistant something small and clear, you get something back, and you stay the editor. Pick one job you really did this week, such as a message, some studying, or something you did not understand, and try it with the prompts below. You do not have to learn everything at once. If your work is not about technology at all, the same prompts work; just replace the examples with your own.",
        },
        { type: 'heading', text: '1. Writing' },
        {
          type: 'paragraph',
          text: 'Use AI to get past the blank page, then make it yours. Draft emails, status updates, documentation and proposals. Always edit for accuracy and for your own voice. Readers notice generic AI text.',
        },
        {
          type: 'prompt',
          label: 'Status update',
          text: 'Turn these rough notes into a short status update for my manager. Three sections: Done, In progress, Blocked. Keep my wording where possible, no more than 120 words, and don\'t add anything I didn\'t mention. Notes: [paste your notes]',
        },
        {
          type: 'paragraph',
          text: 'Even with that instruction, a draft can slip in a detail you never gave it, such as a task marked "finished" that you only started. Compare the draft with your notes line by line, delete anything that is not in them, and remember that you own every sentence you send.',
        },
        { type: 'heading', text: '2. Research' },
        {
          type: 'paragraph',
          text: 'AI is great for mapping a topic quickly: the main ideas, the key terms, the questions to ask. Use it to plan your research, then read the real sources. Assistants with web search can link sources, and you still open and read them.',
        },
        { type: 'heading', text: '3. Learning' },
        {
          type: 'paragraph',
          text: 'Ask for explanations at your level, then ask it to quiz you. Learning sticks when you answer questions yourself, not when you only read.',
        },
        {
          type: 'prompt',
          label: 'Tutor mode',
          text: 'Teach me what Git branches are, as if I am a beginner. Use a short example. Then ask me three questions one at a time and wait for my answer before giving feedback. Don\'t give me the answers until I try.',
        },
        { type: 'heading', text: '4. Understanding code' },
        {
          type: 'paragraph',
          text: 'Paste a snippet you are allowed to share and ask what it does, line by line. This is useful for students, for developers reading an old codebase, and for builders trying to understand what a vibe-coding tool generated.',
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'Try explaining this',
          code: `const prices = [120, 85, 300, 45];
const total = prices
  .filter((p) => p >= 50)
  .reduce((sum, p) => sum + p, 0);
console.log(\`Total of items 50 pesos and up: \${total}\`);`,
        },
        {
          type: 'paragraph',
          text: 'You can read this one yourself. `filter` keeps only the prices that pass the test, here 50 or more, so 45 is dropped. `reduce` then adds up what is left, starting from 0. Work through it before you ask an assistant, then use the assistant to confirm your reading and to explain any line you could not follow.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "Line by line, for someone who has never programmed. `const prices = [120, 85, 300, 45];` makes a list called `prices` that holds four numbers (a list written in square brackets is called an *array*). `.filter((p) => p >= 50)` goes through the list and keeps only the numbers that pass the test \"is at least 50\"; `p` stands for each price in turn. `.reduce((sum, p) => sum + p, 0)` adds the remaining numbers together, starting from 0. `console.log(...)` prints a message on the screen, and the text in backticks puts the total inside it. The program prints 505.",
        },
        {
          type: 'paragraph',
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "You have built small projects, so use the four jobs on your own code. To understand code, paste a function you wrote last month and ask what it assumes and where it could fail, then compare the answer with what you remember. For writing, ask for a README section or a commit message from your diff, and cut anything the diff does not show. Keep the prompts that worked in a file inside your project folder, not only in a note, so that they travel with the project and you can improve them as you go.",
        },
        {
          type: 'prompt',
          label: 'Explain code',
          text: 'Explain this code line by line for someone who knows basic programming. Then tell me what it prints, and one way it could break. [paste the code]',
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-05-scenario-1',
            kind: 'scenario',
            title: 'The line you never wrote',
            prompt: 'What should you do with the draft?',
            concept: 'checking ai drafts',
            situation: 'You asked an assistant to turn your notes into a status update. The draft reads well, but it includes "Finished the payment tests", which is not in your notes.',
            options: [
              {
                text: 'Send it. The draft sounds right and saves you time.',
                consequence: 'Your manager now believes tests are finished that you never mentioned. You own what you send.',
                quality: 'poor',
              },
              {
                text: 'Delete the line, and check every other sentence against your notes.',
                consequence: 'Your update says only what you did, and checking the rest catches any other additions.',
                quality: 'best',
              },
              {
                text: 'Ask the assistant "Are you sure?" and keep the line if it says yes.',
                consequence: 'Asking again is not a check. The only source of truth here is your own notes.',
                quality: 'poor',
              },
            ],
            hints: [
              'Compare the draft with what you actually wrote.',
              'An AI draft can add things you never said.',
              'You own what you send, so every claim must match your notes.',
            ],
            explanation: 'A draft is only as true as what you check it against. Facts must be right and the update must say only what you did.',
          },
        },
        {
          type: 'tip',
          text: 'Save the prompts that work for you in a note. A personal prompt library saves you time every week.',
        },
        {
          type: 'warning',
          text: 'Before pasting work code or documents, remember Day 4: only what you are allowed to share, in a tool you are allowed to use.',
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "In an engineering team, the prompt library becomes part of the repository. Persistent instructions for coding assistants live in a plain-text file at the project root, so every teammate's assistant starts with the same build and test commands, conventions and no-go areas. Claude Code reads CLAUDE.md (and can read a repository's AGENTS.md instead), and Codex reads AGENTS.md. Claude Code's documentation says it treats such files as context, not enforced configuration, so anything that must always hold belongs in CI, a linter or a hook. Review these files like code and keep them short and specific. Then use the seams you already have: a pull request template asking what was AI-assisted and how it was verified, and commit messages that say what you checked. Measure with your own numbers (cycle time, review rework, escaped defects), not impressions.",
        },
        {
          type: 'version',
          audience: { min: 'advanced' },
          text: "Claude Code's memory documentation says CLAUDE.md files are instructions you write to give Claude persistent context, that Claude can also read a repository's AGENTS.md files, and that Claude treats these as context, not enforced configuration (to block an action regardless, it points to hooks). Codex's documentation describes AGENTS.md as a plain-Markdown file Codex reads before starting work: it builds an instruction chain from a global file and then from the project root down to the current directory, closer files overriding broader ones, and stops loading at a size limit that defaults to 32 KiB. Other assistants use other file names, so check the documentation of the one you use.",
          checked: CHECKED,
          sources: [SRC.claudeMemory, SRC.agentsMd],
        },
        {
          type: 'takeaways',
          items: [
            'Four everyday uses: writing, research, learning and understanding code.',
            'Use AI for the first draft or the map, then make the result yours and check it.',
            'Ask it to quiz you; answering questions yourself is how learning sticks.',
            'Save the prompts that work in a personal prompt library.',
            'Only paste what you are allowed to share, in a tool you are allowed to use.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-05-q1',
          prompt: 'What is the best way to use AI for research?',
          choices: [
            'Use it to map the topic and find what to read, then read the real sources',
            'Copy its answer as your final research',
            'Avoid it completely for research',
          ],
          answer: 0,
          explanation:
            'AI is fast at outlining a topic, but the facts must come from sources you have actually read.',
        },
        {
          id: 'starter-05-q2',
          prompt: 'Why ask the AI to quiz you instead of only explaining?',
          choices: [
            'Quizzes use fewer tokens',
            'Answering questions yourself helps you remember and shows what you don\'t know yet',
            'The AI explains better when it asks questions',
            'It stops hallucinations completely',
          ],
          answer: 1,
          explanation:
            'Active recall, answering from memory, is one of the most reliable ways to learn.',
        },
        {
          id: 'starter-05-q3',
          prompt: 'In the JavaScript example, what does the code print?',
          choices: [
            'Total of items 50 pesos and up: 550',
            'Total of items 50 pesos and up: 465',
            'Total of items 50 pesos and up: 505',
          ],
          answer: 2,
          explanation:
            'The filter keeps 120, 85 and 300 (45 is removed), and 120 + 85 + 300 = 505.',
        },
        {
          id: 'starter-05-q4',
          prompt: 'What should you do with an AI-drafted email before sending it?',
          choices: [
            'Send it as is, since AI grammar is perfect',
            'Add "Sent by AI" to the subject',
            'Shorten it to one line',
            'Check every fact and edit it so it sounds like you',
          ],
          answer: 3,
          explanation:
            'You own what you send. Facts must be right, and your own voice keeps it from sounding generic.',
        },
        {
          id: 'starter-05-q5',
          audience: { max: 'beginner' },
          prompt: "In the lesson's JavaScript example, what does `filter` do?",
          choices: ["It adds all the prices together into one total", "It prints the prices on the screen", "It keeps only the items that pass a test, here prices of 50 or more", "It puts the prices in order from smallest to largest"],
          answer: 2,
          explanation: "`filter` goes through the list and keeps only what passes the test. Adding is the job of `reduce`, and printing is the job of `console.log`.",
        },
        {
          id: 'starter-05-q6',
          audience: { min: 'advanced' },
          prompt: "Your team wants every developer's coding assistant to use the same test command and to never edit the `migrations/` folder. Which setup is best?",
          choices: ["Put the test command and the conventions in a project instructions file in the repository, and enforce the migrations rule with a failing CI check or a hook as well", "Put both rules only in a shared chat message and ask people to paste them into each session", "Put both rules in the instructions file only, because assistants always follow it exactly", "Leave the rules out and rely on each developer's own saved prompts"],
          answer: 0,
          explanation: "An instructions file gives every assistant the same context, but it is context, not a guarantee. A rule that must always hold needs a check that fails, such as CI or a hook.",
        },
      ],
      task: {
        title: 'Start your prompt library',
        minutes: 15,
        steps: [
          'Pick two of the four uses that fit your work (writing, research, learning, code).',
          'Use one prompt from this lesson for each, on a real task, adapting the brackets.',
          'Edit the results until you would actually use them.',
          'Save both prompts in a note called "My prompts", with a line on when to use each.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Ask an assistant to explain the JavaScript example line by line. Then change the 50 to 100 and predict the new total before you run it (it should be 420). Ask the assistant to show you how to run it, and check your prediction.",
          ],
        },
        {
          audience: { min: 'intermediate', max: 'intermediate' },
          steps: [
            "Save two prompts that worked as a file in a project folder of your own. Use each on a real function or document of yours, and note one change you made to the prompt afterwards.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Write a short project instructions file (build and test commands, three conventions, one do-not-touch area) and add one line to your pull request template asking what was AI-assisted and how it was checked. Use both for a week, and note one change you made after seeing what the assistant ignored.",
          ],
        },
      ],
    },
    {
      id: 'starter-06',
      day: 6,
      title: 'The AI tools map',
      summary: 'Chat assistants, coding assistants, vibe-coding builders and automation tools: what each is for.',
      intro: { objectives: ['Tell apart chat assistants, coding assistants, vibe-coding builders and automation tools.', 'Match a real job to the kind of tool that fits it.', 'Judge any new tool by its kind, its data handling and whether you can export your work.'], why: 'New tools launch every month and the names keep changing. Knowing the four kinds lets you pick a tool for your own work, and tell hype from help, without chasing every launch.' },
      minutes: 15,
      skills: ['ai-workflow', 'ai-fundamentals', 'career-direction'],
      body: [
        {
          type: 'paragraph',
          text: 'New AI tools appear every month, and the names change fast. Instead of chasing every launch, learn the four main kinds. Once you know the kind, you can judge any new tool in a few minutes.',
        },
        { type: 'heading', text: '1. Chat assistants' },
        {
          type: 'paragraph',
          text: 'General helpers you talk to in a chat window, such as ChatGPT, Gemini or Claude. Good for writing, explaining, planning and analysing documents. Many can also read files, search the web or create images, depending on the plan and settings.',
        },
        { type: 'heading', text: '2. AI coding assistants' },
        {
          type: 'paragraph',
          text: 'Tools that work inside your code editor or terminal, such as GitHub Copilot, Cursor or Claude Code. They suggest code as you type, explain and refactor existing code, write tests and can make changes across several files. They are made for people who can read and review code.',
        },
        { type: 'heading', text: '3. Vibe-coding builders' },
        {
          type: 'paragraph',
          text: 'Tools where you describe an app or website in plain words and they build a working version, such as Lovable, Bolt, Replit or v0. Great for prototypes and simple sites, and a door into tech for non-programmers. As projects grow, you still need to understand what was built, especially around logins, payments and data.',
        },
        { type: 'heading', text: '4. Automation tools' },
        {
          type: 'paragraph',
          text: 'Tools that connect apps and run steps for you, such as Zapier, Make or n8n, often with an AI step inside. Example: when a new inquiry arrives by email, an AI step sorts it and a row is added to a spreadsheet. Useful for VAs, small businesses and anyone doing repetitive work.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "Plain words for the terms above. An *editor* is the program where people write code, and a *terminal* is a window where you type commands to the computer instead of clicking. A coding assistant works inside those, and it is made for people who can read code. A vibe-coding builder is more like ordering in a restaurant by describing the dish you want: you describe the app, and it prepares it. An automation tool is like a row of dominoes: when the first one falls (a new order arrives), the next steps happen by themselves. A chat assistant is the one you already know: you type, it answers. You can use the first and the last without ever learning to code.",
        },
        {
          type: 'tip',
          text: 'Most of these tools have a free tier or trial, and plans change often. Check the tool\'s own site for current features and limits before you commit, especially for client work.',
        },
        {
          type: 'table',
          headers: ['Kind', 'Examples', 'Good for'],
          rows: [
            [
              'Chat assistants',
              'ChatGPT, Gemini, Claude',
              'Writing, explaining, planning and analysing documents.',
            ],
            [
              'AI coding assistants',
              'GitHub Copilot, Cursor, Claude Code',
              'Suggesting, explaining and refactoring code, for people who can review it.',
            ],
            [
              'Vibe-coding builders',
              'Lovable, Bolt, Replit, v0',
              'Prototypes and simple sites from a description in plain words.',
            ],
            [
              'Automation tools',
              'Zapier, Make, n8n',
              'Connecting apps and repetitive work, often with an AI step inside.',
            ],
          ],
          caption: 'The four kinds. Names are examples; plans change, so check each tool’s own site.',
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-06-match-1',
            kind: 'match',
            title: 'Which kind of tool?',
            prompt: 'Four people each have a job to get done. Match each one with the kind of AI tool that fits it.',
            concept: 'ai tool kinds',
            labels: { terms: 'The job', meanings: 'Kind of tool' },
            pairs: [
              {
                term: 'A teacher wants a friendly letter to parents about next week\'s field trip, in English and Filipino.',
                definition: 'Chat assistant',
              },
              {
                term: 'A junior developer wants tests written for a function in the project she has open, and she will review every line.',
                definition: 'AI coding assistant',
              },
              {
                term: 'A barbershop owner who has never coded wants a simple booking page, made by describing it in plain words.',
                definition: 'Vibe-coding builder',
              },
              {
                term: 'A small bakery wants every new order form entry sorted by an AI step and copied into its delivery sheet, with nobody doing it by hand.',
                definition: 'Automation tool',
              },
            ],
            hints: [
              'Look at where the work happens: a chat window, a code editor, a builder you describe things to, or a chain of connected apps.',
              'Work that has to run on its own every time something new arrives points to one kind; code someone will review points to another.',
              'The person who cannot code but wants a working page needs the tool that builds from a description; writing a letter is plain chat work.',
            ],
            explanation: 'Writing a letter is chat work, tests inside an open project are for a coding assistant used by someone who reviews code, a page built from a plain description is a vibe-coding builder, and steps that run whenever a new order arrives are an automation.',
          },
        },
        { type: 'heading', text: 'How to judge any new tool' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Which kind is it? Chat, coding, builder or automation.',
            'What does it do with my data? Read the privacy page.',
            'Can I see and export what it makes, or am I locked in?',
            'Does it solve a problem I actually have this week?',
          ],
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "For the data question, look for the privacy page and check two things in plain words: does the company say it may use what you type to train its AI, and can you turn that off? If the page is hard to find or unclear, assume that what you type can be seen and do not type anything private. For the export question, check whether you can download your work as files you keep yourself. If you cannot, you would start again from zero the day the tool changes or shuts down.",
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "For an engineering team, the four kinds differ in what they can touch. A chat assistant can only advise. A coding assistant in your editor or terminal can read files in your project and, depending on its settings, edit files and run commands; Claude Code's documentation, for example, describes approval prompts for shell commands and file edits and lets you set allow and deny rules. Builders and automation tools hold credentials for other systems. So review each tool by access (which repositories, tokens and scopes), by approvals (what needs a human yes), by data handling (retention, training, where code goes) and by exit (can you export the code and the data). MCP, an open standard for connecting AI applications to data sources and tools, adds an integration surface: every MCP server you connect is a dependency with its own permissions and trust level, so review it like one.",
        },
        {
          type: 'version',
          audience: { min: 'advanced' },
          text: "The Model Context Protocol site describes MCP as an open-source standard for connecting AI applications to external systems such as data sources, tools and workflows, and says it is supported by assistants and development tools including Claude, ChatGPT, Visual Studio Code and Cursor. Claude Code's permissions documentation says that in its default manual mode file reads inside the working directory need no approval, while shell commands (apart from a built-in set of read-only ones) and file edits ask first, and that you can write allow and deny rules and share them through version control. Other tools differ, so check the documentation of the one you use.",
          checked: CHECKED,
          sources: [SRC.mcp, SRC.claudePermissions],
        },
        {
          type: 'prompt',
          label: 'Pick a tool for a job',
          text: 'I am a [your role, e.g. VA / fresh CS graduate / teacher / small business owner]. My most repetitive task is: [describe it]. Which kind of AI tool fits best: a chat assistant, a coding assistant, a vibe-coding builder or an automation tool? Explain why in under 150 words, and list what I should check about privacy before using one. Name tools only as examples and tell me to confirm current features on their sites.',
        },
        {
          type: 'warning',
          text: 'No tool is "the best" for long. Skills like prompting, checking output and understanding what a tool built carry over to whatever comes next.',
        },
        {
          type: 'takeaways',
          items: [
            'There are four main kinds of AI tool: chat assistants, coding assistants, vibe-coding builders and automation tools.',
            'Learn the kind and you can judge any new tool in a few minutes.',
            'Check what a tool does with your data and whether you can export your work.',
            'Generated apps still need a careful look at logins, payments and data.',
            'Skills like prompting and checking carry over to whatever tool comes next.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-06-q1',
          prompt: 'A VA wants new client inquiries from a form to be summarised and added to a spreadsheet automatically. Which kind of tool fits?',
          choices: [
            'A vibe-coding builder',
            'An AI coding assistant',
            'An automation tool with an AI step',
          ],
          answer: 2,
          explanation:
            'Automation tools connect apps and run steps on a trigger, and an AI step can do the summary.',
        },
        {
          id: 'starter-06-q2',
          prompt: 'Who are AI coding assistants mainly designed for?',
          choices: [
            'People who can read and review code',
            'People who never want to see code',
            'Only large companies',
            'Only designers',
          ],
          answer: 0,
          explanation:
            'They speed up coding, but their suggestions still need someone who can review them.',
        },
        {
          id: 'starter-06-q3',
          prompt: 'A non-programmer built a shop site with a vibe-coding tool and wants to add customer logins and payments. What is the wise move?',
          choices: [
            'Launch right away, the tool handles security',
            'Learn how those parts work, or get a developer to review them, before going live',
            'Store payment details in a spreadsheet instead',
          ],
          answer: 1,
          explanation:
            'Logins, payments and personal data are where generated apps most often need careful review.',
        },
        {
          id: 'starter-06-q4',
          prompt: 'What should you check first when trying any new AI tool?',
          choices: [
            'How many followers it has',
            'Whether it has a dark mode',
            'Whether it is the newest',
            'What it does with your data, and whether you can export your work',
          ],
          answer: 3,
          explanation:
            'Data handling and lock-in matter far more than popularity, especially for client or company work.',
        },
        {
          id: 'starter-06-q5',
          audience: { max: 'beginner' },
          prompt: "What is a terminal?",
          choices: ["A paid plan for an AI tool", "A window where you type commands to the computer instead of clicking", "The last page of an app", "A tool that writes code without any typing from you"],
          answer: 1,
          explanation: "A terminal is a text window for giving the computer commands. Coding assistants often work there or inside an editor, which is why they are made for people who can read code.",
        },
        {
          id: 'starter-06-q6',
          audience: { min: 'advanced' },
          prompt: "A teammate wants to connect a new MCP server found on a public list to the team's coding assistant, so that it can read the company's issue tracker. What is the sensible review?",
          choices: ["None is needed: MCP is a standard, so every server that follows it is safe", "Check that the server's demo looks polished and has many stars, then connect it", "Treat it like any new dependency: check who publishes it and its source, what permissions and token scopes it would get, whether write actions need human approval, and where the data it reads goes", "Connect it with an administrator token, so that it never fails because of missing permissions"],
          answer: 2,
          explanation: "An MCP server is code with access to your systems. Review its publisher, scopes, approvals and data flow like any dependency, and give it the least privilege that works. A standard describes the protocol, not the trustworthiness of a server.",
        },
      ],
      task: {
        title: 'Map your own tools',
        minutes: 15,
        steps: [
          'List every AI tool you have used or heard about at work or school.',
          'Put each under one of the four kinds: chat, coding, builder, automation.',
          'Run the "Pick a tool for a job" prompt with your real repetitive task.',
          'Open the privacy page of the tool it suggests and write one line on what it does with your data.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Open the website of one tool from the table. In one sentence, in your own words, write what the tool says it does and which of the four kinds it is. If a word on the site is new to you, ask an assistant to explain it.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Pick one AI tool your team uses or is considering. Fill a one-page review with four headings: access (repositories, tokens, scopes), approvals, data handling, and export. Write down one thing you would restrict before wider use.",
          ],
        },
      ],
    },
    {
      id: 'starter-07',
      day: 7,
      title: 'Picking your path',
      summary: 'Meet the five Talino career courses and choose the one that fits where you are now.',
      intro: { objectives: ['Describe who each of the five Talino career courses is for.', 'Choose the course that fits what you want in the next six months.', 'Say what the course projects prove, and what no course can promise.'], why: 'The best course is the one that gets you something real to show soon, whether that is a job, clients, better classes or a live site. Choosing for the next six months keeps your plan honest and doable.' },
      minutes: 15,
      skills: ['career-direction', 'ai-workflow'],
      body: [
        {
          type: 'paragraph',
          text: 'You made it to Day 7. You now know how AI assistants work, how to prompt them, how to check them and how to use them safely. Next, you go deeper in the direction that fits your life right now. Talino has five career courses.',
        },
        { type: 'heading', text: 'The five courses' },
        {
          type: 'list',
          items: [
            '**Developer:** for fresh IT and CS graduates and new developers. Build real projects with an AI coding assistant, learn to review its code, and prepare a portfolio and interview answers for your first role.',
            '**Experienced Developer:** for developers who still code mostly by hand. Bring AI into the workflow you already have: reviews, tests, refactoring, documentation, and knowing when not to use it.',
            '**Freelancer & VA:** for career changers and freelancers. Offer AI-assisted services, write better proposals for platforms like OnlineJobs.ph, and work with clients professionally.',
            '**Educator:** for IT instructors and professors. Plan lessons and assessments with AI, design activities that still test real learning, and guide students on honest AI use.',
            '**Builder:** for non-tech people who want their own app or website. Go from idea to a working site with vibe-coding tools, and learn enough to keep it safe and running.',
          ],
        },
        {
          type: 'table',
          headers: ['Course', 'For', 'What you do'],
          rows: [
            [
              'Developer',
              'Fresh IT and CS graduates and new developers',
              'Build real projects with an AI coding assistant, review its code, prepare a portfolio and interview answers.',
            ],
            [
              'Experienced Developer',
              'Developers who still code mostly by hand',
              'Bring AI into your workflow: reviews, tests, refactoring, documentation, and knowing when not to use it.',
            ],
            [
              'Freelancer & VA',
              'Career changers and freelancers',
              'Offer AI-assisted services and write better proposals for platforms like OnlineJobs.ph.',
            ],
            [
              'Educator',
              'IT instructors and professors',
              'Plan lessons and assessments with AI and guide students on honest AI use.',
            ],
            [
              'Builder',
              'Non-tech people who want their own app or website',
              'Go from idea to a working site with vibe-coding tools, and keep it safe and running.',
            ],
          ],
          caption: 'The five Talino career courses',
        },
        {
          type: 'activity',
          activity: {
            id: 'starter-07-match-1',
            kind: 'match',
            title: 'Who fits which course?',
            prompt: 'Read where each person is right now and what they want in the next six months. Match each one with the course that fits.',
            concept: 'career direction',
            labels: { terms: 'People', meanings: 'Course that fits' },
            pairs: [
              {
                term: 'Mika finished BSIT last April and wants a junior developer job, with projects she can show in interviews.',
                definition: 'Developer',
              },
              {
                term: 'Rafael has written Java at a bank for eight years, all by hand, and wants help with reviews and tests.',
                definition: 'Experienced Developer',
              },
              {
                term: 'Joy left her call-centre job and wants online clients who pay for AI-assisted admin support.',
                definition: 'Freelancer & VA',
              },
              {
                term: 'Sir Ramos teaches Programming 2 and keeps receiving take-home code that looks too perfect.',
                definition: 'Educator',
              },
              {
                term: 'Aling Nena runs a catering business and wants her own website with her menu, without learning to code.',
                definition: 'Builder',
              },
            ],
            hints: [
              'Ask what each person wants to have in six months: a first job, a better workflow, clients, better classes or a site.',
              'Two people are developers: one is just starting out, one has coded for years.',
              'Clients who pay for services point to one course; assignments that still test real learning point to another.',
            ],
            explanation: 'Mika needs a first job and proof, Rafael already codes and wants AI in his workflow, Joy wants paying clients, Sir Ramos needs assessments that still test learning, and Aling Nena wants a working site without becoming a programmer.',
          },
        },
        { type: 'heading', text: 'How to choose' },
        {
          type: 'paragraph',
          text: 'Pick the course that matches what you want in the next six months, not forever. You can take another one later. If two fit, start with the one that leads to something you can show sooner: a portfolio project, a client proposal, a lesson plan or a live site.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "You do not have to get this right. The five names describe people, not skill tests, so pick the one that sounds most like you today. Not knowing how to code is fine: programming experience and AI experience are different things. Someone who has never written a line of code can already use a chat assistant well, and an experienced developer can be new to coding assistants. Both are welcome here. If you pick one and it feels wrong, you can take another one later.",
        },
        {
          type: 'tip',
          text: 'Every course ends with projects that Tali reviews. Those projects are your proof. They show skills to an employer, client or school. No course can promise a job or clients, but real proof makes your case much stronger.',
        },
        {
          type: 'prompt',
          label: 'Talk it through',
          text: 'Help me choose a learning path. About me: [your background, current job or studies, and how many hours a week you can learn]. My goal for the next six months: [goal]. The options are: Developer, Experienced Developer, Freelancer & VA, Educator, Builder. Ask me up to three questions first, then recommend one and explain why in under 120 words. Be honest if my goal needs more time than I have.',
        },
        { type: 'heading', text: 'Before you go: your first project' },
        {
          type: 'paragraph',
          text: 'Your starter project is now open. You will use an assistant to make something small and real, then improve it yourself. It brings together everything from this week: a good prompt, careful checking, safe habits and your own judgement.',
        },
        {
          type: 'paragraph',
          audience: { max: 'beginner' },
          text: "The starter project is smaller than it sounds. If it feels big, shrink it: a one-page plan or a short guide is a perfectly good project. The point is to practise the loop of ask, check and change with something you really need. If your idea has any private detail in it, use made-up names and numbers.",
        },
        {
          type: 'paragraph',
          audience: { min: 'advanced' },
          text: "If you already ship software, treat the starter project as a baseline for your own workflow, not as a toy. Choose a recurring task from your real week (a test plan, a ticket summary, a diff review, a migration note), time it by hand once, then do it again with an assistant using a written prompt and a written check. Record the prompt, what the assistant got wrong and the time saved or lost. That record is your evidence: it shows where AI earns a place in your workflow, where it only adds review cost, and what belongs in team instructions or in CI. Share the prompt and the checklist with your team only after they have survived a second task.",
        },
        {
          type: 'warning',
          text: 'Be careful with any course, coach or post that promises a guaranteed salary or income from AI. Build skills and proof, and let the results follow.',
        },
        {
          type: 'takeaways',
          items: [
            'Talino has five career courses: Developer, Experienced Developer, Freelancer & VA, Educator and Builder.',
            'Choose for the next six months, not forever; you can take another later.',
            'If two fit, start with the one that gives you something to show sooner.',
            'Projects are proof of skill; no course can promise a job or income.',
            'Be careful with anyone promising guaranteed earnings from AI.',
          ],
        },
      ],
      quiz: [
        {
          id: 'starter-07-q1',
          prompt: 'A senior Java developer who rarely uses AI wants to work faster without losing quality. Which course fits best?',
          choices: ['Builder', 'Experienced Developer', 'Educator', 'Freelancer & VA'],
          answer: 1,
          explanation:
            'The Experienced Developer course brings AI into an existing coding workflow, which matches this goal.',
        },
        {
          id: 'starter-07-q2',
          prompt: 'A small bakery owner with no coding background wants an online order page. Which course fits?',
          choices: ['Builder', 'Developer', 'Experienced Developer'],
          answer: 0,
          explanation:
            'The Builder course takes non-tech people from an idea to a working site with vibe-coding tools.',
        },
        {
          id: 'starter-07-q3',
          prompt: 'What do the course projects give you?',
          choices: [
            'A guaranteed job offer',
            'A fixed monthly income',
            'Proof of your skills that you can show to employers, clients or schools',
          ],
          answer: 2,
          explanation:
            'Projects are evidence of what you can do. No course can guarantee a job or income.',
        },
        {
          id: 'starter-07-q4',
          prompt: 'Two courses both fit you. What is a good way to decide?',
          choices: [
            'Pick the one with more lessons',
            'Never decide, take both at once',
            'Pick the one your friends chose',
            'Start with the one that gets you something to show sooner',
          ],
          answer: 3,
          explanation:
            'Early proof keeps you motivated and useful. You can take the other course later.',
        },
        {
          id: 'starter-07-q5',
          audience: { max: 'beginner' },
          prompt: "You are not sure which course fits, and you worry that you are not technical enough. What does this lesson suggest?",
          choices: ["Learn to code first, and only then pick a course", "Skip the courses and rely on the starter project alone", "Pick the one that sounds most like you today; you can take another later, and not knowing how to code is fine", "Pick the hardest course, so that you are sure to learn a lot"],
          answer: 2,
          explanation: "The courses describe people and goals, not tests. You choose for the next six months, and you can take another course later.",
        },
        {
          id: 'starter-07-q6',
          audience: { min: 'advanced' },
          prompt: "You are a working developer deciding whether an assistant belongs in your code-review routine. Which approach gives the most reliable answer?",
          choices: ["Run it on a few real past pull requests where you already know the defects, and compare what it found and missed and how long it took", "Ask the assistant to rate how good it is at code review", "Read the vendor's launch announcement and its benchmark results", "Use it on every review for a month and go by how it felt"],
          answer: 0,
          explanation: "A small trial on cases where you know the answer produces evidence from your own code. Self-ratings, marketing and impressions do not.",
        },
      ],
      task: {
        title: 'Choose and plan',
        minutes: 10,
        steps: [
          'Run the "Talk it through" prompt with your real details.',
          'Choose one of the five courses.',
          'Block your learning time in your calendar for the next two weeks, about 15 minutes a day.',
          'Open the starter project and read its steps.',
        ],
      },
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Before choosing, write two sentences: what you want to be able to do in six months, and what worries you. Paste them into the \"Talk it through\" prompt, and ask the assistant to explain any word in its answer that you do not know.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Choose one recurring task from your real week and time it by hand. Repeat it with an assistant and a written check, then write down the time difference and what the assistant got wrong.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'starter-p1',
      title: 'Your first AI-assisted mini project',
      summary:
        'Use an AI assistant to make one small, real thing you need, such as a one-page plan, a short guide or a small script, then improve it yourself and explain what you changed.',
      outcome:
        'A real piece of work that shows you can prompt, check and improve AI output with your own judgement.',
      unlockAfterDay: 7,
      steps: [
        {
          id: 'starter-p1-s1',
          text: 'Pick something small you actually need: a one-page study or work plan, a short how-to guide for a coworker or classmate, or a small script that saves you time.',
        },
        {
          id: 'starter-p1-s2',
          text: 'Write a full prompt with context, a role, the task, an example or format, and constraints. Use fake data in place of any personal or client details.',
        },
        {
          id: 'starter-p1-s3',
          text: 'Improve the draft with at least two follow-up instructions in the same chat.',
        },
        {
          id: 'starter-p1-s4',
          text: 'Check it: verify every fact with a real source, or run the script and test it with at least three inputs.',
        },
        {
          id: 'starter-p1-s5',
          text: 'Edit the result yourself until it is something you would put your name on.',
        },
        {
          id: 'starter-p1-s6',
          text: 'Put the final version in a Google Doc, a GitHub Gist or a Notion page set to "anyone with the link can view". At the bottom, add a "What I changed" section: what you fixed, cut or added after the AI draft, and how you checked it.',
          link: 'https://gist.github.com',
        },
        {
          id: 'starter-p1-s7',
          audience: { max: 'beginner' },
          text: "Scaffold for newcomers: choose the one-page plan or the short guide, not the script. After the first draft, ask the assistant to explain anything you did not understand in plain words, then rewrite one paragraph in your own words and be ready to say why each sentence is there.",
        },
        {
          id: 'starter-p1-s8',
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "Choose the small script and make it a real tool: have it read input from a file or from an API you choose, handle a missing or wrong input without crashing, and write at least three automated tests before you ask the assistant for the code. Run them, and show one that failed first.",
        },
        {
          id: 'starter-p1-s9',
          audience: { min: 'advanced' },
          text: "Work in an existing codebase, your own or an open-source one you may use: have the assistant make one small change, review the diff line by line, run the existing tests, add a test for the change, and list one security or performance risk you checked, such as input validation, a secret or a new dependency.",
        },
        {
          id: 'starter-p1-s10',
          audience: { min: 'professional' },
          text: "Run it as a documented workflow: keep the prompt, the acceptance criteria and the review checklist in a file, and add a short evidence section with what the assistant got wrong, which check caught it and how long each step took compared with doing it by hand.",
        },
      ],
      submission: {
        kind: 'url',
        label: 'Link to your project',
        placeholder: 'https://docs.google.com/… or https://gist.github.com/…',
        hint: 'A viewable link to the final work, with a "What I changed" section at the bottom: your prompt, what you changed from the AI\'s draft and how you checked it.',
      },
      rubric: [
        'The work is small, finished and useful for a real purpose.',
        'The prompt includes context, a clear task and constraints.',
        'The "What I changed" section names specific edits made after the AI draft.',
        'Facts were checked against a real source, or the script was run and tested.',
        'No secrets, real personal data or confidential client or company material appear.',
      ],
      rubricExtra: [
        {
          audience: { max: 'beginner' },
          items: [
            "The learner can explain in their own words what the work says and why they kept or changed each part, and shows a clear before and after of the AI draft.",
          ],
        },
        {
          audience: { min: 'intermediate', max: 'intermediate' },
          items: [
            "The tool handles a missing or wrong input without crashing, and its automated tests were written before the code and are included.",
          ],
        },
        {
          audience: { min: 'advanced' },
          items: [
            "The change was made in an existing codebase, with the diff reviewed, a test added for the change, and at least one security or performance risk named and checked.",
          ],
        },
        {
          audience: { min: 'professional' },
          items: [
            "The prompt, acceptance criteria and review checklist are saved, with evidence of what the assistant got wrong, what check caught it and the time compared with doing it by hand.",
          ],
        },
      ],
    },
  ],
  icon: 'auto_awesome',
  updated: '2026-11-13',
};
