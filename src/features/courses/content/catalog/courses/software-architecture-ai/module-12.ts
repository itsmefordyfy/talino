import type { Lesson, Project } from '../../../types';

// Module 12: Production Architecture and Architecture Review (lessons 42 to 44, then Project 3). Written 2026-11-18.
// No product facts are stated, so there are no version notes. TindaTrack, Rina, Marco, the stores, the files, the drills and every figure are invented.
// Demos ("AI in Action") are hand-written illustrations, never real model output. The code blocks are short and illustrative: the app does not run them.

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-42',
    day: 42,
    title: 'Production Readiness and Running an Architecture Review',
    summary: 'Check a system with evidence before it carries real users, and run a review that ends in a decision with owners.',
    intro: {
      objectives: [
        'Walk a system through a production readiness checklist and attach evidence to every answer',
        'Treat an unknown as a named risk with an owner, not as a pass',
        'Run an architecture review with clear roles, questions and one of four outcomes',
        'Use an AI assistant to prepare review questions without letting it sign off',
      ],
      why: 'Most launch-day failures are not missing features. They are things nobody checked: a backup never restored, an alert nobody tested, a dependency with no plan. A readiness review finds them while they are cheap.',
    },
    minutes: 26,
    skills: ['arch-production'],
    body: [
      { type: 'paragraph', text: "A system can be feature complete and still not be ready for production. Ready means that when something goes wrong, the people who run it will know quickly, can limit the damage, and can put things right. Features answer “does it work?”. Readiness answers “what happens on a bad day, and will we notice?”. This lesson gives you a checklist to find out and a way to run an architecture review so that the answers become decisions." },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: "TindaTrack is about to launch for a chain of forty stores. Rina’s small team has finished every planned feature and the tests pass. On the Tuesday after launch the database disk fills up, because receipt photos were never given a retention rule. No alert fires. Stores cannot save sales for most of a day and go back to paper notebooks." },
      { type: 'paragraph', text: "The team reaches for the backups and finds a second problem. The backups exist, but nobody has ever restored one. The first attempt fails because the backup’s encryption key is only on a laptop that is at home. Nobody knows how long a full restore would take, so nobody can tell the stores when they will be back. Each gap was small. None of them appeared in a feature list, and a one-hour review before launch would have found all three." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "A **production readiness review** is a structured check, done before launch and again after large changes. The idea is simple: for each area that can hurt you, ask a question and demand evidence. An analogy, only an analogy: before a restaurant opens, an inspector does not ask whether the cook can cook. They check the exits, the fire extinguisher and the fridge temperature. They want to see them work." },
      {
        type: 'table',
        headers: ['Area', 'The question', 'Evidence that answers it'],
        rows: [
          ['Targets', 'Are the quality targets measured, and met?', 'A test or a measurement for each target from the requirements'],
          ['Deploy and rollback', 'Can we release and undo a release safely?', 'A rollback rehearsed on a test environment'],
          ['Observability', 'Will we know when it is broken before the customers do?', 'An alert that fired in a test, a dashboard, logs that find one failed sale'],
          ['Data protection', 'Can we restore our data, and how long does it take?', 'A restore drill with the time written down, and the keys located'],
          ['Security', 'Are the known threats handled?', 'The threat model reviewed, tenant isolation tests, secrets out of the code'],
          ['Capacity', 'What runs out first, and do we get warned?', 'A load experiment and an alert on disk, memory or connections'],
          ['Dependencies', 'What happens when the e-wallet provider or text service is down?', 'A failure drill and a timeout setting'],
          ['Operations', 'Who gets called, and what do they do?', 'A named on-call person and a short runbook for the three likeliest failures'],
          ['Cost and docs', 'Does someone watch spend, and are the diagrams and ADRs current?', 'A spend alert with an owner, and diagrams that match the system'],
        ],
        caption: 'A starting checklist. Every row ends in evidence you could show a reviewer, not in “we think so”.',
      },
      { type: 'paragraph', text: "Two rules make the checklist useful. First, **an answer without evidence is an unknown, and an unknown is a risk.** Write it down with an owner. Second, **readiness is a decision, not a stamp.** The honest outcomes are “ready”, “ready with these named risks accepted by this person” and “not yet”. A launch with a known, accepted risk is fine. A launch with a hidden one is not." },
      { type: 'code', language: 'yaml', label: 'One checklist entry (illustrative)', code: `area: data protection
question: Can we restore last night's backup into a clean database?
evidence: restore drill on a test server; sale counts matched; elapsed time written in the runbook
owner: Rina
status: ready            # ready | accepted-risk | not-ready
risk_if_wrong: stores cannot record sales until the restore finishes
revisit: after any change to the backup tool or the encryption key` },
      { type: 'paragraph', text: "An **architecture review** is a meeting that turns the design and the checklist into a decision. The roles matter more than the room:" },
      {
        type: 'list',
        items: [
          "**Author:** presents the design, the options they rejected and the open questions. They are there to explain, not to defend.",
          "**Reviewers:** two or three people, with at least one from outside the team and one who thinks about operations or security. They read the material in advance and bring written questions.",
          "**Facilitator:** keeps the discussion on decisions and on time, and stops it from becoming a debate about style.",
          "**Scribe:** writes down the questions, the answers and the actions.",
          "**Decision owner:** one named person who chooses the outcome.",
        ],
      },
      { type: 'paragraph', text: "Good review questions are about failure and cost of change: “What happens when this fails?”, “Which requirement does this serve?”, “What did you reject, and why?”, “How hard is this to change in a year?”, “What would make you revisit it?”. Ask to see evidence, not to hear reassurance. The outcome is one of four: approve; approve with conditions (each with an owner and a date); revise and review again; or reject with reasons. Afterwards, update the ADRs and the risk list, so the review leaves a record. Review the design, never the person. If people fear blame, they will hide problems, which is the opposite of the point." },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Author sends design, ADRs and diagrams] --> B[Reviewers read and write questions]
  B --> C[Review meeting with a facilitator]
  C --> D{Outcome}
  D -->|approve| E[Record the decision in an ADR]
  D -->|approve with conditions| F[Owner and date for each condition]
  D -->|revise| G[Author revises and asks again]
  F --> E
  G --> A`,
        caption: 'Look at the outcomes under the diamond. “Approve with conditions” is not a soft yes: each condition needs an owner and a date, or it is forgotten.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: a readiness review is a walk through the app asking “what if it breaks?” Imagine you are about to lend your car to a friend. You would check the fuel, the spare tyre and whether the brake lights work. You would not only check that the radio plays. Evidence means you actually try it: you press the brake and look at the light. An architecture review is the same walk done together by a few people, so that one person’s blind spot is covered by another’s. At the end somebody decides, and the decision is written down." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "In larger organisations readiness reviews are tiered by risk: a low-risk internal tool gets a short checklist, while a payment or health system gets deeper evidence and independent reviewers. Beware rubber stamps. A checklist that never finds anything is either too easy or ignored, so prune items that have never produced a finding and add the ones your incidents taught you. Link the review to reliability targets: if the service has already used up the error allowance it promised, that is a reason to delay a risky launch. Run game days for the likeliest failures, because a runbook nobody has used is a hypothesis. Keep reviewers independent from the author’s reporting line when you can, or findings get softened." },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you have shipped a small app, you know the feeling of the first real user. Production readiness is the habit of asking before launch what happens when something fails, who finds out, how you recover and what you can no longer change quickly, then recording the answers where the next developer can read them.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant runs a readiness review',
        prompt: "Here is TindaTrack's design document. Run a production readiness review and tell me whether we are ready to launch to forty stores.",
        output: "Production readiness review: TindaTrack\n- Targets: Ready. Load tested to 10x expected traffic.\n- Rollback: Ready.\n- Observability: Ready. Alerts configured for all critical paths.\n- Data protection: Ready. Backups verified.\n- Security: Compliant with industry standards.\n- Dependencies: Ready.\nOverall: Ready for launch. Confidence: 95%.",
        notice: "Compare every line with the document you pasted. It never mentions a load test, a rollback rehearsal or a backup restore, yet each row says Ready, and “10x” and “95%” have no source. “Compliant with industry standards” is a legal-sounding claim that no review of a document can make. An assistant cannot see your production system, so it can only tell you what the document says and what it leaves out. Use it to list questions and missing evidence, never to say ready.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Write the evidence you really have for each area first, even if it is “none”. Then ask an assistant to find the holes. If you let it grade you, it will be generous." },
      {
        type: 'prompt',
        label: 'Find the gaps in my readiness evidence',
        text: "I am preparing a production readiness review for [your system]. For each area below I list the evidence I actually have, or \"none\".\n\nTargets: [evidence]\nDeploy and rollback: [evidence]\nObservability: [evidence]\nData protection: [evidence]\nSecurity: [evidence]\nCapacity: [evidence]\nDependencies: [evidence]\nOperations: [evidence]\n\nDo not say whether we are ready. For each area:\n1. Say whether my evidence would convince a sceptical reviewer, and why or why not.\n2. List the one question a reviewer is most likely to ask.\n3. Mark anything I wrote that is a claim without evidence.\nFinish with the assumptions you made and what you cannot know about my system.",
      },
      { type: 'paragraph', text: "Check the answer against reality. For each gap the assistant names, can you design a cheap piece of evidence, such as a restore drill or a test alert? For each area it calls fine, would you bet on it? Remember that it has not seen your system, and a human decides." },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          "Copy the checklist table for your own system and fill in the evidence column honestly. Mark every blank as an unknown with an owner.",
          "Schedule one drill this week: restore a backup to a clean test environment and write down how long it took.",
          "Plan a short architecture review with the five roles for your next design, and send the material in advance.",
          "Read lesson 43 next, to keep what you decided from drifting after the review.",
        ],
      },
      {
        type: 'takeaways',
        items: [
          "Ready means you will notice a failure, limit it and recover. It is not the same as feature complete.",
          "Ask a question for each area and demand evidence. An answer without evidence is an unknown, and an unknown is a risk with an owner.",
          "Readiness ends in a decision: ready, ready with named accepted risks, or not yet.",
          "An architecture review needs an author, reviewers, a facilitator, a scribe and one decision owner, and it ends in one of four outcomes.",
          "An assistant can prepare questions and find gaps. It cannot see your production system and it cannot sign off.",
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-42-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Run an architecture review',
          prompt: 'Build the order of an architecture review that ends in a recorded decision. Leave out the steps that break it.',
          concept: 'architecture review',
          situation: "Rina’s team must review TindaTrack’s design before the launch to forty stores. She wants reviewers who come prepared, a decision that someone owns, and a record afterwards. She is allowed to use an AI assistant to prepare, not to decide.",
          parts: [
            { id: 'share-material', lane: 'input', label: 'Author sends the design, ADRs and diagrams in advance', detail: 'Reviewers receive everything before the meeting.' },
            { id: 'read-questions', lane: 'human', label: 'Reviewers read and write their questions', detail: 'Each reviewer brings written questions on failure and cost of change.' },
            { id: 'ai-questions', lane: 'ai', label: 'Use an assistant to draft extra questions and spot missing sections', detail: 'The output is a list of prompts for humans, not findings.' },
            { id: 'meeting', lane: 'human', label: 'Hold the review with a facilitator and a scribe', detail: 'Discuss failure, evidence and rejected options.' },
            { id: 'decide', lane: 'human', label: 'The decision owner picks an outcome with owners and dates', detail: 'Approve, approve with conditions, revise, or reject.' },
            { id: 'record', lane: 'output', label: 'Record the decision in the ADRs and the risk list', detail: 'The outcome and every condition are written down.' },
            { id: 'ai-signoff', lane: 'ai', label: 'Ask the assistant to say whether the system is ready', detail: 'Treat the assistant’s verdict as the review result.' },
            { id: 'blame-first', lane: 'human', label: 'Start by asking who made each risky decision', detail: 'Find the person responsible for each problem.' },
            { id: 'skip-evidence', lane: 'human', label: 'Accept “we think it works” and move on', detail: 'Do not ask to see evidence, to save time.' },
          ],
          rules: [
            { id: 'r-core', kind: 'require', parts: ['share-material', 'read-questions', 'meeting', 'decide', 'record'], message: 'A review needs the material shared, prepared reviewers, a meeting, a decision and a record.' },
            { id: 'r-bad', kind: 'forbid', parts: ['ai-signoff', 'blame-first', 'skip-evidence'], message: 'An assistant cannot see your production system, blaming people hides problems, and accepting claims without evidence defeats the point of a review.' },
            { id: 'r-1', kind: 'before', parts: ['share-material', 'read-questions'], message: 'Reviewers cannot prepare before they have the material.' },
            { id: 'r-2', kind: 'before', parts: ['read-questions', 'meeting'], message: 'Questions are written before the meeting so it is spent on the answers.' },
            { id: 'r-3', kind: 'before', parts: ['meeting', 'decide'], message: 'The decision follows the discussion.' },
            { id: 'r-4', kind: 'before', parts: ['decide', 'record'], message: 'There is nothing to record until a decision is made.' },
          ],
          solution: ['share-material', 'read-questions', 'ai-questions', 'meeting', 'decide', 'record'],
          minSteps: 5,
          maxSteps: 7,
          hints: [
            'Reviewers need the material before they can prepare, and they prepare before the meeting.',
            'A decision comes after the discussion, and the record comes after the decision.',
            'An assistant can help prepare questions, but it cannot give the verdict. Leave out the three steps that remove evidence or accountability.',
          ],
          explanation: 'The review runs: material in advance, prepared questions (with optional help from an assistant), a facilitated meeting, a decision by one owner and a written record. Verdicts from an assistant, blame and unsupported claims all weaken the evidence the review exists to collect.',
          simulation: {
            input: 'Design review before the launch to forty stores.',
            steps: {
              'share-material': 'Rina sends the design, five ADRs and the container diagram two working days ahead.',
              'read-questions': 'A security-minded reviewer and an operations reviewer each write questions about backups and tenant filters.',
              'ai-questions': 'An assistant lists extra questions and notes that the document has no rollback section. Reviewers decide which matter.',
              'meeting': 'The facilitator keeps to decisions. The restore drill has no evidence yet.',
              'decide': 'The decision owner approves with two conditions: a restore drill and a disk alert, each with an owner and a date.',
              'record': 'The scribe adds both conditions to the risk list and updates ADR-006.',
            },
            output: 'An approve-with-conditions decision, two owned actions and updated ADRs.',
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-42-scenario-1',
          kind: 'scenario',
          title: '“We are ready”',
          prompt: 'Choose the best response from the reviewer.',
          concept: 'readiness evidence',
          situation: "Two days before launch, the TindaTrack team tells the reviewer: “All features are done, all tests pass, and we backed up the database last night. We are ready.” The reviewer has not seen a restore, a rollback or an alert fire.",
          options: [
            { text: 'Ask for evidence per area: a restore drill with its time, a rehearsed rollback, a test alert. Write any missing item down as an unknown with an owner, and decide on that basis.', consequence: 'Two gaps appear, the keys and the disk alert. Both get owners and dates, and the launch goes ahead with the risks named.', quality: 'best' },
            { text: 'Accept the statement because the team knows the system better than the reviewer.', consequence: 'The first restore happens during an outage and fails.', quality: 'poor' },
            { text: 'Delay the launch until every area has perfect evidence, whatever it takes.', consequence: 'The team is safe but the launch slips for items that carry little risk. The decision is not tied to what could actually hurt.', quality: 'acceptable' },
            { text: 'Ask an assistant to check the design document and trust its “ready” verdict.', consequence: 'The verdict is based on a document and not on the running system, so none of the real gaps are found.', quality: 'poor' },
          ],
          hints: [
            'A backup that has never been restored is a belief.',
            'Look for the option that asks for evidence and records what is missing.',
            'Readiness can include named, accepted risks. It does not require perfection.',
          ],
          explanation: 'Evidence per area, with unknowns written down and owned, lets the launch go ahead on honest terms. Trusting the statement or an assistant’s verdict hides the gaps, and a blanket delay is not tied to risk.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-42-match-1',
          kind: 'match',
          title: 'Which evidence supports the claim?',
          prompt: 'Match each claim from a team to the evidence that would actually support it.',
          concept: 'readiness evidence',
          labels: { terms: 'Claim', meanings: 'Evidence that supports it' },
          pairs: [
            { term: '“Our backups work.”', definition: 'A restore into a clean database, with the time written down and the sale counts checked', note: 'Only a restore shows that a backup is usable and how long it takes.' },
            { term: '“We can roll back a bad release.”', definition: 'A rollback rehearsed on a test environment, including what happens to the database', note: 'A plan nobody has tried is a hope, and database changes are the usual trap.' },
            { term: '“We would know if the payment webhook stopped.”', definition: 'An alert that fired in a test when the webhook was switched off', note: 'An alert that has never fired may not work at all.' },
          ],
          hints: [
            'Evidence is something you did, not something you believe.',
            'Each claim has a “try it” version: restore, roll back, switch off.',
            'Match the claim to the drill that would prove it.',
          ],
          explanation: 'Each claim is only as strong as a drill that tested it. Restores, rehearsed rollbacks and fired alerts are evidence, and statements of confidence are not.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-42-q1',
        prompt: "TindaTrack’s team says the backups are fine because the backup job reports success every night. What does a reviewer ask for?",
        choices: [
          'A written promise from the team lead that the backups are monitored by the cloud provider and checked often',
          'A restore of the latest backup into a clean database, with the elapsed time and the keys located',
          'A bigger disk for the database server, so that there is plenty of room for more backups later on in the year',
          'A second backup job that runs in the afternoon as well, so there are twice as many copies to choose from',
        ],
        answer: 1,
        explanation: 'A successful job proves that a file was written, not that it can be restored. The restore drill is the evidence, and it also reveals the time and the missing keys.',
      },
      {
        id: 'software-architecture-ai-42-q2',
        prompt: "A checklist item has no evidence yet. Which treatment fits this lesson?",
        choices: [
          'Mark it green anyway, since the team is experienced and nothing has failed in this system before now',
          'Remove it from the checklist, because an item with no evidence cannot be answered by the team anyway',
          'Hold the launch indefinitely until the item has become a drill with a perfect result every time',
          'Record it as an unknown risk with an owner, and decide whether to accept it or fix it first',
        ],
        answer: 3,
        explanation: 'An unknown is a risk. Naming it and giving it an owner lets the decision owner accept it or fix it knowingly. Marking it green hides it, removing it forgets it, and an indefinite hold is not proportionate.',
      },
      {
        id: 'software-architecture-ai-42-q3',
        prompt: "In a review, the facilitator notices the meeting has become a debate about code style. What is the facilitator’s job?",
        choices: [
          'Bring the talk back to decisions, failure modes and evidence, and park the style question',
          'End the review early, because style debates show that the design is not ready to be discussed at all',
          'Let the debate run, since style is the easiest topic on which every reviewer has a strong opinion',
          'Ask the decision owner to settle the style question on the spot and then move on to the next topic',
        ],
        answer: 0,
        explanation: 'The facilitator protects the meeting’s purpose: decisions about failure and cost of change. Style belongs in code review or a team guide, not in an architecture review.',
      },
      {
        id: 'software-architecture-ai-42-q4',
        prompt: "An assistant’s readiness report says “Backups verified” and “Load tested to 10x”, but your document mentions neither. What do you do?",
        choices: [
          'Use the figures in your own report, since they came from a tool that has read the whole document',
          'Treat both lines as invented, remove them, and plan the drill and the experiment yourself',
          'Keep the lines but add the word “estimated” next to them so that readers know they are not exact',
          'Ask the assistant to confirm them, and accept the claim if it repeats the same numbers a second time',
        ],
        answer: 1,
        explanation: 'The document does not support those lines, so they are invented. Asking again does not create evidence. The fix is to do the drill and the experiment and record real results.',
      },
      {
        id: 'software-architecture-ai-42-q5',
        audience: { max: 'beginner' },
        prompt: "What does “evidence” mean in a readiness review?",
        choices: [
          'A strong opinion from the most senior person on the team, given with confidence in the review meeting',
          'A long document that describes in detail how the system is supposed to work in normal conditions',
          'Something you actually tried, such as restoring a backup, and the result you wrote down',
          'A promise from the team that they will fix any problem quickly once it happens in production',
        ],
        answer: 2,
        explanation: 'Evidence is the result of trying the thing. Opinions, descriptions and promises are claims, not proof.',
      },
      {
        id: 'software-architecture-ai-42-q6',
        audience: { min: 'advanced' },
        prompt: "Your readiness checklist has 40 items, and in a year it has never produced a finding. What is the most useful change?",
        choices: [
          'Make the checklist longer, because more items must mean more findings in the end for the team',
          'Keep it exactly as it is, since a clean record over a whole year shows the system is well run',
          'Prune items that never found anything and add items from your incidents and near misses',
          'Hand the checklist to the author team so that they can review their own system much faster',
        ],
        answer: 2,
        explanation: 'A checklist that never finds anything is probably too easy or ignored. Pruning dead items and adding what real incidents taught you keeps it sharp. Self-review also removes independence.',
      },
    ],
    task: {
      title: 'Run a mini readiness review on your own system',
      minutes: 20,
      steps: [
        'Copy the readiness table and write one line of evidence for each area of your own system (or TindaTrack), writing “none” where you have none.',
        'Turn each “none” into an unknown risk: name an owner, say what would go wrong, and decide whether to accept it or fix it before launch.',
        'Write down the five review roles and who would play them for your system, including one reviewer from outside your team.',
        'Run the prompt from this lesson, mark which gaps the assistant found that you had missed, and which of its remarks you reject.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Pick an app you use every day. Write three “what if it breaks?” questions about it and, for each, one thing you would try to prove the answer.'] },
      { audience: { min: 'advanced' }, steps: ['Design a tiered readiness process for three kinds of system in your company: an internal tool, a customer app and a payment path. State which evidence is mandatory at each tier, who reviews, and which findings block a launch.'] },
    ],
  },
  {
    id: 'software-architecture-ai-43',
    day: 43,
    title: 'Technical Debt, Architectural Drift and Evolving a System',
    summary: 'Record debt on purpose, catch drift with automatic checks, and evolve a system with the Strangler Fig instead of a rewrite.',
    intro: {
      objectives: [
        'Tell deliberate from accidental technical debt, and record a debt item with its cost and its trigger',
        'Explain architectural drift and write a fitness function that detects one kind of it',
        'Plan a gradual change with the Strangler Fig, and say when a rewrite is the wrong answer',
        'Write a revisit trigger into an ADR so a decision is reconsidered on evidence',
      ],
      why: 'Every system that lives long enough drifts from its design and carries shortcuts. Teams that record both can choose what to repay. Teams that do not meet them as a slow-down they cannot explain.',
    },
    minutes: 26,
    skills: ['arch-production'],
    body: [
      { type: 'paragraph', text: "A design is a snapshot. The system keeps changing after the snapshot is taken, and each change is small, sensible and quick. Months later the code is not quite what the diagrams show, and some shortcuts have become permanent. This lesson names those two things (technical debt and architectural drift), shows how to keep them visible, and explains how to change a living system without stopping it." },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: "Eighteen months in, TindaTrack features take noticeably longer to ship. Rina and Marco list why. Reports still read inventory’s tables directly, a leftover from lesson 41’s example. A “temporary” fee table for the e-wallet provider is hard-coded in three places. Two modules import each other, so neither can change alone. Some of this was chosen on purpose to make a launch. Some of it arrived in agent-written code that nobody questioned, because it worked." },
      { type: 'paragraph', text: "Marco proposes a rewrite as microservices. Rina asks one question: “Which of these costs us time every week?” They find that the payments fee table and the circular import slow almost every change, while the reports shortcut hurts rarely. They write all of them down, repay the two expensive ones first, and move payments out piece by piece. The rest waits, with an owner and a trigger. A rewrite would have stopped feature work for months and re-created today’s bugs." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "**Technical debt** is a shortcut or compromise that makes today cheaper and tomorrow dearer. The analogy is a loan: you get something now and pay interest later, in the form of slower changes and more bugs. Two kinds are worth telling apart. **Deliberate debt** is chosen knowingly: “we will hard-code the fee table to make the launch, and replace it next quarter.” It can be a good decision if it is recorded and has a plan. **Accidental debt** is discovered later: a design that was reasonable turned out to be wrong, or code was accepted without anyone understanding it. Unrecorded debt of either kind is the real problem, because nobody can decide about what nobody can see." },
      { type: 'paragraph', text: "Keep a **debt register**: a short list where each item says what it is, why it was taken, what it costs now (the interest), what would trigger repaying it, and who owns it. Prioritise by interest, not by how ugly the code looks. Repay in small steps, attached to the feature work that touches the same area. Do not hide a repayment inside a promise to fix everything next quarter." },
      { type: 'code', language: 'yaml', label: 'A debt register entry (illustrative)', code: `id: DEBT-007
what: wallet provider fee table is hard-coded in three files
why_taken: deliberate, to meet the launch date (decision recorded in ADR-004)
interest: every fee change needs three edits, and one was missed once
trigger_to_repay: the provider changes its fees again, or the payments module is next touched
owner: Marco
linked: ADR-004, DEBT-003` },
      { type: 'paragraph', text: "**Architectural drift** is the gap between the architecture as designed (the diagrams and ADRs) and as built (the code). It grows from shortcuts, from agent-written code that follows common patterns instead of your decisions, from decisions that were never written down, and from people leaving. You find it by comparing the two, and you can stop it by checking automatically. A **fitness function** is an automatic check that an architectural property still holds: a boundary is respected, modules do not depend on each other in a circle, a response time stays within its target in a scheduled test. Lesson 41’s import checks are fitness functions. Here is one for circular dependencies:" },
      { type: 'code', language: 'typescript', label: 'A fitness function: no circular module dependencies (illustrative)', code: `type Graph = Record<string, string[]>; // module name -> modules it imports

export function findCycle(graph: Graph): string[] | null {
  const visiting = new Set<string>();
  const finished = new Set<string>();

  function visit(node: string, path: string[]): string[] | null {
    if (visiting.has(node)) return [...path.slice(path.indexOf(node)), node];
    if (finished.has(node)) return null;
    visiting.add(node);
    for (const next of graph[node] ?? []) {
      const cycle = visit(next, [...path, node]);
      if (cycle) return cycle;
    }
    visiting.delete(node);
    finished.add(node);
    return null;
  }

  for (const node of Object.keys(graph)) {
    const cycle = visit(node, []);
    if (cycle) return cycle;
  }
  return null;
}

// readModuleGraph is assumed: it reads the imports of each module folder.
test('modules have no circular dependencies', () => {
  expect(findCycle(readModuleGraph('src'))).toBeNull();
});` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Design: diagrams and ADRs] --> B[Code changes by people and agents]
  B --> C[Fitness functions run in CI]
  C --> D{Still matches the design?}
  D -->|yes| E[Keep going]
  D -->|no| F{Which one is wrong?}
  F -->|the code| G[Fix the code]
  F -->|the design| H[Write a new ADR]`,
        caption: 'Look at the second diamond. Drift is not always a code problem. Sometimes the design is out of date, and the honest fix is a new ADR.',
      },
      { type: 'paragraph', text: "**Evolving a system** means changing it in steps while it keeps running. The tool is the Strangler Fig, which you met in lesson 12: put a thin layer (a router or a facade) in front of the old part, build the replacement beside it, move traffic over a slice at a time, and remove the old part when nothing uses it. Each step is small and can be undone. A **rewrite** replaces everything at once. It stops feature work, re-creates old bugs the old code had quietly fixed, and delivers nothing until the end. It can be the right call when the old system is truly unmaintainable and small, but it is the expensive option, so it needs evidence." },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  C[Store apps] --> R{Router in front of payments}
  R -->|most stores| O[Old payments code]
  R -->|a few stores first| N[New payments module]
  O --> D[(Database)]
  N --> D`,
        caption: 'The router decides who gets the new module. Start with a few stores, widen as the checks stay green, then delete the old code.',
      },
      { type: 'paragraph', text: "Finally, **know when to revisit a decision**. Write the trigger into the ADR when you make the decision: “Revisit if one database can no longer hold the report load measured in a load experiment”, or “revisit if a second team needs to deploy payments on its own”. Review the ADRs on a schedule. When a decision changes, write a new ADR that supersedes the old one and leave the old one in place, so the history stays honest." },
      { type: 'visual', id: 'arch-adr-builder', caption: 'Use the ADR builder to write a decision with a “revisit if” line, or to supersede an earlier one.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: technical debt is like borrowing money to buy something today. You get it now, but you pay interest, so the next purchase costs more. Borrowing on purpose is fine if you write down the loan. The danger is the loan you forgot. Drift is when a house slowly stops matching its plan because small repairs were done without updating the drawing. The Strangler Fig is how you renovate a house you still live in: one room at a time, with the door open to the old room until the new one is ready, instead of tearing it all down and living in a tent." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "At scale, debt is a portfolio, not a list. Rank by interest paid per unit time and by whether the item blocks the roadmap, and give each item a trigger and an owner so it does not rot. Agents change the picture: they generate plausible debt faster than people notice it, so add checks that catch pattern drift (a duplicated fee table, a second way to do the same thing) alongside boundary checks, and make fitness functions part of the pipeline. Strangler migrations carry their own failure mode: the old and new paths coexist for too long, so set an exit date and a metric (the share of traffic on the new path) and report it. Data is the hardest part. Plan dual writes or a one-way sync carefully, and decide in advance which side is the source of truth." },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant sizes up technical debt',
        prompt: "Our codebase has a lot of technical debt. Give me a debt score and a plan to get rid of it.",
        output: "Technical debt score: 73/100 (high).\nPlan:\n1. Rewrite the system as microservices over six months.\n2. Migrate to a modern framework.\n3. Introduce a service mesh and event streaming.\nExpected result: delivery speed up by 40% and defects down by 60%.",
        notice: "Look at what the assistant could not know. It has seen no code, so the score, “40%” and “60%” have no source, and a single debt score is not a thing you can measure well. The plan is a big-bang rewrite into microservices, which nobody asked for and which stops feature work. It never asks which debt costs you time, who owns it, or what triggers repayment. A better request asks it to turn your own list into register entries and to ask you about interest and triggers.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "List five shortcuts or oddities in a system you know, with what each costs you each week. Rank them yourself first. Then ask an assistant to challenge the ranking." },
      {
        type: 'prompt',
        label: 'Challenge my debt ranking',
        text: "Here are five technical debt items in [your system], with what each one costs us in time or risk, and my ranking from most to least urgent:\n\n[your items, costs and ranking]\n\nDo not give a score and do not propose a rewrite.\n1. For each item, say what you would need to know to rank it better.\n2. Point out any item whose cost I described without evidence.\n3. Suggest a trigger to repay each item that I could check, and an owner type.\n4. Say whether any item looks like drift from a decision I made (name the decision) instead of debt I chose.\n5. List your assumptions and what you cannot know about my system.",
      },
      { type: 'paragraph', text: "Verify the answer. Did it invent costs or figures? Does each suggested trigger refer to something you could actually observe? Does the order match the interest you pay each week? You make the final ranking." },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          "Start a debt register for a system you work on, with five entries that each have a cost, a trigger and an owner.",
          "Pick one boundary or dependency rule from your design and turn it into a check that runs in CI, so drift is caught on the day it happens.",
          "Add a “revisit if” line to the three most important ADRs you have, and book a date to review them.",
          "Go to lesson 44 for the release and pipeline side of evolving a system safely.",
        ],
      },
      {
        type: 'takeaways',
        items: [
          "Technical debt is a shortcut that makes today cheaper and tomorrow dearer. Deliberate debt can be wise if it is recorded, and unrecorded debt is the problem.",
          "A debt register records what, why, the interest, the trigger and the owner. Repay what costs you most, in small steps.",
          "Drift is the gap between the design and the code. Fitness functions are automatic checks that keep a chosen property true.",
          "When drift is found, decide whether the code or the design is wrong, and write a new ADR if the design changed.",
          "Evolve with the Strangler Fig, one slice at a time. A rewrite stops delivery and needs real evidence. Put a revisit trigger in every ADR.",
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-43-scenario-1',
          kind: 'scenario',
          title: 'The rewrite proposal',
          prompt: 'Choose the best response to Marco’s proposal.',
          concept: 'evolving a system',
          situation: "Marco wants to stop feature work for a quarter and rewrite TindaTrack as microservices to “clear all the debt”. Rina has a list of eleven debt items. Two of them slow almost every change. The rest hurt rarely.",
          options: [
            { text: 'Record all eleven items with their interest, repay the two that cost time every week in small steps, and use the Strangler Fig for payments while features keep shipping.', consequence: 'Changes get faster within weeks. The rest of the register waits with triggers, and nothing stops.', quality: 'best' },
            { text: 'Approve the rewrite but ask for a monthly progress report.', consequence: 'Reports show progress while features stall and the old bugs return in the new code.', quality: 'poor' },
            { text: 'Ignore the debt until it causes an outage, since the app works today.', consequence: 'The weekly slow-down continues and the next feature takes longer again.', quality: 'poor' },
            { text: 'Repay the two expensive items now, but without recording the others, to save time.', consequence: 'Progress is real, but the other nine are forgotten and a new person re-discovers each one the hard way.', quality: 'acceptable' },
          ],
          hints: [
            'Which items charge interest every week, and which charge rarely?',
            'Look for the option that keeps shipping features while paying down what costs the most.',
            'Unrecorded debt is easy to forget, even when you repay some of it.',
          ],
          explanation: 'Repay by interest, record the rest, and change the system in steps. A rewrite stops delivery and brings back bugs, doing nothing leaves the interest running, and repaying without recording loses the knowledge of the rest.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-43-match-1',
          kind: 'match',
          title: 'Debt or drift?',
          prompt: 'Match each situation to what it is.',
          concept: 'debt and drift',
          labels: { terms: 'Situation', meanings: 'What it is' },
          pairs: [
            { term: 'The team hard-coded the fee table to hit the launch date, wrote it down in an ADR and planned to replace it.', definition: 'Deliberate technical debt, recorded with a plan', note: 'It was chosen on purpose and written down, which is what makes it manageable.' },
            { term: 'An agent added code that reads another module’s tables, and nobody noticed for months because it worked.', definition: 'Architectural drift away from a boundary decision', note: 'The ADR said modules use each other’s public interface, but the code no longer does.' },
            { term: 'A design decided two years ago assumed one store per owner, and the real users own several.', definition: 'Accidental debt: the assumption turned out to be wrong', note: 'Nobody chose a shortcut. The world differed from the assumption.' },
          ],
          hints: [
            'Ask whether the shortcut was chosen knowingly, or discovered later.',
            'One situation breaks a written decision without anyone choosing to.',
            'One situation is a good decision that stopped fitting reality.',
          ],
          explanation: 'Deliberate debt is a recorded choice. Drift is code moving away from a written decision. Accidental debt is an assumption that proved wrong.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-43-arrange-1',
          kind: 'arrange',
          language: 'text',
          title: 'Strangle the old payments code',
          prompt: 'Put the steps of a Strangler Fig change to the payments module in a safe order.',
          concept: 'Strangler Fig',
          solution: [
            'Put a router in front of the payments code',
            'Build the new payments module beside the old one',
            'Send a few stores to the new module and watch the checks',
            'Widen to more stores while the checks stay green',
            'Move the last stores over',
            'Delete the old payments code',
          ],
          reasons: [
            'The router is what lets you choose who goes where, so it comes first.',
            'The old code keeps working while the new one is built.',
            'A few stores limit the damage if the new module is wrong.',
            'Each widening is a small, reversible step.',
            'The old path is only empty once the last stores have moved.',
            'Deleting is last, when nothing uses the old code.',
          ],
          hints: [
            'You need a way to choose who uses the new code before it exists.',
            'Start small and widen only while everything stays healthy.',
            'Delete the old code only when it has no users.',
          ],
          explanation: 'The router enables the gradual move. The new module is built beside the old one, taken by a few stores and then more, and the old code is removed when it has no traffic left.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-43-q1',
        prompt: "TindaTrack’s team hard-codes the fee table to meet a launch date and writes it in an ADR with a plan to replace it. What kind of debt is this?",
        choices: [
          'Accidental debt, because it was caused by hurrying toward a date',
          'Not debt at all, because the fee table works correctly in production today',
          'Deliberate debt, because it was chosen knowingly and recorded with a plan',
          'Drift, because the code now differs from an earlier version of the design',
        ],
        answer: 2,
        explanation: 'It was chosen on purpose and written down. Time pressure does not make debt accidental, and working code can still carry debt. Drift is about code moving away from a written decision.',
      },
      {
        id: 'software-architecture-ai-43-q2',
        prompt: "A fitness function for “modules do not depend on each other in a circle” fails in CI after an agent’s change. What is the best next step?",
        choices: [
          'Decide whether the code or the design is wrong, then fix the code or write a new ADR',
          'Delete the failing check, because the agent’s change already passes every one of the unit tests',
          'Add the new dependency to an allowed list so that the pipeline turns green again for the team',
          'Ask the agent to rename the modules so that the check no longer finds the same cycle in them',
        ],
        answer: 0,
        explanation: 'A failing fitness function is information about drift. The answer is a decision, not silencing the check. Renaming or allow-listing hides the problem.',
      },
      {
        id: 'software-architecture-ai-43-q3',
        prompt: "Which debt item should Rina repay first?",
        choices: [
          'The ugliest file in the repository, which nobody has touched for more than a year and that is hard to read',
          'The item that the newest developer finds hardest to read, whatever it happens to cost the team',
          'The item that would be the most satisfying to remove, so that the whole team feels some progress',
          'The circular import that slows nearly every change, since its interest is paid every week',
        ],
        answer: 3,
        explanation: 'Rank by interest: what the debt costs you repeatedly. Ugly or unfamiliar code that nobody touches costs little, and satisfaction is not a cost.',
      },
      {
        id: 'software-architecture-ai-43-q4',
        prompt: "What is the main risk of a big-bang rewrite compared with the Strangler Fig?",
        choices: [
          'It always costs less in the end, but it takes a long time before the work can start at all',
          'It stops feature work, delivers late, and can bring back bugs the old code had fixed',
          'It needs a router in front of the old code, which adds one more component for the team to maintain',
          'It makes the team learn new tools, which is a cost that the Strangler Fig approach never has',
        ],
        answer: 1,
        explanation: 'A rewrite delivers late and loses old fixes. The router belongs to the Strangler Fig, and both approaches may need new tools.',
      },
      {
        id: 'software-architecture-ai-43-q5',
        audience: { max: 'beginner' },
        prompt: "What does “technical debt” mean in this lesson?",
        choices: [
          'Money the company owes to the cloud provider for running the system each month',
          'Bugs that the testers have not had the time to find anywhere in the code of the app',
          'A shortcut that saves time now but makes later changes slower or riskier',
          'Old code that has been deleted but still shows in the project history for the team',
        ],
        answer: 2,
        explanation: 'Technical debt is a shortcut with interest: it saves time now and costs more later. It is not money owed or a list of unfound bugs.',
      },
      {
        id: 'software-architecture-ai-43-q6',
        audience: { min: 'advanced' },
        prompt: "Your Strangler Fig migration has had two payment paths for a year, and the old path still takes a share of traffic. What should you do?",
        choices: [
          'Wait until the old path stops being used, since traffic will fall away by itself in time',
          'Set an exit date and a metric for the share of traffic on the new path, and report it',
          'Run both paths forever, because having two ways to pay is more reliable than one',
          'Switch all traffic to the new path in one night, to end the migration quickly',
        ],
        answer: 1,
        explanation: 'Long coexistence is the usual failure of a Strangler migration. An exit date and a visible metric keep it moving. Waiting rarely works, permanent duplication has a cost, and an overnight switch is a big-bang risk.',
      },
    ],
    task: {
      title: 'Start a debt register and one fitness function',
      minutes: 20,
      steps: [
        'List five shortcuts or oddities in a system you know. For each, write the debt register fields: what, why it was taken, the interest, the trigger and the owner.',
        'Rank them by interest and say which one you would repay first, and in how many small steps.',
        'Choose one decision from your design and write the fitness function that would catch drift from it, in pseudocode or a test.',
        'Add a “revisit if” line to one ADR and run the “Challenge my debt ranking” prompt. Note which remarks you accept and which you reject.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Think of something at home or work that was fixed “temporarily”. Write what it costs you each week and what would make you fix it properly.'] },
      { audience: { min: 'advanced' }, steps: ['Draft a Strangler migration plan for one module of a system you maintain: the facade, the traffic share by week, the metric you will chart, the exit date, the source of truth for data during the overlap and the rollback for each step.'] },
    ],
  },
  {
    id: 'software-architecture-ai-44',
    day: 44,
    title: 'Deployment, CI/CD and Cost and Performance Trade-Offs',
    summary: 'Design releases you can undo, a pipeline that carries your checks, and cost and performance choices you can justify and revisit.',
    intro: {
      objectives: [
        'Compare replace-in-place, rolling, blue-green, canary and feature-flag releases by what each costs',
        'Change a database in compatible steps so a release can be rolled back',
        'Sketch a CI/CD pipeline that builds once, runs your architecture checks and decides on signals',
        'Weigh a cost against a performance target using measurements, and write a trigger to revisit the choice',
      ],
      why: 'How you release decides how bad a mistake can be, and how you spend decides how long the system can last. Both are architecture, and both can be changed later only if the first version was designed to be undone.',
    },
    minutes: 28,
    skills: ['arch-production'],
    body: [
      { type: 'paragraph', text: "You can have a sound design and still hurt your users with the way you ship it. A release is a change to a running system, and the design of that change decides how much damage a mistake can do and how quickly you recover. The same is true of money: cost and speed are quality attributes, and they need decisions and numbers from your own measurements. This lesson covers release design, the pipeline that carries it, and how to trade cost against performance without guessing." },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: "TindaTrack deploys by copying files to its two servers on Friday evening. One release renames a database column and updates the code to match. The first server updates and works. The second, still running the old code, starts failing because the column it expects is gone. Rina tries to roll back, but the old code needs the old column, and the migration already dropped it. Stores cannot save sales for hours over a busy weekend." },
      { type: 'paragraph', text: "Nothing was wrong with the feature. The release was designed so that a mistake could not be undone. Rina’s redesign changes four things: one artifact is built once and promoted, the database changes in two compatible steps, a few stores get the new version first, and a feature flag can switch the new behaviour off without a deploy. Each change adds something to maintain. She picked them because of this failure, not because they are fashionable." },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: "Start with one distinction. **Deploying** puts a new version on the servers. **Releasing** makes its behaviour visible to users. If you can deploy without releasing (the code is there but off), you can separate the risk of “does it run?” from the risk of “is it right?”. Here are the common strategies and what each one costs:" },
      {
        type: 'table',
        headers: ['Strategy', 'How it works', 'What you gain', 'What it costs'],
        rows: [
          ['Replace in place', 'Stop the old version, start the new one', 'Simplest, nothing extra to run', 'A gap or mixed versions, and rollback means redeploying'],
          ['Rolling', 'Replace servers a few at a time', 'No full stop and less risk than all at once', 'Old and new versions run together, so both must work with the same database'],
          ['Blue-green', 'Run a full copy of the new version beside the old, then switch traffic', 'A fast switch back', 'Two environments to run, and the database is shared by both'],
          ['Canary', 'Send a small share of traffic to the new version and watch', 'Real traffic tests the change with a small blast radius', 'Needs traffic routing and good signals to decide'],
          ['Feature flag', 'Ship the code switched off and turn it on for chosen stores', 'Release and rollback without a deploy', 'More code paths to test, and old flags become debt'],
        ],
        caption: 'None of these is free. Pick the simplest one that makes your likeliest failure survivable. For one small server, a scripted replace with a rehearsed rollback may be enough.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  U[Store phones] --> R{Traffic switch}
  R -->|live| B[Blue: current version]
  R -.->|ready| G[Green: new version]
  B --> D[(Shared database)]
  G --> D`,
        caption: 'Look at the bottom: blue and green share one database. Switching traffic is easy. A schema change that only one version understands is not, which is the next point.',
      },
      { type: 'paragraph', text: "**Database changes are the part that traps rollbacks.** The safe pattern is expand and contract. First expand: add the new column and keep the old one. Then release code that writes both and backfills the old rows. Then release code that reads the new column. Only in a later release, when you no longer need to go back, contract: drop the old column. At every step, both the previous and the next version of the code work with the schema, so a rollback is safe. Some things cannot be rolled back at all, such as a payment taken or a text already sent, so for those you plan to roll forward." },
      { type: 'code', language: 'sql', label: 'Expand and contract, as four releases (illustrative)', code: `-- Release 1 (expand): add the new column and keep the old one
ALTER TABLE products ADD COLUMN price_centavos integer;

-- Release 2: the code writes both columns; backfill the old rows
UPDATE products SET price_centavos = ROUND(price * 100) WHERE price_centavos IS NULL;

-- Release 3: the code reads only price_centavos (the old column is still there for a rollback)

-- Release 4 (contract): later, when a rollback is no longer needed
ALTER TABLE products DROP COLUMN price;` },
      { type: 'paragraph', text: "A **CI/CD pipeline** is the automatic path from a commit to production. CI (continuous integration) builds and checks every change. CD (continuous delivery or deployment) carries a checked build to your environments. The pipeline is part of the architecture, because it is where your checks live: the boundary checks from lesson 41, the fitness functions from lesson 43, the security scans from module 9. Four design rules do most of the work. **Build once**, and promote the same artifact through staging to production, so what you tested is what you ship. **Keep secrets out of the repository** and give the pipeline only the access it needs. **Describe environments as code** (module 7), so staging resembles production. **Decide on signals**, not feelings." },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Commit] --> B[Build one artifact]
  B --> C[Tests, lint and boundary checks]
  C --> D[Dependency and secret scan]
  D --> E[Deploy to staging and smoke test]
  E --> F[Canary: a few stores]
  F --> G{Signals healthy?}
  G -->|yes| H[Widen to all stores]
  G -->|no| I[Roll back: flag off or previous artifact]`,
        caption: 'The diamond is observability used as operations. The pipeline widens or rolls back on measured signals, not on someone’s mood on Friday evening.',
      },
      { type: 'code', language: 'yaml', label: 'A pipeline sketch (illustrative, not any provider’s syntax)', code: `stages:
  - build:      build one artifact and tag it with the commit id
  - verify:     unit tests, lint, import-boundary checks, fitness functions
  - scan:       dependency check and secret scan
  - staging:    deploy the same artifact, run smoke tests
  - canary:     route a few stores to the new version
  - promote:    widen only if error rate, latency and sales recorded per minute stay healthy
  - rollback:   switch the flag off or redeploy the previous artifact` },
      { type: 'paragraph', text: "What are healthy signals? Pick a few that tell you the system is doing its job: the error rate, the response time of the key actions, and **a business signal** such as “sales recorded per minute” or “webhooks processed”. A technical metric can look fine while the business is broken. Mark deploys on your charts so a change in a line can be tied to a release, and decide in advance what number means roll back." },
      { type: 'paragraph', text: "**Cost and performance** are the same kind of decision. Treat cost as a quality attribute with an owner, like any other target (module 2: a target without a number or a test is a wish). The method is: state the performance target, **measure** where time or money goes, find the cheapest change that meets the target, record the trade in an ADR, and add a trigger to revisit it. No prices appear here because they change by provider and region, so use your own bill." },
      {
        type: 'table',
        headers: ['Lever', 'What it can save', 'What it costs you'],
        rows: [
          ['Fix a missing index or an N+1 query', 'Database time, often by a lot, for little money', 'A measurement and a careful migration'],
          ['Add a cache', 'Repeated work and database load', 'Invalidation rules, stale data, and one more thing to debug'],
          ['Use a managed service', 'Operating time and on-call risk', 'A bill that grows with use, and less control'],
          ['Run extra copies for availability', 'Downtime when one copy fails', 'You pay for idle capacity. Match it to the availability target in your requirements'],
          ['Shorten data retention (for example receipt photos)', 'Storage and backup size', 'The business must agree what can be deleted'],
          ['Scale to zero or run on demand', 'Idle cost', 'Slower first requests and limits to design around'],
        ],
        caption: 'Every lever buys one thing and spends another. The best first lever is the one a measurement points at, not the most impressive.',
      },
      { type: 'visual', id: 'arch-tradeoff-matrix', caption: 'Use the trade-off matrix to compare two ways to meet one performance target. If it says too close to call, gather a measurement before you choose.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: "In plain words: shipping a change is like changing a tyre on a bus that keeps moving. A good plan lets you try the new tyre on one wheel first, keep the old one ready to put back, and have someone watching the road. A pipeline is the assembly line that does the same steps every time, so nobody skips one when they are in a hurry. And money works like a household budget: before buying something expensive to fix a slow app, first find out what is actually slow. Often the cheapest fix is a small one." },
      { type: 'paragraph', audience: { min: 'advanced' }, text: "In production the awkward parts are state and timing. Schema changes must be compatible across at least two code versions, so make expand-and-contract a pipeline rule and test it in staging with both versions running. Canary analysis needs enough traffic to be meaningful, and tenants are not equal: choose canary stores deliberately, because a small store may hide a problem a large one would show. Keep flags short-lived, give each an owner and an expiry, and test the off path. Treat the pipeline as production: its credentials are a high-value target, so scope them tightly, and keep an emergency path that is rehearsed, not improvised. For cost, attribute spend by feature or tenant where you can, so a rise has a name, and tie each reliability or performance spend to a stated target so it can be reduced when the target changes." },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'An assistant designs deployment for TindaTrack',
        prompt: "Design the deployment and CI/CD for TindaTrack: about 200 stores, 3 developers, one PostgreSQL database. Include an estimate of monthly cost.",
        output: "Recommended architecture:\n- A Kubernetes cluster in three regions with a service mesh.\n- Blue-green deployments with automatic rollback.\n- Active-active multi-region database.\n- GitOps with a full progressive-delivery controller.\nEstimated cost: $2,300 per month, 40% cheaper than the alternatives.",
        notice: "Hold it against your own numbers. The inputs said 200 stores, three developers and one database. Nothing there needs three regions, a service mesh or an active-active database, and a team of three has to run all of it. The dollar figure and “40% cheaper” have no source, because the assistant has no prices, no usage and no region. It says nothing about database migrations and rollback, which was the real risk. Ask it for the simplest option that meets your stated requirements, the cost of each step up, and what it cannot know.",
      },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: "Describe your current release process and the failure you fear most. Choose your own strategy first. Then ask an assistant to attack it." },
      {
        type: 'prompt',
        label: 'Attack my release design',
        text: "My system: [short description, number of users, team size]. How we release today: [your process]. The failure I fear most: [for example a migration that cannot be undone]. My proposed release design: [strategy, database approach, signals for rollback].\n\nAct as a critic and do not redesign it.\n1. Say which failure my design still cannot survive.\n2. For each part of my design, name what it costs us in people, money or complexity.\n3. Suggest a simpler option if one would meet my stated need, and say what it would give up.\n4. Tell me which signals I should watch to decide on a rollback.\n5. List your assumptions, and mark any figure you offer as an example, not a measurement.",
      },
      { type: 'paragraph', text: "Check it against your constraints. Did the assistant add tools, regions or services that your numbers do not need? Did it give a price or a percentage? Cross them out unless you can source them. You decide the design." },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          "Write the rollback plan for your next release, including what cannot be rolled back and how you would roll forward.",
          "Take one planned database change and split it into expand and contract releases.",
          "Choose three signals, one of them a business signal, and write down the numbers that would trigger a rollback.",
          "Move on to Project 3, where you bring the whole course together in an architecture blueprint.",
        ],
      },
      {
        type: 'takeaways',
        items: [
          "Deploying and releasing are different. Feature flags and canaries separate them, and each strategy has a cost.",
          "Change databases with expand and contract, so every step works with the previous and the next version of the code.",
          "A pipeline is part of the architecture: build once, run your boundary and security checks, keep secrets out of the repository, and promote the same artifact.",
          "Decide on signals, including a business signal, and write the rollback numbers before you release.",
          "Treat cost as a quality attribute: measure first, choose the cheapest change that meets the target, record the trade and write a trigger to revisit it.",
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-44-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'A release that can be undone',
          prompt: 'Build the order of a TindaTrack release that includes a database change and can be rolled back. Leave out the steps that make it unsafe.',
          concept: 'release design',
          situation: "TindaTrack is about to release a change that stores prices as whole centavos. The code and the database both change. The team wants a release where a mistake can be undone, with a few stores trying it first.",
          parts: [
            { id: 'build-once', lane: 'tool', label: 'Build one artifact and tag it with the commit id', detail: 'The same artifact is promoted through every environment.' },
            { id: 'expand-db', lane: 'tool', label: 'Release 1: add the new column and keep the old one', detail: 'The old and new code both work with this schema.' },
            { id: 'checks', lane: 'tool', label: 'Run tests, boundary checks and scans', detail: 'The pipeline checks before anything is deployed.' },
            { id: 'staging', lane: 'tool', label: 'Deploy the artifact to staging and smoke test', detail: 'A rehearsal in a place that resembles production.' },
            { id: 'canary', lane: 'tool', label: 'Release to a few stores behind a flag', detail: 'A small share of stores gets the change first.' },
            { id: 'watch-signals', lane: 'human', label: 'Watch errors, response time and sales recorded per minute', detail: 'The decision to widen or roll back rests on numbers.' },
            { id: 'widen', lane: 'output', label: 'Widen to all stores', detail: 'Release to everyone once the signals stay healthy.' },
            { id: 'ai-review-plan', lane: 'ai', label: 'Ask an assistant to list what could go wrong with this plan', detail: 'The output is a list of questions to check, not an approval.' },
            { id: 'drop-now', lane: 'tool', label: 'Rename the column and drop the old one in the same release', detail: 'The code and schema change together in one step.' },
            { id: 'friday-all', lane: 'output', label: 'Deploy to every store on Friday evening, then go home', detail: 'Release to all stores at once with nobody watching.' },
            { id: 'edit-server', lane: 'tool', label: 'Fix a problem by editing files directly on the server', detail: 'Change what is running without building a new artifact.' },
          ],
          rules: [
            { id: 'r-core', kind: 'require', parts: ['build-once', 'expand-db', 'checks', 'staging', 'canary', 'watch-signals', 'widen'], message: 'A safe release builds once, expands the database first, checks, rehearses in staging, tries a few stores, watches signals and then widens.' },
            { id: 'r-bad', kind: 'forbid', parts: ['drop-now', 'friday-all', 'edit-server'], message: 'A breaking schema change in one step, an unwatched all-at-once release and edits on the server each make a mistake impossible to undo or even to trace.' },
            { id: 'r-1', kind: 'before', parts: ['build-once', 'staging'], message: 'Staging runs the artifact you built, so the build comes first.' },
            { id: 'r-2', kind: 'before', parts: ['expand-db', 'canary'], message: 'The schema must work with both versions before any store runs the new code.' },
            { id: 'r-3', kind: 'before', parts: ['canary', 'watch-signals'], message: 'You watch signals after some real traffic reaches the new version.' },
            { id: 'r-4', kind: 'before', parts: ['watch-signals', 'widen'], message: 'Widening comes after the signals are checked.' },
          ],
          solution: ['build-once', 'checks', 'expand-db', 'staging', 'ai-review-plan', 'canary', 'watch-signals', 'widen'],
          minSteps: 7,
          maxSteps: 9,
          hints: [
            'Build once, then check, then rehearse in staging. The artifact you test must be the one you ship.',
            'Add the new column first and keep the old one, so both versions work during the release.',
            'Leave out the three steps that cannot be undone or traced: dropping at once, an unwatched Friday release and edits on the server.',
          ],
          explanation: 'A safe release builds once, runs its checks, expands the schema compatibly, rehearses in staging, tries a small group of stores, watches real signals and only then widens. The three wrong parts each remove either the way back or the evidence.',
          simulation: {
            input: 'Release “prices stored as centavos” with a database change.',
            steps: {
              'build-once': 'The pipeline builds artifact 4f2a and tags it with the commit id.',
              'checks': 'Tests, boundary checks and the dependency scan all pass.',
              'expand-db': 'Release 1 adds price_centavos and leaves price in place. Old and new code both work.',
              'staging': 'Artifact 4f2a runs in staging and the smoke tests pass.',
              'ai-review-plan': 'An assistant lists questions, such as what happens to rows created during the backfill. The team checks them.',
              'canary': 'Three stores get the new behaviour behind a flag.',
              'watch-signals': 'Errors, response time and sales recorded per minute stay healthy for the agreed period.',
              'widen': 'The flag opens for all stores. The old column stays until a later release.',
            },
            output: 'A completed release with a rehearsed way back at every step.',
          },
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-44-scenario-1',
          kind: 'scenario',
          title: 'The slow daily report',
          prompt: 'Choose the best way to meet the performance target.',
          concept: 'cost and performance',
          situation: "TindaTrack’s daily report misses its target for the busiest store. An engineer proposes adding a managed cache cluster and a larger database. Nobody has measured where the time goes. The team is three people and wants to keep costs low.",
          options: [
            { text: 'Measure first: trace the report’s queries, find where the time goes, apply the cheapest fix that meets the target (often an index or a query change), then record it in an ADR with a trigger to revisit.', consequence: 'A missing index is found. The report meets its target with no new component and no extra bill.', quality: 'best' },
            { text: 'Upgrade the database to a larger size first, and measure afterwards if it is still slow.', consequence: 'The report improves a little and the cost rises permanently. The real cause remains and returns as data grows.', quality: 'acceptable' },
            { text: 'Add the cache cluster as proposed, because caches always make reports faster.', consequence: 'The team now operates a cache and its invalidation rules, and the slow query is still slow on a cache miss.', quality: 'poor' },
            { text: 'Ask an assistant for the best infrastructure to make reports fast, and follow its design.', consequence: 'The design is full of components the team of three must run, and it was not based on any measurement of this system.', quality: 'poor' },
          ],
          hints: [
            'What is the first thing you need before you can pick a fix?',
            'The cheapest change that meets the target is the one to look for.',
            'Every extra component costs people as well as money.',
          ],
          explanation: 'Measure where the time goes, then pick the cheapest sufficient change, and record it. A bigger server, a cache or an assistant’s design are all guesses until a measurement says where the time goes.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-44-match-1',
          kind: 'match',
          title: 'Which release strategy fits the worry?',
          prompt: 'Match each worry to the release strategy that addresses it, and note its cost.',
          concept: 'release strategies',
          labels: { terms: 'Worry', meanings: 'Strategy and its cost' },
          pairs: [
            { term: 'We want to switch a new behaviour off at once, for one store, without deploying.', definition: 'A feature flag, which adds code paths to test and flags to retire', note: 'A flag separates release from deploy, and each one must eventually be removed.' },
            { term: 'We want a small share of real traffic to try the new version before everyone does.', definition: 'A canary release, which needs routing and good signals', note: 'Canaries only help if you can see whether the new version is healthy.' },
            { term: 'We want to put the old version back in seconds if the new one fails.', definition: 'Blue-green, which costs a second full environment and a compatible database', note: 'Both versions share the database, so the schema must work for both.' },
          ],
          hints: [
            'Ask what each worry needs: a switch, a small share of traffic, or an instant way back.',
            'Each strategy has its own cost.',
            'Match the worry to the one that addresses it most directly.',
          ],
          explanation: 'Flags give a per-store switch, canaries test with a small share of real traffic, and blue-green gives a fast way back. Each costs something different.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-44-scenario-2',
          kind: 'scenario',
          title: 'Canary signals that look fine',
          prompt: 'Choose how to decide whether to widen the release.',
          concept: 'observability for releases',
          audience: { min: 'advanced' },
          situation: "A canary for three small stores shows normal error rates and response times. But the number of sales recorded per minute for those stores has dropped to nearly zero since the release. Your pipeline widens on error rate and latency alone.",
          options: [
            { text: 'Stop and roll back the canary, then add sales recorded per minute as a promotion signal, and choose a canary that includes a larger store.', consequence: 'The drop is traced to a flag that hid the sale button on small screens. Nothing widens, and the pipeline now watches the business signal.', quality: 'best' },
            { text: 'Widen the release, because error rate and latency are healthy, and look into the sales drop next week.', consequence: 'Every store loses the button. Healthy technical numbers hid a broken business flow.', quality: 'poor' },
            { text: 'Hold at three stores and wait a few more hours to see whether sales recover.', consequence: 'It limits damage to three stores, but the cause stays hidden and the pipeline still ignores the business signal.', quality: 'acceptable' },
          ],
          hints: [
            'Which signal shows that stores can still do their job?',
            'Technical health and business health are not the same.',
            'The best answer stops the widening and fixes the decision signals.',
          ],
          explanation: 'A business signal catches failures that technical metrics miss. Rolling back the canary and adding that signal to the pipeline prevents the same mistake later.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-44-q1',
        prompt: "TindaTrack’s release renames a column and drops the old one in the same release. The second server still runs the old code. What is the best design change?",
        choices: [
          'Always deploy at night, when fewer stores are using the system and any problem will be seen less',
          'Add a third server so that more instances of the old code can share the load between them all',
          'Ask the stores to stop using the app while the two servers are being updated one after the other',
          'Use expand and contract: add the new column, keep the old one, drop it in a later release',
        ],
        answer: 3,
        explanation: 'Expand and contract keeps both code versions working with the schema, so a rollback is safe. Timing, more servers and downtime do not fix incompatible versions.',
      },
      {
        id: 'software-architecture-ai-44-q2',
        prompt: "What does it mean that a pipeline should “build once”?",
        choices: [
          'Only the first commit of each day is built, to save time in the pipeline',
          'One artifact is built and the same artifact is promoted through staging to production',
          'Each environment builds the code on its own, so that each one is independent of the rest',
          'The production build is done by hand once, and every later change is merged on trust',
        ],
        answer: 1,
        explanation: 'Building once means what you tested is what you ship. Separate builds per environment can differ in small ways that no test saw.',
      },
      {
        id: 'software-architecture-ai-44-q3',
        prompt: "A canary shows normal errors and response times, but sales recorded per minute fall sharply. What does that show?",
        choices: [
          'Nothing important, because technical metrics are the only reliable signals for a release decision',
          'That the canary stores are too small to give any useful information about the new version at all',
          'That technical health can hide a broken business flow, so stop and add a business signal',
          'That the monitoring is broken, since errors and sales should always move together in a healthy system',
        ],
        answer: 2,
        explanation: 'A business signal caught a failure that technical numbers missed. The sensible reaction is to stop, investigate and add that signal to the pipeline’s decision.',
      },
      {
        id: 'software-architecture-ai-44-q4',
        prompt: "A report is slow and the team has not measured anything. What is the most defensible first step?",
        choices: [
          'Measure where the time goes, then choose the cheapest change that meets the target',
          'Buy the biggest database size on offer, so that the slowness is certain to go away for good',
          'Add a cache in front of the database, since caches are the standard fix for most slow reads',
          'Rewrite the report in a faster language, because the language is usually where the time goes',
        ],
        answer: 0,
        explanation: 'Without a measurement you do not know the cause. The cheapest sufficient change follows from the measurement. The others are guesses that add cost or complexity.',
      },
      {
        id: 'software-architecture-ai-44-q5',
        audience: { max: 'beginner' },
        prompt: "What is a feature flag?",
        choices: [
          'A warning that appears on screen whenever a feature has a bug that the testers have found',
          'A log entry that records which developer built each feature of the app and when it was added',
          'A switch in the code that turns a new feature on or off without a new deployment',
          'A label in the pipeline that shows that a feature has passed all of its automated tests',
        ],
        answer: 2,
        explanation: 'A feature flag lets you turn a feature on or off without redeploying, for everyone or for chosen stores. It is not a warning, a log or a test label.',
      },
      {
        id: 'software-architecture-ai-44-q6',
        audience: { min: 'advanced' },
        prompt: "Your blue-green setup switches traffic instantly, but a rollback fails because the new release migrated the schema destructively. What is the lesson?",
        choices: [
          'Blue-green is unsafe in general, so it should be replaced with replace-in-place deploys everywhere',
          'Both versions share the database, so schema changes must work for both: expand and contract',
          'Rollbacks are never possible with a shared database, so the team should only ever roll forward',
          'The traffic switch should be much slower, so that problems appear before everyone is moved to green',
        ],
        answer: 1,
        explanation: 'A traffic switch cannot undo a destructive schema change. Compatible, stepwise schema changes are what make blue-green rollbacks real. Some data changes do force a roll forward, but the schema can usually be designed to be reversible.',
      },
    ],
    task: {
      title: 'Design the release for one change',
      minutes: 20,
      steps: [
        'Pick one planned change in a system you know that includes a database change, or use the TindaTrack price change in this lesson.',
        'Write the release as numbered steps: the expand step, the code releases, the contract step, the flag or canary, and the signals that decide to widen or roll back (include one business signal).',
        'Write the rollback for each step, and mark what cannot be rolled back and how you would roll forward.',
        'Run the “Attack my release design” prompt. Note which of the assistant’s points are about something you can verify in your own system, and which are generic.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Think of a change to something you use (a school form, a shop’s price list). Write how you would try it on a few people first and how you would put the old version back.'] },
      { audience: { min: 'advanced' }, steps: ['Write the cost and performance ADR for one measured bottleneck in your system: the target, the measurement, the options compared in relative terms, the choice, and a revisit trigger. Add a pipeline rule that enforces expand-and-contract for schema changes.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'software-architecture-ai-p3',
  title: 'Build an AI-Assisted Architecture Blueprint',
  summary: 'Design and document the architecture of a production-oriented application of your choice, plan its implementation with AI coding agents, and build and test one working proof of concept of a key component.',
  outcome: 'A complete, consistent architecture blueprint with decisions recorded, an agent-ready implementation plan and a tested proof of concept, which shows an employer or client that you can design, justify and begin to build a production system.',
  unlockAfterDay: 44,
  steps: [
    {
      id: 'software-architecture-ai-p3-s1',
      text: "Objectives\n\nYou will design and document the architecture of one production-oriented application, plan how AI coding agents will implement it, and build one small working proof of concept. Choose your own idea, a system from your work, or a grown-up TindaTrack (many stores, online payments, text reminders). By the end you have: product requirements with measurable targets, C4 diagrams, data models, API specifications, a security plan, a scalability plan, a deployment architecture, at least five ADRs, an implementation plan with an instruction file for an agent, and a proof of concept with a test. The work and the reasoning must be yours. An assistant is a critic and a drafting partner, and you record what you checked and what you rejected.",
    },
    {
      id: 'software-architecture-ai-p3-s2',
      text: "Tools and resources\n\nIn Talino: the diagram workbench (arch-diagram-workbench) to draw and save your three C4 diagrams as text, the ADR builder (arch-adr-builder) to write and save your decision records, the trade-off matrix (arch-tradeoff-matrix) to compare options, and the architecture assistant (arch-assistant, Tali) to challenge your work. Your coach also receives what you saved in these tools, so save each diagram and ADR there and paste the final text into your submission. Outside Talino: your own editor or coding tool (Claude Code, Cursor, Codex or any other) for the proof of concept. Talino does not run your code. Lessons to draw on: 4, 13 and 36 (diagrams), 5 to 7 (requirements and quality attributes), 8 to 12 (styles), 16 to 19 (data and tenants), 20 to 23 (APIs and integration), 24 to 26 (cloud), 27 to 30 (scale and reliability), 31 to 34 (security), 35 to 38 (AI-assisted design), 39 to 41 (agents and checks) and 42 to 44 (production). Never put a real key, password or customer data in your code or your submission.",
    },
    {
      id: 'software-architecture-ai-p3-s3',
      text: "Requirements and C4 diagrams\n\nWrite the problem in a short paragraph, name the actors, and list five to eight product requirements. Add at least four quality attributes as measurable scenarios (stimulus, environment, response, measure), for example availability, performance, security and scalability. Label every number as your own assumption, not a benchmark, and list your constraints (team size, budget in relative terms, deadlines, rules you must follow). Then, in the diagram workbench, draw and save a C4 context diagram, a container diagram and one component diagram for the container that holds your proof of concept (lessons 4, 13 and 36). The names must match across all three and match your requirements.",
    },
    {
      id: 'software-architecture-ai-p3-s4',
      text: "Data, API, security, scalability and deployment\n\nWrite five short sections, each tied to your requirements and no larger than they demand. (1) Data models: an ER diagram of the core entities, how ownership or tenants are separated, and where you accept eventual consistency. (2) API specification for two key flows: endpoints, request and response shapes, errors, idempotency and pagination where they matter, and how you would version it. (3) Security plan: trust boundaries, authentication and authorization, secrets, tenant isolation, the top threats with a mitigation each, and where a security specialist should review. (4) Scalability plan: the likeliest bottleneck, what you will measure first, and which scaling steps you will not take yet. (5) Deployment architecture: environments, release strategy and rollback, CI/CD stages including your architecture checks, the signals that decide a rollback (include a business signal), and the cost levers you would use, compared in relative terms and never as prices. Draw on lessons 16 to 34 and 42 to 44.",
    },
    {
      id: 'software-architecture-ai-p3-s5',
      text: "ADRs and implementation plan\n\nWrite at least five ADRs in the ADR builder, each with the context, the options you considered including a rejected one, the decision, the consequences and a \"revisit if\" trigger (lesson 37). Use the trade-off matrix for at least one comparison. Then write the AI-assisted implementation plan (lessons 39 to 41): a walking skeleton, slices ordered by risk with done criteria, the contracts you will write first, a checkpoint for each slice, and the instruction file you would give a coding agent (a layout map, boundary rules with their ADRs, commands, a stop-and-ask list, under about sixty lines). State what a human reviews at each checkpoint, which changes an agent may never make on its own (tests, check configuration, contracts, secrets) and which architecture checks run in CI.",
    },
    {
      id: 'software-architecture-ai-p3-s6',
      text: "Proof of concept\n\nBuild one component that demonstrates one of your architectural decisions, with your own tools. Good choices: a tenant-aware data access layer, an idempotent webhook receiver, a queue consumer with retries and a dead-letter path, or an authorization check. Keep it small (roughly a hundred lines plus the test). Write a small test that fails if the decision is broken, then prove it: break the decision on purpose (remove the tenant filter, skip the duplicate check) and show the test failing, then restore it. Link your repository or paste the code and the test, say how to run them, paste the test result, and state what the proof of concept does not cover. Talino does not run your code, so the evidence is what you show and explain. No secrets, and no real data.",
    },
    {
      id: 'software-architecture-ai-p3-s7',
      text: "Guided AI prompts\n\nUse these as a critic after you have written your own answer. Put your details in the brackets. (1) \"Here are my requirements: [list]. Do not rewrite them. Which are not measurable, which conflict, and what is missing? List your assumptions.\" (2) \"Here are my diagrams as Mermaid text: [paste]. Act as a sceptical reviewer. Where do they disagree with each other or with my requirements? What failure is not shown?\" (3) \"Here is my security plan: [paste]. List the threats it does not cover and the assumptions you made. Say what needs a specialist.\" (4) \"Here is my implementation plan and agent instructions: [paste]. Which slice is too large to review? Which rule cannot be checked automatically? What could an agent break without failing a check?\" (5) \"Here is my proof of concept and its test: [paste]. What decision does the test not prove? Which case is missing? Could the test pass even if the decision were broken?\" Keep a log: what the assistant said, what you verified, what you accepted, what you rejected and why.",
    },
    {
      id: 'software-architecture-ai-p3-s8',
      text: "Deliverables\n\nPaste into your submission, in this order: (1) the problem, actors, requirements and measurable quality scenarios with assumptions labelled; (2) the text of your context, container and component diagrams; (3) your data model; (4) your API specification for two flows; (5) your security plan; (6) your scalability plan; (7) your deployment architecture with the pipeline and the rollback plan; (8) your ADRs (at least five, final text); (9) the implementation plan with slices, checkpoints, the agent instruction file and the human review points; (10) the proof of concept code or link, its test, how to run it, and the result you saw, including the test failing when you broke the decision; (11) your AI-use log; (12) your risks and open questions, honestly stated, including anything you did not verify. Also save your diagrams and ADRs in the Talino tools so your coach receives them.",
    },
    {
      id: 'software-architecture-ai-p3-s9',
      text: "Assessment criteria\n\nA reviewer checks that: the blueprint is consistent end to end, with names, containers, data, API flows, security, scalability and deployment agreeing with each other and with the requirements, and the design is the simplest one that meets them; targets are measurable and assumptions are labelled, with at least five ADRs that record a rejected alternative, consequences and a revisit trigger; the proof of concept demonstrates the decision it claims, and its test would fail if the decision were broken; your use of AI is documented, with what you verified, rejected and changed after feedback, and your implementation plan keeps humans at checkpoints; risks, open questions and the limits of your verification are stated honestly, and the security plan names where a specialist is needed.",
    },
    {
      id: 'software-architecture-ai-p3-s10',
      text: "Common mistakes\n\n(1) Designing for scale you have no requirement for: microservices, several regions or a message broker with no measured need. (2) Quality attributes with no number or test. (3) Diagrams that do not match each other, or a security plan that never mentions the tenant boundary you drew. (4) ADRs that record the choice but not the rejected option or the cost. (5) A proof of concept whose test passes even when the decision is broken, so it proves nothing. (6) Pasting an assistant's design as your own. The assessment rewards your choices and your checks, not polished text. (7) Invented figures: benchmarks, prices or percentages with no source. Mark any number as an assumption. (8) Letting an agent edit the checks that guard the boundaries it is changing.",
    },
    {
      id: 'software-architecture-ai-p3-s11',
      audience: { max: 'beginner' },
      text: "A smaller scope for newcomers\n\nChoose a small application you understand, such as a class attendance tracker or one shop's order list. Write three measurable requirements, draw a context diagram and a container diagram (the component diagram is optional), sketch a data model of three or four tables and one API flow, write three ADRs instead of five, and plan three slices with a walking skeleton. For the proof of concept, build a very small function and a test, about thirty lines, such as a function that never returns another user's data. Ask an assistant to explain each line of your code and each decision in plain words, and write the explanation in your own words. Say in your submission that you used the smaller scope.",
    },
    {
      id: 'software-architecture-ai-p3-s12',
      audience: { min: 'advanced' },
      text: "Professional extension\n\nAdd as many of these as fit your system. (1) A threat model with a data-flow diagram and trust boundaries, and a list of failure modes with recovery targets and a drill you would run for each. (2) If your idea replaces an existing system, a Strangler Fig migration plan with the traffic share by week, the source of truth for data and the rollback for each step. (3) Two fitness functions as code that run in CI, such as an import boundary and a dependency cycle check. (4) A cost model in relative terms, with spend attributed by tenant or feature and the lever you would pull first. (5) Run a short architecture review with a colleague using the roles from lesson 42, and record the outcome, the conditions and their owners. (6) Compare two options for the proof of concept in the trade-off matrix, and attach evidence from an agent-assisted run: the plan, the diffs you reviewed, and what you rejected.",
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your architecture blueprint',
    placeholder: 'Paste your blueprint here: requirements, diagram text, data model, API, security, scalability, deployment, ADRs, implementation plan, proof of concept link or code with its test result, your AI-use log, and your risks and open questions.',
    hint: 'A strong submission is consistent from the requirements to the deployment plan, shows a rejected option in every ADR, includes the proof of concept and the evidence that its test fails when the decision is broken, and says honestly what you verified, what you rejected after AI feedback and what you did not check.',
  },
  rubric: [
    'The blueprint is consistent end to end: requirements, diagrams, data, API flows, security, scalability and deployment agree with each other, and the design is the simplest one that meets the stated requirements.',
    'Quality targets are measurable with assumptions labelled, no invented benchmarks or prices, and at least five ADRs each record a rejected alternative, consequences and a revisit trigger.',
    'The proof of concept demonstrates the decision it claims: its test would fail if the decision were broken, and the learner shows how they know.',
    'AI use is documented with what the learner verified, rejected or changed after feedback, and the implementation plan keeps humans at checkpoints and protects the checks that guard the boundaries.',
    'Risks and open questions are stated honestly, including what was not verified, and the security plan says where a specialist review is needed.',
  ],
  rubricExtra: [
    {
      audience: { max: 'beginner' },
      items: [
        'The smaller scope is complete: three measurable requirements, two diagrams, three ADRs, three slices and a tiny proof of concept with a test.',
        'The learner explains the proof of concept and each decision in their own words, not the assistant’s.',
      ],
    },
    {
      audience: { min: 'advanced' },
      items: [
        'Includes a threat model with trust boundaries, failure modes with recovery targets and at least one drill plan.',
        'Includes at least two fitness functions as code and a migration or evolution plan with an exit date and a rollback for each step.',
        'Provides review evidence: the outcome and the owned conditions of an architecture review, or an agent-assisted run with the diffs reviewed and what was rejected.',
      ],
    },
  ],
};
