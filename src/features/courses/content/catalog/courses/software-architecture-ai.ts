import type { Course, CourseModule, Lesson, Project } from '../../types';
import { ARCHITECTURE_MODULES } from '../syllabus-architecture';
import { lessons as lessons01, project as project01 } from './software-architecture-ai/module-01';
import { lessons as lessons02, project as project02 } from './software-architecture-ai/module-02';
import { lessons as lessons03, project as project03 } from './software-architecture-ai/module-03';
import { lessons as lessons04, project as project04 } from './software-architecture-ai/module-04';
import { lessons as lessons05, project as project05 } from './software-architecture-ai/module-05';
import { lessons as lessons06, project as project06 } from './software-architecture-ai/module-06';
import { lessons as lessons07, project as project07 } from './software-architecture-ai/module-07';
import { lessons as lessons08, project as project08 } from './software-architecture-ai/module-08';
import { lessons as lessons09, project as project09 } from './software-architecture-ai/module-09';
import { lessons as lessons10, project as project10 } from './software-architecture-ai/module-10';
import { lessons as lessons11, project as project11 } from './software-architecture-ai/module-11';
import { lessons as lessons12, project as project12 } from './software-architecture-ai/module-12';
import { SKILLS } from './software-architecture-ai/skills';

/**
 * Software Architecture with AI: Design Scalable, Secure, and Production-Ready Systems (owner's brief, 2026-11-18). Twelve modules in `software-architecture-ai/module-NN.ts`,
 * assembled here in syllabus order (lesson `day` = position in the whole course). Projects sit in modules 7, 9 and 12. English only (the owner's standing rule).
 * Brief: docs/content/ARCHITECTURE_BRIEF.md; design: docs/superpowers/specs/2026-11-18-software-architecture-course-design.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11, lessons12];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11, project12];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = ARCHITECTURE_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const softwareArchitectureAiCourse: Course = {
  id: 'software-architecture-ai',
  kind: 'standard',
  title: 'Software Architecture with AI: Design Scalable, Secure, and Production-Ready Systems',
  level: 'intermediate',
  tagline: 'Think like an architect and use AI to design, review and build systems that scale.',
  description:
    'Learn how to think like a software architect and use AI to design, evaluate and build systems that can scale. You turn business needs into measurable requirements, choose between monoliths, microservices, serverless and event-driven designs on evidence, model data and APIs, plan cloud, security and reliability, document decisions with C4 diagrams and ADRs, and direct AI coding agents without losing your boundaries. You practise with an editable diagram workbench, a trade-off matrix, an ADR builder, an architecture assistant and three projects.',
  finishLine: [
    'Three architecture projects: a multi-tenant SaaS design, a scaling plan for an existing application, and a full production-oriented blueprint with a working proof of concept',
    'A way of working that outlasts any tool: state the requirements, compare options on trade-offs, record the decision, and check what AI proposes before you build it',
  ],
  objectives: [
    'Turn business needs into functional and measurable non-functional requirements',
    'Choose between architecture styles by their trade-offs, preferring the simplest design that meets the requirements',
    'Design components, data models, APIs and integrations with clear boundaries',
    'Plan cloud infrastructure, scaling, reliability and security, and find the real bottleneck before redesigning',
    'Document a system with C4 diagrams, sequence diagrams and Architecture Decision Records',
    'Use AI to analyse, draft and review architecture, and direct coding agents while keeping the design intact',
  ],
  audiences: ['experienced-dev'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'account_tree',
  updated: '2026-11-18',
};
