import type { Course, CourseModule, Lesson, Project } from '../../types';
import { SOFT_SKILLS_MODULES } from '../syllabus-soft-skills';
import { lessons as lessons01, project as project01 } from './soft-skills-workplace/module-01';
import { lessons as lessons02, project as project02 } from './soft-skills-workplace/module-02';
import { lessons as lessons03, project as project03 } from './soft-skills-workplace/module-03';
import { lessons as lessons04, project as project04 } from './soft-skills-workplace/module-04';
import { lessons as lessons05, project as project05 } from './soft-skills-workplace/module-05';
import { lessons as lessons06, project as project06 } from './soft-skills-workplace/module-06';
import { lessons as lessons07, project as project07 } from './soft-skills-workplace/module-07';
import { lessons as lessons08, project as project08 } from './soft-skills-workplace/module-08';
import { lessons as lessons09, project as project09 } from './soft-skills-workplace/module-09';
import { lessons as lessons10, project as project10 } from './soft-skills-workplace/module-10';
import { SKILLS } from './soft-skills-workplace/skills';

/**
 * Soft Skills for the Modern Workplace (owner's brief, 2026-11-17). Ten modules in `soft-skills-workplace/module-NN.ts`, assembled here in syllabus
 * order (lesson `day` = position in the whole course). Projects sit in modules 5, 8 and 10. The AI practice (role-play and message review) each
 * lesson names lives in `features/practice/scenarios`. English only (the owner's standing rule). Briefs: docs/content/SOFT_SKILLS_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = SOFT_SKILLS_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const softSkillsWorkplaceCourse: Course = {
  id: 'soft-skills-workplace',
  kind: 'standard',
  title: 'Soft Skills for the Modern Workplace',
  level: 'beginner',
  tagline: 'Become a confident communicator, problem solver, and effective professional.',
  description:
    'Learn the human skills that make every job work: clear writing and speaking, teamwork, sound thinking, realistic planning, emotional intelligence, presenting, adapting, professionalism, client care and career readiness. You practise with AI: hold realistic conversations with a simulated coworker, client or interviewer, get a coach\u2019s review of messages you write, and learn to check what AI tells you instead of trusting it. Three projects turn the practice into work you can show.',
  finishLine: [
    'Three finished projects: professional writing you revised after feedback, a workplace simulation you can explain, and a career portfolio with your introduction and plan',
    'A set of habits you can use tomorrow: say it clearly, listen first, plan honestly, own mistakes and judge AI advice yourself',
  ],
  objectives: [
    'Write clear, professional messages and explain technical ideas in plain language',
    'Work with a team, give and receive feedback and handle disagreement calmly',
    'Define a problem, separate facts from assumptions and verify AI recommendations before acting',
    'Plan a realistic week, prioritize and manage deadlines and requests honestly',
    'Handle clients, delays, complaints and changing requirements with accountability',
    'Introduce yourself, interview with evidence and build a career development plan',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'educator', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'groups',
  updated: '2026-11-17',
};
