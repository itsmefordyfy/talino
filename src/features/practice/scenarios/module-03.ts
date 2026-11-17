import type { PracticeItem } from '../types';

/**
 * Module 3, Critical Thinking and Problem Solving (days 12 to 17): three role-plays (a client with a vague complaint, a director who pushes back on a
 * recommendation, an operations lead with a problem and a favourite theory) and two message tasks (a facts-and-assumptions update, a report on checking
 * an AI's recommendation). Each is used by exactly one activity in `courses/soft-skills-workplace/module-03.ts`. PlanBoard is an invented product.
 */
export const items: PracticeItem[] = [
  {
    id: 'think-vague-request-bakery',
    kind: 'roleplay',
    title: 'A client says her website is “bad”',
    setting:
      'You are a freelance web builder. Joy owns a small bakery in Cebu, and you built her online order page last year. She has just phoned you. She says nobody orders from the site and she wants it fixed. You do not yet know what is going wrong.',
    goal: 'Find out what is really going wrong before you suggest any work.',
    partner: {
      role: 'client',
      name: 'Joy',
      title: 'Owner of a small bakery with an online order page',
      personality:
        'Warm and busy, talks fast and answers exactly what she is asked, no more. Uses words like "bad" and "old" for things she does not like. Gets a little anxious about cost if the learner jumps to a redesign. Not technical, never uses jargon herself.',
      private:
        'About 300 people visit the order page each week, nearly all coming from her Facebook page, and fewer than 10 order. She reads these numbers from her order tool and will say them if asked. She tracks nothing else. Many people message her on Facebook asking "do you deliver to my area?" and she answers by hand. The order form asks for a full address and payment method before telling the customer the delivery fee or whether their area is covered, so she half suspects people give up there. She has not said so because her cousin told her the site "looks old" and she believed it. She is worried about spending money she does not have.',
      reactions: {
        good:
          'When the learner asks specific, curious questions (who visits, from where, what customers say, how many order, where they stop), she remembers more and shares it, including the Facebook messages about delivery areas. When the learner says the problem back in one sentence and checks it, she agrees or corrects it, relaxes, and trusts the plan.',
        poor:
          'When the learner jumps to a redesign, a price or technical words, she says "okay, if you think so", shares nothing more, and mentions that money is tight. If the learner blames her or her customers, she becomes defensive and short. The conversation ends with no useful facts.',
      },
    },
    opening: "Hi, it's Joy. Sorry to call so suddenly. The website is bad. Nobody orders from it. Can you just make it nicer, please? I can pay a little.",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['problem-solving', 'listening', 'clarity', 'relevance'],
    strongSigns: [
      'Asks open questions about who visits, what people do and what they say, instead of asking what the new design should look like',
      'Asks for one real example or one number, such as visits and orders per week',
      'Notices the difference between what Joy has seen and what she is guessing',
      'Says the problem back in one sentence and checks it with her',
      'Offers no price, no promise and no redesign before the problem is clear',
      'Ends with a small agreed next step, such as looking at the numbers together',
    ],
    traps: [
      'Accepting "bad" and "nobody orders" as the whole problem and proposing a redesign or a price',
      'Firing a long list of questions in one message so Joy cannot answer them all',
      'Using words like conversion, funnel or user experience that Joy does not use',
      'Telling Joy the site is fine, or that her customers are the problem',
      'Never checking back that the problem has been understood',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'think-facts-sales-note',
    kind: 'message',
    title: 'Sales dropped: what do you know?',
    situation:
      'You work part time as an operations assistant for an online store that sells handmade bags. Last week sales were lower than usual and your manager, Rina, wants an update before her 3 PM call with the owner. Your notes from this morning: the shop dashboard shows 22 orders last week, against about 40 in each of the three weeks before. Visits to the store were about the same as usual. Two customers wrote that the coupon box in the new checkout page was confusing. The shipping fee also went up on the same day the new checkout page launched. Mark, a teammate, is sure the new checkout page is the cause and wants to undo it. You have not yet checked whether the Monday email newsletter, which usually brings many orders, went out last week.',
    brief: 'Reply to Rina with an update she can use on her call: what you know, what you are only assuming, and what you will check next.',
    channel: 'chat',
    received:
      "Hi! Sales are down and I have the owner call at 3. What's going on? Mark says it's the new checkout and we should undo it. Is that right? I need something I can actually say.",
    mustInclude: [
      'the order numbers with where they came from (22 last week, about 40 before, from the shop dashboard)',
      'a clear difference between what is known and what is a guess',
      'at least two possible explanations, not only the new checkout page',
      'what you will check next and by when, including the newsletter',
      'no blame on Mark or the checkout page before it is checked',
      'a short line Rina can say on her call',
    ],
    targetWords: { min: 70, max: 170 },
    criteria: ['clarity', 'completeness', 'actionability', 'tone', 'problem-solving', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'think-recommend-pushback-launch',
    kind: 'roleplay',
    title: 'Your recommendation meets a hard question',
    setting:
      'You are the IT coordinator at a small training center. Online enrollment is planned to open this Monday, and parents have already been told the date. In your own testing, 2 of 10 sample payments did not confirm on the center\'s side, and you have not found out why. You have recommended delaying the opening by a week. Ramon, the center\'s director, has called a short meeting to hear your reasons.',
    goal: 'Explain your recommendation honestly, including what you do not know, and agree what will happen on Monday.',
    partner: {
      role: 'stakeholder',
      name: 'Ramon',
      title: 'Director of the training center; not technical; he announced Monday\'s opening to parents',
      personality:
        'Direct and short of time, but fair and respectful. Pushes back with "why not just..." questions to test whether a person really has reasons. Dislikes both vague answers ("maybe, it depends") and big promises ("it will definitely break"). Listens carefully when given a clear choice with a clear cost, and uses plain language.',
      private:
        'He promised the center\'s owners that enrollment would open Monday, and he fears looking unreliable to parents and to them. He would accept a middle path, such as opening Monday with "pay at the office" as the only way to pay for the first few days while the online payment is checked, if it is explained simply and the learner says who handles the extra work. He changes his mind only for a new fact or a clear alternative, never for pressure in either direction. If the learner says it will "definitely" fail or that it is "probably fine", he stops trusting them. He quotes "one in five" from the test, which is more certainty than 10 test payments can give.',
      reactions: {
        good:
          'When the learner gives a clear recommendation, says what is known and what is not, explains the cost of each choice in plain words and offers an alternative, he asks sharper but fairer questions, then picks the middle path or the delay and thanks them for a clear picture.',
        poor:
          'When the learner is vague, over-certain, defensive or technical, he pushes harder ("so is it a yes or a no?"), and may decide to open on Monday regardless and say "then it is on you". If the learner simply gives in, he opens on Monday and the payment risk is never discussed.',
      },
    },
    opening:
      'Thanks for coming. I hear you want to delay Monday. Parents already have the date. Two payments out of ten failed in your test, so that is one in five. Why can we not just open and fix it as we go?',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'problem-solving', 'professionalism', 'actionability', 'listening'],
    strongSigns: [
      'Gives the recommendation first, in one clear sentence, then the reasons',
      'Separates what is known (2 of 10 test payments failed) from what is not (why, and how often it would happen with real parents)',
      'Does not read a firm rate into a test of only ten payments',
      'Says the cost of each choice in plain words: a week of waiting, or parents who pay and are not confirmed',
      'Offers at least one alternative, such as opening with pay-at-the-office first',
      'Says what would change the recommendation and when it will be checked',
    ],
    traps: [
      'Claiming it will definitely fail, or that it is probably fine, with no evidence for either',
      'Hiding the uncertainty to sound more convincing, or hedging so much there is no recommendation',
      'Using technical words such as gateway, webhook or API that Ramon does not need',
      'Giving in the moment Ramon pushes, with no new fact or new option',
      'Getting defensive about the question instead of answering it',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'think-ai-check-note',
    kind: 'message',
    title: 'Report back on what an AI told you',
    situation:
      'Your team of 12 will grow to 25 by March. It needs a shared task board, many teammates use phones with limited mobile data, and the budget is up to ₱500 a month. You asked an AI assistant for a recommendation. It said: PlanBoard is free for up to 20 users, is used by over 90% of small businesses, and a 2023 study showed teams using it finish projects 40% faster; switching has no risk, and the cost for your team would be ₱0. You then checked. PlanBoard\'s own pricing page, opened today, says it is free for up to 10 users, and teams above 10 pay ₱180 per user per month for everyone. You searched for the study and could not find it. You found nothing on how much mobile data the app uses, and you have not tested exporting data. (PlanBoard is an invented product for this exercise.)',
    brief: 'Write to your team lead, Dina: what the AI suggested, what you checked, what you could not confirm, and your own recommendation or next step.',
    channel: 'email',
    received: 'Hi! Did the AI come up with anything for the task board? I need a name and a rough cost by tomorrow to bring to the budget meeting.',
    mustInclude: [
      "the AI's suggestion, named as the AI's and not as a fact",
      "what you checked and what you found: the real user limit and the real price",
      'what the real cost would be for the team, with the arithmetic or a clear estimate',
      'what you could not verify (the study, the mobile data use, exporting data)',
      'your own recommendation or next step, and when Dina will hear back',
    ],
    targetWords: { min: 90, max: 200 },
    criteria: ['clarity', 'completeness', 'actionability', 'professionalism', 'relevance'],
    difficulty: 'realistic',
  },
  {
    id: 'think-late-parcels-ops',
    kind: 'roleplay',
    title: 'Late parcels: find the problem, then a plan',
    setting:
      'You joined a small online shop two weeks ago as an operations assistant. Lorna, the operations lead, has asked you to work out why customers say their parcels arrive late and to bring her a plan she can take to the owner. She has a few minutes before the next delivery run.',
    goal: 'Work out what is really causing the late parcels and agree a recommended next step with Lorna.',
    partner: {
      role: 'team-leader',
      name: 'Lorna',
      title: 'Operations lead of a small online shop with two packers and a daily courier pickup at 3 PM',
      personality:
        'Practical and brisk, says what she thinks, and has a favourite theory: the courier is at fault. Will give facts when asked specific questions but does not volunteer them. Respects people who bring evidence and a clear plan, and gets impatient with general talk.',
      private:
        'Her own tally of last month: 30 complaints, and 21 of them are orders placed between Friday evening and Sunday. Packing happens Monday to Friday only and the courier collects at 3 PM on weekdays, so a weekend order is packed on Monday and shipped Monday afternoon at best. Orders placed Monday to Thursday arrive in about three days. The shop page promises "ships within 1 to 2 days". She has not looked at the days of the week. She does not want to hire a weekend packer because of the cost. She would accept changing the promise on the shop page, a clear Friday cut-off message, or a small trial where one packer works a Saturday half shift. Courier delivery times themselves are on time once parcels are collected.',
      reactions: {
        good:
          'When the learner asks who is affected, when, how many and what she has seen, she looks at her tally and gives the weekday pattern. When the learner separates her courier theory from what is checked, brings two or three options and suggests a small first test, she agrees and says she will take it to the owner.',
        poor:
          'When the learner just agrees with the courier theory, or proposes a new courier or a new hire without checking, she says "fine, do it" and the real cause is never found. If the learner talks only in general terms she gets impatient and ends the chat.',
      },
    },
    opening: "Customers keep saying their parcels come late, and the owner wants it fixed this month. I think it's the courier, honestly. What do you think we should do?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['problem-solving', 'listening', 'clarity', 'relevance', 'actionability', 'collaboration'],
    strongSigns: [
      'Asks who is affected, when it happens and how many, before accepting the courier theory',
      'Treats "it is the courier" as an idea to check, not a fact',
      'Asks for one number or one pattern, such as complaints by day of the week',
      'Offers two or three options with a cost and a small first step',
      'Says what they will check next and when they will report back',
      'Stays respectful of Lorna\'s experience while asking for evidence',
    ],
    traps: [
      'Agreeing with the courier theory to keep the peace',
      'Jumping to a solution such as changing couriers or hiring before knowing the cause',
      'Talking in general terms with no questions about when the late parcels happen',
      'Asking for a lot of data at once instead of one useful number',
      'Ending with no next step or no time to report back',
    ],
    difficulty: 'realistic',
  },
];
