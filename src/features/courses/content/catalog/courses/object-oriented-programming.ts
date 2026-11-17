import type { Course, CourseModule, Lesson, Project } from '../../types';
import { OOP_MODULES } from '../syllabus-oop';
import { lessons as lessons01, project as project01 } from './object-oriented-programming/module-01';
import { lessons as lessons02, project as project02 } from './object-oriented-programming/module-02';
import { lessons as lessons03, project as project03 } from './object-oriented-programming/module-03';
import { lessons as lessons04, project as project04 } from './object-oriented-programming/module-04';
import { lessons as lessons05, project as project05 } from './object-oriented-programming/module-05';
import { lessons as lessons06, project as project06 } from './object-oriented-programming/module-06';
import { lessons as lessons07, project as project07 } from './object-oriented-programming/module-07';
import { lessons as lessons08, project as project08 } from './object-oriented-programming/module-08';
import { lessons as lessons09, project as project09 } from './object-oriented-programming/module-09';
import { lessons as lessons10, project as project10 } from './object-oriented-programming/module-10';
import { lessons as lessons11, project as project11 } from './object-oriented-programming/module-11';
import { lessons as lessons12, project as project12 } from './object-oriented-programming/module-12';
import { lessons as lessons13, project as project13 } from './object-oriented-programming/module-13';
import { lessons as lessons14, project as project14 } from './object-oriented-programming/module-14';
import { SKILLS } from './object-oriented-programming/skills';

/**
 * Object-Oriented Programming: From Fundamentals to Practical Software Design (owner's brief, 2026-11-16). Fourteen modules in
 * `object-oriented-programming/module-NN.ts`, assembled here in syllabus order (lesson `day` = position in the whole course, so a module
 * covers consecutive days). JavaScript is the practice language because the in-app code runner executes it, with TypeScript where a
 * compile-time idea needs it. Stable subject: version notes only for tool and language-feature statements. Briefs: docs/content/OOP_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11, lessons12, lessons13, lessons14];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11, project12, project13, project14];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = OOP_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const objectOrientedProgrammingCourse: Course = {
  id: 'object-oriented-programming',
  kind: 'standard',
  title: 'Object-Oriented Programming: From Fundamentals to Practical Software Design',
  level: 'intermediate',
  tagline: 'Organize code into objects and classes, and design software that stays easy to change.',
  description:
    'Learn to model a problem as objects, protect their state, hide what callers do not need, share and specialize behavior, and combine objects into systems. You practise in JavaScript with TypeScript comparisons, learn the SOLID principles from real design problems, refactor and test classes, see where objects appear in front ends, back ends, databases, mobile apps and games, and use AI to design, review and refactor object-oriented code without handing it your judgement.',
  finishLine: [
    'A complete Library Management System with books, members, borrowing records, validation, error handling and tests, with every design choice explained',
    'The skill to review a class design, yours or an AI-generated one, for coupling, unnecessary abstraction and broken principles',
  ],
  objectives: [
    'Explain objects, classes, state and behavior, and when object-oriented design is the right tool',
    'Apply encapsulation, abstraction, inheritance and polymorphism with clear reasons',
    'Choose between inheritance and composition and wire objects together with dependency injection',
    'Recognize and fix design problems using the SOLID principles, coupling and cohesion',
    'Write, test and refactor small single-purpose classes in a maintainable structure',
    'Use an AI assistant to design, explain, review and refactor object-oriented code, and catch its design mistakes',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'construction',
  updated: '2026-11-16',
};
