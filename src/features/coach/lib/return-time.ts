import { activeLocale } from '@/lib/i18n';

/** When access returns, in the learner's words: "at 3:20 PM" today, "tomorrow at 3:20 PM", never a date. */
export function formatReturnTime(iso: string | null, now: Date, words: { at: (time: string) => string; tomorrowAt: (time: string) => string }): string | null {
  if (!iso) return null;
  const when = new Date(iso);
  if (!Number.isFinite(when.getTime()) || when <= now) return null;
  const time = when.toLocaleTimeString(activeLocale(), { hour: 'numeric', minute: '2-digit' });
  return when.toDateString() === now.toDateString() ? words.at(time) : words.tomorrowAt(time);
}
