import type { ExperienceLevel } from '@/features/courses/content/levels';
import type { Language } from '@/lib/i18n';

import { pick, type Line } from './messages';

/**
 * Small, pure adjustments to Tali's lesson and quiz lines for the learner's level (programming experience): a newcomer gets a little
 * more encouragement, an advanced learner or a professional a leaner line. Intermediate learners, learners whose level is unknown and
 * a lesson already done keep the base line exactly. Nothing here reveals an answer or changes what is asked.
 */
const NEWCOMER: readonly ExperienceLevel[] = ['complete-beginner', 'beginner'];
const EXPERIENCED: readonly ExperienceLevel[] = ['advanced', 'professional'];

const trimDot = (text: string) => text.replace(/[.!?]+$/, '');
const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export const isNewcomerLevel = (level: ExperienceLevel | null | undefined) => !!level && NEWCOMER.includes(level);
export const isExperiencedLevel = (level: ExperienceLevel | null | undefined) => !!level && EXPERIENCED.includes(level);

/** The line shown above a lesson: the base line for most learners, kinder for newcomers, shorter for experienced learners. */
export function levelLessonLine(base: Line, input: { level: ExperienceLevel | null; lesson: { id: string; title: string; day: number; intro?: { objectives: string[] } }; done: boolean; language?: Language }): Line {
  const { level, lesson, done } = input;
  if (done) return base;
  const fil = input.language === 'fil';
  const objective = lesson.intro?.objectives[0];
  if (isNewcomerLevel(level)) {
    const extra = fil
      ? pick(['Walang rush, at walang masamang tanong dito.', 'Dahan-dahan lang, may Listen din kung gusto mong may bumasa para sa’yo.', 'Isang maliit na hakbang lang ito, kaya mo ’to.'], `level:${lesson.id}`)
      : pick(['There is no rush, and no question is a silly one here.', 'Take it slowly. Listen can read it to you if that helps.', 'It is one small step, and you can do it.'], `level:${lesson.id}`);
    return { text: `${base.text} ${extra}`.replace(/\s+/g, ' ').trim(), mood: base.mood === 'excited' ? 'encouraging' : base.mood };
  }
  if (isExperiencedLevel(level)) {
    const goal = objective ? (fil ? `Pagkatapos, kaya mong ${lower(trimDot(objective))}.` : `You'll be able to ${lower(trimDot(objective))}.`) : '';
    return { text: `${trimDot(lesson.title)}. ${goal}`.trim(), mood: 'confident' };
  }
  return base;
}

/** The line before the quiz, adjusted the same way. `questions` is how many THIS learner will be asked. */
export function levelQuizLine(base: Line, input: { level: ExperienceLevel | null; questions: number; retake: boolean; language?: Language }): Line {
  const { level, questions, retake } = input;
  if (retake) return base;
  const fil = input.language === 'fil';
  if (isNewcomerLevel(level)) {
    return { text: `${base.text} ${fil ? 'Ipinapaliwanag ang bawat sagot, kaya may natututunan ka kahit magkamali.' : 'Every answer is explained, so even a miss teaches you something.'}`, mood: 'encouraging' };
  }
  if (isExperiencedLevel(level)) {
    return { text: fil ? `${questions} tanong, may paliwanag ang bawat sagot.` : `${questions} ${questions === 1 ? 'question' : 'questions'}, each answer explained.`, mood: 'confident' };
  }
  return base;
}
