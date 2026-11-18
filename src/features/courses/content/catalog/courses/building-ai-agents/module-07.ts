import type { Lesson, Project } from '../../../types';

// Module 7: Agent Planning and Multi-Step Execution (lessons 53 to 62, days 53 to 62) and project P5. Written 2026-11-18.
// Mika's Bike Shop in Naga City, the clinic, school and research examples, every customer, price, stock figure and note below are invented.
// Python samples are pure logic with a scripted stand-in for the model; each one was run with python3 and its output pasted. The JavaScript
// exercises run in Talino's own runner (no async, no network). Product facts sit in dated version notes that cite pages listed in
// docs/content/AGENTS_FACTS_A.md and AGENTS_FACTS_B.md.

const CHECKED = '2026-11-18';

const DOCS = {
  msWorkflows: { label: 'Microsoft Agent Framework: workflows', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/' },
  openaiTokens: { label: 'OpenAI: token counting', url: 'https://developers.openai.com/api/docs/guides/token-counting' },
  openaiUsage: { label: 'OpenAI Python SDK: the Responses usage type', url: 'https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_usage.py' },
  claudeHandleTools: { label: 'Claude API: handle tool calls', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls' },
  claudeStopReasons: { label: 'Claude API: handling stop reasons', url: 'https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons' },
  claudeErrors: { label: 'Claude API: errors', url: 'https://platform.claude.com/docs/en/api/errors' },
  claudePython: { label: 'Claude API: Python SDK', url: 'https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python' },
  claudeDefineTools: { label: 'Claude API: define tools', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools' },
  openaiRate: { label: 'OpenAI: rate limits', url: 'https://developers.openai.com/api/docs/guides/rate-limits' },
  langchainMigrate: { label: 'LangChain: migrate to v1', url: 'https://docs.langchain.com/oss/python/migrate/langchain-v1' },
  langgraphGraph: { label: 'LangGraph: Graph API', url: 'https://docs.langchain.com/oss/python/langgraph/graph-api' },
  langgraphPersistence: { label: 'LangGraph: persistence', url: 'https://docs.langchain.com/oss/python/langgraph/persistence' },
  langgraphInterrupts: { label: 'LangGraph: interrupts', url: 'https://docs.langchain.com/oss/python/langgraph/interrupts' },
  crewAgents: { label: 'CrewAI: agents', url: 'https://docs.crewai.com/en/concepts/agents' },
  crewCrews: { label: 'CrewAI: crews', url: 'https://docs.crewai.com/en/concepts/crews' },
  crewFlows: { label: 'CrewAI: flows', url: 'https://docs.crewai.com/en/concepts/flows' },
  owaspUnbounded: { label: 'OWASP: LLM10:2025 Unbounded Consumption', url: 'https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/' },
};

export const project: Project = {
  id: 'building-ai-agents-p5',
  title: 'Build a Research Agent',
  summary: 'Build an agent that takes a research request, breaks it into ordered tasks, searches a small set of notes with tools, analyses and organises what it finds, and writes a structured report with source references, inside limits that stop it from looping forever.',
  outcome: 'A research agent that plans, searches, analyses and reports with source references inside hard step, cost, time and repeat limits, with tests and a scripted-model run, which shows you can build and bound a multi-step agent.',
  unlockAfterDay: 62,
  steps: [
    {
      id: 'building-ai-agents-p5-s1',
      text: 'Objectives: build a research agent in Python (or JavaScript) that does six things in order: receive a request, break it into tasks with dependencies, search and read notes with tools, analyse what it read, organise the findings by theme, and write a structured report in which every finding names its source ids. The run must be bounded: a step cap, a cost budget, a timeout counter and repeated-action detection, so a stuck agent stops with a clear reason and a partial report. You must be able to run the whole thing without a paid API, with a scripted model that plays the part of the model. Use what you built in lessons 53 to 62: the plan validator and sorter (53 and 54), the claim-versus-evidence check (55), the parser (56), the pipeline (57), the router (58), failure kinds (59), retries (60), checkpoints (61) and the loop guard (62).',
    },
    {
      id: 'building-ai-agents-p5-s2',
      text: 'Tools and resources: Python 3.10 or later and a text editor. The scripted-model path needs no packages and no key, and it is enough for the whole project. Optional, for a real model: `pip install anthropic`, an `ANTHROPIC_API_KEY` in your environment (never in the file, and keep `.env` in `.gitignore`), the model id in one constant, and the Claude pages on defining tools and handling tool calls (platform.claude.com, under agents-and-tools/tool-use). The code you need is in this module: `plan.py` (lesson 54), `react.py` (56), `pipeline.py` (57), `router.py` (58), `failures.py` (59), `retry.py` (60), `checkpoint.py` (61) and `loop_guard.py` with `demo.py` (62). A `ScriptedModel` is a teaching stand-in that returns prepared replies in the shape a real model would give. It is not a model, and a run with it only proves your logic, not the quality of any model’s answers.',
    },
    {
      id: 'building-ai-agents-p5-s3',
      text: 'Sample data and the report shape: use these invented notes, or write your own five. S1 “A basic tune-up takes about 90 minutes and the bike must be dropped off by 9:00.” S2 “The supplier restocks chains and inner tubes every Tuesday; chains usually arrive within 3 days.” S3 “Customers like Saturday morning slots; two asked for evening slots.” S4 “The booking service sometimes times out on Saturdays between 8:00 and 9:00.” S5 “Old supplier price sheet: chain ₱450, inner tube ₱180, last updated in March.” Request: “What do our notes say about Saturday bookings and about restocking chains and tubes?” Two tools: `search_notes(query)` returns a list of `{id, title, snippet}`, and `read_note(id)` returns the note text or a `not_found` failure. The report is a structure with `question`, `findings` (each with `theme`, `statement` and `sources`), `gaps` (what the notes do not say), `sources_read` and `stopped_because`.',
    },
    {
      id: 'building-ai-agents-p5-s4',
      text: 'Build step 1, plan and order: have the scripted model return a plan as JSON with an id, a tool and `depends_on` for each step: search for Saturday, search for restock, read the notes that came back, analyse, organise, write the report. Validate the plan with your validator from lesson 53 (allow-listed tools, dependencies that exist, a step limit) and order it with your sorter from lesson 54. Give the scripted model a first plan that is out of order and a second plan with an unknown tool, and show that your code orders the first and rejects the second. Cap the number of times a plan can be asked for again, and say what happens when the cap is reached.',
    },
    {
      id: 'building-ai-agents-p5-s5',
      text: 'Build step 2, search, analyse and organise: run the ordered steps. Searching and reading go through your tool functions, and every call and result is written to a log by your code, not by the model. Handle failures by kind (lesson 59): make `read_note` fail with `not_found` for an id that does not exist, and make `search_notes` time out once and succeed on the retry, using the backoff delays from lesson 60 (record the waits, do not sleep). Analysis extracts short statements and attaches the id of the note each came from. Organising groups the statements by theme. A failed read must show up later as a gap in the report, never as a made-up finding.',
    },
    {
      id: 'building-ai-agents-p5-s6',
      text: 'Build step 3, report and limits: write the report in the shape from the sample-data step. Before the report is returned, run your claim-versus-evidence check from lesson 55: every source id named in a finding must appear in the log of notes that were really read, and any finding that does not pass is removed or flagged. Wrap the whole run in the loop guard from lesson 62 with a step cap, a cost budget, a timeout counter and repeated-action detection. Add a stuck scripted model that keeps searching the same words, and show that the run stops with a reason, a partial report that lists what was found so far, and a note that it is incomplete. Optionally save a checkpoint after each step (lesson 61) and show a resume after a simulated crash.',
    },
    {
      id: 'building-ai-agents-p5-s7',
      text: 'Guided AI prompts: use your own assistant as a critic, never as the author, and put your own code or details in the brackets. (1) “Review my research-agent loop for ways it could run forever or spend too much. Here is the code: [paste]. List each risk and the exact line or limit that handles it, or say it does not.” (2) “Here is my report and my log of tool calls: [paste both]. List every claim in the report and say whether the log supports it. Do not assume anything the log does not show.” (3) “Suggest eight test cases for this agent, including a stuck model, an unknown tool, a failed read and a source id that was never read. For each give the input and the expected stop reason or result.” Check every answer yourself. An assistant can be wrong, and your submission is judged on your own checks and changes.',
    },
    {
      id: 'building-ai-agents-p5-s8',
      text: 'Deliverables: paste into your submission (1) your code, as one file or a few small files, or a complete written design if you cannot run code; (2) a sample run on the scripted model that shows the plan, the ordered steps, the tool log and the final report, labelled as a scripted run; (3) a second run with the stuck scripted model that shows the guard stopping it and the stop reason; (4) at least five test cases with the input and the result you got, including at least one that failed at first; (5) a short note on what you changed after a failure and why, and what you would still not trust the agent to do on its own.',
    },
    {
      id: 'building-ai-agents-p5-s9',
      text: 'Assessment criteria: a reviewer checks that the plan is data and is validated and ordered by code; that every finding cites a source id the log shows was really read; that the run is bounded by a step cap, a cost budget, a timeout counter and repeated-action detection, with a clear stop reason and a partial result; that failures are handled by kind, with a labelled gap in the report when something could not be found; and that your own tests, your changes after a failure and your notes are in the submission. Your choices and what you verified matter more than how large the program is.',
    },
    {
      id: 'building-ai-agents-p5-s10',
      text: 'Common mistakes: letting the model decide when to stop, with no limit in code; writing the limit in the prompt only; trusting the model’s statement that it read a note when the log shows it did not; filling a gap with a guess instead of reporting it; retrying a call whose arguments are wrong; sending an observation’s text back into the plan as if it were an instruction; checking the report’s format but not its sources; testing only the happy path; and pasting an assistant’s code or report without running or checking it. If your run never stops on the stuck model, the guard is not being consulted before each step.',
    },
    {
      id: 'building-ai-agents-p5-s11',
      audience: { max: 'beginner' },
      text: 'A smaller version: use only three notes (S1, S2 and S4) and one question. Keep the plan to four steps, use the scripted model only, and skip retries and checkpoints. You still need the validated and ordered plan, a log written by your code, a report in which each finding names a source id, and a loop guard with a step cap and repeated-action detection. Run the stuck model once and write one sentence for each limit saying what it stops. Copy the building blocks from lessons 54 and 62 and change one thing at a time.',
    },
    {
      id: 'building-ai-agents-p5-s12',
      audience: { min: 'advanced' },
      text: 'A professional extension: write a test for each stop reason (max steps, cost budget, timeout with a fake clock, repeated action, finish), keep a trace of every step with the tool, the validated input, the observation and the duration (redact anything that could be personal data), and show a checkpoint and resume with an idempotency key for any step that has an effect. Add a short threat note: what an untrusted note could try to make the agent do (the note text is data, never instructions), where excessive agency could appear if you added a tool that changes something, and which of your limits address unbounded consumption. Say what a security reviewer should look at before this agent is used on real documents.',
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your research agent',
    placeholder: 'Paste your code or written design, a scripted sample run with the tool log and report, the stuck-model run, your test cases and your notes.',
    hint: 'A good submission has the code (or a complete design), a labelled scripted run with the plan, the ordered steps, the tool log and a report whose findings cite source ids, a stuck-model run that shows a stop reason and a partial report, at least five test cases (including one that failed first), and notes on what you changed after a failure.',
  },
  rubric: [
    'The request is broken into tasks as data (ids, tools, dependencies), and code validates the plan and orders it before anything runs, with a cap on re-asking for a plan.',
    'Every finding in the report names a source id that the log of tool calls shows was really read, and a finding without one is removed or flagged.',
    'The run is bounded by a step cap, a cost budget, a timeout counter and repeated-action detection, and a stuck scripted model shows it stopping with a clear reason and a partial, labelled-incomplete report.',
    'Tool failures are handled by kind (retry with backoff for temporary ones, a labelled gap for missing ones), and the report says what could not be found instead of guessing.',
    'The submission shows the learner’s own tests (at least five), a scripted run labelled as scripted, and what was changed after a failure.',
    'The report is structured (question, findings with sources, gaps, how the run ended) and honest about what the notes do not say.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The small version runs end to end on the scripted model, and the learner can say in their own words what each limit stops.', 'At least two test cases are included, and one of them makes the agent stop.'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['A checkpoint and resume after a simulated crash, or a second tool, is added and tested, and one variation of the input is compared with the first run.'] },
    { audience: { min: 'advanced' }, items: ['There is a test for each stop reason, a redacted trace of every step, and an idempotency key for any step with an effect.', 'A short threat note covers untrusted note text, excessive agency and unbounded consumption, and says what a security reviewer should check.'] },
  ],
};

export const lessons: Lesson[] = [
  {
    id: 'building-ai-agents-53',
    day: 53,
    title: 'How AI Agents Plan Tasks',
    summary: 'Treat a plan as data: an ordered list of steps with tools, inputs and dependencies that your code checks before anything runs.',
    intro: {
      objectives: [
        'Explain a plan as an ordered list of steps, each with a tool, inputs and what must happen first',
        'Tell a fixed plan, a plan written first and a plan made as you go apart, and say what each costs',
        'Check a plan with code before any step runs',
      ],
      why: 'An agent that acts without a written plan can wander, repeat itself or do things in the wrong order. A plan is a small piece of data you can read, check and stop, which makes a long task safer and cheaper to run.',
    },
    minutes: 20,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'A customer asks Mika’s agent to book a tune-up and quote a new chain. What does the agent do first? If nobody decided, the model picks the order, and you find out by reading the log afterwards. With a plan, you can read what is about to happen before it happens, and refuse it if it is wrong. This lesson shows what a plan is, three ways to get one and how to check one with code.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika’s shop agent can check stock, get a price and book a slot (the tools from module 4). A customer writes: “Tune-up for my commuter bike on Saturday morning, and I think I need a new chain. What is the total?” The agent has no plan. It sees the word “book”, books Saturday at 9:00 first, then checks stock and finds the chain is sold out. A booking now exists for a job that cannot be finished. Mika deletes it by hand. Next week she makes the agent write its plan first, as data: stock, price, quote, and a booking only after the customer says yes. Same tools, same model. The problem went away because the order was written down and a rule said what must come first.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'A **plan** is an ordered list of steps an agent means to take to reach a goal. Each step names a tool, the inputs for it and anything that must happen before it. A step that must wait for another has a **dependency**: booking depends on the quote, and the quote depends on the stock check and the price. Earlier, in Planning and Task Decomposition, you met planning as an idea. From here on a plan is data: a JSON object your code can read, check, run one step at a time and stop.' },
      { type: 'paragraph', text: 'There are three common ways to get a plan, and the simplest one that works is the one to pick.' },
      { type: 'list', items: [
        '**Fixed plan.** A developer wrote the steps in code: check stock, get price, write quote. No model plans. It is cheap and predictable, and it cannot handle a case nobody wrote down.',
        '**Plan first, then run** (often called plan-and-execute). The model writes the whole plan as JSON before any tool runs. Your code checks it, a person may read it, then the steps run. It costs one extra model call, and the plan can go stale if a tool result changes the situation.',
        '**Plan as you go.** The model chooses one step at a time after it sees the last result. It adapts well, but it costs a model call per step, the path is hard to predict and it needs hard limits (lesson 62). ReAct (lesson 56) is the best-known form.',
      ] },
      { type: 'paragraph', text: 'An analogy, with its limit. A fixed plan is a recipe card. A plan written first is a shopping list you can read before you spend. A plan made as you go is walking through the market and deciding at each stall. The limit: a model does not intend or look ahead like a shopper. It writes text that looks like a plan, and that text can be wrong, out of order or missing a step. Your code never trusts it blindly.' },
      { type: 'diagram', format: 'mermaid', caption: 'A written plan is checked by code before it runs. If the check finds problems, they go back to the model, a few times at most.', source: ['flowchart TD', '  A[Goal from the customer]', '  B[Model writes a plan as JSON]', '  C{Does the code accept the plan?}', '  D[Send the problem list back]', '  E[Run the steps in order]', '  F{Finished or a limit reached?}', '  G[Answer or report]', '  A --> B', '  B --> C', '  C -->|no| D', '  D --> B', '  C -->|yes| E', '  E --> F', '  F -->|more steps| E', '  F -->|finished| G'].join('\n') },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: a plan is a to-do list where every line says which tool to use and what must be finished first. Think of cooking rice and fried egg for breakfast. You start the rice first because it takes longest, and you cannot serve until both are ready. “Serve” depends on “rice” and “egg”. A plan lets the program (and you) see that order before the cooking starts. The model writes the list. The program checks it, like a cook who reads the recipe through once before turning on the stove. If a line uses a tool the shop does not have, the program stops and says so.' },
      { type: 'heading', text: 'What a good plan holds, and how to check it' },
      { type: 'paragraph', text: 'A useful plan has a goal in one sentence, steps (each with an id, a tool, inputs and `depends_on`), an **end condition** that says when the work is done, such as “the quote is written and the customer answered”, and a limit on the number of steps. Before any step runs, code checks four things. Every tool name is on your allow-list. Every dependency points to a step that exists. No step depends on itself. The step count is under the limit. Lesson 54 adds a fifth check: that an order can be worked out at all. These checks are plain code. They need no model and cost almost nothing.' },
      { type: 'paragraph', text: 'A plan that passes is only well formed, not wise. A valid plan can still message every customer or issue a refund, because those tools are on the list. For steps with side effects (money, messages, deletions), a person should see the plan first. Module 11 covers human approval.' },
      { type: 'version', text: 'Microsoft’s Agent Framework documentation describes workflows as defining explicit, inspectable execution paths for coordinating code, agents, state, events and human input. That is one named example of the idea in this lesson (a path you can read before it runs). Frameworks change quickly, so read the page rather than relying on this summary.', checked: CHECKED, sources: [DOCS.msWorkflows] },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'In a real system the plan is part of the state you log and replay. Store the plan, the validation result and the plan version with each run, so a bad outcome can be traced to a bad plan or to a bad step. Keep the validator separate from the planner and treat the model’s plan as untrusted input, like a form submitted by a user. Cap re-planning (for example three attempts) so a stubborn model cannot loop on invalid plans. Remember what a plan hides: dependencies on data that only exist after a tool runs, such as “book the slot the stock check recommends”. Those cannot be written into a plan first, which is why many agents plan a few steps, run them, and plan again.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'A plan for Mika’s agent, written by hand as an illustration',
        prompt: 'Goal: Quote a Saturday tune-up and a new chain for one customer.\nTools you may use: check_stock, get_price, write_quote, ask_customer, book_slot.\nReturn a plan as JSON with steps that have id, tool and depends_on.',
        output: '{\n  "goal": "Quote a Saturday tune-up and a chain",\n  "steps": [\n    {"id": "s1", "tool": "check_stock", "depends_on": []},\n    {"id": "s2", "tool": "get_price", "depends_on": ["s1"]},\n    {"id": "s3", "tool": "write_quote", "depends_on": ["s1", "s2"]},\n    {"id": "s4", "tool": "ask_customer", "depends_on": ["s3"]},\n    {"id": "s5", "tool": "book_slot", "depends_on": ["s4"]}\n  ],\n  "done_when": "the customer has answered the quote"\n}',
        notice: 'Look at s5: booking waits for the customer’s answer, which is the rule Mika was missing. Then ask what the plan cannot say. It does not say what to do if s1 finds the chain out of stock. A plan written first is blind to that until a tool runs.',
      },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: 'Pick a goal for an agent you want to build, or use Mika’s. Write the tools it has, then ask your own assistant to draft a plan, and read the plan as a skeptic. Do not run anything.' },
      { type: 'prompt', label: 'Review a plan before any tool runs', text: 'Act as a careful reviewer of agent plans. My agent’s goal: [goal in one sentence]. Its tools: [tool names, each with what it does and whether it has side effects]. Write a plan as a numbered list. For each step give the tool, the inputs, what must be done first and how I will know the step worked. Then list three ways this plan could go wrong, and which steps I should show a person before they run. Use only the tools I listed. If you are unsure about something, say “I am not sure” instead of guessing.' },
      { type: 'list', items: [
        'Cross out any step that uses a tool you did not list. A model often invents a convenient one.',
        'Mark each step that spends money, sends a message or deletes something. Those need a person.',
        'Draw an arrow from each step to the steps it depends on. If you cannot, the order is a guess.',
      ] },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write a plan for one real task of yours on paper, with ids and dependencies, before reading the next lesson.',
        'Next comes Task Decomposition (lesson 54), where you turn a big request into ordered subtasks and put the order in code.',
        'Read the LangGraph Graph API page to see how one framework names nodes, edges and state, then compare it with your own plan format.',
      ] },
      { type: 'takeaways', items: [
        'A plan is data: an ordered list of steps, each with a tool, inputs and dependencies, that code can read and check.',
        'Pick the simplest style that works: a fixed plan first, a written plan when jobs vary, plan-as-you-go only when each result decides the next step.',
        'A model’s plan is text that looks like a plan, so check it with code before anything runs.',
        'A valid plan is not a safe plan: steps with side effects need a person to see them first.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-53-scenario-1',
          kind: 'scenario',
          title: 'Move the appointment without losing it',
          prompt: 'Choose the best design for the job.',
          concept: 'choosing a plan style',
          situation: 'A small clinic (invented) wants an agent to move a patient’s appointment. The steps are always the same: find a free slot on the new day, book it, cancel the old booking, send the patient a reminder. The order matters, because a patient must never end up with no appointment. A colleague suggests letting the model decide each step as it goes.',
          options: [
            { text: 'Write the four steps in code as a fixed plan, with “cancel the old booking” depending on “book the new slot”, and use the model only to write the reminder text.', consequence: 'The order is guaranteed, the run is cheap and easy to test, and nobody has to trust a model with the order. The model is used where wording is needed.', quality: 'best' },
            { text: 'Let the model write the plan as JSON each time, then have code check that cancel depends on book before running it.', consequence: 'This works and the check protects the order. It adds a model call and a validator for a job whose steps never change, so it is more than the job needs.', quality: 'acceptable' },
            { text: 'Let the model choose each step as it goes, with all four tools available.', consequence: 'Most days it works. One day it cancels first, the booking tool times out, and a patient has no appointment. You gave freedom to a job that needed none.', quality: 'poor' },
            { text: 'Ask the model to plan, and run whatever it returns, because the tools are limited to the four above.', consequence: 'A short tool list does not fix the order. A plan that cancels before booking uses only allowed tools and still harms the patient.', quality: 'poor' },
          ],
          hints: [
            'Do the steps change from patient to patient?',
            'If the steps and the order never change, who needs to choose them?',
            'The simplest thing that works is a fixed plan with the dependency written in code.',
          ],
          explanation: 'When the steps and their order are always the same, a fixed plan is the cheapest and safest choice. A written plan can fix the order too, but it adds a model call and a validator the job does not need. A free-running loop leaves the order to chance, and short tool lists do not protect an order.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-53-match-1',
          kind: 'match',
          title: 'Which plan style fits the job',
          prompt: 'Match each situation to the plan style that fits it best.',
          concept: 'plan styles',
          labels: { terms: 'Situation', meanings: 'Plan style' },
          pairs: [
            { term: 'Every repair quote follows the same four steps in the same order.', definition: 'Fixed plan', note: 'If nothing varies, nobody needs to write a new plan.' },
            { term: 'Customers send unusual, multi-part requests, and the owner wants to read the steps before anything runs.', definition: 'Plan first, then run', note: 'The plan has to exist as data before any step runs, so a person can read it.' },
            { term: 'Which shop to search next depends on what the previous search returned.', definition: 'Plan as you go', note: 'The next step cannot be written until the last result is known.' },
          ],
          hints: [
            'Ask: can the steps be written before any tool runs?',
            'If yes and they never change, it is fixed. If yes but they change each time, a model writes them first.',
            'If the next step depends on a result you do not have yet, you cannot plan it first.',
          ],
          explanation: 'The question is when the steps can be known: always, before the run starts, or only after each result. That answer tells you the cheapest style that works.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-53-code-challenge-1',
          kind: 'code-challenge',
          title: 'Check a plan before it runs',
          story: 'The model has written a plan as JSON. You check it with code. Plans here are plain data, so no model runs in this exercise.',
          prompt: 'Write `validatePlan(plan, allowedTools, maxSteps)` and return an array of problem strings, empty if the plan is fine. If `plan.steps` is missing or empty, return `["the plan has no steps"]` straight away. Otherwise, first add `"too many steps: N (limit M)"` if there are more than `maxSteps`. Then for each step in order: add `"<id>: duplicate id"` if the id was seen before, `"<id>: unknown tool <tool>"` if the tool is not in `allowedTools`, and for each name in `depends_on`: `"<id>: depends on itself"` if it is the step’s own id, or `"<id>: missing dependency <name>"` if no step has that id.',
          concept: 'plan validation',
          language: 'javascript',
          starter: "function validatePlan(plan, allowedTools, maxSteps) {\n  const problems = [];\n  // 1. no steps: return ['the plan has no steps']\n  // 2. too many steps\n  // 3. for each step: duplicate id, unknown tool, self dependency, missing dependency\n  return problems;\n}",
          solution: "function validatePlan(plan, allowedTools, maxSteps) {\n  const problems = [];\n  if (!plan.steps || plan.steps.length === 0) {\n    return ['the plan has no steps'];\n  }\n  if (plan.steps.length > maxSteps) {\n    problems.push('too many steps: ' + plan.steps.length + ' (limit ' + maxSteps + ')');\n  }\n  const ids = plan.steps.map((step) => step.id);\n  const seen = new Set();\n  for (const step of plan.steps) {\n    if (seen.has(step.id)) {\n      problems.push(step.id + ': duplicate id');\n    }\n    seen.add(step.id);\n    if (!allowedTools.includes(step.tool)) {\n      problems.push(step.id + ': unknown tool ' + step.tool);\n    }\n    for (const dep of step.depends_on) {\n      if (dep === step.id) {\n        problems.push(step.id + ': depends on itself');\n      } else if (!ids.includes(dep)) {\n        problems.push(step.id + ': missing dependency ' + dep);\n      }\n    }\n  }\n  return problems;\n}",
          tests: {
            kind: 'function',
            fn: 'validatePlan',
            cases: [
              { label: 'a good plan', args: [{ steps: [{ id: 's1', tool: 'check_stock', depends_on: [] }, { id: 's2', tool: 'get_price', depends_on: ['s1'] }] }, ['check_stock', 'get_price', 'book_slot'], 5], expected: [] },
              { label: 'an empty plan', args: [{ steps: [] }, ['check_stock'], 5], expected: ['the plan has no steps'] },
              { label: 'an unknown tool', args: [{ steps: [{ id: 's1', tool: 'refund_all', depends_on: [] }] }, ['check_stock', 'get_price'], 5], expected: ['s1: unknown tool refund_all'] },
              { label: 'a missing dependency', args: [{ steps: [{ id: 's1', tool: 'get_price', depends_on: ['s9'] }] }, ['get_price'], 5], expected: ['s1: missing dependency s9'] },
              { label: 'too many steps', args: [{ steps: [{ id: 's1', tool: 'get_price', depends_on: [] }, { id: 's2', tool: 'get_price', depends_on: [] }, { id: 's3', tool: 'get_price', depends_on: [] }] }, ['get_price'], 2], expected: ['too many steps: 3 (limit 2)'] },
              { label: 'a duplicate id', args: [{ steps: [{ id: 's1', tool: 'get_price', depends_on: [] }, { id: 's1', tool: 'book_slot', depends_on: [] }] }, ['get_price', 'book_slot'], 5], expected: ['s1: duplicate id'], hidden: true },
              { label: 'a step that depends on itself', args: [{ steps: [{ id: 's1', tool: 'get_price', depends_on: ['s1'] }] }, ['get_price'], 5], expected: ['s1: depends on itself'], hidden: true },
              { label: 'two problems in one plan', args: [{ steps: [{ id: 's1', tool: 'delete_all', depends_on: ['s7'] }] }, ['get_price'], 5], expected: ['s1: unknown tool delete_all', 's1: missing dependency s7'], hidden: true },
            ],
          },
          hints: [
            'Return early for the empty plan. Then build `ids` with `plan.steps.map((step) => step.id)` so you can ask whether a dependency exists.',
            'Keep a `Set` of ids already seen. A step is a duplicate if its id is in the set before you add it.',
            'For each `dep` in `step.depends_on`, test `dep === step.id` first, then `!ids.includes(dep)`, and push the exact message text from the prompt.',
          ],
          explanation: 'Every check is plain code over data: no model, no tool, no cost. This is why a written plan is useful: it turns “what will the agent do?” into a question you can answer before it does anything. The validator proves a plan is well formed, not that it is wise.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-53-q1',
        prompt: 'In Mika’s case the agent booked a slot before it knew the chain was out of stock. Which change would have prevented that most directly?',
        choices: [
          'A plan where booking depends on the stock check and the quote, and code refuses to run a step early',
          'A longer system instruction telling the model to be careful, while the tools still run in whatever order the model asks for them',
          'A larger model, because a stronger model is less likely to choose the steps in the wrong order on any given day of the week',
          'A lower temperature setting, so that the model picks the same first step each time and every run becomes repeatable',
        ],
        answer: 0,
        explanation: 'A dependency enforced by code guarantees the order. Instructions, bigger models and lower temperature only make a wrong order less likely, and none of them can refuse a step.',
      },
      {
        id: 'building-ai-agents-53-q2',
        prompt: 'The model returns a plan where step s4 depends on s7, but no step has id s7. What should your code do?',
        choices: [
          'Run s1 to s3 and skip s4, since the rest of the plan looks fine and the customer is already waiting for an answer from the shop',
          'Delete the missing dependency from s4 and run the plan, because the model clearly meant s4 to be ready to go right now',
          'Run s4 anyway after the others, on the guess that s7 was a typo for a step that has already finished earlier in the plan',
          'Reject the plan, send “s4: missing dependency s7” back to the model, and allow only a few retries',
        ],
        answer: 3,
        explanation: 'A plan with a broken reference is not a plan you can trust, and patching it silently hides the error. Returning the exact problem lets the model correct it, and the cap stops an endless loop.',
      },
      {
        id: 'building-ai-agents-53-q3',
        prompt: 'A plan was written first. After step 2, the price tool reports that the chain is discontinued, which the plan did not expect. Which design copes best?',
        choices: [
          'Plan as you go, or re-plan after each result, because the next step depends on what the tool returned',
          'A fixed plan, because it will repeat the same steps exactly as written and nothing can change them',
          'Plan first and run it to the end, because a plan that has been validated should never be changed halfway',
          'Run the whole plan twice so that the second run overwrites any wrong result from the first run',
        ],
        answer: 0,
        explanation: 'A plan written before the run cannot know what a tool will say. When results change the situation, the agent must be able to adapt: re-plan or choose the next step after each result.',
      },
      {
        id: 'building-ai-agents-53-q4',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a plan for an agent?',
        choices: [
          'A secret list of thoughts the model has before it speaks, which only the model can see and check',
          'A to-do list as data: steps in order, each with a tool, its inputs and what must be finished first',
          'A promise from the model that every step will succeed, as long as the tools are connected correctly',
          'A longer prompt that tells the model to think harder before it uses any tool in the list',
        ],
        answer: 1,
        explanation: 'A plan is written down as data so people and code can read and check it. It is not hidden thought and it is not a promise.',
      },
      {
        id: 'building-ai-agents-53-q5',
        audience: { min: 'advanced' },
        prompt: 'Your validator accepts any plan whose tool names are on the allow-list and whose dependencies exist. A reviewer says that is not enough for a plan that includes send_email. Why?',
        choices: [
          'Allow-lists are only meant for the model’s own text, so they never apply to tool names that appear inside a plan written as data',
          'A plan containing send_email would already be rejected by any validator that checks dependencies, so the reviewer is simply wrong',
          'A well-formed plan can still email the wrong people, so side effects need argument checks and a person’s approval',
          'The validator should call the model a second time to ask whether the plan is safe, and then trust whatever answer it gives',
        ],
        answer: 2,
        explanation: 'Validation proves shape, not wisdom. A permitted tool with harmful arguments or order still does harm, so side effects need argument validation and human approval. Asking the model to judge its own plan is not a control.',
      },
    ],
    task: {
      title: 'Write a plan, then break it on purpose',
      minutes: 15,
      steps: [
        'Choose a goal for your own agent, or use Mika’s (“quote a tune-up and a chain”). List its tools, with one line on what each does.',
        'Write a plan by hand as JSON with four to six steps. Give each step an id, a tool and `depends_on`, and add a `done_when` sentence.',
        'Copy the solution from the code exercise into a file called `validate_plan.js`, add a `console.log` that calls it with your plan, and run `node validate_plan.js`. Fix what it reports.',
        'Change it and observe: rename one tool to a name that is not on your list, point one dependency at a missing id and lower `maxSteps` to one less than your plan. Note which messages appear.',
        'Reflect: which of your steps would you show to a person before it runs, and why?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Start with a plan of exactly three steps for a task you do every day, for example making breakfast. Use `depends_on` to say what must be finished first, and run the validator on it.'] },
      { audience: { min: 'advanced' }, steps: ['Add a cycle check to the validator (a step that depends on a later step that depends on it) and a limit on the length of any dependency chain. Write down one plan that passes your validator and is still a bad idea, and what control would catch it.'] },
    ],
  },
  {
    id: 'building-ai-agents-54',
    day: 54,
    title: 'Task Decomposition',
    summary: 'Split a big request into small subtasks with dependencies, then put them in a safe order with code instead of trusting the model’s order.',
    intro: {
      objectives: [
        'Split a request into subtasks that each have one tool, one result and one check',
        'Put subtasks in a valid order with a dependency sort, and detect a cycle',
        'Run reads before writes so nothing irreversible happens early',
      ],
      why: 'Small steps are easier to check, retry and resume than one large step. Writing the order in code means a model’s mistake in ordering cannot reach your customer.',
    },
    minutes: 22,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'A customer writes: “My daughter’s bike makes a clicking noise, the front tyre is soft, and I need it by Friday. What will it cost?” Is that one task or four? An agent that treats it as one task tends to answer the part that is easiest to say and forget the rest. An agent that splits it up can check each piece, retry one piece that failed and show the customer what it did. This lesson builds that skill and the code that orders the pieces.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika asks her agent to handle the clicking-noise message in one go. It replies with a price for a tyre tube and says nothing about the noise or Friday. She then asks the model to split the request into subtasks as JSON. The first attempt is better but flawed: the quote step comes before the price step it needs, and one step uses a tool called `diagnose_noise` that the shop does not have. Mika adds two small functions in plain code: a validator that rejects unknown tools and missing dependencies, and a sorter that puts the steps in a valid order. The model no longer has to get the order right. The code guarantees it.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Task decomposition** means splitting a goal into smaller subtasks. A good subtask has one tool or one decision, a result you can check and a clear owner of the next step. Small steps are easier to test, easier to retry when one fails and easier to resume after a crash. Planning and Task Decomposition (lesson 12) introduced the idea. Here you make it executable.' },
      { type: 'paragraph', text: 'A method you can use tomorrow:' },
      { type: 'list', ordered: true, items: [
        'Write the goal in one sentence: “Give a price and a Friday slot for a clicking noise and a soft front tyre.”',
        'List what you must **find out** (stock, prices, free slots) and what you must **change** (a booking, a message). Finding out is read-only. Changing is not.',
        'Give each item one tool from your list and say what a good result looks like.',
        'Mark **dependencies**: a quote needs the stock check and the price, so it comes after them.',
        'Put the steps that change something last, after every check. Read before write.',
        'Order the steps with a **topological sort**: an order in which every step comes after the steps it depends on.',
      ] },
      { type: 'paragraph', text: 'The sort in words: look at the steps in list order and pick the first one whose dependencies are all done. Mark it done, add it to the result and repeat. If no step is ready but some remain, there is a **cycle**: two steps wait for each other, so no order exists. Reject the plan.' },
      { type: 'paragraph', text: 'Size matters, and there are two ways to get it wrong.' },
      {
        type: 'table',
        headers: ['Size', 'Example step', 'The problem'],
        rows: [
          ['Too big', '“Handle the customer’s request”', 'No tool, no result to check, no way to retry only the part that failed'],
          ['About right', '“Get the price of an inner tube with get_price and check it is a number”', 'One tool, one result, one check'],
          ['Too small', '“Read the first word of the customer’s message”', 'A model call or a tool call for no gain; cost and delay add up'],
        ],
        caption: 'A good size for a step: one tool call or one decision, with a result you can check.',
      },
      { type: 'paragraph', text: 'Who does the splitting? For a job that is always the same, a developer, in code. For varied jobs, the model writes the subtasks as JSON, and your validator from lesson 53 checks them. The model’s order is a suggestion. Your sorter decides the final order, because sorting is exact and free while asking a model to fix its own order costs a call and may fail.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, here is what the code below does, line by line. `ALLOWED_TOOLS` is the list of tools the shop has. `ScriptedModel` is a stand-in that hands back a prepared plan, as if a model had written it; it is not a model. `validate` goes through every step and writes down a problem if a tool is not on the list or a step waits for a step that does not exist. `order` keeps looking for a step that is ready (all steps it waits for are finished), moves it to the result list and repeats, like crossing items off a to-do list. The model listed step s3 first, but the program puts s1 first, because s3 has to wait.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Decomposition quality is the weak point of model-written plans: a model may merge steps, invent a tool, omit a check or write a dependency that does not exist. Validate every plan, cap re-asks, and log the plan with its validation result. The sort above is quadratic, which is fine for tens of steps. Steps with no dependency path between them could run in parallel, but only if their tools are safe to run together (read-only or idempotent) and their results are merged by step id, not by arrival time. Also decide what happens when a result changes the plan, for instance a discontinued part: you may need to re-decompose from that step on, keeping the completed steps.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will validate and order a model-written plan with a scripted model. It needs only Python 3.10 or later and no packages or keys. Save the first block as `plan.py`.' },
      { type: 'code', language: 'python', label: 'plan.py, part 1', code: String.raw`import json

ALLOWED_TOOLS = {"check_stock", "get_price", "book_slot", "write_quote"}


class ScriptedModel:
    """A teaching stand-in, not a model: it returns a prepared plan as JSON text."""

    def __init__(self, replies):
        self.replies = list(replies)

    def complete(self, prompt):
        return self.replies.pop(0)


PLAN_TEXT = json.dumps({
    "goal": "Saturday tune-up and a new chain for one customer",
    "steps": [
        {"id": "s3", "tool": "write_quote", "depends_on": ["s1", "s2"]},
        {"id": "s1", "tool": "check_stock", "depends_on": []},
        {"id": "s2", "tool": "get_price", "depends_on": ["s1"]},
        {"id": "s4", "tool": "book_slot", "depends_on": ["s3"]},
    ],
})


def validate(plan):
    problems, ids = [], [s["id"] for s in plan["steps"]]
    for step in plan["steps"]:
        if step["tool"] not in ALLOWED_TOOLS:
            problems.append(f"{step['id']}: unknown tool {step['tool']}")
        for dep in step["depends_on"]:
            if dep not in ids:
                problems.append(f"{step['id']}: missing dependency {dep}")
    return problems
` },
      { type: 'paragraph', text: 'Add this below the previous block, in the same file.' },
      { type: 'code', language: 'python', label: 'plan.py, part 2', code: String.raw`def order(plan):
    done, result = set(), []
    while len(result) < len(plan["steps"]):
        ready = [s for s in plan["steps"] if s["id"] not in done and all(d in done for d in s["depends_on"])]
        if not ready:
            raise ValueError("cycle in the plan")
        done.add(ready[0]["id"])
        result.append(ready[0]["id"])
    return result


model = ScriptedModel([PLAN_TEXT])
plan = json.loads(model.complete("Plan the job for Mika's customer"))
problems = validate(plan)
print("problems:", problems)
if not problems:
    print("run order:", order(plan))
` },
      { type: 'paragraph', text: 'The important lines: `json.loads` turns the model’s text into data and fails loudly if it is not JSON (no `eval`, ever). `validate` rejects unknown tools and missing dependencies before anything runs. In `order`, `ready[0]` takes the first ready step in list order, so independent steps keep the order the model gave. The `ValueError` is the cycle detector: steps remain but none is ready.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `problems: []
run order: ['s1', 's2', 's3', 's4']` },
      { type: 'list', items: [
        'If you see `python: command not found`, run it with `python3 plan.py`.',
        'If `problems` is not empty, read the message. A tool name is missing from `ALLOWED_TOOLS`, or a `depends_on` names an id that no step has. Fix the plan text.',
        'If you get `ValueError: cycle in the plan`, two steps wait for each other. Change one `depends_on` so the chain has an end.',
        'If the order is not what you expect, remember that `order` picks the first ready step in the list, so move a step earlier in the list to change the tie-break.',
      ] },
      { type: 'warning', text: 'A plan is text from a model, so it is untrusted input. Parse it as JSON, never run it with `eval` or `exec`, allow only tools on your list and cap the number of steps. A valid plan that includes `book_slot` or any message-sending tool should still be shown to a person before it runs. The scripted model here only teaches the logic. A real model’s plans will be wrong more often than this one.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Change the plan text so `s4` depends on a step that does not exist, and read the message. Then add a cycle and read that error.',
        'Next is Understanding Reasoning and Planning (lesson 55): what a model’s “reasoning” really is, and why you check it against evidence.',
        'Read the LangGraph Graph API page to see how a framework stores steps and the edges between them.',
      ] },
      { type: 'takeaways', items: [
        'Split a goal into subtasks that each have one tool, one result you can check and clear dependencies.',
        'Order steps with a dependency sort in code. The model’s order is a suggestion, and a cycle means no valid order exists.',
        'Put steps that only read first and steps that change something last.',
        'Too big a step cannot be checked; too small a step wastes calls.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-54-code-challenge-1',
          kind: 'code-challenge',
          title: 'Order the steps',
          story: 'The model listed its steps in any order. You put them in a valid one. Plain data again, no model is run.',
          prompt: 'Write `orderSteps(steps)`. Each step is `{ id, depends_on }`. Return the ids in an order where every step comes after the steps it depends on. Among the steps that are ready, always take the first one in the list. If no valid order exists (a cycle, or a dependency that no step has), return `null`.',
          concept: 'dependency ordering',
          language: 'javascript',
          starter: "function orderSteps(steps) {\n  const done = new Set();\n  const order = [];\n  // repeat: find the first step that is not done and whose dependencies are all done\n  // if there is none, return null\n  return order;\n}",
          solution: "function orderSteps(steps) {\n  const done = new Set();\n  const order = [];\n  while (order.length < steps.length) {\n    let next = null;\n    for (const step of steps) {\n      if (!done.has(step.id) && step.depends_on.every((dep) => done.has(dep))) {\n        next = step;\n        break;\n      }\n    }\n    if (next === null) {\n      return null;\n    }\n    done.add(next.id);\n    order.push(next.id);\n  }\n  return order;\n}",
          tests: {
            kind: 'function',
            fn: 'orderSteps',
            cases: [
              { label: 'the quote example', args: [[{ id: 's3', depends_on: ['s1', 's2'] }, { id: 's1', depends_on: [] }, { id: 's2', depends_on: ['s1'] }, { id: 's4', depends_on: ['s3'] }]], expected: ['s1', 's2', 's3', 's4'] },
              { label: 'independent steps keep list order', args: [[{ id: 'x', depends_on: [] }, { id: 'y', depends_on: [] }]], expected: ['x', 'y'] },
              { label: 'a cycle has no order', args: [[{ id: 'a', depends_on: ['b'] }, { id: 'b', depends_on: ['a'] }]], expected: null },
              { label: 'a missing dependency has no order', args: [[{ id: 'a', depends_on: ['z'] }]], expected: null },
              { label: 'no steps', args: [[]], expected: [] },
              { label: 'a step ready late', args: [[{ id: 'c', depends_on: ['b'] }, { id: 'b', depends_on: ['a'] }, { id: 'a', depends_on: [] }]], expected: ['a', 'b', 'c'], hidden: true },
              { label: 'a ready step is taken before a blocked one', args: [[{ id: 'p', depends_on: ['q'] }, { id: 'r', depends_on: [] }, { id: 'q', depends_on: [] }]], expected: ['r', 'q', 'p'], hidden: true },
            ],
          },
          hints: [
            'Keep a `Set` of finished ids. Loop until `order` has as many ids as there are steps.',
            'Inside the loop, scan the steps in list order and take the first one that is not done and whose `depends_on` ids are all in the set. `every` helps.',
            'If the scan finds nothing, return `null`. Otherwise add the id to the set and to `order`, and go round again.',
          ],
          explanation: 'Each round finishes at least one step, or proves that none can run. A cycle and a missing dependency both end in the same place: nothing is ready, so there is no order. Taking the first ready step in list order keeps the result predictable.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-54-arrange-1',
          kind: 'arrange',
          title: 'A valid order for the clicking-noise job',
          prompt: 'These subtasks for Mika’s clicking-noise request arrived in a jumble. Put them in an order where every step has what it needs and nothing changes before the checks.',
          concept: 'read before write',
          language: 'text',
          solution: [
            'Check stock for the inner tube',
            'Get the price of the tube and of a basic tune-up',
            'Write a quote that uses the stock result and both prices',
            'Ask the customer to confirm the quote',
            'Book the Friday slot',
          ],
          reasons: [
            'A read-only check, and the quote needs its answer.',
            'Another read, and the quote needs the prices.',
            'The quote can only be written once stock and prices are known.',
            'A person decides before anything changes.',
            'The only step that changes the world, so it goes last.',
          ],
          hints: [
            'Start with the steps that only look things up.',
            'The quote needs the stock result and the prices, so it cannot come first.',
            'Booking is the step that changes something, so it comes after the customer says yes.',
          ],
          explanation: 'Reads first, then the step that combines them, then the person’s decision, then the one step that changes the world. If the run stops at any point before the last step, nothing has changed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-54-scenario-1',
          kind: 'scenario',
          title: 'How big should a step be',
          prompt: 'Choose the best way to split the job.',
          concept: 'step size',
          situation: 'A travel helper (invented) gets: “Plan a two-day trip to Sagada for three friends, within a budget.” Its tools are search_places, get_weather, estimate_cost and write_itinerary. Four decompositions are proposed.',
          options: [
            { text: 'Five steps: search places, get the weather for each day, estimate the cost of the chosen places, check the total against the budget, then write the itinerary. Each has one tool, a result to check and dependencies.', consequence: 'Each piece can be checked and retried alone. If the weather call fails, only that step is repeated. The itinerary is written last, from checked inputs.', quality: 'best' },
            { text: 'One step: “plan the trip”.', consequence: 'There is no tool, no result to check and no way to retry only the part that failed. It is the same as having no decomposition.', quality: 'poor' },
            { text: 'Forty steps, one per sentence of the itinerary and one per field of each cost.', consequence: 'Most steps do nothing useful but still cost a call and add delay. A failure somewhere in the middle is hard to read.', quality: 'poor' },
            { text: 'Three steps: search and weather together in one step, then costs and the budget check together, then the itinerary.', consequence: 'Workable. Two tools hide inside each early step, so a failure points at a pair of calls instead of one, and a retry repeats both.', quality: 'acceptable' },
          ],
          hints: [
            'A good step has one tool call or one decision.',
            'Can you check the result of each step on its own?',
            'The best option keeps steps small enough to retry alone and big enough to be worth a call.',
          ],
          explanation: 'A step should be the size of one tool call or one decision with a checkable result. Too big and nothing can be checked or retried alone. Too small and calls and delay add up for no gain.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-54-q1',
        prompt: 'Which of these is the best-sized subtask for an agent?',
        choices: [
          'Handle the customer’s whole request and report back when it is finished, using any tools that seem useful',
          'Look at the customer’s message one word at a time and decide what each word probably means for the job',
          'Get the price of one named part with get_price and check that the answer is a positive number',
          'Prepare everything the customer might need over the next month and send it all in one message',
        ],
        answer: 2,
        explanation: 'A good subtask uses one tool or makes one decision and has a result that can be checked. The others are too big to check or so small that they waste calls.',
      },
      {
        id: 'building-ai-agents-54-q2',
        prompt: 'Your sorter stops with “cycle in the plan”. What does that tell you, and what should you do?',
        choices: [
          'Two or more steps wait for each other, so no order exists; reject the plan and send the problem back, or fix the dependencies',
          'The model used too many tokens in the plan, so the plan should be shortened and run again with the same dependencies still in it',
          'One tool is missing from the allow-list, so the allow-list should be extended until the sorter stops complaining about the plan',
          'The sorter found two independent steps, so it is safe to run them in parallel and ignore the message the sorter printed',
        ],
        answer: 0,
        explanation: 'A cycle means every remaining step is waiting for another remaining step. No sort can fix that, so the plan has to change.',
      },
      {
        id: 'building-ai-agents-54-q3',
        prompt: 'A plan has these steps: book_slot, check_stock, write_quote, get_price. Which order is safest to run?',
        choices: [
          'book_slot, write_quote, check_stock, get_price, so the customer gets a confirmation as early as possible',
          'write_quote, get_price, check_stock, book_slot, because the quote is what the customer asked for first',
          'get_price, book_slot, check_stock, write_quote, since prices change often and should be fetched at the start',
          'check_stock, get_price, write_quote, then book_slot, with the booking after the customer has seen the quote',
        ],
        answer: 3,
        explanation: 'Read-only steps come first, the quote combines them, and the one step that changes something comes last. Any other order can leave a booking behind for a job that cannot be done.',
      },
      {
        id: 'building-ai-agents-54-q4',
        audience: { max: 'beginner' },
        prompt: 'Why break a big request into smaller steps?',
        choices: [
          'Because a model can only answer one sentence at a time, so every request has to be cut into sentences',
          'Because small steps are easier to check, to repeat if one fails, and to restart after a crash',
          'Because small steps always run faster than one big step, whatever tools are used inside them',
          'Because it makes the model feel more confident, which makes its answers true more often',
        ],
        answer: 1,
        explanation: 'Small steps can be checked and retried one at a time. They are not always faster, and a model has no feelings of confidence that make answers true.',
      },
      {
        id: 'building-ai-agents-54-q5',
        audience: { min: 'advanced' },
        prompt: 'Two steps, get_price(chain) and get_price(tube), have no dependency between them. A teammate wants to run them in parallel. What should you check first?',
        choices: [
          'That both steps use the same model, because parallel calls that go to different models tend to give inconsistent answers',
          'That the plan lists the cheaper step first, since the result that arrives first decides the final order of the whole plan',
          'That both steps are read-only or idempotent, that rate limits allow it, and that results are merged by step id',
          'That the sorter returned the steps in list order, because parallel runs are only possible on lists that were sorted',
        ],
        answer: 2,
        explanation: 'Parallel runs are safe for independent steps only when repeating or interleaving them cannot cause harm, the tool allows the load, and results are stored by step id so arrival order does not matter.',
      },
    ],
    task: {
      title: 'Decompose a real request and let code order it',
      minutes: 18,
      steps: [
        'Write one request from your own life or work that has three or four parts. Write its goal in one sentence.',
        'Split it by hand into four to six subtasks, each with an id, a tool name and `depends_on`. Mark which steps only read and which change something.',
        'Copy `plan.py`, replace the plan text with yours (list the steps in a jumbled order) and add your tool names to `ALLOWED_TOOLS`. Run it and compare the printed order with the one you expected.',
        'Change it and observe: add a cycle between two steps, then put a changing step (like booking) first in the list. Note what the program prints, and whether a read-before-write rule is enforced by the code or only by your habit.',
        'Reflect: which part of the order did the code guarantee, and which part would still need a person to check?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use this ready plan if you are stuck: s1 check_stock, s2 get_price depends on s1, s3 write_quote depends on s1 and s2. Shuffle the list order, run the program, and notice that the printed order does not change.'] },
      { audience: { min: 'advanced' }, steps: ['Extend `order` to return groups of steps that can run together (all steps whose dependencies are done in the same round). Decide which tools are safe to run in parallel, and write what must be true for a group to run concurrently.'] },
    ],
  },
  {
    id: 'building-ai-agents-55',
    day: 55,
    title: 'Understanding Reasoning and Planning',
    summary: 'See model reasoning as generated text that can help and can be wrong, tell it apart from a plan and from evidence, and check claims against your own log.',
    intro: {
      objectives: [
        'Tell reasoning text, a plan and evidence (a tool result) apart',
        'Explain why a model’s “I did X” is a claim and not proof',
        'Check an agent’s claims against a log that your own code wrote',
      ],
      why: 'Agents often explain themselves in confident words. If you treat that text as proof, a wrong answer reaches a customer with a believable story attached. If you check it against evidence, the story becomes useful information instead.',
    },
    minutes: 18,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'When the agent writes “I checked the stock”, did it? Models are good at writing sentences that sound like careful work. That is useful, and it is also the reason to be careful. In this lesson you will separate three things that are easy to mix up: the reasoning text a model writes, the plan you can execute, and the evidence your code records. You will learn which one to trust for what.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika turns on a model setting that makes her agent write out its working before the answer. A customer asks about a chain. The agent replies: “I checked our stock: three chains are available. A chain is ₱450 and the tune-up is ₱600, so the total is ₱1,050.” It reads well. Mika opens the log her code wrote. The price tool ran twice. The stock tool never ran. The “three chains” came from an old conversation in memory, and the shelf was empty that morning. Nothing was wrong with the arithmetic. The claim “I checked” was simply not true. She adds a step that compares each claim in a reply with the log before the reply is sent.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'The word **reasoning** needs care. A model can be asked, or built, to write intermediate text before its final answer: working through a problem in words. Some vendors’ models also spend hidden tokens on this before they reply. Such text can help the model on multi-step problems, and it can help a person follow along. But it is generated text, like every other output. It can be wrong, it can sound sure while wrong, and it is not a record of what happened. This course does not claim that a model thinks the way a person does. It uses “reasoning” for the text a model writes while working towards an answer.' },
      { type: 'paragraph', text: 'A **plan** is different. A plan is a structured output, a list of steps as data, that your code can validate and execute (lessons 53 and 54). Reasoning is a process whose visible text you cannot rely on. A plan is an artifact you can check. The third thing is **evidence**: what your own code recorded when a tool really ran, with its inputs and result. Evidence is the only one of the three that proves something happened. Even evidence needs checking, because a tool can return stale or wrong data, but it is a different kind of thing from the model’s account of itself.' },
      {
        type: 'table',
        headers: ['What it is', 'Who writes it', 'What it can tell you', 'How to check it'],
        rows: [
          ['Reasoning text', 'The model, as generated text', 'How the model got to an answer, if it is faithful. It may not be.', 'Never treat it as proof. Compare its claims with evidence.'],
          ['Plan', 'The model or a developer, as data', 'What the agent intends to do', 'Validate it with code. Compare it with what actually ran.'],
          ['Evidence', 'Your code, in a log', 'What ran, with which inputs, and what came back', 'Check the result: type, range, source and freshness.'],
        ],
        caption: 'Decide with evidence. Use reasoning and plans to understand and to review.',
      },
      { type: 'paragraph', text: 'This leads to a simple habit, the **claim-versus-evidence rule**. Any statement of fact or action in model text (“I checked”, “I booked”, “the total is”) must match an entry in a log written by your code, not by the model. The model’s own account of what it did does not count, because it is the thing under test. A claim with no matching log entry is unsupported. You can block the reply, ask the model to run the missing step, or pass the reply to a person with the problem marked.' },
      { type: 'paragraph', text: 'Reasoning has costs. It adds delay and tokens. Hidden reasoning tokens are usually counted as output, and they can use up a token cap that you meant for the visible answer. It may also repeat private details you did not intend to show. So reason where a problem is hard (choosing between tools, splitting a goal), and skip it where a lookup or a fixed rule will do. Use reasoning text as a note for a reviewer, never as a source of truth, and do not show it to customers as a justification.' },
      { type: 'version', text: 'OpenAI’s documentation says reported output token usage includes all tokens the model generates, not only the visible text, and that the output cap counts hidden tokens too, so leave headroom. The Python SDK’s usage type for Responses has `output_tokens_details.reasoning_tokens`. Other vendors differ, and these details change, so read your vendor’s page before you set caps.', checked: CHECKED, sources: [DOCS.openaiTokens, DOCS.openaiUsage] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words: a student hands in an exam with neat working and a confident answer. The working looks careful, and the answer can still be wrong, so a teacher checks the answer against the textbook. The model’s written reasoning is the neat working. The tool results in your log are the textbook. When the working says “I looked it up” and there is no lookup in the log, the working is not telling you the truth, even if it was written with no bad intention. A model does not lie on purpose here. It writes the most fitting next words, and “I checked” fits.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'For evaluation, log a claimed-versus-executed mismatch rate per run: the share of replies containing an action or fact claim with no matching tool event. Track it by prompt version and model. Reasoning settings (effort or budget, where a vendor offers them) trade quality against latency and cost, so test them on your own cases instead of assuming more is better. Do not depend on the visibility or format of hidden reasoning: it can change between versions and is not a stable interface. Treat any stored reasoning as sensitive data with a retention limit, since it can quote user input and tool results. And remember that a model’s explanation of why it did something is also generated text, so it may not match what actually produced the answer.' },
      { type: 'heading', text: 'AI in Action' },
      {
        type: 'demo',
        title: 'A reply and the log behind it, written by hand as an illustration',
        prompt: 'Log written by the agent’s own code:\n1. get_price(part="chain") -> ok, 450\n2. get_price(part="tune-up") -> ok, 600\n3. write_quote(total=1050) -> ok\n(no check_stock call, no book_slot call)',
        output: 'Reply drafted by the agent:\n“I checked stock and we have three chains. A chain is ₱450 and the tune-up is ₱600, so the total is ₱1,050. I have booked you for Saturday at 9:00.”',
        notice: 'Go through the reply sentence by sentence and match each claim to a log line. The prices and the total are supported. “I checked stock” and “I have booked you” have no log entry, so they are unsupported. The second one is the dangerous kind: a customer may turn up for a booking that does not exist.',
      },
      { type: 'heading', text: 'Try it yourself' },
      { type: 'paragraph', text: 'Practise the rule on paper before you automate it. Write a short action log, three to five lines, the way your code would record it. Then use your own assistant to draft a customer reply that makes several claims, and audit it yourself.' },
      { type: 'prompt', label: 'Draft a reply to audit', text: 'Here is an action log written by my program:\n[three to five log lines, each with a tool, its inputs and ok or failed]\n\nWrite a short customer reply for this job. Include at least five specific claims about what was done or found, and make at least two of them things the log does NOT show. Then, on a separate line, tell me which two you made up. I will not send this reply; it is for an audit exercise.' },
      { type: 'list', items: [
        'Highlight every claim of fact or action in the reply and write the log line that supports it next to it.',
        'Circle each claim with no log line. Decide for each: block the reply, run the missing step or ask a person.',
        'Check the assistant’s own list of the two made-up claims against your reading. If it missed one, you have seen the problem in this lesson first hand.',
      ] },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write down one place in your own agent where a model’s statement is currently treated as a fact, and what log entry would support it instead.',
        'Next is ReAct: Reasoning and Acting (lesson 56), where each reasoning line is followed by a real action and a real result.',
        'Read your vendor’s token-counting page to learn how reasoning tokens are counted before you set an output cap.',
      ] },
      { type: 'takeaways', items: [
        'Reasoning is generated text. It can help and it can be wrong, and it is never proof that something happened.',
        'A plan is a structured artifact you can validate. Evidence is what your own code logged when a tool ran.',
        'Claim-versus-evidence: every statement of fact or action in a reply must match a log entry your code wrote.',
        'Reasoning costs tokens and time, so use it where problems are hard and show it to reviewers, not as a source of truth.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-55-code-challenge-1',
          kind: 'code-challenge',
          title: 'Find the unsupported claims',
          story: 'You check an agent’s claims against the log your code wrote. The claims and the log are plain data in this exercise, so no model is run.',
          prompt: 'Write `unsupportedClaims(claims, log)`. Each claim is `{ tool, text }` and each log entry is `{ tool, ok }`. A claim is supported only if the log has an entry with the same `tool` and `ok === true`. Return the `text` of every unsupported claim, in the order the claims were given.',
          concept: 'claim versus evidence',
          language: 'javascript',
          starter: "function unsupportedClaims(claims, log) {\n  const unsupported = [];\n  // for each claim, look for a log entry with the same tool and ok === true\n  return unsupported;\n}",
          solution: "function unsupportedClaims(claims, log) {\n  const unsupported = [];\n  for (const claim of claims) {\n    const proven = log.some((entry) => entry.tool === claim.tool && entry.ok === true);\n    if (!proven) {\n      unsupported.push(claim.text);\n    }\n  }\n  return unsupported;\n}",
          tests: {
            kind: 'function',
            fn: 'unsupportedClaims',
            cases: [
              { label: 'one claim has no log entry', args: [[{ tool: 'check_stock', text: 'I checked the stock.' }, { tool: 'get_price', text: 'I looked up the price.' }], [{ tool: 'get_price', ok: true }]], expected: ['I checked the stock.'] },
              { label: 'a failed call does not support a claim', args: [[{ tool: 'get_price', text: 'The price is 450.' }], [{ tool: 'get_price', ok: false }]], expected: ['The price is 450.'] },
              { label: 'everything is supported', args: [[{ tool: 'get_price', text: 'Price found.' }], [{ tool: 'get_price', ok: true }]], expected: [] },
              { label: 'no claims', args: [[], [{ tool: 'get_price', ok: true }]], expected: [] },
              { label: 'order of the claims is kept', args: [[{ tool: 'book_slot', text: 'Booked.' }, { tool: 'check_stock', text: 'Checked.' }], []], expected: ['Booked.', 'Checked.'], hidden: true },
              { label: 'a later success supports the claim', args: [[{ tool: 'get_price', text: 'Price found.' }], [{ tool: 'get_price', ok: false }, { tool: 'get_price', ok: true }]], expected: [], hidden: true },
            ],
          },
          hints: [
            'Loop over `claims`. For each one, ask whether the log contains a matching entry.',
            '`log.some((entry) => entry.tool === claim.tool && entry.ok === true)` answers that question in one line.',
            'If there is no such entry, push `claim.text` into `unsupported`. Return the array at the end.',
          ],
          explanation: 'The log is written by your code, so it is the evidence. A claim counts only when a successful call for that tool is there. This check is cheap and exact, and it catches the most harmful kind of confident mistake: an action the agent says it took but never did.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-55-scenario-1',
          kind: 'scenario',
          title: 'The reply says more than the log',
          prompt: 'Choose the best response.',
          concept: 'claim versus evidence',
          situation: 'A school helpdesk agent (invented) is about to send: “I have reset your password and emailed you the new one.” The log written by your code shows one call: lookup_student(id) -> ok. There is no reset_password call and no send_email call. The model’s written reasoning says: “I reset the password as requested.”',
          options: [
            { text: 'Block the reply, record the mismatch and either run the missing steps through the normal approval path or pass the case to a staff member.', consequence: 'The student never gets a false promise, and the mismatch is recorded. You can count how often it happens and improve the prompt or the loop.', quality: 'best' },
            { text: 'Send it, because the reasoning text says the reset was done and the model usually gets this right.', consequence: 'A student waits for an email that will never come, and may be locked out. The reasoning was a claim, and nothing in the log backed it.', quality: 'poor' },
            { text: 'Ask the model to confirm, and send the reply if it says yes.', consequence: 'The model will very likely repeat the claim, because that is what its text already said. You asked the thing under test to certify itself.', quality: 'poor' },
            { text: 'Remove the sentence about the reset and send the rest of the reply.', consequence: 'You avoid the false claim, but the student still has no answer and the mismatch is not recorded. It is safe and incomplete.', quality: 'acceptable' },
          ],
          hints: [
            'Which record shows what really happened: the reasoning text or the log?',
            'Asking the model to confirm its own claim does not add evidence.',
            'The best option stops the false promise and records why, so the problem can be fixed.',
          ],
          explanation: 'Evidence comes from your code’s log, not from the model’s account of itself. A mismatch should stop the reply and be recorded. Self-confirmation by the model is not a check.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-55-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Reasoning, plan or evidence',
          prompt: 'Tap each card. Decide which of the three it is before you read the back.',
          concept: 'reasoning, plan and evidence',
          cards: [
            { front: '“I think the chain is in stock, because the shop usually keeps three.”', back: 'Reasoning text. A guess in words. It can be wrong and proves nothing.' },
            { front: '{"id":"s2","tool":"get_price","depends_on":["s1"]}', back: 'A plan step. Data you can validate before it runs. It says what is intended, not what happened.' },
            { front: 'LOG 14:02:11 check_stock(part="chain") -> ok, qty 0', back: 'Evidence. Your code recorded it when the tool ran. It still needs checking for freshness and sense, but it is what happened.' },
            { front: '“I have booked you for Saturday.”', back: 'A claim in a reply. It is unsupported unless a book_slot call with a success result is in the log.' },
          ],
          hints: [
            'Ask who wrote it: the model’s text, a step as data, or your own code’s log.',
            'Only one of the four proves that something ran.',
          ],
          explanation: 'Reasoning and claims are generated text, a plan is intent as data, and only the log is a record of what ran. The three get different levels of trust.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-55-q1',
        prompt: 'The agent’s reply says “I checked the stock”, but the log written by your code has no check_stock call. What is the best response?',
        choices: [
          'Treat the claim as unsupported: hold the reply, record the mismatch and make facts come from tool results',
          'Trust the reply, because the written reasoning before it looked careful and consistent with the customer’s question',
          'Delete the line from the reply and send the rest without recording anything, so the customer never sees the mistake',
          'Ask the model to explain why it said that, and send the reply if the explanation sounds reasonable to you',
        ],
        answer: 0,
        explanation: 'The log is the evidence and it contradicts the claim. Holding the reply and recording the mismatch lets you fix the cause. An explanation from the model is more generated text, not evidence.',
      },
      {
        id: 'building-ai-agents-55-q2',
        prompt: 'True or false: the reasoning text a model writes before its answer is a reliable record of what the agent actually did.',
        choices: [
          'True, because the model writes it before the answer, so it must describe the steps that the agent really took',
          'True, because the API checks reasoning text against your tool log before it is returned to your code',
          'False, because it is generated text that can be wrong; only your own log of tool calls shows what ran',
          'False, because reasoning is always hidden from developers, so it can never be read, stored or used in a review',
        ],
        answer: 2,
        explanation: 'Reasoning text can help, and it can also be wrong or untrue about the steps taken. Evidence of what ran comes from your own log, not from the model’s account. The API does not check it, and it is not always hidden.',
      },
      {
        id: 'building-ai-agents-55-q3',
        prompt: 'Your code needs to know whether the booking was really made. Which source should it trust?',
        choices: [
          'The model’s final reply, which says “You are booked for Saturday at 9:00” and sounds completely sure of itself',
          'The log entry your code wrote when book_slot ran, with its inputs and its result',
          'The plan, which lists book_slot as the last step of the job and was validated by code earlier in the run',
          'The model’s reasoning, which describes the booking in some detail and states the exact time of the booking',
        ],
        answer: 1,
        explanation: 'Only the record of the tool call and its result shows that the booking happened. The reply, the plan and the reasoning all state an intention or a claim.',
      },
      {
        id: 'building-ai-agents-55-q4',
        audience: { max: 'beginner' },
        prompt: 'Why should “I did X” in a model’s reply not be taken as proof that X was done?',
        choices: [
          'Because models are not allowed to take actions, so everything they say about actions is a joke',
          'Because the reply is only written text, and only the record of the tool calls shows what really ran',
          'Because the model always lies about actions when it has been asked to explain its work to the user',
          'Because replies are checked by the customer, and the customer’s word is the only record that counts',
        ],
        answer: 1,
        explanation: 'A reply is text. A tool-call log written by your code is the record of what ran. Models can call tools through your code, and they do not lie deliberately, but “I did it” can be written whether or not it happened.',
      },
      {
        id: 'building-ai-agents-55-q5',
        audience: { min: 'advanced' },
        prompt: 'After you turn up a model’s reasoning setting to improve results, some answers arrive cut off. What is a likely cause, and what should you check?',
        choices: [
          'Hidden reasoning tokens may count against the output cap, so check your vendor’s usage fields and raise the cap',
          'The extra reasoning makes the model refuse long answers, so the setting should be turned off for every kind of task you run',
          'Reasoning text is deleted before the reply is sent, so the reply loses its last paragraph whenever reasoning is switched on',
          'The cap only applies to the input, so the cut-off answers must come from a network fault that automatic retries will clear',
        ],
        answer: 0,
        explanation: 'Some APIs count hidden reasoning tokens as output, so a small cap can leave little room for the visible answer. The usage fields show what was spent. The details differ by vendor, so read the page for yours.',
      },
    ],
    task: {
      title: 'Audit a reply against a log',
      minutes: 15,
      steps: [
        'Write a three-to-five-line action log for a job of your own (or Mika’s), in the form `{ tool, ok }`, as your code would record it.',
        'Write (or ask your own assistant for) a customer reply with five claims, at least two of them not backed by the log. Mark each claim with the tool it depends on.',
        'Put the claims and the log into the code exercise’s `unsupportedClaims` function (copy the solution into a file such as `audit.js` and call it with `console.log`), run it with `node audit.js`, and compare its answer with your own reading.',
        'Change it and observe: mark one log entry as `ok: false`, then add a second successful call for the same tool. Note which claims change status and why.',
        'Reflect: in your own agent, which statements do you currently trust without a log entry behind them?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use only two log lines and three claims. Check them by eye first, then run the function and see if you agree.'] },
      { audience: { min: 'advanced' }, steps: ['Extend the audit to match on the tool and the arguments (for example the part name), and to count a claim as unsupported if the log result is older than a time limit you choose. Describe how you would measure the share of unsupported claims over 100 runs.'] },
    ],
  },
  {
    id: 'building-ai-agents-56',
    day: 56,
    title: 'ReAct: Reasoning and Acting',
    summary: 'Run a loop where the model writes a Thought and an Action, your code runs the tool, and the Observation feeds the next step, with a strict parser around it.',
    intro: {
      objectives: [
        'Describe the ReAct loop: Thought, Action, Observation, repeat until a final answer',
        'Parse a ReAct reply safely, with an allow-list of tools and strict input checks',
        'Say what ReAct costs and where it fails, and when a fixed plan is better',
      ],
      why: 'ReAct is the shape behind many agent loops, including loops built on native tool calling. Knowing the loop and its failure points lets you debug an agent from its trace instead of guessing.',
    },
    minutes: 24,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'How does an agent decide what to do after it sees a tool result? A fixed plan cannot say, because it was written before the result existed. A pattern called ReAct answers with a loop: the model writes a short note and a request, your code runs the request, the result goes back in, and the model writes the next note. You will build that loop with a scripted model and a parser that refuses anything unsafe.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'A customer asks Mika: “Is a 700c inner tube in stock, and is there a cheaper chain than the ₱450 one?” Her first design asks the model for a full plan up front. The plan checks the tube and the ₱450 chain, because the model cannot know which other chains exist. Finding a cheaper one needs a list first. She switches to a loop. The model asks for the list of chains, sees a ₱380 chain in the result, then asks for its stock. The first version of the loop fails in a different way: the model writes `check_stok`, a typo, and the program crashes because it looks the name up without checking. Mika adds a strict parser and an error message that is sent back to the model like any other result.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**ReAct** (Reason and Act) is a loop in which the model writes a **Thought**, then an **Action** (which tool to call, with what input), your code runs the tool, and the result goes back as an **Observation**. The cycle repeats until the model writes a **Final Answer** or a limit stops it. The name comes from a 2022 research paper, “ReAct: Synergizing Reasoning and Acting in Language Models”. The Thought is generated text (lesson 55). It can help the model choose the next action. It is never evidence. What counts is the action your code really ran and the observation it really got back.' },
      { type: 'diagram', format: 'mermaid', caption: 'One ReAct step. Look at the two diamonds: your code decides whether an action is accepted and whether the loop goes on. The model decides neither.', source: ['flowchart TD', '  A[Goal and the list of tools]', '  B[Model writes a Thought and an Action]', '  C{Does the code accept the action?}', '  D[Code runs the tool]', '  E[Observation: the tool result]', '  H[Observation: an error message]', '  F{Final answer or a limit reached?}', '  G[Return the answer]', '  A --> B', '  B --> C', '  C -->|yes| D', '  C -->|no, unknown tool or bad input| H', '  D --> E', '  E --> F', '  H --> F', '  F -->|keep going| B', '  F -->|done| G'].join('\n') },
      {
        type: 'table',
        headers: ['Part', 'Written by', 'What happens to it', 'How far to trust it'],
        rows: [
          ['Thought', 'The model', 'A person may read it. Code does not act on it.', 'Generated text. Never evidence.'],
          ['Action', 'The model', 'Code parses it, checks the tool name and the input, then runs it', 'Untrusted until validated'],
          ['Observation', 'Your code, from the tool', 'Fed back to the model as the next input', 'Evidence of what the tool returned, yet still untrusted text'],
        ],
        caption: 'Three parts, three different levels of trust.',
      },
      { type: 'paragraph', text: 'There are two ways to build the loop. In the **text format**, the model writes lines such as `Action: check_stock` and your parser reads them. It works with any model that can follow a format, and it breaks whenever the format drifts. In **native tool calling** (module 4), the provider’s API returns structured tool requests, and your loop sends tool results back. Many current agents use native tool calling and keep the ReAct shape: model step, your code runs the tool, result goes back. This lesson uses the text format because the parser shows every decision your code must make.' },
      { type: 'paragraph', text: 'ReAct has costs you should name. Every step is a model call with a transcript that grows by one observation each time, so cost and delay grow faster than the number of steps. The path is not known in advance, so you need hard limits (lesson 62). The model can invent tools or arguments. And observations are text from outside: a web page or a note can contain instructions, so treat them as data, not as orders. When the job’s steps are always the same, a fixed plan is cheaper, simpler and easier to test. Use ReAct where the next step really depends on the last result.' },
      { type: 'version', text: 'Claude’s tool-use documentation describes a tool request as stop_reason “tool_use” with tool_use content blocks, and notes that the model often writes text before the tool_use block. That text plays the part of the Thought in a native-tool-calling loop. LangChain’s v1 migration page says that it now recommends `create_agent` from the `langchain` package, where before v1.0 it recommended `langgraph.prebuilt.create_react_agent`. APIs like these change often. Check the pages.', checked: CHECKED, sources: [DOCS.claudeHandleTools, DOCS.langchainMigrate] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, the code below works like a careful clerk. `TOOLS` is the shelf of tools the clerk may use. `ScriptedModel` hands over prepared replies, as if a model were writing them. `parse` reads one reply line by line. If a line starts with “Final Answer:” the job is done. Otherwise it looks for an “Action:” line and an “Action Input:” line, and turns the input into data. If anything is missing or broken, it says “error” instead of guessing. `run` is the loop: ask for a reply, parse it, run the tool if the name is on the shelf, add the result to the notes, and repeat, at most five times.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Failure modes to design for: format drift (a reply that no longer parses), a repeated action that never advances (lesson 62), a transcript that outgrows the context window (summarise or trim old observations), and prompt injection through observations. Log each step as a structured event with the thought, action, validated input, observation and duration, with secrets redacted, because the trace is your main debugging tool. Prefer native tool calling or structured outputs where available: they move parsing into the API. Keep a strict text parser only as a fallback that answers a parse failure with an error observation and a retry cap.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will run a ReAct loop with a scripted model. It needs only Python 3.10 or later, with no packages or keys. Save the first block as `react.py`.' },
      { type: 'code', language: 'python', label: 'react.py, part 1', code: String.raw`import json

TOOLS = {
    "check_stock": lambda args: {"part": args["part"], "in_stock": 3},
    "get_price": lambda args: {"part": args["part"], "price_php": 450},
}


class ScriptedModel:
    """A teaching stand-in, not a model: it replays prepared replies in the ReAct text format."""

    def __init__(self, replies):
        self.replies = list(replies)

    def complete(self, transcript):
        return self.replies.pop(0)


def parse(text):
    lines = [line.strip() for line in text.splitlines()]
    for line in lines:
        if line.startswith("Final Answer:"):
            return {"kind": "final", "answer": line[len("Final Answer:"):].strip()}
    action = next((l[len("Action:"):].strip() for l in lines if l.startswith("Action:")), None)
    raw = next((l[len("Action Input:"):].strip() for l in lines if l.startswith("Action Input:")), None)
    if action is None or raw is None:
        return {"kind": "error", "reason": "no action"}
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {"kind": "error", "reason": "bad action input"}
    if not isinstance(data, dict):
        return {"kind": "error", "reason": "bad action input"}
    return {"kind": "action", "tool": action, "input": data}
` },
      { type: 'paragraph', text: 'Add this below the previous block, in the same file.' },
      { type: 'code', language: 'python', label: 'react.py, part 2', code: String.raw`def run(model, goal, max_steps=5):
    transcript = f"Goal: {goal}"
    for step in range(1, max_steps + 1):
        parsed = parse(model.complete(transcript))
        if parsed["kind"] == "final":
            return step, parsed["answer"]
        if parsed["kind"] == "error" or parsed["tool"] not in TOOLS:
            observation = "Error: use only the listed tools and valid JSON"
        else:
            try:
                observation = json.dumps(TOOLS[parsed["tool"]](parsed["input"]))
            except KeyError:
                observation = "Error: the tool needs a different input"
        print(f"step {step}: {parsed.get('tool', parsed['kind'])} -> {observation}")
        transcript += f"\nObservation: {observation}"
    return max_steps, "stopped: step limit"


model = ScriptedModel([
    'Thought: I should check stock first.\nAction: check_stock\nAction Input: {"part": "chain"}',
    'Thought: Now the price.\nAction: get_price\nAction Input: {"part": "chain"}',
    'Thought: I have both.\nFinal Answer: The chain is in stock (3) at 450 pesos.',
])
print(run(model, "Is a bike chain in stock and how much is it?"))
` },
      { type: 'paragraph', text: 'Read the important lines. `parse` returns “final”, “action” or “error”, never raises, and never runs anything. A name not in `TOOLS` is not looked up and not run: it becomes an error observation, which is sent back like any result so the model can correct itself. `json.loads` turns the input into data, with no `eval`. `max_steps` makes the loop finite even if the model never writes a Final Answer. Each pass adds the observation to `transcript`, which is how the model sees what happened.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `step 1: check_stock -> {"part": "chain", "in_stock": 3}
step 2: get_price -> {"part": "chain", "price_php": 450}
(3, 'The chain is in stock (3) at 450 pesos.')` },
      { type: 'list', items: [
        'If you see `IndexError: pop from empty list`, the scripted model ran out of replies. The loop asked for more than you prepared, so end your script with a “Final Answer:” reply.',
        'If a step prints “Error: use only the listed tools and valid JSON”, look at the reply: the tool name is not in `TOOLS`, the Action Input is not valid JSON (it needs double quotes) or one of the two lines is missing.',
        'If the result is `(5, \'stopped: step limit\')`, the model never wrote a Final Answer. Check your replies, or raise `max_steps` for a longer job.',
        'If you get `python: command not found`, use `python3 react.py`.',
      ] },
      { type: 'warning', text: 'Everything a tool returns is untrusted text, and so is everything a model writes. Never pass either to `eval`, `exec` or a shell. Look tool names up in an allow-list, validate the input before the tool uses it, and cap both the number of steps and the length of an observation. A web page or a note can contain instructions aimed at the model. Treat them as data. The scripted model here is a teaching stand-in, and a real model will produce messier replies.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Edit the scripted replies: misspell a tool name, remove the Action Input line, then write a reply that never gives a Final Answer. Read the error observations.',
        'Next is Sequential Agent Workflows (lesson 57), where the steps are fixed and no model chooses them.',
        'Read the Claude tool-use page on handling tool calls to compare this text format with a native tool-calling loop.',
      ] },
      { type: 'takeaways', items: [
        'ReAct is a loop: Thought, Action, Observation, repeated until a Final Answer or a limit.',
        'The Thought is generated text and the Observation comes from a tool. Your code decides whether an action is accepted and whether the loop goes on.',
        'Parse strictly, look tools up in an allow-list and send an error back as an observation instead of crashing.',
        'ReAct costs a model call per step and an unpredictable path, so use a fixed plan when the steps never change.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-56-code-challenge-1',
          kind: 'code-challenge',
          title: 'Parse a ReAct reply',
          story: 'You write the parser for a scripted model’s reply. The replies are plain text in this exercise, and no model is run.',
          prompt: 'Write `parseReact(text)`. Split the text into lines and trim each. The line starting `Thought:` gives `thought` (empty string if none). If a line starts with `Final Answer:`, return `{ kind: "final", thought, answer }`. Otherwise you need a line starting `Action:` (the tool) and a line starting `Action Input:` that holds JSON of an object. Return `{ kind: "action", thought, tool, input }`. If either line is missing return `{ kind: "error", reason: "no action" }`. If the input is not valid JSON, or is not an object (a number, a list or null), return `{ kind: "error", reason: "bad action input" }`.',
          concept: 'parsing the ReAct format',
          language: 'javascript',
          starter: "function parseReact(text) {\n  const lines = text.split('\\n').map((line) => line.trim());\n  let thought = '';\n  // read each line: Thought, Action Input, Action, Final Answer\n  // then return an action, a final answer or an error\n  return { kind: 'error', reason: 'no action' };\n}",
          solution: "function parseReact(text) {\n  const lines = text.split('\\n').map((line) => line.trim());\n  let thought = '';\n  let action = null;\n  let rawInput = null;\n  for (const line of lines) {\n    if (line.startsWith('Thought:')) {\n      thought = line.slice(8).trim();\n    } else if (line.startsWith('Action Input:')) {\n      rawInput = line.slice(13).trim();\n    } else if (line.startsWith('Action:')) {\n      action = line.slice(7).trim();\n    } else if (line.startsWith('Final Answer:')) {\n      return { kind: 'final', thought: thought, answer: line.slice(13).trim() };\n    }\n  }\n  if (action === null || rawInput === null) {\n    return { kind: 'error', reason: 'no action' };\n  }\n  try {\n    const input = JSON.parse(rawInput);\n    if (input === null || typeof input !== 'object' || Array.isArray(input)) {\n      return { kind: 'error', reason: 'bad action input' };\n    }\n    return { kind: 'action', thought: thought, tool: action, input: input };\n  } catch (error) {\n    return { kind: 'error', reason: 'bad action input' };\n  }\n}",
          tests: {
            kind: 'function',
            fn: 'parseReact',
            cases: [
              { label: 'an action', args: ['Thought: check\nAction: check_stock\nAction Input: {"part": "chain"}'], expected: { kind: 'action', thought: 'check', tool: 'check_stock', input: { part: 'chain' } } },
              { label: 'a final answer', args: ['Thought: done\nFinal Answer: In stock.'], expected: { kind: 'final', thought: 'done', answer: 'In stock.' } },
              { label: 'no action line', args: ['Thought: hmm'], expected: { kind: 'error', reason: 'no action' } },
              { label: 'broken JSON', args: ['Action: get_price\nAction Input: {bad'], expected: { kind: 'error', reason: 'bad action input' } },
              { label: 'input that is not an object', args: ['Action: get_price\nAction Input: 5'], expected: { kind: 'error', reason: 'bad action input' }, hidden: true },
              { label: 'a list is not an object either', args: ['Action: get_price\nAction Input: ["chain"]'], expected: { kind: 'error', reason: 'bad action input' }, hidden: true },
              { label: 'action without input', args: ['Action: get_price'], expected: { kind: 'error', reason: 'no action' }, hidden: true },
              { label: 'extra spaces are trimmed', args: ['  Thought:   look it up  \n  Action:  get_price \n Action Input: {"part": "tube"}  '], expected: { kind: 'action', thought: 'look it up', tool: 'get_price', input: { part: 'tube' } }, hidden: true },
            ],
          },
          hints: [
            'Loop over the trimmed lines. Test `startsWith` for each prefix and keep `thought`, `action` and `rawInput` in variables.',
            'Check `Action Input:` before `Action:` is fine, but make sure each line only matches one prefix. `slice(n)` removes the prefix, and `trim()` removes extra spaces.',
            'After the loop: missing action or input gives the “no action” error. Then `JSON.parse` inside `try`, and reject `null`, non-objects and arrays as “bad action input”.',
          ],
          explanation: 'A parser decides what your code will accept from a model. It never runs anything. It returns one of three clear outcomes, and every strange reply becomes an error value that the loop can send back as an observation instead of crashing.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-56-match-1',
          kind: 'match',
          title: 'Who writes it, and how far to trust it',
          prompt: 'Match each part of a ReAct step to what your code should do with it.',
          concept: 'Thought, Action and Observation',
          labels: { terms: 'Part of the step', meanings: 'What the code does with it' },
          pairs: [
            { term: 'Thought', definition: 'It may be shown to a reviewer, but it is generated text and never counts as evidence.', note: 'Nothing runs from a Thought.' },
            { term: 'Action', definition: 'It is parsed, its tool name is looked up in an allow-list and its input is validated before anything runs.', note: 'The model proposes, the code disposes.' },
            { term: 'Observation', definition: 'It is the tool’s real result, stored in the log and passed back to the model as data, never as an instruction.', note: 'It is evidence of what the tool returned, and outside text all the same.' },
          ],
          hints: [
            'Which part does the code run? Which part does it only read?',
            'Which part comes from outside the model, from a tool?',
          ],
          explanation: 'The three parts have three levels of trust. Only the action is turned into something that runs, and only after checks. The observation is evidence of a tool result but is still outside text.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-56-scenario-1',
          kind: 'scenario',
          title: 'The model asks for a tool that does not exist',
          prompt: 'Choose how the loop should respond.',
          concept: 'safe handling of a bad action',
          situation: 'In a research helper (invented), the model writes “Action: search_web_deeply” with a valid JSON input. Your tool list is search_notes and read_note. There is no search_web_deeply.',
          options: [
            { text: 'Do not run anything. Return an error observation that names the valid tools, count the step towards the limit, and let the model try again.', consequence: 'The model usually corrects itself on the next step. If it keeps asking for a tool that is not there, the step limit ends the run.', quality: 'best' },
            { text: 'Pick the closest valid tool by name (search_notes) and run it with the same input.', consequence: 'You guessed the model’s intent. Sometimes that is right, and sometimes a similar name means a different action. For read-only tools the harm is small, but you cannot do this safely with tools that change things.', quality: 'acceptable' },
            { text: 'Look the name up in a dictionary of functions and let the program crash if it is missing.', consequence: 'The whole run dies on a typo and the customer sees an error. The failure is simple to see, and it is also avoidable.', quality: 'poor' },
            { text: 'Build a new tool on the fly from the name, since the model clearly wants one.', consequence: 'Tools must be written, reviewed and allowed by people. Creating one from a model’s text is how an agent ends up doing things nobody approved.', quality: 'poor' },
          ],
          hints: [
            'Which tools are allowed to run? Only the ones you listed.',
            'A failure can be information for the model. How do you tell it what went wrong?',
            'Keep the step counting, so a model that keeps repeating the mistake still stops.',
          ],
          explanation: 'An unknown tool is not run. It becomes an error observation that names the valid options and counts as a step, so a stuck model is stopped by the limit instead of by a crash.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-56-q1',
        prompt: 'In a ReAct loop, what actually runs the tool?',
        choices: [
          'The Thought, because the model’s written reasoning about the tool is what starts the call',
          'The model itself, which opens a connection to the tool as soon as it has named it',
          'The parser, which runs any text it finds after the word “Action” without further checks',
          'Your code, after it has parsed the action and checked the tool name and the input',
        ],
        answer: 3,
        explanation: 'The model only writes text. Your code parses it, validates the action and runs the tool. That separation is where your controls live.',
      },
      {
        id: 'building-ai-agents-56-q2',
        prompt: 'The model writes “Action: check_stok” (a typo). What should the loop do?',
        choices: [
          'Guess the nearest tool name by spelling and run it, because the model clearly meant check_stock all along',
          'Return an error observation naming the valid tools, count the step and let the model try again',
          'Stop the whole program with an exception so that the developer notices the mistake straight away and fixes it',
          'Run the text through eval so that any function with a similar name can be found and called by the program',
        ],
        answer: 1,
        explanation: 'A bad action becomes data for the next step. Guessing could run the wrong tool, a crash makes the run fragile and eval would run text from a model.',
      },
      {
        id: 'building-ai-agents-56-q3',
        prompt: 'Which problem grows with the number of steps in a long ReAct run?',
        choices: [
          'The tool list grows by one tool per step, so the model has more and more choices to make each time it replies',
          'Each step adds an observation to the transcript, so every later call costs more and takes longer',
          'The parser becomes stricter as the run continues, so more replies are rejected as the run nears its end',
          'The Thought text becomes evidence after enough steps, so it can be trusted without any log being kept',
        ],
        answer: 1,
        explanation: 'The transcript is sent again with every call, so cost and delay grow faster than the step count, and a long run may outgrow the context window. The other statements are not how the loop works.',
      },
      {
        id: 'building-ai-agents-56-q4',
        audience: { max: 'beginner' },
        prompt: 'What are the three parts of one ReAct step?',
        choices: [
          'Thought, Action and Observation',
          'Question, Answer and Review, in the order a teacher would use',
          'Input, Model and Output, each one handled by the model without any code',
          'Plan, Budget and Approval, which a manager signs before the run starts',
        ],
        answer: 0,
        explanation: 'A ReAct step is a Thought, an Action that your code runs, and the Observation that comes back from the tool.',
      },
      {
        id: 'building-ai-agents-56-q5',
        audience: { min: 'advanced' },
        prompt: 'Your text-format ReAct loop fails to parse about 3 in 100 replies. Which is the best long-term fix?',
        choices: [
          'Loosen the parser with more and more patterns until every reply parses, whatever the reply happens to contain or ask for',
          'Move to native tool calling or structured outputs, and keep a strict parser as a fallback with a retry cap',
          'Lower the temperature to zero and accept the failures, since the rate cannot be lowered any further than that',
          'Add a second model that rewrites each failed reply, and then run the rewritten output without any validation step at all',
        ],
        answer: 1,
        explanation: 'Structured calls from the API remove most format drift. A strict fallback keeps the loop safe. A parser that accepts anything lets malformed input reach your tools, and an unvalidated rewrite adds another untrusted step.',
      },
    ],
    task: {
      title: 'Run a ReAct loop and break it three ways',
      minutes: 18,
      steps: [
        'Save the two blocks as `react.py` and run it with `python3 react.py`. Compare your output with the expected output.',
        'Read the scripted replies. Write down which line is the Thought, which two lines make the Action and where the Observation comes from.',
        'Change it and observe: (a) misspell a tool name, (b) delete an `Action Input:` line, (c) remove the Final Answer reply and set `max_steps=3`. After each change, note what the loop printed and what stopped it.',
        'Add a second tool of your own to `TOOLS` (for example a `get_hours` tool that returns the shop’s opening hours) and script a three-step run that uses both tools.',
        'Reflect: which of the three failures would be most expensive with a real model, and which limit or check caught each one?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Change only one word at a time and re-run. Write one sentence for each run: what you changed and what the program printed.'] },
      { audience: { min: 'advanced' }, steps: ['Cap each observation at 500 characters before it is added to the transcript, and add a field to each printed step for its duration. Write down what you would redact before storing this trace, and for how long you would keep it.'] },
    ],
  },
  {
    id: 'building-ai-agents-57',
    day: 57,
    title: 'Sequential Agent Workflows',
    summary: 'Run a fixed list of steps in order, pass state forward, stop at the first failure and name the step that failed.',
    intro: {
      objectives: [
        'Build a pipeline that runs steps in order, passes state forward and stops at the first failure',
        'Explain when a fixed workflow beats a free-running loop, and what it costs',
        'Place a model inside one step and check what it returns',
      ],
      why: 'Many useful agents are mostly a fixed workflow with a model helping in one or two steps. They are cheaper, easier to test and easier to explain than a loop that chooses its own steps.',
    },
    minutes: 22,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'What if the best agent for a job is one where the model chooses no step at all? Many business tasks have the same shape every time: look something up, calculate, write, check, send. The steps are known in advance, and the only thing that varies is the data. For these, a sequential workflow beats a free-running loop on cost, speed and trust. This lesson builds one and shows where a model still fits.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Every new repair request at Mika’s shop needs the same four things: stock, price, quote, then a question to the customer. Her ReAct loop from lesson 56 mostly did them, in different orders, and once skipped the price and quoted from memory. She tried a longer instruction. It helped for a week. Then she wrote the four steps as a fixed list in code. The model now has one job, to word the final message in a friendly way, and a check confirms that every figure in the message matches the quote. Each failure now names a step: “failed at get_price”. Fewer model calls are made per request, and Mika can read the code to know what happens.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'A **sequential workflow**, often called a **pipeline**, is a fixed list of steps run in order. Each step receives the **state** so far (the data collected up to that point), does one job and returns a result. The runner adds the result to the state and moves on. At the first failure it stops and reports which step failed and why. When every step is a model call, people often call this prompt chaining, but a step can just as well be plain code or a tool call.' },
      { type: 'diagram', format: 'mermaid', caption: 'A pipeline never skips ahead. Follow the “failed” arrows: every step has the same exit, a stop that names the step.', source: ['flowchart TD', '  A[Start: the part name]', '  B[Step 1: check_stock]', '  C[Step 2: get_price]', '  D[Step 3: write_quote]', '  E[Done: the quote]', '  F[Stop: report which step failed]', '  A --> B', '  B -->|ok| C', '  C -->|ok| D', '  D -->|ok| E', '  B -->|failed| F', '  C -->|failed| F', '  D -->|failed| F'].join('\n') },
      { type: 'paragraph', text: 'Two design choices make a pipeline easy to run. First, **one result shape for every step**: either “ok, with an update to the state” or “failed, with an error message”. Then the runner has no special cases. Second, **gates**: small checks between steps, such as “does the quote’s total equal the sum of the parts?”, that stop the run when a result is wrong instead of passing it on. A person can also be a step: “ask the customer” waits for an answer before the next step.' },
      { type: 'paragraph', text: 'Where does a model fit? Inside a step, where language is needed: reading a messy message to find the part name, or wording the quote. Its output is then data like any other, so check it before it moves on: the part name must be on your list, and every figure in the wording must match the quote. The order of steps stays in your code.' },
      {
        type: 'table',
        headers: ['', 'Fixed pipeline', 'ReAct loop (lesson 56)'],
        rows: [
          ['Who chooses the next step', 'The code, in advance', 'The model, after each result'],
          ['Model calls per run', 'Few (only the steps that need language)', 'At least one per step'],
          ['How predictable it is', 'High: same steps, same order', 'Lower: the path can differ run to run'],
          ['Best when', 'The job has the same shape every time', 'The next step depends on what the last result said'],
        ],
        caption: 'Start with the pipeline. Use a loop only for the part of the job that cannot be written down.',
      },
      { type: 'paragraph', text: 'A pipeline has costs too. It cannot adapt: a case nobody wrote a step for will fail or be handled badly, and a new kind of request needs a code change. If you find yourself adding more and more “if” branches inside a pipeline, you may be growing a loop by hand, and it is worth asking whether a router (lesson 58) or a ReAct step would be clearer.' },
      { type: 'version', text: 'Frameworks name this idea in their own words. LangGraph’s Graph API describes nodes as functions that implement a step and edges that connect them. CrewAI’s crews documentation lists two process types, sequential (the default) and hierarchical. Microsoft’s workflow documentation names sequential among its orchestration patterns. This lesson builds the idea in plain Python first, so you can see what any of them does for you.', checked: CHECKED, sources: [DOCS.langgraphGraph, DOCS.crewCrews, DOCS.msWorkflows] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, a pipeline is an assembly line. Each station does one job and passes the box on. If a station finds a broken part, the line stops and the worker writes down which station it was. In the code below, each step is a small function. `check_stock` looks up how many parts there are. `get_price` finds the price. `write_quote` writes the sentence, but refuses if the shelf is empty. `run_pipeline` is the conveyor belt: it calls each step in turn, adds what the step found to the box (`state`), and stops with a clear message if a step says it failed.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Production concerns: give every step a typed input and output contract and validate both. Make steps idempotent where you can, because a run may be resumed and a step repeated (lessons 60 and 61). Record start, end, duration and result for each step so a slow or failing step is visible. Put side effects last and behind a gate, so a failure earlier leaves nothing changed. Version the pipeline with the prompt that wording steps use, because a changed prompt is a changed program. Keep the model’s step small and its output schema strict. Avoid building step names from model text or looking them up with dynamic calls, since that turns a fixed list back into a model-chosen path.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will run a three-step quote pipeline on three parts: one in stock, one out of stock and one that the shop does not list. It needs only Python 3.10 or later, with no packages or keys. Save it as `pipeline.py`.' },
      { type: 'code', language: 'python', label: 'pipeline.py', code: String.raw`STOCK = {"chain": 3, "tube": 0}
PRICES = {"chain": 450, "tube": 180}


def check_stock(state):
    qty = STOCK.get(state["part"])
    if qty is None:
        return {"ok": False, "error": f"unknown part {state['part']}"}
    return {"ok": True, "update": {"qty": qty}}


def get_price(state):
    return {"ok": True, "update": {"price_php": PRICES[state["part"]]}}


def write_quote(state):
    if state["qty"] == 0:
        return {"ok": False, "error": "out of stock, no quote written"}
    text = f"{state['part']}: {state['price_php']} pesos, {state['qty']} in stock"
    return {"ok": True, "update": {"quote": text}}


STEPS = [("check_stock", check_stock), ("get_price", get_price), ("write_quote", write_quote)]


def run_pipeline(steps, state):
    trail = []
    for name, step in steps:
        result = step(state)
        trail.append(f"{name}:{'ok' if result['ok'] else 'failed'}")
        if not result["ok"]:
            return {"status": "failed", "failed_at": name, "error": result["error"], "trail": trail}
        state = {**state, **result["update"]}
    return {"status": "done", "state": state, "trail": trail}


for part in ["chain", "tube", "saddle"]:
    outcome = run_pipeline(STEPS, {"part": part})
    print(part, "->", outcome["status"], outcome["trail"])
    print("   ", outcome.get("state", outcome.get("error")))
` },
      { type: 'paragraph', text: 'Read the important lines. Every step returns the same shape, `{"ok": ..., "update": ...}` or `{"ok": False, "error": ...}`, so `run_pipeline` is only a loop. `state = {**state, **result["update"]}` makes a new state with the step’s result added, and the old state is left unchanged. The `trail` records each step’s outcome, which is your trace. A missing price for a part that passed the stock check would raise `KeyError`. A real pipeline would validate that too, which you will add in the task.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `chain -> done ['check_stock:ok', 'get_price:ok', 'write_quote:ok']
    {'part': 'chain', 'qty': 3, 'price_php': 450, 'quote': 'chain: 450 pesos, 3 in stock'}
tube -> failed ['check_stock:ok', 'get_price:ok', 'write_quote:failed']
    out of stock, no quote written
saddle -> failed ['check_stock:failed']
    unknown part saddle` },
      { type: 'list', items: [
        'If you see `KeyError: \'qty\'`, a step ran before the step that produces what it needs. Check the order in `STEPS`.',
        'If every part fails at `check_stock`, the part name does not match a key in `STOCK`. Names must match exactly, including case.',
        'If you add a part to `STOCK` but not to `PRICES`, `get_price` raises `KeyError`. Add it to both, or make `get_price` return a failed result for a missing price.',
        'If nothing prints, check that the loop at the bottom is not indented under a function.',
      ] },
      { type: 'warning', text: 'In a real pipeline some steps change things: they book, email or refund. Such a step runs every time the pipeline reaches it, so put it last, behind the checks and the customer’s answer, and make it safe to repeat. Never build the list of steps, or a step’s name, from text a model wrote. Validate what a model-written step returns before the next step uses it. The pipeline here uses made-up stock and prices and no model.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Add a fourth step that fails for a reason of your own, such as a part that costs more than a limit, and read the trail.',
        'Next is Conditional Execution (lesson 58): choosing the next step from a tool result, with code.',
        'Read the LangGraph Graph API page and compare its nodes and edges with `STEPS` and `run_pipeline`.',
      ] },
      { type: 'takeaways', items: [
        'A sequential workflow is a fixed list of steps. Each step gets the state, returns a result and the runner stops at the first failure.',
        'One result shape for every step keeps the runner simple, and gates between steps stop a wrong result from travelling on.',
        'Use a model only inside a step that needs language, and check what it returns before the next step uses it.',
        'A fixed pipeline is cheaper and more predictable than a loop, and it cannot adapt to a case nobody wrote down.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-57-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the pipeline runner',
          story: 'The three step functions already exist at the top of the starter. They are plain code, so no model runs here. You write the runner that connects them.',
          prompt: 'Write `runPipeline(names, input)`. Start with `state = input` and an empty `trail` array. For each step name in order: if `STEPS[name]` does not exist, add `name + ":failed"` to the trail and return `{ status: "failed", failedAt: name, error: "unknown step", trail }`. Otherwise call the step with the state and add `name + ":ok"` or `name + ":failed"` to the trail. If the step failed, return `{ status: "failed", failedAt: name, error: result.error, trail }`. If it worked, merge `result.update` into a new state object. When every step has worked, return `{ status: "done", state, trail }`.',
          concept: 'sequential workflow runner',
          language: 'javascript',
          starter: "const STEPS = {\n  checkStock: (state) => {\n    const stock = { chain: 3, tube: 0 };\n    if (stock[state.part] === undefined) {\n      return { ok: false, error: 'unknown part ' + state.part };\n    }\n    return { ok: true, update: { qty: stock[state.part] } };\n  },\n  getPrice: (state) => {\n    const prices = { chain: 450, tube: 180 };\n    return { ok: true, update: { price: prices[state.part] } };\n  },\n  writeQuote: (state) => {\n    if (state.qty === 0) {\n      return { ok: false, error: 'out of stock' };\n    }\n    return { ok: true, update: { quote: state.part + ': ' + state.price + ' pesos' } };\n  },\n};\n\nfunction runPipeline(names, input) {\n  let state = input;\n  const trail = [];\n  // run each step in order, stop at the first failure\n  return { status: 'done', state: state, trail: trail };\n}",
          solution: "const STEPS = {\n  checkStock: (state) => {\n    const stock = { chain: 3, tube: 0 };\n    if (stock[state.part] === undefined) {\n      return { ok: false, error: 'unknown part ' + state.part };\n    }\n    return { ok: true, update: { qty: stock[state.part] } };\n  },\n  getPrice: (state) => {\n    const prices = { chain: 450, tube: 180 };\n    return { ok: true, update: { price: prices[state.part] } };\n  },\n  writeQuote: (state) => {\n    if (state.qty === 0) {\n      return { ok: false, error: 'out of stock' };\n    }\n    return { ok: true, update: { quote: state.part + ': ' + state.price + ' pesos' } };\n  },\n};\n\nfunction runPipeline(names, input) {\n  let state = input;\n  const trail = [];\n  for (const name of names) {\n    const step = STEPS[name];\n    if (step === undefined) {\n      trail.push(name + ':failed');\n      return { status: 'failed', failedAt: name, error: 'unknown step', trail: trail };\n    }\n    const result = step(state);\n    trail.push(name + (result.ok ? ':ok' : ':failed'));\n    if (!result.ok) {\n      return { status: 'failed', failedAt: name, error: result.error, trail: trail };\n    }\n    state = { ...state, ...result.update };\n  }\n  return { status: 'done', state: state, trail: trail };\n}",
          tests: {
            kind: 'function',
            fn: 'runPipeline',
            cases: [
              { label: 'all steps work', args: [['checkStock', 'getPrice', 'writeQuote'], { part: 'chain' }], expected: { status: 'done', state: { part: 'chain', qty: 3, price: 450, quote: 'chain: 450 pesos' }, trail: ['checkStock:ok', 'getPrice:ok', 'writeQuote:ok'] } },
              { label: 'out of stock stops at the quote', args: [['checkStock', 'getPrice', 'writeQuote'], { part: 'tube' }], expected: { status: 'failed', failedAt: 'writeQuote', error: 'out of stock', trail: ['checkStock:ok', 'getPrice:ok', 'writeQuote:failed'] } },
              { label: 'an unknown part stops at the first step', args: [['checkStock', 'getPrice', 'writeQuote'], { part: 'saddle' }], expected: { status: 'failed', failedAt: 'checkStock', error: 'unknown part saddle', trail: ['checkStock:failed'] } },
              { label: 'an unknown step name', args: [['checkStock', 'sendEmail'], { part: 'chain' }], expected: { status: 'failed', failedAt: 'sendEmail', error: 'unknown step', trail: ['checkStock:ok', 'sendEmail:failed'] }, hidden: true },
              { label: 'no steps', args: [[], { part: 'chain' }], expected: { status: 'done', state: { part: 'chain' }, trail: [] }, hidden: true },
            ],
          },
          hints: [
            'Loop over `names`. Look the step up with `STEPS[name]` and check for `undefined` before you call it.',
            'Push the trail text before you decide whether to return, so a failed step also appears in the trail.',
            'On success build a new state with `{ ...state, ...result.update }`. Return the “done” result only after the loop ends.',
          ],
          explanation: 'Because every step returns the same shape, the runner is a short loop. It never guesses: an unknown name stops the run, a failed step stops the run, and the trail shows exactly how far it got. The order comes from the list you pass in, never from a model.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-57-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Build Mika’s quote workflow',
          prompt: 'Choose and order the steps of a sequential workflow for a repair request. Skip the tempting shortcuts. When the rules pass, a sample request is played through your steps.',
          concept: 'a fixed workflow with a model inside one step',
          situation: 'Mika wants every repair request handled the same way: look things up, calculate the quote with code, let a model word the message, check the wording, send it, and book only after the customer says yes. The model must never invent a price, and nothing may change the shop’s calendar before the customer agrees.',
          parts: [
            { id: 'receive-request', lane: 'input', label: 'Receive the customer’s message', detail: 'The message arrives with whatever the customer typed.' },
            { id: 'extract-part', lane: 'ai', label: 'Model reads the message and names the part and the job', detail: 'The model returns a part name that code checks against the shop’s list.' },
            { id: 'check-stock', lane: 'tool', label: 'Check stock for the part', detail: 'A read-only lookup.' },
            { id: 'get-price', lane: 'tool', label: 'Get the price of the part and the job', detail: 'A read-only lookup from the price list.' },
            { id: 'write-quote', lane: 'tool', label: 'Work out the total with code', detail: 'The total is calculated, never written by a model.' },
            { id: 'draft-wording', lane: 'ai', label: 'Model words a friendly message around the quote figures', detail: 'The model writes the sentences, using only the figures it is given.' },
            { id: 'check-wording', lane: 'tool', label: 'Check that every figure in the message matches the quote', detail: 'A check outside the model.' },
            { id: 'send-message', lane: 'output', label: 'Send the checked message with the quote', detail: 'The customer reads the quote.' },
            { id: 'customer-confirms', lane: 'human', label: 'The customer replies yes or no', detail: 'A person decides before anything changes.' },
            { id: 'book-slot', lane: 'tool', label: 'Book the slot after a yes', detail: 'The one step that changes the calendar.' },
            { id: 'book-first', lane: 'tool', label: 'Book the slot first to hold it for the customer', detail: 'It feels helpful, and the booking exists before anything is checked.' },
            { id: 'guess-price', lane: 'ai', label: 'If the price lookup fails, let the model estimate the price', detail: 'The quote always has a number.' },
          ],
          rules: [
            { id: 'r-lookups', kind: 'require', parts: ['check-stock', 'get-price', 'write-quote'], message: 'The quote needs real stock and prices, calculated by code.' },
            { id: 'r-wording', kind: 'require', parts: ['draft-wording', 'check-wording'], message: 'A model-written message must be checked against the quote, because a model can change a figure.' },
            { id: 'r-confirm', kind: 'require', parts: ['customer-confirms', 'book-slot'], message: 'The customer’s answer comes before the booking.' },
            { id: 'r-no-early', kind: 'forbid', parts: ['book-first'], message: 'A booking made before the checks can leave a job that cannot be done, and someone has to undo it.' },
            { id: 'r-no-guess', kind: 'forbid', parts: ['guess-price'], message: 'An estimated price presented as a quote is an invented promise. When a lookup fails the workflow should stop and say so.' },
            { id: 'r-o1', kind: 'before', parts: ['receive-request', 'extract-part'], message: 'The message has to arrive before a model can read it.' },
            { id: 'r-o2', kind: 'before', parts: ['check-stock', 'write-quote'], message: 'The quote needs the stock result.' },
            { id: 'r-o3', kind: 'before', parts: ['get-price', 'write-quote'], message: 'The quote needs the prices.' },
            { id: 'r-o4', kind: 'before', parts: ['write-quote', 'draft-wording'], message: 'The wording is written around figures that already exist.' },
            { id: 'r-o5', kind: 'before', parts: ['draft-wording', 'check-wording'], message: 'You can only check wording after it is written.' },
            { id: 'r-o6', kind: 'before', parts: ['check-wording', 'send-message'], message: 'Only a checked message is sent.' },
            { id: 'r-o7', kind: 'before', parts: ['send-message', 'customer-confirms'], message: 'The customer has to read the quote before answering.' },
            { id: 'r-o8', kind: 'before', parts: ['customer-confirms', 'book-slot'], message: 'Booking waits for the answer.' },
          ],
          solution: ['receive-request', 'extract-part', 'check-stock', 'get-price', 'write-quote', 'draft-wording', 'check-wording', 'send-message', 'customer-confirms', 'book-slot'],
          minSteps: 8,
          maxSteps: 10,
          hints: [
            'Put the read-only lookups first, then the calculation that uses them.',
            'Two steps are tempting shortcuts: one books too early and one lets a model invent a number. Leave both out.',
            'The model’s wording step is followed by a check, and the customer’s answer comes before the booking.',
          ],
          explanation: 'The order is fixed in advance: read, calculate with code, word with a model, check the wording, send, wait for a person, then change the calendar. The model works in two steps (reading the message and wording the reply), and the code checks both.',
          simulation: {
            input: 'Customer message: “Hi, I need a new chain for my commuter bike and a tune-up on Saturday.”',
            steps: {
              'receive-request': 'The message arrives.',
              'extract-part': 'The model returns part: chain, job: tune-up. Code confirms both are on the shop’s lists.',
              'check-stock': 'The stock lookup returns 3 chains.',
              'get-price': 'The price lookup returns ₱450 for the chain and ₱600 for the tune-up.',
              'write-quote': 'Code adds the figures: ₱1,050.',
              'draft-wording': 'The model writes a friendly message that includes the figures it was given.',
              'check-wording': 'A check finds ₱450, ₱600 and ₱1,050 in the message, all matching the quote.',
              'send-message': 'The checked message is sent to the customer.',
              'customer-confirms': 'The customer replies: “Yes, please.”',
              'book-slot': 'Only now is Saturday at 9:00 booked.',
            },
            output: 'The customer receives a checked quote and answers it, and only then is the slot booked. If the price lookup had failed, the workflow would have stopped there and said so.',
          },
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-57-q1',
        prompt: 'When is a fixed sequential workflow a better choice than a ReAct loop?',
        choices: [
          'When the next step depends on what the last tool returned, and nobody can say in advance what it will be',
          'When you want the model to be as flexible as possible, because a fixed list limits how helpful it can be',
          'When customers phrase their requests in many different ways, because only a loop can read different wording',
          'When the steps and their order are the same every time, and only the data changes from run to run',
        ],
        answer: 3,
        explanation: 'A fixed list suits jobs whose shape never changes. Different wording is handled by a model inside one step, so it is not a reason for a loop. A loop is for cases where the next step truly depends on the last result.',
      },
      {
        id: 'building-ai-agents-57-q2',
        prompt: 'In a pipeline, step 3 returns {ok: false, error: "price list unavailable"}. What should the runner do?',
        choices: [
          'Skip step 3 and carry on with steps 4 and 5, so that the customer still gets some kind of answer',
          'Fill in the missing price with a typical value so that the later steps have what they need',
          'Stop, record that step 3 failed and why, and return that to the caller to handle or to show',
          'Run step 3 again in a tight loop until it works, since a failed step is always a temporary problem',
        ],
        answer: 2,
        explanation: 'Stopping at the first failure and naming the step keeps a wrong result from travelling on. Skipping or inventing a value hides the problem, and endless retries are risky (lessons 59 to 60 cover safe retry).',
      },
      {
        id: 'building-ai-agents-57-q3',
        prompt: 'Where is the safest place to use a model in the quote pipeline?',
        choices: [
          'In the wording step only, with its output checked against the quote figures before it is sent',
          'In every step, so that the model can decide to skip or reorder steps when a case looks unusual',
          'In the stock step, because a model can estimate what is probably on the shelf from past chats',
          'In the pipeline runner itself, so that the model decides when the pipeline has finished',
        ],
        answer: 0,
        explanation: 'A model is useful where language is needed, and its output must be checked. Letting it reorder steps, guess stock or run the loop gives up what the fixed pipeline was for.',
      },
      {
        id: 'building-ai-agents-57-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a pipeline in an agent?',
        choices: [
          'A model that thinks for a long time before it answers a customer’s question',
          'A cable that carries the model’s answers from the cloud to the customer’s phone',
          'A list of tools that the model may choose from in any order it likes',
          'A fixed list of steps run in order, each one passing its result to the next',
        ],
        answer: 3,
        explanation: 'A pipeline is a fixed sequence of steps. The order is decided in advance, and each step hands its result on.',
      },
      {
        id: 'building-ai-agents-57-q5',
        audience: { min: 'advanced' },
        prompt: 'A pipeline’s step 4 sends an email. The process crashes after the email is sent but before progress is saved. On restart, step 4 runs again. What would have prevented the duplicate email?',
        choices: [
          'A longer timeout on the email step, so that the crash cannot happen while a message is being sent',
          'A bigger model in the wording step, so that the email text is better and customers do not mind getting duplicates',
          'An idempotency key or a send record checked before sending, so repeating the step does not send twice',
          'Running the pipeline twice at the same time, so that one copy always survives the crash of the other',
        ],
        answer: 2,
        explanation: 'A crash between an effect and the save of progress cannot be ruled out. The defence is to make the step safe to repeat: a key or a record the step checks before it acts.',
      },
    ],
    task: {
      title: 'Extend the pipeline with a gate and a new step',
      minutes: 18,
      steps: [
        'Save the code as `pipeline.py` and run it. Compare the output with the expected output.',
        'Add a fourth step called `check_limit` that fails when the price is above 1,000 pesos, and put it in `STEPS` after `get_price`. Add a part to `STOCK` and `PRICES` that is above the limit and run it.',
        'Make `get_price` return a failed result (not raise) when the part has no price. Test it by adding a part to `STOCK` only.',
        'Change it and observe: swap `write_quote` and `get_price` in `STEPS`, then run again. Note the error, and what in your code would stop a bad order from reaching a customer.',
        'Reflect: in this pipeline, which step would you let a model do, and what exactly would you check about its output?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Only do the first two steps and the swap in step 4. Write one sentence about what the error message told you.'] },
      { audience: { min: 'advanced' }, steps: ['Add timing to each step (a start and end time stored in the trail), and make the runner accept a `gate` function that checks a step’s result before the state is updated. Write which steps in your own project must be idempotent.'] },
    ],
  },
  {
    id: 'building-ai-agents-58',
    day: 58,
    title: 'Conditional Execution',
    summary: 'Choose the next step from a tool result with rules in code, accept only allow-listed routes from a model, and always cover the odd result.',
    intro: {
      objectives: [
        'Route to the next step from a tool result with rules written in code',
        'Accept a model’s proposed route only if it is on an allow-list, with a safe default',
        'Cover a missing or malformed result so no input falls through',
      ],
      why: 'Real jobs branch: in stock or not, approved or not, found or not. Deciding the branch in code, from the result, makes behaviour exact and testable, and keeps the model for the parts that really need language.',
    },
    minutes: 22,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'The stock check returns zero. What happens next? A fixed list has no answer, because the next step now depends on a result. A free-running loop might improvise. A router gives a third option: a few clear rules, written by you, that read the result and choose the branch. This lesson shows how to build a router, why code should make most of these decisions, and how to keep a model’s suggestions on a short leash.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika’s pipeline from lesson 57 stopped with “out of stock, no quote written” when a customer asked for an inner tube. The customer got a blunt failure. Mika wants a better reply. If the part is in stock, write the quote. If it is out but the supplier restocks in three days or fewer, offer to wait. If it is out for longer, suggest another part. If the tool returns something strange, pass the case to a person. She first lets the model choose the branch, and once it picks “write_quote” for a part with zero stock because it wanted to be helpful. She moves the decision to a few lines of code. The model still words each reply.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: '**Conditional execution**, or branching, means choosing the next step from the result of the last one. There are three ways to decide, and they differ in reliability. A **rule in code** reads the result and picks a branch: exact, free and easy to test. A **model-proposed route** asks the model to pick from a short list of named options, which suits decisions that need language understanding, such as “is this message a complaint or a question?”. A **person** decides when the stakes are high. Start with code. Use a model only where a rule cannot express the decision, and even then, check its answer.' },
      { type: 'diagram', format: 'mermaid', caption: 'A router for the stock result. Every path ends at a named next step, and the first diamond sends strange results to a person.', source: ['flowchart TD', '  A[Result of check_stock]', '  B{Is the result well formed?}', '  C{Is qty above 0?}', '  D{Restock in 3 days or fewer?}', '  E[write_quote]', '  F[offer_wait]', '  G[suggest_other]', '  H[ask_person]', '  A --> B', '  B -->|no| H', '  B -->|yes| C', '  C -->|yes| E', '  C -->|no| D', '  D -->|yes| F', '  D -->|no| G'].join('\n') },
      { type: 'paragraph', text: 'Rules for a good router:' },
      { type: 'list', items: [
        '**Read the result, not the model’s opinion of it.** Branch on fields such as `qty` and `restock_days`.',
        '**Check the shape first.** A result with no `qty`, a negative `qty` or a timeout message is not “zero stock”. It goes to a person or to the failure handling of lessons 59 and 60.',
        '**Always have a default.** The last rule catches everything else. Without it, an unexpected result falls through and the agent does something nobody planned.',
        '**Name every route** and keep the names in one allow-list. A route that is not on the list is never run.',
        '**Test each branch**, and test the odd inputs: missing fields, wrong types, `null`.',
      ] },
      {
        type: 'table',
        headers: ['What the result says', 'Next step', 'Why'],
        rows: [
          ['qty is above 0', 'write_quote', 'The part is there, so a quote can be written'],
          ['qty is 0 and restock is 3 days or fewer', 'offer_wait', 'The customer may accept a short wait'],
          ['qty is 0 and restock is later, or unknown', 'suggest_other', 'A long or unknown wait needs another option'],
          ['No qty, a negative qty or an error', 'ask_person', 'The result cannot be trusted, so a person looks'],
        ],
        caption: 'A routing table is also your test plan: one test per row.',
      },
      { type: 'paragraph', text: 'When a model proposes a route, treat it like any model output. Check that the name is on the allow-list. If it is not, take a safe default, usually “ask a person”, and record the surprise. Branches also have a cost. Each one is another case to test, and deep nests of `if` are hard to read. If the branching keeps growing, a graph or a state machine (lesson 14 introduced state) is clearer than a pile of `if` statements.' },
      { type: 'version', text: 'Frameworks have their own names for routing. LangGraph’s Graph API describes `add_conditional_edges(source, routing_fn, optional_mapping)`, where the routing function receives the state and returns the name of the next node. CrewAI’s flows documentation lists the decorators `@start()`, `@listen()` and `@router()`. These APIs change, so read the pages. The idea they implement is the one you build below.', checked: CHECKED, sources: [DOCS.langgraphGraph, DOCS.crewFlows] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, a router is a set of road signs at a junction. The sign reads what is in front of you (the stock result) and points one way. In the code, `route_on_stock` is the sign for the stock result: if the result is not a dictionary with `qty`, go to a person. If `qty` is above zero, quote. If it is zero and the part comes back within three days, offer to wait. Otherwise suggest something else. `safe_route` checks a name that a model suggested against the list of allowed names, and sends anything else to a person. The last lines try five different results and two names.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Fail closed: an unrecognised or malformed input should lead to the most cautious branch, usually a person, never to the most helpful one. Log the inputs and the chosen route for each decision, so an odd outcome can be replayed and audited. If a model picks routes, validate its output against a schema with an enum, measure its accuracy on a labelled set, and move the clear-cut cases into code rules so the model only sees the ambiguous ones. Beware of combinatorial growth when several decisions interact. Branches that rejoin later need a clear shared state so that the steps after the join do not depend on which branch ran.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will route five stock results and check two model-proposed route names. It needs only Python 3.10 or later, with no packages or keys. Save it as `router.py`.' },
      { type: 'code', language: 'python', label: 'router.py', code: String.raw`ALLOWED_ROUTES = {"write_quote", "offer_wait", "suggest_other", "ask_person"}


def route_on_stock(result):
    """Plain code reads the tool result and picks the next step. No model is asked."""
    if not isinstance(result, dict) or "qty" not in result:
        return "ask_person"
    if result["qty"] > 0:
        return "write_quote"
    if result.get("restock_days", 99) <= 3:
        return "offer_wait"
    return "suggest_other"


def safe_route(proposed):
    """A model may PROPOSE a route. Code only accepts names on the allow-list."""
    return proposed if proposed in ALLOWED_ROUTES else "ask_person"


results = [
    {"part": "chain", "qty": 3},
    {"part": "tube", "qty": 0, "restock_days": 2},
    {"part": "saddle", "qty": 0, "restock_days": 14},
    {"error": "timeout"},
    "oops",
]
for result in results:
    print(route_on_stock(result), "<-", result)

print(safe_route("write_quote"), safe_route("refund_everyone"))
` },
      { type: 'paragraph', text: 'Read the important lines. The first `if` in `route_on_stock` is the shape check: anything that is not a dictionary with `qty` goes to a person. `result.get("restock_days", 99)` gives a large default when the field is missing, so an unknown restock time is treated as a long wait. The order of the checks matters: zero stock is only examined after the shape and the positive case have been handled. `safe_route` is the leash on a model: one membership test against a set.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `write_quote <- {'part': 'chain', 'qty': 3}
offer_wait <- {'part': 'tube', 'qty': 0, 'restock_days': 2}
suggest_other <- {'part': 'saddle', 'qty': 0, 'restock_days': 14}
ask_person <- {'error': 'timeout'}
ask_person <- oops
write_quote ask_person` },
      { type: 'list', items: [
        'If every result goes to `ask_person`, check that your result is a dictionary with a `qty` key. A string or a dictionary without `qty` fails the shape check, by design.',
        'If a part with zero stock and no `restock_days` prints `suggest_other`, that is the default of 99 working as intended. Change it if your shop prefers another default.',
        'If you get `TypeError: \'>\' not supported`, `qty` is a string such as "3". Check the type in the shape rule or convert before comparing.',
        'If `safe_route` rejects a name that you meant to allow, add it to `ALLOWED_ROUTES`, and add a branch that handles it.',
      ] },
      { type: 'warning', text: 'A route name that comes from a model is untrusted text. Compare it with an allow-list and nothing else. Never turn it into a function call with `eval`, `getattr` on user-controlled names or a shell command. Send malformed results to a person instead of choosing the branch that sounds most helpful, and make sure no branch can book, refund or send anything without the checks the earlier lessons set. The stock figures here are invented.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Add a rule for a part that is discontinued (a `discontinued` flag), and add one test result for it to the list.',
        'Next is Handling Failed Actions (lesson 59): what to do when a tool call fails instead of returning a result.',
        'Read the LangGraph Graph API page on conditional edges and compare its routing function with `route_on_stock`.',
      ] },
      { type: 'takeaways', items: [
        'Branch on the tool’s result with rules in code: exact, free and easy to test.',
        'Check the shape of a result before you read its fields, and always keep a default branch.',
        'Accept a model’s proposed route only if it is on an allow-list, and fall back to a person otherwise.',
        'A routing table doubles as a test plan: one test per row, plus the odd inputs.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-58-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the stock router',
          story: 'You write the rules that read a stock result. The results are plain data, so no model runs in this exercise.',
          prompt: 'Write `chooseRoute(result)`. If `result` is `null`, is not an object, has no numeric `qty` or has a negative `qty`, return `"ask_person"`. If `qty` is above 0, return `"write_quote"`. Otherwise (qty is 0): if `restock_days` is present and is 3 or fewer, return `"offer_wait"`; in every other case return `"suggest_other"`.',
          concept: 'conditional routing',
          language: 'javascript',
          starter: "function chooseRoute(result) {\n  // 1. shape check: null, not an object, qty not a number, qty below 0\n  // 2. qty above 0\n  // 3. qty is 0: restock_days of 3 or fewer, otherwise suggest another part\n  return 'ask_person';\n}",
          solution: "function chooseRoute(result) {\n  if (result === null || typeof result !== 'object' || typeof result.qty !== 'number' || result.qty < 0) {\n    return 'ask_person';\n  }\n  if (result.qty > 0) {\n    return 'write_quote';\n  }\n  if (result.restock_days !== undefined && result.restock_days <= 3) {\n    return 'offer_wait';\n  }\n  return 'suggest_other';\n}",
          tests: {
            kind: 'function',
            fn: 'chooseRoute',
            cases: [
              { label: 'in stock', args: [{ qty: 3 }], expected: 'write_quote' },
              { label: 'out, restock in 2 days', args: [{ qty: 0, restock_days: 2 }], expected: 'offer_wait' },
              { label: 'out, restock in 14 days', args: [{ qty: 0, restock_days: 14 }], expected: 'suggest_other' },
              { label: 'an error result', args: [{ error: 'timeout' }], expected: 'ask_person' },
              { label: 'a string is not a result', args: ['oops'], expected: 'ask_person' },
              { label: 'exactly 3 days still waits', args: [{ qty: 0, restock_days: 3 }], expected: 'offer_wait', hidden: true },
              { label: 'unknown restock time', args: [{ qty: 0 }], expected: 'suggest_other', hidden: true },
              { label: 'null result', args: [null], expected: 'ask_person', hidden: true },
              { label: 'a negative quantity is bad data', args: [{ qty: -1 }], expected: 'ask_person', hidden: true },
            ],
          },
          hints: [
            'Do the shape check first, in one `if`, so later rules can trust that `result.qty` is a number.',
            'Order matters: positive `qty` next, then zero stock. Use `result.restock_days !== undefined` before comparing it.',
            'Everything left over, zero stock with a long or unknown wait, returns `"suggest_other"`.',
          ],
          explanation: 'The shape check goes first so every later rule can rely on a number. The order of the remaining rules follows the routing table, and the final return is the default. Each row of the table is one test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-58-match-1',
          kind: 'match',
          title: 'Who should make this decision',
          prompt: 'Match each decision to the way it should be made.',
          concept: 'code, model or person',
          labels: { terms: 'Decision', meanings: 'Who or what decides' },
          pairs: [
            { term: 'Stock is 0 and the part returns in 2 days: offer to wait or not?', definition: 'A rule in code over the tool result', note: 'The facts are in fields, and a rule can read them exactly.' },
            { term: 'Is the customer’s free-text message a complaint, a question or a compliment?', definition: 'A model proposes one of three named labels, and code checks the label is on the list', note: 'This needs language understanding, so a model fits, with an allow-list on its answer.' },
            { term: 'Should a ₱20,000 warranty refund be issued?', definition: 'A person decides, with the facts shown to them', note: 'Large, hard-to-reverse money decisions need a person.' },
          ],
          hints: [
            'Ask: are the facts in a field a rule can read, or in free text that needs understanding?',
            'Ask: how bad is it if the decision is wrong, and can it be undone?',
          ],
          explanation: 'Decisions on structured facts belong in code. Decisions that need language understanding can use a model, with its answer limited to an allow-list. Costly, irreversible decisions need a person.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-58-scenario-1',
          kind: 'scenario',
          title: 'The model proposes an unexpected route',
          prompt: 'Choose what your code should do.',
          concept: 'allow-listed routes',
          situation: 'A clinic receptionist agent (invented) lets a model pick the next step from this list: book_visit, send_reminder, ask_person. For one message the model returns the route “cancel_all_visits_today”.',
          options: [
            { text: 'Reject it because it is not on the list, take the safe default (ask_person), and log the proposed name for review.', consequence: 'Nothing runs that nobody approved. The log shows the model proposing an odd route, which is a signal to look at the prompt or the messages that cause it.', quality: 'best' },
            { text: 'Run it, since the model must have understood something about the message that the list does not capture.', consequence: 'Every visit for the day could be cancelled by a single confused reply. The list exists to prevent exactly this.', quality: 'poor' },
            { text: 'Pick the closest route by spelling, which is book_visit, and run that.', consequence: 'A route named “cancel” is not close in meaning to “book”. You guessed the opposite of what the model asked for.', quality: 'poor' },
            { text: 'Ask the model to repeat its answer, and run it if it gives the same route twice.', consequence: 'A model can repeat a wrong answer. Two identical answers are still the model agreeing with itself, and the name is not on the list.', quality: 'poor' },
          ],
          hints: [
            'Which names has your code agreed to run?',
            'A repeated or guessed answer does not change whether the name is on the list.',
            'When a model steps outside the list, the safest default is a person.',
          ],
          explanation: 'An allow-list turns a model’s suggestion into a choice among agreed options. Anything else takes the safe default and is recorded, because an unexpected name is information about the prompt, the data or an attack.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-58-q1',
        prompt: 'Mika wants “in stock leads to a quote, out of stock leads to an offer to wait”. Where is the best place to make that decision?',
        choices: [
          'In the model, which should read the stock result and decide the next step in its own words',
          'In the customer’s message, by asking the customer to say whether they would wait or not',
          'In the system instruction, by listing every possible stock level and the reply for each one',
          'In code, as rules over the fields of the tool result, with a default for the odd case',
        ],
        answer: 3,
        explanation: 'The facts are in structured fields, so a rule in code is exact, free and testable. A model adds variation and cost where none is needed, and an instruction cannot enforce anything.',
      },
      {
        id: 'building-ai-agents-58-q2',
        prompt: 'True or false: if the model proposes a route that is not on your allow-list but explains it well, the program should run it.',
        choices: [
          'True, because a model that explains its choice well has very likely understood the case in front of it',
          'True, because the allow-list is only a suggestion, and the model has more context than the code has',
          'False, because only agreed names may run; take the safe default and log the odd proposal for review',
          'False, because the program should always run the closest allowed route by spelling in such a case',
        ],
        answer: 2,
        explanation: 'An allow-list is a control, not a suggestion. A good-sounding explanation is more generated text, and guessing the nearest route could run the opposite action. The safe default is a person, and the log records the surprise.',
      },
      {
        id: 'building-ai-agents-58-q3',
        prompt: 'A router has rules for “qty above 0” and “qty is 0”. The tool returns {"error": "timeout"}. What is wrong with the router?',
        choices: [
          'It has no rule for a missing or malformed result, so the case falls into a branch not meant for it',
          'It uses code instead of a model, which cannot understand an error message that is written in plain English',
          'It checks qty twice, so the second check always replaces the first one and the original result is lost for good',
          'It should have run the tool three times first, because a timeout always means that the stock is zero',
        ],
        answer: 0,
        explanation: 'A shape check and a default branch catch results that match no rule. Here the case belongs to failure handling or a person, not to the stock rules. A timeout says nothing about stock.',
      },
      {
        id: 'building-ai-agents-58-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a conditional step in an agent?',
        choices: [
          'A step that only runs on Mondays, when the shop has more staff to check the work',
          'A step that the model writes in secret before it answers the customer',
          'A step that repeats forever until the customer replies to the shop’s message',
          'A step that chooses what to do next from what the previous step returned',
        ],
        answer: 3,
        explanation: 'A conditional step looks at the previous result and picks the next step, like a sign at a junction.',
      },
      {
        id: 'building-ai-agents-58-q5',
        audience: { min: 'advanced' },
        prompt: 'Your router asks a model to pick among five routes, and an evaluation on labelled cases shows that about 4 in 100 are wrong. What is the best next step?',
        choices: [
          'Raise the temperature, so the model explores more options and the wrong routes average out over time',
          'Replace the five routes with one single route called “other”, so that no route can ever be wrong again',
          'Log inputs and routes, move clear cases to code rules, and keep the model for the ambiguous rest',
          'Ask the model to grade its own routes after each run and then trust only the cases that it marks as correct',
        ],
        answer: 2,
        explanation: 'Rules are exact for clear cases, so they remove most errors for free. The model keeps the ambiguous ones, with a person behind it. Raising temperature adds variation, one catch-all hides the problem and self-grading is not an independent check.',
      },
    ],
    task: {
      title: 'Build a routing table and test every row',
      minutes: 16,
      steps: [
        'Save the code as `router.py` and run it. Compare the output with the expected output.',
        'Write a routing table for a decision in your own work (a lookup that can return found, not found or an error). Give each row a condition, a next step and a reason.',
        'Add a result for each row of your table to the `results` list and run the program, checking that each result lands on the route you expected.',
        'Change it and observe: delete the shape check at the top of `route_on_stock` and run it again. Note which result now breaks, and what a customer would have seen.',
        'Reflect: which decision in your routing table would you never leave to a model, and why?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use the table in the lesson as it is. Add one more result of your own, such as a part with `qty` 5, and check that it lands where you expect.'] },
      { audience: { min: 'advanced' }, steps: ['Write the routing table as data (a list of condition and route pairs) and evaluate it in order, so rules can be added without new `if` code. Add a test that every route name in the table is on `ALLOWED_ROUTES`, and a log line that records the input and the route for each decision.'] },
    ],
  },
  {
    id: 'building-ai-agents-59',
    day: 59,
    title: 'Handling Failed Actions',
    summary: 'Turn tool failures into structured results with a kind, choose a response by kind, use labelled fallbacks and tell the user the truth.',
    intro: {
      objectives: [
        'Turn a failure into data with a kind and a message, instead of hiding it or crashing',
        'Choose a response by kind: fix the arguments, retry later, use a labelled fallback, tell the user or stop',
        'Write a failure message for the user that is honest and plain, and keep the detail for the log',
      ],
      why: 'Tools fail all the time: timeouts, bad arguments, missing records, blocked permissions. How an agent handles the failure decides whether a customer gets the truth, an invented answer or a crash.',
    },
    minutes: 22,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'Tools fail. A service times out, a search returns nothing, an argument is wrong. What does your agent do next, and what does it say to the customer? Agents that handle failure well are not the ones that never fail. They turn each failure into something the loop can read, choose a sensible response, and never pretend that nothing happened. This lesson shows how.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika’s price service is slow in the morning. One day its call times out. Her loop wraps the call in a broad `try/except` that returns an empty string, so the loop keeps running. The model sees an empty observation and writes “the chain is around ₱500”, a number it has no source for. On another day the model sends an empty part name. The loop repeats the same call five times, since it treats every failure as temporary. The fixes are small. Each failure becomes a result with a kind and a message. The loop decides by kind: fix the argument, retry later, use a clearly labelled older price or tell the customer. A failure is never an empty string.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'The core idea is to **treat a failure as data**. A tool should never crash the loop or return nothing. It returns a result such as `ok: false` with a **kind** (what sort of failure) and a **message** (what happened). Earlier, in Handling Tool Results and Tool Validation and Error Handling (module 4), you returned errors as results. Here the loop uses the kind to decide what to do.' },
      { type: 'diagram', format: 'mermaid', caption: 'After every tool call the loop asks: did it work, and if not, what kind of failure is it? Wrong arguments are fixed, a temporary failure is retried with limits, and anything else is reported or handed to a person.', source: ['flowchart TD', '  A[Run the tool]', '  B{Did it work?}', '  C[Use the result]', '  D{Were the arguments wrong?}', '  E[Fix the arguments, then try again]', '  F{Is it temporary?}', '  G[Retry later or use a labelled fallback]', '  H[Say so plainly, or stop and ask a person]', '  A --> B', '  B -->|yes| C', '  B -->|no| D', '  D -->|yes| E', '  D -->|no| F', '  F -->|yes| G', '  F -->|no| H'].join('\n') },
      {
        type: 'table',
        headers: ['Kind', 'What it means', 'A good response', 'A bad response'],
        rows: [
          ['invalid_input', 'Your call was wrong (an empty or wrongly typed argument)', 'Send the message back so the arguments can be fixed', 'Retry the same call unchanged'],
          ['timeout or unavailable', 'The service did not answer. It may answer later.', 'Retry with limits (lesson 60), or use a labelled fallback', 'Treat it as “no price exists”'],
          ['not_found', 'The thing you asked about is not there', 'Say so plainly, or offer an alternative', 'Invent a value to fill the gap'],
          ['blocked or unknown', 'A permission, a policy or a failure nobody expected', 'Stop and ask a person', 'Keep trying until it works'],
        ],
        caption: 'The kind decides the response. Retrying only helps with the second row.',
      },
      { type: 'paragraph', text: 'Four habits make this work. First, **never swallow an error**: an empty result tempts a model to fill the gap with something plausible. Second, **tell the model what went wrong and what to try**. Instructive messages (“part must be a non-empty string”) let it fix its own mistake, and the tool-result format of some APIs has an error flag for this. Third, use a **fallback** only when it is honest: an older cached price may be shown if it is labelled as older and its age is stated, and it must never be presented as current. Fourth, **report partial progress**: if four of five steps worked, say which, and what is still undone.' },
      { type: 'paragraph', text: 'What you tell the user is a separate message from what you log. The user gets plain words: what could not be done, what you did instead and what happens next. The log gets the detail: the tool, the arguments, the error text and the time. Never show a customer a stack trace, a key or an internal URL, and do not promise a result you do not have.' },
      { type: 'version', text: 'Claude’s documentation on handling tool calls describes returning a tool_result with `is_error: true` for a failed call, and recommends instructive error messages that say what went wrong and what to try. Other vendors use their own formats. Check your vendor’s page for the exact shape.', checked: CHECKED, sources: [DOCS.claudeHandleTools] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, think of a delivery rider who cannot find a house. The rider can say “wrong address, please check it” (invalid input), “the gate was closed, I will come back at noon” (temporary), “there is no such house on this street” (not found) or “the guard says I am not allowed in, please call the manager” (blocked). Each situation has a different next step, and none of them is “say the parcel was delivered”. In the code, `attempt` catches a `ToolError` and turns it into a small record. `decide` is the rider’s rule book. The last loop tries four parts and prints what the agent would do for each.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Map failures from real APIs to your own kinds in one place: for example, a bad request status is invalid input, a rate limit or a server error is temporary, a missing resource is not found, and an authorisation failure is blocked. Keep that mapping testable. Give each retry a budget and decide where a circuit breaker would stop calls to a service that is failing for everyone. Attach a correlation id to each run so a user report can be matched to a trace. Redact secrets and personal data before logging error text. When a multi-step run fails midway, decide whether the steps already done need an undo (a compensating action) or can safely stay.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will classify four failures and choose a response for each. It needs only Python 3.10 or later, with no packages or keys. Save it as `failures.py`.' },
      { type: 'code', language: 'python', label: 'failures.py', code: String.raw`CACHED_PRICES = {"frame": 9800}  # an older price list, kept as a labelled fallback


class ToolError(Exception):
    def __init__(self, kind, message):
        super().__init__(message)
        self.kind = kind  # "invalid_input", "timeout" or "not_found"


def get_price(part):
    if not isinstance(part, str) or not part:
        raise ToolError("invalid_input", "part must be a non-empty string")
    if part == "frame":
        raise ToolError("timeout", "price service did not answer in 5 seconds")
    if part != "chain":
        raise ToolError("not_found", f"no price listed for {part}")
    return 450


def attempt(part):
    try:
        return {"ok": True, "value": get_price(part)}
    except ToolError as error:
        # The failure becomes DATA the loop can read. It is never a silent success.
        return {"ok": False, "kind": error.kind, "message": str(error)}


def decide(result, part):
    if result["ok"]:
        return "use the price"
    if result["kind"] == "invalid_input":
        return "fix the arguments, do not retry them unchanged"
    if result["kind"] == "timeout" and part in CACHED_PRICES:
        return f"fall back to the cached price {CACHED_PRICES[part]} and label it old"
    return "tell the user plainly that no price is available"


for part in ["chain", "", "frame", "saddle"]:
    result = attempt(part)
    print(repr(part), "->", decide(result, part))
` },
      { type: 'paragraph', text: 'Read the important lines. `ToolError` carries a `kind`, so the loop never has to read an English sentence to decide what to do. In `attempt`, the `except` branch turns the failure into a result with `ok: False`, the kind and the message. Nothing is hidden and nothing crashes. `decide` is the rule book: invalid input is never retried unchanged, a timeout may use a fallback only if one exists (and the message says it is old), and every other failure is reported plainly.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `'chain' -> use the price
'' -> fix the arguments, do not retry them unchanged
'frame' -> fall back to the cached price 9800 and label it old
'saddle' -> tell the user plainly that no price is available` },
      { type: 'list', items: [
        'If `\'frame\'` prints “tell the user plainly…”, check that `CACHED_PRICES` has a `"frame"` key and that the failure kind is `"timeout"`.',
        'If you see `KeyError` in `decide`, you added a `ToolError` kind and forgot to handle it. Keep a final default branch for kinds you did not plan for.',
        'If the program prints nothing, check that the loop at the bottom is not indented under a function.',
        'If you get `NameError`, the functions must be defined above the loop that calls them.',
      ] },
      { type: 'warning', text: 'Error text can leak things: keys inside URLs, file paths, customer data. Clean it before it goes to a user, and be careful what you send back to a model as well. Never write a broad `except: pass` or return an empty string on failure, because both turn a failure into silence. Never retry a call that changes something (a booking, a payment) without a way to make it safe to repeat (lesson 60). A cached or fallback value must always be labelled as such. The prices here are invented.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Add a fourth kind, “blocked”, that raises for a part named “restricted”, and make `decide` send it to a person.',
        'Next is Retry Strategies and Recovery (lesson 60): how long to wait, how many times, and how to retry without doing something twice.',
        'Read the Claude tool-use page on handling tool calls and look at how it reports an error result.',
      ] },
      { type: 'takeaways', items: [
        'Treat a failure as data: a result with a kind and a message, never an empty string and never a crash.',
        'Choose the response by kind. Retrying helps with temporary failures only, and invalid input needs a fix first.',
        'Use a fallback only when it is honest: labelled as older, with its age, and never presented as fresh.',
        'Tell the user plainly what happened and what comes next, and keep the technical detail in the log.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-59-fix-bug-1',
          kind: 'fix-bug',
          title: 'The loop that retries a bad call forever',
          prompt: 'This function chooses the agent’s next move from a failed or successful tool result. It should answer `"fix_arguments"` for `invalid_input`, but it answers `"retry"`, so an agent repeats the same wrong call. The results here are plain data, and no model runs. Find the line with the bug and fix it.',
          concept: 'choosing a response by failure kind',
          language: 'javascript',
          code: "function decideNext(result) {\n  if (result.ok) {\n    return 'continue';\n  }\n  if (result.kind === 'timeout' || result.kind === 'unavailable') {\n    return 'retry';\n  }\n  if (result.kind === 'invalid_input') {\n    return 'retry';\n  }\n  if (result.kind === 'not_found') {\n    return 'tell_user';\n  }\n  return 'ask_person';\n}",
          bugLine: 9,
          fixes: [
            { line: "    return 'fix_arguments';", correct: true, why: 'A call with wrong arguments will fail the same way every time. The arguments must be fixed first, so the move is to fix them, not to repeat the call.' },
            { line: "    return 'continue';", correct: false, why: 'Continuing treats a failed call as a success. The loop would move on with no result.' },
            { line: "    return 'ask_person';", correct: false, why: 'A person is not needed for a wrong argument that the model can correct from the error message. Escalating everything wastes their time.' },
            { line: "    return 'tell_user';", correct: false, why: 'The user did not cause this and cannot fix it. The agent should correct its own call first.' },
          ],
          tests: {
            kind: 'function',
            fn: 'decideNext',
            cases: [
              { label: 'success continues', args: [{ ok: true }], expected: 'continue' },
              { label: 'timeout retries', args: [{ ok: false, kind: 'timeout' }], expected: 'retry' },
              { label: 'invalid input is fixed, not retried', args: [{ ok: false, kind: 'invalid_input' }], expected: 'fix_arguments' },
              { label: 'not found tells the user', args: [{ ok: false, kind: 'not_found' }], expected: 'tell_user' },
              { label: 'unknown failure asks a person', args: [{ ok: false, kind: 'weird' }], expected: 'ask_person' },
            ],
          },
          hints: [
            'Read each branch and ask what the agent will do on the next turn. Which branch would repeat the same wrong call?',
            'Look at the branch for `invalid_input`. Would the same call ever succeed if it is sent again unchanged?',
            'The move for a call with wrong arguments is to fix the arguments, so the branch should return `"fix_arguments"`.',
          ],
          explanation: 'Retrying only helps when the failure is temporary. A call with wrong arguments fails the same way every time, so the useful response is to fix the arguments. Choosing the response by kind is what stops a stuck loop.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-59-match-1',
          kind: 'match',
          title: 'Choose the response for each failure',
          prompt: 'Match each failure to the response that fits it.',
          concept: 'responses by failure kind',
          labels: { terms: 'The failure', meanings: 'The response' },
          pairs: [
            { term: 'The calendar service answers “401: not authorised” after a password change.', definition: 'Stop and ask a person. Retrying cannot fix a credential problem.', note: 'A permission failure is not temporary.' },
            { term: 'The price tool replies “part must be a string” after the model sent a number.', definition: 'Pass the message back so the model corrects the argument, then call again.', note: 'The call was wrong, not the service.' },
            { term: 'The courier lookup does not answer within 5 seconds.', definition: 'Retry later within a limit, or use a labelled older value, and say it is not live.', note: 'A temporary failure may clear.' },
            { term: 'The shop’s records have no part called “gear-9000”.', definition: 'Tell the customer plainly that the shop does not list it, and offer something that it does list.', note: 'Nothing is wrong with the tool. The answer is simply no.' },
          ],
          hints: [
            'Ask: will the same call ever work if I send it again?',
            'Ask: is the problem with my call, with the service, with the world, or with permission?',
          ],
          explanation: 'Each failure points to a different cause, and the right response follows the cause: fix the call, wait, report that nothing exists, or stop for a person.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-59-scenario-1',
          kind: 'scenario',
          title: 'What does the customer hear',
          prompt: 'Choose the best message to send.',
          concept: 'honest failure messages',
          situation: 'Mika’s agent could check stock and write a quote, but the booking tool timed out. The booking was not made. The customer is waiting online for a reply about Saturday.',
          options: [
            { text: '“I have your quote, but I could not confirm the Saturday slot just now. Nothing is booked yet. A team member will contact you today, or you can try again in a few minutes.”', consequence: 'The customer knows what is done (a quote), what is not (a booking) and what happens next. No false promise is made.', quality: 'best' },
            { text: '“You are all set for Saturday! See you at 9:00.”', consequence: 'There is no booking. The customer turns up on Saturday, and the shop has no record of them.', quality: 'poor' },
            { text: '“Error: ETIMEDOUT at booking-service.internal:443, request id 7f3a.”', consequence: 'The customer cannot use this, and the message exposes the shop’s internal service names. It belongs in the log, not on the customer’s screen.', quality: 'poor' },
            { text: '“Sorry, something went wrong.”', consequence: 'It is honest, but the customer does not know whether the quote exists or what to do next. It is safe and unhelpful.', quality: 'acceptable' },
          ],
          hints: [
            'Which parts of the job are done, and which are not?',
            'The log is for detail. The customer needs plain words and a next step.',
            'Never promise something that the tool results do not show.',
          ],
          explanation: 'A good failure message says what is done, what is not, and what happens next, in plain words. It makes no promise the results do not support, and it keeps technical detail in the log.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-59-q1',
        prompt: 'A price call times out, and the loop returns an empty string as the observation. What is the main risk?',
        choices: [
          'The empty string is too short to be stored, so the log will be missing a line for that step',
          'The model may fill the gap with an invented price, and nobody learns the tool failed',
          'The empty string uses extra tokens, so the whole conversation will cost more than it needs to',
          'The model will refuse to continue, because every empty observation ends the run in an error',
        ],
        answer: 1,
        explanation: 'Silence invites invention. A model asked to continue with no data can produce a believable number, and nobody learns that the tool failed.',
      },
      {
        id: 'building-ai-agents-59-q2',
        prompt: 'The model calls get_price with part="" and the tool answers invalid_input. What is the best next move?',
        choices: [
          'Repeat the same call a few times in a row, in case the service was only slow for that one moment',
          'Switch to a larger model for the rest of the run, so that the arguments come out right the next time',
          'Tell the customer there is a technical problem and end the run without trying anything else at all',
          'Send the error message back so the model can fix the argument, never repeating the call unchanged',
        ],
        answer: 3,
        explanation: 'An invalid call fails the same way each time, so repeating it is wasted effort. The message says what to fix, and the model can fix it.',
      },
      {
        id: 'building-ai-agents-59-q3',
        prompt: 'The live price service is down, and you hold a price from yesterday. What is the honest way to use it?',
        choices: [
          'Use it as the current price, because it is the best number that you have at the moment',
          'Hide it completely, because any older figure is worse than saying nothing at all',
          'Show it only with a clear label that it is older, with its age, or ask a person first',
          'Round it to the nearest hundred so that a small difference will not be noticed',
        ],
        answer: 2,
        explanation: 'A fallback is useful when it is honest about what it is. Presenting an old figure as current misleads, and a rounded figure only hides the change.',
      },
      {
        id: 'building-ai-agents-59-q4',
        audience: { max: 'beginner' },
        prompt: 'What does it mean to “treat a failure as data”?',
        choices: [
          'Turn the error into a result with a kind and a message the loop can read',
          'Delete every error from the log, so that the data stays clean and easy to read later on',
          'Store every error in a spreadsheet and look at the spreadsheet once a month or so',
          'Ask the model to ignore the error and then carry on as if the tool had worked fine',
        ],
        answer: 0,
        explanation: 'A failure that arrives as a result with a kind and a message can be handled by code. A hidden or ignored error cannot.',
      },
      {
        id: 'building-ai-agents-59-q5',
        audience: { min: 'advanced' },
        prompt: 'A booking tool starts returning 403 forbidden after a permission change. Your loop retries three times with backoff before giving up. What is the design flaw?',
        choices: [
          'Three retries is too few, so the loop should retry ten times or more before it gives up on the call',
          'Backoff should be replaced with a fixed delay, because 403 errors depend on the time of day and the load on the service',
          'The loop should switch to a different model after the first failure so that the permission is granted',
          'A permission failure is not temporary, so retries cannot help; the loop should stop and escalate',
        ],
        answer: 3,
        explanation: 'Retries help only with temporary failures. A permission failure will repeat until someone changes the permission, so the loop should stop and tell a person.',
      },
    ],
    task: {
      title: 'Give your failures a kind and a response',
      minutes: 16,
      steps: [
        'Save the code as `failures.py` and run it. Compare the output with the expected output.',
        'List three tools of your own agent (or Mika’s). For each, write two ways it can fail and the kind of each failure.',
        'Add one of your own failures to `get_price` (a new part name that raises a new kind) and extend `decide` with a response for it. Run it.',
        'Change it and observe: make `attempt` return an empty string on failure instead of the failure record, and note what `decide` can no longer do. Then write the message you would show the customer for the “frame” timeout.',
        'Reflect: which of your failures would you never retry, and what would you do instead?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Pick one tool. Write the failure as a sentence, the kind of failure, and one sentence you would say to the customer, before you change any code.'] },
      { audience: { min: 'advanced' }, steps: ['Write a function that maps HTTP status codes from a real API to your kinds, with tests, and decide which kinds are allowed to be retried. List what you would redact from the error text before it reaches the log and before it reaches the user.'] },
    ],
  },
  {
    id: 'building-ai-agents-60',
    day: 60,
    title: 'Retry Strategies and Recovery',
    summary: 'Retry only temporary failures, wait longer each time with jitter, stop after a limit, make repeated actions safe with an idempotency key, and fall back honestly.',
    intro: {
      objectives: [
        'Compute backoff delays with a cap, and add jitter',
        'Make an action safe to repeat with an idempotency key',
        'Choose a fallback or a stop when retries run out, and avoid retries that multiply across layers',
      ],
      why: 'A good retry turns a short outage into a non-event. A careless one turns one failed booking into three, or one slow service into a flood of calls that keeps it down.',
    },
    minutes: 24,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'A retry can fix a failure, or it can turn one failed booking into three. Whether it helps depends on four decisions: which failures to retry, how long to wait, when to give up and whether the action is safe to do twice. In Handling API Errors and Rate Limits (lesson 23) you retried a model call. Here you retry the steps of an agent, including steps that change things in the world.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika’s booking service times out about twice a week. Her agent retries at once, ten times in a tight loop. The service slows down under the burst. Worse, the third call had actually worked on the server, and only the reply was lost on the way back, so the agent’s next calls booked Saturday at 9:00 again and again. The customer gets three confirmation messages and the workshop has three bookings for one bike. Mika makes three changes. The agent waits between attempts, longer each time. It stops after four attempts. And every booking call carries an idempotency key built from the customer, the job and the date, so a repeated call returns the existing booking instead of making a new one.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'First, retry only failures that can clear by themselves: timeouts, “service unavailable” and rate limits (lesson 59 sorted failures by kind). A wrong argument, a missing record or a permission error will fail the same way again, so repeating them only wastes calls.' },
      { type: 'paragraph', text: 'Second, wait between attempts. **Exponential backoff** doubles the wait each time, up to a **cap**, so the delay before retry number n is `min(cap, base × 2ⁿ)`. **Jitter** randomises the wait (for example, a random time between zero and that delay), so many clients that failed together do not retry together. If the service sends a `Retry-After` value, wait at least that long.' },
      {
        type: 'table',
        headers: ['Retry number', 'Wait before it (base 1 s, cap 8 s)', 'With full jitter'],
        rows: [
          ['1', '1 second', 'a random time up to 1 second'],
          ['2', '2 seconds', 'a random time up to 2 seconds'],
          ['3', '4 seconds', 'a random time up to 4 seconds'],
          ['4', '8 seconds (cap reached)', 'a random time up to 8 seconds'],
          ['5 and later', '8 seconds (stays at the cap)', 'a random time up to 8 seconds'],
        ],
        caption: 'The waits grow fast and then stop growing. The cap and the attempt limit stop a retry from lasting forever.',
      },
      { type: 'paragraph', text: 'Third, set a limit on attempts and on total time. After the limit, stop retrying and choose a recovery: a fallback, a partial result, or a person.' },
      { type: 'paragraph', text: 'Fourth, and most important for agents, make the action **idempotent**: doing it twice has the same effect as doing it once. Reads are naturally idempotent. A booking is not, because a timeout does not tell you whether the action happened. The standard fix is an **idempotency key**: a unique string for the intent (“cust-17:tune-up:2026-11-21”) that is sent with the call and remembered. If the same key arrives again, the service, or your own code, returns the first result instead of acting again. Without a key, never retry an action that changes something unless you can first check whether it happened.' },
      { type: 'diagram', format: 'mermaid', caption: 'A retry loop with limits. Look for the two exits from the retry path: a labelled fallback, or a person.', source: ['flowchart TD', '  A[Call the tool with an idempotency key]', '  B{Did it work?}', '  C{Temporary failure with attempts left?}', '  D[Wait: backoff plus jitter]', '  E[Use the result]', '  F{Labelled fallback available?}', '  G[Use the fallback and say so]', '  H[Stop and ask a person]', '  A --> B', '  B -->|yes| E', '  B -->|no| C', '  C -->|yes| D', '  D --> A', '  C -->|no| F', '  F -->|yes| G', '  F -->|no| H'].join('\n') },
      { type: 'paragraph', text: 'A last trap: retries multiply across layers. An SDK may retry on its own, your tool wrapper may retry, and your agent loop may retry the whole step. With three attempts at each of three layers, one failing call can become 27 calls. Choose one layer to own retries, and switch the others off or lower them.' },
      { type: 'version', text: 'Anthropic’s errors page says its official SDK retries transient failures (connection errors, rate limits and 5xx errors) with exponential backoff, twice by default, honouring the retry-after header, and accepts a `max_retries` setting. OpenAI’s rate-limit guide advises following `Retry-After`, using exponential backoff with jitter, capping attempts and total time, and disabling SDK retries when you manage retries yourself, to avoid nested retry loops. Defaults and helpers change, so read both pages.', checked: CHECKED, sources: [DOCS.claudeErrors, DOCS.openaiRate] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, think of calling a busy restaurant to book a table. If nobody answers, you do not redial ten times in one second. You wait a minute, then two, then four, and you stop after a few tries. When you finally get through, you say your name and the date. If the line cut off just after they wrote your booking down, they will recognise you and not book a second table. Your name and date are the idempotency key. In the code, `backoff_delays` makes the waiting times, `FlakyBooking` fails twice and then works, and `call_with_retries` tries again after each failure, recording the wait it would have made.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Idempotency keys must be stable across retries and unique per intent, so derive them from business data, not from a random value made at call time. Servers need to store the key and the result, usually with an expiry, and to define what happens if the same key arrives with different arguments. Without server support, build a send record on your side and check it before acting, bearing in mind that a crash between the action and the record can still repeat it. Put a total deadline on the whole retry sequence as well as an attempt cap, and share retry budgets across concurrent runs so a failing dependency does not trigger a storm. Log each attempt with its delay and error class. Think about circuit breakers for dependencies that are failing for everyone.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will retry a booking that fails twice and then works, and then repeat it safely with the same key. It needs only Python 3.10 or later, with no packages or keys. The program records the waits it would make and does not sleep. A real agent would call `time.sleep`. Save the first block as `retry.py`.' },
      { type: 'code', language: 'python', label: 'retry.py, part 1', code: String.raw`import random

BOOKINGS = {}  # idempotency_key -> booking id


def backoff_delays(retries, base=1.0, cap=8.0):
    """The waits (seconds) before retry 1, 2, 3 ... doubling, never above cap."""
    return [min(cap, base * 2 ** n) for n in range(retries)]


def with_jitter(delay, rng):
    """Full jitter: a random wait between 0 and the delay, so many clients do not retry together."""
    return delay * rng.random()


class FlakyBooking:
    """Fails twice with a temporary error, then works. Scripted, not a real service."""

    def __init__(self):
        self.calls = 0

    def book(self, slot, key):
        self.calls += 1
        if self.calls <= 2:
            raise TimeoutError("booking service timed out")
        if key not in BOOKINGS:  # the same key never books twice
            BOOKINGS[key] = f"B-{len(BOOKINGS) + 1}"
        return BOOKINGS[key]
` },
      { type: 'paragraph', text: 'Add this below the previous block, in the same file.' },
      { type: 'code', language: 'python', label: 'retry.py, part 2', code: String.raw`def call_with_retries(action, retries=3):
    waits = []
    delays = backoff_delays(retries)
    for attempt in range(retries + 1):
        try:
            return action(), waits
        except TimeoutError:
            if attempt == retries:
                raise
            waits.append(delays[attempt])  # a real agent would sleep here; we only record it
    raise RuntimeError("unreachable")


service = FlakyBooking()
key = "cust-17:tune-up:2026-11-21"
booking, waits = call_with_retries(lambda: service.book("Sat 9:00", key))
print("booking:", booking, "after waits", waits, "calls:", service.calls)
print("again:", service.book("Sat 9:00", key), "bookings stored:", len(BOOKINGS))
print("delays:", backoff_delays(6), "jittered:", round(with_jitter(4.0, random.Random(1)), 2))
` },
      { type: 'paragraph', text: 'Read the important lines. `min(cap, base * 2 ** n)` is the whole backoff rule. Only `TimeoutError` is retried: any other error type passes straight through, because it is not a temporary failure. `attempt == retries` re-raises on the last try, so a failure is reported and not hidden. The key `cust-17:tune-up:2026-11-21` is built from the customer, the job and the date. The second `book` call with the same key returns the same booking and does not add a new one. Note what the scripted service does not show: it fails before booking, whereas a real timeout can happen after the server has already acted. That is exactly why the key matters.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `booking: B-1 after waits [1.0, 2.0] calls: 3
again: B-1 bookings stored: 1
delays: [1.0, 2.0, 4.0, 8.0, 8.0, 8.0] jittered: 0.54` },
      { type: 'list', items: [
        'If a `TimeoutError` escapes, the service failed more times than `retries` allows. Raise `retries` or make `FlakyBooking` fail fewer times.',
        'If `bookings stored` says 2, the key changed between calls. The key must be the same for the same intent.',
        'If the jittered number differs from the one above, the seed or the value passed in was changed. `random.Random(1)` gives the same sequence each time.',
        'If you get `NameError: name \'random\' is not defined`, the `import random` line is missing at the top of the file.',
      ] },
      { type: 'warning', text: 'Retries multiply cost and load. Cap the attempts and the total time, honour `Retry-After`, and let only one layer retry. Never retry an action that changes something (a booking, a payment, a message) unless it carries an idempotency key or you have checked that it did not already happen. Never retry failures that cannot clear, such as a permission error. Log every attempt, so a storm of retries is visible. The bookings here are invented, and nothing is sent anywhere.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Change `FlakyBooking` to fail five times and read the error. Then raise `retries` and see how the waits grow.',
        'Next is Managing Long-Running Tasks (lesson 61): saving progress so that a run can resume after a crash instead of starting again.',
        'Read the retry sections of the Anthropic errors page and the OpenAI rate-limits guide, and note which layer would own retries in your project.',
      ] },
      { type: 'takeaways', items: [
        'Retry only failures that can clear by themselves. Wrong arguments and permission errors will fail the same way again.',
        'Wait longer each time, with a cap and jitter, and stop after a limit on attempts and on time.',
        'Make actions safe to repeat with an idempotency key, because a timeout does not tell you whether the action happened.',
        'Retries multiply across layers, so let one layer own them. When retries run out, use an honest fallback or a person.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-60-code-challenge-1',
          kind: 'code-challenge',
          title: 'Compute the backoff delays',
          story: 'You write the pure function that decides how long to wait. It returns numbers only, so nothing here sleeps and no service is called.',
          prompt: 'Write `backoffDelays(retries, base, cap)`. Return an array with `retries` waits in milliseconds. The first wait is `base`. Each wait is double the one before it, but never more than `cap`. Zero retries gives an empty array.',
          concept: 'exponential backoff with a cap',
          language: 'javascript',
          starter: "function backoffDelays(retries, base, cap) {\n  const delays = [];\n  // the first wait is base, each next one doubles, never above cap\n  return delays;\n}",
          solution: "function backoffDelays(retries, base, cap) {\n  const delays = [];\n  let delay = base;\n  for (let n = 0; n < retries; n++) {\n    delays.push(Math.min(delay, cap));\n    delay = delay * 2;\n  }\n  return delays;\n}",
          tests: {
            kind: 'function',
            fn: 'backoffDelays',
            cases: [
              { label: 'four retries', args: [4, 1000, 60000], expected: [1000, 2000, 4000, 8000] },
              { label: 'the cap stops the growth', args: [6, 1000, 5000], expected: [1000, 2000, 4000, 5000, 5000, 5000] },
              { label: 'no retries', args: [0, 1000, 5000], expected: [] },
              { label: 'one retry', args: [1, 500, 5000], expected: [500] },
              { label: 'a cap below the base', args: [3, 500, 100], expected: [100, 100, 100], hidden: true },
              { label: 'a different base', args: [5, 250, 4000], expected: [250, 500, 1000, 2000, 4000], hidden: true },
            ],
          },
          hints: [
            'Keep a variable `delay` that starts at `base`. Loop `retries` times.',
            'Inside the loop, push `Math.min(delay, cap)`, so no wait is above the cap.',
            'After pushing, double `delay`. Doubling the uncapped value is fine, because `Math.min` is applied each time.',
          ],
          explanation: 'The rule is min(cap, base × 2 to the n). Keeping the waits in a pure function means you can test them exactly. A real agent adds jitter (a random fraction) on top and then sleeps.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-60-predict-output-1',
          kind: 'predict-output',
          title: 'Trace a retry loop',
          prompt: 'This loop retries a scripted flaky function that fails twice and then works. Nothing really waits: the loop only records the waits it would make. Read it carefully and predict the single line it prints.',
          concept: 'retry loop with backoff',
          language: 'javascript',
          code: "let calls = 0;\nfunction flaky() {\n  calls = calls + 1;\n  if (calls < 3) {\n    return { ok: false, kind: 'timeout' };\n  }\n  return { ok: true, value: 'B-1' };\n}\nconst waits = [];\nlet delay = 1000;\nlet result = flaky();\nlet attempts = 1;\nwhile (!result.ok && attempts < 5) {\n  waits.push(delay);\n  delay = Math.min(delay * 2, 3000);\n  result = flaky();\n  attempts = attempts + 1;\n}\nconsole.log(result.value + ' after ' + attempts + ' attempts, waits ' + waits.join(','));",
          choices: [
            'B-1 after 3 attempts, waits 1000,2000',
            'B-1 after 3 attempts, waits 1000,2000,3000',
            'B-1 after 2 attempts, waits 1000',
            'B-1 after 3 attempts, waits 2000,3000',
          ],
          wrongNotes: {
            'B-1 after 3 attempts, waits 1000,2000,3000': 'There are only two waits: one before the second attempt and one before the third. The third wait is never recorded because the third attempt worked.',
            'B-1 after 2 attempts, waits 1000': 'The function fails on its first two calls, so success comes on the third call, after two waits.',
            'B-1 after 3 attempts, waits 2000,3000': 'The first recorded wait is the starting delay of 1000. The doubling happens after the wait is recorded.',
          },
          hints: [
            'Count the calls: `flaky` fails while `calls` is below 3.',
            'A wait is pushed before each new attempt, using the current `delay`, and then `delay` doubles up to 3000.',
            'Two failures mean two waits before the third attempt succeeds. The waits are the delay values at the time of each push.',
          ],
          explanation: 'Calls one and two fail, so the loop runs twice: it records 1000, doubles the delay to 2000, records 2000 and doubles to 3000 (the cap). The third call works, so the loop ends after three attempts.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-60-scenario-1',
          kind: 'scenario',
          title: 'The booking that may have worked',
          prompt: 'Choose how to handle the timeout.',
          concept: 'idempotent retries',
          situation: 'Your agent calls a book_slot tool for a clinic (invented). The call times out. You do not know whether the booking was made. The tool accepts an optional idempotency key. A teammate says: “Just call it again.”',
          options: [
            { text: 'Retry after a short wait, with the same idempotency key built from the patient, the service and the date. A repeat returns the first booking instead of a second one.', consequence: 'If the first call had worked, the retry returns that booking. If it had not, the retry makes it. Either way there is one booking.', quality: 'best' },
            { text: 'Retry at once with no key, because timeouts are usually temporary.', consequence: 'If the first call had worked, the patient now has two bookings for one visit. The retry fixed nothing and created a new problem.', quality: 'poor' },
            { text: 'Never retry a booking, and always hand it to a person.', consequence: 'No duplicate is possible, and every transient glitch needs a person. It is safe and slow, and a good choice only when the tool has no key and no way to check.', quality: 'acceptable' },
            { text: 'Retry with a new random key each time so that every call looks unique to the service.', consequence: 'A different key each time tells the service that each call is a new booking. That removes the protection the key is meant to give.', quality: 'poor' },
          ],
          hints: [
            'A timeout does not say whether the action happened.',
            'What lets the service recognise that the second call is the same request as the first?',
            'The key must be the same for the same intent, and different for a different one.',
          ],
          explanation: 'A stable idempotency key makes a repeated call return the first result. A retry without it can duplicate the action, and a random key defeats its purpose. Handing everything to a person is safe but slow, so it is only a fallback.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-60-q1',
        prompt: 'Which of these failures is the best candidate for an automatic retry?',
        choices: [
          'The tool says “part must be a non-empty string” after the model sent an empty part name',
          'The booking system says “not authorised” after an administrator changed the API permissions',
          'The booking service does not answer within its time limit, during a busy morning',
          'The shop’s records say that there is no part with the name that the customer asked for',
        ],
        answer: 2,
        explanation: 'A timeout can clear on its own, so a retry may work. The other three will fail the same way again: a wrong argument, a permission, or a fact about the world.',
      },
      {
        id: 'building-ai-agents-60-q2',
        prompt: 'With a base wait of 1 second and a cap of 8 seconds, what are the waits before retries 1 to 5?',
        choices: [
          '1, 2, 3, 4, 5 seconds, because each wait is one second longer than the last wait',
          '1, 2, 4, 8, 8 seconds, because each wait doubles until it reaches the cap',
          '1, 2, 4, 8, 16 seconds, because the wait doubles and the cap only limits the total',
          '8, 8, 8, 8, 8 seconds, because the cap is the wait whenever a retry is needed',
        ],
        answer: 1,
        explanation: 'The wait is min(cap, base × 2 to the n): 1, 2, 4, 8, and then the cap holds it at 8.',
      },
      {
        id: 'building-ai-agents-60-q3',
        prompt: 'A booking call times out. Why can a plain retry be harmful?',
        choices: [
          'Retries are not allowed by most APIs, so the second call is always rejected with an error right away',
          'A timeout always means that the booking failed, so the retry is correct but wastes a little money',
          'The model will lose the thread of the conversation and start again from the first message of the chat',
          'The first call may have worked before the reply was lost, so a retry can book twice',
        ],
        answer: 3,
        explanation: 'A timeout says that no reply arrived, not that nothing happened. An idempotency key makes a repeated call safe, and without one a retry can duplicate the action.',
      },
      {
        id: 'building-ai-agents-60-q4',
        audience: { max: 'beginner' },
        prompt: 'Why wait longer between retries instead of retrying again at once?',
        choices: [
          'To make the customer wait on purpose, so that the shop looks like it is doing careful and slow work',
          'To use up the free calls first, because calls that are made after a wait cost nothing at all',
          'To give a busy service time to recover, not add to the load that caused the failure',
          'To let the model forget the earlier failure, so that it can try the call in a fresh way the next time',
        ],
        answer: 2,
        explanation: 'A short pause lets the service recover, and repeated instant retries can make an overload worse.',
      },
      {
        id: 'building-ai-agents-60-q5',
        audience: { min: 'advanced' },
        prompt: 'Your SDK makes up to 3 attempts, your tool wrapper makes up to 3 attempts around the SDK call, and your agent loop makes up to 3 attempts around the wrapper. What is the worst case for one failing call, and what should you do?',
        choices: [
          'Up to 27 calls, because attempts multiply across layers; let one layer own retries',
          'Up to 9 calls, because attempts add up across layers; keep all three layers so that each one covers the others',
          'Up to 3 calls, because the layers share one counter automatically; nothing needs to change in the design',
          'An unlimited number of calls, because layers retry forever; the only fix is to remove every retry from the code',
        ],
        answer: 0,
        explanation: 'Nested retries multiply: 3 × 3 × 3 = 27. Layers do not share a counter by default. Pick one layer to own retries, so the budget is clear and the load is bounded.',
      },
    ],
    task: {
      title: 'Retry a flaky call safely',
      minutes: 18,
      steps: [
        'Save the two blocks as `retry.py` and run it. Compare the output with the expected output.',
        'Write down, for one action in your own agent, whether it is idempotent. If not, write the key you would build for it from business data.',
        'Make `FlakyBooking` fail four times instead of two and set `retries=2`. Read the error, then raise `retries` until the booking works. Note the waits that were recorded.',
        'Change it and observe: build the key with `random.random()` on each call, run the “again” line, and look at `bookings stored`. Then restore a stable key.',
        'Reflect: for the action you picked in step 2, which layer of your system should own the retries, and what is the longest you would let a customer wait?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use the program as it is, and only change `retries`. Write down the waits for retries 1 to 3 in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Add a total deadline to `call_with_retries` (stop when the sum of the waits would pass a limit) and honour a `retry_after` value on the error if it is present. Write a test for each. Explain what you would store on the server side for the idempotency key.'] },
    ],
  },
  {
    id: 'building-ai-agents-61',
    day: 61,
    title: 'Managing Long-Running Tasks',
    summary: 'Save progress after each step in a checkpoint, resume from it after a crash, report status, and be honest about what a checkpoint stores and cannot guarantee.',
    intro: {
      objectives: [
        'Describe the state object of a long task and save it as a checkpoint after each step',
        'Resume a task after a crash without repeating the finished steps',
        'Explain what a checkpoint cannot guarantee and what it stores about people',
      ],
      why: 'Real agent tasks can take minutes or hours, wait for a person, or be interrupted by a restart. Without saved progress, every interruption means starting again, repeating work and sometimes repeating actions.',
    },
    minutes: 24,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'An agent has been running for twenty minutes through forty steps. At step thirty-one the server restarts. Does it start again from step one? If it does, it repeats thirty calls, pays for them again, and may repeat actions that already changed things. If it saved its progress, it picks up at step thirty-one. This lesson shows how to save progress, how to resume and what honest limits a saved state has.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika asks her agent for a monthly parts report: check stock and price for sixty parts, then write a summary. It takes about twenty-five minutes, because the supplier’s service is slow. At part forty-one the shop’s server restarts for an update. The agent starts again from part one and calls the supplier for all sixty parts. The supplier’s service starts refusing calls, and the report is two hours late. Mika changes the agent to save a small state file after every part: which parts are done and what each returned. After the next restart, the agent loads the file, skips the forty parts that are done and finishes the rest.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'A **long-running task** is one that takes longer than a single request, because it has many steps, waits for slow services or people, or must survive restarts. These tasks need three things: saved progress, a visible status and a way to run in the background.' },
      { type: 'paragraph', text: 'The first is the **state object** (lesson 14 introduced agent state). For a task it holds an id, a status, the list of finished steps, their results and any error. A **checkpoint** is that state saved to storage that survives a restart, such as a file, a SQLite table or a Postgres row. Save it after each completed step. To **resume**, load the state, skip every step already marked done and carry on. Write the file safely: save to a temporary file and then replace the real one in a single move, so a crash while writing can never leave half a file.' },
      { type: 'visual', id: 'ai-agent-loop', caption: 'Look at where the loop could stop and be picked up again: between steps. A checkpoint after each step is what makes that possible.' },
      {
        type: 'table',
        headers: ['Status', 'What it means', 'What the user can do'],
        rows: [
          ['pending', 'The task is created and waiting for a worker', 'Wait, or cancel'],
          ['running', 'A worker is executing steps', 'See progress, or cancel'],
          ['waiting_for_person', 'It needs an approval or an answer before it can go on', 'Answer or approve, and the task resumes'],
          ['done', 'All steps finished', 'Read the result'],
          ['failed', 'A step failed and the limits ran out', 'Read the error, then retry or hand over'],
          ['cancelled', 'A person stopped it', 'Nothing more happens'],
        ],
        caption: 'A status makes a hidden task visible. It also gives people a safe way to stop one.',
      },
      { type: 'paragraph', text: 'For work that takes minutes, do not hold a web request open. Start the task, return its id, and let the caller check the status or be told when it is done. A queue and a worker process do this (module 11 covers deployment). When the task needs a person, it saves its state with the status `waiting_for_person` and the question, stops, and is resumed when the answer arrives. Nothing needs to run while it waits.' },
      { type: 'paragraph', text: 'Be honest about what a checkpoint does not do. If the process dies after a step has done its work but before the state is saved, the step will run again on resume. Checkpointing after each step gives “at least once”, not “exactly once”. For steps that only read, a repeat costs a little. For steps with effects (sending, booking, paying) you need the protection from lesson 60: an idempotency key or a record you check first.' },
      { type: 'paragraph', text: 'A checkpoint stores data, so decide what and for how long. It holds the results of every step, which can include customer names, messages and amounts. Keep it in storage that only your system can read, never put keys or passwords in it, set an expiry and delete it when the task is done and has been read. Give the owner of the data a way to see and delete their tasks. Say all of this in your own privacy notes. The official text of any law that applies to you is the source, not this lesson.' },
      { type: 'version', text: 'LangGraph’s persistence documentation says checkpointers persist a thread’s graph state as checkpoints, and a thread id is passed in the config. It names `InMemorySaver` (RAM only, lost on restart), `SqliteSaver` (local file storage for development) and `PostgresSaver` for production. Its interrupts page says `interrupt()` pauses a graph and a later `Command(resume=...)` resumes it, which needs a checkpointer. Microsoft’s workflow documentation also lists checkpoints and resuming. Names and packages change, so read the pages.', checked: CHECKED, sources: [DOCS.langgraphPersistence, DOCS.langgraphInterrupts, DOCS.msWorkflows] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, a checkpoint is a bookmark in a long book. If you close the book and come back, you start at the bookmark, not at page one. Here the book is the list of steps, and the bookmark is a small file that says which steps are finished and what they returned. In the code, `save` writes the bookmark safely, `load` reads it back (and ignores one that belongs to another task), and `run` goes through the steps, skips every one that is already marked done, does the next one, and saves again. The script pretends to crash at `write_quote` and then runs again to show that it picks up where it stopped.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Production concerns: version the state schema so an old checkpoint can still be read after a deploy. Two workers may pick up the same task, so use a lock or a lease with an expiry (a worker must keep renewing it), and record the attempt count so a task that crashes every time, a poison task, is sent to a failed state instead of looping. Store large results by reference, not inside the state. Decide whether resuming re-checks assumptions that may have changed, such as stock levels read an hour ago. Emit status and progress events for monitoring. With a framework checkpointer, the same concerns remain: you still choose the store, the retention, the thread ids and what is safe to repeat.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will run a four-step task that crashes on purpose at step three, then resume it from a saved file. It needs only Python 3.10 or later, with no packages or keys. The file goes in your system’s temporary folder and the program deletes it at the start. Save the first block as `checkpoint.py`.' },
      { type: 'code', language: 'python', label: 'checkpoint.py, part 1', code: String.raw`import json
import os
import tempfile

STEPS = ["check_stock", "get_price", "write_quote", "send_quote"]
PATH = os.path.join(tempfile.gettempdir(), "mika-task-42.json")  # one file per task id


def new_state(task_id):
    return {"task_id": task_id, "status": "running", "done": [], "results": {}}


def save(state):
    with open(PATH + ".tmp", "w") as f:
        json.dump(state, f)
    os.replace(PATH + ".tmp", PATH)  # replace in one move: a crash never leaves half a file


def load(task_id):
    if os.path.exists(PATH):
        with open(PATH) as f:
            state = json.load(f)
        if state.get("task_id") == task_id:  # never resume another task's progress
            return state
    return new_state(task_id)
` },
      { type: 'paragraph', text: 'Add this below the previous block, in the same file.' },
      { type: 'code', language: 'python', label: 'checkpoint.py, part 2', code: String.raw`def run(task_id, crash_at=None):
    state = load(task_id)
    for step in STEPS:
        if step in state["done"]:
            continue  # finished before the crash: do not repeat it
        if step == crash_at:
            raise RuntimeError(f"process died during {step}")
        state["results"][step] = f"result of {step}"
        state["done"].append(step)
        save(state)
    state["status"] = "done"
    save(state)
    return state


if os.path.exists(PATH):
    os.remove(PATH)
try:
    run("task-42", crash_at="write_quote")
except RuntimeError as error:
    print("crashed:", error)
    print("saved:", load("task-42")["done"], load("task-42")["status"])
final = run("task-42")
print("resumed:", final["status"], final["done"])
` },
      { type: 'paragraph', text: 'Read the important lines. `save` writes to a temporary file and then calls `os.replace`, which swaps the files in one move. `load` returns a saved state only if its `task_id` matches, so a leftover file from another task is never resumed. In `run`, `if step in state["done"]: continue` is the resume: finished steps are skipped. The state is saved after every step, so the first run leaves `check_stock` and `get_price` recorded when it crashes. Note that `send_quote` is a step with an effect. In a real agent, a crash right after sending and before the save would send it again, which is the problem lesson 60 solved with a key.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `crashed: process died during write_quote
saved: ['check_stock', 'get_price'] running
resumed: done ['check_stock', 'get_price', 'write_quote', 'send_quote']` },
      { type: 'list', items: [
        'If the first line is missing and nothing crashes, check that `crash_at="write_quote"` is passed in the first `run` call and that the step name matches one in `STEPS`.',
        'If `saved:` shows an empty list, `save` was not called after a step, or the file path is not writable. Print `PATH` and check the folder.',
        'If the resumed run repeats steps, `state["done"]` is not being saved or loaded. Look at the `task_id` you pass to `load`, which must be the same as the one in the file.',
        'If you get `PermissionError`, point `PATH` at a folder you can write to, such as the folder with the script.',
      ] },
      { type: 'warning', text: 'A checkpoint file holds the results of every step, which may include customer details. Keep it where only your system can read it, never store keys or passwords in it, set an expiry and delete it when the task is finished and read. A state loaded from shared storage is untrusted input: check the task id and the shape before you act on it. A resume can repeat a step that had already worked, so steps with effects need an idempotency key (lesson 60). The data in this example is invented.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Change `crash_at` to `get_price` and to `send_quote`, and compare what is saved each time.',
        'Next is Agent Execution Limits and Stop Conditions (lesson 62), the hard limits that stop a stuck agent.',
        'Read the LangGraph persistence page to see how a framework names threads and checkpoints, and compare it with your `task_id` and `done` list.',
      ] },
      { type: 'takeaways', items: [
        'A checkpoint is the task’s state saved after each step, so a crash means resuming and not restarting.',
        'Write checkpoints safely (temporary file, then replace), match the task id on load and skip steps already marked done.',
        'A status makes a long task visible and stoppable, and a person’s approval is just a state the task waits in.',
        'Checkpointing is “at least once”: steps with effects need an idempotency key, and the stored data needs an owner, an expiry and a way to delete it.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-61-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the state transition',
          story: 'You write the pure function that records a step’s result in the task state. It returns data and touches no file, so it can be tested exactly.',
          prompt: 'Write `advance(state, stepName, result)`. The state is `{ steps, done, results, status }`. Return a new object and never change the one passed in. If `stepName` is already in `done`, return the state as it is. If `result.ok` is false, return a copy with `status: "failed"` and `error: result.error`, with `done` and `results` unchanged. Otherwise add `stepName` to `done`, store `result.value` in `results[stepName]`, and set `status` to `"done"` when every step in `steps` is done, otherwise `"running"`.',
          concept: 'checkpoint state transitions',
          language: 'javascript',
          starter: "function advance(state, stepName, result) {\n  // already done: return the state\n  // failed: copy with status 'failed' and the error\n  // worked: new done list, new results, status running or done\n  return state;\n}",
          solution: "function advance(state, stepName, result) {\n  if (state.done.includes(stepName)) {\n    return state;\n  }\n  if (!result.ok) {\n    return { ...state, status: 'failed', error: result.error };\n  }\n  const done = [...state.done, stepName];\n  return {\n    ...state,\n    done: done,\n    results: { ...state.results, [stepName]: result.value },\n    status: done.length === state.steps.length ? 'done' : 'running',\n  };\n}",
          tests: {
            kind: 'function',
            fn: 'advance',
            cases: [
              { label: 'the first step works', args: [{ steps: ['a', 'b', 'c'], done: [], results: {}, status: 'running' }, 'a', { ok: true, value: 1 }], expected: { steps: ['a', 'b', 'c'], done: ['a'], results: { a: 1 }, status: 'running' } },
              { label: 'the last step finishes the task', args: [{ steps: ['a', 'b'], done: ['a'], results: { a: 1 }, status: 'running' }, 'b', { ok: true, value: 2 }], expected: { steps: ['a', 'b'], done: ['a', 'b'], results: { a: 1, b: 2 }, status: 'done' } },
              { label: 'a failure marks the task failed', args: [{ steps: ['a', 'b'], done: ['a'], results: { a: 1 }, status: 'running' }, 'b', { ok: false, error: 'timeout' }], expected: { steps: ['a', 'b'], done: ['a'], results: { a: 1 }, status: 'failed', error: 'timeout' } },
              { label: 'a step already done is not recorded twice', args: [{ steps: ['a', 'b'], done: ['a'], results: { a: 1 }, status: 'running' }, 'a', { ok: true, value: 9 }], expected: { steps: ['a', 'b'], done: ['a'], results: { a: 1 }, status: 'running' } },
              { label: 'a one-step task', args: [{ steps: ['only'], done: [], results: {}, status: 'running' }, 'only', { ok: true, value: 'x' }], expected: { steps: ['only'], done: ['only'], results: { only: 'x' }, status: 'done' }, hidden: true },
              { label: 'an earlier result is kept', args: [{ steps: ['a', 'b', 'c'], done: ['a'], results: { a: 'first' }, status: 'running' }, 'b', { ok: true, value: 'second' }], expected: { steps: ['a', 'b', 'c'], done: ['a', 'b'], results: { a: 'first', b: 'second' }, status: 'running' }, hidden: true },
            ],
          },
          hints: [
            'Start with the two early returns: the step is already in `state.done`, or `result.ok` is false.',
            'To build the new state, spread the old one: `{ ...state, done: ..., results: ..., status: ... }`. For `done` use `[...state.done, stepName]`.',
            'Add the result with a computed key: `{ ...state.results, [stepName]: result.value }`. The status is `"done"` when the new `done` list is as long as `state.steps`.',
          ],
          explanation: 'The function never changes its input. It returns a new state, so the old checkpoint stays valid until the new one is saved. Ignoring a step that is already done is what makes a resume safe to run twice, and the failed status makes the task visible to people.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-61-arrange-1',
          kind: 'arrange',
          title: 'The resume procedure',
          prompt: 'Put the steps of resuming a task after a crash in the right order.',
          concept: 'resuming from a checkpoint',
          language: 'text',
          solution: [
            'Load the saved state for this task id',
            'Check that the task id and the state’s shape are what you expect',
            'Skip every step already listed in done',
            'Run the next step that is not done',
            'Save the updated state',
            'Repeat until every step is done, then mark the task done',
          ],
          reasons: [
            'Nothing can resume without the saved progress.',
            'A state from storage is untrusted input, and it may belong to another task.',
            'Finished steps must not run again.',
            'Only now is there work to do.',
            'Progress is recorded straight away, so a new crash costs one step at most.',
            'The task ends only when nothing is left, and the final status is saved too.',
          ],
          hints: [
            'You cannot do anything before you have the saved state.',
            'Check what you loaded before you trust it.',
            'The loop is: skip finished work, do one step, save, repeat.',
          ],
          explanation: 'Load, check, skip finished work, do one step, save, repeat. Saving after every step is what limits a crash to repeating at most one step.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-61-scenario-1',
          kind: 'scenario',
          title: 'Crash after the email went out',
          prompt: 'Choose the best way to protect the customer.',
          concept: 'at-least-once and side effects',
          situation: 'A helpdesk agent (invented) saves a checkpoint after each step. Step 4 sends a confirmation email. The server dies just after the email is sent and before the checkpoint is saved. The task resumes on a new server.',
          options: [
            { text: 'Give the send step an idempotency key or a send record that it checks before sending, so running it twice sends one email.', consequence: 'On resume, the step runs again, finds that the message was already sent, and does nothing. The customer gets one email.', quality: 'best' },
            { text: 'Save the checkpoint twice per step, to make the crash window smaller.', consequence: 'A smaller window is still a window. Somewhere between sending and saving, a crash can still happen, and the email can still go out twice.', quality: 'acceptable' },
            { text: 'Assume checkpoints make steps run exactly once, and change nothing.', consequence: 'The first crash at the wrong moment sends a duplicate. Checkpointing gives at-least-once, and a step with an effect must be safe to repeat.', quality: 'poor' },
            { text: 'Delete the checkpoint after a crash and start the whole task again from step one.', consequence: 'Every earlier step repeats, including steps with effects, so you multiply the chance of duplicates and waste the saved progress.', quality: 'poor' },
          ],
          hints: [
            'Can a crash happen between doing the work and saving the checkpoint?',
            'What makes a repeated send harmless?',
            'Making the window smaller helps, but it does not remove the gap.',
          ],
          explanation: 'A checkpoint cannot make the work and the save one single action, so the step must be safe to repeat. An idempotency key or a send record makes a repeat harmless. A smaller window only lowers the odds.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-61-q1',
        prompt: 'A task crashes at step 3 of 4 and is started again. What does “resume from the checkpoint” mean?',
        choices: [
          'Start again from step 1 so that every result is fresh and nothing from the crash can affect the run',
          'Copy the model’s earlier reasoning into the new run so that it can remember what it did before',
          'Wait a while and then repeat step 3 only, without looking at which steps were already finished',
          'Load the saved state, skip the steps already marked done and carry on with the next one',
        ],
        answer: 3,
        explanation: 'Resuming means loading what was saved and continuing after the last finished step. Starting again repeats work and effects, and reasoning text is not the state.',
      },
      {
        id: 'building-ai-agents-61-q2',
        prompt: 'Why does `save` write to a temporary file and then replace the real file?',
        choices: [
          'So a crash while writing cannot leave a half-written checkpoint, because the swap happens in one move',
          'So that the file is smaller, because a temporary file is always compressed before it is moved into place',
          'So that two different tasks can share the same checkpoint file without any risk of mixing up the data',
          'So that the model can read the file while it is being written, in case it wants to see the progress so far',
        ],
        answer: 0,
        explanation: 'Writing in place can leave a broken file if the process dies halfway. Writing a new file and swapping it in is a single move, so the checkpoint is either the old one or the new one.',
      },
      {
        id: 'building-ai-agents-61-q3',
        prompt: 'True or false: saving a checkpoint after every step guarantees that no step ever runs twice.',
        choices: [
          'True, because the checkpoint records each step the moment that it is done, so none can ever be repeated',
          'False, because a crash between doing a step and saving it repeats the step, so effects need a key',
          'True, because resuming always skips every step, including the one that was running at the time of the crash',
          'False, because checkpoints only work for read-only steps, so they cannot be used with steps that have effects',
        ],
        answer: 1,
        explanation: 'There is always a gap between doing the work and saving the state, so checkpointing gives at-least-once behaviour. A step with an effect needs an idempotency key or a send record so a repeat is harmless.',
      },
      {
        id: 'building-ai-agents-61-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a checkpoint?',
        choices: [
          'A security guard who checks a customer’s name before the agent is allowed to give any answer at all',
          'A timer that stops the agent after a few minutes, whatever it was in the middle of doing',
          'A saved copy of a task’s progress, so a stopped task continues instead of starting over',
          'A second model that reads the first model’s answer and corrects the mistakes in it',
        ],
        answer: 2,
        explanation: 'A checkpoint is saved progress, like a bookmark. After an interruption the task starts at the bookmark and not at the beginning.',
      },
      {
        id: 'building-ai-agents-61-q5',
        audience: { min: 'advanced' },
        prompt: 'After a crash, two workers both pick up the same task, and one task crashes its worker every time it runs. Which design handles both problems?',
        choices: [
          'Let both workers run the task, because the checkpoint file will remove any duplicate results afterwards',
          'Make the task resume faster, since a task that crashes less often will not be picked up twice by another worker',
          'Store the task’s results inside the model’s prompt, so every worker can see what all the other workers did',
          'Use a lock or lease with an expiry so one worker owns a task, and count attempts to catch a crasher',
        ],
        answer: 3,
        explanation: 'A lease gives one owner at a time, and it expires if the owner dies. An attempt counter stops a poison task from looping forever. Duplicate runs, speed and prompt storage do not solve either problem.',
      },
    ],
    task: {
      title: 'Crash a task on purpose and resume it',
      minutes: 18,
      steps: [
        'Save the two blocks as `checkpoint.py` and run it. Compare the output with the expected output. Print `PATH` and open the file with a text editor to read the saved state.',
        'Write down the state object for a long task in your own project: the id, the status values, what each step returns and what you must never store in it.',
        'Change `crash_at` to `"get_price"`, then to `"send_quote"`, and run each time. Compare what is saved after each crash.',
        'Change it and observe: remove the `continue` line that skips finished steps and run again. Note which steps repeat, and which of them would be harmful if they had effects.',
        'Reflect: how long would you keep this file, who should be able to read it, and how would a customer ask you to delete it?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Open the saved file after the crash and read it line by line. Write one sentence saying what each field means.'] },
      { audience: { min: 'advanced' }, steps: ['Add a `version` field to the state and refuse to resume a state with an unknown version. Add an `attempts` counter that moves a task to `failed` after three crashes. Describe the lease you would add so that two workers cannot run the same task.'] },
    ],
  },
  {
    id: 'building-ai-agents-62',
    day: 62,
    title: 'Agent Execution Limits and Stop Conditions',
    summary: 'Stop an agent with hard limits that live outside the model: a step cap, a cost budget, a timeout and repeated-action detection, and return a clear reason when it stops.',
    intro: {
      objectives: [
        'List the stop conditions every agent loop needs: steps, cost, time, repeated actions and finish',
        'Write a loop guard in code that the model cannot change',
        'Return a useful partial result and a clear reason when a limit fires',
      ],
      why: 'An agent that decides for itself when to stop will, sooner or later, not stop. Hard limits turn that failure from an unbounded bill and a stuck run into a short, visible and cheap one.',
    },
    minutes: 25,
    skills: ['agent-planning'],
    body: [
      { type: 'paragraph', text: 'What stops an agent that never decides it is finished? A loop with no limit is a bill with no ceiling. Models do not get tired, and a stuck agent will repeat the same move politely for as long as you let it. The fix is not a better instruction. It is a few lines of code, outside the model, that count steps, cost and time and stop the run. This lesson builds that guard and tests it against an agent that is deliberately stuck.' },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: 'Mika leaves a research helper running overnight to find which chain checker brands the shop’s repair notes recommend. It calls `search_notes("bike chain wear")`, reads a result that does not answer the question, and calls the same search again with a few words changed. And again. By morning it has made hundreds of calls and used up the day’s model budget, and it has no answer. Nothing was broken. Each call was valid. There was simply nothing in the loop that said “enough”. Mika adds a guard that checks four things before every step: how many steps so far, how much has been spent, how long it has run and whether this exact call has been made too often. The next stuck run ends in seconds with a clear reason.' },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: 'A **stop condition** is a rule that ends the run. An agent loop needs several, because different failures look different.' },
      { type: 'list', items: [
        '**Max steps.** A hard cap on loop turns. It is the simplest guard and it catches almost everything, so always have one.',
        '**Max cost.** A budget in units you can count, such as tokens or a number of tool calls. The guard adds up what has been used and refuses a step that would pass the budget. Count what the API reports as usage (lesson 24 covered token accounting). This lesson uses plain units and no prices.',
        '**Timeout.** A deadline for the whole run, checked between steps, plus a time limit on each tool call. A slow tool can stall a run without any step count rising.',
        '**Repeated-action detection.** The same tool with the same arguments more than a set number of times means the agent is stuck. It is a heuristic, and it misses rephrased repeats, which the step cap then catches.',
        '**Finish.** A clear “done” action that the loop recognises and answers with the result.',
      ] },
      { type: 'paragraph', text: 'The key design rule: **the guard lives in code, outside the model**. A line in the prompt that says “stop after six steps” is only a request, and a model can ignore it. A guard that the loop consults before every step cannot be ignored or talked out of its limits. The order of the checks matters too. Check the hard caps first, then the heuristics.' },
      { type: 'diagram', format: 'mermaid', caption: 'The guard sits between the model’s proposal and the tool. Every proposed action must pass it first. When it says no, the run stops with a reason.', source: ['flowchart TD', '  A[Model proposes the next action]', '  B{Guard: steps, cost, time and repeats all ok?}', '  C[Run the tool]', '  D[Add the result to the transcript]', '  E{Was it the finish action?}', '  F[Return the answer]', '  G[Stop: save the state and report the reason]', '  A --> B', '  B -->|yes| C', '  B -->|no| G', '  C --> D', '  D --> E', '  E -->|no| A', '  E -->|yes| F'].join('\n') },
      { type: 'paragraph', text: 'What should happen when a limit fires? Not a silent stop and not a crash. Return what you have (a partial result), the reason in plain words (“stopped: repeated action”), and the saved state (lesson 61), so a person can look and choose to continue. Tell the user that the answer is incomplete. Also record every guard hit. A guard that fires often is a signal: a prompt problem, a missing tool or someone probing your agent.' },
      { type: 'version', text: 'OWASP’s list of risks for LLM applications includes LLM10:2025 Unbounded Consumption, which this lesson’s limits help to contain. CrewAI’s agents documentation lists settings named `max_iter`, `max_rpm` and `max_execution_time`. Read the page for exactly what each one limits. Claude’s documentation lists `max_tokens` as a stop reason, which means that a reply was cut at the token cap and should not be treated as complete. Names and defaults change, so check the pages.', checked: CHECKED, sources: [DOCS.owaspUnbounded, DOCS.crewAgents, DOCS.claudeStopReasons] },
      { type: 'paragraph', audience: { max: 'beginner' }, text: 'In plain words, a loop guard is like a taxi meter plus a driver who has been told: “Stop after thirty minutes, whatever happens, and if you are going round the same block, tell me.” The agent is the driver. The guard is the meter and the rule book. In the code, `LoopGuard` remembers how many steps were taken, what they cost, when the trip started and how many times each exact request was made. Its `check` method answers “can this step go ahead?”. It returns a reason such as “stop: repeated action” when the answer is no, or nothing when the answer is yes. The demo uses a pretend model that always asks for the same search, so you can watch the guard stop it.' },
      { type: 'paragraph', audience: { min: 'advanced' }, text: 'Real systems layer limits: per model call (`max_tokens` and a request timeout), per step, per run, per user per day and per organisation, so one runaway cannot spend a shared budget. Repeated-action detection is a heuristic with false positives: a status-polling tool is meant to repeat, so give each tool its own policy (for example a repeat allowance with a minimum delay and its own cap) and keep the strict default elsewhere. Catch rephrased loops with a progress signal, such as no new document ids in the last few observations. Cap parallel tool calls and output sizes as well, since a single step can be expensive. Alert on guard hits, and test guards with a scripted stuck model so that the behaviour is checked without paying for real calls.' },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: 'You will write a loop guard and run it against a scripted model that is deliberately stuck. It needs only Python 3.10 or later, with no packages or keys. Save the first block as `loop_guard.py`.' },
      { type: 'code', language: 'python', label: 'loop_guard.py', code: String.raw`import json
import time


class LoopGuard:
    """Hard limits that live OUTSIDE the model. The loop asks it before every step."""

    def __init__(self, max_steps=6, max_cost=10, max_seconds=30.0, max_repeats=2, clock=time.monotonic):
        self.max_steps, self.max_cost, self.max_seconds, self.max_repeats = max_steps, max_cost, max_seconds, max_repeats
        self.clock, self.started = clock, clock()
        self.steps, self.cost, self.seen = 0, 0, {}

    def check(self, tool, args, cost):
        key = json.dumps([tool, args], sort_keys=True)
        self.seen[key] = self.seen.get(key, 0) + 1
        if self.steps >= self.max_steps:
            return "stop: max steps"
        if self.cost + cost > self.max_cost:
            return "stop: cost budget"
        if self.clock() - self.started > self.max_seconds:
            return "stop: timeout"
        if self.seen[key] > self.max_repeats:
            return "stop: repeated action"
        self.steps += 1
        self.cost += cost
        return None
` },
      { type: 'paragraph', text: 'Now the demo. Save this as `demo.py` in the same folder.' },
      { type: 'code', language: 'python', label: 'demo.py', code: String.raw`from loop_guard import LoopGuard


def scripted_stuck_model():
    """A stand-in for a model that keeps asking for the same search."""
    while True:
        yield {"tool": "search_notes", "args": {"query": "bike chain wear"}, "cost": 2}


guard = LoopGuard()
for turn, action in enumerate(scripted_stuck_model(), start=1):
    reason = guard.check(action["tool"], action["args"], action["cost"])
    if reason:
        print(f"turn {turn}: {reason} (steps={guard.steps}, cost={guard.cost})")
        break
    print(f"turn {turn}: ran {action['tool']}")
` },
      { type: 'paragraph', text: 'Read the important lines. `key = json.dumps([tool, args], sort_keys=True)` turns a call into a string, so the same tool and the same arguments always give the same key, whatever the order of the fields. `check` runs before the tool does, and it returns a reason or `None`. The hard caps (steps, cost, time) come before the repeat check. The guard counts a step only after every check has passed. The `clock` is a parameter, so a test can pass a fake clock and check the timeout without waiting. The demo model is an endless generator, and only the guard ends the loop.' },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run with python3 3.13)', code: `turn 1: ran search_notes
turn 2: ran search_notes
turn 3: stop: repeated action (steps=2, cost=4)` },
      { type: 'list', items: [
        'If you see `ModuleNotFoundError: No module named \'loop_guard\'`, `demo.py` and `loop_guard.py` must be in the same folder, and you must run the command from that folder.',
        'If the run ends with “stop: max steps” instead, you raised `max_repeats` above `max_steps`. The first limit that is reached wins.',
        'If it never stops, check that the demo loop calls `guard.check` and honours the reason. A guard that is not consulted guards nothing.',
        'If the timeout never fires, remember it is checked between steps. A single tool call that hangs needs its own time limit.',
      ] },
      { type: 'paragraph', text: 'Optional: the same guard around a real model. This block needs `pip install anthropic`, an `ANTHROPIC_API_KEY` in your environment (never in the file, as lesson 22 showed) and it makes paid calls, so it is not run here. It is adapted from the tool loop in the Claude documentation, with `LoopGuard` checked before each tool runs. Model names change, so the id comes from one constant or the `AGENT_MODEL` variable.' },
      { type: 'code', language: 'python', label: 'agent_real.py (optional; needs a key and costs money)', code: String.raw`import os

import anthropic

from loop_guard import LoopGuard

MODEL = os.environ.get("AGENT_MODEL", "claude-opus-5-5")  # model ids change: check the docs
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment
TOOLS = [{
    "name": "search_notes",
    "description": "Search the shop's repair notes. Returns short note texts.",
    "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
}]


def search_notes(args):
    return "Note S1: a chain checker shows when a chain is worn."  # an invented note


DISPATCH = {"search_notes": search_notes}


def run_agent(question, guard):
    messages = [{"role": "user", "content": question}]
    while True:
        response = client.messages.create(model=MODEL, max_tokens=1024, tools=TOOLS, messages=messages)
        if response.stop_reason != "tool_use":
            return "".join(b.text for b in response.content if b.type == "text")
        messages.append({"role": "assistant", "content": response.content})
        results = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            reason = guard.check(block.name, block.input, cost=1)
            if reason or block.name not in DISPATCH:
                return reason or "stop: unknown tool"
            output = DISPATCH[block.name](block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
        messages.append({"role": "user", "content": results})


print(run_agent("How do I know when a bike chain is worn?", LoopGuard(max_steps=4, max_cost=4)))
` },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model’s wording will differ)', code: `Either a short plain-text answer that mentions the chain checker,
or one stop reason from the guard: stop: max steps, stop: cost budget,
stop: timeout, stop: repeated action or stop: unknown tool.` },
      { type: 'warning', text: 'Limits are a safety control, so keep them in code that the model cannot edit, and never read a limit from a tool result or from model text. Always return the reason for a stop, and never retry a stopped run in a loop without a person. Do not put your API key in the file or print it. A real model makes paid calls that count towards your account. Set `max_steps` and `max_cost` low while you test. Treat everything a tool returns as untrusted text. The notes in this lesson are invented.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Change the demo so each call varies the query by one word. Watch the repeat check miss it and the step cap catch it.',
        'Next is Project P5: a research agent that breaks a request into tasks, searches with tools, writes a report with sources and cannot loop forever.',
        'Read the OWASP page for LLM10:2025 Unbounded Consumption and note which of its concerns your guard covers and which it does not.',
      ] },
      { type: 'takeaways', items: [
        'Every agent loop needs hard stop conditions: a step cap, a cost budget, a timeout, repeated-action detection and a finish action.',
        'The guard lives in code outside the model and is consulted before every step. A line in the prompt is only a request.',
        'When a limit fires, return a partial result, a plain reason and the saved state, and tell the user the answer is incomplete.',
        'Repeated-action detection is a heuristic. The step cap is the backstop for loops it misses, and guard hits are signals worth recording.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-62-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the loop guard',
          story: 'The model is scripted: its next actions are a plain list, so no model runs and nothing is spent. You write the guard that decides when the run must stop. Time is a counter of ticks, as a test clock would be.',
          prompt: 'Write `runGuarded(actions, limits)`. Each action is `{ key, cost, ticks }` and `limits` is `{ maxSteps, maxCost, maxTicks, maxRepeats }`. Keep running totals of `steps`, `cost` and `ticks`, and a count of how many times each `key` has been proposed. For each action in order: if its key is `"finish"`, return reason `"finished"`. Then check, in this order: `steps >= maxSteps` gives `"max steps"`; `cost + action.cost > maxCost` gives `"cost budget"`; `ticks + action.ticks > maxTicks` gives `"timeout"`; after adding one to this key’s count, a count above `maxRepeats` gives `"repeated action"`. If all checks pass, add one step and the action’s cost and ticks. If the actions run out, the reason is `"out of actions"`. Every return is `{ reason, steps, cost, ticks }`.',
          concept: 'loop guard with several limits',
          language: 'javascript',
          starter: "function runGuarded(actions, limits) {\n  let steps = 0;\n  let cost = 0;\n  let ticks = 0;\n  const seen = {};\n  for (const action of actions) {\n    // finish, then the four checks in order, then count the step\n  }\n  return { reason: 'out of actions', steps: steps, cost: cost, ticks: ticks };\n}",
          solution: "function runGuarded(actions, limits) {\n  let steps = 0;\n  let cost = 0;\n  let ticks = 0;\n  const seen = {};\n  for (const action of actions) {\n    if (action.key === 'finish') {\n      return { reason: 'finished', steps: steps, cost: cost, ticks: ticks };\n    }\n    if (steps >= limits.maxSteps) {\n      return { reason: 'max steps', steps: steps, cost: cost, ticks: ticks };\n    }\n    if (cost + action.cost > limits.maxCost) {\n      return { reason: 'cost budget', steps: steps, cost: cost, ticks: ticks };\n    }\n    if (ticks + action.ticks > limits.maxTicks) {\n      return { reason: 'timeout', steps: steps, cost: cost, ticks: ticks };\n    }\n    seen[action.key] = (seen[action.key] || 0) + 1;\n    if (seen[action.key] > limits.maxRepeats) {\n      return { reason: 'repeated action', steps: steps, cost: cost, ticks: ticks };\n    }\n    steps = steps + 1;\n    cost = cost + action.cost;\n    ticks = ticks + action.ticks;\n  }\n  return { reason: 'out of actions', steps: steps, cost: cost, ticks: ticks };\n}",
          tests: {
            kind: 'function',
            fn: 'runGuarded',
            cases: [
              { label: 'a normal run finishes', args: [[{ key: 'search:chain', cost: 2, ticks: 3 }, { key: 'read:s1', cost: 1, ticks: 2 }, { key: 'finish', cost: 0, ticks: 0 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 2 }], expected: { reason: 'finished', steps: 2, cost: 3, ticks: 5 } },
              { label: 'a stuck agent is stopped by repeats', args: [[{ key: 'search:chain', cost: 2, ticks: 3 }, { key: 'search:chain', cost: 2, ticks: 3 }, { key: 'search:chain', cost: 2, ticks: 3 }, { key: 'finish', cost: 0, ticks: 0 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 2 }], expected: { reason: 'repeated action', steps: 2, cost: 4, ticks: 6 } },
              { label: 'the step cap stops a long run', args: [[{ key: 'a', cost: 1, ticks: 1 }, { key: 'b', cost: 1, ticks: 1 }, { key: 'c', cost: 1, ticks: 1 }, { key: 'd', cost: 1, ticks: 1 }, { key: 'e', cost: 1, ticks: 1 }, { key: 'f', cost: 1, ticks: 1 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 2 }], expected: { reason: 'max steps', steps: 5, cost: 5, ticks: 5 } },
              { label: 'the cost budget stops an expensive run', args: [[{ key: 'a', cost: 4, ticks: 1 }, { key: 'b', cost: 4, ticks: 1 }, { key: 'c', cost: 4, ticks: 1 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 2 }], expected: { reason: 'cost budget', steps: 2, cost: 8, ticks: 2 } },
              { label: 'the timeout stops a slow run', args: [[{ key: 'a', cost: 1, ticks: 20 }, { key: 'b', cost: 1, ticks: 15 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 2 }], expected: { reason: 'timeout', steps: 1, cost: 1, ticks: 20 } },
              { label: 'the actions simply run out', args: [[{ key: 'a', cost: 1, ticks: 1 }, { key: 'b', cost: 1, ticks: 1 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 2 }], expected: { reason: 'out of actions', steps: 2, cost: 2, ticks: 2 }, hidden: true },
              { label: 'finish on the very first action', args: [[{ key: 'finish', cost: 0, ticks: 0 }], { maxSteps: 3, maxCost: 5, maxTicks: 10, maxRepeats: 1 }], expected: { reason: 'finished', steps: 0, cost: 0, ticks: 0 }, hidden: true },
              { label: 'a repeat allowance of one', args: [[{ key: 'x', cost: 1, ticks: 1 }, { key: 'x', cost: 1, ticks: 1 }], { maxSteps: 5, maxCost: 10, maxTicks: 30, maxRepeats: 1 }], expected: { reason: 'repeated action', steps: 1, cost: 1, ticks: 1 }, hidden: true },
            ],
          },
          hints: [
            'Inside the loop, handle `finish` first, because finishing is never blocked by a limit. Then write the four checks in the order given, each with its own return.',
            'For repeats keep an object `seen`. Add one with `seen[action.key] = (seen[action.key] || 0) + 1`, then compare with `limits.maxRepeats`.',
            'Only after every check has passed do you add to `steps`, `cost` and `ticks`. The totals in the result are the ones from before the refused action.',
          ],
          explanation: 'The guard checks before it acts, so a refused action never counts. The hard caps come first and the repeat heuristic last, and `finish` always wins. Every stop returns the reason and the totals, which is what makes a stopped run easy to explain and to test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-62-fix-bug-1',
          kind: 'fix-bug',
          title: 'The step limit that allows one step too many',
          prompt: 'This function runs a list of actions and should stop once `maxSteps` actions have run. With `maxSteps` of 3 and four actions it runs all four. The actions are plain data, so no model is involved. Find the line with the bug and fix it.',
          concept: 'off-by-one in a step limit',
          language: 'javascript',
          code: "function runSteps(actions, maxSteps) {\n  let steps = 0;\n  const ran = [];\n  for (const action of actions) {\n    if (steps > maxSteps) {\n      return { stopped: 'max steps', ran: ran };\n    }\n    ran.push(action);\n    steps = steps + 1;\n  }\n  return { stopped: 'out of actions', ran: ran };\n}",
          bugLine: 5,
          fixes: [
            { line: '    if (steps >= maxSteps) {', correct: true, why: 'Once `steps` equals `maxSteps`, the allowance is used up, so the next action must be refused. With `>` the check waits one step too long.' },
            { line: '    if (steps > maxSteps + 1) {', correct: false, why: 'This allows even more steps than the original. The limit moves further the wrong way.' },
            { line: '    if (steps > maxSteps - 2) {', correct: false, why: 'This stops too early. With a limit of 3 it would refuse the third action.' },
            { line: '    if (steps === 0) {', correct: false, why: 'This refuses the very first action, so nothing ever runs. It is not a limit on the count.' },
          ],
          tests: {
            kind: 'function',
            fn: 'runSteps',
            cases: [
              { label: 'stops after three steps', args: [['a', 'b', 'c', 'd'], 3], expected: { stopped: 'max steps', ran: ['a', 'b', 'c'] } },
              { label: 'a short list is not stopped', args: [['a', 'b'], 3], expected: { stopped: 'out of actions', ran: ['a', 'b'] } },
              { label: 'a limit of one', args: [['a', 'b', 'c'], 1], expected: { stopped: 'max steps', ran: ['a'] } },
              { label: 'exactly as many actions as the limit', args: [['a', 'b', 'c'], 3], expected: { stopped: 'out of actions', ran: ['a', 'b', 'c'] } },
            ],
          },
          hints: [
            'Try the example by hand: `maxSteps` is 3. After three actions `steps` is 3. What does the check do for the fourth action?',
            'At `steps === 3` the condition `steps > maxSteps` is false, so the fourth action runs. The comparison is off by one.',
            'The allowance is used up when `steps` reaches `maxSteps`, so the comparison should be `>=`.',
          ],
          explanation: 'A limit of N means N steps are allowed and the next is refused. The check happens before each step, so it must refuse when the count has reached N, which is `>=` and not `>`. Off-by-one errors in limits are common, so test the boundary with an input that has exactly N and N plus one actions.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-62-scenario-1',
          kind: 'scenario',
          title: 'The guard keeps firing on one tool',
          prompt: 'Choose the best response.',
          concept: 'repeated-action detection and its false positives',
          situation: 'Your agent’s repeated-action check stops runs that poll a job_status tool every few seconds while a report is built. Those repeats are normal. The same check has also caught a real loop on a search tool last week.',
          options: [
            { text: 'Give job_status its own policy (a higher repeat allowance with a minimum delay and its own cap), keep the strict default for every other tool, and keep logging guard hits.', consequence: 'Polling works, the search loop is still caught, and each tool has limits that match how it is meant to be used.', quality: 'best' },
            { text: 'Switch the repeated-action check off for all tools, because the step cap will catch loops anyway.', consequence: 'The step cap still stops a loop, but only after all its steps have been spent. You lose the early warning that saved you last week.', quality: 'acceptable' },
            { text: 'Raise the global repeat limit to 50 for every tool.', consequence: 'Polling works. A stuck search can now repeat 50 times before the check fires, which costs more and takes longer to notice.', quality: 'poor' },
            { text: 'Ask the model to say whether a repeat is intended, and allow it if the model says yes.', consequence: 'A stuck model will also say that it is intended. The limit is now only as strong as the thing it was meant to limit.', quality: 'poor' },
          ],
          hints: [
            'Are all repeats the same? Which tool is meant to be called many times?',
            'Which choices weaken the limit for every tool, and which change it only where needed?',
            'A limit should never depend on the model’s own statement.',
          ],
          explanation: 'A heuristic should match how each tool is used. A per-tool policy keeps polling working and the loop detection strict everywhere else. Weakening the limit for all tools, or letting the model approve its own repeats, removes the protection.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-62-q1',
        prompt: 'Mika’s overnight agent repeated almost the same search hundreds of times. Which controls would have stopped it early?',
        choices: [
          'A longer system instruction telling the model not to repeat itself and to stop when it feels stuck',
          'A step cap and repeated-action detection, both checked by code before every step',
          'A bigger context window, so that the model can see all of its earlier searches at once',
          'A rule that the model must write a Thought before every action, so that it can notice',
        ],
        answer: 1,
        explanation: 'Hard limits in code do not depend on the model noticing anything. Instructions, a larger context and written thoughts can all be ignored or fail in the same way as the loop itself.',
      },
      {
        id: 'building-ai-agents-62-q2',
        prompt: 'Where should a limit such as “at most six steps” live?',
        choices: [
          'In code that the loop consults before each step, outside the model and out of its reach',
          'In the system prompt, because the model follows its instructions closely when the run begins',
          'In each tool’s description, so the model reads the limit every time it considers a tool',
          'In the model’s memory notes, so that it remembers the limit between one run and the next',
        ],
        answer: 0,
        explanation: 'A limit in the prompt, a description or memory is a request, and the model may not follow it. A guard in code is a control.',
      },
      {
        id: 'building-ai-agents-62-q3',
        prompt: 'The guard stops a run after four of six planned steps. What should the agent return?',
        choices: [
          'Nothing at all, since an incomplete run has no value and a blank answer is the safest result to give',
          'An answer written as if all six steps had finished, to avoid worrying the customer about the problem',
          'The partial result so far, the plain reason for the stop and the saved state, flagged as incomplete',
          'A new run that starts again from step one, since the first run was cancelled by the limit that fired',
        ],
        answer: 2,
        explanation: 'A stop is information. The partial result, the reason and the state let a person or a later run continue, and the note keeps the user from trusting an incomplete answer.',
      },
      {
        id: 'building-ai-agents-62-q4',
        audience: { max: 'beginner' },
        prompt: 'What is a “stop condition” in an agent?',
        choices: [
          'A button on the screen that customers press when they want to end the chat politely',
          'A rule that ends the run, such as a step limit, a budget, a time limit or a finish action',
          'A word that the model must say at the end of every answer so that the program can find it',
          'A pause of one minute after every step, so that the agent has time to think',
        ],
        answer: 1,
        explanation: 'A stop condition is a rule in the loop that decides when to end. The common ones are a step limit, a budget, a deadline, repeated-action detection and a finish action.',
      },
      {
        id: 'building-ai-agents-62-q5',
        audience: { min: 'advanced' },
        prompt: 'Your repeated-action check fires on a tool that is meant to be polled. What is the best change?',
        choices: [
          'Remove the check for every tool, because a heuristic that can be wrong should not be used for anything at all',
          'Raise one global repeat limit for every tool, so that the polling tool no longer trips the check at all',
          'Let the model confirm that each repeat is intended, and allow the repeat whenever the model agrees with it',
          'Set a per-tool policy for the polling tool (a delay and a cap), and keep the default strict elsewhere',
        ],
        answer: 3,
        explanation: 'Limits should match how each tool is used. A per-tool policy fixes the false positive and keeps the protection for every other tool, while a global change or a model’s confirmation weakens it everywhere.',
      },
    ],
    task: {
      title: 'Build a guard and try to defeat it',
      minutes: 18,
      steps: [
        'Save `loop_guard.py` and `demo.py` in one folder and run `python3 demo.py`. Compare the output with the expected output.',
        'Write down the four limits you would set for an agent of your own, with a reason for each number. Say what “cost” means in your agent, such as tokens or calls.',
        'Change it and observe: make the scripted model vary its query by one word each turn (use the turn number inside the query). Note which limit stops it, and how many steps were spent.',
        'Pass a fake clock to the guard (a function that returns a number you increase by hand) and make it fire `stop: timeout`. Then set `max_steps=2` and check that it fires before the repeat check.',
        'Reflect: which stuck pattern would your guard miss, and what extra signal would you add to catch it?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Only change the numbers: set `max_steps` to 2, then `max_cost` to 3, and run the demo each time. Write down which reason is printed and why.'] },
      { audience: { min: 'advanced' }, steps: ['Add a per-tool policy table to the guard (repeat allowance and minimum delay per tool), a progress check that stops after three steps with no new result ids, and a counter of guard hits per reason. Write a test for each, using the scripted stuck model.'] },
    ],
  },
];
