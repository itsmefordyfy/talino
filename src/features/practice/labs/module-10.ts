import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 10 (`kind: 'lab'`). Written with the module's lessons; see docs/content/GENAI_BRIEF.md.
 * Every business, person, number, message and key in a `material` is invented. The "keys" are obviously fake placeholders.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-10-app-blueprint',
    kind: 'lab',
    title: 'Turn an idea into a blueprint',
    experiment: 'text-generation',
    situation: 'A tutor has an idea for an essay-feedback feature and some constraints. You want an assistant to turn the idea into a plain blueprint of the parts of the application, so that you can check it against what you learned about where each part belongs.',
    goal: 'Get the assistant to write a blueprint that names the seven parts of the application, says where the key lives, how the reply is checked and how use is limited, and respects every constraint in the idea.',
    material:
      'ESSAY FEEDBACK FEATURE (a fictional idea)\n\n' +
      'Who: Ana, a tutor, and her 30 students aged 14 to 16.\n' +
      'What it should do: a student pastes an essay of up to 500 words and gets 3 bullet points of feedback, each under 25 words.\n' +
      'Constraints:\n' +
      '- Student names must not be sent to the AI service.\n' +
      '- Ana pays for the service herself and wants a limit on daily use.\n' +
      '- Feedback must be labelled as written by an AI.\n' +
      '- Ana will read a sample of the feedback each week.\n' +
      '- Students will open a simple web page on their phones.',
    starterPrompt: 'Describe how to build this feature.',
    system: 'You are a helpful assistant that explains how software features are put together. Follow the user’s request using the idea described in the material.',
    maxRuns: 4,
    output: { format: 'text' },
    criteria: [
      { id: 'parts', label: 'Asks for the seven parts by name: interface, server, prompt template, model service, validation, storage and logs, limits' },
      { id: 'key', label: 'Says the key must live on the server and never in the web page' },
      { id: 'validation', label: 'Asks how the reply is checked before a student sees it' },
      { id: 'constraints', label: 'Tells the assistant to respect each constraint (no names sent, daily limit, AI label, weekly sample)' },
    ],
    tips: [
      'Name the seven parts in your prompt and ask for one line on each. Then you can see at once whether one is missing.',
      'Say that the key must not be stored in the web page, and ask where it should live instead. Models sometimes suggest the quicker, unsafe way.',
      'Quote the constraints from the material and ask the blueprint to show how each one is met.',
      'After the run, check the blueprint against your own five design questions. Look for any part that quietly went missing.',
    ],
    example: {
      prompt: 'Using the idea in the material, write a blueprint with one line each for these parts: interface, server, prompt template, model service, validation, storage and logs, limits. Say where the service key lives (it must not be in the web page), how the reply is checked before a student sees it, and how daily use is limited. Show how each constraint is met: no student names sent, an AI label, a weekly sample read by Ana.',
      outcome: 'Seven short lines, one per part. The key sits in the server’s secret settings, the web page only talks to Ana’s server, the server removes names and builds the prompt, checks for exactly three short bullets, and applies a daily limit per student. The label and the weekly sample are listed under the interface and the logs.',
    },
    verify: [
      'All seven parts appear, and the key is not placed in the web page.',
      'Nothing in the blueprint sends student names to the model service.',
      'The reply is checked before it is shown, and a daily limit is described.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-10-read-response',
    kind: 'lab',
    title: 'Read a response and report its facts',
    experiment: 'structured-output',
    situation: 'You are learning to read what a model service sends back. Below is a made-up response in a generic format. You want an assistant to report its main facts as fields so you can check them, including one number that the response does not state.',
    goal: 'Get the assistant to return JSON with the status, the finish reason, whether the reply was cut off, the input and output token counts and the total tokens, then check each value against the response yourself.',
    material:
      'A MADE-UP RESPONSE FROM A MODEL SERVICE (generic format, fictional)\n\n' +
      'http_status: 200\n' +
      'model: demo-model-small\n' +
      'reply_text: "Your order ORD-2041 shipped on 12 November and will arri"\n' +
      'finish_reason: length\n' +
      'usage: input_tokens = 412, output_tokens = 60\n' +
      'the request set an output limit of 60 tokens\n' +
      'request_id: req-77a1\n\n' +
      'Meanings: finish_reason "stop" means the model finished. "length" means it stopped because it reached the output limit. "blocked" means the reply was withheld.',
    starterPrompt: 'Tell me what is in this response.',
    system: 'You are a careful assistant that reads technical records. Follow the user’s request using only the supplied material, and be exact with numbers.',
    maxRuns: 4,
    output: {
      format: 'json',
      fields: [
        { name: 'http_status', type: 'number', required: true },
        { name: 'finish_reason', type: 'string', required: true, oneOf: ['stop', 'length', 'blocked'] },
        { name: 'was_cut_off', type: 'boolean', required: true },
        { name: 'input_tokens', type: 'number', required: true },
        { name: 'output_tokens', type: 'number', required: true },
        { name: 'total_tokens', type: 'number', required: true },
      ],
    },
    key: { http_status: 200, finish_reason: 'length', was_cut_off: true, input_tokens: 412, output_tokens: 60, total_tokens: 472 },
    criteria: [
      { id: 'fields', label: 'Names every field and its type or allowed values' },
      { id: 'cut-off', label: 'Says when was_cut_off should be true, using the finish reason' },
      { id: 'total', label: 'Asks for the total to be worked out from the two token counts' },
      { id: 'format', label: 'Asks for JSON only, with numbers as plain numbers' },
    ],
    tips: [
      'List the six fields and what each should contain. Say that the numbers must be plain numbers with no words.',
      'Explain when was_cut_off should be true: when the finish reason says the model stopped at the output limit.',
      'The total is not written in the response. Tell the assistant to add the two counts, and check the sum yourself.',
      'A success status does not mean the reply is complete. See whether the assistant noticed.',
    ],
    example: {
      prompt: 'Read the made-up response in the material and return JSON only with: http_status (number), finish_reason (stop, length or blocked), was_cut_off (true if the finish reason shows the model stopped at the output limit), input_tokens, output_tokens and total_tokens (the sum of the two counts). Use plain numbers and no other text.',
      outcome: 'One JSON object: status 200, finish reason length, was_cut_off true, 412 input tokens, 60 output tokens and a total of 472. No words around it.',
    },
    verify: [
      'was_cut_off is true, and you can point to the finish reason that shows it.',
      'The two token counts match the response, and the total equals their sum.',
      'The answer is valid JSON that uses only the allowed values.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-10-spot-exposed-keys',
    kind: 'lab',
    title: 'Spot which places expose a key',
    experiment: 'classification',
    situation: 'You are reviewing how a small team handles a service key. They described six places where a key appears. Every “key” below is an obvious fake. You want an assistant to label each place safe or exposed using one clear test, and then you will check its reasoning.',
    goal: 'Get the assistant to return one JSON answer labelling each of the six places safe or exposed, applying the test in the material.',
    material:
      'THE TEST\n' +
      'exposed = someone other than the owner could read the key from this place (for example anyone who has the app, the shared project, the chat, the picture or the prompt).\n' +
      'safe = only the owner’s own server, a builder’s hidden secret settings, or the owner’s own private file that is never shared can read it.\n\n' +
      'THE SIX PLACES (all keys are fake)\n' +
      '1. A file inside a mobile app that is given to the whole class: const KEY = "FAKE-KEY-0000-NOT-REAL".\n' +
      '2. Server code that reads the key from an environment variable: const key = process.env.MODEL_API_KEY. The value is set in the server’s settings.\n' +
      '3. A file called .env on the developer’s own laptop that contains MODEL_API_KEY=FAKE-KEY-0000-NOT-REAL. The file is listed in .gitignore and has never been uploaded.\n' +
      '4. A screenshot of an error posted in a class group chat. The terminal in the picture shows MODEL_API_KEY=FAKE-KEY-0000-NOT-REAL.\n' +
      '5. A no-code builder’s secrets page where the key is stored. After saving, the page shows only “key saved” and the app never receives the value.\n' +
      '6. A prompt template that says: “Use this key FAKE-KEY-0000-NOT-REAL to call the service.” The template is sent to the model with every request.',
    starterPrompt: 'Which of these are safe?',
    system: 'You are an assistant that reviews how a team stores secrets. Follow the user’s request using the test and the places given in the material.',
    maxRuns: 4,
    output: {
      format: 'json',
      fields: [
        { name: 's1', type: 'string', required: true, oneOf: ['safe', 'exposed'] },
        { name: 's2', type: 'string', required: true, oneOf: ['safe', 'exposed'] },
        { name: 's3', type: 'string', required: true, oneOf: ['safe', 'exposed'] },
        { name: 's4', type: 'string', required: true, oneOf: ['safe', 'exposed'] },
        { name: 's5', type: 'string', required: true, oneOf: ['safe', 'exposed'] },
        { name: 's6', type: 'string', required: true, oneOf: ['safe', 'exposed'] },
      ],
    },
    key: { s1: 'exposed', s2: 'safe', s3: 'safe', s4: 'exposed', s5: 'safe', s6: 'exposed' },
    criteria: [
      { id: 'labels', label: 'Names the two labels, safe and exposed, and asks for one per place' },
      { id: 'test', label: 'Tells the assistant to apply the test in the material: who could read the key from this place' },
      { id: 'format', label: 'Asks for JSON with the fields s1 to s6 and no other text' },
      { id: 'reasons', label: 'Asks for a short reason after the labels, so you can check its thinking' },
    ],
    tips: [
      'Quote the test from the material and ask the assistant to apply it to each place, one at a time.',
      'Use exactly the two labels and the fields s1 to s6, so that the answer can be checked.',
      'Do your own labelling before you read the answer. Look hardest at the places that sound technical but are safe, and at the ones that sound harmless but are not.',
      'If the assistant disagrees with you, ask what the test says about who could read the key from that place.',
    ],
    example: {
      prompt: 'Apply the test in the material to each of the six places. Return JSON only with the fields s1 to s6, each exactly “safe” or “exposed”. A place is exposed if anyone other than the owner could read the key from it.',
      outcome: 'One JSON object: s1 exposed (it is in an app everyone has), s2 safe (the server’s own settings), s3 safe (a private file that is never shared), s4 exposed (anyone in the chat can read the picture), s5 safe (a hidden secrets page) and s6 exposed (the key is sent in every prompt).',
    },
    verify: [
      'Each label follows from the test: who other than the owner could read the key from that place.',
      'Every value is exactly safe or exposed, and the answer is valid JSON.',
      'You can say in one sentence why each place is safe or exposed.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-10-structured-extract',
    kind: 'lab',
    title: 'Extract fields that pass a check',
    experiment: 'structured-output',
    situation: 'You are building a feature for a small stationery shop that reads customer messages and fills in a form. The shop has written the field rules. You want an assistant to return exactly those fields so that your code can check the shape and the allowed values, and so that you can check the meaning against the message.',
    goal: 'Get the assistant to return one JSON answer with the customer’s name, order id, issue type, urgency, item count and whether a person must handle it, using the shop’s rules.',
    material:
      'MAPLE BOOKS: FIELD RULES (fictional)\n\n' +
      'customer_name: the name the customer gives.\n' +
      'order_id: the order number, written like MB-1234.\n' +
      'issue_type: delivery = asking where an order is or why it is late. damaged = an item arrived broken or spoiled. refund = wants money back and nothing is broken. other = anything else.\n' +
      'urgency: low = only a question. normal = wants something fixed or replaced, with no deadline. high = mentions a deadline, a bank dispute or a safety problem.\n' +
      'item_count: how many items the customer says were in the order.\n' +
      'needs_human: true if urgency is high, or the customer asks for a refund of more than 1,000 pesos. Otherwise false.\n\n' +
      'CUSTOMER MESSAGE\n' +
      'Hi, this is Carla Mendez. My order MB-5520 had two items, a blue notebook and a pen set. The notebook arrived with a torn cover. I would like a replacement, no rush. Thanks!',
    starterPrompt: 'Get the details from the customer message.',
    system: 'You are an assistant that fills in forms from customer messages for a small shop. Follow the user’s request, using the supplied material for the shop’s rules and for the message.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'customer_name', type: 'string', required: true },
        { name: 'order_id', type: 'string', required: true },
        { name: 'issue_type', type: 'string', required: true, oneOf: ['delivery', 'damaged', 'refund', 'other'] },
        { name: 'urgency', type: 'string', required: true, oneOf: ['low', 'normal', 'high'] },
        { name: 'item_count', type: 'number', required: true },
        { name: 'needs_human', type: 'boolean', required: true },
      ],
    },
    key: { customer_name: 'Carla Mendez', order_id: 'MB-5520', issue_type: 'damaged', urgency: 'normal', item_count: 2, needs_human: false },
    criteria: [
      { id: 'fields', label: 'Names every field with its type and allowed values' },
      { id: 'json-only', label: 'Asks for JSON only, with no words before or after it' },
      { id: 'unknown', label: 'Says what to do when a value is not in the message, so nothing is invented' },
      { id: 'rules', label: 'Tells the assistant to apply the shop’s rules for issue type, urgency and needs_human' },
    ],
    tips: [
      'List every field with its type and, for choices, the exact allowed words. The screen can only check values you named.',
      'Ask for JSON only. A friendly sentence before the JSON can break the code that reads it.',
      'Tell the assistant what to write when a value is missing from the message, for example the word UNKNOWN, so it does not guess.',
      'After the run, check the meaning yourself: is “torn cover” the issue type, or is “damaged” the allowed word for it?',
    ],
    example: {
      prompt: 'Using the shop’s field rules in the material, read the customer message and return JSON only with: customer_name (string), order_id (string), issue_type (delivery, damaged, refund or other), urgency (low, normal or high), item_count (number), needs_human (true or false). Use only the message. If a value is not in the message, use UNKNOWN. Add no other text.',
      outcome: 'One JSON object: the customer’s name and the order number exactly as written in the message, damaged (not “torn cover”), normal because she wants a replacement with no deadline, 2 items and needs_human false. Nothing around it.',
    },
    verify: [
      'The name, order id and item count match the message exactly.',
      'issue_type and urgency use only the allowed words and follow the shop’s rules.',
      'needs_human follows the rule: urgency is not high and no large refund is asked for.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-10-short-and-bounded',
    kind: 'lab',
    title: 'Ask for less and keep the facts',
    experiment: 'summarization',
    situation: 'A library wants a very short summary of its lending policy for a phone notification. A short answer is cheaper and quicker to produce, but it must still carry the facts that matter. You will try two prompts, one with a clear length limit and one without, and compare them.',
    goal: 'Write two prompts, A and B, that summarise the policy, then compare which one gives a summary of at most 35 words that still keeps the loan periods, the renewals and the late charge limit.',
    material:
      'HARBOR COMMUNITY LIBRARY: LENDING POLICY (fictional)\n\n' +
      'Members may borrow up to 8 items at a time. Books and magazines are lent for 21 days. DVDs and games are lent for 7 days. ' +
      'Each item may be renewed twice, for the same period, unless another member has reserved it. Renewals can be made online, by phone or at the desk. ' +
      'Items returned late cost 5 pesos per day per item. The late charge for any one item stops growing at 200 pesos. ' +
      'A member with unpaid charges above 300 pesos cannot borrow until the charges are paid. ' +
      'Lost items are charged at the replacement cost listed in the catalogue, plus a handling fee of 50 pesos. ' +
      'The book drop is emptied at 9 am every day. Members under 16 need a parent or guardian to sign the membership form. ' +
      'Reference books, newspapers from the last 30 days and the local history collection cannot leave the library. ' +
      'The library is closed on Sundays and public holidays.',
    starterPrompt: 'Summarise the policy.',
    system: 'You are a helpful assistant that summarises documents for a small organisation. Follow the user’s request using only the supplied material.',
    compare: 'prompts',
    maxRuns: 6,
    output: { format: 'text' },
    facts: [
      'Books and magazines are lent for 21 days, and DVDs and games for 7 days.',
      'Each item may be renewed twice unless another member has reserved it.',
      'Late items cost 5 pesos per day per item, and the charge for one item stops at 200 pesos.',
      'Members may borrow up to 8 items at a time.',
      'A member with unpaid charges above 300 pesos cannot borrow.',
    ],
    criteria: [
      { id: 'limit', label: 'Sets an exact length limit, such as at most 35 words' },
      { id: 'keep', label: 'Names the facts that must stay: loan periods, renewals and the late charge limit' },
      { id: 'material-only', label: 'Tells the assistant to use only the policy and add nothing else' },
      { id: 'audience', label: 'Says the summary is for a phone notification for members' },
    ],
    tips: [
      'Give a number: “at most 35 words” works better than “short”. Then count the words in the answer.',
      'Name the three facts that must stay, because a tight limit makes a model drop details first.',
      'Run one prompt with no length limit and one with a limit, and compare both length and facts.',
      'Remember that shorter answers also cost less and arrive sooner, which is why asking for less is a useful habit.',
    ],
    example: {
      prompt: 'Summarise the library lending policy in at most 35 words for a phone notification to members. It must include the loan periods (21 days for books and magazines, 7 days for DVDs and games), that items can be renewed twice unless reserved, and that the late charge is 5 pesos a day and stops at 200 pesos per item. Use only the policy.',
      outcome: 'A single short paragraph of about 30 to 35 words that keeps the two loan periods, the two renewals unless reserved, and the late charge with its cap, and does not add any rule the policy does not state.',
    },
    verify: [
      'Count the words: is the answer at most 35?',
      'The loan periods, the renewals and the late charge limit are all present and correct.',
      'Nothing is added that the policy does not say (for example a different fine or a different period).',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-10-booking-lookup',
    kind: 'lab',
    title: 'Answer an inquiry from lookups, and admit what is missing',
    experiment: 'tool-use',
    situation: 'You are testing a feature for a wedding photographer. The assistant can look up whether a date is free and what a package includes, but only for what the studio’s system knows. A customer has asked three things. You want a reply that uses the lookups and says plainly what it could not confirm.',
    goal: 'Get the assistant to use the lookup tools, write a short reply based only on what they return, and say clearly which question it could not answer.',
    material:
      'CUSTOMER INQUIRY (fictional)\n\n' +
      '“Hi! We are getting married on 14 March 2027. We like your standard package. Is the date free? Also, how much is your premium package? Thank you, Carla and Ben.”\n\n' +
      'THE STUDIO’S PACKAGE NAMES: mini and standard (lowercase).',
    starterPrompt: 'Reply to the customer’s inquiry.',
    system: 'You are an assistant that drafts replies for a wedding photographer’s studio. You may call the tools provided to look up facts. Follow the user’s request using the inquiry in the material.',
    maxRuns: 5,
    output: { format: 'text' },
    tools: [
      {
        name: 'check_date',
        description: 'Check whether the studio is free on a date. Give the date as YYYY-MM-DD.',
        params: [{ name: 'date', type: 'string', description: 'The date in YYYY-MM-DD format, for example 2027-03-14' }],
        fixtures: [
          { args: { date: '2027-03-14' }, result: { available: true } },
          { args: { date: '2027-03-21' }, result: { available: false } },
        ],
      },
      {
        name: 'get_package',
        description: 'Look up one of the studio’s packages by its lowercase name (mini or standard).',
        params: [{ name: 'package', type: 'string', description: 'The package name in lowercase, such as standard' }],
        fixtures: [
          { args: { package: 'standard' }, result: { hours: 6, photos: 250, price_pesos: 18000 } },
          { args: { package: 'mini' }, result: { hours: 3, photos: 100, price_pesos: 9000 } },
        ],
      },
    ],
    criteria: [
      { id: 'use-tools', label: 'Tells the assistant to use the lookup tools for the date and the package' },
      { id: 'only-tools', label: 'Says to answer only from what the tools return' },
      { id: 'say-missing', label: 'Says what to do when a lookup finds nothing, such as saying it cannot confirm' },
      { id: 'draft', label: 'Asks for a short reply marked as a draft for a person to approve' },
    ],
    tips: [
      'Name the two tools in your prompt and tell the assistant which question each one answers.',
      'Say that every date, price and detail in the reply must come from a tool result, and nothing else.',
      'Tell it what to do when a tool finds nothing: write that it cannot confirm it and that the photographer will follow up.',
      'After the run, read the reply against the tool results. The price of a premium package is the thing to look for: where did it come from?',
    ],
    example: {
      prompt: 'Use the check_date and get_package tools to answer the customer’s questions. Write a short, friendly reply of at most 90 words, using only what the tools return. If a tool finds nothing for something the customer asked, say that you cannot confirm it and that the photographer will follow up. Mark the reply DRAFT FOR REVIEW.',
      outcome: 'A short, friendly draft that confirms 14 March 2027 is free and gives the standard package details exactly as the tools returned them, says that the premium package could not be confirmed and that the photographer will follow up, and is marked as a draft. It does not state any premium price.',
    },
    verify: [
      'Every date, hour count, photo count and price in the reply appears in a tool result.',
      'The reply does not give a price or details for the premium package.',
      'The reply says plainly what it could not confirm.',
    ],
    difficulty: 'demanding',
  },
];
