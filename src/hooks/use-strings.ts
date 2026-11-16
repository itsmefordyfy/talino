import { STRINGS } from '@/constants/strings';
import { withCompanionName } from '@/features/companion/lib/companions';
import { selectCompanion, selectLanguage } from '@/features/settings/settings-slice';
import type { Language } from '@/lib/i18n';
import { useAppSelector } from '@/store/hooks';

/** The app-wide strings (common words, tabs) in the chosen language, naming the coach the learner chose. */
export function useStrings() {
  return withCompanionName(STRINGS[useAppSelector(selectLanguage)], useAppSelector(selectCompanion));
}

/**
 * A feature's own strings (`defineStrings`) in the chosen language. Every table is written with the coach's name as "Tali";
 * a learner who chose Tala gets the same table with her name swapped in (`withCompanionName`, once per table), so no screen
 * has to know which coach it is.
 */
export function useLocalized<T>(table: Readonly<Record<Language, T>>): T {
  return withCompanionName(table[useAppSelector(selectLanguage)], useAppSelector(selectCompanion));
}

export function useLanguage(): Language {
  return useAppSelector(selectLanguage);
}
