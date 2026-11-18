import { defineStrings } from '@/lib/i18n';

import type { SamplingFacts, SamplingSettings, SamplingPromptId } from './lib/llm-sampling';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'Choosing the next token: temperature, top-k and top-p',
  summary: 'Change temperature, top-k and top-p and watch a made-up table of next-word probabilities change, then draw from it.',
  description:
    'An illustration of how a language model picks its next token, with made-up scores. Pick a prompt and you see ten candidate tokens with a bar for each. Temperature reshapes the probabilities: low makes the top choice stronger, high flattens the table. Top-k keeps only the k most likely tokens. Top-p keeps the smallest set of top tokens whose probabilities add up to p. Tokens that are dropped are dimmed, dashed and marked out. After the filters the rest are renormalised so they add up to 100 percent. Draw 10 times picks ten tokens with a seeded random generator, so the same press always gives the same result. Reset puts the settings back. The numbers are made up; this is not a real model.',
  topics: ['temperature', 'top-k', 'top-p', 'nucleus sampling', 'sampling', 'softmax', 'logits', 'next token', 'greedy decoding', 'randomness', 'llm', 'how ai works'],
  illustration: 'Illustration with made-up scores for ten candidate tokens (the maths on them is real). A real model scores tens of thousands of tokens at every step.',
  promptLabel: 'Prompt',
  prompts: {
    learn: { label: 'Learning', text: 'The best way to learn is to', tokens: ['practice', 'read', 'try', 'teach', 'ask', 'build', 'listen', 'watch', 'rest', 'guess'] },
    capital: { label: 'Capital city', text: 'The capital of France is', tokens: ['Paris', 'the', 'a', 'Lyon', 'known', 'Marseille', 'located', 'France', 'beautiful', 'Berlin'] },
    story: { label: 'Story', text: 'Once upon a time, there was a', tokens: ['little', 'young', 'king', 'princess', 'dragon', 'girl', 'wizard', 'village', 'cat', 'robot'] },
  } satisfies Record<SamplingPromptId, { label: string; text: string; tokens: string[] }>,
  nextToken: 'next token',
  temperatureLabel: 'Temperature',
  topKLabel: 'Top-k',
  topPLabel: 'Top-p',
  all: 'All',
  tableTitle: 'Chance of each next token',
  outWord: 'out',
  outReason: { 'top-k': 'cut by top-k', 'top-p': 'cut by top-p' },
  scoreWord: 'score',
  smallPercent: '<1%',
  rowLabel: (token: string, kept: boolean, percent: string, reason: string, before: string) => (kept ? `${token}, ${percent} chance` : `${token}, out, ${reason}, was ${before} before filtering`),
  legend: 'Filled bar: final chance. Outline: chance after temperature only. Out: dropped by a filter.',
  drawButton: 'Draw 10 times',
  reset: 'Reset',
  drawsTitle: 'Draws with these settings',
  drawsNone: 'Press Draw 10 times to pick ten tokens from the table above.',
  drawsOrder: (tokens: readonly string[]) => `In order: ${tokens.join(', ')}.`,
  drawCount: (token: string, n: number) => `${token} × ${n}`,
  drawCountLabel: (token: string, n: number) => `${token} was drawn ${n} ${n === 1 ? 'time' : 'times'}`,
  drawsNote: 'Same random numbers each press, so changing a setting shows how it changes the draws.',
  explain: (facts: SamplingFacts, settings: SamplingSettings, top: string, count: number) => {
    const at = Math.round(facts.topAtOne * 100);
    const now = Math.round(facts.topFinal * 100);
    const temperature =
      facts.temperatureEffect === 'sharper'
        ? `Temperature ${settings.temperature.toFixed(1)} sharpens the table: the favourite, “${top}”, rises from ${at}% to about ${now}%.`
        : facts.temperatureEffect === 'flatter'
          ? `Temperature ${settings.temperature.toFixed(1)} flattens the table: unlikely tokens get a better chance.`
          : 'Temperature 1.0 leaves the table as the scores made it.';
    const k = settings.topK >= count ? 'Top-k is off.' : `Top-k ${settings.topK} dropped all but the ${settings.topK} most likely (${facts.outByK} out).`;
    const p = settings.topP >= 1 ? 'Top-p is off.' : facts.outByP > 0 ? `Top-p ${settings.topP.toFixed(2)} kept the smallest top set reaching ${Math.round(settings.topP * 100)}% and dropped ${facts.outByP} more.` : `Top-p ${settings.topP.toFixed(2)} had nothing more to drop here.`;
    const left = facts.keptCount === 1 ? 'Only 1 token can be picked now.' : `${facts.keptCount} tokens can be picked now, and their chances add up to 100%.`;
    return `${temperature} ${k} ${p} ${left}`;
  },
  idea: 'Low temperature and small top-k or top-p make answers predictable; high values make them more varied and more likely to go off course.',
};

export const llmSamplingStrings = defineStrings({ en, fil: en });
export type LlmSamplingText = typeof en;
