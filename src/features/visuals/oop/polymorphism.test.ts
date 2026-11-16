import { describe, expect, test } from '@jest/globals';

import { buildPolymorphismSteps, defaultItems, FAMILIES, type Item } from './polymorphism';

const shapes = FAMILIES[0]!;
const animals = FAMILIES[1]!;
const last = <T>(items: readonly T[]) => items[items.length - 1]!;

describe('polymorphism', () => {
  test('one call gives a different answer from each class', () => {
    const items: Item[] = [{ key: 1, kind: 'Circle', params: [2] }, { key: 2, kind: 'Rectangle', params: [3, 4] }, { key: 3, kind: 'Triangle', params: [5, 3] }];
    const steps = buildPolymorphismSteps(shapes, items);
    expect(last(steps).results).toEqual([{ kind: 'Circle', result: '12.57' }, { kind: 'Rectangle', result: '12' }, { kind: 'Triangle', result: '7.5' }]);
    expect(last(steps).total).toBe(32.07);
    expect(steps).toHaveLength(items.length + 2);
  });

  test('the same call on animals gives sounds, and there is no total', () => {
    const steps = buildPolymorphismSteps(animals, defaultItems(animals));
    expect(last(steps).results.map((entry) => entry.result)).toEqual(['"Woof"', '"Meow"', '"Quack"']);
    expect(last(steps).total).toBeNull();
  });

  test('steps go through the list in order, one item at a time', () => {
    const steps = buildPolymorphismSteps(shapes, defaultItems(shapes));
    expect(steps.map((step) => step.index)).toEqual([null, 0, 1, 2, null]);
    expect(steps.map((step) => step.results.length)).toEqual([0, 1, 2, 3, 3]);
  });

  test('two objects of the same class use the same method with their own data', () => {
    const items: Item[] = [{ key: 1, kind: 'Circle', params: [1] }, { key: 2, kind: 'Circle', params: [10] }];
    expect(last(buildPolymorphismSteps(shapes, items)).results.map((entry) => entry.result)).toEqual(['3.14', '314.16']);
  });

  test('an empty list is handled', () => {
    expect(buildPolymorphismSteps(shapes, [])).toHaveLength(1);
  });

  test('defaults match each family kinds', () => {
    expect(defaultItems(shapes).map((item) => item.kind)).toEqual(['Circle', 'Rectangle', 'Triangle']);
    expect(defaultItems(shapes)[1]?.params).toEqual([4, 5]);
  });
});
