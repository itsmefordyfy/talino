import { softmax } from './llm-math';

/**
 * "One token's journey through a Transformer": a simple schematic on the sentence "The cat sat on the". Every number (token ids, embeddings, position
 * numbers, attention scores, the tiny feed-forward matrix, the candidate scores) is made up for teaching. The arithmetic done on them (adding the
 * position, softmax, the weighted mix, the matrix step, the final softmax) is real, but this is not any real model.
 */

export const FLOW_STEP_IDS = ['tokens', 'embed', 'position', 'attention', 'ffn', 'layers', 'predict'] as const;
export type FlowStepId = (typeof FLOW_STEP_IDS)[number];

/** The sentence's tokens live in the strings file; there are five. Made-up ids ("The" and "the" are different tokens, so different ids). */
export const FLOW_TOKEN_IDS: readonly number[] = [7, 31, 58, 14, 12];
export const FLOW_TOKEN_COUNT = FLOW_TOKEN_IDS.length;

/** Three numbers per token, for the page. Real embeddings have hundreds or thousands. */
const EMBEDDINGS: readonly (readonly number[])[] = [
  [0.2, 0.8, -0.3],
  [0.9, 0.1, 0.6],
  [-0.4, 0.7, 0.5],
  [0.1, -0.6, 0.8],
  [0.3, 0.7, -0.2],
];

/** A made-up position signal for places 1 to 5, added to the embedding so the model can tell "cat sat" from "sat cat". */
const POSITIONS: readonly (readonly number[])[] = [
  [0, 0.1, 0],
  [0.1, 0, 0.1],
  [0.2, -0.1, 0],
  [0.3, 0, -0.1],
  [0.4, -0.1, 0.1],
];

/** Row i: how relevant each of the tokens up to and including i is to token i. A token never looks ahead, so the later cells do not exist. */
const ATTENTION_SCORES: readonly (readonly number[])[] = [[1], [0.5, 1], [0.2, 2, 1], [0, 1.2, 1.8, 1], [0.4, 2.4, 1.6, 1.4, 1]];

/** A tiny made-up feed-forward step: keep the old numbers, and add the positive part of a fixed mix of them. */
const MIX: readonly (readonly number[])[] = [
  [0.9, -0.4, 0.3],
  [0.2, 0.8, -0.5],
  [-0.3, 0.6, 0.7],
];

/** Made-up scores for four possible next tokens (the strings file names them in the same order). Real models score every token they know. */
export const FLOW_CANDIDATE_SCORES: readonly number[] = [3, 2.3, 1.7, 0.2];

const add = (a: readonly number[], b: readonly number[]): number[] => a.map((value, index) => value + b[index]);

export type FlowData = {
  embeddings: number[][];
  positions: number[][];
  /** Embedding + position for each token. */
  withPosition: number[][];
  /** Row i: the attention weights token i gives to tokens 0..i (adding up to 1). */
  attentionWeights: number[][];
  /** Each token's new vector: the weighted mix of the vectors it looks at. */
  attended: number[][];
  /** After the feed-forward step, token by token. */
  processed: number[][];
  candidateProbabilities: number[];
  /** The most likely candidate. */
  pickedCandidate: number;
};

export function buildFlow(): FlowData {
  const embeddings = EMBEDDINGS.map((vector) => [...vector]);
  const positions = POSITIONS.map((vector) => [...vector]);
  const withPosition = embeddings.map((vector, index) => add(vector, positions[index]));
  const attentionWeights = ATTENTION_SCORES.map((scores) => softmax(scores));
  const attended = attentionWeights.map((weights) =>
    withPosition[0].map((_, dimension) => weights.reduce((total, weight, source) => total + weight * withPosition[source][dimension], 0)),
  );
  const processed = attended.map((vector) => add(vector, MIX.map((row) => Math.max(0, row.reduce((total, factor, dimension) => total + factor * vector[dimension], 0)))));
  const candidateProbabilities = softmax(FLOW_CANDIDATE_SCORES);
  return { embeddings, positions, withPosition, attentionWeights, attended, processed, candidateProbabilities, pickedCandidate: candidateProbabilities.indexOf(Math.max(...candidateProbabilities)) };
}
