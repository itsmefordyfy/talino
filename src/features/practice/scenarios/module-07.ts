import type { PracticeItem } from '../types';

/** Module 7, Adaptability and Growth Mindset: a late change, blunt feedback from a manager, and two short written replies. */
export const items: PracticeItem[] = [
  {
    id: 'adapt-moved-session',
    kind: 'roleplay',
    title: 'The session that moved overnight',
    setting:
      'You teach a small Saturday maths group (12 pupils, grade 5) at a tutoring centre, part time. It is Friday, 7 PM, and your worksheets are already printed. Nadia, the centre coordinator, calls you: a school group is visiting tomorrow, so your session moves from 10 AM to 8 AM, pupils from another class will join, and the projector is booked for the visitors.',
    goal: 'Agree with Nadia what tomorrow can realistically cover, and finish the call knowing what you will do tonight.',
    partner: {
      role: 'manager',
      name: 'Nadia',
      title: 'Coordinator of a tutoring centre where you teach part time',
      personality:
        'Warm but rushed. She has been on the phone all evening. She speaks in short sentences, dislikes long complaints, and relaxes quickly when someone gives her one clear plan.',
      private:
        'The time cannot move: parents were already told 8 AM. She feels bad about the late change and the director is watching how it goes. She could offer an older student volunteer as an assistant and extra printing at 7:30 AM, but she will only mention them if the learner asks what help or resources exist. She only has a list of the new pupils\' names, not their level, and would welcome a simple way to find out where they are. She cannot give more than the 8 AM slot.',
      reactions: {
        good:
          'If the learner stays calm, repeats what has changed, asks specific questions (how many pupils, who can help, what is available, what the new pupils already know) and offers a concrete adjusted plan for tomorrow, Nadia relaxes, offers the volunteer and the printing, and thanks them for making it easy.',
        poor:
          'If the learner is vague ("I will try", "it should be fine"), complains about the short notice, blames the centre, or promises to deliver the original lesson unchanged to twenty pupils, Nadia becomes tense, repeats the constraints and asks "so is that a yes or a no?". If the learner only refuses without options, she says she will have to find someone else for the slot.',
      },
    },
    opening:
      "Hi, thanks for picking up. I'm sorry about the hour, I know it's late. A school group is visiting tomorrow, so Saturday's session has to move to 8 AM, and we're combining classes, so it will be about twenty pupils instead of twelve. The projector is taken too. Can you still do it?",
    minTurns: 4,
    maxTurns: 9,
    criteria: ['adaptability', 'problem-solving', 'clarity', 'collaboration', 'actionability'],
    strongSigns: [
      'Stays calm and does not argue about the short notice',
      'Checks the facts that matter (how many pupils, who will help, what materials exist) before promising anything',
      'Separates what is fixed (the time, the room, no projector) from what can change (the lesson plan, the groups, the materials)',
      'Offers a smaller, adjusted plan rather than a flat yes or a flat no',
      'States clearly what they will do tonight and what they need from Nadia',
    ],
    traps: [
      'Saying yes to everything without thinking about twenty pupils and no projector',
      'Spending the call complaining about the late notice',
      'Giving a flat no with no alternative',
      'Staying vague: "I will do my best" with no actual plan',
      'Asking Nadia to solve the problem for them instead of proposing something',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'adapt-blunt-itinerary-feedback',
    kind: 'roleplay',
    title: 'Blunt feedback on your itineraries',
    setting:
      'You are a virtual assistant on a three-month contract with a small online travel agency. You prepare trip itineraries for clients abroad. Beth, the operations manager, asked for a ten-minute call after checking your last four itineraries. A family travelling to Japan almost missed an entry-document step because it was not in the itinerary you sent.',
    goal: 'Understand exactly what Beth wants changed, show that you have taken it in, and agree what you will do differently.',
    partner: {
      role: 'manager',
      name: 'Beth',
      title: 'Operations manager of a small online travel agency, and your supervisor',
      personality:
        'Fair but blunt. Has little time, says the hard thing in the first sentence, and does not soften it. Does not like excuses, but respects a person who asks a good question. Never insults anyone.',
      private:
        'She likes the learner\'s speed and friendliness and wants to keep them for the next contract. The owner has complained about the Japan itinerary, so she is under pressure. The real gap is that there is no checklist or template, and she has been meaning to write one, but she will only say so if the learner asks what a good itinerary looks like or asks for an example. She believes the three problems are fixable. She will not accept a vague promise to be more careful.',
      reactions: {
        good:
          'If the learner listens without interrupting, asks which itineraries and what a correct one should contain, repeats the problems in their own words, owns their part, and proposes a concrete fix with a date (for example a checklist they will use and a check before sending), Beth softens, admits the missing template, and agrees on what happens next.',
        poor:
          'If the learner makes excuses, blames unclear instructions, apologises over and over, argues about whether the problem is serious, or promises only "I will be more careful", Beth becomes shorter and colder, repeats the three problems and says she needs something she can rely on.',
      },
    },
    opening:
      "I'll be direct because I only have ten minutes. Of your last four itineraries, three had problems. The Japan one had no entry-requirements note, two had hotel times that didn't match the confirmations, and the layout was different every time. That family nearly had a real problem at the airport. What happened?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['listening', 'accountability', 'adaptability', 'professionalism', 'actionability', 'clarity'],
    strongSigns: [
      'Listens to the whole message before answering and does not interrupt or defend at once',
      'Asks for specific examples and what a correct itinerary should include',
      'Repeats the feedback in their own words to check they understood',
      'Owns their part in one plain sentence, without excuses and without over-apologising',
      'Proposes a concrete change with a time (a checklist, a final check before sending) and asks Beth how she will know it worked',
    ],
    traps: [
      'Explaining or defending first ("the instructions were unclear")',
      'Apologising many times instead of dealing with the problem',
      'Promising "I will be more careful" with no actual change',
      'Treating the feedback as an attack on them as a person',
      'Arguing that three out of four is not so bad',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'adapt-ask-feedback-after-setback',
    kind: 'message',
    title: 'Ask for feedback after a setback',
    situation:
      'You are changing careers and doing freelance web work. Your first proposal went to a small dental clinic, and they politely chose someone else. Joy, a freelancer with more experience, offered earlier to look at your proposal.',
    brief: 'Reply to Joy and ask for feedback in a way that is specific and easy for her to give.',
    channel: 'chat',
    received:
      'Hi! I heard the clinic project went another way. Sorry about that, it stings but it is very normal on a first proposal. Happy to look at it if you want.',
    mustInclude: [
      'a short thank you without grovelling',
      'what happened, in one factual sentence',
      'what you already think you could improve (your own view first)',
      'one or two specific questions for Joy',
      'a small, clear ask with a limit (for example 15 minutes, or comments on the document) and an offer to send the proposal',
    ],
    targetWords: { min: 40, max: 110 },
    criteria: ['clarity', 'tone', 'actionability', 'completeness', 'professionalism'],
    difficulty: 'gentle',
  },
  {
    id: 'adapt-reply-to-review-comments',
    kind: 'message',
    title: 'Reply to a blunt code review',
    situation:
      'You are a junior developer on a small team building a shop checkout. Isa, the tech lead, left a direct comment on your pull request (a set of code changes you ask the team to review). You think the large pull request was easier to understand as one piece, but you know the feedback is about the team\'s review time, not about you.',
    brief: 'Reply to Isa. Show you understood the feedback and say exactly what you will change and when.',
    channel: 'chat',
    received:
      'I went through your PR. It is about 900 lines, which is too big to review properly in one go, and there are no tests for the failed-payment path. Please split it into smaller PRs and add that test before I look again. This is the second time the PRs have been this big.',
    mustInclude: [
      'a plain acknowledgement that names the two specific points (size and missing test), with no excuse',
      'what you will do (how you will split it, and the failed-payment test)',
      'when you will have it ready',
      'one clarifying question (for example what size or order Isa prefers)',
    ],
    targetWords: { min: 45, max: 110 },
    criteria: ['accountability', 'tone', 'clarity', 'actionability', 'professionalism', 'listening'],
    difficulty: 'realistic',
  },
];
