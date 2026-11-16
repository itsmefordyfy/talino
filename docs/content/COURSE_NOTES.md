# Course-specific notes for writers (AI-first catalog)

Each section is the guidance for one course, on top of docs/content/WRITING_BRIEF.md (DIRECTION, level adaptation, checker rules)
and docs/content/ADAPTATION_BRIEF.md, which you must read first. Your syllabus entry (title, level, lesson titles, scope) is in
`src/features/courses/content/catalog/syllabus-ai-1.ts` or `syllabus-ai-2.ts`. Finished, passing courses to imitate for depth and craft
(they already carry the level pieces): `src/features/courses/content/catalog/courses/build-website-ai.ts`, `debugging-with-ai.ts`,
`agentic-coding.ts`. Every course: run what you show (scratch projects in your scratchpad; no paid API calls; never edit another file;
no git against the Talino repo; ignore tsc errors about a missing 'fil' locale and other writers' unfinished files); verify every
product/tool/standard fact on official docs with a dated `version` note (checked 2026-11-14; hosts in `lib/path-rules.ts`: if you need
another official host, say so in your report); no price figures. A technology is the tool, not the subject: teach directing the AI,
understanding and judging what it made, and shipping it.

## build-saas-ai
Build and launch a subscription product with AI: validate and scope, write the spec, landing page and waitlist, accounts and sign-in,
the core feature, keeping each customer's data separate (multi-tenant access rules, demonstrated with a failing-then-fixed cross-customer
read), billing (plans, checkout, receipts, webhooks: use a payment provider's official docs and its TEST mode; show webhook signature
checking and idempotency; never real card data), emails/notifications/admin, analytics and error tracking, the security checklist,
deploy and run, launch day, support and the next version. Build a small real SaaS in your scratchpad (a booking-reminders tool or
similar) with a provider test mode or a local fake that returns the documented shapes. Activities: scenario (which plan limit? who can
see this row?), fix-bug (missing tenant filter, unverified webhook: JS with tests or stored verified answers), code-challenge (pure JS:
proration/plan-limit or tenant-scoped query builder), match, arrange (the launch checklist). Final project: your SaaS live with its first user.
Refer by name to Build a Full-Stack Application with AI (before) and App Monetization and Subscriptions.

## ai-backend-dev
Getting AI to build the parts users never see: what a backend does in plain words; specify endpoints before generating them; validation
and error handling; sign-in and permissions; background jobs and email; configuration and secrets; logging and monitoring; reviewing
generated backend code for security; testing the backend. Build a small backend in your scratchpad as an AI tool would and run it with
real HTTP calls; show a prompt, the generated code to read, and the checks. Teach each concept only far enough to specify and judge it
(servers, routes, middleware, queues are the means). Activities: scenario, fix-bug (missing validation, trusting a client-sent role:
JS with tests or stored answers), code-challenge (pure JS validators/permission checks), match, arrange, predict-output.
Final project: a backend for a real app with a spec, tests and a security review.

## ai-database-design
Designing and changing the data behind an app with AI: what a database is for; describing your data to the AI; reviewing a generated
schema (keys, relationships, duplicates, missing constraints); relationships; changing it safely with migrations (never edit live data
by hand without a backup); reading and checking the queries AI writes (run them in `sqlite3` and, if available, PostgreSQL, and show
real query plans); who may see what (row-level access rules); backups and recovery. SQL and the database product are tools. Use the
in-app `sql-challenge` activities only for portable SQL (SQLite runs it) and verify every solution with sqlite3. Other activities:
scenario (is this schema safe to ship?), fix-bug (a missing foreign key, a unbounded delete), match, arrange (a safe migration).
Final project: design the data for a real app, with the schema, migrations, queries and a restore drill.

## ai-api-integration
Connecting an app to outside services with AI: what an API is; reading API documentation with AI (and checking it against the real
docs); keys and secrets (where they go, where they never go: server only, environment variables, rotation); making the first call;
errors, rate limits and retries; webhooks; testing an integration without hitting the real thing (a local fake, the provider's test
mode); safety. Use real, free, no-key public APIs for examples that run (verify they still work today and their terms) and a payments
or messaging provider's TEST mode docs for the rest. Activities: scenario, fix-bug (a key in client code, a retry without a limit:
JS with tests or stored answers), code-challenge (pure JS: backoff schedule, signature check helper, response validator), match,
arrange. Final project: connect a real service to your app with tests against a fake and a short runbook.

## ai-testing-qa
Making AI-built software trustworthy: what to test in an app you did not hand-write; ask AI for test cases before tests; generate and
run unit tests; test-first prompting; test what a user does (end-to-end checks with a browser test tool: verify its docs); exploratory
and manual testing with AI; bug reports that get fixed; stop old bugs coming back (regression); check the tests themselves (a test that
cannot fail is worthless: show mutation-style checks by hand). Test frameworks are tools. Run everything for real on a small sample app
you write in your scratchpad. The existing AI for QA Testers mini-course is the QA-career version: refer to it by name. Activities:
code-challenge/predict-output (pure JS tests of pure functions), fix-bug (a test that passes for the wrong reason), scenario, match,
arrange. Final project: a test plan and suite for an AI-built app, with a coverage-of-risks table.

## ai-deployment
Getting software live with AI: what deploying means; choosing where to host (the kinds: static host, app platform, serverless,
container, mobile store: compare from official docs, in words, no prices); environment variables and secrets in production; a domain and
HTTPS; automatic deploys from your code (a CI workflow: verify the GitHub Actions docs and run the YAML through a parser, run its steps
locally); preview versions; know when it breaks (uptime check, logs, error tracking: tool-neutral); roll back when it goes wrong
(demonstrate a rollback with git revert or the platform's rollback, in a scratch repo). Hosting products are tools. Activities:
scenario (where should this live?), fix-bug (a secret committed, a missing environment variable in production: bash/YAML with stored
verified answers), arrange (a safe release routine), match, tap-reveal. Final project: take an app live with a written release and
rollback routine. Refer by name to AI Coding Best Practices (Git basics) and Build a Website with AI.

## multi-agent-dev
Several coding agents at once: when one agent is enough and when it is not; splitting work so agents do not collide; subagents and
parallel sessions; isolation with branches and git worktrees (run real worktrees in a scratch repo and show the real commands and
output); a reviewer agent and a builder agent; handoffs and shared notes; merging results (real merge conflicts and how to resolve
them); the cost, speed and coordination limits (honest, evidence-based, no invented statistics). Ground in the tools' own docs (Claude
Code subagents and worktrees, Codex parallel tasks, Cursor parallel/background agents, Copilot cloud agent) with dated notes. You
cannot call paid models: simulate agents with a scripted local harness over a scratch repo so every trace is real. Assumes the Agents and
Agentic Coding course (refer by name). Activities: scenario, code-challenge (pure JS: detect overlapping file sets, a merge-order
planner), fix-bug, match, arrange. Final project: run a small team of agents on one feature with a written coordination plan.

## mcp-dev
Connecting AI tools to your systems with the Model Context Protocol: what MCP is and why it exists; using an existing MCP server;
configuring MCP in your AI tools (Claude Code, Cursor, Codex, Copilot: verify each tool's current config format); building a small MCP
server (use the official SDK per modelcontextprotocol.io; build and run a real minimal server in your scratchpad and call it from a
scripted client; state the spec version you read); permissions and trust; security risks (prompt injection through tool results,
over-broad tools, untrusted servers: OWASP and the MCP spec's security guidance); MCP or a plain command-line tool? Activities: scenario
(trust this server? which tools should it expose?), fix-bug (an over-broad tool definition, a secret in a config), code-challenge/
predict-output (pure JS: validate a tool-call against a schema), match, arrange. Final project: give your AI tool a capability it did not
have, with a threat model.

## ai-architecture
Using AI to think about how a system should be built: what architecture is and why it matters when AI builds; requirements and
constraints first; comparing options with AI (real prompts; make the AI argue against its own recommendation); trade-offs you must decide
yourself; diagrams (Mermaid, validated by the app's subset) and design documents; decision records (ADRs, with a template); reviewing an
architecture AI proposed (a checklist: failure modes, data ownership, coupling, cost, security, operability); growing a system safely.
Use one worked system end to end (the booking application); write the real design doc and ADRs in full. Technologies are options in the
comparison, never the subject. Activities: scenario (which option fits these constraints?), fix-bug (a design with a single point of
failure: choose the fix), match, arrange, fill-blank (complete an ADR), tap-reveal. Final project: design and document a system, with
two ADRs and a failure-mode review.

## production-ai-apps
The gap between a demo and a product: what production-ready means; reliability and failure handling (timeouts, retries, graceful
degradation: show real failure injection in a scratch app); performance you can measure (measure real numbers); security you can defend;
monitoring, logs and alerts (tool-neutral, with a real structured-logging example); protecting users' data (backups with a real restore
drill, deletion, privacy basics); automated checks on every change (a real CI workflow); a release routine you trust; incidents (a
real blameless write-up template, a runbook); keeping AI-written code maintainable; costs at scale (in words). Harden a small sample app
for real and show before/after evidence. Assumes Build a Full-Stack Application with AI and AI-Assisted Testing and QA (refer by name).
Activities: scenario, fix-bug, code-challenge (pure JS: a retry-with-backoff, a rate limiter), match, arrange. Final project: harden an
app for real users with an evidence table.

## ai-coding-security
Security when AI writes and runs code: the new risks of AI-written code; vulnerabilities AI often introduces (injection, broken access
control, insecure defaults, hard-coded secrets, outdated or invented packages: show real examples and fixes, OWASP Top 10 edition and
OWASP LLM Top 10 edition stated); secrets and keys (leaks and how to stop them: scanning, push protection, rotation); dependencies,
made-up packages and supply-chain risk (registry checks, lockfiles, audit tools verified in official docs); prompt injection against
your agent; safe permissions and sandboxes for coding agents; privacy, company policy and what you may paste; a security review routine;
responding to a leak or an incident (a real checklist). Run every demonstration for real in scratch projects. Assumes AI Coding Best
Practices (refer by name). Activities: scenario, fix-bug (JS with tests or stored answers), code-challenge (pure JS: a secret-pattern
scanner, a permission policy), match, arrange. Final project: a security audit of an AI-built app with a prioritised fix list.

## managing-ai-projects
Running larger projects where AI does much of the building: how a project changes when AI builds most of it; breaking big work into
agent-sized pieces (a real task breakdown); quality gates that catch AI mistakes (definition of done, CI, review); documentation that
keeps working (README, decision records, instructions files); keeping a team consistent (shared conventions, prompts and rules in the
repo); measuring productivity honestly (what to count and what not to count; no invented statistics; cite primary sources only for
factual claims such as the DORA reports); managing risk, cost and client expectations. Use one multi-week project plan written out in
full. Assumes Spec-Driven Development. Activities: scenario (which gate catches this?), fix-bug (a plan with an unreviewable giant task),
match, arrange, fill-blank, tap-reveal. Final project: a multi-week AI-assisted project plan with gates and a metrics note.

## app-monetization
Making money from software you built with AI: ways an app can earn; pricing (how to choose a price: a method, never specific prices as
advice); subscriptions and one-time purchases; a paywall that respects users; how the app stores handle payments (verify Apple and Google
documentation, and a subscription-management service's docs, with dated notes: rules, fees and categories only in words, never figures);
ads and when they are worth it; testing prices and reading your numbers (conversion, churn, revenue per user: define them, compute them
with pure JS the in-app runner executes). Talino itself is a subscription/course app: you may describe patterns generically without
private business details. Activities: code-challenge/predict-output (pure JS metrics), scenario, fix-bug (a misleading paywall: choose the
fair fix), match, arrange. Final project: a monetization plan and paywall design for your app.

## launch-marketing
Getting your first users: who it is for and what it promises (positioning); a landing page and waitlist; a store listing that converts
(verify Apple and Google listing guidance in official docs); short videos and posts with AI help (real prompt/script templates; honest
marketing rules: the FTC endorsement guidance at ftc.gov is not an allowed host: describe disclosure principles generally and say to
check local advertising rules); launch day; collect feedback and first reviews; early growth. Philippine and global audiences both welcome.
Complements Selling Your Vibe-Coded App (existing) and Turn an Idea into a Working Product: refer by name, do not repeat. Activities:
scenario, match, arrange, fill-blank (a positioning statement), tap-reveal. Final project: a launch plan and your first launch assets.

## freelance-ai-dev
Selling software built with AI as a freelancer: what an AI-powered developer can sell; finding your niche and first clients; scoping a
project honestly; proposals that win work (write a real proposal template); pricing work that AI makes faster (value-based vs time-based:
method, no specific prices); contracts, ownership and payment terms (general principles only: not legal advice; say to get local legal
advice); using AI with a client's data and code (confidentiality, tool settings verified in official docs); delivery and handoff;
maintenance retainers; getting paid from anywhere (payment options in general terms); reviews, referrals and growth. The existing
Freelancer & VA with AI covers the wider online-work market: refer by name. Activities: scenario, match, fix-bug (a proposal with
unlimited scope: choose the fix), arrange, fill-blank. Final project: win and deliver your first paid project (proposal, scope, delivery
checklist).

## ai-software-business
Turning building skill into a business: product, service or studio (choose a business model); finding your first customer; your first
revenue; running operations and support with AI; legal and tax basics in general terms (not advice: say to ask a qualified local
professional; the Philippines' BIR and other tax authorities are primary sources only for facts you cite); pricing, margins and your
time (compute with pure JS); a sustainable pace for a one-person team; growing without losing control. Assumes Turn an Idea into a Working
Product. Activities: scenario, code-challenge/predict-output (pure JS margin/time calculations), match, arrange, fill-blank. Final
project: a one-page business plan and 30-day launch plan.
