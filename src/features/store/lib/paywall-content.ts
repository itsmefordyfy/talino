import { AI_CHAT_FREE_DAILY_LIMIT } from '@/constants/ai-chat';

import type { PaywallReason } from './paywall-reasons';

/** What Talino Pro adds, in the order the paywall lists it (the words are in `paywall-strings.ts`). */
export const PAYWALL_FEATURES = ['courses', 'reviews', 'coach', 'resume', 'kit', 'backup'] as const;
export type PaywallFeature = (typeof PAYWALL_FEATURES)[number];

/** The feature a learner reached for, so the list leads with it; the general paywall leads with none. */
export function leadFeature(reason: PaywallReason): PaywallFeature | null {
  switch (reason) {
    case 'courses':
      return 'courses';
    case 'tali':
      return 'coach';
    case 'resume':
      return 'resume';
    case 'kit':
      return 'kit';
    case 'backup':
      return 'backup';
    case 'default':
      return null;
  }
}

/** The features with the lead first, each once. */
export function orderedFeatures(lead: PaywallFeature | null): PaywallFeature[] {
  return lead ? [lead, ...PAYWALL_FEATURES.filter((feature) => feature !== lead)] : [...PAYWALL_FEATURES];
}

/** A plan's cell in the table: has it or not, or how much (`perDay` is the coach's free chats). */
export type ComparisonCell = boolean | 'starter' | 'first' | 'all' | 'unlimited' | { perDay: number };

/**
 * Where Free and Pro differ, as the app gates them (the marketing site's plan table, from `ownsCourse`, `canUseManualBackup`, the résumé
 * screens, the career kit and `AI_CHAT_*`): only differences. What both plans have (the résumé builder, the career tracker, job boards, the
 * portfolio and automatic backup) is said under the table.
 */
export const COMPARISON_ROWS: readonly { key: 'courses' | 'reviews' | 'certificates' | 'coach' | 'tailor' | 'kit' | 'backupFile'; free: ComparisonCell; pro: ComparisonCell }[] = [
  // Free: the starter course in full and the first lesson of every other course (owner, 2026-11-18).
  { key: 'courses', free: 'first', pro: 'all' },
  { key: 'reviews', free: 'starter', pro: 'all' },
  { key: 'certificates', free: 'starter', pro: 'all' },
  { key: 'coach', free: { perDay: AI_CHAT_FREE_DAILY_LIMIT }, pro: 'unlimited' },
  { key: 'tailor', free: false, pro: true },
  { key: 'kit', free: false, pro: true },
  { key: 'backupFile', free: false, pro: true },
];
