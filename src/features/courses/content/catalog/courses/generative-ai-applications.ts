import type { Course, CourseModule, Lesson, Project } from '../../types';
import { GENAI_MODULES } from '../syllabus-genai';
import { lessons as lessons01, project as project01 } from './generative-ai-applications/module-01';
import { lessons as lessons02, project as project02 } from './generative-ai-applications/module-02';
import { lessons as lessons03, project as project03 } from './generative-ai-applications/module-03';
import { lessons as lessons04, project as project04 } from './generative-ai-applications/module-04';
import { lessons as lessons05, project as project05 } from './generative-ai-applications/module-05';
import { lessons as lessons06, project as project06 } from './generative-ai-applications/module-06';
import { lessons as lessons07, project as project07 } from './generative-ai-applications/module-07';
import { lessons as lessons08, project as project08 } from './generative-ai-applications/module-08';
import { lessons as lessons09, project as project09 } from './generative-ai-applications/module-09';
import { lessons as lessons10, project as project10 } from './generative-ai-applications/module-10';
import { lessons as lessons11, project as project11 } from './generative-ai-applications/module-11';
import { lessons as lessons12, project as project12 } from './generative-ai-applications/module-12';
import { SKILLS } from './generative-ai-applications/skills';

/**
 * Generative AI: From Fundamentals to Real-World Applications (owner's brief, 2026-11-17). Twelve modules in `generative-ai-applications/module-NN.ts`, assembled here in
 * syllabus order (lesson `day` = position in the whole course). Projects sit in modules 5, 7, 9 and 10. The live prompt labs and the workflow builders the lessons name
 * live in `features/practice/labs` and in the lessons. English only (the owner's standing rule). Briefs: docs/content/GENAI_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11, lessons12];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11, project12];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = GENAI_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const generativeAiApplicationsCourse: Course = {
  id: 'generative-ai-applications',
  kind: 'standard',
  title: 'Generative AI: From Fundamentals to Real-World Applications',
  level: 'beginner',
  tagline: 'Learn how generative AI works, then use it to create, solve problems, automate tasks and build.',
  description:
    'Understand generative AI well enough to judge it, then use it: how models, tokens and context windows work, prompts that get reliable results, images, speech, music and video as parts of a workflow, multimodal input, answers grounded in your own documents, agents with a human in charge, business use, building a small AI feature, and responsible use. You practise with live prompt labs that run on a real model, a workflow builder, and four projects: a content studio, a knowledge assistant, a business automation and an AI-powered app. No programming is required; optional exercises are there for those who want them.',
  finishLine: [
    'Four finished projects: an AI-assisted marketing campaign, a document-based assistant tested on questions it must refuse, a business workflow with human review, and a simple AI-powered application',
    'Habits that outlast any tool: say what you want clearly, test a prompt, check an answer against its source, keep a person in charge and protect private data and keys',
  ],
  objectives: [
    'Explain how generative AI works: models, tokens, context windows, training and why it sometimes makes things up',
    'Write, test and improve prompts for text, structured output, images and other media',
    'Ground an assistant in your own documents and judge whether its answers are supported',
    'Design AI workflows and agents with tools, memory and human approval',
    'Build a simple AI feature, handling keys, errors, cost and latency safely',
    'Use generative AI responsibly: verify outputs, protect privacy, respect rights and spot misuse',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'educator', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'auto_awesome',
  updated: '2026-11-17',
};
