import { starterCourse } from '../starter';
import type { Course } from '../types';
import { starterLesson01Fil } from './starter/lesson-01';
import { starterLesson02Fil } from './starter/lesson-02';
import { starterLesson03Fil } from './starter/lesson-03';
import { starterLesson04Fil } from './starter/lesson-04';
import { starterLesson05Fil } from './starter/lesson-05';
import { starterLesson06Fil } from './starter/lesson-06';
import { starterLesson07Fil } from './starter/lesson-07';
import { starterFilMeta, starterFilProjects } from './starter/meta';

/** The free starter course in Tagalog: the English course with its words replaced (every other field is the English one's). */
export const starterCourseFil: Course = {
  ...starterCourse,
  ...starterFilMeta,
  lessons: [starterLesson01Fil, starterLesson02Fil, starterLesson03Fil, starterLesson04Fil, starterLesson05Fil, starterLesson06Fil, starterLesson07Fil],
  projects: starterFilProjects,
};
