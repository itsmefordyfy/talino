import type { PracticeItem } from '../types';

/**
 * Module 6, Presentation and Public Speaking (days 28 to 32). Two message tasks (a spoken status update written as a script, and a slide
 * outline) and three role-plays (two of them `speaking`: an introduction and audience questions after a short pitch). The app reviews the
 * learner's words only, never voice, pace or body language.
 */
export const items: PracticeItem[] = [
  {
    id: 'speak-status-update-script',
    kind: 'message',
    title: 'Script a two-minute status update',
    situation:
      "You are building an online ordering page for Ruth Dizon's small catering business. You are on a short call with her tomorrow. The menu, the cart and the payment page are finished and tested. The page still has no food photos, because Ruth has not sent them. The launch is planned for December 5, and each day without photos pushes it back by about a day.",
    brief: 'Write the script you would say aloud on the call: where things stand, what is blocked, what you need from Ruth and by when.',
    channel: 'update',
    received:
      "Hi! Can you give me a quick update on tomorrow's call? I'm not technical, I just want to know if we are still launching on Dec 5. Thank you!",
    mustInclude: [
      'the answer to her question first (launch date safe or at risk, and on what condition)',
      'what is finished, in words she understands',
      'what is not finished and the reason',
      'the one thing needed from her, with a date',
      'what happens to the launch date if it is late',
    ],
    targetWords: { min: 110, max: 230 },
    criteria: ['structure', 'clarity', 'relevance', 'actionability', 'completeness', 'tone'],
    difficulty: 'realistic',
  },
  {
    id: 'speak-slide-outline',
    kind: 'message',
    title: 'Outline a short talk with its slides',
    situation:
      "Joel Navarro teaches Grade 5. At the parents' meeting next week he has five minutes to explain why he wants to send a short weekly progress note by message instead of a paper slip. Some parents are busy, a few do not use their phones much, and he is worried the talk will turn into a long speech.",
    brief:
      'Write the outline for the talk: the main message in one sentence, the title of each slide, what each slide shows, and what parents are asked to do at the end.',
    channel: 'message',
    mustInclude: [
      'the main message in one sentence',
      'slide titles that state a point, not just a topic',
      'one thing each slide shows (a picture, a number or a short example)',
      'what parents are asked to do or decide',
      'a plan for a part that might go wrong (a projector or a parent who cannot use the app)',
    ],
    targetWords: { min: 120, max: 260 },
    criteria: ['structure', 'clarity', 'relevance', 'completeness', 'actionability'],
    difficulty: 'realistic',
  },
  {
    id: 'speak-introduce-yourself',
    kind: 'roleplay',
    title: 'Introduce yourself on a kickoff call',
    setting:
      "You are a freelancer who has just been hired to look after the booking page of a small travel company. This is the first team call. The project lead, Carla, asks everyone to introduce themselves in under a minute, and you are next. Answer as if you are speaking out loud.",
    goal: 'Introduce yourself so the team knows who you are, what you will do for them, and one thing worth remembering about you.',
    partner: {
      role: 'team-leader',
      name: 'Carla',
      title: 'Project lead at a small travel company, running the kickoff call',
      personality:
        'friendly, a little rushed, runs the call to time. Remembers people by what they do for her, not by their job title. Asks one easy follow-up if the introduction gives her something to ask about.',
      private:
        'She needs to know quickly who will answer when the booking page breaks. She has worked with a contractor who stayed silent for weeks and she is a little wary of that. She would like to remember one concrete thing about the new person. She does not mind a nervous start if the content is useful.',
      reactions: {
        good:
          'She smiles, says something like "That helps, thank you", and asks one natural follow-up that connects to the work (for example how they usually keep people updated). The next person on the call is introduced warmly.',
        poor:
          'If the learner lists adjectives, rambles, or never says what they will do for the team, she politely asks "And what will you be doing on this project, exactly?" and keeps the next question short. If it is still vague she thanks them and moves on, a little unsure who to contact.',
      },
    },
    opening: "Welcome, everyone, glad we are all here. Let's go around quickly. You are next: could you tell us who you are and what you will be doing on this project?",
    minTurns: 3,
    maxTurns: 6,
    criteria: ['clarity', 'structure', 'relevance', 'professionalism'],
    strongSigns: [
      'says their name and what they will do on this project in the first sentences',
      'gives one specific detail or piece of evidence instead of adjectives',
      'stays short enough for a round of introductions',
      'answers the follow-up directly and briefly',
      'ends with how the team can work with them or reach them',
    ],
    traps: [
      'a list of adjectives with no example ("hardworking, detail-oriented, fast learner")',
      'a long life story before the part the team needs',
      'never saying what they will do for this project',
      'apologising for their English or experience instead of starting',
      'filler words and trailing sentences that never finish',
    ],
    difficulty: 'gentle',
    speaking: true,
  },
  {
    id: 'speak-pitch-questions',
    kind: 'roleplay',
    title: 'Answer questions after a short pitch',
    setting:
      "You have just finished a three-minute pitch to Danilo, the operations manager of a small delivery company. You proposed a shared sheet that shows each parcel's status, so the dispatchers stop answering the same phone calls. Now he has questions. Answer as if you are speaking out loud, in a few sentences each.",
    goal: "Answer Danilo's questions honestly and clearly enough that he can decide on a small trial.",
    partner: {
      role: 'stakeholder',
      name: 'Danilo',
      title: 'Operations manager of a small delivery company, deciding whether to try your idea',
      personality:
        'direct, practical, impatient with sales talk. Asks short pointed questions, one at a time. Interrupts a long answer with "Short version?". Warms up to people who say what they know, what they do not know, and what happens next.',
      private:
        'A previous system was dropped after two months and he is the one who had to explain the waste to the owners. He worries more about his dispatchers hating a new tool than about the price. He respects "I do not know yet, I will check and tell you by Friday" and distrusts "it never fails". He would agree to a one-week trial if he leaves with a clear limit and a clear next step.',
      reactions: {
        good:
          'If the learner answers the question that was asked, keeps it short, admits what is unknown and says when they will find out, he relaxes, says something like "Fair enough", and moves to a more practical question, then asks what a one-week trial would need.',
        poor:
          'If the learner dodges, uses jargon, repeats the pitch instead of answering, or promises that nothing will go wrong, he becomes more pointed ("That is not what I asked") and his doubt grows. If the learner guesses at a fact they could not know, he asks how sure they are.',
      },
    },
    opening: 'Thanks. I have a few questions. First one: what happens on a busy day when this sheet stops working, and my dispatchers cannot see the parcels?',
    minTurns: 4,
    maxTurns: 9,
    criteria: ['relevance', 'clarity', 'listening', 'integrity', 'professionalism'],
    strongSigns: [
      'answers the question that was asked, with the answer first and one reason after it',
      'says plainly when they do not know and names who or when they will find out',
      'does not promise things that cannot be promised',
      'checks that the answer helped, or restates the worry behind the question',
      'keeps answers short enough to leave room for the next question',
    ],
    traps: [
      'repeating the pitch instead of answering',
      'bluffing a number or a fact',
      'technical words the manager has not heard',
      'a long answer that buries the point',
      'getting defensive when the question sounds like criticism',
    ],
    difficulty: 'demanding',
    speaking: true,
  },
  {
    id: 'speak-ask-for-feedback',
    kind: 'roleplay',
    title: 'Ask a colleague for honest feedback on your rehearsal',
    setting:
      "You have just practised your five-minute demo for Friday's team meeting out loud, in front of your colleague Rina, who works on the same team. She watched the whole thing. You want honest feedback while there is still time to change it.",
    goal: 'Get specific, honest feedback from Rina that you can use, and agree on one change to try before Friday.',
    partner: {
      role: 'coworker',
      name: 'Rina',
      title: 'Colleague on the same team who just watched your rehearsal',
      personality:
        'kind and a little shy about criticism. Starts with general praise ("It was good!") and stays vague unless the questions are specific. Becomes open and precise when asked about particular parts. Has a busy afternoon.',
      private:
        'She thought the opening was strong. She got lost in the middle, where there were many numbers on one slide, and she did not understand one term. She is afraid of hurting the learner and of sounding rude. If the learner argues or explains why it was fine, she will stop giving the harder points.',
      reactions: {
        good:
          'If the learner asks about specific parts, listens, asks for an example, and does not defend, she gives concrete observations (what she followed, where she got lost, what she would try) and suggests one change.',
        poor:
          'If the learner asks only "Was it good?", argues with her points or explains why she was wrong, she goes back to "No, it was fine, really" and the useful points stay unsaid.',
      },
    },
    opening: 'Okay, that was good! I liked it. Honestly I think you are ready.',
    minTurns: 3,
    maxTurns: 7,
    criteria: ['listening', 'clarity', 'professionalism', 'actionability'],
    strongSigns: [
      'asks about particular parts instead of "was it good?"',
      'asks what she remembers or where she got lost',
      'asks for an example when the feedback is vague',
      'accepts a point without defending or explaining it away',
      'ends with one change to try and thanks her',
    ],
    traps: [
      'asking only a yes or no question about the whole talk',
      'defending the parts she criticises',
      'asking for feedback and then changing the subject',
      'collecting many suggestions with no decision',
    ],
    difficulty: 'realistic',
  },
];
