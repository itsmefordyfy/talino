import type { Lesson, Project } from '../../../types';

// Module 2: Understanding AI Agent Architecture (lessons 8 to 15, no project). Written 2026-11-18.
// Mika's Bike Shop in Naga City, Joel (who builds its agent), every message, reference number and event in the examples are invented.
// Product facts sit in dated version notes (checked against docs/content/AGENTS_FACTS_A.md and AGENTS_FACTS_B.md, 2026-11-18). The Python in "Build it"
// is pure logic with a scripted stand-in for the model: it was run with Python 3.13 and the "Expected output" blocks are that real output.
// The JavaScript activities are the in-app subset (no async, no regular expressions) and use scripted, synchronous model stand-ins.

const CHECKED = '2026-11-18';
const DOCS = {
  openaiFunctions: { label: 'OpenAI: Function calling guide', url: 'https://developers.openai.com/api/docs/guides/function-calling' },
  openaiText: { label: 'OpenAI: Text generation guide', url: 'https://developers.openai.com/api/docs/guides/text' },
  openaiStructured: { label: 'OpenAI: Structured outputs guide', url: 'https://developers.openai.com/api/docs/guides/structured-outputs' },
  claudeDefineTools: { label: 'Claude API docs: Define tools', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools' },
  claudeHandleCalls: { label: 'Claude API docs: Handle tool calls', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls' },
  claudeStructured: { label: 'Claude API docs: Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
  claudeTokenCount: { label: 'Claude API docs: Token counting', url: 'https://platform.claude.com/docs/en/build-with-claude/token-counting' },
  claudePython: { label: 'Claude API docs: Python SDK', url: 'https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python' },
  langgraphPersistence: { label: 'LangGraph docs: Persistence', url: 'https://docs.langchain.com/oss/python/langgraph/persistence' },
  langgraphOverview: { label: 'LangGraph docs: Overview', url: 'https://docs.langchain.com/oss/python/langgraph/overview' },
  crewaiFlows: { label: 'CrewAI docs: Flows', url: 'https://docs.crewai.com/en/concepts/flows' },
};

export const project: Project | null = null;

export const lessons: Lesson[] = [
  {
    id: 'building-ai-agents-08',
    day: 8,
    title: 'Anatomy of an AI Agent',
    summary: 'Name the parts of an agent, say which ones the model decides and which ones your code controls, and draw the architecture of a small agent.',
    intro: {
      objectives: [
        'Name the parts of an AI agent and the job of each one',
        'Say which parts the model decides and which parts your code controls',
        'Draw the architecture of a small agent as a diagram and mark where a wrong answer would come from',
      ],
      why: 'When an agent gives a wrong answer you need to know which part to look at. A map of the parts turns “the AI is broken” into a question you can test, and it is the map you will build on for the rest of the course.',
    },
    minutes: 20,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'An agent answers a customer, looks something up and replies in two seconds. Then it gives one wrong answer. Where do you look: the model, the instructions, your code, the data? If you cannot answer that, you cannot fix it. In Module 1 you met the core components of an agent. Now you take the agent apart, see how the pieces connect, and draw it.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel is building a chat agent for his aunt Mika’s bike shop in Naga City. A customer writes, “Is my bike ready? Ref 4471.” The agent replies with the shop’s opening hours. Joel decides the model is not clever enough and rewrites the instructions three times. The wrong answer stays the same. At last he prints exactly what reached the model: “Is my bike ready”. The reference number is gone. A helper function he wrote to shorten long messages kept only the first sentence. The model was never told about repair 4471. Joel had been debugging the wrong part. He drew the agent on paper, seven boxes, and checked them in order. With the map, the bug took ten minutes.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'An **AI agent** is a system built around a language model, the large language model (LLM) you studied in *How Large Language Models Work*. The model is one part of it. The rest is ordinary code that you write and can test. Here are the parts in the order a request passes through them.' },
      { type: 'diagram', format: 'mermaid', caption: 'The basic architecture of a small agent. Follow one request from the top: it is checked, goes round the loop (model, then tools, then state) and leaves through a check. The instructions feed the model. Notice that only one box is the model.', source: ['flowchart TD', '  U[User message or event] --> I[Input processing: clean and check]', '  I --> L{Agent loop}', '  L --> M[LLM: decides the next step]', '  M --> T[Tools: your code does the action]', '  T --> S[(State and memory)]', '  S --> L', '  L --> O[Output processing: check and format]', '  O --> R[Reply or action]', '  G[Instructions and limits] --> M'].join('\n') },
      {
        type: 'table',
        headers: ['Part', 'Its job', 'Who controls it', 'When it breaks, you see'],
        rows: [
          ['**Input processing**', 'Cleans and checks the incoming message and adds context', 'Your code', 'The model answers a question nobody asked (Joel’s bug)'],
          ['**Instructions**', 'Tell the model its role, rules and answer format', 'You write them, the model reads them', 'The wrong tone, the wrong scope, rules that are ignored'],
          ['The model (LLM)', 'Decides the next step: answer, or ask for a tool', 'The model', 'A wrong choice, a wrong tool, a confident wrong answer'],
          ['**Tools**', 'Do what the model cannot: look up, calculate, book', 'Your code', 'A failed lookup, a stale result, an action that should not have run'],
          ['**State** and memory', 'Hold what the agent knows so far in this task', 'Your code', 'It forgets, repeats itself or mixes up two customers'],
          ['The **loop**', 'Repeats model, tool, result until done or stopped', 'Your code', 'It never stops, or it stops too early'],
          ['**Output processing** and limits', 'Checks the reply before anyone sees it; caps steps, cost and time', 'Your code', 'A bad format, leaked data, a runaway bill'],
        ],
        caption: 'Count the “Your code” cells. Most of an agent is code you control. The model owns one decision at a time.',
      },
      { type: 'paragraph', text: 'That count is the first design rule of this course: **the model decides, your code does.** The model can only ask for an action. Your code checks the request, runs the action and reports the result. You will see in the next lesson why the model cannot act on its own. A quick test you can use on any behaviour you want: is it a decision or an action? A decision, such as which tool to ask for, can go to the model. An action, a limit or a check goes to code.' },
      { type: 'paragraph', text: 'One honest analogy, with its limit. Picture the counter of a repair shop. The customer’s slip goes through the front desk (input processing). The mechanic reads the manual on the wall (instructions), decides what to check (the model), uses the workshop tools (tools) and writes on the job card (state). The owner looks over the finished job before it is handed back (output processing). The analogy breaks in one place: a human mechanic remembers yesterday’s job. A model remembers nothing between calls unless the job card is handed to it again.' },
      { type: 'paragraph', text: 'Each part is one more thing to build, test and watch. The smallest useful design is one model call with input and output checks and no tools, and that is not yet an agent. Add tools only when the answer needs a fact or an action the model does not have. Add the loop only when the next step depends on what the last tool returned. The simplest thing that works is the baseline for everything in this course.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: think of a small shop with one clever clerk, who is the model. The clerk can only talk and decide. The clerk cannot touch anything. Helpers do the real work. One helper at the door checks what comes in. A printed sheet says what the clerk may and may not do. A toolbox does the jobs. A notebook remembers this customer’s job. A checker at the exit reads the reply before it goes out. If an answer is wrong, find which helper did its part badly before you blame the clerk.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In a real system each box is a module with its own tests and metrics: input validation and size limits, a versioned prompt template, a model client with timeouts and retries, a tool registry with schemas and permissions, a state store, a loop with step, token and time budgets, and an output filter. The costly failures sit at the seams: a mismatch between the model’s output and a tool’s input schema, state that grows until it fills the context window, a retry that repeats an action that is not safe to repeat. Log what crosses every boundary, with a request id, so a trace shows which part failed.' },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: 'Draw the anatomy of an agent for one small job. Use Mika’s shop, or a job of your own such as a school helpdesk or a clinic reception. Write the diagram as Mermaid text in the workbench below. The diagram above is a starting point, not something to copy: your agent may have fewer parts.' },
      { type: 'visual', id: 'arch-diagram-workbench', caption: 'Draw your agent: one box per part, an arrow for each hand-over, and a label on every arrow that carries something. Save it. You will extend this diagram in lesson 15.' },
      { type: 'list', ordered: true, items: [
        'Write the job in one sentence: who sends what, and what should come back.',
        'Draw one box for each part in the table and connect them in the order a request travels.',
        'Add a short note to each box: “model” or “code”. See how little of the agent is the model.',
        'Think of one wrong answer your agent could give. Write down the box where you would look first, and the one you would look at second.',
        'Save the diagram in the workbench.',
      ] },
      { type: 'prompt', label: 'Critique my agent diagram', text: 'Here is the Mermaid text of the diagram of my agent: [paste your diagram]. The agent’s job is: [your one-sentence job]. Review it as a careful engineer. Which part is missing? Which arrow has no label? Where could a wrong answer get through without being checked? Do not redraw it. List your questions and the failure you worry about most.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: finish the diagram and check that every box says “model” or “code”.',
        'Next lesson, “Understanding the LLM as an Agent’s Reasoning Engine”, zooms into the model box and shows why it can ask for an action but never take one.',
        'Keep your diagram open as you read lessons 9 to 15. Each lesson zooms into one part.',
      ] },
      { type: 'takeaways', items: [
        'An agent is a language model plus ordinary code: input processing, instructions, tools, state, a loop, and output processing with limits.',
        'The model decides the next step. Your code checks, acts, remembers and stops. Most of the architecture is code you can test.',
        'When an answer is wrong, find the part that failed before you change the model or rewrite the instructions.',
        'Start with the smallest design that works and add a part only when the task needs it.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-08-match-1',
          kind: 'match',
          title: 'Which part do you check first?',
          prompt: 'Each line is something that went wrong in an agent. Match it to the part you would check first.',
          concept: 'agent anatomy and where to look',
          labels: { terms: 'What went wrong', meanings: 'Part to check first' },
          pairs: [
            { term: 'The agent answers a question nobody asked, because the message was cut short before the model saw it', definition: 'Input processing', note: 'The model can only work with what reaches it. Check what was actually sent.' },
            { term: 'Every reply is polite, but the agent keeps promising repair dates the shop never agreed to', definition: 'Instructions', note: 'The promise comes from missing rules about what the agent may say.' },
            { term: 'A lookup returns an old price and the agent quotes it to the customer', definition: 'Tools', note: 'The tool supplied the facts. The model passed on what it was given.' },
            { term: 'Customer A is shown a detail from customer B’s repair', definition: 'State and memory', note: 'Two tasks shared one store of what the agent knows.' },
            { term: 'The agent keeps calling tools for twenty rounds and the cost climbs', definition: 'The loop and its limits', note: 'Nothing told the loop when to stop.' },
          ],
          hints: [
            'Ask what the model actually received, what it was told to do, and what it was allowed to run.',
            'Two of the lines are about what the agent knows or remembers. One is about something that never stops.',
            'Start with the line about a cut-off message: which part prepares the message before the model sees it?',
          ],
          explanation: 'Each symptom points to a part: what comes in (input processing), what the model was told (instructions), what facts it was given (tools), what it holds between steps (state) and when it stops (the loop). Naming the part first is faster than changing everything at once.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-08-scenario-1',
          kind: 'scenario',
          title: 'Where does the rule belong?',
          prompt: 'Choose the design that best keeps the agent from refunding money.',
          concept: 'the model decides, your code does',
          situation: 'Mika never wants the agent to refund a customer. Joel writes “Never refund customers” in the instructions and moves on. A week later a customer writes an angry message demanding their money back. Joel wonders how to make the rule hold.',
          options: [
            { text: 'Keep the sentence in the instructions and also give the agent no refund tool at all, so no code can refund even if the model asks.', consequence: 'The instruction guides tone and wording, and the missing tool makes the rule true whatever the model writes. The agent can only say a staff member will reply.', quality: 'best' },
            { text: 'Add an output check that blocks any reply promising a refund and sends the case to a person.', consequence: 'This catches the wording, which helps. It does not stop an action. If a refund tool exists, the money could already have moved before the reply is checked.', quality: 'acceptable' },
            { text: 'Rewrite the instruction in capital letters and add “this is very important”.', consequence: 'It may help a little on some days. Nothing in the system stops the model from ignoring it, and you cannot test “very important”.', quality: 'poor' },
            { text: 'Switch to a larger model, because a better model will follow the rule.', consequence: 'A larger model may follow it more often, but never always. A rule about money needs a guarantee, not a better chance.', quality: 'poor' },
          ],
          hints: [
            'Which part can guarantee something, and which part can only guide?',
            'If the rule matters for money, it should hold even on the day the model gets it wrong.',
            'The strongest answer removes the ability, not just the wish.',
          ],
          explanation: 'Instructions guide the model, but only code can guarantee a rule. Taking away the refund tool makes the rule hold by design, and the instruction still shapes what the agent says. This is “the model decides, your code does” applied to a rule.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-08-q1',
        prompt: 'A customer writes “Is my bike ready? Ref 4471.” The agent replies with opening hours. Logs show the model received only “Is my bike ready”. What do you check first?',
        choices: [
          'Rewrite the instructions so the agent always asks the customer for a reference number first',
          'The input processing step that prepared the message before the model saw it',
          'Switch to a larger model so it can work out the missing reference number by itself',
          'Add a second lookup tool, because the agent probably lacks one for repair references',
        ],
        answer: 1,
        explanation: 'The model never saw the reference, so the fault is before the model. Rewriting instructions or changing the model would hide the real bug. The input step is the first place to look.',
      },
      {
        id: 'building-ai-agents-08-q2',
        prompt: 'Which description of who does what matches the architecture in this lesson?',
        choices: [
          'The model runs the tools and keeps count of the steps, while your code only prints the finished reply on screen',
          'The model decides every step and your code simply passes messages along, with no checks on what comes back',
          'Your code decides every single step, and the model is only used to turn the final answer into friendly words',
          'The model decides the next step. Your code checks requests, runs tools, keeps state and stops the loop',
        ],
        answer: 3,
        explanation: 'In this design the model makes one decision at a time, and everything else is code you control and can test. That is “the model decides, your code does”.',
      },
      {
        id: 'building-ai-agents-08-q3',
        prompt: 'A teammate wants to add memory, three tools, a loop and a planner to a bot that only answers “What time do you open?”. What is the best response?',
        choices: [
          'Keep it to one model call with input and output checks, and add parts only when a task needs them',
          'Add all of it now, because adding parts later would mean rewriting the whole bot from the beginning',
          'Add the loop but skip the output checks, because a loop already makes every answer safe to send',
          'Add the tools and memory but keep the model unchanged, since the model is the only part that can be wrong',
        ],
        answer: 0,
        explanation: 'The simplest design that works is the baseline. Every extra part costs build time, testing and failure modes, so each one must earn its place with a real need.',
      },
      {
        id: 'building-ai-agents-08-q4',
        audience: { max: 'beginner' },
        prompt: 'In the shop analogy, one part can only talk and decide, and cannot touch anything. Which part is it?',
        choices: [
          'The toolbox that does the jobs in the workshop',
          'The notebook that remembers what has been done',
          'The clerk, which is the model',
          'The checker at the exit who reads each reply',
        ],
        answer: 2,
        explanation: 'The model is the clerk: it decides what should happen next. The helpers around it (toolbox, notebook, door and exit checks) are the code that does and checks.',
      },
      {
        id: 'building-ai-agents-08-q5',
        audience: { min: 'advanced' },
        prompt: 'A trace shows the model asked for the booking tool with the date “next Friday”, and the tool failed. Where is the best place to fix this?',
        choices: [
          'Use a larger model for every step in the agent, so that it never writes a vague date like “next Friday”',
          'Remove the booking tool and let the model confirm bookings in plain text, since text cannot fail to run',
          'Raise the step limit, so that the agent has more chances to guess a date that the tool will accept',
          'At the boundary between model and tool: check arguments against a schema and return a clear error',
        ],
        answer: 3,
        explanation: 'Failures at the seam between model output and tool input are common. A schema check with a specific error message fixes the class of problem and keeps working when the model changes.',
      },
    ],
    task: {
      title: 'Draw and test the anatomy of your agent',
      minutes: 15,
      steps: [
        'Pick one small job for an agent (Mika’s repair questions, a school helpdesk, a clinic desk) and write it in one sentence.',
        'In the workbench, draw the parts as boxes with labelled arrows, and write “model” or “code” on each box. Save it.',
        'Write three wrong answers your agent could give. Next to each, write the part where you would look first.',
        'Change it and observe: delete one box from your diagram, such as input processing or the output check. Write which of your three wrong answers would become more likely, and which would not change.',
        'Reflection: which part of your agent is the hardest to test, and what would you do to make it easier?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If seven boxes feel like many, start with five: message in, instructions, model, tools, reply out. Add input processing and the output check once the first five make sense.'] },
      { audience: { min: 'advanced' }, steps: ['On each arrow, write what you would log (request id, size, time) and one automatic test you would run at that boundary. Mark the arrow where a retry could repeat an action that is not safe to repeat.'] },
    ],
  },
  {
    id: 'building-ai-agents-09',
    day: 9,
    title: 'Understanding the LLM as an Agent’s Reasoning Engine',
    summary: 'See what the model decides inside an agent, what it can never do by itself, and why a reply that sounds like an action is only words.',
    intro: {
      objectives: [
        'Explain what the model decides in an agent and what only your code can do',
        'Spot a reply that claims an action that never ran',
        'List the limits of the model as a decision-maker: no actions, no live facts, no memory between calls, no guarantees',
      ],
      why: 'The most common agent bug is trusting words as if they were actions. Once you see the model as a decision-maker that proposes and your code that disposes, you design the checks that keep an agent honest.',
    },
    minutes: 18,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'Ask a model to book a repair and it may answer, “Done! You are booked for Saturday at 10.” Nothing was booked. How can a reply sound like an action and be only words? The answer explains why every agent has code around its model, and it tells you which checks to build first.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel adds booking to Mika’s agent. A customer asks for Saturday and the agent replies, “Booked for Saturday at 10:00.” On Saturday the customer arrives. There is no booking, and the workshop is full. Joel reads the log. The model wrote exactly that sentence. It never asked for the booking tool, and no tool ran. The booking function was in the code the whole time. The model had written a confirmation because a confirmation looked like a helpful reply. Joel changed the design: the customer is told a booking is confirmed only when the booking tool returns a booking id, and the final reply must contain that id. A reply with no id is held back for a person to read.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'In an agent, the model is the **reasoning engine**: the part that reads the conversation, the instructions and a list of tools, and picks what should happen next. “Reasoning” is a working label, not a claim that the model thinks like a person. It writes likely next words, and with a good setup those words are very often a sensible next step. Treat every decision as a proposal that your code checks. *How Large Language Models Work* explains the mechanism. Here only the job matters.' },
      { type: 'paragraph', text: 'The model’s job is narrow. It chooses between answering and asking for a tool, picks which tool, fills in the arguments (a date, a reference number), judges whether it has enough to answer, and writes the final words. Everything else belongs to your code.' },
      {
        type: 'table',
        headers: ['The model decides', 'Your code does'],
        rows: [
          ['Reads the messages, instructions and tool list you send', 'Builds and sends them, and decides what is allowed in'],
          ['Chooses the next step: reply, or ask for a tool', 'Checks the request against the allow-list and runs the tool'],
          ['Fills in the arguments of the tool request', 'Validates every argument before using it'],
          ['Judges whether it has enough information to answer', 'Stops the loop at the step limit, whatever the model thinks'],
          ['Writes the final wording', 'Checks the wording and the format before it is sent'],
        ],
        caption: 'Each row pairs a decision with the check that belongs next to it.',
      },
      { type: 'paragraph', text: 'Four limits follow from how a model works, and each one drives a design choice. **No actions of its own:** it produces text, or a structured request to act. A request is not an action. **No live facts:** it does not know today’s stock, a price or the date unless they are in the messages or a tool fetched them. **No memory between calls:** it knows only what you send in this request, so your code carries the state (lesson 14). **No guarantee:** the same input can give different output, and it can be confidently wrong, invent a tool name or write arguments that do not fit.' },
      { type: 'diagram', format: 'mermaid', caption: 'One round of an agent. The model never touches the tool. Your code is the only line between them, which is where you place checks.', source: ['sequenceDiagram', '  participant C as Your code', '  participant M as LLM', '  participant T as Tool', '  C->>M: messages, instructions, tool list', '  M-->>C: request: lookup_repair with ref 4471', '  C->>T: run lookup_repair (after checks)', '  T-->>C: result: ready for pickup', '  C->>M: messages plus the result', '  M-->>C: final answer text'].join('\n') },
      { type: 'version', text: 'In both major APIs the model asks and your code runs. OpenAI’s Responses API returns items of type function_call that carry a name and arguments as a JSON text string, and you send each result back as a function_call_output. Anthropic’s Messages API returns a tool_use block, with stop_reason tool_use, whose input is already a parsed object, and you send the result back in a tool_result block. Model names and field details change, so read the current pages before you write code (Module 4 builds this).', checked: CHECKED, sources: [DOCS.openaiFunctions, DOCS.claudeDefineTools, DOCS.claudeHandleCalls] },
      { type: 'paragraph', text: 'There is a cost to this choice. A more capable model decides better on unclear or multi-tool requests, and it is slower and costs more per step. Many steps, such as sorting a message into a category, work with a smaller model. Module 3 shows how to choose a model for each step. For now, remember that the model is a decision-maker you pay for each time you ask it.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: the model is a clerk who can only speak or write a note. Ask the clerk to book Saturday and the clerk may write “Booked!” on a note. That does not change the calendar. Somebody has to open the calendar and write in it, and in an agent that somebody is your code. So when an agent says “done”, do not trust the words alone. Look for proof that the action happened, such as a booking number that came back from the calendar tool.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Design for a stochastic decision-maker. Pin each decision to a narrow contract: a tool name from an allow-list and arguments that match a schema, checked in code. Treat any claim in free text (“I have booked it”) as unverified until a tool result backs it. Match the model to the step: a stronger model for ambiguous multi-tool choices, a smaller one for classification or extraction. Log the model id, the input size and the output of every step so a failure can be replayed. Evaluate the decision (right tool, right arguments) separately from the wording, because a fluent answer can hide a wrong decision.' },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: 'Take the diagram you drew in lesson 8. Do a paper audit of every arrow that leaves the model box.' },
      { type: 'list', ordered: true, items: [
        'For each arrow, write exactly what the model sends out: a sentence for the customer, or a request for a tool with its arguments.',
        'For each tool, write the name of the function in your code that really does the work.',
        'If you find an arrow that says “model books the repair”, redraw it as “model asks for a booking, code books it and returns an id”.',
        'Add one check beside any arrow where the model’s words could be taken for a result.',
      ] },
      { type: 'prompt', label: 'Words or action?', text: 'Here is a list of things my agent should do: [your list]. For each one, tell me whether the model can do it by writing text alone, or whether my code must do it. For each one that needs code, name the tool it needs and what the tool should return as proof that it happened. Do not write the code.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: finish the audit and add one proof check (such as a booking id) to your diagram.',
        'Next, “System Instructions and Agent Configuration” shows how to tell the model its role and rules, and why a rule that matters must also live in code.',
        'Read the OpenAI function calling guide or the Claude tool use docs once, only to see the field names you met in the version note.',
      ] },
      { type: 'takeaways', items: [
        'The model is the agent’s decision-maker: it chooses a step and fills in arguments, and it proposes. Your code disposes.',
        'The model has no actions of its own, no live facts, no memory between calls and no guarantee of the same answer twice.',
        'A reply that says an action happened is only words until a tool result proves it.',
        'Pair every model decision with a check in code: allow-list, argument validation, step limit and output check.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-09-predict-output-1',
          kind: 'predict-output',
          title: 'Words are not actions',
          prompt: 'The model here is scripted: `modelReply` returns a prepared reply, like a stand-in for a real model. What does this program print?',
          concept: 'the model produces text, not actions',
          language: 'javascript',
          code: [
            'const calendar = [];',
            'function modelReply() {',
            "  return { type: 'text', text: 'Done! I booked your bike in for Saturday at 10.' };",
            '}',
            'const reply = modelReply();',
            'console.log(reply.text);',
            "console.log('bookings in the calendar: ' + calendar.length);",
          ].join('\n'),
          expected: 'Done! I booked your bike in for Saturday at 10.\nbookings in the calendar: 0',
          choices: [
            'Done! I booked your bike in for Saturday at 10.\nbookings in the calendar: 0',
            'Done! I booked your bike in for Saturday at 10.\nbookings in the calendar: 1',
            'bookings in the calendar: 0',
            'Done! I booked your bike in for Saturday at 10.',
          ],
          wrongNotes: {
            'Done! I booked your bike in for Saturday at 10.\nbookings in the calendar: 1': 'Nothing in the program ever adds to calendar. A sentence cannot change it.',
            'bookings in the calendar: 0': 'The first console.log prints the reply text, so there are two lines.',
            'Done! I booked your bike in for Saturday at 10.': 'The program also prints the number of bookings, so there is a second line.',
          },
          hints: [
            'Look for any line that changes `calendar`.',
            'The reply is an object with a text field. Reading reply.text only reads words.',
            'No code pushes anything into calendar, so its length stays 0.',
          ],
          explanation: 'The model stand-in only returns text. For a booking to exist, code would have to add to the calendar. The reply says “booked” and the calendar is empty, which is exactly Joel’s bug.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-09-scenario-1',
          kind: 'scenario',
          title: 'The agent said it was ready',
          prompt: 'Choose the best way to stop this mistake from reaching customers.',
          concept: 'verify claims against tool results',
          situation: 'A customer is told “Your bike is ready for pickup” and travels across town. The log shows the lookup tool really ran and returned “in progress”. The model wrote a friendlier answer than the data supported. Joel wants to stop this from happening again.',
          options: [
            { text: 'Have the code compare the status in the tool result with the status the reply claims, and hold back any reply that does not match for a person to read.', consequence: 'The mismatch is caught before the customer sees it, and held replies show Joel where the model drifts. It costs a small amount of code.', quality: 'best' },
            { text: 'Add a line to the instructions: “Copy statuses from tool results exactly.”', consequence: 'This lowers the chance of the mistake. It cannot stop it, and no one would know on the day it fails.', quality: 'acceptable' },
            { text: 'Use a larger model and assume it will no longer happen.', consequence: 'It may happen less often, but a better model can still smooth over a result. Nothing checks it, so you would find out from an unhappy customer.', quality: 'poor' },
            { text: 'Remove the lookup tool and let the model answer from the repair notes pasted in the prompt.', consequence: 'Stale notes make it worse. The model still writes whatever sounds right, and now it has no live data at all.', quality: 'poor' },
          ],
          hints: [
            'The tool ran correctly. Where did the wrong claim get in?',
            'You need something that does not depend on the model behaving.',
            'Compare the words the model wrote with the data the tool returned, in code.',
          ],
          explanation: 'A claim in free text is unverified until something in code checks it against a tool result. An instruction helps, but a check in code is the one thing that still works on the day the model gets it wrong.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-09-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Can the model do this alone?',
          prompt: 'Tap each card. Decide first whether a model could do the job with text alone, then read the answer.',
          concept: 'limits of the model as a decision-maker',
          cards: [
            { front: 'Tell a customer how many inner tubes are in stock right now', back: 'No. Stock is a live fact. Without a lookup tool the model can only guess a number that sounds right.' },
            { front: 'Write a polite two-line apology for a late repair', back: 'Yes. Writing wording from facts you give it is what the model does well. Check the facts you gave it, not the grammar.' },
            { front: 'Remember what the customer said in a chat yesterday', back: 'No. The model keeps nothing between calls. Your code must save that and send it again.' },
            { front: 'Decide that the customer’s question needs the repair lookup tool', back: 'Yes. Choosing a tool and its arguments is the decision the model is for. Your code still checks the request before running it.' },
          ],
          hints: [
            'Ask: does the job need a fact that changes, a memory, or an action in the world?',
            'Writing and choosing are things the model does with the text it was given.',
            'Live facts, memory between calls and actions all need your code.',
          ],
          explanation: 'The model is strong at choosing and wording, and weak at live facts, memory and action. The split tells you which parts of an agent must be code.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-09-q1',
        prompt: 'A customer says the agent promised a booking for Saturday. The log shows the model’s reply “Booked for Saturday at 10” but no tool call at all. What happened?',
        choices: [
          'The booking tool ran, but its result was lost before the agent could save the confirmation to the log',
          'The calendar rejected the booking, and the log did not record the error message that came back',
          'The model wrote text that sounded like a booking; no tool was requested, so nothing was booked',
          'The model booked it through its own direct connection to the calendar, without needing a tool at all',
        ],
        answer: 2,
        explanation: 'No tool call appears in the log, so no tool result can have been lost or rejected. The model wrote words only, and a sentence does not change a calendar.',
      },
      {
        id: 'building-ai-agents-09-q2',
        prompt: 'Which decision belongs to the model in a well-designed agent?',
        choices: [
          'Which of the allowed tools to ask for, and which arguments to fill in',
          'Whether the loop may run a fiftieth step when the budget has been spent',
          'Whether a tool argument such as a date is valid enough to be executed',
          'Whether the final reply may leave the system without any further check',
        ],
        answer: 0,
        explanation: 'Choosing among tools you allowed, and filling in their arguments, is the decision the model is for. Limits, validation and release checks belong to your code.',
      },
      {
        id: 'building-ai-agents-09-q3',
        prompt: 'True or false: if the model’s reply says “I called the booking tool”, then the booking tool ran.',
        choices: [
          'True, because the model is part of the system and would not report something that never happened',
          'False, because the model only writes text. A tool runs only when your code runs it',
          'True, because replies are built from a log of what the system did, so they describe real actions',
          'False, because tool calls are always skipped unless a person has approved each one of them first',
        ],
        answer: 1,
        explanation: 'The model writes likely text, including text about actions. Whether a tool ran is a fact in your logs, not something you can read from the reply.',
      },
      {
        id: 'building-ai-agents-09-q4',
        audience: { max: 'beginner' },
        prompt: 'In the clerk analogy, the clerk writes “Booked!” on a note. What still has to happen for the booking to be real?',
        choices: [
          'Nothing more is needed, because the note itself is already the booking in the calendar',
          'The clerk must write the note again in a bigger font so that the calendar can read it',
          'The customer must read the note twice and sign it before the booking counts',
          'Someone has to open the calendar and write in it: your code runs a tool',
        ],
        answer: 3,
        explanation: 'A note is only words. The calendar changes when code runs the booking tool, and the proof is something the calendar returns, like a booking number.',
      },
      {
        id: 'building-ai-agents-09-q5',
        audience: { min: 'advanced' },
        prompt: 'You compare two models on your agent. Model A writes nicer final answers. Model B picks the right tool with the right arguments more often. How should you evaluate them?',
        choices: [
          'Score tool choice and arguments apart from the wording, then decide which model suits which step',
          'Pick model A, because customers read the final wording and never see which tools were called',
          'Score the final text only, because a wrong tool choice will nearly always show up in the wording',
          'Average both scores into one number, so that neither decision is weighted more than the other',
        ],
        answer: 0,
        explanation: 'A fluent answer can hide a wrong decision, so evaluate decisions separately from wording. Often the best system uses different models for different steps.',
      },
    ],
    task: {
      title: 'Catch an action that was only words',
      minutes: 15,
      steps: [
        'Open any chat assistant that has no tools. Type: “Book my bike in for Saturday at 10 and confirm it.” Read the reply and underline every phrase that claims something happened.',
        'Write down which tool a real agent would need to make this true, and what that tool should return as proof (for example a booking id).',
        'Change it and observe: ask again, but add “You have no tools and cannot book anything. If you cannot do it, say so.” Compare the two replies. Note which words changed and whether you would trust the second reply without a check.',
        'Reflection: in your own agent, where would code detect a reply that claims an action with no matching tool result?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Do step 1 with a friend’s request instead of a booking, such as “send my receipt by email”. List three phrases that sound like an action. For each, write what real proof you would ask for.'] },
      { audience: { min: 'advanced' }, steps: ['Sketch a function that takes the reply text and the tool log and flags replies containing words like “booked” or “sent” with no matching successful tool result. List the false positives and false negatives you would expect.'] },
    ],
  },
  {
    id: 'building-ai-agents-10',
    day: 10,
    title: 'System Instructions and Agent Configuration',
    summary: 'Write instructions with a role, rules, an output format and a hand-over, keep settings in one config object, and know which rules need code to enforce them.',
    intro: {
      objectives: [
        'Write system instructions with a role, rules, an answer format and a hand-over rule',
        'Keep the model id, step limit and tool list in one configuration, outside the prompt',
        'Decide which rules the instructions can only guide and which must be enforced in code',
      ],
      why: 'Two agents on the same model can behave very differently because of their instructions and settings. Writing them as clear, testable parts is the cheapest way to improve an agent, and knowing their limit stops you from trusting a sentence with a job that needs a lock.',
    },
    minutes: 22,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'Two agents use the same model. One answers customers calmly in forty words and hands hard cases to a person. The other rambles, invents prices and never asks for help. What is different? Not the model. The difference is the instructions and the settings around it, and both are things you write.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel’s first prompt for Mika’s agent was: “You are a helpful assistant for Mika’s Bike Shop. Answer questions about bikes.” In testing, a customer asked for a discount and the agent replied, “Sure, 20 percent off!” Another asked about a tyre brand and got a 300-word essay. Joel rewrote the prompt with a role, a list of rules, a format and a hand-over line. The discount answers stopped. A week later one reply still quoted a price. The rule had been in the prompt, and the model had missed it once. So Joel moved price decisions out of the prompt: the agent has no tool that sets prices, and the code checks every reply for a currency amount before it is sent.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**System instructions** (also called the system prompt) are the text you give the model before the conversation starts: who it is, what it may do and how to answer. **Configuration** is everything you set that is not words: the model name, the step limit, the token limit, the timeout and the list of allowed tools. Instructions guide the model. Configuration and your code enforce.' },
      { type: 'visual', id: 'ai-prompt-anatomy', caption: 'The parts of a prompt. Change one part at a time and watch which decision it carries.' },
      { type: 'paragraph', text: 'A good set of instructions for an agent has five parts. Each one is short and you can test it.' },
      { type: 'list', items: [
        '**Role and scope.** Who the agent is and what it covers. Also say what it does not cover.',
        '**Rules.** Short sentences that can be tested. “Never promise a price” can be tested. “Be careful with money” cannot.',
        '**Output format.** The exact fields or sentence shape your code will read (lesson 11).',
        '**Tools.** Which tools exist and when to use each, in one line.',
        '**Hand-over.** What to do when unsure: say so and ask a person. Without this line the model fills the gap with a guess.',
      ] },
      {
        type: 'table',
        headers: ['Weak instruction', 'Why it fails', 'Stronger version'],
        rows: [
          ['“Be helpful and answer anything about bikes.”', 'There is no scope, so it invites guessing about prices, safety and other shops', '“Answer questions about opening hours and repair status only. For anything else, say a staff member will reply.”'],
          ['“Be careful with prices.”', 'Nobody can test what “careful” means', '“Never state or promise a price. Say the shop will confirm it.”'],
          ['“Reply nicely.”', 'The format is open, so your code cannot read the reply', '“Reply as JSON with the keys answer and needs_person.”'],
          ['“Don’t make mistakes.”', 'It is not something the model can act on', '“Use only facts from tool results or the customer’s message. If a fact is missing, say so.”'],
        ],
        caption: 'A strong instruction says what to do and what to say, and you can write a test for it.',
      },
      { type: 'paragraph', text: 'Keep configuration in one place, not scattered through the code. Read the model id from an environment variable or one constant, because model names change and you want to change them once. Put the step limit, the token limit and the allowed tool names there too. Never put a secret, an API key or private customer data in the instructions: the model can repeat what it reads, and prompts often end up in logs. And never paste a customer’s message into the instructions. Keep it in the user message, so a customer cannot rewrite your rules.' },
      { type: 'version', text: 'OpenAI’s Responses API has a separate instructions field. The text guide says it takes priority over the prompt in the input and applies only to the current request, so with previous_response_id the earlier instructions are not carried over: send them again. Anthropic’s token counting page lists the system prompt as its own input of a message request, apart from the messages and the tools. Field names and behaviour can change. Check the current pages (Module 3 shows both calls side by side).', checked: CHECKED, sources: [DOCS.openaiText, DOCS.claudeTokenCount] },
      { type: 'paragraph', text: 'Here is the limit that matters most. Instructions are a request, not a lock. The model usually follows them and sometimes does not. For a rule that costs money, leaks data or hurts someone, build it in code: remove the tool, check the arguments, check the reply, cap the steps. Use the instructions for tone, scope and format, where an occasional miss is cheap. Everything in the list above is guidance, and the layers of code in lesson 8’s diagram are the guarantee.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: instructions are like the sheet taped above the counter for a new helper. It says who you are, what you may answer and what to say when you do not know. A good sheet is short and specific. “Be nice” does not help a new helper. “Say a staff member will reply when you are unsure” does. But a sheet cannot stop a helper who ignores it, so anything risky also needs a lock. You do not give a new helper the key to the till and hope they read the sheet.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Treat instructions as versioned configuration: keep them in the repository, review changes like code, and run your test cases against each change, because a small edit can shift behaviour in places you did not expect. Keep the stable part first and the changing part last so any prompt caching your provider offers can help. Measure instruction-following as a rate over many cases, not one run. Layer the defences: instructions for behaviour, schemas and validators for shape, permissions for capability, and human approval for irreversible actions. Do not assume the model keeps a rule that appears once in a very long prompt.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will write the agent’s configuration as one object and a function that turns it into instructions, with a checker that finds missing parts. Nothing to install: it uses only Python’s standard library, Python 3.10 or later. Save the first block as config_demo.py, then add the second block below it and run the file.' },
      { type: 'code', language: 'python', label: 'Python: the configuration, the prompt builder and the checker (config_demo.py, part 1)', code: `from dataclasses import dataclass


@dataclass(frozen=True)
class AgentConfig:
    name: str
    role: str
    rules: tuple[str, ...]
    output_format: str
    when_unsure: str
    allowed_tools: tuple[str, ...] = ()
    max_steps: int = 6
    max_tokens: int = 400


def build_system_prompt(config: AgentConfig) -> str:
    lines = [f"You are {config.name}. {config.role}", "", "Rules:"]
    lines += [f"{i}. {rule}" for i, rule in enumerate(config.rules, start=1)]
    lines += ["", f"Answer format: {config.output_format}"]
    lines += [f"If you are not sure: {config.when_unsure}"]
    tools = ", ".join(config.allowed_tools) or "none"
    lines += [f"Tools you may ask for: {tools}."]
    return "\\n".join(lines)


def check_config(config: AgentConfig) -> list[str]:
    problems = []
    if not config.rules:
        problems.append("no rules: say what the agent must never do")
    if not config.when_unsure.strip():
        problems.append("no escalation rule: say what to do when unsure")
    if not 1 <= config.max_steps <= 20:
        problems.append("max_steps must be between 1 and 20")
    return problems
` },
      { type: 'code', language: 'python', label: 'Python: Mika’s configuration and a run (add this below part 1)', code: `MIKA = AgentConfig(
    name="Mika's Bike Shop assistant",
    role="You answer customer questions about the shop's opening hours and repair status.",
    rules=(
        "Use only facts from the tools or the customer's message.",
        "Never promise a repair date or a price; say the shop will confirm.",
        "Keep every answer under 60 words.",
    ),
    output_format='JSON with the keys "answer" (text) and "needs_person" (true or false).',
    when_unsure="set needs_person to true and say a staff member will reply.",
    allowed_tools=("get_hours", "lookup_repair"),
)
BAD = AgentConfig("Helper", "Be helpful.", (), "text", "", max_steps=99)

print(build_system_prompt(MIKA))
print()
print("Problems in MIKA:", check_config(MIKA))
print("Problems in BAD:", check_config(BAD))
print("Settings the code enforces, not the prompt:", MIKA.max_steps, "steps,", MIKA.max_tokens, "tokens")
` },
      { type: 'paragraph', text: 'The important lines. **AgentConfig** is one frozen object, so nothing changes it by accident while the agent runs. **build_system_prompt** assembles the five parts of good instructions in a fixed order from that object, so every change to a rule is a change to data. **check_config** looks for the parts that are easiest to forget: no rules, no hand-over, a silly step limit. The last line prints max_steps and max_tokens to make one point: these are settings your loop enforces. They are not sentences the model is asked to respect.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'Reading the code line by line. The dataclass block is a form with labelled boxes: name, role, rules and so on. frozen=True means once the form is filled in, nobody can change it. The function build_system_prompt takes a filled-in form and writes the instructions as lines of text, one rule per line, numbered. The word join glues the lines together with line breaks. check_config is a short checklist: it adds a complaint to a list for each missing part. At the bottom, MIKA is a filled-in form and BAD is one with missing parts, so you can see the checker complain.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run with Python 3.13 on 2026-11-18)', code: `You are Mika's Bike Shop assistant. You answer customer questions about the shop's opening hours and repair status.

Rules:
1. Use only facts from the tools or the customer's message.
2. Never promise a repair date or a price; say the shop will confirm.
3. Keep every answer under 60 words.

Answer format: JSON with the keys "answer" (text) and "needs_person" (true or false).
If you are not sure: set needs_person to true and say a staff member will reply.
Tools you may ask for: get_hours, lookup_repair.

Problems in MIKA: []
Problems in BAD: ['no rules: say what the agent must never do', 'no escalation rule: say what to do when unsure', 'max_steps must be between 1 and 20']
Settings the code enforces, not the prompt: 6 steps, 400 tokens
` },
      { type: 'list', items: [
        'If you see SyntaxError near tuple[str, ...]: your Python is older than 3.9. Check with python3 --version and use 3.10 or later.',
        'If you see TypeError about a missing argument when you create a config: every field without a default value must be given. Name them as in the file.',
        'If you see FrozenInstanceError: you tried to change a field of a frozen config. Create a new one with the change instead, as dataclasses.replace does.',
        'If the output prints a blank where the prompt should be: check that the first block ends with the return line and the second block is added below it, not in its place.',
      ] },
      { type: 'warning', text: 'Keep secrets and private customer data out of instructions, because the model can repeat them and prompts are often logged. Never build instructions by pasting a customer’s message into them: that lets a customer rewrite your rules. This code only guides the model. The limits shown at the end (steps, tokens, tools) must be enforced by your own code.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: change one rule in MIKA, run it again and read how the prompt changes. Then add a rule you would want for your own agent.',
        'Next lesson, “Input and Output Processing”, shows how your code reads the answer format you asked for, and what to do when the model does not follow it.',
        'Read the system prompt section of the docs of the model API you plan to use, once, and note its field name.',
      ] },
      { type: 'takeaways', items: [
        'Good instructions have five testable parts: role and scope, rules, output format, tools, and a hand-over for when the agent is unsure.',
        'Configuration (model id, step limit, token limit, allowed tools) belongs in one object outside the prompt.',
        'Instructions guide the model but cannot guarantee anything. A rule about money, data or harm must also be enforced in code.',
        'Never put secrets or raw customer text inside the instructions.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-10-match-1',
          kind: 'match',
          title: 'Where should each requirement live?',
          prompt: 'Match each requirement to the place where it should be enforced or written.',
          concept: 'instructions versus configuration and code',
          labels: { terms: 'Requirement', meanings: 'Where it belongs' },
          pairs: [
            { term: 'The agent must never take more than 6 steps', definition: 'A step limit in the loop, set in the configuration', note: 'A count is not something the model can reliably keep. The loop must stop it.' },
            { term: 'Only get_hours and lookup_repair may ever run', definition: 'An allow-list checked by your code before any tool runs', note: 'A list of names in the prompt only asks. Code has to refuse the rest.' },
            { term: 'The agent should sound calm and short', definition: 'A line in the instructions', note: 'Tone is cheap to get slightly wrong, so guidance is enough.' },
            { term: 'The model name used in production', definition: 'One environment variable or constant', note: 'Model names change. You want to change them in one place.' },
            { term: 'Replies must always include needs_person', definition: 'The format in the instructions, plus a validator on the reply', note: 'The instruction asks. The validator makes sure your code never reads a bad reply.' },
          ],
          hints: [
            'Ask for each: is a miss cheap (guidance is fine) or costly (code must enforce it)?',
            'Counts, lists of what may run and names that change all need something outside the prompt.',
            'Tone is the one that fits a line of instructions alone.',
          ],
          explanation: 'Guidance (tone, scope) can live in the instructions. Anything with a cost when it fails (limits, permissions, format your code reads) also needs code that enforces it. Settings that change, like a model name, live in one place.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-10-scenario-1',
          kind: 'scenario',
          title: 'Keep other customers’ repairs private',
          prompt: 'Choose the design that best protects other customers’ repair details.',
          concept: 'enforcing rules in code, not only in instructions',
          situation: 'Mika’s agent can look up repair status by reference number. Mika asks that it never reveal another customer’s repair details. Joel adds a rule to the instructions. He wants more than a sentence.',
          options: [
            { text: 'Keep the rule in the instructions and make the lookup tool return only the status of the one reference in this conversation, with no list and no search.', consequence: 'Even if the model ignores the rule, the tool has no way to return another customer’s details. The instruction shapes the wording, the tool shapes what is possible.', quality: 'best' },
            { text: 'Write the rule in capital letters and test it with five tricky messages.', consequence: 'Testing is good and the rule may hold in all five. It still depends on the model behaving, and a sixth message may find the gap.', quality: 'acceptable' },
            { text: 'Paste the full customer list into the instructions so the model “knows who is who”.', consequence: 'The private data is now in every request and in every log. The model can repeat any of it. This makes the leak easier, not harder.', quality: 'poor' },
            { text: 'Trust the model to be polite and skip the rule, since a good model would not do that.', consequence: 'Nothing is written down or tested. The first customer who asks cleverly gets someone else’s details.', quality: 'poor' },
          ],
          hints: [
            'What can the tool make impossible, rather than just unlikely?',
            'Compare “the model should not” with “the code cannot”.',
            'Shrink what the tool is able to return.',
          ],
          explanation: 'A rule about private data should hold even when the model slips. Limiting what the tool can return is a guarantee in code. The instruction still helps the agent word its answer.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-10-q1',
        prompt: 'A reply from Mika’s agent promised a repair price even though the instructions said “Never promise a price.” What is the most reliable fix?',
        choices: [
          'Check every reply for a price in code before sending, and give the agent no price tools',
          'Make the sentence longer and add “This rule is very important” to the end of the prompt',
          'Switch to a different model and run the same test cases again to see if the rule holds',
          'Add the rule again at the end of the prompt, so that the model sees it twice instead of once',
        ],
        answer: 0,
        explanation: 'An instruction can fail. A check on the reply and a tool set with no price control hold even on the day the model slips. The other options only change how likely a slip is.',
      },
      {
        id: 'building-ai-agents-10-q2',
        prompt: 'Which instruction is the strongest of these four for a repair-status agent?',
        choices: [
          'Be accurate and professional at all times, and always try to give the customer a complete answer.',
          'Do your best to help the customer with whatever they ask, and answer every question they have.',
          'Use only facts from tool results. If a fact is missing, say a staff member will reply.',
          'Avoid mistakes about repairs, keep customers happy and make sure they leave with an answer.',
        ],
        answer: 2,
        explanation: 'It names a source of facts and gives a hand-over for gaps, so you can test it. The others describe an attitude, which cannot be tested.',
      },
      {
        id: 'building-ai-agents-10-q3',
        prompt: 'Joel builds the instructions as: “You are the shop assistant. The customer says: ” followed by the customer’s message. What is wrong with this design?',
        choices: [
          'Nothing, because the model needs the customer’s words inside the instructions in order to answer',
          'The instructions are too short, so the model will not know its role or how to behave',
          'The instructions should be written in capital letters so that the model notices every rule',
          'A customer can write text that looks like new rules, so customer text belongs in the user message',
        ],
        answer: 3,
        explanation: 'Mixing customer text into the instructions lets the customer change the rules. Keep instructions as yours and the customer’s words as separate user input.',
      },
      {
        id: 'building-ai-agents-10-q4',
        audience: { max: 'beginner' },
        prompt: 'Which sentence is the best example of a clear rule for a new helper at a shop counter?',
        choices: [
          'Be nice to everyone who comes into the shop today',
          'Say a staff member will reply when you are not sure',
          'Do a good job every day and try as hard as you can',
          'Try hard to answer every question the best you can',
        ],
        answer: 1,
        explanation: 'A clear rule says what to do in a situation you can name. “Be nice” and “do a good job” cannot be checked.',
      },
      {
        id: 'building-ai-agents-10-q5',
        audience: { min: 'advanced' },
        prompt: 'You edit one line of a long system prompt and the agent starts failing a case that used to pass. What process would have caught this?',
        choices: [
          'Read the changed prompt out loud before saving it, and ask a colleague whether it sounds right to them',
          'Ask the model to review its own prompt after the change and tell you whether it still looks good',
          'Keep the prompt in version control with test cases that run on every change and report a pass rate',
          'Add more rules to the prompt until the failing case passes again, then move on to the next task',
        ],
        answer: 2,
        explanation: 'A prompt is behaviour you can regress. Versioned instructions with regression cases catch a change that shifts behaviour somewhere you did not look.',
      },
    ],
    task: {
      title: 'Write and test instructions for your own agent',
      minutes: 18,
      steps: [
        'Run the code from this lesson. Then replace MIKA’s role, rules and tools with those of your own agent (a school helpdesk, a clinic desk, a shop of your own). Run it and read the prompt it builds.',
        'Run check_config on your version. Fix every problem it reports, and add one check of your own, such as a rule that no rule is longer than 25 words.',
        'Change it and observe: remove the hand-over line (when_unsure) and paste your prompt into an assistant you use. Send it a question outside your agent’s scope. Then put the line back and ask again. Note how the answers differ.',
        'Reflection: which of your rules would hurt someone if the model ignored it once? What code would you write so it still holds?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Keep to three rules and one hand-over line. Read the built prompt out loud and ask: could someone follow this without guessing?'] },
      { audience: { min: 'advanced' }, steps: ['Write five test messages for your agent (two normal, two out of scope, one that tries to change the rules). Define what a pass looks like for each, and note how you would run them after every edit to the instructions.'] },
    ],
  },
  {
    id: 'building-ai-agents-11',
    day: 11,
    title: 'Input and Output Processing',
    summary: 'Clean and limit what goes into the model, then parse, validate and, when needed, retry what comes out before your code acts on it.',
    intro: {
      objectives: [
        'Clean, limit and label the input before the model sees it',
        'Parse a model reply and validate it against a schema and a business rule',
        'Retry with the error message a limited number of times, then fall back safely',
      ],
      why: 'A model reply is text that looks right until the day it is not. The two doors, one for input and one for output, are where you stop bad data from crashing your code or triggering the wrong action.',
    },
    minutes: 24,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'The model replies, “Sure! Here is the JSON: …” and your program crashes on the first word. Or it replies with perfect JSON whose intent is a word you never defined, and your code books a repair for “refund”. Between the model and the rest of your system sit two doors: one for what goes in and one for what comes out. This lesson builds both.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel asked Mika’s agent to reply in JSON, a text format for labelled data such as {"intent": "hours"}. It worked on his fifty test messages. In the first week of real use, a customer pasted a six-thousand-word email thread, and the call was slow and expensive. Another message held an invisible control character that broke the log file. Once the model wrapped its JSON in a markdown code fence, and the program crashed when it tried to read it. And once it returned the intent “refund”, which was not in the list, so the router sent the customer to a function that did not exist. None of these was a model failure Joel could fix with a better prompt. Each one needed a check in code at one of the two doors.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Input processing** is everything done to a message before the model sees it. Clean it (remove control characters, trim spaces). Limit it (a maximum length). Pull out what you can read with plain code (a reference number). Refuse what is empty. And keep the customer’s words in the user message, treated as data, never mixed into your instructions. **Output processing** is everything done to the reply before your code acts on it: parse it, validate it against a **schema** (a description of the allowed shape: which keys, which types, which values are allowed), retry or fall back, and only then act.' },
      {
        type: 'table',
        headers: ['Door', 'Check', 'Example', 'If it fails'],
        rows: [
          ['Input', 'Clean', 'Strip control characters and extra spaces', 'Use the cleaned text'],
          ['Input', 'Limit', 'Keep at most 500 characters of a customer message', 'Cut it, or ask the customer to shorten it'],
          ['Output', 'Parse', 'Is the reply valid JSON?', 'Retry with the error, or fall back'],
          ['Output', 'Shape', 'Does it have intent, answer and needs_person, with the right types?', 'Retry with the error, or fall back'],
          ['Output', 'Rules', 'Is the intent one of the allowed values? Is a refund requested at all?', 'Never act. Hand over to a person'],
        ],
        caption: 'The last row is why a schema alone is not enough: some rules are about your business, not about shape.',
      },
      { type: 'diagram', format: 'mermaid', caption: 'The output door. A reply passes two checks before it is used. A failure adds its error to the messages and tries again, a limited number of times, then falls back to a person.', source: ['flowchart TD', '  A[Model reply as raw text] --> B{Valid JSON?}', '  B -->|no| E[Add the error to the messages]', '  B -->|yes| C{Right shape and allowed values?}', '  C -->|no| E', '  C -->|yes| D[Use the reply]', '  E --> F{Tries left?}', '  F -->|yes| A', '  F -->|no| G[Safe fallback: hand over to a person]'].join('\n') },
      { type: 'paragraph', text: 'The retry rule has three parts. Put the specific error in the retry (“intent must be one of hours, repair_status, other”), because a blind retry often repeats the mistake. Cap the retries at two or three, because each retry is another model call that costs time and money. And make the fallback a real, tested path: after the last try, the customer hears that a staff member will reply, and a person sees the case.' },
      { type: 'paragraph', text: 'Model vendors now offer ways to make the model follow a schema, which lowers the number of bad replies. You should use them where they exist, and you should still validate. A reply can be cut short, the model can refuse, and no schema can express a business rule such as “refunds are never done by the agent”. Treat the model’s reply, like the customer’s message, as untrusted data until it has passed your checks. Never run it as code, and never paste it into a shell command, a database query or a file path.' },
      { type: 'version', text: 'OpenAI’s structured outputs take a JSON schema through the text.format setting with strict mode, and the docs say your application must still handle refusals, incomplete responses and rules the schema cannot express. Anthropic’s structured outputs take the schema in output_config.format with type json_schema. Its docs say a refusal can return stop_reason refusal with output that does not match the schema, and that stop_reason max_tokens can cut the output short and break it. Field names and limits change, so read the current pages before you rely on them.', checked: CHECKED, sources: [DOCS.openaiStructured, DOCS.claudeStructured] },
      { type: 'paragraph', text: 'An analogy with its limit. The front door of a shop has a guard who stops anyone carrying something odd, and the back door has a clerk who checks each parcel before it leaves. You would not hand a parcel to a courier because it looks neat. The limit of the analogy: a parcel does not change its contents when you ask for a second look, but a model reply can, which is why a retry can work.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: JSON is a way to write information as labelled boxes, like {"intent": "hours"}. A program can read it only if it is written exactly right, the way a form is accepted only if every box is filled in properly. The model usually fills the form correctly, and sometimes writes a friendly note on top, or puts a word in a box that is not allowed. Your code is the clerk who checks the form. If it is wrong, the clerk hands it back and says exactly what is wrong. After a few tries, the clerk asks a person for help.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Treat validation as a contract between components. Version the schema, log the raw reply and the validation errors with sensitive text redacted, and track failure rates per rule. A rise in one rule often shows a prompt regression or a model change before users complain. Prefer feeding specific errors back over blind retries, cap retries and total latency, and test the fallback path as a first-class case. Where a check can be code, do not spend a second model call on judging the first. Apply the same discipline to tool arguments and tool results, which are the other untrusted inputs an agent handles.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will write an input cleaner, a reply validator and a retry loop that feeds scripted replies through them. The “model” here is just a list of prepared strings, so no key or network is needed. Python 3.10 or later, standard library only. Save the first block as processing.py, then add the second below it and run the file.' },
      { type: 'code', language: 'python', label: 'Python: input cleaning and reply validation (processing.py, part 1)', code: `import json

ALLOWED_INTENTS = ("hours", "repair_status", "other")


def clean_input(text: str, max_chars: int = 500) -> str:
    text = "".join(ch for ch in text if ch.isprintable() or ch == "\\n")
    return text.strip()[:max_chars]


def parse_reply(raw: str) -> tuple[dict | None, list[str]]:
    text = raw.strip()
    if text.startswith("\`\`\`"):
        text = text.strip("\`").removeprefix("json").strip()
    try:
        data = json.loads(text)
    except json.JSONDecodeError as error:
        return None, [f"not valid JSON: {error.msg}"]
    if not isinstance(data, dict):
        return None, ["the reply must be a JSON object"]
    errors = []
    if data.get("intent") not in ALLOWED_INTENTS:
        errors.append(f"intent must be one of {list(ALLOWED_INTENTS)}")
    if not isinstance(data.get("answer"), str) or not data["answer"].strip():
        errors.append("answer must be a non-empty string")
    if not isinstance(data.get("needs_person"), bool):
        errors.append("needs_person must be true or false")
    return (data if not errors else None), errors
` },
      { type: 'code', language: 'python', label: 'Python: the retry loop and a run with scripted replies (add this below part 1)', code: `def get_valid_reply(replies: list[str], max_tries: int = 3) -> dict:
    for attempt, raw in enumerate(replies[:max_tries], start=1):
        data, errors = parse_reply(raw)
        if data is not None:
            print(f"attempt {attempt}: accepted")
            return data
        print(f"attempt {attempt}: rejected -> {errors}")
        # A real agent would send these errors back to the model.
    return {"intent": "other", "answer": "A staff member will reply soon.", "needs_person": True}


GOOD = '{"intent": "hours", "answer": "We open 9:00 to 18:00.", "needs_person": false}'
SCRIPTED = [
    "Sure! We open at nine.",
    '{"intent": "refund", "answer": "Refund sent.", "needs_person": false}',
    "\`\`\`json\\n" + GOOD + "\\n\`\`\`",
]
print(repr(clean_input("  Is my bike ready?\\x07 Ref 4471  ")))
print(get_valid_reply(SCRIPTED))
print(get_valid_reply(SCRIPTED[:2]))
` },
      { type: 'paragraph', text: 'The important lines. **clean_input** keeps only printable characters, trims and cuts to a maximum length: this is the input door. **parse_reply** strips a code fence if the model added one, then tries to parse, and then checks three things: it is an object, the intent is allowed, the other fields have the right types. It returns the data or a list of plain-language errors, never both. **get_valid_reply** tries up to three replies and falls back to a safe answer for a person. The scripted list has a chatty reply, a reply with a forbidden intent and a fenced good reply, so you see all three outcomes.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'Reading the code line by line. clean_input goes through each character and keeps the ones you can see on screen, so the invisible beep character disappears. The text is then trimmed and cut to 500 characters. In parse_reply, json.loads tries to turn the text into a dictionary, which is a set of labelled boxes. If the text is not proper JSON, Python raises an error, and the code catches it and returns a message instead of crashing. The three if lines check one box each. get_valid_reply loops through the prepared replies, stops at the first good one, and prints why each bad one was rejected.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run with Python 3.13 on 2026-11-18)', code: `'Is my bike ready? Ref 4471'
attempt 1: rejected -> ['not valid JSON: Expecting value']
attempt 2: rejected -> ["intent must be one of ['hours', 'repair_status', 'other']"]
attempt 3: accepted
{'intent': 'hours', 'answer': 'We open 9:00 to 18:00.', 'needs_person': False}
attempt 1: rejected -> ['not valid JSON: Expecting value']
attempt 2: rejected -> ["intent must be one of ['hours', 'repair_status', 'other']"]
{'intent': 'other', 'answer': 'A staff member will reply soon.', 'needs_person': True}
` },
      { type: 'list', items: [
        'If you see AttributeError: removeprefix: your Python is older than 3.9. Use 3.10 or later.',
        'If attempt 3 is rejected as not valid JSON: the fenced reply must keep its closing line break and fence exactly as in the code. Check the quotes around the third item of SCRIPTED.',
        'If you see NameError for parse_reply: the second block was pasted above the first. Put it below.',
        'If a real model’s reply is rejected again and again: print the raw text and the errors. Often the fix is a clearer format line in the instructions (lesson 10) rather than more retries.',
      ] },
      { type: 'warning', text: 'Never run a model’s reply as code and never put it unchecked into a shell command, a database query or a file path. Check intents against an allow-list of values, as ALLOWED_INTENTS does. Do not log raw customer messages without a plan to protect them, and cap the input length, because a very long message also costs money on every call.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: add a fourth intent and a rule of your own (for example, “answer must be under 60 words”) to parse_reply, and run the three scripted replies again.',
        'Next lesson, “Planning and Task Decomposition”, shows how an agent splits a request into steps, and how you can validate that plan in the same way.',
        'Module 3 returns to structured output with the pydantic library and the vendors’ own schema features.',
      ] },
      { type: 'takeaways', items: [
        'Input processing cleans, limits and labels what the model sees. Output processing parses, validates and decides what is allowed.',
        'A reply must pass three checks before your code acts: valid format, right shape, and your business rules.',
        'Retry with the specific error, cap the number of tries, and make the fallback a tested path to a person.',
        'Vendor schema features help, but you still validate, because refusals, truncation and business rules remain.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-11-fix-bug-1',
          kind: 'fix-bug',
          title: 'The reply that is “fine” when it is not',
          prompt: 'This validator should report an error when the reply is not valid JSON. It says everything is fine instead. Tap the buggy line, then choose the fix. The model that produces replies is not part of this code: the test passes sample replies in.',
          concept: 'output validation',
          language: 'javascript',
          code: [
            'function parseReply(text) {',
            '  try {',
            '    const data = JSON.parse(text);',
            "    if (typeof data.intent !== 'string') {",
            "      return { ok: false, error: 'intent must be a string' };",
            '    }',
            '    return { ok: true, data };',
            '  } catch (e) {',
            '    return { ok: true, data: null };',
            '  }',
            '}',
          ].join('\n'),
          bugLine: 9,
          fixes: [
            { line: "    return { ok: false, error: 'not valid JSON' };", correct: true, why: 'A reply that cannot be parsed must be reported as not ok, with a clear error that can go back to the model.' },
            { line: '    return { ok: false, data: null };', correct: false, why: 'The result is not ok, which is right, but it has no error message, so there is nothing to send back to the model.' },
            { line: '    return { ok: true, data: {} };', correct: false, why: 'This hides the failure behind an empty object. The caller would act on data that does not exist.' },
            { line: '    throw e;', correct: false, why: 'Throwing the error crashes the caller on the first chatty reply, which is the bug you are trying to prevent.' },
          ],
          tests: {
            kind: 'function',
            fn: 'parseReply',
            cases: [
              { label: 'a good reply', args: ['{"intent":"hours"}'], expected: { ok: true, data: { intent: 'hours' } } },
              { label: 'a chatty reply', args: ['Sure! We open at nine.'], expected: { ok: false, error: 'not valid JSON' } },
              { label: 'the wrong type', args: ['{"intent":5}'], expected: { ok: false, error: 'intent must be a string' } },
              { label: 'an empty reply', args: [''], expected: { ok: false, error: 'not valid JSON' }, hidden: true },
            ],
          },
          hints: [
            'Look at the catch block. It runs when the text is not valid JSON.',
            'What does the catch block tell the caller? It says ok: true.',
            'Return ok: false with the error message not valid JSON.',
          ],
          explanation: 'The catch block is the failure path, so it must say the reply failed and why. Reporting ok on a parse error hides exactly the bad replies the validator exists to catch.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-11-scenario-1',
          kind: 'scenario',
          title: 'A valid reply that asks for something not allowed',
          prompt: 'Choose the best way to handle this reply.',
          concept: 'validating business rules, not only shape',
          situation: 'The model replies with perfect JSON: intent “refund”, answer “Refund sent.”, needs_person false. The schema is satisfied, but your agent’s allowed intents are hours, repair_status and other, and the agent can never send refunds. The same message arrived at a busy time.',
          options: [
            { text: 'Reject it at the rules check, add the allowed intents to the retry message once, and if it fails again hand the case to a person. Log the rejection.', consequence: 'The false “refund sent” never reaches the customer. A retry has a good chance of fixing it, and a person sees the cases that keep failing.', quality: 'best' },
            { text: 'Reject it and hand the case straight to a person without a retry.', consequence: 'This is safe. It costs a person’s time for a case a single retry might have fixed.', quality: 'acceptable' },
            { text: 'Send it, because the JSON is valid and the schema is satisfied.', consequence: 'The customer is told a refund was sent. None was. A valid shape does not mean a valid decision.', quality: 'poor' },
            { text: 'Change the intent to “other” in code and send the answer text as it is.', consequence: 'The intent is now allowed, but the answer still says “Refund sent.” The check only repaired a label and left the false claim.', quality: 'poor' },
          ],
          hints: [
            'The shape is right. What is wrong with the content?',
            'Which door should stop a reply that breaks a business rule?',
            'Reject, explain the rule once, and fall back to a person if it fails again.',
          ],
          explanation: 'A schema checks shape, not meaning. The rule that the agent cannot refund belongs in code at the output door. Retry with the error once, then fall back safely, and keep the log.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-11-q1',
        prompt: 'A reply arrives wrapped in a markdown code fence and your program crashes when it reads it. Which change fixes the class of problem rather than this one reply?',
        choices: [
          'Add “never use code fences” to the instructions and assume that this settles the problem for good',
          'Retry the same request over and over until a reply comes back without any code fence',
          'Switch to a different model and hope that it never wraps its replies in code fences',
          'Read replies with a function that handles fences and reports parse errors instead of crashing',
        ],
        answer: 3,
        explanation: 'A reply you did not expect will arrive eventually, so the reading code must survive it. Instructions and retries reduce the chance, but only code that handles every reply is robust.',
      },
      {
        id: 'building-ai-agents-11-q2',
        prompt: 'Your schema requires intent, answer and needs_person. A reply passes with intent “discount”, which is a valid string. Your agent never discounts. What was missing?',
        choices: [
          'A longer schema with more keys, so that the reply has more fields to check',
          'A business rule check that the intent is one of the values your agent allows',
          'A second model call that asks whether the first reply looks correct before it is used',
          'A larger max token limit, so that the reply is never cut short before the intent',
        ],
        answer: 1,
        explanation: 'A schema describes shape. Which values your agent may act on is a rule about your business, and plain code can check it without another model call.',
      },
      {
        id: 'building-ai-agents-11-q3',
        prompt: 'A validator rejects a reply, and your loop retries with the same request, unchanged, up to ten times. What is the better design?',
        choices: [
          'Send the specific error with the retry, cap tries at two or three, then fall back to a person',
          'Keep ten tries but wait longer between them, so that the model has more time to think of a fix',
          'Keep the request unchanged and raise the number of tries until some reply finally passes the check',
          'Skip validation on the last try so that the user always receives some kind of answer at the end',
        ],
        answer: 0,
        explanation: 'A specific error gives the model something to correct. A cap stops the cost from growing, and a fallback guarantees a safe end. Skipping validation defeats the point of having it.',
      },
      {
        id: 'building-ai-agents-11-q4',
        audience: { max: 'beginner' },
        prompt: 'In the form-checking analogy, what does your code do when the model’s form has a word in a box that is not allowed?',
        choices: [
          'Accepts it as it is, because the form is mostly right and the other boxes all look fine',
          'Throws the whole form away and says nothing, so the model has to guess what was wrong',
          'Hands it back and says exactly which box is wrong; after a few tries it asks a person',
          'Fills in the wrong box itself with its best guess, so that the form can still be used',
        ],
        answer: 2,
        explanation: 'A clear error lets the model fix its mistake, and a limit with a person at the end keeps the process from going on forever or acting on a bad form.',
      },
      {
        id: 'building-ai-agents-11-q5',
        audience: { min: 'advanced' },
        prompt: 'After a prompt change, the share of replies rejected by one validation rule rises from rare to common. What should that tell you?',
        choices: [
          'The validator is too strict, so the rule should be removed to let more replies through',
          'The prompt change probably shifted model behaviour, so compare before and after on your tests',
          'Customers have started sending harder questions than they did before the change was made',
          'Nothing in particular, since rejected replies are retried and so the customer never sees them',
        ],
        answer: 1,
        explanation: 'A jump in one rule’s failure rate right after a change is a regression signal. Tracking failure rates per rule is how you notice it before customers do.',
      },
    ],
    task: {
      title: 'Build a reply validator for your own agent',
      minutes: 20,
      steps: [
        'Save and run the code from this lesson. Confirm your output matches the expected output.',
        'Add a fourth key to the schema for your own agent (for example “follow_up”, a true or false value) and a rule of your own (for example, “answer must be under 60 words”). Add a scripted reply that breaks each new check.',
        'Change it and observe: set max_tries to 1, then to 5, and run both. Note which scripted replies are accepted in each case and what the fallback says.',
        'Reflection: which of your agent’s possible replies would be harmful if it were acted on without a business rule check, and have you covered it?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before adding code, write the form on paper: the boxes (keys) of your agent’s reply and, for each box, what is allowed. Then make the code match your paper.'] },
      { audience: { min: 'advanced' }, steps: ['Replace the hand-written checks with a schema validation library of your choice, keep the business rules as separate code, and write five test cases. Then write down how you would measure the rejection rate per rule in production.'] },
    ],
  },
  {
    id: 'building-ai-agents-12',
    day: 12,
    title: 'Planning and Task Decomposition',
    summary: 'Split a request into steps with clear results, decide between planning up front and planning as you go, and check a plan in code before it runs.',
    intro: {
      objectives: [
        'Break a request into steps that each have one action and a clear result',
        'Choose between a plan written up front and a step chosen as the agent goes',
        'Validate a plan in code and handle a step that fails',
      ],
      why: 'Many real requests have several steps with an order that matters. An agent that acts before it plans can change the wrong thing. A habit of small, checkable steps is also what makes an agent’s behaviour testable.',
    },
    minutes: 20,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'A customer writes to Mika’s agent: “Move my repair to Friday and tell me if the price changes.” That is not one step. It is five, and the order matters. What should the agent do first? This lesson shows how to split a goal into steps, how to decide whether to write the whole list first, and how to check the list before anything runs.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel gave the agent exactly that request. It had no plan. The model’s first move was to call the update tool with a booking id it had guessed, and Friday was already full. The booking moved anyway, to a day with no space in the workshop. Joel changed the design. The agent now writes a short plan first: find the booking, check Friday’s slot, move it only if the slot is free, compare the price, then reply. Code checks the plan before it runs: at most six steps, only allowed tools, and no step that needs a result from a later step. If a step fails, the agent revises the rest of the plan, at most twice, and then hands the case to a person.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Planning** means deciding the steps before acting or while acting. **Task decomposition** means splitting a goal into smaller steps, each with a clear result. There are two common styles, and the choice between them is a trade-off, not a rule.' },
      {
        type: 'table',
        headers: ['', 'Plan up front', 'Plan as you go'],
        rows: [
          ['How it works', 'The model writes the whole list, then your code runs it step by step', 'The model picks one step, sees the result, then picks the next (the loop in lesson 13)'],
          ['Good when', 'The steps are fairly clear from the request and the order matters', 'What to do next depends on what the last step found'],
          ['Cost', 'One extra model call, and the plan can go stale after a failure', 'Every step is a model call, and the agent can wander without a plan'],
          ['Typical failure', 'A plausible plan that is wrong, or a step that depends on a later one', 'Repeated or pointless steps, and no sense of the whole goal'],
        ],
        caption: 'Many agents mix both: a short plan up front, with the freedom to revise it after a failure.',
      },
      { type: 'diagram', format: 'mermaid', caption: 'The plan for “move my repair to Friday and tell me if the price changes”. Each box is one action. The dotted arrow is the branch the plan must handle: the slot is full.', source: ['flowchart TD', '  G[Goal: move repair 4471 to Friday and report any price change]', '  A[1 Find the booking]', '  B[2 Check the Friday slot]', '  C[3 Move the booking]', '  D[4 Compare the old and new price]', '  E[5 Reply to the customer]', '  F[Slot full: ask the customer for another day]', '  G --> A', '  A --> B', '  B --> C', '  C --> D', '  D --> E', '  B -.->|slot full| F'].join('\n') },
      { type: 'paragraph', text: 'A good step has four things: one action, the tool that does it, a **done-criterion** (how you know it worked, such as “a booking record is returned”), and what to do if it fails. Keep a plan as data, not as a paragraph, so your code can read it and check it.' },
      { type: 'code', language: 'json', label: 'A plan as data (the first three steps)', code: `[
  {"id": 1, "do": "Find the booking for ref 4471", "tool": "lookup_repair", "done_when": "a booking record is returned", "needs": []},
  {"id": 2, "do": "Check whether Friday has a free slot", "tool": "check_slot", "done_when": "the answer is free or full", "needs": [1]},
  {"id": 3, "do": "Move the booking to Friday", "tool": "move_booking", "done_when": "the tool returns a booking id", "needs": [1, 2]}
]` },
      { type: 'paragraph', text: 'The plan is a proposal, like every model output. A plan can be fluent and wrong. So check it in code before running any step: no more than your step cap, every tool on the allow-list, every step’s needs point to earlier steps, and nothing that changes data (such as moving a booking) before the step that checks it is safe. When a step fails, stop and decide: retry it, revise the remaining steps, or hand over. Cap the revisions, or the agent can spend its whole budget rewriting plans.' },
      { type: 'paragraph', text: 'Planning has a price: one more model call, and more delay before the first action. Keep plans short, usually no more than five or six steps, because a long plan is more likely to hold a wrong step and is harder for code to check. Skip planning when the steps never change. If every “change my booking” request follows the same five steps, write them as a fixed workflow in your code. It is cheaper, faster and easier to test than a plan the model rewrites each time. Module 7 returns to planning in depth, with reasoning loops and bounded execution. Here the goal is the habit: small steps, clear results, and a check before acting.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: planning is like writing a to-do list before a trip. “Book the bus, pack a bag, tell Mum” is a plan. Each line is one thing you can tick off, and you can see that some lines must come before others: you cannot tell Mum the bus time until you booked the bus. An agent does the same. The model writes the list, and your code checks it before anything is done. If the bus is full, the list is changed and you carry on, or you ask someone for help.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Errors compound across steps. As a made-up illustration, if each step works 95 times out of 100 and the steps are independent, five steps in a row all work about 77 times out of 100 (0.95 to the power of 5). So prefer fewer steps, make steps idempotent, and put checks between them. Represent plans as a dependency graph so independent steps can run in parallel, and treat a plan that has gone stale after a tool result as a normal event, not an exception. Persist progress after each step so a crash resumes rather than restarts, and keep plan generation separate from execution so each can be tested and logged on its own.' },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: 'Choose three requests that a customer of Mika’s shop, or of your own shop or service, might send. Write a plan for each as data on paper or in a file, with at most six steps. Use the fields from the code block above: do, tool, done_when and needs.' },
      { type: 'list', ordered: true, items: [
        'For each plan, mark any step that changes something (books, sends, pays). Check that a step that only reads comes before it.',
        'For each plan, write what the agent does if step 2 fails.',
        'Circle any plan whose steps would be the same every time. Those are fixed workflows. They do not need a planning call.',
      ] },
      { type: 'prompt', label: 'Review my plan', text: 'Here is a plan for the request “[your request]”, written as data: [paste your plan]. Review it as a careful engineer. Which step depends on information not yet gathered? Which step has no done-criterion? Does any step change something before checking it is safe? What should happen if each step fails? Do not rewrite the plan. Ask me questions and list your concerns.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: finish the three plans and mark which ones should be fixed workflows.',
        'Next lesson, “Agent Execution Loops”, builds the loop that carries out one step at a time, and the limits that keep it from running away.',
        'Keep your plan for the booking example: in lesson 13 you will see how a loop could run it.',
      ] },
      { type: 'takeaways', items: [
        'Planning splits a goal into small steps, each with one action, a tool, a done-criterion and a failure rule.',
        'Plan up front when the steps are clear, and choose the next step as you go when each result decides what comes next. Many agents mix both.',
        'A plan is a proposal. Check it in code: step cap, allowed tools, correct order, and reads before writes.',
        'If the steps never change, write a fixed workflow. It is cheaper and easier to test than a plan the model writes each time.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-12-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Plan the Friday move',
          prompt: 'Build the workflow for “Move my repair to Friday and tell me if the price changes”. Pick the steps and put them in order. The rules tell you what must come first and what must never happen.',
          concept: 'task decomposition with checks before actions',
          situation: 'Mika’s agent gets this message: “Move my repair 4471 to Friday and tell me if the price changes.” The shop can fit only a few jobs a day. The agent must never move a booking to a full day, and the customer must agree to a new price before anything changes.',
          parts: [
            { id: 'receive-request', lane: 'input', label: 'Receive and clean the request', detail: 'The message arrives and is cleaned and length-limited.' },
            { id: 'plan-steps', lane: 'ai', label: 'Model writes a short plan', detail: 'The model splits the request into steps with tools and done-criteria.' },
            { id: 'find-booking', lane: 'tool', label: 'Look up the booking by reference', detail: 'A read-only tool returns the booking and the current price.' },
            { id: 'check-slot', lane: 'tool', label: 'Check whether Friday has a free slot', detail: 'A read-only tool says whether Friday is free or full.' },
            { id: 'move-booking', lane: 'tool', label: 'Move the booking to Friday', detail: 'A tool that changes the booking and returns a booking id.' },
            { id: 'guess-slot', lane: 'ai', label: 'Model assumes Friday is free', detail: 'The model skips the check and carries on as if the slot were free.' },
            { id: 'ask-customer', lane: 'human', label: 'Customer confirms the new day and price', detail: 'The agent shows the new day and price and waits for a yes.' },
            { id: 'send-reply', lane: 'output', label: 'Send the confirmation with the booking id', detail: 'The reply states the change and includes the id from the tool.' },
          ],
          rules: [
            { id: 'needs-lookup', kind: 'require', parts: ['find-booking'], message: 'Find the booking first: without it the agent does not know the current day or price.' },
            { id: 'needs-slot-check', kind: 'require', parts: ['check-slot'], message: 'Check the slot. Moving a booking to a full day is the exact mistake to avoid.' },
            { id: 'no-guessing', kind: 'forbid', parts: ['guess-slot'], message: 'Never let the model assume a slot is free. A read-only tool checks it.' },
            { id: 'check-before-move', kind: 'before', parts: ['check-slot', 'move-booking'], message: 'Check the slot before you move the booking.' },
            { id: 'confirm-before-move', kind: 'before', parts: ['ask-customer', 'move-booking'], message: 'The customer must agree to the new price before the booking changes.' },
            { id: 'needs-customer', kind: 'require', parts: ['ask-customer'], message: 'A person must say yes before a change that can cost them money.' },
          ],
          solution: ['receive-request', 'plan-steps', 'find-booking', 'check-slot', 'ask-customer', 'move-booking', 'send-reply'],
          minSteps: 5,
          maxSteps: 8,
          simulation: {
            input: 'Move my repair 4471 to Friday and tell me if the price changes.',
            steps: {
              'receive-request': 'The message is cleaned and the reference 4471 is found.',
              'plan-steps': 'The model proposes five steps. Code checks the cap and the allowed tools.',
              'find-booking': 'The booking is found: Thursday, current price on file.',
              'check-slot': 'Friday has one free slot.',
              'ask-customer': 'The agent shows Friday and the price, and the customer says yes.',
              'move-booking': 'The booking is moved and the tool returns booking id B-4471-F.',
              'send-reply': 'The customer is told: moved to Friday, price unchanged, booking id B-4471-F.',
            },
            output: 'The booking is on Friday. The reply includes the booking id returned by the tool.',
          },
          hints: [
            'What must the agent know before it can change anything?',
            'Reads come before writes. Which two tools only read?',
            'Put the customer’s yes before the tool that moves the booking, and leave out the step where the model assumes.',
          ],
          explanation: 'Read-only steps come first, the customer agrees before anything changes, and the booking is moved only after the slot is checked. The step where the model assumes Friday is free breaks the rule the whole plan exists to keep.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-12-predict-output-1',
          kind: 'predict-output',
          title: 'Which step runs when?',
          prompt: 'This program runs a plan as data. A step may run once all the steps it needs are done. Plan order is not run order. What does it print? (No model is involved: the plan is fixed.)',
          concept: 'dependencies decide run order',
          language: 'javascript',
          code: [
            'const plan = [',
            "  { id: 'find', needs: [] },",
            "  { id: 'check_slot', needs: ['find'] },",
            "  { id: 'update', needs: ['find', 'check_slot'] },",
            "  { id: 'tell', needs: ['update', 'price'] },",
            "  { id: 'price', needs: ['find'] },",
            '];',
            'const done = [];',
            'for (let round = 0; round < 3; round++) {',
            '  for (const step of plan) {',
            '    if (done.includes(step.id)) continue;',
            '    if (step.needs.every((n) => done.includes(n))) done.push(step.id);',
            '  }',
            '}',
            "console.log(done.join(' > '));",
          ].join('\n'),
          expected: 'find > check_slot > update > price > tell',
          choices: [
            'find > check_slot > update > price > tell',
            'find > check_slot > update > tell > price',
            'find > price > check_slot > update > tell',
            'find > check_slot > update',
          ],
          wrongNotes: {
            'find > check_slot > update > tell > price': 'tell needs price, so it cannot run before price is done.',
            'find > price > check_slot > update > tell': 'Within a round the plan is read from top to bottom. check_slot comes before price in the list, so it runs first.',
            'find > check_slot > update': 'The loop runs three rounds, so steps that become ready in a later round also run.',
          },
          hints: [
            'In round 1, go down the list. A step runs if everything it needs is already in done, including steps added a moment ago in the same round.',
            'tell needs price, and price is below tell in the list.',
            'tell has to wait for round 2, because price is only added to done in round 1 after tell was checked.',
          ],
          explanation: 'Run order follows dependencies, not list order. tell waits for price, which is why a check that every needs entry is satisfiable (and not circular) is part of validating a plan.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-12-q1',
        prompt: 'An agent’s plan for “move my repair to Friday” has these steps in order: move the booking, check the slot, tell the customer. What is wrong with this plan?',
        choices: [
          'It changes data (moves the booking) before the check that says whether the change is safe',
          'It has too few steps to be called a real plan, so a longer plan would be safer',
          'It should finish with a second move step, to be sure that the booking was really moved',
          'The plan should be written by the customer, not by the model, so that it matches what they want',
        ],
        answer: 0,
        explanation: 'A step that changes something must come after the read-only step that checks it is safe. A plan validator in code can enforce this order.',
      },
      {
        id: 'building-ai-agents-12-q2',
        prompt: 'Mika’s shop gets the same request about thirty times a week: look up a repair by reference and tell the customer its status. Which design fits best?',
        choices: [
          'A planning step on every request, so that the model can write a fresh plan each and every time',
          'A multi-agent team, with one agent for planning and a second agent for the lookups',
          'A free-running loop that decides each step as it goes, with no fixed order between them',
          'A fixed two-step workflow in code, with a model call only to word the reply if needed',
        ],
        answer: 3,
        explanation: 'The steps never change, so a fixed workflow is cheaper, faster and easier to test than any design that plans. Planning, extra agents and free-running loops add cost and failure modes for no benefit here.',
      },
      {
        id: 'building-ai-agents-12-q3',
        prompt: 'A plan has five steps and step 3 fails. Which response is best?',
        choices: [
          'Retry step 3 again and again until it finally succeeds, however long that takes and however much it costs',
          'Skip step 3 and run steps 4 and 5 as planned, since they might still work without its result',
          'Decide whether to retry, revise the rest or hand over, and cap how often the plan is revised',
          'Delete the plan and start again from step 1 each time, with no limit on how many restarts',
        ],
        answer: 2,
        explanation: 'A failure needs a decision and a limit. Unlimited retries or revisions can burn the budget, and skipping a failed step can leave later steps without what they need.',
      },
      {
        id: 'building-ai-agents-12-q4',
        audience: { max: 'beginner' },
        prompt: 'In the to-do list analogy, why can you not tell Mum the bus time before booking the bus?',
        choices: [
          'Mum does not like to be told about the bus before the other jobs on the list are done',
          'The bus time is only known once the bus is booked: one step needs another step’s result',
          'Booking the bus is the longest step on the list, so it always has to come first',
          'To-do lists must always be written in alphabetical order so that nothing is forgotten',
        ],
        answer: 1,
        explanation: 'Some steps depend on the result of an earlier step. Putting them in the right order, and checking it, is a big part of planning.',
      },
      {
        id: 'building-ai-agents-12-q5',
        audience: { min: 'advanced' },
        prompt: 'A plan has eight steps and each step works reliably most of the time, yet end-to-end success is much lower than any single step. What is the best design response?',
        choices: [
          'Add more steps to the plan, so that there are more chances to recover from a failed step',
          'Raise the temperature setting, so that the model tries a wider range of different approaches',
          'Run every step twice and use the second result whenever the two results are not the same',
          'Use fewer steps, make them safe to repeat, check between them and save progress to resume',
        ],
        answer: 3,
        explanation: 'Success rates multiply across steps. Fewer steps, checks between them and resumable progress attack the compounding directly. More steps or blind repeats make it worse.',
      },
    ],
    task: {
      title: 'Write and validate a plan',
      minutes: 18,
      steps: [
        'Pick a request with at least three steps (for example, rescheduling a booking, or planning a day trip). Write the plan as data with do, tool, done_when and needs for each step.',
        'Write down five checks a plan validator should make before running it (for example, a step cap and the order of reads before writes).',
        'Change it and observe: ask an assistant you use for a plan for the same request twice, once with “plan carefully” and once with “plan in at most four steps, and put checks before any change”. Compare the two plans and note which steps changed.',
        'Reflection: which of your five checks would have caught the most expensive mistake, and what would the plan look like if it were a fixed workflow?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Start with a plan for something you do every day, such as making breakfast, and write each step with how you know it is done. Then do the same for a request to an agent.'] },
      { audience: { min: 'advanced' }, steps: ['Write the validator as code: step cap, tool allow-list, no forward references in needs, no cycles, and no writing step before its check. Write three plans that should fail and one that should pass.'] },
    ],
  },
  {
    id: 'building-ai-agents-13',
    day: 13,
    title: 'Agent Execution Loops',
    summary: 'Write the loop that asks the model, runs the tool it requests, feeds the result back and stops at a limit, and test it with a scripted model.',
    intro: {
      objectives: [
        'Write an agent loop that runs tools and feeds each result back to the model',
        'Stop the loop with a step limit and other stop conditions',
        'Test a loop for free with a scripted model, including a model that gets stuck',
      ],
      why: 'The loop is the heart of every agent, and a missing limit is the cheapest way to lose money or time. A loop you can test with a scripted model is a loop you can trust before it meets a real one.',
    },
    minutes: 25,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'An agent is mostly a loop of about ten lines. What happens if one of those lines is missing? The agent runs forever and sends you the bill. In this lesson you write the loop yourself, with a scripted stand-in for the model, so you can see every step, break it on purpose and test it without paying for a single model call.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel’s first loop for Mika’s agent was while True: ask the model, run what it asks, repeat. A customer asked about a day the shop did not list. The lookup tool answered “unknown day”. The model asked for the same tool with the same arguments again, and again. Joel watched it make forty calls in a minute before he closed his laptop to stop it. There was no step limit, and nothing noticed that the same request kept coming back. He added a limit of six steps, a record of every tool call, and a rule: if the same tool is requested with the same arguments twice in a row, stop and hand the case to a person. Then he wrote tests that used a scripted model, so the stuck case could be run in a second at no cost.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'The **agent loop** (also called the execution loop) repeats one cycle until something tells it to stop. Each turn does the same things in the same order.' },
      { type: 'list', ordered: true, items: [
        'Send the messages so far, and the tool list, to the model.',
        'Read the reply. If it is a final answer, stop and return it.',
        'If it asks for a tool, check the tool is on your allow-list and the arguments are valid.',
        'Run the tool. Its result is the **observation**.',
        'Add the observation to the messages, so the model sees it on the next turn.',
        'Check the stop conditions. If none applies, go back to step 1.',
      ] },
      { type: 'visual', id: 'ai-agent-loop', caption: 'The loop with tools and an approval step. Follow one request round and watch where the observation goes back to the model.' },
      {
        type: 'table',
        headers: ['Stop condition', 'Why you need it', 'What to return'],
        rows: [
          ['A final answer', 'The goal is met, which is the normal ending', 'The answer'],
          ['A step limit', 'A model can ask for tools forever, and each turn costs time and money', 'A clear status such as step_limit, and the trace of what happened'],
          ['A repeated call', 'The same tool with the same arguments again means the agent is stuck', 'Stop, and hand over to a person'],
          ['An error budget', 'Several tool failures in a row mean a plan is not working', 'Stop with the errors listed'],
          ['A time or cost limit', 'A slow tool or a long conversation can run past what you meant to spend', 'A partial result and a status that says why it stopped'],
        ],
        caption: 'A loop with only the first row can run forever. Every row after the first is a safety limit that you write in code.',
      },
      { type: 'paragraph', text: 'The loop costs more than it looks. Every turn is a model call, so time and cost grow with the number of turns. Because the whole history is sent each time, each turn is also bigger than the one before it. A fixed workflow with one or two model calls is cheaper and easier to test, and it is the right baseline when the steps are known. Use a loop when the next step really depends on what the last tool returned.' },
      { type: 'paragraph', text: 'Test the loop with a **scripted model**: a plain function or class that returns prepared replies in order. It is a teaching stand-in, not a model, and it says nothing about how a real model will behave. What it can prove is that your loop logic is right: that it stops at the limit, handles an unknown tool, and feeds results back. Write at least four cases: a run that finishes, a run that gets stuck, a request for a tool that does not exist, and a request with wrong arguments. Later, replay a failure you saw with a real model by turning its trace into a script.' },
      { type: 'version', text: 'The vendor docs show one round of the loop and tell you to repeat it. With OpenAI’s Responses API you run create, execute each function_call item, append a function_call_output for it and call create again, until a response has no function_call items. With Anthropic’s Messages API you repeat while stop_reason is tool_use: append the assistant content, then one user message with a tool_result block for each tool_use block. The step limit is yours to add: the doc samples are single rounds. The SDKs also offer helpers that run the loop for you (Anthropic’s tool runner is marked beta in the SDK docs); Module 9 covers them.', checked: CHECKED, sources: [DOCS.openaiFunctions, DOCS.claudeHandleCalls, DOCS.claudePython] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: the loop is a clerk following a checklist. Ask the model what to do. If the model asks for a tool, use the tool and tell the model what came back. Ask again. Stop when the model gives the final answer, or when you have asked six times, because a clerk who keeps asking forever never gets to go home. The scripted model in this lesson is like a practice partner who reads out answers from a card, so you can check that the checklist works without a real clerk.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Model the loop as a state machine with explicit terminal states: done, step_limit, repeated_call, tool_error_budget, timeout and refused. Count steps, tokens and wall-clock time separately, and stop on whichever limit comes first. Detect repeated (tool, arguments) pairs and treat them as stuck. Make tool calls idempotent or guard them with request ids, because a retry after a timeout may repeat a side effect. Return a structured result with the full trace, so a failing production run can be replayed against a scripted model in a test. Several tool requests in one reply count as one step but several actions, so budget them too.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will build the loop with a scripted model, one allowed tool and a step limit, then run it twice: once with a model that finishes and once with a model that gets stuck. Python 3.10 or later, standard library only. Save the first block as loop_demo.py, then add the second below it and run the file.' },
      { type: 'code', language: 'python', label: 'Python: the tool, the allow-list and the scripted model (loop_demo.py, part 1)', code: `HOURS = {"monday": "9:00-18:00", "sunday": "closed"}


def get_hours(day: str) -> str:
    return HOURS.get(day.lower(), "unknown day")


TOOLS = {"get_hours": get_hours}  # the allow-list: only these can run


class ScriptedModel:
    """A teaching stand-in, not a model: it returns prepared replies in order."""

    def __init__(self, script: list[dict]):
        self.script = script
        self.position = 0

    def next_reply(self, messages: list[dict]) -> dict:
        reply = self.script[self.position % len(self.script)]
        self.position += 1
        return reply
` },
      { type: 'code', language: 'python', label: 'Python: the loop and two runs (add this below part 1)', code: `def run_agent(question: str, model: ScriptedModel, max_steps: int = 5) -> dict:
    messages = [{"role": "user", "content": question}]
    for step in range(1, max_steps + 1):
        reply = model.next_reply(messages)
        if reply["type"] == "final":
            return {"status": "done", "steps": step, "answer": reply["text"]}
        tool = TOOLS.get(reply["name"])
        if tool is None:
            result = f"error: no tool named {reply['name']}"
        else:
            try:
                result = tool(**reply["args"])
            except TypeError:
                result = "error: wrong arguments"
        print(f"step {step}: {reply['name']}({reply['args']}) -> {result}")
        messages.append({"role": "tool", "content": result})
    return {"status": "step_limit", "steps": max_steps, "answer": None}


finishes = ScriptedModel([
    {"type": "tool_call", "name": "get_hours", "args": {"day": "monday"}},
    {"type": "final", "text": "We open 9:00-18:00 on Monday."},
])
stuck = ScriptedModel([{"type": "tool_call", "name": "get_hours", "args": {"day": "monday"}}])
print(run_agent("When do you open on Monday?", finishes))
print(run_agent("When do you open on Monday?", stuck, max_steps=3))
` },
      { type: 'paragraph', text: 'The important lines. **TOOLS** is the allow-list: a name the model asks for runs only if it is a key here. **ScriptedModel** returns the next prepared reply and cycles when the script ends, which makes the “stuck” model easy to write. In **run_agent**, the for loop is the step limit: it can never run more than max_steps turns. A final reply returns at once. A tool request is looked up in TOOLS. An unknown name or wrong arguments become an error text instead of a crash, and that text is added to the messages like any observation. The last line of the loop adds the result to the messages, which is how the model would see it on the next turn.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'Reading the code line by line. HOURS is a small table of opening hours. get_hours looks up a day in it. TOOLS lists the only jobs the agent may do. The class ScriptedModel holds a list of prepared answers and hands them out one by one. In run_agent, for step in range(1, max_steps + 1) counts turns from 1 up to the limit. Each turn asks the model for a reply. If it is a final answer, we are done. If it asks for a tool, we look the tool up, run it, print what happened and add the result to the messages. If we run out of turns, the function says step_limit instead of going on forever.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run with Python 3.13 on 2026-11-18)', code: `step 1: get_hours({'day': 'monday'}) -> 9:00-18:00
{'status': 'done', 'steps': 2, 'answer': 'We open 9:00-18:00 on Monday.'}
step 1: get_hours({'day': 'monday'}) -> 9:00-18:00
step 2: get_hours({'day': 'monday'}) -> 9:00-18:00
step 3: get_hours({'day': 'monday'}) -> 9:00-18:00
{'status': 'step_limit', 'steps': 3, 'answer': None}
` },
      { type: 'list', items: [
        'If the stuck run never ends: check that the loop is for step in range(1, max_steps + 1) and that you passed max_steps=3. A while True loop has no limit.',
        'If you see KeyError: ‘name’ or ‘text’: a prepared reply is missing a key. A tool_call needs name and args, and a final reply needs text.',
        'If you see NameError for run_agent or TOOLS: the second block was pasted above the first, or part 1 was not saved in the same file.',
        'If a tool answers “error: wrong arguments”: the scripted args do not match the tool’s parameters. Compare the key names with get_hours(day).',
      ] },
      { type: 'warning', text: 'In a real agent the model chooses the tool name and the arguments, so treat both as untrusted. This loop runs only names found in TOOLS and catches wrong arguments, and a real one should also validate argument values (module 4). Never run model text with eval or exec. Keep the step, time and cost limits in your own code, and while you are learning give the loop read-only tools: a loop that can send messages or move money can do it forty times before you notice.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: add a second tool to TOOLS, add a scripted reply that uses it, and add a case where the model asks for a tool that is not in the list.',
        'Next lesson, “Understanding Agent State”, replaces the messages list with a state object that records steps, facts and budget, and that you can save and resume.',
        'Come back to this loop in Module 4, where the same loop calls real tools, and in Module 7, where the limits get more careful.',
      ] },
      { type: 'takeaways', items: [
        'The agent loop sends the messages, reads the reply, runs a requested tool, adds the observation and repeats until a stop condition applies.',
        'A final answer is only one way out. Add a step limit, repeated-call detection, an error budget and a time or cost limit in your own code.',
        'A scripted model lets you test the loop for free: finishing, getting stuck, unknown tools and bad arguments.',
        'Every turn is a model call and the history grows, so a fixed workflow is the cheaper baseline when the steps are known.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-13-code-challenge-1',
          kind: 'code-challenge',
          title: 'Finish the agent loop',
          prompt: 'The model here is scripted: `makeFakeModel(script)` returns the prepared replies one by one. It is a teaching stand-in, not a real model, and the tools are fake. Finish `runAgent(script, maxSteps)`. Loop while `steps < maxSteps`. Ask the model for a reply and count the step. A `final` reply returns status `done` with the answer. A `tool_call` runs the tool from `TOOLS` with `reply.args`; an unknown tool name adds `error: no tool NAME` instead. Push each result to `observations` and to `messages` as `{ role: \'tool\', content }`. If the limit is reached, return status `step_limit` with answer `null`.',
          concept: 'the agent loop with a step limit',
          language: 'javascript',
          starter: [
            'const TOOLS = {',
            "  get_hours: (args) => (args.day === 'sunday' ? 'closed' : '9:00-18:00'),",
            "  lookup_repair: (args) => (args.ref === '4471' ? 'ready' : 'not found'),",
            '};',
            '',
            'function makeFakeModel(script) {',
            '  let next = 0;',
            '  return (messages) => {',
            '    const reply = script[next];',
            '    next += 1;',
            '    return reply;',
            '  };',
            '}',
            '',
            'function runAgent(script, maxSteps) {',
            '  const model = makeFakeModel(script);',
            "  const messages = [{ role: 'user', content: 'start' }];",
            '  const observations = [];',
            '  let steps = 0;',
            '  // TODO: loop while steps < maxSteps',
            '  //   - ask the model for a reply and count the step',
            "  //   - a 'final' reply: return { status: 'done', steps, answer: reply.text, observations }",
            "  //   - a 'tool_call': look up TOOLS[reply.name]; if there is none the result is 'error: no tool ' + reply.name",
            '  //   - push the result to observations and to messages',
            "  return { status: 'step_limit', steps, answer: null, observations };",
            '}',
          ].join('\n'),
          solution: [
            'const TOOLS = {',
            "  get_hours: (args) => (args.day === 'sunday' ? 'closed' : '9:00-18:00'),",
            "  lookup_repair: (args) => (args.ref === '4471' ? 'ready' : 'not found'),",
            '};',
            '',
            'function makeFakeModel(script) {',
            '  let next = 0;',
            '  return (messages) => {',
            '    const reply = script[next];',
            '    next += 1;',
            '    return reply;',
            '  };',
            '}',
            '',
            'function runAgent(script, maxSteps) {',
            '  const model = makeFakeModel(script);',
            "  const messages = [{ role: 'user', content: 'start' }];",
            '  const observations = [];',
            '  let steps = 0;',
            '  while (steps < maxSteps) {',
            '    const reply = model(messages);',
            '    steps += 1;',
            "    if (reply.type === 'final') {",
            "      return { status: 'done', steps, answer: reply.text, observations };",
            '    }',
            '    const tool = TOOLS[reply.name];',
            "    const result = tool ? tool(reply.args) : 'error: no tool ' + reply.name;",
            '    observations.push(result);',
            "    messages.push({ role: 'tool', content: result });",
            '  }',
            "  return { status: 'step_limit', steps, answer: null, observations };",
            '}',
          ].join('\n'),
          tests: {
            kind: 'function',
            fn: 'runAgent',
            cases: [
              {
                label: 'a model that finishes after one tool',
                args: [[{ type: 'tool_call', name: 'get_hours', args: { day: 'monday' } }, { type: 'final', text: 'We open 9:00-18:00' }], 5],
                expected: { status: 'done', steps: 2, answer: 'We open 9:00-18:00', observations: ['9:00-18:00'] },
              },
              { label: 'a final answer straight away', args: [[{ type: 'final', text: 'Hello' }], 3], expected: { status: 'done', steps: 1, answer: 'Hello', observations: [] } },
              {
                label: 'a stuck model hits the limit',
                args: [[{ type: 'tool_call', name: 'lookup_repair', args: { ref: '9999' } }, { type: 'tool_call', name: 'lookup_repair', args: { ref: '9999' } }, { type: 'tool_call', name: 'lookup_repair', args: { ref: '9999' } }], 3],
                expected: { status: 'step_limit', steps: 3, answer: null, observations: ['not found', 'not found', 'not found'] },
              },
              {
                label: 'an unknown tool becomes an error line',
                args: [[{ type: 'tool_call', name: 'refund_all', args: {} }, { type: 'final', text: 'ok' }], 4],
                expected: { status: 'done', steps: 2, answer: 'ok', observations: ['error: no tool refund_all'] },
              },
              {
                label: 'the limit comes before the final answer',
                args: [[{ type: 'tool_call', name: 'lookup_repair', args: { ref: '9999' } }, { type: 'tool_call', name: 'lookup_repair', args: { ref: '9999' } }, { type: 'final', text: 'late' }], 2],
                expected: { status: 'step_limit', steps: 2, answer: null, observations: ['not found', 'not found'] },
                hidden: true,
              },
              {
                label: 'a limit of one step',
                args: [[{ type: 'tool_call', name: 'lookup_repair', args: { ref: '4471' } }, { type: 'final', text: 'late' }], 1],
                expected: { status: 'step_limit', steps: 1, answer: null, observations: ['ready'] },
                hidden: true,
              },
            ],
          },
          hints: [
            'Use a while loop whose condition is steps < maxSteps, so it can never run more than maxSteps turns.',
            'Inside the loop: call model(messages), add 1 to steps, then check reply.type === \'final\' first and return.',
            'For a tool call: const tool = TOOLS[reply.name]; the result is tool(reply.args), or an error string when tool is undefined. Push the result to both observations and messages.',
          ],
          explanation: 'The while condition is the step limit, so a model that never finishes ends as step_limit. A final reply returns at once. A tool name that is not in TOOLS becomes an error observation instead of a crash, and every observation is added to the messages for the next turn.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-13-fix-bug-1',
          kind: 'fix-bug',
          title: 'The agent that keeps asking the same thing',
          prompt: 'This loop uses a scripted model that answers when it sees a tool result in the messages, and asks for the hours tool otherwise. With the bug, the agent never finishes and ends at the step limit. Tap the buggy line, then choose the fix. The model is a stand-in written for this exercise.',
          concept: 'feeding the observation back to the model',
          language: 'javascript',
          code: [
            "const HOURS = { monday: '9:00-18:00', sunday: 'closed' };",
            '',
            'function fakeModel(messages) {',
            '  const last = messages[messages.length - 1];',
            "  if (last.role === 'tool') return { type: 'final', text: 'We open ' + last.content };",
            "  return { type: 'tool_call', name: 'get_hours', args: { day: 'monday' } };",
            '}',
            '',
            'function runAgent(question, maxSteps) {',
            "  const messages = [{ role: 'user', content: question }];",
            '  let steps = 0;',
            '  while (steps < maxSteps) {',
            '    const reply = fakeModel(messages);',
            '    steps += 1;',
            "    if (reply.type === 'final') {",
            "      return { status: 'done', steps, answer: reply.text };",
            '    }',
            '    const result = HOURS[reply.args.day];',
            "    messages.push({ role: 'user', content: result });",
            '  }',
            "  return { status: 'step_limit', steps, answer: null };",
            '}',
          ].join('\n'),
          bugLine: 19,
          fixes: [
            { line: "    messages.push({ role: 'tool', content: result });", correct: true, why: 'The model stand-in answers only when the last message has the role tool. Recording the result under that role is what lets the agent finish.' },
            { line: "    messages.push({ role: 'assistant', content: result });", correct: false, why: 'The result is now labelled as something the assistant said, so the stand-in still sees no tool message and asks again.' },
            { line: "    messages.push({ role: 'tool', content: reply.name });", correct: false, why: 'The role is right, but the content is the tool name. The agent finishes with the wrong answer: “We open get_hours”.' },
            { line: '    messages.length = 0;', correct: false, why: 'Clearing the messages leaves the model with nothing to read, which fails rather than finishing the run.' },
          ],
          tests: {
            kind: 'function',
            fn: 'runAgent',
            cases: [
              { label: 'it finishes after one lookup', args: ['When do you open on Monday?', 4], expected: { status: 'done', steps: 2, answer: 'We open 9:00-18:00' } },
              { label: 'it still stops at a limit of one', args: ['When do you open on Monday?', 1], expected: { status: 'step_limit', steps: 1, answer: null } },
              { label: 'two steps are enough', args: ['Hours please', 2], expected: { status: 'done', steps: 2, answer: 'We open 9:00-18:00' }, hidden: true },
            ],
          },
          hints: [
            'Look at what the loop does with the result after running the tool.',
            'The model stand-in checks last.role. What role does the pushed message have?',
            'The result must be added with role tool, and its content must be the result.',
          ],
          explanation: 'The model only sees what is in the messages. If the observation is not recorded as a tool result, the model asks again and the agent can only stop at the step limit. Feeding the observation back, with the right role, is what makes the loop move forward.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-13-q1',
        prompt: 'A log shows get_hours called with the same arguments 40 times in a minute, and the run ends only when someone stops it. Which two additions would have prevented this?',
        choices: [
          'A longer system prompt, and a larger model that is better at following instructions',
          'A step limit in the loop and detection of a repeated identical tool call',
          'A second copy of the tool, so that there is a backup if the first copy fails',
          'A retry on every tool call, so that one failure never ends the whole run',
        ],
        answer: 1,
        explanation: 'A step limit caps the number of turns whatever the model does, and repeated-call detection notices the stuck pattern earlier. Prompts and bigger models only change the odds.',
      },
      {
        id: 'building-ai-agents-13-q2',
        prompt: 'In the loop you built, why is each tool result added to the messages before the next turn?',
        choices: [
          'So the model can see what the tool returned and decide what to do next',
          'So the tool can run again later without needing its arguments to be given again',
          'So the step counter can be worked out later from the messages in the list',
          'So the allow-list can be rebuilt from the messages at the start of each turn',
        ],
        answer: 0,
        explanation: 'The model keeps nothing between calls. The only way it learns what a tool returned is for your code to put the observation into the messages it receives next.',
      },
      {
        id: 'building-ai-agents-13-q3',
        prompt: 'True or false: if your loop passes all its tests with a scripted model, you know it will behave well with a real model.',
        choices: [
          'True, because scripted replies have the same shape as the replies a real model gives',
          'True, because the loop is only code, and code that passes its tests is right for every input',
          'False, because scripted tests cannot check the step limit or a stuck model in any way at all',
          'False, because a scripted model tests only the loop logic; a real model can choose differently',
        ],
        answer: 3,
        explanation: 'A scripted model proves the loop handles the cases you scripted, and that is valuable. It cannot show how a real model will decide, so real runs and evaluation still matter.',
      },
      {
        id: 'building-ai-agents-13-q4',
        audience: { max: 'beginner' },
        prompt: 'In the checklist analogy, why does the clerk stop after six questions even if the model has not given a final answer?',
        choices: [
          'Because six is the correct number of questions for every agent that is built',
          'Because the model gets tired after about six turns and starts to make mistakes',
          'Because a clerk who keeps asking never finishes, and each question costs time and money',
          'Because the model always gives its final answer on the sixth turn, so more are not needed',
        ],
        answer: 2,
        explanation: 'The limit is a safety rule you choose. It protects against a model that never reaches a final answer, and it caps the cost.',
      },
      {
        id: 'building-ai-agents-13-q5',
        audience: { min: 'advanced' },
        prompt: 'A tool call times out and your loop retries it. The tool sends an email. What risk should the design address?',
        choices: [
          'A retry may send a second email if the first went through, so use an idempotency key or a pre-check',
          'The retry may need a larger context window than the first call did, which raises its cost a little',
          'The model will refuse to carry on with the run after it has seen one timeout from a tool',
          'The loop will count the retry as a final answer and stop before the customer has a reply',
        ],
        answer: 0,
        explanation: 'A timeout does not tell you whether the action happened. A tool with a side effect needs an idempotency key or a pre-check so that a retry cannot repeat it.',
      },
    ],
    task: {
      title: 'Run your own loop and make it fail on purpose',
      minutes: 20,
      steps: [
        'Save the two code blocks from this lesson as loop_demo.py and run it. Check that your output matches the expected output.',
        'Add a second tool to TOOLS (for example lookup_repair, which returns “ready” for the reference 4471). Add a ScriptedModel that asks for it and then answers. Run it.',
        'Change it and observe: run the stuck model with max_steps set to 1, then 3, then 10. Count the printed steps each time, and note what the status says. Then change the stuck script so that it asks for a tool that is not in TOOLS, and read what the loop does.',
        'Reflection: which stop condition from the table do you still not have, and what would a customer see if it were missing in your own agent?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['After step 1, change only the number in max_steps=3 and run the stuck agent each time. Write one sentence on what you saw. Add the other steps after that is clear.'] },
      { audience: { min: 'advanced' }, steps: ['Add repeated-call detection: if the same tool and arguments are requested twice in a row, stop with status repeated_call. Add the scripted test that proves it, and add a wall-clock time limit using time.monotonic().'] },
    ],
  },
  {
    id: 'building-ai-agents-14',
    day: 14,
    title: 'Understanding Agent State',
    summary: 'Decide what an agent must carry from one step to the next, keep it in one small object per task, and save and restore it safely.',
    intro: {
      objectives: [
        'Say what belongs in an agent’s state and what should stay out of it',
        'Keep one state object per task and update it in one place',
        'Save the state after each step and restore it to resume a task',
      ],
      why: 'A model forgets everything between calls, so any agent that does more than one step needs state. Good state makes an agent resumable and testable, and careless state is how customers’ details end up in the wrong place.',
    },
    minutes: 22,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'Mika’s agent asks for the reference number and gets it. Two minutes later it asks again. What does an agent know at any moment, and where is that kept? The model remembers nothing between calls, so something else must. That something is state, and getting it right is the difference between an agent that finishes a task and one that keeps starting over.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel kept everything the agent knew in one dictionary at the top of his server file, shared by every conversation. It worked in testing, with one person. In the first week two customers chatted at the same time, and one of them was shown the repair status of the other. Then Joel deployed a fix at two in the afternoon. The server restarted, the dictionary was empty, and every conversation in progress lost its place: customers were asked to start again, and one customer was told twice that a bike was ready. Joel rebuilt it around one small state object per conversation, saved after every step, with a limit on what it may hold and a time after which it is deleted.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Agent state** is everything an agent needs to carry from one step of a task to the next: the goal, the messages so far, what the tools returned, how many steps were used and what is left of the budget. It is different from **memory**, which is what an agent keeps across tasks and conversations (Module 5), and different from what the model knows, which is only what you send in the current request. The model is stateless. Your code holds the state and sends the model what it needs.' },
      {
        type: 'table',
        headers: ['Keep in state', 'Why', 'Example'],
        rows: [
          ['The goal', 'Every step needs to know what the task is', '“Tell the customer if repair 4471 is ready”'],
          ['The messages', 'The model sees only what you send it each turn', 'The customer’s message, tool results, earlier replies'],
          ['Short tool results and facts', 'Later steps rely on what earlier steps found', 'repair_ref is 4471, status is ready for pickup'],
          ['Step count, limits and status', 'The loop needs to know when to stop and what happened', 'step 2 of 6, status running'],
          ['A log line per action', 'A person can read what the agent did and why', 'step 1: lookup_repair(4471) returned ready for pickup'],
        ],
        caption: 'Keep what the next step needs and a person needs to understand the run. Leave out everything else.',
      },
      { type: 'paragraph', text: 'What to leave out matters as much. Never keep secrets such as API keys in state, because state is saved and logged. Keep large tool outputs out of it: store a short summary or an id and fetch the rest when needed, since the whole state is resent to the model and every extra word costs time and money. And never mix two customers: a task’s state belongs to that task alone.' },
      { type: 'paragraph', text: 'Three rules keep state safe. **One state per task:** key it by a conversation id, never a global variable. **Small and plain:** use simple data (text, numbers, lists, dictionaries) so it can be saved, loaded, printed and replayed in a test. **One place to change it:** update state through a few methods instead of scattered assignments, so every change is easy to find, log and test. Save a copy after each step. Then a crash, a restart or a long wait resumes from the last saved step rather than from the start.' },
      { type: 'diagram', format: 'mermaid', caption: 'Save after every step. If the server restarts at any point, the next run loads the last saved state and carries on from there.', source: ['flowchart TD', '  A[Load the state for this conversation] --> B[Model picks the next step]', '  B --> C[Run the tool after checks]', '  C --> D[Update the state in one place]', '  D --> E[Save the state]', '  E --> F{Done or over budget?}', '  F -->|no| B', '  F -->|yes| G[Send the reply and mark the task finished]'].join('\n') },
      { type: 'paragraph', text: 'State holds personal data, so say what you store and why. Here it is the customer’s message and a repair reference. The reason is to finish the task. Decide how long it lives (delete it when the task ends, or after a time you choose and write down), who can read it (only the people and services that need it), and how to view and delete one conversation’s state on request. Do not store medical, legal or financial details in an agent’s state unless you have a clear reason and a plan to protect them.' },
      { type: 'version', text: 'Frameworks and APIs handle state in their own ways, and they change. The OpenAI text guide says instructions apply only to the current request and are not carried over when you chain responses with previous_response_id, so anything you rely on must be sent again. In Anthropic’s tool-use loop your code appends the assistant’s content and the tool results to the messages you send next. LangGraph’s docs describe checkpointers that persist a thread’s state, with an in-memory saver that is lost on restart, a SQLite saver for local development and a Postgres saver for production. Module 9 compares frameworks.', checked: CHECKED, sources: [DOCS.openaiText, DOCS.claudeHandleCalls, DOCS.langgraphPersistence] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: a repair shop keeps a job card for each bike. The card says who the customer is, what is wrong, what has been done and what is left. Anyone can pick up the card and carry on, even if the mechanic went home. Agent state is that job card. A model is like a mechanic with no memory at all, who reads the card every time and then does one thing. Two rules matter: one card per job, never one big card for every bike, and keep secrets like the key to the till off the card.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Concurrency is the first production problem. Two events for the same conversation at once can overwrite each other, so use a version number or a lock when saving. State is resent every turn, so its size drives cost and latency: summarise or drop old tool outputs and store references to large documents instead of copies. Version the state schema so a new release can still load saved state, or migrate it. Treat restored state as untrusted if users can influence it, validate it on load, and encrypt it at rest if your policy requires. Keep durable state separate from long-term memory: they have different retention rules and different owners.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will write a small state class with methods that update it, a budget check, and save and load functions, then prove that a saved copy restores exactly. Python 3.10 or later, standard library only. Save the first block as state_demo.py, add the second block below it and run the file.' },
      { type: 'code', language: 'python', label: 'Python: the state object (state_demo.py, part 1)', code: `import json
from dataclasses import asdict, dataclass, field


@dataclass
class AgentState:
    goal: str
    status: str = "running"  # running, done, failed or step_limit
    step: int = 0
    max_steps: int = 6
    messages: list = field(default_factory=list)
    facts: dict = field(default_factory=dict)  # small things worth keeping
    log: list = field(default_factory=list)  # one line per tool call

    def add_tool_result(self, name: str, args: dict, result: str) -> None:
        self.step += 1
        self.log.append(f"step {self.step}: {name}({args}) -> {result[:80]}")
        self.messages.append({"role": "tool", "content": result[:500]})

    def over_budget(self) -> bool:
        return self.step >= self.max_steps

    def to_json(self) -> str:
        return json.dumps(asdict(self))

    @classmethod
    def from_json(cls, text: str) -> "AgentState":
        return cls(**json.loads(text))
` },
      { type: 'code', language: 'python', label: 'Python: use it, save it and restore it (add this below part 1)', code: `state = AgentState(goal="Tell the customer if repair 4471 is ready", max_steps=3)
state.messages.append({"role": "user", "content": "Is my bike ready? Ref 4471"})
state.add_tool_result("lookup_repair", {"ref": "4471"}, "ready for pickup")
state.facts["repair_ref"] = "4471"
saved = state.to_json()  # in a real system, write this to a file or database

restored = AgentState.from_json(saved)
print("same after save and load:", restored == state)
print("steps used:", restored.step, "of", restored.max_steps)
print("over budget:", restored.over_budget())
for line in restored.log:
    print(line)
print("facts:", restored.facts)
` },
      { type: 'paragraph', text: 'The important lines. **AgentState** holds only plain data, and every field has one job. **add_tool_result** is the single place where a tool result enters the state: it counts the step, writes a log line and adds the result to the messages, and it cuts long results short so the state stays small. **over_budget** is what the loop would check. **to_json** and **from_json** turn the state into text and back, which is how you save and resume. The check “same after save and load” proves nothing was lost on the way.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'Reading the code line by line. The class AgentState is the job card, with labelled boxes: goal, status, step and so on. Each box starts with a default value, so you only have to give the goal. add_tool_result is the one way to record a result: it adds one to the step count, writes a line in the log and adds the result to the messages. The cut [:80] keeps only the first 80 characters in the log. to_json turns the card into text that can be saved in a file, and from_json reads that text and rebuilds the card. The final lines print what the restored card holds.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run with Python 3.13 on 2026-11-18)', code: `same after save and load: True
steps used: 1 of 3
over budget: False
step 1: lookup_repair({'ref': '4471'}) -> ready for pickup
facts: {'repair_ref': '4471'}
` },
      { type: 'list', items: [
        'If you see TypeError: __init__() got an unexpected keyword argument: the saved text has a field the class no longer has. That is a schema change. Add a version field to the state and migrate old data when you load it.',
        'If “same after save and load” prints False: a field holds something that JSON changes, such as a tuple, which comes back as a list. Keep state to plain lists, dictionaries, numbers and text.',
        'If two conversations seem to share facts: you probably created one AgentState and reused it. Create one per task, keyed by a conversation id.',
        'If state grows very large: check that you cut tool results (as result[:500] does) or store a reference instead of the whole text.',
      ] },
      { type: 'warning', text: 'State holds personal data from customers. Do not store API keys or passwords in it, do not write it to logs unredacted, and decide how long it lives and how it is deleted. Never call from_json on text that a user supplied without validating every field first, and never keep one customer’s state where another customer’s task can read it.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: add a field you would need in your own agent (for example the customer’s chosen day) and a method that updates it. Then save and restore it.',
        'Next lesson, “Event-Driven Agent Architectures”, shows how work reaches an agent through a queue, and why each event needs an id so that the same event is never handled twice.',
        'Module 5 builds on this: persistent memory, what to store across tasks, and how a person can view and clear it.',
      ] },
      { type: 'takeaways', items: [
        'State is what an agent carries between steps: the goal, messages, small facts, step count, limits and a log. The model itself keeps nothing.',
        'Keep one small, plain state object per task, update it in one place, and never share it across customers.',
        'Save after every step so a restart resumes instead of starting over, and keep secrets and large outputs out of state.',
        'State contains personal data: decide what you store, for how long, who reads it, and how it is deleted.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-14-predict-output-1',
          kind: 'predict-output',
          title: 'A saved copy and an alias',
          prompt: 'This program saves a snapshot of the state, changes the state, and then makes a second name for it. What does it print? (No model is involved.)',
          concept: 'snapshots versus aliases of state',
          language: 'javascript',
          code: [
            'const state = { step: 0, log: [] };',
            'function record(s, line) {',
            '  s.step += 1;',
            '  s.log.push(line);',
            '  return s;',
            '}',
            'const saved = JSON.parse(JSON.stringify(state));',
            "record(state, 'lookup');",
            "record(state, 'reply');",
            "console.log(state.step + ' ' + state.log.length);",
            "console.log(saved.step + ' ' + saved.log.length);",
            'const alias = state;',
            'alias.step = 10;',
            'console.log(state.step);',
          ].join('\n'),
          expected: '2 2\n0 0\n10',
          choices: ['2 2\n0 0\n10', '2 2\n2 2\n10', '2 2\n0 0\n2', '2 2\n0 0\n0'],
          wrongNotes: {
            '2 2\n2 2\n10': 'JSON.parse(JSON.stringify(state)) makes an independent copy, so changing state later does not change saved.',
            '2 2\n0 0\n2': 'alias is not a copy. It is a second name for the same object, so setting alias.step changes state.step.',
            '2 2\n0 0\n0': 'The step count was raised to 2 and then set to 10 through the alias. It never goes back to 0.',
          },
          hints: [
            'JSON.parse(JSON.stringify(x)) builds a new, separate object.',
            'record changes the object it is given. Which object did it receive?',
            'const alias = state does not copy anything. Both names point to one object.',
          ],
          explanation: 'A saved snapshot is a separate copy, so later changes do not reach it. An alias is the same object under a second name. Mixing the two up is how a “saved” state ends up changing, or how two tasks end up sharing one.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-14-scenario-1',
          kind: 'scenario',
          title: 'The restart at two in the afternoon',
          prompt: 'Choose the design that best survives a server restart.',
          concept: 'saving state per task',
          situation: 'Mika’s agent handles about twenty chats a day. A deploy restarts the server while three customers are in the middle of a chat. Joel wants the chats to carry on after a restart and wants no customer to see another’s details.',
          options: [
            { text: 'Keep one state object per conversation id, save it after every step to a store, and load it at the start of each turn. Delete it after the task ends.', consequence: 'A restart loses nothing past the last saved step, no two chats share data, and old state does not pile up.', quality: 'best' },
            { text: 'Keep one state object per conversation in memory and ask the customer to start again after a restart.', consequence: 'Separate per conversation is right, and the restart is harmless to privacy. Customers pay for the restart with their time.', quality: 'acceptable' },
            { text: 'Keep one global dictionary of all conversations in memory and rely on deploying only at night.', consequence: 'A crash or a deploy at any other time loses every chat, and a bug in how the keys are used could show one customer another’s status.', quality: 'poor' },
            { text: 'Put every customer’s state into the instructions so the model “remembers” everyone.', consequence: 'Every request now carries private data about every customer, it costs more on each call, and the model can repeat any of it.', quality: 'poor' },
          ],
          hints: [
            'What survives a restart: something in memory, or something saved?',
            'What keeps two customers apart?',
            'Save per conversation id after each step, and delete when the task ends.',
          ],
          explanation: 'State per task, saved after each step, solves both problems: it survives restarts and keeps customers apart. Deleting it when the task ends limits how much personal data is kept.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-14-q1',
        prompt: 'The agent asks a customer for their reference number twice in one chat. The number was given the first time. What should you check first?',
        choices: [
          'Whether the model is large enough to remember a number that the customer gave it earlier',
          'Whether the instructions say “remember everything that the customer tells you in the chat”',
          'Whether the state or messages sent on the second turn still contain the reference number',
          'Whether the customer typed the number clearly enough for the model to read it',
        ],
        answer: 2,
        explanation: 'The model remembers nothing between calls. If it asks again, the number was probably not in what your code sent. Check what the request actually contained.',
      },
      {
        id: 'building-ai-agents-14-q2',
        prompt: 'A tool returns a 40-page document. Which handling keeps the state healthy?',
        choices: [
          'Keep the full text in state, so that later steps never need to fetch the document again',
          'Keep a short summary and the document’s id, and fetch it again only if a step needs it',
          'Delete the result at once so that the state stays empty and the agent has less to carry',
          'Copy the document into the instructions so that the model always has all of it in view',
        ],
        answer: 1,
        explanation: 'State is resent every turn, so its size is a cost. A summary and an id keep what later steps need without the weight, and you can fetch the rest on demand.',
      },
      {
        id: 'building-ai-agents-14-q3',
        prompt: 'Which item should never be stored in an agent’s state?',
        choices: [
          'The API key used to call the booking service',
          'The customer’s repair reference for the task in progress',
          'The number of steps that have been used so far in this task',
          'A short log line for each tool call that the agent has made',
        ],
        answer: 0,
        explanation: 'State is saved, copied and logged. A key does not belong there. Keep secrets in a secrets store or environment variable and read them where they are used.',
      },
      {
        id: 'building-ai-agents-14-q4',
        audience: { max: 'beginner' },
        prompt: 'In the job card analogy, why does the shop keep one card for each bike instead of one big card for all bikes?',
        choices: [
          'Small cards are cheaper to print than one very large card for the whole shop',
          'So the mechanic only has to remember one bike at a time while working',
          'Because the law says that every bike in the shop must have a card of its own colour',
          'So that one job’s details never get mixed up with the details of another job',
        ],
        answer: 3,
        explanation: 'One card per job keeps each customer’s details separate and makes it easy to pick up a job where it stopped.',
      },
      {
        id: 'building-ai-agents-14-q5',
        audience: { min: 'advanced' },
        prompt: 'Two events for the same conversation arrive at the same moment, and both load the state, change it and save it. What problem can this cause, and how do you prevent it?',
        choices: [
          'The state may become too large for the model to read, so the fix is to summarise the old messages',
          'The model will answer the customer twice, so the fix is to lower the step limit of the loop',
          'One save can overwrite the other and lose an update; use a version number or a lock when saving',
          'The saved JSON becomes invalid text, so the fix is to use a tuple in place of a list',
        ],
        answer: 2,
        explanation: 'Two writers that read the same version and both save will lose one change. Optimistic versioning, a lock, or serialising a conversation’s events prevents the lost update.',
      },
    ],
    task: {
      title: 'Give your agent a state it can save and resume',
      minutes: 18,
      steps: [
        'Save and run the code from this lesson. Check your output against the expected output.',
        'Add a field for your own agent (for example the customer’s chosen day or a list of tool names already used) and a method that updates it. Print it after loading from JSON.',
        'Change it and observe: set max_steps to 1 and call add_tool_result twice. Print over_budget() after each call. Then change a field to a tuple and watch the “same after save and load” check fail. Note why.',
        'Reflection: write one sentence each on what your state stores, why, how long you would keep it and how someone could delete it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before coding, write a job card for an agent of your choice on paper with five boxes. Then match each box to a field in the class.'] },
      { audience: { min: 'advanced' }, steps: ['Add a version field and a method that migrates a state saved with an older version. Then add a version number that is checked on save so that two writers cannot silently overwrite each other.'] },
    ],
  },
  {
    id: 'building-ai-agents-15',
    day: 15,
    title: 'Event-Driven Agent Architectures',
    summary: 'Start an agent from events through a queue, handle duplicates and bad events safely, and trace one request through the whole agent.',
    intro: {
      objectives: [
        'Explain how events, a queue and a worker start an agent without a person typing',
        'Make an event handler safe against duplicates, bad events and floods',
        'Trace one request through every part of the agent as an ordered list, and extend your architecture diagram',
      ],
      why: 'Many useful agents are started by something happening, such as a new order, a finished repair or a timer, not by a person typing. Events also bring duplicates, bad data and floods, and designing for them early saves money and mistakes.',
    },
    minutes: 25,
    skills: ['agent-foundations'],
    body: [
      { type: 'paragraph', text: 'So far the agent waits for a person to type. What if a repair is marked “ready” in the shop’s own system and the agent should write to the customer by itself? Nobody typed anything. Something happened, and that something is an event. This lesson shows how events reach an agent, what can go wrong, and how to follow one request through every part you have studied in this module.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Joel wanted a pickup note sent when a repair changed to “ready”. His first version asked the shop system every ten seconds whether anything had changed, and called the model each time, even when nothing had. The model bill grew and notes still arrived up to ten seconds late. He switched to a webhook: the shop system calls a web address of Joel’s when a repair is ready. That fixed the delay. Then the shop system sent the same “ready” message twice, because it retries when a server is slow, and one customer received two notes. Joel added an id to every event, a list of ids already handled, a queue so that events wait their turn, and one worker that takes them one at a time. Events he could not handle went to a separate list for a person to read.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'An **event** is a record that something happened: a message arrived, a repair was marked ready, a timer fired. A **trigger** is whatever starts an agent run. The common triggers are a user message, a **webhook** (a web address of yours that another system calls when something happens), a schedule (a timer) and a file arriving. In an **event-driven** design, events go into a **queue** (a waiting line). A **worker** takes one event at a time, runs the agent on it and records the result.' },
      { type: 'diagram', format: 'mermaid', caption: 'An event-driven agent. Three kinds of event enter one queue. A check lets only new, valid events through. Bad ones are kept as dead letters for a person, and good ones reach a worker that runs the agent.', source: ['flowchart TD', '  A[Customer message] --> Q[(Event queue)]', '  B[Webhook: repair marked ready] --> Q', '  C[Timer: daily check] --> Q', '  Q --> D{New and valid?}', '  D -->|no| X[Dead letters: kept for a person]', '  D -->|yes| W[Worker runs the agent]', '  W --> R[Result stored and customer notified]'].join('\n') },
      { type: 'paragraph', text: 'Four things need care. **Identity and duplicates.** Senders often retry, so the same event can arrive twice. Give each event an id and ignore ids you have already seen. A handler that has the same effect when run twice as when run once is **idempotent**. **Trust.** Anyone can call a public web address, so check who sent an event before it enters the queue (many services sign what they send with a shared secret, so read the sender’s documentation for its method), and treat the event’s contents as untrusted data, like any customer text. **Limits.** A flood of events is a flood of model calls, so cap the events per minute, the runs at the same time, and the steps and cost of each run. **Failure.** An event you cannot handle goes to a dead-letter list, so it is never silently lost and never retried forever.' },
      {
        type: 'table',
        headers: ['', 'Request and response', 'Event-driven'],
        rows: [
          ['Fits when', 'A person waits a few seconds for the answer', 'Work starts from something happening, runs a long time or must not be lost'],
          ['Moving parts', 'One endpoint that runs the agent and replies', 'A queue, a worker, a store of seen ids and a dead-letter list'],
          ['Typical failure', 'A slow run times out in front of the person', 'Duplicates, floods, and events that nobody reads'],
          ['Start with', 'This one, unless the table’s left side does not fit', 'Only when you need it'],
        ],
        caption: 'The queue adds moving parts you must build, run and watch. Add it when the work really starts from events.',
      },
      { type: 'version', text: 'Agent frameworks describe event-style building blocks, and you do not need one for a queue and a worker. CrewAI’s docs describe Flows as structured, event-driven workflows, built with decorators such as start and listen, with state kept in the flow. LangGraph’s docs describe a low-level framework for long-running, stateful agents, with persistence and human-in-the-loop support. Check the current pages before relying on either; Module 9 compares them.', checked: CHECKED, sources: [DOCS.crewaiFlows, DOCS.langgraphOverview] },
      { type: 'paragraph', text: 'An honest limit of this lesson’s design: an in-memory queue vanishes if the program stops. A real system keeps the queue and the seen ids in storage that survives a restart, and Module 11 returns to this when it covers deploying. The ideas, ids, a check at the door, limits and a dead-letter list, stay the same.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: a queue is the line at a shop counter. People join the line and one helper serves them one at a time. Each person holds a numbered ticket, so if someone joins twice with the same ticket, the helper says “I already served you”. A person with a strange ticket is sent to the manager’s desk (the dead-letter list) instead of being served. A guard at the door checks that everyone who joins is allowed to. Without the line, ten people shouting at one helper would mean mistakes and lost orders.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Most queues deliver at least once, so duplicates are normal and handlers must be idempotent: store processed ids with an expiry, or use a unique key in the database. Ordering is not guaranteed across senders, so include a timestamp or version in events and ignore stale ones. Use visibility timeouts and retries with backoff, and a dead-letter queue with alerts. Carry one trace id from the event through the agent run to each tool call. Apply per-sender rate limits plus a global budget with a kill switch. Verify webhook signatures over the raw request body before parsing it, and compare them in a way that does not leak timing.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will build a small event queue with a check for new and valid events, handlers for three event types, a dead-letter list and a cap on how many events one run handles. The “agent” in each handler is a plain function that returns a sentence, so the focus stays on the architecture. Python 3.10 or later, standard library only. Save the first block as events_demo.py, add the second below it and run the file.' },
      { type: 'code', language: 'python', label: 'Python: handlers, the queue and the entry check (events_demo.py, part 1)', code: `from collections import deque


def on_message(event: dict) -> str:
    return f"agent answers: {event['text']}"


def on_repair_ready(event: dict) -> str:
    return f"agent writes a pickup note for repair {event['ref']}"


def on_daily_check(event: dict) -> str:
    return "agent lists repairs waiting more than 7 days"


HANDLERS = {"message": on_message, "repair_ready": on_repair_ready, "daily_check": on_daily_check}
queue: deque = deque()
seen_ids: set = set()
dead_letters: list = []  # events we could not handle, kept for a person to read


def submit(event: dict) -> str:
    if not isinstance(event.get("id"), str) or event.get("type") not in HANDLERS:
        dead_letters.append(event)
        return "rejected"
    if event["id"] in seen_ids:
        return "duplicate ignored"
    seen_ids.add(event["id"])
    queue.append(event)
    return "queued"
` },
      { type: 'code', language: 'python', label: 'Python: the worker and a run (add this below part 1)', code: `def process_all(max_events: int = 10) -> None:
    handled = 0
    while queue and handled < max_events:
        event = queue.popleft()
        handled += 1
        try:
            print(event["id"], "->", HANDLERS[event["type"]](event))
        except KeyError as error:
            dead_letters.append(event)
            print(event["id"], "-> failed, missing", error)


incoming = [
    {"id": "e1", "type": "message", "text": "Is my bike ready? Ref 4471"},
    {"id": "e2", "type": "repair_ready", "ref": "4471"},
    {"id": "e2", "type": "repair_ready", "ref": "4471"},  # the sender retried
    {"id": "e3", "type": "daily_check"},
    {"id": "e4", "type": "repair_ready"},  # no reference number
    {"type": "message", "text": "no id at all"},
]
for item in incoming:
    print(item.get("id", "?"), submit(item))
process_all()
print("dead letters:", len(dead_letters))
` },
      { type: 'paragraph', text: 'The important lines. **HANDLERS** is an allow-list of the event types the agent accepts, and **submit** is the door: an event with no id or an unknown type goes to the dead letters, an id seen before is ignored, and only a new, valid event joins the queue. **process_all** is the worker. It takes events one at a time, calls the handler for that type, and sends an event that fails to the dead letters instead of crashing. The cap max_events is a limit on the run: a flood cannot make one run last for ever. The test data shows each case: a normal event, a retry with the same id, a missing field and a missing id.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'Reading the code line by line. The three small functions are the helpers, one for each kind of event. HANDLERS is the list of event kinds we know. queue is the waiting line, seen_ids is the list of tickets we already served, and dead_letters is the manager’s desk. submit checks a new event: no ticket or an unknown kind goes to the manager, a ticket we saw before is ignored, and the rest join the line. process_all takes people from the front of the line, one at a time, and uses the right helper. If a helper cannot do its job because something is missing, the event goes to the manager and the line carries on.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run with Python 3.13 on 2026-11-18)', code: `e1 queued
e2 queued
e2 duplicate ignored
e3 queued
e4 queued
? rejected
e1 -> agent answers: Is my bike ready? Ref 4471
e2 -> agent writes a pickup note for repair 4471
e3 -> agent lists repairs waiting more than 7 days
e4 -> failed, missing 'ref'
dead letters: 2
` },
      { type: 'list', items: [
        'If e2 is handled twice: check that submit adds the id to seen_ids before it queues the event, and that you did not create a new seen_ids set inside the function.',
        'If you see NameError for HANDLERS or submit: the second block was added above the first. Put it below.',
        'If you see KeyError printed for an event you expected to work: the handler reads a key the event does not have. Compare the event keys with the handler.',
        'If an event never runs: the worker stops at max_events, so raise it, or run process_all again.',
      ] },
      { type: 'warning', text: 'Never let an unauthenticated caller start an agent run: each event can cost model calls and can trigger tool actions. Check who sent a webhook before queueing it, cap events and runs per minute, and treat event contents as untrusted data. This demo skips the sender check on purpose, because it depends on the sender. A real system must add it. Do not log full event bodies with personal details unless you have a plan to protect them.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'paragraph', text: 'Finish the module with its practical activity. Open the architecture diagram you drew in lesson 8 and extend it: add the event sources, the queue, the check for new and valid events, the dead-letter list and the state store, and mark where a request is limited and logged. Then save it.' },
      { type: 'visual', id: 'arch-diagram-workbench', caption: 'Extend your lesson 8 diagram: add the event sources, queue, door check, dead letters and state store. Label what each arrow carries and save it.' },
      { type: 'list', items: [
        'Today: extend and save your diagram, and keep it. In Module 3 you will connect the model box to a real API.',
        'Next, Module 3 begins with “Choosing an LLM for Agent Development” and builds your first working agent on a model API.',
        'Read the documentation of any service you plan to receive webhooks from, and find how it signs its requests and how it retries.',
      ] },
      { type: 'takeaways', items: [
        'Events (a message, a webhook, a timer) start agent runs without a person typing, usually through a queue and a worker.',
        'Give every event an id and ignore ids already seen, because senders retry and duplicates are normal.',
        'Check the sender, treat event contents as untrusted, cap events and runs, and keep events you cannot handle in a dead-letter list.',
        'Use request and response when a person waits, and add a queue only when the work really starts from events.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-15-arrange-1',
          kind: 'arrange',
          title: 'Trace one request through the agent',
          prompt: 'A customer sends “Is my bike ready? Ref 4471”. Put the actions in the order they happen, from the message arriving to the reply and the log.',
          concept: 'tracing a request through the architecture',
          language: 'text',
          solution: [
            'Receive the message and give it an event id',
            'Input processing: remove odd characters, cap the length, find the reference 4471',
            'Load the state for this conversation',
            'Build the request: instructions, state messages and the tool list',
            'Call the model',
            'The model replies with a request to run lookup_repair for ref 4471',
            'Check the tool is on the allow-list and the arguments are valid',
            'Run the tool and add its result to the state',
            'Call the model again with the result',
            'The model replies with the final answer as JSON',
            'Output processing: validate the JSON and the rules, then send the reply',
            'Save the final state and write the trace to the log',
          ],
          alternatives: [
            [
              'Receive the message and give it an event id',
              'Load the state for this conversation',
              'Input processing: remove odd characters, cap the length, find the reference 4471',
              'Build the request: instructions, state messages and the tool list',
              'Call the model',
              'The model replies with a request to run lookup_repair for ref 4471',
              'Check the tool is on the allow-list and the arguments are valid',
              'Run the tool and add its result to the state',
              'Call the model again with the result',
              'The model replies with the final answer as JSON',
              'Output processing: validate the JSON and the rules, then send the reply',
              'Save the final state and write the trace to the log',
            ],
          ],
          reasons: [
            'Everything starts with an event, and the id comes first so a duplicate can be spotted.',
            'The message is cleaned and limited before anything else sees it.',
            'The agent needs to know what happened earlier in this conversation.',
            'The model gets the instructions, the history and the tools it may ask for.',
            'The model decides the next step.',
            'The model can only ask. It has not run anything yet.',
            'Your code checks the request before it acts on it.',
            'The tool runs only now, and its result is recorded in the state.',
            'The model needs the result to write the answer, because it keeps nothing between calls.',
            'The model writes the answer in the format the instructions asked for.',
            'The reply is validated before anyone sees it.',
            'The task is saved and logged so it can be resumed or audited.',
          ],
          hints: [
            'Start with what happens when the message arrives, and end with what is saved afterwards.',
            'The model is called twice: once to ask for the tool, and once more after the tool has run.',
            'The tool is checked before it runs, and the reply is checked before it is sent.',
          ],
          explanation: 'Every part of the architecture appears in order: the event and its id, input processing, state, the model deciding, the code checking and running the tool, the model answering, and output processing. Loading the state can come before or after cleaning the message, so both orders are accepted.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-15-scenario-1',
          kind: 'scenario',
          title: 'The same webhook, twice',
          prompt: 'Choose the best fix.',
          concept: 'idempotent event handling',
          situation: 'The shop system sends a “repair ready” webhook. Joel’s server is slow that day, so the shop system sends the same message a second time after a few seconds. Both events are queued, and the customer gets two pickup notes. Joel wants this never to happen again.',
          options: [
            { text: 'Give each event an id, keep a record of ids already handled, and ignore an event whose id has been seen.', consequence: 'The second copy is recognised and dropped. The customer gets one note, however many times the sender retries.', quality: 'best' },
            { text: 'Ask the shop system to stop retrying.', consequence: 'You may not be able to change the sender, and without retries a real failure now loses events. Duplicates are also possible from other causes.', quality: 'poor' },
            { text: 'Add a delay of ten seconds before every note, so duplicates arrive together and can be merged by hand.', consequence: 'Notes arrive late for everyone and nothing is merged automatically. A duplicate that arrives later still gets through.', quality: 'poor' },
            { text: 'Let the model decide whether a message looks like a duplicate.', consequence: 'It may work most of the time, but it costs a model call and can be wrong. An id check is exact, free and testable.', quality: 'acceptable' },
          ],
          hints: [
            'Duplicates are normal: senders retry when they get no answer in time.',
            'What identifies an event exactly, without guessing?',
            'Record each event’s id when you handle it, and skip ids you have seen.',
          ],
          explanation: 'Retries cannot be prevented, so the handler must be idempotent: handling the same event twice has the same effect as handling it once. A record of seen ids is the simplest exact way to do that.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-15-q1',
        prompt: 'A webhook sender retries when it gets no reply within a few seconds, so some events arrive twice. Which design handles this correctly?',
        choices: [
          'Slow the sender down by making your server always reply a little later than usual',
          'Run each event when it arrives and see afterwards whether a customer has complained',
          'Ask the model whether the new event looks like one that it has seen before',
          'Record each event’s id on arrival and skip any event whose id was already handled',
        ],
        answer: 3,
        explanation: 'Retries are part of how webhooks work, so duplicates must be expected. An id check is exact and cheap, and it makes the handler safe to run twice.',
      },
      {
        id: 'building-ai-agents-15-q2',
        prompt: 'Joel polls the shop system every ten seconds and calls the model each time, even when nothing changed. Notes still arrive late and the model bill is high. What is the better design?',
        choices: [
          'Let the shop system call a webhook when a repair is ready, and call the model only then',
          'Poll every second instead of every ten seconds, so that the delay becomes much smaller',
          'Switch to a smaller model but keep the same polling, so that each call costs less',
          'Poll every minute and put all the customers into one single model call to save money',
        ],
        answer: 0,
        explanation: 'An event arrives when something changes, so there is no waiting and no wasted model call. Polling faster costs more, and slower polling only adds delay.',
      },
      {
        id: 'building-ai-agents-15-q3',
        prompt: 'Your webhook address is public. A message arrives that claims to be from the shop system but you cannot tell. What should happen before it is queued?',
        choices: [
          'Run the agent at once, because turning away a real message is worse than running a fake one',
          'Check the sender the way its docs say (a signature, for example) and reject messages that fail',
          'Ask the model to judge whether the message looks genuine before it is put in the queue at all',
          'Count the message but keep it out of the dead letters so that nobody has to read it',
        ],
        answer: 1,
        explanation: 'A public address accepts anything. A fake event can cost model calls and trigger actions, so the sender is checked first, using the sender’s own documented method.',
      },
      {
        id: 'building-ai-agents-15-q4',
        audience: { max: 'beginner' },
        prompt: 'In the queue analogy, what is the numbered ticket for?',
        choices: [
          'To spot someone who has been served already, so that they are not served twice',
          'To decide who gets the best service, with the earliest tickets served first',
          'To show who arrived first, so that the whole line can be turned around',
          'To count how many people are in the shop for the owner at the end of the day',
        ],
        answer: 0,
        explanation: 'The ticket is the event id. It identifies each request exactly, so a repeat can be spotted and ignored.',
      },
      {
        id: 'building-ai-agents-15-q5',
        audience: { min: 'advanced' },
        prompt: 'Events from two senders can arrive out of order, and an old “status: in progress” event arrives after a newer “status: ready”. How should the handler cope?',
        choices: [
          'Always handle events in the order that they arrive, because the order never matters',
          'Compare the event’s version or timestamp with the stored one, and ignore older events',
          'Delay every event until all of the senders have had time to catch up with each other',
          'Process the older event again to refresh its timestamp before handling the newer one',
        ],
        answer: 1,
        explanation: 'Delivery order is not guaranteed across senders. A version or timestamp on each event, compared with what you have already applied, stops stale news from overwriting newer news.',
      },
    ],
    task: {
      title: 'Trace a request and extend your diagram',
      minutes: 20,
      steps: [
        'Save and run the code from this lesson. Check your output against the expected output.',
        'Add a fourth event type, such as stock_low, with its own handler. Add it to HANDLERS, add two events of the new type to incoming (one with a repeated id), and run it.',
        'Change it and observe: set max_events to 2 and run. Count how many events are handled and how many remain in the queue. Then change the order of incoming so that the duplicate arrives first, and see which copy is handled.',
        'Open your architecture diagram from lesson 8, add the event sources, queue, door check, dead letters and state store, and save it. Then write the trace of one request through it as a numbered list, like the arrange activity.',
        'Reflection: which limit in your design would protect you from a flood of events, and what would you read first the morning after one?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write the trace of a customer message through your diagram in plain words first, one short line per step, and then compare it with your diagram.'] },
      { audience: { min: 'advanced' }, steps: ['Make the seen ids expire after a time you choose, and keep the queue and seen ids in a file or database so a restart does not lose them. Add a test that submits the same id before and after a restart.'] },
    ],
  },
];
