import { addDays, parseISODate, toISODate, type ISODate } from './dates';

/**
 * The date filter Insights, Expenses and the Timeline share (Pawfetti's period filter, adapted): today, yesterday, the last 7 or
 * 30 days, a calendar month stepped with arrows, the last three months, this year, all time, or
 * any two dates. Each screen offers the presets it wants and says which ones Free keeps.
 */
export const PERIOD_PRESETS = ['today', 'yesterday', 'last7', 'last30', 'month', 'threeMonths', 'year', 'all', 'custom'] as const;
export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

/** Inclusive local dates. */
export type Period = { from: ISODate; to: ISODate };

/** What the picker holds: the preset, the month `month` steps through, and a custom range's dates. */
export type PeriodChoice = { preset: PeriodPreset; /** `YYYY-MM`, for the month preset. */ month: string; from: ISODate; to: ISODate };

/** The month a date is in, `YYYY-MM`. */
export const monthKeyOf = (date: ISODate): string => date.slice(0, 7);

/** The month key `delta` months from `month`. */
export function shiftMonth(month: string, delta: number): string {
  const [year, index] = month.split('-').map(Number);
  const date = new Date(year, index - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** A month's first and last day. */
export function monthPeriod(month: string): Period {
  const [year, index] = month.split('-').map(Number);
  return { from: toISODate(new Date(year, index - 1, 1)), to: toISODate(new Date(year, index, 0)) };
}

/** A choice for `preset` around `today`: the month preset starts on this month, a custom range on the last 7 days. */
export function choiceFor(preset: PeriodPreset, today: ISODate, previous?: PeriodChoice): PeriodChoice {
  return { preset, month: monthKeyOf(today), from: previous?.from ?? addDays(today, -6), to: previous?.to ?? today };
}

/**
 * The dates a choice covers, never past `today` (nothing is logged in the future) and always
 * from <= to. All time starts at `firstDay` (today when there is none). Free's limits are the
 * caller's: this only says what was asked for.
 */
export function resolvePeriod(choice: PeriodChoice, today: ISODate, firstDay: ISODate | null): Period {
  let period: Period;
  switch (choice.preset) {
    case 'today':
      period = { from: today, to: today };
      break;
    case 'yesterday':
      period = { from: addDays(today, -1), to: addDays(today, -1) };
      break;
    case 'last7':
      period = { from: addDays(today, -6), to: today };
      break;
    case 'last30':
      period = { from: addDays(today, -29), to: today };
      break;
    case 'month':
      period = monthPeriod(choice.month);
      break;
    case 'threeMonths':
      period = { from: monthPeriod(shiftMonth(monthKeyOf(today), -2)).from, to: today };
      break;
    case 'year':
      period = { from: `${parseISODate(today).getFullYear()}-01-01`, to: today };
      break;
    case 'all':
      period = { from: firstDay ?? today, to: today };
      break;
    case 'custom':
      period = { from: choice.from <= choice.to ? choice.from : choice.to, to: choice.from <= choice.to ? choice.to : choice.from };
      break;
  }
  const to = period.to > today ? today : period.to;
  const from = period.from > to ? to : period.from;
  return { from, to };
}
