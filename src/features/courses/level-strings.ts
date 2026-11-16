import { defineStrings } from '@/lib/i18n';

/** The words for adapting lessons and projects to the learner's level (the level names themselves are onboarding's `experience` labels). */
export const levelStrings = defineStrings({
  en: {
    tailoredFor: (level: string) => `Tailored for ${level}.`,
    sharedOnly: 'Showing the part every level shares.',
    allShown: 'Showing everything, for every level.',
    showEverything: 'Show everything',
    showMine: 'Show for my level',
    changeLevel: 'Change level',
    chooseLevel: 'Choose your level',
    hiddenCount: (n: number) => (n === 1 ? '1 piece for other levels is hidden.' : `${n} pieces for other levels are hidden.`),
    // "For Beginner", "For Advanced and Professional", "For Beginner to Advanced"
    forAudience: (levels: string[]) => (levels.length === 0 ? '' : levels.length === 1 ? `For ${levels[0]}` : levels.length === 2 ? `For ${levels[0]} and ${levels[1]}` : `For ${levels[0]} to ${levels[levels.length - 1]}`),
    projectTailored: (level: string) => `Steps and review criteria tailored for ${level}.`,
    projectShared: 'Showing the steps and review criteria every level shares.',
    // Course pages and cards: advice, never a restriction.
    and: 'and',
    bestFor: (levels: string) => `Best for ${levels}`,
    bestForAdvice: 'This is a suggestion. You can open any course, whatever your level.',
  },
  fil: {
    tailoredFor: (level: string) => `Hiniwalay para sa ${level}.`,
    sharedOnly: 'Ipinapakita ang bahaging para sa lahat ng level.',
    allShown: 'Ipinapakita lahat, para sa bawat level.',
    showEverything: 'Show all',
    showMine: 'Para sa level ko',
    changeLevel: 'Palitan ang level',
    chooseLevel: 'Piliin ang level',
    hiddenCount: (n: number) => (n === 1 ? '1 bahaging para sa ibang level ang nakatago.' : `${n} bahaging para sa ibang level ang nakatago.`),
    forAudience: (levels: string[]) => (levels.length === 0 ? '' : levels.length === 1 ? `Para sa ${levels[0]}` : levels.length === 2 ? `Para sa ${levels[0]} at ${levels[1]}` : `Para sa ${levels[0]} hanggang ${levels[levels.length - 1]}`),
    projectTailored: (level: string) => `Ang mga step at pamantayan ng review ay hiniwalay para sa ${level}.`,
    projectShared: 'Ipinapakita ang mga step at pamantayan ng review na para sa lahat ng level.',
    and: 'at',
    bestFor: (levels: string) => `Bagay para sa ${levels}`,
    bestForAdvice: 'Suhestiyon lang ito. Puwede mong buksan ang kahit anong course, anuman ang level mo.',
  },
});
