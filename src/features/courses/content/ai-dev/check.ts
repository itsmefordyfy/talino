import { validateActivity } from '../../../activities';
import { findVisual } from '../../../visuals';
import { lessonStructureProblems } from '../../lib/lesson-structure';
import { pathCourseProblems } from '../../lib/path-rules';
import type { Course } from '../types';

/**
 * Every rule a path course must meet, in one list of plain-word problems: the catalog's content rules
 * (ids, quiz shape, skills, projects), the teach-first lesson structure, the path's syllabus and
 * version-note rules, and each activity's own validator. Used by each course's test and by
 * `content.test.ts`; an empty list means the course can ship.
 */
export function allCourseProblems(course: Course, today: Date = new Date()): string[] {
  const problems: string[] = [...pathCourseProblems(course, today)];
  const skillIds = new Set(course.skills.map((skill) => skill.id));
  if (skillIds.size !== course.skills.length) problems.push('duplicate skill ids');
  const ids = new Set<string>();
  const unique = (id: string) => {
    if (ids.has(id)) problems.push(`duplicate id ${id}`);
    ids.add(id);
  };

  course.lessons.forEach((lesson, index) => {
    unique(lesson.id);
    if (lesson.day !== index + 1) problems.push(`${lesson.id} day should be ${index + 1}`);
    if (lesson.id !== `${course.id}-${String(index + 1).padStart(2, '0')}`) problems.push(`${lesson.id} id should be ${course.id}-${String(index + 1).padStart(2, '0')}`);
    for (const problem of lessonStructureProblems(lesson)) problems.push(`${lesson.id}: ${problem}`);
    if (lesson.skills.length === 0 || lesson.skills.some((skill) => !skillIds.has(skill))) problems.push(`${lesson.id} skills must be ids from the course's skills`);
    for (const question of lesson.quiz) {
      unique(question.id);
      if (!question.id.startsWith(`${lesson.id}-q`)) problems.push(`${question.id} should start with ${lesson.id}-q`);
      if (question.choices.length < 3 || question.answer < 0 || question.answer >= question.choices.length) problems.push(`${question.id} needs 3+ choices and a valid answer`);
    }
    if (lesson.task.steps.length === 0) problems.push(`${lesson.id} task has no steps`);
    for (const block of lesson.body) {
      if (block.type === 'activity') {
        unique(block.activity.id);
        if (!block.activity.id.startsWith(`${lesson.id}-`)) problems.push(`${block.activity.id} should start with ${lesson.id}-`);
        for (const problem of validateActivity(block.activity)) problems.push(`${block.activity.id}: ${problem}`);
      }
      if (block.type === 'visual' && !findVisual(block.id)) problems.push(`${lesson.id} uses a visual that does not exist: ${block.id}`);
      if (block.type === 'table' && block.rows.some((row) => row.length !== block.headers.length)) problems.push(`${lesson.id} has a table with uneven rows`);
      if (block.type === 'takeaways' && (block.items.length < 2 || block.items.length > 6)) problems.push(`${lesson.id} takeaways need 2 to 6 items`);
    }
  });
  for (const skill of course.skills) if (!course.lessons.some((lesson) => lesson.skills.includes(skill.id))) problems.push(`skill ${skill.id} is never taught`);
  course.projects.forEach((project, index) => {
    unique(project.id);
    if (project.id !== `${course.id}-p${index + 1}`) problems.push(`${project.id} should be ${course.id}-p${index + 1}`);
    if (project.unlockAfterDay < 1 || project.unlockAfterDay > course.lessons.length) problems.push(`${project.id} unlockAfterDay out of range`);
    if (project.rubric.length < 3 || project.rubric.length > 6) problems.push(`${project.id} needs 3 to 6 rubric items`);
    for (const step of project.steps) unique(step.id);
  });
  return problems;
}
