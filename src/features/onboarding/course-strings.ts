import { defineStrings } from '@/lib/i18n';

/**
 * The words of the course, "great choice", paywall and goal-name steps added to onboarding on 2026-11-18. English only (owner,
 * 2026-11-15: no Filipino work): `fil` is the same English.
 */
const en = {
  // "What do you want to learn?"
  courseTitle: 'What do you want to learn?',
  courseBody: 'These match your answers. You can switch to any course later.',
  recommended: 'Recommended',
  lessons: (n: number) => `${n} ${n === 1 ? 'lesson' : 'lessons'}`,
  projects: (n: number) => `${n} ${n === 1 ? 'project' : 'projects'}`,

  // "Great choice"
  choiceTitle: (course: string) => `Great choice: ${course}`,
  choiceFree: 'This one is free, so you can start right away. Step by step, with your progress in view the whole way.',
  choicePro: 'Your first lesson is free, so you can start right away. Unlock the whole course with Talino Pro whenever you’re ready.',

  // Daily goal names (the minutes behind each stay the same)
  tiers: { 5: 'Casual', 10: 'Regular', 15: 'Steady', 30: 'Serious', 45: 'Committed', 60: 'Intense' } as Record<number, string>,
  tierTitle: (name: string, minutes: number) => (minutes >= 60 ? `${name} · 1 hour` : `${name} · ${minutes} min`),

  // The paywall step
  unlockTitle: (course: string) => `Unlock ${course}`,
  unlockBody: 'The first lesson of every course is free. Talino Pro opens the rest, with reviewed projects and certificates.',
  keepGoing: 'Continue',
  skippedNote: 'You can unlock Talino Pro any time from Settings.',
};

export const onboardingCourseStrings = defineStrings({ en, fil: en });
