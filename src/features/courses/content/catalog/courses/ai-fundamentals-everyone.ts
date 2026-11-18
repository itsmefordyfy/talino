import type { Course, CourseModule, Lesson, Project } from '../../types';
import { AI_FUNDAMENTALS_MODULES } from '../syllabus-ai-fundamentals';
import { lessons as lessons01, project as project01 } from './ai-fundamentals-everyone/module-01';
import { lessons as lessons02, project as project02 } from './ai-fundamentals-everyone/module-02';
import { lessons as lessons03, project as project03 } from './ai-fundamentals-everyone/module-03';
import { lessons as lessons04, project as project04 } from './ai-fundamentals-everyone/module-04';
import { lessons as lessons05, project as project05 } from './ai-fundamentals-everyone/module-05';
import { lessons as lessons06, project as project06 } from './ai-fundamentals-everyone/module-06';
import { lessons as lessons07, project as project07 } from './ai-fundamentals-everyone/module-07';
import { lessons as lessons08, project as project08 } from './ai-fundamentals-everyone/module-08';
import { SKILLS } from './ai-fundamentals-everyone/skills';

/**
 * AI Fundamentals for Everyone (owner's brief, 2026-11-18). Eight modules in `ai-fundamentals-everyone/module-NN.ts`, assembled here in syllabus order (lesson `day` =
 * position in the whole course). Two projects: P1 in module 5 (a real task done with an AI assistant) and the final challenge P2 in module 8. The 20-question final
 * assessment is the quizzes of the four "Knowledge Assessment" lessons (5 questions each for every learner). English only (the owner's standing rule). Brief:
 * docs/content/AI_FUNDAMENTALS_BRIEF.md.
 */
const MODULE_LESSONS: Lesson[][] = [lessons01, lessons02, lessons03, lessons04, lessons05, lessons06, lessons07, lessons08];
const MODULE_PROJECTS: (Project | null)[] = [project01, project02, project03, project04, project05, project06, project07, project08];

const lessons: Lesson[] = MODULE_LESSONS.flat();

let nextDay = 1;
const modules: CourseModule[] = AI_FUNDAMENTALS_MODULES.map((module) => {
  const firstDay = nextDay;
  nextDay += module.topics.length;
  return { id: module.slug, title: module.title, summary: module.summary, firstDay, lastDay: nextDay - 1 };
});

export const aiFundamentalsEveryoneCourse: Course = {
  id: 'ai-fundamentals-everyone',
  kind: 'standard',
  title: 'AI Fundamentals for Everyone',
  level: 'beginner',
  tagline: 'Understand AI, use it well, and stay in charge of it.',
  description:
    'Understand artificial intelligence, machine learning, deep learning, generative AI and responsible AI without any technical background. You learn how AI works through everyday analogies, where it already touches your life, how to use AI tools effectively, safely and responsibly, and how to check what they tell you. You finish with a real task done with an assistant and a final challenge that shows how you use AI with good judgment.',
  finishLine: [
    'You can explain AI, machine learning, deep learning, generative AI and large language models in plain words, and you know what AI cannot do',
    'You have used an AI assistant to finish a real task: clear prompts, a checked answer and your own changes on top',
    'You know the risks (bias, privacy, copyright, deepfakes, made-up answers) and a habit for each, and you decide what AI may and may not decide for you',
    'You have a short plan for the AI skills you will build next',
  ],
  objectives: [
    'Explain what AI, machine learning, deep learning and neural networks are, using everyday analogies',
    'Recognise where AI already appears in daily life and tell real abilities from myths',
    'Describe how generative AI and large language models make text, images, audio and video, and why they sometimes make things up',
    'Write clear prompts, ask better questions and verify an AI answer before you use it',
    'Use AI tools for personal, school, business and career tasks while protecting privacy and respecting ownership',
    'Spot bias, misinformation and deepfakes, and keep human judgment in decisions that matter',
  ],
  audiences: ['fresh-grad', 'career-changer', 'educator', 'builder', 'experienced-dev'],
  skills: SKILLS,
  lessons,
  projects: MODULE_PROJECTS.filter((project): project is Project => project !== null),
  modules,
  icon: 'psychology',
  updated: '2026-11-18',
};
