import type { Course, CourseModule, Lesson, Project } from '../../types';
import { AGENTS_MODULES } from '../syllabus-agents';
import { lessons as lessons01, project as project01 } from './building-ai-agents/module-01';
import { lessons as lessons02, project as project02 } from './building-ai-agents/module-02';
import { lessons as lessons03, project as project03 } from './building-ai-agents/module-03';
import { lessons as lessons04, project as project04 } from './building-ai-agents/module-04';
import { lessons as lessons05, project as project05 } from './building-ai-agents/module-05';
import { lessons as lessons06, project as project06 } from './building-ai-agents/module-06';
import { lessons as lessons07, project as project07 } from './building-ai-agents/module-07';
import { lessons as lessons08, project as project08 } from './building-ai-agents/module-08';
import { lessons as lessons09, project as project09 } from './building-ai-agents/module-09';
import { lessons as lessons10, project as project10 } from './building-ai-agents/module-10';
import { lessons as lessons11, project as project11 } from './building-ai-agents/module-11';
import { lessons as lessons12, project as project12 } from './building-ai-agents/module-12';
import { SKILLS } from './building-ai-agents/skills';

/**
 * Building AI Agents (owner's brief, 2026-11-18). Twelve modules in `building-ai-agents/module-NN.ts`, assembled here in syllabus order (lesson `day` = position in the whole course).
 * Projects sit in modules 3, 4, 5, 6, 7, 8, 10 and 12 (p1 to p8). English only (the owner's standing rule).
 * Brief: docs/content/AGENTS_BRIEF.md; design: docs/superpowers/specs/2026-11-18-building-ai-agents-course-design.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11, lessons12];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11, project12];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = AGENTS_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const buildingAiAgentsCourse: Course = {
  id: 'building-ai-agents',
  kind: 'standard',
  title: 'Building AI Agents',
  level: 'intermediate',
  tagline: 'Design, build, test and deploy agents that use tools, memory and your own data.',
  description:
    'Learn how to design, build and deploy AI agents that understand instructions, reason through tasks, use tools, retrieve information, keep context and run multi-step workflows. You connect LLMs to APIs, databases and services, add memory and retrieval, plan and bound multi-step runs, coordinate several agents, compare the frameworks, and make an agent safe, tested and ready for production. Each module ends in something you build, from a first working agent to a customer support agent and your own capstone.',
  finishLine: [
    'Eight hands-on builds, from a first LLM agent to a tool-using, memory-keeping, document-aware customer support agent',
    'A capstone agent of your own (or a full architecture design if you have no paid API), with tools, memory, a multi-step workflow, error handling and security controls',
  ],
  objectives: [
    'Explain what an AI agent is, how it differs from a chatbot, and how its parts fit together',
    'Connect an LLM to tools, APIs and databases with tool calling, structured output and safe execution',
    'Give an agent short-term and long-term memory and ground it in documents with retrieval',
    'Plan multi-step and multi-agent workflows with hard limits, retries and human approval',
    'Choose between building from scratch and using a framework, and test and debug an agent',
    'Secure, evaluate, monitor and deploy an agent, treating everything it reads as untrusted',
  ],
  audiences: ['experienced-dev', 'fresh-grad', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'smart_toy',
  updated: '2026-11-18',
};
