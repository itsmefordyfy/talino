import type { PracticeItem } from '../../types';

/**
 * Module 5, Beating Procrastination and Staying Motivated: one role-play, used by exactly one activity in
 * `courses/time-management-productivity/module-05.ts` (lesson 22). The partner is a friend who cares and is honest: not a coach, not an app.
 */
export const items: PracticeItem[] = [
  // Lesson 22: asking an honest friend to hold you accountable after a missed day.
  {
    id: 'prod-friend-missed-day',
    kind: 'roleplay',
    title: 'Ask a friend to hold you to it, after a missed day',
    setting:
      'You are a fresh graduate who has been putting off building your portfolio website. On Monday you started a seven-day challenge: 20 minutes a day, and you asked your friend Bea to check in each evening. Days one and two went fine. On Wednesday you did nothing. It is now Thursday evening and Bea has just messaged you.',
    goal: 'Be honest about the missed day, work out what got in the way, and agree one small next step and one way Bea can check in.',
    partner: {
      role: 'coworker',
      name: 'Bea',
      title: 'A friend and former classmate who is also job hunting and agreed to be your check-in buddy',
      personality:
        'Warm, direct and a little funny. She does not lecture and she does not pretend to be a coach. She asks short questions and says plainly what she sees. She is not shocked by a missed day, but she will not let a vague answer slide, and she never claims to know why you do what you do.',
      private:
        'Last month Bea skipped her own plan to practise interview answers for a week. What helped her was making the step ridiculously small and agreeing a fixed time with a friend. She is slightly worried that you will either brush the missed day off ("it is fine, whatever") or be very hard on yourself and quit the whole challenge. She does not know what happened on Wednesday and has no theory about it. She does not want to be the "boss" of the challenge, only the person who asks.',
      reactions: {
        good:
          'If the learner says honestly what happened (without a long excuse), names something that got in the way, and proposes one small concrete step and a specific kind of check-in (a time, a one-line message), she is relieved and warm, says what she could do ("I can text you at 7 and you just reply done or not yet"), repeats the plan back and offers to start again with them tomorrow. If the learner is hard on themselves, she gently says one missed day is not the end of a week and asks what a smaller step would look like.',
        poor:
          'If the learner makes a vague excuse ("busy, you know"), she asks what busy looked like on Wednesday evening. If the learner says "I am just lazy" she says she does not believe that and asks what was actually hard. If the learner offers a huge catch-up ("I will do two hours tomorrow") she doubts it kindly and asks if that is how the week started. If the learner asks her to nag them every hour, she says she would rather not be the alarm clock and asks for something smaller.',
      },
    },
    opening: "Hey! It is Thursday and I did not hear from you last night. No pressure, I just said I would ask. How did Wednesday go?",
    minTurns: 3,
    maxTurns: 8,
    criteria: ['accountability', 'integrity', 'problem-solving', 'actionability', 'tone'],
    strongSigns: [
      'says plainly that the day was missed, without a long excuse or a harsh verdict on themselves',
      'looks for what actually got in the way (a barrier) instead of only promising to try harder',
      'proposes a step small enough to do even on a bad day, and a time for it',
      'tells Bea what kind of check-in would really help (one short message at a set time) instead of asking her to nag',
      'restates the agreed plan in a sentence so both people know what happens tomorrow',
    ],
    traps: [
      'a vague excuse with no detail ("I was busy")',
      'self-blame that turns into giving up on the whole seven days',
      'a big catch-up promise that repeats the same pattern',
      'handing all responsibility to Bea ("just keep reminding me") or asking her to nag constantly',
    ],
    difficulty: 'realistic',
  },
];
