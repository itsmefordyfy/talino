import type { PracticeItem } from '../../types';

/**
 * Module 9, Time Management and Productivity (Time Management for Work, Study, and Remote Careers): two role-plays and two message tasks. Each is used
 * by exactly one activity in `courses/time-management-productivity/module-09.ts` (lessons 37 and 39). The partners are people with a believable
 * position, not villains. None is spoken aloud.
 */
export const items: PracticeItem[] = [
  // Lesson 37: a client who wants a weekly call at the learner's midnight.
  {
    id: 'prod-midnight-call-client',
    kind: 'roleplay',
    title: 'The client who wants a call at your midnight',
    setting:
      'You are a freelance admin and customer-support assistant in Manila for Grant, who runs a small online store selling climbing gear from Vancouver. Your agreement says you work 9 AM to 6 PM Manila time and reply within one working day. Grant has just asked for a weekly call at 8 AM his time, which is midnight for you.',
    goal: 'Find a way of keeping in touch with Grant that works for both of you, without simply accepting the midnight call or refusing to talk.',
    partner: {
      role: 'client',
      name: 'Grant',
      title: 'Owner of a small online store, based in Vancouver, who hired you for admin and customer support',
      personality:
        'Friendly, talkative and a little impatient with long written messages. He thinks a call is faster than typing and likes to think out loud. He is not trying to be inconsiderate: he honestly has not worked out what the time gap means for you. He relaxes when he hears a clear, concrete offer, and gets restless when he hears a long explanation.',
      private:
        'What he actually needs each week is to decide which products to restock and to feel that someone is on top of the orders, because last year a previous assistant went quiet and he lost sales. His 8 AM idea is only because his mornings are quiet. He is usually free at 4 or 5 PM his time. His 4 PM is 8 AM the next day for the learner, and his 5 PM is 9 AM the next day, which is inside the learner\'s working hours. He would also be happy with a short written summary on Mondays plus a call only when there is a decision. He is not aware that the learner is on the other side of the world at midnight, but if the learner says so plainly and politely, he will say sorry and offer to change. He has not thought about weekends. He keeps the right to be a little worried if he hears vague answers such as "we will see".',
      reactions: {
        good:
          'If the learner asks what the calls are for and then offers a specific time inside their working hours, with both time zones written clearly, plus a short written update, he agrees quickly, repeats the time to confirm and says he feels much better knowing what is happening. He may even offer to move the call to suit the learner better.',
        poor:
          'If the learner just says yes to midnight, he says great and the next week starts adding other late requests. If the learner says "no, that is impossible" with no alternative, he sounds hurt and says maybe he should hire someone in his own time zone. If the learner offers "some time next week" with no time or zone, he asks "when exactly?" and stays unsure.',
      },
    },
    opening: "Hi! Great work last week. I'd love to start a weekly call, Mondays at 8 AM my time, to go over everything. That works for you, right?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['negotiation', 'clarity', 'tone', 'listening', 'actionability', 'professionalism'],
    strongSigns: [
      'asks what the calls are for before deciding anything',
      'says plainly and kindly that 8 AM his time is midnight for them, without blaming him',
      'offers a real alternative inside their working hours, with both time zones stated',
      'offers a written update so he feels informed between calls',
      'confirms the agreed time and the format at the end',
    ],
    traps: [
      'agreeing to midnight to avoid an awkward conversation',
      'refusing with no alternative',
      'a vague "some time next week" with no time or time zone',
      'a long explanation of their own life that makes the call about them',
    ],
    difficulty: 'realistic',
  },

  // Lesson 37: a project manager and a client whose deadlines conflict.
  {
    id: 'prod-two-deadlines-conflict',
    kind: 'roleplay',
    title: 'Two deadlines on the same Thursday',
    setting:
      'You are a freelance graphic designer who works for an agency. On Monday, Rhea, the agency\'s project manager, asked you for a social media pack for the agency\'s client Corbin and Co by Thursday at 5 PM. This morning a school you once worked for emailed you directly and asked for an open-day flyer by Thursday at noon. You have about 12 hours of design time before Thursday, and each job needs about 9. You are talking to Rhea.',
    goal: 'Agree with Rhea which deadline to protect and what happens to the other one, before you do any more work.',
    partner: {
      role: 'stakeholder',
      name: 'Rhea',
      title: 'Project manager at the design agency, responsible for the agency\'s client work',
      personality:
        'Organised, busy and direct. She dislikes surprises and likes people who arrive with facts and a couple of options. She can be a little sharp when she feels a freelancer has taken work around her, but she calms down quickly when someone is open and wants to solve the problem.',
      private:
        'The Corbin and Co pack can move to Friday at 10 AM, because their launch is on Monday, but she has not told the client yet and wants to be asked, not told. The school flyer is for an open day on Saturday and must go to the printer by Thursday at noon. The school is a past client of the agency too, so she wants it handled well. She does not like that the school wrote directly to the learner, but she will not make a big thing of it if the learner is straightforward. She has another designer, Jun, who has about two free hours on Wednesday and is good at layouts but weaker at illustration. She would prefer to hear that the learner has already noticed the conflict and thought about it.',
      reactions: {
        good:
          'If the learner states the clash with the dates and the hours, mentions the direct request openly, and brings two options (for example, which job could move, or whether Jun could help with part of one), she becomes practical: she chooses, may ask Corbin about Friday, and asks the learner for a short update on Wednesday. She thanks the learner for raising it early.',
        poor:
          'If the learner decides alone to do the flyer and says nothing about the pack, she says "you cannot choose that without me" and the tone becomes cold. If the learner only complains that there is too much work, she says "I need to know what you can do". If the learner promises both on time, she says great and later asks again on Wednesday whether it is on track, with clear doubt.',
      },
    },
    opening: 'Hi, I saw your note that you wanted to talk. Is the Corbin pack on track for Thursday at five?',
    minTurns: 3,
    maxTurns: 9,
    criteria: ['clarity', 'problem-solving', 'negotiation', 'professionalism', 'accountability', 'actionability'],
    strongSigns: [
      'states the clash early with dates and hours, so Rhea can see it is real',
      'mentions the school request openly and does not hide that it came directly',
      'brings two options with their costs instead of only a problem',
      'asks Rhea to decide and respects her answer',
      'agrees what happens next and when they will check in',
    ],
    traps: [
      'deciding alone which job to protect',
      'promising to deliver both on time without a plan',
      'complaining about the workload with no option',
      'hiding the direct request from the school or blaming the school',
    ],
    difficulty: 'realistic',
  },

  // Lesson 37: moving a deadline when the client's files arrived late.
  {
    id: 'prod-late-files-new-date',
    kind: 'message',
    title: 'The files arrived late, so the date moves',
    situation:
      'You are a freelance video editor. You agreed to deliver an eight-minute travel video to Tomas by Friday, 5 PM his time (he is in London, 8 hours behind you). He promised the raw footage by Monday, but it arrived on Wednesday evening. The edit needs about 10 hours of work, and you have about 6 hours free before Friday. Tomas has written to remind you of Friday. You could deliver the full video on Tuesday, 12 noon his time, or a shorter five-minute version on Friday.',
    brief: 'Reply to Tomas: explain the new situation as a fact, give a real new date with the time and time zone, offer the shorter option, and ask him to choose.',
    channel: 'email',
    received:
      'Hi! Thanks for working on this. I know the footage was a bit late, sorry about that, but my sponsor is waiting, so please still send the final cut on Friday as agreed. Thanks so much!',
    mustInclude: [
      'a plain statement of the cause with dates: the footage arrived on Wednesday evening, two days after Monday',
      'the real new date for the full video, with a day, a time and a time zone',
      'the shorter version as an option that can still be ready on Friday',
      'a clear question asking Tomas to choose by a stated time',
      'a calm, warm tone with no blame and no long apology',
    ],
    targetWords: { min: 90, max: 170 },
    criteria: ['clarity', 'tone', 'professionalism', 'completeness', 'actionability', 'accountability'],
    difficulty: 'realistic',
  },

  // Lesson 39: the weekly update that explains the decisions of an interrupted week.
  {
    id: 'prod-explain-week-decisions',
    kind: 'message',
    title: 'Explain the week to Ben',
    situation:
      'You are a freelance writer and assistant for Ben, who runs an online shop. This week had an interruption: on Wednesday at 1:30 PM Ben called about a mistake in his launch email, and you spent an hour helping him. What happened in your work for Ben: you delivered his newsletter on Wednesday, before its 3:30 PM deadline. The edits to his product descriptions, planned for Thursday morning, moved to Friday 9 AM because of the call. A nice-to-have list of photo captions was postponed to next week. Scheduling his weekly social posts was handed to his teammate Lia, who agreed to do it this week. For next week, you need his product photos by Monday evening so you can finish the category page text by Tuesday.',
    brief: 'Write Ben a short end-of-week update: what you delivered, what moved and why, what was postponed or handed over, and what you need from him next.',
    channel: 'update',
    mustInclude: [
      'what was delivered, with the day: the newsletter on Wednesday',
      'what moved, why and the new time: the product description edits moved to Friday 9 AM because of the one-hour urgent call',
      'what was postponed or handed over: the captions to next week, the social posts to Lia',
      'what you need from Ben next, with a date: the photos by Monday evening',
      "next week's top priority and its date: the category page text by Tuesday",
    ],
    targetWords: { min: 90, max: 170 },
    criteria: ['clarity', 'structure', 'completeness', 'actionability', 'tone', 'accountability'],
    difficulty: 'gentle',
  },
];
