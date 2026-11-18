import { describe, expect, test } from '@jest/globals';

import { softmax } from './llm-math';
import { CANDIDATE_COUNT, DEFAULT_SETTINGS, DRAWS, drawSeed, drawTokens, factsOf, SAMPLING_LOGITS, SAMPLING_PROMPT_IDS, sampleTable, tally, type SamplingSettings } from './llm-sampling';

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);
const run = (id: (typeof SAMPLING_PROMPT_IDS)[number], settings: Partial<SamplingSettings>) => sampleTable(SAMPLING_LOGITS[id], { ...DEFAULT_SETTINGS, ...settings });

describe('the tables', () => {
  test('every prompt has ten scores, highest first', () => {
    for (const id of SAMPLING_PROMPT_IDS) {
      expect(SAMPLING_LOGITS[id]).toHaveLength(CANDIDATE_COUNT);
      for (let i = 1; i < CANDIDATE_COUNT; i += 1) expect(SAMPLING_LOGITS[id][i]).toBeLessThan(SAMPLING_LOGITS[id][i - 1]);
    }
  });
});

describe('temperature', () => {
  test('with no filters and temperature 1, the final probabilities are the plain softmax and add up to 1', () => {
    const table = run('learn', {});
    const plain = softmax(SAMPLING_LOGITS.learn);
    table.forEach((candidate, index) => expect(candidate.final).toBeCloseTo(plain[index], 10));
    expect(sum(table.map((candidate) => candidate.final))).toBeCloseTo(1, 10);
    expect(table.every((candidate) => candidate.kept && candidate.outBy === null)).toBe(true);
  });

  test('a low temperature approaches greedy and a high one flattens', () => {
    const base = run('learn', {})[0].final;
    expect(run('learn', { temperature: 0.2 })[0].final).toBeGreaterThan(base);
    expect(run('learn', { temperature: 0.01 })[0].final).toBeGreaterThan(0.999);
    expect(run('learn', { temperature: 0 })[0].final).toBe(1);
    expect(run('learn', { temperature: 2 })[0].final).toBeLessThan(base);
    expect(run('learn', { temperature: 50 })[0].final).toBeLessThan(0.12);
  });

  test('the order of the tokens stays the same at every temperature', () => {
    for (const temperature of [0.2, 0.7, 1, 1.5, 2]) {
      const table = run('story', { temperature });
      for (let i = 1; i < table.length; i += 1) expect(table[i].final).toBeLessThanOrEqual(table[i - 1].final);
    }
  });
});

describe('top-k', () => {
  test('keeps exactly the k most likely, drops the rest as top-k, and renormalises', () => {
    const table = run('learn', { topK: 3 });
    expect(table.filter((candidate) => candidate.kept).map((candidate) => candidate.index)).toEqual([0, 1, 2]);
    expect(table.filter((candidate) => candidate.outBy === 'top-k')).toHaveLength(7);
    expect(sum(table.map((candidate) => candidate.final))).toBeCloseTo(1, 10);
    expect(table[3].final).toBe(0);
    // The kept ones keep their relative sizes.
    expect(table[0].final / table[1].final).toBeCloseTo(table[0].tempProb / table[1].tempProb, 10);
  });

  test('k = 1 is greedy, and k beyond the table or below 1 is clamped', () => {
    expect(run('capital', { topK: 1 })[0].final).toBe(1);
    expect(run('capital', { topK: 99 }).every((candidate) => candidate.kept)).toBe(true);
    expect(run('capital', { topK: 0 }).filter((candidate) => candidate.kept)).toHaveLength(1);
  });
});

describe('top-p', () => {
  test('keeps the smallest set of top tokens whose probability reaches p', () => {
    const base = softmax(SAMPLING_LOGITS.learn);
    const p = base[0] + base[1] - 0.001; // reached with the second token
    const table = run('learn', { topP: p });
    expect(table.filter((candidate) => candidate.kept).map((candidate) => candidate.index)).toEqual([0, 1]);
    expect(table.filter((candidate) => candidate.outBy === 'top-p')).toHaveLength(8);
    expect(sum(table.map((candidate) => candidate.final))).toBeCloseTo(1, 10);
  });

  test('a tiny p still keeps the top token, and p = 1 keeps everything', () => {
    for (const id of SAMPLING_PROMPT_IDS) {
      const tiny = sampleTable(SAMPLING_LOGITS[id], { ...DEFAULT_SETTINGS, topP: 0.0001 });
      expect(tiny.filter((candidate) => candidate.kept)).toHaveLength(1);
      expect(tiny[0].final).toBe(1);
      expect(sampleTable(SAMPLING_LOGITS[id], { ...DEFAULT_SETTINGS, topP: 1 }).every((candidate) => candidate.kept)).toBe(true);
    }
  });

  test('when one token already covers p, only it stays (Paris at 0.9)', () => {
    const table = run('capital', { topP: 0.9 });
    expect(table.filter((candidate) => candidate.kept)).toHaveLength(1);
  });

  test('top-p works on what top-k left: both reasons can show at once', () => {
    const table = run('story', { topK: 6, topP: 0.5 });
    const reasons = new Set(table.map((candidate) => candidate.outBy));
    expect(reasons.has('top-k')).toBe(true);
    expect(reasons.has('top-p')).toBe(true);
    expect(sum(table.map((candidate) => candidate.final))).toBeCloseTo(1, 10);
    // a token dropped by top-k is always less likely than one dropped by top-p
    const maxK = Math.max(...table.filter((candidate) => candidate.outBy === 'top-k').map((candidate) => candidate.tempProb));
    const minP = Math.min(...table.filter((candidate) => candidate.outBy === 'top-p').map((candidate) => candidate.tempProb));
    expect(maxK).toBeLessThanOrEqual(minP);
  });

  test('the kept tokens always cover at least p of the renormalised top-k mass', () => {
    for (const topP of [0.1, 0.3, 0.5, 0.75, 0.95]) {
      const table = run('story', { topP, topK: 8 });
      const keptMass = sum(table.filter((candidate) => candidate.kept).map((candidate) => candidate.tempProb));
      const kMass = sum(table.filter((candidate) => candidate.rank < 8).map((candidate) => candidate.tempProb));
      expect(keptMass / kMass).toBeGreaterThanOrEqual(topP - 1e-9);
    }
  });
});

describe('facts', () => {
  test('say what the settings did', () => {
    const sharper = factsOf(SAMPLING_LOGITS.learn, { ...DEFAULT_SETTINGS, temperature: 0.5, topK: 4 });
    expect(sharper).toMatchObject({ topIndex: 0, temperatureEffect: 'sharper', keptCount: 4, outByK: 6, outByP: 0 });
    expect(sharper.topFinal).toBeGreaterThan(sharper.topAtOne);
    expect(factsOf(SAMPLING_LOGITS.learn, { ...DEFAULT_SETTINGS, temperature: 1.5 }).temperatureEffect).toBe('flatter');
    expect(factsOf(SAMPLING_LOGITS.learn, DEFAULT_SETTINGS).temperatureEffect).toBe('same');
  });
});

describe('seeded draws', () => {
  const finals = run('learn', {}).map((candidate) => candidate.final);

  test('the same seed gives the same draws, a different press gives different ones', () => {
    expect(drawTokens(finals, DRAWS, drawSeed(0, 1))).toEqual(drawTokens(finals, DRAWS, drawSeed(0, 1)));
    expect(drawTokens(finals, DRAWS, drawSeed(0, 1))).not.toEqual(drawTokens(finals, DRAWS, drawSeed(0, 2)));
    expect(drawSeed(0, 1)).not.toBe(drawSeed(1, 1));
    expect(drawTokens(finals, DRAWS, drawSeed(0, 1))).toHaveLength(DRAWS);
  });

  test('never picks a dropped token, and one survivor is always picked', () => {
    const table = run('learn', { topK: 3 }).map((candidate) => candidate.final);
    for (let press = 1; press < 40; press += 1) for (const pick of drawTokens(table, DRAWS, drawSeed(0, press))) expect(pick).toBeLessThan(3);
    expect(new Set(drawTokens(run('capital', { topK: 1 }).map((candidate) => candidate.final), 25, 5))).toEqual(new Set([0]));
  });

  test('over many draws the frequencies follow the probabilities', () => {
    const picks = drawTokens(finals, 20000, 99);
    const counts = tally(picks, finals.length);
    counts.forEach((count, index) => expect(count / 20000).toBeCloseTo(finals[index], 1));
    expect(sum(counts)).toBe(20000);
  });

  test('nothing possible draws nothing', () => {
    expect(drawTokens([0, 0], 5, 1)).toEqual([]);
  });
});
