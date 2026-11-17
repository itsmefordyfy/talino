import type { PracticeItem } from '../../types';

/**
 * Module 6, Time Management and Productivity: Focus, Deep Work, and Managing Distractions. One message task (lesson 25) and one role-play
 * (lesson 26), each used by exactly one activity in `courses/time-management-productivity/module-06.ts`. The partner is a person with a believable
 * position, not a villain, and a different person and moment from the teammate of module 4.
 */
export const items: PracticeItem[] = [
  // Lesson 25: a short, warm note that sets focus hours with the team.
  {
    id: 'prod-focus-hours-note',
    kind: 'message',
    title: 'Tell your team about your focus hours',
    situation:
      'You work in a team of six that runs an online shop, and you look after the product listings. Your teammates are used to asking you things in the team chat at any moment. You have decided to protect 9 to 11 every morning for your hardest work, and your lead, Marisol, likes the idea but wants everyone to understand it. Nobody has been told yet.',
    brief: 'Write a short message for the team chat that explains your focus hours, how people can still reach you if something is truly urgent, and when you will answer everything else.',
    channel: 'chat',
    mustInclude: [
      'the focus hours (9 to 11 each morning) and that you will be heads-down',
      'when you will read and answer messages (after 11)',
      'a clear way to reach you for something truly urgent, such as a call',
      'a friendly tone that does not blame anyone for past interruptions',
      'a short trial or review so people know it can be adjusted',
    ],
    targetWords: { min: 40, max: 110 },
    criteria: ['clarity', 'tone', 'actionability', 'completeness', 'professionalism'],
    difficulty: 'gentle',
  },

  // Lesson 26: a colleague from another team needs something while the learner is in a deep-work block.
  {
    id: 'prod-focus-block-colleague-request',
    kind: 'roleplay',
    title: 'A colleague breaks into your deep-work block',
    setting:
      'You are a junior analyst at a regional delivery company. You blocked 9:30 to 11:30 to finish the monthly delivery report, which is due to your manager at noon. Your phone is in your bag and your chat is closed. At 10:05 Rina, a sales coordinator from another team who sits two rows away, comes over looking worried.',
    goal: 'Protect your block without brushing Rina off, and make sure she has what she needs before her client call.',
    partner: {
      role: 'coworker',
      name: 'Rina',
      title: 'Sales coordinator on another team at the same company',
      personality:
        'Friendly, a little anxious and quick to apologise. She talks fast when she is worried and tends to explain her whole situation before she says what she needs. She is relieved by a clear time and a concrete next step, and she goes quiet and says "oh, no problem" if she feels she is a nuisance.',
      private:
        'She has a call at 2 PM with a hotel group that is unhappy about late deliveries and may cut its order. She needs the on-time delivery rate for the last three months and wants to know whether it is getting better or worse, so she can prepare what to say. She does not need it right now: 1:30 PM is early enough. She has not looked in the shared KPI sheet, which was updated yesterday, so she does not know the figures are already there. She will mention that she has not checked it only if she is asked what she has tried or where she looked. She would also gladly accept a quick pointer instead of a long explanation.',
      reactions: {
        good:
          'If the learner acknowledges her warmly, asks what she needs and when she needs it, and then offers a real time (for example just after the block) or a short pointer to where the numbers are, she relaxes, thanks them, repeats the time to confirm and lets them get back to work. If they ask where she has looked, she realises the shared sheet may already have the figures.',
        poor:
          'If the learner says a flat "I am busy" with nothing else, she says "oh, sorry, no problem" and leaves looking worried, then mentions the 2 PM call only as an aside. If the learner drops everything at once, she gladly accepts, adds a second small request and keeps talking. If the learner says "later" with no time, she asks "when?" and stays at the desk.',
      },
    },
    opening: "Hi, sorry to jump on you. I know you're busy. I have a client call this afternoon and I need the on-time delivery numbers for the hotel account. Do you have a minute?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['tone', 'listening', 'clarity', 'actionability', 'professionalism'],
    strongSigns: [
      'acknowledges Rina warmly before talking about their own block',
      'finds out what exactly she needs and when, before deciding what to say',
      'offers a real time that fits her 2 PM call, or a short pointer if it cannot wait',
      'asks where she has already looked or whether the figures are in a shared place',
      'keeps the reply short and kind, with no long apology or explanation of their own workload',
    ],
    traps: [
      'a flat "I am busy" or "not now" with no time and no help',
      'dropping the block at once without finding out how urgent it is',
      'a vague "later" or "after lunch" that does not fit a call at 2 PM',
      'promising to send everything without asking what she needs, then hurrying',
    ],
    difficulty: 'realistic',
  },
];
