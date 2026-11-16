import { defineStrings } from '@/lib/i18n';

/**
 * The words of the coach picker. Read straight from this table, never through `useLocalized`: that hook swaps "Tali" for the chosen
 * coach's name, and here both names must stay as they are (the Tali card must say Tali even when Tala is the one chosen).
 */
export const companionStrings = defineStrings({
  en: {
    male: 'Male voice',
    female: 'Female voice',
    hear: (name: string) => `Hear ${name}`,
    playing: 'Talking…',
    choose: (name: string, voice: string) => `${name}, ${voice}`,
    changeAnytime: 'You can change your coach any time in Settings. Lessons and your progress stay the same.',
    voiceNote: 'Your coach’s voice reads your lessons aloud when you tap Listen.',
  },
  fil: {
    male: 'Boses lalaki',
    female: 'Boses babae',
    hear: (name: string) => `Pakinggan si ${name}`,
    playing: 'Nagsasalita…',
    choose: (name: string, voice: string) => `${name}, ${voice}`,
    changeAnytime: 'Puwede mong palitan ang coach mo anumang oras sa Settings. Pareho pa rin ang mga lesson at ang progress mo.',
    voiceNote: 'Babasahin ng boses ng coach mo ang mga lesson kapag nag-tap ka ng Pakinggan.',
  },
});
