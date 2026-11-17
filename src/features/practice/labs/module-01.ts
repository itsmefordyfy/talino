import type { PracticeItem } from '../types';

/**
 * Prompt labs of Generative AI module 1 (`kind: 'lab'`). Written with the module's lessons; see docs/content/GENAI_BRIEF.md.
 * Every shop, clinic, person and number in the materials is invented. Server-only fields (`system`, `facts`) never name what a good prompt says.
 */
export const items: PracticeItem[] = [
  {
    id: 'lab-01-meeting-summary',
    kind: 'lab',
    title: 'Summarize the meeting without inventing',
    experiment: 'summarization',
    situation: 'Lena owns Harbor Street Bakery. She missed the second half of the weekly team meeting and has two minutes before she must leave. She needs an update from the notes, and she needs to be able to trust every line of it.',
    goal: 'Get a short summary that gives the decisions, the owners and the dates, and that does not turn an open question into a decision.',
    material:
      'HARBOR STREET BAKERY: WEEKLY TEAM MEETING (fictional)\n' +
      'Date: Tuesday, 4 March. Present: Lena (owner), Omar (kitchen), Priya (front counter), Chris (deliveries).\n\n' +
      '1. Easter boxes. Lena said the order form for the Easter boxes will open on 17 March. Each box holds 6 pastries. The price has not been decided yet. Omar said the ovens can make at most 40 boxes a day.\n\n' +
      '2. Deliveries. Chris reported 3 late deliveries last week, all on Friday afternoon. He thinks the cause is the road works on Pier Road, but he has not checked the delivery log. Priya will check the log by Thursday and tell Chris what she finds.\n\n' +
      '3. Supplies. The flour supplier raised its delivery fee. Omar asked to look for a second supplier. Lena agreed and asked Omar to bring two options to the next meeting on 11 March.\n\n' +
      '4. Customer comments. Priya read two comments: one customer said the croissants were too small, and another loved the new ube roll. The team agreed not to change the croissant size until more comments come in.\n\n' +
      '5. Other. The card reader at the front counter will be replaced on Monday, 10 March. Nobody has said who will tell the customers.',
    starterPrompt: 'Summarize this.',
    system: 'You are a helpful assistant. Follow the user’s request, using only the meeting notes provided. If the notes do not say something, do not add it.',
    maxRuns: 4,
    output: { format: 'text' },
    facts: [
      'The Easter box order form opens on 17 March',
      'Each Easter box holds 6 pastries, and the price has not been decided',
      'The ovens can make at most 40 boxes a day',
      'There were 3 late deliveries, all on Friday afternoon, and the cause (road works) has not been checked',
      'Priya will check the delivery log by Thursday',
      'Omar will bring two second-supplier options to the 11 March meeting',
      'The team decided not to change the croissant size for now',
      'The card reader is replaced on 10 March and nobody has been asked to tell customers',
    ],
    criteria: [
      { id: 'reader', label: 'Says who the summary is for and what they need from it' },
      { id: 'format', label: 'Asks for a structure, such as decisions, owners and dates' },
      { id: 'open', label: 'Asks for open questions to be listed separately from decisions' },
      { id: 'limit', label: 'Sets a length limit and tells the model to add nothing the notes do not say' },
    ],
    tips: [
      'Name the reader and the situation: a busy owner who needs to act, not a student who wants to learn about the meeting.',
      'Ask for headings such as Decisions, Who does what by when, and Still open. A clear structure makes missing details easy to see.',
      'Give the model a rule for gaps, such as “write not decided if the notes do not say”. Without one, it may fill the gap with something plausible.',
      'Set a length, for example “under 120 words”, so the summary stays quick to read.',
    ],
    example: {
      prompt: 'You are helping a busy bakery owner who missed part of a meeting. Using only these notes, write a summary under 120 words with three headings: Decisions, Who does what by when, and Still open. If something is not decided or the notes do not say, write “not decided” or “not stated”. Do not add anything that is not in the notes.',
      outcome: 'A short summary in three sections. Decisions lists the croissant size staying the same. The next section lists Priya checking the log by Thursday and Omar bringing two supplier options on 11 March. Still open lists the Easter box price, the cause of the late deliveries and who tells customers about the card reader. The price is clearly marked as not decided.',
    },
    verify: [
      'Every date, number and name in the summary appears in the notes.',
      'Anything the notes leave undecided (the Easter price, the cause of the late deliveries, who informs customers) is not written as a decision.',
      'No new people, prices or promises have been added.',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'lab-01-tier-compare',
    kind: 'lab',
    title: 'Same prompt, two model tiers',
    experiment: 'text-generation',
    compare: 'models',
    situation: 'You help run Lantern Home Goods, a small online shop. A customer is upset about a damaged item and a late delivery, and you need a reply the shop could actually send. You want to see how two model tiers handle the same prompt on the same facts.',
    goal: 'Write one prompt that produces a reply a shop owner could send with light editing, then compare the two answers on accuracy, tone and effort to fix.',
    material:
      'CUSTOMER MESSAGE (fictional, received Monday):\n' +
      '“Hi, I ordered a bamboo desk organizer (order 4471) on 2 March. It arrived on 9 March with a cracked side panel. I want my money back. This is the second time you have been late with something. Dana”\n\n' +
      'SHOP FACTS:\n' +
      '- Shop: Lantern Home Goods (online only).\n' +
      '- Order 4471 shipped on 5 March. The courier’s estimate was 8 March.\n' +
      '- Return policy: damaged items can be returned or replaced within 14 days of delivery. A refund goes to the original payment method within 5 working days after the shop receives the item back, or after the customer sends a photo of the damage and the shop approves it.\n' +
      '- Support hours: Monday to Friday, 9 AM to 5 PM.\n' +
      '- The shop does not offer compensation beyond the refund or replacement.',
    starterPrompt: 'Reply to this customer.',
    system: 'You are a helpful assistant for a small online shop. Follow the user’s request and use the customer message and shop facts provided. Do not make up shop policies.',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'tone', label: 'States who is writing, who is reading and the tone (calm, apologetic, plain)' },
      { id: 'facts', label: 'Tells the model to use only the shop facts, and what to do when a fact is missing' },
      { id: 'step', label: 'Asks for one clear next step for the customer' },
      { id: 'limit', label: 'Sets a length limit so the reply is short enough to send' },
    ],
    tips: [
      'Write the prompt once, then read both answers with the shop facts next to you. The question is which one needs less fixing, not which one sounds nicer.',
      'Tell the model what the shop can promise (refund or replacement, within the policy) and what it cannot, so it does not invent compensation.',
      'Ask for one clear next step, such as sending a photo of the damage, so the customer knows what to do.',
      'Compare the time and size of the two answers as well as the wording. A shorter, faster answer may be enough for a simple reply.',
    ],
    example: {
      prompt: 'You write for Lantern Home Goods to an upset customer named Dana. Tone: calm, sorry, plain English, under 110 words. Use only the shop facts provided and do not promise anything that is not in the policy. Say sorry for the damage and the delay, explain the refund or replacement options and the 14-day rule, and give one clear next step: send a photo of the damage by reply. If something is not in the facts, do not mention it.',
      outcome: 'A short, apologetic reply of about a hundred words that offers a refund or a replacement, asks for a photo of the cracked panel, states that the refund arrives within five working days of approval, and does not promise extra compensation. It does not mention the courier’s fault as a fact because the shop facts do not say whose fault it was.',
    },
    verify: [
      'The refund timing (within 5 working days, after the photo is approved or the item is back) matches the shop facts.',
      'The order number and dates are the ones in the message, and the reply does not add a new date.',
      'No extra compensation, discount or courier blame has been invented.',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'lab-01-clinic-notice',
    kind: 'lab',
    title: 'A vague prompt against a specific one',
    experiment: 'playground',
    compare: 'prompts',
    situation: 'You are the receptionist at Maple Row Clinic. The clinic’s weekday closing time moves one hour earlier from next month, and you must tell the patients by text message. You have the facts, but not much time.',
    goal: 'Write prompt A as a quick, vague request and prompt B as a full brief, then compare what each one gets right and what each one invents.',
    material:
      'FACTS FOR THE PATIENT NOTICE (fictional clinic)\n' +
      '- Clinic: Maple Row Clinic.\n' +
      '- The change starts on Monday, 10 March.\n' +
      '- Weekday hours move from 8:00 AM to 6:00 PM to 8:00 AM to 5:00 PM, Monday to Friday.\n' +
      '- Saturday hours stay the same: 9:00 AM to 12:00 PM.\n' +
      '- Appointments already booked after 5:00 PM will be moved to the morning of the same day. The front desk will call each affected patient by Friday, 7 March.\n' +
      '- To change an appointment, call the front desk on 555-0148 between 8:00 AM and 5:00 PM.\n' +
      '- Walk-in blood tests are available Monday to Friday from 7:30 AM to 10:00 AM.\n' +
      '- Do not include patient names or any medical details.',
    starterPrompt: 'Write a message about the new clinic hours.',
    system: 'You are a helpful assistant for a small clinic’s front desk. Follow the user’s request. Use the facts provided, and do not invent clinic details that are not in them.',
    maxRuns: 6,
    output: { format: 'text' },
    criteria: [
      { id: 'reader', label: 'Names the reader (patients, many of them older) and asks for plain words' },
      { id: 'facts', label: 'Tells the model to use only the facts provided and to leave out anything that is not there' },
      { id: 'format', label: 'Sets a format and length, such as a text message under 320 characters' },
      { id: 'next', label: 'Includes a clear next step for patients who need to change an appointment' },
    ],
    tips: [
      'Prompt A can stay short on purpose. The point is to see what the model does when it is left to guess.',
      'For prompt B, name the reader, the channel (text message), the length limit and the tone.',
      'Tell prompt B’s model to use only the facts and to ask or leave out anything missing. That is what stops invented phone numbers and names.',
      'After both runs, go through each answer with the facts list and underline every detail that is not on it.',
    ],
    example: {
      prompt: 'Write a text message from Maple Row Clinic to patients, many of them older, in plain, warm English and under 320 characters. Use only the facts provided. Include the start date, the new weekday hours, that Saturday stays the same, and the phone number for changing an appointment. Do not add names, medical details or anything not in the facts.',
      outcome: 'A short, friendly message that gives the start date, the new weekday closing time, the unchanged Saturday hours and the phone number, with nothing invented. It may leave out the blood test hours to stay under the length limit.',
    },
    verify: [
      'Every time, date and phone number in each answer appears in the facts.',
      'The answer does not mention a doctor’s name, a website or other details that are not in the facts.',
      'The length and tone fit a text message to patients.',
    ],
    difficulty: 'gentle',
  },
];
