import type { Lesson, Project } from '../../../types';

// Module 1: Introduction to Software Architecture (lessons 1 to 4, days 1-4, no project). Written 2026-11-18.
// No product facts are stated, so there are no version notes. TindaTrack, Marlon and every number are invented.
// Demos ("AI in Action") are hand-written illustrations, never a real model's output.

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-01',
    day: 1,
    title: 'What Software Architecture Is, and What It Is Not',
    summary: 'Define architecture as the decisions that are expensive to change, and use the cost-of-change test to tell it apart from everyday design.',
    intro: {
      objectives: [
        'Explain software architecture as the decisions that are expensive to change later',
        'Apply the cost-of-change test to tell an architectural decision from a design decision',
        'Name four things architecture is not, and say why the simplest design that meets the requirements is the baseline',
      ],
      why: 'AI assistants and frameworks make architectural decisions for you whenever you do not. Spotting which decisions are costly to reverse is the first skill of everything else in this course.',
    },
    minutes: 22,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `You can build features for years without using the word "architecture", and many good developers do. Then a request arrives that is not another feature: "Can two stores use this?" or "Can it work with no signal?" Suddenly the code you wrote is easy to read and very hard to change. This lesson gives you a working definition of architecture, one test that separates it from ordinary design, and a short list of things it is not.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Marlon is a developer. In one weekend he builds TindaTrack for his aunt's sari-sari store (a small neighbourhood shop). Version one is a phone app. Sales and stock are saved in the phone's own storage. It works well, and the aunt uses it every day.` },
      { type: 'paragraph', text: `Two requests arrive in the same week. First, his aunt wants the "Record sale" button green instead of blue. Marlon changes one line and ships it in ten minutes. Second, her cousin runs another store and wants to see both stores' sales together, from his own phone. Marlon opens the code and finds that every screen reads and writes the phone's storage directly. To share data he now needs a server, accounts, a way to send sales from each phone to the server, and a plan for sales entered with no signal. Every screen has to change. It takes weeks.` },
      { type: 'paragraph', text: `The second request was not harder to understand. It touched a decision that was made on day one without anyone noticing: where the data lives. For one shop, saving locally was a sensible and simple choice, so Marlon did not make a mistake. His mistake was not knowing that it was a decision, so nobody weighed what it would cost to reverse.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Software architecture** is the set of decisions about how a system is divided into parts, how those parts depend on each other and on the outside world, and which rules they follow, **when those decisions are expensive to change later**. The structure that results (the parts and their relationships) is also called the architecture. The key phrase is "expensive to change". Architecture is not "the big boxes" and not "what senior people decide". It is whatever would hurt to reverse.` },
      { type: 'paragraph', text: `The **cost-of-change test** puts this to work. For any decision, ask: if we get this wrong, how much of the system has to change to fix it? If one developer can fix it in a day, in one place, it is design: decide quickly and move on. If the fix spreads across many places, needs saved data to be converted, or needs other teams to agree, it is architecture: decide on purpose and write the reasoning down.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  D[A decision to make] --> Q{Can one person undo it in a day, in one place?}
  Q -->|Yes| Design[Design: decide fast and move on]
  Q -->|No| Arch[Architecture: decide on purpose]
  Arch --> W[Write down the options and why you chose]
  Design --> R[Change it later if it hurts]`,
        caption: 'The cost-of-change test. Look at the question in the middle: the answer decides how much care and writing the decision deserves.',
      },
      {
        type: 'table',
        headers: ['Decision in TindaTrack', 'What reversing it costs later', 'Treat it as'],
        rows: [
          ['The colour of the Record sale button', 'One line, minutes', 'Design'],
          ['The name of a function inside the sales code', 'A rename in one file', 'Design'],
          ['Where sales data lives (phone only, server, or both)', 'Every screen changes, and saved data has to move', 'Architecture'],
          ['Whether the app must keep working with no internet', 'Changes how every save and every read works', 'Architecture'],
          ['How money is stored (whole centavos or decimals)', 'Every calculation and every saved amount must be converted', 'Architecture, although it looks small'],
          ['Which library draws one chart on the report screen', 'One screen is rewritten; the data and the rules are untouched', 'Design, if the chart code is kept in one place'],
        ],
        caption: 'The same test, applied row by row. The cost is about how far the change spreads, not how hard the idea is.',
      },
      { type: 'paragraph', text: `An analogy, and only an analogy: in a house, repainting a room or moving a lamp is cheap, while moving a load-bearing wall or the plumbing is not. Nobody calls the paint colour "structure", and nobody holds a meeting about it. Software has no walls, though, and a wall in software can be made cheaper to move if you plan for it. That is part of the job: keep the expensive decisions few, and make them reversible where you can.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In everyday words: a **component** is one part of a system with one job, such as "the part that saves sales". A **dependency** means one part needs another to work, the way a kitchen needs a water supply. Design is the choice of how to do a job inside one part. Architecture is the plan of which parts exist and how they depend on each other. Think of a floor plan versus the colour of the curtains: you can change the curtains on a Saturday, but changing the floor plan after the walls are up is a project. Whenever you see a software decision, ask yourself, "Is this the curtains or the floor plan?"` },
      { type: 'paragraph', text: `What architecture is **not** is just as useful to know:` },
      { type: 'list', items: [
        '**Not a diagram.** A diagram describes the architecture. A system with no diagram still has one; it is just undocumented, and usually accidental.',
        '**Not a job title.** Any developer who makes an expensive-to-change decision is doing architecture, whatever the title says.',
        '**Not a list of fashionable technologies.** "We use microservices" names a style, not a reason. A reason is a requirement the style helps to meet.',
        '**Not one big plan made at the start.** Early decisions are made with the least information. The skill is to decide now only what you must, and to keep the rest cheap to change.',
        '**Not something small systems lack.** TindaTrack on one phone has an architecture: one app and local storage. For one shop, it was the right one.',
      ] },
      { type: 'paragraph', text: `One baseline runs through this whole course: **the simplest architecture that meets the stated requirements.** For TindaTrack today that is probably one app, one server and one database. Each fancier choice in later lessons (microservices, queues, a second database) comes with a stated cost, so you choose it only when a requirement pays for it.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a system that already exists, the architecture you have is not the one on the slides. It is what the code makes hard. You can measure the real boundaries: files that always change together in version control history show coupling that diagrams hide, and a change that needed three teams shows a boundary that is real. Data usually outlives code, so a schema or an event format that other systems read is often the most expensive thing to change, more than any framework. Cost of change also depends on your tests and your release pipeline, which means two teams can classify the same decision differently. Treat the test as a question with a team-specific answer, and ask it again as the system grows: a decision that was cheap with one store may be costly with a hundred.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you have built a few apps, you already make architectural choices without calling them that: where a rule lives, which table owns a fact, which service sends the email. The shift in this course is to make those choices on purpose, say what each one would cost to reverse, and write down the ones that are expensive.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'Asking an assistant which decisions are architectural',
        prompt: `Here is my system: TindaTrack is a phone app for one sari-sari store. It saves sales and stock in the phone's storage. The owner wants to record sales, see today's total and get a low-stock list. List the architectural decisions this design contains and say which are hard to change later.`,
        output: `Decisions in your design:

1. Data lives on the phone only. Hard to change: every screen reads and writes it directly.
2. One app, one user. Hard to change: no accounts or roles exist yet.
3. Money is stored as decimal numbers in pesos. Moderately hard to change: every calculation depends on it.
4. The low-stock list is calculated on the phone each time it opens. Easy to change.

Recommendation: because TindaTrack must support 100,000 stores, move to microservices on Kubernetes with an event bus now, before the code grows.`,
        notice: `Items 1, 2 and 4 come straight from your description, and the "hard to change" labels are useful. Item 3 is a guess: your description never said how money is stored. It is a good question to check, not a fact. The final recommendation rests on "100,000 stores", a number you never gave, and it jumps to microservices without any requirement that needs them. For every claim, ask "which sentence of my description supports this?" and delete the claims that have no answer.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Pick a system you know well (your own project, or TindaTrack as described above). Write your own list of decisions that would be expensive to reverse before you ask for help, so the assistant reviews your thinking instead of replacing it. Then paste this prompt into Claude, ChatGPT or Gemini and fill in the brackets.` },
      { type: 'prompt', label: 'Review my architectural decisions', text: `I will describe a system and list the decisions I think are expensive to change. Do not design anything for me.

System (3 to 5 sentences: who uses it, what it stores, where it runs): [your description]

My list of expensive-to-reverse decisions, each with one line on what reversing it would cost: [your list]

Please:
1. Tell me which of my items you disagree with, and why.
2. List decisions hidden in my description that I did not list.
3. Next to every claim, quote the sentence of my description it comes from. Mark anything you assumed as ASSUMPTION.
4. Do not suggest new technology unless my description states a requirement that needs it.` },
      { type: 'paragraph', text: `What to verify: every ASSUMPTION the assistant marked, and any claim that has no quoted sentence. Then decide for yourself which of its extra decisions really pass the cost-of-change test in your system.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Apply the cost-of-change test to five decisions your current project made in the last month, and note which of them are written down anywhere.',
        'Read lesson 2, The Architect\'s Job, to see who makes these decisions and how to make them visible to a team.',
        'In lesson 4 you will write your first decision record, so keep your list of expensive decisions: it becomes the raw material.',
        'Skim the README or docs folder of a repository you work in, and look for decisions that are stated versus decisions you can only discover by reading the code.',
      ] },
      { type: 'takeaways', items: [
        'Architecture is the set of decisions about parts, dependencies and rules that are expensive to change later.',
        'The cost-of-change test: if a decision can be undone by one person in a day in one place, it is design; otherwise it is architecture and deserves a written decision.',
        'Architecture is not a diagram, a job title, a technology list, a one-time plan, or something small systems lack.',
        'The baseline for every lesson is the simplest architecture that meets the stated requirements; anything fancier must be paid for by a requirement.',
        'An AI assistant may invent requirements such as a user count: check every claim against what you actually wrote.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-01-scenario-1',
          kind: 'scenario',
          title: 'Marlon\'s list for this week',
          prompt: 'Choose the item Marlon should discuss first, before anyone writes more code.',
          concept: 'cost-of-change test',
          situation: 'TindaTrack is about to get a second store. Marlon has four things on his list: the colour of the Record sale button, the name of the main sales function, which library draws the weekly chart, and where the sales data will live now that two phones need to see it. His aunt keeps asking about the button colour.',
          options: [
            { text: 'Where the sales data will live: list the options and what each costs to change later, then write down the choice.', consequence: 'The team compares phone-only, a shared server and a mix of both, and picks the simplest one that lets two stores see each other. Because it is written down, the next change starts from a reason instead of a surprise.', quality: 'best' },
            { text: 'The weekly chart library: it is a quick decision and the aunt will notice it.', consequence: 'The chart is done in a day and looks nice. The storage question is still open, and the first screen built for two stores uses the wrong assumption.', quality: 'acceptable' },
            { text: 'The name of the main sales function: unclear names confuse new developers.', consequence: 'A rename tool fixes it in minutes. It is worth doing, but it was never going to be expensive, so it did not need priority.', quality: 'poor' },
            { text: 'The button colour: it is what the owner asked for, so do that first.', consequence: 'It ships in ten minutes and everyone is happy. Meanwhile the decision that will cost weeks keeps drifting, and the next screen deepens the phone-only design.', quality: 'poor' },
          ],
          hints: [
            'Apply the test to each item: how far would a wrong choice spread?',
            'One item changes how every screen reads and saves data. The others stay inside one place.',
            'Choose the item that is expensive to reverse, not the one that is easiest or most visible.',
          ],
          explanation: 'Where the data lives touches every screen and all saved data, so it is the architectural decision. The others fail the "expensive to change" test: they can be reversed by one person in one place. Small decisions still matter, but they do not need the same care.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-01-match-1',
          kind: 'match',
          title: 'What would reversing this cost?',
          prompt: 'Match each TindaTrack decision to the cost of reversing it later.',
          concept: 'cost-of-change test',
          labels: { terms: 'Decision', meanings: 'What reversing it costs' },
          pairs: [
            { term: 'Making the Total label on the sales screen bold', definition: 'One line in one file, a few minutes', note: 'A visual detail inside one component is the clearest design decision.' },
            { term: 'Deciding that the app must keep working with no signal', definition: 'Changes how every save and every screen read works', note: 'Offline support is not a feature of one screen: it changes how all data is saved and read.' },
            { term: 'Choosing which library draws one chart', definition: 'One screen is rewritten while data and rules stay untouched', note: 'It is contained, as long as the chart code sits in one place.' },
            { term: 'Storing money as decimal numbers in saved data', definition: 'Every calculation and every saved amount must be converted', note: 'It looks small, but it spreads into all code that touches money and all data already saved.' },
          ],
          hints: [
            'For each decision, ask how many places in the system it touches.',
            'Two of the decisions touch saved data or every screen. The others stay in one place.',
            'Match the widest-reaching decisions first, then the contained ones.',
          ],
          explanation: 'The cost of reversing depends on how far a decision spreads: into all screens, into saved data, or only into one component. That spread, not the difficulty of the idea, is what makes a decision architectural.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-01-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Is it architecture? Four common myths',
          prompt: 'Tap each statement to see whether it is true.',
          concept: 'what architecture is not',
          hints: [
            'Think of the floor plan versus the curtains.',
            'Ask whether the statement would still be true for a very small app.',
            'Remember that architecture is about decisions that are hard to undo.',
          ],
          explanation: 'Architecture is about costly decisions, so it exists in every system whether or not anyone draws it, and anybody can make those decisions.',
          cards: [
            { front: 'Architecture is a diagram of boxes and arrows.', back: 'No. A diagram describes it. The architecture is in the decisions and in the code, even if nobody drew a picture.' },
            { front: 'Only senior people do architecture.', back: 'No. Anyone who makes a decision that is expensive to reverse is doing architecture. Seniority only changes how often.' },
            { front: 'Small apps do not have an architecture.', back: 'No. A one-phone app with local storage has one: a single app and local data. It can be the right one.' },
            { front: 'A good architecture is the biggest one you can afford.', back: 'No. A good architecture is the simplest one that meets the stated requirements.' },
          ],
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-01-q1',
        prompt: 'A teammate wants to save sales in a new file layout that the owner\'s spreadsheet and a supplier\'s tool will start reading next month. How should the team treat this decision?',
        choices: [
          'As design: it is only one file, so anyone can rename the fields later without telling anyone, because the layout is private to TindaTrack and nothing else will depend on it.',
          'As architecture: other tools will depend on the layout, so changing it later needs coordination. Write the options and costs down first.',
          'As architecture only if the team has more than five developers, because small teams can always sort out a change like this in a hallway conversation.',
          'As design, since choosing a file layout is a coding detail and the format can be decided by whoever writes the export code that week.',
        ],
        answer: 1,
        explanation: 'Once other systems read a format, changing it needs their agreement and often a conversion, so it fails the cost-of-change test. Team size does not change the cost of the change itself.',
      },
      {
        id: 'software-architecture-ai-01-q2',
        prompt: 'A new developer says, "We have no architecture because nobody ever drew a diagram." What is wrong with this statement?',
        choices: [
          'Nothing: without a diagram there is no agreed structure to talk about, so the system has no architecture until someone draws one and the team agrees on it.',
          'Architecture only appears once a system has more than one server, so a system that runs on a single server does not have one, with or without a diagram.',
          'The system has an architecture only after a senior person has approved a written plan for it, because until then nobody has decided anything at all.',
          'The architecture is the structure and decisions already in the code. A diagram only describes it, so the system has one, just undocumented.',
        ],
        answer: 3,
        explanation: 'Every system has parts, dependencies and rules, written down or not. The risk of an undocumented architecture is that nobody knows which of its decisions were deliberate.',
      },
      {
        id: 'software-architecture-ai-01-q3',
        prompt: 'A team lead wants to start TindaTrack as microservices "because serious systems use them". What is the best response, using this lesson\'s baseline?',
        choices: [
          'Ask which stated requirement microservices would meet, compare with the simplest design that meets the requirements, and adopt them only if a requirement pays for the cost.',
          'Agree: it is cheaper to start with the final design than to change a simple one later, so starting with the largest design is always the safest choice for a young product that has not met a single customer yet.',
          'Reject every design with more than one deployable part, because splitting a system into pieces is always a mistake and a single program is always the better design, whatever the requirements say.',
          'Ask an AI assistant which style is most popular among serious systems and follow its answer, since popularity reflects the experience of many teams over many years of building software.',
        ],
        answer: 0,
        explanation: 'The baseline is the simplest architecture that meets the requirements. A style is justified by a requirement and its cost, not by fashion. The lesson does not forbid splitting; it asks for a reason.',
      },
      {
        id: 'software-architecture-ai-01-q4',
        prompt: 'Two teams apply the cost-of-change test to the same decision and disagree. What is the most likely explanation?',
        choices: [
          'One team does not understand the test, because the answer is always the same for a given decision on every project and every team, so one of the two must be misreading the question.',
          'The decision is architectural for neither team, because a disagreement shows that the decision is only an opinion and not a cost, and opinions do not need a written decision.',
          'The cost depends on each team\'s tests, releases and code layout, so the same decision can be cheap for one team and costly for the other.',
          'The larger team is always right, since larger teams have met more expensive decisions and have more experience judging their cost, whatever the decision is.',
        ],
        answer: 2,
        explanation: 'The test asks how far a change spreads and how safely it can be made. Tests, deployment and code organisation change both, so the answer is specific to a team and can change over time.',
      },
      {
        id: 'software-architecture-ai-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In the house comparison, which software decision is like moving a load-bearing wall?',
        choices: [
          'Changing the colour of a button on the sales screen.',
          'Deciding where all of the app\'s data is stored.',
          'Renaming a variable inside one file of the code.',
        ],
        answer: 1,
        explanation: 'Where data lives affects every part of the app and the data already saved, just as a load-bearing wall holds up the rest of the house. The other two are like repainting.',
      },
      {
        id: 'software-architecture-ai-01-q6',
        audience: { min: 'advanced' },
        prompt: 'You inherit a system whose slides show clean layers, yet every pricing change touches the billing, reports and notification code. What does this tell you?',
        choices: [
          'The slides are the architecture and the developers are simply ignoring them; the fix is a stricter code review before every change is merged.',
          'Pricing should become its own service straight away, because any code that changes together must be deployed on its own from then on.',
          'Nothing important: in a working system a change normally touches several modules, so this is normal and needs no investigation at all.',
          'The real boundaries differ from the drawn ones. Pricing is a coupling point, and that is the architecture you actually have.',
        ],
        answer: 3,
        explanation: 'What the code makes hard is the architecture you have. Code that always changes together shows coupling the slides hide. What to do about it (extract, redraw, accept) is a separate decision with its own costs.',
      },
    ],
    task: {
      title: 'Run the test on your own system',
      minutes: 15,
      steps: [
        'Choose a system you know well and list eight decisions already in it: where data lives, how the parts talk, where it runs, how users log in, how money or dates are stored, and so on.',
        'Next to each decision write what reversing it would cost (an hour, days, weeks, a rewrite) and who would be affected.',
        'Mark the decisions that would take more than a few days or involve other teams. Those are your architectural decisions.',
        'Check whether each one is written down anywhere (a document, a comment, a README). Write one sentence naming the unwritten decision that worries you most.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you do not have a system of your own, use an app you know well, such as a notes app. Guess five decisions it must have made (where notes are stored, whether it works offline, how it syncs) and decide which would be costly to change.'] },
      { audience: { min: 'advanced' }, steps: ['Pull the last three months of version control history for one repository and find two files that change together in many commits. Do your documents put them in the same component? Write down what the history says about the real boundary.'] },
    ],
  },
  {
    id: 'software-architecture-ai-02',
    day: 2,
    title: 'The Architect’s Job: Decisions, Trade-Offs and Communication',
    summary: 'See the architect’s work as finding costly decisions, comparing options by what each costs, and making the result visible to the whole team.',
    intro: {
      objectives: [
        'List the recurring activities of an architect: find, frame, compare, decide, communicate and revisit',
        'Describe an option as what you gain and what you pay, instead of as good or bad',
        'Explain why an architect who works alone and only draws diagrams fails',
      ],
      why: 'Whether or not your title says architect, you make these decisions as soon as your work affects other people. Doing it deliberately keeps your team from finding out about each other\'s choices in production.',
    },
    minutes: 24,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `Many developers picture an architect as someone who draws large diagrams and hands them down. In practice that is the least useful version of the job. The valuable part is smaller and more ordinary: noticing which decisions will be expensive to reverse, making sure someone owns each one, comparing the options honestly, and making sure the people who will build on the result know what was chosen and why. This lesson describes that work, and it applies to a lead developer, a tech lead or any developer who is making a shared decision.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `TindaTrack now has two developers: Marlon and Joy. Marlon's reports save money as whole centavos, stored as integers. A month later Joy adds a supplier price screen and stores prices as decimal pesos in the same database, which is natural to her. Both choices are reasonable on their own. But the stock value report now adds the two kinds together, and some totals are off by a centavo. One screen shows one number and another shows a different number for the same stock.` },
      { type: 'paragraph', text: `It takes a week to find. The reason is not carelessness. Nobody owned the question "how is money stored across the whole system?" In the same month Marlon spent two weekends drawing a twelve-box diagram with a message queue that nobody had asked for. Joy never opened it, because it did not describe the code she was working in. The fix, when it finally came, was a half-page note: "Money is stored as whole centavos in integer columns; convert at the screen edge." They agreed it in a twenty-minute conversation and linked it from the README. The note cost an afternoon. Its absence cost a week, and the unused diagram cost two weekends.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The architect's work is a loop of six activities. Anyone on a team may do any of them; the role exists so that all six get done by someone.` },
      { type: 'list', ordered: true, items: [
        '**Find** the decisions that pass the cost-of-change test from lesson 1, especially the ones no single developer owns, like how money, dates or user identity are handled everywhere.',
        '**Frame** each one with the requirements and constraints it must serve (module 2 teaches how). A decision without a stated need is a preference.',
        '**Compare** the options by what each gains and what each costs.',
        '**Decide**, and name who owns the decision. Spend effort in proportion to how costly the decision is to reverse.',
        '**Communicate** it: write it down, draw only what answers a question, and talk it through with the people it affects.',
        '**Revisit** it when an assumption changes, such as growth or a new constraint.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  N[Notice a costly decision] --> F[Frame it: requirements and constraints]
  F --> O[Compare the options and what each costs]
  O --> D[Decide and name the owner]
  D --> W[Write it down and share it]
  W --> B[Build and watch what happens]
  B -.->|An assumption changed| F`,
        caption: 'The decision loop. Look at the dashed arrow: the loop does not end at the decision, because assumptions change and decisions get revisited.',
      },
      { type: 'paragraph', text: `**Trade-offs** are the centre of step 3. A trade-off means that every option gains something by giving something up. "Good" and "bad" are not useful words about an architecture. "Good for these requirements, at this price" is. Always write an option as two halves: what you gain and what you pay.` },
      {
        type: 'table',
        headers: ['Option for TindaTrack', 'What you gain', 'What you pay'],
        rows: [
          ['Keep everything in one database', 'Simple to run, one backup, a sale and its stock change can be saved together', 'One place that can fail, and every feature shares its limits'],
          ['Put reports in a separate store', 'A heavy report cannot slow down recording sales', 'A second copy of the data to keep in step, and another system to run and watch'],
          ['Let the phone save sales first and send them later', 'Works with no signal', 'Conflicts to resolve when two phones change the same item, and more complex code'],
        ],
        caption: 'Each option as a gain and a price. None of them is "the best": they fit different requirements.',
      },
      { type: 'paragraph', text: `An analogy: choosing between a tricycle, a jeepney and a bus is not a matter of which vehicle is best. It depends on the route, the number of passengers and the cost. A decision is only meaningful for a route you have named, and that route is your requirements.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: think of the head cook of a busy kitchen. The head cook does not cook every dish. Their job is to make sure the choices that affect the whole kitchen (the menu, which supplier, who handles allergy orders) are made on purpose, and that every cook knows them. If each cook decided how to label allergies, the kitchen would get hurt. An architect does that for a software team. A **trade-off** is just the price tag on a choice: you gain something, and you pay something else.` },
      { type: 'paragraph', text: `**Communication** is half of the job, and it comes in different forms for different readers. Developers need the rule and where it applies ("money is whole centavos"). The business owner needs the consequence in plain words ("a second system costs extra to run, in exchange for faster reports"). A good decision note states the trade-off in a form both can read: "We chose X because we value A more than B. If B becomes more important, this is what would change."` },
      { type: 'paragraph', text: `This is why an architect who works alone fails. Decisions made without the people who build on them are not understood, not believed, or not followed, and they tend to drift away from the code. Stay close to the code, try a decision on one small real slice before you announce it, and measure your own success by whether developers can explain, in their own words, the decisions that affect their code.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `As an organisation grows, a single approver becomes a bottleneck and decisions start to wait for weeks, or teams stop asking. A pattern that scales better is to let teams decide contained, reversible decisions themselves after talking to the people affected, and to reserve review for decisions that cross team boundaries or are very hard to reverse. Every decision, large or small, goes into a shared log, so that the architect's leverage comes from the gaps between teams (shared data formats, identity, how services fail) rather than from approving everything. Also watch the other failure: a group that never decides because every option has a cost. A decision with a named owner and a date for revisiting is better than a perfect one that arrives late.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'Asking an assistant to act as the architect',
        prompt: `Act as the architect for TindaTrack, an inventory and sales app for small stores. Which database should we use? Give me one answer.`,
        output: `Use PostgreSQL. It is the best choice for TindaTrack. Because the app will handle millions of transactions per day, you need a database that scales horizontally, so run PostgreSQL on a managed cluster with three read replicas and a Redis cache in front. This is the industry standard and will not need to change.`,
        notice: `The answer decided for you, and the decision is delivered as a fact: no options, no costs, no "it depends". It also invented a volume ("millions of transactions per day") that nobody stated, and then built a read-replica and cache setup on top of it. A relational database may well be a sensible choice for TindaTrack, but the reasoning here is not usable. Ask for options with a gain and a price for each, ask which requirement each depends on, and make the decision yourself.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Choose a decision that really affects more than one person in your project. Write your two main options and the one you lean towards before you open the assistant. Then use it as a critic, not as the decider.` },
      { type: 'prompt', label: 'Critique my decision', text: `I am deciding: [the decision, in one sentence].

What it must serve (requirements and constraints I know): [your list]
Option A: [description]
Option B: [description]
My current leaning and why: [your reasoning]

You are my critic, not the decider. Do not pick a winner.
1. Ask me up to five questions about requirements I may have missed.
2. For each option write what I gain, what I pay, and the assumption that must be true for it to be a good choice.
3. Name one option I did not list, only if it fits the requirements I gave.
4. Mark anything you assumed with ASSUMPTION, and say what you cannot know about my situation.` },
      { type: 'paragraph', text: `What to verify: that every "gain" and "pay" actually applies to your requirements, that each ASSUMPTION is checked against facts you know, and that you answer the questions it asked. The decision, and the reason in your own words, stays yours.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write down the last shared decision your team made without discussion. Who owned it, and does anyone know why it was chosen?',
        'Next is lesson 3, which separates what a system does from how well it must do it, the framing for every decision above.',
        'Lesson 4 gives you the decision record format, so this week\'s decision can be written down properly.',
        'Ask a teammate to explain, in their own words, one architectural rule in your project. The gaps in their answer show where communication is thin.',
      ] },
      { type: 'takeaways', items: [
        'The architect\'s work is a loop: find, frame, compare, decide, communicate and revisit. Any developer can do it.',
        'Describe options as what you gain and what you pay; "best" has no meaning without stated requirements.',
        'Each decision needs a named owner and effort in proportion to its cost of reversal.',
        'Communication is half the job: write it down, share the trade-off in plain words, and check that others can explain it.',
        'An AI assistant is a critic that lists options, costs and assumptions. It never owns the decision.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-02-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Decide with AI as your critic',
          prompt: 'Build the workflow for making one shared decision, using an assistant to challenge your thinking without letting it decide.',
          concept: 'decision workflow',
          situation: 'The TindaTrack team must choose how phones save sales when there is no signal. Marlon wants to use an AI assistant to test his thinking. The decision affects both developers and the store owners, and the team wants it recorded so the reasoning is not lost.',
          parts: [
            { id: 'write-need', lane: 'input', label: 'Write the decision, requirements and constraints', detail: 'A few lines on what must be decided and what it has to serve.' },
            { id: 'list-options', lane: 'input', label: 'List your options and your leaning', detail: 'Write down the options you already see, and which one you lean towards.' },
            { id: 'ai-critic', lane: 'ai', label: 'Ask AI for questions, missing options, costs and assumptions', detail: 'The assistant acts as a critic and marks what it assumed.' },
            { id: 'ai-pick', lane: 'ai', label: 'Ask AI to pick the winner and adopt its answer', detail: 'The assistant chooses and the team follows its choice.' },
            { id: 'paste-secrets', lane: 'tool', label: 'Paste the production database password so AI sees the real settings', detail: 'Real credentials are copied into the chat to make the answer more specific.' },
            { id: 'team-talk', lane: 'human', label: 'Talk it through with the people it affects', detail: 'Developers and a store owner react to the options and the costs.' },
            { id: 'decide-owner', lane: 'human', label: 'Decide and name the owner', detail: 'A person decides, and says when the decision will be revisited.' },
            { id: 'write-record', lane: 'output', label: 'Write the decision record', detail: 'Context, options, the choice and its costs, in a short note.' },
            { id: 'share-record', lane: 'output', label: 'Keep the record in the repository', detail: 'The note lives where the team already looks for the code.' },
            { id: 'announce-bare', lane: 'output', label: 'Announce only the result in chat, with no reasons', detail: 'A one-line message says what was chosen.' },
          ],
          rules: [
            { id: 'need-first', kind: 'before', parts: ['write-need', 'ai-critic'], message: 'Write your own need first. If the assistant sees no requirements, it will invent them, and it will anchor your thinking.' },
            { id: 'critic-required', kind: 'require', parts: ['ai-critic'], message: 'Use the assistant as a critic to find missing questions, options and costs. That is the part it does well.' },
            { id: 'no-ai-decides', kind: 'forbid', parts: ['ai-pick'], message: 'The assistant does not know your constraints, your team or your users. A recommendation is a hypothesis, not a decision.' },
            { id: 'no-secrets', kind: 'forbid', parts: ['paste-secrets'], message: 'Never paste real credentials into an assistant. Describe the setup in words and keep secrets out of chats.' },
            { id: 'people-required', kind: 'require', parts: ['team-talk'], message: 'The people who will build on the decision have to take part, or they may not understand or follow it.' },
            { id: 'talk-before-decide', kind: 'before', parts: ['team-talk', 'decide-owner'], message: 'Talk first, then decide: the discussion can change which option wins.' },
            { id: 'owner-required', kind: 'require', parts: ['decide-owner'], message: 'A decision with no named owner and no revisit date tends to be ignored.' },
            { id: 'record-required', kind: 'require', parts: ['write-record'], message: 'Without a written record, the reasoning is lost and the next person repeats the debate.' },
            { id: 'decide-before-record', kind: 'before', parts: ['decide-owner', 'write-record'], message: 'The record states the final choice, so it is written after the decision.' },
            { id: 'no-bare-announce', kind: 'forbid', parts: ['announce-bare'], message: 'A result with no reasons cannot be questioned or revisited. Share the trade-off, not only the answer.' },
          ],
          solution: ['write-need', 'list-options', 'ai-critic', 'team-talk', 'decide-owner', 'write-record', 'share-record'],
          minSteps: 5,
          maxSteps: 8,
          hints: [
            'Start with what you know. The assistant should only see it after you have stated the need.',
            'Three parts are traps: one lets the assistant decide, one leaks a secret, and one hides the reasons.',
            'Put the team conversation before the decision, and the written record after it.',
          ],
          explanation: 'The workflow keeps the decision with people: you state the need, use the assistant to challenge it, discuss it with those affected, decide with an owner, and write it down. The assistant adds questions and options but never the verdict.',
          simulation: {
            input: 'How should TindaTrack phones save sales when there is no signal?',
            steps: {
              'write-need': 'Marlon writes: sales must never be lost; phones are mid-range; signal is weak in two stores; the team has two developers.',
              'list-options': 'He lists "save on the phone and send later" and "block sales until online", and leans towards the first.',
              'ai-critic': 'The assistant asks how often two phones edit the same item, adds the cost of conflicts, and marks its assumption about store sizes.',
              'team-talk': 'Joy and one store owner react: conflicts are rare, but a lost sale is unacceptable.',
              'decide-owner': 'Marlon decides on save-then-send, owns it, and sets a review for when stores share a phone.',
              'write-record': 'He writes the decision record with both options, the costs and the revisit trigger.',
              'share-record': 'The record is committed next to the code and linked from the README.',
            },
            output: 'A decision that a person owns, with options and costs written down, made after the assistant challenged the thinking and the team reacted.',
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-02-scenario-1',
          kind: 'scenario',
          title: 'Two ways of storing dates',
          prompt: 'Choose the response that matches the architect\'s work.',
          concept: 'communicating decisions',
          situation: 'On TindaTrack, Marlon saves times in local time while Joy saves them in universal time. Daily reports now show some sales on the wrong day. The two disagree about who is right.',
          options: [
            { text: 'Agree one rule with both, write it where the team will see it, and have each developer check their code against it.', consequence: 'The rule takes an afternoon to agree. Reports match, and the next developer finds the rule instead of rediscovering the problem.', quality: 'best' },
            { text: 'Marlon, as the senior developer, picks a rule and rewrites Joy\'s code overnight.', consequence: 'The data is fixed fast, but Joy learns nothing, resents the rewrite, and the reason is not written down. The same disagreement returns with the next feature.', quality: 'acceptable' },
            { text: 'Draw a bigger system diagram so the difference becomes visible.', consequence: 'The diagram shows the boxes but not the rule for dates, so the confusion remains. A diagram is not a decision.', quality: 'poor' },
            { text: 'Tell each developer to keep their own approach and convert wherever the data meets.', consequence: 'Conversions pile up in every report. Each new screen adds another place for off-by-one-day errors.', quality: 'poor' },
          ],
          hints: [
            'The problem is not the code of either developer. It is a decision nobody owned.',
            'Look for the option that makes the rule visible and shared.',
            'Fixing the data once is not the same as fixing the cause.',
          ],
          explanation: 'The cause is a cross-cutting decision with no owner and no shared note. Agreeing a rule with the people affected, writing it down and checking the code against it solves the cause. Fixing it alone fixes the data but not the process.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-02-match-1',
          kind: 'match',
          title: 'Which part of the architect\'s work is this?',
          prompt: 'Match each moment from a TindaTrack week to the activity of the decision loop.',
          concept: 'architect activities',
          labels: { terms: 'What happened', meanings: 'Activity' },
          pairs: [
            { term: 'Marlon notices that two screens store money differently', definition: 'Find: a costly decision that nobody owns', note: 'Noticing a shared, hard-to-reverse choice is the first step of the loop.' },
            { term: 'Joy writes the gain and the price of keeping reports in the same database', definition: 'Compare: describe each option by what it gains and costs', note: 'Writing both halves of each option is trade-off thinking.' },
            { term: 'The team links a half-page money rule from the README', definition: 'Communicate: write it down where developers look', note: 'The decision becomes visible and findable.' },
            { term: 'The team plans to look at the offline decision again once stores share a phone', definition: 'Revisit: an assumption may change', note: 'Naming what would make a decision wrong is how you decide when to revisit it.' },
          ],
          hints: [
            'Think of the decision loop: find, frame, compare, decide, communicate, revisit.',
            'Two of the moments are about writing; only one is about naming a trigger for looking again.',
            'Match the action to what it produces: a noticed problem, a comparison, a visible note, or a revisit trigger.',
          ],
          explanation: 'Each moment is one stage of the loop. Seeing the loop as separate activities helps you notice which one your team skips, which is usually communicate or revisit.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-02-q1',
        prompt: 'Two TindaTrack developers store dates differently and daily reports disagree. Which response matches the architect\'s job best?',
        choices: [
          'Tell each developer to fix their own code and not discuss it again, because each one decided within their own task.',
          'Have the most senior developer pick a rule and rewrite both parts overnight, to prove that decisions are made quickly.',
          'Draw a larger diagram of the system so that the difference between the two approaches becomes easy to see.',
          'Agree one rule with both developers, write it where the team will see it, and check the code against it.',
        ],
        answer: 3,
        explanation: 'The root problem is a shared decision that nobody owned. The best fix agrees on one rule with the people affected and makes it visible. A diagram or an overnight rewrite does not give the team a rule they understand.',
      },
      {
        id: 'software-architecture-ai-02-q2',
        prompt: 'A teammate says, "Putting reports in a separate database has no downside, it only makes the sales screen faster." Which reply uses trade-off thinking?',
        choices: [
          'It gains a sales screen that reports cannot slow down and pays with a second copy of the data to keep in step. Is that worth it for our requirements?',
          'You are right, because once a second database is running it costs nothing extra to keep, so the faster sales screen is a pure gain for the stores and the developers.',
          'You are wrong, because a second database is always a mistake and a single database is always the better design, however large the system grows over time.',
          'We should ask an AI assistant, since it will know the correct answer for every system and can settle the argument in a moment without more discussion.',
        ],
        answer: 0,
        explanation: 'Trade-off thinking names both halves of the option and ties the choice to requirements. "No downside" and "always wrong" are both claims without a requirement behind them.',
      },
      {
        id: 'software-architecture-ai-02-q3',
        prompt: 'A senior developer spends two weeks drawing a full architecture diagram alone and hands it to the team. What is the most likely problem?',
        choices: [
          'The diagram should have been in colour, because colour makes diagrams easier to understand and easier to remember for everybody in the team.',
          'Two weeks is too short, since a proper architecture needs at least a month of design before anyone writes any code at all.',
          'Diagrams should never be used, because the code is the only reliable description of a system and pictures always go out of date quickly.',
          'The team had no part in the decisions, so they may not follow it, and the diagram may drift away from the code.',
        ],
        answer: 3,
        explanation: 'Decisions made without the people who build on them tend not to be followed. Diagrams are useful when they answer a question the team has, and when the team helped to shape the decisions behind them.',
      },
      {
        id: 'software-architecture-ai-02-q4',
        prompt: 'How much effort should an architectural decision get?',
        choices: [
          'The same amount for all decisions, so that nothing is skipped and the process stays fair, predictable and equal for every team involved in the work.',
          'In proportion to its cost of reversal and the number of people it affects: quick for contained ones, a written record for widespread ones.',
          'As little as possible, because anything you decide early is likely to be wrong anyway, and every extra hour of analysis is effort that is wasted.',
          'As much as possible for the first decision and none afterwards, because the first decision sets the style that every later decision then follows.',
        ],
        answer: 1,
        explanation: 'Effort follows the cost of reversal and the number of people affected. Treating all decisions equally wastes time on small ones and underserves the large ones.',
      },
      {
        id: 'software-architecture-ai-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In the head-cook comparison, what is the architect\'s job?',
        choices: [
          'Cooking every dish personally, so that the quality of the food stays the same for every customer who comes into the restaurant.',
          'Making sure the choices that affect the whole kitchen are made on purpose and known to everyone.',
          'Choosing the colour of the plates and the uniforms of the staff, since those are the most visible choices the kitchen makes.',
        ],
        answer: 1,
        explanation: 'The head cook does not cook everything. They make sure shared choices are made deliberately and understood, which is what an architect does for a software team.',
      },
      {
        id: 'software-architecture-ai-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Your company requires one review board to approve every architectural decision. Decisions now wait for weeks. What is the best adjustment?',
        choices: [
          'Remove all review, because any approval step slows a team down more than a bad decision does, and teams can correct their own mistakes later.',
          'Add more people to the board, so that every decision gets more opinions, more careful scrutiny and fewer mistakes before it goes ahead.',
          'Require longer documents for every decision, so that the board can decide faster because it has been given far more information in writing.',
          'Let teams decide contained, reversible decisions after consulting those affected, keep review for costly ones that cross teams, and log everything.',
        ],
        answer: 3,
        explanation: 'A single approver is a bottleneck. Delegating contained decisions, keeping review for the costly ones and logging everything keeps both speed and visibility.',
      },
    ],
    task: {
      title: 'Write a one-page decision note',
      minutes: 18,
      steps: [
        'Pick a decision that is being made now in your project and that affects more than one person. Write the context in two or three sentences, including the requirements and constraints you know.',
        'List two or three options. Next to each, write what you gain and what you pay. Add the assumption that must hold for the option to be a good choice.',
        'Show it to one affected colleague and write down what they would change or what you missed.',
        'Finish with who owns the decision, when it must be made, and what would make you revisit it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you do not work in a team yet, use a personal choice such as which app to keep your notes in. Write what you would gain and pay with each option, and what would make you switch later.'] },
      { audience: { min: 'advanced' }, steps: ['List the last five decisions that crossed team boundaries in your organisation. For each, note how long it took, who was asked, and whether the reasoning is recorded somewhere. Identify the one that cost the most and propose how it should have been handled.'] },
    ],
  },
  {
    id: 'software-architecture-ai-03',
    day: 3,
    title: 'Functional and Non-Functional Requirements, and Where the System Ends',
    summary: 'Separate what a system does from how well it must do it, and draw the boundary that says what is inside the system and what is not.',
    intro: {
      objectives: [
        'Classify a requirement as functional, non-functional or a constraint',
        'Explain why non-functional requirements shape the structure of a system more than features do',
        'Sketch a system boundary with its users, external systems, the data that crosses it and what is out of scope',
      ],
      why: 'Most expensive surprises come from requirements nobody wrote down, usually how well the system must work and where its responsibility stops. Asking for them early costs a conversation; finding them late costs a rewrite.',
    },
    minutes: 24,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `A requirement list usually starts as a list of features: record a sale, show low stock, print a report. That list is necessary, and it is not enough. It does not say how fast a screen must respond, what happens when the signal drops, who is not allowed to see what, or which jobs are not the system's job at all. Those unstated requirements are the ones that decide the shape of a system, and they are the ones that surprise teams late. This lesson separates the kinds of requirement and draws the line around the system.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `The first TindaTrack feature, "Record a sale", is finished and demonstrated on a developer's fast laptop. In the aunt's store it behaves differently. Her phone is an older model, the mobile signal is weak, and the screen freezes for several seconds after each tap. Twice the signal drops in the middle of a sale and the sale disappears. After a week she goes back to her notebook.` },
      { type: 'paragraph', text: `Every functional requirement was met. What was missing was "a sale is never lost when the signal drops" and "the sale screen responds on the phones that stores already own". Nobody had written them, so nobody had designed for them. Reworking the save path to store the sale on the phone first and send it later took weeks. A second surprise came at the same time: Joy had built a supplier order screen, but the aunt orders from her suppliers by phone call and never wanted one. Nobody had written down what TindaTrack does not do.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Three kinds of requirement matter for architecture.` },
      { type: 'list', items: [
        '**Functional requirements** say what the system does: record a sale, show the low-stock list, export the day\'s sales. A good test: you can demonstrate it, and it either happens or it does not.',
        '**Non-functional requirements** (also called quality attributes) say how well it must do things and under what conditions: how quickly, how reliably, how securely, at what cost, how easily it can be changed. You cannot demonstrate one in a single click; you measure it.',
        '**Constraints** are fixed limits on the solution: a budget, a deadline, a team of two, "must run on the Android phones the stores already own", a rule the business must follow. You work within them; you rarely get to change them.',
      ] },
      { type: 'paragraph', text: `Why do non-functional requirements shape architecture more than features do? A feature mostly lives inside one part of the system, so adding one later is usually cheap. A quality such as "never lose a sale when the signal drops" applies to the whole system. It decides where data is saved, which parts exist and how they depend on each other. By the cost-of-change test from lesson 1, retrofitting it is expensive. Two apps with exactly the same features can have very different structures because their non-functional requirements differ.` },
      {
        type: 'table',
        headers: ['Statement', 'Kind', 'Why'],
        rows: [
          ['The owner can record a sale with item, quantity and price', 'Functional', 'It is something the system does, and you can demonstrate it'],
          ['A sale confirmed on screen is still there after the signal drops', 'Non-functional', 'It is about reliability under a condition, and it affects how every save works'],
          ['The app must run on Android phones the stores already own', 'Constraint', 'It limits the solution and is not negotiable by the developers'],
          ['A helper\'s login cannot open another store\'s sales', 'Non-functional', 'It is a security quality of the whole system, not one screen'],
          ['The low-stock list shows items below the owner\'s minimum', 'Functional', 'It is a behaviour you can show with an example'],
        ],
        caption: 'Sorting requirement statements. Ask: is it something the system does, how well it does it, or a limit on how we may build it?',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In everyday words: think of a restaurant. The menu is the list of functional requirements: what the kitchen makes. How fast the food arrives, how clean the kitchen is, whether it works when the power goes out, and how much it costs to run are the non-functional requirements. Two restaurants with the same menu can be built completely differently if one must serve a hundred people at once and the other seats six. The **constraints** are things like "we have this small shop, and a fixed budget". A **system boundary** is the restaurant's door: the line between what the restaurant is responsible for and what happens outside.` },
      { type: 'paragraph', text: `The second half of the lesson is the **system boundary**: the line between what you build and control, and everything else. Outside the line are the people who use the system and the other systems it exchanges data with. Boundaries matter for three reasons. They define scope, so a team knows what it is not building. Every crossing of the line is a place where something can fail, be attacked or cost money. And the data that crosses it becomes a contract that others depend on.` },
      { type: 'paragraph', text: `Four questions find the boundary: Who or what talks to the system? What does each send and receive? What do we depend on that we do not control? And what do we deliberately not do? The last question matters most and is asked least. An "out of scope" line is a requirement too.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  Owner((Store owner)) -->|records sales and reads totals| TT[TindaTrack]
  Helper((Store helper)) -->|records sales| TT
  TT -->|daily sales export| Sheet[Owner's spreadsheet]
  TT -.->|Out of scope: orders are placed by phone| Supplier[Supplier]`,
        caption: 'A boundary sketch for TindaTrack. The people and the spreadsheet are outside the box. Look at the dashed arrow: it records a decision not to build supplier ordering.',
      },
      { type: 'paragraph', text: `You can sketch a boundary in five minutes: draw one box for the system, add every person who uses it, add every other system that sends it data or receives data from it, label each line with what travels along it, and mark what is out of scope. In lesson 4 you will turn this sketch into a proper context diagram.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In an existing system the non-functional requirements are rarely written, but they exist: whatever the business expected the last time something broke is the real availability requirement. You can recover them from incident reports, support tickets and the cost of an hour of downtime to the people who use it. Non-functional requirements also conflict, for example security against convenience, or cost against availability, so they need to be ranked and agreed, not just listed. Boundaries carry the same weight in operations: every external dependency is a failure mode with its own timeouts, versioning and ownership. And a boundary decision is a build, buy or integrate decision, so it deserves the same cost-of-change test as any other architectural choice.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'Asking an assistant for non-functional requirements',
        prompt: `List the non-functional requirements for TindaTrack, an inventory and sales app for small neighbourhood stores.`,
        output: `Non-functional requirements for TindaTrack:

- Availability: 99.99% uptime.
- Scalability: support 10,000 concurrent users.
- Performance: every screen responds in under 50 ms.
- Security: certified compliant with international security standards.
- Usability: available in 12 languages.
- Maintainability: 90% automated test coverage.`,
        notice: `The categories (availability, scalability, performance, security, usability, maintainability) are a useful checklist. Every number is a guess: nobody gave the assistant a user count, an uptime goal or a language list, and a small-store app does not obviously need any of them. "Certified compliant" is a claim that only a real review can make. Use the answer as a list of questions to ask the owner ("what happens to a sale if the signal drops?"), not as requirements. Lesson 6 shows how to get the numbers from the business.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take a system you know. Before you use the assistant, write your own sort: five functional requirements, the non-functional requirements you believe matter and why, the constraints, and a list of who and what is outside your system. Then ask the assistant to find what you missed, not to write the answer.` },
      { type: 'prompt', label: 'Find the gaps in my requirements', text: `I am describing a system. Please review my thinking and do not invent requirements.

System: [one paragraph: who uses it, what it does, where it runs]
Functional requirements I have: [your list]
Non-functional requirements I believe matter, and why: [your list]
Constraints I know: [budget, team size, platform, deadlines, rules]
People and systems outside my boundary, with what they exchange: [your list]
Out of scope: [what we do not do]

Please:
1. Mark each of my items as functional, non-functional or constraint, and tell me if you disagree.
2. List the quality categories that I have not mentioned, and for each one ask me a question I should answer. Do not suggest numbers.
3. Point to any boundary line that has no stated data or owner.
4. Label everything you assume as ASSUMPTION.` },
      { type: 'paragraph', text: `What to verify: which questions you can answer today and which need the business, and whether the assistant added any requirement you never stated. Anything it added is a question, not a requirement.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Take one finished feature in your project and ask the owner what must be true about it on a bad day (no signal, slow phone, two people at once).',
        'Add an "Out of scope" line to the README or the design notes of a project, with one sentence each.',
        'Lesson 4 turns your boundary sketch into a context diagram and writes your first decision record.',
        'Lesson 6 makes non-functional requirements measurable, so do not worry about numbers yet.',
      ] },
      { type: 'takeaways', items: [
        'Functional requirements say what the system does; non-functional ones say how well, under what conditions; constraints are fixed limits.',
        'Non-functional requirements apply to the whole system, so they shape its structure and are expensive to add late.',
        'The system boundary separates what you build from the people and systems around it; every crossing is a place to fail, to secure and to agree a contract.',
        'Write what is out of scope: it is a requirement that prevents building the wrong thing.',
        'An AI assistant\'s quality list is a set of questions. Its numbers are guesses until the business supplies them.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-03-match-1',
          kind: 'match',
          title: 'What kind of requirement is it?',
          prompt: 'Match each TindaTrack statement to the kind of requirement it is.',
          concept: 'requirement types',
          labels: { terms: 'Statement', meanings: 'Kind' },
          pairs: [
            { term: 'The owner can see today\'s total as soon as a sale is saved', definition: 'Functional: something the system does', note: 'You can demonstrate it with an example.' },
            { term: 'A confirmed sale survives a phone restart in the middle of the day', definition: 'Non-functional: how reliably it does it', note: 'It is a quality of the whole save path, not a single screen.' },
            { term: 'The team has two developers and about three months', definition: 'Constraint: a fixed limit on how we may build', note: 'You work within it. It does not describe the system\'s behaviour.' },
            { term: 'TindaTrack does not place orders with suppliers', definition: 'Boundary: a decision about what is out of scope', note: 'An out-of-scope line is a requirement that stops wasted work.' },
          ],
          hints: [
            'Ask: does it describe something the system does, how well it does it, a limit we work within, or what we do not do?',
            'Two statements describe the build and the scope, not the behaviour.',
            'Match the survival of a sale to the quality of the save path before the others.',
          ],
          explanation: 'Sorting requirements this way shows what is missing. A list with many functional items and no non-functional ones, no constraints and no out-of-scope line is the kind that surprises a team later.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-03-scenario-1',
          kind: 'scenario',
          title: 'A new request at the edge of the system',
          prompt: 'Choose the best way for the team to respond.',
          concept: 'system boundary',
          situation: 'A store owner tells Marlon: "TindaTrack should also order from my suppliers when stock is low." The team could build supplier ordering, but it would mean accounts with each supplier, new data and a lot of new rules. TindaTrack\'s purpose so far is to record sales and stock.',
          options: [
            { text: 'Ask what the owner wants to achieve (for example, never running out of fast sellers), check whether the low-stock list already meets it, and then decide in or out and write the boundary down.', consequence: 'The owner\'s real goal turns out to be a reminder of what to buy, which the low-stock list nearly covers. The team adds a small "buy list" and writes "supplier ordering: out of scope" in the notes.', quality: 'best' },
            { text: 'Build supplier ordering, because the owner is a customer and customers decide.', consequence: 'Three weeks go into accounts and integrations for suppliers that mostly take orders by phone. The feature is barely used and now has to be maintained.', quality: 'poor' },
            { text: 'Say no because it is not in the current plan, and move on.', consequence: 'The owner feels ignored, and the team never finds out that the real need (a list of what to buy) was cheap to meet.', quality: 'acceptable' },
            { text: 'Add a simple "order" button that sends a text to a supplier, and fix the details later.', consequence: 'The button has no record of what was ordered or received. Soon owners ask for status, prices and receipts, and the scope grows without anyone having decided it.', quality: 'poor' },
          ],
          hints: [
            'A request names a feature. Find out the outcome behind it before you decide.',
            'Whatever is decided, write the boundary down so the decision lasts.',
            'The best option neither builds blindly nor refuses blindly.',
          ],
          explanation: 'Asking for the outcome behind a request often shows a smaller need. Whether the feature goes in or out, the boundary decision is written, so scope changes become decisions instead of accidents.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-03-arrange-1',
          kind: 'arrange',
          title: 'Sketch a boundary in five minutes',
          prompt: 'Put the steps of the boundary sketch in the right order.',
          concept: 'system boundary',
          language: 'text',
          solution: [
            'Draw one box and name it for the system',
            'Add every person who uses the system',
            'Add every other system that sends it data or receives data from it',
            'Label each line with what travels along it',
            'Mark what is out of scope with a dashed line',
          ],
          reasons: [
            'Start with the system itself so everything else is drawn relative to it.',
            'People are the first things outside the box that you can list.',
            'Other systems come next, because they exchange data with the box.',
            'Only once the lines exist can you say what travels along them.',
            'Out of scope is the last check: what did we leave out on purpose?',
          ],
          hints: [
            'You cannot draw a line to something before the box exists.',
            'People and other systems come before the labels on the lines.',
            'The out-of-scope marker comes after you have seen everything that is in.',
          ],
          explanation: 'The sketch grows outward from the system: the box, then people, then other systems, then the data on each line, then what you decided not to build.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-03-q1',
        prompt: 'Which statement is a non-functional requirement for TindaTrack?',
        choices: [
          'A sale confirmed on the screen must still be there after the phone loses its signal.',
          'The owner can record a sale with the item, the quantity and the price, and see the day\'s total update right away.',
          'The app shows a list of items whose stock is below the minimum that the owner set for each item.',
          'The owner can export the day\'s sales to a spreadsheet file at the end of the day.',
        ],
        answer: 0,
        explanation: 'The first statement is about how reliably the system behaves under a condition. The others describe things the system does, so they are functional.',
      },
      {
        id: 'software-architecture-ai-03-q2',
        prompt: 'A team ships an app that has every requested feature, but stores say it is too slow on their phones. What most likely went wrong in the requirements?',
        choices: [
          'The team did not include enough features, since stores always want more features and then accept slower screens, and the owner would have asked for them.',
          'The server was too small, which is the usual reason an app feels slow, and no other cause is worth looking at before that one.',
          'Nobody stated how fast the sale screen must respond, on which phones and connections, so it was never designed or tested for it.',
          'The testers did not run enough tests of the existing features before the release, so the slow screens were never found in time.',
        ],
        answer: 2,
        explanation: 'Speed on real phones is a non-functional requirement. If it is never stated, nothing in the design or the tests aims at it, no matter how complete the features are.',
      },
      {
        id: 'software-architecture-ai-03-q3',
        prompt: 'Which question helps you find the boundary of a system?',
        choices: [
          'Which programming language and framework would a new developer find easiest to learn in their very first week on the project?',
          'Which people and other systems send data to us or receive data from us, and what do they exchange?',
          'How many screens does the app have, and which of them is the most popular with the store owners?',
          'Which parts of our code are the oldest, since old code is always the most exposed to problems?',
        ],
        answer: 1,
        explanation: 'A boundary is defined by who and what lies outside the system and what crosses the line. Languages, screen counts and code age do not define scope.',
      },
      {
        id: 'software-architecture-ai-03-q4',
        prompt: 'Why do non-functional requirements shape the architecture more than most features do?',
        choices: [
          'They are always written first, so the design has to follow their order, and the features are added afterwards in whatever space is left over in the plan.',
          'They are the ones the business cares about most, so the developers prefer to work on them first and leave the features until much later in the project.',
          'They are easier to build than features, so teams start with them and then spend the remaining time on the harder feature work in the backlog.',
          'They apply to the whole system, so they decide which parts exist and how they connect, and they are costly to add once the structure is built.',
        ],
        answer: 3,
        explanation: 'A feature usually lives in one part. A quality such as reliability under bad signal affects every part that saves data, so it changes the structure, and by the cost-of-change test it is expensive to retrofit.',
      },
      {
        id: 'software-architecture-ai-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the restaurant example, which is closest to a non-functional requirement?',
        choices: [
          'The menu includes a chicken dish that is served with rice.',
          'The restaurant sells rice and drinks as part of its menu.',
          'Orders reach the table within a set time.',
        ],
        answer: 2,
        explanation: 'How quickly food arrives is about how well the restaurant works, not what it serves. The other two are items on the menu, which are functional.',
      },
      {
        id: 'software-architecture-ai-03-q6',
        audience: { min: 'advanced' },
        prompt: 'In an existing system nobody can say how available it must be. How do you find the real requirement?',
        choices: [
          'Read incident reports and support tickets, ask owners what an hour of downtime costs them, and write the finding down to confirm.',
          'Assume the highest possible availability, since downtime is always bad and the target can be lowered later when the cost becomes clear.',
          'Leave it unstated, because availability cannot be known before the system has been used in production for a long time.',
          'Copy the target from a similar product\'s public claims, since competitors face the same kinds of users and the same problems.',
        ],
        answer: 0,
        explanation: 'The real requirement is visible in what has already hurt people and what it cost them. An assumed maximum or a copied number is not tied to this business and may be very expensive.',
      },
    ],
    task: {
      title: 'Sort your requirements and sketch the boundary',
      minutes: 18,
      steps: [
        'Write ten requirement statements for a system you know, in your own words, without trying to organise them.',
        'Tag each statement as functional, non-functional or constraint. Notice which kinds are missing.',
        'Pick the three missing non-functional areas that matter most and write the question you would ask the business for each. Do not write numbers yet.',
        'Sketch the boundary on paper: the system box, the people, the other systems, the data on each line, and a dashed line for what is out of scope.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do the exercise for an app you use every day, such as a food delivery app. Guess five functional and three non-functional requirements from how it behaves.'] },
      { audience: { min: 'advanced' }, steps: ['For each external system on your boundary sketch, write what happens to your system when it is down or slow, where you would notice, and who owns the contract. Mark the dependency you least control.'] },
    ],
  },
  {
    id: 'software-architecture-ai-04',
    day: 4,
    title: 'Using AI to Analyse a System, and Recording Your First Decision',
    summary: 'Use an assistant to find what a system implies, check every claim against your own words, then draw the context diagram and write the first decision record.',
    intro: {
      objectives: [
        'Run the analysis loop: describe a system, ask an assistant for implications and questions, and trace every claim to your own text',
        'Draw a C4 context diagram of a system with its people and external systems',
        'Write a short Architecture Decision Record with the options considered, the choice and its consequences',
      ],
      why: 'An assistant is quick at reading a description and listing what it implies, and just as quick at inventing requirements. A fixed routine for checking its claims, and a written record of your own decision, keeps you in charge of the design.',
    },
    minutes: 26,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `An AI assistant can read a description of a system in seconds and tell you what it implies: the decisions hidden in it, the risks, the questions nobody has asked. That is genuinely useful. The same assistant will also fill every gap with something plausible, and it sounds equally sure about both. This lesson gives you a routine for using it as an analyst without letting it write your requirements, and it ends with two things you can keep: a context diagram and your first written decision.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Marlon pastes the TindaTrack description into an assistant and asks what the system implies. Most of the answer is helpful. It lists where data lives, who the users are and where a failure would hurt. One line says, "TindaTrack needs offline sync with conflict resolution for up to 50 devices per store." It sounds sensible, and Marlon starts sketching a sync design.` },
      { type: 'paragraph', text: `Joy looks over his shoulder and asks, "Where is that written?" Marlon cannot find it. Nothing in the description mentions more than one phone. They ask the stores, and none has more than two phones. The line was invented. Checking it cost a short conversation. Believing it would have cost weeks of building the hardest part of a distributed system for a need that did not exist. What the team did need to decide was simpler: do we keep TindaTrack as one app with one database as the stores grow? They wrote that decision down.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The routine has one rule: **the assistant proposes, your own text decides what is supported.** Write the description and the requirements yourself, ask the assistant to analyse them, and for every claim in its answer find the sentence you wrote that supports it.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[You describe the system and its requirements] --> B[AI lists implications, assumptions, risks and questions]
  B --> C{Does a sentence you wrote support this claim?}
  C -->|Yes| D[Keep it and test it against the requirements]
  C -->|No| E[Turn it into a question for the business]
  D --> F[You decide]
  E --> F
  F --> G[Record the decision]`,
        caption: 'The analysis loop. Look at the question in the middle: a claim with no supporting sentence becomes a question, never a requirement.',
      },
      { type: 'paragraph', text: `Assistants are good at listing, at spotting gaps, at proposing alternatives you had not thought of, and at wording. They are poor at knowing your users, your data, your budget and your team, and at telling a guess from a fact. Five checks apply to any analysis you receive:` },
      { type: 'list', ordered: true, items: [
        '**Traceable?** Can you point to a requirement or a sentence of your description for each claim?',
        '**Assumptions marked?** Did it say what it assumed, or did it present guesses as facts?',
        '**Simplest option considered?** Is the plain design in the list, or did it jump to a large one?',
        '**Cost stated?** Does each suggestion say what it costs in people, money, complexity and failure modes?',
        '**What would make it wrong?** Does it say which fact, if different, would change the advice?',
      ] },
      { type: 'paragraph', text: `Two things are worth keeping from the analysis: a picture of the system, and a record of what you decide. The picture comes first. The **C4 model** describes a system at four levels of zoom: Context (the system and what surrounds it), Containers (the parts that run), Components (the parts inside one container) and Code. This lesson uses only the first level. A **context diagram** shows your system as one box, the people who use it, and the other systems it talks to. It shows no technology, so the owner of a store can read it as easily as a developer. It is your boundary sketch from lesson 3, drawn properly.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `C4Context
  title TindaTrack system context
  Person(owner, "Store owner", "Records sales and checks stock")
  Person(helper, "Store helper", "Records sales at the counter")
  System(tt, "TindaTrack", "Tracks stock and sales for one store")
  System_Ext(sheet, "Spreadsheet app", "Where the owner keeps monthly records")
  Rel(owner, tt, "Uses")
  Rel(helper, tt, "Uses")
  Rel(tt, sheet, "Sends the daily export to", "File")`,
        caption: 'TindaTrack at the context level. Check that every box outside the system is a person or a system someone else owns, and that every line has a label.',
      },
      { type: 'visual', id: 'arch-diagram-workbench', caption: 'Write the context diagram of your own system here: at least one person, one external system and a label on every line.' },
      { type: 'paragraph', text: `The record comes next. An **Architecture Decision Record** (ADR) is a short note about one decision: the situation that forced it, the options considered with what each gains and costs, the choice, and what follows from it. Keep it to one page, one decision per record, in the repository next to the code. Never edit an old record to hide a change of mind: mark it as superseded and write a new one, so the history of reasons stays honest.` },
      {
        type: 'code',
        language: 'markdown',
        label: 'A first record for TindaTrack',
        code: `# ADR 1: Keep TindaTrack as one app with one database

Status: Accepted. Owner: Marlon.
Revisit when: a store needs more than three phones at once, or reports slow down sales.

## Context
Stores use one or two phones each. The team has two developers.
A confirmed sale must never be lost when the signal drops.
Assumed, to confirm with the owners: a few hundred sales a day per store at most.

## Options considered
A. One app and one database.
   Gain: simple to run and back up; a sale and its stock change save together.
   Cost: one place to fail; reports share the database with sales.
B. Separate services for sales and for reports.
   Gain: heavy reports cannot slow down sales.
   Cost: two systems to run and keep in step; no stated requirement needs it yet.

## Decision
We choose A.

## Consequences
Easier: one backup, one deployment.
Harder: if reports slow sales down we must add a read copy or split the system.
We will watch the time it takes to save a sale.`,
      },
      { type: 'visual', id: 'arch-adr-builder', caption: 'Write your own record here from your reasoning, then save it. The builder keeps what you write and checks that the options, choice and consequences are all there.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a decision record is a diary entry for one choice, so that a person who joins next year can see what you picked, what else you thought about and why. Without it, they will argue about the same question again. A context diagram is like a map of your shop and the people and delivery trucks that come to its door: it does not show the shelves, only who comes in and out. The assistant plays the role of a helper who reads your notes and asks "what about this?", but you decide which of its questions matter.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Keep ADRs in the repository, for example in a docs folder with numbered files, so they are reviewed in pull requests and versioned with the code they explain. A change of mind adds a new record that supersedes the old one, and links both ways. When you ask an assistant to analyse a large system, give it structure (the component list, the requirements, the constraints) rather than the whole repository, and ask for evidence for each claim. If you let it draft records for decisions already made, check the reasons: it may supply a plausible rationale the team never held. The record's value is that it captures what people actually knew when they chose.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An analysis with one invented requirement',
        prompt: `Here is my system. TindaTrack is a phone app for small stores. The owner and one helper record sales and stock on their phones. The owner wants a daily total and a low-stock list, and exports the day's sales to a spreadsheet. We are two developers. What does this description imply? List implications, risks and questions.`,
        output: `Implications:
1. Sales and stock must be saved even when the phone has no signal.
2. Two people can record sales, so the app needs to know who did what.
3. The daily export means a defined file format that the spreadsheet can read.

Risks:
- A lost sale if the app closes before saving.
- A wrong total if the same item is changed on two phones.

Requirements to add: TindaTrack needs offline sync with conflict resolution for up to 50 devices per store, and a message broker to deliver sales to the server.

Questions: How many phones does a store have? What happens to the export if it fails?`,
        notice: `The implications, risks and questions all come from what you wrote, and the last two questions are exactly the ones to ask the stores. The "requirements to add" is the flaw: nothing in the description mentions 50 devices, and a message broker answers no stated need. The description says one owner and one helper. Trace every claim to a sentence. The two that cannot be traced become questions, not requirements.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write a description of a system you know in six to ten sentences, including who uses it, what it stores, and any requirements you already know. Start with the first prompt. After you decide something, write your own draft record and use the second prompt to challenge it.` },
      { type: 'prompt', label: 'Analyse my system', text: `Here is my system, written by me:
[your description in 6 to 10 sentences]

Please list: (1) what the description implies, (2) risks, (3) questions I should answer. After every item, quote the sentence from my description that it comes from. If an item has no supporting sentence, put it under a heading called ASSUMPTIONS and do not present it as a requirement. Do not suggest any technology unless a sentence of mine states a requirement that needs it. Say what you cannot know about my situation.` },
      { type: 'prompt', label: 'Challenge my draft decision record', text: `Here is a draft Architecture Decision Record that I wrote:
[your context, options with gain and cost, decision, consequences]

You are my reviewer, not the decider. Tell me: (1) which option is missing that a reasonable developer would consider, (2) which cost or consequence I left out, (3) which words are vague (for example "fast" or "scalable") and need a number or a test, (4) what fact would make my decision wrong. Mark anything you assumed with ASSUMPTION.` },
      { type: 'paragraph', text: `What to verify: that every item in the first answer has a quote you can find, that each ASSUMPTION is now a question for the business, and that you only accept a critique of your record if you can tie it to a requirement or a fact you know.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Draw the context diagram of a system you work on and ask a colleague who is not a developer to explain it back to you. Fix every point where they hesitate.',
        'Write the first record for a decision your team made last quarter. Note how much of the reasoning you can still recall.',
        'Module 2 starts with lesson 5: before you decide anything, you need to turn business needs into actors, goals and constraints.',
        'Read the C4 model\'s own website for the notation of the other three levels; you will use container and component views in lesson 13.',
      ] },
      { type: 'takeaways', items: [
        'Use an assistant as an analyst: you write the description, it lists implications, risks and questions, and every claim must trace back to your own text.',
        'A claim with no supporting sentence becomes a question for the business, never a requirement.',
        'A C4 context diagram shows the system as one box with its people and external systems and no technology, readable by anyone.',
        'An Architecture Decision Record states the context, the options with gain and cost, the choice and the consequences; supersede it, do not rewrite it.',
        'The decision and its reasons are yours: the assistant can challenge a draft record but it never owns the choice.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-04-scenario-1',
          kind: 'scenario',
          title: 'The requirement nobody wrote',
          prompt: 'Choose the best response to the assistant\'s analysis.',
          concept: 'checking AI analysis',
          situation: 'Joy asks an assistant to analyse TindaTrack and gets a good list of risks, plus the line "Add a message queue between the app and the database to handle sales traffic." Her description mentions two phones per store and a few hundred sales a day, and nothing about traffic problems.',
          options: [
            { text: 'Ask which sentence supports the message queue. With none, record it as a question ("do we have a traffic problem?") and keep the simple design.', consequence: 'No sentence supports it, so it goes on the list of questions. The team keeps one app and one database, and a note says what traffic would justify revisiting.', quality: 'best' },
            { text: 'Add the queue because the assistant sounded sure and queues are a common pattern.', consequence: 'The team now runs and monitors a queue for a few hundred sales a day. It adds failure modes and work without answering any stated need.', quality: 'poor' },
            { text: 'Ignore the whole analysis because one line was wrong.', consequence: 'The useful risks (lost sales, two phones editing one item) are thrown away with the invented line, so the team re-discovers them later.', quality: 'poor' },
            { text: 'Keep the queue in the plan as optional, to be removed later if it turns out to be unnecessary.', consequence: 'It sits in the diagram as if it were agreed. A new developer starts building it, because nobody wrote down that it came from a guess.', quality: 'acceptable' },
          ],
          hints: [
            'Ask where the claim comes from before asking whether it is right.',
            'A good analysis is still useful when one line is wrong. Keep the supported lines.',
            'Look for the option that turns an unsupported claim into a question.',
          ],
          explanation: 'The routine is to trace each claim. Supported claims are tested against requirements, and unsupported ones become questions. Rejecting everything wastes the useful part, and keeping the invented line as "optional" lets it grow into the design.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-04-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the decision record',
          prompt: 'Fill the gaps in this record template with the words that belong there.',
          concept: 'decision records',
          language: 'text',
          code: `Title: One decision, named as a choice
Status: ___
Context: The requirements and ___ that force the choice
Options considered: each option with what it ___ and what it costs
Decision: The option we choose
Consequences: What gets easier, what gets harder, and when we will ___ the decision`,
          blanks: [
            { answers: ['Accepted'], feedback: 'A record starts as proposed and becomes accepted once it is decided; "Deleted" would hide the history.' },
            { answers: ['constraints'], feedback: 'Context is the forces on the decision: requirements and the constraints that limit the options.' },
            { answers: ['gains'], feedback: 'Every option is written as what it gains and what it costs, so the trade-off is visible.' },
            { answers: ['revisit'], feedback: 'A record names what would make the team look at the decision again.' },
          ],
          bank: ['Accepted', 'constraints', 'gains', 'revisit', 'Deleted', 'guesses', 'hides'],
          hints: [
            'Read each line and ask what a future developer would need in that spot.',
            'Two blanks complete the pair "gains and costs" and "easier and harder"; one names the limits on the choice.',
            'Words like "Deleted" and "hides" go against the purpose of a record: keeping the reasons visible.',
          ],
          explanation: 'A decision record keeps four things visible: the status, the forces behind the choice, what each option gains and costs, and when to revisit. Those are the parts a future developer needs to understand why the system is the way it is.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-04-match-1',
          kind: 'match',
          title: 'Where does it go in the record?',
          prompt: 'Match each sentence from a TindaTrack decision record to the section it belongs in.',
          concept: 'decision records',
          labels: { terms: 'Sentence', meanings: 'Section' },
          pairs: [
            { term: 'Stores use one or two phones, and the team has two developers.', definition: 'Context', note: 'It states the facts and constraints that shape the options.' },
            { term: 'Separate services: heavy reports cannot slow down sales, but there are two systems to keep in step.', definition: 'Options considered', note: 'An option with its gain and its cost.' },
            { term: 'We choose one app with one database.', definition: 'Decision', note: 'The choice, stated plainly in one place.' },
            { term: 'If reports slow sales down, we must add a read copy. We will watch the time to save a sale.', definition: 'Consequences', note: 'What becomes harder and what the team will watch.' },
          ],
          hints: [
            'Ask whether the sentence describes the situation, an alternative, the choice or what follows.',
            'The sentence with a gain and a cost for something we did not choose is an option.',
            'The sentence that starts "If" and mentions watching something is about what follows.',
          ],
          explanation: 'Keeping each part in its own section lets a reader find the facts, the alternatives and the consequences separately. Mixing them is how records turn into long stories that nobody reads.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-04-q1',
        prompt: 'An assistant\'s analysis of TindaTrack says the app must support offline sync across 50 devices per store. Nothing in your description mentions devices. What do you do?',
        choices: [
          'Add it to the requirements, because the assistant has seen many systems and probably noticed a real need that you missed.',
          'Delete the entire analysis, because one invented line means that the rest cannot be trusted for anything at all.',
          'Keep it as a possible requirement and decide the details of the sync design later, in case it turns out to be needed.',
          'Ask which sentence of the description supports it. With none, make it a question for the owners, not a requirement.',
        ],
        answer: 3,
        explanation: 'An unsupported claim is a question, not a requirement. Keeping the rest of the analysis is sensible, and keeping the invented line as a "possible requirement" lets it creep into the design.',
      },
      {
        id: 'software-architecture-ai-04-q2',
        prompt: 'What belongs in the "Options considered" section of a decision record?',
        choices: [
          'Only the option that was chosen, described in as much detail as possible, so that nobody doubts the decision.',
          'Each realistic option with what it gains and what it costs, including the simple option that was not chosen.',
          'The names of the people who disagreed with the decision, so that they can be consulted again later.',
          'A list of technologies that were popular at the time of the decision.',
        ],
        answer: 1,
        explanation: 'A record is useful because it shows the alternatives and their costs. Without the rejected options, a later reader cannot tell whether the choice was weighed or only assumed.',
      },
      {
        id: 'software-architecture-ai-04-q3',
        prompt: 'Why does a C4 context diagram show no databases or frameworks?',
        choices: [
          'Because databases and frameworks are not important to the architecture of a system, so they are never drawn in any diagram.',
          'Because the tools that draw C4 diagrams cannot represent technologies at the first level, so they are left out by force.',
          'It shows one box with its people and external systems, so that someone who is not a developer can see what the system is for.',
          'Because technology choices should never be written down, since they change too quickly to be worth recording anywhere.',
        ],
        answer: 2,
        explanation: 'The context level is deliberately non-technical. Technology appears in the next level, the container diagram, where the parts that run are shown.',
      },
      {
        id: 'software-architecture-ai-04-q4',
        prompt: 'A decision recorded last year no longer fits because the stores now share phones. What should the team do with the old record?',
        choices: [
          'Keep it, mark it as superseded, and write a new record that explains what changed and why.',
          'Delete it, because an out-of-date record is more confusing than no record.',
          'Edit it quietly so that it describes the new decision, because the repository should show only the current truth.',
          'Leave it alone and add the new decision in a chat message, because records are only for the first version of a system.',
        ],
        answer: 0,
        explanation: 'Records are history. Superseding keeps the old reasons visible, so people can see how the system changed and which assumption stopped holding.',
      },
      {
        id: 'software-architecture-ai-04-q5',
        audience: { max: 'beginner' },
        prompt: 'What is a decision record most like?',
        choices: [
          'A manual that explains how every function in the code works and how to call it.',
          'A short note that says what was chosen, what else was considered, and why.',
          'A list of the bugs that the team found and fixed in the last release.',
        ],
        answer: 1,
        explanation: 'A decision record keeps the reasons for one choice, so that a person who joins later does not have to guess or argue it again.',
      },
      {
        id: 'software-architecture-ai-04-q6',
        audience: { min: 'advanced' },
        prompt: 'A team asks an assistant to write records for decisions that are already in the code. What is the main risk?',
        choices: [
          'The records will be too short to be useful, because assistants write brief text and leave out the context that the team needs later.',
          'The assistant cannot produce Markdown files, so the records cannot be committed to the repository or reviewed in a pull request.',
          'It may present plausible but guessed reasons as if the team had held them, so the records must be checked with the people who decided.',
          'Records stored in the repository cannot be reviewed by the team, which defeats the purpose of having written them in the first place.',
        ],
        answer: 2,
        explanation: 'A record\'s value is that it captures what people actually knew and weighed. An assistant can draft the shape, but the reasons must come from the people who made the decision.',
      },
    ],
    task: {
      title: 'Analyse a system, draw it and record one decision',
      minutes: 20,
      steps: [
        'Write a description of a system you know in six to ten sentences. Ask an assistant for implications, risks and questions, and write next to each item the sentence it comes from. List the items with no sentence.',
        'In the diagram workbench, write a C4 context diagram of the system with at least one person, one external system and a label on every line. Save it and copy the text.',
        'In the ADR builder, write ADR 1 for one decision: the context, two options with a gain and a cost, the choice, the consequences and a revisit trigger. Save it.',
        'Ask an assistant to challenge your record and accept only the critiques you can tie to a requirement or fact you know.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use the TindaTrack description from this lesson instead of your own system. Draw its context diagram and write the record for "one app with one database", changing at least one detail of your own.'] },
      { audience: { min: 'advanced' }, steps: ['Write a second record that supersedes the first because one assumption changed (for example, stores now share phones). Link them both ways, and state the trigger that should have made you revisit the first.'] },
    ],
  },
];
