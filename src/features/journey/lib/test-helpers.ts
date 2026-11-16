import { AI_BUILDER_JOURNEY } from '../data/journey';
import type { CourseSnapshot, JourneyFacts, JourneyLearner } from './types';

/** Facts for a learner who has done nothing, with every course and project in the definition present (nothing owned unless asked). */
export function emptyFacts(overrides: Partial<JourneyFacts> = {}): JourneyFacts {
  const courses = new Map<string, CourseSnapshot>();
  const projects = new Map<string, string>();
  for (const stage of AI_BUILDER_JOURNEY.stages) {
    for (const milestone of stage.milestones) {
      for (const step of milestone.steps) {
        if (step.kind === 'action') continue;
        if (!courses.has(step.courseId)) courses.set(step.courseId, { title: `Course ${step.courseId}`, lessonsDone: 0, lessonsTotal: 10, started: false, complete: false, nextLessonId: `${step.courseId}-01`, nextLessonTitle: 'First lesson', minutesLeft: 200, owned: true, quizAverage: null });
        if (step.kind === 'build') projects.set(step.projectId, `Project ${step.projectId}`);
      }
    }
  }
  return { courses, projectTitles: projects, passedProjects: new Set(), openProjects: new Set(), actions: { portfolio: false, resume: false }, ...overrides };
}

export const newLearner: JourneyLearner = { experience: 'complete-beginner', assessment: null, focus: [], chosenStart: null };

/** Marks a course's lessons all done. */
export function finishLessons(facts: JourneyFacts, ...courseIds: string[]): JourneyFacts {
  const courses = new Map(facts.courses);
  for (const id of courseIds) {
    const course = courses.get(id);
    if (course) courses.set(id, { ...course, lessonsDone: course.lessonsTotal, started: true, nextLessonId: null, nextLessonTitle: null, minutesLeft: 0, quizAverage: 0.6 });
  }
  return { ...facts, courses };
}

export function passProjects(facts: JourneyFacts, ...projectIds: string[]): JourneyFacts {
  return { ...facts, passedProjects: new Set([...facts.passedProjects, ...projectIds]), openProjects: new Set([...facts.openProjects, ...projectIds]) };
}
