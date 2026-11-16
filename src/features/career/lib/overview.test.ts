import { describe, expect, test } from '@jest/globals';

import { comingUp, incomeSummary, monthRange, stageCounts } from './overview';
import { makeApplication, makeIncome } from './test-rows';

const NOW = new Date(2026, 10, 13, 10, 0);
const TODAY = '2026-11-13';

describe('stageCounts', () => {
  test('every stage, zero when empty', () => {
    expect(stageCounts([makeApplication({ stage: 'applied' }), makeApplication({ stage: 'applied' }), makeApplication({ stage: 'won' })])).toEqual({ saved: 0, applied: 2, interview: 0, offer: 0, won: 1, closed: 0 });
  });
});

describe('comingUp', () => {
  test('interviews from today on, then follow-ups due within a week or overdue, active only', () => {
    const later = makeApplication({ interview_at: new Date(2026, 10, 15, 14, 0).toISOString() });
    const earlierToday = makeApplication({ interview_at: new Date(2026, 10, 13, 8, 0).toISOString() });
    const past = makeApplication({ interview_at: new Date(2026, 10, 12, 8, 0).toISOString() });
    const overdue = makeApplication({ follow_up_on: '2026-11-10' });
    const soon = makeApplication({ follow_up_on: '2026-11-20' });
    const far = makeApplication({ follow_up_on: '2026-11-21' });
    const closed = makeApplication({ stage: 'closed', follow_up_on: '2026-11-14' });
    const items = comingUp([later, earlierToday, past, overdue, soon, far, closed], NOW, TODAY);
    expect(items.map((item) => [item.type, item.application.id])).toEqual([
      ['interview', earlierToday.id],
      ['interview', later.id],
      ['follow-up', overdue.id],
      ['follow-up', soon.id],
    ]);
    expect(items[2]).toMatchObject({ overdue: true });
    expect(items[3]).toMatchObject({ overdue: false });
  });
});

describe('incomeSummary', () => {
  test('totals per currency and per client in the period, entries newest first', () => {
    const rows = [
      makeIncome({ client: 'Acme', amount_minor: 1_000_00, received_on: '2026-11-02' }),
      makeIncome({ client: ' acme', amount_minor: 500_00, received_on: '2026-11-10' }),
      makeIncome({ client: 'Beta', amount_minor: 2_000_00, received_on: '2026-11-05' }),
      makeIncome({ client: 'Beta', amount_minor: 50_00, currency: 'USD', received_on: '2026-11-06' }),
      makeIncome({ client: 'Old', amount_minor: 9_999_00, received_on: '2026-10-31' }),
    ];
    const summary = incomeSummary(rows, '2026-11-01', '2026-11-30');
    expect(summary.totals).toEqual([
      { currency: 'PHP', minor: 3_500_00 },
      { currency: 'USD', minor: 50_00 },
    ]);
    expect(summary.clients.map((client) => [client.client, client.currency, client.minor, client.count])).toEqual([
      ['Beta', 'PHP', 2_000_00, 1],
      ['Acme', 'PHP', 1_500_00, 2],
      ['Beta', 'USD', 50_00, 1],
    ]);
    expect(summary.entries.map((entry) => entry.received_on)).toEqual(['2026-11-10', '2026-11-06', '2026-11-05', '2026-11-02']);
  });

  test('monthRange', () => {
    expect(monthRange('2026-02-14')).toEqual({ from: '2026-02-01', to: '2026-02-28' });
    expect(monthRange('2026-12-31')).toEqual({ from: '2026-12-01', to: '2026-12-31' });
  });
});
