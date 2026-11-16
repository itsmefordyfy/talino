import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { clearPortfolioState, parsePortfolioOptions, parsePortfolioState, readPortfolioOptions, readPortfolioState, savePortfolioOptions, savePortfolioState, type PortfolioState } from './portfolio-state';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const state: PortfolioState = { slug: 'ana-cruz-ab12', editToken: 'a'.repeat(32), talent: true, contactEmail: 'ana@example.com', publishedAt: '2026-11-13T00:00:00.000Z' };

describe('portfolio state', () => {
  test('nothing saved reads as not published', async () => {
    expect(await readPortfolioState(db)).toBeNull();
  });

  test('saved, updated in place, then cleared', async () => {
    await savePortfolioState(db, state);
    await savePortfolioState(db, { ...state, talent: false });
    expect(await readPortfolioState(db)).toEqual({ ...state, talent: false });
    expect(await db.getAllAsync("SELECT key FROM app_state WHERE key = 'portfolio'")).toHaveLength(1);
    await clearPortfolioState(db);
    expect(await readPortfolioState(db)).toBeNull();
  });

  test('a damaged or incomplete value is not trusted', () => {
    expect(parsePortfolioState('not json')).toBeNull();
    expect(parsePortfolioState(JSON.stringify({ slug: 'x' }))).toBeNull();
    expect(parsePortfolioState(JSON.stringify({ slug: 'x', editToken: 't', talent: 'yes' }))).toEqual({ slug: 'x', editToken: 't', talent: false, contactEmail: '', publishedAt: '' });
  });
});

describe('portfolio options', () => {
  test('the picture is off until the learner turns it on, and the choice is kept', async () => {
    expect(await readPortfolioOptions(db)).toEqual({ showPhoto: false });
    await savePortfolioOptions(db, { showPhoto: true });
    expect(await readPortfolioOptions(db)).toEqual({ showPhoto: true });
    await savePortfolioOptions(db, { showPhoto: false });
    expect(await readPortfolioOptions(db)).toEqual({ showPhoto: false });
  });

  test('a damaged value reads as off', () => {
    expect(parsePortfolioOptions('{')).toEqual({ showPhoto: false });
    expect(parsePortfolioOptions('{"showPhoto":"yes"}')).toEqual({ showPhoto: false });
    expect(parsePortfolioOptions(null)).toEqual({ showPhoto: false });
  });
});
