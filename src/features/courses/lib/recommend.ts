import type { Language } from '@/lib/i18n';

import type { AudienceId } from '../content/types';
import { RECOMMEND_QUESTIONS_FIL } from './recommend-strings';

/** The five career courses the starter quiz can recommend. */
export type CareerCourseId = 'developer' | 'experienced' | 'freelancer' | 'educator' | 'builder';

export type RecommendQuestion = {
  id: string;
  prompt: string;
  choices: { label: string; course: CareerCourseId }[];
};

/** "Pick your next course": five questions after the starter course (the business plan's short quiz). */
export const RECOMMEND_QUESTIONS: readonly RecommendQuestion[] = [
  {
    id: 'want',
    prompt: 'What do you want most in the next six months?',
    choices: [
      { label: 'My first developer job', course: 'developer' },
      { label: 'Online income from clients', course: 'freelancer' },
      { label: 'Stay valuable in my developer job', course: 'experienced' },
      { label: 'Teach my students better', course: 'educator' },
      { label: 'My own app or website', course: 'builder' },
    ],
  },
  {
    id: 'code',
    prompt: 'How much can you code today?',
    choices: [
      { label: 'Not at all', course: 'builder' },
      { label: 'A little, from school or tutorials', course: 'developer' },
      { label: 'I code for a living', course: 'experienced' },
      { label: 'I teach it', course: 'educator' },
      { label: 'Enough for simple tools and websites', course: 'freelancer' },
    ],
  },
  {
    id: 'day',
    prompt: 'Where do you spend most of your working day?',
    choices: [
      { label: 'In school, or looking for my first job', course: 'developer' },
      { label: 'In an office, BPO or admin job', course: 'freelancer' },
      { label: 'On a development team', course: 'experienced' },
      { label: 'In a classroom', course: 'educator' },
      { label: 'Running my own business or channel', course: 'builder' },
    ],
  },
  {
    id: 'earn',
    prompt: 'How would you like to earn?',
    choices: [
      { label: 'A salary at a tech company', course: 'developer' },
      { label: 'Clients I find online', course: 'freelancer' },
      { label: 'A raise or promotion where I am', course: 'experienced' },
      { label: 'Teaching', course: 'educator' },
      { label: 'From my own product', course: 'builder' },
    ],
  },
  {
    id: 'proof',
    prompt: 'Which would you be proudest to show?',
    choices: [
      { label: 'Three AI projects on GitHub', course: 'developer' },
      { label: 'A freelance profile and my first proposal', course: 'freelancer' },
      { label: 'A case study of how much faster I work', course: 'experienced' },
      { label: 'An AI-ready lesson module', course: 'educator' },
      { label: 'My own app, live on the internet', course: 'builder' },
    ],
  },
];

/** The quiz in the learner's language; the choices keep their order, so each keeps its course. English by default. */
export function recommendQuestions(language: Language = 'en'): readonly RecommendQuestion[] {
  if (language !== 'fil') return RECOMMEND_QUESTIONS;
  return RECOMMEND_QUESTIONS.map((question) => {
    const text = RECOMMEND_QUESTIONS_FIL[question.id];
    return text ? { ...question, prompt: text.prompt, choices: question.choices.map((choice, index) => ({ ...choice, label: text.choices[index] ?? choice.label })) } : question;
  });
}

const BY_AUDIENCE: Record<AudienceId, CareerCourseId> = {
  'fresh-grad': 'developer',
  'experienced-dev': 'experienced',
  'career-changer': 'freelancer',
  educator: 'educator',
  builder: 'builder',
};

const ORDER: CareerCourseId[] = ['developer', 'freelancer', 'builder', 'experienced', 'educator'];

/** The course most answers point to; a tie goes to the goal from the welcome, then the launch order. */
export function recommendCourse(answers: readonly CareerCourseId[], goal: AudienceId | null): CareerCourseId {
  const score = new Map<CareerCourseId, number>();
  for (const course of answers) score.set(course, (score.get(course) ?? 0) + 1);
  const top = Math.max(0, ...score.values());
  if (top === 0) return goal ? BY_AUDIENCE[goal] : 'developer';
  const leaders = ORDER.filter((course) => score.get(course) === top);
  const preferred = goal ? BY_AUDIENCE[goal] : null;
  return preferred && leaders.includes(preferred) ? preferred : leaders[0];
}

export function courseForAudience(goal: AudienceId): CareerCourseId {
  return BY_AUDIENCE[goal];
}
