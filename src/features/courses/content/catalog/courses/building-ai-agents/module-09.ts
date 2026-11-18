import type { Lesson, LessonBlock, Project } from '../../../types';

// Module 9: AI Agent Frameworks and Development Tools (lessons 73 to 81, days 73 to 81, no project). Written 2026-11-18.
// Every framework name, package, class, function and status comes from docs/content/AGENTS_FACTS_B.md (read on official pages on 2026-11-18) and nothing marked UNVERIFIED there is used.
// Mika's Bike Shop, its parts, people and every number in the examples are invented. Demos are hand-written illustrations, never a model's output.
// Which code was run: the JavaScript in "Build it" blocks and the two LangGraph samples and the CrewAI Flow were run (outputs are real). The Python that calls a model, and the
// Microsoft, OpenAI, Claude and ADK samples, were only syntax-checked: their expected outputs are shapes.

export const project: Project | null = null;

const CHECKED = '2026-11-18';

const DOCS = {
  langchainOverview: { label: 'LangChain overview', url: 'https://docs.langchain.com/oss/python/langchain/overview' },
  langchainQuickstart: { label: 'LangChain quickstart', url: 'https://docs.langchain.com/oss/python/langchain/quickstart' },
  langchainTools: { label: 'LangChain tools', url: 'https://docs.langchain.com/oss/python/langchain/tools' },
  langchainModels: { label: 'LangChain models', url: 'https://docs.langchain.com/oss/python/langchain/models' },
  langchainHitl: { label: 'LangChain human-in-the-loop', url: 'https://docs.langchain.com/oss/python/langchain/human-in-the-loop' },
  langchainMigrate: { label: 'Migrate to LangChain v1', url: 'https://docs.langchain.com/oss/python/migrate/langchain-v1' },
  langgraphOverview: { label: 'LangGraph overview', url: 'https://docs.langchain.com/oss/python/langgraph/overview' },
  langgraphGraphApi: { label: 'LangGraph Graph API', url: 'https://docs.langchain.com/oss/python/langgraph/graph-api' },
  langgraphPersistence: { label: 'LangGraph persistence', url: 'https://docs.langchain.com/oss/python/langgraph/persistence' },
  langgraphInterrupts: { label: 'LangGraph interrupts', url: 'https://docs.langchain.com/oss/python/langgraph/interrupts' },
  crewInstall: { label: 'CrewAI installation', url: 'https://docs.crewai.com/en/installation' },
  crewCrews: { label: 'CrewAI crews', url: 'https://docs.crewai.com/en/concepts/crews' },
  crewAgents: { label: 'CrewAI agents', url: 'https://docs.crewai.com/en/concepts/agents' },
  crewTasks: { label: 'CrewAI tasks', url: 'https://docs.crewai.com/en/concepts/tasks' },
  crewLlms: { label: 'CrewAI LLMs', url: 'https://docs.crewai.com/en/concepts/llms' },
  crewFlows: { label: 'CrewAI flows', url: 'https://docs.crewai.com/en/concepts/flows' },
  msOverview: { label: 'Microsoft Agent Framework overview', url: 'https://learn.microsoft.com/en-us/agent-framework/overview/' },
  msAddTools: { label: 'Microsoft Agent Framework: add tools', url: 'https://learn.microsoft.com/en-us/agent-framework/get-started/add-tools' },
  msWorkflows: { label: 'Microsoft Agent Framework workflows', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/' },
  msSafety: { label: 'Microsoft Agent Framework: agent safety', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/agents/safety' },
  msUpgrade: { label: 'Microsoft Agent Framework: Python significant changes', url: 'https://learn.microsoft.com/en-us/agent-framework/support/upgrade/python-2026-significant-changes' },
  msBlog: { label: 'Microsoft Agent Framework version 1.0 (Microsoft DevBlogs)', url: 'https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/' },
  openaiAgents: { label: 'OpenAI Agents SDK (Python)', url: 'https://openai.github.io/openai-agents-python/' },
  openaiQuickstart: { label: 'OpenAI Agents SDK quickstart', url: 'https://openai.github.io/openai-agents-python/quickstart/' },
  openaiHandoffs: { label: 'OpenAI Agents SDK handoffs', url: 'https://openai.github.io/openai-agents-python/handoffs/' },
  openaiGuardrails: { label: 'OpenAI Agents SDK guardrails', url: 'https://openai.github.io/openai-agents-python/guardrails/' },
  openaiTracing: { label: 'OpenAI Agents SDK tracing', url: 'https://openai.github.io/openai-agents-python/tracing/' },
  claudeSdk: { label: 'Claude Agent SDK overview', url: 'https://code.claude.com/docs/en/agent-sdk/overview' },
  claudeSdkQuickstart: { label: 'Claude Agent SDK quickstart', url: 'https://code.claude.com/docs/en/agent-sdk/quickstart' },
  claudeSdkPermissions: { label: 'Claude Agent SDK permissions', url: 'https://code.claude.com/docs/en/agent-sdk/permissions' },
  toolRunner: { label: 'Anthropic tool runner', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner' },
  adk: { label: 'Agent Development Kit documentation', url: 'https://google.github.io/adk-docs/' },
  langsmithAgent: { label: 'LangSmith: evaluate a complex agent', url: 'https://docs.langchain.com/langsmith/evaluate-complex-agent' },
  openaiAgentEvals: { label: 'OpenAI: evaluate agent workflows', url: 'https://developers.openai.com/api/docs/guides/agent-evals' },
  mcpIntro: { label: 'Model Context Protocol introduction', url: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
  otelGenAi: { label: 'OpenTelemetry GenAI semantic conventions', url: 'https://opentelemetry.io/docs/specs/semconv/gen-ai/' },
} as const;

type Doc = (typeof DOCS)[keyof typeof DOCS];

/** A dated version note: official pages only, read on CHECKED. */
const note = (text: string, ...sources: Doc[]): LessonBlock => ({ type: 'version', text, checked: CHECKED, sources: sources.map((source) => ({ label: source.label, url: source.url })) });

export const lessons: Lesson[] = [
  {
    id: 'building-ai-agents-73',
    day: 73,
    title: 'Building Agents From Scratch',
    summary: 'Rebuild the smallest agent loop in about forty lines, and use its six jobs as the ruler every framework in this module is measured against.',
    intro: {
      objectives: [
        'Write a complete agent loop with a scripted model, a tool allow-list and a step limit',
        'Name the six jobs any agent loop does and find each one in the code',
        'Use the from-scratch loop as the reference when you read a framework',
      ],
      why: 'A framework is easier to judge once you know what is under it. If you can write the loop, you can tell what a framework adds, what it hides and where to look when it misbehaves.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'Suppose you deleted every agent framework from your computer tomorrow. What would you still be able to build? If the answer is “nothing”, you do not yet know what a framework is doing for you. This lesson rebuilds the smallest useful agent loop one more time, on purpose. It is the ruler for the next eight lessons: for each framework we will ask which of these jobs it does for you, which it leaves to you and what it costs.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel is a developer who helps Mika’s Bike Shop in Naga City. On day one he installed a framework, copied its quickstart and had a stock-checking agent answering questions in twenty minutes. Two weeks later a customer asked about a 700c inner tube and the agent called the stock tool four times for one question. Joel could not tell whose fault it was: the model, his tool description, or something the framework did between calls. He spent two evenings guessing. Then he wrote the whole loop himself, about forty lines, with a printed line for every step. The cause was a tool description that did not say what the tool returns when stock is zero. He went back to the framework, but now he could read its traces, because he knew what each step was.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'An **agent loop** repeats one cycle: send the conversation to the model, read its reply, and either finish or run the tool it asked for and send the result back. The **model** here is anything that takes messages and returns either a final answer or a request to call a tool. Underneath every framework in this module, the loop does the same six jobs.' },
      {
        type: 'table',
        headers: ['Job', 'Where it sits in the loop', 'What a framework may add'],
        rows: [
          ['1. Call the model', 'model(messages) at the top of each turn', 'Provider clients, retries, streaming, a model name string.'],
          ['2. Read the reply', 'if reply.type === final, return', 'Typed message objects instead of plain dictionaries.'],
          ['3. Check the tool request', 'Is the name on the allow-list? Are the arguments valid?', 'Schemas made from type hints or docstrings; approval rules.'],
          ['4. Run the tool and keep the result', 'Call it, catch errors, push the result as a message', 'Error wrapping, parallel calls, timeouts.'],
          ['5. Stop', 'A final answer, or maxSteps reached', 'Recursion limits, iteration caps, pause and resume.'],
          ['6. Record what happened', 'One printed line per step', 'Traces, saved state, dashboards.'],
        ],
        caption: 'The middle column is the whole loop. The right column is what the later lessons look for in each framework’s documentation.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[Start with the user message] --> B[Call the model with the messages]', '  B --> C{Final answer?}', '  C -->|Yes| D[Return the answer]', '  C -->|No| E{Tool name on the allow-list?}', '  E -->|No| F[Result is an error message]', '  E -->|Yes| G[Run the tool, catch errors]', '  F --> H[Add the result to the messages]', '  G --> H', '  H --> I{Steps left?}', '  I -->|Yes| B', '  I -->|No| J[Stop: maxSteps reached]'].join('\n'), caption: 'Look at the two ways out: the final answer at the top and the step limit at the bottom. A loop with only the first can run forever.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy. A framework is like a ready-made bicycle wheel from Mika’s shelf. It is round, true and fast to fit. But a rider who has never trued a wheel cannot tell why one wobbles. The loop is the thing you should be able to true by hand, even if you buy the wheel.' },
      { type: 'paragraph', text: 'The scripted model is a teaching stand-in, not a real model: it returns prepared replies in the order you wrote them. That makes the loop free to run, the same every time and easy to test, which is exactly what lesson 81 uses. Three details in the code come from the earlier modules. The tool name comes from the model, so it is untrusted input: check it against an allow-list, as in Securing Tool Execution. An error is a result the model can read, as in Handling Tool Results, not a crash. And a step limit is mandatory, as in Agent Execution Limits and Stop Conditions.' },
      note('The Anthropic tool runner page describes it as handling the agentic loop, error wrapping and type safety for tools you define in your own code, marks it beta, and says to use the manual loop when you need human-in-the-loop approval, custom logging or conditional execution. Microsoft’s Agent Framework overview says: “If you can write a function to handle the task, do that instead of using an AI agent.” Both pages were read on the date shown.', DOCS.toolRunner, DOCS.msOverview),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, read the code below like a recipe. The `STOCK` list is the shop’s shelf. `tools` is the list of things the agent may do: only `check_stock`. `scriptedModel` hands back prepared answers one at a time, like a person reading lines from a card. `runAgent` is the loop: it asks the model for the next move, and if the move is a final answer it stops; if it is a tool request it looks the tool up, runs it and writes the result on the notepad called `messages`. The `for` line counts the steps so the loop can never go on forever. Each `console.log` writes one line, so you can watch what the agent did.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In a real system this loop is the easy part. What takes time is everything around it: the `messages` array is resent on every turn, so latency and tokens grow with the number of steps, and a budget belongs in the loop next to the step cap. A tool that can be retried must be idempotent. State that must survive a restart has to be saved outside the process. A trace per step needs redaction before it reaches a log. Frameworks mostly sell these surrounding seams (persistence, retries, tracing, approvals), so your question is not “can it run the loop” but “can I see and control each seam, and what does it do by default?”' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You need Node.js 18 or newer (check with `node --version`). There is nothing to install, no API key and no network call. Save this as `agent.js`.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'agent.js: the minimal loop with a scripted model (a teaching stand-in, not a real model)',
        code: `// Mika's Bike Shop: the smallest agent loop. The "model" is scripted: a teaching stand-in, not a real model.
const STOCK = { 'chain-9sp': 4, 'tube-700c': 0 };

const tools = {
  check_stock: (args) => {
    if (typeof args.sku !== 'string') return { error: 'sku must be a string' };
    if (STOCK[args.sku] === undefined) return { error: 'unknown sku: ' + args.sku };
    return { sku: args.sku, in_stock: STOCK[args.sku] };
  },
};

function scriptedModel(script) {
  let next = 0;
  return (messages) => {
    const reply = script[next];
    next += 1;
    return reply === undefined ? { type: 'final', text: 'Script ended.' } : reply;
  };
}

function runAgent(model, userText, maxSteps) {
  const messages = [{ role: 'user', content: userText }];
  for (let step = 1; step <= maxSteps; step++) {
    const reply = model(messages);
    if (reply.type === 'final') {
      console.log('step ' + step + ': final -> ' + reply.text);
      return { status: 'done', steps: step };
    }
    let result = { error: 'tool not allowed: ' + reply.name };
    if (Object.keys(tools).includes(reply.name)) result = tools[reply.name](reply.args);
    console.log('step ' + step + ': ' + reply.name + '(' + JSON.stringify(reply.args) + ') -> ' + JSON.stringify(result));
    messages.push({ role: 'assistant', call: reply });
    messages.push({ role: 'tool', name: reply.name, content: JSON.stringify(result) });
  }
  console.log('stopped: maxSteps reached');
  return { status: 'stopped', steps: maxSteps };
}

const happy = scriptedModel([
  { type: 'tool_call', name: 'check_stock', args: { sku: 'chain-9sp' } },
  { type: 'final', text: 'Yes, we have 4 nine-speed chains in stock.' },
]);
console.log(runAgent(happy, 'Do you have a 9-speed chain?', 5));

const stuck = scriptedModel([
  { type: 'tool_call', name: 'check_stock', args: { sku: 'tube-700c' } },
  { type: 'tool_call', name: 'check_stock', args: { sku: 'tube-700c' } },
  { type: 'tool_call', name: 'check_stock', args: { sku: 'tube-700c' } },
]);
console.log(runAgent(stuck, 'Any 700c tubes?', 2));

const rogue = scriptedModel([{ type: 'tool_call', name: 'toString', args: {} }]);
console.log(runAgent(rogue, 'hi', 3));`,
      },
      { type: 'paragraph', text: 'The important lines. `scriptedModel` plays the part of the LLM, so every run is identical. The check `Object.keys(tools).includes(reply.name)` is the allow-list: a plain object also answers to inherited names such as `toString`, and the model chooses the name, so the code asks the list of your own tools instead. The tool returns `{ error: … }` for bad input rather than throwing, so the model can read what went wrong. The `for` loop is the step limit, and the two `messages.push` lines are the memory of the run. The second script never says `final`, so only `maxSteps` ends it.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run it', code: 'node agent.js' },
      {
        type: 'code',
        language: 'text',
        label: 'Expected output (real: this file was run with Node 22 on 2026-11-18)',
        code: `step 1: check_stock({"sku":"chain-9sp"}) -> {"sku":"chain-9sp","in_stock":4}
step 2: final -> Yes, we have 4 nine-speed chains in stock.
{ status: 'done', steps: 2 }
step 1: check_stock({"sku":"tube-700c"}) -> {"sku":"tube-700c","in_stock":0}
step 2: check_stock({"sku":"tube-700c"}) -> {"sku":"tube-700c","in_stock":0}
stopped: maxSteps reached
{ status: 'stopped', steps: 2 }
step 1: toString({}) -> {"error":"tool not allowed: toString"}
step 2: final -> Script ended.
{ status: 'done', steps: 2 }`,
      },
      {
        type: 'list',
        items: [
          'If node says `command not found`, install Node.js from nodejs.org and open a new terminal.',
          'If you see `SyntaxError`, check that the file was saved as plain text and that no line was cut when you pasted it.',
          'If the second run prints a third step, you changed `maxSteps`: the limit is the third argument of `runAgent`.',
          'If the last run runs `toString` instead of refusing it, you replaced the `Object.keys(tools).includes(...)` check with `tools[reply.name]`: put the allow-list check back.',
        ],
      },
      { type: 'warning', text: 'This loop is safe because the model is scripted. With a real model, the tool name and arguments are untrusted input: keep the allow-list, validate every argument before use, never run text from a reply with `eval`, keep the step cap, and never print keys or private customer data in the trace line. A tool that changes something (a refund, an email) needs a human approval step, which lesson 77 shows.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Keep `agent.js`: lessons 74 to 81 compare each framework with it.',
          'Add a second tool, `check_price`, and a script that uses both.',
          'Next lesson, Introduction to LangChain, shows the same loop behind one function, `create_agent`.',
          'Read the Anthropic tool runner page named in the version note to see a vendor’s helper over the same loop.',
        ],
      },
      { type: 'takeaways', items: [
        'An agent loop calls the model, reads the reply, runs an allowed tool, stores the result and repeats until a final answer or a step limit.',
        'Six jobs sit under every framework: call the model, read the reply, check the tool request, run the tool, stop, and record.',
        'Check a tool name against your own allow-list, because the model chooses it and a plain object also answers to inherited names.',
        'A scripted model makes the loop free, repeatable and testable: it is a stand-in, not a real model.',
        'Judge a framework by which of the six jobs it does, hides or leaves to you.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-73-code-challenge-1',
          kind: 'code-challenge',
          title: 'Finish the loop with a step limit',
          prompt: 'The model here is scripted: `script` is a list of prepared replies, each `{ type: \'tool_call\', name }` or `{ type: \'final\' }`. Finish `runAgent(script, maxSteps)`. At each step, read the next reply. A final reply (or no reply left) ends the run with status `done` and the number of the step it ended on. A tool call to `check_stock` is added to `calls`. Any other tool name is refused: it uses up a step but is not added. If `maxSteps` is reached first, return status `stopped`. This simulates the loop only, with no real model.',
          concept: 'agent loop with a step limit',
          language: 'javascript',
          starter: `function runAgent(script, maxSteps) {
  const allowed = ['check_stock'];
  const calls = [];
  for (let step = 1; step <= maxSteps; step++) {
    const reply = script[step - 1];
    // 1. no reply left, or a final reply: return { status: 'done', steps: step, calls: calls }
    // 2. a tool call with an allowed name: add reply.name to calls
  }
  // 3. the limit was reached
  return { status: 'done', steps: 0, calls: calls };
}`,
          solution: `function runAgent(script, maxSteps) {
  const allowed = ['check_stock'];
  const calls = [];
  for (let step = 1; step <= maxSteps; step++) {
    const reply = script[step - 1];
    if (reply === undefined || reply.type === 'final') {
      return { status: 'done', steps: step, calls: calls };
    }
    if (allowed.includes(reply.name)) {
      calls.push(reply.name);
    }
  }
  return { status: 'stopped', steps: maxSteps, calls: calls };
}`,
          tests: {
            kind: 'function',
            fn: 'runAgent',
            cases: [
              { label: 'one tool call, then final', args: [[{ type: 'tool_call', name: 'check_stock' }, { type: 'final' }], 5], expected: { status: 'done', steps: 2, calls: ['check_stock'] } },
              { label: 'the limit stops a script that never finishes', args: [[{ type: 'tool_call', name: 'check_stock' }, { type: 'tool_call', name: 'check_stock' }, { type: 'tool_call', name: 'check_stock' }], 2], expected: { status: 'stopped', steps: 2, calls: ['check_stock', 'check_stock'] } },
              { label: 'a final answer straight away', args: [[{ type: 'final' }], 3], expected: { status: 'done', steps: 1, calls: [] } },
              { label: 'a refused tool still uses a step', args: [[{ type: 'tool_call', name: 'refund_customer' }, { type: 'final' }], 3], expected: { status: 'done', steps: 2, calls: [] }, hidden: true },
              { label: 'an empty script counts as finished at step 1', args: [[], 3], expected: { status: 'done', steps: 1, calls: [] }, hidden: true },
              { label: 'the limit hits before the final reply', args: [[{ type: 'tool_call', name: 'check_stock' }, { type: 'final' }], 1], expected: { status: 'stopped', steps: 1, calls: ['check_stock'] }, hidden: true },
            ],
          },
          hints: [
            'Inside the loop, look at `script[step - 1]` first. It can be undefined when the script has run out.',
            'Return as soon as the reply is undefined or its type is `final`. The step number is the loop variable `step`.',
            'For a tool call, push the name only when `allowed.includes(reply.name)`. After the loop ends without a return, the status is `stopped` and the steps are `maxSteps`.',
          ],
          explanation: 'Two ways out of the loop make it safe: a final answer from inside it and the cap when the `for` condition fails. The allow-list check means a refused name costs a step but does nothing, so a model that keeps asking for a tool you never gave it still hits the limit.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-73-predict-output-1',
          kind: 'predict-output',
          title: 'How long does the history get?',
          prompt: 'This loop adds an assistant message and a tool message for each tool call. Predict the three lines it prints. The model is scripted.',
          concept: 'message history grows each step',
          language: 'javascript',
          code: `const script = [
  { type: 'tool_call', name: 'check_stock' },
  { type: 'tool_call', name: 'check_stock' },
  { type: 'final' },
];
const messages = [{ role: 'user', content: 'Any chains?' }];
let step = 0;
while (step < 5) {
  const reply = script[step];
  step += 1;
  if (reply.type === 'final') break;
  messages.push({ role: 'assistant', call: reply.name });
  messages.push({ role: 'tool', content: 'ok' });
}
console.log(step);
console.log(messages.length);
console.log(messages[messages.length - 1].role);`,
          choices: ['3\n5\ntool', '3\n3\ntool', '2\n5\ntool', '3\n5\nassistant'],
          wrongNotes: {
            '3\n3\ntool': 'Each tool call adds two messages (assistant and tool), not one. Two calls add four to the first user message.',
            '2\n5\ntool': 'The loop reads the final reply on step 3 and only then breaks, so step is 3, not 2.',
            '3\n5\nassistant': 'The last message pushed is always the tool result, because the break happens before anything is pushed for the final reply.',
          },
          hints: [
            'Count the steps: two tool calls, then the final reply is read on the next turn.',
            'Each tool call pushes two messages. Start from one message (the user’s).',
            'The break on the final reply happens before any push, so the last message is the second tool message.',
          ],
          explanation: 'Step counts the final turn too, so it is 3. One user message plus two pushes for each of two calls makes 5, and the last push was the tool result. The same growth is why a real agent’s cost and delay rise with each step: the whole history is sent again every turn.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-73-match-1',
          kind: 'match',
          title: 'Which job is missing?',
          prompt: 'Each complaint comes from a loop that skips one of the six jobs. Match the complaint to the job.',
          concept: 'the six jobs of an agent loop',
          labels: { terms: 'The complaint', meanings: 'The job that is missing' },
          pairs: [
            { term: 'The agent asked for a tool called delete_everything and the program tried to run it', definition: 'Check the tool request against an allow-list', note: 'The name came from the model. Nothing checked it against the tools you actually provide.' },
            { term: 'The agent called the same tool thirty times and the bill grew', definition: 'Stop: a step limit', note: 'A final answer is not the only way out. A cap stops a run that never reaches one.' },
            { term: 'You cannot tell which of the six steps was slow or wrong', definition: 'Record what happened', note: 'Without one line per step you have only the final answer to look at.' },
            { term: 'A tool raised an error and the whole program crashed instead of telling the model', definition: 'Run the tool and keep the result, including an error result', note: 'The error should be caught and returned as a message so the model can react.' },
          ],
          hints: [
            'Say what each complaint would have needed in the loop to be prevented.',
            'Two of the complaints are about something the model controls (a name, how long it runs).',
            'One is about seeing the run afterwards, one about what happens when a tool fails.',
          ],
          explanation: 'Each job exists because of one failure. The allow-list answers an unsafe name, the cap answers a loop that never ends, the trace answers a run you cannot explain, and caught errors answer a crash. These four are the first things to look for in any framework.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-73-q1',
        prompt: 'A run with `maxSteps` of 5 prints `stopped: maxSteps reached`. The scripted model would have given a final answer on its seventh reply. What does this show?',
        choices: [
          'The loop has a bug: a correct loop always waits for the final answer, so the limit should be removed from the code.',
          'The limit worked as designed. Ask why the model needed so many steps, not how to hide the stop.',
          'The scripted model is broken, because a model that has an answer will always give it within the first five steps it takes.',
          'The limit is too low in every case, so the sensible fix is to raise it until no run is ever stopped by it.',
        ],
        answer: 1,
        explanation: 'A cap exists to stop runs that do not finish. A stop is a signal to look at the trace for repeated calls or a missing answer path. Raising the number until nothing stops removes the protection.',
      },
      {
        id: 'building-ai-agents-73-q2',
        prompt: 'Why does the loop use `Object.keys(tools).includes(reply.name)` instead of just `tools[reply.name]`?',
        choices: [
          'It is faster, because a list lookup is quicker than reading a property from an object.',
          'It keeps the tool names in a fixed order, which the model needs so that it can always choose the first one first.',
          'A plain object also answers to names like `toString`, and the model picks the name, so the check uses your own list.',
          'It lets the loop add new tools while it is running, which a direct property lookup on the object would not allow at all.',
        ],
        answer: 2,
        explanation: 'The model controls the name. `tools[\'toString\']` would find a built-in function. Asking the list of your own keys keeps the allow-list in your hands.',
      },
      {
        id: 'building-ai-agents-73-q3',
        prompt: 'Joel is about to adopt a framework for Mika’s agent. What does having written the loop himself give him?',
        choices: [
          'A checklist to ask the framework about: tool checks, what stops a run, what it records, how errors return.',
          'Proof that the framework is not needed, because anything a framework does can be written in forty lines of plain code.',
          'A faster agent, since hand-written loops always run with less delay than any framework’s loop would have.',
          'Nothing useful, because the framework will replace the loop and its code will never be seen again.',
        ],
        answer: 0,
        explanation: 'The loop is a ruler, not a verdict. It does not say frameworks are bad: it tells you where to look. The other choices claim things the lesson never showed.',
      },
      {
        id: 'building-ai-agents-73-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is an agent loop?',
        choices: [
          'A program that asks the model what to do, does it if allowed, shows it the result and asks again until done or at a limit.',
          'A program that reads the user’s message one time and then sends back whatever the model happens to write in reply, with no tools or repeats.',
          'A list of the tools that the model may use, written in a file so that the model can read it before it answers.',
          'A way to make the model remember every conversation it has ever had with every customer.',
        ],
        answer: 0,
        explanation: 'The loop repeats ask, act, show the result, ask again. The second choice has no tools and no repeat, the third is only the tool list, and the fourth is memory, which is a different topic.',
      },
      {
        id: 'building-ai-agents-73-q5',
        audience: { min: 'advanced' },
        prompt: 'Your loop works, but the cost of one conversation keeps rising as agents take more steps. Which cause fits what the loop does?',
        choices: [
          'The step limit is checked after the model call, so every single step costs one extra call to the model.',
          'The whole `messages` array is sent every turn, so each step carries all earlier ones; budget cost beside the step cap.',
          'The tool allow-list is searched from the start on each step, which slows the loop down more and more as tools are added.',
          'The scripted model returns replies in order, which makes later replies more expensive than earlier ones.',
        ],
        answer: 1,
        explanation: 'History is resent each turn, so tokens grow with steps. A budget in the loop caps that growth. The step-limit and allow-list costs are tiny, and a scripted model has no cost.',
      },
    ],
    task: {
      title: 'Break and extend the minimal loop',
      steps: [
        'Save the loop as `agent.js` and run it with `node agent.js`. Compare your output with the expected output.',
        'Change it and observe: set the second run’s `maxSteps` to 1, then to 4. Write down the status and the number of steps each time.',
        'Change it and observe: in the first script, rename the tool to `refund_customer`. Predict the printed line before you run it, then run it.',
        'Add a `check_price` tool with an allow-list entry and a script that uses both tools. Print one line per step.',
        'Reflection: which of the six jobs did you have to touch for each change, and which one would you most want a framework to take off your hands?',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Add one comment in your own words above each line of `runAgent`. If you cannot explain a line, ask your assistant to explain it and then check the explanation against what the output shows.'] },
      { audience: { min: 'advanced' }, steps: ['Add a repeated-call detector: if the same tool is called with the same arguments twice in a row, stop with status `stuck`. Then store the trace as an array of objects instead of printed text and write one assertion over it.'] },
    ],
  },
  {
    id: 'building-ai-agents-74',
    day: 74,
    title: 'Introduction to LangChain',
    summary: 'See what LangChain’s create_agent does for you, how a tool becomes a schema, and where human approval fits, with one example that needs a key and one that runs offline.',
    intro: {
      objectives: [
        'Describe what `create_agent` combines (model, tools, system prompt, middleware) in the docs’ own terms',
        'Explain how a plain Python function with type hints and a docstring becomes a tool',
        'Add human approval to a tool call and name what it requires',
      ],
      why: 'LangChain is one of the most common ways to meet agents in a job. Reading its quickstart with the loop from lesson 73 in your head tells you what each line replaces and what you still have to decide.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'In lesson 73 the loop took about forty lines. LangChain’s quickstart builds a tool-using agent in a handful. Where did the rest go? Not into thin air: some of it moved into the framework, and some of it became settings you now have to know about. This lesson reads the quickstart as a map of the six jobs, and is honest about the parts the documentation pages do not say.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Nina builds Mika’s stock agent with `create_agent`. It works on the first try: a model name, one tool, one system prompt. Then Mika asks for a second tool, `update_price`, and says: “a person must approve every price change.” Nina turns on human approval for that tool. The first test fails with an error about state: the approval step needs a way to save where the run stopped, and she had not given the agent one. She reads the documentation page and finds the sentence she skipped: interrupts need a checkpointer, a place to keep the paused run. With one added line the pause works. The framework had done most of the job, but the one setting she did not know about decided whether it worked at all.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**LangChain** is an open-source framework for building agents and LLM applications. Its current entry point, per the overview page, is the function **`create_agent`** (`from langchain.agents import create_agent`), described there as “a minimal, highly configurable harness” that combines a model, tools, a prompt and middleware. A **harness** here means the ready-made loop and plumbing around the model. The page also says LangChain agents are built on LangGraph, the lower-level runtime you meet in the next lesson, which supplies things such as persistence and human-in-the-loop.' },
      { type: 'list', items: [
        '**Model.** Pass a string such as `"claude-sonnet-4-6"` or `"openai:gpt-6.1-sol"` (the quickstart uses both shapes), or build one with `init_chat_model`. Extra options such as `temperature`, `timeout`, `max_tokens` and `max_retries` (default 6 on the models page) pass as keywords.',
        '**Tools.** A tool can be a plain Python function. With the `@tool` decorator the docstring becomes the description the model reads, and the page says type hints are required because they define the input schema.',
        '**System prompt.** The `system_prompt` argument holds your instructions.',
        '**Middleware.** Code that wraps the loop. The documented examples are `HumanInTheLoopMiddleware` for approval and `PIIMiddleware` for personal data.',
        '**Invoke.** You call `agent.invoke` with a dictionary of messages and read the last message of the result.',
      ] },
      {
        type: 'table',
        headers: ['Job from lesson 73', 'In LangChain’s `create_agent`', 'What the pages read say'],
        rows: [
          ['Call the model', 'A model string or `init_chat_model`', 'Retries: `max_retries` defaults to 6 on the models page.'],
          ['Check the tool request', 'Schema from type hints, description from the docstring', 'Type hints are required.'],
          ['Run the tool', 'The loop inside the agent', 'Not shown in the pages read: read the tool pages for error handling.'],
          ['Stop', 'Not described in the pages read for this lesson', 'Find the documented limit before you rely on one.'],
          ['Ask a person', '`HumanInTheLoopMiddleware` with `interrupt_on`', 'Decisions are approve, edit or reject, and a checkpointer is required.'],
          ['Record what happened', 'LangSmith', 'The overview page says LangSmith handles tracing, debugging and evaluation.'],
        ],
        caption: 'The honest row is Stop. A short quickstart hides the question of how many steps a run may take. Ask it of every framework.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[Your code: model, tools, system prompt, middleware] --> B[create_agent]', '  B --> C[Agent loop built on LangGraph]', '  C --> D[agent.invoke with a messages dictionary]', '  D --> E[Result: the messages, last one is the answer]'].join('\n'), caption: 'Your four inputs go in at the top. The loop of lesson 73 now lives in the middle box, which you do not write.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: `create_agent` is a ready-to-ride bicycle. You choose the frame size (the model), the bell and basket (tools), and the rules you tell the rider (system prompt). You do not choose how the wheels are built. That is quick, and it is fine until the wheel wobbles. Then you need to know how it is built, which is why lesson 73 came first.' },
      { type: 'paragraph', text: 'A word on change. Before version 1.0, LangChain’s own advice was `langgraph.prebuilt.create_react_agent`; the migration page now says to use `langchain.agents.create_agent`, and older chains live in a package called `langchain-classic`. The pages read say nothing about two other older names, so this course does not call them deprecated. Pin the version you install and read the migration page before copying an older tutorial.' },
      note('Read on the date shown: create_agent is the documented entry point (LangChain overview and quickstart); install with `pip install -U langchain` and provider extras such as `langchain[anthropic]`; the quickstart asks for Python 3.11 or newer; the migration page recommends create_agent over the earlier prebuilt function; the human-in-the-loop page requires a checkpointer for interrupts. Model names in samples change often, so take a current id from the provider.', DOCS.langchainOverview, DOCS.langchainQuickstart, DOCS.langchainTools, DOCS.langchainModels, DOCS.langchainHitl, DOCS.langchainMigrate),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, here is the Python below. `MODEL` holds the name of the model in one place, so you can change it without hunting through the file. `STOCK` is the shop’s shelf. The line `@tool` above `check_stock` tells LangChain “this function is a tool the model may call”. The text in triple quotes under the function name is read by the model as the tool’s manual, so write it for the model. The `sku: str` part says the tool takes one piece of text. `create_agent(...)` assembles the agent from the model, the tool and your instructions. `agent.invoke(...)` sends the customer’s question, and the last line prints the answer.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Costs of this abstraction to weigh. The loop, its retries and its stop rules are now someone else’s defaults, so find them and set them explicitly (timeouts, `max_retries`, a step limit). Middleware order matters, because each layer wraps the next. The result is the whole state, not just the answer, so read the messages you need and log with redaction. The API has moved before (see the migration page), so pin versions and keep one thin integration test that calls your agent with a fake model and asserts the tool-call sequence, as lesson 81 shows. LangSmith is separate tooling; you can trace through your own OpenTelemetry-style logging instead if you do not want that dependency.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'There are two examples. **The first needs a model key** and calls a real model, so its output cannot be shown here. **The second runs offline** with Node.js and shows what `create_agent` is shaped like. Start with the key-needing one only if you have a key; otherwise skip to the offline one. Python 3.11 or newer is needed for LangChain.' },
      { type: 'code', language: 'bash', label: 'Install and set the key (placeholder: use your own, never commit it)', code: 'pip install -U "langchain[anthropic]"\nexport ANTHROPIC_API_KEY="<your-key-here>"' },
      {
        type: 'code',
        language: 'python',
        label: 'agent_lc.py (needs a key; syntax-checked, not run)',
        code: `import os

from langchain.agents import create_agent
from langchain.tools import tool

# Model names change often: check the provider's catalog and set AGENT_MODEL if this one is retired.
MODEL = os.environ.get("AGENT_MODEL", "claude-sonnet-4-6")

STOCK = {"chain-9sp": 4, "tube-700c": 0}


@tool
def check_stock(sku: str) -> str:
    """Check how many units of a part Mika's Bike Shop has in stock.

    Args:
        sku: The part code, for example chain-9sp
    """
    if sku not in STOCK:
        return f"Unknown part code: {sku}"
    return f"{sku}: {STOCK[sku]} in stock"


agent = create_agent(
    model=MODEL,
    tools=[check_stock],
    system_prompt="You answer questions for Mika's Bike Shop. Use check_stock for stock questions.",
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Do you have a 9-speed chain?"}]}
)
print(result["messages"][-1].content_blocks)`,
      },
      { type: 'paragraph', text: 'Human approval, from the documentation’s own sample. It is a fragment: `write_file`, `execute_sql` and `read_data` are tools you would define yourself. Notice the `checkpointer` line, which Nina missed.' },
      {
        type: 'code',
        language: 'python',
        label: 'Fragment: human approval (copied from the LangChain human-in-the-loop page; the tools are not defined here)',
        code: `from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="gpt-6.1-sol",
    tools=[write_file, execute_sql, read_data],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                "write_file": True,  # approve, edit, and reject allowed
                "execute_sql": {"allowed_decisions": ["approve", "reject"]},
                "read_data": False,  # no review needed
            },
        ),
    ],
    checkpointer=InMemorySaver(),  # required for interrupts
)`,
      },
      { type: 'paragraph', text: '**Offline, no key.** This stand-in has the same shape as `create_agent`: configuration in, an object with `invoke` out. It is your lesson 73 loop behind a function. It is not LangChain and does not use any of its code.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'agent_mini.js: a create_agent-shaped stand-in with a scripted model (offline)',
        code: `// A stand-in with the same shape as create_agent: configuration in, an object with invoke out. It is NOT LangChain.
function createMiniAgent(config) {
  return {
    invoke: (input) => {
      const messages = [{ role: 'system', content: config.systemPrompt }].concat(input.messages);
      for (let step = 1; step <= config.maxSteps; step++) {
        const reply = config.model(messages);
        if (reply.type === 'final') {
          messages.push({ role: 'assistant', content: reply.text });
          return { messages: messages };
        }
        let result = 'tool not allowed: ' + reply.name;
        if (Object.keys(config.tools).includes(reply.name)) result = config.tools[reply.name](reply.args);
        messages.push({ role: 'tool', name: reply.name, content: result });
      }
      messages.push({ role: 'assistant', content: 'Stopped: step limit reached.' });
      return { messages: messages };
    },
  };
}

const STOCK = { 'chain-9sp': 4 };
const script = [
  { type: 'tool_call', name: 'check_stock', args: { sku: 'chain-9sp' } },
  { type: 'final', text: 'We have 4 in stock.' },
];
let next = 0;

const agent = createMiniAgent({
  model: () => script[next++],
  tools: { check_stock: (args) => args.sku + ': ' + STOCK[args.sku] + ' in stock' },
  systemPrompt: 'You answer questions for Mika\\'s Bike Shop.',
  maxSteps: 5,
});

const result = agent.invoke({ messages: [{ role: 'user', content: 'Do you have a 9-speed chain?' }] });
console.log(result.messages[result.messages.length - 1].content);
console.log(result.messages.map((m) => m.role).join(','));`,
      },
      { type: 'paragraph', text: 'Walk through it. `createMiniAgent` takes the same kinds of inputs as `create_agent`: a model, tools, a system prompt and (new here) a `maxSteps` limit, because the stand-in has to say what it does when a model never finishes. `invoke` takes a dictionary with a `messages` list and returns one, like LangChain’s. The loop inside is lesson 73 again. In the key-needing file, the equivalent of that loop is the call `create_agent(...)`; what you cannot see there is exactly what the table above asks about.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run the offline file', code: 'node agent_mini.js' },
      { type: 'code', language: 'text', label: 'Expected output for agent_mini.js (real: run with Node 22 on 2026-11-18)', code: 'We have 4 in stock.\nsystem,user,tool,assistant' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model’s wording will differ) for agent_lc.py', code: '[{"type": "text", "text": "<the model’s answer about the 9-speed chain>"}]\n# a list of content blocks; the last message of result["messages"] is the model’s answer' },
      {
        type: 'list',
        items: [
          'If `pip` says no matching distribution, check `python3 --version`: LangChain asks for Python 3.11 or newer.',
          'If the key file fails with an authentication error, the variable is not set in this terminal: run the `export` line again in the same window.',
          'If it says the model was not found, the model id in `MODEL` has been retired or you have no access to it: take a current id from the provider’s models page and set `AGENT_MODEL`.',
          'If the human-approval fragment complains about state or a thread, you left out `checkpointer`, which the page says is required for interrupts.',
        ],
      },
      { type: 'warning', text: 'A model key costs money and can be stolen: keep it in an environment variable, keep `.env` out of git, and never paste it into code or a chat. Everything the model sends back about tools is untrusted until your tool validates it. Do not give an agent tools that write or delete (such as the `write_file` and `execute_sql` of the fragment) without the approval step and least privilege, and note that with a hosted model the questions you send leave your computer.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Run the offline file, then change `maxSteps` to 1 and read what the last message says.',
          'Open the LangChain quickstart and find the model string, the tool and the invoke call in it.',
          'Next lesson, Introduction to LangGraph, opens the runtime underneath: state, nodes and edges, with samples that run with no key.',
          'Read the human-in-the-loop page once more and note which of the three decisions your own tools need.',
        ],
      },
      { type: 'takeaways', items: [
        '`create_agent` is LangChain’s documented entry point: it combines a model, tools, a system prompt and middleware around a ready-made loop.',
        'A tool can be a plain function: its docstring is the description the model reads and its type hints define the input schema.',
        'Human approval is middleware with `interrupt_on`, and it needs a checkpointer to save the paused run.',
        'A short quickstart hides decisions such as retries and step limits: find them in the docs and set them yourself.',
        'APIs change: pin the version, and read the migration page before copying an older tutorial.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-74-code-challenge-1',
          kind: 'code-challenge',
          title: 'Turn a function into a tool schema',
          prompt: 'A tool framework reads a function’s name, docstring and type hints and builds a schema for the model. This simulates that idea only, with plain data in place of Python code, and is not LangChain’s code. Write `toolSpec(fn)`, where `fn` is `{ name, doc, params }` and each param is `{ name, type, required }` with type `str`, `int`, `float` or `bool`. Return `{ name, description, input_schema }`. `description` is `doc`. `input_schema` is `{ type: \'object\', properties, required }`: each param becomes a property whose type is `string`, `integer`, `number` or `boolean`, and `required` lists the names of the required params. If a param has no known type, return `{ error: \'missing or unknown type hint for <name>\' }` instead.',
          concept: 'tool schema from type hints',
          language: 'javascript',
          starter: `function toolSpec(fn) {
  const typeMap = { str: 'string', int: 'integer', float: 'number', bool: 'boolean' };
  const properties = {};
  const required = [];
  for (const param of fn.params) {
    // 1. unknown or missing type: return the error object
    // 2. add the property, and add the name to required when param.required is true
  }
  return { name: fn.name, description: fn.doc, input_schema: { type: 'object', properties: properties, required: required } };
}`,
          solution: `function toolSpec(fn) {
  const typeMap = { str: 'string', int: 'integer', float: 'number', bool: 'boolean' };
  const properties = {};
  const required = [];
  for (const param of fn.params) {
    if (typeMap[param.type] === undefined) {
      return { error: 'missing or unknown type hint for ' + param.name };
    }
    properties[param.name] = { type: typeMap[param.type] };
    if (param.required) {
      required.push(param.name);
    }
  }
  return { name: fn.name, description: fn.doc, input_schema: { type: 'object', properties: properties, required: required } };
}`,
          tests: {
            kind: 'function',
            fn: 'toolSpec',
            cases: [
              { label: 'one required text parameter', args: [{ name: 'check_stock', doc: 'Check stock for a part.', params: [{ name: 'sku', type: 'str', required: true }] }], expected: { name: 'check_stock', description: 'Check stock for a part.', input_schema: { type: 'object', properties: { sku: { type: 'string' } }, required: ['sku'] } } },
              { label: 'an optional boolean', args: [{ name: 'lookup', doc: 'Look up an invoice.', params: [{ name: 'id', type: 'str', required: true }, { name: 'include_items', type: 'bool', required: false }] }], expected: { name: 'lookup', description: 'Look up an invoice.', input_schema: { type: 'object', properties: { id: { type: 'string' }, include_items: { type: 'boolean' } }, required: ['id'] } } },
              { label: 'a missing type hint is an error', args: [{ name: 'oops', doc: 'No hint.', params: [{ name: 'value', required: true }] }], expected: { error: 'missing or unknown type hint for value' } },
              { label: 'int and float', args: [{ name: 'price', doc: 'Set a price.', params: [{ name: 'qty', type: 'int', required: true }, { name: 'amount', type: 'float', required: true }] }], expected: { name: 'price', description: 'Set a price.', input_schema: { type: 'object', properties: { qty: { type: 'integer' }, amount: { type: 'number' } }, required: ['qty', 'amount'] } }, hidden: true },
              { label: 'no parameters', args: [{ name: 'ping', doc: 'Ping.', params: [] }], expected: { name: 'ping', description: 'Ping.', input_schema: { type: 'object', properties: {}, required: [] } }, hidden: true },
            ],
          },
          hints: [
            'Look the param type up in `typeMap`. An unknown or missing type gives `undefined`.',
            'On an unknown type, return the error object at once. Otherwise set `properties[param.name] = { type: typeMap[param.type] }`.',
            'Push `param.name` into `required` only when `param.required` is true.',
          ],
          explanation: 'This is why the docs insist on type hints: without a type there is nothing to build the schema from, so the framework cannot tell the model what arguments the tool takes. The description is the docstring, which is why it is written for the model, not for a colleague.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-74-scenario-1',
          kind: 'scenario',
          title: 'Approval for price changes',
          prompt: 'Choose the best way to get a person’s approval before the agent changes a price.',
          concept: 'human approval middleware',
          situation: 'Nina’s `create_agent` agent has two tools: `read_prices` and `update_price`. Mika wants a person to approve every `update_price` call, and does not want to be asked about reads. The agent runs behind a web page, so the person may answer minutes later.',
          options: [
            { text: 'Use `HumanInTheLoopMiddleware` with `interrupt_on` set to true for `update_price` and false for `read_prices`, and give the agent a checkpointer so the paused run can be saved.', consequence: 'Price changes pause for a decision (approve, edit or reject) and reads go straight through. The checkpointer keeps the run so it can resume when the person answers.', quality: 'best' },
            { text: 'Put an `input("approve? ")` call inside `update_price` so the tool itself asks before it writes.', consequence: 'It works for one person at a terminal, but it blocks a web request, cannot wait minutes and is invisible to the framework’s pause and resume.', quality: 'acceptable' },
            { text: 'Add a line to the system prompt: “Always ask before changing a price.”', consequence: 'A prompt is a request, not a control. A model can skip it, misread it or be talked out of it, and nothing stops the call from running.', quality: 'poor' },
            { text: 'Turn on the middleware for `update_price` but leave out the checkpointer, to keep the setup small.', consequence: 'The documentation says interrupts need a checkpointer, so the pause fails with a state error, just as in Nina’s first test.', quality: 'poor' },
          ],
          hints: [
            'Which option makes the run pause and resume, rather than block or hope?',
            'Which option stops the call itself, instead of asking the model to behave?',
            'The page that describes the middleware also says what it needs in order to save the paused run.',
          ],
          explanation: 'Approval has to be a control in the code path, and a pause that lasts minutes needs saved state. The documented middleware gives both, as long as the checkpointer is present.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-74-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Questions the quickstart does not answer',
          prompt: 'Tap each card. These are things a short quickstart leaves out, and what to do about each.',
          concept: 'what a framework hides',
          cards: [
            { front: 'How many steps can a run take?', back: 'The pages read for this lesson do not say. Find the documented limit, set it explicitly, and test what happens when it is reached.' },
            { front: 'What happens when the provider call fails?', back: 'The models page documents `max_retries` with a default of 6. Know it, because six retries on a slow failure add delay and calls. Set your own timeout and retry count.' },
            { front: 'Is my private data in the trace?', back: 'LangSmith handles tracing according to the overview page. Before you turn tracing on, decide what may be sent and what must be removed first.' },
          ],
          hints: [
            'Think of the six jobs from lesson 73: stop, call the model, record.',
            'Each card is a default someone else chose for you.',
            'Ask where the default is written down, then change it deliberately.',
          ],
          explanation: 'A framework turns decisions into defaults. The skill is knowing where each default lives so that you choose it, instead of discovering it during an incident.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-74-q1',
        prompt: 'Your `@tool` function has no type hints and a one-word docstring. The agent never calls it, or calls it with the wrong arguments. What does the LangChain tools page point to?',
        choices: [
          'The model is too small, because a good model reads the function body and works out for itself what the tool does, even with no hints.',
          'Tools must be registered in a separate file before the agent can see them.',
          'The framework retries each call six times, which hides the arguments from the model.',
          'The docstring is the model’s description and type hints define the schema, so thin ones leave it little to go on.',
        ],
        answer: 3,
        explanation: 'The page says the docstring becomes the description and type hints are required because they define the schema. The model never sees the function body.',
      },
      {
        id: 'building-ai-agents-74-q2',
        prompt: 'You add `HumanInTheLoopMiddleware` to an agent and the first run stops with an error about state. What is the most likely missing piece?',
        choices: [
          'A second model, which the middleware uses to judge whether a human is needed.',
          'A checkpointer, since the paused run must be saved to survive the interrupt.',
          'A larger `max_tokens` value, because approval messages need extra output room.',
          'A `PIIMiddleware`, since approval only works after personal data has been removed from every message in the run.',
        ],
        answer: 1,
        explanation: 'The human-in-the-loop page says you must configure a checkpointer to persist state across interrupts. The other choices are invented requirements.',
      },
      {
        id: 'building-ai-agents-74-q3',
        prompt: 'A teammate pastes an older tutorial that builds the agent with `langgraph.prebuilt.create_react_agent`. What is the sound next step?',
        choices: [
          'Use it as it is, since a function that still imports will behave exactly the way that the tutorial says it does, now and later.',
          'Read the migration page, write new code with `create_agent`, pin the version and check the tutorial against the docs.',
          'Replace LangChain with a different framework, because an API change means the project is no longer being maintained.',
          'Delete the tutorial’s tools, since tool definitions changed completely in version 1.0.',
        ],
        answer: 1,
        explanation: 'The migration page recommends `create_agent` for new code. A tutorial can be out of date without anything being broken, so you check against the docs and pin versions.',
      },
      {
        id: 'building-ai-agents-74-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what do you give to `create_agent`, and what do you get back?',
        choices: [
          'You give it a database and it gives back a copy of the database.',
          'You give it only a question, and it gives back a brand new model that has been trained to answer that question.',
          'You give it a model, tools and instructions, and get an agent you send messages to and read answers from.',
          'You give it a long document and it gives back a shorter one that keeps all of the important facts in it.',
        ],
        answer: 2,
        explanation: 'The function assembles an agent from a model, tools and a system prompt (and optional middleware). You then call `invoke` with messages.',
      },
      {
        id: 'building-ai-agents-74-q5',
        audience: { min: 'advanced' },
        prompt: 'The models page lists `max_retries` with a default of 6. During a provider outage your agent seems to hang for a long time. What should you do?',
        choices: [
          'Nothing: defaults are chosen to be right for every application, so the delay is only the outage’s fault.',
          'Remove all retries, because any retry is a bug in a production system.',
          'Set a timeout and a lower retry count, log each retry, and decide what the agent does after the limit.',
          'Wrap the whole agent in an endless loop that calls it again and again until the provider has recovered.',
        ],
        answer: 2,
        explanation: 'Retries multiply delay and calls when a provider is failing. A deliberate timeout, retry count and failure path keep a hang from turning into an outage of your own.',
      },
    ],
    task: {
      title: 'Read a framework against your own loop',
      steps: [
        'Run `agent_mini.js` offline with `node agent_mini.js` and compare it with your lesson 73 file. Which lines moved into `createMiniAgent`?',
        'Change it and observe: set `maxSteps` to 1 and run it again. Write down what the last message says and which of the six jobs produced it.',
        'If you have a key and Python 3.11, run `agent_lc.py`. Then change the docstring of `check_stock` to the single word “Stock.” and run it again with the same question. Note whether the tool call or the answer changes. If you have no key, do the next step instead.',
        'Without a key: open the LangChain quickstart and write down, for each line of its sample, which of the six jobs it covers and which one it does not mention.',
        'Reflection: which default in this lesson (retries, step limit, tracing) would you set explicitly first, and why?',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before running anything, copy the five lines of `create_agent(...)` and write next to each line one sentence in your own words saying what it hands to the framework.'] },
      { audience: { min: 'advanced' }, steps: ['Write a test for `createMiniAgent` that uses a scripted model and asserts the exact sequence of message roles, then add a case where the model asks for an unknown tool and assert the result message. This is the test you would also want around a real `create_agent` call.'] },
    ],
  },
  {
    id: 'building-ai-agents-75',
    day: 75,
    title: 'Introduction to LangGraph',
    summary: 'Draw an agent’s flow as state, nodes and edges, run a graph with a conditional edge and a human pause on your own machine, with no API key.',
    intro: {
      objectives: [
        'Explain state, nodes, edges and conditional edges in LangGraph’s terms',
        'Run a graph that loops until a rule is met, and read its final state',
        'Pause a graph for a person, resume it with the same thread id, and name what that needs',
      ],
      why: 'Some work is a loop and some is a flow with decisions and pauses. LangGraph lets you write the flow as code you can read and test, instead of hoping a prompt keeps the model on track.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'A loop is the right shape for “keep asking until the model is done”. But much real work is a flow: check the stock, then decide, then maybe wait for a person, then book. Can you write that flow in code, so the order of steps does not depend on a model remembering a sentence in a prompt? That is the question LangGraph answers. Every example in this lesson runs on your computer with no API key and no network call.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Paolo is building Mika’s repair booking helper. The steps are fixed: check that the part is in stock, if not offer to order it, then ask a mechanic to approve the booking, then confirm. His first version was one agent with those steps in the system prompt. Most days it worked. One afternoon it confirmed a booking without waiting for the mechanic, because the model judged the request “simple”. The order of the steps had been a request, not a rule. Paolo moved the steps into a graph: the approval became a node that every booking must pass, and the pause became part of the structure. The model still writes the friendly text inside the nodes. It no longer decides whether approval happens.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**LangGraph** is described on its overview page as “a low-level orchestration framework and runtime for long-running, stateful agents”. It “does not prescribe prompts or agent architecture” and does not require LangChain. You describe a **graph**: shared **state**, **nodes** that read and update it, and **edges** that say which node runs next. In your lesson 73 loop, the order was “model, then tool, then model”. In a graph you write the order yourself.' },
      {
        type: 'table',
        headers: ['LangGraph term', 'Plain meaning', 'In the code below'],
        rows: [
          ['State', 'The shared data every step can read and update. Described with a `TypedDict` (or a dataclass).', '`State` with `score` and `label`'],
          ['Node', 'One step: a function that gets the state and returns a partial update.', '`bump`, `high`'],
          ['Edge', 'Which node runs after this one. `START` is the entry and `END` the exit.', '`add_edge(START, "bump")`'],
          ['Conditional edge', 'A routing function reads the state and returns the next node’s name.', '`add_conditional_edges("bump", route, …)`'],
          ['Compile', 'Turns the builder into something you can run. The docs say you must compile before you invoke.', '`builder.compile()`'],
          ['Checkpointer', 'Saves the state of a thread (one conversation or run) as checkpoints, so it can pause and resume.', '`InMemorySaver()`'],
          ['Interrupt', '`interrupt()` pauses the graph and hands a value to the caller; `Command(resume=…)` continues it.', '`ask_human`'],
        ],
        caption: 'These seven words are most of what you need. Notice that nothing in the table is about a model: LangGraph is about the flow, and a node may or may not call one.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A((START)) --> B[bump: add 1 to score]', '  B --> C{route: score at least 2?}', '  C -->|retry| B', '  C -->|high| D[high: set label to done]', '  D --> E((END))'].join('\n'), caption: 'This is the first sample as a drawing. The arrow from the decision back to bump is the loop: a graph can repeat, and what stops it is the rule in route.' },
      { type: 'paragraph', text: 'A pause is the part that is hard to build by hand. When a node calls `interrupt()`, the run stops and returns a value to you. To continue, you invoke again with `Command(resume=…)` and the same **thread id**, and that value becomes what `interrupt()` returns. This needs a checkpointer, because the graph has to remember where it stopped. One detail matters a lot: on resume the node restarts from its beginning, so any code before `interrupt()` runs a second time. A side effect there, such as sending a text message, would happen twice. Put side effects after the pause, or make them safe to repeat.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: a loop with a model is like a taxi driver you ask turn by turn. A graph is a subway map. You decide the stations and the lines; a model can work inside one station, but it cannot invent a new line. The cost is that you must draw the map, and a map that is wrong sends everyone the wrong way, so test it.' },
      { type: 'paragraph', text: 'One more honest point. In the first sample the loop ends because `bump` raises the score. If `bump` stopped changing the score, nothing in the graph would end the loop. When we ran that on 2026-11-18 with langgraph 1.2.22, it stopped by raising `GraphRecursionError`, a recursion limit whose message says it can be raised with the `recursion_limit` config key. That is something we saw by running the code, not something read on a documentation page, and the limit was very high, so a runaway could make thousands of calls first. Keep your own counter in the state and route to an end or an escalation, as the earlier lesson Agent Execution Limits and Stop Conditions taught.' },
      note('Read on the date shown: LangGraph describes itself as a low-level orchestration framework and runtime for long-running, stateful agents (overview); StateGraph with add_node, add_edge and add_conditional_edges, START and END, and the rule that a graph must be compiled before it is invoked (Graph API); checkpointers save a thread’s state, InMemorySaver is lost on restart, PostgresSaver and SqliteSaver exist (persistence); interrupt() and Command(resume=...) need a checkpointer and restart the node from its beginning (interrupts). The two samples below were also run with langgraph 1.2.22.', DOCS.langgraphOverview, DOCS.langgraphGraphApi, DOCS.langgraphPersistence, DOCS.langgraphInterrupts),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, read the first program like a board game. `State` lists the things written on the scoreboard: a number called `score` and some text called `label`. Each node is a square on the board: `bump` adds one point, `high` writes “done”. The edges are arrows between squares. The decision, `route`, looks at the score: two or more, go to `high`; less, go back to `bump`. `builder.compile()` finishes the board so you can play, and `graph.invoke` places a piece on START with `score` 0. The printout is the scoreboard when the piece reaches END.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In production the questions are about durability and replay. `InMemorySaver` loses everything on restart and lives in one process, so a service with several instances and hour-long approvals needs a database-backed saver (the docs list `PostgresSaver`), and the thread id becomes your key for tenancy and cleanup, so never derive it from user-controlled text alone. Resume re-runs the node from its start, so node code must be idempotent or split so effects come after the interrupt. Checkpoints hold the whole state, which means private data is stored: decide what goes in state, how long it is kept and how it is deleted. Keep state small and typed, and test routing functions as plain functions.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: '**Both examples run offline.** They need no key and no network. Use Python 3.11 or newer to match the rest of the module (the package metadata we inspected says 3.10 or newer; the documentation pages read state no minimum). Both samples were run on 2026-11-18 with langgraph 1.2.22, so the outputs below are real.' },
      { type: 'code', language: 'bash', label: 'Install', code: 'pip install -U langgraph' },
      {
        type: 'code',
        language: 'python',
        label: 'graph_basic.py: state, two nodes and a conditional edge (offline, run with langgraph 1.2.22)',
        code: `from typing_extensions import TypedDict
from langgraph.graph import END, START, StateGraph

class State(TypedDict):
    score: int
    label: str

def bump(state: State):
    return {"score": state["score"] + 1}

def route(state: State) -> str:
    return "high" if state["score"] >= 2 else "retry"

def high(state: State):
    return {"label": "done"}

builder = StateGraph(State)
builder.add_node("bump", bump)
builder.add_node("high", high)
builder.add_edge(START, "bump")
builder.add_conditional_edges("bump", route, {"high": "high", "retry": "bump"})
builder.add_edge("high", END)

graph = builder.compile()
print(graph.invoke({"score": 0, "label": ""}))`,
      },
      { type: 'paragraph', text: 'Now the pause. This second file stops at a human question and continues when you answer.' },
      {
        type: 'code',
        language: 'python',
        label: 'graph_pause.py: interrupt and resume with a checkpointer (offline, run with langgraph 1.2.22)',
        code: `from typing import TypedDict
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

class State(TypedDict):
    answer: str

def ask_human(state: State):
    reply = interrupt("Proceed? (yes/no)")
    return {"answer": reply}

builder = StateGraph(State)
builder.add_node("ask_human", ask_human)
builder.add_edge(START, "ask_human")
builder.add_edge("ask_human", END)
graph = builder.compile(checkpointer=InMemorySaver())

config = {"configurable": {"thread_id": "demo-1"}}
result = graph.invoke({"answer": ""}, config)
print(result["__interrupt__"])
result = graph.invoke(Command(resume="yes"), config)
print(result["answer"])`,
      },
      { type: 'paragraph', text: 'What matters in each. In `graph_basic.py`, `bump` and `high` return only the keys they change, and the graph merges them into the state. The mapping `{"high": "high", "retry": "bump"}` turns the words `route` returns into node names. In `graph_pause.py`, the `config` holds the thread id, and the same `config` is passed on resume: that is how the graph finds the paused run. `InMemorySaver` is fine here, and is lost when the program ends.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run both', code: 'python graph_basic.py\npython graph_pause.py' },
      { type: 'code', language: 'text', label: 'Expected output (real, langgraph 1.2.22; the id in the interrupt differs on every run)', code: `{'score': 2, 'label': 'done'}
[Interrupt(value='Proceed? (yes/no)', id='5d59bb01251d563f31e2dd8667025116', response_schema=None)]
yes` },
      {
        type: 'list',
        items: [
          'If `ModuleNotFoundError: No module named langgraph` appears, you installed into a different Python: use `python -m pip install -U langgraph` with the same `python` you run.',
          'If the pause file fails on the first call about a checkpointer or thread, you left out `checkpointer=InMemorySaver()` or the `config` with `thread_id`.',
          'If the second call does not give `yes`, check that you passed the same `config` both times: a new thread id starts a new run.',
          'If a graph seems to hang, your routing function never leaves the loop: add a counter to the state and route to `END` after a limit.',
        ],
      },
      { type: 'warning', text: 'A checkpointer stores your state, and state often holds private data such as names, phone numbers or messages. Decide what goes in it, how long it is kept and how to delete a thread. `InMemorySaver` is for learning: it vanishes on restart, so a real approval that waits hours needs a database-backed saver. A human approval step only protects you if the action itself sits after the pause and the person sees what will happen before they say yes.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Change the `>= 2` in `route` to `>= 3` and predict the printed score before you run it.',
          'Draw the booking flow from Paolo’s story as nodes and arrows on paper before you write any code.',
          'Next lesson, Introduction to CrewAI, shows a different idea: agents with roles, goals and tasks.',
          'Read the interrupts page and note which of your own side effects would run twice on resume.',
        ],
      },
      { type: 'takeaways', items: [
        'LangGraph models a flow as shared state, nodes (steps) and edges (what is next); a conditional edge lets a routing function choose.',
        'A graph must be compiled before it is invoked, and it can loop: the rule in your routing function, or a counter in state, is what ends the loop.',
        '`interrupt()` pauses for a person and `Command(resume=…)` continues, with the same thread id and a checkpointer.',
        'On resume the node restarts from its beginning, so code before `interrupt()` runs again: keep side effects after the pause or make them repeat-safe.',
        'The order of steps is code, not a request in a prompt: that is the main reason to choose a graph.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-75-predict-output-1',
          kind: 'predict-output',
          title: 'Walk the graph by hand',
          prompt: 'This plain JavaScript stand-in follows the same graph as `graph_basic.py`, with no library. Predict the two lines it prints.',
          concept: 'tracing a graph with a conditional edge',
          language: 'javascript',
          code: `const nodes = {
  bump: (state) => ({ score: state.score + 1 }),
  high: () => ({ label: 'done' }),
};
const edges = {
  bump: (state) => (state.score >= 2 ? 'high' : 'bump'),
  high: () => 'END',
};

function run(start, startState) {
  let state = startState;
  let current = start;
  const visited = [];
  while (current !== 'END') {
    visited.push(current);
    state = Object.assign({}, state, nodes[current](state));
    current = edges[current](state);
  }
  console.log(visited.join(' > '));
  console.log(JSON.stringify(state));
}

run('bump', { score: 0, label: '' });`,
          choices: ['bump > bump > high\n{"score":2,"label":"done"}', 'bump > high\n{"score":1,"label":"done"}', 'bump > bump > high\n{"score":3,"label":"done"}', 'bump > bump > bump > high\n{"score":2,"label":"done"}'],
          wrongNotes: {
            'bump > high\n{"score":1,"label":"done"}': 'After the first bump the score is 1, which is below 2, so route sends the run back to bump.',
            'bump > bump > high\n{"score":3,"label":"done"}': 'The loop stops as soon as the score reaches 2. High does not add to the score.',
            'bump > bump > bump > high\n{"score":2,"label":"done"}': 'Count the visits: the score is 2 after the second bump, so a third bump never happens, and the score would be 3 if it did.',
          },
          hints: [
            'Start with score 0. After the first bump, what is the score, and where does the edge send you?',
            'After the second bump the score is 2. Which branch of the condition is that?',
            'The `high` node sets the label only, so the score stays 2.',
          ],
          explanation: 'The conditional edge looks at the state after each node. Score 1 sends the run back, score 2 sends it on. The real LangGraph sample prints the same final state, `{\'score\': 2, \'label\': \'done\'}`.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-75-code-challenge-1',
          kind: 'code-challenge',
          title: 'Add the guard that LangGraph leaves to you',
          prompt: 'This is a stand-in graph runner, plain JavaScript with no model and no library. The graph is data: `start`, `nodes` (each may `add` to numbers or `set` values) and `edges` (a fixed edge has `next`; a conditional edge has `key`, `atLeast`, `yes` and `no`). Finish `runGraph(graph, state, maxSteps)`: before running a node, if `maxSteps` nodes have already run, return `{ status: \'stopped\', path, state }`. After a node runs, choose the next node from its edge. When the run reaches `END`, return `{ status: \'done\', path, state }`. `path` lists the node names in the order they ran.',
          concept: 'conditional edge and a loop guard',
          language: 'javascript',
          starter: `function runGraph(graph, state, maxSteps) {
  let current = graph.start;
  const path = [];
  while (current !== 'END') {
    // 1. guard: if path.length >= maxSteps, return { status: 'stopped', path: path, state: state }
    path.push(current);
    const node = graph.nodes[current];
    const next = {};
    for (const key of Object.keys(state)) next[key] = state[key];
    for (const key of Object.keys(node.add || {})) next[key] = next[key] + node.add[key];
    for (const key of Object.keys(node.set || {})) next[key] = node.set[key];
    state = next;
    // 2. choose the next node: a fixed edge has next; a conditional edge compares state[edge.key] with edge.atLeast
    current = 'END';
  }
  return { status: 'done', path: path, state: state };
}`,
          solution: `function runGraph(graph, state, maxSteps) {
  let current = graph.start;
  const path = [];
  while (current !== 'END') {
    if (path.length >= maxSteps) {
      return { status: 'stopped', path: path, state: state };
    }
    path.push(current);
    const node = graph.nodes[current];
    const next = {};
    for (const key of Object.keys(state)) next[key] = state[key];
    for (const key of Object.keys(node.add || {})) next[key] = next[key] + node.add[key];
    for (const key of Object.keys(node.set || {})) next[key] = node.set[key];
    state = next;
    const edge = graph.edges[current];
    if (edge.next) {
      current = edge.next;
    } else {
      current = state[edge.key] >= edge.atLeast ? edge.yes : edge.no;
    }
  }
  return { status: 'done', path: path, state: state };
}`,
          tests: {
            kind: 'function',
            fn: 'runGraph',
            cases: [
              { label: 'the loop ends when the score reaches 2', args: [{ start: 'bump', nodes: { bump: { add: { score: 1 } }, high: { set: { label: 'done' } } }, edges: { bump: { key: 'score', atLeast: 2, yes: 'high', no: 'bump' }, high: { next: 'END' } } }, { score: 0, label: '' }, 10], expected: { status: 'done', path: ['bump', 'bump', 'high'], state: { score: 2, label: 'done' } } },
              { label: 'a bump that changes nothing is stopped by the guard', args: [{ start: 'bump', nodes: { bump: { add: { score: 0 } }, high: { set: { label: 'done' } } }, edges: { bump: { key: 'score', atLeast: 2, yes: 'high', no: 'bump' }, high: { next: 'END' } } }, { score: 0, label: '' }, 4], expected: { status: 'stopped', path: ['bump', 'bump', 'bump', 'bump'], state: { score: 0, label: '' } } },
              { label: 'starting above the threshold', args: [{ start: 'bump', nodes: { bump: { add: { score: 1 } }, high: { set: { label: 'done' } } }, edges: { bump: { key: 'score', atLeast: 2, yes: 'high', no: 'bump' }, high: { next: 'END' } } }, { score: 5, label: '' }, 10], expected: { status: 'done', path: ['bump', 'high'], state: { score: 6, label: 'done' } } },
              { label: 'a limit of 2 stops the first sample early', args: [{ start: 'bump', nodes: { bump: { add: { score: 1 } }, high: { set: { label: 'done' } } }, edges: { bump: { key: 'score', atLeast: 2, yes: 'high', no: 'bump' }, high: { next: 'END' } } }, { score: 0, label: '' }, 2], expected: { status: 'stopped', path: ['bump', 'bump'], state: { score: 2, label: '' } }, hidden: true },
              { label: 'a one-node graph', args: [{ start: 'only', nodes: { only: { set: { label: 'x' } } }, edges: { only: { next: 'END' } } }, { label: '' }, 3], expected: { status: 'done', path: ['only'], state: { label: 'x' } }, hidden: true },
            ],
          },
          hints: [
            'The guard goes at the top of the loop, before the node runs: compare `path.length` with `maxSteps`.',
            'Look up the edge with `graph.edges[current]`. If it has a `next`, that is the next node.',
            'Otherwise compare `state[edge.key]` with `edge.atLeast`: `yes` when it is at least that, `no` when it is not.',
          ],
          explanation: 'The same two things protect every graph: a rule that eventually sends the run to END, and a counter that stops it if the rule never fires. In the real library the decision is a routing function you write, and the second protection is yours to add.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-75-match-1',
          kind: 'match',
          title: 'Which LangGraph idea is this?',
          prompt: 'Match each need from Mika’s booking helper to the LangGraph idea that answers it.',
          concept: 'LangGraph concepts applied',
          labels: { terms: 'The need', meanings: 'The idea' },
          pairs: [
            { term: 'If the part is out of stock, go to the order-in step instead of booking', definition: 'A conditional edge with a routing function', note: 'The next step depends on the state, so a routing function reads it and names the next node.' },
            { term: 'Wait for the mechanic’s yes before confirming, even if it takes an hour', definition: '`interrupt()` with a checkpointer', note: 'The run must stop, hand a question to a person and be able to resume later.' },
            { term: 'Continue the same booking tomorrow, not a new one', definition: 'The same thread id in the config', note: 'The thread id is how the saved state of one run is found again.' },
            { term: 'A text message went out twice when the mechanic approved', definition: 'Code before `interrupt()` runs again on resume', note: 'The node restarts from its start, so a side effect before the pause repeats.' },
          ],
          hints: [
            'Say in one phrase what each need requires: a decision, a pause, a way back to the same run, or a repeat.',
            'Two needs are about stopping and coming back. Which one is about finding the run?',
            'The last one is a bug report, not a feature: what does the interrupts page say happens to the node on resume?',
          ],
          explanation: 'Each need maps to a feature, and the last is a trap that comes with one of them. Knowing the trap before you build is the reason to read the interrupts page.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-75-q1',
        prompt: 'In `graph_pause.py`, the second `invoke` uses `Command(resume="yes")` with the same `config`. What happens if you pass a config with a new thread id instead?',
        choices: [
          'The graph resumes anyway, because the resume value alone is enough to find the paused run in the saver.',
          'The graph raises an error, because every thread id must be registered with the saver before it is first used.',
          'The graph resumes the most recent paused run that it can find, whichever thread it happens to belong to.',
          'The saved pause is not found: the thread id is how state is looked up, so the first run does not continue.',
        ],
        answer: 3,
        explanation: 'The pause belongs to a thread. A resume with a different id has no saved state to continue. That is why the thread id is also the key you manage for privacy and cleanup.',
      },
      {
        id: 'building-ai-agents-75-q2',
        prompt: 'A node sends a text message to a customer and then calls `interrupt()` to ask a mechanic. After the mechanic approves, the customer has two messages. What explains it, and what is the fix?',
        choices: [
          'The checkpointer saved the message twice over when it stored the state, so the sensible fix is to switch to a different checkpointer.',
          'The routing function ran twice by mistake after the pause, so the sensible fix is to add a second conditional edge to stop it.',
          'On resume the node restarts, so code before the interrupt ran again; send it after the pause or make it repeat-safe.',
          'The model decided to send the message again on its own, so add a line to the prompt that says to send it only once.',
        ],
        answer: 2,
        explanation: 'The interrupts page says the node restarts from its start on resume. An effect placed before `interrupt()` repeats. A prompt cannot control it, and the checkpointer does not send messages.',
      },
      {
        id: 'building-ai-agents-75-q3',
        prompt: 'Your `route` returns "retry" while the score is below 2, but a bug means `bump` never changes the score. What should you expect, and what should you add?',
        choices: [
          'The graph ends by itself after two tries, because LangGraph always limits any retry loop to exactly two attempts.',
          'The graph refuses to compile, because a loop between two nodes is not allowed in any LangGraph graph at all.',
          'It returns the last state at once, because a node that changes nothing is skipped by the runtime and never runs again.',
          'It loops until an error stops it, so add your own counter to the state and route to an end or escalation at the limit.',
        ],
        answer: 3,
        explanation: 'Nothing in the graph ends the loop except the rule you wrote. A graph can repeat on purpose. We saw a recursion-limit error after a very high number of steps when running it, so a counter in the state is the earlier, cheaper guard.',
      },
      {
        id: 'building-ai-agents-75-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what are a node and an edge in a LangGraph graph?',
        choices: [
          'A node is a step that works on the shared data, and an edge is the arrow saying which step comes next.',
          'A node is a computer that runs the agent, and an edge is the network cable that connects two computers together.',
          'A node is a model, and an edge is the prompt that is sent to it.',
          'A node is a saved conversation, and an edge is the date it was saved.',
        ],
        answer: 0,
        explanation: 'Nodes are steps (functions) and edges decide the order. A step may call a model or may be ordinary code. The other choices describe hardware, prompts or storage.',
      },
      {
        id: 'building-ai-agents-75-q5',
        audience: { min: 'advanced' },
        prompt: 'Your approval flow waits hours for a person, and the service runs on three instances behind a load balancer. Which design choice fits what the persistence page says?',
        choices: [
          'Use `InMemorySaver` and rely on sticky sessions at the load balancer, since memory is the fastest place to keep state.',
          'Use a database-backed checkpointer such as `PostgresSaver`, and treat the thread id as a key you create and protect.',
          'Skip the checkpointer and keep the pause in the web request, which stays open until the person answers.',
          'Store the state in the prompt so any instance can rebuild it from the conversation text.',
        ],
        answer: 1,
        explanation: 'The in-memory saver is lost on restart and lives in one process. A database saver survives restarts and is shared by all instances. A long-open request and state hidden in the prompt are both fragile.',
      },
    ],
    task: {
      title: 'Run, break and pause a graph',
      steps: [
        'Install langgraph, save `graph_basic.py` and run it. Check the output against the expected one.',
        'Change it and observe: change `>= 2` in `route` to `>= 3` and predict the final score before running. Then make `bump` return `{"score": state["score"]}` and watch what happens (be ready to press Ctrl+C if it runs long). Note the error name.',
        'Save and run `graph_pause.py`. Then change the thread id in the second call’s config and note what you see instead of `yes`.',
        'Draw Paolo’s booking flow on paper: stock check, order-in branch, mechanic approval, confirmation. Mark the node where a pause belongs and the nodes where a side effect belongs.',
        'Reflection: which step of your own work should be an edge in code and not a sentence in a prompt, and why?',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write the graph for making tea as boxes and arrows on paper: boil, check if hot, pour, wait, drink. Mark the one place where the arrow goes back and say what rule ends the loop.'] },
      { audience: { min: 'advanced' }, steps: ['Add an `attempts` number to `State`, increment it in `bump` and make `route` return a third key that goes to `END` after three attempts. Run it with a `bump` that never changes the score and check that it stops on your rule, not on the library’s limit.'] },
    ],
  },
  {
    id: 'building-ai-agents-76',
    day: 76,
    title: 'Introduction to CrewAI',
    summary: 'Meet CrewAI’s agents, tasks, crews and flows, run a flow offline, and see why a small sequential crew beats a big one for most jobs.',
    intro: {
      objectives: [
        'Describe an Agent, a Task, a Crew and a Process in CrewAI’s terms',
        'Run a CrewAI Flow with a router on your own machine without a key',
        'Choose between one agent, a sequential crew and a hierarchical crew for a small job',
      ],
      why: 'CrewAI is a common way to meet multi-agent ideas in the wild. Knowing that a role, goal and backstory are instructions, not extra minds, helps you use it without paying for a team you do not need.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'LangChain gives you a ready-made loop, and LangGraph gives you a map. CrewAI starts from a different picture: a small team, where each member has a role, a goal and a backstory, and each is given tasks. It is an appealing picture, and it is worth asking one question while you read: is a team what this job needs, or would one agent do? One example here needs a model key and one runs offline, and we will say which is which.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel wants a weekly restock note for Mika’s shop. His first idea is a crew of four agents (a stock reader, a price checker, a supplier researcher and a writer) with a manager agent to coordinate them. It runs, but slowly, and each run is different enough that he cannot tell which agent caused a bad sentence. The numbers in this story are invented, but the pattern is common. He cuts it to two agents and two tasks in a fixed order: one reads the stock list and names the low items, the next writes three sentences from that list. It is faster, he can read each stage’s output, and the note is just as good. The simplest team that does the job was smaller than the team he first drew.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**CrewAI** is a Python framework whose documentation describes four building blocks. An **Agent** is “an autonomous unit” with a required `role`, `goal` and `backstory`, plus options such as `llm`, `tools`, `allow_delegation` (default False), `max_iter`, `max_rpm` and `max_execution_time`. A **Task** has a `description`, an `expected_output` and an `agent`, and may have `tools`, a `context` (earlier tasks whose output feeds this one), `output_pydantic`, a `guardrail` and `human_input` (default False; when true a person reviews the final answer). A **Crew** holds `agents` and `tasks` and runs them under a **Process**. A **Flow** is the “structured, event-driven” layer that coordinates crews and plain code.' },
      {
        type: 'table',
        headers: ['CrewAI piece', 'What it is, in the docs’ terms', 'What it is in lesson 73’s terms'],
        rows: [
          ['Agent', 'Role, goal, backstory, optional tools and limits', 'A system prompt, a tool list and a model, with some limits'],
          ['Task', 'A description, an expected output, an agent, optional context', 'One request for a loop to complete'],
          ['Crew + `Process.sequential`', 'Tasks run in order; the default process', 'Your code calling loops one after another'],
          ['Crew + `Process.hierarchical`', 'A manager agent delegates and validates; needs `manager_llm` or `manager_agent`', 'A loop that decides which loop to run next'],
          ['Flow', '`@start()`, `@listen()` and `@router()` methods sharing `self.state`', 'The ordinary code around the loops'],
        ],
        caption: 'The docs describe two process types only: sequential and hierarchical. Everything else is something you build with a Flow or plain code.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[kickoff with inputs: stock list] --> B[Task 1: Parts Clerk lists low-stock parts]', '  B --> C[Output of task 1]', '  C -->|context| D[Task 2: Shop Writer writes the note]', '  D --> E[Crew result]'].join('\n'), caption: 'A sequential crew. The arrow labelled context is how task 1’s output reaches task 2: without it, the writer would not see the list.' },
      { type: 'paragraph', text: 'Here is the point to hold on to. A role, a goal and a backstory are text that goes into the model’s instructions. Two agents in one crew usually share the same model unless you set otherwise, so a “team” is one model playing parts, and the parts do not have separate knowledge or judgement. That can still help: a narrow instruction is often followed better than a broad one, and each task gives you an output you can check. What it costs is more model calls, more text passed between tasks, and more places to fail. This is the single-agent versus multi-agent trade-off from the previous module, so the baseline stays the same: one agent first, and add a second only when you can say what it does better.' },
      { type: 'paragraph', text: 'Setting the model works differently from LangChain. The LLM page says the model string is `provider/model-id` and the provider prefix is mandatory (`openai/gpt-4` works, `gpt-4` does not). Keys come from environment variables, and a missing key raises `MissingAPIKeyError`. For Anthropic models the page notes that `max_tokens` is required when you build the `LLM` object. The docs also say to keep keys out of version control.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: a crew is a small shop team with a rota. The rota (the process) says who goes first, and a note passed along (the context) says what the last person found. A hierarchical crew adds a floor manager who hands out the jobs. That can help a busy shop, and it also means the manager’s time is spent on managing instead of on the work.' },
      note('Read on the date shown: CrewAI requires Python 3.10 or newer and below 3.14, installed with uv, with provider extras such as `crewai[anthropic]` (installation page); Agent, Task and Crew fields as listed, and two process types, sequential and hierarchical (concept pages); `provider/model-id` model strings and `max_tokens` for Anthropic (LLM page); Flows with @start, @listen and @router (flows page). The Flow below was also run with crewai 1.15.41. New projects from `crewai create crew` are JSON-first, and the older Python/YAML layout needs `--classic`, so check the page before copying an older tutorial.', DOCS.crewInstall, DOCS.crewCrews, DOCS.crewAgents, DOCS.crewTasks, DOCS.crewLlms, DOCS.crewFlows),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, here is the crew code below. `LLM(...)` chooses the model once, and both agents share it. Each `Agent` is a worker with a job title (`role`), a target (`goal`) and a short description of how they work (`backstory`). Each `Task` is one piece of work with a description, a note of what the result should look like, and the worker who does it. `{stock}` in the first task is a blank that `kickoff` fills in. `context=[check_task]` says “give this task the result of the first one”. `Crew(...)` puts the workers and tasks together, `Process.sequential` says “one after the other”, and `kickoff` starts the work. The Flow example is separate: it only decides between two greetings and needs no model.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Cost and control in a crew follow from its settings. Each task is at least one model loop, bounded by the agent’s `max_iter`, `max_rpm` and `max_execution_time`, so set them and log how many calls a run makes. Context passing sends earlier outputs into later prompts, so tokens grow with the chain. Validation belongs in `output_pydantic` and `guardrail` (a callable returning a boolean and a value), not in the backstory. `human_input` blocks an unattended run. Role text is not a security boundary: every agent that has a tool can use it. For deterministic control around crews, the docs position Flows as the layer for routing and state, with an Agent used directly in a Flow as a lighter alternative to a full Crew. Test a crew through a fake model, because its outputs are otherwise free text.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: '**The Flow example runs offline**: no key, no model call. **The crew example needs a model key** and calls a real model, so we did not run its `kickoff`; we only checked that it builds without error. Python must be 3.10 to 3.13 for CrewAI. Install into a virtual environment; the docs use `uv`, and a plain `pip install` worked when we ran the Flow.' },
      { type: 'code', language: 'bash', label: 'Install (the extra is needed for Anthropic models; use your own key, never commit it)', code: 'uv add "crewai[anthropic]"\nexport ANTHROPIC_API_KEY="<your-key-here>"' },
      {
        type: 'code',
        language: 'python',
        label: 'flow_greet.py: a Flow with a router (offline; copied from the CrewAI flows page and run with crewai 1.15.41)',
        code: `from typing import Literal
from crewai.flow.flow import Flow, listen, router, start

class GreetFlow(Flow):
    @start()
    def pick_name(self):
        self.state["name"] = "Grace"
        return self.state["name"]

    @router(pick_name)
    def choose_style(self) -> Literal["formal", "casual"]:
        return "formal" if len(self.state["name"]) > 3 else "casual"

    @listen("formal")
    def greet_formally(self):
        print(f"Good day, {self.state['name']}.")

    @listen("casual")
    def greet_casually(self):
        print(f"Hi {self.state['name']}!")

GreetFlow().kickoff()`,
      },
      {
        type: 'code',
        language: 'python',
        label: 'crew_restock.py: two agents, two tasks, sequential (needs a key; syntax-checked and built, kickoff not run)',
        code: `import os

from crewai import LLM, Agent, Crew, Process, Task

# Model names change often: set AGENT_MODEL to a current "provider/model-id".
MODEL = os.environ.get("AGENT_MODEL", "anthropic/claude-sonnet-4-6")
llm = LLM(model=MODEL, max_tokens=4096)

clerk = Agent(
    role="Parts Clerk",
    goal="Find which bike parts are low on stock",
    backstory="A careful clerk who only reports what is in the stock list",
    llm=llm,
)
writer = Agent(
    role="Shop Writer",
    goal="Write a short restock note for the owner",
    backstory="A clear writer who never invents numbers",
    llm=llm,
)

check_task = Task(
    description="Read this stock list and name the parts with fewer than 3 units: {stock}",
    expected_output="A short list of low-stock parts",
    agent=clerk,
)
note_task = Task(
    description="Write a three-sentence restock note for Mika from the low-stock list",
    expected_output="A three-sentence note",
    agent=writer,
    context=[check_task],
)

crew = Crew(
    agents=[clerk, writer],
    tasks=[check_task, note_task],
    process=Process.sequential,
)

result = crew.kickoff(inputs={"stock": "chain-9sp: 4, tube-700c: 0, brake-pad: 2"})
print(result)`,
      },
      { type: 'paragraph', text: 'What matters in each. In the Flow, `@start()` runs first, `@router(pick_name)` returns the word `"formal"` or `"casual"`, and `@listen("formal")` or `@listen("casual")` runs for that word: it is a graph written with decorators, and `self.state` is the shared data. In the crew, `context=[check_task]` is the line that carries the first answer into the second task, and `Process.sequential` fixes the order. The model id is in one constant. The crew has no step limit written in it: if you want one, the agent options `max_iter` and `max_execution_time` are where it goes.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run the offline Flow, then (with a key) the crew', code: 'python flow_greet.py\npython crew_restock.py' },
      { type: 'code', language: 'text', label: 'Expected output for flow_greet.py (real, crewai 1.15.41: the library also draws status panels around this line, with run ids that differ each time)', code: 'Good day, Grace.' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model’s wording will differ) for crew_restock.py', code: '<a three-sentence restock note that mentions the low-stock parts from the list>\n# result is the final task’s output; print(result) shows its text' },
      {
        type: 'list',
        items: [
          'If you see `Anthropic native provider not available`, you installed `crewai` without the extra: run `uv add "crewai[anthropic]"` as the install page lists.',
          'If a `MissingAPIKeyError` appears, the provider’s key variable is not set in this terminal: export it again in the same window.',
          'If the model string is rejected, check the prefix: the LLM page says it must be `provider/model-id`, such as `anthropic/…`.',
          'If a task’s writer says it has no list, the `context=[check_task]` line is missing or the tasks are in the wrong order.',
        ],
      },
      { type: 'warning', text: 'A crew can call a model several times per task, so a loop that misbehaves costs more than a single call: set `max_iter`, `max_execution_time` and `max_rpm`, and watch your provider’s usage page the first time you run it. Role text is not security: every agent given a tool can use it, so give each agent only the tools its task needs. Check CrewAI’s documentation for its data collection settings before you use it with private data, and never commit your key.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Change the name in the Flow to “Al” and predict which greeting prints before you run it.',
          'Rewrite the restock crew as one agent with one task and compare how much you could inspect.',
          'Next lesson, Introduction to Microsoft Agent Framework, covers a framework for .NET, Python and Go with its own release status.',
          'Read the crews page and note the two process types it documents.',
        ],
      },
      { type: 'takeaways', items: [
        'CrewAI’s pieces are Agent (role, goal, backstory), Task, Crew, Process and Flow; the docs describe two processes, sequential and hierarchical.',
        'A role, goal and backstory are instructions to a model, so a crew is usually one model playing several parts, which adds calls and places to fail.',
        '`context` on a task is how earlier outputs reach later tasks; the model string must be `provider/model-id`.',
        'A Flow is the structured layer for routing and state, and the example in this lesson runs offline.',
        'Start with one agent, then a small sequential crew, and use a manager only when you can say what it adds.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-76-code-challenge-1',
          kind: 'code-challenge',
          title: 'Run tasks in order and pass the context along',
          prompt: 'This stand-in is plain JavaScript with scripted answers, not CrewAI. Write `runSequential(tasks, answers)`. Each task is `{ id, context }`, where `context` (optional) lists ids of tasks whose output it needs. `answers` maps each task id to the text that task produces. Run the tasks in the given order. For each task return `{ id, saw, output }`: `saw` is the outputs of its context tasks, in the order listed, and `output` is its own answer. If a task names a context task that has not run yet, stop and return `{ error: \'context task <id> has not run yet\' }`.',
          concept: 'sequential process with context',
          language: 'javascript',
          starter: `function runSequential(tasks, answers) {
  const done = {};
  const results = [];
  for (const task of tasks) {
    const saw = [];
    // 1. for each id in task.context (it may be missing): if done[id] is undefined, return the error object; otherwise add done[id] to saw
    // 2. remember this task's output in done, and add { id, saw, output } to results
  }
  return results;
}`,
          solution: `function runSequential(tasks, answers) {
  const done = {};
  const results = [];
  for (const task of tasks) {
    const saw = [];
    for (const id of task.context || []) {
      if (done[id] === undefined) {
        return { error: 'context task ' + id + ' has not run yet' };
      }
      saw.push(done[id]);
    }
    done[task.id] = answers[task.id];
    results.push({ id: task.id, saw: saw, output: answers[task.id] });
  }
  return results;
}`,
          tests: {
            kind: 'function',
            fn: 'runSequential',
            cases: [
              { label: 'the second task sees the first output', args: [[{ id: 'check' }, { id: 'note', context: ['check'] }], { check: 'low: tube-700c, brake-pad', note: 'Please reorder two items.' }], expected: [{ id: 'check', saw: [], output: 'low: tube-700c, brake-pad' }, { id: 'note', saw: ['low: tube-700c, brake-pad'], output: 'Please reorder two items.' }] },
              { label: 'a task that needs a later task is an error', args: [[{ id: 'note', context: ['check'] }, { id: 'check' }], { check: 'x', note: 'y' }], expected: { error: 'context task check has not run yet' } },
              { label: 'no tasks', args: [[], {}], expected: [] },
              { label: 'two context tasks keep their listed order', args: [[{ id: 'a' }, { id: 'b' }, { id: 'c', context: ['b', 'a'] }], { a: 'A', b: 'B', c: 'C' }], expected: [{ id: 'a', saw: [], output: 'A' }, { id: 'b', saw: [], output: 'B' }, { id: 'c', saw: ['B', 'A'], output: 'C' }], hidden: true },
              { label: 'a task with an empty context list', args: [[{ id: 'a', context: [] }], { a: 'A' }], expected: [{ id: 'a', saw: [], output: 'A' }], hidden: true },
            ],
          },
          hints: [
            'Loop over `task.context || []` so a task with no context still works.',
            'For each context id, check `done[id] === undefined` and return the error object at once if so.',
            'After the context loop, store `done[task.id] = answers[task.id]` and push `{ id: task.id, saw: saw, output: answers[task.id] }` to results.',
          ],
          explanation: 'The context is just the earlier outputs, handed forward in order. If a task points at a later one, the data does not exist yet, which is why the docs describe context as earlier tasks feeding this one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-76-scenario-1',
          kind: 'scenario',
          title: 'Size the team for the restock note',
          prompt: 'Choose the best design for Mika’s weekly restock note.',
          concept: 'one agent, sequential crew or hierarchical crew',
          situation: 'Every Monday Mika wants a short note: read the stock list, name the parts with fewer than three units, and write three sentences. Nobody is at the computer when it runs, and Joel wants to be able to see where a bad sentence came from.',
          options: [
            { text: 'Start with one agent and one task that does both steps, and look at its output for a few weeks.', consequence: 'It is the cheapest and simplest design, with one place to look. Joel adds a second task only if the note shows a problem a second stage would fix.', quality: 'best' },
            { text: 'A sequential crew of two agents and two tasks: one lists the low parts, the next writes the note with `context` from the first.', consequence: 'It costs more calls than one agent, but each stage’s output can be read, which suits Joel’s wish to find a bad sentence’s source.', quality: 'acceptable' },
            { text: 'A hierarchical crew with a manager and four specialist roles, so it can adapt if the list changes shape.', consequence: 'The manager adds calls just to delegate and check, four roles add four places to fail, and the job had two plain steps. It runs slower, costs more and is harder to debug.', quality: 'poor' },
            { text: 'Set `human_input` on the writer’s task so a person reviews each note.', consequence: 'For an unattended Monday job, this waits for a person who is not there, so the note never finishes.', quality: 'poor' },
          ],
          hints: [
            'How many distinct steps does the job really have?',
            'Which option would still work with no person at the keyboard?',
            'Remember the baseline of this course: the simplest thing that works comes first.',
          ],
          explanation: 'One agent is the baseline. Two sequential tasks are a reasonable step when you want to inspect the middle. A manager and four roles add cost and failure points for a job with no need of them, and a human-input flag stops an unattended run.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-76-q1',
        prompt: 'A teammate says: “Our crew has a Parts Clerk and a Shop Writer, so it is like two independent experts.” What is the most accurate response?',
        choices: [
          'Mostly not: role, goal and backstory are instructions, so two agents on one model are that model playing two parts.',
          'Correct: each agent has its own separate knowledge and cannot see what the other agent has been told during the run.',
          'Partly: the roles help only when the two agents run on two different computers, because one machine cannot play two parts.',
          'Incorrect: agents in a crew always share one single conversation, so they cannot be given different instructions at all.',
        ],
        answer: 0,
        explanation: 'Role, goal and backstory are text in the model’s instructions. The roles can help focus the output, and each task gives an output to check, but they are not separate experts.',
      },
      {
        id: 'building-ai-agents-76-q2',
        prompt: 'You set `process=Process.hierarchical` and the crew refuses to start. According to the crews page, what is the likely missing piece?',
        choices: [
          'A `max_rpm` value on every agent, because a hierarchical crew sends too many requests per minute without it.',
          'A `context` list on every task, because a manager can only delegate when each task names its predecessors.',
          'A second crew, since a hierarchical process has to be nested inside a sequential one.',
          'A manager: the page says hierarchical needs either `manager_llm` or `manager_agent`.',
        ],
        answer: 3,
        explanation: 'The hierarchical process uses a manager that delegates and validates, so one has to be configured. The other choices are not requirements on the page.',
      },
      {
        id: 'building-ai-agents-76-q3',
        prompt: 'Your crew fails as soon as the model is created, and the log shows `gpt-4` as the model string. What does the CrewAI LLM page say to try?',
        choices: [
          'Remove the model string and let the crew pick whichever model happens to be cheapest at that moment for each task.',
          'Keep the string and add the key to the agent’s backstory, so that the model can log in by itself when it starts.',
          'Write the string in capital letters, because CrewAI model ids are case sensitive and lower case is rejected outright.',
          'Write `provider/model-id`, for example `openai/gpt-4`, because the provider prefix is mandatory.',
        ],
        answer: 3,
        explanation: 'The page says the provider prefix is mandatory: `openai/gpt-4` works and `gpt-4` is wrong. Keys belong in environment variables, never in a prompt.',
      },
      {
        id: 'building-ai-agents-76-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a Task in CrewAI?',
        choices: [
          'A saved copy of the whole conversation, kept so that the crew can read it again the next day or the next week.',
          'The password that lets the crew log in to the model provider and use the model on your behalf all day long.',
          'A piece of work for an agent, with a description of what to do and what the result should look like.',
          'A rule that stops the crew after a set number of seconds, whatever the agents are doing at that time.',
        ],
        answer: 2,
        explanation: 'A Task has a description, an expected output and the agent who does it. The other choices describe memory, a key and a limit.',
      },
      {
        id: 'building-ai-agents-76-q5',
        audience: { min: 'advanced' },
        prompt: 'A four-agent hierarchical crew and a two-task sequential crew produce equally good restock notes. What should you measure before choosing, and what should you set?',
        choices: [
          'Calls, tokens and time per run for each design, then set `max_iter`, `max_rpm` and `max_execution_time` on the agents kept.',
          'Only the length of the final note, since a longer note means a better crew and justifies the extra agents it took to write.',
          'Only the number of agents, because fewer agents always means a cheaper run no matter how long each agent works for.',
          'Nothing: if two designs give equally good notes, the order in which the teammates wrote them decides which one stays.',
        ],
        answer: 0,
        explanation: 'Equal output means the difference is cost, delay and failure points. Count them per run and bound the agents you keep with the documented limits.',
      },
    ],
    task: {
      title: 'Run a Flow and size a crew',
      steps: [
        'Install CrewAI into a virtual environment (Python 3.10 to 3.13), save `flow_greet.py` and run it. Find the line the program prints among the status panels.',
        'Change it and observe: change `"Grace"` to `"Al"` and predict the greeting before you run it. Then change the 3 in `choose_style` to 1 and run again.',
        'Without a key: run your `runSequential` stand-in from the activity with tasks in the wrong order and read the error. With a key: run `crew_restock.py` once and note how many separate model calls your provider’s usage page shows.',
        'Write down the smallest crew that would do the restock note and the reason you would add a second agent only if the first output showed a problem.',
        'Reflection: which of your own jobs is really one task, and which really has stages you would want to inspect?',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write the restock note job as two sticky notes: one task per note, with the words “description”, “expected output” and “who does it” on each. Then decide whether one note could do both.'] },
      { audience: { min: 'advanced' }, steps: ['Add `output_pydantic` or a `guardrail` to the first task so that a result with no part names is rejected, and write a fake-model test that proves a bad result is caught. Set `max_iter` and `max_execution_time` on both agents and record the values you chose and why.'] },
    ],
  },
  {
    id: 'building-ai-agents-77',
    day: 77,
    title: 'Introduction to Microsoft Agent Framework',
    summary: 'Learn what Microsoft Agent Framework is, how it relates to Semantic Kernel and AutoGen, what its release status says, and why its tools run without approval unless you ask.',
    intro: {
      objectives: [
        'Describe Microsoft Agent Framework and its relation to Semantic Kernel and AutoGen using only what the docs state',
        'Read its release status honestly: what is stable, what is preview and what is experimental',
        'Add an approval rule in front of tools, because the framework’s default is to run them without asking',
      ],
      why: 'Many companies build on Microsoft’s stack, and you may be asked to read or extend an agent written with it. Knowing its status and its default tool behaviour keeps you from overclaiming or from shipping a tool that can act unchecked.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'Is this framework new, or is it the old one with a new name? Is it finished, or still a preview? And what does it do when a model asks to call a tool: ask a person first, or just run it? These three questions are worth asking of any framework, and Microsoft’s documentation answers all three. This lesson reads those answers carefully and says plainly where the pages we read stay silent. One example needs a Microsoft Foundry project and sign-in; the other runs offline.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'A larger company asks Joel to review a support agent that another team built with Microsoft Agent Framework. He finds two things. First, the agent has a tool called `issue_refund`, and nobody wrote an approval rule for it: the team assumed a framework meant for business use would ask a person first. The safety page says otherwise: by default all tools run without user approval, and you opt in to gating high-risk ones. Second, the team’s README said “Semantic Kernel is retired”. Joel looks for that sentence in Microsoft’s pages and cannot find it. The overview says Agent Framework is the direct successor, created by the same teams, and that is all he can responsibly repeat. He fixes the first problem in code and the second in the README.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Microsoft Agent Framework** is described on its overview page as a way to “build AI agents and multi-agent workflows in .NET, Python, and Go”. Its primary areas are agents, a harness agent, workflows and integrations. About its history, the page says: “Semantic Kernel and AutoGen pioneered the concepts of AI agents and multi-agent orchestration. The Agent Framework is the direct successor, created by the same teams.” It combines AutoGen’s simple abstractions for single- and multi-agent patterns with Semantic Kernel’s enterprise features and adds graph-based workflows. The pages we read do not state a maintenance status for Semantic Kernel or AutoGen, so this course does not either.' },
      {
        type: 'table',
        headers: ['Part', 'What the docs say (read 2026-11-18)', 'What to remember'],
        rows: [
          ['.NET and Python', 'The 1.0 announcement says it reached version 1.0: a production-ready release with stable APIs and a commitment to long-term support.', 'Stable features keep backward compatibility. Preview features may still change.'],
          ['Go', 'The overview says Agent Framework for Go is in public preview and needs Go 1.26 or later.', 'Preview means the API can change: do not build a long-lived product on it without a plan.'],
          ['Python workflow API', 'The functional workflow API (`@workflow`, `@step`) is described as experimental.', 'Experimental is weaker than preview. Use it for learning and prototypes.'],
          ['Python version', 'The upgrade page says packages no longer install on Python 3.10: use 3.11 or later.', 'Check your interpreter before the install.'],
          ['`.env` files', 'Python does not load `.env` automatically: call `load_dotenv()`.', 'A missing variable is usually this.'],
        ],
        caption: 'Different parts of one product have different statuses. “It reached 1.0” is true for .NET and Python and says nothing about Go or about one experimental API.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A{Can you write a function that does the task?} -->|Yes| B[Write the function, no agent needed]', '  A -->|No| C{Are the steps well defined and is the order important?}', '  C -->|Yes| D[Use a workflow: explicit, inspectable steps]', '  C -->|No| E[Use an agent: open-ended, tools chosen by the model]'].join('\n'), caption: 'The overview’s own advice, drawn as a decision. Read it from the top: the first question is whether you need an agent at all.' },
      { type: 'paragraph', text: 'Two ideas are worth knowing in the framework’s own words. A **workflow** is described as an explicit, inspectable path for coordinating code, agents, state, events and human input. It is a graph built with `WorkflowBuilder` (executors, edges, events and state, with checkpoints at superstep boundaries), much like LangGraph in the previous lesson. An **agent** is for open-ended or conversational tasks with tools the model chooses. Orchestration patterns named on the pages are sequential, concurrent, handoff, group-chat and Magentic. We name them so you recognise them, and we do not teach each one here.' },
      { type: 'paragraph', text: 'Now the part that matters for safety. The agent safety page says: “By default, all tools provided to an agent are invoked without user approval. Use the tool approval mechanism to gate high-risk operations behind human confirmation.” In the sample below, the tool is marked `approval_mode="never_require"`, with a comment that it is read-only. That is a deliberate choice, written in the open, and it is the right habit: decide for each tool whether it needs approval. The same page tells you to treat arguments from the model as untrusted input, like input to a web API, and not to place end-user input in system-role messages. It also notes that the framework imposes no input or output length limits or rate limits, so those are yours to add.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: the framework is a company’s standard office kit. It comes with a lot of useful things, and its defaults are made for the people who wrote it. A new employee should read the policy on who may sign what before signing anything. Here, the policy is the safety page.' },
      note('Read on the date shown: the overview (agents and workflows for .NET, Python and Go; Agent Framework is the direct successor of Semantic Kernel and AutoGen; Go is in public preview and needs Go 1.26), the Microsoft DevBlogs 1.0 announcement (a production-ready release for .NET and Python), the Python upgrade page (Python 3.11 or later; latest release listed was python-1.26.0 on 13 November 2026; some meta-package parts may still be alpha or beta), the add-tools tutorial (sample below) and the agent safety page (tools run without approval by default). Versions move fast: recheck before you rely on any of this.', DOCS.msOverview, DOCS.msBlog, DOCS.msUpgrade, DOCS.msAddTools, DOCS.msSafety, DOCS.msWorkflows),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, here is the Python below. `async` and `await` are Python’s way of waiting for a slow answer, such as a model’s, without freezing the program: `asyncio.run(main())` starts it. `MODEL` and `ENDPOINT` are read from your computer’s settings, so no secret sits in the file. `@tool(approval_mode="never_require")` marks `check_stock` as a tool the agent may use, and says it needs no person’s approval because it only reads. `Agent(...)` puts together a connection to a model service (the client), instructions and the tool. `agent.run(...)` sends the question and `print` shows the answer. `AzureCliCredential` means “sign in with the account I used for the `az login` command”.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Operational points. Release status differs by package and language, so pin exact versions and read the upgrade page for breaking changes; the meta-package can include parts that are still alpha or beta. Credentials: a developer’s CLI sign-in is not a production identity, so use the credential type your hosting calls for. Because tools run without approval by default and the framework adds no rate or length limits, put the allow-list, approval rule, per-call timeouts and budgets in your own code or middleware, and test them with a scripted model. Workflow checkpoints and human input are useful for long runs, but store only what you must. Treat retrieved data as untrusted too: the safety page notes indirect injection through retrieval.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: '**The first example needs a Microsoft Foundry project and an Azure sign-in**, so we could not run it, and it may incur cost. It uses no API key variable of its own, and the sign-in comes from `az login`. **The second example runs offline** with Node.js: an approval gate that decides which tool calls run, wait or are refused. Use Python 3.11 or newer.' },
      { type: 'code', language: 'bash', label: 'Install and sign in (the endpoint value comes from your own Foundry project)', code: 'pip install agent-framework-foundry azure-identity\naz login\nexport PROJECT_ENDPOINT="<your-foundry-project-endpoint>"' },
      {
        type: 'code',
        language: 'python',
        label: 'agent_maf.py: one agent with one read-only tool (needs a Foundry project and sign-in; adapted from the add-tools tutorial; syntax-checked, not run)',
        code: `import asyncio
import os

from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential

# Model deployment names change: use one your Foundry project actually has.
MODEL = os.environ.get("AGENT_MODEL", "gpt-6-luna")
# This variable name is ours: the framework does not read it.
ENDPOINT = os.environ["PROJECT_ENDPOINT"]

STOCK = {"chain-9sp": 4, "tube-700c": 0}


# This read-only tool can run without approval.
@tool(approval_mode="never_require")
def check_stock(sku: str) -> str:
    """Check how many units of a part Mika's Bike Shop has in stock."""
    return f"{sku}: {STOCK.get(sku, 0)} in stock"


async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint=ENDPOINT,
            model=MODEL,
            credential=AzureCliCredential(),
        ),
        instructions="Use the stock tool to answer questions about parts.",
        tools=[check_stock],
    )
    print(await agent.run("Do you have a 9-speed chain?"))


if __name__ == "__main__":
    asyncio.run(main())`,
      },
      { type: 'paragraph', text: '**Offline, no key.** This approval gate is a stand-in written for the course, not Microsoft’s code. It decides what happens to each tool call the model asks for: run it, hold it until a person approves, or refuse it. Notice that a tool with no rule is refused, which is the safe opposite of a default that runs everything.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'gate.js: an approval gate for tool calls (offline stand-in, not Microsoft Agent Framework)',
        code: `function gate(calls, policy, approved) {
  const out = [];
  for (const call of calls) {
    const rule = policy[call.name];
    if (rule === 'auto') {
      out.push({ id: call.id, status: 'ran' });
    } else if (rule === 'ask') {
      out.push({ id: call.id, status: approved.includes(call.id) ? 'ran' : 'waiting' });
    } else {
      out.push({ id: call.id, status: 'refused' });
    }
  }
  return out;
}

const policy = { check_stock: 'auto', update_price: 'ask' };
const calls = [
  { id: 1, name: 'check_stock' },
  { id: 2, name: 'update_price' },
  { id: 3, name: 'delete_all' },
  { id: 4, name: 'toString' },
];
console.log(JSON.stringify(gate(calls, policy, [])));
console.log(JSON.stringify(gate([{ id: 2, name: 'update_price' }], policy, [2])));`,
      },
      { type: 'paragraph', text: 'What matters. In the Python file, `approval_mode="never_require"` is the explicit decision for a read-only tool. In the gate, each tool’s rule is `auto`, `ask` or nothing at all. A rule of `ask` runs only when the call’s id is in the approved list, which stands for a person’s click. A tool with no rule, such as `delete_all`, is refused. Even `toString`, which a plain object would answer to, is refused, because the code compares the rule with exact words.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run the offline gate (and the Python file if you have a Foundry project)', code: 'node gate.js\npython agent_maf.py' },
      { type: 'code', language: 'text', label: 'Expected output for gate.js (real: run with Node 22 on 2026-11-18)', code: '[{"id":1,"status":"ran"},{"id":2,"status":"waiting"},{"id":3,"status":"refused"},{"id":4,"status":"refused"}]\n[{"id":2,"status":"ran"}]' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model’s wording will differ) for agent_maf.py', code: '<one or two sentences saying the shop has 4 nine-speed chains in stock>\n# print(await agent.run(...)) shows the agent’s text answer' },
      {
        type: 'list',
        items: [
          'If pip says it cannot find a version, check `python3 --version`: the upgrade page says packages no longer install on Python 3.10.',
          'If sign-in fails, run `az login` again and make sure the account has access to the Foundry project.',
          'If `KeyError: PROJECT_ENDPOINT` appears, the variable is not set in this terminal: export it again in the same window.',
          'If a variable you put in a `.env` file is missing, remember that Python does not load `.env` by itself: call `load_dotenv()` first or export it in the shell.',
        ],
      },
      { type: 'warning', text: 'The framework’s default is that tools run without approval, and it sets no length or rate limits. A tool that sends money, messages or deletes data needs an approval rule and the least privilege that works, and every argument the model gives is untrusted until your code validates it. Never put end-user text into a system-role message to give it more weight. Preview and experimental features can change without warning, so keep them out of anything you must keep running. A hosted model also receives whatever you send it.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Add a rule for `refund_customer` as `ask` in the gate and run it with and without an approved id.',
          'Open the agent safety page and write down which of its three warnings applies to your own agent.',
          'Next lesson, Understanding Agent SDKs, covers the SDKs that vendors ship for their own models.',
          'Check the status of whatever part of Agent Framework you plan to use on the overview and upgrade pages.',
        ],
      },
      { type: 'takeaways', items: [
        'Microsoft Agent Framework builds agents and workflows in .NET, Python and Go, and the docs call it the direct successor of Semantic Kernel and AutoGen, created by the same teams.',
        'Status differs by part: 1.0 for .NET and Python, public preview for Go, experimental for the Python functional workflow API.',
        'By default every tool runs without user approval: decide for each tool whether it needs approval, and treat arguments from the model as untrusted.',
        'The overview’s own advice: if you can write a function to do the task, do that; use a workflow when the steps are well defined and an agent when they are open-ended.',
        'Say only what the docs say: no page we read states a maintenance status for Semantic Kernel or AutoGen.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-77-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write an approval gate',
          prompt: 'This is a plain-JavaScript stand-in, not Microsoft’s code. Write `gate(calls, policy, approved)`. `calls` is a list of `{ id, name }`. `policy` maps a tool name to `\'auto\'` (run it) or `\'ask\'` (run it only after a person approves). `approved` is the list of call ids a person has approved. Return a list of `{ id, status }` in the same order. The status is `ran` for an `auto` tool, `ran` for an `ask` tool whose id is in `approved`, `waiting` for an `ask` tool whose id is not, and `refused` for a tool with no rule.',
          concept: 'tool approval gate with a default of refuse',
          language: 'javascript',
          starter: `function gate(calls, policy, approved) {
  const out = [];
  for (const call of calls) {
    const rule = policy[call.name];
    // 'auto' -> ran; 'ask' -> ran if approved includes call.id, otherwise waiting; anything else -> refused
    out.push({ id: call.id, status: 'ran' });
  }
  return out;
}`,
          solution: `function gate(calls, policy, approved) {
  const out = [];
  for (const call of calls) {
    const rule = policy[call.name];
    if (rule === 'auto') {
      out.push({ id: call.id, status: 'ran' });
    } else if (rule === 'ask') {
      out.push({ id: call.id, status: approved.includes(call.id) ? 'ran' : 'waiting' });
    } else {
      out.push({ id: call.id, status: 'refused' });
    }
  }
  return out;
}`,
          tests: {
            kind: 'function',
            fn: 'gate',
            cases: [
              { label: 'auto runs, ask waits, unknown is refused', args: [[{ id: 1, name: 'check_stock' }, { id: 2, name: 'update_price' }, { id: 3, name: 'delete_all' }], { check_stock: 'auto', update_price: 'ask' }, []], expected: [{ id: 1, status: 'ran' }, { id: 2, status: 'waiting' }, { id: 3, status: 'refused' }] },
              { label: 'an approved ask call runs', args: [[{ id: 2, name: 'update_price' }], { update_price: 'ask' }, [2]], expected: [{ id: 2, status: 'ran' }] },
              { label: 'approval is per call id', args: [[{ id: 5, name: 'update_price' }, { id: 6, name: 'update_price' }], { update_price: 'ask' }, [6]], expected: [{ id: 5, status: 'waiting' }, { id: 6, status: 'ran' }] },
              { label: 'an inherited name is refused', args: [[{ id: 9, name: 'toString' }], { check_stock: 'auto' }, []], expected: [{ id: 9, status: 'refused' }], hidden: true },
              { label: 'an approved id does not help an unknown tool', args: [[{ id: 7, name: 'delete_all' }], { check_stock: 'auto' }, [7]], expected: [{ id: 7, status: 'refused' }], hidden: true },
              { label: 'no calls', args: [[], { check_stock: 'auto' }, []], expected: [], hidden: true },
            ],
          },
          hints: [
            'Read the rule with `policy[call.name]` and compare it to the exact words `auto` and `ask`.',
            'For `ask`, the status depends on `approved.includes(call.id)`.',
            'Everything else, including a missing rule, falls into the last `else` and is `refused`.',
          ],
          explanation: 'The safe default is the last branch: anything not listed is refused. The framework’s own default runs tools without approval, so a gate like this one, or the framework’s approval setting, is how you turn that around for tools that act.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-77-scenario-1',
          kind: 'scenario',
          title: 'Agent, workflow or a plain function?',
          prompt: 'Choose the best design, using the overview’s own advice.',
          concept: 'agent versus workflow versus function',
          situation: 'Mika wants every new repair booking checked against three fixed rules: the date is a weekday, the bike type is one the shop services, and a deposit is recorded. If all three pass, the booking is confirmed; otherwise a message names the failed rule. A developer proposes an agent with a model so that it can handle anything.',
          options: [
            { text: 'Write a function that checks the three rules and returns the result, and use a model only to word the message to the customer if you want it friendlier.', consequence: 'The rules are fixed, so the function is cheap, fast and fully testable. This is what the overview means by “write a function”.', quality: 'best' },
            { text: 'Build a workflow with one step per rule and an approval step for exceptions.', consequence: 'It works and gives inspectable steps. It is more structure than three fixed rules need, but reasonable if exceptions will grow.', quality: 'acceptable' },
            { text: 'Build an agent with tools for each rule and let the model decide the order and when to stop.', consequence: 'The steps never change, so the model’s freedom only adds cost, delay and the chance of a skipped rule.', quality: 'poor' },
            { text: 'Use an agent and add the three rules to its system prompt, relying on it to follow them.', consequence: 'A prompt is a request, not a check. A booking can be confirmed with a rule skipped and nothing will catch it.', quality: 'poor' },
          ],
          hints: [
            'Are the steps fixed, or open-ended?',
            'Which option can you test with a table of inputs and expected outputs?',
            'The overview says: if you can write a function to handle the task, do that.',
          ],
          explanation: 'Fixed rules call for code. A workflow is a fair step if the process may grow, and an agent is for tasks whose steps cannot be written in advance. Putting rules in a prompt gives no guarantee at all.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-77-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'What we know and what we do not',
          prompt: 'Tap each claim. Each card says what the pages we read support and what they leave open.',
          concept: 'reading framework status honestly',
          cards: [
            { front: '“Semantic Kernel is retired.”', back: 'Not supported. The overview calls Agent Framework the direct successor created by the same teams. The pages we read do not state a maintenance status for Semantic Kernel or AutoGen. Check Microsoft’s own pages for dates before you write it down.' },
            { front: '“Agent Framework is at 1.0 for everything.”', back: 'Not quite. 1.0 is announced for .NET and Python. Go is in public preview, and the Python functional workflow API is described as experimental. A product can carry several statuses at once.' },
            { front: '“It asks a person before a tool runs.”', back: 'No. The safety page says tools are invoked without user approval by default, and you gate high-risk ones with the approval mechanism. Decide per tool.' },
          ],
          hints: [
            'For each claim, ask which page would have to say it, and whether we read such a page.',
            'Two claims are about status and one is about a default behaviour.',
            'The honest answer to a status question is sometimes “the pages read do not say”.',
          ],
          explanation: 'Overclaiming a framework’s status or safety is a quiet way to ship risk. Say what the page states, name what it does not, and check the primary source for dates.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-77-q1',
        prompt: 'A teammate’s README says “Semantic Kernel is deprecated, so Microsoft Agent Framework is now mandatory.” What do the pages we read support?',
        choices: [
          'That claim exactly, since the overview says that Semantic Kernel has been retired and replaced by the new framework for every user.',
          'That AutoGen is retired but Semantic Kernel is not, because only one of the two is named as a predecessor on the overview page.',
          'Nothing at all: the overview does not mention Semantic Kernel or AutoGen, so the claim can be neither confirmed nor rejected from it.',
          'The overview calls it the direct successor, but the pages read give no retirement status, so check Microsoft before writing deprecated.',
        ],
        answer: 3,
        explanation: 'The overview names both as predecessors and calls Agent Framework their direct successor. It does not say retired or deprecated, so repeating that would be a claim without a source.',
      },
      {
        id: 'building-ai-agents-77-q2',
        prompt: 'Your agent has a tool called `issue_refund` and you wrote no approval setting for it. According to the agent safety page, what happens when the model requests it?',
        choices: [
          'The framework pauses and asks a person first, because it detects tools that move money and treats them as high-risk automatically.',
          'It runs without user approval, because that is the default and you must use the approval mechanism to gate high-risk tools.',
          'The call is refused, since a tool with no approval setting is blocked by default until a person has reviewed its description.',
          'It runs only if the system prompt says refunds are allowed, since the framework reads the prompt to decide which tools need approval.',
        ],
        answer: 1,
        explanation: 'The page says tools are invoked without user approval by default. A refund tool needs an approval rule from you, and a line in a prompt is not one.',
      },
      {
        id: 'building-ai-agents-77-q3',
        prompt: 'A manager asks: “Is Microsoft Agent Framework production-ready?” Which answer is accurate and complete enough to act on?',
        choices: [
          'For .NET and Python the 1.0 post says production-ready with stable APIs; Go is in preview and one API is experimental, so choose by part.',
          'Yes for all of it, because the announcement says version 1.0, and a 1.0 label covers every language and every feature in the framework.',
          'No, because the Python workflow API is experimental, so nothing in the framework can be used in production by any team at this time.',
          'It depends only on the language: .NET and Python are stable and Go is not, and individual features are not part of the question at all.',
        ],
        answer: 0,
        explanation: 'Status is per part: stable APIs for .NET and Python, public preview for Go, experimental for one API, with preview features that may still change. The answer has to name the parts.',
      },
      {
        id: 'building-ai-agents-77-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is the difference between an agent and a workflow in this framework?',
        choices: [
          'An agent is written in Python and a workflow is written in .NET, so the two cannot be mixed in a single application, even with an adapter.',
          'An agent needs no tools at all, while a workflow always needs a database to save the steps that it has already finished running.',
          'An agent decides what to do next for an open-ended task; a workflow follows steps and an order you defined in advance.',
          'An agent runs only once and then ends, while a workflow can never be stopped after it has started running, whatever happens.',
        ],
        answer: 2,
        explanation: 'The overview says to use an agent for open-ended tasks and tools chosen by the model, and a workflow when the steps are well defined and order matters.',
      },
      {
        id: 'building-ai-agents-77-q5',
        audience: { min: 'advanced' },
        prompt: 'A developer pastes the customer’s message into the system message “so that the model takes it seriously”. Which guidance on the safety page does that break, and why does it matter?',
        choices: [
          'Always keep system messages shorter than user messages, so that the model can attend to both of them at the same time.',
          'Do not use system messages together with tools: tool descriptions must go in the user message only, never anywhere else.',
          'Always store the customer’s message in a `.env` file before sending it, so that the model never sees it in plain text.',
          'Do not put end-user input in system-role messages: it gives untrusted text the authority of your own instructions.',
        ],
        answer: 3,
        explanation: 'The page says not to put end-user input in system-role messages. Text in that role is treated as your instruction, so a hostile customer message would speak with your authority.',
      },
    ],
    task: {
      title: 'Gate a tool and read a status honestly',
      steps: [
        'Save `gate.js` and run it with `node gate.js`. Compare the output with the expected output.',
        'Change it and observe: add `refund_customer: \'ask\'` to the policy and a call with id 10 that uses it. Run once with no approvals and once with `[10]`. Then misspell a tool name in the policy and note which status the call gets.',
        'Open the Microsoft Agent Framework overview page and write down, for .NET, Python and Go, the status the page states. Mark anything you wanted to say but the page does not support.',
        'Open the agent safety page and copy the one sentence about default tool approval into your notes, with the page name.',
        'Reflection: which tool in your own agent would you put on `ask` first, and what would the person need to see in order to say yes?',
      ],
      minutes: 18,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Make a three-column list on paper: tools your agent has, whether each only reads or can change something, and whether you would let it run alone (auto) or ask a person first (ask).'] },
      { audience: { min: 'advanced' }, steps: ['Extend `gate` so that an `ask` call also records who approved it and when in an audit list, and add a per-run limit of calls. Write tests for refused, waiting and over-limit cases using a scripted list of calls.'] },
    ],
  },
  {
    id: 'building-ai-agents-78',
    day: 78,
    title: 'Understanding Agent SDKs',
    summary: 'Compare the agent SDKs from OpenAI, Anthropic and Google by what each is for and what it needs, and build a handoff stand-in that runs offline.',
    intro: {
      objectives: [
        'Tell a plain client SDK, a helper such as a tool runner and a full agent SDK apart',
        'State what the OpenAI Agents SDK, the Claude Agent SDK, the Anthropic tool runner and Google ADK are for, in the docs’ terms',
        'Explain handoffs as tools, and name one thing each SDK’s safety features do not cover',
      ],
      why: 'Model vendors now ship their own agent libraries. Knowing what each one owns, and what it leaves to you, lets you use one without adopting a whole stack by accident.',
    },
    minutes: 24,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'You already know the client SDKs from module 3: they send one request and return one response, and you write the loop. Model vendors now also publish libraries that run the loop for you. They are not all the same kind of thing, and the differences decide what you must still build. This lesson sorts them by how much of the loop they own, describes each from its own documentation, and is clear about which examples need a key. The runnable example that needs no key is a handoff stand-in.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Nina wants a reviewer agent for Mika’s website code: read the files, find bugs, fix them. She finds a vendor SDK whose quickstart does exactly that in fifteen lines, and runs it on the real repository. It edits three files before she has read what it plans to do, because the sample auto-approves edits. Nothing is lost, since she uses version control, but she realises she picked a library that comes with a shell and a file editor, and she had not decided what it should be allowed to touch. She reruns it in a copy of the project with edits not auto-approved. The SDK was not wrong; the sample’s permission setting was a choice she had not made.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'Think of three layers. A **client SDK** wraps the API: you send messages and handle every reply yourself, as in your lesson 73 loop. A **helper** runs the loop for tools you define in your own code. An **agent SDK** brings a loop plus built-in pieces, such as sessions, permissions, handoffs, guardrails or tracing. The Claude Agent SDK documentation itself separates these: it says you can write the tool loop yourself or let the client SDK’s beta tool runner drive it, and that the Agent SDK is something different.' },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[Your code] --> B[Client SDK: you write the loop]', '  A --> C[Helper: a tool runner runs the loop for your tools]', '  A --> D[Agent SDK: loop, tools, sessions, permissions, tracing]', '  B --> E[Model API]', '  C --> E', '  D --> E'].join('\n'), caption: 'All three reach the same model API. What changes is how much of the loop, and how many decisions, you hand over.' },
      {
        type: 'table',
        headers: ['SDK', 'What the docs say it is for', 'Package and key', 'Notes from the pages'],
        rows: [
          ['OpenAI Agents SDK', 'Agents, handoffs or agents as tools, guardrails, sessions and tracing', '`pip install openai-agents`, imports from `agents`, needs `OPENAI_API_KEY`', 'Tracing is on by default. Repo file says Python 3.10 or newer.'],
          ['Claude Agent SDK', '“Claude Code as a library”: the same tools, agent loop and context management as Claude Code, in Python and TypeScript', '`pip install claude-agent-sdk` or `npm install @anthropic-ai/claude-agent-sdk`, needs `ANTHROPIC_API_KEY`', 'Runs the Claude Code binary with built-in tools and permissions. Node 18.14+ or Python 3.10+.'],
          ['Anthropic tool runner', 'Runs the agentic loop, error wrapping and type safety for tools you define in your own code', 'Part of the `anthropic` client SDK (`client.beta.messages.tool_runner`), needs `ANTHROPIC_API_KEY`', 'The page marks it beta. For approval, custom logging or conditional execution, use the manual loop.'],
          ['Google ADK', '“The open-source agent development framework” for building, debugging and deploying agents', '`pip install google-adk` (also TypeScript, Go, Java, Kotlin); a Gemini model is used in the sample', 'Python 3.10 or later. We did not read its run commands.'],
        ],
        caption: 'Four things with different jobs. The tool runner is a helper, the others are fuller kits. None of them is ranked here.',
      },
      { type: 'paragraph', text: 'Two ideas are worth a closer look because they change how you design. First, **handoffs**. In the OpenAI Agents SDK a triage agent lists specialist agents in `handoffs`, and the docs say the model sees each handoff as a tool, for example `transfer_to_refund_agent`. A handoff is therefore a tool call that changes who answers next. Second, **guardrails** in that SDK come in three kinds. Input guardrails check the initial input and run only for the first agent in a chain. Output guardrails run only for the agent that produces the final output. Tool guardrails wrap function tools, and the page states they do not cover handoffs, hosted tools such as web search, or built-in execution tools such as a shell tool. Run in parallel (the default for input guardrails), the agent may already have used tokens or run tools before a tripwire stops it.' },
      { type: 'paragraph', text: 'The Claude Agent SDK is the most powerful and the most dangerous to run casually, because it brings real file and shell tools. Its permissions page describes modes named `default`, `dontAsk`, `acceptEdits`, `bypassPermissions`, `plan` and `auto`, checked in this order: hooks, deny rules, ask rules, the permission mode, allow rules and then a `canUseTool` callback. It warns that auto-approved tools never reach `canUseTool`, that `allowed_tools` does not constrain `bypassPermissions`, and, about that mode, “Use with extreme caution. Claude has full system access in this mode.” A locked-down headless agent pairs an allowed-tools list with the `dontAsk` mode.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: a client SDK is a set of hand tools, a helper is a drill with a guide, and an agent SDK is a workshop with a foreman. The more of the work the workshop does, the more you must know about its rules before you give it a job. The cost of the bigger kit is that its defaults, such as tracing data going to a dashboard or edits being auto-approved, are decisions made for you.' },
      note('Read on the date shown: OpenAI Agents SDK home, quickstart, handoffs, guardrails and tracing pages (package openai-agents; handoffs appear to the model as tools; the three guardrail kinds and their stated limits; tracing enabled by default and trace_include_sensitive_data defaulting to true); Claude Agent SDK overview, quickstart and permissions pages (Claude Code as a library, packages, permission modes and warnings); the Anthropic tool runner page (beta, handles the loop for your own tools); the Agent Development Kit documentation (Python install and sample). The OpenAI pages show the function-tool decorator as `@tool` imported from `agents.decorators` in code but call it `@function_tool` in prose, and do not say which is canonical, so check your installed version.', DOCS.openaiAgents, DOCS.openaiHandoffs, DOCS.openaiGuardrails, DOCS.openaiTracing, DOCS.claudeSdk, DOCS.claudeSdkPermissions, DOCS.toolRunner, DOCS.adk),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, the first Python file below is the shortest agent you can write with the OpenAI Agents SDK: `Agent` is a helper with a name and instructions, `Runner.run_sync` sends one request and waits, and `result.final_output` is the answer. In the second file, `@beta_tool` marks `check_stock` as a tool the model may ask for, and the text under the function name is its manual. `tool_runner(...)` does the asking-and-answering loop for you, and the `for` loop prints each message it gets. In the offline JavaScript file, a handoff is just a request to pass the question to a different helper, and the code checks that the helper you ask for is on the list of allowed ones.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'What to check before adopting one. Data flow: tracing in the OpenAI SDK is on by default and includes sensitive data unless you turn it off, so decide what leaves your system. Scope: a guardrail that wraps only function tools leaves handoffs and hosted tools outside it, so enforce limits in the tool code too. Permissions: with the Claude Agent SDK, run unattended jobs with an explicit allow list and `dontAsk`, in a sandboxed folder, and treat `bypassPermissions` as off-limits outside a throwaway environment. Status: the tool runner is beta, so pin versions and keep the manual loop as an escape hatch. Lock-in: each SDK’s message and tool types are its own, so keep a thin adapter of your own at the edge, as the next lessons discuss.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: '**Three of these examples need a key**, and we did not run them. **The handoff example runs offline** with Node.js, with no key. Use Python 3.11 so the same interpreter works across the module. Keys go in environment variables, never in files you commit.' },
      { type: 'code', language: 'bash', label: 'Install (placeholders: use your own keys)', code: 'pip install openai-agents anthropic\nexport OPENAI_API_KEY="<your-key-here>"\nexport ANTHROPIC_API_KEY="<your-key-here>"' },
      {
        type: 'code',
        language: 'python',
        label: 'hello_openai.py: the OpenAI Agents SDK hello world (needs OPENAI_API_KEY; adapted from the docs; syntax-checked, not run)',
        code: `from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant for Mika's Bike Shop")

result = Runner.run_sync(agent, "Write one friendly sentence about repairing a flat tyre.")
print(result.final_output)
print(result.last_agent.name)`,
      },
      {
        type: 'code',
        language: 'python',
        label: 'tool_runner.py: the Anthropic tool runner with one tool (needs ANTHROPIC_API_KEY; adapted from the docs; syntax-checked, not run)',
        code: `import json
import os

from anthropic import Anthropic, beta_tool

# Model names change often: set AGENT_MODEL to a current id from Anthropic's models page.
MODEL = os.environ.get("AGENT_MODEL", "claude-opus-5-5")
client = Anthropic()


@beta_tool
def check_stock(sku: str) -> str:
    """Check how many units of a part Mika's Bike Shop has in stock.

    Args:
        sku: The part code, for example chain-9sp
    """
    stock = {"chain-9sp": 4, "tube-700c": 0}
    return json.dumps({"sku": sku, "in_stock": stock.get(sku, 0)})


runner = client.beta.messages.tool_runner(
    model=MODEL,
    max_tokens=1024,
    tools=[check_stock],
    messages=[{"role": "user", "content": "Do you have a 9-speed chain?"}],
)
for message in runner:
    print(message)`,
      },
      { type: 'paragraph', text: 'Two more samples to read, not run yet. The first is the Claude Agent SDK quickstart. **It reads and edits files**, with edits auto-approved, so run it only in a scratch copy of a project, never on work you cannot restore. The second is a Google ADK agent definition. The ADK page runs it through its own project layout and command line, and we did not read those commands, so open the page before running it.' },
      {
        type: 'code',
        language: 'python',
        label: 'Read-only example: the Claude Agent SDK quickstart (copied from the docs; needs ANTHROPIC_API_KEY and edits files)',
        code: `import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Auto-approve these tools
            permission_mode="acceptEdits",  # Auto-approve file edits
        ),
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")

asyncio.run(main())`,
      },
      {
        type: 'code',
        language: 'python',
        label: 'Read-only example: a Google ADK agent definition (copied from the ADK Python get-started page; run it as that page says)',
        code: `from google.adk.agents.llm_agent import Agent

def get_current_time(city: str) -> dict:
    """Returns the current time in a specified city."""
    return {"status": "success", "city": city, "time": "10:30 AM"}

root_agent = Agent(
    model='gemini-flash-latest',
    name='root_agent',
    description="Tells the current time in a specified city.",
    instruction="You are a helpful assistant that tells the current time in cities. Use the 'get_current_time' tool for this purpose.",
    tools=[get_current_time],
)`,
      },
      { type: 'paragraph', text: '**Offline, no key.** This stand-in shows handoffs as tools. The script plays the part of the model: it asks for `transfer_to_<name>` tools. The code only follows a handoff if the current agent lists the target, which is an allow-list again. It is not the OpenAI Agents SDK.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'handoff.js: handoffs as tools with an allow-list (offline stand-in, scripted model)',
        code: `// A stand-in for handoffs: the model sees each handoff as a tool named transfer_to_<agent>.
// The model is scripted, and this is NOT the OpenAI Agents SDK.
const agents = {
  triage: { handoffs: ['parts', 'repairs'] },
  parts: { handoffs: [] },
  repairs: { handoffs: ['parts'] },
};

function run(script) {
  let current = 'triage';
  const path = ['triage'];
  for (const reply of script) {
    if (reply.type === 'final') {
      console.log(current + ' answers: ' + reply.text);
      return path;
    }
    const target = reply.name.slice('transfer_to_'.length);
    const ok = reply.name.startsWith('transfer_to_') && agents[current].handoffs.includes(target);
    if (!ok) {
      console.log(current + ' asked for ' + reply.name + ': refused');
      continue;
    }
    current = target;
    path.push(current);
  }
  return path;
}

const path = run([
  { type: 'tool_call', name: 'transfer_to_repairs' },
  { type: 'tool_call', name: 'transfer_to_triage' },
  { type: 'tool_call', name: 'transfer_to_parts' },
  { type: 'final', text: 'We have the chain in stock.' },
]);
console.log(path.join(' > '));`,
      },
      { type: 'paragraph', text: 'What matters. `hello_openai.py` and `tool_runner.py` are short because the SDK owns the loop: you cannot see a step limit, a retry rule or a trace line in them, so ask the docs where those live. In `handoff.js`, the line that decides is `agents[current].handoffs.includes(target)`: a handoff the current agent was not given is refused, and the run goes on. That is the same idea as the tool allow-list from lesson 73, applied to agents.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run the offline file (and the Python ones if you have the keys)', code: 'node handoff.js\npython hello_openai.py\npython tool_runner.py' },
      { type: 'code', language: 'text', label: 'Expected output for handoff.js (real: run with Node 22 on 2026-11-18)', code: 'repairs asked for transfer_to_triage: refused\nparts answers: We have the chain in stock.\ntriage > repairs > parts' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model’s wording will differ) for hello_openai.py', code: '<one friendly sentence about repairing a flat tyre>\nAssistant' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model’s wording will differ) for tool_runner.py', code: '<a message object per turn: first one asking to call check_stock with sku chain-9sp, then one with the model’s answer>\n# the runner yields each message; the last one is the final answer' },
      {
        type: 'list',
        items: [
          'If `pip` cannot find `openai-agents` or the import `agents` fails, check the package name `openai-agents` (the import is `agents`) and your Python version.',
          'If an authentication error appears, the key variable is not set in this terminal: export it again in the same window.',
          'If `beta_tool` or `tool_runner` is missing, your `anthropic` package is older than the page assumes: upgrade it, because the page marks the runner as beta and it can change.',
          'If the model is not found, take a current id from the provider’s models page and set `AGENT_MODEL`.',
        ],
      },
      { type: 'warning', text: 'The Claude Agent SDK sample can change your files, and an agent SDK with a shell or file tool can do real damage if a prompt is hostile or mistaken: run it in a scratch folder, keep an explicit allow list, and never use `bypassPermissions` outside a throwaway environment. The OpenAI SDK’s tracing is on by default and includes sensitive data unless you turn it off, so decide what you are willing to send. Guardrails have stated gaps (handoffs, hosted tools, built-in execution tools): do not rely on one alone. Keys belong in environment variables, never in code.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Add a fourth agent, `billing`, to `handoff.js` and a script that tries to reach it from `parts`.',
          'Read the OpenAI guardrails page and list the three kinds with what each does not cover.',
          'Next lesson, Choosing the Right Framework, puts everything in this module into a decision table by need.',
          'Open the Claude Agent SDK permissions page and write down the order in which it checks hooks, rules and modes.',
        ],
      },
      { type: 'takeaways', items: [
        'A client SDK leaves the loop to you, a helper such as the tool runner runs it for your tools, and an agent SDK adds sessions, permissions, handoffs, guardrails or tracing.',
        'A handoff is a tool call that changes who answers next; keep it on an allow-list of agents like any other tool.',
        'OpenAI’s guardrails have stated limits: input checks run for the first agent, output checks for the last, and tool guardrails miss handoffs, hosted tools and built-in execution tools.',
        'The Claude Agent SDK brings real file and shell tools: choose permissions deliberately and keep `bypassPermissions` for throwaway environments.',
        'The tool runner is marked beta and tracing is on by default in the OpenAI SDK: read the status and the defaults before you adopt.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-78-code-challenge-1',
          kind: 'code-challenge',
          title: 'Handoffs with an allow-list and a hop limit',
          prompt: 'This stand-in is plain JavaScript with a scripted model, not the OpenAI Agents SDK. Write `runHandoffs(agents, script, maxHops)`. `agents` maps each agent name to `{ handoffs: [names it may hand off to] }`. `script` is a list of replies: `{ type: \'tool_call\', name: \'transfer_to_<agent>\' }` or `{ type: \'final\' }`. Start at `triage`. A transfer is allowed only if the name starts with `transfer_to_` and the target is in the current agent’s `handoffs`; then the current agent changes and the target is added to `path`. A refused transfer is added to `refused` (the full tool name) and the run goes on. If `maxHops` transfers have already happened and another allowed one comes, stop with status `stopped`. A `final` reply ends the run with status `done`. If the script ends first, the status is `done` too. Return `{ status, path, refused }`.',
          concept: 'handoffs as tools with limits',
          language: 'javascript',
          starter: `function runHandoffs(agents, script, maxHops) {
  let current = 'triage';
  const path = ['triage'];
  const refused = [];
  for (const reply of script) {
    if (reply.type === 'final') {
      return { status: 'done', path: path, refused: refused };
    }
    const target = reply.name.slice('transfer_to_'.length);
    // 1. refuse unless the name starts with transfer_to_ and target is in agents[current].handoffs (add reply.name to refused, then continue)
    // 2. hop limit: if path.length - 1 >= maxHops, return { status: 'stopped', path: path, refused: refused }
    current = target;
    path.push(current);
  }
  return { status: 'done', path: path, refused: refused };
}`,
          solution: `function runHandoffs(agents, script, maxHops) {
  let current = 'triage';
  const path = ['triage'];
  const refused = [];
  for (const reply of script) {
    if (reply.type === 'final') {
      return { status: 'done', path: path, refused: refused };
    }
    const target = reply.name.slice('transfer_to_'.length);
    const ok = reply.name.startsWith('transfer_to_') && agents[current].handoffs.includes(target);
    if (!ok) {
      refused.push(reply.name);
      continue;
    }
    if (path.length - 1 >= maxHops) {
      return { status: 'stopped', path: path, refused: refused };
    }
    current = target;
    path.push(current);
  }
  return { status: 'done', path: path, refused: refused };
}`,
          tests: {
            kind: 'function',
            fn: 'runHandoffs',
            cases: [
              { label: 'a normal path with one refusal', args: [{ triage: { handoffs: ['parts', 'repairs'] }, parts: { handoffs: [] }, repairs: { handoffs: ['parts'] } }, [{ type: 'tool_call', name: 'transfer_to_repairs' }, { type: 'tool_call', name: 'transfer_to_triage' }, { type: 'tool_call', name: 'transfer_to_parts' }, { type: 'final' }], 5], expected: { status: 'done', path: ['triage', 'repairs', 'parts'], refused: ['transfer_to_triage'] } },
              { label: 'the hop limit stops a long chain', args: [{ triage: { handoffs: ['a'] }, a: { handoffs: ['b'] }, b: { handoffs: ['a'] } }, [{ type: 'tool_call', name: 'transfer_to_a' }, { type: 'tool_call', name: 'transfer_to_b' }, { type: 'tool_call', name: 'transfer_to_a' }], 2], expected: { status: 'stopped', path: ['triage', 'a', 'b'], refused: [] } },
              { label: 'a name that is not a transfer is refused', args: [{ triage: { handoffs: ['parts'] }, parts: { handoffs: [] } }, [{ type: 'tool_call', name: 'delete_everything' }, { type: 'final' }], 3], expected: { status: 'done', path: ['triage'], refused: ['delete_everything'] } },
              { label: 'an unknown agent is refused', args: [{ triage: { handoffs: ['parts'] }, parts: { handoffs: [] } }, [{ type: 'tool_call', name: 'transfer_to_billing' }], 3], expected: { status: 'done', path: ['triage'], refused: ['transfer_to_billing'] }, hidden: true },
              { label: 'a refused transfer does not use a hop', args: [{ triage: { handoffs: ['parts'] }, parts: { handoffs: [] } }, [{ type: 'tool_call', name: 'transfer_to_billing' }, { type: 'tool_call', name: 'transfer_to_parts' }], 1], expected: { status: 'done', path: ['triage', 'parts'], refused: ['transfer_to_billing'] }, hidden: true },
              { label: 'an empty script', args: [{ triage: { handoffs: [] } }, [], 1], expected: { status: 'done', path: ['triage'], refused: [] }, hidden: true },
            ],
          },
          hints: [
            'A transfer is `ok` only if the name starts with `transfer_to_` and `agents[current].handoffs.includes(target)` is true.',
            'When it is not ok, push `reply.name` onto `refused` and use `continue`: a refusal does not move or use a hop.',
            'Check the hop limit after the allow-list check and before changing `current`: the hops so far are `path.length - 1`.',
          ],
          explanation: 'Two limits protect a handoff chain: an allow-list of who may hand off to whom, and a cap on how many hops a run may make. Without the cap, two agents that keep passing the question to each other never finish.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-78-scenario-1',
          kind: 'scenario',
          title: 'Where does the refund check go?',
          prompt: 'Choose the best place to enforce “refunds above a set amount need a person’s approval” in an OpenAI Agents SDK design.',
          concept: 'what guardrails do and do not cover',
          situation: 'Mika’s triage agent hands refund questions to a refunds agent, which has a function tool, `issue_refund`. The shop wants any refund above a set amount held for a person. A developer suggests putting the check where it is easiest to find.',
          options: [
            { text: 'Put the amount check and the approval in the `issue_refund` tool’s own code, and add a tool guardrail on that function tool as a second layer.', consequence: 'The check runs whoever calls the tool and however the agent was reached. The guardrail, which wraps function tools, adds a second line of defence.', quality: 'best' },
            { text: 'Rely only on a tool guardrail on `issue_refund` and skip any check in the tool.', consequence: 'It covers function tools, so it works for this tool, but you now depend on one layer and on how it was configured. A second check in the tool is cheap.', quality: 'acceptable' },
            { text: 'Add an input guardrail to the triage agent that blocks large refund requests.', consequence: 'Input guardrails run on the first agent’s initial input only, so a refund reached by another route, or phrased differently, is not checked at the point of action.', quality: 'poor' },
            { text: 'Add an output guardrail on the triage agent that checks the final text for the word refund.', consequence: 'Output guardrails check only the final output of the agent that produces it. The refund tool may already have run before the text is written.', quality: 'poor' },
          ],
          hints: [
            'Which layer sees the actual call to `issue_refund`?',
            'The guardrails page says input guardrails run for the first agent only and output guardrails for the last agent only.',
            'The safest design puts a check in the code that does the action, not only in a wrapper around it.',
          ],
          explanation: 'Each guardrail kind covers a different moment, and each has stated gaps. The action itself is the one place that always runs, so the check belongs there, with a guardrail as an extra layer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-78-match-1',
          kind: 'match',
          title: 'Which SDK piece is this?',
          prompt: 'Match each need to the SDK piece that the documentation says answers it.',
          concept: 'what each SDK is for',
          labels: { terms: 'The need', meanings: 'The piece' },
          pairs: [
            { term: 'A program that edits files and runs commands, with the same tools as a coding assistant', definition: 'Claude Agent SDK: Claude Code as a library', note: 'Built-in file and shell tools, permissions and hooks are what that SDK adds.' },
            { term: 'Let a library run the call-the-tool-and-answer loop for functions you wrote, nothing more', definition: 'The Anthropic tool runner, a helper over the client SDK', note: 'It handles the loop and error wrapping for your own tools, and the page marks it beta.' },
            { term: 'Pass a customer from a triage agent to a specialist agent', definition: 'Handoffs in the OpenAI Agents SDK, seen by the model as tools', note: 'The specialist is listed in the triage agent’s handoffs and appears as a transfer tool.' },
            { term: 'See every model call, tool call and handoff of a run in a dashboard', definition: 'Tracing in the OpenAI Agents SDK, on by default', note: 'It records model calls, tool calls, handoffs and guardrails, and is enabled by default.' },
          ],
          hints: [
            'Which need is about files and commands, and which is only about your own functions?',
            'Which two needs are about who answers and what was recorded?',
            'The tool runner is a helper, not a full agent kit.',
          ],
          explanation: 'Knowing which layer gives you what keeps you from adopting a workshop when a drill would do, or the reverse.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-78-q1',
        prompt: 'Nina runs the Claude Agent SDK quickstart on her project and three files change before she reads the plan. What explains this, and what is the safer next step?',
        choices: [
          'The sample sets `permission_mode="acceptEdits"`, which auto-approves file edits: use a scratch copy and choose the mode on purpose.',
          'The SDK ignores permissions on files it is able to read, so the only fix is to remove the Read tool from the allowed list for good.',
          'The model is too capable to be supervised at all, so agent SDKs should simply not be used on source code by any team anywhere.',
          'The files changed because `allowed_tools` is an alphabetical list, which sets the order in which the edits are applied to each file.',
        ],
        answer: 0,
        explanation: 'The sample’s comments say it auto-approves those tools and file edits. The permission mode is a decision to make, and a scratch copy limits the harm while you decide.',
      },
      {
        id: 'building-ai-agents-78-q2',
        prompt: 'A developer puts an input guardrail on the triage agent to stop large refunds. A customer’s request is handed to the refunds agent, which calls `issue_refund`. What does the guardrails page imply?',
        choices: [
          'The check covers the refund, because an input guardrail follows the request through every handoff to the later agents in the chain.',
          'The check covers the refund only when it is set to run in parallel, since parallel guardrails see every agent in the chain.',
          'The check covers only the first agent’s initial input, so it does not guard the refund tool: put the amount check in the tool.',
          'The check is ignored entirely, since input guardrails are meant only for hosted tools such as web search and not for function tools.',
        ],
        answer: 2,
        explanation: 'The page says input guardrails check the initial input and run for the first agent in a chain. The place that always runs is the tool’s own code.',
      },
      {
        id: 'building-ai-agents-78-q3',
        prompt: 'You want a library to run the call-tool, read-result, call-model loop for three functions you wrote, and you also need a person to approve one of them. Which statement fits the tool runner page?',
        choices: [
          'Use the tool runner for everything, since it supports human approval through a built-in setting that its page describes in detail.',
          'Use the tool runner for the loop, and do the approval in a custom callback that the page shows in one of its examples.',
          'Use the Claude Agent SDK, because the page says the tool runner is meant only for read-only tools and cannot run any others.',
          'The page advises the manual loop for human approval, custom logging or conditional execution, so write the loop yourself.',
        ],
        answer: 3,
        explanation: 'The page states that for human approval, custom logging or conditional execution the manual loop is the choice. It also marks the runner beta.',
      },
      {
        id: 'building-ai-agents-78-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a handoff between agents?',
        choices: [
          'Deleting one agent and creating a new one in its place, so that the old conversation starts again from the beginning.',
          'Passing the conversation from one agent to another, such as a triage agent passing a customer to a specialist.',
          'Sending the same question to every agent at once and keeping only the shortest answer that comes back from any of them.',
          'Saving the conversation to a file so that a person can read it later and decide which agent should answer next.',
        ],
        answer: 1,
        explanation: 'A handoff changes which agent answers next. In the OpenAI Agents SDK, the model sees each one as a tool to call.',
      },
      {
        id: 'building-ai-agents-78-q5',
        audience: { min: 'advanced' },
        prompt: 'Your company’s agent uses the OpenAI Agents SDK with default settings and handles customer records. What should you review first?',
        choices: [
          'Whether tracing, on by default and including sensitive data unless disabled, sends customer data somewhere you have not approved.',
          'The Python version only, since tracing has no effect on what is stored and the version decides everything else about it, too.',
          'Whether the agent’s name is unique, because tracing needs a unique name for each agent to build a trace for the whole run.',
          'Whether the function tools are written in async code, since only async tools can be traced and all the rest are skipped over.',
        ],
        answer: 0,
        explanation: 'The tracing page says tracing is enabled by default and `trace_include_sensitive_data` defaults to true. For private records that is a decision for you to make, not a default to accept.',
      },
    ],
    task: {
      title: 'Compare the SDKs and break the handoff',
      steps: [
        'Save `handoff.js`, run it with `node handoff.js` and check the output against the expected output.',
        'Change it and observe: add a `billing` agent that `parts` may hand off to, then add a script step that asks for it from `triage`. Predict whether it is refused, then run it.',
        'Make a script where `repairs` and `parts` hand off to each other forever. Run it and note that nothing in `handoff.js` stops it, then finish the `runHandoffs` exercise so a hop limit does.',
        'Open the OpenAI guardrails page and the Claude Agent SDK permissions page. For each, copy one stated limit or warning into your notes with the page name.',
        'Reflection: which one of the four SDKs in the table matches a job you have, and what is the one default you would change before using it?',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the handoff path of a shop where the front desk passes customers to parts or repairs as boxes and arrows, and mark which arrows are not allowed.'] },
      { audience: { min: 'advanced' }, steps: ['Write a threat note of five lines for an unattended Claude Agent SDK job on a scratch repository: the tools allowed, the permission mode, what a hostile file could ask for, what stops it and what you log. Keep secrets out of the log.'] },
    ],
  },
  {
    id: 'building-ai-agents-79',
    day: 79,
    title: 'Choosing the Right Framework',
    summary: 'Choose by need with a decision table that lists candidates and reasons instead of a winner, and record the choice as a decision record.',
    intro: {
      objectives: [
        'Turn a project into a short list of needs before you look at any framework',
        'Use a need-to-candidates table, and explain why it lists options rather than ranking them',
        'Record a framework decision, including the option of using none, in a decision record',
      ],
      why: 'Choosing a framework first and finding out its limits later is how projects get stuck. Choosing by need keeps the decision reversible, explainable to a team and honest about the option of building less.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: '“Which framework should I use?” is the first question almost everyone asks about agents, and the one you are least able to answer on day one. This lesson reverses the order. You start from what your agent needs to do, you read what each framework’s own documentation says it is for, and you end with a short list and your reasons. There is no winner here, on purpose: a list that depends on your needs is useful, and a ranking that ignores them is not. The runnable example needs no key.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika’s shop wants a support agent for the website. Nina is asked to pick a framework, and she starts by searching for the most popular one. A week later she has three half-built prototypes and no decision. Joel suggests a different start: write the needs on one page first. The agent must check stock and book repairs with Python tools, a mechanic must approve every booking, and a booking waiting for approval must survive a server restart. Nothing on the page asks for a team of agents or for file editing. With those three needs, the table in this lesson gives her two candidates and a third option she had not considered: write the loop herself. She writes her reasons down, builds the smallest version of the leading candidate in an afternoon, and decides.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'Two facts make this approach work. First, the frameworks in this module overlap, so a need rarely points to exactly one. Second, every framework has costs that its quickstart does not show: defaults you did not choose, a release status, data that leaves your system, a language you may not use. So the method has four steps: list your needs, find the candidates whose documentation names those needs, check each candidate against a few risk questions, and record the decision with the option “none”. The table below is the second step. Every row uses only what the documentation pages say; none of it is a ranking, and the order of the rows is not a preference.' },
      {
        type: 'table',
        headers: ['If you need…', 'The docs describe…', 'Candidates to look at', 'Check before you commit'],
        rows: [
          ['Steps that are fixed and known', 'Microsoft’s overview: “If you can write a function to handle the task, do that instead of using an AI agent.”', 'Plain code', 'Whether a model is needed even for one step.'],
          ['A loop over functions of your own, with little setup', 'The tool runner “handles the agentic loop, error wrapping, and type safety”; the loop itself is about forty lines.', 'Your own loop (lesson 73); the Anthropic tool runner', 'The runner is marked beta, and the manual loop is the page’s advice for approval and custom logging.'],
          ['A ready-made agent with tools, a prompt and middleware, including approval and PII handling', '`create_agent` is “a minimal, highly configurable harness”.', 'LangChain', 'Defaults for retries and stopping; Python 3.11 or newer; API change history.'],
          ['Explicit state and flow, saved runs and pauses for a person', 'LangGraph: a runtime for long-running, stateful agents with checkpointers and interrupts.', 'LangGraph; Microsoft Agent Framework workflows', 'A saver that survives restarts; code before an interrupt runs again on resume.'],
          ['Agents described by role, tasks run in order or under a manager', 'CrewAI: Agent, Task, Crew, with sequential and hierarchical processes, and Flows for control.', 'CrewAI', 'Extra model calls per task; whether one agent would do.'],
          ['Handoffs between specialist agents, with guardrails and tracing built in', 'The OpenAI Agents SDK names handoffs, guardrails, sessions and tracing as primitives.', 'OpenAI Agents SDK', 'Tracing is on by default; guardrails have stated gaps.'],
          ['An agent that reads and edits files and runs commands, as a coding assistant does', 'The Claude Agent SDK is “Claude Code as a library”, with built-in tools and permissions.', 'Claude Agent SDK', 'Permission mode, sandbox, and what the agent may touch.'],
          ['A language other than Python', 'Microsoft Agent Framework lists .NET and Go; Google ADK lists TypeScript, Go, Java and Kotlin; LangChain and the Claude Agent SDK have TypeScript.', 'Microsoft Agent Framework; Google ADK; LangChain; Claude Agent SDK', 'Status per language: Go for Microsoft is a public preview.'],
          ['Connect to external tools and data through a shared standard', 'MCP is “an open-source standard for connecting AI applications to external systems”.', 'MCP (a protocol, not an agent framework)', 'Which version of the protocol your SDK speaks.'],
        ],
        caption: 'Read across a row, not down the column. A need can map to several candidates, and some candidates appear in more than one row.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[List your needs on one page] --> B{Are the steps fixed?}', '  B -->|Yes| C[Plain code, maybe one model call]', '  B -->|No| D{Need saved state or a pause for a person?}', '  D -->|Yes| E[Graph or workflow tools: LangGraph, Microsoft workflows]', '  D -->|No| F{Need files and shell, or roles and handoffs?}', '  F -->|Yes| G[A vendor SDK or CrewAI: check permissions and cost]', '  F -->|No| H[Your own loop, a tool runner or create_agent]'].join('\n'), caption: 'A path through the needs, not a ranking. Notice where it stops: with plain code, or with your own loop. The first question leads away from agents.' },
      { type: 'paragraph', text: 'Why a list and not a winner? A winner needs a shared yardstick, and there is none. A framework that is perfect for a graph with approvals is poor for a one-off script, and the reverse. Popularity is not evidence either: it tells you who tried it, not whether it fits your need or whether it is safe. So this course describes what each tool is for, in its own documentation’s words, and leaves the choice to you and your needs.' },
      { type: 'paragraph', text: 'After the table, ask five risk questions of any candidate. What is its status (stable, preview, experimental, beta), per part and per language? Which defaults does it choose for me: retries, step limits, approval, tracing? Where does my data go? Which language and Python or Node version does it need, and does that fit my hosting? And how hard is it to leave: how much of my code would I have to rewrite? The next lesson looks at the last question in detail.' },
      { type: 'paragraph', text: 'Finally, **write the decision down** as a decision record (an ADR, a short note with context, options, the decision, its consequences and when to revisit it, as in the Architecture Decision Records and Comparing Design Alternatives lesson of the Software Architecture with AI course). The builder at the end of this section is for exactly that. Include “no framework” among the options, with its own good and bad consequences. A decision with only one option was not a decision.' },
      note('The table uses only statements read on the official pages on the date shown: the Microsoft Agent Framework overview and workflows pages, the Anthropic tool runner page, the LangChain overview and quickstart, the LangGraph overview and persistence pages, CrewAI’s crews, agents and flows pages, the OpenAI Agents SDK home, guardrails and tracing pages, the Claude Agent SDK overview, the Agent Development Kit documentation and the MCP introduction. Statuses change often: recheck the row you rely on.', DOCS.msOverview, DOCS.toolRunner, DOCS.langchainOverview, DOCS.langgraphOverview, DOCS.crewCrews, DOCS.openaiAgents, DOCS.claudeSdk, DOCS.adk, DOCS.mcpIntro),
      { type: 'visual', id: 'arch-adr-builder', caption: 'Record your framework decision here. Write the context in your own words (your three or four needs), list at least two options plus “no framework”, state good and bad consequences honestly, and name a revisit trigger such as a status change or a missing feature. The builder checks for missing sections and one-sided consequences.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, choosing by need is like choosing a vehicle by the trip. If you only cross the road, you walk. If you carry a load across town, you want a tricycle or a van. You would not pick a bus because it is the most famous vehicle. The table is a list of trips (your needs) with vehicles that suit them. The five questions are what you check before you buy: how new it is, what it does on its own, where your things go, whether it fits your road, and whether you can sell it later. The code below does the first part for you: you give it needs, and it prints the options that match.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In a team, make the decision cheap to reverse and costly to ignore. Run a time-boxed spike against your own needs (the smallest vertical slice: one tool, one approval, one restart), score it with weighted criteria written beforehand, and record what you measured rather than what you felt. Keep your domain code (tools, rules, prompts, tests) outside the framework’s types, so the framework is a layer you can replace. Pin versions, watch the status of the parts you use, and set a revisit trigger. Treat preview and experimental parts as dependencies you will have to migrate, and budget for it. Check licences and data handling for hosted components, and for each one decide who can see prompts and traces.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: '**This example runs offline** with Node.js and needs no key. It is the table above as code: you give it a list of needs and it prints each candidate with the needs that matched. It sorts the names alphabetically so that nobody reads the order as a ranking, and it reports needs it does not know instead of guessing.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'shortlist.js: from needs to candidates, with reasons and no ranking (offline)',
        code: `// A need-to-candidates table. The order of the output is alphabetical, NOT a ranking.
const TABLE = {
  'fixed-steps': [
    { name: 'plain code', why: 'If you can write a function for the task, do that instead of using an agent.' },
  ],
  'loop-for-my-functions': [
    { name: 'your own loop', why: 'About forty lines and fully visible (lesson 73).' },
    { name: 'Anthropic tool runner', why: 'Runs the loop for tools you define; marked beta.' },
  ],
  'ready-made-agent': [
    { name: 'LangChain create_agent', why: 'Model, tools, prompt and middleware in one call.' },
  ],
  'saved-state-and-pause': [
    { name: 'LangGraph', why: 'Checkpointers and interrupts; explicit state and flow.' },
    { name: 'Microsoft Agent Framework', why: 'Workflows with checkpoints and human input.' },
  ],
  'roles-and-tasks': [
    { name: 'CrewAI', why: 'Agents with role, goal and backstory; tasks; sequential or hierarchical crews.' },
  ],
  'other-language': [
    { name: 'Microsoft Agent Framework', why: '.NET and Python at 1.0; Go in public preview.' },
    { name: 'Google ADK', why: 'Lists Python, TypeScript, Go, Java and Kotlin.' },
    { name: 'LangChain create_agent', why: 'Has a TypeScript entry point, createAgent.' },
  ],
  'handoffs-and-tracing': [
    { name: 'OpenAI Agents SDK', why: 'Handoffs, guardrails and tracing are named primitives.' },
  ],
  'files-and-shell': [
    { name: 'Claude Agent SDK', why: 'Claude Code as a library: built-in file and shell tools, permissions.' },
  ],
};

function shortlist(needs) {
  const byName = {};
  const unknown = [];
  for (const need of needs) {
    if (!Object.keys(TABLE).includes(need)) {
      unknown.push(need);
      continue;
    }
    for (const row of TABLE[need]) {
      if (byName[row.name] === undefined) byName[row.name] = { name: row.name, because: [] };
      byName[row.name].because.push(need);
    }
  }
  const candidates = Object.keys(byName).sort().map((name) => byName[name]);
  return { candidates: candidates, unknown: unknown };
}

const result = shortlist(['saved-state-and-pause', 'other-language', 'fast-and-cheap']);
for (const c of result.candidates) console.log(c.name + ' <- ' + c.because.join(', '));
console.log('unknown needs: ' + (result.unknown.length === 0 ? 'none' : result.unknown.join(', ')));
console.log(shortlist(['fixed-steps']).candidates[0].name);`,
      },
      { type: 'paragraph', text: 'What matters. `TABLE` holds only what the documentation said, with a short reason each. `shortlist` checks that a need is one it knows (`Object.keys(TABLE).includes(need)`) so a misspelt need is reported instead of silently ignored, groups needs by candidate, and sorts the names. The result says which needs each candidate matched, which is the “because” your decision record needs. The list comes back short or empty if your needs are narrow, and that is information too.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run it', code: 'node shortlist.js' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with Node 22 on 2026-11-18)', code: 'Google ADK <- other-language\nLangChain create_agent <- other-language\nLangGraph <- saved-state-and-pause\nMicrosoft Agent Framework <- saved-state-and-pause, other-language\nunknown needs: fast-and-cheap\nplain code' },
      {
        type: 'list',
        items: [
          'If you see `Cannot read properties of undefined`, you used a need the table does not have in a place that reads `TABLE[need]` without the check: keep the `Object.keys(TABLE).includes(need)` test.',
          'If the list is empty, none of your needs matched a row: rewrite them in the table’s words, or add a row that cites a documentation page you have read.',
          'If a candidate you expected is missing, the table does not have that row: add one with a `why` taken from the official page, and a date in a comment.',
          'If every need returns many candidates, your needs are too broad: add one that excludes something, such as a language or a status you will not accept.',
        ],
      },
      { type: 'warning', text: 'A table of needs is a thinking aid, not a decision. Every row here comes from documentation read on one date, and statuses and APIs change: recheck before you commit. Do not choose by popularity, and do not paste a vendor’s own comparison into a decision record as if it were neutral. If your agent will touch customer data, money or files, include a security review of the chosen tool’s defaults (approval, tracing, permissions) in the decision.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Write your agent’s needs on one page, five lines at most, before you read any quickstart.',
          'Add one row to `shortlist.js` from a documentation page you read yourself, with a date.',
          'Next lesson, Frameworks vs. Custom Agent Architectures, looks at the cost of abstraction, lock-in and debugging, and finishes the decision record.',
          'Open the decision record builder and write the context and options now, leaving the consequences for the next lesson.',
        ],
      },
      { type: 'takeaways', items: [
        'Start from needs, not from a framework name: list them on one page, then find candidates whose documentation names those needs.',
        'The table gives candidates and reasons, not a ranking: popularity is not evidence, and the first question may lead to plain code.',
        'Ask five risk questions of every candidate: status, defaults, where data goes, language and version, and how hard it is to leave.',
        'Record the decision, including the option of no framework and an honest bad side for each option.',
        'Every row is dated documentation: recheck before you commit.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-79-predict-output-1',
          kind: 'predict-output',
          title: 'Predict the shortlist',
          prompt: 'This plain-JavaScript stand-in builds a shortlist from a small table. Predict the three lines it prints.',
          concept: 'matching needs to candidates',
          language: 'javascript',
          code: `const TABLE = {
  'saved-state': ['LangGraph', 'Microsoft Agent Framework'],
  'other-language': ['Google ADK', 'Microsoft Agent Framework'],
};

function shortlist(needs) {
  const counts = {};
  for (const need of needs) {
    for (const name of TABLE[need] || []) {
      counts[name] = (counts[name] || 0) + 1;
    }
  }
  return Object.keys(counts).sort();
}

console.log(shortlist(['saved-state', 'other-language']).join(', '));
console.log(shortlist(['saved-state']).length);
console.log(shortlist(['cheap']).length);`,
          choices: ['Google ADK, LangGraph, Microsoft Agent Framework\n2\n0', 'Google ADK, LangGraph, Microsoft Agent Framework, Microsoft Agent Framework\n2\n0', 'LangGraph, Microsoft Agent Framework, Google ADK\n2\n0', 'Google ADK, LangGraph, Microsoft Agent Framework\n2\n1'],
          wrongNotes: {
            'Google ADK, LangGraph, Microsoft Agent Framework, Microsoft Agent Framework\n2\n0': 'The counts object has one key per name, so a candidate that matches two needs appears once in the list.',
            'LangGraph, Microsoft Agent Framework, Google ADK\n2\n0': 'The names are sorted alphabetically before printing, so Google ADK comes first.',
            'Google ADK, LangGraph, Microsoft Agent Framework\n2\n1': 'An unknown need gives an empty table row (`|| []`), so nothing is counted and the length is 0.',
          },
          hints: [
            'First call: collect names from both needs. Which name appears under both?',
            'Object keys are unique, so a name listed twice is still one key. Then they are sorted.',
            'Second call has two names. Third call asks for a need that is not in the table.',
          ],
          explanation: 'Grouping by name merges a candidate that matches several needs into one entry, and sorting makes the order independent of the table. An unknown need adds nothing, which is why the real tool reports unknown needs instead of hiding them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-79-scenario-1',
          kind: 'scenario',
          title: 'Pick the shortlist for Mika’s support agent',
          prompt: 'Choose the best way to arrive at a framework for Mika’s support agent.',
          concept: 'choosing by need',
          situation: 'The needs are: Python tools for stock and booking, a mechanic’s approval before any booking, and a booking waiting for approval must survive a server restart. Nina has two days. A colleague says: “Everyone uses the most popular framework, so just use that.”',
          options: [
            { text: 'Write the three needs down, shortlist the candidates whose docs name saved state and pauses plus your own loop, build the smallest slice of the leading one (one tool, one approval, one restart) and record the decision with “no framework” among the options.', consequence: 'The choice rests on evidence from her own needs, the record explains it, and the spike shows the restart behaviour that mattered most.', quality: 'best' },
            { text: 'Pick the framework with the nicest quickstart and decide after building the whole agent.', consequence: 'It may work, but she finds out about saved state and approval late. If the framework does not fit, the whole agent has to be rewritten.', quality: 'acceptable' },
            { text: 'Use the most popular framework because everyone uses it.', consequence: 'Popularity says who tried it, not whether it keeps a paused booking across a restart. She may discover the gap in production.', quality: 'poor' },
            { text: 'Ask an assistant which framework is best and use its answer without checking the docs.', consequence: 'The answer may be out of date, may rank by fame, and may name features that do not exist. There is no record of why, and no way to defend the choice later.', quality: 'poor' },
          ],
          hints: [
            'Which option starts from what the agent must do?',
            'Which option tests the hardest need (surviving a restart) early?',
            'A decision you can explain and reverse is better than one you cannot.',
          ],
          explanation: 'Needs first, a small test of the hardest need, and a written record make the decision explainable and cheap to reverse. Popularity and an unchecked assistant answer are not evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-79-arrange-1',
          kind: 'arrange',
          title: 'The order of a framework decision',
          prompt: 'Put the steps of a sound framework decision in order.',
          concept: 'decision process',
          language: 'text',
          solution: [
            'Write the agent’s needs on one page',
            'List candidates whose documentation names those needs, plus the option of no framework',
            'Check each candidate’s status, defaults, data flow, language and exit cost',
            'Build the smallest slice that tests the hardest need',
            'Record the decision with its good and bad consequences and a revisit trigger',
          ],
          reasons: [
            'Everything else is judged against the needs, so they come first.',
            'Candidates come from the needs, and “none” is one of them.',
            'The checks use the candidate list, and they find costs the quickstart hides.',
            'A small test shows how a candidate really behaves on the need that matters most.',
            'The record comes last because it holds what you learned, and it says when to look again.',
          ],
          hints: [
            'What must exist before you can say whether a candidate fits?',
            'The test of the hardest need happens before you commit, and the record happens after you decide.',
            'The record is the last thing written.',
          ],
          explanation: 'The order moves from what you need to what exists to what you learned. Writing the record last means it can report what the test showed, not only what you hoped.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-79-q1',
        prompt: 'Nina’s agent needs a booking to wait for a mechanic’s approval and survive a server restart. According to the pages we read, which pieces are described for that need?',
        choices: [
          'Only plain functions, because no framework can keep state across a restart and a pending booking would be lost along with it.',
          'The OpenAI Agents SDK’s tracing feature, which stores each run so that the run can be resumed after a restart of the server.',
          'LangGraph’s checkpointers and interrupts, or Microsoft Agent Framework workflows with checkpoints, using a database-backed saver.',
          'A larger model, since a more capable model remembers pending bookings on its own across a restart without being asked to.',
        ],
        answer: 2,
        explanation: 'LangGraph’s persistence and interrupts pages and Microsoft’s workflow pages describe saved state and human input. The in-memory saver is lost on restart. Tracing records a run, it is not a resume mechanism.',
      },
      {
        id: 'building-ai-agents-79-q2',
        prompt: 'A teammate says: “Pick the most popular framework: if lots of people use it, it must fit.” What is the best response?',
        choices: [
          'Agree, because popularity is the best measure of quality for open-source tools and it also shows that the tool is safe.',
          'Agree, but only if it also has the largest number of documentation pages, since more pages mean fewer surprises later on.',
          'Disagree: never use a popular framework, since unpopular ones are always better and are less likely to change their API later.',
          'Disagree: popularity shows who tried it, not whether it fits this agent’s needs, so decide from needs, status and exit cost.',
        ],
        answer: 3,
        explanation: 'Popularity answers a different question. The five risk questions and your own list of needs are evidence about your case, and the course never ranks by popularity.',
      },
      {
        id: 'building-ai-agents-79-q3',
        prompt: 'Which framework decision record is the most useful a year from now?',
        choices: [
          'One that names the chosen framework and says it was the best choice at the time, signed by the whole team that chose it.',
          'One that lists the needs, two or more options plus “no framework” with good and bad consequences, the choice and a revisit trigger.',
          'One that copies the framework’s own feature list and adds the approval signature of the team lead at the bottom of the page.',
          'One that records only the option that was rejected and the reasons it lost, so that the team never has to repeat that debate again.',
        ],
        answer: 1,
        explanation: 'A record is useful when it shows the context, the alternatives, the costs and when to look again. A bare name, a feature list or a rejected-only list cannot be re-checked.',
      },
      {
        id: 'building-ai-agents-79-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does it mean to choose a framework “by need”?',
        choices: [
          'Write down what your agent must do, then look for tools whose documentation says they are made for that.',
          'Pick the one that most of your friends and colleagues use, because they have needs that are much like your own needs.',
          'Pick the newest one on the market, since new tools are built for the latest needs and have fewer old problems.',
          'Pick the one with the shortest installation command, because a short install usually means that there is less to learn.',
        ],
        answer: 0,
        explanation: 'Choosing by need starts from your job, not from a tool’s fame, age or install size.',
      },
      {
        id: 'building-ai-agents-79-q5',
        audience: { min: 'advanced' },
        prompt: 'You pick a framework whose Go support is a public preview. Which revisit trigger fits your decision record best?',
        choices: [
          'Revisit every five years, whatever has changed in the meantime, so that the record never gets older than that limit.',
          'Revisit only if the team’s favourite editor stops supporting the framework, since the editor is what the team uses all day.',
          'Revisit when Go support changes status, or when a preview change breaks one of your tests or a feature you need.',
          'No trigger is needed, because a decision record only describes the past and a past decision cannot be wrong later on.',
        ],
        answer: 2,
        explanation: 'A trigger should be an observable change tied to a risk you named: a status change or a breaking test. Calendar dates and editor support are unrelated to the actual risk.',
      },
    ],
    task: {
      title: 'Shortlist and record a framework decision',
      steps: [
        'Write the needs of an agent you want to build (or Mika’s support agent) on one page, five lines at most.',
        'Save `shortlist.js`, run it, then replace the needs in the last call with your own, using the keys of `TABLE`. Note which candidates appear and why.',
        'Change it and observe: add a need the table does not know and see how it is reported. Then add one new row from a documentation page you have read yourself, with a date in a comment.',
        'Open the decision record builder. Write the context, at least two options plus “no framework”, and the good and bad consequences of each. Leave the final choice for the next lesson if you are not ready.',
        'Reflection: which of the five risk questions would change your choice the most for your own agent?',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Make a two-column list: “What my helper must do” and “Which tool says it does that”. Write “none” if no tool does, and “plain code” if a short function could do it.'] },
      { audience: { min: 'advanced' }, steps: ['Plan a one-day spike for your top two candidates: the smallest slice with one tool, one approval and one restart, three criteria with weights written before you start, and a rule for what result makes you choose neither.'] },
    ],
  },
  {
    id: 'building-ai-agents-80',
    day: 80,
    title: 'Frameworks vs. Custom Agent Architectures',
    summary: 'Weigh the cost of abstraction, lock-in and harder debugging against writing your own loop, learn a thin boundary that keeps either choice reversible, and finish the decision record.',
    intro: {
      objectives: [
        'Name three costs of adopting a framework: abstraction, lock-in and debugging through a layer',
        'Draw a thin boundary of your own that keeps tools, prompts and tests outside any framework’s types',
        'Write the consequences and the revisit trigger of a framework decision honestly',
      ],
      why: 'A framework saves time on day one and charges for it later. Seeing the costs early lets you adopt one with your eyes open, or build your own loop without guilt, and change your mind cheaply.',
    },
    minutes: 22,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'The last lesson ended with a short list of candidates and the option of none. This lesson is about the second half of that sentence. If you can rebuild the loop in forty lines, what exactly does a framework cost, and when is the price worth paying? The honest answer has three parts, and none of them is a reason to avoid frameworks. They are reasons to adopt one deliberately and to keep the door open. This is a concept lesson, so the practice is a decision record and a boundary you write yourself.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Six months after adopting a framework, Nina’s team meets all three costs in one week. An upgrade changes how an agent is created, and the older function in their code is no longer the recommended one. A customer’s question that should have used one model call shows three in the provider’s usage page, and nobody can say whether the extra calls are retries or the agent looping. And a new developer cannot add a tool without learning four framework words first. None of this means the choice was wrong: the framework still saves them an approval and pause system they would have had to write. It means the costs are real and some were avoidable. If their tool code had lived in plain functions and every model reply had passed through one small function of their own, the upgrade would have touched one file, and the retries would have shown in their own log.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'The **cost of abstraction** is what a layer hides. A framework turns your forty lines into one call, which is the benefit, and it also hides the retry rule, the stop rule, the message format and the order of calls. When something goes wrong you debug two things: your code and the layer’s behaviour. You also learn the framework’s own words (checkpointer, middleware, context, handoff) on top of the loop. **Lock-in** is how much of your code speaks the framework’s language, so that leaving costs a rewrite. **Debugging through a layer** is the practical result: a stack trace, a log or a dashboard that belongs to someone else, with defaults you did not choose.' },
      { type: 'paragraph', text: 'Lock-in is easiest to see in a small thing: how a function becomes a tool. Every framework in this module does the same job in its own spelling.' },
      {
        type: 'table',
        headers: ['Framework', 'How a plain function becomes a tool (as the docs show)', 'What to notice'],
        rows: [
          ['LangChain', '`from langchain.tools import tool`, then `@tool`; docstring is the description, type hints are the schema. A plain function also works in the quickstart.', 'Type hints are required.'],
          ['Microsoft Agent Framework', '`from agent_framework import Agent, tool`, then `@tool(approval_mode="never_require")`; a plain function with hints also works.', 'The approval setting lives in the decorator.'],
          ['Anthropic tool runner', '`from anthropic import Anthropic, beta_tool`, then `@beta_tool`, with an async variant for the async client.', 'The `beta` in the name matches its beta status.'],
          ['OpenAI Agents SDK', 'The code examples import `tool` from `agents.decorators`; the prose on the same pages says `@function_tool`.', 'The pages do not say which is canonical: check your installed version.'],
          ['Google ADK', 'A plain function in the `tools` list; the sample uses a docstring and type hints, with no decorator.', 'Least framework in the tool itself.'],
        ],
        caption: 'The same idea in five spellings. If your business rule lives inside a decorated function, moving to another framework means editing every tool.',
      },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[Your domain code: plain-function tools, prompts, tests] --> B[Your thin adapter: one reply shape, one tool interface]', '  B --> C[Your own loop]', '  B --> D[A framework or vendor SDK]', '  C --> E[Model API]', '  D --> E'].join('\n'), caption: 'The adapter is the part you own. Everything above it stays the same if you swap what is below it. Look at the single arrow in from your domain code: that is what keeps a framework reversible.' },
      { type: 'paragraph', text: 'That boundary has three rules. Keep each tool’s logic in a plain function in your own module and wrap it for a framework in one line. Convert every model reply into one shape of your own, such as `{ type: "final" }` or `{ type: "tool_call", name, args }`, in a function that also validates it, because anything a model returns is untrusted. And keep prompts, state shapes and tests in your own files. Then a framework is a layer you can replace, and your tests still pass on both sides because they speak your shapes, not the framework’s.' },
      { type: 'paragraph', text: 'When does each side win? These are conditions, not a verdict. A custom loop tends to fit when the agent has a few tools, one process, one developer who can read forty lines, and rules about approval or logging that you want to control exactly (the tool runner page itself advises the manual loop for approval, custom logging and conditional execution). A framework tends to fit when you would otherwise have to write persistence, pauses that survive a restart, handoffs between agents or tracing yourself, when a team already knows it, or when you need something like workflows or Flows that the docs describe. Either way, write the reason down.' },
      { type: 'paragraph', text: 'Change is part of the cost. The LangChain migration page says that before version 1.0 the recommended entry was `langgraph.prebuilt.create_react_agent` and that now it is `langchain.agents.create_agent`, with older chains moved to `langchain-classic`. Microsoft’s Python upgrade page records that its foundry package replaced an earlier Azure AI package and that packages no longer install on Python 3.10. These are normal events in a fast-moving field, and they show why you pin versions and keep a boundary.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: a framework is a rented stall in a market. It has customers, power and a roof, and you pay in rent and in rules you did not write. Your own loop is a stall you built on your own lot: more work, fewer surprises, and nobody to call when the roof leaks. Many shops start in the market and later move, or keep a small stall at home. What matters is that the move is possible.' },
      note('Read on the date shown: the LangChain migration page (create_react_agent recommended before v1.0, create_agent now, older chains in langchain-classic), the Microsoft Agent Framework Python upgrade page (foundry package replaced an earlier Azure AI package; Python 3.10 no longer installs), the OpenAI Agents SDK tracing page (tracing is on by default; trace_include_sensitive_data defaults to true) and the Anthropic tool runner page (the manual loop is advised for approval, custom logging and conditional execution). The OpenTelemetry GenAI semantic conventions page says those conventions moved to their own repository and are in development, so tracing standards are still moving too.', DOCS.langchainMigrate, DOCS.msUpgrade, DOCS.openaiTracing, DOCS.toolRunner, DOCS.otelGenAi),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, a framework is like a ready-made meal kit and your own loop is cooking from scratch. The kit is faster and gives you a good dinner on a busy night. But you cannot easily change a recipe you did not write, and if the kit changes its box, your habits break. “Lock-in” means your kitchen is arranged around one kit. The fix is simple: keep your own recipes (the tool functions) in a notebook of your own, and use the kit only to cook them. “Debugging through a layer” means that when the dish tastes wrong, you must work out whether you or the kit did it, so keep a note of every step.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Treat a framework as a dependency with a risk profile. Write contract tests at your adapter: feed recorded or scripted replies from each provider and assert your normalised shape, so a minor version that changes a field fails a test and not production. Pin versions, subscribe to release notes and read upgrade pages (Microsoft’s lists breaking changes per release). Prefer open instrumentation: tracing that goes to your own store under your redaction rules avoids a vendor dashboard becoming the only place you can debug, and note that even OpenTelemetry’s GenAI conventions are still in development. Estimate exit cost in files touched, and keep it small. Add budgets, timeouts and approval in your own boundary so they hold if the framework underneath changes its defaults.' },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: 'This is a concept lesson, so the practice is a decision record and a small piece of code you write. Open the decision record builder from the last lesson. Fill in the Consequences and Revisit-when sections using the three costs.' },
      { type: 'visual', id: 'arch-adr-builder', caption: 'Finish your framework decision record. Under Consequences write at least one good and one bad result for each option, including “own loop”: use abstraction, lock-in and debugging as prompts. Under Revisit when, name an observable trigger such as a status change, a breaking upgrade or a need your choice cannot meet.' },
      { type: 'prompt', label: 'Critique my decision record', text: 'Here is my framework decision record for an agent: [paste your context, options (including no framework), decision, consequences and revisit trigger].\n\nReview it as a sceptical colleague. List: (1) any option that sounds like a strawman, (2) a consequence that is missing or one-sided, (3) a claim about a framework that I should check against its official documentation, and (4) whether my revisit trigger is something I could observe. Do not rewrite my record and do not choose a framework for me.' },
      { type: 'list', items: [
        'Check every claim your assistant raises against the official page before you change the record.',
        'Write the one-line adapter signature you would own: what goes in (a model reply) and what comes out (your shape).',
        'List the files that would change if you swapped the framework: that is your exit cost.',
        'Run the activities below: one predicts hidden retries and one writes the adapter itself.',
      ] },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Move one of your tools into a plain function in its own file and call it from your agent.',
          'Write the reply-normalising function for the provider you use, with a test for a malformed reply.',
          'Next lesson, Testing and Debugging Agent Applications, builds the test harness and trace diff that make either choice safe to change.',
          'Read the LangChain migration page once, as a record of how often an entry point can move.',
        ],
      },
      { type: 'takeaways', items: [
        'A framework’s costs are abstraction (hidden defaults and extra vocabulary), lock-in (your code speaks its language) and debugging through a layer.',
        'The same tool idea is spelled differently in every framework, so keep business logic in plain functions and wrap them thinly.',
        'Convert every model reply into one shape you own, in a function that also validates it, and test that function.',
        'Own loop and framework each fit certain conditions: write the reason, the consequences and a revisit trigger down.',
        'Frameworks change entry points, packages and Python versions: pin versions and keep exit cost small.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-80-predict-output-1',
          kind: 'predict-output',
          title: 'How many times was the model called?',
          prompt: 'A framework call hides a retry loop. The model is scripted to time out twice and then answer. Predict the four lines this prints.',
          concept: 'hidden retries behind an abstraction',
          language: 'javascript',
          code: `let calls = 0;
function flakyModel() {
  calls += 1;
  if (calls < 3) return { error: 'timeout' };
  return { type: 'final', text: 'ok' };
}
function frameworkCall(maxRetries) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const reply = flakyModel();
    if (reply.error === undefined) return reply;
  }
  return { error: 'gave up' };
}
const reply = frameworkCall(2);
console.log(reply.type + ' ' + reply.text);
console.log('model calls: ' + calls);
const again = frameworkCall(0);
console.log(again.type);
console.log('model calls: ' + calls);`,
          choices: ['final ok\nmodel calls: 3\nfinal\nmodel calls: 4', 'final ok\nmodel calls: 1\nfinal\nmodel calls: 2', 'final ok\nmodel calls: 3\nundefined\nmodel calls: 3', 'gave up\nmodel calls: 3\nfinal\nmodel calls: 4'],
          wrongNotes: {
            'final ok\nmodel calls: 1\nfinal\nmodel calls: 2': 'The program asked once, but the model was called three times: two timeouts and then the answer. The calls are the part nobody sees.',
            'final ok\nmodel calls: 3\nundefined\nmodel calls: 3': 'The second call starts with `calls` at 3, so its first model call (the fourth) succeeds at once. It does return a reply, and it adds one call.',
            'gave up\nmodel calls: 3\nfinal\nmodel calls: 4': 'With two retries the third attempt succeeds, so the first call does not give up.',
          },
          hints: [
            'Count the attempts in the first `frameworkCall(2)`: attempts 0, 1 and 2.',
            'The first two replies are errors and the third is the answer, so `calls` ends at 3.',
            'The second call starts with `calls` already at 3, so its single attempt gets an answer.',
          ],
          explanation: 'One question from your code made three paid model calls and you saw one result. This is why the retry count belongs in your settings and your log, and why a usage page can disagree with what your code thinks it did.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-80-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the adapter that keeps you free',
          prompt: 'Two made-up providers return replies in different shapes (these shapes are invented and are not any real API). Write `normalize(reply)` that turns either into your own shape. Provider A: `{ parts: [...] }`, where a part is `{ kind: \'text\', text }` or `{ kind: \'call\', name, args }`. If any part is a call, return the first one as `{ type: \'tool_call\', name, args }`; otherwise return `{ type: \'final\', text }` with the text parts joined by a single space. Provider B: `{ result: { type: \'answer\', body } }` gives `{ type: \'final\', text: body }`, and `{ result: { type: \'tool\', tool, json } }` gives a tool call whose `args` is `JSON.parse(json)`. If `json` is not valid JSON, return `{ type: \'error\', message: \'bad arguments\' }`. Anything else returns `{ type: \'error\', message: \'unknown reply shape\' }`.',
          concept: 'a provider-neutral reply adapter with validation',
          language: 'javascript',
          starter: `function normalize(reply) {
  if (reply.parts !== undefined) {
    // provider A: the first call part wins; otherwise join the text parts with a space
    return { type: 'error', message: 'unknown reply shape' };
  }
  if (reply.result !== undefined) {
    // provider B: an answer, or a tool call whose json must parse (use try/catch)
  }
  return { type: 'error', message: 'unknown reply shape' };
}`,
          solution: `function normalize(reply) {
  if (reply.parts !== undefined) {
    for (const part of reply.parts) {
      if (part.kind === 'call') {
        return { type: 'tool_call', name: part.name, args: part.args };
      }
    }
    const texts = [];
    for (const part of reply.parts) {
      if (part.kind === 'text') {
        texts.push(part.text);
      }
    }
    return { type: 'final', text: texts.join(' ') };
  }
  if (reply.result !== undefined) {
    if (reply.result.type === 'answer') {
      return { type: 'final', text: reply.result.body };
    }
    if (reply.result.type === 'tool') {
      try {
        return { type: 'tool_call', name: reply.result.tool, args: JSON.parse(reply.result.json) };
      } catch (e) {
        return { type: 'error', message: 'bad arguments' };
      }
    }
  }
  return { type: 'error', message: 'unknown reply shape' };
}`,
          tests: {
            kind: 'function',
            fn: 'normalize',
            cases: [
              { label: 'provider A text parts are joined', args: [{ parts: [{ kind: 'text', text: 'Hi' }, { kind: 'text', text: 'there' }] }], expected: { type: 'final', text: 'Hi there' } },
              { label: 'provider A call wins over text', args: [{ parts: [{ kind: 'text', text: 'Checking' }, { kind: 'call', name: 'check_stock', args: { sku: 'x' } }] }], expected: { type: 'tool_call', name: 'check_stock', args: { sku: 'x' } } },
              { label: 'provider B tool call with valid json', args: [{ result: { type: 'tool', tool: 'check_stock', json: '{"sku":"x"}' } }], expected: { type: 'tool_call', name: 'check_stock', args: { sku: 'x' } } },
              { label: 'provider B tool call with broken json', args: [{ result: { type: 'tool', tool: 'check_stock', json: '{oops' } }], expected: { type: 'error', message: 'bad arguments' } },
              { label: 'provider B answer', args: [{ result: { type: 'answer', body: 'Yes' } }], expected: { type: 'final', text: 'Yes' }, hidden: true },
              { label: 'an unknown shape', args: [{}], expected: { type: 'error', message: 'unknown reply shape' }, hidden: true },
              { label: 'provider B with an unknown result type', args: [{ result: { type: 'image' } }], expected: { type: 'error', message: 'unknown reply shape' }, hidden: true },
              { label: 'provider A with two calls takes the first', args: [{ parts: [{ kind: 'call', name: 'a', args: {} }, { kind: 'call', name: 'b', args: {} }] }], expected: { type: 'tool_call', name: 'a', args: {} }, hidden: true },
            ],
          },
          hints: [
            'Provider A first: look for a `call` part in a loop and return it at once; if none, collect the text parts and `join(\' \')`.',
            'Provider B: handle `answer` first, then `tool`. For `tool`, wrap `JSON.parse(reply.result.json)` in `try` and return the error object in `catch`.',
            'Anything that matches no branch must fall through to the unknown-shape error at the end.',
          ],
          explanation: 'This function is the boundary. The rest of your agent can be written against your own three shapes, and a change in a provider’s reply is fixed in one place. It also validates, because a model’s tool arguments are untrusted and may not even be valid JSON.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-80-scenario-1',
          kind: 'scenario',
          title: 'Adopt a framework or keep the loop?',
          prompt: 'Choose the best response to the proposal.',
          concept: 'framework versus own loop',
          situation: 'Mika’s agent has two tools, runs as a single script in one process, and the approval rule is one `if` statement. Joel is the only developer. A colleague proposes adopting a large framework “so we look professional and are ready for anything”.',
          options: [
            { text: 'Keep the own loop, put tools in plain functions behind a thin adapter, add scripted-model tests, and write a revisit trigger: saved state across restarts, or a second developer who finds the loop hard to maintain.', consequence: 'The agent stays small and visible, the boundary keeps a later move cheap, and the record says what would change the decision.', quality: 'best' },
            { text: 'Adopt the smallest harness (for example `create_agent`) but keep tool logic in plain functions and your own reply tests.', consequence: 'It adds a dependency and some hidden defaults, but the plain functions and tests keep the exit cost low. It is reasonable if the team wants the framework’s middleware.', quality: 'acceptable' },
            { text: 'Adopt the largest framework now, with crews and graphs, in case the agent grows.', consequence: 'You pay the abstraction and learning costs on day one for needs you do not have, and your code now speaks the framework’s language everywhere.', quality: 'poor' },
            { text: 'Build a general agent framework of your own first, so that any future agent can use it.', consequence: 'It delays the real agent and gives you a framework with one user. The need was a small loop, not a platform.', quality: 'poor' },
          ],
          hints: [
            'Which option matches the size of the actual problem?',
            'Which option keeps a later change cheap, and writes down when to change?',
            'Building for needs you do not have is a cost, whichever way you do it.',
          ],
          explanation: 'Start from the need, keep a boundary you own, and say what would change your mind. Both “adopt everything” and “build a platform” pay for flexibility nobody asked for.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-80-q1',
        prompt: 'A customer’s question that should use one model call shows three calls on the provider’s usage page. Which first step fits what this lesson taught?',
        choices: [
          'Switch frameworks at once, because three calls for one question proves that the framework itself is faulty.',
          'Read your own trace and the framework’s retry and step settings, to see whether the calls are retries or a loop; then set them.',
          'Tell the model in the system prompt to answer in one call only, since models follow limits on how many calls they make in a run.',
          'Delete the usage page data so that the extra calls stop being counted and the bill looks the same as it did before.',
        ],
        answer: 1,
        explanation: 'Three calls can be retries, a loop, or both, and the settings that decide them are defaults you did not choose. Find them, set them and log them. Switching frameworks or prompting cannot tell you the cause.',
      },
      {
        id: 'building-ai-agents-80-q2',
        prompt: 'Which design best keeps a later change of framework cheap?',
        choices: [
          'Keep tool logic in plain functions in your own module, turn each model reply into one shape you own, and keep tests in your own files.',
          'Write each business rule inside the decorated tool function of the framework you use, so that the rules sit next to the framework’s documentation.',
          'Use the framework’s message types throughout the whole code base, so there is only one set of types to learn and to test.',
          'Copy all of the framework’s code into your own repository, so that it can never change and you control every future version.',
        ],
        answer: 0,
        explanation: 'The boundary of plain functions, one reply shape and your own tests means a swap touches the adapter, not the business rules. The other choices spread the framework’s language through everything or freeze a copy.',
      },
      {
        id: 'building-ai-agents-80-q3',
        prompt: 'Which situation gives the strongest reason to adopt a framework rather than keep writing your own loop?',
        choices: [
          'Your agent has two tools, runs in one script, has one developer, and the approval rule is a single `if` statement in the code.',
          'You want the code to look more professional in a code review, and a well-known framework name makes the whole project look serious and mature.',
          'You must pause for a person’s approval for hours and resume after a restart across servers, and would otherwise write that yourself.',
          'You have heard that your competitors use a particular framework, and you do not want to be the only company that does not.',
        ],
        answer: 2,
        explanation: 'Saved state and resumable pauses are real work that frameworks such as LangGraph document. Appearances and competitors are not needs, and a two-tool script is the case where your own loop is easy.',
      },
      {
        id: 'building-ai-agents-80-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is lock-in?',
        choices: [
          'A password or token that stops other people from using your agent without your permission.',
          'A rule that stops the model from calling the same tool more than once during a single run of the agent, whatever the task is.',
          'A setting that makes the agent run only on your own computer and never talk to any model service online.',
          'When so much of your code is in one tool’s style that switching to another would mean rewriting a lot of it.',
        ],
        answer: 3,
        explanation: 'Lock-in is about how costly it is to leave. Keeping your tools as plain functions and your replies in one shape of your own keeps it low.',
      },
      {
        id: 'building-ai-agents-80-q5',
        audience: { min: 'advanced' },
        prompt: 'A provider’s minor release renames a field in its reply. Your agent starts to finish without ever calling a tool, and no error is raised. Which guard would have caught it before production?',
        choices: [
          'A longer system prompt that reminds the model every time to call the tools, with the field names spelled out for it.',
          'A higher retry count on the model call, so that a reply with a renamed field is simply asked for again until it works.',
          'Contract tests at your adapter that feed scripted replies and assert your own shape, plus pinned versions.',
          'A bigger model, since larger models adapt on their own to renamed fields and still call tools as before.',
        ],
        answer: 2,
        explanation: 'The failure is a silent shape change at the boundary. A test that asserts the normalised output for known replies fails loudly, and pinning makes the upgrade a decision. Prompts, retries and model size do not address a renamed field.',
      },
    ],
    task: {
      title: 'Build the boundary and finish the record',
      steps: [
        'Take one tool from lesson 73 or 74 and move its logic into a plain function in its own file, with a type hint or comment for each argument.',
        'Write `normalize(reply)` for the provider you use (or the two made-up ones), with a test for a malformed reply. Run it on at least three replies.',
        'Change it and observe: change one field name in a reply (as a provider update might) and see what your function returns. Then make it return an error object for the new shape and note how much code you had to change.',
        'Finish your decision record in the builder: consequences for each option, including your own loop, and one revisit trigger you could observe.',
        'Reflection: how many files would you edit to swap the framework today, and what is the smallest change that would cut that number?',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['List the pieces of your agent on paper (tools, instructions, the loop, the model). Circle the ones that would have to change if you swapped the framework, and underline the ones that would not.'] },
      { audience: { min: 'advanced' }, steps: ['Add a contract test suite to your adapter with five recorded replies (final, tool call, two malformed, one unknown shape), pin your framework version in the lock file and write the one-line upgrade checklist that runs those tests first.'] },
    ],
  },
  {
    id: 'building-ai-agents-81',
    day: 81,
    title: 'Testing and Debugging Agent Applications',
    summary: 'Test tools on their own, replay a scripted model to assert the tool-call sequence, snapshot expected calls and read a trace diff, all offline and with no key.',
    intro: {
      objectives: [
        'Unit-test a tool without a model, and test the loop with a scripted model',
        'Assert the exact tool-call sequence, snapshot it, and read a diff when it changes',
        'Say what a scripted test proves, and what only an evaluation of a real model can show',
      ],
      why: 'An agent that cannot be tested gets changed with fingers crossed. Tests that run in a second and cost nothing let you change a tool, a limit or a framework and know at once whether your own code still behaves.',
    },
    minutes: 24,
    skills: ['agent-frameworks'],
    body: [
      { type: 'paragraph', text: 'How do you test something that gives a different answer each time you ask? You do not test the model: you test everything around it. The model is one part of an agent, and the rest (your tools, your loop, your limits, your validation, your handling of errors) is ordinary code that can be tested like any other, if you replace the model with a script. This lesson builds that test harness in plain JavaScript that runs offline with no key. It is also the safety net that makes the framework choices of this module reversible.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel changes how Mika’s agent handles a tool error: instead of passing the error text back to the model, he wants to retry the tool once. Two days later, a customer asks about a part code that does not exist, and the agent crashes instead of answering. Nothing tested the path where a tool returns an error. Joel writes a test with a scripted model whose second reply asks for a part that is not in stock, and the test fails in a second, on his laptop, for free. He fixes the loop, keeps the test, and adds two more: one for a tool name that is not allowed and one for a model that never says it is finished. Then he saves the tool-call sequence of one good run as a snapshot, so a later change that alters the sequence shows up as a short diff. He has not tested whether a real model would behave well. He has tested that his own code handles any behaviour.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'Testing an agent works in layers, and the cheap layers come first. A **unit test** calls one tool function directly with chosen arguments and checks its result: no model, no loop. A **replay test** runs the whole loop with a **scripted model**, a stand-in that returns prepared replies in order, and then asserts what the loop did: the order of tool calls, the final status, that a limit stopped a runaway. A **snapshot** stores the expected tool calls as text, so that any change to them fails the test and shows a **diff**, the first place where expected and actual part ways. Last comes the layer these tests cannot reach: whether a real model chooses sensibly. That needs evaluation over many cases, which module 11 covers.' },
      { type: 'diagram', format: 'mermaid', source: ['flowchart TD', '  A[Unit tests of each tool: no model, instant] --> B[Replay tests: scripted model drives the real loop]', '  B --> C[Snapshots of expected tool calls, with a diff]', '  C --> D[Evaluation of a real model over many cases: module 11]'].join('\n'), caption: 'Cheap and exact at the top, costly and statistical at the bottom. Most bugs in your own code are caught in the first three boxes.' },
      {
        type: 'table',
        headers: ['What you test', 'How', 'Needs a real model?', 'What it can prove'],
        rows: [
          ['A tool’s logic and argument checks', 'Call the function with good, bad and missing arguments', 'No', 'Your rules hold for those inputs.'],
          ['The loop: order, errors, limits', 'Scripted model replies, assert status and trace', 'No', 'Your loop handles those replies, including a runaway.'],
          ['The tool-call sequence', 'Compare the calls with a stored snapshot and print a diff', 'No', 'A change to the sequence cannot slip in unseen.'],
          ['Whether the model picks the right tool and wording', 'Run real prompts over a set of cases and score them', 'Yes', 'A rate of success, not a certainty.'],
        ],
        caption: 'The top three rows are deterministic: the same input gives the same result every time. The last is statistical, so it needs many runs.',
      },
      { type: 'paragraph', text: 'A scripted test has an honest limit that you must say out loud: it shows your code behaves for the replies you wrote. It cannot show that a real model would send those replies. If you reword a tool’s description, the scripted tests still pass, and only a run with a real model can tell whether the model now picks the tool. Do not let a green test suite suggest more than it proves.' },
      { type: 'paragraph', text: '**Recording** helps close part of the gap. Run the agent once with a real model, save the sequence of replies it produced (tool names, arguments and final text), and replay it as a script. That gives a realistic test that runs offline. Remove names, phone numbers and keys before saving, because a recording is a copy of real data.' },
      { type: 'paragraph', text: 'When something goes wrong in a live run, the main tool is a **trace**: a record of one run as a sequence of events. OpenAI’s Agents SDK documentation defines a trace as one end-to-end run and a span as a step inside it, records model calls, tool calls, handoffs and guardrails, and has tracing on by default. LangSmith, according to LangChain’s overview, handles tracing, debugging and evaluation. Whatever the tool, read a trace for four things: the order of calls, repeated identical calls (a loop), arguments that look wrong (a description problem) and an error result the model could not use. Your own loop can print the same thing, as the file in this lesson does.' },
      { type: 'paragraph', text: 'LangSmith’s page on evaluating a complex agent names three kinds of evaluation: the final response, the trajectory (“whether the agent took the expected path (e.g., of tool calls) to arrive at the final answer”) and a single step (whether it picks the right first tool). The snapshot in this lesson is a small trajectory check on a scripted run. OpenAI’s agent evaluation page suggests starting from traces and then moving to datasets and repeatable runs. The OpenTelemetry GenAI conventions, a shared way to describe these traces, are still marked as in development, and capturing message content is off by default.' },
      { type: 'paragraph', text: 'An analogy, and only an analogy: testing the model-free parts of an agent is like testing a shop’s till with pretend customers. You can check that it adds up, gives the right change and refuses a bad coin, without waiting for real customers. It cannot tell you whether real customers will like the shop. That takes watching the shop over many days.' },
      note('Read on the date shown: the OpenAI Agents SDK tracing page (a trace is one end-to-end run, spans are steps; tracing is on by default; trace_include_sensitive_data defaults to true), the LangSmith page on evaluating a complex agent (final response, trajectory and single-step evaluation), OpenAI’s page on evaluating agent workflows (start with traces, then datasets and repeatable runs; check its current status before relying on it), the LangChain overview (LangSmith for tracing, debugging and evaluation) and the OpenTelemetry GenAI semantic conventions page (moved to a dedicated repository, in development, content capture off by default).', DOCS.openaiTracing, DOCS.langsmithAgent, DOCS.openaiAgentEvals, DOCS.langchainOverview, DOCS.otelGenAi),
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, read the harness like a teacher marking a quiz. `check` prints PASS or FAIL for each question and counts the fails. The first two checks test the tool alone, like asking one pupil one question. The next checks run the whole loop with a scripted model, which is like a pupil who reads answers from a card, so we know exactly what they will say. `toolCalls` makes a short list of which tools were used, `diffTraces` compares the expected list with the real one and says where they first differ, and the last part changes the script on purpose to show the diff message. A green PASS means “my code did what I expected”, nothing more.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Practices that keep these tests useful. Make each test fail first so you know it can: a test that cannot fail is worse than none, as the fix-bug exercise shows. Treat snapshot updates as reviewed changes, never automatic ones, and keep snapshots small (names and arguments, not whole prompts). Do not assume a real model repeats itself even with the same input, so keep real-model checks in a separate evaluation suite with many cases and a pass rate. Put the adapter from the last lesson under contract tests. Run the cheap layers on every commit, and write recordings with redaction. Trace in production with redaction too, and keep audit logs for actions that change something.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: '**This example runs offline** with Node.js 18 or newer: no key, no network. Save the two blocks below, one after the other, in one file called `agent_test.js`. The first block is the agent from lesson 73 with a trace added, the second is the test harness. Add the second block below the first.' },
      {
        type: 'code',
        language: 'javascript',
        label: 'agent_test.js, part 1: the agent, now returning a trace (scripted model, offline)',
        code: `const STOCK = { 'chain-9sp': 4, 'tube-700c': 0 };

const tools = {
  check_stock: (args) => {
    if (typeof args.sku !== 'string') return { error: 'sku must be a string' };
    if (STOCK[args.sku] === undefined) return { error: 'unknown sku: ' + args.sku };
    return { sku: args.sku, in_stock: STOCK[args.sku] };
  },
};

function scriptedModel(script) {
  let next = 0;
  return () => {
    const reply = script[next];
    next += 1;
    return reply === undefined ? { type: 'final', text: 'Script ended.' } : reply;
  };
}

function runAgent(model, userText, maxSteps) {
  const messages = [{ role: 'user', content: userText }];
  const trace = [];
  for (let step = 1; step <= maxSteps; step++) {
    const reply = model(messages);
    if (reply.type === 'final') {
      trace.push({ step: step, type: 'final', text: reply.text });
      return { status: 'done', trace: trace };
    }
    let result = { error: 'tool not allowed: ' + reply.name };
    if (Object.keys(tools).includes(reply.name)) result = tools[reply.name](reply.args);
    trace.push({ step: step, type: 'tool_call', name: reply.name, args: reply.args, result: result });
    messages.push({ role: 'assistant', call: reply });
    messages.push({ role: 'tool', name: reply.name, content: JSON.stringify(result) });
  }
  return { status: 'stopped', trace: trace };
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'agent_test.js, part 2: add this below part 1 (the test harness, trace diff and snapshot)',
        code: `let failed = 0;
function check(label, ok, detail) {
  console.log((ok ? 'PASS ' : 'FAIL ') + label + (ok ? '' : ' -> ' + detail));
  if (!ok) failed += 1;
}

function toolCalls(trace) {
  return trace.filter((e) => e.type === 'tool_call').map((e) => e.name + '(' + JSON.stringify(e.args) + ')');
}

function diffTraces(expected, actual) {
  const n = Math.max(expected.length, actual.length);
  for (let i = 0; i < n; i++) {
    if (expected[i] !== actual[i]) {
      return 'step ' + (i + 1) + ': expected ' + (expected[i] === undefined ? 'nothing' : expected[i]) + ', got ' + (actual[i] === undefined ? 'nothing' : actual[i]);
    }
  }
  return 'same';
}

// 1. Unit-test a tool on its own: no model, no loop.
check('tool: known part', JSON.stringify(tools.check_stock({ sku: 'chain-9sp' })) === '{"sku":"chain-9sp","in_stock":4}', 'wrong result');
check('tool: bad argument', tools.check_stock({ sku: 7 }).error === 'sku must be a string', 'no error');

// 2. Replay a scripted model and assert the tool-call sequence.
const script = [
  { type: 'tool_call', name: 'check_stock', args: { sku: 'chain-9sp' } },
  { type: 'final', text: 'We have 4.' },
];
const run = runAgent(scriptedModel(script), 'Do you have a 9-speed chain?', 5);
const expected = ['check_stock({"sku":"chain-9sp"})'];
check('replay: finished', run.status === 'done', run.status);
check('replay: tool-call sequence', diffTraces(expected, toolCalls(run.trace)) === 'same', diffTraces(expected, toolCalls(run.trace)));

// 3. Snapshot: the expected calls are stored as text and compared exactly.
const snapshot = JSON.stringify(expected);
check('snapshot matches', JSON.stringify(toolCalls(run.trace)) === snapshot, 'snapshot differs');

// 4. A regression: the model now asks about the wrong part. The diff names the first change.
const changed = runAgent(scriptedModel([{ type: 'tool_call', name: 'check_stock', args: { sku: 'tube-700c' } }, { type: 'final', text: 'None.' }]), 'Do you have a 9-speed chain?', 5);
console.log('diff: ' + diffTraces(expected, toolCalls(changed.trace)));
console.log(failed === 0 ? 'all checks passed' : failed + ' checks failed');`,
      },
      { type: 'paragraph', text: 'What matters. Section 1 tests `check_stock` with no loop and no model, so a failure points at the tool alone. Section 2 drives the real `runAgent` with a script and asserts two things: the final status and the exact tool-call sequence. `diffTraces` returns `same` or the first difference in words, which is much easier to read than two long lists. Section 3 stores the expected calls as text, the idea behind snapshot testing; in a real project the text lives in a file you review when it changes. Section 4 changes the script on purpose to show what a regression looks like. The final line is the only thing a build server needs: a count of failures.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'bash', label: 'Run it', code: 'node agent_test.js' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with Node 22 on 2026-11-18)', code: `PASS tool: known part
PASS tool: bad argument
PASS replay: finished
PASS replay: tool-call sequence
PASS snapshot matches
diff: step 1: expected check_stock({"sku":"chain-9sp"}), got check_stock({"sku":"tube-700c"})
all checks passed` },
      {
        type: 'list',
        items: [
          'If you see `ReferenceError: tools is not defined`, part 2 is in a different file from part 1: put both in `agent_test.js`, part 2 below part 1.',
          'If a check prints FAIL, read the text after the arrow: for the sequence check it is the diff, which names the first step that changed.',
          'If the diff line says `same`, you changed the expected list and the script in the same way: the diff only reports differences between the two lists it is given.',
          'If you add a check and it always passes, break the code on purpose to see it fail: a test that cannot fail proves nothing.',
        ],
      },
      { type: 'warning', text: 'A recording of a real run is a copy of real data: before you save one, remove names, phone numbers, addresses, keys and anything private, and keep only what the test needs (tool names, arguments, results). The same goes for traces and logs in production: redact before you store, decide who can read them and how long they are kept. A green test suite shows that your code behaves for the replies you wrote, not that a real model will behave well, so do not use it as proof of safety.' },
      { type: 'heading', text: 'Next steps' },
      {
        type: 'list',
        items: [
          'Add a test with a script that asks for a tool that is not allowed, and assert the result in the trace.',
          'Add a test with a script that never says final, and assert that the status is `stopped`.',
          'Next module, Building Real-World AI Agent Applications, starts with a customer support agent: bring this harness with you.',
          'Read the LangSmith page on evaluating a complex agent and note how its three evaluation types relate to your three kinds of test.',
        ],
      },
      { type: 'takeaways', items: [
        'Test an agent in layers: tools alone, the loop with a scripted model, snapshots of the expected tool calls, and only then a real model over many cases.',
        'A scripted test proves that your code handles the replies you wrote, not that a real model would send them.',
        'A snapshot and a diff turn a change in the tool-call sequence into a short, readable message.',
        'Read a trace for call order, repeated calls, odd arguments and error results the model could not use.',
        'Recordings, traces and logs are copies of real data: redact them before saving.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-81-code-challenge-1',
          kind: 'code-challenge',
          title: 'Report every difference between two traces',
          prompt: 'The harness reported only the first difference. Write `diffTraces(expected, actual)` that returns a list of strings, one for every position where the two lists of tool calls differ, in order. Each string is `step N: expected X, got Y`, where N counts from 1, and a missing entry is written as `nothing`. If the lists are the same, return an empty list. The calls are plain strings, and the model that produced them was scripted.',
          concept: 'trace diff',
          language: 'javascript',
          starter: `function diffTraces(expected, actual) {
  const differences = [];
  const n = Math.max(expected.length, actual.length);
  for (let i = 0; i < n; i++) {
    // if expected[i] and actual[i] differ, add 'step N: expected X, got Y' (use 'nothing' for a missing entry)
  }
  return differences;
}`,
          solution: `function diffTraces(expected, actual) {
  const differences = [];
  const n = Math.max(expected.length, actual.length);
  for (let i = 0; i < n; i++) {
    if (expected[i] !== actual[i]) {
      const want = expected[i] === undefined ? 'nothing' : expected[i];
      const got = actual[i] === undefined ? 'nothing' : actual[i];
      differences.push('step ' + (i + 1) + ': expected ' + want + ', got ' + got);
    }
  }
  return differences;
}`,
          tests: {
            kind: 'function',
            fn: 'diffTraces',
            cases: [
              { label: 'the same calls', args: [['check_stock(chain)'], ['check_stock(chain)']], expected: [] },
              { label: 'one different call', args: [['check_stock(chain)', 'book(a)'], ['check_stock(chain)', 'book(b)']], expected: ['step 2: expected book(a), got book(b)'] },
              { label: 'an extra call at the end', args: [['check_stock(chain)'], ['check_stock(chain)', 'check_stock(chain)']], expected: ['step 2: expected nothing, got check_stock(chain)'] },
              { label: 'a missing call', args: [['a', 'b'], ['a']], expected: ['step 2: expected b, got nothing'], hidden: true },
              { label: 'two differences are both reported in order', args: [['a', 'b', 'c'], ['x', 'b', 'y']], expected: ['step 1: expected a, got x', 'step 3: expected c, got y'], hidden: true },
              { label: 'two empty lists', args: [[], []], expected: [], hidden: true },
            ],
          },
          hints: [
            'Loop over every position up to the longer of the two lists, so extra or missing calls are seen.',
            'Compare `expected[i]` and `actual[i]` with `!==`. An index past the end gives `undefined`.',
            'Build the message with `\'step \' + (i + 1) + \': expected \' + want + \', got \' + got` and push it onto `differences`.',
          ],
          explanation: 'Looping to the longer length catches both an extra call and a missing one, and reporting every difference helps when two things changed at once. Counting steps from 1 matches how people read a trace.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-81-fix-bug-1',
          kind: 'fix-bug',
          title: 'A test that cannot fail',
          prompt: 'This helper should say whether two tool-call sequences are the same. It says `true` for sequences that differ (`book_repair` against `void_repair`). Find the buggy line and choose the fix. The sequences come from a scripted model.',
          concept: 'a snapshot comparison that can fail',
          language: 'javascript',
          code: `function sameCalls(expected, actual) {
  if (expected.length !== actual.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (expected[i].length !== actual[i].length) return false;
  }
  return true;
}
console.log(sameCalls(['check_stock', 'book_repair'], ['check_stock', 'void_repair']));
console.log(sameCalls(['a'], ['a']));`,
          bugLine: 4,
          fixes: [
            { line: '    if (expected[i] !== actual[i]) return false;', correct: true, why: 'It compares the calls themselves, so `book_repair` and `void_repair` are different, and identical calls still match.' },
            { line: '    if (expected[i].length === actual[i].length) return false;', correct: false, why: 'It rejects any pair of equal length, including identical calls, so a correct run would fail.' },
            { line: '    if (expected[i] != actual[i].length) return false;', correct: false, why: 'It compares a text with a number, so almost every pair counts as different, including identical ones.' },
          ],
          lineNote: 'The comparison inside the loop is the problem: look at what is being compared.',
          tests: { kind: 'output', expected: ['false', 'true'] },
          hints: [
            'The two calls have the same number of letters. What is the line comparing?',
            'It compares the lengths of the two strings, not the strings.',
            'Compare `expected[i]` with `actual[i]` directly.',
          ],
          explanation: 'A comparison that looks only at length cannot tell `book_repair` from `void_repair`, so the test passes when it should fail. Always make a new test fail on purpose once, to be sure it can.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-81-match-1',
          kind: 'match',
          title: 'Where do you look first?',
          prompt: 'Match each symptom to the first thing to check.',
          concept: 'debugging an agent run',
          labels: { terms: 'The symptom', meanings: 'Look here first' },
          pairs: [
            { term: 'The trace shows the same tool call with the same arguments four times in a row', definition: 'The repeated-call and step-limit guard, and what the tool result told the model', note: 'A loop is a repeated action. Check the guard and whether the result was clear enough to act on.' },
            { term: 'The tool is called with a wrong or missing argument', definition: 'The tool’s description and schema, and the argument check in your tool', note: 'The model builds arguments from the description and schema, and your tool must validate them anyway.' },
            { term: 'A scripted test fails right after you changed how errors are handled', definition: 'The replay test’s diff and the loop code you changed', note: 'The scripted model cannot change, so the cause is in your code.' },
            { term: 'The tests pass, but a real model stopped using a tool after you reworded its description', definition: 'An evaluation with a real model over many cases', note: 'Scripted replies do not depend on the description, so only real-model runs can show this.' },
          ],
          hints: [
            'Ask whether the cause could be in your code, in the description or in the model’s choice.',
            'A scripted model never changes, so a scripted failure points to your code.',
            'Only a real model can show whether it reacts to a changed description.',
          ],
          explanation: 'Sorting a symptom by where its cause can live tells you which tool to use: a trace, a scripted test or an evaluation.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-81-q1',
        prompt: 'Your replay tests with a scripted model all pass after you reword a tool’s description. What do they show?',
        choices: [
          'That a real model will still choose the tool correctly, since the replay used the very same tool as before the change.',
          'That your loop and tool code still behave for the replies you wrote; it says nothing about whether a real model will pick the tool.',
          'That the model’s accuracy has not changed, because the tests passed and the tests would have caught any such change in how it behaves.',
          'That the description change was harmless, since descriptions are not read by the code that the tests exercise at all, only by the model.',
        ],
        answer: 1,
        explanation: 'The scripted model returns what you wrote, whatever the description says. So the tests cover your code only. How a real model reacts to the new wording needs evaluation over cases.',
      },
      {
        id: 'building-ai-agents-81-q2',
        prompt: 'Your snapshot test of the tool-call sequence now fails with a diff: step 2 expected `book_repair`, got `check_stock`. What should you do?',
        choices: [
          'Run the snapshot update command at once, since the new sequence is simply what the code does now and that is fine.',
          'Delete the test, because a failing test slows down the build and nobody on the team has time to investigate it.',
          'Make the test ignore step 2, so that small changes in the order of calls do not fail the build any more.',
          'Read the diff, decide whether the change was intended or a regression, and update the snapshot only as a reviewed change.',
        ],
        answer: 3,
        explanation: 'The whole point of a snapshot is that a change must be noticed and judged. Updating blindly, deleting or ignoring a step each remove the protection.',
      },
      {
        id: 'building-ai-agents-81-q3',
        prompt: 'A trace shows step 3 and step 4 as identical calls with identical arguments and identical results. What is the most likely problem and the best next action?',
        choices: [
          'The tracing tool is duplicating events, so you should turn tracing off and read the program’s printed output instead.',
          'The agent is repeating an action without progress: add a repeated-call guard or step limit and check the tool’s result.',
          'The model is too small, so a larger model will never repeat itself and the problem will disappear by itself over time.',
          'The tool is correct and nothing needs to be done, since repeated identical calls are always safe to leave running unattended.',
        ],
        answer: 1,
        explanation: 'Identical call, arguments and result twice in a row is the shape of a loop. A guard stops it and a clearer result may prevent it. Switching models or turning tracing off does not address the loop.',
      },
      {
        id: 'building-ai-agents-81-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a trace?',
        choices: [
          'A record of one run of an agent as a list of steps: what it asked for, what the tools returned and what it answered.',
          'A copy of the model, saved on your computer so that the same model can be run again later without an internet connection.',
          'A list of every customer who has used the agent, with the date of each visit and the questions that were asked.',
          'A setting that makes the agent answer faster by skipping the tool calls that it would normally make for a question.',
        ],
        answer: 0,
        explanation: 'A trace is the step-by-step record of one run, which is what you read to find out what the agent did.',
      },
      {
        id: 'building-ai-agents-81-q5',
        audience: { min: 'advanced' },
        prompt: 'You record a real run to use as a replay script in your repository. Before you commit it, what must you do?',
        choices: [
          'Nothing: a recording only contains the model’s replies, which are not private because the model produced all of them.',
          'Encrypt the recording with a key stored in the same file so that it cannot be read by accident by anyone at all.',
          'Remove names, phone numbers, keys and other private data, keep only the fields the test needs and review the file.',
          'Add the full conversation as well, since more data makes a replay more realistic and easier to compare later on.',
        ],
        answer: 2,
        explanation: 'A recording contains tool arguments and results, which can hold customer data. Minimise and redact, then review. Keeping a key beside the data does not protect it, and more data adds more risk.',
      },
    ],
    task: {
      title: 'Break the harness on purpose, then extend it',
      steps: [
        'Save the two code blocks as `agent_test.js` (part 2 below part 1) and run `node agent_test.js`. Compare the output with the expected output.',
        'Change it and observe: change the script in section 2 so that it asks for `tube-700c`. Read which checks fail and what the diff says. Then undo the change.',
        'Add a replay test whose script asks for a tool that is not allowed, and assert that the trace’s result is `tool not allowed`. Add another with a script that never says final and a small `maxSteps`, and assert the status is `stopped`.',
        'Write down one thing these tests do not prove, in one sentence, and how you would test it with a real model.',
        'Reflection: which of your own agent’s tools or rules would you cover with a test first, and why that one?',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run it, read each line of part 2 and write PASS or FAIL next to the three checks you expect to print, then run the file and compare.'] },
      { audience: { min: 'advanced' }, steps: ['Add a repeated-call detector to `runAgent` that stops with status `stuck` after the same call twice in a row, test it with a scripted model, and store the trace as redacted JSON in a fixtures file that a second test replays. Wire the file to run in your build.'] },
    ],
  },
];
