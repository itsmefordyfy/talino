import { defineStrings } from '@/lib/i18n';

type Kind = 'min' | 'max';
const word = (kind: Kind) => (kind === 'min' ? 'smaller' : 'bigger');
const root = (kind: Kind) => (kind === 'min' ? 'smallest' : 'largest');

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation).
const en = {
  title: 'Heap operations',
  summary: 'A binary heap keeps the smallest (or largest) value at the root: watch insert, extract, build-heap and heap sort move values with swaps.',
  description:
    'Pick a min-heap or a max-heap, then insert a value, extract the root, build a heap from a shuffled array or run heap sort. The heap is drawn twice: as a tree and as the array that really stores it, with index labels. Amber nodes are being compared, red nodes were just swapped, green ones have left the heap. Counters show comparisons and swaps; step or play through each operation.',
  topics: ['heap', 'binary heap', 'min heap', 'max heap', 'priority queue', 'heapify', 'build heap', 'sift up', 'sift down', 'bubble up', 'extract min', 'extract max', 'heap sort', 'heapsort', 'complete binary tree', 'array', 'O(log n)'],
  kindLabel: 'Heap type',
  kinds: { min: 'Min-heap', max: 'Max-heap' },
  valueLabel: 'Value to insert',
  buttons: { insert: 'Insert', extractMin: 'Extract min', extractMax: 'Extract max', build: 'Build from array', sort: 'Heap sort', restart: 'Start over' },
  treeTitle: 'Tree',
  arrayTitle: 'Array (how it is stored)',
  indexLabel: 'index',
  emptyHint: 'The heap is empty. Insert a value or build a heap from an array.',
  rule: { min: 'Min-heap rule: every parent is smaller than or equal to its children, so the smallest value is at the root.', max: 'Max-heap rule: every parent is bigger than or equal to its children, so the largest value is at the root.' },
  relationRule: 'For index i: parent is (i - 1) / 2 rounded down, children are 2i + 1 and 2i + 2.',
  relation: (i: number, parent: number | null, left: number | null, right: number | null) =>
    `Index ${i}: ${parent === null ? 'no parent (the root)' : `parent is index ${parent}`}; ${left === null ? 'no children' : right === null ? `child is index ${left}` : `children are indexes ${left} and ${right}`}.`,
  comparisons: 'Comparisons',
  swaps: 'Swaps',
  heapSize: 'Heap size',
  legend: { compare: 'Comparing', swapped: 'Just swapped', focus: 'Working on', out: 'Out of the heap' },
  complexityLabel: 'Cost',
  complexity: {
    idle: 'Insert and extract cost O(log n): a value moves along one root-to-leaf path. Building a heap is O(n). Heap sort is O(n log n).',
    insert: 'Insert: O(log n). The value climbs at most one level per swap, and a heap of n values has about log n levels.',
    extract: 'Extract the root: O(log n). The moved value sinks at most one level per swap, down the height of the tree.',
    build: 'Build-heap: O(n), not O(n log n). Most nodes are near the bottom and sink only a level or two.',
    sort: 'Heap sort: O(n log n) time, O(1) extra space. Build the heap (O(n)), then extract n values at O(log n) each.',
  },
  stateLabel: (values: readonly number[], size: number, kind: Kind) => (values.length === 0 ? 'Empty heap' : `${kind === 'min' ? 'Min-heap' : 'Max-heap'} array: ${values.join(', ')}. The first ${size} value${size === 1 ? ' is' : 's are'} the heap.`),
  intro: (kind: Kind) => `A ${kind}-heap: the ${root(kind)} value is always at the root. Try Insert, ${kind === 'min' ? 'Extract min' : 'Extract max'}, or Build from array.`,
  switched: (kind: Kind) => `Switched to a ${kind}-heap: the same values were rearranged so every parent is ${word(kind)} than its children.`,
  restarted: (kind: Kind) => `Started over with a fresh ${kind}-heap.`,
  full: (max: number) => `The picture holds at most ${max} values, so nothing was inserted.`,
  emptyRefused: 'The heap is empty, so there is no root to extract.',
  insertStart: (value: number, index: number) => `Insert ${value}: add it in the next free slot, index ${index}, at the end of the array. This keeps the tree complete (every level full except maybe the last).`,
  siftUpCompare: (child: number, parent: number, kind: Kind, swap: boolean) =>
    swap ? `Compare ${child} with its parent ${parent}: ${child} is ${word(kind)}, which breaks the heap rule, so they swap.` : `Compare ${child} with its parent ${parent}: ${child} is not ${word(kind)}, so the heap rule holds and ${child} stays.`,
  swapped: (up: number, down: number) => `Swapped: ${up} moves up and ${down} moves down.`,
  reachedRoot: (value: number) => `${value} reached the root, so it has no parent left to compare with.`,
  insertDone: (comparisons: number, swaps: number) => `Inserted. Sifting up took ${comparisons} comparison${comparisons === 1 ? '' : 's'} and ${swaps} swap${swaps === 1 ? '' : 's'}.`,
  extractStart: (value: number, kind: Kind) => `Extract: the root, ${value}, is the ${root(kind)} value. It will be taken out.`,
  extractOnly: (value: number) => `${value} was the only value, so taking it out leaves an empty heap.`,
  extractMove: (rootValue: number, last: number) => `Swap the root ${rootValue} with the last value ${last}. ${rootValue} is now at the end and leaves the heap; ${last} sits at the root and may be out of place.`,
  pickChild: (left: number, right: number, kind: Kind) => `Compare the children ${left} and ${right}: the ${root(kind)} one, ${better(left, right, kind)}, is the one that may move up.`,
  siftDownCompare: (parent: number, child: number, kind: Kind, swap: boolean) =>
    swap ? `Compare ${parent} with its better child ${child}: the child is ${word(kind)}, so they swap.` : `Compare ${parent} with its better child ${child}: ${parent} is not out of order, so it stays and the heap is fixed.`,
  reachedLeaf: (value: number) => `${value} has no children left (it is a leaf), so sifting down stops.`,
  extractDone: (value: number, comparisons: number, swaps: number) => `Extracted ${value}. Fixing the heap took ${comparisons} comparison${comparisons === 1 ? '' : 's'} and ${swaps} swap${swaps === 1 ? '' : 's'} (counting the first swap).`,
  buildStart: (count: number) => `Build-heap: the array is just ${count} value${count === 1 ? '' : 's'} in any order. Fix it from the last parent back to the root; leaves are already tiny heaps.`,
  buildNode: (value: number, index: number) => `Sift down ${value} (index ${index}) until both its subtrees obey the rule.`,
  buildDone: (comparisons: number, swaps: number) => `The array is a heap now: ${comparisons} comparison${comparisons === 1 ? '' : 's'} and ${swaps} swap${swaps === 1 ? '' : 's'} (about n at most, which is why build-heap is O(n)).`,
  sortStart: (count: number, kind: Kind) => `Heap sort: first build a ${kind}-heap from the ${count} value${count === 1 ? '' : 's'}, then repeatedly move the root to the end of the array. A ${kind}-heap gives ${kind === 'max' ? 'ascending' : 'descending'} order. It works on a copy, so your heap is unchanged.`,
  sortMove: (rootValue: number, end: number) => `Swap the root ${rootValue} into index ${end}, its final place in the sorted tail. The heap shrinks by one.`,
  sortDone: (comparisons: number, swaps: number, kind: Kind) => `Sorted ${kind === 'max' ? 'smallest to largest' : 'largest to smallest'}: ${comparisons} comparison${comparisons === 1 ? '' : 's'} and ${swaps} swap${swaps === 1 ? '' : 's'} in total.`,
};

function better(a: number, b: number, kind: Kind): number {
  return kind === 'min' ? Math.min(a, b) : Math.max(a, b);
}

export const heapStrings = defineStrings({ en, fil: en });
