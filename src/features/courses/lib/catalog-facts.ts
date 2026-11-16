import { COURSES } from '../content';
import { courseMeta, LEARNING_PATHS } from '../content/catalog';
import type { Availability, CategoryId, Course, CourseKind, CourseLevel, LearningGoalId } from '../content/types';
import { learningLevelOf, type LearningLevel } from './learning-level';
import { standardCourseType } from './standard-rules';

/**
 * Everything discovery needs to know about a course, derived in one place from the course itself (lessons, minutes,
 * objectives, kind, level) and its catalog metadata (`content/catalog/meta`). Search, filters, sorting, categories,
 * the recommendations and the cards all read this, so nothing is typed or hardcoded twice and a new course appears
 * everywhere the moment it is in `COURSES`.
 */

/** What kind of offer a course is, for the "Course type" filter. A course can have several (a path's career course is both). */
export type CourseType = 'free' | 'career' | 'learning-path' | 'masterclass' | 'course' | 'mini';
export const COURSE_TYPES: readonly CourseType[] = ['free', 'career', 'learning-path', 'masterclass', 'course', 'mini'];

/** Free (the starter, open to everyone) or Pro (every other course: one subscription opens them all). Matches `ownsCourse`. */
export type CourseAccess = 'free' | 'pro';
export const COURSE_ACCESS: readonly CourseAccess[] = ['free', 'pro'];

export type DurationBucket = 'under-1h' | '1-3h' | '3-5h' | 'over-5h';
export const DURATION_BUCKETS: readonly DurationBucket[] = ['under-1h', '1-3h', '3-5h', 'over-5h'];

export function durationBucket(minutes: number): DurationBucket {
  if (minutes < 60) return 'under-1h';
  if (minutes <= 180) return '1-3h';
  if (minutes <= 300) return '3-5h';
  return 'over-5h';
}

export type CourseFacts = {
  course: Course;
  id: string;
  kind: CourseKind;
  category: CategoryId;
  /** The catalog's three-level field, read by the recommendations' experience matching. Discover shows `learningLevel`. */
  level: CourseLevel;
  /** Beginner, Intermediate, Advanced or Expert: the course's difficulty, from its place in the learning journey (`learning-level.ts`). */
  learningLevel: LearningLevel;
  access: CourseAccess;
  /** The label shown on a card: a masterclass, a mini-course, a career course… */
  primaryType: CourseType;
  /** Every type the course counts as for filtering. */
  types: CourseType[];
  /** Total lesson minutes. */
  minutes: number;
  durationBucket: DurationBucket;
  lessonCount: number;
  projectCount: number;
  technologies: string[];
  goals: LearningGoalId[];
  tags: string[];
  prerequisites: string[];
  /** The learning paths this course belongs to. */
  pathIds: string[];
  /** What the learner will be able to do (`objectives`, or the older courses' `finishLine`). */
  objectives: string[];
  published: string;
  availability: Availability;
  /**
   * How much the rest of the catalog builds on this course: two points per learning path it is in, one per course that
   * lists it as a prerequisite. There are no enrollment numbers in Talino (no accounts), so this is the only honest
   * "popular" signal; it ranks foundations and widely-used courses first.
   */
  foundation: number;
};

function primaryTypeOf(course: Course): CourseType {
  if (course.kind === 'starter') return 'free';
  if (course.kind === 'career') return 'career';
  if (course.kind === 'mini') return 'mini';
  if (course.kind === 'path') return 'learning-path';
  return standardCourseType(course.lessons.length);
}

export function learningObjectives(course: Pick<Course, 'objectives' | 'finishLine'>): string[] {
  return course.objectives && course.objectives.length > 0 ? course.objectives : course.finishLine;
}

function build(courses: readonly Course[]): CourseFacts[] {
  const dependents = new Map<string, number>();
  for (const course of courses) for (const id of courseMeta(course).prerequisites) dependents.set(id, (dependents.get(id) ?? 0) + 1);
  return courses.map((course) => {
    const meta = courseMeta(course);
    const minutes = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
    const pathIds = LEARNING_PATHS.filter((path) => path.courseIds.includes(course.id)).map((path) => path.id);
    const primaryType = primaryTypeOf(course);
    const types = new Set<CourseType>([primaryType]);
    if (pathIds.length > 0) types.add('learning-path');
    return {
      course,
      id: course.id,
      kind: course.kind,
      category: meta.category,
      level: course.level ?? 'beginner',
      learningLevel: learningLevelOf(course),
      access: course.kind === 'starter' ? 'free' : 'pro',
      primaryType,
      types: [...types],
      minutes,
      durationBucket: durationBucket(minutes),
      lessonCount: course.lessons.length,
      projectCount: course.projects.length,
      technologies: meta.technologies,
      goals: meta.goals,
      tags: meta.tags,
      prerequisites: meta.prerequisites,
      pathIds,
      objectives: learningObjectives(course),
      published: meta.published,
      availability: meta.availability,
      foundation: pathIds.length * 2 + (dependents.get(course.id) ?? 0),
    };
  });
}

/** Facts for any list of courses (tests pass their own). */
export function buildCourseFacts(courses: readonly Course[]): CourseFacts[] {
  return build(courses);
}

let cached: { source: readonly Course[]; facts: CourseFacts[] } | null = null;

/** Facts for the whole catalog, in catalog order, computed once. */
export function catalogFacts(): readonly CourseFacts[] {
  if (!cached || cached.source !== COURSES) cached = { source: COURSES, facts: build(COURSES) };
  return cached.facts;
}

export function factsFor(courseId: string): CourseFacts | undefined {
  return catalogFacts().find((facts) => facts.id === courseId);
}

/**
 * The day the launch catalog was complete. Every course up to it is the catalog a learner meets on day one, so none of them is
 * labelled "New"; a course published after it is new for `NEW_DAYS` days. (All courses carry real publish dates in `catalog/meta`.)
 */
export const LAUNCH_CATALOG_DATE = '2026-11-14';
export const NEW_DAYS = 30;

/** Whether a course gets the "New" label on `now` (a `YYYY-MM-DD` publish date, compared by UTC day). */
export function isNewCourse(fact: Pick<CourseFacts, 'published'>, now: Date | number = Date.now()): boolean {
  if (fact.published <= LAUNCH_CATALOG_DATE) return false;
  const published = Date.parse(`${fact.published}T00:00:00Z`);
  if (Number.isNaN(published)) return false;
  const days = Math.floor((new Date(now).getTime() - published) / 86_400_000);
  return days >= 0 && days <= NEW_DAYS;
}

/** "45 min", "2 h", "2 h 30 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.max(5, Math.round(minutes / 5) * 5)} min`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round((minutes % 60) / 5) * 5;
  if (rest === 60) return `${hours + 1} h`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
