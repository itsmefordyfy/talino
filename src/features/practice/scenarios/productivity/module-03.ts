import type { PracticeItem } from '../../types';

/**
 * Time Management and Productivity, module 3 (Prioritization and Decision Making): one message task and one role-play. Each is used by exactly
 * one activity in `courses/time-management-productivity/module-03.ts` (lessons 11 and 12). The partners are people with a believable position.
 */
export const items: PracticeItem[] = [
  // Lesson 11: declining and handing off a favour from a senior colleague, with an alternative.
  {
    id: 'prod-decline-senior-favour',
    kind: 'message',
    title: 'A favour from a senior colleague',
    situation:
      'You are a junior designer at a small marketing agency. Ms. Alvarez, a senior designer you respect, asks you to reformat her 30-slide client deck by 9 AM tomorrow. You have your own client file due at noon tomorrow and you will be working until about 8 PM tonight. Mr. Ramos, the intern, has used the slide template before and has some free time, but you have not asked him.',
    brief: 'Reply to Ms. Alvarez: say kindly that you cannot do the whole job by 9 AM, give the reason in one sentence and offer at least one real alternative.',
    channel: 'chat',
    received:
      'Hi! Are you free tonight? The client deck for tomorrow needs to be put into the new template, about 30 slides. I would like it in my inbox by 9 AM. You are so fast at this, thank you in advance!',
    mustInclude: [
      'a clear statement that the whole deck by 9 AM is not possible, with no "I will try"',
      'one short, honest reason (your own deadline), without a long apology',
      'at least one real alternative, such as doing the first slides, sharing the template steps or a later time',
      'a suggestion to ask the intern that does not promise his time for him',
      'thanks that keeps the relationship warm, and a clear question or next step for her to choose',
    ],
    targetWords: { min: 70, max: 140 },
    criteria: ['clarity', 'tone', 'professionalism', 'completeness', 'actionability', 'collaboration'],
    difficulty: 'realistic',
  },

  // Lesson 12: delegating a task to a helper who is willing but unsure.
  {
    id: 'prod-hand-off-stock-count',
    kind: 'roleplay',
    title: 'Hand over the stock count',
    setting:
      'You run a small print shop. This week you have a rush wedding order, a supplier payment and an evening class, so you cannot do the monthly paper stock count yourself. Joel, your part-time helper, is in the shop on Tuesday afternoon. The count must be in your hands by Thursday noon so you can reorder before the supplier closes its order list.',
    goal: 'Hand the stock count to Joel clearly enough that he knows what to do, by when, and where to ask for help, and that he agrees to it.',
    partner: {
      role: 'coworker',
      name: 'Joel',
      title: 'Part-time helper at the print shop, 20 years old, studies in the mornings',
      personality:
        'Polite, eager to please and quiet. He says "okay, sure" quickly even when he is not sure. He has never done a full stock count, and he warms up when someone explains what a good result looks like and says it is fine to ask.',
      private:
        'He is unsure how to count partly used paper reams and does not know whether to count damaged sheets, but he is afraid of looking slow, so he will not volunteer this unless asked what could be hard. His classes end at 11:30 AM, so Thursday morning is tight; he could finish by Wednesday evening if he knew about it now. He would like some trust and does not want to be watched all day.',
      reactions: {
        good:
          'If the learner explains the result they need (a list by paper type and size), the deadline, and asks what might be unclear, he admits the two questions about partial reams and damaged paper, says when he can do it, and agrees to a short check-in. He thanks them for trusting him with it.',
        poor:
          'If the learner only says "please do the count" with no result, deadline or help, he says "okay, sure" and later guesses. If the learner takes the task back after one hesitation ("never mind, I will do it"), he apologises and feels untrusted. If the learner hovers and wants updates every hour, he goes quiet and stops asking questions.',
      },
    },
    opening: 'Good afternoon! You wanted to talk to me? Is something wrong with the machines?',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['clarity', 'actionability', 'listening', 'tone', 'collaboration'],
    strongSigns: [
      'says what the finished result looks like (what list, in what form) and not only the task name',
      'gives a real deadline and checks that it works for Joel, with a reason for the date',
      'asks what could be hard and listens to the answer instead of assuming',
      'gives the help he needs, such as an example of how to treat partial reams, and says where to ask',
      'agrees a short check-in and then lets him work, with a warm thanks',
    ],
    traps: [
      'a vague "please count the stock" with no result or date',
      'accepting "okay, sure" as proof that he understands',
      'taking the task back at the first sign of hesitation',
      'asking for hourly updates, which signals no trust',
      'a long speech about how busy the week is, which makes it about the learner',
    ],
    difficulty: 'realistic',
  },
];
