import { describe, expect, test } from '@jest/globals';

import { addPrefix, buildTrie, cleanWord, depthOf, emptyTrie, insertSteps, layoutTrie, leafCount, MAX_WORDS, nodeCount, nodeFor, prefixSteps, searchSteps, START_WORDS, wordsOf } from './trie';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const start = buildTrie(START_WORDS);

describe('the trie itself', () => {
  test('stores words along shared paths and lists them alphabetically', () => {
    expect(wordsOf(start)).toEqual([...START_WORDS].sort());
    // pen and pencil share three nodes, pad and paper share "pa".
    expect(nodeCount(buildTrie(['pen', 'pencil']))).toBe(1 + 6);
    expect(nodeCount(buildTrie(['pad', 'paper']))).toBe(1 + 2 + 1 + 3);
    expect(nodeFor(start, 'pen')?.end).toBe(true);
    expect(nodeFor(start, 'pe')?.end).toBe(false);
    expect(nodeFor(start, 'x')).toBeNull();
  });
  test('adding a prefix never changes the trie it is given and keeps children sorted', () => {
    const before = JSON.stringify(start);
    const grown = addPrefix(start, 'axe', true);
    expect(JSON.stringify(start)).toBe(before);
    expect(grown.children.map((child) => child.ch)).toEqual(['a', 'c', 'p']);
    expect(wordsOf(grown)).toContain('axe');
  });
  test('cleanWord keeps lowercase letters, at most 8', () => {
    expect(cleanWord('Hello, World!')).toBe('hellowor');
    expect(cleanWord('123')).toBe('');
  });
  test('layout puts a leaf in each column and each parent over its children', () => {
    const placed = layoutTrie(start);
    expect(placed).toHaveLength(nodeCount(start));
    expect(placed.filter((node) => node.parent !== null).every((node) => placed.some((other) => other.id === node.parent))).toBe(true);
    const leaves = placed.filter((node) => !placed.some((other) => other.parent === node.id));
    expect(leaves.map((leaf) => leaf.x).sort((a, b) => a - b)).toEqual(Array.from({ length: leafCount(start) }, (_, index) => index));
    const pa = placed.find((node) => node.id === 'pa')!;
    const children = placed.filter((node) => node.parent === 'pa').map((node) => node.x);
    expect(pa.x).toBe((Math.min(...children) + Math.max(...children)) / 2);
    expect(Math.max(...placed.map((node) => node.depth))).toBe(depthOf(start));
    expect(layoutTrie(emptyTrie())).toHaveLength(1);
  });
});

describe('insert', () => {
  test('a new word creates only the letters that do not exist yet', () => {
    const steps = insertSteps(start, 'paste');
    const final = last(steps);
    expect(wordsOf(final.root)).toEqual([...START_WORDS, 'paste'].sort());
    expect(final.created).toBe(3);
    expect(final.fresh).toEqual(['pas', 'past', 'paste']);
    expect(final.visited).toBe(5);
    expect(final.found).toBe('paste');
  });
  test('each letter is a step, then one step marks the end of the word', () => {
    expect(insertSteps(start, 'paste')).toHaveLength(1 + 5 + 1);
  });
  test('a word that is the start of a longer word only gets its end marked', () => {
    const final = last(insertSteps(start, 'pe'));
    expect(final.created).toBe(0);
    expect(wordsOf(final.root)).toContain('pe');
    expect(final.caption).toContain('longer word');
  });
  test('a word already stored changes nothing', () => {
    const final = last(insertSteps(start, 'pencil'));
    expect(wordsOf(final.root)).toEqual(wordsOf(start));
    expect(final.created).toBe(0);
    expect(final.visited).toBe(6);
  });
  test('an empty word or a full trie is refused', () => {
    expect(insertSteps(start, '  ')[0]?.refused).toBe(true);
    let full = emptyTrie();
    for (let index = 0; index < MAX_WORDS; index += 1) full = last(insertSteps(full, String.fromCharCode(97 + index) + 'x')).root;
    expect(wordsOf(full)).toHaveLength(MAX_WORDS);
    expect(insertSteps(full, 'zzz')[0]?.refused).toBe(true);
    expect(last(insertSteps(full, 'ax')).refused).toBe(false);
  });
  test('inserting does not change the trie it is given', () => {
    const before = JSON.stringify(start);
    insertSteps(start, 'paste');
    expect(JSON.stringify(start)).toBe(before);
  });
});

describe('search', () => {
  test('finds a stored word after one visit per letter', () => {
    const final = last(searchSteps(start, 'pencil'));
    expect(final.found).toBe('pencil');
    expect(final.visited).toBe(6);
    expect(final.path).toEqual(['', 'p', 'pe', 'pen', 'penc', 'penci', 'pencil']);
  });
  test('a prefix that is not a word is not found, though its path exists', () => {
    const final = last(searchSteps(start, 'penc'));
    expect(final.found).toBeNull();
    expect(final.caption).toContain('not marked');
  });
  test('a missing letter stops the search where the path ends', () => {
    const steps = searchSteps(start, 'pans');
    const final = last(steps);
    expect(final.found).toBeNull();
    expect(final.path).toEqual(['', 'p', 'pa']);
    expect(final.visited).toBe(2);
    expect(final.caption).toContain('not stored');
  });
  test('the trie is never changed by a search', () => {
    expect(last(searchSteps(start, 'cap')).root).toBe(start);
  });
});

describe('autocomplete', () => {
  test('lists every stored word that starts with the prefix, alphabetically, and nothing else', () => {
    for (const prefix of ['p', 'pa', 'pen', 'ca', 'cable', 'phone']) {
      const final = last(prefixSteps(start, prefix));
      expect(final.suggestions).toEqual(wordsOf(start).filter((word) => word.startsWith(prefix)));
    }
  });
  test('includes the prefix itself when it is a word, and counts the nodes visited', () => {
    const final = last(prefixSteps(start, 'pen'));
    expect(final.suggestions).toEqual(['pen', 'pencil']);
    // 3 letters of the prefix + c, i, l, i... pencil adds "cil" = 3 nodes.
    expect(final.visited).toBe(6);
    expect(final.collected).toEqual(['pen', 'penc', 'penci', 'pencil']);
  });
  test('suggestions grow one word at a time as the walk reaches each word', () => {
    const counts = prefixSteps(start, 'pa').map((step) => step.suggestions.length);
    expect(counts).toEqual([...counts].sort((a, b) => a - b));
    expect(last(prefixSteps(start, 'pa')).suggestions).toEqual(['pad', 'paper']);
  });
  test('a prefix nothing starts with gives no suggestions and says so', () => {
    const final = last(prefixSteps(start, 'zz'));
    expect(final.suggestions).toEqual([]);
    expect(final.noMatch).toBe(true);
    expect(final.visited).toBe(0);
  });
  test('a longer miss stops where the path ends', () => {
    const final = last(prefixSteps(start, 'pex'));
    expect(final.noMatch).toBe(true);
    expect(final.visited).toBe(2);
  });
  test('an empty prefix is refused', () => {
    expect(prefixSteps(start, '')[0]?.refused).toBe(true);
  });
});
