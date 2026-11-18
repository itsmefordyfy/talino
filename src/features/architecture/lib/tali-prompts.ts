import { MATRIX_LIMITS, type MatrixState } from './tradeoff';

/** The most of the learner's own text put in a prompt: the chat box and the address both stay small, and the review only needs the shape of the work. */
export const MAX_PROMPT_WORK_CHARS = 1500;

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}\n… (clipped)` : text);

export const DIAGRAM_REVIEW_QUESTION = 'Review this diagram: what assumptions does it make, what is missing, and what would you ask me?';
export const MATRIX_REVIEW_QUESTION = 'Review this trade-off matrix: are the criteria and weights fair for the decision, which of my scores am I most likely to be wrong about, and what is missing?';

/** The prompt that opens a Tali chat about the learner's diagram: their Mermaid text (clipped) and the question. Nothing is sent until the learner sends it. */
export function reviewDiagramPrompt(source: string): string {
  const text = source.replace(/\r\n?/g, '\n').trim();
  return text ? `Here is my diagram, written as Mermaid text:\n\n${clip(text, MAX_PROMPT_WORK_CHARS)}\n\n${DIAGRAM_REVIEW_QUESTION}` : DIAGRAM_REVIEW_QUESTION;
}

/** The matrix as plain lines (options, then each criterion with its weight and the scores given), so the review can read it without any app format. */
export function matrixAsText(state: MatrixState): string {
  const lines: string[] = [];
  if (state.question.trim()) lines.push(`Decision: ${state.question.trim()}`);
  lines.push(`Options: ${state.options.map((option) => option.name).join('; ')}`);
  lines.push(`Criteria (weight 1 to ${MATRIX_LIMITS.maxRating}, scores 1 to ${MATRIX_LIMITS.maxRating}):`);
  for (const criterion of state.criteria) {
    const scores = state.options.map((option) => `${option.name} ${criterion.scores[option.id] ?? 'not scored'}`).join(', ');
    lines.push(`- ${criterion.name} (weight ${criterion.weight}): ${scores}`);
  }
  return lines.join('\n');
}

export function reviewMatrixPrompt(state: MatrixState): string {
  return `Here is my trade-off matrix:\n\n${clip(matrixAsText(state), MAX_PROMPT_WORK_CHARS)}\n\n${MATRIX_REVIEW_QUESTION}`;
}
