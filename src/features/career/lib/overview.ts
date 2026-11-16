import { addDays } from '@/lib/dates';

import { ACTIVE_STAGES, STAGES, type ApplicationRow, type IncomeRow, type Stage } from '../types';

export function stageCounts(applications: readonly ApplicationRow[]): Record<Stage, number> {
  const counts = Object.fromEntries(STAGES.map((stage) => [stage, 0])) as Record<Stage, number>;
  for (const row of applications) if (row.stage in counts) counts[row.stage] += 1;
  return counts;
}

export type ComingUpItem =
  | { type: 'follow-up'; application: ApplicationRow; day: string; overdue: boolean }
  | { type: 'interview'; application: ApplicationRow; at: string };

/** How far ahead "Coming up" looks for follow-ups. */
export const FOLLOW_UP_WINDOW_DAYS = 7;

/**
 * What needs the owner soon: follow-ups due within a week or already overdue, and interviews from
 * today on, for applications still in play. Interviews first by time, then follow-ups by day.
 */
export function comingUp(applications: readonly ApplicationRow[], now: Date, today: string): ComingUpItem[] {
  const horizon = addDays(today, FOLLOW_UP_WINDOW_DAYS);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const active = applications.filter((row) => ACTIVE_STAGES.includes(row.stage));
  const interviews: ComingUpItem[] = active
    .filter((row) => row.interview_at !== null && row.interview_at >= dayStart)
    .sort((a, b) => (a.interview_at ?? '').localeCompare(b.interview_at ?? ''))
    .map((application) => ({ type: 'interview', application, at: application.interview_at ?? '' }));
  const followUps: ComingUpItem[] = active
    .filter((row) => row.follow_up_on !== null && row.follow_up_on <= horizon)
    .sort((a, b) => (a.follow_up_on ?? '').localeCompare(b.follow_up_on ?? ''))
    .map((application) => ({ type: 'follow-up', application, day: application.follow_up_on ?? '', overdue: (application.follow_up_on ?? '') < today }));
  return [...interviews, ...followUps];
}

export type MoneyTotal = { currency: string; minor: number };
export type ClientTotal = { client: string; currency: string; minor: number; count: number };

/**
 * Income received in a period: a total per currency (amounts are never converted), largest first,
 * and each client's total, largest first. A client's name groups regardless of case and spaces.
 */
export function incomeSummary(income: readonly IncomeRow[], from: string, to: string): { totals: MoneyTotal[]; clients: ClientTotal[]; entries: IncomeRow[] } {
  const entries = income.filter((row) => row.received_on >= from && row.received_on <= to);
  const totals = new Map<string, number>();
  const clients = new Map<string, ClientTotal>();
  for (const row of entries) {
    totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.amount_minor);
    const key = `${row.client.trim().toLowerCase()}|${row.currency}`;
    const entry = clients.get(key) ?? { client: row.client.trim(), currency: row.currency, minor: 0, count: 0 };
    entry.minor += row.amount_minor;
    entry.count += 1;
    clients.set(key, entry);
  }
  return {
    totals: [...totals].map(([currency, minor]) => ({ currency, minor })).sort((a, b) => b.minor - a.minor),
    clients: [...clients.values()].sort((a, b) => b.minor - a.minor),
    entries: [...entries].sort((a, b) => b.received_on.localeCompare(a.received_on) || b.created_at.localeCompare(a.created_at)),
  };
}

/** The first and last day of `today`'s month. */
export function monthRange(today: string): { from: string; to: string } {
  const from = `${today.slice(0, 7)}-01`;
  const [year, month] = today.split('-').map(Number);
  const last = new Date(year, month, 0).getDate();
  return { from, to: `${today.slice(0, 7)}-${String(last).padStart(2, '0')}` };
}
