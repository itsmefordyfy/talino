import type { Course } from '../types';
import { aiCodingBeginnersCourseFil } from './ai-coding-beginners';
import { starterCourseFil } from './starter';

/**
 * Courses available in Tagalog, by course id. A course listed here is a complete translation (every lesson, quiz,
 * activity, task and project), checked against its English original by `lib/localization-parity.ts`. A course that
 * isn't here stays in English and is labelled "English only for now" when the learner has chosen Tagalog.
 * To add one: write `content/fil/<course>.ts` (a `Course` that keeps every non-text field of the English one), add it
 * here, and `localization.test.ts` checks it. The voice rules are in `docs/i18n/tagalog-style-guide.md`.
 */
export const FIL_COURSES: Readonly<Record<string, Course>> = { [starterCourseFil.id]: starterCourseFil, [aiCodingBeginnersCourseFil.id]: aiCodingBeginnersCourseFil };
