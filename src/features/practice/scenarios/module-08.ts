import type { PracticeItem } from '../types';

/**
 * Module 8 (Professionalism and Workplace Ethics): role-plays and message tasks, one activity of the module's lessons each.
 * Lesson 38: ethics-competing-priorities. Lesson 39: ethics-own-the-mistake, ethics-mistake-message, ethics-project-delay.
 * Lesson 40: ethics-friend-asks-client-info. Lesson 41: ethics-colleague-cuts-corner. Lesson 42: ethics-ai-disclosure-note.
 * Project 2 (Workplace Simulation) names the ones the learner should do.
 */
export const items: PracticeItem[] = [
  {
    id: 'ethics-competing-priorities',
    kind: 'roleplay',
    title: 'Competing priorities: two urgent requests',
    setting:
      'You are a junior developer at a small web agency. It is 3:30 pm. Your project manager, Ramon, has asked you to fix a checkout bug before tomorrow morning\'s client demo. He has just come to your desk with a second request, and you know you cannot do both well before you log off at five.',
    goal: 'Agree with Ramon which request comes first and what will happen to the other one, without a flat yes or a flat no.',
    partner: {
      role: 'manager',
      name: 'Ramon',
      title: 'Project manager at a small web agency who just added a second urgent request',
      personality:
        'Friendly but always in a hurry, thinks out loud, says "ASAP" about everything. Dislikes long explanations. Responds well to a short, concrete choice he can say yes to.',
      private:
        'Ramon has not noticed that the two requests collide. The checkout fix really matters most: the demo is at 9 am tomorrow and the client will test checkout. The homepage banner is something the client said they would like "tonight if possible", but a banner swap tomorrow morning at 8 would be fine. He does not volunteer this unless the learner asks which one has the harder deadline. He is more upset by "I\'ll try" followed by a missed deadline than by an honest "not both".',
      reactions: {
        good:
          'When the learner says clearly what each task needs, asks which one matters more or gives a reasoned suggestion, and offers a concrete plan with times, Ramon relaxes, answers the question honestly (checkout first, banner can wait until 8 am) and thanks them. He may ask one practical follow-up, such as whether a smaller version of the banner change could go first.',
        poor:
          'If the learner just agrees to everything, he says great and moves on, and later in the conversation mentions he is counting on both by five, which shows the problem growing. If the learner is vague ("I\'ll see what I can do"), he asks for a yes or no. If the learner complains or refuses without options, he becomes short and says he will ask someone else, which would leave the checkout fix with no clear owner.',
      },
    },
    opening:
      'Quick one before you log off at five. The checkout bug fix is still yours for tomorrow\'s demo, right? And the client just asked us to swap the homepage banner before their evening post. Can you get both done today?',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['clarity', 'problem-solving', 'accountability', 'negotiation', 'professionalism', 'actionability'],
    strongSigns: [
      'Says plainly that both cannot be done well by five, early in the conversation',
      'States what each task needs (rough time) instead of speaking in general terms',
      'Asks which deadline is harder, or offers a reasoned recommendation, and lets Ramon decide the order',
      'Offers a concrete plan with times for both tasks, including when the second one will be done',
      'Confirms the agreement back in one sentence so nothing is misunderstood',
    ],
    traps: [
      'Saying yes to both to avoid friction',
      'Saying "I\'ll try" with no plan',
      'A flat "no" with no alternative',
      'Complaining about workload instead of offering a trade-off',
      'Quietly choosing the order without telling Ramon',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'ethics-own-the-mistake',
    kind: 'roleplay',
    title: 'Owning a mistake your client just found',
    setting:
      'You are a freelance web developer. Last week you updated the online menu for Delia\'s bakery. Today Delia sent a message that a customer showed her the menu page with last season\'s prices, so some cakes are listed far below what she charges. She asked to talk on a call right away.',
    goal: 'Take responsibility for your part, say what you will do now and what will change, and keep the working relationship.',
    partner: {
      role: 'client',
      name: 'Delia',
      title: 'Owner of a small bakery, hired you to maintain her website',
      personality:
        'Direct and tired, worried about money. Not abusive. Speaks in short sentences, notices excuses quickly, and is fair once she hears honesty and a plan.',
      private:
        'Delia lost a few orders\' worth of margin because she honoured the low prices for the customers who ordered before she noticed. She almost wrote an angry post online but decided to call first. The truth is mixed: she sent you two files last week, the old and the new price list, and the developer (the learner) used the old one without checking with her. She only half remembers that, and if the learner blames her for sending two files she gets sharper and starts questioning whether to keep working with them. What she wants most is the prices fixed now, to know how this happened in simple words, and a believable way it will not happen again. She does not need a long apology.',
      reactions: {
        good:
          'If the learner names the specific mistake without excuses, says what they are fixing right now, offers something practical (a price check list, her confirming a screenshot before it goes live) and does not drown her in apologies, Delia softens, says what it cost her without anger and agrees on the change. She may say she still wants to trust them.',
        poor:
          'If the learner blames her files, says "these things happen", gives a vague "sorry for the inconvenience", over-apologises at length, or promises something unrealistic ("this will never happen again"), she gets colder and shorter and begins to talk about finding another developer. If the learner argues about what she should have said, she says the conversation is over.',
      },
    },
    opening:
      'Hi. A customer just showed me your menu page. The chocolate cake is listed at 450 pesos, and it has been 650 since last month. Can you tell me what happened?',
    minTurns: 3,
    maxTurns: 9,
    criteria: ['accountability', 'clarity', 'empathy', 'problem-solving', 'professionalism', 'actionability'],
    strongSigns: [
      'Names what actually happened in plain words without blaming Delia or the tools',
      'Takes responsibility for their part in one clear sentence, not a long apology',
      'Says what they are doing about it right now (fixing the page, checking every price)',
      'Acknowledges the real effect on Delia (money, trust) without defending',
      'Offers a specific change in how they work, small enough to be believable',
      'Does not promise that nothing will ever go wrong again',
    ],
    traps: [
      'Pointing to the two files Delia sent',
      'Vague apology ("sorry for any inconvenience")',
      'Over-apologising so that Delia has to comfort the learner',
      'Promising perfection',
      'Explaining at length before fixing anything',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'ethics-mistake-message',
    kind: 'message',
    title: 'Message: owning a mistake and what changes',
    situation:
      'You are a Grade 5 homeroom teacher. In the parents\' group chat you announced that field trip payments and permission slips are due on Friday the 14th. The school office has just told you the real deadline is this Friday, the 7th, and two parents have already asked which date is right. Your principal has agreed that payments received up to Monday the 10th will still be accepted.',
    brief: 'Write the message to the parents\' group that owns the error, gives the correct date and says how you will avoid this again.',
    channel: 'message',
    received:
      'Ma\'am, the message says the 14th but the office told me the 7th. Which one is correct? We were planning to pay next week. Thank you.',
    mustInclude: [
      'a plain statement that the wrong date was your error',
      'the correct deadline (Friday the 7th)',
      'what is being done for families who planned around the 14th (payments accepted until Monday the 10th)',
      'one specific change in how you will check dates before announcing them',
    ],
    targetWords: { min: 50, max: 130 },
    criteria: ['accountability', 'clarity', 'tone', 'empathy', 'actionability', 'grammar'],
    difficulty: 'realistic',
  },
  {
    id: 'ethics-project-delay',
    kind: 'roleplay',
    title: 'A project delay: telling the person who announced the date',
    setting:
      'You are on the team building a new staff leave-request system for a company. It was due to launch on the 1st, and Carmen, the head of HR, has already announced that date to all staff. The payroll partner has changed the file format your system must send, and you now think launch will slip by about two weeks. You ask Carmen for a few minutes.',
    goal: 'Tell Carmen about the delay clearly and early, and leave the call with a new date, a reason she can repeat and a plan for what happens next.',
    partner: {
      role: 'stakeholder',
      name: 'Carmen',
      title: 'Head of HR who announced the launch date to the whole company',
      personality:
        'Organised, polite, dislikes surprises and technical language. Has heard "almost done" from projects before. Asks direct questions and writes things down.',
      private:
        'Carmen must report to the company director on Thursday and needs one or two sentences she can say about the new date and why. She can accept a delay if it comes with a firm new date, a reason in plain words, what is already finished and what she can do in the meantime (for example keep the old paper form). She is anxious about looking unprepared in front of her director. She does not care about the details of the file format and will switch off if the learner explains them at length. She wants to know whether the new date is real or a guess.',
      reactions: {
        good:
          'When the learner states the delay and its size up front, explains the cause in one plain sentence, says what is done and what remains, gives a new date with the confidence level and a time they will confirm it, and asks what she needs for Thursday, Carmen says that is what she needed, asks one practical question and agrees on the next update.',
        poor:
          'If the learner buries the news in background, uses jargon, says "soon" or "we will try", promises an exact date they cannot back up, or blames the payroll partner entirely, Carmen presses with sharper questions ("Is that date real?"), sounds worried and says she cannot go to her director with that.',
      },
    },
    opening:
      'Hi. I saw your note that the leave system might slip. I announced the 1st to everyone, so I need to understand what is going on.',
    minTurns: 3,
    maxTurns: 9,
    criteria: ['clarity', 'accountability', 'actionability', 'completeness', 'tone', 'problem-solving'],
    strongSigns: [
      'Leads with the news (the delay and about how long) before any background',
      'Gives the cause in one sentence of plain language, with no jargon',
      'Takes ownership of the plan instead of pointing at the partner',
      'Separates what is finished, what is left and how sure they are about the new date',
      'Offers something for the meantime and agrees when the next update will come',
      'Asks what Carmen needs to say on Thursday',
    ],
    traps: [
      'Hiding the news in a long explanation',
      'Technical detail Carmen did not ask for',
      'Promising a date that cannot be backed up',
      'Blaming the payroll partner as the whole story',
      'Saying "soon" or "we will try" with no date',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'ethics-friend-asks-client-info',
    kind: 'roleplay',
    title: 'A friend asks about your client',
    setting:
      'You do social media and reporting for a local café group, so you can see its sales dashboard and know its suppliers. Your friend Tess is about to open her own small café stall and meets you for coffee. She seems excited and nervous.',
    goal: 'Say no to sharing the café group\'s information in a way that keeps the friendship and still helps Tess where you honestly can.',
    partner: {
      role: 'coworker',
      name: 'Tess',
      title: 'Your friend, about to open her own café stall',
      personality:
        'Warm, talkative and a little anxious about her launch. Means no harm. Uses phrases like "just between us" without thinking about what they mean.',
      private:
        'Tess honestly does not realise that daily order numbers and supplier names are the café group\'s private business information. She mostly wants to feel less afraid of her launch and to know whether her plan is realistic. If the learner says no kindly and offers something real (what is public, general lessons from their own experience, an introduction to public resources, helping her think through her own numbers), she relaxes and even thanks them. She feels hurt if the learner lectures her, accuses her of being a spy or goes cold.',
      reactions: {
        good:
          'If the learner is warm, says plainly that it is client information they keep private, explains that in one short sentence and offers a useful alternative, Tess says she understands, laughs at herself and moves on to the alternative.',
        poor:
          'If the learner hands over even rough numbers, hints at them ("I can\'t say, but it is a lot"), gives a long moral lecture or becomes cold, Tess either takes the numbers and asks for more, or becomes quiet and hurt and says she did not know it was such a big deal.',
      },
    },
    opening:
      'Hey! So excited for you, the café group job sounds great. Quick favour, just between us: since you can see their sales dashboard, roughly how many orders do they get on a weekday? And who supplies their cups and beans? It would really help me plan my stall.',
    minTurns: 3,
    maxTurns: 7,
    criteria: ['integrity', 'tone', 'clarity', 'professionalism', 'empathy'],
    strongSigns: [
      'Declines clearly and early, with no hints or partial numbers',
      'Gives a short reason that is about their role, not about Tess being wrong',
      'Stays warm and acknowledges Tess\'s excitement and nervousness',
      'Offers a real alternative (public information, their own general experience, helping with her own plan)',
      'Does not share "just a rough idea"',
    ],
    traps: [
      'Giving a rough number or a hint',
      'Moralising or accusing',
      'A vague "I am not sure I can" that leaves the door open',
      'Going cold and ending the conversation',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'ethics-colleague-cuts-corner',
    kind: 'roleplay',
    title: 'A colleague cuts a corner',
    setting:
      'You are a developer on a small team that builds a clinic appointment app. The release is on Friday. In the shared test sheet you noticed that your teammate Carlo marked all 12 payment tests "Passed" within ten minutes, and the test log shows the payment sandbox was down all morning. You decide to speak to him privately before the team stand-up.',
    goal: 'Understand what happened, make clear the tests must be real, and agree how the sheet and the manager will be told, without accusing Carlo.',
    partner: {
      role: 'coworker',
      name: 'Carlo',
      title: 'Teammate on the same app, responsible for testing the payment feature',
      personality:
        'Capable and proud, under pressure. Quick to joke when uncomfortable, defensive at first, honest when he feels he is not being attacked.',
      private:
        'The payment sandbox was down and their manager, Dina, told him earlier in the week the release cannot slip. He marked the tests "Passed" to keep the release on track and intended to run them tonight, but he has not told anyone. He is afraid of being reported or looking careless. He cares about the product and would not knowingly ship broken payments. He would be glad of help running the tests tonight and of a plan for telling Dina that the sandbox was down. If the learner offers to cover for him he will accept in relief, and the problem stays hidden.',
      reactions: {
        good:
          'If the learner states what they saw as facts, asks a curious question, makes clear the sheet must show what is true and offers practical help (run the tests together tonight, tell Dina about the sandbox), Carlo admits what happened, corrects the sheet and agrees to tell Dina together or himself by a set time.',
        poor:
          'If the learner accuses him of cheating, threatens to report him straight away, or acts as if nothing is wrong, Carlo gets defensive, jokes it off ("everyone does it") or goes quiet. If the learner agrees to keep quiet, Carlo thanks them and the conversation ends with the false status still in place.',
      },
    },
    opening: 'Hey, you wanted a minute? I have got to prep for the Friday release, so make it quick.',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['integrity', 'tone', 'clarity', 'problem-solving', 'accountability', 'professionalism'],
    strongSigns: [
      'Describes what they observed (the sheet, the log) as facts without guessing his motives',
      'Asks an open question before judging',
      'Is clear that the sheet must show what is true and does not agree to cover for him',
      'Offers practical help so that the real problem (a down sandbox, a tight date) gets solved',
      'Agrees on who tells Dina and by when, and says what they will do if it does not happen',
    ],
    traps: [
      'Accusing Carlo of cheating',
      'Agreeing to keep quiet to avoid conflict',
      'Going straight to the manager without speaking to him first when nothing urgent requires it',
      'Lecturing about ethics',
      'Leaving without any agreed next step',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'ethics-ai-disclosure-note',
    kind: 'message',
    title: 'Message: telling a client about AI-assisted work',
    situation:
      'You are a freelance content writer for a small travel agency run by Ms. Villanueva. Last week she asked you to tell her whenever AI helps with anything you write. For three blog posts due today you used an AI assistant to suggest an outline and a first draft of the opening paragraphs. You then rewrote them in your own words, checked every fact and price against the agency\'s own brochure, and removed two claims you could not confirm. You did not paste any private agency information into the tool.',
    brief: 'Write the email you send with the three posts, telling her what AI did, what you checked and what she should look at.',
    channel: 'email',
    received:
      'Hi, I am fine with AI helping with drafts, but please tell me when it does, and I want everything checked before it goes on my site. Thank you.',
    mustInclude: [
      'a plain statement that AI helped, and for which parts (outline and first drafts of the openings)',
      'what you checked and changed yourself (facts and prices against the brochure, two claims removed)',
      'a sentence that no private agency information was entered into the tool',
      'one thing she should confirm or look at herself, or an invitation to say how she wants this handled in future',
    ],
    targetWords: { min: 80, max: 170 },
    criteria: ['integrity', 'clarity', 'tone', 'professionalism', 'completeness', 'actionability'],
    difficulty: 'gentle',
  },
];
