import { describe, expect, test } from '@jest/globals';

import type { ApplicationRow, GoalRow, IncomeRow } from '../types';
import { goalProgress } from './goal-progress';

const START = new Date(2026, 10, 10, 12, 0).toISOString();
const BEFORE = new Date(2026, 10, 1, 12, 0).toISOString();
const AFTER = new Date(2026, 10, 12, 12, 0).toISOString();

const goal = (overrides: Partial<GoalRow>): GoalRow => ({ id: 'g', title: 'Goal', metric: 'applications', target: 5, currency: null, due_on: null, done_at: null, created_at: START, updated_at: START, ...overrides });

const app = (overrides: Partial<ApplicationRow>): ApplicationRow => ({
  id: Math.random().toString(36),
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
  created_at: AFTER,
  updated_at: AFTER,
  ...overrides,
});

const pay = (overrides: Partial<IncomeRow>): IncomeRow => ({ id: Math.random().toString(36), client: 'Acme', application_id: null, amount_minor: 100_00, currency: 'PHP', received_on: '2026-11-12', note: null, created_at: AFTER, updated_at: AFTER, ...overrides });

describe('goalProgress', () => {
  test('applications sent since the goal, not saved ones or older ones', () => {
    const rows = [app({ applied_on: '2026-11-11' }), app({ applied_on: '2026-11-05' }), app({ stage: 'saved' }), app({ stage: 'interview' })];
    expect(goalProgress(goal({ target: 4 }), { applications: rows, income: [] })).toEqual({ current: 2, target: 4, fraction: 0.5, reached: false });
  });

  test('interviews: a dated interview counts by its date, otherwise by the stage reached', () => {
    const rows = [app({ interview_at: AFTER }), app({ interview_at: BEFORE, stage: 'interview' }), app({ stage: 'offer' }), app({ stage: 'interview', updated_at: BEFORE }), app({ stage: 'applied' })];
    expect(goalProgress(goal({ metric: 'interviews', target: 2 }), { applications: rows, income: [] })).toMatchObject({ current: 2, fraction: 1, reached: true });
  });

  test('offers or wins', () => {
    const rows = [app({ stage: 'offer' }), app({ stage: 'won' }), app({ stage: 'won', updated_at: BEFORE }), app({ stage: 'closed' })];
    expect(goalProgress(goal({ metric: 'offers', target: 3 }), { applications: rows, income: [] }).current).toBe(2);
  });

  test('clients won: new clients from gigs won and money received, counted once each', () => {
    const rows = [app({ kind: 'freelance', stage: 'won', company: 'Beta Co' }), app({ kind: 'job', stage: 'won', company: 'Job Inc' }), app({ kind: 'freelance', stage: 'won', company: 'Old', updated_at: BEFORE })];
    const income = [pay({ client: 'beta co ' }), pay({ client: 'Gamma' }), pay({ client: 'Repeat', received_on: '2026-11-01' }), pay({ client: 'Repeat' })];
    expect(goalProgress(goal({ metric: 'clients', target: 1 }), { applications: rows, income })).toMatchObject({ current: 2, fraction: 1, reached: true });
  });

  test('income in the goal currency since the goal, target in major units', () => {
    const income = [pay({ amount_minor: 2_500_00 }), pay({ amount_minor: 1_000_00, currency: 'USD' }), pay({ amount_minor: 9_000_00, received_on: '2026-11-09' })];
    expect(goalProgress(goal({ metric: 'income', target: 10_000, currency: 'PHP' }), { applications: [], income })).toEqual({ current: 2_500_00, target: 10_000_00, fraction: 0.25, reached: false });
  });

  test('a zero target is never reached and never divides by zero', () => {
    expect(goalProgress(goal({ target: 0 }), { applications: [app({})], income: [] })).toMatchObject({ fraction: 0, reached: false });
  });
});
