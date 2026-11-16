import symbols from '../../../components/ui/material-symbols.json';
import { validateActivity } from '../../activities';
import { findVisual } from '../../visuals';
import { parseMermaidSubset, validateDiagram } from '../../visuals/diagrams';
import { getSyllabus, MASTERCLASS_MIN_LESSONS, MINI_MAX_LESSONS, STANDARD_MAX_LESSONS, STANDARD_MIN_LESSONS } from '../content/catalog/syllabus';
import type { Course } from '../content/types';
import { lessonStructureProblems } from './lesson-structure';
import { EXPERIENCE_LEVELS, levelIndex, type Audience } from '../content/levels';
import { isOfficialSource, versionBlocks } from './path-rules';

/**
 * Everything a course of the wider catalog (`kind: 'standard'`) must meet before it ships, as plain-word problems
 * (empty = ready). It sits on top of the teach-first lesson contract (`lesson-structure.ts`) and adds: the syllabus
 * (one lesson per topic, in order, at the right level), real learning objectives, at least one activity per lesson,
 * dated and officially-sourced version notes (most lessons of a fast-moving subject), varied quiz answers, and a
 * final project. `today` is injectable for tests.
 */

/**
 * Courses exempt from the five-level adaptation check (docs/content/ADAPTATION_BRIEF.md). Empty: every course of the AI-first catalog
 * carries the level pieces from the start.
 */
export const NOT_YET_ADAPTED: ReadonlySet<string> = new Set<string>();

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

/** Share of a volatile course's lessons that must carry a dated, sourced version note. */
export const VOLATILE_NOTE_SHARE = 0.6;

export function standardCourseProblems(course: Course, today: Date = new Date()): string[] {
  const problems: string[] = [];
  const syllabus = getSyllabus(course.id);
  if (!syllabus) return [`${course.id} is not in the catalog syllabus`];

  if (course.kind !== 'standard') problems.push(`${course.id} must have kind 'standard'`);
  if (course.level !== syllabus.level) problems.push(`${course.id} level must be ${syllabus.level}`);
  if (course.title !== syllabus.title) problems.push(`${course.id} title must be "${syllabus.title}"`);
  if (syllabus.topics.length < STANDARD_MIN_LESSONS || syllabus.topics.length > STANDARD_MAX_LESSONS) problems.push(`${course.id} syllabus must have ${STANDARD_MIN_LESSONS} to ${STANDARD_MAX_LESSONS} topics`);
  if (course.lessons.length !== syllabus.topics.length) problems.push(`${course.id} needs ${syllabus.topics.length} lessons (one per syllabus topic), has ${course.lessons.length}`);
  course.lessons.forEach((lesson, index) => {
    if (syllabus.topics[index] && lesson.title !== syllabus.topics[index]) problems.push(`${lesson.id} title must be "${syllabus.topics[index]}"`);
  });

  if (course.tagline.trim().length < 15 || course.tagline.length > 110) problems.push('tagline should be 15 to 110 characters');
  if (course.description.trim().length < 80) problems.push('description is too short (two or three sentences)');
  if (!course.finishLine || course.finishLine.length < 2 || course.finishLine.length > 5) problems.push('finishLine needs 2 to 5 items');
  const objectives = course.objectives ?? [];
  if (objectives.length < 3 || objectives.length > 6) problems.push(`objectives needs 3 to 6 learning objectives, has ${objectives.length}`);
  if (objectives.some((objective) => objective.trim().split(/\s+/).length < 4)) problems.push('an objective is too short to say anything');
  if (course.skills.length < 3 || course.skills.length > 10) problems.push('skills needs 3 to 10 entries');
  if (!isDate(course.updated)) problems.push('updated must be a YYYY-MM-DD review date');
  if (!(course.icon in (symbols as Record<string, number>))) problems.push(`icon "${course.icon}" is not a Material Symbols name`);
  if (course.audiences.length === 0) problems.push('audiences is empty');
  if (course.coachRole) problems.push('a standard course has no coachRole');
  if (course.projects.length < 1) problems.push('needs at least one project');
  else if (!course.projects.some((project) => project.unlockAfterDay >= Math.ceil(course.lessons.length * 0.7))) problems.push('the final project should open late in the course (after about 70% of the lessons)');

  const skillIds = new Set(course.skills.map((skill) => skill.id));
  if (skillIds.size !== course.skills.length) problems.push('duplicate skill ids');
  const ids = new Set<string>();
  const unique = (id: string) => {
    if (ids.has(id)) problems.push(`duplicate id ${id}`);
    ids.add(id);
  };

  // A date is a calendar date with no time zone: an author in Manila (UTC+8) writes a date that is still "yesterday" in UTC, so allow a day of leeway.
  const latest = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) + 2 * 86_400_000;
  let withNotes = 0;
  const answerCounts = new Map<number, number>();
  let questions = 0;
  let longestIsRight = 0;

  course.lessons.forEach((lesson, index) => {
    const expectedId = `${course.id}-${String(index + 1).padStart(2, '0')}`;
    unique(lesson.id);
    if (lesson.id !== expectedId) problems.push(`${lesson.id} id should be ${expectedId}`);
    if (lesson.day !== index + 1) problems.push(`${lesson.id} day should be ${index + 1}`);
    for (const problem of lessonStructureProblems(lesson)) problems.push(`${lesson.id}: ${problem}`);
    if (lesson.minutes < 10 || lesson.minutes > 35) problems.push(`${lesson.id} minutes should be 10 to 35`);
    if (lesson.skills.length === 0 || lesson.skills.some((skill) => !skillIds.has(skill))) problems.push(`${lesson.id} skills must be ids from the course's skills`);
    if (lesson.task.steps.length < 2) problems.push(`${lesson.id} task needs at least two steps`);
    if (!lesson.body.some((block) => block.type === 'activity')) problems.push(`${lesson.id} has no activity`);
    for (const question of lesson.quiz) {
      unique(question.id);
      questions += 1;
      answerCounts.set(question.answer, (answerCounts.get(question.answer) ?? 0) + 1);
      const lengths = question.choices.map((choice) => choice.length);
      if (lengths[question.answer] === Math.max(...lengths) && lengths.filter((length) => length === lengths[question.answer]).length === 1) longestIsRight += 1;
      if (!question.id.startsWith(`${lesson.id}-q`)) problems.push(`${question.id} should start with ${lesson.id}-q`);
      if (question.choices.length < 3 || question.choices.length > 4 || question.answer < 0 || question.answer >= question.choices.length) problems.push(`${question.id} needs 3 or 4 choices and a valid answer`);
      if (new Set(question.choices.map((choice) => choice.trim().toLowerCase())).size !== question.choices.length) problems.push(`${question.id} has two identical choices`);
    }
    const notes = versionBlocks(lesson);
    if (notes.length > 0) withNotes += 1;
    for (const note of notes) {
      if (!isDate(note.checked)) problems.push(`${lesson.id} version note has no valid checked date`);
      else if (Date.parse(`${note.checked}T00:00:00Z`) >= latest) problems.push(`${lesson.id} version note is dated in the future`);
      if (note.sources.length === 0 || note.sources.some((source) => !isOfficialSource(source.url))) problems.push(`${lesson.id} version note must cite only official https documentation`);
      if (note.text.trim().length < 20) problems.push(`${lesson.id} version note says too little`);
    }
    for (const block of lesson.body) {
      if (block.type === 'activity') {
        unique(block.activity.id);
        if (!block.activity.id.startsWith(`${lesson.id}-`)) problems.push(`${block.activity.id} should start with ${lesson.id}-`);
        for (const problem of validateActivity(block.activity)) problems.push(`${block.activity.id}: ${problem}`);
        if (block.activity.kind === 'predict-output' && block.activity.wrongNotes) {
          const choices = new Set(block.activity.choices ?? []);
          for (const key of Object.keys(block.activity.wrongNotes)) if (!choices.has(key)) problems.push(`${block.activity.id}: a wrongNotes key is not one of the choices ("${key.slice(0, 30)}")`);
        }
      }
      if (block.type === 'visual' && !findVisual(block.id)) problems.push(`${lesson.id} uses a visual that does not exist: ${block.id}`);
      if (block.type === 'table' && block.rows.some((row) => row.length !== block.headers.length)) problems.push(`${lesson.id} has a table with uneven rows`);
      if (block.type === 'takeaways' && (block.items.length < 2 || block.items.length > 6)) problems.push(`${lesson.id} takeaways need 2 to 6 items`);
      if (block.type === 'diagram') {
        const result = block.format === 'json' ? validateDiagram(block.source) : typeof block.source === 'string' ? parseMermaidSubset(block.source) : null;
        if (!result) problems.push(`${lesson.id} has a mermaid diagram whose source is not a string`);
        else if (!result.ok) problems.push(`${lesson.id} has a diagram that does not validate: ${result.errors.join('; ')}`);
      }
      if (block.type === 'code' && !block.language.trim()) problems.push(`${lesson.id} has a code block with no language`);
    }
  });

  if (syllabus.volatile && course.lessons.length > 0 && withNotes < Math.ceil(course.lessons.length * VOLATILE_NOTE_SHARE)) {
    problems.push(`${course.id} is a fast-moving subject: at least ${Math.ceil(course.lessons.length * VOLATILE_NOTE_SHARE)} lessons need a dated, officially-sourced version note, ${withNotes} have one`);
  }
  // Writers tend to make the right answer the same slot every time; a course should vary it.
  if (questions >= 8) {
    for (const [slot, count] of answerCounts) if (count / questions > 0.5) problems.push(`more than half of the quiz answers are choice ${slot + 1}; vary where the right answer sits`);
  }
  // The other writer's habit: the right answer is the longest, most carefully worded choice. Learners learn to pick it without reading.
  if (questions >= 10 && longestIsRight / questions > 0.5) problems.push(`the right quiz answer is the single longest choice in ${longestIsRight} of ${questions} questions; make wrong choices as detailed as the right one`);
  for (const skill of course.skills) if (!course.lessons.some((lesson) => lesson.skills.includes(skill.id))) problems.push(`skill ${skill.id} is never taught`);
  course.projects.forEach((project, index) => {
    unique(project.id);
    if (project.id !== `${course.id}-p${index + 1}`) problems.push(`${project.id} should be ${course.id}-p${index + 1}`);
    if (project.unlockAfterDay < 1 || project.unlockAfterDay > course.lessons.length) problems.push(`${project.id} unlockAfterDay out of range`);
    if (project.rubric.length < 3 || project.rubric.length > 6) problems.push(`${project.id} needs 3 to 6 rubric items`);
    if (project.steps.length < 3) problems.push(`${project.id} needs at least three steps`);
    for (const step of project.steps) unique(step.id);
  });
  if (!NOT_YET_ADAPTED.has(course.id)) problems.push(...levelAdaptationProblems(course));
  return problems;
}

const isNewcomer = (audience: Audience | undefined) => !!audience?.max && levelIndex(audience.max) <= levelIndex('beginner') && !audience.min;
const isExperienced = (audience: Audience | undefined) => !!audience?.min && levelIndex(audience.min) >= levelIndex('advanced') && !audience.max;

/** A course is adapted to the five levels when every lesson has a newcomer piece and an experienced piece, a question for each side, and its projects ask more of experienced learners. */
export function levelAdaptationProblems(course: Course): string[] {
  const problems: string[] = [];
  for (const lesson of course.lessons) {
    const blocks = lesson.body.map((block) => block.audience);
    if (!blocks.some(isNewcomer)) problems.push(`${lesson.id} has no plain-language block for newcomers (audience { max: 'beginner' })`);
    if (!blocks.some(isExperienced)) problems.push(`${lesson.id} has no depth block for experienced learners (audience { min: 'advanced' })`);
    if (!lesson.quiz.some((question) => isNewcomer(question.audience))) problems.push(`${lesson.id} has no quiz question for newcomers`);
    if (!lesson.quiz.some((question) => isExperienced(question.audience))) problems.push(`${lesson.id} has no quiz question for advanced learners`);
    if (!lesson.taskExtra || lesson.taskExtra.length === 0) problems.push(`${lesson.id} has no taskExtra`);
  }
  for (const project of course.projects) {
    if (!project.rubricExtra || project.rubricExtra.length === 0) problems.push(`${project.id} has no rubricExtra (a project asks more of advanced learners and less of newcomers)`);
    if (!(project.steps ?? []).some((step) => step.audience)) problems.push(`${project.id} has no step with an audience`);
  }
  // Every one of the five levels is served somewhere in the course.
  for (const level of EXPERIENCE_LEVELS) {
    const served = course.lessons.some((lesson) => lesson.body.some((block) => block.audience && (block.audience.min ? levelIndex(block.audience.min) <= levelIndex(level) : true) && (block.audience.max ? levelIndex(block.audience.max) >= levelIndex(level) : true)));
    if (!served) problems.push(`no lesson has a piece written for ${level}`);
  }
  return problems;
}

/**
 * The course type a standard course is shown as, by length: a mini-course is 7 lessons or fewer, a masterclass 12 or more,
 * and anything between is a plain course. (The first cut was 10, which made 45 of the 73 courses "masterclasses" and the
 * word useless as a filter.)
 */
export function standardCourseType(lessonCount: number): 'mini' | 'course' | 'masterclass' {
  if (lessonCount >= MASTERCLASS_MIN_LESSONS) return 'masterclass';
  return lessonCount <= MINI_MAX_LESSONS ? 'mini' : 'course';
}
