import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { deleteApplication, deleteGoal, deleteIncome, readApplications, readCareerCounts, readGoals, readIncome, saveApplication, saveGoal, saveIncome, type ApplicationInput } from './career-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const application = (overrides: Partial<ApplicationInput> = {}): ApplicationInput => ({
  id: 'a1',
  kind: 'job',
  title: ' Frontend Developer ',
  company: 'Acme',
  link: '',
  source: 'linkedin',
  stage: 'applied',
  appliedOn: '2026-11-10',
  followUpOn: null,
  interviewAt: null,
  pay: null,
  notes: '  ',
  ...overrides,
});

describe('applications', () => {
  test('saving the same id twice keeps one row, updated, with its first created_at', async () => {
    await saveApplication(db, application());
    const [first] = await readApplications(db);
    expect(first).toMatchObject({ title: 'Frontend Developer', link: null, notes: null, stage: 'applied' });
    await saveApplication(db, application({ stage: 'interview' }));
    const rows = await readApplications(db);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ stage: 'interview', created_at: first.created_at });
  });

  test('deleting keeps its income, unlinked', async () => {
    await saveApplication(db, application());
    await saveIncome(db, { id: 'i1', client: 'Acme', amountMinor: 5_000_00, currency: 'PHP', receivedOn: '2026-11-12', applicationId: 'a1', note: null });
    await deleteApplication(db, 'a1');
    expect(await readApplications(db)).toEqual([]);
    expect((await readIncome(db))[0]).toMatchObject({ id: 'i1', application_id: null });
  });
});

describe('income and goals', () => {
  test('save, update by id, delete', async () => {
    await saveIncome(db, { id: 'i1', client: ' Bea ', amountMinor: 100, currency: 'PHP', receivedOn: '2026-11-12', applicationId: null, note: '' });
    await saveIncome(db, { id: 'i1', client: 'Bea', amountMinor: 200, currency: 'PHP', receivedOn: '2026-11-12', applicationId: null, note: 'Logo' });
    expect(await readIncome(db)).toEqual([expect.objectContaining({ client: 'Bea', amount_minor: 200, note: 'Logo' })]);
    await deleteIncome(db, 'i1');
    expect(await readIncome(db)).toEqual([]);

    await saveGoal(db, { id: 'g1', title: 'First client', metric: 'clients', target: 1, currency: null, dueOn: '2027-03-31' });
    expect(await readGoals(db)).toEqual([expect.objectContaining({ title: 'First client', metric: 'clients', target: 1, due_on: '2027-03-31' })]);
    await deleteGoal(db, 'g1');
    expect(await readGoals(db)).toEqual([]);
  });
});

describe('readCareerCounts', () => {
  test('counts every row', async () => {
    expect(await readCareerCounts(db)).toEqual({ applications: 0, interviews: 0, wins: 0, incomeEntries: 0 });
    await saveApplication(db, application({ id: 'a1', stage: 'saved' }));
    await saveApplication(db, application({ id: 'a2', stage: 'applied', interviewAt: '2026-11-20T06:00:00.000Z' }));
    await saveApplication(db, application({ id: 'a3', stage: 'offer' }));
    await saveApplication(db, application({ id: 'a4', kind: 'freelance', stage: 'won' }));
    await saveApplication(db, application({ id: 'a5', stage: 'closed' }));
    await saveIncome(db, { id: 'i1', client: 'Bea', amountMinor: 100, currency: 'PHP', receivedOn: '2026-11-12', applicationId: 'a4', note: null });
    expect(await readCareerCounts(db)).toEqual({ applications: 5, interviews: 3, wins: 1, incomeEntries: 1 });
  });
});
