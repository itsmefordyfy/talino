import type { PracticeItem } from '../types';

/**
 * Module 2, Teamwork and Collaboration: three role-plays (an unclear owner, feedback about late handoffs, a disagreement about when to ship)
 * and two message tasks (unsticking a quiet thread, a handoff note). Each is used by exactly one lesson activity.
 */
export const items: PracticeItem[] = [
  {
    id: 'team-unclear-ownership',
    kind: 'roleplay',
    title: 'Who owns the fair signs?',
    setting:
      'You and Marco are teachers running a school science fair together on Friday. On Tuesday morning you notice that the welcome signs and student name tags have not been printed. You thought Marco was handling them, and he thought you were. The print shop needs one working day. You find him in the staff room.',
    goal: 'Find out where the signs really stand and agree who owns them from here, without blaming anyone.',
    partner: {
      role: 'coworker',
      name: 'Marco',
      title: 'Science teacher and co-organizer of the fair',
      personality:
        'Friendly and a little disorganized. Apologizes quickly and gets flustered if he feels blamed. Relaxes when someone offers a plain plan and speaks to him like a partner.',
      private:
        "Last week he said 'I will look into the signs' and meant he would ask the principal about the budget, but he has not asked yet. Tomorrow afternoon he is also covering a colleague's class, so his time is tight, but he will only say so if asked. He would be glad to hand the printing to someone as long as he still does the budget request.",
      reactions: {
        good: 'He relaxes, says honestly what he did and did not do, mentions his schedule if the learner asks about it, and agrees to a concrete owner, a time and a way to check back.',
        poor: 'If he is blamed he gets defensive or over-apologizes and promises everything with no plan. If the learner is vague he agrees to "try", and if the learner silently takes everything he lets them and shares no useful information.',
      },
    },
    opening: 'Oh, hi. You look like you want to talk about something. Is it the fair?',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['collaboration', 'clarity', 'accountability', 'tone', 'actionability'],
    strongSigns: [
      'Names the gap in neutral words, as a thing the two of them share, not as his mistake',
      'Owns their own part, for example that they assumed instead of checking',
      'Asks where things stand before deciding anything',
      'Checks his time and what else he is carrying before dividing the work',
      'Ends with one named owner, a time, and how they will check in',
      'Says the agreement back so both leave with the same picture',
    ],
    traps: [
      'Opening with "you forgot" or "you never told me"',
      'Quietly taking all the work and calling it solved',
      'Staying vague, such as "let us try to get it done"',
      'Forgetting the print shop needs a working day',
      'Leaving without saying who does what by when',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'team-feedback-late-handoffs',
    kind: 'roleplay',
    title: 'Late handoff notes',
    setting:
      "You and Lena are virtual assistants who share one client, a busy travel coach. Lena finishes the day's bookings and is supposed to send a handoff note by 5 PM so you can start at 8 AM. For the third time this week the note arrived after 9 PM, and you spent your first hour guessing what had been done. You asked Lena for ten minutes on a video call.",
    goal: 'Give Lena feedback about the late notes that she can act on, and agree on what will change.',
    partner: {
      role: 'coworker',
      name: 'Lena',
      title: 'Virtual assistant who handles bookings for the same client',
      personality:
        'Capable and proud of her work, and tired. Quick to explain her side. Reacts badly to words like "always", "never" or "unprofessional". Responds well to specific examples and to being asked what would help.',
      private:
        'The client keeps sending her requests after 5 PM, so she keeps working and writes the note last. She has not told anyone because she worries it will look as if she cannot cope. She would gladly send a short note at 5 PM and a fuller update later, if that is allowed.',
      reactions: {
        good: 'She calms down, admits the notes have been late, explains the client requests when she is asked about her side, and works with the learner on a concrete change such as a short note at 5 PM.',
        poor: 'If she hears a label or a sweeping claim she becomes defensive, lists everything she does, or goes quiet and says "fine, I will try harder". She does not reveal the client requests unless asked, and she does not commit to anything specific if the learner stays vague.',
      },
    },
    opening: 'Hi! You said you wanted to chat. Is something wrong with the bookings?',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'tone', 'empathy', 'actionability', 'listening'],
    strongSigns: [
      'Begins by saying why they are raising it, such as keeping the client well served',
      'Describes what happened with dates and what it cost them, without labels or "always"',
      'Asks for her side and actually uses what she says',
      'Offers to share the problem, not only to list her faults',
      'Makes a specific request and agrees a concrete change with her',
      'Closes by confirming what each of them will do next',
    ],
    traps: [
      'Calling her unreliable or unprofessional',
      'A long list of past complaints instead of one clear pattern',
      'Praise that hides the real point',
      'Telling her what she must do without asking what is going on',
      'Ending with "please try to do better" and no agreement',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'team-disagree-approach',
    kind: 'roleplay',
    title: 'Ship Friday or test first?',
    setting:
      'Your small team is building a booking app for a hair salon. You want to release a first version on Friday so the owner can start taking bookings. Tomas, the other developer, wants one more week of testing first. The salon owner has a launch event next Saturday. You have a few minutes together after the daily call, and you are both tired of going back and forth.',
    goal: "Understand why Tomas disagrees and reach a decision you can both support.",
    partner: {
      role: 'coworker',
      name: 'Tomas',
      title: 'Developer on the same team who has built booking apps before',
      personality:
        "Direct and experienced, not rude. Says 'trust me' when he feels unheard. Calmer when his concern is named and checked. Dislikes being rushed or being told it will probably be fine.",
      private:
        'At his last job a launch with double bookings cost a client a weekend of angry customers, and he blamed himself. His real worry is double bookings, not the whole app. He would accept a limited release, for example a few days with one trusted salon staff member and a check for double bookings, but he will not offer it first. He suspects the Friday date is about speed, not about what the salon needs.',
      reactions: {
        good: 'He opens up about the double-booking fear, takes the learner\'s goal seriously, and works toward a narrower plan. He agrees to a way of deciding and says what would make him comfortable.',
        poor: 'If he is dismissed, pressured or told it will be fine he repeats that the team needs a week and goes quiet, or says "fine, your call" without committing. If the learner gives in at once he accepts, but says he is still worried.',
      },
    },
    opening: "Look, I know you want Friday. I'm just not comfortable shipping this without another week of testing.",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['listening', 'collaboration', 'problem-solving', 'tone', 'negotiation', 'clarity'],
    strongSigns: [
      'Says his concern back in their own words and checks it is right',
      'Names the goal they share, a launch the salon can rely on',
      'Asks what exactly he is afraid will happen, instead of guessing',
      'Separates his specific risk from the general plan, and tests it with a small step',
      'Proposes how to decide, such as a limited release, a check or the owner choosing',
      'Checks that he can support the outcome, and agrees what happens next',
    ],
    traps: [
      'Saying "it will be fine" without evidence',
      'Pulling rank or pointing at the deadline as the only reason',
      'Giving in at once to end the tension',
      'Guessing at his motives',
      'Talking only about speed',
      'Ending with no agreement about what happens next',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'team-stalled-thread',
    kind: 'message',
    title: 'Unstick the logo thread',
    situation:
      'You are a freelance web developer building a site for a small dental clinic, working with Pia, the designer, who lives in a different time zone. Two days ago you asked in the team chat which logo file to use in the page header. The clinic sent a full-color logo and a one-color logo. You cannot finish the header without knowing which one, and the clinic wants a preview on Thursday. It is now Tuesday, 2 PM in Manila.',
    brief: 'Write one follow-up message in the thread that Pia can answer in under a minute and that says what you will do if she cannot reply in time.',
    channel: 'chat',
    received: 'Pia (Sunday, 4:12 PM): Let me check and get back to you! I think the clinic sent two versions.',
    mustInclude: [
      'what is blocked and why it matters, including the Thursday preview',
      'the specific question, with the two logo options named',
      'a day and time, with the time zone, by which an answer is needed',
      'what you will do by default if there is no reply',
      'a friendly tone with no blame',
    ],
    targetWords: { min: 40, max: 110 },
    criteria: ['clarity', 'tone', 'completeness', 'actionability', 'professionalism'],
    difficulty: 'realistic',
  },
  {
    id: 'team-handoff-note',
    kind: 'message',
    title: 'Handoff before leave',
    situation:
      "You are a virtual assistant for a small online shop and will be offline from Wednesday to Friday. Jun, another assistant, will cover for you. Open work: three customer emails waiting for replies (two about late deliveries, one refund the owner must approve first); the weekly newsletter, drafted in the newsletter tool and due Thursday at 9 AM, which still needs the 10 percent promo code from the owner, who has not sent it; and the inventory sheet, updated every day at 10 AM in about 15 minutes, in the shared drive folder called Shop Daily.",
    brief: 'Write a handoff note that Jun can follow without asking you anything.',
    channel: 'update',
    mustInclude: [
      'where each of the three jobs stands right now',
      'what Jun should do next on each job, in order',
      'the missing promo code and who to ask for it',
      'the refund that needs the owner\'s approval before anything is sent',
      'where to find the files, by name',
      'when you are unreachable and who to ask instead',
    ],
    targetWords: { min: 120, max: 260 },
    criteria: ['clarity', 'completeness', 'actionability', 'structure', 'professionalism'],
    difficulty: 'gentle',
  },
];
