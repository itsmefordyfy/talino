import type { PracticeItem } from '../types';

/**
 * Module 1, Communication Skills: four role-plays (listening, a busy coworker, a worried client) and four message tasks (an email, a plain-language
 * explanation, an urgent chat note, a follow-up after a call). Each is used by exactly one activity of lessons 2 to 6. Written 2026-11-17.
 * Partners are people with a believable position; no field holds an ideal reply.
 */
export const items: PracticeItem[] = [
  // ---------------------------------------------------------------- Lesson 2: an email (gentle)
  {
    id: 'comm-improve-email',
    kind: 'message',
    title: 'Ask a client to choose a new time',
    situation:
      'You are the virtual assistant of Greg, who runs an online coffee store from Perth, Australia. Next Thursday his supplier call clashes with a courier pickup that only he can sign for. You can move the supplier call to Friday at 10:00 or Monday at 9:00, both Perth time. The supplier needs an answer by Tuesday at noon, Perth time.',
    brief: 'Write the email that gets Greg to choose a new time for the supplier call.',
    channel: 'email',
    received: 'Hi, can you sort out next week\'s calendar? Busy. Thanks, Greg',
    mustInclude: [
      'the clash between the supplier call and the courier pickup, in one plain sentence',
      'both new options, with day, time and time zone',
      'the date and time by which Greg must choose',
      'what you will do once he answers',
      'a subject line that says what the email is about',
    ],
    targetWords: { min: 70, max: 150 },
    criteria: ['clarity', 'tone', 'grammar', 'professionalism', 'completeness', 'actionability'],
    difficulty: 'gentle',
  },

  // ---------------------------------------------------------------- Lesson 3: plain language (realistic)
  {
    id: 'comm-explain-plain',
    kind: 'message',
    title: 'Explain why the bakery website stopped taking orders',
    situation:
      'You built the website of Marisol\'s neighborhood bakery. On Saturday morning the order form did not work for about two hours, because the space the hosting company gives the site was full of old backup files. Two customers tried to order during that time, and their orders were saved and recovered, so none were lost. You deleted the old backups and the form works again. The space will fill up again in a few months unless Marisol moves to a bigger hosting plan, which costs a little more each month, or you clean the old files out once a month.',
    brief: 'Reply to Marisol so she understands what happened, what you did and what she needs to decide, without technical words she would not know.',
    channel: 'message',
    received: 'I got a scary email from the website company and my customers said the order form was broken!! What happened? Did I lose orders? Do I have to pay more now?? I do not understand all those technical words. Marisol',
    mustInclude: [
      'a plain-language explanation of what went wrong, with an everyday comparison or no unexplained jargon',
      'a direct answer to whether any orders were lost',
      'what you did to fix it',
      'the choice Marisol has to make and what you recommend',
      'a calm, reassuring tone that answers her three questions first',
    ],
    targetWords: { min: 90, max: 190 },
    criteria: ['clarity', 'tone', 'empathy', 'completeness', 'relevance', 'actionability'],
    difficulty: 'realistic',
  },

  // ---------------------------------------------------------------- Lesson 4: listening (gentle)
  {
    id: 'comm-listening-brief',
    kind: 'roleplay',
    title: 'The vague request in the hallway',
    setting:
      'You work in the operations team of a small online store. Rhea, the marketing coordinator, stops you at the coffee machine and asks for help with a report for Friday. She is rushing between calls, so you only get a few minutes.',
    goal: 'Find out exactly what Rhea needs, and leave the conversation with both of you sure you mean the same thing.',
    partner: {
      role: 'coworker',
      name: 'Rhea',
      title: 'Marketing coordinator at a small online store, between two back-to-back calls',
      personality:
        'Friendly, quick and a little scattered. Talks in half sentences ("the Friday thing", "you know"). Does not mind a few short, targeted questions but gets impatient when asked many at once or when asked things she already said. Warms up when someone repeats her request back in clear words.',
      private:
        'She needs a one-page summary of last month\'s sales for her boss\'s 2 p.m. meeting on Friday: only the five best-selling products, compared with the month before, as a short table she can put on a slide. She needs it by Thursday at noon so she can check it. She has not said any of this and will only say each piece when asked about it. If the learner starts working from a guess ("I will send you everything"), she says "sure, fine" because she is rushing, and the learner will have wasted a day. She is not testing the learner; she just does not realise how little she said.',
      reactions: {
        good:
          'When the learner asks open questions about the purpose, listens to the answer, asks about the deadline and what the finished thing should look like, and then says it back in their own words, Rhea relaxes, adds the missing detail, and corrects any part of the summary that is off. She ends by thanking them and agreeing the time to check in.',
        poor:
          'When the learner says "got it" without asking, guesses, piles on many questions in one message, or uses vague words like "the data", Rhea answers vaguely and hurries ("just the usual stuff, you know what I mean"). If the learner never confirms, she leaves with a cheerful "great, thanks!" and the misunderstanding is left in place.',
      },
    },
    opening: 'Oh, good, you\'re here! Quick one. I need the numbers for the Friday thing. The sales stuff, you know? I\'m on calls all day, so I\'m counting on you!',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['listening', 'clarity', 'completeness', 'actionability', 'tone'],
    strongSigns: [
      'asks what the numbers are for before deciding what to prepare',
      'asks about the deadline and what the finished result should look like',
      'keeps questions few and short instead of firing a list',
      'says the request back in their own words and checks it is right',
      'ends with a clear next step, such as when Rhea will see a first version',
    ],
    traps: [
      'saying "okay, I will get it done" without finding out what "it" is',
      'guessing what she means and offering to send everything',
      'asking so many questions in one turn that she cannot answer',
      'repeating her words exactly instead of checking the meaning',
      'ending without agreeing the deadline',
    ],
    difficulty: 'gentle',
  },

  // ---------------------------------------------------------------- Lesson 5: a chat note (realistic)
  {
    id: 'comm-urgent-chat-update',
    kind: 'message',
    title: 'Leave an urgent note for a manager who is away',
    situation:
      'You are a developer on the evening shift for an online shop. At 6:10 p.m. five customers reported to the support inbox that the last step of checkout shows "Payment failed". You checked, and the payment provider\'s status page shows no outage. You have not changed anything and you saved a screenshot. Your manager Priya is in a meeting for the next 30 minutes and has asked to be messaged in chat about anything that cannot wait. You need her to decide whether to put up a notice on the shop.',
    brief: 'Write the chat message Priya can read in ten seconds and act on when she comes out of her meeting.',
    channel: 'chat',
    mustInclude: [
      'what is wrong, in one line, and since when',
      'how many customers have been affected so far',
      'what you already checked and what you have not touched',
      'the decision you need from Priya and by when',
      'where the screenshot or details can be found',
    ],
    targetWords: { min: 40, max: 110 },
    criteria: ['clarity', 'completeness', 'actionability', 'professionalism', 'tone'],
    difficulty: 'realistic',
  },

  // ---------------------------------------------------------------- Lesson 6: asking a busy coworker (realistic)
  {
    id: 'comm-ask-busy-coworker',
    kind: 'roleplay',
    title: 'Asking a busy senior teacher for help',
    setting:
      'You are a new teacher at a school. The grading spreadsheet your department uses keeps showing wrong totals for your class, and you have been stuck on it for two hours. Teresa, a senior teacher who knows the sheet well, is at her desk finishing report cards that are due to the principal at 4 p.m.',
    goal: 'Get the help you need with the spreadsheet while respecting that Teresa is busy.',
    partner: {
      role: 'coworker',
      name: 'Teresa',
      title: 'Senior teacher and head of the English department, finishing report cards before a deadline',
      personality:
        'Warm but short on time. Speaks briefly and does not look up at first. Likes people who show they tried something first. Dislikes "can you look at this real quick?" with no detail, because it is never quick. Is generous with her time once she knows what is being asked.',
      private:
        'She is happy to help and secretly likes mentoring new teachers. She can spare about ten minutes right now, or a proper half hour after 4:30 p.m. The actual problem is that the learner\'s class rows sit below a hidden row that the totals formula does not include, but she will only point at that once she sees specifically what the learner has tried and what the wrong totals look like. She will not take over the learner\'s work; she wants them to learn the fix.',
      reactions: {
        good:
          'When the learner states the problem in a sentence, says what they already tried, makes a small and specific request, and offers a time that suits her, Teresa softens, gives the hint or books the half hour, and says she is glad they asked. She asks one question back and expects a clear answer.',
        poor:
          'When the learner is vague ("I just do not get the sheet"), tells a long story, asks her to fix it for them, or apologises over and over, Teresa gets shorter, says she really has to finish, and suggests they ask someone else or look at the help page. She does not become rude, but she does not solve the problem either.',
      },
    },
    opening: 'Oh, hi. I only have a minute, I\'m finishing the report cards for the 4 o\'clock deadline. What\'s up?',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['clarity', 'tone', 'completeness', 'actionability', 'professionalism', 'listening'],
    strongSigns: [
      'says the problem in one or two sentences instead of a long story',
      'says what they have already tried and what they saw',
      'makes a small, specific request rather than asking her to take over',
      'respects her deadline and offers or accepts a later time',
      'listens to her suggestion, says it back, and thanks her',
    ],
    traps: [
      'opening with a long apology instead of the request',
      '"can you just fix it" or "can you look at this real quick"',
      'describing the symptom as "it is not working" with no detail',
      'ignoring her deadline and pushing for help right now',
      'leaving without knowing what the next step is',
    ],
    difficulty: 'realistic',
  },

  // ---------------------------------------------------------------- Lesson 6: a worried client (demanding)
  {
    id: 'comm-client-status-call',
    kind: 'roleplay',
    title: 'The client who thinks nothing is happening',
    setting:
      'You are a freelance web developer building an online ordering page for Gabriel\'s printing shop. The product pages and the cart are finished. The payment connection cannot be switched on until Gabriel\'s business bank account is verified, and the bank asked him two weeks ago for documents. Gabriel has joined your video call and sounds upset.',
    goal: 'Help Gabriel see where the project really stands, including what you need from him, so he leaves the call knowing what happens next.',
    partner: {
      role: 'client',
      name: 'Gabriel',
      title: 'Owner of a small printing shop, paid half of the fee and expecting an online ordering page',
      personality:
        'Blunt, impatient and anxious rather than unkind. Interrupts. Uses simple words and has no patience for technical terms, which make him feel talked down to. Is sensitive to anything that sounds like blame. Respects people who are honest and concrete, and calms down quickly when he understands.',
      private:
        'He promised his regular customers that school uniform printing could be ordered online before a busy period starting on the 20th, and a cousin told him "a website takes a weekend". He is afraid of paying more and of being taken advantage of. He has not opened the bank\'s email asking for documents because it looked like spam, and he is a little embarrassed. He will reveal this only if the learner asks what he has received from the bank, or explains the payment step clearly enough that he connects it.',
      reactions: {
        good:
          'When the learner stays calm, answers his actual question first in everyday words, gives a clear picture of what is done and what is waiting, says plainly what is needed from him and by when, and checks he understood, Gabriel slows down, admits the bank email, asks what to send, and agrees to a date. He may still ask one pointed question about whether the 20th is safe.',
        poor:
          'When the learner uses technical words, gets defensive, blames him, or promises a date they cannot control, Gabriel gets louder, says "I do not understand any of that", threatens to find someone else, and later in the call asks "but you promised". If the learner is vague about what happens next, he asks for it in writing.',
      },
    },
    opening: 'Hi. I will be honest, I paid the first half and I have not seen anything. My cousin says a website takes a weekend. What exactly have you been doing all this time?',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'tone', 'empathy', 'listening', 'completeness', 'actionability'],
    strongSigns: [
      'acknowledges his worry before explaining',
      'answers his question about what has been done in everyday words, without jargon',
      'says clearly what is waiting and that one part depends on him',
      'does it without blaming him',
      'agrees concrete next steps with dates and checks he understood',
    ],
    traps: [
      'explaining the project in technical terms such as servers or integrations',
      'defending the timeline with a long list of work done',
      'implying it is his fault for not answering the bank',
      'promising the 20th without knowing when the bank will approve',
      'ending with "I will keep you posted" and no date',
    ],
    difficulty: 'demanding',
  },

  // ---------------------------------------------------------------- Lesson 6: a follow-up after a call (realistic)
  {
    id: 'comm-followup-after-call',
    kind: 'message',
    title: 'Confirm what was agreed after a call',
    situation:
      'You have just finished a video call with Gabriel, the owner of a printing shop whose online ordering page you are building. On the call you agreed that Gabriel sends the documents the bank asked for by Wednesday. You will connect the payment step on Thursday, after the bank verifies the account. You will test two practice orders with him on Friday, and the page goes live on Monday the 20th if the test passes. The bank\'s verification is out of your hands, and Gabriel was a little tense at the start of the call.',
    brief: 'Write a short email that confirms what was agreed, who does what by when, and invites him to correct anything.',
    channel: 'email',
    mustInclude: [
      'a short thanks or opening that fits the mood of the call',
      'each agreed step with who does it and the day',
      'the one thing you need from Gabriel and by when',
      'an honest note that bank verification depends on the bank',
      'an invitation to correct anything that is not right',
    ],
    targetWords: { min: 70, max: 160 },
    criteria: ['clarity', 'completeness', 'actionability', 'tone', 'professionalism', 'grammar'],
    difficulty: 'realistic',
  },
];
