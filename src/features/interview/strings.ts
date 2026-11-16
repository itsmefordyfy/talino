import { defineStrings } from '@/lib/i18n';

import type { InterviewDifficulty, InterviewLength, InterviewLevel, InterviewStyle, InterviewType } from './lib/options';
import type { CategoryId, Rating } from './lib/report';

type Option = { label: string; description: string };

const types: Record<InterviewType, Option & { icon: string }> = {
  general: { label: 'General job interview', description: 'Motivation, experience and fit for the role.', icon: 'work' },
  technical: { label: 'Technical interview', description: 'How you think through real problems.', icon: 'code' },
  behavioral: { label: 'Behavioral interview', description: 'Real examples: teamwork, mistakes, pressure.', icon: 'forum' },
  hr: { label: 'HR interview', description: 'Screening: goals, availability, culture fit.', icon: 'groups' },
  software: { label: 'Software developer', description: 'Building, testing and shipping software.', icon: 'terminal' },
  'react-native': { label: 'React / React Native', description: 'Components, state, performance, shipping apps.', icon: 'smartphone' },
  'ai-developer': { label: 'AI developer', description: 'Building and testing features with AI models.', icon: 'smart_toy' },
  'freelance-client': { label: 'Freelance client call', description: 'Your interviewer plays a client: scope, price, deadline.', icon: 'handshake' },
  leadership: { label: 'Leadership and management', description: 'Leading people, deciding, handling conflict.', icon: 'supervisor_account' },
};

const levels: Record<InterviewLevel, string> = { entry: 'Entry level', junior: 'Junior', mid: 'Mid-level', senior: 'Senior', lead: 'Lead or manager' };

const difficulties: Record<InterviewDifficulty, Option> = {
  easy: { label: 'Easy', description: 'Fundamentals, with hints if you are stuck.' },
  standard: { label: 'Standard', description: 'What a typical interview asks.' },
  hard: { label: 'Hard', description: 'Demanding questions and edge cases.' },
};

const styles: Record<InterviewStyle, Option> = {
  friendly: { label: 'Friendly', description: 'Supportive and approachable.' },
  professional: { label: 'Professional', description: 'Formal and structured.' },
  challenging: { label: 'Challenging', description: 'Harder questions, deeper follow-ups.' },
  strict: { label: 'Strict', description: 'Direct, with critical feedback.' },
  realistic: { label: 'Realistic', description: 'Like a real company interview.' },
};

const lengths: Record<InterviewLength, Option> = {
  quick: { label: 'Quick', description: 'About 4 questions, around 10 minutes.' },
  standard: { label: 'Standard', description: 'About 7 questions, around 20 minutes.' },
  full: { label: 'Full', description: 'About 10 questions, around 30 minutes.' },
};

const ratings: Record<Rating, { label: string; line: string }> = {
  excellent: { label: 'Excellent', line: 'You are ready for a real interview like this.' },
  good: { label: 'Good', line: 'A solid interview, with a few things to sharpen.' },
  fair: { label: 'Getting there', line: 'A fair start. The feedback below shows where to improve.' },
  needs_improvement: { label: 'Needs improvement', line: 'Not ready yet, and that is what practice is for. Start with the weak answers below.' },
};

const categories: Record<CategoryId, { label: string; hint: string }> = {
  relevance: { label: 'Answer relevance', hint: 'Did you answer what was asked?' },
  technical: { label: 'Technical knowledge', hint: 'Depth and accuracy for the level.' },
  communication: { label: 'Communication', hint: 'Clear, professional, easy to follow.' },
  clarity: { label: 'Clarity and structure', hint: 'Organised, specific answers.' },
  confidence: { label: 'Confidence in your wording', hint: 'Read from the words you typed, not from how you would sound speaking.' },
  problem_solving: { label: 'Problem solving', hint: 'How you break a problem down and decide.' },
  critical_thinking: { label: 'Critical thinking', hint: 'Trade-offs, risks and assumptions.' },
  experience: { label: 'Practical experience', hint: 'Real, specific examples.' },
  project_explanation: { label: 'Explaining your projects', hint: 'Purpose, your role, decisions and results.' },
};

const en = {
  // The Career tab's tool tile and the screens' titles
  toolLabel: 'Mock interview',
  title: 'Mock interview',
  setupTitle: 'New interview',
  reportTitle: 'Your evaluation',
  chatTitle: 'Interview',

  // Home
  homeTitle: 'Practise getting hired',
  homeBody: (name: string) => `${name} interviews you like a real hiring manager: one question at a time, with follow-ups on what you actually say. You get a score and honest feedback at the end.`,
  start: 'Start a mock interview',
  continueTitle: 'Pick up where you left off',
  continueAction: 'Continue',
  paused: 'Paused',
  inProgress: 'In progress',
  answersCount: (count: number) => (count === 1 ? '1 answer' : `${count} answers`),
  progressTitle: 'Your progress',
  progressLatest: 'Latest score',
  progressBest: 'Best',
  progressAttempts: (count: number) => (count === 1 ? '1 evaluated interview' : `${count} evaluated interviews`),
  trendUp: (points: number) => `Up ${points} from your last interview`,
  trendDown: (points: number) => `Down ${points} from your last interview`,
  trendSame: 'Same as your last interview',
  noScoreYet: 'Finish an interview and ask for the evaluation to see your score here.',
  historyTitle: 'Past interviews',
  emptyTitle: 'No interviews yet',
  emptyBody: 'Start with a quick one. It takes about ten minutes, and the feedback shows exactly what to work on.',
  notEvaluated: 'Not evaluated yet',
  scoreOf: (score: number) => `${score}/100`,
  fromResume: 'Practise an interview',
  fromResumeBody: 'Your interviewer reads this résumé and asks about what is on it.',

  // Setup
  positionLabel: 'Position you are applying for',
  positionPlaceholder: 'e.g. React Native Developer',
  positionHint: 'Type any job title.',
  typeLabel: 'Interview type',
  levelLabel: 'Your experience level',
  difficultyLabel: 'Difficulty',
  styleLabel: 'Interviewer style',
  lengthLabel: 'Length',
  whoLabel: 'Who interviews you',
  languageLabel: 'Interview language',
  jobDescriptionLabel: 'Job description (optional)',
  jobDescriptionHint: 'Paste a job post and the questions will follow what it asks for. Leave it empty for a general interview.',
  useProfileTitle: 'Use my résumé and portfolio',
  useProfileBody: 'The interviewer reads them to ask about what you have really done. It never assumes anything that is not there.',
  useProfileEmpty: 'You have not added a résumé or portfolio yet, so the questions will come from the position only.',
  practiseTitle: 'Questions to practise again',
  practiseBody: 'These came up weak last time. They will be worked into the interview.',
  startInterview: 'Start interview',
  starting: (name: string) => `${name} is getting ready…`,
  startFailed: {
    interview_limit: 'You have used today’s free interview. Talino Pro gives you more, or come back tomorrow.',
    network: 'You are offline. Connect to the internet to start an interview.',
    busy: 'The interviewer is busy right now. Try again in a moment.',
    unavailable: 'Mock interviews are resting right now. Try again later.',
    quota_unavailable: 'Mock interviews are resting right now. Try again later.',
    unknown: 'That didn’t work. Nothing was used, so you can try again.',
  } as Record<string, string>,
  seePro: 'See Talino Pro',
  types,
  levels,
  difficulties,
  styles,
  lengths,

  // The interview
  pause: 'Pause',
  endInterview: 'End interview',
  endConfirmTitle: 'End the interview?',
  endConfirmBody: 'You will get your score and feedback for the answers so far.',
  endConfirm: 'End and evaluate',
  keepGoing: 'Keep going',
  questionOf: (asked: number, planned: number) => `Question ${Math.min(asked, planned)} of ${planned}`,
  wrappingUp: 'Wrapping up',
  interviewOver: 'The interview is over',
  seeEvaluation: 'See my evaluation',
  placeholder: 'Type your answer…',
  send: 'Send answer',
  thinking: (name: string) => `${name} is thinking`,
  offline: 'You are offline. You can read the conversation, but you need a connection to answer.',
  retry: 'Try again',
  paused_title: 'Interview paused',
  pausedBody: 'Your place is saved. Resume any time.',
  resume: 'Resume',
  tooManyAnswers: 'This interview has reached its length limit. End it to get your evaluation.',
  you: 'You',
  chatErrors: {
    chat_in_progress: 'That answer is already being sent. Give it a moment.',
    conversation_full: 'This interview has reached its length limit. End it to get your evaluation.',
    interview_limit: 'You have used today’s interviews.',
    network: 'You are offline. Your answer is saved. Try again when you are back online.',
    busy: 'The interviewer is busy right now. Your answer is saved. Try again in a moment.',
    unavailable: 'Mock interviews are resting right now. Your answer is saved.',
    quota_unavailable: 'Mock interviews are resting right now. Your answer is saved.',
    unknown: 'That didn’t go through. Your answer is saved, so you can try again.',
  } as Record<string, string>,

  // The evaluation
  tabs: { evaluation: 'Evaluation', answers: 'Your answers', transcript: 'Transcript' },
  preparing: (name: string) => `${name} is writing your evaluation…`,
  preparingBody: 'This takes up to a minute. Your interview is saved either way.',
  reportFailed: {
    network: 'You are offline. Your interview is saved. Evaluate it when you are back online.',
    busy: 'The evaluator is busy right now. Your interview is saved. Try again in a moment.',
    unavailable: 'Evaluations are resting right now. Your interview is saved.',
    quota_unavailable: 'Evaluations are resting right now. Your interview is saved.',
    interview_limit: 'You have used today’s interviews.',
    unknown: 'The evaluation didn’t come out right. Your interview is saved, so you can try again.',
  } as Record<string, string>,
  evaluate: 'Evaluate this interview',
  tooShortTitle: 'Not enough answers to score',
  tooShortBody: 'An evaluation needs at least two answers, or the score would not mean anything. Go back and answer a few more questions.',
  continueInterview: 'Continue the interview',
  outOf: 'out of 100',
  ratings,
  categoriesTitle: 'How you did',
  categories,
  confidenceNote: 'Confidence is read only from your written words. It does not measure how confident you would sound when speaking.',
  strongestTitle: 'Your strongest answers',
  weakestTitle: 'Answers to work on',
  noWeak: 'No weak answers. Nice work.',
  answerNumber: (turn: number) => `Answer ${turn}`,
  answerScore: (score: number) => `${score}/5`,
  verdicts: { strong: 'Strong', ok: 'Fine', weak: 'Weak' },
  whyLabel: 'Why',
  yourAnswer: 'Your answer',
  betterAnswer: 'A stronger answer',
  betterNote: 'Built only from what you said, with [placeholders] where you need to add something real.',
  outlineLabel: 'An outline to build your own answer',
  outlineNote: 'You didn’t give enough to build on, so this is a structure, not an answer. Fill the [brackets] with a real example of your own.',
  skillsTitle: 'Skills to improve',
  openCourse: 'Open course',
  stepsTitle: 'Before your next interview',
  comparedTitle: 'Compared with your last attempt',
  comparedOverall: (delta: number) => (delta > 0 ? `Overall: up ${delta}` : delta < 0 ? `Overall: down ${Math.abs(delta)}` : 'Overall: no change'),
  deltaLabel: (delta: number) => (delta > 0 ? `+${delta}` : `${delta}`),
  practiseWeak: 'Practise the weak questions',
  repeat: 'Repeat this interview',
  deleteInterview: 'Delete this interview',
  deleteTitle: 'Delete this interview?',
  deleteBody: 'The conversation and its evaluation are removed from this phone. This can’t be undone.',
  delete: 'Delete',
  cancel: 'Cancel',
  noAnswers: 'No answers were given in this interview.',
  privacy: 'Interviews stay on this phone. Each answer is sent to Talino’s AI only to write the next question, and nothing is stored on a server.',
  notFoundTitle: 'Interview not found',
  notFoundBody: 'It may have been deleted.',
};

/** Mock interviews. English only for now (owner, 2026-11-15: no new Filipino text): the Filipino table repeats it. The interviewer itself can hold the conversation in Tagalog (see `InterviewSetup.language`). */
export const interviewStrings = defineStrings({ en, fil: en });
