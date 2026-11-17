import { trieStrings } from './trie-strings';

type Text = typeof trieStrings.en;

export const MAX_WORDS = 10;
export const MAX_WORD_LENGTH = 8;
/** A product-like starting list: several words share the beginning "pa" or "pen". */
export const START_WORDS: readonly string[] = ['pen', 'pencil', 'paper', 'pad', 'phone', 'case', 'cable', 'cap'];

/** One letter. A node's id is the prefix that leads to it (the root's is ''). */
export type TrieNode = { ch: string; end: boolean; children: TrieNode[] };

export const emptyTrie = (): TrieNode => ({ ch: '', end: false, children: [] });

/** A word as the trie accepts it: lowercase letters a to z, at most 8. */
export const cleanWord = (text: string): string => text.toLowerCase().replace(/[^a-z]/g, '').slice(0, MAX_WORD_LENGTH);

/** The trie with the nodes for `prefix` added (and the last one marked as an end of word when `end`). Never changes its input. */
export function addPrefix(root: TrieNode, prefix: string, end: boolean): TrieNode {
  if (prefix === '') return end ? { ...root, end: true } : root;
  const [letter, ...rest] = prefix;
  const existing = root.children.find((child) => child.ch === letter);
  const updated = addPrefix(existing ?? { ch: letter!, end: false, children: [] }, rest.join(''), end);
  const children = existing ? root.children.map((child) => (child === existing ? updated : child)) : [...root.children, updated].sort((a, b) => (a.ch < b.ch ? -1 : 1));
  return { ...root, children };
}

export const buildTrie = (words: readonly string[]): TrieNode => words.reduce((root, word) => addPrefix(root, word, true), emptyTrie());

/** The node a prefix leads to, or null. */
export function nodeFor(root: TrieNode, prefix: string): TrieNode | null {
  let node: TrieNode | null = root;
  for (const letter of prefix) {
    node = node.children.find((child) => child.ch === letter) ?? null;
    if (!node) return null;
  }
  return node;
}

/** Every stored word, in alphabetical order. */
export function wordsOf(root: TrieNode): string[] {
  const out: string[] = [];
  const walk = (node: TrieNode, prefix: string) => {
    if (node.end) out.push(prefix);
    node.children.forEach((child) => walk(child, prefix + child.ch));
  };
  walk(root, '');
  return out;
}

export const nodeCount = (root: TrieNode): number => root.children.reduce((total, child) => total + nodeCount(child), 1);

export type Placed = { id: string; ch: string; end: boolean; depth: number; /** Horizontal position in leaf widths (0 is the first leaf's centre). */ x: number; parent: string | null };

/** Where to draw each node: a leaf takes the next column, a parent sits centred over its children. */
export function layoutTrie(root: TrieNode): Placed[] {
  const placed: Placed[] = [];
  let column = 0;
  const walk = (node: TrieNode, id: string, depth: number, parent: string | null): number => {
    const index = placed.length;
    placed.push({ id, ch: node.ch, end: node.end, depth, x: 0, parent });
    if (node.children.length === 0) {
      placed[index]!.x = column;
      column += 1;
      return placed[index]!.x;
    }
    const xs = node.children.map((child) => walk(child, id + child.ch, depth + 1, id));
    placed[index]!.x = (xs[0]! + xs[xs.length - 1]!) / 2;
    return placed[index]!.x;
  };
  walk(root, '', 0, null);
  return placed;
}

export const leafCount = (root: TrieNode): number => (root.children.length === 0 ? 1 : root.children.reduce((total, child) => total + leafCount(child), 0));
export const depthOf = (root: TrieNode): number => (root.children.length === 0 ? 0 : 1 + Math.max(...root.children.map(depthOf)));

export type TrieOperation = 'insert' | 'search' | 'prefix';

export type TrieStep = {
  root: TrieNode;
  operation: TrieOperation | null;
  /** Ids of the nodes walked so far, from the root. */
  path: string[];
  /** The node just stepped onto. */
  current: string | null;
  /** Ids of nodes created during this insert. */
  fresh: string[];
  /** The node of a word found (or just stored). */
  found: string | null;
  /** The autocomplete's walk below the prefix: ids of the nodes visited so far. */
  collected: string[];
  /** Words collected by an autocomplete so far. */
  suggestions: string[];
  /** Nodes stepped onto after the root. */
  visited: number;
  created: number;
  /** True when no stored word starts with the prefix. */
  noMatch: boolean;
  refused: boolean;
  caption: string;
};

const mk = (root: TrieNode, op: TrieOperation | null, extra: Partial<TrieStep>, caption: string): TrieStep => ({ root, operation: op, path: [''], current: null, fresh: [], found: null, collected: [], suggestions: [], visited: 0, created: 0, noMatch: false, refused: false, ...extra, caption });

/** The trie as it is shown when nothing is happening. */
export const idleStep = (root: TrieNode, caption: string): TrieStep => mk(root, null, {}, caption);

const refuse = (root: TrieNode, op: TrieOperation, caption: string): TrieStep[] => [mk(root, op, { refused: true }, caption)];

/** Insert a word: follow the letters that exist, create the ones that do not, then mark the last node as an end of word. */
export function insertSteps(root: TrieNode, rawWord: string, t: Text = trieStrings.en): TrieStep[] {
  const word = cleanWord(rawWord);
  if (word === '') return refuse(root, 'insert', t.badWord);
  const stored = wordsOf(root);
  if (!stored.includes(word) && stored.length >= MAX_WORDS) return refuse(root, 'insert', t.full(MAX_WORDS));
  let tree = root;
  let node = root;
  const path = [''];
  const fresh: string[] = [];
  let visited = 0;
  const steps: TrieStep[] = [mk(root, 'insert', {}, t.insertStart(word))];
  for (let index = 0; index < word.length; index += 1) {
    const prefix = word.slice(0, index);
    const letter = word[index]!;
    const id = prefix + letter;
    const exists = node.children.some((child) => child.ch === letter);
    visited += 1;
    path.push(id);
    if (!exists) {
      fresh.push(id);
      tree = addPrefix(tree, id, false);
    }
    steps.push(mk(tree, 'insert', { path: [...path], current: id, fresh: [...fresh], visited, created: fresh.length }, exists ? t.follow(letter, prefix) : t.create(letter, prefix)));
    node = nodeFor(tree, id)!;
  }
  const alreadyEnd = node.end;
  const done = addPrefix(tree, word, true);
  steps.push(mk(done, 'insert', { path: [...path], current: word, fresh: [...fresh], found: word, visited, created: fresh.length }, alreadyEnd ? t.alreadyStored(word) : fresh.length === 0 ? t.markEndExisting(word) : t.markEnd(word)));
  return steps;
}

/** Search for a whole word: it is stored only if its path exists and ends on a node marked as an end of word. */
export function searchSteps(root: TrieNode, rawWord: string, t: Text = trieStrings.en): TrieStep[] {
  const word = cleanWord(rawWord);
  if (word === '') return refuse(root, 'search', t.badWord);
  const steps: TrieStep[] = [mk(root, 'search', {}, t.searchStart(word))];
  const path = [''];
  let node = root;
  for (let index = 0; index < word.length; index += 1) {
    const prefix = word.slice(0, index);
    const letter = word[index]!;
    const next = node.children.find((child) => child.ch === letter);
    if (!next) {
      steps.push(mk(root, 'search', { path: [...path], current: prefix, visited: index }, t.searchMissing(letter, prefix, word)));
      return steps;
    }
    node = next;
    path.push(prefix + letter);
    steps.push(mk(root, 'search', { path: [...path], current: prefix + letter, visited: index + 1 }, t.searchStep(letter, prefix)));
  }
  steps.push(node.end ? mk(root, 'search', { path: [...path], current: word, found: word, visited: word.length }, t.searchFound(word, word.length)) : mk(root, 'search', { path: [...path], current: word, visited: word.length }, t.searchPrefixOnly(word)));
  return steps;
}

/** Autocomplete: walk to the prefix's node, then collect every word below it in alphabetical order. */
export function prefixSteps(root: TrieNode, rawPrefix: string, t: Text = trieStrings.en): TrieStep[] {
  const prefix = cleanWord(rawPrefix);
  if (prefix === '') return refuse(root, 'prefix', t.badWord);
  const steps: TrieStep[] = [mk(root, 'prefix', {}, t.prefixStart(prefix))];
  const path = [''];
  let node = root;
  for (let index = 0; index < prefix.length; index += 1) {
    const before = prefix.slice(0, index);
    const letter = prefix[index]!;
    const next = node.children.find((child) => child.ch === letter);
    if (!next) {
      steps.push(mk(root, 'prefix', { path: [...path], current: before, visited: index, noMatch: true }, t.prefixMissing(letter, before, prefix)));
      return steps;
    }
    node = next;
    path.push(before + letter);
    steps.push(mk(root, 'prefix', { path: [...path], current: before + letter, visited: index + 1 }, t.follow(letter, before)));
  }
  let visited = prefix.length;
  const collected: string[] = [prefix];
  const suggestions: string[] = [];
  const snapshot = (extra: Partial<TrieStep>, caption: string) => steps.push(mk(root, 'prefix', { path: [...path], current: prefix, visited, collected: [...collected], suggestions: [...suggestions], ...extra }, caption));
  snapshot({}, t.prefixReached(prefix));
  if (node.end) {
    suggestions.push(prefix);
    snapshot({ found: prefix }, t.prefixWord(prefix));
  }
  const walk = (from: TrieNode, id: string) => {
    for (const child of from.children) {
      const childId = id + child.ch;
      visited += 1;
      collected.push(childId);
      if (child.end) {
        suggestions.push(childId);
        snapshot({ current: childId, found: childId }, t.prefixWord(childId));
      }
      walk(child, childId);
    }
  };
  walk(node, prefix);
  snapshot({}, t.prefixDone(prefix, suggestions.length, visited));
  return steps;
}
