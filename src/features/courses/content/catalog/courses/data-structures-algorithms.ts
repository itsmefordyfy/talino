import type { Course, CourseModule, Lesson, Project } from '../../types';
import { DSA_MODULES } from '../syllabus-dsa';
import { lessons as lessons01, project as project01 } from './data-structures-algorithms/module-01';
import { lessons as lessons02, project as project02 } from './data-structures-algorithms/module-02';
import { lessons as lessons03, project as project03 } from './data-structures-algorithms/module-03';
import { lessons as lessons04, project as project04 } from './data-structures-algorithms/module-04';
import { lessons as lessons05, project as project05 } from './data-structures-algorithms/module-05';
import { lessons as lessons06, project as project06 } from './data-structures-algorithms/module-06';
import { lessons as lessons07, project as project07 } from './data-structures-algorithms/module-07';
import { lessons as lessons08, project as project08 } from './data-structures-algorithms/module-08';
import { lessons as lessons09, project as project09 } from './data-structures-algorithms/module-09';
import { lessons as lessons10, project as project10 } from './data-structures-algorithms/module-10';
import { lessons as lessons11, project as project11 } from './data-structures-algorithms/module-11';
import { lessons as lessons12, project as project12 } from './data-structures-algorithms/module-12';
import { lessons as lessons13, project as project13 } from './data-structures-algorithms/module-13';
import { lessons as lessons14, project as project14 } from './data-structures-algorithms/module-14';
import { lessons as lessons15, project as project15 } from './data-structures-algorithms/module-15';
import { lessons as lessons16, project as project16 } from './data-structures-algorithms/module-16';
import { lessons as lessons17, project as project17 } from './data-structures-algorithms/module-17';
import { lessons as lessons18, project as project18 } from './data-structures-algorithms/module-18';
import { lessons as lessons19, project as project19 } from './data-structures-algorithms/module-19';
import { SKILLS } from './data-structures-algorithms/skills';

/**
 * Data Structures and Algorithms: From Fundamentals to Practical Problem Solving (owner's brief, 2026-11-16). Nineteen modules in
 * `data-structures-algorithms/module-NN.ts`, assembled here in syllabus order (lesson `day` = position in the whole course, so a module
 * covers consecutive days). JavaScript is the practice language because the in-app code runner executes it. Stable subject: no version notes.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11, lessons12, lessons13, lessons14, lessons15, lessons16, lessons17, lessons18, lessons19];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11, project12, project13, project14, project15, project16, project17, project18, project19];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = DSA_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const dataStructuresAlgorithmsCourse: Course = {
  id: 'data-structures-algorithms',
  kind: 'standard',
  title: 'Data Structures and Algorithms: From Fundamentals to Practical Problem Solving',
  level: 'intermediate',
  tagline: 'Learn how software organizes, finds and orders data, and how to judge what an algorithm costs.',
  description:
    'Understand how arrays, linked lists, stacks, queues, hash tables, trees, heaps and graphs work inside, what each operation costs, and when to choose each one. You count operations before naming Big O, step through interactive visualizers, practise in JavaScript, learn the patterns behind searching, sorting and problem solving, use an AI assistant to explain and test algorithms without letting it think for you, and finish by building a smart task manager.',
  finishLine: [
    'A smart task management system that uses a hash map, a tree, a heap, two stacks and a graph, with every choice explained',
    'The skill to compare two solutions by counting their work, and to review an algorithm an AI wrote for speed and correctness',
  ],
  objectives: [
    'Explain how the main data structures store data and what each operation costs',
    'Analyze time and space complexity by counting operations and reading Big O',
    'Implement arrays, linked lists, stacks, queues, hash tables, trees, heaps and graphs in JavaScript',
    'Choose the right data structure for a problem and explain the trade-offs',
    'Solve problems with searching, sorting, recursion and common algorithm patterns',
    'Use an AI assistant to explain, test and optimize algorithms while keeping your own reasoning in charge',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'account_tree',
  updated: '2026-11-16',
};
