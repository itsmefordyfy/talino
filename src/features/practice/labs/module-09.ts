import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 9 (`kind: 'lab'`). Written with the module's lessons; see docs/content/GENAI_BRIEF.md.
 * Every business, person, number and message in a `material` is invented.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-09-survey-brief',
    kind: 'lab',
    title: 'Answer the owner’s questions from a survey',
    experiment: 'document-analysis',
    situation: 'You help a small plant shop. The owner gave you the notes from a paper survey and has three questions about her customers. You want an assistant to answer from the notes only, and to be honest when the notes cannot answer.',
    goal: 'Get the assistant to answer the owner’s three questions using only the survey notes, with evidence for each answer, and to say clearly which question the notes cannot answer.',
    material:
      'GREENLEAF PLANT SHOP: CUSTOMER SURVEY NOTES (fictional)\n\n' +
      'Paper form given at the counter, 4 to 17 March, weekdays only. Weekend customers were not asked. 62 customers answered.\n\n' +
      'Q1. How did you find us?  Friends: 24.  Facebook: 21.  Walked past: 12.  Other: 5.\n' +
      'Q2. Would you pay a delivery fee?  Yes: 19.  No: 31.  Not sure: 12.\n' +
      'Q3. What should we sell that we do not?  Most common answer: more low-light plants (17 people). Pots with drainage holes (9 people). Fertiliser (6 people).\n' +
      'Q4. Spend on the day of the survey: average 480 pesos.\n\n' +
      'Owner’s note: The form did not ask for age, address or how often people visit.\n\n' +
      'THE OWNER’S QUESTIONS\n' +
      '1. How do most of my customers find the shop?\n' +
      '2. Do my customers want delivery?\n' +
      '3. Which age group spends the most?',
    starterPrompt: 'Answer the owner’s questions about the survey.',
    system: 'You are a careful assistant helping a small business owner. Follow the user’s request using only the supplied material as your source of facts.',
    maxRuns: 4,
    output: { format: 'text' },
    facts: [
      '62 customers answered the survey.',
      'The most common way people found the shop was friends (24), then Facebook (21).',
      'On delivery, 19 said yes, 31 said no and 12 were not sure, so more customers said no than yes.',
      'The most requested new product was low-light plants (17 people).',
      'The survey was done on weekdays only, so weekend customers are not included.',
      'The form did not ask for age, so the survey cannot say which age group spends the most.',
    ],
    criteria: [
      { id: 'material-only', label: 'Tells the assistant to use only the survey notes' },
      { id: 'evidence', label: 'Asks for the number or words from the notes behind each answer' },
      { id: 'not-in-notes', label: 'Says what to do when the notes cannot answer a question' },
      { id: 'reader', label: 'Names the reader (the shop owner) and the form of the answer' },
    ],
    tips: [
      'Say who the answer is for and how long it should be, for example “three short answers for the shop owner”.',
      'Ask for the evidence in the same line as each answer, so you can check it against the notes in seconds.',
      'Tell the assistant what to write when the notes do not contain the answer. Without that, many assistants try to be helpful by guessing.',
      'After the run, compare every number in the answer with the notes yourself. Watch the word “most” in the delivery answer.',
    ],
    example: {
      prompt: 'You are helping a shop owner. Use only the survey notes. Answer her three questions in three short numbered answers. After each answer, give the figures or words from the notes that support it. If the notes cannot answer a question, write “The notes do not say” and explain what is missing. Finish with one caution about how the survey was done.',
      outcome: 'Three numbered answers. The first says friends (24) and Facebook (21) are the main routes. The second says more people said no (31) than yes (19), with 12 unsure. The third says the notes do not say, because age was not asked. A closing caution mentions weekdays only.',
    },
    verify: [
      'Every number in the answer appears in the survey notes.',
      'The answer about delivery does not claim that most customers want it.',
      'The answer about age says the notes cannot tell, rather than guessing a group.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-09-ticket-triage',
    kind: 'lab',
    title: 'Triage a support message into fields',
    experiment: 'structured-output',
    situation: 'You work for a small online shop that sells speakers. The owner has written triage rules. You want an assistant to read one customer message and fill in a short form that a person can scan in a glance, following the shop’s rules rather than its own idea of urgency.',
    goal: 'Get the assistant to return one JSON answer with the order number, issue type, urgency, mood and whether a person must handle it first, using the shop’s rules.',
    material:
      'ECHO CORNER SHOP: TRIAGE RULES (fictional)\n\n' +
      'issue_type: delivery = asking where an order is or why it is late. damaged = the item arrived broken or does not work. refund = wants money back and says nothing is broken. other = anything else.\n' +
      'urgency: high = the customer mentions a bank or card dispute, legal action, safety, or a deadline for the item. normal = upset but none of those. low = calm and no deadline.\n' +
      'mood: calm, upset or angry. Angry = the customer threatens a dispute, legal action or a public review.\n' +
      'needs_human: true if urgency is high, or this is a repeat complaint, or the customer paid more than 1,000 pesos and wants a refund. Otherwise false.\n\n' +
      'CUSTOMER MESSAGE\n' +
      'Order 4471. The speaker I got yesterday does not turn on. This is the second one that failed. I paid 2,400 pesos. I need a working one by Friday for an event, or I will dispute the payment with my bank.',
    starterPrompt: 'Read the customer message and tell me what kind of issue it is.',
    system: 'You are an assistant that helps a shop owner triage customer messages. Follow the user’s request, using the supplied material for the shop’s rules and for the message.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'order_number', type: 'string', required: true },
        { name: 'issue_type', type: 'string', required: true, oneOf: ['delivery', 'damaged', 'refund', 'other'] },
        { name: 'urgency', type: 'string', required: true, oneOf: ['low', 'normal', 'high'] },
        { name: 'mood', type: 'string', required: true, oneOf: ['calm', 'upset', 'angry'] },
        { name: 'needs_human', type: 'boolean', required: true },
      ],
    },
    key: { order_number: '4471', issue_type: 'damaged', urgency: 'high', mood: 'angry', needs_human: true },
    criteria: [
      { id: 'fields', label: 'Names every field and its allowed values' },
      { id: 'rules', label: 'Tells the assistant to apply the shop’s rules in the material' },
      { id: 'json-only', label: 'Asks for JSON only, with no extra words' },
      { id: 'human-first', label: 'Makes the rule for when a person must handle it clear' },
    ],
    tips: [
      'List each field with its allowed values in the prompt. Code can only check values you named.',
      'Point the assistant at the shop’s rules rather than asking it to “judge” urgency. Its own judgment may be calmer than the owner’s.',
      'Ask for JSON only. A friendly sentence before the JSON can break whatever reads the answer.',
      'Check the last field yourself against the rules: more than one rule may say a person is needed.',
    ],
    example: {
      prompt: 'Using only the triage rules in the material, read the customer message and return JSON only with these fields: order_number (string), issue_type (delivery, damaged, refund or other), urgency (low, normal or high), mood (calm, upset or angry), needs_human (true or false). Apply the rules exactly. If two rules apply, choose the one that leads to a person.',
      outcome: 'A single JSON object: order 4471, damaged, high urgency because of the bank dispute and the deadline, angry because of the dispute threat, and needs_human true. No extra words around it.',
    },
    verify: [
      'Each field matches what the shop’s rules say for this message.',
      'The answer is valid JSON that uses only the allowed values.',
      'needs_human is true, and you can point to at least two rules that say so.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-09-brand-voice-email',
    kind: 'lab',
    title: 'Write a promo email in the owner’s voice',
    experiment: 'text-generation',
    situation: 'You write the emails for a small neighbourhood bakeshop. The owner’s voice is warm and plain, and she must never promise something untrue. You want an email to regular customers about a short promotion that sounds like her and uses only the facts she gave.',
    goal: 'Write two different prompts, A and B, that each ask for a short promo email in the owner’s voice, then compare which one carries more of her voice and more correct facts.',
    material:
      'SUNRISE BAKESHOP (fictional)\n\n' +
      'THE OWNER’S VOICE (two things she wrote)\n' +
      '1. “Hi neighbours! The oven is on, the coffee is hot, and the cinnamon rolls are almost ready. Come say hi.”\n' +
      '2. “No fancy words from me. Good butter, good flour, and a bit of patience. That is the whole secret.”\n' +
      'She writes short sentences, uses a little humour, and never uses words like “indulge” or “exclusive”.\n\n' +
      'PROMOTION FACTS\n' +
      '- Box of 6 cinnamon rolls: 360 pesos (regular price 420 pesos).\n' +
      '- The promotion runs from 20 to 27 November only.\n' +
      '- Pre-order by message before 6 pm the day before pickup.\n' +
      '- Pickup only, at the Maple Street shop, 7 am to 6 pm, Tuesday to Saturday. Closed Sunday and Monday.\n' +
      '- Contains wheat, milk and eggs. Not gluten-free.\n' +
      '- No delivery.',
    starterPrompt: 'Write a promotional email for the bakeshop.',
    system: 'You are a helpful writing assistant for a small business. Follow the user’s request. Use the supplied material for the facts and for the owner’s voice.',
    compare: 'prompts',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'voice', label: 'Gives the assistant the owner’s voice samples and says what to copy from them' },
      { id: 'facts', label: 'Lists the facts to use and forbids adding any others' },
      { id: 'format', label: 'Sets the length and the way the email should end' },
      { id: 'allergens', label: 'Asks for the allergen note and the pre-order and pickup details' },
      { id: 'audience', label: 'Names the audience (regular customers)' },
    ],
    tips: [
      'Paste or point to the owner’s own sentences and say which habits to copy: short sentences, a little humour, plain words.',
      'Say “use only the facts in the material, and write [NEED FACT] if something is missing”. That gives the assistant a safe way out instead of inventing.',
      'Set a length (for example 90 to 120 words) and one clear action at the end, such as how to order.',
      'Run a second prompt that changes one thing. Then compare the two emails: which sounds more like her, and which facts are right?',
    ],
    example: {
      prompt: 'Write an email of 90 to 120 words to our regular customers about the cinnamon roll promotion. Copy the owner’s voice from her two samples: short sentences, a little humour, plain words, never “indulge” or “exclusive”. Use only the facts in the material (price, dates, pre-order rule, pickup times, allergens, no delivery). If a fact is missing, write [NEED FACT]. End with one simple way to order.',
      outcome: 'A short, warm email with plain sentences that mentions 360 pesos instead of 420, 20 to 27 November, ordering by message before 6 pm the day before, pickup on Maple Street from Tuesday to Saturday, the wheat, milk and egg note, and that there is no delivery. It does not call the rolls gluten-free.',
    },
    verify: [
      'The price, the dates, the pre-order rule and the pickup hours match the material exactly.',
      'The email does not call anything gluten-free, offer delivery or add facts the material does not give.',
      'It sounds like the two voice samples, and does not use words the owner never uses.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-09-route-requests',
    kind: 'lab',
    title: 'Route seven requests by the clinic’s rules',
    experiment: 'classification',
    situation: 'You are designing a workflow for a small dental clinic’s front desk. Before any reply is drafted, each message must be routed. The clinic’s rules say which messages are routine and which need a person first. You want an assistant to apply the rules to seven messages.',
    goal: 'Get the assistant to return one JSON answer that gives the right route for each of the seven requests, following the clinic’s rules.',
    material:
      'RIVERSIDE DENTAL CLINIC: ROUTING RULES (fictional)\n\n' +
      'Routes:\n' +
      'routine = a clear request for a standard visit (cleaning, check-up, filling) with a day or time wish.\n' +
      'needs-info = a booking wish that is missing the visit type or the day or time.\n' +
      'person-first = mentions pain, swelling, bleeding, or a child in distress; or a bill, payment or complaint; or asks for advice about a symptom. A person must handle it before any reply is drafted. If a message fits two routes, choose person-first.\n\n' +
      'REQUESTS\n' +
      '1. “Hi, can I book a cleaning next Tuesday morning? Thanks, Alma”\n' +
      '2. “I want an appointment.”\n' +
      '3. “My jaw has been swollen since last night and it hurts a lot. Can I come today?”\n' +
      '4. “My daughter needs a check-up before school starts. We are free after 3 pm on weekdays.”\n' +
      '5. “Can you move my check-up to next week?”\n' +
      '6. “I have a tiny dark spot on a tooth. Do I need a filling? Tell me what you think.”\n' +
      '7. “I think I was charged twice for my last visit. Please fix it and book me a cleaning on the 12th.”',
    starterPrompt: 'Sort these requests.',
    system: 'You are an assistant that routes messages for a clinic’s front desk. Follow the user’s request and apply the rules in the supplied material.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'r1', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
        { name: 'r2', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
        { name: 'r3', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
        { name: 'r4', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
        { name: 'r5', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
        { name: 'r6', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
        { name: 'r7', type: 'string', required: true, oneOf: ['routine', 'needs-info', 'person-first'] },
      ],
    },
    key: { r1: 'routine', r2: 'needs-info', r3: 'person-first', r4: 'routine', r5: 'needs-info', r6: 'person-first', r7: 'person-first' },
    criteria: [
      { id: 'routes', label: 'Names the three routes and what each one means' },
      { id: 'rules', label: 'Tells the assistant to apply the clinic’s rules in the material' },
      { id: 'tie-break', label: 'Includes the tie-break: a message that fits two routes goes to a person first' },
      { id: 'format', label: 'Asks for one answer per request in the fields r1 to r7, JSON only' },
    ],
    tips: [
      'Name the fields r1 to r7 so each answer lines up with one request.',
      'Repeat the three route names exactly. The check can only count answers that use them.',
      'Tell the assistant to follow the tie-break. Request 7 is both a bill problem and a booking.',
      'After the run, read every request yourself, apply the rules and look at where the assistant disagreed with you.',
    ],
    example: {
      prompt: 'Apply the clinic’s routing rules in the material to the seven requests. Return JSON only with the fields r1 to r7. Each value must be exactly one of: routine, needs-info, person-first. If a request fits two routes, use person-first. Do not add any other text.',
      outcome: 'One JSON object with seven values. Requests 3, 6 and 7 are person-first, requests 2 and 5 are needs-info, and requests 1 and 4 are routine. No sentences around the JSON.',
    },
    verify: [
      'Every value is one of the three route names.',
      'Any request that mentions pain, swelling, a bill or asks for advice about a symptom is person-first.',
      'A request that is a booking and a billing problem at once goes to person-first.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-09-pilot-numbers',
    kind: 'lab',
    title: 'Turn a pilot log into numbers, then check them',
    experiment: 'structured-output',
    situation: 'You ran a small test at a print shop: five weekly update emails written by hand last month, and five written with an AI draft this month. You want an assistant to work out the averages and error counts, and then you will check its arithmetic yourself.',
    goal: 'Get the assistant to return JSON with the average minutes by hand, the average minutes with AI, the minutes saved per task, the total errors and the number of drafts with at least one error.',
    material:
      'LANTERN PRINT SHOP: PILOT LOG (fictional)\n\n' +
      'Weekly update emails, one row per email. The “with AI” time already includes reading and correcting the draft.\n\n' +
      'Email | Minutes by hand (last month) | Minutes with AI draft and checking (this month) | Errors found while checking\n' +
      '1 | 24 | 12 | 0\n' +
      '2 | 30 | 15 | 1\n' +
      '3 | 18 | 11 | 0\n' +
      '4 | 36 | 14 | 2\n' +
      '5 | 22 | 13 | 0\n\n' +
      'Notes: the errors were a wrong delivery date (email 2) and a wrong price plus a wrong date (email 4). The two columns are different weeks of work, so the emails are not the same ones.',
    starterPrompt: 'Work out the numbers from this log.',
    system: 'You are a careful assistant that works with small tables. Follow the user’s request using only the supplied material, and be exact with arithmetic.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'average_minutes_by_hand', type: 'number', required: true },
        { name: 'average_minutes_with_ai', type: 'number', required: true },
        { name: 'minutes_saved_per_task', type: 'number', required: true },
        { name: 'total_errors', type: 'number', required: true },
        { name: 'drafts_with_errors', type: 'number', required: true },
      ],
    },
    key: { average_minutes_by_hand: 26, average_minutes_with_ai: 13, minutes_saved_per_task: 13, total_errors: 3, drafts_with_errors: 2 },
    criteria: [
      { id: 'fields', label: 'Names each figure you want, one by one' },
      { id: 'meaning', label: 'Says what the columns mean, including that checking time is in the AI column' },
      { id: 'careful', label: 'Asks for careful arithmetic or the working before the final answer' },
      { id: 'format', label: 'Asks for JSON with numbers only, with no units or words inside the values' },
    ],
    tips: [
      'Name every figure and say how to get it (for example “the average is the total divided by 5”).',
      'Say that the checking time is already inside the AI column so it does not add or remove it.',
      'Models can slip on arithmetic. Ask for numbers only, or for the working first and then the JSON, and compare which is more accurate.',
      'After the run, add the columns up yourself with a calculator and compare each value.',
    ],
    example: {
      prompt: 'Use only the log. Compute: the average of the 5 “by hand” minutes, the average of the 5 “with AI” minutes (checking is already included), their difference per task, the total number of errors, and how many emails had at least one error. Add each column first, then divide. Return JSON only with the fields average_minutes_by_hand, average_minutes_with_ai, minutes_saved_per_task, total_errors and drafts_with_errors as plain numbers.',
      outcome: 'A JSON object with five numbers. The two averages and their difference are consistent with the column totals, the total error count equals the sum of the last column, and the number of drafts with errors counts emails, not errors. Check each one against your own addition.',
    },
    verify: [
      'Each average equals the column total divided by 5, which you can add up yourself.',
      'minutes_saved_per_task equals the first average minus the second.',
      'drafts_with_errors counts the emails that had an error, not the number of errors.',
    ],
    difficulty: 'demanding',
  },
];
