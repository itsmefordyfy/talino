import type { VisualDefinition } from '../types';
import { BigOVisual } from './big-o-visual';
import { BstVisual } from './bst-visual';
import { GraphVisual } from './graph-visual';
import { LinkedListVisual } from './linked-list-visual';
import { ArrayOpsVisual } from './array-ops-visual';
import { arrayOpsStrings } from './array-ops-strings';
import { HashTableVisual } from './hash-table-visual';
import { hashTableStrings } from './hash-table-strings';
import { RecursionStackVisual } from './recursion-stack-visual';
import { recursionStrings } from './recursion-stack-strings';
import { TrieVisual } from './trie-visual';
import { trieStrings } from './trie-strings';
import { HeapVisual } from './heap-visual';
import { heapStrings } from './heap-strings';
import { GraphPathsVisual } from './graph-paths-visual';
import { graphPathsStrings } from './graph-paths-strings';
import { UnionFindVisual } from './union-find-visual';
import { unionFindStrings } from './union-find-strings';
import { SortExtraVisual } from './sort-extra-visual';
import { sortExtraStrings } from './sort-extra-strings';
import { SearchingVisual } from './searching-visual';
import { SortingVisual } from './sorting-visual';
import { QueueVisual, StackVisual } from './stack-queue-visual';
import { dsaStrings } from './strings';


/** Data structures and algorithms: sorting, searching, linked list, stack, queue, binary search tree, graph, Big O. */
const build = (en: typeof dsaStrings.en): VisualDefinition[] => [
  { id: 'sorting-algorithms', category: 'dsa', title: en.sorting.title, summary: en.sorting.summary, description: en.sorting.description, topics: en.sorting.topics, Component: SortingVisual },
  { id: 'searching-linear-binary', category: 'dsa', title: en.searching.title, summary: en.searching.summary, description: en.searching.description, topics: en.searching.topics, Component: SearchingVisual },
  { id: 'linked-list', category: 'dsa', title: en.linkedList.title, summary: en.linkedList.summary, description: en.linkedList.description, topics: en.linkedList.topics, Component: LinkedListVisual },
  { id: 'stack-lifo', category: 'dsa', title: en.stack.title, summary: en.stack.summary, description: en.stack.description, topics: en.stack.topics, Component: StackVisual },
  { id: 'queue-fifo', category: 'dsa', title: en.queue.title, summary: en.queue.summary, description: en.queue.description, topics: en.queue.topics, Component: QueueVisual },
  { id: 'binary-search-tree', category: 'dsa', title: en.bst.title, summary: en.bst.summary, description: en.bst.description, topics: en.bst.topics, Component: BstVisual },
  { id: 'graph-bfs-dfs', category: 'dsa', title: en.graph.title, summary: en.graph.summary, description: en.graph.description, topics: en.graph.topics, Component: GraphVisual },
  { id: 'big-o-growth', category: 'dsa', title: en.bigO.title, summary: en.bigO.summary, description: en.bigO.description, topics: en.bigO.topics, Component: BigOVisual },
];

/** Array operations, hash table collisions, recursion call stack and trie; each keeps its strings in its own file. */
const buildBatchOne = (language: 'en' | 'fil'): VisualDefinition[] => {
  const array = arrayOpsStrings[language];
  const hash = hashTableStrings[language];
  const recursion = recursionStrings[language];
  const trie = trieStrings[language];
  return [
    { id: 'array-operations', category: 'dsa', title: array.title, summary: array.summary, description: array.description, topics: array.topics, Component: ArrayOpsVisual },
    { id: 'hash-table-collisions', category: 'dsa', title: hash.title, summary: hash.summary, description: hash.description, topics: hash.topics, Component: HashTableVisual },
    { id: 'recursion-call-stack', category: 'dsa', title: recursion.title, summary: recursion.summary, description: recursion.description, topics: recursion.topics, Component: RecursionStackVisual },
    { id: 'trie-autocomplete', category: 'dsa', title: trie.title, summary: trie.summary, description: trie.description, topics: trie.topics, Component: TrieVisual },
  ];
};

/** Heap operations, shortest paths and task order, union-find, heap sort and counting sort; each keeps its strings in its own file (English only for now). */
const buildBatchTwo = (language: 'en' | 'fil'): VisualDefinition[] => {
  const heap = heapStrings[language];
  const paths = graphPathsStrings[language];
  const union = unionFindStrings[language];
  const extra = sortExtraStrings[language];
  return [
    { id: 'heap-operations', category: 'dsa', title: heap.title, summary: heap.summary, description: heap.description, topics: heap.topics, Component: HeapVisual },
    { id: 'graph-shortest-path', category: 'dsa', title: paths.title, summary: paths.summary, description: paths.description, topics: paths.topics, Component: GraphPathsVisual },
    { id: 'union-find', category: 'dsa', title: union.title, summary: union.summary, description: union.description, topics: union.topics, Component: UnionFindVisual },
    { id: 'sort-extra', category: 'dsa', title: extra.title, summary: extra.summary, description: extra.description, topics: extra.topics, Component: SortExtraVisual },
  ];
};

export const dsaVisuals = [...build(dsaStrings.en), ...buildBatchOne('en'), ...buildBatchTwo('en')];
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const dsaVisualsFil = [...build(dsaStrings.fil), ...buildBatchOne('fil'), ...buildBatchTwo('fil')];
