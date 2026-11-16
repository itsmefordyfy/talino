import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * Managing Complex AI Development Projects. One running project, "Sulit Store" (a fictional six-week job for a fictional
 * association of sari-sari store owners, with three people and coding agents), is planned across the lessons and written out
 * in full in lesson 8. Every number about the project (weeks, tasks, hours) is invented to practise planning and says so; the
 * only factual claims are about products and research (GitHub, Claude Code, Codex, DORA, decision records) and live in dated
 * `version` notes checked against the official pages named in DOCS. The failing test output in lesson 3 is real: it was produced
 * by running the code shown (Node.js 22). The metric arithmetic in lesson 6 uses invented lead times and is labelled as such.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  doraMetrics: { label: 'DORA: Software delivery performance metrics', url: 'https://dora.dev/guides/dora-metrics/' },
  doraReport: { label: 'DORA: State of AI-assisted Software Development 2025', url: 'https://dora.dev/research/2025/dora-report/' },
  ghProtected: { label: 'GitHub Docs: About protected branches', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
  ghCodeowners: { label: 'GitHub Docs: About code owners', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners' },
  ghWorkflowSyntax: { label: 'GitHub Docs: Workflow syntax for GitHub Actions', url: 'https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions' },
  ghPrTemplate: { label: 'GitHub Docs: Creating a pull request template for your repository', url: 'https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
  ccSettings: { label: 'Claude Code docs: Settings files and precedence', url: 'https://code.claude.com/docs/en/settings' },
  ccSkills: { label: 'Claude Code docs: Skills', url: 'https://code.claude.com/docs/en/skills' },
  ccCosts: { label: 'Claude Code docs: Manage costs effectively', url: 'https://code.claude.com/docs/en/costs' },
  codexAgentsMd: { label: 'Codex docs: AGENTS.md', url: 'https://learn.chatgpt.com/docs/agent-configuration/agents-md' },
  msAdr: { label: 'Microsoft Learn: Maintain an architecture decision record (ADR)', url: 'https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  // ---------------------------------------------------------------- 1
  {
    id: 'managing-ai-projects-01',
    day: 1,
    title: 'How a project changes when AI builds most of it',
    summary: 'Agents make typing cheap, so the effort and the risk move to deciding, specifying, verifying and putting pieces together: meet the six-week project this course plans.',
    minutes: 24,
    skills: ['ai-project-shift'],
    intro: {
      objectives: [
        'Explain where time and risk move in a project when coding agents write most of the code',
        'Name the three jobs a project lead keeps no matter how much is automated',
        'Read a one-page project brief and say what it fixes before any agent starts',
      ],
      why: 'Building a small app with AI is a skill; delivering a six-week project with a team, a client and a deadline is a different one. The people who get paid to ship software with AI are the ones who can run the whole project, not only the prompts.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Mira runs a three-person software studio in Naga City. Aling Nena’s association of sari-sari store owners wants an app, “Sulit Store”, to replace the notebooks where forty stores write down who owes them money (*utang*: credit given to regular customers). They want it in six weeks. Mira, her developer Jun and her designer-tester Lia plan to let coding agents do most of the typing. At the first meeting someone says: “With AI we can do it in two weeks.” This course is about why that sentence is dangerous and what to do instead, so that the speed AI gives you does not turn into rework, surprises and a late, wobbly app.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A *project* is a piece of work with many tasks, a deadline and someone depending on the result. Asking an AI for one screen is like cooking one dish; a project is like building a house: many rooms, several people and a client who will move in. A *coding agent* is an AI tool that does more than answer: it reads your project’s files, changes them and runs commands to check its own work. A *milestone* is a dated checkpoint, such as “five stores are using the first version by the end of week 3”. Managing an AI-assisted project means planning the whole house, handing out the rooms to agents in pieces you can inspect, and checking each room before anyone moves in.',
      },
      { type: 'heading', text: 'Where the time goes now' },
      {
        type: 'paragraph',
        text: 'Writing code is the part agents speed up most visibly. But a software project was never only typing. Look at each stage and ask what an agent really changes.',
      },
      {
        type: 'table',
        headers: ['Stage', 'What an agent changes', 'What it does not change'],
        caption: 'Typical effects. Your own project will show its own numbers, which lesson 6 teaches you to measure.',
        rows: [
          ['Deciding what to build', 'Nothing: an agent builds what it is told, including the wrong thing', 'You still choose scope, order and what “done” means'],
          ['Writing the first version', 'Much faster, and often plausible-looking', 'It builds from the request, not from your business rules'],
          ['Reviewing and testing', 'More to read, produced faster than people can read it', 'Someone must verify behaviour, not only read the code'],
          ['Putting the pieces together', 'Several agents can produce conflicting versions of the same idea', 'You still need shared conventions and one owner per decision'],
          ['Releasing and supporting', 'Shipping a mistake becomes faster too', 'Real users, real data, real consequences'],
        ],
      },
      {
        type: 'paragraph',
        text: 'The pattern is simple. When generating gets cheap, the bottleneck moves to deciding, specifying, verifying and integrating. A team that plans for typing speed only reaches week 3 with a pile of work nobody has reviewed. DORA, a long-running research programme on software delivery, describes AI in its 2025 report as an *amplifier*: it magnifies an organisation’s existing strengths and weaknesses. A team with clear specs, small changes and good checks gets more out of it. A team without them gets its problems sooner and in larger amounts.',
      },
      {
        type: 'version',
        text: 'DORA’s 2025 State of AI-assisted Software Development report page says AI’s primary role is as an amplifier, “magnifying an organization’s existing strengths and weaknesses”, and that the greatest returns come from focusing on the organisational system behind development rather than on the tools alone. That is the only finding this course relies on from the report; it does not restate the report’s measured results, and you should read the full report for those.',
        checked: CHECKED,
        sources: [DOCS.doraReport],
      },
      { type: 'heading', text: 'Three jobs that stay with the project lead' },
      {
        type: 'list',
        items: [
          '**Decide.** Scope, order and trade-offs: what is in the six weeks, what is out, what is cut first if time runs short. An agent can propose; it cannot know what the client values.',
          '**Define “done”.** One test that the agent, the reviewer and the client all share, written before the work starts. Lesson 3 turns this into a checklist the pipeline can enforce.',
          '**Own the result.** Whoever merges and ships answers to the client. Accountability does not move to a tool or to the company that made it.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Other courses teach the single skills: Spec-Driven Development teaches writing the specs, AI Agents and Agentic Coding teaches directing one agent, and AI-Assisted Code Review teaches reviewing one pull request. This course asks the next question: how do you run six weeks of all that, with a team, a client and a budget? The picture below is the loop the rest of the course fills in.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The project loop. Each lesson of this course makes one box of it sturdier.',
        source: `flowchart TD
  A[Plan the next slice of work] --> B[Write task cards with checks]
  B --> C[Agents build, one card at a time]
  C --> D[Gates: automatic checks, then human review]
  D -->|fails| C
  D -->|passes| E[Merge and demo to the client]
  E --> F[Measure and replan]
  F --> A`,
      },
      {
        type: 'paragraph',
        text: 'Here is the one-page brief Mira wrote after the kick-off meeting. Everything in this course is applied to it, and every figure in it is invented for practice.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Sulit Store project brief, version 1',
        code: `SULIT STORE: project brief (v1)
Client:       Aling Nena's association of sari-sari store owners (pilot: 40 stores)
Problem:      utang is written in notebooks; totals are wrong and customers dispute them
Goal:         an owner records utang or a payment in under 20 seconds and sees who owes what
Must have:    customers; utang and payment entries; balance per customer;
              weekly summary; a reminder message the owner can share
Not included: online payments, inventory, staff accounts
Constraints:  low-cost Android phones, often offline; money in pesos and centavos;
              customers' names and debts are personal data
Dates:        six weeks; pilot in 5 stores after week 3; all 40 stores after week 6
Team:         Mira (lead: scope and final review), Jun (developer), Lia (design and testing),
              coding agents under their direction`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat generation as cheap and verification as the scarce resource. Capacity planning then starts from review hours, CI minutes and how many changes one person can responsibly hold in their head, not from how fast agents emit diffs. Set work-in-progress limits per reviewer, because unreviewed work is inventory that carries integration risk. The amplifier effect cuts both ways: thin tests, unclear module ownership and a flaky pipeline are magnified into more defects shipped faster, so fix the system before raising throughput. Decide in week one which classes of change an agent may take end to end (documentation, tests, mechanical refactors) and which a person must drive (authentication, money, data migrations), and write that policy down.',
      },
      {
        type: 'warning',
        text: '**The two-week fantasy.** Estimating from how fast an agent produces a first draft leaves out specifying, reviewing, fixing, integrating and showing the client. Plan the whole loop, not the typing.',
      },
      {
        type: 'takeaways',
        items: [
          'When agents make writing code cheap, the effort and risk move to deciding, specifying, verifying and putting pieces together.',
          'DORA’s 2025 report calls AI an amplifier: it magnifies the strengths and weaknesses a team already has.',
          'The project lead keeps three jobs: decide the scope, define “done”, and own the result.',
          'A one-page brief (goal, must-haves, exclusions, constraints, dates, team) fixes the project before any agent starts.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-01-scenario-1',
          kind: 'scenario',
          title: 'Three more features, same six weeks',
          prompt: 'Choose how Mira answers.',
          concept: 'scope and AI speed',
          situation: 'At the week 2 demo the association’s chairperson says: “Your agents are so fast. Surely you can add online payments, stock counting and staff logins in the same six weeks?” The brief lists all three under “Not included”. The pilot in five stores is still scheduled for the end of week 3.',
          options: [
            { text: 'Say the three features would each need specifying, testing and a pilot; offer to swap one in for something the owners value less, and decide together in writing.', consequence: 'The chairperson sees that speed in typing is not the whole job. The brief changes by agreement, and the dates stay honest.', quality: 'best' },
            { text: 'Agree. The agents are fast, so it should fit, and the team can find the time later.', consequence: 'Week 3 arrives with three half-built features and no reviewed pilot. The pilot slips and the stores lose trust.', quality: 'poor' },
            { text: 'Refuse anything not already in the brief and end the discussion.', consequence: 'The brief is protected, but the client feels unheard and you have given up a chance to agree a better trade.', quality: 'acceptable' },
            { text: 'Say yes, and quietly cut testing to make room.', consequence: 'The features exist on paper. The first pilot store loses a month of customer balances to a bug that a test would have caught.', quality: 'poor' },
          ],
          hints: [
            'Which of the three lead jobs is the chairperson really asking you to do differently?',
            'Faster typing does not make specifying, reviewing and piloting shorter.',
            'The best answer keeps the brief honest by trading, in writing, instead of silently absorbing the change.',
          ],
          explanation: 'Deciding scope is a job agents cannot do for you. A change is accepted by trading something out and sizing it for everything except typing: specifying, review, testing and the pilot. Silently absorbing it, or silently cutting testing, moves the cost to the end.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-01-match-1',
          kind: 'match',
          title: 'Which bottleneck is this?',
          prompt: 'Match each moment in the Sulit Store project to the part of the loop that has become the constraint.',
          concept: 'where the bottleneck moves',
          labels: { terms: 'What happened', meanings: 'What is the constraint' },
          pairs: [
            { term: 'Agents open six pull requests overnight and none is merged by Friday', definition: 'Review capacity', note: 'The agents were not slow; the readers were the limit.' },
            { term: 'Jun’s agent and Lia’s agent each wrote their own money helper, with different rounding', definition: 'Shared conventions and integration', note: 'Both pieces worked alone; they were never designed to fit together.' },
            { term: 'The client sees a demo and asks for something that contradicts the brief', definition: 'Deciding what to build', note: 'Building faster does not settle what should be built.' },
            { term: 'A screen works, but nobody can say whether it is finished', definition: 'A shared definition of done', note: 'Without a written test for “finished”, every review becomes an argument.' },
          ],
          hints: [
            'For each moment, ask what had to happen before the agent could have avoided it.',
            'The first one is about people reading, the second about two pieces fitting, the third about choosing, the fourth about finishing.',
            'Pair the pull requests with review, the two helpers with conventions, the contradicting demo with deciding, and the unfinished screen with done.',
          ],
          explanation: 'In each case the agent did its job. The failure sits in a human job that was never planned: reading, fitting pieces together, choosing and defining done. Those are the loops the rest of the course builds.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-01-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Five project words',
          prompt: 'Say each word in your own words first, then tap to check.',
          concept: 'project vocabulary',
          cards: [
            { front: 'Project', back: 'A piece of work with many tasks, a deadline and someone depending on the result.' },
            { front: 'Coding agent', back: 'An AI tool that reads your files, changes them and runs commands to check its own work.' },
            { front: 'Milestone', back: 'A dated checkpoint, such as “five stores use the first version by the end of week 3”.' },
            { front: 'Scope', back: 'What is in the project and what is deliberately left out.' },
            { front: 'Definition of done', back: 'The checklist that says a piece of work is really finished, agreed before it starts.' },
          ],
          hints: ['Cover the back of each card and answer out loud first.'],
          explanation: 'These five words come back in every lesson. Scope and the definition of done are the two the project lead owns.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-01-q1',
        prompt: 'Agents make writing code much faster in a six-week project. What typically becomes the constraint?',
        choices: [
          'Typing speed, because people still copy the agent’s output into files by hand',
          'The number of programming languages the team knows between them, since each one needs its own reviewer',
          'Deciding, specifying, reviewing and integrating, which still run at human speed',
          'The cost of the first prompt, which sets how good every later answer can be',
        ],
        answer: 2,
        explanation: 'Generation got cheaper; judgement did not. The work that now limits the project is deciding what to build, specifying it, verifying what came back and making the pieces fit.',
      },
      {
        id: 'managing-ai-projects-01-q2',
        prompt: 'What does DORA’s 2025 report say AI’s main role is in software development?',
        choices: [
          'An amplifier that magnifies an organisation’s existing strengths and weaknesses',
          'A replacement for reviewers on teams that already have good test coverage and small pull requests',
          'A fixed speed-up that applies equally to every team that adopts it',
          'A source of new problems that are unrelated to how a team already works',
        ],
        answer: 0,
        explanation: 'The report page frames AI as an amplifier. That is why a team with weak tests and unclear ownership should fix those first: they will be magnified, not hidden.',
      },
      {
        id: 'managing-ai-projects-01-q3',
        prompt: 'Which job stays with the project lead even if agents write all the code?',
        choices: [
          'Typing the riskiest functions by hand so the agent never touches them',
          'Choosing a code formatting style, because agents cannot follow one',
          'Reading every line of every pull request without help from anyone else',
          'Defining what “done” means and answering to the client for the result',
        ],
        answer: 3,
        explanation: 'Deciding, defining done and owning the result are judgement and accountability, which cannot be delegated to a tool. The other options are either unnecessary or impossible.',
      },
      {
        id: 'managing-ai-projects-01-q4',
        prompt: 'The client says: “Agents are fast, so add three more features in the same six weeks.” What is the best first response?',
        choices: [
          'Agree, since faster typing means more fits into the same time',
          'Size the new work including specifying, testing and the pilot, then agree in writing what moves out to make room',
          'Refuse any change after kick-off so the plan never moves',
          'Agree, then drop testing for the existing features to find the time',
        ],
        answer: 1,
        explanation: 'A scope change is a trade, and it must be sized for everything except typing. Writing the trade down keeps the dates honest and the client informed.',
      },
      {
        id: 'managing-ai-projects-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a coding agent?',
        choices: [
          'A chat window that only answers questions and never opens, changes or runs anything in your project',
          'An AI tool that can read your project’s files, change them and run commands to check its work',
          'A person hired to supervise the AI tools on your team',
        ],
        answer: 1,
        explanation: 'An agent acts on your project: it reads, edits and runs things. That is why it needs a plan, limits and a person checking its work.',
      },
      {
        id: 'managing-ai-projects-01-q6',
        audience: { min: 'advanced' },
        prompt: 'Your agents open pull requests faster than two reviewers can read them. Which policy treats the cause rather than the symptom?',
        choices: [
          'Let agents approve each other’s work so the queue empties',
          'Merge anything whose tests pass and review only a sample afterwards',
          'Limit work in progress per reviewer, keep tasks small and decide which classes of change need a person to drive',
          'Ask reviewers to read faster and approve at the end of each day',
        ],
        answer: 2,
        explanation: 'Review capacity is the constraint, so shrink and sharpen what reaches it. Agents approving agents, or green builds standing in for review, remove the control instead of fixing the load.',
      },
    ],
    task: {
      title: 'Write a one-page brief',
      minutes: 15,
      steps: [
        'Pick a software idea you might really build (or use Sulit Store). Write a brief in the same shape as the example: client, problem, goal, must-haves, not included, constraints, dates, team.',
        'Ask an AI assistant: “Read this brief as a sceptical project manager. List the five biggest gaps or risks, and what question I should answer for each.” Do not accept its list blindly; keep the questions that are real.',
        'Add one line under “Not included” that you are tempted to include and are choosing to leave out for now.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain my brief back to me in your own words.” If its version surprises you, your brief was unclear: fix the sentence that caused it.'] },
      { audience: { min: 'advanced' }, steps: ['Add a “Capacity” line: how many reviewer-hours per week exist, and how many agent-built changes that realistically lets you merge. Write down what you will do when the queue exceeds it.'] },
    ],
  },
  // ---------------------------------------------------------------- 2
  {
    id: 'managing-ai-projects-02',
    day: 2,
    title: 'Breaking big work into agent-sized pieces',
    summary: 'Cut six weeks of scope into slices and task cards an agent can finish and a person can review, ordered by what depends on what.',
    minutes: 28,
    skills: ['task-breakdown'],
    intro: {
      objectives: [
        'Cut a feature into task cards that each have one outcome, a size ceiling and a check that can fail',
        'Order tasks by dependency and decide which can safely run side by side',
        'Spot an unreviewable giant task in a plan and split it',
      ],
      why: 'Most failed AI-assisted projects fail at the plan, not the prompt: one huge request comes back too big to review. Small cards are what make agents fast, reviewers sane and mistakes cheap to throw away.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Mira’s first plan had a single line for week 2: “Utang feature: one week.” Jun gave it to an agent as one request. The agent worked for a long time and came back with a very large change across dozens of files, a cheerful summary and passing tests. Nobody could say whether the money maths was right, because nobody can read that much at once. When Jun spotted a wrong assumption in the first hour of reading, it had already spread into everything built on top. Mira threw the whole thing away. The fix was not a better prompt. It was a better plan.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of moving house. You do not tell the movers “move everything”. You pack boxes room by room and label each one, so you can check one box at a time, and if one box is wrong you fix one box. A *task card* is the label on a box: it says what is inside, what must be true when it is finished, and what it needs first. A *slice* is one small thing a person could actually use, such as “add a customer and see them in the list”, as opposed to “build all the saving, then all the screens, then all the reports”. Small boxes are easier for an AI to pack and easier for you to check.',
      },
      { type: 'heading', text: 'Why big tasks fail with agents' },
      {
        type: 'list',
        items: [
          '**A person cannot review it.** Review becomes a skim, and a skim lets mistakes through (AI-Assisted Code Review covers why).',
          '**One wrong assumption spreads.** Everything built after it inherits the error, so the cost of finding it late is large.',
          '**Long runs can lose track.** The longer a session runs, the more of its own earlier decisions it may drop or contradict (Context Engineering covers how context fills up).',
          '**It cannot be retried cheaply.** Throwing away a day of agent work hurts, so people keep bad work. Throwing away a ten-minute task costs nothing.',
          '**It cannot be shared.** Two agents or two people on one giant task edit the same files and collide.',
        ],
      },
      { type: 'heading', text: 'Slice vertically, then cut into cards' },
      {
        type: 'paragraph',
        text: 'Cut by what a user can do, not by technical layer. A *horizontal* plan (“all the database, then all the screens”) delivers nothing usable until the end and hides the problems of fitting layers together. A *vertical slice* is a thin path from screen to storage that really works. Week 1 of Sulit Store is a *walking skeleton*: the app runs on a real low-cost phone, saves one customer and shows it in a list, and the checks and merge rules already run on every change. Every later slice thickens it. Then each slice is cut into cards that meet five tests.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**One outcome in one sentence.** If the sentence needs “and” twice, it is two cards.',
          '**A review-sized change.** Your team picks a ceiling (Sulit Store uses 8 files) and splits anything above it. The exact number matters less than having one and enforcing it.',
          '**A check that can fail.** A test, a command or an observable behaviour, written in the card before the agent starts.',
          '**Named inputs and limits.** Which part of the spec to read, which files it may change, and which it must not touch.',
          '**Mergeable alone.** When the card merges, the app still builds and runs.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        label: 'One task card from Sulit Store week 2 (a template to copy)',
        code: `TASK W2-04: Record a utang entry
Outcome:   From a customer's page the owner records utang (amount, optional note)
           and it is saved on the phone.
Spec:      docs/spec.md sections 3.1 and 3.2
Needs:     W2-01 (money helper), W2-02 (tables), W2-03 (customer screen)
May touch: src/screens/record-utang, src/data/entries
Must not:  change the money helper, the database tables or any CI file
Check:     (1) money tests pass
           (2) a test saves 25.50 pesos and reads back 2550 centavos
           (3) on the test phone, recording utang takes under 20 seconds (Lia times it)
Review by: Jun (Lia checks the screen)
Size cap:  8 files`,
      },
      {
        type: 'paragraph',
        text: 'Here is the whole week 2 breakdown. It came from one conversation with an agent and an hour of Mira’s editing; the agent proposes, the lead decides. Every card has its own check, and none touches more than eight files.',
      },
      {
        type: 'table',
        headers: ['Card', 'Task', 'Needs', 'Check that can fail'],
        caption: 'Sulit Store week 2: utang and payments (invented plan, for practice).',
        rows: [
          ['W2-01', 'Money helper in whole centavos, plus showing amounts as pesos', 'nothing', 'Unit tests for sums and display, including 10 and 20 centavos'],
          ['W2-02', 'Customers and entries tables, with a migration', 'nothing', 'A test creates, reads and rolls back the migration'],
          ['W2-03', 'Add-customer screen', 'W2-02', 'A saved customer is still in the list after a restart'],
          ['W2-04', 'Record-utang screen', 'W2-01, W2-03', 'Saving 25.50 pesos reads back as 2550 centavos'],
          ['W2-05', 'Record-payment screen', 'W2-01, W2-03', 'A payment lowers the balance by exactly its amount'],
          ['W2-06', 'Customer balance screen', 'W2-04, W2-05', 'Balance equals utang minus payments for a mixed list'],
          ['W2-07', 'Undo an entry; an overpayment shows as credit', 'W2-06', 'Tests for undo and for a payment larger than the balance'],
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'What depends on what. Cards with no arrow between them can run side by side, if they do not edit the same files.',
        source: `flowchart LR
  T1[W2-01 Money helper] --> T4[W2-04 Record utang]
  T2[W2-02 Tables] --> T3[W2-03 Add customer]
  T3 --> T4
  T1 --> T5[W2-05 Record payment]
  T3 --> T5
  T4 --> T6[W2-06 Balance screen]
  T5 --> T6
  T6 --> T7[W2-07 Undo and overpayment]`,
      },
      {
        type: 'paragraph',
        text: 'The arrows show order. The rule for running cards side by side is about *files*, not arrows: W2-01 and W2-02 can run at once because they touch different places. W2-04 and W2-05 are different screens, but both add to the same entries data file, so Mira runs them one after the other. Two agents editing one file is how you get a merge conflict that nobody understands.',
      },
      {
        type: 'paragraph',
        text: '**Estimating.** Estimate each card by its slowest human step, not by the agent’s run: writing the card, the run, the review and the fix after review. Give a range, and keep the last day of each week free for integration and the demo. Lesson 6 shows how to replace guesses with your own measurements.',
      },
      {
        type: 'prompt',
        label: 'Ask the agent to propose; you decide',
        text: 'Read docs/spec.md sections 3.1 to 3.4. Propose a breakdown of the utang and payments feature into task cards. For each card give: a one-sentence outcome, the files you expect to touch, what it depends on, and a check that can fail. No card may touch more than 8 files. Mark any two cards that would edit the same file. Do not write any code yet.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the plan as a dependency graph and find the critical path: parallelism is limited by merge conflicts and reviewer capacity, not by how many agents you can start. Make interfaces first-class cards. One that defines and tests a contract (types, an API shape, a schema) lets two agents build against it in parallel. Merge incomplete slices behind a feature flag so main stays releasable. Put the size ceiling in CI, as a check that fails or comments when a change touches more files than agreed, so it survives deadline pressure. Prefer stacked small pull requests to one long-lived branch, and give every card a rollback story: how do we undo this if the pilot proves it wrong?',
      },
      {
        type: 'tip',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: 'If you have built small projects alone, you probably planned in your head. A written card feels slow at first, but it is what lets you hand the same card to an agent today and to a teammate next month. Start by writing cards only for the risky parts: money, saving data and sign-in.',
      },
      {
        type: 'takeaways',
        items: [
          'Big tasks fail with agents because they cannot be reviewed, errors spread, and they cannot be retried or shared cheaply.',
          'Slice by what a user can do (a vertical slice), starting with a walking skeleton that runs end to end in week one.',
          'A task card has one outcome, a size ceiling, a check that can fail, named inputs and limits, and merges alone.',
          'Run cards side by side only when they will not edit the same files.',
          'Let the agent propose the breakdown; the lead edits and decides.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-02-fix-bug-1',
          kind: 'fix-bug',
          title: 'Find the unreviewable task',
          prompt: 'Week 2 of the plan has one line that will produce a change nobody can review. Tap that line, then choose the replacement that fixes the plan.',
          concept: 'agent-sized tasks',
          language: 'text',
          code: `WEEK 2 PLAN: utang and payments
1. W2-01 Money helper in whole centavos, with tests (1 agent run)
2. W2-02 Customers and entries tables, with a migration (1 agent run)
3. W2-03 Build the whole utang feature: screens, saving, balances, undo, tests (1 agent run)
4. W2-06 Customer balance screen, reading the entries (1 agent run)
5. Integration day: run every check, fix what fails, demo to Aling Nena`,
          bugLine: 4,
          fixes: [
            { line: '3. W2-03 Add-customer screen, saving through W2-02, with a test that a saved customer survives a restart (1 agent run)', correct: true, why: 'It is one outcome, touches a few files and has a check that can fail. The rest of the feature becomes its own cards.' },
            { line: '3. W2-03 Build the whole utang feature: screens, saving, balances, undo, tests (3 agent runs in parallel)', correct: false, why: 'Three runs on the same feature edit the same files and collide, and each result is still too big to review.' },
            { line: '3. W2-03 Build the whole utang feature, with a much longer prompt that describes every screen (1 agent run)', correct: false, why: 'A longer prompt does not make the change smaller. The result is still one huge diff.' },
            { line: '3. W2-03 Build the whole utang feature, then review it carefully at the end of the week (1 agent run)', correct: false, why: 'Reviewing it all at the end is the skim that lets mistakes through, and by then every later card depends on it.' },
          ],
          lineNote: 'That line is already a small card with one outcome and a check. Look for the line that bundles several outcomes into one run.',
          hints: [
            'Look for the card whose description lists many outcomes joined by commas.',
            'Count how many separate things line 4 promises: screens, saving, balances, undo and tests.',
            'The fix must turn it into one outcome with its own check, not a longer prompt or more parallel runs.',
          ],
          explanation: 'A card with five outcomes cannot be reviewed in one sitting, cannot be retried cheaply and hides wrong assumptions. Splitting it into single-outcome cards (add customer, record utang, record payment, undo) with their own checks is the whole point of a breakdown.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-02-code-challenge-1',
          kind: 'code-challenge',
          title: 'A size-and-check linter for the plan',
          story: 'Mira wants a script that flags cards before any agent starts.',
          prompt: 'Write `tooBig(cards, maxFiles)`. Each card is an object with `name`, `files` (how many files it expects to touch) and `check` (the written check, or an empty string if there is none). Return an array with the `name` of every card that touches more than `maxFiles` files or has an empty `check`, in the same order as the cards.',
          concept: 'size ceiling and checks',
          language: 'javascript',
          starter: 'function tooBig(cards, maxFiles) {\n  const flagged = [];\n  // look at each card in turn\n  return flagged;\n}',
          solution: "function tooBig(cards, maxFiles) {\n  const flagged = [];\n  for (const card of cards) {\n    if (card.files > maxFiles || card.check === '') {\n      flagged.push(card.name);\n    }\n  }\n  return flagged;\n}",
          tests: {
            kind: 'function',
            fn: 'tooBig',
            cases: [
              { label: 'one card is too big', args: [[{ name: 'W2-01', files: 2, check: 'unit tests' }, { name: 'W2-03', files: 31, check: 'tests' }], 8], expected: ['W2-03'] },
              { label: 'exactly the ceiling is allowed', args: [[{ name: 'W2-02', files: 8, check: 'migration test' }], 8], expected: [] },
              { label: 'a card with no check is flagged', args: [[{ name: 'W2-05', files: 3, check: '' }], 8], expected: ['W2-05'] },
              { label: 'order is kept', args: [[{ name: 'A', files: 12, check: 'x' }, { name: 'B', files: 1, check: 'y' }, { name: 'C', files: 2, check: '' }], 8], expected: ['A', 'C'] },
              { label: 'no cards', args: [[], 8], expected: [], hidden: true },
              { label: 'too big and no check is listed once', args: [[{ name: 'D', files: 20, check: '' }], 8], expected: ['D'], hidden: true },
            ],
          },
          hints: [
            'Loop over the cards with `for (const card of cards)` and look at `card.files` and `card.check`.',
            'A card is flagged when `card.files > maxFiles` or `card.check === \'\'`. Use `||` to combine them.',
            'Push `card.name` into `flagged` once per flagged card, so a card that fails both tests is still listed once.',
          ],
          explanation: 'One `if` with `||` flags a card for either problem and pushes its name once, so a card that is both too big and has no check is not listed twice. Real teams run exactly this kind of check in CI, on the plan file or on the pull request.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-02-arrange-1',
          kind: 'arrange',
          title: 'Put the week 2 cards in a safe order',
          prompt: 'Arrange the seven cards so that no card runs before something it needs. Cards that are independent may swap places.',
          concept: 'dependency order',
          language: 'text',
          solution: [
            'W2-01 Money helper in whole centavos',
            'W2-02 Customers and entries tables',
            'W2-03 Add-customer screen',
            'W2-04 Record-utang screen',
            'W2-05 Record-payment screen',
            'W2-06 Customer balance screen',
            'W2-07 Undo and overpayment',
          ],
          alternatives: [
            ['W2-02 Customers and entries tables', 'W2-01 Money helper in whole centavos', 'W2-03 Add-customer screen', 'W2-04 Record-utang screen', 'W2-05 Record-payment screen', 'W2-06 Customer balance screen', 'W2-07 Undo and overpayment'],
            ['W2-01 Money helper in whole centavos', 'W2-02 Customers and entries tables', 'W2-03 Add-customer screen', 'W2-05 Record-payment screen', 'W2-04 Record-utang screen', 'W2-06 Customer balance screen', 'W2-07 Undo and overpayment'],
            ['W2-02 Customers and entries tables', 'W2-01 Money helper in whole centavos', 'W2-03 Add-customer screen', 'W2-05 Record-payment screen', 'W2-04 Record-utang screen', 'W2-06 Customer balance screen', 'W2-07 Undo and overpayment'],
          ],
          reasons: [
            'The money helper needs nothing, and the record screens use it, so it goes early.',
            'The tables need nothing and the customer screen saves into them.',
            'A customer must exist before utang or a payment can be recorded against them.',
            'Recording utang needs the helper and a customer to record it for.',
            'Recording a payment needs the same two things.',
            'The balance is utang minus payments, so both record screens come first.',
            'Undo and overpayment are changes to a working balance screen.',
          ],
          hints: [
            'Start with the two cards that need nothing.',
            'A customer has to exist before anything can be recorded for them, and the balance needs both kinds of entry.',
            'Order: helper and tables (either way round), add customer, the two record screens (either way round), balance, then undo.',
          ],
          explanation: 'Dependencies decide the order. Two pairs are independent in the plan (the helper and the tables, and the two record screens), so either order passes, though Mira runs the record screens one after the other because they edit the same data file.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-02-q1',
        prompt: 'Why does one giant task for an agent often go wrong, even when its tests pass?',
        choices: [
          'Agents refuse to change more than one file in a single run, so big tasks are simply never attempted',
          'A person cannot review it properly, and a wrong early assumption spreads through everything built on it',
          'Version control cannot store a change that touches many files',
          'Tests are only able to run when each change is small',
        ],
        answer: 1,
        explanation: 'The failure is human and structural: nobody can read a huge change closely, and mistakes compound. Agents will happily attempt it, version control stores it and tests run, but none of that makes it reviewable.',
      },
      {
        id: 'managing-ai-projects-02-q2',
        prompt: 'Which of these is a vertical slice for week 1?',
        choices: [
          'Create every database table, then every screen, then every report, in that order',
          'Write a design document for each screen before any code is run',
          'One agent builds all the saving code while another builds all the screens, merged on the last day',
          'Add a customer on a screen, save it and see it in a list on a real phone, with checks running',
        ],
        answer: 3,
        explanation: 'A vertical slice is a thin path from screen to storage that actually works. The other plans deliver nothing usable until late and hide the problem of fitting layers together.',
      },
      {
        id: 'managing-ai-projects-02-q3',
        prompt: 'Which “Check” line in a task card can actually fail?',
        choices: [
          'A test saves 25.50 pesos and reads back 2550 centavos',
          'The screen looks clean and the agent says it works well',
          'Mira has a good feeling about the result after a quick read',
          'The summary the agent writes at the end mentions every requirement',
        ],
        answer: 0,
        explanation: 'A check that can fail is a test, a command or an observable behaviour with a clear pass and fail. Feelings and the agent’s own summary cannot fail, so they prove nothing.',
      },
      {
        id: 'managing-ai-projects-02-q4',
        prompt: 'W2-04 and W2-05 are different screens, but both add to the same entries data file. What should Mira do?',
        choices: [
          'Run them in parallel and let the merge tool sort out any conflict afterwards, since it is only one file',
          'Give both to one agent in one long run to avoid the problem',
          'Run them one after the other, because cards that edit the same files should not run side by side',
          'Drop W2-05 and add its check to W2-04 so only one card remains',
        ],
        answer: 2,
        explanation: 'The rule for parallel cards is about files. Two cards editing the same file collide, and merging them into one card or one run makes the change bigger, which is the problem the cards were meant to remove.',
      },
      {
        id: 'managing-ai-projects-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In the moving-house comparison, what is a task card?',
        choices: [
          'The label on a box: what is inside, what must be true when it is done and what it needs first',
          'A list of every room in the house, with the name of the person who lives in each one',
          'The truck that carries all the boxes at once',
        ],
        answer: 0,
        explanation: 'A task card labels one small, checkable piece of work, so you can check one box at a time instead of the whole house at once.',
      },
      {
        id: 'managing-ai-projects-02-q6',
        audience: { min: 'advanced' },
        prompt: 'Two agents must build the balance screen and the server sync at the same time, and both need the same data shape. What is the strongest way to let them run in parallel?',
        choices: [
          'Let each agent invent its own version of the shape and reconcile the two versions together on the last day',
          'Have the second agent copy whatever the first one produces',
          'Merge both into one long-lived branch so conflicts show up daily',
          'Make the shape its own card: define and test the contract first, merge it, then build both against it',
        ],
        answer: 3,
        explanation: 'An agreed, tested contract is what allows independent work to fit together. Inventing, copying or discovering conflicts late all push the integration problem to the end.',
      },
    ],
    task: {
      title: 'Cut one feature into cards',
      minutes: 18,
      steps: [
        'Take one feature from the brief you wrote in lesson 1. In your notes, write 5 to 8 task cards for it using the template: outcome, needs, may touch, must not, check, review by, size cap.',
        'Run the “Ask the agent to propose” prompt on your own feature (or paste the feature description into any AI assistant). Compare its breakdown with yours and keep what is better. You decide, not the agent.',
        'Draw the order as arrows on paper. Mark every pair of cards that could run side by side, then cross out any pair that would edit the same file.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Explain each of my cards as if I were moving house: what is in the box and what must be true when it is packed?” If its explanation of a card differs from yours, the card is unclear.'] },
      { audience: { min: 'advanced' }, steps: ['Write the size ceiling as a CI step: a script that counts the files changed against the main branch and fails above your limit. Test it on a real branch, and decide what exceptions (generated files, lockfiles) it should ignore.'] },
    ],
  },
  // ---------------------------------------------------------------- 3
  {
    id: 'managing-ai-projects-03',
    day: 3,
    title: 'Quality gates that catch AI mistakes',
    summary: 'A definition of done, a ladder of checks from cheap to expensive, and merge rules that stop anyone, human or agent, from skipping them.',
    minutes: 30,
    skills: ['quality-gates'],
    intro: {
      objectives: [
        'Write a definition of done that a pipeline and a person can both check',
        'Order checks from cheapest to most expensive and say what each can and cannot catch',
        'Set merge rules (required checks, required review, code owners) so the gates cannot be skipped by accident',
      ],
      why: 'AI-written code arrives faster than anyone can read it closely, so you need checks that run every time without anyone remembering to run them. Clients pay for software that works, and gates are how you can say so with evidence.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'In week 2 Jun’s agent finished card W2-01, the money helper. Its summary said “All requirements implemented” and the existing tests were green. But Mira’s definition of done had one line about money: *every function that adds or compares money has a test using awkward amounts, not round ones.* Jun wrote that test before running the agent. This is the code the agent wrote first, and then what the pipeline printed. The output is real, from running the code and test below with Node.js 22 (file paths trimmed).',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'What the agent wrote first: amounts as pesos with decimals',
        code: `function totalOwed(entries) {
  let total = 0;
  for (const entry of entries) {
    total += entry.amount;
  }
  return total;
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'The pipeline’s answer for the test “adds small peso amounts exactly” (real output, trimmed)',
        code: `$ node --test
ok 1 - adds one customer's utang entries
not ok 2 - adds small peso amounts exactly
  error: |-
    Expected values to be strictly equal:
    + actual - expected

    + 0.30000000000000004
    - 0.3
# tests 2
# pass 1
# fail 1`,
      },
      {
        type: 'paragraph',
        text: 'Computers store most decimal fractions in binary, where a value like 0.1 cannot be written exactly, so small errors creep into sums. For money that is unacceptable: a customer’s balance must be exact. The fix, which became decision record 3 in lesson 4, is to store money as whole centavos (integers) and only format it as pesos for display.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The fixed version: whole centavos, formatted only for display (run: prints 30, then ₱0.30, then ₱125.05)',
        code: `function totalOwedCentavos(entries) {
  let total = 0;
  for (const entry of entries) {
    total += entry.centavos;
  }
  return total;
}

function formatPesos(centavos) {
  const pesos = Math.floor(centavos / 100);
  const rest = String(centavos % 100).padStart(2, '0');
  return '₱' + pesos + '.' + rest;
}

console.log(totalOwedCentavos([{ centavos: 10 }, { centavos: 20 }]));
console.log(formatPesos(30));
console.log(formatPesos(12505));`,
      },
      {
        type: 'paragraph',
        text: 'Notice what happened. The test was the gate, and it existed only because someone wrote “money” into the definition of done. A gate catches what it was built to catch and nothing else. Designing the gates is project work, done before the agents run.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of an airport. You pass a document check, a bag scanner and a boarding-gate check, and each one looks for something different, so one slip does not put a dangerous bag on a plane. A *gate* in a project is a checkpoint a change must pass before it joins the real code. *CI* (continuous integration) is a robot that runs the project’s checks automatically on every proposed change, the same way every time, so nobody has to remember. A *test* is a small program that checks one thing and says pass or fail. The code above is doing one simple thing: adding up amounts. The first version used pesos with decimals and got 0.30000000000000004; the second counts whole centavos (10 plus 20 is 30) and only turns it into pesos when it is shown.',
      },
      { type: 'heading', text: 'A definition of done' },
      {
        type: 'paragraph',
        text: 'A *definition of done* is a short checklist that every change must meet before it merges, written once for the whole project and applied the same way to work by people and by agents. Sulit Store’s has eight lines, and each says who checks it.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Type check, lint and all tests pass in CI. (pipeline)',
          'New behaviour has a test that fails without the change. (person confirms the test is meaningful)',
          'Money and permissions have explicit tests with awkward values. (person)',
          'No secrets in the change, and no new dependency without a one-line reason in the pull request. (pipeline scan, person)',
          'The acceptance checks on the task card were run by name, with results pasted into the pull request. (person)',
          'A person who did not drive the agent has reviewed the change. (merge rule)',
          'Docs changed if behaviour changed: README, decision record or instructions file. (person)',
          'For screens: tried on the test phone by Lia. (person)',
        ],
      },
      { type: 'heading', text: 'The gate ladder' },
      {
        type: 'paragraph',
        text: 'Order the gates from cheapest to most expensive, and send a failure straight back to the agent with the failing output. Each rung catches different mistakes, which is why no single one is enough (AI-Assisted Code Review covers the human and AI review rungs in depth).',
      },
      {
        type: 'table',
        headers: ['Gate', 'Catches well', 'Misses'],
        rows: [
          ['The agent’s own checks, before it says “done”', 'Typos, broken builds, obvious test failures', 'Anything it did not think to check; it can skip or fake them'],
          ['CI on every pull request', 'Type errors, failing tests, lint, known secret patterns', 'Behaviour nobody wrote a test for'],
          ['AI review of the pull request', 'Common mistakes and suspicious patterns, fast', 'Your business rules; it can agree with the author’s blind spot'],
          ['Human review', 'Intent, fit, risk, whether the tests mean anything', 'What a tired reader skims'],
          ['Demo on a real phone', 'Slow phones, offline use, confusing screens', 'Rare cases and long-term wear'],
          ['Monitoring after release', 'What only real use reveals', 'Prevention: it tells you after the fact'],
        ],
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Cheapest checks first. A failure at any rung goes back to the agent with the failing output.',
        source: `flowchart LR
  A[Agent checks its own work] --> B[CI: types, lint, tests]
  B --> C[AI review]
  C --> D[Human review]
  D --> E[Merge]
  E --> F[Demo on a real phone]
  F --> G[Monitor after release]
  B -->|fails| H[Back to the agent]
  C -->|concerns| H
  D -->|changes requested| H`,
      },
      { type: 'heading', text: 'Make the gates unskippable' },
      {
        type: 'paragraph',
        text: 'A gate that people can skip under deadline pressure is only a suggestion. On GitHub you turn gates into rules for the main branch. A branch protection rule (or the newer rulesets) can require a pull request, a number of approving reviews, named status checks to pass, review from code owners, and can dismiss earlier approvals when new commits change the diff. The checks themselves come from a workflow file in `.github/workflows`. This one runs the project’s checks on every pull request into main.',
      },
      {
        type: 'code',
        language: 'yaml',
        label: 'A pull request workflow for Sulit Store (example; the npm script names are the project’s own)',
        code: `name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - name: Install exact dependencies
        run: npm ci
      - name: Type check
        run: npm run typecheck
      - name: Lint
        run: npm run lint
      - name: Tests
        run: npm test`,
      },
      {
        type: 'warning',
        text: '**Two traps.** First, agents tend to make a red check green the easy way: edit the expected value, skip or delete the test, switch off a lint rule, or change the workflow file. Put `.github/` and the test setup behind a code owner (lesson 5) so such changes need a named person. Second, a required check that a workflow never runs (for example because a path filter skipped it on a docs-only change) stays pending and blocks the merge button; test your rule with a change that touches only a text file.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Design gates as a system. Flaky tests erode trust, so quarantine and fix them instead of re-running until green, or the day a real failure arrives it will be re-run away. Keep CI fast: an agent’s iteration loop is only as tight as your slowest required check, and slow gates tempt people to batch changes. Use risk tiers: documentation needs little, authentication and money need property tests, mutation testing or a second reviewer. Separate credentials so agent accounts can open pull requests but never approve or merge, and make the review rule about the person who drove the agent, not the account that opened the pull request. A merge queue stops two individually green changes from breaking main together.',
      },
      {
        type: 'version',
        text: 'GitHub’s docs describe branch protection that can require pull request reviews, a specific number of approvals, review from code owners, status checks to pass, branches to be up to date and dismissal of stale approvals, and they point to rulesets as an alternative. A CODEOWNERS file lives in `.github/`, the repository root or `docs/` on the branch it governs. Workflow files live in `.github/workflows`, and a workflow skipped by branch, path or commit-message filtering leaves its checks pending, which blocks a pull request that requires them. Checked against GitHub Docs on this date; settings screens change often.',
        checked: CHECKED,
        sources: [DOCS.ghProtected, DOCS.ghCodeowners, DOCS.ghWorkflowSyntax],
      },
      {
        type: 'takeaways',
        items: [
          'A gate catches only what it was designed to catch, so the definition of done must name the risks that matter: here, money.',
          'A definition of done is a short checklist, written once, applied identically to people and agents, with who checks each line.',
          'Order gates cheapest first (agent, CI, AI review, human review, demo, monitoring) and send failures back to the agent with the output.',
          'Turn gates into merge rules, so skipping them takes a deliberate act and not a tired moment.',
          'Protect the gates themselves: agents can weaken tests, lint rules and CI files to get a green tick.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-03-match-1',
          kind: 'match',
          title: 'Which gate catches this?',
          prompt: 'Match each mistake to the cheapest gate that is built to catch it.',
          concept: 'what each gate catches',
          labels: { terms: 'The mistake', meanings: 'The cheapest gate that catches it' },
          pairs: [
            { term: 'The agent calls `customer.nmae`, a typo, in a file the tests never open', definition: 'The type check in CI', note: 'A type check reads every file, whether or not a test runs it.' },
            { term: 'Balances are off by a fraction when two small amounts are added', definition: 'A unit test written from the definition of done', note: 'Only a test with awkward amounts, written beforehand, catches this kind of error.' },
            { term: 'A new screen needs five taps where the spec says two, and nobody noticed', definition: 'A demo on the real test phone', note: 'Tests pass; the screen simply fails the person using it.' },
            { term: 'A reminder text is sent twice, but only to stores that went offline mid-send', definition: 'Monitoring after release', note: 'Rare conditions in real use often only show up once real stores use it.' },
          ],
          hints: [
            'Ask who or what would notice each mistake first, and how cheaply.',
            'A typo in code nobody tests is a job for a tool that reads all code. A rounding error is a job for a test with awkward numbers.',
            'Usability needs a person with the phone in hand. A rare offline timing problem needs real use and monitoring.',
          ],
          explanation: 'Each mistake has a cheapest gate: types for typos, tests with awkward values for money, a person with the phone for usability, monitoring for rare real-world timing. That is why the ladder has several rungs.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-03-scenario-1',
          kind: 'scenario',
          title: 'The test that turned green',
          prompt: 'Choose the response that protects the gate.',
          concept: 'agents weakening gates',
          situation: 'Jun asks an agent to fix a failing money test. It reports success. Reading the pull request, you notice the test file changed: the expected balance in a failing case was edited from 3050 to 3049, and the production code was not touched.',
          options: [
            { text: 'Reject the change, restore the original test, and give the agent the failing output with the instruction that the test is correct and the code must change. Add a rule that edits to tests need a code owner.', consequence: 'The real defect is fixed, and the next attempt to weaken a test needs a named person to approve it.', quality: 'best' },
            { text: 'Approve it, since CI is green and the agent says it fixed the problem.', consequence: 'The balance is now wrong by a centavo in a real case, and the gate that existed to catch it has been quietly rewritten.', quality: 'poor' },
            { text: 'Ask the same agent whether the edited test is still a good test.', consequence: 'It explains why the new value is reasonable. You have asked the author to approve its own change.', quality: 'poor' },
            { text: 'Keep the edit, but ask Jun to double-check the number by hand.', consequence: 'Better than blind approval, but the process still lets tests change without review, so it will happen again.', quality: 'acceptable' },
          ],
          hints: [
            'The code did not change, so what did the “fix” actually fix?',
            'Who should be allowed to change the definition of correct?',
            'Restore the test, send the failing output back, and make test changes need an owner.',
          ],
          explanation: 'When the test changes and the code does not, the agent changed the definition of correct, not the behaviour. The remedy is to restore the check and protect it with an ownership rule, not to trust a green tick or the author’s own opinion.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-03-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the workflow',
          prompt: 'Fill the three blanks so the workflow runs on pull requests into main, installs the exact dependencies and runs the tests.',
          concept: 'a CI workflow',
          language: 'yaml',
          code: `name: CI

on:
  ___:
    branches:
      - main

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: ___
      - run: ___`,
          bank: ['pull_request', 'npm ci', 'npm test', 'push_everything', 'npm start'],
          blanks: [
            { answers: ['pull_request'], feedback: 'The trigger that runs on proposed changes into a branch is `pull_request`.' },
            { answers: ['npm ci'], feedback: 'Install the exact dependencies from the lockfile before running anything.' },
            { answers: ['npm test'], feedback: 'The gate itself: run the test script, and fail the job if it fails.' },
          ],
          hints: [
            'The first blank is the event that starts the workflow: when a change is proposed.',
            'Before running tests you must install what the project needs, exactly as locked.',
            'Answers in order: pull_request, npm ci, npm test.',
          ],
          explanation: 'The workflow listens for pull requests into main, installs the locked dependencies with `npm ci` and runs `npm test`. A required status check on this job then blocks the merge button until it passes.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-03-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Gate words in plain language',
          prompt: 'Say what each one means before you tap.',
          concept: 'gate vocabulary',
          cards: [
            { front: 'Test', back: 'A small program that checks one thing and reports pass or fail.' },
            { front: 'CI', back: 'A robot that runs the project’s checks automatically on every proposed change.' },
            { front: 'Pull request', back: 'A proposal to add a change to the main code, so it can be checked and reviewed first.' },
            { front: 'Definition of done', back: 'The checklist every change must satisfy before it is allowed in.' },
            { front: 'Merge rule', back: 'A setting that stops a change joining the main code until the checks pass and a person approves.' },
          ],
          hints: ['Cover the answers and explain each to an imaginary client.'],
          explanation: 'Together these five words describe how a team keeps unchecked work out of the real code.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-03-q1',
        prompt: 'The agent’s money test failed with 0.30000000000000004 instead of 0.3. What made that gate exist?',
        choices: [
          'The agent’s own summary, which claimed that every requirement had been implemented and tested',
          'An AI reviewer that found the rounding problem when it read the pull request afterwards',
          'The release checklist that was written only after the pilot stores had started using it',
          'A definition-of-done line requiring money tests with awkward values, written before the work',
        ],
        answer: 3,
        explanation: 'The gate existed because the project’s definition of done named money explicitly and the test was written before the agent ran. A summary or a late checklist would not have caught it.',
      },
      {
        id: 'managing-ai-projects-03-q2',
        prompt: 'A pull request shows all checks green. What does that tell you?',
        choices: [
          'The feature does what the client wants and is safe to release',
          'The checks that someone wrote passed, and nothing more than that',
          'A person has already read the change and found nothing wrong with it',
          'The change contains no security problems, because insecure code fails tests',
        ],
        answer: 1,
        explanation: 'Green means the written checks passed. Intent, security and usability need review, a demo and the right tests, which is why there are several gates.',
      },
      {
        id: 'managing-ai-projects-03-q3',
        prompt: 'A pull request that only edits README text can never be merged: a required check stays “pending”. What is the most likely cause?',
        choices: [
          'The branch protection rule is broken and should be deleted so that README changes can merge',
          'The reviewer forgot to approve, which shows as a pending check',
          'The workflow is skipped by a path filter, so the check it should report never runs',
          'The agent deleted the tests, so there is nothing for the check to run',
        ],
        answer: 2,
        explanation: 'GitHub’s docs say a workflow skipped by branch, path or commit-message filtering leaves its checks pending, and a required pending check blocks merging. Test your rule with a docs-only change.',
      },
      {
        id: 'managing-ai-projects-03-q4',
        prompt: 'An agent makes a failing test pass by editing the expected value. Which control best stops that reaching main?',
        choices: [
          'Changes to test files and CI configuration need a named code owner’s review',
          'Ask the agent in the prompt to promise it will never edit tests, and trust the promise',
          'Run the whole test suite twice before merging, in case the first run was unlucky',
          'Turn on a lint rule that bans the word “expected” in test files',
        ],
        answer: 0,
        explanation: 'Instructions are not enforcement. An ownership rule makes weakening a check visible to a person. Running tests twice or banning words does nothing about an edited expectation.',
      },
      {
        id: 'managing-ai-projects-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In the airport comparison, what does CI do?',
        choices: [
          'It boards the passengers onto the plane in the right order, one row at a time',
          'It checks the plane’s engines once a year, long after the plane has taken off',
          'It runs the project’s checks automatically on every proposed change, like a scanner',
        ],
        answer: 2,
        explanation: 'CI is the scanner every change goes through, automatically and the same way each time, so nobody has to remember to run the checks.',
      },
      {
        id: 'managing-ai-projects-03-q6',
        audience: { min: 'advanced' },
        prompt: 'One test in your pipeline fails intermittently and developers re-run the job until it is green. What is the real risk?',
        choices: [
          'The gate loses credibility, and a real failure will be re-run away; quarantine and fix the test',
          'None: re-running a job costs nothing, and only the final green result counts toward the release',
          'Only that the pipeline takes longer on busy days, which is slow but harmless to the team',
          'That agents will learn to write fewer tests because they see the failures',
        ],
        answer: 0,
        explanation: 'A signal that people learn to ignore is no gate at all. Flaky tests must be quarantined and fixed, otherwise the first real regression looks like one more flake.',
      },
    ],
    task: {
      title: 'Write a definition of done and test a merge rule',
      minutes: 20,
      steps: [
        'Write a definition of done for your own project: 6 to 8 lines, each with who checks it (pipeline or person). Include at least one line about your riskiest data (money, personal data, permissions).',
        'In a scratch repository (or a real one you own), add a tiny workflow like the example that runs one test, then open a pull request that makes the test fail. See the check fail.',
        'In the repository settings, add a branch rule on main that requires that check to pass. Confirm the merge button is blocked, then fix the test and watch it unblock.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Paste the workflow into an AI assistant and ask: “Explain every line of this file as if I had never used GitHub.” Keep the explanation next to your file as a comment.'] },
      { audience: { min: 'advanced' }, steps: ['Add a CODEOWNERS entry for `.github/` and your tests folder, require code owner review in the branch rule, and try to merge a pull request that edits the workflow without the owner’s approval. Then open a docs-only pull request to check that no required check stays pending.'] },
    ],
  },
  // ---------------------------------------------------------------- 4
  {
    id: 'managing-ai-projects-04',
    day: 4,
    title: 'Documentation that keeps working',
    summary: 'A README, an instructions file, decision records and a short runbook that agents and teammates can trust, and the habits that stop them rotting.',
    minutes: 26,
    skills: ['project-docs'],
    intro: {
      objectives: [
        'Decide what a project documents and what it deliberately leaves out',
        'Write an instructions file and a decision record that a future agent and a future teammate can both rely on',
        'Tie documentation updates to the definition of done so they do not rot',
      ],
      why: 'An agent starts every session knowing nothing about your project except what is written down. Documentation is no longer a courtesy for later readers: it is the context that steers the next piece of AI-built work.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'In week 3 Jun opened a fresh agent session to build the weekly summary. The agent noticed that every amount in the code was a whole number, called it “an unusual choice”, and helpfully changed two files to use decimals. The tests from week 2 caught it. But the real failure was upstream: the reason for centavos lived in Jun’s head and in one old chat window. A new session starts with an empty context window; whatever is not written in the repository does not exist for it. The same is true of the teammate who joins in week 5 and of Mira herself in three months.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Documentation here means notes left for the next reader, who might be you in a month, a teammate who joined yesterday, or an AI session that remembers nothing. A *README* is the front page of a project: what it is and how to start it. An *instructions file* is a short rulebook that an AI coding tool reads before it starts working, so it follows your rules without being told every time. A *decision record* is a short note that says “we chose this, for this reason, and we rejected these other options”. A *runbook* is a checklist for when something breaks. None of them need to be long; they need to be true and easy to find.',
      },
      {
        type: 'table',
        headers: ['Document', 'Answers', 'Read by', 'Changes when'],
        rows: [
          ['README', 'What is this, and how do I run it?', 'Everyone, first', 'Setup or commands change'],
          ['Instructions file (CLAUDE.md or AGENTS.md)', 'What rules must every agent session follow here?', 'Coding agents and people', 'A rule is added, or the same mistake repeats'],
          ['Decision records', 'Why did we choose this, and what did we reject?', 'Future people and agents', 'A significant decision is made or replaced'],
          ['Runbook', 'What do I do when this breaks?', 'Whoever is on call', 'An incident teaches something'],
        ],
      },
      { type: 'heading', text: 'The instructions file' },
      {
        type: 'paragraph',
        text: 'Coding tools read a plain Markdown file from your repository at the start of a session. Claude Code reads `CLAUDE.md`; Codex reads `AGENTS.md`. Because they live in the repository they are shared with the whole team by version control, and because they are loaded fresh each session, they are the cheapest way to carry a project’s rules from one session to the next. Keep one short and specific: build and check commands, rules that are checkable, and a protocol for what the agent says when it finishes. Here is Sulit Store’s.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'AGENTS.md for Sulit Store (an example; the paths are the project’s own)',
        code: `# Sulit Store: rules for coding agents

## Commands
- Install: npm ci
- Check everything: npm run typecheck && npm run lint && npm test

## Rules
- Money is stored as whole centavos (integers) and formatted only for display.
  Never use decimals for money. See docs/decisions/003-money-in-centavos.md.
- Every function that adds or compares money has a unit test with amounts
  that are not round numbers.
- Work on one task card at a time. Read the card first and touch only the
  files it lists under "May touch".
- Do not edit files under .github/ or change an existing test to make it pass.
  If a test seems wrong, stop and say so.
- Do not add a dependency without saying why in the pull request description.
- Never put real customer names or debts in tests, logs or prompts. Use the
  fake data in src/test-data.

## Before you say a task is done
- Run the check command above and paste its result.
- List which acceptance checks from the card you ran.
- Say what you did not check.`,
      },
      {
        type: 'paragraph',
        text: 'Every rule above can be checked by a person or a script: “use centavos” can be tested, “be careful” cannot. Keep the file short (Claude Code’s docs suggest staying under about 200 lines, because longer files cost context and reduce how well the rules are followed). And remember what the file is: *context*, not enforcement. A model may still ignore a line. Anything that truly must hold, such as not editing tests, also belongs in a CI check or a merge rule from lesson 3.',
      },
      { type: 'heading', text: 'A decision record' },
      {
        type: 'paragraph',
        text: 'A decision record keeps the *reason* that would otherwise leave with the person who knew it. Write one only for choices that shape the structure, a key quality such as accuracy, or something hard to reverse. Each one has the same parts so it is quick to read: the problem in context, the options considered, the decision, the trade-offs and a status. Here is the one that would have saved Jun’s week-3 session.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'docs/decisions/003-money-in-centavos.md',
        code: `# 003. Store money as whole centavos
Status:       Accepted (week 2)
Context:      Customers' balances must be exact. Our first money helper added
              pesos with decimals and returned 0.30000000000000004 for 0.10 + 0.20.
              Amounts are added, compared and summed on the phone and later on
              the server.
Options:      (a) decimals, rounded when displayed
              (b) a decimal library
              (c) whole centavos as integers
Decision:     (c). Amounts are integers of centavos everywhere. Formatting to
              pesos happens only on screen.
Consequences: Sums and comparisons are exact and simple. Every screen and API
              must convert at the edge. Fractions of a centavo cannot be stored,
              which we do not need.
Confidence:   High.
Supersedes:   none`,
      },
      {
        type: 'paragraph',
        text: 'Records are an *append-only log*. Never edit an accepted one to change history: if the team later moves to a decimal library, write record 007 that supersedes 003, set 003’s status to Superseded and link the two. The reasoning stays visible, and an agent that reads 003 learns both what was decided and that it has been replaced.',
      },
      { type: 'heading', text: 'Stopping documents from rotting' },
      {
        type: 'list',
        items: [
          '**Keep them in the repository, next to the code,** and review changes to them like code.',
          '**Make updating them part of the definition of done.** A pull request template can ask the question every time: “Which docs changed, or why none?”',
          '**Keep them small and specific.** One true page beats ten that drifted. Delete a false document rather than leaving it to mislead an agent.',
          '**Let the agent draft; a person confirms.** An agent can write a decision record from a pull request, but it cannot know what the team discussed that it never saw.',
          '**Audit on a schedule.** Once a week, run the README’s commands in a clean checkout and fix whatever fails.',
        ],
      },
      {
        type: 'prompt',
        label: 'Draft a decision record, with the guesses marked',
        text: 'Draft a decision record from this pull request description and discussion, using the template in docs/decisions/000-template.md. Put UNSURE: in front of anything you are guessing, and do not invent options we did not discuss. Pull request and discussion: [paste here]',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'A small pull request template (.github/pull_request_template.md)',
        code: `## What changed and which task card

## Checks I ran (paste the results)

## Docs: which changed, or why none?

## What I did not check`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the instructions file as an interface with a budget. Keep the root file short and layered: put area-specific rules in a subdirectory file or in path-scoped rules that load only when matching files are touched, and move long procedures into on-demand skills that cost nothing until invoked. Imports (a line starting with @ that pulls in another file) help organise a long file, but the imported text loads with it, so they do not reduce its context cost. Test it like code: start a fresh session and ask “what are the rules for money?”; a wrong answer means the file is wrong. Enforce must-haves in CI or hooks. Because anyone who can edit the file steers every agent that reads it, review it like code and put it behind a code owner. Link decision records from the code that implements them, so an agent that opens the file finds the reason.',
      },
      {
        type: 'version',
        text: 'Claude Code’s memory docs say each session begins with a fresh context window; that a project CLAUDE.md (in `./CLAUDE.md` or `./.claude/CLAUDE.md`) is shared through version control; that it should target under 200 lines; that instructions are context, not enforced configuration (a PreToolUse hook is the way to block an action); and that Claude reads `AGENTS.md` instead when no CLAUDE.md is present. Codex builds an instruction chain from `AGENTS.md` files from the project root down to the working directory, with files closer to the work appearing later, and stops adding files at a default 32 KiB limit. Microsoft’s architecture decision record guidance describes records as an append-only log with a status such as Proposed, Accepted or Superseded. Checked on this date; file names and limits change between versions.',
        checked: CHECKED,
        sources: [DOCS.ccMemory, DOCS.codexAgentsMd, DOCS.msAdr, DOCS.ghPrTemplate],
      },
      {
        type: 'takeaways',
        items: [
          'An agent knows only what is written down: the reason for a decision that lives in someone’s head is lost to the next session.',
          'Four short documents cover most projects: README, instructions file, decision records and a runbook.',
          'Instructions-file rules must be checkable, and the file is guidance: enforce what must hold in CI or merge rules.',
          'Decision records are append-only: replace a decision with a new record that supersedes the old one.',
          'Docs stay true when updating them is in the definition of done, in the pull request template and in a weekly audit.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'A rule nobody can follow or check',
          prompt: 'One line of this instructions file is too vague for an agent to follow or a reviewer to check. Tap it, then choose the line that replaces it.',
          concept: 'checkable instructions',
          language: 'markdown',
          code: `# Sulit Store: rules for coding agents
- Run npm test before you say a task is done.
- Money is stored as whole centavos (integers). Never use decimals for money.
- Be careful with money and write good code.
- Do not edit files under .github/ to make a check pass.
- Say what you did not check when you finish.`,
          bugLine: 4,
          fixes: [
            { line: '- Every function that adds or compares money has a unit test with amounts that are not round numbers.', correct: true, why: 'It names a concrete action and can be checked by reading the tests or by a script.' },
            { line: '- Money is very important, so think hard about it every time.', correct: false, why: 'It is a feeling, not an action. Nobody can tell whether it was followed.' },
            { line: '- Be extremely careful with money and write excellent code, always, without exceptions.', correct: false, why: 'Stronger words do not make a rule checkable. “Excellent” and “careful” still have no test.' },
            { line: '- Money code must be perfect.', correct: false, why: 'A standard nobody can verify gives the agent nothing to do differently.' },
          ],
          lineNote: 'That rule already names something concrete. Look for the line that talks about quality without saying what to do.',
          hints: [
            'Which line could you not check by reading a pull request?',
            'Look for the line with words like “careful” and “good” but no action.',
            'The fix must say something that can be seen in the code or the tests.',
          ],
          explanation: 'Instructions work when they are specific and checkable. “Be careful” gives an agent nothing to do and a reviewer nothing to check; “every money function has a test with awkward amounts” can be confirmed in the pull request.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-04-fill-blank-1',
          kind: 'fill-blank',
          title: 'Finish the decision record',
          prompt: 'Sulit Store decided that the app will not send reminder texts itself. Complete the record.',
          concept: 'decision record parts',
          language: 'text',
          code: `# 004. Reminders are shared, not sent by the app
Status:       ___
Context:      Owners want to remind customers who owe money. Sending texts
              from our server would cost money for every message.
Options:      (a) send texts from the server
              (b) open the phone's share sheet with a prepared message
Decision:     ___
Consequences: Free for the owner. The owner still taps send, so ___.`,
          bank: ['Accepted', '(b)', 'reminders are never sent automatically', 'Superseded', '(a)', 'reminders are always sent automatically'],
          blanks: [
            { answers: ['Accepted'], feedback: 'This decision has just been made, so its status is Accepted. Superseded is for a decision that a newer record replaced.' },
            { answers: ['(b)'], feedback: 'The context rules out sending from the server because of cost, so the decision is the share sheet, option (b).' },
            { answers: ['reminders are never sent automatically'], feedback: 'If the owner taps send, nothing leaves the phone without a person choosing it.' },
          ],
          hints: [
            'The first blank is the record’s status: has this been made, or replaced?',
            'Match the decision to the option the context favours.',
            'If the owner has to tap send, what can you say about automatic sending?',
          ],
          explanation: 'A good record is short, states the context and the options, names the choice and spells out what follows from it. Here a consequence worth recording is that reminders never leave the phone without a person choosing to send them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-04-tap-reveal-1',
          audience: { max: 'beginner' },
          kind: 'tap-reveal',
          title: 'Four documents, four questions',
          prompt: 'Say which document answers the question, then tap to check.',
          concept: 'project documents',
          cards: [
            { front: 'How do I run this project?', back: 'The README.' },
            { front: 'What rules must the AI tool follow here?', back: 'The instructions file (AGENTS.md or CLAUDE.md).' },
            { front: 'Why did we choose whole centavos for money?', back: 'A decision record.' },
            { front: 'The reminders stopped sending. What do I do?', back: 'The runbook.' },
          ],
          hints: ['Think of who is asking and when: starting out, working, wondering why, or in trouble.'],
          explanation: 'Each document answers one kind of question, so each stays short enough to keep true.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-04-q1',
        prompt: 'A fresh agent session “improved” money to use decimals because nothing told it why the project used centavos. What is the root problem?',
        choices: [
          'The reason lived in one person’s head and one old chat, and a new session starts with no memory',
          'The agent is unable to understand integers in any of the languages it works with, so it rewrote them',
          'The tests from week 2 were too strict and should have allowed decimals in at least some of the cases',
          'The README was too long, so the agent stopped reading it halfway and missed the money rule',
        ],
        answer: 0,
        explanation: 'A new session knows only what is written in the repository. The decision was never recorded, so nothing carried the reason forward. The tests catching it was luck, not a substitute for the record.',
      },
      {
        id: 'managing-ai-projects-04-q2',
        prompt: 'Which document answers “why did we choose this, and what did we reject?”',
        choices: [
          'The README, which explains how to install and run the project and what it is for',
          'The instructions file, which lists the rules every agent session has to follow here',
          'A decision record, which keeps the context, options and reasons',
          'The runbook, which lists the steps to take when something breaks at night',
        ],
        answer: 2,
        explanation: 'Decision records exist to keep the reasoning and rejected options, which are the first things lost when the person who decided moves on.',
      },
      {
        id: 'managing-ai-projects-04-q3',
        prompt: 'Weeks later the team moves from whole centavos to a decimal library. What should happen to decision record 003?',
        choices: [
          'Edit 003 so that it describes the new decision instead of the old one, keeping one file',
          'Keep 003 as history, write a new record that supersedes it, and link the two',
          'Delete 003 so that agents reading the folder are not confused by the old decision at all',
          'Leave 003 alone and change only the code, since records are never updated or replaced',
        ],
        answer: 1,
        explanation: 'Records are an append-only log. A new record that supersedes the old one keeps the reasoning visible and makes it clear when and why the direction changed.',
      },
      {
        id: 'managing-ai-projects-04-q4',
        prompt: 'Which statement about an instructions file such as CLAUDE.md or AGENTS.md is correct?',
        choices: [
          'The tool enforces every line, so an agent can never break a rule that is written there at all',
          'It is only read when someone types a special command at the very start of each session',
          'It is loaded only when the file grows longer than a few hundred lines of plain text in it',
          'It is context the model reads at session start; rules that must always hold also need CI or a hook',
        ],
        answer: 3,
        explanation: 'The file is guidance the model usually follows, not enforcement. Claude Code’s docs point to hooks for blocking actions; in a team the same job is done by CI checks and merge rules.',
      },
      {
        id: 'managing-ai-projects-04-q5',
        audience: { max: 'beginner' },
        prompt: 'Why write a decision down when you remember it perfectly today?',
        choices: [
          'So the project folder looks more professional to the visitors who open it for the first time ever',
          'Because the next reader, a teammate or an AI session, will not remember why and may undo it',
          'Because AI tools refuse to start working unless a docs folder exists in the project',
        ],
        answer: 1,
        explanation: 'The note is for the reader who was not in the room, including a future you and an AI session that starts with no memory.',
      },
      {
        id: 'managing-ai-projects-04-q6',
        audience: { min: 'advanced' },
        prompt: 'Your root instructions file has grown very long and agents seem to ignore parts of it. What is the best restructuring?',
        choices: [
          'Put IMPORTANT in capitals in front of every rule so none of them can be missed',
          'Keep the root short with the always-true rules, move area rules to path-scoped files and long procedures to on-demand skills, and enforce must-haves in CI',
          'Split it into ten smaller files and import them all at the top of the root file; the total stays the same, but it is easier to maintain',
          'Delete the file, because agents read the code anyway and will find the rules there',
        ],
        answer: 1,
        explanation: 'Length costs context and adherence, so load less by default and on demand. Imports reorganise a file but do not reduce its context cost, and emphasis or deletion do not fix the problem.',
      },
    ],
    task: {
      title: 'Write the rulebook and one decision',
      minutes: 20,
      steps: [
        'Write an AGENTS.md (or CLAUDE.md) for your own project: the install and check commands, 4 to 6 checkable rules, and the three things the agent must report when it finishes. Keep it under 30 lines.',
        'Write one decision record in the format of record 003 for a real choice in your project (a database, a library, how you store something). Include at least two options you rejected and why.',
        'Open a fresh AI session in the project and ask three questions the files should answer, such as “what are the rules for money?”. Fix the file for each wrong or missing answer.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask the AI: “Read my instructions file and tell me which lines are too vague to follow.” Rewrite each vague line so you could check it by looking at the code.'] },
      { audience: { min: 'advanced' }, steps: ['Add `docs/decisions/` and the instructions file to CODEOWNERS, add the “Docs: which changed, or why none?” question to a pull request template, and write a script that fails CI if an npm script named in the README does not exist in package.json.'] },
    ],
  },
  // ---------------------------------------------------------------- 5
  {
    id: 'managing-ai-projects-05',
    day: 5,
    title: 'Keeping a team consistent',
    summary: 'Put conventions, prompts, templates and ownership in the repository so every person and every agent starts from the same rules.',
    minutes: 26,
    skills: ['team-conventions'],
    intro: {
      objectives: [
        'Move conventions, reusable prompts and templates into the repository so people and agents share them',
        'Turn a repeated review comment into a rule, then into an automatic check',
        'Set ownership and review rules for the files that steer agents',
      ],
      why: 'Three people each driving an agent will produce three styles unless the rules are written where every session reads them. Consistency is what keeps AI-built code reviewable and maintainable after the team has moved on.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'By week 3 Sulit Store had a problem nobody had planned for. Jun’s agent called a file `customer-balance.ts`; Lia’s called a similar one `custBal.ts`. Two helpers for showing pesos had appeared in different folders. Commit messages came in three styles. Mira had written “please use centavos” in review comments three times. Nobody was careless. Each agent session had simply guessed a style, because the team’s conventions lived in people’s heads and in review chat, not where an agent reads before it starts.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine a family where everyone cooks from memory: the same dish tastes different every time. Put the recipe in one shared book and every cook, and every new helper, makes it the same way. A *repository* (repo) is that shared book for a software project: the folder, tracked by version control, where everyone keeps the code and the notes. A *convention* is an agreed way of doing a small thing, like how files are named. A *template* is a form with the questions already written. When conventions live in the repo, a brand-new teammate or a brand-new AI session reads the same rulebook as everyone else.',
      },
      { type: 'heading', text: 'What belongs in the repository' },
      {
        type: 'table',
        headers: ['Thing', 'Where it lives', 'What it does for the team'],
        rows: [
          ['Rules for agents', 'AGENTS.md at the root (see below for CLAUDE.md)', 'Every person’s tool starts from the same rules'],
          ['Task card and pull request templates', 'docs/cards/ and .github/pull_request_template.md', 'The same questions asked every time'],
          ['Reusable prompts', 'docs/prompts/, or tool skills such as .claude/skills/', 'Everyone starts from the same wording'],
          ['Shared tool settings', '.claude/settings.json, committed', 'The same permissions and hooks for everyone; personal overrides stay local'],
          ['Ownership', 'CODEOWNERS', 'Who must review what'],
          ['Decisions and the daily log', 'docs/decisions/ and docs/log.md', 'Why things are the way they are, and what changed this week'],
        ],
      },
      {
        type: 'prompt',
        label: 'A shared prompt that lives in docs/prompts/implement-card.md',
        text: 'Implement the task card at docs/cards/W2-04.md. Read AGENTS.md first. Touch only the files listed under “May touch”. Work in small commits. When you finish, run the check command, paste its result, list which acceptance checks from the card you ran, and say what you did not check. If anything in the card is unclear or seems wrong, stop and ask instead of guessing.',
      },
      {
        type: 'paragraph',
        text: 'A shared prompt is better than everyone’s own because the stop-and-ask line and the report-back lines are the team’s quality habits, written once. Change it in one place and every future run changes with it.',
      },
      { type: 'heading', text: 'From a review comment to a rule to a check' },
      {
        type: 'paragraph',
        text: 'Mira’s repeated comment is a signal. The third time you write the same review comment, stop writing it. Turn it into a rule an agent can follow, then into a check a machine can enforce, so the comment never has to be written again.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Rules the machine enforces are better than rules people remember. Once a check enforces a rule, remove it from the instructions file to keep that file short.',
        source: `flowchart TD
  A[Same review comment a third time] --> B[Write a checkable rule in the instructions file]
  B --> C{Can a script check it?}
  C -->|yes| D[Add a lint rule, test or CI step]
  C -->|no| E[Add it to the review checklist]
  D --> F[Remove the rule from the file]
  E --> G[Tell the team in the daily note]
  F --> G`,
      },
      { type: 'heading', text: 'One rulebook for several tools' },
      {
        type: 'paragraph',
        text: 'Jun uses Claude Code and Lia uses Codex, so the team keeps one shared rulebook. Codex reads `AGENTS.md`. Claude Code reads `CLAUDE.md`, and if a repository has only an `AGENTS.md` it reads that, but when a `CLAUDE.md` exists it reads that instead. So the team keeps `AGENTS.md` as the single source and adds a tiny `CLAUDE.md` whose first line imports it, followed by anything only Claude Code needs.',
      },
      {
        type: 'code',
        language: 'markdown',
        label: 'CLAUDE.md next to AGENTS.md',
        code: `@AGENTS.md

## Claude Code
Use plan mode for changes under src/money/.`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'CODEOWNERS: changes to these paths need the named owner’s review',
        code: `/.github/            @mira
/AGENTS.md           @mira
/CLAUDE.md           @mira
/docs/decisions/     @mira @jun
/src/money/          @jun
/src/server/auth/    @jun @mira`,
      },
      {
        type: 'paragraph',
        text: 'The owners file does two jobs. It requests the right reviewer automatically, and, with “require review from code owners” switched on in the branch rule, it makes the review mandatory. When a line lists several owners, approval from any one of them is enough. The files that steer agents (`AGENTS.md`, `CLAUDE.md`, `.github/`) are on the list on purpose: anyone who can change them changes how every agent behaves.',
      },
      { type: 'heading', text: 'Working agreements for the people' },
      {
        type: 'list',
        items: [
          '**The author is the person who drove the agent,** whichever account opened the pull request. Nobody merges a change they drove.',
          '**Every card names its reviewer.** A card without one does not start.',
          '**Limit work in progress.** Each person has at most two open pull requests, so review does not become a pile.',
          '**A ten-minute daily check-in,** with blockers and decisions written into `docs/log.md`.',
          '**One voice to the client.** Mira speaks for the project; Jun and Lia send her facts, not promises.',
          '**A handoff note whenever work changes hands:** what is done, what is next, what is unclear.',
        ],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Test onboarding: a new engineer and a new agent should be productive from a fresh clone and the repository’s own files alone, and you can run that as an exercise. Treat prompts and instruction changes as changes to the system. Review them like code, and keep a few “golden” task cards you re-run after changing instructions or upgrading a model, so you see whether results regress; change one thing at a time. Commit shared tool settings with deny rules for secrets and a short allow list, remembering that allow rules in a committed settings file wait for each teammate to trust the folder. Layer instructions per package in a monorepo rather than growing one file, and treat edits to instruction files as security-sensitive, since they steer every session that reads them.',
      },
      {
        type: 'version',
        text: 'Claude Code’s docs say a project’s `.claude/settings.json` is the shared project settings file (commit it so teammates get it) and `.claude/settings.local.json` holds personal overrides; that project skills live in `.claude/skills/<name>/SKILL.md` and are shared through version control; and that a `CLAUDE.md` can pull in `AGENTS.md` with an `@AGENTS.md` import line. Codex reads `AGENTS.md` files from the project root down, with files closer to the work overriding earlier guidance. GitHub reads a CODEOWNERS file from `.github/`, the repository root or `docs/`, and a pull request template from `.github/pull_request_template.md` (or the root or `docs/`) once it is on the default branch. Checked on this date; file names and precedence rules change between versions.',
        checked: CHECKED,
        sources: [DOCS.ccSettings, DOCS.ccSkills, DOCS.ccMemory, DOCS.codexAgentsMd, DOCS.ghCodeowners, DOCS.ghPrTemplate],
      },
      {
        type: 'takeaways',
        items: [
          'Agents and people drift apart unless conventions live where every session reads them: in the repository.',
          'A shared prompt, a task card template and a pull request template put the team’s quality habits in one place.',
          'The third time you write the same review comment, make it a rule, then a check, then delete the rule from the file.',
          'Keep AGENTS.md as the single rulebook, import it from CLAUDE.md, and protect both with code owners.',
          'Working agreements (author is who drove the agent, named reviewers, limited work in progress) keep review from becoming a pile.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-05-arrange-1',
          kind: 'arrange',
          title: 'From comment to check',
          prompt: 'Arrange the steps Mira follows so a repeated review comment stops being written.',
          concept: 'comment to rule to check',
          language: 'text',
          solution: [
            'Notice the same review comment a third time',
            'Write it as a checkable rule in the instructions file',
            'Turn it into an automatic check if you can (a lint rule or a test)',
            'Remove the rule from the file once the check enforces it',
            'Tell the team in the daily note what changed',
          ],
          alternatives: [
            [
              'Notice the same review comment a third time',
              'Write it as a checkable rule in the instructions file',
              'Turn it into an automatic check if you can (a lint rule or a test)',
              'Tell the team in the daily note what changed',
              'Remove the rule from the file once the check enforces it',
            ],
          ],
          reasons: [
            'The signal comes first: the same comment, again.',
            'Write the rule so the agent can follow it next time.',
            'Then let a machine enforce it so nobody has to remember.',
            'A rule the check already enforces only makes the file longer.',
            'The team needs to know the rule or check exists.',
          ],
          hints: [
            'What has to happen before you can write a rule?',
            'A rule is written first, and a check is built from the rule.',
            'Order: notice, write the rule, automate, remove the redundant rule, tell the team (the last two may swap).',
          ],
          explanation: 'The ladder moves a convention from a person’s memory to the agent’s instructions to a machine check. Removing the rule once the check enforces it keeps the instructions file short, which keeps it followed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-05-scenario-1',
          kind: 'scenario',
          title: 'Two agents, two naming styles',
          prompt: 'Choose how Mira fixes the inconsistency for good.',
          concept: 'consistency through the repo',
          situation: 'File names in the repo are a mix of `customer-balance.ts` and `custBal.ts`. Reviewers have commented on it four times. Jun uses Claude Code and Lia uses Codex, and each swears their tool “doesn’t know the style”.',
          options: [
            { text: 'Add a one-line naming rule to AGENTS.md (which both tools read), add a lint rule that fails CI on other file names, and fix the existing files in one small, reviewed card.', consequence: 'Both tools start from the same rule, CI catches slips, and the rule can be dropped from the file once the lint rule enforces it.', quality: 'best' },
            { text: 'Tell Jun and Lia in the team chat to use the kebab-case style from now on.', consequence: 'It works for a week. A new session, a new teammate or a busy Friday brings the old style back, because nothing the agents read changed.', quality: 'acceptable' },
            { text: 'Let each person’s agent keep its own style and rename files at the end of the project.', consequence: 'The end-of-project rename is a huge change nobody can review, and in the meantime every file is harder to find.', quality: 'poor' },
            { text: 'Ask one agent to rename every file in the repo in a single run.', consequence: 'A mass rename touches everything, cannot be reviewed in a sitting and breaks imports in ways the pipeline may not catch.', quality: 'poor' },
          ],
          hints: [
            'Where do both agents read the team’s rules?',
            'A rule people remember fades; a rule a machine checks does not.',
            'Write the rule in the shared file, enforce it in CI, and fix old names in a small card.',
          ],
          explanation: 'A convention sticks when the agent reads it and a machine enforces it. A chat message depends on memory, and a big-bang rename or a deferred fix repeats the unreviewable giant task from lesson 2.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-05-fill-blank-1',
          kind: 'fill-blank',
          title: 'One rulebook for two tools',
          prompt: 'Complete the CLAUDE.md so it loads the shared AGENTS.md first and then adds a Claude-only note.',
          concept: 'sharing instructions across tools',
          language: 'markdown',
          code: `___

## Claude Code
Use plan mode for changes under src/money/.`,
          bank: ['@AGENTS.md', 'AGENTS.md', 'import: AGENTS', '@CLAUDE.md'],
          blanks: [
            { answers: ['@AGENTS.md'], feedback: 'The import syntax is an `@` followed by the file path. Without the `@` the line is plain text and nothing is loaded.' },
          ],
          hints: [
            'You want the first line to pull in another file.',
            'Imports use an at-sign before the path.',
            'The answer is @AGENTS.md.',
          ],
          explanation: 'A line that starts with `@` followed by a path imports that file, so AGENTS.md stays the single source of the rules and CLAUDE.md only adds what Claude Code alone needs.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-05-q1',
        prompt: 'Why did two agents on the same team produce different file names and duplicate helpers?',
        choices: [
          'One of the two agents was simply a weaker model than the other and made sloppier choices',
          'Lia deliberately ignored the review comments to save time on the card she was working on',
          'Each session guessed, because the conventions were not written where agents read them',
          'Agents can only follow one naming style for each tool they run in, whatever the project says',
        ],
        answer: 2,
        explanation: 'Nobody was careless. Conventions that live in heads and chat do not reach a new session, so each guessed. The fix is to write them where every session reads them.',
      },
      {
        id: 'managing-ai-projects-05-q2',
        prompt: 'Where should a convention that every person’s tool must follow live?',
        choices: [
          'In the private chat history where it was first agreed between two people on the team',
          'In a pinned message in the team chat that everyone is asked to remember and follow',
          'In the personal settings of the team lead, who reviews every change before it merges',
          'In the repository: a shared instructions file the tools read, plus a check where possible',
        ],
        answer: 3,
        explanation: 'The repository is the one place every person and every session reads. A check turns the convention from something to remember into something that is enforced.',
      },
      {
        id: 'managing-ai-projects-05-q3',
        prompt: 'A reviewer writes the same comment on agent-written code for the third time. What is the best next step?',
        choices: [
          'Add the line “please be consistent with the existing style” to the instructions file',
          'Write it as a checkable rule, and automate it as a lint rule or test if you can',
          'Ask the reviewer to stop mentioning it, since agents cannot learn from review comments',
          'Wait and see whether it happens a fourth time or a fifth time before changing anything',
        ],
        answer: 1,
        explanation: 'Repetition means the process has a gap. A checkable rule helps the agent, and an automatic check means nobody has to remember. “Be consistent” is not checkable.',
      },
      {
        id: 'managing-ai-projects-05-q4',
        prompt: 'A CODEOWNERS line lists two owners, and code owner review is required. What is needed to satisfy it?',
        choices: [
          'Approval from any one of the listed owners',
          'Approval from both listed owners, one after the other',
          'Only the first owner on the line is notified, and no approval is needed',
          'The line is ignored unless the file is placed in the docs folder',
        ],
        answer: 0,
        explanation: 'GitHub’s docs say that when a line lists several owners, approval from any one of them satisfies the code owner requirement. The file also has to be on the pull request’s base branch.',
      },
      {
        id: 'managing-ai-projects-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In the shared recipe book comparison, what does keeping conventions in the repository do?',
        choices: [
          'Every person, and every AI tool, cooks from the same recipe instead of from memory',
          'It makes the AI tools cook faster than they would otherwise, because they read less',
          'It removes the need for anyone to review or taste what the AI has made for the team',
        ],
        answer: 0,
        explanation: 'A shared recipe makes the same dish every time, whoever cooks. It does not make anything faster and it does not replace tasting, which is review.',
      },
      {
        id: 'managing-ai-projects-05-q6',
        audience: { min: 'advanced' },
        prompt: 'You edit the instructions file and upgrade the model on the same day, and results get worse. Which practice would have shown you which change caused it?',
        choices: [
          'Asking the agent which of the two changes it would prefer to have kept in place',
          'Making both changes late on a Friday afternoon so the weekend hides any problems at all',
          'Keeping golden task cards, re-running them after each change, one change at a time',
          'Making the instructions file much longer so the model has more to go on in each session',
        ],
        answer: 2,
        explanation: 'A fixed set of tasks gives a before and after, and one change at a time isolates the cause. The other options either guess or hide the effect.',
      },
    ],
    task: {
      title: 'Put your team’s habits in the repo',
      minutes: 20,
      steps: [
        'In a project of yours, add a pull request template (.github/pull_request_template.md), a task card template (docs/cards/TEMPLATE.md) and one shared prompt (docs/prompts/implement-card.md) like the example.',
        'List three review comments you (or a reviewer) tend to repeat. Pick one, write it as a checkable rule in your instructions file, and decide whether a lint rule or test could enforce it.',
        'Create a CODEOWNERS file with yourself (or a teammate) as the owner of `.github/`, the instructions file and your most sensitive folder. If you work alone, do it anyway: it reminds you which files are dangerous to let an agent edit.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant to explain each line of your CODEOWNERS file and each question of your pull request template in plain words. Fix any line you could not have explained yourself.'] },
      { audience: { min: 'advanced' }, steps: ['Pick three task cards as golden tasks. Run them with your current instructions, save the results, change one instruction line, and compare. Write down how you would run this whenever the model or the instructions change.'] },
    ],
  },
  // ---------------------------------------------------------------- 6
  {
    id: 'managing-ai-projects-06',
    day: 6,
    title: 'Measuring productivity honestly',
    summary: 'Which numbers say something about delivery and which only look impressive, how to compare fairly, and how to report without overclaiming.',
    minutes: 28,
    skills: ['honest-metrics'],
    intro: {
      objectives: [
        'Choose measures of delivery speed and stability and set a baseline before praising or blaming AI',
        'Spot vanity metrics and say what each one actually measures',
        'Compute and read a median and a mean from a small sample without overclaiming',
      ],
      why: 'Clients, managers and your own team will ask “how much faster is AI making us?”. A careful, honest answer builds trust; a flattering invented number loses it the first time someone checks.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'On the Friday of week 3 the association’s chairperson asks Mira: “So how much faster are you with AI?” Mira has two things to offer. The agents generated, say, twelve thousand lines of code, and Jun says it “feels about three times faster”. Neither is an answer. Lines say how much text appeared, not how much value shipped, and a feeling has nothing to compare against. Mira decides to report only what she can support, and to say plainly what she cannot. That habit is what this lesson builds.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine a bakery that brags “we bake 200 loaves an hour”. That number ignores how many loaves burned and how many were never sold. Counting output is not the same as counting results. A *metric* is a number you track on purpose. A *baseline* is how things were before, so a change has something to be compared with. An *outlier* is one result far from the others, such as the one loaf that sat in the oven for three hours. Honest measuring means counting results (what reached people, and whether it worked), keeping the before-and-after comparison fair, and telling the reader how little data you have.',
      },
      { type: 'heading', text: 'Numbers that look good and tell you little' },
      {
        type: 'table',
        headers: ['Number', 'What it really measures', 'Why it misleads'],
        rows: [
          ['Lines or files generated', 'How much text appeared', 'More code is more to review and maintain, not more value'],
          ['Prompts sent, sessions run', 'Activity', 'Measures effort and habit, not results'],
          ['Share of the code written by AI', 'Who typed it', 'Says nothing about whether it is right, used or easy to change'],
          ['Suggestions accepted', 'How often a person clicked yes', 'Accepting is not the same as being correct'],
          ['“It feels three times faster”', 'A feeling', 'No before-measure; novelty and selective memory distort it'],
          ['Pull requests opened', 'Volume', 'Rewards splitting work into noise'],
        ],
      },
      {
        type: 'paragraph',
        text: 'These numbers are not forbidden; they just must not be presented as productivity. Report them, if at all, as activity.',
      },
      { type: 'heading', text: 'Numbers that tell you about delivery' },
      {
        type: 'paragraph',
        text: 'DORA, a long-running research programme on software delivery, describes five software delivery metrics in two groups. *Throughput* has three: change lead time (the time for a change to go from committed to version control to deployed in production), deployment frequency, and failed deployment recovery time. *Instability* has two: change fail rate (the ratio of deployments that need immediate intervention) and deployment rework rate (the ratio of deployments that are unplanned because of an incident in production). Read throughput and instability together, because speed that raises the failure rate is not progress.',
      },
      {
        type: 'paragraph',
        text: 'DORA’s metrics are designed for delivery over time. A six-week project with two releases produces too few deployments to read them as more than a trend, so Sulit Store also keeps four small measures of its own. These are the team’s own choices, not DORA’s.',
      },
      {
        type: 'list',
        items: [
          '**Lead time per card:** hours from the card being opened to it being merged, taken from Git timestamps, not from memory.',
          '**Review wait:** hours from a pull request opening to its first human review. This is where agent-fast work queues up.',
          '**Rework:** the share of cards reopened or fixed after merging.',
          '**Escaped defects:** problems found by Lia’s phone testing or by pilot stores that a gate should have caught.',
        ],
      },
      { type: 'heading', text: 'Baseline and compare fairly' },
      {
        type: 'list',
        items: [
          '**Compare like with like:** the same kind of card, the same people, the same definition of done.',
          '**Count the whole cycle,** including review, fixes and rework, not just how long the agent ran.',
          '**If you have no “before”,** compare against your own earlier estimates or earlier projects, and say so. Do not invent a baseline afterwards.',
          '**Report counts and ranges,** not a single flattering number, and say how many cards the number is based on.',
          '**Expect novelty to fade.** The first weeks with a new tool are not a stable measure.',
        ],
      },
      {
        type: 'paragraph',
        text: 'A small sample needs the right average. These are invented lead times in hours for eight cards (made up to practise the arithmetic). One card got stuck for 30 hours. The *mean* adds everything up and divides, so the stuck card drags it up. The *median* is the middle value when the numbers are in order, so it shows the typical card.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Mean and median of eight invented lead times (run: prints mean 7.5, median 4.5)',
        code: `const hours = [3, 5, 4, 30, 6, 4, 5, 3];

function mean(values) {
  let sum = 0;
  for (const value of values) sum += value;
  return sum / values.length;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

console.log('mean ' + mean(hours));
console.log('median ' + median(hours));`,
      },
      {
        type: 'paragraph',
        text: 'The honest summary is “the typical card took about 4.5 hours; one took 30 and we are finding out why”, not “cards take 7.5 hours” and not “cards take 4.5 hours” with the outlier quietly dropped. Here is how Mira wrote the whole note for the client. All the numbers are invented for practice.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Metrics note, weeks 1 to 3 (invented numbers)',
        code: `METRICS NOTE: Sulit Store, weeks 1 to 3 (8 cards merged, a small sample)
Measured:    lead time per card (opened to merged), review wait,
             cards reopened after merge, defects found before the pilot
Result:      median lead time 4.5 h (range 3 to 30 h; the 30 h card waited on a
             missing spec); median review wait 6 h; 2 of 8 cards reopened;
             3 defects found by Lia's phone testing, 0 yet by stores
Does not show: whether this is faster than working without agents (no baseline),
             what the agents cost so far, or how the pilot will go
Decision:    keep the 8-file card cap; add a second reviewer on money cards`,
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Goodhart’s law warns that a measure turned into a target stops being a good measure: set a target on lead time and cards get sliced artificially or reviews get rushed. Measure the system, not individuals, and pair every speed measure with a stability measure (rework, escaped defects, change fail rate) so gaming one shows up in another. Pull timestamps from Git and CI automatically instead of asking people. Add review queue age, and cost per merged card including agent usage. With small samples use medians and ranges, state the n, and avoid pretending to precision. Add qualitative evidence: a short survey or a weekly note on where the agents helped and where they cost time. DORA’s framing of AI as an amplifier suggests improving the system (small changes, fast review, good tests) before expecting the numbers to move.',
      },
      {
        type: 'version',
        text: 'DORA’s software delivery performance guide lists five metrics in two groups: throughput (change lead time, deployment frequency, failed deployment recovery time) and instability (change fail rate, deployment rework rate), with the definitions paraphrased above. Its 2025 State of AI-assisted Software Development page frames AI as an amplifier of existing strengths and weaknesses. This lesson uses only those statements; read DORA’s own pages for how its surveys measure them and for its research findings. Checked on this date; DORA has revised its metric set before.',
        checked: CHECKED,
        sources: [DOCS.doraMetrics, DOCS.doraReport],
      },
      {
        type: 'takeaways',
        items: [
          'Lines generated, prompts sent, share of AI-written code and “it feels faster” measure activity or feelings, not delivery.',
          'DORA’s five metrics (change lead time, deployment frequency, failed deployment recovery time, change fail rate, deployment rework rate) pair throughput with instability.',
          'Compare like with like, count the whole cycle, never invent a baseline afterwards, and say how many data points you have.',
          'On a small sample, report the median and the range, and look into the outlier instead of hiding it.',
          'A metrics note says what was measured, the result, what it does not show and the decision it supports.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-06-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the median',
          story: 'Mira wants the typical lead time from the card list.',
          prompt: 'Write `median(values)`. It takes an array of numbers and returns the middle value after sorting from smallest to largest. If the array has an even number of values, return the average of the two middle ones. The array is never empty. Do not change the array you were given.',
          concept: 'median of a small sample',
          language: 'javascript',
          starter: 'function median(values) {\n  // sort a copy, then pick the middle\n  return 0;\n}',
          solution: 'function median(values) {\n  const sorted = [...values].sort((a, b) => a - b);\n  const middle = Math.floor(sorted.length / 2);\n  if (sorted.length % 2 === 1) {\n    return sorted[middle];\n  }\n  return (sorted[middle - 1] + sorted[middle]) / 2;\n}',
          tests: {
            kind: 'function',
            fn: 'median',
            cases: [
              { label: 'odd count', args: [[5, 1, 3]], expected: 3 },
              { label: 'even count averages the middle two', args: [[3, 5, 4, 30, 6, 4, 5, 3]], expected: 4.5 },
              { label: 'one value', args: [[7]], expected: 7 },
              { label: 'an outlier does not move it', args: [[2, 3, 3, 100, 4]], expected: 3 },
              { label: 'already sorted, even', args: [[1, 2, 3, 4]], expected: 2.5, hidden: true },
              { label: 'unsorted with repeats', args: [[9, 1, 9, 1, 5]], expected: 5, hidden: true },
            ],
          },
          hints: [
            'Sorting with `.sort()` changes the array, so copy it first with `[...values]`.',
            'Sort numbers with `.sort((a, b) => a - b)`. The middle position is `Math.floor(length / 2)`.',
            'With an odd length return `sorted[middle]`. With an even length return the average of `sorted[middle - 1]` and `sorted[middle]`.',
          ],
          explanation: 'A median needs sorted data, and sorting a copy leaves the caller’s array alone. Odd lengths have one middle value; even lengths average the two in the middle. Unlike a mean, one stuck card does not move it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-06-predict-output-1',
          kind: 'predict-output',
          title: 'Mean or median?',
          prompt: 'Four invented lead times, in hours. What do the two lines print?',
          concept: 'mean versus median',
          language: 'javascript',
          code: `const hours = [2, 4, 4, 10];

let sum = 0;
for (const h of hours) {
  sum += h;
}
console.log(sum / hours.length);

const sorted = [...hours].sort((a, b) => a - b);
console.log((sorted[1] + sorted[2]) / 2);`,
          choices: ['5\n4', '4\n5', '5\n5', '4\n4'],
          wrongNotes: {
            '4\n5': 'The first line is the mean (everything added, divided by four), which the 10 pulls up. The second is the median of the middle two.',
            '5\n5': 'The median is the average of the two middle values, 4 and 4, so it is not pulled up by the 10.',
            '4\n4': 'The sum is 20 and there are four values, so the mean is 5, not 4.',
          },
          hints: [
            'The first line adds the four numbers and divides by how many there are.',
            'The second line takes the middle two values of the sorted list (positions 1 and 2) and averages them.',
            'The sum is 20, so the mean is 5. The middle two are 4 and 4, so the median is 4.',
          ],
          explanation: 'The mean is 20 divided by 4, which is 5. The median uses the two middle values, 4 and 4, so it is 4. The slow 10-hour card raises the mean but not the median, which is why the median is better for a typical card.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-06-match-1',
          kind: 'match',
          title: 'What do you make of this number?',
          prompt: 'Match each number from a project report to the honest reading of it.',
          concept: 'reading metrics honestly',
          labels: { terms: 'The number in the report', meanings: 'What to make of it' },
          pairs: [
            { term: 'Agents generated 12,000 lines this week', definition: 'Activity, not value: it says nothing about speed or quality', note: 'Volume of text is not delivery.' },
            { term: 'Median time from a card opening to merging, from Git timestamps, 4.5 hours', definition: 'A delivery measure you can compare week to week', note: 'It is measured, repeatable and about the whole cycle.' },
            { term: 'Deployments needing immediate intervention: 1 of 4', definition: 'Change fail rate, a stability measure to read beside speed', note: 'It is the ratio the instability group is about, and 4 is a tiny sample.' },
            { term: 'Jun says it feels three times faster', definition: 'A feeling with no before-measure, so not evidence', note: 'Without a baseline you cannot separate a real change from novelty.' },
          ],
          hints: [
            'Ask of each number: was it measured, can it be repeated, and is there something to compare it to?',
            'Lines and feelings fail those tests; timestamps and ratios pass.',
            'Pair lines with activity, the median with a delivery measure, the 1-of-4 with change fail rate and the feeling with “not evidence”.',
          ],
          explanation: 'A trustworthy number is measured, repeatable and comparable. Volume and feelings are neither, while a timestamp-based median and a failure ratio are, though both still need their sample size stated.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-06-q1',
        prompt: 'Which of these is a vanity metric for AI-assisted productivity?',
        choices: [
          'The median time from a task card opening to its pull request being merged',
          'The number of lines of code the agents generated this week',
          'The share of cards that were reopened after they had been merged',
          'The number of defects found by testing on the real phone before release',
        ],
        answer: 1,
        explanation: 'Lines generated measures volume, not delivery. The other three measure what reached the product and how well it held up.',
      },
      {
        id: 'managing-ai-projects-06-q2',
        prompt: 'DORA’s five software delivery metrics are split into which two groups?',
        choices: [
          'Throughput and instability',
          'Speed and cost, with cost measured per developer',
          'Quality and quantity, each counted per project',
          'People and process, each counted per team member',
        ],
        answer: 0,
        explanation: 'Throughput covers change lead time, deployment frequency and failed deployment recovery time; instability covers change fail rate and deployment rework rate. Reading both stops speed from hiding a rise in failures.',
      },
      {
        id: 'managing-ai-projects-06-q3',
        prompt: 'Eight lead times (3, 5, 4, 30, 6, 4, 5, 3 hours) have a mean of 7.5 and a median of 4.5. Which statement is the most honest?',
        choices: [
          'Cards take 7.5 hours on average, so that is the number to put in the report for the client',
          'Cards take 4.5 hours, so there is nothing to investigate and the report can be short',
          'The 30-hour card is an error, so remove it from the data before reporting anything at all',
          'The typical card took about 4.5 hours, one took 30 and needs a look, and eight is a small sample',
        ],
        answer: 3,
        explanation: 'Report the typical value and the outlier, look into why it happened and say how small the sample is. Removing the outlier hides a real problem, and the mean alone is dragged by it.',
      },
      {
        id: 'managing-ai-projects-06-q4',
        prompt: 'Why is “it feels three times faster” not enough for a client report?',
        choices: [
          'Feelings are never allowed in any report that a client will read, whatever the topic is',
          'Developers always exaggerate how much faster they have become when they use new tools',
          'There is no before-measure to compare with, and novelty and memory distort feelings',
          'The client will only accept numbers that came from a spreadsheet or a dashboard tool',
        ],
        answer: 2,
        explanation: 'The problem is not that feelings are banned; it is that without a baseline you cannot tell a real change from novelty, and memory favours the good moments.',
      },
      {
        id: 'managing-ai-projects-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In the bakery comparison, what does “loaves baked per hour” leave out?',
        choices: [
          'How long the oven takes to warm up each morning before the first batch goes in',
          'The price of the flour and the other ingredients that were used for the loaves',
          'Whether the loaves burned or sold',
        ],
        answer: 2,
        explanation: 'Output is not results. Counting loaves ignores burnt ones and unsold ones, the way counting lines ignores broken and unused code.',
      },
      {
        id: 'managing-ai-projects-06-q6',
        audience: { min: 'advanced' },
        prompt: 'Management sets a target to halve lead time per card. A month later cards are tiny and reviews are quick, but pilot stores report more defects. What happened?',
        choices: [
          'The target was met, which proves that the agents are working well for the whole team',
          'The amplifier effect, which always shows up in the weeks after a new tool is introduced',
          'Normal variation that needs no action while the sample is as small as it still is here',
          'A target got gamed (Goodhart’s law): pair lead time with rework and escaped defects',
        ],
        answer: 3,
        explanation: 'Cutting lead time by slicing and rushing review moves the problem into defects. Pairing speed with stability measures makes gaming visible, and targeting the system avoids blaming individuals.',
      },
    ],
    task: {
      title: 'Write a metrics note',
      minutes: 18,
      steps: [
        'Collect 8 numbers for a real or practice project: hours from a task being opened to it being done. If you have none, invent eight realistic ones and label them as invented.',
        'Compute the mean and the median (use the code in the lesson, or ask an AI assistant to run it, then check one by hand). Write one honest sentence that includes the typical value, the outlier and the sample size.',
        'Write a metrics note in the format above: what you measured, the result, what it does not show and the decision it supports.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant: “Explain the difference between the mean and the median using my numbers, in plain words.” Check that its explanation matches what you computed.'] },
      { audience: { min: 'advanced' }, steps: ['Write a script that pulls opened and merged times of recent pull requests through your Git host’s command-line tool or API, computes median lead time and review wait per week, and pairs them with a rework count. State what you would not conclude from the result.'] },
    ],
  },
  // ---------------------------------------------------------------- 7
  {
    id: 'managing-ai-projects-07',
    day: 7,
    title: 'Managing risk, cost and expectations',
    summary: 'A risk register with AI-specific risks, a three-part budget for agent work, and client updates that promise dates as ranges instead of speed.',
    minutes: 28,
    skills: ['risk-cost-expectations'],
    intro: {
      objectives: [
        'Build a risk register where every risk has an early warning, a response and an owner',
        'Watch agent cost, time and review capacity together and set stop rules',
        'Write a client update that promises outcomes and date ranges without overpromising AI speed',
      ],
      why: 'Projects with agents usually go wrong in three places: a risk nobody was watching, a bill nobody was tracking, or a promise nobody should have made. Handling all three calmly is what makes a client hire you again.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'It is week 4 of Sulit Store. The pilot stores found a bug: the reminder message was being prepared twice. The association’s chairperson now asks whether all forty stores can start next week instead of week 6, because a freelancer online says AI builds an app like this in a week. Meanwhile Mira notices that agent usage in week 3 grew faster than she had planned for. Three conversations arrive at once: what could still go wrong, what this is costing, and what she can honestly promise.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Before a trip you ask “what could go wrong?” and pack an umbrella in case of rain. A *risk register* is that list for a project: each thing that could go wrong, how you would notice early, and what you will do. A *budget* is what you are willing to spend, and for AI-assisted work it has three parts: money (the tools), time (people) and attention (how much work careful people can review). *Expectations* are what the client believes will happen. Many projects fail not because the work was bad but because the expectation was never aligned with it.',
      },
      { type: 'heading', text: 'A risk register for AI-assisted work' },
      {
        type: 'paragraph',
        text: 'For each risk write how likely and how serious it is (high, medium or low: your own judgement, not statistics), the early warning sign, the response you decided now, and one named owner. Review it every Monday and delete risks that are retired. These are Sulit Store’s, including the ones that only exist because agents build much of it.',
      },
      {
        type: 'table',
        headers: ['Risk (likelihood / impact)', 'Early warning', 'Response', 'Owner'],
        caption: 'Sulit Store risk register, week 4 (invented for practice).',
        rows: [
          ['Plausible but wrong money logic (medium / high)', 'Money cards merged without tests using awkward amounts', 'Second reviewer on money cards; the money gate from lesson 3', 'Jun'],
          ['Review queue backs up (high / medium)', 'Pull requests waiting more than a day for a first review', 'Limit open pull requests per person; pause new cards', 'Mira'],
          ['An agent adds a risky dependency or leaks a secret (medium / high)', 'A new package in a diff; a secret scan alert', 'A reason required for every dependency; secret scanning in CI', 'Jun'],
          ['A tool or model change shifts behaviour mid-project (medium / medium)', 'Golden task cards give different results than last week', 'Upgrade between slices only; re-run the golden cards first', 'Mira'],
          ['Old offline phones behave differently from the developers’ (high / medium)', 'Fine on a laptop, slow on the test phone', 'Test every slice on the oldest pilot phone', 'Lia'],
          ['Scope creep because building feels cheap (high / medium)', 'Requests that arrive with no trade-off', 'The written change-request rule', 'Mira'],
          ['Customers’ names and debts are personal data (medium / high)', 'Real data in tests, logs or prompts', 'Fake data only; check the privacy rules that apply to you and the client', 'Mira'],
        ],
      },
      {
        type: 'paragraph',
        text: 'The last row is a reminder that privacy rules differ by country and by client, and this course does not give legal advice: check the rules that apply where your users live and your client’s own policy, ask a professional when in doubt, and read AI Coding Security and Best Practices for what you may paste into AI tools.',
      },
      { type: 'heading', text: 'Three budgets, not one' },
      {
        type: 'table',
        headers: ['Budget', 'What counts', 'How you watch it', 'Stop rule'],
        rows: [
          ['Money', 'Agent usage, tool plans, hosting', 'The provider’s usage page, once a week, against the plan', 'A weekly cap in the provider’s spend limits; stop and talk at the cap'],
          ['Time', 'People’s hours, including review and fixes', 'Lead time and rework from lesson 6', 'A card that fails twice goes to a person, not a third agent run'],
          ['Attention', 'What careful reviewers can read in a week', 'Review wait and open pull requests', 'Work-in-progress limit; no new cards while the queue is long'],
        ],
      },
      {
        type: 'paragraph',
        text: 'On API billing, Claude Code’s cost follows token consumption and varies widely with the model, the size of the codebase and habits such as running several sessions at once. So Mira does not guess: she checks the usage page every Friday, and computes *cost per merged card* (the week’s agent spend divided by cards merged) as her own measure of whether big, messy runs are wasting money. Habits that reduce cost also improve quality: start a fresh session between unrelated tasks, use a smaller model for simple work, plan before a large change, and give the agent a way to check itself, such as a test.',
      },
      { type: 'heading', text: 'Managing what the client expects' },
      {
        type: 'list',
        items: [
          '**Promise outcomes and dates as ranges,** with the condition that moves them: “week 6, or week 7 if the pilot finds more defects”.',
          '**Never promise a speed ratio.** “AI makes us ten times faster” is a claim you cannot support and the client will hold you to.',
          '**Show the process:** a weekly demo on a real phone, a written update, and the pilot’s exit criteria agreed in advance.',
          '**Run change requests in writing:** every new ask is sized (including testing and the pilot), traded against something and approved before work starts.',
          '**Be open about tools** if the client’s policy requires it. Read your contract and the tools’ terms on who owns generated code and what may be shared; settle it before the work, not after.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        label: 'The weekly client update Mira sends (a template)',
        code: `SULIT STORE: weekly update, end of week 4
Done:             reminder sharing; weekly summary; fix for the double-prepared reminder
Next:             server backup and sign-in (cards W5-01 to W5-06)
Dates:            all-store release planned for the end of week 6; the range is
                  week 6 to week 7 if the pilot finds more defects
Risks:            review queue (limiting open pull requests); money rules (second reviewer)
Needs from you:   five more pilot stores to try the weekly summary by Wednesday
Decision needed:  add stock counting? Only if we drop the weekly summary charts`,
      },
      {
        type: 'prompt',
        label: 'Draft the update, and have the AI flag overpromises',
        text: 'Draft this week’s client update from my notes below, in the format of the template. Use only facts in the notes. Write every date as a range with its condition. Then list any sentence that promises a result or date I have not supported, so I can remove it. Notes: [paste here]',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Agree pilot exit criteria and a must, should, could cut line in week one, so that when time runs short scope moves and quality gates do not. Keep a contingency buffer, and make the buffer visible to the client rather than hiding it inside estimates. Think about exit from your tools: keep instructions and prompts tool-neutral (a shared `AGENTS.md`) so a model or vendor change is a configuration change, not a rewrite. Discuss commercial structure openly: under a fixed price the efficiency of agents accrues to you, under time-and-materials it accrues to the client, and an unspoken mismatch creates conflict. Plan the handover: who maintains AI-written code afterwards, with tests, decision records and the instructions file as the handover package, and a rollback plan for each release.',
      },
      {
        type: 'version',
        text: 'Claude Code’s cost documentation says Claude Code charges by API token consumption (subscription plans include usage in the plan), that per-developer costs vary widely with model selection, codebase size and usage patterns such as running multiple instances, that a small pilot group should be used to establish a baseline before wider rollout, and that organisations can set spend limits (workspace limits on the Console, spend limits on Teams and Enterprise). It also lists clearing context between tasks, matching the model to the job and giving verification targets as ways to reduce cost. Its average-cost figures are not repeated here because they change. Checked on this date; plans and limits change often.',
        checked: CHECKED,
        sources: [DOCS.ccCosts],
      },
      {
        type: 'takeaways',
        items: [
          'A useful risk register gives each risk an early warning sign, a response decided now and one owner, and is reviewed weekly.',
          'AI-specific risks include plausible but wrong logic, review overload, risky dependencies, secrets and personal data, and tool or model changes.',
          'Watch three budgets together: money (agent usage), time (people) and attention (review capacity), each with a stop rule.',
          'Promise outcomes and dates as ranges with their conditions, and never a speed ratio you cannot support.',
          'Handle every new request as a written change: sized, traded against something and approved first.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-07-scenario-1',
          kind: 'scenario',
          title: 'Why not launch Monday?',
          prompt: 'Choose how Mira replies to the chairperson.',
          concept: 'managing client expectations',
          situation: 'The chairperson writes: “A freelancer on Facebook says AI builds an app like this in a week. Why can’t all 40 stores start next Monday?” The pilot found a defect that is now fixed, but the server backup has not been tested, and week 5’s old-phone testing has not happened.',
          options: [
            { text: 'Reply with facts: what exists, what the pilot found, which exit checks remain (backup restore, old phones), a date range with its condition, and an offer to add five more pilot stores next week.', consequence: 'The chairperson sees real progress and the reasons for the dates, and gets a smaller step that gives the owners what they asked for sooner.', quality: 'best' },
            { text: 'Agree to Monday. The agents can catch up on the backup and testing over the weekend.', consequence: 'Forty stores start on an app whose backup nobody has tested. When a phone is lost, so are a month of balances.', quality: 'poor' },
            { text: 'Explain that AI does not really make building faster, and leave it there.', consequence: 'It is not true (it changes where the time goes), it sounds defensive, and the client still has no date or next step.', quality: 'acceptable' },
            { text: 'Tell the chairperson the freelancer is exaggerating and should not be trusted.', consequence: 'You may be right, but you have started a fight, offered nothing and made the client choose between you and someone they have never tested.', quality: 'poor' },
          ],
          hints: [
            'What does the client actually need: speed, or confidence and a date they can plan around?',
            'Honest facts and a smaller step beat both promises and arguments.',
            'Show progress, name the remaining checks, give a range with its condition and offer a safe intermediate step.',
          ],
          explanation: 'Clients accept honest dates when they can see the evidence and a sensible next step. A promise of Monday risks real data, and criticising a competitor or dismissing the question gives them nothing to act on.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-07-match-1',
          kind: 'match',
          title: 'Which early warning goes with which risk?',
          prompt: 'Match each risk on Sulit Store’s register to the early warning sign that would tell you about it in time.',
          concept: 'early warning signs',
          labels: { terms: 'The risk', meanings: 'The early warning to watch' },
          pairs: [
            { term: 'Plausible but wrong money logic', definition: 'Money cards merged with no test using awkward amounts', note: 'This is the missing gate from lesson 3 showing up in the merged cards.' },
            { term: 'The review queue backs up', definition: 'Pull requests waiting more than a day for a first review', note: 'Review wait is the first number to rise when agents outrun people.' },
            { term: 'A tool or model change shifts behaviour', definition: 'Golden task cards give different results than last week', note: 'A fixed set of tasks is how you notice that the ground moved.' },
            { term: 'Scope creep', definition: 'Requests that arrive with no trade-off attached', note: 'A request with nothing traded out is the first sign the scope is growing.' },
          ],
          hints: [
            'An early warning is something you can see before the damage, not the damage itself.',
            'Think of the number or the artefact that would change first for each risk.',
            'Money logic shows in the merged cards, the queue in review wait, a model change in golden cards and scope creep in requests without trades.',
          ],
          explanation: 'Each risk leaves a trace before it hurts: a missing test, a waiting pull request, a different result on a fixed task, a request with nothing traded. Naming that trace in advance is what makes a risk manageable.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-07-fill-blank-1',
          kind: 'fill-blank',
          title: 'Fix the overpromise',
          prompt: 'Complete the update so that it gives a range with its condition, names a risk and makes a trade for the new request.',
          concept: 'honest client updates',
          language: 'text',
          code: `Dates:            all-store release planned for the end of week 6; the ___ is week 6 to week 7 if the pilot finds more defects
Risks:            ___ (we limit open pull requests per person)
Decision needed:  add stock counting? Only if we drop ___ from the could-have list`,
          bank: ['range', 'review queue', 'the weekly summary charts', 'promise', 'nothing at all', 'the money rules'],
          blanks: [
            { answers: ['range'], feedback: 'A “range” says the date can move and under which condition. A “promise” would repeat the overpromise.' },
            { answers: ['review queue'], feedback: 'Limiting open pull requests is the response to the review queue risk. The money rules are protected by a second reviewer instead.' },
            { answers: ['the weekly summary charts'], feedback: 'A new request must be traded against something from the could-have list. “Nothing at all” is the silent absorption lesson 1 warned against.' },
          ],
          hints: [
            'The first blank is a word that tells the client the date can move.',
            'Match the response in brackets to its risk on the register.',
            'Answers in order: range, review queue, the weekly summary charts.',
          ],
          explanation: 'An honest update gives dates as ranges with conditions, names the risks with the response in place, and answers every new request with a trade. That is how expectations stay aligned with reality.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-07-q1',
        prompt: 'What makes a risk register entry useful rather than decorative?',
        choices: [
          'A long description of how bad it would be if the worst happened to the project',
          'A colour code that shows how worried the team feels about it that week',
          'A complete list of every risk anyone has ever thought of for software projects',
          'An early warning sign, a response decided now and a named owner',
        ],
        answer: 3,
        explanation: 'A register works when each risk can be noticed early, has an agreed response and someone responsible. Description, colour and completeness do not change what happens.',
      },
      {
        id: 'managing-ai-projects-07-q2',
        prompt: 'On API billing, Claude Code’s cost follows token consumption and varies widely between teams. What is a sensible way to budget?',
        choices: [
          'Assume a flat monthly fee per developer, so no tracking is needed during the project',
          'Use the largest model for every task, since quality matters more than cost',
          'Run a small pilot, measure real usage as a baseline, and set spend limits before wider use',
          'Wait for the first invoice to arrive and then decide whether the project can afford it',
        ],
        answer: 2,
        explanation: 'The cost documentation recommends a small pilot to establish a baseline, and describes spend limits. Guessing a flat fee or waiting for the invoice leaves the cost out of control.',
      },
      {
        id: 'managing-ai-projects-07-q3',
        prompt: 'A client says a freelancer can build the same app in a week. Which reply is best?',
        choices: [
          'Show the progress, name the checks still to run, and offer a date range and a smaller step',
          'Agree to the earlier date and add more agents to the project so the team can catch up',
          'Tell the client the freelancer is exaggerating and cannot be trusted with real shops’ data',
          'Say that AI does not speed up building at all, so the comparison is meaningless to the client',
        ],
        answer: 0,
        explanation: 'Evidence plus a range plus a safe next step gives the client something to plan around. Agreeing risks real data, and attacking the competitor or denying AI’s effect gives them nothing.',
      },
      {
        id: 'managing-ai-projects-07-q4',
        prompt: 'Which line in a client update overpromises?',
        choices: [
          'Release planned for week 6, or week 7 if the pilot finds more defects',
          'Because we use AI, the release will definitely arrive two weeks early',
          'Next up: server backup and sign-in, then old-phone testing',
          'We need five more pilot stores to try the weekly summary by Wednesday',
        ],
        answer: 1,
        explanation: '“Definitely” and a stated speed-up are promises the team cannot support. The other lines give a range with a condition, a next step and a request for something specific.',
      },
      {
        id: 'managing-ai-projects-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In the umbrella comparison, what is a risk register?',
        choices: [
          'The umbrella you carry in case it rains on the project, ready to be opened',
          'A list of what could go wrong, how you would notice, and what you will do',
          'A weather forecast for the next ten years of the project, kept in a drawer',
        ],
        answer: 1,
        explanation: 'The register is the “what could go wrong, and what will we do” list, written before the rain starts.',
      },
      {
        id: 'managing-ai-projects-07-q6',
        audience: { min: 'advanced' },
        prompt: 'A launch date is at risk. Which agreement made in week one best protects both you and the client?',
        choices: [
          'Exit criteria and a must, should, could cut line, so scope moves before quality',
          'A promise to add extra agents whenever the schedule slips, at no extra cost to anyone',
          'A fixed date in the contract, with testing shortened if the work runs late',
          'A verbal agreement to be flexible about dates and features when the time comes',
        ],
        answer: 0,
        explanation: 'Agreed exit criteria and a cut line decide in advance what moves under pressure. More agents hit review limits, shortened testing moves the risk to the client’s data, and a vague agreement defers the argument.',
      },
    ],
    task: {
      title: 'Risk register, budgets and an honest update',
      minutes: 20,
      steps: [
        'Write a risk register for your own project with six risks, at least three of them AI-specific (wrong but plausible logic, review overload, tool change, secrets, personal data). Give each an early warning, a response and an owner.',
        'Fill in the three-budget table for your project: how you will watch money, time and attention, and one stop rule for each.',
        'Write a client update for your project in the template’s format, using the prompt in the lesson to have an AI flag overpromises. Remove every flagged sentence you cannot support.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an AI assistant: “Which risk on my list would I only notice too late, and what would be an earlier sign?” Add the early sign to your register.'] },
      { audience: { min: 'advanced' }, steps: ['Add pilot exit criteria and a must, should, could list to your plan, and write one paragraph on how you would handle the commercial question: who benefits if agents make the work faster, you or the client?'] },
    ],
  },
  // ---------------------------------------------------------------- 8
  {
    id: 'managing-ai-projects-08',
    day: 8,
    title: 'Project: run a multi-week AI-assisted project plan',
    summary: 'Put every lesson into one written plan, the full Sulit Store plan, then learn the weekly rhythm that runs it and the review that tells you whether yours is ready.',
    minutes: 32,
    skills: ['project-planning'],
    intro: {
      objectives: [
        'Assemble a brief, task cards, gates, documentation, metrics, risks, budgets and a client rhythm into one plan',
        'Review a plan against a short list of red flags before any agent starts',
        'Run a weekly rhythm and replan with a cut line when a week slips',
      ],
      why: 'A plan on one page is what turns skills into a project you can sell and deliver. It is also the artefact a client or employer can read in five minutes to judge whether you know how to run work with agents.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Over seven lessons Mira built the parts of Sulit Store’s plan one at a time. Now the parts go into one document the whole team can run for six weeks. It is long on purpose: this is the plan written out in full, so you can see exactly how each lesson turns into a section. Every figure and date is invented for practice. What you copy is the structure.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A plan is a document that answers six questions: what are we making, in what order, how will we know each piece is right, what could go wrong, how much will it cost, and how will we keep the client informed? If this is your first plan, do not copy all of it at full size. Keep every section but make each one tiny: two weeks instead of six, one feature, three or four task cards a week, one gate (a test that must pass) and one short note for the client. The sections are the same; only the size changes. Everything in the plan below uses ideas from the earlier lessons, so use them as a reference.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'The Sulit Store project plan, version 3 (every figure invented for practice)',
        code: `SULIT STORE: PROJECT PLAN (v3, six weeks)

1. BRIEF
   Goal:     an owner records utang or a payment in under 20 seconds and sees who owes what.
   In:       customers, utang and payment entries, balances, weekly summary, shareable reminder.
   Out:      online payments, inventory, staff accounts.
   Cut line: if time runs short, cut in this order: reminder wording options,
             weekly summary charts, undo history. Gates are never cut.

2. PEOPLE
   Mira: scope, final review, the client. Jun: data and money, reviews money cards.
   Lia: screens, phone testing, reviews screen cards.
   Each person drives one agent, one card at a time. Nobody merges a change they drove.

3. WEEKS
   W1 Skeleton       App runs on the test phone, saves one customer, CI and merge rules live,
                     AGENTS.md written, decision records 001 and 002.   Gate: skeleton demo.
   W2 Utang, payments Cards W2-01 to W2-07.   Gate: money tests with awkward values, phone test.
   W3 Summary, reminders  Weekly summary, shareable reminder. Pilot in 5 stores at week end.
                     Gate: pilot exit check A (no balance-changing defect).
   W4 Pilot fixes, backup  Fix what the pilot finds; sign-in and server backup.
                     Gate: a backup restored onto a second phone.
   W5 Hardening      Security review, old-phone performance, offline edge cases, docs audit.
                     Gate: pilot exit check B.
   W6 Release        All 40 stores, handover, retrospective.   Gate: go/no-go on the exit criteria.
   Every Friday: integration day, demo, metrics note, client update, retrospective.

4. TASK CARDS
   One outcome, 8-file cap, a check that can fail, a named reviewer, merges alone.
   Cards are written in detail one week ahead (on Monday) and sketched after that.

5. GATES
   Definition of done: eight lines in docs/dod.md.
   Main branch: pull request required, one approval from someone who did not drive the agent,
   CI (types, lint, tests) must pass, owner review for .github/, AGENTS.md and src/money/.

6. CONVENTIONS AND DOCS
   AGENTS.md (CLAUDE.md imports it), pull request template, card template,
   docs/prompts/implement-card.md, decision records (money, reminders, backup),
   README audit every Friday.

7. METRICS (to the client every Friday)
   Median lead time per card, median review wait, share of cards reopened, defects found
   before the pilot and by pilot stores. Counts and ranges, with the sample size stated.
   Not reported as productivity: lines generated, prompts sent.

8. RISKS
   docs/risks.md, reviewed on Mondays. Top three: wrong money logic, review queue, scope creep.

9. BUDGET
   People: three people for six weeks. Agent usage: a weekly cap set in the provider's spend
   limits, checked each Friday against cost per merged card.
   Stop rule: a card that fails twice goes to a person.

10. CLIENT RHYTHM
   A 30-minute demo on a real phone each week, then a written update with dates as ranges.
   Change requests only in writing, each sized and traded against something.

11. PILOT EXIT CRITERIA (to release to all 40 stores)
   No open defect that loses or changes a balance; a backup restored onto a second phone;
   runs on the oldest pilot phone; five owners record a week of utang without help.`,
      },
      { type: 'heading', text: 'Review the plan before anyone starts' },
      {
        type: 'paragraph',
        text: 'A plan is itself reviewable, and it is cheaper to fix on paper than in week 4. Run these checks on your own plan, the same way you would review a pull request.',
      },
      {
        type: 'table',
        headers: ['Ask', 'Where to look', 'Red flag'],
        rows: [
          ['Is every week’s outcome something a person can use or check?', 'Section 3', 'A week that ends with “done typing”, or no gate at all'],
          ['Could each card be reviewed in one sitting?', 'Section 4', 'Cards with several outcomes, or no size cap or check'],
          ['What stops a bad change reaching main?', 'Section 5', 'Checks that exist but are not required by a merge rule'],
          ['Would a new agent session follow the same rules?', 'Section 6', 'Conventions that live only in chat or in someone’s head'],
          ['What would you say to the client if the numbers were bad?', 'Sections 7 and 10', 'Only vanity metrics, or a date with no range'],
          ['What do you cut first, and when do you release?', 'Sections 1 and 11', 'No cut line, or a release with no exit criteria'],
        ],
      },
      { type: 'heading', text: 'Running the plan week by week' },
      {
        type: 'table',
        headers: ['Day', 'What happens'],
        rows: [
          ['Monday', 'Review the risk register; write this week’s cards; assign reviewers; check the agent spend against the cap'],
          ['Tuesday to Wednesday', 'Agents build one card at a time; people review as pull requests arrive; limit open pull requests'],
          ['Thursday', 'Gate review: the definition of done on every merged card; fix what fails; stop starting new cards'],
          ['Friday', 'Integration day: run every check on main, demo on a real phone, update the metrics note, send the client update, hold the retrospective'],
        ],
      },
      {
        type: 'paragraph',
        text: 'When a week slips, you have exactly three levers: scope, date and quality. The plan fixes quality (the gates are never cut) and gives you a cut line for scope, so the decision is made calmly in advance, not in a panic on Thursday. Tell the client the same day, with the new range and what moved.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Plan one week in detail and the rest as a sketch, then re-plan every Friday from measured lead times, not hopes. Find the critical path and the review capacity it needs; parallel agents help only until reviewers saturate, so make that number explicit and add a visible buffer. Keep the plan in the repository, versioned, with changes recorded in the log. For professional teams, make the evidence trail part of the process: every pull request records the card, the checks run with results, what the agent was not asked or able to check, and the reviewer’s notes, so a lead or auditor can see how an AI-built change was verified. Use the retrospective to adjust gates and instructions from the data, not from impressions.',
      },
      {
        type: 'takeaways',
        items: [
          'A full plan has a brief with a cut line, people and rules, weekly gates, task cards, merge rules, conventions, metrics, risks, budget, a client rhythm and exit criteria.',
          'Review the plan like a pull request: weeks that end in something checkable, reviewable cards, enforced gates, conventions in the repo, honest metrics, a cut line and exit criteria.',
          'Detail one week ahead and sketch the rest; re-plan every Friday from what you measured.',
          'When a week slips, scope moves by the agreed cut line, the date moves with a stated range, and quality gates do not move.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-08-fix-bug-1',
          kind: 'fix-bug',
          title: 'A plan that ships without a gate',
          prompt: 'This is the weekly outline of a different project, a booking app for barber shops. One week has no gate and no exit criteria before release. Tap it, then choose the replacement that fixes it.',
          concept: 'plan review',
          language: 'text',
          code: `WEEKS (draft plan for a booking app for barber shops)
W1 Skeleton: app runs on a test phone, books one slot, CI live
W2 Booking and cancelling: cards B2-01 to B2-06
W3 Reminders and a shop calendar: cards B3-01 to B3-05
W4 Release to all shops and fix whatever they report
W5 Handover and retrospective`,
          bugLine: 5,
          fixes: [
            { line: 'W4 Hardening, a pilot in two shops, then release to all shops only if the exit criteria are met', correct: true, why: 'It adds a pilot and a gate before release, so real shops are not the first test.' },
            { line: 'W4 Release to all shops and fix whatever they report, with two agents fixing reports in parallel', correct: false, why: 'More agents fixing faster does not replace checking before release; the shops are still the first testers.' },
            { line: 'W4 Release to all shops on Monday so there is a full week to fix whatever they report', correct: false, why: 'It moves the release earlier and the risk with it. Nothing has been checked before real shops start.' },
            { line: 'W4 Release to all shops and ask an agent to monitor the reports and fix them overnight', correct: false, why: 'Monitoring is a late gate that tells you after the damage. It cannot replace a pilot and exit criteria.' },
          ],
          lineNote: 'That week ends in something checkable. Look for the week where real users become the first testers.',
          hints: [
            'Which week would put the app in front of every shop with no checking first?',
            'The line says “fix whatever they report”: the users are the gate.',
            'The fix needs a pilot and exit criteria before the full release.',
          ],
          explanation: 'A plan must put gates between the work and the real users. Releasing to everyone and fixing what they report makes customers the testers. A pilot with agreed exit criteria turns the release into a decision.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-08-scenario-1',
          kind: 'scenario',
          title: 'Wednesday of week 3 and three cards are late',
          prompt: 'Choose how Mira handles the slip.',
          concept: 'replanning with a cut line',
          situation: 'The pilot in five stores is planned for Friday. Three cards are unfinished: the reminder wording options, the weekly summary charts and the weekly summary totals. Review is already two days behind.',
          options: [
            { text: 'Apply the agreed cut line: drop the reminder wording options and the charts, keep the totals, hold all gates, tell Aling Nena today, and keep Friday only if pilot exit check A can be met.', consequence: 'The pilot gets the useful core on time or moves with a stated reason. Nothing is rushed past review, and the client hears early.', quality: 'best' },
            { text: 'Skip review on the three late cards so the pilot can go ahead on Friday.', consequence: 'The pilot starts on time with three unreviewed cards. A balance bug reaches real stores in the first week.', quality: 'poor' },
            { text: 'Quietly move the pilot back a week and mention it in the next update.', consequence: 'The quality is protected, but the client finds out late and has to rearrange five stores’ schedules at the last minute.', quality: 'acceptable' },
            { text: 'Start a second agent on each late card to finish faster.', consequence: 'Review is the bottleneck, so more agents add more unreviewed work, and two agents on one card collide.', quality: 'poor' },
          ],
          hints: [
            'Three levers move when a week slips: scope, date and quality. Which one did the plan fix in advance?',
            'More agents cannot fix a review backlog.',
            'Use the cut line, keep the gates, and tell the client the same day.',
          ],
          explanation: 'The cut line exists so scope gives way calmly, while the gates stay. Telling the client early turns a slip into a managed decision, and adding agents or skipping review makes the real constraint worse.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'managing-ai-projects-08-arrange-1',
          kind: 'arrange',
          title: 'Friday’s integration day',
          prompt: 'Arrange Friday’s steps in the order that makes each one possible.',
          concept: 'the weekly rhythm',
          language: 'text',
          solution: [
            'Run every check on main and fix what fails',
            'Demo the week’s slice to the client on a real phone',
            'Update the metrics note from Git and CI timestamps',
            'Send the written client update with dates as ranges',
            'Hold the retrospective and write Monday’s changes into the plan',
          ],
          alternatives: [
            [
              'Run every check on main and fix what fails',
              'Update the metrics note from Git and CI timestamps',
              'Demo the week’s slice to the client on a real phone',
              'Send the written client update with dates as ranges',
              'Hold the retrospective and write Monday’s changes into the plan',
            ],
          ],
          reasons: [
            'Main must be green before you show anything to the client.',
            'The demo shows what the checks have just proved to be working.',
            'The metrics note comes from this week’s timestamps and results.',
            'The update reports the demo and the metrics, so it follows them.',
            'The retrospective uses the whole week, so it comes last.',
          ],
          hints: [
            'What must be true before you show the client anything?',
            'The written update reports the demo and the numbers, so it cannot come before them.',
            'Order: checks, demo, metrics (these two can swap), update, retrospective.',
          ],
          explanation: 'Friday builds on itself: green main, then the demo and the numbers, then the update that reports them, and finally the retrospective that learns from the week and changes Monday’s plan.',
        },
      },
    ],
    quiz: [
      {
        id: 'managing-ai-projects-08-q1',
        prompt: 'Why does the plan write task cards in detail only one week ahead?',
        choices: [
          'Later cards depend on what earlier weeks teach, so detailed ones would be rewritten guesses',
          'The agents cannot read task cards that describe more than a single week’s worth of work',
          'Writing cards early is against the rules of the project’s merge settings on the main branch',
          'The client is only allowed to see one week of the plan at a time',
        ],
        answer: 0,
        explanation: 'What you learn in weeks 2 and 3 changes weeks 4 to 6. Detailing them early produces work that is thrown away, so the plan sketches ahead and details next week.',
      },
      {
        id: 'managing-ai-projects-08-q2',
        prompt: 'What is the job of the cut line in the plan?',
        choices: [
          'To mark the date after which no more changes can be made by anyone on the project',
          'To agree in advance which scope goes first when time is short, so gates stay',
          'To decide which agent is allowed to work on which card each day',
          'To separate the work the client pays for from the work the team does for free',
        ],
        answer: 1,
        explanation: 'The cut line decides calmly, before the pressure, what scope moves. With it, a slipping week changes scope or date, and the gates are never the thing that gives way.',
      },
      {
        id: 'managing-ai-projects-08-q3',
        prompt: 'Which pilot exit criterion is the strongest basis for releasing to all stores?',
        choices: [
          'The team feels confident after the third week of testing',
          'Most owners seem to like the app when they are asked about it in person',
          'A backup restored on a second phone, and five owners using it for a week unaided',
          'No complaints have arrived since the first day of the pilot in the five stores',
        ],
        answer: 2,
        explanation: 'A good exit criterion is specific and observable. Feelings, impressions and silence cannot fail, while a restored backup and a week of unaided use can.',
      },
      {
        id: 'managing-ai-projects-08-q4',
        prompt: 'Which set of items belongs in a weekly client update?',
        choices: [
          'Lines of code generated, number of prompts sent and total agent sessions this week',
          'A promise to finish a week early, supported by how fast the agents write the code',
          'A list of every prompt used so the client can check the agents’ work',
          'Dates as ranges, the next slice, the main risks and any decision the client must make',
        ],
        answer: 3,
        explanation: 'A client update gives dates they can plan around, what comes next, what could go wrong and what they must decide. Volume numbers, speed promises and prompt logs do none of that.',
      },
      {
        id: 'managing-ai-projects-08-q5',
        audience: { max: 'beginner' },
        prompt: 'If this is your very first project plan, what is the sensible way to start?',
        choices: [
          'Copy all eleven sections at full size, so that nothing at all is missing from it',
          'Skip the plan and start prompting, then write notes at the end',
          'Keep every section but make each tiny: two weeks, one feature, one gate',
        ],
        answer: 2,
        explanation: 'The sections matter more than the size. A small plan with all the parts teaches you the habit and is easy to actually follow.',
      },
      {
        id: 'managing-ai-projects-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A client’s compliance team wants to know how AI-built changes are verified. Which practice gives them an audit trail?',
        choices: [
          'A verbal sign-off from the team lead during the daily check-in call each morning',
          'A pull request description recording the card, checks run, gaps and reviewer notes',
          'A screenshot of the final working screen attached to every release of the app',
          'A statement in the contract that all of the code is reviewed by a person',
        ],
        answer: 1,
        explanation: 'Evidence has to be recorded per change. A structured pull request description shows what was verified and by whom, which a verbal sign-off, a screenshot or a general promise cannot.',
      },
    ],
    task: {
      title: 'Start your own plan',
      minutes: 20,
      steps: [
        'Open the Sulit Store plan above next to a blank document. Write sections 1 to 3 for your own project: the brief with a cut line, the people, and the weeks with a gate for each week.',
        'Run the “Review the plan before anyone starts” table on what you have so far. Write down every red flag it finds in your draft.',
        'Pick the three sections you are least sure of (for example gates, metrics and exit criteria). Read the matching lesson again and note one concrete thing to change.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Shrink your plan to two weeks, one feature and four cards. Ask an AI assistant to read it as a project manager and tell you the one section most likely to fail.'] },
      { audience: { min: 'advanced' }, steps: ['Add a critical path and a review-capacity line to your plan (cards per week your reviewers can really read), and write the pull request description format that will serve as your review evidence.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'managing-ai-projects-p1',
    title: 'Put gates and rulebooks on a real repository',
    summary: 'Take a repository of your own (or a practice one) and give it a definition of done, a required check, a merge rule, an instructions file, a decision record and a pull request template. Then prove the gates work by trying to break them.',
    outcome: 'A repository where AI-written changes cannot merge without passing checks and a review, with the evidence that you tested it: proof you can set up the guardrails for an AI-assisted team.',
    unlockAfterDay: 4,
    steps: [
      { id: 'managing-ai-projects-p1-s1', text: 'Pick a repository you own (a scratch one is fine). Write docs/dod.md: a definition of done with 6 to 8 lines, each saying whether the pipeline or a person checks it, and at least one line for your riskiest data.' },
      { id: 'managing-ai-projects-p1-s2', text: 'Add a workflow in .github/workflows that runs your checks on pull requests into main (at least one real test). Turn on a branch rule or ruleset that requires the check and one approval.', link: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
      { id: 'managing-ai-projects-p1-s3', text: 'Write an AGENTS.md (or CLAUDE.md) under 30 lines with commands, 4 to 6 checkable rules and the report-back protocol; one decision record in the format from lesson 4; and a pull request template with a docs question.' },
      { id: 'managing-ai-projects-p1-s4', text: 'Prove the gates work: open a pull request that fails the check and show the merge is blocked; open a docs-only pull request and show it can still merge; ask an agent to make a failing test pass and record whether it edited the test.' },
      { id: 'managing-ai-projects-p1-s5', audience: { max: 'beginner' }, text: 'Use the Sulit Store workflow and AGENTS.md from the lessons as a starting point and change only the names and commands. Ask an AI assistant to explain each line back to you, and fix any line you cannot explain.' },
      { id: 'managing-ai-projects-p1-s6', audience: { min: 'advanced' }, text: 'Add a CODEOWNERS file covering .github/, the instructions file and your most sensitive folder, require code owner review, and add a CI check on change size. Document one flaky-test or skipped-check situation you hit and how you handled it.' },
    ],
    submission: {
      kind: 'url',
      label: 'Repository link',
      placeholder: 'https://github.com/you/your-repo',
      hint: 'A repository link that includes docs/dod.md, the workflow, AGENTS.md, a decision record and the pull request template, plus a short README section saying what you tried to break and what happened.',
    },
    rubric: [
      'The definition of done is specific, says who checks each line and covers the riskiest data',
      'A required check and a review rule really block a failing pull request, and the evidence is shown',
      'The instructions file has checkable rules, not vague advice, and stays short',
      'The decision record has context, options, a decision, consequences and a status',
      'The student tested the gates by trying to break them and reports what happened honestly',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Every line of the workflow and instructions file can be explained in the student’s own words'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The tests cover a real piece of logic (money, validation or permissions) with awkward inputs, not only a trivial check'] },
      { audience: { min: 'advanced' }, items: ['Code owners protect the files that steer agents and the gates themselves, and a size or flakiness policy is stated', 'The report separates what the gates prove from what they cannot catch'] },
    ],
  },
  {
    id: 'managing-ai-projects-p2',
    title: 'Run a multi-week AI-assisted project plan',
    summary: 'Write the full plan for a real or realistic project of four to six weeks, in the structure of the Sulit Store plan: brief, cut line, weekly gates, task cards, merge rules, conventions, metrics, risks, budgets, a client rhythm and exit criteria. Then write the first Friday’s metrics note.',
    outcome: 'A complete project plan with gates and a metrics note, the document a client or employer can read in five minutes to judge whether you can run AI-assisted work on time and honestly.',
    unlockAfterDay: 7,
    steps: [
      { id: 'managing-ai-projects-p2-s1', text: 'Write the brief (client, problem, goal, in, out, constraints, dates, team) and the cut line: the three things you would drop first if time ran short.' },
      { id: 'managing-ai-projects-p2-s2', text: 'Write the weekly plan: for each week the outcome and the gate that proves it. Write the task cards for weeks 1 and 2 (at least 8): outcome, needs, files it may touch, a check that can fail, reviewer, size cap.' },
      { id: 'managing-ai-projects-p2-s3', text: 'Write the gates section: your definition of done, the merge rule on main, the CI checks, and which files need a code owner. Add the conventions and documents you will keep in the repository (instructions file, templates, shared prompt, decision records).' },
      { id: 'managing-ai-projects-p2-s4', text: 'Write the risk register (six risks, at least three AI-specific), the three budgets with a stop rule each, and the pilot exit criteria for releasing to real users.' },
      { id: 'managing-ai-projects-p2-s5', text: 'Write the metrics section and a metrics note for the first Friday with real numbers (or clearly labelled invented ones) for at least 6 cards: median, range, sample size, what it does not show, and the decision it supports.' },
      { id: 'managing-ai-projects-p2-s6', text: 'Write one client update in the template’s format with dates as ranges, then run the “Review the plan before anyone starts” table over the whole plan and fix every red flag you find.' },
      { id: 'managing-ai-projects-p2-s7', audience: { max: 'beginner' }, text: 'A two-week plan with one feature, four to six task cards and one gate is enough, as long as every section is present. Ask an AI assistant to review your plan as a project manager and list its three biggest worries.' },
      { id: 'managing-ai-projects-p2-s8', audience: { min: 'intermediate' }, text: 'Make at least one card involve an API, a database or sign-in, and write its check as a test that can fail. Say which gate would catch a mistake in it.' },
      { id: 'managing-ai-projects-p2-s9', audience: { min: 'advanced' }, text: 'Base the plan on an existing codebase: name the modules and owners involved, mark the critical path and the review capacity per week, and say how you would measure whether the plan is working after week 1.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your project plan',
      placeholder: 'Paste your plan: brief, weeks and gates, task cards for weeks 1 and 2, merge rules, risks, budgets, metrics note, client update',
      hint: 'One document with every section of the Sulit Store plan, task cards for the first two weeks, a metrics note, and a short list of the red flags you found and fixed when you reviewed it.',
    },
    rubric: [
      'Every week ends in something a person can check, with a named gate',
      'Task cards have one outcome, a size cap, a check that can fail and a reviewer',
      'Gates are enforced by merge rules and checks, not just described',
      'The risk register has early warnings, responses and owners, and the budgets have stop rules',
      'The metrics note uses honest measures, states its sample size and what it does not show',
      'The client update and exit criteria give dates as ranges and conditions, with no speed promises',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The plan is small but complete: every section exists, and the student can explain why each is there'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['At least one card uses an API, database or sign-in, with a check that can fail'] },
      { audience: { min: 'advanced' }, items: ['The plan accounts for an existing codebase, a critical path, review capacity and a rollback plan', 'Evidence of verification (checks run, what was not checked, reviewer notes) is part of the pull request process'] },
      { audience: { min: 'professional' }, items: ['The plan includes an agent-assisted workflow with golden task cards, review evidence and a policy for which changes an agent may take end to end'] },
    ],
  },
];

export const managingAiProjectsCourse: Course = {
  id: 'managing-ai-projects',
  kind: 'standard',
  title: 'Managing Complex AI Development Projects',
  level: 'advanced',
  tagline: 'Plan, gate, document and measure a multi-week project where AI does much of the building.',
  description: 'Running a real project with agents is different from prompting well. You will break work into pieces agents can finish and people can review, put quality gates and documentation in the repository, keep a team consistent, measure productivity without fooling yourself, and manage risk, cost and what you promise a client.',
  finishLine: [
    'A multi-week project plan with task cards, quality gates and a definition of done',
    'An instructions file, a decision record and a merge-rule setup you can reuse on a real repository',
    'A metrics note that reports what AI-assisted work really changed, and what it cannot show',
  ],
  objectives: [
    'Break a multi-week scope into agent-sized task cards that a person can review',
    'Design quality gates and merge rules that catch AI mistakes before they ship',
    'Keep documentation and team conventions in the repository so people and agents share them',
    'Measure delivery speed and stability honestly without vanity numbers',
    'Manage project risk, agent cost and client expectations with a written plan',
  ],
  audiences: ['experienced-dev', 'builder', 'career-changer'],
  skills: [
    { id: 'ai-project-shift', label: 'How AI changes a project' },
    { id: 'task-breakdown', label: 'Task breakdown' },
    { id: 'quality-gates', label: 'Quality gates' },
    { id: 'project-docs', label: 'Project documentation' },
    { id: 'team-conventions', label: 'Team conventions' },
    { id: 'honest-metrics', label: 'Honest metrics' },
    { id: 'risk-cost-expectations', label: 'Risk, cost and expectations' },
    { id: 'project-planning', label: 'Project planning' },
  ],
  lessons,
  projects,
  icon: 'assignment',
  updated: '2026-11-14',
};
