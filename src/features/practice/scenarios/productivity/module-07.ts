import type { PracticeItem } from '../../types';

/** Module 7 (Productivity Tools and Digital Organization): one message task, used by lesson 29 (Managing Email and Communication). */
export const items: PracticeItem[] = [
  {
    id: 'prod-short-reply-venue',
    kind: 'message',
    title: 'Is the venue booked?',
    situation:
      'You are a project assistant at a small training company. Your manager, Mr. Dela Cruz, sent a long email at 6 PM about the workshop on the 12th, and the one question you must answer sits in the middle of it. Yesterday the venue told you by phone that the hall is booked for the 12th, but their written confirmation has not arrived yet. The participant list stands at 24 confirmed names, and 3 more people have said they are probably coming.',
    brief: 'Reply to Mr. Dela Cruz with the answer in the first line, what is confirmed and what is not, and what you will do next and by when.',
    channel: 'email',
    received:
      'Hello, I hope your week is going well. I have been thinking about the workshop and I am a bit worried about a few things, like the snacks and whether we need a second projector. Anyway, the main thing I need before tomorrow morning: is the venue booked for the 12th, and how many people are coming? I need the numbers for the budget. Thanks.',
    mustInclude: [
      'the answer to the venue question in the first line or two',
      'what is confirmed (the venue told you by phone) and what is not yet (the written confirmation)',
      'the numbers: 24 confirmed and 3 probable',
      'a next step with a day and time, such as when you will send the written confirmation',
      'no long warm-up and no unrelated topics',
    ],
    targetWords: { min: 55, max: 120 },
    criteria: ['clarity', 'structure', 'actionability', 'professionalism', 'tone'],
    difficulty: 'gentle',
  },
];
