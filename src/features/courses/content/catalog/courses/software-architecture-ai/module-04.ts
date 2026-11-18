import type { Lesson, Project } from '../../../types';

// Module 4: System Design and Component Architecture (lessons 13 to 15, days 13 to 15, no project, no labs). Written 2026-11-18.
// No product facts are stated as fact, so there are no version notes. Every person, business, system and figure in the examples is invented.
// Demos ("AI in Action") are hand-written illustrations; none of them is a real model's output.

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-13',
    day: 13,
    title: 'Decomposing a System: Components, Responsibilities and Bounded Contexts',
    summary: 'Split a system along responsibilities and the meanings of its words, and draw the result as C4 container and component views.',
    intro: {
      objectives: [
        'Find component boundaries by responsibility, language, change and data ownership',
        'Explain a bounded context and a shared language, and why one word can mean different things',
        'Draw a C4 container view and a component view of a system and say what each one decides',
      ],
      why: 'Where you draw the boundaries decides how much of the system one change touches. Drawn well, they make teams faster. Drawn badly, they make every feature a negotiation.',
    },
    minutes: 28,
    skills: ['arch-components'],
    body: [
      { type: 'paragraph', text: `Lessons 8 to 12 chose the overall shape. Now we go inside it. **Decomposition** is splitting a system into parts so that each part has one clear job and one reason to change. There are good and bad ways to do it. The bad ways are tempting because they are easy to see: split by technical layer (all screens here, all database code there) or by database table (one part for every table). This lesson shows a better way, which follows responsibilities and the meaning of the business's own words. Then you draw the result with the C4 model.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack became a multi-store product. The word "product" was everywhere: stock counts, the price list, supplier deliveries, receipts, and the new reorder suggestions. The team had one Product class with forty fields, and every developer edited it. A change for supplier pack sizes broke the counter screen, and nobody was sure who was allowed to rename a field.` },
      { type: 'paragraph', text: `The team sat down with the store owners and listened to how they used the word. For the person at the counter, a product is an item with a name and a price. For the person counting stock, it is something with a quantity and a reorder point. For the person ordering from suppliers, it is a pack that arrives with a supplier code and a cost. Three groups of people were using one word for three different things. The class was not too big. It was trying to be three models at once.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Responsibility.** A good component has one main responsibility. It owns certain data and certain rules, and it exposes a small interface to the rest. A quick test: can you describe it in one sentence without the word "and"? Things that change together should live together, and things that change for different reasons should live apart.` },
      { type: 'paragraph', text: `**Domain-Driven Design (DDD)** has a half called strategic design that helps with this. We use only that half. Three ideas are enough. The **domain** is the area of the business the software serves. A **ubiquitous language** is the shared vocabulary that developers and business people use in meetings, in the code and in the database, so that a word means the same thing to everyone who uses it. A **bounded context** is a boundary inside which each term has one precise meaning and one model. Outside it, the same word may mean something else, and that is fine, as long as you translate at the boundary.` },
      {
        type: 'table',
        headers: ['Context', 'What "product" means there', 'It owns', 'Its words'],
        rows: [
          ['Sales', 'An item with a name and a price at the counter', 'Prices, receipts, discounts', 'Sale, line, receipt'],
          ['Inventory', 'A stock item with a quantity and a reorder point', 'Quantities, counts, adjustments', 'Stock level, count, adjustment'],
          ['Purchasing', 'A pack a supplier delivers, with a supplier code and a cost', 'Supplier lists, pack sizes, orders', 'Order, pack, supplier'],
        ],
        caption: 'One word, three models. Each context keeps only what it needs and refers to the others by an id. Where they meet, they translate.',
      },
      { type: 'paragraph', text: `Notice what this does to the forty-field class. Each context keeps a small model of its own, shares only an identifier with the others, and asks through an interface when it needs more. Some duplication of data between contexts is normal and healthy. A bounded context is also **not the same as a microservice**. It can be a module in a modular monolith (lesson 8). Whether it becomes a separate service is a later decision, made on measured reasons (lessons 9 and 12).` },
      { type: 'paragraph', text: `How do you find the boundaries? Five signals help. Listen for the same word with different meanings, or different words for the same thing. Follow change: what changes together and what changes for different reasons. Follow data ownership: for each important piece of data, name the one component allowed to change it, and if two want to, you have a boundary problem. Follow the people: who decides price rules and who decides stock rules, and are they different people? Finally, walk a real flow through your sketch and count how many components a typical change touches. If it is most of them, the lines are in the wrong place.` },
      { type: 'paragraph', text: `Now draw it. The **C4 model** describes a system at four levels, each a closer look. Level 1 is the system context (lesson 4: your system, its users and the outside systems). Level 2 is the **container** view. A container in C4 is a separately runnable or deployable thing: a web app, an API, a database, a scheduled job. It is not necessarily a Docker container. Level 3 is the **component** view: the parts inside one container. Level 4 is code, which your editor already shows, so it is rarely drawn.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `C4Container
  title TindaTrack containers
  Person(owner, "Store owner", "Tracks stock and sales")
  System_Boundary(app, "TindaTrack") {
    Container(web, "Web app", "TypeScript", "The owner's screens")
    Container(api, "API", "Node.js", "Business rules")
    ContainerDb(db, "Database", "PostgreSQL", "Stores, products, sales")
    Container(job, "Nightly job", "Scheduled function", "Builds and sends daily summaries")
  }
  System_Ext(wallet, "E-wallet provider", "Takes online payments")
  System_Ext(sms, "Text provider", "Sends text messages")
  Rel(owner, web, "Uses", "HTTPS")
  Rel(web, api, "Calls", "HTTPS/JSON")
  Rel(api, db, "Reads and writes", "SQL")
  Rel(api, wallet, "Starts payments", "HTTPS")
  Rel(job, db, "Reads sales", "SQL")
  Rel(job, sms, "Sends summaries", "HTTPS")`,
        caption: 'Level 2. The container view answers "what runs, and what does it talk to?". Look at the nightly job: it is a container because it is deployed separately (lesson 9).',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `C4Component
  title Inside the TindaTrack API
  Container(web, "Web app", "TypeScript", "The owner's screens")
  Container_Boundary(api, "TindaTrack API") {
    Component(catalog, "Catalog", "Module", "Products and prices")
    Component(inventory, "Inventory", "Module", "Stock levels and counts")
    Component(sales, "Sales", "Module", "Sales and receipts")
    Component(payments, "Payments", "Module", "Wallet payments and confirmations")
  }
  ContainerDb(db, "Database", "PostgreSQL", "Stores, products, sales")
  System_Ext(wallet, "E-wallet provider", "Takes online payments")
  Rel(web, sales, "Records sales", "HTTPS/JSON")
  Rel(sales, catalog, "Reads prices")
  Rel(sales, inventory, "Reduces stock")
  Rel(sales, payments, "Starts payments")
  Rel(payments, wallet, "Creates charges", "HTTPS")
  Rel(inventory, db, "Owns stock tables", "SQL")
  Rel(catalog, db, "Owns product tables", "SQL")`,
        caption: 'Level 3, zoomed into the API. Each component is a bounded context with one job. The arrows go through interfaces. Nothing here says what Sales does inside.',
      },
      { type: 'visual', id: 'arch-diagram-workbench', caption: 'Load the container view above and add the Purchasing context. Decide first whether it is a new container or a component in the API, and write your reason in your own notes before you draw it.' },
      { type: 'paragraph', text: `Three wrong turns are worth naming. Splitting by layer makes every feature change touch every part. Splitting by table gives you many parts that only create, read, update and delete, with the business rules scattered over their callers. And splitting too finely, too early, creates parts whose coordination costs more than their independence is worth. Lesson 36 returns to writing these diagrams as code.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: at school, the word "class" means different things to different people. To a teacher it is a group of students. To the timetable office it is a room and a time. To the registrar it is a subject. If one notice board tried to hold one definition of "class", it would be confusing for everyone. A bounded context is a separate notice board for each office, where the word has one clear meaning. The offices exchange messages that carry a small label (the class number) and each office keeps its own details. The C4 diagrams are maps of the same school at different zoom levels: the campus, the buildings, and then the rooms.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Boundaries follow organisations as much as code: if two teams must agree on one model, you have a coordination cost that no diagram removes. When two contexts must cooperate, name the relationship: one is upstream and the other downstream, they share a small agreed model, or the downstream one wraps the other in a translation layer so its model is not polluted (lesson 22 covers that wrapper as an anti-corruption layer). Reporting is the usual pressure point, because it wants a view across contexts, so give it its own read model rather than joins across owned tables. Do not turn contexts into services until the boundaries have survived a few real changes: moving a wrong service boundary means a data migration and two release pipelines. Boundaries drift, so review them when a change keeps touching several components.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'You have already split code into functions and classes. Splitting a system into components uses the same instinct at a larger size: group what changes together and keep the rest behind a small, stable surface. The new cost is that a boundary between components is harder to move later than one between functions.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant decomposes TindaTrack',
        prompt: `Decompose TindaTrack, an inventory and sales app for sari-sari stores with e-wallet payments, into components. Give the list.`,
        output: `Proposed microservices:\n1. UserService\n2. StoreService\n3. ProductService\n4. PriceService\n5. StockService\n6. SaleService\n7. SaleLineService\n8. PaymentService\n9. ReceiptService\n10. SupplierService\n11. LoyaltyPointsService\n\nEach service has its own database and exposes create, read, update and delete endpoints.`,
        notice: `Look at how this list was made. Most of the services are one per database table (Sale and SaleLine, Product and Price), which splits what changes together and gives parts that only do create, read, update and delete. Nothing says what each one is responsible for or what it owns. "LoyaltyPointsService" was never in the requirements: the assistant added a plausible feature. And "microservices" was assumed, not decided. Ask for each component's one-sentence responsibility, the data it owns and the words it uses, and ask which items on the list trace back to a stated requirement.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write down your own proposal first: the components, one sentence of responsibility each, and a short glossary of words that you suspect mean different things in different parts of the business. Then ask for a critic.` },
      {
        type: 'prompt',
        label: 'Critique my decomposition',
        text: `My system: [one sentence].\nRequirements: [list].\n\nMy proposed components, with one sentence of responsibility and the data each one owns: [list].\nWords I think mean different things in different parts of the business: [list, with the meanings].\n\nAct as a critic. Please:\n1. Find any component whose responsibility needs the word "and".\n2. Find any data that two components both seem to change.\n3. Tell me which words in my glossary suggest a boundary I missed, or one I drew in the wrong place.\n4. Walk one flow through my components and say how many it touches.\n5. Say which of my components trace to no stated requirement.\n\nDo not add components or features I did not list. Tell me what you cannot know about my business.`,
      },
      { type: 'paragraph', text: `What to verify: every extra component or feature the assistant mentions must come from your requirements, and every meaning it gives for a word should be checked with someone who uses that word in the business. The boundary is your decision.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Find one word in your own system that two groups use differently, and write the two meanings side by side (the practical challenge below).',
        'Next lesson, "Dependencies, Communication and Boundaries Between Components", looks at the lines between the boxes you have just drawn.',
        'Read the C4 model overview on the official c4model.com site, and compare its description of containers with the one in this lesson.',
      ] },
      { type: 'takeaways', items: [
        'Decompose by responsibility and by the meaning of the business\'s words. Avoid splitting by layer or by table.',
        'A bounded context is a boundary inside which a term has one precise meaning. The same word can mean different things in different contexts.',
        'A bounded context is not a microservice. It can be a module, and splitting it out is a separate, measured decision.',
        'Find boundaries by language, change, data ownership, people and by walking a real flow.',
        'C4 container view: what runs and what it talks to. Component view: the parts inside one container.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-13-match-1',
          kind: 'match',
          title: 'What does this symptom tell you?',
          prompt: 'Match each symptom to what it says about the decomposition.',
          concept: 'boundaries',
          labels: { terms: 'The symptom', meanings: 'What it tells you' },
          pairs: [
            { term: 'Sales, Inventory and Purchasing each describe a "product" differently', definition: 'Three bounded contexts, each with its own small model, linked by an id', note: 'The different meanings are the signal for the boundaries.' },
            { term: 'Changing the receipt wording touches Catalog, Sales, Inventory and Reminders', definition: 'The lines cut across what changes together, so a responsibility is misplaced', note: 'A change that touches many parts means they should not be separate.' },
            { term: 'Two modules both update the quantity in stock', definition: 'Data ownership is unclear: pick one owner and let the other ask it', note: 'Every important piece of data needs exactly one writer.' },
            { term: 'A service for every database table, each with only create, read, update and delete', definition: 'Decomposition by table: the business rules are scattered over the callers', note: 'The parts hold data but own no rules.' },
            { term: 'One Product class with forty fields that every team edits', definition: 'A shared model that crosses contexts and should be split by context', note: 'It is trying to be three models at once.' },
          ],
          hints: [
            'Read the symptom and ask which of the five boundary signals it shows.',
            'Two symptoms are about data and who may write it; two are about one thing being forced to serve several meanings.',
            'A symptom about a change touching many parts says the boundary is in the wrong place, not that there are too few components.',
          ],
          explanation: 'Each symptom points to a boundary signal: language, change, ownership or a shared model. Naming the signal tells you which part of the decomposition to redraw.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-13-scenario-1',
          kind: 'scenario',
          title: 'Container or component?',
          prompt: 'Choose where the new reorder-suggestion feature belongs in the C4 views.',
          concept: 'container versus component',
          situation: 'TindaTrack adds an AI feature that suggests what each store should reorder, using its sales and stock history. It runs once a night and writes a list the owner reads in the morning. The team of three runs the API as one deployment. Someone wants it to be a new service with its own database, "because it is AI".',
          options: [
            { text: 'Make it a component inside the API for now. It reads sales and stock through their interfaces and shares the deployment. Move it out only if a measured reason appears.', consequence: 'It ships quickly, keeps one deployment, and its interface shows whether it could be moved later.', quality: 'best' },
            { text: 'Make it a separate scheduled job container that reads through an interface, because it runs once a night and can simply be run again.', consequence: 'This is a valid choice that matches the nightly summary. It adds one more thing to deploy that the team did not yet need.', quality: 'acceptable' },
            { text: 'Create a new microservice with its own database, since AI features have different needs from the rest of the app.', consequence: 'A second database now has to be fed from the first, and the team of three operates two systems for a feature that runs for minutes a night.', quality: 'poor' },
            { text: 'Put it inside Catalog because that component already holds the product list.', consequence: 'Catalog now has a second reason to change, and the next change to the suggestions will touch the price list.', quality: 'poor' },
          ],
          hints: [
            'Which option adds the least to deploy and operate while keeping the boundary clear?',
            'A container is something that runs and is deployed separately. Does this feature need to be?',
            'Fashion ("because it is AI") is not a requirement.',
          ],
          explanation: 'Start as a component with a clean interface, because that is the cheapest option that keeps the choice open. A scheduled job is defensible, and a separate service with its own database pays the full price with no measured reason.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-13-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'The four levels of C4',
          prompt: 'Tap each level and read what it answers and when you draw it.',
          concept: 'C4 model',
          cards: [
            { front: 'Level 1: System context', back: 'Your system as one box, with its users and the outside systems it talks to. Drawn first (lesson 4) so everyone agrees where the system ends.' },
            { front: 'Level 2: Containers', back: 'What runs and is deployed separately: web app, API, database, scheduled job, and how they talk. The level most teams need on one page.' },
            { front: 'Level 3: Components', back: 'The parts inside one container, each with a responsibility. Draw it for a container whose inside is not obvious or is being changed.' },
            { front: 'Level 4: Code', back: 'Classes and functions. Your editor already shows this and it changes constantly, so it is rarely drawn by hand.' },
          ],
          hints: [
            'Think of zooming in on a map: country, city, street, building.',
            'Each level answers a different question. What does a new developer need to know first?',
            'The last level is the one most likely to be out of date the day after it is drawn.',
          ],
          explanation: 'C4 is a set of zoom levels, not four separate documents. Use the level that answers the question in front of you, and do not draw a level nobody will read.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-13-q1',
        prompt: 'Which way of splitting a system is most likely to make every feature change touch every part?',
        choices: [
          'Splitting by bounded context, with one component per area of the business and its own words.',
          'Splitting by data owner, so each important piece of data has one component allowed to change it.',
          'Splitting by technical layer: all screens in one part, all business logic in another and all database code in a third.',
          'Splitting by change: parts that change together are kept together and parts that change for different reasons are kept apart.',
        ],
        answer: 2,
        explanation: 'A feature usually needs a screen, a rule and a table, so a split by layer makes every feature cross every part. The other three follow how the business and the code actually change.',
      },
      {
        id: 'software-architecture-ai-13-q2',
        prompt: 'In the C4 model, what is a "container"?',
        choices: [
          'A Docker image, because C4 describes how software is packaged for deployment.',
          'Any class or object that holds other classes inside it, such as a module or a namespace, shown as a box with a border.',
          'A group of servers that run the same software, shown as one box to simplify the picture.',
          'A separately runnable or deployable unit such as a web app, an API, a database or a scheduled job.',
        ],
        answer: 3,
        explanation: 'In C4 a container is something that runs on its own, which may or may not be a Docker container. A class or module is a component, and a group of servers is a deployment detail.',
      },
      {
        id: 'software-architecture-ai-13-q3',
        prompt: 'Sales and Inventory both change the quantity in stock. What does the lesson suggest?',
        choices: [
          'Let both write the quantity and settle conflicts by keeping whichever change was saved last.',
          'Name one owner for the quantity and let the other ask it through its interface.',
          'Copy the quantity into both components so that each one has a version that is always available.',
          'Merge the two components into one so the question never comes up again.',
        ],
        answer: 1,
        explanation: 'Every important piece of data needs exactly one writer. Letting both write, copying it, or merging the components all avoid the question instead of answering it.',
      },
      {
        id: 'software-architecture-ai-13-q4',
        prompt: 'TindaTrack\'s team finds that "product" means a priced item to Sales, a stock item to Inventory and a delivered pack to Purchasing. What does strategic DDD suggest?',
        choices: [
          'Treat them as three bounded contexts with their own models, linked by an id and translated at the boundary.',
          'Pick the clearest definition and make the other groups rename their word to match it.',
          'Keep one Product model and add fields until it covers every group, so that no information is lost between screens or teams.',
          'Move each context into its own microservice immediately, so that their models cannot mix.',
        ],
        answer: 0,
        explanation: 'Different meanings mark different contexts. Forcing one meaning, or one model with every field, recreates the problem. Whether a context becomes a service is a separate decision.',
      },
      {
        id: 'software-architecture-ai-13-q5',
        audience: { max: 'beginner' },
        prompt: 'At school, "class" means a group of students to a teacher, a room to the timetable office and a subject to the registrar. What would the lesson call each place where the word has one clear meaning?',
        choices: [
          'A bounded context.',
          'A container: something that runs and is deployed separately.',
          'A database table: the place where a context stores its data.',
        ],
        answer: 0,
        explanation: 'A bounded context is a boundary inside which a term has one precise meaning. A container is something that runs and is deployed, and a table is how data is stored.',
      },
      {
        id: 'software-architecture-ai-13-q6',
        audience: { min: 'advanced' },
        prompt: 'A team draws its bounded contexts and, the same week, makes each one a separate service. What is the main risk?',
        choices: [
          'The services will be too small to hold any business rules, so they will end up only storing data and forwarding calls to each other.',
          'The contexts will start to share a database, because services always do eventually.',
          'The diagram will be out of date, since services are never deployed as drawn.',
          'The boundaries are still guesses, and a wrong service boundary costs a data migration; modules are cheaper to correct.',
        ],
        answer: 3,
        explanation: 'New boundaries have not yet survived real change. A module boundary can be corrected in one codebase; a service boundary is expensive to move. Splitting after the boundaries prove stable is cheaper.',
      },
    ],
    task: {
      title: 'Map the words and the boxes of a real system',
      minutes: 20,
      steps: [
        'Pick a system you work on, or TindaTrack. Find one word that two groups use differently and write the two meanings side by side, with who uses each.',
        'List the components you would make, with one sentence of responsibility and the data each owns. Mark any that need the word "and".',
        'Write the container view as C4 text and the component view for one container (use the workbench above or any Mermaid editor).',
        'Walk one real flow through your components and write how many it touches. Redraw one boundary if the number is higher than you expected.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you have no system, use a school or a clinic. Write what the word "record" means to the front desk, the doctor and the person who sends bills, and draw three boxes, one per meaning.'] },
      { audience: { min: 'advanced' }, steps: ['Name the relationship between each pair of contexts in your sketch (upstream and downstream, shared model, or a translation layer) and write which team owns each boundary. List the first measured reason that would justify turning one context into a service.'] },
    ],
  },
  {
    id: 'software-architecture-ai-14',
    day: 14,
    title: 'Dependencies, Communication and Boundaries Between Components',
    summary: 'Read and design the lines between components: dependency direction, coupling, synchronous versus asynchronous calls and the contract at each boundary.',
    intro: {
      objectives: [
        'Find and break a dependency cycle between components',
        'Name the kinds of coupling and choose between synchronous and asynchronous communication',
        'Draw a sequence diagram of a flow and test every arrow for waiting, failure and repeats',
      ],
      why: 'Most architecture problems live in the lines between components, not in the boxes. Reading the lines lets you find waiting, failure and tangling before they reach production.',
    },
    minutes: 26,
    skills: ['arch-components'],
    body: [
      { type: 'paragraph', text: `A system is only as clear as the lines between its parts. Lesson 13 drew the boxes. This lesson is about the lines: what depends on what, how tightly, how the parts talk, and where one component stops and the next begins. Get the lines wrong and boxes that look separate behave like one tangled thing.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack added payments through an e-wallet. The first version was quick to write. Sales called Payments to start a payment. Payments called Inventory to reserve stock. Inventory, to check a reduced price, called Sales. The three components now formed a circle.` },
      { type: 'paragraph', text: `The costs showed up in small ways first. A test of Sales needed Payments and Inventory running. A release of Inventory had to wait for the other two. Then one afternoon the e-wallet provider was slow. Payments waited for it. Sales waited for Payments. The counter screen froze while cashiers watched a spinner. The circle meant that no part could be built, tested or changed alone, and a delay anywhere travelled to the cashier.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Dependencies.** Component A depends on B if A cannot be built, run, tested or changed safely without B. Draw every dependency as an arrow. Two rules help. Let arrows point toward things that are stable and general, away from things that change often. And avoid cycles. A cycle means the components are really one component, or a third component is missing. To break one, merge them, move the shared thing into a third component that both depend on, or turn one arrow around with an interface or an event (lessons 10 and 11).` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  A[Sales] -->|starts payment| B[Payments]
  B -->|reserves stock| C[Inventory]
  C -->|asks for prices| A
  B -.->|sends receipt text| D[Reminders]`,
        caption: 'Follow the solid arrows: Sales to Payments to Inventory and back to Sales. That is a cycle. The dashed arrow is fine: Reminders is at the end of a one-way line.',
      },
      { type: 'paragraph', text: `The fix here was small. Inventory never needed prices. Sales already knew the sale, so Sales read prices from Catalog and told Inventory only product ids and quantities. The arrows then pointed one way, and Inventory could be tested alone.` },
      { type: 'paragraph', text: `**Coupling and cohesion.** Coupling is how much one component must know about another, and so how much it must change when the other changes. Cohesion is how strongly the things inside one component belong together. The aim is high cohesion and low coupling. Zero coupling is impossible, because components exist to cooperate. The goal is that the coupling that remains is deliberate, visible and cheap to change.` },
      {
        type: 'table',
        headers: ['Kind of coupling', 'What it looks like', 'Why it matters'],
        rows: [
          ['Data', 'One component passes another an id or a simple value', 'The weakest kind. Easy to keep stable.'],
          ['Interface', 'One component calls a small public function of another', 'Fine, if the interface is small and its changes are managed.'],
          ['Shared database', 'Two components read or write the same table', 'Either can break the other silently, and no arrow shows it.'],
          ['Shared logic', 'Two components import the same library of business rules', 'A change to the rule forces both to change and release together.'],
          ['Timing', 'One component needs another to be up at the same moment', 'A failure or a delay spreads from one to the other.'],
        ],
        caption: 'Roughly from weakest to strongest. The ones that diagrams hide, a shared table and timing, are the ones that hurt most.',
      },
      { type: 'paragraph', text: `**Synchronous or asynchronous.** In a **synchronous** call, the caller sends a request and waits for the answer. It is simple, you get the result and the error at once, and it is the right choice when the caller needs the answer to continue. Its cost is that the caller is only as fast and as available as the part it waits for. In an **asynchronous** exchange, the sender hands over a message and carries on (lesson 10). It protects the sender and costs you eventual consistency, duplicates and harder debugging. A fair test: does the caller need the result to continue? And what should the user see if the other side is down for a minute? Inside one deployed unit, a synchronous call is a cheap function call. Across a network it needs a timeout, and a plan for when it fails.` },
      { type: 'paragraph', text: `**Boundaries and contracts.** A boundary is a place where you decide what crosses and what stays hidden. What crosses is a **contract**: the names, the shapes of the data, the possible errors, the timing, and who retries. Keep contracts small and stable. Do not pass your internal model across a boundary, because it becomes a promise you did not mean to make. Treat failure as part of the contract: what does the caller get if the payment takes ten seconds, or never answers? Then enforce the boundary somewhere real: a module's public interface, an API, database permissions, or a check in the build.` },
      { type: 'paragraph', text: `A **sequence diagram** shows one flow in time. It comes from UML, the Unified Modeling Language, a large standard set of diagram types. This course uses only two of them where they earn their place, and this is the first. Participants run across the top, time runs down, a solid arrow is a message sent and a dashed arrow is a reply. Draw one when a flow crosses three or more components, because that is where waiting and failure hide. When the flow involves two components, a sentence is enough, and UML is overkill.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  actor Owner
  participant Sales
  participant Payments
  participant Wallet as E-wallet provider
  participant Inventory
  Owner->>Sales: Charge customer by wallet
  Sales->>Payments: Start payment
  Payments->>Wallet: Create payment request
  Wallet-->>Payments: Payment link
  Payments-->>Sales: Pending
  Sales-->>Owner: Waiting for payment
  Wallet->>Payments: Payment confirmed (webhook)
  Payments->>Sales: PaymentConfirmed
  Sales->>Inventory: Reduce stock
  Sales-->>Owner: Paid`,
        caption: 'Find where the flow changes from a call that waits to a message that arrives later: the confirmation from the wallet. Above it everything answers within a second. Below it things happen when the customer pays, which could be minutes.',
      },
      { type: 'paragraph', text: `Then test every arrow with four questions. Does the sender wait? What happens if the receiver is down for a minute? What is the timeout? Is it safe to send the same message twice? The last one matters because retries happen, and lessons 20 to 23 return to it for APIs, webhooks and queues.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: picture a restaurant. A waiter who takes an order to the kitchen and stands there until the food is cooked is making a synchronous call: nothing else gets served meanwhile. A waiter who pins the order on a rail and goes back to the tables is asynchronous. A cycle is two people at a narrow door, each waiting for the other to go through first. A contract is the order slip: what is written on it, what the kitchen promises, and what to do if an ingredient is missing. A sequence diagram is a picture of one order's trip through the restaurant, from top to bottom in time.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Four failure patterns recur on these lines. A chain of synchronous calls is only available when every link is, so the whole is less available than its weakest part. Timeouts must shrink along the chain: if each service waits as long as its caller, the caller gives up and retries while the deeper calls are still running, which multiplies load on the part that is already struggling. Chatty interfaces, with a call per item, turn into slow pages across a network, so batch them. And contracts evolve: prefer additive changes, and test consumers against the contract (module 11). Retried calls that change something, such as a payment, need an idempotency key so a repeat is harmless (lessons 20 and 22), and modules 6 and 8 cover circuit breakers and bulkheads in detail.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant describes the e-wallet payment flow',
        prompt: `Describe step by step how TindaTrack should handle a customer paying by e-wallet. Components: Sales, Payments, Inventory and an outside e-wallet provider.`,
        output: `1. The owner presses Charge in the app.\n2. Sales calls Payments.charge().\n3. Payments calls the e-wallet provider and waits, keeping the request open, until the customer has paid.\n4. Payments tells Inventory to reduce stock.\n5. Payments returns "Paid" to Sales, and Sales shows it to the owner.\n\nThis keeps the flow simple and consistent: everything happens in one request.`,
        notice: `Check what the flow assumes. Step 3 keeps a request open until a person finishes paying in another app, which could take minutes: the owner's screen and a server connection are held the whole time, and a timeout leaves it unknown whether the customer paid. The provider's confirmation normally arrives later as a separate message, and the flow has no step for it, no step for a failed or abandoned payment, and no safe way to repeat. Step 4 makes Payments change stock, which was Inventory's to own through Sales. "Simple and consistent" hides all of this. Ask where the flow waits, what happens if each step fails and which message may arrive twice.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write one flow from your own system as numbered steps and list every dependency it creates, before you ask for help. Then ask the assistant to draw it and challenge it.` },
      {
        type: 'prompt',
        label: 'Draw and test my flow',
        text: `My flow: [numbered steps, naming the component that does each one].\nMy dependencies between components: [list, one per line, as "A depends on B because ..."].\n\nPlease:\n1. Draw it as a Mermaid sequenceDiagram using only participant lines and the arrows ->> and -->> (no notes, loops or alt blocks). Use only the components I listed.\n2. For each arrow, say whether the sender waits, what happens if the receiver is down for a minute, what the timeout should depend on, and whether a repeat is safe.\n3. Find any dependency cycle in my list and suggest the smallest change that removes it.\n4. Tell me which calls could be asynchronous without hurting the user, and what the user would see.\n5. Say what contract details are missing: errors, timeouts, retries.\n\nDo not add components. Tell me what you cannot know.`,
      },
      { type: 'paragraph', text: `What to verify: paste the diagram text into the diagram workbench from lesson 13 to see whether it draws, because generated diagram text often uses syntax a drawing tool does not accept. Then check each claim about waiting and repeats against your own flow. The design is still yours.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Draw one flow in your own system as a sequence diagram and test every arrow with the four questions (the practical challenge below).',
        'Next lesson, "High-Level and Low-Level Design, and Designing for Maintainability", zooms into one component and asks how to keep it easy to change.',
        'In lessons 20 to 23 you will study the contracts in detail: APIs, third-party integrations, webhooks and queues.',
      ] },
      { type: 'takeaways', items: [
        'Draw dependencies as arrows, point them toward stable things and break cycles by merging, moving the shared part, or inverting one arrow.',
        'Prefer weak coupling. The hardest kinds to see are a shared table and timing.',
        'Use a synchronous call when the caller needs the answer now, and an asynchronous message when it only needs the thing done.',
        'A boundary is a contract: names, shapes, errors, timing and who retries. Failure belongs in it.',
        'Draw a sequence diagram when a flow crosses three or more components, and test each arrow for waiting, failure and repeats.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-14-scenario-1',
          kind: 'scenario',
          title: 'Break the cycle',
          prompt: 'Choose the change that removes the dependency cycle at the least cost.',
          concept: 'dependency cycles',
          situation: 'In TindaTrack, Sales calls Payments, Payments calls Inventory to reserve stock, and Inventory calls Sales to ask for prices. A test of Sales cannot run without the other two. Inventory only needs prices to check a discount, and Sales already has the sale in hand.',
          options: [
            { text: 'Have Sales read prices from Catalog and pass Inventory only product ids and quantities, and let Sales call Inventory itself. Every arrow now points one way.', consequence: 'Inventory no longer knows Sales exists. It can be tested alone, and Payments no longer needs to touch stock.', quality: 'best' },
            { text: 'Merge Sales, Payments and Inventory into one component until their boundaries are clearer.', consequence: 'The cycle disappears, but the three responsibilities share a component again. It is a safe step, though it gives up the separation the team wanted.', quality: 'acceptable' },
            { text: 'Keep the cycle, but add retries to every call so that a slow component no longer matters.', consequence: 'Retries make a slow provider worse, because each caller adds load while it waits. The cycle is still there.', quality: 'poor' },
            { text: 'Give Inventory direct read access to the table where Sales keeps its prices.', consequence: 'The arrow is gone from the diagram, and a shared table now links them silently. A price change breaks Inventory without warning.', quality: 'poor' },
          ],
          hints: [
            'What does Inventory really need from Sales? Is it needed at all?',
            'Look for the option where the information travels with the call instead of being asked for afterwards.',
            'A coupling that disappears from the diagram has not disappeared from the system.',
          ],
          explanation: 'Remove the reason for the backward arrow, and let the caller that already holds the information pass it on. Merging is defensible. Retries and a shared table treat the symptom or hide the dependency.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-14-arrange-1',
          kind: 'arrange',
          title: 'Order the wallet payment flow',
          prompt: 'Put the messages in the order they happen in time.',
          concept: 'sequence diagram',
          language: 'text',
          solution: [
            'Owner asks Sales to charge the customer',
            'Sales asks Payments to start a payment',
            'Payments creates a payment request at the wallet provider',
            'Payments tells Sales the payment is pending, and Sales tells the owner it is waiting',
            'The wallet provider tells Payments the payment is confirmed',
            'Payments tells Sales, and Sales reduces stock in Inventory and shows Paid',
          ],
          reasons: [
            'The flow starts with a person asking for something.',
            'Sales hands the money part to the component that owns it.',
            'The outside provider is the only one that can create the request.',
            'The owner is told to wait. Nothing holds the request open.',
            'The confirmation arrives later, as its own message.',
            'Only now is the sale complete, so stock is reduced and the owner is told.',
          ],
          hints: [
            'Which message must exist before anything can be pending?',
            'The confirmation comes from the wallet provider, after the customer has paid, not as a reply to the first call.',
            'Reducing stock happens when the payment is confirmed, not before.',
          ],
          explanation: 'The flow runs request, pending, then confirmation later. The key is that the owner gets an answer ("waiting") straight away, and the final result arrives as a separate message.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-14-match-1',
          kind: 'match',
          title: 'Which kind of coupling is it?',
          prompt: 'Match each situation to its kind of coupling.',
          concept: 'coupling',
          labels: { terms: 'The situation', meanings: 'Kind of coupling' },
          pairs: [
            { term: 'Sales passes a product id and a quantity to Inventory', definition: 'Data coupling: only a simple value crosses the boundary', note: 'Nothing else about either component is shared.' },
            { term: 'Reports and Sales both write the sales_total column', definition: 'Shared database coupling: either can break the other, and no call shows it', note: 'The link is a table, not an interface.' },
            { term: 'Two components import the same discount-rules library', definition: 'Shared logic coupling: a rule change forces both to change and release', note: 'The rule lives in one place and is copied into both.' },
            { term: 'Sales fails unless Payments is running at that moment', definition: 'Timing coupling: one needs the other to be up at the same time', note: 'The link is about availability and speed.' },
            { term: 'Reminders calls Inventory\'s getStockLevel function and nothing more', definition: 'Interface coupling: one small public function carries the whole link', note: 'The contract is a single function that can be managed.' },
          ],
          hints: [
            'Ask what the two components share: a value, a table, a rule, a moment in time, or a function.',
            'Two situations are about things not shown by an arrow in a diagram.',
            'The one with a single named function is the interface case.',
          ],
          explanation: 'Each kind is defined by what is shared. Knowing which kind you have tells you how risky it is and where to look for the hidden ones.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-14-q1',
        prompt: 'Sales calls Payments, Payments calls Inventory, and Inventory calls Sales. What is the problem?',
        choices: [
          'A dependency cycle: none can be built, tested or changed alone. Remove an arrow by moving what is shared or inverting one direction.',
          'Too many synchronous calls: converting all three to events would remove the problem entirely, without changing who depends on whom in the code.',
          'Too few components: adding a fourth in the middle would break the circle and let the other three be tested separately.',
          'Nothing: three components that call each other are a normal sign of high cohesion in a design.',
        ],
        answer: 0,
        explanation: 'A circle of dependencies means no part stands alone. Changing the style of the calls does not change who depends on whom, and adding a middle component without moving what is shared hides the cycle instead of fixing it.',
      },
      {
        id: 'software-architecture-ai-14-q2',
        prompt: 'Which kind of coupling is hardest to see in a component diagram?',
        choices: [
          'Calls through a public interface, because the function names are not drawn on the arrow and so are easy to overlook.',
          'Two components writing the same database table, since no arrow between them shows the link.',
          'A component passing an id to another, because ids look the same as any other data.',
          'Events published to a bus, because the arrows go to a bus and not to the receivers.',
        ],
        answer: 1,
        explanation: 'A shared table creates a dependency without an arrow, so it is invisible until something breaks. The other options show up as an arrow, even if the label is brief.',
      },
      {
        id: 'software-architecture-ai-14-q3',
        prompt: 'In the e-wallet payment flow, which step should not hold the owner\'s request open?',
        choices: [
          'Creating the payment request at the provider, which must complete before the owner can be given a link to show the customer.',
          'Telling the owner the payment is pending, since the screen should not change until the sale is final.',
          'Reducing stock in Inventory, because that must finish before the owner sees any message at all.',
          'Waiting for the customer to finish paying in their wallet app. The confirmation arrives later as a message.',
        ],
        answer: 3,
        explanation: 'A person paying in another app can take minutes, so the owner should be told "waiting" at once. The request for the payment link is fast, and stock is reduced after the confirmation.',
      },
      {
        id: 'software-architecture-ai-14-q4',
        prompt: 'When is a sequence diagram worth drawing?',
        choices: [
          'For every function in the codebase, so that each one has documentation beside it.',
          'Whenever two components exchange a single message, so that nobody has to guess the order in which things happen.',
          'When one flow crosses three or more components and you need to see where it waits and where it can fail.',
          'Only after the system is built, to describe to new developers what the code already does.',
        ],
        answer: 2,
        explanation: 'Sequence diagrams earn their place for flows that cross several components. For two components a sentence is enough, and for every function the diagrams would go stale quickly.',
      },
      {
        id: 'software-architecture-ai-14-q5',
        audience: { max: 'beginner' },
        prompt: 'A waiter takes an order to the kitchen and stands there until the food is cooked before serving anyone else. What is this like?',
        choices: [
          'A message pinned on a rail so that the kitchen can pick it up later.',
          'A cycle: two people at a narrow door, each waiting for the other to go first.',
          'A synchronous call: the caller waits, so everything it does is delayed.',
        ],
        answer: 2,
        explanation: 'The waiter waiting at the kitchen is the caller waiting for an answer. The rail is the asynchronous version.',
      },
      {
        id: 'software-architecture-ai-14-q6',
        audience: { min: 'advanced' },
        prompt: 'Four services call each other in a chain, and each waits for the next for the same length of time. What is wrong?',
        choices: [
          'Nothing, since equal timeouts make the behaviour of the chain easy to predict.',
          'A caller can time out and retry while deeper calls still run, multiplying load. Timeouts should shrink down the chain.',
          'The last service in the chain will always fail first, because it has the least time left to respond to its own caller.',
          'The timeouts add up, so the user always waits for the sum of them whatever happens inside.',
        ],
        answer: 1,
        explanation: 'If a caller gives up when its callee is still working, retries add work for a service that is already slow. Shrinking timeouts along the chain lets the deeper calls stop before their callers give up.',
      },
    ],
    task: {
      title: 'Draw one flow and test every arrow',
      minutes: 20,
      steps: [
        'Pick one flow in a system you know that crosses at least three components (a checkout, a signup, a report). Write its steps in order, naming who does each.',
        'Draw it as a sequence diagram (the workbench from lesson 13 or any Mermaid editor) and mark which arrows make the sender wait.',
        'For each arrow write: what happens if the receiver is down for a minute, what the timeout is, and whether a repeat is safe.',
        'List the dependencies the flow creates and check for a cycle. Change one arrow to asynchronous if the user does not need the answer, and note what they would see.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use ordering food from a delivery app as the flow. Mark which steps you wait for as a customer (payment accepted) and which can happen later (an email receipt).'] },
      { audience: { min: 'advanced' }, steps: ['Write a timeout budget for the whole flow so that timeouts shrink along the chain, and decide where an idempotency key is needed. Describe which contract test would catch a breaking change to one message.'] },
    ],
  },
  {
    id: 'software-architecture-ai-15',
    day: 15,
    title: 'High-Level and Low-Level Design, and Designing for Maintainability',
    summary: 'Decide at the right level, use a class diagram only where it helps, and apply a short set of habits that keep one component easy to change.',
    intro: {
      objectives: [
        'Tell high-level design decisions from low-level ones and decide each at the right cost',
        'Use a UML class diagram where relationships are the design, and skip it where it is overkill',
        'Apply habits that keep a component easy to understand, change and test, without speculative abstraction',
      ],
      why: 'A sound overall design can still be slow to change if the inside of each part is tangled. Maintainability is where your design pays off every week for the life of the system.',
    },
    minutes: 26,
    skills: ['arch-components'],
    body: [
      { type: 'paragraph', text: `Lessons 13 and 14 worked at the level of components. Now we zoom in and out. **High-level design** (HLD) decides the big shape: the containers, the main components, the data stores and the main flows. **Low-level design** (LLD) decides what is inside one component: its types, functions, data structures and error handling. The two levels hold different decisions, and they cost different amounts to change. The quality that links them is **maintainability**: how cheaply and safely people can understand, change, test and fix the system.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack's high-level design held up well. Reminders was a module with a clear job, behind an interface, owning its own data. Inside it, though, one very long function handled every reminder, with a branch for each type: low stock, then overdue customer debts. Then the owners asked for reminders about products near their expiry date. Adding it meant editing the function in six places. One branch was missed, and for a week every owner received the same text twice.` },
      { type: 'paragraph', text: `Nothing in the high-level design was wrong. No diagram of containers would have shown the problem. The cost was in the low-level design: a part that changes often, the list of reminder types, was spread through the code instead of being isolated.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Remember the cost-of-change test from the first lesson: a decision is architectural to the degree that it is expensive to reverse. That tells you which level to decide at. High-level decisions, such as which data store, how components communicate and where the boundaries are, are costly to undo because they involve data migrations, contracts and several teams. They deserve a diagram and a decision record. Low-level decisions, such as how to arrange types inside one component, can be changed with a refactor and tests, so they deserve less ceremony.` },
      {
        type: 'table',
        headers: ['', 'High-level design', 'Low-level design'],
        rows: [
          ['Questions', 'What are the containers and components? How do they talk? Where does data live?', 'What types and functions are inside this component? How are errors handled?'],
          ['Cost to change if wrong', 'High: migrations, contracts, several teams', 'Lower: a refactor inside one component, with tests'],
          ['Typical tools', 'C4 views, a sequence diagram, a decision record', 'A short sketch, code, tests, sometimes a class diagram'],
        ],
        caption: 'The level tells you how much ceremony a decision deserves. Spend the most where reversing is most expensive.',
      },
      { type: 'paragraph', text: `This is not an invitation to design every class in advance. Decide the costly things at the high level. Inside a component, sketch only the part that is risky or shared, then write the code and refactor as you learn. A design that is more detailed than the problem requires is itself a cost.` },
      { type: 'paragraph', text: `**Maintainability** is often broken into smaller qualities: the code is easy to understand, easy to change without breaking something else, easy to test, and easy to diagnose when it fails. A short set of habits serves all four:` },
      { type: 'list', items: [
        '**One reason to change.** A component or type should have one job. If two different needs would both force you to edit it, split it.',
        '**Isolate what varies.** Put the part that changes often behind a small interface, so a new case is added and not edited in. Here, each reminder type becomes its own rule.',
        '**Separate decisions from effects.** Keep the pure logic ("given this store, which messages?") apart from reading data and sending texts. The logic can then be tested with no database or network (the idea from lesson 11).',
        '**Make wrong states hard.** Use types and explicit results so an impossible case cannot be written by accident, and name things in the business\'s words (lesson 13).',
        '**Handle errors at the boundary** and decide what happens when the text provider fails: retry, give up, or record it.',
        '**Keep tests and decisions.** Tests pin behaviour so you can change the inside. A short decision record explains the why that code cannot.',
      ] },
      { type: 'paragraph', text: `There is a limit. Abstraction has a price, and a wrong abstraction usually costs more than a little repeated code. A common habit is to wait until a second or third real case shows what should be general, and not to build a flexible framework for cases that may never come. "Isolate what varies" means what has actually varied or is likely to vary soon, not everything.` },
      { type: 'paragraph', text: `Here is the reminder fix in code. The rules are small values behind one interface, and one pure function applies them:` },
      {
        type: 'code',
        language: 'typescript',
        label: 'Isolating what varies, with pure logic',
        code: `export type StoreSnapshot = {
  storeId: string;
  lowStockCount: number;
  overdueDebtCount: number;
};

export interface ReminderRule {
  name: string;
  message(store: StoreSnapshot): string | null;
}

export const lowStockRule: ReminderRule = {
  name: 'low-stock',
  message: (store) => (store.lowStockCount > 0 ? store.lowStockCount + ' products are low on stock.' : null),
};

export const overdueDebtRule: ReminderRule = {
  name: 'overdue-debt',
  message: (store) => (store.overdueDebtCount > 0 ? store.overdueDebtCount + ' customer debts are overdue.' : null),
};

export function remindersFor(store: StoreSnapshot, rules: ReminderRule[]): string[] {
  const messages: string[] = [];
  for (const rule of rules) {
    const text = rule.message(store);
    if (text) messages.push(text);
  }
  return messages;
}`,
      },
      { type: 'paragraph', text: `The expiry reminder is now one new rule added to the list, and each rule can be tested with a small snapshot. The code that reads data and sends texts sits outside, behind ports (lesson 11).` },
      { type: 'paragraph', text: `When does a **UML class diagram** (UML was introduced in lesson 14) earn its place? It shows types, what they hold and how they relate. It is worth drawing when you are designing a small set of collaborating types and the relationships are the design: which interface, who implements it, who uses whom. It is not worth drawing for a whole system, because it goes stale as the code changes, for plain data (an ER diagram or the code says it better), or when the code is already clear. For most work, a sketch of three to six types on a whiteboard is enough, and UML is overkill.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `classDiagram
  class ReminderRule {
    <<interface>>
    +message(store)
  }
  class LowStockRule
  class OverdueDebtRule
  class ExpiryRule
  class ReminderScheduler {
    +runForStore(store)
  }
  class TextSender {
    <<interface>>
    +send(phone, message)
  }
  ReminderRule <|.. LowStockRule
  ReminderRule <|.. OverdueDebtRule
  ReminderRule <|.. ExpiryRule
  ReminderScheduler --> ReminderRule
  ReminderScheduler --> TextSender`,
        caption: 'Four to six types, and the relationships are the point. A dashed line with a hollow head means "implements". The scheduler depends only on the two interfaces, so ExpiryRule was added without touching it.',
      },
      {
        type: 'table',
        headers: ['What you see in the code', 'What it tells you', 'Design move'],
        rows: [
          ['One change touches many files', 'A responsibility is spread out', 'Gather it into one component'],
          ['A long function with a branch per type', 'The part that varies is not isolated', 'A small interface with one implementation per case'],
          ['Tests need the whole system', 'Logic is tied to effects', 'Separate pure logic from reading and sending'],
          ['The same rule is written in two places', 'Nobody owns it', 'One owner, others call it'],
          ['Nobody knows why it is this way', 'The decision was not recorded', 'A short decision record beside the code'],
        ],
        caption: 'Signals of low maintainability, and the usual move for each. They are prompts for questions, not laws.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: high-level design is the floor plan of a house: which rooms there are, where the doors are, where the pipes and the electricity come in. Low-level design is the wiring inside one room: where each socket and switch goes. If the floor plan is wrong, you must knock down walls. If the wiring in one room is messy, you open that wall only. Maintainability is whether a future electrician can find what they need: labelled wires, enough sockets in the right places and a note on why things were done this way. In the code above, each reminder rule is one clearly labelled wire, so adding a new one means adding a wire, not rewiring the room.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Measure maintainability with signals rather than opinion: how many files a typical change touches, how long the test suite takes, how long a new developer takes to make a first safe change, and how often changes cause a fault. Turn coupling rules into automatic checks (fitness functions, module 12) so they do not erode. In legacy code, pin the current behaviour with tests before refactoring, because you cannot tell a refactor from a break without them. Generated code raises the stakes: assistants produce volume quickly, including duplicated rules and abstractions nobody asked for, so review for these specifically. Prefer code that is easy to delete over code that is flexible, since most flexibility is never used, and keep the reasons for decisions next to the code that depends on them.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant designs the classes for TindaTrack reminders',
        prompt: `Design the classes for TindaTrack's reminder feature. It sends owners a text for low stock, for overdue customer debts and for products near their expiry date.`,
        output: `Proposed design:\n- AbstractReminderBase (parent of all reminder classes)\n- ReminderStrategyFactoryProvider\n- ReminderFactory\n- LowStockReminder, OverdueDebtReminder, ExpiryReminder (each extends AbstractReminderBase)\n- ReminderObserverRegistry\n- RetryPolicyEngine\n- ReminderAnalyticsDashboard\n- ReminderManager (25 methods for scheduling, sending, formatting and logging)\n\nThis design is flexible, extensible and ready for future requirements.`,
        notice: `Count what the requirements ask for: three kinds of reminder. The answer has eleven types, a deep inheritance chain and two factories, and two components, a retry engine and an analytics dashboard, that nobody asked for. ReminderManager with 25 methods does everything, so it has many reasons to change. "Ready for future requirements" is the speculation the lesson warned about. Ask the assistant to map each type to a stated requirement and to remove any that cannot be mapped. For three rules, an interface, three implementations and a function that applies them is enough.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take one component of your own that has grown hard to change. Write down what changes most often in it, and your sketch of how you would isolate that, before you ask.` },
      {
        type: 'prompt',
        label: 'Critique my low-level design',
        text: `My component: [one sentence on its job].\nWhat changes most often in it: [list, with real examples from the last months].\nMy sketch: [types or functions and their responsibilities, and the interface I would put around the part that varies].\nRequirements it must meet: [list].\n\nAct as a critic. Please:\n1. Map each type or function in my sketch to a requirement or a real recent change, and mark any that map to nothing.\n2. Tell me which parts of my sketch have more than one reason to change.\n3. Show where my logic is mixed with reading data or sending messages, and how I would separate them.\n4. Say which tests would pin the behaviour so that I can refactor safely.\n5. Say where my design adds abstraction that has not yet paid for itself.\n\nDo not add types or features I did not list. Tell me what you cannot know without seeing the code.`,
      },
      { type: 'paragraph', text: `What to verify: that every type the assistant keeps is tied to a requirement or an actual past change, and that any new abstraction is justified by something you have really seen vary. Open the code and test the claims. The design remains yours.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Find one long function with a branch per case in your own code, and isolate what varies as the lesson shows (the practical challenge below).',
        'Next module starts with "Choosing SQL, NoSQL or Both: Fit the Data, Not the Fashion", which applies the same discipline to data.',
        'In module 11 you will see how to keep these boundaries and rules from eroding with import checks and architecture tests.',
      ] },
      { type: 'takeaways', items: [
        'Decide the costly-to-reverse things at the high level, with a diagram and a record. Keep detail inside a component light and refactor as you learn.',
        'Maintainability means easy to understand, change, test and diagnose.',
        'Habits: one reason to change, isolate what varies, separate decisions from effects, use business words, make wrong states hard, handle errors at the boundary and keep tests and records.',
        'A class diagram earns its place for a few collaborating types where relationships are the design, and not for a whole system.',
        'Abstraction has a price. Isolate what has actually varied, not everything.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-15-scenario-1',
          kind: 'scenario',
          title: 'Which decisions go in the meeting?',
          prompt: 'Choose the best way to split the decisions between a design meeting and the code.',
          concept: 'high-level versus low-level design',
          situation: 'TindaTrack is adding a reminder feature. The team of three has a list of open questions: which database the reminders read from, whether the nightly job runs as its own scheduled container, how the reminder rules are arranged as types, and what each helper function is called.',
          options: [
            { text: 'Decide the database and the container question in a short design discussion with a recorded decision. Leave the types and function names to the developer, with a quick sketch reviewed in the pull request.', consequence: 'The costly questions get attention and a record. The cheap ones stay cheap and are corrected in review if they are wrong.', quality: 'best' },
            { text: 'Decide all four in the meeting, down to the names of the types, so that nothing is left open.', consequence: 'Everything is settled, but the meeting is long and two of the decisions are changed within a week when the code shows a better way.', quality: 'acceptable' },
            { text: 'Leave all four to the developer, who will pick whatever is fastest.', consequence: 'The container question is decided by accident, in a pull request, after the code is written. The team finds out when it deploys.', quality: 'poor' },
            { text: 'Draw a full class diagram of the whole system first, so that every type is agreed before any code is written.', consequence: 'The diagram takes days and is out of date after the first week of coding. It does not settle the database or the container question.', quality: 'poor' },
          ],
          hints: [
            'Which of these decisions would be expensive to reverse once the code and data exist?',
            'Which are cheap to change with a refactor?',
            'A diagram or a meeting is a cost. Where does it buy the most?',
          ],
          explanation: 'Spend ceremony where reversal is costly: the database and the deployment shape. Naming and the arrangement of types inside a component can be fixed in review and refactors. Designing everything up front costs time and goes stale.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-15-match-1',
          kind: 'match',
          title: 'Symptom and design move',
          prompt: 'Match each symptom to the design move that addresses it.',
          concept: 'maintainability',
          labels: { terms: 'The symptom', meanings: 'The design move' },
          pairs: [
            { term: 'Adding an expiry reminder means editing six places in one long function', definition: 'Isolate what varies behind a small interface, one implementation per reminder rule', note: 'The list of reminder types is the part that changes.' },
            { term: 'Testing the low-stock rule needs a running database and a text server', definition: 'Separate the pure rule from reading and sending, so it takes a snapshot and returns text', note: 'The rule is tied to effects that the test does not need.' },
            { term: 'The reorder-point check is written in both Inventory and Reminders', definition: 'Give the rule one owner and let others call it through its interface', note: 'Two copies will drift apart.' },
            { term: 'A new developer asks why Reminders cannot read the stock tables, and nobody knows', definition: 'Record the decision in a short decision record beside the code', note: 'The reason was never written down.' },
            { term: 'A class named ReminderManager has 25 unrelated methods', definition: 'Split it by reason to change, one responsibility for each part', note: 'It changes for many unrelated reasons.' },
          ],
          hints: [
            'Ask which habit from the list the symptom breaks.',
            'Two symptoms are about code that is hard to test or to extend. Two are about knowledge: who owns it and why.',
            'A class with many unrelated methods has many reasons to change.',
          ],
          explanation: 'Each symptom matches one habit: isolate what varies, separate decisions from effects, give a rule one owner, record the why and keep one reason to change per part.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-15-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Does a class diagram earn its place?',
          prompt: 'Tap each situation and read whether a class diagram is worth drawing.',
          concept: 'UML class diagram',
          cards: [
            { front: 'Three rule types that all implement one interface used by a scheduler', back: 'Yes. A few collaborating types, and the relationships (interface, implementations, who uses whom) are the design.' },
            { front: 'Every class of a system with two hundred types', back: 'No. It would be unreadable, and it would be out of date within days. Draw a C4 component view and look at the code.' },
            { front: 'A list of the columns of a database table', back: 'No. An ER diagram or the schema says it better, and a class diagram adds nothing.' },
            { front: 'A function and a helper in one file, used in one place', back: 'No. The code is already clear and a diagram is overkill.' },
          ],
          hints: [
            'Ask whether the relationships between types are the thing you are designing.',
            'Think about how long the diagram will stay true.',
            'A diagram is worth drawing only if someone will learn something from it that the code does not show quickly.',
          ],
          explanation: 'A class diagram earns its place for a small set of collaborating types where the relationships are the design. For a whole system, a data table or one function, another tool or no diagram at all is better.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-15-q1',
        prompt: 'Which decision belongs in high-level design, with a diagram and a recorded decision?',
        choices: [
          'What the private helper functions inside one module are called, since names are visible to every reader of the code.',
          'Whether to use a for loop or a map to apply a list of rules inside one function.',
          'How many classes to use for the three kinds of reminder inside the Reminders module, and what each one is called.',
          'Whether the nightly reminder job runs as its own scheduled container and reads stock through Inventory\'s interface.',
        ],
        answer: 3,
        explanation: 'A deployment shape and a boundary are costly to reverse and affect other components. Names, loops and the arrangement of types inside one module can be changed with a refactor.',
      },
      {
        id: 'software-architecture-ai-15-q2',
        prompt: 'Adding a new reminder type means editing six places in one long function. Which change addresses the cause?',
        choices: [
          'Add comments marking the six places so that the next developer cannot miss one.',
          'Split the long function into six shorter functions, one for each place that must be edited, so that each is easier to read.',
          'Put each rule behind a small interface and add the new one as a new implementation, without changing the code that applies them.',
          'Move the reminder code to its own microservice, where a new type can be deployed without touching any other code in the app.',
        ],
        answer: 2,
        explanation: 'The cause is that the part that varies is spread through the code. Isolating it behind an interface makes a new case an addition. Comments and shorter functions leave the spread in place, and a service is a far larger change for a local problem.',
      },
      {
        id: 'software-architecture-ai-15-q3',
        prompt: 'When does a UML class diagram earn its place?',
        choices: [
          'When designing a few collaborating types whose relationships, such as interfaces and users, are the design.',
          'When documenting an entire system, so that every class is recorded in one place for new developers to read.',
          'When describing the columns of a database table, because it lists names and types.',
          'Whenever a team starts a new project, since it is the standard way to begin the design of any system.',
        ],
        answer: 0,
        explanation: 'A class diagram helps when the relationships between a few types are the thing you are working out. A whole-system diagram goes stale, tables are better shown in an ER diagram, and a ritual diagram has no question to answer.',
      },
      {
        id: 'software-architecture-ai-15-q4',
        prompt: 'A teammate proposes a ReminderStrategyFactoryProvider for the three reminder rules. What is the best response?',
        choices: [
          'Accept it, because a factory provider makes the code ready for every future reminder type that the owners may ask for.',
          'Ask which requirement needs it. For three rules, an interface and three implementations is enough until a fourth case appears.',
          'Reject any abstraction in the reminders code, since every abstraction makes code harder to read.',
          'Ask for a second factory as well, so that the creation of a rule is kept apart from the selection of which rule to use.',
        ],
        answer: 1,
        explanation: 'Abstraction has a price and should be justified by a real need. Three rules do not require a factory provider. Rejecting all abstraction is the opposite mistake, since an interface for the rules is justified by the change that already happened.',
      },
      {
        id: 'software-architecture-ai-15-q5',
        audience: { max: 'beginner' },
        prompt: 'The floor plan of a house is high-level design. Which of these is low-level design?',
        choices: [
          'Deciding how many floors the house has and where the stairs between them will go.',
          'Deciding where each socket and switch goes inside one room.',
          'Deciding where the front door and the road meet, and how the path to the door runs.',
        ],
        answer: 1,
        explanation: 'Low-level design is the detail inside one part, such as the wiring in one room. The number of floors and the position of the entrance belong to the floor plan.',
      },
      {
        id: 'software-architecture-ai-15-q6',
        audience: { min: 'advanced' },
        prompt: 'Which is the most honest way to find out whether a codebase is becoming harder to maintain?',
        choices: [
          'Count the lines of code, because a larger system is always harder to maintain than a smaller one that does the same work.',
          'Ask the team once a year whether they enjoy working in the code.',
          'Watch signals such as the files a typical change touches and test run time, and encode coupling rules as checks.',
          'Count the number of classes and set an upper limit that the team agrees not to cross, which keeps the design small.',
        ],
        answer: 2,
        explanation: 'Signals from real changes and automatic checks track the actual cost of change. Lines and classes measure size, not changeability, and an annual opinion arrives too late to act on.',
      },
    ],
    task: {
      title: 'Isolate what varies in one tangled function',
      minutes: 20,
      steps: [
        'Find a long function in your own code (or a teammate\'s) with a branch for each type or case. List what varies from case to case, and how often a new case has appeared in the last months.',
        'Write the small interface (two or three lines) that would hold the part that varies, and one implementation of it. Keep the function that applies them free of any case-specific code.',
        'Separate the pure decision ("given this, what result?") from reading data or sending anything. Write one test for one case that needs no database and no network.',
        'Decide whether a class diagram would help. Draw one only if three or more types collaborate and the relationships are the point. Write what you did not abstract, and why.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Run the reminder code from the lesson in your own editor. Add a third rule for products near expiry that returns a message when a number in the snapshot is above zero, and notice that you did not change remindersFor.'] },
      { audience: { min: 'advanced' }, steps: ['Before refactoring, write characterization tests that pin the current output of the tangled function for five real inputs. Then refactor, and write the coupling rule you would turn into an automatic check so the design does not erode.'] },
    ],
  },
];
