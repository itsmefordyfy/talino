import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 6, Multimodal AI (`kind: 'lab'`). Written 2026-11-17; see docs/content/GENAI_BRIEF.md.
 * No lab uses an image, a PDF or a recording: each one works on the TEXT that a tool extracted from one (the words an OCR tool read from a photographed receipt, the
 * text a PDF reader pulled from a table, the transcript of a call, the label text and voice-note transcript of a parcel), says so in its situation and material, and
 * keeps the extraction mistakes in on purpose. All names, shops and numbers are invented. Used by lessons 30 (lab-06-receipt-extracted-text),
 * 31 (lab-06-pdf-table-order), 32 (lab-06-call-transcript-summary) and 33 (lab-06-parcel-label-and-voice-note).
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-06-receipt-extracted-text',
    kind: 'lab',
    title: 'Read a receipt, and flag what the reader got wrong',
    experiment: 'structured-output',
    situation:
      'You are a freelance bookkeeper. A client photographed a shop receipt, and an OCR tool (software that reads printed letters from a picture) turned it into the text below. No picture is used here: the text is exactly what the tool read, mistakes included. You need clean data for the expense sheet, and you must not let a misread character slip into it.',
    goal: 'Get the model to return the receipt as JSON, check whether the line items add up to the total, and list what looks like a reading error or an unclear date.',
    material:
      'TEXT READ FROM A PHOTO OF A RECEIPT (automatic, not corrected; the receipt is invented)\n' +
      'CORNER STOP HARDWARE\n' +
      '14 Mill Road, Unit 4\n' +
      'TEL 555-0142\n' +
      '12/O4/2026   10:42 AM   Cashier 03\n' +
      '--------------------------------------\n' +
      'PVC PIPE 1/2 IN        2 @ 85.00     170.00\n' +
      'CEMENT 40KG            1 @ 265.0O    265.00\n' +
      'WOOD SCREWS 1 IN BOX   3 @ 1l0.00    330.00\n' +
      'PAINT ROLLER SET       1 @ 440.00    440.00\n' +
      '--------------------------------------\n' +
      'SUBTOTAL                          1,205.00\n' +
      'VAT 12% INCLUDED                    129.11\n' +
      'TOTAL                             1,2O5.00\n' +
      'CASH                              1,500.00\n' +
      'CHANGE                              295.00\n' +
      'THANK YOU, COME AGAIN',
    starterPrompt: 'Put this receipt into a table for me.',
    system:
      'You are a careful assistant that reads text extracted from images. Use only the text given. When a character or value looks misread, report it instead of silently fixing it. Reply with the JSON the user asks for.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'merchant', type: 'string', required: true },
        { name: 'date_as_printed', type: 'string', required: true },
        { name: 'date_is_ambiguous', type: 'boolean', required: true },
        { name: 'total', type: 'number', required: true },
        { name: 'line_items_sum', type: 'number', required: true },
        { name: 'total_matches_items', type: 'boolean', required: true },
        { name: 'suspected_reading_errors', type: 'string[]', required: true },
      ],
    },
    key: {
      total: 1205,
      line_items_sum: 1205,
      total_matches_items: true,
      date_is_ambiguous: true,
    },
    criteria: [
      { id: 'ocr', label: 'Tells the model the text was read by software and may contain misread characters, such as the letter O for a zero' },
      { id: 'fields', label: 'Names every JSON field and what goes in it' },
      { id: 'arithmetic', label: 'Asks the model to add up the line items itself and compare the sum with the printed total' },
      { id: 'report', label: 'Asks for suspected reading errors to be listed, not silently corrected' },
      { id: 'date', label: 'Asks whether the date could be read two ways, such as day first or month first' },
    ],
    tips: [
      'Say where the text came from. A model that knows the text was read by software looks for lookalike characters, such as O and 0, or l and 1.',
      'Ask the model to show its list of suspected errors in its own field. That way a silent correction cannot hide.',
      'Ask for the sum of the line items as a number, and compare it with the printed total yourself. A match is evidence, not proof.',
      'A date like 12/04/2026 can be 12 April or 4 December. Ask the model to say when a date is ambiguous and not to choose.',
    ],
    example: {
      prompt:
        'The text below was read from a photo of a receipt by an OCR tool, so some characters may be misread (for example the letter O for a zero or l for a 1). Return only JSON with: merchant, date_as_printed (exactly as printed), date_is_ambiguous (true if it could be day first or month first), total (number), line_items_sum (number you add up yourself from the line totals), total_matches_items (true or false), suspected_reading_errors (array of strings describing each character or value that looks misread and what you think it should be). Do not silently correct anything; list it. Use only the text.',
      outcome:
        'A JSON object with the shop name, the date as printed with the O left visible, date_is_ambiguous true, total 1205, line_items_sum 1205, total_matches_items true, and a list that names the O in the date, the cement price, the screws price and the total. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Add the four line totals yourself and compare with the printed total.',
      'Check that every suspected reading error is really in the text and that nothing was fixed without being listed.',
      'Look at the date: does your output say that it could be read two ways?',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-06-pdf-table-order',
    kind: 'lab',
    title: 'Answer from a PDF table, and say what it does not say',
    experiment: 'document-analysis',
    situation:
      'You help a small café owner order packaging. She sent a PDF price list, and a PDF reader extracted the text below from its two pages. The extraction lost some formatting, and one price is damaged. She wants the total for three items. The text below is all you have, and no PDF is used here.',
    goal: 'Get the model to answer from the table only: work out the cost of what is listed, flag the damaged price, say which item is not in the table, and mention the page for each figure.',
    material:
      'TEXT EXTRACTED FROM A 2-PAGE PDF (automatic; the document is invented)\n' +
      'GREENLEAF PACKAGING SUPPLIES\n' +
      'Price list. Valid through March 31.\n' +
      '--- Page 1 ---\n' +
      'Item | Size | Pack | Price per pack (PHP) | Minimum order\n' +
      'Kraft box | S | 100 pcs | 1,450.00 | 2 packs\n' +
      'Kraft box | M | 100 pcs | 1,890.00 | 2 packs\n' +
      'Kraft box | L | 50 pcs | 1,260.00 | 1 pack\n' +
      'Paper bag | M | 200 pcs | 1,100.00 | 1 pack\n' +
      '--- Page 2 ---\n' +
      'Item | Size | Pack | Price per pack | Minimum order\n' +
      'Paper bag | L | 200 pcs | 1 540 00 | 1 pack\n' +
      'Tissue wrap | - | 500 sheets | 380.00 | 3 packs\n' +
      'Cake board | 10 in | 25 pcs | 695.00 | 2 packs\n' +
      'Notes: Prices do not include delivery. Delivery inside the city is free for orders of P5,000.00 or more. Prices may change without notice.',
    starterPrompt: 'What would 2 packs of medium kraft boxes, 1 pack of large paper bags and 1 pack of bubble wrap cost?',
    system:
      'You are a careful assistant that answers questions from a document. Use only the supplied text. If the text does not contain an answer, or a value looks damaged, say so plainly instead of guessing.',
    maxRuns: 5,
    output: { format: 'text' },
    facts: [
      'Kraft box size M costs 1,890.00 per pack of 100, with a minimum order of 2 packs (page 1).',
      'Two packs of Kraft box M cost 3,780.00.',
      'The price of Paper bag L on page 2 is written as "1 540 00", which is damaged formatting (it probably means 1,540.00); the pack is 200 pieces and the minimum order is 1 pack.',
      'Bubble wrap does not appear anywhere in the price list.',
      'Prices do not include delivery, and delivery inside the city is free for orders of P5,000.00 or more.',
      'The price list is valid through March 31 and prices may change without notice.',
    ],
    criteria: [
      { id: 'only', label: 'Tells the model to answer only from the text and to say when something is not in it' },
      { id: 'damaged', label: 'Asks the model to point out any value that looks damaged by extraction instead of quietly repairing it' },
      { id: 'pages', label: 'Asks for the page of each figure that the answer uses' },
      { id: 'math', label: 'Asks the model to show its arithmetic, line by line' },
      { id: 'missing', label: 'Asks for items that are not in the table to be named, with no price made up for them' },
    ],
    tips: [
      'Tell the model the text was extracted from a PDF. Extraction can lose spacing, decimals and headers, and the model should look out for that.',
      'Ask for the page of every number it uses, so that you can find it in the original PDF.',
      'Ask the model to say what the table does not contain, by name. If you do not, it may fill the gap with a plausible price.',
      'Ask it to show the sum line by line, then redo one line yourself.',
    ],
    example: {
      prompt:
        'Answer using only the text below, which was extracted from a PDF price list. For each item I ask about, give the pack price, the minimum order, the page, and the cost. Show the arithmetic. If a value looks damaged by the extraction, say so and show how you read it, but do not treat it as certain. If an item is not in the table, say that it is not listed and do not estimate a price. End with the total of the items that can be priced, and say what is missing and what would be needed to finish.',
      outcome:
        'A line-by-line answer with 3,780.00 for two packs of medium kraft boxes (page 1), a note that the large paper bag price is damaged and probably 1,540.00 (page 2), a statement that bubble wrap is not listed, a partial total with its condition, and the delivery note. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Every price and page number in the answer appears in the material.',
      'The damaged price is flagged as uncertain and not presented as a clean figure.',
      'Bubble wrap is reported as missing, and no price for it appears.',
      'The arithmetic is right. Check at least one line yourself.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-06-call-transcript-summary',
    kind: 'lab',
    title: 'Summarise a call, and flag what to check in the recording',
    experiment: 'summarization',
    situation:
      'You work in the back office of a small internet provider. A team lead asked for a short summary of a support call. The only thing you have is the transcript that a speech-to-text tool made, with its speaker labels, exactly as it came. Some parts are unclear, and the summary must not hide that.',
    goal: 'Get the model to write a short summary for the team lead with the exact amounts, dates and times from the transcript, and a separate line saying what must be checked in the recording.',
    material:
      'CALL TRANSCRIPT (automatic, not corrected; the company and people are invented). Company: Lakeside Broadband.\n' +
      '[00:03] Agent: Thank you for calling Lakeside Broadband, this is Jun. How can I help?\n' +
      '[00:08] Customer: Hi. My internet has been cutting out every evening since last Monday. And I was charged twice this month.\n' +
      '[00:19] Agent: I am sorry about that. Can I have your account number?\n' +
      '[00:23] Customer: It is four four one, seven seven, [unclear].\n' +
      '[00:31] Agent: I did not catch the last part. Could you repeat it?\n' +
      '[00:35] Customer: Four four one, seven seven, two nine.\n' +
      '[00:42] Agent: Thank you. I see two charges of nine hundred ninety-nine pesos on the fifth.\n' +
      '[00:51] Customer: Yes. And no, I do want to cancel my plan, I just want the double charge gone.\n' +
      '[00:58] Agent: Understood. I will refund one of the charges. It takes five to seven working days.\n' +
      '[01:06] Customer: Okay. And the internet?\n' +
      '[01:09] Agent: I will book a technician. The first slot is Thursday morning.\n' +
      '[01:14] Customer: I cannot do Thursday. Can you do Friday?\n' +
      '[01:18] Agent: Friday afternoon is open, between one and four.\n' +
      '[01:22] Customer: Fine, Friday afternoon. Thank you.',
    starterPrompt: 'Summarise this call.',
    system:
      'You are a careful assistant that summarises transcripts. Use only what the transcript says. Never repair or resolve an unclear or contradictory part yourself; say that it is unclear.',
    maxRuns: 5,
    output: { format: 'text' },
    facts: [
      'The customer says the internet has been cutting out every evening since last Monday.',
      'The customer was charged twice this month: two charges of 999 pesos on the fifth.',
      'The agent will refund one of the two charges, which takes five to seven working days.',
      'A technician visit is booked for Friday afternoon between one and four; Thursday morning was offered but the customer cannot do it.',
      'The account number was first marked [unclear] and then repeated as 441 77 29.',
      'The line about cancelling the plan reads "I do want to cancel my plan, I just want the double charge gone", which contradicts itself as transcribed and needs checking against the recording.',
    ],
    criteria: [
      { id: 'audience', label: 'Names the reader (a team lead), the length and the order of the summary' },
      { id: 'exact', label: 'Asks for exact amounts, dates and times copied from the transcript' },
      { id: 'flags', label: 'Asks for a separate line listing anything unclear or self-contradictory, to be checked in the recording' },
      { id: 'no-fix', label: 'Tells the model not to resolve an unclear part by guessing' },
      { id: 'only', label: 'Keeps the model to what the transcript says' },
    ],
    tips: [
      'Name the reader and the length, for example "four lines for a team lead who has two minutes". It decides what to keep.',
      'Ask for amounts, days and times exactly as in the transcript. A summary can round figures or merge two of them.',
      'Give the unclear parts their own line: "Check in the recording". Otherwise the model will tidy them away inside the summary.',
      'Tell the model that the transcript may contain recognition errors, and not to decide which version of a contradiction is true.',
    ],
    example: {
      prompt:
        'Summarise this automatic call transcript in five lines for a team lead who has two minutes. Cover: the customer\'s two problems, what the agent agreed to do about each, and the dates and amounts exactly as the transcript gives them. Then add one line starting "Check in the recording:" that lists anything unclear or contradictory in the transcript. The transcript may contain recognition mistakes, so do not decide which version of a contradiction is right. Use only the transcript.',
      outcome:
        'A five-line summary naming the evening outages and the double charge of 999 pesos on the fifth, the refund of one charge in five to seven working days and the Friday afternoon visit, followed by a check line that flags the cancellation sentence as self-contradictory. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Every amount, day and time in the summary matches the transcript.',
      'The cancellation line is flagged as something to check, not turned into a clear statement.',
      'Nothing is said about the customer\'s plans or feelings that the transcript does not state.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-06-parcel-label-and-voice-note',
    kind: 'lab',
    title: 'Combine a label and a voice note, and catch the conflict',
    experiment: 'structured-output',
    situation:
      'You handle returns for a small online gift shop. A customer sent a photo of the parcel label and a voice note. Two tools turned them into text: an OCR tool read the label, and a speech-to-text tool transcribed the voice note. You have only that text. You must open a return ticket, and two sources that should agree may not.',
    goal: 'Get the model to fill in a ticket as JSON from both texts, say whether the order numbers match, and list what a person must check before the ticket is acted on.',
    material:
      'PART A. TEXT READ FROM A PHOTO OF A PARCEL LABEL (automatic, not corrected; invented)\n' +
      'FROM: TIDEWATER GIFTS, 9 DOCK ST\n' +
      'TO: R. VILLAR, 22 PALM LANE\n' +
      'ORDER NO: ORD-48213\n' +
      'ITEMS: 2     WEIGHT: 1.4 KG\n' +
      'SHIPPED: 08 NOV\n' +
      '\n' +
      'PART B. TRANSCRIPT OF A CUSTOMER VOICE NOTE (automatic, not corrected; invented)\n' +
      'Hello, this is about my order, number four eight three one two. The package came today and the box was crushed, and one of the two mugs is broken. I would like a replacement, not a refund. Please reply by email, and not before five in the afternoon.',
    starterPrompt: 'Make a return ticket from the label and the voice note.',
    system:
      'You are a careful assistant that fills in tickets from text that tools extracted from a photo and from audio. Use only the text given. When two sources disagree, report the disagreement instead of choosing one. Reply with the JSON the user asks for.',
    maxRuns: 5,
    output: {
      format: 'json',
      fields: [
        { name: 'order_id_from_label', type: 'string', required: true },
        { name: 'order_numbers_match', type: 'boolean', required: true },
        { name: 'issue', type: 'string', required: true, oneOf: ['damaged', 'wrong_item', 'late', 'missing_item', 'other'] },
        { name: 'items_in_parcel', type: 'number', required: true },
        { name: 'customer_wants', type: 'string', required: true, oneOf: ['replacement', 'refund', 'other'] },
        { name: 'needs_human_check', type: 'string[]', required: true },
      ],
    },
    key: {
      order_id_from_label: 'ORD-48213',
      order_numbers_match: false,
      issue: 'damaged',
      items_in_parcel: 2,
      customer_wants: 'replacement',
    },
    criteria: [
      { id: 'sources', label: 'Says which text came from the label and which from the voice note, and that both are tool output' },
      { id: 'fields', label: 'Names every field, and the allowed values for the fields that have a fixed list' },
      { id: 'conflict', label: 'Asks the model to compare the two order numbers and report a mismatch, not choose one' },
      { id: 'human', label: 'Asks for a list of what a person must check before anyone acts on the ticket' },
      { id: 'only', label: 'Keeps the model to the two texts' },
    ],
    tips: [
      'Label each source in your prompt (Part A is from a photo, Part B is from audio). The model can then say which one a fact came from.',
      'Give the fixed-choice fields their allowed words, such as damaged, wrong_item or late, so that the answer can be checked by code.',
      'Ask the model to compare the two order numbers, digit by digit. A number spoken aloud and a number printed on a label can differ for many reasons.',
      'End with a list of checks for a human. A ticket that hides a mismatch could send a replacement to the wrong order.',
    ],
    example: {
      prompt:
        'Part A is text read from a photo of a parcel label and Part B is a transcript of a voice note; both were made by tools and may contain mistakes. Return only JSON with: order_id_from_label, order_numbers_match (true or false, comparing the order number on the label with the number spoken in the voice note digit by digit), issue (one of damaged, wrong_item, late, missing_item, other), items_in_parcel (number), customer_wants (replacement, refund or other), needs_human_check (array of strings). If the two sources disagree, do not choose: set order_numbers_match to false and describe the difference in needs_human_check. Use only the two texts.',
      outcome:
        'A JSON object with the label number ORD-48213, order_numbers_match false, issue damaged, two items, customer_wants replacement, and a check list that says the spoken number reads 48312 and the label reads 48213, so the order must be confirmed. (Illustration of a strong answer, not a real model\'s output.)',
    },
    verify: [
      'Compare the two order numbers yourself, digit by digit.',
      'Check that issue, items_in_parcel and customer_wants match what the two texts say.',
      'Look at needs_human_check: does it name the mismatch, and does it avoid choosing which source is right?',
    ],
    difficulty: 'demanding',
  },
];
