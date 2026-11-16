import { activeLocale } from '@/lib/i18n';

/** A date and time for the screen ("Nov 13, 2026, 2:05 PM"), in the phone's language. A value that isn't a date reads as an empty string. */
export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(activeLocale(), { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
