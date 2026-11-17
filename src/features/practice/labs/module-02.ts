import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 2 (`kind: 'lab'`). Written with the module's lessons; see docs/content/GENAI_BRIEF.md.
 * Every shop, family, person and number in the materials is invented. Server-only fields (`system`, `key`, `facts`) never say what a good prompt contains.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-02-slogan-twice',
    kind: 'lab',
    title: 'Run the same prompt twice',
    experiment: 'text-generation',
    situation: 'Joy owns Sunrise Café and wants slogan ideas for a new sign. You have a short list of true facts about the café. You will run one prompt twice, on purpose, to see what changes between runs and whether the model adds facts that nobody gave it.',
    goal: 'Write one prompt that gives slogan ideas using only the facts provided, then run it twice and compare the two answers for wording and for invented claims.',
    material:
      'SUNRISE CAFÉ: FACTS YOU MAY USE (fictional)\n' +
      '- A small neighbourhood café on Mill Lane, near the bus terminal.\n' +
      '- Opens at 6:00 AM, Monday to Saturday.\n' +
      '- Known for coffee roasted in small batches and for its warm ube rolls.\n' +
      '- Seats 24 people. Free refill on drip coffee before 9:00 AM.\n' +
      '- Owner: Joy.\n\n' +
      'NOT STATED in these notes: the year the café opened, any awards, any prices, the number of branches.',
    starterPrompt: 'Write a slogan for the café.',
    system: 'You are a helpful assistant for a small café. Follow the user’s request, using the café notes provided as your facts.',
    maxRuns: 4,
    output: { format: 'text' },
    criteria: [
      { id: 'brief', label: 'Says who the slogans are for, the tone and how many options to give' },
      { id: 'limit', label: 'Sets a length limit for each slogan' },
      { id: 'facts', label: 'Tells the model to use only the facts provided and not to add years, awards or prices' },
      { id: 'trace', label: 'Asks the model to name the fact each slogan uses, so you can check it' },
    ],
    tips: [
      'Ask for several slogans in one go, such as five. Variety is the point of this kind of task.',
      'Give a word limit, for example “under eight words each”, so the options are easy to compare.',
      'Name the things the model must not invent: the year the café opened, awards and prices are not in the notes.',
      'Ask for a short note beside each slogan saying which fact it comes from. Then the check takes seconds.',
    ],
    example: {
      prompt: 'Write five slogan ideas for Sunrise Café, for people on their way to work, in a warm and friendly tone, each under eight words. Use only the facts in the notes. Do not mention any year, award, price or number of branches. After each slogan, write in brackets which fact it uses.',
      outcome: 'Five short, warm slogans, for example about early mornings, small-batch coffee or the ube rolls, each followed by the fact it draws on. Run twice, the wording will differ, but both runs stay within the notes, with no invented year or award.',
    },
    verify: [
      'Compare the two runs: the wording may differ, which is normal.',
      'Check every claim in both runs against the notes. Anything about a year, an award, a price or a number of branches is invented.',
      'Each slogan relies only on a fact that is in the notes.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-02-latest-date',
    kind: 'lab',
    title: 'Find the final decision in a messy thread',
    experiment: 'structured-output',
    situation: 'A family is planning a reunion in a group chat. The date moved, the guest count grew and a deposit was paid. You need the final facts as clean data for the planner’s sheet, and the thread contains old and new versions side by side.',
    goal: 'Write a prompt that gets the final venue, date, guest count and deposit details as JSON, choosing the latest confirmed fact whenever the thread changed.',
    material:
      'HARPER FAMILY REUNION: PLANNING THREAD (fictional)\n' +
      'Mon 3 Feb, Ana: Let’s book Lakeview Hall for Saturday 14 June. About 60 guests.\n' +
      'Tue 4 Feb, Ben: Booked Lakeview Hall for 14 June. I paid the 5,000 deposit today.\n' +
      'Thu 20 Feb, Ana: Lakeview has a clash on 14 June. They offered Saturday 21 June instead and I said yes.\n' +
      'Fri 21 Feb, Ben: The hall says the deposit moves to the new date. Nothing more to pay now.\n' +
      'Mon 24 Feb, Cris: The cousins from the south are coming, so we should plan for 75 guests.\n' +
      'Wed 26 Feb, Ana: The hall also mentioned 28 June as a backup date, but we are not using it.\n' +
      'Fri 7 Mar, Ben: Reminder: the caterer is still not chosen.',
    starterPrompt: 'Give me the event details from this thread.',
    system: 'You read the text the user provides and answer with the JSON the user asks for and nothing else. Use only information found in the text.',
    maxRuns: 4,
    output: {
      format: 'json',
      fields: [
        { name: 'venue', type: 'string', required: true },
        { name: 'event_date', type: 'string', required: true, oneOf: ['14 June', '21 June', '28 June'] },
        { name: 'guests', type: 'number', required: true },
        { name: 'deposit_paid', type: 'number', required: true },
        { name: 'deposit_moved', type: 'boolean', required: true },
      ],
    },
    key: { venue: 'Lakeview Hall', event_date: '21 June', guests: 75, deposit_paid: 5000, deposit_moved: true },
    criteria: [
      { id: 'fields', label: 'Names each field exactly and says what type it is' },
      { id: 'latest', label: 'Says that when a fact changes, the latest confirmed one is the answer' },
      { id: 'unconfirmed', label: 'Says what to do with something that was suggested but not chosen' },
      { id: 'json', label: 'Asks for JSON only, with no extra text' },
    ],
    tips: [
      'List the five field names and their types in your prompt, so the answer arrives in the same shape every time.',
      'Tell the model that the thread changes over time, and that the most recent confirmed decision wins.',
      'A date that was only mentioned as a backup is not the event date. Say how a backup date should be treated.',
      'After the run, read the thread from the top and write the true value of each field before you look at the model’s answer.',
    ],
    example: {
      prompt: 'Read the planning thread below. Return only JSON with these fields: venue (text), event_date (text, one of the dates in the thread), guests (number), deposit_paid (number), deposit_moved (true or false). The thread changes over time: always use the latest confirmed decision, and ignore dates or numbers that were only suggested or kept as a backup.',
      outcome: 'A small JSON object with the venue, the date that replaced the original one, the latest guest count and the deposit amount, and a true or false for whether the deposit moved. The first date and the backup date are not used.',
    },
    verify: [
      'event_date is the date the hall and Ana agreed to later in the thread, not the first one mentioned.',
      'guests is the latest count in the thread, not the first estimate.',
      'The backup date appears nowhere as the answer.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-02-laundry-faq',
    kind: 'lab',
    title: 'Does it say “not in the document”?',
    experiment: 'document-analysis',
    situation: 'A customer of Sunbeam Laundry has asked two questions by message: how long standard service takes, and whether the shop is open on public holidays. You have the shop’s FAQ. One question is answered in it. The other is not.',
    goal: 'Write a prompt that answers from the FAQ only, quotes the sentence it used, and clearly says when the FAQ does not say, instead of guessing.',
    material:
      'SUNBEAM LAUNDRY: CUSTOMER FAQ (fictional)\n' +
      'Opening hours: Monday to Friday 7:00 AM to 7:00 PM. Saturday 8:00 AM to 4:00 PM.\n' +
      'Wash and fold: ₱60 per kilo, with a minimum of 3 kilos per order.\n' +
      'Turnaround: standard service is ready in 24 hours. Rush service is ready in 6 hours and costs 50 percent extra.\n' +
      'Pickup and delivery: available within 3 km of the shop. Free for orders of 8 kilos or more, otherwise a flat fee of ₱40.\n' +
      'Payment: cash or card at the counter, or cash on delivery.\n' +
      'Items we cannot accept: anything labelled “dry clean only”, and items with heavy stains from oil or paint.\n' +
      'Missing items: please report within 48 hours of pickup or delivery.',
    starterPrompt: 'Answer these customer questions: How long does standard service take? Are you open on public holidays?',
    system: 'You are a helpful assistant for a small laundry shop. Use the FAQ provided to help the user with their request.',
    maxRuns: 4,
    output: { format: 'text' },
    facts: [
      'Standard service is ready in 24 hours',
      'Rush service is ready in 6 hours and costs 50 percent extra',
      'Opening hours are Monday to Friday 7:00 AM to 7:00 PM and Saturday 8:00 AM to 4:00 PM',
      'Pickup and delivery are available within 3 km',
      'Delivery is free for 8 kilos or more, otherwise a flat fee of ₱40',
      'Missing items must be reported within 48 hours',
    ],
    criteria: [
      { id: 'only', label: 'Tells the model to answer only from the FAQ and not to use outside knowledge' },
      { id: 'exit', label: 'Gives an exact phrase to use when the FAQ does not say' },
      { id: 'quote', label: 'Asks for the sentence used for each answer' },
      { id: 'separate', label: 'Asks for each question to be answered separately' },
    ],
    tips: [
      'Say “use only the FAQ below” and “do not use anything you know from elsewhere”. A model that has read about laundries will otherwise fill the gap.',
      'Give the model a safe exit, such as “if the FAQ does not say, write: not in the FAQ”. Without an exit it tends to produce a helpful-sounding guess.',
      'Ask for the exact sentence it used for each answer. Then you can find it in the FAQ in seconds.',
      'Read the answer to the holiday question twice. The FAQ lists regular hours and says nothing about holidays, so any holiday hours are invented.',
    ],
    example: {
      prompt: 'Answer each customer question separately, using only the FAQ below. Do not use any outside knowledge. For each answer, quote the exact sentence from the FAQ that you used. If the FAQ does not say, write exactly “not in the FAQ” for that question and nothing else.',
      outcome: 'Two short answers. The first says that standard service is ready in 24 hours and quotes the turnaround sentence. The second says “not in the FAQ”, since the document lists regular opening hours and never mentions public holidays, and it makes no guess about holiday hours.',
    },
    verify: [
      'The turnaround answer matches the FAQ (24 hours for standard, 6 hours for rush).',
      'The holiday question is answered with the exit phrase, or clearly says the FAQ does not cover it. Holiday hours or a date are invented.',
      'Every quoted sentence appears word for word in the FAQ.',
    ],
    difficulty: 'realistic',
  },
];
