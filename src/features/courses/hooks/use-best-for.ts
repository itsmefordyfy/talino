import { onboardingStrings } from '@/features/onboarding/strings';
import { useLocalized } from '@/hooks/use-strings';

import { levelsSuitedTo, type CourseDifficulty } from '../content/levels';
import { levelStrings } from '../level-strings';

/** "Best for Complete Beginner and Beginner": the learner levels a course of this difficulty is aimed at. Advice on cards and course pages, never a restriction. */
export function useBestFor(difficulty: CourseDifficulty): { text: string; advice: string } {
  const strings = useLocalized(levelStrings);
  const labels = useLocalized(onboardingStrings).experience;
  const names = levelsSuitedTo(difficulty).map((level) => labels[level].label);
  const joined = names.length > 1 ? `${names.slice(0, -1).join(', ')} ${strings.and} ${names[names.length - 1]}` : names[0];
  return { text: strings.bestFor(joined), advice: strings.bestForAdvice };
}
