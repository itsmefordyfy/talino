import { defineStrings } from '@/lib/i18n';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation).
const en = {
  title: 'Union-find (disjoint sets)',
  summary: 'Union-find keeps groups of elements as a forest of trees: find climbs to the root, union joins two roots, and two tricks keep the trees flat.',
  description:
    'Eight elements start in their own sets. Choose two elements, then run Union to join their sets or Find to look up one set\'s root. The picture shows the forest of trees and the parent array that stores it. Switch path compression and union by size on or off, and watch the counter of parent hops: with both on, finds stay almost free. Make a long chain to see how slow a bad tree is.',
  topics: ['union find', 'disjoint set', 'disjoint set union', 'dsu', 'path compression', 'union by size', 'union by rank', 'find', 'union', 'connected components', 'kruskal', 'forest', 'parent array', 'amortized'],
  firstLabel: 'Element a',
  secondLabel: 'Element b',
  compressLabel: 'Path compression',
  sizeLabel: 'Union by size',
  on: 'On',
  off: 'Off',
  buttons: { union: 'Union', find: 'Find', chain: 'Make a long chain', reset: 'New forest' },
  forestTitle: 'Forest (an arrow goes from a child up to its parent)',
  arrayTitle: 'Parent array (index → parent)',
  setsTitle: 'Sets',
  indexLabel: 'index',
  parentLabel: 'parent',
  rootLabel: 'root',
  counters: { hops: 'Parent hops', rewires: 'Rewires', sets: 'Sets', height: 'Tallest tree' },
  legend: { path: 'Path followed', rewired: 'Rewired to the root', root: 'Root', linked: 'Just joined' },
  complexityLabel: 'Cost',
  complexity: {
    idle: 'With both tricks, a find or a union costs almost O(1) (amortized, inverse Ackermann). With neither, a tree can become a chain and a find costs O(n).',
    find: 'Find costs as many hops as the element is deep: O(n) in a chain, O(log n) with union by size, and nearly O(1) with path compression too.',
    union: 'Union is two finds plus one pointer change. Its cost is the cost of its finds.',
  },
  forestLabel: (sets: readonly (readonly number[])[], parent: readonly number[]) => `Forest of ${plural(sets.length, 'set')}: ${sets.map((set) => `{${set.join(', ')}}`).join(' ')}. Parent array: ${parent.join(', ')}.`,
  intro: 'Every element starts as its own root. Union two of them, then find one. Try Make a long chain, then Find 0 with path compression off and then on.',
  fresh: 'Started a new forest: eight single-element sets, each its own root.',
  chain: 'A long chain: 0 points to 1, 1 to 2, and so on up to the root 7. This is the worst shape: finding 0 takes 7 hops.',
  fStart: (x: number) => `Find ${x}: follow parent pointers upward until an element is its own parent. That element is the root, and it names the set.`,
  fHop: (from: number, to: number) => `${from} is not a root, so hop to its parent ${to}.`,
  fRoot: (x: number, root: number, hops: number) => `${root} is its own parent, so it is the root of ${x}'s set. That took ${plural(hops, 'hop')}.`,
  fCompressStart: (count: number, root: number) => `Path compression: point ${plural(count, 'element')} on the path straight at the root ${root}, so the next find from there takes one hop.`,
  fRewire: (node: number, root: number) => `${node}'s parent becomes ${root}.`,
  fCompressNone: (root: number) => `Every element on the path already points straight at the root ${root}, so there is nothing to compress.`,
  fNoCompress: 'Path compression is off, so the tree keeps its shape and the next find pays the same hops again.',
  fDone: (x: number, root: number, hops: number) => `Find ${x} = ${root}. This find took ${plural(hops, 'hop')}; the counter adds up every hop so far.`,
  uStart: (a: number, b: number) => `Union ${a} and ${b}: find each one's root, and if the roots differ, hang one root under the other.`,
  uSame: (a: number, b: number, root: number) => `${a} and ${b} already share the root ${root}, so they are in the same set and nothing changes. (Linking a root to itself would make a loop.)`,
  uLinkSize: (child: number, root: number, childSize: number, rootSize: number) => `Union by size: the root ${child} (${plural(childSize, 'element')}) goes under the root ${root} (${plural(rootSize, 'element')}), the bigger or equal tree. The result has ${plural(childSize + rootSize, 'element')}. Hanging the small tree under the big one keeps trees short.`,
  uLinkPlain: (child: number, root: number) => `Union by size is off, so root ${child} (a's root) is simply hung under root ${root} (b's root), whatever their sizes. This can make tall trees.`,
  uDone: (a: number, b: number, sets: number) => `${a} and ${b} are in one set now. ${plural(sets, 'set')} left.`,
};

export const unionFindStrings = defineStrings({ en, fil: en });
