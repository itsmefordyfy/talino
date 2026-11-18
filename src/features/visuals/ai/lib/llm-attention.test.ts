import { describe, expect, test } from '@jest/globals';

import { ATTENTION_HEAD_IDS, ATTENTION_SENTENCE_IDS, attentionFor, blendOf, defaultQuery, isValidQuery, rankRows, sentenceLength } from './llm-attention';

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

describe('attention weights', () => {
  test('for every sentence, head and query the weights add up to 1 and the percents to exactly 100', () => {
    for (const id of ATTENTION_SENTENCE_IDS) {
      for (const head of ATTENTION_HEAD_IDS) {
        for (let query = 0; query < sentenceLength(id); query += 1) {
          const rows = attentionFor(id, head, query);
          expect(rows).toHaveLength(sentenceLength(id) - 1);
          expect(rows.some((row) => row.index === query)).toBe(false);
          expect(sum(rows.map((row) => row.weight))).toBeCloseTo(1, 10);
          expect(sum(rows.map((row) => row.percent))).toBe(100);
          for (const row of rows) expect(Number.isFinite(row.weight)).toBe(true);
        }
      }
    }
  });

  test('the order of the weights follows the order of the scores', () => {
    for (const id of ATTENTION_SENTENCE_IDS) {
      for (const head of ATTENTION_HEAD_IDS) {
        for (let query = 0; query < sentenceLength(id); query += 1) {
          const rows = attentionFor(id, head, query);
          for (const a of rows) for (const b of rows) if (a.score > b.score) expect(a.weight).toBeGreaterThan(b.weight);
        }
      }
    }
  });

  test('"it" looks mostly at "trophy" in the links head, and the heads disagree', () => {
    const query = defaultQuery('trophy');
    expect(query).toBe(9);
    const links = rankRows(attentionFor('trophy', 'links', query));
    expect(links[0].index).toBe(1);
    expect(links[0].percent).toBeGreaterThan(50);
    const nearby = rankRows(attentionFor('trophy', 'nearby', query));
    expect([8, 10]).toContain(nearby[0].index);
    expect(nearby[0].index).not.toBe(links[0].index);
  });

  test('"it" in the animal sentence looks at "animal", and "bank" looks at "river"', () => {
    expect(rankRows(attentionFor('animal', 'links', defaultQuery('animal')))[0].index).toBe(1);
    expect(rankRows(attentionFor('bank', 'links', defaultQuery('bank')))[0].index).toBe(7);
  });

  test('the nearby head gives more to closer words', () => {
    const rows = attentionFor('trophy', 'nearby', 6);
    const byIndex = (index: number) => rows.find((row) => row.index === index)?.weight ?? 0;
    expect(byIndex(5)).toBeGreaterThan(byIndex(4));
    expect(byIndex(4)).toBeGreaterThan(byIndex(3));
    expect(byIndex(3)).toBeGreaterThan(byIndex(0));
  });

  test('a query outside the sentence gives nothing', () => {
    expect(isValidQuery('trophy', 13)).toBe(false);
    expect(isValidQuery('trophy', -1)).toBe(false);
    expect(isValidQuery('trophy', 1.5)).toBe(false);
    expect(attentionFor('trophy', 'links', 99)).toEqual([]);
  });
});

describe('the blend', () => {
  test('lists the biggest contributions and what is left over adds up to 100', () => {
    const rows = attentionFor('trophy', 'links', 9);
    const blend = blendOf(rows);
    expect(blend.top).toHaveLength(3);
    expect(blend.top[0].index).toBe(1);
    expect(sum(blend.top.map((row) => row.percent)) + blend.restPercent).toBe(100);
    expect(blend.restCount).toBe(rows.length - 3);
  });

  test('asking for more than there are leaves nothing over', () => {
    const blend = blendOf(attentionFor('bank', 'nearby', 4), 99);
    expect(blend.restCount).toBe(0);
    expect(blend.restPercent).toBe(0);
  });
});
