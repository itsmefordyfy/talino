import type { VisualDefinition } from '../types';
import { BigOVisual } from './big-o-visual';
import { BstVisual } from './bst-visual';
import { GraphVisual } from './graph-visual';
import { LinkedListVisual } from './linked-list-visual';
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

export const dsaVisuals = build(dsaStrings.en);
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const dsaVisualsFil = build(dsaStrings.fil);
