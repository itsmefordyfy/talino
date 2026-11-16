/**
 * The evaluation after an interview: the model's JSON (Gemini's response schema), checked, and the rules that keep the score
 * honest. The overall score is the average of the category scores (never a separate number the model could contradict them
 * with), an answer's verdict follows its score, every answer carries a reason, and a recommended course must be one that exists.
 */

export const CATEGORY_IDS = ['relevance', 'technical', 'communication', 'clarity', 'confidence', 'problem_solving', 'critical_thinking', 'experience', 'project_explanation'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export const REPORT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    categories: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { id: { type: 'STRING', enum: [...CATEGORY_IDS] }, score: { type: 'INTEGER' }, feedback: { type: 'STRING' } }, required: ['id', 'score', 'feedback'] },
    },
    answers: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { turn: { type: 'INTEGER' }, question: { type: 'STRING' }, score: { type: 'INTEGER' }, why: { type: 'STRING' }, improvedKind: { type: 'STRING', enum: ['answer', 'outline'] }, improved: { type: 'STRING' } },
        required: ['turn', 'question', 'score', 'why', 'improvedKind', 'improved'],
      },
    },
    skills: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { skill: { type: 'STRING' }, why: { type: 'STRING' }, courseId: { type: 'STRING' } }, required: ['skill', 'why', 'courseId'] },
    },
    nextSteps: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['summary', 'categories', 'answers', 'skills', 'nextSteps'],
} as const;

export type CategoryScore = { id: CategoryId; score: number; feedback: string };
export type AnswerVerdict = 'strong' | 'ok' | 'weak';
/** `answer`: a stronger version built from what the learner said. `outline`: they gave nothing to build on, so it is a structure to fill in with their own real example, never a made-up story. */
export type ImprovedKind = 'answer' | 'outline';
export type AnswerFeedback = {
  /** Which of the learner's answers, counting from 1 in the order they were given. */
  turn: number;
  question: string;
  /** 1 to 5. */
  score: number;
  verdict: AnswerVerdict;
  why: string;
  improvedKind: ImprovedKind;
  improved: string;
};
export type SkillGap = { skill: string; why: string; courseId: string | null };
export type Rating = 'excellent' | 'good' | 'fair' | 'needs_improvement';

export type InterviewReport = {
  /** 0 to 100: the average of the category scores. */
  overall: number;
  rating: Rating;
  summary: string;
  categories: CategoryScore[];
  answers: AnswerFeedback[];
  skills: SkillGap[];
  nextSteps: string[];
};

/** How good the overall score is, in the words the learner reads. */
export function ratingFor(score: number): Rating {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'needs_improvement';
}

/** One answer's verdict from its 1 to 5 score. */
export const verdictFor = (score: number): AnswerVerdict => (score >= 4 ? 'strong' : score >= 3 ? 'ok' : 'weak');

/** The fewest answers an interview needs before a score means anything. */
export const MIN_ANSWERS_FOR_REPORT = 2;
/** The fewest categories a report must score to count as one. */
const MIN_CATEGORIES = 5;

const asText = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const clampInt = (value: unknown, min: number, max: number): number | null => (typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, Math.round(value))) : null);

export type ParseOptions = {
  /** How many answers the learner gave: a feedback entry can only point at one of them. */
  answerCount: number;
  /** The ids of the courses that exist: a recommendation for any other id is kept as a skill with no course. */
  courseIds: ReadonlySet<string>;
};

/** The model's JSON checked for shape; null when it isn't a usable report (too few categories, or no feedback on any answer). */
export function parseReport(text: string, options: ParseOptions): InterviewReport | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null) return null;
  const value = raw as Record<string, unknown>;
  const summary = asText(value.summary, 900);
  if (!summary) return null;

  const seen = new Set<string>();
  const categories: CategoryScore[] = [];
  for (const item of Array.isArray(value.categories) ? value.categories : []) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    const id = entry.id as CategoryId;
    const score = clampInt(entry.score, 0, 100);
    if (!(CATEGORY_IDS as readonly string[]).includes(id) || seen.has(id) || score === null) continue;
    seen.add(id);
    categories.push({ id, score, feedback: asText(entry.feedback, 500) });
  }
  if (categories.length < MIN_CATEGORIES) return null;
  categories.sort((a, b) => CATEGORY_IDS.indexOf(a.id) - CATEGORY_IDS.indexOf(b.id));

  const turns = new Set<number>();
  const answers: AnswerFeedback[] = [];
  for (const item of Array.isArray(value.answers) ? value.answers : []) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    // Not clamped: feedback for "answer 9" of 4 must be dropped, never attached to a different answer.
    const turn = typeof entry.turn === 'number' && Number.isInteger(entry.turn) ? entry.turn : null;
    const score = clampInt(entry.score, 1, 5);
    const why = asText(entry.why, 600);
    // An answer needs its reason, or the score is just a number.
    if (turn === null || turn < 1 || turn > options.answerCount || score === null || !why || turns.has(turn)) continue;
    turns.add(turn);
    // An unknown or missing kind is the cautious one: it is never presented as the learner's own stronger answer.
    answers.push({ turn, question: asText(entry.question, 300), score, verdict: verdictFor(score), why, improvedKind: entry.improvedKind === 'answer' ? 'answer' : 'outline', improved: asText(entry.improved, 900) });
  }
  if (answers.length === 0) return null;
  answers.sort((a, b) => a.turn - b.turn);

  const skills: SkillGap[] = (Array.isArray(value.skills) ? value.skills : [])
    .map((item): SkillGap | null => {
      if (typeof item !== 'object' || item === null) return null;
      const entry = item as Record<string, unknown>;
      const skill = asText(entry.skill, 100);
      const courseId = typeof entry.courseId === 'string' && options.courseIds.has(entry.courseId) ? entry.courseId : null;
      return skill ? { skill, why: asText(entry.why, 300), courseId } : null;
    })
    .filter((skill): skill is SkillGap => skill !== null)
    .slice(0, 5);
  const nextSteps = (Array.isArray(value.nextSteps) ? value.nextSteps : []).map((step) => asText(step, 300)).filter(Boolean).slice(0, 4);

  const overall = Math.round(categories.reduce((sum, category) => sum + category.score, 0) / categories.length);
  return { overall, rating: ratingFor(overall), summary, categories, answers, skills, nextSteps };
}

/** The answers worth showing as strongest first (best score first), at most `limit`. */
export const strongestAnswers = (report: InterviewReport, limit = 3): AnswerFeedback[] =>
  report.answers
    .filter((answer) => answer.verdict === 'strong')
    .sort((a, b) => b.score - a.score || a.turn - b.turn)
    .slice(0, limit);

/** The answers the learner struggled with, weakest first. */
export const weakestAnswers = (report: InterviewReport, limit = 5): AnswerFeedback[] =>
  report.answers
    .filter((answer) => answer.verdict === 'weak')
    .sort((a, b) => a.score - b.score || a.turn - b.turn)
    .slice(0, limit);

/** Questions to practise again: the ones this report marked weak (those with no question text are left out). */
export const questionsToPractise = (report: InterviewReport): string[] =>
  weakestAnswers(report)
    .map((answer) => answer.question)
    .filter(Boolean);

export type Comparison = { overall: number; categories: { id: CategoryId; delta: number }[] };

/** How this attempt differs from an earlier one: the overall change and each category both reports scored. */
export function compareReports(previous: InterviewReport, current: InterviewReport): Comparison {
  const before = new Map(previous.categories.map((category) => [category.id, category.score]));
  return {
    overall: current.overall - previous.overall,
    categories: current.categories.filter((category) => before.has(category.id)).map((category) => ({ id: category.id, delta: category.score - (before.get(category.id) ?? 0) })),
  };
}

/** Change from the previous score to the latest, for the history's "improving" line: null with fewer than two attempts. */
export function trendOf(scoresOldestFirst: readonly number[]): number | null {
  if (scoresOldestFirst.length < 2) return null;
  return scoresOldestFirst[scoresOldestFirst.length - 1] - scoresOldestFirst[scoresOldestFirst.length - 2];
}

/** The stored report text read back; null when it is damaged (the screen then offers to evaluate again). */
export function readStoredReport(text: string | null | undefined): InterviewReport | null {
  if (!text) return null;
  try {
    const value = JSON.parse(text) as Partial<InterviewReport>;
    if (typeof value.overall !== 'number' || !Array.isArray(value.categories) || !Array.isArray(value.answers) || typeof value.summary !== 'string') return null;
    return { overall: value.overall, rating: ratingFor(value.overall), summary: value.summary, categories: value.categories, answers: value.answers, skills: Array.isArray(value.skills) ? value.skills : [], nextSteps: Array.isArray(value.nextSteps) ? value.nextSteps : [] };
  } catch {
    return null;
  }
}
