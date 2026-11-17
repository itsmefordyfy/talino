import { defineStrings } from '@/lib/i18n';

import type { VisualCategory } from './types';

export const visualsStrings = defineStrings({
  en: {
    title: 'Concept Lab',
    subtitle: 'See how it works, then try it yourself.',
    intro: 'Interactive explanations of the ideas behind software. Press the buttons, change the values, and watch what happens.',
    all: 'All',
    categories: {
      fundamentals: 'Fundamentals',
      oop: 'Objects',
      dsa: 'Data structures',
      web: 'Web',
      'software-engineering': 'Engineering',
      ai: 'AI',
      productivity: 'Productivity',
    } as Record<VisualCategory, string>,
    count: (n: number) => (n === 1 ? '1 explorer' : `${n} explorers`),
    empty: 'Nothing here yet.',
    notFound: 'That explorer isn’t available.',
    relatedTopics: 'Good to know',
    open: (title: string) => `Open ${title}`,
  },
  fil: {
    title: 'Concept Lab',
    subtitle: 'Tingnan kung paano ito gumagana, tapos subukan mo mismo.',
    intro: 'Mga interactive na paliwanag sa mga ideya sa likod ng software. Pindutin ang mga button, palitan ang mga value, at panoorin kung ano ang mangyayari.',
    all: 'Lahat',
    categories: {
      fundamentals: 'Fundamentals',
      oop: 'Objects',
      dsa: 'Data structures',
      web: 'Web',
      'software-engineering': 'Engineering',
      ai: 'AI',
      productivity: 'Productivity',
    } as Record<VisualCategory, string>,
    count: (n: number) => `${n} explorer`,
    empty: 'Wala pa rito.',
    notFound: 'Hindi available ang explorer na iyon.',
    relatedTopics: 'Alamin din ito',
    open: (title: string) => `Buksan ang ${title}`,
  },
});
