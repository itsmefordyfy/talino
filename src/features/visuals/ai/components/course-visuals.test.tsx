import { describe, expect, jest, test } from '@jest/globals';
import { act, type ComponentType } from 'react';
import { Provider } from 'react-redux';
import { createRoot, type TestInstance } from 'test-renderer';

import { languageChanged } from '@/features/settings/settings-slice';
import { store } from '@/store';

import { findVisual } from '../../registry';
import { agentLoopStrings } from '../agent-loop-strings';
import { contextWindowStrings } from '../context-window-strings';
import { imagePromptStrings } from '../image-prompt-strings';
import { promptAnatomyStrings } from '../prompt-anatomy-strings';
import { AgentLoopVisual } from './agent-loop';
import { ContextWindowVisual } from './context-window';
import { ImagePromptBuilderVisual } from './image-prompt-builder';
import { PromptAnatomyVisual } from './prompt-anatomy';

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

describe('the Generative AI course visuals are registered', () => {
  test('all four exist in the AI category with their topics, and read in English', () => {
    for (const id of ['ai-context-window', 'ai-prompt-anatomy', 'ai-image-prompt-builder', 'ai-agent-loop']) {
      const visual = findVisual(id);
      expect(visual?.category).toBe('ai');
      expect(visual?.topics.length).toBeGreaterThan(4);
      expect(visual?.description).toMatch(/illustration|not a real|no image is generated/i);
    }
  });
});

describe('context window', () => {
  const t = contextWindowStrings.en;

  test('adding long documents pushes the instruction out of the window and changes the example reply', async () => {
    const view = await mount(ContextWindowVisual);
    expect(view.text()).toContain(t.behaviours['full-instruction'].note);
    await press(view.renderer, `${t.add.long}, ${t.tokensOf(28)}`);
    await press(view.renderer, `${t.add.long}, ${t.tokensOf(28)}`);
    expect(view.text()).toContain(t.behaviours['lost-instruction'].note);
    expect(view.text()).toContain(t.behaviours['lost-instruction'].reply);
    expect(view.text()).toContain(t.droppedStatus);
    expect(view.text()).toContain(t.illustration);
    await act(async () => view.renderer.unmount());
  });

  test('a reminder brings the instruction back, and Back and Reset undo', async () => {
    const view = await mount(ContextWindowVisual);
    await press(view.renderer, `${t.add.long}, ${t.tokensOf(28)}`);
    await press(view.renderer, `${t.add.long}, ${t.tokensOf(28)}`);
    await press(view.renderer, `${t.add.reminder}, ${t.tokensOf(12)}`);
    expect(view.text()).toContain(t.behaviours.reminded.note);
    await press(view.renderer, t.back);
    expect(view.text()).toContain(t.behaviours['lost-instruction'].note);
    await press(view.renderer, t.reset);
    expect(view.text()).toContain(t.behaviours['full-instruction'].note);
    expect(view.text()).toContain(t.messagesLabel(1));
    await act(async () => view.renderer.unmount());
  });

  test('a bigger window keeps the instruction', async () => {
    const view = await mount(ContextWindowVisual);
    await press(view.renderer, `${t.add.long}, ${t.tokensOf(28)}`);
    await press(view.renderer, `${t.add.long}, ${t.tokensOf(28)}`);
    expect(view.text()).toContain(t.behaviours['lost-instruction'].note);
    // The window size control is an adjustable with an increment action.
    const [adjust] = labelled(view.renderer, t.windowLabel);
    let fiber = adjust.unstable_fiber as Fiber | null;
    while (fiber && typeof fiber.memoizedProps?.onAccessibilityAction !== 'function') fiber = fiber.return;
    for (let step = 0; step < 3; step += 1) {
      await act(async () => {
        (fiber?.memoizedProps?.onAccessibilityAction as (event: { nativeEvent: { actionName: string } }) => void)({ nativeEvent: { actionName: 'increment' } });
      });
    }
    expect(view.text()).toContain(t.behaviours['full-instruction'].note);
    await act(async () => view.renderer.unmount());
  });

  test('the compact variant still says it is an illustration', async () => {
    const view = await mount(ContextWindowVisual, true);
    expect(view.text()).toContain(t.illustration);
    expect(view.text()).not.toContain(t.ideaTitle);
    await act(async () => view.renderer.unmount());
  });
});

describe('prompt anatomy', () => {
  const t = promptAnatomyStrings.en;

  test('starts vague with only the task, and switching parts on builds the prompt and raises the clarity', async () => {
    const view = await mount(PromptAnatomyVisual);
    expect(view.text()).toContain(t.parts.task.text);
    expect(view.text()).toContain(t.levelCaption(t.levels.vague, 1, 6));
    expect(view.text()).toContain(t.answers.base['000']);
    for (const id of ['role', 'context', 'format', 'constraints', 'example'] as const) await call(view.renderer, t.toggleLabel(t.parts[id].label), 'onValueChange', true);
    expect(view.text()).toContain(t.levelCaption(t.levels.strong, 6, 6));
    expect(view.text()).toContain(t.answers.base['111']);
    expect(view.text()).toContain(t.answers.role);
    expect(view.text()).toContain(t.answers.label);
    await act(async () => view.renderer.unmount());
  });

  test('turning the task off says there is nothing to do, and Reset starts again', async () => {
    const view = await mount(PromptAnatomyVisual);
    await call(view.renderer, t.toggleLabel(t.parts.task.label), 'onValueChange', false);
    expect(view.text()).toContain(t.promptEmpty);
    expect(view.text()).toContain(t.answers.base['no-task']);
    await press(view.renderer, t.reset);
    expect(view.text()).toContain(t.levelCaption(t.levels.vague, 1, 6));
    await act(async () => view.renderer.unmount());
  });
});

describe('image prompt builder', () => {
  const t = imagePromptStrings.en;

  test('says no image is generated and labels the sketch', async () => {
    const view = await mount(ImagePromptBuilderVisual);
    expect(view.text()).toContain(t.noImage);
    expect(view.text()).toContain(t.sketchTitle);
    expect(view.text()).toContain(t.sketchNote);
    await act(async () => view.renderer.unmount());
  });

  test('choosing options builds the prompt, and a photo that is also a watercolor is flagged as a contradiction', async () => {
    const view = await mount(ImagePromptBuilderVisual);
    await press(view.renderer, t.options.composition.closeup);
    await press(view.renderer, t.options.light.golden);
    await press(view.renderer, t.options.avoid.text);
    expect(view.text()).toContain('close-up shot');
    expect(view.text()).toContain('Avoid text and logos.');
    expect(view.text()).toContain('Specific');
    expect(view.text()).not.toContain(t.contradictionTitle);
    await press(view.renderer, t.options.style.watercolor);
    expect(view.text()).toContain(t.contradictionTitle);
    expect(view.text()).toContain(t.contradiction.style(t.options.style.photo, t.options.style.watercolor));
    await act(async () => view.renderer.unmount());
  });

  test('Clear all empties the prompt', async () => {
    const view = await mount(ImagePromptBuilderVisual);
    await press(view.renderer, t.clear);
    expect(view.text()).toContain(t.promptEmpty);
    expect(view.text()).toContain(t.levels.empty);
    await act(async () => view.renderer.unmount());
  });
});

describe('agent loop', () => {
  const t = agentLoopStrings.en;

  test('steps from the goal, and says it is an illustration', async () => {
    const view = await mount(AgentLoopVisual);
    expect(view.text()).toContain(t.script.goal.caption);
    expect(view.text()).toContain(t.illustration);
    await press(view.renderer, 'Next');
    expect(view.text()).toContain(t.script.plan.caption);
    await act(async () => view.renderer.unmount());
  });

  test('with the approval step, a person rejects the wrong amount before any refund runs', async () => {
    const view = await mount(AgentLoopVisual);
    // goal, plan, lookup, seen, policy, seen, decide -> waiting for approval
    for (let step = 0; step < 7; step += 1) await press(view.renderer, 'Next');
    expect(view.text()).toContain(t.script.waiting.caption);
    expect(view.text()).toContain(t.pending);
    expect(view.text()).toContain(t.counters.refunded(0));
    await press(view.renderer, 'Next');
    expect(view.text()).toContain(t.script.rejected.caption);
    expect(view.text()).toContain(t.approval.rejected);
    await act(async () => view.renderer.unmount());
  });

  test('without the approval step the same slip pays out the wrong amount and the risk is shown', async () => {
    const view = await mount(AgentLoopVisual);
    await call(view.renderer, t.gateLabel, 'onValueChange', false);
    expect(labelled(view.renderer, 'Next').length).toBeGreaterThan(0);
    await press(view.renderer, 'Skip to end');
    expect(view.text()).toContain(t.script.unguardedFinish.caption);
    expect(view.text()).toContain(t.riskTitle);
    expect(view.text()).toContain(t.counters.refunded(8500));
    await act(async () => view.renderer.unmount());
  });

  test('with the approval step the run ends safely with the right amount', async () => {
    const view = await mount(AgentLoopVisual);
    await press(view.renderer, 'Skip to end');
    expect(view.text()).toContain(t.script.finish.caption);
    expect(view.text()).toContain(t.safeTitle);
    expect(view.text()).toContain(t.counters.refunded(850));
    await act(async () => view.renderer.unmount());
  });
});
