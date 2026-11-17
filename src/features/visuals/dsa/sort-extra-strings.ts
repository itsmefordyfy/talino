import { defineStrings } from '@/lib/i18n';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation).
const en = {
  title: 'Heap sort and counting sort',
  summary: 'Two sorts that are not like the rest: heap sort uses a heap inside the array, and counting sort never compares two values.',
  description:
    'Choose heap sort or counting sort and a list of 6 to 12 small numbers (0 to 9), then step or play through it. Bars show the values. Heap sort: the first bars form a max-heap, the green bars at the end are already sorted. Counting sort: the counts array fills, turns into running totals, and the output list is written one value at a time. Counters show comparisons and writes.',
  topics: ['heap sort', 'heapsort', 'counting sort', 'non-comparison sort', 'linear time sort', 'stable sort', 'in-place', 'sorting', 'sort', 'prefix sum', 'counts array', 'max heap', 'O(n + k)', 'O(n log n)'],
  algorithmLabel: 'Algorithm',
  algorithms: { heap: 'Heap sort', counting: 'Counting sort' },
  patternLabel: 'List',
  patterns: { random: 'Random', custom: 'My own' },
  sizeLabel: 'Number of values',
  shuffle: 'Shuffle again',
  customLabel: 'Values (6 to 12 whole numbers, 0 to 9, separated by commas)',
  customError: 'Enter 6 to 12 whole numbers from 0 to 9, separated by commas or spaces.',
  comparisons: 'Comparisons',
  swaps: 'Swaps',
  writes: 'Writes',
  inputTitle: 'The list',
  countsTitle: { count: 'Counts: how many times each value appears', prefix: 'Running totals: where each value\'s block ends in the output', place: 'Next free spot for each value (it counts down as values are placed)' },
  outputTitle: 'Output (written one value at a time)',
  valueLabel: 'value',
  heapRegion: (size: number) => (size === 0 ? 'The heap is empty: everything is sorted.' : `Heap region: the first ${plural(size, 'bar')}.`),
  legend: { compare: 'Comparing', moved: 'Just moved or written', sorted: 'In its final place', heap: 'In the heap', read: 'Being read' },
  spaceLabel: 'Extra space',
  spaceNotes: { heap: 'O(1): heap sort works inside the same array.', counting: (n: number, k: number) => `O(n + k): a counts array of ${k} and an output list of ${n}.` },
  notes: {
    heap: 'Heap sort: O(n log n) time whatever the order, O(1) extra space, not stable. It compares values, so it can never beat n log n comparisons in the worst case.',
    counting: 'Counting sort: O(n + k) time, where k is the range of values. It is not comparison based (it never compares two values), so it can beat n log n, but it needs O(n + k) extra space and only suits small whole-number ranges. Placing from the right keeps equal values in their original order (stable).',
  },
  barsLabel: (values: readonly (number | null)[]) => `Values: ${values.map((value) => (value === null ? 'empty' : value)).join(', ')}`,
  countsLabel: (counts: readonly number[]) => `Counts for values 0 to ${counts.length - 1}: ${counts.join(', ')}`,
  // Heap sort
  hStart: (n: number) => `Heap sort on ${plural(n, 'value')}. Phase 1: rearrange the list into a max-heap (every parent at least as big as its children, so the biggest value is first). Phase 2: swap the biggest to the end and shrink the heap, over and over.`,
  hBuild: (value: number, index: number) => `Phase 1: sift ${value} (position ${index}) down until the max-heap rule holds below it. Positions are checked from the last parent back to the first.`,
  hPickChild: (left: number, right: number, bigger: number) => `Compare the children ${left} and ${right}: ${bigger} is the bigger one.`,
  hCompare: (parent: number, child: number, swap: boolean) => (swap ? `Compare ${parent} with its bigger child ${child}: the child is bigger, so they swap.` : `Compare ${parent} with its bigger child ${child}: ${parent} is big enough, so it stays.`),
  hSwap: (up: number, down: number) => `Swapped: ${up} moves up, ${down} moves down.`,
  hLeaf: (value: number) => `${value} has no children left in the heap, so sifting down stops.`,
  hHeapReady: 'The list is a max-heap now: the biggest value is at position 0. Phase 2 starts.',
  hMove: (value: number, index: number) => `Swap the biggest value, ${value}, into position ${index}. That is its final place, so the heap shrinks and ${value} joins the sorted tail.`,
  hDone: (comparisons: number, swaps: number) => `Sorted: ${plural(comparisons, 'comparison')} and ${plural(swaps, 'swap')} in total.`,
  // Counting sort
  cStart: (n: number, k: number) => `Counting sort on ${plural(n, 'value')} between 0 and ${k - 1}. It makes a counts array with one slot for each possible value (${k} slots), then never compares two values.`,
  cCount: (value: number, index: number, count: number) => `Read ${value} at position ${index}: add one to its count. Value ${value} has been seen ${plural(count, 'time')}.`,
  cCountDone: 'Every value has been counted. Next, turn the counts into running totals.',
  cPrefix: (value: number, total: number) => `Running total for ${value}: ${total} value${total === 1 ? '' : 's'} are ${value} or smaller, so the block of ${value}s in the output ends just before position ${total}.`,
  cPrefixDone: 'Now place the values: go through the list from the right, so equal values keep their original order.',
  cPlace: (value: number, index: number, spot: number) => `Read ${value} at position ${index}: count down its running total to ${spot} and write ${value} into output position ${spot}.`,
  cDone: (writes: number) => `Sorted with 0 comparisons and ${plural(writes, 'write')}. Counting sort looked at each value, not at pairs of values.`,
};

export const sortExtraStrings = defineStrings({ en, fil: en });
