import { defineStrings } from '@/lib/i18n';

import type { FlowStepId } from './lib/llm-transformer';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'One token’s journey through a Transformer',
  summary: 'Step through how “The cat sat on the” becomes a list of likely next words, one stage at a time.',
  description:
    'An illustration of the stages a Transformer language model goes through to predict the next token, using the sentence The cat sat on the and made-up numbers. Use Next and Back to step through seven stages: text becomes tokens, tokens become embeddings (lists of numbers), position information is added, self-attention lets each token gather information from the others, a feed-forward step processes each token on its own, the last two repeat in many stacked layers, and finally the model scores every possible next token, turns the scores into probabilities and picks one. Each step shows what goes in, what happens and what comes out. It is a simple schematic, not a diagram of any real product, and the numbers are made up.',
  topics: ['transformer', 'llm', 'architecture', 'tokens', 'embeddings', 'positional encoding', 'self-attention', 'feed-forward', 'layers', 'next token prediction', 'softmax', 'how ai works'],
  illustration: 'A simple schematic with made-up numbers, not any real model. Real models use much longer lists of numbers, many more layers and a vocabulary of tens of thousands of tokens.',
  sentence: 'The cat sat on the',
  tokens: ['The', 'cat', 'sat', 'on', 'the'],
  stepWord: (n: number, total: number) => `Step ${n} of ${total}`,
  progressLabel: (n: number, total: number, name: string) => `Step ${n} of ${total}: ${name}`,
  inLabel: 'Goes in',
  happensLabel: 'What happens',
  outLabel: 'Comes out',
  steps: {
    tokens: {
      name: 'Text to tokens',
      input: 'The text “The cat sat on the”.',
      happens: 'The text is cut into tokens, small pieces of text, and each piece gets an id number from the model’s list.',
      output: 'Five token ids, one per piece.',
      caption: 'The model never sees letters or words, only a row of token ids.',
    },
    embed: {
      name: 'Tokens to embeddings',
      input: 'The five token ids.',
      happens: 'Each id is swapped for a list of numbers, its embedding, that stands for what the token tends to mean.',
      output: 'Five lists of numbers (three each here, many hundreds in a real model).',
      caption: 'Every token becomes a list of numbers, so the model can do maths with meaning.',
    },
    position: {
      name: 'Add position information',
      input: 'The five embeddings.',
      happens: 'A list of numbers for each place in the sentence is added, so the model can tell “cat sat” from “sat cat”.',
      output: 'Five lists of the same size, now carrying where each token sits.',
      caption: 'Adding each token’s place to its numbers is how the model keeps track of word order.',
    },
    attention: {
      name: 'Self-attention',
      input: 'The five lists, with positions.',
      happens: 'Each token scores the tokens before it, softmax turns the scores into weights, and it takes a blend of their lists in those proportions.',
      output: 'Five new lists. Each one now carries information from the tokens it paid attention to.',
      caption: 'Each token gathers information from the others, here the last “the” looks mostly at “cat”.',
    },
    ffn: {
      name: 'Feed-forward',
      input: 'The five lists after attention.',
      happens: 'The same small network processes each token’s list on its own, with no mixing between tokens, and adds the result to the old list.',
      output: 'Five processed lists of the same size.',
      caption: 'After attention gathers, the feed-forward step thinks about each token’s mix by itself.',
    },
    layers: {
      name: 'Repeat: many layers',
      input: 'The five processed lists.',
      happens: 'Attention and feed-forward form one layer. The lists go through a whole stack of layers, each with its own learned numbers.',
      output: 'Five lists of the same size, refined by every layer.',
      caption: 'Real models stack many layers and the number differs by model.',
    },
    predict: {
      name: 'Scores to the next token',
      input: 'The final list for the last token, “the”.',
      happens: 'The model scores every token it knows, softmax turns the scores into probabilities that add up to 100%, and one token is picked.',
      output: 'A list of probabilities for the next token, and one chosen from it.',
      caption: 'The last list becomes a score for every possible next token, and one is picked.',
    },
  } satisfies Record<FlowStepId, { name: string; input: string; happens: string; output: string; caption: string }>,
  tokenId: 'id',
  embeddingLabel: 'embedding',
  positionLabel: 'position',
  sumLabel: 'sum',
  beforeLabel: 'before',
  afterLabel: 'after',
  attendTitle: 'What the last “the” looks at',
  attendRow: (token: string, percent: number) => `${token}, ${percent}% of the attention`,
  tokenRow: (token: string, lines: string) => `${token}: ${lines}`,
  layersTitle: 'A stack of layers',
  layerBlock: (n: number) => `Layer ${n}: attention, then feed-forward`,
  layerMore: '…',
  layerLast: 'Layer N: attention, then feed-forward',
  layersCount: '× N layers',
  layersNote: 'Real models use many layers, from about a dozen to over a hundred, and the number differs by model.',
  candidatesTitle: 'Chance of each next token',
  candidates: [' mat', ' floor', ' sofa', ' roof'],
  scoreWord: 'score',
  candidateRow: (token: string, score: number, percent: number, picked: boolean) => `${token.trim()}, score ${score}, ${percent}% chance${picked ? ', picked' : ''}`,
  pickedLabel: (token: string) => `Picked: ${token}`,
  vocabularyNote: 'Only four candidates are shown, so their chances add up to 100% here. A real list covers every token the model knows.',
  pickNote: 'This picks the most likely one; real models may instead draw from the probabilities (see the sampling visual).',
};

export const llmTransformerStrings = defineStrings({ en, fil: en });
export type LlmTransformerText = typeof en;
