import type { PracticeItem } from '../types';

/**
 * Role-play scenarios and message tasks of Module 10 (Career Readiness and Personal Branding, lessons 49 to 54). Written 2026-11-17.
 * Four message tasks (strengths, introduction, evidence lines, outreach) and three role-plays (recruiter screening call, behavioural
 * interview, a growth conversation with a manager). The two interview role-plays are meant to be answered aloud.
 */
export const items: PracticeItem[] = [
  {
    id: 'career-strengths-reply',
    kind: 'message',
    title: 'Name your strengths for someone who asked',
    situation:
      'Ana, a former coworker who now leads a small design studio, has messaged you. She is thinking of recommending you to a friend who is hiring part-time, and she wants to describe you accurately. Use your own real work. If you have little paid work, use school, volunteering or a family project.',
    brief: 'Reply to Ana with two strengths, a specific example for each, and one area you are still growing in.',
    channel: 'chat',
    received:
      "Hi! Hope you're doing well. I'm thinking of recommending you to a friend who is hiring part-time. What would you say are your two strongest skills at work, and what's an example of each? Also, what's something you're still working on? No rush, but I'd like to send her something by Friday. :)",
    mustInclude: [
      'two strengths named in plain words',
      'a specific example for each (what you did and what changed)',
      'one honest growth area, with what you are doing about it',
      'a friendly, short tone that answers what she asked',
    ],
    targetWords: { min: 90, max: 180 },
    criteria: ['clarity', 'tone', 'completeness', 'relevance', 'professionalism'],
    difficulty: 'gentle',
  },
  {
    id: 'career-intro-profile',
    kind: 'message',
    title: 'Introduce yourself to a new community',
    situation:
      'You have joined an online community for remote workers and freelancers. The welcome channel asks every new member to post a short introduction. Several members hire or recommend people, so the post is also a first impression. Write it about your own real work and goals.',
    brief: 'Write your introduction post: who you are, one thing you have really done, what you are looking for, and a friendly question.',
    channel: 'chat',
    received:
      "Welcome to the community! Please introduce yourself in 3 to 5 sentences: what you do, what you're working on, and what you hope to get from being here. No need to be formal.",
    mustInclude: [
      'who you are and what you do now',
      'one specific thing you have done, with a result or a detail',
      'what you are looking for or hoping to learn',
      'a friendly question or invitation to reply',
    ],
    targetWords: { min: 50, max: 110 },
    criteria: ['clarity', 'tone', 'professionalism', 'completeness', 'relevance'],
    difficulty: 'realistic',
  },
  {
    id: 'career-evidence-lines',
    kind: 'message',
    title: 'Show your work with evidence',
    situation:
      'You are updating your résumé or portfolio. The three lines below are the kind many people write. Choose real work of your own (a job, a school project, volunteering or a freelance task) and rewrite each line so a stranger can see what you did and what changed. Do not invent numbers: use only facts you could explain in an interview.',
    brief: 'Rewrite the three lines using your own real work, then add a two-sentence summary for the top of your résumé.',
    channel: 'update',
    received: 'Responsible for customer support.\nHard-working and passionate team player.\nWorked on the company website.',
    mustInclude: [
      'each line says what you did (an action), not only what your duty was',
      'a result, a number or a fact you can prove, and never an invented figure',
      'no adjective that has no proof behind it (for example hard-working or passionate)',
      'a two-sentence summary that names your role, your strongest evidence and what you want next',
    ],
    targetWords: { min: 80, max: 170 },
    criteria: ['clarity', 'professionalism', 'completeness', 'relevance', 'integrity'],
    difficulty: 'realistic',
  },
  {
    id: 'career-recruiter-screening',
    kind: 'roleplay',
    title: 'Recruiter screening call',
    setting:
      'You applied for a client-support associate role at a company that serves customers overseas. A recruiter named Jessa has called you for a short screening call, which decides whether you move on to the hiring manager. It is a phone call, so everything you say is only your words. Use your own real background.',
    goal: 'Show in a short call that you fit the role, and finish knowing what happens next.',
    partner: {
      role: 'recruiter',
      name: 'Jessa',
      title: 'Talent recruiter at a company that provides support services to overseas clients',
      personality:
        'Warm and efficient. She has about fifteen minutes and a list of questions. She likes plain, specific answers, gently steers back when someone rambles, and asks a narrower follow-up when an answer is vague. She speaks in short, natural sentences.',
      private:
        'She must send a shortlist to the hiring manager by the end of the week. The role works the overseas client\'s evening hours, which means a night shift where the candidate lives, and she worries about people who accept and then leave within a few months. She needs clear written and spoken English and someone reliable on a fixed schedule. She asks about expected salary, and she shares the offered range only if the candidate asks politely. She asks about notice period and start date.',
      reactions: {
        good: 'If the learner gives a short, relevant introduction, answers what was asked with one concrete example, is honest about the schedule and notice period, and asks sensible questions, Jessa relaxes, tells more about the team and the process, and says clearly what the next step is.',
        poor: 'If the learner rambles, lists adjectives with no example, is evasive about the schedule or salary, says they will do anything, or asks nothing, Jessa stays polite but asks narrower questions, says aloud that she wants to be sure the schedule will work, and closes without promising a next step.',
      },
    },
    opening:
      "Hi, thanks for taking my call. I'm Jessa from the talent team. I have about fifteen minutes, so I'll keep it quick. Before I tell you about the role, could you tell me a little about yourself and what made you apply?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'structure', 'relevance', 'professionalism', 'listening'],
    strongSigns: [
      'Opens with a short introduction that fits this role (who they are, one piece of evidence, why this job) instead of a life story',
      'Answers the question that was asked and then stops',
      'Gives one concrete example when asked about a skill',
      'Says honestly whether the schedule and the notice period work, without overpromising',
      'Handles the salary question calmly, with a range or a plain answer rather than dodging',
      'Asks at least one useful question about the role or the next steps',
    ],
    traps: [
      'Walking through the whole career history',
      'Listing adjectives with no example',
      'Saying anything is fine or I am flexible about the schedule when it is not true',
      'Dodging the salary question, or naming a number with no reasoning',
      'Asking nothing at the end, or only asking about benefits',
    ],
    difficulty: 'realistic',
    speaking: true,
  },
  {
    id: 'career-behavioural-interview',
    kind: 'roleplay',
    title: 'Behavioural interview',
    setting:
      "You are interviewing for a team coordinator role. The interviewer, Ramon, asks about past situations rather than about skills. Use real stories from work, school, volunteering or a family business. There is no perfect answer: he is listening for what you personally did and what happened.",
    goal: 'Tell true stories that show what you did, what happened and what you learned.',
    partner: {
      role: 'interviewer',
      name: 'Ramon',
      title: 'Operations manager interviewing for a team coordinator role',
      personality:
        'Courteous, calm and a little reserved. He takes notes. He asks "tell me about a time" questions and follows up with short questions such as "What did you personally do?" or "What happened in the end?". He does not fill silences or help the candidate along. He warms up when answers are specific and honest.',
      private:
        'He once hired someone who spoke well and then blamed others when things went wrong, so he listens for ownership, for the difference between "I" and "we", and for whether a story has a real result. He does not expect perfect stories: he values a candidate who describes a mistake and what changed afterwards. He will probe once on any story that sounds too polished or has no detail. He plans three questions: a disagreement, a mistake, and a time the candidate learned something quickly or handled pressure.',
      reactions: {
        good: 'If the learner tells a story with a clear situation, their own actions and an honest result, owns a mistake without excuses and answers in a reasonable length, Ramon nods, asks one thoughtful follow-up, and moves on with visible interest. He may say what he likes about the answer.',
        poor: 'If the learner stays general, says only "we", blames other people, makes the story sound too perfect, or rambles for a long time, Ramon asks a flat follow-up ("What specifically did you do?"), writes something down, and moves on without comment.',
      },
    },
    opening:
      "Thank you for coming in. I'm Ramon, and I run operations here. I'll ask a few questions about how you have worked in the past. Take your time. Let's start with this: tell me about a time you had a disagreement with someone you worked with.",
    minTurns: 5,
    maxTurns: 12,
    criteria: ['structure', 'clarity', 'accountability', 'relevance', 'listening', 'integrity'],
    strongSigns: [
      'Each story has a clear situation, what the learner personally did and what happened',
      'Uses "I" for their own actions and "we" for the team, and is fair to the other person in a disagreement',
      'Describes a real mistake, owns it without excuses and says what changed afterwards',
      'Keeps each answer to a reasonable length and then stops',
      'Says honestly when they are unsure or cannot remember, instead of inventing detail',
      'Answers the follow-up question that was asked rather than repeating the story',
    ],
    traps: [
      'General claims such as I get along with everyone, with no story',
      'Only "we", so the interviewer cannot tell what the learner did',
      'Blaming the other person for the disagreement or the mistake',
      'A story where nothing was at stake, or a mistake that is really a hidden boast',
      'No result, or a very long answer that loses the point',
    ],
    difficulty: 'demanding',
    speaking: true,
  },
  {
    id: 'career-outreach-message',
    kind: 'message',
    title: 'Reach out to someone you have not met',
    situation:
      'Priya leads a customer-support team at a software company. She posted publicly that her team is hiring a part-time chat support agent and that people are welcome to ask her questions. You have never met her. You want to introduce yourself and ask for something small and specific. Use your own real background.',
    brief: 'Write a short message to Priya: why you are writing, who you are in a line or two, one small specific ask, and an easy way for her to say no.',
    channel: 'message',
    received:
      "Priya's post: \"We're hiring a part-time chat support agent! If you have questions about the role, or about what a good first month looks like, feel free to message me. I read everything, but replies can take a few days.\"",
    mustInclude: [
      'a specific reason for writing to her, which refers to her post',
      'who you are in one or two lines, with one piece of evidence',
      'one small, specific ask (a question or a short chat), not a request for a job',
      'an easy way to decline or to reply later',
      'a polite close with your name',
    ],
    targetWords: { min: 60, max: 120 },
    criteria: ['clarity', 'tone', 'professionalism', 'actionability', 'relevance', 'completeness'],
    difficulty: 'realistic',
  },
  {
    id: 'career-manager-growth-talk',
    kind: 'roleplay',
    title: 'Ask your manager to help you grow',
    setting:
      'You asked your manager, Grace, for twenty minutes to talk about where you want to grow in the next year. You have a draft plan with one goal and a few dated steps. Grace has little time and a small training budget. Use your own real job, or a believable one if you are not working yet.',
    goal: 'Leave the meeting with one specific thing Grace has agreed to support, and a date to check in.',
    partner: {
      role: 'manager',
      name: 'Grace',
      title: 'Your manager at a small digital agency, who has worked with you for about fourteen months',
      personality:
        'Supportive but busy. She likes people who arrive with a specific idea, and she says kindly when a request is too vague for her to act on. She thinks in terms of what the team needs this quarter. She is honest rather than flattering.',
      private:
        'The agency has almost no training money, but she can give stretch tasks, a few hours of her own review time, and one outside course a year. She has been thinking about letting someone lead small client projects, but nobody has asked, and she will not offer it unless the learner makes a reasonable case. She has also noticed one thing the learner could work on and will say it only if asked for honest feedback. She does not promote or give raises on the spot and will say so if pushed.',
      reactions: {
        good: 'If the learner states a clear goal, gives evidence for why they are ready, makes one or two specific requests and offers a way to review progress, Grace gets interested, proposes a concrete option (a small project to lead, a monthly check-in), shares her honest view on the gap, and agrees a date.',
        poor: 'If the learner is vague ("I just want to grow"), asks for a promotion or a raise with no evidence, compares themselves to others, or blames the team, Grace stays kind but says she needs something specific, offers general encouragement and ends with "let\'s talk again soon", with nothing agreed.',
      },
    },
    opening:
      "Hi, come in. You asked for twenty minutes to talk about your career. I'm happy to help, though I only have a little time before my next call. What's on your mind?",
    minTurns: 4,
    maxTurns: 10,
    criteria: ['clarity', 'structure', 'actionability', 'listening', 'collaboration'],
    strongSigns: [
      'States one clear goal for the next year in a sentence or two',
      'Backs the goal with evidence of what they have already done',
      'Makes one or two specific, small requests rather than a general request for help',
      'Listens to Grace\'s constraints (time, budget) and adjusts the request instead of insisting',
      'Asks for honest feedback and takes it without defending',
      'Ends with something agreed and a date to check in',
    ],
    traps: [
      'A vague request such as help me grow, with no goal or step',
      'Asking for a promotion or a raise with no evidence',
      'Comparing themselves with coworkers or blaming the team for a lack of growth',
      'Ignoring what Grace says about her time and budget',
      'Leaving with a nice conversation and no agreed next step',
    ],
    difficulty: 'realistic',
  },
];
