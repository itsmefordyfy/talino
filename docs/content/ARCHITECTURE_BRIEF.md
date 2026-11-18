# Software Architecture with AI: brief for module writers

**Course:** `software-architecture-ai` (intermediate to professional, 44 lessons in 12 modules, 3 projects, about 16 hours by the lessons' own `minutes`).
Design (read first): `docs/superpowers/specs/2026-11-18-software-architecture-course-design.md`. Syllabus: `src/features/courses/content/catalog/syllabus-architecture.ts`
(**lesson titles copied exactly, one lesson per topic, in order**). Subtitle: *Learn how to think like a software architect and use AI to design, evaluate, and build systems that can scale.*
Learners: intermediate developers, experienced and senior engineers, technical leads. Prerequisite: basic programming and software development (advice only). They can already build; they have
not yet had to decide how a whole system is shaped. Many are in the Philippines and read English as a second language: plain, direct English, short sentences, every acronym defined on first use.
**English only. Never write Filipino or Tagalog** (standing owner rule); Philippine names and settings in examples are fine.

This is **not a course about memorising patterns.** Every lesson makes the learner apply architectural thinking to a realistic system, with AI as a reviewer and drafting partner and **never as the
decision maker**. The baseline in every lesson is **the simplest architecture that meets the stated requirements**: never recommend microservices, Kubernetes, a message broker, a second database or
a costly managed service unless the lesson's requirements demand it, and when a lesson teaches one of them, say what it costs (people, money, complexity, failure modes) and what the simpler option was.

## Read first, in this order
`docs/content/WRITING_BRIEF.md` (lesson contract, activity rules, accuracy rules; its code "DIRECTION" does not apply), `docs/content/ADAPTATION_BRIEF.md` (five learner levels, `audience` pieces),
`src/features/courses/content/types.ts` (blocks incl. `demo`, `diagram`, `visual`; `Project`), `src/features/courses/lib/lesson-structure.ts` and `lib/standard-rules.ts` (what is checked),
`src/features/activities/types.ts`, and two model files: `catalog/courses/ai-architecture.ts` (the older, shorter architecture course: **do not repeat its lessons**; read it so yours go deeper)
and `catalog/courses/generative-ai-applications/module-03.ts` (craft, `demo` blocks, prompts, activities, projects). For labs also read the "Prompt labs" section of `docs/content/GENAI_BRIEF.md`
and `src/features/practice/types.ts` (`LabTask`).

## What you create (and nothing else)
1. `catalog/courses/software-architecture-ai/module-NN.ts` exporting `lessons: Lesson[]` and `project: Project | null` (replace the stub). Projects only in modules 7, 9 and 12.
2. For modules 2, 5, 8, 9, 10 and 11 only: `src/features/practice/labs/architecture/module-NN.ts` exporting `items: PracticeItem[]` (replace the stub): that module's `LabTask`s.
Edit no other file (others are building the diagram workbench, the trade-off matrix, the ADR builder, the architecture assistant, Tali's course focus and the wiring while you write). Do not run git.
Scratch files go in your scratchpad. **Write each file in pieces** (header + lesson 1, then add lessons one at a time) so a long lesson is never lost.
Lesson ids `software-architecture-ai-NN` (NN = 2-digit day across the whole course), `day` the same. Days by module:
1: 1-4 · 2: 5-7 · 3: 8-12 · 4: 13-15 · 5: 16-19 · 6: 20-23 · 7: 24-26 (**P1** `unlockAfterDay: 26`) · 8: 27-30 · 9: 31-34 (**P2** 34) · 10: 35-38 · 11: 39-41 · 12: 42-44 (**P3** 44).
Skill ids (the `skills` of every lesson; the wiring file exists): modules 1-2 `arch-foundations`, 3 `arch-styles`, 4 `arch-components`, 5 `arch-data`, 6 `arch-integration`, 7 `arch-cloud`,
8 `arch-reliability`, 9 `arch-security`, 10-11 `arch-ai-design`, 12 `arch-production`.

## One running example, growing with the course
**TindaTrack**: an inventory and sales app for small neighbourhood stores (sari-sari stores). It starts as one owner's app on one server (module 1-3), grows into a multi-store, multi-owner SaaS
with online payments through an e-wallet provider, text reminders and a few AI features (modules 4-9), then is deployed, reviewed and evolved (10-12). Use it as the thread so a learner meets the
same system at rising difficulty and explanations are not repeated; **recall earlier lessons by name instead of re-teaching them**. Each lesson may add a second, different example for contrast
(a clinic booking system, a delivery app, a school portal, an internal reporting tool, a game backend). Everything invented: no real company, product usage claim, number or customer.
Keep numbers small and obviously illustrative ("about 200 stores", "a few hundred requests a minute"); never present a made-up figure as a benchmark or a statistic.

## Every lesson (checked by `catalog/architecture-module.test.ts`)
Run as you go: `CHECK_ARCH_MODULE=<n> npx jest --no-watchman src/features/courses/content/catalog/architecture-module` (it also runs the standard rules on your lessons). Not-yet-written modules are stubs; that is fine.
`intro` (2 to 4 verb-first objectives = **Learning objectives**; one-to-two-sentence `why`), `summary` (the lesson summary), `minutes` 18 to 28, `skills`.
`body`, in this order (shared teaching 700 to 1,100 words; short paragraphs, concrete, no padding):
1. an opening **paragraph** (no audience).
2. heading **A real situation**: a practical example from TindaTrack or a second system: someone faces this decision, what they chose or what went wrong, and what it cost. Invented, specific.
3. heading **How it works**: the explanation. Why before how; one honest analogy; the method or checklist a developer can use tomorrow; trade-offs stated as costs. At least one `diagram` (below), `visual` (below)
   or `table`, **and the lesson must contain at least one `diagram` or `visual`**. Include the architecture standard where the syllabus puts it (below). Code blocks (SQL, JSON, YAML, TypeScript,
   shell) are welcome where a developer would write them; label every block's `language`; keep each short; never a real key or secret (use placeholders); the app does not run them.
   Level pieces here (see "Five levels").
4. heading **AI in Action**: one `demo` block `{ type: 'demo', title, prompt, output, notice }` showing a prompt and the *kind* of answer an assistant gives, **with a realistic flaw the learner should catch**
   (an invented requirement, microservices recommended without need, a missing tenant filter, a figure with no source, a boundary that leaks) and `notice` telling them what to check. **A demo is a hand-written
   illustration, never a real model's output**: never say "ChatGPT replied" or "recorded"; the app labels it "Illustration".
5. heading **Try it with AI**: a `prompt` block the learner copies into Claude, ChatGPT or Gemini (their own system in brackets), written so **they state their own decision or draft first and the AI critiques, asks
   questions and lists assumptions** rather than designing for them; then one or two sentences on what to verify.
6. heading **Next steps**: a `list` of 2 to 4 recommended next steps (what to do with this today, which lesson or tool comes next by name, what to read in official documentation).
7. exactly one `takeaways` block (2 to 6 items), **last**.
Then, as for every course: `activity` blocks, `quiz`, `task`, `taskExtra`.
- **Hands-on exercises**: the lesson's activities plus the interactive tools (below). **Practical challenge**: the lesson's `task` (a real thing on their own laptop or project, 2+ steps, 10 to 20 minutes) and `taskExtra`.
- **Activities**: at least two different kinds. Allowed: `scenario` (exactly one `best`, one or two `acceptable`, tempting `poor` ones with consequences), `match`, `tap-reveal`, `arrange` and `fill-blank`
  (`language: 'text'`), `workflow-builder` (local rules, see the GenAI brief: use it for ordering request flows, deployment steps, review steps, with tempting wrong parts) and, in modules 2, 5, 8, 9, 10 and 11, `prompt-lab`
  (live). **No `predict-output`, `code-challenge` or `fix-bug`.** Ids `<lesson-id>-<kind>-<n>`; each has 3 progressive hints, an explanation and a concept.
- **Quiz** (the knowledge check): 4 to 6 scenario questions testing judgment ("Which requirement is missing?", "What does this choice cost?"), 3 or 4 choices, **vary the correct slot, and make wrong choices as detailed
  as the right one** (the right answer must not be the longest). Never trivia, never "all of the above", nothing the lesson did not teach. Ids `<lesson-id>-q<n>`.

## Five levels (see the adaptation brief)
Levels describe programming experience, not AI-tool experience. Each lesson needs: a plain-language block (`audience: { max: 'beginner' }`, 80 to 150 words, the idea in everyday words with a defined term, right after the
concept it explains; the course targets intermediate and up, so this explains the *architecture* idea for someone who has only built small apps), a depth block (`audience: { min: 'advanced' }`, 80 to 150 words: failure modes,
scale, cost, team, operations, how it looks in a large or existing system), one gentler quiz question (`audience: { max: 'beginner' }`) and one harder one (`audience: { min: 'advanced' }`) with the next free numbers, optionally
one extra activity per side, and `taskExtra` for at least one level (a harder variation for professionals). The first teaching block has no audience. Every learner must still be asked 3 to 6 questions (`lessonStructureProblems`).

## Diagrams (`{ type: 'diagram', format: 'mermaid', source, caption }`)
Mermaid is a **safe subset** parsed by the app (`features/visuals/diagrams/mermaid.ts`; it never runs Mermaid itself). Supported: `flowchart TD|LR` (nodes `A[Box]`, `B(Rounded)`, `C{Decision}`, `D((Circle))`, `E[(Database)]`; arrows
`-->`, `-.->`, `-->|label|`; **no `subgraph`, no `style`, no `&`**), `sequenceDiagram` (`participant X as Name`, `actor`, `->>`, `-->>`; **no Note, loop, alt**), `classDiagram` (`class`, members, `<|--`, `*--`, `o--`, `-->`, `..>`, `..|>`),
`erDiagram` (`A ||--o{ B : has`, attribute blocks with `PK`/`FK`) and the **C4 views** `C4Context`, `C4Container`, `C4Component`:
```
C4Container
  title TindaTrack containers
  Person(owner, "Store owner", "Tracks stock and sales")
  System_Boundary(app, "TindaTrack") {
    Container(web, "Web app", "React", "The owner's screens")
    Container(api, "API", "Node.js", "Business rules")
    ContainerDb(db, "Database", "PostgreSQL", "Stores, products, sales")
  }
  System_Ext(wallet, "E-wallet provider", "Takes online payments")
  Rel(owner, web, "Uses")
  Rel(web, api, "Calls", "HTTPS/JSON")
  Rel(api, db, "Reads and writes", "SQL")
  Rel(api, wallet, "Starts payments", "HTTPS")
```
Elements: `Person`, `System`, `Container`, `Component`, their `_Ext` and `Db` forms; `System_Boundary(id, "Name") { }` / `Container_Boundary`; `Rel(from, to, "label", "technology")`, `BiRel`. Ids are letters, digits and `_`.
At most **24 nodes and 40 arrows** per diagram, labels at most 60 characters, no two arrows between the same pair, no self-arrows. Every diagram you write is validated by the course check, so a diagram that does not parse fails your module.
A diagram shows decisions; **say in the caption what to look at**. Prefer several small diagrams to one crowded one.

## Interactive tools (`{ type: 'visual', id }`); they exist, build on them, never re-explain their buttons
- `arch-diagram-workbench`: edit Mermaid or C4 text, draw it, copy it, save it, compare two versions. **Required** in lessons 4 (a context diagram), 13 (container and component views), 36 (diagrams as code) and used in P1 and P3.
- `arch-tradeoff-matrix`: weighted scoring of options against quality attributes, with a "too close to call" rule. **Required** in lessons 12 (choosing a style) and 37 (comparing alternatives); use it elsewhere when a lesson compares options.
- `arch-adr-builder`: writes an Architecture Decision Record from the learner's reasoning and saves it. **Required** in lessons 4 (first ADR) and 37, and in the three projects.
- `arch-assistant`: opens Tali, a course-aware architecture assistant that states assumptions, asks for missing information and explains reasoning. **Required** in lessons 7, 35 and 40; use it in the projects.
Existing visual `se-system-architecture` may be used once where it helps.

## Architecture standards (taught where useful, never name-dropped)
**C4 Model**: context diagram in lesson 4, container and component views in 13, full practice in 36. **ADRs**: first one in lesson 4, the habit and comparing alternatives in 37, kept in every project.
**UML**: only the two views that earn their place, the sequence diagram (lessons 14 and 36) and the class diagram (15); say plainly when UML is overkill. **Domain-Driven Design**: bounded contexts and a shared language in 13
(strategic design only; no tactical-pattern catalogue). **Clean Architecture** and **hexagonal** ports and adapters in 11 (dependency direction, what it buys, when it is ceremony). **12-Factor App** in 25 (what each factor
protects against, which are still relevant for containers and serverless). Teach *when and why each is useful and when to skip it*; do not overload with terminology; define each term once.

## Accuracy and honesty (checked by reading, so be strict with yourself)
- **No invented statistics, studies, benchmarks, SLA numbers, prices, quotas or limits.** Use reasoning ("a cache hit skips the database round trip") not numbers; where a figure helps, it is a labelled made-up example for the exercise.
- **No claim about what a named company does or did.** Companies appear only as invented composites. Well-known public architecture ideas may be named (the CAP theorem, the Strangler Fig pattern, the Twelve-Factor App, the C4 model,
  Domain-Driven Design, ADRs) and described in your words.
- **Cloud**: teach concepts that hold on AWS, Azure and Google Cloud (a virtual machine, object storage, a managed database, a queue, a CDN), naming each provider's service only as an example in a table or a sentence where you are certain
  of it; **never a price, free-tier amount or limit**. A product fact about a coding tool or cloud service (a feature, a mode, a file name, a command) goes in a `version` block `{ type: 'version', text, checked: '2026-11-18', sources }`
  with official https documentation only (`isOfficialSource`), and only after you have **read the page** (WebFetch). If you cannot read it, describe the idea without the product detail.
- **AI**: never present AI output as a verified fact, a guarantee or a decision. Teach checking: ask for assumptions, demand alternatives, test claims against requirements, have a human decide. A recommendation is a hypothesis to test.
- **Security** content is design-level (threat modelling, least privilege, tenant isolation, secrets handling, encryption concepts); no exploit code, no step-by-step attacks, no real credentials. Say that a security review needs a security professional for high-risk systems.
- **Compliance and law**: no legal advice and no claim that a design "makes you compliant"; say where to read the official text.
- When unsure of a fact, leave it out or hedge it honestly ("usually", "often") and list it in your final report as unsourced. A shorter correct lesson beats a longer shaky one.

## Prompt labs (modules 2, 5, 8, 9, 10, 11; `practice/labs/architecture/module-NN.ts`)
Read the "Prompt labs" section of the GenAI brief; the rules there apply except: ids are `arch-NN-<kebab>` (NN = your module, 2 digits; **each lab used by exactly one `prompt-lab` activity**, the module check reports 0 or 2 uses),
the `material` is a fictional design document, requirement list, schema, API contract, incident note or diagram description (at most 3,000 characters; **facts in it must be checkable**, with deliberate gaps and one or two planted
problems the learner should find), and the lab asks the model to review, extract risks or assumptions, or compare options **using only the material**. Useful experiments: `document-analysis` (find the missing non-functional
requirements; flag a tenant leak in a schema; list assumptions in a proposal), `structured-output` (turn a proposal into an ADR with fields checked, list risks as JSON), `text-generation` and `classification`. `criteria` reward what a
strong *architecture* prompt does: states the requirements and constraints, asks for assumptions and alternatives, asks for the cost of each option, asks the model to say what it cannot know. The `key`/`facts` hold only what the material
truly supports. Minimum labs: module 2: 1, module 5: 1, module 8: 1, module 9: 1, module 10: 2, module 11: 1 (`CHECK_ARCH_MIN_LABS=<n>`). Lab runs use the existing live practice route; **do not call any model yourself.**

## Modules: required content (every bullet must appear in some lesson; the lesson titles are the contract)
1. **Introduction** (days 1-4): fundamentals; architecture vs design (the cost-of-change test); architect responsibilities (decisions, trade-offs, communication, not being the one who draws diagrams alone); functional vs non-functional; system boundaries
   (L3, a context diagram sketch); architectural decisions; AI-assisted analysis (L4: ask AI what a system implies, then check it; first ADR with `arch-adr-builder` and first context diagram with `arch-diagram-workbench`).
2. **Requirements and planning** (5-7): business requirements, actors, goals, constraints; quality attributes made measurable (a scenario form: stimulus, environment, response, measure) incl. performance, availability, security, scalability, with
   the rule "a quality attribute without a number or a test is a wish"; AI-assisted discovery (L7: questions, assumptions, gaps; `arch-assistant`; a lab).
3. **Patterns and styles** (8-12): monolith and modular monolith as the strong default (L8); microservices and serverless: what you buy and pay (L9: team autonomy vs distributed-system cost; cold starts, limits as concepts); event-driven (L10: events vs commands,
   eventual consistency, the cost of debugging); layered, hexagonal, Clean Architecture (L11); choosing (L12: method with `arch-tradeoff-matrix`, "start simple, split when a measured reason appears", Strangler Fig as a way out).
4. **System design and components** (13-15): decomposition by responsibility and bounded context (DDD strategic); C4 container/component diagrams with the workbench (L13); dependencies, coupling, cohesion, communication styles (sync vs async), boundaries (L14, sequence diagram);
   high-level vs low-level design, UML class diagram when useful, maintainability (L15).
5. **Database** (16-19): SQL vs NoSQL (and "both"), polyglot cost; entities and relationships, normalisation and denormalisation with ER diagrams; indexing, transactions, consistency models in plain words (ACID, eventual), replication, partitioning, read replicas; multi-tenant
   models (shared schema with tenant id, schema per tenant, database per tenant: isolation vs cost vs operations); AI-assisted schema review (L19: what AI notices and misses; a lab with a flawed schema).
6. **API and integration** (20-23): REST and GraphQL trade-offs, contracts (OpenAPI as a contract), errors, pagination, idempotency; versioning and compatibility; authentication boundaries (who authenticates where), API gateways (and when you do not need one);
   third-party integrations (anti-corruption layer, timeouts, retries, circuit breaker concept), webhooks (signature checks, replay, idempotency, ordering); message queues and event-based communication (at-least-once delivery, idempotent consumers, dead-letter queues).
7. **Cloud** (24-26): compute, storage, networking concepts and the three providers' equivalents; regions and availability zones in plain words; containers vs VMs vs serverless; orchestration (what Kubernetes is for and when it is overkill); Infrastructure as Code (why, state, review);
   the 12-Factor App (L25); CDN, load balancing, managed services (buy vs run), cost optimisation as a design input (no prices). **P1**.
8. **Scalability and reliability** (27-30): vertical vs horizontal scaling, stateless services, load balancing; caching (where, invalidation, stampede) and database performance (indexes, N+1, read replicas); bottleneck analysis (measure first: profile, trace, load test; Amdahl's idea in plain words;
   never redesign without a measurement); high availability, fault tolerance (timeouts, retries with backoff, bulkheads, graceful degradation), observability (logs, metrics, traces, SLOs described as ideas), disaster recovery (RPO and RTO defined, backups that are tested).
9. **Security** (31-34): secure by design, threat modelling (STRIDE as a prompt for questions; data-flow diagram with trust boundaries); authentication and authorization (sessions vs tokens, OAuth/OIDC at concept level, RBAC vs ABAC, least privilege);
   encryption in transit and at rest, key and secrets management, API security (input validation, rate limiting, abuse); tenant isolation (at the data, application and infrastructure layers) and architecture security reviews (a checklist, evidence, what AI can and cannot check). **P2**.
10. **AI-assisted design and documentation** (35-38): working with Claude, ChatGPT and Gemini (strengths differ; verify product facts in `version` notes; use `toolComparison` once for `claude`, `chatgpt`, `gemini`); prompt patterns for architecture (context, constraints, ask for assumptions,
    ask for alternatives, ask for the cost, role of critic); diagrams as code (C4, sequence, data-flow; AI-generated Mermaid must be validated and corrected); ADRs and alternatives; reviewing AI-generated architecture (a checklist: requirements traceability, hidden assumptions,
    fashionable over fitting, missing failure modes, security, cost).
11. **Coding agents and implementation** (39-41): architecture to implementation plan (slices, walking skeleton, interfaces first, checkpoints); Claude Code, Cursor and Codex (`toolComparison` with `claude-code`, `cursor`, `codex`; **read the official docs and put every product fact
    in a dated `version` note**: instruction files, plan mode, how repository context is provided); repository context and conventions (an architecture file the agent reads, boundaries written as rules); implementation checkpoints and review; AI-assisted refactoring toward a boundary;
    architecture compliance (dependency rules, import boundaries, architecture tests described and shown in code); testing architecture decisions (contract tests, load tests as experiments, failure drills).
12. **Production and review** (42-44): production readiness review (a checklist), running an architecture review (roles, questions, evidence, outcomes); technical debt (deliberate vs accidental, how to record and repay), architectural drift and fitness functions, evolution and the Strangler Fig;
    deployment and release design (blue-green, canary, feature flags, rollbacks), CI/CD architecture, observability again as operations, cost and performance trade-offs, when to revisit a decision. **P3**.

## Projects (`Project` as in `types.ts`; ids `software-architecture-ai-p<n>`, steps `<project-id>-s<n>`, 8 to 12 steps, `submission.kind: 'text'`, `rubric` 4 to 6 criteria written as what a reviewer checks, `rubricExtra` for levels)
The learner's own work and reasoning, never AI output presented as theirs: the rubric rewards their choices, what they verified and what they changed after AI feedback. Each project's steps name the tools (`arch-diagram-workbench`, `arch-adr-builder`, `arch-tradeoff-matrix`, `arch-assistant`) and the lessons they draw
on, and **state the saved artifacts to attach**: the learner saves diagrams and ADRs in the tools and pastes their final text into the submission; the coach also receives what they saved. Include as steps, with these exact headings at the start of the step text:
*Objectives*, *Tools and resources*, *Guided AI prompts* (copyable, learner's own details in brackets, critic style), *Deliverables*, *Assessment criteria* (the rubric), *Common mistakes*. Provide an `audience` step for newcomers (smaller scope, scaffolded) and a professional extension.
- **P1 Design a Multi-Tenant SaaS Architecture** (module 7, after day 26): the learner picks a SaaS idea (or uses "StoreDesk", a multi-tenant helpdesk for small shops) and delivers: business requirements and actors, technical and non-functional requirements with measurable targets,
  a C4 context and container diagram (and one component view), component design with responsibilities, a database schema with the tenant isolation approach chosen and compared, an API design for two key flows (contract sketch), authentication and authorization (roles, tenant boundary),
  tenant isolation across data, application and noisy-neighbour concerns, and at least three ADRs. Rubric: requirements measurable; every diagram consistent with the others; isolation reasoned with a rejected alternative; ADRs record trade-offs not just choices; the simplest design that meets the requirements.
- **P2 Scale an Existing Application** (module 9, after day 34): the learner gets a described legacy application, "ShopLine" (a fictional order system: one server, one database, synchronous email sending, no cache, shared admin password; **write its description in the project as a 400-to-600-word case file with a
  small table of fictional measurements the learner interprets**; the measurements are labelled invented), and delivers: an initial architecture assessment, bottleneck identification from the supplied measurements (with the measurement each claim rests on), a performance analysis, scalability recommendations
  ranked by cost and risk, a security review, a proposed architecture (diagram), and a cost and trade-off comparison of at least two options **using relative terms, not prices**. Rubric: claims tied to evidence; the cheapest sufficient change first; security findings with severity and a fix; a rollout order that keeps the system running.
- **P3 Build an AI-Assisted Architecture Blueprint** (module 12, after day 44): the capstone for a production-oriented application of the learner's choice: product requirements, C4 diagrams (context, container, one component), data models, API specifications, a security plan, a scalability plan,
  deployment architecture, at least five ADRs, an AI-assisted implementation plan (slices, checkpoints, the instruction file for an agent, what a human reviews) **and a working proof of concept for one architectural component** (for example the tenant-aware data access layer, an idempotent webhook receiver,
  a queue consumer with retries, an authorization check) with a small test, its code linked or pasted (the learner builds it with their own tools; Talino does not run it). Rubric: blueprint consistent end to end; the proof of concept demonstrates the decision it claims (the test proves it); AI use documented with what
  was verified or rejected; risks and open questions stated honestly.

## Final report (return this, short)
Files written; per module the lesson count, activities by kind, labs, diagrams; the `version` notes you added and the official pages read; **every statement you were unsure of or could not source**; anything the check complained about that you could not fix. Do not claim a lesson was reviewed by an expert.
