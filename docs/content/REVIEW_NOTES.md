# Lesson content: review notes

All course content was drafted by Claude on 2026-11-13 and needs the senior-developer review the
business plan budgets for (₱150K) before launch. Each writer listed the facts it was least sure of;
check these first.

## starter, mini-python-ai, mini-ai-engineering
- AI API code assumes the common "messages" request shape with the reply at `choices[0].message.content`, and tells the learner to check the provider's docs.
- Tools and terms named as examples: Zapier, Make, n8n, the PowerShell execution policy, `Retry-After`.
- The National Privacy Commission is named as the office for Data Privacy Act questions.

## builder
- PayMongo and Xendit as Philippine payment providers that take GCash and Maya.
- `.ph` / `.com.ph` domains through registrars (examples: Namecheap, Cloudflare, GoDaddy).
- DNS "minutes to a day or two" to spread.
- Supabase's "row level security" and "publishable"/"anon" key terms.
- Data Privacy Act of 2012 as RA 10173.
- Project links: `lovable.dev`, Google Search Console.

## freelancer
- Day 9 is the scams lesson, moved earlier so it comes before the first real proposal. Day 20 is a 30-day plan wrap-up.
- OnlineJobs.ph: pay is arranged directly between employer and worker.
- Upwork and Fiverr forbid taking clients off-platform. Check Upwork's Connects and Job Success Score, and Fiverr's three-package gigs and seller levels.
- GCash can be linked to PayPal.
- One TIN per person.
- The scams lesson names the PNP Anti-Cybercrime Group and the CICC.

## educator
- Day 5: research found AI detectors flag non-native English writing more often, and AI companies have withdrawn or warned about their own detectors.
- Day 15: the Data Privacy Act treats certain education and health records as sensitive (kept general).
- Day 13: Moodle GIFT import syntax.

## developer
- Changes to the topic order:
  - "Calling an AI model" is day 5, so Project 1 can use it.
  - The project guidance is folded into day 6.
  - Day 17 is a new deploy lesson, because Project 3 needs a live link.
- Not run: the pytest example (pytest wasn't installed). `ask.py` was only run as far as its missing-key check.
- `ask.py` uses the OpenAI-compatible chat format with a placeholder URL.
- Hosting examples named: Render, Railway, Netlify, Vercel, GitHub Pages.
- Check the student-pack mention, and the DOLE line in the job-scam warning.
- Lessons 5, 9 and 12 are mostly code; they have under 300 words of prose.

## experienced
- Day 1: cites "at least one controlled study" where experienced developers were slower on familiar codebases but felt faster (METR, 2025), with no numbers.
- Day 4: names `AGENTS.md`, `CLAUDE.md` and `.github/copilot-instructions.md` as instructions files.
- Day 16: Anthropic's Messages API with `anthropic-version: 2023-06-01`, and the model name read from an environment variable.
- Day 12: look-alike or made-up package names ("slopsquatting").

## mini-ai-qa, mini-ai-data, mini-no-code-automation, mini-sell-your-app
- Not run: the Playwright TodoMVC test (`getByTestId('todo-title')`).
- Apple and Google generally requiring in-app purchase for digital goods.
- BIR "invoices or receipts" wording (the rules changed recently).
- The PSA open data portal is named without a link.

## AI-Assisted Development path (2026-11-14)

Written by seven research agents from official documentation read on 2026-11-14 (every product statement is in a dated
`version` block with its source links). Claude re-checked these against the live pages the same day and found them right:
Cursor's plan names (Free, Plus, Premium, Super, Ultra, Teams, Enterprise, sold through "The X Subscription"; Plus has Grok
models only; legacy Start/Pro/Pro+/Ultra continue), Claude Code's auto mode as the starting mode from v2.1.283 and AGENTS.md read
only without a CLAUDE.md (v2.1.277+), Claude's plans (Free, Pro, Max, Ultra; Free up to 5 projects) and context windows (1M /
500K / 200K by model), Gemini Code Assist's "new subscriptions are no longer available", `actions/checkout@v7` and
`actions/setup-node@v7`, Spec Kit's hyphenated commands (Copilot spelling), ChatGPT's canvas replaced by writing and code blocks.
Corrected: two Cursor notes that claimed legacy plans include Cloud Agents and Bugbot (the page doesn't say), and "Plus covers
Cursor's own models" (the pricing page says Grok models only).

Still for a human reviewer (the agents could not read them directly, or they are fragile):
- ChatGPT course: help.openai.com refused automated reads (403); data-controls wording, Temporary Chat retention ("up to 30 days"),
  project instructions taking precedence over custom instructions, project-only memory, code-block Preview and Run, and the
  per-plan projects line come from search excerpts of those pages. The lesson 6 query plans were produced with SQLite 3.54.0.
- Codex course: plan list from the pricing page (cloud and GitHub review on Plus, Pro, Business, Enterprise and Edu, not with an
  API key); `--full-auto` and the `untrusted` policy marked retired; `codex cloud exec` and `codex apply` named without flags
  (the flag tables did not render); only `@codex review` is stated for GitHub. The Codex docs moved to learn.chatgpt.com.
- Claude Code course: version-specific details (`claude -p` starts in Manual mode from v2.1.302, `--bare`, `/agents`, the GitHub
  Action `anthropics/claude-code-action@v1`, `/install-github-app` needing admin access).
- Claude course: Styles are not mentioned (the help article 404s); per-file chat upload size left out (two help pages disagree);
  the help centre is inconsistent on whether project instructions are paid-only.
- Advanced course: the MCP 2026-07-28 specification details (stateless requests, `server/discover`, sampling deprecated) and the
  "about 15 times more tokens" figure from Anthropic's multi-agent research article.
- Cursor course: indexing (Instant Grep vs semantic search) and the default run mode (3.6+ Auto-review) where two Cursor pages differ.
- Products named in the path change monthly: re-check the version notes before each release; dates and sources are in each note.
