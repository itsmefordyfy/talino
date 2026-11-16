import { findLesson, getCourse } from '@/features/courses/data';

import type { ConceptOf } from './adaptive';

/**
 * A concept is one skill of one course (`developer:code-quality`), taken from the skills of the
 * lesson an activity belongs to. An activity whose lesson is unknown falls back to its kind, so
 * mastery never silently disappears.
 */
export const conceptOf: ConceptOf = (item) => {
  const found = findLesson(item.lesson_id);
  if (!found || found.lesson.skills.length === 0) return [item.kind];
  return found.lesson.skills.map((skill) => `${item.course_id}:${skill}`);
};

/** A concept's plain label: the course's skill label, or the activity kind for the fallback. */
export function conceptLabel(concept: string): string {
  const [courseId, skillId] = concept.split(':');
  if (!skillId) return concept;
  return getCourse(courseId)?.skills.find((skill) => skill.id === skillId)?.label ?? skillId;
}
