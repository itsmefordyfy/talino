import type { Lesson, Project } from '../../../types';

// Module 2: Requirements Analysis and Architecture Planning (lessons 5 to 7, days 5-7, no project). Written 2026-11-18.
// No product facts are stated, so there are no version notes. TindaTrack, TindaTrack Cloud, Marlon, Joy and every number are invented.
// Demos ("AI in Action") are hand-written illustrations, never a real model's output. The live prompt labs are in src/features/practice/labs/architecture/module-02.ts.

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-05',
    day: 5,
    title: 'From Business Needs to Actors, Goals and Constraints',
    summary: 'Turn a vague idea into the business need, the people and systems involved, their goals and the fixed limits that every design must respect.',
    intro: {
      objectives: [
        'Separate a business need, an actor\'s goal, a requirement and a constraint',
        'Find the goal behind a feature request by asking what outcome it serves and how you would know it worked',
        'Write a one-page requirements brief that an assistant or a teammate can challenge',
      ],
      why: 'Architecture starts with what the system is for, for whom, and what limits you. A team that skips this builds the wrong thing quickly, and every later decision inherits the mistake.',
    },
    minutes: 24,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `Every architecture is an answer to a question, and the question is usually stated badly. "We need an inventory app" does not say who is asking, what they want to be able to do, or what will make the project a success. Before any component or database is chosen, the team needs a short and honest answer to three things: what the business wants to change, who is involved and what each of them wants, and what limits the solution. This lesson shows how to get there and how to write it on one page.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `The founder of TindaTrack Cloud, the online version of the app, gives the team one sentence: "Stores need inventory." The team builds it well: items, batches, and a screen where someone counts every item each night and enters the numbers. Three weeks later the stores are not using it. Nobody has time for a nightly count, and the people who would have to do it are the store helpers, who were never asked.` },
      { type: 'paragraph', text: `A one-hour conversation with two store owners would have shown the real need. Owners were losing sales because their ten fastest-selling items ran out without anyone noticing. What the owner wanted, before opening, was a short list of what to buy today. That list could be worked out from sales the app already records, with no counting at all. The team had built what the sentence said, instead of what the owner needed.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Four ideas, each with a different job. Keep them apart, because mixing them is how a brief turns into a wish list.` },
      { type: 'list', items: [
        '**Business need:** the problem or outcome the business wants to change, in business words ("fewer lost sales"). Write it with a way to know it worked, even a rough one: "How will we know?"',
        '**Actors and their goals:** an actor is a person or system that uses the system or is affected by it. **Primary actors** use it (owner, helper). **External actors** are systems it talks to (a text-message service, an e-wallet provider). **Stakeholders** may never touch it but have a say (the founder who pays, support staff). A goal is what an actor wants to achieve, in their words, in the form "As a [actor], I want [goal] so that [outcome]". The "so that" part is the one that matters.',
        '**Requirements:** what the system must do or be to serve those goals. Each one should trace back to a goal. A requirement with no goal behind it is a question: why is it here?',
        '**Constraints:** fixed limits on the solution, such as budget, deadline, team size and skills, an existing system you must work with, the platform, and rules the business must follow. Requirements are negotiable; constraints usually are not, or are costly to move.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  Need[Business need and how we will know it worked] --> Goals[Actors and their goals]
  Goals --> Req[Requirements that serve the goals]
  Req --> Options[Architecture options]
  Cons[Constraints] --> Options`,
        caption: 'From need to options. Look at the two arrows into "Architecture options": requirements say what is wanted, constraints say what is possible, and both shape the choice.',
      },
      {
        type: 'table',
        headers: ['Part of the brief', 'TindaTrack Cloud example'],
        rows: [
          ['Business need', 'Stores lose sales when popular items run out and nobody notices'],
          ['How we will know', 'Owners report fewer stockouts of their fastest sellers (how it is counted is still to agree)'],
          ['Actors', 'Store owner and helper (primary), text-message service (external), the founder who pays (stakeholder)'],
          ['Goals', 'Owner: know before opening what to buy today. Helper: record a sale in a few seconds'],
          ['Requirements', 'A buy-today list from recent sales and minimum stock; a sale is saved even with no signal'],
          ['Constraints', 'Three developers, four months, Android phones the stores already own'],
        ],
        caption: 'A one-page brief is mostly this table. Notice that the nightly count does not appear: no goal needs it.',
      },
      { type: 'paragraph', text: `The most useful habit is to treat a request as a clue, not a specification. When someone asks for a feature, ask what they are trying to achieve and how they would know it worked. Ask "why" two or three times, politely, until you reach an outcome. A request for "a nightly count screen" leads to "I want to know what to buy", and that leads to "so I never run out of my fast sellers". Now there are several ways to meet the need, and the cheapest may not be what was asked for.` },
      { type: 'paragraph', text: `Watch for two disguises. A **solution disguised as a requirement** ("the system must use a message queue") hides the problem it was meant to solve, so state the problem and compare solutions later. An **assumption disguised as a constraint** ("it must run on the store's own computer") may be a habit, not a rule. Ask who set it and what it protects. If a constraint comes from law or regulation, read the official text and ask a qualified person: this course does not give legal advice.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: imagine you ask a tailor for "a long-sleeved shirt". A good tailor asks, "What is it for?" A wedding and a hot workday need different cloth. The tailor is looking for the goal behind the request. Software works the same way. The **business need** is why the project exists. An **actor** is anyone or anything that uses the system or is affected by it. A **constraint** is a limit you cannot easily change, like the amount of cloth you have or the day of the wedding. Write them down in a short list, and show the list to the people involved before you build anything.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Real stakeholders disagree. Owners want every sale visible immediately, while helpers want the screen never to wait for the network. Do not resolve this in the design: write both goals with their reasons, find which is harder to change later, and get the business to rank them. Give goals and requirements stable identifiers, so a requirement links to a goal above it and to the tests and decision records below it. Challenge constraints on a schedule, because they expire: a team of three may become six, and a deadline may move. Distinguish a confirmed fact (an owner said it) from an assumption (the sales team believes it), and mark each in the brief, because a wrong assumption is the cheapest thing to fix before design and the most expensive after.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'From small projects you know requirements as a feature list. Architecture also needs the quality targets behind the list: how fast, how available, how safe, how many users. Write each one so a test or a measurement could prove it, because a target nobody can check will not shape any decision.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'Asking an assistant to write requirements from one sentence',
        prompt: `The founder says: "An app that helps small stores manage inventory and sales." Write the requirements.`,
        output: `Requirements:
1. Track inventory by item, batch and expiry date.
2. Record sales, with barcode scanning.
3. Integrate with the national tax authority's e-invoicing system.
4. Support six languages.
5. Forecast demand for each item with machine learning.
6. Provide five staff roles: owner, manager, cashier, accountant and auditor.
7. Offer a customer loyalty programme.`,
        notice: `Nothing in the one-sentence brief mentions batches, expiry dates, a tax system, languages, forecasting, accountants or loyalty. The assistant invented a whole product, with actors (an accountant, an auditor) and scope (tax integration) that nobody asked for, and it asked no questions first. Ask for questions before requirements, and label each line stated by you or assumed by the assistant. Each assumed line becomes a question for the stores.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write your own one-page brief first, using the table above: the need and how you will know, the actors, each actor's goal, the requirements you already believe in, and the constraints. Then use the assistant to challenge it, and leave the answers to the people involved.` },
      { type: 'prompt', label: 'Challenge my requirements brief', text: `Here is my requirements brief, written by me.

Business need and how we will know it worked: [your text]
Actors (primary, external, stakeholders): [your list]
Goal of each actor, as "As a ..., I want ... so that ...": [your list]
Requirements I believe in: [your list]
Constraints: [your list]

Please do not write new requirements. Instead:
1. Name any requirement that has no goal behind it.
2. Name any goal that has no requirement.
3. Tell me which actors I may have missed, as questions.
4. For each constraint, ask me whether it is a fixed rule or a habit, and who set it.
5. Point out any requirement that is really a solution in disguise.
6. Mark anything you assumed with ASSUMPTION.` },
      { type: 'paragraph', text: `What to verify: that every question is something you can take to a real person, that the assistant did not add new requirements, and that each ASSUMPTION is turned into a question rather than accepted. Then ask your actors, not the assistant, for the answers.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Take one feature request you are working on and ask the person who made it what outcome they want and how they would know it worked.',
        'Next is lesson 6: once you know the goals, you can make the quality targets measurable.',
        'Write the constraints of your current project on one line each and mark the ones that are habits.',
        'Lesson 7 shows how to use an assistant as an interviewer so that gaps in a brief are found before design starts.',
      ] },
      { type: 'takeaways', items: [
        'Keep four things apart: the business need, actors and their goals, requirements, and constraints.',
        'Treat a feature request as a clue: ask what outcome it serves and how you would know it worked.',
        'A requirement with no goal behind it is a question; so is a goal with no requirement.',
        'Watch for solutions disguised as requirements and assumptions disguised as constraints.',
        'An assistant asked to write requirements from one sentence invents a product; ask it to question your brief instead.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-05-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-02-requirement-sort',
          title: 'Lab: sort a brief into needs, goals, requirements and constraints',
          prompt: 'Write a prompt that labels eight statements from a TindaTrack Cloud planning note with exactly one of four labels, and run it. Define the labels in the prompt so the model does not have to guess them.',
          concept: 'requirement types',
          hints: [
            'The model does not know your four labels. Say what each one means in a single line.',
            'Some statements sound alike. Ask who the statement is about, and whether it can be changed.',
            'Ask for JSON only, with the fields s1 to s8 and one label each.',
          ],
          explanation: 'Your prompt and a real model reply are what you see after the run, and another run may differ. Compare each label with your own reading of the statement: the review is a guide, and the sorting rule (who is it about, and can it change) is what you take away.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-05-match-1',
          kind: 'match',
          title: 'What outcome is behind the request?',
          prompt: 'Match each request, as the team heard it, to the question or outcome you would confirm before building it.',
          concept: 'goal behind a request',
          labels: { terms: 'Request as the team heard it', meanings: 'What to confirm' },
          pairs: [
            { term: 'Add a nightly stock-count screen.', definition: 'The owner wants to know what to buy before opening, so fast sellers never run out', note: 'Behind a count screen is a need for a buy list, and a list can be worked out from sales already saved.' },
            { term: 'Use a message queue between the app and the database.', definition: 'No outcome is stated: it is a solution, so ask what problem it should solve', note: 'It names a technology, not a need. State the problem first, then compare solutions.' },
            { term: 'Let helpers see only the sales screen.', definition: 'The owner wants helpers not to see profit and supplier prices', note: 'The underlying goal is protecting some figures, which is a security requirement with a reason.' },
            { term: 'Make it work in three languages.', definition: 'Ask which languages the actual owners and helpers use, and how we would know they cannot work without it', note: 'Without the users and a success measure, the number three is only a guess.' },
          ],
          hints: [
            'For each request ask: what is the person trying to achieve, and how would they know it worked?',
            'One request is a technology rather than a need. Which one?',
            'One request describes a limit on who sees what. What is it protecting?',
          ],
          explanation: 'A request is a clue. Asking what outcome it serves often finds a cheaper way to meet the need, and sometimes shows that the request is only a solution or a guess.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-05-scenario-1',
          kind: 'scenario',
          title: 'A rule, or a habit?',
          prompt: 'Choose the best response to the constraint in the brief.',
          concept: 'constraints',
          situation: 'The brief for TindaTrack Cloud says: "The system must run on the store\'s own computer, not online." The founder says, "That is how we have always done it." The team can see that two stores have no computer at all, and the goal of the project is to let owners see several stores together.',
          options: [
            { text: 'Ask who set the rule and what it protects. If it is a habit, record it as an assumption; if it is a real limit, record it as a constraint with the reason.', consequence: 'The founder explains that one store had a bad experience with online systems and no signal. The team records "a store must keep working with no signal" as a requirement, and drops "must run on a store computer".', quality: 'best' },
            { text: 'Treat it as a constraint and design around the store\'s computer, because the founder said so.', consequence: 'The design cannot show several stores together, which is the project\'s goal. Two stores without computers cannot use it at all.', quality: 'poor' },
            { text: 'Ignore the line, because it clashes with the project\'s goal.', consequence: 'The team builds an online-only system and then finds the underlying concern (no signal) the hard way, in the first store.', quality: 'poor' },
            { text: 'Keep it as written and add "and online" so that both are possible.', consequence: 'The design now has to support two ways of running at once, and nobody knows which of them matters.', quality: 'acceptable' },
          ],
          hints: [
            'Ask where the line came from before accepting it or ignoring it.',
            'A constraint that has a reason can become a requirement. A constraint that only has a habit may not be a constraint.',
            'Look for the option that finds the concern behind the sentence.',
          ],
          explanation: 'Constraints should be questioned for their reason. Often the real concern behind a stated constraint (here, no signal) is a requirement the design can meet in a better way than the stated rule.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-05-arrange-1',
          kind: 'arrange',
          title: 'From need to design option',
          prompt: 'Put the lines in the order they are worked out, from the business need to an architecture option.',
          concept: 'requirements chain',
          language: 'text',
          solution: [
            'Business need: stores lose sales when popular items run out',
            'Actor goal: the owner wants to know before opening what to buy today',
            'Requirement: list items below minimum stock, ordered by how fast they sell',
            'Constraint check: three developers, four months, Android phones',
            'Architecture option: work the list out from sales that are already saved',
          ],
          reasons: [
            'The need comes first: it is why anything is built.',
            'The goal says who wants what, in their words.',
            'The requirement turns the goal into something the system must do.',
            'Constraints are checked against the requirement before any option is chosen.',
            'The option comes last, shaped by the requirement and the constraints.',
          ],
          hints: [
            'Start with the business problem, not the screen.',
            'The requirement follows the goal it serves.',
            'The architecture option is the last step, after the limits are known.',
          ],
          explanation: 'Each line is justified by the one above it. If a design option cannot be traced back through a requirement and a goal to a need, it is a guess.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-05-q1',
        prompt: 'An owner asks the team to add a nightly stock-count screen. What should the team do first?',
        choices: [
          'Build the screen exactly as described, since the owner knows the business best and a request is the same as a requirement.',
          'Ask what the owner is trying to achieve and how they would know it worked, before deciding what to build.',
          'Add the screen and also a daily stock report, to be sure that every possible need is covered by the release.',
          'Refuse the request because a team of three developers cannot afford any new screen in the current plan.',
        ],
        answer: 1,
        explanation: 'A request is a clue to a goal. Finding the goal behind it can show a cheaper way to meet the need, as with the buy-today list built from existing sales.',
      },
      {
        id: 'software-architecture-ai-05-q2',
        prompt: 'Which of these statements is a constraint?',
        choices: [
          'The team has three developers and must launch in four months.',
          'Owners must see a list of items that are below minimum stock.',
          'A helper wants to record a sale in a few seconds while a customer waits.',
          'Stores should lose fewer sales to items that run out unnoticed.',
        ],
        answer: 0,
        explanation: 'Team size and a deadline are fixed limits on how the system may be built. The second is a requirement, the third an actor\'s goal and the fourth a business need.',
      },
      {
        id: 'software-architecture-ai-05-q3',
        prompt: 'A requirement reads: "The system must use a message queue." What is the most useful way to treat it?',
        choices: [
          'As a firm requirement, because whoever wrote it probably knows the technology well and has already weighed the other options.',
          'As a mistake, which should be deleted without any discussion, because queues are never needed in a system of this size.',
          'As a constraint, because anything that names a technology has already been agreed with the team and cannot be questioned.',
          'As a possible solution: ask what problem it should solve, state that as the requirement, and compare options.',
        ],
        answer: 3,
        explanation: 'A queue is a solution. Stating the problem it was meant to solve (for example, reminders must not slow down sales) lets the team compare it fairly with simpler options.',
      },
      {
        id: 'software-architecture-ai-05-q4',
        prompt: 'In the TindaTrack Cloud brief, who is a stakeholder rather than a user of the system?',
        choices: [
          'The store owner, who records sales and reads the reports every day.',
          'The store helper, who records sales at the counter during opening hours.',
          'The founder who pays for the development and may never open the app.',
          'The text-message service, which the system calls to send reminders.',
        ],
        answer: 2,
        explanation: 'A stakeholder has a say in the system without necessarily using it. The owner and helper are primary users, and the text-message service is an external system.',
      },
      {
        id: 'software-architecture-ai-05-q5',
        audience: { max: 'beginner' },
        prompt: 'A tailor asks, "What will you wear it for?" before cutting the cloth. Which idea from the lesson does this show?',
        choices: [
          'Checking the budget before the work begins.',
          'Choosing the most popular cloth for every customer.',
          'Finding the goal behind a request before building.',
        ],
        answer: 2,
        explanation: 'The question looks for the goal behind "a long-sleeved shirt". Asking what a feature is for does the same for software.',
      },
      {
        id: 'software-architecture-ai-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Owners want every sale to be visible at once, while helpers want the sale screen never to wait for the network. What is the best response at the requirements stage?',
        choices: [
          'Choose the owners\' goal, because the owners pay for the product and their needs must always come before those of the helpers.',
          'Write both goals with their reasons, find which is harder to change later, and ask the business to rank them.',
          'Design the most complex system that satisfies both goals fully, so that nobody has to be disappointed by the result.',
          'Leave it to the developers to decide when they build the first version, since they know the technical limits best.',
        ],
        answer: 1,
        explanation: 'Conflicting goals are a business decision. Recording both with reasons and the cost of changing each lets the business rank them, and prevents the design from hiding the conflict.',
      },
    ],
    task: {
      title: 'Write a one-page requirements brief',
      minutes: 18,
      steps: [
        'Choose a system you are building or planning. Fill in six rows: the business need, how you will know it worked, the actors, each actor\'s goal, the requirements and the constraints.',
        'Find one requirement with no goal behind it and one goal with no requirement. Write what you would ask about each.',
        'Pick one constraint that might be a habit rather than a rule, and write the question that tests it.',
        'Show the brief to one person who is affected by the system and write down what they change.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you have no project yet, use an idea such as an app for a school canteen. Write the need, two actors and one goal for each, and one constraint, in plain sentences.'] },
      { audience: { min: 'advanced' }, steps: ['Give every goal and requirement an identifier, link each requirement to its goal, and mark each item as confirmed (with the source) or assumed. Count how many of your requirements rest on assumptions, and rank them by how costly it would be to be wrong.'] },
    ],
  },
  {
    id: 'software-architecture-ai-06',
    day: 6,
    title: 'Quality Attributes: Making Performance, Availability, Security and Scale Measurable',
    summary: 'Turn wishes like "fast" and "secure" into scenarios with a stimulus, an environment, a response and a measure you can test.',
    intro: {
      objectives: [
        'Write a quality attribute as a scenario with a stimulus, an environment, a response and a measure',
        'Apply the rule that a quality attribute without a number or a test is a wish',
        'Choose measures for performance, availability, security and scalability, and say where the numbers must come from',
      ],
      why: 'Quality attributes decide the structure of a system, yet they are the requirements most often left as adjectives. A measurable one tells you what to build, what to test and when you are done.',
    },
    minutes: 26,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `"The system must be fast, available and secure." Everyone agrees with that sentence, and that is the problem: it asks nothing of the team, so every team can believe it has met it. The words are called quality attributes, and they decide the shape of a system more than most features do. This lesson turns them into something you can build against and test, using one rule: **a quality attribute without a number or a test is a wish.**` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `The TindaTrack Cloud requirements say, "The app must be fast and always available." A developer takes "fast" seriously and spends a week adding a cache in front of the database, which adds code to keep the cache correct and creates a bug where an edited price shows the old value for a while.` },
      { type: 'paragraph', text: `The owners' real complaint was different. The sale screen was fine. It was the weekly report on Sunday evening: it added up a year of sales on a small server, and it took so long that owners thought the app had frozen and tapped it again. A week of work, and a new bug, were aimed at the wrong thing. When the team wrote one measurable sentence about the Sunday report, the fix was small: save a summary each night, so the report reads a few rows instead of adding up thousands. The wish had not told them where to look. A measure did.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `A **quality attribute scenario** is a short story with four parts. Write all four; if one is missing, the attribute is probably still a wish.` },
      { type: 'list', items: [
        '**Stimulus:** what happens: a user action, an event, a failure or an attack.',
        '**Environment:** the conditions: normal day or peak, good signal or weak, during a release, with a year of data.',
        '**Response:** what the system does.',
        '**Measure:** how someone would judge it: a number, or a test that passes or fails. This part makes it real.',
      ] },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  Wish[The app must be fast] --> Ask[Fast for whom, when, and by how much?]
  Ask --> Scenario[Stimulus, environment and response]
  Scenario --> Measure[A number or a test]
  Measure --> Check[Run the test and see]`,
        caption: 'From wish to check. Look at the question in the second box: asking it turns an adjective into a stimulus and a condition.',
      },
      { type: 'paragraph', text: `Here are four attributes for TindaTrack Cloud as scenarios. **The numbers are made-up examples for practice, not recommendations.** The real numbers come from a conversation with the people affected.` },
      {
        type: 'table',
        headers: ['Attribute', 'The wish', 'The scenario, in one line', 'How you would test it'],
        rows: [
          ['Performance', 'It must be fast', 'When an owner opens the weekly report on a Sunday evening with a year of sales saved, it appears within 5 seconds in 95 out of 100 attempts', 'Time the report on a test database holding a year of generated sales'],
          ['Availability', 'Always available', 'When the server restarts during store hours, sales entered on phones are kept and sent when it returns, so no sale is lost', 'Restart the server during a scripted run of sales and count them afterwards'],
          ['Security', 'It must be secure', 'When a helper from store A asks for a report of store B, the system refuses and records the attempt', 'A two-store test: ask, and check that no rows from store B come back'],
          ['Scalability', 'It must scale', 'When the number of stores grows from 200 to 2,000, the Sunday report still meets its target by adding capacity, not by rewriting it', 'Load test with generated data for 2,000 stores and no code change'],
        ],
        caption: 'Each row has a stimulus, a condition, a response and a check. Notice that the security row is a pass or fail test, not a number.',
      },
      { type: 'paragraph', text: `The same scenario can be kept as a small record next to the requirements, so that it is reviewed like code:` },
      {
        type: 'code',
        language: 'yaml',
        label: 'A scenario card (the numbers are examples to confirm with the owners)',
        code: `id: PERF-1
attribute: performance
stimulus: Owner opens the weekly report
environment: Sunday evening, a year of sales saved, mid-range phone on mobile data
response: The report is shown with the totals of all the owner's stores
measure: Within 5 seconds for 95 of 100 attempts (example number, confirm with owners)
test: Time the report against a test database with a year of generated sales
priority: 1`,
      },
      { type: 'paragraph', text: `"95 out of 100" is deliberate. An average hides the slow cases: an average of two seconds can include some attempts that take half a minute. Naming a share of attempts says how many are allowed to be slower, which matches how people experience a system. (Engineers call this a percentile.)` },
      { type: 'paragraph', text: `Where do the numbers come from? Not from the architect. Ask the people affected what happens to them if the report takes 5 seconds, 20 seconds or a minute, and what it would cost the business if the system were down for an hour in the evening. Each step up in a target usually costs more in money, people and complexity, and the cost rises faster than the benefit, so a target should be chosen, not maximised. Qualities also pull against each other: stricter security can add steps for the helper, and a faster screen may need a more expensive setup. Pick the three to five that matter most and rank them. If everything is top priority, nothing is.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In everyday words: compare "make the soup tasty" with "ready in ten minutes, salt at most one spoon, served hot". Only the second can be checked with a clock and a spoon. A quality attribute is a "how well" requirement, such as how fast, how reliable or how safe the system must be. A **scenario** describes one situation: something happens (the stimulus), under certain conditions (the environment), the system reacts (the response), and you can say whether that was good enough (the measure). A **test** is a way to check it. If you cannot measure or test it, it is a wish, and wishes cannot guide a design.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Percentiles and averages answer different questions, so report both when it matters, and note that tail latency tends to be what users remember. Targets can differ by feature: the sale screen, the report and the export deserve separate scenarios, because a single "system-wide" number hides the costly one. Write the cost of each target next to it, in people, money and operational burden, so that the business agrees to the price and not just the number. Treat a scenario as a hypothesis you can test cheaply: a load test or a failure drill is an experiment that either supports the design or sends you back to it. Later, a measured target becomes a service level objective that operations can watch; the module on reliability picks that up. Where you cannot measure directly (for example, maintainability), use a proxy you can review, such as the time to add a new report in a trial.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'Asking an assistant to make quality attributes measurable',
        prompt: `Rewrite "The TindaTrack app must be fast, available and secure" as measurable quality scenarios.`,
        output: `Quality scenarios:

1. Availability: the system has 99.999% uptime every month.
2. Performance: every request completes in under 10 ms with 1,000,000 concurrent users.
3. Security: the system passes all penetration tests and is fully protected against all known attacks.`,
        notice: `The format is close: each line has a number or a claim. The content is not usable. The figures (five nines, 10 ms, a million users) were invented by the assistant and would be extremely costly for a small store app, and nobody agreed them with the owners. None of the lines has a stimulus or an environment, so there is nothing specific to test. "Passes all penetration tests" and "fully protected" are claims, not measures. Use the answer as a format and ask for the questions to put to the business, such as "what happens to a store if the app is down for an hour in the evening?"`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Take three quality wishes from a real project, or from your notes (for example "fast", "reliable", "secure"). Rewrite each as a scenario with a stimulus, an environment, a response and a measure yourself, leaving a placeholder wherever you do not know a number. Then ask the assistant to review your scenarios, not to write them.` },
      { type: 'prompt', label: 'Review my quality scenarios', text: `I am writing quality attribute scenarios for [your system, in one sentence]. Here are my three drafts, each with a stimulus, environment, response and measure:
1. [your scenario]
2. [your scenario]
3. [your scenario]

Please do not invent numbers.
1. For each scenario, tell me which of the four parts is missing or vague.
2. Tell me for each measure whether it can be tested, and how.
3. For every number or placeholder, write the question I should ask the business to fill it in.
4. In plain words, say what each target may cost in people, money and complexity if it is set high, without giving prices.
5. Mark anything you assumed with ASSUMPTION.` },
      { type: 'paragraph', text: `What to verify: that the assistant added no numbers, that every question can be asked of a real person, and that each test it describes is something you could actually run. Then ask the business for the numbers.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Find one adjective in your current project\'s requirements ("fast", "secure", "reliable") and rewrite it as a scenario with a test.',
        'Next is lesson 7, which uses an assistant as an interviewer to find the gaps in a brief and the assumptions it hides.',
        'Keep your scenario cards beside the requirements: later modules (reliability, security) come back to them as targets to check.',
        'Add one load or failure test to your project that checks a scenario, even if it is only a script that you run by hand.',
      ] },
      { type: 'takeaways', items: [
        'A quality attribute scenario has a stimulus, an environment, a response and a measure.',
        'A quality attribute without a number or a test is a wish, and wishes cannot guide a design.',
        'Numbers come from the people affected and the business, and each higher target costs more, so choose a target rather than maximising.',
        'Qualities pull against each other: rank the three to five that matter most.',
        'An assistant may produce a good format with invented numbers; use it to find questions and check the form, and take the numbers from people.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-06-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the scenario card',
          prompt: 'Fill in the gaps of this scenario card with the words that belong there.',
          concept: 'quality scenarios',
          language: 'text',
          code: `Stimulus: An owner opens the weekly ___
Environment: Sunday evening, with a year of sales ___
Response: The report is shown with the totals of all the owner's stores
Measure: Within 5 seconds for 95 out of 100 ___
Test: Time it against a test ___ with a year of generated sales`,
          blanks: [
            { answers: ['report'], feedback: 'The stimulus is what the owner does: open the weekly report.' },
            { answers: ['saved'], feedback: 'The environment describes the conditions: a year of sales is already saved.' },
            { answers: ['attempts'], feedback: 'A measure counts attempts, not averages: it says how many may be slower.' },
            { answers: ['database'], feedback: 'The test needs a database with realistic data: generated sales for a year.' },
          ],
          bank: ['report', 'saved', 'attempts', 'database', 'wishes', 'deleted', 'averages'],
          hints: [
            'Read each line and ask which of the four parts it is: stimulus, environment, response or measure.',
            'The measure is about how many tries meet the target. The test is how you would check it.',
            'Words like "wishes" and "deleted" do not describe a condition or a test.',
          ],
          explanation: 'A scenario names what happens, the conditions, the response and a measure you can test. Written this way, the Sunday report has a target and a test, which the wish "fast" never had.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-06-match-1',
          kind: 'match',
          title: 'What is missing from the wish?',
          prompt: 'Match each wish to the question that would turn it into a scenario.',
          concept: 'quality scenarios',
          labels: { terms: 'The wish', meanings: 'What to ask' },
          pairs: [
            { term: '"The app must be fast."', definition: 'Fast for which action, under which conditions, and by what measure?', note: 'Speed is only meaningful for a stated action in a stated situation.' },
            { term: '"The system must be highly available."', definition: 'What can fail, when, and what must still work while it does? How would we test it?', note: 'Availability is about behaviour during a failure, so name the failure and what must survive.' },
            { term: '"The system must be secure."', definition: 'Who must not be able to do what, and which test shows that they cannot?', note: 'Security becomes testable once you name the person, the action and the check.' },
            { term: '"The app must scale."', definition: 'Growth from what to what, and what must stay the same: the target, or the design?', note: 'Scale means a stated growth and what is allowed to change when it happens.' },
          ],
          hints: [
            'Each wish has one thing it never says. What is it?',
            'The security wish needs a person, an action and a check.',
            'The scale wish needs a starting size, an ending size and a promise about what stays the same.',
          ],
          explanation: 'Every adjective hides a stimulus, a condition and a measure. Asking the matching question is the quickest way to find what the wish is missing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-06-scenario-1',
          kind: 'scenario',
          title: 'Which rewrite can the team build against?',
          prompt: 'Choose the rewrite of "the sale screen must be fast" that the team can build and test.',
          concept: 'quality scenarios',
          situation: 'Owners complain that recording a sale is slow on weak mobile data. The requirements say only "the sale screen must be fast". The team wants a version they can test. The numbers below are examples to confirm with the owners.',
          options: [
            { text: 'When a helper taps Save on a mid-range phone on weak mobile data, the sale is shown as saved within 2 seconds in 95 out of 100 attempts, tested by timing 100 scripted sales on a throttled connection.', consequence: 'The team now has a stimulus, an environment, a response, a measure and a test. They find that the save waits for the server, and decide to save on the phone first.', quality: 'best' },
            { text: 'The sale screen should respond within 2 seconds.', consequence: 'There is a number, but no conditions. It passes on a laptop with fast internet and still fails in the store, so the team thinks it is done.', quality: 'acceptable' },
            { text: 'The sale screen should be as fast as possible, even under heavy load.', consequence: 'Nobody can tell when it has been reached, so the team keeps tuning without a stopping point.', quality: 'poor' },
            { text: 'The sale screen should have 99.99% uptime.', consequence: 'That is an availability target, not a speed target. It is untested, and it quietly commits the team to costly infrastructure.', quality: 'poor' },
          ],
          hints: [
            'A number alone is not enough. What condition does it apply to?',
            'Look for the option with a stimulus, an environment, a response, a measure and a test.',
            'Uptime and speed are different qualities.',
          ],
          explanation: 'The best rewrite names the action, the real conditions (weak data, mid-range phone), the response, a measure with a share of attempts, and a test. A bare number passes in the wrong place, and adjectives never end.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-06-q1',
        prompt: 'Which statement is a usable quality requirement?',
        choices: [
          'The system should be as secure as possible, using the best practices that are known at the time of development.',
          'The system offers high availability at all times, so that stores can rely on it without any problems in daily work.',
          'When a helper asks for another store\'s report, the system refuses and logs it; a two-store test returns no rows.',
          'The system must be fast enough that owners are happy with the speed of every screen in the app during their work.',
        ],
        answer: 2,
        explanation: 'Only the third has a stimulus, a response and a pass-or-fail test. The others are adjectives: nobody could say when they were met.',
      },
      {
        id: 'software-architecture-ai-06-q2',
        prompt: 'Where should the number in "within 5 seconds for 95 out of 100 attempts" come from?',
        choices: [
          'From the most advanced competitor, because matching the best product on the market is the safest target to choose.',
          'From the architect\'s experience, since the architect knows what a modern system can do and which numbers are realistic.',
          'From a standard figure for web apps, so that the target does not need to be discussed with anyone at the business.',
          'From the people affected and the business: ask what happens to them at 5, 20 and 60 seconds, and what it costs.',
        ],
        answer: 3,
        explanation: 'A target is a business decision with a cost. Copying a competitor or a standard number skips both the real need and the real price.',
      },
      {
        id: 'software-architecture-ai-06-q3',
        prompt: 'Developers say "fast" means a quick API response, while owners mean the Sunday report. What is the best lesson?',
        choices: [
          'Write a separate scenario for each concern, each with its own stimulus and measure, so each kind of "fast" is tested alone.',
          'Pick the developers\' meaning, because they are the ones who know how fast a system can be made and what is possible.',
          'Ask for a single system-wide response time, which will make both concerns come out right because both then share one number.',
          'Delay the discussion until the system is built, because speed can only be judged on real data from real users in production.',
        ],
        answer: 0,
        explanation: 'One word hid two different stimuli. Separate scenarios make both visible and testable, and a single system-wide number hides the costly one.',
      },
      {
        id: 'software-architecture-ai-06-q4',
        prompt: 'The team reports an average response time of 2 seconds and calls it good. What can that average hide?',
        choices: [
          'Nothing important, because an average describes the typical experience of every single user who opens the app on any day.',
          'A few very slow responses that some users meet often, which is why a measure uses a share of attempts.',
          'A fault in the measuring tool, because averages are always wrong when there are more than a few requests to count.',
          'A shortage of servers, since averages only rise when the servers are full and cannot take any more requests.',
        ],
        answer: 1,
        explanation: 'An average can include slow cases that individual users remember. A share of attempts says how many may be slower and matches the user\'s experience.',
      },
      {
        id: 'software-architecture-ai-06-q5',
        audience: { max: 'beginner' },
        prompt: 'Which version of a recipe goal can you check with a clock and a spoon?',
        choices: [
          'Ready in ten minutes, with at most one spoon of salt.',
          'Quick and tasty, just the way that the family likes it best.',
          'As fast as possible without losing any of the flavour.',
        ],
        answer: 0,
        explanation: 'Only the first has measures. A quality attribute without a number or a test is a wish, like "quick and tasty".',
      },
      {
        id: 'software-architecture-ai-06-q6',
        audience: { min: 'advanced' },
        prompt: 'Product asks for "five nines" availability on the sale screen. The team has three developers and nobody has costed it. What should you do?',
        choices: [
          'Accept the target, because product owns the business and has probably already thought it through with the owners of the stores.',
          'Reject it as impossible, since a small team of three developers cannot deliver high availability at all, whatever it costs.',
          'Adopt the highest level that the cloud provider advertises, so that nobody can later blame the design for any downtime.',
          'Write the scenario, ask what an hour of downtime costs the stores, and show what each level adds in effort and complexity.',
        ],
        answer: 3,
        explanation: 'A target is a trade-off. Naming the scenario and the business cost, then showing what each level takes, turns an adjective into a decision the business can own.',
      },
    ],
    task: {
      title: 'Turn three wishes into scenarios',
      minutes: 18,
      steps: [
        'Collect three quality wishes from a real project or your notes, such as "fast", "reliable" or "secure".',
        'Rewrite each as a scenario with a stimulus, an environment, a response, a measure and a test. Where you do not know a number, write a placeholder.',
        'For every placeholder, write the question you would ask the business, and who you would ask.',
        'Rank your three scenarios by importance and write one sentence on which of them pulls against another.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use the TindaTrack wishes "the app must be fast", "the app must be safe" and "the app must always work". Write a scenario for each one in plain sentences, and mark which numbers you made up.'] },
      { audience: { min: 'advanced' }, steps: ['Find two scenarios in your own system that pull in opposite directions (for example stricter login against a faster sale screen). Write the trade-off, what each side costs, and who has the authority to decide.'] },
    ],
  },
  {
    id: 'software-architecture-ai-07',
    day: 7,
    title: 'AI-Assisted Requirements Discovery: Questions, Assumptions and Gaps',
    summary: 'Use an assistant as an interviewer and a gap finder, keep an assumptions log, and take every unanswered question to the people who know.',
    intro: {
      objectives: [
        'Use an assistant to ask questions about a brief instead of writing requirements from it',
        'Keep an assumptions log that says what changes if each assumption is wrong and how to check it',
        'Ask an assistant to find gaps and contradictions in a draft, with the line each one comes from',
      ],
      why: 'A missing requirement costs a conversation if you find it now and a rework if you find it after the data model is built. An assistant is fast at asking the questions you forgot, as long as you keep the answers with the people who know.',
    },
    minutes: 26,
    skills: ['arch-foundations'],
    body: [
      { type: 'paragraph', text: `When teams first try an assistant on requirements, they usually ask it to write them. That is the weakest use. The answer is fluent and complete-looking, and most of what makes it complete was never in your brief. The strongest use is the opposite: you provide the facts, and the assistant asks the questions you forgot, lists the assumptions it can see you are making, and points at gaps and contradictions. The answers always come from the people who know. This lesson shows a routine for that, and the live lab at the end puts it into practice.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `The TindaTrack Cloud team gives an assistant a one-page brief and asks it to write the requirements. It returns thirty neat lines. The team accepts them, builds, and discovers two months later that a requirement was missing and another had been invented. The missing one: many stores are owned by two people, such as a couple, and the data model had one owner per store. The invented one: supplier ordering, which no store wanted.` },
      { type: 'paragraph', text: `On the second attempt, Marlon asks the assistant to interview him instead. In five minutes it asks, "Can one store have more than one person who owns it?" He does not know, so he asks three owners, and two say yes. Finding it now costs one conversation. Finding it after the accounts, the reports and the permissions were built on one owner per store costs a rework of all three.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The routine gives the assistant three jobs and keeps the fourth for you. It **asks questions** you have not considered, it **lists assumptions** it can see in your brief, and it **finds gaps and contradictions**. You and the business **answer and decide**.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant You
  participant AI as Assistant
  participant Owner as Store owner
  You->>AI: My brief, and "ask questions, do not answer them"
  AI-->>You: Questions grouped by topic
  You->>Owner: The questions I cannot answer
  Owner-->>You: Answers and surprises
  You->>AI: Updated brief, and "list assumptions and gaps"
  AI-->>You: Findings with the line each one comes from`,
        caption: 'The discovery routine. Look at who answers the questions: the store owner, not the assistant. The assistant only asks and checks.',
      },
      { type: 'paragraph', text: `A checklist of topics keeps the questions from being random. Ask the assistant to cover each one, and add your own:` },
      { type: 'list', items: [
        '**Users and roles:** who uses it, and what each kind of user may see and do.',
        '**Data:** what is stored, for how long, and who owns it.',
        '**Growth:** how many users, stores or records, and how fast that might change.',
        '**Failure:** what must still work with no signal, or when a part is down.',
        '**Security and privacy:** who must not see what, and which data is personal.',
        '**Integration:** other systems involved, and who owns them.',
        '**Money and rules:** prices, taxes, payments and any rules the business must follow.',
        '**Time and team:** the deadline, the budget, and the skills available.',
        '**Out of scope:** what the system deliberately will not do.',
      ] },
      { type: 'paragraph', text: `The second output is an **assumptions log**. An assumption is something you are treating as true without having checked. Write each one down with what would change if it were wrong, how you would check it, and who will check. Then rank the log by two things: how uncertain the assumption is, and how costly it is if it is wrong. Check the top of the list first, and use the cheapest check that works: ask three owners, look at one store, build a small trial.` },
      {
        type: 'table',
        headers: ['Assumption', 'If it is wrong, what changes', 'How to check it', 'Who'],
        rows: [
          ['Each store has one owner', 'Accounts, permissions and every report', 'Ask three store owners', 'Marlon'],
          ['Stores have a phone signal most of the day', 'Offline saving becomes essential rather than optional', 'Visit two stores and watch for a morning', 'Joy'],
          ['About 200 stores in the first year (the sales team\'s estimate)', 'Size and cost of the servers', 'Ask sales for what the estimate is based on', 'Marlon'],
        ],
        caption: 'Part of an assumptions log. The first row is the one to check first: it is the most expensive to get wrong and the cheapest to check.',
      },
      { type: 'paragraph', text: `What can the assistant not know? Your users, your data, your budget, your team and your organisation's politics. Because it does not know them, it will fill the gap with the most common answer, and it will sound as sure about a guess as about a fact. Four habits protect you: ask for questions before answers, ask it to quote the line behind every finding, ask it to label what it assumed, and never ask it for numbers. Also keep customer details out of the chat: write the brief with made-up or removed personal data, and follow your organisation's rules about what may be sent to an assistant.` },
      { type: 'visual', id: 'arch-assistant', caption: 'Describe your system and ask the architecture assistant for a requirements analysis. It states its assumptions and asks for missing information; the answers stay yours.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: when you go to a doctor, a good one asks questions first: where does it hurt, since when, what have you taken? A doctor who writes a prescription in the first ten seconds is guessing. Use the assistant like the good doctor. Give it your short description, tell it to ask questions, and answer them yourself or go and ask the people who know. An **assumption** is a thing you are treating as true without having checked, like "every store has one owner". Writing assumptions down turns hidden guesses into a list you can check.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `An assumptions log is a lightweight risk register. Rank by uncertainty times cost of being wrong, and retire the top items with the cheapest experiment: an interview round, a spike, a prototype, a look at production data. With many sources (interview notes, tickets, an existing system's behaviour) an assistant can help find contradictions across documents, as long as you require quotes and then check the quotes yourself; models can attribute a sentence to the wrong document or count things badly, so do not use it to produce statistics. Keep a link from each requirement to the assumption or evidence behind it, so that when an assumption fails you can find everything that depended on it. And treat the brief and the notes as your data: do not paste anything personal or confidential unless your organisation's policy allows it.` },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An interview with assumptions slipped in',
        prompt: `Here is my brief for TindaTrack Cloud: a shared online service for small stores. Owners record sales and stock and see all their stores together. Text reminders go to customers who owe store credit. Online payments through an e-wallet provider are planned for phase 2. About 200 stores are expected in year one. Ask me what you need to know. Do not answer your own questions.`,
        output: `Questions:
Users: Can one store have more than one owner? Do helpers need their own logins?
Data: How long must sales history be kept? Who owns a store's data if the owner leaves?
Failure: What must still work when a phone has no signal?
Privacy: How are customers' phone numbers collected and protected?

Before I continue, I will assume that TindaTrack processes card payments, so card-payment security rules apply to the whole system; that the app must be available 24 hours a day; and that traffic could grow ten times in a year. Please confirm.`,
        notice: `The questions are exactly the right kind: roles, data retention, failure and privacy each point at a real gap in the brief. The paragraph that follows is the flaw. Card payments are not in the brief (only an e-wallet provider, planned for phase 2), and "24 hours" and "ten times" are numbers nobody gave. They are written as the assistant's plan and ended with "please confirm", which makes them easy to accept. Move each one to the assumptions log as a question for the business, and do not let any of them become a default.`,
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Use your own brief (or the TindaTrack Cloud brief above). Start with the interview prompt, answer what you can, and take the rest to the people who know. Then use the second prompt on your updated draft. Remove customer details from anything you paste.` },
      { type: 'prompt', label: 'Interview me about my brief', text: `Here is my brief, written by me:
[your brief in 5 to 10 sentences, with personal data removed]

Act as an interviewer. Ask me questions grouped by these topics: users and roles, data, growth, failure, security and privacy, integration, money and rules, time and team, out of scope. Do not answer your own questions, do not write requirements, do not suggest technology, and do not give numbers. If you need to assume something to ask a question, label it ASSUMPTION and phrase it as a question to me.` },
      { type: 'prompt', label: 'Find the gaps and contradictions', text: `Here is my updated draft, with the answers I got:
[your draft with line numbers or requirement ids]

Using only what the draft says, list: (1) pairs of lines that contradict each other, (2) requirements that have no number or test, (3) gaps: things a system like this would need that the draft does not mention. For each item give the line it comes from and write a question I should ask the business. Do not invent requirements or numbers. Label anything you assumed with ASSUMPTION and finish with what you cannot know from the draft.` },
      { type: 'paragraph', text: `What to verify: that each quoted line really exists in your draft, that every ASSUMPTION is now a question in your log, and that the assistant added no requirement of its own. Then take the questions to a person.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Start an assumptions log for your current project with at least five rows, and check the top one this week.',
        'Open the architecture assistant with a short brief of your system and ask for a requirements analysis; compare its questions with your own list.',
        'Module 3 uses the requirements you now have to compare architecture styles, starting with why a monolith is a strong default.',
        'Read the stakeholder interview notes or support tickets for your product, if you have them, and look for a requirement nobody has written down.',
      ] },
      { type: 'takeaways', items: [
        'Use an assistant as an interviewer and gap finder: it asks questions, lists assumptions and flags gaps, and you answer and decide.',
        'Cover the topics: users and roles, data, growth, failure, security and privacy, integration, money and rules, time and team, and out of scope.',
        'Keep an assumptions log that says what changes if each one is wrong and how to check it, and check the riskiest first.',
        'Never accept an assistant\'s numbers or assumptions as defaults: each becomes a question for the business.',
        'Keep customer data out of the chat, and ask for the quoted line behind every finding.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-07-prompt-lab-1',
          kind: 'prompt-lab',
          labId: 'arch-02-brief-gaps',
          title: 'Lab: find the gaps in a requirements draft',
          prompt: 'Write a prompt that makes the model review the TindaTrack Cloud draft and list its gaps, contradictions and requirements with no measure, quoting the line each comes from. Ask for questions, not invented answers, and run it.',
          concept: 'requirements discovery',
          hints: [
            'Say exactly what kind of review you want: gaps, lines that contradict each other and requirements with no measure.',
            'Ask for the requirement number next to every finding, so you can check it against the draft.',
            'Ask for questions to put to the business instead of fixes, and tell the model to label anything it assumed.',
          ],
          explanation: 'What you see after the run is your prompt and one real model reply, and another run may differ. Check each finding against the draft: a finding with a real requirement number behind it is reliable, and one with no line behind it is the assistant\'s guess.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-07-scenario-1',
          kind: 'scenario',
          title: 'Which assumption do you check first?',
          prompt: 'Choose the assumption to check first.',
          concept: 'assumptions log',
          situation: 'Marlon\'s assumptions log has three rows: "Each store has one owner" (if wrong, accounts, permissions and every report change), "Stores have a signal most of the day" (if wrong, offline saving is essential) and "About 200 stores in the first year" (if wrong, server size and cost change). He has time for one check this week. He can ask three store owners about ownership in an afternoon.',
          options: [
            { text: 'Ask three owners whether a store can have more than one owner: it is the costliest to get wrong and the cheapest to check.', consequence: 'Two of the three say yes. The team changes the data model before any account or report is built, at almost no cost.', quality: 'best' },
            { text: 'Ask sales to justify the 200-store estimate, because every cost in the plan depends on it.', consequence: 'The estimate turns out to be a hope, and the team plans cautiously. It is a useful check, but the ownership question would have saved more rework.', quality: 'acceptable' },
            { text: 'Visit two stores to watch signal strength, since offline saving is the hardest feature.', consequence: 'The visit shows weak signal, which the team half expected. It confirms an existing decision and leaves the ownership question open.', quality: 'acceptable' },
            { text: 'Ask the assistant which of the three assumptions is true and use its answer.', consequence: 'The assistant answers confidently and without evidence. The team builds on a guess and learns the truth from a customer.', quality: 'poor' },
          ],
          hints: [
            'Rank by how costly it is to be wrong and how cheap it is to check.',
            'One assumption touches accounts, permissions and every report.',
            'An assistant cannot know your stores. Only the people who run them can.',
          ],
          explanation: 'The best first check is the one that is most expensive to get wrong and cheap to verify. The other two are worth checking, but they change fewer things. An assistant cannot replace asking the owners.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-07-match-1',
          kind: 'match',
          title: 'What changes if the assumption is wrong?',
          prompt: 'Match each assumption to what would change in the design if it turned out to be wrong.',
          concept: 'assumptions log',
          labels: { terms: 'Assumption', meanings: 'What changes if it is wrong' },
          pairs: [
            { term: 'Each store has exactly one owner', definition: 'Accounts, permissions and every report that is grouped by owner', note: 'Ownership is part of who may see what, so it touches accounts and reports.' },
            { term: 'Stores have a phone signal for most of the day', definition: 'Saving on the phone first becomes essential instead of optional', note: 'It decides whether a sale must be saved locally before it is sent.' },
            { term: 'Customers\' phone numbers can be typed in by the owner', definition: 'How the numbers are collected, kept and protected, and who may see them', note: 'Personal data raises questions about consent and storage.' },
            { term: 'About 200 stores in the first year', definition: 'The size and cost of the servers, and how soon growth work is needed', note: 'The number drives capacity and cost, so it needs evidence.' },
          ],
          hints: [
            'For each assumption, ask what part of the design would have to be redone.',
            'The phone number assumption is about personal data.',
            'The ownership assumption is about who can see what.',
          ],
          explanation: 'Knowing what depends on an assumption tells you how hard to work to check it. An assumption that touches accounts or personal data deserves an early check.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-07-q1',
        prompt: 'You give an assistant a one-page brief and ask it to write the requirements. What is the main risk?',
        choices: [
          'It fills the gaps with plausible requirements, actors and numbers nobody stated, and the team may build them.',
          'It writes far too few requirements, because assistants always stop after a short list and miss many obvious features.',
          'It refuses to write requirements without a signed contract from the owner of the product, which delays every project.',
          'It writes requirements in a format that developers cannot read, so a person must translate every single line first.',
        ],
        answer: 0,
        explanation: 'The fluent, complete-looking list is the danger: most of what makes it complete was never in the brief. An interviewer role keeps the invented content out.',
      },
      {
        id: 'software-architecture-ai-07-q2',
        prompt: 'Which instruction best keeps an assistant in the interviewer role?',
        choices: [
          'Write the full list of requirements for this system and highlight the ones that you think are the most important.',
          'Ask me questions by topic. Do not answer them or propose requirements, and label anything you assumed.',
          'Tell me what a modern architecture for this system should look like and why it is better than a simpler one.',
          'Complete the missing parts of my brief using your best judgment so that I do not need to ask anyone.',
        ],
        answer: 1,
        explanation: 'The instruction names the job (questions), forbids the unwanted ones (answers and proposals) and requires assumptions to be labelled.',
      },
      {
        id: 'software-architecture-ai-07-q3',
        prompt: 'You can check one assumption this week: "one owner per store", "stores have signal most of the day", or "about 200 stores in year one". Which should you check first?',
        choices: [
          'The 200-store estimate, because every number in the plan depends on it, and everything else follows from it.',
          'The signal assumption, because offline saving is the hardest feature, and the hardest feature should be checked first.',
          'One owner per store, because it touches accounts, permissions and every report, and it is cheap to ask three owners.',
          'None of them: they are assumptions, so they should wait until the system is built and real data arrives.',
        ],
        answer: 2,
        explanation: 'Rank by cost of being wrong and cheapness of the check. Ownership touches the most parts and can be checked in an afternoon.',
      },
      {
        id: 'software-architecture-ai-07-q4',
        prompt: 'An assistant reports that requirements R4 (works offline for a week) and R5 (always shows live totals) contradict each other. What should you do?',
        choices: [
          'Let the assistant decide which of the two should stay, because it spotted the problem and has read the whole draft closely.',
          'Delete both requirements, because contradictory lines cannot be built and the safest choice is to remove them.',
          'Accept the finding without checking, because the assistant quoted line numbers so it must be right about the clash.',
          'Read both lines in your own draft; if they really clash, take the conflict to the business to rank, and record it.',
        ],
        answer: 3,
        explanation: 'A finding is a hypothesis. Checking the lines yourself confirms it, and a real conflict between two goals is a business decision, not an assistant\'s.',
      },
      {
        id: 'software-architecture-ai-07-q5',
        audience: { max: 'beginner' },
        prompt: 'A doctor asks you questions before saying what is wrong. Which part of the lesson is this like?',
        choices: [
          'Asking the assistant to write all of the requirements in the very first message.',
          'Having the assistant interview you, so that questions come before answers.',
          'Sending the assistant your private passwords so that it can see everything.',
        ],
        answer: 1,
        explanation: 'A good interviewer, like a good doctor, asks first. That keeps guesses out and shows what you still need to find out.',
      },
      {
        id: 'software-architecture-ai-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your team keeps interview notes from twenty store owners, with no customer details. What is a sound way to use an assistant on them?',
        choices: [
          'Ask it to produce the final requirements and ship them in one pass without review, since the notes are the source and it has read them all.',
          'Paste the notes together with customers\' phone numbers, so that the assistant has the full picture of every store, owner and customer.',
          'Ask it for the exact percentage of owners who want each feature, and use those to rank the backlog for the next release without a second check.',
          'Ask it to find contradictions and unanswered questions across the notes with quotes, check the quotes yourself, and follow the data policy.',
        ],
        answer: 3,
        explanation: 'Cross-document contradictions with quotes are a good use, as long as you verify the quotes. Models can misattribute and miscount, so statistics and final requirements need people, and private data needs a policy check.',
      },
    ],
    task: {
      title: 'Interview your own brief',
      minutes: 20,
      steps: [
        'Write a five to ten sentence brief for a system you work on, with personal data removed. Run the interview prompt and collect the assistant\'s questions.',
        'Answer what you can yourself. List the questions you cannot answer and who could answer each.',
        'Start an assumptions log with at least five rows: the assumption, what changes if it is wrong, how to check it and who will check.',
        'Update the brief, run the gaps-and-contradictions prompt, and check every quoted line against your draft. Note which findings were wrong.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use the TindaTrack Cloud brief from this lesson. Write five questions you would ask a store owner before design, and one assumption you would write in the log.'] },
      { audience: { min: 'advanced' }, steps: ['Rank your assumptions log by uncertainty times cost of being wrong, pick the cheapest check for the top item, and run it this week. Record what you learned, and which requirements changed because of it.'] },
    ],
  },
];
