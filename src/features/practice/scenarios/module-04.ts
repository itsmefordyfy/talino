import type { PracticeItem } from '../types';

/**
 * Module 4, Time Management and Productivity: three role-plays and three message tasks. Each is used by exactly one activity in
 * `courses/soft-skills-workplace/module-04.ts` (lessons 18 to 22). The partners are people with a believable position, not villains.
 */
export const items: PracticeItem[] = [
  // Lesson 18: protecting a focus block from a friendly interruption.
  {
    id: 'time-focus-block-interrupt',
    kind: 'roleplay',
    title: 'Protect your focus block, kindly',
    setting:
      'You work in the customer team of a small online store. You set aside 10:00 to 12:00 to finish the monthly supplier report, which is due to your manager at 3 PM today. It is 10:15 and Marco from the packing team has walked over to your desk.',
    goal: 'Keep your report time without brushing Marco off, and make sure he gets help in time.',
    partner: {
      role: 'coworker',
      name: 'Marco',
      title: 'Packing coordinator at the same online store',
      personality:
        'Friendly, chatty and in a hurry. He does not realise that a quick question costs you more than a minute. He is not pushy, but he is easily hurt by a cold answer and tends to keep adding details when he is given room to talk.',
      private:
        'The label printer prints the wrong size again. A courier pickup is at 1 PM, so he needs the labels fixed by about 12:30. He does not need an answer right now, but he has not thought about that and he is afraid of being stuck with a box pile when the courier arrives. He does not know the printer fix takes about ten minutes once you look at it.',
      reactions: {
        good:
          'If the learner asks what the problem is and when he needs it, then offers a specific time that fits before his 1 PM pickup (or a quick pointer if it really cannot wait), he relaxes, thanks them, repeats the time to confirm and lets them get back to work. He may offer to message when he is ready.',
        poor:
          'If the learner says a flat "I am busy" with nothing else, he says "oh, ok, never mind" in a hurt tone and mentions the courier only as a guilty aside. If the learner says yes at once and drops everything, he adds a second and third small problem. If the learner says "later" with no time, he asks "when?" and stays hovering.',
      },
    },
    opening: 'Hey, sorry, quick one! Do you have a minute? The label printer is doing the weird thing again.',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['tone', 'clarity', 'listening', 'actionability', 'professionalism'],
    strongSigns: [
      'finds out what the problem is and how soon it is needed before deciding anything',
      'protects the focus block without making Marco feel like a nuisance',
      'names a specific time that fits his real deadline instead of saying "later"',
      'offers a short, honest shortcut only if it truly cannot wait',
      'keeps the message short and warm, with no long apology',
    ],
    traps: [
      'a flat "I am busy" with no time and no help',
      'saying yes immediately and giving up the whole block',
      'a vague "later" or "maybe after lunch" that does not fit his 1 PM pickup',
      'a long explanation of their own workload that makes it about them',
    ],
    difficulty: 'gentle',
  },

  // Lesson 19: three "urgent" requests from one client.
  {
    id: 'time-three-urgent-tasks',
    kind: 'roleplay',
    title: 'Three messages, all "urgent"',
    setting:
      'You are a part-time virtual assistant for Tess, who runs a small online plant shop in Cebu. At 9 AM on Monday she sends you three tasks in one message and calls all of them urgent. You have about four hours of working time today.',
    goal: 'Find out what really matters most and by when, and agree an order for today that Tess understands.',
    partner: {
      role: 'client',
      name: 'Tess',
      title: 'Owner of a small online plant shop who hired you for a few hours a week',
      personality:
        'Warm, fast-talking and anxious. She sends tasks as they come into her head, so "urgent" often means "on my mind". She answers clearly and quickly when asked a concrete question, and gets more anxious when she hears a vague "I cannot do everything".',
      private:
        'The sale post goes live on Wednesday at 6 PM, so the new prices must be correct by Tuesday night for her to schedule it. Three of the fourteen customer emails are from people angry about a late delivery and she is afraid of bad reviews; the other eleven can wait until tomorrow. Booking the photographer is for next month and only needs to be decided by Thursday, because the photographer she likes books out. She has not thought about the order of these at all.',
      reactions: {
        good:
          'If the learner asks what each task is for, what happens if it waits and when it is really needed, then proposes an order with rough times, she relaxes, gives the real deadlines, says the three angry emails come first, and thanks the learner. She may ask for a short message when each part is done.',
        poor:
          'If the learner agrees to all three today without a plan, she cheerfully adds a fourth task. If the learner says "I cannot do everything" without asking anything, she repeats "but they are all urgent!" and her messages get shorter. If the learner picks an order without telling her why, she accepts it but worries aloud about the one left last.',
      },
    },
    opening: 'Hi! Three things, all urgent!! Update the prices for the sale, answer the customer emails, and book the photographer. Can you do them all today? Thank you thank you!',
    minTurns: 3,
    maxTurns: 9,
    criteria: ['clarity', 'listening', 'problem-solving', 'actionability', 'tone'],
    strongSigns: [
      'asks what happens if each task waits, instead of guessing which is most important',
      'asks for the real deadline of each task',
      'proposes a clear order for today with rough times and says what waits and until when',
      'keeps a calm, helpful tone and does not argue about the word "urgent"',
      'confirms the plan back so both of them are sure of it',
    ],
    traps: [
      'agreeing to everything today and hoping it fits',
      'saying "I cannot do everything" without asking a question or offering an order',
      'choosing the order silently, with no reason the client can check',
      'starting a long lecture on how to prioritise',
    ],
    difficulty: 'realistic',
  },

  // Lesson 21: a manager adds work to a full week.
  {
    id: 'time-add-work-full-week',
    kind: 'roleplay',
    title: 'The manager adds one more thing',
    setting:
      'It is Tuesday afternoon. Your week is already full: you promised the checkout fix for Wednesday, the help-article move is due Thursday, and you spend about two hours a day training a new colleague. Your manager Grace has just walked over.',
    goal: 'Agree a plan for the demo deck that you can really deliver, without a flat yes or a flat no.',
    partner: {
      role: 'manager',
      name: 'Grace',
      title: 'Your manager, who leads a small support and website team',
      personality:
        'Direct, a little rushed and under pressure from above. She respects people who tell her plainly what is possible, and she dislikes a "yes" that later turns into a missed date as much as a "no" with nothing else attached.',
      private:
        'The client moved their demo earlier this morning, so the deck is needed Friday at 10 AM and she found out only an hour ago. The one other person who could build it is on leave. She would accept moving the help-article move to next week because it is an internal goal, but she has not looked at that yet. A shorter deck would be fine for this client. She would rather lose a day of training than lose the demo.',
      reactions: {
        good:
          'If the learner states their current commitments briefly with dates, then offers one or two real options (move something, shrink the deck, get help) and asks which she prefers, she engages, thinks out loud, makes a decision and asks for a short check-in on Thursday.',
        poor:
          'If the learner says a plain yes, she says "great" and later remarks that the other items are still due. If the learner says a flat no, she gets sharper: "I am not asking, I am telling you this matters." If the learner says "I will try", she asks "so is that a yes?" and presses for a commitment. If the learner lists complaints, she cuts in with "I need to know what you can do".',
      },
    },
    opening: 'Hey, I know your week is packed, but I need a demo deck for the client by Friday at 10. Can you take it?',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['negotiation', 'clarity', 'problem-solving', 'professionalism', 'actionability', 'listening'],
    strongSigns: [
      'states current commitments in a few facts with dates, not as a complaint',
      'offers real options and asks Grace to decide between them',
      'names what would move or shrink if the deck is taken on',
      'asks what the deck needs to include so the work can be sized honestly',
      'ends with a clear agreement of what, by when, and what changed',
    ],
    traps: [
      'a quick yes that ignores the existing promises',
      'a flat no with no alternative',
      'a hopeful "I will try" that hides the real answer',
      'a long list of how busy they are with no proposal',
    ],
    difficulty: 'demanding',
  },

  // Lesson 20: turning a project into milestones for a client.
  {
    id: 'time-milestone-reply',
    kind: 'message',
    title: 'How long will the website take?',
    situation:
      'Rosa runs a small bakery in Davao and hired you to build a five-page website. You work on it part-time, about 10 hours a week, and the build is roughly 30 hours of work in total. You need her photos and menu text before you can start the main work, and she needs a few days to review your first design. She wants a date so she can tell her customers.',
    brief: 'Reply to Rosa with the project in a few milestones, what you need from her and when, and a launch date given as a range.',
    channel: 'email',
    received:
      'Hi! Thank you for taking on my website. I am so excited!! Quick question: how long will it take? I just need to know when I can tell my customers. Is it okay if I say next week? Thanks!',
    mustInclude: [
      'three to five milestones in order, each with rough timing',
      'what Rosa must send and by when, such as photos and menu text',
      'a launch date as a range rather than one guess',
      'the one assumption the dates depend on, such as her review time',
      'a polite answer to "next week?" that does not simply agree',
    ],
    targetWords: { min: 90, max: 170 },
    criteria: ['clarity', 'completeness', 'actionability', 'tone', 'professionalism'],
    difficulty: 'gentle',
  },

  // Lesson 21: declining a deadline in writing.
  {
    id: 'time-decline-in-writing',
    kind: 'message',
    title: 'Not by next Friday',
    situation:
      'You are a freelance web designer. A past client, Mr. Villanueva, who runs a tutoring centre, wants a new landing page. You are booked solid with other clients until the 24th, but you would like to keep him as a client. You could start on the 25th, or you could do a smaller one-page version sooner.',
    brief: 'Reply to Mr. Villanueva: say clearly that you cannot do next Friday, give your reason briefly, offer at least one real option and ask him to choose.',
    channel: 'email',
    received:
      'Hello! We are launching our new term soon and I need a landing page like the last one. Can you do it by next Friday? You did great work before, so I am counting on you. Thanks!',
    mustInclude: [
      'a clear statement that next Friday is not possible, with no "I will try"',
      'a short, honest reason without a long apology',
      'at least one real option, such as a start date, a smaller version or a referral',
      'thanks that keeps the relationship warm',
      'a clear next step asking him to choose',
    ],
    targetWords: { min: 70, max: 140 },
    criteria: ['clarity', 'tone', 'professionalism', 'completeness', 'actionability', 'empathy'],
    difficulty: 'realistic',
  },

  // Lesson 22: sharing the week's plan, honestly, with a manager.
  {
    id: 'time-week-plan-note',
    kind: 'message',
    title: 'Your plan for next week, shared honestly',
    situation:
      'It is Friday. You have about 28 usable hours next week. Already planned: onboarding a new colleague (6 hours, 2 hours a day Monday to Wednesday), invoice clean-up (8 hours, due Thursday), three team meetings (3 hours) and the support queue (5 hours spread over the week). That is 22 hours. Your manager Ken has just asked you to finish an 8-hour quarterly report review by Wednesday.',
    brief: 'Write Ken a short chat message with your plan for the week, say honestly what does not fit and why, and offer options for him to choose from.',
    channel: 'chat',
    received: 'What does your plan look like for next week? I want the quarterly report review done by Wednesday so the leadership can read it Thursday.',
    mustInclude: [
      'a short summary of the week: what is already planned and roughly when',
      'the honest limit: the review plus the committed hours does not fit by Wednesday, with a number or a named conflict',
      'at least one realistic option, such as a later finish, a partial review by Wednesday or something that moves',
      'a clear question that lets Ken decide',
      'a note that you will confirm or update the plan on Monday',
    ],
    targetWords: { min: 100, max: 200 },
    criteria: ['clarity', 'completeness', 'professionalism', 'actionability', 'tone'],
    difficulty: 'demanding',
  },
];
