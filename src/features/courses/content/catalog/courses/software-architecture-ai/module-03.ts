import type { Lesson, Project } from '../../../types';

// Module 3: Architectural Patterns and Styles (lessons 8 to 12, days 8 to 12, no project, no labs). Written 2026-11-18.
// No product facts are stated as fact, so there are no version notes. Every person, business, system and figure in the examples is invented.
// Demos ("AI in Action") are hand-written illustrations; none of them is a real model's output.

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-08',
    day: 8,
    title: 'Monolith and Modular Monolith: The Strong Default',
    summary: 'See why one well-structured deployable unit is the right first shape for most systems, and how to give it real internal boundaries.',
    intro: {
      objectives: [
        'Explain what a monolith and a modular monolith are, and what each gives you and costs you',
        'Check whether the modules of a system have real boundaries: a public interface, owned data and a dependency rule',
        'Name the measured signs that justify moving a module out of a monolith',
      ],
      why: 'Most systems that fail their teams fail from tangled code, not from having one deployable unit. Knowing the strong default lets you resist a costly split and still keep the system changeable.',
    },
    minutes: 22,
    skills: ['arch-styles'],
    body: [
      { type: 'paragraph', text: `Every system has a shape, and the shape decides how expensive future changes are. In this module you meet the main shapes, called architecture styles, one at a time, and in the last lesson you learn to choose between them. We begin with the oldest and most useful one. A **monolith** is an application built and deployed as one unit: one codebase, one running program, usually one database. That sounds old-fashioned. It is also the right starting point for most systems, and this lesson shows why, and how to keep one healthy.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Marites built TindaTrack for her aunt's sari-sari store: one Node.js app on one rented server, with a PostgreSQL database. Products, sales, stock counts and the evening summary all live in that one program. It worked well. A friend at a large company told her, "Real systems use microservices. Split it now, before it gets big." She did not.` },
      { type: 'paragraph', text: `Six months later TindaTrack had about 40 stores and a second developer, Paolo. Then a real problem appeared, and it was not size. Paolo changed how prices are rounded in the sales code. That code also wrote straight into the stock tables, and a stock-count bug showed up on a screen he had never touched. Finding it took a full day, because nothing said which code was allowed to change which tables. The cost was not a missing server or a missing network. It was missing boundaries inside the program.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `"Monolith" describes how a system is **deployed**, not how good its code is. The opposite problem has a name too: a *big ball of mud* is a monolith where any code can call any other code and touch any table. People who say they dislike monoliths usually dislike that. Here is what one deployable unit gives you:` },
      { type: 'list', items: [
        'One thing to deploy and to watch. Exactly one version of the code is running.',
        'Calls between parts are ordinary function calls. They are fast, and they either return or throw: there is no network between them.',
        'One database transaction can cover a sale and its stock change, so both succeed or both fail.',
        'One place to read logs and one debugger to step through a request.',
      ] },
      { type: 'paragraph', text: `And what it costs:` },
      { type: 'list', items: [
        'You scale the whole app by running more copies of it, even if only one part is busy.',
        'A bad release can affect every feature at once.',
        'One language and runtime for everything.',
        'As it grows, builds and tests slow down and more people touch the same code.',
        'Without internal rules, it decays into the ball of mud.',
      ] },
      { type: 'paragraph', text: `An analogy, and only an analogy: a monolith is one shop building. Everything is under one roof, so carrying goods from the stockroom to the counter is a short walk. The danger is not the building. It is a shop with no aisles, where anyone can wander into the stockroom and move things without telling anybody.` },
      { type: 'paragraph', text: `A **modular monolith** keeps the single deployment and adds the aisles. The code is divided into modules, and each module has three things: one clear responsibility, a small **public interface** that other modules must use, and its own data, which only that module reads and writes. Other modules ask through the interface. They never reach into its tables.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `C4Component
  title TindaTrack as a modular monolith
  Person(owner, "Store owner", "Records sales and checks stock")
  Container_Boundary(app, "TindaTrack app (one unit)") {
    Component(sales, "Sales", "TypeScript module", "Records sales and receipts")
    Component(inventory, "Inventory", "TypeScript module", "Stock levels and reorder points")
    Component(catalog, "Catalog", "TypeScript module", "Products and prices")
    Component(reminders, "Reminders", "TypeScript module", "Evening summary and low-stock alerts")
  }
  ContainerDb(db, "Database", "PostgreSQL", "One database, tables grouped by owning module")
  Rel(owner, sales, "Records sales", "HTTPS")
  Rel(sales, catalog, "Reads prices", "Function call")
  Rel(sales, inventory, "Reduces stock", "Function call")
  Rel(reminders, inventory, "Reads stock levels", "Function call")
  Rel(inventory, db, "Owns stock tables", "SQL")
  Rel(catalog, db, "Owns product tables", "SQL")`,
        caption: 'One box means one deployment. Look at the arrows between modules: each goes to a module, never to another module\'s tables. Only the owner of a table talks to the database for it.',
      },
      { type: 'paragraph', text: `The public interface can be as small as one file. In a TypeScript codebase it might look like this, and the rule is that other modules import only this file:` },
      {
        type: 'code',
        language: 'typescript',
        label: 'A module\'s public interface (fragment: declarations only)',
        code: `// inventory/index.ts: the only file other modules may import
export type StockLevel = { productId: string; quantity: number };

export declare function getStockLevel(storeId: string, productId: string): Promise<StockLevel>;

export declare function recordSale(
  storeId: string,
  lines: { productId: string; quantity: number }[],
): Promise<void>;

// Everything else in inventory/ (queries, tables, helpers) stays private.`,
      },
      { type: 'paragraph', text: `How do you know the boundaries are real? Ask five questions of each module. Can you say what it is responsible for without using the word "and"? Is there one public entry point? Do other modules import only that entry point? Does exactly one module write each table? Is there an automatic check that fails when someone breaks the rule? If the answer to the last question is no, the boundary is a hope, not a design. Later lessons show how coding agents and import checks can enforce it.` },
      { type: 'paragraph', text: `Why is this the strong default? Early in a system you do not yet know where the right boundaries are. In a modular monolith a wrong boundary costs a refactor inside one codebase, with a compiler and tests to help. A wrong boundary between separately deployed services costs a network contract, two release pipelines and a data migration. Modules let you learn the boundaries cheaply. And if a module must leave later, because of a measured reason (lessons 9 and 12 cover how to decide), a module that already owns its data and hides behind an interface can be moved out. A tangled one cannot.` },
      { type: 'paragraph', text: `A monolith starts to hurt in specific, measurable ways: releases queue because many teams share one deployment; one part needs very different scaling, security isolation or runtime from the rest, and you have measured it; builds and tests are so slow that feedback is lost. Notice what is not on the list: "the system feels old" and "other companies split theirs".` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a monolith is one program that does everything, started and stopped as a single piece. That is not bad in itself. The trouble starts when the inside is a mess, like a kitchen where every cook uses every shelf. A modular monolith is the same single program with a rule for the inside: the kitchen has stations (grill, drinks, desserts), each station keeps its own ingredients, and if the grill needs a drink order it asks the drinks station through the counter. The program is still one piece, but each part has a clear job and a clear way to be asked for things.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `The usual failure of a modular monolith is not the diagram but erosion: a shared "common" or "utils" package grows business logic, a reporting query joins three modules' tables "just once", and an ORM (object-relational mapper) model is passed across a boundary and becomes a hidden contract. Each of these is a coupling that no import rule sees. Database-level enforcement helps: separate schemas or roles per module, so a cross-module read is a visible, reviewed decision. Treat extraction readiness as a property you can test: can this module's tests run with every other module replaced by its interface? If yes, you have kept the option to move it out, at roughly the cost of one network contract.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'With a few projects behind you, you have probably met a monolith without the name: one codebase, one deployment. Hold on to that picture. Every style in this module is a way of moving a boundary, and each move buys independence at the price of more things that can fail between the parts.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant recommends an architecture for TindaTrack',
        prompt: `I'm designing TindaTrack, an inventory and sales app for sari-sari stores. Right now: one developer and one contractor, about 40 stores, one server. It must record sales, track stock and show a daily summary. Recommend an architecture.`,
        output: `Recommended architecture: a cloud-native microservices platform.\n\n1. Split the system into six services: Product, Inventory, Sales, Reporting, Notification and Identity, each with its own database.\n2. Put an API gateway in front of them.\n3. Use a message broker for events between services.\n4. Deploy on Kubernetes with autoscaling.\n5. Add distributed tracing from day one.\n\nThis design scales to millions of stores and lets teams deploy independently.`,
        notice: `Look at what the answer never asks. No requirement says "millions of stores", and "teams deploy independently" solves a problem that two developers do not have. Six services mean six databases, a gateway, a broker and a cluster to run for 40 stores. The assistant answered "what do big systems use?" instead of "what do these requirements need?". Ask it which stated requirement each component serves and what the simpler option is. Here the simpler option, a modular monolith, was never mentioned.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Decide first. Write down, in a few lines, the shape you would give your own system today and the modules in it. Then give the draft to an assistant and ask it to act as a critic, not a designer.` },
      {
        type: 'prompt',
        label: 'Critique my modular monolith',
        text: `I am designing [your system in one sentence].\n\nRequirements and constraints: [3 to 5 requirements, with numbers where you have them; team size and skills; where it will run].\n\nMy decision: [for example: one modular monolith with the modules A, B and C, each owning its own tables].\n\nAct as a critic, not a designer. Please:\n1. List the assumptions behind my decision.\n2. For each module, say whether its responsibility and data ownership are clear, and where they could leak.\n3. Name the first measured reason that would make me move a module out, and what I should measure.\n4. Say what you cannot know from what I gave you.\n\nDo not recommend microservices, Kubernetes or a message broker unless one of my stated requirements needs it, and name that requirement if you do.`,
      },
      { type: 'paragraph', text: `What to verify: every assumption it lists should be one you can confirm or reject, and any new requirement it mentions should be yours. If it recommends splitting anything, ask which line of your requirements the split serves. A recommendation is a hypothesis to test, and you make the decision.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Open one real project and run the five-question boundary test on its main folders today (the practical challenge below walks you through it).',
        'Next lesson, "Microservices and Serverless: What You Buy and What You Pay", gives the honest cost list for the styles that split a system apart.',
        'Read the article on the Monolith First idea on Martin Fowler\'s site to see this argument in the words of its author, and judge it against your own system.',
      ] },
      { type: 'takeaways', items: [
        'A monolith is a deployment choice: one unit. It can be well structured or a big ball of mud.',
        'A modular monolith adds real boundaries: one responsibility, a public interface and owned data per module.',
        'Wrong boundaries are cheapest to fix inside one codebase, which is why this is the strong default.',
        'Split a module out only for a measured reason: release contention, a very different scaling or security need, or unworkable build times.',
        'A boundary with no automatic check is a hope, not a design.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-08-scenario-1',
          kind: 'scenario',
          title: 'The query that reaches too far',
          prompt: 'Choose how the Reminders module should get a product\'s stock level.',
          concept: 'module boundaries',
          situation: 'TindaTrack is a modular monolith. The Reminders module needs the current stock level of a product to decide whether to send a low-stock alert. A developer notices that a single SQL query on the Inventory module\'s stock_levels table would be the quickest way to get it, and the deadline is tomorrow.',
          options: [
            { text: 'Call the getStockLevel function in Inventory\'s public interface. If it is missing something Reminders needs, add it there.', consequence: 'The call costs one extra function and keeps the rule intact. When Inventory changes its tables later, Reminders does not break.', quality: 'best' },
            { text: 'Have Inventory publish a "stock is low" event and let Reminders keep its own copy of the low items.', consequence: 'This keeps the boundary, but it adds events, a copy of the data and a way for the copy to go stale. For one in-process read it is more machinery than the problem needs.', quality: 'acceptable' },
            { text: 'Run the SQL query on the stock_levels table "just this once" and note it with a comment.', consequence: 'It works today. In three months Inventory renames a column, Reminders fails in production, and nobody remembers the comment.', quality: 'poor' },
            { text: 'Move the whole Reminders feature into the Inventory module so no boundary has to be crossed.', consequence: 'The crossing disappears, but so does the separation. Inventory now owns two responsibilities and keeps growing.', quality: 'poor' },
          ],
          hints: [
            'Ask which code is allowed to know the shape of the stock tables.',
            'The public interface exists for exactly this question. What would you do if it lacked a function?',
            'Removing the boundary or hiding the crossing in a comment does not make the design better; it only hides the cost.',
          ],
          explanation: 'The module that owns the data is the only one that should know its tables. Calling the public interface keeps that true, and adding a missing function there is cheap. An event with a copy is a valid pattern, but it solves a different problem.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-08-arrange-1',
          kind: 'arrange',
          title: 'Untangle a monolith in a safe order',
          prompt: 'Put the steps in the order that turns a tangled monolith into modules without stopping development.',
          concept: 'modular monolith',
          language: 'text',
          solution: [
            'Write one sentence of responsibility for each part of the app',
            'Pick one part and list the tables only it should write',
            'Put a small public interface in front of that part',
            'Change other code to call the interface instead of reading its tables',
            'Add an automatic check that fails when code imports the part\'s internals',
          ],
          reasons: [
            'You cannot draw a boundary until you can say what is inside it.',
            'Data ownership is the heart of the boundary, so decide it before writing any interface.',
            'The interface gives other code somewhere legal to go.',
            'Now the old direct reads can be moved one at a time, with the app still working.',
            'The check keeps the boundary from eroding once the hard work is done.',
          ],
          hints: [
            'Which step needs the least knowledge, and which one depends on every earlier step?',
            'Callers cannot be moved to an interface that does not exist yet.',
            'The automatic check comes last: it protects work that has already been done.',
          ],
          explanation: 'Name the responsibility, decide who owns the data, offer a legal way in, move callers one by one, then lock the door. Doing it part by part keeps the system releasable the whole time.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-08-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Three things people say about monoliths',
          prompt: 'Tap each statement and read what is true and what is missing.',
          concept: 'monolith trade-offs',
          cards: [
            { front: '"A monolith cannot scale."', back: 'You can run many copies of a stateless monolith behind a load balancer. What you cannot do is scale one part alone. Whether that matters is something you measure, not assume.' },
            { front: '"A monolith is the same thing as messy code."', back: 'Monolith is about deployment. Messy code is about missing boundaries, and microservices can be just as messy, with the mess spread over a network.' },
            { front: '"We will have to rewrite it when we grow."', back: 'Only if there were no boundaries inside. A modular monolith can have a module moved out when a measured reason appears, which is far cheaper than a rewrite.' },
          ],
          hints: [
            'Read each card and ask what would have to be measured to know whether it is true.',
            'Look for the word "cannot" or "will have to": absolute claims are usually where the gap is.',
            'Deployment and code quality are two separate questions; the cards mix them.',
          ],
          explanation: 'Each slogan has a grain of truth and a gap. Replace slogans with measurements and with the question of whether the boundaries inside are real.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-08-q1',
        prompt: 'Two developers on TindaTrack (about 40 stores) find the code hard to change: a price change broke a stock screen. A third person proposes splitting into microservices. What does the evidence support?',
        choices: [
          'Split now into services. A network between the parts will enforce the boundaries that the team has not managed to keep inside one program, and each service can then be owned and changed on its own.',
          'Add module boundaries inside the monolith first: public interfaces, one owner per table and an import check. The problem shown is missing boundaries.',
          'Rewrite the app from scratch in a newer framework, because tangled code cannot be repaired and a clean start is cheaper.',
          'Wait. Bugs like this appear in every codebase, and structure only becomes worth the effort when traffic is high.',
        ],
        answer: 1,
        explanation: 'The failure was one module writing another\'s tables, which is a boundary problem. Services would need the same boundaries, plus a network. Fixing the boundaries inside one codebase is the cheapest first step.',
      },
      {
        id: 'software-architecture-ai-08-q2',
        prompt: 'Which statement about monoliths is accurate?',
        choices: [
          'A monolith is an application whose code is poorly organised, which is why careful teams avoid building one.',
          'A monolith is an application that runs on a single physical server, so adding a second server turns it into a distributed system.',
          'A monolith is an application with one database and no outside integrations, which limits what it can do for its users.',
          'A monolith is an application deployed as one unit. Its inside can be tangled or well divided into modules.',
        ],
        answer: 3,
        explanation: 'Monolith describes the deployment unit. Several copies of one monolith can run on many servers, and it can call outside services. Whether the inside is organised is a separate question.',
      },
      {
        id: 'software-architecture-ai-08-q3',
        prompt: 'In a modular monolith the Reminders module needs a product\'s stock level. Which approach keeps the module boundary intact?',
        choices: [
          'Call the function in Inventory\'s public interface, and add the missing function there if needed.',
          'Query the stock table directly, but only through a shared helper in a common package so the SQL is written once.',
          'Copy the stock table into Reminders\' own tables every night so that it never has to ask Inventory.',
          'Give Reminders the same database permissions as Inventory so that it can read what it needs without delay.',
        ],
        answer: 0,
        explanation: 'The owner of the data is the only code that knows its tables, so others ask through the interface. A shared helper, a copy and shared permissions all spread knowledge of the tables to another module.',
      },
      {
        id: 'software-architecture-ai-08-q4',
        prompt: 'Which of these is a measured reason to consider moving a module out of the monolith?',
        choices: [
          'The team has read that the largest software companies use microservices and wants to be prepared for growth.',
          'The module was written two years ago and uses an older style than the newer modules.',
          'Release records show deployments waiting for each other because several teams share one release, and the module needs its own cadence.',
          'The module is the longest folder in the codebase, and large folders are harder to read, test and review than several smaller ones in separate deployments.',
        ],
        answer: 2,
        explanation: 'A measured reason is something you can point to in records or tests, such as deployment contention. Fashion, age and size alone are not reasons to take on the cost of a split.',
      },
      {
        id: 'software-architecture-ai-08-q5',
        audience: { max: 'beginner' },
        prompt: 'A kitchen has stations. The grill needs a drink order, so it asks the drinks station through the counter and does not walk into its fridge. What is that like in a modular monolith?',
        choices: [
          'A module asks another module through its public interface and does not read its data directly.',
          'Every module gets its own computer, so that one slow module cannot hold up the others.',
          'Every module shares the same data so that it can find what it needs quickly.',
        ],
        answer: 0,
        explanation: 'The counter is the public interface. The fridge is the module\'s private data. Going through the counter lets the station reorganise its fridge without anyone else noticing.',
      },
      {
        id: 'software-architecture-ai-08-q6',
        audience: { min: 'advanced' },
        prompt: 'Six months into a modular monolith, a reporting query joins tables owned by three modules. What is the most useful response?',
        choices: [
          'Block it outright. Reports must never read across modules, because the first exception will lead to every module reading every table and the boundaries will be lost within a year.',
          'Decide it on purpose: give reporting a read interface or a view owned by one module, or record the join as a named exception in a decision record.',
          'Accept it silently. Reporting is read-only, so it cannot cause the kind of coupling that matters for changing the modules.',
          'Move reporting to its own service immediately, because a separately deployed service is the only structure that allows cross-module data access without breaking the rules.',
        ],
        answer: 1,
        explanation: 'Reporting often needs a cross-module view, so a flat ban fails. What erodes ownership is unrecorded reads. A deliberate interface or a recorded exception keeps the cost visible, and a read-only join still breaks when a table changes.',
      },
    ],
    task: {
      title: 'Find the seams in a real project',
      minutes: 15,
      steps: [
        'Pick a project you know (from work or your own) and list its top-level folders or packages.',
        'For each one, write one sentence of responsibility. Mark any that you can only describe with "and".',
        'Find one place where one part reaches into another\'s data or private files (for example a query on another area\'s table, or an import of an internal file). Write down the line and what the public interface could have been.',
        'Sketch the modules as a C4 component diagram or a plain list of boxes and arrows, and note which arrows would break the five-question test.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you have no larger project, use a small app you built (a to-do list or a notes app) and ask an assistant to explain which parts depend on which. Check its answer by opening the files yourself.'] },
      { audience: { min: 'advanced' }, steps: ['Count the imports that cross a module boundary without going through a public entry point, and propose one rule that an import check could enforce. Write down the first measured reason you would accept for extracting one module, and which number you would watch.'] },
    ],
  },
  {
    id: 'software-architecture-ai-09',
    day: 9,
    title: 'Microservices and Serverless: What You Buy and What You Pay',
    summary: 'Keep an honest ledger for the two styles that split a system apart, and learn the questions to ask before any split.',
    intro: {
      objectives: [
        'List what microservices and serverless give you and what each one costs in network, data, operations and people',
        'Recognise a distributed monolith and a poor serverless fit',
        'Use five questions to decide whether a split is justified by a measured problem',
      ],
      why: 'These two styles are often chosen because they are fashionable, and the bill arrives in team time and failures. If you can state the cost before you split, you split only when it is worth it.',
    },
    minutes: 26,
    skills: ['arch-styles'],
    body: [
      { type: 'paragraph', text: `Lesson 8 kept everything in one deployable unit. This lesson covers the two styles that deliberately split a system apart, and it keeps a ledger: what each one buys and what each one costs. **Microservices** divide a system into small services. Each service is deployed on its own, runs as its own process and owns its own data. **Serverless** means you hand the running of servers to a provider: you upload functions (or containers), and the provider starts them when work arrives and stops them when it does not. Both are real tools. Both are often chosen for the wrong reasons.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `A team of five built a delivery app and split it into services in the first quarter: Orders, Couriers, Payments, Notifications and Inventory. Placing one order now crosses four of them. Three weeks after launch the Notifications service slowed down, orders began to time out, customers pressed "Order" twice, and some were charged twice. To follow one order, a developer opened four sets of logs. Adding a tip field touched three services and needed three releases in the right order. The team had gained independent deployment, and paid for it with the time of five people who were mostly working on the plumbing between services instead of the app.` },
      { type: 'paragraph', text: `TindaTrack went the other way. Marites kept the core in one modular monolith and moved exactly one thing out: the nightly summary text. It runs briefly, once an evening, nobody waits for it, and it can simply be run again if it fails. As a small scheduled serverless function, it fits.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**What microservices buy.** Independent deployment and scaling: you release one service without releasing the rest, and give a busy service more copies. Team autonomy: one team can own a service end to end. Failure isolation, if you design for it: a crash in one service need not stop the others. Freedom to pick different technology per service. Teams and services should line up, because systems tend to copy the communication structure of the organisation that builds them (this is known as Conway's law).` },
      { type: 'paragraph', text: `**What microservices cost.**` },
      { type: 'list', items: [
        '**The network.** Every call between services can be slow, fail or time out and may be retried. Part of the system can be down while the rest is up.',
        '**Split data.** There is no single transaction across services. A sale and its stock change can no longer succeed or fail as one, so you need patterns for eventual consistency (lesson 10 and, later, lesson 23).',
        '**Operations.** A build and release pipeline per service, configuration, monitoring and tracing across services, and someone to run all of it at 2 a.m.',
        '**Testing and versioning.** Services must stay compatible while both sides change (module 6), and testing one flow means running several services.',
        '**Security surface.** More network paths and more credentials to protect.',
        '**People.** The platform skills this needs may not be in a small team.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  A[Customer app] -->|1 place order| B[Orders]
  B -->|2 check items| C[Inventory]
  B -->|3 take payment| D[Payments]
  D -->|4 create charge| E[E-wallet provider]
  B -->|5 assign courier| F[Couriers]
  B -->|6 send receipt| G[Notifications]`,
        caption: 'One order in the split delivery app. Every arrow is a network call that can be slow, fail or time out. Count how many must work before the customer sees "Order placed".',
      },
      { type: 'paragraph', text: `A common trap has its own name. A **distributed monolith** is a set of services that must be released together or that share a database. You pay all the costs above and get none of the independence. If two services cannot be deployed on different days, they are one service with a network in the middle.` },
      { type: 'paragraph', text: `When is a split justified? The conditions matter more than any number: several teams are blocked by one shared release; one part has a measured need that differs from the rest (scaling, security isolation, runtime); the boundary is already clear and stable (lesson 13 shows how to find it); and the team can operate what it creates. If one of these is missing, a cheaper style from lesson 8 is the better answer.` },
      { type: 'paragraph', text: `**Serverless** is easier to misjudge, because the name sounds like "no work". Servers still exist; the provider runs them. The idea exists on every large cloud (AWS Lambda and Azure Functions are two examples of function services). What you buy: no servers to patch or size; capacity that follows demand, down to nothing; billing that follows usage, so a job that runs rarely can cost little; and a natural fit for work triggered by an event, such as a timer, an uploaded file or a queued message.` },
      { type: 'paragraph', text: `What it costs:` },
      { type: 'list', items: [
        '**Cold starts.** When no warm copy is ready, the first request waits while the provider starts one. How long depends on the provider, the runtime and your settings, so measure it for your case.',
        '**Limits.** Providers cap things such as how long a function may run, its memory, the size of a request and how many copies run at once. They differ and they change, so read the current documentation before designing around them.',
        '**Statelessness.** Anything kept in memory may not be there next time.',
        '**Connections.** Many short-lived copies that each open a database connection can use up the database\'s connection limit unless you design for it.',
        '**Harder local work, and lock-in.** Running and debugging on your laptop is harder, and triggers and settings follow one provider\'s model. Lock-in is a cost to weigh, not a sin.',
        '**Cost at steady load.** Paying per use can cost more than servers you keep busy. Compare with your own numbers, not a slogan.',
      ] },
      { type: 'paragraph', text: `Serverless fits periodic jobs, spiky or unpredictable event-driven work and glue between services. It fits badly with long-running work, response-time-critical paths where a cold start hurts, heavy steady load, and anything that needs a lot of local state.` },
      { type: 'paragraph', text: `Before any split, ask five questions. Which measured problem does this solve, and what is the number today? Can the part live alone, with its own data and a small stable interface? Who owns it and runs it, including at night? How will you follow one request across it? What is the simpler option, and why is it not enough? If you cannot answer the first and the last, the split is a guess.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: imagine one big shop with one cashier and one storeroom. Splitting it into many market stalls lets each stall open and close on its own, and a busy stall can hire more helpers. The price is that stalls now have to shout to each other to complete one customer's order, and if one stall is slow or closed, every order that needs it waits. Serverless is more like hiring a taxi instead of owning a car: you pay when you ride and never park or repair it, but sometimes you wait for it to arrive. That wait is the cold start. Neither idea is better. Each is a trade.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `The failure modes are what you design against. A synchronous chain of services is only available when every link is, so its availability is lower than the weakest link. Without timeouts that shrink along the chain, one slow service holds threads in every caller, and retries multiply the load on the service that is already struggling. Separate databases remove one shared point of failure and introduce the need for compensating actions instead of rollbacks. Serverless adds concurrency limits and at-least-once triggers, so functions must be idempotent. Observability stops being optional: you need a correlation id on every request before the second service exists. Modules 6 and 8 treat these in detail.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant is asked whether to use serverless',
        prompt: `TindaTrack texts each store owner a summary of the day's sales every night. We have about 150 stores and one PostgreSQL database. Should we use serverless or keep servers?`,
        output: `Serverless is the clear choice. It scales automatically without limits, cold starts are negligible, and you will save about 70% compared with running a server.\n\nMove the whole TindaTrack backend to functions: one function per API endpoint, each connecting directly to PostgreSQL. You will never need to think about infrastructure again.`,
        notice: `Count the problems. "Without limits" is false: functions have limits on time, memory and concurrency. "Negligible" depends on provider, runtime and settings, and should be measured. "About 70%" is a figure with no source and no inputs, presented as a fact. Many short-lived functions each opening a connection to one database can exhaust its connections. And the question was about a nightly job, yet the answer moves the whole backend. A better answer would separate the nightly job, which fits, from the rest, and list the costs.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Pick a part of a system you know that someone wants to split out, or move to functions. Write why, and the number that shows the problem. Then ask an assistant to argue against you.` },
      {
        type: 'prompt',
        label: 'Argue against my split',
        text: `I am considering [microservices / serverless functions] for [one specific part of my system].\n\nMy reason: [the problem I have measured, with the number].\nContext: [team size, skills, who is on call, current deployment].\n\nAct as a sceptic. Please:\n1. Name the simplest option that might solve my measured problem without a split.\n2. List the costs in my situation under: network and failures, data consistency, operations, testing and versioning, people.\n3. Tell me what is most likely to go wrong first.\n4. Tell me what I would need to measure to prove the split is needed.\n5. Say what you cannot know from what I gave you.\n\nDo not quote cost savings or performance figures. If a figure matters, tell me what to measure instead.`,
      },
      { type: 'paragraph', text: `What to verify: any figure that slips into the answer needs a source or a measurement of your own. Check that the "simplest option" it names is really simple, and that each cost is about your situation and not a general list.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write the ledger for one split you have been tempted by, using the five questions, before you discuss it with your team (the practical challenge below).',
        'Next lesson, "Event-Driven Architecture: Events Instead of Calls", shows a way to reduce the cost of the network between parts.',
        'Read your cloud provider\'s current documentation on function limits and cold starts, and write the numbers that apply to you in your own notes, with the date.',
      ] },
      { type: 'takeaways', items: [
        'Microservices buy independent release, scaling and team ownership. They cost network failures, split data, operations, versioning and people.',
        'A distributed monolith pays for services and gets none of the independence.',
        'Serverless buys no server work and usage-based billing. It costs cold starts, limits, statelessness, connection pressure and lock-in.',
        'Justify a split with a measured problem, a stable boundary and a team that can run it.',
        'Always compare with the simpler option, and ask for the source of any figure.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-09-scenario-1',
          kind: 'scenario',
          title: 'The evening job slows the counter',
          prompt: 'Choose the response that fits the measured problem with the least cost.',
          concept: 'when to split',
          situation: 'TindaTrack is a modular monolith. Every evening the Reminders module builds the summary for each store. Measurements show that while it runs, saving a sale at the counter takes noticeably longer. The Reminders code is changed weekly by one developer, and the other modules are stable. Someone proposes making every module its own microservice "to isolate them".',
          options: [
            { text: 'Move only the evening job into a scheduled worker or function that reads through Inventory\'s interface. Keep every module in the monolith. Measure the sale time again.', consequence: 'The measured problem goes away at the cost of one small deployable. The rest of the system is unchanged, and you have a number to compare with.', quality: 'best' },
            { text: 'Reschedule the job to the quietest hour of the night and make it read from a copy of the database.', consequence: 'This is cheap and may solve it for now. It stops working when stores in other time zones join, but it is a sound first step while you measure.', quality: 'acceptable' },
            { text: 'Split all five modules into services so no module can slow another.', consequence: 'The slowdown might go, but you now run five services, five pipelines and a network for a problem caused by one job.', quality: 'poor' },
            { text: 'Accept the slowdown. Evening jobs are always slow and stores can wait.', consequence: 'The owner at the counter waits while customers watch. A measured problem with a cheap fix has been ignored.', quality: 'poor' },
          ],
          hints: [
            'What exactly was measured, and which part of the system causes it?',
            'Look for the option that changes the least while addressing that one part.',
            'Splitting everything is a solution to a problem you have not measured.',
          ],
          explanation: 'The problem is one job competing with the counter. The cheapest sufficient change moves that job out of the request path. A wider split pays the full cost of microservices to fix a narrow problem.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-09-match-1',
          kind: 'match',
          title: 'Which cost is this?',
          prompt: 'Match each symptom to the cost it reveals.',
          concept: 'costs of splitting',
          labels: { terms: 'What the team sees', meanings: 'The cost behind it' },
          pairs: [
            { term: 'A developer cannot reproduce a failed order without starting four services on a laptop', definition: 'Local development and testing cost across services', note: 'The flow needs several services, so running it means running them all.' },
            { term: 'Two services must always be released together and read the same database', definition: 'A distributed monolith: the cost of services without their independence', note: 'Independence is the point of services. Here it is missing.' },
            { term: 'The first request after a quiet hour is slow, and later ones are fast', definition: 'A cold start while the provider starts a new copy', note: 'The slow first request is the start-up wait, not a bug in the code.' },
            { term: 'After a traffic spike the database refuses connections although its CPU is low', definition: 'Many short-lived function copies each holding a database connection', note: 'The limit hit here is the number of connections, not computing power.' },
            { term: 'Placing an order is slow whenever the Notifications service is slow', definition: 'A synchronous call chain: the caller is as slow as everything it waits on', note: 'The caller waits for the receipt step even though the customer does not need it to finish.' },
          ],
          hints: [
            'Read the symptom and ask which part of the lesson\'s cost list would produce it.',
            'Two symptoms involve waiting. One waits for a start-up, the other waits for another service.',
            'One symptom is about the database and not the code: think about what a database limits.',
          ],
          explanation: 'Each symptom points to one cost on the ledger. Being able to name the cost is what lets you decide whether it is acceptable or worth a different design.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-09-q1',
        prompt: 'A team of five splits a delivery app into five services in its first month. Which cost should it expect first?',
        choices: [
          'Slower code, because services written in several languages always run slower than a single program.',
          'Only higher hosting bills, since smaller services are easier to work on and the developers\' daily work stays the same.',
          'More time spent on release pipelines, tracing a request across services and handling calls that fail or time out, taken from feature work.',
          'Fewer bugs overall, since each small service is easy to understand and the network forces clear contracts between them, so the team can spend its time on features.',
        ],
        answer: 2,
        explanation: 'The first bill is operational and in people\'s time: pipelines, tracing and failure handling. Smaller services do not remove the work of the connections between them.',
      },
      {
        id: 'software-architecture-ai-09-q2',
        prompt: 'Which work is the best fit for a serverless function?',
        choices: [
          'A job that runs briefly once an evening, can be retried, and that no user waits for.',
          'The checkout path of a busy store, which must answer fast every time and receives steady heavy traffic all day.',
          'A conversion job that runs for hours and keeps a large working set in memory the whole time.',
          'A service that holds a large cache in memory between requests so that later requests are fast.',
        ],
        answer: 0,
        explanation: 'Short, infrequent, retryable work that nobody waits for avoids the main costs: cold starts, limits and statelessness. The others hit time limits, response-time needs or the need for local state.',
      },
      {
        id: 'software-architecture-ai-09-q3',
        prompt: 'A team says its services "cannot be released on different days because they share one database and one release train". What is this?',
        choices: [
          'Microservices working as designed, because shared data is the normal way for services to stay consistent.',
          'A modular monolith, because it has boundaries and one place where the data is kept.',
          'A serverless design, because the release train is controlled by the provider and not by the team.',
          'A distributed monolith: it pays the network costs of services without the independent deployment that justifies them.',
        ],
        answer: 3,
        explanation: 'Independent release and owned data are what services are for. Without them the team has all the network costs and none of the benefit.',
      },
      {
        id: 'software-architecture-ai-09-q4',
        prompt: 'An assistant says serverless "will save about 70% and cold starts are negligible". What is the right response?',
        choices: [
          'Accept the figure, because the assistant has seen far more systems than any one team has.',
          'Ask for the inputs and the source of the figure, then measure cold starts and cost with your own workload.',
          'Reject serverless for good, since an assistant that gives a made-up figure cannot be trusted about the style.',
          'Ask for a more cautious figure, such as 40%, and use that in the plan so that the estimate is safe.',
        ],
        answer: 1,
        explanation: 'A figure without inputs or a source is a hypothesis at best. Measuring with your own workload is the only way to know. Rejecting the style on this basis, or asking for a "safer" invented number, repeats the same mistake.',
      },
      {
        id: 'software-architecture-ai-09-q5',
        audience: { max: 'beginner' },
        prompt: 'Splitting one big shop into many market stalls lets each stall run on its own. What is the price?',
        choices: [
          'Customers can only buy one thing at a time.',
          'The stalls need more floor space than one shop does.',
          'The stalls must talk to each other to finish an order, and one slow or closed stall delays every order that needs it.',
        ],
        answer: 2,
        explanation: 'The stalls are the services. Independence is gained, and the cost is coordination: every order that crosses stalls depends on all of them.',
      },
      {
        id: 'software-architecture-ai-09-q6',
        audience: { min: 'advanced' },
        prompt: 'Placing an order needs four services in a row, each usually available but not always. What does that say about the order flow?',
        choices: [
          'It is only available when all four are, so it is lower than the weakest one. Look at which calls can be made asynchronous or optional.',
          'It is as available as the least available service, because the other three keep working and the order simply waits until that one comes back up.',
          'It is higher than any single service, because if one is down the others can take over its work.',
          'It is the average of the four, so adding a stronger fifth service raises the overall figure.',
        ],
        answer: 0,
        explanation: 'In a chain every link must work, so the product of the availabilities is lower than any one of them. Reducing the number of required calls, or making some asynchronous, is the design response.',
      },
    ],
    task: {
      title: 'Write the ledger for a split you are tempted by',
      minutes: 15,
      steps: [
        'Pick a part of a system you work on (or TindaTrack\'s Reminders) that someone has suggested splitting out or moving to functions.',
        'Write the measured problem and its number today. If you have no number, write what you would measure and how.',
        'List what you would buy and what you would pay under: network and failures, data consistency, operations, testing and versioning, people.',
        'Answer the five questions from the lesson. Then choose: split now, delay with a named trigger, or a cheaper alternative. Write the trigger and the date you will look again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use a food-delivery app you use as the example. Guess which parts must work for one order to succeed, draw them as boxes and arrows, and count how many things can fail.'] },
      { audience: { min: 'advanced' }, steps: ['For your chosen part, write the timeout, retry and fallback behaviour each caller would need, and decide which calls can become asynchronous. Say which observability you would need in place before the split.'] },
    ],
  },
  {
    id: 'software-architecture-ai-10',
    day: 10,
    title: 'Event-Driven Architecture: Events Instead of Calls',
    summary: 'Learn when to announce a fact instead of calling a part directly, and what that costs in consistency and debugging.',
    intro: {
      objectives: [
        'Tell an event from a command and choose between an event and a direct call',
        'Explain eventual consistency and decide what must stay immediately consistent',
        'List the costs of event-driven design: hidden flow, duplicates, ordering and harder debugging',
      ],
      why: 'Events let a slow or failing part stop breaking the part that matters most. They also hide the flow of work, so you need to know the price before you adopt them.',
    },
    minutes: 24,
    skills: ['arch-styles'],
    body: [
      { type: 'paragraph', text: `In a direct design, part A calls part B and waits. In an **event-driven** design, A announces that something happened and carries on. Any part that cares reacts in its own time. A is not told who is listening, and does not wait. This is a different answer to the question lesson 9 left open: how parts can cooperate without every one of them depending on the others being up right now. It works inside a modular monolith as well as between services.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack has about 150 stores. When a cashier recorded a sale, the Sales code did five things in a row: save the sale, reduce stock, check for low stock, update the day's summary and, for wallet payments, text the owner. One evening the text provider had an outage. The text call threw an error, the whole "record sale" failed, and cashiers watched a spinner while customers waited with their goods. A sale had been blocked by a text message.` },
      { type: 'paragraph', text: `The fix was to save the sale first and publish one fact: SaleRecorded. Stock, low-stock checks, the summary and the text each reacted to it separately. The next outage delayed texts and nothing else. But there was a bill. A few weeks later one store stopped getting low-stock texts, and no call had failed anywhere in the sales path. The problem was a failing handler whose log nobody watched, and it took half a day to find which step had dropped the event.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Two words are easy to mix up. An **event** is a fact that has already happened, named in the past tense: SaleRecorded. It cannot be refused, because it is over. The sender does not know who listens, and there can be none, one or many receivers. A **command** is a request that something be done, named as an order: SendLowStockText. It goes to one chosen receiver, can be refused or fail, and the sender cares how it went.` },
      {
        type: 'table',
        headers: ['', 'Event', 'Command', 'Direct call'],
        rows: [
          ['Says', 'Something happened', 'Please do this', 'Do this and tell me the result'],
          ['Example name', 'SaleRecorded', 'SendLowStockText', 'getStockLevel(store, product)'],
          ['Receivers', 'None, one or many; sender does not know', 'One chosen receiver', 'One, and the caller waits'],
          ['If the receiver is down', 'Event waits; sender is not affected', 'Command waits or fails; sender decides', 'Caller fails or times out'],
          ['Use when', 'Others may care about a fact', 'You need one thing done, later is fine', 'You need the answer now'],
        ],
        caption: 'Choose by one question: does the sender need the result to continue? If yes, call. If it only needs the thing done, send a command. If it is announcing a fact, publish an event.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  actor Cashier
  participant Sales
  participant Bus as Event bus
  participant Inventory
  participant Reminders
  Cashier->>Sales: Record sale
  Sales->>Bus: SaleRecorded
  Sales-->>Cashier: Sale saved
  Bus->>Inventory: SaleRecorded
  Bus->>Reminders: SaleRecorded`,
        caption: 'Read from top to bottom, which is time. The cashier gets "Sale saved" before Inventory and Reminders have done anything. Adding a new receiver changes no line above it.',
      },
      { type: 'paragraph', text: `The event bus can be very small. Inside one modular monolith it can be a list of functions called in the same process (cheap, and a good first step). Between separate deployments it is a message broker, a service that holds messages until receivers take them. Lesson 23 covers delivery rules and queues in detail.` },
      { type: 'paragraph', text: `**What it buys.** Looser coupling: you add a new reaction without touching the sender. Protection from slow or failing receivers, because work waits instead of failing the caller. Smoothing of spikes, because receivers work at their own pace. And a natural record of what happened.` },
      { type: 'paragraph', text: `**What it costs.**` },
      { type: 'list', items: [
        '**Hidden flow.** No single place says "after a sale, these four things happen". The flow lives in subscriptions spread across the code.',
        '**Debugging.** A problem shows up far from its cause, often later. You need a correlation id that follows one request through every handler, and a way to see events waiting or failing.',
        '**Duplicates and order.** Most delivery setups promise at-least-once delivery, so a receiver may see the same event twice, and events may arrive out of order. Each handler must be safe to run twice (this is called being idempotent).',
        '**Eventual consistency.** Parts catch up later, so a screen can briefly disagree with another.',
        '**A contract.** The shape of an event is a promise to every receiver. Changing it can break people you do not know about.',
        '**Poison messages.** A message that always fails needs somewhere to wait for a person to look, usually called a dead-letter queue (lesson 23).',
        '**Another thing to run,** if you use a broker.',
      ] },
      { type: 'paragraph', text: `**Eventual consistency** means that after a change, different parts of the system reach the same view of it a little later, not at the same instant. It is fine for a daily summary and unacceptable for a payment. The working rule is to keep one thing's own correctness inside one transaction, and to use events between things. The sale and the payment that was taken are saved together before the cashier sees "saved". The summary and the stock alert may lag by seconds or minutes. Decide each one on purpose, and write down how long a lag the user can bear (the "measure" part of the quality scenarios in lesson 6).` },
      { type: 'paragraph', text: `Notice what event-driven design is not. It is not a requirement to use a broker, and it is not the same as event sourcing, a separate pattern that stores every change as the record of truth. You can have events without either. Start with the smallest bus that solves the problem you have measured.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: calling is like walking to a friend's desk, asking a question and standing there until they answer. An event is like ringing a bell in the office and saying "the sale is done!". Whoever needs to know hears it and does their part when they are free, and you carry on with your own work. The good side is that you do not wait for slow people. The hard side is that when something is missed, nobody was told to do it, so you have to look for who heard the bell and who did not. The price of the bell is that finding mistakes takes more detective work.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Two questions decide whether an event design is sound in production. First, the dual-write problem: saving a sale and publishing its event are two separate actions, and a crash between them leaves a sale with no event or an event with no sale. A common remedy is the transactional outbox: write the event into the database in the same transaction as the sale, then relay it afterwards, accepting duplicates. Second, ordering and schema: there is rarely a global order, only an order per key, so handlers must tolerate gaps, and an event schema needs a compatibility rule before the first receiver exists. Also choose between each part reacting on its own (choreography) and a coordinator that tells each part what to do (orchestration); the first hides the flow, the second shows it at the price of a central part.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant designs the stock update after a sale',
        prompt: `When TindaTrack records a sale, stock should drop and the owner should be warned if stock is low. We have about 150 stores and one developer. Design this using event-driven architecture.`,
        output: `Use event sourcing with CQRS. Store every change as an immutable event in a distributed log, and build separate read models for stock and alerts. Because events are delivered exactly once, your handlers do not need any duplicate checks. Add a schema registry and a saga orchestrator to coordinate the stock and alert steps. This guarantees that stock is always consistent across the system.`,
        notice: `Check each claim. "Exactly once" is a blanket promise. Many delivery setups promise at-least-once, and any exactly-once claim depends on narrow conditions, so handlers should survive a duplicate. "Always consistent" contradicts the idea of eventual consistency. And the answer reaches for event sourcing, CQRS (separate models for writing and reading data), a log, a registry and an orchestrator for one developer and about 150 stores, when saving the sale and publishing one in-process event would meet the stated requirement. Ask the assistant what delivery your own tools promise and what the smallest version would be.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take one flow in your own system that does several things after a main action. Decide which steps need the answer now and which could react later. Write that down first, then ask for a critic.` },
      {
        type: 'prompt',
        label: 'Critique my event design',
        text: `My flow: [describe the main action and the steps that follow it].\n\nMy decision: [which steps stay as direct calls and which become events or commands, with names].\nContext: [team size, deployment, whether I already have a queue or broker].\n\nAct as a critic. Please:\n1. For each step, say whether it needs its result to continue.\n2. For each receiver, say what happens if it is down for an hour, if it sees the same event twice, and if events arrive out of order.\n3. Say what the user would see lag, and for how long, and whether that is acceptable.\n4. Tell me how I would find a lost event.\n5. Say whether a simpler in-process approach is enough.\n\nDo not assume exactly-once delivery. Ask me what delivery my tools promise, and say what you cannot know.`,
      },
      { type: 'paragraph', text: `What to verify: whether the answer uses guarantees that your tools do not actually give, and whether each lag it accepts is one your users could live with. Check delivery promises in your tool's official documentation, not in the assistant's answer.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Trace one flow in a project you know and label every step "needs the result" or "a fact others may react to" (the practical challenge below).',
        'Next lesson, "Layered, Hexagonal and Clean Architecture", looks inside one component and asks which way its code should depend on other code.',
        'In lesson 23 you will return to queues, at-least-once delivery, idempotent consumers and dead-letter queues in detail.',
      ] },
      { type: 'takeaways', items: [
        'An event is a fact in the past tense; a command asks one receiver to act; a direct call needs the result now.',
        'Events protect the sender from slow or failing receivers, and let you add reactions without changing the sender.',
        'Costs: hidden flow, harder debugging, duplicates and ordering, eventual consistency, event contracts and poison messages.',
        'Keep each thing\'s own correctness in one transaction; use events between things, and state how long a lag is acceptable.',
        'Start with the smallest bus that solves a measured problem. An in-process bus is a valid first step.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-10-scenario-1',
          kind: 'scenario',
          title: 'A text message blocks a sale',
          prompt: 'Choose the change that addresses the cause.',
          concept: 'events versus calls',
          situation: 'In TindaTrack, "record sale" saves the sale, reduces stock and then sends the owner a text through an outside provider, all in one request. When the provider has an outage, the whole request fails and the sale is not saved. Cashiers are waiting with customers at the counter.',
          options: [
            { text: 'Save the sale first. Treat the text as a separate step, sent later and retried if it fails, through an event or a queued message.', consequence: 'Sales keep working through the outage. Texts are late, then sent. The team adds a way to see texts that keep failing.', quality: 'best' },
            { text: 'Keep the direct call but catch the error, so the sale is saved, and log the failed texts so someone can send them by hand.', consequence: 'Sales work during the outage. Failed texts depend on a person remembering to resend them, which will not happen reliably.', quality: 'acceptable' },
            { text: 'Retry the text provider up to ten times before saving the sale, in case the outage is short.', consequence: 'In a long outage every cashier waits through ten failed attempts before anything is saved. The sale is still tied to the text.', quality: 'poor' },
            { text: 'Stop sending texts for wallet payments so that the problem cannot happen.', consequence: 'The failure vanishes, along with a feature owners wanted. The coupling is still there for the next outside call.', quality: 'poor' },
          ],
          hints: [
            'What is the one step that must succeed for the cashier to carry on?',
            'The text is a side effect. Ask what should happen to it when the provider is down.',
            'Look for the option that separates the two steps in time and gives the text a way to be retried.',
          ],
          explanation: 'The cause is that a side effect sits in the same request as the sale. Saving first and sending later breaks that link, and a retry gives the text a path to arrive. Catching the error helps but leaves recovery to a person.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-10-match-1',
          kind: 'match',
          title: 'Problem and design response',
          prompt: 'Match each event-driven problem to the design response that fits.',
          concept: 'costs of events',
          labels: { terms: 'The problem', meanings: 'The response' },
          pairs: [
            { term: 'The same SaleRecorded event reaches a handler twice after a retry', definition: 'Make the handler idempotent, for example by recording the ids of events it has handled', note: 'Retries will happen, so the handler has to be safe to run twice.' },
            { term: 'The owner\'s daily total lags a few seconds behind the latest sale', definition: 'Accept eventual consistency where it is harmless, and keep the sale itself in one transaction', note: 'A short lag in a summary is acceptable. The sale and payment are not.' },
            { term: 'Nobody can tell which handler dropped an event', definition: 'Add a correlation id and log when each handler receives and finishes the event', note: 'The flow is spread out, so something must tie its steps together.' },
            { term: 'One malformed event makes a handler fail and retry forever', definition: 'Set it aside in a dead-letter queue after a few attempts for a person to inspect', note: 'A message that always fails should not block the others.' },
          ],
          hints: [
            'Ask which cost from the lesson each problem is an example of.',
            'Two problems are about visibility, and two are about the same message arriving more than once or never succeeding.',
            'The lag problem is not a bug: it is a property you decide to accept or not.',
          ],
          explanation: 'Each response matches one cost of events. A team that has a response ready for each of these has paid the price of event-driven design on purpose.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-10-fill-blank-1',
          kind: 'fill-blank',
          title: 'Name the message',
          prompt: 'Fill each blank with the word that fits.',
          concept: 'events and commands',
          language: 'text',
          code: `A(n) ___ says something already happened and is named in the past tense, such as SaleRecorded.
A(n) ___ asks one chosen receiver to do something and can be refused, such as SendLowStockText.
When a receiver may see the same event twice, make its handler ___.`,
          blanks: [
            { answers: ['event'], feedback: 'The past tense is the clue: a fact that already happened is an event.' },
            { answers: ['command'], feedback: 'It is a request to one receiver, and a request can be refused.' },
            { answers: ['idempotent'], feedback: 'Running it twice must have the same effect as running it once.' },
          ],
          bank: ['event', 'command', 'idempotent', 'synchronous', 'cached'],
          hints: [
            'Read the example name in each sentence. Is it a fact or an order?',
            'The first two blanks are opposites. The last one describes what happens when a message arrives twice.',
            'The last word means "safe to repeat".',
          ],
          explanation: 'Events are facts, commands are requests, and handlers that may see repeats must be idempotent. These three terms carry most of the design vocabulary of this style.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-10-q1',
        prompt: 'A developer publishes a message named ReduceStock for any module to react to. What is the problem with it?',
        choices: [
          'Messages should be named in capital letters so that they can be told apart from ordinary function calls.',
          'Events should carry as much data as possible, and ReduceStock is probably missing the product details.',
          'Nothing is wrong: any message that causes a change can be published to every module that might care about it.',
          'It is a command published as if for many. Publish the fact (SaleRecorded) and let Inventory react, or send ReduceStock to Inventory directly.',
        ],
        answer: 3,
        explanation: 'An event states a fact and does not tell receivers what to do. A command names one receiver. Mixing the two leaves it unclear who must act and who owns the decision.',
      },
      {
        id: 'software-architecture-ai-10-q2',
        prompt: 'The cashier\'s "record sale" fails whenever the text provider is down. Which change addresses the cause?',
        choices: [
          'Buy a more reliable text provider so that outages become rare enough that no design change is needed.',
          'Save the sale first and send the text as a separate step that is retried later.',
          'Add a longer timeout to the text call so that short outages are survived while the cashier waits.',
          'Put the text call inside a database transaction with the sale, so both succeed or both fail together.',
        ],
        answer: 1,
        explanation: 'The cause is a side effect tied to the main action. Separating them in time fixes it for every outage. A better provider, a longer wait or a shared transaction all keep the sale dependent on the text.',
      },
      {
        id: 'software-architecture-ai-10-q3',
        prompt: 'Which data should stay immediately consistent rather than eventually consistent?',
        choices: [
          'The sale and the payment that was taken, saved together before the cashier sees "Sale saved".',
          'The daily summary for the owner, which should always show the exact total of the second it is opened.',
          'A low-stock text, which must go out in the same instant that the quantity changes.',
          'A weekly sales chart, which must be updated by the same transaction that records each sale.',
        ],
        answer: 0,
        explanation: 'A sale and its payment are one fact and must succeed or fail together. Summaries, alerts and charts can lag by seconds or minutes without harm, so they can be updated by events.',
      },
      {
        id: 'software-architecture-ai-10-q4',
        prompt: 'A handler sometimes receives the same event twice. What is the sound response?',
        choices: [
          'Rely on the broker\'s promise of exactly-once delivery and remove the duplicate checks to keep the code simple.',
          'Allow only one handler to exist for each event, so that no event can ever be handled twice.',
          'Make the handler safe to run twice, for example by recording the ids of events it has processed.',
          'Ask the sender never to retry, so that the same event is published once.',
        ],
        answer: 2,
        explanation: 'Many setups deliver at-least-once, so duplicates happen. A handler that is safe to repeat is the reliable defence. Trusting a blanket promise, limiting handlers or forbidding retries all fail when a duplicate arrives.',
      },
      {
        id: 'software-architecture-ai-10-q5',
        audience: { max: 'beginner' },
        prompt: 'Ringing a bell to say "the sale is done!" instead of walking to each person. What is the hard part of this style?',
        choices: [
          'The bell is very loud and disturbs the office.',
          'When something is missed, nobody was told to do it, so you have to find who heard the bell and who did not.',
          'The people who hear the bell must all be sitting at the same desk.',
        ],
        answer: 1,
        explanation: 'The bell is the event. The sender does not know who reacted, so finding a missed step takes more investigation than following a direct call.',
      },
      {
        id: 'software-architecture-ai-10-q6',
        audience: { min: 'advanced' },
        prompt: 'The app saves a sale, then publishes SaleRecorded. It crashes between the two steps. What is the risk, and a common remedy?',
        choices: [
          'The event is published twice. Remove duplicates by giving every event a time stamp that receivers compare.',
          'Nothing is lost, because receivers poll the database and will find the sale regardless of the event.',
          'Both steps will be rolled back, since a crash always undoes work that was started in the same request.',
          'A sale exists with no event. Record the event in the same transaction as the sale and relay it afterwards (a transactional outbox).',
        ],
        answer: 3,
        explanation: 'Saving and publishing are two actions, so a crash between them loses the event. Recording the event in the same transaction makes the pair atomic, and a relay then publishes it, which can lead to duplicates that handlers must tolerate.',
      },
    ],
    task: {
      title: 'Trace a flow and label each step',
      minutes: 15,
      steps: [
        'Pick one flow in a project you know (placing an order, recording a sale, signing up) and list every step that happens after the main action, in order.',
        'Label each step "needs the result now" or "a fact others may react to". Give each event a past-tense name and each command an order-style name.',
        'For each receiver, write what happens if it is down for an hour, and what happens if it sees the same event twice.',
        'Write which screen would show data that lags, how long a lag is acceptable, and how you would find a lost event.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use a food-ordering app as the flow. Mark which steps the customer must wait for (payment accepted) and which can happen later (a receipt email, a loyalty update).'] },
      { audience: { min: 'advanced' }, steps: ['Decide whether the flow should use choreography or orchestration and write the cost of your choice. Sketch where the outbox would sit and how events are versioned before the first consumer is added.'] },
    ],
  },
  {
    id: 'software-architecture-ai-11',
    day: 11,
    title: 'Layered, Hexagonal and Clean Architecture',
    summary: 'Learn which way code inside one component should depend on other code, what ports and adapters buy, and when they are ceremony.',
    intro: {
      objectives: [
        'Explain the dependency rule and how a port and an adapter apply it',
        'Compare layered, hexagonal and Clean Architecture, and see what they share',
        'Decide where ports earn their cost and where they are ceremony',
      ],
      why: 'Business rules are the part of a system you most want to keep stable and testable. These styles protect them from the parts that change most: databases, frameworks and outside providers.',
    },
    minutes: 26,
    skills: ['arch-styles'],
    body: [
      { type: 'paragraph', text: `Lessons 8 to 10 asked how many deployable pieces a system should have and how they talk. This lesson looks inside one piece and asks a different question: which way should code depend on other code? Three well-known answers are close relatives. **Layered** architecture stacks code in layers. **Hexagonal** architecture, also called ports and adapters, puts business rules in the middle and everything else around them. **Clean Architecture** is the same core idea drawn as circles. All three apply inside a monolith, a module or a service.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack's low-stock rule lived in one function. It built SQL strings, called the text provider's software kit and decided whether stock was low, all in the same place. When the provider raised its prices, Marites wanted to switch. Switching meant changing that function, the summary function and the payment reminders, because each called the kit directly.` },
      { type: 'paragraph', text: `The tests were worse. To check one rule, "low means at or below the reorder point", a test needed a running database and a fake text server. The tests were slow and failed at random, so developers stopped running them. The rule was simple. It was tied to things that were not.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Layered architecture** is the version most developers already know: screens and API on top, business logic below them, data access below that, then the database. Each layer calls only the layer under it. It is simple, familiar, and makes things easy to find. For many applications it is enough. Its cost is the direction of the arrows. They point down, toward the database, so the business logic depends on the data layer. A change in the data layer can ripple upward, and a test of the business rules needs the database. Layers also get skipped when it is convenient, and a layer that only passes calls through adds code without adding clarity.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Screens and API] --> B[Business logic]
  B --> C[Data access]
  C --> D[(Database)]`,
        caption: 'Classic layers. Every arrow points down toward the detail. The business logic cannot be used or tested without the layers beneath it.',
      },
      { type: 'paragraph', text: `The next idea turns the arrows around. The **dependency rule** says: source code dependencies point toward the business rules, never away from them. The business code does not import the database library, the web framework or a provider's software kit. How does it use a database, then? It declares what it needs as an interface, written in its own words. That interface is a **port**. Code outside the core supplies an **adapter** that implements the port. The core depends on the port, which it owns. The adapter depends on the core, not the other way around.` },
      { type: 'paragraph', text: `**Hexagonal architecture** (ports and adapters, from Alistair Cockburn) is this idea with names. The core holds the business rules. Some ports are *driving*: the way the outside world asks the core to do work, such as a RecordSale use case that a web route calls. Other ports are *driven*: what the core needs from outside, such as a StockRepository or a TextSender. Adapters sit on the outside: a web route, a PostgreSQL repository, the adapter for the text-message (SMS) provider, and a simple in-memory version used in tests.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `classDiagram
  class CheckLowStock {
    +run(storeId, productId)
  }
  class StockRepository {
    <<interface>>
    +getLevel(storeId, productId)
  }
  class TextSender {
    <<interface>>
    +send(phone, message)
  }
  class PostgresStockRepository
  class InMemoryStockRepository
  class SmsTextSender
  CheckLowStock --> StockRepository
  CheckLowStock --> TextSender
  StockRepository <|.. PostgresStockRepository
  StockRepository <|.. InMemoryStockRepository
  TextSender <|.. SmsTextSender`,
        caption: 'Look at who points at whom. The use case depends only on the two interfaces. The database and the SMS code depend on the interfaces too. Nothing in the use case names Postgres or a provider.',
      },
      { type: 'paragraph', text: `**Clean Architecture** (from Robert C. Martin) draws the same rule as four circles. In the centre are entities: rules that hold for the whole business. Around them are use cases: the rules of one application task. Then interface adapters, which convert data between the use cases and the outside. Outermost are frameworks and drivers: the database, the web, devices. One rule governs the picture: dependencies point inward only. Hexagonal and Clean Architecture differ in vocabulary and drawing, not in the core move. Pick one vocabulary for your team and use it consistently.` },
      { type: 'paragraph', text: `Here is what it looks like in code. The port is written by the core, the use case imports nothing from outside the core, and a test supplies simple fakes:` },
      {
        type: 'code',
        language: 'typescript',
        label: 'Ports and a use case (fragment: two files shown together)',
        code: `// core/ports.ts: written by the business code, implemented elsewhere
export interface StockRepository {
  getLevel(storeId: string, productId: string): Promise<number>;
}
export interface TextSender {
  send(phone: string, message: string): Promise<void>;
}

// core/check-low-stock.ts: imports nothing from outside the core
import type { StockRepository, TextSender } from './ports';

export async function checkLowStock(
  deps: { stock: StockRepository; texts: TextSender },
  input: { storeId: string; productId: string; reorderPoint: number; ownerPhone: string },
): Promise<boolean> {
  const level = await deps.stock.getLevel(input.storeId, input.productId);
  if (level > input.reorderPoint) return false;
  await deps.texts.send(input.ownerPhone, 'Stock is low: ' + level + ' left.');
  return true;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        label: 'A test with no database and no network (fragment)',
        code: `async function lowStockSendsOneText() {
  const sent: string[] = [];
  const stock = { getLevel: async () => 3 };
  const texts = { send: async (_phone: string, message: string) => { sent.push(message); } };

  const result = await checkLowStock(
    { stock, texts },
    { storeId: 's1', productId: 'p1', reorderPoint: 5, ownerPhone: '+63000000000' },
  );
  // result is true and sent holds one message.
}`,
      },
      { type: 'paragraph', text: `**What it buys.** Rules you can test in milliseconds, with fakes. The freedom to change a database or a provider by writing one adapter. A framework that does not own your rules. And the ability to delay decisions: start with the in-memory adapter and add the database when you need it.` },
      { type: 'paragraph', text: `**When it is ceremony.** It costs more files, a level of indirection, mapping between layers, and a concept for every new developer to learn. A Catalog screen that lists and edits products, has no business rules and will always sit on one database gains nothing from a port. A port with one implementation, in a place where no test needs a fake, is ceremony. A team that cannot say which rule is being protected is copying a diagram. A sensible use: put ports at the edges that are likely to change or painful to test, such as the text provider, the e-wallet and the database, around rules worth protecting. Leave plain CRUD (create, read, update, delete) modules plain. In TindaTrack that means Payments and Reminders get ports, and Catalog does not. This also combines with lesson 8: each module can have its own inside shape.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a lamp does not care whether its power comes from the city or from a generator. It needs a standard socket. A port is that socket, and an adapter is the plug that fits it. In the code above, checkLowStock says "I need something that can tell me a stock level and something that can send a text". It never says Postgres or which phone company. In a test, we hand it two tiny fakes, so it runs without any real database or network. In production, the same function gets the real ones. The rule stays in one place and never has to change when the plugs change.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `The common failures are not in the diagram. ORM (object-relational mapper) entities leak into the core, so its types are shaped like tables. Ports mirror the schema: a repository per table with a method per column, which gives the cost of hexagonal design and none of its protection. Folders are named domain, application and infrastructure while the imports still point outward, which is the look of the architecture without the rule. And transactions: where does the boundary of a transaction live when two ports must change together? A unit-of-work port is one answer; a use case that owns one transaction is another. Treat the dependency rule as something a test can check (import rules or architecture tests, module 11) so it does not erode. A module's public interface in a modular monolith is itself a driving port.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant refactors the low-stock function to Clean Architecture',
        prompt: `Refactor TindaTrack's checkLowStock function to follow Clean Architecture. It currently queries PostgreSQL and sends a text through our SMS provider's software kit.`,
        output: `Create four layers: domain, application, infrastructure and presentation. Every class gets an interface so the code is fully decoupled: UserRepositoryInterface, ProductRepositoryInterface, StockRepositoryInterface, TextSenderInterface, ClockInterface.\n\n// application/use-cases/check-low-stock.ts\nimport { Pool } from 'pg';\nimport { StockRepositoryInterface } from '../../domain/repositories/stock-repository-interface';\n\nexport class CheckLowStockUseCase {\n  constructor(private pool: Pool, private stock: StockRepositoryInterface) {}\n}`,
        notice: `Two flaws. First, the use case imports Pool from the pg database library: the core now depends on a detail, so the boundary the layers were meant to protect has leaked, and the dependency rule is broken. Second, an interface for everything, including a user and a clock that this function never uses, is the ceremony the lesson warned about. Ask the assistant to list every import in the core and say which point outward, and to justify each interface by the rule or test it protects.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Look at one file in your own code that holds a business rule. List its imports, and decide which of them are outside things (a database library, a framework, a provider's kit) and which port you would add. Write that down before you ask.` },
      {
        type: 'prompt',
        label: 'Review my dependency direction',
        text: `Here is the list of imports of one file that holds a business rule in my system: [paste the import lines].\n\nThe rule it implements: [one sentence].\nMy plan: [which ports I would define and which adapters would implement them].\n\nAct as a critic. Please:\n1. Mark each import as inside the core or outside it, and say which ones break the dependency rule.\n2. For each port I planned, say what rule or test it protects, or say that it looks like ceremony.\n3. Tell me which one test I could write without any database or network once the ports exist.\n4. Say where my plan might add indirection with no benefit.\n5. Say what you cannot know without seeing the code.\n\nDo not add a port for anything I did not list unless a stated rule or test needs it.`,
      },
      { type: 'paragraph', text: `What to verify: open the file yourself and confirm every import the assistant marks as outside. Then check whether the test it describes could really run with no infrastructure. If it recommends more ports than you planned, ask what each one protects.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Pick one business rule in a project you know and find the lines that tie it to a database, a framework or a provider (the practical challenge below).',
        'Next lesson, "Choosing a Style: A Decision Method You Can Defend", brings all four lessons of this module together in one method.',
        'In module 11 you will see how to check the dependency rule automatically so that a coding agent cannot break it quietly.',
      ] },
      { type: 'takeaways', items: [
        'The dependency rule: source code dependencies point toward the business rules, never away from them.',
        'A port is an interface the core owns; an adapter outside the core implements it.',
        'Layered, hexagonal and Clean Architecture share this move and differ in vocabulary and drawing.',
        'Ports buy fast tests and cheap changes of databases and providers. They cost files, indirection and learning.',
        'Put ports at the edges that change or hurt to test, around rules worth protecting. Leave plain CRUD plain.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-11-scenario-1',
          kind: 'scenario',
          title: 'The core that imports the database',
          prompt: 'Choose the best response to the code review.',
          concept: 'dependency rule',
          situation: 'A pull request puts the low-stock rule in core/check-low-stock.ts. The first line of the file is import { Pool } from \'pg\', and the function runs the SQL query itself. The author says it was quicker than adding an interface. The same rule will soon be needed by the summary, and the team wants to test it without a database.',
          options: [
            { text: 'Define a StockRepository port in the core, in the core\'s own words. Move the SQL into an adapter that implements it, and have the use case receive it.', consequence: 'The rule no longer names Postgres, so the summary can reuse it, and a test can pass a fake that returns a number.', quality: 'best' },
            { text: 'Keep the import for now, add a note, and introduce the port the first time a second reader or a test fake is actually needed.', consequence: 'This is cheaper today, but the team has stated that it wants tests without a database. Doing it later means rewriting the function and its callers.', quality: 'acceptable' },
            { text: 'Add an interface for every class in the project so that the code is consistently decoupled, starting with the pure functions.', consequence: 'There are now dozens of interfaces with one implementation each, and nobody can say what any of them protects.', quality: 'poor' },
            { text: 'Approve it. Imports are an implementation detail and the rule works.', consequence: 'The rule works until the database changes, and every test still needs a database. The review let the core depend on a detail.', quality: 'poor' },
          ],
          hints: [
            'Which direction does the arrow point between the rule and the database library?',
            'The team wants two things: reuse in the summary and tests without a database. Which option gives both?',
            'An interface only earns its place if a rule or test needs it.',
          ],
          explanation: 'The port makes the rule independent of the database and gives the test a seam. Waiting is a defensible compromise, but here the need is already stated. Interfaces for everything is the ceremony the lesson warned about.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-11-match-1',
          kind: 'match',
          title: 'Find the role',
          prompt: 'Match each piece of TindaTrack code to its role.',
          concept: 'ports and adapters',
          labels: { terms: 'The code', meanings: 'Its role' },
          pairs: [
            { term: 'PostgresStockRepository', definition: 'A driven adapter: implements a port by using the database', note: 'It does the outside work that the core asked for.' },
            { term: 'The StockRepository interface in core/', definition: 'A driven port: what the core needs, written by the core', note: 'It lives in the core and states a need, not a technology.' },
            { term: 'A web route that calls the RecordSale use case', definition: 'A driving adapter: turns an outside request into a call on the core', note: 'It goes from the outside in, which is the driving direction.' },
            { term: '"Stock is low when the quantity is at or below the reorder point"', definition: 'A business rule: lives in the core and knows no database or provider', note: 'It is a rule about the business, not about any technology.' },
            { term: 'InMemoryStockRepository used in tests', definition: 'A second driven adapter that lets the core run with no database', note: 'It implements the same port with a list in memory.' },
          ],
          hints: [
            'Ask whether the code is written by the core, or written outside it to plug into the core.',
            'Driving adapters call into the core. Driven adapters are called by the core through a port.',
            'The rule about reorder points names no technology at all.',
          ],
          explanation: 'Ports belong to the core and say what it needs. Adapters live outside and plug in, either to ask the core to work (driving) or to do work for it (driven). The rule itself stays free of both.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-11-arrange-1',
          kind: 'arrange',
          title: 'Introduce a port safely',
          prompt: 'Put the steps in the order that moves a rule off a database without breaking the app.',
          concept: 'dependency inversion',
          language: 'text',
          solution: [
            'Find where the rule calls the database or provider directly',
            'Write an interface in the core, in the core\'s own words',
            'Change the rule to receive that interface instead of the library',
            'Move the SQL or provider code into an adapter that implements the interface',
            'Write a test that uses an in-memory fake instead of the real adapter',
          ],
          reasons: [
            'You need to see exactly which outside calls the rule makes.',
            'The port describes what the rule needs, so it is written before anything else changes.',
            'The rule now depends on the port and no longer imports the outside library.',
            'The old code is not deleted, only moved behind the interface.',
            'The test proves the seam works and shows the benefit.',
          ],
          hints: [
            'You cannot move code behind an interface that does not exist yet.',
            'The test is last, because it uses the interface and the fake that the earlier steps created.',
            'The rule must be changed to use the port before the old code can leave it.',
          ],
          explanation: 'Find the outside call, name the need, make the rule depend on the need, move the old code behind it, and prove it with a fake. Each step leaves the app working.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-11-q1',
        prompt: 'In a layered app, the business layer imports the data access layer. What is the main cost?',
        choices: [
          'A change in the database code can ripple up into the business code, and testing the rules needs the database.',
          'The app can no longer be deployed as a single unit, because each layer has to be built, versioned and released separately from the others.',
          'Calls are slower, because each call passes through every layer in turn before it reaches the database.',
          'The business rules cannot be reused by a second screen, because layers are tied to one user interface.',
        ],
        answer: 0,
        explanation: 'The arrows point toward the detail, so the rules depend on the data layer. Changes there ripple upward and tests need a database. Deployment, speed and screen reuse are not the problem.',
      },
      {
        id: 'software-architecture-ai-11-q2',
        prompt: 'In hexagonal architecture, who writes the TextSender interface and who implements it?',
        choices: [
          'The SMS provider writes it and the core implements it, so the core can send texts in the provider\'s format.',
          'The web framework writes it and the database adapter implements it, because texts are saved before they are sent.',
          'The core writes it in its own words, and an adapter outside the core implements it with the provider.',
          'Both are written by the adapter, and the core imports them as a normal library to send texts.',
        ],
        answer: 2,
        explanation: 'The core owns the port, so it states the need without naming a provider. The adapter depends on the core. That reverses the usual arrow and is the point of the rule.',
      },
      {
        id: 'software-architecture-ai-11-q3',
        prompt: 'Which part of TindaTrack gains the least from ports and adapters?',
        choices: [
          'Payments, which talk to an e-wallet provider that may change and must be tested without real money.',
          'A Catalog screen that lists and edits products, with no business rules and one database for good.',
          'Reminders, which depend on a text provider and have rules about when to send.',
          'The stock rules, which should be testable in milliseconds without starting a database.',
        ],
        answer: 1,
        explanation: 'A plain CRUD module has no rule to protect and no likely change at its edge, so a port is ceremony. The other three each have a rule worth protecting or a provider likely to change.',
      },
      {
        id: 'software-architecture-ai-11-q4',
        prompt: 'A team has folders named domain, application and infrastructure, but a file in domain imports the database library. What do they have?',
        choices: [
          'Clean Architecture in full, because the folder names are the architecture and imports are details.',
          'A hexagonal design, because any code that has an infrastructure folder uses ports and adapters.',
          'A layered design with one small mistake that does not change what the structure achieves.',
          'The folder names of Clean Architecture without its dependency rule: the core still depends on a detail.',
        ],
        answer: 3,
        explanation: 'The value is in the direction of the dependencies, not the folder names. A core that imports a database library has the cost of the structure and none of the protection.',
      },
      {
        id: 'software-architecture-ai-11-q5',
        audience: { max: 'beginner' },
        prompt: 'A lamp needs a standard socket and does not care where power comes from. In the code, what is the socket?',
        choices: [
          'The database, which provides the data that every other part needs.',
          'The user interface, because it is the part that people plug into.',
          'A port: an interface the business code defines, which any matching adapter can plug into.',
        ],
        answer: 2,
        explanation: 'The socket is the port. The business code states what it needs, and any adapter that fits can supply it, so the real one and a test fake are interchangeable.',
      },
      {
        id: 'software-architecture-ai-11-q6',
        audience: { min: 'advanced' },
        prompt: 'Which is a sign that ports have been overdone in a system?',
        choices: [
          'Business rules have unit tests that run without a database or a network.',
          'The same provider adapter is reused by two use cases that both send texts.',
          'Every business rule has a port, and every port has exactly one implementation and no test that ever substitutes a fake for it.',
          'A module\'s public interface is treated as a driving port for the rest of the system.',
        ],
        answer: 2,
        explanation: 'Ports that mirror the schema protect no rule and are not needed by any test, so they add files and indirection without benefit. The other three are what ports are meant to give.',
      },
    ],
    task: {
      title: 'Find the arrows that point the wrong way',
      minutes: 18,
      steps: [
        'Pick one file in a project you know that holds a business rule, and list its imports.',
        'Mark each import as inside the core or outside it (a database library, a framework, a provider\'s kit). These are the arrows that point the wrong way.',
        'For one outside import, write the interface the core would need, in the core\'s own words, with no technology named.',
        'Describe the test you could now write with a fake and no infrastructure. Then decide honestly whether the port is worth it here, and why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you have no rule-heavy project, take the checkLowStock code from this lesson and run the test snippet in your own editor. Change the fake stock level to 10 and predict what happens before you run it.'] },
      { audience: { min: 'advanced' }, steps: ['Write one import rule or architecture test that would fail if a file in the core imported the database library. Describe where transactions would live for a use case that must change stock and record a sale together.'] },
    ],
  },
  {
    id: 'software-architecture-ai-12',
    day: 12,
    title: 'Choosing a Style: A Decision Method You Can Defend',
    summary: 'Use a six-step method to compare styles on evidence, treat close results honestly, and know how to change course safely.',
    intro: {
      objectives: [
        'Apply a six-step method that turns requirements into a recorded, defensible style choice',
        'Recognise a result that is too close to call and settle it by reversibility or a small experiment',
        'Describe how the Strangler Fig pattern lets you move away from a style one slice at a time',
      ],
      why: 'Architecture arguments are often won by seniority or fashion. A method makes the reasoning visible, so a team can agree, challenge it later and change it when the facts change.',
    },
    minutes: 26,
    skills: ['arch-styles'],
    body: [
      { type: 'paragraph', text: `You now know the main shapes: the monolith and the modular monolith, microservices, serverless, event-driven designs, and three ways to arrange code inside one piece. Knowing the options is not the same as choosing between them. This lesson gives you a method you can defend to a team, to a client and to yourself six months later. It also teaches the habit that matters most in this module: start simple, and split when a measured reason appears.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Two TindaTrack developers argued for forty minutes. Paolo wanted microservices "because that is what scales". Marites wanted to keep the modular monolith "because it works". Neither had written down what TindaTrack had to do next. The argument ended when the one with more seniority said "fine, we will try it", and nobody was convinced.` },
      { type: 'paragraph', text: `A week later they tried again with a method. The first step ended the argument: the next quarter needed multi-store accounts and e-wallet payments for about 200 stores, with a team of three and nobody on call at night. They scored three options, saw that two were too close to call, and decided by a different rule: which option was cheapest to reverse. They kept the modular monolith, wrote down the measured condition that would make them look again, and moved on. The decision was not different from Marites' first instinct. What changed is that it could now be checked.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The method has six steps. Each one produces something you can write down.` },
      { type: 'list', ordered: true, items: [
        '**State the requirements and constraints.** Use the quality attribute scenarios from lesson 6 (stimulus, environment, response and a measure) so that "good" has a number or a test. Add the constraints: team size and skills, who is on call, budget, deadline and rules you must follow. Nothing can be judged against "it should scale".',
        '**List two to four realistic options.** Always include the simplest one that could work, and the current system if there is one. An option nobody on the team could operate is not an option.',
        '**Choose the criteria and weight them.** Criteria are the qualities that matter for this system, plus cost to build and run, and how easy the option is to reverse. A weight says what hurts most if it is missed. Weights are judgements, so write down who set them and why.',
        '**Score every option against every criterion, with a reason.** A score with no reason is a feeling. Prefer evidence: a measurement, a prototype, a past incident, the team\'s real experience.',
        '**Check the margin and the sensitivity.** If the totals are close, the difference is noise. Change one weight and see whether the order changes. If it does, you have not found a winner. You have found where the disagreement is.',
        '**Decide, record and set a trigger.** Write a decision record (the habit from lesson 4; lesson 37 returns to comparing alternatives), including the options you rejected. Add a trigger: the measured condition that would make you look again.',
      ] },
      { type: 'visual', id: 'arch-tradeoff-matrix', caption: 'Score a monolith, a modular monolith and microservices for TindaTrack with your own weights. Then change one weight and watch whether the order moves.' },
      { type: 'paragraph', text: `A close result is common, and it is useful. When the matrix says "too close to call", do not build a bigger spreadsheet. Settle it in one of two ways. Prefer the option that is easier to reverse: moving a real module out of a modular monolith is a project of weeks; folding many services back together is a larger one. Or run a small experiment on the riskiest part, a prototype or a load test with a clear question, and let the result decide. An honest "we cannot tell yet, so we keep the cheap, reversible option" is a good architectural decision.` },
      { type: 'paragraph', text: `This is where "start simple, split when a measured reason appears" comes from. A **measured reason** is a number from your own system or test that breaks one of the scenarios from step 1, or a record that shows a recurring cost. "We might need to scale" is not one. "The evening report pushes the time to save a sale past our target" is. The measured reason becomes the trigger in step 6, so the decision comes with its own review.` },
      { type: 'paragraph', text: `Styles also combine, and that is normal. A likely answer for TindaTrack is a modular monolith, events inside the process, one scheduled function for the nightly job and ports at the e-wallet edge. A style is a tool for a part of the system, not a label for the whole.` },
      { type: 'paragraph', text: `What if you do outgrow a choice? You do not rewrite. The **Strangler Fig** pattern, named after the vines that slowly grow around a host tree, moves the system a slice at a time. Put a thin router in front of the old system. Build one slice in the new place. Send that slice's traffic to it and watch the numbers. Repeat, and retire the old parts when nothing is left in them. At every step you can point a slice back to the old code.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Store owners and the app] --> B{Router}
  B -->|everything else| C[Existing TindaTrack app]
  B -->|extracted slice| D[New reports component]
  C --> E[(Existing database)]
  D -.->|reads through an interface| C`,
        caption: 'The router is the point of the pattern: slices move behind it and the app\'s users do not notice. Look at the dashed line. The hardest part of a real move is how the new slice gets its data while both run.',
      },
      { type: 'paragraph', text: `The pattern has costs too. The router is one more thing to run. Both systems run at the same time for a while. And the data a slice needs must be shared or copied during the move, which is where most of the work is. It is still far safer than a rewrite, because you move one slice, measure it, and can go back.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: choosing an architecture is like choosing how to get to work. You would not just pick what a friend likes. First you write what the trip needs: distance, budget, time, whether it rains. Then you compare a few real options, including the simple one (walking or a jeepney). If two options come out about the same, you take the cheaper one that is easiest to change, because you can switch next month. A matrix is just a table that helps you compare fairly, and a decision record is the note you leave so you remember why you chose.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Weighted scoring fails in predictable ways. Weights get set after the favourite is known. Two criteria that measure the same thing are both included, which double counts it. Scores of 4.1 against 3.9 are read as differences when they are inside the error of the judgements. Unknowns are scored as if known, so record a confidence next to each score and use ranges. Test sensitivity by moving each weight, and look at which scores carry the result. Under real uncertainty, compare the cost of waiting with the cost of a wrong choice, time-box the experiment, and involve the people who will operate the system. Give every decision a review date. Module 12 turns triggers into automatic checks called fitness functions.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant scores three styles for TindaTrack',
        prompt: `Score microservices, a modular monolith and serverless for TindaTrack against scalability, cost, team fit and deployment speed. Give weights, scores and a recommendation.`,
        output: `Weights: scalability 30%, cost 20%, team fit 20%, deployment speed 30%.\n\nTotals out of 5: Microservices 4.2, Modular monolith 4.1, Serverless 3.6.\n\nWinner: microservices. Industry benchmarks show microservices improve deployment frequency by 40%, so the extra operating cost is easily justified.`,
        notice: `Three flaws. A difference of 0.1 between 4.2 and 4.1 is inside the error of any judgement, so "winner" is not supported: it is too close to call. The "industry benchmarks" and "40%" are a figure with no source, presented as a fact. And the criteria were not taken from TindaTrack's requirements, and leave out how easy each option is to reverse. Ask for a reason behind every score, ask what changes if each weight moves one step, and ask for the figure's source or tell the assistant to leave it out.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Do steps 1 to 4 yourself first, for a real decision. Write your scenarios, your options, your weights and your scores with reasons. Then use an assistant only to attack your work.` },
      {
        type: 'prompt',
        label: 'Attack my decision matrix',
        text: `I am choosing between [option A, option B, option C] for [system, one sentence].\n\nRequirements as scenarios: [list, each with a measure].\nConstraints: [team size and skills, who is on call, budget, deadline].\nMy weights and why: [list].\nMy scores and a reason for each: [list].\n\nAct as a critic. Please:\n1. Find any score with a weak or missing reason.\n2. Say which weights seem to favour my preferred option.\n3. Tell me which criteria might be counted twice.\n4. Say what happens to the order if each weight moves one step.\n5. Tell me which option is easiest to reverse, and what small experiment would settle a close result.\n\nDo not pick a winner. Do not use any figure that I did not give you; if you think a number matters, tell me what to measure.`,
      },
      { type: 'paragraph', text: `What to verify: whether the assistant's challenges are about your own numbers and reasons, or about generic ideas. Make the sensitivity check yourself in the matrix. The decision stays with you and your team.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Run the six steps on one real or recent decision in your own work, and write down the trigger (the practical challenge below).',
        'Next module starts with "Decomposing a System: Components, Responsibilities and Bounded Contexts", which gives you the boundaries that make a modular design real.',
        'In lesson 37 you will write comparison records for alternatives with the decision record builder, and in module 12 you will turn triggers into checks.',
      ] },
      { type: 'takeaways', items: [
        'Choose by requirements and constraints, never by fashion or seniority.',
        'The six steps: requirements, realistic options (including the simplest), weighted criteria, scores with reasons, margin and sensitivity, then a recorded decision with a trigger.',
        'A close result is "too close to call": settle it by reversibility or a small experiment.',
        'Start simple and split on a measured reason. The measured reason becomes the trigger.',
        'The Strangler Fig moves a system one slice at a time behind a router, and every slice can go back.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-12-workflow-1',
          kind: 'workflow-builder',
          title: 'Build the decision routine',
          prompt: 'Build the routine the TindaTrack team should follow, from the requirements to the recorded decision. Use AI for what it is good at and keep the people in charge of the decision.',
          concept: 'a decision method',
          situation: 'The TindaTrack team of three must choose how to structure the next quarter\'s work: multi-store accounts and e-wallet payments for about 200 stores. Someone suggests asking the assistant which style to use. Everyone wants a decision they can explain in a year.',
          parts: [
            { id: 'requirements', lane: 'input', label: 'Write the requirements and constraints, each with a measure', detail: 'Scenarios with a number or a test, plus the limits of the team and budget.' },
            { id: 'team', lane: 'input', label: 'Note the team size, skills and who is on call', detail: 'An option the team cannot run is not an option.' },
            { id: 'favourite', lane: 'input', label: 'Start from the style a popular blog post recommends', detail: 'The decision starts from someone else\'s system.' },
            { id: 'options', lane: 'ai', label: 'Ask the assistant for realistic options, including the simplest, with the cost of each', detail: 'The assistant widens the list and states costs.' },
            { id: 'ai-winner', lane: 'ai', label: 'Ask the assistant to choose the winner and follow it', detail: 'The assistant decides.' },
            { id: 'matrix', lane: 'tool', label: 'Score the options in a matrix, with a reason for every score', detail: 'Weights set by the team, scores backed by evidence.' },
            { id: 'sensitivity', lane: 'tool', label: 'Change each weight one step and see whether the order changes', detail: 'A result that flips is too close to call.' },
            { id: 'decide', lane: 'human', label: 'Review the assumptions and decide together', detail: 'The team makes the decision and owns it.' },
            { id: 'adr', lane: 'output', label: 'Write a decision record with the rejected options and a trigger to revisit', detail: 'The reason and the review condition are saved.' },
            { id: 'announce', lane: 'output', label: 'Announce the decision in chat with no record', detail: 'The reason lives only in memory.' },
          ],
          rules: [
            { id: 'r-require', kind: 'require', parts: ['requirements', 'options', 'matrix', 'sensitivity', 'decide', 'adr'], message: 'The routine needs written requirements, options, a scored matrix, a sensitivity check, a human decision and a record.' },
            { id: 'r-no-favourite', kind: 'forbid', parts: ['favourite'], message: 'Another system\'s choice answers another system\'s requirements.' },
            { id: 'r-no-ai-winner', kind: 'forbid', parts: ['ai-winner'], message: 'The assistant can list options and costs. The decision is the team\'s, because the team lives with it.' },
            { id: 'r-no-announce', kind: 'forbid', parts: ['announce'], message: 'A decision without a record cannot be checked or revisited.' },
            { id: 'r-req-first', kind: 'before', parts: ['requirements', 'options'], message: 'You cannot list realistic options before you know what the system must do.' },
            { id: 'r-options-matrix', kind: 'before', parts: ['options', 'matrix'], message: 'There must be options before they can be scored.' },
            { id: 'r-matrix-sens', kind: 'before', parts: ['matrix', 'sensitivity'], message: 'The sensitivity check works on a scored matrix.' },
            { id: 'r-sens-decide', kind: 'before', parts: ['sensitivity', 'decide'], message: 'Decide only after you know whether the result is stable.' },
            { id: 'r-decide-adr', kind: 'before', parts: ['decide', 'adr'], message: 'The record states a decision that has been made.' },
          ],
          solution: ['requirements', 'team', 'options', 'matrix', 'sensitivity', 'decide', 'adr'],
          minSteps: 6,
          maxSteps: 8,
          simulation: {
            input: 'Choose a style for multi-store accounts and e-wallet payments',
            steps: {
              requirements: 'Scenarios: a sale saves in under the agreed time at the counter during the evening report; payments are confirmed once; accounts are isolated by store.',
              team: 'Three developers, one night-time contact, no platform engineer.',
              options: 'The assistant lists: modular monolith, monolith plus one scheduled function, microservices, with the cost of each.',
              matrix: 'The team scores each option with a reason and its own weights.',
              sensitivity: 'Moving the operations weight one step puts two options level, so the result is too close to call.',
              decide: 'The team picks the modular monolith because it is cheapest to reverse.',
              adr: 'The record lists the rejected options and the trigger: the evening report slows the sale beyond the target.',
            },
            output: 'A recorded decision with its reasons, its rejected options and a measured condition for looking again.',
          },
          hints: [
            'Which steps need to happen before anything can be scored?',
            'The assistant may widen the list of options. Who should make the final choice?',
            'End with something a teammate could read in a year. What must it contain?',
          ],
          explanation: 'The routine puts requirements first, uses the assistant to widen options and state costs, uses a matrix and a sensitivity check to see how stable the result is, and leaves the decision and the record to the people who own it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-12-scenario-1',
          kind: 'scenario',
          title: 'Too close to call',
          prompt: 'Choose how to settle the decision.',
          concept: 'sensitivity and reversibility',
          situation: 'The team\'s matrix gives a modular monolith 3.9 and microservices 4.0. The weights were set mostly by the developer who prefers microservices. When the weight on "operating cost" moves up one step, the order flips. Nobody on the team has run services in production, and there is no night-time contact.',
          options: [
            { text: 'Call it too close to call. Choose the option that is cheaper to reverse (the modular monolith), write down the measured trigger, and revisit then.', consequence: 'The team ships on a design it can run and change. When the trigger is hit, a real module is ready to be moved out.', quality: 'best' },
            { text: 'Spend a week on a small prototype of the riskiest part under both designs, with a clear question, and decide from that.', consequence: 'The answer is better informed, but a week for a team of three is not free, and the prototype may not be needed if the reversible option is chosen.', quality: 'acceptable' },
            { text: 'Choose microservices, because 4.0 is higher than 3.9 and numbers are objective.', consequence: 'The 0.1 difference is smaller than the judgement behind any score. The team now operates services it has no experience with.', quality: 'poor' },
            { text: 'Add more criteria until one option pulls clearly ahead.', consequence: 'The matrix now reflects what the team added to get the result it wanted, and nobody trusts it.', quality: 'poor' },
          ],
          hints: [
            'What does it mean when moving one weight flips the order?',
            'When two options are close, which cost does the team control: building, or being wrong?',
            'Adding criteria until you like the answer defeats the point of the method.',
          ],
          explanation: 'A result that flips with one weight is not a winner. Reversibility and the team\'s real ability to operate the option settle it honestly. A prototype is sensible but costs time that the cheap option does not need.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-12-arrange-1',
          kind: 'arrange',
          title: 'Move one slice with the Strangler Fig',
          prompt: 'Put the steps in the order that moves a part of a system without a rewrite.',
          concept: 'Strangler Fig',
          language: 'text',
          solution: [
            'Put a thin router in front of the existing system',
            'Choose one slice with a clear boundary',
            'Build the slice in the new place while the old one keeps running',
            'Send that slice\'s traffic to the new one and watch the numbers',
            'Repeat for the next slice, then retire the old parts that are empty',
          ],
          reasons: [
            'The router is what lets traffic move without anyone noticing.',
            'A slice with a clear boundary is the easiest one to move first.',
            'Both versions run, so nothing is lost if the new one is wrong.',
            'Traffic moves only once the new slice is ready, and can be moved back.',
            'The old system shrinks until nothing is left to retire.',
          ],
          hints: [
            'What must exist before any traffic can be redirected?',
            'The old system keeps running until the very end.',
            'Retiring old code is the last step, after the slices have moved.',
          ],
          explanation: 'Router first, then one slice at a time with both systems alive, moving traffic only when ready, and retiring old code last. Every step can be reversed, which is what makes it safer than a rewrite.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-12-q1',
        prompt: 'Two options score 3.9 and 4.0 out of 5, and moving one weight by one step reverses the order. What does this mean?',
        choices: [
          'The higher total wins, because a small margin is still a margin, scores are objective, and the team should not second-guess the arithmetic.',
          'It is too close to call. Settle it with reversibility or a small experiment, and record the trigger for looking again.',
          'The weights were wrong, so the team should adjust them until the preferred option leads by a clear gap.',
          'Both options are equally bad, so neither should be built until more options have been scored.',
        ],
        answer: 1,
        explanation: 'A result that flips with one weight sits inside the error of the judgements. The honest response is to choose the more reversible option or run a small experiment. Adjusting weights to get a gap defeats the method.',
      },
      {
        id: 'software-architecture-ai-12-q2',
        prompt: 'Which is a measured reason to split a part out of TindaTrack?',
        choices: [
          'Production measurements show the nightly report pushes the sale-saving time past the target in the quality scenario.',
          'The team expects to reach ten thousand stores one day, and wants the architecture ready for that growth before it arrives.',
          'A new developer prefers services and is more productive with a separate code base.',
          'Competitors advertise that their products are built from services, and customers might ask.',
        ],
        answer: 0,
        explanation: 'A measured reason breaks a stated scenario and can be shown in data. Expectations, preferences and competitor claims are not measurements of this system.',
      },
      {
        id: 'software-architecture-ai-12-q3',
        prompt: 'In the decision method, why must every score have a written reason?',
        choices: [
          'A reason makes the matrix longer, which signals to other teams that careful work was done.',
          'The tool refuses to compute totals when a reason is missing, so a reason is a technical requirement.',
          'A score with a reason can be checked, challenged and revisited with evidence. One without is a feeling that looks like data.',
          'Reasons are needed only for the highest and the lowest scores, since the middle ones barely affect the total and the ranking of options.',
        ],
        answer: 2,
        explanation: 'A reason lets someone else challenge or update the score later with evidence. Without it, the matrix looks objective while hiding opinion.',
      },
      {
        id: 'software-architecture-ai-12-q4',
        prompt: 'A team outgrows one part of its modular monolith. Which plan follows the Strangler Fig idea?',
        choices: [
          'Freeze new features, rewrite the whole system in the new style, and switch over on one agreed day.',
          'Run both systems side by side permanently, and let each customer choose which one to use until the old system is no longer asked for.',
          'Copy the whole database into a new system first, and move the code over module by module afterwards.',
          'Put a thin router in front, move one slice at a time behind it, and keep the ability to route a slice back to the old code.',
        ],
        answer: 3,
        explanation: 'The pattern moves one slice at a time behind a router so each step can be measured and reversed. A big-bang rewrite, a permanent dual run and a database copy first are not the pattern.',
      },
      {
        id: 'software-architecture-ai-12-q5',
        audience: { max: 'beginner' },
        prompt: 'Before comparing ways to travel to work, you write down distance, budget and whether it rains. Why do this first?',
        choices: [
          'So the list looks long and serious before you ask a friend.',
          'So you know what a good choice must do before you judge any option.',
          'So you can skip comparing and take the cheapest option every time.',
        ],
        answer: 1,
        explanation: 'The requirements are what the options are judged against. Without them, every option is judged by taste.',
      },
      {
        id: 'software-architecture-ai-12-q6',
        audience: { min: 'advanced' },
        prompt: 'A weighted matrix lists "developer experience" and "delivery speed" as two criteria worth 20% each, and both really measure the same thing. What is the risk?',
        choices: [
          'Double counting: one underlying factor carries twice the weight and can tilt the result without anyone intending it.',
          'The matrix will refuse to compute, since two criteria cannot have the same weight.',
          'Nothing, because related criteria always cancel each other out when they are scored in the same way by the same people.',
          'The scores will become more precise, since two criteria give two independent measures of the same quality and reduce the chance of error.',
        ],
        answer: 0,
        explanation: 'Two criteria that capture the same quality count it twice. Review criteria for overlap, and test sensitivity to see which ones carry the result.',
      },
    ],
    task: {
      title: 'Run the method on a real decision',
      minutes: 20,
      steps: [
        'Pick a decision you are facing or made recently (a style, a database, a build-or-buy choice). Write three quality scenarios with a measure, and your team\'s constraints.',
        'List two to four options including the simplest one, and score them against your criteria in the matrix above or a spreadsheet, writing a reason beside every score.',
        'Move each weight by one step and note whether the order changes. If it does, write "too close to call" and say which option is easier to reverse.',
        'Write a short decision record: the choice, the rejected options and their reasons, and one measured trigger that would make you look again, with a date.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Practise on an everyday decision first (which phone plan, which laptop). Write what it must do, three options and why each scores as it does, before you use any software decision.'] },
      { audience: { min: 'advanced' }, steps: ['Add a confidence level (low, medium, high) beside each score and rerun the sensitivity check with the low-confidence scores moved. Write which experiment would raise confidence most for the least cost.'] },
    ],
  },
];
