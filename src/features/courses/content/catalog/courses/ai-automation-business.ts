import type { Course, CourseModule, Lesson, Project } from '../../types';
import { AI_AUTOMATION_MODULES } from '../syllabus-ai-automation';
import { lessons as lessons01, project as project01 } from './ai-automation-business/module-01';
import { lessons as lessons02, project as project02 } from './ai-automation-business/module-02';
import { lessons as lessons03, project as project03 } from './ai-automation-business/module-03';
import { lessons as lessons04, project as project04 } from './ai-automation-business/module-04';
import { lessons as lessons05, project as project05 } from './ai-automation-business/module-05';
import { lessons as lessons06, project as project06 } from './ai-automation-business/module-06';
import { lessons as lessons07, project as project07 } from './ai-automation-business/module-07';
import { lessons as lessons08, project as project08 } from './ai-automation-business/module-08';
import { lessons as lessons09, project as project09 } from './ai-automation-business/module-09';
import { lessons as lessons10, project as project10 } from './ai-automation-business/module-10';
import { lessons as lessons11, project as project11 } from './ai-automation-business/module-11';
import { SKILLS } from './ai-automation-business/skills';

/**
 * AI Automation for Business and Everyday Work (owner's brief, 2026-11-18). Eleven modules in `ai-automation-business/module-NN.ts`, assembled here in syllabus order
 * (lesson `day` = position in the whole course). Projects sit in modules 3, 4, 5, 6, 8, 9 and 11. The hands-on tool is the rule-checked `workflow-builder` activity and
 * `diagram` blocks; nothing connects to a real automation platform. English only (the owner's standing rule). Briefs: docs/content/AI_AUTOMATION_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = AI_AUTOMATION_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const aiAutomationBusinessCourse: Course = {
  id: 'ai-automation-business',
  kind: 'standard',
  title: 'AI Automation for Business and Everyday Work',
  level: 'beginner',
  tagline: 'Let AI and automation do the repetitive work, with you in charge.',
  description:
    'Learn to use AI and no-code automation to simplify repetitive work: emails, meeting notes, documents, spreadsheets, reports, marketing, sales follow-up, customer support and small-business operations. You build workflows from a trigger, an AI step and a person who approves, learn what AI agents are and how they use tools, and practise doing it safely. No programming needed, and no paid tool required to finish.',
  finishLine: [
    'Seven finished projects, from personal automations to a customer-inquiry workflow and a small-business automation system',
    'A final workflow design for a real problem of your own: trigger, AI steps, actions, human approval, expected time saved and the risks you guard against',
    'The habits that keep automation safe: protect data and keys, test first, keep a person in charge of high-impact actions and keep logs',
  ],
  objectives: [
    'Tell AI judgment from fixed automation rules, and find the repetitive tasks in your work worth automating',
    'Build basic no-code workflows with a trigger, an AI step, conditions and a human approval, and connect apps and AI models',
    'Automate emails, meeting notes, documents, spreadsheets, invoices and reports, and flag what is missing or suspicious',
    'Design marketing, sales and customer-support workflows that classify, draft, escalate and measure',
    'Explain AI agents, tool calling, memory and approval, and decide which actions always need a person',
    'Protect customer data, keys and accounts, test and monitor workflows, and design a practical automation for a real business problem',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'educator', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'account_tree',
  updated: '2026-11-18',
};
