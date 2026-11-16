import { aiDevAdvancedCourse } from './ai-dev/ai-dev-advanced';
import { aiDevChatgptCourse } from './ai-dev/ai-dev-chatgpt';
import { aiDevClaudeCourse } from './ai-dev/ai-dev-claude';
import { aiDevClaudeCodeCourse } from './ai-dev/ai-dev-claude-code';
import { aiDevCodexCourse } from './ai-dev/ai-dev-codex';
import { aiDevCursorCourse } from './ai-dev/ai-dev-cursor';
import { aiDevIntroCourse } from './ai-dev/ai-dev-intro';
import { CATALOG_COURSES } from './catalog';
import { builderCourse } from './builder';
import { developerCourse } from './developer';
import { educatorCourse } from './educator';
import { experiencedCourse } from './experienced';
import { freelancerCourse } from './freelancer';
import { miniAiDataCourse } from './mini-ai-data';
import { miniAiEngineeringCourse } from './mini-ai-engineering';
import { miniAiQaCourse } from './mini-ai-qa';
import { miniNoCodeAutomationCourse } from './mini-no-code-automation';
import { miniPythonAiCourse } from './mini-python-ai';
import { miniSellYourAppCourse } from './mini-sell-your-app';
import { starterCourse } from './starter';
import type { Course, Lesson, Project } from './types';

export * from './types';

/** Every course in catalog order: the free starter, the five career courses, the mini-courses, the AI-Assisted Development path (in path order), then the wider catalog added on 2026-11-14 (foundations first, careers last). */
export const COURSES: readonly Course[] = [
  starterCourse,
  developerCourse,
  freelancerCourse,
  builderCourse,
  experiencedCourse,
  educatorCourse,
  miniPythonAiCourse,
  miniAiEngineeringCourse,
  miniAiQaCourse,
  miniAiDataCourse,
  miniNoCodeAutomationCourse,
  miniSellYourAppCourse,
  aiDevIntroCourse,
  aiDevChatgptCourse,
  aiDevClaudeCourse,
  aiDevClaudeCodeCourse,
  aiDevCursorCourse,
  aiDevCodexCourse,
  aiDevAdvancedCourse,
  ...CATALOG_COURSES,
];

const byId = new Map(COURSES.map((course) => [course.id, course]));
const lessons = new Map<string, { course: Course; lesson: Lesson }>();
const projects = new Map<string, { course: Course; project: Project }>();
for (const course of COURSES) {
  for (const lesson of course.lessons) lessons.set(lesson.id, { course, lesson });
  for (const project of course.projects) projects.set(project.id, { course, project });
}

export function getCourse(id: string): Course | undefined {
  return byId.get(id);
}

export function findLesson(id: string): { course: Course; lesson: Lesson } | undefined {
  return lessons.get(id);
}

export function findProject(id: string): { course: Course; project: Project } | undefined {
  return projects.get(id);
}

export const STARTER_COURSE_ID = 'starter';
export const CAREER_COURSES = COURSES.filter((course) => course.kind === 'career');
export const MINI_COURSES = COURSES.filter((course) => course.kind === 'mini');
/** The AI-Assisted Development path's courses, in path order (beginner to advanced). */
export const AI_DEV_COURSES = COURSES.filter((course) => course.kind === 'path' && course.path?.id === 'ai-dev').sort((a, b) => (a.path?.order ?? 0) - (b.path?.order ?? 0));
/** The wider catalog's courses (`kind: 'standard'`), in syllabus order. */
export const STANDARD_COURSES = COURSES.filter((course) => course.kind === 'standard');
