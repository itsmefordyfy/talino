import type { Course, CourseModule, Lesson, Project } from '../../types';
import { PROGRAMMING_FUNDAMENTALS_MODULES } from '../syllabus-foundations';
import * as module01 from './programming-fundamentals/module-01';
import * as module02 from './programming-fundamentals/module-02';
import * as module03 from './programming-fundamentals/module-03';
import * as module04 from './programming-fundamentals/module-04';
import * as module05 from './programming-fundamentals/module-05';
import * as module06 from './programming-fundamentals/module-06';
import * as module07 from './programming-fundamentals/module-07';
import * as module08 from './programming-fundamentals/module-08';
import * as module09 from './programming-fundamentals/module-09';
import * as module10 from './programming-fundamentals/module-10';
import * as module11 from './programming-fundamentals/module-11';
import * as module12 from './programming-fundamentals/module-12';
import { SKILLS } from './programming-fundamentals/skills';

/**
 * Programming Fundamentals: Think Like a Programmer (owner's brief, 2026-11-16): twelve modules, sixty lessons, eleven projects, written one
 * module per file under `programming-fundamentals/` and assembled here. The syllabus (`syllabus-foundations.ts`) fixes the titles and the grouping;
 * `docs/content/PROGRAMMING_FUNDAMENTALS_BRIEF.md` is the writers' brief.
 */
const parts = [module01, module02, module03, module04, module05, module06, module07, module08, module09, module10, module11, module12];

const lessons: Lesson[] = parts.flatMap((part) => part.lessons);
const projects: Project[] = parts.flatMap((part) => (part.project ? [part.project] : []));

let nextDay = 1;
const modules: CourseModule[] = PROGRAMMING_FUNDAMENTALS_MODULES.map((module) => {
  const entry = { id: module.slug, title: module.title, summary: module.summary, firstDay: nextDay, lastDay: nextDay + module.topics.length - 1 };
  nextDay += module.topics.length;
  return entry;
});

export const programmingFundamentalsCourse: Course = {
  id: 'programming-fundamentals',
  kind: 'standard',
  title: 'Programming Fundamentals: Think Like a Programmer',
  level: 'beginner',
  tagline: 'The ideas under every language: think in steps, read code, and work with AI.',
  description:
    'Learn how software works from the ground up: break problems into steps, design them as pseudocode and flowcharts, then build with variables, conditions, loops, functions and collections. You practise in JavaScript, learn to read and debug code, and use an AI coding assistant as a partner you check rather than trust blindly. You finish by building and explaining a personal expense tracker.',
  finishLine: [
    'A personal expense tracker you planned, built and can explain',
    'The habit of designing a solution on paper before you code it',
    'The skill to read, test and debug code, including code an AI wrote',
    'A foundation for AI-assisted web, mobile and full-stack development',
  ],
  objectives: [
    'Explain how programs, programming languages and applications work',
    'Break a problem into steps and design it with pseudocode and flowcharts',
    'Use variables, operators, conditions, loops and functions to solve problems',
    'Store and organise data with arrays, objects, sets and maps',
    'Read, debug and test code, and tell syntax, runtime and logic errors apart',
    'Use AI coding assistants to explain, generate, review and test code without trusting them blindly',
  ],
  audiences: ['career-changer', 'fresh-grad', 'builder'],
  skills: SKILLS,
  lessons,
  projects,
  modules,
  icon: 'psychology',
  updated: '2026-11-16',
};
