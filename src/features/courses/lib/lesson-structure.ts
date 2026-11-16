import type { Activity } from '../../activities/types';
import { EXPERIENCE_LEVELS, inAudience } from '../content/levels';
import type { Lesson, LessonBlock } from '../content/types';

/**
 * How every lesson is taught, in one place. The app and the content tests both use this, and it is the
 * contract any generated or server-patched lesson must meet (`lessonStructureProblems`).
 *
 *   learn     intro (objectives, why it matters) → explanations, visuals, code → key takeaways
 *   quiz      the knowledge check, with the reason behind every answer
 *   practice  interactive activities and the laptop task, which reinforce what was just taught
 *   complete  results, XP and progress, then the next lesson
 *
 * Nothing in `quiz` or `practice` is reachable before `learn`, and activities are drawn only in `practice`,
 * wherever the author placed them in `body`.
 */
export const LESSON_STAGES = ['learn', 'quiz', 'practice', 'complete'] as const;
export type LessonStage = (typeof LESSON_STAGES)[number];

/** Explanations a lesson must carry before it may test anything (about a two-minute read). */
export const MIN_TEACHING_WORDS = 250;

type ActivityBlock = Extract<LessonBlock, { type: 'activity' }>;

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** Words of actual explanation in these blocks: prose, lists, tips, tables and "show more" text; code counts half. Prompts and activities are practice, not teaching. */
export function teachingWords(blocks: readonly LessonBlock[]): number {
  let total = 0;
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
      case 'heading':
      case 'tip':
      case 'warning':
      case 'version':
        total += words(block.text);
        break;
      case 'list':
        total += block.items.reduce((sum, item) => sum + words(item), 0);
        break;
      case 'details':
        total += words(block.summary) + block.body.reduce((sum, item) => sum + words(item), 0);
        break;
      case 'table':
        total += block.rows.reduce((sum, row) => sum + row.reduce((inner, cell) => inner + words(cell), 0), 0);
        break;
      case 'code':
        total += Math.round(words(block.code) / 2);
        break;
      default:
        break;
    }
  }
  return total;
}

/** The lesson's teaching (activities removed, key takeaways always last) and its activities in their authored order. */
export function splitLesson(body: readonly LessonBlock[]): { learn: LessonBlock[]; activities: Activity[] } {
  const activities = body.filter((block): block is ActivityBlock => block.type === 'activity').map((block) => block.activity);
  const rest = body.filter((block) => block.type !== 'activity');
  const takeaways = rest.filter((block) => block.type === 'takeaways');
  return { learn: [...rest.filter((block) => block.type !== 'takeaways'), ...takeaways], activities };
}

/** Everything wrong with a lesson's shape, in plain words. Empty means it can be shipped. */
export function lessonStructureProblems(lesson: Lesson): string[] {
  const problems: string[] = [];
  const { learn } = splitLesson(lesson.body);

  if (!lesson.intro) problems.push('missing intro');
  else {
    const { objectives, why } = lesson.intro;
    if (objectives.length < 2 || objectives.length > 4) problems.push(`intro needs 2 to 4 objectives, has ${objectives.length}`);
    if (objectives.some((objective) => words(objective) < 3)) problems.push('an objective is too short to say anything');
    if (words(why) < 8) problems.push('intro "why" is too short');
  }

  if (learn[0]?.type !== 'paragraph') problems.push('teaching must open with a paragraph');
  const takeaways = learn.filter((block) => block.type === 'takeaways');
  if (takeaways.length === 0) problems.push('missing takeaways');
  if (takeaways.length > 1) problems.push('more than one takeaways block');

  // The shared teaching (blocks with no audience) must stand on its own: a level-specific block adds to it, it never replaces it, so no
  // learner is ever missing a concept. The first block is shared too.
  const shared = learn.filter((block) => !block.audience);
  if (learn[0]?.audience) problems.push('the first teaching block must be for everyone (no audience)');
  const taught = teachingWords(shared);
  if (taught < MIN_TEACHING_WORDS) problems.push(`only ${taught} words of shared teaching; a lesson needs at least ${MIN_TEACHING_WORDS} for everyone before it tests anything (level-specific blocks only add to it)`);

  // An adapted lesson adds questions for a level; what any one learner is asked still stays 3 to 6 (3 to 5 for a lesson with one shared quiz).
  const adaptedQuiz = lesson.quiz.some((question) => question.audience);
  if (!adaptedQuiz) {
    if (lesson.quiz.length < 3 || lesson.quiz.length > 5) problems.push(`quiz has ${lesson.quiz.length} questions, needs 3 to 5`);
  } else {
    for (const level of EXPERIENCE_LEVELS) {
      const asked = lesson.quiz.filter((question) => inAudience(question.audience, level)).length;
      if (asked < 3 || asked > 6) problems.push(`${level} would be asked ${asked} quiz questions, needs 3 to 6`);
    }
  }
  for (const question of lesson.quiz) if (question.explanation.trim().length < 20) problems.push(`${question.id} has no explanation of why the answer is right`);

  return problems;
}
