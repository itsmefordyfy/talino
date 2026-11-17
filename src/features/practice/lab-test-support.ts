import type { LabTask } from './types';

/**
 * Fixtures for the prompt-lab engine's tests. The real labs are written by the course's module authors (`practice/labs/module-NN.ts`), so the tests
 * never depend on them and nothing here ever goes into the real catalog. Every private field carries a unique marker, which is how the tests prove
 * it never reaches the phone.
 */
export const LAB_MARKERS = {
  system: 'SYSTEM-MARKER-you-are-a-careful-helper',
  keyValue: 'KEY-MARKER-the-parcel-was-held-at-customs',
  fact: 'FACT-MARKER-the-meeting-moved-to-thursday',
  fixtureResult: 'FIXTURE-MARKER-order-1042-shipped-on-monday',
  fixtureOther: 'FIXTURE-OTHER-MARKER-order-2077-is-packed',
  fixtureHours: 'FIXTURE-HOURS-MARKER-open-nine-to-five',
} as const;

const MATERIAL = 'Meeting notes, Tuesday. Dana will send the budget on Thursday. Rico owns the venue booking and has paid a deposit of 250 dollars. The team agreed to meet again next week.';

export const LAB_SUMMARY: LabTask = {
  id: 'lab-01-test-summary',
  kind: 'lab',
  title: 'Summarise the meeting',
  experiment: 'summarization',
  situation: 'You were away from a meeting and need the main points.',
  goal: 'Get a short summary that keeps the owners and the dates.',
  material: MATERIAL,
  starterPrompt: 'Summarise this.',
  system: LAB_MARKERS.system,
  maxRuns: 3,
  output: { format: 'text' },
  facts: [LAB_MARKERS.fact, 'Rico paid a deposit of 250 dollars', 'The team agreed to meet again next week'],
  criteria: [
    { id: 'audience', label: 'Says who the summary is for' },
    { id: 'length', label: 'Sets a length' },
    { id: 'keeps-owners', label: 'Asks to keep who owns what' },
  ],
  tips: ['Say who will read the summary.', 'Ask for a length.', 'Name what must not be lost.'],
  example: { prompt: 'Summarise the notes below for my manager in three bullets, keeping each owner and date.', outcome: 'Three short bullets that name Dana, Rico and the dates.' },
  verify: ['Every name appears in the notes.', 'Every number appears in the notes.'],
  difficulty: 'gentle',
};

export const LAB_CLASSIFY: LabTask = {
  id: 'lab-02-test-classify',
  kind: 'lab',
  title: 'Sort a support ticket',
  experiment: 'classification',
  situation: 'A support inbox needs each ticket sorted.',
  goal: 'Get a JSON answer with a category, an urgency flag and tags.',
  material: 'Ticket: my parcel has not arrived and it was meant to come last week. Please help, this is the second time I write.',
  starterPrompt: 'What is this ticket about?',
  system: LAB_MARKERS.system,
  maxRuns: 4,
  output: {
    format: 'json',
    fields: [
      { name: 'category', type: 'string', required: true, oneOf: ['billing', 'shipping', 'other'] },
      { name: 'urgent', type: 'boolean', required: true },
      { name: 'tags', type: 'string[]' },
      { name: 'reason', type: 'string' },
    ],
  },
  key: { category: 'shipping', urgent: true, tags: ['late', 'parcel'], reason: LAB_MARKERS.keyValue },
  criteria: [
    { id: 'labels', label: 'Lists the allowed labels' },
    { id: 'format', label: 'Asks for JSON with named fields' },
    { id: 'example', label: 'Gives one worked example' },
  ],
  tips: ['List the labels the model may choose from.', 'Ask for JSON only.', 'Show one example.'],
  example: { prompt: 'Classify the ticket as billing, shipping or other and reply with JSON fields category, urgent, tags.', outcome: 'A small JSON object with the three fields.' },
  verify: ['The category is one of the allowed labels.', 'The answer is valid JSON.'],
  difficulty: 'realistic',
};

export const LAB_COMPARE_PROMPTS: LabTask = {
  id: 'lab-03-test-prompts',
  kind: 'lab',
  title: 'Vague against specific',
  experiment: 'playground',
  situation: 'You want a short note to a neighbour about noise.',
  goal: 'See what a more specific prompt changes.',
  starterPrompt: 'Write a note about noise.',
  system: LAB_MARKERS.system,
  compare: 'prompts',
  maxRuns: 4,
  output: { format: 'text' },
  criteria: [
    { id: 'audience', label: 'Says who the note is for' },
    { id: 'tone', label: 'Sets a tone' },
    { id: 'length', label: 'Sets a length' },
  ],
  tips: ['Say who it is for.', 'Say the tone.', 'Say how long.'],
  example: { prompt: 'Write a friendly three-sentence note to my neighbour about late-night noise.', outcome: 'A short, polite note.' },
  verify: ['It does not invent facts about the neighbour.', 'It is the length you asked for.'],
  difficulty: 'gentle',
};

export const LAB_COMPARE_MODELS: LabTask = {
  id: 'lab-04-test-models',
  kind: 'lab',
  title: 'One task on two models',
  experiment: 'text-generation',
  situation: 'You need a short product blurb.',
  goal: 'Run one prompt on two model tiers and look at both.',
  starterPrompt: 'Write a product blurb.',
  system: LAB_MARKERS.system,
  compare: 'models',
  maxRuns: 4,
  output: { format: 'text' },
  criteria: [
    { id: 'product', label: 'Names the product and who it is for' },
    { id: 'length', label: 'Sets a length' },
    { id: 'tone', label: 'Sets a tone' },
  ],
  tips: ['Name the product.', 'Set a length.', 'Set a tone.'],
  example: { prompt: 'Write a two-sentence, upbeat blurb for a reusable water bottle aimed at hikers.', outcome: 'Two upbeat sentences about the bottle.' },
  verify: ['It claims nothing you cannot check.', 'It fits the length asked for.'],
  difficulty: 'realistic',
};

export const LAB_TOOLS: LabTask = {
  id: 'lab-05-test-tools',
  kind: 'lab',
  title: 'Ask the shop assistant',
  experiment: 'tool-use',
  situation: 'A shop assistant can look up an order and the opening hours.',
  goal: 'Get an answer that comes from a tool, not from guessing.',
  starterPrompt: 'Where is my order?',
  system: LAB_MARKERS.system,
  maxRuns: 3,
  output: { format: 'text' },
  tools: [
    {
      name: 'order_status',
      description: 'Looks up the status of an order by its number.',
      params: [{ name: 'order_id', type: 'string', description: 'The order number, for example 1042.' }],
      fixtures: [
        { args: { order_id: '1042' }, result: { status: LAB_MARKERS.fixtureResult, shipped: true } },
        { args: { order_id: '2077' }, result: { status: LAB_MARKERS.fixtureOther, shipped: false } },
      ],
    },
    {
      name: 'store_hours',
      description: 'Says when the shop is open on a day.',
      params: [{ name: 'day', type: 'string', description: 'A day of the week.' }],
      fixtures: [{ args: { day: 'monday' }, result: { hours: LAB_MARKERS.fixtureHours } }],
    },
  ],
  criteria: [
    { id: 'order-number', label: 'Gives the order number' },
    { id: 'ask-tool', label: 'Asks the assistant to look it up' },
    { id: 'no-guess', label: 'Says what to do when nothing is found' },
  ],
  tips: ['Give the order number.', 'Ask for a lookup.', 'Say what to do if nothing is found.'],
  example: { prompt: 'Look up order 1042 and tell me its status. If you cannot find it, say so.', outcome: 'The status from the lookup, or an honest "not found".' },
  verify: ['The answer matches what the tool returned.', 'It does not invent a status.'],
  difficulty: 'realistic',
};

export const ALL_TEST_LABS = [LAB_SUMMARY, LAB_CLASSIFY, LAB_COMPARE_PROMPTS, LAB_COMPARE_MODELS, LAB_TOOLS];

/** A test-only catalog lookup, the shape `findLab` has. */
const LABS = new Map(ALL_TEST_LABS.map((lab) => [lab.id, lab]));
export const findTestLab = (id: string) => LABS.get(id);

/** A prompt that is a real edit of every starter above (twelve words, none of the starter's). */
export const GOOD_PROMPT = 'Please write the answer for my manager in three short bullet points and keep every owner and every date.';
export const OTHER_GOOD_PROMPT = 'Reply with a friendly note for a busy neighbour in exactly three sentences and keep the tone calm and polite.';
