import type { Course } from '../types';
import { GENERATED_CATALOG_COURSES } from './courses.generated';

export { CATEGORIES, getCategory, LEARNING_GOALS, LEVEL_LABELS, type CategoryDef } from './categories';
export { LEARNING_PATHS, getLearningPath, type LearningPathDef } from './paths';
export { categoryLabel, categoryText, goalLabel, levelLabel, localizedCategories, pathText } from './catalog-text';
export { courseMeta, COURSE_META } from './meta';
export { CATALOG_SYLLABUS, getSyllabus, type SyllabusEntry } from './syllabus';
export { getTechnology, TECHNOLOGIES, type Technology } from './technologies';

/**
 * The courses added on 2026-11-14, in syllabus order. The list is generated from the files that exist in `./courses/`
 * (`scripts/content/build-catalog-index.mjs`), so a course appears in the app the moment its file is written and passes its
 * checks; the catalog test names every syllabus course that has no file yet.
 */
export const CATALOG_COURSES: readonly Course[] = GENERATED_CATALOG_COURSES;
