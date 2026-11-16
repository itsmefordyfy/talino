import type { Course } from './types';

export const developerCourse: Course = {
  id: 'developer',
  kind: 'career',
  level: 'beginner',
  title: 'Developer: Get Hired with AI',
  tagline: 'From fresh grad to job-ready developer who codes well with AI.',
  description:
    "A three-week path for new IT and CS graduates, and career changers learning to code, who want a first developer job where AI-assisted coding is expected. You will learn to use an AI coding assistant safely and well, build three AI projects you can show, and practise the interviews that stand between you and an offer.",
  finishLine: [
    'Three AI projects on GitHub, one of them deployed with a live link',
    'Daily habits for coding, testing and debugging with an AI assistant',
    'Practice with technical and behavioural mock interviews',
    'A junior-ready résumé, GitHub profile and job-search plan',
    'A Talino certificate',
  ],
  audiences: ['fresh-grad', 'career-changer'],
  skills: [
    { id: 'ai-assisted-coding', label: 'AI-assisted coding' },
    { id: 'code-quality', label: 'Testing, debugging and Git' },
    { id: 'full-stack', label: 'APIs, front ends and AI features' },
    { id: 'portfolio', label: 'Projects and portfolio' },
    { id: 'interviewing', label: 'Interviews' },
    { id: 'job-search', label: 'Job search and first job' },
  ],
  lessons: [
    {
      id: 'developer-01',
      day: 1,
      title: 'The junior market when AI writes code',
      summary: 'What employers now expect from a junior developer, and how you will prove it in three weeks.',
      intro: {
        objectives: [
          'Explain what a hiring team looks for in a junior developer now that AI writes code',
          'Name the five qualities (fundamentals, judgement with AI, proof, communication, safe habits) and tell which one an action shows',
          'Describe the three-week plan and what you will have built by the end',
        ],
        why: 'You are about to compete for junior roles, and employers now look for judgement and proof as much as for syntax. Knowing what they look for tells you where to spend the next three weeks.',
      },
      minutes: 15,
      skills: ['job-search', 'ai-assisted-coding'],
      body: [
        {
          type: 'paragraph',
          text: "Welcome. You are starting your developer career at a strange time. AI coding assistants can write a working function in seconds, and many teams now use them every day. So you may be asking: is there still room for a junior? There is, but the job looks a little different, and this course is built around that difference.",
        },
        { type: 'heading', text: 'What changed' },
        {
          type: 'paragraph',
          text: "Typing code is no longer the slow part. The valuable part is knowing **what** to build, breaking it into small steps, checking that the code is correct, and explaining your choices. A junior who pastes AI output without reading it creates work for the team. A junior who uses AI to move faster **and** can explain, test and fix the result is useful from week one.",
        },
        { type: 'heading', text: 'What hiring teams look for in a junior now' },
        {
          type: 'list',
          items: [
            '**Fundamentals:** variables, loops, functions, data structures, HTTP, SQL basics. AI does not replace these; it makes gaps easier to spot in an interview.',
            '**Judgement with AI:** you can say when you used AI, what you checked, and what you changed.',
            '**Proof:** working projects on GitHub with a clear README, tests and sensible commits.',
            '**Communication:** clear questions, short updates, polite code reviews.',
            '**Safe habits:** no secrets or company code pasted into tools that are not approved.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A few words you will meet all through this course. A **junior developer** is someone in their first developer job, who works with guidance from more experienced people. A **hiring team** is the people who decide whom to hire: usually a **recruiter**, who handles applications, and a developer who checks your skills. A **portfolio** is a small collection of projects you built that anyone can open and try. An **AI coding assistant** is a program that suggests or writes code from your instructions, like a very fast helper that sometimes makes mistakes. Employers cannot see inside your head, so they look for things they can check: projects, clear explanations and careful habits.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-01-match-1",
            kind: "match",
            title: "What does it show a hiring team?",
            prompt: "Each junior below did one thing a hiring team notices. Match each action with the quality it shows.",
            concept: "what hiring teams expect",
            labels: { terms: "What the junior did", meanings: "What it shows a hiring team" },
            pairs: [
              {
                term: "Asked to explain a loop the AI wrote, Eli traces it line by line on the whiteboard without help.",
                definition: "Fundamentals",
              },
              {
                term: "Paolo says Copilot drafted his search function, and that he added a test after it failed on empty input.",
                definition: "Judgement with AI",
              },
              {
                term: "Before applying, Bea makes sure her two best repos have a README, tests and clear commit messages.",
                definition: "Proof",
              },
              {
                term: "Stuck for an hour, Carlo messages his lead with what he tried, the error, and one specific question.",
                definition: "Communication",
              },
              {
                term: "Dana uses only the company-approved assistant and never pastes the database password into a public chatbot.",
                definition: "Safe habits",
              },
            ],
            hints: [
              "Ask what an interviewer or team lead learns about the person from each action.",
              "Being open about where AI helped and what you checked is different from knowing the basics yourself.",
              "Something an employer can open and run is proof; what you never paste into a tool is a habit.",
            ],
            explanation: "Tracing a loop alone shows fundamentals, saying what AI did and what you tested shows judgement, repos with a README and tests are proof, a clear question shows communication, and keeping secrets out of unapproved tools is a safe habit.",
          },
        },
        {
          type: 'paragraph',
          text: "Some companies allow AI in interviews and some ban it. Some teams use AI for everything and some barely use it. You will learn to do well in both worlds: strong enough to code without help, quick enough to code with it.",
        },
        { type: 'heading', text: 'Your plan for the next three weeks' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Days 1 to 6: set up your AI assistant, read and write code with it, and call an AI model from your own code. Project 1 opens.',
            'Days 7 to 12: Git, debugging, tests, a REST API, a front end and a good README. Project 2 opens.',
            'Days 13 to 17: code review, interview practice and deployment. Project 3, your capstone, opens.',
            'Days 18 to 20: résumé, applying, and your first 90 days on the job.',
          ],
        },
        {
          type: 'tip',
          text: "Tali can act as your **Mock interviewer** in this course. Use it often, even for five minutes. Short, regular practice beats one long session the night before an interview.",
        },
        {
          type: 'prompt',
          label: 'Find your starting point',
          text: "I am a fresh IT graduate in the Philippines aiming for my first junior developer job. Ask me 8 short questions, one at a time, to find out what I already know about programming fundamentals, Git, web development and using AI coding assistants. After my last answer, list my three strongest areas and my three biggest gaps, and suggest what to focus on first.",
        },
        {
          type: 'warning',
          text: "No course can promise you a job. What this course gives you is skills and proof: projects, practice and habits that an employer can see and test.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "If you review junior portfolios, treat output as cheap and look for judgement instead. A strong portfolio shows decisions and the reasons behind them: why this data model, why this library, what the tests cover, what was tried and rejected. It also shows system-level thinking even in a small project: where the trust boundaries are (browser, server, model provider), where secrets live, how failure is handled and how a stranger runs it. For AI-assisted work the useful evidence is a trail: a plan written before prompting, small commits, the places where the model was wrong and how you caught them, and tests you wrote or reviewed yourself. Expect a reviewer to open one commit and ask you to defend a line without the tool.",
        },
        {
          type: "takeaways",
          items: [
            "Typing code is no longer the slow part. Knowing what to build, checking it and explaining your choices is.",
            "A junior who uses AI to move faster and can explain, test and fix the result is useful from week one.",
            "Teams look for fundamentals, judgement with AI, proof on GitHub, clear communication and safe habits.",
            "Aim to be strong enough to code without AI and quick enough to code with it.",
            "No course can promise a job. Projects, practice and habits are the proof an employer can test.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-01-q1',
          prompt: 'With AI assistants writing code quickly, what makes a junior developer most valuable?',
          choices: [
            'Typing code faster than everyone else',
            'Checking, testing and explaining code, and breaking work into small steps',
            'Memorising the documentation of one framework',
            'Never using AI tools at all',
          ],
          answer: 1,
          explanation: 'Typing is no longer the slow part. Teams value people who can judge, test and explain code, whoever or whatever wrote it.',
        },
        {
          id: 'developer-01-q2',
          prompt: 'Why do fundamentals still matter when AI can write a function for you?',
          choices: [
            'They do not matter any more',
            'Because interviews only test syntax',
            'Because AI tools stop working without them',
            'Because you need them to judge whether the AI output is correct, and interviews often test them without AI',
          ],
          answer: 3,
          explanation: 'You cannot check code you do not understand, and many interviews still ask you to reason through problems on your own.',
        },
        {
          id: 'developer-01-q3',
          prompt: 'Which of these is the strongest proof of your skills for a junior role?',
          choices: [
            'A working project on GitHub with a README, tests and clear commits',
            'A list of programming languages on your résumé',
            'A screenshot of an AI chat that wrote your app',
            'A certificate with no project behind it',
          ],
          answer: 0,
          explanation: 'An employer can open a real project, read the code and run it. That says more than a list of keywords.',
        },
        {
          id: "developer-01-q4",
          audience: { max: "beginner" },
          prompt: "In everyday words, what is a portfolio for a new developer?",
          choices: [
            "A list of every programming word you have ever heard",
            "A small collection of projects you built that other people can open and try",
            "A certificate that proves you finished a course",
            "A private diary of what you studied each day",
          ],
          answer: 1,
          explanation: "A portfolio is a set of projects others can open and try. Employers cannot see how you think, so they check what you built.",
        },
        {
          id: "developer-01-q5",
          audience: { min: "advanced" },
          prompt: "You review a junior candidate's repository. Which finding tells you the most about their judgement with AI tools?",
          choices: [
            "A long list of languages and frameworks in the tech stack section",
            "A very large number of commits all made within one afternoon",
            "A polished interface with no tests and no notes about decisions",
            "A README section naming where the AI draft was wrong, how it was caught and which test was added afterwards",
          ],
          answer: 3,
          explanation: "Output is cheap with AI, so evidence of judgement is what the code alone cannot give: where the model failed, how it was noticed and what changed afterwards.",
        },
      ],
      task: {
        title: 'Map your starting point',
        steps: [
          'Paste the "Find your starting point" prompt into Tali or another AI assistant and answer honestly.',
          'Write down your three strongest areas and three biggest gaps in a notes file.',
          'Create a free GitHub account if you do not have one yet, and add a profile photo and your name.',
          'Block 15 to 30 minutes a day in your calendar for the next three weeks.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask any AI assistant to explain the words junior developer, portfolio and recruiter using an example from a shop. Write each one in a sentence of your own, and underline any word you still do not understand.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Pick one public repository from a developer you admire and review it as a hiring manager would: list three decisions you can see and one thing the repo alone cannot tell you. Then run the same review on your own best repo.",
          ],
        },
      ],
    },
    {
      id: 'developer-02',
      day: 2,
      title: 'Set up an AI coding assistant safely',
      summary: 'Install an AI coding assistant, learn what it can see, and set the safety rules you will follow at work.',
      intro: {
        objectives: [
          'Name the three ways an AI assistant helps you code, and which one needs the most careful review',
          'Explain what an assistant can see, and why you share code but never secrets',
          'Write a .gitignore that keeps .env files and node_modules out of Git',
          'Ask which AI tools are approved before you use one on company code',
        ],
        why: 'Leaking a key or company code into the wrong tool is one of the quickest ways for a new developer to lose trust. Safe habits set now are ones you never have to unlearn at your first job.',
      },
      minutes: 15,
      skills: ['ai-assisted-coding'],
      body: [
        {
          type: 'paragraph',
          text: "Today you set up the tool you will use for the rest of the course. There are many AI coding assistants, such as GitHub Copilot, Cursor or Claude Code, and they change often. Pick one that works with your editor and your budget. The habits you learn here carry over to any of them.",
        },
        { type: 'heading', text: 'Three ways AI helps you code' },
        {
          type: 'list',
          items: [
            '**Autocomplete:** suggestions appear as you type. Fast, but easy to accept without reading.',
            '**Chat:** you ask questions about your code and get explanations or snippets.',
            '**Agent mode:** the tool edits several files or runs commands for you. Powerful, so review every change before you keep it.',
          ],
        },
        {
          type: "table",
          caption: "Three ways AI helps you code",
          headers: [
            "Mode",
            "What it does",
            "How to use it safely",
          ],
          rows: [
            [
              "Autocomplete",
              "Suggests code as you type",
              "Read each suggestion before you accept it",
            ],
            [
              "Chat",
              "Answers questions about your code, with explanations or snippets",
              "Share code, never secrets",
            ],
            [
              "Agent mode",
              "Edits several files or runs commands for you",
              "Review every change before you keep it",
            ],
          ],
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Some of these words may be new. A **code editor** is a program for writing code, like a word processor for programs. **Git** saves versions of your project so you can go back. **Node.js** and **Python** are programs that run code written in those languages. An **AI coding assistant** reads the files you have open and suggests code. To do that it sends parts of your files over the internet to a company's computer, a **server**. That is why a **secret**, such as a password or an **API key** (a password-like code that lets a program use a paid service), must never sit in a file the assistant can see. A **.env file** is where such secrets are kept, and **.gitignore** tells Git which files to skip.",
        },
        { type: 'heading', text: 'Setup checklist' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Install a code editor such as VS Code, plus Git, Node.js (LTS version) and Python 3.',
            "Install the AI assistant you chose and sign in. If you are a student, check whether your school email qualifies you for student offers such as the GitHub Student Developer Pack.",
            "Open the assistant's settings and read what it does with your code: is it stored, and can it be used to train models? Choose the most private option you can.",
            'Create a practice folder and ask the assistant one question about a small file, to confirm it works.',
          ],
        },
        { type: 'heading', text: 'What the assistant can see' },
        {
          type: 'paragraph',
          text: "An assistant sends parts of your files to a server to get an answer. That means anything in your open files can leave your laptop: passwords, API keys, customer data. Treat the assistant like a helpful stranger. Share code, never secrets.",
        },
        {
          type: 'warning',
          text: "Never paste API keys, passwords, client data or company code into a tool your school or employer has not approved. At work, ask first: 'Which AI tools are we allowed to use with our code?'",
        },
        {
          type: 'paragraph',
          text: "Keep secrets in a `.env` file and tell Git never to track it. Create a `.gitignore` in every project before your first commit:",
        },
        {
          type: 'code',
          language: 'text',
          label: '.gitignore',
          code: `# secrets
.env
.env.*

# dependencies and builds
node_modules/
__pycache__/
.venv/
dist/`,
        },
        {
          type: "activity",
          activity: {
            id: "developer-02-fill-1",
            kind: "fill-blank",
            title: "Keep secrets out of Git",
            prompt: "Complete the `.gitignore` so Git never tracks your secret files or your installed dependencies.",
            concept: "secrets and gitignore",
            language: "text",
            code: "# secrets\n.env\n___\n\n# dependencies and builds\n___",
            blanks: [
              {
                answers: [
                  ".env.*",
                ],
                feedback: "You need a pattern that also covers variants such as `.env.local`. Look at the `.gitignore` above.",
              },
              {
                answers: [
                  "node_modules/",
                ],
                feedback: "Installed dependencies live in a folder that should not be committed. Which word in the bank is that folder?",
              },
            ],
            bank: [
              ".env.*",
              "node_modules/",
              "README.md",
              "package.json",
            ],
            hints: [
              "The first blank is a second secrets line; the second is something Git should skip because it can be reinstalled.",
              "Two of the words in the bank are files you do want in Git.",
              "The blanks are `.env.*` and `node_modules/`.",
            ],
            explanation: "`.env.*` keeps variants of the secrets file out of Git, and `node_modules/` keeps installed dependencies out, because they can be reinstalled from your project files.",
          },
        },
        {
          type: 'tip',
          text: "Many assistants let you add a rules or instructions file to a project, telling the AI your style, language version and what not to touch. Check your tool's docs for its name and format.",
        },
        {
          type: 'prompt',
          label: 'Write your personal AI rules',
          text: "I am a junior developer setting up an AI coding assistant. Help me write a short personal rules file (8 to 10 bullet points) that the assistant should follow in my projects. Include: explain any code before or after writing it, make small changes one step at a time, never add or print secrets, prefer simple standard-library solutions, and ask me before deleting files or adding dependencies.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the assistant as a new component in your threat model. Three things matter at team level. First, what leaves the machine: open files, terminal output and anything the tool can read, so check its exclusion settings and your employer's agreement. Second, what the tool can do: agent modes that run commands or edit files act with your permissions, so prefer least privilege and work from a clean tree you can diff. Third, what it reads: text in a dependency, a web page or an issue can contain instructions aimed at the model (prompt injection). Also remember that `.gitignore` only affects untracked files: a `.env` that was ever committed stays tracked until `git rm --cached`, and its value stays in history, so rotate it. Turn on secret scanning with push protection where it is available.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP's Top 10 for LLM Applications (2025 edition) lists Prompt Injection as LLM01 and Excessive Agency as LLM06. Git's gitignore documentation says files already tracked by Git are not affected by .gitignore and that git rm --cached stops tracking a file. GitHub's secret scanning push protection blocks pushes that contain supported secrets; repository-level push protection is disabled by default and a repository administrator can enable it.",
          checked: "2026-11-14",
          sources: [
            { label: "OWASP Top 10 for LLM Applications (2025)", url: "https://genai.owasp.org/llm-top-10/" },
            { label: "Git documentation: gitignore", url: "https://git-scm.com/docs/gitignore" },
            { label: "GitHub Docs: about push protection", url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "AI helps in three ways: autocomplete, chat and agent mode. Agent mode needs the most careful review.",
            "An assistant sends parts of your files to a server, so share code, never secrets.",
            "Read the assistant's data settings and choose the most private option you can.",
            "Keep secrets in a `.env` file and list it in `.gitignore` before your first commit.",
            "At work, ask which AI tools are approved for company code before you use one.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-02-q1',
          prompt: 'Your project has an API key in a file called `.env`. What should you do?',
          choices: [
            'Commit it so teammates can use it',
            'Add `.env` to `.gitignore` and keep the key out of chats with the AI',
            'Paste it into the AI chat so it can debug the connection',
            'Rename it to `key.txt`',
          ],
          answer: 1,
          explanation: 'Secrets stay local and out of Git. Ignoring `.env` prevents an accidental commit, and keeping keys out of AI chats keeps them off other servers.',
        },
        {
          id: 'developer-02-q2',
          prompt: "Which mode needs the most careful review before you keep its changes?",
          choices: [
            'Agent mode, which can edit many files or run commands',
            'Reading the documentation',
            'Chat, when you only ask for an explanation',
            'Turning the assistant off',
          ],
          answer: 0,
          explanation: 'Agent mode can change many files at once. Review the full diff before you accept it.',
        },
        {
          id: 'developer-02-q3',
          prompt: 'You start a new job. What is the right first step before using your favourite AI assistant on company code?',
          choices: [
            'Use it quietly; everyone does',
            'Use it only on weekends',
            'Ask which AI tools are approved for company code, and follow the policy',
            'Copy the code to a personal laptop first',
          ],
          answer: 2,
          explanation: 'Companies have rules about where their code may go. Asking first protects you and your employer.',
        },
        {
          id: 'developer-02-q4',
          prompt: "Why read the assistant's data settings?",
          choices: [
            'To make it type faster',
            'To change its colour theme',
            'To unlock extra programming languages',
            'To know whether your code is stored or used for training, and choose the most private option',
          ],
          answer: 3,
          explanation: 'Your code is sent to a server. Knowing what happens to it lets you make a safe choice.',
        },
        {
          id: "developer-02-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what is an API key?",
          choices: [
            "A password-like code that lets your program use a paid service, charged to your account",
            "The name of the program you use to write your code",
            "A file that lists which files Git should skip",
            "A setting that makes your assistant type faster",
          ],
          answer: 0,
          explanation: "An API key identifies your account to a service, so anyone who has it can spend your credits. That is why it lives in an environment variable and not in code.",
        },
        {
          id: "developer-02-q6",
          audience: { min: "advanced" },
          prompt: "A `.env` file was committed two months ago and is now listed in `.gitignore`. What is the right sequence?",
          choices: [
            "Do nothing, since listing the file in .gitignore already removed it from Git",
            "Delete the file from the folder and keep using the same key",
            "Rotate the key first, run `git rm --cached .env` so it stops being tracked, and enable secret scanning",
            "Rewrite history with a force-push and keep the old key because nobody can see it now",
          ],
          answer: 2,
          explanation: "Ignoring a file does not untrack one that is already tracked, and the old value remains in history and in other clones. Rotating the key is the step that makes the leak harmless.",
        },
      ],
      task: {
        title: 'Install and test your assistant',
        steps: [
          'Install VS Code (or your editor), Git, Node.js LTS and Python 3, and check them with `git --version`, `node --version` and `python3 --version` (`python --version` on Windows).',
          'Install an AI coding assistant and read its data and privacy settings.',
          'Create a folder called `talino-practice` with the `.gitignore` above.',
          'Use the prompt to write your personal AI rules and save them in a file called `AI_RULES.md` in that folder.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask your assistant: What is the difference between an editor, Git, Node.js and an AI assistant? Use a kitchen as the analogy. Then list each tool you installed and write beside it one sentence of what it does.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "In a throwaway repo, commit a fake `.env`, then add it to `.gitignore` and run `git status`. Notice it is still tracked, fix it with `git rm --cached .env`, and write down what you would also have to do if the value were a real key.",
          ],
        },
      ],
    },
    {
      id: 'developer-03',
      day: 3,
      title: 'Read and understand code with AI',
      summary: 'Use AI as a patient tutor to explain unfamiliar code, then prove you understood it by running and changing it.',
      intro: {
        objectives: [
          'Use the read loop: ask, predict, run, change',
          'Predict the output of a short Python function before you run it',
          'Decide whether to trust an AI explanation or the real behaviour of the program',
          'Map an unfamiliar project from its README, entry point and folder names',
        ],
        why: 'Most of your first job is reading code someone else wrote. A way to learn a codebase quickly, without taking an explanation on faith, makes you useful sooner.',
      },
      minutes: 15,
      skills: ['ai-assisted-coding', 'code-quality'],
      body: [
        {
          type: 'paragraph',
          text: "Most of your first job will be reading code someone else wrote. AI is very good at explaining code, but an explanation is not understanding. Today you learn a simple loop: ask, predict, run, change.",
        },
        { type: 'heading', text: 'The read loop' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Ask** the AI for a plain explanation of what the code does and why.',
            '**Predict** what the code will print or return for a specific input, before you run it.',
            '**Run** it and compare. If you were wrong, ask why.',
            '**Change** one small thing and predict again. This is where real understanding happens.',
          ],
        },
        { type: 'paragraph', text: 'Try it on this short Python function:' },
        {
          type: 'code',
          language: 'python',
          label: 'fare.py',
          code: `def fare(km, student=False):
    base = 13
    extra_km = max(0, km - 4)
    total = base + extra_km * 2
    if student:
        total = total * 0.8
    return round(total, 2)


print(fare(3))
print(fare(10))
print(fare(10, student=True))`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is what `fare.py` does, line by line. `def fare(km, student=False):` creates a **function**, a named recipe that takes inputs (the kilometres, and whether the rider is a student) and gives back a result. `base = 13` stores a number under a name, called a **variable**. `max(0, km - 4)` picks the bigger of 0 and the kilometres past the first 4, so a short ride never gives a negative number. `total = base + extra_km * 2` adds 2 for each extra kilometre. `if student:` runs the next line only for students, and `return` hands back the answer. `print` shows it on screen.",
        },
        {
          type: 'paragraph',
          text: "Before running it, write down what you think the three lines will print. The numbers are made-up example fares, not real rates. Then run `python3 fare.py` (or `python fare.py` on Windows) and check your guesses.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-03-python-1",
            kind: "predict-output",
            title: "Predict fare.py",
            prompt: "Read the program. What does it print? Work it out on paper before you pick an answer. (Python code is judged by a stored answer, not run in the app.)",
            concept: "reading code",
            language: "python",
            code: "def fare(km, student=False):\n    base = 13\n    extra_km = max(0, km - 4)\n    total = base + extra_km * 2\n    if student:\n        total = total * 0.8\n    return round(total, 2)\n\n\nprint(fare(3))\nprint(fare(10))\nprint(fare(10, student=True))",
            expected: "13\n25\n20.0",
            choices: [
              "13\n25\n20",
              "13\n25\n20.0",
              "13\n25\n25",
              "13\n29\n23.2",
            ],
            wrongNotes: {
              "13\n25\n20": "Close. `total * 0.8` gives a decimal number, so Python prints `20.0`, not `20`.",
              "13\n25\n25": "The third call passes `student=True`, so the total is multiplied by 0.8.",
              "13\n29\n23.2": "Only the kilometres beyond the first 4 count as extra. For 10 km that is 6 extra km.",
            },
            hints: [
              "Start with `fare(3)`: 3 km is less than 4, so `max(0, km - 4)` is 0.",
              "For 10 km, `extra_km` is 6, so the total is 13 + 6 x 2.",
              "The student fare multiplies that total by 0.8.",
            ],
            explanation: "fare(3) is 13 (no extra km). fare(10) is 13 + 6 x 2 = 25. With `student=True` the total is 25 x 0.8 = 20.0. Run the file to check your guess.",
          },
        },
        {
          type: 'prompt',
          label: 'Explain code like a tutor',
          text: "Explain this code to me like a patient senior developer teaching a junior. First give a two-sentence summary of what it does. Then go line by line in plain English. Then ask me two questions that check whether I understood it, and wait for my answers before telling me if I am right.\n\n[paste the code here]",
        },
        { type: 'heading', text: 'Reading a bigger project' },
        {
          type: 'paragraph',
          text: "For a whole repository, start from the edges: the README, the entry point (`main.py`, `index.js`, `server.js`), and the folder names. Ask the AI for a map, then open the files yourself.",
        },
        {
          type: 'prompt',
          label: 'Map a repository',
          text: "Here is the folder structure and README of a project I just joined. Give me a short map: what each folder is for, where the program starts, and the path a request or user action takes through the code. List three files I should read first and why.\n\n[paste the output of a folder listing such as `tree -L 2` or `ls -R`, and the README]",
        },
        {
          type: 'warning',
          text: "AI explanations can sound confident and still be wrong, especially about code it cannot fully see. Trust the program's real behaviour over the explanation. Running it is the final answer.",
        },
        {
          type: 'tip',
          text: "Keep a 'words I learned' list. When the AI uses a term you do not know, such as 'idempotent' or 'race condition', ask for a one-line meaning and an example, and add it to your list.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "In a real codebase you rarely read top to bottom. Start from behaviour: find the entry point, then follow one request with a debugger, a log line or `git grep` instead of guessing. History is documentation: `git log -p -- <file>` and `git blame` show when and why a line changed, and the linked pull request often records the decision. An AI summary of a repository is a hypothesis built from the files you pasted. It cannot see runtime configuration, feature flags or generated code, so confirm each claim in the code or a test. Before changing unfamiliar code, write a characterization test that records what it does today. Notice what `fare` silently decides: a negative `km` returns 13, and rounding of money and non-integer distances are product questions, not accidents.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "git blame shows, for each line of a file, the revision and author that last modified it (Git documentation).",
          checked: "2026-11-14",
          sources: [
            { label: "Git documentation: git blame", url: "https://git-scm.com/docs/git-blame" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "The read loop is ask, predict, run, change.",
            "Predict the output before you run the code, so a wrong guess shows which part you misunderstood.",
            "An explanation is not understanding. When the AI and the program disagree, trust the program.",
            "For a whole project, start from the README, the entry point and the folder names, then open the files yourself.",
            "Keep a \"words I learned\" list of terms the AI uses.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-03-q1',
          prompt: 'What does `fare(10)` return in the example?',
          choices: ['20', '25', '33', '13'],
          answer: 1,
          explanation: 'extra_km is 10 - 4 = 6, so the total is 13 + 6 x 2 = 25.',
        },
        {
          id: 'developer-03-q2',
          prompt: 'Why should you predict the output before running code?',
          choices: [
            'It is faster than running it',
            'The AI requires it',
            'A wrong prediction shows you exactly which part you misunderstood',
            'Predictions replace testing',
          ],
          answer: 2,
          explanation: 'Comparing your guess with the real result turns reading into active learning and exposes gaps.',
        },
        {
          id: 'developer-03-q3',
          prompt: "The AI's explanation and the program's real output disagree. Which do you trust?",
          choices: [
            "The program's real behaviour",
            "The AI's explanation, because it read the code",
            'Neither; delete the code',
            'Whichever sounds more confident',
          ],
          answer: 0,
          explanation: 'Running the code is the ground truth. Use the mismatch to ask a better question.',
        },
        {
          id: "developer-03-q4",
          audience: { max: "beginner" },
          prompt: "In plain words, what is a function in programming?",
          choices: [
            "A file that stores the passwords a program needs",
            "A message the AI sends when it has finished",
            "A named set of steps that takes inputs and gives back a result",
            "A button that restarts the whole program",
          ],
          answer: 2,
          explanation: "A function is a named recipe: inputs go in and a result comes out. `fare` takes a distance and a student flag and returns a price.",
        },
        {
          id: "developer-03-q5",
          audience: { min: "advanced" },
          prompt: "You inherit a service with no tests and an AI-written summary of its pricing module. What is the best first step before refactoring?",
          choices: [
            "Write characterization tests that record what the module returns today for representative inputs",
            "Rewrite the module from the summary and compare results in production",
            "Ask the AI to confirm that its own summary is accurate",
            "Read only the comments, because they describe the intent",
          ],
          answer: 0,
          explanation: "A characterization test pins down real current behaviour so a refactor can be checked against it. A summary, however good, is only a claim until the code or a test confirms it.",
        },
      ],
      task: {
        title: 'Run the read loop',
        steps: [
          'Save `fare.py`, predict its three outputs, then run it and compare.',
          'Change the student discount to 0.75 and predict the new output before running.',
          'Find a small open-source project on GitHub in a language you know and use the "Map a repository" prompt on its README and folder list.',
          'Add three new terms to your "words I learned" list.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Copy `fare.py` and write one comment above each line saying in your own words what it does. Ask the AI to check your comments (not to rewrite them) and note every line you got wrong.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "In a repository you did not write, choose one function and run `git log -p` and `git blame` on it. Write a three-line note: what it does, why it last changed and one input where you are unsure of the result, then confirm that input with a test.",
          ],
        },
      ],
    },
    {
      id: 'developer-04',
      day: 4,
      title: 'Write code with AI: small steps, tests first',
      summary: 'Describe the behaviour with tests, then let AI help you write the code in small, checkable steps.',
      intro: {
        objectives: [
          'Write a failing pytest test that describes one small behaviour',
          'Ask AI for the smallest code that passes, then read it and run the tests',
          'Explain why a new test should fail first',
          'Spot an AI change that edits a test to hide a bug',
        ],
        why: 'Tests give you a fast way to check AI-written code instead of trusting it. Teams expect juniors to work in small, tested steps, and interviewers ask about this habit.',
      },
      minutes: 15,
      skills: ['ai-assisted-coding', 'code-quality'],
      body: [
        {
          type: 'paragraph',
          text: "Asking an AI to 'build me an app' gives you a big pile of code you do not understand. Professionals work the other way: one small step at a time, each one checked before the next. The easiest way to check is to write the test first.",
        },
        { type: 'heading', text: 'The small-steps loop' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Write down the next tiny behaviour in one sentence.',
            'Write a test for it (or ask the AI to draft one, then read it carefully).',
            'Run the test and watch it fail. This proves the test can catch a problem.',
            'Ask the AI for the smallest code that passes, or write it yourself.',
            'Run the tests, read the code, commit, and pick the next step.',
          ],
        },
        {
          type: 'paragraph',
          text: "Say you need a function that turns text like `₱1,250.50` into a number. First the tests, using pytest (install it with `pip install pytest`):",
        },
        {
          type: 'code',
          language: 'python',
          label: 'test_money.py',
          code: `import pytest
from money import parse_peso


def test_plain_number():
    assert parse_peso("250") == 250.0


def test_sign_and_commas():
    assert parse_peso("₱1,250.50") == 1250.5


def test_empty_text_is_rejected():
    with pytest.raises(ValueError):
        parse_peso("   ")`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Read the test file like a checklist. `import pytest` loads a testing tool. Each `def test_...` is one **test**, a tiny program that checks one promise about your code. `assert` means this must be true: if it is not, the test fails and tells you. `parse_peso(\"250\") == 250.0` checks that the text 250 becomes the number 250. `pytest.raises(ValueError)` checks that the code refuses empty text by raising an **error**. A test that fails first is like trying a torch in the dark before you rely on it: you learn it really can show a problem.",
        },
        {
          type: 'paragraph',
          text: "Run `pytest`. It fails, because `money.py` does not exist yet. Good. Now ask for the smallest code that passes:",
        },
        {
          type: 'prompt',
          label: 'Smallest code that passes',
          text: "Here are my pytest tests. Write the smallest, simplest Python function in money.py that makes all of them pass. Use only the standard library. Do not add features the tests do not ask for. After the code, explain each line in one sentence.\n\n[paste your test file]",
        },
        { type: 'paragraph', text: 'A good answer looks like this:' },
        {
          type: 'code',
          language: 'python',
          label: 'money.py',
          code: `def parse_peso(text: str) -> float:
    cleaned = text.replace("₱", "").replace(",", "").strip()
    if not cleaned:
        raise ValueError("amount is empty")
    return float(cleaned)`,
        },
        {
          type: "activity",
          activity: {
            id: "developer-04-arrange-1",
            kind: "arrange",
            title: "Test first, then code",
            prompt: "Put the steps of the test-first loop for `parse_peso` in the right order.",
            concept: "test-first loop",
            language: "text",
            solution: [
              "Write test_money.py with the three tests",
              "Run pytest and watch the tests fail",
              "Ask the AI for the smallest code that passes",
              "Save the code as money.py and run pytest again",
              "Read the code, then commit",
            ],
            reasons: [
              "The tests describe the behaviour you want, so they come first.",
              "A test that fails first proves it can catch a missing behaviour. It fails because money.py does not exist yet.",
              "Now there is a precise target to give the AI.",
              "Run the tests again to check the answer.",
              "Read the code so you understand it, then save the step.",
            ],
            hints: [
              "You cannot watch a test fail before the test exists.",
              "The AI gets to write code only after the tests are failing.",
              "Committing is the last step, after you have read the code.",
            ],
            explanation: "Write the test, watch it fail, get the smallest code that passes, run the tests again, then read the code and commit. Each step is small and checked before the next.",
          },
        },
        {
          type: 'tip',
          text: "Real money is often stored as whole centavos (integers) to avoid rounding errors with floats. For a practice function this is fine, but it is a great question to ask in a code review.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Small steps have a limit: the smallest code that passes only covers what the tests ask. Try `parse_peso(\"1,2,3\")`. It returns 123.0, and `\"nan\"` returns `nan`, because no test forbids them. When your test file grows, group similar cases with `@pytest.mark.parametrize` so each input runs as its own reported test, then add the odd inputs (extra commas, negatives, letters) one at a time, each one failing before you fix the code.",
        },
        { type: 'heading', text: 'Why this works with AI' },
        {
          type: 'paragraph',
          text: "Tests turn a vague wish into a precise target. The AI has less room to guess, and you have an instant way to check its answer. When you later ask for a change, the old tests tell you if something broke.",
        },
        {
          type: 'warning',
          text: "Never let the AI 'fix' a failing test by changing the test itself unless the test was truly wrong. Read every change to a test file carefully.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat tests as the specification you hand the model, and review them harder than the code. Parametrized boundary cases are cheap and give each input its own failure report. Look at what passes by accident: the minimal `parse_peso` accepts `\"1,2,3\"` as 123.0 and lets `nan` and `inf` through, and float is the wrong type for money, so choose integer centavos or `decimal`, whose exactness the Python documentation describes. In a pipeline the test run is a gate, and an agent that may edit tests can empty the gate, so review test-file diffs separately, forbid test edits in the agent's instructions where you can, and check that a deliberate break turns the run red. Keep tests deterministic: stub the clock, the network and any model call.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "pytest's parametrize decorator runs a test once per parameter set and reports each as its own test. Python's decimal documentation says decimal numbers can be represented exactly, unlike binary floating point, which is why it suits money. Python's float() accepts the strings nan and inf.",
          checked: "2026-11-14",
          sources: [
            { label: "pytest documentation: how to parametrize", url: "https://docs.pytest.org/en/stable/how-to/parametrize.html" },
            { label: "Python documentation: decimal", url: "https://docs.python.org/3/library/decimal.html" },
            { label: "Python documentation: built-in types", url: "https://docs.python.org/3/library/stdtypes.html" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Work in small steps: one tiny behaviour, one test, then the smallest code that passes.",
            "Watch a new test fail first. That proves it can catch a problem.",
            "Tests turn a vague wish into a precise target, and tell you when a later change breaks something.",
            "Never let the AI \"fix\" a failing test by changing the test, unless the test was truly wrong.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-04-q1',
          prompt: 'Why should you watch a new test fail before writing the code?',
          choices: [
            'Because pytest requires it',
            'To make the test run faster',
            'So the AI knows the test exists',
            'It proves the test can actually detect a missing or broken behaviour',
          ],
          answer: 3,
          explanation: 'A test that never fails might not be testing anything. Seeing it fail first shows it works.',
        },
        {
          id: 'developer-04-q2',
          prompt: 'What does `parse_peso("₱1,250.50")` return with the example code?',
          choices: ['"1250.50"', '1250.5', '125050', 'A ValueError'],
          answer: 1,
          explanation: 'The peso sign and comma are removed, leaving "1250.50", which float() turns into 1250.5.',
        },
        {
          id: 'developer-04-q3',
          prompt: 'The AI makes a failing test pass by editing the test to expect the wrong value. What should you do?',
          choices: [
            'Reject the change and ask for a fix to the code instead, unless the test itself was wrong',
            'Accept it; the tests pass now',
            'Delete all the tests',
            'Ignore tests from now on',
          ],
          answer: 0,
          explanation: 'Tests describe the behaviour you want. Changing them to match buggy code hides the bug.',
        },
        {
          id: 'developer-04-q4',
          prompt: 'Which request will usually give you better AI-written code?',
          choices: [
            '"Build me a complete budgeting app"',
            '"Make it better"',
            '"Write the smallest function that passes these three tests, standard library only"',
            '"Write lots of code quickly"',
          ],
          answer: 2,
          explanation: 'A small, precise request with tests as the target leaves less room for guessing and is easy to check.',
        },
        {
          id: "developer-04-q5",
          audience: { max: "beginner" },
          prompt: "What does `assert` do in a test?",
          choices: [
            "Saves the result of the test into a file on disk",
            "Tells the AI which code to write next",
            "Makes the program run faster when tests pass",
            "States something that must be true, and makes the test fail if it is not",
          ],
          answer: 3,
          explanation: "assert states a promise about your code. If the promise is false, the test fails and reports it.",
        },
        {
          id: "developer-04-q6",
          audience: { min: "advanced" },
          prompt: "A coding agent turns a failing test green in a pull request. Which diff should block the merge?",
          choices: [
            "The agent added a new parametrized case next to the existing ones",
            "The agent loosened the failing assertion in the test file and left the production code unchanged",
            "The agent renamed a helper function and updated every call to it",
            "The agent added a type hint to an existing function",
          ],
          answer: 1,
          explanation: "Weakening the assertion hides the failure instead of fixing the code. Changes to test files in an agent diff need the closest review.",
        },
      ],
      task: {
        title: 'Test first with AI',
        steps: [
          'Create `test_money.py` and run `pytest` to see it fail.',
          'Use the prompt to get `money.py`, read it, and run the tests until they pass.',
          'Add one more test of your own, for example that `"abc"` raises a `ValueError`, and check whether the current code already handles it.',
          'Write one sentence in your notes about what surprised you.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "After each test in `test_money.py`, add a comment saying in your own words what promise it checks. Then change `250.0` to `251.0` in one test, watch it fail and read the failure message aloud.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Convert your tests to `@pytest.mark.parametrize`, add `\"1,2,3\"`, `\"nan\"` and `\"₱-5\"` with the behaviour you decide, make them fail first, then fix `parse_peso`. Write down whether you chose float, decimal or integer centavos, and why.",
          ],
        },
      ],
    },
    {
      id: 'developer-05',
      day: 5,
      title: 'Call an AI model from your own code',
      summary: 'Send a request to an AI model from a small Python script, with the key in an environment variable.',
      intro: {
        objectives: [
          'Describe how a script sends an HTTPS request to an AI model and reads the JSON reply',
          'Keep an API key in an environment variable, never in code, Git or a front end',
          'Say what to do when a key leaks',
          'Explain why you check the provider docs for the URL, headers and response shape',
        ],
        why: 'Employers increasingly want juniors who can build features that use AI, not only use AI tools. Handling the key safely is the first thing a reviewer checks in such a project.',
      },
      minutes: 15,
      skills: ['full-stack', 'ai-assisted-coding'],
      body: [
        {
          type: 'paragraph',
          text: "Using an AI assistant is one skill. Building an app that **uses** AI is another, and employers ask for it more and more. Today you write a tiny command-line tool that sends a question to an AI model and prints the answer.",
        },
        { type: 'heading', text: 'How it works' },
        {
          type: 'list',
          items: [
            'You sign up with an AI provider and create an **API key**. The key is like a password that is charged to your account.',
            'Your code sends an HTTPS request with the key, the model name and your message.',
            'The provider sends back JSON with the model reply.',
          ],
        },
        {
          type: "diagram",
          format: "json",
          caption: "One request from your script to an AI model",
          source: {
            kind: "sequence",
            title: "One AI request from your script",
            summary: "Your script reads the API key from an environment variable, sends an HTTPS request with the key, the model name and your message, and receives JSON with the reply.",
            participants: [
              {
                id: "script",
                label: "Your script",
              },
              {
                id: "env",
                label: "Environment variable",
              },
              {
                id: "provider",
                label: "AI provider",
              },
            ],
            messages: [
              {
                from: "script",
                to: "env",
                label: "Read AI_API_KEY",
              },
              {
                from: "env",
                to: "script",
                label: "The key",
                dashed: true,
              },
              {
                from: "script",
                to: "provider",
                label: "HTTPS request: key, model, message",
              },
              {
                from: "provider",
                to: "script",
                label: "JSON with the reply",
                dashed: true,
              },
            ],
          },
        },
        {
          type: 'warning',
          text: "The key must stay secret. Keep it in an environment variable, never in your code, never in Git, never in a front end that runs in the browser or on a phone. Anyone who has it can spend your credits. If it leaks, revoke it in the provider dashboard right away.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-05-match-1",
            kind: "match",
            title: "The pieces of an AI call",
            prompt: "Match each term from this lesson with what it means.",
            concept: "calling an AI model",
            pairs: [
              {
                term: "API key",
                definition: "A password-like secret that is charged to your account",
              },
              {
                term: "Environment variable",
                definition: "A setting outside your code that your program reads, where the key lives",
              },
              {
                term: "HTTPS request",
                definition: "What your code sends with the key, the model name and your message",
              },
              {
                term: "JSON reply",
                definition: "What the provider sends back, containing the model reply",
              },
              {
                term: "Revoke",
                definition: "Disable a leaked key in the provider dashboard",
              },
            ],
            hints: [
              "Two of the terms are things your code sends or receives. Which is which?",
              "The environment variable is where the key is kept, so your code never contains it.",
              "Revoking is what you do when a key leaks.",
            ],
            explanation: "The key is the secret, kept in an environment variable. Your code sends an HTTPS request and gets a JSON reply. If the key leaks, you revoke it.",
          },
        },
        {
          type: 'paragraph',
          text: "Providers differ in their URL, headers and JSON shape, and they change them over time. Many accept a request shaped like the example below (an OpenAI-compatible chat format). **Check your provider's current docs** and adjust the URL, model name and response path.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'ask.py',
          code: `import json
import os
import sys
import urllib.request

API_URL = "https://api.example.com/v1/chat/completions"  # from your provider's docs
MODEL = "your-model-name"  # from your provider's docs


def ask(question: str) -> str:
    key = os.environ.get("AI_API_KEY")
    if not key:
        sys.exit("Set the AI_API_KEY environment variable first.")
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": question}],
    }).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        data = json.load(response)
    return data["choices"][0]["message"]["content"]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit('Usage: python3 ask.py "your question"')
    print(ask(" ".join(sys.argv[1:])))`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "What `ask.py` does, step by step. An **API** is the front door one program offers so other programs can ask it for things. The `import` lines load tools Python already has. `os.environ.get(\"AI_API_KEY\")` reads the secret from a setting outside your code, and `sys.exit` stops with a friendly message if it is missing. `json.dumps` writes your question as **JSON**, plain text that labels each value, such as the model name and your message. `urllib.request` sends it to the provider's address (the **URL**), with the key in a **header**, an extra line that travels with the request. `json.load` reads the answer, and `data[\"choices\"][0]` picks the reply text out of it.",
        },
        { type: 'paragraph', text: 'Set the key for your terminal session, then run it:' },
        {
          type: 'code',
          language: 'bash',
          label: 'macOS / Linux',
          code: `export AI_API_KEY="paste-your-key-here"
python3 ask.py "Explain recursion in two sentences"`,
        },
        {
          type: 'code',
          language: 'powershell',
          label: 'Windows PowerShell',
          code: `$env:AI_API_KEY = "paste-your-key-here"
python ask.py "Explain recursion in two sentences"`,
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Your script has two weak spots a reviewer will notice. It does not handle a failed request: `urlopen` raises an error on a network problem and on an HTTP error status such as 429, so catch it and print a clear message. It also trusts the reply shape: `data[\"choices\"][0]` raises if the provider changes the shape or returns an error body, so check before you index. Keep the key out of anything you print, including error messages.",
        },
        {
          type: 'tip',
          text: "Set a spending limit or budget alert in the provider dashboard if it offers one. A loop that calls the API by mistake can use up credits fast.",
        },
        {
          type: 'prompt',
          label: 'Adapt to your provider',
          text: "I wrote a Python script that calls an AI model using urllib and an OpenAI-compatible chat format. I am using [provider name]. Based on their official documentation, tell me what I need to change: the URL, the headers, the request body and where the reply text is in the response. If you are not sure about any detail, say so and point me to the docs page to check.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the model call as an untrusted, metered and unreliable dependency. Set a timeout, and retry only transient failures (network errors, 429, 5xx) with exponential backoff and jitter, honouring a `Retry-After` header when present, and never retry an action you triggered from the reply unless it is idempotent. Validate the reply against a schema before using it. The output can be influenced by any content you put in the prompt, which is why OWASP lists prompt injection and improper output handling as separate risks: do not render it as HTML, execute it, or pass it to a shell or a SQL query. Log token counts and latency, not prompts with personal data. Use one key per environment with the lowest spend limit that works, keep calls on the server for per-user quotas, and mock the provider in tests.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "MDN notes that a 429 Too Many Requests response may include a Retry-After header saying how long to wait. OWASP's Top 10 for LLM Applications (2025) lists Prompt Injection (LLM01), Improper Output Handling (LLM05) and Unbounded Consumption (LLM10).",
          checked: "2026-11-14",
          sources: [
            { label: "MDN: 429 Too Many Requests", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429" },
            { label: "OWASP Top 10 for LLM Applications (2025)", url: "https://genai.owasp.org/llm-top-10/" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "An API key is a password-like secret charged to your account. Keep it in an environment variable, never in code, Git or a front end.",
            "Your code sends an HTTPS request with the key, the model name and your message, and gets JSON back.",
            "Providers differ in URL, headers and JSON shape, and change them, so check their current docs.",
            "Set a spending limit if the provider offers one, and revoke a leaked key right away.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-05-q1',
          prompt: 'Where should your AI API key live?',
          choices: [
            'In an environment variable, read by code that runs on your machine or server',
            'Hard-coded at the top of the script',
            'In the JavaScript of your web page',
            'In the README so others can try the app',
          ],
          answer: 0,
          explanation: 'Environment variables keep the key out of your code and Git history. Browser and app code can be read by anyone.',
        },
        {
          id: 'developer-05-q2',
          prompt: 'Your key was accidentally pushed to a public GitHub repo. What is the most important step?',
          choices: [
            'Delete the commit and hope nobody saw it',
            'Make the repo private and keep using the key',
            'Revoke the key in the provider dashboard and create a new one',
            'Rename the variable',
          ],
          answer: 2,
          explanation: 'Leaked keys can be copied within minutes. Revoking it is the only way to make it useless.',
        },
        {
          id: 'developer-05-q3',
          prompt: 'Why does the lesson tell you to check the provider docs?',
          choices: [
            'Because Python cannot send HTTPS requests',
            'Because URLs, headers, model names and response shapes differ between providers and change over time',
            'Because environment variables only work with some providers',
            'Because the docs contain your API key',
          ],
          answer: 1,
          explanation: 'There is no single universal format. The official docs are the source of truth for your provider.',
        },
        {
          id: "developer-05-q4",
          audience: { max: "beginner" },
          prompt: "In plain words, what is JSON?",
          choices: [
            "A programming language used to build web pages",
            "A plain-text way to write data as labelled values that programs can pass to each other",
            "A kind of password stored in an environment variable",
            "The name of the model an AI provider uses",
          ],
          answer: 1,
          explanation: "JSON writes data as labelled values in plain text, so your script and the provider's server can exchange messages in a shared format.",
        },
        {
          id: "developer-05-q5",
          audience: { min: "advanced" },
          prompt: "Your service calls a model API and sometimes receives 429 and 503 responses. Which retry policy is best?",
          choices: [
            "Retry immediately in a tight loop until a request succeeds",
            "Never retry, because every retry doubles the bill for that request",
            "Retry every status code, including 400, since one of them will work eventually",
            "Retry with exponential backoff and jitter, honour Retry-After, cap the attempts, and only for operations that are safe to repeat",
          ],
          answer: 3,
          explanation: "Backoff with jitter avoids hammering a service that is already struggling, Retry-After says when to come back, only repeatable operations are safe to retry, and a 400 will fail the same way every time.",
        },
      ],
      task: {
        title: 'Your first AI-powered script',
        steps: [
          'Choose an AI provider, create an API key and set a spending limit if one is offered.',
          'Save `ask.py`, adapt it to your provider using its docs, and set `AI_API_KEY` in your terminal.',
          'Run it with one question and confirm you get an answer.',
          'Run it once without the variable set and confirm it stops with the friendly message.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Read `ask.py` aloud one line at a time and write a note in plain words for each. Ask your AI assistant to confirm your notes without rewriting the code, and mark the ones you got wrong.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add a wrapper that retries only network errors, 429 and 5xx with backoff, validates the reply shape and exits with a clear error otherwise. Test it against a small local fake server that answers 429 twice and then 200.",
          ],
        },
      ],
    },
    {
      id: 'developer-06',
      day: 6,
      title: 'Plan your three portfolio projects',
      summary: 'Pick project ideas that solve a real problem, keep them small, and plan the AI feature in each.',
      intro: {
        objectives: [
          'Choose a project idea that starts from a real person and a one-sentence problem',
          'Decide whether an AI feature suits the problem',
          'Cut an idea down to an MVP of at most five features',
          'Plan what the user sees when the AI is wrong',
        ],
        why: 'Your three projects are your proof when you have no work history. Small, finished projects with a sensible AI feature impress more than big ones left half built.',
      },
      minutes: 15,
      skills: ['portfolio', 'full-stack'],
      body: [
        {
          type: 'paragraph',
          text: "Three good projects beat ten tutorial copies. A hiring manager looks at a junior portfolio for a few minutes, so each project must quickly show: a real problem, working code, a sensible use of AI, and that **you** understand it. Today you plan all three. Project 1 opens after this lesson.",
        },
        { type: 'heading', text: 'The three projects' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Project 1, an AI-powered CLI or API:** a small tool that calls an AI model and does one job well. Example: a CLI that turns messy meeting notes into a task list, or an API that tags customer messages as question, complaint or order.',
            '**Project 2, a full-stack app with an AI feature:** a front end, an API and data, with AI as one helpful feature, not the whole app. Example: a small-shop inventory app that drafts a restock message to a supplier.',
            '**Project 3, your capstone, deployed:** your best idea, polished, tested and online with a live link. Build on Project 2 or start fresh.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A few words to plan with. An **MVP** is a minimum viable product: the smallest version of your idea that still helps someone, like a food stall that starts with one dish. A **feature** is one thing the app can do. An **AI feature** is a feature where a model reads or writes text for the user, such as summarising a message. A **CLI** (command-line interface) is a program you run by typing in a terminal, and an **API** is a program that other programs talk to. A **capstone** is the final big project of a course. When you plan, write the problem in one sentence and keep the MVP to five features or fewer, so you can really finish.",
        },
        { type: 'heading', text: 'How to choose an idea' },
        {
          type: 'list',
          items: [
            'Start from a real person: a parent with a sari-sari store, a classmate organising a thesis, a barangay office with a paper queue.',
            'Describe the problem in one sentence before you think about technology.',
            'Ask: does AI make this clearly better? Summarising, classifying, drafting and extracting are good fits. Exact maths and facts that must be correct are not.',
            'Cut it down to the smallest version that is still useful (the MVP). You can add more later.',
          ],
        },
        {
          type: 'prompt',
          label: 'Brainstorm and cut down',
          text: "I am a junior developer building portfolio projects in [Python / JavaScript]. Suggest 6 small project ideas that solve real problems for people or small businesses in the Philippines, where calling an AI model clearly helps (summarising, classifying, drafting or extracting). For each: the problem in one sentence, who it helps, the AI feature, and a minimum version I can build in 3 to 4 days. Then ask me which two I like, and help me cut my favourite down to an MVP with at most 5 features.",
        },
        { type: 'heading', text: 'Write a one-page plan' },
        {
          type: 'code',
          language: 'markdown',
          label: 'PLAN.md',
          code: `# Project name

Problem: one sentence.
Who it helps: one sentence.
AI feature: what the model does, and what happens when it is wrong.

## MVP (max 5 features)
1.
2.
3.

## Not now
- ideas for later

## Done means
- it runs from a fresh clone using the README
- it has tests for the main logic
- no secrets in the repo`,
        },
        {
          type: "activity",
          activity: {
            id: "developer-06-fill-1",
            kind: "fill-blank",
            title: "Fill in the plan",
            prompt: "Complete the key lines of a `PLAN.md`.",
            concept: "planning an MVP",
            language: "markdown",
            code: "Problem: ___ sentence.\nAI feature: what the model does, and what happens when it is ___.\n\n## MVP (max ___ features)",
            blanks: [
              {
                answers: [
                  "one",
                ],
                feedback: "Describe the problem briefly, before you think about technology.",
              },
              {
                answers: [
                  "wrong",
                ],
                feedback: "The plan must say what the user sees when the AI output is not correct.",
              },
              {
                answers: [
                  "5",
                ],
                feedback: "The lesson caps the MVP at a small number of features.",
              },
            ],
            bank: [
              "one",
              "wrong",
              "5",
              "10",
              "right",
            ],
            hints: [
              "Read the PLAN.md template above again.",
              "AI output can be wrong, so the plan covers that case.",
              "The MVP has at most 5 features.",
            ],
            explanation: "A good plan states the problem in one sentence, says what happens when the AI is wrong, and keeps the MVP to at most 5 features.",
          },
        },
        {
          type: 'warning',
          text: "AI output can be wrong. Plan what the user sees when it is: let them edit the AI draft, show the original text beside a summary, or ask them to confirm before anything is saved or sent.",
        },
        {
          type: 'tip',
          text: "Use AI to help, but make sure the idea, the decisions and the explanations are yours. In an interview you will be asked why you built it this way.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Plan the AI feature as an engineering component, not a demo. Write acceptance criteria before building: which inputs, what counts as correct and how you will measure it. Keep a small evaluation set in the repo, real or realistic examples with the answer you expect, and re-run it whenever the prompt or model changes. Decide the failure behaviour up front: a deterministic fallback, a confidence check, or a human confirmation before anything is sent or saved. Estimate cost and latency per request and decide what data may leave your system. Use the model only where error is tolerable; exact arithmetic, permissions and identifiers belong in ordinary code. A portfolio that shows this plan is stronger than one extra feature.",
        },
        {
          type: "takeaways",
          items: [
            "Pick a real problem for a real person and describe it in one sentence before you think about technology.",
            "Summarising, classifying, drafting and extracting suit AI. Exact maths and facts that must be correct do not.",
            "Plan what the user sees when the AI is wrong: an editable draft, the original beside the summary, or a confirmation.",
            "The three projects are an AI-powered CLI or API, a full-stack app with an AI feature, and a deployed capstone.",
            "Make the idea, the decisions and the explanations yours. You will be asked why in interviews.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-06-q1',
          prompt: 'Which project idea uses AI most sensibly?',
          choices: [
            'Using AI to add up a shopping total',
            'Using AI to turn messy customer messages into tagged orders the owner can review',
            'Using AI to store passwords',
            'Using AI to count rows in a table',
          ],
          answer: 1,
          explanation: 'Classifying and extracting from messy text is a good fit for AI, especially when a person reviews the result. Exact arithmetic is better done in plain code.',
        },
        {
          id: 'developer-06-q2',
          prompt: 'What is an MVP?',
          choices: [
            'The most expensive version of the app',
            'A list of every feature you might add',
            'The final, finished product',
            'The smallest version that is still useful',
          ],
          answer: 3,
          explanation: 'A minimum viable product lets you finish something real, then improve it.',
        },
        {
          id: 'developer-06-q3',
          prompt: 'Why plan for the case where the AI is wrong?',
          choices: [
            'Because AI output is not always correct, and the user needs a way to check or fix it',
            'Because AI is always wrong',
            'Because employers do not like AI features',
            'You do not need to; models are reliable',
          ],
          answer: 0,
          explanation: 'Good AI features keep a person in control: editable drafts, confirmations and showing the source.',
        },
        {
          id: "developer-06-q4",
          audience: { max: "beginner" },
          prompt: "What is a feature of an app?",
          choices: [
            "One thing the app can do for its user, such as showing this week's schedule",
            "A bug that the AI introduced while generating code",
            "The colour theme that the app uses on every screen",
            "The list of people who helped to build the app",
          ],
          answer: 0,
          explanation: "A feature is a single thing the app lets the user do. Keeping the list short is how an MVP stays finishable.",
        },
        {
          id: "developer-06-q5",
          audience: { min: "advanced" },
          prompt: "You add an AI classifier to a portfolio project. Which plan shows the most engineering maturity?",
          choices: [
            "A demo video showing the three best examples that the model got right",
            "A much longer prompt with more instructions and no further checks",
            "A small evaluation set with expected labels in the repo, re-run when the prompt or model changes, and a defined fallback for uncertain output",
            "A README note saying that the chosen model is the most advanced available",
          ],
          answer: 2,
          explanation: "Repeatable measurement and a defined failure path are what turn an AI demo into a component someone can trust and change safely.",
        },
      ],
      task: {
        title: 'Write your Project 1 plan',
        steps: [
          'Use the brainstorm prompt and choose an idea for Project 1 (a CLI or API).',
          'Write `PLAN.md` with the problem, the AI feature and an MVP of at most 5 features.',
          'Note one idea each for Project 2 and Project 3 under "Not now".',
          'Ask Tali to review your plan and point out anything too big for 3 to 4 days.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write your PLAN.md as if explaining it to a friend who has never coded. Ask your AI assistant to underline every word a friend might not know, and replace each with a simpler one.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add an evaluation section to your plan: 15 example inputs with expected outputs, the pass rule, the fallback when the model is unsure and a rough cost per request. Commit it before you write the AI call.",
          ],
        },
      ],
    },
    {
      id: 'developer-07',
      day: 7,
      title: 'Git and GitHub: workflow and good commits',
      summary: 'Use branches, small commits and clear messages so your history tells a story employers can read.',
      intro: {
        objectives: [
          'Follow the everyday Git workflow from a new branch to a pushed commit',
          'Write a small commit with a clear message in the imperative',
          'Use small commits and git add -p to review and protect AI-made changes',
          'Explain why a secret removed in a new commit is still leaked',
        ],
        why: 'Reviewers read your Git history as part of your portfolio, and every team works with branches and pull requests. The same habits save you when an AI change goes wrong.',
      },
      minutes: 15,
      skills: ['code-quality', 'portfolio'],
      body: [
        {
          type: 'paragraph',
          text: "Your Git history is part of your portfolio. A repo with one commit called 'final' tells a reviewer nothing. A history of small, clear commits shows how you think and work. It also saves you when the AI breaks something: you can always go back.",
        },
        { type: 'heading', text: 'The everyday workflow' },
        {
          type: 'code',
          language: 'bash',
          label: 'One feature, start to finish',
          code: `git switch main
git pull
git switch -c feature/tag-messages

# ...make one small change, run the tests...
git status
git diff
git add -p
git commit -m "Add tag_message function with tests"

git push -u origin feature/tag-messages`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Terms first. **Git** keeps the history of your project. A **commit** is a saved snapshot with a short message. A **branch** is a separate line of work, like writing a draft in a copy so the original stays safe, and **main** is the branch holding the version everyone trusts. **GitHub** is a website that stores Git projects online, and a **pull request** is a message on GitHub saying: please look at my branch and add it to main. Line by line: `git switch -c` makes and moves to a new branch, `git add -p` lets you pick which changes to include, `git commit -m` saves them with a message, and `git push` uploads the branch.",
        },
        {
          type: 'paragraph',
          text: "Then open a pull request on GitHub, read your own diff, and merge it. Even when you work alone, pull requests give you a habit you will use every day at work.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-07-arrange-1",
            kind: "arrange",
            title: "One feature, start to finish",
            prompt: "Put the Git commands in the order of the everyday workflow.",
            concept: "git workflow",
            language: "bash",
            solution: [
              "git switch main",
              "git pull",
              "git switch -c feature/tag-messages",
              "git add -p",
              "git commit -m \"Add tag_message function with tests\"",
              "git push -u origin feature/tag-messages",
            ],
            reasons: [
              "Start from the main branch.",
              "Bring main up to date before you branch.",
              "Create the feature branch for your one idea.",
              "After making the change, stage it piece by piece.",
              "Save a snapshot of what you staged, with a clear message.",
              "Send the branch to GitHub, ready for a pull request.",
            ],
            hints: [
              "You branch from an up-to-date main, so main comes first.",
              "You cannot commit changes you have not staged yet.",
              "Pushing is last: it sends the commit you just made.",
            ],
            explanation: "Switch to main, pull, create the feature branch, stage with `git add -p`, commit with a clear message, then push the branch and open a pull request.",
          },
        },
        {
          type: "visual",
          id: "se-git-branching",
          caption: "Branches let you work on one idea without touching main.",
        },
        { type: 'heading', text: 'What a good commit looks like' },
        {
          type: 'list',
          items: [
            '**Small:** one idea per commit. If the message needs the word "and", it may be two commits.',
            '**Working:** tests pass at every commit.',
            '**Clear message:** a short summary in the imperative, like "Add", "Fix", "Remove", under about 50 characters, with more detail below if needed.',
            '**Clean:** no `.env`, no `node_modules`, no stray debug prints.',
          ],
        },
        {
          type: 'tip',
          text: "`git add -p` shows each change and asks whether to stage it. It is the best way to review AI-made changes piece by piece before they enter your history.",
        },
        { type: 'heading', text: 'Commit after every AI change you keep' },
        {
          type: 'paragraph',
          text: "Before you let an AI assistant make a bigger change, commit what you have. If the result is a mess, `git restore .` throws away the unstaged changes to tracked files and you are back to safety. (New files the AI created need `git clean`; check `git status` first.)",
        },
        {
          type: 'prompt',
          label: 'Write a commit message from a diff',
          text: "Here is the output of `git diff --staged`. Suggest a commit message: a summary line in the imperative mood under 50 characters, a blank line, then 1 to 3 short lines explaining why the change was made. If the diff contains more than one unrelated change, tell me and suggest how to split it.\n\n[paste the diff, after checking it contains no secrets]",
        },
        {
          type: 'warning',
          text: "Removing a secret in a new commit does not remove it from history. If a key was ever committed and pushed, treat it as leaked: revoke it and create a new one.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat history as an audit trail you will have to live with. Keep branches short-lived and pull requests reviewable. Agree a squash or rebase policy, never rewrite shared history, and use `git revert`, which records a new commit that undoes an earlier one, instead of rewriting main. Protect main with branch protection so approving reviews and passing checks are required, and use CODEOWNERS so the right reviewers are requested automatically. For AI-assisted changes, commit the reviewed state before and after an agent runs, keep generated changes in their own commits, and describe the AI's role in the pull request template if your team asks. If a secret was pushed, rotate it first: rewriting history does not remove copies in forks or clones.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "git revert records new commits that reverse earlier ones; it does not rewrite history (Git documentation). GitHub branch protection rules can require approving reviews and passing status checks, CODEOWNERS requests reviews from the owners of changed code, and a pull request template pre-fills the description. GitHub's guidance on leaked secrets says to revoke or rotate the secret first, because rewriting history alone does not remove copies elsewhere.",
          checked: "2026-11-14",
          sources: [
            { label: "Git documentation: git revert", url: "https://git-scm.com/docs/git-revert" },
            { label: "GitHub Docs: about protected branches", url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" },
            { label: "GitHub Docs: about code owners", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" },
            { label: "GitHub Docs: creating a pull request template", url: "https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository" },
            { label: "GitHub Docs: removing sensitive data from a repository", url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Your Git history is part of your portfolio: small, working commits with clear, imperative messages.",
            "Work on a branch, push it and open a pull request, even when you work alone.",
            "`git add -p` lets you review changes piece by piece, including AI-made ones.",
            "Commit before a big AI change, so `git restore .` can take you back.",
            "A secret removed in a new commit is still in the history. Revoke it and create a new one.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-07-q1',
          prompt: 'Which commit message is best?',
          choices: ['"final final v2"', '"stuff"', '"Fix crash when the notes list is empty"', '"changes"'],
          answer: 2,
          explanation: 'It is short, imperative and says exactly what changed. A reviewer can understand it without opening the diff.',
        },
        {
          id: 'developer-07-q2',
          prompt: 'Why commit before asking an AI agent to make a large change?',
          choices: [
            'So you can easily return to a working state if the change goes wrong',
            'Because Git requires it',
            'So the AI can read your commit messages',
            'It makes the AI faster',
          ],
          answer: 0,
          explanation: 'A commit is a save point. If the AI change breaks things, you can restore and try a smaller step.',
        },
        {
          id: 'developer-07-q3',
          prompt: 'What does `git add -p` help you do?',
          choices: [
            'Push to GitHub',
            'Delete a branch',
            'Create a pull request',
            'Review and stage changes piece by piece',
          ],
          answer: 3,
          explanation: 'Patch mode shows each change and lets you decide what goes into the commit.',
        },
        {
          id: 'developer-07-q4',
          prompt: 'You committed an API key last week and removed it today. Is it safe now?',
          choices: [
            'Yes, the latest version has no key',
            'No, it is still in the history; revoke it and create a new key',
            'Yes, if the repo has few stars',
            'Only if you rename the file',
          ],
          answer: 1,
          explanation: 'Git keeps every past version. Anyone with the repo can find the old key, so revoke it.',
        },
        {
          id: "developer-07-q5",
          audience: { max: "beginner" },
          prompt: "What is a branch in Git, in everyday words?",
          choices: [
            "A website where your Git projects are stored online",
            "A message asking someone to review your code",
            "A separate line of work, like a draft copy, so the main version stays safe",
            "A password that protects your repository",
          ],
          answer: 2,
          explanation: "A branch lets you work on one idea in its own line of history. Main stays untouched until you decide to merge.",
        },
        {
          id: "developer-07-q6",
          audience: { min: "advanced" },
          prompt: "An agent-assisted commit put an API key on main yesterday, and other commits have been merged on top. What do you do first?",
          choices: [
            "Revoke and rotate the key, then decide whether a history rewrite is still worth it given forks and clones",
            "Force-push a rewritten main immediately and keep using the same key",
            "Add the file to .gitignore and carry on with the next ticket",
            "Run git revert on the commit, which deletes the key from the history",
          ],
          answer: 0,
          explanation: "Once pushed, a secret should be treated as leaked. Rotation fixes the risk; a revert only adds a new commit, and rewriting history cannot reach every copy.",
        },
      ],
      task: {
        title: 'Set up your Project 1 repo',
        steps: [
          'Create a new repository on GitHub for Project 1 with a README and a Python or Node `.gitignore`.',
          'Clone it, add your `PLAN.md`, and commit with a clear message.',
          'Create a branch, make one small change, push it and open a pull request.',
          'Read your own diff on GitHub, then merge the pull request.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "In your notes, write each Git word you used today (branch, commit, push, pull request, main) with one sentence in your own words and a real-life comparison. Ask your assistant to check them, not to rewrite them.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Turn on branch protection for main in your repo (require a pull request, and a passing status check if you have one), add `.github/pull_request_template.md` with a line asking how AI was used and what you checked, then open a pull request to see both in action.",
          ],
        },
      ],
    },
    {
      id: 'developer-08',
      day: 8,
      title: 'Debug with AI',
      summary: 'Reproduce, read the error, form a guess, and use AI to test ideas instead of guessing blindly.',
      intro: {
        objectives: [
          'Debug with the method: reproduce, read the error, guess, test the guess, fix and protect',
          'Explain why average([]) crashes and decide what an empty list should return',
          'Tell a patch from a real fix',
        ],
        why: 'Bugs fill a large part of a junior day. A method that uses AI to test ideas, instead of accepting the first fix, finds causes faster and shows seniors you can be trusted with tickets.',
      },
      minutes: 15,
      skills: ['code-quality', 'ai-assisted-coding'],
      body: [
        {
          type: 'paragraph',
          text: "Pasting an error into a chat and accepting the first fix is tempting. Sometimes it works. Often it hides the real problem, or the AI 'fixes' something that was not broken. Good debugging is a method, and AI is a great partner inside that method.",
        },
        { type: 'heading', text: 'The method' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Reproduce:** find the exact steps or input that cause the bug, every time.',
            '**Read the error:** the last line names the error type; the lines above show where it happened.',
            '**Guess:** write one sentence about what you think is wrong.',
            '**Test the guess:** add a print or use a debugger to check values. Change one thing at a time.',
            '**Fix and protect:** fix the cause, then add a test so the bug cannot come back quietly.',
          ],
        },
        { type: 'paragraph', text: 'Here is a small bug to practise on:' },
        {
          type: 'code',
          language: 'python',
          label: 'scores.py',
          code: `def average(scores):
    return sum(scores) / len(scores)


print(average([90, 85, 78]))
print(average([]))`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is `scores.py` in plain words. `def average(scores)` makes a function that takes a list of numbers. `sum(scores)` adds them up and `len(scores)` counts them; dividing the total by the count gives the **average**. The first `print` works: 90, 85 and 78 add up to 253, and 253 divided by 3 is about 84.33. The second list is **empty**, so the count is 0, and dividing by 0 is impossible, so Python stops with an **error** called `ZeroDivisionError`. Read an error from the bottom: the last line names the problem, and the lines above show where it happened.",
        },
        {
          type: 'paragraph',
          text: "The second call crashes with `ZeroDivisionError: division by zero`, because an empty list has length 0. The fix is not to hide the error; it is to **decide** what an empty list should mean. Return 0? Return `None`? Raise a clearer error? That is a product decision, and a good one to state out loud.",
        },
        {
          type: 'prompt',
          label: 'Debug with me, not for me',
          text: "Help me debug this, but do not just give me a fix. First, explain what the error message means. Second, list the two or three most likely causes, from most to least likely. Third, tell me exactly what to print or check to find out which cause it is. Wait for my results before suggesting a fix.\n\nWhat I expected: [...]\nWhat happened: [...]\nFull error message: [...]\nRelevant code: [...]",
        },
        {
          type: 'tip',
          text: "Give the AI the full error, the code around it, what you expected, and what you already tried. Most bad AI debugging answers come from missing context.",
        },
        {
          type: 'paragraph',
          text: "When the AI suggests a fix, ask yourself: does this explain **why** the bug happened? If you cannot answer, you have a patch, not a fix.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-08-scenario-1",
            kind: "scenario",
            title: "A patch or a fix?",
            prompt: "What do you do next?",
            concept: "debugging method",
            situation: "`average([])` crashes with a division by zero. You paste the error into an AI chat and it gives you a one-line patch that makes the crash disappear. You do not yet know why the crash happened or what an empty list should mean.",
            options: [
              {
                text: "Ask why the bug happened, decide what an empty list should return, fix the cause and add a test for the empty case.",
                consequence: "You understand the bug, the behaviour is a decision you made, and a regression test fails if it ever comes back.",
                quality: "best",
              },
              {
                text: "Keep the patch. The crash is gone.",
                consequence: "The crash is gone, but you cannot say why the fix works or what the function now means for an empty list. You have a patch, not a fix.",
                quality: "acceptable",
              },
              {
                text: "Ask the AI to rewrite the whole file until the error goes away.",
                consequence: "A big rewrite can hide the real problem and change things that were not broken, and you now have much more code to check.",
                quality: "poor",
              },
            ],
            hints: [
              "Can you explain why the patch works?",
              "An empty list has length 0. What should the function mean by an average of nothing?",
              "The method ends with \"fix and protect\": fix the cause, then add a test.",
            ],
            explanation: "A good fix explains why the bug happened. Deciding what an empty list should mean is a product decision, and a test keeps the bug from returning quietly.",
          },
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Try the debugger on `scores.py`. Put `breakpoint()` on the line before the division and run the file: Python stops there and opens its debugger. Print `scores` and `len(scores)` to see the state, step with `n` and continue with `c`. For a bug you cannot place, `git bisect` runs a binary search through your history to find the commit that introduced it.",
        },
        {
          type: 'paragraph',
          text: "Also learn your editor's debugger. Setting a breakpoint and stepping through the code line by line, watching each variable change, often finds the cause faster than any chat. Ask the AI how to set one up for your language, then practise on this bug.",
        },
        {
          type: 'warning',
          text: "Before pasting logs or errors, remove passwords, tokens, emails and customer data. Error messages and stack traces often contain them.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Debugging a production system starts with evidence, not edits. Capture the failing input, the version and the environment, and get a failing test or a minimal reproduction before you touch code. Then narrow it by bisecting the history (`git bisect`) or the input. Separate the proximate cause (a division by zero) from the underlying one (nobody defined what an empty list means, or an upstream step should never have sent one). When you ask an AI, give it the stack trace, the smallest code that still fails and your hypothesis, and ask how to falsify it. A fix that makes the symptom vanish without explaining the cause is a patch. Scrub logs of personal data before sharing them, write the regression test, and for customer-visible bugs record how it was detected and what would have caught it sooner.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Python's built-in breakpoint() drops you into the debugger at the call site; by default it calls pdb.set_trace(), and the PYTHONBREAKPOINT environment variable can change that. git bisect uses a binary search to find the commit in your history that introduced a bug.",
          checked: "2026-11-14",
          sources: [
            { label: "Python documentation: built-in functions", url: "https://docs.python.org/3/library/functions.html" },
            { label: "Git documentation: git bisect", url: "https://git-scm.com/docs/git-bisect" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Debug with a method: reproduce, read the error, guess, test the guess, then fix and protect.",
            "Change one thing at a time, and give the AI the full error, the code, what you expected and what you tried.",
            "If you cannot say why a fix works, you have a patch, not a fix.",
            "Add a test so the bug cannot come back quietly, and learn your editor's debugger.",
            "Remove passwords, tokens and customer data from errors before you paste them anywhere.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-08-q1',
          prompt: 'What is the first step when a bug is reported?',
          choices: [
            'Ask the AI to rewrite the whole file',
            'Find the exact steps or input that make it happen every time',
            'Delete the code that crashed',
            'Restart your laptop',
          ],
          answer: 1,
          explanation: 'You cannot confirm a fix for a bug you cannot reproduce.',
        },
        {
          id: 'developer-08-q2',
          prompt: 'Why does `average([])` crash?',
          choices: [
            'sum() cannot handle lists',
            'Python does not allow empty lists',
            'len([]) is 0, and dividing by zero raises ZeroDivisionError',
            'The function has no return statement',
          ],
          answer: 2,
          explanation: 'sum([]) is 0 and len([]) is 0, so the code divides by zero.',
        },
        {
          id: 'developer-08-q3',
          prompt: 'After fixing a bug, what protects you from it coming back?',
          choices: [
            'A comment saying "fixed"',
            'Telling the team on chat',
            'Never touching that file again',
            'A test that reproduces the bug and now passes',
          ],
          answer: 3,
          explanation: 'A regression test fails if the bug returns, so you find out at once.',
        },
        {
          id: "developer-08-q4",
          audience: { max: "beginner" },
          prompt: "In a Python error message, where do you usually find the name of the problem?",
          choices: [
            "On the first line only, above everything else",
            "In the name of the file that was run",
            "Nowhere, because error messages are random",
            "On the last line, which names the error type",
          ],
          answer: 3,
          explanation: "Python prints where the error happened in the lines above and names the error type on the last line, so read from the bottom.",
        },
        {
          id: "developer-08-q5",
          audience: { min: "advanced" },
          prompt: "A bug appeared somewhere in the last 200 commits. You have an input that triggers it. What is the most efficient approach?",
          choices: [
            "Ask the AI to rewrite the module that looks most complicated",
            "Write a failing test for the input and use git bisect to find the first bad commit",
            "Revert the last twenty commits and hope the bug disappears",
            "Read all 200 diffs in order, from the oldest to the newest",
          ],
          answer: 1,
          explanation: "A failing test makes each step a yes or no question, and a binary search finds the first bad commit in a handful of steps instead of 200.",
        },
      ],
      task: {
        title: 'Debug on purpose',
        steps: [
          'Run `scores.py` and read the full error message.',
          'Use the "Debug with me" prompt, and follow its steps before accepting a fix.',
          'Decide what an empty list should return, implement it, and write a pytest test for the empty case.',
          'Commit the fix and the test with a clear message.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Read the error from `scores.py` aloud, last line first, and write what each line means in your own words. Ask your assistant to check your reading, and do not ask for a fix yet.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Reproduce the bug with a failing pytest test, add `breakpoint()` to inspect the state, fix the cause, and write a three-line note naming the proximate cause, the underlying cause and the test that now guards it.",
          ],
        },
      ],
    },
    {
      id: 'developer-09',
      day: 9,
      title: 'Write tests with AI',
      summary: 'Let AI draft tests and edge cases, then review them like a sceptic so they truly protect your code.',
      intro: {
        objectives: [
          'Ask AI for edge cases, then decide the correct behaviour yourself',
          'Review a test like a sceptic: a real assertion, an independent expected value, and a failure when the code is wrong',
          'Break code on purpose to check that your tests would catch a bug',
          'Pick inputs that tell correct code from broken code',
        ],
        why: 'AI can write tests that look busy and check nothing. Telling good tests from empty ones is what lets a team trust your pull requests.',
      },
      minutes: 15,
      skills: ['code-quality', 'ai-assisted-coding'],
      body: [
        {
          type: 'paragraph',
          text: "AI is very good at listing edge cases you forgot: empty input, negative numbers, very large values, wrong types. It is also good at writing tests that look busy but check nothing. Today you learn to get the first and avoid the second.",
        },
        {
          type: 'paragraph',
          text: "Here is a small JavaScript function and a test file using Node's built-in test runner (no install needed with a current Node LTS):",
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'cart.mjs',
          code: `export function cartTotal(items) {
  let total = 0;
  for (const item of items) {
    if (item.qty < 0) {
      throw new RangeError('qty cannot be negative');
    }
    total += item.price * item.qty;
  }
  return total;
}`,
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'cart.test.mjs',
          code: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartTotal } from './cart.mjs';

test('empty cart is 0', () => {
  assert.equal(cartTotal([]), 0);
});

test('adds price times quantity', () => {
  const items = [
    { price: 45, qty: 2 },
    { price: 120, qty: 1 },
  ];
  assert.equal(cartTotal(items), 210);
});

test('rejects a negative quantity', () => {
  assert.throws(() => cartTotal([{ price: 10, qty: -1 }]), RangeError);
});`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Read the two files in plain words. `cartTotal` takes the items in a shopping cart, each with a `price` and a `qty` (quantity). It starts a running `total` at 0, adds price times quantity for each item, and throws an error for a negative quantity. In the test file each `test(...)` names one promise, and `assert.equal(a, b)` checks that two values match. The second test says 45 pesos twice plus 120 pesos once should make 210. A **test runner** is the program that runs all your tests and reports which passed and which failed, with the difference when one fails.",
        },
        { type: 'paragraph', text: 'Run it with `node --test cart.test.mjs`.' },
        {
          type: 'prompt',
          label: 'Find the edge cases',
          text: "Here is a function and its current tests. List edge cases that are NOT tested yet, grouped as: empty or missing input, unusual numbers, wrong types, and business rules. For each, say what you think the correct behaviour should be, and mark any where the right behaviour is a decision I need to make. Do not write the tests yet.\n\n[paste the function and tests]",
        },
        { type: 'heading', text: 'Review AI tests like a sceptic' },
        {
          type: 'list',
          items: [
            '**Does it assert something real?** A test with no assertion, or one that only checks "no crash", proves little.',
            '**Is the expected value worked out independently?** If the test calls the same logic to compute the answer, it will agree with any bug.',
            '**Would it fail if the code were wrong?** Break the code on purpose (change `*` to `+`) and see whether a test fails.',
            '**Is it readable?** A test name should say the rule in plain words.',
          ],
        },
        {
          type: 'tip',
          text: "Breaking the code on purpose is a quick way to check your tests. If nothing fails when the code is wrong, the tests need work.",
        },
        {
          type: 'paragraph',
          text: "When you add a test to catch a bug, pick inputs where the correct code and the broken code give **different** answers. Say `*` is changed to `+`. A price of 2 and a quantity of 2 give 4 both ways, so that test cannot tell the code is wrong. A price of 45 and a quantity of 2 give 90 with `*` and 47 with `+`, so the test fails and catches the bug.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-09-scenario-1",
            kind: "scenario",
            title: "Catch the broken multiply",
            prompt: "Which test would catch the bug?",
            concept: "testing the tests",
            situation: "Your `cartTotal` tests only cover the empty cart and the negative quantity. You change `item.price * item.qty` to `item.price + item.qty` on purpose, and both tests still pass. You want to add one test that would fail because of this change.",
            options: [
              {
                text: "`cartTotal([{ price: 2, qty: 2 }])` should equal 4",
                consequence: "With the bug the result is 2 + 2 = 4, the same as 2 x 2. The test still passes, so it cannot tell the code is wrong.",
                quality: "poor",
              },
              {
                text: "`cartTotal([{ price: 45, qty: 2 }])` should equal 90",
                consequence: "With the bug the result is 47, so the test fails. A deliberate bug no longer slips through.",
                quality: "best",
              },
              {
                text: "`cartTotal([])` should equal 0 (again)",
                consequence: "The loop never runs for an empty cart, so it returns 0 with or without the bug.",
                quality: "poor",
              },
            ],
            hints: [
              "A test only helps if the right and the wrong code give different answers.",
              "Try each example with `+` in place of `*`. Which one gives a different result?",
              "Pick numbers where price + qty is not the same as price x qty.",
            ],
            explanation: "Choose inputs where the correct code and the broken code disagree. With 2 and 2, adding and multiplying both give 4, so that test cannot catch the bug. With 45 and 2 they give 47 and 90.",
          },
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Your tests check the rules you thought of, but not every input is sensible. Try `cartTotal([{ price: 10, qty: NaN }])`: it returns NaN, because `NaN < 0` is false. And `{ price: -10, qty: 1 }` returns -10. Add tests for both, decide the right behaviour (throw, or reject earlier), and use a stub, such as Node's `t.mock`, when a test would otherwise call a real service.",
        },
        {
          type: 'warning',
          text: "High test coverage is not the goal. Tests that check the important rules, including the ugly edge cases, are.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Coverage says which lines ran, not whether anything was checked, so judge a suite by how it fails. Change an operator, a boundary or a return value by hand, or with a mutation tool, and expect red. Prefer boundary values and property-style checks (adding an item never lowers the total) over repeated happy paths. Money needs an explicit type decision: `0.1 * 3` gives 0.30000000000000004 in JavaScript, so a cart should work in integer minor units. Keep tests fast and deterministic, and mock the network, the clock and any model call, because a real model call makes a slow, paid and flaky test. When an AI writes tests, review for tautologies, over-mocking, assertions about implementation details and tests that also pass on the buggy version, and require each new test to fail on the old code first.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Node's built-in test runner (node:test) is marked Stable in the current Node.js documentation and includes mocking through mock.fn and t.mock.method. Code coverage collection with --experimental-test-coverage is marked Experimental.",
          checked: "2026-11-14",
          sources: [
            { label: "Node.js documentation: test runner", url: "https://nodejs.org/api/test.html" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "AI is great at suggesting edge cases. You still decide the correct behaviour.",
            "Review AI tests like a sceptic: a real assertion, an expected value worked out independently, a failure if the code were wrong, and a readable name.",
            "Break the code on purpose to see whether a test fails.",
            "Coverage is not the goal. Checking the important rules, including the ugly edge cases, is.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-09-q1',
          prompt: 'You change `*` to `+` in `cartTotal` and every test still passes. What does that tell you?',
          choices: [
            'The tests are not checking the calculation well enough',
            'The code is correct either way',
            'Node is broken',
            'You should delete the tests',
          ],
          answer: 0,
          explanation: 'Good tests fail when the code is wrong. If a deliberate bug survives, add a test that catches it.',
        },
        {
          id: 'developer-09-q2',
          prompt: 'What is the total in the "adds price times quantity" test?',
          choices: ['165', '167', '210', '240'],
          answer: 2,
          explanation: '45 x 2 = 90, plus 120 x 1 = 120, gives 210.',
        },
        {
          id: 'developer-09-q3',
          prompt: 'What is AI especially useful for when writing tests?',
          choices: [
            'Deciding the business rules for you',
            'Guaranteeing 100% correct code',
            'Replacing code review',
            'Suggesting edge cases you might have missed',
          ],
          answer: 3,
          explanation: 'AI is good at brainstorming cases. You still decide the correct behaviour and review the tests.',
        },
        {
          id: 'developer-09-q4',
          prompt: 'Why is it a problem when a test computes its expected value using the same function it tests?',
          choices: [
            'It makes the test too slow',
            'The test will agree with the code even when the code is wrong',
            'Node does not allow it',
            'It uses too much memory',
          ],
          answer: 1,
          explanation: 'The expected value should come from your own reasoning or a known example, not from the code under test.',
        },
        {
          id: "developer-09-q5",
          audience: { max: "beginner" },
          prompt: "What is a test runner?",
          choices: [
            "A person who reviews your pull requests each morning",
            "A program that runs all your tests and tells you which ones passed or failed",
            "A tool that writes the production code for you",
            "A setting that hides errors so tests always pass",
          ],
          answer: 1,
          explanation: "The test runner finds your tests, runs them and reports each result, so you can see at a glance what broke.",
        },
        {
          id: "developer-09-q6",
          audience: { min: "advanced" },
          prompt: "A suite reports 95% coverage, yet flipping `>=` to `>` in a boundary check fails nothing. What does that show?",
          choices: [
            "The coverage figure is wrong and the tool should be replaced",
            "The boundary does not matter when coverage is above ninety percent",
            "The AI-generated tests are fine because they run quickly",
            "The tests run the line without asserting on the boundary, so add boundary cases that fail on the mutated code",
          ],
          answer: 3,
          explanation: "Coverage counts executed lines, not checked behaviour. A surviving mutation points to a missing assertion at the boundary.",
        },
      ],
      task: {
        title: 'Strengthen a test suite',
        steps: [
          'Save `cart.mjs` and `cart.test.mjs`, and run `node --test cart.test.mjs`.',
          'Use the edge-case prompt and pick two cases to add, deciding the correct behaviour yourself.',
          'Break the code on purpose and confirm at least one test fails, then undo the break.',
          'Add tests for the main logic of your Project 1 the same way.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Before running the tests, write in plain words what each of the three tests promises. Run them, then change one expected number and read the failure message, and say what it tells you.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add boundary and invalid-input tests (NaN, a negative price, a string quantity, a fractional quantity), decide each behaviour and fix `cartTotal`, then switch it to integer centavos. Stub any outside call, and confirm each new test fails on the old code first.",
          ],
        },
      ],
    },
    {
      id: 'developer-10',
      day: 10,
      title: 'Build a small REST API',
      summary: 'Create a Node.js API with Express, return the right status codes, and validate what comes in.',
      intro: {
        objectives: [
          'Match HTTP methods and status codes to what they mean',
          'Build a small Express API with a GET route and a POST route',
          'Validate input, returning 400 for bad input and 201 for a created note',
          'Say where an AI call belongs in a web app',
        ],
        why: 'Almost every app you will work on talks to an API, and interviewers ask about methods, status codes and validation. A working API is also the base of your Project 2.',
      },
      minutes: 15,
      skills: ['full-stack'],
      body: [
        {
          type: 'paragraph',
          text: "Almost every app you will work on talks to an API. Today you build a tiny one: a notes API with two routes. It is small on purpose, so you can understand every line, then grow it with AI help.",
        },
        { type: 'heading', text: 'REST in one minute' },
        {
          type: 'list',
          items: [
            '**Resources** are nouns in the URL: `/notes`, `/notes/3`.',
            '**Methods** are verbs: GET reads, POST creates, PUT or PATCH updates, DELETE removes.',
            '**Status codes** tell the caller what happened: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error.',
            '**JSON** is the usual format for the body.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "developer-10-match-1",
            kind: "match",
            title: "Methods and status codes",
            prompt: "Match each HTTP method or status code with what it means in the notes API.",
            concept: "rest basics",
            pairs: [
              {
                term: "GET",
                definition: "Reads a resource",
              },
              {
                term: "POST",
                definition: "Creates a resource",
              },
              {
                term: "201",
                definition: "Created: a new resource was made",
              },
              {
                term: "400",
                definition: "Bad Request: the caller sent bad input",
              },
              {
                term: "404",
                definition: "Not Found: nothing exists at that address",
              },
              {
                term: "500",
                definition: "Server Error: the server itself failed",
              },
            ],
            hints: [
              "Methods are verbs; status codes are the answer.",
              "A 4xx code means the caller did something wrong; 5xx means the server did.",
              "201 is the code for something that was just created.",
            ],
            explanation: "Methods say what the caller wants to do. Status codes say what happened: 201 created, 400 bad input from the caller, 404 not found, 500 a failure on the server.",
          },
        },
        {
          type: "visual",
          id: "web-http-explorer",
          caption: "Try each method and watch the status code that comes back.",
        },
        {
          type: 'paragraph',
          text: "In a new folder, run `npm init -y` and `npm install express`, then create this file:",
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'server.mjs',
          code: `import express from 'express';

const app = express();
app.use(express.json());

const notes = [];
let nextId = 1;

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const text = req.body?.text;
  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'text is required' });
  }
  const note = { id: nextId++, text: text.trim() };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "An **API** (application programming interface) is a set of addresses a program can visit to ask for something or send something, like a restaurant's order window. **REST** is a common style where each address stands for a thing (`/notes`) and the method says what to do with it. In the code, `express()` creates the server. `app.get('/notes', ...)` answers visits that read notes and `app.post('/notes', ...)` answers visits that send a new one. `req.body` is what the caller sent, `res.status(400)` sets the answer code and `res.json` sends data back. The `notes` list lives in memory, and `app.listen(3000)` makes the server wait for visitors at port 3000, like a door number.",
        },
        {
          type: 'paragraph',
          text: "Start it with `node server.mjs`, then try it from a second terminal (on Windows, use Git Bash or a tool such as Postman or Bruno, because quoting differs):",
        },
        {
          type: 'code',
          language: 'bash',
          label: 'Try your API',
          code: `curl http://localhost:3000/notes

curl -X POST http://localhost:3000/notes \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Pay the electric bill"}'

curl -X POST http://localhost:3000/notes \\
  -H "Content-Type: application/json" \\
  -d '{}'`,
        },
        {
          type: 'paragraph',
          text: "The last request should return 400, because the API checks its input. **Never trust what comes in.** Validation is one of the first things reviewers look for.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-10-js-1",
            kind: "code-challenge",
            title: "Validate a note like the API does",
            prompt: "Write `checkNote(body)`. If `body.text` is not a non-empty string (after trimming), return `{ status: 400, error: 'text is required' }`. Otherwise return `{ status: 201, text: <the trimmed text> }`.",
            concept: "input validation",
            language: "javascript",
            starter: "function checkNote(body) {\n  // your code here\n}\n",
            solution: "function checkNote(body) {\n  const text = body?.text;\n  if (typeof text !== 'string' || text.trim() === '') {\n    return { status: 400, error: 'text is required' };\n  }\n  return { status: 201, text: text.trim() };\n}\n",
            tests: {
              kind: "function",
              fn: "checkNote",
              cases: [
                {
                  label: "checkNote({ text: '  Pay the bill ' })",
                  args: [
                    {
                      text: "  Pay the bill ",
                    },
                  ],
                  expected: {
                    status: 201,
                    text: "Pay the bill",
                  },
                },
                {
                  label: "checkNote({})",
                  args: [
                    {},
                  ],
                  expected: {
                    status: 400,
                    error: "text is required",
                  },
                },
                {
                  label: "checkNote({ text: '   ' })",
                  args: [
                    {
                      text: "   ",
                    },
                  ],
                  expected: {
                    status: 400,
                    error: "text is required",
                  },
                },
                {
                  label: "checkNote({ text: 42 })",
                  args: [
                    {
                      text: 42,
                    },
                  ],
                  expected: {
                    status: 400,
                    error: "text is required",
                  },
                },
                {
                  label: "a hidden case",
                  args: [
                    {
                      text: "",
                    },
                  ],
                  expected: {
                    status: 400,
                    error: "text is required",
                  },
                  hidden: true,
                },
              ],
            },
            hints: [
              "First read `text` out of `body`, then decide whether it is valid.",
              "Two things make it invalid: it is not a string, or it is only spaces. `trim()` removes spaces.",
              "Check `typeof text !== 'string' || text.trim() === ''` and return the 400 object, otherwise the 201 object.",
            ],
            explanation: "This is the same check the Express route makes: reject anything that is not a non-empty string with a 400, and otherwise accept the trimmed text with a 201.",
          },
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "When you replace the array with a database, never build SQL by pasting user text into a string. Use placeholders: Python's sqlite3 documentation warns that queries assembled with string operations are open to SQL injection and says to bind values with `?`; other database drivers have the same idea. Return 404 for an unknown id, and send errors to one error-handling middleware with four arguments, `(err, req, res, next)`, so every route fails in the same way.",
        },
        {
          type: 'warning',
          text: "The notes live in memory, so they disappear when the server restarts. That is fine for learning. For a real app, store them in a database such as SQLite or PostgreSQL.",
        },
        {
          type: 'prompt',
          label: 'Grow the API one route at a time',
          text: "Here is my small Express API. Add ONE new route: DELETE /notes/:id, which removes a note and returns 204, or 404 with a JSON error if the id does not exist. Keep my style. Then show me the curl commands to test the success case and the 404 case, and explain how the id from the URL is turned into a number.\n\n[paste server.mjs]",
        },
        {
          type: 'tip',
          text: "This is also where an AI call belongs in a web app: in a route on your server, using the key from an environment variable. The browser calls your API; your API calls the AI.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Check an API like an attacker and a client would. Use 400 for a malformed request, 422 when the request is well formed but its content fails validation (pick one convention and document it), 401 when credentials are missing or invalid and 403 when they are valid but not allowed, and 429 with Retry-After for rate limits. GET, PUT and DELETE are idempotent while POST is not, so a retried POST can create duplicates unless you design for it, for example with an idempotency key. Limit body size (body-parser's JSON default is 100kb) and paginate lists. Enforce authorisation on the server for every resource: the first item in OWASP's 2025 Top 10 is Broken Access Control. Add one error handler and a test per route; Express's guide says an async handler that rejects passes its error on automatically.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "MDN: 422 means the server understood the content type and syntax but could not process the instructions; 401 means credentials are missing or invalid, while 403 means valid credentials without permission; 429 may carry a Retry-After header; GET, PUT and DELETE are idempotent and POST is not guaranteed to be. Express: body-parser's JSON limit defaults to 100kb, and the error-handling guide says an async handler that returns a rejected promise calls next with the error. OWASP Top 10:2025 puts Broken Access Control first (A01).",
          checked: "2026-11-14",
          sources: [
            { label: "MDN: 422 Unprocessable Content", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422" },
            { label: "MDN: 401 Unauthorized", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401" },
            { label: "MDN: 429 Too Many Requests", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429" },
            { label: "MDN: idempotent", url: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent" },
            { label: "Express: body-parser middleware", url: "https://expressjs.com/en/resources/middleware/body-parser.html" },
            { label: "Express: error handling", url: "https://expressjs.com/en/guide/error-handling.html" },
            { label: "OWASP Top 10:2025", url: "https://top10.owasp.org/2025" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "REST: resources are nouns in the URL, methods are verbs, status codes tell the caller what happened, and JSON is the usual body.",
            "Return 201 for a created resource, 400 for bad input, 404 when something does not exist, and 500 only when the server itself fails.",
            "Never trust what comes in: validate the input.",
            "Notes kept in memory disappear on restart. A real app needs a database.",
            "An AI call belongs in a server route, with the key in an environment variable.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-10-q1',
          prompt: 'Which status code should a successful POST that creates a note return?',
          choices: ['200', '404', '500', '201'],
          answer: 3,
          explanation: '201 Created tells the caller a new resource was made.',
        },
        {
          id: 'developer-10-q2',
          prompt: 'A client sends a POST with no `text`. What should the API return?',
          choices: [
            '201 with an empty note',
            '400 with a JSON error message',
            '500, because the server failed',
            'Nothing; ignore the request',
          ],
          answer: 1,
          explanation: 'The client sent bad input, so 400 Bad Request with a clear error is right. 500 means the server itself failed.',
        },
        {
          id: 'developer-10-q3',
          prompt: 'Where should the code that calls an AI model run in a web app?',
          choices: [
            'In a server route, with the key in an environment variable',
            'In the browser JavaScript, so it is faster',
            'In the HTML file',
            'In the CSS',
          ],
          answer: 0,
          explanation: 'Browser code can be read by anyone, so the key must stay on the server.',
        },
        {
          id: "developer-10-q4",
          audience: { max: "beginner" },
          prompt: "In everyday terms, what does the word API mean?",
          choices: [
            "A set of addresses a program can visit to ask for something or send something",
            "A kind of web page that shows pictures and text",
            "A password that unlocks a database for one person",
            "A tool that checks the spelling of your code",
          ],
          answer: 0,
          explanation: "An API is the front door a program offers so other programs can ask it for things, like an order window at a restaurant.",
        },
        {
          id: "developer-10-q5",
          audience: { min: "advanced" },
          prompt: "A client retries `POST /orders` after a timeout and the customer is charged twice. Which design change fixes the cause?",
          choices: [
            "Switch the route to GET so that it can be retried freely",
            "Return 200 instead of 201 so that clients stop retrying",
            "Accept an idempotency key with each create request and return the original result when the key repeats",
            "Tell every client never to retry any request at all",
          ],
          answer: 2,
          explanation: "POST is not idempotent by itself. A key lets the server recognise a repeated request and answer with the first result instead of creating a second order.",
        },
      ],
      task: {
        title: 'Run your first API',
        steps: [
          'Create the project, install Express and save `server.mjs`.',
          'Start the server and run the three curl commands (or use a tool such as Postman or Bruno). Check the status codes.',
          'Use the prompt to add the DELETE route, and test both the success and the 404 case.',
          'Commit your work with a clear message.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Describe your API as a restaurant: which address is the order window, what each method does and what each status code would mean there (404: that dish is not on the menu). Ask your assistant to check the analogy.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add an error-handling middleware, a request body size limit and a 404 for unknown ids, plus a test that sends `DELETE` twice. Document whether invalid text returns 400 or 422, and why.",
          ],
        },
      ],
    },
    {
      id: 'developer-11',
      day: 11,
      title: 'A simple front end for your API',
      summary: 'Build one HTML page that loads and adds notes with fetch, served by your own API.',
      intro: {
        objectives: [
          'Load and add notes from a plain HTML page with fetch',
          'Show user text with textContent instead of innerHTML, and explain why',
          'Handle a failed request and every screen state',
          'Explain why the AI call stays on the server',
        ],
        why: 'A page people can click shows off your work far better than an API alone. Knowing fetch, the DOM and the security habits that go with them makes any front-end framework easier later.',
      },
      minutes: 15,
      skills: ['full-stack'],
      body: [
        {
          type: 'paragraph',
          text: "An API is hard to show off. A page people can click is easy. Today you add a plain HTML front end to yesterday's notes API. No framework yet: understanding `fetch` and the DOM first makes React, Vue or any framework easier later.",
        },
        {
          type: 'paragraph',
          text: "Serving the page from the same Express server keeps things simple and avoids cross-origin (CORS) errors. Add one line to `server.mjs`, after `app.use(express.json());`:",
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'server.mjs (add this line)',
          code: `app.use(express.static('public'));`,
        },
        {
          type: 'paragraph',
          text: "Then create a `public` folder with this page. Express serves files relative to the folder you start the server from, so run `node server.mjs` from the project folder.",
        },
        {
          type: 'code',
          language: 'html',
          label: 'public/index.html',
          code: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Notes</title>
</head>
<body>
  <h1>Notes</h1>
  <form id="form">
    <input id="text" placeholder="New note" required>
    <button type="submit">Add</button>
  </form>
  <p id="error" role="alert"></p>
  <ul id="list"></ul>

  <script>
    const list = document.querySelector('#list');
    const error = document.querySelector('#error');

    async function load() {
      const res = await fetch('/notes');
      const notes = await res.json();
      list.replaceChildren(...notes.map((note) => {
        const li = document.createElement('li');
        li.textContent = note.text;
        return li;
      }));
    }

    document.querySelector('#form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = document.querySelector('#text');
      const res = await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value }),
      });
      if (!res.ok) {
        error.textContent = 'Could not save the note. Please try again.';
        return;
      }
      error.textContent = '';
      input.value = '';
      load();
    });

    load();
  </script>
</body>
</html>`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Reading `index.html` in plain words. **HTML** describes what is on the page: a heading, a form with a text box and an Add button, and an empty list. **JavaScript**, inside `<script>`, makes the page do things. `fetch('/notes')` asks your server for the notes, like a waiter fetching from the kitchen, and `await` waits for the answer. The **DOM** is the browser's live copy of the page that JavaScript can change: `document.createElement('li')` makes a new list item and `textContent` puts words in it. When you press Add, the page sends the new note with `fetch`, and `load()` refreshes the list.",
        },
        {
          type: 'paragraph',
          text: "Restart the server and open `http://localhost:3000`. Add a note and watch it appear.",
        },
        { type: 'heading', text: 'Three habits to notice' },
        {
          type: 'list',
          items: [
            '**`textContent`, not `innerHTML`:** user text is shown as text, so nobody can inject a script through a note.',
            '**Check `res.ok`:** a failed request should show a friendly message, not silently do nothing.',
            '**Every state:** a good screen handles loading, empty, error and content. What does your list show when there are no notes yet?',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "developer-11-fix-1",
            kind: "fix-bug",
            title: "A note that runs a script",
            prompt: "A user types `<img src=x onerror=alert(1)>` as a note, and it runs code in the page. Find the line with the bug, then pick the fix. (Browser code, judged by stored answers.)",
            concept: "cross-site scripting",
            language: "javascript",
            code: "function show(notes) {\n  return notes.map((note) => {\n    const li = document.createElement('li');\n    li.innerHTML = note.text;\n    return li;\n  });\n}",
            bugLine: 4,
            fixes: [
              {
                line: "li.textContent = note.text;",
                correct: true,
                why: "Yes. `textContent` shows the note as plain text, so injected HTML or scripts do not run.",
              },
              {
                line: "li.innerHTML = String(note.text);",
                correct: false,
                why: "Converting to a string changes nothing about how it is shown. `innerHTML` still parses the text as HTML.",
              },
              {
                line: "li.setAttribute('title', note.text);",
                correct: false,
                why: "That puts the note into a tooltip attribute and shows nothing in the list item.",
              },
            ],
            lineNote: "That line is fine. Look for where the user text is put into the page.",
            hints: [
              "Which line puts the user's text into the page?",
              "`innerHTML` treats the text as HTML.",
              "Use the property that shows text as plain text.",
            ],
            explanation: "`innerHTML` parses the note as HTML, which opens the door to cross-site scripting (XSS). `textContent` displays it as plain text.",
          },
        },
        {
          type: 'prompt',
          label: 'Improve the page step by step',
          text: "Here is my plain HTML and JavaScript notes page. Suggest ONE improvement at a time, in this order: an empty state when there are no notes, a loading message while notes load, a disabled Add button while saving, and simple CSS that looks clean on a phone screen. For each, show only the lines that change and explain why. Keep using textContent, not innerHTML.\n\n[paste index.html]",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "The page has one gap. `fetch` only rejects when the request itself fails, such as a network error. An HTTP error like 404 or 500 still resolves, which is why the code checks `res.ok`. But a network failure inside `load()` or the submit handler throws, and nothing tells the user. Wrap the calls in `try` and `catch`, show the same friendly message, and disable the Add button while saving so a double click does not send two notes.",
        },
        {
          type: 'warning',
          text: "Never put an AI API key in this page. Anything in front-end code can be read with the browser's developer tools. If the page needs AI, add a server route that calls the model and have the page call that route.",
        },
        {
          type: "diagram",
          format: "json",
          caption: "The page calls your server, and your server calls the AI",
          source: {
            kind: "sequence",
            title: "Where the AI call happens",
            summary: "The page calls a route on your own server. The server calls the AI provider with the key from an environment variable, then returns JSON to the page. The key never reaches the browser.",
            participants: [
              {
                id: "page",
                label: "Your page (browser)",
              },
              {
                id: "server",
                label: "Your server route",
              },
              {
                id: "ai",
                label: "AI provider",
              },
            ],
            messages: [
              {
                from: "page",
                to: "server",
                label: "fetch your own route",
              },
              {
                from: "server",
                to: "ai",
                label: "Request, with the key from an environment variable",
              },
              {
                from: "ai",
                to: "server",
                label: "The model reply",
                dashed: true,
              },
              {
                from: "server",
                to: "page",
                label: "JSON for the page to show",
                dashed: true,
              },
            ],
          },
        },
        {
          type: 'tip',
          text: "Open your browser's developer tools (Network tab) while you click Add. Seeing the real request and response is the fastest way to debug a front end.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Rendering untrusted text is the central front-end security question. `textContent` is safe for plain text; MDN calls `innerHTML` a common XSS vector and recommends Trusted Types, enforced with a Content Security Policy, or sanitising when HTML must be allowed. Serving the page and the API from one origin avoids CORS setup, but if you split origins later, allow named origins rather than everything. Client-side checks are for the user's convenience: the server must enforce every rule. Treat model output shown in the page as untrusted too, since OWASP's LLM list names improper output handling as a risk of its own. Handle slow and failing networks with timeouts and cancellation (`AbortController` can cancel a fetch), keep an error region that assistive technology announces, and cover the main flow with at least one end-to-end test.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "MDN says innerHTML is probably the most common vector for cross-site scripting, recommends textContent for plain text and Trusted Types (with a Content Security Policy) when HTML is needed. MDN also notes that a fetch() promise rejects only when the request fails and does not reject for HTTP error statuses such as 404, and that AbortController can abort fetch requests.",
          checked: "2026-11-14",
          sources: [
            { label: "MDN: Element.innerHTML", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML" },
            { label: "MDN: fetch()", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch" },
            { label: "MDN: AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
            { label: "OWASP Top 10 for LLM Applications (2025)", url: "https://genai.owasp.org/llm-top-10/" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Serving the page from the same Express server avoids CORS errors and keeps setup simple.",
            "Use `textContent`, not `innerHTML`, for text typed by users, so nobody can inject a script.",
            "Check `res.ok`, and handle every state: loading, empty, error and content.",
            "Never put an AI key in front-end code. The page calls your server route, and the route calls the model.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-11-q1',
          prompt: 'Why use `textContent` instead of `innerHTML` for a note typed by a user?',
          choices: [
            'It is shorter to type',
            'It treats the note as plain text, so injected HTML or scripts do not run',
            'innerHTML does not work in modern browsers',
            'It makes the page load faster',
          ],
          answer: 1,
          explanation: 'innerHTML parses the text as HTML, which opens the door to cross-site scripting (XSS).',
        },
        {
          id: 'developer-11-q2',
          prompt: 'Why serve the page from the same Express server as the API?',
          choices: [
            'Browsers cannot open HTML files otherwise',
            'Express requires it',
            'Same-origin requests avoid CORS errors and keep setup simple',
            'It hides the API from users',
          ],
          answer: 2,
          explanation: 'When the page and the API share an origin, the browser allows the requests without extra CORS setup.',
        },
        {
          id: 'developer-11-q3',
          prompt: 'Your page needs an AI summary of a note. Where should the AI call happen?',
          choices: [
            'In a server route; the page calls that route',
            'In the page script, with the key in a variable',
            'In a hidden HTML input',
            'In the browser local storage',
          ],
          answer: 0,
          explanation: 'The key stays on the server. The browser only talks to your own API.',
        },
        {
          id: "developer-11-q4",
          audience: { max: "beginner" },
          prompt: "In the page's code, what does `fetch('/notes')` do in plain words?",
          choices: [
            "It saves the notes in a file on your own laptop",
            "It draws the notes on the page by itself",
            "It asks your server for the list of notes and waits for the answer",
            "It sends the notes to the AI provider",
          ],
          answer: 2,
          explanation: "fetch sends a request to an address, here your own server, and gives back its answer once it arrives.",
        },
        {
          id: "developer-11-q5",
          audience: { min: "advanced" },
          prompt: "A reviewer finds `el.innerHTML = reply`, where `reply` is an AI summary of text that users typed. What is the best fix?",
          choices: [
            "Render it with `textContent`, or sanitise through a Trusted Types policy if formatting is needed, treating model output as untrusted",
            "Leave it as it is, because the text came from your own server",
            "Strip the word script out of it with a regular expression",
            "Ask the model to promise that it never outputs any HTML",
          ],
          answer: 0,
          explanation: "Model output can carry content an attacker influenced. Plain-text rendering, or sanitising in a Trusted Types policy, removes the injection path; filtering one word or asking nicely does not.",
        },
      ],
      task: {
        title: 'Give your API a face',
        steps: [
          'Add the static line to `server.mjs` and create `public/index.html`.',
          'Restart the server, open `http://localhost:3000` and add three notes.',
          'Watch the requests in the browser Network tab.',
          'Use the prompt to add an empty state and a loading message, then commit.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Open the browser developer tools Network tab, add a note, and write in plain words what each request you see does. Then ask your assistant what request, response and DOM mean, and compare it with your notes.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add try and catch with a timeout using `AbortController`, an error region announced to assistive technology, and a test that submits `<img src=x onerror=alert(1)>` and asserts it appears as text. Write what a Content Security Policy would add.",
          ],
        },
      ],
    },
    {
      id: 'developer-12',
      day: 12,
      title: 'README and demo: make your project easy to judge',
      summary: 'Write a README a busy reviewer can scan in a minute, and record a short demo of your project.',
      intro: {
        objectives: [
          'Write a README with the sections a busy reviewer looks for',
          'Add a .env.example and test your run steps from a fresh clone',
          'Plan a 60 to 90 second demo',
          'Describe your use of AI honestly',
        ],
        why: 'A recruiter or senior developer gives your project a minute or two. A clear README and demo decide whether they read your code at all.',
      },
      minutes: 15,
      skills: ['portfolio'],
      body: [
        {
          type: 'paragraph',
          text: "A recruiter or senior developer will give your project a minute or two. In that time they read the README, maybe watch a demo, and glance at the code. If the README is empty, many will not look further. Today you make that minute count. Project 2 opens after this lesson.",
        },
        { type: 'heading', text: 'What a strong README contains' },
        {
          type: 'code',
          language: 'markdown',
          label: 'README.md template',
          code: `# Project name

One sentence: what it does and who it helps.

![Screenshot or GIF of the app](docs/screenshot.png)

Live demo: link (if deployed)   Demo video: link

## Features
- 3 to 5 bullet points

## How the AI feature works
What is sent to the model, what comes back, and what the user
can check or edit when the model is wrong.

## Tech stack
Language, framework, database, AI provider.

## Run it locally
1. Clone the repo
2. Copy .env.example to .env and add your own API key
3. Install dependencies
4. Start the app

## Tests
The command that runs them.

## What I learned / what I would do next
2 to 4 honest bullet points.

## How I used AI
Which tools, for what, and how I checked the output.`,
        },
        {
          type: "activity",
          activity: {
            id: "developer-12-match-1",
            kind: "match",
            title: "Where would they look?",
            prompt: "Five people open your repo, each with one question. Match each question with the README section that should answer it.",
            concept: "readme",
            labels: { terms: "What the reader wants", meanings: "README section that answers it" },
            pairs: [
              {
                term: "A reviewer wonders what happens when the model picks the wrong category, and whether the user can fix it.",
                definition: "How the AI feature works",
              },
              {
                term: "A senior developer wants to start the app on her own laptop in the next ten minutes.",
                definition: "Run it locally",
              },
              {
                term: "An interviewer asks whether you used Copilot, and how you checked what it wrote.",
                definition: "How I used AI",
              },
              {
                term: "A teammate wants to confirm nothing broke after his change.",
                definition: "Tests",
              },
              {
                term: "A recruiter wonders what you would improve with another month.",
                definition: "What I learned / what I would do next",
              },
            ],
            hints: [
              "Some questions are about the project itself; others are about how you worked.",
              "Two questions mention AI: one is about the feature the user sees, the other about your own tools.",
              "Checking that nothing broke needs one command; starting the app needs a list of steps.",
            ],
            explanation: "Each section answers one question: the AI feature section covers wrong model output, the run steps get a stranger started, \"How I used AI\" covers your tools and checks, the tests section names the command, and the learned/next section shows how you think.",
          },
        },
        {
          type: 'tip',
          text: "Add a `.env.example` file with the variable names and fake values (`AI_API_KEY=your-key-here`). It tells others what to set without sharing your secret.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **README** is the first page people see in your project: it says what the project is, how to run it and what to expect. A **repository** (repo) is the folder of your project stored on GitHub. A **demo** is a short recording or live page that shows it working. A file like `.env.example` lists the settings the app needs with fake values, such as `AI_API_KEY=your-key-here`, so a stranger knows what to fill in without ever seeing your real secret. Reviewers are busy, so put the answer to what is this, and does it work, at the very top.",
        },
        { type: 'heading', text: 'Test the README like a stranger' },
        {
          type: 'paragraph',
          text: "Clone your repo into a new folder and follow your own steps exactly. If you have to do anything that is not written down, add it. A README that works from a fresh clone is rare, and reviewers notice.",
        },
        { type: 'heading', text: 'A 60 to 90 second demo' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Five seconds: the problem, in one sentence.',
            'Most of the time: show the main flow working, including the AI feature.',
            'Ten seconds: one technical detail you are proud of, such as how you handle AI mistakes.',
            'End with the repo link.',
          ],
        },
        {
          type: 'paragraph',
          text: "Use your computer's built-in screen recorder and upload the video to a link-shareable place. Turn off notifications first, and make sure no keys, passwords or private messages are on screen.",
        },
        {
          type: 'prompt',
          label: 'Review my README',
          text: "Act as a busy senior developer reviewing a junior's portfolio project. Read this README and tell me: what you understood in the first 30 seconds, what is missing or confusing, whether you could run the project from these steps, and the three changes that would most improve it. Be direct.\n\n[paste README.md]",
        },
        {
          type: 'warning',
          text: "Be honest about AI use. Saying how you used AI and what you checked reads as maturity. Claiming you wrote everything by hand, when you did not, can fall apart in the first interview question.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Write the README as a decision record for a reviewer who will not run the code. State the architecture in a few lines or a diagram: where the trust boundaries are, what the AI feature receives and returns, how errors are handled and what is out of scope. Make setup reproducible: commit the lockfile, install in CI with `npm ci`, which installs from the lockfile and fails if it disagrees with package.json, and pin the runtime version. Add a CI check that runs tests and lint on every pull request. For AI-assisted work record evidence, not claims: the plan, an evaluation set with its results, notable cases where output was wrong and how you caught them, and what you rewrote by hand. Keep a short known-limits section: honest limits read as seniority.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "npm ci installs from the lockfile, removes any existing node_modules first, never writes to package.json or the lockfile, and exits with an error if the lockfile and package.json do not match (npm documentation).",
          checked: "2026-11-14",
          sources: [
            { label: "npm documentation: npm ci", url: "https://docs.npmjs.com/cli/v11/commands/npm-ci" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "A reviewer gives your project a minute or two, so the README has to work fast.",
            "A strong README has a one-sentence purpose, features, how the AI feature works, run steps, tests, what you learned and how you used AI.",
            "Add a `.env.example` with fake values, and test your README from a fresh clone.",
            "A good demo is 60 to 90 seconds: the problem, the main flow, one detail you are proud of, and the link.",
            "Be honest about how you used AI.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-12-q1',
          prompt: 'What is the purpose of a `.env.example` file?',
          choices: [
            'To store your real API key safely',
            'To replace the README',
            'To make Git ignore the project',
            'To show which environment variables are needed, with fake values',
          ],
          answer: 3,
          explanation: 'It documents the settings without exposing any secret. The real `.env` stays out of Git.',
        },
        {
          id: 'developer-12-q2',
          prompt: 'What is the best way to check that your "Run it locally" steps work?',
          choices: [
            'Ask the AI if they look right',
            'Clone the repo into a fresh folder and follow the steps exactly',
            'Assume they work because the app runs on your laptop',
            'Add more steps just in case',
          ],
          answer: 1,
          explanation: 'Your own folder has things set up that a stranger does not. A fresh clone exposes the missing steps.',
        },
        {
          id: 'developer-12-q3',
          prompt: 'How should a portfolio README handle AI use?',
          choices: [
            'Say honestly which tools you used, for what, and how you checked the output',
            'Never mention it',
            'Say AI wrote everything so you are not responsible',
            'Hide it in the commit history',
          ],
          answer: 0,
          explanation: 'Honest disclosure shows judgement, and you will need to explain the code in interviews anyway.',
        },
        {
          id: "developer-12-q4",
          audience: { max: "beginner" },
          prompt: "What is a repository?",
          choices: [
            "A short recording that shows your app working",
            "A file that lists settings with fake values",
            "A message that asks a teammate to review code",
            "The folder of your project, with its history, stored on a site such as GitHub",
          ],
          answer: 3,
          explanation: "A repository is your project folder together with its history. Hosting it on GitHub lets other people read and run it.",
        },
        {
          id: "developer-12-q5",
          audience: { min: "advanced" },
          prompt: "Which README evidence best shows responsible AI-assisted development?",
          choices: [
            "A badge listing every AI tool that was used on the project",
            "The plan, an evaluation set with results, and examples of wrong model output with how each was caught and fixed",
            "A statement that the whole app was generated in one afternoon",
            "A screenshot of the longest chat you had with the assistant",
          ],
          answer: 1,
          explanation: "Reviewers trust checkable evidence of control: a plan, measured results and concrete failures that were caught. Tool lists and chat length prove nothing about judgement.",
        },
      ],
      task: {
        title: 'Polish your Project 1 README',
        steps: [
          'Rewrite your Project 1 README using the template, including "How I used AI".',
          'Add a `.env.example` file if the project uses a key.',
          'Clone the repo into a new folder and follow the README exactly; fix any missing step.',
          'Use the review prompt and apply the top change.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask a friend or classmate who does not code to read your README for one minute, then say back what the project is. Write down the words they did not know and replace them with simpler ones.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add an architecture section with a diagram, a known-limits section and an evaluation-results table for the AI feature, plus a CI workflow that installs from the lockfile (`npm ci` or your language's equivalent) and runs the tests on every pull request.",
          ],
        },
      ],
    },
    {
      id: 'developer-13',
      day: 13,
      title: 'Code review etiquette',
      summary: 'Give and receive code review kindly and usefully, and use AI to review your own work first.',
      intro: {
        objectives: [
          'Prepare a small pull request with a clear description',
          'Reply to review comments kindly, and move a long thread to a call',
          'Write review comments as questions and label small points with nit:',
          'Use AI to pre-review your own diff without sending back answers you have not read',
        ],
        why: 'Every change on a team is reviewed, and juniors review too. How you give and take review is one of the first things your teammates notice about you.',
      },
      minutes: 15,
      skills: ['code-quality'],
      body: [
        {
          type: 'paragraph',
          text: "On a team, almost every change is reviewed by someone else before it is merged. Code review is where juniors learn fastest, and where your attitude is most visible. Good reviewers and good reviewees are both easy to work with.",
        },
        { type: 'heading', text: 'Before you ask for a review' },
        {
          type: 'list',
          items: [
            'Read your own diff from top to bottom. Remove debug prints, commented-out code and unrelated changes.',
            'Make sure tests pass and the app runs.',
            'Write a pull request description: what changed, why, how you tested it, and screenshots for UI changes.',
            'Keep it small. A 100-line pull request gets a careful review; a 2,000-line one gets a quick skim.',
          ],
        },
        {
          type: 'prompt',
          label: 'Pre-review my own diff',
          text: "Review this diff as a careful senior developer before my teammates see it. Look for: bugs, missing input validation, missing tests, unclear names, leftover debug code, and anything that could leak secrets. List issues from most to least important, and say which are blocking and which are minor. Do not rewrite the code.\n\n[paste the diff, with no secrets or private company code unless your company approves this tool]",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Code review** means a teammate reads your changes before they join the shared project, like an editor reading an article before it is printed. A **pull request** (PR) is the request for that review. A **diff** is the list of exactly which lines you added and removed. A **comment** is a note a reviewer leaves on a line, and a **nit** is a tiny optional point, such as a name. Reviews are about the work, not about you: the aim is a better project and shared understanding. When you review, begin with what is good, ask a question when you are unsure, and say clearly which points must change and which are optional.",
        },
        { type: 'heading', text: 'Receiving review' },
        {
          type: 'list',
          items: [
            "Assume good intent. Comments are about the code, not about you.",
            "Reply to every comment: 'Done', 'Good catch, fixed in the latest commit', or a polite reason if you disagree.",
            "If you do not understand a comment, ask. 'Can you show me an example of what you mean?' is a perfectly good reply.",
            'Never argue in long threads. If it goes back and forth twice, ask for a quick call.',
          ],
        },
        { type: 'heading', text: 'Giving review (yes, juniors review too)' },
        {
          type: 'list',
          items: [
            "Ask questions instead of giving orders: 'What happens if this list is empty?'",
            "Label small things: 'nit: maybe rename `d` to `dueDate`'. It tells the author it is optional.",
            'Say what is good, not only what is wrong.',
            'Approve when it is good enough, not when it is how you would have written it.',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "developer-13-tap-1",
            kind: "tap-reveal",
            title: "What these review phrases do",
            prompt: "Tap each phrase to see what it does in a code review.",
            concept: "code review etiquette",
            cards: [
              {
                front: "\"nit: maybe rename `d` to `dueDate`\"",
                back: "A small, optional suggestion. The label tells the author they may skip it.",
              },
              {
                front: "\"What happens if this list is empty?\"",
                back: "A question instead of an order. It points to a specific risk and invites the author to think.",
              },
              {
                front: "\"Good catch, fixed in the latest commit\"",
                back: "A reply to a comment. Reply to every comment, with \"Done\", a thanks or a polite reason if you disagree.",
              },
              {
                front: "\"Can you show me an example of what you mean?\"",
                back: "A perfectly good reply when you do not understand a comment.",
              },
              {
                front: "A thread that has gone back and forth twice",
                back: "Time to ask for a quick call instead of arguing in a long thread.",
              },
            ],
            hints: [
              "Open the cards in any order.",
              "You are done when all five are open.",
            ],
            explanation: "Good review is specific and kind: questions instead of orders, small things labelled as optional, a reply to every comment, and a call when a thread drags on.",
          },
        },
        {
          type: 'tip',
          text: "When an AI assistant helped write the change, say so in the PR description if your team asks for it, and point reviewers at the parts you were least sure about. It speeds up review and builds trust.",
        },
        {
          type: 'warning',
          text: "Do not paste a reviewer's comments into an AI and send back the answer without reading and understanding it. Reviewers can tell, and it wastes their time.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Reviewing AI-assisted changes needs its own checklist, because a diff can look tidy while hiding risk. Start with scope: does it do only what the ticket asked? Then look for what was removed or weakened (tests, validation, error handling, access checks), new dependencies (OWASP's 2025 list includes software supply chain failures), new network calls, broad permissions and anything touching secrets or personal data. Check that each new test fails on the old code, and read the tests before the code. Ask the author to explain the riskiest part without the tool. At team level, use a pull request template, CODEOWNERS for sensitive paths and branch protection that requires approvals and passing checks, so that review is enforced instead of hoped for.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP Top 10:2025 lists Software Supply Chain Failures as A03. GitHub: a CODEOWNERS file requests review from the owners of changed code, and branch protection rules can require approving reviews and passing status checks before merging.",
          checked: "2026-11-14",
          sources: [
            { label: "OWASP Top 10:2025", url: "https://top10.owasp.org/2025" },
            { label: "GitHub Docs: about code owners", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" },
            { label: "GitHub Docs: about protected branches", url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Before you ask for review, read your own diff, run the tests and write a clear pull request description. Keep it small.",
            "Receive review with good intent: reply to every comment, ask when you are unsure, and take long threads to a call.",
            "Give review by asking questions, labelling small things \"nit:\" and saying what is good.",
            "Use AI to pre-review your own diff, and never send back AI replies you have not read and understood.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-13-q1',
          prompt: 'Which review comment is most helpful and kind?',
          choices: [
            '"This is wrong."',
            '"Why would anyone do this?"',
            '"What happens here if the list is empty? A test for that case would help."',
            '"Rewrite everything."',
          ],
          answer: 2,
          explanation: 'It points to a specific risk, explains why it matters and suggests a next step, without attacking the author.',
        },
        {
          id: 'developer-13-q2',
          prompt: 'What does the prefix "nit:" usually mean in a review comment?',
          choices: [
            'A small, optional suggestion',
            'A blocking bug',
            'The reviewer is angry',
            'The code must be deleted',
          ],
          answer: 0,
          explanation: 'Nit (from nitpick) marks a minor point the author may choose to skip.',
        },
        {
          id: 'developer-13-q3',
          prompt: 'Why keep pull requests small?',
          choices: [
            'Large ones are not allowed by GitHub',
            'Small ones get careful, faster reviews and are easier to undo',
            'Reviewers only read the first file',
            'It hides mistakes',
          ],
          answer: 1,
          explanation: 'Reviewers can actually understand a small change, so problems are caught and fixes are quick.',
        },
        {
          id: 'developer-13-q4',
          prompt: "You disagree with a reviewer's suggestion. What is the best response?",
          choices: [
            'Ignore the comment and merge',
            'Change it silently, then change it back later',
            'Write a long argument in the thread',
            'Reply politely with your reason, and suggest a quick call if it is still unclear',
          ],
          answer: 3,
          explanation: 'Disagreeing is fine when it is respectful and reasoned. A short talk often settles it faster than a long thread.',
        },
        {
          id: "developer-13-q5",
          audience: { max: "beginner" },
          prompt: "In a pull request, what is a diff?",
          choices: [
            "A comment that blocks the change from being merged",
            "The list of exact lines that you added and removed in a change",
            "A tool that writes the tests for your code",
            "The approval that a reviewer gives at the end",
          ],
          answer: 1,
          explanation: "The diff shows exactly what changed, so the reviewer reads the change itself and not the whole project.",
        },
        {
          id: "developer-13-q6",
          audience: { min: "advanced" },
          prompt: "An AI-assisted pull request adds a new package and one passing test. What should the reviewer check before approving?",
          choices: [
            "That the description is long, since long descriptions mean careful work",
            "That the style matches what the assistant usually produces",
            "Nothing, because a passing test and a green build are enough",
            "That the package is real, maintained and needed, its version is locked, and the new test fails on the old code",
          ],
          answer: 3,
          explanation: "New dependencies are a supply chain risk, and a test that also passes without the change proves nothing. Both are cheap to check and easy for generated diffs to hide.",
        },
      ],
      task: {
        title: 'Review your own pull request',
        steps: [
          'Open a pull request on one of your repos with a small change.',
          'Write a description: what, why, how you tested it.',
          'Run the pre-review prompt on the diff and fix the top two issues.',
          'Leave one kind, specific review comment on your own PR as practice, then merge.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Open a short pull request on any open-source GitHub project. Find one diff, one comment and one approval, and write what each is in one sentence. Then write one question and one nit: comment you could leave.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Review one real AI-assisted diff (your own) against a written checklist: scope, removed tests or checks, new dependencies, secrets and a failing-first test. Add a pull request template and a CODEOWNERS entry for one sensitive path.",
          ],
        },
      ],
    },
    {
      id: 'developer-14',
      day: 14,
      title: 'Interview prep with AI: understand, do not cheat',
      summary: 'Use AI as a tutor for data structures and algorithms so you can solve problems on your own.',
      intro: {
        objectives: [
          'Name the patterns that junior interviews test',
          'Solve two sum with a hash map and give its time and space cost',
          'Use AI as a tutor that gives hints, not answers',
          'Explain why secret AI use in a no-AI assessment is cheating',
        ],
        why: 'Many interviews still ask you to solve a problem on your own and explain it. Learning the patterns with AI as a tutor builds skill you can use when the AI is switched off.',
      },
      minutes: 15,
      skills: ['interviewing'],
      body: [
        {
          type: 'paragraph',
          text: "Many technical interviews still ask you to solve a coding problem and explain your thinking, often without AI. Memorising answers does not work; interviewers change the question slightly and memory falls apart. What works is understanding a handful of patterns, and AI is an excellent tutor for that if you use it the right way.",
        },
        { type: 'heading', text: 'Patterns worth knowing for junior interviews' },
        {
          type: 'list',
          items: [
            'Arrays and strings, with loops and two pointers',
            'Hash maps (Python dict, JavaScript Map or object) for fast look-ups',
            'Stacks and queues',
            'Sorting and binary search',
            'Basic recursion, and simple trees',
            'Big-O: saying how time and memory grow with input size',
          ],
        },
        { type: 'heading', text: 'Tutor mode, not answer mode' },
        {
          type: 'prompt',
          label: 'Socratic DSA tutor',
          text: "Be my data structures and algorithms tutor. Give me one junior-level interview problem about [hash maps]. Do NOT show the solution. Let me think out loud. If I am stuck, give me one small hint at a time. When I finish, ask me for the time and space complexity, then show a clean solution and compare it with mine.",
        },
        {
          type: 'paragraph',
          text: "Here is a classic example. Given a list of numbers and a target, return the positions of two numbers that add up to the target.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'two_sum.py',
          code: `def two_sum(nums, target):
    seen = {}  # number -> index where we saw it
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return None


print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is `two_sum` in plain words. A **dictionary**, also called a **hash map**, stores pairs, like a phone book: look up a name and you get the number at once. `seen = {}` starts an empty one. `enumerate` gives each number together with its position. For each number, `need = target - n` is the partner that would reach the target. `if need in seen` asks the phone book whether we already met that partner, and if so we return both positions. If not, `seen[n] = i` writes this number down. **Big-O** says how the work grows as the list grows: O(n) means a list twice as long takes about twice as much work.",
        },
        {
          type: 'paragraph',
          text: "Checking every pair would take O(n²) time. Remembering what we have seen in a dictionary makes each look-up roughly constant time, so the whole thing is O(n) time and O(n) extra memory. Being able to say **that trade-off** out loud is what interviewers want to hear.",
        },
        {
          type: 'paragraph',
          text: "In JavaScript the same idea uses a `Map`. `seen.set(key, value)` stores a pair, `seen.has(key)` asks whether a key is there, and `seen.get(key)` reads its value. Loop once, work out the partner you need (`target - number`), check the Map for it **before** you add the current number so a number never pairs with itself, and return `null` if no pair is found.",
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'Map basics',
          code: `const seen = new Map();
seen.set(2, 0);   // the number 2 was seen at index 0
seen.has(7);      // false
seen.has(2);      // true
seen.get(2);      // 0`,
        },
        {
          type: "visual",
          id: "big-o-growth",
          caption: "See how O(n) and O(n²) grow as the input gets larger.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-14-js-1",
            kind: "code-challenge",
            title: "Two sum with a hash map",
            prompt: "Write `twoSum(nums, target)` in JavaScript. Return the two positions (as an array, smaller position first) whose numbers add up to `target`, or `null` if there are none. Remember the numbers you have seen, so you only loop once.",
            concept: "hash maps",
            language: "javascript",
            starter: "function twoSum(nums, target) {\n  // remember each number you have seen and its index\n}\n",
            solution: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) {\n      return [seen.get(need), i];\n    }\n    seen.set(nums[i], i);\n  }\n  return null;\n}\n",
            tests: {
              kind: "function",
              fn: "twoSum",
              cases: [
                {
                  label: "twoSum([2, 7, 11, 15], 9)",
                  args: [
                    [2, 7, 11, 15],
                    9,
                  ],
                  expected: [0, 1],
                },
                {
                  label: "twoSum([3, 2, 4], 6)",
                  args: [
                    [3, 2, 4],
                    6,
                  ],
                  expected: [1, 2],
                },
                {
                  label: "twoSum([3, 3], 6)",
                  args: [
                    [3, 3],
                    6,
                  ],
                  expected: [0, 1],
                },
                {
                  label: "twoSum([1, 2, 3], 10)",
                  args: [
                    [1, 2, 3],
                    10,
                  ],
                  expected: null,
                },
                {
                  label: "a hidden case",
                  args: [
                    [5, 1, 9, 4],
                    13,
                  ],
                  expected: [2, 3],
                  hidden: true,
                },
              ],
            },
            hints: [
              "For each number, work out the partner you need: `target - number`.",
              "A `Map` can remember each number and the index where you saw it, and `has` answers \"have I seen it?\" quickly.",
              "Check the Map for the partner before you add the current number, so a number never pairs with itself.",
            ],
            explanation: "Looking up the partner in a Map is roughly constant time, so one pass over the list is enough: O(n) time and O(n) extra memory. Checking before adding stops a number pairing with itself.",
          },
        },
        { type: 'heading', text: 'A study routine that sticks' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Try a problem alone for 20 minutes, on paper or in a plain editor with the AI assistant turned off.',
            'Then use the tutor prompt for hints, not answers.',
            'Explain the final solution in your own words, out loud or in writing.',
            'Re-solve it from scratch two or three days later.',
          ],
        },
        {
          type: 'warning',
          text: "Using AI to learn is fine. Using AI secretly during an assessment that forbids it is dishonest, often detected, and can get an offer withdrawn. The same goes for school work: follow your school's academic honesty rules.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Interviewers push past the textbook answer, so prepare the follow-ups. What if the input is sorted? Two pointers solve it in O(n) time and O(1) extra space. What if you must return all pairs, or count them? What about duplicates, negative numbers, or a stream too large for memory? State your assumptions about the hash map: Python's documentation lists dict operations as O(1) on average and O(n) in the worst case, assuming a robust hash and well-distributed keys. Explain the time and space trade-off, and say what you would test: empty list, one element, no pair, the same number twice. When you prepare with AI, have it generate variants and critique your explanation, but practise on paper first, because the skill being measured is reasoning under questioning.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Python's documentation lists dict get, set and membership operations as O(1) in the average case and O(n) in the worst case, and states that the average figures assume a sufficiently robust hash function and well-distributed keys.",
          checked: "2026-11-14",
          sources: [
            { label: "Python documentation: time complexity of built-in types", url: "https://docs.python.org/3/builtins/time-complexity.html" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Junior interviews test patterns: arrays and strings, hash maps, stacks and queues, sorting and binary search, simple recursion and Big-O.",
            "Use AI as a Socratic tutor: try alone first, then ask for one hint at a time.",
            "A hash map turns O(n²) pair checking into O(n) time, at the cost of O(n) extra memory.",
            "Say that trade-off out loud, and re-solve the problem a few days later.",
            "Using AI secretly in an assessment that forbids it is cheating.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-14-q1',
          prompt: 'What is the time complexity of the dictionary-based `two_sum`?',
          choices: ['O(n²)', 'O(log n)', 'O(n)', 'O(1)'],
          answer: 2,
          explanation: 'It loops through the list once, and each dictionary look-up is roughly constant time on average.',
        },
        {
          id: 'developer-14-q2',
          prompt: 'What does `two_sum([3, 2, 4], 6)` return?',
          choices: ['[0, 0]', '[1, 2]', '[0, 2]', 'None'],
          answer: 1,
          explanation: 'At index 2 the number is 4 and it needs 2, which was seen at index 1, so it returns [1, 2]. It never pairs 3 with itself.',
        },
        {
          id: 'developer-14-q3',
          prompt: 'Which way of using AI builds real interview skill?',
          choices: [
            'Asking for one hint at a time after trying alone, then explaining the solution yourself',
            'Copying the full solution and memorising it',
            'Running an AI tool in the background during a no-AI test',
            'Skipping complexity because AI can work it out',
          ],
          answer: 0,
          explanation: 'Struggling first, then getting small hints, is how the pattern sticks so you can use it on a new problem.',
        },
        {
          id: "developer-14-q4",
          audience: { max: "beginner" },
          prompt: "What is a hash map (a Python dictionary) good for?",
          choices: [
            "Finding a value by its key quickly, like looking up a number in a phone book",
            "Sorting numbers from the smallest to the largest",
            "Running the same piece of code many times in a row",
            "Hiding secrets so other programs cannot read them",
          ],
          answer: 0,
          explanation: "A hash map stores key and value pairs and finds a key quickly, which is why `two_sum` can check each number once.",
        },
        {
          id: "developer-14-q5",
          audience: { min: "advanced" },
          prompt: "The two-sum input is already sorted and extra memory is tight. Which approach is better than the hash map?",
          choices: [
            "Check every pair, because sorted data makes that fast",
            "Copy the list, sort it again to be sure, then reuse the hash map",
            "Two pointers moving inward from both ends, in O(n) time and O(1) extra space",
            "Use recursion on each number, which needs no extra memory",
          ],
          answer: 2,
          explanation: "On sorted data, moving the left pointer up raises the sum and moving the right pointer down lowers it, so one pass finds the pair without storing anything.",
        },
      ],
      task: {
        title: 'One problem, tutor mode',
        steps: [
          'Turn off your AI assistant and try the two-sum problem alone for 15 minutes.',
          'Use the Socratic tutor prompt with a hash-map problem and ask only for hints.',
          'Write a three-sentence explanation of your solution and its Big-O.',
          'Put a reminder in your calendar to solve it again in three days.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Explain `two_sum` to a friend using the phone-book idea, in three sentences and without the word hash. Ask the AI to tell you whether your explanation is correct, not to rewrite it.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Implement the sorted-input two-pointer version, write tests that include duplicates and no-pair cases, and compare its time and memory with the hash-map version. Then ask an AI for three follow-up variants and solve them without it first.",
          ],
        },
      ],
    },
    {
      id: 'developer-15',
      day: 15,
      title: 'Live coding: with AI and without',
      summary: 'Know the rules of each interview, think out loud, and show good judgement whether AI is allowed or not.',
      intro: {
        objectives: [
          'Find out whether AI is allowed before a coding round starts',
          'Work through a no-AI round: restate the problem, start simple, talk while you code, test by hand',
          'Show good judgement in an AI-allowed round by planning first and catching mistakes',
          'Prepare for the follow-up on a take-home task',
        ],
        why: 'Companies now run very different coding interviews. Knowing the rules, and what each kind rewards, helps you do well in all of them.',
      },
      minutes: 15,
      skills: ['interviewing'],
      body: [
        {
          type: 'paragraph',
          text: "Live-coding interviews come in different shapes now. Some ban AI completely. Some allow it, or even expect it, and watch **how** you use it. Take-home tasks have their own rules. Your first job is to know which one you are in.",
        },
        {
          type: 'tip',
          text: "If the rules are not clear, ask before you start: 'Am I allowed to use an AI assistant or search the docs during this exercise?' It is a professional question, not a weak one.",
        },
        { type: 'heading', text: 'When AI is not allowed' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Repeat the problem** in your own words and ask about inputs, outputs and edge cases.',
            '**Talk through a simple approach first**, even a slow one, and say its Big-O.',
            '**Write the code while talking.** Silence makes it hard for the interviewer to help you.',
            '**Test by hand** with a small example and one edge case.',
            '**Improve** if there is time, and explain the trade-off.',
          ],
        },
        {
          type: 'paragraph',
          text: "Interviewers care more about your reasoning than a perfect answer. A clear plan with a small bug often scores better than silent, half-working code.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-15-scenario-1",
            kind: "scenario",
            title: "Stuck in a no-AI round",
            prompt: "What do you do?",
            concept: "live coding",
            situation: "You are in a live-coding round where AI is not allowed. You have been staring at the screen for two minutes and you are stuck on how to start.",
            options: [
              {
                text: "Say out loud what you understand so far, describe a simple approach even if it is slow, and ask a clarifying question.",
                consequence: "The interviewer can follow your thinking and give you a nudge. A clear plan is worth more than silence.",
                quality: "best",
              },
              {
                text: "Jump straight to the most clever solution you remember and start typing.",
                consequence: "If you lose the thread, you are stuck again, and the interviewer has not heard how you reason.",
                quality: "acceptable",
              },
              {
                text: "Keep quiet until you have something that works.",
                consequence: "Silence makes it hard for the interviewer to help you, and they see no reasoning to score.",
                quality: "poor",
              },
            ],
            hints: [
              "Interviewers care more about your reasoning than a perfect answer.",
              "Silence makes it hard for the interviewer to help you.",
              "Start with a simple approach, even a slow one, and say its Big-O.",
            ],
            explanation: "Think out loud: restate the problem, ask about inputs and edge cases, and describe a simple approach first. It gives the interviewer something to score and a chance to help.",
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **live-coding interview** is a meeting where you solve a small programming problem while an interviewer watches and talks with you. It is not a speed test; they want to hear how you think. **Thinking out loud** means saying what you are doing and why: I will start with the simple way, then improve it. An **edge case** is an unusual input, such as an empty list, that can break code. **Testing by hand** means trying a small example yourself, step by step, and checking each result. If you are unsure of the rules, ask whether AI tools and documentation are allowed. Asking is normal and professional.",
        },
        { type: 'heading', text: 'When AI is allowed' },
        {
          type: 'list',
          items: [
            'Plan first, out loud, before you prompt. Show that you, not the tool, are driving.',
            'Ask the AI for small pieces, and read each one before using it.',
            "Say what you are checking: 'This looks right, but I want to test the empty case.'",
            "Catch and fix the AI's mistakes. Spotting a wrong suggestion is a strong signal.",
            "Explain the final code as if you wrote every line, because you are responsible for it.",
          ],
        },
        { type: 'heading', text: 'Take-home tasks' },
        {
          type: 'paragraph',
          text: "Follow the stated rules exactly. If AI is allowed, say in your README how you used it. Expect a follow-up call where you change the code live, so make sure you understand all of it.",
        },
        {
          type: "table",
          caption: "Know which interview you are in",
          headers: [
            "The rule",
            "What you do",
            "What impresses",
          ],
          rows: [
            [
              "No AI",
              "Think out loud, start simple, test by hand",
              "Clear reasoning, even with a small bug",
            ],
            [
              "AI allowed",
              "Plan first, prompt for small pieces, read each one",
              "You drive the tool, catch its mistakes and explain every line",
            ],
            [
              "Take-home",
              "Follow the stated rules and say how you used AI",
              "You can explain and change the code live",
            ],
          ],
        },
        {
          type: 'prompt',
          label: 'Practise a live-coding round',
          text: "Run a 30-minute junior developer live-coding interview with me. Rules: no AI help for me during the exercise. Give me one problem, answer my clarifying questions like a real interviewer, and let me think out loud in text. Do not give hints unless I ask. At the end, score me from 1 to 5 on: understanding the problem, communication, correctness, testing, and complexity analysis, with one concrete tip for each.",
        },
        {
          type: 'warning',
          text: "Hidden AI tools, a second screen or someone helping off-camera during an interview that bans them is cheating. If you are found out, the offer is usually gone, and the company may remember your name.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "For experienced candidates the bar is collaboration and judgement more than the answer. In a no-AI round, clarify requirements, name the invariants and trade-offs, write the tests you would run and say what you would do with more time: profiling, error handling, a different data structure. In an AI-allowed round the interviewer can watch your process: whether you write a spec or acceptance test first, give the tool precise context, review a diff instead of accepting it and catch a wrong suggestion. Prepare a short routine: restate, plan aloud, ask for the smallest piece, run and read it, test the edge, explain every line. If you interview others, look for the same signals and tell candidates the rules in advance.",
        },
        {
          type: "takeaways",
          items: [
            "First find out the rules: ask whether AI or the docs are allowed.",
            "With no AI: repeat the problem, start with a simple approach, talk while you code, test by hand, then improve.",
            "With AI: plan first, prompt for small pieces, say what you are checking, catch its mistakes and explain the final code.",
            "For take-homes, follow the rules, say how you used AI and expect a live follow-up.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-15-q1',
          prompt: 'The interviewer has not said whether AI tools are allowed. What should you do?',
          choices: [
            'Use them quietly',
            'Avoid asking, to seem confident',
            'Leave the interview',
            'Ask clearly before you start',
          ],
          answer: 3,
          explanation: 'Asking shows professionalism and avoids an honest mistake that looks like cheating.',
        },
        {
          id: 'developer-15-q2',
          prompt: 'In a no-AI live-coding round, which habit helps most?',
          choices: [
            'Typing silently to look focused',
            'Thinking out loud while you plan and code',
            'Starting with the most clever solution you know',
            'Skipping tests to save time',
          ],
          answer: 1,
          explanation: 'Interviewers grade your reasoning. Talking lets them follow it and give you a nudge if needed.',
        },
        {
          id: 'developer-15-q3',
          prompt: 'In an AI-allowed round, what impresses an interviewer most?',
          choices: [
            'Pasting the whole problem and submitting the first answer',
            'Using as many tools as possible',
            'Planning first, prompting for small pieces, and catching the AI mistakes',
            'Never touching the AI even though it is allowed',
          ],
          answer: 2,
          explanation: 'They want to see that you drive the tool, check its output and understand the result.',
        },
        {
          id: 'developer-15-q4',
          prompt: 'You used AI on an allowed take-home task. What should you expect next?',
          choices: [
            'A follow-up where you explain or change the code live',
            'An automatic offer',
            'No questions about the code',
            'A request for your AI chat password',
          ],
          answer: 0,
          explanation: 'Many companies check understanding in a follow-up, so know every line you submit.',
        },
        {
          id: "developer-15-q5",
          audience: { max: "beginner" },
          prompt: "What is an edge case?",
          choices: [
            "The fastest way to solve a given problem",
            "A mistake that the interviewer makes by accident",
            "An unusual input, such as an empty list, that can break code",
            "A rule about which tools you may use",
          ],
          answer: 2,
          explanation: "Edge cases are the unusual inputs where code often fails. Naming them early shows an interviewer that you test your own thinking.",
        },
        {
          id: "developer-15-q6",
          audience: { min: "advanced" },
          prompt: "In an AI-allowed round, the assistant proposes code that passes your example but ignores an empty input. What shows the strongest judgement?",
          choices: [
            "Notice the gap, add the failing empty-input test first, then ask for the fix and explain why it works",
            "Accept it, since the example passes and time is short",
            "Switch the AI off silently and rewrite everything by hand",
            "Ask the interviewer to confirm that the AI is right",
          ],
          answer: 0,
          explanation: "Catching a gap the tool missed, proving it with a failing test and explaining the fix is exactly the process an AI-allowed round is designed to reveal.",
        },
      ],
      task: {
        title: 'Do one mock round',
        steps: [
          'Turn on the Mock interviewer role and ask for a technical round, or use the practice prompt.',
          'Think out loud in your replies, and test your solution by hand.',
          'Write down your lowest score and the tip for it.',
          'Prepare your opening question about AI rules, in one sentence, for your next real interview.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write the five steps of a no-AI round on a card in your own words (repeat, simple approach, talk, test by hand, improve). Practise saying them aloud while you solve a tiny problem, such as adding up a list.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Record yourself in two 20-minute mock rounds, one without AI and one with it. In the AI round, write a failing test or spec first, review each suggestion as a diff, and note two places where you changed or rejected its output.",
          ],
        },
      ],
    },
    {
      id: 'developer-16',
      day: 16,
      title: 'Behavioural interviews with STAR',
      summary: 'Prepare five true stories and tell them clearly with Situation, Task, Action, Result.',
      intro: {
        objectives: [
          'Tell a story in the Situation, Task, Action, Result shape',
          'Tell the four STAR parts apart in a real answer',
          'Choose five true stories from school, OJT, projects or work',
          'Say I, not only we, when you describe your own actions',
        ],
        why: 'Behavioural questions often decide between two candidates with similar skills. True stories prepared ahead sound calm and specific, even when you have no work experience yet.',
      },
      minutes: 15,
      skills: ['interviewing'],
      body: [
        {
          type: 'paragraph',
          text: "Almost every interview includes questions like 'Tell me about a time you faced a difficult problem.' For a junior, these questions often decide between two candidates with similar technical skills. The good news: you can prepare them in advance.",
        },
        { type: 'heading', text: 'The STAR method' },
        {
          type: 'list',
          items: [
            '**Situation:** the context, in one or two sentences.',
            '**Task:** what you had to do, or the problem you owned.',
            '**Action:** what **you** did, step by step. This is the longest part. Say "I", not only "we".',
            '**Result:** what happened, with a number if you have one, and what you learned.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **behavioural interview** question asks about your past: tell me about a time when something happened. The idea is that how you acted before shows how you will act at work. **STAR** is a simple shape for answers: **S**ituation, **T**ask, **A**ction, **R**esult. Imagine telling a short story to a friend: where were you, what needed doing, what did you do, how did it end? **OJT** means on-the-job training, an internship during school. You do not need a job to have stories: a class project, a club, a family shop or helping a neighbour with a phone can all work, as long as the story is true.",
        },
        { type: 'heading', text: 'Example' },
        {
          type: 'paragraph',
          text: "**Question:** Tell me about a time you had to learn something quickly.",
        },
        {
          type: 'paragraph',
          text: "**S:** In our capstone, our team built a clinic appointment app, and two weeks before the defence our database teammate got sick. **T:** I had to take over the database part, which I had never done. **A:** I read the existing code with an AI assistant explaining each query, wrote down every table and how they connect, then fixed one failing feature at a time with a test for each. I asked our adviser to review my schema changes. **R:** We finished the booking feature on time, the panel accepted the system, and I now use the same read-then-test approach on any new codebase.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-16-match-1",
            kind: "match",
            title: "Find the STAR parts",
            prompt: "These lines come from Ana's answer to \"Tell me about something you are proud of.\" Match each line with the STAR part it plays.",
            concept: "star method",
            labels: { terms: "Lines from Ana's answer", meanings: "STAR part" },
            pairs: [
              {
                term: "During my OJT at a logistics company, the staff spent two hours every morning putting the daily report together by hand.",
                definition: "Situation: the context",
              },
              {
                term: "My supervisor asked me to make that report faster before my OJT ended.",
                definition: "Task: what you had to do",
              },
              {
                term: "I wrote a script that pulled the data from the spreadsheet, compared its totals with a report they had made by hand, and asked the staff for feedback.",
                definition: "Action: what you did, step by step",
              },
              {
                term: "The report now takes ten minutes, and I learned to check automated numbers against a manual run first.",
                definition: "Result: what happened",
              },
            ],
            hints: [
              "One line sets the scene and says nothing about what Ana did.",
              "The problem she was asked to own comes before what she did about it.",
              "The longest line, full of \"I\", is the action; the line with a number and a lesson is the result.",
            ],
            explanation: "The slow report sets the situation, the supervisor's request is the task Ana owned, the script and the checks are her actions in her own words, and the ten minutes plus the lesson she learned are the result.",
          },
        },
        {
          type: 'paragraph',
          text: "Notice the story is specific, mentions AI honestly as a tool, and ends with a lesson. You do not need work experience: school projects, thesis, OJT or internship, freelance gigs, org work, even family business tasks all count.",
        },
        { type: 'heading', text: 'Your five stories' },
        {
          type: 'list',
          ordered: true,
          items: [
            'A hard technical problem you solved',
            'A mistake you made and what you changed after',
            'A conflict or disagreement in a team',
            'A time you learned something fast',
            'Something you are proud of building',
          ],
        },
        {
          type: 'paragraph',
          text: "One good story can answer several questions. Practise telling each in about two minutes.",
        },
        {
          type: 'prompt',
          label: 'Shape my story with STAR',
          text: "Help me turn this rough story into a STAR answer for a junior developer interview. Ask me up to 4 questions to fill in missing details, especially what I personally did and the result. Then write the answer in under 200 words, in simple spoken English, using 'I' for my actions. Do not invent facts I did not give you.\n\nMy rough story: [...]",
        },
        {
          type: 'warning',
          text: "Never invent a story or a result. Interviewers ask follow-up questions, and made-up details fall apart quickly. A small true story told well beats a big fake one.",
        },
        {
          type: 'tip',
          text: "Prepare two questions to ask them, such as 'What does a good first three months look like for a junior here?' or 'How does the team use AI tools day to day?'",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Experienced candidates fail STAR in the opposite way: too much scope and no signal. Choose stories where you made a decision under constraints, and show the trade-off you weighed, the evidence you used, whom you aligned and what you would change. Quantify honestly with measures you can defend, such as latency, defects, hours or incidents, and use we for the team but I for your own calls. Prepare an AI-specific story: a time a model's output was plausible but wrong, how you detected it (a test, a review, a source) and what process changed afterwards. Expect probing follow-ups, so every detail must be something you can explain. Interviewers read ownership, scope and learning from the same story.",
        },
        {
          type: "takeaways",
          items: [
            "STAR stands for Situation, Task, Action, Result. The Action is the longest part, and it says \"I\".",
            "Prepare five true stories: a hard problem, a mistake, a conflict, fast learning and something you are proud of.",
            "School projects, thesis, OJT, freelance gigs and org work all count.",
            "Never invent a story or a result. A small true story told well beats a big fake one.",
            "Prepare two questions to ask them.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-16-q1',
          prompt: 'Which part of a STAR answer should usually be the longest?',
          choices: ['Situation', 'Task', 'Result', 'Action'],
          answer: 3,
          explanation: 'The Action shows what you personally did and how you think, which is what the interviewer is assessing.',
        },
        {
          id: 'developer-16-q2',
          prompt: 'You have no work experience yet. Which stories can you use?',
          choices: [
            'Only stories from paid jobs',
            'School projects, thesis, OJT, freelance gigs and org work',
            'Stories you make up',
            "A friend's work stories",
          ],
          answer: 1,
          explanation: 'Any real situation where you solved problems or worked with people counts.',
        },
        {
          id: 'developer-16-q3',
          prompt: 'Why say "I" instead of only "we" in the Action part?',
          choices: [
            'The interviewer needs to know what you personally did',
            'Saying "we" is impolite',
            'Teamwork does not matter',
            'It makes the story shorter',
          ],
          answer: 0,
          explanation: 'Team results are good, but the interviewer is hiring you, so make your own contribution clear.',
        },
        {
          id: "developer-16-q4",
          audience: { max: "beginner" },
          prompt: "What does the S in STAR stand for?",
          choices: [
            "Skill: the programming language that you used",
            "Solution: the final code that you wrote",
            "Salary: what you hoped to earn in the job",
            "Situation: the background of your story in a sentence or two",
          ],
          answer: 3,
          explanation: "The S sets the scene briefly so the listener understands the problem before you describe what you did.",
        },
        {
          id: "developer-16-q5",
          audience: { min: "advanced" },
          prompt: "Which story is strongest for a behavioural question about AI-assisted work at a senior level?",
          choices: [
            "A time the assistant wrote a whole feature and everything worked on the first try",
            "A time generated code passed review but failed on an edge case, how you detected it and which checks you added afterwards",
            "A list of the AI tools your team adopted during the last year",
            "A time you refused to use AI because you do not trust it",
          ],
          answer: 1,
          explanation: "It shows ownership, detection, and a process change. A story where nothing went wrong, or a tool list, gives the interviewer no judgement to assess.",
        },
      ],
      task: {
        title: 'Write two STAR stories',
        steps: [
          'List one real situation for each of the five story types.',
          'Use the STAR prompt to shape two of them, checking that nothing was invented.',
          'Say each one out loud and time it; aim for about two minutes.',
          'Ask the Mock interviewer for a behavioural round and use one of your stories.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Tell a friend one STAR story in four sentences, one for each letter. Ask which letter was hardest to hear, and strengthen that part.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Write a decision-focused story with the trade-off, the evidence and the result, plus an AI-specific story where model output was wrong. Practise follow-ups: have someone ask three why questions and answer them without notes.",
          ],
        },
      ],
    },
    {
      id: 'developer-17',
      day: 17,
      title: 'Deploy your app with a live link',
      summary: 'Put your app online with its secrets in the host settings, and check it like a stranger would.',
      intro: {
        objectives: [
          'Choose a host that fits a static page, a server app or a database',
          'Make an app deploy-ready: read PORT, add a start script and keep secrets in the host settings',
          'Check a live app the way a stranger would',
          'Protect a public AI feature with input limits, rate limiting and a spending cap',
        ],
        why: 'A live link lets an employer try your capstone in one click. Deploying also shows you think about secrets and cost, which a project on localhost cannot.',
      },
      minutes: 15,
      skills: ['full-stack', 'portfolio'],
      body: [
        {
          type: 'paragraph',
          text: "A live link turns 'trust me, it works' into 'click here'. Today you learn the steps to deploy, so your capstone can go online. Project 3 opens after this lesson.",
        },
        { type: 'heading', text: 'Choose a host that fits your app' },
        {
          type: 'list',
          items: [
            '**Static pages** (HTML, CSS, JavaScript with no server): GitHub Pages, Netlify or Vercel are common choices.',
            '**An app with a server** (like your Express API): a host that runs Node or Python servers, such as Render or Railway. Some front-end hosts also run server functions; check their docs.',
            '**A database:** many hosts offer a managed PostgreSQL, or you can use a separate database service.',
          ],
        },
        {
          type: "table",
          caption: "Match the host to your app",
          headers: [
            "Your app is",
            "You need",
            "Common choices",
          ],
          rows: [
            [
              "Static pages (no server)",
              "A static host",
              "GitHub Pages, Netlify or Vercel",
            ],
            [
              "An app with a server, like your Express API",
              "A host that runs Node or Python servers",
              "Render or Railway (some front-end hosts also run server functions)",
            ],
            [
              "Data that must survive a restart",
              "A database",
              "A managed PostgreSQL from the host, or a separate database service",
            ],
          ],
        },
        {
          type: 'paragraph',
          text: "Hosts change their plans and limits often. Read the current pricing and limits page before you choose, and set a budget alert if the host offers one.",
        },
        { type: 'heading', text: 'Make your app deploy-ready' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Read the port from the environment, because most hosts tell your app which port to use.',
            'Put a `start` script in `package.json`, such as `"start": "node server.mjs"`.',
            'Set secrets like `AI_API_KEY` in the host dashboard as environment variables, never in the repo.',
            'Store data in a real database if it must survive a restart.',
          ],
        },
        {
          type: 'code',
          language: 'javascript',
          label: 'server.mjs (port)',
          code: `const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('API running on port ' + port);
});`,
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**Deploying** means putting your app on a computer that is always on and connected to the internet, so anyone with the link can open it. The company that runs that computer is the **host**. A **port** is a numbered door on that computer where your app listens; the host decides which door, so your code asks for it with `process.env.PORT`. An **environment variable** is a setting stored outside your code, such as your API key, so it never appears in your files or on GitHub. **Logs** are the diary your app writes about what happened, which you read when something breaks. **Rate limiting** means refusing visitors who ask too often.",
        },
        { type: 'heading', text: 'Check it like a stranger' },
        {
          type: 'list',
          items: [
            'Open the live link in a private browser window and on your phone with mobile data.',
            'Try the main flow, the AI feature and one bad input.',
            'Open the browser developer tools and confirm no API key appears anywhere in the page or network requests.',
            'Look at the host logs for errors.',
          ],
        },
        {
          type: 'prompt',
          label: 'Deployment checklist for my app',
          text: "I want to deploy my app. It is a [Node.js Express API with a plain HTML front end / describe your stack] that calls an AI model and uses [no database / SQLite / PostgreSQL]. Give me a step-by-step deployment checklist for a host such as [host name]: what to change in my code, which environment variables to set, how to see logs, and common mistakes beginners make. If something depends on the host's current settings or plans, tell me to check their docs instead of guessing.",
        },
        {
          type: 'warning',
          text: "A public app that calls an AI model can be abused by strangers who run up your bill. Add simple protections: a limit on input length, basic rate limiting, and a spending cap with the AI provider.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-17-scenario-1",
            kind: "scenario",
            title: "Before you share the link",
            prompt: "What do you add before you share the live link?",
            concept: "protecting an ai feature",
            situation: "Your capstone is deployed. Every request to its AI feature costs you money, and the link is about to be public.",
            options: [
              {
                text: "Limit input length, add basic rate limiting, and set a spending cap with the AI provider.",
                consequence: "No single visitor or bot can cost you much, and the bill has a ceiling.",
                quality: "best",
              },
              {
                text: "Only set a spending cap with the provider.",
                consequence: "The bill stops at the cap, but one visitor can use up the whole budget and then the feature stops working for real users.",
                quality: "acceptable",
              },
              {
                text: "Nothing. Nobody will find the link.",
                consequence: "Strangers and bots can run up your bill, and you may only notice when the invoice arrives.",
                quality: "poor",
              },
            ],
            hints: [
              "Think about two problems: one visitor sending a lot, and the total bill.",
              "The lesson lists three protections.",
              "Input length, rate limiting and a spending cap work together.",
            ],
            explanation: "Input limits and rate limiting control how much any one visitor can cost you, and a spending cap puts a ceiling on the bill. Together they protect a public AI feature.",
          },
        },
        {
          type: 'tip',
          text: "Put the live link at the top of your README and in your GitHub repo's About section, so reviewers find it in one click.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Deployment is where operations enter. Make builds reproducible (lockfile, `npm ci`, a pinned runtime) and run the tests in CI before each deploy. Keep secrets in the host's or the platform's secret store, one set per environment. Add a health endpoint, structured logs without prompts or personal data, and an alert on error rate and spend. Rate-limit per user or key, not only per IP: behind a host's proxy Express reports the proxy's address unless you configure `trust proxy`, and trusting too much lets clients spoof `X-Forwarded-For`, so set it to the exact number of proxies. Cap input size and the model's output length, since OWASP lists unbounded consumption as an LLM risk. Plan rollback: keep the previous release, and prefer database changes you can undo.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "Express: with trust proxy at its default of false, the client address comes from the socket, so behind a reverse proxy req.ip is the proxy's address; the setting accepts a number of hops, subnets or a function, and trusting an unvalidated X-Forwarded-For lets clients supply any value. OWASP Top 10 for LLM Applications (2025) lists Unbounded Consumption as LLM10. npm ci installs from the lockfile and fails if it does not match package.json.",
          checked: "2026-11-14",
          sources: [
            { label: "Express: behind proxies", url: "https://expressjs.com/en/guide/behind-proxies.html" },
            { label: "OWASP Top 10 for LLM Applications (2025)", url: "https://genai.owasp.org/llm-top-10/" },
            { label: "npm documentation: npm ci", url: "https://docs.npmjs.com/cli/v11/commands/npm-ci" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "Choose a host that fits your app: static pages, an app with a server, or a database, and read the current pricing and limits.",
            "Make the app deploy-ready: read the port from the environment, add a `start` script, set secrets in the host dashboard and use a real database for data that must last.",
            "Check the live app like a stranger: a private window, your phone, one bad input, and no key in the page or network requests.",
            "Protect a public AI feature with input limits, rate limiting and a spending cap.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-17-q1',
          prompt: 'Where should `AI_API_KEY` be set for a deployed app?',
          choices: [
            'In the host dashboard as an environment variable',
            'In a committed `.env` file',
            'In the README so the host can find it',
            'In the front-end JavaScript',
          ],
          answer: 0,
          explanation: 'Hosts provide a safe place for secrets. Your code reads them from the environment at run time.',
        },
        {
          id: 'developer-17-q2',
          prompt: 'Why use `process.env.PORT || 3000`?',
          choices: [
            'Port 3000 is not allowed online',
            'It makes the server faster',
            'The host can choose the port, and your laptop still uses 3000',
            'It hides the API from users',
          ],
          answer: 2,
          explanation: 'Many hosts set the PORT variable for your app. The fallback keeps local development working.',
        },
        {
          id: 'developer-17-q3',
          prompt: 'Your notes disappear every time the host restarts the app. What is the likely cause?',
          choices: [
            'The host deletes data on purpose to save money',
            'The notes are stored in memory instead of a database',
            'The front end is broken',
            'The API key expired',
          ],
          answer: 1,
          explanation: 'In-memory arrays are lost on every restart. Data that must last needs a database.',
        },
        {
          id: 'developer-17-q4',
          prompt: 'Which protection helps stop strangers running up your AI bill?',
          choices: [
            'A bigger server',
            'A longer README',
            'More AI features',
            'Input length limits, rate limiting and a spending cap',
          ],
          answer: 3,
          explanation: 'These limit how much any one visitor, or a bot, can cost you.',
        },
        {
          id: "developer-17-q5",
          audience: { max: "beginner" },
          prompt: "In plain words, what is an environment variable?",
          choices: [
            "A variable that changes how the weather looks in your app",
            "A setting stored outside your code, such as an API key, that your program reads when it runs",
            "A folder where all of your project tests are kept",
            "A copy of your app that runs on another laptop",
          ],
          answer: 1,
          explanation: "Environment variables keep values like keys out of your files and your Git history, and the host lets you set them safely.",
        },
        {
          id: "developer-17-q6",
          audience: { min: "advanced" },
          prompt: "Your API sits behind the host's proxy, and the IP-based rate limiter blocks every user after a few requests. What is the likely cause and fix?",
          choices: [
            "The limiter counts too slowly, so raise the limit until the complaints stop",
            "Express blocks proxies by default, so switch the rate limiter off",
            "Browsers share one address, so move the limiter into the front-end code",
            "Every request appears to come from the proxy's address, so configure Express's trust proxy to the real number of proxies",
          ],
          answer: 3,
          explanation: "With trust proxy at its default, req.ip is the proxy's socket address, so all users look like one client. Setting the exact number of trusted proxies restores the real client address.",
        },
      ],
      task: {
        title: 'Deploy your API',
        steps: [
          'Update `server.mjs` to read `process.env.PORT` and add a `start` script.',
          'Create an account with a host that runs Node servers and connect your GitHub repo.',
          'Set any secrets as environment variables in the host dashboard and deploy.',
          'Open the live link on your phone and check the developer tools for leaked keys.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write a one-page sheet of deployment words in your own words: deploy, host, port, environment variable, log and rate limiting. Give each an analogy, such as a food stall, a door number or a diary.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add a `/health` route, structured logs without sensitive data, a per-user rate limit and a cap on input size and on the model's output length. Deploy a previous release on purpose to practise a rollback, and write the steps down.",
          ],
        },
      ],
    },
    {
      id: 'developer-18',
      day: 18,
      title: 'Résumé and GitHub profile for juniors',
      summary: 'Write a one-page résumé led by projects, and a GitHub profile that shows your best work first.',
      intro: {
        objectives: [
          'Lay out a one-page junior résumé led by projects',
          'Write a project bullet with an action, the stack and a result',
          'Set up a GitHub profile README and pin your best projects',
          'Keep every claim to what you can explain in an interview',
        ],
        why: 'Your résumé and GitHub profile are the first things an employer sees. Pointing both at your best projects gives you proof that a long skills list cannot.',
      },
      minutes: 15,
      skills: ['portfolio', 'job-search'],
      body: [
        {
          type: 'paragraph',
          text: "Your résumé gets a quick scan, often by software first and then a person. For juniors, the strongest section is usually **projects**, not work history. Your GitHub profile is where the reader goes next, so both must point to the same best work.",
        },
        { type: 'heading', text: 'Résumé structure (one page)' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Header:** name, city, email, phone, LinkedIn, GitHub, portfolio link. No need for a photo, age or civil status unless the job post asks.',
            '**Summary:** two lines. Example: "IT graduate who builds full-stack web apps with AI features. Comfortable with JavaScript, Python, Git and testing."',
            '**Projects:** your three Talino projects, each with a link, the stack and one or two results.',
            '**Skills:** grouped (Languages, Frameworks, Tools). Only list what you can be questioned on.',
            '**Education, OJT or internship, and certifications.**',
          ],
        },
        {
          type: "activity",
          activity: {
            id: "developer-18-match-1",
            kind: "match",
            title: "Résumé sections",
            prompt: "Match each résumé section with what belongs in it.",
            concept: "junior résumé",
            pairs: [
              {
                term: "Header",
                definition: "Name, city, email, phone, LinkedIn, GitHub and portfolio link",
              },
              {
                term: "Summary",
                definition: "Two lines about who you are and what you build",
              },
              {
                term: "Projects",
                definition: "Your three projects, each with a link, the stack and one or two results",
              },
              {
                term: "Skills",
                definition: "Grouped lists, only what you can be questioned on",
              },
              {
                term: "Education",
                definition: "Education, OJT or internship, and certifications",
              },
            ],
            hints: [
              "Projects are the strongest section for a junior.",
              "Only one section should have links to your live work and results.",
              "Skills must be things you could be asked about in an interview.",
            ],
            explanation: "For a junior, projects lead as the proof. The header makes you easy to reach, the summary is two lines, skills are only what you can defend, and education follows.",
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **résumé** is a one-page summary of who you are and what you can do, sent with every application. An **ATS** (applicant tracking system) is software many companies use to collect and search the applications they get, which is why simple layouts and standard headings help. A **bullet** is one short line describing something you did. A **skill** is something you can do, and it belongs on the page only if you could answer questions about it. A **profile README** is the front page of your GitHub account, and a **pinned** repository is a project you choose to show first. Everything on the page should point to proof someone can open.",
        },
        { type: 'heading', text: 'Project bullets that work' },
        {
          type: 'paragraph',
          text: "Use action plus what you built plus result or detail. Weak: 'Made a notes app.' Strong: 'Built a notes app with an Express REST API, input validation and tests; added AI summaries through a server route so the API key never reaches the browser.'",
        },
        {
          type: 'prompt',
          label: 'Strengthen my résumé bullets',
          text: "Here are my project descriptions for a junior developer résumé. Rewrite each as one or two bullet points starting with an action verb, naming the tech stack and a concrete detail or result. Use only facts I gave you; if a bullet would be stronger with a number or detail I did not provide, ask me for it instead of inventing it. Keep it plain and simple to read.\n\n[paste your project notes]",
        },
        {
          type: 'tip',
          text: "Use a simple layout: one column, standard headings, normal fonts, saved as PDF. Fancy layouts with tables, icons and two columns can confuse applicant tracking systems.",
        },
        { type: 'heading', text: 'Your GitHub profile' },
        {
          type: 'list',
          items: [
            '**Profile README:** create a public repo named exactly like your username, and its README appears on your profile. Write three lines: who you are, what you build, how to reach you.',
            '**Pin** your three projects so they appear first.',
            "**Each pinned repo** has a description, a live link if deployed, and a README that runs from a fresh clone.",
            '**Clean up:** archive or make private old tutorial copies that do not represent you.',
          ],
        },
        {
          type: 'warning',
          text: "Never claim skills, jobs or results you do not have. Everything on your résumé is fair game for an interview question, and a background check can verify dates.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the résumé and profile as an index of evidence. Every bullet should link to something checkable: a pull request, a design note, a test run, a live URL. Prefer outcomes with measures you can defend, and name the constraints you worked under. Show system-level scope (ownership of a service boundary, a migration, a reliability or performance change) rather than a list of technologies. On GitHub, make each pinned repository show current best practice: a README with architecture and limits, CI status, tests, a lockfile, no secrets and a history that reads sensibly. Describe AI use specifically and honestly, for example: drafted tests with an assistant, reviewed each one and rewrote the pricing assertions. Anything you claim can become an interview question.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "GitHub: a profile README comes from a public repository named exactly like your username, and you can pin up to six repositories and gists, combined, to your profile.",
          checked: "2026-11-14",
          sources: [
            { label: "GitHub Docs: managing your profile README", url: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme" },
            { label: "GitHub Docs: pinning items to your profile", url: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/pinning-items-to-your-profile" },
          ],
        },
        {
          type: "takeaways",
          items: [
            "For a junior, the strongest résumé section is usually projects, not work history.",
            "A project bullet starts with an action, names the stack and gives a concrete detail or result.",
            "Keep one page, one column, standard headings, saved as PDF.",
            "On GitHub, create a profile README, pin your three projects and tidy old tutorial copies.",
            "Never claim skills, jobs or results you do not have.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-18-q1',
          prompt: 'For a fresh graduate, which résumé section is often the strongest?',
          choices: ['Hobbies', 'A long objective statement', 'Projects with links', 'References'],
          answer: 2,
          explanation: 'Projects give concrete, checkable proof of what you can do.',
        },
        {
          id: 'developer-18-q2',
          prompt: 'How do you add a README to your GitHub profile page?',
          choices: [
            'Create a public repo with exactly the same name as your username and add a README',
            'Email GitHub support',
            'Add a file called PROFILE.md to any repo',
            'Change your display name',
          ],
          answer: 0,
          explanation: 'GitHub shows the README of the special repo that matches your username on your profile.',
        },
        {
          id: 'developer-18-q3',
          prompt: 'Which project bullet is strongest?',
          choices: [
            '"Made an app."',
            '"Responsible for coding."',
            '"Used many technologies."',
            '"Built an Express API with validation and tests, adding AI summaries through a server route."',
          ],
          answer: 3,
          explanation: 'It starts with an action, names the stack and shows good engineering choices.',
        },
        {
          id: "developer-18-q4",
          audience: { max: "beginner" },
          prompt: "What is an ATS?",
          choices: [
            "Software a company uses to collect and search the applications it receives",
            "A kind of coding test that is sent after an interview",
            "A website that hosts your finished projects",
            "A reference letter that a teacher writes for you",
          ],
          answer: 0,
          explanation: "An applicant tracking system stores and searches applications. Plain layouts and standard headings make a résumé easier for it to read.",
        },
        {
          id: "developer-18-q5",
          audience: { min: "advanced" },
          prompt: "Which résumé bullet gives an experienced reader the best evidence?",
          choices: [
            "Responsible for backend development using Node, Express, Python, Docker, AWS, SQL and AI tools",
            "Worked in a team on many different features using modern tools and best practices",
            "Reduced slow API responses by adding a database index and a cache, with the pull request and before-and-after load-test notes linked",
            "Used AI to build the whole project quickly and reliably from start to finish",
          ],
          answer: 2,
          explanation: "It names an action, a mechanism and a result, and links proof. The others list technologies or make claims nobody can check.",
        },
      ],
      task: {
        title: 'Résumé and profile refresh',
        steps: [
          'Write or update your one-page résumé with a projects section at the top.',
          'Use the bullet prompt on your two best projects.',
          'Create your GitHub profile README and pin your projects.',
          'Ask Tali to review the résumé for a junior developer role and fix the top two points.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Underline every word on your résumé that you could not explain to a friend in one sentence. Either learn it well enough to explain, or take it off.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Rewrite each project bullet so it links to evidence (a pull request, test run, design note or live URL), names a constraint or trade-off and states AI use precisely. Then check each pinned repo against a checklist: README, CI, tests, lockfile, no secrets.",
          ],
        },
      ],
    },
    {
      id: 'developer-19',
      day: 19,
      title: 'Apply smart and follow up',
      summary: 'Find junior roles on job sites and company pages, tailor each application, and follow up politely.',
      intro: {
        objectives: [
          'List where to find junior roles: job sites, company career pages and your network',
          'Tailor an application in about ten minutes',
          'Track your applications and send one polite follow-up',
          'Spot the signs of a job scam',
        ],
        why: 'Tailored, tracked applications usually do better than a hundred copies of one résumé, and job scams target new graduates. A simple system keeps your search steady and safe.',
      },
      minutes: 15,
      skills: ['job-search'],
      body: [
        {
          type: 'paragraph',
          text: "Sending the same résumé to a hundred posts feels productive, but tailored applications usually do better. Today you set up a simple system: where to look, how to tailor, how to track and how to follow up.",
        },
        { type: 'heading', text: 'Where to look' },
        {
          type: 'list',
          items: [
            '**Job sites:** JobStreet, LinkedIn Jobs and Kalibrr are widely used in the Philippines. Search for "junior developer", "associate software engineer", "trainee developer" and "graduate programme".',
            "**Company career pages:** many banks, telcos, IT services firms and startups post roles on their own sites first. Make a list of companies you admire and check them weekly.",
            '**Your network:** classmates, professors, former OJT supervisors, tech communities and meetups. A referral often gets your résumé read by a person.',
          ],
        },
        { type: 'heading', text: 'Tailor in ten minutes' },
        {
          type: 'list',
          ordered: true,
          items: [
            'Read the post and highlight the must-have skills.',
            'Reorder your projects and skills so the matching ones come first.',
            'Write a short cover note: why this company, which project fits, and one line about how you use AI responsibly.',
          ],
        },
        {
          type: 'prompt',
          label: 'Tailor my application',
          text: "Here is a job post and my résumé. List the top 5 requirements from the post and rate how well my résumé shows each (strong, partial, missing). Suggest which project to put first and how to reword two bullets to match the post, using only facts from my résumé. Then draft a cover note under 120 words in a friendly professional tone.\n\nJob post: [...]\nMy résumé: [...]",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **job post** is an advertisement for an open role. The **must-haves** are the skills it says are required, and the **nice-to-haves** are bonuses. A **recruiter** is someone whose job is to find and shortlist candidates. A **referral** is when someone who already works there recommends you. A **cover note** is a short message telling the reader why you fit this role. **Tailoring** means changing the order and wording of your résumé so the most relevant proof comes first. You are not changing the truth, only choosing what to show first. Use the same facts every time, so you can explain every line.",
        },
        { type: 'heading', text: 'Track and follow up' },
        {
          type: 'paragraph',
          text: "Keep a simple spreadsheet: company, role, link, date applied, contact, status, next step. If you hear nothing after about a week, one short, polite follow-up is fine:",
        },
        {
          type: 'code',
          language: 'text',
          label: 'Follow-up message',
          code: `Hi [Name],

I applied for the Junior Developer role on [date] and wanted to
check whether you need anything else from me. I recently deployed
[project], which uses [skill from the post]: [live link].

Thank you for your time.
[Your name]`,
        },
        {
          type: 'warning',
          text: "Watch for scams. A real employer does not ask you to pay for an application, training or equipment before hiring you. Be careful sending government IDs or bank details before you have verified the company and received a written offer. If unsure, check with DOLE or the company's official website.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-19-scenario-1",
            kind: "scenario",
            title: "A job offer that wants money",
            prompt: "What do you do?",
            concept: "spotting job scams",
            situation: "A \"company\" messages you a junior developer offer after one chat. Before your first day it asks you to pay for training and equipment, and to send a photo of your government ID.",
            options: [
              {
                text: "Do not pay. Verify the company through its official website or DOLE, and get the offer in writing before you share any ID.",
                consequence: "You stay safe. A real employer does not charge you to be hired, and verifying costs you nothing.",
                quality: "best",
              },
              {
                text: "Ignore the message without checking anything.",
                consequence: "You stay safe, but if the offer was real you lost it, and you learned nothing about how to tell.",
                quality: "acceptable",
              },
              {
                text: "Pay the fee quickly so you do not lose the slot.",
                consequence: "Real employers do not charge applicants. You lose the money and may lose your ID details too.",
                quality: "poor",
              },
            ],
            hints: [
              "Who normally pays whom when you are hired?",
              "Be careful sending government IDs or bank details before you have verified the company and received a written offer.",
              "DOLE or the company's official website can help you check.",
            ],
            explanation: "A real employer does not ask you to pay for an application, training or equipment. Verify the company and get a written offer before you share IDs or money.",
          },
        },
        {
          type: 'tip',
          text: "Rejections and silence are normal, even for strong candidates. Track your numbers weekly and adjust one thing at a time: the résumé, the roles you target, or your projects.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Treat the search as a pipeline you can measure. Track source, role, date, whether there was a referral, stage and outcome in a sheet, and change one variable at a time (target role, résumé, outreach) so you can tell what helped. Where you can, prefer a specific contact plus evidence, a short note linking to relevant work, over a generic form. Read the post for the real problem (scale, legacy code, on-call, AI tool policy) and map your evidence to it, and ask in screening what the team's AI policy is and how review handles AI-assisted changes. Prepare for take-home and pair rounds with a repeatable routine. Verify the employer before sharing documents, and treat any request for payment as a red flag.",
        },
        {
          type: "takeaways",
          items: [
            "Look in three places: job sites, company career pages and your network.",
            "Tailor each application in about ten minutes: highlight the must-haves, reorder your projects and skills, and write a short cover note.",
            "Track every application in a simple spreadsheet, and follow up politely once after about a week.",
            "A real employer does not ask you to pay to be hired. Verify before you share IDs or bank details.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-19-q1',
          prompt: 'Why tailor each application instead of sending the same one everywhere?',
          choices: [
            'Job sites block identical résumés',
            'Matching your projects and skills to the post makes it easier for the reader to see you fit',
            'It lets you add skills you do not have',
            'Tailoring is only for senior roles',
          ],
          answer: 1,
          explanation: 'Readers spend little time per résumé. Putting the most relevant proof first helps them say yes.',
        },
        {
          id: 'developer-19-q2',
          prompt: 'A "company" asks you to pay a training fee before your first day. What does that suggest?',
          choices: [
            'It is a normal hiring step',
            'You should pay quickly before the slot fills',
            'It is a warning sign of a possible scam; verify the company first',
            'It means the job pays well',
          ],
          answer: 2,
          explanation: 'Legitimate employers do not charge applicants to be hired. Verify through official channels before sharing money or IDs.',
        },
        {
          id: 'developer-19-q3',
          prompt: 'When is a follow-up message appropriate?',
          choices: [
            'After about a week with no reply, once and politely',
            'Every day until they answer',
            'Never; it annoys recruiters',
            'One hour after applying',
          ],
          answer: 0,
          explanation: 'One short, polite follow-up shows interest without being pushy.',
        },
        {
          id: "developer-19-q4",
          audience: { max: "beginner" },
          prompt: "What does tailoring an application mean?",
          choices: [
            "Adding skills from the job post even when you lack them",
            "Sending the same résumé to every post to save time",
            "Putting the most relevant projects and skills first for this particular job, using only true facts",
            "Rewriting your name and education to match the employer",
          ],
          answer: 2,
          explanation: "Tailoring changes the order and emphasis, never the facts, so the reader sees the best proof for their role first.",
        },
        {
          id: "developer-19-q5",
          audience: { min: "advanced" },
          prompt: "After 30 applications you have heard nothing. Which next step makes the best use of your data?",
          choices: [
            "Review the tracker for patterns by source and role, change one variable such as the target role or the project shown, and measure again",
            "Triple the number of applications this week without changing anything",
            "Change the résumé, the roles, the locations and the outreach all at once",
            "Stop tracking and apply only through referrals you do not have",
          ],
          answer: 0,
          explanation: "Changing one variable at a time lets you attribute any change in results to it. Sending more of the same, or changing everything at once, teaches you nothing.",
        },
      ],
      task: {
        title: 'Your first tailored application',
        steps: [
          'Create a job tracker spreadsheet with the columns above.',
          'Find three junior roles across JobStreet, LinkedIn, Kalibrr or company career pages, and add them.',
          'Use the tailoring prompt for one role and send that application.',
          'Add a calendar reminder to follow up in about a week.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Take one job post and highlight the must-haves in one colour and the nice-to-haves in another. Beside each must-have, write the project or experience of yours that shows it, or the word gap.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add stage, source and outcome columns to your tracker. Pick one hypothesis about a target role, send ten applications or outreach messages with evidence links, and review the results against your baseline before you change anything else.",
          ],
        },
      ],
    },
    {
      id: 'developer-20',
      day: 20,
      title: 'Your first 90 days on the job with AI',
      summary: 'Learn the codebase, follow the AI policy, ship small changes and build trust in your first three months.',
      intro: {
        objectives: [
          'Ask the right questions about the AI policy in your first week',
          'Describe what to do in each part of your first 90 days',
          'Decide what to do when you are stuck and company data is involved',
          'Keep a work log and turn it into a weekly update',
        ],
        why: 'Your first months decide how much your team trusts you. Knowing the plan, and the AI rules that protect the company and its customers, helps you start well.',
      },
      minutes: 15,
      skills: ['job-search', 'ai-assisted-coding'],
      body: [
        {
          type: 'paragraph',
          text: "Congratulations on reaching the last lesson. When you get that first offer, the next challenge begins: becoming a trusted teammate. Here is a plan for your first 90 days, with AI used the way a good team expects.",
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A few words from your first job. Your **lead** is the senior person who guides your work. A **ticket** is one task written in a tracking tool, such as fix the empty-cart error. The **codebase** is all the code of the product. **Onboarding** is the first weeks, when you learn how things work. A **policy** is a rule, such as which AI tools you may use with company code. A **work log** is your own notes of what you did and learned. Nobody expects you to know everything in week one. They expect you to ask good questions, follow the rules and finish small things carefully.",
        },
        { type: 'heading', text: 'Week 1: rules and setup' },
        {
          type: 'list',
          items: [
            "Ask about the AI policy: which tools are approved, what code and data may be shared, and whether AI use must be disclosed in pull requests.",
            'Set up the project locally by following the docs. Write down every step that was missing and offer to update the docs; it is a great first contribution.',
            'Learn who to ask for what: your lead, a buddy, the person who knows the database.',
          ],
        },
        { type: 'heading', text: 'Days 1 to 30: learn' },
        {
          type: 'list',
          items: [
            'Use the read loop from Day 3 on the real codebase, with approved tools only.',
            'Take small tickets: bug fixes, tests, small UI changes.',
            'Keep a work log: what you did, what you learned, what blocked you.',
          ],
        },
        { type: 'heading', text: 'Days 31 to 60: contribute' },
        {
          type: 'list',
          items: [
            'Ship small pull requests regularly, with tests and clear descriptions.',
            "Review teammates' pull requests; asking good questions counts.",
            'Find one annoying task the team repeats and suggest a small improvement.',
          ],
        },
        { type: 'heading', text: 'Days 61 to 90: own something' },
        {
          type: 'list',
          items: [
            'Take a small feature from start to finish.',
            'Ask your lead for feedback: "What should I do more of, and less of?"',
            'Set goals for the next quarter together.',
          ],
        },
        {
          type: "table",
          caption: "Your first 90 days",
          headers: [
            "When",
            "Focus",
            "What you do",
          ],
          rows: [
            [
              "Week 1",
              "Rules and setup",
              "Ask the AI policy, set up the project locally, learn who to ask",
            ],
            [
              "Days 1 to 30",
              "Learn",
              "Read the real codebase with approved tools, take small tickets, keep a work log",
            ],
            [
              "Days 31 to 60",
              "Contribute",
              "Ship small pull requests with tests, review others, suggest one small improvement",
            ],
            [
              "Days 61 to 90",
              "Own something",
              "Take a small feature from start to finish, ask for feedback, set goals together",
            ],
          ],
        },
        {
          type: 'prompt',
          label: 'Weekly update from my work log',
          text: "Here are my work log notes for this week. Turn them into a short weekly update for my team lead with three headings: Done, In progress, and Blocked or need help. Keep each item to one line, plain and specific, and do not exaggerate. Remove any customer names or sensitive details.\n\n[paste your notes]",
        },
        {
          type: 'tip',
          text: "When you are stuck, try alone for a fixed time, say 30 to 60 minutes, then ask. Bring what you tried and what you think is wrong. Seniors are glad to help a junior who did the homework.",
        },
        {
          type: 'warning',
          text: "Company code, customer data and internal documents stay inside approved tools. Pasting them into a personal AI account, even to 'just ask a quick question', can break your contract and the Data Privacy Act. When in doubt, ask.",
        },
        {
          type: "activity",
          activity: {
            id: "developer-20-scenario-1",
            kind: "scenario",
            title: "Stuck, with a customer record",
            prompt: "What do you do?",
            concept: "working with ai at a company",
            situation: "You have been stuck on a bug for an hour. It involves a real customer record, and your personal AI account is open in another tab.",
            options: [
              {
                text: "Ask a teammate, bringing what you tried and what you think is wrong, and use only approved tools for the code.",
                consequence: "You get help quickly, the customer data stays inside approved tools, and your teammate sees you did the homework.",
                quality: "best",
              },
              {
                text: "Keep trying alone for the rest of the day.",
                consequence: "The data stays safe, but you lose hours that a short question would have saved.",
                quality: "acceptable",
              },
              {
                text: "Paste the record and the code into your personal AI account to get a quick answer.",
                consequence: "Company code and customer data must stay inside approved tools. This can break your contract and the Data Privacy Act.",
                quality: "poor",
              },
            ],
            hints: [
              "Which tools are approved for company code and customer data?",
              "Try alone for a fixed time, say 30 to 60 minutes, then ask.",
              "When you ask, bring what you tried and what you think is wrong.",
            ],
            explanation: "Customer data and company code stay inside approved tools. After a fixed time of trying alone, asking a teammate with what you tried is efficient and respectful.",
          },
        },
        {
          type: 'paragraph',
          text: "You have now finished the lessons. Complete your three projects, practise with the Mock interviewer, and earn your certificate. Then keep going: the habits you built here are what make a good developer, with or without AI.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "In an existing codebase, the first 90 days are about context and trust. Read before you change: architecture notes, the CI configuration, ownership files, recent incidents and review norms. Pick tickets that touch one module and ship them with tests, a clear description and a note on any AI assistance. Learn the delivery path (branches, checks, deploys, rollbacks) and who is on call. For AI-assisted work, agree the policy early: approved tools, what may be shared, whether use is disclosed in pull requests and how agent-run changes are reviewed. Keep a decision log and a short weekly update. By the end, aim to own a small area: its tests, dashboards and docs, and the change you would make next.",
        },
        {
          type: "takeaways",
          items: [
            "Week 1: ask about the AI policy, set up the project and learn who to ask.",
            "Days 1 to 30 you learn, days 31 to 60 you contribute, days 61 to 90 you own something small.",
            "Keep a work log, so weekly updates and reviews are easy.",
            "Company code, customer data and internal documents stay inside approved tools.",
            "Try alone for a fixed time, then ask with what you tried.",
          ],
        },
      ],
      quiz: [
        {
          id: 'developer-20-q1',
          prompt: 'What is a smart first question in your first week?',
          choices: [
            'Which AI tools are approved and what code or data can be shared with them?',
            'When is my first promotion?',
            'Can I skip code review?',
            'Can I work only on new features?',
          ],
          answer: 0,
          explanation: 'Knowing the AI policy early keeps you, the company and its customers safe.',
        },
        {
          id: 'developer-20-q2',
          prompt: 'You have been stuck on a problem for an hour. What is the best next step?',
          choices: [
            'Keep trying silently for another day',
            "Paste the company's code into a personal AI account",
            'Ask a teammate, bringing what you tried and what you think is wrong',
            'Pick a different ticket and say nothing',
          ],
          answer: 2,
          explanation: 'Asking after a real attempt is efficient and respectful of other people\'s time. Personal AI accounts are not for company code.',
        },
        {
          id: 'developer-20-q3',
          prompt: 'Which is a good early contribution for a new junior?',
          choices: [
            'Rewriting the main architecture',
            'Fixing the setup docs with the steps that were missing',
            'Changing the code style of every file',
            'Removing tests that slow the build',
          ],
          answer: 1,
          explanation: 'It helps the next new hire, shows care, and is low risk.',
        },
        {
          id: 'developer-20-q4',
          prompt: 'Why keep a work log?',
          choices: [
            'Companies require it by law',
            'To share with AI tools',
            'To prove you worked overtime',
            'It makes weekly updates, reviews and asking for help much easier',
          ],
          answer: 3,
          explanation: 'Notes on what you did, learned and got stuck on turn into clear updates and evidence of growth.',
        },
        {
          id: "developer-20-q5",
          audience: { max: "beginner" },
          prompt: "What is a ticket at work?",
          choices: [
            "A document that you sign when you are hired",
            "A permission to use any AI tool you like",
            "A message from a customer's bank",
            "One task written down in a tracking tool, such as a bug to fix",
          ],
          answer: 3,
          explanation: "A ticket describes one piece of work so the team can assign, discuss and track it. Small tickets are the usual first tasks.",
        },
        {
          id: "developer-20-q6",
          audience: { min: "advanced" },
          prompt: "Your team has no written AI policy, and you want to use an assistant on an internal service. What is the best move?",
          choices: [
            "Use your personal assistant but avoid pasting any customer data",
            "Ask your lead and IT or security which tools and data are allowed, propose a short written policy, and use only approved tools until it exists",
            "Wait a year until a policy appears before using any tool at all",
            "Use the tool and disclose it only if a pull request reviewer asks",
          ],
          answer: 1,
          explanation: "A missing policy is a gap to close, not a licence. Asking, proposing a written rule and staying inside approved tools protects you, the code and the customers.",
        },
      ],
      task: {
        title: 'Write your 90-day plan',
        steps: [
          'Write three goals each for days 1–30, 31–60 and 61–90.',
          'Write the three questions you will ask in your first week, including the AI policy question.',
          'Start a work log file and add today: what you finished in this course.',
          'Check which projects are still open and plan when you will finish them.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Write your own glossary of ten work words (lead, ticket, codebase, onboarding, policy and more), with a one-line definition each and one question you would ask about each in your first week.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Draft a one-page AI working agreement for a team: approved tools, data rules, disclosure in pull requests, review rules for agent-run changes and test and CI requirements. Add how you would measure whether it helps (cycle time, review comments, defects) without inventing targets.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'developer-p1',
      title: 'AI-powered CLI or API',
      summary: 'A small command-line tool or REST API that calls an AI model to do one useful job well, with tests and a clear README.',
      outcome: 'Shows an employer you can integrate an AI model safely, keep secrets out of code and ship a tested, documented tool.',
      unlockAfterDay: 6,
      steps: [
        { id: 'developer-p1-s1', text: 'Finish your PLAN.md: the problem, who it helps, the AI feature, and an MVP of at most 5 features.' },
        { id: 'developer-p1-s2', text: 'Create a public GitHub repo with a .gitignore that excludes .env, and commit your plan.', link: 'https://github.com/new' },
        { id: 'developer-p1-s3', text: 'Build the core logic in small steps with tests first; keep the AI call in one function that reads the key from an environment variable.' },
        { id: 'developer-p1-s4', text: 'Handle failures: a missing key, a network error, an empty or strange AI reply, and input that is too long.' },
        { id: 'developer-p1-s5', text: 'Write the README with run steps, a .env.example, an example input and output, and a "How I used AI" section.' },
        { id: 'developer-p1-s6', text: 'Clone the repo into a fresh folder, follow your README exactly, then submit the repo link.' },
        { id: 'developer-p1-s7', audience: { max: "beginner" }, text: "Keep it small: one command, one input and one AI answer. When it works, ask your assistant to explain each line of your finished script in plain words, and add those notes as comments or in the README." },
        { id: 'developer-p1-s8', audience: { min: "intermediate", max: "intermediate" }, text: "Add an automated test for the code that reads the AI reply, using a fake model reply instead of the real service, so the tests run without a key or a network." },
        { id: 'developer-p1-s9', audience: { min: "advanced" }, text: "Add a timeout, retries with backoff for 429 and 5xx responses only, a schema check on the reply, and a small evaluation set of at least 15 examples with expected outputs committed to the repo." },
        { id: 'developer-p1-s10', audience: { min: "professional" }, text: "Use a coding agent for part of the build and keep the evidence in the repo: the spec you gave it, the diffs you rejected or rewrote, the tests that fail on the old code and the review checklist you applied." },
      ],
      submission: {
        kind: 'url',
        label: 'GitHub repository URL',
        placeholder: 'https://github.com/your-username/your-project',
        hint: 'A public repo with a README that runs from a fresh clone, tests for the main logic, a .env.example, and no API keys anywhere in the code or history.',
      },
      rubric: [
        'The README explains the problem, how to run it, and how AI was used',
        'The API key is read from an environment variable and no secret appears in the repo',
        'There are tests for the main logic and they pass',
        'Errors from the AI call (missing key, network failure, bad reply) are handled with clear messages',
        'Commits are small with clear messages',
      ],
      rubricExtra: [
        { audience: { max: "beginner" }, items: [
          "The project does one thing from one input, and the README explains each part of the code in plain words",
        ] },
        { audience: { min: "intermediate", max: "intermediate" }, items: [
          "Tests use a fake model reply, so they run without a key or a network connection",
        ] },
        { audience: { min: "advanced" }, items: [
          "Timeouts, retries only for transient errors and a reply schema check are in place",
          "An evaluation set with expected outputs is committed and described in the README",
        ] },
        { audience: { min: "professional" }, items: [
          "Agent-assisted work has review evidence: the spec, rejected or rewritten diffs and the checks applied",
        ] },
      ],
    },
    {
      id: 'developer-p2',
      title: 'A full-stack app with an AI feature',
      summary: 'A web app with a front end, an API and stored data, where one AI feature helps the user and the user stays in control of the result.',
      outcome: 'Proves you can build a complete feature across front end and back end, and place an AI call safely on the server.',
      unlockAfterDay: 12,
      steps: [
        { id: 'developer-p2-s1', text: 'Plan the app in PLAN.md: the user, the main flow, the AI feature, and what the user can check or edit when the AI is wrong.' },
        { id: 'developer-p2-s2', text: 'Build the API first with validation and correct status codes, plus tests for the main routes or logic.' },
        { id: 'developer-p2-s3', text: 'Store data in a database such as SQLite or PostgreSQL so it survives a restart.' },
        { id: 'developer-p2-s4', text: 'Add the AI feature as a server route; the front end calls your route and never sees the key.' },
        { id: 'developer-p2-s5', text: 'Build the front end with loading, empty, error and content states, using textContent or a framework that escapes text.' },
        { id: 'developer-p2-s6', text: 'Write the README with a screenshot or GIF and record a 60 to 90 second demo video.' },
        { id: 'developer-p2-s7', audience: { max: "beginner" }, text: "Start with one screen and one saved item. Ask your assistant to explain how the page, the API and the stored data connect, and draw them as three boxes in your README." },
        { id: 'developer-p2-s8', audience: { min: "intermediate", max: "intermediate" }, text: "Add sign-in, or at least per-user data separation, so a signed-in user can read and change only their own records, with a test showing that another user is refused." },
        { id: 'developer-p2-s9', audience: { min: "advanced" }, text: "Review the finished app against the OWASP Top 10:2025: test broken access control by calling the endpoints directly without the interface, check dependencies and secrets, and record the findings and fixes." },
        { id: 'developer-p2-s10', audience: { min: "professional" }, text: "Build one feature with an agent end to end: write the spec and acceptance tests first, keep the agent's changes in separate commits, review the diff like a colleague's pull request and note what you changed." },
      ],
      submission: {
        kind: 'url',
        label: 'GitHub repository URL',
        placeholder: 'https://github.com/your-username/your-app',
        hint: 'A public repo with a README (screenshot, run steps, how the AI feature works, how you used AI), a demo video link in the README, and tests for the main logic.',
      },
      rubric: [
        'The app has a working front end, API and persistent data',
        'The AI call runs on the server and the key never reaches the browser',
        'The user can review or edit the AI result before it matters',
        'The API validates input and returns sensible status codes',
        'The README includes a screenshot, run steps, a demo link and an honest AI-use note',
      ],
      rubricExtra: [
        { audience: { max: "beginner" }, items: [
          "The app is small, works end to end and the README explains its three parts in plain words",
        ] },
        { audience: { min: "intermediate", max: "intermediate" }, items: [
          "A user can reach only their own data, and a test shows that another user is refused",
        ] },
        { audience: { min: "advanced" }, items: [
          "Access control is enforced on the server and checked by calling the API directly, and a short security review lists findings and fixes",
        ] },
        { audience: { min: "professional" }, items: [
          "The AI-assisted workflow is evidenced by specs, acceptance tests, separate commits and a review record",
        ] },
      ],
    },
    {
      id: 'developer-p3',
      title: 'Your capstone, deployed',
      summary: 'Your best project, polished, tested and online with a live link you can put at the top of your résumé.',
      outcome: 'Gives employers a live app they can click, backed by clean code, tests and a README that shows how you think.',
      unlockAfterDay: 17,
      steps: [
        { id: 'developer-p3-s1', text: 'Choose your capstone: improve Project 2 or start a new idea, and write down the 3 improvements that matter most.' },
        { id: 'developer-p3-s2', text: 'Ask Tali to review your code like a senior developer, and fix the most important issues in small pull requests.' },
        { id: 'developer-p3-s3', text: 'Deploy to a host that fits your app, with secrets set as environment variables in the host dashboard.', link: 'https://render.com' },
        { id: 'developer-p3-s4', text: 'Protect the live AI feature: input length limits, basic rate limiting and a spending cap with your AI provider.' },
        { id: 'developer-p3-s5', text: 'Test the live link in a private window and on your phone, and confirm no key appears in the page or network requests.' },
        { id: 'developer-p3-s6', text: 'Put the live link at the top of the README and in the repo About section, pin the repo on your profile, and submit.' },
        { id: 'developer-p3-s7', audience: { max: "beginner" }, text: "Deploy the smallest version that works, and explain in your README in plain words what a host, a port, an environment variable and a log are." },
        { id: 'developer-p3-s8', audience: { min: "intermediate", max: "intermediate" }, text: "Add a health route and an automated check that runs your tests on every push, so a broken change never reaches the live app." },
        { id: 'developer-p3-s9', audience: { min: "advanced" }, text: "Add per-user rate limiting that works behind the host's proxy, structured logs without personal data and a spending alert, write the rollback steps and practise a rollback once." },
        { id: 'developer-p3-s10', audience: { min: "professional" }, text: "Add a short architecture and decision record, a threat-model table (assets, trust boundaries, abuse cases including prompt injection) and a review record for the AI-assisted changes." },
      ],
      submission: {
        kind: 'url',
        label: 'GitHub repository URL',
        placeholder: 'https://github.com/your-username/your-capstone',
        hint: 'A public repo whose README starts with the live link (for example https://your-app.onrender.com), plus run steps, tests, a demo video and an honest note on how you used AI.',
      },
      rubric: [
        'The live link works and the main flow, including the AI feature, can be tried',
        'No secrets are exposed in the repo, the page or network requests',
        'The live AI feature has basic abuse protection such as input limits or rate limiting',
        'The code is tested and the commit history shows steady, small changes',
        'The README leads with the live link and explains the design and AI use clearly',
      ],
      rubricExtra: [
        { audience: { max: "beginner" }, items: [
          "The live app works and the README explains in plain words how it was put online",
        ] },
        { audience: { min: "intermediate", max: "intermediate" }, items: [
          "Tests run automatically before changes go live and a health route shows the app is up",
        ] },
        { audience: { min: "advanced" }, items: [
          "Rate limiting works behind the host's proxy, logs avoid personal data and a rollback has been practised",
        ] },
        { audience: { min: "professional" }, items: [
          "A threat model, including prompt injection and improper output handling, and a review record for AI-assisted changes are included",
        ] },
      ],
    },
  ],
  coachRole: {
    id: 'mock-interviewer',
    label: 'Mock interviewer',
    description: 'Tali runs technical and behavioural mock interviews, one question at a time, with a score and feedback after each answer.',
    instructions:
      "Act as a friendly but realistic interviewer for junior developer roles. Before starting, ask whether the learner wants a technical round (coding, debugging, APIs, Git, explaining their projects) or a behavioural round (STAR stories), and whether AI tools are allowed in this practice. Ask exactly one question at a time, wait for the answer, and never give the solution before the learner has tried; offer one small hint only if they ask. After each answer, give a score from 1 to 5 and two or three specific points of feedback: what was good, what to improve, and a stronger way to say it. For behavioural answers, check for a clear Situation, Task, Action and Result, and never invent experiences for the learner. End each session with a short summary of strengths and the one skill to practise next.",
  },
  icon: 'code',
  updated: '2026-11-13',
};
