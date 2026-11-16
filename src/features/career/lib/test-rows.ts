import type { ApplicationRow, IncomeRow } from '../types';

let counter = 0;

/** Test rows with sensible defaults (tests only). */
export function makeApplication(overrides: Partial<ApplicationRow> = {}): ApplicationRow {
  counter += 1;
  return {
    id: `app-${counter}`,
    kind: 'job',
    title: 'Developer',
    company: 'Acme',
    link: null,
    source: null,
    stage: 'applied',
    applied_on: null,
    follow_up_on: null,
    interview_at: null,
    pay: null,
    notes: null,
    created_at: '2026-11-01T00:00:00.000Z',
    updated_at: '2026-11-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeIncome(overrides: Partial<IncomeRow> = {}): IncomeRow {
  counter += 1;
  return { id: `inc-${counter}`, client: 'Acme', application_id: null, amount_minor: 100_00, currency: 'PHP', received_on: '2026-11-12', note: null, created_at: '2026-11-12T00:00:00.000Z', updated_at: '2026-11-12T00:00:00.000Z', ...overrides };
}
