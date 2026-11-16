import { findLesson, findProject } from '@/features/courses/content';
import type { Lesson, LessonBlock } from '@/features/courses/content/types';

/**
 * What the learner is doing in Talino when they open Tali, so the answer is about THAT lesson, quiz question,
 * exercise or project and not a generic one. The app sends only ids; the server looks the content up in the
 * bundled catalog (the source of truth for course details), so a modified app can't put its own text into
 * Tali's instructions and Tali never has to guess what a lesson says.
 *
 * Pure: no React, no native modules (the server route imports this).
 */
export type CoachFocus =
  | { kind: 'lesson'; lessonId: string }
  /** A quiz question the learner is on or just missed (`null` = the lesson's quiz in general). */
  | { kind: 'quiz'; lessonId: string; questionId: string | null }
  | { kind: 'activity'; lessonId: string; activityId: string }
  | { kind: 'project'; projectId: string }
  | { kind: 'resume' };

export type CoachFocusKind = CoachFocus['kind'];

const ID = /^[a-z0-9][a-z0-9-]{0,80}$/;
const isId = (value: unknown): value is string => typeof value === 'string' && ID.test(value);

/** The one-string form used in a link (`/tali?focus=…`) and on the wire's context. Ids never contain ":". */
export function focusToParam(focus: CoachFocus): string {
  switch (focus.kind) {
    case 'lesson':
      return `lesson:${focus.lessonId}`;
    case 'quiz':
      return `quiz:${focus.lessonId}:${focus.questionId ?? '-'}`;
    case 'activity':
      return `activity:${focus.lessonId}:${focus.activityId}`;
    case 'project':
      return `project:${focus.projectId}`;
    case 'resume':
      return 'resume';
  }
}

/** Reads a link's `focus` value back; anything that isn't a well-formed focus is null (nothing is looked up here). */
export function focusFromParam(value: unknown): CoachFocus | null {
  if (typeof value !== 'string') return null;
  const [kind, a, b] = value.split(':');
  if (kind === 'resume' && a === undefined) return { kind: 'resume' };
  if (kind === 'lesson' && isId(a) && b === undefined) return { kind: 'lesson', lessonId: a };
  if (kind === 'quiz' && isId(a) && (b === '-' || isId(b))) return { kind: 'quiz', lessonId: a, questionId: b === '-' ? null : b };
  if (kind === 'activity' && isId(a) && isId(b)) return { kind: 'activity', lessonId: a, activityId: b };
  if (kind === 'project' && isId(a) && b === undefined) return { kind: 'project', projectId: a };
  return null;
}

/**
 * The server's check of a focus from the request body: the shape AND that it names real catalog content, so nothing
 * unknown ever reaches the prompt. A quiz question or exercise that doesn't exist falls back to its lesson.
 */
export function sanitizeFocus(value: unknown): CoachFocus | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Record<string, unknown>;
  if (raw.kind === 'resume') return { kind: 'resume' };
  if (raw.kind === 'project') return isId(raw.projectId) && findProject(raw.projectId) ? { kind: 'project', projectId: raw.projectId } : null;
  if (!isId(raw.lessonId)) return null;
  const found = findLesson(raw.lessonId);
  if (!found) return null;
  const lessonId = raw.lessonId;
  if (raw.kind === 'lesson') return { kind: 'lesson', lessonId };
  if (raw.kind === 'quiz') return { kind: 'quiz', lessonId, questionId: isId(raw.questionId) && found.lesson.quiz.some((question) => question.id === raw.questionId) ? raw.questionId : null };
  if (raw.kind === 'activity') {
    if (isId(raw.activityId) && activityOf(found.lesson, raw.activityId)) return { kind: 'activity', lessonId, activityId: raw.activityId };
    return { kind: 'lesson', lessonId };
  }
  return null;
}

type FoundActivity = Extract<LessonBlock, { type: 'activity' }>['activity'];

function activityOf(lesson: Lesson, activityId: string): FoundActivity | undefined {
  for (const block of lesson.body) if (block.type === 'activity' && block.activity.id === activityId) return block.activity;
  return undefined;
}

const stripInline = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '$1');
const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/** The lesson's own teaching as plain text (the blocks every learner sees; code and tables are summarised, not copied in full). */
function lessonText(lesson: Lesson, max: number): string {
  const lines: string[] = [];
  for (const block of lesson.body) {
    if (block.audience) continue;
    switch (block.type) {
      case 'paragraph':
      case 'tip':
      case 'warning':
        lines.push(stripInline(block.text));
        break;
      case 'heading':
        lines.push(`## ${stripInline(block.text)}`);
        break;
      case 'list':
        lines.push(...block.items.map((item) => `- ${stripInline(item)}`));
        break;
      case 'code':
        lines.push(`(code example, ${block.language}) ${clip(block.code.replace(/\s+/g, ' '), 160)}`);
        break;
      case 'details':
        lines.push(stripInline(block.summary));
        break;
      case 'table':
        lines.push(`(table: ${block.headers.join(' | ')})`);
        break;
      default:
        break;
    }
  }
  return clip(lines.join('\n'), max);
}

function takeawaysOf(lesson: Lesson): string[] {
  const block = lesson.body.find((entry): entry is Extract<LessonBlock, { type: 'takeaways' }> => entry.type === 'takeaways');
  return block ? block.items.map(stripInline) : [];
}

function lessonHeader(lesson: Lesson, courseTitle: string): string {
  return `the lesson "${lesson.title}" (day ${lesson.day} of "${courseTitle}", about ${lesson.minutes} minutes). Summary: ${lesson.summary}`;
}

/**
 * Lines for the "Right now the learner is…" part of Tali's instructions, from the catalog. English on purpose: they are
 * instructions to the model, and the reply language comes from the language rules. Empty when the focus names nothing real.
 */
export function describeFocus(focus: CoachFocus | null | undefined): string[] {
  if (!focus) return [];
  if (focus.kind === 'resume') {
    return [
      'Right now the learner is building or improving their résumé, profile or job application material in Talino. Help with structure, clear and honest wording, strong action verbs and measurable results, ATS-friendly formatting, and tailoring to a job post. Never invent employers, titles, dates, numbers, skills or achievements: ask what really happened and work from that, or write a clearly marked placeholder such as [number].',
    ];
  }
  if (focus.kind === 'project') {
    const found = findProject(focus.projectId);
    if (!found) return [];
    const { course, project } = found;
    const steps = project.steps.filter((step) => !step.audience).map((step) => step.text);
    return [
      `Right now the learner is working on the project "${project.title}" in "${course.title}". Help them make progress on their own work: practical next steps, what to check, how to fix what is stuck. Do not write the whole project for them.`,
      steps.length > 0 ? `Project steps:\n${steps.map((step, index) => `${index + 1}. ${stripInline(step)}`).join('\n')}` : '',
      project.rubric.length > 0 ? `The project is reviewed against: ${project.rubric.map(stripInline).join('; ')}.` : '',
    ].filter(Boolean);
  }
  const found = findLesson(focus.lessonId);
  if (!found) return [];
  const { course, lesson } = found;
  const header = lessonHeader(lesson, course.title);

  if (focus.kind === 'lesson') {
    const objectives = lesson.intro?.objectives ?? [];
    const takeaways = takeawaysOf(lesson);
    return [
      `Right now the learner has ${header}. Explain things in terms of this lesson, use its words, and connect your examples to it.`,
      objectives.length > 0 ? `By the end of the lesson they should be able to: ${objectives.map(stripInline).join('; ')}.` : '',
      `The lesson's own text (Talino's course content: the source of truth for this lesson; do not contradict it, and do not invent details it doesn't contain):\n"""\n${lessonText(lesson, 2200)}\n"""`,
      takeaways.length > 0 ? `The lesson's key takeaways: ${takeaways.join('; ')}.` : '',
    ].filter(Boolean);
  }

  if (focus.kind === 'quiz') {
    const question = focus.questionId ? lesson.quiz.find((entry) => entry.id === focus.questionId) : undefined;
    if (!question) return [`Right now the learner is taking the quiz of ${header}. Help them understand the ideas without giving answers away.`, `The lesson's key takeaways: ${takeawaysOf(lesson).join('; ')}.`].filter(Boolean);
    const letters = 'ABCDEFGH';
    return [
      `Right now the learner is on a quiz question from ${header}.`,
      `The question: ${stripInline(question.prompt)}\nChoices:\n${question.choices.map((choice, index) => `${letters[index]}) ${stripInline(choice)}`).join('\n')}`,
      `For your eyes only: the correct answer is ${letters[question.answer]}) ${stripInline(question.choices[question.answer])}. Why: ${stripInline(question.explanation)} When the aim is learning, do not simply state the letter: first find out what they picked or why, explain the idea in the lesson that decides it, and lead them toward it. Only name the correct answer if they have tried and still ask for it, or after they got it right.`,
      `The lesson's key takeaways: ${takeawaysOf(lesson).join('; ')}.`,
    ];
  }

  const activity = activityOf(lesson, focus.activityId);
  if (!activity) return [];
  const code = 'code' in activity && typeof activity.code === 'string' ?`\nThe code they see:\n\`\`\`\n${clip(activity.code, 1200)}\n\`\`\`` : '';
  return [
    `Right now the learner is on a practice exercise after ${header}: "${activity.title}" (${activity.kind}, about ${activity.conceptLabel ?? activity.concept}). What they were asked: ${stripInline(activity.prompt)}${code}`,
    `Hints Talino already has, from gentle to strong: ${activity.hints.map((hint, index) => `(${index + 1}) ${stripInline(hint)}`).join(' ')}`,
    `For your eyes only: why the answer is the answer: ${stripInline(activity.explanation)}. Help with progressive hints, one small step at a time: first ask what they tried, then nudge at the concept, then point to the exact place, and show a full solution only if they ask for it after trying. Never open with the answer.`,
  ];
}

/** A short title for the context chip on the chat screen ("Lesson: …"); null when the focus names nothing real. */
export function focusTitle(focus: CoachFocus | null | undefined): { kind: CoachFocusKind; title: string } | null {
  if (!focus) return null;
  if (focus.kind === 'resume') return { kind: 'resume', title: '' };
  if (focus.kind === 'project') {
    const found = findProject(focus.projectId);
    return found ? { kind: 'project', title: found.project.title } : null;
  }
  const found = findLesson(focus.lessonId);
  if (!found) return null;
  if (focus.kind === 'activity') return { kind: 'activity', title: activityOf(found.lesson, focus.activityId)?.title ?? found.lesson.title };
  return { kind: focus.kind, title: found.lesson.title };
}
