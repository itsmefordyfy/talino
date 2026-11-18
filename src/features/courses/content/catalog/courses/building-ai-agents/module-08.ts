import type { Lesson, Project } from '../../../types';

// Module 8: Multi-Agent Systems and Orchestration (lessons 63 to 72, days 63 to 72, project P6 after day 72). Written 2026-11-18.
// Mika's Bike Shop (invented) asks one question all module long: "Should we stock rain gear before the rainy season?". Every note, number and
// source in the examples is invented and obviously small. All code is plain JavaScript with scripted stand-ins for the agents (no key, no network);
// "ticks" is a made-up unit of waiting time. Framework statements come from docs/content/AGENTS_FACTS_B.md and sit in dated version notes.
// Demos ("AI in Action") are hand-written illustrations; none of them is a real model's output.

const CHECKED = '2026-11-18';

const DOCS = {
  crewAgents: { label: 'CrewAI documentation: Agents', url: 'https://docs.crewai.com/en/concepts/agents' },
  crewCrews: { label: 'CrewAI documentation: Crews', url: 'https://docs.crewai.com/en/concepts/crews' },
  crewTasks: { label: 'CrewAI documentation: Tasks', url: 'https://docs.crewai.com/en/concepts/tasks' },
  crewFlows: { label: 'CrewAI documentation: Flows', url: 'https://docs.crewai.com/en/concepts/flows' },
  mafOverview: { label: 'Microsoft Agent Framework: overview', url: 'https://learn.microsoft.com/en-us/agent-framework/overview/' },
  mafWorkflows: { label: 'Microsoft Agent Framework: workflows', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/' },
  openaiHome: { label: 'OpenAI Agents SDK documentation', url: 'https://openai.github.io/openai-agents-python/' },
  openaiHandoffs: { label: 'OpenAI Agents SDK: handoffs', url: 'https://openai.github.io/openai-agents-python/handoffs/' },
  openaiTracing: { label: 'OpenAI Agents SDK: tracing', url: 'https://openai.github.io/openai-agents-python/tracing/' },
  langgraphOverview: { label: 'LangGraph documentation: overview', url: 'https://docs.langchain.com/oss/python/langgraph/overview' },
  langgraphGraph: { label: 'LangGraph documentation: graph API', url: 'https://docs.langchain.com/oss/python/langgraph/graph-api' },
  langgraphPersistence: { label: 'LangGraph documentation: persistence', url: 'https://docs.langchain.com/oss/python/langgraph/persistence' },
};

export const lessons: Lesson[] = [
  {
    id: 'building-ai-agents-63',
    day: 63,
    title: 'What Are Multi-Agent Systems?',
    summary: 'Define a multi-agent system as agents with roles, messages and a way to coordinate, and tell it apart from one agent with many tools.',
    intro: {
      objectives: [
        'Define a multi-agent system by its three parts: agents with roles, messages between them, and a way to coordinate',
        'Tell a multi-agent system from one agent with many tools and from a fixed chain of model calls',
        'Count the model calls a small team of agents makes for one request',
      ],
      why: 'Tutorials often show teams of agents as the normal way to build. You will build one in this module, so first you need a plain picture of what it is, and of when it is only a more expensive single agent.',
    },
    minutes: 18,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `If one agent can already search, read and write, why would anyone build three? Sometimes the honest answer is that nobody should. This lesson gives you a precise definition of a multi-agent system, so that when you see a diagram with five boxes and arrows you can tell a real team of agents from one agent drawn five times. Everything in this module is built on the answer.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Joel is a developer who helps Mika's Bike Shop in Naga City. Mika asks: "Should we stock rain gear before the rainy season?" Joel builds one agent with three tools: search the sales log, search customer messages and write a short answer. It works. Then Mika wants a full report that compares twelve products. Joel's single prompt grows to two pages. The agent starts mixing facts with opinions, forgets the rule about citing sources, and one wrong tool choice ruins the whole run. Joel splits the job into a researcher, an analyst and a writer, each with a short prompt and one or two tools. The pieces are easier to test. The run also makes more model calls and takes longer. Was the split worth it? That is the question this module teaches you to answer.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Start from what you already built. In modules 1 and 2 an **agent** is a model that decides the next action in a loop, using tools, until a goal is met. A **multi-agent system** is two or more such agents that work on one goal together. Each has its own instructions, its own tools and its own loop, and they cooperate by passing messages or results. Three parts make it a system, and a design is incomplete if any one is missing:` },
      { type: 'list', items: [
        '**Roles.** Each agent has a narrow job, its own instructions and its own tools. Lesson 65 covers this.',
        '**Communication.** Agents exchange messages, hand work over, or read and write shared state. Lessons 66 and 70 cover this.',
        '**Coordination.** Something decides who works next, checks the result and decides when to stop. Lessons 67 to 69 cover this.',
      ] },
      { type: 'paragraph', text: `The line between a multi-agent system and its neighbours is blurry, so the table below uses three questions: does each part run its own model loop, who decides the next step, and do the parts pass messages?` },
      {
        type: 'table',
        headers: ['Design', 'Own model loop per part?', 'Who decides the next step?', 'What passes between parts'],
        rows: [
          ['One agent with many tools', 'No: one loop, many tools', 'The one model', 'Nothing: tool results return to the same loop'],
          ['A fixed chain of model calls (a workflow)', 'No: each call is one step', 'The developer, in code', 'Output of one call is the input of the next'],
          ['A multi-agent system', 'Yes: each agent runs its own loop', 'A coordinator, or the agents themselves', 'Messages, results or shared state'],
        ],
        caption: 'Most real products sit in the first two rows. The third row is a choice you pay for, not a default.',
      },
      { type: 'paragraph', text: `People split a task across agents for four honest reasons. Instructions stay short, because each agent needs only its own rules. Tools and permissions can be separated: the writer never needs the search tool, so it cannot misuse it (the least-privilege idea from the tool security lesson). A cheaper model can do a simple role. And work that does not depend on other work can run at the same time. Each reason has a price, and lesson 64 puts the prices side by side.` },
      { type: 'paragraph', text: `An analogy, and only an analogy: a small kitchen. A head cook decides the order of work, one person chops, one person grills, one person plates. The difference matters. People in a kitchen share eyes, ears and common sense. Agents share nothing except what you pass them. If the chopper learns something, the grill does not know unless a message says so.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: an agent is a program that asks a language model what to do next, does it with a tool, and repeats until the job is done. A multi-agent system is a few of those programs working on one job, like a small team in a shop. One is the researcher, one checks the facts, one writes the answer. They do not see each other's thinking. They only pass notes, and one of them, the coordinator, keeps the plan and decides who goes next. If a single program could do the whole job by itself, a team adds cost and more things that can go wrong.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In practice the unit is a separately prompted model loop with its own context window. The real design variables are context isolation (what each agent sees), message schema, topology (a pipeline, a star around a coordinator, or a mesh where any agent can message any other) and termination. Two failure modes recur. Errors compound across hops: if each of four steps were right nine times in ten, all four would be right about 66 times in a hundred (0.9 x 0.9 x 0.9 x 0.9; an illustration, not a measurement). And cost grows with how much context you pass: every agent that re-reads the shared history pays for it again.` },
      {
        type: 'version',
        text: `Several frameworks describe teams of agents in their own terms. CrewAI documents an Agent as an autonomous unit with a role, a goal and a backstory, and a Crew as agents plus tasks. The Microsoft Agent Framework overview says it builds "AI agents and multi-agent workflows" in .NET, Python and Go. LangGraph calls itself a low-level orchestration framework and runtime for long-running, stateful agents. This module builds the ideas in plain code and does not need any of them. Names, APIs and status change, so read the current pages before you choose one (module 9 compares them).`,
        checked: CHECKED,
        sources: [DOCS.crewAgents, DOCS.mafOverview, DOCS.langgraphOverview],
      },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'A run log of Joel\'s three agents',
        prompt: `Question from Mika: Should we stock rain gear before the rainy season?`,
        output: `coordinator -> researcher: find notes about rain gear demand (limit: 3 notes)\nresearcher -> coordinator: 3 notes. Note 2: "Five customers asked about rain capes in two weeks." (source: customer messages)\ncoordinator -> analyst: rate each note\nanalyst -> coordinator: note 2 rated strong\ncoordinator -> writer: write the report from the ratings\nwriter -> coordinator: "Customers are crazy about rain capes. Stock 200."`,
        notice: `Read the last line against the notes. The only evidence was five customers asking in two weeks. Nothing says "crazy" and nothing says "200". The writer was given ratings, not the quantities, and it filled the gap with a confident guess. In a team, one agent's invented detail travels onward as if it were a fact. This is why the module keeps returning to checks between agents.`,
      },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: `This is a paper exercise. Pick a task you do at work or at home that has a few distinct stages (for example, preparing a weekly report, planning a trip, answering a long customer email). Fill in the card below for it, first as one agent, then as a team. Keep every answer to one line.` },
      { type: 'list', items: [
        'One agent: the goal, the tools it needs, and what "done" means.',
        'A team: the agents, each with a one-line job and the tools only it needs.',
        'For each message between agents: who sends it, who receives it, and what it contains.',
        'Who decides which agent works next, and who decides the work is finished.',
        'The one thing that could go wrong when an agent trusts another agent\'s output.',
      ] },
      {
        type: 'prompt',
        label: 'Critique my team design',
        text: `Here is a task and my plan to split it across agents.\n\nTask: [one sentence].\nSingle-agent version: [goal, tools, done-criterion].\nTeam version: [agents, one-line jobs, tools per agent, who coordinates].\n\nAct as a critic, not a designer. Please:\n1. Say whether one agent with these tools could plausibly do the job, and what in my task makes that unlikely, if anything.\n2. List each message between my agents and what could be wrong in it.\n3. Say how many model calls my team makes for one request, compared with one agent.\n4. Say what you cannot know from what I wrote.\n\nDo not add agents I did not list.`,
      },
      { type: 'paragraph', text: `What to verify: count the calls yourself before trusting the critic's count. If it says one agent is enough, test that claim by writing the single-agent card in full.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Finish the paper card above, then keep it: lesson 64 asks you to price it against the single-agent version.',
        'Next lesson, "Single-Agent vs. Multi-Agent Architecture", puts cost, latency, complexity and reliability in one table and gives the rule for choosing.',
        'Skim the CrewAI "Crews" page or the Microsoft Agent Framework overview to see what other people call these parts.',
      ] },
      { type: 'takeaways', items: [
        'A multi-agent system is two or more agents, each with its own loop, instructions and tools, cooperating on one goal.',
        'It has three parts: roles, communication and coordination. Missing one makes it a diagram, not a system.',
        'One agent with many tools and a fixed chain of model calls are not multi-agent systems.',
        'Agents share only what you pass them, and an invented detail passed on becomes the next agent\'s "fact".',
        'Splitting a task buys short instructions, separate permissions and possible parallel work, and it costs more calls and more failure points.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-63-predict-output-1',
          kind: 'predict-output',
          title: 'Count the calls',
          prompt: 'This team is scripted (no model runs): each "model call" is a small function that counts itself. Predict the two printed lines: the coordinator\'s result and the number of model calls.',
          concept: 'multi-agent cost',
          language: 'javascript',
          code: `let calls = 0;
function modelCall(who, text) {
  calls += 1;
  return who + ':' + text.length;
}
function researcher(question) {
  return modelCall('researcher', question) + '|' + modelCall('researcher', 'summary of ' + question);
}
function writer(notes) {
  return modelCall('writer', notes);
}
function coordinator(goal) {
  const notes = researcher(goal);
  const report = writer(notes);
  return modelCall('coordinator', report);
}
console.log(coordinator('rain gear'));
console.log(calls);`,
          choices: ['coordinator:9\n4', 'coordinator:9\n3', 'coordinator:26\n4', 'coordinator:9\n1'],
          wrongNotes: {
            'coordinator:9\n3': 'There are three functions, but the researcher calls modelCall twice, so the count is higher than the number of agents.',
            'coordinator:26\n4': '26 is the length of the notes string. The coordinator measures the length of the writer\'s output, which is shorter.',
            'coordinator:9\n1': 'calls is shared by every function, and it goes up each time modelCall runs, not once per run.',
          },
          hints: [
            'Follow the calls in order: coordinator starts, then researcher, then writer, then the coordinator finishes.',
            'The researcher calls modelCall two times. Add up every modelCall.',
            'The coordinator returns the length of the writer\'s output, which is the string "writer:26", nine characters.',
          ],
          explanation: 'Three agents made four model calls, because the researcher took two. The coordinator ends with the length of the writer\'s output: "writer:26" has 9 characters. Counting calls, not agents, is how you see what a team costs.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-63-match-1',
          kind: 'match',
          title: 'Team, chain or one agent?',
          prompt: 'Match each design to the name that fits it best.',
          concept: 'what a multi-agent system is',
          labels: { terms: 'Design', meanings: 'What it is' },
          pairs: [
            { term: 'One model loop that can call a price tool, a stock tool and a booking tool', definition: 'A single agent with several tools', note: 'There is only one loop and one model deciding. Tools are not agents.' },
            { term: 'Three model calls in a fixed order written by the developer, where nothing decides the order', definition: 'A fixed workflow of model calls', note: 'Each call is one step. Nothing runs its own loop or decides what comes next.' },
            { term: 'A researcher loop and a writer loop that pass results, with a coordinator that decides who works next', definition: 'A multi-agent system', note: 'Separate loops, separate instructions and a coordinator deciding: that is the definition.' },
            { term: 'The same agent run twice on two different customer questions', definition: 'Two runs of one agent, not a team', note: 'The runs do not cooperate on one goal, so there is no system.' },
          ],
          hints: [
            'Ask how many separate model loops each design has.',
            'Then ask who decides the next step: the model, the developer\'s code or a coordinator.',
            'Cooperation on one goal is what turns several agents into a system.',
          ],
          explanation: 'The definition rests on separate loops that cooperate on one goal. Tools, fixed chains and repeated runs of one agent each lack at least one of those.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-63-q1',
        prompt: 'A developer builds one model loop that can call five tools: search, a calculator, a calendar, an email draft tool and a price lookup. She says it is a multi-agent system with five agents. What is the best reply?',
        choices: [
          'She is right, because each tool does a different job and the model chooses which one to call, which is what members of a team do.',
          'It is one agent with five tools: one loop, one model deciding, and tools that run no loops of their own.',
          'It becomes multi-agent as soon as she adds a second model call that double-checks the tool results before the answer goes out.',
          'It is multi-agent as long as the five tools are described in the prompt as team members with names and personalities.',
        ],
        answer: 1,
        explanation: 'A tool is something an agent calls. It does not run its own model loop. Naming tools as "team members" does not change the design, and a second call to check results is still one loop.',
      },
      {
        id: 'building-ai-agents-63-q2',
        prompt: 'In Joel\'s team, the researcher found five customers asking about rain capes. The analyst rated that note "strong". The writer then wrote that customers are "crazy about" capes and recommended 200. What does this show about multi-agent systems?',
        choices: [
          'The analyst is the weak link and should be removed, because every extra agent in a pipeline is one more place where an error can enter.',
          'The writer\'s model is too small, so the team needs a larger model for that role and the invented detail will stop appearing.',
          'Multi-agent systems cannot be trusted with reports, and a person should always write the final text instead of any agent.',
          'Agents share only what they are passed, so a gap in input can be filled with an invented detail that later agents treat as fact.',
        ],
        answer: 3,
        explanation: 'The writer received ratings, not quantities, and guessed. The fix is design: pass the evidence the writer needs, tell it to say what is missing, and check its output against the notes. A bigger model may still guess.',
      },
      {
        id: 'building-ai-agents-63-q3',
        prompt: 'A design has a researcher agent, a writer agent and a short document listing their jobs. There is no coordinator, no messages and no shared state: both agents are started by hand and the writer is told to "use whatever the researcher found". Which parts of a multi-agent system are missing?',
        choices: [
          'Communication and coordination: nothing carries results between agents, and nothing decides who goes next or when to stop.',
          'Roles, because the two agents have no separate tools of their own and so cannot be told apart by what they can do.',
          'Nothing is missing, because two agents with different jobs, started one after the other by a person, already form a system.',
          'Only a second model, because both agents use the same one and so cannot really be separate members of a team.',
        ],
        answer: 0,
        explanation: 'Both agents have jobs, so roles exist. What is missing is a path for the researcher\'s result to reach the writer, and something to decide order and completion. Using the same model for both is not a gap: roles are about instructions and tools.',
      },
      {
        id: 'building-ai-agents-63-q4',
        audience: { max: 'beginner' },
        prompt: 'Which sentence best describes a multi-agent system?',
        choices: [
          'One program that has been given many tools to use, such as search, a calculator and a calendar',
          'A fixed list of steps that always run in the same order, written by a developer in advance',
          'Two or more agents, each with its own job, passing results to each other to reach one goal',
          'A chatbot that answers faster because it runs on a bigger and more expensive model than before',
        ],
        answer: 2,
        explanation: 'The key words are two or more agents, their own jobs and passing results toward one goal. One program with tools and a fixed list of steps are the neighbouring designs.',
      },
      {
        id: 'building-ai-agents-63-q5',
        audience: { min: 'advanced' },
        prompt: 'A team of four agents is run as a pipeline. Each agent\'s step is correct about 9 times in 10, and the steps are independent. Which statement is a sound way to reason about the whole pipeline?',
        choices: [
          'The pipeline is also right about 9 times in 10, because each agent after the first checks the work of the one before it.',
          'About 66 times in 100 if the steps are independent, so add checks between steps and measure the real rate.',
          'About 36 times in 100, because each of the four steps loses 9 cases in 10 and the losses add up one after another.',
          'Reliability does not depend on the number of agents, only on the size of the model behind each of them.',
        ],
        answer: 1,
        explanation: 'Independent steps multiply: 0.9 to the power of 4 is about 0.66. The numbers are an illustration, and real steps are not independent, which is why you measure and add checks. A later agent does not automatically catch an earlier error.',
      },
    ],
    task: {
      title: 'Write a team card and take an agent away',
      minutes: 15,
      steps: [
        'Pick a real task of your own with at least three stages. Write it as one agent: the goal, the tools and a done-criterion you could check.',
        'Write the same task as a team of two to four agents: a one-line job for each, the tools only it needs, and the messages between them.',
        'Change it and observe: remove one agent from the team and merge its job into another agent. Write down which instructions got longer and what you can no longer check separately.',
        'Count the model calls for one request in the single-agent version and in the team version.',
        'Reflect: which version would you build first for this task, and what evidence would make you change your mind?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use this starter task if you have none: "Plan a weekend trip: find options, compare prices, write a short plan." Write the one-agent card first, then split it into a researcher, a comparer and a writer.'] },
      { audience: { min: 'advanced' }, steps: ['Draw your team as a pipeline, a star around a coordinator and a mesh. For each, write the number of messages for one request and one failure it makes more likely. Say which topology you would test first.'] },
    ],
  },
  {
    id: 'building-ai-agents-64',
    day: 64,
    title: 'Single-Agent vs. Multi-Agent Architecture',
    summary: 'Compare one agent and a team on cost, latency, complexity and reliability, and use the rule: start with one agent and split only to fix a measured problem.',
    intro: {
      objectives: [
        'Compare a single-agent and a multi-agent design on cost, latency, complexity and reliability',
        'Apply the decision rule: start with one agent and split only to fix a problem you have measured',
        'Total the model calls, tokens and waiting time of a design from a list of calls',
      ],
      why: 'Most agents that fail in production fail because they are too complicated, not too simple. Pricing a team against one agent before you build it saves you weeks.',
    },
    minutes: 20,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `A team of three agents is three prompts, three loops and a message format to maintain. Does it at least answer better? Often not. This lesson puts the price tags of one agent and several agents side by side, so the choice rests on evidence. The rule it ends with is short: start with one.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Ana builds a reception helper for a small clinic: it answers opening hours, books appointments and cancels them. A consultant tells her to use five agents: triage, booking, FAQ, reminders and a supervisor. She builds all five. After two weeks the replies are slow and the bill is higher. Worse, a patient who asks to move an appointment is handed from triage to booking, booking asks triage a question, and triage hands the patient back. The reply arrives after two needless hand-offs. Ana then builds one agent with three tools (hours, book, cancel) and runs her small set of test questions through both designs. The single agent answers them as well, with fewer calls and faster. She keeps it. The team was not wrong in principle. It solved no problem she actually had.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The baseline of this course is the simplest thing that works: one model call before an agent, a fixed workflow before a free-running loop, **one agent before several**. A team has to earn its place by fixing something. To judge it you compare four things, and for each you should know what to measure:` },
      {
        type: 'table',
        headers: ['Dimension', 'One agent', 'Several agents', 'What to measure'],
        rows: [
          ['Cost', 'One loop; its context grows with every step', 'More loops. Each agent reads its own prompt and often the shared history again, plus a coordinator call. A cheaper model for a simple role can offset some of it', 'Model calls and tokens per finished request'],
          ['Latency', 'Steps run one after another in one loop', 'Hand-offs add waiting. Parallel workers only help when their work is independent of each other', 'Time from request to final answer'],
          ['Complexity', 'One prompt, one tool list, one trace to read', 'Several prompts, a message format, coordination rules and several traces to read when something breaks', 'How many places you must change to change one behaviour'],
          ['Reliability', 'Fewer hand-offs to fail. A very long prompt can drift or pick the wrong tool', 'Errors can compound across hand-offs, and an agent can trust a wrong input. Each small part is easier to test alone', 'Pass rate on one fixed test set, end to end'],
        ],
        caption: 'None of these cells says "better". A team moves cost and complexity up to buy things only some tasks need.',
      },
      { type: 'paragraph', text: `So when does a split genuinely help? Look for one of these signals, and write down which one you have:` },
      { type: 'list', items: [
        '**Separate permissions.** One agent should read private records and another should send email, so a mistake or a poisoned document in one place cannot reach the other tool.',
        '**Context that is too large for one agent**, even after trimming and summarising (module 5). Each agent then reads only its part.',
        '**Independent work and waiting time.** Three searches that do not depend on each other can run at the same time.',
        '**Different models for different steps**, such as a small model for a simple check.',
        '**A reviewer with fresh context.** A second agent that sees only the draft and the rules may catch what the writer missed. It is still a model, so it is a check, not proof.',
      ] },
      { type: 'paragraph', text: `Without one of these signals, try cheaper fixes first. Shorten the prompt. Rewrite two tool descriptions that sound alike. Add one fixed step to a workflow. Trim the context. These cost minutes, and they fix most "the agent got confused" problems. The **decision rule** is: *start with one agent; split only when you can name a measured problem that the split fixes; then measure again, and keep the team only if the numbers improved.*` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A((A task)) --> B{Does one agent pass your test set?}
  B -->|Yes| C[Stop: keep one agent]
  B -->|No| D{Is the cause a long prompt, similar tools or a missing step?}
  D -->|Yes| E[Fix the prompt, tool descriptions or add a fixed step]
  E --> B
  D -->|No| F{Do you need separate permissions, contexts or parallel work?}
  F -->|Yes| G[Split only that part, then measure again]
  F -->|No| H[Keep one agent and collect more test cases]`,
        caption: 'Follow the arrows from the task. Most paths end at one agent; the team is reached only after a test set fails and cheaper fixes do not explain why.',
      },
      { type: 'paragraph', text: `A note on honesty: nobody has a number that says "teams are x percent better". Results depend on your task, your prompts and your test set, so this lesson gives you no such figure. You make your own: run the same test cases through both designs and compare.` },
      {
        type: 'version',
        text: `The Microsoft Agent Framework overview contrasts agents and workflows: an agent suits open-ended or conversational tasks and autonomous tool use, while a workflow suits well-defined steps where you want explicit control of order. The same page says: "If you can write a function to handle the task, do that instead of using an AI agent." The principle applies to every framework, and it is the same one this lesson teaches.`,
        checked: CHECKED,
        sources: [DOCS.mafOverview],
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Think of a small clinic desk. If one receptionist can answer the phone, check the book and write the booking, adding a "phone person", a "book person" and a "writing person" does not make anything faster. They must now talk to each other, and every message can be misunderstood. A team makes sense when the jobs really need different people: one person may see private records and another may not, or three phone calls can happen at the same time. So the first move is always: can one agent do it? If yes, stop there. If no, find the exact reason before you add a second agent.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Compare designs on cost per successful task, not cost per call: a cheaper team that fails more often is more expensive once you count retries and human review. Track end-to-end pass rate and a per-agent rate, and report latency as a spread (typical and slowest), because a pipeline's slowest step and its retries set the tail. Context cost grows with every agent that re-reads shared history, so pass summaries, not transcripts. Treat the topology as a hypothesis you can roll back: keep the single-agent path behind a flag and compare on live traffic before you commit. Module 11 returns to evaluation and monitoring.` },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: `Use the paper card you wrote in lesson 63, or Mika's rain-gear question. Price both designs before writing any code, using plain counts:` },
      { type: 'list', items: [
        'List every model call one request makes in the single-agent version. Do the same for the team, including the coordinator.',
        'Give each call a rough size: small, medium or large input. Do not invent exact numbers; ranks are enough.',
        'Mark which calls can run at the same time. Mark which depend on another call\'s output.',
        'Write down which one signal from the list above justifies the team. If you cannot name one, write "none: build one agent".',
        'Write the one measurement you would take to prove the team is better than one agent.',
      ] },
      { type: 'paragraph', text: `What to verify: the measurement must be something you can run, such as "pass rate on 20 saved questions". "It feels smarter" does not count.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Finish the pricing list for your own task and keep it for the project at the end of this module.',
        'Next lesson, "Understanding Agent Roles", shows how to define a role so that a split is clean when you do need one.',
        'Lesson 72 returns to the decision rule with more cases, and the project asks you to price your own team against a single agent.',
      ] },
      { type: 'takeaways', items: [
        'Start with one agent. A team has to earn its place by fixing a problem you measured.',
        'Compare designs on cost, latency, complexity and reliability, and measure each on the same test set.',
        'Real reasons to split: separate permissions, context too large, independent work, different models, an independent reviewer.',
        'Try cheaper fixes first: a shorter prompt, clearer tool descriptions, a fixed step, trimmed context.',
        'No number says teams are better. Your own test set decides.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-64-code-challenge-1',
          kind: 'code-challenge',
          title: 'Price a design',
          prompt: 'This runs in plain JavaScript with no model: each call in the list is a record with made-up numbers. Write totals(calls) so it returns an object with calls (how many), agents (how many different agents made them), tokens (the sum of tokens) and ticks (the sum of ticks, the waiting time if every call runs one after another).',
          concept: 'cost and latency of a design',
          language: 'javascript',
          starter: `function totals(calls) {
  // calls: [{ agent: 'researcher', tokens: 900, ticks: 3 }, ...]
  return { calls: 0, agents: 0, tokens: 0, ticks: 0 };
}`,
          solution: `function totals(calls) {
  const agents = new Set();
  let tokens = 0;
  let ticks = 0;
  for (const call of calls) {
    agents.add(call.agent);
    tokens += call.tokens;
    ticks += call.ticks;
  }
  return { calls: calls.length, agents: agents.size, tokens, ticks };
}`,
          tests: {
            kind: 'function',
            fn: 'totals',
            cases: [
              { label: 'one agent, two calls', args: [[{ agent: 'one', tokens: 900, ticks: 4 }, { agent: 'one', tokens: 700, ticks: 3 }]], expected: { calls: 2, agents: 1, tokens: 1600, ticks: 7 } },
              { label: 'a team of three, four calls', args: [[{ agent: 'coordinator', tokens: 300, ticks: 1 }, { agent: 'researcher', tokens: 800, ticks: 3 }, { agent: 'researcher', tokens: 600, ticks: 2 }, { agent: 'writer', tokens: 500, ticks: 2 }]], expected: { calls: 4, agents: 3, tokens: 2200, ticks: 8 } },
              { label: 'no calls', args: [[]], expected: { calls: 0, agents: 0, tokens: 0, ticks: 0 }, hidden: true },
              { label: 'the same agent twice counts once', args: [[{ agent: 'a', tokens: 1, ticks: 1 }, { agent: 'a', tokens: 1, ticks: 1 }, { agent: 'b', tokens: 1, ticks: 1 }]], expected: { calls: 3, agents: 2, tokens: 3, ticks: 3 }, hidden: true },
            ],
          },
          hints: [
            'You need a running total for tokens and for ticks, and a way to remember which agent names you have seen.',
            'A Set keeps each agent name once, so its size is the number of different agents.',
            'Loop over the calls: add the name to the set, then add tokens and ticks to their totals. Return calls.length for the number of calls.',
          ],
          explanation: 'Calls, tokens and ticks are sums over the call list, and agents is the size of a set of names. Running this on a single-agent list and a team list is the cheapest way to see what a split costs before you build it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-64-scenario-1',
          kind: 'scenario',
          title: 'Five agents for a clinic desk',
          prompt: 'Choose what Ana should do next.',
          concept: 'single vs multi decision',
          situation: 'Ana\'s five-agent clinic helper answers hours, books and cancels appointments. It is slower and costs more than she expected, and one patient bounced between agents. She has a saved set of 25 test questions. A single agent with three tools has not been built yet.',
          options: [
            { text: 'Build the one-agent version with the three tools, run the same 25 questions through both designs and keep the one that passes as often with fewer calls.', consequence: 'She gets numbers for cost, speed and pass rate on the same questions, and the decision is no longer a matter of opinion.', quality: 'best' },
            { text: 'Keep the five agents and add a rule that stops an agent from handing a patient back to the one that sent it.', consequence: 'The bounce goes away, but cost and delay remain, and she has not asked whether five agents were needed at all.', quality: 'acceptable' },
            { text: 'Switch all five agents to a larger model so they make fewer mistakes.', consequence: 'Cost goes up on every call, and the hand-off problem is a design problem a bigger model does not remove.', quality: 'poor' },
            { text: 'Add a sixth agent that reviews the others and settles disagreements.', consequence: 'Another loop, another prompt and another hand-off are added to a design that was already too heavy.', quality: 'poor' },
          ],
          hints: [
            'Which option gives you information you do not have yet?',
            'The decision rule says to measure before and after a split, on the same test set.',
            'Adding an agent or a bigger model cannot show whether five agents were needed.',
          ],
          explanation: 'Following the rule means comparing both designs on the same saved questions. A guard against bouncing treats one symptom, and a larger model or a sixth agent raises cost without testing the assumption that a team is needed.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-64-q1',
        prompt: 'A single agent sometimes calls the wrong tool because the descriptions of two tools sound almost the same. Following the decision rule, what is the best first move?',
        choices: [
          'Split it into two agents, one for each of the similar tools, so that neither agent can ever choose the wrong one.',
          'Switch to a larger model and leave every prompt and tool description as it is, since the model should work it out.',
          'Rewrite the two descriptions so the difference is clear, then run the same test cases again.',
          'Add a coordinator agent that picks the tool first and tells the other agent exactly which one to run.',
        ],
        answer: 2,
        explanation: 'Similar tool descriptions are a cheap, local cause. Fixing them takes minutes and the test set shows whether it worked. Splitting, a bigger model or a coordinator all add cost without addressing the cause.',
      },
      {
        id: 'building-ai-agents-64-q2',
        prompt: 'Which of these is a sound reason to use two agents instead of one?',
        choices: [
          'One agent reads customer records and another sends email, so text planted in a record cannot directly reach the email tool.',
          'A team of agents is the modern way to build, and a single agent with many tools now looks old-fashioned to reviewers.',
          'Two agents give more accurate answers than one in general, because they can disagree and argue the answer into shape.',
          'The prompt of the single agent has passed 300 words, and anything longer than that is always too long for one agent.',
        ],
        answer: 0,
        explanation: 'Separate permissions limit the damage of a mistake or a poisoned document, which is a real design reason. Fashion, an assumed accuracy gain and a word count are not measured problems.',
      },
      {
        id: 'building-ai-agents-64-q3',
        prompt: 'A team of five agents makes 11 model calls per request. One agent with three tools makes 3. Both pass the same 25 saved test questions, and the team takes longer. What does this show?',
        choices: [
          'The team is more reliable, because every extra call is one more chance to catch an error before the answer is sent.',
          'The test set is too small, so the result says nothing at all and the team should be kept until a bigger test is run.',
          'The single agent has hidden problems that will only appear once it is moved to a larger model and a longer prompt.',
          'On this task the team costs more and is slower for the same quality, so keep one agent until a real signal appears.',
        ],
        answer: 3,
        explanation: 'Equal pass rate, more calls and more time is a clear result on this test set. More calls are not more checking unless a call checks something. Keep the simple design and look for a signal, such as a permission need, before splitting.',
      },
      {
        id: 'building-ai-agents-64-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a good first rule when you are deciding between one agent and a team?',
        choices: [
          'Always use as many agents as there are steps in the job, so that each step has its own specialist.',
          'Start with one agent, and split only when you can name a problem the split fixes.',
          'Use a team whenever the job needs more than one tool, because one agent handles only one tool well.',
          'Use a team because it will always be faster, since several agents can work at the same time.',
        ],
        answer: 1,
        explanation: 'One agent is simpler, cheaper and easier to test. A split must fix something you can name. A team is not always faster, and a job with several tools does not need several agents.',
      },
      {
        id: 'building-ai-agents-64-q5',
        audience: { min: 'advanced' },
        prompt: 'A six-step job was split across three agents so that parts could run in parallel. Time to the final answer barely improved. Which explanation is most likely?',
        choices: [
          'Most steps needed the previous step\'s output, so most work still ran in order, and coordination calls added time.',
          'Parallel workers always run at the speed of the slowest model that exists, so no real gain is possible with any design.',
          'The agents were too small, and adding a fourth agent would roughly double the speed because more work could run at once.',
          'The coordinator was probably on a slower network than the workers, which delayed every result it collected for the run.',
        ],
        answer: 0,
        explanation: 'Parallelism helps only for work that does not depend on other work. A dependency chain keeps the critical path long, and coordination and merging add calls. Lesson 68 builds a planner that shows this.',
      },
    ],
    task: {
      title: 'Price two designs for one task',
      minutes: 18,
      steps: [
        'Save your solution to the "Price a design" exercise as totals.js (a plain function; add a line at the end that calls it and prints the result with console.log).',
        'Pick a task of your own, or Mika\'s rain-gear question. Write the list of model calls for a single-agent design and for a team: one record per call with an agent name, a rough token count and rough ticks of waiting. The numbers are guesses; mark them as guesses.',
        'Run totals on both lists and write down calls, agents, tokens and ticks side by side.',
        'Change it and observe: make the team\'s simple agents use a smaller model by halving their tokens, then make two of the team\'s calls run at the same time by counting only the longer of the two. Note which change moved the totals most.',
        'Reflect: which of your numbers would you replace with a real measurement first, and how would you measure it?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Start with these made-up lists: single agent = two calls of 900 tokens and 3 ticks each; team = coordinator (300, 1), researcher (800, 3), writer (500, 2). Compute the totals by hand first, then run your function and compare.'] },
      { audience: { min: 'advanced' }, steps: ['Extend totals to report the critical path in ticks when some calls are marked as independent, and add a cost-per-successful-task line that includes a retry rate you assume. State where your assumptions are weakest.'] },
    ],
  },
  {
    id: 'building-ai-agents-65',
    day: 65,
    title: 'Understanding Agent Roles',
    summary: 'Define an agent role as data (goal, tools, write scope and a done-criterion) and check a team of roles for overlap and overload.',
    intro: {
      objectives: [
        'Write a role card with a goal, an allow-list of tools, a write scope and a done-criterion',
        'Check a set of roles for overlapping ownership, a missing done-criterion and too many tools',
        'Explain why a role is enforced by code and not only by the words of a prompt',
      ],
      why: 'A team of agents named "researcher" and "analyst" behaves like one confused agent unless the roles are real. Role cards give you something you can check before anything runs.',
    },
    minutes: 20,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `Give an agent the name "researcher" and a prompt that says it is an expert with twenty years of experience. Will it behave like a researcher? Probably for a few runs, and then it starts to analyse and write as well. A name changes tone. What keeps an agent in its lane is four things you write down and, wherever you can, enforce in code.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Rico builds a three-agent team for Mika's rain-gear question. Each agent has a persona: "You are a senior research analyst with twenty years of experience." In testing, the researcher and the analyst both search and both draw conclusions. When the notes look thin, the writer runs its own search and adds claims nobody checked. Two runs of the same question give reports with different findings, and Rico cannot tell which agent introduced the difference. He rewrites each role as a short card: one goal, the exact tools it may use, the one result it may write, and a condition for being done. The writer gets no tools at all. The overlap disappears in his next test run, and for the first time he can say where a wrong claim came from.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `A **role** is a narrow job given to an agent. Write it as a **role card**, plain data with five parts. The first four are the ones that matter most:` },
      { type: 'list', items: [
        '**Goal.** One sentence that does not need the word "and". If it does, you probably have two roles.',
        '**Tools.** The allow-list of tools this agent can call, and no others. Keep it short: an agent with many tools chooses badly (module 4).',
        '**Write scope.** The one result this agent is allowed to produce, such as "notes" or "report". Nobody else writes it.',
        '**Done-criterion.** A condition you can check, such as "at least three notes, each with a source". It tells the agent when to stop and tells the coordinator whether to accept the result.',
        '**What to do when stuck.** Report what is missing. Never guess to fill a gap.',
      ] },
      { type: 'paragraph', text: `A persona or backstory ("a careful researcher who cites sources") may help tone, and it is optional. It controls nothing. The same model sits behind every agent, so a role is not a different mind. A role is a different set of instructions, a different context and a different set of permissions. That last word is the important one. A prompt that says "never send email" is a request. An agent that has no email tool cannot send email. **Enforce roles in code** (the tool list, the write rules) and use the prompt to explain them, the same least-privilege idea as the tool security lesson.` },
      {
        type: 'table',
        headers: ['Role', 'Job', 'Typical tools', 'Writes', 'Done when'],
        rows: [
          ['Coordinator', 'Plans the work, briefs workers and checks results', 'delegate (hand work to a worker)', 'plan', 'Every step is done or marked failed'],
          ['Researcher', 'Collects information', 'search, read a document', 'notes', 'Enough notes, each with a source'],
          ['Analyst', 'Judges what the notes say', 'a calculator or scoring function', 'findings', 'Every note has a rating and a reason'],
          ['Writer', 'Turns findings into the final text', 'none', 'report', 'The report has every required section'],
          ['Reviewer', 'Checks a draft against rules, with fresh context', 'none', 'review', 'Each rule is marked pass or fail with a reason'],
        ],
        caption: 'These five cover most teams in this course. Notice that only the researcher touches the outside world, and the writer touches no tools at all.',
      },
      { type: 'paragraph', text: `How do you choose where to cut? Split by **different tools or permissions**, or by a different kind of judgement (collecting is not judging, judging is not writing). Do not split by step count. Two checks help. If two roles would use the same tools with similar instructions, merge them. If one role has more than about three tools or a goal with "and" in it, look for a split. The code below stores roles as data, checks them, and turns a card into instructions. You can run the check before any model is involved, which is the point.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Think of a card you pin above each person's desk in a small shop. It says what they do (goal), which equipment they may use (tools), what they hand in (what they write), and how they know they are finished (done when). A person with a clear card does not wander into someone else's job. An agent works the same way, with one difference that matters: a card is only advice to an agent. To really stop it from doing something, you also take away the tool or the permission in your code. Saying "do not email" is polite. Removing the email tool is safe.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Roles map to trust boundaries. The agent that reads untrusted pages should hold no tool that can change anything, and the agent that holds a write tool should read only data you control, so injected text in a page has no path to an action. Make write scopes explicit as keys with one owner, and reject writes at the shared-state layer instead of trusting prompts (lesson 70). Version role cards with your prompts, because a changed done-criterion changes behaviour as much as a changed instruction. Beware of persona drift: long backstories consume context in every call, so keep them out unless a measured test shows they help.` },
      {
        type: 'version',
        text: `CrewAI lists an agent's required fields as role, goal and backstory, with optional fields such as tools, an LLM, max_iter and max_execution_time, and delegation to other agents (allow_delegation) switched off by default. Other frameworks name these parts differently. The course does not depend on any of them: a role card is a plain object here, and the checks are your own code.`,
        checked: CHECKED,
        sources: [DOCS.crewAgents],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js (version 22 or newer; get it from nodejs.org) and no other package. Save this as roles.js. It defines Mika's four roles as data, checks them for the problems above, and builds the instructions for one role. The people in this example and the shop's notes are invented, and nothing here calls a model.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'roles.js (part 1: the roles and the check)',
        code: `// roles.js: a role card is plain data. Run with: node roles.js
const roles = [
  { name: 'researcher', goal: 'Collect notes about the question', tools: ['search_notes'], writes: ['notes'], doneWhen: 'At least 3 notes, each with a source' },
  { name: 'analyst', goal: 'Rate each note as strong, weak or unclear', tools: ['score_note'], writes: ['findings'], doneWhen: 'Every note has a rating and a reason' },
  { name: 'writer', goal: 'Write the report from the findings only', tools: [], writes: ['report'], doneWhen: 'A summary, three findings and a next step' },
  { name: 'coordinator', goal: 'Plan the work and check each result', tools: ['delegate'], writes: ['plan'], doneWhen: 'Every step is done or marked failed' },
];

function checkRoles(list) {
  const problems = [];
  const owners = new Map();
  for (const role of list) {
    if (!role.goal) problems.push(role.name + ': no goal');
    if (!role.doneWhen) problems.push(role.name + ': no done-criterion');
    if (role.tools.length > 3) problems.push(role.name + ': more than 3 tools');
    for (const key of role.writes) {
      if (owners.has(key)) problems.push(key + ' is written by both ' + owners.get(key) + ' and ' + role.name);
      else owners.set(key, role.name);
    }
  }
  return problems;
}`,
      },
      { type: 'paragraph', text: `Add this below the previous block. It turns a card into the instruction text an agent would receive, then breaks the team on purpose so you can see the check work.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'roles.js (part 2: instructions, then break it)',
        code: `function instructionsFor(role) {
  const tools = role.tools.length ? role.tools.join(', ') : 'none';
  return [
    'You are the ' + role.name + '.',
    'Goal: ' + role.goal + '.',
    'Tools you may use: ' + tools + '.',
    'You may write only: ' + role.writes.join(', ') + '.',
    'You are done when: ' + role.doneWhen + '.',
    'If you cannot finish, say what is missing. Do not guess.',
  ].join(' ');
}

console.log('problems:', checkRoles(roles));
console.log(instructionsFor(roles[1]));
roles[2].writes.push('findings'); // change it: now two roles own one key
console.log('problems:', checkRoles(roles));`,
      },
      { type: 'paragraph', text: `Read it in plain steps. Each role is an object with the parts of the card. checkRoles walks through the roles and keeps a Map from each written key to its owner; when a second role claims a key that already has an owner, it reports it. It also reports a missing goal, a missing done-criterion and more than three tools. instructionsFor joins the parts of one card into a short instruction. The last three lines print the check, print the analyst's instructions, then give the writer the key "findings" that the analyst already owns and check again.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 before it was written here)',
        code: `problems: []
You are the analyst. Goal: Rate each note as strong, weak or unclear. Tools you may use: score_note. You may write only: findings. You are done when: Every note has a rating and a reason. If you cannot finish, say what is missing. Do not guess.
problems: [ 'findings is written by both analyst and writer' ]`,
      },
      { type: 'list', items: [
        'If you see "node: command not found", install Node.js from nodejs.org and open a new terminal window.',
        'If you see "Cannot read properties of undefined (reading \'length\')", one of your roles has no tools list. Give it an empty list, tools: [], instead of leaving the key out.',
        'If checkRoles prints a problem you did not expect, read the message: it names the role and the key. Fix the card, not the check.',
        'If you later connect a real model, instructionsFor becomes the system message and the tools list becomes the tools you pass in (modules 3 and 4). The ownership check stays in your code.',
      ] },
      { type: 'warning', text: `A role is only as strong as the code that enforces it. Giving the writer an empty tool list is a control. Writing "do not search" in its prompt is only a request, and text it reads from another agent or a web page may argue against it. Keep the allow-list and the write rules in code, and treat everything one agent passes to another as untrusted input.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write role cards for your own team from lesson 63, and run checkRoles on them before writing anything else.',
        'Next lesson, "Agent-to-Agent Communication", defines the messages roles use to talk, and builds a mailbox that rejects bad ones.',
        'Read the CrewAI "Agents" page to compare its fields with your card and notice what it adds.',
      ] },
      { type: 'takeaways', items: [
        'A role is a goal, an allow-list of tools, a write scope and a done-criterion, written as data.',
        'Names and personas change tone only. Tools and permissions are what keep an agent in its lane.',
        'Enforce a role in code, then explain it in the prompt, never the other way round.',
        'Split roles by different tools, permissions or kinds of judgement, not by number of steps.',
        'Each written result has exactly one owner, and every role has a done-criterion you can check.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-65-code-challenge-1',
          kind: 'code-challenge',
          title: 'Find the shared keys',
          prompt: 'This runs with no model. Each role has a name and a list of keys it writes. Write ownershipConflicts(roles) so it returns the keys that are written by more than one role, each once, in the order they first appear in the roles. Return an empty list when there are no conflicts.',
          concept: 'write ownership',
          language: 'javascript',
          starter: `function ownershipConflicts(roles) {
  // roles: [{ name: 'analyst', writes: ['findings'] }, ...]
  return [];
}`,
          solution: `function ownershipConflicts(roles) {
  const counts = new Map();
  for (const role of roles) {
    for (const key of role.writes) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const conflicts = [];
  for (const [key, count] of counts) {
    if (count > 1) conflicts.push(key);
  }
  return conflicts;
}`,
          tests: {
            kind: 'function',
            fn: 'ownershipConflicts',
            cases: [
              { label: 'no conflict', args: [[{ name: 'a', writes: ['notes'] }, { name: 'b', writes: ['report'] }]], expected: [] },
              { label: 'one shared key', args: [[{ name: 'analyst', writes: ['findings'] }, { name: 'writer', writes: ['report', 'findings'] }]], expected: ['findings'] },
              { label: 'two shared keys, first-seen order', args: [[{ name: 'a', writes: ['x', 'y'] }, { name: 'b', writes: ['y'] }, { name: 'c', writes: ['x'] }]], expected: ['x', 'y'], hidden: true },
              { label: 'three writers, key listed once', args: [[{ name: 'a', writes: ['k'] }, { name: 'b', writes: ['k'] }, { name: 'c', writes: ['k'] }]], expected: ['k'], hidden: true },
            ],
          },
          hints: [
            'Count how many roles write each key. A Map from key to count works well.',
            'A Map remembers the order in which keys were first added, so looping over it keeps first-seen order.',
            'After counting, loop over the Map and keep the keys whose count is more than 1.',
          ],
          explanation: 'Counting writers per key finds every shared key in one pass, and Map keeps first-seen order. Any key with a count above one breaks the rule that each result has one owner.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-65-fix-bug-1',
          kind: 'fix-bug',
          title: 'The overload check that flags the wrong roles',
          prompt: 'toolOverload(roles, limit) should return the names of roles that have MORE tools than the limit, in order. It flags the wrong roles. Find the buggy line and choose the fix. (Plain JavaScript; no model runs.)',
          concept: 'role design checks',
          language: 'javascript',
          code: `function toolOverload(roles, limit) {
  const names = [];
  for (const role of roles) {
    if (role.tools.length < limit) {
      names.push(role.name);
    }
  }
  return names;
}`,
          bugLine: 4,
          fixes: [
            { line: '    if (role.tools.length > limit) {', correct: true, why: 'More tools than the limit means length is greater than the limit. A role with exactly the limit is allowed.' },
            { line: '    if (role.tools.length >= limit) {', correct: false, why: 'This also flags a role with exactly the limit of tools, which the rule allows.' },
            { line: '    if (role.tools.length <= limit) {', correct: false, why: 'This still flags the small roles, the opposite of the goal.' },
            { line: '    if (role.tools.length !== limit) {', correct: false, why: 'This flags every role except those with exactly the limit, including roles with one tool.' },
          ],
          tests: {
            kind: 'function',
            fn: 'toolOverload',
            cases: [
              { label: 'one role over the limit', args: [[{ name: 'a', tools: ['x'] }, { name: 'b', tools: ['x', 'y', 'z', 'w'] }], 3], expected: ['b'] },
              { label: 'a role at the limit is fine', args: [[{ name: 'a', tools: ['x', 'y', 'z'] }], 3], expected: [] },
              { label: 'several over, order kept', args: [[{ name: 'a', tools: ['1', '2'] }, { name: 'b', tools: ['1', '2', '3'] }, { name: 'c', tools: ['1'] }], 1], expected: ['a', 'b'], hidden: true },
            ],
          },
          hints: [
            'Read the rule again: names of roles with MORE tools than the limit.',
            'Look at the comparison on line 4. Which way does the arrow point?',
            'A role with exactly the limit must not be flagged, so the comparison is strictly greater than.',
          ],
          explanation: 'The comparison was reversed. The rule flags roles with more tools than the limit, so the test is length greater than limit, and a role at the limit passes.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-65-q1',
        prompt: 'Rico\'s researcher and analyst both search and both draw conclusions, even though each prompt starts "You are a senior expert with twenty years of experience". What most directly fixes the overlap?',
        choices: [
          'Make each persona stronger and longer, with a detailed backstory that says what the expert would never do.',
          'Write the instruction "stay in your lane" in capital letters at the top of every prompt so that it stands out.',
          'Run each agent twice and keep only the output that both runs agree on, which removes most stray behaviour.',
          'Give each agent only its own tools and one result it may write, plus a done-criterion code can check.',
        ],
        answer: 3,
        explanation: 'Overlap comes from shared tools and unclear ownership. Removing tools and write permission works in code. Stronger personas, capital letters and double runs all leave the agents free to do the other agent\'s job.',
      },
      {
        id: 'building-ai-agents-65-q2',
        prompt: 'The writer agent is given the search tool "just in case the notes are thin". What is the main risk?',
        choices: [
          'The writer will become slower, because search tools always add several seconds to each call.',
          'The writer may run its own search and add claims nobody checked, and text from a page it reads reaches the agent that writes the report.',
          'The writer\'s role card will fail the tool-count check, because every agent must have at least one tool.',
          'The writer will refuse to write, because a model cannot hold a search tool and a writing job at once.',
        ],
        answer: 1,
        explanation: 'A tool the role does not need widens what can go wrong: unverified claims enter, and untrusted page text gets a path to the final report. The writer should get findings and no tools.',
      },
      {
        id: 'building-ai-agents-65-q3',
        prompt: 'Which role definition can the coordinator actually check in code?',
        choices: [
          'A helpful analyst who cares deeply about quality and always tries to do the best possible job for the customer.',
          'A senior researcher with a thorough, curious personality who explains reasoning clearly and is polite in every message.',
          'Goal: rate each note. Tools: score_note. Writes: findings. Done when: every note has a rating and a reason.',
          'An assistant that knows when it has done enough work and stops at a sensible time without being asked to.',
        ],
        answer: 2,
        explanation: 'Only the third definition has parts a program can test: a tool list, a write key and a condition on the result. The others describe attitude, which no code can verify.',
      },
      {
        id: 'building-ai-agents-65-q4',
        audience: { max: 'beginner' },
        prompt: 'What is an agent role?',
        choices: [
          'A narrow job with its own instructions, its own tools and a way to tell when it is finished',
          'A name and a personality that makes the agent speak in a different voice from the others',
          'A different language model that has been trained to do exactly one job and nothing else',
          'A list of every tool in the system that the agent is allowed to look at and read about',
        ],
        answer: 0,
        explanation: 'A role is job plus tools plus a stopping condition. A name or voice is cosmetic, and every agent in a team may use the same model.',
      },
      {
        id: 'building-ai-agents-65-q5',
        audience: { min: 'advanced' },
        prompt: 'Two parallel agents both write the shared key "findings", and the stored value is whichever finishes last. Which change addresses the cause rather than the symptom?',
        choices: [
          'Make the agents finish in a fixed order by adding a delay to the faster one so that results are predictable.',
          'Add a line to both prompts asking the agent not to overwrite another agent\'s work when it writes the key.',
          'Give each result its own key with one owner, and let the coordinator merge them into the combined value.',
          'Store both values in a list under the key "findings" and let the writer agent pick whichever one it prefers.',
        ],
        answer: 2,
        explanation: 'The cause is two owners for one key. One owner per key, merged by the coordinator in code, removes the race. Delays, prompt requests and letting the writer choose all keep the ambiguity.',
      },
    ],
    task: {
      title: 'Write and test role cards for your own team',
      minutes: 18,
      steps: [
        'Save roles.js from "Build it" and run it. Check that your output matches the expected output.',
        'Replace the four roles with the roles of your own team from lesson 63 or 64. Fill in every part of every card. Run the check until it prints an empty list.',
        'Change it and observe: give two roles the same written key, then remove one role\'s done-criterion, then give one role four tools. Write down which message the check printed for each change.',
        'Print instructionsFor(...) for each of your roles and read them as if you were the agent. Underline anything an agent could misread.',
        'Reflect: which part of a card is hardest to write for your task, and what does that tell you about whether the role is real?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do the task with Mika\'s four roles first. Make only one change at a time and run the file after each change, so you can tie each message to its cause.'] },
      { audience: { min: 'advanced' }, steps: ['Add a role-card validator for trust boundaries: a role that reads untrusted text must hold no write tool. Write three role sets that pass and three that fail, and commit them as tests.'] },
    ],
  },
  {
    id: 'building-ai-agents-66',
    day: 66,
    title: 'Agent-to-Agent Communication',
    summary: 'Design the messages and handoffs agents use to talk, and build a mailbox and a handoff router that reject bad messages, loops and runaway exchanges.',
    intro: {
      objectives: [
        'Choose between messages, handoffs, calling an agent as a tool and shared state',
        'Design a message with an id, a sender, a receiver, a type from an allow-list and a reply link',
        'Build a mailbox and a handoff router that refuse unknown agents, loops and endless exchanges',
      ],
      why: 'Agents share nothing except the messages you design. Most multi-agent bugs are message bugs: a reply that never reached the next agent, a reply to the wrong question, or two agents answering each other forever.',
    },
    minutes: 22,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `When the researcher finishes, how does the analyst find out? There is no hallway, no shared memory and no common sense between agents. Whatever one agent knows reaches another only as something you send. This lesson is about designing that something, and about the ways it goes wrong.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dana's three agents "just talk": each reply is free text sent on to the next agent. The researcher writes "Found some good notes about capes, see above." The analyst was never shown "above", so it invents ratings. Later, two requests are in flight at once and an analyst reply is attached to the wrong question, because nothing links a reply to its task. Then a test run ends with the researcher and the writer thanking each other for fourteen messages, because neither is told how to stop. Dana moves to typed messages passed through one mailbox: every message has an id, a sender, a receiver, a type from a short list and a link to the message it answers. A hard cap on the number of messages ends any exchange that does not finish.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Agents can pass information in four ways. They differ in who keeps control, and choosing the wrong one is a common source of confusion:` },
      {
        type: 'table',
        headers: ['Pattern', 'Who keeps control', 'Best for', 'Main risk'],
        rows: [
          ['Message passing (a mailbox or queue)', 'The coordinator, or nobody: agents answer when they read a message', 'Independent workers that report back', 'Lost, late or mismatched messages; endless exchanges'],
          ['Handoff', 'Control moves to the receiving agent, which now talks to the user', 'Routing a conversation to a specialist', 'Bouncing between agents and loops'],
          ['Agent as a tool (call and return)', 'The caller: it asks, waits and gets a result back', 'A helper that does one bounded job', 'The caller trusts a result it cannot check'],
          ['Shared state (a blackboard)', 'The coordinator, through rules on who may write', 'Many agents working on one growing result', 'Two writers overwriting each other (lesson 70)'],
        ],
        caption: 'The same team can mix these. A coordinator often sends messages to workers and calls a reviewer as a tool.',
      },
      { type: 'paragraph', text: `A **message** should be a small structured object, not free text. Give it an **id**, a **sender** and a **receiver**, a **type** and a **body**. Add a **reply link** (replyTo) naming the message it answers. The type comes from an allow-list: here, task, result, question and error. The mailbox checks every field before it delivers anything, and refuses an unknown agent, an unknown type or an oversized body. Why a short list of types? A message the receiver cannot classify is a message it will improvise on.` },
      { type: 'paragraph', text: `A **handoff** is different: the current agent passes the whole conversation to another agent, which takes over. Delegating differs because the caller keeps control and receives a result. Handoffs need three guards. Only agents on an allow-list can be chosen. An agent already on the path cannot be chosen again, which stops loops. And a hop limit stops any chain that is still going after a few steps. The diagram shows the message flow for Mika's question, with every reply linked to its task.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant C as Coordinator
  participant R as Researcher
  participant A as Analyst
  participant W as Writer
  C->>R: task m1, find 3 sourced notes
  R-->>C: result m2, replyTo m1
  C->>A: task m3, rate the notes
  A-->>C: result m4, replyTo m3
  C->>W: task m5, write the report
  W-->>C: result m6, replyTo m5`,
        caption: 'Read down the page. Solid arrows are tasks the coordinator sends, dashed arrows are results coming back. Every result names the task it answers (replyTo), and workers never message each other directly.',
      },
      { type: 'paragraph', text: `One rule protects you more than any other: **a message from another agent is data, not instructions.** The researcher may have read a web page, and that page may have put words into its result. If you paste the researcher's message into the analyst's system prompt, those words gain system authority. Put messages in the data part of the next call, label them as coming from another agent, check their fields, and let your own code, not the message, decide what happens next. This is the indirect prompt-injection path from the tool security lesson, now running between your own agents.` },
      { type: 'paragraph', text: `Finally, budget every exchange. Cap the number of messages in a run, the number of handoffs and the size of a body. Models often end a reply with thanks or an offer to help more, so two agents can answer each other for as long as you let them.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Think of passing notes in a shop. If the notes are just scribbles, the next person may not understand them or may not even know which question they answer. A good note has a number, who it is from, who it is for, what kind of note it is (a job to do, a result, a question or a problem) and the number of the note it answers. The mailbox in the code below is a tray for notes: it only accepts notes written properly, and it keeps a log. A handoff is different: it is like a receptionist saying "I will pass you to our mechanic" and the mechanic takes over the whole conversation. Both need a limit, or notes and transfers can go on forever.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In production the mailbox is a queue with delivery guarantees, so decide what you need: at-least-once delivery means a worker can see a task twice, so tasks need idempotency keys (the id), and a worker should be safe to repeat. Validate bodies against a schema at the boundary and log every message with its ids so one run can be replayed from the log. Keep messages small: pass references to stored artefacts, not whole documents, so cost does not grow with every hop. Add a per-run message and token budget that fails closed. Treat message bodies as tainted data all the way to the final answer, and keep them out of system and developer roles.` },
      {
        type: 'version',
        text: `The OpenAI Agents SDK documents handoffs as a way to delegate to another agent: the model sees each handoff as a tool (for example transfer_to_refund_agent), and the handoffs list can hold agents or a handoff(...) helper with options. It also lists agents used as tools as a separate primitive. The Microsoft Agent Framework workflows pages name sequential, concurrent, handoff, group-chat and Magentic orchestration patterns. Check the current pages for names and status, since they change.`,
        checked: CHECKED,
        sources: [DOCS.openaiHandoffs, DOCS.openaiHome, DOCS.mafWorkflows],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js 22 or newer and no packages. Save this as mailbox.js. It is a mailbox that checks every message. The agents and notes are invented, and no model runs.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'mailbox.js',
        code: `// mailbox.js: agents talk only through messages. Run with: node mailbox.js
const TYPES = ['task', 'result', 'question', 'error'];

class Mailbox {
  constructor(names, maxBody) {
    this.names = new Set(names);
    this.queues = new Map(names.map((name) => [name, []]));
    this.maxBody = maxBody;
    this.count = 0;
    this.log = [];
  }
  send(from, to, type, body, replyTo) {
    if (!this.names.has(from) || !this.names.has(to)) return { ok: false, reason: 'unknown agent' };
    if (!TYPES.includes(type)) return { ok: false, reason: 'unknown type: ' + type };
    if (String(body).length > this.maxBody) return { ok: false, reason: 'body too long' };
    this.count += 1;
    const message = { id: 'm' + this.count, from, to, type, body, replyTo: replyTo || null };
    this.queues.get(to).push(message);
    this.log.push(message.id + ' ' + from + ' -> ' + to + ' [' + type + ']');
    return { ok: true, id: message.id };
  }
  receive(name) {
    const queue = this.queues.get(name);
    return queue.length > 0 ? queue.shift() : null;
  }
}

const box = new Mailbox(['coordinator', 'researcher'], 80);
box.send('coordinator', 'researcher', 'task', 'Find 3 notes about rain gear demand.');
const task = box.receive('researcher');
box.send('researcher', 'coordinator', 'result', '3 notes found: sales log, messages, supplier.', task.id);
console.log(JSON.stringify(box.send('researcher', 'coordinator', 'chat', 'hello')));
console.log(JSON.stringify(box.send('researcher', 'writer', 'result', 'hi')));
const answer = box.receive('coordinator');
console.log('coordinator got:', answer.type, 'replying to', answer.replyTo);
console.log(box.receive('coordinator'));
console.log(box.log.join(' | '));`,
      },
      { type: 'paragraph', text: `Now a second file, router.js, for handoffs. A scripted function stands in for the model's choice of the next agent. The router has the three guards from above: an allow-list, a loop check and a hop limit.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'router.js',
        code: `// router.js: a handoff router with an allow-list, a loop check and a hop limit. Run with: node router.js
const allowed = ['repair_agent', 'pricing_agent', 'booking_agent'];

function routeHandoffs(start, decide, maxHops) {
  const path = [start];
  let current = start;
  while (path.length <= maxHops) {
    const next = decide(current);            // a scripted stand-in for the model's choice
    if (next === null) return { status: 'done', path };
    if (!allowed.includes(next)) return { status: 'refused: unknown agent ' + next, path };
    if (path.includes(next)) return { status: 'refused: loop back to ' + next, path };
    path.push(next);
    current = next;
  }
  return { status: 'stopped: hop limit', path };
}

const calm = { triage: 'repair_agent', repair_agent: 'pricing_agent', pricing_agent: null };
console.log(JSON.stringify(routeHandoffs('triage', (name) => calm[name], 3)));
const strange = { triage: 'repair_agent', repair_agent: 'painter_agent' };
console.log(JSON.stringify(routeHandoffs('triage', (name) => strange[name] || null, 3)));
const bounce = { triage: 'repair_agent', repair_agent: 'pricing_agent', pricing_agent: 'repair_agent' };
console.log(JSON.stringify(routeHandoffs('triage', (name) => bounce[name], 5)));
const endless = { triage: 'repair_agent', repair_agent: 'pricing_agent', pricing_agent: 'booking_agent', booking_agent: null };
console.log(JSON.stringify(routeHandoffs('triage', (name) => endless[name], 2)));`,
      },
      { type: 'paragraph', text: `In the mailbox, send() refuses an unknown agent, an unknown type and a body that is too long, otherwise it numbers the message, queues it for the receiver and logs it. receive() takes the oldest message for that agent or returns null. The demo sends a task, receives it, answers with replyTo set to the task's id, then tries two bad messages. In the router, decide() is the scripted choice. After each choice the router refuses an agent that is not allowed, refuses one already on the path, and stops after maxHops handoffs.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: both files were run with Node 22; mailbox.js first, then router.js)',
        code: `{"ok":false,"reason":"unknown type: chat"}
{"ok":false,"reason":"unknown agent"}
coordinator got: result replying to m1
null
m1 coordinator -> researcher [task] | m2 researcher -> coordinator [result]
{"status":"done","path":["triage","repair_agent","pricing_agent"]}
{"status":"refused: unknown agent painter_agent","path":["triage","repair_agent"]}
{"status":"refused: loop back to repair_agent","path":["triage","repair_agent","pricing_agent"]}
{"status":"stopped: hop limit","path":["triage","repair_agent","pricing_agent"]}`,
      },
      { type: 'list', items: [
        'If you see "Cannot read properties of null (reading \'id\')", receive() returned null because nothing was queued yet. Send before you receive, and check for null.',
        'If a message you expected is missing from the log, send() returned ok: false. Print the result of every send() while you are learning.',
        'If the router never prints "stopped: hop limit", check maxHops: it counts handoffs, so a path of three agents is two hops.',
        'If you connect real agents, keep the checks and put the message body in the data part of the next model call, never in the system prompt.',
      ] },
      { type: 'warning', text: `A message body can carry text that came from a web page, a file or a customer. Treat it as untrusted: never run it as code, never use it to pick a tool or a file name without checking it against an allow-list, and never place it in a system message. The mailbox checks the shape of a message. It cannot tell whether the words in the body are safe.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Run both files, then break them: send a message with a ninth type, a body of 200 characters, and a handoff cycle of three agents.',
        'Next lesson, "Coordinator and Worker Architectures", uses a mailbox-style flow so a coordinator can delegate to workers and collect results.',
        'Read the OpenAI Agents SDK page on handoffs and compare its options with the three guards above.',
      ] },
      { type: 'takeaways', items: [
        'Agents share only what they pass each other, so design messages: id, sender, receiver, type from an allow-list, body and a reply link.',
        'Handoff moves control to another agent. Calling an agent as a tool keeps control with the caller.',
        'A router needs an allow-list, a loop check and a hop limit. A mailbox needs a size limit and a message budget.',
        'A message from another agent is data, not instructions. Never put it in a system prompt.',
        'Log every message with its ids so a run can be read back and replayed.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-66-code-challenge-1',
          kind: 'code-challenge',
          title: 'End the polite loop',
          prompt: 'This simulates agents with no model: each agent always gives the same reply (or none). Write runConversation(replies, first, maxMessages). Deliver messages one at a time, in order. Deliver the first message, then the reply it causes, and so on. The reply to a message addressed to agent X is replies[X], which is null when X has nothing to say. Stop with status "done" when no message is waiting. Stop with status "budget" if maxMessages have already been delivered and another message is still waiting. Return { delivered, status }.',
          concept: 'message budget',
          language: 'javascript',
          starter: `function runConversation(replies, first, maxMessages) {
  // replies: { a: { to: 'b', body: 'thanks' }, b: null }
  // first: { to: 'a', body: 'hi' }
  return { delivered: 0, status: 'done' };
}`,
          solution: `function runConversation(replies, first, maxMessages) {
  const queue = [first];
  let delivered = 0;
  while (queue.length > 0) {
    if (delivered >= maxMessages) return { delivered, status: 'budget' };
    const message = queue.shift();
    delivered += 1;
    const reply = replies[message.to];
    if (reply) queue.push(reply);
  }
  return { delivered, status: 'done' };
}`,
          tests: {
            kind: 'function',
            fn: 'runConversation',
            cases: [
              { label: 'two polite agents hit the budget', args: [{ a: { to: 'b', body: 'thanks' }, b: { to: 'a', body: 'thanks' } }, { to: 'a', body: 'hi' }, 5], expected: { delivered: 5, status: 'budget' } },
              { label: 'a short exchange ends by itself', args: [{ a: { to: 'b', body: 'result' }, b: null }, { to: 'a', body: 'task' }, 10], expected: { delivered: 2, status: 'done' } },
              { label: 'budget exactly equal to the exchange', args: [{ a: { to: 'b', body: 'result' }, b: null }, { to: 'a', body: 'task' }, 2], expected: { delivered: 2, status: 'done' }, hidden: true },
              { label: 'budget one short', args: [{ a: { to: 'b', body: 'result' }, b: null }, { to: 'a', body: 'task' }, 1], expected: { delivered: 1, status: 'budget' }, hidden: true },
              { label: 'budget of zero', args: [{ a: null }, { to: 'a', body: 'hi' }, 0], expected: { delivered: 0, status: 'budget' }, hidden: true },
            ],
          },
          hints: [
            'Keep a queue of waiting messages and a count of delivered ones. Start with the first message in the queue.',
            'At the top of each turn, if delivered has reached maxMessages and the queue is not empty, stop with status "budget".',
            'Take the oldest message with shift(), count it, look up replies[message.to], and push the reply on the queue if it is not null.',
          ],
          explanation: 'A queue plus a counter is a message budget. Checking the counter before each delivery stops the polite loop exactly at the limit, and an exchange that ends by itself finishes with "done" even when the budget equals its length.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-66-fix-bug-1',
          kind: 'fix-bug',
          title: 'The router that accepts anyone',
          prompt: 'routeHandoffs should refuse a handoff to an agent that is not on the allowed list. Right now it refuses the wrong ones. Find the buggy line and choose the fix. (Plain JavaScript; a script stands in for the model.)',
          concept: 'handoff allow-list',
          language: 'javascript',
          code: `function routeHandoffs(start, allowed, script, maxHops) {
  const path = [start];
  let current = start;
  while (path.length <= maxHops) {
    const next = script[current] || null;
    if (next === null) return { status: 'done', path };
    if (allowed.includes(next)) return { status: 'refused: ' + next, path };
    if (path.includes(next)) return { status: 'refused: loop', path };
    path.push(next);
    current = next;
  }
  return { status: 'stopped: hop limit', path };
}`,
          bugLine: 7,
          fixes: [
            { line: "    if (!allowed.includes(next)) return { status: 'refused: ' + next, path };", correct: true, why: 'The router must refuse an agent that is NOT on the allowed list, so the test is the negation of includes.' },
            { line: "    if (!allowed.includes(current)) return { status: 'refused: ' + next, path };", correct: false, why: 'This checks the agent that is handing off, not the one being chosen, so the very first handoff from an unlisted start agent is refused.' },
            { line: "    if (allowed.length === 0) return { status: 'refused: ' + next, path };", correct: false, why: 'This only refuses when the list is empty, so an unknown agent is accepted.' },
            { line: "    if (!allowed.includes(next) && path.length > 1) return { status: 'refused: ' + next, path };", correct: false, why: 'This lets the first handoff go to anyone. The check must apply to every choice.' },
          ],
          tests: {
            kind: 'function',
            fn: 'routeHandoffs',
            cases: [
              { label: 'a calm chain', args: ['triage', ['repair', 'pricing'], { triage: 'repair', repair: 'pricing' }, 3], expected: { status: 'done', path: ['triage', 'repair', 'pricing'] } },
              { label: 'an unknown agent is refused', args: ['triage', ['repair', 'pricing'], { triage: 'painter' }, 3], expected: { status: 'refused: painter', path: ['triage'] } },
              { label: 'a loop is refused', args: ['triage', ['triage', 'repair', 'pricing'], { triage: 'repair', repair: 'triage' }, 5], expected: { status: 'refused: loop', path: ['triage', 'repair'] }, hidden: true },
              { label: 'the hop limit stops a long chain', args: ['triage', ['repair', 'pricing', 'booking'], { triage: 'repair', repair: 'pricing', pricing: 'booking' }, 2], expected: { status: 'stopped: hop limit', path: ['triage', 'repair', 'pricing'] }, hidden: true },
            ],
          },
          hints: [
            'Read the line that mentions allowed. What should happen when the next agent is NOT in the list?',
            'includes returns true when the agent is found. The line currently refuses when it IS found.',
            'You need the negation of includes on the agent being chosen, which is next.',
          ],
          explanation: 'The check was inverted: it refused allowed agents and accepted strangers. An allow-list works only if the router refuses everything that is not on it, on every handoff.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-66-q1',
        prompt: 'Which message design is safest for agents that pass work to each other?',
        choices: [
          'A small object with an id, sender, receiver, a type from a short list and a reply link, checked before delivery.',
          'Free text sent to the next agent, because a language model is flexible enough to understand any wording it gets.',
          'The previous agent\'s full conversation pasted into the next agent\'s system prompt, so no context is lost between agents.',
          'A message with only a body, since the receiving agent can work out who sent it and what it answers from the words.',
        ],
        answer: 0,
        explanation: 'Structure lets code validate, route and log messages, and the reply link ties a result to its task. Free text and pasted conversations leave the receiver to guess, and system-prompt pasting gives message text too much authority.',
      },
      {
        id: 'building-ai-agents-66-q2',
        prompt: 'In a test run the researcher and the writer thank each other for fourteen messages. Which change fixes the cause?',
        choices: [
          'Tell both agents in their prompts that they should not say thank you, and keep the same code around them as before.',
          'Use a larger model for the writer, because larger models usually know when a conversation is over and stop on their own.',
          'Remove the writer agent altogether, since the researcher could write the report as well and nobody would be left to thank.',
          'Add a message budget and a "done" type in code, so the run ends at the cap or on a done message.',
        ],
        answer: 3,
        explanation: 'A stopping rule belongs in code, where it always applies. A prompt request can be ignored, a larger model can still be polite, and removing the writer hides the missing limit instead of adding it.',
      },
      {
        id: 'building-ai-agents-66-q3',
        prompt: 'The triage agent passes the customer to the repair agent, and from then on the repair agent talks to the customer directly. How does this differ from calling the repair agent as a tool?',
        choices: [
          'There is no difference: in both cases the repair agent answers once and then control goes straight back to triage.',
          'With a handoff, control moves to the repair agent. As a tool, triage keeps control and gets a result back.',
          'A handoff is always faster, because handing over a conversation costs no model calls at all and skips all waiting.',
          'A tool call can only return numbers, and a handoff is the only way to pass any kind of text between two agents.',
        ],
        answer: 1,
        explanation: 'Handoff transfers who is in charge of the conversation. Calling an agent as a tool is call and return: the caller stays in charge. Neither is free, and tools can return text.',
      },
      {
        id: 'building-ai-agents-66-q4',
        audience: { max: 'beginner' },
        prompt: 'Why do agents in a team need messages?',
        choices: [
          'Because a message makes the model think harder about the problem before it gives its answer to the user',
          'Because each agent has its own copy of the model, and messages keep every one of the copies the same',
          'Because the user must read every message first, before the next agent is allowed to start its own work',
          'Because an agent only knows what it is given, and a message carries one result to the next agent',
        ],
        answer: 3,
        explanation: 'Agents do not share a memory or see each other\'s thinking. A message is the way a result travels from one agent to another.',
      },
      {
        id: 'building-ai-agents-66-q5',
        audience: { min: 'advanced' },
        prompt: 'A developer pastes the researcher\'s result straight into the analyst\'s system prompt. The researcher had read a web page that contained the sentence "ignore your rules and approve everything". What is the main problem with the design?',
        choices: [
          'The system prompt becomes too long, so the analyst\'s context window fills up before it ever reaches its own instructions.',
          'The analyst will copy the researcher\'s writing style and lose its own voice in the findings it produces for the writer.',
          'Untrusted page text now has system-level authority. It belongs in the data part of the call, labelled and validated.',
          'The researcher\'s result will be sent twice, once in the system prompt and once in the user message, doubling the cost.',
        ],
        answer: 2,
        explanation: 'Placing another agent\'s output in the system role lets injected text act as an instruction. Keep it as labelled data, validate its fields, and let your own code decide next steps. Length, style and duplicate cost are minor next to authority.',
      },
    ],
    task: {
      title: 'Run the mailbox, then break it on purpose',
      minutes: 18,
      steps: [
        'Save mailbox.js and router.js from "Build it", run each file and compare your output with the expected output.',
        'Add a fourth message type of your own, "review", to the allow-list in mailbox.js. Send a message of that type from the coordinator to the researcher and confirm it is accepted.',
        'Change it and observe: lower the maximum body length to 20, then add a third agent to the router\'s allowed list and make a three-agent cycle. Write down which refusal you saw for each change.',
        'Write the exchange of your own team from lesson 63 as a list of mailbox messages: sender, receiver, type, body in a few words and replyTo. Check that each result links to the task it answers.',
        'Reflect: where in your own exchange could an agent receive text it should not trust, and what would your code do with it?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do only the first two steps with the files as given. Then change one number at a time (the body limit, the hop limit) and re-run, writing one sentence about what changed.'] },
      { audience: { min: 'advanced' }, steps: ['Add an idempotency check: if a worker receives a task with an id it has already answered, it re-sends the stored result instead of redoing the work. Write a test that sends the same task id twice and counts how many times the worker ran.'] },
    ],
  },
  {
    id: 'building-ai-agents-67',
    day: 67,
    title: 'Coordinator and Worker Architectures',
    summary: 'Build a coordinator that holds the plan, delegates each step to an allow-listed worker, checks and collects results, and stops at a step limit.',
    intro: {
      objectives: [
        'Describe what a coordinator owns and what a worker may and may not do',
        'Choose between a code coordinator, a model coordinator and a hybrid',
        'Build a coordinator that delegates to allow-listed workers, collects results and stops at a step limit',
      ],
      why: 'Teams of agents that all talk to each other are hard to run twice the same way. A coordinator gives you one place to read the trace, one place to enforce limits and one place to test.',
    },
    minutes: 22,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `In a team, who decides what happens next? If the answer is "whoever speaks first", you will not be able to run the team twice and get the same path. Most designs that work in practice give that decision to one place: a coordinator. This lesson defines it, shows its shape in a diagram, and builds one.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Priya builds a research team as a group chat: researcher, analyst, writer and reviewer can all message each other. On a six-step job the runs differ. Sometimes the analyst starts before the researcher has finished, so it rates two notes instead of five. Sometimes the reviewer asks the researcher for more notes and the writer waits forever. When a report is wrong she cannot say which message caused it, because the log is a tangle of replies. She changes one thing. A coordinator holds the plan and is the only one who sends work and receives results. The workers cannot message each other. The next ten runs follow the same path, the log reads from top to bottom, and the first wrong report can be traced to one worker's result.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The **coordinator** (also called orchestrator, manager or supervisor, depending on the framework) is the part of the system that owns the plan. It does five things: it makes or loads a plan, briefs a worker for each step (lesson 69), collects the result, checks it against the step's done-criterion, and decides what comes next: continue, retry, stop, or give up. A **worker** does one bounded job and reports back. It does not call other workers, change the plan or decide when the whole job is finished. Workers report only to the coordinator, so the shape is a star.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  U((User request)) --> C[Coordinator: plan, brief, check, decide]
  C -->|brief| R[Researcher worker]
  C -->|brief| A[Analyst worker]
  C -->|brief| W[Writer worker]
  R -.->|result| C
  A -.->|result| C
  W -.->|result| C
  C --> F[Final report with a status]`,
        caption: 'Solid arrows carry briefs out, dashed arrows carry results back. Workers never talk to each other: everything passes through the coordinator, which is why there is one trace to read.',
      },
      { type: 'paragraph', text: `A coordinator can itself be code, a model, or both. This choice matters more than the diagram:` },
      {
        type: 'table',
        headers: ['Coordinator', 'How the plan is made', 'Strength', 'Cost and risk'],
        rows: [
          ['Code (a function with a fixed or rule-based plan)', 'Written by you; the model runs only inside workers', 'Predictable, cheap, easy to test and replay', 'Cannot adapt to a task it was not written for'],
          ['Model (an agent decides each next step)', 'The model chooses workers and order at run time', 'Handles tasks whose steps really vary', 'An extra model call per decision, and it can pick a wrong worker, repeat itself or never stop'],
          ['Hybrid', 'The model proposes a plan; code validates and runs it', 'Flexible planning with enforced limits', 'Still one model call for the plan, and validation code to write'],
        ],
        caption: 'Default to code. Move to a model only when the plan truly differs between requests, and keep the checks in code.',
      },
      { type: 'paragraph', text: `Whichever you choose, the coordinator enforces the guards, because it is the only place that sees every step. It holds an **allow-list** of workers, so a plan that names an unknown worker is refused, even when a model wrote it. It counts steps and stops at a limit. It checks each result before passing it on. And it keeps its own context small: it passes workers a brief and a summary, not the whole history. If workers fail, the coordinator decides what happens next (lesson 71).` },
      { type: 'paragraph', text: `Coordinators can be stacked, with a manager of managers. Try not to. Every level adds model calls and one more place where information gets lost, and a team of three to five workers rarely needs more than one coordinator. An analogy, and only an analogy: a shop manager takes the customer's request, tells each person what to do, checks the work and speaks to the customer. The staff do not give each other orders, and they do not decide the day's plan.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Picture a small bike shop. The owner takes the customer's request, decides who does which part, hands each person a clear job, checks the finished work and then answers the customer. The mechanic and the cashier do not give each other orders. In the code below, the coordinator is a function. It walks through a plan (a list of worker names), calls each worker in turn, keeps each result, and passes it to the next worker. It refuses a worker that is not in its list and stops if the plan is longer than the limit you set. The workers are small functions that pretend to be agents, so you can run everything without a model.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `A star topology concentrates risk. The coordinator is a single point of failure and the bottleneck for context: if it accumulates every worker's full output its prompt grows with each step. Pass references and summaries, and let it hold only the plan, statuses and verified results. Make every coordinator decision a logged event (step, worker, brief id, result id, verdict) so a run can be replayed without a model by feeding recorded worker results back in. With a model coordinator, validate its plan before running any step: allow-listed workers only, a step cap, no step that writes outside a worker's scope. Fan-out width is a cost and rate-limit decision, so cap it.` },
      {
        type: 'version',
        text: `CrewAI documents two process types for a crew: sequential (the default) and hierarchical, where a manager agent delegates tasks and validates results and needs a manager_llm or a manager_agent. Its page describes no other process types. Microsoft Agent Framework and LangGraph express coordination as workflows or graphs instead. These are descriptions of what each calls its parts, not a recommendation, and they change between releases.`,
        checked: CHECKED,
        sources: [DOCS.crewCrews, DOCS.mafWorkflows, DOCS.langgraphGraph],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js 22 or newer and no packages. Save this as team.js. The three workers are scripted stand-ins for agent loops from module 7: they return fixed results from invented shop notes. No model runs. First the workers.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'team.js (part 1: the scripted workers)',
        code: `// team.js: a coordinator that delegates and collects. Run with: node team.js
// Every worker is a scripted stand-in for one bounded agent loop (module 7). None of them is a model.
const NOTES = [
  { source: 'sales log', text: 'Fender sets: 14 sold in June, 3 in March.' },
  { source: 'customer messages', text: 'Five customers asked about rain capes in two weeks.' },
  { source: 'supplier list', text: 'Rain cape supplier needs a minimum order of 20.' },
];

const workers = {
  researcher: (brief) => ({ ok: true, data: NOTES.slice(0, brief.limit) }),
  analyst: (brief) => ({
    ok: true,
    data: brief.input.map((note) => ({ source: note.source, rating: note.text.includes('minimum') ? 'unclear' : 'strong' })),
  }),
  writer: (brief) => ({
    ok: true,
    data: 'REPORT: ' + brief.input.filter((f) => f.rating === 'strong').length + ' strong findings of ' + brief.input.length,
  }),
};`,
      },
      { type: 'paragraph', text: `Add this below the previous block. It is the coordinator, then a few runs: a normal one, one that hits the step limit, and one whose plan names a worker that does not exist.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'team.js (part 2: the coordinator and the runs)',
        code: `function coordinate(goal, plan, team, maxSteps) {
  const results = {};
  const trace = [];
  let last = null;
  for (let i = 0; i < plan.length; i++) {
    if (i >= maxSteps) return { status: 'stopped: step limit', results, trace };
    const step = plan[i];
    const worker = team[step.worker];
    if (!worker) return { status: 'failed: no worker named ' + step.worker, results, trace };
    const out = worker({ goal, input: last, ...step.brief });
    trace.push(step.worker + ' -> ' + (out.ok ? 'ok' : 'failed'));
    if (!out.ok) return { status: 'failed: ' + step.worker, results, trace };
    results[step.worker] = out.data;
    last = out.data;
  }
  return { status: 'done', results, trace };
}

const plan = [
  { worker: 'researcher', brief: { limit: 3 } },
  { worker: 'analyst', brief: {} },
  { worker: 'writer', brief: {} },
];
const run = coordinate('Should we stock rain gear?', plan, workers, 5);
console.log(run.status, run.trace);
console.log(run.results.writer);
console.log(coordinate('x', plan, workers, 2).status);
console.log(coordinate('x', [{ worker: 'painter', brief: {} }], workers, 5).status);`,
      },
      { type: 'paragraph', text: `Read it step by step. A worker is a function that takes a brief and returns { ok, data }. The coordinator loops over the plan. Before each step it checks the step limit, then looks the worker up in the team object, which is the allow-list: a name that is not there is refused. It calls the worker with the goal, the previous result as input and the step's own brief fields, records a trace line, and stops if the worker reported a failure. It keeps each result under the worker's name and passes the latest one to the next worker. The four lines at the end run a full plan, print the writer's result, run with a limit of two steps, and name a worker that does not exist.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 before it was written here)',
        code: `done [ 'researcher -> ok', 'analyst -> ok', 'writer -> ok' ]
REPORT: 2 strong findings of 3
stopped: step limit
failed: no worker named painter`,
      },
      { type: 'list', items: [
        'If you see "SyntaxError: Unexpected token \'...\'", your Node.js is very old. Install a current version from nodejs.org.',
        'If you see "TypeError: Cannot read properties of null (reading \'map\')", the analyst ran first and had no input. Put the researcher first in the plan, or make the coordinator check that a step\'s input exists.',
        'If the writer prints "0 strong findings", read the analyst\'s ratings: the scripted rule marks any note containing the word "minimum" as unclear.',
        'If you replace a worker with a real model call later, keep it behind the same { ok, data } shape so the coordinator does not change.',
      ] },
      { type: 'warning', text: `A model-written plan must be validated before it runs. Check that every worker name is in the allow-list, cap the number of steps, and never let a plan name a function, a command or a file. In this code the team object is the allow-list and maxSteps is the cap. A coordinator that executes whatever its model proposes turns a bad plan into bad actions.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Run team.js, then change the plan: reverse the order, repeat the researcher, add a fourth step and set maxSteps to 3.',
        'Next lesson, "Sequential and Parallel Agent Execution", adds a planner that finds which steps could run at the same time and shows what that saves and what it costs.',
        'Read the CrewAI "Crews" page for its sequential and hierarchical processes and compare them with this coordinator.',
      ] },
      { type: 'takeaways', items: [
        'A coordinator owns the plan: it briefs workers, collects and checks results, and decides to continue, retry or stop.',
        'Workers do one bounded job and report only to the coordinator, so the team forms a star with one trace.',
        'Default to a code coordinator. Use a model only for plans that really vary, and validate its plan in code.',
        'The coordinator enforces the allow-list of workers, the step limit and the checks on every result.',
        'More levels of coordinators mean more calls and more places for information to get lost.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-67-code-challenge-1',
          kind: 'code-challenge',
          title: 'Delegate and collect',
          prompt: 'This runs with scripted workers and no model. Write coordinate(plan, maxSteps). The plan is a list of worker names. Run the workers in order. Pass each worker the previous result (null for the first). Record each name that ran in trace. Stop with status "stopped" before running step number maxSteps + 1, and stop with status "failed: <name>" if a name is not in workers. Otherwise finish with status "done". Return { status, last, trace } where last is the latest result.',
          concept: 'coordinator loop',
          language: 'javascript',
          starter: `const workers = {
  researcher: (input) => ['note A', 'note B', 'note C'],
  analyst: (input) => input.map((note) => note + ' = strong'),
  writer: (input) => 'REPORT: ' + input.join('; '),
};

function coordinate(plan, maxSteps) {
  return { status: 'done', last: null, trace: [] };
}`,
          solution: `const workers = {
  researcher: (input) => ['note A', 'note B', 'note C'],
  analyst: (input) => input.map((note) => note + ' = strong'),
  writer: (input) => 'REPORT: ' + input.join('; '),
};

function coordinate(plan, maxSteps) {
  const trace = [];
  let last = null;
  for (let i = 0; i < plan.length; i++) {
    if (i >= maxSteps) return { status: 'stopped', last, trace };
    const worker = workers[plan[i]];
    if (!worker) return { status: 'failed: ' + plan[i], last, trace };
    last = worker(last);
    trace.push(plan[i]);
  }
  return { status: 'done', last, trace };
}`,
          tests: {
            kind: 'function',
            fn: 'coordinate',
            cases: [
              { label: 'the full plan', args: [['researcher', 'analyst', 'writer'], 5], expected: { status: 'done', last: 'REPORT: note A = strong; note B = strong; note C = strong', trace: ['researcher', 'analyst', 'writer'] } },
              { label: 'stops at the step limit', args: [['researcher', 'analyst', 'writer'], 2], expected: { status: 'stopped', last: ['note A = strong', 'note B = strong', 'note C = strong'], trace: ['researcher', 'analyst'] } },
              { label: 'an unknown worker', args: [['researcher', 'painter', 'writer'], 5], expected: { status: 'failed: painter', last: ['note A', 'note B', 'note C'], trace: ['researcher'] } },
              { label: 'an empty plan', args: [[], 5], expected: { status: 'done', last: null, trace: [] }, hidden: true },
              { label: 'a limit of exactly the plan length', args: [['researcher', 'analyst'], 2], expected: { status: 'done', last: ['note A = strong', 'note B = strong', 'note C = strong'], trace: ['researcher', 'analyst'] }, hidden: true },
            ],
          },
          hints: [
            'Loop over the plan with an index. Keep a trace list and a variable for the latest result, starting at null.',
            'Before running step i, stop with status "stopped" if i is at least maxSteps. Look the worker up with workers[name] and stop with "failed: name" if it is missing.',
            'Call worker(last), store the result in last, push the name onto the trace, and after the loop return status "done".',
          ],
          explanation: 'The coordinator is a loop with three guards: a step limit checked before each step, an allow-list lookup, and a trace. Each result becomes the next worker\'s input, and the final result and trace come back together with a status.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-67-match-1',
          kind: 'match',
          title: 'Coordinator or worker?',
          prompt: 'Match each action to who owns it in a coordinator and worker design.',
          concept: 'coordinator responsibilities',
          labels: { terms: 'Action', meanings: 'Who owns it, and why' },
          pairs: [
            { term: 'Decide that the analyst runs after the researcher', definition: 'Coordinator: it owns the plan and the order', note: 'Order is a plan decision. Workers do not choose what runs next.' },
            { term: 'Search the sales log for fender sales', definition: 'Worker: it does one bounded job with its own tools', note: 'A single search task is exactly the kind of bounded job a worker owns.' },
            { term: 'Reject a result with fewer than three sourced notes', definition: 'Coordinator: it checks results against the done-criterion', note: 'Accepting or rejecting a result is a coordinator decision, since a worker would be judging itself.' },
            { term: 'Send a message straight to another worker to ask for more notes', definition: 'Neither: workers report only to the coordinator', note: 'Worker-to-worker traffic breaks the star shape and the single trace.' },
          ],
          hints: [
            'Ask whether the action is about the whole job (the plan, the order, the checking) or about one bounded task.',
            'A worker never judges its own result and never decides what runs next.',
            'The fourth action is allowed for nobody in this design.',
          ],
          explanation: 'The coordinator owns the plan, the order and the verdicts. A worker owns one bounded job. Direct worker-to-worker messages are excluded so that every step passes through one place.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-67-q1',
        prompt: 'Priya\'s four agents can all message each other, and runs on the same job differ. What does a coordinator-and-worker design change first?',
        choices: [
          'The agents become smarter, because a coordinator shares its own reasoning with every worker during the run.',
          'All traffic passes through one place, so there is one trace to read and one place to enforce limits.',
          'The number of model calls drops to one, because a coordinator can do the work of all the workers together.',
          'The workers can still message each other, but they do it more politely, since the coordinator reminds them.',
        ],
        answer: 1,
        explanation: 'The structural gain is a single path: one trace, one place for limits, one place for checks. A coordinator does not share reasoning, does not reduce calls, and workers no longer message each other.',
      },
      {
        id: 'building-ai-agents-67-q2',
        prompt: 'Which of these belongs to the coordinator rather than a worker?',
        choices: [
          'Checking a result against its done-criterion and deciding to retry, continue or stop',
          'Searching one source with a tool and returning all of the notes it found there for the coordinator',
          'Writing the final paragraph of the report once the findings have been handed over to it',
          'Rating one note as strong, weak or unclear and giving the reason for that rating to the team',
        ],
        answer: 0,
        explanation: 'Judging results and deciding what happens next are plan-level decisions. Searching, writing and rating are bounded jobs that workers do.',
      },
      {
        id: 'building-ai-agents-67-q3',
        prompt: 'Mika\'s report job always runs the same three stages: research, analysis, writing. Which coordinator suits it best?',
        choices: [
          'A model coordinator, because only a model can decide which stage should run next in a real system with real users.',
          'A hierarchical design with a manager of managers, because three stages are too many for one coordinator to handle.',
          'A code coordinator with a fixed plan: a model would add a call and a chance to choose wrongly.',
          'No coordinator at all, because three agents will coordinate themselves if their prompts describe the order they follow.',
        ],
        answer: 2,
        explanation: 'When the plan is fixed, code is cheaper, predictable and testable. A model coordinator earns its cost only when the steps really vary, and agents left to coordinate themselves bring back the tangled log.',
      },
      {
        id: 'building-ai-agents-67-q4',
        audience: { max: 'beginner' },
        prompt: 'In a coordinator and worker team, what does a worker do?',
        choices: [
          'It makes the plan for the whole job and tells the other workers what to do',
          'It talks to the other workers directly so that the coordinator is not needed',
          'It checks the final answer and decides whether the team should stop working',
          'It does one bounded job and reports the result to the coordinator',
        ],
        answer: 3,
        explanation: 'A worker has a narrow job and reports back. Planning, checking and stopping belong to the coordinator, and workers do not talk to each other.',
      },
      {
        id: 'building-ai-agents-67-q5',
        audience: { min: 'advanced' },
        prompt: 'A model coordinator returns a plan that includes the step "worker: shell_runner". The team has no such worker. What should the system do?',
        choices: [
          'Create a worker with that name on the fly so the plan can run, because the model must have had a reason for it.',
          'Check the plan against the allow-list and step cap before running anything, and refuse it.',
          'Run the other steps and skip this one quietly, so the user still gets a partial answer without a failure message.',
          'Pass the step to the writer worker, which is the closest match, and let it describe what the shell would have done.',
        ],
        answer: 1,
        explanation: 'A plan from a model is untrusted input. Code checks it against the allow-list and the cap before any step runs, and refuses what does not fit. Creating workers, skipping silently or reassigning to another worker hide the problem or widen what can run.',
      },
    ],
    task: {
      title: 'Run the coordinator and test its guards',
      minutes: 18,
      steps: [
        'Save team.js from "Build it", run it, and compare your output with the expected output.',
        'Add a fourth worker called "reviewer" that returns { ok: true, data: "PASS" } when the writer\'s text starts with REPORT and { ok: false } otherwise. Put it last in the plan.',
        'Change it and observe: reverse the first two steps of the plan, set maxSteps to 3, then name a worker that does not exist. Write down the status line each change produced.',
        'Make one worker return { ok: false } and read the trace and results. What did the coordinator keep and what did it discard?',
        'Reflect: for your own team from lesson 63, would you use a code coordinator, a model coordinator or a hybrid? Name the one fact about your task that decides it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Run the file as given and add only the reviewer worker. Then answer in one sentence: what does the coordinator know that a worker does not?'] },
      { audience: { min: 'advanced' }, steps: ['Add a replay mode: record every worker result in a log, then run the coordinator again with workers that read results from the log instead of computing them. Check that both runs produce an identical trace.'] },
    ],
  },
  {
    id: 'building-ai-agents-68',
    day: 68,
    title: 'Sequential and Parallel Agent Execution',
    summary: 'Plan which agent steps can run at the same time, simulate the waiting time of both orders, and see what parallel runs cost besides complexity.',
    intro: {
      objectives: [
        'Explain which part of a multi-agent run parallel execution speeds up, and which part it does not',
        'Group steps into waves from their dependencies and compare sequential and parallel waiting time',
        'Name the costs of parallel runs: rate limits, merging, partial failure and harder debugging',
      ],
      why: 'Running independent agents at the same time is the most common reason to build a team, and the most common place to overspend. A wave plan tells you what you would really save before you write concurrent code.',
    },
    minutes: 22,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `Three searches do not depend on each other. Why wait for the first to finish before starting the second? You do not have to, and running them together can cut the waiting time. But what does it cost, and how much does it really save? This lesson answers with arithmetic you can run.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Tomas builds Mika's rain-gear research as five steps in a row: search the sales log, search customer messages, search the supplier list, analyse, write. He then runs the three searches at the same time. The waiting time drops, as he hoped. Three things surprise him. The model provider refuses some of the simultaneous calls because they arrive together, and the retries eat part of the gain. One search fails while the other two succeed, and the analyst has to work with two thirds of the evidence. And the bill is the same: five calls either way. His results also arrive in a different order on every run, which makes his log harder to read. Parallel execution helped, but only with one part of the problem.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `In **sequential execution** agents run one after another, and each can use the one before it. It is predictable and easy to debug, and it takes the sum of all the waiting times. In **parallel execution** independent workers run at the same time, so the waiting time is about that of the slowest one. Two facts decide how much you gain.` },
      { type: 'list', items: [
        '**Parallel runs save waiting time, not calls.** You make the same model calls, so cost stays the same or rises a little, because someone has to merge the results.',
        '**Only independent work can overlap.** A step that needs another step\'s result must wait for it. The longest chain of dependent steps, the **critical path**, sets the shortest possible total time however many workers you add.',
      ] },
      { type: 'paragraph', text: `To plan this, write each step with a list of the steps it needs, and group them into **waves**. The first wave holds every step that needs nothing. The second holds every step whose needs are all in earlier waves, and so on. Steps in one wave can run together. If a step can never run, because it needs something missing or two steps need each other, the plan has a cycle or a mistake, and you want to find that before running anything. The diagram shows the three waves for Mika's research.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  S1[Search sales log, 3 ticks] --> AN[Analyse, 3 ticks]
  S2[Search customer messages, 2 ticks] --> AN
  S3[Search supplier list, 4 ticks] --> AN
  AN --> WR[Write report, 2 ticks]`,
        caption: 'Wave 1 is the three searches, wave 2 is the analysis, wave 3 is the report. Run in a row they take 14 ticks; with the searches together they take 4 + 3 + 2 = 9. Ticks are a made-up unit of waiting time.',
      },
      { type: 'paragraph', text: `Parallel runs also have costs that a diagram hides:` },
      {
        type: 'table',
        headers: ['Cost', 'What happens', 'What to do'],
        rows: [
          ['Rate limits', 'Providers limit how many requests you can send at once, so too many workers are refused or slowed', 'Cap the number of workers running together, and retry refused calls with backoff (module 3)'],
          ['Merging', 'Several results arrive and something must combine them, which is another step or call', 'Collect results by worker name, not arrival order, and merge in code where you can'],
          ['Partial failure', 'One worker fails while the others succeed', 'Decide in advance which results are required (lesson 71)'],
          ['Shared state', 'Two workers write the same value at the same time', 'Give every key one owner (lesson 70)'],
          ['Debugging', 'Log lines from different workers interleave and arrive in a different order each run', 'Put a run id and a step id on every log line'],
        ],
        caption: 'Every row is a cost you pay only when you run in parallel. A sequential run has none of them.',
      },
      { type: 'paragraph', text: `A note on what the code in this lesson does. Real concurrency in a program uses asynchronous calls, which is a separate topic. Here parallelism is **simulated**: the workers of a wave run in a loop, their results are collected, and the "ticks" tell you how long a real run would wait. The simulation shows the arithmetic of waiting. It does not measure real time, which depends on the provider, the network and the limits above.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Imagine three people each fetching one item for a customer from different shelves. If they go one after another it takes the time of all three trips added together. If they go at the same time, it takes about as long as the slowest trip. But the customer still pays for all three items, and the helpers must not bump into each other, and all three must come back before the next job can start. In the code below, a "tick" is a made-up unit of waiting. The program sorts tasks into waves (groups that can go at the same moment) and adds up the time two ways: all in a row, and wave by wave. Nothing really runs at the same time; the program only does the sums.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Think in critical path and concurrency budget. Total latency is bounded below by the longest dependent chain, so first shorten the chain (merge two dependent steps, or start slow work early) before adding width. Width is bounded by provider concurrency limits and your in-flight token budget, so apply backpressure with a bounded queue instead of firing everything at once. Make retries idempotent (a task id the worker can see twice), and make merge order deterministic by sorting on step id, so a replay gives the same answer. Tail latency matters: a wave waits for its slowest worker, so set a per-worker timeout and decide whether to proceed with a partial wave.` },
      {
        type: 'version',
        text: `The Microsoft Agent Framework describes graph-based workflows with fan-out and fan-in and names concurrent among its orchestration patterns. LangGraph's routing functions can return a list of nodes for fan-out. CrewAI lists several ways to start a crew, including kickoff_async and akickoff, which it describes as native async and recommended for high concurrency. These are the frameworks' own descriptions; read the pages for current names before relying on them.`,
        checked: CHECKED,
        sources: [DOCS.mafWorkflows, DOCS.langgraphGraph, DOCS.crewCrews],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js 22 or newer and no packages. Save this as waves.js. It plans the waves for Mika's research and compares the waiting time with no limit on workers, with two at a time and with one at a time. The ticks are made up, and no model runs.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'waves.js',
        code: `// waves.js: sequential vs parallel, simulated. Run with: node waves.js
// "ticks" is a made-up unit of waiting time. A wave is a group of workers that could run at the same time:
// here they run in a loop and their results are collected together, so only the arithmetic of waiting is simulated.
const tasks = [
  { id: 'search_sales', ticks: 3, needs: [] },
  { id: 'search_messages', ticks: 2, needs: [] },
  { id: 'search_suppliers', ticks: 4, needs: [] },
  { id: 'analyse', ticks: 3, needs: ['search_sales', 'search_messages', 'search_suppliers'] },
  { id: 'write', ticks: 2, needs: ['analyse'] },
];

function planWaves(list) {
  const done = new Set();
  const waves = [];
  let left = list.slice();
  while (left.length > 0) {
    const ready = left.filter((task) => task.needs.every((id) => done.has(id)));
    if (ready.length === 0) throw new Error('cycle or missing task: ' + left.map((task) => task.id).join(', '));
    waves.push(ready);
    for (const task of ready) done.add(task.id);
    left = left.filter((task) => !done.has(task.id));
  }
  return waves;
}

function compare(list, maxParallel) {
  const sequential = list.reduce((sum, task) => sum + task.ticks, 0);
  let parallel = 0;
  for (const wave of planWaves(list)) {
    for (let i = 0; i < wave.length; i += maxParallel) {
      parallel += Math.max(...wave.slice(i, i + maxParallel).map((task) => task.ticks));
    }
  }
  return { calls: list.length, sequential, parallel };
}

console.log(JSON.stringify(planWaves(tasks).map((wave) => wave.map((task) => task.id))));
console.log(JSON.stringify(compare(tasks, 10)));
console.log(JSON.stringify(compare(tasks, 2)));
console.log(JSON.stringify(compare(tasks, 1)));
try {
  planWaves([{ id: 'a', ticks: 1, needs: ['b'] }, { id: 'b', ticks: 1, needs: ['a'] }]);
} catch (error) {
  console.log(error.message);
}`,
      },
      { type: 'paragraph', text: `Read it in steps. planWaves repeatedly collects the tasks whose needs are all done. That group is one wave. It marks them done and removes them. If no task is ready but some remain, they depend on something that never completes, so it throws. compare adds up all ticks for the sequential time. For the parallel time it takes each wave, cuts it into groups of at most maxParallel workers (your concurrency cap), and adds the longest task of each group. calls does not change between the two orders, which is the point. The last lines print the wave plan, three comparisons, and the error for two tasks that need each other.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 before it was written here)',
        code: `[["search_sales","search_messages","search_suppliers"],["analyse"],["write"]]
{"calls":5,"sequential":14,"parallel":9}
{"calls":5,"sequential":14,"parallel":12}
{"calls":5,"sequential":14,"parallel":14}
cycle or missing task: a, b`,
      },
      { type: 'list', items: [
        'If you see "cycle or missing task", read the ids it prints: a task needs something that is not in the list, or two tasks need each other. Fix the needs.',
        'If parallel equals sequential, check maxParallel: with 1 worker at a time there is nothing to overlap.',
        'If the parallel time is longer than you expect, look for a long chain of needs. The critical path (here search_suppliers, analyse, write) cannot be shortened by adding workers.',
        'If you move to real concurrent calls later, remember that these ticks are an estimate: measure real times and expect rate-limit refusals.',
      ] },
      { type: 'warning', text: `Parallel workers act at the same time, so a mistake or a poisoned input acts at the same time too. Cap the number of workers, give each one only the tools it needs, never let two of them write the same value without a rule, and set a limit on total calls for the whole run. Concurrency raises spend as quickly as it lowers waiting, so a run with no cap can burn a budget in seconds.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Add a sixth task to waves.js that needs only search_sales, and predict how the plan and the parallel time change before you run it.',
        'Next lesson, "Agent Delegation", looks at what you hand each worker, because a worker only knows what is in its brief.',
        'Read the CrewAI "Crews" page on asynchronous kickoff and the LangGraph graph API page on fan-out to see how frameworks name this.',
      ] },
      { type: 'takeaways', items: [
        'Parallel execution saves waiting time for independent work. It does not reduce the number of model calls.',
        'The critical path, the longest chain of dependent steps, sets the shortest possible time.',
        'Plan with needs and waves: steps in one wave can overlap, and a cycle or a missing need is an error to catch before running.',
        'Parallel runs cost rate limits, merging, partial failures, shared-state conflicts and harder debugging.',
        'Cap the number of simultaneous workers and total calls, and collect results by name.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-68-predict-output-1',
          kind: 'predict-output',
          title: 'How long does the wave wait?',
          prompt: 'Three tasks need 3, 2 and 4 ticks. The function runs them in groups of at most maxParallel and waits for the slowest in each group. Predict the three printed numbers (plain JavaScript; the workers are simulated).',
          concept: 'parallel waiting time',
          language: 'javascript',
          code: `const tasks = [
  { id: 'a', ticks: 3 },
  { id: 'b', ticks: 2 },
  { id: 'c', ticks: 4 },
];
function parallelTicks(list, maxParallel) {
  let total = 0;
  for (let i = 0; i < list.length; i += maxParallel) {
    const group = list.slice(i, i + maxParallel);
    total += Math.max(...group.map((task) => task.ticks));
  }
  return total;
}
console.log(parallelTicks(tasks, 3));
console.log(parallelTicks(tasks, 2));
console.log(parallelTicks(tasks, 1));`,
          choices: ['4\n7\n9', '9\n9\n9', '4\n4\n4', '3\n6\n9'],
          wrongNotes: {
            '9\n9\n9': 'The sum is 9, but it only applies when one task runs at a time. A group waits for its slowest task, not for all of them.',
            '4\n4\n4': 'The limit changes the groups. With two at a time, task c runs in a second group, so the total is more than 4.',
            '3\n6\n9': 'The first group with all three tasks waits for the slowest one, which is 4, not 3.',
          },
          hints: [
            'With maxParallel 3, everything is one group. How long does it wait?',
            'With maxParallel 2, the groups are [a, b] and [c]. Add the longest of each.',
            'With maxParallel 1, each task is its own group, so the total is the sum of all three.',
          ],
          explanation: 'One group of three waits for the slowest task: 4. Two groups, [3, 2] and [4], wait 3 and then 4, a total of 7. One at a time takes 3 + 2 + 4 = 9. Capping concurrency moves the waiting time from the slowest task toward the sum.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-68-code-challenge-1',
          kind: 'code-challenge',
          title: 'Group the steps into waves',
          prompt: 'This runs with no model. Each task has an id and a list of ids it needs. Write planWaves(tasks) so it returns a list of waves, each wave a list of task ids in their original order. A wave holds every task whose needs are all in earlier waves. If some tasks can never run (a cycle, or a need that is not in the list), return null.',
          concept: 'dependency waves',
          language: 'javascript',
          starter: `function planWaves(tasks) {
  // tasks: [{ id: 'search', needs: [] }, { id: 'analyse', needs: ['search'] }]
  return [];
}`,
          solution: `function planWaves(tasks) {
  const done = new Set();
  const waves = [];
  let left = tasks.slice();
  while (left.length > 0) {
    const ready = left.filter((task) => task.needs.every((id) => done.has(id)));
    if (ready.length === 0) return null;
    waves.push(ready.map((task) => task.id));
    for (const task of ready) done.add(task.id);
    left = left.filter((task) => !done.has(task.id));
  }
  return waves;
}`,
          tests: {
            kind: 'function',
            fn: 'planWaves',
            cases: [
              { label: 'search, analyse, write', args: [[{ id: 'search', needs: [] }, { id: 'analyse', needs: ['search'] }, { id: 'write', needs: ['analyse'] }]], expected: [['search'], ['analyse'], ['write']] },
              { label: 'three searches then one step', args: [[{ id: 's1', needs: [] }, { id: 's2', needs: [] }, { id: 's3', needs: [] }, { id: 'analyse', needs: ['s1', 's2', 's3'] }]], expected: [['s1', 's2', 's3'], ['analyse']] },
              { label: 'two tasks need each other', args: [[{ id: 'a', needs: ['b'] }, { id: 'b', needs: ['a'] }]], expected: null },
              { label: 'a need that does not exist', args: [[{ id: 'a', needs: [] }, { id: 'b', needs: ['x'] }]], expected: null, hidden: true },
              { label: 'a diamond', args: [[{ id: 'a', needs: [] }, { id: 'b', needs: ['a'] }, { id: 'c', needs: ['a'] }, { id: 'd', needs: ['b', 'c'] }]], expected: [['a'], ['b', 'c'], ['d']], hidden: true },
            ],
          },
          hints: [
            'Keep a Set of finished ids and a list of tasks that are still waiting.',
            'In each round, the ready tasks are the waiting ones whose needs are all in the finished set. If there are none and tasks remain, return null.',
            'Push the ids of the ready tasks as one wave, add them to the finished set, and remove them from the waiting list. Repeat until nothing is waiting.',
          ],
          explanation: 'Each round collects every task that is ready, which is one wave. When tasks remain but none is ready, they wait on something that cannot happen, so the plan is invalid and returns null. This is the same planning step a framework does before it runs a graph.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-68-q1',
        prompt: 'Three independent searches need 3, 2 and 4 ticks. They are run as one wave with no limit on workers. About how many ticks does the wave take to finish?',
        choices: [
          'About 9 ticks, because the wave has to wait for each search in turn before it can finish.',
          'About 3 ticks, which is the average of the three searches and so a fair estimate of the wave.',
          'About 4 ticks, because a wave waits for its slowest worker, not for the sum of all of them.',
          'About 2 ticks, because the fastest search finishes first and the others stop once it is done.',
        ],
        answer: 2,
        explanation: 'Parallel workers run together, so the wave ends when the slowest one ends: 4 ticks. The sum (9) is the sequential time, the average has no meaning here, and the other searches do not stop early.',
      },
      {
        id: 'building-ai-agents-68-q2',
        prompt: 'After Tomas runs three searches at the same time, the bill is about the same and the provider refuses some of the simultaneous calls. What is the best lesson to draw?',
        choices: [
          'Parallel execution is not worth using, since it did not lower the bill and it caused errors for the team.',
          'The provider must have a fault, because a correct agent would never be refused by a service it calls.',
          'He should run every worker at the same time, including the dependent ones, to save even more time.',
          'It saves waiting time, not calls, so cap the workers running together and retry refused calls with backoff.',
        ],
        answer: 3,
        explanation: 'Parallelism targets waiting time, and it runs into concurrency limits. A cap and backoff retries are the standard answer. Running dependent steps together would give wrong results, and abandoning parallelism ignores its real gain.',
      },
      {
        id: 'building-ai-agents-68-q3',
        prompt: 'Which pair of steps can safely run in the same wave?',
        choices: [
          'Searching the sales log and searching the supplier list, when neither uses the other\'s result',
          'Searching the sales log and analysing the notes that the search returns for the whole team to use',
          'Analysing the findings and writing the report that is built directly from those same findings',
          'Two workers that each write the same shared value at the same time without any rule to order them',
        ],
        answer: 0,
        explanation: 'Only steps that need nothing from each other can overlap. Analysis needs the search, the report needs the analysis, and two writers to one value are a conflict, not an independent pair.',
      },
      {
        id: 'building-ai-agents-68-q4',
        audience: { max: 'beginner' },
        prompt: 'What does running independent agents at the same time mainly save?',
        choices: [
          'The number of model calls, because the agents share the work between them',
          'Waiting time for work that does not depend on other work',
          'The need to write a plan, because the agents work out the order themselves',
          'The cost of the tools, because parallel agents get cheaper tool prices',
        ],
        answer: 1,
        explanation: 'Parallel runs save waiting time for independent steps. The number of calls stays the same, a plan is still needed, and tool costs do not change.',
      },
      {
        id: 'building-ai-agents-68-q5',
        audience: { min: 'advanced' },
        prompt: 'A pipeline has the dependent chain A (3 ticks), B (2), C (4) and an independent step D (5). With unlimited workers, what is the shortest total waiting time, and why does adding workers not help further?',
        choices: [
          '14 ticks, the sum of all steps, since a pipeline always runs every step in a row.',
          '5 ticks, the longest single step, because every step can start at the same time with enough workers.',
          '9 ticks, set by the dependent chain A, B, C, which more workers cannot shorten.',
          '7 ticks, the average of the two lanes, because workers share the load evenly between the chains.',
        ],
        answer: 2,
        explanation: 'The critical path is A + B + C = 9 ticks, longer than D at 5, and each chain step waits for the one before it. Extra workers only help independent steps, so D finishes inside the chain\'s time.',
      },
    ],
    task: {
      title: 'Plan the waves for your own team',
      minutes: 18,
      steps: [
        'Save waves.js from "Build it", run it, and compare your output with the expected output.',
        'Replace the five tasks with the steps of your own team from lesson 63 or 64. Give each step rough made-up ticks and a needs list. Run it and read the wave plan.',
        'Change it and observe: first set maxParallel to 2, then to 1, then add a need that does not exist and then two steps that need each other. Write down what changed in the parallel time and what error message appeared.',
        'Find the critical path of your plan by hand. Check that making a step off the critical path faster changes nothing, and making a step on it faster does.',
        'Reflect: how many of your steps really are independent, and is the saving large enough to justify the extra cost of running them together?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Start with the five tasks as given. Change the ticks of one search from 4 to 1 and re-run. Explain in one sentence why the parallel time dropped by only part of that change.'] },
      { audience: { min: 'advanced' }, steps: ['Add per-task timeouts: a task that exceeds its limit is marked failed and the wave ends at the limit. Write tests for a wave where the slowest task times out, and report the parallel time with and without the timeout.'] },
    ],
  },
  {
    id: 'building-ai-agents-69',
    day: 69,
    title: 'Agent Delegation',
    summary: 'Write a task brief with context and a done-criterion that code can check, so a worker knows what to do and the coordinator knows when to accept the result.',
    intro: {
      objectives: [
        'List the parts of a task brief: goal, context, inputs, limits on what to avoid, done-criterion, format and budget',
        'Write a done-criterion as data so the coordinator can check it in code',
        'Build a brief builder that refuses an incomplete brief, and a checker that tests a result against the criterion',
      ],
      why: 'A worker knows only what its brief says. Most delegation failures are brief failures: the job was unclear, the context was missing, or nobody could tell whether the result was good enough.',
    },
    minutes: 22,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `A worker has no memory of the conversation you just had with the user, and it has not seen what the other workers did. What does it know? Only what you put in its brief. This lesson is about writing that brief, and about the check that tells the coordinator whether the work is done.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Lena's coordinator tells the researcher worker: "Research rain gear." The worker returns forty items about rain gear for cyclists everywhere, over two pages. The coordinator cannot tell whether that counts as done, and the analyst receives a wall of text it cannot rate. Lena rewrites the brief. It now says the goal (find notes showing whether Mika's customers want rain gear), the context (a bike shop in Naga City, rainy season in six weeks, one shelf of space), what to avoid (guessing, or using anything not given), a done-criterion (three notes, each with a source from the shop's own files), the output format and a step limit. The next run returns three short sourced notes, and the coordinator accepts them with a check in code, not by reading.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Delegation** is the coordinator handing one bounded piece of work to a worker through a **task brief**. The brief is the worker's whole world. It does not see the user's chat, other workers' results, or your intentions, unless you copy them in. A good brief answers seven questions:` },
      {
        type: 'table',
        headers: ['Part', 'The question it answers', 'Too vague', 'Specific enough'],
        rows: [
          ['Goal', 'What outcome do you want?', 'Research rain gear', 'Find notes that show whether customers want rain gear'],
          ['Context', 'What does the worker need to know that it cannot guess?', 'Nothing given', 'A bike shop in Naga City, rainy season in six weeks, one shelf of space'],
          ['Inputs', 'What data does it work on?', '"Use what we have"', 'The sales log and the customer messages file, passed in'],
          ['What to avoid', 'What must it not do?', 'Be careful', 'Do not guess. Use only the inputs given'],
          ['Done-criterion', 'How do we both know it is finished?', 'Enough good notes', 'At least 3 notes, each with a source'],
          ['Format', 'What shape should the result take?', 'A summary', 'A list of { source, text }'],
          ['Budget', 'How much may it spend before it reports back?', 'Take your time', 'At most 4 steps, then report what is missing'],
        ],
        caption: 'The two parts people forget most are the done-criterion and the budget. Without them the worker decides when to stop, and it usually stops too late or too early.',
      },
      { type: 'paragraph', text: `The most useful habit is to write the **done-criterion as data**, not as a sentence. "Enough good notes" is a feeling. { minItems: 3, needSources: true } is a rule that a few lines of code can check, so the coordinator does not need to read every result, and a worker cannot talk its way past it. The check below returns a verdict and a reason, and when it fails, the coordinator can retry with the reason added to the brief or give up cleanly (lesson 71).` },
      { type: 'paragraph', text: `Be honest about what such a check proves. It tests the **shape** of a result: how many items, whether each has a source, how long each is. It cannot test whether the notes are true. A note can have a source and still be wrong or misquote it. Shape checks are a cheap gate against sloppy work. Truth needs another step: a reviewer worker, a lookup against the source, or a person.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  C[Coordinator writes the brief] --> V{Is the brief complete?}
  V -->|No| X[Refuse and fix the brief]
  V -->|Yes| W[Worker runs within its budget]
  W --> R[Result comes back as data]
  R --> K{Does it meet the done-criterion?}
  K -->|Yes| A[Accept and pass it on]
  K -->|No| T{Any retries left?}
  T -->|Yes| C
  T -->|No| F[Mark the step failed]`,
        caption: 'Both ends are checked in code. The brief is validated before the worker starts, and the result is validated before anyone uses it. A failed result loops back to the brief a limited number of times.',
      },
      { type: 'paragraph', text: `Two more rules. Give the worker the least context that lets it do the job, as references or short summaries, not the whole history. That keeps cost down and keeps untrusted text out of places it does not need to be. And treat the worker's result as untrusted data, like any message (lesson 66): validate it against the format before the next agent sees it.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Imagine a helper who has just walked into the shop and knows nothing. You hand over a slip of paper. If it says "look into rain gear", the helper may spend all day. If it says what you want to learn, what the shop is like, which files to use, what not to do, how many notes you need, in what form, and when to come back, the helper can do the job and you can tell when it is done. The code below builds that slip. It refuses to build one if a part is missing, and it also makes a small checker so the coordinator can test whether the result has enough notes, each with a source.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Treat the brief as an interface contract. Give it a schema and a version, log it with its id, and test it: golden briefs with expected accept and reject outcomes become unit tests for your done-criteria. Propagate budget down the tree (the parent's remaining steps and tokens minus what it has spent) so workers cannot together exceed the run's cap. Prefer references to stored artefacts over pasted text, and keep secrets out of briefs entirely. Where a shape check is not enough, add an independent verifier with fresh context and the source in hand, and remember it is a model checking a model, so sample its verdicts against a person's.` },
      {
        type: 'version',
        text: `CrewAI documents a Task with a description and an expected_output, optional context taken from earlier tasks, an optional guardrail (a callable that returns a pass flag and a value, or a string judged by the agent's model) and output_pydantic for structured output. Its human_input flag lets a person review the final answer. Other frameworks name these ideas differently. Check the current page before relying on a field name.`,
        checked: CHECKED,
        sources: [DOCS.crewTasks],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js 22 or newer and no packages. Save this as brief.js. It builds a brief for Mika's researcher, refuses an incomplete one, and returns a check function for the done-criterion. The shop and its details are invented, and no model runs.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'brief.js',
        code: `// brief.js: a task brief with a done-criterion that code can check. Run with: node brief.js
function buildBrief(parts) {
  const missing = ['goal', 'context', 'doneWhen', 'format'].filter((key) => !parts[key]);
  if (missing.length > 0) throw new Error('brief is missing: ' + missing.join(', '));
  const done = parts.doneWhen; // data, not a sentence: { minItems: 3, needSources: true }
  if (typeof done.minItems !== 'number' || done.minItems < 1) throw new Error('doneWhen.minItems must be a number of 1 or more');
  const text = [
    'GOAL: ' + parts.goal,
    'CONTEXT: ' + parts.context,
    'DO NOT: ' + (parts.avoid || ['guess', 'use anything not given here']).join('; '),
    'DONE WHEN: at least ' + done.minItems + ' items' + (done.needSources ? ', each with a source' : ''),
    'FORMAT: ' + parts.format,
    'LIMIT: ' + (parts.maxSteps || 4) + ' steps, then report what is missing',
  ].join(' | ');
  const check = (result) => {
    if (!Array.isArray(result) || result.length < done.minItems) return { ok: false, why: 'too few items' };
    if (done.needSources && result.some((item) => !item.source)) return { ok: false, why: 'an item has no source' };
    return { ok: true, why: 'meets the done-criterion' };
  };
  return { text, check };
}

const brief = buildBrief({
  goal: 'Find notes that show whether customers want rain gear',
  context: 'Mika sells bikes in Naga City. Rainy season starts in about 6 weeks. Shelf space is limited.',
  doneWhen: { minItems: 3, needSources: true },
  format: 'a list of { source, text }',
});
console.log(brief.text);
console.log(JSON.stringify(brief.check([{ source: 'sales log', text: 'a' }, { source: 'messages', text: 'b' }])));
console.log(JSON.stringify(brief.check([{ source: 'a', text: 'a' }, { source: 'b', text: 'b' }, { text: 'c' }])));
console.log(JSON.stringify(brief.check([{ source: 'a', text: 'a' }, { source: 'b', text: 'b' }, { source: 'c', text: 'c' }])));
try {
  buildBrief({ goal: 'Do research', context: 'none', format: 'text' });
} catch (error) {
  console.log(error.message);
}`,
      },
      { type: 'paragraph', text: `Read it step by step. buildBrief first lists the required parts that are missing or empty and refuses to continue if there are any. It then checks that the done-criterion is data with a usable number. It joins the parts into one block of text for the worker, with a default "do not" list and a default step limit. The check function it returns tests a result in order: is it a list with enough items, and does every item have a source if sources are required. The demo builds a brief, prints it, checks three results (too few, one without a source, a good one) and then tries to build a brief with no done-criterion.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 before it was written here)',
        code: `GOAL: Find notes that show whether customers want rain gear | CONTEXT: Mika sells bikes in Naga City. Rainy season starts in about 6 weeks. Shelf space is limited. | DO NOT: guess; use anything not given here | DONE WHEN: at least 3 items, each with a source | FORMAT: a list of { source, text } | LIMIT: 4 steps, then report what is missing
{"ok":false,"why":"too few items"}
{"ok":false,"why":"an item has no source"}
{"ok":true,"why":"meets the done-criterion"}
brief is missing: doneWhen`,
      },
      { type: 'list', items: [
        'If you see "brief is missing: ...", the message names the part. Fill it in. An empty string counts as missing on purpose.',
        'If you see "doneWhen.minItems must be a number of 1 or more", you wrote the criterion as a sentence. Use data: { minItems: 3, needSources: true }.',
        'If the check passes a result you think is bad, the check only tests shape. Add a rule for what you care about, or add a reviewer step.',
        'If you connect a real worker later, put brief.text in the data part of its call and run brief.check on the result before using it.',
      ] },
      { type: 'warning', text: `A brief often carries text from users, files or web pages, and a result is text from a model. Do not put secrets in a brief, since logs and traces keep it. Do not let a done-criterion be satisfied by the worker marking itself done. A passing check means the shape is right, not that the content is true or safe, so check facts against their sources before anyone acts on them.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write the brief for the first worker of your own team, using all seven parts, and run it through buildBrief.',
        'Next lesson, "Shared State and Collaboration", gives workers a common place to put results and a rule about who may write what.',
        'Read the CrewAI "Tasks" page and compare its expected_output and guardrail with the done-criterion above.',
      ] },
      { type: 'takeaways', items: [
        'A worker knows only its brief. Goal, context, inputs, what to avoid, done-criterion, format and budget answer the seven questions it cannot guess.',
        'Write the done-criterion as data so code can check it and the worker cannot argue with it.',
        'Validate the brief before the worker starts and the result before anyone uses it.',
        'A shape check shows the result looks right, not that it is true. Truth needs a source check or a person.',
        'Give a worker the least context it needs, and treat its result as untrusted data.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-69-code-challenge-1',
          kind: 'code-challenge',
          title: 'Check a result against its done-criterion',
          prompt: 'This runs with no model. Write checkResult(doneWhen, result) and return { ok, why }. Test in this order: the result must be a list with at least doneWhen.minItems items (otherwise why is "too few items"); if doneWhen.needSources is true, every item must have a non-empty source (otherwise "an item has no source"); if doneWhen.maxChars is a number, every item\'s text must be at most that many characters (otherwise "an item is too long"). If nothing fails, return ok true with why "meets the done-criterion".',
          concept: 'done-criterion as data',
          language: 'javascript',
          starter: `function checkResult(doneWhen, result) {
  // doneWhen: { minItems: 3, needSources: true, maxChars: 80 }
  // result: [{ source: 'sales log', text: 'Fender sets: 14 sold in June.' }, ...]
  return { ok: false, why: 'not checked' };
}`,
          solution: `function checkResult(doneWhen, result) {
  if (!Array.isArray(result) || result.length < doneWhen.minItems) return { ok: false, why: 'too few items' };
  if (doneWhen.needSources && result.some((item) => !item.source)) return { ok: false, why: 'an item has no source' };
  if (typeof doneWhen.maxChars === 'number' && result.some((item) => item.text.length > doneWhen.maxChars)) return { ok: false, why: 'an item is too long' };
  return { ok: true, why: 'meets the done-criterion' };
}`,
          tests: {
            kind: 'function',
            fn: 'checkResult',
            cases: [
              { label: 'a good result', args: [{ minItems: 2, needSources: true }, [{ source: 'a', text: 'x' }, { source: 'b', text: 'y' }]], expected: { ok: true, why: 'meets the done-criterion' } },
              { label: 'too few items', args: [{ minItems: 3, needSources: false }, [{ source: 'a', text: 'x' }]], expected: { ok: false, why: 'too few items' } },
              { label: 'a missing source', args: [{ minItems: 2, needSources: true }, [{ source: 'a', text: 'x' }, { text: 'y' }]], expected: { ok: false, why: 'an item has no source' } },
              { label: 'an item that is too long', args: [{ minItems: 1, maxChars: 5 }, [{ source: 'a', text: 'too long text' }]], expected: { ok: false, why: 'an item is too long' }, hidden: true },
              { label: 'not a list', args: [{ minItems: 1 }, 'some text'], expected: { ok: false, why: 'too few items' }, hidden: true },
              { label: 'sources not required', args: [{ minItems: 1, needSources: false }, [{ text: 'x' }]], expected: { ok: true, why: 'meets the done-criterion' }, hidden: true },
            ],
          },
          hints: [
            'Check the cheapest problem first: is the result a list with enough items? Array.isArray tells you whether it is a list.',
            'Use result.some(...) to ask whether any item breaks a rule, and return a different why for each rule.',
            'The maxChars rule applies only when doneWhen.maxChars is a number. Finish with the ok: true line when nothing failed.',
          ],
          explanation: 'Each rule of the criterion becomes one check with its own reason, in a fixed order. A failing result tells the coordinator exactly what to ask for on a retry, and a passing one is accepted without reading it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-69-fix-bug-1',
          kind: 'fix-bug',
          title: 'The brief check that lets empty parts through',
          prompt: 'missingParts(parts) should list every required part that is missing or empty. A brief with context: "" passes the check when it should not. Find the buggy line and choose the fix. (Plain JavaScript; no model runs.)',
          concept: 'validating a brief',
          language: 'javascript',
          code: `function missingParts(parts) {
  const needed = ['goal', 'context', 'doneWhen', 'format'];
  return needed.filter((key) => parts[key] === undefined);
}`,
          bugLine: 3,
          fixes: [
            { line: '  return needed.filter((key) => !parts[key]);', correct: true, why: 'An empty string, null and undefined are all falsy, so a part that is empty or absent is reported. A filled-in object or text passes.' },
            { line: '  return needed.filter((key) => parts[key] == undefined);', correct: false, why: 'Loose equality with undefined also matches null, but an empty string still passes, so context: "" is not caught.' },
            { line: '  return needed.filter((key) => parts[key].length === 0);', correct: false, why: 'A missing part is undefined, so reading its length throws an error, and an object like doneWhen has no length.' },
            { line: '  return needed.filter((key) => parts[key] === null);', correct: false, why: 'This catches only null. A missing key is undefined and an empty string is neither.' },
          ],
          tests: {
            kind: 'function',
            fn: 'missingParts',
            cases: [
              { label: 'an empty context is missing', args: [{ goal: 'g', context: '', doneWhen: { minItems: 1 }, format: 'f' }], expected: ['context'] },
              { label: 'everything present', args: [{ goal: 'g', context: 'c', doneWhen: { minItems: 1 }, format: 'f' }], expected: [] },
              { label: 'two parts absent', args: [{ goal: 'g', format: 'f' }], expected: ['context', 'doneWhen'], hidden: true },
              { label: 'a null part', args: [{ goal: null, context: 'c', doneWhen: { minItems: 1 }, format: 'f' }], expected: ['goal'], hidden: true },
            ],
          },
          hints: [
            'The check only catches parts that are completely absent. Which other values should count as missing?',
            'An empty string and null are both "falsy" in JavaScript, just like undefined.',
            'You can test a value for being falsy with the not operator: !parts[key].',
          ],
          explanation: 'Comparing to undefined catches only a key that was never set. A brief with an empty text is just as incomplete, so the check must treat every falsy value as missing.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-69-q1',
        prompt: 'Lena tells a worker "Research rain gear" and gets back forty items about rain gear everywhere. What is the most likely cause?',
        choices: [
          'The worker\'s model is too large, so it adds more detail than anyone asked it to include in the answer.',
          'The worker ignored the brief on purpose, which shows that workers cannot follow instructions reliably.',
          'The coordinator should have run the worker twice, because one run is never enough to get the right size.',
          'The brief gave a topic but no context, limit or done-criterion, so the worker had to guess the scope.',
        ],
        answer: 3,
        explanation: 'A topic alone leaves scope, depth and the stopping point open. The fix is a better brief with context, a done-criterion and a limit, not a different model or a second run.',
      },
      {
        id: 'building-ai-agents-69-q2',
        prompt: 'Which done-criterion can the coordinator check in code?',
        choices: [
          'Enough good notes that the analyst would be happy with, in the coordinator\'s opinion',
          'A thorough set of findings that covers the topic from every useful angle',
          'At least 3 notes, each with a source from the shop\'s own files',
          'A result the customer will like when they read it later in the report',
        ],
        answer: 2,
        explanation: 'A count and a required field are data a program can test. Opinions about quality, thoroughness and what a customer will like cannot be tested without another judge.',
      },
      {
        id: 'building-ai-agents-69-q3',
        prompt: 'True or false: if a worker\'s result passes the done-criterion check, the coordinator can treat its contents as verified facts.',
        choices: [
          'True, because a source on every note means each note has already been confirmed by that very source.',
          'False, because the check tests only shape; a note can have a source and still be wrong or misquoted.',
          'True, because the worker agreed to the brief, and workers never go against a brief they are given.',
          'False, because a done-criterion can never be checked by code and must always be judged by a person.',
        ],
        answer: 1,
        explanation: 'Shape checks catch missing items and fields. They cannot judge truth. A source field proves a note names a source, not that the source says it. Code can check shape, and a verifier or a person checks facts.',
      },
      {
        id: 'building-ai-agents-69-q4',
        audience: { max: 'beginner' },
        prompt: 'Why does a worker agent need a written brief?',
        choices: [
          'It knows only what the brief tells it, because it does not see the rest of the conversation',
          'It gets bored without one and starts to work on tasks that nobody has asked it to do for the team',
          'The brief decides which language model the worker is allowed to run on during the whole of the job',
          'The brief is how the worker remembers its work from earlier runs of the same job, run after run',
        ],
        answer: 0,
        explanation: 'A worker starts with nothing except its brief, so everything it needs to know must be in it. A brief does not choose the model or give the worker a memory of earlier runs.',
      },
      {
        id: 'building-ai-agents-69-q5',
        audience: { min: 'advanced' },
        prompt: 'To be safe, a coordinator passes the full chat history and every earlier result to every worker. What is the main cost of this choice?',
        choices: [
          'Each call costs more and carries untrusted text where it is not needed, so pass only what the step requires.',
          'The workers will run faster, because a longer input always makes a model finish its answer sooner than a short one.',
          'The history will be changed by the workers, so the coordinator loses the original conversation for good afterwards.',
          'The workers will start to behave like coordinators, because they can see the plan and decide what runs next on their own.',
        ],
        answer: 0,
        explanation: 'Extra context raises cost on every call and widens the path for injected text. Minimal context per brief is cheaper and safer. Longer inputs do not speed up answers, and workers cannot overwrite the coordinator\'s history by reading it.',
      },
    ],
    task: {
      title: 'Write a brief and check a result against it',
      minutes: 18,
      steps: [
        'Save brief.js from "Build it", run it, and compare your output with the expected output.',
        'Write the brief for the first worker of your own team (lesson 63 or 64). Fill in all seven parts, with a done-criterion written as data. Run it through buildBrief.',
        'Change it and observe: remove the context, then set minItems to 0, then make the criterion a sentence instead of data. Write down the error each change produced. Then pass the check function a result that has enough items but one with no source.',
        'Give your brief to an AI assistant of your choice and ask it to do the task. Run brief.check on its answer by hand (count items, look for sources). Did the answer pass? What did the check not test?',
        'Reflect: which part of your brief was hardest to write, and what does that say about how well you understand the job you are delegating?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use Mika\'s brief as given and ask your assistant for the notes. Count the items and look for sources yourself. Write one sentence on whether the answer would pass the criterion.'] },
      { audience: { min: 'advanced' }, steps: ['Turn buildBrief into a typed schema with a version field, add a budget that is subtracted from a parent budget, and write golden tests: five briefs that must be accepted, five that must be refused, and five results with the expected verdicts.'] },
    ],
  },
  {
    id: 'building-ai-agents-70',
    day: 70,
    title: 'Shared State and Collaboration',
    summary: 'Build a shared blackboard where every key has one owner, writes are checked and versioned, and workers receive copies, not the board.',
    intro: {
      objectives: [
        'Explain when shared state is a better fit than passing messages',
        'Apply the write-ownership rule: one owner per key, read-only copies for workers, versioned writes',
        'Build a blackboard that rejects writes from the wrong agent and hands out snapshots',
      ],
      why: 'When several agents add to one growing result, the shared place itself becomes the risk: lost updates, overwritten work and one poisoned write that everyone then reads. A few simple rules in code prevent all three.',
    },
    minutes: 22,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `Messages work well when one agent hands a result to the next. What if three agents all add to one growing report? Where does it live, and who may change it? If the answer is "anywhere, anyone", you will lose work and you will not know how. This lesson builds the shared place with rules.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Ramon's three agents write into one shared text called "draft". The researcher appends notes. The analyst, trying to be helpful, "corrects" a note and changes its source. The writer replaces the analyst's findings with its own summary. Worse, two agents read draft version 3 at the same moment and each write a version 4, so one of the two changes simply vanishes, and nobody sees an error. When the report is wrong, Ramon cannot tell who changed what. He rebuilds the shared place as a board with named keys. Each key has exactly one owner. Workers get read-only copies of the keys they need. Every write is checked, numbered and logged. The same job now produces a history he can read.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Shared state**, often called a **blackboard**, is a common store of named values that several agents can read. Use it for a result that grows and that more than one agent needs, such as notes, then findings, then a report. Use messages for the hand-over of one step's result to one receiver. The two work together: the coordinator sends a task by message, and the worker's finished result is written to the board under its own key. Shared state has five dangers:` },
      { type: 'list', items: [
        '**Lost updates.** Two agents read the same version and both write a new one, so one change disappears silently.',
        '**Overwriting.** An agent changes something that belongs to another agent\'s job, by mistake or because injected text told it to.',
        '**Stale reads.** An agent decides from a value that has already changed.',
        '**Bloat.** Everything accumulates, and every agent that reads all of it pays for it on every call.',
        '**Exposure.** Every agent can see everything, including data it has no reason to touch.',
      ] },
      { type: 'paragraph', text: `The rules that answer them are short. **Every key has one owner**, and only the owner may write it: this is the **write-ownership rule**, and it removes lost updates and overwriting at once, because two agents can never write the same key. Anyone who needs another agent's result reads it; they do not edit it. Reading is limited too: give each worker a **snapshot**, a copy of only the keys it needs, never the board itself, so a worker cannot change the shared value by accident and sees less. The board **validates** each write (does the key exist, is the writer its owner, is the value the right shape and size), **versions** it (each write to a key raises its version number) and **logs** it (who wrote what, and which version). Only the coordinator can change who owns a key or add one.` },
      {
        type: 'table',
        headers: ['Key', 'Owner (the only writer)', 'Readers (get a snapshot)', 'Written when'],
        rows: [
          ['plan', 'coordinator', 'coordinator', 'At the start, and when a step is retried'],
          ['notes', 'researcher', 'analyst', 'After the search step passes its check'],
          ['findings', 'analyst', 'writer, coordinator', 'After every note has a rating'],
          ['report', 'writer', 'coordinator', 'After the findings are written up'],
        ],
        caption: 'This is a role map turned into an ownership map. Each row is one rule in code: no key has two owners, and no worker reads more than it needs.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  R[Researcher] -->|writes notes| B[(Blackboard: notes, findings, report)]
  B -->|snapshot of notes| A[Analyst]
  A -->|writes findings| B
  B -->|snapshot of findings| W[Writer]
  W -->|writes report| B
  B -->|checks owner and shape| G[Write rules in code]`,
        caption: 'Each agent writes only its own key and reads copies. The board checks every write against the owner list before it changes anything.',
      },
      { type: 'paragraph', text: `With one owner per key you never need to merge two writers. If you truly need several agents to add to one value (a list of notes from three researchers), give each its own key, such as notes_sales and notes_messages, and let the coordinator combine them in code. An analogy, and only an analogy: a whiteboard in the shop with one column per person. Everyone can look at the columns that matter to them, and only the person named at the top of a column writes in it. Nobody carries the whiteboard around. They take a photo of the column they need.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Think of a shared notice board with labelled boxes: "notes", "findings", "report". Each box has the name of one person on it, and only that person may put something in. Anyone may read, but they read a photocopy, so they cannot change the original by accident. Each time something is put in, the board writes down who did it and adds one to that box's version number. In the code below, the board refuses a write from the wrong person, refuses a box that does not exist, and hands out copies. Without these rules, two helpers can write on the same card at the same time and one of the two changes is lost without anyone noticing.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `One owner per key avoids merge logic, but it is a design constraint, not a law. When you truly need several writers, choose the combine rule on purpose: append-only lists with a deterministic merge order, or compare-and-set on the version (a write names the version it read and is refused if the key has moved on). Keep an append-only log of writes as the source of truth, so the board is a view you can rebuild and replay. Control size: store references and short summaries on the board, keep large artefacts in a separate store, and snapshot only the keys a step needs so context cost does not grow with every hop. Separate keys by sensitivity, so a worker that reads untrusted pages never gets a snapshot with private data.` },
      {
        type: 'version',
        text: `LangGraph describes a graph's state as a shared schema that nodes read and update by returning partial updates; each key in the state is a channel and can have a reducer that defines how updates combine, and a checkpointer saves the state per thread. CrewAI Flows keep state in self.state, a dictionary or a Pydantic model. These are the frameworks' own descriptions; this lesson's board is a plain class so the rules stay visible.`,
        checked: CHECKED,
        sources: [DOCS.langgraphGraph, DOCS.langgraphPersistence, DOCS.crewFlows],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js 22 or newer and no packages. Save this as board.js. It is a blackboard with an owner for every key, versioned writes, a history and snapshots. The agents and notes are invented, and no model runs.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'board.js',
        code: `// board.js: a shared blackboard where every key has exactly one writer. Run with: node board.js
class Blackboard {
  constructor(owners) {
    this.owners = owners;          // { notes: 'researcher', findings: 'analyst', report: 'writer' }
    this.values = new Map();
    this.versions = new Map();
    this.history = [];
  }
  write(agent, key, value) {
    if (!(key in this.owners)) return { ok: false, reason: 'unknown key: ' + key };
    if (this.owners[key] !== agent) return { ok: false, reason: agent + ' may not write ' + key + ' (owner: ' + this.owners[key] + ')' };
    const version = (this.versions.get(key) || 0) + 1;
    this.values.set(key, value);
    this.versions.set(key, version);
    this.history.push(agent + ' wrote ' + key + ' v' + version);
    return { ok: true, version };
  }
  read(key) {
    return { value: this.values.has(key) ? this.values.get(key) : null, version: this.versions.get(key) || 0 };
  }
  snapshot(keys) {
    // a worker gets a copy of only the keys it needs, never the board itself
    const copy = {};
    for (const key of keys) copy[key] = this.read(key).value;
    return JSON.parse(JSON.stringify(copy));
  }
}

const board = new Blackboard({ notes: 'researcher', findings: 'analyst', report: 'writer' });
console.log(JSON.stringify(board.write('researcher', 'notes', ['n1', 'n2'])));
console.log(JSON.stringify(board.write('writer', 'notes', ['rewritten'])));
console.log(JSON.stringify(board.write('analyst', 'plan', 'x')));
console.log(JSON.stringify(board.write('researcher', 'notes', ['n1', 'n2', 'n3'])));
const view = board.snapshot(['notes']);
view.notes.push('tampered');
console.log(JSON.stringify(board.read('notes')), JSON.stringify(view));
console.log(board.history.join(' | '));`,
      },
      { type: 'paragraph', text: `Read it step by step. The board is created with an owner list. write() checks that the key exists, then that the agent is its owner, and only then stores the value, raises that key's version and records the write in the history. read() returns the value and its version. snapshot() builds a copy of just the keys you name and clones it through JSON, so changing the copy cannot change the board. The demo shows four writes (the second and third are refused), then changes a snapshot on purpose and shows that the board is unchanged.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 before it was written here)',
        code: `{"ok":true,"version":1}
{"ok":false,"reason":"writer may not write notes (owner: researcher)"}
{"ok":false,"reason":"unknown key: plan"}
{"ok":true,"version":2}
{"value":["n1","n2","n3"],"version":2} {"notes":["n1","n2","n3","tampered"]}
researcher wrote notes v1 | researcher wrote notes v2`,
      },
      { type: 'list', items: [
        'If a write you expect to succeed returns "unknown key", add the key to the owners object when you create the board.',
        'If a write returns "may not write", check the owner list: you or the agent name has a typo, or the wrong worker is writing.',
        'If your board changes when a worker changes its copy, the snapshot is sharing objects with the board. Clone the values, as the JSON round trip does here.',
        'If you need two agents to add to one list, give each its own key and let the coordinator combine the keys in code.',
      ] },
      { type: 'warning', text: `A blackboard is a place where every agent\'s output becomes every other agent\'s input, so one poisoned write spreads. Validate the shape and size of every value before storing it, treat what you read back as untrusted data, never run it, and keep sensitive values on keys that only the agents that need them can read. Never let a worker change ownership, and never give any agent a delete that skips the log.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Make an ownership table for your own team: every key, its one owner and who reads it. Run it through the board.',
        'Next lesson, "Multi-Agent Error Handling", asks what the board and the coordinator should do when a worker fails or takes too long.',
        'Read the LangGraph "Graph API" page on state and reducers and compare a reducer with the one-owner rule.',
      ] },
      { type: 'takeaways', items: [
        'Shared state suits a result that grows and that several agents need. Messages suit one-step hand-overs.',
        'The write-ownership rule gives every key exactly one writer, which removes lost updates and overwriting.',
        'Give a worker a snapshot of the keys it needs, never the board.',
        'Validate, version and log every write, and let only the coordinator add keys or change owners.',
        'Shared state spreads bad data fast, so treat what you read from it as untrusted.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-70-code-challenge-1',
          kind: 'code-challenge',
          title: 'Apply writes with an owner list',
          prompt: 'This runs with no model. Write applyWrites(owners, writes). owners maps each key to its one owner. writes is a list of { agent, key, value } attempts, in order. Return { board, rejected }. Accepted writes set board[key] = value (a later accepted write replaces an earlier one). A write to a key that is not in owners is rejected with the text "unknown key: <key>". A write by someone who is not the owner is rejected with "<agent> may not write <key>". rejected lists the texts in order.',
          concept: 'write ownership',
          language: 'javascript',
          starter: `function applyWrites(owners, writes) {
  // owners: { notes: 'researcher', report: 'writer' }
  // writes: [{ agent: 'researcher', key: 'notes', value: ['n1'] }]
  return { board: {}, rejected: [] };
}`,
          solution: `function applyWrites(owners, writes) {
  const board = {};
  const rejected = [];
  for (const write of writes) {
    if (owners[write.key] === undefined) {
      rejected.push('unknown key: ' + write.key);
    } else if (owners[write.key] !== write.agent) {
      rejected.push(write.agent + ' may not write ' + write.key);
    } else {
      board[write.key] = write.value;
    }
  }
  return { board, rejected };
}`,
          tests: {
            kind: 'function',
            fn: 'applyWrites',
            cases: [
              { label: 'the owner writes', args: [{ notes: 'researcher' }, [{ agent: 'researcher', key: 'notes', value: ['n1'] }]], expected: { board: { notes: ['n1'] }, rejected: [] } },
              { label: 'a non-owner is rejected', args: [{ notes: 'researcher' }, [{ agent: 'writer', key: 'notes', value: ['x'] }]], expected: { board: {}, rejected: ['writer may not write notes'] } },
              { label: 'an unknown key and a good write', args: [{ report: 'writer' }, [{ agent: 'analyst', key: 'plan', value: 1 }, { agent: 'writer', key: 'report', value: 'R' }]], expected: { board: { report: 'R' }, rejected: ['unknown key: plan'] } },
              { label: 'a later accepted write replaces an earlier one', args: [{ notes: 'researcher' }, [{ agent: 'researcher', key: 'notes', value: ['a'] }, { agent: 'writer', key: 'notes', value: ['z'] }, { agent: 'researcher', key: 'notes', value: ['a', 'b'] }]], expected: { board: { notes: ['a', 'b'] }, rejected: ['writer may not write notes'] }, hidden: true },
            ],
          },
          hints: [
            'Loop over the writes in order, keeping a board object and a rejected list.',
            'Look up owners[write.key]. If it is undefined, the key is unknown. If it is not equal to write.agent, the writer is not the owner.',
            'Only when both checks pass do you set board[write.key] = write.value.',
          ],
          explanation: 'Two checks stand between a write and the board: the key must exist, and the writer must be its owner. A refused write leaves the board untouched and only adds a reason to the list, so nobody can overwrite another agent\'s result.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-70-fix-bug-1',
          kind: 'fix-bug',
          title: 'The snapshot that shares the board',
          prompt: 'snapshot should give a worker a copy that it can change without changing the board. The test below changes the copy and then reads the board, and the board changes too. Find the buggy line and choose the fix. (Plain JavaScript; no model runs.)',
          concept: 'snapshots of shared state',
          language: 'javascript',
          code: `function snapshot(board, keys) {
  const copy = {};
  for (const key of keys) {
    copy[key] = board[key];
  }
  return copy;
}
function tamperTest(board, keys) {
  const view = snapshot(board, keys);
  view[keys[0]][0].text = 'tampered';
  return board[keys[0]][0].text;
}`,
          bugLine: 4,
          fixes: [
            { line: '    copy[key] = JSON.parse(JSON.stringify(board[key]));', correct: true, why: 'A JSON round trip builds new arrays and new objects all the way down, so the copy shares nothing with the board.' },
            { line: '    copy[key] = board[key].slice();', correct: false, why: 'This copies only the outer list. The note objects inside are still the same objects as on the board, so changing one still changes the board.' },
            { line: '    copy[key] = [...board[key]];', correct: false, why: 'This is also a shallow copy: the list is new, but the notes inside it are shared with the board.' },
          ],
          tests: {
            kind: 'function',
            fn: 'tamperTest',
            cases: [
              { label: 'changing the copy leaves the board alone', args: [{ notes: [{ source: 'a', text: 'original' }], plan: ['p'] }, ['notes']], expected: 'original' },
              { label: 'a different key', args: [{ findings: [{ rating: 'x', text: 'kept' }] }, ['findings']], expected: 'kept', hidden: true },
            ],
          },
          hints: [
            'The copy and the board must not share any object. Is copy[key] = board[key] a copy or the same object?',
            'Copying only the outer list is not enough, because the notes inside the list are objects too.',
            'A JSON round trip with JSON.stringify then JSON.parse copies the whole structure.',
          ],
          explanation: 'Assigning board[key] hands out the board\'s own object, so a worker\'s change lands on the board. A shallow copy still shares the objects inside. A deep copy, here a JSON round trip, gives the worker a value it can change freely.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-70-q1',
        prompt: 'In Ramon\'s team the writer replaced the analyst\'s findings with its own summary. Which design change prevents this most directly?',
        choices: [
          'Tell the writer in its prompt that the findings belong to the analyst and must be left alone.',
          'Give each key one owner, and make the board reject a write from anyone who is not that owner.',
          'Run the analyst after the writer so that the findings are always the most recent change on the board.',
          'Use a larger model for the writer so that it understands better which parts of the draft it may change.',
        ],
        answer: 1,
        explanation: 'Ownership enforced by the board makes the overwrite impossible. A prompt request can be ignored or argued away, reordering only changes who overwrites whom, and a larger model can still make the same mistake.',
      },
      {
        id: 'building-ai-agents-70-q2',
        prompt: 'Two workers both read version 3 of a shared draft and each write a version 4. One change disappears and no error appears. What is the problem, and what is the simplest fix?',
        choices: [
          'A stale read, which is fixed by having each worker read the board twice before it writes anything back to it.',
          'A race in the model provider, which is fixed by sending each worker\'s request to a different server.',
          'A lost update, avoided when each key has one writer or a write names the version it read.',
          'A memory leak, which is fixed by clearing the draft after every step so that nothing old is left behind.',
        ],
        answer: 2,
        explanation: 'Two writers to one value without a rule give a lost update. One owner per key removes the conflict, and compare-and-set on the version detects it. Reading twice does not close the gap, and the provider and memory are not involved.',
      },
      {
        id: 'building-ai-agents-70-q3',
        prompt: 'Why should a worker receive a snapshot of only the keys it needs, instead of the whole board?',
        choices: [
          'Because workers cannot read a board that has more than three keys on it, so the board has to be cut down first.',
          'Because snapshots are required by the model providers for every call that involves tools of any kind.',
          'Because a worker should be able to read the full history of all other workers to plan its own work well.',
          'It costs less, exposes less data and untrusted text, and the worker cannot change the shared copy.',
        ],
        answer: 3,
        explanation: 'A snapshot cuts context cost, limits what a worker can see, and protects the shared value from accidental changes. There is no such key limit or provider rule, and reading everything is exactly what the snapshot avoids.',
      },
      {
        id: 'building-ai-agents-70-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a blackboard in a multi-agent system?',
        choices: [
          'A shared place with named slots for results, and rules about who may write each slot',
          'A screen where the user types messages that every agent in the team reads at the very same time',
          'A list of all the mistakes that the agents have made, kept so that they can avoid them in the future',
          'A second copy of the model that checks the first copy and corrects it whenever it gets something wrong',
        ],
        answer: 0,
        explanation: 'A blackboard is a shared store with named keys and write rules. It is not a chat screen, an error list, or a second model.',
      },
      {
        id: 'building-ai-agents-70-q5',
        audience: { min: 'advanced' },
        prompt: 'A shared board grows by about 50 KB per step, and every worker reads the whole board on every call. Latency and cost are climbing. Which remedy fits best?',
        choices: [
          'Cap the board at a fixed size and silently drop the oldest values when it is full, so the cost stops growing.',
          'Give every worker a larger context window so that the full board always fits without any trimming at all.',
          'Let the workers decide for themselves which parts of the board to skim, and trust them to skip the rest of it.',
          'Keep summaries and references on the board, store large artefacts elsewhere, and snapshot only the needed keys.',
        ],
        answer: 3,
        explanation: 'The cost comes from reading everything every time. Summaries, references and per-step snapshots cut it at the source. Silent dropping loses data, a larger window raises the bill, and trusting workers to skim is not a control.',
      },
    ],
    task: {
      title: 'Build an ownership map and test it',
      minutes: 18,
      steps: [
        'Save board.js from "Build it", run it, and compare your output with the expected output.',
        'Write the ownership table for your own team: every key, its one owner and who reads it. Put the owners into a new Blackboard and write one value per key from the right agent.',
        'Change it and observe: let a second agent try to write a key it does not own, then write a key that is not in the owner list, then change a snapshot and read the board again. Write down which line of output proves that each rule held.',
        'Make a key that two workers need to add to (for example, notes from two searches). Split it into two keys and combine them in a small function. Write down what you gained and what you gave up.',
        'Reflect: which key on your board holds the most sensitive or most untrusted data, and which agents should never receive it in a snapshot?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use the three keys as given. Change only one thing at a time: first the owner of notes, then the writer. After each run, write one sentence that starts "The board refused this because...".'] },
      { audience: { min: 'advanced' }, steps: ['Add compare-and-set: write(agent, key, value, expectedVersion) is refused when expectedVersion is not the key\'s current version. Write tests for two writers that read version 1 and both try to write version 2.'] },
    ],
  },
  {
    id: 'building-ai-agents-71',
    day: 71,
    title: 'Multi-Agent Error Handling',
    summary: 'Contain worker failures, bound retries and waiting, treat empty results as failures, and return an honest partial result instead of losing everything.',
    intro: {
      objectives: [
        'Name the ways a worker in a team can fail, and choose a response for each',
        'Decide which workers are required and which are optional, and report a complete, partial or failed status',
        'Build a runner that retries, times out and collects partial results without guessing',
      ],
      why: 'In a team, something will fail: a tool will be down, a worker will be slow, a result will be empty. What matters is that one failure does not cost you the work that succeeded, and that the answer says what is missing.',
    },
    minutes: 22,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `In a team of four, what happens when one worker fails? In a careless design, everything is lost: the run throws away three good results and shows an error. In another careless design, nothing is noticed: a worker returns an empty answer marked "ok", and the writer produces a confident report with nothing behind it. A good design does neither. It keeps what worked and says what is missing.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Grace's research team has three searches. On Monday the chat export service is down. The messages worker throws an error, her coordinator catches it, returns the word "Error" and discards the sales and supplier results that had succeeded. On Tuesday the supplier worker is slow, and the user waits two minutes with nothing on the screen. On Wednesday a worker returns an empty text with ok set to true, and the writer produces a confident report that rests on nothing. Grace redesigns the run. Each worker has its own error handling, a retry limit and a time limit. Some workers are marked required and some optional. The final answer carries a status (complete, partial or failed) and lists what is missing and why.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Teams fail in more ways than single agents, because each hand-off is a new place to fail. These are the kinds you should plan for, with a first response for each:` },
      {
        type: 'table',
        headers: ['Failure', 'How you detect it', 'First response'],
        rows: [
          ['A worker crashes or its tool is down', 'An error is thrown or an error result comes back', 'Catch it for that worker only. Retry a limited number of times if the step is safe to repeat'],
          ['A worker is too slow', 'It passes its time or step limit', 'Stop waiting. Do not retry blindly: a slow worker is often slow again'],
          ['A result is empty or malformed', 'It fails the done-criterion check (lesson 69)', 'Treat it as a failure, even when the worker said ok. Retry once with the reason added to the brief'],
          ['A step needs the output of a failed step', 'Its input is missing', 'Skip it and mark it skipped, with the reason'],
          ['A result is well formed but wrong', 'Hard: a reviewer with the source, or a person', 'Do not rely on retries. Add a verification step where the cost of a wrong answer is high'],
          ['A worker spends too much', 'A call, step or token budget is reached', 'Stop it and report. Never raise the cap automatically'],
        ],
        caption: 'Most rows are caught by code you already have: try and catch, a limit and the done-criterion check. Only the fifth row needs more than code.',
      },
      { type: 'paragraph', text: `Four principles hold the design together. **Contain**: handle errors per worker, so one failure does not stop or erase the others. **Bound**: every retry, wait and budget has a limit, because an unbounded retry is a runaway cost. **Decide in advance**: mark each worker **required** or **optional**. If a required worker is lost, the honest status is failed, because you cannot answer without it. If an optional worker is lost, the status is partial. **Report honestly**: the result says what succeeded, what is missing and why. It never fills a gap with a guess, and the writer is told what is missing so it does not invent it.` },
      { type: 'paragraph', text: `One caution about retries. Repeating a step costs another call, and it is only safe when repeating changes nothing. Searching again is fine. Sending an email again is not: if the first attempt reached the customer before the error, you have sent it twice. Retry only steps that are safe to repeat, or give the step an id so a repeat is recognised and ignored (module 7 covered idempotency). The diagram shows what the coordinator does with each outcome.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  W[A worker finishes or fails] --> Q{Back in time and without an error?}
  Q -->|Yes| K{Does the result meet the done-criterion?}
  K -->|Yes| A[Keep the result]
  K -->|No| R{Retries left, and safe to repeat?}
  Q -->|No| R
  R -->|Yes| W2[Retry once, with the reason in the brief]
  W2 --> W
  R -->|No| M{Is this worker required?}
  M -->|Yes| F[Stop: status failed, keep what worked]
  M -->|No| P[Go on: status partial, note what is missing]`,
        caption: 'Follow one worker\'s outcome. Success is kept. Anything else goes through the retry rule, and if retries are used up, whether the worker was required decides between failed and partial.',
      },
      { type: 'paragraph', text: `The most important line in the whole design is the last one on the diagram: keep what worked. A partial report with three clearly labelled gaps is useful. An error that discards good work is not, and a smooth report with the gaps hidden is worse, because the reader trusts it.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Think of a shop manager preparing an order from three suppliers. One supplier is closed today. A good manager does not throw away the other two deliveries and does not pretend the third one arrived. The manager tries the closed one a second time, then gives the customer what is available and says clearly what is missing and why. Some items are essential: if the bike frame cannot be supplied, the order fails. Others are optional, like the bell. The code below does the same. It tries each worker, limits how long it will wait, marks which workers are essential, and prints a status of complete, partial or failed.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Add the patterns that keep failures from spreading. Use backoff with jitter for retries, a circuit breaker that stops calling a dependency after repeated failures and probes it again later, and per-dependency concurrency limits (bulkheads), so one failing tool cannot occupy every worker. Move work that cannot be repeated safely behind idempotency keys, and send tasks that keep failing to a dead-letter list for a person to read instead of retrying forever. Checkpoint after each verified step so a failed run resumes from the failed step, not from the start. Track the partial rate and the retry rate as metrics, and test with fault injection: scripted workers that fail on purpose, as in this lesson.` },
      {
        type: 'version',
        text: `CrewAI documents per-agent limits named max_iter, max_rpm and max_execution_time. The Microsoft Agent Framework describes checkpoints in its graph workflows (saved at superstep boundaries) so a run can be resumed. The OpenAI Agents SDK tracing page says tracing is on by default and records model calls, tool calls, handoffs and guardrails, which helps you see where a team failed. Check the current pages for names and defaults.`,
        checked: CHECKED,
        sources: [DOCS.crewAgents, DOCS.mafWorkflows, DOCS.openaiTracing],
      },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You need Node.js 22 or newer and no packages. Save this as partial.js. Three scripted workers stand in for agents: one works, one throws an error, one is too slow. The notes are invented, and no model runs.` },
      {
        type: 'code',
        language: 'javascript',
        label: 'partial.js',
        code: `// partial.js: one worker fails, the team still answers honestly. Run with: node partial.js
// Each worker returns { ok, data, ticks } or throws. "ticks" is a made-up unit of waiting time.
const workers = {
  sales: () => ({ ok: true, data: 'Fender sets: 14 sold in June.', ticks: 2 }),
  chats: () => { throw new Error('chat export is unavailable'); },
  suppliers: () => ({ ok: true, data: 'Rain cape minimum order: 20.', ticks: 9 }),
};

function runOne(name, fn, maxTicks, retries) {
  let lastError = 'unknown error';
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const out = fn();
      if (!out.ok) { lastError = out.error || 'worker reported a failure'; continue; }
      if (out.ticks > maxTicks) return { name, ok: false, error: 'timeout: ' + out.ticks + ' ticks, limit ' + maxTicks, attempts: attempt };
      return { name, ok: true, data: out.data, attempts: attempt };
    } catch (error) {
      lastError = error.message;
    }
  }
  return { name, ok: false, error: lastError, attempts: retries + 1 };
}

function collect(results, required) {
  const failed = results.filter((r) => !r.ok);
  const lostRequired = failed.filter((r) => required.includes(r.name));
  const status = lostRequired.length > 0 ? 'failed' : failed.length > 0 ? 'partial' : 'complete';
  return {
    status,
    sections: results.filter((r) => r.ok).map((r) => r.data),
    missing: failed.map((r) => r.name + ': ' + r.error),
  };
}

const results = Object.keys(workers).map((name) => runOne(name, workers[name], 5, 1));
console.log(results.map((r) => r.name + ' ok=' + r.ok + ' attempts=' + r.attempts).join(' | '));
console.log(JSON.stringify(collect(results, ['sales'])));
console.log(JSON.stringify(collect(results, ['sales', 'chats'])));`,
      },
      { type: 'paragraph', text: `Read it step by step. runOne tries a worker up to retries + 1 times. A thrown error or an ok: false result is remembered and tried again. A result that took more ticks than maxTicks is a timeout, and it is not retried: a slow worker is usually slow again. A good result is returned with the number of attempts used. collect looks at the failed results, and if any of them is a required worker the status is failed; otherwise it is partial if anything failed, and complete if nothing did. It keeps the sections that worked and writes one missing line per failure, with the reason. The last lines run all three workers and collect twice, first with only sales required and then with chats required as well.` },
      { type: 'heading', text: 'Run it and check' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 before it was written here)',
        code: `sales ok=true attempts=1 | chats ok=false attempts=2 | suppliers ok=false attempts=1
{"status":"partial","sections":["Fender sets: 14 sold in June."],"missing":["chats: chat export is unavailable","suppliers: timeout: 9 ticks, limit 5"]}
{"status":"failed","sections":["Fender sets: 14 sold in June."],"missing":["chats: chat export is unavailable","suppliers: timeout: 9 ticks, limit 5"]}`,
      },
      { type: 'list', items: [
        'If every worker shows ok=false, read the missing lines: the message names each cause. A TypeError usually means a worker returned nothing instead of { ok, data, ticks }.',
        'If a failing worker shows attempts=1, check the retries argument: with 0 retries there is only one attempt.',
        'If a timeout is retried when you did not expect it, check where the tick check sits. It returns before the loop can try again, on purpose.',
        'If you replace a scripted worker with a real call, wrap it in the same try and catch, and keep a real time limit as well as the tick check.',
      ] },
      { type: 'warning', text: `Retries multiply cost and can repeat actions. Never retry a step that changes the outside world (sending a message, booking, paying) unless it carries an id that makes a repeat harmless, and never let the retry count or the budget grow on its own. Do not paste raw error messages into a prompt or show them to users: they can contain keys, paths or private data. Log the detail, and show a short safe reason.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Add a fourth worker to partial.js that returns { ok: true, data: "" }, and make collect treat an empty result as a failure.',
        'Next lesson, "When to Use Multi-Agent Systems", pulls the whole module into one decision rule with cases for and against.',
        'Read the OpenAI Agents SDK tracing page and note which parts of a failed team run a trace would show you.',
      ] },
      { type: 'takeaways', items: [
        'Contain failures per worker, bound every retry and wait, and keep the results that worked.',
        'Treat an empty or malformed result as a failure, even when the worker says ok.',
        'Mark workers required or optional in advance. A lost required worker means failed; a lost optional one means partial.',
        'Report honestly: what succeeded, what is missing and why. Never fill a gap with a guess.',
        'Retry only steps that are safe to repeat, and never raise limits automatically.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-71-code-challenge-1',
          kind: 'code-challenge',
          title: 'Collect a partial result',
          prompt: 'This runs with no model. Each result is { name, ok, data, error }. Write collect(results, required) and return { status, sections, missing }. sections lists the data of the results that are ok, in order. missing lists "<name>: <error>" for each failed result, in order. status is "failed" if any failed result is named in required, otherwise "partial" if any result failed, otherwise "complete".',
          concept: 'partial results',
          language: 'javascript',
          starter: `function collect(results, required) {
  // results: [{ name: 'sales', ok: true, data: 'text' }, { name: 'chats', ok: false, error: 'down' }]
  // required: ['sales']
  return { status: 'complete', sections: [], missing: [] };
}`,
          solution: `function collect(results, required) {
  const sections = [];
  const missing = [];
  let lostRequired = false;
  for (const result of results) {
    if (result.ok) {
      sections.push(result.data);
    } else {
      missing.push(result.name + ': ' + result.error);
      if (required.includes(result.name)) lostRequired = true;
    }
  }
  const status = lostRequired ? 'failed' : missing.length > 0 ? 'partial' : 'complete';
  return { status, sections, missing };
}`,
          tests: {
            kind: 'function',
            fn: 'collect',
            cases: [
              { label: 'everything worked', args: [[{ name: 'a', ok: true, data: 'A' }, { name: 'b', ok: true, data: 'B' }], ['a']], expected: { status: 'complete', sections: ['A', 'B'], missing: [] } },
              { label: 'an optional worker failed', args: [[{ name: 'a', ok: true, data: 'A' }, { name: 'b', ok: false, error: 'down' }], ['a']], expected: { status: 'partial', sections: ['A'], missing: ['b: down'] } },
              { label: 'a required worker failed', args: [[{ name: 'a', ok: false, error: 'timeout' }, { name: 'b', ok: true, data: 'B' }], ['a']], expected: { status: 'failed', sections: ['B'], missing: ['a: timeout'] } },
              { label: 'two failures keep their order', args: [[{ name: 'x', ok: false, error: 'e1' }, { name: 'y', ok: true, data: 'Y' }, { name: 'z', ok: false, error: 'e2' }], []], expected: { status: 'partial', sections: ['Y'], missing: ['x: e1', 'z: e2'] }, hidden: true },
              { label: 'no results at all', args: [[], ['a']], expected: { status: 'complete', sections: [], missing: [] }, hidden: true },
            ],
          },
          hints: [
            'Loop over the results, collecting data from ok results and a text line from failed ones.',
            'While looping, remember whether any failed result has a name that appears in required.',
            'After the loop: failed if a required one was lost, else partial if anything is in missing, else complete.',
          ],
          explanation: 'The status comes from two facts: did anything fail, and was any failure required? Keeping the successful sections and a reason for every gap is what turns a failure into a useful partial result.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-71-fix-bug-1',
          kind: 'fix-bug',
          title: 'The run that gives up at the first failure',
          prompt: 'runNamed runs a list of workers and should keep going after a failure, collecting what worked and listing what is missing. Right now one failure stops the whole run and later workers never run. Find the buggy line and choose the fix. (Plain JavaScript; the workers are scripted.)',
          concept: 'containing a failure',
          language: 'javascript',
          code: `const workers = {
  sales: () => ({ ok: true, data: 'sales ok' }),
  chats: () => ({ ok: false, error: 'chat export is unavailable' }),
  suppliers: () => ({ ok: true, data: 'suppliers ok' }),
};
function runNamed(names) {
  const sections = [];
  const missing = [];
  for (const name of names) {
    const out = workers[name]();
    if (!out.ok) {
      missing.push(name + ': ' + out.error);
      break;
    }
    sections.push(out.data);
  }
  return { sections, missing };
}`,
          bugLine: 13,
          fixes: [
            { line: '      continue;', correct: true, why: 'continue skips the rest of this turn, so the failed worker adds nothing to the sections, and the loop moves on to the next worker.' },
            { line: '      return { sections: [], missing };', correct: false, why: 'This throws away the sections that worked, which is the opposite of keeping them.' },
            { line: '      // keep going', correct: false, why: 'A comment does nothing, so the code falls through and pushes the failed worker\'s missing data as if it were a section.' },
          ],
          tests: {
            kind: 'function',
            fn: 'runNamed',
            cases: [
              { label: 'one failure in the middle', args: [['sales', 'chats', 'suppliers']], expected: { sections: ['sales ok', 'suppliers ok'], missing: ['chats: chat export is unavailable'] } },
              { label: 'no failure', args: [['sales', 'suppliers']], expected: { sections: ['sales ok', 'suppliers ok'], missing: [] } },
              { label: 'only the failing worker', args: [['chats']], expected: { sections: [], missing: ['chats: chat export is unavailable'] }, hidden: true },
            ],
          },
          hints: [
            'Which statement stops the loop completely when a worker fails?',
            'break leaves the whole loop. You want to leave only the current turn and carry on with the next worker.',
            'The statement that skips to the next turn of a loop is continue.',
          ],
          explanation: 'break ended the loop at the first failure, so the workers after it never ran. continue records the failure and moves on, which keeps every result that can still be collected.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-71-q1',
        prompt: 'The messages worker is down. Grace\'s coordinator catches the error, returns the word "Error" and discards the sales and supplier results that had succeeded. What is the better design?',
        choices: [
          'Handle failures per worker, keep the good results, and return a partial report that says what is missing.',
          'Run the whole team again from the start until every worker succeeds in the same run, whatever that takes.',
          'Let the writer guess the missing chat information from the other two results so the report looks complete.',
          'Remove the messages worker permanently, since a worker that can fail is too risky to keep in a team.',
        ],
        answer: 0,
        explanation: 'Containing the failure and keeping what worked loses nothing. Re-running forever is an unbounded cost, guessing hides the gap, and removing a useful worker throws away its value on every good day.',
      },
      {
        id: 'building-ai-agents-71-q2',
        prompt: 'A worker that sends a confirmation email to a customer fails with a timeout. It may or may not have sent the email. What is the safest handling?',
        choices: [
          'Retry it up to three times at once, so that at least one attempt is sure to get through to the customer.',
          'Retry only if the step carries an id that makes a repeat harmless; else mark it failed.',
          'Raise the time limit for this worker so that the next attempt does not time out, then run it again straight away.',
          'Ignore the timeout and assume the email was sent, so that the customer is never contacted twice by the shop.',
        ],
        answer: 1,
        explanation: 'A step that changes the outside world is safe to repeat only when a repeat is recognised and ignored. Otherwise failing honestly is better than risking a duplicate. Simultaneous retries and assuming success are both risky, and a higher limit only delays the problem.',
      },
      {
        id: 'building-ai-agents-71-q3',
        prompt: 'The supplier worker returns an empty text with ok set to true. What should the coordinator do?',
        choices: [
          'Pass it on, because the worker reported ok and a worker knows better than the coordinator whether it succeeded.',
          'Pass it on and let the writer decide whether an empty text is acceptable for the part of the report it covers.',
          'Run the done-criterion check, treat it as a failure, and retry once with the reason or mark it missing.',
          'Replace it with the previous run\'s supplier result so that the report always has something in that section.',
        ],
        answer: 2,
        explanation: 'A result is judged by the check, not by the worker\'s own ok flag. An empty result fails the done-criterion, so it is retried once or reported as missing. Passing it on or substituting an old result hides the gap.',
      },
      {
        id: 'building-ai-agents-71-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a partial result in a team of agents?',
        choices: [
          'A result written by only one agent, because the others were not needed for the job at hand',
          'A report that has been shortened so that it fits on one page of the screen for the reader',
          'An answer that the user has seen only half of because the page stopped loading part way',
          'An answer built from the workers that succeeded, with a note of what is missing and why',
        ],
        answer: 3,
        explanation: 'A partial result keeps what worked and says honestly what is missing. It is not about length, about one agent, or about a page that stopped loading.',
      },
      {
        id: 'building-ai-agents-71-q5',
        audience: { min: 'advanced' },
        prompt: 'A shared tool is failing. Every worker retries it three times, so the failing tool receives a burst of calls and all workers stay busy waiting for it. Which pattern addresses this?',
        choices: [
          'Increase the retry count so that the tool has more chances to recover while the workers are all waiting for it.',
          'Raise every worker\'s time limit so that the slow tool is never counted as a failure by any of the workers.',
          'Add a circuit breaker with backoff: stop calling the tool for a while, fail fast and report a partial result.',
          'Hide the errors from the coordinator so that the run keeps going without anybody stopping it early on.',
        ],
        answer: 2,
        explanation: 'A circuit breaker stops the retry storm and frees the workers, and a partial result tells the truth about what could not be done. More retries, longer limits and hidden errors all keep the load on a tool that is already failing.',
      },
    ],
    task: {
      title: 'Break your team on purpose and read the result',
      minutes: 18,
      steps: [
        'Save partial.js from "Build it", run it, and compare your output with the expected output.',
        'Add a fourth worker called "reviews" that returns an empty text with ok: true. Change collect (or runOne) so that an empty result counts as a failure with the error "empty result". Run it again.',
        'Change it and observe: set retries to 0, then to 3; then raise maxTicks to 10; then make "suppliers" required. Write down how the attempts, the status and the missing lines changed each time.',
        'Make a worker that fails on its first attempt and succeeds on its second. Check that attempts shows 2 and that nothing is reported as missing.',
        'Reflect: for your own team, which workers are required and which are optional, and what exact words would your final report use when an optional one is missing?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do the first three steps only. In the third step, change one setting at a time and write one sentence after each run that starts "The status changed because...".'] },
      { audience: { min: 'advanced' }, steps: ['Add a circuit breaker: after two consecutive failures of one worker, stop calling it for the rest of the run and mark it "skipped: circuit open". Write tests that inject faults (fail twice, then succeed) and count the calls made.'] },
    ],
  },
  {
    id: 'building-ai-agents-72',
    day: 72,
    title: 'When to Use Multi-Agent Systems',
    summary: 'Turn the module into a decision rule: name the signal, try the cheaper fix, split only that part, measure again, and keep the team only if the numbers improve.',
    intro: {
      objectives: [
        'Apply the decision rule to a proposed team of agents and say yes, not yet or no',
        'Match each good reason for a split to the evidence you need and the cheaper thing to try first',
        'Bound the cost, latency, complexity and reliability of a team with limits you set in code',
      ],
      why: 'Building a team is now easy. Knowing when not to is the skill that saves projects, because most agents that fail are too complicated, not too simple.',
    },
    minutes: 20,
    skills: ['agent-multi'],
    body: [
      { type: 'paragraph', text: `You can now build a team of agents with roles, messages, a coordinator, briefs, a shared board and honest error handling. The harder skill is knowing when not to. This lesson turns the whole module into one rule you can apply to your next project, and it is honest about the answer: more often than not, it is "not yet".` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Hana leads a small product team and receives three proposals on the same day. The first is an invoice reader built as three agents: extract the fields, validate them, write a summary. The second is a support assistant that reads a customer's order history and can also issue refunds. The third is a market report built from twelve long sources. She tests the first one: a single agent with a fixed output format passes the team's saved invoices, so she sends the proposal back. The second has a real signal, because reading private history and issuing refunds are different powers, so she approves two roles: a read-only agent and a refund agent behind a person's approval. The third has twelve independent, long inputs, so each worker reads one source and returns a short result. One day, three different answers, each from the same rule.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Recall the ladder from the start of the course. Each step up costs more and has more ways to fail, so you climb only when a measured problem requires it: one model call, then a fixed workflow, then one agent with tools, then one agent with a review step, and only then several agents. The table below connects each good reason for a team to the evidence you need and to the cheaper thing to try first. If the cheaper thing works, you are done.` },
      {
        type: 'table',
        headers: ['Signal for a team', 'Evidence to collect first', 'Cheaper thing to try first', 'The split, if it is still needed'],
        rows: [
          ['Separate permissions or trust (private data and outside actions)', 'A list of which tools touch what, and what a wrong or injected instruction could do', 'An allow-list of tools and an approval step on one agent', 'A read-only agent and an acting agent that needs approval'],
          ['The context is too large for one agent', 'Failures that appear only with long inputs', 'Trim, summarise or retrieve only the relevant parts (modules 5 and 6)', 'Workers that each read one part and return a short result'],
          ['Independent work with real waiting time', 'The measured wait of a sequential run', 'Several tool calls at once inside one agent (module 4)', 'Parallel workers with a cap on how many run together'],
          ['Different models or skills for different steps', 'Quality and cost of each step with each model', 'Choose a model per step in a fixed workflow', 'Separate agents, each with the model it needs'],
          ['An independent second look', 'Errors that a fresh reader catches on your test cases', 'A rule-based check, or one more call with the draft and the rules', 'A reviewer agent with fresh context, and a person where stakes are high'],
        ],
        caption: 'Read each row from left to right. The split is the last column, not the first: evidence and a cheaper fix come before it.',
      },
      { type: 'paragraph', text: `Equally useful is a list of signs that a team is the wrong choice. One agent already passes your test cases. The steps are strictly in a row and each needs the previous step's full detail, so nothing can overlap. The "agents" would share most of their tools and instructions. You cannot yet say what each agent writes and who checks it. Your cost or time budget is tight. Or you have no test set, so you could not tell whether the team is better even if it were. Any one of these is a reason to wait.` },
      { type: 'paragraph', text: `If you do build a team, bound what it can cost you. The second table is the module's trade-offs, each with a limit you set in code and a number you watch:` },
      {
        type: 'table',
        headers: ['Trade-off', 'What grows in a team', 'A limit you set in code', 'A number to watch'],
        rows: [
          ['Cost', 'Model calls and tokens: every agent reads its own prompt, and often shared context again', 'A step cap, a token budget per run, a cap on workers', 'Calls and tokens per finished request'],
          ['Latency', 'Hand-offs, merging, and the longest chain of dependent steps', 'A time limit per worker and a cap on parallel workers', 'Time to the final answer, typical and slowest'],
          ['Complexity', 'Prompts, message formats and traces to read and maintain', 'One owner per key, one coordinator, an allow-list of workers', 'Places you must change to change one behaviour'],
          ['Reliability', 'Failures compound across hand-offs, and agents trust wrong inputs', 'A check on every result, required and optional workers, a partial status', 'End-to-end pass rate and the share of partial runs'],
        ],
        caption: 'The limits come from lessons 67 to 71. A team without them can look fine in a demo and cost far more than expected in use.',
      },
      { type: 'paragraph', text: `Put together, the rule you take away has five steps. **One**: write the single-agent version and a saved test set. **Two**: measure its pass rate, calls and time. **Three**: if it fails, name the signal from the first table that explains the failure. **Four**: try the cheaper fix. **Five**: split only that part, run the same test set again, and keep the team only if the numbers improved or it removes a risk the single agent could not, and write the decision down with the numbers. The same advice appears in framework documentation, which is a good sign that it is not just this course's opinion.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `Here is the rule in three questions. First: can one agent already do the job well enough on a handful of examples you saved? If yes, stop. Second: if not, do you know exactly why? A long job, a risky action that needs a separate helper, or several independent searches are real reasons. A feeling that it would be cooler is not. Third: have you tried the easy fixes first, like a clearer instruction or a shorter input? Only after all three do you split, and you split only the part that needs it. Then you run the same examples again to check that the team is really better, not just bigger.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Make the decision a recorded, reversible engineering choice. Write a short decision record: the signal, the evidence, the alternatives you tried, the measured comparison on one fixed test set, and the conditions under which you would revert. Compare on cost per successful task and on tail latency, not on averages of calls. Keep the single-agent path deployable behind a flag so you can switch back, and re-run the comparison when the model, the tools or the traffic change, because the winner can change. Prefer splits that reduce risk (permissions, trust boundaries) over splits that chase accuracy, since the first kind is easier to verify than the second.` },
      {
        type: 'version',
        text: `Framework documentation itself points to lighter options. The Microsoft Agent Framework overview says: "If you can write a function to handle the task, do that instead of using an AI agent", and recommends workflows when steps are well defined. The CrewAI Flows page describes an agent used directly in a Flow as a lightweight alternative to full Crews when you need simpler, focused task execution. Check the current pages, since framework guidance and names change.`,
        checked: CHECKED,
        sources: [DOCS.mafOverview, DOCS.crewFlows],
      },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: `Take a real or imagined project, or the three proposals from Hana's day, and apply the rule on paper. Use the five steps in order and write one line for each:` },
      { type: 'list', items: [
        'The single-agent version: its goal, its tools and the five test cases you would save for it.',
        'The expected measurements: pass rate, calls and time for that single agent. If you could run it, which number worries you most?',
        'The signal: which row of the first table, if any, explains the worry? If none does, write "none" and stop here.',
        'The cheaper fix you would try first, and the result that would convince you it was enough.',
        'The split, if still needed: which one part would become its own agent, which key it would own, and what you would measure to keep or drop it.',
      ] },
      {
        type: 'prompt',
        label: 'Challenge my decision',
        text: `I am deciding whether to build [your task] as one agent or as a team of agents.\n\nMy single-agent design: [goal, tools, five test cases].\nMy proposed team: [agents, what each writes, who coordinates].\nThe signal I think justifies it: [one row from: separate permissions, context too large, independent work, different models, independent review].\nThe cheaper fix I tried or would try: [description].\n\nAct as a critic, not a designer. Please:\n1. Say whether my signal is supported by the evidence I gave, and what evidence is missing.\n2. Say what the cheaper fix would have to show for me to stop.\n3. List the costs my team adds (calls, waiting time, things to maintain, places to fail).\n4. Suggest the one measurement that would settle the question on my own test cases.\n\nDo not add agents I did not list, and do not assume a result you cannot know.`,
      },
      { type: 'paragraph', text: `What to verify: every missing-evidence item the critic names should be something you can collect from your own test cases. Treat its opinion about which design is better as a hypothesis, not an answer. The measurement decides.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Apply the five-step rule to your own project, then start the module project below: it asks you to build a research team and to write down the cost, latency, complexity and reliability trade-offs of your own design.',
        'Next module, "AI Agent Frameworks and Development Tools", starts with the from-scratch loop as a reference and then compares LangChain, LangGraph, CrewAI, the Microsoft Agent Framework and vendor SDKs.',
        'Keep your decision note: module 9 teaches how to record a framework decision, and the same habit works for this one.',
      ] },
      { type: 'takeaways', items: [
        'Climb the ladder only when a measured problem requires it: one call, a fixed workflow, one agent, one agent with a reviewer, then a team.',
        'Real reasons for a team: separate permissions, context too large, independent work, different models, an independent review. Try the cheaper fix first for each.',
        'Signs against a team: one agent already passes, steps in a strict row, shared tools, no clear owner, a tight budget, no test set.',
        'Bound cost, latency, complexity and reliability with limits in code, and watch one number for each.',
        'Split only the part that needs it, measure again on the same test set, keep the team only if it wins, and write down why.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-72-code-challenge-1',
          kind: 'code-challenge',
          title: 'The decision rule as code',
          prompt: 'This runs with no model. Write chooseDesign(facts) from the decision rule. facts has passRate and target (numbers between 0 and 1), signals (a list of reasons for a team: "permissions", "context", "parallel", "models", "review") and cheaperFixTried (true or false). Return "single" when passRate is at least target. Otherwise return "single: collect more test cases" when there are no signals. Otherwise return "try the cheaper fix first" when cheaperFixTried is false. Otherwise return "split: " followed by the signals joined with a comma and a space.',
          concept: 'decision rule',
          language: 'javascript',
          starter: `function chooseDesign(facts) {
  // facts: { passRate: 0.9, target: 0.95, signals: ['permissions'], cheaperFixTried: false }
  return 'single';
}`,
          solution: `function chooseDesign(facts) {
  if (facts.passRate >= facts.target) return 'single';
  if (facts.signals.length === 0) return 'single: collect more test cases';
  if (!facts.cheaperFixTried) return 'try the cheaper fix first';
  return 'split: ' + facts.signals.join(', ');
}`,
          tests: {
            kind: 'function',
            fn: 'chooseDesign',
            cases: [
              { label: 'one agent already passes', args: [{ passRate: 0.96, target: 0.95, signals: ['parallel'], cheaperFixTried: false }], expected: 'single' },
              { label: 'fails but no signal', args: [{ passRate: 0.6, target: 0.9, signals: [], cheaperFixTried: true }], expected: 'single: collect more test cases' },
              { label: 'a signal but the cheaper fix is untried', args: [{ passRate: 0.7, target: 0.9, signals: ['permissions'], cheaperFixTried: false }], expected: 'try the cheaper fix first' },
              { label: 'signals and the cheaper fix was not enough', args: [{ passRate: 0.7, target: 0.9, signals: ['permissions', 'context'], cheaperFixTried: true }], expected: 'split: permissions, context' },
              { label: 'exactly on target counts as passing', args: [{ passRate: 0.9, target: 0.9, signals: ['review'], cheaperFixTried: true }], expected: 'single', hidden: true },
            ],
          },
          hints: [
            'The rule has an order. Check the cheapest answer first: does one agent already meet the target?',
            'Next checks, in order: no signals, then an untried cheaper fix. Each returns its own text.',
            'The last case is the only one that splits: build the text with signals.join(", ") after "split: ".',
          ],
          explanation: 'The rule is a short ladder of checks: pass the target and stop, no signal means collect more cases, an untried cheaper fix comes before any split, and only then do you split, naming the signals. Writing it as code makes it hard to skip a step.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-72-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Decide with evidence, not with a demo',
          prompt: 'Build the workflow Hana uses to decide whether her invoice reader should become a team. Pick the steps and put them in order, and keep out the steps that skip the evidence.',
          concept: 'evidence-based decision',
          situation: 'Hana\'s team has proposed turning a one-agent invoice reader into three agents. She wants a decision based on the team\'s own saved test cases, with the cheaper fixes tried first, and she does not want to build five agents before knowing whether any are needed.',
          parts: [
            { id: 'collect-cases', lane: 'input', label: 'Collect saved test cases', detail: 'Gather twenty realistic invoices, each with the fields you expect the reader to return.' },
            { id: 'run-single', lane: 'ai', label: 'Run one agent on every case', detail: 'The single-agent version processes all the saved invoices.' },
            { id: 'score-checks', lane: 'tool', label: 'Score the results with code checks', detail: 'Code compares each result with the expected fields and counts passes, calls and time.' },
            { id: 'read-failures', lane: 'human', label: 'Read the failures and name the cause', detail: 'A person reads the failed cases and says why each failed: a long input, similar tools, a missing step or something else.' },
            { id: 'cheaper-fix', lane: 'human', label: 'Try the cheaper fix first', detail: 'Clarify the instruction, sharpen a tool description or add one fixed step, then run the cases again.' },
            { id: 'run-team', lane: 'ai', label: 'Run the split design on the same cases', detail: 'Only for the part that the evidence points to, run the team version on exactly the same saved invoices.' },
            { id: 'compare', lane: 'tool', label: 'Compare pass rate, calls and time', detail: 'Code puts the single and split results side by side.' },
            { id: 'write-decision', lane: 'output', label: 'Write the decision with the numbers', detail: 'A short record: the signal, the numbers, the choice and when to revisit it.' },
            { id: 'build-five', lane: 'ai', label: 'Build five agents first', detail: 'Build the full team before any test, then see how it does.' },
            { id: 'demo-feel', lane: 'human', label: 'Choose the design that looked smartest in a demo', detail: 'Pick the design by how impressive a live demo felt to the people watching.' },
          ],
          rules: [
            { id: 'needs-cases', kind: 'require', parts: ['collect-cases', 'run-single', 'score-checks'], message: 'Without saved cases, a first run and a score, there is nothing to decide from.' },
            { id: 'needs-reading', kind: 'require', parts: ['read-failures', 'cheaper-fix'], message: 'A person must name the cause of the failures and try the cheaper fix before a split is considered.' },
            { id: 'needs-compare', kind: 'require', parts: ['run-team', 'compare', 'write-decision'], message: 'A split is judged by running it on the same cases, comparing the numbers and writing the decision down.' },
            { id: 'no-build-first', kind: 'forbid', parts: ['build-five'], message: 'Building the whole team first spends the effort before the evidence says any of it is needed.' },
            { id: 'no-demo', kind: 'forbid', parts: ['demo-feel'], message: 'A demo shows one case that looked good. The decision must come from the same test cases for both designs.' },
            { id: 'single-first', kind: 'before', parts: ['run-single', 'run-team'], message: 'The single agent is the baseline, so it must run before the team version.' },
            { id: 'fix-before-split', kind: 'before', parts: ['cheaper-fix', 'run-team'], message: 'Try the cheaper fix before you build or run the split.' },
            { id: 'compare-before-decide', kind: 'before', parts: ['compare', 'write-decision'], message: 'The decision is written after the numbers are compared.' },
          ],
          solution: ['collect-cases', 'run-single', 'score-checks', 'read-failures', 'cheaper-fix', 'run-team', 'compare', 'write-decision'],
          minSteps: 7,
          maxSteps: 9,
          simulation: {
            input: 'Hana asks: should the invoice reader become three agents?',
            steps: {
              'collect-cases': 'Twenty saved invoices are gathered, each with the fields a person expects.',
              'run-single': 'The single agent processes all twenty and returns the fields for each.',
              'score-checks': 'Code compares the fields: say, 17 of 20 match, with a count of calls and the time taken.',
              'read-failures': 'A person reads the three misses: all are invoices with very long item lists, so the signal is a long input.',
              'cheaper-fix': 'The team trims item lists into a short summary before extraction and runs the twenty cases again.',
              'run-team': 'Only the long-input part is split into a worker, and the twenty invoices are run through that design.',
              compare: 'Code shows both designs on the same twenty cases: pass rate, calls and time side by side.',
              'write-decision': 'Hana records the signal, the numbers and the decision, with a date to look again.',
            },
            output: 'A written decision based on the team\'s own cases, either "keep one agent" or "split the long-input step", with the numbers that support it.',
          },
          hints: [
            'Start from the evidence: what must exist before any design can be compared?',
            'The single agent is the baseline and the cheaper fix comes before any split. The decision comes last.',
            'Leave out the two steps that skip the evidence: building everything first and judging by a demo.',
          ],
          explanation: 'The workflow follows the decision rule: cases and a baseline first, a person names the cause, the cheaper fix comes before any split, the split is run on the same cases, and the decision is written with numbers. A demo or a full build up front would hide whether the team helps.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-72-q1',
        prompt: 'A proposal splits an invoice reader into three agents: extract, validate and summarise. The agents would share the same tools, and one agent with a fixed output format already passes the saved invoices. What does the decision rule say?',
        choices: [
          'Build the three agents anyway, because teams are the standard way to build anything that has several steps in it.',
          'Build the three agents, then compare them with one agent, since you cannot know what a team does until it exists.',
          'Keep one agent with structured output: it passes the test cases and there is no signal that a split would fix.',
          'Replace the single agent with a larger model first and then decide again on the strength of the new results.',
        ],
        answer: 2,
        explanation: 'The single agent meets the target and no signal points to a split, so the rule says stop. Building first and comparing later spends effort before the evidence, and a larger model is a different cost without a stated problem.',
      },
      {
        id: 'building-ai-agents-72-q2',
        prompt: 'A support assistant must read a customer\'s order history and may also issue refunds. Which design best matches a signal from this module?',
        choices: [
          'A read-only agent and a separate refund agent that needs a person\'s approval, so reading and acting are separate powers.',
          'Three agents named reader, thinker and refunder, all sharing the same tools so that any of them can step in for another.',
          'One agent holding both tools, with a prompt line that asks it to refund only when the customer is clearly right.',
          'A single agent with no refund tool at all, and a person who processes every refund by hand outside the system.',
        ],
        answer: 0,
        explanation: 'Separate permissions are a real reason for a split: reading private data and spending money should not sit behind one set of instructions. Shared tools and a prompt request keep the risk, and removing refunds changes the product rather than the design.',
      },
      {
        id: 'building-ai-agents-72-q3',
        prompt: 'True or false: if a framework makes it easy to build a team of agents, that is good evidence that your task needs a team.',
        choices: [
          'True, because frameworks are designed around the problems that developers meet most often in real projects, and teams are one of them.',
          'False, because a framework makes a team easy to start, not necessary; the need is a measured problem.',
          'True, because a framework would not offer team features unless single agents had been shown to fail quite often in practice.',
          'False, because every framework discourages teams and recommends a single agent for every possible task a developer might have.',
        ],
        answer: 1,
        explanation: 'Ease of building is a fact about the tool, not about your task. The need comes from a signal and a measurement. Some framework pages even recommend a simpler option when it will do, but none says single agents suit everything.',
      },
      {
        id: 'building-ai-agents-72-q4',
        audience: { max: 'beginner' },
        prompt: 'When you are deciding between one agent and a team, which question should come first?',
        choices: [
          'How many agents can we afford to build with the budget that we have been given for the project?',
          'Which agent framework has the most examples that we could copy into our own project quickly?',
          'Which job would be the most fun to give to a separate agent that has its own name and voice?',
          'Can one agent already do the job well enough on test examples that we have saved?',
        ],
        answer: 3,
        explanation: 'The first question is whether one agent is enough on your own saved examples. Budget, examples and fun do not tell you whether a team solves a problem you have.',
      },
      {
        id: 'building-ai-agents-72-q5',
        audience: { min: 'advanced' },
        prompt: 'You must justify a move from one agent to a team to your manager. Which evidence is the strongest?',
        choices: [
          'A live demo in which the team answered three hard questions that the single agent had got wrong the week before the meeting.',
          'The two designs run on one saved test set, with pass rate, calls and time side by side, and the named signal.',
          'A diagram of the team that shows the roles, the messages and the coordinator in clear and professional detail for the reviewers.',
          'A statement that competing companies are using teams of agents and that the company risks falling behind without one of its own.',
        ],
        answer: 1,
        explanation: 'A controlled comparison on one fixed test set, with costs and the reason for the split, can be checked and repeated. A demo is a handful of cases, a diagram describes a design and not a result, and what competitors do says nothing about your task.',
      },
    ],
    task: {
      title: 'Run the decision rule on your own project',
      minutes: 18,
      steps: [
        'Pick a project of your own, or one of Hana\'s three proposals. Write the single-agent version and five test cases you would save for it.',
        'Write the five steps of the decision rule for it, one line each: baseline, measurement, signal, cheaper fix, split. Stop at the first step that says "stop".',
        'Change it and observe: change one fact, for example make the single agent pass your target, remove the signal, or mark the cheaper fix as not yet tried. Re-read the rule and note how the decision changes each time.',
        'Write the decision as a short note: the signal, the evidence, the alternatives you tried and the condition under which you would revisit it.',
        'Reflect: which part of the decision depends on a measurement you do not have yet, and how would you get it cheaply?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use Hana\'s three proposals. For each, answer the three questions from the plain-language box and write "one agent", "two roles" or "a team of workers" with one reason.'] },
      { audience: { min: 'advanced' }, steps: ['Write the decision as a record with a revert condition and a comparison table of cost per successful task and tail latency. Define the flag that switches back to the single-agent path, and the metric that would trigger the switch.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'building-ai-agents-p6',
  title: 'Build a Multi-Agent Research System',
  summary: 'Build a small team of four agents: a Research Agent, an Analysis Agent, a Writing Agent and a Coordinator Agent that manages the workflow, and write down what the team costs compared with one agent.',
  outcome: 'A working multi-agent research pipeline with real roles, a bounded coordinator, checked task briefs, a shared board with write ownership and honest partial-result handling, plus a measured argument for when a single agent would have been enough.',
  unlockAfterDay: 72,
  steps: [
    {
      id: 'building-ai-agents-p6-s1',
      text: `Objectives. Build a multi-agent research system in plain JavaScript that answers one question with a structured report. The Research Agent collects information into notes. The Analysis Agent evaluates the findings and rates them. The Writing Agent turns the findings into a structured report with source references. The Coordinator Agent manages the workflow: it makes the plan, writes each worker's brief, checks every result, handles failures and stops at its limits. Choose your own question (for example "Should Mika's shop stock rain gear?", or a question from your own work or study). Then compare the team with a single-agent version and explain the trade-offs of cost, latency, complexity and reliability, with your own numbers.`,
    },
    {
      id: 'building-ai-agents-p6-s2',
      text: `Tools and resources. You need Node.js 22 or newer (nodejs.org) and a text editor. No API key is needed: every agent runs on a ScriptedModel, a teaching stand-in that holds prepared replies and returns the next one for a role, so the coordination logic can be built and tested for free. A ScriptedModel is not a model, so label any sample run "scripted". Start from the files of this module: roles.js (role cards and checks), mailbox.js (messages), team.js (the coordinator), waves.js (sequential or parallel plans), brief.js (briefs and done-criteria), board.js (the shared board) and partial.js (failures and partial results). Each worker is a function that takes a brief and returns { ok, data } or { ok: false, error }. If you have a key and want a real model, put the model call inside one worker, using your code from modules 3 and 4, keep the same function shape, and keep every check in your own code. Model names change, so keep the model id in one constant and check your provider's current documentation.`,
    },
    {
      id: 'building-ai-agents-p6-s3',
      text: `Build order. Work in this order and run the code after every step. (1) Write four role cards with a goal, tools, one write key and a done-criterion, and run checkRoles until it is empty. (2) Write a ScriptedModel with replies for each role, and the four workers on top of it (the coordinator is code that delegates, or a hybrid you can defend). (3) Write buildBrief for each worker, with the done-criterion as data, and check every result with it. (4) Put the results on a Blackboard where each key has one owner, and give workers snapshots. (5) Write the coordinator: an allow-list of workers, a step limit, a check after every step, and a trace of every brief and result. (6) Add failures: a scripted worker that throws, one that is too slow and one that returns an empty result. Make the coordinator return a complete, partial or failed status, with a required and an optional worker. (7) Make the Writing Agent produce a report with a summary, findings that each cite a note and its source, a "gaps" section and a next step. (8) Build the single-agent baseline and measure both designs.`,
    },
    {
      id: 'building-ai-agents-p6-s4',
      text: `Guided AI prompts. Use your own assistant as a reviewer. Replace the brackets with your own details, paste your code or cards, and check every claim it makes against your own run. "Review my coordinator for infinite-loop and unbounded-spend risks: [paste code]. List each way it could run forever or exceed a budget, and say which line would stop it." "Act as a critic of these four role cards: [paste cards]. Where do two roles overlap, which role has too many tools, and which done-criterion cannot be checked in code?" "Write ten test cases for my done-criteria: [paste criteria]. Include cases that should pass, fail on count, fail on a missing source and fail on an empty result." "Challenge my trade-off write-up: [paste]. Which of my claims about cost, latency, complexity and reliability rests on a number I did not measure?" Do not paste a key. Do not hand in a model's answer as your own: your rubric rewards what you decided, what you tested and what you changed after something failed.`,
    },
    {
      id: 'building-ai-agents-p6-s5',
      text: `Deliverables. Paste into your submission: (1) your code (the four agents, the coordinator, the briefs, the board and the failure handling), or the most important parts if it is long; (2) the four role cards; (3) a sample scripted run with the coordinator's trace, the board history and the final structured report; (4) a sample run where one worker fails and the report is partial, with the missing section visible; (5) at least six test cases with their results: a good run, a worker failure that gives a partial report, a required worker failure that gives status failed, the step limit stopping a long plan, a write to a key the agent does not own being refused, and an empty result being treated as a failure; (6) a short note on what you changed after a failure; (7) the trade-off report in the next step.`,
    },
    {
      id: 'building-ai-agents-p6-s6',
      text: `Trade-off report. Write about one page, with numbers from your own runs, that compares your team with a single agent that does the same job. For cost, count model calls (and made-up or measured tokens) per finished report for both designs. For latency, use ticks or real time, say which, and say which steps could run in parallel and what that would save. For complexity, count the prompts, role cards, message types, board keys and checks you must maintain in each design. For reliability, list the failures your team survives that the single agent would not, and the new ways the team can fail. End with a decision using the rule from lesson 72: which signal, if any, justifies the team, which cheaper fix you would try first, and whether you would ship the team or the single agent. If the honest answer is "one agent is enough for this question", say so and explain what job would need the team. Never present a scripted number as a benchmark.`,
    },
    {
      id: 'building-ai-agents-p6-s7',
      text: `Assessment criteria. A reviewer checks six things, plus the extras for your level. One: the four roles are real (goal, allow-listed tools, one write key, a checkable done-criterion). Two: coordination is bounded and checked (worker allow-list, step limit, briefs with data done-criteria, every result checked, no worker-to-worker messages). Three: a run shows a failed or slow worker and the report says what is missing. Four: the report traces to its notes and sources, with gaps listed. Five: the trade-off report compares the team with a single agent on cost, latency, complexity and reliability using your own numbers, and ends in a decision. Six: the submission shows your own choices, your tests and what you changed after a failure.`,
    },
    {
      id: 'building-ai-agents-p6-s8',
      text: `Common mistakes. Roles that overlap: two agents write the same key or share every tool. Free-text messages with no id, type or reply link. A coordinator that runs whatever plan it is given, with no allow-list or step limit. A worker whose empty result is accepted because it said ok. A writer that fills gaps with invented detail instead of listing them. Agents that message each other instead of going through the coordinator. Retrying a step that cannot safely be repeated. Skipping the single-agent baseline, so the team is never compared with anything. Presenting scripted output as a real model's output. A key pasted into the code or the submission.`,
    },
    {
      id: 'building-ai-agents-p6-s9',
      audience: { max: 'beginner' },
      text: `A smaller version for newcomers. Build a team of three: a Research Agent, a Writing Agent and a Coordinator, with the ScriptedModel only. Skip the Analysis Agent: the researcher hands notes straight to the writer. Start from team.js and brief.js, and change only the question, the notes and the plan. Write two role cards in your own words and run checkRoles on them. Make one scripted worker fail and show the report saying what is missing. Compare with one agent in four lines: how many calls, which steps could overlap, how many things to maintain, and which failure the team survives. Ask your assistant to explain each part of the code in plain words and write down, in your own words, what the coordinator does that a worker does not.`,
    },
    {
      id: 'building-ai-agents-p6-s10',
      audience: { min: 'advanced' },
      text: `A professional extension. Add the engineering you would want before anyone relied on this: (1) a trace, with a run id, step id and brief id on every log line, and a replay mode that re-runs a recorded run from the log with no model, checking that the trace is identical; (2) a threat note of one page covering prompt injection through a worker's result or a note's text (it must never reach a system role or a tool choice), tool permissions per role, the write rules on the board, and unbounded consumption (step, token and worker caps); (3) idempotency keys for retried steps, with a test that a repeated task runs once; (4) fault-injection tests for each failure kind (crash, timeout, empty result, wrong result, budget hit) and a circuit breaker that stops calling a worker after repeated failures; (5) the single-agent comparison run on a saved set of at least ten questions, reporting pass rate, calls, and slowest and typical time, not one run. State where your numbers are weakest.`,
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your multi-agent research system',
    placeholder: 'Paste your code, the four role cards, a scripted sample run with the trace and the report, a partial-result run, your test cases and results, what you changed after a failure, and your trade-off report (cost, latency, complexity, reliability).',
    hint: 'A good submission shows a coordinator with limits, four roles with checked cards, briefs with data done-criteria, a board with owners, a run that survives a failed worker and says what is missing, at least six tests, a single-agent comparison with your own numbers, and a decision that uses the rule from lesson 72. Never include an API key.',
  },
  rubric: [
    'Four roles are real: each agent has a goal, an allow-list of tools, one write key and a checkable done-criterion, and only the coordinator delegates work',
    'Coordination is bounded and checked: a worker allow-list, a step limit, briefs with done-criteria as data, every result checked in code, and no worker-to-worker messages',
    'Failure handling is demonstrated by a run: a worker fails or times out, the status is partial or failed according to which workers are required, and the report says what is missing instead of guessing',
    'The structured report traces to its notes: findings cite a source, gaps are listed, and nothing in the report is invented by the writing step',
    'The trade-off report compares the team with a single agent on cost, latency, complexity and reliability using the learner\'s own counts or measurements, and ends in a decision that applies the rule from lesson 72',
    'The submission shows the learner\'s own choices: tests written, what was changed after a failure, and no scripted output presented as a real model\'s',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The three-agent version runs on the ScriptedModel, the learner can explain in their own words what the coordinator does that a worker does not, and one failing worker produces a report that names what is missing'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['Messages go through a validated mailbox or a board with write ownership, and at least four test cases cover a good run, a partial run, a refused write and a step limit'] },
    { audience: { min: 'advanced' }, items: ['A replayable trace with run, step and brief ids, a one-page threat note on injection through results and on tool permissions, idempotent retries with a test, fault-injection tests for each failure kind, and a single-agent comparison on a saved set of at least ten questions with typical and slowest times'] },
  ],
};
