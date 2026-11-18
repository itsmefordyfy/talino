import { defineStrings } from '@/lib/i18n';

import type { AttentionHeadId, AttentionSentenceId, AttentionStepId } from './lib/llm-attention';

const quoted = (word: string) => `“${word}”`;
const joinList = (items: readonly string[]) => (items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'Self-attention: which words does a word look at?',
  summary: 'Tap a word and see how much attention it pays to every other word, and why “it” can point at the right thing.',
  description:
    'An illustration of self-attention with made-up numbers. Pick one of three example sentences and tap a word: that word is the one looking. Every other word gets a weight, shown as a bar and a percentage, and the weights add up to 100 percent. Switch between two heads to see that different heads pay attention to different things: one follows who or what a word refers to, the other looks at nearby words. Turn on Show the steps to walk through the scores, the softmax that turns them into weights, and the blend that gives the word its new meaning. The scores are hand-written, the softmax is real arithmetic, and this is not a real model.',
  topics: ['self-attention', 'attention', 'attention head', 'multi-head attention', 'softmax', 'query key value', 'transformer', 'llm', 'coreference', 'context', 'how ai works'],
  illustration: 'Illustration with hand-written scores (the softmax is real arithmetic). Real models have many heads and many layers, and their patterns are far less neat.',
  sentenceLabel: 'Example sentence',
  sentences: {
    trophy: { label: 'Trophy and suitcase', words: ['The', 'trophy', 'did', 'not', 'fit', 'in', 'the', 'suitcase', 'because', 'it', 'was', 'too', 'big'] },
    animal: { label: 'Animal and street', words: ['The', 'animal', 'did', 'not', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'] },
    bank: { label: 'River bank', words: ['She', 'sat', 'on', 'the', 'bank', 'of', 'the', 'river', 'and', 'watched', 'the', 'water'] },
  } satisfies Record<AttentionSentenceId, { label: string; words: string[] }>,
  sentenceText: (words: readonly string[]) => `${words.join(' ')}.`,
  headLabel: 'Attention head',
  heads: {
    links: { name: 'Who or what does it refer to?', note: 'This head follows links of meaning: what a pronoun points at, what an adjective describes, which word a verb goes with.' },
    nearby: { name: 'Nearby words', note: 'This head mostly looks at the words right next to the word. Different heads pay attention to different things, and the model uses them all.' },
  } satisfies Record<AttentionHeadId, { name: string; note: string }>,
  tapHint: 'Tap any word to make it the one that is looking. The others show how much attention it gives them.',
  queryMark: 'looking',
  showSteps: 'Show the steps',
  stepsLabel: 'Step',
  steps: {
    scores: { label: 'Scores', title: 'Step 1: scores', explain: 'Step 1: the model gives every other word a score for how useful it is to the word that is looking. A higher score means more useful. Here the scores are hand-written numbers.' },
    weights: { label: 'Weights', title: 'Step 2: softmax makes weights', explain: 'Step 2: softmax turns the scores into weights. Each is positive, a bigger score gets a bigger share, and together they make exactly 100%.' },
    blend: { label: 'New meaning', title: 'Step 3: a new meaning', explain: 'Step 3: the word’s new meaning is a blend of the other words, mixed in those proportions.' },
  } satisfies Record<AttentionStepId, { label: string; title: string; explain: string }>,
  stepChoice: (n: number, label: string) => `${n}. ${label}`,
  weightsTitle: 'Attention weights',
  totalLabel: (percent: number) => `Total: ${percent}%`,
  blendTitle: 'The word’s new meaning',
  blendLine: (word: string, top: readonly { word: string; percent: number }[], restPercent: number, restCount: number) => {
    const parts = top.map((row) => `${row.percent}% ${quoted(row.word)}`);
    if (restCount > 0) parts.push(`${restPercent}% spread over ${restCount} other ${restCount === 1 ? 'word' : 'words'}`);
    return `${quoted(word)} now carries a blend: ${joinList(parts)}.`;
  },
  meaningNotes: {
    'trophy:9': 'So “it” mostly carries “trophy”: the thing that is too big is the trophy. Change “big” to “small” and a real model would look at “suitcase” instead.',
    'animal:8': 'So “it” mostly carries “animal”: the one that is too tired is the animal, not the street.',
    'bank:4': 'So “bank” mostly carries “river”: here it means the side of a river, not a place that keeps money.',
  } as Record<string, string>,
  queryCell: (word: string) => `${word}, the word that is looking. Tap another word to change it`,
  weightCell: (word: string, query: string, percent: number) => `${word}, ${percent}% of the attention from ${quoted(query)}`,
  scoreCell: (word: string, query: string, score: number) => `${word}, score ${score} for ${quoted(query)}`,
  strongest: (items: string) => `Looks at most: ${items}`,
};

export const llmAttentionStrings = defineStrings({ en, fil: en });
export type LlmAttentionText = typeof en;
