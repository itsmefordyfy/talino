import type { Language } from '@/lib/i18n';

import { en, type Strings } from './en';
import { fil } from './fil';

export type { Strings };

/**
 * App-wide strings: common words, tabs, the brand. Each feature keeps its own in
 * `features/<name>/strings.ts` (`defineStrings`), read with `useLocalized`.
 */
export const STRINGS: Record<Language, Strings> = { en, fil };
