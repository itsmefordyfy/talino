/**
 * The course the learner picked for Home, with the moment they picked it. Kept on the phone (a preference about the screen, never part of
 * a backup): which course to show is worked out from this and the learner's real lessons (`resolveActiveCourse`), so a lesson finished
 * after the pick still moves Home to the course the learner is actually working on.
 */
export type HomeCourseChoice = { id: string; at: string };

/** A saved choice checked on load: anything that isn't a course id with an ISO time is the same as no choice. */
export function cleanHomeCourse(value: unknown): HomeCourseChoice | null {
  const choice = value as Partial<HomeCourseChoice> | null | undefined;
  if (!choice || typeof choice.id !== 'string' || choice.id === '' || typeof choice.at !== 'string' || Number.isNaN(Date.parse(choice.at))) return null;
  return { id: choice.id, at: choice.at };
}
