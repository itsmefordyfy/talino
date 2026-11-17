import type { Course, CourseModule, Lesson, Project } from '../../types';
import { PRODUCTIVITY_MODULES } from '../syllabus-productivity';
import { lessons as lessons01, project as project01 } from './time-management-productivity/module-01';
import { lessons as lessons02, project as project02 } from './time-management-productivity/module-02';
import { lessons as lessons03, project as project03 } from './time-management-productivity/module-03';
import { lessons as lessons04, project as project04 } from './time-management-productivity/module-04';
import { lessons as lessons05, project as project05 } from './time-management-productivity/module-05';
import { lessons as lessons06, project as project06 } from './time-management-productivity/module-06';
import { lessons as lessons07, project as project07 } from './time-management-productivity/module-07';
import { lessons as lessons08, project as project08 } from './time-management-productivity/module-08';
import { lessons as lessons09, project as project09 } from './time-management-productivity/module-09';
import { lessons as lessons10, project as project10 } from './time-management-productivity/module-10';
import { SKILLS } from './time-management-productivity/skills';

/**
 * Time Management and Productivity (owner's brief, 2026-11-17). Ten modules in `time-management-productivity/module-NN.ts`, assembled here in syllabus
 * order (lesson `day` = position in the whole course). Projects sit in modules 7, 8 and 9. The AI practice (role-play and message review) the lessons name
 * lives in `features/practice/scenarios/productivity`; the tools (Eisenhower matrix, day planner, Pomodoro timer, prompt playground) are `visual` blocks and the
 * graded `planning` activity. English only (the owner's standing rule). Briefs: docs/content/PRODUCTIVITY_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = PRODUCTIVITY_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const timeManagementProductivityCourse: Course = {
  id: 'time-management-productivity',
  kind: 'standard',
  title: 'Time Management and Productivity',
  level: 'beginner',
  tagline: 'Work smarter, stay focused, and achieve more.',
  description:
    'Learn to manage your time, choose what matters, beat procrastination, protect your focus and use AI as a planning partner you check. You practise with real tools: an Eisenhower matrix, a day planner that spots conflicts, a Pomodoro timer and a prompt playground, and you plan days that survive a surprise and still leave room to rest. Three projects turn the practice into a system you will actually use.',
  finishLine: [
    'Three finished projects: a personal productivity system, an AI-assisted workflow that plans, summarises and reports, and a realistic plan for a week full of competing demands',
    'Habits you can keep: choose what matters, plan with slack, start small, protect your focus, check what AI tells you, and rest on purpose',
  ],
  objectives: [
    'Tell busy from productive, and set realistic goals you can break into tasks and milestones',
    'Prioritize with the Eisenhower matrix and decide what to delegate, postpone or decline',
    'Build daily and weekly schedules with time blocks, breaks and room for interruptions',
    'Start work you have been avoiding and protect your focus from distractions',
    'Use AI to plan, summarise and automate safely, and check what it produces',
    'Manage work, study and remote deadlines, and review your habits without burning out',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'educator', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'schedule',
  updated: '2026-11-17',
};
