import type { PracticeItem } from '../../types';

/**
 * Module 8, Time Management and Productivity (Productivity with AI and Automation): three message tasks the learner writes in their own words and
 * the message coach reviews. Each is used by exactly one activity in `courses/time-management-productivity/module-08.ts`
 * (lessons 33 and 35). The tasks are about turning rough material into clear, honest, accountable writing; the learner may use an AI assistant to
 * check their draft, but what the coach reads is the learner's own message.
 */
export const items: PracticeItem[] = [
  // Lesson 33: rough meeting notes become action items.
  {
    id: 'prod-meeting-notes-actions',
    kind: 'message',
    title: 'Rough meeting notes to action items',
    situation:
      'You teach Grade 8 science and took the notes at a short planning meeting for the school science fair. The other teachers have gone home and each of them thinks someone else will follow up. You will send the group one clear note with the decisions and the action items, so nothing is left to memory.',
    brief: 'Write the follow-up note to the group: the decisions in a line or two, then each action item with an owner, the task and a date, writing "not stated" wherever the notes do not say.',
    channel: 'update',
    received:
      'Your rough notes from the meeting:\n\nScience fair planning, Tuesday after classes. Present: Ms Reyes, Mr Santos, Ms Tan, me (note-taker).\n- Fair date agreed: March 14.\n- Venue: gym or quad? Mr Santos will ask the principal. No date for the answer.\n- Judges: Ms Tan already asked 2 (a nurse and a civil engineer). Need 1 more. Nobody volunteered.\n- Student sign-up sheet: I will put it on the board by next Monday.\n- Ms Reyes will "look into" tables, maybe borrow from the canteen.\n- Budget: P3,000. Ms Reyes keeps it. Nothing is bought before she says yes.\n- Certificates: print before March 10? Not clear who.\n- Parents helping with setup: talked about it, nothing decided.',
    mustInclude: [
      'the decisions that were agreed: the fair date and the budget rule (nothing bought before Ms Reyes says yes)',
      'each action that has a named owner as its own item: Mr Santos asks the principal about the venue, the note-taker posts the sign-up sheet by next Monday, Ms Reyes looks into tables',
      '"not stated" or an open question where an owner or a date is missing: the third judge, the certificates, the date of the principal\'s answer, parents helping with setup',
      'nothing invented: no owner, date or promise that the notes do not give',
      'a short closing line that asks the others to correct anything they remember differently',
    ],
    targetWords: { min: 110, max: 200 },
    criteria: ['clarity', 'completeness', 'actionability', 'accountability', 'integrity'],
    difficulty: 'gentle',
  },

  // Lesson 33: an email with five asks becomes a task list and a reply that confirms scope.
  {
    id: 'prod-email-request-to-tasks',
    kind: 'message',
    title: 'Five asks in one email',
    situation:
      'You are a freelance designer. You give Hannah, who owns two cafes, about 8 hours a week, and there are three weeks before she wants to see everything, so you have about 24 hours for her. Your own rough estimates: menu 8 hours, eight Instagram posts 6 hours, website update 2 hours, logo refresh 12 hours, window poster 3 hours. You will make a task list for yourself and reply so that Hannah knows exactly what she will get.',
    brief: 'Write a short task list with an hour estimate for each ask, then a reply to Hannah that confirms what you will do by the 15th, what does not fit and what you can offer instead, what you need from her and by when, and asks her to say yes before you start.',
    channel: 'email',
    received:
      'Hi! Exciting news, we are opening our second cafe on the 20th of next month!! Can you please: 1) design the new menu (A4, both sides), 2) make 8 Instagram posts for the countdown, 3) update the website with the new address and opening hours, 4) a new logo, the old one looks tired, and 5) a poster for the window? I would love to see everything before the 15th so I can print in time. Thank you so much!!',
    mustInclude: [
      'the five asks listed separately, each with an hour estimate',
      'a clear comparison of the total hours against the 24 you have, showing that not everything fits',
      'what is included by the 15th, and which item is not (for example the logo refresh), with a real option such as a later date or a separate quote',
      'what you need from Hannah and by when, such as the menu text and prices, photos, the new address and the opening hours',
      'a request that she confirms the scope before you start, without a flat yes to everything',
    ],
    targetWords: { min: 150, max: 260 },
    criteria: ['clarity', 'completeness', 'negotiation', 'actionability', 'professionalism'],
    difficulty: 'demanding',
  },

  // Lesson 35: a weekly progress report from a list of what was done.
  {
    id: 'prod-weekly-progress-report',
    kind: 'message',
    title: 'The Friday progress report',
    situation:
      'You are a junior developer on a small team building a booking app, and every Friday you send your team lead, Joel, a short progress update. Below is your own list for the week. Some things are finished, one is not, and you are waiting on something from the design side.',
    brief: 'Write the Friday update to Joel: what you finished, what you did not finish and why, what is blocking you and what you need from him, and your plan for next week.',
    channel: 'update',
    received:
      'Your list for the week:\n\nPlanned: finish the dashboard filter, fix the login bug, write tests for the payment form.\n- Monday: started the dashboard filter. Team meeting (1 hour).\n- Tuesday: fixed the login bug (tested on two browsers). Reviewed two teammates\' pull requests.\n- Wednesday: wrote tests for the payment form (12 tests, all pass). Asked design for the empty-state screens of the filter.\n- Thursday: dashboard filter about 60 percent done. The empty-state designs still have not arrived. Half day off, agreed with Joel in advance.\n- Friday: cleaned up the filter code. Started the export button (about 1 hour; it was not planned).\n- Not done: the filter is not finished.\n- Need: the empty-state designs, or a decision to use a plain message instead.',
    mustInclude: [
      'what was finished: the login bug and the payment form tests (12, passing)',
      'what was not finished, said plainly with the reason: the dashboard filter, about 60 percent, waiting for the empty-state designs',
      'the blocker as a specific ask: the designs, or a decision to use a plain message, with a day',
      'the export button described honestly as a small unplanned start, not as finished work',
      'a plan for next week that follows from the list, with no results or numbers that the list does not give',
    ],
    targetWords: { min: 110, max: 200 },
    criteria: ['clarity', 'completeness', 'accountability', 'structure', 'professionalism'],
    difficulty: 'realistic',
  },
];
