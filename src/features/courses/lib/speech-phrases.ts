import type { Language } from '@/lib/language';

/**
 * The words Listen adds around a lesson's own text: the labels it says before a tip or the key takeaways, and the line that stands in for
 * something it can't read out (a table, a code example, a prompt). A Tagalog lesson is read with the Tagalog ones, so the coach's voice never
 * switches to English between two Tagalog sentences.
 *
 * The English lines are exactly what the recordings were made from: changing one changes every lesson's timing hash, and the hosted
 * recordings would stop being followed until they are made again. Keep them as they are. Pure, no native imports: the audio export
 * script loads this file too.
 */
export type SpeechPhrases = {
  tip: string;
  warning: string;
  prompt: string;
  code: (language: string) => string;
  takeaways: string;
  table: string;
  tableWithCaption: (caption: string) => string;
  diagram: string;
  diagramWithCaption: (caption: string) => string;
  version: (checked: string) => string;
  plans: (plans: string) => string;
  toolComparison: string;
  /** "AI in Action" (the `demo` block): said first, so a listener knows it is an illustration, then each part's label. */
  demoIntro: string;
  demoPrompt: string;
  demoOutput: string;
  demoNotice: string;
  objectives: string;
  why: string;
};

export const SPEECH_PHRASES: Record<Language, SpeechPhrases> = {
  en: {
    tip: 'Tip.',
    warning: 'Watch out.',
    prompt: 'There is a prompt on screen you can copy into your AI assistant.',
    code: (language) => `There is a ${language} example on screen.`,
    takeaways: 'Key takeaways.',
    table: 'There is a table on screen.',
    tableWithCaption: (caption) => `There is a table on screen: ${caption}`,
    diagram: 'There is a diagram on screen.',
    diagramWithCaption: (caption) => `There is a diagram on screen: ${caption}`,
    version: (checked) => `Checked on ${checked}, and it may change.`,
    plans: (plans) => `Plans: ${plans}`,
    toolComparison: 'There is a comparison of AI tools on screen.',
    demoIntro: 'Example. This is a hand-written illustration, not a real model\'s output.',
    demoPrompt: 'You ask:',
    demoOutput: 'An AI might answer:',
    demoNotice: 'Notice:',
    objectives: 'By the end of this lesson you will be able to:',
    why: 'Why it matters.',
  },
  // The style guide's voice (docs/i18n/tagalog-style-guide.md): spoken, short, English for the tech words.
  fil: {
    tip: 'Tip.',
    warning: 'Ingat.',
    prompt: 'May prompt sa screen na puwede mong i-copy sa AI assistant mo.',
    code: (language) => `May ${language} na halimbawa sa screen.`,
    takeaways: 'Mga key takeaway.',
    table: 'May table sa screen.',
    tableWithCaption: (caption) => `May table sa screen: ${caption}`,
    diagram: 'May diagram sa screen.',
    diagramWithCaption: (caption) => `May diagram sa screen: ${caption}`,
    version: (checked) => `Na-check ito noong ${checked}, at puwede pa itong magbago.`,
    plans: (plans) => `Mga plan: ${plans}`,
    toolComparison: 'May paghahambing ng mga AI tool sa screen.',
    // English placeholders: the owner's rule is that no Filipino is written (2026-11-15); a Tagalog lesson with a demo block would read these in English until translated.
    demoIntro: 'Example. This is a hand-written illustration, not a real model\'s output.',
    demoPrompt: 'You ask:',
    demoOutput: 'An AI might answer:',
    demoNotice: 'Notice:',
    objectives: 'Sa dulo ng lesson na ito, kaya mo nang:',
    why: 'Bakit ito mahalaga.',
  },
};

export const speechPhrases = (language: Language = 'en'): SpeechPhrases => SPEECH_PHRASES[language] ?? SPEECH_PHRASES.en;
