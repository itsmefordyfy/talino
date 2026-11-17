import type { Course, CourseModule, Lesson, Project } from '../../types';
import { INTERNATIONAL_CLIENTS_MODULES } from '../syllabus-international-clients';
import { lessons as lessons01, project as project01 } from './international-clients/module-01';
import { lessons as lessons02, project as project02 } from './international-clients/module-02';
import { lessons as lessons03, project as project03 } from './international-clients/module-03';
import { lessons as lessons04, project as project04 } from './international-clients/module-04';
import { lessons as lessons05, project as project05 } from './international-clients/module-05';
import { lessons as lessons06, project as project06 } from './international-clients/module-06';
import { lessons as lessons07, project as project07 } from './international-clients/module-07';
import { lessons as lessons08, project as project08 } from './international-clients/module-08';
import { lessons as lessons09, project as project09 } from './international-clients/module-09';
import { lessons as lessons10, project as project10 } from './international-clients/module-10';
import { SKILLS } from './international-clients/skills';

/**
 * Finding International Clients: From Zero to Your First Global Client (owner's brief, 2026-11-17). Ten modules in `international-clients/module-NN.ts`,
 * assembled here in syllabus order (lesson `day` = position in the whole course). Projects sit in modules 5, 6 and 10. The AI practice (role-play and
 * message review) each lesson names lives in `features/practice/scenarios/clients`. English only (the owner's standing rule). Brief: docs/content/INTERNATIONAL_CLIENTS_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = INTERNATIONAL_CLIENTS_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const internationalClientsCourse: Course = {
  id: 'international-clients',
  kind: 'standard',
  title: 'Finding International Clients: From Zero to Your First Global Client',
  level: 'beginner',
  tagline: 'Find international clients, earn their trust, write winning proposals and sign your first project.',
  description:
    'Learn how clients in the United States, the United Kingdom, Australia, Canada and beyond find and hire freelancers, and how to be the one they choose. You choose a niche, build a portfolio and profile that is honest about what you have done, research real prospects, write outreach and proposals that fit one client at a time, and practise discovery calls and negotiation with a simulated client. Three projects take you from a finished profile to a campaign to a signed-contract simulation. Nothing here promises clients: it gives you the method, the practice and the habit of checking facts.',
  finishLine: [
    'Three finished projects: your international freelancer profile, a client acquisition campaign with researched prospects and personalized outreach, and a simulated first contract from inquiry to onboarding',
    'A set of habits you can use tomorrow: research before you write, claim only what is true, ask before you pitch, agree scope in writing and check what AI tells you',
  ],
  objectives: [
    'Explain how international clients hire and what they expect from freelancers in different markets',
    'Choose a niche and describe your ideal client and your value in plain words',
    'Find, research and organize real prospects, and recognize suspicious offers',
    'Build a portfolio, profile and proposals that present your work honestly',
    'Run discovery calls, discuss budgets and negotiate scope and rates with a client',
    'Agree terms, invoice, onboard a new client and turn one project into a long-term relationship',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'public',
  updated: '2026-11-17',
};
