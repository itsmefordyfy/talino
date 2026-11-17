import type { Course } from '../../../types';

/** The course's skill meter. Every lesson's `skills` are ids from here (the first is its main skill), and every id is taught by some lesson. */
export const SKILLS: Course['skills'] = [
  { id: 'how-programs-work', label: 'How programs and languages work' },
  { id: 'problem-solving', label: 'Problem solving and algorithms' },
  { id: 'data-and-operators', label: 'Variables, data types and operators' },
  { id: 'decisions', label: 'Conditions and decisions' },
  { id: 'loops', label: 'Loops and repetition' },
  { id: 'functions', label: 'Functions and reusable logic' },
  { id: 'data-structures', label: 'Data structures' },
  { id: 'debug-test', label: 'Reading, debugging and testing' },
  { id: 'ai-partner', label: 'Programming with AI' },
  { id: 'build-project', label: 'Building a complete program' },
];
