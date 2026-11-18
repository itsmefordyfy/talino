import { describe, expect, jest, test } from '@jest/globals';
import { act, type ComponentType } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { findVisual } from '../../registry';
import { llmAttentionStrings } from '../llm-attention-strings';
import { llmSamplingStrings } from '../llm-sampling-strings';
import { llmTransformerStrings } from '../llm-transformer-strings';
import { ATTENTION_SENTENCE_IDS, attentionFor, blendOf, defaultQuery, sentenceLength } from '../lib/llm-attention';
import { drawSeed, drawTokens, SAMPLING_LOGITS, SAMPLING_PROMPT_IDS, sampleTable, DEFAULT_SETTINGS } from '../lib/llm-sampling';
import { FLOW_STEP_IDS, FLOW_TOKEN_COUNT } from '../lib/llm-transformer';
import { LlmAttentionVisual } from './llm-attention';
import { LlmSamplingVisual } from './llm-sampling';
import { LlmTransformerFlowVisual } from './llm-transformer-flow';

// The native pieces the shared components draw with have no Jest implementation; stand-ins keep the tree real.
jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false, isGlassEffectAPIAvailable: () => false }));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-haptics', () => ({ impactAsync: async () => {}, notificationAsync: async () => {}, ImpactFeedbackStyle: { Light: 'light' }, NotificationFeedbackType: { Success: 'success' } }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: 'Svg', Svg: 'Svg', Circle: 'Circle', Line: 'Line', Rect: 'Rect' }));
store.dispatch(languageChanged('en'));

type Renderer = ReturnType<typeof createRoot>;
type Fiber = { return: Fiber | null; memoizedProps: Record<string, unknown> | null };

const textOf = (node: TestInstance | string): string => (typeof node === 'string' ? node : node.children.map((child) => textOf(child)).join(''));
const labelled = (renderer: Renderer, label: string) => renderer.container.queryAll((instance) => instance.props.accessibilityLabel === label);

async function call(renderer: Renderer, label: string, handler: 'onPress' | 'onValueChange', ...args: unknown[]) {
  const [node] = labelled(renderer, label);
  if (!node) throw new Error(`nothing labelled "${label}"`);
  let fiber = node.unstable_fiber as Fiber | null;
  while (fiber && typeof fiber.memoizedProps?.[handler] !== 'function') fiber = fiber.return;
  if (!fiber) throw new Error(`"${label}" has no ${handler}`);
  const fn = fiber.memoizedProps?.[handler] as (...values: unknown[]) => void;
  await act(async () => {
    fn(...args);
  });
}
const press = (renderer: Renderer, label: string) => call(renderer, label, 'onPress');
const pressTimes = async (renderer: Renderer, label: string, times: number) => {
  for (let n = 0; n < times; n += 1) await press(renderer, label);
};

async function mount(Component: ComponentType<{ compact?: boolean }>, compact = false) {
  const renderer = createRoot();
  await act(async () => {
    renderer.render(
      <Provider store={store}>
        <Component compact={compact} />
      </Provider>,
    );
  });
  return { renderer, text: () => textOf(renderer.container) };
}

const wordsOf = (id: (typeof ATTENTION_SENTENCE_IDS)[number]) => llmAttentionStrings.en.sentences[id].words;

describe('the three LLM visuals are registered', () => {
  test('each is in the AI category with topics, and says it is an illustration', () => {
    for (const id of ['llm-attention', 'llm-sampling', 'llm-transformer-flow']) {
      const visual = findVisual(id);
      expect(visual?.category).toBe('ai');
      expect(visual?.topics.length).toBeGreaterThan(4);
      expect(visual?.description).toMatch(/illustration|made-up/i);
    }
  });
});

describe('self-attention strings match the data', () => {
  const t = llmAttentionStrings.en;

  test('every sentence has as many words as the scores expect, and every note names a real word', () => {
    for (const id of ATTENTION_SENTENCE_IDS) expect(t.sentences[id].words).toHaveLength(sentenceLength(id));
    for (const key of Object.keys(t.meaningNotes)) {
      const [id, query] = key.split(':') as [(typeof ATTENTION_SENTENCE_IDS)[number], string];
      expect(ATTENTION_SENTENCE_IDS).toContain(id);
      expect(Number(query)).toBe(defaultQuery(id));
    }
  });
});

describe('self-attention', () => {
  const t = llmAttentionStrings.en;

  test('starts on "it" in the trophy sentence, with the blend and the note, weights summing to 100%', async () => {
    const view = await mount(LlmAttentionVisual);
    const words = wordsOf('trophy');
    const blend = blendOf(attentionFor('trophy', 'links', 9));
    expect(view.text()).toContain(t.blendLine('it', blend.top.map((row) => ({ word: words[row.index], percent: row.percent })), blend.restPercent, blend.restCount));
    expect(view.text()).toContain(t.meaningNotes['trophy:9']);
    expect(view.text()).toContain(t.totalLabel(100));
    expect(view.text()).toContain(t.illustration);
    expect(labelled(view.renderer, t.queryCell('it'))).toHaveLength(1);
    await act(async () => view.renderer.unmount());
  });

  test('tapping another word makes it the one that is looking', async () => {
    const view = await mount(LlmAttentionVisual);
    const percent = attentionFor('trophy', 'links', 9).find((row) => row.index === 1)?.percent ?? 0;
    await press(view.renderer, t.weightCell('trophy', 'it', percent));
    expect(labelled(view.renderer, t.queryCell('trophy'))).toHaveLength(1);
    expect(view.text()).toContain('“trophy” now carries a blend');
    expect(view.text()).not.toContain(t.meaningNotes['trophy:9']);
    await act(async () => view.renderer.unmount());
  });

  test('another head pays attention to different words, and another sentence starts on its own word', async () => {
    const view = await mount(LlmAttentionVisual);
    expect(view.text()).toContain(t.heads.links.note);
    await press(view.renderer, t.heads.nearby.name);
    expect(view.text()).toContain(t.heads.nearby.note);
    expect(view.text()).not.toContain(t.meaningNotes['trophy:9']);
    expect(view.text()).toContain('“it” now carries a blend: ');
    await press(view.renderer, t.sentences.bank.label);
    expect(labelled(view.renderer, t.queryCell('bank'))).toHaveLength(1);
    await press(view.renderer, t.heads.links.name);
    expect(view.text()).toContain(t.meaningNotes['bank:4']);
    await act(async () => view.renderer.unmount());
  });

  test('Show the steps walks scores, weights and the new meaning', async () => {
    const view = await mount(LlmAttentionVisual);
    expect(view.text()).not.toContain(t.steps.scores.title);
    await call(view.renderer, t.showSteps, 'onValueChange', true);
    expect(view.text()).toContain(t.steps.scores.explain);
    expect(view.text()).not.toContain(t.totalLabel(100));
    expect(labelled(view.renderer, t.scoreCell('trophy', 'it', 4.2))).toHaveLength(1);
    await press(view.renderer, t.stepChoice(2, t.steps.weights.label));
    expect(view.text()).toContain(t.steps.weights.explain);
    expect(view.text()).toContain(t.totalLabel(100));
    expect(view.text()).not.toContain(t.blendTitle);
    await press(view.renderer, t.stepChoice(3, t.steps.blend.label));
    expect(view.text()).toContain(t.steps.blend.explain);
    expect(view.text()).toContain(t.blendTitle);
    await act(async () => view.renderer.unmount());
  });

  test('the compact variant keeps the picture, the controls and the disclaimer', async () => {
    const view = await mount(LlmAttentionVisual, true);
    expect(view.text()).toContain(t.illustration);
    expect(view.text()).not.toContain(t.meaningNotes['trophy:9']);
    expect(labelled(view.renderer, t.heads.nearby.name)).toHaveLength(1);
    await act(async () => view.renderer.unmount());
  });
});

describe('sampling strings match the data', () => {
  test('every prompt names ten tokens', () => {
    for (const id of SAMPLING_PROMPT_IDS) expect(llmSamplingStrings.en.prompts[id].tokens).toHaveLength(SAMPLING_LOGITS[id].length);
  });
});

describe('sampling', () => {
  const t = llmSamplingStrings.en;

  test('starts with temperature 1 and no filters: nothing is out and the table adds up to 100%', async () => {
    const view = await mount(LlmSamplingVisual);
    expect(view.text()).toContain(t.prompts.learn.text);
    expect(view.text()).toContain('Temperature 1.0 leaves the table');
    expect(view.text()).toContain('Top-k is off.');
    expect(view.text()).toContain('Top-p is off.');
    expect(view.text()).not.toContain(`✕ ${t.outWord}`);
    expect(view.text()).toContain(t.illustration);
    await act(async () => view.renderer.unmount());
  });

  test('top-k marks the cut tokens "out" in words, with the reason', async () => {
    const view = await mount(LlmSamplingVisual);
    await pressTimes(view.renderer, 'Decrease Top-k', 7);
    expect(view.text().split(`✕ ${t.outWord}`)).toHaveLength(8);
    expect(view.text()).toContain(t.outReason['top-k']);
    expect(view.text()).toContain('Top-k 3 dropped all but the 3 most likely (7 out).');
    // The cut row's spoken label says it is out, why, and what it was before filtering.
    const cut = sampleTable(SAMPLING_LOGITS.learn, { ...DEFAULT_SETTINGS, topK: 3 })[5];
    const spoken = view.renderer.container.queryAll((instance) => typeof instance.props.accessibilityLabel === 'string' && (instance.props.accessibilityLabel as string).startsWith(`${t.prompts.learn.tokens[cut.index]}, out, ${t.outReason['top-k']}`));
    expect(spoken).toHaveLength(1);
    await act(async () => view.renderer.unmount());
  });

  test('a low temperature sharpens, a tiny top-p keeps one token', async () => {
    const view = await mount(LlmSamplingVisual);
    await pressTimes(view.renderer, 'Decrease Temperature', 5);
    expect(view.text()).toContain('Temperature 0.5 sharpens the table');
    await pressTimes(view.renderer, 'Decrease Top-p', 18);
    expect(view.text()).toContain('Top-p 0.10');
    expect(view.text()).toContain('Only 1 token can be picked now.');
    await act(async () => view.renderer.unmount());
  });

  test('Draw 10 times lists repeatable tokens, and the next press draws different ones', async () => {
    const view = await mount(LlmSamplingVisual);
    expect(view.text()).toContain(t.drawsNone);
    const finals = sampleTable(SAMPLING_LOGITS.learn, DEFAULT_SETTINGS).map((candidate) => candidate.final);
    const order = (press: number) => t.drawsOrder(drawTokens(finals, 10, drawSeed(0, press)).map((index) => t.prompts.learn.tokens[index]));
    await press(view.renderer, t.drawButton);
    expect(view.text()).toContain(order(1));
    await press(view.renderer, t.drawButton);
    expect(view.text()).toContain(order(2));
    expect(order(1)).not.toBe(order(2));
    await act(async () => view.renderer.unmount());
  });

  test('Reset puts the settings and the draws back and is disabled when nothing changed', async () => {
    const view = await mount(LlmSamplingVisual);
    const [reset] = labelled(view.renderer, t.reset);
    expect(reset.props.accessibilityState?.disabled).toBe(true);
    await pressTimes(view.renderer, 'Increase Temperature', 3);
    expect(view.text()).toContain('Temperature 1.3 flattens the table');
    await press(view.renderer, t.drawButton);
    await press(view.renderer, t.reset);
    expect(view.text()).toContain('Temperature 1.0 leaves the table');
    expect(view.text()).toContain(t.drawsNone);
    await act(async () => view.renderer.unmount());
  });

  test('changing the prompt shows its tokens and clears the draws', async () => {
    const view = await mount(LlmSamplingVisual);
    await press(view.renderer, t.drawButton);
    await press(view.renderer, t.prompts.capital.label);
    expect(view.text()).toContain(t.prompts.capital.text);
    expect(view.text()).toContain('Paris');
    expect(view.text()).toContain(t.drawsNone);
    await act(async () => view.renderer.unmount());
  });

  test('the compact variant says it is an illustration and drops the extras', async () => {
    const view = await mount(LlmSamplingVisual, true);
    expect(view.text()).toContain(t.illustration);
    expect(view.text()).not.toContain(t.idea);
    await act(async () => view.renderer.unmount());
  });
});

describe('transformer flow', () => {
  const t = llmTransformerStrings.en;

  test('has a name and four candidate words for every step, in step order', () => {
    expect(t.tokens).toHaveLength(FLOW_TOKEN_COUNT);
    expect(t.candidates).toHaveLength(4);
    for (const id of FLOW_STEP_IDS) for (const field of ['name', 'input', 'happens', 'output', 'caption'] as const) expect(t.steps[id][field].length).toBeGreaterThan(5);
  });

  test('starts at step 1 and steps forward and back through all seven', async () => {
    const view = await mount(LlmTransformerFlowVisual);
    expect(view.text()).toContain(`1. ${t.steps.tokens.name}`);
    expect(view.text()).toContain(t.steps.tokens.caption);
    expect(view.text()).toContain(t.inLabel);
    expect(view.text()).toContain(t.steps.tokens.happens);
    expect(view.text()).toContain(t.steps.tokens.output);
    expect(labelled(view.renderer, t.progressLabel(1, 7, t.steps.tokens.name))).toHaveLength(1);
    for (let index = 1; index < FLOW_STEP_IDS.length; index += 1) {
      await press(view.renderer, 'Next');
      expect(view.text()).toContain(`${index + 1}. ${t.steps[FLOW_STEP_IDS[index]].name}`);
    }
    await press(view.renderer, 'Back');
    expect(view.text()).toContain(`6. ${t.steps.layers.name}`);
    expect(view.text()).toContain(t.layersCount);
    expect(view.text()).toContain(t.layersNote);
    await press(view.renderer, 'Reset');
    expect(view.text()).toContain(`1. ${t.steps.tokens.name}`);
    await act(async () => view.renderer.unmount());
  });

  test('the last step shows four candidates that add up to 100% and the pick', async () => {
    const view = await mount(LlmTransformerFlowVisual);
    await pressTimes(view.renderer, 'Next', 6);
    expect(view.text()).toContain(t.candidatesTitle);
    expect(view.text()).toContain(t.pickedLabel('mat'));
    const rows = view.renderer.container.queryAll((instance) => typeof instance.props.accessibilityLabel === 'string' && /% chance/.test(instance.props.accessibilityLabel as string));
    expect(rows).toHaveLength(4);
    const total = rows.reduce((sum, row) => sum + Number(/(\d+)% chance/.exec(row.props.accessibilityLabel as string)?.[1]), 0);
    expect(total).toBe(100);
    await act(async () => view.renderer.unmount());
  });

  test('the attention step shows weights that add up to 100% for the last token', async () => {
    const view = await mount(LlmTransformerFlowVisual);
    await pressTimes(view.renderer, 'Next', 3);
    const rows = view.renderer.container.queryAll((instance) => typeof instance.props.accessibilityLabel === 'string' && /% of the attention/.test(instance.props.accessibilityLabel as string));
    expect(rows).toHaveLength(FLOW_TOKEN_COUNT);
    expect(rows.reduce((sum, row) => sum + Number(/(\d+)% of the attention/.exec(row.props.accessibilityLabel as string)?.[1]), 0)).toBe(100);
    await act(async () => view.renderer.unmount());
  });

  test('the compact variant still says it is a schematic', async () => {
    const view = await mount(LlmTransformerFlowVisual, true);
    await pressTimes(view.renderer, 'Next', 5);
    expect(view.text()).toContain(t.illustration);
    expect(view.text()).not.toContain(t.layersNote);
    await act(async () => view.renderer.unmount());
  });
});
