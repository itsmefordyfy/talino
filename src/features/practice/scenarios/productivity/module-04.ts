import type { PracticeItem } from '../../types';

/**
 * Module 4, Time Management and Productivity course (lessons 13 to 17): one role-play, used by exactly one activity in
 * `courses/time-management-productivity/module-04.ts` (lesson 16). The partner is a person with a believable position, not a villain.
 */
export const items: PracticeItem[] = [
  {
    id: 'prod-focus-block-quick-questions',
    kind: 'roleplay',
    title: 'Quick questions during your focus block',
    setting:
      'You work in a small software team. You planned 9:30 to 11:30 as a focus block to finish a feature that goes to review at 1 PM today, and you told the team in the chat. It is 10:05, and Rico, who joined the team three weeks ago, has come to your desk with "a quick question" for the third time this morning.',
    goal: 'Protect your focus block without shutting Rico out, and agree a way of working that helps him get unstuck without interrupting you each time.',
    partner: {
      role: 'coworker',
      name: 'Rico',
      title: 'Developer who joined the team three weeks ago',
      personality:
        'Polite, a little anxious and quick to apologise. He asks in short bursts and starts most sentences with "quick question". He wants to look capable, so he does not admit how often he is stuck. He listens well when someone is kind and specific, and he hears a vague "later" as a polite no.',
      private:
        'He is still learning an unfamiliar codebase. His lead told him to ask rather than lose hours, and he has a first demo on Thursday, so he is afraid of looking slow. He does not realise that three small questions cost you more than three minutes. Most of his questions have answers in the team notes, but he finds the notes hard to search. He keeps his own list of questions in a file that he has never shared. One question today really blocks him: the test environment rejects his login, and he cannot test his work until it is fixed. He would happily use a short daily slot or a shared list of questions if someone offered it.',
      reactions: {
        good:
          'If the learner asks what he is stuck on and what he has tried, finds out which question is really blocking, gives a quick pointer for that one or a specific time soon, and offers a regular slot or a shared place for questions, he relaxes, thanks them, shares his list, and agrees to bring the rest at the agreed time. He may admit the notes are hard to search.',
        poor:
          'If the learner says a flat "I am busy" with nothing else, he apologises several times, says "sorry, never mind" and quietly keeps the login problem to himself. If the learner drops everything and answers all his questions at once, he adds two more. If the learner says "later" or "after lunch" with no time, he asks "what time?" and stays near the desk.',
      },
    },
    opening: "Hi, sorry! Quick question again. Where is the config for the test environment? I looked, but I can't find it, and my login isn't working.",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['listening', 'tone', 'actionability', 'collaboration', 'clarity'],
    strongSigns: [
      'asks what Rico has tried and what exactly blocks him before deciding how much time to give',
      'separates the one truly blocking question from the others, and helps with that one quickly',
      'protects the rest of the focus block by naming a specific time, not "later"',
      'offers something that lasts, such as a daily question slot or a shared list or notes page',
      'keeps the tone warm and short, without a long apology or a lecture about focus',
    ],
    traps: [
      'a flat "I am busy" that leaves Rico feeling like a nuisance and his real blocker unsolved',
      'dropping everything and answering every question now, which gives up the block',
      'a vague "later" or "maybe after lunch" with no time',
      'explaining at length how much Rico is disrupting their own work',
      'solving the problem for him each time instead of helping him find answers himself',
    ],
    difficulty: 'realistic',
  },
];
