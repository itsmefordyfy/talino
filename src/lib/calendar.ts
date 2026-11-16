import type { ISODate } from './dates';

/** A calendar month: `month` 0–11, as JavaScript's Date counts them. */
export type CalendarMonth = { year: number; month: number };

const pad = (value: number) => String(value).padStart(2, '0');

/** The month an ISO date falls in. */
export function monthOf(date: ISODate): CalendarMonth {
  const [year, month] = date.split('-').map(Number);
  return { year, month: month - 1 };
}

export function addMonths({ year, month }: CalendarMonth, count: number): CalendarMonth {
  const total = year * 12 + month + count;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/**
 * The month as weeks of seven days from `weekStart` (0 Sunday … 6 Saturday: the phone's own first
 * day, lib/region `firstWeekday`), each a local ISO date or null for the blanks around it. Built
 * from the calendar alone, never from a Date at midnight, so a time zone can't move a day.
 */
export function monthGrid({ year, month }: CalendarMonth, weekStart = 0): (ISODate | null)[][] {
  const firstWeekday = (new Date(year, month, 1).getDay() - weekStart + 7) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (ISODate | null)[] = [...Array<null>(firstWeekday).fill(null), ...Array.from({ length: days }, (_, index) => `${year}-${pad(month + 1)}-${pad(index + 1)}`)];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (ISODate | null)[][] = [];
  for (let start = 0; start < cells.length; start += 7) weeks.push(cells.slice(start, start + 7));
  return weeks;
}

/** Whether a day may be picked, given the field's own limits (none unless the field sets them). */
export function isSelectable(date: ISODate, minimum: ISODate | undefined, maximum: ISODate | undefined): boolean {
  return (!minimum || date >= minimum) && (!maximum || date <= maximum);
}
