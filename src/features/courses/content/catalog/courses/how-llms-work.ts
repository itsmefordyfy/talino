import type { Course, CourseModule, Lesson, Project } from '../../types';
import { LLM_MODULES } from '../syllabus-llm';
import { lessons as lessons01, project as project01 } from './how-llms-work/module-01';
import { lessons as lessons02, project as project02 } from './how-llms-work/module-02';
import { lessons as lessons03, project as project03 } from './how-llms-work/module-03';
import { lessons as lessons04, project as project04 } from './how-llms-work/module-04';
import { lessons as lessons05, project as project05 } from './how-llms-work/module-05';
import { lessons as lessons06, project as project06 } from './how-llms-work/module-06';
import { lessons as lessons07, project as project07 } from './how-llms-work/module-07';
import { lessons as lessons08, project as project08 } from './how-llms-work/module-08';
import { lessons as lessons09, project as project09 } from './how-llms-work/module-09';
import { lessons as lessons10, project as project10 } from './how-llms-work/module-10';
import { lessons as lessons11, project as project11 } from './how-llms-work/module-11';
import { SKILLS } from './how-llms-work/skills';

/**
 * How Large Language Models Work (owner's brief, 2026-11-18). Eleven modules in `how-llms-work/module-NN.ts`, assembled here in syllabus order (lesson `day` = position in the
 * whole course). Module 11 holds the knowledge review, the five-part 25-question assessment, the practical challenge (the course's one project) and the reflection.
 * English only (the owner's standing rule). Briefs: docs/content/LLM_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08, lessons09, lessons10, lessons11];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08, project09, project10, project11];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = LLM_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const howLlmsWorkCourse: Course = {
  id: 'how-llms-work',
  kind: 'standard',
  title: 'How Large Language Models Work',
  level: 'intermediate',
  tagline: 'Discover what happens behind the scenes when you talk to ChatGPT, Claude or Gemini.',
  description:
    'Look inside an AI assistant without any programming or advanced maths. Follow how a large language model learns from text, turns words into tokens and numbers, uses the Transformer and attention to understand context, builds a reply one token at a time, becomes a helpful assistant through fine-tuning and human feedback, and why it forgets, makes things up and needs outside knowledge. Then explore retrieval, multimodal models, agents and tool calling, check yourself with a 25-question assessment and design a simple AI assistant workflow of your own.',
  finishLine: [
    'A clear mental model of how an LLM learns, reads, reasons over context and writes: you can explain tokens, embeddings, attention, next-token prediction and temperature to someone else',
    'The skill of judging an AI answer: you know why models forget and hallucinate, when to add context or retrieval, and when a human must verify',
    'A finished AI assistant workflow design: the problem, the input, how the model processes it, the expected output, the hallucination risks and how you would check the answer',
  ],
  objectives: [
    'Explain what a large language model is and how it differs from traditional software and earlier AI',
    'Describe how LLMs learn from text, and explain tokens, embeddings, parameters and the Transformer with its attention mechanism',
    'Explain how an LLM predicts and generates text, and what temperature, top-k and top-p change',
    'Tell pretraining, fine-tuning, instruction tuning, RLHF and DPO apart, and explain how assistants are evaluated',
    'Explain context windows, hallucinations and knowledge cutoffs, and use retrieval and checking to improve accuracy',
    'Recognise what multimodal models, agents and function calling can do, and where human verification is necessary',
  ],
  audiences: ['fresh-grad', 'career-changer', 'experienced-dev', 'educator', 'builder'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'psychology',
  updated: '2026-11-18',
};
