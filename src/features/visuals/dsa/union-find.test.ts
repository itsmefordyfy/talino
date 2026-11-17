import { describe, expect, test } from '@jest/globals';

import { chainState, depthOf, ELEMENTS, findSteps, forestLayout, heightOf, initialState, rootOf, setsOf, unionSteps, type UFCounters, type UFOptions, type UFState } from './union-find';
import { seededRandom } from './sorting';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const none: UFOptions = { compress: false, bySize: false };
const both: UFOptions = { compress: true, bySize: true };

/** A naive model: every element carries a set label, and a union relabels one whole set. */
class Naive {
  label = Array.from({ length: ELEMENTS }, (_, i) => i);
  union(a: number, b: number) {
    const from = this.label[a]!;
    const to = this.label[b]!;
    this.label = this.label.map((l) => (l === from ? to : l));
  }
  sets(): number[][] {
    const groups = new Map<number, number[]>();
    this.label.forEach((l, x) => groups.set(l, [...(groups.get(l) ?? []), x]));
    return [...groups.values()].sort((p, q) => p[0]! - q[0]!);
  }
}

describe('union-find structure helpers', () => {
  test('a new forest is eight singletons; the chain is one tall tree', () => {
    expect(setsOf(initialState().parent)).toHaveLength(ELEMENTS);
    const chain = chainState();
    expect(setsOf(chain.parent)).toEqual([[0, 1, 2, 3, 4, 5, 6, 7]]);
    expect(depthOf(chain.parent, 0)).toBe(7);
    expect(heightOf(chain.parent)).toBe(7);
    expect(rootOf(chain.parent, 3)).toBe(7);
  });

  test('forest layout puts every element on its own level and parents above children', () => {
    const { points, slots, levels } = forestLayout(chainState().parent);
    expect(levels).toBe(8);
    expect(slots).toBe(1);
    points.forEach((p, x) => expect(p.y).toBe(7 - x));
    const wide = forestLayout([0, 0, 0, 3, 3, 5, 6, 7]);
    // Roots 0, 3, 5, 6 and 7: leaves 1 and 2, 4, 5, 6 and 7.
    expect(wide.slots).toBe(6);
    const parentY = (x: number) => wide.points[[0, 0, 0, 3, 3, 5, 6, 7][x]!]!.y;
    for (let x = 0; x < ELEMENTS; x += 1) if ([0, 0, 0, 3, 3, 5, 6, 7][x] !== x) expect(wide.points[x]!.y).toBe(parentY(x) + 1);
  });
});

describe('find', () => {
  test('without compression it counts one hop per level and changes nothing', () => {
    const run = findSteps(chainState(), 0, none);
    expect(run.hops).toBe(7);
    expect(run.rewires).toBe(0);
    expect(run.state.parent).toEqual(chainState().parent);
    expect(last(run.steps).root).toBe(7);
    expect(last(run.steps).hops).toBe(7);
  });

  test('with compression the whole path points at the root afterwards, and the next find is one hop', () => {
    const first = findSteps(chainState(), 0, { compress: true, bySize: false });
    expect(first.hops).toBe(7);
    // 0 to 5 are rewired; 6 already pointed at the root 7.
    expect(first.rewires).toBe(6);
    expect(first.state.parent).toEqual([7, 7, 7, 7, 7, 7, 7, 7]);
    const second = findSteps(first.state, 0, { compress: true, bySize: false }, { hops: first.hops, rewires: first.rewires });
    expect(second.hops - first.hops).toBe(1);
    expect(second.rewires).toBe(first.rewires);
  });

  test('finding a root costs no hops; counters start from the base given', () => {
    const run = findSteps(initialState(), 3, both, { hops: 10, rewires: 4 });
    expect(run.hops).toBe(10);
    expect(run.steps[0]!.hops).toBe(10);
    expect(last(run.steps).rewires).toBe(4);
  });

  test('does not mutate the state it was given', () => {
    const state = chainState();
    findSteps(state, 0, both);
    unionSteps(state, 0, 3, both);
    expect(state).toEqual(chainState());
  });
});

describe('union', () => {
  test('joining two singletons by size hangs the first under the second on a tie', () => {
    const run = unionSteps(initialState(), 2, 5, both);
    expect(run.state.parent[2]).toBe(5);
    expect(run.state.size[5]).toBe(2);
    expect(last(run.steps).linked).toBeNull();
    expect(run.steps.some((step) => step.linked !== null)).toBe(true);
  });

  test('union by size hangs the smaller tree under the bigger one', () => {
    let state: UFState = initialState();
    state = unionSteps(state, 0, 1, both).state;
    state = unionSteps(state, 1, 2, both).state; // {0,1} is bigger than {2}, so 2 goes under 1's root
    expect(rootOf(state.parent, 2)).toBe(rootOf(state.parent, 0));
    expect(state.size[rootOf(state.parent, 0)]).toBe(3);
    expect(heightOf(state.parent)).toBe(1);
  });

  test('without union by size the first root always goes under the second', () => {
    let state: UFState = initialState();
    state = unionSteps(state, 0, 1, none).state;
    state = unionSteps(state, 1, 2, none).state;
    state = unionSteps(state, 2, 3, none).state;
    expect(depthOf(state.parent, 0)).toBe(3);
  });

  test('two elements already in one set change nothing', () => {
    const joined = unionSteps(initialState(), 0, 1, none).state;
    const run = unionSteps(joined, 1, 0, none);
    expect(run.state).toEqual(joined);
    expect(run.steps.some((step) => step.linked !== null)).toBe(false);
  });

  test('sets always match a naive model, for every option combination and many random operations', () => {
    const random = seededRandom(33);
    for (let trial = 0; trial < 150; trial += 1) {
      const options: UFOptions = { compress: trial % 2 === 0, bySize: trial % 4 < 2 };
      let state: UFState = initialState();
      let counters: UFCounters = { hops: 0, rewires: 0 };
      const naive = new Naive();
      for (let op = 0; op < 25; op += 1) {
        const a = Math.floor(random() * ELEMENTS);
        const b = Math.floor(random() * ELEMENTS);
        if (random() < 0.6) {
          const run = unionSteps(state, a, b, options, counters);
          state = run.state;
          counters = { hops: run.hops, rewires: run.rewires };
          naive.union(a, b);
        } else {
          const expectedRoot = rootOf(state.parent, a);
          const run = findSteps(state, a, options, counters);
          expect(last(run.steps).root).toBe(expectedRoot);
          // A find never changes which set anything is in.
          expect(setsOf(run.state.parent)).toEqual(setsOf(state.parent));
          state = run.state;
          counters = { hops: run.hops, rewires: run.rewires };
        }
        expect(setsOf(state.parent)).toEqual(naive.sets());
        // Root sizes always equal the real set sizes.
        for (const set of naive.sets()) expect(state.size[rootOf(state.parent, set[0]!)]).toBe(set.length);
      }
    }
  });

  test('union by size keeps every tree at most log2(n) tall', () => {
    const random = seededRandom(2);
    for (let trial = 0; trial < 100; trial += 1) {
      let state: UFState = initialState();
      for (let op = 0; op < 30; op += 1) state = unionSteps(state, Math.floor(random() * ELEMENTS), Math.floor(random() * ELEMENTS), { compress: false, bySize: true }).state;
      expect(heightOf(state.parent)).toBeLessThanOrEqual(Math.log2(ELEMENTS));
    }
  });

  test('hops only go up through the steps, and the last step carries the totals', () => {
    const run = unionSteps(chainState(), 0, 3, { compress: true, bySize: true });
    let hops = 0;
    for (const step of run.steps) {
      expect(step.hops).toBeGreaterThanOrEqual(hops);
      hops = step.hops;
    }
    expect(last(run.steps).hops).toBe(run.hops);
    expect(last(run.steps).rewires).toBe(run.rewires);
  });
});
