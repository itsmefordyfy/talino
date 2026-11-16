/**
 * Calendar-date helpers. Dates are stored as local `YYYY-MM-DD` strings, so a shot given on the
 * 3rd never shifts to the 2nd when the phone changes time zone.
 */

import { activeLocale } from './i18n';

export type ISODate = string;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses `YYYY-MM-DD` as local midnight (not UTC, which `new Date(iso)` would use). */
export function parseISODate(iso: ISODate): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(): ISODate {
  return toISODate(new Date());
}

export function addDays(iso: ISODate, days: number): ISODate {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: ISODate, to: ISODate): number {
  const ms = parseISODate(to).getTime() - parseISODate(from).getTime();
  return Math.round(ms / 86_400_000);
}

export type Age = { years: number; months: number };

/**
 * An age on `today` from a birth date, in whole years and months (babies use lib/age's `babyAge`).
 * Null for a birthday in the future.
 */
export function ageOn(birthday: ISODate, today: ISODate): Age | null {
  const from = parseISODate(birthday);
  const to = parseISODate(today);
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  if (months < 0) return null;
  return { years: Math.floor(months / 12), months: months % 12 };
}

export function formatDate(iso: ISODate, options?: Intl.DateTimeFormatOptions): string {
  return parseISODate(iso).toLocaleDateString(activeLocale(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

/** A time of day as stored (24-hour "HH:MM"), or null when it isn't one. */
export function parseTime(value: string | null | undefined): { hour: number; minute: number } | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? '');
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}

/** "HH:MM" from a picked time, for storing. */
export function toTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** A stored time in the phone's own style ("3:00 PM", or "15:00" where that's the custom). */
export function formatTime(value: string): string {
  const time = parseTime(value);
  if (!time) return value;
  return new Date(2000, 0, 1, time.hour, time.minute).toLocaleTimeString(activeLocale(), { hour: 'numeric', minute: '2-digit' });
}
