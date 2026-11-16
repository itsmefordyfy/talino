import { describe, expect, test } from '@jest/globals';

import { cosine, findItem, ITEMS, nearest } from './embeddings';
import { forward, getParam, LIMIT, PARAMS, relu, setInput, setParam, sigmoid, START_INPUTS, START_NET, type Net } from './network';
import { applyTemperature, buildGeneration, pick, PROMPT_IDS, roll, TABLES, TEMPERATURES } from './next-token';
import { buildPrompt, CHUNKS, QUESTIONS, QUESTION_IDS, rankChunks, retrieve, vectorText } from './rag';
import { detokenize, MAX_INPUT_CHARS, tokenize, VOCAB, visibleToken } from './tokenizer';

describe('tokenizer illustration', () => {
  test('greedy longest match', () => {
    expect(tokenize('unbelievable').map((t) => t.text)).toEqual(['un', 'believ', 'able']);
    expect(tokenize('tokenization').map((t) => t.text)).toEqual(['token', 'ization']);
    expect(tokenize('The cat is happy.').map((t) => t.text)).toEqual(['The', ' cat', ' is', ' happy', '.']);
  });

  test('joining the tokens always gives back the text (reversible)', () => {
    for (const text of ['', 'hello world', 'The cat is happy.', 'naïve café 😀 ñ', '   spaced   out  ', 'ünïcode', 'a'.repeat(50), 'I like to learn code!']) {
      expect(detokenize(tokenize(text))).toBe(text);
    }
  });

  test('characters outside the vocabulary fall back to single characters', () => {
    const tokens = tokenize('zq');
    expect(tokens.every((token) => token.fallback)).toBe(true);
    expect(tokens.map((token) => token.id)).toEqual([10000 + 'z'.charCodeAt(0), 10000 + 'q'.charCodeAt(0)]);
    expect(tokenize('😀')[0]).toMatchObject({ text: '😀', fallback: true });
  });

  test('no empty tokens, ids are stable and unique per piece, and it is deterministic', () => {
    const tokens = tokenize('The cat is happy and the dog is big.');
    expect(tokens.every((token) => token.text.length > 0)).toBe(true);
    expect(tokenize('The cat')).toEqual(tokenize('The cat'));
    expect(new Set(VOCAB).size).toBe(VOCAB.length);
    expect(tokens.find((token) => token.text === ' cat')?.id).toBe(VOCAB.indexOf(' cat') + 1);
  });

  test('bounded work for huge input', () => {
    expect(tokenize('x'.repeat(100000)).length).toBeLessThanOrEqual(MAX_INPUT_CHARS * 2);
  });

  test('spaces are made visible', () => {
    expect(visibleToken(' cat')).toBe('·cat');
  });
});

describe('next-token illustration', () => {
  test('every probability list sums to 1 and its tokens are in the toy vocabulary', () => {
    for (const id of PROMPT_IDS) {
      const table = TABLES[id];
      for (const list of [table.start, ...Object.values(table.next)]) {
        expect(list.reduce((sum, candidate) => sum + candidate.p, 0)).toBeCloseTo(1, 5);
        for (const candidate of list) if (candidate.token !== '.' && candidate.token !== ',') expect(VOCAB).toContain(candidate.token);
      }
      for (const key of Object.keys(table.next)) if (key !== '.' && key !== ',') expect(VOCAB).toContain(key);
    }
  });

  test('temperature reshapes the distribution for real and keeps the order', () => {
    const base = TABLES.sky.start;
    const cold = applyTemperature(base, 0.2);
    const same = applyTemperature(base, 1);
    const hot = applyTemperature(base, 1.5);
    expect(same.map((c) => c.p)).toEqual(base.map((c) => expect.closeTo(c.p, 6)));
    expect(cold[0].p).toBeGreaterThan(same[0].p);
    expect(hot[0].p).toBeLessThan(same[0].p);
    expect(cold[0].p).toBeGreaterThan(0.99);
    for (const list of [cold, same, hot]) {
      expect(list.reduce((sum, c) => sum + c.p, 0)).toBeCloseTo(1, 6);
      for (let i = 1; i < list.length; i += 1) expect(list[i].p).toBeLessThanOrEqual(list[i - 1].p);
    }
  });

  test('roll is repeatable, in [0, 1), and differs by seed', () => {
    expect(roll(1, 2)).toBe(roll(1, 2));
    expect(roll(1, 2)).not.toBe(roll(2, 2));
    for (let seed = 0; seed < 200; seed += 1) {
      const u = roll(seed, seed % 5);
      expect(u).toBeGreaterThanOrEqual(0);
      expect(u).toBeLessThan(1);
    }
  });

  test('pick follows the cumulative probabilities', () => {
    const list = [{ token: 'a', p: 0.5 }, { token: 'b', p: 0.3 }, { token: 'c', p: 0.2 }];
    expect([0, 0.49, 0.5, 0.79, 0.8, 0.999].map((u) => pick(list, u))).toEqual([0, 0, 1, 1, 2, 2]);
  });

  test('a generation has the five stages in order and always ends', () => {
    for (const id of PROMPT_IDS) {
      for (const temperature of TEMPERATURES) {
        for (let seed = 0; seed < 25; seed += 1) {
          const steps = buildGeneration(id, temperature, seed);
          expect(steps.slice(0, 3).map((step) => step.kind)).toEqual(['input', 'tokens', 'model']);
          expect(steps[steps.length - 1].kind).toBe('output');
          const predicts = steps.filter((step) => step.kind === 'predict');
          expect(predicts.length).toBeGreaterThanOrEqual(1);
          expect(predicts.length).toBeLessThanOrEqual(5);
          const out = steps[steps.length - 1];
          if (out.kind === 'output') expect(out.text.startsWith(TABLES[id].prompt)).toBe(true);
        }
      }
    }
  });

  test('at a low temperature the likeliest token is nearly always chosen', () => {
    let hits = 0;
    for (let seed = 0; seed < 50; seed += 1) {
      const first = buildGeneration('sky', 0.2, seed).find((step) => step.kind === 'predict');
      if (first?.kind === 'predict' && first.candidates[first.chosen].token === ' blue') hits += 1;
    }
    expect(hits).toBe(50);
  });

  test('at a high temperature other tokens get chosen sometimes', () => {
    const firsts = new Set<string>();
    for (let seed = 0; seed < 60; seed += 1) {
      const first = buildGeneration('sky', 1.5, seed).find((step) => step.kind === 'predict');
      if (first?.kind === 'predict') firsts.add(first.candidates[first.chosen].token);
    }
    expect(firsts.size).toBeGreaterThan(2);
  });
});

describe('embeddings', () => {
  test('cosine similarity basics', () => {
    expect(cosine({ x: 1, y: 0 }, { x: 2, y: 0 })).toBeCloseTo(1);
    expect(cosine({ x: 1, y: 0 }, { x: 0, y: 3 })).toBeCloseTo(0);
    expect(cosine({ x: 1, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(-1);
    expect(cosine({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(0);
    // length does not matter, only direction
    expect(cosine({ x: 1, y: 1 }, { x: 5, y: 5 })).toBeCloseTo(1);
  });

  test('nearest neighbors are computed from the coordinates and stay in their group', () => {
    for (const item of ITEMS) {
      const neighbors = nearest(item, ITEMS, 3);
      expect(neighbors).toHaveLength(3);
      expect(neighbors.find((n) => n.item.id === item.id)).toBeUndefined();
      for (let i = 1; i < neighbors.length; i += 1) expect(neighbors[i].similarity).toBeLessThanOrEqual(neighbors[i - 1].similarity);
      // each group has 3 other members, so the 3 nearest are exactly them
      const group = ITEMS.filter((other) => other.group === item.group && other.id !== item.id).map((other) => other.id).sort();
      expect(neighbors.map((n) => n.item.id).sort()).toEqual(group);
    }
    expect(nearest(findItem('cat'))[0].item.group).toBe('animals');
  });

  test('a sentence lands next to its topic', () => {
    expect(nearest(findItem('walk-dog'), ITEMS, 1)[0].item.group).toBe('animals');
    expect(nearest(findItem('fix-bug'), ITEMS, 1)[0].item.group).toBe('tech');
  });

  test.each([264, 300, 340])('labels do not collide on a %d pt chart (so every point can be labelled)', (size) => {
    // The chart draws a point at centre + coordinate * (half - 24) and its label 7 pt to the right.
    const half = size / 2;
    const scale = half - 24;
    const box = (item: (typeof ITEMS)[number]) => ({ left: item.x * scale + 7, right: item.x * scale + 7 + item.label.length * 7.2, top: -item.y * scale - 8, bottom: -item.y * scale + 8 });
    for (let i = 0; i < ITEMS.length; i += 1) {
      for (let j = i + 1; j < ITEMS.length; j += 1) {
        const a = box(ITEMS[i]);
        const b = box(ITEMS[j]);
        const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
        expect(`${ITEMS[i].id}/${ITEMS[j].id}:${overlap}`).toBe(`${ITEMS[i].id}/${ITEMS[j].id}:false`);
      }
    }
    for (const item of ITEMS) expect(half + item.x * scale + 7 + item.label.length * 7.2).toBeLessThanOrEqual(size - 2);
  });

  test('points are inside the unit chart and unique', () => {
    for (const item of ITEMS) expect(Math.hypot(item.x, item.y)).toBeLessThanOrEqual(1);
    expect(new Set(ITEMS.map((item) => item.id)).size).toBe(ITEMS.length);
  });
});

describe('neural network', () => {
  test('activations', () => {
    expect(relu(-2)).toBe(0);
    expect(relu(1.5)).toBe(1.5);
    expect(sigmoid(0)).toBe(0.5);
    expect(sigmoid(10)).toBeGreaterThan(0.999);
    expect(sigmoid(-10)).toBeLessThan(0.001);
  });

  test('forward pass by hand: relu', () => {
    const net: Net = { w: [[1, 2], [3, -1]], b: [0.5, 0], v: [1, 2], c: -1 };
    const result = forward(net, [1, 0.5], 'relu');
    // z1 = 1*1 + 0.5*3 + 0.5 = 3; z2 = 1*2 + 0.5*-1 + 0 = 1.5
    expect(result.z).toEqual([3, 1.5]);
    expect(result.h).toEqual([3, 1.5]);
    // zo = 3*1 + 1.5*2 - 1 = 5
    expect(result.zo).toBe(5);
    expect(result.out).toBeCloseTo(sigmoid(5));
  });

  test('forward pass: relu cuts negatives, sigmoid squashes', () => {
    const net: Net = { w: [[-2, 1], [0, 0]], b: [0, 0], v: [1, 1], c: 0 };
    expect(forward(net, [1, 0], 'relu').h).toEqual([0, 1]);
    const squashed = forward(net, [1, 0], 'sigmoid').h;
    expect(squashed[0]).toBeCloseTo(sigmoid(-2));
    expect(squashed[1]).toBeCloseTo(sigmoid(1));
  });

  test('output is always between 0 and 1', () => {
    for (const a of [0, 0.5, 1]) for (const w of [-3, 0, 3]) {
      const out = forward({ ...START_NET, v: [w, w] }, [a, a], 'relu').out;
      expect(out).toBeGreaterThanOrEqual(0);
      expect(out).toBeLessThanOrEqual(1);
    }
  });

  test('changing a weight changes the output in the expected direction', () => {
    const before = forward(START_NET, START_INPUTS, 'relu').out;
    const after = forward(setParam(START_NET, 'v1', START_NET.v[0] + 1), START_INPUTS, 'relu').out;
    expect(after).toBeGreaterThan(before);
  });

  test('setParam clamps, rounds and never mutates', () => {
    const snapshot = JSON.stringify(START_NET);
    const changed = setParam(START_NET, 'w11', 99);
    expect(getParam(changed, 'w11')).toBe(LIMIT);
    expect(getParam(setParam(START_NET, 'b2', 0.1 + 0.2), 'b2')).toBe(0.3);
    expect(JSON.stringify(START_NET)).toBe(snapshot);
    for (const id of PARAMS) expect(getParam(setParam(START_NET, id, 1.5), id)).toBe(1.5);
    expect(setInput([0.5, 0.5], 0, 5)).toEqual([1, 0.5]);
    expect(setInput([0.5, 0.5], 1, -1)).toEqual([0.5, 0]);
  });
});

describe('RAG', () => {
  test('ranking is computed from the vectors: returns question finds the returns and refunds chunks', () => {
    const top = retrieve(QUESTIONS.returns);
    expect(top.map((r) => r.chunk.title)).toEqual(['Returns', 'Refunds']);
    expect(top[0].similarity).toBeGreaterThan(top[1].similarity);
    expect(top[0].similarity).toBeGreaterThan(0.95);
  });

  test('the shipping question finds the shipping chunks, and the least similar chunk is last', () => {
    expect(retrieve(QUESTIONS.shipping).map((r) => r.chunk.title)).toEqual(['Shipping abroad', 'Delivery']);
    const all = rankChunks(QUESTIONS.shipping);
    expect(all).toHaveLength(CHUNKS.length);
    // the returns chunk points the opposite way from the shipping question
    expect(all[all.length - 1].chunk.title).toBe('Returns');
  });

  test('every question retrieves something relevant and similarities are sorted', () => {
    for (const id of QUESTION_IDS) {
      const ranked = rankChunks(QUESTIONS[id]);
      for (let i = 1; i < ranked.length; i += 1) expect(ranked[i].similarity).toBeLessThanOrEqual(ranked[i - 1].similarity);
    }
  });

  test('the prompt lists numbered sources then the question; with no sources it is just the question', () => {
    const sources = retrieve(QUESTIONS.returns).map((r) => r.chunk);
    const prompt = buildPrompt(QUESTIONS.returns.text, sources, 'Answer using only the sources.');
    expect(prompt[0]).toBe('Answer using only the sources.');
    expect(prompt[1]).toBe(`[1] ${sources[0].text}`);
    expect(prompt[2]).toBe(`[2] ${sources[1].text}`);
    expect(prompt[3]).toBe(`Question: ${QUESTIONS.returns.text}`);
    expect(buildPrompt('Hi?', [], 'x')).toEqual(['Hi?']);
    expect(vectorText({ x: 0.9, y: 0.123 })).toBe('[0.90, 0.12]');
  });
});
