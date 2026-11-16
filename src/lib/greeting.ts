import { activeLocale } from './i18n';

export type DayPart = 'morning' | 'afternoon' | 'evening';

/** Morning 5:00–11:59, afternoon 12:00–17:59, evening 18:00–4:59, by the phone's local clock. */
export function dayPart(date: Date): DayPart {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

/** The next moment the greeting or the date changes: 5:00, 12:00, 18:00, or midnight, whichever comes first. */
export function nextGreetingChange(from: Date): Date {
  const next = new Date(from);
  next.setSeconds(0, 0);
  const hour = from.getHours();
  const boundary = [5, 12, 18].find((candidate) => candidate > hour);
  if (boundary === undefined) {
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
  } else {
    next.setHours(boundary, 0, 0, 0);
  }
  return next;
}

/** "Thursday, October 15" in the interface language; the year is left out, it's today. */
export function formatFriendlyDate(date: Date, locale: string | undefined = activeLocale()): string {
  return date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
}
