import type { Course, SourceLink } from './types';

/**
 * Level pieces added 2026-11-14: every product or tool statement in a block tagged for newcomers or experienced learners sits in a
 * `version` note checked on that date against the official pages below. help.openai.com refused automated readers that day, so
 * its key-safety statements were read through search excerpts of that official page.
 */
const CHECKED = '2026-11-14';

const SRC = {
  pyVenv: { label: 'Python docs: venv, creation of virtual environments', url: 'https://docs.python.org/3/library/venv.html' },
  pyArgparse: { label: 'Python docs: argparse', url: 'https://docs.python.org/3/library/argparse.html' },
  pyIo: { label: 'Python docs: io (IOBase.isatty)', url: 'https://docs.python.org/3/library/io.html' },
  pyMock: { label: 'Python docs: unittest.mock', url: 'https://docs.python.org/3/library/unittest.mock.html' },
  openaiPython: { label: 'OpenAI Python SDK README: retries and timeouts', url: 'https://github.com/openai/openai-python' },
  openaiText: { label: 'OpenAI API docs: Text generation', url: 'https://developers.openai.com/api/docs/guides/text' },
  openaiRate: { label: 'OpenAI API docs: Rate limits', url: 'https://developers.openai.com/api/docs/guides/rate-limits' },
  openaiStructured: { label: 'OpenAI API docs: Structured Outputs', url: 'https://developers.openai.com/api/docs/guides/structured-outputs' },
  openaiKeys: { label: 'OpenAI Help: Best practices for API key safety', url: 'https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety' },
  anthropicErrors: { label: 'Claude API docs: Errors', url: 'https://platform.claude.com/docs/en/api/errors' },
  anthropicMessages: { label: 'Claude API docs: Messages', url: 'https://platform.claude.com/docs/en/api/messages' },
  anthropicStructured: { label: 'Claude API docs: Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
  claudePermissions: { label: 'Claude Code docs: Configure permissions', url: 'https://code.claude.com/docs/en/permissions' },
  owaspTop10: { label: 'OWASP Top 10 for LLM Applications 2025', url: 'https://genai.owasp.org/llm-top-10/' },
  owaspLlm01: { label: 'OWASP GenAI: LLM01 Prompt Injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
} satisfies Record<string, SourceLink>;

export const miniPythonAiCourse: Course = {
  id: 'mini-python-ai',
  kind: 'mini',
  level: 'beginner',
  title: 'Build Your First AI Script',
  tagline: 'Write a small script that calls an AI model, safely and reliably (Python is the tool).',
  description:
    'Five short lessons that take you from a clean Python setup to a small command-line tool that calls an AI model. You learn the request shape most AI APIs share, how to keep your key out of your code, how to read JSON replies and how to handle errors, costs and rate limits.',
  finishLine: [
    'A clean Python project with a virtual environment and a requirements file.',
    'A reusable function that calls an AI model with the key kept in an environment variable.',
    'Code that reads and validates JSON replies instead of trusting them.',
    'A small command-line helper with retries, timeouts and limits, in a public GitHub repo.',
  ],
  audiences: ['fresh-grad', 'experienced-dev', 'career-changer'],
  skills: [
    { id: 'python-environment', label: 'Python setup' },
    { id: 'api-calls', label: 'Calling AI APIs' },
    { id: 'json-data', label: 'Working with JSON' },
    { id: 'cli-scripting', label: 'Command-line tools' },
    { id: 'reliability', label: 'Errors, costs and limits' },
  ],
  lessons: [
    {
      id: 'mini-python-ai-01',
      day: 1,
      title: 'Python setup and a virtual environment',
      summary: 'Install Python, create a project folder with its own virtual environment and record your packages.',
      intro: {
        objectives: [
          'Create a project folder with its own virtual environment and activate it',
          'Record your packages with pip freeze and rebuild them from requirements.txt',
          'Choose which files belong in .gitignore and which are committed',
        ],
        why: 'A clean setup is the first thing an employer or client sees when they open your repo, and they expect to run it in minutes. It also stops one project\'s packages from breaking another on your laptop.',
      },
      minutes: 15,
      skills: ['python-environment'],
      body: [
        {
          type: 'paragraph',
          text: 'Every good AI script starts with a clean setup. Today you make a project folder with its own **virtual environment**, so the packages for this project don\'t clash with anything else on your laptop.',
        },
        { type: 'heading', text: 'Check your Python' },
        {
          type: 'paragraph',
          text: 'This course uses Python 3.10 or newer. Open a terminal (Terminal on a Mac, PowerShell on Windows) and check your version. If the command is not found, install Python from python.org. On Windows, tick "Add python.exe to PATH" during setup, and use `py` where you see `python3` below.',
        },
        {
          type: 'code',
          language: 'bash',
          label: 'Check the version',
          code: 'python3 --version',
        },
        { type: 'heading', text: 'Why a virtual environment?' },
        {
          type: 'paragraph',
          text: 'A virtual environment is a private folder of packages for one project. Without it, every project shares the same packages, and upgrading one for project A can break project B. With it, you can delete and rebuild the environment any time from a list of packages.',
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "Start with the words. A **terminal** is a window where you type instructions to your computer instead of clicking. A **folder** is a place that holds files. A **package** is a ready-made piece of code written by someone else that your project borrows; `requests`, for example, lets Python talk to websites. Think of a virtual environment as a toolbox that belongs to one project: every project gets its own box, so the tools for one job never get mixed into another. **Python** is the language you write in, and **pip** is the helper that downloads packages into whichever toolbox is switched on. Type each command exactly as shown and press Enter after it.",
        },
        {
          type: 'code',
          language: 'bash',
          label: 'macOS or Linux',
          code: String.raw`mkdir ai-helper
cd ai-helper
python3 -m venv .venv
source .venv/bin/activate
python -m pip install requests python-dotenv
python -m pip freeze > requirements.txt`,
        },
        {
          type: 'code',
          language: 'powershell',
          label: 'Windows (PowerShell)',
          code: String.raw`mkdir ai-helper
cd ai-helper
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install requests python-dotenv
python -m pip freeze > requirements.txt`,
        },
        {
          type: 'paragraph',
          text: 'When the environment is active, your prompt usually shows `(.venv)`. Run `deactivate` to leave it. Next time, just run the activate line again from the project folder.',
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "Here is the macOS and Linux list, one line at a time. `mkdir ai-helper` makes a new folder called ai-helper. `cd ai-helper` moves the terminal into it, so the next commands happen there. `python3 -m venv .venv` asks Python to build the toolbox in a folder named `.venv` (on macOS and Linux a name that starts with a dot is hidden in normal file lists). `source .venv/bin/activate` switches the terminal to that toolbox, and `(.venv)` appears at the start of your prompt as a reminder. `python -m pip install requests python-dotenv` downloads two packages into it. The last line writes the list of everything installed into a file: the `>` symbol means send the output into this file instead of the screen. On Windows, `py` and the `Activate.ps1` line do the same jobs.",
        },
        {
          type: "activity",
          activity: {
            id: "mini-python-ai-01-tap-reveal-1",
            audience: { max: 'beginner' },
            kind: "tap-reveal",
            title: "Words you will meet in every repo",
            prompt: "Tap each card to read what to do or what the word means.",
            concept: "git and project files",
            cards: [
              {
                front: "What are Git and a repository?",
                back: "Git is a tool that records every version of your files, so you can go back to an older one. A repository, or repo, is a project folder that Git keeps track of. GitHub is a website where you can store a copy of a repo online.",
              },
              {
                front: "What does .gitignore do?",
                back: "It lists files Git must skip. `.venv/` is skipped because it is large and only works on your own computer, and `.env` is skipped because it will hold your secret key.",
              },
              {
                front: "You deleted the .venv folder by accident. Did you lose your project?",
                back: "No. Your scripts and `requirements.txt` are untouched. Create the environment again, activate it and run `python -m pip install -r requirements.txt` to get the same packages back.",
              },
            ],
            hints: [],
            explanation: "A repo only keeps what you choose to commit, and .gitignore is how you choose what to leave out. Anything you can rebuild from requirements.txt does not need to be saved.",
          },
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-01-python-1',
            kind: 'arrange',
            title: 'Set up the project',
            prompt: 'Put the macOS / Linux commands in the order you would run them to create the project, its environment and its package list.',
            concept: 'virtual environments',
            language: 'bash',
            solution: [
              'mkdir ai-helper',
              'cd ai-helper',
              'python3 -m venv .venv',
              'source .venv/bin/activate',
              'python -m pip install requests python-dotenv',
              'python -m pip freeze > requirements.txt',
            ],
            reasons: [
              'Start by making the project folder.',
              'Move into the folder before you create anything inside it.',
              'Create the virtual environment in the project folder.',
              'Switch your terminal to use that environment.',
              'Install packages only after the environment is active, so they go into it.',
              'Freeze last, so the file lists everything you just installed.',
            ],
            hints: [
              'The folder has to exist before you can go into it, and the environment has to exist before you can switch to it.',
              'Packages are installed into whichever environment is active at that moment.',
              'The package list is written last, after the packages are installed.',
            ],
            explanation: 'Make the folder, go into it, create the environment, activate it, install into it, then freeze the installed packages into `requirements.txt`.',
          },
        },
        {
          type: 'tip',
          text: 'If PowerShell refuses to run the activate script, search for "PowerShell execution policy" in Microsoft\'s docs, or use the Command Prompt version: `.venv\\Scripts\\activate.bat`.',
        },
        { type: 'heading', text: 'Keep the repo clean' },
        {
          type: 'paragraph',
          text: 'The `.venv` folder is big and specific to your machine, so it never goes into Git. Neither does `.env`, the file where your API key will live from tomorrow. Create a `.gitignore` file now:',
        },
        {
          type: 'code',
          language: 'text',
          label: '.gitignore',
          code: `.venv/
.env
__pycache__/`,
        },
        {
          type: 'paragraph',
          text: 'Anyone who clones your repo can rebuild the environment with `python -m pip install -r requirements.txt`. That one file is what makes your project easy to run on someone else\'s laptop.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-01-python-2',
            kind: 'match',
            title: 'What does each command do?',
            prompt: 'Match each command with what it does for your project.',
            concept: 'virtual environments',
            pairs: [
              {
                term: '`python3 -m venv .venv`',
                definition: 'Creates the project\'s private folder of packages',
                note: 'This only creates the environment. You still have to switch to it.',
              },
              {
                term: '`source .venv/bin/activate`',
                definition: 'Switches your terminal to use that environment',
                note: 'Activating is what makes `(.venv)` show in your prompt.',
              },
              {
                term: '`python -m pip freeze > requirements.txt`',
                definition: 'Saves the installed packages and their versions to a file',
                note: 'Freeze writes the list down. It does not install or delete anything.',
              },
              {
                term: '`python -m pip install -r requirements.txt`',
                definition: 'Rebuilds the same set of packages from that file',
                note: 'This is how someone who clones your repo gets your packages.',
              },
              {
                term: '`deactivate`',
                definition: 'Leaves the environment and goes back to normal',
                note: 'It leaves the environment. It does not delete it.',
              },
            ],
            hints: [
              'Two commands are about creating and entering the environment; two are about the package list.',
              '`freeze` writes the list, `install -r` reads it.',
              'The command with only one word is the one that leaves the environment.',
            ],
            explanation: '`venv` creates the environment, `activate` and `deactivate` enter and leave it, `freeze` records the packages and `install -r` rebuilds them from that record.',
          },
        },
        {
          type: 'prompt',
          label: 'Fix a setup error',
          text: 'I am setting up a Python virtual environment on [macOS / Windows / Linux]. I ran this command: [paste command] and got this error: [paste the error, with any usernames or paths you don\'t want to share removed]. Explain what the error means in plain English and give me the exact command to fix it.',
        },
        {
          type: 'warning',
          text: 'Avoid `sudo pip install` on macOS or Linux. Installing packages into the system Python can break tools your operating system relies on. Use a virtual environment instead.',
        },
        {
          type: "paragraph",
          audience: { min: 'advanced' },
          text: "A frozen list is not a lockfile. `pip freeze` records every installed package, including the ones your packages pulled in, so direct and indirect dependencies end up mixed together and you cannot tell which line you chose. Many teams keep their direct dependencies in `pyproject.toml`, generate a pinned lock file from it, and rebuild the environment from scratch in CI on every change; the venv docs call an environment disposable and not movable or copyable. Pin the Python version as well, because the same requirements can resolve to different versions on another interpreter. When an AI coding assistant adds a dependency, read that line of the diff. A model may suggest a package name that does not exist or is a look-alike, so check each new name on the package index before you install it. Tell your agent, in its instruction file, which environment and commands to use.",
        },
        {
          type: "version",
          audience: { min: 'advanced' },
          text: "The Python 3.15 venv documentation describes a virtual environment as a lightweight environment with its own independent set of Python packages in its site directories, usually kept in a project directory named .venv and not checked into source control. It says an environment should be simple to delete and recreate from scratch, and that environments are not considered movable or copyable: you recreate the same environment in the new location, for example with `pip install -r requirements.txt`. It also says you do not need to activate an environment to use it, because activation only puts its scripts directory first on PATH.",
          checked: CHECKED,
          sources: [
            SRC.pyVenv,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'A virtual environment is a private folder of packages for one project, so upgrading a package in one project can\'t break another.',
            '`.venv/` and `.env` go in `.gitignore`; `requirements.txt` and your scripts are committed.',
            '`python -m pip freeze > requirements.txt` records your packages; `python -m pip install -r requirements.txt` rebuilds them.',
            'Avoid `sudo pip install` on macOS or Linux: use a virtual environment instead.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-python-ai-01-q1',
          prompt: 'Why use a virtual environment for each project?',
          choices: [
            'It makes Python run faster',
            'It keeps each project\'s packages separate so they don\'t break each other',
            'It is required to use the requests package',
          ],
          answer: 1,
          explanation:
            'A virtual environment isolates packages per project, so an upgrade in one project can\'t break another.',
        },
        {
          id: 'mini-python-ai-01-q2',
          prompt: 'Which files should go in `.gitignore` for this project?',
          choices: [
            '`requirements.txt` and `README.md`',
            'Your Python scripts',
            '`.venv/` and `.env`',
          ],
          answer: 2,
          explanation:
            'The environment folder is machine-specific and `.env` holds secrets. The requirements file and scripts should be committed.',
        },
        {
          id: 'mini-python-ai-01-q3',
          prompt: 'What does `python -m pip freeze > requirements.txt` do?',
          choices: [
            'Saves the list of installed packages and versions to a file',
            'Locks the virtual environment so nothing can be installed',
            'Uploads your packages to GitHub',
            'Deletes unused packages',
          ],
          answer: 0,
          explanation:
            'It writes the exact packages in the environment to `requirements.txt`, so others can install the same set.',
        },
        {
          id: "mini-python-ai-01-q4",
          audience: { max: 'beginner' },
          prompt: "In this lesson, what is a package?",
          choices: [
            "The folder where all of your project's files live, including your scripts and the `.venv` folder",
            "The text file that `pip freeze` writes when you save your list of installed things",
            "A ready-made piece of code, written by someone else, that your project can borrow",
            "A command that opens the terminal window for you",
          ],
          answer: 2,
          explanation: "A package is shared code, such as `requests`, that you install into your environment and import in your script. The folder is your project, and the text file is `requirements.txt`.",
        },
        {
          id: "mini-python-ai-01-q5",
          audience: { min: 'advanced' },
          prompt: "An AI assistant adds `requests-oauth-helperz` to `requirements.txt`, a name nobody on the team recognises, and CI is green. What do you do before merging?",
          choices: [
            "Merge it: the build is green, which proves the package is safe, because CI installs it and the tests still pass",
            "Look the name up on the package index, check who publishes it and whether the code needs it, and remove it if you cannot justify it",
            "Run `pip freeze` again so every version is pinned exactly, then merge, because pinned versions cannot change underneath you",
            "Delete `.venv` and rebuild it from scratch so the package is installed cleanly, then merge if the install works",
          ],
          answer: 1,
          explanation: "A model can suggest a package name that does not exist or imitates a real one, and a green build only shows the install worked. Checking the publisher and whether the dependency is needed is the review step; pinning or rebuilding does not make an unknown package trustworthy.",
        },
      ],
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "In the terminal, run `pwd` to see which folder you are in and `ls` (on Windows, `dir`) to list what is in it, before and after you run `mkdir ai-helper`.",
            "Ask an AI assistant: \"Explain each line of these setup commands as if I have never used a terminal\", pasting your commands. Compare its answer with the line-by-line reading in this lesson and write down one word you still do not understand.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Replace the frozen file with a `pyproject.toml` that lists only `requests` and `python-dotenv`, and write down how you would generate and verify a pinned lock file from it in CI.",
            "Add three lines to your `AGENTS.md` or `CLAUDE.md`: the environment folder, the install command, and the rule \"never install outside `.venv` and never add a dependency without saying why\".",
          ],
        },
      ],
      task: {
        title: 'Set up your project',
        minutes: 15,
        steps: [
          'Create the `ai-helper` folder and virtual environment using the commands for your system.',
          'Install `requests` and `python-dotenv` and write `requirements.txt`.',
          'Create the `.gitignore` file shown above.',
          'Deactivate, activate again, and run `python -m pip list` to confirm both packages are there.',
        ],
      },
    },
    {
      id: 'mini-python-ai-02',
      day: 2,
      title: 'Calling an AI API',
      summary: 'Send a prompt to an AI model over HTTP, with the key in an environment variable.',
      intro: {
        objectives: [
          'Keep an API key in a .env file and read it from an environment variable',
          'Send a chat request with a system message, a user message, a timeout and an error check',
          'Explain why the reply path can differ between providers and how to find the right one',
        ],
        why: 'Calling a model from your own code is the core skill behind every AI feature you will be asked to build, and a leaked key can cost real money. Doing it safely from your first script is what separates a hobby script from a portfolio piece.',
      },
      minutes: 15,
      skills: ['api-calls', 'python-environment'],
      body: [
        {
          type: 'paragraph',
          text: 'An AI API is a web address you send a request to. You send your key, the model name and your messages; it sends back the model\'s reply. Providers differ in the details, but the shape is very similar across most of them.',
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "An **API** is a way for one program to ask another program for something over the internet, a bit like ordering at a counter: you say what you want in an agreed format and something comes back. A **request** is your order and the **reply** is what comes back. Your **API key** is a long secret code that tells the provider who is ordering, so it can bill the right account, which is why it must be kept like a password. An **environment variable** is a named value stored outside your code, so your script can read the key without the key being written in the file. `.env` is a plain text file where you keep those values while you work.",
        },
        { type: 'heading', text: 'Get a key, keep it secret' },
        {
          type: 'paragraph',
          text: 'Create an API key in your provider\'s developer console. The key is like a password linked to your account and possibly your billing. Put it in a `.env` file in your project folder, which `.gitignore` already keeps out of Git:',
        },
        {
          type: 'code',
          language: 'text',
          label: '.env (never commit this)',
          code: `AI_API_URL=https://the-url-from-your-provider-docs
AI_API_KEY=paste-your-key-here
AI_MODEL=your-model-name`,
        },
        {
          type: 'warning',
          text: 'Never put the key directly in your code, in a screenshot or in a chat. If it ever lands in a public repo, revoke it in the provider\'s console and create a new one.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-02-python-1',
            kind: 'fix-bug',
            title: 'The key is in the code',
            prompt: 'This script would leak the key if it ever reached a public repo. Find the line that is the problem, then pick the fix that keeps the key out of the code.',
            concept: 'keeping secrets out of code',
            language: 'python',
            code: 'import os\n\nimport requests\n\nAPI_KEY = "abc123-my-secret-key"\nAPI_URL = os.environ["AI_API_URL"]\n\nresponse = requests.post(\n    API_URL,\n    headers={"Authorization": f"Bearer {API_KEY}"},\n    json={"model": "your-model-name", "messages": []},\n    timeout=60,\n)',
            bugLine: 5,
            fixes: [
              {
                line: 'API_KEY = os.environ["AI_API_KEY"]',
                correct: true,
                why: 'Yes. The key now lives in an environment variable (loaded from `.env`), and a missing key stops the script with a clear `KeyError`.',
              },
              {
                line: 'API_KEY = os.environ.get("AI_API_KEY", "abc123-my-secret-key")',
                correct: false,
                why: 'The real key is still written in the code, as the fallback. It would leak just the same.',
              },
              {
                line: 'API_KEY = "abc123-my-secret-key"  # keep this secret',
                correct: false,
                why: 'A comment does not hide anything. The key is still in the file and in your Git history.',
              },
            ],
            lineNote: 'That line is fine. Look for the line that writes the secret directly into the code.',
            hints: [
              'Look for the line that contains the secret itself.',
              'The lesson says the key belongs in a `.env` file or an environment variable.',
              '`os.environ["..."]` reads an environment variable, and stops with a `KeyError` if it is missing.',
            ],
            explanation: 'Anything written in code can end up in Git, screenshots or chats. Reading the key from an environment variable keeps it out of the file.',
          },
        },
        { type: 'heading', text: 'The request' },
        {
          type: 'paragraph',
          text: 'Many providers offer a chat endpoint in the common "messages" shape used below, sometimes called OpenAI-compatible. Your provider\'s docs give the exact URL, header, model names and reply fields. Check them, because these details change.',
        },
        {
          type: 'code',
          language: 'python',
          label: 'ai_client.py',
          code: `import os

import requests
from dotenv import load_dotenv

load_dotenv()  # reads .env into environment variables

API_URL = os.environ["AI_API_URL"]
API_KEY = os.environ["AI_API_KEY"]
MODEL = os.environ.get("AI_MODEL", "your-model-name")


def ask(prompt: str, system: str = "You are a helpful assistant.") -> str:
    response = requests.post(
        API_URL,
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    # This path matches the common chat shape. Check your provider's docs.
    return data["choices"][0]["message"]["content"]


if __name__ == "__main__":
    print(ask("Explain a Python virtual environment in two sentences."))`,
        },
        {
          type: 'list',
          items: [
            '`load_dotenv()` copies the values from `.env` into environment variables.',
            '`os.environ["AI_API_KEY"]` stops with a clear `KeyError` if the key is missing, which is better than sending an empty key.',
            'The **system** message sets the assistant\'s role; the **user** message is your prompt.',
            '`timeout=60` stops the script from waiting forever if the server hangs.',
            '`raise_for_status()` turns an HTTP error, like a wrong key, into a Python exception.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "Read `ask` from the top. `def ask(prompt, system=...)` creates a reusable function: give it text and it gives text back. `requests.post(...)` sends the request, and **POST** means you are sending something to the server. `headers` carries your key as `Authorization: Bearer ...`. `json={...}` is the body of the request: the model name and a list of `messages`, each a small record with a `role` and some `content`. `response.raise_for_status()` raises an error if the server said no. `response.json()` turns the reply text into Python data, and the last line follows a path into it: `[\"choices\"][0]` means the first answer in the list (counting starts at 0), and `[\"message\"][\"content\"]` is its text.",
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-02-python-2',
            kind: 'fill-blank',
            title: 'Finish the request',
            prompt: 'Fill the four blanks so the request has a system message, a user message, a timeout and an error check.',
            concept: 'api requests',
            language: 'python',
            code: 'response = requests.post(\n    API_URL,\n    headers={"Authorization": f"Bearer {API_KEY}"},\n    json={\n        "model": MODEL,\n        "messages": [\n            {"role": "___", "content": system},\n            {"role": "___", "content": prompt},\n        ],\n    },\n    ___=60,\n)\nresponse.___()',
            blanks: [
              {
                answers: ['system'],
                feedback: 'This message carries the standing instructions: the assistant\'s role.',
              },
              {
                answers: ['user'],
                feedback: 'This message carries your actual request, the prompt.',
              },
              {
                answers: ['timeout'],
                feedback: 'This stops the script from waiting forever if the server hangs.',
              },
              {
                answers: ['raise_for_status'],
                feedback: 'This turns an HTTP error, such as a wrong key, into a Python exception.',
              },
            ],
            bank: ['system', 'user', 'timeout', 'raise_for_status', 'assistant', 'retries'],
            hints: [
              'The two roles are the two kinds of message: the standing rules and your request.',
              '`timeout=60` goes inside the call, `raise_for_status()` is called on the response.',
              'The blanks are `system`, `user`, `timeout` and `raise_for_status`.',
            ],
            explanation: 'The system message sets the role, the user message carries the prompt, `timeout=60` stops a stuck connection from waiting forever and `raise_for_status()` turns HTTP errors into exceptions.',
          },
        },
        {
          type: 'paragraph',
          text: 'Run it with `python ai_client.py`. If the reply path is different for your provider, print `data` once and find where the text is.',
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'sequence',
            title: 'One call to an AI API',
            summary: 'Your script reads the URL, key and model name from the environment, sends them with your messages to the AI API, and gets back a JSON reply that holds the model\'s text.',
            participants: [
              {
                id: 'env',
                label: '.env file',
                note: 'Holds the URL, key and model name. It is listed in .gitignore, so it never goes into Git.',
              },
              { id: 'script', label: 'Your script', note: 'ai_client.py, running on your laptop.' },
              { id: 'api', label: 'AI API', note: 'The web address your provider gives you.' },
            ],
            messages: [
              {
                from: 'env',
                to: 'script',
                label: 'load_dotenv() loads the settings',
                note: 'The values become environment variables the script can read.',
              },
              {
                from: 'script',
                to: 'api',
                label: 'POST: key, model, messages',
                note: 'The key goes in the Authorization header. The messages are the system message and your prompt.',
              },
              {
                from: 'api',
                to: 'script',
                label: 'JSON reply',
                dashed: true,
                note: 'The text is at data["choices"][0]["message"]["content"] in the common chat shape. Check your provider\'s docs.',
              },
            ],
          },
          caption: 'The shape of the request and the reply. Details such as the reply path differ between providers.',
        },
        {
          type: 'tip',
          text: 'Most providers also publish an official Python SDK. It does the same HTTP call for you. Learning the raw request first makes any SDK easy to read.',
        },
        {
          type: 'prompt',
          label: 'Map your provider\'s docs',
          text: 'I am calling an AI chat API from Python with the requests library. Here is the example request from my provider\'s documentation: [paste the example, with no real key]. Tell me the URL, the auth header and where the reply text is in the response JSON, and show how to adapt this function: [paste your ask function].',
        },
        {
          type: "paragraph",
          audience: { min: 'advanced' },
          text: "Raw HTTP is useful for learning, but production code normally uses the provider's official SDK, which already implements typed errors, timeouts and retries. Both major Python SDKs retry some failures twice by default, and OpenAI's waits up to ten minutes by default, far too long for an interactive feature, so set your own timeouts. Keys belong on a server you control, never in a browser or mobile app: use a separate key for each environment, scope it to a project, set a spending limit and rotate it after any leak. Keep provider differences out of your code. The reply path in this lesson is one provider's shape; another takes the system prompt in a top-level field and returns a list of content blocks. Put each provider behind one small function of your own and test it with a recorded reply.",
        },
        {
          type: "version",
          audience: { min: 'advanced' },
          text: "OpenAI's Python SDK README says certain errors are retried 2 times by default with a short exponential backoff and that requests time out after 10 minutes by default; Anthropic's errors page says its official SDK retries transient failures twice by default and honours the retry-after header. Anthropic's Messages API takes the system prompt in a top-level `system` parameter and requires `model`, `max_tokens` and `messages`; OpenAI recommends its Responses API over Chat Completions for new work, passes guidance as `instructions`, and warns against assuming where the text sits in the output array. OpenAI's key-safety help article says never to deploy a key in client-side environments, to route requests through your own backend, and to rotate a leaked key at once. Claude Code can block its file tools from reading `.env` with a `Read(./.env)` deny rule, but the documentation says such rules do not cover a script the agent runs that opens the file itself; use its sandbox for that.",
          checked: CHECKED,
          sources: [
            SRC.openaiPython,
            SRC.anthropicErrors,
            SRC.anthropicMessages,
            SRC.openaiText,
            SRC.openaiKeys,
            SRC.claudePermissions,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'An AI API is a web address: you send your key, a model name and messages, and it sends back the model\'s reply.',
            'The key belongs in a `.env` file or an environment variable, never in code, a screenshot or a chat.',
            'The system message sets the assistant\'s role; the user message carries each request.',
            '`timeout=60` and `raise_for_status()` stop the script waiting forever and turn HTTP errors into exceptions.',
            'Reply formats differ between providers: check the docs, or print `data` once to find the text.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-python-ai-02-q1',
          prompt: 'Where should your API key live?',
          choices: [
            'In a `.env` file or environment variable that is never committed',
            'At the top of `ai_client.py` so it is easy to find',
            'In the README so teammates can use it',
          ],
          answer: 0,
          explanation:
            'Keys belong in environment variables or an ignored `.env` file. Anything in code or docs can end up public.',
        },
        {
          id: 'mini-python-ai-02-q2',
          prompt: 'What does the system message do?',
          choices: [
            'It carries your API key',
            'It chooses the model',
            'It limits the reply length',
            'It sets the assistant\'s role and general instructions',
          ],
          answer: 3,
          explanation:
            'The system message gives standing instructions, while user messages carry each request.',
        },
        {
          id: 'mini-python-ai-02-q3',
          prompt: 'Why pass `timeout=60` to `requests.post`?',
          choices: [
            'To make the model answer within 60 words',
            'So the script stops waiting if the server never answers',
            'Because the API requires it',
          ],
          answer: 1,
          explanation:
            'Without a timeout, requests can wait indefinitely on a stuck connection.',
        },
        {
          id: 'mini-python-ai-02-q4',
          prompt: 'Your script crashes with a `KeyError` on `data["choices"]`. What is the most likely cause?',
          choices: [
            'Python is not installed',
            'The `.gitignore` file is wrong',
            'Your provider\'s reply uses a different shape, so you need to check its docs',
            'The key is too long',
          ],
          answer: 2,
          explanation:
            'Reply formats differ between providers. Print the response once and match the path to the docs.',
        },
        {
          id: "mini-python-ai-02-q5",
          audience: { max: 'beginner' },
          prompt: "What does an API key do?",
          choices: [
            "It translates your Python code into the language the model understands, so the request can be read",
            "It makes the reply arrive faster, because requests that carry a key are put first in the queue",
            "It names the model you want, such as the small cheap one or the large slow one",
            "It tells the provider which account is asking, so the request can be allowed and billed",
          ],
          answer: 3,
          explanation: "The key identifies your account. That is why it has to be kept like a password: whoever holds it can make requests that are billed to you. The model name is a separate setting.",
        },
        {
          id: "mini-python-ai-02-q6",
          audience: { min: 'advanced' },
          prompt: "A prototype calls an AI API straight from browser JavaScript, with the key in the page, \"so there is no server to run\". What is the right change?",
          choices: [
            "Send the requests through a small backend you control that holds the key, checks who is asking and limits usage",
            "Minify and obfuscate the script so the key is hard to read, and rotate it every month to stay ahead of anyone who finds it",
            "Keep the key in the page but restrict it to one browser, and ask visitors not to share the page with anyone else",
            "Move the key into a `.env` file next to the HTML page so the browser never loads it as part of the site",
          ],
          answer: 0,
          explanation: "Anything shipped to a browser can be read by its user, so the key has to stay on a server you control, which can also enforce per-user limits. Minifying, renaming or a file next to the page hides nothing.",
        },
      ],
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Ask an AI assistant: \"Explain each line of ai_client.py to someone who has never coded\", pasting the file with no real key. Check its explanation against the line-by-line reading above.",
            "Change one letter of the key in `.env` on purpose, run the script and read the error. Which line of the lesson explains what happened?",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Replace the raw `requests` call with your provider's official SDK, set an explicit timeout and `max_retries`, and compare its behaviour with a wrong key and with the network switched off.",
            "Write five lines on where the key will live in production, who can read it, how it is rotated and what spending limit protects you if it leaks.",
          ],
        },
      ],
      task: {
        title: 'Your first API call',
        minutes: 20,
        steps: [
          'Create an API key with a provider of your choice and read its quickstart page.',
          'Create `.env` with the URL, key and model name from the docs, and confirm `.env` is in `.gitignore`.',
          'Save `ai_client.py`, adapt the URL or reply path if the docs say so, and run it.',
          'Change the system message to "Answer like a strict code reviewer" and compare the replies.',
        ],
      },
    },
    {
      id: 'mini-python-ai-03',
      day: 3,
      title: 'Working with JSON responses',
      summary: 'Read API responses, ask the model for JSON and parse it safely.',
      intro: {
        objectives: [
          'Parse JSON text into Python data with json.loads and read keys safely with get',
          'Clean a reply wrapped in a code fence and catch a parse failure',
          'Validate the keys and types of a reply before using it, and never pass it to eval()',
        ],
        why: 'Models rarely reply in exactly the format you asked for, so code that reads their answers has to expect surprises. Handling that well is what makes an AI script reliable enough to show a hiring manager.',
      },
      minutes: 15,
      skills: ['json-data', 'api-calls'],
      body: [
        {
          type: 'paragraph',
          text: 'APIs talk in **JSON**: text that looks like Python dictionaries and lists. Yesterday `response.json()` turned the reply into a dictionary. Today you learn to work with JSON comfortably, and to get structured data out of the model itself.',
        },
        { type: 'heading', text: 'JSON in Python' },
        {
          type: 'code',
          language: 'python',
          label: 'json_basics.py',
          code: `import json

reply = '{"title": "Fix login bug", "priority": "high", "tags": ["auth", "web"]}'

data = json.loads(reply)          # text -> dict
print(data["title"])              # Fix login bug
print(data.get("owner", "none"))  # none (missing key, safe default)
for tag in data["tags"]:
    print("-", tag)

print(json.dumps(data, indent=2))  # dict -> pretty text`,
        },
        {
          type: 'list',
          items: [
            '`json.loads` turns text into Python objects; `json.dumps` does the reverse.',
            'Use `data["key"]` when the key must exist, and `data.get("key", default)` when it may be missing.',
            'JSON `true`, `false` and `null` become Python `True`, `False` and `None`.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "**JSON** is a way of writing data as plain text so two programs can swap it. It has two building blocks: an **object**, written with curly braces, which holds named values such as `\"title\": \"Fix login bug\"`, and an **array**, written with square brackets, which holds a list. Read `json_basics.py` one line at a time. `json.loads(reply)` (the `s` stands for string) turns that text into a Python **dictionary**, which stores values under names called keys. `data[\"title\"]` looks up one key. `data.get(\"owner\", \"none\")` looks up a key that might not exist and gives back `\"none\"` instead of an error. The `for` line visits each item of the `tags` list in turn and prints it with a dash in front. `json.dumps` goes the other way, and `indent=2` only makes the text easier to read.",
        },
        {
          type: 'table',
          headers: ['JSON', 'Python'],
          rows: [
            ['object', 'dict'],
            ['array', 'list'],
            ['true / false', 'True / False'],
            ['null', 'None'],
          ],
          caption: '`json.loads` turns JSON text into these Python values.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-03-python-1',
            kind: 'predict-output',
            title: 'Read the JSON',
            prompt: 'What does this program print?',
            concept: 'parsing json',
            language: 'python',
            code: 'import json\n\ndata = json.loads(\'{"title": "Fix login bug", "priority": "high", "tags": ["auth", "web"]}\')\nprint(data["title"])\nprint(data.get("owner", "none"))\nprint(len(data["tags"]))',
            expected: 'Fix login bug\nnone\n2',
            choices: [
              'Fix login bug\nnone\n2',
              'Fix login bug\nNone\n2',
              'Fix login bug\nKeyError\n2',
              'Fix login bug\nnone\n1',
            ],
            wrongNotes: {
              'Fix login bug\nNone\n2': '`data.get("owner", "none")` returns the default you gave it, the string "none", not Python\'s `None`.',
              'Fix login bug\nKeyError\n2': 'That would be `data["owner"]`. `.get` returns the default for a missing key instead of raising `KeyError`.',
            },
            hints: [
              'Go line by line. `json.loads` gives you a dict.',
              '`"owner"` is not a key in the JSON. What does `.get` give back when the key is missing?',
              'The `tags` list has two items.',
            ],
            explanation: '`data["title"]` is found, `data.get("owner", "none")` returns the default because there is no owner, and `data["tags"]` is a list of two items.',
          },
        },
        { type: 'heading', text: 'Asking the model for JSON' },
        {
          type: 'paragraph',
          text: 'When your code needs to use the answer, ask for JSON and describe the exact keys. Some providers have a JSON or structured output setting that enforces this; check the docs. Without it, the model usually follows instructions, but sometimes wraps the JSON in a Markdown code fence or adds a sentence. Your code must cope.',
        },
        {
          type: 'prompt',
          label: 'A JSON-only prompt',
          text: 'Read this job post and reply with JSON only, no other text, using exactly these keys: "role" (string), "skills" (list of strings), "remote" (true or false), "seniority" ("junior", "mid" or "senior"). If something is not stated, use null. Job post: [paste a job post]',
        },
        {
          type: 'code',
          language: 'python',
          label: 'parse_reply.py',
          code: `import json


def parse_json_reply(text: str) -> dict | None:
    cleaned = text.strip()
    if cleaned.startswith("\`\`\`"):
        cleaned = cleaned.strip("\`")
        if cleaned.startswith("json"):
            cleaned = cleaned[len("json"):]
    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        return None
    return result if isinstance(result, dict) else None


print(parse_json_reply('{"role": "QA Tester", "remote": true}'))
print(parse_json_reply("Sure! Here is the JSON you asked for."))`,
        },
        {
          type: 'paragraph',
          text: 'The first print shows a dictionary; the second shows `None`, so your program can retry or report a problem instead of crashing.',
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "Read `parse_json_reply` from the top. `text.strip()` removes spaces and blank lines at both ends. A model sometimes wraps its JSON in a **code fence**, three backticks on a line of their own, so the next lines cut the fence and a leading `json` label off. `try:` means \"attempt this\", and `except json.JSONDecodeError:` says what to do if the text turns out not to be valid JSON: give back `None` instead of crashing. The last line returns the result only when it is a dictionary, because a reply such as `[1, 2]` parses fine but is not the shape we asked for. Returning `None` is a signal to the rest of your program that the reply could not be used.",
        },
        {
          type: "activity",
          activity: {
            id: "mini-python-ai-03-tap-reveal-1",
            audience: { max: 'beginner' },
            kind: "tap-reveal",
            title: "Parsed is not the same as correct",
            prompt: "A model replied with each of these. Tap a card to see whether your code can use it as it is.",
            concept: "parsing versus validating",
            cards: [
              {
                front: "{\"role\": \"QA Tester\", \"skills\": [\"python\"], \"remote\": true}",
                back: "Valid JSON, and the keys and types match what was asked. It can be used. Whether the skills are actually in the job post is a separate question that only a person or a test case can answer.",
              },
              {
                front: "Sure! Here is the JSON: {\"role\": \"QA Tester\"}",
                back: "Not valid JSON, because of the sentence in front. `json.loads` raises an error, so the code must catch it and retry or report a problem.",
              },
              {
                front: "{\"role\": \"QA Tester\", \"skills\": \"python\", \"remote\": \"yes\"}",
                back: "Valid JSON but the wrong content: `skills` should be a list and `remote` should be true or false. Parsing succeeds, so only a check of the types can catch it.",
              },
            ],
            hints: [],
            explanation: "Parsing proves the text is JSON. Validation proves the content has the keys and types your code depends on. You need both before you use a model's reply.",
          },
        },
        { type: 'heading', text: 'Then validate' },
        {
          type: 'paragraph',
          text: 'Valid JSON can still be wrong. Check that the keys you need exist and have the right types before you use them. For example, confirm `skills` is a list and `seniority` is one of the three allowed words.',
        },
        {
          type: "paragraph",
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "At your level, hand-written checks start to repeat. Keep one validator per reply shape that returns a list of problems, and write its tests from real replies you have collected, including bad ones. The checker below makes the lesson's idea explicit for the job-post reply, and the three tests run with `python -m pytest` (install it with `python -m pip install pytest`). When the model sends a reply that breaks your code, save it: each one becomes a new test, so the same mistake cannot come back unnoticed. Schema libraries can replace this later, but write it by hand once so you know what they do.",
        },
        {
          type: "code",
          audience: { min: 'intermediate', max: 'intermediate' },
          language: "python",
          label: "job_check.py: a validator and its tests",
          code: "def validate_job(data: object) -> list[str]:\n    if not isinstance(data, dict):\n        return [\"reply is not a JSON object\"]\n    errors = []\n    role = data.get(\"role\")\n    if not isinstance(role, str) or not role.strip():\n        errors.append(\"role must be a non-empty string\")\n    skills = data.get(\"skills\")\n    if not isinstance(skills, list) or not all(isinstance(item, str) for item in skills):\n        errors.append(\"skills must be a list of strings\")\n    if not isinstance(data.get(\"remote\"), bool):\n        errors.append(\"remote must be true or false\")\n    if data.get(\"seniority\") not in {\"junior\", \"mid\", \"senior\", None}:\n        errors.append(\"seniority must be junior, mid, senior or null\")\n    return errors\n\n\ndef test_good_reply_has_no_errors():\n    good = {\"role\": \"QA Tester\", \"skills\": [\"python\"], \"remote\": True, \"seniority\": \"mid\"}\n    assert validate_job(good) == []\n\n\ndef test_valid_json_with_wrong_content_is_caught():\n    bad = {\"role\": \"QA Tester\", \"skills\": \"python\", \"remote\": \"yes\", \"seniority\": \"intern\"}\n    assert len(validate_job(bad)) == 3\n\n\ndef test_not_an_object():\n    assert validate_job([\"a\"]) == [\"reply is not a JSON object\"]",
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-03-python-2',
            kind: 'scenario',
            title: 'Valid JSON, wrong content',
            prompt: 'What should your code do with this reply?',
            concept: 'validating model output',
            situation: 'You asked for "role", "skills" (a list), "remote" (true or false) and "seniority" ("junior", "mid" or "senior"). The reply parses without errors, but it is {"role": "QA Tester", "skills": "python", "remote": "yes", "seniority": "intern"}.',
            options: [
              {
                text: 'Check the keys and types, see that skills, remote and seniority are wrong, and treat the reply as failed: retry or report it.',
                consequence: 'Your program notices the problem before using the data, and you decide what happens next (a retry, a fallback, a warning).',
                quality: 'best',
              },
              {
                text: 'Print a warning, then use only the fields that look right.',
                consequence: 'The program keeps going and you hear about the problem, but you are now working with a half-trusted reply and have to decide field by field what is safe.',
                quality: 'acceptable',
              },
              {
                text: 'Use it as it is: it parsed, so it is fine.',
                consequence: 'Parsing only proves the format. A loop over `skills` would walk through the letters of "python", and `seniority` would hold a value nothing else expects.',
                quality: 'poor',
              },
              {
                text: 'Pass it to `eval()` to turn the strings into proper values.',
                consequence: 'Model output must never reach `eval()`. If the text contained code, it would run on your machine.',
                quality: 'poor',
              },
            ],
            hints: [
              'Compare each value with what you asked for. Which ones do not match?',
              'Parsing proves the format. It does not prove the content.',
              'Look for the option that checks the content before using it and does not run anything.',
            ],
            explanation: 'Valid JSON can still be wrong. Check the keys and value types you depend on, treat a mismatch as a failed reply, and never hand model output to `eval()`.',
          },
        },
        {
          type: 'warning',
          text: 'Never pass model output straight into `eval()`, a shell command or a database query. Treat it like input from a stranger: parse it, check it, then use it.',
        },
        {
          type: "paragraph",
          audience: { min: 'advanced' },
          text: "Prompting for JSON is a request; schema enforcement is a guarantee. Most providers now offer a structured-output mode that constrains the answer to your JSON Schema, which removes most parse errors and the need to strip code fences. It does not remove the need for checks. The guarantee covers completed answers that are not refusals, so a reply cut off by the output-token limit, or a refusal, can still fail to match. The supported schema features are also limited, and a schema cannot say that a value is true: a well-formed category can still be the wrong category. Keep your own validation for business rules, allow enough output tokens that long answers are not truncated, and log every reply that failed a check together with the prompt version. Treat model output that reaches a database, a shell or a template as untrusted input.",
        },
        {
          type: "version",
          audience: { min: 'advanced' },
          text: "OpenAI's Structured Outputs guide says the feature constrains completed, non-refusal model output to your supplied JSON Schema, that only Structured Outputs (not JSON mode) ensure schema adherence, and that a response can contain a refusal or be incomplete, for example when the maximum-token limit is reached, so you check for those before reading the output. Anthropic's structured outputs page lists the feature as stable, says it constrains responses to a schema, notes that the guarantee covers the schema and not your application logic, and lists schema features it does not support, such as recursive schemas and numerical constraints. OWASP's Top 10 for LLM Applications 2025 lists Improper Output Handling as LLM05.",
          checked: CHECKED,
          sources: [
            SRC.openaiStructured,
            SRC.anthropicStructured,
            SRC.owaspTop10,
          ],
        },
        {
          type: 'takeaways',
          items: [
            '`json.loads` turns JSON text into Python objects and `json.dumps` turns them back into text.',
            'Use `data["key"]` when the key must exist and `data.get("key", default)` when it may be missing.',
            'Ask for JSON with exact keys, but expect code fences or extra sentences: clean the reply and catch `JSONDecodeError`.',
            'Valid JSON can still be wrong: check the keys and types before you use it.',
            'Never pass model output to `eval()`, a shell command or a database query.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-python-ai-03-q1',
          prompt: 'What does `json.loads(text)` return for `\'{"a": 1}\'`?',
          choices: ['The string unchanged', 'A Python dict `{"a": 1}`', 'A list `["a", 1]`'],
          answer: 1,
          explanation:
            '`json.loads` parses JSON text into Python objects; a JSON object becomes a dict.',
        },
        {
          id: 'mini-python-ai-03-q2',
          prompt: 'The model sometimes returns JSON inside a Markdown code fence. What should your code do?',
          choices: [
            'Remove the fence, then parse, and handle a parse failure gracefully',
            'Crash so you notice',
            'Use `eval()` on the text',
            'Ignore the reply',
          ],
          answer: 0,
          explanation:
            'Cleaning common wrappers and catching `JSONDecodeError` makes your script robust to small format slips.',
        },
        {
          id: 'mini-python-ai-03-q3',
          prompt: 'When should you use `data.get("owner", "none")` instead of `data["owner"]`?',
          choices: [
            'Always, it is faster',
            'Never, it is deprecated',
            'When the key might be missing and a default is fine',
          ],
          answer: 2,
          explanation:
            '`.get` returns a default for a missing key instead of raising `KeyError`.',
        },
        {
          id: 'mini-python-ai-03-q4',
          prompt: 'The reply parses as valid JSON. Is it safe to use?',
          choices: [
            'Yes, valid JSON is always correct',
            'Yes, if the model said it was sure',
            'Only after converting it to a string again',
            'Not yet: check the keys and value types you depend on',
          ],
          answer: 3,
          explanation:
            'Parsing only proves the format. Validation checks the content matches what your code expects.',
        },
        {
          id: "mini-python-ai-03-q5",
          audience: { max: 'beginner' },
          prompt: "In the JSON text `{\"tags\": [\"auth\", \"web\"]}`, what does the part in square brackets hold?",
          choices: [
            "A dictionary with the single key \"tags\", because curly braces always come first",
            "A comment that the program skips over when it reads the text",
            "A list (an array) of two items",
            "The name of the AI model that wrote the reply",
          ],
          answer: 2,
          explanation: "Square brackets hold a list, called an array in JSON, and Python reads it as a list. The curly braces around everything make it an object, which Python reads as a dictionary.",
        },
        {
          id: "mini-python-ai-03-q6",
          audience: { min: 'advanced' },
          prompt: "You switch on the provider's strict JSON-schema mode. A day later one reply to a very long document arrives cut off in the middle and fails to parse. What is the accurate reading?",
          choices: [
            "Strict mode guarantees complete answers, so this is a provider bug: report it and wait for a fix",
            "The prompt was not firm enough, so repeat \"valid JSON only\" three times at the start and end of the prompt",
            "JSON mode and strict schema mode are the same feature, so switch to JSON mode and the cut-off replies will stop",
            "Schema enforcement covers completed, non-refusal output; a reply stopped by the token limit, or a refusal, can still fail to match, so keep checking for both",
          ],
          answer: 3,
          explanation: "The guarantee applies to completed answers that are not refusals. A truncated or refused response can break your parser, so check the stop reason and keep validating. Repeating the instruction does not change how the output is limited, and JSON mode is weaker, not the same.",
        },
      ],
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Type a small JSON object about yourself by hand (a name, a city and a list of two hobbies), then ask an AI assistant to check it and explain any mistake it finds in plain words.",
            "Run `parse_reply.py` and change the sample text so it is no longer valid JSON. Read what `None` means for the rest of the program.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Run your structured-output prompt on ten different job posts and log each reply that fails validation together with the prompt text. Count the failures and write one change you would make for each kind.",
            "Force a truncation by setting a very small output-token limit and confirm your code detects the stop reason and does not try to parse the partial reply.",
          ],
        },
      ],
      task: {
        title: 'Structured answers',
        minutes: 15,
        steps: [
          'Save `parse_reply.py` and run it to see both results.',
          'In a new script, call `ask()` from `ai_client.py` with the JSON-only prompt and a real job post.',
          'Parse the reply with `parse_json_reply` and print each skill on its own line.',
          'Add a check that `seniority` is "junior", "mid", "senior" or `None`, and print a warning otherwise.',
        ],
      },
    },
    {
      id: 'mini-python-ai-04',
      day: 4,
      title: 'A tiny command-line helper',
      summary: 'Turn your function into a CLI tool with arguments, piped input and a help message.',
      intro: {
        objectives: [
          'Build a command-line tool with argparse that takes text as an argument or from a pipe',
          'Explain what nargs="?", 2>&1 and text[:4000] each do in explain.py',
          'Order the steps of main() so input is read, checked and capped before the API call',
          'Spot why a log must be checked for secrets before it is sent to an API',
        ],
        why: 'A tool you run with arguments is something people can actually use, which makes it a stronger portfolio project than a script you edit every time. It also shows that you think about cost and private data before anything goes to an API.',
      },
      minutes: 15,
      skills: ['cli-scripting', 'api-calls'],
      body: [
        {
          type: 'paragraph',
          text: 'A script you have to edit every time is a toy. A command-line tool you run with arguments is something you actually use. Today you build `explain.py`: give it an error message and it explains it in plain English.',
        },
        { type: 'heading', text: 'argparse in a few lines' },
        {
          type: 'paragraph',
          text: 'Python\'s built-in `argparse` module reads arguments, creates `--help` for free and shows clear errors. No extra package needed.',
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "A **command-line tool** is a program you run by typing its name in the terminal. Anything you type after the name is an **argument**: in `python explain.py \"some error\"`, the program is `python`, `explain.py` is its first argument and `\"some error\"` is another, and the quotation marks keep the words together as one piece. **Standard input** is where a program normally reads typed text from, and a **pipe**, written `|`, lets one program's output become the next program's input, the way a conveyor belt hands a box from one worker to the next. The `argparse` module does the boring work of reading all of this and explaining it to the person using your tool.",
        },
        {
          type: 'code',
          language: 'python',
          label: 'explain.py',
          code: `import argparse
import sys

from ai_client import ask

SYSTEM = (
    "You explain programming error messages to junior developers. "
    "Say what the error means, the most likely cause and one fix to try. "
    "If you are not sure, say so."
)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Explain an error message in plain English."
    )
    parser.add_argument(
        "text", nargs="?", help="The error text. Leave it out to read from a pipe."
    )
    parser.add_argument(
        "--short", action="store_true", help="Answer in two sentences."
    )
    args = parser.parse_args()

    text = args.text if args.text else sys.stdin.read()
    if not text.strip():
        parser.error("Give me an error message to explain.")

    prompt = f"Explain this error:\\n{text[:4000]}"
    if args.short:
        prompt += "\\nAnswer in two sentences."

    print(ask(prompt, system=SYSTEM))


if __name__ == "__main__":
    main()`,
        },
        { type: 'heading', text: 'Try it' },
        {
          type: 'code',
          language: 'bash',
          label: 'Ways to run it',
          code: `python explain.py --help
python explain.py "TypeError: can only concatenate str (not \\"int\\") to str"
python explain.py --short "ModuleNotFoundError: No module named 'requests'"
python my_script.py 2>&1 | python explain.py`,
        },
        {
          type: 'list',
          items: [
            '`nargs="?"` makes the text optional, so the tool can also read from a pipe.',
            '`2>&1` sends the error output of another script into `explain.py`.',
            '`text[:4000]` keeps very long logs from making a huge, costly request.',
            '`parser.error` prints a friendly message and exits with an error code.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "A few more lines of `explain.py` are worth reading. `from ai_client import ask` borrows the function you wrote yesterday from the other file. `SYSTEM` is the standing instruction for the model, written once at the top. `f\"Explain this error:\\n{text[:4000]}\"` is an **f-string**: the braces are replaced by the value inside, and `\\n` is a line break. `text[:4000]` is a **slice**: it keeps the first 4000 characters, counting from the start, and drops the rest. The final `if __name__ == \"__main__\":` means run `main()` only when you start this file directly, not when another file imports it.",
        },
        { type: 'heading', text: 'Reading main() from top to bottom' },
        {
          type: 'list',
          ordered: true,
          items: [
            '`parser.parse_args()` reads what was typed after the command and fills `args`. It also deals with `--help` and bad options before anything else runs.',
            '`args.text if args.text else sys.stdin.read()` uses the typed text when there is some, and otherwise reads whatever was piped in. `sys.stdin` is the standard input, the place a pipe delivers text.',
            'The `if not text.strip():` check comes next, before any API call, so empty input never costs a request. The `parser.error` line is indented under it because it runs only when the check is true.',
            'Only then is the prompt built from the capped text, and the answer printed. You cannot use `text` before it has been read, and you should not call the model before you know there is something to send.',
          ],
        },
        {
          type: 'paragraph',
          text: 'A pipe (`|`) feeds one program\'s output into another program\'s input. A traceback is written to the error output, not the normal output, so `2>&1` first joins the error output into the normal one, and only then does the pipe carry it into `explain.py`. Without it the traceback stays on your screen and the tool receives nothing.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-04-python-1',
            kind: 'match',
            title: 'Which line made that happen?',
            prompt: 'Four things happen when people use `explain.py`. Match each one with the piece of the tool responsible for it.',
            concept: 'command-line tools',
            labels: { terms: 'What happens', meanings: 'The piece responsible' },
            pairs: [
              {
                term: 'You pipe a log into `python explain.py` without typing any text, and argparse does not complain about a missing argument.',
                definition: '`nargs="?"`',
                note: 'Without it, the text argument would be required.',
              },
              {
                term: '`python my_script.py | python explain.py` prints "Give me an error message to explain." while the traceback still shows on your screen. Adding this fixes it.',
                definition: '`2>&1`',
                note: 'Tracebacks go to the error output, which a plain pipe does not carry.',
              },
              {
                term: 'A 30,000-line server log is piped in, but the request sent to the model stays small.',
                definition: '`text[:4000]`',
                note: 'The slice keeps only the first 4000 characters.',
              },
              {
                term: 'Someone runs the tool with only spaces as the text, and it stops with a friendly message and an error exit code.',
                definition: '`parser.error`',
                note: 'It runs when the text is empty after stripping.',
              },
            ],
            hints: [
              'One piece is about reading input, one is about the shell, one about size, and one about bad input.',
              'A traceback that skips the pipe is a shell problem, so the fix is the piece that is not Python.',
              'A slice keeps only the start of the text; a friendly message plus an error code is what argparse gives you for bad input.',
            ],
            explanation: '`nargs="?"` makes the text optional so a pipe can supply it, `2>&1` joins the error output into the pipe so the traceback reaches the tool, `text[:4000]` caps the size and cost, and `parser.error` stops on empty input with a clear message.',
          },
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'flow',
            title: 'What explain.py does when you run it',
            summary: 'The tool takes the error text from the command line or, if none is given, from a pipe. An empty text stops with a friendly error. Otherwise the first 4000 characters go into a prompt, and the model\'s reply is printed.',
            direction: 'TD',
            nodes: [
              { id: 'run', label: 'Run explain.py', shape: 'rounded' },
              {
                id: 'given',
                label: 'Text given as an argument?',
                shape: 'diamond',
                note: 'nargs="?" makes the argument optional.',
              },
              { id: 'arg', label: 'Use the argument' },
              { id: 'pipe', label: 'Read from the pipe (stdin)' },
              { id: 'empty', label: 'Is the text empty?', shape: 'diamond' },
              {
                id: 'stop',
                label: 'parser.error: message and exit',
                note: 'A friendly message and an error exit code.',
              },
              {
                id: 'prompt',
                label: 'Keep the first 4000 characters, build the prompt',
                note: 'text[:4000] keeps a very long log from making a huge, costly request.',
              },
              { id: 'ask', label: 'Call ask() and print the reply', shape: 'rounded' },
            ],
            edges: [
              { from: 'run', to: 'given' },
              { from: 'given', to: 'arg', label: 'yes' },
              { from: 'given', to: 'pipe', label: 'no' },
              { from: 'arg', to: 'empty' },
              { from: 'pipe', to: 'empty' },
              { from: 'empty', to: 'stop', label: 'yes' },
              { from: 'empty', to: 'prompt', label: 'no' },
              { from: 'prompt', to: 'ask' },
            ],
          },
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-04-python-2',
            kind: 'arrange',
            title: 'Put the end of main() in order',
            prompt: 'These are the last lines of `main()` in `explain.py`. Put them in the order that reads the arguments, gets the text, rejects empty input, builds the prompt and prints the answer. Python code here is judged against the stored order, not run.',
            concept: 'command-line tools',
            language: 'python',
            solution: [
              'args = parser.parse_args()',
              'text = args.text if args.text else sys.stdin.read()',
              'if not text.strip():',
              '    parser.error("Give me an error message to explain.")',
              'prompt = f"Explain this error:\\n{text[:4000]}"',
              'print(ask(prompt, system=SYSTEM))',
            ],
            alternatives: [
              [
                'args = parser.parse_args()',
                'text = args.text if args.text else sys.stdin.read()',
                'prompt = f"Explain this error:\\n{text[:4000]}"',
                'if not text.strip():',
                '    parser.error("Give me an error message to explain.")',
                'print(ask(prompt, system=SYSTEM))',
              ],
            ],
            reasons: [
              'Read the arguments first; everything else depends on them.',
              'Get the text from the argument or, if there is none, from the pipe.',
              'Check that there is any text before spending an API call on it.',
              'This line only runs when the check above finds empty text. It is indented under the `if`.',
              'Build the prompt from the (cut) text.',
              'Send it and print the reply, last of all.',
            ],
            hints: [
              'You cannot use `text` before you have read it.',
              'The indented `parser.error` line belongs directly under the `if` line.',
              'The API call and the print come last.',
            ],
            explanation: 'Parse the arguments, get the text, stop early on empty input, build the prompt and only then call the model and print the reply. (Building the prompt before the empty check also works; it just wastes a line.)',
          },
        },
        {
          type: 'tip',
          text: 'If you run `python explain.py` with no text and no pipe, it waits for you to type. Type the error, then press Ctrl+D on macOS or Linux, or Ctrl+Z then Enter on Windows.',
        },
        {
          type: 'warning',
          text: 'Logs often contain secrets, file paths, emails or customer data. Read what you are about to send before you pipe a real log into any AI API.',
        },
        {
          type: 'prompt',
          label: 'Add a feature',
          text: 'Here is my Python CLI tool built with argparse: [paste explain.py]. Add a --lang option that accepts "en" or "fil" and asks the model to answer in English or Filipino. Keep the existing behaviour, use argparse choices for validation, and explain each change.',
        },
        {
          type: "paragraph",
          audience: { min: 'advanced' },
          text: "A command-line tool is an interface other programs depend on, so treat it like one. Put the answer on standard output and diagnostics on standard error, so a pipe carries only the answer. Return a non-zero exit code on failure: `parser.error` already exits with status 2 for bad arguments, and your own failures should not exit 0. Make `main` accept an argument list, so tests can call it without a shell. Do not hang: when no text is given and standard input is a terminal, say so and exit. Then look at the data. Everything piped in is untrusted and also leaves your machine, so redact secrets before sending and add a `--dry-run` that prints the exact prompt. A log can also hold instructions someone planted, which the model may follow; that is indirect prompt injection.",
        },
        {
          type: "code",
          audience: { min: 'advanced' },
          language: "python",
          label: "A testable main(): redaction, no hang, exit codes",
          code: "import argparse\nimport re\nimport sys\n\nSECRET = re.compile(r\"(sk-[A-Za-z0-9_-]{16,}|Bearer\\s+[A-Za-z0-9._-]{16,})\")\n\n\ndef redact(text: str) -> str:\n    return SECRET.sub(\"[REDACTED]\", text)\n\n\ndef read_input(args: argparse.Namespace) -> str:\n    if args.text:\n        return args.text\n    if sys.stdin.isatty():\n        return \"\"  # nothing typed and nothing piped: do not wait\n    return sys.stdin.read()\n\n\ndef main(argv: list[str] | None = None) -> int:\n    parser = argparse.ArgumentParser(description=\"Explain an error message.\")\n    parser.add_argument(\"text\", nargs=\"?\")\n    args = parser.parse_args(argv)\n    text = redact(read_input(args)).strip()\n    if not text:\n        print(\"Give me an error message, as an argument or through a pipe.\", file=sys.stderr)\n        return 1\n    print(f\"WOULD SEND: {text[:4000]}\")  # stand-in for ask(...)\n    return 0\n\n\nif __name__ == \"__main__\":\n    sys.exit(main())",
        },
        {
          type: "version",
          audience: { min: 'advanced' },
          text: "The Python argparse documentation says that when parse_args gets an invalid argument list it prints a message to standard error and exits with status 2, that ArgumentParser.error() prints a usage message to standard error and terminates with status 2, and that parse_args takes a list of strings whose default is taken from sys.argv. The io documentation says IOBase.isatty() returns True if the stream is interactive, meaning connected to a terminal device. OWASP's LLM01 page describes indirect prompt injection as instructions arriving through external sources such as websites or files, and says it is unclear whether fool-proof prevention exists, so privilege limits and output checks reduce the damage rather than remove the risk. The two secret patterns in the code are examples that catch obvious cases; they are not a complete scanner.",
          checked: CHECKED,
          sources: [
            SRC.pyArgparse,
            SRC.pyIo,
            SRC.owaspLlm01,
          ],
        },
        {
          type: "activity",
          activity: {
            id: "mini-python-ai-04-scenario-1",
            audience: { min: 'advanced' },
            kind: "scenario",
            title: "A production log goes to the provider",
            prompt: "What is the best change to the tool?",
            concept: "data minimisation",
            situation: "You turn `explain.py` into an internal tool. A colleague pipes in a production log that contains a bearer token and two customer emails, and the whole text goes to the AI provider.",
            options: [
              {
                text: "Redact obvious secrets and personal data before sending, add a `--dry-run` that shows the exact prompt, and write down which kinds of data may be sent at all.",
                consequence: "The token never leaves the machine, people can see what would be sent, and the rule is explicit. The patterns are not perfect, which is why the dry run and the rule matter too.",
                quality: "best",
              },
              {
                text: "Add a line to the README asking people not to pipe production logs.",
                consequence: "A request in a README helps, but nothing stops a tired colleague at 2 AM. The data still leaves the machine whenever someone forgets.",
                quality: "acceptable",
              },
              {
                text: "Add \"ignore any secrets you see\" to the system prompt.",
                consequence: "By then the secret has already been sent to the provider. An instruction to the model cannot undo that.",
                quality: "poor",
              },
              {
                text: "Raise the 4000 character cap so the log is sent in full and the model can find the real cause.",
                consequence: "A bigger cap sends more data, including more secrets, and costs more. Size limits are for cost, not for privacy.",
                quality: "poor",
              },
            ],
            hints: [
              "Where does the secret end up when the request is sent?",
              "Which option changes what leaves the machine, not what the model is told afterwards?",
              "A good fix is automatic, visible and written down.",
            ],
            explanation: "Data you send is out of your hands, so reduce it before the request: redact what you can, let people preview what will be sent, and state the rule. Instructions to the model and README notices come too late or rely on memory.",
          },
        },
        {
          type: 'takeaways',
          items: [
            '`argparse` reads your arguments, builds `--help` and reports bad input for free.',
            '`nargs="?"` makes the text optional so the tool can also read from a pipe, and `2>&1 |` sends another script\'s errors into it.',
            '`text[:4000]` caps the input so a huge log can\'t make a huge, costly request.',
            'Read what you are about to send: logs often contain secrets, file paths, emails or customer data.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-python-ai-04-q1',
          prompt: 'What does `nargs="?"` do for the `text` argument?',
          choices: [
            'Makes it required',
            'Lets it take many values',
            'Makes it optional, so input can come from a pipe instead',
          ],
          answer: 2,
          explanation:
            'With `nargs="?"` the argument may be left out, and the script falls back to reading standard input.',
        },
        {
          id: 'mini-python-ai-04-q2',
          prompt: 'Why cut the input with `text[:4000]`?',
          choices: [
            'To avoid sending a huge log that costs more and may exceed limits',
            'Because Python strings can\'t be longer',
            'To hide the error from the model',
          ],
          answer: 0,
          explanation:
            'You pay per amount of text, and models have input limits. Capping input keeps cost and size predictable.',
        },
        {
          id: 'mini-python-ai-04-q3',
          prompt: 'What do you get for free from argparse?',
          choices: [
            'Automatic retries',
            'A `--help` message and clear errors for bad arguments',
            'API key storage',
            'JSON parsing',
          ],
          answer: 1,
          explanation:
            'argparse builds help text from your argument definitions and reports invalid input for you.',
        },
        {
          id: 'mini-python-ai-04-q4',
          prompt: 'Before piping a production log into the tool, what should you check?',
          choices: [
            'That the log is in English',
            'That the log is short enough to read on one screen',
            'That your terminal is in dark mode',
            'That it contains no secrets or personal data you may not share',
          ],
          answer: 3,
          explanation:
            'Logs often include sensitive data. Only send what you are allowed to send to that API.',
        },
        {
          id: "mini-python-ai-04-q5",
          audience: { max: 'beginner' },
          prompt: "In the command `python explain.py \"some error\"`, what is `\"some error\"`?",
          choices: [
            "An argument: extra text typed after the command that the program can read",
            "A package that gets downloaded and installed into your virtual environment before the program runs",
            "A pipe, the symbol that sends one program's output into another program",
            "An environment variable that stores a secret outside the code",
          ],
          answer: 0,
          explanation: "Whatever you type after the command name is an argument. `argparse` reads it for you. A pipe is the `|` symbol, and an environment variable is a named value stored outside the program.",
        },
        {
          id: "mini-python-ai-04-q6",
          audience: { min: 'advanced' },
          prompt: "Someone runs the tool in a terminal with no argument and nothing piped in, and it sits there waiting. What is the cleanest fix?",
          choices: [
            "Add a 60 second timeout to the API call so the program gives up instead of waiting for the provider forever",
            "Catch KeyboardInterrupt and exit with status 0 so the run looks successful when someone presses Ctrl+C",
            "If no text was given and standard input is a terminal, print a usage message to standard error and exit non-zero",
            "Read standard input in a background thread so the main program can carry on with the rest of its work",
          ],
          answer: 2,
          explanation: "The program is not stuck calling the API; it is waiting for input that will never come. `sys.stdin.isatty()` tells you a person is at a terminal, so you can fail fast with a clear message. A timeout on the API call changes nothing, and exiting 0 or hiding the wait would mislead callers.",
        },
      ],
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Run `python explain.py --help` and read every line of what it prints. Match each option to the line of `explain.py` that created it.",
            "Ask an AI assistant: \"Explain f-strings, slices and `if __name__ == \"__main__\"` in plain words with one tiny example each\", then run its three examples yourself.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Replace `main()` with the testable version from the lesson, add a `--dry-run` flag that prints the exact prompt, and write three tests that call `main([...])` and check the exit code and the output.",
            "Add one more redaction pattern for something your own logs contain (an email address or an internal id), and test it with a fake log.",
          ],
        },
      ],
      task: {
        title: 'Build explain.py',
        minutes: 20,
        steps: [
          'Save `explain.py` next to `ai_client.py` and run `python explain.py --help`.',
          'Explain two real errors from your own past projects (remove any private details).',
          'Make a script that raises an error on purpose and pipe it in with `2>&1 |`.',
          'Use the "Add a feature" prompt, review the change line by line, and test both languages.',
        ],
      },
    },
    {
      id: 'mini-python-ai-05',
      day: 5,
      title: 'Errors, costs and rate limits',
      summary: 'Retry the right failures, respect rate limits and keep your spending under control.',
      intro: {
        objectives: [
          'Decide which errors to retry (429, 5xx, timeouts) and which to stop on (400, 401, 403)',
          'Explain exponential backoff and Retry-After, and read the attempt loop in post_with_retry',
          'Choose limits and habits that keep API costs predictable',
        ],
        why: 'Real APIs fail and bills grow, so reliability and cost control are what clients check first in a script that calls an AI model. A small tool that retries sensibly and never loops forever is a good sign to an employer.',
      },
      minutes: 15,
      skills: ['reliability', 'api-calls', 'cli-scripting'],
      body: [
        {
          type: 'paragraph',
          text: 'Real APIs fail. The network drops, the server is busy, or you send requests too fast. A good script expects this, retries only what is worth retrying and never runs up a surprise bill.',
        },
        { type: 'heading', text: 'Which errors to retry' },
        {
          type: 'list',
          items: [
            '**429 Too Many Requests:** you hit a rate limit. Wait, then retry. Some servers send a `Retry-After` header saying how long.',
            '**500, 502, 503, 504:** a temporary server problem. Retry after a short wait.',
            '**Timeouts and dropped connections:** retry a few times.',
            '**400, 401, 403:** your request, key or permissions are wrong. Retrying won\'t help; fix the cause.',
          ],
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "Every answer from a web server starts with a **status code**, a three-digit number that says how it went. Codes starting with 2, such as 200, mean success. Codes starting with 4 mean the problem is on your side: the request or the key was wrong, so sending it again changes nothing. Codes starting with 5 mean the problem is on the server's side and may pass by itself. 429 is a special 4xx code that means too many requests too quickly: you did nothing wrong except go fast, so waiting fixes it. That is why the list above retries some numbers and stops on others. A **timeout** is not a status code at all: it means no answer came back in time.",
        },
        {
          type: 'paragraph',
          text: 'Wait a little longer after each failure: 1 second, then 2, then 4. This is called **exponential backoff**, and it keeps your script from hammering a server that is already struggling.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-05-python-1',
            kind: 'match',
            title: 'Retry or stop?',
            prompt: 'Match each failure with what a good script does about it.',
            concept: 'retrying api errors',
            pairs: [
              {
                term: '`429`',
                definition: 'Wait (as long as `Retry-After` says, if it is sent), then retry',
                note: 'A 429 means you hit a rate limit, which passes if you slow down.',
              },
              {
                term: '`503`',
                definition: 'A temporary server problem: retry after a short wait',
                note: '500, 502, 503 and 504 are temporary server problems.',
              },
              {
                term: 'A timeout',
                definition: 'Dropped or silent connection: retry a few times',
                note: 'Timeouts and dropped connections are worth a few more tries.',
              },
              {
                term: '`401`',
                definition: 'The key or permissions are wrong: stop and fix them',
                note: 'Retrying sends the same bad key again.',
              },
              {
                term: '`400`',
                definition: 'The request itself is wrong: stop and fix the request',
                note: 'A bad request stays bad however many times you send it.',
              },
            ],
            hints: [
              'Ask yourself: will the same request work if I simply try again later?',
              '429, 5xx errors and timeouts are temporary. 400 and 401 are mistakes in what you sent.',
              'The two "stop" answers differ in what is wrong: the key (401) or the request (400).',
            ],
            explanation: 'Retry what is temporary (rate limits, server problems, timeouts) and stop on what your own request, key or permissions got wrong, because retrying cannot fix those.',
          },
        },
        {
          type: 'code',
          language: 'python',
          label: 'retry.py',
          code: `import time

import requests

RETRY_STATUSES = {429, 500, 502, 503, 504}


def post_with_retry(url: str, headers: dict, payload: dict, attempts: int = 4) -> dict:
    for attempt in range(attempts):
        last_try = attempt == attempts - 1
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
        except (requests.ConnectionError, requests.Timeout):
            if last_try:
                raise
            time.sleep(2 ** attempt)
            continue

        if response.status_code in RETRY_STATUSES and not last_try:
            wait = response.headers.get("Retry-After", "")
            time.sleep(int(wait) if wait.isdigit() else 2 ** attempt)
            continue

        response.raise_for_status()
        return response.json()

    raise RuntimeError("attempts must be at least 1")`,
        },
        {
          type: 'paragraph',
          text: 'To use it, replace the `requests.post(...)`, `raise_for_status()` and `response.json()` lines in `ask()` with one call to `post_with_retry(API_URL, headers, payload)`.',
        },
        {
          type: "paragraph",
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "A retry loop is exactly the code you should not test against a real server. Replace the network call with a fake that returns a scripted list of replies, and replace `time.sleep` so the test does not actually wait. The two tests below patch `post` and `sleep` as `retry.py` uses them, then check three things: how many calls were made, what was slept, and which error escaped. They cover the two paths that matter most, a temporary error followed by success and a permanent error that must not be retried. Write the third yourself: every attempt fails and the last error escapes.",
        },
        {
          type: "code",
          audience: { min: 'intermediate', max: 'intermediate' },
          language: "python",
          label: "test_retry.py: no network, no waiting",
          code: "from unittest.mock import MagicMock, patch\n\nimport pytest\nimport requests\n\nfrom retry import post_with_retry\n\n\ndef fake_response(status, body=None, headers=None):\n    response = MagicMock()\n    response.status_code = status\n    response.headers = headers or {}\n    response.json.return_value = body or {}\n    if status >= 400:\n        response.raise_for_status.side_effect = requests.HTTPError(f\"{status} error\")\n    return response\n\n\n@patch(\"retry.time.sleep\")\n@patch(\"retry.requests.post\")\ndef test_retries_a_429_then_succeeds(post, sleep):\n    post.side_effect = [fake_response(429, headers={\"Retry-After\": \"3\"}), fake_response(200, {\"ok\": True})]\n    assert post_with_retry(\"https://example.test\", {}, {}) == {\"ok\": True}\n    assert post.call_count == 2\n    sleep.assert_called_once_with(3)\n\n\n@patch(\"retry.time.sleep\")\n@patch(\"retry.requests.post\")\ndef test_does_not_retry_a_401(post, sleep):\n    post.side_effect = [fake_response(401)]\n    with pytest.raises(requests.HTTPError):\n        post_with_retry(\"https://example.test\", {}, {})\n    assert post.call_count == 1\n    sleep.assert_not_called()",
        },
        {
          type: "version",
          audience: { min: 'intermediate', max: 'intermediate' },
          text: "The Python unittest.mock documentation says patch() replaces its target with a new object, a MagicMock by default, for the duration of the test and then undoes the change, and that you patch an object where it is looked up. It says that when side_effect is an iterable, each call returns the next value or raises the next exception instance, and that a StopIteration is raised once the iterable is used up.",
          checked: CHECKED,
          sources: [
            SRC.pyMock,
          ],
        },
        {
          type: 'paragraph',
          text: 'Read the loop like this. `range(attempts)` counts from 0, so four attempts are numbered 0, 1, 2 and 3. `last_try` is true only on the final number, which is when the code stops retrying and lets the error through. `2 ** attempt` is the wait in seconds and doubles each time: 1, 2, 4, 8. When the server sends a numeric `Retry-After`, that value replaces the guess.',
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'flow',
            title: 'What post_with_retry does',
            summary: 'The function sends the request. A timeout or dropped connection, or a retryable status (429, 500, 502, 503, 504), is retried after a wait while attempts remain. Anything else goes through raise_for_status, which returns the JSON on success and raises on an error status.',
            direction: 'TD',
            nodes: [
              { id: 'send', label: 'Send the request', shape: 'rounded' },
              { id: 'conn', label: 'Timeout or dropped connection?', shape: 'diamond' },
              { id: 'status', label: 'Status 429, 500, 502, 503 or 504?', shape: 'diamond' },
              {
                id: 'left',
                label: 'Attempts left?',
                shape: 'diamond',
                note: 'attempts defaults to 4. Always set a maximum number of attempts.',
              },
              {
                id: 'wait',
                label: 'Wait: Retry-After, or 1, 2, 4 s',
                note: 'Exponential backoff: wait a little longer after each failure.',
              },
              { id: 'check', label: 'raise_for_status()' },
              { id: 'ok', label: 'Return response.json()', shape: 'rounded' },
              { id: 'fail', label: 'Raise the error', shape: 'rounded' },
            ],
            edges: [
              { from: 'send', to: 'conn' },
              { from: 'conn', to: 'left', label: 'yes' },
              { from: 'conn', to: 'status', label: 'no' },
              { from: 'status', to: 'left', label: 'yes' },
              { from: 'status', to: 'check', label: 'no' },
              { from: 'left', to: 'wait', label: 'yes' },
              { from: 'left', to: 'fail', label: 'no' },
              { from: 'wait', to: 'send' },
              { from: 'check', to: 'ok', label: 'success' },
              { from: 'check', to: 'fail', label: 'error status' },
            ],
          },
          caption: 'A 400, 401 or 403 is not retried: it goes straight to raise_for_status and raises.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-python-ai-05-python-2',
            kind: 'predict-output',
            title: 'Count the attempts',
            prompt: 'This is the loop skeleton from `post_with_retry`. What does it print?',
            concept: 'exponential backoff',
            language: 'python',
            code: 'attempts = 4\nfor attempt in range(attempts):\n    last_try = attempt == attempts - 1\n    print(attempt, last_try, 2 ** attempt)',
            expected: '0 False 1\n1 False 2\n2 False 4\n3 True 8',
            choices: [
              '0 False 1\n1 False 2\n2 False 4\n3 True 8',
              '0 False 1\n1 False 2\n2 False 4',
              '0 True 1\n1 False 2\n2 False 4\n3 False 8',
              '1 False 1\n2 False 2\n3 False 4\n4 True 8',
            ],
            wrongNotes: {
              '0 False 1\n1 False 2\n2 False 4': '`range(4)` gives four values: 0, 1, 2 and 3. The loop does not stop before the last one.',
              '0 True 1\n1 False 2\n2 False 4\n3 False 8': '`last_try` is true only when `attempt` equals `attempts - 1`, so only the final turn.',
              '1 False 1\n2 False 2\n3 False 4\n4 True 8': '`range(4)` starts at 0, not at 1.',
            },
            hints: [
              '`range(4)` gives 0, 1, 2, 3.',
              '`last_try` is true only when `attempt` is 3.',
              '`2 ** attempt` is 1, 2, 4, 8: the wait doubles each time.',
            ],
            explanation: 'The attempts are numbered 0 to 3, only the fourth is the last try, and `2 ** attempt` doubles every time: 1, 2, 4, 8 seconds. That doubling is exponential backoff.',
          },
        },
        { type: 'heading', text: 'Keeping costs down' },
        {
          type: 'paragraph',
          text: 'Most providers charge per **token**, a small chunk of text, for both what you send and what you get back. Prices vary by provider and model and change often, so check the pricing page before you build.',
        },
        {
          type: "paragraph",
          audience: { max: 'beginner' },
          text: "A **token** is a piece of text, sometimes a whole short word and sometimes just part of a longer one. The model reads and writes text in tokens, and the provider counts them: your prompt is the input tokens and the reply is the output tokens. More tokens means more cost and more waiting. **Credits** are the balance of money or usage you have bought, and each request spends some. This is why a script that loops over a thousand items can use up a balance quickly if something is wrong, and why the lesson keeps repeating the same three habits: limit what you send, limit what you ask back, and test on a few items before running on all of them.",
        },
        {
          type: 'list',
          items: [
            'Cap input size, as `explain.py` does with `text[:4000]`.',
            'Limit the reply length with the max-output setting your provider offers. The parameter name differs, so check the docs.',
            'Use a smaller, cheaper model for simple tasks, and test whether it is good enough.',
            'Don\'t call the API inside a loop over thousands of items until you have tested on ten.',
            'If your provider offers spending limits or usage alerts, turn them on.',
          ],
        },
        {
          type: 'warning',
          text: 'A bug that retries forever or loops over a big file can burn through credits fast. Always set a maximum number of attempts and test with small inputs first.',
        },
        {
          type: 'prompt',
          label: 'Review for reliability',
          text: 'Review this Python script that calls an AI API: [paste your code, with no real key]. List every way it could fail (network, rate limits, bad responses, missing env vars, huge input) and say whether each one is handled. Suggest the smallest change for each gap and don\'t rewrite the whole script.',
        },
        {
          type: "paragraph",
          audience: { min: 'advanced' },
          text: "Backoff without randomness makes every client retry at the same moments, so add jitter and honour `Retry-After`. Cap both attempts and total elapsed time: unsuccessful requests still count against rate limits, and even a 429 is not always temporary, since one provider documents a spend-cap 429 that has no `retry-after` header and keeps failing until access resumes. Retrying is only safe when repeating the request cannot do harm. A model call is harmless to repeat, but a tool call that sends an email is not, so give actions an idempotency key. Both major Python SDKs already retry transient errors twice by default, so wrapping them in your own loop can multiply the attempts. Put the money controls in code: a maximum output length, a budget per run and per user, usage logging, and a spending limit at the provider. For bulk work that can wait, use a batch API.",
        },
        {
          type: "version",
          audience: { min: 'advanced' },
          text: "OpenAI's rate-limits guide says unsuccessful requests contribute to your per-minute limit, that exponential backoff waits longer after each failure, that adding random jitter helps retries from all hitting at the same time, and that without a valid Retry-After header a client should fall back to exponential backoff with jitter and limit both attempts and total retry time. Anthropic's errors page says its official SDK retries transient failures twice by default honouring retry-after, that a tier spend-cap 429 has no retry-after header and keeps failing until access resumes, and that its Message Batches API lets you poll for results instead of needing an uninterrupted connection. OpenAI's Python SDK README says certain errors are retried 2 times by default. OWASP's Top 10 for LLM Applications 2025 lists Unbounded Consumption as LLM10.",
          checked: CHECKED,
          sources: [
            SRC.openaiRate,
            SRC.anthropicErrors,
            SRC.openaiPython,
            SRC.owaspTop10,
          ],
        },
        {
          type: "activity",
          activity: {
            id: "mini-python-ai-05-scenario-1",
            audience: { min: 'advanced' },
            kind: "scenario",
            title: "Eight workers and a 429",
            prompt: "What do you change?",
            concept: "retry design",
            situation: "Your tool classifies 5,000 support messages overnight with eight parallel workers. At 2 AM the provider starts answering 429, and all eight workers retry after exactly 2, 4 and 8 seconds, then give up and lose their progress.",
            options: [
              {
                text: "Add random jitter to the waits, honour Retry-After, cap the total retry time and the number of workers, and save progress so a rerun resumes where it stopped.",
                consequence: "The workers stop moving in lockstep, the server gets room to recover, and a failed night costs a rerun instead of a restart.",
                quality: "best",
              },
              {
                text: "Cut to one worker and sleep 60 seconds after every failure.",
                consequence: "It probably works and costs little effort, but it makes the whole job slow, and it still loses progress when it finally gives up.",
                quality: "acceptable",
              },
              {
                text: "Raise the attempts from 4 to 50 so the job eventually finishes.",
                consequence: "Fifty attempts from eight workers is a retry storm. Failed requests count against the limit, so it can keep you rate limited for longer.",
                quality: "poor",
              },
              {
                text: "Remove the timeout so the workers wait as long as the server needs.",
                consequence: "A missing timeout lets a stuck connection block a worker forever. It does nothing about the rate limit.",
                quality: "poor",
              },
            ],
            hints: [
              "Eight workers all waiting the same time means all eight come back together. What breaks that pattern?",
              "Think about what is lost when the job stops, not only how to avoid stopping.",
              "Failed requests still count against the limit, so more attempts is rarely the answer.",
            ],
            explanation: "Jitter breaks the lockstep, Retry-After and a cap on total retry time respect the server, and saved progress makes failure cheap. More attempts or no timeout makes a rate-limit problem worse.",
          },
        },
        {
          type: 'takeaways',
          items: [
            'Retry temporary failures only: 429, 500, 502, 503, 504, timeouts and dropped connections.',
            '400, 401 and 403 mean your request, key or permissions are wrong: retrying will not help, fix the cause.',
            'Exponential backoff waits longer after each failure (1, 2, 4 seconds), and a `Retry-After` header says how long to wait when the server sends one.',
            'Always set a maximum number of attempts, and test with small inputs first.',
            'Keep costs down: cap input and output size, use a cheaper model when it is good enough and turn on spending limits or alerts.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-python-ai-05-q1',
          prompt: 'Your request returns 401 Unauthorized. What should the script do?',
          choices: [
            'Retry with exponential backoff',
            'Retry forever until it works',
            'Stop and report it, because the key or permissions need fixing',
          ],
          answer: 2,
          explanation:
            'A 401 means the key is wrong or missing. Retrying sends the same bad request again.',
        },
        {
          id: 'mini-python-ai-05-q2',
          prompt: 'What is exponential backoff?',
          choices: [
            'Waiting longer after each failed attempt, such as 1, 2, then 4 seconds',
            'Sending requests faster after a failure',
            'Switching to a bigger model after an error',
            'Doubling the prompt length',
          ],
          answer: 0,
          explanation:
            'Growing waits give a busy server time to recover and keep you within rate limits.',
        },
        {
          id: 'mini-python-ai-05-q3',
          prompt: 'Which habit best protects you from a surprise bill?',
          choices: [
            'Using the largest model for everything',
            'Running new loops on the full dataset right away',
            'Turning off timeouts',
            'Capping input and output size and testing on a small sample first',
          ],
          answer: 3,
          explanation:
            'Smaller inputs, limited outputs and small test runs keep token use, and cost, predictable.',
        },
        {
          id: 'mini-python-ai-05-q4',
          prompt: 'A 429 response includes the header `Retry-After: 10`. What does `post_with_retry` do?',
          choices: [
            'Raises an error immediately',
            'Waits 10 seconds, then tries again if attempts remain',
            'Ignores the header and retries instantly',
          ],
          answer: 1,
          explanation:
            'The function reads a numeric `Retry-After` value and sleeps that long before the next attempt.',
        },
        {
          id: "mini-python-ai-05-q5",
          audience: { max: 'beginner' },
          prompt: "In this lesson, what does \"retry\" mean?",
          choices: [
            "Asking the model a different question after it gives you a poor answer to the first one",
            "Deleting the key and creating a new one whenever the provider returns an error code",
            "Making the prompt longer so that the model has more room to answer correctly this time",
            "Sending the same request again after a failure, usually after waiting a little",
          ],
          answer: 3,
          explanation: "A retry repeats the same request because the failure may have been temporary. That only makes sense for temporary problems such as a busy server, not for a wrong key.",
        },
        {
          id: "mini-python-ai-05-q6",
          audience: { min: 'advanced' },
          prompt: "Eight workers all hit a 429 and retry after exactly 2, 4 and 8 seconds. Why does the problem keep coming back, and what helps?",
          choices: [
            "The waits are too short, so use a fixed 60 seconds for every worker and every attempt from now on",
            "Each worker should skip the wait and retry at once, since the first failure was probably only a blip",
            "The retries stay synchronised, so every wave hits the server at once; random jitter spreads them out",
            "A 429 means the key is wrong, so rotate it and the errors should stop with the next request",
          ],
          answer: 2,
          explanation: "Identical waits keep the workers in lockstep, so every wave arrives together. Jitter spreads the retries out, and honouring Retry-After and capping total retry time protect the server. Retrying at once makes it worse, and a 429 is a rate limit, not a bad key.",
        },
      ],
      taskExtra: [
        {
          audience: { max: 'beginner' },
          steps: [
            "Write the status codes 200, 400, 401, 429 and 503 on a sheet of paper and, next to each, one word: success, your mistake, your key, too fast or the server's problem.",
            "Ask an AI assistant to explain what a token is and to count roughly how many tokens a paragraph of this lesson uses, then check your provider's pricing page to see how it counts.",
          ],
        },
        {
          audience: { min: 'advanced' },
          steps: [
            "Add jitter to the wait in `post_with_retry`, cap total retry time, and write a test that proves the cap holds when every attempt fails.",
            "Add a per-run budget: stop with a clear message when the estimated tokens passed or returned exceed a limit you choose, and log the usage for each run.",
          ],
        },
      ],
      task: {
        title: 'Make it sturdy',
        minutes: 20,
        steps: [
          'Add `post_with_retry` to your project and use it inside `ask()`.',
          'Test a bad key in `.env` and confirm the script stops quickly with a clear error instead of retrying.',
          'Add your provider\'s max-output setting to the payload, using the name from its docs.',
          'Check your provider\'s usage page after your tests, and turn on a spending limit or alert if one is offered.',
        ],
      },
    },
  ],
  projects: [
    {
      id: 'mini-python-ai-p1',
      title: 'A Python script that calls an AI model',
      summary:
        'Build a small Python tool that calls an AI model to do one useful job, and publish it in a public GitHub repo with a clear README.',
      outcome:
        'A public repo that shows you can call an AI API safely from Python, with secrets kept out and errors handled.',
      unlockAfterDay: 5,
      steps: [
        {
          id: 'mini-python-ai-p1-s1',
          text: 'Choose one small job, for example: explain error messages, summarise a text file, turn meeting notes into action items, or sort support messages into categories.',
        },
        {
          id: 'mini-python-ai-p1-s2',
          text: 'Build it from this course: a virtual environment, `requirements.txt`, the key in `.env`, argparse for input, retries and a timeout.',
        },
        {
          id: 'mini-python-ai-p1-s3',
          text: 'Add a `.env.example` file with the variable names and placeholder values only, so others know what to set.',
        },
        {
          id: 'mini-python-ai-p1-s4',
          text: 'Write a README: what the tool does, setup steps, how to run it with an example command and output, and its limits.',
        },
        {
          id: 'mini-python-ai-p1-s5',
          text: 'Before your first push, run `git status` and confirm `.env` and `.venv` are not listed. Then create a public repo and push.',
          link: 'https://github.com/new',
        },
        {
          id: 'mini-python-ai-p1-s6',
          audience: { max: 'beginner' },
          text: 'Keep it small and scaffolded: build the "explain error messages" tool from the lessons without changing the idea. Ask an AI assistant to explain every line of your finished script in plain words, check its explanation against the lessons, and add the three lines you found hardest to your README under "What I learned".',
        },
        {
          id: 'mini-python-ai-p1-s7',
          audience: { min: 'intermediate', max: 'intermediate' },
          text: 'Add pytest tests that use a faked reply (patch the HTTP call and `time.sleep`) for three cases: a good reply, a 429 followed by success, and a 401 that must not be retried. Put the one command that runs them in the README.',
        },
        {
          id: 'mini-python-ai-p1-s8',
          audience: { min: 'advanced' },
          text: 'Make the tool safe for real inputs: redact obvious secrets before sending, add a `--dry-run` that prints exactly what would be sent, return non-zero exit codes on failure, log token usage for each run, and state in the README the cost cap and what happens when the provider is down.',
        },
        {
          id: 'mini-python-ai-p1-s9',
          audience: { min: 'professional' },
          text: 'Do the change as an agent-assisted piece of work: write a short spec with acceptance criteria, add an `AGENTS.md` or `CLAUDE.md` with the commands and rules (never read `.env`, never add a dependency without a note), let an AI coding agent implement it, then review the diff yourself. Commit a `REVIEW.md` listing what the agent got wrong or you changed, and the check that proves each fix.',
        },
      ],
      submission: {
        kind: 'url',
        label: 'GitHub repo link',
        placeholder: 'https://github.com/your-name/ai-helper',
        hint: 'A public repo with the script, requirements.txt, .env.example and a README with setup steps and a sample run.',
      },
      rubric: [
        'No API key or `.env` file appears anywhere in the repo or its history.',
        'The README explains what the tool does and how to set it up and run it.',
        'The key is read from an environment variable and the model name is configurable.',
        'Requests have a timeout and errors are handled, with retries only for temporary failures.',
        'Input size is capped and model output is checked before it is used.',
      ],
      rubricExtra: [
        {
          audience: { max: 'beginner' },
          items: ['The learner can explain, in their own words, what `.env`, an API key and a timeout are for in their project.'],
        },
        {
          audience: { min: 'intermediate', max: 'intermediate' },
          items: ['Tests with a faked reply cover a success, a retried failure and a failure that is not retried, and run with one command.'],
        },
        {
          audience: { min: 'advanced' },
          items: ['Secrets and personal data are redacted before sending, failures give non-zero exit codes, and the README states the cost cap and the behaviour when the provider is down.'],
        },
        {
          audience: { min: 'professional' },
          items: ['The repo includes the spec, the agent instructions and a review note naming what the agent got wrong and how each fix was checked.'],
        },
      ],
    },
  ],
  icon: 'terminal',
  updated: '2026-11-14',
};
