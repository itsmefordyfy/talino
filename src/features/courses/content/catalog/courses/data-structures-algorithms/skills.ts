import type { Course } from '../../../types';

/** The course's skill meter. Every lesson's `skills` are ids from here (the first is its main skill), and every id is taught by some lesson. */
export const SKILLS: Course['skills'] = [
  { id: 'complexity', label: 'Time and space complexity' },
  { id: 'arrays-strings', label: 'Arrays and strings' },
  { id: 'linked-structures', label: 'Linked lists, stacks and queues' },
  { id: 'hashing', label: 'Hash tables, maps and sets' },
  { id: 'trees-heaps', label: 'Trees, heaps and tries' },
  { id: 'graphs', label: 'Graphs and shortest paths' },
  { id: 'search-sort', label: 'Searching and sorting' },
  { id: 'patterns', label: 'Recursion, backtracking and algorithm patterns' },
  { id: 'choose-structure', label: 'Choosing the right structure' },
  { id: 'ai-algorithms', label: 'Working with AI on algorithms' },
];
