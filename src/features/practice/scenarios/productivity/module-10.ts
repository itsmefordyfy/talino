import type { PracticeItem } from '../../types';

/**
 * Module 10, Time Management and Productivity (sustainable productivity): one role-play and two message tasks. Each is used by exactly one activity in
 * `courses/time-management-productivity/module-10.ts` (lessons 40 to 43). The partner is a person with a believable position, not a villain.
 * Nothing here gives medical advice; the partner points to a doctor if health comes up.
 */
export const items: PracticeItem[] = [
  // Lesson 42: a manager about workload and after-hours messages.
  {
    id: 'prod-manager-workload-boundaries',
    kind: 'roleplay',
    title: 'A talk about workload and evenings',
    setting:
      'You work in the content and support team of a small online learning company. For about three weeks, tasks and questions from your manager Rhea have been arriving at 8 or 9 PM, and you have been answering them to be safe. You have also missed your own plan to study one hour a week. A product launch is on Friday. You asked Rhea for ten minutes.',
    goal: 'Agree one or two changes to your workload or after-hours expectations that you both can keep, without blaming her.',
    partner: {
      role: 'manager',
      name: 'Rhea',
      title: 'Your manager, who leads a small content and support team in a launch week',
      personality:
        'Busy, direct and well meaning. She is stretched by meetings, so she sends messages when she finally has time. She does not like vague complaints such as "I am overwhelmed", but she listens well when someone brings facts and a specific request. She gets defensive if she feels accused of being a bad manager.',
      private:
        'She sends messages at night because that is when her own day is free, and she never meant for anyone to reply that evening. She did not say so because she assumed it was obvious. She is worried the Friday launch needs more hands. She could take the weekly newsletter off your plate for two weeks, and she would be glad to agree to "no reply expected after 7 PM unless it is marked urgent", but she has not thought about it. She does not give health advice. If the learner mentions being very unwell, she says kindly that a doctor is the right person and that they can take time to see one.',
      reactions: {
        good:
          'If the learner gives two or three facts (the hours, what was missed), asks for something specific (what to move, what to expect after hours) and offers something in return, she relaxes, admits she never said replies were not needed, and agrees to a trial of a rule or to move one task. She may ask the learner to remind her if it slips.',
        poor:
          'If the learner is vague ("everything is too much") she asks what exactly she should change and gets short. If the learner blames her, she defends the launch and says everyone is working hard. If the learner agrees to everything and says nothing about the limit, she is relieved and sends another task that night.',
      },
    },
    opening: 'Hi, come in. I only have about ten minutes, the launch is eating my week. What is on your mind?',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'tone', 'professionalism', 'negotiation', 'actionability'],
    strongSigns: [
      'opens with two or three facts instead of a general feeling (for example the hours and what was missed)',
      'keeps the tone respectful and does not blame Rhea for the situation',
      'asks for a specific change, such as a task moved or a clear rule for after hours',
      'offers something in return, such as helping with the launch during working hours',
      'agrees on one or two small changes, a date to check them and what counts as urgent',
    ],
    traps: [
      'a vague "I am overwhelmed" with no facts or request',
      'blaming or accusing the manager of sending too much',
      'agreeing to everything and never saying the limit',
      'asking for a big change, such as a four-day week, instead of one or two small ones',
      'giving health details or asking the manager for health advice',
    ],
    difficulty: 'realistic',
  },

  // Lesson 41: the learner's own weekly review.
  {
    id: 'prod-weekly-review-own-words',
    kind: 'message',
    title: 'Your weekly review, in your own words',
    situation:
      'It is the end of your week. You keep a short weekly review for yourself, and you might share it with a study buddy or a manager. Write it about your real week, or about an ordinary week you remember. Use only what you can say from the week, and do not guess at anything you do not know.',
    brief: 'Write a short weekly review: what you planned and finished, what got in the way, how rested you felt, one win and one small change for next week.',
    channel: 'update',
    mustInclude: [
      'what was planned compared with what was finished, with counts or a short list',
      'one or two things that got in the way, described as facts and without blaming yourself or anyone else',
      'how rested you felt, honestly, with a number or a few words',
      'one win from the week',
      'one small change to try next week, with when you will do it',
      'a note on what one week cannot tell you',
    ],
    targetWords: { min: 90, max: 190 },
    criteria: ['clarity', 'structure', 'accountability', 'completeness', 'actionability'],
    difficulty: 'gentle',
  },

  // Lesson 43: the 30-day plan, shared with an accountability person.
  {
    id: 'prod-thirty-day-plan-note',
    kind: 'message',
    title: 'Your 30-day plan, shared honestly',
    situation:
      'You have drafted a 30-day productivity plan and want a friend or a study buddy, Noel, to check in with you. He said he would help but he is busy, so he asked you to keep it short and clear. Write the plan in your own words. It should be a plan you could keep in your worst normal week, not only in your best.',
    brief: 'Write a short message to Noel that sets out your 30-day plan: the habits you keep, one change to try, your rest, one boundary and your review dates.',
    channel: 'message',
    received: 'Happy to check in with you. Can you send me your plan in a few lines? I would like to know what to ask you about, and when.',
    mustInclude: [
      'two or three habits you already have that you will keep',
      'exactly one change you will try',
      'your rest: a stop time and a rest day or rest hours',
      'one boundary, with the words you would use',
      'review dates, such as day 7, 14, 21 and 30',
      'what you will do if you miss a week or the plan turns out too big',
    ],
    targetWords: { min: 110, max: 220 },
    criteria: ['clarity', 'completeness', 'actionability', 'structure', 'accountability'],
    difficulty: 'demanding',
  },
];
