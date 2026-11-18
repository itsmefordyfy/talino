import type { Lesson, Project } from '../../../types';

// Module 3: Connecting LLMs to AI Agents (lessons 16 to 24, days 16 to 24; project P1 after day 24). Written 2026-11-18.
// SDK calls, parameters, model ids and exception classes come from docs/content/AGENTS_FACTS_A.md (checked 2026-11-18) and the pages cited in each version note.
// Code that needs no key (the scorecard, the ScriptedModel, normalize, triage validation, retry, router, config check, zod validation) was run locally and its output pasted;
// code that needs a key or the network was only syntax- or type-checked, and its expected output is labelled as a shape. The model ids are the ones on the vendors' pages on the checked date.
// The shop, the people and every number in the examples are invented. No prices, quotas or rate-limit figures appear anywhere.

const CHECKED = '2026-11-18';
const DOCS = {
  openaiQuickstart: { label: 'OpenAI: Quickstart', url: 'https://developers.openai.com/api/docs/quickstart' },
  openaiModels: { label: 'OpenAI: Models', url: 'https://developers.openai.com/api/docs/models' },
  openaiMigrate: { label: 'OpenAI: Migrate to the Responses API', url: 'https://developers.openai.com/api/docs/guides/migrate-to-responses' },
  openaiText: { label: 'OpenAI: Text generation', url: 'https://developers.openai.com/api/docs/guides/text' },
  openaiStructured: { label: 'OpenAI: Structured outputs', url: 'https://developers.openai.com/api/docs/guides/structured-outputs' },
  openaiTokens: { label: 'OpenAI: Token counting', url: 'https://developers.openai.com/api/docs/guides/token-counting' },
  openaiRates: { label: 'OpenAI: Rate limits', url: 'https://developers.openai.com/api/docs/guides/rate-limits' },
  openaiErrors: { label: 'OpenAI: Error codes', url: 'https://developers.openai.com/api/docs/guides/error-codes' },
  openaiAuth: { label: 'OpenAI API reference: Authentication', url: 'https://developers.openai.com/api/docs/api-reference/authentication' },
  openaiPython: { label: 'openai-python (README)', url: 'https://github.com/openai/openai-python' },
  openaiNode: { label: 'openai-node (README)', url: 'https://github.com/openai/openai-node' },
  claudeModels: { label: 'Claude docs: Models overview', url: 'https://platform.claude.com/docs/en/models/overview' },
  claudePython: { label: 'Claude docs: Python SDK', url: 'https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python' },
  claudeStops: { label: 'Claude docs: Handling stop reasons', url: 'https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons' },
  claudeStructured: { label: 'Claude docs: Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
  claudeErrors: { label: 'Claude docs: Errors', url: 'https://platform.claude.com/docs/en/api/errors' },
  claudeRates: { label: 'Claude docs: Rate limits', url: 'https://platform.claude.com/docs/en/api/rate-limits' },
  claudeTokens: { label: 'Claude docs: Token counting', url: 'https://platform.claude.com/docs/en/build-with-claude/token-counting' },
  claudeAuth: { label: 'Claude docs: Authentication', url: 'https://platform.claude.com/docs/en/manage-claude/authentication' },
  dotenv: { label: 'python-dotenv on PyPI', url: 'https://pypi.org/project/python-dotenv/' },
  nodeCli: { label: 'Node.js: Command-line options (--env-file)', url: 'https://nodejs.org/api/cli.html' },
  pydanticJson: { label: 'Pydantic: JSON', url: 'https://pydantic.dev/docs/validation/latest/concepts/json/' },
  zodBasics: { label: 'Zod: Basic usage', url: 'https://zod.dev/basics' },
};

export const lessons: Lesson[] = [
  {
    id: 'building-ai-agents-16',
    day: 16,
    title: 'Choosing an LLM for Agent Development',
    summary: 'Pick a model by your own requirements and your own test cases, not by announcements, and keep the choice easy to change.',
    intro: {
      objectives: [
        'List the criteria that matter when an agent chooses a model, and ask one question for each',
        'Filter a shortlist with must-have requirements and then compare the survivors on your own measurements',
        'Keep the model id in one place so a later change is a one-line edit',
      ],
      why: 'Your agent will call the model many times a day, so a poor choice shows up as slow answers, wrong answers or a bill you did not expect. A repeatable way to choose lets you change models calmly when a better one appears.',
    },
    minutes: 20,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `A new model is announced almost every month. Each one claims to be better. If your agent depends on a model, how do you choose without reading every announcement, and how do you know when it is time to change? In the course *How Large Language Models Work* you saw what a model is. Here you treat it as a part you pick for a job, the way you would pick a part for a bicycle: by what the job needs, then by testing.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dennis, Mika's nephew, built the first version of the shop's chat assistant in a weekend. He used the model a popular video recommended. It answered opening-hours questions well. Then Mika asked it to read the shop's 40-page repair guide and suggest a service. Part of the guide did not fit in one request, so it answered from the first pages only. Replies also took so long that some customers closed the chat. Dennis had never written down what the assistant had to do, so he could not say whether the model was wrong or the job was. He started again, this time with a list of ten real customer questions, and tested two models on it.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Choose in two steps. First, **must-haves**: requirements a model either meets or does not, such as "supports tool calling" (the model asks your code to run a function; module 4) or "accepts a long enough input". A model that fails one is out, however good it looks elsewhere. Second, **trade-offs**: things that are a matter of degree, such as answer quality, speed and cost. Compare only the models that survived step one, on your own test cases. The table lists the questions to ask.` },
      {
        type: 'table',
        headers: ['Criterion', 'The question to ask', 'How you check it'],
        rows: [
          ['Quality for your task', 'Does it give acceptable answers to my real inputs, in the format I need?', 'Run 10 to 20 of your own test cases and mark each pass or fail'],
          ['Tool calling and structured output', 'Can it ask for tool calls and return JSON that follows a schema?', 'Read the vendor docs for the model; then test one call'],
          ['Context window', 'How much text fits in one request, counting instructions, history and documents?', 'Count the tokens of your longest realistic request'],
          ['Latency', 'How long until the user sees an answer?', 'Time your own test cases; one agent step may need several calls'],
          ['Cost per task', 'What does one finished task cost, counting every call and every token in and out?', 'Add up the usage fields from your test run, then use the vendor price page'],
          ['Reliability and limits', 'What happens at busy times, and how many requests can I send?', 'Read the rate-limit page; test with a short burst (lesson 23)'],
          ['Data handling', 'Where do my users\' messages go, and how long are they kept?', 'Read the vendor\'s data terms before sending real customer data'],
          ['Model lifecycle', 'How long will this model id keep working?', 'Read the deprecation and retirement notes; plan a re-test'],
        ],
        caption: 'The first column is what to compare. Notice that only "quality" can be judged from your own test cases alone; the others need documents or measurements too.',
      },
      { type: 'paragraph', text: `Why your own test cases and not a public ranking? A public ranking measures how models do on that ranking's questions. Your shop's questions are different. Ten of your real questions tell you more about your agent than a score for a task you never do. Write the cases once, keep them, and run them again whenever you consider a change. This is a small version of the *evaluation set* you will build properly in module 11.` },
      { type: 'paragraph', text: `The baseline is the simplest thing that works. Start with one model for every step. Only when your test run shows that some steps are easy and some are hard should you use a smaller, faster model for the easy ones (lesson 24). Two models mean two sets of test results and two things that can change under you.` },
      { type: 'paragraph', text: `An analogy, and only an analogy: choosing a model is like hiring a delivery rider for the shop. You first rule out riders who cannot do the job (no licence, cannot carry the box). Then you give two or three of them the same real deliveries and compare how they did, how long it took and what it cost. You do not hire the rider with the fastest motorcycle on paper.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a *model* is the program that writes the answers, and an *API* (application programming interface) is the door your code uses to talk to it. The *context window* is how much text the model can read in one go, like the size of the desk it works on. *Latency* is the waiting time. In the code below, \`MUST_HAVE\` is a list of yes-or-no rules; \`passes_must_haves\` checks one model against them. \`WEIGHTS\` says how much you care about each trade-off, and \`weighted_score\` multiplies each score by its weight and adds them up. The program prints the models that pass, best score first, and says why a model was dropped.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a real system the choice is a configuration, not a decision made once. Keep your test cases in version control with the expected checks, record which model id and date each run used, and re-run the set when a vendor announces a new model or retires one. Models change under a stable name less often than you fear but more often than you plan for, so pin the exact id, read the retirement notes and build a fallback path (a second model, tested in advance). Also check where requests are processed and what the vendor retains, since that can rule a model out before quality does. Treat any vendor or model name in your code as a swappable adapter detail.` },
      { type: 'version', text: 'On the checked date, OpenAI\'s models page lists gpt-6.2-astra, gpt-6.2-sol, gpt-6.1-terra and gpt-6-luna as flagship models, and its guides use gpt-6.2-astra in examples. The Claude models overview lists claude-fable-5-2, claude-opus-5-5, claude-sonnet-5-5 and claude-haiku-5-5, and says each Claude model id is a pinned snapshot. These are examples of what exists, not recommendations, and the names will change: read the current page before you copy an id.', checked: CHECKED, sources: [DOCS.openaiModels, DOCS.claudeModels] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `Build a small scorecard that applies the two steps to your own measurements. It needs only Python 3 and no key. The three model names are placeholders, and every number is invented: replace them with what you measure.` },
      { type: 'code', language: 'python', label: 'scorecard.py', code: `# scorecard.py: compare models on YOUR own measurements.
# The names below are placeholders. Replace them and the numbers with what you measured.
MUST_HAVE = {"tool_use": True, "context_fits": True}   # a model that fails one is out
WEIGHTS = {"quality": 5, "speed": 3, "cost": 2}         # how much YOU care, 1 to 5

# Scores are 1 (poor) to 5 (good) from your own test of 10 shop questions.
# For cost, 5 means cheapest by your own accounting. These numbers are invented.
CANDIDATES = {
    "model-a": {"tool_use": True, "context_fits": True, "quality": 4, "speed": 2, "cost": 2},
    "model-b": {"tool_use": True, "context_fits": True, "quality": 3, "speed": 4, "cost": 4},
    "model-c": {"tool_use": False, "context_fits": True, "quality": 5, "speed": 5, "cost": 5},
}


def passes_must_haves(candidate):
    return all(candidate.get(name) == wanted for name, wanted in MUST_HAVE.items())


def weighted_score(candidate):
    return sum(WEIGHTS[name] * candidate[name] for name in WEIGHTS)


def main():
    kept = {}
    for name, candidate in CANDIDATES.items():
        if passes_must_haves(candidate):
            kept[name] = weighted_score(candidate)
        else:
            print(f"{name}: out (fails a must-have)")
    for name, total in sorted(kept.items(), key=lambda item: item[1], reverse=True):
        print(f"{name}: {total}")


if __name__ == "__main__":
    main()` },
      { type: 'paragraph', text: `Read it in this order. \`passes_must_haves\` drops any model that fails a yes-or-no rule. \`weighted_score\` turns the survivors' scores into one number using your weights. \`main\` prints the dropped models and then the survivors from highest to lowest. The scores are 1 to 5 from your own test of ten shop questions: a number you invent is a guess, so measure it. Change a weight and the order can change, which is the point: the weights are your decision, written down where you can see them.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run locally with Python 3)', code: `model-c: out (fails a must-have)
model-b: 35
model-a: 30` },
      { type: 'list', items: [
        'If you see "model-c: out" and expected it to win, remember that it failed a must-have (no tool use). Fix the data if your measurement was wrong, not the rule.',
        'If you get a KeyError, one candidate is missing a score that appears in WEIGHTS. Every candidate needs every scored criterion.',
        'If two models tie, they are equal on what you measured. Add a test case that separates them, or choose the one that is easier to change.',
        'If the order feels wrong, your weights probably do not match what you care about. Write one sentence for why each weight is what it is.',
      ] },
      { type: 'warning', text: 'Test with invented or anonymised messages. Do not paste real customers\' names, phone numbers or order details into a vendor\'s playground or test script until you have read the vendor\'s data terms.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: write ten realistic customer questions for Mika\'s Bike Shop (or your own project) and save them in a file called cases.txt.',
        'Next lesson, "Introduction to LLM APIs", shows what a request to any of these models looks like.',
        'Read the models page of the vendor you plan to use, and note its retirement information.',
      ] },
      { type: 'takeaways', items: [
        'Choose in two steps: drop models that fail a must-have, then compare the rest on your own measurements.',
        'Your own ten test cases tell you more than a public ranking, because they are your task.',
        'Quality is only one criterion: context window, latency, cost per task, limits, data handling and model lifetime matter too.',
        'Start with one model for every step; add a second only when your test results show easy and hard steps.',
        'Write the model id in one place and note the date you tested it.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-16-code-challenge-1',
          kind: 'code-challenge',
          title: 'Which must-haves does a model fail?',
          prompt: 'Write `failedMustHaves(candidate, mustHave)`. It returns an array with the name of every must-have that the candidate does not meet, in the order the names appear in `mustHave`. An empty array means the model passes. (This runs plain JavaScript, with data written by hand: no model is involved.)',
          concept: 'filtering models by must-have requirements',
          language: 'javascript',
          starter: `function failedMustHaves(candidate, mustHave) {
  // go through every name in mustHave and compare it with the candidate
  return [];
}`,
          solution: `function failedMustHaves(candidate, mustHave) {
  const failed = [];
  for (const name of Object.keys(mustHave)) {
    if (candidate[name] !== mustHave[name]) {
      failed.push(name);
    }
  }
  return failed;
}`,
          tests: {
            kind: 'function',
            fn: 'failedMustHaves',
            cases: [
              { label: 'meets everything', args: [{ toolUse: true, longContext: true }, { toolUse: true, longContext: true }], expected: [] },
              { label: 'fails one', args: [{ toolUse: false, longContext: true }, { toolUse: true, longContext: true }], expected: ['toolUse'] },
              { label: 'fails two, in order', args: [{ toolUse: false, longContext: false }, { toolUse: true, longContext: true }], expected: ['toolUse', 'longContext'] },
              { label: 'a missing field counts as failed', args: [{ toolUse: true }, { toolUse: true, longContext: true }], expected: ['longContext'], hidden: true },
            ],
          },
          hints: [
            'Start with an empty array called `failed`, and return it at the end.',
            '`Object.keys(mustHave)` gives you the names in order. Loop over them with `for (const name of ...)`.',
            'For each name, if `candidate[name] !== mustHave[name]`, push the name. A missing field is `undefined`, so it is not equal either.',
          ],
          explanation: 'A must-have is a yes-or-no rule, so the check is a plain comparison. Returning the names of the failed rules, not just true or false, tells you why a model was dropped, which you want in your decision notes.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-16-scenario-1',
          kind: 'scenario',
          title: 'Mika wants a model today',
          prompt: 'Choose how to pick the model for the shop\'s assistant.',
          concept: 'choosing a model by requirements and tests',
          situation: 'Mika\'s Bike Shop wants an assistant that answers questions about hours, repairs and parts, and later will call tools to check stock. A friend says "just use whatever is number one this month". Dennis has two evenings and ten realistic customer questions written down.',
          options: [
            { text: 'List the must-haves (for example tool calling and enough context for the repair guide), shortlist two or three models that meet them, run the ten questions on each and compare quality, time and tokens.', consequence: 'In two evenings Dennis has a table of his own results and a reason for the choice. When a new model appears he can run the same ten questions again.', quality: 'best' },
            { text: 'Pick the cheapest model that meets the must-haves, run the ten questions once, and switch if too many fail.', consequence: 'This is quick and cheap, and it can work for a simple assistant. It risks missing a model that is better for little extra cost, because only one candidate was measured.', quality: 'acceptable' },
            { text: 'Use the model at the top of a public ranking, because it must be the best.', consequence: 'The ranking measured other questions. The model may be slow or costly for a shop that mostly answers short questions, and Dennis cannot say how it does on the shop\'s own cases.', quality: 'poor' },
            { text: 'Use the largest model available for every step so that quality is never the problem.', consequence: 'Every simple question now takes the longest and most expensive route. Dennis never learns which steps needed a large model at all.', quality: 'poor' },
          ],
          hints: [
            'Which option gives Dennis evidence he can show Mika?',
            'A ranking and a model size are claims about someone else\'s tests. Which option tests the shop\'s own questions?',
            'The best answer filters first with must-haves and then compares survivors on his own cases.',
          ],
          explanation: 'Must-haves remove models that cannot do the job, and your own test cases measure how the rest do on your task. The cheapest-that-passes option is acceptable for a first version, but it compares nothing. A ranking or a size is not a measurement of your task.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-16-match-1',
          kind: 'match',
          title: 'Which criterion is the problem?',
          prompt: 'Match each situation to the criterion from the table that explains it.',
          concept: 'model selection criteria',
          labels: { terms: 'Situation', meanings: 'Criterion' },
          pairs: [
            { term: 'Customers close the chat after waiting a long time for the first reply', definition: 'Latency' },
            { term: 'The 40-page repair guide does not fit in one request', definition: 'Context window' },
            { term: 'The model id the bot uses is announced as retired next quarter', definition: 'Model lifecycle' },
            { term: 'Mika asks where the customers\' messages are stored and for how long', definition: 'Data handling' },
          ],
          hints: [
            'Read each situation and ask what is being measured: time, size, a date or a policy.',
            'The retirement notice and the storage question both come from documents, not from your test cases.',
            'The repair guide problem is about how much text one request can hold.',
          ],
          explanation: 'Each situation points at one row of the table. Waiting time is latency, text that does not fit is the context window, a retirement date is model lifecycle and where messages are kept is data handling.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-16-q1',
        prompt: 'Dennis tests two models on ten real shop questions. Model A passes 9 but takes about twice as long as model B, which passes 8. The shop mostly gets quick chat questions. What is the most sensible next step?',
        choices: [
          'Choose model A, because passing more questions is always the deciding factor when the models are so close.',
          'Decide how much speed matters to the shop, write that as a weight, add two or three harder test cases that separate them, and then choose.',
          'Choose model B, because the faster model is always the better one for any chat assistant.',
          'Test a third model with a famous name, since two results are not enough to decide anything at all.',
        ],
        answer: 1,
        explanation: 'The two models differ in a trade-off, and the right weighting depends on the shop. A few more test cases that separate them give evidence; "always" rules in either direction ignore the shop\'s needs.',
      },
      {
        id: 'building-ai-agents-16-q2',
        prompt: 'A team picked a model for a support agent that must call a stock-check tool. After building, they find the model\'s docs say it cannot return tool calls. Which step of choosing was skipped?',
        choices: [
          'Comparing the model on cost per task before building anything on top of it.',
          'Measuring latency across several test cases to see how fast replies come back.',
          'Writing a longer system prompt so that the agent knows what the stock tool does and when it should be used.',
          'Listing must-haves first, such as tool calling, and dropping models that fail them.',
        ],
        answer: 3,
        explanation: 'Tool calling was a requirement the agent could not work without, so it belonged in the must-have filter before any comparison of cost or speed.',
      },
      {
        id: 'building-ai-agents-16-q3',
        prompt: 'Your scorecard ranks model-b above model-a when speed has weight 3. You change the weight of speed to 1 and quality to 5, and model-a now wins. What does this tell you?',
        choices: [
          'Model-a\'s test results changed, so the earlier measurements were wrong and must be repeated from the start.',
          'The scorecard has a bug, because a ranking should not change when only the weights change.',
          'The ranking depends on your weights, so they are a decision you should write down and be able to explain.',
          'Both models are equally good, because a ranking that can flip does not show any real difference.',
        ],
        answer: 2,
        explanation: 'The measurements did not change, only how much you value each one. The weights encode your priorities, which is why a written reason for each weight matters.',
      },
      {
        id: 'building-ai-agents-16-q4',
        audience: { max: 'beginner' },
        prompt: 'You are choosing between two models. What does a "must-have" mean in this lesson?',
        choices: [
          'The model that most people say is the best one this month.',
          'A rule the model either meets or does not, such as "can call tools". If it fails, you drop it.',
          'A score from 1 to 5 that you give the model after testing it on your own questions, to compare it with the others.',
        ],
        answer: 1,
        explanation: 'A must-have is a yes-or-no requirement. Scores from 1 to 5 are trade-offs, compared only among the models that pass the must-haves.',
      },
      {
        id: 'building-ai-agents-16-q5',
        audience: { min: 'advanced' },
        prompt: 'Your agent has run on one pinned model id for six months. The vendor announces that this id will be retired in a few months and recommends a newer one. What is the strongest response?',
        choices: [
          'Switch the id in configuration now and watch the error rate for a week, since the vendor says the new model is better.',
          'Wait until the retirement date, because tested code should never be changed before it actually breaks.',
          'Run your stored test cases against the new model and record quality, latency and token use, then switch with a rollback path ready.',
          'Rewrite the agent around the new model\'s features, so that all of its capabilities are used from the first day.',
        ],
        answer: 2,
        explanation: 'A stored evaluation set turns the change into a measurement, and a rollback path limits the damage if the result differs. Switching blind or waiting for a failure both skip the evidence.',
      },
    ],
    task: {
      title: 'Write your test cases and fill the scorecard',
      minutes: 20,
      steps: [
        'Write ten realistic questions or inputs for your agent (for Mika\'s Bike Shop: hours, a repair request, a parts question, a rude message, a message with a typo) in cases.txt. Use invented details only.',
        'Copy scorecard.py. Write down your must-haves and your weights, with one sentence of reason for each weight.',
        'Pick two or three models you could use. Read each one\'s docs page for the must-haves and mark them true or false. If you have no API key yet, leave the quality numbers as 3 and note that you will measure them in lesson 18 or 19.',
        'Change it and observe: change one weight (for example speed from 3 to 5) and run the script again. Does the order change?',
        'Write two or three sentences: which model would you choose today, and what result would make you change your mind?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If you are unsure what to put in the must-have list, ask an assistant to explain each criterion in the table with an example from a bike shop. Then check each explanation against the vendor\'s own docs page.'] },
      { audience: { min: 'advanced' }, steps: ['Store cases.txt and the scorecard in a repository, and add a field for the model id and the date of each run. Write down how you would automate the re-run when a vendor announces a retirement, and which result would block the switch.'] },
    ],
  },
  {
    id: 'building-ai-agents-17',
    day: 17,
    title: 'Introduction to LLM APIs',
    summary: 'See what travels between your code and a model: a request with messages, a response with text and usage, and no memory in between.',
    intro: {
      objectives: [
        'Describe the parts of a request to an LLM API: model, instructions, messages, roles and limits',
        'Explain why the API is stateless and what your code must do to keep a conversation',
        'Run a ScriptedModel that records what each request contains, with no key and no cost',
      ],
      why: 'Every agent you build sits on top of this one exchange. If you know exactly what is sent and what comes back, you can debug a forgetful agent, control what it costs and swap one vendor for another.',
    },
    minutes: 20,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `In a chat app, the assistant seems to remember you. Over an API it does not remember anything at all. So what exactly travels between your code and the model, and who keeps the conversation? The answer decides how you build every agent in this course.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dennis connected Mika's shop assistant to a model for the first time. A customer wrote, "I have a Trek mountain bike." The assistant replied, "Noted." The next message was, "My chain keeps slipping," and the reply was a sensible answer about chains. Then the customer asked, "Which bike did I say I own?" The assistant answered, "I do not know which bike you own." Dennis was sure it had been told. He printed what his code sent and found the reason in one line: each request contained only the newest message. The model never saw the first one. Nothing was broken. The API was working exactly as designed.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `An **LLM API** (application programming interface) is a way for your code to send text to a model that runs on someone else's computers and get text back. Your code sends a **request** over the internet and receives a **response**. A vendor's **SDK** (software development kit, a library you install) hides the network details, so a request looks like a function call.` },
      { type: 'paragraph', text: `A request has a few parts. The **model** is the id of the model to use. The **instructions** (OpenAI's Responses API calls the field \`instructions\`; Anthropic's Messages API calls it \`system\`) tell the model its job and rules, like the role and format rules you wrote in module 2. The **messages** are the conversation so far, a list in which each item has a **role** that says who wrote it, such as \`user\` for your customer's text and \`assistant\` for the model's earlier replies. Last come **limits**, such as the largest number of tokens the model may write. Both vendors have this limit; Anthropic requires it on every request.` },
      { type: 'paragraph', text: `The key idea: **the API is stateless**. It keeps nothing between two requests. If you want the model to know what was said before, your code must send the earlier messages again, every time. The "memory" you see in a chat app is the app storing the conversation and resending it. In your agent, that job is yours.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant Code as Your code
  participant API as Model API
  Code->>API: Request 1: [user: I have a Trek]
  API-->>Code: Reply 1: Noted.
  Code->>API: Request 2: [user, assistant, user: chain slips]
  API-->>Code: Reply 2: Likely a worn chain.
  Code->>API: Request 3: all 5 earlier messages plus the new question
  API-->>Code: Reply 3: A Trek mountain bike.`,
        caption: 'Look at what each request carries. Request 3 contains every earlier message, because the API forgot all of them. The conversation lives in your code.',
      },
      { type: 'paragraph', text: `This has a cost. Because you resend the history, each request is longer than the one before, and you are charged for the tokens you send as well as the ones you receive (lesson 24 shows how to count them). A very long conversation eventually no longer fits in the model's context window. Module 5 teaches how to trim and summarise history. For now, the baseline is the simplest thing that works: keep a list, append each user message and each reply, and send the whole list.` },
      { type: 'paragraph', text: `The response carries the model's text, a field that says why it stopped, and a usage count of tokens in and out (lesson 20 reads these). Nothing in it is stored for you by magic. Treat it as data your code receives, and check it before you trust it.` },
      { type: 'paragraph', text: `An analogy, and only an analogy: each API call is like phoning a helpful stranger who forgets you the moment you hang up. If you want them to continue, you must read the whole conversation back to them on every call.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a *request* is a package of text your program sends; a *response* is the package that comes back. Each package is separate. In the code below, \`ScriptedModel\` is a pretend model: you give it a list of replies, and it hands them back one by one, so you can test your program without paying or needing a key. It also saves every request it receives in \`calls\`. \`chat_with_memory\` keeps a list called \`history\` and adds both sides of the talk to it. \`chat_without_memory\` sends only the new question. The two printed lines show how many messages each request carried.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Stateless calls are a feature at scale: any server can handle any request, retries are safe to repeat, and you decide what the model sees. The price is that history management becomes your design problem: what to keep verbatim, what to summarise, what to drop, and what must never be sent (secrets, other users' data). Resending a growing prefix also makes latency and input cost grow with turn count, which is why vendors offer ways to reuse a repeated prefix. Some providers also offer server-side conversation state; treat that as a convenience with its own storage, retention and portability questions, not as a reason to skip logging what you sent.` },
      { type: 'version', text: 'On the checked date, OpenAI\'s migration guide says the Responses API is recommended for all new projects, while Chat Completions remains supported; Responses takes an `input` (a string or a list of messages) and a top-level `instructions` field. The Claude Messages API takes `system` and `messages` and requires `max_tokens`. Each Anthropic SDK major version pins one API version. The course uses the Responses API for OpenAI and the Messages API for Claude.', checked: CHECKED, sources: [DOCS.openaiMigrate, DOCS.openaiText, DOCS.claudePython] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You will build the ScriptedModel you will use for the rest of the module and in project P1. Save it as \`scripted_model.py\`. It needs only Python 3. It returns replies in the shape of an OpenAI Responses result (\`output_text\`, \`status\`, \`usage\`), so the same code works with the real client later. It is a teaching stand-in, not a model.` },
      { type: 'code', language: 'python', label: 'scripted_model.py', code: `# scripted_model.py: a teaching stand-in, NOT a model.
# It returns replies you prepared, in the shape of an OpenAI Responses result,
# so code written for it also works with the real client.
from types import SimpleNamespace


class ScriptedModel:
    def __init__(self, replies):
        self.replies = list(replies)
        self.calls = []          # every request it received, for your tests
        self.responses = self    # lets you write client.responses.create(...)

    def create(self, *, model, input, instructions=None, **options):
        self.calls.append({"model": model, "input": input if isinstance(input, str) else list(input), "instructions": instructions})
        if not self.replies:
            raise RuntimeError("ScriptedModel has no more prepared replies")
        text = self.replies.pop(0)
        sent = input if isinstance(input, str) else " ".join(str(m["content"]) for m in input)
        usage = SimpleNamespace(input_tokens=len(sent.split()), output_tokens=len(text.split()))
        return SimpleNamespace(output_text=text, status="completed", usage=usage)` },
      { type: 'paragraph', text: `Now add a second file in the same folder, \`stateless_demo.py\`, that sends the same three questions two ways.` },
      { type: 'code', language: 'python', label: 'stateless_demo.py', code: `# stateless_demo.py: the API remembers nothing. YOUR code keeps the conversation.
from scripted_model import ScriptedModel

MODEL = "stand-in-model"
INSTRUCTIONS = "You are the assistant of Mika's Bike Shop. Keep answers short."


def chat_with_memory(client, questions):
    history = []
    for question in questions:
        history.append({"role": "user", "content": question})
        reply = client.responses.create(model=MODEL, instructions=INSTRUCTIONS, input=history)
        history.append({"role": "assistant", "content": reply.output_text})


def chat_without_memory(client, questions):
    for question in questions:
        client.responses.create(model=MODEL, instructions=INSTRUCTIONS, input=question)


QUESTIONS = ["I have a Trek mountain bike.", "My chain keeps slipping.", "Which bike did I say I own?"]
REPLIES = ["Noted.", "Likely a worn chain or cassette.", "A Trek mountain bike."]

with_memory = ScriptedModel(REPLIES)
chat_with_memory(with_memory, QUESTIONS)
print("with memory, messages sent per call:", [len(c["input"]) for c in with_memory.calls])

without_memory = ScriptedModel(REPLIES)
chat_without_memory(without_memory, QUESTIONS)
print("without memory, what call 3 saw:", without_memory.calls[2]["input"])` },
      { type: 'paragraph', text: `The important lines: in \`chat_with_memory\`, \`history.append(...)\` runs twice per turn, once for the question and once for the reply, so the next request carries both. The call \`client.responses.create(...)\` has the same name and arguments as the real OpenAI call, so you can later replace the ScriptedModel with \`OpenAI()\` without rewriting the loop. The \`usage\` numbers it returns are a rough word count, only so that the shape matches.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run locally with Python 3)', code: `with memory, messages sent per call: [1, 3, 5]
without memory, what call 3 saw: Which bike did I say I own?` },
      { type: 'list', items: [
        'If you see ModuleNotFoundError for scripted_model, the two files are not in the same folder, or you started Python from a different folder.',
        'If you see "ScriptedModel has no more prepared replies", your loop made more calls than you gave replies. Add a reply or check the loop.',
        'If the first list shows [1, 2, 3], you forgot the second append, so the assistant\'s replies were never stored. The model would then see only the user turns.',
        'If you later swap in the real client and get an authentication error, the key is missing or wrong (lesson 22).',
      ] },
      { type: 'warning', text: 'A conversation history is data. Everything you resend goes to the vendor on every request, so do not put secrets, other customers\' details or private notes in it, and keep your own copy only as long as you need it. The ScriptedModel never leaves your computer; a real call does.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: change the demo so it sends five questions, and print the length of the last request.',
        'Next lesson, "Connecting to OpenAI Models", replaces the ScriptedModel with a real call to OpenAI.',
        'Read the OpenAI text-generation guide and find the paragraph on `instructions` and message roles.',
      ] },
      { type: 'takeaways', items: [
        'A request carries a model id, instructions, a list of messages with roles, and a limit on the answer length.',
        'The API is stateless: it remembers nothing between requests, so your code keeps and resends the conversation.',
        'Each request is longer than the last, so history costs input tokens and eventually must be trimmed (module 5).',
        'A ScriptedModel with the same call shape lets you test the loop without a key; it is a stand-in, not a model.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-17-predict-output-1',
          kind: 'predict-output',
          title: 'How many messages does each request carry?',
          prompt: 'This JavaScript stands in for the two chat loops of the lesson. `send` keeps its history; `sendStateless` does not. Predict the three printed numbers. (No model is called: the reply text is fixed.)',
          concept: 'stateless API and resending history',
          language: 'javascript',
          code: `function makeChat() {
  const history = [];
  return function send(text) {
    history.push({ role: 'user', content: text });
    const sentCount = history.length;
    history.push({ role: 'assistant', content: 'ok' });
    return sentCount;
  };
}

function sendStateless(text) {
  const messages = [{ role: 'user', content: text }];
  return messages.length;
}

const send = makeChat();
console.log(send('a'));
console.log(send('b'));
console.log(sendStateless('c'));`,
          choices: ['1\n2\n3', '1\n3\n1', '1\n3\n5', '1\n1\n1'],
          wrongNotes: {
            '1\n2\n3': 'This forgets that each turn adds two messages (the question and the reply), not one.',
            '1\n3\n5': 'The third call is the stateless one: it sends only its own message, so it cannot continue the count.',
            '1\n1\n1': 'The first function keeps a history, so its second request carries three messages.',
          },
          hints: [
            'Count the messages in `history` at the moment `sentCount` is read.',
            'After the first turn, history holds two items (user and assistant). The second question makes three.',
            '`sendStateless` builds a brand-new list on every call, so its count never grows.',
          ],
          explanation: 'The first request carries 1 message. The second carries 3: the first question, its reply, and the new question. The stateless function always sends 1. That difference is why a stateless API needs your code to resend history.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-17-fix-bug-1',
          kind: 'fix-bug',
          title: 'The assistant that forgot the Trek',
          prompt: 'This function should return how many messages each request carries: 1, then 3, then 5 for three questions. It returns 1, 1, 1 because every request is built from the new question alone. Fix the one wrong line. (A stand-in for the real loop; no model is called.)',
          concept: 'sending the conversation history with every request',
          language: 'javascript',
          code: `function sentLengths(questions) {
  const history = [];
  const sent = [];
  for (const question of questions) {
    const messages = [{ role: 'user', content: question }];
    sent.push(messages.length);
    history.push({ role: 'user', content: question });
    history.push({ role: 'assistant', content: 'ok' });
  }
  return sent;
}`,
          bugLine: 5,
          fixes: [
            { line: `    const messages = history.concat([{ role: 'user', content: question }]);`, correct: true, why: 'The request is the stored history plus the new question, so the lengths become 1, 3, 5.' },
            { line: `    const messages = history;`, correct: false, why: 'This sends the history without the new question, so the lengths are 0, 2, 4 and the model would not see the latest message.' },
            { line: `    const messages = [{ role: 'assistant', content: 'ok' }, { role: 'user', content: question }];`, correct: false, why: 'This sends the same two made-up messages every time. It still forgets the real earlier turns.' },
          ],
          tests: {
            kind: 'function',
            fn: 'sentLengths',
            cases: [
              { label: 'three questions', args: [['a', 'b', 'c']], expected: [1, 3, 5] },
              { label: 'one question', args: [['a']], expected: [1] },
              { label: 'four questions', args: [['a', 'b', 'c', 'd']], expected: [1, 3, 5, 7], hidden: true },
            ],
          },
          hints: [
            'Each request must contain everything said so far, plus the new question.',
            '`history` already holds the earlier user and assistant messages. The line that builds `messages` ignores it.',
            'Start `messages` from `history` and add the new question: `history.concat([...])` makes a new list without changing history.',
          ],
          explanation: 'The history array was being kept correctly, but never sent. The request must be history plus the new message. Building it fresh each turn is the same mistake as Dennis\'s one-line bug.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-17-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Four things people believe about APIs',
          prompt: 'Tap each belief and read what is true and what is missing.',
          concept: 'what an LLM API does and does not do',
          cards: [
            { front: '"The model remembers me between calls."', back: 'Not through the API. Each request is independent. A chat app seems to remember because it stores the conversation and sends it again.' },
            { front: '"The instructions only need to be sent once."', back: 'With the Responses API, `instructions` applies only to the current request, so send them each time. The model does not keep them between calls.' },
            { front: '"A longer history is free."', back: 'Every message you resend is input tokens on every later request, so cost and delay grow with the conversation, and it can eventually stop fitting.' },
            { front: '"If the call succeeds, the answer is right."', back: 'A successful response only means the request worked. The text can still be wrong, cut off or refused, so your code checks it (lessons 20 and 21).' },
          ],
          hints: [
            'For each card, ask what your code would have to do differently if the belief were false.',
            'Two cards are about what is resent, one is about cost and one is about trust.',
            'The word "free" and the word "right" are the ones to doubt.',
          ],
          explanation: 'Each belief is a trap that makes an agent forget, drift or cost more than expected. Stateless requests, repeated instructions, growing history and unchecked answers are the four facts to design around.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-17-q1',
        prompt: 'A support agent answers the first question well. On the second message ("what about the other one?") it asks what "the other one" means, although the customer named two bikes in the first message. Your code sends only the newest user message. What is the fix?',
        choices: [
          'Increase the maximum number of tokens the model may write, so that it has room to use what it knows.',
          'Ask the vendor to turn on conversation memory for your key, since the API normally stores it.',
          'Send the earlier user and assistant messages together with the new one on every request.',
          'Make the instructions longer and repeat the customer\'s name, since the model keeps the instructions between calls.',
        ],
        answer: 2,
        explanation: 'The API is stateless, so the model only sees what each request contains. The earlier messages must be sent again. A larger answer limit and longer instructions do not carry the conversation.',
      },
      {
        id: 'building-ai-agents-17-q2',
        prompt: 'A teammate says: "The chat app remembers my name, so the API must remember it too." Which reply is most accurate?',
        choices: [
          'The chat app stores the conversation and sends it again on each request. The API call itself keeps nothing.',
          'The API remembers for a few minutes, and then forgets, which is why long pauses between messages cause problems in a chat.',
          'The app only remembers the last two messages, and that is the limit of every LLM API.',
          'The API remembers anything sent with the role "assistant", but not what the user wrote.',
        ],
        answer: 0,
        explanation: 'Remembering is done by the application that resends history. The role field says who wrote a message; it does not control storage.',
      },
      {
        id: 'building-ai-agents-17-q3',
        prompt: 'Your agent\'s chat has reached 40 turns. Compared with turn 1, what happens to a request at turn 40, if you resend the whole conversation?',
        choices: [
          'It is about the same size, because the vendor stores the first 39 turns and only the new text travels.',
          'It is shorter, because the model compresses earlier turns after each reply and returns the shorter version to your code.',
          'It is the same size, because the instructions are always the biggest part of a request.',
          'It is much longer, so it uses more input tokens and takes longer, and it may stop fitting in the context window.',
        ],
        answer: 3,
        explanation: 'Resending the history makes every request longer than the last. That raises input tokens and latency, and it is why history needs trimming or summarising (module 5).',
      },
      {
        id: 'building-ai-agents-17-q4',
        audience: { max: 'beginner' },
        prompt: 'In a request, what does the "role" of a message tell the model?',
        choices: [
          'How important the message is, from 1 to 5, so the model answers the important ones first.',
          'Who wrote the message, for example the user or the assistant.',
          'Which model should answer the message.',
        ],
        answer: 1,
        explanation: 'The role says who wrote each message, so the model can tell your customer\'s words from its own earlier replies.',
      },
      {
        id: 'building-ai-agents-17-q5',
        audience: { min: 'advanced' },
        prompt: 'In production, a stateless call is made safe to retry after a timeout. Which design detail makes the retry produce the same conversation?',
        choices: [
          'Rebuild the request from your stored history each time, and append the reply only after a successful response.',
          'Append the model\'s reply to your history immediately before the response arrives, so the list is always ready.',
          'Keep the history only in the vendor\'s storage, and ask the vendor to resume the last request automatically.',
          'Send only the newest user message on a retry, since the vendor already received the earlier ones.',
        ],
        answer: 0,
        explanation: 'If you append only after success, a retry rebuilds the identical request. Appending early can leave a half-finished turn in the history, and a retry that sends fewer messages changes what the model sees.',
      },
    ],
    task: {
      title: 'See your own conversation grow',
      minutes: 15,
      steps: [
        'Save scripted_model.py and stateless_demo.py in a new folder and run the demo. Check that you get the same output as above.',
        'Change QUESTIONS to five questions and add two more prepared replies. Print the number of messages in each request.',
        'Change it and observe: in `chat_with_memory`, delete the line that appends the assistant reply. Run it again. How do the counts change, and what would the model lose?',
        'Print `with_memory.calls[2]["input"]` and read it. Write one sentence: what does the model see in the third request that it would not see in a stateless one?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If any line of the code is unclear, copy it to an assistant and ask for a line-by-line explanation using a shop example. Then change one number in the script and check that the output matches what you expected before you ran it.'] },
      { audience: { min: 'advanced' }, steps: ['Add a function that trims the history to the newest N messages while always keeping the first message, and print the request sizes with and without trimming. Note one kind of fact that this trimming could make the agent forget, and how you would test for it.'] },
    ],
  },
  {
    id: 'building-ai-agents-18',
    day: 18,
    title: 'Connecting to OpenAI Models',
    summary: 'Make a first real call to an OpenAI model with the Responses API, read the result safely and know which fields to check.',
    intro: {
      objectives: [
        'Install the OpenAI SDK and make a call with the Responses API in Python and TypeScript',
        'Read the text from a response and check its status before you trust it',
        'Keep the model id and the instructions in one place, and the key out of the code',
      ],
      why: 'This is your agent\'s first real contact with a model. A small, careful call that checks what came back is the base every later lesson builds on, from structured output to tool calls.',
    },
    minutes: 22,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `What is the smallest program that gets a real answer from an OpenAI model, and what should it check before it trusts that answer? This lesson builds that program. The next lesson builds the same thing for Anthropic, and then you will compare the two.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dennis made his first real call and printed the answer. The output was an empty line. No error, no text. He tried again and got the same. The call had worked: he had set the maximum output to 20 tokens, because he wanted short answers. But the model had used up all 20 tokens before it wrote a visible word, and the response said so in a field he never printed. Its status was "incomplete" and the reason was that the output limit had been reached. The program had treated "the call returned" as "the answer is ready". Fixing the limit took one minute. Learning to check the status took the rest of the afternoon, and it saved him from the same silent failure later.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Install the SDK with \`pip install openai\` (Python) or \`npm install openai\` (TypeScript). The SDK reads your key from an **environment variable** named \`OPENAI_API_KEY\`, so you create the client with no arguments: \`OpenAI()\`. An environment variable is a named setting that lives in your computer's shell or in a \`.env\` file, outside your code; lesson 22 shows how to set it safely. OpenAI recommends the **Responses API** for new projects, and its call is \`client.responses.create(...)\`.` },
      { type: 'table', headers: ['You send', 'What it does', 'You read back'], rows: [
        ['model', 'Chooses the model by id; keep it in one constant or variable', 'model (which one answered)'],
        ['instructions', 'The job and rules for this request only; send it every time', 'n/a'],
        ['input', 'A string, or a list of messages with roles such as user and assistant', 'output: a list of items (a message, or later a tool call)'],
        ['max_output_tokens', 'A ceiling on everything the model generates, including tokens you never see', 'status: completed, or incomplete with a reason'],
        ['n/a', 'n/a', 'output_text: the SDK\'s shortcut for the answer text'],
        ['n/a', 'n/a', 'usage: input_tokens and output_tokens (lesson 20)'],
      ], caption: 'The left column is what you control. Look at the last column: a good program reads status and output, not only the text.' },
      { type: 'paragraph', text: `Three habits make the call trustworthy. First, **read the status**. If it is \`incomplete\`, the answer was cut off, and \`incomplete_details.reason\` says why, for example \`max_output_tokens\`. Because the limit counts every token the model generates, including some you do not see, leave headroom: a ceiling that seems generous for the visible text may be too small. Second, **treat the text as untrusted**. \`output_text\` is a convenience the SDK builds for you; the real result is the \`output\` list, whose items can be a message, a refusal inside a message or, in module 4, a function call. Third, **catch the SDK's errors by class**, not by reading messages: authentication problems, rate limits and network failures each have their own exception (lesson 23 covers them in full).` },
      { type: 'paragraph', text: `Continue a conversation the way lesson 17 showed: keep a list of messages and pass it as \`input\`. OpenAI also lets a request refer to an earlier response, but the baseline in this course keeps the history in your own code, because then you decide what is sent and stored. Note that \`instructions\` applies only to the request it is in, so you send it each time.` },
      { type: 'paragraph', text: `One more choice: the older **Chat Completions** API still exists and many tutorials use it. It takes \`messages\` and returns \`choices\`. Both work, and you may meet either in other people's code. This course uses Responses, because OpenAI's own guide recommends it for new projects.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: you send the model a question and some rules, and it sends back an answer plus a note saying whether it finished. The code below does that in a function called \`ask\`. \`MODEL\` holds the model's name in one place. \`client = OpenAI()\` makes the connection and picks up your secret key from the environment, so the key is never written in the file. Inside \`ask\`, the call sends the rules (\`instructions\`), the question (\`input\`) and a size limit. If the answer was cut off, the function says so instead of returning half a sentence. The bottom part reads your question from the command line and prints the answer, or a friendly message if the key is wrong or the internet is down.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Two details matter in production. The first-request latency can be higher when you use a new structured-output schema, and a reasoning model's hidden tokens make both latency and the output ceiling less predictable than the visible text suggests, so log usage and status on every call. Second, SDKs retry some failures for you by default; if you add your own retry layer (lesson 23) you must turn the SDK's off or you get nested retries. Keep one thin function, like \`ask\`, as the only place your code calls the vendor, so changing the model, adding tracing or switching vendor touches one file.` },
      { type: 'version', text: 'Checked against the OpenAI quickstart, text guide, structured-outputs guide and the openai-python and openai-node READMEs: the packages are `openai` (pip and npm), the client reads OPENAI_API_KEY, and `client.responses.create` takes `model`, `instructions`, `input` and `max_output_tokens`. `output_text` is an SDK helper. The docs use the model id gpt-6.2-astra in examples; model ids change, so read the current OpenAI models page. SDK versions change too: check the installed version if a name here does not exist.', checked: CHECKED, sources: [DOCS.openaiQuickstart, DOCS.openaiText, DOCS.openaiStructured, DOCS.openaiPython, DOCS.openaiNode] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `Install the SDK with \`pip install openai\`, set \`OPENAI_API_KEY\` in your shell (lesson 22 shows the safe way), and save this as \`ask_openai.py\`. Use a current model id from the OpenAI models page by setting \`AGENT_MODEL\` if the default has been retired.` },
      { type: 'code', language: 'python', label: 'Python: ask_openai.py', code: `# ask_openai.py: one question to an OpenAI model with the Responses API.
# Install: pip install openai      Set OPENAI_API_KEY in your environment first.
import os
import sys

import openai
from openai import OpenAI

# Model names change. Use a current id from the OpenAI models page.
MODEL = os.environ.get("AGENT_MODEL", "gpt-6.2-astra")
INSTRUCTIONS = (
    "You are the assistant of Mika's Bike Shop in Naga City. "
    "Answer in two short sentences. If you do not know, say so."
)

client = OpenAI()  # reads OPENAI_API_KEY from the environment


def ask(question):
    response = client.responses.create(
        model=MODEL,
        instructions=INSTRUCTIONS,
        input=question,
        max_output_tokens=400,  # a ceiling, with headroom: it counts every generated token
    )
    if response.status == "incomplete":
        return f"[cut off: {response.incomplete_details.reason}]"
    return response.output_text


if __name__ == "__main__":
    question = " ".join(sys.argv[1:]) or "Do you repair e-bikes?"
    try:
        print(ask(question))
    except openai.AuthenticationError:
        print("The key was rejected (401). Check OPENAI_API_KEY.")
    except openai.APIConnectionError:
        print("Could not reach the server. Check your network.")` },
      { type: 'paragraph', text: `The same call in TypeScript. Install with \`npm install openai\` and run it with a recent Node (tested here on Node 22, which can run a TypeScript file that uses only type annotations; if yours cannot, compile it with the TypeScript compiler first):` },
      { type: 'code', language: 'typescript', label: 'TypeScript: askOpenai.ts', code: `// askOpenai.ts: the same call in TypeScript. Install: npm install openai
// Run with a recent Node (tested on Node 22): node askOpenai.ts   (OPENAI_API_KEY must be set)
import OpenAI from "openai";

const MODEL = process.env.AGENT_MODEL ?? "gpt-6.2-astra";
const INSTRUCTIONS =
  "You are the assistant of Mika's Bike Shop in Naga City. " +
  "Answer in two short sentences. If you do not know, say so.";

const client = new OpenAI(); // reads OPENAI_API_KEY

async function ask(question: string): Promise<string> {
  const response = await client.responses.create({
    model: MODEL,
    instructions: INSTRUCTIONS,
    input: question,
    max_output_tokens: 400,
  });
  return response.output_text;
}

const question = process.argv.slice(2).join(" ") || "Do you repair e-bikes?";
try {
  console.log(await ask(question));
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    console.log(\`API error \${err.status}\`);
  } else {
    throw err;
  }
}` },
      { type: 'paragraph', text: `**No key yet?** Keep your Python file, and replace the line \`client = OpenAI()\` with the two lines below. The rest of the code runs unchanged against the ScriptedModel from lesson 17, because it has the same \`responses.create\` call. It is a stand-in, so what you learn is the shape of your code, not how a real model answers.` },
      { type: 'code', language: 'python', label: 'No-key variant (fragment: replaces one line)', code: `from scripted_model import ScriptedModel

client = ScriptedModel(["Yes, we repair e-bikes. Please bring it in."])` },
      { type: 'paragraph', text: `Read the Python in order. \`MODEL\` and \`INSTRUCTIONS\` are constants, so you change them in one place. \`client.responses.create(...)\` sends the request. The check on \`response.status\` turns a cut-off answer into a clear message. \`response.output_text\` is returned only when the answer finished. In the \`__main__\` part, each \`except\` names an SDK exception class, so a wrong key and a lost connection each get their own message.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model\'s wording will differ)', code: `$ python ask_openai.py "Do you repair e-bikes?"
<two short sentences of text from the model>

# What the program reads from the response:
#   response.status       -> "completed"
#   response.output_text  -> a string
# If the ceiling is too low:
[cut off: max_output_tokens]

# With the no-key variant (real, from the ScriptedModel):
Yes, we repair e-bikes. Please bring it in.` },
      { type: 'list', items: [
        'If you see "openai.OpenAIError: Missing credentials", the SDK found no key. Set OPENAI_API_KEY in the same terminal where you run the script, or load your .env file (lesson 22). The exact wording may differ between SDK versions.',
        'If you get AuthenticationError (HTTP 401), the key is wrong, revoked or from a different account. Create a new key and replace it.',
        'If you get NotFoundError (404) or BadRequestError (400) that names the model, the model id is wrong or retired. Copy a current id from the models page into AGENT_MODEL.',
        'If you get "[cut off: max_output_tokens]", raise max_output_tokens. The ceiling counts every token the model generates.',
        'If Python says it cannot import OpenAI from openai, check that your own file is not named openai.py, and that you ran pip install openai in the same Python you are using.',
        'If you get RateLimitError (HTTP 429), you are sending too fast or have run out of allowance. Lesson 23 shows how to wait and retry.',
      ] },
      { type: 'warning', text: 'The key is a secret that spends money. Never paste it into the code, a chat, a screenshot or a repository. The text in `input` is sent to OpenAI, so do not include customers\' private details until you have read the data terms. Keep max_output_tokens set, so one bad request cannot run on and cost you more than you planned.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: run the script with three questions about Mika\'s shop, and change `INSTRUCTIONS` to change the tone.',
        'Next lesson, "Connecting to Anthropic Claude Models", makes the same call to Claude and compares the two side by side.',
        'Read the OpenAI quickstart and the migration guide, and note the one line on why Responses is recommended.',
      ] },
      { type: 'takeaways', items: [
        'OpenAI recommends the Responses API for new projects; the call is client.responses.create with model, instructions, input and a token ceiling.',
        'The SDK reads OPENAI_API_KEY from the environment, so the key never needs to be in your code.',
        'Check response.status before using the text: an incomplete response is a cut-off answer, not a finished one.',
        'output_text is a convenience; the real result is the output list, which can hold refusals and tool calls.',
        'Catch the SDK\'s exception classes, and keep one thin function as the only place your code calls the vendor.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-18-code-challenge-1',
          kind: 'code-challenge',
          title: 'Find a refusal in the output list',
          prompt: 'A response has an `output` list. Each item has a `type`. A message item has a `content` list, and one of its parts may have type `refusal` with the text in `refusal`. Write `findRefusal(response)`: return the refusal text of the first refusal part, or `null` if there is none. Skip items whose type is not `message`. (The responses here are hand-written objects; no model is called.)',
          concept: 'reading the output list instead of assuming text',
          language: 'javascript',
          starter: `function findRefusal(response) {
  // look at each item in response.output
  return null;
}`,
          solution: `function findRefusal(response) {
  for (const item of response.output) {
    if (item.type !== 'message') {
      continue;
    }
    for (const part of item.content) {
      if (part.type === 'refusal') {
        return part.refusal;
      }
    }
  }
  return null;
}`,
          tests: {
            kind: 'function',
            fn: 'findRefusal',
            cases: [
              { label: 'a normal answer', args: [{ output: [{ type: 'message', content: [{ type: 'output_text', text: 'Hello' }] }] }], expected: null },
              { label: 'a refusal', args: [{ output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'I cannot help with that.' }] }] }], expected: 'I cannot help with that.' },
              { label: 'a tool call item comes first', args: [{ output: [{ type: 'function_call', name: 'lookup' }, { type: 'message', content: [{ type: 'refusal', refusal: 'No.' }] }] }], expected: 'No.' },
              { label: 'no items at all', args: [{ output: [] }], expected: null, hidden: true },
            ],
          },
          hints: [
            'Loop over `response.output`. Items that are not messages have no `content`, so skip them with `continue`.',
            'Inside a message, loop over `item.content` and look at each part\'s `type`.',
            'When a part has type `refusal`, return `part.refusal` immediately. Return `null` after the loops.',
          ],
          explanation: 'A refusal is a normal result that does not follow your schema or expected text, so it needs its own branch. Looping over the output list and checking each type is safer than assuming the first item is text.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-18-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the call',
          prompt: 'Fill the three blanks so the call uses the Responses API, sends the rules in the right field and prints the answer text.',
          concept: 'the shape of a Responses API call',
          language: 'text',
          code: `response = client.___.create(
    model=MODEL,
    ___=INSTRUCTIONS,
    input=question,
    max_output_tokens=400,
)
print(response.___)`,
          blanks: [
            { answers: ['responses'], feedback: 'The Responses API is reached through client.responses. "messages" belongs to Anthropic\'s API and the older chat completions call.' },
            { answers: ['instructions'], feedback: 'In the Responses API the rules go in `instructions`. `system` is Anthropic\'s name for it.' },
            { answers: ['output_text'], feedback: '`output_text` is the SDK shortcut for the answer text. `choices` belongs to the older Chat Completions result.' },
          ],
          bank: ['responses', 'instructions', 'output_text', 'messages', 'system', 'choices'],
          hints: [
            'The first blank is the part of `client` that holds the Responses API.',
            'The second blank is the name of the field for the model\'s job and rules.',
            'The last blank is the shortcut on the response that holds the answer text.',
          ],
          explanation: 'client.responses.create takes `instructions` and `input`, and the result offers `output_text` as a shortcut. The other words in the bank belong to Anthropic\'s API or to the older Chat Completions API.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-18-scenario-1',
          kind: 'scenario',
          title: 'The blank answer',
          prompt: 'Choose what the developer should do.',
          concept: 'checking status and the output ceiling',
          situation: 'Mika\'s assistant prints an empty reply to a simple question. There is no exception. A teammate prints the response and sees status "incomplete" with reason "max_output_tokens". The code sets max_output_tokens to 20.',
          options: [
            { text: 'Raise max_output_tokens to leave headroom, and make the code return a clear message when status is "incomplete" instead of an empty string.', consequence: 'The answer appears, and if the ceiling is ever too low again the log and the user see a cut-off message rather than silence.', quality: 'best' },
            { text: 'Raise max_output_tokens only, and leave the code as it is.', consequence: 'The immediate problem goes away. A later cut-off will again look like an empty reply, and nobody will know why.', quality: 'acceptable' },
            { text: 'Retry the same request three times in a loop until some text comes back.', consequence: 'Every retry hits the same ceiling, so all three calls fail the same way and cost tokens each time.', quality: 'poor' },
            { text: 'Switch to a different vendor, because an empty answer means the model is broken.', consequence: 'The same ceiling would cut off an answer from another model, and the real cause stays hidden.', quality: 'poor' },
          ],
          hints: [
            'What does the status field say about why the text is missing?',
            'Retrying an identical request cannot fix a limit that you set yourself.',
            'The best answer fixes the number and also makes the failure visible next time.',
          ],
          explanation: 'The ceiling you set caused the cut-off, so raising it with headroom fixes the cause. Reporting an incomplete status makes any later cut-off visible. Retrying the same request or changing vendor treats a symptom.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-18-q1',
        prompt: 'A script calls the Responses API with max_output_tokens set to 15 and prints response.output_text, which is empty. The call raised no exception. What should you check first?',
        choices: [
          'The status and incomplete_details of the response, since a limit that was reached shows up there.',
          'The network connection, because a dropped connection returns an empty string instead of an error.',
          'The API key, because a wrong key makes the API return an empty answer instead of rejecting it.',
          'The model id, because an unknown model id makes the API answer with an empty message.',
        ],
        answer: 0,
        explanation: 'A reached output ceiling is reported in the response itself as status "incomplete". A lost connection, a bad key and an unknown model each raise an exception, not an empty answer.',
      },
      {
        id: 'building-ai-agents-18-q2',
        prompt: 'Your code creates the client with `OpenAI()` and no arguments, and it works on your laptop. How does the SDK know your key?',
        choices: [
          'It downloads the key from your OpenAI account the first time it connects, using your computer\'s name.',
          'It uses a shared default key from the SDK, which is why you must keep your calls short.',
          'It reads the OPENAI_API_KEY environment variable that you set outside the code.',
          'It reads a file called key.txt in your project, which is created by pip install.',
        ],
        answer: 2,
        explanation: 'The SDK reads the key from the OPENAI_API_KEY environment variable. That keeps the secret out of your source code and out of version control.',
      },
      {
        id: 'building-ai-agents-18-q3',
        prompt: 'You find a tutorial that uses client.chat.completions.create with messages and reads choices[0].message.content. Your project is new. What is the most accurate decision?',
        choices: [
          'Use it unchanged, because Chat Completions is deprecated and the Responses API is only a beta feature.',
          'Use the Responses API in your own code, since OpenAI recommends it for new projects, and treat the tutorial as the older style that still works.',
          'Avoid both and call the HTTP endpoint directly, since the SDKs are not supported for new projects.',
          'Use both in the same function, so that any failure in one of them is covered by the other.',
        ],
        answer: 1,
        explanation: 'OpenAI\'s migration guide recommends Responses for new projects and says Chat Completions remains supported. So the tutorial is not wrong, but it is not the recommended starting point.',
      },
      {
        id: 'building-ai-agents-18-q4',
        audience: { max: 'beginner' },
        prompt: 'In the lesson\'s code, why is the key not written in the Python file?',
        choices: [
          'Keys are secrets. They are kept in the environment so they are not copied with the code or shared by mistake.',
          'The key is too long to fit on a line in a Python file.',
          'Python cannot read text that looks like a key, so the key must always come from somewhere else, such as a typed prompt.',
        ],
        answer: 0,
        explanation: 'A key in your code can be copied into a repository or a screenshot, and then anyone can spend your money. The environment keeps it outside the code.',
      },
      {
        id: 'building-ai-agents-18-q5',
        audience: { min: 'advanced' },
        prompt: 'In production, a call returns status "completed", but output_text is empty and one item in the message content has type "refusal". What should the agent code do?',
        choices: [
          'Retry the same request until text appears, since a model that refuses once usually answers the second time.',
          'Treat the refusal as its own outcome: do not retry blindly, show a safe message, and log it with the request id.',
          'Parse the empty text as JSON anyway, so that the schema validator reports the problem.',
          'Raise the output ceiling, because a refusal is how the model reports that its limit was too low.',
        ],
        answer: 3,
        explanation: 'A refusal is a normal response that does not follow the expected shape. Retrying the same request is not a plan, and a refusal is not a size problem. It needs its own branch, a safe user message and a log entry.',
      },
    ],
    task: {
      title: 'Make your first call, then break it on purpose',
      minutes: 18,
      steps: [
        'Install the SDK, set OPENAI_API_KEY in your terminal and run ask_openai.py with a question about Mika\'s shop. If you have no key, use the no-key variant and note that you saw the shape, not a real answer.',
        'Move the model id into the AGENT_MODEL variable and run again with the default, to check that your code does not hide the model name.',
        'Change it and observe: set max_output_tokens to 16 and run again. What does the program print? Then set it back with headroom.',
        'Change the model id to a name that does not exist. Which exception class do you see, and what does the message say?',
        'Write two sentences: which of your checks would have caught Dennis\'s empty reply, and what would you add before sending this to a customer?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If the first run fails, copy the last line of the error into an assistant and ask what it means. Compare its answer with the troubleshooting list above and with the docs before you change anything.'] },
      { audience: { min: 'advanced' }, steps: ['Wrap ask() so it returns an object with text, status, usage, request id and elapsed time, and log it as one JSON line without the input text. Decide what a failed call returns, and write a test that uses a ScriptedModel to produce an incomplete status.'] },
    ],
  },
  {
    id: 'building-ai-agents-19',
    day: 19,
    title: 'Connecting to Anthropic Claude Models',
    summary: 'Make the same call to a Claude model, then compare the two APIs to see what is shared by LLM APIs and what is one vendor\'s own feature.',
    intro: {
      objectives: [
        'Install the Anthropic SDK and make a call with the Messages API in Python and TypeScript',
        'Read the text blocks, the stop reason and the usage from a Claude response',
        'Sort the parts of the OpenAI and Claude calls into what is shared and what belongs to one vendor',
      ],
      why: 'Agents that can talk to more than one vendor are easier to test, cheaper to move and safer when one service has a bad day. Knowing which parts are general lets you write code that survives a change of vendor.',
    },
    minutes: 22,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `You have now made a call to one vendor. Which parts of that code were about LLMs in general, and which were only about OpenAI? You find out by writing the same call for a second vendor. This lesson makes the call to Anthropic's Claude models, and then puts the two side by side.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dennis's cousin Rico runs a tire shop and uses a Claude model. Dennis copied his own \`ask\` function, changed the client to Anthropic's and ran it. Python stopped at once with an error about an unexpected argument, because the field called \`instructions\` does not exist in this API. He renamed it and tried again. The next failure said that \`max_tokens\` was missing, because this API requires it on every call. Then his code crashed reading \`output_text\`, an attribute the response does not have. Three small differences cost him half an hour. None of them was hard, but each one had been invisible while he used only one vendor.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Install the SDK with \`pip install anthropic\` (Python 3.10 or later) or \`npm install @anthropic-ai/sdk\`. It reads your key from the environment variable \`ANTHROPIC_API_KEY\`, so you create the client with no arguments. The call is \`client.messages.create(...)\`, the **Messages API**. You send the model id, a required \`max_tokens\`, an optional \`system\` text with the rules, and a \`messages\` list of \`user\` and \`assistant\` turns. Like OpenAI's, it is stateless, so you resend the history.` },
      { type: 'paragraph', text: `The response is different in shape. Its \`content\` is a list of **content blocks**, each with a \`type\`. A plain answer has one block of type \`text\`, and you read it with \`block.text\`; there is no \`output_text\` shortcut in the examples you will use, so you join the text blocks yourself. Later, a block can also be a \`tool_use\` request (module 4). The response also has a \`stop_reason\` saying why the model stopped, and \`usage\` with \`input_tokens\` and \`output_tokens\`.` },
      { type: 'paragraph', text: `The docs list these stop reasons: \`end_turn\` (the model finished), \`max_tokens\` (your ceiling was reached, so the answer is cut off), \`stop_sequence\`, \`tool_use\` (the model wants your code to run a tool), \`pause_turn\`, \`refusal\` and \`model_context_window_exceeded\`. Your code should read the stop reason every time, for the same reason Dennis learned to read OpenAI's status.` },
      { type: 'paragraph', text: `Now the comparison. The first table lists ideas that both APIs share, with each vendor's name for them. If you design your agent around the idea, a change of vendor means changing a name, not a design.` },
      { type: 'table', headers: ['Shared idea', 'OpenAI (Responses API)', 'Claude (Messages API)'], rows: [
        ['Rules for the model', 'instructions', 'system'],
        ['The conversation', 'input: a string or a list with roles', 'messages: a list with roles user and assistant'],
        ['A ceiling on the answer', 'max_output_tokens (optional)', 'max_tokens (required)'],
        ['The answer text', 'output_text (SDK helper) or the output items', 'text blocks inside content'],
        ['Why it stopped', 'status, and incomplete_details.reason', 'stop_reason'],
        ['Tokens used', 'usage.input_tokens and usage.output_tokens', 'usage.input_tokens and usage.output_tokens'],
        ['Errors', 'APIStatusError and subclasses such as RateLimitError', 'APIStatusError and subclasses such as RateLimitError'],
        ['Your key', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY'],
      ], caption: 'These ideas are shared. Look at the names in each column: the same job, a different word. Both APIs are stateless, so both need you to resend the history.' },
      { type: 'paragraph', text: `The second table lists things that are **one vendor's own features or choices**. Do not assume the other vendor has them under another name. Check each vendor's docs for each one before you build on it.` },
      { type: 'table', headers: ['Specific to one vendor', 'Whose, and what to remember'], rows: [
        ['max_tokens is required on every call', 'Anthropic\'s Messages API. OpenAI\'s Responses API has an optional ceiling.'],
        ['An embeddings endpoint in the same SDK', 'OpenAI offers one. The Claude docs say Anthropic does not offer its own embedding model and point to other providers (module 5).'],
        ['HTTP 529 "overloaded_error"; a spend-limit 429 with no retry-after header', 'Named in the Claude errors and rate-limit docs. OpenAI documents its own 429 "slow_down" case.'],
        ['Which models allow forced tool use', 'A property of particular Claude models, not of the API: some current ones return a 400 for tool_choice "any" or "tool". It differs by model, even inside one vendor.'],
        ['The tool definition field names', 'OpenAI uses parameters inside a function item; Claude uses input_schema (module 4). The idea, a name, a description and a JSON Schema, is shared.'],
      ], caption: 'Two kinds of difference appear here: a vendor\'s API design (first rows) and a model\'s own capability (the forced tool use row). Keep both in mind when you swap one for the other.' },
      { type: 'paragraph', text: `The practical rule: keep the vendor-specific names inside one small function (as \`ask\` did), and let the rest of your agent use your own small result: text, a reason it stopped, and token counts. Lesson 20 builds that result.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: calling Claude is the same as calling OpenAI, but the forms have different boxes. In the code below, \`SYSTEM\` holds the rules and \`messages\` holds the question. \`max_tokens\` is a required box that says how long the answer may be. The answer arrives as a list of pieces called blocks, so the code joins the pieces that are text into one string with \`"".join(...)\`. Before that, it checks \`stop_reason\`; if it says \`max_tokens\`, the answer was cut off and the function says so. The two \`except\` lines at the bottom handle a wrong key and a lost connection with a plain message.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Differences in structure, not only in names, are what hurt when you swap vendors: a response that is a list of typed blocks instead of a single text, a required ceiling, different stop signals, different error taxonomies and, later, different tool and structured-output mechanics. Model behaviour also differs inside one vendor (the forced tool use limit above is one example), so a vendor swap or a model upgrade needs your stored test cases, not a rename. A thin adapter that returns your own result type, plus a fixed evaluation set run against each adapter, is the cheapest way to keep the option of changing vendor open.` },
      { type: 'version', text: 'Checked against the Claude Python SDK page, the models overview, the stop-reasons page and the errors page: the package is `anthropic` (pip) or `@anthropic-ai/sdk` (npm), the client reads ANTHROPIC_API_KEY, `client.messages.create` requires `max_tokens`, and the model ids listed are claude-fable-5-2, claude-opus-5-5, claude-sonnet-5-5 and claude-haiku-5-5 (the course default is claude-opus-5-5). The docs say some current models do not support forced tool use. SDK major versions pin an API version, and model names change: read the current pages.', checked: CHECKED, sources: [DOCS.claudePython, DOCS.claudeModels, DOCS.claudeStops, DOCS.claudeErrors] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `Install with \`pip install anthropic\`, set \`ANTHROPIC_API_KEY\` in your shell, and save this as \`ask_claude.py\`. It reads the model id from \`AGENT_MODEL\`; if you also used that variable for an OpenAI id in lesson 18, set it again for the Claude id you use.` },
      { type: 'code', language: 'python', label: 'Python: ask_claude.py', code: `# ask_claude.py: one question to a Claude model with the Messages API.
# Install: pip install anthropic     Set ANTHROPIC_API_KEY in your environment first.
import os
import sys

import anthropic

# Model names change. Use a current id from the Claude models overview.
MODEL = os.environ.get("AGENT_MODEL", "claude-opus-5-5")
SYSTEM = (
    "You are the assistant of Mika's Bike Shop in Naga City. "
    "Answer in two short sentences. If you do not know, say so."
)

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment


def ask(question):
    message = client.messages.create(
        model=MODEL,
        max_tokens=400,  # required by this API
        system=SYSTEM,
        messages=[{"role": "user", "content": question}],
    )
    if message.stop_reason == "max_tokens":
        return "[cut off: raise max_tokens]"
    return "".join(block.text for block in message.content if block.type == "text")


if __name__ == "__main__":
    question = " ".join(sys.argv[1:]) or "Do you repair e-bikes?"
    try:
        print(ask(question))
    except anthropic.AuthenticationError:
        print("The key was rejected (401). Check ANTHROPIC_API_KEY.")
    except anthropic.APIConnectionError:
        print("Could not reach the server. Check your network.")` },
      { type: 'code', language: 'typescript', label: 'TypeScript: askClaude.ts', code: `// askClaude.ts: the same call in TypeScript. Install: npm install @anthropic-ai/sdk
// Run with a recent Node (tested on Node 22): node askClaude.ts   (ANTHROPIC_API_KEY must be set)
import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.AGENT_MODEL ?? "claude-opus-5-5";
const SYSTEM =
  "You are the assistant of Mika's Bike Shop in Naga City. " +
  "Answer in two short sentences. If you do not know, say so.";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

async function ask(question: string): Promise<string> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: SYSTEM,
    messages: [{ role: "user", content: question }],
  });
  let text = "";
  for (const block of message.content) {
    if (block.type === "text") text += block.text;
  }
  return text;
}

const question = process.argv.slice(2).join(" ") || "Do you repair e-bikes?";
try {
  console.log(await ask(question));
} catch (err) {
  if (err instanceof Anthropic.APIError) {
    console.log(\`API error \${err.status}\`);
  } else {
    throw err;
  }
}` },
      { type: 'paragraph', text: `**No key yet?** Add this second stand-in class to the bottom of your \`scripted_model.py\` from lesson 17. It returns replies in the shape of a Claude Messages result. Then replace the line \`client = anthropic.Anthropic()\` in \`ask_claude.py\` with the two lines under it. Again, it is a teaching stand-in, not a model.` },
      { type: 'code', language: 'python', label: 'Add to scripted_model.py (fragment: a second class)', code: `class ScriptedClaude:
    """The same idea in the shape of an Anthropic Messages result."""

    def __init__(self, replies):
        self.replies = list(replies)
        self.calls = []
        self.messages = self  # lets you write client.messages.create(...)

    def create(self, *, model, max_tokens, messages, system=None, **options):
        self.calls.append({"model": model, "messages": list(messages), "system": system})
        if not self.replies:
            raise RuntimeError("ScriptedClaude has no more prepared replies")
        text = self.replies.pop(0)
        sent = " ".join(str(m["content"]) for m in messages)
        usage = SimpleNamespace(input_tokens=len(sent.split()), output_tokens=len(text.split()))
        return SimpleNamespace(content=[SimpleNamespace(type="text", text=text)], stop_reason="end_turn", usage=usage)` },
      { type: 'code', language: 'python', label: 'No-key variant (fragment: replaces one line)', code: `from scripted_model import ScriptedClaude

client = ScriptedClaude(["Yes, we repair e-bikes. Please bring it in."])` },
      { type: 'paragraph', text: `Read it in order. \`client.messages.create\` sends the request; \`max_tokens\`, \`system\` and \`messages\` are the three fields that differ from OpenAI. The check on \`stop_reason\` catches a cut-off answer. The \`join\` keeps only blocks whose type is \`text\`, so a later \`tool_use\` block would not be mixed into the answer text. The TypeScript does the same with a loop and a type check on \`block.type\`.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (the shape; the model\'s wording will differ)', code: `$ python ask_claude.py "Do you repair e-bikes?"
<two short sentences of text from the model>

# What the program reads from the response:
#   message.stop_reason  -> "end_turn"
#   message.content      -> a list; the text is in blocks whose type is "text"
#   message.usage        -> input_tokens and output_tokens
# If the ceiling is too low:
[cut off: raise max_tokens]

# With the no-key variant (real, from the ScriptedClaude):
Yes, we repair e-bikes. Please bring it in.` },
      { type: 'list', items: [
        'If you see an error about an unexpected argument "instructions", you copied the OpenAI call. This API uses `system`.',
        'If the error says max_tokens is required or missing, add max_tokens to the call. This API does not guess a ceiling for you.',
        'If you get AuthenticationError (HTTP 401), the key is wrong or missing. Check ANTHROPIC_API_KEY in the same terminal.',
        'If you get NotFoundError (404) or BadRequestError (400) mentioning the model, the model id is wrong or retired. Copy a current one from the models overview.',
        'If your code crashes on `.text`, you read a block that is not text, such as a tool request. Check `block.type == "text"` first, as the code does.',
        'If you get RateLimitError (429) or an overloaded error (529), wait and retry; lesson 23 shows how.',
      ] },
      { type: 'warning', text: 'The same rules as before apply to a different vendor. Keep ANTHROPIC_API_KEY out of your code and your repository, never expose it in code that runs in a browser, and set max_tokens so one bad request cannot run long. Everything in `messages` and `system` is sent to Anthropic, so do not include customers\' private details until you have read the data terms.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: send the same three shop questions to both vendors (or both stand-ins) and write down every difference you see in the response.',
        'Next lesson, "Understanding Model Inputs and Outputs", builds one result type that both responses map to.',
        'Read the Claude Python SDK page and find the section on errors and on `max_retries`.',
      ] },
      { type: 'takeaways', items: [
        'The Messages API takes model, a required max_tokens, system and messages; the answer is a list of content blocks.',
        'Read stop_reason every time: max_tokens means a cut-off answer, end_turn means it finished.',
        'Shared ideas (rules, messages with roles, a ceiling, a stop signal, usage, HTTP error classes) have different names in each vendor.',
        'Some features belong to one vendor or even one model, such as the required ceiling, the embeddings choice and forced tool use.',
        'Keep vendor-specific names inside one small function so the rest of the agent does not change when the vendor does.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-19-match-1',
          kind: 'match',
          title: 'Same idea or one vendor\'s feature?',
          prompt: 'Match each situation to what it shows about LLM APIs.',
          concept: 'shared ideas versus vendor-specific features',
          labels: { terms: 'Situation', meanings: 'What it shows' },
          pairs: [
            { term: 'Both calls need the conversation resent on every request', definition: 'A shared idea: the APIs are stateless' },
            { term: 'One call needs max_tokens or it is rejected; the other does not', definition: 'A design choice of one vendor\'s API' },
            { term: 'Forced tool use returns a 400 on some current Claude models', definition: 'A capability of particular models, not of the API' },
            { term: 'The answer is read from output_text in one SDK and from text blocks in the other', definition: 'A shared idea with different names and shapes' },
          ],
          hints: [
            'Ask whether both vendors do the thing, and whether the difference is a name or a real capability.',
            'Two of the situations are about one vendor only; one of those is about a model, not about the API.',
            'Statelessness is true for both, so it is the shared idea.',
          ],
          explanation: 'Statelessness and "answer text somewhere in the response" are shared; the names and shapes differ. A required ceiling is an API design choice, and forced tool use depends on the particular model.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-19-code-challenge-1',
          kind: 'code-challenge',
          title: 'Join only the text blocks',
          prompt: 'A Claude response has a `content` list of blocks. Write `joinText(content)`: return the `text` of every block whose `type` is `"text"`, joined together in order (no separator). Ignore all other blocks, such as `tool_use`. Return an empty string when there is no text. (Hand-written data; no model is called.)',
          concept: 'reading content blocks',
          language: 'javascript',
          starter: `function joinText(content) {
  let text = '';
  // add the text of each text block
  return text;
}`,
          solution: `function joinText(content) {
  let text = '';
  for (const block of content) {
    if (block.type === 'text') {
      text += block.text;
    }
  }
  return text;
}`,
          tests: {
            kind: 'function',
            fn: 'joinText',
            cases: [
              { label: 'one text block', args: [[{ type: 'text', text: 'Hello' }]], expected: 'Hello' },
              { label: 'text, a tool request, then text', args: [[{ type: 'text', text: 'Checking. ' }, { type: 'tool_use', name: 'stock', input: {} }, { type: 'text', text: 'Done.' }]], expected: 'Checking. Done.' },
              { label: 'only a tool request', args: [[{ type: 'tool_use', name: 'stock', input: {} }]], expected: '' },
              { label: 'empty list', args: [[]], expected: '', hidden: true },
            ],
          },
          hints: [
            'Loop over `content` with `for (const block of content)`.',
            'Check `block.type === \'text\'` before reading `block.text`.',
            'Add `block.text` to `text` with `+=` so the pieces stay in order.',
          ],
          explanation: 'A response is a list of typed blocks, so code must check the type before reading text. Joining only text blocks keeps a tool request from leaking into the answer shown to the user.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-19-predict-output-1',
          kind: 'predict-output',
          title: 'What does the stop reason mean?',
          prompt: 'Predict the four lines this prints. (A plain function with fixed inputs: no model is involved.)',
          concept: 'reading stop reasons',
          language: 'javascript',
          code: `function explainStop(reason) {
  if (reason === 'end_turn' || reason === 'stop_sequence') {
    return 'finished';
  }
  if (reason === 'max_tokens') {
    return 'cut off';
  }
  if (reason === 'refusal') {
    return 'refused';
  }
  if (reason === 'tool_use') {
    return 'wants a tool';
  }
  return 'check the docs';
}

const reasons = ['end_turn', 'max_tokens', 'tool_use', 'pause_turn'];
for (const reason of reasons) {
  console.log(explainStop(reason));
}`,
          choices: [
            'finished\ncut off\nwants a tool\ncheck the docs',
            'finished\ncut off\nrefused\ncheck the docs',
            'finished\nfinished\nwants a tool\nrefused',
            'cut off\ncut off\nwants a tool\ncheck the docs',
          ],
          wrongNotes: {
            'finished\ncut off\nrefused\ncheck the docs': 'The third reason is tool_use, which returns "wants a tool". "refused" is only for the refusal reason.',
            'finished\nfinished\nwants a tool\nrefused': 'max_tokens is the cut-off case, and pause_turn is not handled by any of the branches.',
            'cut off\ncut off\nwants a tool\ncheck the docs': 'end_turn is the normal finish, so the first line is "finished".',
          },
          hints: [
            'Go through the four reasons one at a time and follow the first `if` that matches.',
            '`pause_turn` is not named in any branch.',
            'An unmatched reason reaches the final `return`.',
          ],
          explanation: 'end_turn is a normal finish, max_tokens a cut-off, tool_use a tool request, and pause_turn matches nothing, so it falls through to the last line. A real program should treat an unknown reason as something to log and check, not as success.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-19-q1',
        prompt: 'You port a working OpenAI `ask` function to Claude by changing only the client and the method name. Which changes are still needed for it to run?',
        choices: [
          'None: both vendors use the same field names, so only the model id has to change.',
          'Only the key name, because everything else in the request is identical between the two APIs.',
          'Add a messages list and delete the model id, because Claude always chooses the model for you and ignores any name that you send.',
          'Rename instructions to system, add the required max_tokens, and read the text from content blocks instead of output_text.',
        ],
        answer: 3,
        explanation: 'The rules field has a different name, max_tokens is required, and the answer is a list of typed blocks. These are the three differences Dennis hit.',
      },
      {
        id: 'building-ai-agents-19-q2',
        prompt: 'A Claude response has stop_reason "max_tokens" and a half-finished sentence. What does that tell you, and what should the code do?',
        choices: [
          'The model finished, and the sentence is complete in the model\'s own style, so show it as it is.',
          'The ceiling you set was reached, so the answer is cut off. Report it or raise max_tokens before showing it.',
          'The model refused, so the code should rewrite the question and send it again.',
          'The context window overflowed, so the code should delete the system text and send the same request again straight away.',
        ],
        answer: 1,
        explanation: 'max_tokens means your own ceiling stopped the answer. A refusal has its own stop reason, and a context overflow has another one.',
      },
      {
        id: 'building-ai-agents-19-q3',
        prompt: 'Your agent will need embeddings in module 5, and you plan to use Claude for answers. Which statement matches the docs?',
        choices: [
          'Claude\'s SDK has an embeddings method that works like OpenAI\'s, so you can keep one vendor for both.',
          'Embeddings are not possible with Claude, so the agent must use a different language model for answers.',
          'The Claude docs say Anthropic does not offer its own embedding model, so the embeddings vendor is a separate choice.',
          'Embeddings come free with every response in a hidden field that you can read from the usage object.',
        ],
        answer: 2,
        explanation: 'The Claude embeddings page says Anthropic does not offer its own embedding model and points to other providers. You can still use Claude for answers and another vendor for embeddings.',
      },
      {
        id: 'building-ai-agents-19-q4',
        audience: { max: 'beginner' },
        prompt: 'Which of these is true for both the OpenAI and the Claude API calls in this module?',
        choices: [
          'The model remembers earlier requests, so you only need to send the newest message each time.',
          'You must send the earlier messages again, because each request is separate.',
          'The key is written inside the request text so the model can read it.',
        ],
        answer: 1,
        explanation: 'Both APIs are stateless, so your code resends the conversation. The key is read by the SDK from the environment and is never part of the text.',
      },
      {
        id: 'building-ai-agents-19-q5',
        audience: { min: 'advanced' },
        prompt: 'You want your agent to run on either vendor and to survive a model upgrade. Which design is the most robust?',
        choices: [
          'Write the agent against OpenAI\'s field names and rename them in a text replace if you ever move.',
          'Use the intersection of features only, never read stop reasons, and rely on each vendor\'s defaults.',
          'A thin adapter per vendor that returns your own result type, plus a stored evaluation set you run against every adapter and model.',
          'Build one large prompt that contains both vendors\' parameter names so that either API accepts it.',
        ],
        answer: 2,
        explanation: 'An adapter isolates the naming and shape differences, and the evaluation set catches behaviour differences between vendors and between model versions. A text replace or a mixed prompt hides them.',
      },
    ],
    task: {
      title: 'Call both vendors and compare',
      minutes: 20,
      steps: [
        'Run ask_claude.py with a question about Mika\'s shop (or the no-key variant). Do the same with ask_openai.py from lesson 18. Save both outputs.',
        'Make a small table of your own with the rows from the first table above, and fill in what you actually saw: status or stop reason, token numbers, how you read the text.',
        'Change it and observe: remove `system` from the Claude call, and the matching `instructions` from the OpenAI call. How do the answers change in tone or length?',
        'Change max_tokens to a very small number on the Claude call. Which stop reason do you get, and what does your code print?',
        'Write two sentences: which difference between the vendors would be most expensive to find late in a project, and why?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask an assistant to explain the difference between "a block" and "a string" using a shop receipt as the example. Then find the line in ask_claude.py where the blocks become one string.'] },
      { audience: { min: 'advanced' }, steps: ['Write a test that feeds your adapter a ScriptedClaude response with a tool_use block and a max_tokens stop reason, and assert that your result type reports "tool_request" or "cut_off" instead of silently returning partial text. Note which fields you would add for logging.'] },
    ],
  },
  {
    id: 'building-ai-agents-20',
    day: 20,
    title: 'Understanding Model Inputs and Outputs',
    summary: 'Read everything a response gives you (content blocks, stop reasons and usage) and map two vendors into one small result type for your agent.',
    intro: {
      objectives: [
        'Name what goes into a request and what comes back in a response from each vendor',
        'Map stop reasons and statuses onto a few outcomes your agent can act on',
        'Read token usage, including cached tokens, and write a function that normalizes two vendors\' results',
      ],
      why: 'An agent decides what to do next from what the model returns. If your code only reads the text, it will treat cut-off answers, refusals and tool requests as finished work.',
    },
    minutes: 22,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `A model's reply is more than the words you see. What else is in the box, and which parts must an agent read every single time? Answering this gives your agent eyes: it can tell a finished answer from a cut-off one, a refusal from a tool request, and a cheap call from an expensive one.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dennis's assistant sometimes ended a reply in the middle of a sentence, for example, "You can book a repair for Tuesday at 3 and the shop is". He had logged only the text, so the logs showed nothing wrong. He then began recording three more things for each call: why the model stopped, and the tokens in and out. In a test chat of 30 invented customer messages, five replies had been cut off at the output ceiling, and the input tokens of the long chats had grown with every turn because the whole history was resent. Neither fact had been visible in the text. Both changed what he built next: a higher ceiling for repair advice and a plan to trim long histories.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Inputs.** A request holds the model id, the rules (\`instructions\` or \`system\`), the messages and a limit on the answer. A message's content is usually text, but both vendors let you send other kinds of content in a list of typed parts, for example an image. Everything in the request counts as **input tokens**: the rules, the whole history, any tool descriptions and any document you paste in. A **token** is a small piece of text, often a part of a word, that the model reads and writes; you pay for and are limited by tokens, not by characters.` },
      { type: 'paragraph', text: `**Outputs.** A response is a list of typed pieces, because one reply can hold different things: some text, then a request to run a tool. OpenAI calls them \`output\` items. Claude calls them \`content\` blocks. Both give you a stop signal and a usage count. The visual below shows the flow in and out of a model.` },
      { type: 'visual', id: 'ai-model-input-output', caption: 'Look at what goes in (text turned into tokens) and what comes out. Everything your code sends and reads is built from this exchange.' },
      { type: 'paragraph', text: `**Stop reasons.** Why the model stopped decides what your agent does next. Map each vendor's signal onto your own small set of outcomes. The table shows one mapping that the code below uses.` },
      { type: 'table', headers: ['Your outcome', 'OpenAI (Responses)', 'Claude (Messages)', 'What your agent does'], rows: [
        ['done', 'status "completed", no function call', 'stop_reason end_turn or stop_sequence', 'Use the text'],
        ['cut_off', 'status "incomplete"', 'stop_reason max_tokens', 'Raise the ceiling or tell the user; never show it as complete'],
        ['refused', 'a refusal part inside a message', 'stop_reason refusal', 'Show a safe message and log it; do not retry blindly'],
        ['tool_request', 'an output item of type function_call', 'stop_reason tool_use', 'Run the tool (module 4), then call again'],
        ['other', 'anything else', 'pause_turn, model_context_window_exceeded and any new value', 'Log it and stop; do not assume success'],
      ], caption: 'The last row matters most: a value you did not expect should stop your agent and be logged, not be treated as a normal finish.' },
      { type: 'paragraph', text: `**Usage.** Both give \`input_tokens\` and \`output_tokens\` for the call. Two details prevent wrong sums. For OpenAI, output tokens include everything the model generated, including tokens you do not see, so they can be higher than the visible text suggests. For Claude, when you use caching, \`input_tokens\` counts only the tokens after the last cache point, so the total input is \`cache_read_input_tokens\` plus \`cache_creation_input_tokens\` plus \`input_tokens\`. OpenAI reports cached input under \`usage.input_tokens_details.cached_tokens\`. Both vendors also let you count the input of a request before sending it, which helps you stay inside the context window; check each vendor's docs for the call, and count with the model you will actually use, because newer models can use a newer tokenizer.` },
      { type: 'paragraph', text: `The practical method: **normalize at the boundary**. Write one function per vendor that turns its result into your own small \`Reply\` with the text, one of your outcomes and the token counts. The rest of the agent only knows \`Reply\`. Then a new vendor, a renamed field or a new stop reason changes one function, and your tests cover it.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: after you ask a question, the model hands back a parcel. Inside are the answer text, a note on why it stopped writing, and a count of how much it read and wrote (tokens). The code below defines \`Reply\`, a small form with four boxes: text, stop, input_tokens and output_tokens. \`from_openai\` and \`from_anthropic\` each open one vendor's parcel and fill in the same form. The dictionary \`ANTHROPIC_STOPS\` translates Claude's reasons into our words, and \`.get(..., "other")\` means "if I do not know this reason, call it other". At the bottom, two pretend parcels are opened and printed.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Normalisation is also where observability starts: add the request id, the model id, latency and a stop reason to every record, and alert when the share of cut_off or other rises, because that is often the first sign that a prompt grew, a model changed or a limit was set too low. Keep raw responses out of general logs when they may contain user data, and keep usage per step, not per request, so cost can be traced to the step that caused it (lesson 24). Unknown stop values should map to a distinct outcome so that a vendor adding one does not silently become "success".` },
      { type: 'version', text: 'Checked against the Claude stop-reasons and token-counting pages, the Claude rate-limits page (cache token fields) and the OpenAI token-counting and text guides, plus the openai-python usage type: Claude stop reasons are end_turn, max_tokens, stop_sequence, tool_use, pause_turn, refusal and model_context_window_exceeded; OpenAI usage has input_tokens, output_tokens, total_tokens and input_tokens_details.cached_tokens. OpenAI says output_text is a shortcut and not a replacement for inspecting output. Field lists can grow, so read the current pages.', checked: CHECKED, sources: [DOCS.claudeStops, DOCS.claudeTokens, DOCS.claudeRates, DOCS.openaiTokens, DOCS.openaiText] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `This program needs no key. It reads fields from the real SDK objects, and here you test it with stand-in objects made with \`SimpleNamespace\` that have the same field names. Save it as \`normalize.py\`.` },
      { type: 'code', language: 'python', label: 'normalize.py', code: `# normalize.py: turn two vendors' results into one small shape your agent can use.
# It reads fields from the real SDK objects. Here we test it with stand-in objects.
from dataclasses import dataclass
from types import SimpleNamespace as NS


@dataclass
class Reply:
    text: str
    stop: str          # "done", "cut_off", "refused", "tool_request" or "other"
    input_tokens: int
    output_tokens: int


def from_openai(response):
    kinds = {item.type for item in response.output}
    if "function_call" in kinds:
        stop = "tool_request"
    elif response.status == "incomplete":
        stop = "cut_off"
    else:
        stop = "done"
    return Reply(response.output_text, stop, response.usage.input_tokens, response.usage.output_tokens)


ANTHROPIC_STOPS = {"end_turn": "done", "stop_sequence": "done", "max_tokens": "cut_off",
                   "refusal": "refused", "tool_use": "tool_request"}


def from_anthropic(message):
    text = "".join(block.text for block in message.content if block.type == "text")
    stop = ANTHROPIC_STOPS.get(message.stop_reason, "other")
    return Reply(text, stop, message.usage.input_tokens, message.usage.output_tokens)


openai_result = NS(output=[NS(type="message")], output_text="Yes, we repair e-bikes.", status="completed",
                   usage=NS(input_tokens=31, output_tokens=7))
claude_result = NS(content=[NS(type="text", text="Yes, we repair e-bikes.")], stop_reason="max_tokens",
                   usage=NS(input_tokens=29, output_tokens=400))
print(from_openai(openai_result))
print(from_anthropic(claude_result))` },
      { type: 'paragraph', text: `Read it in this order. \`Reply\` is the one shape your agent will use. \`from_openai\` checks for a function call first, then for an incomplete status, otherwise it calls the reply done. \`from_anthropic\` joins the text blocks and translates the stop reason with the dictionary. The two test objects at the bottom stand in for real results: one finished, one cut off at the ceiling. With real clients you would call \`from_openai(client.responses.create(...))\` or \`from_anthropic(client.messages.create(...))\`.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run locally with Python 3)', code: `Reply(text='Yes, we repair e-bikes.', stop='done', input_tokens=31, output_tokens=7)
Reply(text='Yes, we repair e-bikes.', stop='cut_off', input_tokens=29, output_tokens=400)` },
      { type: 'list', items: [
        'If you see AttributeError about a missing field, the real object differs from your stand-in. Print the real response and compare field names; SDK versions change.',
        'If a cut-off Claude reply shows stop "done", the stop reason string in your dictionary does not match. Check the spelling: it is max_tokens.',
        'If your OpenAI function returns "done" while the model asked for a tool, check that you look for the function_call item before the status.',
        'If the token numbers look too small with caching on, add the cache fields as the lesson shows.',
      ] },
      { type: 'warning', text: 'Do not log the whole response while testing with real customer text: it can contain private details. Log the stop outcome, token counts, the model id and a request id, and keep the content out of general logs. Treat the text itself as untrusted data: a model can be wrong, and text taken from a customer or a web page can contain instructions meant for the model.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: add a "refused" test object to normalize.py (a Claude result with stop_reason "refusal") and check the outcome.',
        'Next lesson, "Structured Outputs and JSON Responses", makes the model\'s text follow a schema and validates it before your code uses it.',
        'Read the Claude stop-reasons page and write down what your agent will do for each reason.',
      ] },
      { type: 'takeaways', items: [
        'A response is a list of typed pieces, a stop signal and a usage count; the text is only one part.',
        'Map each vendor\'s stop signal onto a few outcomes (done, cut_off, refused, tool_request, other) and treat unknown values as other.',
        'Total input with Claude caching is cache_read_input_tokens plus cache_creation_input_tokens plus input_tokens; OpenAI output tokens include tokens you do not see.',
        'Normalize at the boundary: one small function per vendor that returns your own Reply, so the rest of the agent never changes.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-20-code-challenge-1',
          kind: 'code-challenge',
          title: 'Total input tokens with caching',
          prompt: 'A Claude `usage` object has `input_tokens`, and may also have `cache_read_input_tokens` and `cache_creation_input_tokens` (either can be missing). Write `totalInputTokens(usage)`: return the sum of all three, treating a missing field as 0. (Hand-written objects; no model is called.)',
          concept: 'reading usage with cached tokens',
          language: 'javascript',
          starter: `function totalInputTokens(usage) {
  let total = usage.input_tokens;
  // add the cache fields when they exist
  return total;
}`,
          solution: `function totalInputTokens(usage) {
  const read = usage.cache_read_input_tokens || 0;
  const created = usage.cache_creation_input_tokens || 0;
  return read + created + usage.input_tokens;
}`,
          tests: {
            kind: 'function',
            fn: 'totalInputTokens',
            cases: [
              { label: 'no cache fields', args: [{ input_tokens: 25, output_tokens: 13 }], expected: 25 },
              { label: 'a cache read', args: [{ input_tokens: 20, cache_read_input_tokens: 900, cache_creation_input_tokens: 0 }], expected: 920 },
              { label: 'a cache write', args: [{ input_tokens: 10, cache_creation_input_tokens: 300 }], expected: 310 },
              { label: 'all three', args: [{ input_tokens: 5, cache_read_input_tokens: 50, cache_creation_input_tokens: 40 }], expected: 95, hidden: true },
            ],
          },
          hints: [
            'A field that is missing is `undefined`, and adding it would give NaN. Use `|| 0` to turn it into 0.',
            'Read each cache field into its own constant, with `|| 0`.',
            'Return the three numbers added together.',
          ],
          explanation: 'With caching, `input_tokens` counts only what comes after the last cache point, so the real total needs the two cache fields as well. Treating a missing field as 0 keeps the function safe when caching is off.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-20-fix-bug-1',
          kind: 'fix-bug',
          title: 'A cut-off answer called done',
          prompt: 'This table translates a Claude stop reason into your outcome. A reply that hit the output ceiling is being reported as "done", so the cut-off sentence reaches a customer. Fix the one wrong line. (Plain JavaScript with fixed data: no model is called.)',
          concept: 'mapping stop reasons to outcomes',
          language: 'javascript',
          code: `const STOPS = {
  end_turn: 'done',
  stop_sequence: 'done',
  max_tokens: 'done',
  refusal: 'refused',
  tool_use: 'tool_request',
};

function toOutcome(reason) {
  return STOPS[reason] || 'other';
}`,
          bugLine: 4,
          fixes: [
            { line: `  max_tokens: 'cut_off',`, correct: true, why: 'max_tokens means the ceiling stopped the model, so the answer is incomplete and must be reported as cut off.' },
            { line: `  max_tokens: 'other',`, correct: false, why: '"other" is for values you did not expect. max_tokens is a known reason with a clear meaning, so it needs its own outcome.' },
            { line: `  max_tokens: 'refused',`, correct: false, why: 'The model did not refuse; your ceiling stopped it. Refusals have their own stop reason.' },
          ],
          tests: {
            kind: 'function',
            fn: 'toOutcome',
            cases: [
              { label: 'finished', args: ['end_turn'], expected: 'done' },
              { label: 'ceiling reached', args: ['max_tokens'], expected: 'cut_off' },
              { label: 'unknown value', args: ['something_new'], expected: 'other' },
              { label: 'tool request', args: ['tool_use'], expected: 'tool_request', hidden: true },
            ],
          },
          hints: [
            'Which entry gives the wrong outcome for a reply that was stopped by your own ceiling?',
            'The wrong entry is the one for `max_tokens`. Its outcome should say the answer is incomplete.',
            'The outcome name used elsewhere in the lesson for this case is `cut_off`.',
          ],
          explanation: 'A table of outcomes is only useful if each known reason gets the right meaning. Calling a truncated answer "done" is the exact silent failure Dennis found in his logs.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-20-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'Four things to read from every response',
          prompt: 'Tap each card to see what it protects you from.',
          concept: 'what an agent must read from a response',
          cards: [
            { front: 'The stop signal', back: 'It separates a finished answer from a cut-off one, a refusal and a tool request. Without it, all four look like "some text".' },
            { front: 'The content pieces, not only the text', back: 'A reply can hold text and a tool request together. Reading only one place can hide the other.' },
            { front: 'Input and output tokens', back: 'They show what each call used. Input grows with history, and output can include tokens you never see.' },
            { front: 'An outcome you did not expect', back: 'Map it to "other", log it and stop. A new value from a vendor should never quietly count as success.' },
          ],
          hints: [
            'For each card, imagine the agent ignoring it. What would go wrong, and when would you notice?',
            'Two cards are about meaning, one about cost and one about surprises.',
            'The last card is about what to do when your table has no row for the value.',
          ],
          explanation: 'Each field guards a different failure: cut-off or refused answers, hidden tool requests, unexplained cost and silent drift when a vendor changes. Reading all four is cheap and catches problems early.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-20-q1',
        prompt: 'Your agent\'s traffic is flat, but the input tokens per call grow every week. Which explanation fits what you learned, and what do you check first?',
        choices: [
          'The model is writing longer answers, so check the output ceiling and shorten the instructions.',
          'Conversations are getting longer, and the whole history is resent each time, so check how much history each request carries.',
          'The tokenizer changed, so each word is now counted as exactly two tokens in every language.',
          'The stop reason changed to max_tokens, which doubles the input of the next call by design.',
        ],
        answer: 1,
        explanation: 'Because the API is stateless, longer conversations mean longer requests. The size of the history in each request is the first thing to look at. Output length and stop reasons do not change the input count.',
      },
      {
        id: 'building-ai-agents-20-q2',
        prompt: 'A Claude response reports usage input_tokens 20, cache_read_input_tokens 900 and cache_creation_input_tokens 0. How many input tokens did the request use in total?',
        choices: [
          '920, because the cache read tokens are added to the input tokens.',
          '900, because cached tokens replace the ordinary input tokens in the count.',
          '20, because the cache fields only matter for the output.',
          '1,820, because cached tokens are counted twice when read.',
        ],
        answer: 0,
        explanation: 'With caching, input_tokens counts only what is after the last cache point. The total is cache_read plus cache_creation plus input_tokens, which is 900 + 0 + 20.',
      },
      {
        id: 'building-ai-agents-20-q3',
        prompt: 'Your agent prints only the text blocks of a Claude response. For one request the customer sees an empty message. The logged stop_reason is "tool_use". What is happening?',
        choices: [
          'The model failed to answer because its output ceiling was too low, so the code should raise max_tokens and call again.',
          'The model refused the request, so the code should send a different question.',
          'The response is broken, so the call should be repeated until text appears.',
          'The model is asking your code to run a tool and has not written an answer yet. The agent must handle that outcome.',
        ],
        answer: 3,
        explanation: 'tool_use is a request for your code to act (module 4), not a failure. An agent that only prints text will show an empty message unless it handles that stop reason.',
      },
      {
        id: 'building-ai-agents-20-q4',
        audience: { max: 'beginner' },
        prompt: 'Why is it useful to record the number of input and output tokens for each call?',
        choices: [
          'They tell you what the model\'s answer meant, so you can check whether the answer was right or wrong.',
          'They are the password that proves the call was yours.',
          'They show how much each call used, so you can see why some calls are slow or costly.',
        ],
        answer: 2,
        explanation: 'Tokens are the unit that limits and costs are counted in. Recording them per call shows which steps use the most.',
      },
      {
        id: 'building-ai-agents-20-q5',
        audience: { min: 'advanced' },
        prompt: 'A vendor adds a new stop reason next month. Your normalizer uses a dictionary lookup with a default. Which default is safest for an agent?',
        choices: [
          'Map unknown values to a distinct "other" outcome, log them, and stop the agent step instead of continuing.',
          'Map unknown values to "done", so that new values never interrupt users with an error message.',
          'Map unknown values to "cut_off", because most unexpected stops are caused by a limit being reached and need a higher ceiling.',
          'Raise an exception that ends the whole program, since an unknown value means the SDK is broken.',
        ],
        answer: 0,
        explanation: 'An unknown value should be visible and safe: a distinct outcome that is logged and stops the step. Calling it "done" hides a problem, guessing "cut_off" misleads, and crashing the program is more than needed.',
      },
    ],
    task: {
      title: 'Add a refusal and a tool request to the normalizer',
      minutes: 18,
      steps: [
        'Save normalize.py and run it. Check that your output matches the expected output above.',
        'Add a third stand-in object: a Claude result with stop_reason "refusal" and a text block saying it cannot help. Print its Reply and check that stop is "refused".',
        'Add a fourth: an OpenAI result whose output contains an item with type "function_call". Check that stop is "tool_request".',
        'Change it and observe: change the first stand-in\'s status to "incomplete". What outcome do you get, and what should the agent show a customer?',
        'Write one sentence: which of the five outcomes would be most harmful if your agent treated it as "done", and why?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw a small table on paper with the five outcomes. For each one, write what you would want the shop assistant to say to a customer. You can ask an assistant to suggest wording, but make the final choice yourself.'] },
      { audience: { min: 'advanced' }, steps: ['Extend Reply with request_id, model and latency_ms. Add a function that turns a Reply into one JSON log line with no text content, and write a test that checks that no customer text is ever in that line.'] },
    ],
  },
  {
    id: 'building-ai-agents-21',
    day: 21,
    title: 'Structured Outputs and JSON Responses',
    summary: 'Make a model return data your program can use: describe a schema, validate every reply, and retry a limited number of times when it is invalid.',
    intro: {
      objectives: [
        'Describe the shape you want as a schema and validate a reply with Pydantic or zod',
        'Retry on invalid output with the error message, a hard cap and a safe fallback',
        'Explain what a schema guarantees, and what it does not',
      ],
      why: 'Agents act on data, not on paragraphs. A reply that is almost JSON can crash your code or trigger the wrong action, so every agent needs a gate between the model\'s text and the rest of the program.',
    },
    minutes: 24,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `Your program cannot do anything with a friendly paragraph. It needs fields: an intent, an urgency, a yes-or-no flag. How do you get a model to hand you data that your code can trust, and what do you do on the day it hands you something else? This lesson answers both, and it is the last piece you need for project P1.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Dennis asked the model, "Reply with JSON containing intent, urgency, needs_human and reply." In a test of 30 invented customer messages, 27 replies were fine. One began with "Sure! Here is the JSON:" before the braces, so \`json.loads\` raised an error. One had the urgency "urgent" when only low, normal and high were allowed, and the booking code did not know what to do. One left out \`needs_human\` entirely. In the live chat, the first failure showed a customer a Python error. Dennis did not need a smarter model. He needed a gate: parse, check the shape, and if the reply is bad, ask again a limited number of times and then fall back to a person.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**JSON** (JavaScript Object Notation) is a text format for data, with named fields, such as \`{"intent": "repair"}\`. A **schema** describes the shape you accept: which fields exist, their types, and which values are allowed. A reply is **valid** when it parses as JSON and matches the schema. There are three ways to get there, and each needs a gate in your own code.` },
      { type: 'table', headers: ['Approach', 'Who enforces the shape', 'What can still go wrong'], rows: [
        ['Ask for JSON in the instructions', 'Nobody: you hope', 'Extra words around the JSON, a missing field, a wrong value, truncation'],
        ['Native structured output (you send the schema to the API)', 'The API constrains the output to the schema', 'A refusal, a cut-off at the ceiling, a schema the API does not support, and anything the schema cannot say'],
        ['Either, plus validation in your code', 'You, every time', 'A reply that is valid but wrong: the schema checks shape, not truth'],
      ], caption: 'Read the last row first: the safest design always validates, even when the API enforces a schema.' },
      { type: 'paragraph', text: `**Native structured output.** Both vendors let you pass a schema. With OpenAI, you pass a schema in the request's text format; the Python SDK can take a Pydantic model, and the result is in \`output_parsed\`. With Claude, you pass the schema in \`output_config.format\` (the Python helper \`messages.parse\` takes a Pydantic model and gives \`parsed_output\`). The vendors document limits: the schema must set \`additionalProperties\` to false, some JSON Schema features are not supported, and OpenAI's strict mode needs every field listed as required. Keep your schema simple, with strings, booleans, numbers and enums. The docs also warn that a refusal can come back in a form that does not match the schema, and that an answer stopped by the token ceiling may be incomplete, so you still check the stop signal from lesson 20.` },
      { type: 'paragraph', text: `**Validation in your code.** In Python, **Pydantic** turns a schema into a class. \`Triage.model_validate_json(text)\` parses and checks in one step, and raises \`ValidationError\` when the text is not JSON or does not fit. In TypeScript, **zod** does the same: you define the schema with \`z.object(...)\`, and \`schema.safeParse(data)\` returns an object with \`success\` true and the data, or false and an error with a list of \`issues\`. Both give you a typed object only when the check passes, so the rest of your code never sees a half-valid one.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  A[Model reply text] --> B[Parse as JSON]
  B -->|not JSON| E{Attempts left?}
  B -->|parsed| C[Check against the schema]
  C -->|invalid| E
  C -->|valid| D[Use the data]
  E -->|yes| F[Send the error back and ask again]
  F --> A
  E -->|no| G[Safe fallback: hand over to a person]`, caption: 'Follow both failure paths. They meet at "Attempts left?". The loop through "ask again" must have a cap, or a stubborn failure runs forever and costs a call each time.' },
      { type: 'paragraph', text: `**Retry on invalid.** When validation fails, send the model its own bad reply and a short description of what was wrong, then ask again. Cap the attempts (three is a common choice). Each retry is another call, with its own cost and delay, and a model that failed once will not always succeed the second time. After the cap, do something safe: return a plain "a person will reply soon" message, set \`needs_human\`, and log what happened. Never pass the invalid data on "just this once".` },
      { type: 'paragraph', text: `**What a schema does not guarantee.** A reply can match the schema and still be wrong: the intent can be "hours" for a question about repairs. The schema also cannot express rules such as "if the intent is other, a person must look at it". Check those rules in your code after validation, and test them with a stored set of cases. Also, the docs say enum capitalization is not guaranteed on some APIs, so compare values in one case or normalise them before checking.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: you give the model a form with boxes (intent, urgency, needs_human, reply) and rules for what may go in each box. Then your program checks the filled form before using it. In the code below, \`Triage\` is the form: \`Literal[...]\` lists the allowed words, \`bool\` means yes or no, and \`str\` is text. \`get_triage\` asks, checks the answer and, if it is wrong, sends the mistake back and asks again, up to three times. After three failures it stops with a clear error instead of guessing. The ScriptedModel gives it a bad reply, another bad reply and a good one, so you can watch the loop work without a key.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `Retries hide model drift unless you count them: log attempts per call and alert when the retry rate rises, because it often signals a prompt or schema change, or a model update. Prefer fixing the schema and the instructions to adding attempts. Keep schemas flat and small (complexity limits and extra first-request latency exist for new schemas), version them, and treat the validated object as an API contract between the model and the rest of the system. Also validate semantic rules (ranges, cross-field rules, allow-lists) after the structural check, and never let a validated field choose a tool or a command unchecked: a value that fits the schema is still untrusted input.` },
      { type: 'version', text: 'Checked against OpenAI\'s structured-outputs guide, Claude\'s structured-outputs page, Pydantic\'s JSON page and zod\'s basic-usage page. OpenAI: Python `client.responses.parse(..., text_format=Model)` returns `output_parsed`; a raw schema goes in `text.format` with type json_schema and strict true. Claude: the schema goes in `output_config.format` with type json_schema, and `client.messages.parse(..., output_format=Model)` returns `parsed_output`; the older `output_format` request parameter is deprecated. Pydantic: `Model.model_validate_json` and `ValidationError`. zod: `safeParse` returns a result with `success`. Supported schema features and model support change: read the pages.', checked: CHECKED, sources: [DOCS.openaiStructured, DOCS.claudeStructured, DOCS.pydanticJson, DOCS.zodBasics] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `This first program needs no key. Install Pydantic with \`pip install pydantic\`, and keep \`scripted_model.py\` from lesson 17 in the same folder. Save this as \`triage.py\`. It is the heart of project P1.` },
      { type: 'code', language: 'python', label: 'Python: triage.py (runs with no key)', code: `# triage.py: ask for JSON, validate it, and retry when it is invalid. Runs with no key.
from typing import Literal

from pydantic import BaseModel, ValidationError

from scripted_model import ScriptedModel  # the file from lesson 17

MODEL = "stand-in-model"
INSTRUCTIONS = (
    "Classify the customer message for Mika's Bike Shop. Reply with ONLY a JSON object with keys "
    'intent ("hours", "repair", "parts" or "other"), urgency ("low", "normal" or "high"), '
    "needs_human (true or false) and reply (a short answer)."
)


class Triage(BaseModel):
    intent: Literal["hours", "repair", "parts", "other"]
    urgency: Literal["low", "normal", "high"]
    needs_human: bool
    reply: str


def get_triage(client, message, max_attempts=3):
    messages = [{"role": "user", "content": message}]
    for attempt in range(1, max_attempts + 1):
        response = client.responses.create(model=MODEL, instructions=INSTRUCTIONS, input=messages)
        text = response.output_text
        try:
            return Triage.model_validate_json(text)
        except ValidationError as error:
            print(f"attempt {attempt}: invalid ({error.error_count()} problem(s))")
            problem = str(error)[:400]  # keep what we send back short
            messages += [
                {"role": "assistant", "content": text},
                {"role": "user", "content": f"That was not valid: {problem}\\nReply again with ONLY the JSON object."},
            ]
    raise ValueError(f"no valid JSON after {max_attempts} attempts")


bad = "Sure! Here you go: {intent: repair}"
also_bad = '{"intent": "repair", "urgency": "urgent", "needs_human": false, "reply": "Bring it in."}'
good = '{"intent": "repair", "urgency": "normal", "needs_human": false, "reply": "Bring it in any day."}'

result = get_triage(ScriptedModel([bad, also_bad, good]), "My brake lever feels loose.")
print(result)
try:
    get_triage(ScriptedModel([bad, bad, bad]), "Hello?")
except ValueError as error:
    print("stopped:", error)` },
      { type: 'paragraph', text: `Read it in order. \`Triage\` is the schema. \`get_triage\` asks, then \`Triage.model_validate_json(text)\` both parses and checks. On \`ValidationError\`, it prints how many problems there were, appends the bad reply and a short error message to the conversation, and loops. After \`max_attempts\` it raises. The main part runs two cases: bad, bad, then good; and bad three times. The error text sent back is cut to 400 characters, so a long error cannot bloat the next request.` },
      { type: 'paragraph', text: `The same shape in TypeScript with zod, which also needs no key. Install with \`npm install zod\` and run it with a recent Node:` },
      { type: 'code', language: 'typescript', label: 'TypeScript: triage.ts (runs with no key)', code: `// triage.ts: validate model JSON with zod. Install: npm install zod
// Run with a recent Node (tested on Node 22): node triage.ts   (no API key needed)
import { z } from "zod";

const Triage = z.object({
  intent: z.enum(["hours", "repair", "parts", "other"]),
  urgency: z.enum(["low", "normal", "high"]),
  needs_human: z.boolean(),
  reply: z.string(),
});
type Triage = z.infer<typeof Triage>;

function parseTriage(text: string): { ok: true; value: Triage } | { ok: false; problem: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, problem: "not JSON at all" };
  }
  const result = Triage.safeParse(data);
  if (!result.success) {
    return { ok: false, problem: result.error.issues.map((issue) => issue.path.join(".")).join(", ") };
  }
  return { ok: true, value: result.data };
}

console.log(parseTriage("Sure! Here you go: {intent: repair}"));
console.log(parseTriage('{"intent":"repair","urgency":"urgent","needs_human":false,"reply":"Bring it in."}'));
console.log(parseTriage('{"intent":"repair","urgency":"normal","needs_human":false,"reply":"Bring it in."}'));` },
      { type: 'paragraph', text: `Now the native versions, which need a key. They ask the API to enforce the same schema. Use them after you trust your validation gate, and keep the gate anyway. First OpenAI:` },
      { type: 'code', language: 'python', label: 'Python: native_openai.py (needs OPENAI_API_KEY)', code: `# native_openai.py: let OpenAI enforce the schema. pip install openai pydantic
import os
from typing import Literal

from openai import OpenAI
from pydantic import BaseModel

MODEL = os.environ.get("AGENT_MODEL", "gpt-6.2-astra")
client = OpenAI()


class Triage(BaseModel):
    intent: Literal["hours", "repair", "parts", "other"]
    urgency: Literal["low", "normal", "high"]
    needs_human: bool
    reply: str


response = client.responses.parse(
    model=MODEL,
    input=[
        {"role": "system", "content": "Classify the customer message for Mika's Bike Shop."},
        {"role": "user", "content": "My brake lever feels loose."},
    ],
    text_format=Triage,
)
triage = response.output_parsed  # a Triage object; check status and refusals first (lesson 18)
print(triage)` },
      { type: 'code', language: 'python', label: 'Python: native_claude.py (needs ANTHROPIC_API_KEY)', code: `# native_claude.py: let Claude enforce the schema. pip install anthropic pydantic
import os
from typing import Literal

import anthropic
from pydantic import BaseModel

MODEL = os.environ.get("AGENT_MODEL", "claude-opus-5-5")
client = anthropic.Anthropic()


class Triage(BaseModel):
    intent: Literal["hours", "repair", "parts", "other"]
    urgency: Literal["low", "normal", "high"]
    needs_human: bool
    reply: str


response = client.messages.parse(
    model=MODEL,
    max_tokens=1024,
    messages=[{"role": "user", "content": "Classify for Mika's Bike Shop: my brake lever feels loose."}],
    output_format=Triage,
)
print(response.stop_reason)         # check it: "refusal" or "max_tokens" can break the schema
print(response.parsed_output)       # a Triage object when the schema was followed` },
      { type: 'paragraph', text: `Both versions return a parsed object when the model followed the schema. Neither removes your need to check for a refusal or a cut-off: the Claude example prints the stop reason on purpose, and for OpenAI you check the response status and any refusal in the output, as lesson 18 showed.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: triage.py was run locally with Pydantic)', code: `attempt 1: invalid (1 problem(s))
attempt 2: invalid (1 problem(s))
intent='repair' urgency='normal' needs_human=False reply='Bring it in any day.'
attempt 1: invalid (1 problem(s))
attempt 2: invalid (1 problem(s))
attempt 3: invalid (1 problem(s))
stopped: no valid JSON after 3 attempts` },
      { type: 'code', language: 'text', label: 'Expected output (real: triage.ts was run locally with Node and zod)', code: `{ ok: false, problem: 'not JSON at all' }
{ ok: false, problem: 'urgency' }
{
  ok: true,
  value: {
    intent: 'repair',
    urgency: 'normal',
    needs_human: false,
    reply: 'Bring it in.'
  }
}` },
      { type: 'code', language: 'text', label: 'Expected output of the native versions (the shape; the model\'s wording will differ)', code: `intent='repair' urgency='normal' needs_human=False reply='<text from the model>'
# Claude version, first line: end_turn   (anything else: check before trusting the object)` },
      { type: 'list', items: [
        'If you see ModuleNotFoundError for pydantic or scripted_model, install pydantic and run from the folder that holds both files.',
        'If every attempt fails even with a real model, print the raw text. A reply wrapped in code fences or with a sentence before the JSON is the usual cause: ask for "only the JSON object", or use native structured output.',
        'If the native call returns 400 about the schema, remove unsupported features (recursion, number or length limits) and make sure every object forbids extra properties.',
        'If the Claude version prints "max_tokens" as the stop reason, the JSON was cut off. Raise max_tokens and run again.',
        'If a value fails because of capitalization ("Repair" instead of "repair"), normalise it before validating, or compare case-insensitively.',
      ] },
      { type: 'warning', text: 'Validated does not mean safe. Never use a validated field to choose a command, a file path, a tool name or a database query without checking it against an allow-list. And treat the model\'s `reply` text as untrusted: it may repeat instructions from a customer\'s message. Cap retries so a stubborn failure cannot loop and spend money.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: add a business rule after validation (if the intent is "other", needs_human must be true) and test it with a scripted reply that breaks it.',
        'Next lesson, "Managing API Keys and Environment Variables", shows how to keep the keys these native calls need out of your code.',
        'Read the structured-outputs page of the vendor you use, and note which schema features it does not support.',
      ] },
      { type: 'takeaways', items: [
        'A schema describes the shape of the data you accept; a reply is valid only if it parses and matches.',
        'Native structured output asks the API to enforce a schema, but you still validate, and still check for refusals and cut-offs.',
        'Retry on invalid with the error message, a hard cap, and a safe fallback after the cap; never pass invalid data on.',
        'Valid is not true or safe: check business rules after the schema, and treat every field as untrusted input.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-21-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the gate',
          prompt: 'Write `triageProblems(text)`. It returns an array of problems: `["not json"]` if `text` does not parse as JSON; otherwise one entry for each wrong field, in this order: `"intent"` (must be "hours", "repair", "parts" or "other"), `"urgency"` (must be "low", "normal" or "high"), `"needs_human"` (must be a boolean), `"reply"` (must be a string). An empty array means valid. (A plain function on hand-written strings; no model is called.)',
          concept: 'validating a model reply against a schema',
          language: 'javascript',
          starter: `function triageProblems(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return ['not json'];
  }
  const problems = [];
  // check each field and push its name when it is wrong
  return problems;
}`,
          solution: `function triageProblems(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return ['not json'];
  }
  const problems = [];
  if (!['hours', 'repair', 'parts', 'other'].includes(data.intent)) {
    problems.push('intent');
  }
  if (!['low', 'normal', 'high'].includes(data.urgency)) {
    problems.push('urgency');
  }
  if (typeof data.needs_human !== 'boolean') {
    problems.push('needs_human');
  }
  if (typeof data.reply !== 'string') {
    problems.push('reply');
  }
  return problems;
}`,
          tests: {
            kind: 'function',
            fn: 'triageProblems',
            cases: [
              { label: 'valid', args: ['{"intent":"repair","urgency":"normal","needs_human":false,"reply":"Bring it in."}'], expected: [] },
              { label: 'not json', args: ['Sure! Here you go: {intent: repair}'], expected: ['not json'] },
              { label: 'a value outside the allowed words', args: ['{"intent":"repair","urgency":"urgent","needs_human":false,"reply":"Bring it in."}'], expected: ['urgency'] },
              { label: 'a missing field', args: ['{"intent":"hours","urgency":"low","reply":"We open at 9."}'], expected: ['needs_human'] },
              { label: 'two wrong fields', args: ['{"intent":"sales","urgency":"low","needs_human":"no","reply":"Hi"}'], expected: ['intent', 'needs_human'], hidden: true },
            ],
          },
          hints: [
            'After parsing, check one field at a time and push its name when it is wrong. Keep the order from the prompt.',
            'For the two lists of allowed words, use `[...].includes(data.intent)`. A missing field is `undefined`, which is not in the list.',
            'For `needs_human` use `typeof data.needs_human !== \'boolean\'`, and similarly `\'string\'` for `reply`.',
          ],
          explanation: 'The gate parses first, then checks each field against the schema. Returning the names of the wrong fields (not only true or false) gives you the short error message that you send back to the model on a retry.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-21-fix-bug-1',
          kind: 'fix-bug',
          title: 'One attempt too many',
          prompt: 'This function should try at most `maxAttempts` replies and return the first one that parses, or `null` if none of those attempts parses. With three bad replies followed by a good fourth, it wrongly returns the fourth. Fix the one line. (A stand-in for the retry loop; no model is called.)',
          concept: 'capping retry attempts',
          language: 'javascript',
          code: `function firstValid(replies, maxAttempts) {
  for (let attempt = 0; attempt <= maxAttempts; attempt++) {
    try {
      return JSON.parse(replies[attempt]);
    } catch (error) {
      // that reply was invalid: try the next one
    }
  }
  return null;
}`,
          bugLine: 2,
          fixes: [
            { line: `  for (let attempt = 0; attempt < maxAttempts; attempt++) {`, correct: true, why: 'Starting at 0 and stopping before maxAttempts makes exactly maxAttempts tries.' },
            { line: `  for (let attempt = 0; attempt < maxAttempts - 1; attempt++) {`, correct: false, why: 'This makes one try too few. A good reply on the last allowed attempt would be thrown away.' },
            { line: `  for (let attempt = 1; attempt <= maxAttempts; attempt++) {`, correct: false, why: 'Starting at 1 skips the first reply (index 0) and reads one past the allowed range, so the cap is still off by one.' },
          ],
          tests: {
            kind: 'function',
            fn: 'firstValid',
            cases: [
              { label: 'good on the second try', args: [['not json', '{"a":1}', '{"a":2}'], 3], expected: { a: 1 } },
              { label: 'good on the last allowed try', args: [['x', 'y', '{"a":3}', '{"a":4}'], 3], expected: { a: 3 } },
              { label: 'three bad replies, then a good one that is too late', args: [['x', 'y', 'z', '{"a":4}'], 3], expected: null },
              { label: 'only one attempt allowed', args: [['x', '{"a":5}'], 1], expected: null, hidden: true },
            ],
          },
          hints: [
            'Count how many times the loop body can run when the condition is `attempt <= maxAttempts` and `attempt` starts at 0.',
            'It runs `maxAttempts + 1` times. One attempt too many is allowed.',
            'Change the comparison so that the loop stops when `attempt` reaches `maxAttempts`.',
          ],
          explanation: 'An off-by-one in a retry cap allows one more call than you intended, and each call costs money and time. With a cap, "three attempts" must mean exactly three.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-21-scenario-1',
          kind: 'scenario',
          title: 'Three bad replies in a row',
          prompt: 'Choose what the agent does next.',
          concept: 'safe fallback after retries',
          situation: 'Mika\'s assistant asked for the triage JSON three times. All three replies failed validation. A customer is waiting in the chat window with a message about a broken brake.',
          options: [
            { text: 'Stop retrying, tell the customer that a person will reply soon, mark the chat as needing a human, and log the three failures.', consequence: 'The customer is not left hanging, a safety-related message reaches a person, and the log shows the failure pattern to fix later.', quality: 'best' },
            { text: 'Show the customer the model\'s last raw reply, since it probably still contains a useful answer.', consequence: 'The reply failed the gate, so it can contain a wrong or broken answer. It may also include text the schema was meant to keep out.', quality: 'poor' },
            { text: 'Try ten more times, because the model will eventually follow the schema.', consequence: 'Every extra call costs money and delay, and the customer waits. A stubborn failure usually means the prompt or schema needs fixing.', quality: 'poor' },
            { text: 'Fall back to a fixed reply that asks the customer to phone the shop, without marking the chat for a person.', consequence: 'The customer gets a safe answer, but nobody at the shop sees the safety-related message, so it may never be followed up.', quality: 'acceptable' },
          ],
          hints: [
            'The customer mentions a brake. Who needs to know about this message?',
            'Passing the invalid reply on, or retrying without limit, both ignore the gate you built.',
            'The best answer is safe for the customer and also leaves a record for the shop.',
          ],
          explanation: 'After the cap, the safest move is to stop, give the customer a clear message, put a person in the loop and record the failures. A fixed reply alone is acceptable but loses the safety-related message; passing invalid data on or retrying forever are the two mistakes the gate exists to prevent.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-21-q1',
        prompt: 'A model returns JSON that passes your schema: intent "hours" for the customer message "My brake lever is loose". What does passing validation tell you?',
        choices: [
          'That the answer is correct, because the schema was enforced by the API.',
          'That the model understood the message, since a wrong intent would have failed the enum check that the schema adds to every reply.',
          'That the reply has the right shape. Whether the intent is right needs a different check, such as stored test cases.',
          'That the reply is safe to act on, because every field has the right type.',
        ],
        answer: 2,
        explanation: 'A schema checks structure and allowed values. "hours" is an allowed word, so the reply is valid, but it is the wrong intent. Correctness is a separate check, which is why you keep test cases.',
      },
      {
        id: 'building-ai-agents-21-q2',
        prompt: 'You call Claude with a schema and read parsed_output, but sometimes your code fails to parse. The logs show stop_reason "max_tokens" on those calls. What happened and what do you do?',
        choices: [
          'The schema was too complex for the model, so remove all fields from it.',
          'The model refused, so rewrite the question to be more polite and ask again.',
          'The API is down for those requests, so retry them unchanged after a minute, with the same ceiling.',
          'The reply was cut off by your ceiling, so the JSON is incomplete. Raise max_tokens and retry.',
        ],
        answer: 3,
        explanation: 'A stop at max_tokens can truncate the JSON, so it no longer matches the schema. The docs say to raise the ceiling. A refusal has a different stop reason.',
      },
      {
        id: 'building-ai-agents-21-q3',
        prompt: 'Your validate-and-retry loop is capped at three attempts. All three fail. Which next step fits an agent that talks to customers?',
        choices: [
          'Stop, give a plain fallback message, hand the chat to a person and log the failures.',
          'Send the last invalid reply to the customer, since it is the model\'s best effort.',
          'Remove the cap and keep going until a valid reply appears, because the cost is small.',
          'Skip validation for this message so the conversation can continue without delay.',
        ],
        answer: 0,
        explanation: 'After the cap the loop must end safely. Sending invalid data on, removing the cap and skipping validation each remove the protection the gate gives.',
      },
      {
        id: 'building-ai-agents-21-q4',
        audience: { max: 'beginner' },
        prompt: 'In this lesson, what is a schema?',
        choices: [
          'A secret key that proves your program is allowed to call the model and that must be sent with each request.',
          'A description of the shape the data must have: which fields exist, their types and the allowed values.',
          'A second model that checks the first model\'s spelling.',
        ],
        answer: 1,
        explanation: 'A schema is the form with boxes and rules. Validation checks a reply against it before your code uses it.',
      },
      {
        id: 'building-ai-agents-21-q5',
        audience: { min: 'advanced' },
        prompt: 'The vendor docs say enum capitalization is not guaranteed in structured output. Your intent field is an enum, and a downstream router does an exact string match. What is the best design?',
        choices: [
          'Add every capitalization variant to the schema as a separate allowed value.',
          'Disable native structured output and parse the reply with a regular expression that ignores case.',
          'Normalise the value (for example lower-case it) in your validation step, then route on the normalised value, and add a test case for it.',
          'Trust the schema, because strict mode guarantees that the value matches exactly.',
        ],
        answer: 2,
        explanation: 'Normalise in your own code before routing, and keep a test for it. Listing variants clutters the schema, dropping the schema loses the guarantees you do have, and the docs say exact capitalization is not guaranteed.',
      },
    ],
    task: {
      title: 'Break the gate, then fix it',
      minutes: 20,
      steps: [
        'Run triage.py and check the output against the expected output above. If you know TypeScript, run triage.ts as well.',
        'Change it and observe: change `max_attempts` to 2 and run again. What happens in the first case, and what does that tell you about choosing the cap?',
        'Add a fourth allowed intent, "booking", to the schema. Which scripted replies now pass, and which fail?',
        'Add a business rule after validation: if the intent is "other", needs_human must be true. Write a scripted reply that breaks it, and make your code reject it.',
        'Write two sentences: what would you show a customer after the cap, and what would you log so you can improve the prompt?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before you run the script, write on paper what each scripted reply gets wrong (bad, also_bad, good). After the run, compare your notes with what the output says about each attempt.'] },
      { audience: { min: 'advanced' }, steps: ['Add a counter for attempts per call and a rate for calls that needed more than one attempt, and print them at the end. Decide at what rate you would stop and change the prompt rather than raise the cap, and write down why.'] },
    ],
  },
  {
    id: 'building-ai-agents-22',
    day: 22,
    title: 'Managing API Keys and Environment Variables',
    summary: 'Keep keys out of your code and your repository with environment variables, a .env file and a .gitignore, and know what to do on the day a key leaks.',
    intro: {
      objectives: [
        'Store an API key in a .env file that Git ignores, and commit a .env.example with placeholders instead',
        'Load environment variables in Python with python-dotenv and in Node with --env-file',
        'Describe what to do when a key is exposed, and why deleting the file is not enough',
      ],
      why: 'An API key is a password that spends money. One careless commit can hand it to strangers, so protecting keys is the first security habit of every agent builder.',
    },
    minutes: 20,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `An API key is a password that spends money. Where does it live while you build, and what do you do on the day it ends up somewhere it should not be? This lesson gives you a setup you will reuse in every project of this course, and the order of steps for the day something goes wrong.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `A classmate of Dennis, Joy, pasted her key into \`config.py\` "just for the demo" and pushed her project to a public repository to share it. A few days later her usage page showed calls she had never made. She deleted \`config.py\` and pushed again, and thought it was fixed. It was not. Git keeps every earlier version of every file, so the key was still sitting in the history for anyone to read. What actually fixed it was disabling the old key at the vendor, creating a new one and putting the new one in a \`.env\` file that Git was told to ignore. The lesson she took away: when a secret leaks, the first step is not cleaning the code. It is making the leaked key useless.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `The rule is simple: **a secret never goes in your source code, your prompts, your logs or your repository.** Instead, your program reads it from an **environment variable**, a named setting that belongs to the running process and lives outside your files. The OpenAI and Anthropic SDKs both look for a variable (\`OPENAI_API_KEY\` and \`ANTHROPIC_API_KEY\`) when you create the client with no arguments, so your code never even mentions the key.` },
      { type: 'paragraph', text: `Typing \`export OPENAI_API_KEY=...\` in every terminal gets old, so developers keep their local settings in a **.env file**: one \`NAME=value\` per line. A small library reads it and sets the variables for your program. The file stays on your laptop. Git never sees it because your **.gitignore** lists it. What you do commit is **.env.example**, the same list of names with placeholders instead of values, so a teammate knows what to fill in.` },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  A[.env on your laptop, real key] -->|load_dotenv or --env-file| B[Program environment]
  B -->|SDK reads OPENAI_API_KEY| C[SDK client]
  C -->|HTTPS request with the key| D[Vendor API]
  A -.->|.gitignore blocks it| E[Git repository]
  F[.env.example, placeholders only] -->|committed| E`, caption: 'Follow the solid arrows: the key travels from your file to the vendor and nowhere else. The dotted arrow is the one your .gitignore must block. Only the placeholder file reaches the repository.' },
      { type: 'table', headers: ['Where the key lives', 'Verdict', 'Why'], rows: [
        ['Written in the source code', 'Never', 'It travels with every copy, commit and screenshot, and Git history keeps it even after you delete it'],
        ['A .env file listed in .gitignore', 'Fine for local work', 'It stays on your machine and is easy to change; never share the file itself'],
        ['A variable set by the shell or the host', 'Fine', 'Nothing is written in your project; the SDK reads it'],
        ['A secrets manager used by your deployment', 'The usual choice in production', 'The Claude docs advise a secrets manager and periodic rotation'],
        ['Code that runs in a browser or a phone app', 'Never', 'Anyone can read it there. Both vendors say to call the API from your own server'],
      ], caption: 'The last row surprises people. A web page that holds a key has handed it to every visitor.' },
      { type: 'paragraph', text: `**Loading the file.** In Python, install \`python-dotenv\` and call \`load_dotenv()\` once at the start. It sets the variables from the file, and by default it does not replace a variable that is already set in the environment. In Node, start your program with \`node --env-file=.env your_script.js\`; Node loads the file, and a variable already set in the environment takes precedence over the file.` },
      { type: 'paragraph', text: `**Good habits.** Use a separate key for each project, so you can disable one without breaking the others. Check what you are about to commit with \`git status\`. Never print a key; if you need to confirm it is set, print only whether it exists or how long it is. Never put a key in a prompt: a model can repeat what it is given. And if a key is ever exposed, do things in this order: first disable it at the vendor and create a new one, then fix your files, then look at the usage page for calls you did not make. Cleaning the repository history can come later, because the old key is already dead.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: think of the key as the key to the shop's cash drawer. You do not tape it to the shop window (your code), and you do not leave a copy in the box that you send to customers (your repository). You keep it in a drawer only you open (the .env file), and you tell the post office never to pick that drawer up (.gitignore). In the code below, \`load_dotenv()\` opens the drawer. \`check_environment\` stops the program with a clear message if a needed key is missing. \`describe\` reports whether a key is set and how many characters it has, but never shows the key itself.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `A .env file is a local-development convenience, not a deployment mechanism. In production, inject secrets from the platform's secrets manager at start-up, scope each key to one service and environment, rotate on a schedule and on every suspected exposure, and make rotation cheap by reading the key at start-up instead of baking it into images. Add a pre-commit or CI secret scan as a second layer: a .gitignore only prevents the mistakes it knows about. Keep keys out of logs, error reports and traces (redact at the logging layer), and remember that anything in a prompt or a tool result can end up in a vendor's logs and in your own.` },
      { type: 'version', text: 'Checked against the python-dotenv page on PyPI (`load_dotenv()`; existing environment variables are not overridden by default; add .env to .gitignore), the Node.js command-line options page (`--env-file`, added in v20.6.0; a variable already in the environment takes precedence over the file), OpenAI\'s authentication reference (keep the key off the client side) and Claude\'s authentication page (call the API from your own back end; use a secrets manager; rotate keys and disable any you suspect has leaked). Tools and versions change: read the current pages.', checked: CHECKED, sources: [DOCS.dotenv, DOCS.nodeCli, DOCS.openaiAuth, DOCS.claudeAuth] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `First the files. Run these commands in your project folder, before your first commit. The key in \`.env\` is a placeholder until you paste a real one. Never paste a real key into a lesson, a chat or a commit.` },
      { type: 'code', language: 'bash', label: 'setup.sh: .gitignore, .env.example and .env', code: `# Run these in your project folder, before your first commit.
printf '.env\\n.env.*\\n!.env.example\\n__pycache__/\\n' > .gitignore
printf 'OPENAI_API_KEY=<your-key-here>\\nAGENT_MODEL=gpt-6.2-astra\\n' > .env.example
git init -q
cp .env.example .env            # now open .env and replace <your-key-here> with your real key
git check-ignore -v .env        # prints a line when .env is ignored: that is what you want
git add -A
git status --short              # .env must NOT appear in this list` },
      { type: 'paragraph', text: `Now the loader. Install the library with \`pip install python-dotenv\`, and save this as \`config.py\`. Import it at the top of your agent scripts, or run it alone to check your setup.` },
      { type: 'code', language: 'python', label: 'Python: config.py', code: `# config.py: load settings from .env, check them, never print a secret.
# Install: pip install python-dotenv
import os

from dotenv import load_dotenv

load_dotenv()  # looks for a .env file and sets its variables; variables already set keep their value

REQUIRED = ["OPENAI_API_KEY"]  # add ANTHROPIC_API_KEY if you use Claude
OPTIONAL = {"AGENT_MODEL": "gpt-6.2-astra"}


def check_environment():
    missing = [name for name in REQUIRED if not os.environ.get(name)]
    if missing:
        raise SystemExit(f"Missing: {', '.join(missing)}. Copy .env.example to .env and fill it in.")


def describe(name):
    value = os.environ.get(name)
    return f"{name}: not set" if not value else f"{name}: set ({len(value)} characters)"


if __name__ == "__main__":
    check_environment()
    for name in REQUIRED:
        print(describe(name))
    for name, default in OPTIONAL.items():
        print(f"{name}: {os.environ.get(name, default)}")` },
      { type: 'paragraph', text: `For Node, no library is needed. Start the script with the flag:` },
      { type: 'code', language: 'bash', label: 'Node: load .env with a flag', code: `node --env-file=.env -e 'console.log("OPENAI_API_KEY set:", Boolean(process.env.OPENAI_API_KEY))'` },
      { type: 'paragraph', text: `Read the Python in order. \`load_dotenv()\` runs first, so the variables are in place before anything reads them. \`REQUIRED\` lists the keys the agent cannot work without; add \`ANTHROPIC_API_KEY\` if you use Claude. \`check_environment\` fails early and clearly, before you waste a request. \`describe\` is how you check a secret without printing it. Notice that the program never calls \`print\` on the value of a key.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: run locally with a placeholder value, never a real key)', code: `$ bash setup.sh
.gitignore:1:.env	.env
A  .env.example
A  .gitignore
A  config.py

$ python config.py   # .env still has the placeholder text, so a value is "set"
OPENAI_API_KEY: set (15 characters)
AGENT_MODEL: gpt-6.2-astra

$ python config.py   # after deleting .env
Missing: OPENAI_API_KEY. Copy .env.example to .env and fill it in.
(exit code 1)

$ node --env-file=.env -e '...'   # run while .env exists
OPENAI_API_KEY set: true` },
      { type: 'list', items: [
        'If config.py says a key is missing although you made a .env file, you probably run Python from another folder, or the name in .env is spelled differently from the name in REQUIRED. Check both.',
        'If it says the key is "set (15 characters)", you still have the placeholder text. Open .env and paste your real key.',
        'If git status lists .env, your .gitignore is missing or has a typo, or you committed .env earlier. Fix .gitignore, run git rm --cached .env, and if a real key was ever committed, treat it as leaked and replace it.',
        'If a variable you set in the terminal wins over the value in .env, that is the default: an existing environment variable is not overridden. Unset it, or change the value in the shell.',
        'If the SDK still says its key is missing, the program did not load .env before creating the client. Call load_dotenv() (or start Node with --env-file) first.',
      ] },
      { type: 'warning', text: 'Never put a real key into a file that is committed, into a prompt, a log line, an error message or a screenshot. If one is exposed, disable it at the vendor and create a new one before you do anything else. Deleting the file does not remove it from Git history. Real projects with real customers and keys need a security review by a professional.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: set up .gitignore, .env.example and .env in every project folder you have, and run git check-ignore -v .env in each.',
        'Next lesson, "Handling API Errors and Rate Limits", shows what to do when a call fails even though the key is right.',
        'Read the authentication page of your vendor and note one thing it says about where a key may be used.',
      ] },
      { type: 'takeaways', items: [
        'A key never goes in source code, prompts, logs or a repository: read it from an environment variable.',
        'Keep local keys in .env, list .env in .gitignore, and commit .env.example with placeholders.',
        'Load the file with python-dotenv in Python (load_dotenv) or --env-file in Node, and check that keys exist without printing them.',
        'If a key leaks, disable it and create a new one first; cleaning files and history comes after.',
        'Never use a key in browser or phone code: call the vendor from your own server.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-22-code-challenge-1',
          kind: 'code-challenge',
          title: 'Is .env protected?',
          prompt: 'Write `missingFromGitignore(gitignoreText, required)`. `gitignoreText` is the whole file as one string with lines separated by `\\n`. `required` is an array of lines that must be present. Return the required lines that are NOT present, in the order of `required`. Ignore spaces at the start and end of each line. (A plain function on hand-written text.)',
          concept: 'checking that secrets are ignored',
          language: 'javascript',
          starter: `function missingFromGitignore(gitignoreText, required) {
  const lines = gitignoreText.split('\\n').map((line) => line.trim());
  // return the required lines that are not in lines
  return [];
}`,
          solution: `function missingFromGitignore(gitignoreText, required) {
  const lines = gitignoreText.split('\\n').map((line) => line.trim());
  const missing = [];
  for (const entry of required) {
    if (!lines.includes(entry)) {
      missing.push(entry);
    }
  }
  return missing;
}`,
          tests: {
            kind: 'function',
            fn: 'missingFromGitignore',
            cases: [
              { label: 'everything present', args: ['.env\n__pycache__/\n', ['.env', '__pycache__/']], expected: [] },
              { label: '.env is missing', args: ['__pycache__/\nnode_modules/\n', ['.env', '__pycache__/']], expected: ['.env'] },
              { label: 'spaces around a line', args: ['  .env  \n', ['.env']], expected: [] },
              { label: 'a similar name does not count', args: ['.env.example\n', ['.env']], expected: ['.env'], hidden: true },
            ],
          },
          hints: [
            'Make an empty array for the missing lines and return it at the end.',
            'Loop over `required`. For each entry, ask whether `lines.includes(entry)`.',
            'Push the entry when it is not included. `.env.example` is a different line from `.env`, so it must not match.',
          ],
          explanation: 'A secret file is only protected when its exact name is on a line in .gitignore. Checking required lines against the file is a tiny version of the secret checks that teams run before every commit.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-22-scenario-1',
          kind: 'scenario',
          title: 'The key is in the repository',
          prompt: 'Choose the first thing to do.',
          concept: 'responding to an exposed key',
          situation: 'Dennis realises he committed config.py with a real key two weeks ago, and pushed it to a public repository. The usage page shows nothing odd yet.',
          options: [
            { text: 'Disable the key at the vendor and create a new one, then move the new key into .env, fix .gitignore and clean up the code.', consequence: 'The old key stops working at once, so the copy in the history is harmless. The rest is tidying, done calmly.', quality: 'best' },
            { text: 'Delete config.py, commit and push, then watch the usage page for a few days.', consequence: 'The file is gone from the latest version, but the key is still in the history and still works. Anyone who finds it can use it.', quality: 'poor' },
            { text: 'Make the repository private and keep using the same key, because only he can see it now.', consequence: 'The key may already have been copied while it was public, and it is still valid. Making the repository private does not undo that.', quality: 'poor' },
            { text: 'Rewrite the Git history to remove the key, and replace the key later when he has time.', consequence: 'Removing the key from history is good, but the old key is valid until it is disabled, and copies of the repository may already exist elsewhere.', quality: 'acceptable' },
          ],
          hints: [
            'The key is already public. What makes a leaked key harmless?',
            'Deleting or hiding something that was already copied does not stop the copy from working.',
            'The best answer makes the old key useless first, then fixes the project.',
          ],
          explanation: 'A leaked key is dangerous for as long as it works, so you disable it first. Deleting the file or making the repository private does not touch the key. Rewriting history is useful tidying, but only after the key has been replaced.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-22-arrange-1',
          kind: 'arrange',
          title: 'Set up a project safely',
          prompt: 'Put the steps in the order that sets up a new agent project without risking the key.',
          concept: 'a safe order for secrets setup',
          language: 'text',
          solution: [
            'Create .gitignore with .env in it',
            'Create .env.example with placeholder values',
            'Copy it to .env and paste the real key into .env',
            'Run git check-ignore -v .env and see it listed',
            'Load .env with load_dotenv() at the start of the program',
            'Make your first commit',
          ],
          reasons: [
            'The protection must exist before the secret does.',
            'The placeholder file documents the names without any secret in it.',
            'Only now does a real key exist, and only in the ignored file.',
            'You prove that Git will ignore the file before you commit anything.',
            'The program can now read the variables without the key being in the code.',
            'Committing last means nothing secret could have been added by mistake.',
          ],
          hints: [
            'Which step has to come before any secret exists on disk?',
            'The real key is pasted in only after the ignore rule is in place.',
            'The first commit comes last, after you have checked that .env is ignored.',
          ],
          explanation: 'Create the ignore rule first, then the placeholder file, then the real key, then check, load and commit. If the order is reversed, a single `git add .` can publish the key.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-22-q1',
        prompt: 'You find that a real API key has been committed and pushed to a public repository. Which action should come first?',
        choices: [
          'Disable that key at the vendor and create a new one.',
          'Delete the file and push a new commit, since the latest version no longer has the key.',
          'Rewrite the repository history, because the key is only dangerous while it is visible in the history.',
          'Ask the team not to use the old key, and rotate it at the next release.',
        ],
        answer: 0,
        explanation: 'A leaked key works until it is disabled, so making it useless comes first. Deleting a file or rewriting history does not stop copies of the key from working.',
      },
      {
        id: 'building-ai-agents-22-q2',
        prompt: 'Your repository has .env, .env.example and a .gitignore. Which should be committed to Git?',
        choices: [
          'Only .env, since it shows the settings your program really uses.',
          '.env.example and .gitignore, but not .env.',
          'All three, so that a teammate who clones the repository can run the program at once.',
          'Only .gitignore, because the names of the variables are secret too.',
        ],
        answer: 1,
        explanation: 'The example file shows teammates which names to fill in, using placeholders, and .gitignore keeps the real file out. The real .env holds the secret and is never committed.',
      },
      {
        id: 'building-ai-agents-22-q3',
        prompt: 'A teammate builds a web page where the browser calls the model vendor directly, with the key written in the page\'s JavaScript so that it is fast. What is the problem?',
        choices: [
          'The page will be slow, because browsers cannot call the model\'s servers.',
          'The key is stored in a file that is too large, so Git will refuse to commit it.',
          'Anyone who opens the page can read the key in its code, so the call should go through your own server, which holds the key.',
          'The vendor will refuse the call, because keys are only valid for calls made from a terminal.',
        ],
        answer: 2,
        explanation: 'Code that runs in a browser is visible to every visitor. Both vendors say to call the API from your own back end, where the key stays private.',
      },
      {
        id: 'building-ai-agents-22-q4',
        audience: { max: 'beginner' },
        prompt: 'What is an environment variable?',
        choices: [
          'A named setting that lives outside your code, which a program can read when it runs.',
          'A kind of variable that can only hold the weather, so that a program can plan around the forecast.',
          'A copy of your code that is saved in the cloud.',
        ],
        answer: 0,
        explanation: 'An environment variable is a name with a value that belongs to the running program. It keeps secrets such as keys out of the code itself.',
      },
      {
        id: 'building-ai-agents-22-q5',
        audience: { min: 'advanced' },
        prompt: 'You deploy your agent as a service. Which approach to its API key is the most defensible?',
        choices: [
          'Bake the .env file into the container image, so every environment starts identically.',
          'Use one shared key for all projects and environments, so there is only one thing to rotate.',
          'Put the key in the repository\'s private settings file, since only the team can read it.',
          'Inject a key scoped to this service from a secrets manager at start-up, keep it out of logs, and have a tested rotation procedure.',
        ],
        answer: 3,
        explanation: 'A scoped key injected at start-up limits the damage of a leak and makes rotation a normal operation. An image, a shared key or a repository file spread the secret and make it hard to replace.',
      },
    ],
    task: {
      title: 'Set up your secrets the safe way',
      minutes: 15,
      steps: [
        'Create a new project folder. Run the setup commands above and check that git check-ignore -v .env prints a line.',
        'Save config.py, run it, and check that it reports the key as set without printing it. If you have a real key, put it only in .env; if not, leave the placeholder.',
        'Change it and observe: delete .env and run config.py again. Then set the variable in the terminal (export OPENAI_API_KEY=<your-key-here> in a shell) and run again with and without .env. Which value wins?',
        'Run git status after git add -A. Confirm .env is not listed and .env.example is.',
        'Write two sentences: what would you do in the first ten minutes if you found a key in your repository?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['If any command is unfamiliar, ask an assistant what it does, one line at a time, and check the answer against the comments in setup.sh. Do not paste your real key into the assistant\'s chat.'] },
      { audience: { min: 'advanced' }, steps: ['Add a pre-commit check that fails if a staged file contains a string shaped like a key, or if .env is staged. Write down what it cannot catch, and how you would add a second layer in CI.'] },
    ],
  },
  {
    id: 'building-ai-agents-23',
    day: 23,
    title: 'Handling API Errors and Rate Limits',
    summary: 'Tell errors worth retrying from errors that are not, wait with backoff and jitter, and fail safely when the cap is reached.',
    intro: {
      objectives: [
        'Sort API errors into those worth retrying and those that need a fix, by status class and SDK exception',
        'Write a retry wrapper with exponential backoff, jitter, a cap on attempts and a safe failure',
        'Explain how the SDKs\' own max_retries setting interacts with a retry layer you write',
      ],
      why: 'Calls to a model fail more often than ordinary function calls: limits, busy servers and network drops are normal. An agent that handles them calmly keeps working, and one that does not can lock itself out or spend money in a loop.',
    },
    minutes: 24,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `A call fails on a busy Friday afternoon. Should your agent try again, wait, give up, or tell someone? The answer depends on why it failed, and a wrong answer can make things worse. This lesson gives you the rules, and a small function you can reuse.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `During a weekend sale, Mika's assistant started to get "429" errors. Dennis's code retried at once, ten times in a row, with no pause. Every failed request counted against the same limit, so the retries kept the assistant locked out. In the same code, a "401" (wrong key) was also retried ten times, although no amount of waiting fixes a wrong key. After the weekend, Dennis rewrote the loop: retry only the failures that can pass, wait longer after each failure, add a little randomness so that several copies of the program do not all retry at the same moment, stop after a few tries, and show the customer a short message. The next sale went smoothly.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `An HTTP **status code** tells you the class of failure. Both vendors' SDKs turn them into **exception classes** you can catch, all built on a common base (\`APIError\`), with \`APIStatusError\` for any HTTP error and \`APIConnectionError\` when no response came back at all. The key question for each: *will trying the same request again later succeed?*` },
      { type: 'table', headers: ['Status', 'SDK exception', 'What it means', 'Retry?'], rows: [
        ['400', 'BadRequestError', 'Your request is malformed, or uses something the model does not support', 'No. Fix the request'],
        ['401', 'AuthenticationError', 'The key is missing, wrong or revoked', 'No. Fix the key (lesson 22)'],
        ['403', 'PermissionDeniedError', 'This key may not do that', 'No. Fix the permissions'],
        ['404', 'NotFoundError', 'The thing you named, often the model id, does not exist', 'No. Fix the name'],
        ['422', 'UnprocessableEntityError', 'The request was understood but could not be processed', 'No. Fix the request'],
        ['429', 'RateLimitError', 'Too many requests or tokens for now', 'Yes, after waiting. Not if it is a billing or spend limit'],
        ['500 or more', 'InternalServerError', 'The vendor had a problem; Claude also uses 529 for "overloaded"', 'Yes, with backoff'],
        ['no response', 'APIConnectionError (and APITimeoutError)', 'Network failure or timeout', 'Yes, with backoff'],
      ], caption: 'Read the last column first. Only four of these rows can succeed by waiting. The others need a person or your code to change something.' },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  A[Call the API] --> B{Did it fail?}
  B -->|no| C[Use the result]
  B -->|yes| D{Can waiting fix it?}
  D -->|no: 400, 401, 403, 404| E[Stop and report the error]
  D -->|yes: 429, 5xx, no response| F{Attempts left?}
  F -->|no| G[Safe failure: message, log, queue]
  F -->|yes| H[Wait: Retry-After, or backoff with jitter]
  H --> A`, caption: 'Follow a 429 down the right side and a 401 down the left. The loop through "Wait" must be capped by "Attempts left?".' },
      { type: 'paragraph', text: `**Exponential backoff** means waiting longer after each failure: for example 1 second, then 2, then 4, then 8, up to a **cap** (a maximum wait, such as 30 seconds). It gives a busy service time to recover. **Jitter** adds randomness to the wait. Without it, a hundred copies of your program that failed together will all retry together and fail together again. One common form, used in the code below, is "full jitter": wait a random time between zero and the current backoff value. OpenAI's guide tells you to use exponential backoff with jitter and to cap both the attempts and the total retry time. Both vendors say to follow the \`Retry-After\` header when the response has one, because it states the minimum time to wait.` },
      { type: 'paragraph', text: `**Rate limits** are how a vendor shares capacity. They are counted in requests and in tokens over time, and the exact numbers depend on your account, so this course gives none: read yours on the vendor's page. Responses carry headers that report your limits and what remains. Two traps: a failed request still counts against your limit, so hammering a 429 makes it last longer; and some 429s will not clear by waiting, for example a spend limit you have reached, which the Claude docs say has no \`retry-after\` and keeps failing. After your cap, stop and tell a person.` },
      { type: 'paragraph', text: `**The SDKs already retry.** Both SDKs retry connection errors, 408, 409, 429 and 5xx responses by default, twice, with backoff, and the parameter is \`max_retries\` (\`maxRetries\` in TypeScript). For many agents, that default is enough, and the simplest thing that works is to leave it on and catch the exception when it finally fails. If you write your own retry layer, as below, set the SDK's \`max_retries\` to 0, or you get nested loops: with the default of 2 retries, each of your attempts becomes up to 3 requests. Also set a **timeout** shorter than the default of ten minutes, so a stuck call does not hold a customer waiting.` },
      { type: 'paragraph', text: `Finally, **fail safely**. After the cap, return a short, honest message to the user, log the status and the request id (never the key or private text), and, when the work can wait, put it in a queue to try again later. An agent that has run out of retries should not guess an answer.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: if the shop's phone line is busy you do not redial 100 times a second, and you do not keep redialling a wrong number. You wait a bit, try again, wait longer, and after a few tries you leave a note. The code below does that. \`backoff_delays\` makes the list of longest waits: 1, 2, 4, 8 seconds and so on, never above the cap. \`is_retryable\` decides which failures are worth another try. \`call_with_retry\` runs your function, and on a retryable failure waits a random time up to the current limit, then tries again. When the tries run out, or the failure cannot be fixed by waiting, it raises the error so the caller can show a safe message.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In production, add three things the sketch leaves out. Honour Retry-After when present, using the larger of it and your backoff. Bound the total time as well as the number of attempts, so a chain of retries cannot outlast a user\'s patience or your own timeout. And make retried operations idempotent: a retry after a timeout may repeat a request that actually succeeded, which for a model call only costs tokens but for a tool that books a repair or sends a message can do harm twice (module 4 covers idempotency). Count retries per route and alert on a rising rate, and use a client-side limiter or queue so a burst of work never reaches the vendor all at once.` },
      { type: 'version', text: 'Checked against OpenAI\'s error-codes and rate-limits guides, Claude\'s errors and rate-limits pages, and the openai-python and Claude Python SDK pages: both SDKs retry connection errors, 408, 409, 429 and 5xx twice by default and take `max_retries` (`maxRetries` in TypeScript); OpenAI says to turn the SDK\'s retries off if you add your own and that Retry-After handling varies by SDK version; Claude lists 529 `overloaded_error` and a spend-limit 429 without retry-after. Exception names follow the status table above. Limits and defaults change by account and version: read the current pages.', checked: CHECKED, sources: [DOCS.openaiErrors, DOCS.openaiRates, DOCS.claudeErrors, DOCS.claudeRates, DOCS.openaiPython, DOCS.claudePython] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `This program needs no key: it uses a fake function that fails on purpose, so you can see the waits and the decisions. Save it as \`retry.py\`. The \`sleep\` and \`rng\` arguments are there so you can replace real waiting and real randomness in tests.` },
      { type: 'code', language: 'python', label: 'Python: retry.py (runs with no key)', code: `# retry.py: retry only what can succeed later, wait longer each time, add jitter.
import random
import time

RETRYABLE_STATUS = {408, 409, 429, 500, 502, 503, 504, 529}


def backoff_delays(tries, base=1.0, cap=30.0):
    """The longest wait allowed before each retry: base, 2*base, 4*base ... never above cap."""
    return [min(cap, base * 2**n) for n in range(tries)]


def is_retryable(error):
    status = getattr(error, "status_code", None)  # both SDKs' status errors carry this
    if status is None:
        return isinstance(error, ConnectionError)  # stand-in for the SDKs' connection error
    return status in RETRYABLE_STATUS


def call_with_retry(fn, tries=4, base=1.0, cap=30.0, sleep=time.sleep, rng=random.random):
    ceilings = backoff_delays(tries - 1, base, cap)
    for attempt in range(tries):
        try:
            return fn()
        except Exception as error:
            if not is_retryable(error) or attempt == tries - 1:
                raise
            wait = rng() * ceilings[attempt]  # "full jitter": anywhere from 0 to the ceiling
            print(f"attempt {attempt + 1} failed ({error}); waiting {wait:.2f}s")
            sleep(wait)


class FakeStatusError(Exception):
    def __init__(self, status_code):
        super().__init__(f"HTTP {status_code}")
        self.status_code = status_code


def flaky(failures):
    queue = list(failures)

    def call():
        if queue:
            raise queue.pop(0)
        return "ok"

    return call


if __name__ == "__main__":
    print(backoff_delays(7))
    random.seed(7)
    no_wait = lambda seconds: None  # skip the real waiting in this demo
    print(call_with_retry(flaky([FakeStatusError(429), FakeStatusError(503)]), sleep=no_wait))
    try:
        call_with_retry(flaky([FakeStatusError(401)]), sleep=no_wait)
    except FakeStatusError as error:
        print("not retried:", error)` },
      { type: 'paragraph', text: `To use it with a real client, create the client with the SDK's own retries off and wrap the call. This needs a key, so it was only syntax-checked. Save it next to \`retry.py\`:` },
      { type: 'code', language: 'python', label: 'Python: real_retry.py (needs OPENAI_API_KEY)', code: `# real_retry.py: plug the wrapper into the OpenAI client. Needs OPENAI_API_KEY.
import os

from openai import OpenAI

from retry import call_with_retry

MODEL = os.environ.get("AGENT_MODEL", "gpt-6.2-astra")
client = OpenAI(max_retries=0)  # we retry ourselves, so the SDK must not retry too


def ask(question):
    response = call_with_retry(
        lambda: client.responses.create(model=MODEL, input=question, max_output_tokens=300)
    )
    return response.output_text


print(ask("Do you repair e-bikes?"))` },
      { type: 'paragraph', text: `Read \`retry.py\` in this order. \`backoff_delays\` is a pure function you can test: it gives the longest allowed wait before each retry. \`is_retryable\` says no to a 401 and yes to 429, 5xx and a lost connection. \`call_with_retry\` tries up to \`tries\` times; on a retryable failure it waits a random time between 0 and the ceiling, and on the last attempt or a non-retryable error it re-raises the error unchanged. The random generator is seeded in the demo only so that your output matches the expected output.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run locally with Python 3; the waits come from the seed 7)', code: `[1.0, 2.0, 4.0, 8.0, 16.0, 30.0, 30.0]
attempt 1 failed (HTTP 429); waiting 0.32s
attempt 2 failed (HTTP 503); waiting 0.30s
ok
not retried: HTTP 401` },
      { type: 'list', items: [
        'If your waits differ from the expected output, you changed the seed, the base or the cap. Without the seed, the waits are random each run.',
        'If a 401 keeps being retried, your is_retryable returns True for it. A wrong key cannot be fixed by waiting.',
        'If a real call seems to retry far more than you wrote, you left the SDK\'s max_retries on its default of 2. Create the client with max_retries=0 when you use your own layer.',
        'If a 429 never clears, read the error body: a spend or billing limit needs a person, not another retry.',
        'If the program waits a long time in a test, pass a fake sleep function, as the demo does.',
      ] },
      { type: 'warning', text: 'Every retry is another paid request, and a failed request still counts against your limit. Always cap attempts and total time, never retry in a tight loop without a wait, and be careful about retrying anything that has a side effect. Do not log keys or customer text when you record a failed call: log the status and request id.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: change the demo to fail five times with tries=4, and watch what the wrapper does on the last attempt.',
        'Next lesson, "Model Selection, Cost, and Latency Optimization", shows how to keep calls (and retries) cheap and fast.',
        'Read the rate-limits guide of your vendor, and write down the names of the headers it uses.',
      ] },
      { type: 'takeaways', items: [
        'Retry only what waiting can fix: 429 (not a spend limit), 5xx and connection failures. Fix 400, 401, 403 and 404.',
        'Wait longer after each failure (exponential backoff), add randomness (jitter), and follow Retry-After when it is given.',
        'Cap attempts and total time, and end with a safe failure: a clear message, a log with the request id, perhaps a queue.',
        'The SDKs already retry twice by default; if you write your own retry layer, set max_retries to 0 to avoid nested loops.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-23-code-challenge-1',
          kind: 'code-challenge',
          title: 'Backoff with jitter',
          prompt: 'Write `jitteredDelays(tries, base, cap, randoms)`. For each attempt `n` from 0 to `tries - 1`, the ceiling is `Math.min(cap, base * Math.pow(2, n))` and the wait is `randoms[n] * ceiling`. Return the array of waits. `randoms` is a list of numbers between 0 and 1 that stands in for a random generator, so the result is predictable. (A plain function; no network and no model.)',
          concept: 'exponential backoff with full jitter',
          language: 'javascript',
          starter: `function jitteredDelays(tries, base, cap, randoms) {
  const delays = [];
  // for each attempt, compute the ceiling and multiply it by randoms[n]
  return delays;
}`,
          solution: `function jitteredDelays(tries, base, cap, randoms) {
  const delays = [];
  for (let n = 0; n < tries; n++) {
    const ceiling = Math.min(cap, base * Math.pow(2, n));
    delays.push(randoms[n] * ceiling);
  }
  return delays;
}`,
          tests: {
            kind: 'function',
            fn: 'jitteredDelays',
            cases: [
              { label: 'no randomness (always the full ceiling)', args: [4, 1, 30, [1, 1, 1, 1]], expected: [1, 2, 4, 8] },
              { label: 'half of each ceiling', args: [3, 2, 30, [0.5, 0.5, 0.5]], expected: [1, 2, 4] },
              { label: 'the cap limits the ceiling', args: [5, 1, 5, [1, 1, 1, 1, 1]], expected: [1, 2, 4, 5, 5] },
              { label: 'no waiting at all when the random value is 0', args: [3, 1, 30, [0, 0.25, 1]], expected: [0, 0.5, 4], hidden: true },
            ],
          },
          hints: [
            'Loop `n` from 0 up to `tries - 1`, and push one number per attempt.',
            'The ceiling for attempt `n` is `base * Math.pow(2, n)`, but never more than `cap`: use `Math.min`.',
            'The wait is `randoms[n] * ceiling`. With a random value of 1 you get the full ceiling, with 0 you get no wait.',
          ],
          explanation: 'Backoff doubles the allowed wait each time up to a cap, and jitter picks a random point below that ceiling so many clients do not retry together. Passing the random values in makes the function easy to test.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-23-fix-bug-1',
          kind: 'fix-bug',
          title: 'Retrying a wrong key',
          prompt: 'This function decides whether to retry a failed call from its HTTP status. It currently says to retry a 401, so the program waits and tries a wrong key again and again. Fix the one wrong line. (A plain function; no network.)',
          concept: 'which errors are worth retrying',
          language: 'javascript',
          code: `function isRetryable(status) {
  if (status === 408 || status === 409 || status === 429) {
    return true;
  }
  if (status >= 400) {
    return true;
  }
  return false;
}`,
          bugLine: 5,
          fixes: [
            { line: `  if (status >= 500) {`, correct: true, why: 'Only server-side failures (500 and above) are worth retrying. 400, 401, 403 and 404 need a fix, not a wait.' },
            { line: `  if (status >= 300) {`, correct: false, why: 'This still includes every 4xx error such as 401 and 404.' },
            { line: `  if (status > 600) {`, correct: false, why: 'No real status is above 600, so server errors such as 500 and 503 would never be retried.' },
          ],
          tests: {
            kind: 'function',
            fn: 'isRetryable',
            cases: [
              { label: 'rate limit', args: [429], expected: true },
              { label: 'wrong key', args: [401], expected: false },
              { label: 'server error', args: [503], expected: true },
              { label: 'model not found', args: [404], expected: false, hidden: true },
            ],
          },
          hints: [
            'Which statuses can succeed on a later try? Think about who has to change something.',
            'Line 5 treats every status of 400 or more as retryable, which includes 401 and 404.',
            'Keep the explicit 408, 409 and 429 checks, and make the general check only for server errors.',
          ],
          explanation: 'The three client-side statuses that can pass later (408, 409, 429) are listed on their own. Everything else below 500 is a problem with your request or your key, which waiting cannot fix.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-23-scenario-1',
          kind: 'scenario',
          title: 'Retry-After says twenty seconds',
          prompt: 'Choose how the retry layer behaves.',
          concept: 'honouring Retry-After',
          situation: 'Mika\'s assistant receives a 429. The response has a Retry-After header of 20 seconds. The retry wrapper\'s own backoff would wait about 2 seconds for this first retry.',
          options: [
            { text: 'Wait at least the 20 seconds from the header (adding a little jitter), then retry within the attempt cap.', consequence: 'The vendor said when capacity returns, so the retry is likely to pass and does not add a failed request to the limit.', quality: 'best' },
            { text: 'Use the larger of the header and the wrapper\'s own wait, and add jitter to it.', consequence: 'This is the same as the best answer in practice. It respects the vendor\'s minimum and also keeps the spread between clients.', quality: 'acceptable' },
            { text: 'Ignore the header and retry after 2 seconds, since the wrapper already has a schedule.', consequence: 'The retry arrives before the vendor said it would be accepted, fails again, and the failed requests count against the limit.', quality: 'poor' },
            { text: 'Retry immediately three times to find a moment when a request gets through.', consequence: 'Each failed request counts against the limit, so this keeps the assistant locked out and adds load.', quality: 'poor' },
          ],
          hints: [
            'What does the header tell you that your own schedule cannot know?',
            'A retry that arrives too early fails and makes the limit last longer.',
            'The vendor docs say the header states the minimum time to wait.',
          ],
          explanation: 'Retry-After is the vendor telling you the earliest sensible retry. Waiting at least that long, with jitter, is both polite and effective. Retrying early only adds failed requests to the count.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-23-q1',
        prompt: 'Your agent calls the model and gets an AuthenticationError (HTTP 401). What should the code do?',
        choices: [
          'Retry with backoff up to the cap, because most errors clear within a minute or two on their own.',
          'Retry once immediately, then switch to a different model with the same key.',
          'Wait for the Retry-After header and then send the identical request again.',
          'Stop and report it. The key is wrong or revoked, and waiting will not fix that.',
        ],
        answer: 3,
        explanation: 'A 401 is a problem with the credentials, so repeating the same request fails the same way. It is the clearest example of an error that is not worth retrying.',
      },
      {
        id: 'building-ai-agents-23-q2',
        prompt: 'A hundred copies of your agent all get a 429 at the same second. Each retries after exactly 1 second, then 2, then 4. What goes wrong, and what fixes it?',
        choices: [
          'Nothing goes wrong, because waiting 1, 2 and 4 seconds always gives the service enough time to recover.',
          'The copies retry in the wrong order, so each one should pick a different base wait.',
          'They all retry at the same moments and hit the service together again and again. Adding jitter spreads the retries out.',
          'The backoff grows too slowly, so the first wait should be set to the cap.',
        ],
        answer: 2,
        explanation: 'Identical waits keep the copies in step, so the same burst returns each time. A random wait below the backoff ceiling spreads them out.',
      },
      {
        id: 'building-ai-agents-23-q3',
        prompt: 'You wrote a retry wrapper with 4 attempts, but you left the SDK client with its default of 2 retries. In the worst case, how many requests can one call to your wrapper send?',
        choices: [
          'At most 4, because the SDK only counts requests that you wrote yourself.',
          'Up to 12: each of your 4 attempts can itself be 3 requests (1 plus 2 SDK retries).',
          'At most 6, because the SDK\'s retries are added once to the end of all of your own attempts.',
          'Exactly 2, because the SDK\'s setting replaces your own cap.',
        ],
        answer: 1,
        explanation: 'The two layers multiply: each of your 4 attempts is a call that the SDK may send up to 3 times. That is why you set max_retries to 0 when you add your own layer.',
      },
      {
        id: 'building-ai-agents-23-q4',
        audience: { max: 'beginner' },
        prompt: 'An API answers with status 429. In plain words, what does it mean, and what should your program do?',
        choices: [
          'Your key is wrong, so you should create a new one right away.',
          'The model does not exist, so you should look for another model and update its name.',
          'You sent too many requests for now, so you should wait and then try again.',
        ],
        answer: 2,
        explanation: '429 is the "too many requests" status. Waiting, with backoff, usually fixes it. A wrong key is 401 and a missing model is 404.',
      },
      {
        id: 'building-ai-agents-23-q5',
        audience: { min: 'advanced' },
        prompt: 'Your wrapper retries 429s for ten minutes in a night job and every attempt fails. The error body mentions a spend limit, and there is no retry-after header. What is the right design change?',
        choices: [
          'Increase the backoff cap so the job waits longer between attempts and eventually gets through.',
          'Treat that case as non-retryable after a small cap: stop, alert a person, and queue the work until access is restored.',
          'Remove the cap, because a limit that is part of the account will clear on its own at some point.',
          'Switch the job to a smaller model every time a 429 appears, since the limit is tied to the model and a smaller one has more room.',
        ],
        answer: 1,
        explanation: 'A spend limit does not clear by waiting, and the Claude docs say retries keep failing until access resumes. Stop quickly, alert a person and keep the work for later. Longer waits or no cap only waste time.',
      },
    ],
    task: {
      title: 'Make the wrapper fail on purpose',
      minutes: 18,
      steps: [
        'Save retry.py and run it. Check that your output matches the expected output.',
        'Change it and observe: make `flaky` fail five times with the default `tries=4`. What does the wrapper do on its last attempt, and which exception reaches the caller?',
        'Change `base` to 0.5 and `cap` to 2, run with several failures, and read the waits. How do the waits change?',
        'Add support for a `retry_after` attribute on the error: if it exists, wait at least that many seconds. Test it with a FakeStatusError that has `retry_after = 5`.',
        'Write two sentences: what message would your assistant show a customer after the last attempt, and what would you log?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the flow chart from the lesson on paper, and mark which path a 401 takes and which path a 503 takes. Then ask an assistant to check your drawing, and compare it with the lesson\'s diagram.'] },
      { audience: { min: 'advanced' }, steps: ['Add a total-time budget (for example 20 seconds across all attempts) and make the wrapper stop when the next wait would exceed it. Write a test with a fake clock and explain why attempts alone are not enough for a chat that a person is waiting on.'] },
    ],
  },
  {
    id: 'building-ai-agents-24',
    day: 24,
    title: 'Model Selection, Cost, and Latency Optimization',
    summary: 'Count what a finished task really costs in calls and tokens, then cut cost and waiting time with measurements instead of guesses.',
    intro: {
      objectives: [
        'Explain why an agent\'s cost and latency are multiplied by its number of steps, using calls and tokens in relative terms',
        'Record usage per step and per model with a small ledger, and find the step that costs the most',
        'Choose among levers (a smaller model for easy steps, shorter inputs, caching, a call budget) and name what each one risks',
      ],
      why: 'A single call is cheap and fast. An agent makes many calls for every customer message, so small waste adds up. Measuring first lets you speed an agent up and make it cheaper without making it worse.',
    },
    minutes: 22,
    skills: ['agent-llm-apis'],
    body: [
      { type: 'paragraph', text: `One call to a model is quick and cheap. An agent makes many calls for every message a customer sends. So which of those calls need your strongest model, and how do you know what a whole task costs and how long it takes? This lesson gives you a way to measure and a short list of levers. It uses relative terms only: prices and limits differ by vendor, model and account, and they change, so read them on each vendor's own page.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Mika's assistant now handled each customer message in five calls: classify the message, extract the bike model, make a plan, write the reply and check it. All five used the same large model. Customers noticed the delay, and Mika noticed the usage page. Dennis added a ledger that recorded the model, the tokens in and the tokens out for each step. It showed that the two easy steps, classify and extract, needed a one-word answer but were each sent the whole repair guide as instructions, so most of their tokens were input. He made three changes, one at a time: a smaller model for those two steps, a much shorter prompt for them, and a cache for the questions about opening hours that arrived word for word, again and again. After each change he re-ran his ten test questions and compared quality as well as tokens and time. Only one of the three changes made quality worse, and the ledger showed which.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Cost** of a call depends on the model and on the **tokens** in (everything you send: rules, history, tools, documents) and tokens out (what the model writes). **Latency** is the time you wait, and it grows with the number of tokens written and with the number of calls that must happen one after another. An agent multiplies both: a task of five steps is five calls, each of which resends context, and a longer history makes every later call heavier. So measure **per finished task**, not per call.` },
      { type: 'paragraph', text: `The baseline is the simplest thing that works: one model, no cache, no router. Add a lever only when your measurements point at a problem. Each lever has a price, shown in the table.` },
      { type: 'table', headers: ['Lever', 'What it saves', 'What it risks or costs'], rows: [
        ['A smaller or faster model for easy steps (classify, extract, route)', 'Cost and waiting time on those steps', 'Lower quality on edge cases; you need stored test cases for each step, and one more model to track'],
        ['Shorter instructions and trimmed history', 'Input tokens on every call', 'Dropping something the model needed; test after each cut'],
        ['A ceiling on output length, and asking for short answers', 'Output tokens and waiting time', 'Answers cut off at the ceiling (lesson 20)'],
        ['Fewer calls: one call that returns classify and extract together as JSON', 'Whole calls and their waiting time', 'A bigger prompt, and a failure now affects two things'],
        ['Your own cache of exact repeats', 'Entire calls for repeated inputs', 'Stale answers; privacy if the cache keys hold personal data; never cache answers that must be fresh'],
        ['The vendor\'s caching of a repeated prompt prefix', 'Input tokens for a long shared prefix', 'Vendor-specific rules; read the docs and watch the cache fields in usage (lesson 20)'],
        ['A batch service for work that can wait', 'Cost, for non-urgent jobs', 'Results arrive later, so not for a customer waiting in a chat'],
        ['A call budget per task', 'A runaway loop', 'Tasks stop early; choose the budget from measurements'],
      ], caption: 'Read each row as a trade. Every lever buys speed or savings with something: quality, freshness, privacy or delay.' },
      { type: 'diagram', format: 'mermaid', source: `flowchart TD
  A[A step arrives] --> B{Seen this exact input?}
  B -->|yes| C[Return the cached result]
  B -->|no| D{Is it an easy step?}
  D -->|yes| E[Small model]
  D -->|no| F[Large model]
  E --> G[Record tokens in the ledger]
  F --> G
  G --> H[Save to the cache]`, caption: 'This is the router you build below. Look at the order: the cache is asked before any model, and every real call is recorded.' },
      { type: 'paragraph', text: `**Measure first.** Keep a ledger: for every call, record the step, the model, the tokens in and out, and the time taken. Run a fixed set of test cases through the agent. Find the step with the largest share of tokens or time. Change one thing. Run the same test cases again and compare quality as well as cost and speed. If you change three things at once you will not know which one helped or hurt. Both vendors can also count the tokens of a request before you send it (OpenAI with an input-token count call, Claude with \`count_tokens\`), which helps you check that a prompt fits and see what a long document adds.` },
      { type: 'paragraph', text: `**Model tiers.** Vendors offer models of different sizes and describe them for different jobs. For example, the Claude models page describes its smallest listed model as suited to high-volume, latency-sensitive tasks such as classification, extraction and routing, and OpenAI's models page describes its most efficient model as suited to high volume. Treat such descriptions as a starting point for your shortlist, not as a result: only your test cases show whether a smaller model is good enough for your step. And never send a step that affects safety or money to a smaller model without testing it first.` },
      { type: 'paragraph', text: `**A word on caching.** There are two kinds. Your own cache stores the final answer for an exact repeat of an input, so the call does not happen at all. The vendor's prompt caching lets a long, repeated prefix of your request be reused, which shows up as cache fields in the usage. They solve different problems, and both can go wrong: a cache that returns a stale price, or one customer's answer to another customer, is worse than no cache.` },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: use the cheapest worker who can do each job well. You would not ask the shop's best mechanic to sweep the floor. The code below has a small model for easy jobs and a large model for hard jobs, and \`STEP_TIER\` says which job goes where. \`Router.run\` first checks the cache: if it has already answered the exact same question, it returns that answer and makes no call. Otherwise it picks the model, makes the call and writes the numbers into \`usage\`: how many calls, and how many tokens in and out, for each model. \`max_calls\` stops the program if it makes too many calls. At the bottom it runs three steps and prints the totals.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `At scale, put the ledger in your tracing (module 11 covers tracing) with the step, model, tokens, cache hit and latency as attributes, so you can answer "what did this task cost and where did the time go?" from data. Watch tail latency, not only averages, because a customer feels the slow ones. Parallel calls can cut waiting time but not cost, and add rate-limit pressure and failure handling. Treat a router as a model of its own: it has an error rate, so give it an evaluation set, a safe default (the large model for unknown steps, as in the code) and a way to turn it off. Finally, set budgets at three levels: calls per task, tokens per task, and spend per day for the service.` },
      { type: 'version', text: 'Checked against the Claude models overview (it describes its smallest listed model as suited to high-volume, latency-sensitive tasks such as classification, extraction and routing), the OpenAI models page (it lists gpt-6.2-astra, gpt-6.2-sol, gpt-6.1-terra and gpt-6-luna, and describes gpt-6-luna as the most efficient, for high volume), the token-counting pages of both vendors (OpenAI `client.responses.input_tokens.count`, Claude `client.messages.count_tokens`) and OpenAI\'s rate-limits guide (it mentions a Batch API for non-urgent work). Model names, tiers and descriptions change: read the current pages. No prices are given here on purpose.', checked: CHECKED, sources: [DOCS.claudeModels, DOCS.openaiModels, DOCS.openaiTokens, DOCS.claudeTokens, DOCS.openaiRates] },
      { type: 'heading', text: 'Build it' },
      { type: 'paragraph', text: `You will build a small router with a cache, a usage ledger and a call budget. It needs no key: it uses the ScriptedModel from lesson 17 (keep \`scripted_model.py\` in the same folder). The two model ids are placeholders that you set with environment variables; with a real client you would use current ids from the vendors' pages. Save this as \`router.py\`.` },
      { type: 'code', language: 'python', label: 'Python: router.py (runs with no key)', code: `# router.py: a small model for easy steps, a large one for hard steps, a cache, a ledger and a budget.
# Runs with no key: the ScriptedModel (lesson 17) stands in for the real client.
import os
from collections import defaultdict

from scripted_model import ScriptedModel

# Ids live in one place. Use current ids from the vendor's models page.
TIERS = {"small": os.environ.get("AGENT_MODEL_SMALL", "small-model-id"),
         "large": os.environ.get("AGENT_MODEL_LARGE", "large-model-id")}
STEP_TIER = {"classify": "small", "extract": "small", "plan": "large", "write_reply": "large"}


class Router:
    def __init__(self, client, max_calls=50):
        self.client, self.max_calls, self.cache = client, max_calls, {}
        self.usage = defaultdict(lambda: {"calls": 0, "in": 0, "out": 0})  # per model

    def run(self, step, text):
        model = TIERS[STEP_TIER.get(step, "large")]  # unknown steps get the safe, large model
        key = (model, step, text)
        if key in self.cache:  # exact repeat: no new call, no new tokens
            return self.cache[key]
        if sum(row["calls"] for row in self.usage.values()) >= self.max_calls:
            raise RuntimeError("call budget used up")  # a hard stop beats a surprise
        response = self.client.responses.create(model=model, input=text)
        row = self.usage[model]
        row["calls"] += 1
        row["in"] += response.usage.input_tokens
        row["out"] += response.usage.output_tokens
        self.cache[key] = response.output_text
        return response.output_text


router = Router(ScriptedModel(["repair", "Please bring the bike in on Tuesday and we will check the brakes."]), max_calls=3)
router.run("classify", "My brake lever feels loose.")
router.run("classify", "My brake lever feels loose.")  # served from the cache
router.run("write_reply", "Write a short reply about a loose brake lever.")
for model, row in router.usage.items():
    print(model, row)` },
      { type: 'paragraph', text: `Read it in this order. \`TIERS\` and \`STEP_TIER\` are the only places that name models and say which step uses which tier, so a change is one line. \`run\` asks the cache first; then it checks the call budget; then it makes the call and records the tokens. The ScriptedModel's token counts are a rough word count, only to match the shape, so the numbers show how the ledger works, not what a real model would use. Unknown steps go to the large model on purpose: a safe default.` },
      { type: 'heading', text: 'Run it and check' },
      { type: 'code', language: 'text', label: 'Expected output (real: this was run locally with Python 3; the token numbers are the stand-in\'s word counts)', code: `small-model-id {'calls': 1, 'in': 5, 'out': 1}
large-model-id {'calls': 1, 'in': 9, 'out': 13}` },
      { type: 'list', items: [
        'If you see two calls for the small model, the two classify inputs were not exactly equal (a space or a capital letter differs), so the cache missed. Exact caches only match identical input.',
        'If you see "call budget used up", you made more calls than max_calls allows. Raise it deliberately, after checking why the task needs so many.',
        'If you get a KeyError for a model, a step name is missing in STEP_TIER or the tier name is misspelled in TIERS.',
        'If a ScriptedModel error says it has no more replies, your steps made more real calls than you prepared replies for. Add replies or reduce the steps.',
        'If you move a step to the small model and quality drops, do not tune the numbers by hand: run your stored cases for that step on both models and compare.',
      ] },
      { type: 'warning', text: 'A cache can leak or go stale. Never use text with personal details as part of a long-lived cache key, never share a cache between customers for answers that depend on their data, give entries an expiry, and do not cache answers that must be fresh (prices, stock, appointments). A router and a cache are code you must test like any other. Keep a call budget so a loop cannot run up usage by itself.' },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Today: add a "check" step to STEP_TIER, run a task of five steps through the router, and read the ledger.',
        'Next, project P1, "Build a Basic AI Agent", puts the whole module together: a model call, structured JSON, validation, retries and a ScriptedModel path.',
        'Read the models page of your vendor, and write one sentence about each model tier you might use.',
      ] },
      { type: 'takeaways', items: [
        'An agent multiplies cost and latency by its number of calls, so measure per finished task, in tokens and time.',
        'Keep a ledger of step, model, tokens and time; change one thing at a time and re-run the same test cases.',
        'Levers are trades: a smaller model risks quality, a cache risks stale or private data, shorter prompts risk missing facts.',
        'Start with one model; add a router only when measurements show easy and hard steps, and test the router like any other part.',
        'Add budgets (calls, tokens, time) so a loop cannot spend without limit.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-24-code-challenge-1',
          kind: 'code-challenge',
          title: 'Build the ledger',
          prompt: 'Write `summarizeUsage(records)`. Each record is `{ model, input, output }`. Return an object with one key per model, whose value is `{ calls, input, output }`: the number of records for that model and the sums of its input and output. (Hand-written records stand in for real usage data; no model is called.)',
          concept: 'token accounting per model',
          language: 'javascript',
          starter: `function summarizeUsage(records) {
  const totals = {};
  // add each record to the totals of its model
  return totals;
}`,
          solution: `function summarizeUsage(records) {
  const totals = {};
  for (const record of records) {
    if (!totals[record.model]) {
      totals[record.model] = { calls: 0, input: 0, output: 0 };
    }
    totals[record.model].calls += 1;
    totals[record.model].input += record.input;
    totals[record.model].output += record.output;
  }
  return totals;
}`,
          tests: {
            kind: 'function',
            fn: 'summarizeUsage',
            cases: [
              { label: 'one model, two calls', args: [[{ model: 'small', input: 10, output: 2 }, { model: 'small', input: 5, output: 1 }]], expected: { small: { calls: 2, input: 15, output: 3 } } },
              { label: 'two models', args: [[{ model: 'small', input: 10, output: 2 }, { model: 'large', input: 40, output: 30 }]], expected: { small: { calls: 1, input: 10, output: 2 }, large: { calls: 1, input: 40, output: 30 } } },
              { label: 'no records', args: [[]], expected: {} },
              { label: 'mixed order', args: [[{ model: 'a', input: 1, output: 1 }, { model: 'b', input: 2, output: 2 }, { model: 'a', input: 3, output: 3 }]], expected: { a: { calls: 2, input: 4, output: 4 }, b: { calls: 1, input: 2, output: 2 } }, hidden: true },
            ],
          },
          hints: [
            'Start with an empty object. For each record, look at `totals[record.model]`.',
            'If that entry does not exist yet, create it as `{ calls: 0, input: 0, output: 0 }`.',
            'Then add 1 to `calls` and add the record\'s `input` and `output` to the sums.',
          ],
          explanation: 'A ledger is a running total per key. Counting calls and both token directions per model is what lets you see which step or model uses the most, before you change anything.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-24-fix-bug-1',
          kind: 'fix-bug',
          title: 'The cache that mixes up steps',
          prompt: 'This runner caches results by key and counts real model calls. Two different steps that happen to get the same text must be separate cache entries, but the key uses only the text, so the second step wrongly gets the first step\'s answer. Fix the one wrong line. (A plain function with a stand-in "model": it just builds a string.)',
          concept: 'cache keys must include everything that changes the answer',
          language: 'javascript',
          code: `function runAll(jobs) {
  const cache = new Map();
  const answers = [];
  for (const job of jobs) {
    const key = job.text;
    if (!cache.has(key)) {
      cache.set(key, job.step + ': ' + job.text);
    }
    answers.push(cache.get(key));
  }
  return answers;
}`,
          bugLine: 5,
          fixes: [
            { line: `    const key = job.step + '|' + job.text;`, correct: true, why: 'The key now holds both the step and the text, so the same text under a different step gets its own entry.' },
            { line: `    const key = job.step;`, correct: false, why: 'This ignores the text, so different questions to the same step would share an answer.' },
            { line: `    const key = job.text.length;`, correct: false, why: 'Different texts with the same length would collide, and the step is still missing.' },
          ],
          tests: {
            kind: 'function',
            fn: 'runAll',
            cases: [
              { label: 'same text, different steps', args: [[{ step: 'classify', text: 'hello' }, { step: 'reply', text: 'hello' }]], expected: ['classify: hello', 'reply: hello'] },
              { label: 'an exact repeat', args: [[{ step: 'classify', text: 'a' }, { step: 'classify', text: 'a' }]], expected: ['classify: a', 'classify: a'] },
              { label: 'same step, different text', args: [[{ step: 'classify', text: 'a' }, { step: 'classify', text: 'b' }]], expected: ['classify: a', 'classify: b'], hidden: true },
            ],
          },
          hints: [
            'What does the answer depend on? Think about the inputs of a call.',
            'Here the answer depends on both the step and the text, but the key holds only one of them.',
            'Build the key from both, with a separator between them.',
          ],
          explanation: 'A cache key must contain every input that can change the answer: here the step and the text, and in a real agent also the model and the instructions. A key that is too short returns the wrong answer without any error.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'building-ai-agents-24-scenario-1',
          kind: 'scenario',
          title: 'Which step moves first?',
          prompt: 'Choose which step to try on a smaller model first.',
          concept: 'choosing steps for a smaller model',
          situation: 'Mika\'s assistant has four steps: (1) classify the message as hours, repair, parts or other; (2) decide whether a repair request is a safety problem that needs a person at once; (3) write the reply; (4) extract the bike model from the message. The ledger shows all four use the same large model, and the owner wants it cheaper and faster. Dennis has stored test cases for each step.',
          options: [
            { text: 'Try the smaller model on step 1 (classify) and run its stored test cases, comparing quality, tokens and time with the large model, before changing anything else.', consequence: 'Classification has a short, checkable answer and a clear test. Dennis learns quickly whether the smaller model is good enough, and what it saves.', quality: 'best' },
            { text: 'Move step 4 (extract the bike model) first, since it also has a short answer, and test it the same way.', consequence: 'A sensible second candidate. It is short and checkable too, but classification is usually called more often, so it saves more.', quality: 'acceptable' },
            { text: 'Move step 2 (the safety check) to the smaller model first, because a yes-or-no answer is the simplest.', consequence: 'A missed safety problem is the costliest mistake in the whole flow. Moving it first, before the easy steps, risks harm for a small saving.', quality: 'poor' },
            { text: 'Move all four steps at once and see if anyone complains.', consequence: 'If quality drops, Dennis cannot tell which step caused it, and customers are the test cases.', quality: 'poor' },
          ],
          hints: [
            'Which step is easy to check with stored test cases and has the lowest cost of a mistake?',
            'Changing one thing at a time is the rule. Which single step is safest to change?',
            'A step that decides whether a person must act at once should be the last to move.',
          ],
          explanation: 'Start with a step that is simple, called often and easy to test, and measure before and after. A safety-related step should only move after tests prove the smaller model is good enough, and changing all steps at once removes the ability to tell what helped or hurt.',
        },
      },
    ],
    quiz: [
      {
        id: 'building-ai-agents-24-q1',
        prompt: 'Each call in Mika\'s agent is quick and small, yet customers wait a long time and the usage page grows fast. Which explanation fits what you learned?',
        choices: [
          'A single call can never be slow, so the delay must be caused by the customer\'s network and not by the agent.',
          'One customer message triggers many calls in a row, and each one resends the growing context, so time and tokens add up per task.',
          'The usage page counts every character twice, so the totals only look large because of how it is shown.',
          'Models answer more slowly as the number of customers grows, whatever the agent does.',
        ],
        answer: 1,
        explanation: 'An agent turns one message into several sequential calls, each carrying context. Cost and delay come from the whole chain, so you measure per finished task.',
      },
      {
        id: 'building-ai-agents-24-q2',
        prompt: 'You want to move the classification step to a smaller model. What should you do before you switch for real users?',
        choices: [
          'Run your stored test cases for that step on both models, and compare quality, tokens and time.',
          'Read the vendor\'s description of the smaller model, and switch if it mentions classification as a good use.',
          'Switch for one week and watch whether the support team receives more complaints.',
          'Ask the smaller model whether it is able to do classification, and trust its answer.',
        ],
        answer: 0,
        explanation: 'A vendor description is a hint for the shortlist, not a measurement of your task. Your own test cases give a comparison before any customer is affected.',
      },
      {
        id: 'building-ai-agents-24-q3',
        prompt: 'Your exact-match cache keeps answers keyed by the customer\'s message text. A message says "Where is my order 4411?" and another customer later sends the same words with a different order. What goes wrong?',
        choices: [
          'Nothing, because the second message has a different customer, and the cache always separates customers.',
          'The cache refuses to store text that contains numbers, so the second customer gets a fresh answer.',
          'The cache can return the first customer\'s answer to the second one, which is stale and may expose personal data.',
          'The model becomes slower for that message, because cached text is always compressed before use.',
        ],
        answer: 2,
        explanation: 'A cache returns whatever is stored for the key. If the key leaves out who is asking, or the answer depends on private data, it can show one customer\'s result to another. Cache only answers that are the same for everyone, and give them an expiry.',
      },
      {
        id: 'building-ai-agents-24-q4',
        audience: { max: 'beginner' },
        prompt: 'Why might you use a smaller model for an easy step such as sorting messages into types?',
        choices: [
          'It can be faster and cheaper for work that needs little reasoning, if your tests show the answers are still good enough.',
          'A smaller model never makes mistakes, so it is always the safest choice for every step, however hard or important the step is, so no testing is needed.',
          'A smaller model does not need instructions, so you can leave them out.',
        ],
        answer: 0,
        explanation: 'Smaller models can suit simple jobs, but only your own test cases show whether the quality is enough. They still need instructions and still make mistakes.',
      },
      {
        id: 'building-ai-agents-24-q5',
        audience: { min: 'advanced' },
        prompt: 'Your agent is slow and costly, and the team suggests four changes at once: a smaller model, shorter prompts, a cache and parallel calls. What is the strongest first step?',
        choices: [
          'Apply all four, since they are independent and each will help, and measure the total improvement afterwards instead of one at a time.',
          'Start with parallel calls, because latency is always the main problem and cost can be dealt with later.',
          'Rewrite the agent as a single prompt so that there is only one call to optimise.',
          'Record usage and latency per step on a fixed test set, find the largest contributor, and change one thing at a time.',
        ],
        answer: 3,
        explanation: 'Per-step measurements show where the tokens and time go. One change at a time, with the same test set, shows which lever helped and which one hurt quality. Applying all four, or picking by assumption, removes that evidence.',
      },
    ],
    task: {
      title: 'Read your own ledger',
      minutes: 18,
      steps: [
        'Save router.py next to scripted_model.py and run it. Check that the output matches the expected output.',
        'Add three more steps to the demo: another classify with the exact same text, another with one extra space, and one for a step name that is not in STEP_TIER. Add the replies the ScriptedModel needs. Which ones hit the cache, and which model handles the unknown step?',
        'Change it and observe: set max_calls to 2 and run again. What happens, and what message would you show a customer when a task hits its budget?',
        'Change the cache key so that it does not include the step. Run two different steps with the same text. What goes wrong?',
        'Write two sentences: which step of your own agent would you try on a smaller model first, and which test cases would you run before you switch?',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Make a table on paper with your agent\'s steps, and for each step write: easy or hard, and what could go wrong if a smaller model did it. Ask an assistant to review your table, then decide for yourself.'] },
      { audience: { min: 'advanced' }, steps: ['Add per-step latency and a cache-hit counter to the ledger, and print a cost-per-task table that shows for each step its share of the tokens and of the time. Write a test where a task exceeds its call budget and check that the user-facing message contains no internal details.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'building-ai-agents-p1',
  title: 'Build a Basic AI Agent',
  summary: 'Write a small program that sends instructions and a customer message to a model, checks what comes back, and returns structured, validated JSON, with a ScriptedModel path so it can be built and tested without a paid API.',
  outcome: 'A small, tested program that calls a language model through one function, validates its JSON, survives bad replies and transient failures, and keeps its key out of the code: the base every agent in this course builds on.',
  unlockAfterDay: 24,
  steps: [
    {
      id: 'building-ai-agents-p1-s1',
      text: `Objectives. Build the first working piece of Mika's Bike Shop assistant: a function \`triage(message)\` that sends the customer's message and your instructions to a model, processes the response, and returns JSON that your code has validated: an intent, an urgency, whether a person is needed and a short reply. You will practise: one thin function for the model call, reading status and stop reasons, a schema with validation, a capped retry with the error message, retries with backoff and jitter for transient failures only, and tests that run with no API key.`,
    },
    {
      id: 'building-ai-agents-p1-s2',
      text: `Tools and resources. Python 3.10 or later. Install: \`pip install pydantic python-dotenv\`, plus \`pip install openai\` or \`pip install anthropic\` if you use a real model. Your own files from this module: \`scripted_model.py\` (lesson 17, with the ScriptedClaude class from lesson 19 if you want it), \`triage.py\` (lesson 21), \`retry.py\` (lesson 23), \`config.py\` and the .env setup (lesson 22). Pages to keep open: the quickstart and structured-outputs guides of your vendor (the links in each lesson's version note). No API key? Build and test everything against the ScriptedModel: it is a teaching stand-in that returns the replies you prepare, in the shape of a real result, so your loop, validation, retries and limits are all tested for free. A real model is optional, and the model id must live in one constant or the AGENT_MODEL variable. Never write a key in a file you commit.`,
      link: 'https://developers.openai.com/api/docs/quickstart',
    },
    {
      id: 'building-ai-agents-p1-s3',
      text: `Design the contract first (write it before you code). On paper or in a file: (1) your instructions to the model (its role, the rules, "reply with only the JSON object"); (2) your schema: the fields, their types and the allowed values (the lesson 21 schema is a starting point, and you must add or change at least one field of your own, for example a suggested next step); (3) the six sample customer messages you will test with, all invented: an opening-hours question, a repair request, a parts question, a message with a typo, a rude message and a message about a brake that may be a safety problem; (4) what the safe fallback is when the model's JSON cannot be validated (which message the customer sees, and that needs_human is true). Write one sentence for each choice: why this schema, why this fallback.`,
    },
    {
      id: 'building-ai-agents-p1-s4',
      text: `Build the core. In one file: a single function that is the only place your code calls the model (it takes the instructions and the messages, reads the key from the environment through your config, uses the model id from one constant, and sets a token ceiling); a function that turns the raw result into your own small result with the text, an outcome (done, cut_off, refused, tool_request or other) and token counts (lesson 20); and \`triage(message)\`, which asks, checks the outcome (a cut-off or a refusal is not a valid answer), parses and validates the JSON against your schema, and on invalid output retries with the validation error, up to a cap, before it returns your safe fallback. Return a validated object only; never return raw model text to the caller.`,
    },
    {
      id: 'building-ai-agents-p1-s5',
      text: `Errors and limits. Wrap the model call with your retry function from lesson 23: retry only transient failures (429 that can clear, 5xx, connection errors), use exponential backoff with jitter and a cap on attempts, fail fast on 400, 401, 403 and 404, and never run two retry layers (set the SDK's max_retries to 0 if you add your own). Add a hard limit on the whole of \`triage\` (a call budget or a time budget). When the limit or the retries are used up, return the safe fallback and record what happened (status or outcome, attempts, request id when you have one; never the key and never the customer's private text).`,
    },
    {
      id: 'building-ai-agents-p1-s6',
      text: `Test with the ScriptedModel. Write at least six tests that need no key, using prepared replies: (1) a valid reply on the first try; (2) invalid, then valid (check that the retry message contains the error); (3) invalid every time (check that you stop at the cap and return the fallback); (4) a reply that was cut off at the ceiling (outcome cut_off); (5) a refusal (outcome refused); (6) a non-retryable error that must not be retried, and a transient error that is retried and then succeeds (use a fake sleep so the tests are fast). Run all of them and paste the real output. Then, if you have a key, run your six sample messages against a real model once, and record which replies needed a retry. Do not present scripted replies as a real model's output: label each run "scripted" or "real".`,
    },
    {
      id: 'building-ai-agents-p1-s7',
      text: `Guided AI prompts (copy, replace the brackets with your own details, and always check the answer yourself). (1) "Here is my triage function and my schema: [paste]. Review it as a critic. List the ways the model's reply could still pass my validation and be wrong or unsafe, and the ways my retry loop could run longer than I intend." (2) "Here are my tests: [paste]. Which important failure is not covered? Do not write the tests for me; name the missing cases." (3) "Explain the difference between a reply that is valid and a reply that is correct, using my schema as the example." (4) "Review my retry function for these problems only: retrying errors that cannot succeed, missing jitter, no cap, nested retries with the SDK." Decide for yourself which suggestions to accept, and note in your submission what you changed and why. AI output is not a result: only your own test runs are.`,
    },
    {
      id: 'building-ai-agents-p1-s8',
      text: `Deliverables. Paste into the submission: (1) your code (the call function, the result mapping, \`triage\`, the retry wrapper, the tests); (2) your \`.env.example\` and \`.gitignore\` (never your \`.env\`); (3) the real output of your tests with the ScriptedModel, and, if you used a real model, a short run on your six sample messages marked "real"; (4) your instructions and schema from step 3; (5) notes: one failure you hit (a bad reply, a cut-off, an error) and exactly what you changed because of it; one thing you checked yourself and one thing you were unsure of; what the AI suggested and what you accepted or rejected; and what you would add next.`,
    },
    {
      id: 'building-ai-agents-p1-s9',
      text: `Assessment criteria. A reviewer checks that: the model is called through one thin function with the model id in one place, the key read from the environment and no key in the files; the code reads the status or stop reason and does not treat a cut-off or a refusal as a finished answer; the JSON is validated against a schema you designed, with a capped retry that sends the error back and a safe fallback after the cap; retries are for transient errors only, with backoff and jitter and no nested retry layers; the tests run with the ScriptedModel, cover the cases in step 6 and their real output is pasted; and your notes show what you verified and what you changed after a failure.`,
    },
    {
      id: 'building-ai-agents-p1-s10',
      text: `Common mistakes. Treating "the call returned" as "the answer is ready" and never reading the status or stop reason. Trusting JSON because a schema was sent to the API instead of validating it in your code. A retry loop with no cap, or one that sends the same request without the error message. Retrying a 401 or a 400. Writing the key in a file, a prompt or a log, or committing .env. Two retry layers (yours and the SDK's) multiplying attempts. A model id repeated in many places. Returning raw model text to the caller when validation failed. Tests that only cover the happy path, or scripted output presented as if a real model had produced it.`,
    },
    {
      id: 'building-ai-agents-p1-s11',
      audience: { max: 'beginner' },
      text: `A smaller, scaffolded version for beginners. Use only the ScriptedModel (no key, no vendor). Start from your \`triage.py\` of lesson 21 and change only these things: add one field of your own to the schema; write three sample messages and three prepared replies (one valid, one invalid then valid, one always invalid); and make the program print the result for each. Skip the backoff wrapper for now. In your notes, write in your own words what each of these does: the schema, the validation, the retry cap and the fallback. If a line of code is unclear, ask an assistant to explain it, then change something small and check that the output is what you predicted.`,
    },
    {
      id: 'building-ai-agents-p1-s12',
      audience: { min: 'advanced' },
      text: `Professional extension. Put both vendors behind one adapter that returns your own result type (text, outcome, token counts, request id, latency), and run the same stored test cases against each adapter (scripted for both; real for any you have a key for). Emit one structured log line per call with the model id, outcome, attempts, tokens and latency, and prove with a test that no customer text and no key can appear in it. Enforce three limits (attempts per call, calls per task, and a total time budget) and test each with a fake clock. Finish with a half-page threat note: what happens if a customer message contains instructions to the model, which fields you treat as untrusted, what a leaked key would cost and how you would respond, and what you would need before this ran with real customers.`,
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your code, test output and notes',
    placeholder: 'Paste your code (call function, result mapping, triage, retry wrapper, tests), your .env.example and .gitignore, the real output of your tests, your instructions and schema, and your notes (what failed, what you changed, what you checked, what AI suggested and what you decided).',
    hint: 'A good submission shows a working triage function with one thin model call, a schema you designed, validation with a capped retry and a safe fallback, retries for transient errors only, at least six passing tests with real pasted output (labelled scripted or real), a .gitignore that protects .env, and honest notes about a failure you hit and what you changed.',
  },
  rubric: [
    'The model is called through one thin function, with the model id in one place, the key read from the environment, a token ceiling set and no key in any file shown.',
    'The response is checked before it is used: status or stop reason is read, and a cut-off or a refusal is handled as its own outcome, not returned as an answer.',
    'The result is JSON validated against a schema the learner designed, with a capped retry that sends the error back and a safe fallback after the cap; invalid data is never passed on.',
    'Errors are handled by class: only transient failures are retried, with backoff, jitter and a cap; non-retryable errors fail fast; there is a single retry layer.',
    'Tests run against the ScriptedModel, cover success, invalid then valid, always invalid, cut-off, refusal and the two kinds of error, and their real output is pasted and labelled scripted or real.',
    'The notes show choices and verification: what failed, what the learner changed because of it, what they checked themselves, and which AI suggestions they accepted or rejected.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['The learner ran the ScriptedModel with three cases and can explain in their own words what the schema, the validation, the retry cap and the fallback do.'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The program was run against a real model at least once, and the notes compare what the real model did with what the scripted replies assumed; a business rule is checked after the schema.'] },
    { audience: { min: 'advanced' }, items: ['A thin adapter returns a vendor-neutral result, the logs carry outcome, attempts, tokens and latency without private text, and limits on attempts, calls and time are tested; a short threat note covers untrusted input and key exposure.'] },
  ],
};
