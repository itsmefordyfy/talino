import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 3, Prompt Engineering and AI Communication (`kind: 'lab'`). Written 2026-11-17; see docs/content/GENAI_BRIEF.md.
 * Every business, person, price, date and message below is invented. The `system` text only frames the model: it never says what the learner's prompt should say.
 * `key` values hold exactly what the material (plus the rules printed in the situation) supports.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-03-clinic-reminder',
    kind: 'lab',
    title: 'The clinic reminder: vague versus specific',
    experiment: 'playground',
    situation:
      'You work at the front desk of Northgate Family Clinic, a small clinic. You want to text a patient a reminder about tomorrow\'s appointment. The details are in the material. Run the weak starter prompt as Prompt A, then write a Prompt B that makes your own decisions, and compare the two answers.',
    goal: 'Get a text-message reminder that the patient can act on, using only the facts in the material.',
    material:
      'Clinic: Northgate Family Clinic\nPatient: Dana Cruz\nAppointment: teeth cleaning with Dr. Santos\nDate and time: 3 December, 2:30 PM\nPlease: arrive 10 minutes early and bring the insurance card\nTo confirm: reply YES\nTo reschedule: call 555-0142 (Monday to Friday, 8 AM to 5 PM)\nNot part of this clinic\'s reminders: prices and parking information',
    starterPrompt: 'Write a reminder for a patient.',
    system:
      'You are a helpful writing assistant. Follow the user\'s request and use the details provided with it as the facts for your answer.',
    compare: 'prompts',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'goal-reader', label: 'Says what the message is for and who reads it (a patient, on a phone)' },
      { id: 'facts', label: 'Asks for the real details to be used: name, date, time, doctor' },
      { id: 'shape', label: 'Sets the format and a length limit (for example one text message, under 45 words)' },
      { id: 'tone-limits', label: 'Names a tone and says what to leave out (for example no emojis, no prices)' },
      { id: 'no-invention', label: 'Tells the assistant not to add details that are not in the material' },
    ],
    tips: [
      'Say who will read the message and where they will read it. A text message is not a formal letter.',
      'Name the facts you want used, or tell the assistant to use the details in the material and which ones matter most.',
      'Give a length limit and a tone in plain words, such as "warm, under 45 words, no emojis".',
      'Say what must stay out. The material lists two things the clinic does not put in reminders.',
      'After the run, check every date, time and name against the material, and look for anything the answer added.',
    ],
    example: {
      prompt:
        'Write one text message from Northgate Family Clinic to a patient, using only the details in the material. Include the patient\'s name, the appointment, the date and time, the two requests (arrive early, bring the insurance card) and how to confirm or reschedule. Warm tone, no emojis, under 45 words. Do not add prices, parking or any detail that is not in the material.',
      outcome:
        'A short, friendly text that names the patient, the cleaning with Dr. Santos, 3 December at 2:30 PM, asks for an early arrival with the insurance card, and says to reply YES or call 555-0142 to reschedule. It does not mention prices or parking.',
    },
    verify: [
      'Every name, date, time and phone number matches the material exactly.',
      'Nothing appears that the material does not say (prices, parking, a doctor\'s first name).',
      'A patient could tell in one read what to do: arrive early, bring the card, and reply YES.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-03-product-description',
    kind: 'lab',
    title: 'A product description from four parts',
    experiment: 'playground',
    situation:
      'You help run Harbor & Thread, a small online shop. You need an Instagram caption for the canvas tote bag. The readers are mostly students and office workers. The product sheet in the material is your only source of facts. Write a prompt with context, role, task and constraints, and run it.',
    goal: 'Get a caption for the shop\'s Instagram account that uses only the facts on the product sheet and follows limits you set.',
    material:
      'Shop: Harbor & Thread (small online shop, ships within the country)\nProduct: Harbor canvas tote bag\nMaterial: 12 oz cotton canvas, cotton webbing handles\nSize: 38 cm wide, 40 cm tall, 12 cm deep\nColours: sand, navy\nPockets: one zip pocket inside\nCare: machine wash cold, line dry\nPrice: 690 pesos\nMade: in small batches in our own workshop\nNot waterproof\nShips in 3 to 5 days',
    starterPrompt: 'Write a product description for this bag.',
    system:
      'You are a helpful writing assistant. Follow the user\'s request and use the product details provided with it as your facts.',
    maxRuns: 4,
    output: { format: 'text' },
    criteria: [
      { id: 'context', label: 'Gives the context: where the caption appears and who reads it' },
      { id: 'role', label: 'Sets a role or point of view for the writing' },
      { id: 'task', label: 'States one clear task' },
      { id: 'constraints', label: 'Sets limits: a length, what must be included and what must stay out' },
      { id: 'facts-only', label: 'Tells the assistant to use only the facts on the product sheet' },
    ],
    tips: [
      'Start with the situation: an Instagram caption, readers who are students and office workers. That is your context.',
      'Choose one task ("write one caption") and then add limits: a word count, the price, and the honest note that the bag is not waterproof.',
      'Say that the sheet is the only source of facts. Assistants like to add pleasant extras such as "fits a laptop".',
      'A role such as "a friendly shop owner writing in short lines" changes the voice. It does not make the claims true.',
      'Read your answer against the sheet and mark every claim that is not on it.',
    ],
    example: {
      prompt:
        'You are the friendly owner of a small online shop writing for Instagram. Context: readers are mostly students and office workers. Task: write one caption for the product on the sheet. Constraints: under 60 words, include the price and that it is not waterproof, end with a question, use only the facts on the sheet, no emojis.',
      outcome:
        'A short caption in a warm voice that mentions the canvas, the two colours, the inside zip pocket, the 690 pesos price and the fact that it is not waterproof, ending with a question to the reader. It does not claim a laptop fit or water resistance.',
    },
    verify: [
      'Every fact (material, size, colours, price, shipping time) appears on the product sheet.',
      'The answer does not claim anything the sheet does not (for example water resistance or a laptop fit).',
      'It stays inside the length and format limits you set.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-03-few-shot-refund-label',
    kind: 'lab',
    title: 'Teach a shop\'s labeling rule by example',
    experiment: 'classification',
    situation:
      'You work in support for an online clothing shop. The team has its own labels, and one rule is easy to get wrong. Labels: order-status (asks where an order is or when it will arrive, and does not ask for money back); refund-request (asks for money back, for any reason, even when the cause is a late delivery); exchange (wants a different size, colour or item instead of a refund); product-question (asks about a product before buying); other (anything else). Write a prompt, with examples if you think they help, that labels the message in the material the way the shop does.',
    goal: 'Get one correct label for the message, returned as JSON with a category field.',
    material:
      'Hi, my parcel was supposed to arrive on Monday. It is Thursday now and nothing yet. If it does not come by Friday I want my money back. Order 2231.',
    starterPrompt: 'Classify this message.',
    system:
      'You are a helpful assistant that sorts customer messages. Follow the user\'s instructions about the message provided, and when JSON is requested reply with JSON only.',
    maxRuns: 4,
    output: { format: 'json', fields: [{ name: 'category', type: 'string', required: true, oneOf: ['order-status', 'refund-request', 'exchange', 'product-question', 'other'] }] },
    key: { category: 'refund-request' },
    criteria: [
      { id: 'labels', label: 'Lists the five labels exactly as the shop writes them' },
      { id: 'rule', label: 'States or shows the rule that makes a late delivery with a money-back request a refund request' },
      { id: 'examples', label: 'Gives a few examples in the same format, including one on the boundary between two labels' },
      { id: 'format', label: 'Asks for only a JSON object with a category field' },
      { id: 'fresh', label: 'Keeps the message to be labeled out of the examples' },
    ],
    tips: [
      'The model sees only your prompt and the message, so the labels and the shop\'s rules must be written in your prompt.',
      'A rule that is easy to miss is a good rule to show with an example. Write one message that is late and asks for money back, and label it the way the shop does.',
      'Use the same layout for every example, and show the output exactly as you want it, for example {"category": "exchange"}.',
      'Give each label at least one example, so the model does not lean toward a single label.',
      'Do not paste the message you want labeled as an example, or you only test copying.',
    ],
    example: {
      prompt:
        'Label customer messages with exactly one of: order-status, refund-request, exchange, product-question, other. Rule: any message that asks for money back is a refund-request, even if the cause is a late delivery. Reply with JSON only, like {"category": "..."}. Examples: "Where is my order 1180?" -> {"category": "order-status"}; "The shirt is too small, can I get a large?" -> {"category": "exchange"}; "My package is a week late and I want a refund." -> {"category": "refund-request"}; "Does this jacket come in navy?" -> {"category": "product-question"}. Now label this message: [the message].',
      outcome:
        'A JSON object with the single field category set to one of the five labels, in the exact spelling the shop uses. Because the examples show the refund rule, the answer follows it.',
    },
    verify: [
      'The category is one of the five labels, spelled exactly.',
      'The reply is only the JSON object, with no extra words.',
      'The label follows the shop\'s rule printed in the situation, not just the topic of the message.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-03-order-to-json',
    kind: 'lab',
    title: 'Turn an order message into checked fields',
    experiment: 'structured-output',
    situation:
      'You help a home bakery. Orders arrive as chat messages and you want each one as fields you can paste into a spreadsheet. Use these fields: customer_name, flavour, quantity (the number of cupcakes), pickup_day (a weekday), pickup_time (24-hour HH:MM), card_message (the exact words for the box card) and has_allergy (true or false). Write a prompt that gets all seven fields from the message, as JSON only.',
    goal: 'Get the order as valid JSON with the seven fields, with each value matching what the message states.',
    material:
      'Hello! Marites Dela Cruz here. I would like 2 dozen mango cupcakes for pick up this Saturday, 5 December, at 10 in the morning. Please put "Happy birthday Grandma" on the box card. One more thing: my granddaughter is allergic to peanuts, so please no peanuts. Thank you!',
    starterPrompt: 'Put this order in a format I can paste into a spreadsheet.',
    system:
      'You are a helpful assistant that extracts information from messages. Follow the user\'s instructions and use only the message provided as your source.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'customer_name', type: 'string', required: true },
        { name: 'flavour', type: 'string', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'pickup_day', type: 'string', required: true, oneOf: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        { name: 'pickup_time', type: 'string', required: true },
        { name: 'card_message', type: 'string', required: true },
        { name: 'has_allergy', type: 'boolean', required: true },
      ],
    },
    key: {
      customer_name: 'Marites Dela Cruz',
      flavour: 'mango',
      quantity: 24,
      pickup_day: 'Saturday',
      pickup_time: '10:00',
      card_message: 'Happy birthday Grandma',
      has_allergy: true,
    },
    criteria: [
      { id: 'names', label: 'Names all seven fields exactly as listed' },
      { id: 'types', label: 'Gives each field a type or the allowed values (quantity a number, has_allergy true or false, a weekday)' },
      { id: 'format', label: 'Says how to write the time (24-hour HH:MM) and the exact words for the card' },
      { id: 'missing', label: 'Says what to do if a detail is missing, and forbids guessing' },
      { id: 'json-only', label: 'Asks for only valid JSON, with no other words' },
    ],
    tips: [
      'List the field names and a type or allowed values for each one. The checker reads exactly these names.',
      'The message says "2 dozen". Tell the assistant that quantity must be the number of cupcakes, as a number.',
      'Say how to write the time and that the card message must be copied exactly.',
      'Add a rule for missing values (null, never guess) even though this message has them all. It is the habit that protects you on the next message.',
      'Show the shape once with made-up values, and ask for only JSON.',
    ],
    example: {
      prompt:
        'Read the message and reply with only valid JSON with these fields: customer_name (text), flavour (text), quantity (number of cupcakes), pickup_day (one of Monday to Sunday), pickup_time (24-hour HH:MM), card_message (the exact words to print, no quotation marks), has_allergy (true or false). If the message does not state a value, use null. Never guess. Message: [the message].',
      outcome:
        'A single JSON object with all seven fields: the name as written, the flavour, the quantity as the number 24, a weekday, the time written as HH:MM, the card words copied exactly, and true for the allergy.',
    },
    verify: [
      'The reply is valid JSON with all seven fields and nothing else.',
      'Quantity is the number of cupcakes (check what "2 dozen" means), not the number 2.',
      'The card message matches the words in the message exactly, and the time follows the format you asked for.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-03-lesson-plan-chain',
    kind: 'lab',
    title: 'A two-step chain for a lesson plan',
    experiment: 'text-generation',
    situation:
      'Ms. Ocampo teaches Grade 6 math and has pasted her notes into the material. Build a lesson plan with a two-step chain. Run 1: ask only for the main mistakes the notes report, with counts. Read the result against the notes. Run 2: replace the prompt with one that builds the plan using only the mistakes you checked. Each run is one prompt, so paste what you trust into the next one yourself.',
    goal: 'Get a 40-minute lesson plan built only from facts that you checked in the first step.',
    material:
      'Class notes (Grade 6 math, fractions unit)\nTopic: adding fractions with different denominators\nClass size: 25 students\nLesson length: 40 minutes\nQuiz results from last week:\n- 11 of 25 students added the tops and the bottoms (1/2 + 1/3 = 2/5)\n- 6 of 25 found a common denominator but forgot to simplify\n- 8 of 25 got every question right\nMaterials available: fraction strips (12 sets), whiteboard\nHomework policy: at most 10 minutes',
    starterPrompt: 'Make a lesson plan from these notes.',
    system:
      'You are a helpful teaching assistant. Follow the user\'s request and use the notes provided with it as your facts.',
    maxRuns: 5,
    output: { format: 'text' },
    criteria: [
      { id: 'one-job', label: 'Gives the first prompt one job only: list the mistakes with their counts' },
      { id: 'checked', label: 'Passes only the items you checked from step one into the second prompt' },
      { id: 'time', label: 'Asks for a plan with parts whose minutes add up to the 40-minute lesson' },
      { id: 'materials', label: 'Limits the plan to the materials listed in the notes' },
      { id: 'no-invention', label: 'Tells the assistant not to add class facts that are not in the notes' },
    ],
    tips: [
      'Keep step one small: "List the mistakes the notes report, with how many students made each. Use only the notes."',
      'Between the steps, compare the answer with the notes. If a number is wrong, fix it before you paste it forward.',
      'In step two say "use only the mistakes in this checked list", and give the lesson length and the materials from the notes.',
      'Ask for the minutes of each part and check that they sum to 40.',
      'Look for added details such as extra materials or student counts that the notes do not give.',
    ],
    example: {
      prompt:
        'Step 1: "From the notes, list the main mistakes in the quiz results and how many of the 25 students made each. Use only the notes." Step 2 (after checking): "Using only this checked list [the list], write a 40-minute lesson plan in three parts with minutes for each part that add up to 40. Use only fraction strips and the whiteboard. Do not add any class facts that are not in the notes."',
      outcome:
        'Step 1 returns a short list of the two mistakes with their counts. Step 2 returns a three-part plan with minutes adding to 40 that targets those two mistakes, using only the fraction strips and the whiteboard.',
    },
    verify: [
      'The counts (11, 6 and 8 of 25) match the notes.',
      'The minutes of the plan add up to 40.',
      'Only the fraction strips and the whiteboard are used, and nothing is added about the class that the notes do not say.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-03-client-reply-refine',
    kind: 'lab',
    title: 'Refine a reply to a client, A then B',
    experiment: 'text-generation',
    situation:
      'You are Paolo, a freelance designer. A client has sent feedback on a logo, and the material holds his message and the facts from your contract. Run Prompt A, read the reply against the contract facts, name its biggest gap, then write Prompt B with one deliberate change and compare the two.',
    goal: 'Get a short, polite reply that stays inside the contract facts and gives the client a clear next step.',
    material:
      'Client message (Mr. Alvarez): "Hi Paolo, thanks for the logo. It is nice but not quite there. Can you make it pop more? My wife also thinks the blue is too sad. Can we try a version with a gold border too? I need the final files by 20 November because the printer needs them."\n\nContract facts:\n- The package includes 2 rounds of changes.\n- Round 1 was used on 6 November.\n- A round can include several changes sent together.\n- Each extra round costs 1,500 pesos.\n- Final files (PNG, SVG, PDF) are delivered 2 working days after final approval.\n- To deliver by 20 November, approval is needed by 18 November.',
    starterPrompt: 'Reply to this client.',
    system:
      'You are a helpful writing assistant. Follow the user\'s request and use the details provided with it as the facts for your answer.',
    compare: 'prompts',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'contract', label: 'Uses the contract facts: one round left, 1,500 pesos for an extra round' },
      { id: 'no-overpromise', label: 'Does not promise changes beyond the contract' },
      { id: 'next-step', label: 'Gives a clear next step with the 18 November approval date' },
      { id: 'shape-tone', label: 'Sets a length and a tone (short, polite, no repeated apologies)' },
      { id: 'one-change', label: 'In Prompt B, changes one thing and says what to keep' },
    ],
    tips: [
      'Run Prompt A first and read it against the contract facts. Does it promise anything the contract does not?',
      'Name the single biggest gap before you write Prompt B. A feeling such as "make it better" gives the assistant nothing to act on.',
      'Say exactly what to change and what to keep, for example "remove the apologies, keep the closing question".',
      'Put the contract facts you want stated into the prompt, and tell the assistant to use no other facts.',
      'Compare the reply with the client\'s three requests (more pop, the blue, the gold border). Does the reply handle all three, or only one?',
    ],
    example: {
      prompt:
        'Prompt A: "Reply to this client." Prompt B: "Write a short, polite reply (under 90 words, no apologies) to the client message. State, using only the contract facts, that one of the two rounds is left, that he can send all three changes together, that an extra round would cost 1,500 pesos, and that I need his approval by 18 November to deliver by 20 November. End with a question asking him to confirm the changes."',
      outcome:
        'Prompt A returns a long reply that is warm but promises everything. Prompt B returns a short reply that names the one round left, the three requested changes in one batch, the 1,500 pesos for an extra round and the 18 November approval date.',
    },
    verify: [
      'Every number and date matches the contract facts (two rounds, one used, 1,500 pesos, 18 and 20 November).',
      'The reply makes no promise that goes beyond the contract.',
      'It responds to all three of the client\'s requests, not only one of them.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-03-urgent-test-cases',
    kind: 'lab',
    title: 'Measure your prompt on eight test cases',
    experiment: 'classification',
    situation:
      'You are testing a prompt for Crumb Lane Bakery that sorts customer messages into "urgent" or "routine". The shop\'s rule: a message is urgent if it describes a possible health or safety problem, or something the customer needs within the next 48 hours. Every other message is routine. The material holds eight numbered test cases. Write one prompt that labels all eight, run it, then count how many it got right. Read the misses, change one thing, and run it again.',
    goal: 'Get a label for each of the eight cases and improve the prompt until it labels as many as possible correctly.',
    material:
      'Today is Monday.\n1. Can you tell me if the almond cookies contain peanuts? My son is allergic and wants to eat one tonight.\n2. I would like to change my address for next month\'s subscription box. No rush at all.\n3. I need my cake order by tomorrow afternoon for a meeting.\n4. Love the cookies! Could you add a vegan option sometime?\n5. I found a small piece of plastic in my brownie. I have not eaten it.\n6. Your website says opening hours are 9 to 5 but the shop was closed at 3. Annoying, but whatever.\n7. Please send me the invoice for last month. My accountant wants it by Friday.\n8. The rider said he would come at 6 PM today to replace my broken box of macarons and nobody came. Please call me today, I am leaving the country tonight.',
    starterPrompt: 'Label each of these messages as urgent or routine.',
    system:
      'You are a helpful assistant that sorts customer messages. Follow the user\'s instructions about the messages provided, and when JSON is requested reply with JSON only.',
    maxRuns: 6,
    output: {
      format: 'json',
      fields: [
        { name: 'case_1', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_2', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_3', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_4', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_5', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_6', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_7', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
        { name: 'case_8', type: 'string', required: true, oneOf: ['urgent', 'routine'] },
      ],
    },
    key: {
      case_1: 'urgent',
      case_2: 'routine',
      case_3: 'urgent',
      case_4: 'routine',
      case_5: 'urgent',
      case_6: 'routine',
      case_7: 'routine',
      case_8: 'urgent',
    },
    criteria: [
      { id: 'rule', label: 'States the shop\'s rule for urgent and routine in plain words, including the 48-hour limit' },
      { id: 'format', label: 'Asks for one label per numbered case in JSON (case_1 to case_8)' },
      { id: 'tricky', label: 'Handles the tricky cases: a mild tone with a real safety risk, and a deadline that is further than 48 hours' },
      { id: 'one-change', label: 'After a run, changes one thing and runs the same cases again' },
      { id: 'cost', label: 'Pays most attention to the mistake that costs more: an urgent message labeled routine' },
    ],
    tips: [
      'Write the rule in your prompt, and tell the assistant that today is Monday if you want it to reason about deadlines.',
      'Before you run, write your own label for each case on paper. Then compare your list with the result, not just with how it feels.',
      'After the first run, look only at the misses. Is there a pattern, such as polite messages that mention a safety risk?',
      'Change one thing, then run the same eight cases again so the scores are comparable.',
      'An urgent message labeled routine is the costly mistake here. Aim your change at it first.',
    ],
    example: {
      prompt:
        'Today is Monday. A message is "urgent" if it describes a possible health or safety problem, or something the customer needs within 48 hours. Every other message is "routine". Label each numbered message below. Reply with JSON only, with the keys case_1 to case_8 and the value urgent or routine for each. Messages: [the eight numbered cases].',
      outcome:
        'A JSON object with eight labels. With the rule and the day stated, the labels follow the rule for the safety cases and the deadline cases; any miss is likely to be a case near the boundary, which is the one to read first.',
    },
    verify: [
      'The reply is only a JSON object with the keys case_1 to case_8, each urgent or routine.',
      'Compare each label with the rule and the day printed in the situation and material.',
      'Count correct answers for your own prompt, and note which kind of mistake any miss is.',
    ],
    difficulty: 'demanding',
  },
];
