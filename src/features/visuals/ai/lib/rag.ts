import { cosine } from './embeddings';

/**
 * Retrieval-augmented generation, illustrated with a made-up shop help center. The "embeddings" are
 * hand-placed 2-D vectors (real ones have hundreds of numbers); the cosine similarity and the ranking are
 * computed for real from them. The answers are fixed example text, not output from a model.
 */

export type Chunk = { id: number; title: string; text: string; x: number; y: number };

function vec(degrees: number, radius = 1): { x: number; y: number } {
  const r = (degrees * Math.PI) / 180;
  return { x: Math.round(radius * Math.cos(r) * 100) / 100, y: Math.round(radius * Math.sin(r) * 100) / 100 };
}

export const CHUNKS: readonly Chunk[] = [
  { id: 1, title: 'Returns', text: 'You can return most items within 30 days of delivery for a full refund.', ...vec(15) },
  { id: 2, title: 'Delivery', text: 'Standard delivery takes 3 to 5 business days within the Philippines.', ...vec(100) },
  { id: 3, title: 'Shipping abroad', text: 'We currently ship to the Philippines, Singapore and Malaysia.', ...vec(120) },
  { id: 4, title: 'Refunds', text: 'Refunds go back to the original payment method within 7 days after we receive the item.', ...vec(35) },
  { id: 5, title: 'Gift cards', text: 'Gift cards never expire and cannot be exchanged for cash.', ...vec(210) },
];

export const QUESTION_IDS = ['returns', 'shipping'] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export const QUESTIONS: Readonly<Record<QuestionId, { text: string; x: number; y: number }>> = {
  returns: { text: 'How long do I have to return an item?', ...vec(22, 0.9) },
  shipping: { text: 'Do you ship to Singapore?', ...vec(115, 0.9) },
};

export const TOP_K = 2;

export type Ranked = { chunk: Chunk; similarity: number };

/** Every chunk scored against the question by cosine similarity, best first. */
export function rankChunks(question: { x: number; y: number }, chunks: readonly Chunk[] = CHUNKS): Ranked[] {
  return chunks.map((chunk) => ({ chunk, similarity: cosine(question, chunk) })).sort((a, b) => b.similarity - a.similarity || a.chunk.id - b.chunk.id);
}

export function retrieve(question: { x: number; y: number }, k = TOP_K, chunks: readonly Chunk[] = CHUNKS): Ranked[] {
  return rankChunks(question, chunks).slice(0, k);
}

/** The prompt sent to the model: instructions, the retrieved chunks as numbered sources, then the question. */
export function buildPrompt(question: string, sources: readonly Chunk[], instruction: string): string[] {
  if (sources.length === 0) return [question];
  return [instruction, ...sources.map((chunk, i) => `[${i + 1}] ${chunk.text}`), `Question: ${question}`];
}

export function vectorText(vector: { x: number; y: number }): string {
  return `[${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}]`;
}
