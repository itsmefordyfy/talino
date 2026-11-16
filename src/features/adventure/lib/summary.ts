import type { Language } from '@/lib/i18n';

import { levelFor, levelTitle, XP } from './xp';

export type BadgeEarned = { badge_id: string; earned_at: string };

/** How long after finishing a mission an achievement still counts as "unlocked by it" (BadgeSync awards within moments). */
export const SUMMARY_WINDOW_MS = 15 * 60 * 1000;

/** The badges earned at or just after `completedAt`: what a finished mission unlocked. */
export function badgesEarnedDuring(badges: readonly BadgeEarned[], completedAt: string | null | undefined, windowMs = SUMMARY_WINDOW_MS): string[] {
  if (!completedAt) return [];
  const start = Date.parse(completedAt);
  if (!Number.isFinite(start)) return [];
  return badges.filter((badge) => {
    const at = Date.parse(badge.earned_at);
    return Number.isFinite(at) && at >= start - 1000 && at <= start + windowMs;
  }).map((badge) => badge.badge_id);
}

export type SummaryChanges = { levelUp: { level: number; title: string } | null };

/**
 * What changed because of a mission: the level reached, if it rose.
 * `totalXp` is the XP now; the mission's own XP and the achievements it unlocked are taken off to
 * get the "before" state.
 */
export function summaryChanges(input: { totalXp: number; missionXp: number; newAchievements: readonly string[]; language?: Language }): SummaryChanges {
  const beforeXp = Math.max(0, input.totalXp - input.missionXp - input.newAchievements.length * XP.achievement);
  const before = levelFor(beforeXp);
  const after = levelFor(input.totalXp);
  return { levelUp: after > before ? { level: after, title: levelTitle(after, input.language) } : null };
}
