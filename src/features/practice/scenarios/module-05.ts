import type { PracticeItem } from '../types';

/**
 * Role-play scenarios and message tasks of Module 5 (Emotional Intelligence, lessons 23 to 27 of Soft Skills for the Modern Workplace).
 * Lesson 23: eq-say-what-you-need. Lesson 24: eq-late-gift-customer. Lesson 25: eq-calm-reply-curt-review. Lesson 26: eq-credit-conversation.
 * Lesson 27: eq-clear-the-air-coteacher and eq-repair-snapped-email. Project 1 (Professional Communication Challenge) names all six.
 * Written 2026-11-17. Every person is invented; nobody here is a villain, and each conversation can go well or badly depending on the learner.
 */
export const items: PracticeItem[] = [
  {
    id: 'eq-say-what-you-need',
    kind: 'message',
    title: 'Tell your coordinator what you need',
    situation:
      'You teach Grade 5 at a small private school. Last night the exam coordinator, Ms. Reyes, moved the exams from next Wednesday to this Friday. You were already behind on checking last month\'s projects, and you feel anxious and a little resentful. You do not want to complain, but you also cannot do this well without something changing.',
    brief: 'Reply to Ms. Reyes in the teachers\' chat: say plainly how the change affects you and ask for one specific thing that would help.',
    channel: 'chat',
    received:
      'Hello everyone, quick update: the Grade 5 and 6 exams now start this Friday instead of next Wednesday. Please have your question papers printed by Thursday noon. Thank you! - Ms. Reyes',
    mustInclude: [
      'a calm acknowledgement of the change (no sarcasm, no blame)',
      'the real concern stated as a fact about time or work, not as a complaint about her',
      'one specific request that she could say yes to',
      'what you will do on your side, or what you can still deliver',
    ],
    targetWords: { min: 40, max: 90 },
    criteria: ['clarity', 'tone', 'professionalism', 'completeness', 'actionability'],
    difficulty: 'gentle',
  },
  {
    id: 'eq-late-gift-customer',
    kind: 'roleplay',
    title: 'The customer whose gift is late',
    setting:
      'You answer customer chat for a small online shop that sells handmade bags. Aileen ordered a bag as a birthday gift for her sister. It was due on Tuesday and today is Thursday. The courier\'s tracking page has said "in transit" for two days, and this is Aileen\'s third message.',
    goal: 'Help Aileen feel heard, give her an honest update, and agree on what happens next.',
    partner: {
      role: 'customer',
      name: 'Aileen',
      title: 'Customer waiting on a birthday gift order',
      personality:
        'Worried and a little curt. Writes short sentences, uses capital letters when upset, repeats her question if it was not answered. Softens quickly when she feels someone has actually read her message.',
      private:
        'She is less angry at the shop than afraid of letting her sister down: the birthday party is on Saturday. She has already read the courier\'s page, so "it is in transit" tells her nothing new. She would accept an honest update, a realistic date, and a real choice (wait, or a backup such as a refund or a faster replacement) but not a vague "soon". She does not know how the shop works behind the scenes and has no interest in the courier\'s problems.',
      reactions: {
        good:
          'If the learner names what she is going through, answers her actual question, gives only facts they really know, and offers a clear choice with a next step and a time, she relaxes, tells you about the birthday, and picks an option.',
        poor:
          'If the learner opens with policy, says "I understand" with nothing specific, blames the courier, copies a template, or promises a date they cannot guarantee, she becomes sharper, repeats that this is her third message, and asks for a refund and to speak to someone else.',
      },
    },
    opening: 'Hi. This is my third message. My order #2291 was supposed to arrive on Tuesday. It is Thursday. Where is it?',
    minTurns: 3,
    maxTurns: 8,
    criteria: ['empathy', 'listening', 'clarity', 'problem-solving', 'tone', 'actionability'],
    strongSigns: [
      'shows in the first reply that the learner read her message and heard that this is the third time',
      'reflects the feeling in specific words before moving to a fix',
      'is honest about what is known and what is not, without blaming anyone',
      'asks what she needs (the birthday date) instead of assuming',
      'offers a real choice and says exactly what will happen next and by when',
    ],
    traps: [
      'a copy-paste "We apologize for the inconvenience" with nothing specific',
      'explaining the courier\'s delays at length',
      'promising a delivery date nobody can guarantee',
      'saying "I understand" and then ignoring what she said',
      'fixing instantly without ever acknowledging how stressful this is',
    ],
    difficulty: 'gentle',
  },
  {
    id: 'eq-calm-reply-curt-review',
    kind: 'message',
    title: 'Reply to a curt review comment',
    situation:
      'You are a junior developer. You spent two days on a login page and shared it for review: a shared page where teammates comment on your work and everyone on the team can see the comments. Your lead, Aaron, left a short, sharp comment. Your face is warm and you wrote an angry draft, which you deleted. You have now taken a break and want to reply the way you would be glad to have written.',
    brief: 'Write the reply you would actually post under Aaron\'s comment, after calming down.',
    channel: 'chat',
    received: 'This doesn\'t follow our pattern. I\'ve asked twice already. Please read the guide before sending it again.',
    mustInclude: [
      'an acknowledgement of the feedback without defensiveness',
      'ownership of whatever really was a miss, without grovelling',
      'a specific question or a statement of what you will change',
      'a time by which the next version will be ready',
    ],
    targetWords: { min: 40, max: 100 },
    criteria: ['tone', 'professionalism', 'accountability', 'actionability', 'clarity'],
    difficulty: 'realistic',
  },
  {
    id: 'eq-credit-conversation',
    kind: 'roleplay',
    title: 'The colleague who took the credit',
    setting:
      'You and Dan work at a small marketing agency. Last week you spent three evenings building the competitor analysis. Yesterday, in the meeting with the director, Dan showed your charts and said, "I pulled this together." Nobody mentioned you. You asked Dan for ten minutes today.',
    goal: 'Tell Dan what happened and what it meant for you, hear his side, and agree on what will be different next time.',
    partner: {
      role: 'coworker',
      name: 'Dan',
      title: 'Marketing coordinator at the same agency',
      personality:
        'Friendly and quick with a joke. Dislikes tension and tries to smooth things over. Gets defensive and minimises if he feels accused, but he is decent underneath.',
      private:
        'The director criticised his work last month and he panicked, feeling he needed a win. He said "I" out of habit and did not plan to hide the learner\'s part; he did not stop to think how it would land. Once he sees the impact he feels embarrassed. He fears the learner will go to the director and make him look bad, and he wants to keep a good working relationship.',
      reactions: {
        good:
          'If the learner describes specific facts calmly, says what it meant for them, and asks what happened on his side, he drops the jokes, admits it, and offers to put it right (for example telling the director). He is relieved to be given a way forward.',
        poor:
          'If the learner accuses him, uses "always" or "never", is sarcastic, or threatens to report him, he gets defensive and says "it is just a slide, relax". If the learner is so vague that he does not see the problem, he agrees warmly but nothing is settled.',
      },
    },
    opening: 'Hey, you wanted ten minutes? Sure. Everything okay? You have been kind of quiet since the meeting.',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'tone', 'listening', 'actionability', 'professionalism'],
    strongSigns: [
      'opens by saying what the conversation is about, kindly and directly',
      'describes what happened in facts rather than labels such as "you stole"',
      'says what it meant for them, in their own words',
      'asks for Dan\'s side and really listens to the answer',
      'ends with a specific agreement for the future, not just a mood of "okay, fine"',
    ],
    traps: [
      'accusing words about Dan\'s character instead of what he did',
      'burying the point under small talk until it is never said',
      '"you always do this" when there is one clear example',
      'letting Dan\'s joking turn it into nothing',
      'leaving without agreeing on anything concrete',
    ],
    difficulty: 'realistic',
  },
  {
    id: 'eq-clear-the-air-coteacher',
    kind: 'roleplay',
    title: 'Clearing the air with a co-teacher',
    setting:
      'You and Joy co-teach Grade 6 science and share one lesson-planning document. At last Tuesday\'s staff meeting you said, in front of everyone, that Joy\'s slides were late "again", and you rolled your eyes. Since then Joy has answered you in one or two words and has stopped sharing her drafts. You asked to talk over lunch.',
    goal: 'Repair the working relationship: take responsibility for your part, understand how it landed, and agree on how you will work together from now on.',
    partner: {
      role: 'coworker',
      name: 'Joy',
      title: 'Grade 6 science co-teacher',
      personality:
        'Reserved and polite. Speaks quietly and does not confront. Gives short answers until she believes the other person is sincere, and then slowly says more. Dislikes being made a spectacle.',
      private:
        'She was late with her slides because she has been taking care of her father after work, which she has not told anyone. She felt humiliated more than angry, and she is worried the learner now sees her as unreliable. A quick "sorry if you were offended" will not work for her. She wants it acknowledged that it was done in front of others, and she wants problems raised with her privately next time. She will only mention her home situation, and only briefly, if she feels safe.',
      reactions: {
        good:
          'If the learner names exactly what they did, owns it without excuses, asks how it felt and listens, and proposes a specific change, she relaxes a little at a time, says more, and may mention that things have been hard at home. She agrees to a working arrangement.',
        poor:
          'If the learner gives a vague apology, explains why they were right to be annoyed, says "but", asks her to forgive and forget right away, or turns the talk to their own stress, she goes quiet, says "it is fine" in a flat voice, and ends the conversation early.',
      },
    },
    opening: 'Hi. Sure. I only have about fifteen minutes.',
    minTurns: 4,
    maxTurns: 10,
    criteria: ['accountability', 'empathy', 'listening', 'tone', 'actionability'],
    strongSigns: [
      'names the specific thing they said and did, not "what happened"',
      'owns it without "but" or an excuse',
      'recognises that doing it in front of others made it worse',
      'asks Joy how it landed and stays quiet long enough to hear it',
      'offers a concrete change, such as raising concerns privately first, and checks that it works for her',
      'does not ask for forgiveness as a condition of moving on',
    ],
    traps: [
      '"I am sorry if you were offended"',
      'an apology that quickly turns into a defence of the deadline',
      'asking about the lateness as if it were still the topic',
      'filling every silence so Joy never gets to speak',
      'promising to be perfect instead of agreeing a practical change',
    ],
    difficulty: 'demanding',
  },
  {
    id: 'eq-repair-snapped-email',
    kind: 'message',
    title: 'Repair a message you regret',
    situation:
      'You are a freelance web designer. Yesterday evening, tired, you answered your client Mrs. Tan\'s fourth round of changes with a sharp line. She replied with a single word and has not written since. This morning you want to repair it, and you still have her latest request to deal with.',
    brief: 'Write the email to Mrs. Tan that repairs the damage from your reply and gets the project moving again.',
    channel: 'email',
    received:
      'Mrs. Tan, 4:10 PM: Hi, can we make the logo a bit bigger again and go back to the first font? Thanks.\n\nYou, 7:45 PM: I already did this. Please check the earlier files before asking again.\n\nMrs. Tan, 8:02 PM: Noted.',
    mustInclude: [
      'a specific apology that names what you wrote, with no excuse and no "if you were offended"',
      'a recognition of how the message probably felt to her',
      'her actual request handled or a clear next step on it',
      'one concrete thing you will do so a mix-up over changes does not happen again',
      'no request that she reassure you or say it is fine',
    ],
    targetWords: { min: 70, max: 130 },
    criteria: ['accountability', 'empathy', 'tone', 'clarity', 'actionability', 'professionalism'],
    difficulty: 'realistic',
  },
];
