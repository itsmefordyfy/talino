import { currencyDigits } from '@/lib/money';
import { toISODate } from '@/lib/dates';

import { DEFAULT_CURRENCY, type ApplicationRow, type GoalRow, type IncomeRow } from '../types';

export type GoalProgress = {
  /** A count, or for income minor units of the goal's currency. */
  current: number;
  /** In the same unit as `current`. */
  target: number;
  /** 0 to 1. */
  fraction: number;
  reached: boolean;
};

type Data = { applications: readonly ApplicationRow[]; income: readonly IncomeRow[] };

const REACHED_INTERVIEW = new Set(['interview', 'offer', 'won']);
const REACHED_OFFER = new Set(['offer', 'won']);

const clientKey = (name: string) => name.trim().toLowerCase();

/**
 * How far a goal has come. Computed every time, never stored, and only from what happened since
 * the goal was set (a goal is about what comes next, not what was already done). The tracker keeps
 * no stage history, so a stage reached is dated by the row's last change (`updated_at`), its
 * closest stand-in; an interview with a date is dated by that.
 */
export function goalProgress(goal: GoalRow, { applications, income }: Data): GoalProgress {
  const startDay = toISODate(new Date(goal.created_at));
  const startAt = goal.created_at;
  const currency = goal.currency ?? DEFAULT_CURRENCY;
  let current = 0;
  let target = Math.max(0, goal.target);

  switch (goal.metric) {
    case 'applications':
      current = applications.filter((row) => row.stage !== 'saved' && (row.applied_on ?? toISODate(new Date(row.created_at))) >= startDay).length;
      break;
    case 'interviews':
      current = applications.filter((row) => {
        if (row.interview_at) return row.interview_at >= startAt;
        return REACHED_INTERVIEW.has(row.stage) && row.updated_at >= startAt;
      }).length;
      break;
    case 'offers':
      current = applications.filter((row) => REACHED_OFFER.has(row.stage) && row.updated_at >= startAt).length;
      break;
    case 'clients': {
      // New clients only: a client already paid before the goal was set isn't a client won since.
      const before = new Set(income.filter((row) => row.received_on < startDay).map((row) => clientKey(row.client)));
      const won = new Set<string>();
      for (const row of applications) if (row.kind === 'freelance' && row.stage === 'won' && row.updated_at >= startAt) won.add(clientKey(row.company));
      for (const row of income) if (row.received_on >= startDay) won.add(clientKey(row.client));
      for (const key of before) won.delete(key);
      won.delete('');
      current = won.size;
      break;
    }
    case 'income':
      // Only money in the goal's own currency counts: amounts are never converted.
      current = income.filter((row) => row.currency === currency && row.received_on >= startDay).reduce((sum, row) => sum + row.amount_minor, 0);
      target = Math.round(target * 10 ** currencyDigits(currency));
      break;
  }

  const fraction = target > 0 ? Math.min(1, current / target) : 0;
  return { current, target, fraction, reached: target > 0 && current >= target };
}
