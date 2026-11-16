import { tokenize, type Token } from './tokenizer';

/**
 * A simplified illustration of next-token prediction: fixed example probabilities for a few prompts, a
 * temperature that really does reshape them, and a seeded dice roll. It is NOT a language model and its
 * numbers are made up for teaching.
 */

export const PROMPT_IDS = ['sky', 'like', 'code'] as const;
export type PromptId = (typeof PROMPT_IDS)[number];

export const END = '<end>';

type Candidate = { token: string; p: number };

type Table = { prompt: string; start: Candidate[]; next: Record<string, Candidate[]> };

const dot: Candidate[] = [{ token: '.', p: 1 }];

export const TABLES: Readonly<Record<PromptId, Table>> = {
  sky: {
    prompt: 'The sky is',
    start: [{ token: ' blue', p: 0.55 }, { token: ' clear', p: 0.2 }, { token: ' dark', p: 0.12 }, { token: ' grey', p: 0.08 }, { token: ' falling', p: 0.05 }],
    next: {
      ' blue': [{ token: '.', p: 0.6 }, { token: ' and', p: 0.3 }, { token: ',', p: 0.1 }],
      ' clear': [{ token: '.', p: 0.5 }, { token: ' and', p: 0.5 }],
      ' dark': [{ token: '.', p: 0.7 }, { token: ' and', p: 0.3 }],
      ' grey': dot,
      ' falling': dot,
      ' and': [{ token: ' bright', p: 0.4 }, { token: ' calm', p: 0.35 }, { token: ' cold', p: 0.25 }],
      ',': [{ token: ' and', p: 1 }],
      ' bright': dot,
      ' calm': dot,
      ' cold': dot,
    },
  },
  like: {
    prompt: 'I like to',
    start: [{ token: ' read', p: 0.3 }, { token: ' play', p: 0.25 }, { token: ' cook', p: 0.2 }, { token: ' learn', p: 0.15 }, { token: ' sleep', p: 0.1 }],
    next: {
      ' read': [{ token: ' books', p: 0.6 }, { token: ' comics', p: 0.25 }, { token: '.', p: 0.15 }],
      ' play': [{ token: ' games', p: 0.5 }, { token: ' guitar', p: 0.3 }, { token: '.', p: 0.2 }],
      ' cook': [{ token: ' dinner', p: 0.6 }, { token: ' rice', p: 0.3 }, { token: '.', p: 0.1 }],
      ' learn': [{ token: ' new', p: 0.5 }, { token: ' code', p: 0.3 }, { token: '.', p: 0.2 }],
      ' sleep': [{ token: '.', p: 0.7 }, { token: ' late', p: 0.3 }],
      ' new': [{ token: ' things', p: 1 }],
      ' books': dot,
      ' comics': dot,
      ' games': dot,
      ' guitar': dot,
      ' dinner': dot,
      ' rice': dot,
      ' code': dot,
      ' things': dot,
      ' late': dot,
    },
  },
  code: {
    prompt: 'Learning to code is',
    start: [{ token: ' fun', p: 0.3 }, { token: ' hard', p: 0.25 }, { token: ' useful', p: 0.2 }, { token: ' great', p: 0.15 }, { token: ' slow', p: 0.1 }],
    next: {
      ' fun': [{ token: '.', p: 0.6 }, { token: ' and', p: 0.4 }],
      ' hard': [{ token: '.', p: 0.7 }, { token: ' and', p: 0.3 }],
      ' useful': dot,
      ' slow': dot,
      ' great': [{ token: '.', p: 0.6 }, { token: ' and', p: 0.4 }],
      ' and': [{ token: ' useful', p: 0.6 }, { token: ' rewarding', p: 0.4 }],
      ' rewarding': dot,
    },
  },
};

export const TEMPERATURES = [0.2, 0.7, 1.5] as const;
export type Temperature = (typeof TEMPERATURES)[number];

/**
 * Applies a temperature: p' is proportional to p^(1/T), the same as softmax over log-probabilities divided
 * by T. A low T sharpens the distribution (the likeliest token wins more often); a high T flattens it.
 */
export function applyTemperature(candidates: readonly Candidate[], temperature: number): Candidate[] {
  const t = Math.max(0.05, temperature);
  const live = candidates.filter((candidate) => candidate.p > 0);
  const weights = live.map((candidate) => Math.exp(Math.log(candidate.p) / t));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return live.map((candidate, i) => ({ token: candidate.token, p: weights[i] / total }));
}

/** A repeatable number in [0, 1) from a seed and a step (a small integer hash), standing in for the dice. */
export function roll(seed: number, step: number): number {
  let h = (seed * 374761393 + step * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Picks a candidate: the first whose running total passes `u`. */
export function pick(candidates: readonly Candidate[], u: number): number {
  let running = 0;
  for (let i = 0; i < candidates.length; i += 1) {
    running += candidates[i].p;
    if (u < running) return i;
  }
  return candidates.length - 1;
}

export type GenStep =
  | { kind: 'input'; text: string }
  | { kind: 'tokens'; tokens: Token[] }
  | { kind: 'model' }
  | { kind: 'predict'; generated: string; candidates: Candidate[]; chosen: number; u: number }
  | { kind: 'output'; text: string; tokenCount: number };

const MAX_GENERATED = 5;

/** The whole run as steps: text in, tokens, the model, one probability step per generated token, text out. */
export function buildGeneration(prompt: PromptId, temperature: number, seed: number): GenStep[] {
  const table = TABLES[prompt];
  const steps: GenStep[] = [{ kind: 'input', text: table.prompt }, { kind: 'tokens', tokens: tokenize(table.prompt) }, { kind: 'model' }];
  const generated: string[] = [];
  let last: string | null = null;
  for (let step = 0; step < MAX_GENERATED; step += 1) {
    const raw = last === null ? table.start : (table.next[last] ?? dot);
    const candidates = applyTemperature(raw, temperature);
    const u = roll(seed, step);
    const chosen = pick(candidates, u);
    steps.push({ kind: 'predict', generated: generated.join(''), candidates, chosen, u });
    const token = candidates[chosen].token;
    generated.push(token);
    last = token;
    if (token === '.') break;
  }
  const text = `${table.prompt}${generated.join('')}`;
  steps.push({ kind: 'output', text, tokenCount: tokenize(text).length });
  return steps;
}
