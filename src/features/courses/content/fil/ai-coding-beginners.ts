import { aiCodingBeginnersCourse } from '../catalog/courses/ai-coding-beginners';
import type { Course } from '../types';
import { aiCodingBeginnersLesson01Fil } from './ai-coding-beginners/lesson-01';
import { aiCodingBeginnersLesson02Fil } from './ai-coding-beginners/lesson-02';
import { aiCodingBeginnersLesson03Fil } from './ai-coding-beginners/lesson-03';
import { aiCodingBeginnersLesson04Fil } from './ai-coding-beginners/lesson-04';
import { aiCodingBeginnersLesson05Fil } from './ai-coding-beginners/lesson-05';
import { aiCodingBeginnersLesson06Fil } from './ai-coding-beginners/lesson-06';
import { aiCodingBeginnersLesson07Fil } from './ai-coding-beginners/lesson-07';
import { aiCodingBeginnersLesson08Fil } from './ai-coding-beginners/lesson-08';
import { aiCodingBeginnersLesson09Fil } from './ai-coding-beginners/lesson-09';
import { aiCodingBeginnersLesson10Fil } from './ai-coding-beginners/lesson-10';
import { aiCodingBeginnersLesson11Fil } from './ai-coding-beginners/lesson-11';
import { aiCodingBeginnersLesson12Fil } from './ai-coding-beginners/lesson-12';
import { aiCodingBeginnersFilMeta, aiCodingBeginnersFilProjects } from './ai-coding-beginners/meta';

/** "Coding with AI for Complete Beginners" in Tagalog: the English course with its words replaced (every other field is the English one's), including the Tagalog of every level piece (blocks, questions, activities and steps written for one level, `taskExtra`, `rubricExtra`). */
export const aiCodingBeginnersCourseFil: Course = {
  ...aiCodingBeginnersCourse,
  ...aiCodingBeginnersFilMeta,
  lessons: [
    aiCodingBeginnersLesson01Fil,
    aiCodingBeginnersLesson02Fil,
    aiCodingBeginnersLesson03Fil,
    aiCodingBeginnersLesson04Fil,
    aiCodingBeginnersLesson05Fil,
    aiCodingBeginnersLesson06Fil,
    aiCodingBeginnersLesson07Fil,
    aiCodingBeginnersLesson08Fil,
    aiCodingBeginnersLesson09Fil,
    aiCodingBeginnersLesson10Fil,
    aiCodingBeginnersLesson11Fil,
    aiCodingBeginnersLesson12Fil,
  ],
  projects: aiCodingBeginnersFilProjects,
};
