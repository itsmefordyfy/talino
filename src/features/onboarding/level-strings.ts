import { defineStrings } from '@/lib/i18n';

import type { CourseDifficulty } from '../courses/content/levels';

/** The words for choosing a level, checking it and being offered the next one (Learning profile and Discover). */
export const levelControlStrings = defineStrings({
  en: {
    yourLevelTitle: 'Your level',
    yourLevelBody: 'Your level shapes how lessons explain things, the practice you get and how hard the quiz questions are. It never locks a course or a lesson, and you can change it any time.',
    progressStays: 'Your progress stays exactly as it is.',
    checkMyLevel: 'Check my level',
    checkMyLevelBody: 'A short check that suggests a level. You decide whether to use it.',
    chooseLevelFirst: 'Choose your level first, so the check starts at the right place.',
    checkSuggests: (label: string) => `The check suggests ${label}.`,
    checkAgrees: 'The check agrees with the level you chose.',
    useThisLevel: 'Use this level',
    keepMyLevel: 'Keep my level',
    suggestionTitle: 'Ready for the next level?',
    suggestionBody: (label: string) => `You could move up to ${label}. Lessons would go a little deeper, and you can switch back whenever you like.`,
    suggestionCourses: (count: number, tier: string, percent: number) => `You finished ${count} ${tier} courses (or harder) with a quiz average of ${percent}%.`,
    suggestionSkillCheck: 'Your skill check showed you know more than the level you chose.',
    moveUp: (label: string) => `Move up to ${label}`,
    notNow: 'Not now',
    tiers: { beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced' } as Record<CourseDifficulty, string>,
  },
  fil: {
    yourLevelTitle: 'Ang level mo',
    yourLevelBody: 'Dito nakabase kung paano ipapaliwanag ang mga lesson, anong practice ang makukuha mo at gaano kahirap ang mga tanong sa quiz. Hindi nito nila-lock ang kahit anong course o lesson, at puwede mo itong palitan anumang oras.',
    progressStays: 'Mananatili ang progress mo, walang magbabago.',
    checkMyLevel: 'Check level',
    checkMyLevelBody: 'Maikling check na magmumungkahi ng level. Ikaw ang bahala kung gagamitin mo.',
    chooseLevelFirst: 'Pumili muna ng level para tama ang simula ng check.',
    checkSuggests: (label: string) => `Ang mungkahi ng check ay ${label}.`,
    checkAgrees: 'Sang-ayon ang check sa level na pinili mo.',
    useThisLevel: 'Gamitin ito',
    keepMyLevel: 'Keep level',
    suggestionTitle: 'Ready ka na ba sa susunod na level?',
    suggestionBody: (label: string) => `Puwede kang umakyat sa ${label}. Mas lalalim nang kaunti ang mga lesson, at puwede kang bumalik anumang oras.`,
    suggestionCourses: (count: number, tier: string, percent: number) => `Natapos mo ang ${count} ${tier} na course (o mas mahirap) na may quiz average na ${percent}%.`,
    suggestionSkillCheck: 'Ipinakita ng skill check mo na mas marami kang alam kaysa sa level na pinili mo.',
    moveUp: (label: string) => `Umakyat sa ${label}`,
    notNow: 'Mamaya na',
    tiers: { beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced' } as Record<CourseDifficulty, string>,
  },
});
